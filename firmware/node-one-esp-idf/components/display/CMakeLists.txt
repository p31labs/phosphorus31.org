idf_component_register(
    SRCS
        "display.c"
    INCLUDE_DIRS
        "include"
    PRIV_REQUIRES
        driver
        esp_driver_spi
        esp_lcd
        esp_lcd_axs15231b
        esp_lvgl_port
        lvgl
        # ledc - Part of driver component in ESP-IDF v5.5, not a separate component
        esp_timer
        # spiram - Not a component in ESP-IDF v5.5, SPIRAM support is built-in
        freertos
        main  # For pin_map.h
)
