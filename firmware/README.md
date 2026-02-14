# Node One

Hardware device - ESP32-S3 with LoRa mesh networking, haptic feedback, and display.

## Overview

Node One is the first physical device in the P31 mesh topology. It provides the hardware interface for The Centaur protocol, enabling local-first operation with optional cloud connectivity.

## Hardware Specifications

- **MCU**: ESP32-S3
- **Display**: OLED/E-Ink (320x480 portrait)
- **Communication**: LoRa 915MHz (Whale Channel)
- **Haptics**: The Thick Click system
- **Power**: AXP2101 PMIC
- **Audio**: ES8311 codec
- **IMU**: QMI8658 (6-axis)

## Features

- LoRa mesh networking (Whale Channel)
- Haptic feedback (The Thick Click)
- Local-first operation
- Encrypted communication
- Low power operation
- Class II Assistive Medical Device classification

## Quick Start

See [setup.md](setup.md) for complete hardware setup instructions.

### Prerequisites

- ESP-IDF v5.0+
- USB cable for programming
- Node One hardware device

### Build and Flash

```bash
idf.py build
idf.py flash
idf.py monitor
```

## Communication

Node One communicates via:
- **Whale Channel**: LoRa mesh network (915MHz)
- **USB Serial**: For programming and debugging
- **I2C**: Internal device communication

## Integration

Node One integrates with:
- **The Centaur**: Backend AI protocol
- **The Buffer**: Communication processing
- **Ping**: Object permanence automation
- **Whale Channel**: LoRa mesh network
- **The Thick Click**: Haptic feedback

## Documentation

- [Node One Documentation](../docs/node-one.md)
- [Setup Guide](setup.md)
- [Whale Channel](../docs/whale-channel.md)
- [The Thick Click](../docs/thick-click.md)

## License

MIT

---

**The Mesh Holds.** 🔺
