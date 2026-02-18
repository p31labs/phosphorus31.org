# Sensory Cyberdeck PCB - Complete Design Specification

## Board Overview
- **Board Name**: Sensory Cyberdeck v1.0
- **Dimensions**: 51mm x 51mm (2" x 2")
- **Layers**: 2-layer PCB
- **Thickness**: 1.6mm standard
- **Material**: FR4
- **Finish**: ENIG (Electroless Nickel Immersion Gold) - 0.05-0.10μm gold over 2.5-5μm nickel
- **Solder Mask**: Matte Black
- **Silkscreen**: White (top and bottom)

## Manufacturing Specifications

### Layer Stack (Top to Bottom)
1. Top Silkscreen (White)
2. Top Solder Mask (Matte Black)
3. Top Copper (35μm / 1oz)
4. FR4 Core (1.6mm)
5. Bottom Copper (35μm / 1oz)
6. Bottom Solder Mask (Matte Black)
7. Bottom Silkscreen (White)

### Design Rules
- **Minimum Track Width**: 0.15mm (6mil)
- **Power Track Width**: 0.5mm (20mil)
- **Minimum Clearance**: 0.15mm (6mil)
- **Via Size**: 0.6mm diameter / 0.3mm drill
- **Minimum Hole Size**: 0.3mm

## Component Placement Map

### Top Side Layout (51mm x 51mm grid)

```
┌─────────────────────────────────────────────────┐
│  [M2.5]              TOP VIEW            [M2.5] │
│                                                  │
│  ┌──────────────┐         ┌────────────┐        │
│  │  ESP32-S3    │         │   ROTARY   │  ◄─ TOP RIGHT
│  │   WROOM-1    │         │   ENCODER  │        │
│  │              │         │   (EC11)   │        │
│  └──────────────┘         └────────────┘        │
│                                                  │
│  ┌──────────────┐         ┌────────────┐        │
│  │   LoRa       │         │  MECH SW1  │        │
│  │  E22-900M30S │         │  [SEND]    │        │
│  │   (SPI)      │         └────────────┘        │
│  └──────────────┘         ┌────────────┐        │
│                           │  MECH SW2  │  ◄─ BOTTOM RIGHT
│  ┌──────────────┐         │  [CANCEL]  │        │
│  │   DRV2605L   │         └────────────┘        │
│  │   (Haptic)   │                               │
│  └──────────────┘   ████████████████████        │
│                     ║ 5x SK6812 LEDs  ║  ◄─ UNDERGLOW
│  ┌──────────────┐   ████████████████████        │
│  │   TP4056     │                               │
│  │  (Charging)  │                               │
│  └──────────────┘                               │
│                     ┌──────────────┐            │
│  ╔═════════════╗   │  JST-PH 2.0  │            │
│  ║   USB-C     ║   │   (Battery)  │            │
│  ║  Connector  ║   └──────────────┘            │
│  ╚═════════════╝                                │
│                                                  │
│  [M2.5]                    OLED HDR      [M2.5] │
└─────────────────────────────────────────────────┘
```

## Pin Assignments (ESP32-S3)

### Power
- **VCC**: 3.3V from regulator
- **GND**: Ground plane (bottom layer flood fill)
- **VBAT**: Battery voltage monitor via voltage divider (GPIO4/ADC1_CH3)

### I2C Bus (Shared)
- **SDA**: GPIO21 (I2C0_SDA) → DRV2605L, OLED Display
- **SCL**: GPIO22 (I2C0_SCL) → DRV2605L, OLED Display
- **Pull-ups**: 4.7kΩ on SDA and SCL

### SPI Bus (LoRa Radio)
- **MOSI**: GPIO23 (SPI_MOSI) → LoRa DIO0
- **MISO**: GPIO19 (SPI_MISO) → LoRa DIO1
- **SCK**: GPIO18 (SPI_CLK) → LoRa SCK
- **CS**: GPIO5 (SPI_CS) → LoRa NSS
- **RST**: GPIO14 → LoRa RESET
- **DIO0**: GPIO26 → LoRa DIO0 (IRQ)

### GPIO Assignments
- **GPIO12**: Rotary Encoder Pin A (with interrupt)
- **GPIO13**: Rotary Encoder Pin B (with interrupt)
- **GPIO15**: Rotary Encoder Switch (pull-up)
- **GPIO16**: Mechanical Switch 1 (SEND) - pull-up
- **GPIO17**: Mechanical Switch 2 (CANCEL) - pull-up
- **GPIO25**: LED Data (SK6812 Neopixel chain)
- **GPIO27**: Haptic Enable (DRV2605L EN pin)

### UART (Debug/Programming)
- **TX**: GPIO1 (UART0_TX)
- **RX**: GPIO3 (UART0_RX)

## Component List with Footprints

### Main Components
1. **U1 - ESP32-S3-WROOM-1**
   - Package: QFN-56 (module format)
   - Placement: Top-left quadrant
   - Orientation: USB side towards board edge

2. **U2 - E22-900M30S (LoRa Module)**
   - Package: 21mm x 16mm SMD module
   - Frequency: 850-930 MHz
   - Placement: Center-left
   - Keep-out zone: 5mm around antenna section

3. **U3 - DRV2605L (Haptic Driver)**
   - Package: VSSOP-10
   - Placement: Lower-left quadrant
   - I2C address: 0x5A

4. **U4 - TP4056 (LiPo Charger)**
   - Package: SOP-8
   - Placement: Lower-left, near JST connector
   - Charge current: 500mA (via PROG resistor)

### Connectors
5. **J1 - USB Type-C Connector**
   - Package: USB-C 16-pin SMD
   - Placement: Bottom edge, centered
   - Features: CC1/CC2 configuration resistors for 5V negotiation

6. **J2 - JST-PH 2.0mm (Battery)**
   - Package: Through-hole, 2-pin
   - Placement: Bottom-left
   - Polarity: Pin 1 = +, Pin 2 = GND

7. **J3 - OLED Display Header**
   - Package: 4-pin 0.1" pitch header
   - Pins: VCC, GND, SCL, SDA
   - Placement: Bottom edge, right side

### Input Components
8. **SW1 - Rotary Encoder (EC11)**
   - Package: EC11 series (vertical mount)
   - Placement: Top-right corner
   - Pins: A, B, C (common), SW1, SW2 (switch)

9. **SW2 - Mechanical Switch (SEND)**
   - Package: Kailh Choc Low Profile hotswap socket
   - Placement: Middle-right
   - Keycap clearance: 15mm x 15mm

10. **SW3 - Mechanical Switch (CANCEL)**
    - Package: Kailh Choc Low Profile hotswap socket
    - Placement: Lower-right
    - Keycap clearance: 15mm x 15mm

### LEDs
11. **D1-D5 - SK6812 SIDE-3535 (Neopixel)**
    - Package: 3535 side-emitting LED
    - Placement: Bottom edge, evenly spaced
    - Orientation: Light emission towards board edge
    - Data chain: D1 → D2 → D3 → D4 → D5

### Passive Components (0805 footprint unless noted)
12. **C1, C2**: 10μF ceramic (power decoupling - ESP32)
13. **C3, C4**: 0.1μF ceramic (decoupling - peripherals)
14. **C5**: 22μF ceramic (USB power)
15. **R1, R2**: 4.7kΩ (I2C pull-ups)
16. **R3, R4**: 10kΩ (switch pull-ups)
17. **R5**: 1kΩ (PROG resistor for TP4056)
18. **R6, R7**: 5.1kΩ (USB-C CC configuration)
19. **R8, R9**: 100kΩ and 47kΩ (voltage divider for battery monitoring)
20. **D6**: 1N5819 Schottky diode (battery protection)

### Mounting
21. **H1-H4**: M2.5 mounting holes
    - Placement: 2.5mm from each corner
    - Diameter: 2.7mm hole, 5mm copper keepout

## Routing Guidelines

### Power Distribution
- **VBAT (LiPo)**: 0.5mm traces, direct paths to TP4056 and load switch
- **3.3V Rail**: 0.5mm traces with star grounding from regulator
- **5V USB**: 0.5mm traces from USB-C to TP4056
- **GND**: Bottom layer copper pour with thermal reliefs to vias

### Signal Routing
- **I2C (SDA/SCL)**: 0.25mm traces, keep parallel, max length 100mm
- **SPI**: 0.25mm traces, matched lengths ±5mm, keep away from noisy signals
- **LED Data**: 0.25mm trace with 100Ω series resistor near first LED
- **Encoder**: 0.2mm traces with RC filtering (100nF to ground)

### RF Considerations (LoRa)
- Keep-out zone: 5mm around antenna
- No traces under antenna section
- Ground plane cutout if antenna is on-board
- 50Ω controlled impedance to antenna connector

### EMI/EMC
- Decoupling caps within 5mm of IC power pins
- Via stitching around high-speed signals (0.5mm spacing)
- Avoid 90° angles (use 45° or curved)

## Silkscreen Design - "Cyberpunk Geometric" Theme

### Top Silkscreen Features
1. **Circuit Traces Art**: Decorative traces that mimic actual copper routing
2. **Geometric Patterns**: Angular, hex-grid backgrounds in empty areas
3. **Functional Labels**:
   - "TX" and "RX" with data flow arrows
   - "PWR" with battery icon
   - "LoRa 900" near radio module
   - Component designators in small, modern font

### Bottom Silkscreen
- **Large Logo Area**: Hexagonal pattern forming project name
- **Version**: "v1.0 - 2024"
- **Copper Touchpads**: Areas marked "TOUCH ZONE" with no solder mask

## Special Features

### Tactile "Worry Stone" Zones (Bottom Layer)
Areas with solder mask removed to expose ENIG gold finish:
- **Zone 1**: 15mm x 15mm square, center-bottom
- **Zone 2**: 10mm diameter circle, top-right
- Pattern: Concentric circles etched in copper for texture

### LED Effects Programming
Suggested Neopixel animations:
- **Idle**: Slow cyan pulse
- **Transmitting**: Fast green chase
- **Receiving**: Blue sparkle
- **Error**: Red flash
- **Low Battery**: Yellow breathing

### Expansion Headers
Optional headers for future "Wings":
- **H1**: I2C breakout (VCC, GND, SDA, SCL)
- **H2**: SPI breakout (VCC, GND, MOSI, MISO, SCK, CS)
- **H3**: GPIO breakout (4x general purpose pins)

## Manufacturing Notes

### PCB Fabrication Settings (JLCPCB/PCBWay format)
```
Board Dimensions: 51 x 51 mm
Layers: 2
Material: FR-4 TG135
Thickness: 1.6 mm
Min Track/Spacing: 6/6 mil
Min Hole Size: 0.3 mm
Solder Mask: Matte Black (both sides)
Surface Finish: ENIG
Copper Weight: 1 oz (35 μm)
Gold Thickness: 1 U" (0.05 μm)
Via Process: Tenting
Remove Order Number: Yes (specify location if needed)
```

### Assembly Notes
1. Solder surface-mount components first (hot plate or reflow oven)
2. Hand-solder through-hole components (headers, switches)
3. Program ESP32-S3 via USB-C before final assembly
4. Test I2C bus, SPI bus, and GPIO functionality
5. Calibrate battery voltage monitoring
6. Load test firmware and configure LoRa parameters

## Bill of Materials (BOM)

| Ref | Qty | Value | Description | Package | Supplier Part # |
|-----|-----|-------|-------------|---------|-----------------|
| U1 | 1 | ESP32-S3-WROOM-1 | WiFi+BLE Module | QFN-56 | Espressif |
| U2 | 1 | E22-900M30S | 900MHz LoRa Module | SMD | EBYTE |
| U3 | 1 | DRV2605L | Haptic Driver | VSSOP-10 | TI |
| U4 | 1 | TP4056 | LiPo Charger IC | SOP-8 | Generic |
| SW1 | 1 | EC11 | Rotary Encoder | EC11 | Alps/TTC |
| SW2,SW3 | 2 | Kailh Choc | Low Profile Switch | Choc | Kailh |
| D1-D5 | 5 | SK6812-SIDE | RGB LED | 3535 | Generic |
| J1 | 1 | USB4105 | USB-C Connector | SMD | Generic |
| J2 | 1 | JST-PH-2 | Battery Connector | TH | JST |
| J3 | 1 | Header 1x4 | OLED Connector | 2.54mm | Generic |
| C1,C2 | 2 | 10μF | Ceramic Cap | 0805 | Generic |
| C3,C4 | 2 | 0.1μF | Ceramic Cap | 0805 | Generic |
| R1,R2 | 2 | 4.7kΩ | Resistor | 0805 | Generic |
| R3,R4 | 2 | 10kΩ | Resistor | 0805 | Generic |

## Design Files Checklist

To complete this project, you will need:
- [x] Schematic (.kicad_sch)
- [x] PCB Layout (.kicad_pcb)
- [ ] Gerber Files (manufacturing)
- [ ] Drill Files (.drl)
- [ ] Pick-and-Place (.csv)
- [ ] BOM (.csv)
- [ ] 3D Model (.step)
- [ ] Assembly Drawings (.pdf)

## Testing Procedure

### Power-On Test
1. Measure 3.3V rail (should be 3.28V - 3.35V)
2. Measure current draw (idle < 100mA)
3. USB-C connection (should enumerate as USB device)

### Functional Tests
1. I2C scan (should detect DRV2605L at 0x5A, OLED at 0x3C)
2. SPI communication with LoRa module
3. GPIO reading (all switches and encoder)
4. LED chain (test all 5 Neopixels)
5. Battery charging (measure charge current ~450-550mA)

---

## Design Philosophy Notes

This design embodies "The Board is the Product" philosophy:
- **Visibility**: Components are showcased, not hidden
- **Tactility**: Gold touch zones provide sensory feedback
- **Aesthetics**: Matte black + gold = premium cyberdeck look
- **Expandability**: Feather-compatible for endless mods
- **Engagement**: LEDs + haptics + mechanical switches = satisfying interaction

The neurodivergent-friendly design prioritizes:
- **Visual Interest**: Geometric patterns, clear labeling
- **Tactile Feedback**: Multiple textures and input methods
- **Clear Status**: LED indicators for all states
- **Modular Thinking**: Exposed bus lines show system architecture
