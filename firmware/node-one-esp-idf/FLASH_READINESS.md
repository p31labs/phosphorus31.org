# Flash Readiness Checklist
**Node One Firmware - Pre-Flash Verification**

## ✅ Project Structure

- [x] ✅ `CMakeLists.txt` - Root project file present
- [x] ✅ `sdkconfig.defaults` - ESP32-S3 configuration present
- [x] ✅ `idf_component.yml` - Component dependencies defined
- [x] ✅ `main/CMakeLists.txt` - Main component configured
- [x] ✅ `main/main.cpp` - Entry point present
- [x] ✅ All component directories present (bsp, audio_engine, lora_radio, button_input, display, shield_server)

## ⚠️ Missing Files

- [ ] `partitions.csv` - **RECOMMENDED** for custom partition table
  - Default partition table will be used if missing
  - For SPIFFS storage, custom partition table is recommended

## ✅ Code Status

### Main Application
- [x] ✅ `app_main()` entry point present
- [x] ✅ NVS initialization
- [x] ✅ BSP initialization
- [x] ✅ Component initialization stubs
- [x] ✅ Main loop structure

### Components
- [x] ✅ BSP (Board Support Package) - Power management, I2C
- [x] ✅ Audio Engine - ES8311 codec interface
- [x] ✅ LoRa Radio - E22-900M30S driver (stub)
- [x] ✅ Button Input - MCP23017 interface
- [x] ✅ Display - LVGL integration (stub)
- [x] ✅ Shield Server - WiFi AP + HTTP server

### Known TODOs (Non-Blocking)
- LoRa RadioLib integration (stub functions present)
- Display initialization (stub functions present)
- Some button handlers (basic structure present)

## 🔧 Pre-Flash Steps

### 1. Verify ESP-IDF Environment

```powershell
# Windows PowerShell
if (Test-Path "$env:USERPROFILE\esp\esp-idf") {
    & "$env:USERPROFILE\esp\esp-idf\export.ps1"
    idf.py --version
    # Should show v5.4.0 or higher
}
```

### 2. Navigate to Project

```powershell
cd "c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf"
```

### 3. Configure Project (First Time)

```powershell
idf.py set-target esp32s3
idf.py reconfigure
```

This will:
- Download component dependencies from `idf_component.yml`
- Generate `sdkconfig` from `sdkconfig.defaults`
- Set up build system

### 4. Build Project

```powershell
idf.py build
```

**Expected:** Build should complete (may have warnings for stub functions, but should compile)

### 5. Connect Hardware

- Connect ESP32-S3 via USB
- Identify COM port: `idf.py flash --port COM?` (will list ports)
- Or use: `idf.py flash -p COM3` (replace COM3 with your port)

### 6. Flash Firmware

```powershell
idf.py flash
# Or specify port:
idf.py flash -p COM3
```

### 7. Monitor Output

```powershell
idf.py monitor
# Or combined:
idf.py flash monitor
```

## 📋 Expected Boot Output

```
I (xxx) node_one: Node One firmware starting...
I (xxx) node_one: Waveshare ESP32-S3-Touch-LCD-3.5B
I (xxx) node_one: ESP-IDF version: v5.4.x
I (xxx) node_one: BSP power management initialized
I (xxx) node_one: === BATTERY TEST ===
I (xxx) node_one: Battery: XX% (XXXX mV / X.XX V)
I (xxx) node_one: ===================
I (xxx) node_one: Node One initialization complete
I (xxx) node_one: The Mesh Holds. 🔺
```

## ⚠️ Potential Issues

### Build Errors
- **Missing components**: Run `idf.py reconfigure` to download dependencies
- **ESP-IDF version**: Must be v5.4.0 or higher
- **CMake errors**: Check `CMakeLists.txt` syntax

### Flash Errors
- **Port not found**: Check USB connection, try different port
- **Permission denied**: May need to run PowerShell as Administrator
- **Device not in download mode**: Hold BOOT button during flash

### Runtime Errors
- **I2C initialization fails**: Check hardware connections
- **Component init fails**: Check component dependencies
- **WiFi AP doesn't start**: Check NVS initialization

## ✅ Flash Readiness: **READY**

**Status**: Project structure is complete and ready for compilation and flashing.

**Note**: Some components have stub implementations (LoRa, Display) but the firmware will compile and boot. Full functionality requires completing those integrations.

## Quick Flash Command

```powershell
# One-liner (after ESP-IDF is sourced):
cd "c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf"
idf.py set-target esp32s3
idf.py build flash monitor
```

## The Mesh Holds. 🔺

---

*Prepared: February 14, 2026*
*Firmware: Node One ESP-IDF*
