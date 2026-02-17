# Quick script to navigate from ESP-IDF directory to Node One project
# Run this from: C:\Espressif\frameworks\esp-idf-v5.5.1

Write-Host "Navigating to Node One project..." -ForegroundColor Cyan

$projectPath = "c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf"

if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "[OK] Now in: $projectPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "   1. idf.py set-target esp32s3" -ForegroundColor White
    Write-Host "   2. idf.py reconfigure" -ForegroundColor White
    Write-Host "   3. idf.py build" -ForegroundColor White
    Write-Host "   4. idf.py flash -p COM11" -ForegroundColor White
    Write-Host "   5. idf.py monitor -p COM11" -ForegroundColor White
} else {
    Write-Host "[FAIL] Project path not found: $projectPath" -ForegroundColor Red
}
