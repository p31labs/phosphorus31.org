# TETRAHEDRON PROTOCOL - Quick Reference Card
## Keep This Handy During Build Sessions

---

## 📊 NODE ASSIGNMENTS

| Node | Color | Name | Device ID |
|------|-------|------|-----------|
| 1 | 🔵 Blue | Dad | `DEVICE_ID = 1` |
| 2 | 🟢 Green | Son | `DEVICE_ID = 2` |
| 3 | 🟡 Yellow | Daughter | `DEVICE_ID = 3` |
| 4 | 🟣 Purple | Fourth | `DEVICE_ID = 4` |

---

## 🔌 PIN CONNECTIONS

### Feather ESP32-S3 Pinout:

```
                   USB-C Port
         ╔═══════════════════════════╗
         ║                           ║
    RST ─╫  ●                     ●  ╫─ A0
     3V ─╫  ●                     ●  ╫─ A1
     NC ─╫  ●                     ●  ╫─ A2
    GND ─╫  ●                     ●  ╫─ A3
   SCL1 ─╫  ●                     ●  ╫─ A4
   SDA1 ─╫  ●                     ●  ╫─ A5
      5 ─╫  ●  [LED DATA]         ●  ╫─ SCK
      6 ─╫  ●  [LoRa CS]          ●  ╫─ MOSI
      9 ─╫  ●  [Button 1]         ●  ╫─ MISO
     10 ─╫  ●  [Button 2]         ●  ╫─ RX
     11 ─╫  ●  [Button 3]         ●  ╫─ TX
     12 ─╫  ●  [Button 4]         ●  ╫─ 21
    GND ─╫  ●                     ●  ╫─ SCL
      7 ─╫  ●  [TFT CS]           ●  ╫─ SDA
     39 ─╫  ●  [TFT DC]           ●  ╫─ 3V
     40 ─╫  ●  [TFT RST]          ●  ╫─ EN
     38 ─╫  ●  [LoRa RST]         ●  ╫─ BAT
      8 ─╫  ●  [LoRa INT]         ●  ╫─ USB
         ╚═══════════════════════════╝
                   RESET
                  BUTTON
```

### LED Strip Connections:
- **Red Wire** → 5V (power)
- **Black Wire** → GND (ground)
- **Yellow/Data Wire** → Pin 5

### Button Connections (each):
- **One Side** → GPIO Pin (9, 10, 11, or 12)
- **Other Side** → GND
- (Using INPUT_PULLUP, reads LOW when pressed)

---

## 💻 ARDUINO IDE QUICK COMMANDS

### Upload Process:
1. Tools → Board → ESP32 → Adafruit Feather ESP32-S3 No PSRAM
2. Tools → Port → [Select your device]
3. Click **→** (Upload button)
4. Wait for "Done uploading"
5. Press RESET button on board

### Serial Monitor:
- Tools → Serial Monitor
- Set baud rate: **115200**
- Shows debug messages from your device

### If Upload Fails:
- Hold BOOT button while clicking Upload
- Or press RESET right before upload starts
- Try different USB cable
- Reduce upload speed: Tools → Upload Speed → 115200

---

## 🔋 BATTERY SPECIFICATIONS

### LiPo Battery (2500mAh):
- **Voltage Range:** 3.0V (empty) to 4.2V (full)
- **Nominal:** 3.7V
- **Capacity:** 2500mAh = 2.5 hours at 1000mA draw
- **Run Time:** 6-8 hours typical use

### Charging:
- **Time:** ~2 hours for full charge
- **Indicator:** Red LED = charging, Green = done
- **Safety:** Never charge unattended overnight

### Warning Signs:
- 🔴 **Swollen/Puffy:** STOP USING, dispose safely
- 🔴 **Very Hot:** Disconnect immediately
- 🔴 **Damaged:** Do not charge

---

## 📡 LORA RADIO SPECS

### Frequency:
- **USA:** 915 MHz
- **Europe:** 868 MHz
- **Asia:** 433 MHz
- **Must match regulatory requirements!**

### Range:
- **Line of Sight:** 2+ miles (3+ km)
- **Urban/Indoor:** 0.5-1 mile (800m-1.6km)
- **Through Walls:** Degraded but functional

### RSSI Interpretation:
```
-40 to -80 dBm  = ●●●●● Excellent
-80 to -100 dBm = ●●●●○ Good
-100 to -115 dBm = ●●●○○ Fair
-115 to -120 dBm = ●●○○○ Poor
Below -120 dBm   = ●○○○○ Connection Lost
```

### Power Levels:
- **5 dBm:** ~3mW (low power, short range)
- **13 dBm:** ~20mW (standard)
- **20 dBm:** ~100mW (good range)
- **23 dBm:** ~200mW (maximum legal)

---

## 🎨 LED STRIP INFO

### NeoPixel Specifications:
- **Type:** WS2812B or SK6812
- **Voltage:** 5V
- **Current per LED:** ~60mA at full white brightness
- **20 LEDs at full brightness:** 1200mA (1.2A)

### Power Calculations:
```
Current = LED_COUNT × 60mA × (brightness / 255)

Examples:
- 20 LEDs at 50 brightness: 20 × 60 × (50/255) = 235mA
- 20 LEDs at 100 brightness: 20 × 60 × (100/255) = 470mA
- 20 LEDs at 255 brightness: 20 × 60 × (255/255) = 1200mA
```

### Color Codes:
```cpp
strip.Color(R, G, B)

Red:     strip.Color(255, 0, 0)
Green:   strip.Color(0, 255, 0)
Blue:    strip.Color(0, 0, 255)
Yellow:  strip.Color(255, 255, 0)
Purple:  strip.Color(255, 0, 255)
Cyan:    strip.Color(0, 255, 255)
White:   strip.Color(255, 255, 255)
```

---

## 🛠️ SOLDERING QUICK TIPS

### Temperature:
- **Lead-Free Solder:** 700°F (370°C)
- **Leaded Solder:** 600°F (315°C)

### Technique:
1. Heat the PAD and WIRE together (2-3 seconds)
2. Touch solder to the JOINT (not the iron)
3. Let solder flow and wet both surfaces
4. Remove iron, let cool without moving

### Good Joint:
- ✅ Shiny, smooth cone shape
- ✅ Solder wets both pad and component
- ✅ No gaps or cold joints

### Bad Joint:
- ❌ Dull, grainy appearance (cold joint)
- ❌ Blobby or peaked (too much solder)
- ❌ Gaps visible (reheat and add more solder)

### Safety:
- Always wear safety glasses
- Work in ventilated area
- Wash hands after
- Never touch the tip (700°F!)

---

## 🔍 MULTIMETER TESTING

### Continuity Test:
- Set to continuity mode (🔊 symbol)
- Touch probes to two points
- Beep = connected
- No beep = open circuit

### Voltage Test:
- Set to DC voltage (V⎓)
- Red probe to positive
- Black probe to ground
- Read voltage on display

### Common Tests:
```
Battery voltage: 3.7-4.2V
5V rail: 4.8-5.2V
3.3V rail: 3.2-3.4V
GPIO pin HIGH: 3.3V
GPIO pin LOW: 0V
```

---

## 📱 NODE STATUS INDICATORS

### On Screen:
```
● = Node online
○ = Node offline
▲ = Full tetrahedron formed
▽ = Waiting for nodes
```

### LED Patterns:
- **Solid Color:** That node is online
- **Flashing:** Receiving message from that node
- **Rainbow:** All nodes connected (success!)
- **Red Flashing:** Error or low battery

---

## 🎯 QUICK TROUBLESHOOTING

### Device won't turn on:
1. Check battery is connected
2. Check battery is charged (>3.5V)
3. Try USB power

### Screen is black:
1. Check backlight (shine flashlight - see faint image?)
2. Check header pins soldered
3. Re-upload code

### LEDs don't work:
1. Check power (red to 5V, black to GND)
2. Check data (yellow to Pin 5)
3. Check direction (arrows point away from controller)

### Radio won't connect:
1. Check antenna is attached
2. Verify same frequency on both devices
3. Start at 5 feet apart
4. Check Serial Monitor for errors

### Button doesn't respond:
1. Check wiring (button to GND and GPIO pin)
2. Verify pinMode set to INPUT_PULLUP
3. Test with multimeter (should read 3.3V unpressed, 0V pressed)

---

## 📋 FIRMWARE SELECTION

### hello_world.ino (Sunday #1):
- Basic screen test
- LED animations
- Learning firmware
- Change `BUILDER_NAME`

### walkie_talkie.ino (Sunday #3):
- Two-device messaging
- Quick message buttons
- Range testing
- Set `DEVICE_ID` to 1 or 2

### tetrahedron.ino (Sunday #4):
- Full 4-node mesh
- Network status display
- Group messaging
- Set `DEVICE_ID` to 1, 2, 3, or 4

---

## 🎁 CHRISTMAS DAY SEQUENCE

1. All 4 boxes wrapped, arranged in pyramid
2. Everyone opens together
3. Power on simultaneously
4. Watch screens: "SEARCHING..."
5. Nodes find each other one by one
6. "TETRAHEDRON COMPLETE"
7. LEDs pulse in sync
8. Send first family message! 🎄

---

## 📞 EMERGENCY CONTACTS

**Adafruit Support:**
- Forums: forums.adafruit.com
- Email: support@adafruit.com
- Phone: 1-888-877-1875

**This Project:**
- Refer to full documentation files
- Check troubleshooting guide
- Test systematically
- Don't panic - everything is fixable!

---

**"The tetrahedron is strong. The tetrahedron is unbreakable." ▲**

---

*Print this card and laminate it for durability during builds!*
