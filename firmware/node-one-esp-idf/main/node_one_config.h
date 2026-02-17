/**
 * Node One - Runtime Configuration
 * Device identity, audio, LoRa, mesh, WiFi, and MCP23017 settings
 */

#pragma once

// Device identity
#define NODE_ONE_DEVICE_NAME    "P31-Node-One"
#define NODE_ONE_VERSION        "0.1.0"
#define NODE_ONE_BUILD_DATE     __DATE__

// Audio config
#define AUDIO_SAMPLE_RATE       16000
#define AUDIO_BITS_PER_SAMPLE   16
#define AUDIO_CHANNELS          1
#define AUDIO_RECORD_MAX_SEC    30

// LoRa config (915 MHz ISM band, US)
#define LORA_FREQUENCY          915.0
#define LORA_BANDWIDTH          125.0
#define LORA_SPREADING_FACTOR   9
#define LORA_CODING_RATE        7
#define LORA_SYNC_WORD          0x12
#define LORA_TX_POWER           22      // +22 dBm at SX1262 = ~30 dBm at antenna with E22 PA
#define LORA_PREAMBLE_LEN       8

// Mesh config
#define MESH_NODE_ID            0x0001
#define MESH_MAX_HOPS           5
#define MESH_PACKET_TTL         5
#define MESH_HISTORY_SIZE       64

// WiFi AP config (for Cognitive Shield connection)
#define WIFI_AP_SSID            "P31-NodeOne"
#define WIFI_AP_PASS            "phenixnavigator"
#define WIFI_AP_CHANNEL         6
#define WIFI_AP_MAX_CONN        4

// Stored audio cap (RAM optimization: ~16KB per message at 16kHz)
#define MAX_STORED_AUDIO_SAMPLES  8192   // 0.5 s at 16 kHz

// Minimum free heap before skipping audio store (keep 32KB for WiFi/LoRa)
#define MIN_FREE_HEAP_FOR_AUDIO  32768

// MCP23017
#define MCP23017_I2C_ADDR       0x20
