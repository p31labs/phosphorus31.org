# Prep for flash — P31 NodeZero (NODE ONE)

**One-page checklist before flashing ESP32-S3.**  
**Updated:** 2026-02-16

---

## 1. ESP-IDF ready

- [ ] ESP-IDF v5.4+ installed. **This machine:** v5.5.1 at `C:\Espressif\frameworks\esp-idf-v5.5.1` (launch via **Desktop → "ESP-IDF 5.5 PowerShell"**).
- [ ] In this session, **source ESP-IDF**:
  ```powershell
  # Using Desktop shortcut's init (recommended):
  . C:\Espressif\Initialize-Idf.ps1 -IdfId esp-idf-29323a3f5a0574597d6dbaa0af20c775
  # Or open "ESP-IDF 5.5 PowerShell" from Desktop, then cd to project.
  ```
- [ ] Verify: `idf.py --version` shows v5.5.x or higher

---

## 2. Hardware

- [ ] ESP32-S3 (Waveshare ESP32-S3-Touch-LCD-3.5B or compatible) connected via **USB** (data port, not UART-only)
- [ ] Cable is data-capable; 5V power sufficient
- [ ] If flash fails: **hold BOOT**, press RST, release BOOT, try again

---

## 3. Project path

Firmware lives in the P31 repo:

```
c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf
```

- [ ] Navigate there:
  ```powershell
  cd c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf
  ```

---

## 4. Build

- [ ] Set target (first time or after clean): `idf.py set-target esp32s3`
- [ ] Build: `idf.py build`
- [ ] Expect: `Project build complete. To flash, run: idf.py flash`

---

## 5. Flash

**Option A — Script (recommended)**

```powershell
cd c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf
.\flash_now.ps1
```

Script will: detect COM port, set target, build, flash, then offer to open monitor.

- **Build only (no flash):** `.\flash_now.ps1 -BuildOnly`
- **Flash without opening monitor:** `.\flash_now.ps1 -NoMonitor`

**Option B — Manual**

```powershell
# See COM ports (Windows):
Get-WmiObject Win32_SerialPort | Where-Object { $_.Description -like "*USB*" }

# Flash (replace COM3 with your port):
idf.py flash -p COM3

# Optional: flash and open monitor:
idf.py flash -p COM3 monitor
```

Exit monitor: `Ctrl+]`.

---

## 6. After flash

- [ ] Serial monitor shows boot: `Node One firmware starting...` → `The Mesh Holds. 🔺`
- [ ] If using display: splash then UI (per NODEZERO_OPTIMIZATION.md)

---

## Quick reference

| Step        | Command |
|------------|---------|
| Source IDF | `. C:\Espressif\frameworks\esp-idf-v5.4\export.ps1` |
| Go to project | `cd c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf` |
| One-shot flash | `.\flash_now.ps1` |
| Manual flash | `idf.py set-target esp32s3` then `idf.py build` then `idf.py flash -p COMx` |

---

*The mesh holds. Forever. 🔺*
