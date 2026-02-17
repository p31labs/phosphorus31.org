# Node One - Build and Bench Test Script
# P31 Ecosystem - Complete Build Verification

Write-Host "P31 NODE ONE - BUILD & BENCH TEST" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# STEP 1: Environment Check
# ============================================================================
Write-Host "STEP 1: Environment Check" -ForegroundColor Yellow
Write-Host ""

if (-not (Get-Command idf.py -ErrorAction SilentlyContinue)) {
    Write-Host "[FAIL] ESP-IDF not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "   To set up ESP-IDF:" -ForegroundColor Yellow
    Write-Host "   1. Install ESP-IDF v5.4+ (see CHECK_ESP_IDF.ps1)" -ForegroundColor Gray
    Write-Host '   2. Source ESP-IDF: & $env:USERPROFILE\esp\esp-idf\export.ps1' -ForegroundColor Gray
    Write-Host "   3. Re-run this script" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "[OK] ESP-IDF found" -ForegroundColor Green
$idfVersion = idf.py --version 2>&1
Write-Host "   Version: $idfVersion" -ForegroundColor Gray
Write-Host ""

# Check target
Write-Host "Target: ESP32-S3" -ForegroundColor Cyan
idf.py set-target esp32s3
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Failed to set target" -ForegroundColor Red
    exit 1
}
Write-Host ""

# ============================================================================
# STEP 2: Project Structure Verification
# ============================================================================
Write-Host "STEP 2: Project Structure Verification" -ForegroundColor Yellow
Write-Host ""

$requiredFiles = @(
    "CMakeLists.txt",
    "sdkconfig.defaults",
    "main\CMakeLists.txt",
    "main\main.cpp",
    "main\pin_map.h",
    "main\node_one_config.h",
    "components\bsp\bsp.c",
    "components\audio_engine\audio_engine.c",
    "components\lora_radio\lora_radio.cpp",
    "components\button_input\button_input.c",
    "components\display\display.c",
    "components\shield_server\shield_server.c"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
        Write-Host "[FAIL] Missing: $file" -ForegroundColor Red
    } else {
        Write-Host "[OK] Found: $file" -ForegroundColor Green
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "[FAIL] Missing required files. Cannot build." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] All required files present" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 3: Clean Build
# ============================================================================
Write-Host "STEP 3: Clean Build" -ForegroundColor Yellow
Write-Host ""

Write-Host "Cleaning previous build..." -ForegroundColor Cyan
idf.py fullclean
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Clean failed (may not exist)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Building firmware..." -ForegroundColor Cyan
Write-Host "   This may take 5-10 minutes..." -ForegroundColor Gray
Write-Host ""

$buildStart = Get-Date
idf.py build
$buildEnd = Get-Date
$buildTime = ($buildEnd - $buildStart).TotalSeconds

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[FAIL] Build failed!" -ForegroundColor Red
    Write-Host "   Check errors above" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "[OK] Build successful!" -ForegroundColor Green
Write-Host "   Build time: $([math]::Round($buildTime, 1)) seconds" -ForegroundColor Gray
Write-Host ""

# Check build artifacts
$binFile = "build\node-one.bin"
if (Test-Path $binFile) {
    $binSize = (Get-Item $binFile).Length / 1MB
    Write-Host "   Binary size: $([math]::Round($binSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "[WARN] Binary file not found" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 4: Hardware Detection
# ============================================================================
Write-Host "STEP 4: Hardware Detection" -ForegroundColor Yellow
Write-Host ""

Write-Host "Detecting COM ports..." -ForegroundColor Cyan
$ports = Get-WmiObject Win32_SerialPort | Where-Object { 
    $_.Description -like "*USB*" -or 
    $_.Description -like "*Serial*" -or
    $_.Description -like "*CH340*" -or
    $_.Description -like "*CP210*" -or
    $_.Description -like "*FTDI*"
} | Select-Object DeviceID, Description

if ($ports) {
    Write-Host "   Available ports:" -ForegroundColor Yellow
    foreach ($port in $ports) {
        Write-Host "   [OK] $($port.DeviceID): $($port.Description)" -ForegroundColor Green
    }
    $selectedPort = $ports[0].DeviceID
    Write-Host ""
    Write-Host "   Using: $selectedPort" -ForegroundColor Cyan
} else {
    Write-Host "   [WARN] No COM ports detected" -ForegroundColor Yellow
    Write-Host "   Connect ESP32-S3 board via USB" -ForegroundColor Yellow
    $selectedPort = $null
}
Write-Host ""

# ============================================================================
# STEP 5: Flash (Optional)
# ============================================================================
if ($selectedPort) {
    $flash = Read-Host "Flash firmware to board? (Y/n)"
    if ($flash -ne "n" -and $flash -ne "N") {
        Write-Host ""
        Write-Host "Flashing firmware..." -ForegroundColor Cyan
        Write-Host "   Port: $selectedPort" -ForegroundColor Gray
        Write-Host "   Hold BOOT button if flash fails" -ForegroundColor Yellow
        Write-Host ""
        
        idf.py flash -p $selectedPort
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "[FAIL] Flash failed" -ForegroundColor Red
            Write-Host "   Try:" -ForegroundColor Yellow
            Write-Host "   - Hold BOOT button, press RESET, release BOOT" -ForegroundColor Gray
            Write-Host "   - Check USB cable" -ForegroundColor Gray
            Write-Host "   - Try different USB port" -ForegroundColor Gray
        } else {
            Write-Host ""
            Write-Host "[OK] Flash successful!" -ForegroundColor Green
        }
        Write-Host ""
    }
} else {
    Write-Host "Skipping flash (no COM port detected)" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================================================
# STEP 6: Bench Test Checklist
# ============================================================================
Write-Host "STEP 6: Bench Test Checklist" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run these tests with hardware connected:" -ForegroundColor Cyan
Write-Host ""

$testChecklist = @(
    @{Test="Boot Sequence"; Check="Device boots, shows splash screen"},
    @{Test="Display"; Check="Status bar visible, battery % shown"},
    @{Test="I2C Bus"; Check="All sensors respond (AXP2101, ES8311, MCP23017)"},
    @{Test="Audio Engine"; Check="ES8311 initializes, I2S works"},
    @{Test="LoRa Radio"; Check="E22-900M30S initializes, TX/RX works"},
    @{Test="Button Input"; Check="MCP23017 buttons register presses"},
    @{Test="WiFi AP"; Check="'P31-NodeOne' AP visible on phone"},
    @{Test="HTTP Server"; Check="http://192.168.4.1 serves web app"},
    @{Test="WebSocket"; Check="Real-time events work in browser"},
    @{Test="Battery Monitor"; Check="Voltage/percentage accurate"},
    @{Test="Backlight"; Check="PWM brightness control works"},
    @{Test="Power Management"; Check="AXP2101 rails configured correctly"}
)

foreach ($test in $testChecklist) {
    Write-Host "   [ ] $($test.Test)" -ForegroundColor Gray
    Write-Host "       -> $($test.Check)" -ForegroundColor DarkGray
}

Write-Host ""

# ============================================================================
# STEP 7: Serial Monitor (Optional)
# ============================================================================
if ($selectedPort) {
    $monitor = Read-Host "Open serial monitor for testing? (Y/n)"
    if ($monitor -ne "n" -and $monitor -ne "N") {
        Write-Host ""
        Write-Host "Opening serial monitor..." -ForegroundColor Cyan
        Write-Host "   Port: $selectedPort" -ForegroundColor Gray
        Write-Host "   Press Ctrl+] to exit" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Expected boot sequence:" -ForegroundColor Cyan
        Write-Host "   - I2C bus init" -ForegroundColor Gray
        Write-Host "   - AXP2101 power init" -ForegroundColor Gray
        Write-Host "   - Display init (splash)" -ForegroundColor Gray
        Write-Host "   - Audio engine init" -ForegroundColor Gray
        Write-Host "   - LoRa radio init" -ForegroundColor Gray
        Write-Host "   - Button input init" -ForegroundColor Gray
        Write-Host "   - WiFi AP start" -ForegroundColor Gray
        Write-Host "   - HTTP server start" -ForegroundColor Gray
        Write-Host ""
        
        idf.py monitor -p $selectedPort
    }
}

Write-Host ""
Write-Host "The Mesh Holds." -ForegroundColor Cyan
Write-Host ""
