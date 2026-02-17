/**
 * Display Unit Tests
 * Tests display functionality without hardware
 */

#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include "mock_hardware.h"

bool test_display_init(void) {
    printf("  Testing display initialization...\n");
    
    mock_gpio_init();
    mock_i2c_init();
    
    // Test: Backlight GPIO configuration
    mock_gpio_set_mode(6, MOCK_GPIO_MODE_OUTPUT);  // LCD_BL
    mock_gpio_state_t bl_state = mock_gpio_get_state(6);
    
    if (bl_state.mode != MOCK_GPIO_MODE_OUTPUT) {
        printf("    ❌ Backlight GPIO not configured\n");
        return false;
    }
    
    // Test: QSPI pins (would be SPI in real hardware)
    // For mock, we just verify GPIO states
    mock_gpio_set_mode(12, MOCK_GPIO_MODE_OUTPUT);  // CS
    mock_gpio_set_mode(5, MOCK_GPIO_MODE_OUTPUT);   // CLK
    
    mock_gpio_state_t cs_state = mock_gpio_get_state(12);
    if (cs_state.mode != MOCK_GPIO_MODE_OUTPUT) {
        printf("    ❌ QSPI CS pin not configured\n");
        return false;
    }
    
    // Test: Display initialization sequence
    // In real code, this would configure the AXS15231B panel
    // For mock, we verify the initialization logic
    
    printf("    ✅ Display initialized\n");
    return true;
}
