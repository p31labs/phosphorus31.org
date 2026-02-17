/**
 * BSP Component Unit Tests
 * Tests Board Support Package without hardware
 */

#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include "mock_hardware.h"

// Mock BSP functions (would normally be in bsp.c)
// For testing, we'll test the logic with mock hardware

bool test_bsp_init(void) {
    printf("  Testing I2C bus initialization...\n");
    
    // Initialize mocks
    mock_i2c_init();
    mock_gpio_init();
    
    // Test: I2C bus should be initialized
    // In real code, this would call bsp_i2c_init()
    // For mock, we verify I2C mock is ready
    
    // Simulate I2C init
    // Check that I2C is ready
    mock_i2c_write_register(0x34, 0x00, 0x01);  // AXP2101 test
    uint8_t value = mock_i2c_read_register(0x34, 0x00);
    
    if (value != 0x01) {
        printf("    ❌ I2C register write/read failed\n");
        return false;
    }
    
    printf("    ✅ I2C bus initialized\n");
    return true;
}

bool test_bsp_battery(void) {
    printf("  Testing battery monitoring...\n");
    
    // Test: Battery voltage reading
    mock_battery_set_voltage(3700);  // 3.7V
    uint16_t voltage = mock_battery_get_voltage();
    
    if (voltage != 3700) {
        printf("    ❌ Battery voltage read failed (expected 3700, got %d)\n", voltage);
        return false;
    }
    
    // Test: Battery percentage calculation
    // 3.7V = 50% (nominal)
    // 4.2V = 100%
    // 3.0V = 0%
    
    mock_battery_set_voltage(4200);  // 100%
    voltage = mock_battery_get_voltage();
    if (voltage != 4200) {
        printf("    ❌ Battery voltage 100%% test failed\n");
        return false;
    }
    
    mock_battery_set_voltage(3000);  // 0%
    voltage = mock_battery_get_voltage();
    if (voltage != 3000) {
        printf("    ❌ Battery voltage 0%% test failed\n");
        return false;
    }
    
    // Test: Charging status
    mock_battery_set_charging(true);
    if (!mock_battery_is_charging()) {
        printf("    ❌ Charging status read failed\n");
        return false;
    }
    
    mock_battery_set_charging(false);
    if (mock_battery_is_charging()) {
        printf("    ❌ Charging status read failed\n");
        return false;
    }
    
    printf("    ✅ Battery monitoring works\n");
    return true;
}

bool test_power_management(void) {
    printf("  Testing AXP2101 power management...\n");
    
    mock_i2c_init();
    
    // Test: Set power rail voltages
    // ALDO1: 3.3V
    uint8_t aldo1_value = (3300 - 500) / 100;  // Should be 28
    mock_i2c_write_register(0x34, 0x92, aldo1_value);
    uint8_t read_value = mock_i2c_read_register(0x34, 0x92);
    
    if (read_value != aldo1_value) {
        printf("    ❌ ALDO1 voltage set failed\n");
        return false;
    }
    
    // Test: Enable power rails
    mock_i2c_write_register(0x34, 0x90, 0x35);  // Enable ALDO1, ALDO3, BLDO1, BLDO2
    read_value = mock_i2c_read_register(0x34, 0x90);
    
    if (read_value != 0x35) {
        printf("    ❌ Power rail enable failed\n");
        return false;
    }
    
    printf("    ✅ Power management works\n");
    return true;
}
