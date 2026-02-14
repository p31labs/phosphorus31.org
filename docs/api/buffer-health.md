# The Buffer - Health API

Health monitoring for The Buffer.

## GET /api/buffer/health

Get Buffer health status.

### Request

```http
GET /api/buffer/health
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "systems": {
    "messageQueue": "active",
    "processing": "active",
    "redis": "connected",
    "database": "connected"
  },
  "metrics": {
    "messagesProcessed": 1234,
    "averageProcessingTime": 45,
    "errorRate": 0.01
  }
}
```

## Documentation

- [The Buffer](../buffer.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
