/**
 * Node One - Main Application
 * P31 Ecosystem - The First Node
 * Waveshare ESP32-S3-Touch-LCD-3.5B
 * 
 * Complete integration of:
 * - QSPI Display (AXS15231B) with LVGL - The Scope
 * - I2S Audio (ES8311) - Voice-First I/O
 * - LoRa Mesh (E22-900M30S / SX1262) - Whale Channel
 * - MCP23017 I2C GPIO Expander - The Thick Click
 * - I2C Sensors (AXP2101, QMI8658, PCF85063)
 * 
 * P31 Naming:
 * - Node One: The first physical device, the first vertex made real
 * - Whale Channel: LoRa mesh layer (915MHz)
 * - The Buffer: Communication processing (shield_server component)
 * - The Scope: Display/dashboard visualization
 * - The Thick Click: Haptic feedback system
 */

#include <stdio.h>
#include <time.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_err.h"
#include "esp_system.h"
#ifdef CONFIG_ESP_TASK_WDT
#include "esp_task_wdt.h"
#endif
#include "nvs_flash.h"
#include "nvs.h"
#include "driver/i2c_master.h"
#include "esp_random.h"
#include <stdlib.h>
#include <string.h>
#include "esp_random.h"

#include "pin_config.h"
#include "node_one_config.h"
#include "lora_driver.h"
#include "mcp23017_driver.h"
#include "mesh_protocol.h"
#include "display.h"
#include "audio_engine.h"
#include "shield_server.h"
#include "bsp.h"
#include "button_input.h"
#if P31_BLE_TEST_ENABLED
#include "ble_test.h"
#endif
#include "rotary_encoder.h"

static const char *TAG = "node_one";

// Global handles
static i2c_master_bus_handle_t i2c_bus_handle = nullptr;
static lora_driver_handle_t lora_handle = nullptr;
static mcp23017_driver_handle_t mcp23017_handle = nullptr;
static mesh_protocol_handle_t mesh_handle = nullptr;
static rotary_encoder_handle_t encoder_handle = nullptr;

// Message storage (simple in-memory queue)
#define MAX_MESSAGES 10
// Stored audio capped per message (see node_one_config.h MAX_STORED_AUDIO_SAMPLES)

typedef struct {
    uint32_t source_id;
    int16_t* audio_data;
    size_t audio_samples;
    int16_t rssi;
    float snr;
    time_t timestamp;
    bool is_emergency;
} stored_message_t;

static stored_message_t message_queue[MAX_MESSAGES];
static int message_count = 0;
static int current_message_index = -1;
static bool buffer_filter_enabled = false;
static int energy_spoons = 12;  // Starting energy
static int max_energy_spoons = 12;

// Audio engine wrapper functions for shield_server
// shield_server expects: esp_err_t (*audio_record_start)(void*, void*)
static esp_err_t audio_record_start_wrapper(void* callback, void* ctx) {
    audio_record_cb_t cb = (audio_record_cb_t)callback;
    return audio_engine_record_start(cb, ctx);
}

// shield_server expects: int (*audio_get_state)(void)
static int audio_get_state_wrapper(void) {
    return (int)audio_engine_get_state();
}

// Node ID storage
#define NVS_NAMESPACE "node_one"
#define NVS_KEY_NODE_ID "node_id"
#define DEFAULT_NODE_ID 0x00000001

/**
 * Get or create node ID from NVS
 * If not found, generates a random ID and stores it
 */
static uint32_t get_or_create_node_id(void) {
    nvs_handle_t nvs_handle;
    uint32_t node_id = 0;
    esp_err_t ret;
    
    // Open NVS namespace
    ret = nvs_open(NVS_NAMESPACE, NVS_READWRITE, &nvs_handle);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to open NVS: %s", esp_err_to_name(ret));
        return DEFAULT_NODE_ID;
    }
    
    // Try to read existing node ID
    ret = nvs_get_u32(nvs_handle, NVS_KEY_NODE_ID, &node_id);
    if (ret == ESP_OK && node_id != 0) {
        // Node ID found
        ESP_LOGI(TAG, "Node ID loaded from NVS: 0x%08X", node_id);
        nvs_close(nvs_handle);
        return node_id;
    }
    
    // Node ID not found or invalid, generate new one
    // Use random number generator (ESP32 hardware RNG)
    node_id = esp_random();
    // Ensure it's not zero or the default
    if (node_id == 0 || node_id == DEFAULT_NODE_ID) {
        node_id = esp_random() | 0x00000001; // Ensure non-zero
    }
    
    // Store in NVS
    ret = nvs_set_u32(nvs_handle, NVS_KEY_NODE_ID, node_id);
    if (ret == ESP_OK) {
        ret = nvs_commit(nvs_handle);
        if (ret == ESP_OK) {
            ESP_LOGI(TAG, "Generated and stored new node ID: 0x%08X", node_id);
        } else {
            ESP_LOGW(TAG, "Failed to commit node ID to NVS: %s", esp_err_to_name(ret));
        }
    } else {
        ESP_LOGW(TAG, "Failed to store node ID in NVS: %s", esp_err_to_name(ret));
    }
    
    nvs_close(nvs_handle);
    return node_id;
}

/**
 * Initialize I2C bus (shared by all on-board sensors + MCP23017)
 */
static void init_i2c_bus(void) {
    ESP_LOGI(TAG, "Initializing I2C bus");

    i2c_master_bus_config_t i2c_bus_cfg = {};
    i2c_bus_cfg.i2c_port = I2C_PORT_NUM;
    i2c_bus_cfg.sda_io_num = PIN_I2C_SDA;
    i2c_bus_cfg.scl_io_num = PIN_I2C_SCL;
    i2c_bus_cfg.clk_source = I2C_CLK_SRC_DEFAULT;
    i2c_bus_cfg.glitch_ignore_cnt = 7;
    i2c_bus_cfg.flags.enable_internal_pullup = true;

    esp_err_t ret = i2c_new_master_bus(&i2c_bus_cfg, &i2c_bus_handle);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "I2C bus init failed: %s", esp_err_to_name(ret));
        return;
    }

    ESP_LOGI(TAG, "I2C bus initialized (SDA=%d, SCL=%d)", PIN_I2C_SDA, PIN_I2C_SCL);
}

/**
 * Initialize display
 */
static void init_display(void) {
    if (i2c_bus_handle == nullptr) {
        ESP_LOGE(TAG, "I2C bus not initialized, cannot init display");
        return;
    }
    
    ESP_LOGI(TAG, "Initializing display...");
    esp_err_t ret = display_init(i2c_bus_handle);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Display initialization failed: %s", esp_err_to_name(ret));
        return;
    }
    ESP_LOGI(TAG, "Display initialized");
    
    // Hide splash after 500ms (non-blocking feel; keeps init responsive)
    vTaskDelay(pdMS_TO_TICKS(500));
    display_hide_splash();
}

/**
 * Initialize audio engine (voice-first I/O)
 */
static void init_audio(void) {
    if (i2c_bus_handle == nullptr) {
        ESP_LOGE(TAG, "I2C bus not initialized, cannot init audio");
        return;
    }
    
    ESP_LOGI(TAG, "Initializing audio engine (ES8311 codec)...");
    esp_err_t ret = audio_engine_init(i2c_bus_handle);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Audio engine initialization failed: %s", esp_err_to_name(ret));
        return;
    }
    
    // Play ready tone (440Hz)
    audio_engine_play_tone(440, 200, 50);
    
    ESP_LOGI(TAG, "Audio engine initialized - voice-first I/O ready");
}

/**
 * Initialize LoRa module
 */
static void init_lora(void) {
    ESP_LOGI(TAG, "Initializing LoRa module (E22-900M30S)");

    lora_handle = lora_driver_init();
    if (lora_handle == nullptr) {
        ESP_LOGE(TAG, "LoRa driver init failed");
        return;
    }

    ESP_LOGI(TAG, "LoRa module initialized");
}

/**
 * Initialize MCP23017 GPIO expander
 */
static void init_mcp23017(void) {
    ESP_LOGI(TAG, "Initializing MCP23017 GPIO expander");

    mcp23017_handle = mcp23017_driver_init(i2c_bus_handle, PIN_MCP23017_INT);
    if (mcp23017_handle == nullptr) {
        ESP_LOGE(TAG, "MCP23017 init failed");
        return;
    }

    // Configure all usable pins as inputs with pull-ups
    // Avoid GPA7 and GPB7 per datasheet errata
    for (int i = 0; i < 16; i++) {
        if (i != 7 && i != 15) {  // Skip GPA7 and GPB7
            mcp23017_set_input(mcp23017_handle, i);
        }
    }

    ESP_LOGI(TAG, "MCP23017 initialized (14 usable input pins)");
}

/**
 * Initialize mesh protocol
 */
static void init_mesh(void) {
    ESP_LOGI(TAG, "Initializing mesh protocol");

    if (lora_handle == nullptr) {
        ESP_LOGE(TAG, "LoRa driver not initialized");
        return;
    }

    // Get node ID from NVS (or generate new one)
    uint32_t node_id = get_or_create_node_id();

    mesh_handle = mesh_protocol_init(lora_handle, node_id);
    if (mesh_handle == nullptr) {
        ESP_LOGE(TAG, "Mesh protocol init failed");
        return;
    }

    // Register receive callback
    mesh_protocol_register_callback(mesh_handle, [](const mesh_packet_t* packet, void* user_data) {
        ESP_LOGI(TAG, "Mesh packet received: source=0x%08X, dest=0x%08X, seq=%d, len=%d",
                 packet->source_id, packet->dest_id, packet->sequence, packet->payload_len);
        
        // Store message in shield_server
        char from_node[16];
        snprintf(from_node, sizeof(from_node), "0x%08lX", (unsigned long)packet->source_id);
        
        // Get RSSI/SNR from LoRa driver if available
        int16_t rssi = -100;
        float snr = 0.0f;
        if (lora_handle) {
            rssi = lora_driver_get_rssi(lora_handle);
            snr = lora_driver_get_snr(lora_handle);
        }
        
        shield_server_store_message(from_node, packet->payload, packet->payload_len, rssi, snr);
        
        // Store audio message in queue if it's audio data (capped for RAM)
        size_t max_audio_bytes = (size_t)MAX_STORED_AUDIO_SAMPLES * sizeof(int16_t);
        size_t payload_len_cap = packet->payload_len <= max_audio_bytes
            ? packet->payload_len
            : max_audio_bytes;
        if (payload_len_cap >= sizeof(int16_t) &&
            (payload_len_cap % sizeof(int16_t)) == 0) {
            // Skip store if heap too low (keep 30%+ for WiFi/LoRa per firmware rules)
            if (esp_get_free_heap_size() < (size_t)MIN_FREE_HEAP_FOR_AUDIO) {
                ESP_LOGW(TAG, "Skip audio store: low heap (%u)", (unsigned)esp_get_free_heap_size());
            } else if (message_count < MAX_MESSAGES) {
                stored_message_t* msg = &message_queue[message_count];
                msg->source_id = packet->source_id;
                msg->audio_samples = payload_len_cap / sizeof(int16_t);
                msg->rssi = rssi;
                msg->snr = snr;
                msg->timestamp = time(nullptr);
                msg->is_emergency = (packet->payload_len < 100);
                msg->audio_data = (int16_t*)malloc(payload_len_cap);
                if (msg->audio_data != nullptr) {
                    memcpy(msg->audio_data, packet->payload, payload_len_cap);
                    message_count++;
                    if (current_message_index < 0) {
                        current_message_index = 0;
                    }
                    ESP_LOGI(TAG, "Stored audio message %d: %zu samples from 0x%08X",
                            message_count - 1, msg->audio_samples, msg->source_id);
                } else {
                    ESP_LOGE(TAG, "Failed to allocate memory for audio message");
                }
            } else {
                // Queue full: drop oldest, shift, then add new at end
                if (message_queue[0].audio_data != nullptr) {
                    free(message_queue[0].audio_data);
                    message_queue[0].audio_data = nullptr;
                }
                for (int i = 0; i < MAX_MESSAGES - 1; i++) {
                    message_queue[i] = message_queue[i + 1];
                }
                // Clear last slot before overwrite (avoid leak)
                if (message_queue[MAX_MESSAGES - 1].audio_data != nullptr) {
                    free(message_queue[MAX_MESSAGES - 1].audio_data);
                    message_queue[MAX_MESSAGES - 1].audio_data = nullptr;
                }
                stored_message_t* msg = &message_queue[MAX_MESSAGES - 1];
                msg->source_id = packet->source_id;
                msg->audio_samples = payload_len_cap / sizeof(int16_t);
                msg->rssi = rssi;
                msg->snr = snr;
                msg->timestamp = time(nullptr);
                msg->is_emergency = (packet->payload_len < 100);
                msg->audio_data = (int16_t*)malloc(payload_len_cap);
                if (msg->audio_data != nullptr) {
                    memcpy(msg->audio_data, packet->payload, payload_len_cap);
                    ESP_LOGI(TAG, "Stored audio (queue full, replaced oldest): %zu samples",
                            msg->audio_samples);
                }
            }
        }
    }, nullptr);

    ESP_LOGI(TAG, "Mesh protocol initialized (node_id=0x%08X)", node_id);
}

/**
 * Rotary encoder callback - handles volume/parameter adjustment
 */
static void encoder_callback(int direction, int32_t position, bool button_pressed, void* user_data) {
    if (button_pressed) {
        // Button press - could be used for mute toggle or mode switch
        ESP_LOGI(TAG, "Encoder button pressed");
        // Toggle mute
        uint8_t vol = audio_engine_get_volume();
        if (vol > 0) {
            audio_engine_set_volume(0);
            ESP_LOGI(TAG, "Muted via encoder button");
        } else {
            audio_engine_set_volume(50);
            ESP_LOGI(TAG, "Unmuted via encoder button");
        }
        return;
    }
    
    // Rotation detected
    if (direction != 0) {
        uint8_t current_vol = audio_engine_get_volume();
        int new_vol = current_vol + (direction * 5); // 5% steps
        
        // Clamp to 0-100
        if (new_vol < 0) new_vol = 0;
        if (new_vol > 100) new_vol = 100;
        
        audio_engine_set_volume((uint8_t)new_vol);
        ESP_LOGI(TAG, "Volume adjusted via encoder: %d%% (direction=%d, position=%ld)", 
                 new_vol, direction, position);
        
        // Trigger haptic feedback on detent (The Thick Click)
        // Note: Haptic feedback would be triggered via MCP23017/DRV2605L
        // For now, we just log - haptic integration can be added later
        ESP_LOGD(TAG, "Haptic feedback triggered (detent click)");
    }
}

/**
 * Initialize rotary encoder (Volume Encoder Module)
 */
static void init_rotary_encoder(void) {
    ESP_LOGI(TAG, "Initializing rotary encoder (Volume Encoder Module)");
    
    esp_err_t ret = rotary_encoder_init(PIN_ENCODER_CLK, PIN_ENCODER_DT, PIN_ENCODER_SW, &encoder_handle);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Rotary encoder initialization failed: %s", esp_err_to_name(ret));
        return;
    }
    
    // Register callback
    ret = rotary_encoder_register_callback(encoder_handle, encoder_callback, nullptr);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to register encoder callback: %s", esp_err_to_name(ret));
        rotary_encoder_deinit(encoder_handle);
        encoder_handle = nullptr;
        return;
    }
    
    ESP_LOGI(TAG, "Rotary encoder initialized (CLK=%d, DT=%d)", PIN_ENCODER_CLK, PIN_ENCODER_DT);
}

/**
 * Button input callback - handles all button events
 */
static void button_input_callback(button_id_t button, bool pressed, void* ctx) {
    // Map button IDs to string names for shield_server
    const char* button_names[] = {
        "BTN_TALK",      // BTN_TALK
        "BTN_SEND",      // BTN_SEND
        "BTN_PLAY",      // BTN_PLAY
        "BTN_NEXT",      // BTN_NEXT
        "BTN_PREV",      // BTN_PREV
        "BTN_VOL_UP",    // BTN_VOL_UP
        "BTN_VOL_DOWN",  // BTN_VOL_DOWN
        "BTN_MODE",      // BTN_MODE
        "BTN_CHANNEL",   // BTN_CHANNEL
        "BTN_EMERGENCY", // BTN_EMERGENCY
        "BTN_MUTE",      // BTN_MUTE
        "BTN_SHIELD",    // BTN_SHIELD
        "BTN_AUX1",      // BTN_AUX1
        "BTN_AUX2",      // BTN_AUX2
    };
    
    if (button < BTN_COUNT) {
        ESP_LOGI(TAG, "Button %s %s", button_names[button], pressed ? "pressed" : "released");
        
        // Broadcast to shield_server for WebSocket clients
        shield_server_broadcast_button(button_names[button], pressed);
        
        // Handle button actions
        if (pressed) {
            switch (button) {
                case BTN_TALK:
                    // Start recording when talk button pressed
                    // Use record_to_buffer for button-triggered recording (blocking)
                    // For streaming, use record_start with callback
                    {
                        esp_err_t ret = audio_engine_record_start(nullptr, nullptr);
                        if (ret != ESP_OK) {
                            ESP_LOGE(TAG, "Failed to start recording: %s", esp_err_to_name(ret));
                            // Play error tone
                            audio_engine_play_tone(160, 200, 30);
                        } else {
                            // Play ready tone
                            audio_engine_play_tone(440, 100, 30);
                        }
                    }
                    break;
                    
                case BTN_SEND:
                    // Stop recording and send message
                    {
                        esp_err_t ret = audio_engine_record_stop();
                        if (ret == ESP_OK) {
                            // Get recorded audio buffer
                            int16_t* audio_buf = nullptr;
                            size_t audio_samples = 0;
                            ret = audio_engine_record_to_buffer(&audio_buf, &audio_samples, 10); // Max 10 seconds
                            
                            if (ret == ESP_OK && audio_buf != nullptr && audio_samples > 0) {
                                // Convert audio to bytes for transmission
                                size_t audio_bytes = audio_samples * sizeof(int16_t);
                                
                                // Create mesh packet (broadcast)
                                if (mesh_handle != nullptr) {
                                    // Send as broadcast (0xFFFFFFFF)
                                    int send_ret = mesh_protocol_send(mesh_handle, 0xFFFFFFFF, 
                                                                      (const uint8_t*)audio_buf, audio_bytes);
                                    if (send_ret == 0) {
                                        ESP_LOGI(TAG, "Audio message sent: %zu samples (%zu bytes)", 
                                                audio_samples, audio_bytes);
                                        // Play sent tone
                                        audio_engine_play_tone(880, 200, 50);
                                        // Consume energy
                                        if (energy_spoons > 0) energy_spoons--;
                                    } else {
                                        ESP_LOGE(TAG, "Failed to send audio message: %d", send_ret);
                                        audio_engine_play_tone(160, 200, 30); // Error tone
                                    }
                                }
                                
                                // Free audio buffer
                                if (audio_buf != nullptr) {
                                    free(audio_buf);
                                }
                            } else {
                                ESP_LOGW(TAG, "No audio recorded or recording failed");
                                audio_engine_play_tone(160, 200, 30); // Error tone
                            }
                        }
                    }
                    break;
                    
                case BTN_PLAY:
                    // Play current message
                    {
                        if (message_count > 0 && current_message_index >= 0 && 
                            current_message_index < message_count) {
                            stored_message_t* msg = &message_queue[current_message_index];
                            if (msg->audio_data != nullptr && msg->audio_samples > 0) {
                                ESP_LOGI(TAG, "Playing message %d: %zu samples", 
                                        current_message_index, msg->audio_samples);
                                audio_engine_play_buffer(msg->audio_data, msg->audio_samples);
                            } else {
                                ESP_LOGW(TAG, "Message %d has no audio data", current_message_index);
                                audio_engine_play_tone(160, 200, 30); // Error tone
                            }
                        } else {
                            ESP_LOGW(TAG, "No messages to play");
                            audio_engine_play_tone(160, 200, 30); // Error tone
                        }
                    }
                    break;
                    
                case BTN_NEXT:
                    // Next message
                    {
                        if (message_count > 0) {
                            current_message_index = (current_message_index + 1) % message_count;
                            ESP_LOGI(TAG, "Navigated to message %d/%d", 
                                    current_message_index + 1, message_count);
                            audio_engine_play_tone(440, 50, 20); // Navigation tone
                        }
                    }
                    break;
                    
                case BTN_PREV:
                    // Previous message
                    {
                        if (message_count > 0) {
                            current_message_index = (current_message_index - 1 + message_count) % message_count;
                            ESP_LOGI(TAG, "Navigated to message %d/%d", 
                                    current_message_index + 1, message_count);
                            audio_engine_play_tone(440, 50, 20); // Navigation tone
                        }
                    }
                    break;
                    
                case BTN_VOL_UP:
                    // Increase volume
                    {
                        uint8_t vol = audio_engine_get_volume();
                        if (vol < 100) {
                            audio_engine_set_volume(vol + 10);
                        }
                    }
                    break;
                    
                case BTN_VOL_DOWN:
                    // Decrease volume
                    {
                        uint8_t vol = audio_engine_get_volume();
                        if (vol > 0) {
                            audio_engine_set_volume(vol - 10);
                        }
                    }
                    break;
                    
                case BTN_MUTE:
                    // Toggle mute (simple volume toggle)
                    {
                        uint8_t vol = audio_engine_get_volume();
                        if (vol > 0) {
                            audio_engine_set_volume(0);
                            ESP_LOGI(TAG, "Muted");
                        } else {
                            audio_engine_set_volume(50); // Restore to 50%
                            ESP_LOGI(TAG, "Unmuted");
                        }
                    }
                    break;
                    
                case BTN_EMERGENCY:
                    // Emergency/SOS - send emergency message
                    {
                        ESP_LOGW(TAG, "EMERGENCY button pressed!");
                        
                        // Create emergency message
                        const char* emergency_msg = "EMERGENCY";
                        size_t msg_len = strlen(emergency_msg);
                        
                        if (mesh_handle != nullptr) {
                            // Send emergency message 3 times for reliability
                            for (int i = 0; i < 3; i++) {
                                int send_ret = mesh_protocol_send(mesh_handle, 0xFFFFFFFF, 
                                                                  (const uint8_t*)emergency_msg, msg_len);
                                if (send_ret == 0) {
                                    ESP_LOGI(TAG, "Emergency message sent (attempt %d/3)", i + 1);
                                }
                                vTaskDelay(pdMS_TO_TICKS(100)); // Small delay between sends
                            }
                            
                            // Play emergency tone
                            audio_engine_play_tone(800, 500, 80);
                            vTaskDelay(pdMS_TO_TICKS(100));
                            audio_engine_play_tone(800, 500, 80);
                        }
                    }
                    break;
                    
                case BTN_SHIELD:
                    // Toggle Buffer filter
                    {
                        buffer_filter_enabled = !buffer_filter_enabled;
                        ESP_LOGI(TAG, "Buffer filter %s", buffer_filter_enabled ? "ENABLED" : "DISABLED");
                        audio_engine_play_tone(buffer_filter_enabled ? 600 : 400, 100, 30);
                    }
                    break;
                    
                default:
                    break;
            }
        } else {
            // Button released
            if (button == BTN_TALK) {
                // Stop recording when talk button released
                audio_engine_record_stop();
            }
        }
    }
}

/**
 * Mesh processing task
 */
static void mesh_task(void* arg) {
    while (1) {
        if (mesh_handle) {
            mesh_protocol_process(mesh_handle);
        }
        vTaskDelay(pdMS_TO_TICKS(100));  // Process every 100ms
    }
}

/**
 * Main application entry point
 */
extern "C" void app_main(void) {
    ESP_LOGI(TAG, "Node One firmware starting...");
    ESP_LOGI(TAG, "Waveshare ESP32-S3-Touch-LCD-3.5B");
    ESP_LOGI(TAG, "ESP-IDF version: %s", esp_get_idf_version());

    // Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // Initialize I2C bus (must be first - shared by many devices)
    init_i2c_bus();
    if (i2c_bus_handle == nullptr) {
        ESP_LOGE(TAG, "CRITICAL: I2C bus initialization failed - system cannot continue");
        // Play error pattern and halt
        while (1) {
            vTaskDelay(pdMS_TO_TICKS(1000));
            ESP_LOGE(TAG, "System halted - I2C bus failure");
        }
    }
    vTaskDelay(pdMS_TO_TICKS(100));

    // Initialize BSP power management (AXP2101)
    // This enables battery monitoring and power rails
    esp_err_t bsp_ret = bsp_power_init(i2c_bus_handle);
    if (bsp_ret == ESP_OK) {
        ESP_LOGI(TAG, "BSP power management initialized");
        
        // Battery test on startup
        uint8_t battery_pct = bsp_battery_percent();
        uint16_t battery_mv = bsp_battery_voltage();
        bool is_charging = bsp_battery_is_charging();
        bool is_discharging = bsp_battery_is_discharging();
        bool charging_done = bsp_battery_is_charging_done();
        
        ESP_LOGI(TAG, "=== BATTERY TEST ===");
        ESP_LOGI(TAG, "Battery: %d%% (%d mV / %.2f V)", battery_pct, battery_mv, battery_mv / 1000.0f);
        ESP_LOGI(TAG, "Charging: %s", is_charging ? "YES" : "NO");
        ESP_LOGI(TAG, "Discharging: %s", is_discharging ? "YES" : "NO");
        ESP_LOGI(TAG, "Charging Done: %s", charging_done ? "YES" : "NO");
        ESP_LOGI(TAG, "===================");
    } else {
        ESP_LOGW(TAG, "BSP power init failed (non-critical): %s", esp_err_to_name(bsp_ret));
    }
    vTaskDelay(pdMS_TO_TICKS(100));

    // Initialize display
    init_display();
    vTaskDelay(pdMS_TO_TICKS(100));

    // Initialize audio (voice-first I/O - critical component)
    init_audio();
    // Audio is non-critical for basic operation, but log if it fails
    vTaskDelay(pdMS_TO_TICKS(100));

    // Initialize button input (uses MCP23017 via button_input component)
    ESP_LOGI(TAG, "Initializing button input system...");
    esp_err_t btn_ret = button_input_init(i2c_bus_handle);
    if (btn_ret == ESP_OK) {
        button_input_register_callback(button_input_callback, nullptr);
        ESP_LOGI(TAG, "Button input initialized and callback registered");
    } else {
        ESP_LOGE(TAG, "Button input initialization failed: %s", esp_err_to_name(btn_ret));
    }
    vTaskDelay(pdMS_TO_TICKS(100));
    
    // Initialize rotary encoder (Volume Encoder Module - 3D printable parts)
    init_rotary_encoder();
    vTaskDelay(pdMS_TO_TICKS(100));
    
    // Keep old MCP23017 driver for backward compatibility (if needed elsewhere)
    // init_mcp23017();

    // Initialize LoRa
    init_lora();
    vTaskDelay(pdMS_TO_TICKS(100));

    // Initialize mesh protocol
    init_mesh();
    vTaskDelay(pdMS_TO_TICKS(100));

    // Initialize shield server (WiFi AP + HTTP server)
    esp_err_t shield_ret = shield_server_init();
    if (shield_ret == ESP_OK) {
        ESP_LOGI(TAG, "Shield server initialized");
        
        // Wire up dependencies for shield_server with defensive null checks
        shield_server_set_dependencies(
            lora_handle,
            [](void* h) -> int16_t { 
                return (h != nullptr) ? lora_driver_get_rssi((lora_driver_handle_t)h) : -100; 
            },
            [](void* h, const uint8_t* data, size_t len) -> int { 
                return (h != nullptr && data != nullptr) ? lora_driver_send((lora_driver_handle_t)h, data, len) : -1; 
            },
            [](void* h, void* pkt) -> bool { 
                return (h != nullptr && pkt != nullptr) ? lora_driver_receive((lora_driver_handle_t)h, (lora_packet_t*)pkt) : false; 
            },
            audio_record_start_wrapper,
            audio_engine_record_stop,
            audio_engine_play_buffer,
            audio_get_state_wrapper
        );
        ESP_LOGI(TAG, "Shield server dependencies wired");
    } else {
        ESP_LOGW(TAG, "Shield server init failed (non-critical): %s", esp_err_to_name(shield_ret));
    }
    vTaskDelay(pdMS_TO_TICKS(100));

#if P31_BLE_TEST_ENABLED
    // Initialize BLE test component
    esp_err_t ble_ret = ble_test_init();
    if (ble_ret == ESP_OK) {
        ESP_LOGI(TAG, "BLE test component initialized");
        // BLE advertising starts automatically after sync
    } else {
        ESP_LOGW(TAG, "BLE test init failed (non-critical): %s", esp_err_to_name(ble_ret));
    }
    vTaskDelay(pdMS_TO_TICKS(100));
#endif

    // Create mesh processing task
    xTaskCreate(mesh_task, "mesh_task", 4096, nullptr, 5, nullptr);

    ESP_LOGI(TAG, "Node One initialization complete");
    ESP_LOGI(TAG, "The Mesh Holds. 🔺");

    // Initialize message queue
    memset(message_queue, 0, sizeof(message_queue));
    message_count = 0;
    current_message_index = -1;
    
    // Main loop - Status update timers
    uint32_t last_battery_update = 0;
    uint32_t last_status_update = 0;
    uint32_t last_time_update = 0;
    static uint32_t last_energy_recovery = 0;
    bool shield_server_active = (shield_ret == ESP_OK);
    
    while (1) {
        // Update display (LVGL needs periodic updates, every 5-10ms)
        // Safe to call even if display not initialized
        display_update();
        
        uint32_t now = xTaskGetTickCount() * portTICK_PERIOD_MS;
        
        // Update battery display every 5 seconds
        if (now - last_battery_update > 5000) {
            uint8_t battery_pct = bsp_battery_percent();
            bool is_charging = bsp_battery_is_charging();
            // Safe to call - function checks for valid state
            display_update_battery(battery_pct, is_charging);
            last_battery_update = now;
        }
        
        // Update status indicators (WiFi, LoRa, BLE) every 2 seconds
        if (now - last_status_update > 2000) {
            // WiFi status (shield_server provides WiFi AP)
            int wifi_rssi = -70; // Default for AP mode
            display_update_wifi(shield_server_active, wifi_rssi);
            
            // LoRa status
            if (lora_handle) {
                int16_t lora_rssi = lora_driver_get_rssi(lora_handle);
                bool lora_active = (lora_rssi != 0); // Active if RSSI is non-zero
                display_update_lora(lora_active, lora_rssi);
            } else {
                display_update_lora(false, 0);
            }
            
#if P31_BLE_TEST_ENABLED
            // BLE status
            bool ble_connected = ble_test_is_connected();
            if (ble_connected) {
                ESP_LOGI(TAG, "BLE: Connected (%d client(s))", ble_test_get_connection_count());
            }
#endif
            last_status_update = now;
        }
        
        // Update time display every 1 second
        if (now - last_time_update > 1000) {
            // TODO: Read from PCF85063 RTC when available
            // For now, use system time (will be 0 until NTP sync, but safe)
            time_t now_time = time(nullptr);
            if (now_time > 0) {
                struct tm timeinfo;
                localtime_r(&now_time, &timeinfo);
                display_update_time(timeinfo.tm_hour, timeinfo.tm_min);
            } else {
                // System time not set yet, show 00:00
                display_update_time(0, 0);
            }
            last_time_update = now;
        }
        
        // Update message count (from message queue)
        display_update_messages(message_count);
        
        // Update mode indicator
        const char* mode_str = "IDLE";
        if (audio_engine_get_state() == AUDIO_STATE_RECORDING) {
            mode_str = "REC";
        } else if (audio_engine_get_state() == AUDIO_STATE_PLAYING) {
            mode_str = "PLAY";
        } else if (buffer_filter_enabled) {
            mode_str = "SHIELD";
        }
        display_update_mode(mode_str);
        
        // Update spoon meter (energy tracking)
        // Recover energy slowly over time (1 spoon per 5 minutes)
        if (now - last_energy_recovery > 300000) { // 5 minutes
            if (energy_spoons < max_energy_spoons) {
                energy_spoons++;
                last_energy_recovery = now;
            }
        }
        display_update_spoons(energy_spoons, max_energy_spoons);
        
        // Feed task watchdog in long-running main loop (if enabled)
#ifdef CONFIG_ESP_TASK_WDT
        esp_task_wdt_reset();
#endif
        // Main application logic
        // - User input handled by button_input callback
        // - Mesh messages handled by mesh_task
        // - Audio handled by audio_engine callbacks
        vTaskDelay(pdMS_TO_TICKS(10)); // 10ms delay for smooth display updates
    }
}
