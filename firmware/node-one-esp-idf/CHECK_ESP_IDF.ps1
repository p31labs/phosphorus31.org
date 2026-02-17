# ESP-IDF Version Check Script
# Node One Firmware - ESP-IDF Detection

Write-Host "Checking for ESP-IDF installation..." -ForegroundColor Cyan
Write-Host ""

# Check if idf.py is in PATH
if (Get-Command idf.py -ErrorAction SilentlyContinue) {
    Write-Host "[OK] ESP-IDF found in PATH" -ForegroundColor Green
    idf.py --version
    Write-Host ""
    Write-Host "ESP-IDF Path: $env:IDF_PATH" -ForegroundColor Gray
    exit 0
}

Write-Host "[WARN] ESP-IDF not in PATH" -ForegroundColor Yellow
Write-Host ""

# Check common installation locations
$commonPaths = @(
    "$env:USERPROFILE\esp\esp-idf",
    "C:\Espressif\frameworks\esp-idf-v5.4",
    "C:\Espressif\frameworks\esp-idf-v5.3",
    "C:\esp\esp-idf",
    "C:\Espressif\frameworks\esp-idf"
)

Write-Host "Checking common installation locations..." -ForegroundColor Cyan
$found = $false

foreach ($path in $commonPaths) {
    if (Test-Path "$path\export.ps1") {
        Write-Host "[OK] Found ESP-IDF at: $path" -ForegroundColor Green
        Write-Host ""
        Write-Host "To use this installation, run:" -ForegroundColor Yellow
        Write-Host "   & `"$path\export.ps1`"" -ForegroundColor White
        Write-Host ""
        Write-Host "Checking version..." -ForegroundColor Cyan
        & "$path\export.ps1"
        idf.py --version
        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host "[FAIL] ESP-IDF not found in common locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "To install ESP-IDF v5.4 (required for Node One):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Option 1: ESP-IDF Installer (Recommended)" -ForegroundColor Cyan
    Write-Host "   Download from: https://dl.espressif.com/dl/esp-idf/" -ForegroundColor Gray
    Write-Host "   Install to: C:\Espressif\frameworks\esp-idf-v5.4" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Option 2: Manual Git Installation" -ForegroundColor Cyan
    Write-Host "   cd `$env:USERPROFILE\esp" -ForegroundColor Gray
    Write-Host "   git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git" -ForegroundColor Gray
    Write-Host "   cd esp-idf" -ForegroundColor Gray
    Write-Host "   .\install.ps1 esp32s3" -ForegroundColor Gray
    Write-Host "   .\export.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Option 3: VS Code Extension" -ForegroundColor Cyan
    Write-Host "   Install 'ESP-IDF' extension in VS Code" -ForegroundColor Gray
    Write-Host "   It will guide you through installation" -ForegroundColor Gray
    Write-Host ""
    Write-Host "[WARN] Node One requires ESP-IDF v5.4.0 or higher" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "The Mesh Holds." -ForegroundColor Cyan
