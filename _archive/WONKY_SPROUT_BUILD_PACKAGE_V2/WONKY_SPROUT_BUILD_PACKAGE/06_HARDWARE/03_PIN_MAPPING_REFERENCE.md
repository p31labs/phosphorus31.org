# PHENIX NAVIGATOR - PIN MAPPING REFERENCE
## ESP32-S3 to Component Connections

**Board:** Waveshare ESP32-S3 Touch LCD 3.5" (Type B)  
**Total GPIOs Required:** 15 pins

---

## COMPLETE PIN ASSIGNMENT TABLE

| Component | Signal | ESP32-S3 GPIO | Wire Color | Notes |
|-----------|--------|---------------|------------|-------|
| **LoRa Radio (SPI Bus)** |
| E22 Module | MISO | GPIO 37 | Blue | SPI data in |
| E22 Module | MOSI | GPIO 35 | Green | SPI data out |
| E22 Module | SCK | GPIO 36 | Yellow | SPI clock |
| E22 Module | CS/NSS | GPIO 34 | Orange | Chip select |
| E22 Module | DIO1 | GPIO 33 | Purple | Interrupt |
| E22 Module | RST | GPIO 47 | Gray | Reset |
| E22 Module | BUSY | GPIO 21 | White | Busy signal |
| E22 Module | VCC | 3.3V | Red | Power |
| E22 Module | GND | GND | Black | Ground |
| **Left Side Controls** |
| Rocker Switch | Up | GPIO 13 | - | Digital input, pullup |
| Rocker Switch | Down | GPIO 14 | - | Digital input, pullup |
| Red Switch | Via Ladder | GPIO 4 (ADC) | - | See resistor ladder |
| **Right Side Controls** |
| Encoder | A (CLK) | GPIO 40 | - | Quadrature A |
| Encoder | B (DT) | GPIO 41 | - | Quadrature B |
| Encoder | SW | - | - | Optional, not used |
| Green Switch | Via Ladder | GPIO 4 (ADC) | - | See resistor ladder |
| **Shoulder Triggers** |
| L-Trigger | Via Ladder | GPIO 4 (ADC) | - | See resistor ladder |
| R-Trigger | Via Ladder | GPIO 4 (ADC) | - | See resistor ladder |
| **LED System** |
| WS2812B Strip | Data | GPIO 5 | Green/White | NeoPixel data |
| WS2812B Strip | VCC | 5V | Red | Power (5V rail) |
| WS2812B Strip | GND | GND | Black | Ground |
| **Safety Systems** |
| Dead Man Sensor | Touch Out | GPIO 42 | - | Digital input |
| E-Stop Button | NC Contact | Battery + Line | - | Inline with power |
| **Expansion Port** |
| I2C (Future) | SDA | GPIO 8 | - | Reserved |
| I2C (Future) | SCL | GPIO 9 | - | Reserved |

---

## RESISTOR LADDER DETAIL

**Purpose:** Read 4 mechanical switches using 1 analog pin

**Circuit:**
```
3.3V ──┬── 10kΩ (pullup to keep voltage high when no button)
       │
       ├── [Green Switch] ── 1kΩ ──┐
       │                            │
       ├── [Red Switch] ── 2.2kΩ ───┤
       │                            ├── GPIO 4 (ADC)
       ├── [L-Trigger] ── 4.7kΩ ────┤
       │                            │
       └── [R-Trigger] ── 10kΩ ─────┘
                                    │
                                   GND
```

**Voltage Readings (Approximate):**
| Button Pressed | Resistor Value | Expected Voltage | ADC Reading (12-bit) |
|----------------|----------------|------------------|---------------------|
| None | Pullup (10kΩ) | ~3.3V | ~4095 |
| Green | 1kΩ | ~0.3V | ~400 |
| Red | 2.2kΩ | ~0.7V | ~850 |
| L-Trigger | 4.7kΩ | ~1.4V | ~1700 |
| R-Trigger | 10kΩ | ~2.2V | ~2700 |

**Code Example:**
```cpp
int buttonValue = analogRead(GPIO_4);

if (buttonValue < 600) {
  // Green button (0.3V)
  handleGreenButton();
}
else if (buttonValue < 1200) {
  // Red button (0.7V)
  handleRedButton();
}
else if (buttonValue < 2000) {
  // L-Trigger (1.4V)
  handleLTrigger();
}
else if (buttonValue < 3200) {
  // R-Trigger (2.2V)
  handleRTrigger();
}
else {
  // No button pressed
}
```

---

## POWER DISTRIBUTION

**Power Flow:**
```
Battery 3.7V (3000mAh LiPo)
    ↓
E-Stop NC Contact (normally closed, opens when pressed)
    ↓
Power Switch (SPST slide or toggle)
    ↓
Waveshare Board Power Input (5V/USB or Battery connector)
    ↓
Onboard Regulators:
├── 5V Rail (for LED strip)
├── 3.3V Rail (for ESP32, LoRa, switches)
└── Screen Power (from USB or battery)
```

**Charging:**
```
USB-C Port on Waveshare Board
    ↓
Onboard TP4056-style Charger IC
    ↓
Battery (charges automatically when USB plugged in)
```

**CRITICAL:** E-stop must be inline with battery (+), NOT between charger and battery.

---

## GPIO AVAILABILITY CHECK

**Waveshare ESP32-S3 3.5" Touch (Type B) GPIO Usage:**

**RESERVED BY SCREEN (Do NOT Use):**
- GPIO 0-7: Screen data/control (varies by model)
- GPIO 15-16: Touch I2C or screen control
- GPIO 43-46: USB (built-in, don't use)

**AVAILABLE FOR CUSTOM USE:**
- GPIO 8-14: ✓ Available
- GPIO 21: ✓ Available
- GPIO 33-42: ✓ Available (some may be touch I2C)
- GPIO 47-48: ✓ Available

**VERIFY WHEN BOARD ARRIVES:**
1. Check Waveshare schematic (usually on their wiki)
2. Test each GPIO with simple blink test before final wiring
3. Adjust pin assignments if conflicts found

---

## WIRING COLOR CODE STANDARD

**Suggested wire colors (for consistency across units):**

**Power:**
- Red = 3.3V or 5V
- Black = GND
- Yellow = Regulated power from switch

**SPI Bus (LoRa):**
- Blue = MISO
- Green = MOSI
- Yellow = SCK
- Orange = CS
- Purple = DIO1
- Gray = RST
- White = BUSY

**Controls:**
- Use solid colors for easy tracing
- Label wires if not color-coding

**LED Strip:**
- Red = 5V
- Black = GND
- Green or White = Data

---

## FIRMWARE VARIANT CONFIGURATION

**Create custom Meshtastic variant file:**

**File:** `variants/phenix_navigator/variant.h`

**Key definitions:**
```cpp
#define USE_SX1262  // LoRa chipset
#define LORA_DIO1 33
#define LORA_BUSY 21
#define LORA_RESET 47
#define LORA_MISO 37
#define LORA_MOSI 35
#define LORA_SCK 36
#define LORA_CS 34

#define BUTTON_PIN 4  // Resistor ladder ADC
#define BUTTON_NEED_PULLUP

#define LED_PIN 5  // WS2812B data
#define LED_NUM_PIXELS 8
#define LED_INVERTED 0

#define ENCODER_A 40
#define ENCODER_B 41

#define ROCKER_UP 13
#define ROCKER_DOWN 14

#define TOUCH_SENSOR 42  // Dead man's switch

// I2C for expansion
#define I2C_SDA 8
#define I2C_SCL 9

// Screen (already handled by base variant)
// Touch controller on I2C (usually GPIO 15/16)
```

---

## TESTING SEQUENCE

**When wiring each unit, test in this order:**

**1. Power Test:**
```
□ Battery voltage 3.7-4.2V
□ E-stop cuts power when pressed
□ Power switch controls board
□ USB charging works
□ Screen lights up when powered
```

**2. GPIO Test (Before connecting components):**
```
Flash simple test code that:
□ Toggles each GPIO (watch with LED or multimeter)
□ Reads each input GPIO (verify pullup works)
□ Confirms no conflicts with screen/touch
```

**3. Radio Test:**
```
□ SPI communication works (query radio chip ID)
□ Radio responds to commands
□ Can set frequency, power, bandwidth
□ Transmit test (need 2 units to verify)
```

**4. Control Test:**
```
□ Rocker up/down reads correctly
□ Encoder outputs quadrature signals
□ Resistor ladder voltages correct for each button
□ All 4 buttons distinguishable
```

**5. LED Test:**
```
□ All 8 LEDs light up
□ Can individually address each LED
□ Color accuracy (red, green, blue, white)
□ Brightness control works
```

**6. Integration Test:**
```
□ All systems work simultaneously
□ No GPIO conflicts
□ No power issues (voltage drop when transmitting)
□ Firmware boots and runs
```

---

## TROUBLESHOOTING PIN CONFLICTS

**If a GPIO doesn't work as expected:**

**Step 1: Check if screen is using it**
- Look up Waveshare schematic
- Test GPIO in isolation (disconnect component, run blink test)

**Step 2: Try alternate GPIO**
- If conflict confirmed, choose different available GPIO
- Update firmware variant file
- Re-wire component

**Step 3: Document the change**
- Update this pin map
- Note in build log
- Inform others building (Tyler, etc.)

**Common conflicts:**
- GPIO 15/16 often used for touch I2C
- GPIO 0-7 often used for screen parallel interface
- GPIO 43-46 are USB (can't use)

---

## FINAL VERIFICATION CHECKLIST

Before declaring unit complete:

**Physical:**
- [ ] All 15+ connections soldered cleanly
- [ ] No solder bridges (adjacent pins touching)
- [ ] All wires have strain relief (not pulling on pads)
- [ ] Antenna pigtail connected firmly (IPEX connector seated)
- [ ] External antenna attached (SMA threaded on)

**Electrical:**
- [ ] Continuity test: Each wire end-to-end
- [ ] Resistance test: Resistor ladder values correct
- [ ] Voltage test: 3.3V and 5V rails present
- [ ] No shorts: Power to ground = infinite resistance

**Functional:**
- [ ] Power on/off works
- [ ] E-stop immediately cuts power
- [ ] Screen responsive to touch
- [ ] All buttons register
- [ ] Encoder scrolls smoothly
- [ ] LEDs display correctly
- [ ] Radio joins mesh network

**Software:**
- [ ] Firmware flashed successfully
- [ ] Device name set
- [ ] Channel configured
- [ ] Canned messages loaded
- [ ] LED patterns configured

**If all checked: Unit ready for deployment**

---

*Pin Mapping Reference for Phenix Navigator*  
*Verify against actual Waveshare board when received*  
*Update this document if pin assignments change*
