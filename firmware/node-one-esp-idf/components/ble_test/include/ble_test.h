/**
 * BLE Test Component
 * P31 Ecosystem - Node One
 * 
 * Provides BLE GATT server for testing connectivity to Node One device.
 * 
 * Features:
 * - GATT server with test service
 * - Read/write characteristic for data exchange
 * - Connection status monitoring
 * - Device name: "P31-Node-One"
 */

#ifndef BLE_TEST_H
#define BLE_TEST_H

#include <stdint.h>
#include <stdbool.h>
#include "esp_err.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Initialize BLE test component
 * 
 * @return ESP_OK on success, error code otherwise
 */
esp_err_t ble_test_init(void);

/**
 * Start BLE advertising
 * 
 * @return ESP_OK on success, error code otherwise
 */
esp_err_t ble_test_start_advertising(void);

/**
 * Stop BLE advertising
 * 
 * @return ESP_OK on success, error code otherwise
 */
esp_err_t ble_test_stop_advertising(void);

/**
 * Check if BLE is connected
 * 
 * @return true if connected, false otherwise
 */
bool ble_test_is_connected(void);

/**
 * Get number of connected clients
 * 
 * @return Number of connected clients (0 or 1 for single connection)
 */
uint8_t ble_test_get_connection_count(void);

/**
 * Deinitialize BLE test component
 * 
 * @return ESP_OK on success, error code otherwise
 */
esp_err_t ble_test_deinit(void);

#ifdef __cplusplus
}
#endif

#endif // BLE_TEST_H
