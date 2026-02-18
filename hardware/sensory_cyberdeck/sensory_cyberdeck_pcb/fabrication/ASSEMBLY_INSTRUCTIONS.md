# Sensory Cyberdeck - Assembly Instructions

## Tools Required
- Temperature-controlled soldering iron (350-370°C)
- Solder (leaded: 63/37 or lead-free: SAC305)
- Tweezers (precision, ESD-safe)
- Flux pen
- Solder wick or desoldering pump
- Multimeter
- Magnifying glass or microscope (optional but helpful)
- Hot air station (optional, for SMD rework)
- Isopropyl alcohol (IPA 90%+) for cleaning
- ESD mat and wrist strap

## Component Assembly Order

### Stage 1: Surface Mount Components (SMD)

**Recommended Method:** Reflow oven or hot plate
**Alternative:** Hand soldering with fine-tip iron

#### Order of Assembly:
1. **Smallest Components First (0805 passives)**
   - All resistors (R1-R10)
   - All capacitors (C1-C7)
   - Tips: Apply solder paste, place components, reflow at 240-250°C peak

2. **ICs and Modules**
   - U5: AMS1117-3.3 (SOT-223 regulator)
   - U3: DRV2605L (VSSOP-10)
   - U4: TP4056 (SOP-8)
   - Tips: Use flux, align carefully, solder one pin first, then others

3. **Diode**
   - D6: 1N5819 (SOD-123)
   - Note: Observe polarity! Cathode (line) should match silkscreen

4. **LEDs**
   - D1-D5: SK6812-SIDE LEDs
   - **CRITICAL:** These are polarity-sensitive and heat-sensitive
   - Solder at 300°C max, 2-3 seconds per pad
   - Check orientation: notch/mark indicates pin 1 (DIN)
   - Test each LED before proceeding to next

5. **Large Modules**
   - U1: ESP32-S3-WROOM-1
   - U2: E22-900M30S LoRa module
   - Tips: Apply flux to all pads, align carefully, solder shield pads first

6. **USB-C Connector**
   - J1: USB4105-GF-A
   - Tips: Align carefully with board edge, solder shield tabs first
   - Check for shorts between pins with multimeter

### Stage 2: Through-Hole Components

1. **Headers and Connectors**
   - J3: 1x4 pin header (OLED connector)
   - J2: JST-PH 2.0mm battery connector
   - Tips: Insert from top, solder from bottom, keep perpendicular

2. **Mechanical Components**
   - SOCK2, SOCK3: Kailh Choc hotswap sockets
   - Tips: Align carefully, solder from bottom, use plenty of heat
   
   - SW1: EC11 rotary encoder
   - Tips: Ensure mechanical stability tabs are fully seated

3. **Switches (Final Step)**
   - SW2, SW3: Kailh Choc switches
   - Note: These click into the hotswap sockets, no soldering needed
   - Test switch operation before installing keycaps

## Testing Procedure

### Power-On Test (Before Battery Connection)
1. **Visual Inspection**
   - Check for solder bridges (especially on USB-C and ESP32)
   - Verify all components are oriented correctly
   - Check for cold solder joints

2. **Continuity Test**
   - GND to GND: Should beep (continuity)
   - VCC to GND: Should NOT beep (no short)
   - Check USB-C pins for shorts

3. **First Power-Up (USB Only)**
   - Connect USB-C cable to computer
   - Measure 3.3V rail (should be 3.28-3.35V)
   - Check current draw (<100mA at idle)
   - ESP32 should enumerate as USB device

### Functional Testing

#### Test 1: I2C Bus
```bash
# Using esptool or Arduino IDE
# Scan I2C bus - should find:
# 0x5A - DRV2605L (Haptic Driver)
# 0x3C or 0x3D - OLED Display (if connected)
```

#### Test 2: GPIO Inputs
- Press rotary encoder: Should read LOW on GPIO15
- Rotate encoder: Should see pulses on GPIO12 and GPIO13
- Press mechanical switches: Should read LOW on GPIO16 and GPIO17

#### Test 3: LED Chain
```cpp
// Test code (Arduino/ESP32)
#include <FastLED.h>
#define LED_PIN 25
#define NUM_LEDS 5
CRGB leds[NUM_LEDS];

void setup() {
  FastLED.addLeds<SK6812, LED_PIN, GRB>(leds, NUM_LEDS);
}

void loop() {
  // Cycle through colors
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CRGB::Red;
    FastLED.show();
    delay(200);
    leds[i] = CRGB::Black;
  }
}
```

#### Test 4: LoRa Module
```cpp
// Use LoRa library
// Check SPI communication
// Verify frequency is legal in your region
```

#### Test 5: Haptic Feedback
```cpp
// Use DRV2605 library
// Test various waveforms
// Connect vibration motor to OUT+ and OUT-
```

#### Test 6: Battery Charging
1. Connect 3.7V LiPo battery to J2 (observe polarity!)
2. Connect USB-C
3. Check charging LED on TP4056
4. Measure charge current (~450-550mA)
5. Measure battery voltage on ADC (GPIO4)

## Programming ESP32-S3

### Using Arduino IDE:
1. Install ESP32 board support: https://docs.espressif.com/projects/arduino-esp32/
2. Select Board: "ESP32S3 Dev Module"
3. Set USB Mode: "Hardware CDC and JTAG"
4. Connect USB-C cable
5. Hold BOOT button while clicking Upload (if needed)

### Using esptool:
```bash
esptool.py --chip esp32s3 --port /dev/ttyACM0 write_flash 0x0 firmware.bin
```

## Firmware Installation

### Sample Firmware Features:
- LoRa messaging (check your local regulations!)
- OLED display driver
- Rotary encoder input
- Mechanical switch debouncing
- Neopixel LED effects
- Haptic feedback patterns
- Battery level monitoring

### Recommended Libraries:
- RadioLib (LoRa)
- Adafruit_GFX (Display)
- FastLED (LEDs)
- Adafruit_DRV2605 (Haptics)

## Troubleshooting

### Issue: ESP32 won't enumerate on USB
- Check USB-C solder joints
- Verify 3.3V rail voltage
- Hold BOOT button during connection
- Try different USB cable/port

### Issue: LEDs don't work
- Check orientation (DIN vs DOUT)
- Verify 5V power to first LED
- Check data line continuity
- Test each LED individually

### Issue: No I2C devices detected
- Check SDA/SCL pull-up resistors (R1, R2)
- Verify 3.3V power to devices
- Check for solder bridges
- Verify correct GPIO pins in code

### Issue: Battery won't charge
- Check battery polarity (Red = +, Black = GND)
- Verify USB 5V present
- Check TP4056 orientation
- Measure PROG resistor (R5 = 1.2kΩ)

### Issue: LoRa module not responding
- Verify SPI connections (MOSI, MISO, SCK, CS)
- Check RST and DIO0 connections
- Ensure antenna is connected (or 50Ω termination)
- Check module orientation

## Safety Notes

### ESD Protection
- Always use ESD wrist strap when handling board
- Store in anti-static bag when not in use
- Discharge yourself before touching components

### Battery Safety
- Never reverse battery polarity
- Don't short battery terminals
- Use proper LiPo charging practices
- Don't charge unattended
- Dispose of damaged batteries properly

### RF Safety
- Check local regulations for 900MHz transmission
- Ensure antenna is connected before transmitting
- Don't transmit without proper licensing (if required)
- Keep RF power levels legal in your jurisdiction

## Final Assembly

1. **Clean the Board**
   - Use IPA 90%+ and soft brush
   - Clean all flux residue
   - Dry completely

2. **Inspect Gold Touch Zones**
   - Should be smooth, clean ENIG finish
   - No oxidation or contamination
   - Wipe gently with IPA if needed

3. **Install Keycaps**
   - Press keycaps onto Choc switches
   - Should click firmly into place

4. **Add Knob**
   - Attach knob to rotary encoder shaft
   - Secure with set screw (if applicable)

5. **Connect Display**
   - Insert OLED module into J3 header
   - Verify orientation (GND-VCC-SCL-SDA)

6. **Battery Installation**
   - Route battery wire safely
   - Connect to J2 (red = +, black = GND)
   - Secure battery with double-sided tape or holder

7. **Optional: Enclosure**
   - Design a 3D-printed case to showcase the board
   - Use clear acrylic to show off the aesthetics
   - Ensure access to USB-C and controls

## Congratulations!

Your Sensory Cyberdeck is now complete. This device embodies the "Board is the Product" philosophy with its beautiful matte black and gold aesthetic, tactile touch zones, and engaging interactive elements.

Enjoy your creation and share it with the maker community!

---

## Support and Community

- GitHub: [project repository]
- Discord: [maker community]
- Reddit: r/cyberDeck
- Email: [support email]

## License

This hardware design is open source under the CERN-OHL-S v2 license.
Firmware examples are MIT licensed.

Share, modify, and improve! Just give credit and share your improvements back to the community.
