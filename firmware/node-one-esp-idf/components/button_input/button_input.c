/**
 * Button Input - MCP23017 I2C GPIO Expander Implementation
 * Direct I2C register access (no esp-idf-lib dependency)
 */

#include "button_input.h"
#include "pin_config.h"
#include "esp_log.h"
#include "esp_err.h"
#include "driver/gpio.h"
#include "driver/i2c_master.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include <string.h>

static const char *TAG = "button_input";

// MCP23017 I2C address
#define MCP23017_I2C_ADDR      I2C_ADDR_MCP23017  // 0x20

// MCP23017 register addresses
#define MCP23017_REG_IODIRA    0x00  // I/O direction register A
#define MCP23017_REG_IODIRB    0x01  // I/O direction register B
#define MCP23017_REG_IPOLA     0x02  // Input polarity register A
#define MCP23017_REG_IPOLB     0x03  // Input polarity register B
#define MCP23017_REG_GPINTENA  0x04  // Interrupt-on-change enable A
#define MCP23017_REG_GPINTENB  0x05  // Interrupt-on-change enable B
#define MCP23017_REG_DEFVALA   0x06  // Default compare register A
#define MCP23017_REG_DEFVALB   0x07  // Default compare register B
#define MCP23017_REG_INTCONA   0x08  // Interrupt control register A
#define MCP23017_REG_INTCONB   0x09  // Interrupt control register B
#define MCP23017_REG_IOCON     0x0A  // I/O expander configuration
#define MCP23017_REG_GPPUA     0x0C  // Pull-up resistor register A
#define MCP23017_REG_GPPUB     0x0D  // Pull-up resistor register B
#define MCP23017_REG_INTFA     0x0E  // Interrupt flag register A
#define MCP23017_REG_INTFB     0x0F  // Interrupt flag register B
#define MCP23017_REG_INTCAPA   0x10  // Interrupt capture register A
#define MCP23017_REG_INTCAPB   0x11  // Interrupt capture register B
#define MCP23017_REG_GPIOA     0x12  // GPIO register A
#define MCP23017_REG_GPIOB     0x13  // GPIO register B
#define MCP23017_REG_OLATA     0x14  // Output latch register A
#define MCP23017_REG_OLATB     0x15  // Output latch register B

// IOCON register bits
#define MCP23017_IOCON_MIRROR  (1 << 6)  // Mirror INTA/INTB
#define MCP23017_IOCON_INTPOL  (1 << 1)  // Interrupt polarity (0=active LOW)

// Button to MCP23017 pin mapping
// GPA0-6 = pins 0-6, GPB0-6 = pins 8-14
static const uint8_t button_to_pin[BTN_COUNT] = {
    0,   // BTN_TALK = GPA0
    1,   // BTN_SEND = GPA1
    2,   // BTN_PLAY = GPA2
    3,   // BTN_NEXT = GPA3
    4,   // BTN_PREV = GPA4
    5,   // BTN_VOL_UP = GPA5
    6,   // BTN_VOL_DOWN = GPA6
    8,   // BTN_MODE = GPB0
    9,   // BTN_CHANNEL = GPB1
    10,  // BTN_EMERGENCY = GPB2
    11,  // BTN_MUTE = GPB3
    12,  // BTN_SHIELD = GPB4
    13,  // BTN_AUX1 = GPB5
    14,  // BTN_AUX2 = GPB6
};

// Debounce time in milliseconds
#define DEBOUNCE_MS 50

// Polling interval (fallback mode)
#define POLL_INTERVAL_MS 20

// Internal state
static struct {
    i2c_master_bus_handle_t i2c_bus;
    i2c_master_dev_handle_t i2c_dev;
    gpio_num_t int_pin;
    button_event_cb_t callback;
    void *callback_ctx;
    TaskHandle_t task_handle;
    EventGroupHandle_t event_group;
    uint16_t last_state;
    uint32_t last_read_time;
    bool initialized;
    bool use_interrupt;
} button_state = {0};

// Event group bits
#define BUTTON_INT_BIT BIT0

/**
 * Write a single byte register on MCP23017
 */
static esp_err_t mcp23017_write_reg(uint8_t reg, uint8_t value) {
    if (button_state.i2c_dev == NULL) {
        return ESP_ERR_INVALID_STATE;
    }

    uint8_t write_buf[2] = {reg, value};
    esp_err_t ret = i2c_master_transmit(button_state.i2c_dev, write_buf, 2, -1);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "MCP23017 write reg 0x%02X failed: %s", reg, esp_err_to_name(ret));
    }
    return ret;
}

/**
 * Read a single byte register from MCP23017
 */
static esp_err_t mcp23017_read_reg(uint8_t reg, uint8_t *value) {
    if (button_state.i2c_dev == NULL) {
        return ESP_ERR_INVALID_STATE;
    }

    esp_err_t ret = i2c_master_transmit_receive(button_state.i2c_dev, &reg, 1, value, 1, -1);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "MCP23017 read reg 0x%02X failed: %s", reg, esp_err_to_name(ret));
    }
    return ret;
}

/**
 * Read GPIO port (A or B) from MCP23017
 */
static esp_err_t mcp23017_read_gpio(uint8_t port, uint8_t *value) {
    uint8_t reg = (port == 0) ? MCP23017_REG_GPIOA : MCP23017_REG_GPIOB;
    return mcp23017_read_reg(reg, value);
}

/**
 * Read interrupt capture register (A or B)
 */
static esp_err_t mcp23017_read_intcap(uint8_t port, uint8_t *value) {
    uint8_t reg = (port == 0) ? MCP23017_REG_INTCAPA : MCP23017_REG_INTCAPB;
    return mcp23017_read_reg(reg, value);
}

/**
 * Convert button ID to MCP23017 pin number
 */
static uint8_t button_to_mcp_pin(button_id_t button) {
    if (button >= BTN_COUNT) {
        return 0xFF;
    }
    return button_to_pin[button];
}

/**
 * Convert MCP23017 pin number to button ID
 */
static button_id_t mcp_pin_to_button(uint8_t pin) {
    for (int i = 0; i < BTN_COUNT; i++) {
        if (button_to_pin[i] == pin) {
            return (button_id_t)i;
        }
    }
    return BTN_COUNT;  // Invalid
}

/**
 * Read all button states from MCP23017
 * Returns 16-bit value: bits 0-6 = GPA0-6, bits 8-14 = GPB0-6
 */
static uint16_t read_all_buttons(void) {
    uint8_t gpioa = 0, gpiob = 0;
    
    if (mcp23017_read_gpio(0, &gpioa) != ESP_OK) {
        return button_state.last_state;  // Return last known state on error
    }
    if (mcp23017_read_gpio(1, &gpiob) != ESP_OK) {
        return button_state.last_state;
    }

    // Combine ports: GPA0-6 in bits 0-6, GPB0-6 in bits 8-14
    uint16_t state = (gpioa & 0x7F) | ((gpiob & 0x7F) << 8);
    
    // Invert: buttons are active LOW, we want pressed = 1
    state = ~state;
    
    // Mask to only valid button bits
    state &= 0x7F7F;
    
    return state;
}

/**
 * Process button state changes and call callbacks
 */
static void process_button_changes(uint16_t new_state) {
    uint16_t changed = button_state.last_state ^ new_state;
    
    if (changed == 0) {
        return;  // No changes
    }

    // Check each button for changes
    for (int i = 0; i < BTN_COUNT; i++) {
        uint8_t pin = button_to_pin[i];
        uint16_t pin_mask;
        
        if (pin < 8) {
            pin_mask = 1 << pin;  // GPA0-6 (bits 0-6)
        } else {
            pin_mask = 1 << pin;  // GPB0-6 (bits 8-14)
        }
        
        if (changed & pin_mask) {
            bool pressed = (new_state & pin_mask) != 0;
            if (button_state.callback) {
                button_state.callback((button_id_t)i, pressed, button_state.callback_ctx);
            }
        }
    }
    
    button_state.last_state = new_state;
}

/**
 * Interrupt service routine (ISR)
 * Sets event flag - does NOT do I2C operations
 */
static void IRAM_ATTR button_int_isr(void *arg) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    xEventGroupSetBitsFromISR(button_state.event_group, BUTTON_INT_BIT, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

/**
 * Button processing task (interrupt mode)
 * Waits for interrupt event, then reads INTCAP registers
 */
static void button_task_interrupt(void *arg) {
    ESP_LOGI(TAG, "Button task (interrupt mode) started");
    
    while (button_state.initialized) {
        // Wait for interrupt event
        EventBits_t bits = xEventGroupWaitBits(
            button_state.event_group,
            BUTTON_INT_BIT,
            pdTRUE,   // Clear bits on exit
            pdFALSE,  // Wait for any bit
            portMAX_DELAY
        );
        
        if (bits & BUTTON_INT_BIT) {
            // Debounce: minimum time between reads
            uint32_t now = xTaskGetTickCount();
            uint32_t elapsed = pdTICKS_TO_MS(now - button_state.last_read_time);
            
            if (elapsed < DEBOUNCE_MS) {
                vTaskDelay(pdMS_TO_TICKS(DEBOUNCE_MS - elapsed));
            }
            
            // Read interrupt capture registers (captures state at interrupt time)
            uint8_t intcapa = 0, intcapb = 0;
            if (mcp23017_read_intcap(0, &intcapa) == ESP_OK &&
                mcp23017_read_intcap(1, &intcapb) == ESP_OK) {
                
                // Combine and invert (active LOW -> pressed = 1)
                uint16_t state = (~intcapa & 0x7F) | ((~intcapb & 0x7F) << 8);
                state &= 0x7F7F;  // Mask to valid bits
                
                // Process changes
                process_button_changes(state);
                
                button_state.last_read_time = xTaskGetTickCount();
            }
        }
    }
    
    vTaskDelete(NULL);
}

/**
 * Button processing task (polling mode)
 * Polls GPIO registers periodically
 */
static void button_task_polling(void *arg) {
    ESP_LOGI(TAG, "Button task (polling mode) started");
    
    while (button_state.initialized) {
        uint16_t new_state = read_all_buttons();
        process_button_changes(new_state);
        vTaskDelay(pdMS_TO_TICKS(POLL_INTERVAL_MS));
    }
    
    vTaskDelete(NULL);
}

esp_err_t button_input_init(i2c_master_bus_handle_t i2c_bus) {
    if (button_state.initialized) {
        ESP_LOGW(TAG, "Button input already initialized");
        return ESP_OK;
    }
    
    if (i2c_bus == NULL) {
        ESP_LOGE(TAG, "Invalid I2C bus handle");
        return ESP_ERR_INVALID_ARG;
    }
    
    memset(&button_state, 0, sizeof(button_state));
    button_state.i2c_bus = i2c_bus;
    button_state.int_pin = PIN_MCP23017_INT;
    
    // Create I2C device handle for MCP23017
    i2c_device_config_t dev_cfg = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7,
        .device_address = MCP23017_I2C_ADDR,
        .scl_speed_hz = I2C_CLK_SPEED_HZ,
    };
    
    esp_err_t ret = i2c_master_bus_add_device(i2c_bus, &dev_cfg, &button_state.i2c_dev);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to add MCP23017 device: %s", esp_err_to_name(ret));
        return ret;
    }
    
    ESP_LOGI(TAG, "MCP23017 device added at address 0x%02X", MCP23017_I2C_ADDR);
    
    // Configure MCP23017 registers
    // IODIRA = 0x7F (GPA0-6 inputs, GPA7 output/unused)
    ret = mcp23017_write_reg(MCP23017_REG_IODIRA, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // IODIRB = 0x7F (GPB0-6 inputs, GPB7 output/unused)
    ret = mcp23017_write_reg(MCP23017_REG_IODIRB, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // GPPUA = 0x7F (pull-ups on GPA0-6)
    ret = mcp23017_write_reg(MCP23017_REG_GPPUA, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // GPPUB = 0x7F (pull-ups on GPB0-6)
    ret = mcp23017_write_reg(MCP23017_REG_GPPUB, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // IPOLA = 0x7F (invert: pressed = 1)
    ret = mcp23017_write_reg(MCP23017_REG_IPOLA, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // IPOLB = 0x7F (invert: pressed = 1)
    ret = mcp23017_write_reg(MCP23017_REG_IPOLB, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // IOCON: MIRROR=1 (merge INTA/INTB), INTPOL=0 (active LOW)
    uint8_t iocon = MCP23017_IOCON_MIRROR;  // MIRROR=1, INTPOL=0
    ret = mcp23017_write_reg(MCP23017_REG_IOCON, iocon);
    if (ret != ESP_OK) return ret;
    
    // GPINTENA = 0x7F (enable interrupts on GPA0-6)
    ret = mcp23017_write_reg(MCP23017_REG_GPINTENA, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // GPINTENB = 0x7F (enable interrupts on GPB0-6)
    ret = mcp23017_write_reg(MCP23017_REG_GPINTENB, 0x7F);
    if (ret != ESP_OK) return ret;
    
    // INTCONA = 0x00 (compare to previous value)
    ret = mcp23017_write_reg(MCP23017_REG_INTCONA, 0x00);
    if (ret != ESP_OK) return ret;
    
    // INTCONB = 0x00 (compare to previous value)
    ret = mcp23017_write_reg(MCP23017_REG_INTCONB, 0x00);
    if (ret != ESP_OK) return ret;
    
    ESP_LOGI(TAG, "MCP23017 configured: 14 inputs (GPA0-6, GPB0-6), pull-ups enabled, interrupts enabled");
    
    // Read initial state
    button_state.last_state = read_all_buttons();
    button_state.last_read_time = xTaskGetTickCount();
    
    // Configure interrupt pin if available (GPIO_NUM_NC = -1 means not connected)
    if (button_state.int_pin != GPIO_NUM_NC) {
        gpio_config_t io_conf = {
            .pin_bit_mask = (1ULL << button_state.int_pin),
            .mode = GPIO_MODE_INPUT,
            .pull_up_en = GPIO_PULLUP_ENABLE,
            .pull_down_en = GPIO_PULLDOWN_DISABLE,
            .intr_type = GPIO_INTR_NEGEDGE,  // Falling edge (active LOW)
        };
        
        ret = gpio_config(&io_conf);
        if (ret == ESP_OK) {
            // Install GPIO ISR service if not already installed
            gpio_install_isr_service(0);
            gpio_isr_handler_add(button_state.int_pin, button_int_isr, NULL);
            
            // Create event group for interrupt signaling
            button_state.event_group = xEventGroupCreate();
            if (button_state.event_group == NULL) {
                ESP_LOGE(TAG, "Failed to create event group");
                goto cleanup;
            }
            
            button_state.use_interrupt = true;
            ESP_LOGI(TAG, "Interrupt mode enabled on GPIO %d", button_state.int_pin);
        } else {
            ESP_LOGW(TAG, "Failed to configure interrupt pin %d: %s", 
                     button_state.int_pin, esp_err_to_name(ret));
            button_state.use_interrupt = false;
        }
    } else {
        button_state.use_interrupt = false;
    }
    
    // Create processing task
    button_state.initialized = true;
    const char *task_name = button_state.use_interrupt ? "btn_int" : "btn_poll";
    void (*task_func)(void*) = button_state.use_interrupt ? button_task_interrupt : button_task_polling;
    
    xTaskCreate(task_func, task_name, 2048, NULL, 5, &button_state.task_handle);
    if (button_state.task_handle == NULL) {
        ESP_LOGE(TAG, "Failed to create button task");
        button_state.initialized = false;
        goto cleanup;
    }
    
    ESP_LOGI(TAG, "Button input initialized (%s mode)", 
             button_state.use_interrupt ? "interrupt" : "polling");
    return ESP_OK;
    
cleanup:
    if (button_state.i2c_dev) {
        i2c_master_bus_rm_device(button_state.i2c_dev);
        button_state.i2c_dev = NULL;
    }
    if (button_state.event_group) {
        vEventGroupDelete(button_state.event_group);
        button_state.event_group = NULL;
    }
    return ESP_FAIL;
}

esp_err_t button_input_deinit(void) {
    if (!button_state.initialized) {
        return ESP_OK;
    }
    
    button_state.initialized = false;
    
    // Delete task
    if (button_state.task_handle) {
        vTaskDelete(button_state.task_handle);
        button_state.task_handle = NULL;
    }
    
    // Remove interrupt handler
    if (button_state.use_interrupt && button_state.int_pin != GPIO_NUM_NC) {
        gpio_isr_handler_remove(button_state.int_pin);
    }
    
    // Delete event group
    if (button_state.event_group) {
        vEventGroupDelete(button_state.event_group);
        button_state.event_group = NULL;
    }
    
    // Remove I2C device
    if (button_state.i2c_dev) {
        i2c_master_bus_rm_device(button_state.i2c_dev);
        button_state.i2c_dev = NULL;
    }
    
    memset(&button_state, 0, sizeof(button_state));
    
    ESP_LOGI(TAG, "Button input deinitialized");
    return ESP_OK;
}

esp_err_t button_input_register_callback(button_event_cb_t cb, void *ctx) {
    if (!button_state.initialized) {
        return ESP_ERR_INVALID_STATE;
    }
    
    button_state.callback = cb;
    button_state.callback_ctx = ctx;
    
    ESP_LOGI(TAG, "Button callback registered");
    return ESP_OK;
}

bool button_input_is_pressed(button_id_t button) {
    if (!button_state.initialized || button >= BTN_COUNT) {
        return false;
    }
    
    uint8_t pin = button_to_pin[button];
    uint16_t pin_mask;
    
    if (pin < 8) {
        pin_mask = 1 << pin;  // GPA0-6
    } else {
        pin_mask = 1 << pin;  // GPB0-6
    }
    
    // Read current state
    uint16_t state = read_all_buttons();
    return (state & pin_mask) != 0;
}

uint16_t button_input_get_all(void) {
    if (!button_state.initialized) {
        return 0;
    }
    
    return read_all_buttons();
}
