/**
 * Unit Test Runner
 * Runs all component tests without hardware
 */

#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "mock_hardware.h"

// Test function type
typedef bool (*test_func_t)(void);

// Test case structure
typedef struct {
    const char *name;
    const char *description;
    test_func_t func;
    bool passed;
} test_case_t;

// Forward declarations
extern bool test_bsp_init(void);
extern bool test_bsp_battery(void);
extern bool test_audio_engine_init(void);
extern bool test_audio_engine_record(void);
extern bool test_lora_radio_init(void);
extern bool test_button_input_init(void);
extern bool test_button_input_press(void);
extern bool test_display_init(void);
extern bool test_power_management(void);

// Test cases
static test_case_t tests[] = {
    {"BSP Init", "Board Support Package initialization", test_bsp_init, false},
    {"BSP Battery", "Battery voltage and percentage", test_bsp_battery, false},
    {"Audio Engine Init", "ES8311 codec initialization", test_audio_engine_init, false},
    {"Audio Engine Record", "Audio recording functionality", test_audio_engine_record, false},
    {"LoRa Radio Init", "E22-900M30S initialization", test_lora_radio_init, false},
    {"Button Input Init", "MCP23017 initialization", test_button_input_init, false},
    {"Button Input Press", "Button press detection", test_button_input_press, false},
    {"Display Init", "LVGL display initialization", test_display_init, false},
    {"Power Management", "AXP2101 power rails", test_power_management, false},
};

#define NUM_TESTS (sizeof(tests) / sizeof(tests[0]))

int main(void) {
    printf("\n");
    printf("╔════════════════════════════════════════╗\n");
    printf("║   NODE ONE - MOCK TEST SUITE           ║\n");
    printf("║   Testing without hardware              ║\n");
    printf("╚════════════════════════════════════════╝\n");
    printf("\n");
    
    // Initialize mock hardware
    mock_hardware_reset_all();
    
    int passed = 0;
    int failed = 0;
    
    // Run all tests
    for (size_t i = 0; i < NUM_TESTS; i++) {
        printf("=== Test %zu/%zu: %s ===\n", i + 1, NUM_TESTS, tests[i].name);
        printf("Description: %s\n", tests[i].description);
        printf("Running... ");
        
        // Reset mocks before each test
        mock_hardware_reset_all();
        
        // Run test
        bool result = tests[i].func();
        tests[i].passed = result;
        
        if (result) {
            printf("✅ PASS\n");
            passed++;
        } else {
            printf("❌ FAIL\n");
            failed++;
        }
        
        // Check for hardware errors
        if (!mock_hardware_verify_no_errors()) {
            printf("   ⚠️  Hardware errors detected: %d\n", mock_hardware_get_error_count());
        }
        
        printf("\n");
    }
    
    // Summary
    printf("╔════════════════════════════════════════╗\n");
    printf("║         TEST SUMMARY                   ║\n");
    printf("╠════════════════════════════════════════╣\n");
    printf("║  Tests Run:     %3zu                  ║\n", NUM_TESTS);
    printf("║  Tests Passed:   %3d                  ║\n", passed);
    printf("║  Tests Failed:   %3d                  ║\n", failed);
    printf("╚════════════════════════════════════════╝\n");
    printf("\n");
    
    if (failed == 0) {
        printf("✅ ALL TESTS PASSED\n");
        printf("\n");
        printf("The Mesh Holds. 🔺\n");
        return 0;
    } else {
        printf("❌ SOME TESTS FAILED\n");
        printf("\n");
        printf("Failed tests:\n");
        for (size_t i = 0; i < NUM_TESTS; i++) {
            if (!tests[i].passed) {
                printf("  - %s: %s\n", tests[i].name, tests[i].description);
            }
        }
        return 1;
    }
}
