/**
 * Node One - MCP23017 Driver Implementation
 * Using esp-idf-lib/mcp23x17 component
 */

#include "mcp23017_driver.h"
#include "pin_config.h"
#include "esp_log.h"
#include "esp_err.h"
#include "driver/gpio.h"
#include "driver/i2c.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include <string.h>

#include "mcp23x17.h"

static const char *TAG = "mcp23017";

struct mcp23017_driver {
    mcp23x17_t dev;
    gpio_num_t int_pin;
    mcp23017_button_callback_t callback;
    void* user_data;
    TaskHandle_t task_handle;
    QueueHandle_t queue;
    bool running;
};

static void mcp23017_interrupt_task(void* arg) {
    mcp23017_driver_handle_t handle = (mcp23017_driver_handle_t)arg;
    
    while (handle->running) {
        uint32_t io_num;
        if (xQueueReceive(handle->queue, &io_num, portMAX_DELAY)) {
            // Read interrupt capture register
            uint16_t intcap;
            if (mcp23x17_port_read(&handle->dev, &intcap) == ESP_OK) {
                // Call callback if registered
                if (handle->callback) {
                    handle->callback(intcap, handle->user_data);
                }
            }
        }
    }
    
    vTaskDelete(NULL);
}

static void IRAM_ATTR mcp23017_gpio_isr_handler(void* arg) {
    mcp23017_driver_handle_t handle = (mcp23017_driver_handle_t)arg;
    uint32_t io_num = (uint32_t)handle->int_pin;
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    xQueueSendFromISR(handle->queue, &io_num, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

extern "C" {

mcp23017_driver_handle_t mcp23017_driver_init(i2c_master_bus_handle_t i2c_bus, int int_pin) {
    ESP_LOGI(TAG, "Initializing MCP23017 driver");

    mcp23017_driver_handle_t handle = (mcp23017_driver_handle_t)malloc(sizeof(struct mcp23017_driver));
    if (handle == nullptr) {
        ESP_LOGE(TAG, "Failed to allocate driver handle");
        return nullptr;
    }

    memset(handle, 0, sizeof(struct mcp23017_driver));
    handle->int_pin = (gpio_num_t)int_pin;

    // Initialize MCP23017 device (mcp23x17_init_desc: dev, addr, port, sda, scl)
    esp_err_t ret = mcp23x17_init_desc(&handle->dev,
                                       (uint8_t)MCP23X17_ADDR_BASE,
                                       (i2c_port_t)I2C_PORT_NUM,
                                       PIN_I2C_SDA, PIN_I2C_SCL);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "MCP23x17 init failed: %s", esp_err_to_name(ret));
        free(handle);
        return nullptr;
    }

    // Configure interrupt pin
    if (int_pin >= 0) {
        gpio_config_t io_conf = {};
        io_conf.pin_bit_mask = (1ULL << int_pin);
        io_conf.mode = GPIO_MODE_INPUT;
        io_conf.pull_up_en = GPIO_PULLUP_ENABLE;
        io_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
        io_conf.intr_type = GPIO_INTR_ANYEDGE;
        gpio_config(&io_conf);

        // Create queue for interrupts
        handle->queue = xQueueCreate(10, sizeof(uint32_t));
        if (handle->queue == nullptr) {
            ESP_LOGE(TAG, "Failed to create interrupt queue");
            mcp23x17_free_desc(&handle->dev);
            free(handle);
            return nullptr;
        }

        // Install GPIO ISR service
        gpio_install_isr_service(0);
        gpio_isr_handler_add(handle->int_pin, mcp23017_gpio_isr_handler, handle);

        // Create interrupt task
        handle->running = true;
        xTaskCreate(mcp23017_interrupt_task, "mcp23017_int", 2048, handle, 10, &handle->task_handle);
    }

    // INTA/INTB mirror (both pins reflect same interrupt) via library API
    ret = mcp23x17_set_int_out_mode(&handle->dev, MCP23X17_OPEN_DRAIN);
    if (ret != ESP_OK) {
        ESP_LOGW(TAG, "MCP23x17 set_int_out_mode: %s (non-fatal)", esp_err_to_name(ret));
    }

    ESP_LOGI(TAG, "MCP23017 driver initialized");
    return handle;
}

void mcp23017_driver_deinit(mcp23017_driver_handle_t handle) {
    if (handle == nullptr) return;

    if (handle->int_pin >= 0) {
        handle->running = false;
        if (handle->task_handle) {
            vTaskDelete(handle->task_handle);
        }
        gpio_isr_handler_remove(handle->int_pin);
        if (handle->queue) {
            vQueueDelete(handle->queue);
        }
    }

    mcp23x17_free_desc(&handle->dev);
    free(handle);
}

int mcp23017_set_input(mcp23017_driver_handle_t handle, uint8_t pin) {
    if (handle == nullptr || pin > 15) {
        return -1;
    }

    // Set pin direction to input
    uint16_t dir = 0xFFFF;
    dir &= ~(1 << pin);
    esp_err_t ret = mcp23x17_port_set_mode(&handle->dev, dir);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set pin %d as input: %s", pin, esp_err_to_name(ret));
        return -1;
    }

    // Enable pull-up
    uint16_t pullup = 0xFFFF;
    ret = mcp23x17_port_set_pullup(&handle->dev, pullup);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to enable pull-up on pin %d: %s", pin, esp_err_to_name(ret));
        return -1;
    }

    // Enable interrupt on change (mask, intr mode)
    uint16_t inten = 0xFFFF;
    ret = mcp23x17_port_set_interrupt(&handle->dev, inten, MCP23X17_INT_ANY_EDGE);
    if (ret != ESP_OK) {
        ESP_LOGW(TAG, "Failed to enable interrupt on pin %d: %s", pin, esp_err_to_name(ret));
    }

    return 0;
}

int mcp23017_set_output(mcp23017_driver_handle_t handle, uint8_t pin) {
    if (handle == nullptr || pin > 15) {
        return -1;
    }

    uint16_t dir = 0x0000;
    dir |= (1 << pin);
    esp_err_t ret = mcp23x17_port_set_mode(&handle->dev, dir);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to set pin %d as output: %s", pin, esp_err_to_name(ret));
        return -1;
    }

    return 0;
}

bool mcp23017_read_pin(mcp23017_driver_handle_t handle, uint8_t pin) {
    if (handle == nullptr || pin > 15) {
        return false;
    }

    uint16_t val;
    if (mcp23x17_port_read(&handle->dev, &val) != ESP_OK) {
        return false;
    }

    return (val & (1 << pin)) != 0;
}

int mcp23017_write_pin(mcp23017_driver_handle_t handle, uint8_t pin, bool level) {
    if (handle == nullptr || pin > 15) {
        return -1;
    }

    uint16_t val = level ? (1 << pin) : 0;
    esp_err_t ret = mcp23x17_port_write(&handle->dev, val);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to write pin %d: %s", pin, esp_err_to_name(ret));
        return -1;
    }

    return 0;
}

uint16_t mcp23017_read_port(mcp23017_driver_handle_t handle) {
    if (handle == nullptr) {
        return 0;
    }

    uint16_t val = 0;
    mcp23x17_port_read(&handle->dev, &val);
    return val;
}

int mcp23017_write_port(mcp23017_driver_handle_t handle, uint16_t value) {
    if (handle == nullptr) {
        return -1;
    }

    esp_err_t ret = mcp23x17_port_write(&handle->dev, value);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to write port: %s", esp_err_to_name(ret));
        return -1;
    }

    return 0;
}

int mcp23017_register_callback(mcp23017_driver_handle_t handle, 
                                mcp23017_button_callback_t callback, 
                                void* user_data) {
    if (handle == nullptr) {
        return -1;
    }

    handle->callback = callback;
    handle->user_data = user_data;
    return 0;
}

} // extern "C"
