/**
 * Button Input - MCP23017 I2C GPIO Expander Button/Switch Handler
 * Direct I2C register access (no esp-idf-lib dependency)
 * 
 * Handles 14 usable input pins (GPA0-GPA6, GPB0-GPB6)
 * Avoids GPA7 and GPB7 per datasheet errata
 */

#ifndef BUTTON_INPUT_H
#define BUTTON_INPUT_H

#include "esp_err.h"
#include "driver/i2c_master.h"
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Button ID enumeration
 * Maps to MCP23017 pins: GPA0-GPA6 (0-6), GPB0-GPB6 (8-14)
 */
typedef enum {
    BTN_TALK = 0,       // GPA0 - Push-to-talk (primary interaction)
    BTN_SEND,           // GPA1 - Send message
    BTN_PLAY,           // GPA2 - Play last received
    BTN_NEXT,           // GPA3 - Next message
    BTN_PREV,           // GPA4 - Previous message
    BTN_VOL_UP,         // GPA5 - Volume up
    BTN_VOL_DOWN,       // GPA6 - Volume down
    BTN_MODE,           // GPB0 - Mode switch (rocker)
    BTN_CHANNEL,        // GPB1 - Channel select
    BTN_EMERGENCY,      // GPB2 - Emergency/SOS
    BTN_MUTE,           // GPB3 - Mute mic
    BTN_SHIELD,         // GPB4 - Activate The Buffer filter
    BTN_AUX1,           // GPB5 - Auxiliary 1
    BTN_AUX2,           // GPB6 - Auxiliary 2
    BTN_COUNT           // Total number of buttons (14)
} button_id_t;

/**
 * Button event callback function type
 * Called when a button state changes (pressed or released)
 * 
 * @param button Button ID that changed
 * @param pressed true if button is pressed, false if released
 * @param ctx User context pointer
 */
typedef void (*button_event_cb_t)(button_id_t button, bool pressed, void *ctx);

/**
 * Initialize button input system
 * Configures MCP23017 for button input with interrupts
 * 
 * @param i2c_bus I2C master bus handle (shared with other devices)
 * @return ESP_OK on success
 */
esp_err_t button_input_init(i2c_master_bus_handle_t i2c_bus);

/**
 * Deinitialize button input system
 * 
 * @return ESP_OK on success
 */
esp_err_t button_input_deinit(void);

/**
 * Register callback for button events
 * 
 * @param cb Callback function to call on button state changes
 * @param ctx User context passed to callback
 * @return ESP_OK on success
 */
esp_err_t button_input_register_callback(button_event_cb_t cb, void *ctx);

/**
 * Check if a specific button is currently pressed
 * 
 * @param button Button ID to check
 * @return true if pressed, false if released
 */
bool button_input_is_pressed(button_id_t button);

/**
 * Get bitmask of all button states
 * Bit 0 = BTN_TALK, bit 1 = BTN_SEND, ..., bit 13 = BTN_AUX2
 * 
 * @return 16-bit value with button states (bits 0-13 valid)
 */
uint16_t button_input_get_all(void);

#ifdef __cplusplus
}
#endif

#endif // BUTTON_INPUT_H
