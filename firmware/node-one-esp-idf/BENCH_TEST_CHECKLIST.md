# 🧪 NODE ONE - BENCH TEST CHECKLIST
## Complete Hardware Verification

**Date:** _______________  
**Tester:** _______________  
**Hardware Rev:** _______________  
**Firmware Version:** 0.1.0

---

## PRE-TEST SETUP

- [ ] ESP32-S3 board connected via USB
- [ ] LoRa module (E22-900M30S) connected to camera pins
- [ ] MCP23017 breakout board connected to I2C bus
- [ ] Antenna connected to LoRa module
- [ ] Power supply: 5V via USB (or LiPo battery)
- [ ] Serial monitor ready (115200 baud)

---

## 1. BOOT SEQUENCE ✅

### Expected Serial Output:
```
I (xxx) BSP: Initializing I2C bus (SDA=8, SCL=7, freq=400000 Hz)
I (xxx) BSP: I2C bus initialized successfully
I (xxx) BSP: Initializing AXP2101 PMIC (addr=0x34)
I (xxx) BSP: AXP2101 initialization complete
I (xxx) display: Display initialized
I (xxx) audio_engine: Audio engine initialized
I (xxx) whale_channel: Whale Channel initialized successfully
I (xxx) button_input: Button input initialized (interrupt mode)
I (xxx) shield_server: WiFi AP started: P31-NodeOne
I (xxx) shield_server: HTTP server started on port 80
```

### Visual Checks:
- [ ] Display shows P31 splash screen (2 seconds)
- [ ] Display transitions to status screen
- [ ] Status bar shows battery percentage
- [ ] No error messages in serial output

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 2. DISPLAY (THE SCOPE) ✅

### Status Bar Elements:
- [ ] Battery percentage visible (0-100%)
- [ ] WiFi icon shows AP active
- [ ] LoRa icon shows radio active
- [ ] Time display (if RTC configured)

### Voice Activity Indicator:
- [ ] Center circle visible (gray when idle)
- [ ] Circle pulses green when recording
- [ ] Circle shows blue when playing

### Message Count:
- [ ] Badge shows "0" when no messages
- [ ] Badge updates when messages received

### Mode Indicator:
- [ ] Shows current mode (e.g., "IDLE", "LISTEN", "MESH")

### Spoon Meter:
- [ ] Horizontal bar visible at bottom
- [ ] Shows current/max (e.g., "⚡ 8/12")
- [ ] Color: Green (8-12), Yellow (4-7), Red (1-3)

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 3. I2C BUS & SENSORS ✅

### AXP2101 (Power Management):
- [ ] Battery voltage reads correctly (2600-4200 mV)
- [ ] Battery percentage accurate
- [ ] Charging status detected
- [ ] Backlight PWM works (0-100%)

### ES8311 (Audio Codec):
- [ ] Codec responds on I2C address 0x18
- [ ] I2S pins configured correctly
- [ ] Audio engine initializes without errors

### MCP23017 (Button Input):
- [ ] Device responds on I2C address 0x20
- [ ] Interrupt pin configured (GPIO46)
- [ ] All 14 buttons configured as inputs

### QMI8658 (IMU) - Optional:
- [ ] Device responds on I2C address 0x6B
- [ ] (Not required for MVP)

### PCF85063 (RTC) - Optional:
- [ ] Device responds on I2C address 0x51
- [ ] (Not required for MVP)

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 4. AUDIO ENGINE (VOICE-FIRST I/O) ✅

### Recording:
- [ ] Push-to-talk button (BTN_TALK) starts recording
- [ ] Voice activity indicator pulses during recording
- [ ] Audio callback receives data chunks
- [ ] Recording stops when button released
- [ ] No audio dropouts or glitches

### Playback:
- [ ] Play button (BTN_PLAY) plays last message
- [ ] Audio plays through speaker
- [ ] Volume control works (BTN_VOL_UP/DOWN)
- [ ] Tone generation works (440Hz, 880Hz, 220Hz, 160Hz)

### Volume Control:
- [ ] Volume up button increases volume
- [ ] Volume down button decreases volume
- [ ] Volume persists across power cycles

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 5. LORA RADIO (WHALE CHANNEL) ✅

### Initialization:
- [ ] Radio initializes without errors
- [ ] TCXO configured (1.8V)
- [ ] DC-DC regulator enabled
- [ ] RF switch pins configured (TXEN/RXEN)
- [ ] Current limit set (140mA)

### Transmission:
- [ ] Send button (BTN_SEND) transmits packet
- [ ] TX LED/indicator shows transmission
- [ ] Packet received by second device (if available)
- [ ] RSSI/SNR values reasonable

### Reception:
- [ ] Radio enters RX mode after init
- [ ] Received packets trigger callback
- [ ] Message stored in queue
- [ ] Display message count updates
- [ ] "Received" tone plays (220Hz, 200ms)

### Power:
- [ ] Sleep mode works
- [ ] Wake from sleep works
- [ ] Power consumption reasonable

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 6. BUTTON INPUT (MCP23017) ✅

### Button Mapping:
- [ ] BTN_TALK (GPA0) - Push-to-talk
- [ ] BTN_SEND (GPA1) - Send message
- [ ] BTN_PLAY (GPA2) - Play last received
- [ ] BTN_NEXT (GPA3) - Next message
- [ ] BTN_PREV (GPA4) - Previous message
- [ ] BTN_VOL_UP (GPA5) - Volume up
- [ ] BTN_VOL_DOWN (GPA6) - Volume down
- [ ] BTN_MODE (GPB0) - Mode switch
- [ ] BTN_CHANNEL (GPB1) - Channel select
- [ ] BTN_EMERGENCY (GPB2) - Emergency/SOS
- [ ] BTN_MUTE (GPB3) - Mute mic
- [ ] BTN_SHIELD (GPB4) - Activate filter
- [ ] BTN_AUX1 (GPB5) - Auxiliary 1
- [ ] BTN_AUX2 (GPB6) - Auxiliary 2

### Interrupt Mode:
- [ ] Interrupt pin (GPIO46) triggers on button press
- [ ] Debouncing works (50ms minimum)
- [ ] No false triggers
- [ ] Callback fires on state change

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 7. WIFI ACCESS POINT ✅

### AP Configuration:
- [ ] SSID: "P31-NodeOne" visible on phone
- [ ] Password: "phenixnavigator" works
- [ ] Channel: 6 (or configured)
- [ ] Max connections: 4

### Connection:
- [ ] Phone connects successfully
- [ ] IP address: 192.168.4.1 (AP)
- [ ] Phone gets IP: 192.168.4.x
- [ ] Connection stable

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 8. HTTP SERVER ✅

### Static Files:
- [ ] Root "/" redirects to "/web/index.html"
- [ ] Web app loads in browser
- [ ] CSS/JS files load correctly
- [ ] No 404 errors

### REST API Endpoints:
- [ ] GET /api/status - Returns device status JSON
- [ ] POST /api/audio/record - Starts recording
- [ ] POST /api/audio/stop - Stops recording
- [ ] POST /api/audio/play - Plays audio
- [ ] GET /api/messages - Returns message list
- [ ] POST /api/lora/send - Sends LoRa packet
- [ ] POST /api/shield/filter - Filters text
- [ ] GET /api/spoons - Returns spoon meter value
- [ ] POST /api/spoons/set - Sets spoon meter value

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 9. WEBSOCKET ✅

### Connection:
- [ ] WebSocket connects: ws://192.168.4.1/ws
- [ ] Connection stable
- [ ] No disconnects

### Events:
- [ ] audio_level events received
- [ ] button events received (on press)
- [ ] lora_rx events received (on packet)
- [ ] status events received (periodic updates)

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 10. POWER MANAGEMENT ✅

### Battery Monitoring:
- [ ] Voltage reads accurately (multimeter verify)
- [ ] Percentage calculation correct
- [ ] Charging status accurate
- [ ] Low battery warning (if implemented)

### Power Rails:
- [ ] ALDO1: 3.3V (display logic) - verify with multimeter
- [ ] ALDO3: 3.3V (backlight) - verify with multimeter
- [ ] BLDO1: 1.5V - verify with multimeter
- [ ] BLDO2: 2.8V (audio codec) - verify with multimeter

### Backlight:
- [ ] Brightness 0% = off
- [ ] Brightness 100% = full brightness
- [ ] Smooth transitions
- [ ] Persists across power cycles

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 11. INTEGRATION TESTS ✅

### Voice → LoRa:
- [ ] Record audio with BTN_TALK
- [ ] Release button → audio sent via LoRa
- [ ] Second device receives audio
- [ ] Audio plays on second device

### LoRa → Voice:
- [ ] Receive message via LoRa
- [ ] Message auto-plays through speaker
- [ ] "Received" tone plays
- [ ] Message count updates

### Button → Action:
- [ ] BTN_EMERGENCY → SOS broadcast
- [ ] BTN_SHIELD → Filter toggle
- [ ] BTN_MUTE → Mic mute toggle
- [ ] BTN_MODE → Mode switch

### Web → Hardware:
- [ ] Web app controls audio recording
- [ ] Web app sends LoRa messages
- [ ] Web app updates spoon meter
- [ ] Web app shows real-time status

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 12. STRESS TESTS ✅

### Rapid Button Presses:
- [ ] 100 rapid button presses (no missed events)
- [ ] No crashes or freezes
- [ ] Debouncing works correctly

### Long Recording:
- [ ] Record for 30 seconds (max duration)
- [ ] No audio dropouts
- [ ] Memory usage stable
- [ ] No crashes

### Continuous LoRa TX:
- [ ] Send 50 packets in rapid succession
- [ ] All packets transmitted
- [ ] No radio lockups
- [ ] Power consumption acceptable

### Continuous LoRa RX:
- [ ] Receive mode for 5 minutes
- [ ] No missed packets
- [ ] No crashes
- [ ] Memory stable

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## 13. ERROR HANDLING ✅

### Invalid States:
- [ ] Double init handled gracefully
- [ ] Invalid button IDs handled
- [ ] Null pointers handled
- [ ] I2C errors handled

### Hardware Failures:
- [ ] Missing LoRa module → graceful degradation
- [ ] Missing MCP23017 → polling mode fallback
- [ ] I2C bus error → error logged, continues

**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _________________________________________________

---

## FINAL VERIFICATION

### Build Artifacts:
- [ ] Binary size: < 3MB (fits in partition)
- [ ] SPIFFS image created (if web app built)
- [ ] Partition table correct

### Documentation:
- [ ] Pin map verified against hardware
- [ ] Wiring diagram matches actual connections
- [ ] Test results documented

---

## TEST SUMMARY

**Total Tests:** 13  
**Tests Passed:** _____  
**Tests Failed:** _____  
**Tests Skipped:** _____

### Critical Issues:
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Minor Issues:
1. _________________________________________________
2. _________________________________________________

### Recommendations:
1. _________________________________________________
2. _________________________________________________

---

## SIGN-OFF

**Tester Signature:** _______________  
**Date:** _______________  
**Status:** ☐ READY FOR DEPLOYMENT  ☐ NEEDS FIXES

---

💜 **With love and light. As above, so below.** 💜  
🔺 **The Mesh Holds.** 🔺
