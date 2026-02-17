/**
 * Shield Server Implementation
 * WiFi AP + HTTP Server for The Buffer Web App
 * 
 * Note: Component name "shield_server" kept for compatibility.
 * User-facing references use "The Buffer" (P31 naming).
 */

#include "shield_server.h"
#include "bsp.h"  // For battery reading
#include "esp_log.h"
#include "esp_err.h"
#include "esp_wifi.h"
#include "esp_netif.h"
#include "esp_http_server.h"
#include "esp_spiffs.h"
/* WebSocket API (httpd_ws_*) is in esp_http_server.h when CONFIG_HTTPD_WS_SUPPORT=y */
#include "nvs_flash.h"
#include "nvs.h"
#include "esp_timer.h"
#include "cJSON.h"
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>  // For NULL
#include <stdlib.h>
#include <stdio.h>
#include <sys/stat.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "driver/gpio.h"

// Component dependencies (forward declarations to avoid circular includes)
// These will be provided by the main application
// 
// P31 Naming Note: The underlying driver is "Whale Channel" (whale_channel_* API)
// but we use "lora" terminology here for backward compatibility with existing
// integration code. The API accepts function pointers, so it works with either
// whale_channel_* or lora_radio_* functions.
typedef struct lora_driver* lora_driver_handle_t;
typedef enum {
    AUDIO_STATE_IDLE,
    AUDIO_STATE_RECORDING,
    AUDIO_STATE_PLAYING,
    AUDIO_STATE_STREAMING,
} audio_state_t;

// Whale Channel packet structure (P31 naming: "Whale Channel" is the mesh layer)
// Technical: Uses LoRa radio technology
// Must match whale_channel_packet_t (or lora_packet_t for backward compat)
typedef struct {
    uint8_t* data;
    size_t length;
    int16_t rssi;
    float snr;
} lora_packet_t;  // Backward compatibility alias for whale_channel_packet_t

// Function pointers - will be set by shield_server_set_dependencies()
// P31 Note: These accept either whale_channel_* or lora_radio_* functions
static lora_driver_handle_t g_lora_handle = NULL;
static int16_t (*g_lora_get_rssi)(lora_driver_handle_t) = NULL;
static int (*g_lora_send)(lora_driver_handle_t, const uint8_t*, size_t) = NULL;
static bool (*g_lora_receive)(lora_driver_handle_t, lora_packet_t*) = NULL;
static esp_err_t (*g_audio_record_start)(void*, void*) = NULL;
static esp_err_t (*g_audio_record_stop)(void) = NULL;
static esp_err_t (*g_audio_play_buffer)(const int16_t*, size_t) = NULL;
static audio_state_t (*g_audio_get_state)(void) = NULL;

static const char *TAG = "shield_server";

// WiFi AP Configuration (defaults - can be overridden from NVS)
#define WIFI_AP_SSID_DEFAULT          "P31-NodeOne"
#define WIFI_AP_PASSWORD_DEFAULT      "p31mesh"
#define WIFI_AP_CHANNEL_DEFAULT       6
#define WIFI_AP_MAX_CONNECTIONS       4
#define WIFI_AP_IP            "192.168.4.1"
#define WIFI_AP_GATEWAY       "192.168.4.1"
#define WIFI_AP_NETMASK       "255.255.255.0"

// NVS namespace for shield_server config
#define NVS_NAMESPACE         "shield_server"
#define NVS_KEY_SSID          "wifi_ssid"
#define NVS_KEY_PASSWORD      "wifi_password"
#define NVS_KEY_CHANNEL       "wifi_channel"

// Runtime WiFi config (loaded from NVS or defaults)
static char wifi_ssid[33] = WIFI_AP_SSID_DEFAULT;
static char wifi_password[65] = WIFI_AP_PASSWORD_DEFAULT;
static uint8_t wifi_channel = WIFI_AP_CHANNEL_DEFAULT;

// SPIFFS Configuration
#define SPIFFS_BASE_PATH      "/spiffs"
#define SPIFFS_PARTITION_LABEL "storage"

// Server state
static httpd_handle_t server_handle = NULL;
static bool server_running = false;
static int connected_clients = 0;

// Message storage (simple ring buffer)
#define MAX_MESSAGES 50
typedef struct {
    uint32_t id;
    uint64_t timestamp;
    char from_node[16];
    int16_t rssi;
    float snr;
    char data_base64[512];
    bool played;
} stored_message_t;

static stored_message_t message_store[MAX_MESSAGES];
static uint32_t message_count = 0;
static uint32_t message_next_id = 1;

// Spoons/energy management
static struct {
    int current;
    int max;
    uint64_t history[24];  // Last 24 hours
} spoons_state = {
    .current = 8,
    .max = 12,
    .history = {0}
};

// WebSocket clients (store socket fd; -1 = empty)
#define MAX_WS_CLIENTS 4
#define WS_FD_INVALID (-1)
static int ws_clients[MAX_WS_CLIENTS];
static int ws_client_count = 0;
static SemaphoreHandle_t ws_mutex = NULL;

// Forward declarations
static esp_err_t init_wifi_ap(void);
static esp_err_t init_spiffs(void);
static esp_err_t start_http_server(void);
static void stop_http_server(void);
static esp_err_t api_status_handler(httpd_req_t *req);
static esp_err_t api_audio_record_handler(httpd_req_t *req);
static esp_err_t api_audio_stop_handler(httpd_req_t *req);
static esp_err_t api_audio_play_handler(httpd_req_t *req);
static esp_err_t api_messages_handler(httpd_req_t *req);
static esp_err_t api_lora_send_handler(httpd_req_t *req);
static esp_err_t api_shield_filter_handler(httpd_req_t *req);
static esp_err_t api_spoons_handler(httpd_req_t *req);
static esp_err_t api_spoons_set_handler(httpd_req_t *req);
static esp_err_t static_file_handler(httpd_req_t *req);
static esp_err_t root_redirect_handler(httpd_req_t *req);
static esp_err_t ws_handler(httpd_req_t *req);
static void ws_async_send(const char* data);
static char* base64_encode(const uint8_t* data, size_t input_length, size_t* output_length);
static uint8_t* base64_decode(const char* data, size_t input_length, size_t* output_length);

/**
 * Load WiFi configuration from NVS (or use defaults)
 */
static esp_err_t load_wifi_config(void) {
    nvs_handle_t nvs_handle;
    esp_err_t ret = nvs_open(NVS_NAMESPACE, NVS_READONLY, &nvs_handle);
    
    if (ret == ESP_OK) {
        size_t required_size = sizeof(wifi_ssid);
        ret = nvs_get_str(nvs_handle, NVS_KEY_SSID, wifi_ssid, &required_size);
        if (ret != ESP_OK) {
            strncpy(wifi_ssid, WIFI_AP_SSID_DEFAULT, sizeof(wifi_ssid) - 1);
        }
        
        required_size = sizeof(wifi_password);
        ret = nvs_get_str(nvs_handle, NVS_KEY_PASSWORD, wifi_password, &required_size);
        if (ret != ESP_OK) {
            strncpy(wifi_password, WIFI_AP_PASSWORD_DEFAULT, sizeof(wifi_password) - 1);
        }
        
        ret = nvs_get_u8(nvs_handle, NVS_KEY_CHANNEL, &wifi_channel);
        if (ret != ESP_OK) {
            wifi_channel = WIFI_AP_CHANNEL_DEFAULT;
        }
        
        nvs_close(nvs_handle);
        ESP_LOGI(TAG, "WiFi config loaded from NVS: SSID=%s, Channel=%d", wifi_ssid, wifi_channel);
    } else {
        ESP_LOGI(TAG, "Using default WiFi config (NVS not found)");
        strncpy(wifi_ssid, WIFI_AP_SSID_DEFAULT, sizeof(wifi_ssid) - 1);
        strncpy(wifi_password, WIFI_AP_PASSWORD_DEFAULT, sizeof(wifi_password) - 1);
        wifi_channel = WIFI_AP_CHANNEL_DEFAULT;
    }
    
    return ESP_OK;
}

/**
 * Initialize WiFi Access Point
 */
static esp_err_t init_wifi_ap(void) {
    // Load config from NVS first
    load_wifi_config();
    
    ESP_LOGI(TAG, "Initializing WiFi AP: %s", wifi_ssid);

    // Initialize network interface
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    
    esp_netif_t* ap_netif = esp_netif_create_default_wifi_ap();
    if (!ap_netif) {
        ESP_LOGE(TAG, "Failed to create AP netif");
        return ESP_FAIL;
    }

    // Configure WiFi
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));

    wifi_config_t wifi_config = {
        .ap = {
            .ssid = "",
            .ssid_len = 0,
            .password = "",
            .channel = wifi_channel,
            .authmode = WIFI_AUTH_WPA2_PSK,
            .max_connection = WIFI_AP_MAX_CONNECTIONS,
            .pmf_cfg = {
                .required = false,
            },
        },
    };
    
    // Copy SSID and password (safe string copy)
    strncpy((char*)wifi_config.ap.ssid, wifi_ssid, sizeof(wifi_config.ap.ssid) - 1);
    wifi_config.ap.ssid_len = strlen(wifi_ssid);
    strncpy((char*)wifi_config.ap.password, wifi_password, sizeof(wifi_config.ap.password) - 1);

    if (strlen(wifi_password) == 0) {
        wifi_config.ap.authmode = WIFI_AUTH_OPEN;
    }

    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_AP));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());

    ESP_LOGI(TAG, "WiFi AP started: SSID=%s, IP=%s, Channel=%d",
             wifi_ssid, WIFI_AP_IP, wifi_channel);

    return ESP_OK;
}

/**
 * Initialize SPIFFS
 */
static esp_err_t init_spiffs(void) {
    ESP_LOGI(TAG, "Initializing SPIFFS");

    esp_vfs_spiffs_conf_t conf = {
        .base_path = SPIFFS_BASE_PATH,
        .partition_label = SPIFFS_PARTITION_LABEL,
        .max_files = 5,
        .format_if_mount_failed = false
    };

    esp_err_t ret = esp_vfs_spiffs_register(&conf);
    if (ret != ESP_OK) {
        if (ret == ESP_FAIL) {
            ESP_LOGE(TAG, "Failed to mount or format filesystem");
        } else if (ret == ESP_ERR_NOT_FOUND) {
            ESP_LOGE(TAG, "Failed to find SPIFFS partition");
        } else {
            ESP_LOGE(TAG, "Failed to initialize SPIFFS (%s)", esp_err_to_name(ret));
        }
        return ret;
    }

    size_t total = 0, used = 0;
    ret = esp_spiffs_info(SPIFFS_PARTITION_LABEL, &total, &used);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to get SPIFFS partition information (%s)", esp_err_to_name(ret));
    } else {
        ESP_LOGI(TAG, "Partition size: total: %d, used: %d", total, used);
    }

    return ESP_OK;
}

/**
 * WebSocket async send to all clients
 */
static void ws_async_send(const char* data) {
#ifdef CONFIG_HTTPD_WS_SUPPORT
    if (!server_running || ws_client_count == 0) return;
    
    if (ws_mutex) {
        xSemaphoreTake(ws_mutex, portMAX_DELAY);
    }
    
    for (int i = 0; i < MAX_WS_CLIENTS; i++) {
        if (ws_clients[i] != WS_FD_INVALID) {
            httpd_ws_frame_t ws_pkt;
            memset(&ws_pkt, 0, sizeof(httpd_ws_frame_t));
            ws_pkt.payload = (uint8_t*)data;
            ws_pkt.len = strlen(data);
            ws_pkt.type = HTTPD_WS_TYPE_TEXT;
            httpd_ws_send_frame_async(server_handle, ws_clients[i], &ws_pkt);
        }
    }
    
    if (ws_mutex) {
        xSemaphoreGive(ws_mutex);
    }
#else
    // WebSocket support not enabled
    (void)data;
#endif
}

/**
 * API: GET /api/status
 */
static esp_err_t api_status_handler(httpd_req_t *req) {
    cJSON *json = cJSON_CreateObject();
    
    cJSON_AddStringToObject(json, "device_name", "P31-Node-One");
    cJSON_AddStringToObject(json, "version", "1.0.0");
    // Read battery status from AXP2101 via BSP
    uint8_t battery_pct = bsp_battery_percent();
    uint16_t battery_mv = bsp_battery_voltage();
    bool is_charging = bsp_battery_is_charging();
    bool is_discharging = bsp_battery_is_discharging();
    bool charging_done = bsp_battery_is_charging_done();
    
    cJSON_AddNumberToObject(json, "battery_pct", battery_pct);
    cJSON_AddNumberToObject(json, "battery_mv", battery_mv);
    cJSON_AddBoolToObject(json, "battery_charging", is_charging);
    cJSON_AddBoolToObject(json, "battery_discharging", is_discharging);
    cJSON_AddBoolToObject(json, "battery_charging_done", charging_done);
    cJSON_AddNumberToObject(json, "wifi_clients", connected_clients);
    // Whale Channel status (P31 naming: "Whale Channel" is the mesh layer)
    // API uses "lora" for backward compatibility with existing clients
    cJSON_AddBoolToObject(json, "lora_active", g_lora_handle != NULL);
    if (g_lora_handle && g_lora_get_rssi) {
        cJSON_AddNumberToObject(json, "lora_rssi", g_lora_get_rssi(g_lora_handle));
    } else {
        cJSON_AddNumberToObject(json, "lora_rssi", -100);
    }
    
    const char* audio_state_str = "idle";
    if (g_audio_get_state) {
        audio_state_t audio_state = g_audio_get_state();
        if (audio_state == AUDIO_STATE_RECORDING) audio_state_str = "recording";
        else if (audio_state == AUDIO_STATE_PLAYING) audio_state_str = "playing";
        else if (audio_state == AUDIO_STATE_STREAMING) audio_state_str = "streaming";
    }
    cJSON_AddStringToObject(json, "audio_state", audio_state_str);
    
    cJSON_AddNumberToObject(json, "spoons", spoons_state.current);
    
    // Count unread messages
    int unread = 0;
    for (uint32_t i = 0; i < message_count; i++) {
        if (!message_store[i].played) unread++;
    }
    cJSON_AddNumberToObject(json, "unread_messages", unread);
    
    // Uptime
    cJSON_AddNumberToObject(json, "uptime_sec", (int)(esp_timer_get_time() / 1000000));
    
    char *json_str = cJSON_Print(json);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    
    free(json_str);
    cJSON_Delete(json);
    return ESP_OK;
}

/**
 * API: GET /api/battery/test
 * Detailed battery information for testing
 */
static esp_err_t api_battery_test_handler(httpd_req_t *req) {
    cJSON *json = cJSON_CreateObject();
    
    uint8_t battery_pct = bsp_battery_percent();
    uint16_t battery_mv = bsp_battery_voltage();
    bool is_charging = bsp_battery_is_charging();
    bool is_discharging = bsp_battery_is_discharging();
    bool charging_done = bsp_battery_is_charging_done();
    
    cJSON_AddNumberToObject(json, "battery_percent", battery_pct);
    cJSON_AddNumberToObject(json, "battery_voltage_mv", battery_mv);
    cJSON_AddBoolToObject(json, "is_charging", is_charging);
    cJSON_AddBoolToObject(json, "is_discharging", is_discharging);
    cJSON_AddBoolToObject(json, "charging_done", charging_done);
    
    char *json_str = cJSON_Print(json);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    
    free(json_str);
    cJSON_Delete(json);
    return ESP_OK;
}

/**
 * API: POST /api/audio/record
 */
static esp_err_t api_audio_record_handler(httpd_req_t *req) {
    esp_err_t ret = ESP_ERR_NOT_SUPPORTED;
    if (g_audio_record_start) {
        ret = g_audio_record_start(NULL, NULL);
    }
    
    cJSON *json = cJSON_CreateObject();
    if (ret == ESP_OK) {
        cJSON_AddStringToObject(json, "status", "recording");
    } else {
        cJSON_AddStringToObject(json, "status", "error");
        cJSON_AddStringToObject(json, "error", esp_err_to_name(ret));
    }
    
    char *json_str = cJSON_Print(json);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    
    free(json_str);
    cJSON_Delete(json);
    return ESP_OK;
}

/**
 * API: POST /api/audio/stop
 */
static esp_err_t api_audio_stop_handler(httpd_req_t *req) {
    esp_err_t ret = ESP_ERR_NOT_SUPPORTED;
    if (g_audio_record_stop) {
        ret = g_audio_record_stop();
    }
    
    cJSON *json = cJSON_CreateObject();
    if (!json) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    
    if (ret == ESP_OK) {
        cJSON_AddStringToObject(json, "status", "stopped");
        // TODO: Track actual audio duration using esp_timer or FreeRTOS tick count
        // For now, duration tracking would require storing start time in audio_engine
        cJSON_AddNumberToObject(json, "duration_ms", 0);
    } else {
        cJSON_AddStringToObject(json, "status", "error");
        cJSON_AddStringToObject(json, "error", esp_err_to_name(ret));
    }
    
    char *json_str = cJSON_Print(json);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    
    free(json_str);
    cJSON_Delete(json);
    return ESP_OK;
}

/**
 * API: POST /api/audio/play
 */
static esp_err_t api_audio_play_handler(httpd_req_t *req) {
    char content[1024];
    int ret = httpd_req_recv(req, content, sizeof(content) - 1);
    if (ret <= 0) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    content[ret] = '\0';
    
    cJSON *json = cJSON_Parse(content);
    if (json) {
        // Check for message_id
        cJSON *msg_id = cJSON_GetObjectItem(json, "message_id");
        if (msg_id && cJSON_IsNumber(msg_id)) {
            uint32_t id = cJSON_GetNumberValue(msg_id);
            // Find message and play it
            for (uint32_t i = 0; i < message_count; i++) {
                if (message_store[i].id == id) {
                    // Decode base64 and play
                    size_t decoded_len;
                    uint8_t* decoded = base64_decode(message_store[i].data_base64, 
                                                     strlen(message_store[i].data_base64), 
                                                     &decoded_len);
                    if (decoded && g_audio_play_buffer) {
                        g_audio_play_buffer((int16_t*)decoded, decoded_len / 2);
                        message_store[i].played = true;
                        free(decoded);
                    }
                    break;
                }
            }
        }
        cJSON_Delete(json);
    } else {
        // Assume raw PCM data
        if (g_audio_play_buffer) {
            g_audio_play_buffer((int16_t*)content, ret / 2);
        }
    }
    
    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "playing");
    char *json_str = cJSON_Print(resp);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    free(json_str);
    cJSON_Delete(resp);
    
    return ESP_OK;
}

/**
 * API: GET /api/messages
 */
static esp_err_t api_messages_handler(httpd_req_t *req) {
    cJSON *json = cJSON_CreateArray();
    
    for (uint32_t i = 0; i < message_count; i++) {
        cJSON *msg = cJSON_CreateObject();
        cJSON_AddNumberToObject(msg, "id", message_store[i].id);
        cJSON_AddNumberToObject(msg, "timestamp", message_store[i].timestamp);
        cJSON_AddStringToObject(msg, "from_node", message_store[i].from_node);
        cJSON_AddNumberToObject(msg, "rssi", message_store[i].rssi);
        cJSON_AddNumberToObject(msg, "snr", message_store[i].snr);
        cJSON_AddStringToObject(msg, "data_base64", message_store[i].data_base64);
        cJSON_AddBoolToObject(msg, "played", message_store[i].played);
        cJSON_AddItemToArray(json, msg);
    }
    
    char *json_str = cJSON_Print(json);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    
    free(json_str);
    cJSON_Delete(json);
    return ESP_OK;
}

/**
 * API: POST /api/lora/send
 */
static esp_err_t api_lora_send_handler(httpd_req_t *req) {
    char content[512];
    int ret = httpd_req_recv(req, content, sizeof(content) - 1);
    if (ret <= 0) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    content[ret] = '\0';
    
    uint8_t* data = NULL;
    size_t data_len = 0;
    
    cJSON *json = cJSON_Parse(content);
    if (json) {
        cJSON *data_b64 = cJSON_GetObjectItem(json, "data_base64");
        cJSON *text = cJSON_GetObjectItem(json, "text");
        
        if (data_b64 && cJSON_IsString(data_b64)) {
            data = base64_decode(cJSON_GetStringValue(data_b64), 
                                 strlen(cJSON_GetStringValue(data_b64)), 
                                 &data_len);
        } else if (text && cJSON_IsString(text)) {
            const char* text_str = cJSON_GetStringValue(text);
            data_len = strlen(text_str);
            data = malloc(data_len);
            memcpy(data, text_str, data_len);
        }
        cJSON_Delete(json);
    }
    
    if (!data || !g_lora_handle || !g_lora_send) {
        httpd_resp_send_500(req);
        if (data) free(data);
        return ESP_FAIL;
    }
    
    int send_ret = g_lora_send(g_lora_handle, data, data_len);
    free(data);
    
    cJSON *resp = cJSON_CreateObject();
    if (send_ret == 0) {
        cJSON_AddStringToObject(resp, "status", "sent");
    } else {
        cJSON_AddStringToObject(resp, "status", "error");
    }
    
    char *json_str = cJSON_Print(resp);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    free(json_str);
    cJSON_Delete(resp);
    
    return ESP_OK;
}

/**
 * API: POST /api/shield/filter
 * Filter text through The Buffer
 * Note: Endpoint name kept for compatibility, functionality is The Buffer filter
 */
static esp_err_t api_shield_filter_handler(httpd_req_t *req) {
    char content[1024];
    int ret = httpd_req_recv(req, content, sizeof(content) - 1);
    if (ret <= 0) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    content[ret] = '\0';
    
    cJSON *json = cJSON_Parse(content);
    if (!json) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    
    cJSON *raw_text = cJSON_GetObjectItem(json, "raw_text");
    if (!raw_text || !cJSON_IsString(raw_text)) {
        cJSON_Delete(json);
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    
    const char* text = cJSON_GetStringValue(raw_text);
    cJSON_Delete(json);
    
    // Defensive: validate text is not NULL
    if (!text) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    
    // Simple filter (TODO: Integrate with actual The Buffer filter when available)
    // Current implementation: pass-through with low threat level
    // Future: Connect to The Buffer's neurodivergent-first message processing
    cJSON *resp = cJSON_CreateObject();
    if (!resp) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    
    cJSON_AddStringToObject(resp, "filtered_text", text);
    cJSON_AddStringToObject(resp, "threat_level", "low");
    cJSON *flags = cJSON_CreateArray();
    if (flags) {
        cJSON_AddItemToObject(resp, "flags", flags);
    }
    
    char *json_str = cJSON_Print(resp);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    free(json_str);
    cJSON_Delete(resp);
    
    return ESP_OK;
}

/**
 * API: GET /api/spoons
 */
static esp_err_t api_spoons_handler(httpd_req_t *req) {
    cJSON *json = cJSON_CreateObject();
    cJSON_AddNumberToObject(json, "current", spoons_state.current);
    cJSON_AddNumberToObject(json, "max", spoons_state.max);
    
    cJSON *history = cJSON_CreateArray();
    for (int i = 0; i < 24; i++) {
        cJSON_AddItemToArray(history, cJSON_CreateNumber(spoons_state.history[i]));
    }
    cJSON_AddItemToObject(json, "history", history);
    
    char *json_str = cJSON_Print(json);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    free(json_str);
    cJSON_Delete(json);
    return ESP_OK;
}

/**
 * API: POST /api/spoons/set
 */
static esp_err_t api_spoons_set_handler(httpd_req_t *req) {
    char content[128];
    int ret = httpd_req_recv(req, content, sizeof(content) - 1);
    if (ret <= 0) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    content[ret] = '\0';
    
    cJSON *json = cJSON_Parse(content);
    if (!json) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }
    
    cJSON *count = cJSON_GetObjectItem(json, "count");
    if (count && cJSON_IsNumber(count)) {
        spoons_state.current = (int)cJSON_GetNumberValue(count);
        if (spoons_state.current < 0) spoons_state.current = 0;
        if (spoons_state.current > spoons_state.max) spoons_state.current = spoons_state.max;
    }
    cJSON_Delete(json);
    
    cJSON *resp = cJSON_CreateObject();
    cJSON_AddNumberToObject(resp, "current", spoons_state.current);
    char *json_str = cJSON_Print(resp);
    httpd_resp_set_type(req, "application/json");
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    httpd_resp_send(req, json_str, strlen(json_str));
    free(json_str);
    cJSON_Delete(resp);
    
    // Send WebSocket update
    cJSON *ws_msg = cJSON_CreateObject();
    cJSON_AddStringToObject(ws_msg, "type", "status");
    cJSON_AddNumberToObject(ws_msg, "spoons", spoons_state.current);
    char *ws_str = cJSON_Print(ws_msg);
    ws_async_send(ws_str);
    free(ws_str);
    cJSON_Delete(ws_msg);
    
    return ESP_OK;
}

/**
 * Static file handler (serves from SPIFFS)
 */
static esp_err_t static_file_handler(httpd_req_t *req) {
    /* Match max URI length + SPIFFS_BASE_PATH to avoid format-truncation */
    char filepath[512 + 16];
    size_t uri_off = (strncmp(req->uri, "/web/", 5) == 0) ? 4 : 0;
    int n = snprintf(filepath, sizeof(filepath), "%s%s", SPIFFS_BASE_PATH, req->uri + uri_off);
    if (n < 0 || (size_t)n >= sizeof(filepath)) {
        httpd_resp_send_404(req);
        return ESP_FAIL;
    }
    
    // Determine content type
    const char* content_type = "text/plain";
    if (strstr(filepath, ".html")) content_type = "text/html";
    else if (strstr(filepath, ".js")) content_type = "application/javascript";
    else if (strstr(filepath, ".css")) content_type = "text/css";
    else if (strstr(filepath, ".json")) content_type = "application/json";
    else if (strstr(filepath, ".png")) content_type = "image/png";
    else if (strstr(filepath, ".jpg") || strstr(filepath, ".jpeg")) content_type = "image/jpeg";
    else if (strstr(filepath, ".svg")) content_type = "image/svg+xml";
    
    FILE* f = fopen(filepath, "r");
    if (!f) {
        ESP_LOGE(TAG, "Failed to open file: %s", filepath);
        httpd_resp_send_404(req);
        return ESP_FAIL;
    }
    
    httpd_resp_set_type(req, content_type);
    httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
    
    char chunk[512];
    size_t read_len;
    while ((read_len = fread(chunk, 1, sizeof(chunk), f)) > 0) {
        if (httpd_resp_send_chunk(req, chunk, read_len) != ESP_OK) {
            fclose(f);
            return ESP_FAIL;
        }
    }
    
    httpd_resp_send_chunk(req, NULL, 0);
    fclose(f);
    return ESP_OK;
}

/**
 * Root redirect handler
 */
static esp_err_t root_redirect_handler(httpd_req_t *req) {
    httpd_resp_set_status(req, "302 Found");
    httpd_resp_set_hdr(req, "Location", "/web/index.html");
    httpd_resp_send(req, NULL, 0);
    return ESP_OK;
}

/**
 * WebSocket handler
 */
static esp_err_t ws_handler(httpd_req_t *req) {
#ifdef CONFIG_HTTPD_WS_SUPPORT
    if (req->method == HTTP_GET) {
        ESP_LOGI(TAG, "WebSocket connection request");
        return ESP_OK;
    }
    
    httpd_ws_frame_t ws_pkt;
    uint8_t *buf = NULL;
    memset(&ws_pkt, 0, sizeof(httpd_ws_frame_t));
    ws_pkt.type = HTTPD_WS_TYPE_TEXT;
    
    esp_err_t ret = httpd_ws_recv_frame(req, &ws_pkt, 0);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "httpd_ws_recv_frame failed: %s", esp_err_to_name(ret));
        return ret;
    }
    
    if (ws_pkt.len) {
        buf = calloc(1, ws_pkt.len + 1);
        if (buf == NULL) {
            ESP_LOGE(TAG, "Failed to calloc memory for buf");
            return ESP_ERR_NO_MEM;
        }
        ws_pkt.payload = buf;
        ret = httpd_ws_recv_frame(req, &ws_pkt, ws_pkt.len);
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "httpd_ws_recv_frame failed: %s", esp_err_to_name(ret));
            free(buf);
            return ret;
        }
        ESP_LOGI(TAG, "WebSocket received: %.*s", ws_pkt.len, ws_pkt.payload);
        free(buf);
    }
    
    // Add client to list
    if (ws_mutex) {
        xSemaphoreTake(ws_mutex, portMAX_DELAY);
    }
    
    for (int i = 0; i < MAX_WS_CLIENTS; i++) {
        if (ws_clients[i] == WS_FD_INVALID) {
            ws_clients[i] = httpd_req_to_sockfd(req);
            ws_client_count++;
            ESP_LOGI(TAG, "WebSocket client connected (%d/%d)", ws_client_count, MAX_WS_CLIENTS);
            break;
        }
    }
    
    if (ws_mutex) {
        xSemaphoreGive(ws_mutex);
    }
    
    return ESP_OK;
#else
    // WebSocket support not enabled
    httpd_resp_send_404(req);
    return ESP_ERR_NOT_SUPPORTED;
#endif
}

/**
 * Base64 encode
 */
static char* base64_encode(const uint8_t* data, size_t input_length, size_t* output_length) {
    const char base64_chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    *output_length = 4 * ((input_length + 2) / 3);
    char* encoded = malloc(*output_length + 1);
    if (!encoded) return NULL;
    
    size_t i, j;
    for (i = 0, j = 0; i < input_length;) {
        uint32_t octet_a = i < input_length ? data[i++] : 0;
        uint32_t octet_b = i < input_length ? data[i++] : 0;
        uint32_t octet_c = i < input_length ? data[i++] : 0;
        
        uint32_t triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;
        
        encoded[j++] = base64_chars[(triple >> 3 * 6) & 0x3F];
        encoded[j++] = base64_chars[(triple >> 2 * 6) & 0x3F];
        encoded[j++] = base64_chars[(triple >> 1 * 6) & 0x3F];
        encoded[j++] = base64_chars[(triple >> 0 * 6) & 0x3F];
    }
    
    for (i = 0; i < (3 - input_length % 3) % 3; i++) {
        encoded[*output_length - 1 - i] = '=';
    }
    
    encoded[*output_length] = '\0';
    return encoded;
}

/**
 * Base64 decode
 */
static uint8_t* base64_decode(const char* data, size_t input_length, size_t* output_length) {
    const char base64_chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    if (input_length % 4 != 0) return NULL;
    
    *output_length = input_length / 4 * 3;
    if (input_length > 0 && data[input_length - 1] == '=') (*output_length)--;
    if (input_length > 1 && data[input_length - 2] == '=') (*output_length)--;
    
    uint8_t* decoded = malloc(*output_length);
    if (!decoded) return NULL;
    
    size_t i, j;
    for (i = 0, j = 0; i < input_length; i += 4) {
        const char* p;
        uint32_t sextet_a = 0, sextet_b = 0, sextet_c = 0, sextet_d = 0;
        
        if (i < input_length && data[i] != '=') {
            p = strchr(base64_chars, data[i]);
            if (p) sextet_a = p - base64_chars;
        }
        if (i + 1 < input_length && data[i + 1] != '=') {
            p = strchr(base64_chars, data[i + 1]);
            if (p) sextet_b = p - base64_chars;
        }
        if (i + 2 < input_length && data[i + 2] != '=') {
            p = strchr(base64_chars, data[i + 2]);
            if (p) sextet_c = p - base64_chars;
        }
        if (i + 3 < input_length && data[i + 3] != '=') {
            p = strchr(base64_chars, data[i + 3]);
            if (p) sextet_d = p - base64_chars;
        }
        
        uint32_t triple = (sextet_a << 18) + (sextet_b << 12) + (sextet_c << 6) + sextet_d;
        
        if (j < *output_length) decoded[j++] = (triple >> 16) & 0xFF;
        if (j < *output_length) decoded[j++] = (triple >> 8) & 0xFF;
        if (j < *output_length) decoded[j++] = triple & 0xFF;
    }
    
    return decoded;
}

/**
 * Start HTTP server
 */
static esp_err_t start_http_server(void) {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.max_uri_handlers = 20;
    config.max_open_sockets = 7;
    
    ESP_LOGI(TAG, "Starting HTTP server on port %d", config.server_port);
    for (int i = 0; i < MAX_WS_CLIENTS; i++) {
        ws_clients[i] = WS_FD_INVALID;
    }
    ws_client_count = 0;

    if (httpd_start(&server_handle, &config) == ESP_OK) {
        // Root redirect
        httpd_uri_t root_uri = {
            .uri = "/",
            .method = HTTP_GET,
            .handler = root_redirect_handler,
        };
        httpd_register_uri_handler(server_handle, &root_uri);
        
        // Static files
        httpd_uri_t static_uri = {
            .uri = "/web/*",
            .method = HTTP_GET,
            .handler = static_file_handler,
        };
        httpd_register_uri_handler(server_handle, &static_uri);
        
        // API endpoints
        httpd_uri_t api_status_uri = {
            .uri = "/api/status",
            .method = HTTP_GET,
            .handler = api_status_handler,
        };
        httpd_register_uri_handler(server_handle, &api_status_uri);
        
        // Battery test endpoint
        httpd_uri_t api_battery_test_uri = {
            .uri = "/api/battery/test",
            .method = HTTP_GET,
            .handler = api_battery_test_handler,
        };
        httpd_register_uri_handler(server_handle, &api_battery_test_uri);
        
        httpd_uri_t api_audio_record_uri = {
            .uri = "/api/audio/record",
            .method = HTTP_POST,
            .handler = api_audio_record_handler,
        };
        httpd_register_uri_handler(server_handle, &api_audio_record_uri);
        
        httpd_uri_t api_audio_stop_uri = {
            .uri = "/api/audio/stop",
            .method = HTTP_POST,
            .handler = api_audio_stop_handler,
        };
        httpd_register_uri_handler(server_handle, &api_audio_stop_uri);
        
        httpd_uri_t api_audio_play_uri = {
            .uri = "/api/audio/play",
            .method = HTTP_POST,
            .handler = api_audio_play_handler,
        };
        httpd_register_uri_handler(server_handle, &api_audio_play_uri);
        
        httpd_uri_t api_messages_uri = {
            .uri = "/api/messages",
            .method = HTTP_GET,
            .handler = api_messages_handler,
        };
        httpd_register_uri_handler(server_handle, &api_messages_uri);
        
        httpd_uri_t api_lora_send_uri = {
            .uri = "/api/lora/send",
            .method = HTTP_POST,
            .handler = api_lora_send_handler,
        };
        httpd_register_uri_handler(server_handle, &api_lora_send_uri);
        
        httpd_uri_t api_shield_filter_uri = {
            .uri = "/api/shield/filter",
            .method = HTTP_POST,
            .handler = api_shield_filter_handler,
        };
        httpd_register_uri_handler(server_handle, &api_shield_filter_uri);
        
        httpd_uri_t api_spoons_uri = {
            .uri = "/api/spoons",
            .method = HTTP_GET,
            .handler = api_spoons_handler,
        };
        httpd_register_uri_handler(server_handle, &api_spoons_uri);
        
        httpd_uri_t api_spoons_set_uri = {
            .uri = "/api/spoons/set",
            .method = HTTP_POST,
            .handler = api_spoons_set_handler,
        };
        httpd_register_uri_handler(server_handle, &api_spoons_set_uri);
        
        // WebSocket
        // WebSocket handler - use httpd_register_uri_handler with ws_handler
        // In ESP-IDF v5.5, WebSocket is detected automatically by the handler
        httpd_uri_t ws_uri = {
            .uri = "/ws",
            .method = HTTP_GET,
            .handler = ws_handler,
            .user_ctx = NULL,
        };
        httpd_register_uri_handler(server_handle, &ws_uri);
        
        ESP_LOGI(TAG, "HTTP server started");
        return ESP_OK;
    }
    
    return ESP_FAIL;
}

/**
 * Stop HTTP server
 */
static void stop_http_server(void) {
    if (server_handle) {
        httpd_stop(server_handle);
        server_handle = NULL;
        server_running = false;
        ESP_LOGI(TAG, "HTTP server stopped");
    }
}

/**
 * Public API: Initialize shield server
 */
esp_err_t shield_server_init(void) {
    ESP_LOGI(TAG, "Initializing Shield Server");
    
    // Create WebSocket mutex
    ws_mutex = xSemaphoreCreateMutex();
    if (!ws_mutex) {
        ESP_LOGE(TAG, "Failed to create WebSocket mutex");
        return ESP_ERR_NO_MEM;
    }
    
    // Initialize WiFi AP
    esp_err_t ret = init_wifi_ap();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to initialize WiFi AP");
        vSemaphoreDelete(ws_mutex);
        return ret;
    }
    
    // Initialize SPIFFS
    ret = init_spiffs();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to initialize SPIFFS");
        vSemaphoreDelete(ws_mutex);
        return ret;
    }
    
    // Start HTTP server
    ret = start_http_server();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to start HTTP server");
        vSemaphoreDelete(ws_mutex);
        return ret;
    }
    
    server_running = true;
    ESP_LOGI(TAG, "Shield Server initialized successfully");
    ESP_LOGI(TAG, "Connect to WiFi: %s (password: %s)", wifi_ssid, wifi_password);
    ESP_LOGI(TAG, "Access web app at: http://%s", WIFI_AP_IP);
    ESP_LOGI(TAG, "G.O.D. Protocol: No backdoors. Code for departure. 🔺");
    
    return ESP_OK;
}

/**
 * Public API: Stop shield server
 */
esp_err_t shield_server_stop(void) {
    ESP_LOGI(TAG, "Stopping Shield Server");
    
    stop_http_server();
    
    // Unmount SPIFFS
    esp_vfs_spiffs_unregister(SPIFFS_PARTITION_LABEL);
    
    // Stop WiFi
    esp_wifi_stop();
    esp_wifi_deinit();
    
    server_running = false;
    ESP_LOGI(TAG, "Shield Server stopped");
    
    return ESP_OK;
}

/**
 * Public API: Check if client is connected
 */
bool shield_server_is_client_connected(void) {
    wifi_sta_list_t sta_list;
    esp_wifi_ap_get_sta_list(&sta_list);
    connected_clients = sta_list.num;
    return connected_clients > 0;
}

/**
 * Public API: Set dependencies
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
) {
    g_lora_handle = (lora_driver_handle_t)lora_handle;
    g_lora_get_rssi = (int16_t (*)(lora_driver_handle_t))lora_get_rssi;
    g_lora_send = (int (*)(lora_driver_handle_t, const uint8_t*, size_t))lora_send;
    g_lora_receive = (bool (*)(lora_driver_handle_t, lora_packet_t*))lora_receive;
    g_audio_record_start = audio_record_start;
    g_audio_record_stop = audio_record_stop;
    g_audio_play_buffer = audio_play_buffer;
    g_audio_get_state = (audio_state_t (*)(void))audio_get_state;
    
    ESP_LOGI(TAG, "Dependencies set");
}

/**
 * Public API: Store received LoRa message
 */
void shield_server_store_message(const char* from_node, const uint8_t* data, size_t data_len, 
                                 int16_t rssi, float snr) {
    // Defensive: validate inputs
    if (from_node == NULL) {
        ESP_LOGW(TAG, "store_message called with NULL from_node");
        return;
    }
    if (data == NULL || data_len == 0) {
        ESP_LOGW(TAG, "store_message called with NULL data or zero length");
        return;
    }
    if (data_len > 1024) {  // Reasonable limit
        ESP_LOGW(TAG, "store_message called with oversized data (%zu bytes)", data_len);
        return;
    }
    if (message_count >= MAX_MESSAGES) {
        // Ring buffer: overwrite oldest message
        uint32_t oldest_idx = (message_next_id - MAX_MESSAGES) % MAX_MESSAGES;
        if (message_store[oldest_idx].data_base64[0] != '\0') {
            // Free old data if needed
        }
    }
    
    uint32_t idx = message_count < MAX_MESSAGES ? message_count : 
                   (message_next_id - MAX_MESSAGES) % MAX_MESSAGES;
    
    stored_message_t* msg = &message_store[idx];
    msg->id = message_next_id++;
    msg->timestamp = (uint64_t)(esp_timer_get_time() / 1000);  // milliseconds
    snprintf(msg->from_node, sizeof(msg->from_node), "%s", from_node);
    msg->rssi = rssi;
    msg->snr = snr;
    msg->played = false;
    
    // Encode data as base64
    size_t b64_len;
    char* b64 = base64_encode(data, data_len, &b64_len);
    if (b64) {
        size_t copy_len = b64_len < sizeof(msg->data_base64) - 1 ? b64_len : sizeof(msg->data_base64) - 1;
        memcpy(msg->data_base64, b64, copy_len);
        msg->data_base64[copy_len] = '\0';
        free(b64);
    } else {
        msg->data_base64[0] = '\0';
    }
    
    if (message_count < MAX_MESSAGES) {
        message_count++;
    }
    
    ESP_LOGI(TAG, "Stored message #%u from %s (RSSI: %d, SNR: %.1f)", 
             msg->id, from_node, rssi, snr);
    
    // Broadcast WebSocket event
    cJSON *ws_msg = cJSON_CreateObject();
    cJSON_AddStringToObject(ws_msg, "type", "lora_rx");
    cJSON_AddStringToObject(ws_msg, "from", from_node);
    cJSON_AddNumberToObject(ws_msg, "rssi", rssi);
    cJSON_AddNumberToObject(ws_msg, "snr", snr);
    cJSON_AddStringToObject(ws_msg, "data", msg->data_base64);
    cJSON_AddNumberToObject(ws_msg, "id", msg->id);
    
    char *ws_str = cJSON_Print(ws_msg);
    if (ws_str) {
        ws_async_send(ws_str);
        free(ws_str);
    }
    cJSON_Delete(ws_msg);
}

/**
 * Public API: Broadcast WebSocket event
 */
void shield_server_broadcast_event(const char* event_type, const char* json_data) {
    // Defensive: validate inputs
    if (event_type == NULL) {
        ESP_LOGW(TAG, "broadcast_event called with NULL event_type");
        return;
    }
    if (json_data == NULL) {
        ESP_LOGW(TAG, "broadcast_event called with NULL json_data");
        return;
    }
    if (!event_type) return;
    
    cJSON *ws_msg = cJSON_CreateObject();
    cJSON_AddStringToObject(ws_msg, "type", event_type);
    
    // Parse and merge json_data if provided
    if (json_data) {
        cJSON *data = cJSON_Parse(json_data);
        if (data) {
            cJSON *item = NULL;
            cJSON_ArrayForEach(item, data) {
                cJSON_AddItemToObject(ws_msg, item->string, cJSON_Duplicate(item, 1));
            }
            cJSON_Delete(data);
        }
    }
    
    char *ws_str = cJSON_Print(ws_msg);
    if (ws_str) {
        ws_async_send(ws_str);
        free(ws_str);
    }
    cJSON_Delete(ws_msg);
}

/**
 * Public API: Broadcast button press event
 */
void shield_server_broadcast_button(const char* button_id, bool pressed) {
    // Defensive: validate input
    if (button_id == NULL) {
        ESP_LOGW(TAG, "broadcast_button called with NULL button_id");
        return;
    }
    
    cJSON *ws_msg = cJSON_CreateObject();
    if (!ws_msg) {
        ESP_LOGE(TAG, "Failed to create JSON for button broadcast");
        return;
    }
    
    cJSON_AddStringToObject(ws_msg, "type", "button");
    cJSON_AddStringToObject(ws_msg, "id", button_id);
    cJSON_AddBoolToObject(ws_msg, "pressed", pressed);
    
    char *ws_str = cJSON_Print(ws_msg);
    if (ws_str) {
        ws_async_send(ws_str);
        free(ws_str);
    } else {
        ESP_LOGE(TAG, "Failed to serialize button event JSON");
    }
    cJSON_Delete(ws_msg);
}
