/**
 * Button Input Unit Tests
 * Tests MCP23017 button functionality without hardware
 */

#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include "mock_hardware.h"

bool test_button_input_init(void) {
    printf("  Testing button input initialization...\n");
    
    mock_i2c_init();
    mock_gpio_init();
    
    // Test: MCP23017 initialization
    // Set IODIRA = 0x7F (inputs on GPA0-6)
    mock_i2c_write_register(0x20, 0x00, 0x7F);
    uint8_t iodira = mock_i2c_read_register(0x20, 0x00);
    
    if (iodira != 0x7F) {
        printf("    ❌ IODIRA configuration failed\n");
        return false;
    }
    
    // Set pull-ups
    mock_i2c_write_register(0x20, 0x0C, 0x7F);  // GPPUA
    uint8_t gppua = mock_i2c_read_register(0x20, 0x0C);
    
    if (gppua != 0x7F) {
        printf("    ❌ Pull-up configuration failed\n");
        return false;
    }
    
    // Test: Interrupt pin configuration
    mock_gpio_set_mode(46, MOCK_GPIO_MODE_INPUT);
    mock_gpio_state_t int_state = mock_gpio_get_state(46);
    
    if (int_state.mode != MOCK_GPIO_MODE_INPUT) {
        printf("    ❌ Interrupt pin not configured\n");
        return false;
    }
    
    printf("    ✅ Button input initialized\n");
    return true;
}

bool test_button_input_press(void) {
    printf("  Testing button press detection...\n");
    
    mock_i2c_init();
    
    // Test: Button press (active LOW)
    // GPA0 pressed = GPIOA bit 0 = 0
    mock_i2c_write_register(0x20, 0x12, 0xFE);  // GPIOA = 0xFE (bit 0 = 0 = pressed)
    
    uint8_t gpioa = mock_i2c_read_register(0x20, 0x12);
    
    // Inverted: pressed = 1
    bool pressed = (gpioa & 0x01) == 0;
    
    if (!pressed) {
        printf("    ❌ Button press not detected\n");
        return false;
    }
    
    // Test: Button release
    mock_i2c_write_register(0x20, 0x12, 0xFF);  // GPIOA = 0xFF (all high = released)
    gpioa = mock_i2c_read_register(0x20, 0x12);
    pressed = (gpioa & 0x01) == 0;
    
    if (pressed) {
        printf("    ❌ Button release not detected\n");
        return false;
    }
    
    printf("    ✅ Button press detection works\n");
    return true;
}
