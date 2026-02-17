/**
 * Audio Engine Implementation
 * Voice-First Audio I/O for Node One
 */

#include "audio_engine.h"
#include "pin_map.h"
#include "esp_log.h"
#include "esp_err.h"
#include "driver/i2s_std.h"
#include "driver/i2c_master.h"
#include "driver/gpio.h"
#include "esp_codec_dev.h"
#include "esp_codec_dev_defaults.h"
#include "es8311_codec.h"
#include "audio_codec_ctrl_if.h"
#include "audio_codec_data_if.h"
#include "audio_codec_gpio_if.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "esp_heap_caps.h"
#include <string.h>
#include <math.h>

static const char *TAG = "audio_engine";

// Audio configuration
#define SAMPLE_RATE_HZ        16000
#define BITS_PER_SAMPLE       16
#define CHANNELS              1  // Mono
#define MCLK_MULTIPLIER       256
#define DMA_BUF_COUNT         4
#define DMA_BUF_LEN           1024

// ES8311 I2C address
#define ES8311_I2C_ADDR      0x18  // ES8311_ADDRRES_0

// Tone generation
#define TONE_SAMPLE_RATE      SAMPLE_RATE_HZ
#define PI                   3.14159265358979323846

// Audio engine state
static struct {
    bool initialized;
    audio_state_t state;
    uint8_t volume;  // 0-100
    
    // I2C and codec
    i2c_master_bus_handle_t i2c_bus;
    esp_codec_dev_handle_t codec_dev;
    
    // I2S
    i2s_chan_handle_t rx_handle;
    i2s_chan_handle_t tx_handle;
    
    // Recording
    TaskHandle_t record_task_handle;
    audio_record_cb_t record_callback;
    void *record_ctx;
    SemaphoreHandle_t record_mutex;
    bool record_stop_flag;
    
    // Playback
    SemaphoreHandle_t play_mutex;
} audio_ctx = {
    .initialized = false,
    .state = AUDIO_STATE_IDLE,
    .volume = 50,  // Default 50%
    .i2c_bus = NULL,
    .codec_dev = NULL,
    .rx_handle = NULL,
    .tx_handle = NULL,
    .record_task_handle = NULL,
    .record_callback = NULL,
    .record_ctx = NULL,
    .record_mutex = NULL,
    .record_stop_flag = false,
    .play_mutex = NULL,
};

/**
 * Recording task
 * Reads from I2S DMA and calls the callback
 */
static void record_task(void *arg) {
    ESP_LOGI(TAG, "Recording task started");
    
    int16_t *buffer = (int16_t *)heap_caps_malloc(DMA_BUF_LEN, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (buffer == NULL) {
        ESP_LOGE(TAG, "Failed to allocate recording buffer");
        audio_ctx.state = AUDIO_STATE_IDLE;
        audio_ctx.record_task_handle = NULL;
        vTaskDelete(NULL);
        return;
    }
    
    size_t bytes_read = 0;
    audio_ctx.record_stop_flag = false;
    
    while (!audio_ctx.record_stop_flag) {
        // Use timeout to allow periodic check of stop flag
        esp_err_t ret = i2s_channel_read(audio_ctx.rx_handle, buffer, DMA_BUF_LEN, &bytes_read, pdMS_TO_TICKS(100));
        
        if (ret == ESP_ERR_TIMEOUT) {
            // Timeout is OK - just check stop flag and continue
            continue;
        } else if (ret != ESP_OK) {
            ESP_LOGE(TAG, "I2S read error: %s", esp_err_to_name(ret));
            break;
        }
        
        if (bytes_read > 0 && audio_ctx.record_callback) {
            size_t samples = bytes_read / sizeof(int16_t);
            audio_ctx.record_callback(buffer, samples, audio_ctx.record_ctx);
        }
    }
    
    heap_caps_free(buffer);
    ESP_LOGI(TAG, "Recording task stopped");
    audio_ctx.state = AUDIO_STATE_IDLE;
    audio_ctx.record_task_handle = NULL;
    vTaskDelete(NULL);
}

/**
 * Initialize ES8311 codec via esp_codec_dev
 * 
 * IMPORTANT: I2C bus must be initialized BEFORE calling this function.
 * The bus handle must be valid and the port number must match I2C_PORT_NUM.
 */
static esp_err_t init_es8311_codec(void) {
    ESP_LOGI(TAG, "Initializing ES8311 codec");
    
    // Validate I2C bus handle
    if (audio_ctx.i2c_bus == NULL) {
        ESP_LOGE(TAG, "I2C bus handle is NULL - bus must be initialized first");
        return ESP_ERR_INVALID_STATE;
    }
    
    // Create I2C control interface for ES8311
    // CRITICAL: Port number MUST match the port used when creating the I2C bus
    // This ensures zero bus conflicts - the bus handle and port must be consistent
    // For ESP32-S3-Touch-LCD-3.5B, the I2C port is always I2C_NUM_0
    audio_codec_i2c_cfg_t i2c_cfg = {
        .port = I2C_NUM_0,  // Must match the port used in i2c_new_master_bus() (always I2C_NUM_0 for this board)
        .addr = ES8311_I2C_ADDR,
        .bus_handle = audio_ctx.i2c_bus,  // Shared bus handle from BSP/main
    };
    
    // Verify I2C address doesn't conflict with other devices
    // ES8311 at 0x18 should not conflict with:
    // - AXP2101 at 0x34
    // - QMI8658 at 0x6B
    // - PCF85063 at 0x51
    // - MCP23017 at 0x20
    // - Touch at 0x3B
    
    const audio_codec_ctrl_if_t *ctrl_if = audio_codec_new_i2c_ctrl(&i2c_cfg);
    if (ctrl_if == NULL) {
        ESP_LOGE(TAG, "Failed to create I2C control interface - possible bus conflict");
        return ESP_FAIL;
    }
    
    // Create GPIO interface
    const audio_codec_gpio_if_t *gpio_if = audio_codec_new_gpio();
    if (gpio_if == NULL) {
        ESP_LOGE(TAG, "Failed to create GPIO interface");
        return ESP_FAIL;
    }
    
    // Create I2S data interface
    audio_codec_i2s_cfg_t i2s_cfg = {
        .port = I2S_NUM_0,
        .rx_handle = audio_ctx.rx_handle,
        .tx_handle = audio_ctx.tx_handle,
    };
    const audio_codec_data_if_t *data_if = audio_codec_new_i2s_data(&i2s_cfg);
    if (data_if == NULL) {
        ESP_LOGE(TAG, "Failed to create I2S data interface");
        return ESP_FAIL;
    }
    
    // Configure ES8311 codec
    es8311_codec_cfg_t es8311_cfg = {
        .ctrl_if = ctrl_if,
        .gpio_if = gpio_if,
        .codec_mode = ESP_CODEC_DEV_WORK_MODE_BOTH,  // Both input and output
        .master_mode = false,  // ES8311 in slave mode
        .use_mclk = true,  // Use MCLK pin
        .pa_pin = GPIO_NUM_NC,  // No PA control pin
        .pa_reverted = false,
        .hw_gain = {
            .pa_voltage = 5.0,  // PA voltage (if used)
            .codec_dac_voltage = 3.3,  // Codec DAC voltage
        },
        .mclk_div = MCLK_MULTIPLIER,  // MCLK = sample_rate * 256
    };
    
    // Create ES8311 codec interface
    const audio_codec_if_t *es8311_if = es8311_codec_new(&es8311_cfg);
    if (es8311_if == NULL) {
        ESP_LOGE(TAG, "Failed to create ES8311 codec interface");
        return ESP_FAIL;
    }
    
    // Create codec device
    esp_codec_dev_cfg_t dev_cfg = {
        .dev_type = ESP_CODEC_DEV_TYPE_IN_OUT,
        .codec_if = es8311_if,
        .data_if = data_if,
    };
    audio_ctx.codec_dev = esp_codec_dev_new(&dev_cfg);
    if (audio_ctx.codec_dev == NULL) {
        ESP_LOGE(TAG, "Failed to create codec device");
        return ESP_FAIL;
    }
    
    // Configure codec: 16kHz, 16-bit, mono, mic gain 24dB
    esp_codec_dev_sample_info_t fs = {
        .bits_per_sample = BITS_PER_SAMPLE,
        .channel = CHANNELS,
        .sample_rate = SAMPLE_RATE_HZ,
        .channel_mask = 0x01,  // Mono: left channel only
    };
    
    esp_err_t ret = esp_codec_dev_open(audio_ctx.codec_dev, &fs);
    if (ret != ESP_CODEC_DEV_OK) {
        ESP_LOGE(TAG, "Failed to open codec device: %d", ret);
        return ESP_FAIL;
    }
    
    ret = esp_codec_dev_set_in_gain(audio_ctx.codec_dev, 24.0f);  // 24dB mic gain
    if (ret != ESP_CODEC_DEV_OK) {
        ESP_LOGW(TAG, "Failed to set input gain: %d", ret);
    }
    
    ESP_LOGI(TAG, "ES8311 codec initialized (16kHz, 16-bit, mono, mic gain 24dB)");
    return ESP_OK;
}

/**
 * Initialize I2S driver
 */
static esp_err_t init_i2s(void) {
    ESP_LOGI(TAG, "Initializing I2S driver");
    
    // I2S standard channel configuration
    i2s_std_config_t std_cfg = {
        .clk_cfg = {
            .sample_rate_hz = SAMPLE_RATE_HZ,
            .clk_src = I2S_CLK_SRC_DEFAULT,
            .mclk_multiple = I2S_MCLK_MULTIPLE_256,  // MCLK = sample_rate * 256
        },
        .slot_cfg = {
            .data_bit_width = I2S_DATA_BIT_WIDTH_16BIT,
            .slot_bit_width = I2S_SLOT_BIT_WIDTH_16BIT,
            .slot_mode = I2S_SLOT_MODE_MONO,
            .slot_mask = I2S_STD_SLOT_LEFT,  // Mono uses left channel
            .ws_width = I2S_DATA_BIT_WIDTH_16BIT,
            .ws_pol = false,
            .bit_shift = false,
        },
        .gpio_cfg = {
            .mclk = I2S_MCLK,
            .bclk = I2S_BCLK,
            .ws = I2S_LRCK,
            .dout = I2S_DOUT,
            .din = I2S_DIN,
            .invert_flags = {
                .mclk_inv = false,
                .bclk_inv = false,
                .ws_inv = false,
            },
        },
    };
    
    // Allocate RX channel
    i2s_chan_config_t rx_chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
    rx_chan_cfg.dma_desc_num = DMA_BUF_COUNT;
    rx_chan_cfg.dma_frame_num = DMA_BUF_LEN / sizeof(int16_t);
    
    esp_err_t ret = i2s_new_channel(&rx_chan_cfg, NULL, &audio_ctx.rx_handle);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to create I2S RX channel: %s", esp_err_to_name(ret));
        return ret;
    }
    
    ret = i2s_channel_init_std_mode(audio_ctx.rx_handle, &std_cfg);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to init I2S RX channel: %s", esp_err_to_name(ret));
        return ret;
    }
    
    // Allocate TX channel
    i2s_chan_config_t tx_chan_cfg = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
    tx_chan_cfg.dma_desc_num = DMA_BUF_COUNT;
    tx_chan_cfg.dma_frame_num = DMA_BUF_LEN / sizeof(int16_t);
    
    ret = i2s_new_channel(&tx_chan_cfg, &audio_ctx.tx_handle, NULL);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to create I2S TX channel: %s", esp_err_to_name(ret));
        return ret;
    }
    
    ret = i2s_channel_init_std_mode(audio_ctx.tx_handle, &std_cfg);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to init I2S TX channel: %s", esp_err_to_name(ret));
        return ret;
    }
    
    ESP_LOGI(TAG, "I2S driver initialized (MCLK=%d, BCLK=%d, LRCK=%d, DOUT=%d, DIN=%d)",
             I2S_MCLK, I2S_BCLK, I2S_LRCK, I2S_DOUT, I2S_DIN);
    return ESP_OK;
}

esp_err_t audio_engine_init(i2c_master_bus_handle_t i2c_bus) {
    if (audio_ctx.initialized) {
        ESP_LOGW(TAG, "Audio engine already initialized");
        return ESP_OK;
    }
    
    // Validate I2C bus handle - CRITICAL for zero bus conflicts
    if (i2c_bus == NULL) {
        ESP_LOGE(TAG, "I2C bus handle is NULL - bus must be initialized first");
        return ESP_ERR_INVALID_ARG;
    }
    
    // Store bus handle - this is the shared bus used by all I2C devices
    // The bus should be created once (in BSP or main) and shared across components
    audio_ctx.i2c_bus = i2c_bus;
    audio_ctx.state = AUDIO_STATE_IDLE;
    
    ESP_LOGI(TAG, "Audio engine using shared I2C bus (port=I2C_NUM_0, ES8311 addr=0x%02X)", 
             ES8311_I2C_ADDR);
    
    // Create mutexes
    audio_ctx.record_mutex = xSemaphoreCreateMutex();
    audio_ctx.play_mutex = xSemaphoreCreateMutex();
    if (audio_ctx.record_mutex == NULL || audio_ctx.play_mutex == NULL) {
        ESP_LOGE(TAG, "Failed to create mutexes");
        return ESP_ERR_NO_MEM;
    }
    
    // Initialize I2S first (needed by codec)
    esp_err_t ret = init_i2s();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "I2S init failed");
        return ret;
    }
    
    // Initialize ES8311 codec
    ret = init_es8311_codec();
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "ES8311 codec init failed");
        return ret;
    }
    
    // Set initial volume
    audio_engine_set_volume(audio_ctx.volume);
    
    audio_ctx.initialized = true;
    ESP_LOGI(TAG, "Audio engine initialized");
    return ESP_OK;
}

esp_err_t audio_engine_deinit(void) {
    if (!audio_ctx.initialized) {
        return ESP_OK;
    }
    
    // Stop recording if active
    if (audio_ctx.state == AUDIO_STATE_RECORDING || audio_ctx.state == AUDIO_STATE_STREAMING) {
        audio_engine_record_stop();
    }
    
    // Stop playback if active
    if (audio_ctx.state == AUDIO_STATE_PLAYING) {
        i2s_channel_disable(audio_ctx.tx_handle);
    }
    
    // Wait for tasks to finish
    vTaskDelay(pdMS_TO_TICKS(100));
    
    // Cleanup codec
    if (audio_ctx.codec_dev) {
        esp_codec_dev_close(audio_ctx.codec_dev);
        esp_codec_dev_delete(audio_ctx.codec_dev);
        audio_ctx.codec_dev = NULL;
    }
    
    // Cleanup I2S channels
    if (audio_ctx.rx_handle) {
        i2s_channel_disable(audio_ctx.rx_handle);
        i2s_del_channel(audio_ctx.rx_handle);
        audio_ctx.rx_handle = NULL;
    }
    
    if (audio_ctx.tx_handle) {
        i2s_channel_disable(audio_ctx.tx_handle);
        i2s_del_channel(audio_ctx.tx_handle);
        audio_ctx.tx_handle = NULL;
    }
    
    // Cleanup mutexes
    if (audio_ctx.record_mutex) {
        vSemaphoreDelete(audio_ctx.record_mutex);
        audio_ctx.record_mutex = NULL;
    }
    
    if (audio_ctx.play_mutex) {
        vSemaphoreDelete(audio_ctx.play_mutex);
        audio_ctx.play_mutex = NULL;
    }
    
    audio_ctx.initialized = false;
    audio_ctx.state = AUDIO_STATE_IDLE;
    ESP_LOGI(TAG, "Audio engine deinitialized");
    return ESP_OK;
}

esp_err_t audio_engine_record_start(audio_record_cb_t callback, void *ctx) {
    if (!audio_ctx.initialized) {
        ESP_LOGE(TAG, "Audio engine not initialized");
        return ESP_ERR_INVALID_STATE;
    }
    
    if (xSemaphoreTake(audio_ctx.record_mutex, pdMS_TO_TICKS(1000)) != pdTRUE) {
        ESP_LOGE(TAG, "Failed to take record mutex");
        return ESP_ERR_TIMEOUT;
    }
    
    if (audio_ctx.state == AUDIO_STATE_RECORDING || audio_ctx.state == AUDIO_STATE_STREAMING) {
        xSemaphoreGive(audio_ctx.record_mutex);
        ESP_LOGW(TAG, "Recording already in progress");
        return ESP_ERR_INVALID_STATE;
    }
    
    audio_ctx.record_callback = callback;
    audio_ctx.record_ctx = ctx;
    
    // Enable I2S RX channel
    esp_err_t ret = i2s_channel_enable(audio_ctx.rx_handle);
    if (ret != ESP_OK) {
        xSemaphoreGive(audio_ctx.record_mutex);
        ESP_LOGE(TAG, "Failed to enable I2S RX: %s", esp_err_to_name(ret));
        return ret;
    }
    
    // Start recording task
    audio_ctx.state = (callback != NULL) ? AUDIO_STATE_STREAMING : AUDIO_STATE_RECORDING;
    xTaskCreate(record_task, "audio_record", 4096, NULL, 5, &audio_ctx.record_task_handle);
    
    xSemaphoreGive(audio_ctx.record_mutex);
    ESP_LOGI(TAG, "Recording started");
    return ESP_OK;
}

esp_err_t audio_engine_record_stop(void) {
    if (!audio_ctx.initialized) {
        return ESP_OK;
    }
    
    if (xSemaphoreTake(audio_ctx.record_mutex, pdMS_TO_TICKS(1000)) != pdTRUE) {
        return ESP_ERR_TIMEOUT;
    }
    
    if (audio_ctx.state != AUDIO_STATE_RECORDING && audio_ctx.state != AUDIO_STATE_STREAMING) {
        xSemaphoreGive(audio_ctx.record_mutex);
        return ESP_OK;
    }
    
    // Signal stop
    audio_ctx.record_stop_flag = true;
    
    // Wait for task to finish
    if (audio_ctx.record_task_handle != NULL) {
        xSemaphoreGive(audio_ctx.record_mutex);
        vTaskDelay(pdMS_TO_TICKS(100));
        xSemaphoreTake(audio_ctx.record_mutex, pdMS_TO_TICKS(1000));
    }
    
    // Disable I2S RX
    i2s_channel_disable(audio_ctx.rx_handle);
    
    audio_ctx.state = AUDIO_STATE_IDLE;
    audio_ctx.record_callback = NULL;
    audio_ctx.record_ctx = NULL;
    
    xSemaphoreGive(audio_ctx.record_mutex);
    ESP_LOGI(TAG, "Recording stopped");
    return ESP_OK;
}

esp_err_t audio_engine_record_to_buffer(int16_t **out_buf, size_t *out_samples, uint32_t max_seconds) {
    if (!audio_ctx.initialized || out_buf == NULL || out_samples == NULL) {
        return ESP_ERR_INVALID_ARG;
    }
    
    // Calculate buffer size (16kHz, 16-bit mono)
    size_t max_samples = SAMPLE_RATE_HZ * max_seconds;
    size_t buf_size = max_samples * sizeof(int16_t);
    
    // Allocate buffer in PSRAM
    int16_t *buffer = (int16_t *)heap_caps_malloc(buf_size, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (buffer == NULL) {
        ESP_LOGE(TAG, "Failed to allocate recording buffer");
        return ESP_ERR_NO_MEM;
    }
    
    // Enable I2S RX
    esp_err_t ret = i2s_channel_enable(audio_ctx.rx_handle);
    if (ret != ESP_OK) {
        heap_caps_free(buffer);
        return ret;
    }
    
    // Record samples
    size_t samples_recorded = 0;
    size_t bytes_read = 0;
    
    audio_ctx.state = AUDIO_STATE_RECORDING;
    
    while (samples_recorded < max_samples) {
        size_t to_read = (max_samples - samples_recorded) * sizeof(int16_t);
        if (to_read > DMA_BUF_LEN) {
            to_read = DMA_BUF_LEN;
        }
        
        ret = i2s_channel_read(audio_ctx.rx_handle, 
                               buffer + samples_recorded, 
                               to_read, 
                               &bytes_read, 
                               pdMS_TO_TICKS(1000));
        
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "I2S read error: %s", esp_err_to_name(ret));
            break;
        }
        
        samples_recorded += bytes_read / sizeof(int16_t);
    }
    
    // Disable I2S RX
    i2s_channel_disable(audio_ctx.rx_handle);
    audio_ctx.state = AUDIO_STATE_IDLE;
    
    *out_buf = buffer;
    *out_samples = samples_recorded;
    ESP_LOGI(TAG, "Recorded %zu samples (%.2f seconds)", samples_recorded, (float)samples_recorded / SAMPLE_RATE_HZ);
    return ESP_OK;
}

esp_err_t audio_engine_play_buffer(const int16_t *data, size_t samples) {
    if (!audio_ctx.initialized || data == NULL || samples == 0) {
        return ESP_ERR_INVALID_ARG;
    }
    
    if (xSemaphoreTake(audio_ctx.play_mutex, pdMS_TO_TICKS(1000)) != pdTRUE) {
        return ESP_ERR_TIMEOUT;
    }
    
    // Enable I2S TX
    esp_err_t ret = i2s_channel_enable(audio_ctx.tx_handle);
    if (ret != ESP_OK) {
        xSemaphoreGive(audio_ctx.play_mutex);
        ESP_LOGE(TAG, "Failed to enable I2S TX: %s", esp_err_to_name(ret));
        return ret;
    }
    
    audio_ctx.state = AUDIO_STATE_PLAYING;
    
    // Write samples
    size_t bytes_written = 0;
    size_t total_bytes = samples * sizeof(int16_t);
    const uint8_t *data_ptr = (const uint8_t *)data;
    
    while (bytes_written < total_bytes) {
        size_t to_write = total_bytes - bytes_written;
        if (to_write > DMA_BUF_LEN) {
            to_write = DMA_BUF_LEN;
        }
        
        ret = i2s_channel_write(audio_ctx.tx_handle, 
                                data_ptr + bytes_written, 
                                to_write, 
                                &bytes_written, 
                                portMAX_DELAY);
        
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "I2S write error: %s", esp_err_to_name(ret));
            break;
        }
    }
    
    // Wait for DMA to finish (ESP-IDF 5.5: wait_done not in std API; wait playback duration)
    {
        uint32_t playback_ms = (uint32_t)((samples * 1000) / SAMPLE_RATE_HZ) + 50;
        vTaskDelay(pdMS_TO_TICKS(playback_ms));
    }
    
    // Disable I2S TX
    i2s_channel_disable(audio_ctx.tx_handle);
    audio_ctx.state = AUDIO_STATE_IDLE;
    
    xSemaphoreGive(audio_ctx.play_mutex);
    ESP_LOGI(TAG, "Playback complete (%zu samples)", samples);
    return ESP_OK;
}

esp_err_t audio_engine_play_tone(uint32_t freq_hz, uint32_t duration_ms, uint8_t volume) {
    if (!audio_ctx.initialized) {
        return ESP_ERR_INVALID_STATE;
    }
    
    // Calculate number of samples
    size_t samples = (SAMPLE_RATE_HZ * duration_ms) / 1000;
    
    // Allocate buffer in PSRAM
    int16_t *buffer = (int16_t *)heap_caps_malloc(samples * sizeof(int16_t), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (buffer == NULL) {
        ESP_LOGE(TAG, "Failed to allocate tone buffer");
        return ESP_ERR_NO_MEM;
    }
    
    // Generate sine wave
    float volume_factor = (float)volume / 100.0f;
    float max_amplitude = 32767.0f * volume_factor;
    
    for (size_t i = 0; i < samples; i++) {
        float t = (float)i / SAMPLE_RATE_HZ;
        float sample = sinf(2.0f * PI * freq_hz * t);
        buffer[i] = (int16_t)(sample * max_amplitude);
    }
    
    // Play the tone
    esp_err_t ret = audio_engine_play_buffer(buffer, samples);
    
    heap_caps_free(buffer);
    return ret;
}

esp_err_t audio_engine_set_volume(uint8_t percent) {
    if (!audio_ctx.initialized) {
        return ESP_ERR_INVALID_STATE;
    }
    
    if (percent > 100) {
        percent = 100;
    }
    
    audio_ctx.volume = percent;
    
    // Set codec volume (0.0 to 1.0)
    float volume_float = (float)percent / 100.0f;
    esp_err_t ret = esp_codec_dev_set_out_vol(audio_ctx.codec_dev, volume_float);
    if (ret != ESP_CODEC_DEV_OK) {
        ESP_LOGW(TAG, "Failed to set codec volume: %d", ret);
    }
    
    ESP_LOGI(TAG, "Volume set to %d%%", percent);
    return ESP_OK;
}

uint8_t audio_engine_get_volume(void) {
    return audio_ctx.volume;
}

audio_state_t audio_engine_get_state(void) {
    return audio_ctx.state;
}
