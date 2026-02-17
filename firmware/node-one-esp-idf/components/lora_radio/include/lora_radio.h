/**
 * Whale Channel Driver - Ebyte E22-900M30S (SX1262)
 * RadioLib-based driver with C-linkage API
 * 
 * P31 Naming: "Whale Channel" is the mesh layer (heritage name from submarines + whales)
 * Technical: Uses LoRa radio technology (915 MHz ISM band)
 * 
 * Hardware: E22-900M30S module with SX1262 + YP2233W PA
 * - 915 MHz ISM band
 * - 30 dBm max output (22 dBm from SX1262 + 8 dB PA gain)
 * - SPI Mode 0, 10 MHz max clock
 * - TCXO on DIO3 at 1.8V
 * - External PA controlled via TXEN/RXEN pins
 */

#ifndef WHALE_CHANNEL_H
#define WHALE_CHANNEL_H

// Backward compatibility alias
#ifndef LORA_RADIO_H
#define LORA_RADIO_H
#endif

#include "esp_err.h"
#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Whale Channel packet structure
 * (Technical: LoRa radio packet)
 */
typedef struct {
    int rssi;           ///< Received signal strength indicator (dBm)
    float snr;          ///< Signal-to-noise ratio (dB)
    uint8_t *data;      ///< Packet data (caller must free)
    size_t len;         ///< Packet length in bytes
} whale_channel_packet_t;

// Backward compatibility alias
typedef whale_channel_packet_t lora_packet_t;

/**
 * Whale Channel receive callback function type
 * Called when a packet is received on Whale Channel
 * 
 * @param packet Received packet (data must be freed by callback)
 * @param ctx User context pointer
 */
typedef void (*whale_channel_rx_cb_t)(const whale_channel_packet_t *packet, void *ctx);

// Backward compatibility alias
typedef whale_channel_rx_cb_t lora_rx_cb_t;

/**
 * Initialize Whale Channel (LoRa radio)
 * 
 * @return ESP_OK on success, error code on failure
 */
esp_err_t whale_channel_init(void);

// Backward compatibility alias
#define lora_radio_init whale_channel_init

/**
 * Deinitialize Whale Channel
 * 
 * @return ESP_OK on success
 */
esp_err_t whale_channel_deinit(void);

// Backward compatibility alias
#define lora_radio_deinit whale_channel_deinit

/**
 * Send packet over Whale Channel (blocking)
 * 
 * @param data Packet data
 * @param len Packet length in bytes
 * @return ESP_OK on success, error code on failure
 */
esp_err_t whale_channel_send(const uint8_t *data, size_t len);

// Backward compatibility alias
#define lora_radio_send whale_channel_send

/**
 * Start continuous receive mode on Whale Channel
 * 
 * @param callback Function to call when packet is received
 * @param ctx User context passed to callback
 * @return ESP_OK on success, error code on failure
 */
esp_err_t whale_channel_start_receive(whale_channel_rx_cb_t callback, void *ctx);

// Backward compatibility alias
#define lora_radio_start_receive whale_channel_start_receive

/**
 * Stop receive mode on Whale Channel
 * 
 * @return ESP_OK on success
 */
esp_err_t whale_channel_stop_receive(void);

// Backward compatibility alias
#define lora_radio_stop_receive whale_channel_stop_receive

/**
 * Put Whale Channel radio in sleep mode
 * 
 * @return ESP_OK on success
 */
esp_err_t whale_channel_sleep(void);

// Backward compatibility alias
#define lora_radio_sleep whale_channel_sleep

/**
 * Set Whale Channel frequency
 * 
 * @param freq_mhz Frequency in MHz (e.g., 915.0)
 * @return ESP_OK on success
 */
esp_err_t whale_channel_set_frequency(float freq_mhz);

// Backward compatibility alias
#define lora_radio_set_frequency whale_channel_set_frequency

/**
 * Set Whale Channel transmit power
 * 
 * @param dbm Power in dBm (max 22 for SX1262, PA adds ~8dB)
 * @return ESP_OK on success
 */
esp_err_t whale_channel_set_power(int8_t dbm);

// Backward compatibility alias
#define lora_radio_set_power whale_channel_set_power

/**
 * Get RSSI of last received packet on Whale Channel
 * 
 * @return RSSI in dBm, or 0 if no packet received
 */
int whale_channel_get_rssi(void);

// Backward compatibility alias
#define lora_radio_get_rssi whale_channel_get_rssi

#ifdef __cplusplus
}
#endif

#endif // WHALE_CHANNEL_H
