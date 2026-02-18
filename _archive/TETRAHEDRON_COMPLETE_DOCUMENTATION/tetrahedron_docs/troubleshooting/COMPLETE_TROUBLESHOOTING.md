# TETRAHEDRON PROTOCOL - Troubleshooting Guide
## When Things Don't Work (And How to Fix Them)

**Remember: Debugging is NORMAL. Even professional engineers spend 50% of their time fixing problems!**

---

## 🚨 QUICK DIAGNOSTIC FLOWCHART

```
Device won't turn on?
    ├─→ Battery connected? → Check polarity, reseat connector
    ├─→ Battery charged? → Plug in USB-C, check charging LED
    └─→ Power switch on? → Toggle switch, check for loose connection

Screen is black?
    ├─→ Backlight on? → Shine flashlight - can you see image?
    ├─→ Contrast issue? → Re-upload firmware, check screen voltage
    └─→ Connection problem? → Check solder joints on header pins

LEDs don't work?
    ├─→ Power connected? → Check 5V and GND connections
    ├─→ Data line OK? → Check Pin 5 connection, verify continuity
    └─→ Wrong direction? → LEDs have arrows - data flows one way

Radio won't connect?
    ├─→ Antenna attached? → Screw in tight, check connection
    ├─→ Same firmware? → Both devices need identical code
    └─→ Too far apart? → Start at 5 feet, work your way out

Messages not received?
    ├─→ Correct Node ID? → Verify DEVICE_ID setting
    ├─→ Encryption match? → SECRET_KEY must be same on all devices
    └─→ Signal too weak? → Check RSSI, move closer

Battery dies fast?
    ├─→ LEDs too bright? → Reduce brightness in code
    ├─→ Constant transmit? → Check heartbeat interval
    └─→ Screen too bright? → Reduce backlight (if possible)
```

---

## ⚡ POWER ISSUES

### Problem: Device won't turn on at all

**Symptoms:**
- No lights
- Screen black
- LEDs off
- No response when pressing buttons

**Step-by-step diagnosis:**

1. **Check the battery:**
   ```
   - Unplug and replug the battery connector
   - Look for red/green LED on Feather when plugged in
   - Red = charging, Green = charged, Nothing = problem
   ```

2. **Test with USB power:**
   ```
   - Plug in USB-C cable
   - Does it work now?
   - If YES: Battery is dead or disconnected
   - If NO: Problem with the board itself
   ```

3. **Check battery voltage:**
   ```
   - Use multimeter
   - Should read 3.7-4.2 volts
   - Below 3.0V = battery needs charging or is damaged
   - Exactly 0.0V = battery disconnected
   ```

4. **Check polarity:**
   ```
   - Battery JST connector has a tab/notch
   - Can only plug in one way (usually)
   - But double-check: Red wire should go to +
   ```

**Solution paths:**

**If battery is dead:**
- Charge for 2-3 hours
- Red LED should light during charging
- Green LED when done
- Try again

**If battery is connected wrong:**
- IMMEDIATELY unplug
- Check for magic smoke or hot components
- If board smells burnt, it may be damaged
- Reconnect with correct polarity

**If still no power:**
- Board may have failed component
- Check for visible damage
- Try different USB cable
- Test with known-good Feather (if available)

---

### Problem: Battery drains in under 2 hours

**Expected runtime: 6-8 hours normal use**

**Diagnosis:**

Check these power hogs:

1. **LED Strip brightness:**
   ```cpp
   strip.setBrightness(50);  // Current setting
   ```
   - Above 100 = very power hungry
   - Try reducing to 30-40
   - Calculate: 20 LEDs × 60mA × (brightness/255) = current draw

2. **Transmission frequency:**
   ```cpp
   if (now - lastHeartbeat > 5000) {  // Sends every 5 seconds
   ```
   - Too frequent = battery drain
   - Try 10000 (10 seconds)
   - Transmission uses ~120mA for ~1 second

3. **Screen always on:**
   - TFT draws ~100mA constantly
   - Consider adding sleep mode after 5 minutes idle

**Solutions:**

**Quick fix:**
```cpp
strip.setBrightness(30);  // Reduce LED power
// Change heartbeat from 5000 to 10000 (10 seconds)
```

**Better fix:** Add power management
```cpp
// Turn off LEDs after 30 seconds of idle
if (millis() - lastActivity > 30000) {
    strip.clear();
    strip.show();
}
```

**Best fix:** Add sleep mode (advanced)
```cpp
// Put ESP32 to light sleep when idle
// Wake on button press or incoming message
```

---

## 📺 SCREEN ISSUES

### Problem: Screen is completely black

**Diagnosis steps:**

1. **Check backlight:**
   - Shine bright flashlight at screen
   - Can you see a very faint image?
   - If YES: Backlight issue
   - If NO: Screen not receiving data

2. **Check connections:**
   ```
   Visually inspect all header pins
   Look for:
   - Cold solder joints (dull, grainy appearance)
   - Bridges between pins (solder connecting two pins)
   - Missing connections (no solder visible)
   ```

3. **Test with Serial Monitor:**
   ```
   Open Arduino IDE → Tools → Serial Monitor
   Set baud rate to 115200
   Look for error messages:
   - "TFT init failed" = screen not responding
   - Gibberish = wrong baud rate
   - Nothing = code not running
   ```

**Solutions:**

**For backlight issue:**
- Check Pin 32 (backlight control) if your screen has it
- Some screens have a jumper to set backlight always-on
- Backlight LED may be damaged (rare)

**For connection issues:**
- Re-flow solder joints (heat them again with iron)
- Check for bent pins on screen
- Verify screen is firmly seated in header

**For init failure:**
```cpp
// Try different initialization sequence
tft.begin();
delay(100);  // Add small delay
tft.fillScreen(ILI9341_BLACK);
```

---

### Problem: Screen shows garbage/random pixels

**Causes:**
1. Poor SPI connections
2. Wrong screen driver
3. Interference from other devices

**Quick test:**
```cpp
void setup() {
    tft.begin();
    tft.fillScreen(ILI9341_RED);  // Entire screen should be red
    delay(2000);
    tft.fillScreen(ILI9341_GREEN);
    delay(2000);
    tft.fillScreen(ILI9341_BLUE);
}
```

**If colors are wrong:**
- Check TFT_RGB_ORDER in config
- Try changing to TFT_BGR

**If still garbage:**
- Check SPI wiring (MOSI, MISO, SCK pins)
- Add 0.1µF capacitor between 5V and GND (reduces noise)
- Move LED strip wires away from screen wires

---

### Problem: Screen works but is dim/washed out

**Solutions:**

1. **Check contrast setting** (if supported):
   ```cpp
   // Some screens have contrast adjustment
   // Usually not needed for ILI9341
   ```

2. **Check viewing angle:**
   - TFT screens have limited viewing angles
   - Try looking straight-on
   - Adjust case to optimize viewing position

3. **Clean the screen:**
   - Fingerprints affect brightness
   - Use microfiber cloth
   - Don't use solvents

---

## 💡 LED ISSUES

### Problem: LEDs don't light up at all

**Diagnosis:**

1. **Check power connections:**
   ```
   Multimeter test:
   - Red wire to GND: Should read ~5V
   - Black wire to GND: Should read 0V
   - If wrong, you have a wiring issue
   ```

2. **Check data connection:**
   ```
   - Yellow wire should go to Pin 5 on Feather
   - Check continuity with multimeter
   - Check solder joint is solid
   ```

3. **Check LED strip direction:**
   ```
   - Look for tiny arrows on the strip
   - Arrows show data direction
   - First LED should receive data
   - Must connect to the INPUT end!
   ```

**Solutions:**

**If wired backwards:**
- Unsolder and flip the strip
- OR use the OUTPUT end of strip (usually has 3 pads)

**If data pin wrong:**
```cpp
#define LED_PIN  5  // Make sure this matches your wiring!
```

**If strip is damaged:**
- Cut off first LED and try again
- First LED often gets damaged during soldering
- Can lose 1-2 LEDs without issue

---

### Problem: Only first LED lights up

**Cause:** Data not propagating through strip

**Check:**
1. Is strip cut or damaged between LEDs?
2. Is voltage sufficient? (Use 5V, not 3.3V)
3. Is data signal too weak?

**Solutions:**

```cpp
// Try reducing LED count temporarily
#define LED_COUNT 5  // Test with just 5 LEDs

// If 5 work but 20 don't:
// - Voltage drop along strip (add power injection)
// - Data signal degradation (add resistor)
```

**Hardware fix:**
- Add 330Ω resistor between Pin 5 and LED data line
- Helps clean up signal
- Solder between Feather and LED strip

---

### Problem: LEDs show wrong colors

**Common causes:**

1. **Wrong LED type in code:**
   ```cpp
   // Try changing this:
   Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
   
   // To this:
   Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_RGB + NEO_KHZ800);
   
   // Or this:
   Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRBW + NEO_KHZ800);
   ```

2. **Color order mismatch:**
   - GRB = Green, Red, Blue
   - RGB = Red, Green, Blue
   - Try both and see which looks right

**Test code:**
```cpp
void loop() {
    strip.setPixelColor(0, strip.Color(255, 0, 0));  // Should be RED
    strip.show();
    delay(1000);
    
    strip.setPixelColor(0, strip.Color(0, 255, 0));  // Should be GREEN
    strip.show();
    delay(1000);
    
    strip.setPixelColor(0, strip.Color(0, 0, 255));  // Should be BLUE
    strip.show();
    delay(1000);
}
```

If red shows as green, change NEO_GRB to NEO_RGB (or vice versa).

---

## 📡 RADIO/CONNECTIVITY ISSUES

### Problem: "LoRa init failed" error

**Diagnosis:**

1. **Check SPI connections:**
   ```
   The RFM95 FeatherWing should just stack on top
   But verify:
   - All pins are aligned
   - No bent pins
   - Seated fully and evenly
   ```

2. **Check chip select pin:**
   ```cpp
   #define RFM95_CS   6  // Must match your board
   ```
   Default for FeatherWing is 6, but verify

3. **Test the radio module:**
   ```
   Upload simple test code:
   - Just try rf95.init()
   - Print result to Serial Monitor
   - If it fails, radio may be damaged
   ```

**Solutions:**

**For loose connection:**
- Remove and reseat the FeatherWing
- Press firmly but gently
- Check that headers are perpendicular to board

**For damaged radio:**
- Visually inspect for damage
- Check that antenna connector isn't shorted
- Test with known-good module if available

---

### Problem: Devices can't find each other

**Symptoms:**
- "SEARCHING FOR NETWORK..." forever
- No heartbeat messages received
- RSSI shows nothing

**Step-by-step fix:**

**Step 1: Verify both devices are working individually**
```
Open Serial Monitor on each device
Should see:
- "Radio ready!"
- "→ Heartbeat sent" every 5 seconds
- No error messages
```

**Step 2: Check firmware matches**
```
Both devices must have:
- Same RF95_FREQ (915.0)
- Same SECRET_KEY (if using encryption)
- Same message format
```

**Step 3: Check antennas**
```
- Antenna screwed in tight?
- Not touching metal case/ground?
- Roughly vertical orientation?
```

**Step 4: Reduce distance**
```
- Start with devices 3 feet apart
- If still no connection at 3 feet, something is wrong
- If connection works at 3 feet, it's a range issue
```

**Step 5: Check frequency**
```cpp
#define RF95_FREQ 915.0  // USA
// Europe uses 868.0
// Asia uses 433.0
// Make sure you're legal for your region!
```

---

### Problem: Connection drops frequently

**Causes:**
1. Weak signal (too far apart)
2. Interference
3. Obstacles
4. Power issues

**Diagnosis:**

Watch RSSI values:
```
-40 to -80 dBm = Excellent
-80 to -100 dBm = Good
-100 to -115 dBm = Fair
-115 to -120 dBm = Poor (will drop soon)
Below -120 dBm = Connection lost
```

**Solutions:**

**For distance issues:**
```cpp
// Increase transmit power
rf95.setTxPower(23, false);  // Max power (23 dBm = ~200mW)
```

**For interference:**
- Move away from WiFi routers
- Avoid metal structures
- Try different locations
- Use different frequency if legal

**For obstacle issues:**
- LoRa penetrates walls well, but not metal
- Concrete weakens signal significantly
- Trees and rain affect signal
- Line-of-sight is always best

---

### Problem: Messages are corrupted/garbled

**Causes:**
1. Encryption key mismatch
2. Packet corruption (too much noise)
3. Buffer overflow

**Check encryption first:**
```cpp
const uint8_t SECRET_KEY = 42;  // Must match on ALL devices
```

**If using encryption**, ALL devices need the same key. Even one different device will cause problems.

**For packet corruption:**
```cpp
// Add error checking
if (rf95.recv(buf, &len)) {
    // Check packet length
    if (len < sizeof(Packet)) {
        Serial.println("Short packet - corruption");
        return;
    }
    
    // Check for valid data
    if (pkt.fromNode < 1 || pkt.fromNode > 4) {
        Serial.println("Invalid sender - corruption");
        return;
    }
}
```

---

## 🔘 BUTTON ISSUES

### Problem: Buttons don't respond

**Check:**

1. **Wiring:**
   ```
   - One side of button → GPIO pin
   - Other side of button → GND
   - Using INPUT_PULLUP mode in code
   ```

2. **Code:**
   ```cpp
   pinMode(BTN1_PIN, INPUT_PULLUP);
   
   // Button press reads as LOW (not HIGH)
   if (digitalRead(BTN1_PIN) == LOW) {
       // Do something
   }
   ```

3. **Mechanical:**
   - Is button physically clicking?
   - Could be damaged/stuck
   - Try different button

---

### Problem: Button triggers multiple times (bouncing)

**Cause:** Mechanical switches "bounce" when pressed - they make and break contact rapidly.

**Solution - Software debounce:**
```cpp
void checkButton() {
    static unsigned long lastPress = 0;
    unsigned long now = millis();
    
    if (digitalRead(BTN1_PIN) == LOW) {
        if (now - lastPress > 300) {  // 300ms debounce
            lastPress = now;
            sendMessage();
        }
    }
}
```

**Solution - Hardware debounce:**
- Add 0.1µF capacitor across button terminals
- Smooths out bouncing

---

## 🔋 BATTERY/CHARGING ISSUES

### Problem: Battery won't charge

**Check:**

1. **Charger connection:**
   ```
   - USB-C cable firmly inserted?
   - Try different cable
   - Try different USB power source
   ```

2. **Charging indicator:**
   ```
   - Red LED should light when charging
   - If no LED, check polarity of battery
   - Check TP4056 charging circuit
   ```

3. **Battery health:**
   ```
   - Measure voltage: Should be 3.0-4.2V
   - If 0V, battery may be dead (over-discharged)
   - If swollen/puffy, STOP - battery is damaged
   ```

**Solutions:**

**For over-discharged battery:**
- Some LiPo batteries have protection circuit
- Won't charge if voltage drops below 2.5V
- May need special charger to "wake up" battery
- If old battery, consider replacing

**For damaged battery:**
- **DANGER:** Swollen batteries can catch fire
- Do NOT puncture or charge
- Dispose at battery recycling center
- Replace with new battery

---

## 🐛 SOFTWARE DEBUGGING

### Problem: Code won't compile

**Common errors:**

**"Library not found"**
```
Solution:
- Tools → Manage Libraries
- Search for missing library
- Install latest version
- Restart Arduino IDE
```

**"Board not selected"**
```
Solution:
- Tools → Board → ESP32 Arduino → Adafruit Feather ESP32-S3
- If board not in list, reinstall ESP32 board support
```

**"Port not found"**
```
Solution:
- Check USB cable is connected
- Try different USB port
- Install CP210x or CH340 drivers if needed
- Press RESET on Feather and try again
```

**Syntax errors**
```
- Missing semicolon ;
- Mismatched { } brackets
- Typos in variable names
- Using " instead of "
```

---

### Problem: Code uploads but device doesn't work

**Check Serial Monitor first:**

1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 115200
3. Press RESET on Feather
4. Read startup messages

**Look for:**
```
"Radio init failed" → LoRa problem
"Screen init failed" → TFT problem
"IMU not found" → Accelerometer problem (if used)
Gibberish → Wrong baud rate
Nothing → Code not running or Serial.begin() missing
```

**Debugging technique:**
```cpp
// Add debug prints everywhere
Serial.println("Starting setup...");
Serial.println("Initializing screen...");
tft.begin();
Serial.println("Screen OK!");

// This helps find WHERE the code stops working
```

---

### Problem: Device freezes/crashes

**Symptoms:**
- Stops responding
- Screen freezes
- Must reset to recover

**Common causes:**

1. **Watchdog timer triggered:**
   ```cpp
   // If your loop() takes too long, ESP32 watchdog resets it
   // Add this to prevent:
   delay(10);  // Small delays let system breathe
   yield();    // Or explicitly yield
   ```

2. **Stack overflow:**
   ```cpp
   // Too many large arrays in functions
   // Move large arrays to global scope or use heap
   String bigArray[1000];  // Bad in function
   ```

3. **Memory leak:**
   ```cpp
   // Check free heap
   Serial.print("Free heap: ");
   Serial.println(ESP.getFreeHeap());
   
   // Should be > 100000 bytes
   // If decreasing over time = memory leak
   ```

---

## 📋 TESTING CHECKLIST

When debugging, work through this systematically:

### Power System:
- [ ] Battery connected correctly
- [ ] Battery voltage 3.7-4.2V
- [ ] Device turns on with battery
- [ ] Device turns on with USB
- [ ] Charging indicator works

### Screen:
- [ ] Backlight visible
- [ ] Shows clear image
- [ ] Colors correct
- [ ] Touch responsive (if applicable)
- [ ] No flickering

### LEDs:
- [ ] All LEDs light up
- [ ] Colors accurate
- [ ] Responds to code
- [ ] No flickering
- [ ] Brightness adjustable

### Radio:
- [ ] Module detected (init succeeds)
- [ ] Antenna attached
- [ ] Can send messages
- [ ] Can receive messages
- [ ] RSSI values reasonable

### Buttons:
- [ ] All buttons click properly
- [ ] Code detects presses
- [ ] No false triggers
- [ ] Debouncing works
- [ ] LEDs respond to presses

### Software:
- [ ] Compiles without errors
- [ ] Uploads successfully
- [ ] Runs without crashing
- [ ] Serial output makes sense
- [ ] Features work as expected

---

## 🆘 WHEN TO ASK FOR HELP

**Try to fix it yourself first:** Use this guide, google the error message, check connections.

**Ask for help when:**
- You've tried everything in this guide
- Something smells burnt or looks damaged
- You're not sure if something is safe
- You've been stuck for over an hour
- Your kid is getting really frustrated

**Where to get help:**
- Adafruit forums: https://forums.adafruit.com
- Arduino forums: https://forum.arduino.cc
- Reddit: r/arduino, r/esp32
- Local maker spaces often have experts

**When asking for help, include:**
- Photo of your setup
- Copy of your code
- Serial Monitor output
- Description of what you've already tried

---

## 💪 DEBUGGING MINDSET

**Remember:**
- Debugging is a skill, not a failure
- Every engineer spends half their time debugging
- Each bug you fix teaches you something
- Your kid is watching how you handle frustration
- Model persistence, not perfection

**When stuck, try:**
1. Take a break (seriously, 10 min helps)
2. Explain the problem out loud (rubber duck debugging)
3. Start from basics (does power work? Does USB work?)
4. Isolate the problem (comment out code until it works)
5. Test one thing at a time

**Celebrate small wins:**
- "We figured out it was the solder joint!"
- "The screen works now, even if LEDs don't!"
- "We learned what NOT to do!"

---

**You've got this. Every problem is solvable. ▲**
