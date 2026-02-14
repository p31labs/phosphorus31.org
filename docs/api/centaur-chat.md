# The Centaur - Chat API

Chatbot interface for The Centaur.

## POST /api/chat/message

Send a message to The Centaur chatbot.

### Request

```http
POST /api/chat/message
Content-Type: application/json

{
  "message": "What is P31?",
  "context": {
    "userId": "user-123",
    "sessionId": "session-456"
  }
}
```

### Response

```json
{
  "success": true,
  "response": "P31 is Phosphorus-31, the biological qubit...",
  "sessionId": "session-456",
  "timestamp": "2026-02-13T12:00:00.000Z"
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
