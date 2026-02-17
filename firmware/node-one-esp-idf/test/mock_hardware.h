/**
 * Mock Hardware Abstraction Layer
 * For unit testing without physical hardware
 * 
 * Provides mock implementations of ESP-IDF hardware interfaces:
 * - GPIO
 * - I2C
 * - I2S
 * - SPI
 * - Timers
 */

#ifndef MOCK_HARDWARE_H
#define MOCK_HARDWARE_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

// ============================================================================
// Mock GPIO
// ============================================================================

typedef enum {
    MOCK_GPIO_MODE_INPUT = 0,
    MOCK_GPIO_MODE_OUTPUT = 1,
    MOCK_GPIO_MODE_INPUT_PULLUP = 2,
    MOCK_GPIO_MODE_INPUT_PULLDOWN = 3,
} mock_gpio_mode_t;

typedef struct {
    mock_gpio_mode_t mode;
    int level;
    bool interrupt_enabled;
} mock_gpio_state_t;

// Initialize mock GPIO system
void mock_gpio_init(void);

// Set GPIO level (for output)
void mock_gpio_set_level(int gpio_num, int level);

// Get GPIO level
int mock_gpio_get_level(int gpio_num);

// Set GPIO mode
void mock_gpio_set_mode(int gpio_num, mock_gpio_mode_t mode);

// Simulate GPIO interrupt
void mock_gpio_trigger_interrupt(int gpio_num);

// Get GPIO state (for verification)
mock_gpio_state_t mock_gpio_get_state(int gpio_num);

// ============================================================================
// Mock I2C
// ============================================================================

typedef struct {
    uint8_t addr;
    uint8_t reg;
    uint8_t value;
} mock_i2c_register_t;

// Initialize mock I2C system
void mock_i2c_init(void);

// Write I2C register
void mock_i2c_write_register(uint8_t addr, uint8_t reg, uint8_t value);

// Read I2C register
uint8_t mock_i2c_read_register(uint8_t addr, uint8_t reg);

// Set device register value (for testing)
void mock_i2c_set_device_register(uint8_t addr, uint8_t reg, uint8_t value);

// Get all registers for a device (for verification)
void mock_i2c_get_device_registers(uint8_t addr, mock_i2c_register_t *regs, size_t *count);

// Simulate I2C error
void mock_i2c_set_error(uint8_t addr, bool error);

// ============================================================================
// Mock I2S
// ============================================================================

typedef struct {
    int16_t *buffer;
    size_t samples;
    size_t write_pos;
    size_t read_pos;
    bool recording;
    bool playing;
} mock_i2s_state_t;

// Initialize mock I2S system
void mock_i2s_init(void);

// Write audio samples (playback)
size_t mock_i2s_write(const int16_t *data, size_t samples);

// Read audio samples (recording)
size_t mock_i2s_read(int16_t *data, size_t max_samples);

// Get I2S state
mock_i2s_state_t mock_i2s_get_state(void);

// Simulate audio input (for recording tests)
void mock_i2s_inject_audio(const int16_t *data, size_t samples);

// Get recorded audio (for verification)
void mock_i2s_get_recorded_audio(int16_t **data, size_t *samples);

// ============================================================================
// Mock SPI
// ============================================================================

typedef struct {
    uint8_t *tx_buffer;
    uint8_t *rx_buffer;
    size_t length;
    bool busy;
} mock_spi_state_t;

// Initialize mock SPI system
void mock_spi_init(void);

// SPI transfer
void mock_spi_transfer(const uint8_t *tx_data, uint8_t *rx_data, size_t length);

// Set BUSY pin state
void mock_spi_set_busy(bool busy);

// Get SPI state
mock_spi_state_t mock_spi_get_state(void);

// ============================================================================
// Mock Timer
// ============================================================================

// Initialize mock timer system
void mock_timer_init(void);

// Get mock time (milliseconds)
uint64_t mock_timer_get_time_ms(void);

// Get mock time (microseconds)
uint64_t mock_timer_get_time_us(void);

// Advance mock time (for testing timeouts)
void mock_timer_advance_ms(uint64_t ms);

// Reset mock time
void mock_timer_reset(void);

// ============================================================================
// Mock Battery/Power
// ============================================================================

// Set mock battery voltage (mV)
void mock_battery_set_voltage(uint16_t voltage_mv);

// Get mock battery voltage
uint16_t mock_battery_get_voltage(void);

// Set mock battery charging state
void mock_battery_set_charging(bool charging);

// Get mock battery charging state
bool mock_battery_is_charging(void);

// ============================================================================
// Test Helpers
// ============================================================================

// Reset all mocks (call at start of each test)
void mock_hardware_reset_all(void);

// Verify no errors occurred
bool mock_hardware_verify_no_errors(void);

// Get error count
int mock_hardware_get_error_count(void);

#ifdef __cplusplus
}
#endif

#endif // MOCK_HARDWARE_H
