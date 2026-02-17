/**
 * Node One - LoRa Driver (E22-900M30S / SX1262)
 * RadioLib-based driver for Ebyte E22-900M30S module
 */

#ifndef LORA_DRIVER_H
#define LORA_DRIVER_H

#include <stdint.h>
#include <stdbool.h>
#include "driver/spi_master.h"
#include "driver/gpio.h"

#ifdef __cplusplus
extern "C" {
#endif

// LoRa driver handle
typedef struct lora_driver* lora_driver_handle_t;

// LoRa packet structure
typedef struct {
    uint8_t* data;
    size_t length;
    int16_t rssi;
    float snr;
} lora_packet_t;

/**
 * Initialize LoRa driver
 * @return Handle on success, NULL on failure
 */
lora_driver_handle_t lora_driver_init(void);

/**
 * Deinitialize LoRa driver
 */
void lora_driver_deinit(lora_driver_handle_t handle);

/**
 * Send packet over LoRa
 * @param handle LoRa driver handle
 * @param data Packet data
 * @param length Packet length
 * @return 0 on success, negative on error
 */
int lora_driver_send(lora_driver_handle_t handle, const uint8_t* data, size_t length);

/**
 * Receive packet (non-blocking)
 * @param handle LoRa driver handle
 * @param packet Output packet structure
 * @return true if packet received, false otherwise
 */
bool lora_driver_receive(lora_driver_handle_t handle, lora_packet_t* packet);

/**
 * Set LoRa to receive mode
 */
int lora_driver_start_receive(lora_driver_handle_t handle);

/**
 * Get RSSI of last received packet
 */
int16_t lora_driver_get_rssi(lora_driver_handle_t handle);

/**
 * Get SNR of last received packet
 */
float lora_driver_get_snr(lora_driver_handle_t handle);

#ifdef __cplusplus
}
#endif

#endif // LORA_DRIVER_H
