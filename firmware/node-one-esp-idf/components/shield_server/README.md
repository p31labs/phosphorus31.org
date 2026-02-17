# Shield Server Component

WiFi AP + HTTP Server for The Buffer Web App

**Note:** Component name "shield_server" kept for compatibility. User-facing references use "The Buffer" (P31 naming).

## Features

- **WiFi Access Point**: SSID "P31-NodeOne", password "p31mesh"
- **HTTP Server**: Serves static files from SPIFFS at `/spiffs/web/`
- **REST API**: Full device control via HTTP endpoints
- **WebSocket**: Real-time event streaming to web clients
- **Message Storage**: Ring buffer for up to 50 LoRa messages

## API Endpoints

### Status
- `GET /api/status` - Device status (battery, WiFi clients, LoRa, audio, spoons, uptime)

### Audio Control
- `POST /api/audio/record` - Start audio recording
- `POST /api/audio/stop` - Stop recording
- `POST /api/audio/play` - Play audio (PCM data or message_id)

### Messages
- `GET /api/messages` - List all received LoRa messages
- `POST /api/lora/send` - Send LoRa message (text or base64 data)

### The Buffer
- `POST /api/shield/filter` - Filter text through The Buffer

### Spoons/Energy
- `GET /api/spoons` - Get current spoons state
- `POST /api/spoons/set` - Set spoons count

### WebSocket
- `WS /ws` - Real-time event stream

## WebSocket Events

Events are JSON objects with a `type` field:

```json
{"type": "button", "id": "BTN_TALK", "pressed": true}
{"type": "lora_rx", "from": "0x0002", "rssi": -45, "snr": 12.5, "data": "base64...", "id": 1}
{"type": "status", "battery": 87, "spoons": 8}
{"type": "audio_level", "value": 0.72}
```

## Integration

1. Initialize after LoRa and audio:
```c
shield_server_init();
shield_server_set_dependencies(
    lora_handle,
    lora_driver_get_rssi,
    lora_driver_send,
    lora_driver_receive,
    audio_engine_record_start,
    audio_engine_record_stop,
    audio_engine_play_buffer,
    audio_engine_get_state
);
```

2. Store received messages:
```c
shield_server_store_message("0x0002", data, len, rssi, snr);
```

3. Broadcast events:
```c
shield_server_broadcast_button("BTN_TALK", true);
shield_server_broadcast_event("status", "{\"battery\":87}");
```

## File Structure

- `/spiffs/web/index.html` - Main web app entry point
- `/spiffs/web/*.js` - JavaScript files
- `/spiffs/web/*.css` - Stylesheets
- `/spiffs/web/*.png` - Images

Root `/` redirects to `/web/index.html`

## Configuration

WiFi AP settings in `shield_server.c`:
- SSID: `WIFI_AP_SSID`
- Password: `WIFI_AP_PASSWORD`
- Channel: `WIFI_AP_CHANNEL`
- Max connections: `WIFI_AP_MAX_CONNECTIONS`

SPIFFS partition label: `SPIFFS_PARTITION_LABEL`

## The Mesh Holds. 🔺
