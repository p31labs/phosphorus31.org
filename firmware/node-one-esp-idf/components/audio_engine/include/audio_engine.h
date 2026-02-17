/**
 * Audio Engine - Voice-First Audio I/O
 * P31 Ecosystem - Node One
 * ES8311 Codec + I2S Driver
 * 
 * Primary I/O for Node One. Voice-first means audio is the primary interface.
 * The voice is the signal. The mesh carries it.
 */

#ifndef AUDIO_ENGINE_H
#define AUDIO_ENGINE_H

#include "esp_err.h"
#include "driver/i2c_master.h"
#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Audio engine state
 */
typedef enum {
    AUDIO_STATE_IDLE,
    AUDIO_STATE_RECORDING,
    AUDIO_STATE_PLAYING,
    AUDIO_STATE_STREAMING,
} audio_state_t;

/**
 * Recording callback function type
 * Called with audio data chunks during recording
 * 
 * @param data Pointer to 16-bit signed PCM samples
 * @param samples Number of samples in the buffer
 * @param ctx User context pointer
 */
typedef void (*audio_record_cb_t)(const int16_t *data, size_t samples, void *ctx);

/**
 * Initialize the audio engine
 * 
 * CRITICAL: The I2C bus must be initialized BEFORE calling this function.
 * The bus handle must be from a single shared I2C bus instance (typically
 * from BSP or main.cpp). This ensures zero bus conflicts.
 * 
 * The audio engine uses ES8311 at I2C address 0x18 on the shared bus.
 * Other devices on the same bus:
 * - AXP2101 (PMIC) at 0x34
 * - QMI8658 (IMU) at 0x6B
 * - PCF85063 (RTC) at 0x51
 * - MCP23017 (GPIO) at 0x20
 * - Touch controller at 0x3B
 * 
 * @param i2c_bus I2C master bus handle (from BSP or main - must be initialized first)
 * @return ESP_OK on success, ESP_ERR_INVALID_ARG if bus is NULL
 */
esp_err_t audio_engine_init(i2c_master_bus_handle_t i2c_bus);

/**
 * Deinitialize the audio engine
 * 
 * @return ESP_OK on success
 */
esp_err_t audio_engine_deinit(void);

/**
 * Start recording with callback
 * Launches a FreeRTOS task that reads from I2S and calls the callback
 * 
 * @param callback Function to call with each audio chunk
 * @param ctx User context passed to callback
 * @return ESP_OK on success
 */
esp_err_t audio_engine_record_start(audio_record_cb_t callback, void *ctx);

/**
 * Stop recording
 * 
 * @return ESP_OK on success
 */
esp_err_t audio_engine_record_stop(void);

/**
 * Record audio to a buffer (blocking)
 * Allocates a buffer in PSRAM and records for the specified duration
 * 
 * @param out_buf Pointer to receive the allocated buffer (caller must free)
 * @param out_samples Pointer to receive the number of samples recorded
 * @param max_seconds Maximum recording duration in seconds
 * @return ESP_OK on success
 */
esp_err_t audio_engine_record_to_buffer(int16_t **out_buf, size_t *out_samples, uint32_t max_seconds);

/**
 * Play audio from a buffer
 * 
 * @param data Pointer to 16-bit signed PCM samples
 * @param samples Number of samples to play
 * @return ESP_OK on success
 */
esp_err_t audio_engine_play_buffer(const int16_t *data, size_t samples);

/**
 * Play a tone (sine wave)
 * 
 * @param freq_hz Frequency in Hz
 * @param duration_ms Duration in milliseconds
 * @param volume Volume level (0-100)
 * @return ESP_OK on success
 */
esp_err_t audio_engine_play_tone(uint32_t freq_hz, uint32_t duration_ms, uint8_t volume);

/**
 * Set volume level
 * 
 * @param percent Volume percentage (0-100)
 * @return ESP_OK on success
 */
esp_err_t audio_engine_set_volume(uint8_t percent);

/**
 * Get current volume level
 * 
 * @return Volume percentage (0-100)
 */
uint8_t audio_engine_get_volume(void);

/**
 * Get current audio engine state
 * 
 * @return Current state
 */
audio_state_t audio_engine_get_state(void);

#ifdef __cplusplus
}
#endif

#endif // AUDIO_ENGINE_H
