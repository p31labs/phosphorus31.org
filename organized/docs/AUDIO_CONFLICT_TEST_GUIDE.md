# 🔬 AUDIO CONFLICT TESTING GUIDE

## 🎯 **YOUR INSIGHT: AUDIO CODEC MAY BE CAUSING I2C CONFLICTS**

You're absolutely right to suspect the audio system! The ES8311 codec shares the same I2C bus (I2C_NUM_0) as your PMIC and IO Expander. If it's not properly initialized, it can:

1. ⚠️ Pull down SDA/SCL lines
2. ⚠️ ACK addresses it shouldn't
3. ⚠️ Be in a bad power state causing electrical issues
4. ⚠️ Interfere with display initialization

---

## 📦 **TWO VERSIONS PROVIDED**

I've created **two test versions** to isolate the problem:

### **Version 1.1: ES8311 Actively Reset/Muted**
**File:** `phenix_unified_fixed_v1.1.cpp`

**What it does:**
- Sends I2C commands to ES8311 (address 0x18)
- Puts codec into reset mode
- Powers down DAC (speaker output)
- Mutes all outputs
- **INMP441 mic still available** (doesn't need I2C)

**Code:**
```cpp
// Register 0x00: Chip Reset
i2c_write_reg(I2C_NUM, AUDIO_I2C_ADDR, 0x00, 0x1F);  // Reset

// Register 0x01: Chip Power Management
i2c_write_reg(I2C_NUM, AUDIO_I2C_ADDR, 0x01, 0x30);  // Power down DAC

// Register 0x02: Chip Clock Management
i2c_write_reg(I2C_NUM, AUDIO_I2C_ADDR, 0x02, 0x00);  // Disable clocks

// Register 0x03: System Control
i2c_write_reg(I2C_NUM, AUDIO_I2C_ADDR, 0x03, 0x00);  // Mute all outputs
```

---

### **Version 1.2: ES8311 Completely Ignored**
**File:** `phenix_unified_audio_disabled_v1.2.cpp`

**What it does:**
- **NO I2C writes** to ES8311 at all
- Codec left in whatever state it powers on in
- Most conservative test approach
- **INMP441 mic still available** (pure I2S, no I2C needed)

**Code:**
```cpp
static void init_audio(void) {
    ESP_LOGI(TAG, "[8/9] AUDIO: **COMPLETELY SKIPPED**");
    ESP_LOGI(TAG, "      ES8311 codec: NO I2C WRITES");
    // ... no I2C operations
}
```

---

## 🧪 **TESTING PROTOCOL**

### **Test 1: Version 1.2 (No Audio I2C)**
**This is the safest test - start here**

1. Replace your file:
```powershell
copy phenix_unified_audio_disabled_v1.2.cpp C:\67\phenix_phantom\main\phenix_unified.cpp
```

2. Build & flash:
```powershell
c:\69\PHENIX\auto_build_flash.bat COM6
```

3. **Observe:**
   - Does display show solid colors?
   - Does static disappear?
   - Check serial logs for I2C errors

**If display works:** Audio codec WAS the problem!
**If static persists:** Audio codec is NOT the problem.

---

### **Test 2: Version 1.1 (Reset Audio Codec)**
**Only if Test 1 succeeds**

1. Replace your file:
```powershell
copy phenix_unified_fixed_v1.1.cpp C:\67\phenix_phantom\main\phenix_unified.cpp
```

2. Build & flash

3. **Observe:**
   - Does display still work with codec reset?
   - Any difference from Test 1?

---

## 🎤 **MIC-ONLY MODE (INMP441)**

**Good news:** The INMP441 microphone **does NOT use I2C** - it's pure I2S!

**To use mic without speaker:**
1. Use either version (both keep speaker disabled)
2. Configure I2S for input only:

```cpp
// INMP441 Configuration (I2S INPUT ONLY)
i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),  // RX only, no TX
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,  // Mono mic
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 4,
    .dma_buf_len = 1024,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
};

i2s_pin_config_t pin_config = {
    .bck_io_num = AUDIO_I2S_BCK,    // GPIO 40
    .ws_io_num = AUDIO_I2S_WS,      // GPIO 41
    .data_out_num = I2S_PIN_NO_CHANGE,  // No speaker output
    .data_in_num = AUDIO_I2S_DIN    // GPIO 38 (mic input)
};

i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
i2s_set_pin(I2S_NUM_0, &pin_config);
```

**This gives you:**
- ✅ Microphone input (INMP441)
- ✅ No speaker output (ES8311 disabled)
- ✅ No I2C conflicts
- ✅ Can record audio, send via LoRa mesh

---

## 📊 **EXPECTED RESULTS**

### **If Audio Was The Problem:**
**Before (with audio init):**
- 🔴 Colorful static on display
- 🔴 I2C bus conflicts
- 🔴 Display commands failing

**After (audio disabled):**
- ✅ Solid color fills
- ✅ No static
- ✅ Clean display operation
- ✅ Mic still works (I2S only)

---

## 🔍 **WHAT TO CHECK IN SERIAL LOGS**

Look for these patterns:

### **Good Signs:**
```
[RESET] Performing hardware reset via IO expander...
      Hardware reset complete.
[4/9] LCD: Sending AXS15231B QSPI init sequence...
      QSPI Mode Enabled (0xC4 = 0x80)
[FILL] Filling screen with color 0xF800...
      Allocated 4096-byte DMA buffer
      Progress: 25%
      Progress: 50%
      Progress: 75%
      Progress: 100%
      Fill complete (sent 153600 pixels).
```

### **Bad Signs:**
```
E (xxx) i2c: i2c_master_cmd_begin(xxx): i2c bus busy
E (xxx) i2c: i2c_master_cmd_begin(xxx): i2c timeout
```

---

## 💡 **WHY AUDIO CODEC COULD CAUSE DISPLAY ISSUES**

### **Shared I2C Bus:**
```
I2C_NUM_0 (SDA=GPIO8, SCL=GPIO7)
├── PMIC (0x34)           ← Powers display
├── IO Expander (0x20)    ← Resets display, controls backlight
└── ES8311 Codec (0x18)   ← Audio - COULD INTERFERE!
```

### **Problem Scenarios:**
1. **ES8311 in bad power state** → Pulls SDA/SCL low
2. **ES8311 clock issues** → Stretches I2C clock
3. **ES8311 ACKs wrong addresses** → I2C protocol corruption
4. **ES8311 holds bus** → PMIC/Expander commands fail

### **Why This Causes Static:**
- Display init commands get corrupted
- Window addresses set incorrectly
- Pixel data goes to wrong memory location
- Result: Random "colorful static"

---

## 🚀 **NEXT STEPS**

1. ✅ **Flash Version 1.2** (audio completely disabled)
2. 📷 **Take photo** of display
3. 📝 **Copy serial log** to file
4. 📣 **Report results**

If display works with audio disabled, we've found the culprit! Then we can properly configure ES8311 in standby mode and add mic-only I2S support.

---

## 🎤 **BONUS: Full Mic-Only Example**

If you want to implement microphone recording right away:

```cpp
// In init_audio():
void init_audio_mic_only(void) {
    ESP_LOGI(TAG, "[8/9] AUDIO: Configuring MIC ONLY (INMP441)...");
    
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
        .sample_rate = 16000,
        .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
        .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
        .communication_format = I2S_COMM_FORMAT_I2S,
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 4,
        .dma_buf_len = 1024,
        .use_apll = false,
        .tx_desc_auto_clear = false,
        .fixed_mclk = 0
    };
    
    i2s_pin_config_t pin_config = {
        .bck_io_num = 40,               // AUDIO_I2S_BCK
        .ws_io_num = 41,                // AUDIO_I2S_WS
        .data_out_num = I2S_PIN_NO_CHANGE,  // No speaker
        .data_in_num = 38               // AUDIO_I2S_DIN (mic)
    };
    
    ESP_ERROR_CHECK(i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL));
    ESP_ERROR_CHECK(i2s_set_pin(I2S_NUM_0, &pin_config));
    
    ESP_LOGI(TAG, "      INMP441 mic ready (16kHz, mono)");
    ESP_LOGI(TAG, "      ES8311 speaker: DISABLED");
}

// To read from mic:
void read_mic_samples(int32_t *samples, size_t count) {
    size_t bytes_read;
    i2s_read(I2S_NUM_0, samples, count * sizeof(int32_t), &bytes_read, portMAX_DELAY);
}
```

---

**Test Version 1.2 first and report back!** 🔬
