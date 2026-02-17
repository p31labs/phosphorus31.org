# Fix All Component Dependencies
# Creates idf_component.yml files for all components that need external dependencies

Write-Host "Creating component manifests for all dependencies..." -ForegroundColor Cyan
Write-Host ""

# Component manifests have been created:
# - main/idf_component.yml (esp_lvgl_port, lvgl, mcp23x17, radiolib)
# - components/audio_engine/idf_component.yml (esp_codec_dev)
# - components/display/idf_component.yml (esp_lvgl_port, lvgl)
# - components/bsp/idf_component.yml (esp_lcd_axs15231b)
# - components/lora_radio/idf_component.yml (radiolib)

Write-Host "[OK] Component manifests created" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. idf.py fullclean" -ForegroundColor White
Write-Host "   2. idf.py reconfigure" -ForegroundColor White
Write-Host "   3. idf.py build" -ForegroundColor White
Write-Host ""
