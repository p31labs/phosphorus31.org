# Node One - Hardware Communication API

Hardware communication protocols for Node One (ESP32-S3).

## Serial Communication

### USB Serial

Node One communicates via USB serial for programming and debugging:

```bash
# Monitor serial output
idf.py monitor

# Or use serial monitor
screen /dev/ttyUSB0 115200
```

### Message Format

```
[P31] [TIMESTAMP] [LEVEL] [MESSAGE]
```

Example:
```
[P31] [2026-02-13T12:00:00] [INFO] Node One initialized
[P31] [2026-02-13T12:00:01] [INFO] Whale Channel ready
```

## Whale Channel (LoRa)

### Configuration

- **Frequency**: 915MHz
- **Spreading Factor**: 7-12
- **Bandwidth**: 125kHz
- **Coding Rate**: 4/5

### Message Structure

```cpp
struct MeshMessage {
  uint8_t nodeId;
  uint8_t messageType;
  char payload[256];
  uint32_t timestamp;
};
```

### Send Message

```cpp
void sendToMesh(const char* message) {
  LoRa.beginPacket();
  LoRa.print(message);
  LoRa.endPacket();
}
```

### Receive Message

```cpp
void receiveFromMesh() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    String message = "";
    while (LoRa.available()) {
      message += (char)LoRa.read();
    }
    processMessage(message);
  }
}
```

## The Thick Click (Haptic)

### Haptic Feedback

```cpp
// Single click
digitalWrite(HAPTIC_PIN, HIGH);
delay(50);
digitalWrite(HAPTIC_PIN, LOW);

// Double click
for (int i = 0; i < 2; i++) {
  digitalWrite(HAPTIC_PIN, HIGH);
  delay(50);
  digitalWrite(HAPTIC_PIN, LOW);
  delay(50);
}
```

## I2C Communication

### Device Addresses

- **TCA9554**: 0x20 (GPIO expander)
- **AXP2101**: 0x34 (PMIC)
- **AXS15231B**: 0x3B (Touch controller)
- **ES8311**: 0x18 (Audio codec)
- **QMI8658**: 0x6B (IMU)
- **PCF85063**: 0x51 (RTC)

### Read from I2C

```cpp
Wire.beginTransmission(address);
Wire.write(register);
Wire.endTransmission();
Wire.requestFrom(address, 1);
uint8_t value = Wire.read();
```

## Display Communication

### QSPI Display

- **CS**: GPIO12
- **CLK**: GPIO5
- **DATA0-3**: GPIO1-4
- **Backlight**: GPIO6

### Display Update

```cpp
void updateDisplay(const char* text) {
  // QSPI display update
  // Color byte-swapping for RGB565
  display.fillScreen(BLACK);
  display.setTextColor(WHITE);
  display.println(text);
}
```

## Power Management

### AXP2101 PMIC

```cpp
// Enable ALDO1 (3.3V)
pmic.setALDO1(3300);

// Enable BLDO1 (1.5V)
pmic.setBLDO1(1500);

// Enable BLDO2 (2.8V)
pmic.setBLDO2(2800);
```

## Rotary Encoder Integration

### Volume Encoder Module

3D printable enclosure and control knob for volume/parameter adjustment with haptic feedback.

### Hardware Setup

**Required Components:**
- EC11 rotary encoder (or compatible)
- 3D printed case and knob (see [Volume Encoder Assembly](../../VolumeEncoderParts_stls/README.md))
- M3 mounting hardware

**GPIO Pin Assignment (Example):**
```cpp
#define ENCODER_CLK_PIN  10  // Clock signal (interrupt capable)
#define ENCODER_DT_PIN   11  // Data signal (interrupt capable)
#define ENCODER_SW_PIN   12  // Switch/button (optional)
```

### Firmware Integration (ESP-IDF)

The rotary encoder is fully integrated into Node One firmware:

```cpp
#include "rotary_encoder.h"
#include "pin_config.h"

// Encoder handle (global)
static rotary_encoder_handle_t encoder_handle = nullptr;

// Encoder callback - called on rotation or button press
static void encoder_callback(int direction, int32_t position, 
                            bool button_pressed, void* user_data) {
    if (button_pressed) {
        // Button press - toggle mute
        uint8_t vol = audio_engine_get_volume();
        audio_engine_set_volume(vol > 0 ? 0 : 50);
        return;
    }
    
    // Rotation - adjust volume in 5% steps
    if (direction != 0) {
        uint8_t current_vol = audio_engine_get_volume();
        int new_vol = current_vol + (direction * 5);
        if (new_vol < 0) new_vol = 0;
        if (new_vol > 100) new_vol = 100;
        audio_engine_set_volume((uint8_t)new_vol);
        
        // Haptic feedback triggered automatically on detent
    }
}

// Initialize encoder
void init_rotary_encoder(void) {
    esp_err_t ret = rotary_encoder_init(
        PIN_ENCODER_CLK,  // GPIO17
        PIN_ENCODER_DT,   // GPIO18
        PIN_ENCODER_SW,   // GPIO_NUM_NC (optional)
        &encoder_handle
    );
    
    if (ret == ESP_OK) {
        rotary_encoder_register_callback(encoder_handle, 
                                        encoder_callback, 
                                        nullptr);
    }
}
```

**GPIO Pin Assignment:**
- `PIN_ENCODER_CLK` = GPIO17 (Clock signal, interrupt capable)
- `PIN_ENCODER_DT` = GPIO18 (Data signal, interrupt capable)
- `PIN_ENCODER_SW` = GPIO_NUM_NC (Button optional, not used by default)

**Features:**
- Half-quadrature decoding (interrupt-based)
- Automatic debouncing
- Volume control with 5% steps
- Button press detection (mute toggle)
- Integrated with audio engine
- Ready for haptic feedback integration

### Integration with Haptic Feedback

The Volume Encoder works with DRV2605L haptic driver to provide tactile feedback:

```cpp
void onEncoderDetent() {
  // Trigger haptic feedback on each detent click
  hapticDriver.setWaveform(0, 83);  // Strong click
  hapticDriver.go();
}
```

### 3D Printable Parts

- **Location:** `VolumeEncoderParts_stls/`
- **Assembly Guide:** [Volume Encoder README](../../VolumeEncoderParts_stls/README.md)
- **3D Printing Guide:** [Hardware 3D Printing Guide](../hardware/3d-printing-guide.md)

**Parts:**
- Case Bottom (`obj_1_CaseBottom.stl`) — Base enclosure
- Rotating Knob (`obj_2_RotatingKnob.stl`) — Tactile control interface
- Full Assembly Reference (`obj_3_Assembly.stl`) — Visualization model

**License:** CC BY-SA 4.0 (open source hardware)

## Documentation

- [Node One](../node-one.md)
- [Whale Channel](../whale-channel.md)
- [The Thick Click](../thick-click.md)
- [3D Printing Guide](../hardware/3d-printing-guide.md)
- [Phenix Hardware Overview](../PHENIX_HARDWARE.md)

💜 With love and light. As above, so below. 💜
