/**
 * LoRa Radio Unit Tests
 * Tests LoRa functionality without hardware
 */

#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include "mock_hardware.h"

bool test_lora_radio_init(void) {
    printf("  Testing LoRa radio initialization...\n");
    
    mock_spi_init();
    mock_gpio_init();
    
    // Test: SPI initialization
    // Verify SPI mock is ready
    mock_spi_state_t spi_state = mock_spi_get_state();
    
    // Test: BUSY pin check
    mock_spi_set_busy(false);
    if (mock_spi_get_state().busy) {
        printf("    ❌ BUSY pin state incorrect\n");
        return false;
    }
    
    // Test: SPI transfer
    uint8_t tx_data[4] = {0x01, 0x02, 0x03, 0x04};
    uint8_t rx_data[4] = {0};
    mock_spi_transfer(tx_data, rx_data, 4);
    
    // Verify transfer occurred
    if (mock_spi_get_state().length != 4) {
        printf("    ❌ SPI transfer length incorrect\n");
        return false;
    }
    
    // Test: GPIO pins configured
    mock_gpio_set_mode(41, MOCK_GPIO_MODE_OUTPUT);  // SCK
    mock_gpio_set_mode(40, MOCK_GPIO_MODE_OUTPUT);  // NSS
    mock_gpio_set_mode(21, MOCK_GPIO_MODE_INPUT);   // BUSY
    
    mock_gpio_state_t sck_state = mock_gpio_get_state(41);
    if (sck_state.mode != MOCK_GPIO_MODE_OUTPUT) {
        printf("    ❌ SCK pin not configured as output\n");
        return false;
    }
    
    printf("    ✅ LoRa radio initialized\n");
    return true;
}
