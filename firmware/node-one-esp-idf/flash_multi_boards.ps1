# ============================================================
# P31 NODE ONE - MULTI-BOARD FLASH UTILITY
#    Flash multiple Node One boards on different COM ports
#    G.O.D. Protocol Compliant - No Backdoors
# ============================================================

param(
    [string[]]$Ports = @(),
    [switch]$Parallel = $false,
    [switch]$Build = $false,
    [switch]$Monitor = $false,
    [string]$FirmwareDir = "."
)

$ErrorActionPreference = "Stop"
$script:SuccessCount = 0
$script:FailCount = 0
$script:Results = @()

function Write-Header {
    param([string]$Text)
    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
}

function Get-AvailablePorts {
    Write-Host "`n[SCAN] Detecting available COM ports..." -ForegroundColor Yellow
    
    $ports = @()
    
    # Get COM ports from WMI
    try {
        $comPorts = Get-WmiObject -Class Win32_SerialPort | Where-Object { 
            $_.DeviceID -match "^COM\d+$" 
        } | Sort-Object { [int]($_.DeviceID -replace 'COM', '') }
        
        foreach ($port in $comPorts) {
            $portInfo = @{
                Port = $port.DeviceID
                Description = $port.Description
                PNPDeviceID = $port.PNPDeviceID
            }
            $ports += $portInfo
        }
    } catch {
        Write-Host "  [WARN] Could not query WMI, trying alternative method..." -ForegroundColor Yellow
        # Fallback: try to detect ports by attempting to open them
        for ($i = 1; $i -le 20; $i++) {
            $portName = "COM$i"
            try {
                $port = New-Object System.IO.Ports.SerialPort($portName)
                $port.Open()
                $port.Close()
                $ports += @{ Port = $portName; Description = "Detected"; PNPDeviceID = "" }
            } catch {
                # Port doesn't exist or is in use
            }
        }
    }
    
    return $ports
}

function Test-ESPDevice {
    param([string]$Port)
    
    try {
        # Try to get chip ID using esptool
        $result = python -m esptool --port $Port chip_id 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
    } catch {
        # Device not responding or not an ESP32
    }
    return $false
}

function Flash-Board {
    param(
        [string]$Port,
        [string]$FirmwarePath
    )
    
    $portName = $Port
    Write-Host "`n[FLASH] Starting flash to $portName..." -ForegroundColor Yellow
    
    # Check if device is accessible
    if (-not (Test-ESPDevice -Port $portName)) {
        Write-Host "  [WARN] ESP32 not detected on $portName" -ForegroundColor Yellow
        Write-Host "     Entering boot mode..." -ForegroundColor Gray
        Write-Host "     1. Hold BOOT button" -ForegroundColor Gray
        Write-Host "     2. Press RST while holding BOOT" -ForegroundColor Gray
        Write-Host "     3. Release RST, then release BOOT" -ForegroundColor Gray
        Write-Host "     Waiting 3 seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
    
    # Change to firmware directory
    Push-Location $FirmwarePath
    
    try {
        # Flash using idf.py
        Write-Host "  -> Flashing firmware..." -ForegroundColor Gray
        $flashOutput = idf.py -p $portName flash 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Flash complete on $portName" -ForegroundColor Green
            $script:SuccessCount++
            return @{ Port = $portName; Status = "Success"; Error = $null }
        } else {
            Write-Host "  [FAIL] Flash failed on $portName (exit code: $LASTEXITCODE)" -ForegroundColor Red
            $script:FailCount++
            return @{ Port = $portName; Status = "Failed"; Error = "Exit code: $LASTEXITCODE" }
        }
    } catch {
        Write-Host "  [FAIL] Flash error on $portName: $_" -ForegroundColor Red
        $script:FailCount++
        return @{ Port = $portName; Status = "Failed"; Error = $_.ToString() }
    } finally {
        Pop-Location
    }
}

function Monitor-Board {
    param(
        [string]$Port,
        [string]$FirmwarePath
    )
    
    Push-Location $FirmwarePath
    try {
        Write-Host "`n[MONITOR] Starting monitor on $Port..." -ForegroundColor Yellow
        Write-Host "  Press Ctrl+] to exit monitor" -ForegroundColor Gray
        idf.py -p $Port monitor
    } finally {
        Pop-Location
    }
}

# ============================================================
# MAIN EXECUTION
# ============================================================

Write-Header "P31 NODE ONE - MULTI-BOARD FLASH"

# Check ESP-IDF
Write-Host "`n[CHECK] Verifying ESP-IDF..." -ForegroundColor Yellow
try {
    $idfVersion = idf.py --version 2>&1
    Write-Host "  [OK] ESP-IDF detected" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] ESP-IDF not found in PATH!" -ForegroundColor Red
    Write-Host "     Please run: `$env:IDF_PATH\export.ps1" -ForegroundColor Yellow
    exit 1
}

# Get firmware directory (absolute path)
$firmwareDir = Resolve-Path $FirmwareDir
Write-Host "  [OK] Firmware directory: $firmwareDir" -ForegroundColor Green

# Build if requested
if ($Build) {
    Write-Header "BUILDING FIRMWARE"
    Push-Location $firmwareDir
    try {
        Write-Host "`n[BUILD] Building firmware..." -ForegroundColor Yellow
        idf.py build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [FAIL] Build failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "  [OK] Build complete" -ForegroundColor Green
    } finally {
        Pop-Location
    }
}

# Detect available ports
Write-Header "PORT DETECTION"
$availablePorts = Get-AvailablePorts

if ($availablePorts.Count -eq 0) {
    Write-Host "  [FAIL] No COM ports detected!" -ForegroundColor Red
    exit 1
}

Write-Host "`nAvailable COM ports:" -ForegroundColor White
for ($i = 0; $i -lt $availablePorts.Count; $i++) {
    $port = $availablePorts[$i]
    Write-Host "  [$i] $($port.Port) - $($port.Description)" -ForegroundColor Gray
}

# Select ports
if ($Ports.Count -eq 0) {
    Write-Host "`n[SELECT] Enter port numbers to flash (comma-separated, e.g., 0,1,2):" -ForegroundColor Yellow
    Write-Host "         Or enter port names directly (e.g., COM5,COM6):" -ForegroundColor Gray
    $input = Read-Host "Ports"
    
    if ($input -match "^[\d,]+$") {
        # Numbers provided
        $indices = $input -split ',' | ForEach-Object { [int]$_.Trim() }
        $Ports = $indices | ForEach-Object { 
            if ($_ -ge 0 -and $_ -lt $availablePorts.Count) {
                $availablePorts[$_].Port
            }
        }
    } else {
        # Port names provided
        $Ports = $input -split ',' | ForEach-Object { $_.Trim() }
    }
}

if ($Ports.Count -eq 0) {
    Write-Host "  [FAIL] No ports selected!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[CONFIG] Selected ports: $($Ports -join ', ')" -ForegroundColor Cyan

# Confirm
Write-Host "`nReady to flash $($Ports.Count) board(s)?" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Flash cancelled." -ForegroundColor Yellow
    exit 0
}

# Flash boards
Write-Header "FLASHING BOARDS"

if ($Parallel -and $Ports.Count -gt 1) {
    Write-Host "`n[FLASH] Flashing in parallel mode..." -ForegroundColor Yellow
    $jobs = @()
    
    foreach ($port in $Ports) {
        $job = Start-Job -ScriptBlock ${function:Flash-Board} -ArgumentList $port, $firmwareDir
        $jobs += $job
    }
    
    # Wait for all jobs and collect results
    $jobs | Wait-Job | Out-Null
    $jobs | ForEach-Object {
        $result = Receive-Job $_
        $script:Results += $result
        Remove-Job $_
    }
} else {
    Write-Host "`n[FLASH] Flashing in sequential mode..." -ForegroundColor Yellow
    foreach ($port in $Ports) {
        $result = Flash-Board -Port $port -FirmwarePath $firmwareDir
        $script:Results += $result
    }
}

# Summary
Write-Header "FLASH SUMMARY"
Write-Host "`nResults:" -ForegroundColor White
foreach ($result in $script:Results) {
    $color = if ($result.Status -eq "Success") { "Green" } else { "Red" }
    Write-Host "  $($result.Port): $($result.Status)" -ForegroundColor $color
    if ($result.Error) {
        Write-Host "    Error: $($result.Error)" -ForegroundColor Red
    }
}

Write-Host "`nTotal: $($script:SuccessCount) success, $($script:FailCount) failed" -ForegroundColor $(if ($script:FailCount -eq 0) { "Green" } else { "Yellow" })

# Monitor if requested
if ($Monitor -and $script:SuccessCount -gt 0) {
    Write-Host "`n[MONITOR] Starting serial monitor..." -ForegroundColor Yellow
    if ($Ports.Count -eq 1) {
        Monitor-Board -Port $Ports[0] -FirmwarePath $firmwareDir
    } else {
        Write-Host "  Multiple boards flashed. Select port to monitor:" -ForegroundColor Yellow
        for ($i = 0; $i -lt $Ports.Count; $i++) {
            Write-Host "    [$i] $($Ports[$i])" -ForegroundColor Gray
        }
        $monitorIndex = Read-Host "Port index"
        if ($monitorIndex -match "^\d+$" -and [int]$monitorIndex -lt $Ports.Count) {
            Monitor-Board -Port $Ports[[int]$monitorIndex] -FirmwarePath $firmwareDir
        }
    }
}

Write-Host "`nThe Mesh Holds." -ForegroundColor Cyan
Write-Host "`nPress Enter to exit..." -ForegroundColor Gray
Read-Host | Out-Null
