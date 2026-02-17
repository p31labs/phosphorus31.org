/**
 * BLE Test Component Implementation
 * P31 Ecosystem - Node One
 * 
 * ESP32-S3 BLE GATT server for testing connectivity
 */

#include "ble_test.h"
#include "esp_log.h"
#include "esp_err.h"
#include "nvs_flash.h"
#include <string.h>
#include <assert.h>
#include "esp_nimble_hci.h"
#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "host/ble_hs.h"
#include "host/util/util.h"
#include "services/gap/ble_svc_gap.h"
#include "services/gatt/ble_svc_gatt.h"

static const char *TAG = "ble_test";

// BLE device name
#define DEVICE_NAME "P31-Node-One"
#define DEVICE_NAME_LEN (sizeof(DEVICE_NAME) - 1)

// GATT service UUID (custom 128-bit UUID)
static const ble_uuid128_t gatt_svr_svc_uuid = 
    BLE_UUID128_INIT(0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                     0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff);

// Test characteristic UUID
static const ble_uuid128_t gatt_svr_chr_uuid = 
    BLE_UUID128_INIT(0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
                     0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0x01);

// Test data buffer
static uint8_t test_data[20] = {0};
static uint16_t test_data_len = 0;

// Connection state
static bool is_connected = false;
static uint16_t conn_handle = BLE_HS_CONN_HANDLE_NONE;

// GAP event listener (NimBLE API: register listener struct + callback)
static struct ble_gap_event_listener gap_event_listener;
static int ble_gap_event(struct ble_gap_event *event, void *arg);

/**
 * GATT characteristic access callback
 */
static int gatt_svr_chr_access(uint16_t conn_handle, uint16_t attr_handle,
                                struct ble_gatt_access_ctxt *ctxt, void *arg)
{
    int rc;

    switch (ctxt->op) {
        case BLE_GATT_ACCESS_OP_READ_CHR:
            ESP_LOGI(TAG, "Characteristic read request (len=%d)", test_data_len);
            if (ctxt->om == NULL) {
                ESP_LOGE(TAG, "Read: om is NULL");
                return BLE_ATT_ERR_INSUFFICIENT_RES;
            }
            rc = os_mbuf_append(ctxt->om, test_data, test_data_len);
            return rc == 0 ? 0 : BLE_ATT_ERR_INSUFFICIENT_RES;

        case BLE_GATT_ACCESS_OP_WRITE_CHR:
            if (ctxt->om == NULL) {
                ESP_LOGE(TAG, "Write: om is NULL");
                return BLE_ATT_ERR_INSUFFICIENT_RES;
            }
            ESP_LOGI(TAG, "Characteristic write request, len=%d", ctxt->om->om_len);
            if (ctxt->om->om_len <= sizeof(test_data)) {
                test_data_len = ctxt->om->om_len;
                rc = ble_hs_mbuf_to_flat(ctxt->om, test_data, test_data_len, NULL);
                if (rc == 0) {
                    ESP_LOGI(TAG, "Received data: %.*s", test_data_len, test_data);
                    return 0;
                } else {
                    ESP_LOGE(TAG, "Failed to extract mbuf data: %d", rc);
                }
            } else {
                ESP_LOGE(TAG, "Write data too large: %d bytes (max %d)", 
                         ctxt->om->om_len, sizeof(test_data));
            }
            return BLE_ATT_ERR_INSUFFICIENT_RES;

        default:
            return BLE_ATT_ERR_UNLIKELY;
    }
}

/**
 * GATT service definition
 */
static const struct ble_gatt_svc_def gatt_svr_svcs[] = {
    {
        // Service: Test Service
        .type = BLE_GATT_SVC_TYPE_PRIMARY,
        .uuid = &gatt_svr_svc_uuid.u,
        .characteristics = (struct ble_gatt_chr_def[]) {
            {
                // Characteristic: Test Data
                .uuid = &gatt_svr_chr_uuid.u,
                .access_cb = gatt_svr_chr_access,
                .flags = BLE_GATT_CHR_F_READ | BLE_GATT_CHR_F_WRITE,
            },
            {
                0, // No more characteristics
            }
        },
    },
    {
        0, // No more services
    },
};

/**
 * BLE sync callback
 */
static void ble_on_sync(void)
{
    int rc;

    ESP_LOGI(TAG, "BLE host synchronized");

    // Set device name
    rc = ble_svc_gap_device_name_set(DEVICE_NAME);
    if (rc != 0) {
        ESP_LOGE(TAG, "Failed to set device name: %d", rc);
        // Continue anyway - advertising may still work without name
    }

    // Start advertising
    struct ble_gap_adv_params adv_params;
    struct ble_hs_adv_fields fields;

    // Set advertising fields
    memset(&fields, 0, sizeof(fields));
    fields.flags = BLE_HS_ADV_F_DISC_GEN | BLE_HS_ADV_F_BREDR_UNSUP;
    fields.uuids128 = &gatt_svr_svc_uuid;
    fields.num_uuids128 = 1;
    fields.uuids128_is_complete = 1;
    fields.name = (uint8_t *)ble_svc_gap_device_name();
    fields.name_len = strlen(ble_svc_gap_device_name());
    fields.name_is_complete = 1;

    rc = ble_gap_adv_set_fields(&fields);
    if (rc != 0) {
        ESP_LOGE(TAG, "Error setting advertisement data: %d", rc);
        return;
    }

    // Start advertising
    memset(&adv_params, 0, sizeof(adv_params));
    adv_params.conn_mode = BLE_GAP_CONN_MODE_UND;
    adv_params.disc_mode = BLE_GAP_DISC_MODE_GEN;
    adv_params.itvl_min = BLE_GAP_ADV_FAST_INTERVAL1_MIN;
    adv_params.itvl_max = BLE_GAP_ADV_FAST_INTERVAL1_MAX;

    rc = ble_gap_adv_start(BLE_OWN_ADDR_PUBLIC, NULL, BLE_HS_FOREVER,
                           &adv_params, ble_gap_event, NULL);
    if (rc != 0) {
        ESP_LOGE(TAG, "Error starting advertisement: %d", rc);
        return;
    }

    ESP_LOGI(TAG, "BLE advertising started as '%s'", DEVICE_NAME);
}

/**
 * BLE reset callback
 */
static void ble_on_reset(int reason)
{
    ESP_LOGE(TAG, "BLE reset: reason=%d", reason);
}

/**
 * BLE connection callback
 */
static int ble_on_connect(struct ble_gap_event *event, void *arg)
{
    struct ble_gap_conn_desc desc;
    int rc;

    rc = ble_gap_conn_find(event->connect.conn_handle, &desc);
    if (rc != 0) {
        ESP_LOGE(TAG, "Failed to find connection descriptor: %d", rc);
        // Connection handle may be invalid, but still mark as connected
        // The connection event indicates a connection was established
        is_connected = true;
        conn_handle = event->connect.conn_handle;
        return 0;
    }

    ESP_LOGI(TAG, "BLE connection established: handle=%d, addr_type=%d, addr=", 
             event->connect.conn_handle, desc.peer_id_addr.type);
    ESP_LOG_BUFFER_HEX(TAG, desc.peer_id_addr.val, 6);

    is_connected = true;
    conn_handle = event->connect.conn_handle;

    return 0;
}

/**
 * BLE disconnection callback
 */
static int ble_on_disconnect(struct ble_gap_event *event, void *arg)
{
    ESP_LOGI(TAG, "BLE disconnection: handle=%d, reason=%d", 
             event->disconnect.conn.conn_handle, event->disconnect.reason);

    is_connected = false;
    conn_handle = BLE_HS_CONN_HANDLE_NONE;

    // Restart advertising
    ble_test_start_advertising();

    return 0;
}

/**
 * BLE GAP event handler
 */
static int ble_gap_event(struct ble_gap_event *event, void *arg)
{
    switch (event->type) {
        case BLE_GAP_EVENT_CONNECT:
            return ble_on_connect(event, arg);

        case BLE_GAP_EVENT_DISCONNECT:
            return ble_on_disconnect(event, arg);

        case BLE_GAP_EVENT_CONN_UPDATE:
            ESP_LOGI(TAG, "Connection updated");
            return 0;

        case BLE_GAP_EVENT_ADV_COMPLETE:
            ESP_LOGI(TAG, "Advertisement complete: reason=%d", event->adv_complete.reason);
            return 0;

        default:
            return 0;
    }
}

/**
 * BLE host task
 */
static void ble_host_task(void *param)
{
    ESP_LOGI(TAG, "BLE host task started");
    nimble_port_run();
    nimble_port_freertos_deinit();
}

/**
 * Initialize BLE test component
 */
esp_err_t ble_test_init(void)
{
    int rc;

    ESP_LOGI(TAG, "Initializing BLE test component...");

    // Note: NVS should already be initialized by main.cpp
    // If not, this will handle it gracefully
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_LOGW(TAG, "NVS partition was truncated and needs to be erased");
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "NVS init failed: %s", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    // Initialize NimBLE (includes controller + HCI; IDF 5.5)
    esp_err_t err = nimble_port_init();
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "NimBLE port init failed: %s", esp_err_to_name(err));
        return err;
    }

    // Register GATT services
    ble_gatts_count_cfg(gatt_svr_svcs);
    rc = ble_gatts_add_svcs(gatt_svr_svcs);
    if (rc != 0) {
        ESP_LOGE(TAG, "Failed to add GATT services: %d", rc);
        return ESP_FAIL;
    }

    // Set GAP event handler (listener struct + callback + arg)
    ble_gap_event_listener_register(&gap_event_listener, ble_gap_event, NULL);

    // Set sync callback
    ble_hs_cfg.sync_cb = ble_on_sync;
    ble_hs_cfg.reset_cb = ble_on_reset;

    // Start BLE host task
    nimble_port_freertos_init(ble_host_task);

    ESP_LOGI(TAG, "BLE test component initialized");
    return ESP_OK;
}

/**
 * Start BLE advertising
 */
esp_err_t ble_test_start_advertising(void)
{
    int rc;
    struct ble_gap_adv_params adv_params;
    struct ble_hs_adv_fields fields;

    if (is_connected) {
        ESP_LOGW(TAG, "Already connected, cannot start advertising");
        return ESP_ERR_INVALID_STATE;
    }

    // Set advertising fields
    memset(&fields, 0, sizeof(fields));
    fields.flags = BLE_HS_ADV_F_DISC_GEN | BLE_HS_ADV_F_BREDR_UNSUP;
    fields.uuids128 = &gatt_svr_svc_uuid;
    fields.num_uuids128 = 1;
    fields.uuids128_is_complete = 1;
    fields.name = (uint8_t *)DEVICE_NAME;
    fields.name_len = DEVICE_NAME_LEN;
    fields.name_is_complete = 1;

    rc = ble_gap_adv_set_fields(&fields);
    if (rc != 0) {
        ESP_LOGE(TAG, "Error setting advertisement data: %d", rc);
        return ESP_FAIL;
    }

    // Start advertising
    memset(&adv_params, 0, sizeof(adv_params));
    adv_params.conn_mode = BLE_GAP_CONN_MODE_UND;
    adv_params.disc_mode = BLE_GAP_DISC_MODE_GEN;
    adv_params.itvl_min = BLE_GAP_ADV_FAST_INTERVAL1_MIN;
    adv_params.itvl_max = BLE_GAP_ADV_FAST_INTERVAL1_MAX;

    rc = ble_gap_adv_start(BLE_OWN_ADDR_PUBLIC, NULL, BLE_HS_FOREVER,
                           &adv_params, ble_gap_event, NULL);
    if (rc != 0) {
        ESP_LOGE(TAG, "Error starting advertisement: %d", rc);
        return ESP_FAIL;
    }

    ESP_LOGI(TAG, "BLE advertising started");
    return ESP_OK;
}

/**
 * Stop BLE advertising
 */
esp_err_t ble_test_stop_advertising(void)
{
    int rc = ble_gap_adv_stop();
    if (rc != 0) {
        ESP_LOGE(TAG, "Error stopping advertisement: %d", rc);
        return ESP_FAIL;
    }

    ESP_LOGI(TAG, "BLE advertising stopped");
    return ESP_OK;
}

/**
 * Check if BLE is connected
 */
bool ble_test_is_connected(void)
{
    return is_connected;
}

/**
 * Get number of connected clients
 */
uint8_t ble_test_get_connection_count(void)
{
    return is_connected ? 1 : 0;
}

/**
 * Deinitialize BLE test component
 */
esp_err_t ble_test_deinit(void)
{
    ESP_LOGI(TAG, "Deinitializing BLE test component...");

    if (is_connected) {
        ble_gap_terminate(conn_handle, BLE_ERR_REM_USER_CONN_TERM);
    }

    ble_test_stop_advertising();
    nimble_port_stop();
    nimble_port_deinit();

    ESP_LOGI(TAG, "BLE test component deinitialized");
    return ESP_OK;
}
