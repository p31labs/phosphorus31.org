# P31 API Documentation

Complete API reference for the P31 ecosystem components.

## API Overview

The P31 ecosystem provides REST APIs for:
- **The Centaur**: Backend AI protocol system
- **The Buffer**: Communication processing layer
- **Node One**: Hardware device communication

## Base URLs

- **The Centaur**: `http://localhost:3000` (development)
- **The Buffer**: `http://localhost:4000` (development)
- **Node One**: Serial/USB communication

## Authentication

Most API endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

## API Documentation

### The Centaur API

- [Health & Status](centaur-health.md) - System health checks
- [Authentication](centaur-auth.md) - Login, MFA, registration
- [Legal Services](centaur-legal.md) - Legal document generation
- [Medical Services](centaur-medical.md) - Medical documentation
- [Blockchain](centaur-blockchain.md) - Blockchain operations
- [Agents](centaur-agents.md) - Autonomous agent management
- [Chat](centaur-chat.md) - Chatbot interface
- [Family Support](centaur-family.md) - Family support systems
- [Google Drive](centaur-google-drive.md) - Google Drive integration
- [Sovereignty](centaur-sovereignty.md) - Sovereignty validation
- [System](centaur-system.md) - System metrics and monitoring
- [Wallet](centaur-wallet.md) - Wallet management
- [Spoons](centaur-spoons.md) - Spoon theory tracking
- [Consciousness](centaur-consciousness.md) - Consciousness monitoring

### The Buffer API

- [Messages](buffer-messages.md) - Message submission and retrieval
- [Queue](buffer-queue.md) - Message queue management
- [Health](buffer-health.md) - Buffer health status

### Node One API

- [Hardware](node-one-hardware.md) - Hardware communication protocols
- [Whale Channel](node-one-whale-channel.md) - LoRa mesh network

## WebSocket API

The Centaur provides WebSocket connections for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3000');
ws.on('message', (data) => {
  // Handle real-time updates
});
```

## Rate Limiting

API endpoints are rate-limited:
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

## Documentation

- [Setup Guide](../setup.md)
- [Development Guide](../development.md)
- [Architecture](../architecture.md)
