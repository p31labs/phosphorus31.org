# PHENIX NAVIGATOR - COMPLETE BOM
## Hardware Build - 8 Units + Development

**Last Updated**: December 9, 2024
**Target Build**: 8 production units + 2 development/test units
**Timeline**: 27 days to completion

---

## SUMMARY

| Category | Items | Qty Needed | Qty Ordered | Status |
|----------|-------|------------|-------------|--------|
| **Core Electronics** | 4 | 10 | ✅ 8 | ORDERED |
| **Controls** | 6 | 86 | ⚠️ TBD | VERIFY |
| **Power** | 2 | 10 | ✅ 8 | ORDERED |
| **Mechanical** | 3 | 10 | ⚠️ 8 | PARTIAL |
| **Consumables** | 5 | - | ❌ TBD | NEEDED |
| **Tools** | 4 | - | ❓ ? | VERIFY |

**Total Items**: 24 unique components
**Total Quantity**: ~120+ pieces
**Estimated Cost**: $800-1,000 (for 10 units)

---

## CORE ELECTRONICS

### 1. Display Module ✅
**Part**: Waveshare ESP32-S3 Touch LCD 3.5" (Type B)
- **Quantity**: 8 (production) + 2 (dev/test) = **10 total**
- **Status**: ✅ ORDERED
- **Specs**:
  - ESP32-S3 dual-core processor
  - 3.5" TFT LCD (480x320 resolution)
  - Capacitive touch (GT911 controller)
  - QSPI interface (faster than parallel)
  - Onboard peripherals:
    - Audio codec (ES8311)
    - 6-axis IMU (QMI8658)
    - RTC (PCF85063)
    - SD card slot
  - 32-pin expansion header
  - USB-C programming/power
- **Price**: ~$30-35 each
- **Total**: $300-350

**Critical Note**: Type B uses QSPI for display (saves pins vs parallel), but onboard peripherals still consume many GPIOs. **I/O expander required**.

---

### 2. LoRa Radio Module ✅
**Part**: Ebyte E22-900T22S (or E22-900T30S)
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ✅ ORDERED
- **Specs**:
  - Frequency: 868-915 MHz (region-dependent)
  - Power: 22dBm (160mW) or 30dBm (1W)
  - Range: 3-5 km (urban) / 10-30 km (line-of-sight)
  - Interface: SPI
  - Antenna: External SMA connector
  - Voltage: 3.3V
- **Price**: ~$12-15 each
- **Total**: $120-150
- **Antenna Required**: See accessories section

---

### 3. Battery (LiPo) ✅
**Part**: 3.7V 2000mAh LiPo battery
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ✅ ORDERED
- **Specs**:
  - Voltage: 3.7V nominal (4.2V max, 3.0V min)
  - Capacity: 2000mAh (2Ah)
  - Connector: JST-PH 2.0mm 2-pin
  - Dimensions: ~60mm x 35mm x 8mm (verify fit)
  - Protection: Built-in protection circuit (PCM)
- **Price**: ~$8-10 each
- **Total**: $80-100
- **Runtime**: 6-8 hours typical use

**Safety Note**: LiPo batteries require proper handling. Do not puncture, crush, or short-circuit.

---

### 4. I/O Expander ⚠️
**Part**: MCP23017 I2C GPIO Expander
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ❌ **NOT YET ORDERED - CRITICAL**
- **Options**:
  - **Option A**: DIP-28 chip (requires soldering to perfboard)
  - **Option B**: Breakout module (easier, but larger)
- **Specs**:
  - 16 GPIO pins (2x 8-bit ports)
  - I2C interface (address 0x20-0x27)
  - Internal pull-up resistors
  - Interrupt capability
  - 5V tolerant inputs (3.3V operation)
- **Price**: 
  - Chip only: $1.50-2 each
  - Breakout module: $3-5 each
- **Total**: $15-50 (depending on option)

**Why Required**: Type B board doesn't have enough free GPIOs for all controls. MCP23017 handles all buttons/switches over I2C (2 wires).

**Recommendation**: Order breakout modules for ease of assembly unless you're comfortable soldering SMD/DIP chips.

---

## CONTROLS

### 5. Mini Rocker Switch ⚠️
**Part**: SPDT Mini Rocker (Up/Down)
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ⚠️ VERIFY ORDERED
- **Specs**:
  - Type: SPDT (3-position: Up/Center/Down)
  - Mounting: Panel mount
  - Cutout: 15mm x 8mm (rectangular)
  - Actuation: Momentary or latching (momentary preferred)
  - Voltage rating: 3.3V compatible
- **Price**: ~$2-3 each
- **Total**: $20-30

**Wiring**: Connects to MCP23017 pins PA2 (up), PA3 (down), PA4 (center/enter)

---

### 6. Rotary Encoder ⚠️
**Part**: EC11 Rotary Encoder with Push Button
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ⚠️ VERIFY ORDERED
- **Specs**:
  - Type: Incremental rotary encoder
  - Detents: 20-24 per revolution
  - Push button: Integrated switch
  - Mounting: Panel mount (nut + washer)
  - Cutout: 7mm diameter hole
  - Pins: 5-pin (A, B, C, SW, GND)
- **Price**: ~$2-3 each
- **Total**: $20-30

**Wiring**: 
- A/B phases → Direct GPIO (interrupt-driven)
- Button → MCP23017 pin PA7

---

### 7. Encoder Knob ⚠️
**Part**: 6mm shaft knob (aluminum or plastic)
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ⚠️ VERIFY ORDERED
- **Specs**:
  - Shaft diameter: 6mm (D-shaft or round with setscrew)
  - Material: Aluminum (premium) or ABS plastic
  - Height: 15-20mm
  - Diameter: 20-25mm
  - Color: Black (matches aesthetic)
- **Price**: $1-3 each
- **Total**: $10-30

---

### 8. Mechanical Switches (Red/Green) ⚠️
**Part**: 12mm tactile push button switches
- **Quantity**: 
  - Red: 8 + 2 = 10
  - Green: 8 + 2 = 10
  - **Total**: **20 switches**
- **Status**: ⚠️ VERIFY ORDERED
- **Specs**:
  - Type: Momentary tactile push button
  - Mounting: Panel mount (snap-in or screw)
  - Cutout: 12mm diameter
  - Cap diameter: 14mm
  - Colors: Red (back/cancel), Green (select/enter)
  - LED: Optional (backlit)
  - Voltage: 3.3V compatible
- **Price**: $1-2 each
- **Total**: $20-40

**Wiring**: Connect to MCP23017 pins PA5 (red), PA6 (green)

---

### 9. Trigger Switches (L/R) ⚠️
**Part**: 12mm tactile push button switches (same as above)
- **Quantity**: 
  - L-Trigger: 8 + 2 = 10
  - R-Trigger: 8 + 2 = 10
  - **Total**: **20 switches**
- **Status**: ⚠️ VERIFY ORDERED (likely same order as #8)
- **Specs**: Same as mechanical switches above
- **Colors**: Black or gray (differentiate from red/green)
- **Price**: $1-2 each
- **Total**: $20-40

**Wiring**: Connect to MCP23017 pins PA0 (L-trigger), PA1 (R-trigger)

---

### 10. E-Stop Button ✅
**Part**: 16mm Emergency Stop Button (Mushroom Head)
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ✅ ORDERED (arriving Dec 4)
- **Specs**:
  - Type: Latching (twist-to-unlock)
  - Mounting: Panel mount (nut + washer)
  - Cutout: 16mm diameter (17mm with tolerance)
  - Color: Red mushroom cap
  - Contacts: SPDT (normally closed for safety)
  - Voltage: 250V AC rated (overkill for 3.7V DC)
- **Price**: ~$3-5 each
- **Total**: $30-50
- **Delivery**: Thursday, December 4

**Wiring**: 
- Series with battery positive (hard power cut)
- Status sense line → MCP23017 pin PB0

---

## STATUS INDICATORS

### 11. LED Strip ✅
**Part**: Amomii 8-pack WS2812B LED strips (8 LEDs per stick)
- **Quantity**: 1 pack (contains 8 sticks) + 1 spare pack = **2 packs**
- **Status**: ✅ ORDERED (arriving Dec 5)
- **Specs**:
  - LEDs per stick: 8
  - Total sticks: 8 per pack (16 sticks total)
  - Length per stick: 59mm
  - Width: 9mm
  - Spacing: ~7.5mm between LED centers
  - Voltage: 5V (can run on 3.7V with reduced brightness)
  - Protocol: WS2812B (addressable)
  - Connector: 3-pin (Data, 5V, GND) pre-wired
- **Price**: ~$15-20 per pack
- **Total**: $30-40
- **Delivery**: Friday, December 5

**Usage**: One stick per unit, centered under screen in diffusion channel.

---

## POWER COMPONENTS

### 12. USB-C Breakout/Port
**Part**: USB-C female port module
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ❌ NOT ORDERED
- **Options**:
  - **Option A**: Panel-mount USB-C extension (easiest)
  - **Option B**: PCB-mount USB-C breakout (compact)
  - **Option C**: Use onboard USB-C on Waveshare (simplest)
- **Specs**:
  - Type: USB-C female socket
  - Mounting: Panel mount or PCB mount
  - Cutout: 10mm x 4mm (if panel mount)
  - Power only (no data required for charging)
- **Price**: $2-5 each
- **Total**: $20-50

**Recommendation**: Use onboard USB-C on Waveshare board (no extra part needed).

---

### 13. Battery Connector/Harness
**Part**: JST-PH 2.0mm connector and wire
- **Quantity**: 10 sets (male + female)
- **Status**: ❌ NOT ORDERED (may come with batteries)
- **Specs**:
  - Type: JST-PH 2.0mm 2-pin
  - Wire gauge: 22AWG or 24AWG
  - Length: 100mm
  - Polarity: Red (+), Black (-)
- **Price**: $0.50-1 per set
- **Total**: $5-10

**Note**: Check if batteries include connector. If not, order separately.

---

## MECHANICAL COMPONENTS

### 14. LoRa Antenna
**Part**: 915MHz (or 868MHz) SMA antenna
- **Quantity**: 8 + 2 = **10 total**
- **Status**: ❌ NOT ORDERED
- **Options**:
  - **Option A**: Stubby 2dBi antenna (compact)
  - **Option B**: Flexible 3dBi antenna (better range)
  - **Option C**: External high-gain antenna (best range)
- **Specs**:
  - Frequency: 868-915 MHz (match your E22 module)
  - Connector: SMA male (or RP-SMA, check E22 module)
  - Gain: 2-3 dBi typical
  - Length: 50-100mm
- **Price**: $3-8 each
- **Total**: $30-80

**Critical**: Verify E22 module connector type (SMA vs RP-SMA) before ordering.

---

### 15. Heat-Set Inserts
**Part**: M3 brass heat-set inserts
- **Quantity**: 
  - Per unit: 4 corners + 4 internal mounts = 8 inserts
  - Total: 8 × 10 = **80 inserts**
  - Buy: 100-pack (allows for mistakes)
- **Status**: ❌ NOT ORDERED
- **Specs**:
  - Size: M3 × 5mm (length) × 4.5mm (outer diameter)
  - Material: Brass (for heat insertion)
  - Type: Knurled or threaded exterior
- **Price**: $10-15 per 100-pack
- **Total**: $10-15

**Installation**: Use soldering iron at 200°C to press into 3D printed holes.

---

### 16. Machine Screws
**Part**: M3 × 6mm machine screws
- **Quantity**: 
  - Per unit: 8 screws (4 shell + 4 internal)
  - Total: 8 × 10 = **80 screws**
  - Buy: 100-pack
- **Status**: ❌ NOT ORDERED
- **Specs**:
  - Size: M3 × 6mm length
  - Type: Button head or countersunk (button head preferred)
  - Material: Stainless steel or black oxide
  - Drive: Phillips or hex socket
- **Price**: $5-10 per 100-pack
- **Total**: $5-10

---

## CONSUMABLES

### 17. Wire (30AWG Silicone)
**Part**: 30AWG silicone stranded wire kit
- **Quantity**: 1 kit (multiple colors)
- **Status**: ❌ NOT ORDERED
- **Specs**:
  - Gauge: 30AWG (thin, flexible)
  - Insulation: Silicone (heat-resistant, flexible)
  - Colors: Red, black, white, yellow, blue, green
  - Length: 10 meters per color (60m total)
  - Stranded: Yes (flexible, not solid core)
- **Price**: $15-25 per kit
- **Total**: $15-25

**Usage**: Internal wiring between controls and boards (short runs).

---

### 18. Solder and Flux
**Part**: Lead-free solder + flux pen
- **Quantity**: 
  - Solder: 100g spool
  - Flux: 1 pen
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Solder: 60/40 tin-lead or lead-free (0.8mm diameter)
  - Flux: Rosin-based flux pen
- **Price**: 
  - Solder: $10-15
  - Flux: $5-10
- **Total**: $15-25

---

### 19. Adhesive/Tape
**Part**: Double-sided tape (3M VHB or similar)
- **Quantity**: 1 roll
- **Status**: ❌ NOT ORDERED
- **Specs**:
  - Type: 3M VHB tape (high-bond)
  - Width: 10mm or 20mm
  - Thickness: 0.5-1mm
  - Length: 3-5 meters
- **Price**: $10-15
- **Total**: $10-15

**Usage**: Mount LED strip, secure battery, attach small components.

---

### 20. 3D Printing Filament
**Part**: PETG filament (1kg spool)
- **Quantity**: 2-3 spools (1kg each)
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Material: PETG (strong, heat-resistant)
  - Color: Black or dark gray
  - Diameter: 1.75mm
  - Weight: 1kg per spool
- **Price**: $20-30 per spool
- **Total**: $40-90

**Usage**: 
- Front shell: ~80g per unit
- Back shell: ~60g per unit
- Chassis: ~40g per unit
- Total per unit: ~180g
- Total for 10 units: ~1.8kg (need 2 spools)

---

### 21. Hot Glue or Epoxy
**Part**: Hot glue sticks or 2-part epoxy
- **Quantity**: 
  - Hot glue: 50-pack sticks
  - Epoxy: 1 tube set
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Hot glue: 7mm or 11mm diameter sticks
  - Epoxy: 5-minute or 30-minute cure
- **Price**: $5-15
- **Total**: $5-15

**Usage**: Secure components, strain relief for wires.

---

## TOOLS (ONE-TIME PURCHASES)

### 22. Soldering Iron
**Part**: Temperature-controlled soldering station
- **Quantity**: 1 (if not already owned)
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Temperature range: 200-450°C
  - Tip type: Chisel or conical (interchangeable)
  - Power: 60W minimum
  - Features: Digital display, stand, tip cleaner
- **Price**: $30-80
- **Total**: $30-80 (one-time)

---

### 23. Multimeter
**Part**: Digital multimeter (DMM)
- **Quantity**: 1 (if not already owned)
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Voltage: DC/AC measurement
  - Current: Amperage (min 10A)
  - Resistance: Continuity tester
  - Features: Auto-ranging, backlight
- **Price**: $15-40
- **Total**: $15-40 (one-time)

**Usage**: Test circuits, verify voltages, check continuity.

---

### 24. Wire Strippers
**Part**: Precision wire strippers
- **Quantity**: 1 (if not already owned)
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Gauge range: 22-30 AWG
  - Type: Self-adjusting or manual
- **Price**: $10-25
- **Total**: $10-25 (one-time)

---

### 25. Helping Hands / PCB Holder
**Part**: Third-hand soldering jig
- **Quantity**: 1 (optional but helpful)
- **Status**: ❓ VERIFY ON HAND
- **Specs**:
  - Clips: 2-4 alligator clips
  - Magnifier: Built-in magnifying glass (optional)
  - Base: Weighted or magnetic
- **Price**: $10-30
- **Total**: $10-30 (one-time)

---

## COST BREAKDOWN

### Electronics
| Item | Qty | Unit Price | Total |
|------|-----|------------|-------|
| Waveshare Display | 10 | $32 | $320 |
| E22 LoRa Module | 10 | $13 | $130 |
| Battery (2000mAh) | 10 | $9 | $90 |
| MCP23017 Expander | 10 | $4 | $40 |
| **Subtotal** | - | - | **$580** |

### Controls
| Item | Qty | Unit Price | Total |
|------|-----|------------|-------|
| Rocker Switch | 10 | $2.50 | $25 |
| Rotary Encoder | 10 | $2.50 | $25 |
| Encoder Knob | 10 | $2 | $20 |
| Switches (Red/Green) | 20 | $1.50 | $30 |
| Trigger Switches | 20 | $1.50 | $30 |
| E-Stop Button | 10 | $4 | $40 |
| LED Strip Pack | 2 | $17 | $34 |
| **Subtotal** | - | - | **$204** |

### Power & Connectivity
| Item | Qty | Unit Price | Total |
|------|-----|------------|-------|
| LoRa Antenna | 10 | $5 | $50 |
| USB-C (use onboard) | 0 | $0 | $0 |
| Battery Connector | 10 | $0.75 | $8 |
| **Subtotal** | - | - | **$58** |

### Mechanical
| Item | Qty | Unit Price | Total |
|------|-----|------------|-------|
| Heat-Set Inserts (100pk) | 1 | $12 | $12 |
| M3 Screws (100pk) | 1 | $8 | $8 |
| **Subtotal** | - | - | **$20** |

### Consumables
| Item | Qty | Unit Price | Total |
|------|-----|------------|-------|
| Wire Kit (30AWG) | 1 | $20 | $20 |
| Solder & Flux | 1 | $20 | $20 |
| 3M VHB Tape | 1 | $12 | $12 |
| PETG Filament (2kg) | 2 | $25 | $50 |
| Hot Glue/Epoxy | 1 | $10 | $10 |
| **Subtotal** | - | - | **$112** |

### Tools (if needed)
| Item | Qty | Unit Price | Total |
|------|-----|------------|-------|
| Soldering Iron | 1 | $50 | $50 |
| Multimeter | 1 | $25 | $25 |
| Wire Strippers | 1 | $15 | $15 |
| Helping Hands | 1 | $15 | $15 |
| **Subtotal** | - | - | **$105** |

---

## GRAND TOTAL

| Category | Cost |
|----------|------|
| Electronics | $580 |
| Controls | $204 |
| Power & Connectivity | $58 |
| Mechanical | $20 |
| Consumables | $112 |
| **Total (Materials)** | **$974** |
| Tools (if needed) | $105 |
| **Grand Total** | **$1,079** |

**Cost per Unit**: $97 (materials only, 10 units)

---

## WHAT YOU NEED TO ORDER IMMEDIATELY

### Priority 1 (Critical - Order Today)
- [ ] **MCP23017 I/O Expander** (10× breakout modules)
  - Amazon: Search "MCP23017 breakout module"
  - Quantity: 10 (or 2× 5-packs)
  - Price: ~$40 total
  - **Blocker**: Without this, controls won't work on Type B board

### Priority 2 (High - Order This Week)
- [ ] **LoRa Antennas** (10× 915MHz SMA)
  - Verify E22 module connector type first
  - Quantity: 10
  - Price: ~$50 total

- [ ] **Wire Kit** (30AWG silicone)
  - Quantity: 1 kit
  - Price: ~$20

- [ ] **Heat-Set Inserts** (M3 × 5mm, 100-pack)
  - Quantity: 1 pack
  - Price: ~$12

- [ ] **M3 Screws** (6mm button head, 100-pack)
  - Quantity: 1 pack
  - Price: ~$8

- [ ] **3M VHB Tape** (10mm width)
  - Quantity: 1 roll
  - Price: ~$12

### Priority 3 (Medium - Order Next Week)
- [ ] **PETG Filament** (1.75mm, black, 2kg)
  - Quantity: 2 spools
  - Price: ~$50

- [ ] **Solder & Flux** (if not on hand)
  - Quantity: 1 set
  - Price: ~$20

- [ ] **Hot Glue or Epoxy**
  - Quantity: 1 set
  - Price: ~$10

### Priority 4 (Low - Verify On Hand)
- [ ] **Battery Connectors** (JST-PH 2.0mm)
  - Check if included with batteries
  - If not: order 10 sets (~$8)

- [ ] **Tools** (soldering iron, multimeter, etc.)
  - Verify what you already have
  - Order missing items as needed

---

## VERIFICATION CHECKLIST

### Already Ordered ✅
- [x] Waveshare ESP32-S3 displays (8×)
- [x] E22 LoRa modules (8×)
- [x] Batteries 2000mAh (8×)
- [x] E-Stop buttons (8×, arriving Dec 4)
- [x] LED strips (2 packs, arriving Dec 5)

### Need to Verify ⚠️
- [ ] Rocker switches (10×)
- [ ] Rotary encoders (10×)
- [ ] Encoder knobs (10×)
- [ ] Red switches (10×)
- [ ] Green switches (10×)
- [ ] Trigger switches (20×)

### Need to Order ❌
- [ ] MCP23017 expanders (10×) - **CRITICAL**
- [ ] LoRa antennas (10×)
- [ ] Wire kit (1×)
- [ ] Heat-set inserts (100pk)
- [ ] M3 screws (100pk)
- [ ] 3M tape (1 roll)
- [ ] PETG filament (2 spools)
- [ ] Consumables (solder, glue, etc.)

---

## TIMELINE

### Week 1 (Dec 2-8)
- ✅ E-Stop buttons arrive (Dec 4)
- ✅ LED strips arrive (Dec 5)
- ❌ Order MCP23017 expanders (TODAY)
- ❌ Order wire, inserts, screws, tape

### Week 2 (Dec 9-15)
- 📦 All electronics arrive
- 📦 MCP23017 modules arrive (2-day shipping)
- 📦 Mechanical parts arrive
- 🧪 Test one unit on breadboard
- ✅ Verify pin mapping

### Week 3 (Dec 16-22)
- 🖨️ 3D print test template (flat)
- ✅ Verify fitment
- 🖨️ Print first full unit (20 hours)
- 🔧 Assemble first unit
- 🧪 Test first unit

### Week 4 (Dec 23-29)
- 🖨️ Print remaining 9 units (parallel if possible)
- 🔧 Assemble 10 units
- 🧪 Test all units
- ✅ Quality control

**Target Completion**: December 29, 2024

---

## NOTES

### Critical Path Items
1. **MCP23017 Expander** - Without this, Type B board won't work
2. **LoRa Antenna** - Verify connector type before ordering
3. **Pin Mapping** - Test one unit before committing to CAD/printing

### Assembly Order
1. Test on breadboard (1 unit)
2. Verify pin mapping
3. Print test template
4. Verify mechanical fitment
5. Print first full unit
6. Assemble and test
7. Mass produce (remaining 9 units)

### Risk Factors
- MCP23017 not ordered yet (critical blocker)
- Pin mapping not verified (could break everything)
- LoRa antenna connector mismatch (prevents radio function)
- 3D print failures (need buffer time)

---

## RECOMMENDATIONS

1. **Order MCP23017 TODAY** - This is your critical path
2. **Test one unit on breadboard** - Don't commit to printing until verified
3. **Verify all control parts arrived** - Check rocker, encoder, switches
4. **Buy extra consumables** - Wire, solder, tape (run out mid-project)
5. **Get spare filament** - 2kg minimum, 3kg recommended

---

**READY TO ORDER?**
