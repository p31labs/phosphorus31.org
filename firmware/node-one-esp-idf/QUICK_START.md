# Node One - Quick Start Guide

## Windows PowerShell Setup

### Step 1: Verify ESP-IDF Installation

```powershell
# Check ESP-IDF installation
if (Test-Path "$env:USERPROFILE\esp\esp-idf") {
    & "$env:USERPROFILE\esp\esp-idf\export.ps1"
    idf.py --version
    # MUST show v5.4.0 or higher
} else {
    Write-Host "ESP-IDF not found. Install from: https://docs.espressif.com/projects/esp-idf/"
}
```

### Step 2: Navigate to Project

```powershell
cd "C:\Users\sandra\Downloads\phenix-navigator-creator67\firmware\node-one-esp-idf"
```

### Step 3: Build and Flash

```powershell
# First time: configure and download components
idf.py reconfigure

# Build the project
idf.py build

# Flash to ESP32-S3 (connect via USB)
idf.py flash

# Monitor serial output
idf.py monitor
```

## Reference Materials

The Waveshare demo code is already available at:
```
C:\Users\sandra\Downloads\phenix-navigator-creator67\ESP32-S3-Touch-LCD-3.5-Demo\
```

Key files for pin reference:
- `ESP-IDF\01_factory\components\esp_port\esp_3inch5_lcd_port.cpp` - Display pins
- `ESP-IDF\01_factory\components\esp_port\esp_es8311_port.cpp` - I2S audio pins
- `ESP-IDF\01_factory\components\esp_port\esp_sdcard_port.cpp` - SD card pins
- `ESP-IDF\01_factory\components\esp_port\esp_camera_port.cpp` - Camera pins (used for LoRa)

## Pin Configuration Status

✅ **Verified from demo code:**
- I2C: GPIO8 (SDA), GPIO7 (SCL)
- I2S Audio: GPIO12-16 (MCLK, BCLK, LRCK, DOUT, DIN)
- SD Card: GPIO9-11 (D0, CMD, CLK)
- Camera: GPIO38-48, GPIO21, GPIO41 (repurposed for LoRa)

⚠️ **Display Interface Note:**
- Demo code shows **SPI** interface (GPIO1, GPIO5, GPIO3, GPIO6)
- Blueprint mentions **QSPI** interface (GPIO12, GPIO5, GPIO1-4)
- The `espressif/esp_lcd_axs15231b` component may use QSPI
- Pin configuration may need adjustment based on component requirements

## Component Dependencies

All components are listed in `idf_component.yml` and will auto-download:

- `espressif/esp_lcd_axs15231b` ^2.0.2 - Display driver
- `espressif/esp_codec_dev` ~1.4.0 - Audio codec  
- `espressif/esp_lvgl_port` ^2 - LVGL integration
- `lvgl/lvgl` >=9,<10 - GUI framework
- `esp-idf-lib/mcp23x17` ^1.1.9 - MCP23017 driver
- `jgromes/radiolib` ^7.2.1 - LoRa driver

## Next Steps After Build

1. **Complete RadioLib Integration** - See `INTEGRATION_NOTES.md`
2. **Initialize Display** - Add AXS15231B init code
3. **Initialize Audio** - Add ES8311 init code
4. **Test LoRa** - Verify E22-900M30S communication
5. **Test MCP23017** - Verify button inputs

## Troubleshooting

**ESP-IDF not found:**
```powershell
cd $env:USERPROFILE\esp
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
.\install.ps1 esp32s3
.\export.ps1
```

**Component download fails:**
- Check internet connection
- Run `idf.py reconfigure` again
- Verify `idf_component.yml` syntax

**Build errors:**
- Ensure ESP-IDF v5.4.0+
- Run `idf.py fullclean` then rebuild
- Check `sdkconfig.defaults`

**Flash fails:**
- Check USB connection
- Specify port: `idf.py flash -p COM3`
- Hold BOOT button during flash if needed

---

**The Mesh Holds.** 🔺
