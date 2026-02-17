/**
 * Rotary Encoder Driver for Node One
 * Volume Encoder Module - 3D Printable Parts Integration
 * 
 * Supports EC11 and compatible rotary encoders with:
 * - Half-quadrature decoding (interrupt-based)
 * - Button press detection (optional)
 * - Haptic feedback integration (The Thick Click)
 * - Volume/parameter control
 * 
 * P31 Naming:
 * - Volume Encoder: Physical control module for tactile parameter adjustment
 */

#ifndef ROTARY_ENCODER_H
#define ROTARY_ENCODER_H

#include "driver/gpio.h"
#include "esp_err.h"
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// Rotary encoder handle (opaque type)
typedef struct rotary_encoder* rotary_encoder_handle_t;

// Encoder event callback type
// direction: +1 for clockwise, -1 for counter-clockwise
// position: current encoder position (can be negative)
// button_pressed: true if button was pressed
typedef void (*rotary_encoder_callback_t)(int direction, int32_t position, bool button_pressed, void* user_data);

/**
 * Initialize rotary encoder
 * 
 * @param clk_pin GPIO pin for CLK signal (must support interrupts)
 * @param dt_pin GPIO pin for DT signal (must support interrupts)
 * @param sw_pin GPIO pin for SW button (optional, use GPIO_NUM_NC if not used)
 * @param handle Output handle for encoder instance
 * @return ESP_OK on success
 */
esp_err_t rotary_encoder_init(gpio_num_t clk_pin, gpio_num_t dt_pin, gpio_num_t sw_pin, rotary_encoder_handle_t* handle);

/**
 * Register callback for encoder events
 * 
 * @param handle Encoder handle
 * @param callback Callback function (called from ISR context - keep it fast!)
 * @param user_data User data passed to callback
 * @return ESP_OK on success
 */
esp_err_t rotary_encoder_register_callback(rotary_encoder_handle_t handle, 
                                           rotary_encoder_callback_t callback, 
                                           void* user_data);

/**
 * Get current encoder position
 * 
 * @param handle Encoder handle
 * @return Current position (can be negative)
 */
int32_t rotary_encoder_get_position(rotary_encoder_handle_t handle);

/**
 * Set encoder position (reset or set to specific value)
 * 
 * @param handle Encoder handle
 * @param position New position value
 * @return ESP_OK on success
 */
esp_err_t rotary_encoder_set_position(rotary_encoder_handle_t handle, int32_t position);

/**
 * Enable/disable encoder
 * 
 * @param handle Encoder handle
 * @param enabled true to enable, false to disable
 * @return ESP_OK on success
 */
esp_err_t rotary_encoder_set_enabled(rotary_encoder_handle_t handle, bool enabled);

/**
 * Deinitialize encoder and free resources
 * 
 * @param handle Encoder handle
 * @return ESP_OK on success
 */
esp_err_t rotary_encoder_deinit(rotary_encoder_handle_t handle);

#ifdef __cplusplus
}
#endif

#endif // ROTARY_ENCODER_H
