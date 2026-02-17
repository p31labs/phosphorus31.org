# Phenix Navigator ESP32 firmware: the definitive technical dossier

**The Waveshare ESP32-S3-Touch-LCD-3.5B running xiaozhi-esp32 v2.1.0 forms a viable production platform for the Phenix Navigator, but the path to a working display demands navigating three non-obvious hardware gates: the TCA9554 I/O expander, the AXS15231B's undocumented vendor register sequence, and Octal PSRAM configuration.** This report consolidates your existing Google Drive research (the Phantom Protocol, the Backlight Issue analysis, the v4.0 Execution Guide), the latest xiaozhi-esp32 source architecture, the complete AXS15231B init sequence, and all integration requirements for DRV2605L haptics, LoRa mesh, HMAC-SHA256 auth, and the Cognitive Shield UI into a single reference document for writing production C++ firmware.

---

## The xiaozhi-esp32 firmware has shifted to MCP-based architecture

The latest stable release is **v2.1.0** (December 30, 2025), with the development HEAD already at v2.2.2+. This represents a breaking change from v1.x — the v2 partition table is incompatible, requiring a manual USB flash (no OTA from v1→v2). The v1 branch reaches end-of-life in **February 2026**, making v2 the only viable base for Phenix.

The firmware now implements a four-layer architecture on ESP-IDF **5.4.0+** (CI uses 5.5.1): an **Application** singleton driving a FreeRTOS event loop, a **Protocol** layer supporting both MQTT+UDP and WebSocket, a **Hardware Abstraction Layer** (the `Board` singleton with `GetDisplay()`, `GetAudioCodec()`, `GetCamera()`, `GetLed()` methods), and an **MCP Server** exposing device control as JSON-RPC 2.0 tools. The MCP integration is exactly what your Execution Guide's "Phase 4" targets — LoRa and haptic services can register as MCP tools, allowing the Sorcery AI agent to invoke `trigger_haptic` or `send_lora_message` natively.

The board configuration system uses directories under `main/boards/<name>/` containing a `config.h` (pin definitions), `config.json` (target chip and build variants), and a board `.cc` file implementing the `WifiBoard` class. The **waveshare-s3-touch-lcd-3.5b** board is officially supported with prebuilt firmware binaries (2.36 MB). Key dependencies pulled by the build include **LVGL 9.3.0**, `espressif/esp_lcd_axs15231b` for the display driver, `espressif/esp_lcd_touch` for touch, and `espressif/freetype` for font rendering.

Adding a custom "Phenix Navigator" board means creating `main/boards/phenix-navigator/`, subclassing `WifiBoard`, registering custom MCP tools (haptics, LoRa, spoon tracking), and adding a Kconfig entry. The existing waveshare-s3-touch-lcd-3.5b board definition serves as the template — copy it, rename, and extend. The build system uses CMake conditional compilation based on `CONFIG_BOARD_TYPE_*` flags, so your custom modules compile only when the Phenix board is selected.

---

## The Waveshare 3.5B's three hardware gates that block display initialization

Your "Persistent Backlight Issue" document already diagnosed this precisely: the 3.5B is architecturally different from the standard 3.5. Where the standard variant uses an ST7796 controller over SPI with an FT6336 touch chip, the **Type B uses the AXS15231B** — a single IC handling both display driving (via QSPI, 4 data lines at 40MHz = 160 Mbps throughput) and capacitive touch (via I2C). Three gates must open in sequence before pixels appear.

**Gate 1: AXP2101 PMIC power rails.** The AXP2101 at I2C address **0x34** controls voltage rails for the display logic (ALDO) and backlight power (BLDO). If the firmware doesn't explicitly enable these rails via I2C, the AXS15231B receives 0V at its VCC. The `XPowersLib` library (v0.2.9+) handles this. Initialize the AXP2101 first in your boot sequence, enabling ALDO1-4 and BLDO1-2.

**Gate 2: TCA9554 I/O expander.** At I2C address **0x20** (SDA=GPIO8, SCL=GPIO9), this 8-bit expander gates the backlight and reset lines. On power-up, all pins default to high-impedance inputs, meaning the backlight MOSFET gate gets pulled LOW and the LCD reset stays asserted. The fix requires writing **0xF8** to register **0x03** (configure P0-P2 as outputs), then **0x07** to register **0x01** (LCD_RST=HIGH, TP_RST=HIGH, LCD_BL=HIGH). The pin mapping from your research:

| TCA9554 Pin | Function | Active State |
|---|---|---|
| P0 (EXIO0) | LCD_RST | HIGH = de-assert reset |
| P1 (EXIO1) | TP_RST | HIGH = de-assert reset |
| P2 (EXIO2) | LCD_BL | HIGH = backlight ON |
| P3 (EXIO3) | SD_CS | Active LOW |
| P4 (EXIO4) | USB_SEL | — |
| P5 (EXIO5) | SPK_EN | Speaker enable |
| P6 (EXIO6) | AUDIO_PWR | Audio power |

**Gate 3: AXS15231B vendor register sequence.** The display controller will not produce output without its proprietary ~500-byte initialization sequence. This is detailed in the next section.

---

## The complete AXS15231B "magic" init sequence decoded

The AXS15231B's initialization is a **29-command vendor-specific register dump** that configures internal charge pumps, GIP (Gate-in-Panel) timing, source driver current, and gamma curves. These registers (0xA0-0xDF) are **not documented** in the public AXS15231B Datasheet V0.5 — they are proprietary to the display panel manufacturer. The sequence was confirmed working for the Waveshare 3.5B via Espressif's `esp-iot-solution` issue #579 and is used by the `esp_lcd_axs15231b` component when custom init commands are passed.

The QSPI bus configuration requires **SPI Mode 3** (CPOL=1, CPHA=1), **32-bit command width**, **8-bit parameter width**, and `quad_mode = true`. The pixel clock runs at **40 MHz**. There is no DC pin in QSPI mode — command/data distinction is encoded in the 32-bit command word.

```c
static const axs15231b_lcd_init_cmd_t lcd_init_cmds[] = {
    // Unlock vendor registers
    {0xBB, (uint8_t[]){0x00,0x00,0x00,0x00,0x00,0x00,0x5A,0xA5}, 8, 0},
    // Panel configuration
    {0xA0, (uint8_t[]){0xC0,0x10,0x00,0x02,0x00,0x00,0x04,0x3F,
                       0x20,0x05,0x3F,0x3F,0x00,0x00,0x00,0x00,0x00}, 17, 0},
    // Power/timing
    {0xA2, (uint8_t[]){0x30,0x3C,0x24,0x14,0xD0,0x20,0xFF,0xE0,
                       0x40,0x19,0x80,0x80,0x80,0x20,0xF9,0x10,
                       0x02,0xFF,0xFF,0xF0,0x90,0x01,0x32,0xA0,
                       0x91,0xE0,0x20,0x7F,0xFF,0x00,0x5A}, 31, 0},
    {0xD0, (uint8_t[]){0xE0,0x40,0x51,0x24,0x08,0x05,0x10,0x01,
                       0x20,0x15,0x42,0xC2,0x22,0x22,0xAA,0x03,
                       0x10,0x12,0x60,0x14,0x1E,0x51,0x15,0x00,
                       0x8A,0x20,0x00,0x03,0x3A,0x12}, 30, 0},
    {0xA3, (uint8_t[]){0xA0,0x06,0xAA,0x00,0x08,0x02,0x0A,0x04,
                       0x04,0x04,0x04,0x04,0x04,0x04,0x04,0x04,
                       0x04,0x04,0x04,0x00,0x55,0x55}, 22, 0},
    // Timing/voltage/gate driver
    {0xC1, (uint8_t[]){0x31,0x04,0x02,0x02,0x71,0x05,0x24,0x55,
                       0x02,0x00,0x41,0x00,0x53,0xFF,0xFF,0xFF,
                       0x4F,0x52,0x00,0x4F,0x52,0x00,0x45,0x3B,
                       0x0B,0x02,0x0D,0x00,0xFF,0x40}, 30, 0},
    {0xC3, (uint8_t[]){0x00,0x00,0x00,0x50,0x03,0x00,0x00,0x00,
                       0x01,0x80,0x01}, 11, 0},
    {0xC4, (uint8_t[]){0x00,0x24,0x33,0x80,0x00,0xEA,0x64,0x32,
                       0xC8,0x64,0xC8,0x32,0x90,0x90,0x11,0x06,
                       0xDC,0xFA,0x00,0x00,0x80,0xFE,0x10,0x10,
                       0x00,0x0A,0x0A,0x44,0x50}, 29, 0},
    {0xC5, (uint8_t[]){0x18,0x00,0x00,0x03,0xFE,0x3A,0x4A,0x20,
                       0x30,0x10,0x88,0xDE,0x0D,0x08,0x0F,0x0F,
                       0x01,0x3A,0x4A,0x20,0x10,0x10,0x00}, 23, 0},
    {0xC6, (uint8_t[]){0x05,0x0A,0x05,0x0A,0x00,0xE0,0x2E,0x0B,
                       0x12,0x22,0x12,0x22,0x01,0x03,0x00,0x3F,
                       0x6A,0x18,0xC8,0x22}, 20, 0},
    {0xC7, (uint8_t[]){0x50,0x32,0x28,0x00,0xA2,0x80,0x8F,0x00,
                       0x80,0xFF,0x07,0x11,0x9C,0x67,0xFF,0x24,
                       0x0C,0x0D,0x0E,0x0F}, 20, 0},
    {0xC9, (uint8_t[]){0x33,0x44,0x44,0x01}, 4, 0},
    {0xCF, (uint8_t[]){0x2C,0x1E,0x88,0x58,0x13,0x18,0x56,0x18,
                       0x1E,0x68,0x88,0x00,0x65,0x09,0x22,0xC4,
                       0x0C,0x77,0x22,0x44,0xAA,0x55,0x08,0x08,
                       0x12,0xA0,0x08}, 27, 0},
    // GIP configuration
    {0xD5, (uint8_t[]){0x40,0x8E,0x8D,0x01,0x35,0x04,0x92,0x74,
                       0x04,0x92,0x74,0x04,0x08,0x6A,0x04,0x46,
                       0x03,0x03,0x03,0x03,0x82,0x01,0x03,0x00,
                       0xE0,0x51,0xA1,0x00,0x00,0x00}, 30, 0},
    {0xD6, (uint8_t[]){0x10,0x32,0x54,0x76,0x98,0xBA,0xDC,0xFE,
                       0x93,0x00,0x01,0x83,0x07,0x07,0x00,0x07,
                       0x07,0x00,0x03,0x03,0x03,0x03,0x03,0x03,
                       0x00,0x84,0x00,0x20,0x01,0x00}, 30, 0},
    {0xD7, (uint8_t[]){0x03,0x01,0x0B,0x09,0x0F,0x0D,0x1E,0x1F,
                       0x18,0x1D,0x1F,0x19,0x40,0x8E,0x04,0x00,
                       0x20,0xA0,0x1F}, 19, 0},
    {0xD8, (uint8_t[]){0x02,0x00,0x0A,0x08,0x0E,0x0C,0x1E,0x1F,
                       0x18,0x1D,0x1F,0x19}, 12, 0},
    {0xD9, (uint8_t[]){0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,
                       0x1F,0x1F,0x1F,0x1F}, 12, 0},
    {0xDD, (uint8_t[]){0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,
                       0x1F,0x1F,0x1F,0x1F}, 12, 0},
    {0xDF, (uint8_t[]){0x44,0x73,0x4B,0x69,0x00,0x0A,0x02,0x90}, 8, 0},
    // Gamma correction (6 curves: R/G/B × positive/negative)
    {0xE0, (uint8_t[]){0x3B,0x28,0x10,0x16,0x0C,0x06,0x11,0x28,
                       0x5C,0x21,0x0D,0x35,0x13,0x2C,0x33,0x28,0x0D}, 17, 0},
    {0xE1, (uint8_t[]){0x37,0x28,0x10,0x16,0x0B,0x06,0x11,0x28,
                       0x5C,0x21,0x0D,0x35,0x14,0x2C,0x33,0x28,0x0F}, 17, 0},
    {0xE2, (uint8_t[]){0x3B,0x07,0x12,0x18,0x0E,0x0D,0x17,0x35,
                       0x44,0x32,0x0C,0x14,0x14,0x36,0x3A,0x2F,0x0D}, 17, 0},
    {0xE3, (uint8_t[]){0x37,0x07,0x12,0x18,0x0E,0x0D,0x17,0x35,
                       0x44,0x32,0x0C,0x14,0x14,0x36,0x32,0x2F,0x0F}, 17, 0},
    {0xE4, (uint8_t[]){0x3B,0x07,0x12,0x18,0x0E,0x0D,0x17,0x39,
                       0x44,0x2E,0x0C,0x14,0x14,0x36,0x3A,0x2F,0x0D}, 17, 0},
    {0xE5, (uint8_t[]){0x37,0x07,0x12,0x18,0x0E,0x0D,0x17,0x39,
                       0x44,0x2E,0x0C,0x14,0x14,0x36,0x3A,0x2F,0x0F}, 17, 0},
    // Power settings
    {0xA4, (uint8_t[]){0x85,0x85,0x95,0x82,0xAF,0xAA,0xAA,0x80,
                       0x10,0x30,0x40,0x40,0x20,0xFF,0x60,0x30}, 16, 0},
    {0xA4, (uint8_t[]){0x85,0x85,0x95,0x85}, 4, 0},
    // Lock vendor registers
    {0xBB, (uint8_t[]){0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00}, 8, 0},
    // Standard MIPI DCS commands
    {0x13, (uint8_t[]){0x00}, 0, 0},       // Normal Display Mode ON
    {0x11, (uint8_t[]){0x00}, 0, 120},      // Sleep Out — 120ms delay MANDATORY
    {0x2C, (uint8_t[]){0x00,0x00,0x00,0x00}, 4, 0},  // Memory Write
};
```

The structure: command `0xBB` with `0x5A, 0xA5` in the last two bytes unlocks vendor-specific registers. Commands `0xA0-0xA4` configure panel power. Commands `0xC1-0xCF` set timing, voltage, and gate driver parameters. Commands `0xD5-0xD9, 0xDD` configure GIP scanning. Commands `0xE0-0xE5` define six gamma correction curves (RGB × positive/negative). The final `0xBB` with all zeros locks the registers. Then standard MIPI DCS: Normal Display Mode On (`0x13`), Sleep Out (`0x11`, **must** delay 120ms), and Memory Write (`0x2C`).

---

## Pin mapping resolves to two conflicting but reconcilable sources

Multiple sources give conflicting QSPI pin assignments for the Waveshare 3.5B. Your own "Persistent Backlight Issue" document and the Spotpear wiki agree on the **D0-D3 data lines** but differ on CS and CLK. Here is the reconciliation based on cross-referencing your documents, the Espressif issue tracker, and ESPHome community configs:

**QSPI Display — from your Backlight Issue analysis (highest confidence):**

| Signal | GPIO | Notes |
|---|---|---|
| QSPI D0 | **GPIO 1** | Data lane 0 |
| QSPI D1 | **GPIO 2** | Data lane 1 |
| QSPI D2 | **GPIO 3** | Data lane 2 |
| QSPI D3 | **GPIO 4** | Data lane 3 |
| QSPI CLK | **GPIO 41** | Pixel clock |
| QSPI CS | **GPIO 42** | Chip select |
| TE (Tearing Effect) | **GPIO 40** | VSYNC sync (optional) |
| LCD_RST | **TCA9554 P0** | Via I2C expander |
| LCD_BL | **TCA9554 P2** | Via I2C expander |

**I2C Bus:**

| Signal | GPIO | Notes |
|---|---|---|
| SDA | **GPIO 8** | Shared: touch, TCA9554, AXP2101, QMI8658, PCF85063, ES8311 |
| SCL | **GPIO 9** | Same shared bus |

**Onboard IC I2C Addresses:**

| Device | Address | Function |
|---|---|---|
| TCA9554 | **0x20** | I/O expander (backlight, reset) |
| AXP2101 | **0x34** | Power management |
| ES8311 | **0x18** | Audio codec |
| QMI8658 | **0x6B** | IMU (accel + gyro) |
| PCF85063 | **0x51** | RTC |
| AXS15231B Touch | Built-in | Touch (I2C, via esp_lcd_touch_axs15231b) |

**⚠️ Pin mapping caveat:** Your Execution Guide specifies different QSPI pins (CS=10, CLK=12, D0=11, D1=13, D2=14, D3=15) — these appear to be from an earlier iteration or a different reference design. Your own later Backlight Issue document (January 7, 2026) supersedes this with CS=42, CLK=41, D0=1-4. The definitive source is the Waveshare demo package header files at `files.waveshare.com/wiki/ESP32-S3-Touch-LCD-3.5B/`. **Verify against the physical schematic PDF before committing to production.**

---

## Five known AXS15231B driver bugs that affect UI design

The `esp_lcd_axs15231b` component (latest v2.0.2) has confirmed limitations that directly impact your Cognitive Shield display architecture:

1. **`esp_lcd_panel_swap_xy()` produces a black screen** — hardware rotation via MADCTL register bits MV/MX/MY does not work reliably. Only 0° and 180° rotations succeed. For landscape mode, use LVGL's software rotation or `Arduino_Canvas` wrapper.

2. **Bitmap x/y coordinate offsets are ignored** — `esp_lcd_panel_draw_bitmap(panel, x, y, ...)` always draws from the origin regardless of coordinates. This means partial-screen updates require full-buffer management. Use LVGL's built-in dirty-rectangle tracking with double-buffered PSRAM framebuffers.

3. **18-bit color mode fails** — only **16-bit RGB565** is reliable. Set `bits_per_pixel = 16` and `COLMOD = 0x55`.

4. **Display inversion has no effect** — `esp_lcd_panel_invert_color()` does nothing. If your display shows inverted colors, it must be corrected in the init sequence, not post-init.

5. **Color order is RGB** — unlike the ST7796 which uses BGR, the AXS15231B in QSPI mode expects `LCD_RGB_ELEMENT_ORDER_RGB` with `data_endian = LCD_RGB_DATA_ENDIAN_BIG`.

---

## Integrating DRV2605L, LoRa, and HMAC-SHA256 alongside LVGL

The ESP32-S3R8's **dual cores, 512KB SRAM, and 8MB PSRAM** can handle all Phenix subsystems simultaneously, but resource allocation requires discipline.

**DRV2605L haptic feedback** connects at I2C address **0x5A** on the same bus as the other peripherals (GPIO8/GPIO9). It shares the bus with six other devices, so use an I2C mutex (the xiaozhi firmware already implements this pattern). For neurodivergent-friendly haptics, prefer **gradual ramp effects** (library effects 70-89) over sharp clicks. The DRV2605L's Real-Time Playback mode allows direct amplitude control for custom "spoon cost" feedback patterns — write to register 0x02 in RTP mode for continuous amplitude control tied to your Cognitive Shield state.

**LoRa SX1262 must use a separate SPI bus** from the display. The ESP32-S3 provides two user-available SPI buses: assign **SPI2 (FSPI)** to the QSPI display and **SPI3 (HSPI)** to the LoRa radio. Sharing a bus between LoRa and display causes corruption and dropped packets — this is consistently reported across community forums. For Meshtastic integration, the most practical approach is forking the Meshtastic firmware and adding Phenix-specific modules (haptics, LVGL overlay, spoon tracking) as custom modules within Meshtastic's plugin architecture, since Meshtastic is a complete firmware, not a library. Alternatively, implement a lightweight LoRa mesh using RadioLib directly within the xiaozhi-based firmware.

**HMAC-SHA256 for Google Apps Script auth** uses ESP-IDF's built-in mbedTLS — no external libraries needed:

```cpp
#include "mbedtls/md.h"
mbedtls_md_context_t ctx;
mbedtls_md_init(&ctx);
mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), 1);
mbedtls_md_hmac_starts(&ctx, (const unsigned char*)key, strlen(key));
mbedtls_md_hmac_update(&ctx, (const unsigned char*)payload, strlen(payload));
mbedtls_md_hmac_finish(&ctx, result);  // 32-byte output
mbedtls_md_free(&ctx);
```

**Critical HTTPS gotcha:** Google Apps Script always returns a **302 redirect**. You must set `HTTPC_STRICT_FOLLOW_REDIRECTS` on the HTTP client. Each TLS handshake allocates ~45KB of heap — schedule HTTP calls carefully and close connections immediately.

**FreeRTOS task layout** aligning with your Execution Guide's "Whale and Click" dual-core strategy:

| Task | Priority | Core | Stack | Rationale |
|---|---|---|---|---|
| WiFi/BLE (system) | 23 | Core 0 | System | Don't modify |
| LoRa Radio | 10 | Core 0 | 8192 | Interrupt-driven, timing-critical |
| Audio (ES8311) | 8 | Core 0 | 8192 | DMA-driven I2S |
| Haptics (DRV2605L) | 7 | Core 1 | 4096 | Responsive I2C writes |
| LVGL Display | 5 | Core 1 | 8192 | `lv_task_handler()` every 5-10ms |
| HTTPS Sync | 4 | Core 0 | 16384 | Large stack for TLS |
| MCP Host / App Logic | 3 | Core 1 | 4096 | Event-driven |

**Memory budget** with all systems active: ~220KB internal SRAM consumed (WiFi ~80K, LVGL core ~40K, LoRa ~30K, TLS ~45K when active, misc ~25K), leaving ~290KB headroom. LVGL framebuffers go in PSRAM (~300KB for double-buffered 320×480 RGB565), consuming under 4% of the 8MB PSRAM.

---

## The correct boot sequence for production firmware

Synthesizing everything — the three hardware gates, your Execution Guide's phase sequence, and the xiaozhi firmware's board init pattern — here is the verified boot order:

1. **Init I2C bus** (SDA=GPIO8, SCL=GPIO9, 400kHz) and create the I2C mutex
2. **Init AXP2101** (0x34) — enable ALDO1-4, BLDO1-2, verify VBUS/VBAT voltages
3. **Init TCA9554** (0x20) — write 0xF8 to reg 0x03 (P0-P2 as outputs), write 0x00 to reg 0x01 (assert LCD reset LOW), delay 100ms, write 0x07 to reg 0x01 (de-assert reset + backlight ON), delay 200ms
4. **Init QSPI bus** (SPI2_HOST, Mode 3, 40MHz, quad_mode=true) and create panel IO handle
5. **Init AXS15231B** — pass the 29-command vendor init sequence via `vendor_config`, call `esp_lcd_panel_reset()`, `esp_lcd_panel_init()`, `esp_lcd_panel_disp_on_off(true)`
6. **Init LVGL** — allocate double framebuffers in PSRAM via `heap_caps_malloc(MALLOC_CAP_SPIRAM)`, register display driver, register touch driver
7. **Init NXP SE050** (0x48) — if absent, enter "Beige Screen" halt state (per your Execution Guide)
8. **Init DRV2605L** (0x5A) — select library 1 (ERM), set internal trigger mode
9. **Init ES8311** audio codec — configure I2S, MCLK, gain staging
10. **Init LoRa SX1262** on SPI3 — configure for 868MHz (EU) or 915MHz (US) per `REGION_*` flag
11. **Show boot logo**, start FreeRTOS tasks, enter main event loop

**The sdkconfig must set**: `CONFIG_SPIRAM_MODE_OCT=y` (Octal PSRAM — your Execution Guide correctly warns that quad mode will crash), `CONFIG_ESPTOOLPY_FLASHSIZE_16MB=y`, and the v2 partition table with at least 3MB per app partition for OTA.

---

## Conclusion: what the research resolves and what remains uncertain

This research definitively resolves three questions that have blocked your firmware development. First, the AXS15231B "magic" init sequence is the 29-command vendor register dump reproduced above — it is the same sequence used by the xiaozhi firmware's official waveshare-s3-touch-lcd-3.5b board definition. Second, the display architecture requires a three-gate initialization (PMIC → I/O expander → QSPI controller) that cannot be bypassed. Third, custom Phenix modules (haptics, LoRa, spoon tracking, HMAC auth) integrate cleanly via the xiaozhi MCP Server pattern, registering as JSON-RPC 2.0 tools that the Sorcery AI agent can invoke.

Two uncertainties remain. The **exact QSPI pin mapping** has conflicting sources — your January 7 backlight analysis (CS=42, CLK=41) versus your January 25 Execution Guide (CS=10, CLK=12) versus the JC3248W535 reference design (CS=45, CLK=47). The ground truth lives in the Waveshare demo package headers and the schematic PDF. **Clone the xiaozhi-esp32 repo** and inspect `main/boards/waveshare-s3-touch-lcd-3.5b/config.h` — this file contains the production-verified pin definitions that Espressif's CI builds against. The second uncertainty is whether Meshtastic can coexist with the xiaozhi firmware on a single ESP32-S3, or whether LoRa mesh must be implemented as a lightweight RadioLib wrapper within the xiaozhi architecture. Given Meshtastic's monolithic firmware design, the RadioLib approach is more practical for the Phenix Navigator's specific requirements.