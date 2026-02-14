# The Buffer API Documentation

Complete API reference for The Buffer communication processing layer.

## Base URL

```
http://localhost:4000
```

## Authentication

Currently no authentication required. In production, implement JWT or API keys.

## Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "systems": {
    "queue": true,
    "store": true,
    "ping": true
  }
}
```

### Submit Message

```http
POST /api/messages
Content-Type: application/json

{
  "message": "Hello, this is a test message",
  "priority": "normal",
  "metadata": {
    "source": "scope",
    "userId": "user123"
  }
}
```

**Priority values:** `low`, `normal`, `high`, `urgent`

**Response:**
```json
{
  "success": true,
  "messageId": "msg_1234567890_abc123",
  "status": "queued",
  "priority": "normal",
  "filterReason": "Normal processing"
}
```

The message will be automatically filtered and priority adjusted based on content analysis.

### Get Message Status

```http
GET /api/messages/:messageId
```

**Response:**
```json
{
  "id": "msg_1234567890_abc123",
  "message": "Hello, this is a test message",
  "priority": "normal",
  "status": "completed",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "metadata": {
    "source": "scope",
    "filterReason": "Normal processing"
  }
}
```

### Get Message History

```http
GET /api/messages?limit=20&offset=0&status=completed
```

**Query Parameters:**
- `limit` (number, default: 50) - Number of messages to return
- `offset` (number, default: 0) - Pagination offset
- `status` (string, optional) - Filter by status: `pending`, `processing`, `completed`, `failed`

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_1234567890_abc123",
      "message": "Hello",
      "priority": "normal",
      "status": "completed",
      "timestamp": "2026-02-13T12:00:00.000Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

### Get Message Statistics

```http
GET /api/messages/stats
```

**Response:**
```json
{
  "total": 150,
  "pending": 5,
  "processing": 2,
  "completed": 140,
  "failed": 3
}
```

### Get Queue Status

```http
GET /api/queue/status
```

**Response:**
```json
{
  "queueLength": 5,
  "connected": true,
  "pending": 5,
  "processing": 0
}
```

### Ping Status

```http
GET /api/ping/status
```

**Response:**
```json
{
  "active": true,
  "lastHeartbeat": "2026-02-13T12:00:00.000Z",
  "nodes": {
    "scope": {
      "nodeId": "scope",
      "timestamp": "2026-02-13T12:00:00.000Z",
      "signalStrength": 100
    }
  },
  "health": "green"
}
```

**Health values:** `green` (good), `yellow` (warning), `red` (critical)

### Send Heartbeat

```http
POST /api/ping/heartbeat
Content-Type: application/json

{
  "nodeId": "scope",
  "signalStrength": 100
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-02-13T12:00:00.000Z"
}
```

### Get Monitoring Metrics

```http
GET /api/monitoring/metrics
```

**Response:**
```json
{
  "messagesProcessed": 1000,
  "messagesFailed": 5,
  "averageProcessingTime": 125.5,
  "queueDepth": 10,
  "errorRate": 0.5
}
```

### Get Alerts

```http
GET /api/monitoring/alerts
```

**Response:**
```json
[
  {
    "id": "alert_1234567890_abc123",
    "type": "warning",
    "message": "Queue depth high: 500 messages",
    "timestamp": "2026-02-13T12:00:00.000Z",
    "resolved": false
  }
]
```

### Resolve Alert

```http
POST /api/monitoring/alerts/:alertId/resolve
```

**Response:**
```json
{
  "success": true
}
```

## WebSocket API

Connect to `ws://localhost:4000` for real-time updates.

### Subscribe

```json
{
  "type": "subscribe",
  "channel": "buffer"
}
```

### Request Status

```json
{
  "type": "status"
}
```

### Ping

```json
{
  "type": "ping"
}
```

### Message Types

**Status Update:**
```json
{
  "type": "status",
  "data": {
    "queueLength": 5,
    "connected": true,
    "pending": 5,
    "processing": 0
  },
  "timestamp": "2026-02-13T12:00:00.000Z"
}
```

**Batch Processed:**
```json
{
  "type": "batch_processed",
  "count": 10,
  "priorities": {
    "urgent": 1,
    "high": 2,
    "normal": 7
  },
  "timestamp": "2026-02-13T12:00:00.000Z"
}
```

**Alerts:**
```json
{
  "type": "alerts",
  "alerts": [
    {
      "id": "alert_123",
      "type": "warning",
      "message": "Queue depth high",
      "timestamp": "2026-02-13T12:00:00.000Z"
    }
  ],
  "timestamp": "2026-02-13T12:00:00.000Z"
}
```

**Pong:**
```json
{
  "type": "pong",
  "timestamp": "2026-02-13T12:00:00.000Z"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (message/resource not found)
- `500` - Internal Server Error
- `503` - Service Unavailable (component not initialized)

## Rate Limiting

Currently no rate limiting. In production, implement rate limiting per IP/node.

## Message Filtering

Messages are automatically filtered and priority-adjusted based on:

- **Urgent keywords:** emergency, urgent, help, danger, critical
- **High voltage indicators:** overwhelmed, shutdown, meltdown, overstimulated
- **Safe indicators:** ok, fine, good, stable, calm
- **Repetitive patterns:** Detects overwhelm patterns
- **Message length:** Very long messages flagged for batching

## Retry Logic

Failed message processing uses exponential backoff with jitter:
- Initial delay: 1 second
- Max retries: 3 attempts
- Max delay: 10 seconds
- Backoff multiplier: 2x

## Encryption

Message encryption is available via `MessageEncryption` class. Use `EncryptedBlob` type for user content per G.O.D. Protocol Privacy Axiom.

---

**The Mesh Holds.** 🔺
