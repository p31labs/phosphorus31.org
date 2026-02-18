# Node-1 PCB

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-CERN--OHL--S--v2-green)
![Status](https://img.shields.io/badge/status-prototype-orange)

An open-source, neurodivergent-friendly communication device featuring tactile feedback, beautiful aesthetics, and modular expansion capabilities.

## Overview

The Node-1 is a "Board is the Product" design philosophy embodied in a 51mm x 51mm PCB that celebrates electronics rather than hiding them. This project combines:

- **Tactile Design**: Exposed ENIG gold touch zones for sensory feedback
- **Visual Appeal**: Matte black solder mask with geometric silkscreen art
- **Rich Interaction**: Mechanical switches, rotary encoder, haptic feedback, and RGB LEDs
- **Powerful Features**: ESP32-S3 with WiFi/BLE and LoRa 900MHz radio
- **Expandability**: Feather-compatible pinout for endless add-ons

## Key Features

### Hardware
- **ESP32-S3-WROOM-1**: Dual-core microcontroller with WiFi + Bluetooth LE
- **LoRa Radio**: 900MHz long-range communication (E22-900M30S)
- **Haptic Feedback**: DRV2605L haptic driver with ERM/LRA motor support
- **RGB LEDs**: 5x SK6812 side-emitting Neopixels for underglow effects
- **Inputs**: 
  - 1x Rotary encoder with push button
  - 2x Kailh Choc mechanical switches (hot-swappable)
- **Display**: I2C header for OLED/E-Ink displays
- **Battery**: LiPo charging via TP4056 with USB-C
- **Touch Zones**: Exposed gold copper for tactile sensory feedback

### Aesthetics
- **Finish**: ENIG (Gold) over Matte Black solder mask
- **Size**: 51mm x 51mm (2" x 2")
- **Design**: Cyberpunk geometric patterns, visible circuit traces
- **Mounting**: 4x M2.5 mounting holes

## Repository Structure

```
node1_pcb/
├── gerbers/                          # Manufacturing files
│   ├── node1-F_Cu.gbr   # Top copper layer
│   ├── node1-B_Cu.gbr   # Bottom copper (ground plane)
│   ├── node1-F_Mask.gbr # Top solder mask
│   ├── node1-B_Mask.gbr # Bottom solder mask (with touch zones)
│   ├── node1-F_SilkS.gbr # Top silkscreen
│   ├── node1-B_SilkS.gbr # Bottom silkscreen
│   ├── node1-Edge_Cuts.gbr # Board outline
│   └── node1.drl        # Drill file
├── fabrication/
│   ├── BOM.csv                      # Bill of Materials
│   ├── MANUFACTURING_SPEC.md        # PCB fab specifications
│   └── ASSEMBLY_INSTRUCTIONS.md     # Step-by-step assembly guide
├── PCB_DESIGN_SPEC.md               # Complete technical documentation
├── node1.kicad_pro      # KiCad project file
└── README.md                        # This file
```

## Quick Start

### 1. Order PCBs

Upload the Gerber files (in `/gerbers/`) to your preferred PCB manufacturer:

**Recommended Manufacturers:**
- JLCPCB (https://jlcpcb.com)
- PCBWay (https://www.pcbway.com)
- OSH Park (https://oshpark.com) - for premium quality

**Critical Settings:**
- Layers: 2
- Dimensions: 51 x 51 mm
- PCB Thickness: 1.6 mm
- Surface Finish: **ENIG** (Electroless Nickel Immersion Gold)
- Solder Mask: **Matte Black**
- Silkscreen: White

**Cost Estimate:** $40-60 USD for 5 boards including shipping

### 2. Order Components

See `fabrication/BOM.csv` for complete parts list.

**Major Components:**
- ESP32-S3-WROOM-1 module (~$3-5)
- E22-900M30S LoRa module (~$5-8)
- DRV2605L haptic driver (~$2-3)
- Kailh Choc switches x2 (~$1 each)
- SK6812 LEDs x5 (~$0.50 each)
- Various passives and connectors

**Total Component Cost:** ~$30-40 USD

### 3. Assembly

Follow the detailed instructions in `fabrication/ASSEMBLY_INSTRUCTIONS.md`

**Summary:**
1. Solder SMD components (resistors, capacitors, ICs)
2. Solder through-hole components (headers, switches)
3. Program ESP32-S3 via USB-C
4. Test all subsystems
5. Install battery and final assembly

### 4. Programming

Example Arduino code structure:
```cpp
#include <WiFi.h>
#include <RadioLib.h>  // LoRa
#include <Adafruit_GFX.h>  // Display
#include <FastLED.h>  // LEDs
#include <Adafruit_DRV2605.h>  // Haptics

// Initialize hardware
// Main loop: handle inputs, update display, send/receive messages
```

See `firmware/` directory (coming soon) for complete examples.

## Design Philosophy

### "The Board is the Product"

This design rejects the idea that PCBs should be hidden inside enclosures. Instead:

- **Celebrate the Technology**: Exposed traces, geometric patterns, and component placement are art
- **Tactile Engagement**: Touch zones provide sensory feedback for neurodivergent users
- **Visual Interest**: Matte black and gold create a premium cyberdeck aesthetic
- **Transparency**: Visible architecture helps users understand how the system works

### Neurodivergent-Friendly Features

- **Multiple Input Methods**: Switches, encoder, touch zones for different preferences
- **Clear Visual Feedback**: LED indicators for all system states
- **Haptic Feedback**: Physical vibration confirms actions
- **Modular Thinking**: Exposed bus lines show system architecture
- **Satisfying Interactions**: Mechanical switches provide tactile pleasure

## Technical Specifications

### Microcontroller
- **CPU**: Xtensa dual-core 32-bit LX7, up to 240 MHz
- **Memory**: 512 KB SRAM, 16 MB Flash (8 MB PSRAM optional)
- **Wireless**: WiFi 802.11 b/g/n, Bluetooth LE 5.0
- **Peripherals**: I2C, SPI, UART, ADC, PWM

### LoRa Radio
- **Frequency**: 850-930 MHz (check local regulations!)
- **Power Output**: 1W (30 dBm)
- **Sensitivity**: -148 dBm
- **Range**: Up to 5-10 km (line of sight)

### Power
- **Input**: USB-C 5V or 3.7V LiPo battery
- **Charging**: 1A max via TP4056
- **Consumption**: 
  - Idle: ~50-80 mA
  - Active (WiFi): ~150-200 mA
  - Transmitting (LoRa): ~400-500 mA

### Dimensions
- **PCB**: 51 x 51 x 1.6 mm
- **Weight**: ~15g (PCB only), ~40g (fully assembled with battery)
- **Mounting**: 4x M2.5 holes at corners

## Expansion Options

### Feather-Compatible Headers
Add standard Feather "Wings" for expanded functionality:
- GPS modules
- Additional sensors (temperature, humidity, pressure)
- Larger displays
- Audio output
- SD card storage

### Custom Modifications
- Add external antenna for better LoRa range
- Integrate larger battery for extended runtime
- Design custom 3D-printed enclosure
- Add more mechanical switches for custom macros

## Use Cases

- **Off-Grid Communication**: LoRa mesh messaging when cell networks are down
- **Sensor Platform**: Environmental monitoring with wireless data transmission
- **Assistive Device**: Tactile feedback for accessibility applications
- **Learning Tool**: Teach electronics, embedded programming, and RF communication
- **Art Project**: Beautiful conversation piece that showcases technology
- **Fidget Device**: Satisfying tactile inputs for focus and stress relief

## Legal and Safety

### RF Regulations
⚠️ **Important:** LoRa transmission may require licensing in your jurisdiction.
- USA: 902-928 MHz ISM band (license-free with restrictions)
- EU: 863-870 MHz (check your country's regulations)
- Always comply with local RF transmission laws

### Battery Safety
⚠️ **Warning:** LiPo batteries require careful handling:
- Never reverse polarity
- Don't overcharge or deep discharge
- Charge in fire-safe location
- Dispose of damaged batteries properly

### ESD Protection
- Use ESD-safe practices when handling the assembled board
- The exposed gold touch zones are electrically connected to ground

## Contributing

This is an open-source hardware project. Contributions welcome!

### Ways to Contribute:
- Improve the PCB design
- Create alternative firmware
- Design 3D-printed enclosures
- Write documentation
- Share your builds and modifications

### Submitting Changes:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

- **Hardware**: CERN Open Hardware Licence Version 2 - Strongly Reciprocal (CERN-OHL-S-v2)
- **Firmware**: MIT License (for example code)
- **Documentation**: Creative Commons BY-SA 4.0

You are free to:
- Use commercially
- Modify and distribute
- Create derivatives

You must:
- Give credit
- Share modifications under same license
- Include license and copyright notice

## Credits

**Design**: Inspired by the maker community's "cyberdeck" aesthetic
**Philosophy**: "The Board is the Product" - celebrating electronics as art
**Target Audience**: Makers, neurodivergent individuals, electronics enthusiasts

## Support

- **Issues**: Use GitHub issue tracker
- **Discussions**: GitHub Discussions for questions and ideas
- **Community**: Join the cyberdeck and maker communities on Reddit, Discord

## Changelog

### v1.0 (2024-12-01)
- Initial release
- 51mm x 51mm form factor
- ESP32-S3 + LoRa 900MHz
- Matte black + ENIG finish
- Tactile touch zones
- Feather-compatible pinout

---

**Made with ❤️ for the maker community**

*"Not all those who wander are lost, but some of us need really cool communication devices to find our way."*
