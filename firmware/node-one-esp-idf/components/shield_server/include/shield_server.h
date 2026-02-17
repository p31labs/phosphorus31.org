/**
 * Shield Server - WiFi AP + HTTP Server for The Buffer Web App
 * 
 * Provides:
 * - WiFi Access Point mode (SSID: "P31-NodeOne")
 * - HTTP server serving static files from SPIFFS
 * - REST API for device control
 * - WebSocket for real-time events
 * 
 * Note: Component name "shield_server" kept for compatibility.
 * User-facing references use "The Buffer" (P31 naming).
 */

#ifndef SHIELD_SERVER_H
#define SHIELD_SERVER_H

#include "esp_err.h"
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Initialize the shield server
 * - Starts WiFi AP mode
 * - Mounts SPIFFS
 * - Starts HTTP server
 * - Sets up REST API endpoints
 * - Enables WebSocket support
 * 
 * @return ESP_OK on success
 */
esp_err_t shield_server_init(void);

/**
 * Stop the shield server
 * - Stops HTTP server
 * - Unmounts SPIFFS
 * - Stops WiFi AP
 * 
 * @return ESP_OK on success
 */
esp_err_t shield_server_stop(void);

/**
 * Check if any client is connected to the AP
 * 
 * @return true if at least one client is connected
 */
bool shield_server_is_client_connected(void);

/**
 * Set dependencies (call after initializing lora_driver and audio_engine)
 * This allows shield_server to call into other components without circular dependencies
 * 
 * @param lora_handle LoRa driver handle
 * @param lora_get_rssi Function to get RSSI
 * @param lora_send Function to send LoRa packet
 * @param lora_receive Function to receive LoRa packet
 * @param audio_record_start Function to start audio recording
 * @param audio_record_stop Function to stop audio recording
 * @param audio_play_buffer Function to play audio buffer
 * @param audio_get_state Function to get audio state
 */
void shield_server_set_dependencies(
    void* lora_handle,
    int16_t (*lora_get_rssi)(void*),
    int (*lora_send)(void*, const uint8_t*, size_t),
    bool (*lora_receive)(void*, void*),  // Takes lora_packet_t*
    esp_err_t (*audio_record_start)(void*, void*),
    esp_err_t (*audio_record_stop)(void),
    esp_err_t (*audio_play_buffer)(const int16_t*, size_t),
    int (*audio_get_state)(void)
);

/**
 * Store a received LoRa message
 * Called from mesh protocol callback or LoRa receive handler
 * 
 * @param from_node Source node ID (as hex string, e.g., "0x0002")
 * @param data Message data
 * @param data_len Message data length
 * @param rssi RSSI value
 * @param snr SNR value
 */
void shield_server_store_message(const char* from_node, const uint8_t* data, size_t data_len, 
                                  int16_t rssi, float snr);

/**
 * Broadcast WebSocket event to all connected clients
 * 
 * @param event_type Event type (e.g., "button", "lora_rx", "status", "audio_level")
 * @param json_data JSON string with event data (will be wrapped in {type, ...data})
 */
void shield_server_broadcast_event(const char* event_type, const char* json_data);

/**
 * Broadcast button press event
 * 
 * @param button_id Button identifier (e.g., "BTN_TALK", "BTN_SEND")
 * @param pressed true if pressed, false if released
 */
void shield_server_broadcast_button(const char* button_id, bool pressed);

#ifdef __cplusplus
}
#endif

#endif // SHIELD_SERVER_H
