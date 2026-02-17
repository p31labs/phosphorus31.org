/**
 * Node One - The Scope (Display Component)
 * P31 Ecosystem - Oscilloscope metaphor. Shows the signal.
 * Minimal LVGL display for voice-first interface
 * 
 * Shows: boot splash (P31 logo), status bar, voice activity, messages, mode, spoon meter
 */

#ifndef DISPLAY_H
#define DISPLAY_H

#include "esp_err.h"
#include "driver/i2c_master.h"

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Initialize display subsystem
 * @param i2c_bus I2C master bus handle (for touch controller)
 * @return ESP_OK on success
 */
esp_err_t display_init(i2c_master_bus_handle_t i2c_bus);

/**
 * Update battery percentage (0-100) and charging status
 * @param percent Battery percentage 0-100
 * @param charging true if charging, false otherwise
 */
esp_err_t display_update_battery(uint8_t percent, bool charging);

/**
 * Update WiFi status
 * @param connected true if connected
 * @param rssi signal strength in dBm (if connected)
 */
esp_err_t display_update_wifi(bool connected, int rssi);

/**
 * Update LoRa status
 * @param active true if LoRa is active
 * @param rssi signal strength in dBm (if active)
 */
esp_err_t display_update_lora(bool active, int rssi);

/**
 * Update time display
 * @param hour 0-23
 * @param minute 0-59
 */
esp_err_t display_update_time(uint8_t hour, uint8_t minute);

/**
 * Update unread message count
 * @param unread number of unread messages
 */
esp_err_t display_update_messages(uint16_t unread);

/**
 * Update current mode indicator
 * @param mode_name mode name string (e.g., "LISTEN", "MESH", "IDLE")
 */
esp_err_t display_update_mode(const char *mode_name);

/**
 * Update spoon meter (energy level)
 * @param current current energy level (0-12)
 * @param max maximum energy level (typically 12)
 */
esp_err_t display_update_spoons(uint8_t current, uint8_t max);

/**
 * Show/hide voice recording indicator
 * @param active true when recording, false when idle
 */
esp_err_t display_show_recording(bool active);

/**
 * Show boot splash screen (P31 logo / Node One text)
 */
esp_err_t display_show_splash(void);

/**
 * Set display brightness
 * @param percent 0-100
 */
esp_err_t display_set_brightness(uint8_t percent);

/**
 * Hide splash screen and show main UI
 * Call this after 2 seconds from boot
 */
esp_err_t display_hide_splash(void);

/**
 * Update LVGL (call periodically in main loop, every 5-10ms)
 */
void display_update(void);

#ifdef __cplusplus
}
#endif

#endif // DISPLAY_H
