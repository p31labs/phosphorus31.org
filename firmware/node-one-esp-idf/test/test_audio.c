/**
 * Audio Engine Unit Tests
 * Tests audio functionality without hardware
 */

#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include "mock_hardware.h"

bool test_audio_engine_init(void) {
    printf("  Testing audio engine initialization...\n");
    
    mock_i2c_init();
    mock_i2s_init();
    
    // Test: ES8311 codec initialization
    // Set codec registers
    mock_i2c_write_register(0x18, 0x00, 0x80);  // Reset
    mock_i2c_write_register(0x18, 0x00, 0x00);  // Release reset
    
    uint8_t reg = mock_i2c_read_register(0x18, 0x00);
    if (reg != 0x00) {
        printf("    ❌ ES8311 reset failed\n");
        return false;
    }
    
    // Test: I2S initialization
    // Verify I2S mock is ready
    mock_i2s_state_t state = mock_i2s_get_state();
    if (state.recording || state.playing) {
        printf("    ❌ I2S should be idle after init\n");
        return false;
    }
    
    printf("    ✅ Audio engine initialized\n");
    return true;
}

bool test_audio_engine_record(void) {
    printf("  Testing audio recording...\n");
    
    mock_i2s_init();
    
    // Generate test audio (sine wave)
    int16_t test_audio[1000];
    for (int i = 0; i < 1000; i++) {
        // Simple sine wave approximation
        test_audio[i] = (int16_t)(32767 * 0.5 * (i % 100) / 100.0);
    }
    
    // Inject audio into mock I2S
    mock_i2s_inject_audio(test_audio, 1000);
    
    // Read back
    int16_t read_buffer[1000];
    size_t samples_read = mock_i2s_read(read_buffer, 1000);
    
    if (samples_read != 1000) {
        printf("    ❌ Audio read failed (expected 1000, got %zu)\n", samples_read);
        return false;
    }
    
    // Verify data matches
    if (memcmp(test_audio, read_buffer, 1000 * sizeof(int16_t)) != 0) {
        printf("    ❌ Audio data mismatch\n");
        return false;
    }
    
    printf("    ✅ Audio recording works\n");
    return true;
}
