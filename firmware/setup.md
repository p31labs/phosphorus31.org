# Node One Setup Guide

Complete setup guide for Node One hardware (ESP32-S3).

## Prerequisites

### Required
- **ESP-IDF** v5.0 or higher
- **USB cable** for programming
- **Node One hardware device** (ESP32-S3 Touch LCD 3.5")

### ESP-IDF Installation

Follow the official ESP-IDF setup guide:
https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/get-started/

Quick install (Linux/Mac):
```bash
mkdir -p ~/esp
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32s3
. ./export.sh
```

Windows: Use ESP-IDF installer from Espressif website.

## Hardware Setup

### Pin Configuration

Node One uses:
- **QSPI Display**: CS=GPIO12, CLK=GPIO5, DATA0-3=GPIO1-4
- **Backlight**: GPIO6
- **I2C**: SDA=GPIO8, SCL=GPIO7
- **Touch**: I2C at 0x3B
- **PMIC**: AXP2101 at 0x34
- **Audio**: ES8311 at 0x18
- **IMU**: QMI8658 at 0x6B
- **RTC**: PCF85063 at 0x51

### Power Management

AXP2101 must enable:
- ALDO1 = 3.3V
- BLDO1 = 1.5V
- BLDO2 = 2.8V

## Building

```bash
cd firmware
idf.py build
```

## Flashing

### Connect Device

Connect Node One via USB cable.

### Flash Firmware

```bash
idf.py flash
```

### Monitor Output

```bash
idf.py monitor
```

Press `Ctrl+]` to exit monitor.

## Configuration

### Menuconfig

Configure build options:

```bash
idf.py menuconfig
```

Key settings:
- **Component config** → **ESP32S3-Specific** → CPU frequency
- **Component config** → **LoRa** → Frequency (915MHz)
- **Component config** → **Whale Channel** → Mesh settings

## Testing

### Basic Test

After flashing, monitor should show:
- Boot messages
- PMIC initialization
- Display initialization
- LoRa initialization
- Whale Channel ready

### Network Test

Verify mesh connectivity:
- Check for other nodes
- Send test ping
- Verify signal strength

## Troubleshooting

### Flash Issues

- Check USB cable connection
- Verify device is in download mode
- Try holding BOOT button during flash

### Display Issues

- Verify QSPI connections
- Check backlight GPIO6
- Verify color byte-swapping for RGB565

### LoRa Issues

- Verify antenna connection
- Check 915MHz frequency setting
- Verify spreading factor configuration

## Integration

Node One integrates with:
- **The Centaur**: Backend API
- **The Buffer**: Message processing
- **Whale Channel**: LoRa mesh network
- **Ping**: Object permanence

## Next Steps

- [Node One Documentation](../docs/node-one.md)
- [Whale Channel](../docs/whale-channel.md)
- [The Thick Click](../docs/thick-click.md)
