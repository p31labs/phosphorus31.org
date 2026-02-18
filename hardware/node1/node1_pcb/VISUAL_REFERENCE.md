# Node-1 - PCB Visual Reference

## Top View (Component Side)

```
╔═══════════════════════════════════════════════════════════╗
║  51mm x 51mm                                              ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ ⊕                                                 ⊕ │ ║  ⊕ = M2.5 mounting hole
║  │                                                       │ ║
║  │  ┌────────────┐           ┌─────┐  ┏━━━━━━━━┓      │ ║
║  │  │  ESP32-S3  │           │OLED │  ┃ ROTARY ┃      │ ║  Top Right:
║  │  │  WROOM-1   │           │HDR  │  ┃ ENCODER┃      │ ║  - Rotary Encoder
║  │  │ WiFi + BLE │           │ J3  │  ┗━━━━━━━━┛      │ ║  - (with push button)
║  │  │    (U1)    │           └─────┘                   │ ║
║  │  └────────────┘                                      │ ║
║  │                                                       │ ║
║  │  ┌────────────┐                    ┏━━━━━━━┓        │ ║
║  │  │   LoRa     │                    ┃ [SEND]┃        │ ║  Center Right:
║  │  │ E22-900M30S│     ◆◆◆◆◆◆         ┃  SW2  ┃        │ ║  - SEND Switch
║  │  │  900 MHz   │    ◆◆◆◆◆◆◆         ┗━━━━━━━┛        │ ║  - CANCEL Switch
║  │  │    (U2)    │   ◆◆◆◆◆◆◆◆                          │ ║  - (Kailh Choc)
║  │  └────────────┘  ◆◆◆◆◆◆◆◆◆         ┏━━━━━━━┓        │ ║
║  │                 ◆◆◆◆◆◆◆◆◆◆         ┃[CANCEL┃        │ ║
║  │  ┌──────┐     ◆◆◆◆◆◆◆◆◆◆◆         ┃  SW3  ┃        │ ║
║  │  │DRV   │      ◆◆◆◆◆◆◆◆◆          ┗━━━━━━━┛        │ ║
║  │  │2605L │       ◆◆◆◆◆◆                              │ ║
║  │  │ (U3) │        ◆◆◆              [IC] [IC]         │ ║  Center:
║  │  └──────┘                          U4   U5          │ ║  - Charging (TP4056)
║  │                                                      │ ║  - Regulator (AMS1117)
║  │  ┌──────┐                                           │ ║
║  │  │TP4056│         ████████████████████             │ ║  Bottom Edge:
║  │  │ (U4) │         ║ LED LED LED LED LED║            │ ║  - 5x Neopixel LEDs
║  │  └──────┘         ║  D1  D2  D3  D4  D5║            │ ║  - (SK6812 underglow)
║  │                   ████████████████████             │ ║
║  │  ╔════════╗                                        │ ║
║  │  ║ USB-C  ║         ┌─────┐                       │ ║  Bottom Left:
║  │  ║   J1   ║         │JST  │                       │ ║  - USB-C Connector
║  │  ╚════════╝         │BATT │                       │ ║  - JST Battery Connector
║  │                     │ J2  │                       │ ║
║  │ ⊕                   └─────┘                     ⊕ │ ║
║  └─────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════╝

 Legend:  ◆ = Geometric silkscreen art pattern
          ┏━┓ = Mechanical switch with keycap
          ╔═╗ = Connector
          ┌─┐ = IC or module
          ████ = LED strip
```

## Bottom View (Solder Side)

```
╔═══════════════════════════════════════════════════════════╗
║  Bottom Layer - Ground Plane + Touch Zones               ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ ⊕                                                 ⊕ │ ║
║  │                              ┌────────────────┐     │ ║
║  │                              │                │     │ ║
║  │   ╔════════════════╗         │  TOUCH ZONE 2  │     │ ║  Top Right:
║  │   ║  SENSORY       ║         │   (Circular)   │     │ ║  - Circular touch pad
║  │   ║  CYBERDECK     ║         │  Exposed ENIG  │     │ ║  - Ø10mm exposed gold
║  │   ║  v1.0 - 2024   ║         │     Gold       │     │ ║
║  │   ╚════════════════╝         └────────────────┘     │ ║
║  │                                                      │ ║
║  │   ╭───╮  ╭───╮  ╭───╮                               │ ║
║  │   │HEX│  │HEX│  │HEX│   ═══════════════════        │ ║  Center:
║  │   ╰───╯  ╰───╯  ╰───╯   ═══════════════════        │ ║  - Decorative hexagons
║  │                          ═══════════════════        │ ║  - Circuit trace art
║  │   ════════════           ═══════════════════        │ ║
║  │   ════════════           ═══════════════════        │ ║
║  │   ════════════                                      │ ║
║  │                          ┌───────────────────┐      │ ║
║  │   ║║║║║║║║                │                  │      │ ║  Center-Bottom:
║  │   ║║║║║║║║                │   TOUCH ZONE 1   │      │ ║  - Large rectangular pad
║  │   ║║║║║║║║                │   (Rectangle)    │      │ ║  - 15x15mm exposed gold
║  │                          │  Exposed ENIG    │      │ ║  - Textured with lines
║  │   "TOUCH ZONE"           │      Gold        │      │ ║
║  │                          │  ║║║║║║║║║║║     │      │ ║
║  │                          └───────────────────┘      │ ║
║  │ ⊕                                                 ⊕ │ ║
║  └─────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════╝

 Legend:  ╭───╮ = Decorative hexagon pattern
          ═════ = Circuit trace art
          ║║║║║ = Vertical line texture
          ┌────┐ = Touch zone (no solder mask)
```

## Layer Stack (Side View)

```
┌──────────────────────────────────────┐  White Silkscreen
├──────────────────────────────────────┤  Matte Black Solder Mask
├──────────────────────────────────────┤  Copper Layer (Top) - 1oz
│                                      │  
│      FR-4 Core (1.6mm thick)        │  
│                                      │  
├──────────────────────────────────────┤  Copper Layer (Bottom) - 1oz
├──────────────────────────────────────┤  Matte Black Solder Mask
└──────────────────────────────────────┘  White Silkscreen

           ENIG Finish on pads:
           ┌────────┐
           │ Gold   │  0.05-0.10 μm
           ├────────┤
           │ Nickel │  2.5-5.0 μm
           ├────────┤
           │ Copper │  35 μm (1oz)
           └────────┘
```

## Component Zones

### Input Zone (Right Side)
```
        INPUTS
    ┏━━━━━━━━━┓
    ┃ Rotary  ┃  ← Turn: Volume/Menu
    ┃ Encoder ┃  ← Push: Select
    ┗━━━━━━━━━┛
        ↓
    ┏━━━━━━━┓
    ┃ SEND  ┃    ← Transmit message
    ┗━━━━━━━┛
        ↓
    ┏━━━━━━━┓
    ┃CANCEL ┃    ← Abort/Back
    ┗━━━━━━━┛
```

### Processing Zone (Left/Center)
```
    COMPUTE           COMMUNICATE
    ┌────────┐       ┌─────────┐
    │ESP32-S3│◄────►│  LoRa   │
    │ 240MHz │       │ 900MHz  │
    └────────┘       └─────────┘
        ↕                ↕
    ┌────────┐       ┌─────────┐
    │Display │       │ Haptic  │
    │  I2C   │       │DRV2605L │
    └────────┘       └─────────┘
```

### Feedback Zone (Bottom)
```
    VISUAL FEEDBACK
    ████ ████ ████ ████ ████
    LED1 LED2 LED3 LED4 LED5
     ↓    ↓    ↓    ↓    ↓
    [RX] [TX] [PWR][ERR][STS]
```

### Touch Zones (Bottom Layer)
```
    Zone 1 (Large):        Zone 2 (Small):
    ┌───────────────┐      ╭───────────╮
    │               │      │           │
    │  Worry Stone  │      │  Thumb    │
    │   Texture     │      │   Rest    │
    │               │      │           │
    └───────────────┘      ╰───────────╯
    15mm x 15mm            Ø10mm circle
```

## Expansion Diagram

```
                         ┌─────────────┐
                         │   Wings     │
                         │ (Add-ons)   │
                         └─────────────┘
                               ↓
                         Pin Headers
                    ╔══════════════════╗
                    ║                  ║
    ┌──────────┐    ║  Main PCB        ║    ┌──────────┐
    │ Battery  │───►║  (This board)    ║───►│  USB-C   │
    └──────────┘    ║                  ║    └──────────┘
                    ║                  ║
                    ╚══════════════════╝
                         ↓      ↓
                    ┌──────┐  ┌──────┐
                    │OLED  │  │Haptic│
                    │Screen│  │Motor │
                    └──────┘  └──────┘
```

## Pin Mapping Reference

```
ESP32-S3 Pin Assignments:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
GPIO | Function        | Device
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1  | TX             | Debug UART
  3  | RX             | Debug UART
  4  | ADC            | Battery Monitor
  5  | CS             | LoRa SPI
 12  | Encoder A      | Rotary Input
 13  | Encoder B      | Rotary Input
 14  | LoRa RST       | LoRa Reset
 15  | Encoder SW     | Push Button
 16  | Switch 1       | SEND
 17  | Switch 2       | CANCEL
 18  | SCK            | LoRa SPI
 19  | MISO           | LoRa SPI
 21  | SDA            | I2C Bus
 22  | SCL            | I2C Bus
 23  | MOSI           | LoRa SPI
 25  | LED Data       | Neopixels
 26  | DIO0           | LoRa IRQ
 27  | Haptic EN      | DRV2605L
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Aesthetic Features

### Silkscreen Art Elements:
- Hexagonal patterns (cyberpunk geometric)
- Circuit trace decorations
- Functional flow arrows (TX/RX indicators)
- Modern typography for labels
- "Touch Zone" indicators

### Color Scheme:
- **Primary**: Matte Black (sophisticated, non-reflective)
- **Accent**: ENIG Gold (premium, tactile)
- **Contrast**: White Silkscreen (readable, clean)

### Tactile Elements:
- **Smooth Gold**: Touch zones for sensory feedback
- **Mechanical Clicks**: Satisfying switch actuation
- **Rotary Detents**: Positive encoder feedback
- **Vibration**: Haptic motor confirms actions

---

This design celebrates the beauty of electronics while providing
a rich, multi-sensory interaction experience perfect for makers,
neurodivergent individuals, and anyone who appreciates thoughtful
hardware design.
