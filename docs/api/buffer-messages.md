# The Buffer - Messages API

Message submission and retrieval endpoints for The Buffer communication processing layer.

## POST /api/messages

Submit a message to The Buffer for processing.

### Request

```http
POST /api/messages
Content-Type: application/json

{
  "message": "Message content",
  "priority": "normal",
  "metadata": {
    "source": "user",
    "timestamp": "2026-02-13T12:00:00.000Z"
  }
}
```

### Priority Levels

- `low` - Low priority message
- `normal` - Normal priority (default)
- `high` - High priority message
- `urgent` - Urgent message

### Response

```json
{
  "success": true,
  "messageId": "msg-123",
  "status": "queued",
  "estimatedProcessingTime": 60
}
```

## GET /api/messages

Retrieve messages from The Buffer.

### Request

```http
GET /api/messages?limit=10&offset=0&status=processed
```

### Query Parameters

- `limit` - Number of messages to retrieve (default: 10)
- `offset` - Offset for pagination (default: 0)
- `status` - Filter by status: `queued`, `processing`, `processed`, `failed`
- `priority` - Filter by priority level
- `since` - ISO timestamp to get messages since

### Response

```json
{
  "messages": [
    {
      "id": "msg-123",
      "message": "Message content",
      "priority": "normal",
      "status": "processed",
      "createdAt": "2026-02-13T12:00:00.000Z",
      "processedAt": "2026-02-13T12:00:05.000Z"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

## GET /api/messages/:id

Get a specific message by ID.

### Request

```http
GET /api/messages/msg-123
```

### Response

```json
{
  "id": "msg-123",
  "message": "Message content",
  "priority": "normal",
  "status": "processed",
  "metadata": {
    "source": "user",
    "timestamp": "2026-02-13T12:00:00.000Z"
  },
  "createdAt": "2026-02-13T12:00:00.000Z",
  "processedAt": "2026-02-13T12:00:05.000Z"
}
```

## POST /api/messages/batch

Submit multiple messages in a batch.

### Request

```http
POST /api/messages/batch
Content-Type: application/json

{
  "messages": [
    {
      "message": "Message 1",
      "priority": "normal"
    },
    {
      "message": "Message 2",
      "priority": "high"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "batchId": "batch-123",
  "messageIds": ["msg-123", "msg-124"],
  "status": "queued"
}
```

## Message Status

Messages progress through these states:

1. `queued` - Message is in the queue
2. `processing` - Message is being processed
3. `processed` - Message has been processed successfully
4. `failed` - Message processing failed

## Batching

The Buffer automatically batches messages within a 60-second window (configurable via `BUFFER_WINDOW_MS`). Messages are processed together to optimize throughput.

## Usage Examples

```bash
# Submit a message
curl -X POST http://localhost:4000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","priority":"normal"}'

# Get messages
curl http://localhost:4000/api/messages?limit=10

# Get specific message
curl http://localhost:4000/api/messages/msg-123
```

## Integration

The Buffer integrates with:
- **The Centaur**: Processes messages for AI protocol
- **The Scope**: Visualizes message queue
- **Ping**: Object permanence system
- **Node One**: Hardware device communication

## Documentation

- [The Buffer](../buffer.md)
- [API Index](index.md)
