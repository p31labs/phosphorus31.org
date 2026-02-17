idf_component_register(
    SRCS 
        "audio_engine.c"
    INCLUDE_DIRS 
        "include"
    PRIV_REQUIRES 
        main
        driver
        # i2c_master - Part of driver component in ESP-IDF v5.5, not a separate component
        # i2s - Part of driver component in ESP-IDF v5.5, not a separate component
        esp_codec_dev
        freertos
        # spiram - Not a component in ESP-IDF v5.5, SPIRAM support is built-in
        esp_common
)
