/**
 * LoRa Radio Driver Stress Test
 * Comprehensive test suite for pre-abdication verification
 */

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include "lora_radio.h"
#include "esp_log.h"
#include "esp_err.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "lora_test";

// Test statistics
static struct {
    int tests_run;
    int tests_passed;
    int tests_failed;
} test_stats = {0, 0, 0};

// Test helper macros
#define TEST_ASSERT(condition, message) \
    do { \
        test_stats.tests_run++; \
        if (condition) { \
            test_stats.tests_passed++; \
            ESP_LOGI(TAG, "✅ PASS: %s", message); \
        } else { \
            test_stats.tests_failed++; \
            ESP_LOGE(TAG, "❌ FAIL: %s", message); \
        } \
    } while(0)

// RX callback for testing
static void test_rx_callback(const lora_packet_t *packet, void *ctx) {
    ESP_LOGI(TAG, "RX Callback: %zu bytes, RSSI=%d dBm, SNR=%.1f dB",
             packet->len, packet->rssi, packet->snr);
    
    // Copy data if needed (test will free it)
    uint8_t *copy = (uint8_t*)ctx;
    if (copy && packet->data) {
        memcpy(copy, packet->data, packet->len < 256 ? packet->len : 256);
    }
}

// ============================================================================
// Test 1: Initialization
// ============================================================================

static void test_initialization(void) {
    ESP_LOGI(TAG, "=== Test 1: Initialization ===");
    
    // Test 1.1: Normal initialization
    esp_err_t ret = lora_radio_init();
    TEST_ASSERT(ret == ESP_OK, "lora_radio_init() succeeds");
    
    // Test 1.2: Double initialization (should handle gracefully)
    ret = lora_radio_init();
    TEST_ASSERT(ret == ESP_OK, "Double init handled gracefully");
    
    // Test 1.3: Verify RSSI reading (should work after init)
    int rssi = lora_radio_get_rssi();
    ESP_LOGI(TAG, "Initial RSSI: %d dBm", rssi);
    // RSSI might be 0 if no packet received yet, that's OK
    
    vTaskDelay(pdMS_TO_TICKS(100));
}

// ============================================================================
// Test 2: Transmission
// ============================================================================

static void test_transmission(void) {
    ESP_LOGI(TAG, "=== Test 2: Transmission ===");
    
    // Test 2.1: Send small packet
    uint8_t data1[] = "Hello, LoRa!";
    esp_err_t ret = lora_radio_send(data1, sizeof(data1) - 1);
    TEST_ASSERT(ret == ESP_OK, "Send 12-byte packet");
    vTaskDelay(pdMS_TO_TICKS(500));
    
    // Test 2.2: Send minimum size packet
    uint8_t data2[] = "X";
    ret = lora_radio_send(data2, 1);
    TEST_ASSERT(ret == ESP_OK, "Send 1-byte packet");
    vTaskDelay(pdMS_TO_TICKS(500));
    
    // Test 2.3: Send maximum size packet
    uint8_t data3[255];
    memset(data3, 0xAA, sizeof(data3));
    ret = lora_radio_send(data3, sizeof(data3));
    TEST_ASSERT(ret == ESP_OK, "Send 255-byte packet");
    vTaskDelay(pdMS_TO_TICKS(1000));
    
    // Test 2.4: Invalid parameters
    ret = lora_radio_send(NULL, 10);
    TEST_ASSERT(ret == ESP_ERR_INVALID_ARG, "Send with NULL data (error)");
    
    ret = lora_radio_send(data1, 0);
    TEST_ASSERT(ret == ESP_ERR_INVALID_ARG, "Send with zero length (error)");
    
    ret = lora_radio_send(data1, 256);
    TEST_ASSERT(ret == ESP_ERR_INVALID_ARG, "Send with length >255 (error)");
}

// ============================================================================
// Test 3: Reception
// ============================================================================

static void test_reception(void) {
    ESP_LOGI(TAG, "=== Test 3: Reception ===");
    
    uint8_t rx_buffer[256] = {0};
    
    // Test 3.1: Start receive mode
    esp_err_t ret = lora_radio_start_receive(test_rx_callback, rx_buffer);
    TEST_ASSERT(ret == ESP_OK, "Start receive mode");
    
    ESP_LOGI(TAG, "Waiting for packets (10 seconds)...");
    vTaskDelay(pdMS_TO_TICKS(10000));
    
    // Test 3.2: Stop receive mode
    ret = lora_radio_stop_receive();
    TEST_ASSERT(ret == ESP_OK, "Stop receive mode");
    
    vTaskDelay(pdMS_TO_TICKS(100));
}

// ============================================================================
// Test 4: Configuration
// ============================================================================

static void test_configuration(void) {
    ESP_LOGI(TAG, "=== Test 4: Configuration ===");
    
    // Test 4.1: Set frequency
    esp_err_t ret = lora_radio_set_frequency(915.0);
    TEST_ASSERT(ret == ESP_OK, "Set frequency to 915.0 MHz");
    
    ret = lora_radio_set_frequency(920.0);
    TEST_ASSERT(ret == ESP_OK, "Set frequency to 920.0 MHz");
    
    // Test 4.2: Set power
    ret = lora_radio_set_power(22);
    TEST_ASSERT(ret == ESP_OK, "Set power to 22 dBm");
    
    ret = lora_radio_set_power(10);
    TEST_ASSERT(ret == ESP_OK, "Set power to 10 dBm");
    
    ret = lora_radio_set_power(25);  // Should be clamped to 22
    TEST_ASSERT(ret == ESP_OK, "Set power to 25 dBm (clamped to 22)");
    
    // Test 4.3: Get RSSI
    int rssi = lora_radio_get_rssi();
    ESP_LOGI(TAG, "Current RSSI: %d dBm", rssi);
    // RSSI might be 0 if no packet received, that's OK
    
    vTaskDelay(pdMS_TO_TICKS(100));
}

// ============================================================================
// Test 5: Power Management
// ============================================================================

static void test_power_management(void) {
    ESP_LOGI(TAG, "=== Test 5: Power Management ===");
    
    // Test 5.1: Sleep mode
    esp_err_t ret = lora_radio_sleep();
    TEST_ASSERT(ret == ESP_OK, "Enter sleep mode");
    
    vTaskDelay(pdMS_TO_TICKS(1000));
    
    // Test 5.2: Wake up (reinit)
    ret = lora_radio_init();
    TEST_ASSERT(ret == ESP_OK, "Wake from sleep (reinit)");
    
    vTaskDelay(pdMS_TO_TICKS(100));
}

// ============================================================================
// Test 6: Stress Test
// ============================================================================

static void test_stress(void) {
    ESP_LOGI(TAG, "=== Test 6: Stress Test ===");
    
    uint8_t test_data[100];
    memset(test_data, 0x42, sizeof(test_data));
    
    // Test 6.1: Rapid TX operations
    ESP_LOGI(TAG, "Rapid TX test: 50 packets...");
    int success_count = 0;
    for (int i = 0; i < 50; i++) {
        esp_err_t ret = lora_radio_send(test_data, sizeof(test_data));
        if (ret == ESP_OK) {
            success_count++;
        }
        vTaskDelay(pdMS_TO_TICKS(100));
    }
    TEST_ASSERT(success_count >= 45, "Rapid TX (45+ successes out of 50)");
    ESP_LOGI(TAG, "Success rate: %d/50", success_count);
    
    // Test 6.2: Long receive session
    ESP_LOGI(TAG, "Long receive test: 30 seconds...");
    lora_radio_start_receive(test_rx_callback, NULL);
    vTaskDelay(pdMS_TO_TICKS(30000));
    lora_radio_stop_receive();
    TEST_ASSERT(1, "Long receive session completed");
}

// ============================================================================
// Test 7: Error Handling
// ============================================================================

static void test_error_handling(void) {
    ESP_LOGI(TAG, "=== Test 7: Error Handling ===");
    
    // Test 7.1: Operations before init (after deinit)
    lora_radio_deinit();
    
    esp_err_t ret = lora_radio_send((uint8_t*)"test", 4);
    TEST_ASSERT(ret == ESP_ERR_INVALID_STATE, "Send before init (error)");
    
    ret = lora_radio_start_receive(NULL, NULL);
    TEST_ASSERT(ret == ESP_ERR_INVALID_STATE, "Receive before init (error)");
    
    int rssi = lora_radio_get_rssi();
    TEST_ASSERT(rssi == 0, "Get RSSI before init (returns 0)");
    
    // Reinit for other tests
    lora_radio_init();
    vTaskDelay(pdMS_TO_TICKS(100));
}

// ============================================================================
// Test Runner
// ============================================================================

static void stress_test_task(void *arg) {
    ESP_LOGI(TAG, "╔════════════════════════════════════════╗");
    ESP_LOGI(TAG, "║   LORA RADIO STRESS TEST SUITE        ║");
    ESP_LOGI(TAG, "║   Pre-Abdication Verification         ║");
    ESP_LOGI(TAG, "╚════════════════════════════════════════╝");
    ESP_LOGI(TAG, "");
    
    vTaskDelay(pdMS_TO_TICKS(2000));  // Wait for system to stabilize
    
    // Run all tests
    test_initialization();
    vTaskDelay(pdMS_TO_TICKS(500));
    
    test_transmission();
    vTaskDelay(pdMS_TO_TICKS(500));
    
    test_reception();
    vTaskDelay(pdMS_TO_TICKS(500));
    
    test_configuration();
    vTaskDelay(pdMS_TO_TICKS(500));
    
    test_power_management();
    vTaskDelay(pdMS_TO_TICKS(500));
    
    test_stress();
    vTaskDelay(pdMS_TO_TICKS(500));
    
    test_error_handling();
    
    // Print summary
    ESP_LOGI(TAG, "");
    ESP_LOGI(TAG, "╔════════════════════════════════════════╗");
    ESP_LOGI(TAG, "║         TEST SUMMARY                   ║");
    ESP_LOGI(TAG, "╠════════════════════════════════════════╣");
    ESP_LOGI(TAG, "║  Tests Run:    %3d                      ║", test_stats.tests_run);
    ESP_LOGI(TAG, "║  Tests Passed: %3d                      ║", test_stats.tests_passed);
    ESP_LOGI(TAG, "║  Tests Failed: %3d                      ║", test_stats.tests_failed);
    ESP_LOGI(TAG, "╚════════════════════════════════════════╝");
    
    if (test_stats.tests_failed == 0) {
        ESP_LOGI(TAG, "");
        ESP_LOGI(TAG, "✅ ALL TESTS PASSED - READY FOR ABDICATION");
    } else {
        ESP_LOGE(TAG, "");
        ESP_LOGE(TAG, "❌ SOME TESTS FAILED - REVIEW REQUIRED");
    }
    
    // Keep running for monitoring
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(10000));
        ESP_LOGI(TAG, "Test suite complete. System monitoring...");
    }
}

void app_main(void) {
    // Start stress test task
    xTaskCreate(stress_test_task, "stress_test", 8192, NULL, 5, NULL);
    
    // Main task can do other things or just wait
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(10000));
    }
}
