/**
 * Node One - MCP23017 I2C GPIO Expander Driver
 * 16-bit I/O expander for buttons and haptic feedback
 */

#ifndef MCP23017_DRIVER_H
#define MCP23017_DRIVER_H

#include <stdint.h>
#include <stdbool.h>
#include "driver/i2c_master.h"

#ifdef __cplusplus
extern "C" {
#endif

// MCP23017 driver handle
typedef struct mcp23017_driver* mcp23017_driver_handle_t;

// Button callback type
typedef void (*mcp23017_button_callback_t)(uint16_t pin_mask, void* user_data);

/**
 * Initialize MCP23017 driver
 * @param i2c_bus I2C master bus handle
 * @param int_pin GPIO pin for interrupt (INTA/INTB)
 * @return Handle on success, NULL on failure
 */
mcp23017_driver_handle_t mcp23017_driver_init(i2c_master_bus_handle_t i2c_bus, int int_pin);

/**
 * Deinitialize MCP23017 driver
 */
void mcp23017_driver_deinit(mcp23017_driver_handle_t handle);

/**
 * Configure pin as input with pull-up
 * @param handle Driver handle
 * @param pin Pin number (0-15, but avoid 7 and 15 per datasheet)
 * @return 0 on success, negative on error
 */
int mcp23017_set_input(mcp23017_driver_handle_t handle, uint8_t pin);

/**
 * Configure pin as output
 * @param handle Driver handle
 * @param pin Pin number (0-15)
 * @return 0 on success, negative on error
 */
int mcp23017_set_output(mcp23017_driver_handle_t handle, uint8_t pin);

/**
 * Read pin state
 * @param handle Driver handle
 * @param pin Pin number
 * @return true if HIGH, false if LOW
 */
bool mcp23017_read_pin(mcp23017_driver_handle_t handle, uint8_t pin);

/**
 * Write pin state
 * @param handle Driver handle
 * @param pin Pin number
 * @param level true for HIGH, false for LOW
 * @return 0 on success, negative on error
 */
int mcp23017_write_pin(mcp23017_driver_handle_t handle, uint8_t pin, bool level);

/**
 * Read all 16 pins
 * @param handle Driver handle
 * @return 16-bit value (bit 0 = GPA0, bit 15 = GPB7)
 */
uint16_t mcp23017_read_port(mcp23017_driver_handle_t handle);

/**
 * Write all 16 pins
 * @param handle Driver handle
 * @param value 16-bit value
 * @return 0 on success, negative on error
 */
int mcp23017_write_port(mcp23017_driver_handle_t handle, uint16_t value);

/**
 * Register button interrupt callback
 * @param handle Driver handle
 * @param callback Callback function
 * @param user_data User data passed to callback
 * @return 0 on success, negative on error
 */
int mcp23017_register_callback(mcp23017_driver_handle_t handle, 
                                mcp23017_button_callback_t callback, 
                                void* user_data);

#ifdef __cplusplus
}
#endif

#endif // MCP23017_DRIVER_H
