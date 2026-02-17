# Node One - Buffer Integration

ESP32-S3 firmware for integrating Node One with The Buffer.

## Features

- **WiFi Connection** - Connects to The Buffer API
- **Heartbeat** - Sends heartbeat every 30 seconds for object permanence
- **Message Submission** - Can submit messages to The Buffer
- **Status Monitoring** - Checks Buffer queue status
- **Whale Channel** - LoRa mesh integration (placeholder)

## Setup

1. Install required libraries:
   - WiFi (ESP32 built-in)
   - HTTPClient (ESP32 built-in)
   - ArduinoJson (install via Library Manager)

2. Configure WiFi:
   ```cpp
   const char* WIFI_SSID = "YOUR_WIFI_SSID";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   const char* BUFFER_URL = "http://192.168.1.100:4000";
   ```

3. Upload to ESP32-S3

## API Integration

### Send Heartbeat

Automatically sends heartbeat every 30 seconds:
- Node ID: `node_one`
- Signal strength: WiFi RSSI converted to percentage
- Endpoint: `POST /api/ping/heartbeat`

### Submit Message

```cpp
submitToBuffer("Hello from Node One", "normal");
```

### Get Buffer Status

```cpp
getBufferStatus();
```

## Integration with The Buffer

Node One appears in:
- Ping status (`GET /api/ping/status`)
- Mesh visualization in The Scope
- Object permanence monitoring

## Whale Channel Integration

When LoRa is implemented:
- Send heartbeat via LoRa mesh
- Receive messages from other nodes
- Relay messages through The Buffer

## The Thick Click Integration

Haptic feedback for:
- Message received
- Heartbeat sent
- Buffer connection status

---

**The Mesh Holds.** 🔺
