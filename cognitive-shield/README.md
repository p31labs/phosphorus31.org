# The Buffer

**Communication Processing Layer for P31**

The Buffer processes messages between internal thought and external signal. Neurodivergent-first message processing with batching, priority queues, and object permanence automation.

## Features

- **Message Batching** - 60-second windows (configurable) to prevent overwhelm
- **Priority Queue** - Urgent/High/Normal/Low priority handling
- **Neurodivergent-First Filtering** - Detects overwhelm patterns, adjusts priority
- **Ping System** - Object permanence automation ("Dad is still here")
- **Fallback Queue** - Works even when Redis is unavailable
- **Message History** - SQLite local-first storage
- **WebSocket Updates** - Real-time status updates
- **Encryption Ready** - Type-level encryption support (EncryptedBlob)

## Quick Start

```bash
cd cognitive-shield
npm install
cp .env.example .env  # Configure environment
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/messages` - Submit message
- `GET /api/messages` - Get message history
- `GET /api/messages/:messageId` - Get message status
- `GET /api/messages/stats` - Get statistics
- `GET /api/queue/status` - Get queue status
- `GET /api/ping/status` - Get Ping status
- `POST /api/ping/heartbeat` - Send heartbeat

## WebSocket

Connect to `ws://localhost:4000` for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:4000');
ws.send(JSON.stringify({ type: 'subscribe', channel: 'buffer' }));
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle: status, batch_processed, pong
};
```

## Configuration

Environment variables (see `.env.example`):
- `PORT` - Server port (default: 4000)
- `REDIS_URL` - Redis connection URL
- `DATABASE_URL` - SQLite database path
- `BUFFER_WINDOW_MS` - Batching window (default: 60000)
- `MAX_BATCH_SIZE` - Max messages per batch (default: 100)
- `ENCRYPTION_KEY` - 32-byte hex key for encryption

## Architecture

- **MessageQueue** - Redis priority queue with fallback
- **BufferStore** - SQLite local-first message storage
- **MessageFilter** - Neurodivergent-first filtering
- **Ping** - Object permanence automation
- **MessageEncryption** - Type-level encryption (G.O.D. Protocol)

## Integration

The Buffer integrates with:
- **The Centaur** - Backend API routes messages through Buffer
- **The Scope** - Frontend dashboard and visualization
- **Node One** - Hardware device heartbeat

## G.O.D. Protocol Compliance

- ✅ Type-level encryption (EncryptedBlob)
- ✅ Local-first storage (SQLite)
- ✅ Privacy-first design
- ✅ Neurodivergent-first processing
- ✅ Resilient architecture (fallback queue)

---

**The Mesh Holds.** 🔺
