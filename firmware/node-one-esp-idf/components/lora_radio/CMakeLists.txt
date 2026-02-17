idf_component_register(
    SRCS 
        "lora_radio.cpp"
    INCLUDE_DIRS 
        "include"
    PRIV_REQUIRES 
        main
        driver
        # spi_master - Part of driver component in ESP-IDF v5.5, not a separate component
        freertos
        esp_common
        esp_timer
    REQUIRES
        radiolib
)
