/**
 * Node One - The Scope (Display Component Implementation)
 * P31 Ecosystem - Oscilloscope metaphor. Shows the signal.
 * Minimal LVGL display for voice-first interface
 */

#include "display.h"
#include "pin_map.h"
#include "pin_config.h"

#include <string.h>
#include "esp_log.h"
#include "esp_err.h"
#include "esp_lcd_axs15231b.h"
#include "esp_lcd_panel_io.h"
#include "esp_lcd_panel_ops.h"
#include "lvgl.h"
#include "driver/ledc.h"
#include "driver/spi_master.h"
#include "esp_timer.h"
#include "esp_heap_caps.h"
#include "freertos/semphr.h"

static const char *TAG = "display";

// Display handles
#define LCD_SPI_HOST          SPI2_HOST
#define LCD_QSPI_MAX_TRANSFER (DISPLAY_WIDTH * DISPLAY_HEIGHT * 2)  // RGB565
static esp_lcd_panel_handle_t panel_handle = NULL;
static lv_display_t *lv_display = NULL;
static SemaphoreHandle_t lcd_refresh_done = NULL;
static void *buf1 = NULL;
static void *buf2 = NULL;
static esp_timer_handle_t tick_timer = NULL;

// UI objects
static lv_obj_t *status_bar = NULL;
static lv_obj_t *battery_label = NULL;
static lv_obj_t *wifi_label = NULL;
static lv_obj_t *lora_label = NULL;
static lv_obj_t *time_label = NULL;
static lv_obj_t *voice_arc = NULL;
static lv_obj_t *message_badge = NULL;
static lv_obj_t *mode_label = NULL;
static lv_obj_t *spoon_bar = NULL;
static lv_obj_t *spoon_label = NULL;
static lv_obj_t *splash_screen = NULL;

// State
static bool recording_active = false;
static bool splash_shown = false;
static lv_anim_t spoon_flash_anim;
static bool spoon_flash_active = false;

// LVGL tick timer callback
static void lvgl_tick_timer_cb(void *arg) {
    lv_tick_inc(5); // 5ms tick
}

// Initialize backlight PWM
static esp_err_t init_backlight(void) {
    ledc_timer_config_t timer_config = {
        .speed_mode = LEDC_LOW_SPEED_MODE,
        .duty_resolution = LEDC_TIMER_8_BIT,
        .timer_num = LEDC_TIMER_0,
        .freq_hz = 5000,
        .clk_cfg = LEDC_AUTO_CLK
    };
    ESP_ERROR_CHECK(ledc_timer_config(&timer_config));

    ledc_channel_config_t channel_config = {
        .gpio_num = LCD_BL,
        .speed_mode = LEDC_LOW_SPEED_MODE,
        .channel = LEDC_CHANNEL_0,
        .timer_sel = LEDC_TIMER_0,
        .duty = 128, // 50% brightness
        .hpoint = 0
    };
    ESP_ERROR_CHECK(ledc_channel_config(&channel_config));
    
    ESP_LOGI(TAG, "Backlight initialized (GPIO %d)", LCD_BL);
    return ESP_OK;
}

// Set backlight brightness
static void set_backlight_brightness(uint8_t percent) {
    if (percent > 100) percent = 100;
    uint32_t duty = (percent * 255) / 100;
    ledc_set_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0, duty);
    ledc_update_duty(LEDC_LOW_SPEED_MODE, LEDC_CHANNEL_0);
}

// Callback for panel IO when color transfer is done (used by LVGL flush)
static bool on_lcd_trans_done(esp_lcd_panel_io_handle_t panel_io, esp_lcd_panel_io_event_data_t *edata, void *user_ctx) {
    BaseType_t need_yield = pdFALSE;
    if (lcd_refresh_done) {
        xSemaphoreGiveFromISR(lcd_refresh_done, &need_yield);
    }
    return (need_yield == pdTRUE);
}

// Initialize AXS15231B display (SPI bus in QSPI mode + esp_lcd panel IO SPI)
static esp_err_t init_axs15231b(void) {
    ESP_LOGI(TAG, "Initializing AXS15231B QSPI display...");

    lcd_refresh_done = xSemaphoreCreateBinary();
    if (lcd_refresh_done == NULL) {
        ESP_LOGE(TAG, "Failed to create LCD refresh semaphore");
        return ESP_ERR_NO_MEM;
    }

    // SPI bus in QSPI mode (4 data lines) — same as esp_lcd_axs15231b test
    const spi_bus_config_t buscfg = AXS15231B_PANEL_BUS_QSPI_CONFIG(
        LCD_QSPI_CLK,
        LCD_QSPI_D0,
        LCD_QSPI_D1,
        LCD_QSPI_D2,
        LCD_QSPI_D3,
        LCD_QSPI_MAX_TRANSFER);
    ESP_ERROR_CHECK(spi_bus_initialize(LCD_SPI_HOST, &buscfg, SPI_DMA_CH_AUTO));

    // Panel IO (QSPI config)
    esp_lcd_panel_io_handle_t io_handle = NULL;
    const esp_lcd_panel_io_spi_config_t io_config = AXS15231B_PANEL_IO_QSPI_CONFIG(
        LCD_QSPI_CS,
        on_lcd_trans_done,
        NULL);
    ESP_ERROR_CHECK(esp_lcd_new_panel_io_spi((esp_lcd_spi_bus_handle_t)LCD_SPI_HOST, &io_config, &io_handle));

    // Panel dev config with QSPI vendor flag
    const axs15231b_vendor_config_t vendor_config = {
        .init_cmds = NULL,
        .init_cmds_size = 0,
        .init_in_command_mode = false,
        .flags = {
            .use_qspi_interface = 1,
            .use_mipi_interface = 0,
        },
    };
    const esp_lcd_panel_dev_config_t panel_config = {
        .reset_gpio_num = -1,
        .rgb_ele_order = LCD_RGB_ELEMENT_ORDER_RGB,
        .bits_per_pixel = 16,
        .vendor_config = (void *)&vendor_config,
    };
    ESP_ERROR_CHECK(esp_lcd_new_panel_axs15231b(io_handle, &panel_config, &panel_handle));

    ESP_ERROR_CHECK(esp_lcd_panel_reset(panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_init(panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_invert_color(panel_handle, false));
    ESP_ERROR_CHECK(esp_lcd_panel_mirror(panel_handle, false, false));
    ESP_ERROR_CHECK(esp_lcd_panel_swap_xy(panel_handle, false));
    ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel_handle, true));

    ESP_LOGI(TAG, "AXS15231B display initialized (320x480 portrait)");
    return ESP_OK;
}

// Flush callback for LVGL
static void lvgl_flush_cb(lv_display_t *disp, const lv_area_t *area, uint8_t *px_map) {
    if (!disp || !area || !px_map) {
        ESP_LOGE(TAG, "Invalid parameters in flush callback");
        return;
    }
    
    esp_lcd_panel_handle_t panel = (esp_lcd_panel_handle_t)lv_display_get_user_data(disp);
    if (!panel) {
        ESP_LOGE(TAG, "Panel handle is NULL");
        lv_display_flush_ready(disp);
        return;
    }
    
    int offsetx1 = area->x1;
    int offsetx2 = area->x2;
    int offsety1 = area->y1;
    int offsety2 = area->y2;
    
    // Validate area bounds
    if (offsetx1 < 0 || offsety1 < 0 || offsetx2 >= DISPLAY_WIDTH || offsety2 >= DISPLAY_HEIGHT) {
        ESP_LOGW(TAG, "Invalid area bounds: (%d,%d) to (%d,%d)", offsetx1, offsety1, offsetx2, offsety2);
        lv_display_flush_ready(disp);
        return;
    }
    
    esp_lcd_panel_draw_bitmap(panel, offsetx1, offsety1, offsetx2 + 1, offsety2 + 1, px_map);
    if (lcd_refresh_done) {
        xSemaphoreTake(lcd_refresh_done, portMAX_DELAY);
    }
    lv_display_flush_ready(disp);
}

// Initialize LVGL
static esp_err_t init_lvgl(void) {
    ESP_LOGI(TAG, "Initializing LVGL...");
    
    // Allocate display buffers in PSRAM (double buffer)
    size_t buf_size = DISPLAY_WIDTH * DISPLAY_HEIGHT * sizeof(uint16_t);
    
    buf1 = heap_caps_malloc(buf_size, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    buf2 = heap_caps_malloc(buf_size, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    
    if (!buf1 || !buf2) {
        ESP_LOGE(TAG, "Failed to allocate display buffers in PSRAM");
        return ESP_ERR_NO_MEM;
    }
    
    ESP_LOGI(TAG, "Allocated display buffers: %d KB each", buf_size / 1024);
    
    // Initialize LVGL
    lv_init();
    
    // Create display
    lv_display = lv_display_create(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    lv_display_set_user_data(lv_display, panel_handle);
    lv_display_set_flush_cb(lv_display, lvgl_flush_cb);
    
    // Set color format (RGB565, byte-swapped per memory)
    lv_display_set_color_format(lv_display, LV_COLOR_FORMAT_RGB565);
    
    // Set buffers
    lv_display_set_buffers(lv_display, buf1, buf2, buf_size, LV_DISPLAY_RENDER_MODE_PARTIAL);
    
    // Create LVGL tick timer (5ms)
    const esp_timer_create_args_t tick_timer_args = {
        .callback = &lvgl_tick_timer_cb,
        .name = "lvgl_tick"
    };
    ESP_ERROR_CHECK(esp_timer_create(&tick_timer_args, &tick_timer));
    ESP_ERROR_CHECK(esp_timer_start_periodic(tick_timer, 5000)); // 5ms
    
    ESP_LOGI(TAG, "LVGL initialized");
    return ESP_OK;
}

// Create UI components
static void create_ui(void) {
    // Set dark background
    lv_obj_set_style_bg_color(lv_scr_act(), lv_color_hex(0x1a1a2e), LV_PART_MAIN);
    
    // Status bar (top, 40px height)
    status_bar = lv_obj_create(lv_scr_act());
    lv_obj_set_size(status_bar, DISPLAY_WIDTH, 40);
    lv_obj_set_pos(status_bar, 0, 0);
    lv_obj_set_style_bg_color(status_bar, lv_color_hex(0x0f0f1e), LV_PART_MAIN);
    lv_obj_set_style_border_width(status_bar, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(status_bar, 4, LV_PART_MAIN);
    lv_obj_set_layout(status_bar, LV_LAYOUT_FLEX);
    lv_obj_set_flex_flow(status_bar, LV_FLEX_FLOW_ROW);
    lv_obj_set_flex_align(status_bar, LV_FLEX_ALIGN_SPACE_BETWEEN, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);
    
    // Battery label
    battery_label = lv_label_create(status_bar);
    lv_label_set_text(battery_label, "🔋 100%");
    lv_obj_set_style_text_color(battery_label, lv_color_hex(0xffffff), LV_PART_MAIN);
    lv_obj_set_style_text_font(battery_label, &lv_font_montserrat_16, LV_PART_MAIN);
    
    // WiFi label
    wifi_label = lv_label_create(status_bar);
    lv_label_set_text(wifi_label, "📶 --");
    lv_obj_set_style_text_color(wifi_label, lv_color_hex(0x888888), LV_PART_MAIN);
    lv_obj_set_style_text_font(wifi_label, &lv_font_montserrat_16, LV_PART_MAIN);
    
    // LoRa label
    lora_label = lv_label_create(status_bar);
    lv_label_set_text(lora_label, "📡 --");
    lv_obj_set_style_text_color(lora_label, lv_color_hex(0x888888), LV_PART_MAIN);
    lv_obj_set_style_text_font(lora_label, &lv_font_montserrat_16, LV_PART_MAIN);
    
    // Time label
    time_label = lv_label_create(status_bar);
    lv_label_set_text(time_label, "00:00");
    lv_obj_set_style_text_color(time_label, lv_color_hex(0xffffff), LV_PART_MAIN);
    lv_obj_set_style_text_font(time_label, &lv_font_montserrat_16, LV_PART_MAIN);
    
    // Voice activity arc (center, large)
    voice_arc = lv_arc_create(lv_scr_act());
    lv_obj_set_size(voice_arc, 200, 200);
    lv_obj_center(voice_arc);
    lv_obj_set_y(voice_arc, 60); // Offset down from center
    lv_arc_set_range(voice_arc, 0, 360);
    lv_arc_set_value(voice_arc, 0);
    lv_arc_set_bg_angles(voice_arc, 0, 360);
    lv_obj_set_style_arc_color(voice_arc, lv_color_hex(0x333333), LV_PART_MAIN);
    lv_obj_set_style_arc_width(voice_arc, 8, LV_PART_MAIN);
    lv_obj_set_style_arc_color(voice_arc, lv_color_hex(0x444444), LV_PART_INDICATOR);
    lv_obj_set_style_arc_width(voice_arc, 8, LV_PART_INDICATOR);
    lv_obj_remove_style(voice_arc, NULL, LV_PART_KNOB);
    
    // Message badge (top right, small)
    message_badge = lv_label_create(lv_scr_act());
    lv_obj_set_size(message_badge, 40, 20);
    lv_obj_set_pos(message_badge, DISPLAY_WIDTH - 50, 45);
    lv_obj_set_style_bg_color(message_badge, lv_color_hex(0xff4444), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(message_badge, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_radius(message_badge, 10, LV_PART_MAIN);
    lv_obj_set_style_border_width(message_badge, 0, LV_PART_MAIN);
    lv_obj_set_style_text_color(message_badge, lv_color_hex(0xffffff), LV_PART_MAIN);
    lv_obj_set_style_text_font(message_badge, &lv_font_montserrat_16, LV_PART_MAIN);
    lv_label_set_text(message_badge, "0");
    lv_obj_set_style_text_align(message_badge, LV_TEXT_ALIGN_CENTER, LV_PART_MAIN);
    lv_obj_add_flag(message_badge, LV_OBJ_FLAG_HIDDEN);
    
    // Mode label (bottom center)
    mode_label = lv_label_create(lv_scr_act());
    lv_label_set_text(mode_label, "IDLE");
    lv_obj_set_style_text_color(mode_label, lv_color_hex(0x00ff00), LV_PART_MAIN);
    lv_obj_set_style_text_font(mode_label, &lv_font_montserrat_20, LV_PART_MAIN);
    lv_obj_align(mode_label, LV_ALIGN_BOTTOM_MID, 0, -50);
    
    // Spoon meter (bottom, horizontal bar)
    spoon_bar = lv_bar_create(lv_scr_act());
    lv_obj_set_size(spoon_bar, DISPLAY_WIDTH - 40, 20);
    lv_obj_align(spoon_bar, LV_ALIGN_BOTTOM_MID, 0, -20);
    lv_bar_set_range(spoon_bar, 0, 12);
    lv_bar_set_value(spoon_bar, 8, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(spoon_bar, lv_color_hex(0x333333), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(spoon_bar, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_bg_color(spoon_bar, lv_color_hex(0x00ff00), LV_PART_INDICATOR);
    lv_obj_set_style_bg_opa(spoon_bar, LV_OPA_COVER, LV_PART_INDICATOR);
    
    // Spoon label
    spoon_label = lv_label_create(lv_scr_act());
    lv_label_set_text(spoon_label, "⚡ 8/12");
    lv_obj_set_style_text_color(spoon_label, lv_color_hex(0xffffff), LV_PART_MAIN);
    lv_obj_set_style_text_font(spoon_label, &lv_font_montserrat_16, LV_PART_MAIN);
    lv_obj_align(spoon_label, LV_ALIGN_BOTTOM_MID, 0, -5);
    
    ESP_LOGI(TAG, "UI components created");
}

// Create splash screen
static void create_splash(void) {
    splash_screen = lv_obj_create(lv_scr_act());
    lv_obj_set_size(splash_screen, DISPLAY_WIDTH, DISPLAY_HEIGHT);
    lv_obj_set_pos(splash_screen, 0, 0);
    lv_obj_set_style_bg_color(splash_screen, lv_color_hex(0x1a1a2e), LV_PART_MAIN);
    lv_obj_set_style_border_width(splash_screen, 0, LV_PART_MAIN);
    
    // P31 text (large, centered)
    lv_obj_t *p31_label = lv_label_create(splash_screen);
    lv_label_set_text(p31_label, "P31");
    lv_obj_set_style_text_color(p31_label, lv_color_hex(0x00ff00), LV_PART_MAIN);
    lv_obj_set_style_text_font(p31_label, &lv_font_montserrat_20, LV_PART_MAIN);
    lv_obj_align(p31_label, LV_ALIGN_CENTER, 0, -40);
    
    // Node One text
    lv_obj_t *node_label = lv_label_create(splash_screen);
    lv_label_set_text(node_label, "NODE ONE");
    lv_obj_set_style_text_color(node_label, lv_color_hex(0xffffff), LV_PART_MAIN);
    lv_obj_set_style_text_font(node_label, &lv_font_montserrat_20, LV_PART_MAIN);
    lv_obj_align(node_label, LV_ALIGN_CENTER, 0, 20);
    
    // Version text
    lv_obj_t *version_label = lv_label_create(splash_screen);
    lv_label_set_text(version_label, "v0.1.0");
    lv_obj_set_style_text_color(version_label, lv_color_hex(0x888888), LV_PART_MAIN);
    lv_obj_set_style_text_font(version_label, &lv_font_montserrat_16, LV_PART_MAIN);
    lv_obj_align(version_label, LV_ALIGN_CENTER, 0, 60);
    
    ESP_LOGI(TAG, "Splash screen created");
}

// Animation callback for voice arc
static void voice_arc_anim_cb(void *var, int32_t value) {
    lv_arc_set_value((lv_obj_t *)var, value);
}

// Animation callback for spoon meter flashing
static void spoon_flash_anim_cb(void *var, int32_t value) {
    lv_obj_t *bar = (lv_obj_t *)var;
    // Toggle opacity between 0 and 255
    lv_obj_set_style_bg_opa(bar, value, LV_PART_INDICATOR);
}

// Public API implementation

esp_err_t display_init(i2c_master_bus_handle_t i2c_bus) {
    ESP_LOGI(TAG, "Initializing display subsystem...");
    
    // Initialize backlight
    ESP_ERROR_CHECK(init_backlight());
    
    // Initialize AXS15231B display
    ESP_ERROR_CHECK(init_axs15231b());
    
    // Initialize LVGL
    ESP_ERROR_CHECK(init_lvgl());
    
    // Create UI
    create_ui();
    
    // Show splash screen
    create_splash();
    splash_shown = true;
    
    ESP_LOGI(TAG, "Display initialized successfully");
    return ESP_OK;
}

esp_err_t display_update_battery(uint8_t percent, bool charging) {
    if (!battery_label) return ESP_ERR_INVALID_STATE;
    
    char text[20];
    if (charging) {
        snprintf(text, sizeof(text), "🔌 %d%%", percent);
    } else {
        snprintf(text, sizeof(text), "🔋 %d%%", percent);
    }
    lv_label_set_text(battery_label, text);
    
    // Color based on level and charging status
    if (charging) {
        // Charging: always green
        lv_obj_set_style_text_color(battery_label, lv_color_hex(0x00ff00), LV_PART_MAIN);
    } else if (percent > 50) {
        lv_obj_set_style_text_color(battery_label, lv_color_hex(0x00ff00), LV_PART_MAIN);
    } else if (percent > 20) {
        lv_obj_set_style_text_color(battery_label, lv_color_hex(0xffff00), LV_PART_MAIN);
    } else {
        lv_obj_set_style_text_color(battery_label, lv_color_hex(0xff0000), LV_PART_MAIN);
    }
    
    return ESP_OK;
}

esp_err_t display_update_wifi(bool connected, int rssi) {
    if (!wifi_label) return ESP_ERR_INVALID_STATE;
    
    if (connected) {
        char text[16];
        snprintf(text, sizeof(text), "📶 %d", rssi);
        lv_label_set_text(wifi_label, text);
        lv_obj_set_style_text_color(wifi_label, lv_color_hex(0x00ff00), LV_PART_MAIN);
    } else {
        lv_label_set_text(wifi_label, "📶 --");
        lv_obj_set_style_text_color(wifi_label, lv_color_hex(0x888888), LV_PART_MAIN);
    }
    
    return ESP_OK;
}

esp_err_t display_update_lora(bool active, int rssi) {
    if (!lora_label) return ESP_ERR_INVALID_STATE;
    
    if (active) {
        char text[16];
        snprintf(text, sizeof(text), "📡 %d", rssi);
        lv_label_set_text(lora_label, text);
        lv_obj_set_style_text_color(lora_label, lv_color_hex(0x00aaff), LV_PART_MAIN);
    } else {
        lv_label_set_text(lora_label, "📡 --");
        lv_obj_set_style_text_color(lora_label, lv_color_hex(0x888888), LV_PART_MAIN);
    }
    
    return ESP_OK;
}

esp_err_t display_update_time(uint8_t hour, uint8_t minute) {
    if (!time_label) return ESP_ERR_INVALID_STATE;
    
    char text[8];
    snprintf(text, sizeof(text), "%02d:%02d", hour, minute);
    lv_label_set_text(time_label, text);
    
    return ESP_OK;
}

esp_err_t display_update_messages(uint16_t unread) {
    if (!message_badge) return ESP_ERR_INVALID_STATE;
    
    if (unread > 0) {
        char text[8];
        snprintf(text, sizeof(text), "%d", unread > 99 ? 99 : unread);
        lv_label_set_text(message_badge, text);
        lv_obj_clear_flag(message_badge, LV_OBJ_FLAG_HIDDEN);
    } else {
        lv_obj_add_flag(message_badge, LV_OBJ_FLAG_HIDDEN);
    }
    
    return ESP_OK;
}

esp_err_t display_update_mode(const char *mode_name) {
    if (!mode_label) return ESP_ERR_INVALID_STATE;
    
    lv_label_set_text(mode_label, mode_name);
    
    // Color based on mode
    if (strcmp(mode_name, "LISTEN") == 0) {
        lv_obj_set_style_text_color(mode_label, lv_color_hex(0x00ff00), LV_PART_MAIN);
    } else if (strcmp(mode_name, "MESH") == 0) {
        lv_obj_set_style_text_color(mode_label, lv_color_hex(0x00aaff), LV_PART_MAIN);
    } else {
        lv_obj_set_style_text_color(mode_label, lv_color_hex(0x888888), LV_PART_MAIN);
    }
    
    return ESP_OK;
}

esp_err_t display_update_spoons(uint8_t current, uint8_t max) {
    if (!spoon_bar || !spoon_label) return ESP_ERR_INVALID_STATE;
    
    lv_bar_set_value(spoon_bar, current, LV_ANIM_ON);
    
    char text[16];
    snprintf(text, sizeof(text), "⚡ %d/%d", current, max);
    lv_label_set_text(spoon_label, text);
    
    // Color based on level
    lv_color_t color;
    if (current >= 8) {
        color = lv_color_hex(0x00ff00); // Green
    } else if (current >= 4) {
        color = lv_color_hex(0xffff00); // Yellow
    } else if (current > 0) {
        color = lv_color_hex(0xff8800); // Orange
    } else {
        color = lv_color_hex(0xff0000); // Red
    }
    
    lv_obj_set_style_bg_color(spoon_bar, color, LV_PART_INDICATOR);
    
    // Flash red if empty
    if (current == 0) {
        // Stop any existing animation
        if (spoon_flash_active) {
            lv_anim_del(spoon_bar, spoon_flash_anim_cb);
            spoon_flash_active = false;
        }
        
        // Create flashing animation (opacity 0-255, 500ms cycle)
        lv_anim_init(&spoon_flash_anim);
        lv_anim_set_var(&spoon_flash_anim, spoon_bar);
        lv_anim_set_values(&spoon_flash_anim, LV_OPA_TRANSP, LV_OPA_COVER);
        lv_anim_set_time(&spoon_flash_anim, 500);
        lv_anim_set_repeat_count(&spoon_flash_anim, LV_ANIM_REPEAT_INFINITE);
        lv_anim_set_exec_cb(&spoon_flash_anim, (lv_anim_exec_xcb_t)spoon_flash_anim_cb);
        lv_anim_start(&spoon_flash_anim);
        spoon_flash_active = true;
    } else {
        // Stop flashing if not empty
        if (spoon_flash_active) {
            lv_anim_del(spoon_bar, spoon_flash_anim_cb);
            spoon_flash_active = false;
            lv_obj_set_style_bg_opa(spoon_bar, LV_OPA_COVER, LV_PART_INDICATOR);
        }
    }
    
    return ESP_OK;
}

esp_err_t display_show_recording(bool active) {
    if (!voice_arc) return ESP_ERR_INVALID_STATE;
    
    recording_active = active;
    
    if (active) {
        // Pulsing green arc
        lv_obj_set_style_arc_color(voice_arc, lv_color_hex(0x00ff00), LV_PART_INDICATOR);
        
        // Animate arc from 0 to 360
        lv_anim_t a;
        lv_anim_init(&a);
        lv_anim_set_var(&a, voice_arc);
        lv_anim_set_values(&a, 0, 360);
        lv_anim_set_time(&a, 1000);
        lv_anim_set_repeat_count(&a, LV_ANIM_REPEAT_INFINITE);
        lv_anim_set_exec_cb(&a, (lv_anim_exec_xcb_t)voice_arc_anim_cb);
        lv_anim_start(&a);
    } else {
        // Dim gray ring
        lv_obj_set_style_arc_color(voice_arc, lv_color_hex(0x444444), LV_PART_INDICATOR);
        lv_arc_set_value(voice_arc, 0);
        lv_anim_del(voice_arc, voice_arc_anim_cb);
    }
    
    return ESP_OK;
}

esp_err_t display_show_splash(void) {
    if (!splash_screen) {
        create_splash();
    } else {
        lv_obj_clear_flag(splash_screen, LV_OBJ_FLAG_HIDDEN);
    }
    splash_shown = true;
    return ESP_OK;
}

/**
 * Hide splash screen and show main UI
 * Call this after 2 seconds from boot
 */
esp_err_t display_hide_splash(void) {
    if (splash_screen) {
        lv_obj_add_flag(splash_screen, LV_OBJ_FLAG_HIDDEN);
    }
    splash_shown = false;
    return ESP_OK;
}

/**
 * Call this periodically (e.g., in main loop) to update LVGL
 * Should be called every 5-10ms for smooth animations
 */
void display_update(void) {
    if (lv_display) {
        lv_timer_handler();
    }
}

esp_err_t display_set_brightness(uint8_t percent) {
    set_backlight_brightness(percent);
    return ESP_OK;
}
