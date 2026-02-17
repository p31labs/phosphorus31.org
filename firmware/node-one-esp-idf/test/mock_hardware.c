/**
 * Mock Hardware Implementation
 * Provides mock implementations for unit testing
 */

#include "mock_hardware.h"
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

// GPIO state
#define MAX_GPIO 50
static mock_gpio_state_t gpio_states[MAX_GPIO];
static bool gpio_initialized = false;

// I2C state
#define MAX_I2C_DEVICES 16
#define MAX_I2C_REGISTERS 256
static mock_i2c_register_t i2c_devices[MAX_I2C_DEVICES][MAX_I2C_REGISTERS];
static bool i2c_initialized = false;
static bool i2c_errors[MAX_I2C_DEVICES] = {0};

// I2S state
#define MAX_I2S_SAMPLES 48000  // 1 second at 48kHz
static int16_t i2s_record_buffer[MAX_I2S_SAMPLES];
static int16_t i2s_play_buffer[MAX_I2S_SAMPLES];
static mock_i2s_state_t i2s_state = {0};
static bool i2s_initialized = false;

// SPI state
static mock_spi_state_t spi_state = {0};
static bool spi_initialized = false;

// Timer state
static uint64_t mock_time_ms = 0;
static uint64_t mock_time_us = 0;
static bool timer_initialized = false;

// Battery state
static uint16_t mock_battery_voltage = 3700;  // 3.7V default
static bool mock_battery_charging = false;

// Error tracking
static int error_count = 0;

// ============================================================================
// GPIO Implementation
// ============================================================================

void mock_gpio_init(void) {
    if (gpio_initialized) return;
    memset(gpio_states, 0, sizeof(gpio_states));
    gpio_initialized = true;
}

void mock_gpio_set_level(int gpio_num, int level) {
    if (gpio_num < 0 || gpio_num >= MAX_GPIO) return;
    gpio_states[gpio_num].level = level ? 1 : 0;
}

int mock_gpio_get_level(int gpio_num) {
    if (gpio_num < 0 || gpio_num >= MAX_GPIO) return 0;
    return gpio_states[gpio_num].level;
}

void mock_gpio_set_mode(int gpio_num, mock_gpio_mode_t mode) {
    if (gpio_num < 0 || gpio_num >= MAX_GPIO) return;
    gpio_states[gpio_num].mode = mode;
}

void mock_gpio_trigger_interrupt(int gpio_num) {
    if (gpio_num < 0 || gpio_num >= MAX_GPIO) return;
    if (gpio_states[gpio_num].interrupt_enabled) {
        // In real system, this would trigger ISR
        // For mock, we just mark it
    }
}

mock_gpio_state_t mock_gpio_get_state(int gpio_num) {
    mock_gpio_state_t state = {0};
    if (gpio_num >= 0 && gpio_num < MAX_GPIO) {
        state = gpio_states[gpio_num];
    }
    return state;
}

// ============================================================================
// I2C Implementation
// ============================================================================

void mock_i2c_init(void) {
    if (i2c_initialized) return;
    memset(i2c_devices, 0, sizeof(i2c_devices));
    memset(i2c_errors, 0, sizeof(i2c_errors));
    i2c_initialized = true;
}

void mock_i2c_write_register(uint8_t addr, uint8_t reg, uint8_t value) {
    if (i2c_errors[addr & 0x0F]) {
        error_count++;
        return;
    }
    
    int dev_idx = (addr & 0x0F) % MAX_I2C_DEVICES;
    if (reg < MAX_I2C_REGISTERS) {
        i2c_devices[dev_idx][reg].addr = addr;
        i2c_devices[dev_idx][reg].reg = reg;
        i2c_devices[dev_idx][reg].value = value;
    }
}

uint8_t mock_i2c_read_register(uint8_t addr, uint8_t reg) {
    if (i2c_errors[addr & 0x0F]) {
        error_count++;
        return 0;
    }
    
    int dev_idx = (addr & 0x0F) % MAX_I2C_DEVICES;
    if (reg < MAX_I2C_REGISTERS) {
        return i2c_devices[dev_idx][reg].value;
    }
    return 0;
}

void mock_i2c_set_device_register(uint8_t addr, uint8_t reg, uint8_t value) {
    mock_i2c_write_register(addr, reg, value);
}

void mock_i2c_get_device_registers(uint8_t addr, mock_i2c_register_t *regs, size_t *count) {
    int dev_idx = (addr & 0x0F) % MAX_I2C_DEVICES;
    size_t found = 0;
    
    for (size_t i = 0; i < MAX_I2C_REGISTERS && found < *count; i++) {
        if (i2c_devices[dev_idx][i].addr == addr) {
            regs[found++] = i2c_devices[dev_idx][i];
        }
    }
    *count = found;
}

void mock_i2c_set_error(uint8_t addr, bool error) {
    i2c_errors[addr & 0x0F] = error;
}

// ============================================================================
// I2S Implementation
// ============================================================================

void mock_i2s_init(void) {
    if (i2s_initialized) return;
    memset(&i2s_state, 0, sizeof(i2s_state));
    memset(i2s_record_buffer, 0, sizeof(i2s_record_buffer));
    memset(i2s_play_buffer, 0, sizeof(i2s_play_buffer));
    i2s_state.buffer = i2s_record_buffer;
    i2s_initialized = true;
}

size_t mock_i2s_write(const int16_t *data, size_t samples) {
    if (!i2s_initialized || !data || samples == 0) return 0;
    
    size_t to_write = samples;
    if (to_write > MAX_I2S_SAMPLES) to_write = MAX_I2S_SAMPLES;
    
    memcpy(i2s_play_buffer + i2s_state.write_pos, data, to_write * sizeof(int16_t));
    i2s_state.write_pos = (i2s_state.write_pos + to_write) % MAX_I2S_SAMPLES;
    i2s_state.playing = true;
    
    return to_write;
}

size_t mock_i2s_read(int16_t *data, size_t max_samples) {
    if (!i2s_initialized || !data || max_samples == 0) return 0;
    if (!i2s_state.recording) return 0;
    
    size_t available = i2s_state.samples - i2s_state.read_pos;
    if (available == 0) return 0;
    
    size_t to_read = (available < max_samples) ? available : max_samples;
    memcpy(data, i2s_state.buffer + i2s_state.read_pos, to_read * sizeof(int16_t));
    i2s_state.read_pos += to_read;
    
    return to_read;
}

mock_i2s_state_t mock_i2s_get_state(void) {
    return i2s_state;
}

void mock_i2s_inject_audio(const int16_t *data, size_t samples) {
    if (!i2s_initialized || !data || samples == 0) return;
    
    size_t to_copy = (samples < MAX_I2S_SAMPLES) ? samples : MAX_I2S_SAMPLES;
    memcpy(i2s_record_buffer, data, to_copy * sizeof(int16_t));
    i2s_state.samples = to_copy;
    i2s_state.read_pos = 0;
    i2s_state.recording = true;
}

void mock_i2s_get_recorded_audio(int16_t **data, size_t *samples) {
    *data = i2s_play_buffer;
    *samples = i2s_state.write_pos;
}

// ============================================================================
// SPI Implementation
// ============================================================================

void mock_spi_init(void) {
    if (spi_initialized) return;
    memset(&spi_state, 0, sizeof(spi_state));
    spi_initialized = true;
}

void mock_spi_transfer(const uint8_t *tx_data, uint8_t *rx_data, size_t length) {
    if (!spi_initialized) return;
    
    // Simple echo for testing
    if (tx_data && rx_data) {
        for (size_t i = 0; i < length; i++) {
            rx_data[i] = tx_data[i] ^ 0xFF;  // Invert for testing
        }
    }
    
    spi_state.length = length;
}

void mock_spi_set_busy(bool busy) {
    spi_state.busy = busy;
}

mock_spi_state_t mock_spi_get_state(void) {
    return spi_state;
}

// ============================================================================
// Timer Implementation
// ============================================================================

void mock_timer_init(void) {
    if (timer_initialized) return;
    mock_time_ms = 0;
    mock_time_us = 0;
    timer_initialized = true;
}

uint64_t mock_timer_get_time_ms(void) {
    return mock_time_ms;
}

uint64_t mock_timer_get_time_us(void) {
    return mock_time_us;
}

void mock_timer_advance_ms(uint64_t ms) {
    mock_time_ms += ms;
    mock_time_us += ms * 1000;
}

void mock_timer_reset(void) {
    mock_time_ms = 0;
    mock_time_us = 0;
}

// ============================================================================
// Battery Implementation
// ============================================================================

void mock_battery_set_voltage(uint16_t voltage_mv) {
    mock_battery_voltage = voltage_mv;
}

uint16_t mock_battery_get_voltage(void) {
    return mock_battery_voltage;
}

void mock_battery_set_charging(bool charging) {
    mock_battery_charging = charging;
}

bool mock_battery_is_charging(void) {
    return mock_battery_charging;
}

// ============================================================================
// Test Helpers
// ============================================================================

void mock_hardware_reset_all(void) {
    mock_gpio_init();
    mock_i2c_init();
    mock_i2s_init();
    mock_spi_init();
    mock_timer_init();
    
    memset(gpio_states, 0, sizeof(gpio_states));
    memset(i2c_devices, 0, sizeof(i2c_devices));
    memset(i2c_errors, 0, sizeof(i2c_errors));
    memset(&i2s_state, 0, sizeof(i2s_state));
    memset(&spi_state, 0, sizeof(spi_state));
    
    mock_time_ms = 0;
    mock_time_us = 0;
    error_count = 0;
    mock_battery_voltage = 3700;
    mock_battery_charging = false;
}

bool mock_hardware_verify_no_errors(void) {
    return error_count == 0;
}

int mock_hardware_get_error_count(void) {
    return error_count;
}
