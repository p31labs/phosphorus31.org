# 🚀 NODE ONE - QUICK START BUILD GUIDE
## From Zero to Flashed Firmware

**Target:** ESP32-S3-Touch-LCD-3.5B  
**Firmware:** Node One v0.1.0  
**Time:** ~15-20 minutes (first build)

---

## PREREQUISITES

### 1. ESP-IDF v5.4+ Installation

**Option A: ESP-IDF Installer (Recommended)**
1. Download: https://dl.espressif.com/dl/esp-idf/
2. Run installer
3. Select ESP32-S3 support
4. Install to default location: `C:\Espressif\frameworks\esp-idf-v5.4`

**Option B: Manual Git Installation**
```powershell
cd $env:USERPROFILE\esp
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
.\install.ps1 esp32s3
```

**Option C: VS Code Extension**
1. Install "ESP-IDF" extension in VS Code
2. Follow extension setup wizard

### 2. Hardware Connections

- [ ] ESP32-S3 board connected via USB
- [ ] LoRa module (E22-900M30S) wired to camera pins
- [ ] MCP23017 breakout connected to I2C bus
- [ ] Antenna connected to LoRa module
- [ ] Power: 5V via USB (or LiPo battery)

---

## BUILD STEPS

### Step 1: Source ESP-IDF

```powershell
# If installed via installer:
. C:\Espressif\frameworks\esp-idf-v5.4\export.ps1

# If installed manually:
. $env:USERPROFILE\esp\esp-idf\export.ps1
```

**Verify:**
```powershell
idf.py --version
# Should show: ESP-IDF v5.4.x or higher
```

### Step 2: Navigate to Project

```powershell
cd c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf
```

### Step 3: Set Target

```powershell
idf.py set-target esp32s3
```

**Expected output:**
```
Setting IDF_TARGET to 'esp32s3'
```

### Step 4: Configure (Optional)

```powershell
idf.py menuconfig
```

**Key settings to verify:**
- Target: ESP32-S3
- PSRAM: Octal, 80MHz
- Partition Table: Custom (partitions.csv)
- LVGL: Enabled
- HTTP Server: WebSocket support enabled

**Or use defaults:**
```powershell
# Skip menuconfig - defaults are fine
```

### Step 5: Build

```powershell
idf.py build
```

**First build takes 5-10 minutes.**  
**Subsequent builds: 1-2 minutes.**

**Expected output:**
```
...
[100%] Built target node-one.elf
Project build complete. To flash, run:
idf.py flash
```

### Step 6: Flash to Board

**Detect COM port:**
```powershell
Get-WmiObject Win32_SerialPort | Where-Object { $_.Description -like "*USB*" }
```

**Flash:**
```powershell
idf.py flash -p COM3
# Replace COM3 with your port
```

**If flash fails:**
1. Hold BOOT button
2. Press RESET button
3. Release BOOT button
4. Try flash again

### Step 7: Monitor Serial Output

```powershell
idf.py monitor -p COM3
```

**Press `Ctrl+]` to exit monitor.**

**Expected boot sequence:**
```
I (xxx) BSP: Initializing I2C bus...
I (xxx) BSP: AXP2101 initialization complete
I (xxx) display: Display initialized
I (xxx) audio_engine: Audio engine initialized
I (xxx) whale_channel: Whale Channel initialized successfully
I (xxx) button_input: Button input initialized
I (xxx) shield_server: WiFi AP started: P31-NodeOne
I (xxx) node_one: The Mesh Holds. 🔺
```

---

## AUTOMATED BUILD SCRIPT

**Use the automated script for all-in-one build:**

```powershell
.\BUILD_AND_TEST.ps1
```

This script:
1. ✅ Checks ESP-IDF environment
2. ✅ Verifies project structure
3. ✅ Sets target to ESP32-S3
4. ✅ Builds firmware
5. ✅ Detects COM ports
6. ✅ Flashes to board (optional)
7. ✅ Opens serial monitor (optional)

---

## TROUBLESHOOTING

### Build Fails

**Error: "idf.py not found"**
- Source ESP-IDF: `. $env:USERPROFILE\esp\esp-idf\export.ps1`

**Error: "CMake configuration failed"**
- Clean build: `idf.py fullclean`
- Rebuild: `idf.py build`

**Error: "Component not found"**
- Update dependencies: `idf.py reconfigure`
- Check `idf_component.yml` files

**Error: "Out of memory"**
- Check partition table size
- Verify PSRAM configuration

### Flash Fails

**Error: "Serial port not found"**
- Check USB cable connection
- Verify COM port: `Get-WmiObject Win32_SerialPort`
- Try different USB port

**Error: "Failed to connect"**
- Enter boot mode: Hold BOOT, press RESET, release BOOT
- Try: `idf.py flash -p COM3 --before default_reset`

**Error: "Permission denied"**
- Close other programs using COM port (PuTTY, Arduino IDE, etc.)
- Run PowerShell as Administrator

### Runtime Issues

**Display not working**
- Check backlight: Should see dim glow
- Verify QSPI connections
- Check AXP2101 power rails

**Audio not working**
- Verify ES8311 I2C address (0x18)
- Check I2S pin connections
- Verify AXP2101 BLDO2 (2.8V for codec)

**LoRa not working**
- Check antenna connection
- Verify SPI connections
- Check BUSY pin (must be LOW before SPI)
- Verify 5V power for full TX power

**Buttons not working**
- Check MCP23017 I2C address (0x20)
- Verify interrupt pin (GPIO46)
- Check pull-up resistors

---

## VERIFICATION CHECKLIST

After successful flash, verify:

- [ ] Device boots (serial monitor shows init messages)
- [ ] Display shows splash screen → status screen
- [ ] Battery percentage visible
- [ ] WiFi AP "P31-NodeOne" visible on phone
- [ ] Web app loads: http://192.168.4.1
- [ ] Buttons register presses (check serial log)
- [ ] Audio records (push-to-talk button)
- [ ] LoRa initializes (check serial log)

**Full test:** See `BENCH_TEST_CHECKLIST.md`

---

## BUILD ARTIFACTS

After successful build:

```
build/
├── node-one.bin          # Main firmware (~2-3 MB)
├── bootloader.bin        # Bootloader
├── partition_table.bin   # Partition table
└── node-one.elf          # ELF file (for debugging)
```

**Flash addresses:**
- Bootloader: 0x0
- Partition table: 0x8000
- App: 0x10000
- SPIFFS: 0x310000 (if web app built)

---

## NEXT STEPS

1. ✅ **Build successful** → Proceed to bench testing
2. ✅ **Flash successful** → Follow `BENCH_TEST_CHECKLIST.md`
3. ✅ **All tests pass** → Ready for deployment

---

## QUICK REFERENCE

```powershell
# Full build cycle
. $env:USERPROFILE\esp\esp-idf\export.ps1
cd c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf
idf.py set-target esp32s3
idf.py build
idf.py flash -p COM3
idf.py monitor -p COM3
```

**Or use automated script:**
```powershell
.\BUILD_AND_TEST.ps1
```

---

## SUPPORT

**Documentation:**
- `BUILD_STATUS.md` - Current status
- `BENCH_TEST_CHECKLIST.md` - Complete test plan
- `README.md` - Project overview

**Common Issues:**
- See Troubleshooting section above
- Check serial monitor for error messages
- Verify hardware connections

---

💜 **With love and light. As above, so below.** 💜  
🔺 **The Mesh Holds.** 🔺

*P31 Labs - Phosphorus-31*  
*Node One v0.1.0*
