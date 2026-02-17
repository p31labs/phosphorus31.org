# Node One - Quick Flash Script
# Run this after connecting the ESP32-S3 board via USB
# -NoMonitor: skip serial monitor prompt (for scripts / CI)
# -BuildOnly: build only, do not flash (e.g. when no device connected)

param(
    [switch]$NoMonitor,
    [switch]$BuildOnly
)

Write-Host "P31 NODE ONE - FLASH UTILITY" -ForegroundColor Cyan
Write-Host ""

# Check if ESP-IDF is available
if (-not (Get-Command idf.py -ErrorAction SilentlyContinue)) {
    Write-Host "[FAIL] ESP-IDF not found in PATH" -ForegroundColor Red
    Write-Host "   Source ESP-IDF first:" -ForegroundColor Yellow
    Write-Host '   & $env:USERPROFILE\esp\esp-idf\export.ps1' -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] ESP-IDF found" -ForegroundColor Green
Write-Host ""

# Detect COM port
Write-Host "Detecting COM ports..." -ForegroundColor Cyan
$ports = Get-WmiObject Win32_SerialPort | Where-Object { $_.Description -like "*USB*" -or $_.Description -like "*Serial*" } | Select-Object DeviceID, Description

if ($ports) {
    Write-Host "   Available ports:" -ForegroundColor Yellow
    foreach ($port in $ports) {
        Write-Host "   - $($port.DeviceID): $($port.Description)" -ForegroundColor Gray
    }
    Write-Host ""
    $selectedPort = $ports[0].DeviceID
    Write-Host "   Using: $selectedPort" -ForegroundColor Green
} else {
    Write-Host "   [WARN] No COM ports detected" -ForegroundColor Yellow
    Write-Host "   Will attempt auto-detection during flash" -ForegroundColor Yellow
    $selectedPort = $null
}
Write-Host ""

# Set target
Write-Host "Setting target to ESP32-S3..." -ForegroundColor Cyan
idf.py set-target esp32s3
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Failed to set target" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Build
Write-Host "Building firmware..." -ForegroundColor Cyan
idf.py build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Build successful!" -ForegroundColor Green
Write-Host ""

# Flash (skip if -BuildOnly)
if (-not $BuildOnly) {
    Write-Host "Flashing to board..." -ForegroundColor Cyan
    if ($selectedPort) {
        Write-Host "   Port: $selectedPort" -ForegroundColor Gray
        idf.py flash -p $selectedPort
    } else {
        idf.py flash
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] Flash failed" -ForegroundColor Red
        Write-Host "   Try:" -ForegroundColor Yellow
        Write-Host "   - Hold BOOT button during flash" -ForegroundColor Yellow
        Write-Host "   - Check USB cable connection" -ForegroundColor Yellow
        Write-Host "   - Try different USB port" -ForegroundColor Yellow
        exit 1
    }

    Write-Host "[OK] Flash successful!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[OK] Build only (flash skipped). Use without -BuildOnly to flash." -ForegroundColor Green
    Write-Host ""
}

# Ask about monitor (skip if -NoMonitor or -BuildOnly)
if (-not $NoMonitor -and -not $BuildOnly) {
    $monitor = Read-Host "Open serial monitor? (Y/n)"
} else {
    $monitor = "n"
}
if ($monitor -ne "n" -and $monitor -ne "N") {
    Write-Host ""
    Write-Host "Opening serial monitor..." -ForegroundColor Cyan
    Write-Host "   Press Ctrl+] to exit" -ForegroundColor Yellow
    Write-Host ""
    if ($selectedPort) {
        idf.py monitor -p $selectedPort
    } else {
        idf.py monitor
    }
}

Write-Host ""
Write-Host 'The Mesh Holds.' -ForegroundColor Cyan
