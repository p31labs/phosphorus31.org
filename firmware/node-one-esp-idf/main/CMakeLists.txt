# BLE test disabled until NimBLE 5.5 API is adopted (see components/ble_test)
idf_component_register(
    SRCS 
        "main.cpp"
        "pin_config.cpp"
        "lora_driver.cpp"
        "mcp23017_driver.cpp"
        "mesh_protocol.cpp"
        "rotary_encoder.cpp"
    INCLUDE_DIRS 
        "."
    PRIV_REQUIRES 
        driver
        esp_timer
        esp_lcd
        esp_lvgl_port
        lvgl
        esp_codec_dev
        mcp23x17
        nvs_flash
        freertos
        spi_flash
        # spiram - Not a component in ESP-IDF v5.5, SPIRAM support is built-in
        display
        audio_engine
        shield_server
        button_input
        bsp
        # ble_test disabled: NimBLE API changed in ESP-IDF 5.5 (ble_gap_event_listener_register, esp_nimble_hci_*)
        # ble_test
)

target_compile_definitions(${COMPONENT_LIB} PRIVATE P31_BLE_TEST_ENABLED=0)
