# Node One - Setup Instructions

## Windows Setup (PowerShell)

### 1. Verify ESP-IDF Installation

```powershell
# Check if ESP-IDF is installed
if (Test-Path "$env:USERPROFILE\esp\esp-idf") {
    Write-Host "ESP-IDF found at $env:USERPROFILE\esp\esp-idf"
} else {
    Write-Host "ESP-IDF not found. Please install ESP-IDF v5.4.0 or higher."
    Write-Host "Download from: https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/get-started/"
}

# Source ESP-IDF (adjust path if different)
& "$env:USERPROFILE\esp\esp-idf\export.ps1"

# Verify version (MUST be v5.4.0 or higher)
idf.py --version
```

**If ESP-IDF is not installed or version is too old:**

```powershell
# Install ESP-IDF v5.4
cd $env:USERPROFILE\esp
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
.\install.ps1 esp32s3
.\export.ps1
```

### 2. Project Location

The project is already created at:
```
C:\Users\sandra\Downloads\phenix-navigator-creator67\firmware\node-one-esp-idf
```

Navigate to it:
```powershell
cd "C:\Users\sandra\Downloads\phenix-navigator-creator67\firmware\node-one-esp-idf"
```

### 3. Reference Materials (Already Available)

The Waveshare demo code is already in your workspace:
```
C:\Users\sandra\Downloads\phenix-navigator-creator67\ESP32-S3-Touch-LCD-3.5-Demo\
```

Pin definitions are in:
- `ESP-IDF\01_factory\components\esp_port\esp_3inch5_lcd_port.cpp` (Display pins)
- `ESP-IDF\01_factory\components\esp_port\esp_es8311_port.cpp` (I2S audio pins)
- `ESP-IDF\01_factory\components\esp_port\esp_sdcard_port.cpp` (SD card pins)
- `ESP-IDF\01_factory\components\esp_port\esp_camera_port.cpp` (Camera pins - used for LoRa)

### 4. Build and Flash

```powershell
# Ensure ESP-IDF is sourced
& "$env:USERPROFILE\esp\esp-idf\export.ps1"

# Navigate to project
cd "C:\Users\sandra\Downloads\phenix-navigator-creator67\firmware\node-one-esp-idf"

# Configure project (first time)
idf.py reconfigure

# Build
idf.py build

# Flash (connect ESP32-S3 via USB)
idf.py flash

# Monitor serial output
idf.py monitor
```

### 5. Verify Pin Configuration

The pin configuration in `main/pin_config.h` has been extracted from the Waveshare demo code:

- **I2C**: GPIO8 (SDA), GPIO7 (SCL) ✓
- **QSPI Display**: GPIO12 (CS), GPIO5 (CLK), GPIO1-4 (DATA) ✓
- **I2S Audio**: GPIO12 (MCLK), GPIO13 (BCLK), GPIO15 (LRCK), GPIO16 (DOUT), GPIO14 (DIN) ✓
- **SD Card**: GPIO10 (CMD), GPIO9 (D0), GPIO11 (CLK) ✓
- **LoRa**: Camera pins repurposed (GPIO38-48, GPIO21, GPIO41) ✓

### 6. Component Dependencies

All dependencies are listed in `idf_component.yml` and will be automatically downloaded when you run `idf.py reconfigure`:

- `espressif/esp_lcd_axs15231b` - Display driver
- `espressif/esp_codec_dev` - Audio codec
- `espressif/esp_lvgl_port` - LVGL integration
- `lvgl/lvgl` - GUI framework
- `esp-idf-lib/mcp23x17` - MCP23017 driver
- `jgromes/radiolib` - LoRa driver

### 7. Next Steps

1. **Complete RadioLib Integration**: See `INTEGRATION_NOTES.md` for details
2. **Initialize Display**: Add AXS15231B initialization in `main.cpp`
3. **Initialize Audio**: Add ES8311 initialization in `main.cpp`
4. **Test LoRa**: Verify E22-900M30S communication
5. **Test MCP23017**: Verify button inputs

## Linux/WSL Setup

If you prefer to use WSL or Linux:

```bash
# 1. Verify ESP-IDF
. $HOME/esp/esp-idf/export.sh
idf.py --version

# 2. Navigate to project (if using WSL, mount Windows path)
cd /mnt/c/Users/sandra/Downloads/phenix-navigator-creator67/firmware/node-one-esp-idf

# 3. Build
idf.py reconfigure
idf.py build
idf.py flash
idf.py monitor
```

## Troubleshooting

### ESP-IDF Not Found
- Install ESP-IDF v5.4.0+ from: https://docs.espressif.com/projects/esp-idf/
- Ensure `export.ps1` (Windows) or `export.sh` (Linux) is sourced

### Component Download Fails
- Check internet connection
- Run `idf.py reconfigure` to retry component downloads
- Verify `idf_component.yml` syntax

### Build Errors
- Ensure ESP-IDF version is 5.4.0 or higher
- Run `idf.py fullclean` then `idf.py build`
- Check `sdkconfig.defaults` configuration

### Flash Fails
- Check USB connection
- Verify COM port: `idf.py flash -p COM3` (Windows) or `idf.py flash -p /dev/ttyUSB0` (Linux)
- Hold BOOT button during flash if needed

## Project Structure

```
node-one-esp-idf/
├── CMakeLists.txt          # Root CMake
├── idf_component.yml       # Component dependencies
├── sdkconfig.defaults      # Default config
├── main/
│   ├── CMakeLists.txt      # Main component
│   ├── main.cpp            # Application entry
│   ├── pin_config.h        # GPIO pin definitions
│   ├── lora_driver.*       # LoRa driver (RadioLib)
│   ├── mcp23017_driver.*   # MCP23017 driver
│   └── mesh_protocol.*      # Mesh protocol
├── README.md               # Project overview
├── SETUP.md               # This file
└── INTEGRATION_NOTES.md    # Integration guide
```

---

**The Mesh Holds.** 🔺
