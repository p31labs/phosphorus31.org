/**
 * Rotary Encoder Driver Implementation
 * Node One - Volume Encoder Module
 * 
 * Half-quadrature decoding with interrupt-based edge detection
 * Compatible with EC11 and similar rotary encoders
 */

#include "rotary_encoder.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_log.h"
#include "esp_err.h"
#include <string.h>

static const char *TAG = "rotary_encoder";

// Encoder state structure
struct rotary_encoder {
    gpio_num_t clk_pin;
    gpio_num_t dt_pin;
    gpio_num_t sw_pin;
    bool sw_pin_used;
    
    volatile int32_t position;
    volatile uint8_t last_state;
    volatile bool enabled;
    
    rotary_encoder_callback_t callback;
    void* user_data;
    
    QueueHandle_t event_queue;
    TaskHandle_t task_handle;
};

// Encoder event structure (for queue)
typedef struct {
    int direction;
    int32_t position;
    bool button_pressed;
} encoder_event_t;

// ISR handler for encoder rotation
static void IRAM_ATTR encoder_isr_handler(void* arg) {
    rotary_encoder_handle_t encoder = (rotary_encoder_handle_t)arg;
    if (!encoder || !encoder->enabled) {
        return;
    }
    
    // Read current state
    uint8_t clk_state = gpio_get_level(encoder->clk_pin);
    uint8_t dt_state = gpio_get_level(encoder->dt_pin);
    uint8_t current_state = (clk_state << 1) | dt_state;
    
    // Half-quadrature decoding: detect state transitions
    // State sequence for clockwise: 00 -> 01 -> 11 -> 10 -> 00
    // State sequence for counter-clockwise: 00 -> 10 -> 11 -> 01 -> 00
    static const int8_t state_table[] = {
        0,  // 00 -> invalid
        -1, // 01 -> counter-clockwise
        1,  // 10 -> clockwise
        0   // 11 -> invalid/transition
    };
    
    // Check for valid transition
    uint8_t last_state = encoder->last_state;
    if (last_state != current_state) {
        // Determine direction from state transition
        int direction = 0;
        
        // Simple state machine for half-quadrature
        if (last_state == 0b00 && current_state == 0b01) {
            direction = -1; // Counter-clockwise
        } else if (last_state == 0b00 && current_state == 0b10) {
            direction = 1; // Clockwise
        } else if (last_state == 0b01 && current_state == 0b11) {
            direction = -1; // Counter-clockwise
        } else if (last_state == 0b10 && current_state == 0b11) {
            direction = 1; // Clockwise
        } else if (last_state == 0b11 && current_state == 0b01) {
            direction = -1; // Counter-clockwise
        } else if (last_state == 0b11 && current_state == 0b10) {
            direction = 1; // Clockwise
        } else if (last_state == 0b01 && current_state == 0b00) {
            direction = -1; // Counter-clockwise
        } else if (last_state == 0b10 && current_state == 0b00) {
            direction = 1; // Clockwise
        }
        
        if (direction != 0) {
            encoder->position += direction;
            encoder->last_state = current_state;
            
            // Send event to queue (from ISR)
            encoder_event_t event = {
                .direction = direction,
                .position = encoder->position,
                .button_pressed = false
            };
            
            BaseType_t xHigherPriorityTaskWoken = pdFALSE;
            xQueueSendFromISR(encoder->event_queue, &event, &xHigherPriorityTaskWoken);
            if (xHigherPriorityTaskWoken) {
                portYIELD_FROM_ISR();
            }
        }
    }
}

// ISR handler for button press
static void IRAM_ATTR button_isr_handler(void* arg) {
    rotary_encoder_handle_t encoder = (rotary_encoder_handle_t)arg;
    if (!encoder || !encoder->enabled || !encoder->sw_pin_used) {
        return;
    }
    
    // Debounce: check state after small delay
    // For now, send event immediately (task will handle debouncing)
    encoder_event_t event = {
        .direction = 0,
        .position = encoder->position,
        .button_pressed = true
    };
    
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    xQueueSendFromISR(encoder->event_queue, &event, &xHigherPriorityTaskWoken);
    if (xHigherPriorityTaskWoken) {
        portYIELD_FROM_ISR();
    }
}

// Task to process encoder events (runs callback in task context)
static void encoder_task(void* arg) {
    rotary_encoder_handle_t encoder = (rotary_encoder_handle_t)arg;
    encoder_event_t event;
    TickType_t last_button_time = 0;
    const TickType_t button_debounce_ms = 50 / portTICK_PERIOD_MS;
    
    while (1) {
        if (xQueueReceive(encoder->event_queue, &event, portMAX_DELAY) == pdTRUE) {
            if (encoder->callback) {
                // Debounce button presses
                if (event.button_pressed) {
                    TickType_t now = xTaskGetTickCount();
                    if (now - last_button_time > button_debounce_ms) {
                        last_button_time = now;
                        encoder->callback(event.direction, event.position, true, encoder->user_data);
                    }
                } else {
                    // Rotation event - call immediately
                    encoder->callback(event.direction, event.position, false, encoder->user_data);
                }
            }
        }
    }
}

esp_err_t rotary_encoder_init(gpio_num_t clk_pin, gpio_num_t dt_pin, gpio_num_t sw_pin, rotary_encoder_handle_t* handle) {
    if (handle == nullptr) {
        return ESP_ERR_INVALID_ARG;
    }
    
    ESP_LOGI(TAG, "Initializing rotary encoder: CLK=%d, DT=%d, SW=%d", clk_pin, dt_pin, sw_pin);
    
    // Allocate encoder structure
    rotary_encoder_handle_t encoder = (rotary_encoder_handle_t)malloc(sizeof(struct rotary_encoder));
    if (encoder == nullptr) {
        ESP_LOGE(TAG, "Failed to allocate encoder structure");
        return ESP_ERR_NO_MEM;
    }
    
    memset(encoder, 0, sizeof(struct rotary_encoder));
    encoder->clk_pin = clk_pin;
    encoder->dt_pin = dt_pin;
    encoder->sw_pin = sw_pin;
    encoder->sw_pin_used = (sw_pin != GPIO_NUM_NC);
    encoder->position = 0;
    encoder->last_state = 0xFF; // Invalid initial state
    encoder->enabled = true;
    
    // Configure CLK pin (with pull-up)
    gpio_config_t io_conf = {};
    io_conf.pin_bit_mask = (1ULL << clk_pin);
    io_conf.mode = GPIO_MODE_INPUT;
    io_conf.pull_up_en = GPIO_PULLUP_ENABLE;
    io_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
    io_conf.intr_type = GPIO_INTR_ANYEDGE;
    gpio_config(&io_conf);
    
    // Configure DT pin (with pull-up)
    io_conf.pin_bit_mask = (1ULL << dt_pin);
    gpio_config(&io_conf);
    
    // Configure SW pin if used (with pull-up)
    if (encoder->sw_pin_used) {
        io_conf.pin_bit_mask = (1ULL << sw_pin);
        io_conf.intr_type = GPIO_INTR_NEGEDGE; // Button press (active low)
        gpio_config(&io_conf);
    }
    
    // Read initial state
    uint8_t clk_state = gpio_get_level(clk_pin);
    uint8_t dt_state = gpio_get_level(dt_pin);
    encoder->last_state = (clk_state << 1) | dt_state;
    
    // Create event queue
    encoder->event_queue = xQueueCreate(10, sizeof(encoder_event_t));
    if (encoder->event_queue == nullptr) {
        ESP_LOGE(TAG, "Failed to create event queue");
        free(encoder);
        return ESP_ERR_NO_MEM;
    }
    
    // Install GPIO ISR service
    gpio_install_isr_service(0);
    
    // Add ISR handlers
    gpio_isr_handler_add(clk_pin, encoder_isr_handler, encoder);
    gpio_isr_handler_add(dt_pin, encoder_isr_handler, encoder);
    if (encoder->sw_pin_used) {
        gpio_isr_handler_add(sw_pin, button_isr_handler, encoder);
    }
    
    // Create task to process events
    xTaskCreate(encoder_task, "encoder_task", 2048, encoder, 5, &encoder->task_handle);
    
    *handle = encoder;
    ESP_LOGI(TAG, "Rotary encoder initialized successfully");
    return ESP_OK;
}

esp_err_t rotary_encoder_register_callback(rotary_encoder_handle_t handle, 
                                           rotary_encoder_callback_t callback, 
                                           void* user_data) {
    if (handle == nullptr) {
        return ESP_ERR_INVALID_ARG;
    }
    
    handle->callback = callback;
    handle->user_data = user_data;
    
    ESP_LOGI(TAG, "Encoder callback registered");
    return ESP_OK;
}

int32_t rotary_encoder_get_position(rotary_encoder_handle_t handle) {
    if (handle == nullptr) {
        return 0;
    }
    return handle->position;
}

esp_err_t rotary_encoder_set_position(rotary_encoder_handle_t handle, int32_t position) {
    if (handle == nullptr) {
        return ESP_ERR_INVALID_ARG;
    }
    
    handle->position = position;
    ESP_LOGI(TAG, "Encoder position set to %ld", position);
    return ESP_OK;
}

esp_err_t rotary_encoder_set_enabled(rotary_encoder_handle_t handle, bool enabled) {
    if (handle == nullptr) {
        return ESP_ERR_INVALID_ARG;
    }
    
    handle->enabled = enabled;
    ESP_LOGI(TAG, "Encoder %s", enabled ? "enabled" : "disabled");
    return ESP_OK;
}

esp_err_t rotary_encoder_deinit(rotary_encoder_handle_t handle) {
    if (handle == nullptr) {
        return ESP_ERR_INVALID_ARG;
    }
    
    // Disable encoder
    handle->enabled = false;
    
    // Remove ISR handlers
    gpio_isr_handler_remove(handle->clk_pin);
    gpio_isr_handler_remove(handle->dt_pin);
    if (handle->sw_pin_used) {
        gpio_isr_handler_remove(handle->sw_pin);
    }
    
    // Delete task
    if (handle->task_handle) {
        vTaskDelete(handle->task_handle);
    }
    
    // Delete queue
    if (handle->event_queue) {
        vQueueDelete(handle->event_queue);
    }
    
    // Free structure
    free(handle);
    
    ESP_LOGI(TAG, "Rotary encoder deinitialized");
    return ESP_OK;
}
