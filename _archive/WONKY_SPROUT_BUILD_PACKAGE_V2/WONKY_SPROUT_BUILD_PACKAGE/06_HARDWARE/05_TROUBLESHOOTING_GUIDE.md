# PHENIX NAVIGATOR - TROUBLESHOOTING GUIDE
## Quick Reference for Common Issues

---

## POWER ISSUES

### "Unit Won't Power On"

**Symptoms:** Screen stays black, no lights, no response

**Check:**
1. Battery charged? (Plug USB-C for 10 min, try again)
2. Power switch in ON position? (Slide opposite direction)
3. E-stop button locked? (Twist to unlock, button should pop up)
4. Battery connector seated? (Unplug/replug MX1.25 connector)
5. Fuse blown? (Check if kit has inline fuse)

**Test:**
- Multimeter on battery terminals: Should read 3.7-4.2V
- Multimeter on board 3.3V rail: Should read 3.3V when powered
- USB-C plugged in: Screen should light up even without battery

**Fix:**
- Dead battery → Charge 30+ minutes
- Loose connector → Reseat firmly
- E-stop stuck → Twist harder, may need WD-40
- Bad switch → Bypass temporarily, replace switch
- Board damage → Contact Will

---

### "Battery Drains Too Fast"

**Symptoms:** <12 hours battery life on full charge

**Normal:** 24-36 hours typical use, 18-24 heavy use

**Causes:**
1. Screen timeout too long (should turn off after 60 sec)
2. Radio transmitting constantly (other units offline, keeps searching)
3. LED strip too bright (draws more power)
4. Battery degraded (old/damaged cell)
5. Firmware issue (crash loop, constant wake)

**Check:**
- Settings → Screen timeout: Should be 60 seconds
- Settings → Power mode: Should be "Normal" or "Power Save"
- LED brightness: Reduce to 50% if at 100%
- Battery voltage after full charge: Should be 4.15-4.2V (if <4.0V, bad battery)

**Fix:**
- Adjust screen timeout (Settings → Display → Timeout)
- Enable power save mode (Settings → Power → Power Save)
- Dim LEDs (Settings → LED → Brightness)
- Turn off unit when not in use (don't leave in standby 24/7)
- Replace battery if degraded (contact Will)

---

### "Won't Charge / USB-C Not Working"

**Symptoms:** Plug in USB-C, no charge indicator, battery stays low

**Check:**
1. USB-C cable works? (Try different cable, test with phone)
2. Wall adapter sufficient? (Need 5V 1A minimum, 2A better)
3. Charge LED visible? (Small LED on board, usually red when charging)
4. Battery connector attached? (Charger needs battery connected to work)
5. Port damaged? (Inspect for bent pins, debris)

**Test:**
- Different cable + different adapter
- Check voltage at USB-C port with multimeter (should be 5V)
- Look for charge LED on board (if no LED, not charging)

**Fix:**
- Bad cable → Replace cable
- Weak adapter → Use phone charger (5V 2A)
- Debris in port → Clean with toothpick, compressed air
- Broken port → Requires rework, contact Will
- Bad charge circuit → Board replacement needed

---

## SCREEN ISSUES

### "Screen Blank But Unit Powers On"

**Symptoms:** LED lights work, can hear sounds, but screen black

**Check:**
1. Screen connector seated? (Ribbon cable or connector on back of screen)
2. Backlight working? (Shine flashlight at angle, can you see faint image?)
3. Brightness setting at 0%? (Try pressing bright-up button)
4. Screen physically damaged? (Cracks, pressure marks)

**Test:**
- Power cycle (off/on)
- Toggle brightness (if firmware has brightness controls)
- Remove/reseat screen connector
- Test screen on different board (if you have spare)

**Fix:**
- Loose connector → Reseat ribbon cable, secure with tape
- Backlight dead → Screen replacement needed
- Firmware glitch → Reflash firmware
- Physical damage → Screen replacement

---

### "Touch Screen Not Responsive"

**Symptoms:** Screen displays but doesn't respond to touches

**Check:**
1. Protective film still on? (Peel off factory screen protector)
2. Screen dirty? (Wipe with soft cloth)
3. Touch controller I2C connected? (GPIO 15/16 usually)
4. Firmware recognizes touch controller? (Check logs)
5. Too hot or cold? (Capacitive touch doesn't work well at extremes)

**Test:**
- Clean screen thoroughly
- Power cycle
- Check if physical buttons work (encoder, switches) - if yes, touch IC issue
- Reflash firmware (may fix touch driver)

**Fix:**
- Dirty screen → Clean with microfiber cloth
- Firmware bug → Reflash or update firmware
- Loose I2C connection → Check GPIO 15/16 solder joints
- Dead touch controller → Screen replacement
- Temperature → Let unit warm up/cool down to room temp

---

## RADIO/MESH ISSUES

### "Can't Send Messages"

**Symptoms:** Try to send message, nothing happens or error

**Check:**
1. Other units powered on? (Need 2+ units for mesh)
2. Within range? (500m max line-of-sight, less with obstacles)
3. On same channel? (All units must have matching channel name/key)
4. Antenna attached? (CRITICAL - will damage radio if not)
5. Radio module detected? (Check Meshtastic settings → Radio)

**Test:**
- Bring units close together (<10m) and try again
- Verify channel names match exactly (case-sensitive)
- Check encryption keys match (should auto-sync if from same family)
- Factory reset and reconfigure (Settings → Factory Reset)

**Fix:**
- Out of range → Move closer
- Wrong channel → Settings → Channel → Match all units
- Antenna missing → ATTACH ANTENNA NOW (power off first)
- Radio not detected → Check 9 solder connections on radio module
- Firmware issue → Reflash firmware

---

### "Radio Module Not Detected"

**Symptoms:** Settings say "No radio found" or similar error

**CRITICAL:** If radio never worked, CHECK ANTENNA FIRST (powered on without antenna = damaged radio)

**Check:**
1. All 9 wires soldered? (MISO, MOSI, SCK, CS, DIO1, RST, BUSY, 3.3V, GND)
2. Correct GPIO pins? (Verify against pin map)
3. Power to radio? (3.3V present at radio VCC pin)
4. SPI bus working? (Check continuity on MISO/MOSI/SCK wires)
5. Firmware variant correct? (Must be configured for SX1262)

**Test with multimeter:**
- 3.3V at radio VCC pin (should read 3.25-3.35V)
- Continuity from radio MISO to ESP32 GPIO 37
- Continuity from radio MOSI to ESP32 GPIO 35
- Continuity from radio SCK to ESP32 GPIO 36
- No shorts between adjacent pins

**Fix:**
- Missing solder joint → Reflow all 9 connections
- Wrong GPIO → Check pin map, rewire if needed
- No power → Trace 3.3V wire, fix connection
- Damaged radio → If powered without antenna, module is dead, need replacement
- Firmware misconfiguration → Edit variant.h, set USE_SX1262

---

### "Messages Not Routing / Mesh Not Forming"

**Symptoms:** Can send from A to B, but not A to C through B (mesh hop)

**Check:**
1. All units on same channel? (Name AND key must match)
2. Mesh routing enabled? (Should be default in Meshtastic)
3. Units actually in range of each other? (Test direct connections first)
4. Firmware version mismatch? (All should be same Meshtastic version)

**Test:**
- Two units close together: Can they talk? (If no, fix this first)
- Three units: A-B-C in line, B can reach both A and C
- Send A→C with B in middle: Should relay through B

**Fix:**
- Channel mismatch → Verify all units Settings → Channel exactly matches
- Routing disabled → Check Settings → Routing → Enable
- Firmware mismatch → Update all to same version
- Too far apart → Reduce distance for testing
- Interference → Try different radio frequency/channel

---

## CONTROL ISSUES

### "Buttons Don't Register"

**Symptoms:** Press button, nothing happens on screen

**Which buttons?**

**If ALL buttons broken:**
- Firmware not reading GPIOs (software issue)
- Ground not connected (check common GND)
- Board crashed/frozen (power cycle)

**If SOME buttons work, some don't:**
- Individual wiring issue (check specific button's GPIO)

**Check resistor ladder buttons (Green, Red, L-Trigger, R-Trigger):**
1. Voltage at GPIO 4 when no button: Should be 3.3V (pullup)
2. Voltage when Green pressed: ~0.3V
3. Voltage when Red pressed: ~0.7V
4. Voltage when L-Trigger: ~1.4V
5. Voltage when R-Trigger: ~2.2V

**Test with multimeter:**
- Measure voltage at GPIO 4 (ADC pin)
- Press each button one at a time
- Confirm voltage changes uniquely for each button
- If two buttons give same voltage → resistor value wrong

**Fix:**
- No voltage change → Check resistor connections, switch continuity
- Wrong voltage → Check resistor values (1k, 2.2k, 4.7k, 10k)
- Multiple buttons same voltage → One resistor missing/wrong value
- Software not detecting → Adjust threshold values in firmware

**Check individual buttons (Rocker, Encoder switch):**
- GPIO reads HIGH when not pressed (pullup enabled)
- GPIO reads LOW when pressed
- If stuck LOW → Short to ground somewhere
- If stuck HIGH → Switch broken or not connected

---

### "Encoder Doesn't Scroll"

**Symptoms:** Spin knob, nothing happens

**Check:**
1. Wires connected to GPIO 40 (A) and GPIO 41 (B)?
2. Encoder getting power? (Some need 3.3V, some don't)
3. Firmware reading quadrature signals?
4. Encoder physically broken? (Spin it, should feel detents)

**Test:**
- Multimeter on GPIO 40: Should pulse HIGH/LOW when spinning
- Multimeter on GPIO 41: Should pulse HIGH/LOW (90° out of phase from A)
- If both stuck HIGH or LOW → Not connected or broken encoder
- If only one works → One wire disconnected

**Fix:**
- Not connected → Solder GPIO 40/41 wires
- Reversed → Swap A and B wires (scrolls backwards)
- Broken encoder → Replace encoder
- Firmware → Check encoder library enabled, pins defined correctly

---

### "Encoder Scrolls Wrong Direction"

**Symptoms:** Spin clockwise, scrolls up (should scroll down)

**Fix:**
- Swap GPIO 40 and GPIO 41 connections (A ↔ B)
- OR in firmware: Reverse encoder direction flag

---

## LED ISSUES

### "LEDs Don't Light Up"

**Symptoms:** Should glow when message received, stays dark

**Check:**
1. Three wires connected? (5V, GND, Data)
2. Data wire to GPIO 5?
3. Power to LEDs? (5V rail active)
4. LED strip oriented correctly? (Has arrow showing data flow direction)
5. First LED dead? (WS2812B are daisy-chain, if #1 dead, all fail)

**Test with multimeter:**
- 5V present at LED strip power pin
- GND connected
- Data line toggling when firmware running (use oscilloscope if available)

**Test in firmware:**
- Flash simple NeoPixel test code (all LEDs red)
- If test works → Meshtastic LED code issue
- If test fails → Hardware issue

**Fix:**
- Missing connection → Solder 5V, GND, Data wires
- Backwards strip → Flip strip 180° (data flows one direction)
- Dead first LED → Cut off first LED, resolder to second LED
- Wrong GPIO → Check firmware uses GPIO 5 for LED_PIN
- Not enough power → 5V rail sagging, check power supply

---

### "Some LEDs Work, Some Don't"

**Symptoms:** First 3 LEDs light up, last 5 stay dark

**Cause:** Break in daisy chain between working and non-working sections

**Check:**
- Visual inspection: Any broken solder joints between LEDs?
- Flex the strip gently: Do more/fewer LEDs light up? (Indicates bad connection)

**Fix:**
- Resolder connections between LED sections
- If one LED completely dead → Bridge around it (data jumps from LED before to LED after)
- If strip physically damaged → Replace LED strip

---

## MECHANICAL ISSUES

### "Case Won't Close / Doesn't Fit"

**Symptoms:** Parts interfere, can't screw case together

**Check:**
1. Screen aligned in window?
2. Wires pinched between shells?
3. Battery too thick for recess?
4. Components interfering (knob too long, etc)?
5. Screw posts aligned?

**Fix:**
- Screen misaligned → Reseat screen, check mounting clips
- Wires pinched → Better cable management, reroute wires
- Battery too thick → Use thinner battery or sand down recess
- Knob interference → Use shorter knob or recess case deeper
- Posts misaligned → Check STL exported correctly, reprint if warped

---

### "Buttons Feel Mushy / Don't Click"

**Symptoms:** Switches don't give satisfying tactile feedback

**Check:**
- Keycaps fully seated on stems?
- Switch plate alignment (if using plate mount)?
- Switch itself defective?

**Fix:**
- Reseat keycaps (press down firmly)
- Adjust case hole tolerance (might be too tight/loose)
- Replace switch (you have extras)

---

### "Knob Loose on Encoder"

**Symptoms:** Knob spins freely, doesn't turn encoder

**Fix:**
- Tighten set screw with hex key
- If D-shaft worn → Replace encoder
- If knob hole too big → Add friction with tape on shaft

---

## SOFTWARE/FIRMWARE ISSUES

### "Firmware Won't Flash"

**Symptoms:** Error when trying to upload firmware

**Check:**
1. USB cable works? (Must be data cable, not charge-only)
2. Board in bootloader mode? (May need to hold BOOT button while plugging in)
3. Correct COM port selected?
4. Drivers installed? (CH340/CP2102 USB-serial driver)
5. Correct board selected? (ESP32-S3, not ESP32 or ESP32-C3)

**Fix:**
- Try different USB cable (many cheap cables are charge-only)
- Hold BOOT button (if present on board) while connecting USB
- Install CH340 driver (Google "CH340 driver download")
- Select correct port in Arduino/PlatformIO (Tools → Port)
- Power cycle board, try again

---

### "Firmware Crashes / Keeps Rebooting"

**Symptoms:** Boot loop, restarts every few seconds

**Check serial output:**
```
Crash usually shows:
- "Guru Meditation Error"
- "Core dump"
- "Panic" messages
```

**Common causes:**
1. GPIO conflict (screen using same GPIO as control)
2. Memory issue (corrupted firmware)
3. Hardware fault (short circuit, bad solder)
4. Watchdog timeout (firmware stuck in loop)

**Fix:**
- Factory reset / erase flash completely
- Reflash firmware from scratch
- Check for solder bridges (adjacent GPIO pins touching)
- Disable features one-by-one to isolate culprit
- Check serial output for specific error codes

---

### "Meshtastic App Can't Connect via Bluetooth"

**Symptoms:** App says "No devices found"

**Check:**
1. Bluetooth enabled on phone?
2. Unit powered on?
3. Firmware has Bluetooth enabled? (Some builds disable BT)
4. Already paired with different phone? (Can only pair one at a time)

**Fix:**
- Enable Bluetooth on phone (Settings → Bluetooth)
- Unpair from any other devices first
- Reboot unit
- Forget device on phone, search again
- Reflash firmware with BT enabled
- Try different phone (to isolate problem)

---

## EMERGENCY PROCEDURES

### "Unit Smoking / Smells Burning"

**IMMEDIATE ACTIONS:**
1. **PRESS E-STOP** (cuts power instantly)
2. **UNPLUG USB-C** (if plugged in)
3. **REMOVE BATTERY** (twist e-stop to unlock, pull battery connector)
4. **MOVE AWAY FROM FLAMMABLES**
5. **VENTILATE AREA** (open windows)
6. **DO NOT POWER BACK ON**

**After safe:**
- Identify what burned (smell component, look for discoloration)
- Photograph damage
- Text Will with photos and description
- Do NOT attempt to repair yourself if unsure

**Common causes:**
- Battery shorted (red/black wires touched)
- Radio powered without antenna (burns RF amp)
- Wrong voltage applied (12V to 3.3V component)
- Solder bridge created short circuit

---

### "Battery Swollen / Puffy"

**SYMPTOMS:** Battery thicker than normal, case bulging, puffy feeling

**DANGER:** Swollen LiPo can catch fire or explode

**IMMEDIATE ACTIONS:**
1. **POWER OFF IMMEDIATELY**
2. **REMOVE FROM CASE** (carefully, don't puncture)
3. **PLACE IN FIREPROOF CONTAINER** (metal can, ceramic pot)
4. **MOVE OUTSIDE** (away from buildings)
5. **DO NOT CHARGE** (swollen battery will not recover)
6. **DO NOT PUNCTURE** (can ignite violently)

**Disposal:**
- Take to battery recycling center (Best Buy, Home Depot, etc.)
- Or discharge safely: Submerge in salt water for 24 hours, then recycle
- Never trash or burn

**Replacement:**
- Contact Will for replacement battery
- Check what caused swelling (overcharge? Physical damage?)

---

### "Antenna Detached, Powered On (Disaster)"

**WHAT HAPPENED:**
- Radio transmitter without antenna = full power into nothing
- RF energy reflects back into transmitter
- Burns out RF power amplifier immediately (irreversible)

**SYMPTOMS:**
- Radio worked before, now not detected
- Or very weak transmission (1/10 normal range)
- Radio module might smell slightly burnt

**FIX:**
- None. Radio module is dead.
- Must replace E22 module ($7 + reshipping)
- Contact Will immediately
- Lesson learned: ALWAYS CHECK ANTENNA BEFORE POWER-ON

**PREVENTION:**
- Label every unit: "CHECK ANTENNA BEFORE POWER"
- Make checking antenna part of power-on routine
- Physical checklist before first boot

---

## GETTING HELP

### When to Text Will

**TEXT IMMEDIATELY for:**
- Smoke, burning smell, fire
- Swollen battery
- Suspected component damage
- Complete failure (nothing works)
- Safety concern

**TEXT WITHIN 24 HRS for:**
- Can't solve after trying troubleshooting steps
- Consistent crashes/errors
- Intermittent issues
- Design flaw discovered
- Suggestions for improvement

**TEXT EVENTUALLY (weekly summary) for:**
- Minor bugs/annoyances
- Feature requests
- General feedback
- Cool discoveries
- "This is awesome" messages

### What to Include

**Helpful information:**
- Which unit (Tyler's, Ashley's, Link's, Judah's)
- What's wrong (specific symptoms)
- What you tried (troubleshooting steps)
- Photos/videos (if helpful)
- Error messages (exact text)

**Example GOOD message:**
"Hey Will - Link's unit won't power on. Tried charging 30 min, checking e-stop (unlocked), different USB cable. Multimeter reads 4.1V on battery terminals. Screen still blank. Attached photo of board. Ideas?"

**Example BAD message:**
"It's broken"

### Response Time

**Typical:** Same day (within 6 hours)  
**Emergency:** Within 1 hour  
**Non-urgent:** Within 24 hours

**If no response in 48 hours:** Call instead of text (might have missed message)

---

*For issues not covered here, document the problem and contact Will*
