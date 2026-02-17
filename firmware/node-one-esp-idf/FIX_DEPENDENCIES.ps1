# Fix ESP-IDF Component Dependencies
# Run this from the Node One project directory

Write-Host "Fixing ESP-IDF component dependencies..." -ForegroundColor Cyan
Write-Host ""

# Add esp_lvgl_port component
Write-Host "Adding esp_lvgl_port component..." -ForegroundColor Yellow
idf.py add-dependency "espressif/esp_lvgl_port^2"

Write-Host ""
Write-Host "Verifying other components..." -ForegroundColor Yellow

# Verify all components are added
$components = @(
    "espressif/esp_lcd_axs15231b^2.0.2",
    "espressif/esp_codec_dev~1.4.0",
    "espressif/esp_lvgl_port^2",
    "lvgl/lvgl>=9,<10",
    "espressif/esp_lcd_touch^1",
    "esp-idf-lib/mcp23x17^1.1.9",
    "jgromes/radiolib^7.2.1"
)

foreach ($comp in $components) {
    Write-Host "   Checking: $comp" -ForegroundColor Gray
    idf.py add-dependency $comp
}

Write-Host ""
Write-Host "[OK] Dependencies updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Run 'idf.py reconfigure'" -ForegroundColor Yellow
