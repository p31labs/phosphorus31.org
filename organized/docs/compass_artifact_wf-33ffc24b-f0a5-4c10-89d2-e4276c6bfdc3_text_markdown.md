# ESP-IDF 5.5 Migration: `lsb_first` is NOT removed—it's nested

The `lsb_first` member **still exists** in ESP-IDF 5.5. Your build error stems from incorrect struct access: the flag moved inside a nested `flags` struct and must be accessed as `.flags.lsb_first`, not as a top-level member. However, your Waveshare ESP32-S3-Touch-LCD-3.5B project uses QSPI display configuration which bypasses this issue entirely—QSPI displays use dedicated helper macros that don't require manual `lsb_first` configuration.

---

## The `lsb_first` field lives inside a nested struct

The `esp_lcd_panel_io_spi_config_t` structure in ESP-IDF 5.5.2 contains `lsb_first` as a bitfield inside an anonymous `flags` struct. This causes compile errors when developers try to set it as a top-level member.

**Wrong (causes error):**
```c
esp_lcd_panel_io_spi_config_t io_config = {
    .lsb_first = 1,  // ❌ Compile error: no member named 'lsb_first'
};
```

**Correct (nested access):**
```c
esp_lcd_panel_io_spi_config_t io_config = {
    .flags = {
        .lsb_first = 1,  // ✅ Correct path
    },
};
```

The complete struct definition in ESP-IDF 5.5 includes these flag members: `dc_high_on_cmd`, `dc_low_on_data`, `dc_low_on_param`, `octal_mode`, `quad_mode`, `sio_mode`, **`lsb_first`**, and `cs_high_active`—all accessed through `.flags`.

---

## QSPI displays require different configuration entirely

Your AXS15231B display uses **QSPI interface**, which doesn't use `esp_lcd_panel_io_spi_config_t` directly. Instead, ESP-IDF provides the `esp_lcd_axs15231b` component with purpose-built helper macros that handle byte order automatically.

### Required component installation

```bash
idf.py add-dependency "espressif/esp_lcd_axs15231b^2.0.2"
```

### Correct QSPI initialization code for AXS15231B

```c
#include "esp_lcd_panel_io.h"
#include "esp_lcd_panel_ops.h"
#include "esp_lcd_axs15231b.h"
#include "driver/spi_master.h"

// Pin definitions from your Google Drive documentation
#define LCD_HOST         SPI2_HOST
#define PIN_LCD_CLK      12   // SCLK
#define PIN_LCD_D0       11   // DATA0 (MOSI)
#define PIN_LCD_D1       13   // DATA1
#define PIN_LCD_D2       14   // DATA2
#define PIN_LCD_D3       15   // DATA3
#define PIN_LCD_CS       10   // Chip Select
#define PIN_LCD_RST      -1   // Via PMIC

void init_qspi_display(void) {
    // Step 1: Initialize QSPI bus using helper macro
    const spi_bus_config_t buscfg = AXS15231B_PANEL_BUS_QSPI_CONFIG(
        PIN_LCD_CLK, PIN_LCD_D0, PIN_LCD_D1, 
        PIN_LCD_D2, PIN_LCD_D3,
        320 * 80 * sizeof(uint16_t)  // max_transfer_sz
    );
    ESP_ERROR_CHECK(spi_bus_initialize(LCD_HOST, &buscfg, SPI_DMA_CH_AUTO));

    // Step 2: Create panel IO with QSPI config macro
    esp_lcd_panel_io_handle_t io_handle = NULL;
    const esp_lcd_panel_io_spi_config_t io_config = AXS15231B_PANEL_IO_QSPI_CONFIG(
        PIN_LCD_CS, NULL, NULL
    );
    ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi(
        (esp_lcd_spi_bus_handle_t)LCD_HOST, &io_config, &io_handle
    ));

    // Step 3: Configure AXS15231B with QSPI flag enabled
    esp_lcd_panel_handle_t panel_handle = NULL;
    const axs15231b_vendor_config_t vendor_config = {
        .flags = {
            .use_qspi_interface = 1,  // CRITICAL for QSPI mode
        },
    };
    
    const esp_lcd_panel_dev_config_t panel_config = {
        .reset_gpio_num = PIN_LCD_RST,
        .rgb_ele_order = LCD_RGB_ELEMENT_ORDER_RGB,
        .bits_per_pixel = 16,
        .vendor_config = (void *)&vendor_config,
    };
    
    ESP_ERROR_CHECK(esp_lcd_new_panel_axs15231b(io_handle, &panel_config, &panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_reset(panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_init(panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel_handle, true));
}
```

The `AXS15231B_PANEL_IO_QSPI_CONFIG` macro automatically sets `flags.quad_mode = true` and `dc_gpio_num = -1` (DC pin not needed for QSPI). Byte order is handled internally by the QSPI protocol.

---

## Your Google Drive documents reveal pin mapping conflicts

Your documentation shows **two different pin configurations** that need reconciliation:

| Pin Function | pins.h (v4.0) | Technical Manifest |
|--------------|---------------|-------------------|
| LCD CS | GPIO 10 | GPIO 10 |
| LCD CLK | GPIO 12 | GPIO 12 |
| LCD D0 (MOSI) | GPIO 11 | GPIO 11 |
| LCD D1 | GPIO 13 | — |
| LCD D2 | GPIO 14 | — |
| LCD D3 | GPIO 15 | — |
| Backlight | Via PMIC ALDO1 | GPIO 46 |
| I2C SDA | GPIO 8 | GPIO 5 |
| I2C SCL | GPIO 9 | GPIO 6/7 |

**Critical finding:** Your backlight is controlled via the **AXP2101 PMIC's ALDO1 rail** (I2C address 0x34), not a direct GPIO. The `PIN_LCD_BL = -1` in pins.h confirms this. You must initialize the PMIC before the display will illuminate.

### Backlight via PMIC initialization

```c
// Required: Enable ALDO1 on AXP2101 for backlight power
#define AXP2101_ADDR 0x34
// Write to ALDO1 enable register before display init
```

---

## Your project uses LovyanGFX, not native ESP-IDF APIs

Your Execution Guide reveals the project architecture uses **Arduino framework with LovyanGFX library**, not native ESP-IDF `esp_lcd` APIs:

```ini
[env:phenix_phantom]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
board_build.arduino.memory_type = qio_opi  # Critical for Octal PSRAM

lib_deps = 
    lovyan03/LovyanGFX
```

If you're encountering `lsb_first` errors in this context, you may be mixing ESP-IDF native code with Arduino framework. LovyanGFX handles display configuration differently—you configure it through `LGFX_Device` class setup, not `esp_lcd_panel_io_spi_config_t`.

---

## ESP-IDF 5.5 build commands for ESP32-S3

### Native ESP-IDF build sequence

```bash
# One-time target setup (clears build directory)
idf.py set-target esp32s3

# Build
idf.py build

# Flash with port specification
idf.py -p /dev/ttyACM0 flash        # USB Serial/JTAG (built-in)
idf.py -p /dev/ttyUSB0 flash        # USB-UART bridge (CP2102/CH340)

# Combined flash and monitor
idf.py -p /dev/ttyACM0 flash monitor
```

### PlatformIO equivalent

```bash
pio run                    # Build
pio run -t upload          # Flash
pio device monitor         # Serial monitor
pio run -t menuconfig      # Configuration
```

### Required sdkconfig.defaults for ESP32-S3 with Octal PSRAM

```ini
CONFIG_IDF_TARGET="esp32s3"
CONFIG_SPIRAM=y
CONFIG_SPIRAM_MODE_OCT=y
CONFIG_ESP_CONSOLE_USB_SERIAL_JTAG=y
```

---

## Resolution summary for your build error

| Issue | Solution |
|-------|----------|
| `lsb_first` compile error | Access via `.flags.lsb_first` (nested struct) |
| QSPI display configuration | Use `AXS15231B_PANEL_IO_QSPI_CONFIG` macro—`lsb_first` not needed |
| Framework mismatch | If using LovyanGFX+Arduino, don't use `esp_lcd` APIs directly |
| Backlight not working | Initialize AXP2101 PMIC ALDO1 rail before display |
| Pin conflicts | Verify against pins.h (GPIO 10-15 for QSPI) |

The most likely fix: Add the `esp_lcd_axs15231b` component dependency and use its QSPI helper macros, which eliminate the need to manually configure `lsb_first` or other low-level SPI flags. The component handles all byte-order and timing configuration internally for the AXS15231B QSPI interface.