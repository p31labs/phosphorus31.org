# Flash Phenix Navigator v4.0 to COM6
Write-Host "🔺 PHENIX NAVIGATOR FLASH UTILITY v1.0" -ForegroundColor Cyan
Write-Host "========================================="

# Configuration
$COM_PORT = "COM6"
$FIRMWARE_DIR = "c:\MASTER_PROJECT\67\release_final\firmware\OpusPhenix\OpusPhenix\build"

# Check required files
Write-Host "Checking firmware files..." -ForegroundColor Yellow

$bootloader = Join-Path $FIRMWARE_DIR "bootloader\bootloader.bin"
$partition_table = Join-Path $FIRMWARE_DIR "partition_table\partition-table.bin"
$application = Join-Path $FIRMWARE_DIR "OpusPhenix.bin"

# Find main application .bin if not at exact path
if (-not (Test-Path $application)) {
    Write-Host "  Searching for main application .bin file..." -ForegroundColor Yellow
    $binFiles = Get-ChildItem $FIRMWARE_DIR -Filter "*.bin" -Recurse | Where-Object { $_.Name -ne "bootloader.bin" -and $_.Name -ne "partition-table.bin" }
    if ($binFiles.Count -gt 0) {
        $application = $binFiles[0].FullName
        Write-Host "  Found: $($binFiles[0].Name)" -ForegroundColor Green
    }
}

# Verify all files exist
$files = @(
    @{Name="Bootloader"; Path=$bootloader}
    @{Name="Partition Table"; Path=$partition_table}
    @{Name="Application"; Path=$application}
)

$allExist = $true
foreach ($file in $files) {
    if (Test-Path $file.Path) {
        Write-Host "  ✓ $($file.Name): $(Split-Path $file.Path -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($file.Name): NOT FOUND at $($file.Path)" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host "`n[ERROR] Missing firmware files!" -ForegroundColor Red
    Write-Host "Check that the build completed successfully." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[1/3] Checking ESP device on $COM_PORT..." -ForegroundColor Yellow

# Check if device is accessible
try {
    $chipInfo = python -m esptool --port $COM_PORT chip_id 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ ESP32 detected on $COM_PORT" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ ESP32 not responding. Entering boot mode..." -ForegroundColor Yellow
        Write-Host "`nHARDWARE PREPARATION:" -ForegroundColor Cyan
        Write-Host "  1. Hold BOOT button on Navigator" -ForegroundColor White
        Write-Host "  2. Press RST button while holding BOOT" -ForegroundColor White
        Write-Host "  3. Release RST, then release BOOT" -ForegroundColor White
        Write-Host "  4. Press Enter to continue..." -ForegroundColor Yellow
        Read-Host
    }
} catch {
    Write-Host "  ⚠ Could not check chip ID. Continuing..." -ForegroundColor Yellow
}

Write-Host "`n[2/3] Flashing firmware..." -ForegroundColor Yellow

# Flash command
$flashCmd = @"
python -m esptool --port $COM_PORT --chip esp32s3 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size 16MB `
0x1000 "$bootloader" `
0x8000 "$partition_table" `
0x10000 "$application"
"@

Write-Host "Executing: $flashCmd" -ForegroundColor Gray

# Execute flash command
try {
    Invoke-Expression $flashCmd
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[3/3] ✓ FLASH COMPLETE!" -ForegroundColor Green
        Write-Host "=========================================" -ForegroundColor Cyan
        Write-Host "Expected boot sequence:" -ForegroundColor White
        Write-Host "  1. PMIC: Energizing display rails (ALDO1: 3.3V)" -ForegroundColor Gray
        Write-Host "  2. QSPI: AXS15231B Handshake Verified" -ForegroundColor Gray
        Write-Host "  3. NEURAL SHIELD: Fisher Firewall Active on Core 1" -ForegroundColor Gray
        Write-Host "  4. SPROUT: C-Invariant: 1.000 [ISOSTATIC]" -ForegroundColor Gray
        Write-Host "`nVisual indicators:" -ForegroundColor White
        Write-Host "  • Screen clears from static to black" -ForegroundColor Gray
        Write-Host "  • Backlight activates" -ForegroundColor Gray
        Write-Host "  • Tetrahedron Sprout logo (Cyan #00f2ff)" -ForegroundColor Gray
        
        Write-Host "`nPress Enter to exit..." -ForegroundColor Yellow
        Read-Host
    } else {
        Write-Host "`n[ERROR] Flash failed! Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n[ERROR] Flash command failed: $_" -ForegroundColor Red
    exit 1
}