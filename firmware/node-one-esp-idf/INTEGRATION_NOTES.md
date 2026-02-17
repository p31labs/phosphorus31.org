# Node One Integration Notes

## RadioLib Integration

The LoRa driver (`lora_driver.cpp`) currently has placeholder code for RadioLib integration. To complete the integration:

1. **Install RadioLib**: Already listed in `idf_component.yml` as `jgromes/radiolib: "^7.2.1"`

2. **Use RadioLib's ESP-IDF HAL**: RadioLib provides an official ESP-IDF HAL at:
   - `NonArduino/ESP-IDF/main/EspHal.h`
   - Include this instead of creating a custom HAL

3. **Complete Integration**:
   ```cpp
   #include "RadioLib.h"
   #include "NonArduino/ESP-IDF/main/EspHal.h"
   
   // Create HAL instance
   EspHal* hal = new EspHal(spi_handle, PIN_LORA_NSS, PIN_LORA_BUSY, PIN_LORA_NRST, PIN_LORA_DIO1);
   
   // Create Module
   Module* radio_module = new Module(hal, PIN_LORA_NSS, PIN_LORA_DIO1, PIN_LORA_NRST, PIN_LORA_BUSY);
   
   // Create SX1262
   SX1262* radio = new SX1262(radio_module);
   
   // Initialize
   int state = radio->begin(915.0, 125.0, 9, 7, 0x12, 22, 8);
   radio->setTCXO(1.8);
   radio->setRegulatorDCDC();
   radio->setRfSwitchPins(PIN_LORA_RXEN, PIN_LORA_TXEN);
   ```

4. **Alternative**: Use `nopnop2002/esp-idf-sx126x` for a pure C implementation (no C++ required)

## Display Integration

The display initialization is currently a placeholder. To complete:

1. **Use esp_lcd_axs15231b**: Already listed in dependencies
2. **Initialize QSPI display**:
   ```cpp
   #include "esp_lcd_axs15231b.h"
   
   esp_lcd_panel_io_handle_t io_handle;
   esp_lcd_panel_handle_t panel_handle;
   
   // Configure QSPI pins from pin_config.h
   // Initialize display via esp_lcd_axs15231b API
   ```

3. **Integrate LVGL**: Use `esp_lvgl_port` for display integration

## Audio Integration

The audio initialization is currently a placeholder. To complete:

1. **Use esp_codec_dev**: Already listed in dependencies
2. **Initialize ES8311**:
   ```cpp
   #include "esp_codec_dev.h"
   
   // Configure I2S pins from pin_config.h
   // Initialize ES8311 codec via esp_codec_dev API
   ```

## MCP23017 I2C Bus Integration

The MCP23017 driver uses `mcp23x17_init_desc()` which requires an I2C port number, not a bus handle. The current implementation uses `I2C_PORT_NUM` (0), which should work if the I2C bus is initialized on port 0.

If issues arise, you may need to:
1. Check that `i2c_new_master_bus()` is called with `i2c_port = I2C_NUM_0`
2. Ensure the esp-idf-lib mcp23x17 component is compatible with ESP-IDF v5.4+

## Partition Table

The partition table file (`partitions.csv`) may be blocked by `.cursorignore`. If so:
1. Create it manually or
2. Use `idf.py menuconfig` to configure partitions
3. Or add to `sdkconfig.defaults`: `CONFIG_PARTITION_TABLE_CUSTOM_FILENAME="partitions.csv"`

## Build Issues

If you encounter build errors:

1. **RadioLib not found**: Ensure `idf.py reconfigure` has been run to fetch components
2. **Missing includes**: Check that all component dependencies are listed in `idf_component.yml`
3. **GPIO conflicts**: Verify pin assignments in `pin_config.h` match hardware

## Next Steps

1. Complete RadioLib integration (or switch to esp-idf-sx126x)
2. Complete display initialization with AXS15231B
3. Complete audio initialization with ES8311
4. Test LoRa communication
5. Test MCP23017 button inputs
6. Implement mesh protocol testing
7. Create UI with LVGL
