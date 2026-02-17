/**
 * Board Support Package (BSP) for Node One
 * P31 Ecosystem - ESP32-S3-Touch-LCD-3.5B
 * 
 * Provides foundation services:
 * - Shared I2C bus initialization
 * - AXP2101 power management
 * - LCD backlight control (The Scope)
 * - Battery monitoring
 * 
 * The BSP is the FOUNDATION. Every other component depends on it.
 * The mesh holds because the foundation is solid.
 */

#ifndef BSP_H
#define BSP_H

#include <stdint.h>
#include <stdbool.h>
#include "esp_err.h"
#include "driver/i2c_master.h"

#ifdef __cplusplus
extern "C" {
#endif

// I2C pin definitions (from pin_map.h)
#define BSP_I2C_SDA        (8)
#define BSP_I2C_SCL        (7)
#define BSP_I2C_FREQ_HZ    (400000)  // 400 kHz

// AXP2101 I2C address
#define BSP_AXP2101_ADDR   (0x34)

// Backlight pin (from pin_map.h)
#define BSP_BACKLIGHT_PIN  (6)

/**
 * Initialize shared I2C bus
 * 
 * Creates a singleton I2C master bus at 400kHz on GPIO8 (SDA) and GPIO7 (SCL).
 * This bus is shared by all on-board devices:
 * - AXP2101 (PMIC) at 0x34
 * - ES8311 (audio codec) at 0x18
 * - QMI8658 (IMU) at 0x6B
 * - PCF85063 (RTC) at 0x51
 * - MCP23017 (GPIO expander) at 0x20
 * - Touch controller at 0x3B
 * 
 * @return I2C master bus handle, or NULL on failure
 */
i2c_master_bus_handle_t bsp_i2c_init(void);

/**
 * Initialize AXP2101 Power Management Unit
 * 
 * Configures power rails per Waveshare defaults:
 * - ALDO1: 3.3V (display logic)
 * - ALDO3: 3.3V (backlight power)
 * - BLDO1: 1.5V
 * - BLDO2: 2.8V (audio codec)
 * 
 * Also configures battery charging parameters.
 * 
 * @param bus I2C master bus handle (from bsp_i2c_init)
 * @return ESP_OK on success, ESP_FAIL on error
 */
esp_err_t bsp_power_init(i2c_master_bus_handle_t bus);

/**
 * Set LCD backlight brightness
 * 
 * Controls backlight via LEDC PWM on GPIO6.
 * 
 * @param percent Brightness 0-100 (0 = off, 100 = full brightness)
 * @return ESP_OK on success, ESP_FAIL on error
 */
esp_err_t bsp_backlight_set(uint8_t percent);

/**
 * Read battery voltage
 * 
 * Reads battery voltage from AXP2101 ADC registers.
 * 
 * @return Battery voltage in millivolts (mV), or 0 on error
 */
uint16_t bsp_battery_voltage(void);

/**
 * Get battery percentage
 * 
 * Converts battery voltage to percentage (0-100).
 * Uses typical Li-ion battery curve:
 * - 4.2V = 100% (fully charged)
 * - 3.7V = 50% (nominal)
 * - 3.0V = 0% (discharged)
 * 
 * Note: AXP2101 also has a direct battery level register (0xA4) that
 * returns 0-100 directly. This voltage-based approach provides more
 * control and can be calibrated per battery chemistry.
 * 
 * @return Battery percentage (0-100), or 0 on error
 */
uint8_t bsp_battery_percent(void);

/**
 * Check if battery is charging
 * 
 * Reads AXP2101 status register to determine charging state.
 * 
 * @return true if charging, false otherwise
 */
bool bsp_battery_is_charging(void);

/**
 * Check if battery is discharging
 * 
 * Reads AXP2101 status register to determine discharging state.
 * 
 * @return true if discharging, false otherwise
 */
bool bsp_battery_is_discharging(void);

/**
 * Check if battery charging is complete
 * 
 * Reads AXP2101 status register to determine if charging is done.
 * 
 * @return true if charging complete, false otherwise
 */
bool bsp_battery_is_charging_done(void);

/**
 * Get shared I2C bus handle
 * 
 * Returns the singleton I2C bus handle. Must call bsp_i2c_init() first.
 * 
 * @return I2C master bus handle, or NULL if not initialized
 */
i2c_master_bus_handle_t bsp_get_i2c_bus(void);

#ifdef __cplusplus
}
#endif

#endif // BSP_H
