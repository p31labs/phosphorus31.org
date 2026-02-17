/**
 * Node One - Whale Channel Mesh Protocol Implementation
 * P31 Ecosystem - LoRa mesh layer (915MHz)
 * Flood routing with duplicate suppression
 */

#include "mesh_protocol.h"
#include "lora_driver.h"
#include "esp_log.h"
#include "esp_err.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <string.h>
#include <stdlib.h>

static const char *TAG = "mesh_protocol";

// Maximum packet size (LoRa + mesh overhead)
#define MESH_MAX_PACKET_SIZE 256
#define MESH_HEADER_SIZE 12  // source(4) + dest(4) + seq(2) + hop(1) + len(1)

// Duplicate detection entry
struct duplicate_entry {
    uint32_t source_id;
    uint16_t sequence;
    uint32_t timestamp;
};

// Maximum duplicate entries (simple ring buffer)
#define MAX_DUPLICATE_ENTRIES 64
// Run full duplicate-table cleanup every N packets (reduces CPU in dense traffic)
#define DUPLICATE_CLEANUP_INTERVAL 16

struct mesh_protocol {
    lora_driver_handle_t lora_handle;
    uint32_t node_id;
    uint16_t sequence_counter;
    struct duplicate_entry duplicates[MAX_DUPLICATE_ENTRIES];
    uint8_t duplicate_index;
    uint8_t packets_since_cleanup;  // For lazy cleanup
    mesh_receive_callback_t receive_callback;
    void* user_data;
};

// Check if packet is duplicate
static bool is_duplicate(mesh_protocol_handle_t handle, uint32_t source_id, uint16_t sequence) {
    uint32_t now = (uint32_t)(esp_timer_get_time() / 1000000);  // seconds
    
    for (int i = 0; i < MAX_DUPLICATE_ENTRIES; i++) {
        if (handle->duplicates[i].source_id == source_id &&
            handle->duplicates[i].sequence == sequence) {
            // Found duplicate
            return true;
        }
    }
    
    // Not a duplicate, add to table
    handle->duplicates[handle->duplicate_index].source_id = source_id;
    handle->duplicates[handle->duplicate_index].sequence = sequence;
    handle->duplicates[handle->duplicate_index].timestamp = now;
    handle->duplicate_index = (handle->duplicate_index + 1) % MAX_DUPLICATE_ENTRIES;
    handle->packets_since_cleanup++;

    // Lazy cleanup: clear old entries (older than 60s) every DUPLICATE_CLEANUP_INTERVAL packets
    if (handle->packets_since_cleanup >= DUPLICATE_CLEANUP_INTERVAL) {
        handle->packets_since_cleanup = 0;
        for (int i = 0; i < MAX_DUPLICATE_ENTRIES; i++) {
            if (handle->duplicates[i].timestamp != 0 && (uint32_t)(now - handle->duplicates[i].timestamp) > 60u) {
                handle->duplicates[i].source_id = 0;
                handle->duplicates[i].sequence = 0;
                handle->duplicates[i].timestamp = 0;
            }
        }
    }
    return false;
}

extern "C" {

mesh_protocol_handle_t mesh_protocol_init(lora_driver_handle_t lora_handle, uint32_t node_id) {
    ESP_LOGI(TAG, "Initializing mesh protocol (node_id=0x%08X)", node_id);
    
    mesh_protocol_handle_t handle = (mesh_protocol_handle_t)malloc(sizeof(struct mesh_protocol));
    if (handle == nullptr) {
        ESP_LOGE(TAG, "Failed to allocate mesh protocol handle");
        return nullptr;
    }
    
    memset(handle, 0, sizeof(struct mesh_protocol));
    handle->lora_handle = lora_handle;
    handle->node_id = node_id;
    handle->sequence_counter = 0;
    handle->duplicate_index = 0;
    handle->packets_since_cleanup = 0;
    
    // Start receiving
    lora_driver_start_receive(lora_handle);
    
    ESP_LOGI(TAG, "Mesh protocol initialized");
    return handle;
}

void mesh_protocol_deinit(mesh_protocol_handle_t handle) {
    if (handle == nullptr) return;
    free(handle);
}

int mesh_protocol_send(mesh_protocol_handle_t handle, uint32_t dest_id, 
                       const uint8_t* payload, size_t payload_len) {
    if (handle == nullptr || payload == nullptr || payload_len == 0) {
        return -1;
    }
    
    if (payload_len > (MESH_MAX_PACKET_SIZE - MESH_HEADER_SIZE)) {
        ESP_LOGE(TAG, "Payload too large: %d", payload_len);
        return -1;
    }
    
    // Build packet
    uint8_t packet[MESH_MAX_PACKET_SIZE];
    size_t offset = 0;
    
    // Header
    memcpy(packet + offset, &handle->node_id, 4);
    offset += 4;
    memcpy(packet + offset, &dest_id, 4);
    offset += 4;
    
    uint16_t seq = handle->sequence_counter++;
    memcpy(packet + offset, &seq, 2);
    offset += 2;
    
    uint8_t hop_count = 5;  // Default TTL
    packet[offset++] = hop_count;
    
    packet[offset++] = (uint8_t)payload_len;
    
    // Payload
    memcpy(packet + offset, payload, payload_len);
    offset += payload_len;
    
    // Send via LoRa
    int ret = lora_driver_send(handle->lora_handle, packet, offset);
    if (ret != 0) {
        ESP_LOGE(TAG, "LoRa send failed");
        return -1;
    }
    
    ESP_LOGI(TAG, "Sent packet: dest=0x%08X, seq=%d, len=%d", dest_id, seq, payload_len);
    return 0;
}

void mesh_protocol_process(mesh_protocol_handle_t handle) {
    if (handle == nullptr) return;
    
    lora_packet_t lora_packet;
    if (!lora_driver_receive(handle->lora_handle, &lora_packet)) {
        return;  // No packet received
    }
    
    if (lora_packet.length < MESH_HEADER_SIZE) {
        ESP_LOGW(TAG, "Packet too short: %d", lora_packet.length);
        free(lora_packet.data);
        return;
    }
    
    // Parse header
    mesh_packet_t mesh_packet;
    size_t offset = 0;
    
    memcpy(&mesh_packet.source_id, lora_packet.data + offset, 4);
    offset += 4;
    memcpy(&mesh_packet.dest_id, lora_packet.data + offset, 4);
    offset += 4;
    memcpy(&mesh_packet.sequence, lora_packet.data + offset, 2);
    offset += 2;
    mesh_packet.hop_count = lora_packet.data[offset++];
    uint8_t payload_len = lora_packet.data[offset++];
    
    // Check if duplicate
    if (is_duplicate(handle, mesh_packet.source_id, mesh_packet.sequence)) {
        ESP_LOGD(TAG, "Duplicate packet: source=0x%08X, seq=%d", 
                 mesh_packet.source_id, mesh_packet.sequence);
        free(lora_packet.data);
        return;
    }
    
    // Check if packet is for us or broadcast
    bool is_for_us = (mesh_packet.dest_id == handle->node_id || 
                      mesh_packet.dest_id == 0xFFFFFFFF);
    
    // Decrement hop count
    mesh_packet.hop_count--;
    
    // Extract payload
    mesh_packet.payload = (uint8_t*)malloc(payload_len);
    if (mesh_packet.payload == nullptr) {
        ESP_LOGE(TAG, "Failed to allocate payload buffer");
        free(lora_packet.data);
        return;
    }
    memcpy(mesh_packet.payload, lora_packet.data + offset, payload_len);
    mesh_packet.payload_len = payload_len;
    
    // Call callback if packet is for us
    if (is_for_us && handle->receive_callback) {
        handle->receive_callback(&mesh_packet, handle->user_data);
    }
    
    // Rebroadcast if hop count > 0 and not for us (or broadcast)
    if (mesh_packet.hop_count > 0 && !is_for_us) {
        // Rebuild packet with decremented hop count
        uint8_t rebroadcast_packet[MESH_MAX_PACKET_SIZE];
        size_t rebroadcast_offset = 0;
        
        memcpy(rebroadcast_packet + rebroadcast_offset, &mesh_packet.source_id, 4);
        rebroadcast_offset += 4;
        memcpy(rebroadcast_packet + rebroadcast_offset, &mesh_packet.dest_id, 4);
        rebroadcast_offset += 4;
        memcpy(rebroadcast_packet + rebroadcast_offset, &mesh_packet.sequence, 2);
        rebroadcast_offset += 2;
        rebroadcast_packet[rebroadcast_offset++] = mesh_packet.hop_count;
        rebroadcast_packet[rebroadcast_offset++] = payload_len;
        memcpy(rebroadcast_packet + rebroadcast_offset, mesh_packet.payload, payload_len);
        rebroadcast_offset += payload_len;
        
        lora_driver_send(handle->lora_handle, rebroadcast_packet, rebroadcast_offset);
        ESP_LOGI(TAG, "Rebroadcasted packet: source=0x%08X, seq=%d, hops=%d",
                 mesh_packet.source_id, mesh_packet.sequence, mesh_packet.hop_count);
    }
    
    // Cleanup
    free(mesh_packet.payload);
    free(lora_packet.data);
    
    // Restart receive
    lora_driver_start_receive(handle->lora_handle);
}

void mesh_protocol_register_callback(mesh_protocol_handle_t handle,
                                     mesh_receive_callback_t callback,
                                     void* user_data) {
    if (handle == nullptr) return;
    handle->receive_callback = callback;
    handle->user_data = user_data;
}

uint32_t mesh_protocol_get_node_id(mesh_protocol_handle_t handle) {
    if (handle == nullptr) return 0;
    return handle->node_id;
}

} // extern "C"
