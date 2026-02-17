# Whale Channel Driver

**P31 Naming**: "Whale Channel" is the mesh layer (heritage name from submarines + whales)  
**Technical**: RadioLib-based driver for the Ebyte E22-900M30S LoRa module (SX1262 + YP2233W PA)

The mesh layer uses LoRa radio technology, but the component name follows P31 naming conventions.

## Hardware

- **Module**: Ebyte E22-900M30S
- **Chip**: SX1262 with external YP2233W PA
- **Frequency**: 915 MHz ISM band
- **Max Power**: 30 dBm (22 dBm from SX1262 + ~8 dB PA gain)
- **SPI**: Mode 0, 10 MHz max clock
- **TCXO**: 1.8V on DIO3
- **RF Switch**: Controlled via TXEN/RXEN pins

### Pin Configuration

From `pin_config.h`:
- **SPI**: SCK=GPIO41, MOSI=GPIO42, MISO=GPIO39, NSS=GPIO40
- **Control**: BUSY=GPIO21, DIO1=GPIO38, NRST=GPIO45
- **RF Switch**: TXEN=GPIO47, RXEN=GPIO48

### Power Requirements

- **VCC**: 5V for full 30 dBm output (3.3V works at reduced power)
- **TX Current**: ~650 mA peak
- **Decoupling**: Requires 100 µF+ bulk capacitor

## API

### Initialization

```c
esp_err_t whale_channel_init(void);  // P31 naming
// Backward compatibility: lora_radio_init() also available
```

Initializes Whale Channel (LoRa radio) with E22-900M30S-specific settings:
- TCXO at 1.8V
- DC-DC regulator mode
- RF switch pins configured
- Current limit set to 140 mA
- Continuous receive mode started

### Transmission

```c
esp_err_t lora_radio_send(const uint8_t *data, size_t len);
```

Sends a packet (blocking, thread-safe). Maximum packet size: 255 bytes.

### Reception

```c
typedef void (*lora_rx_cb_t)(const lora_packet_t *packet, void *ctx);

esp_err_t lora_radio_start_receive(lora_rx_cb_t callback, void *ctx);
esp_err_t lora_radio_stop_receive(void);
```

Start continuous receive mode with callback. The callback receives:
- `packet->data`: Packet payload (must be copied if needed, freed by driver)
- `packet->len`: Packet length
- `packet->rssi`: Received signal strength (dBm)
- `packet->snr`: Signal-to-noise ratio (dB)

### Configuration

```c
esp_err_t lora_radio_set_frequency(float freq_mhz);
esp_err_t lora_radio_set_power(int8_t dbm);  // Max 22 dBm (PA adds ~8 dB)
int lora_radio_get_rssi(void);
```

### Power Management

```c
esp_err_t lora_radio_sleep(void);
esp_err_t lora_radio_deinit(void);
```

## Usage Example

```c
#include "lora_radio.h"

// RX callback
void on_packet_received(const lora_packet_t *packet, void *ctx) {
    ESP_LOGI("app", "RX: %zu bytes, RSSI=%d dBm, SNR=%.1f dB",
             packet->len, packet->rssi, packet->snr);
    
    // Copy data if needed (driver will free it)
    uint8_t *my_copy = malloc(packet->len);
    memcpy(my_copy, packet->data, packet->len);
    // ... process my_copy ...
    free(my_copy);
}

void app_main(void) {
    // Initialize
    esp_err_t ret = lora_radio_init();
    if (ret != ESP_OK) {
        ESP_LOGE("app", "LoRa init failed");
        return;
    }

    // Start receiving
    lora_radio_start_receive(on_packet_received, NULL);

    // Send a packet
    uint8_t data[] = "Hello, LoRa!";
    lora_radio_send(data, sizeof(data) - 1);

    // ... application code ...
}
```

## Implementation Details

### EspHal Class

Custom RadioLib HAL implementation that bridges to ESP-IDF:
- SPI operations with BUSY pin checking (critical for E22-900M30S)
- GPIO operations
- Timing functions
- Interrupt handling
- RF switch control

### RX Task

FreeRTOS task that:
- Waits for DIO1 interrupts (packet received or TX done)
- Reads packets from radio
- Calls registered callback
- Automatically restarts receive mode

### Thread Safety

- TX operations protected by mutex
- RX operations handled in dedicated task
- Callbacks called from RX task context

## Error Handling

All functions return `esp_err_t`:
- `ESP_OK`: Success
- `ESP_ERR_INVALID_STATE`: Radio not initialized
- `ESP_ERR_INVALID_ARG`: Invalid parameters
- `ESP_ERR_NO_MEM`: Memory allocation failed
- `ESP_FAIL`: RadioLib operation failed
- `ESP_ERR_TIMEOUT`: Operation timeout

## Dependencies

- RadioLib ^7.2.1 (via component manager)
- ESP-IDF SPI master driver
- ESP-IDF GPIO driver
- FreeRTOS

## Notes

- **BUSY Pin**: Driver automatically waits for BUSY pin LOW before every SPI command
- **PA Control**: RF switch automatically controlled via TXEN/RXEN pins
- **Memory**: RX callback must copy packet data if it needs to persist
- **Power**: For full 30 dBm output, ensure 5V supply with proper decoupling
