/**
 * Node One - Whale Channel Mesh Protocol
 * P31 Ecosystem - LoRa mesh layer (915MHz)
 * Flood routing with duplicate suppression
 */

#ifndef MESH_PROTOCOL_H
#define MESH_PROTOCOL_H

#include <stdint.h>
#include <stdbool.h>
#include "lora_driver.h"

#ifdef __cplusplus
extern "C" {
#endif

// Mesh protocol handle
typedef struct mesh_protocol* mesh_protocol_handle_t;

// Mesh packet structure
typedef struct {
    uint32_t source_id;      // Source node ID
    uint32_t dest_id;         // Destination node ID (0xFFFFFFFF = broadcast)
    uint16_t sequence;        // Sequence number
    uint8_t hop_count;        // TTL (decremented each hop)
    uint8_t* payload;         // Payload data
    size_t payload_len;       // Payload length
} mesh_packet_t;

// Mesh receive callback
typedef void (*mesh_receive_callback_t)(const mesh_packet_t* packet, void* user_data);

/**
 * Initialize mesh protocol
 * @param lora_handle LoRa driver handle
 * @param node_id This node's unique ID
 * @return Handle on success, NULL on failure
 */
mesh_protocol_handle_t mesh_protocol_init(lora_driver_handle_t lora_handle, uint32_t node_id);

/**
 * Deinitialize mesh protocol
 */
void mesh_protocol_deinit(mesh_protocol_handle_t handle);

/**
 * Send packet via mesh
 * @param handle Mesh protocol handle
 * @param dest_id Destination node ID (0xFFFFFFFF for broadcast)
 * @param payload Payload data
 * @param payload_len Payload length
 * @return 0 on success, negative on error
 */
int mesh_protocol_send(mesh_protocol_handle_t handle, uint32_t dest_id, 
                       const uint8_t* payload, size_t payload_len);

/**
 * Process received packets (call periodically)
 * @param handle Mesh protocol handle
 */
void mesh_protocol_process(mesh_protocol_handle_t handle);

/**
 * Register receive callback
 * @param handle Mesh protocol handle
 * @param callback Callback function
 * @param user_data User data
 */
void mesh_protocol_register_callback(mesh_protocol_handle_t handle,
                                     mesh_receive_callback_t callback,
                                     void* user_data);

/**
 * Get node ID
 */
uint32_t mesh_protocol_get_node_id(mesh_protocol_handle_t handle);

#ifdef __cplusplus
}
#endif

#endif // MESH_PROTOCOL_H
