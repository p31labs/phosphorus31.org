# FIRMWARE REFERENCE DOCUMENT
## Location of Arduino Firmware Files

**Important:** The complete firmware files were created earlier in this conversation and are available in the outputs directory.

---

## 📂 FIRMWARE LOCATIONS

### **From Previous Package:**
The three firmware files (.ino format) are located in:
`/mnt/user-data/outputs/TETRAHEDRON_COMPLETE_DOCUMENTATION.tar.gz`

Extract that archive to access:
- `prototype_zero_firmware/hello_world/hello_world.ino`
- `prototype_zero_firmware/walkie_talkie/walkie_talkie.ino`
- `prototype_zero_firmware/tetrahedron/tetrahedron.ino`

---

## 📋 FIRMWARE DESCRIPTIONS

### **1. hello_world.ino** (Sunday #1)
**Purpose:** First contact - verify hardware works

**Features:**
- Display initialization
- LED rainbow animations
- Builder name on screen
- Boot sequence
- Basic hardware testing

**Customization:**
- Change `BUILDER_NAME` variable to your name
- Adjust `LED_COUNT` if using different strip length
- Modify animations as desired

---

### **2. walkie_talkie.ino** (Sunday #3)
**Purpose:** Two-device radio communication

**Features:**
- LoRa radio initialization
- Two-node messaging
- RSSI display
- Quick message buttons
- Message history
- Send/receive animations

**Customization:**
- Set `DEVICE_ID` (1 for dad, 2 for son)
- Adjust `SECRET_KEY` for encryption
- Modify quick message buttons
- Change radio frequency if outside USA

**Critical Settings:**
```cpp
#define DEVICE_ID 1  // or 2
#define SECRET_KEY 42  // must match both devices
#define RF_FREQUENCY 915.0  // 915 for USA, 868 for EU, 433 for Asia
```

---

### **3. tetrahedron.ino** (Sunday #4)
**Purpose:** Four-node mesh network

**Features:**
- 4-node mesh topology
- Heartbeat protocol (5-second intervals)
- Node status tracking
- Online/offline detection
- Direct messaging to specific nodes
- Broadcast mode (message all)
- Network geometry visualization
- "TETRAHEDRON COMPLETE" animation

**Customization:**
- Set `NODE_ID` (1-4, must be unique per node)
- Adjust `HEARTBEAT_INTERVAL` (default 5000ms)
- Modify `OFFLINE_THRESHOLD` (default 15000ms = 3 missed heartbeats)
- Change node colors in LED mapping

**Critical Settings:**
```cpp
#define NODE_ID 1  // Must be 1, 2, 3, or 4 (unique per node)
#define SECRET_KEY 42  // Must match all 4 nodes in network
#define RF_FREQUENCY 915.0  // Must match all nodes
```

---

## 🔧 ARDUINO IDE SETUP

### **Required Libraries** (install via Library Manager):

```
Adafruit GFX Library
Adafruit ILI9341
Adafruit NeoPixel
RadioHead
Adafruit BusIO
```

### **Board Selection:**
```
Board: "Adafruit Feather ESP32-S3 No PSRAM"
Upload Speed: "921600"
USB CDC On Boot: "Enabled"
USB Firmware MSC On Boot: "Disabled"
USB DFU On Boot: "Disabled"
Flash Size: "4MB (32Mb)"
Partition Scheme: "Default 4MB with spiffs"
```

### **Port Selection:**
- Windows: Usually COM3 or higher
- Mac: Usually /dev/cu.usbmodem*
- Linux: Usually /dev/ttyACM0

---

## 📤 UPLOADING FIRMWARE

### **Step-by-Step:**

1. **Connect device via USB-C**
2. **Open Arduino IDE**
3. **Open firmware file** (File → Open)
4. **Select board** (Tools → Board → ESP32 → Adafruit Feather ESP32-S3)
5. **Select port** (Tools → Port)
6. **Verify code** (✓ button) to check for errors
7. **Upload** (→ button)
8. **Wait** for "Done uploading" message
9. **Open Serial Monitor** (Tools → Serial Monitor, set to 115200 baud)
10. **Watch boot messages** for errors

---

## 🐛 COMMON UPLOAD ERRORS

### **"Port not found"**
**Solution:**
- Install CP2104 USB driver
- Try different USB cable (must be data cable, not charge-only)
- Try different USB port
- Press reset button on board

### **"Upload failed"**
**Solution:**
- Hold BOOT button while clicking upload
- Release BOOT when "Connecting..." appears
- Wait for upload to complete

### **"Compilation error"**
**Solution:**
- Verify all libraries installed
- Check library versions (update if needed)
- Verify board selection correct
- Check for typos in customized code

### **"Board not responding"**
**Solution:**
- Press reset button
- Try upload again
- Check USB connection
- Verify board not damaged

---

## 🔍 TESTING FIRMWARE

### **After Upload:**

**Check Serial Monitor for:**
```
Booting...
Display initialized
LEDs initialized
Radio initialized
READY
```

**Visual Confirmation:**
- Screen shows content
- LEDs animate
- No smoke/burning smell
- No error messages

---

## 💾 BACKUP YOUR FIRMWARE

**After successful customization:**

1. Save modified .ino files
2. Create backup folder with date
3. Document any changes you made
4. Keep notes on working configurations

**Example backup structure:**
```
Tetrahedron_Firmware_Backup_2024-12-25/
├── hello_world_WORKING.ino
├── walkie_talkie_WORKING.ino
├── tetrahedron_WORKING.ino
└── NOTES.txt (document your settings)
```

---

## 📝 CUSTOMIZATION IDEAS

### **After Basic Build Works:**

**Beginner:**
- Change node colors
- Modify message buttons text
- Adjust LED brightness
- Change heartbeat interval

**Intermediate:**
- Add new LED animations
- Create custom message templates
- Modify screen layout
- Add sound effects (if speaker added)

**Advanced:**
- Implement message encryption (stronger than XOR)
- Add GPS coordinates
- Create mesh routing algorithm
- Build message relay functionality

---

## 🆘 IF FIRMWARE WON'T LOAD

**Don't panic. Try:**

1. **Re-extract firmware from original package**
2. **Verify file isn't corrupted** (check file size)
3. **Create new Arduino project**
4. **Copy/paste code manually**
5. **Check for hidden characters** (if copied from PDF)

**If still failing:**
- Post error message in Adafruit forums
- Include board type, firmware file, error text
- Community is helpful and responsive

---

## 📚 ADDITIONAL RESOURCES

**Adafruit Learn:**
- ESP32-S3 Feather guide: https://learn.adafruit.com/adafruit-esp32-s3-feather
- LoRa FeatherWing guide: https://learn.adafruit.com/radio-featherwing
- NeoPixel guide: https://learn.adafruit.com/adafruit-neopixel-uberguide

**Arduino Reference:**
- Language reference: https://www.arduino.cc/reference/en/
- Libraries: https://www.arduino.cc/reference/en/libraries/

**RadioHead Documentation:**
- RFM95 driver: http://www.airspayce.com/mikem/arduino/RadioHead/

---

## ✅ FIRMWARE CHECKLIST

**Before each Sunday session:**

- [ ] Arduino IDE installed and tested
- [ ] All libraries installed
- [ ] Board support package installed
- [ ] USB drivers working
- [ ] Can successfully upload Blink example
- [ ] Firmware files accessible
- [ ] Backup files created
- [ ] Customizations documented

---

**The firmware is the soul of your device.**

**The hardware is just the body.**

**Together, they teach the lesson.**

▲
