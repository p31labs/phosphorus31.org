# Node One - ESP-IDF Firmware

Complete integration blueprint for Waveshare ESP32-S3-Touch-LCD-3.5B with LoRa mesh, MCP23017 I/O expansion, display, and audio.

## Hardware

- **Board**: Waveshare ESP32-S3-Touch-LCD-3.5B
- **MCU**: ESP32-S3R8 (8 MB octal PSRAM, 16 MB flash)
- **Display**: AXS15231B QSPI (320x480 portrait)
- **Audio**: ES8311 codec via I2S
- **LoRa**: Ebyte E22-900M30S (SX1262, 915 MHz, 30 dBm)
- **I/O Expander**: MCP23017 (16-bit I2C GPIO)
- **Sensors**: AXP2101 PMIC, QMI8658 IMU, PCF85063 RTC

## GPIO Pin Mapping

### I2C Bus (Shared)
- **SDA**: GPIO8
- **SCL**: GPIO7
- **Devices**: AXP2101 (0x34), ES8311 (0x18), QMI8658 (0x6B), PCF85063 (0x51), MCP23017 (0x20), Touch (0x38)

### QSPI Display (AXS15231B)
- **CS**: GPIO12
- **CLK**: GPIO5
- **DATA0-3**: GPIO1-4
- **Backlight**: GPIO6 (LEDC PWM)

### I2S Audio (ES8311)
- **MCLK**: GPIO12
- **BCLK**: GPIO13
- **LRCK**: GPIO15
- **DOUT**: GPIO16
- **DIN**: GPIO14

### SD Card
- **CMD**: GPIO10
- **D0**: GPIO9
- **CLK**: GPIO11

### LoRa Module (E22-900M30S)
- **SCK**: GPIO41 (SPI clock)
- **MOSI**: GPIO42
- **MISO**: GPIO39
- **NSS**: GPIO40
- **BUSY**: GPIO21
- **DIO1**: GPIO38 (IRQ)
- **NRST**: GPIO45
- **TXEN**: GPIO47
- **RXEN**: GPIO48

### MCP23017
- **I2C**: Shared bus (GPIO8/GPIO7)
- **INT**: GPIO46 (or GPIO17/18)

## Build Instructions

### Prerequisites

- ESP-IDF v5.4.0 or higher
- Python 3.8+
- CMake 3.16+

### Setup

```bash
# Set ESP-IDF environment
. $HOME/esp/esp-idf/export.sh

# Navigate to project
cd firmware/node-one-esp-idf

# Install dependencies
idf.py reconfigure

# Build
idf.py build

# Flash
idf.py flash

# Monitor
idf.py monitor
```

## Project Structure

```
node-one-esp-idf/
├── CMakeLists.txt          # Root CMake file
├── idf_component.yml       # Component dependencies
├── sdkconfig.defaults      # Default configuration
├── partitions.csv          # Partition table
├── main/
│   ├── CMakeLists.txt      # Main component CMake
│   ├── main.cpp            # Application entry point
│   ├── pin_config.h        # GPIO pin definitions
│   ├── pin_config.cpp
│   ├── lora_driver.h       # LoRa driver (RadioLib)
│   ├── lora_driver.cpp
│   ├── mcp23017_driver.h   # MCP23017 driver
│   ├── mcp23017_driver.cpp
│   ├── mesh_protocol.h     # Mesh protocol layer
│   └── mesh_protocol.cpp
└── README.md
```

## Dependencies

Managed via ESP Component Registry:

- `espressif/esp_lcd_axs15231b` - Display driver
- `espressif/esp_codec_dev` - Audio codec
- `espressif/esp_lvgl_port` - LVGL integration
- `lvgl/lvgl` - GUI framework
- `esp-idf-lib/mcp23x17` - MCP23017 driver
- `jgromes/radiolib` - SX1262 LoRa driver

## Features

### LoRa Mesh Protocol

- Flood routing with duplicate suppression
- TTL-based hop limiting
- Broadcast and unicast support
- Automatic rebroadcasting

### MCP23017 Integration

- 14 usable input pins (avoid GPA7/GPB7)
- Interrupt-driven button reading
- Internal pull-ups enabled

### Display (TODO)

- QSPI display initialization
- LVGL integration
- Touch input

### Audio (TODO)

- ES8311 codec initialization
- I2S configuration
- Playback/recording

## Configuration

### LoRa Settings

- **Frequency**: 915.0 MHz
- **Bandwidth**: 125 kHz
- **Spreading Factor**: 9
- **Coding Rate**: 7
- **TX Power**: +22 dBm (SX1262) = +30 dBm (module output)
- **Preamble**: 8 symbols

### Mesh Protocol

- **Max Packet Size**: 256 bytes
- **Header Size**: 12 bytes
- **Default TTL**: 5 hops
- **Duplicate Window**: 60 seconds

## Notes

- Camera pins are repurposed for LoRa module (camera not used)
- MCP23017 GPA7 and GPB7 should not be used as inputs (datasheet errata)
- E22-900M30S requires ≥5.0V for full 30 dBm output
- Display uses QSPI interface (6-wire)
- All on-board sensors share single I2C bus

## Troubleshooting

### LoRa "SetTx Illegal Status" Error

- Ensure TXEN/RXEN pins are correctly configured
- Check BUSY pin polling (must be LOW before SPI commands)
- Verify power supply (≥5.0V for full power)

### MCP23017 I2C Errors

- Verify I2C address (0x20 with A0-A2 grounded)
- Check I2C bus pull-ups (enabled in config)
- Ensure no address conflicts

### Display Issues

- Verify QSPI pin connections
- Check backlight PWM configuration
- Ensure PSRAM is enabled in sdkconfig

## License

MIT

---

**The Mesh Holds.** 🔺
