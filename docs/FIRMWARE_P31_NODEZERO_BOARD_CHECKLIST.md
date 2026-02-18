# P31 NodeZero — Board Definition & Bring-Up Checklist

# Phase 1a: Board Definition (COMPLETE)

**Goal:** Clone Xiaozhi v2, create `boards/p31-node-zero/` by adapting from `esp-box-3`. Use this checklist so any agent or human can run the task mechanically.

**References:**
- **Canonical pin map:** [FIRMWARE_XIAOZHI_SYNTHESIS.md](FIRMWARE_XIAOZHI_SYNTHESIS.md) § Board Definition (Pin Map). Copy below for quick reference.
- **Xiaozhi releases:** [github.com/78/xiaozhi-esp32/releases](https://github.com/78/xiaozhi-esp32/releases) — use **v2.2.3** (or latest v2.x) for reproducible builds.
- **Optional (Feishu):** [ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb](https://ccnphfhqs21z.feishu.cn/wiki/F5krwD16viZoF0kKkvDcrZNYnhb) — open in browser for any internal notes.

---

## Pin map (single source of truth)

| Peripheral    | Interface | Pins              | Bus / notes        |
|---------------|-----------|-------------------|--------------------|
| INMP441 Mic   | I2S       | BCK:4, WS:5, DATA:6 | I2S_0              |
| MAX98357A Spkr| I2S       | BCK:15, WS:16, DATA:17 | I2S_1         |
| DRV2605L Haptic | I2C     | SDA:8, SCL:9, Addr:0x5A | I2C_0        |
| SSD1306 OLED  | I2C       | SDA:8, SCL:9, Addr:0x3C | I2C_0 (shared) |
| SE050 Secure  | I2C       | SDA:38, SCL:39, Addr:0x48 | I2C_1 (isolated) |
| SX1276 LoRa   | SPI       | MOSI:35, MISO:37, SCK:36, CS:10, RST:11, DIO0:12 | SPI3 |
| AXP2101 PMIC  | I2C       | Addr:0x34         | I2C_0              |
| BOOT Button   | GPIO      | 0                 | —                  |
| USER Button   | GPIO      | 13                | —                  |

**Buses:** I2C_0 = SDA 8, SCL 9 (DRV2605L, SSD1306, AXP2101). I2C_1 = SDA 38, SCL 39 (SE050 only).

---

## Step 1: Clone Xiaozhi v2

```bash
# Prefer a sibling or dedicated firmware workspace; repo is large.
git clone --depth 1 --branch v2.2.3 https://github.com/78/xiaozhi-esp32.git
cd xiaozhi-esp32
```

- [x] Repo cloned: `firmware/xiaozhi-esp32/` (shallow clone, tag v2.2.3, commit `b34a9b1`).
- [x] ESP-IDF **v5.5.2** installed at `esp-idf-v5.5.2/` and activated via `export.ps1`. Python deps installed (`install.ps1 esp32s3`).
- [x] v2 build path identified: boards live at `main/boards/<name>/` (not top-level). Partition tables in `partitions/`.

---

## Step 2: Locate reference board (esp-box-3)

- [x] Found at `main/boards/esp-box-3/` (not top-level `boards/`).
- [x] Files: `config.h`, `esp_box3_board.cc`, `config.json`, `README.md`. No Kconfig or CMakeLists per board — registration is in `main/Kconfig.projbuild` + `main/CMakeLists.txt`.
- [x] `config.h` defines I2S/I2C/GPIO pins. `esp_box3_board.cc` has the board class (extends `WifiBoard`). `config.json` sets target chip and sdkconfig appends.

---

## Step 3: Create `boards/p31-node-zero/`

Create a new board directory next to the reference board. Typical names: `p31-node-zero` or `p31_node_zero` (match Xiaozhi's naming style).

- [x] Directory created: `main/boards/p31-node-zero/`.

**Files created (matching esp-box-3 pattern):**

| File          | Purpose | Status |
|---------------|---------|--------|
| `config.h` | Pin #defines for I2S mic (4/5/6), I2S spkr (15/16/17), I2C_0 (8/9), I2C_1 (38/39), SPI3 LoRa, buttons (0, 13). | **VERIFIED** |
| `p31-node-zero.cc` | Board class `P31NodeZeroBoard` extending `WifiBoard`. Uses `NoAudioCodecSimplex` for separate mic/spkr I2S. `NoDisplay()` for Phase 1. BOOT + USER buttons. | **VERIFIED** |
| `config.json` | `{"target":"esp32s3","builds":[{"name":"p31-node-zero"}]}` | **VERIFIED** |
| `README.md` | Build instructions and links back to P31 docs. | **VERIFIED** |

- [x] All pin numbers in config.h match the **Pin map** table exactly (cross-checked against synthesis doc).
- [x] I2C_0 = 8/9 (shared DRV2605L, SSD1306, AXP2101). I2C_1 = 38/39 (SE050 only). SPI3 = 35/37/36/10/11/12. Buttons = 0, 13.
- [x] No conflicting pins (each GPIO used at most once). I2C/SPI/LoRa/buttons all on unique GPIOs.

---

## Step 4: Register the board in the build

- [x] Board registered in `main/Kconfig.projbuild` as `BOARD_TYPE_P31_NODE_ZERO` — "P31 Labs P31 NodeZero (ESP32-S3, INMP441+MAX98357A)", depends on `IDF_TARGET_ESP32S3`.
- [x] Board registered in `main/CMakeLists.txt`: `CONFIG_BOARD_TYPE_P31_NODE_ZERO` → `BOARD_TYPE "p31-node-zero"` with `font_puhui_basic_14_1`, `font_awesome_14_1`, `twemoji_32`.

---

## Step 5: Build and sanity-check

```bash
# From firmware/xiaozhi-esp32/ (Xiaozhi project root)
idf.py set-target esp32s3
idf.py menuconfig   # → Xiaozhi Assistant → Board Type → "P31 Labs P31 NodeZero"
                     # → Default Language → English
idf.py build
```

- [x] Build completes without errors. `xiaozhi.bin` = 2,237,968 bytes (46% of 4 MB app partition free). ESP-IDF v5.5.2, Xiaozhi v2.2.3, target esp32s3.
- [x] No "undefined pin" or "duplicate pin" issues (verified by code review: all GPIOs unique, `NoAudioCodecSimplex` 8-arg constructor matches).

---

## Step 6: Update P31 repo

Xiaozhi tree is **inside** P31 at `firmware/xiaozhi-esp32/`:

- [x] Board lives at `firmware/xiaozhi-esp32/main/boards/p31-node-zero/` (config.h, config.json, p31-node-zero.cc, README.md).
- [x] Kconfig and CMakeLists.txt updated inside the Xiaozhi tree.
- [x] This checklist and [FIRMWARE_XIAOZHI_SYNTHESIS.md](FIRMWARE_XIAOZHI_SYNTHESIS.md) cross-reference each other.

**Build instructions:** Source `esp-idf-v5.5.2/export.ps1`, `cd firmware/xiaozhi-esp32`, `idf.py set-target esp32s3`, set `CONFIG_BOARD_TYPE_P31_NODE_ZERO=y` + `CONFIG_LANGUAGE_EN_US=y` in sdkconfig (or via `idf.py menuconfig`), then `idf.py build`.

---

## Verification summary

- [x] Xiaozhi v2.2.3 cloned to `firmware/xiaozhi-esp32/` (shallow clone, tag v2.2.3).
- [x] `main/boards/p31-node-zero/` exists with `config.h`, `p31-node-zero.cc`, `config.json`, `README.md`.
- [x] Pin map in `config.h` matches this doc and `FIRMWARE_XIAOZHI_SYNTHESIS.md` exactly.
- [x] Board registered in `main/Kconfig.projbuild` (line 179) and `main/CMakeLists.txt` (line 119).
- [x] `NoAudioCodecSimplex` constructor call matches class signature (8-arg variant for separate I2S mic + spkr).
- [x] `idf.py build` succeeds for board `p31-node-zero`. Binary: `build/xiaozhi.bin` (2.2 MB, 46% partition free).

**Verified by:** Cursor Build Agent, 2026-02-18. Full compile verified — ESP-IDF v5.5.2, Xiaozhi v2.2.3, 2158 objects, zero errors.

**Flash command:**
```bash
idf.py -p PORT flash
# or explicit:
python -m esptool --chip esp32s3 -b 460800 --before default_reset --after hard_reset write_flash --flash_mode dio --flash_size 16MB --flash_freq 80m 0x0 build/bootloader/bootloader.bin 0x8000 build/partition_table/partition-table.bin 0xd000 build/ota_data_initial.bin 0x20000 build/xiaozhi.bin 0x800000 build/generated_assets.bin
```

---
---

# Phase 1b: Hardware Bring-Up & Pipeline Validation

**Goal:** Flash the compiled firmware to an ESP32-S3 dev board with INMP441 mic and MAX98357A speaker, then verify the full voice pipeline: wake word → STT → LLM → TTS → speaker.

---

## Step 7: Hardware wiring

Wire peripherals exactly per the **Pin map** table above and `config.h`.

### INMP441 Microphone (I2S_0)

| INMP441 Pin | ESP32-S3 GPIO | Notes |
|-------------|---------------|-------|
| BCK (SCK)   | **4**         | I2S bit clock |
| WS (LRCK)   | **5**         | I2S word select |
| SD (DATA)   | **6**         | I2S data in |
| L/R         | GND           | Left channel (tie to GND) |
| VDD         | 3.3V          | |
| GND         | GND           | 0.1 uF decoupling cap near VDD recommended |

### MAX98357A Speaker Amplifier (I2S_1)

| MAX98357A Pin | ESP32-S3 GPIO | Notes |
|---------------|---------------|-------|
| BCLK          | **15**        | I2S bit clock |
| LRC (WS)      | **16**        | I2S word select |
| DIN (DATA)    | **17**        | I2S data out |
| GAIN          | Float or tie  | Float = 9 dB. Tie to GND = 15 dB (louder, good for small speakers) |
| SD (enable)   | Float or 3.3V | Float = enabled (internal pull-up). Tie LOW to mute. |
| VIN           | 3.3V or 5V    | 5V gives more headroom for 4-8 ohm speakers |
| GND           | GND           | |
| Speaker+/-    | 4 or 8 ohm    | Small speaker or headphone-to-speaker adapter for bench testing |

### Buttons

| Button | GPIO | Notes |
|--------|------|-------|
| BOOT   | **0** | Built into most ESP32-S3 dev boards. Hold at reset → download mode. |
| USER   | **13** | External momentary switch to GND. Internal pull-up enabled in firmware. |

### Power

- USB power from dev board is sufficient for Phase 1b.
- Leave AXP2101 PMIC, DRV2605L haptics, SSD1306 OLED, SE050, and SX1276 LoRa **disconnected** for now. Firmware uses `NoDisplay()` and no I2C/SPI init in Phase 1.

### Wiring tips

- Keep I2S wires **short** (< 10 cm) and avoid crossing with power lines.
- Common GND between ESP32-S3, INMP441, and MAX98357A is critical.
- If using a breadboard, solder header pins on the breakout modules first — loose connections cause intermittent I2S errors.

- [ ] INMP441 wired: BCK→4, WS→5, DATA→6, L/R→GND, VDD→3.3V, GND→GND.
- [ ] MAX98357A wired: BCLK→15, LRC→16, DIN→17, VIN→3.3V/5V, GND→GND, speaker attached.
- [ ] BOOT button accessible (GPIO 0). USER button wired to GPIO 13 (optional for Phase 1b).
- [ ] All modules share common ground.
- [ ] Visual inspection: no crossed wires, no shorts.

---

## Step 8: Flash and boot

```bash
# From firmware/xiaozhi-esp32/ with ESP-IDF v5.5.2 sourced
# Windows: replace /dev/ttyUSB0 with COMx (check Device Manager)
idf.py -p COM3 flash monitor
```

If the port is busy or not detected:
- Hold **BOOT** button, press **RESET**, release BOOT → forces download mode.
- On Windows, check Device Manager → Ports (COM & LPT) for the ESP32-S3 USB-JTAG port.

### Boot log checkpoints

Watch the serial monitor for these in order:

- [ ] `Board initialized` or `P31_NODE_ZERO` tag appears in logs.
- [ ] I2S driver initialized (no `I2S DMA` or `buffer` errors).
- [ ] Wi-Fi enters config mode (captive portal AP) on first boot, or connects if credentials saved.
- [ ] No crash/reboot loop (guru meditation, stack trace).

---

## Step 9: Wi-Fi and server connection

### First boot — captive portal

1. On first boot with no saved credentials, the device creates a Wi-Fi access point (e.g., "Xiaozhi-xxxx").
2. Connect a phone or laptop to that AP.
3. A captive portal page should open — enter your home Wi-Fi SSID and password.
4. The device reboots and connects to your network.

### Server discovery

The firmware currently uses the default Xiaozhi OTA/server endpoint:

```
CONFIG_OTA_URL="https://api.tenclass.net/xiaozhi/ota/"
```

This URL serves double duty — it provides OTA update info **and** the WebSocket server address for the STT/LLM/TTS pipeline. For initial testing, the default Xiaozhi demo server works fine.

**Later (self-hosted):** To point at your own server or a different LLM backend (DeepSeek, Qwen, etc.), change `CONFIG_OTA_URL` in sdkconfig via menuconfig, or set up a Xiaozhi server instance.

- [ ] Wi-Fi connected (check serial log for IP address).
- [ ] Server handshake successful (WebSocket connected log).

---

## Step 10: Audio pipeline test

### Speaker test (output)

Xiaozhi typically plays a startup tone or greeting on boot. If you hear nothing:

1. Check MAX98357A wiring (BCLK, LRC, DIN).
2. Check GAIN pin — float = 9 dB (quiet), GND = 15 dB (louder).
3. Check SD (enable) pin — must be HIGH or floating (not tied LOW).
4. Check speaker polarity and impedance (4-8 ohm).
5. Serial log: look for `I2S` init messages. Any `buffer underflow` or `DMA` errors indicate clock/wiring issues.

### Microphone test (input)

The default wake word for Xiaozhi is **"Xiao Zhi"** (小智). With `CONFIG_USE_AFE_WAKE_WORD=y`, wake word detection runs locally on the ESP32-S3.

1. Say "Xiao Zhi" clearly near the mic.
2. Watch serial log for wake word detection.
3. After detection, the device starts streaming audio to the server for STT.

If no detection:
- Check INMP441 wiring (BCK, WS, DATA).
- Check L/R pin — must be tied to GND (left channel) or VDD (right channel), not floating.
- I2S Philips mode is standard for INMP441 — this is what `NoAudioCodecSimplex` uses.
- Speak louder / closer for initial testing (INMP441 sensitivity is moderate).

### Full pipeline walk-through

Once Wi-Fi and server are connected, the flow is:

```
1. Wake word detected (local, on ESP32-S3)
   └→ Serial log: wake word detection message
2. Audio streamed to server via WebSocket
   └→ Serial log: audio send / streaming messages
3. Server: STT → LLM → TTS
   └→ Serial log: response received
4. TTS audio streamed back, played through MAX98357A
   └→ Serial log: audio playback messages
   └→ You hear the response from the speaker
```

- [ ] Speaker produces sound on boot (startup tone or greeting).
- [ ] Wake word "Xiao Zhi" triggers detection (visible in serial log).
- [ ] Audio streams to server after wake word.
- [ ] LLM response received and played through speaker.
- [ ] Full round-trip confirmed: voice in → voice out.

---

## Step 11: Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| No sound from speaker | Wiring, GAIN pin, SD pin | Check BCLK/LRC/DIN connections. Tie GAIN to GND for max volume. Ensure SD is not LOW. |
| Audio distorted or garbled | Sample rate mismatch, power noise | Confirm 16 kHz in config.h matches server expectation. Add decoupling caps. Check ground loops. |
| No wake word detection | Mic not working, L/R pin floating | Check BCK/WS/DATA wiring. Tie L/R to GND. Speak closer. |
| Wi-Fi connects but no server | Firewall, server down, wrong URL | Verify `CONFIG_OTA_URL` points to a reachable server. Check internet from the same network. |
| Crash on audio start | I2S DMA, interrupt conflict | Check GPIO conflicts. Ensure no other peripheral uses GPIO 4/5/6/15/16/17. |
| Boot loop (guru meditation) | Stack overflow, pin conflict | Read the backtrace in serial log. Compare against known Xiaozhi issues on GitHub. |
| Device enters download mode | BOOT button stuck or GPIO 0 shorted | Ensure GPIO 0 is not tied LOW during normal boot (only for flashing). |

---

## Step 12: Validate and document results

After successful pipeline test:

- [ ] Record a short video or photo of the bench setup for documentation.
- [ ] Note the COM port, Wi-Fi network used, and any config changes made.
- [ ] Save the serial log output from a successful wake-word-to-response cycle.
- [ ] Update this checklist with pass/fail for each item above.

---

## Phase 1b summary

- [ ] Hardware wired per pin map. All connections verified.
- [ ] Firmware flashed successfully. Boot log clean.
- [ ] Wi-Fi connected. Server handshake confirmed.
- [ ] Speaker output works (startup sound heard).
- [ ] Microphone input works (wake word detected).
- [ ] Full pipeline validated: wake word → STT → LLM → TTS → speaker.

**After Phase 1b:** Proceed to Phase 2 — add SSD1306 OLED display (I2C_0, addr 0x3C), DRV2605L haptic driver (I2C_0, addr 0x5A), then SX1276 LoRa mesh (SPI3). See [FIRMWARE_XIAOZHI_SYNTHESIS.md](FIRMWARE_XIAOZHI_SYNTHESIS.md) for the full build order.
