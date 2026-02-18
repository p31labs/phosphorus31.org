# P31 NodeZero Firmware — AI Agent Context

**ESP32-S3 assistive device firmware. Class II medical device pathway.**

---

## Quick Reference

- **Location:** `firmware/node-one-esp-idf/`
- **Stack:** ESP-IDF 5.4+, C++, LVGL, RadioLib
- **MCU:** ESP32-S3
- **Status:** 30% complete. Components exist, prototype pending hardware.
- **Build:** `idf.py build` (requires ESP-IDF toolchain)
- **License:** MIT

---

## What This Is

P31 NodeZero is a handheld assistive device for neurodivergent individuals. It provides:
- **LoRa mesh networking** (915 MHz, "Whale Channel") for off-grid communication
- **Haptic feedback** ("The Thick Click" — Kailh Navy mechanical switch + DRV2605L)
- **OLED/E-Ink display** for low-stimulation output
- **Audio processing** (ES8311 codec)
- **6-axis IMU** (QMI8658) for gesture/orientation
- **Power management** (AXP2101 PMIC)
- **Secure element** (SE050 HSM, planned)

Regulatory target: FDA Class II 510(k)-exempt under 21 CFR § 890.3710 (Powered Communication System).

---

## Project Structure

```
firmware/
├── node-one-esp-idf/              # Main ESP-IDF project
│   ├── main/                       # Application code
│   │   ├── main.cpp                # Entry point (app_main)
│   │   ├── mesh_protocol.cpp/.h    # LoRa mesh protocol
│   │   ├── lora_driver.cpp/.h      # LoRa radio driver
│   │   ├── mcp23017_driver.cpp/.h  # GPIO expander driver
│   │   ├── rotary_encoder.cpp/.h   # Rotary encoder input
│   │   ├── pin_config.cpp/.h       # Pin assignment table
│   │   ├── pin_map.h               # Pin mapping constants
│   │   ├── node_one_config.h       # Device configuration
│   │   ├── CMakeLists.txt          # Build file
│   │   ├── Kconfig.projbuild       # Menuconfig options
│   │   └── idf_component.yml       # Component registry deps
│   ├── components/                 # Reusable hardware drivers
│   │   ├── lora_radio/             # LoRa radio abstraction
│   │   ├── display/                # Display driver (LVGL)
│   │   ├── audio_engine/           # Audio processing (ES8311)
│   │   ├── button_input/           # Button/switch handling
│   │   ├── bsp/                    # Board Support Package
│   │   ├── shield_server/          # P31 Buffer bridge over serial
│   │   └── ble_test/               # BLE testing component
│   ├── managed_components/         # ESP-IDF registry components
│   │   ├── lvgl__lvgl/             # LVGL graphics library
│   │   └── jgromes__radiolib/      # RadioLib (multi-radio)
│   ├── test/                       # Unit tests (empty)
│   ├── sdkconfig                   # ESP-IDF build config
│   └── CMakeLists.txt              # Top-level build file
└── src/
    └── node-one-buffer/            # Buffer implementation (legacy?)
```

---

## Hardware Components

| Component | Chip | Driver | Interface | Status |
|-----------|------|--------|-----------|--------|
| MCU | ESP32-S3 | — | — | Working |
| LoRa Radio | SX1262 (via RadioLib) | `lora_radio/`, `lora_driver.cpp` | SPI | Implemented |
| Display | TBD (OLED/E-Ink) | `display/` (LVGL) | SPI/I2C | Scaffolded |
| Audio Codec | ES8311 | `audio_engine/` | I2S + I2C | Scaffolded |
| GPIO Expander | MCP23017 | `mcp23017_driver.cpp` | I2C | Implemented |
| IMU | QMI8658 | via BSP | I2C | Planned |
| PMIC | AXP2101 | via BSP | I2C | Planned |
| Haptics | DRV2605L | — | I2C | Planned |
| Rotary Encoder | Mechanical | `rotary_encoder.cpp` | GPIO | Implemented |
| Buttons | Kailh Navy | `button_input/` | GPIO/MCP23017 | Scaffolded |
| BLE | ESP32-S3 built-in | `ble_test/` | — | Test only |

---

## Key Files

| File | Purpose |
|------|---------|
| `main/main.cpp` | Entry point — `app_main()`, task initialization |
| `main/mesh_protocol.cpp` | LoRa mesh packet format, routing, encryption |
| `main/lora_driver.cpp` | Low-level SX1262 radio control via RadioLib |
| `main/mcp23017_driver.cpp` | I2C GPIO expander for buttons/LEDs |
| `main/rotary_encoder.cpp` | Rotary encoder with debounce |
| `main/pin_config.cpp` | Pin assignment table (board-specific) |
| `main/node_one_config.h` | Device constants, feature flags |
| `components/shield_server/` | Serial bridge to P31 Buffer (host machine) |
| `components/bsp/` | Board Support Package (chip init, power) |

---

## Build & Flash

```bash
# Prerequisites: ESP-IDF 5.4+ installed and sourced
cd firmware/node-one-esp-idf

# Configure (first time or after changes)
idf.py menuconfig

# Build
idf.py build

# Flash to device (USB connected)
idf.py flash

# Monitor serial output
idf.py monitor

# Build + Flash + Monitor
idf.py build flash monitor
```

---

## Communication Protocol

### LoRa Mesh ("Whale Channel")
- Frequency: 915 MHz ISM band
- Bandwidth: ~0.350 kbps (optimize for this)
- Protocol: Custom mesh routing (`mesh_protocol.cpp`)
- Encryption: AES-128 (planned: SE050 key storage)
- Compatible with Meshtastic ecosystem

### Serial Bridge
- USB serial to host machine
- `shield_server` component bridges to P31 Buffer
- JSON-over-serial protocol (planned: Protocol Buffers)

### BLE
- ESP32-S3 built-in Bluetooth LE
- Test component exists (`ble_test/`)
- Planned: proximity detection for Proof of Care

---

## Development Notes

### No Hardware? Use Ghost Mode
If you don't have physical hardware, work on:
- Protocol definitions (`mesh_protocol.h`)
- Configuration structures (`node_one_config.h`)
- Component interfaces (header files in `include/`)
- Test stubs (in `test/`)

The `shield_server` component can be tested over a virtual serial port.

### Coding Style
- C++ with ESP-IDF conventions
- `ESP_LOG*` macros for logging
- FreeRTOS tasks for concurrent operations
- Component-based architecture (each hardware driver is a component)
- Header guards, not `#pragma once` (ESP-IDF convention)

### Pin Assignments
All pin assignments live in `main/pin_config.cpp` and `main/pin_map.h`. Never hardcode pins in component code — always reference the pin config.

---

## Integration Points

- **P31 Buffer** (`apps/shelter/`) — via serial bridge (`shield_server` component)
- **P31 Spectrum** (`ui/`) — Serves lite web UI via SPIFFS (build target: `npm run build:spiffs` in ui/)
- **PCB designs** (`hardware/node1/`) — KiCad schematics match pin assignments
- **Meshtastic** — LoRa protocol compatible for mesh interop

---

## Testing

No test framework currently in place. Recommended approach:
- **Unity** (C test framework) for component-level unit tests
- **ESP-IDF test runner** for integration tests on device
- **QEMU** for simulated tests (ESP32-S3 QEMU support is limited)

The `test/` directory exists but is empty.

---

## PCB Reference

- **Node 1 PCB:** `hardware/node1/node1_pcb/` — KiCad project with gerbers
- **Sensory Cyberdeck PCB:** `hardware/sensory/sensory_cyberdeck_pcb/` — Second board design

---

**The device is the mesh made physical. The mesh holds.**
