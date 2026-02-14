# The Buffer - Queue API

Message queue management for The Buffer.

## GET /api/buffer/queue/status

Get queue status.

### Request

```http
GET /api/buffer/queue/status
```

### Response

```json
{
  "queueLength": 42,
  "processing": 3,
  "pending": 39,
  "priority": {
    "urgent": 2,
    "high": 5,
    "normal": 30,
    "low": 2
  }
}
```

## POST /api/buffer/queue/clear

Clear message queue (use with caution).

### Request

```http
POST /api/buffer/queue/clear
```

## Documentation

- [The Buffer](../buffer.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
