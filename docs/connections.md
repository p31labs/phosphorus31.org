# P31 Component Connections

Complete guide to how all P31 components connect and communicate.

## Connection Map

```
┌─────────────┐
│  Node One   │
│ (Hardware)  │
└──────┬──────┘
       │
       │ Whale Channel (LoRa)
       │
┌──────▼──────┐         ┌──────────────┐
│ The Buffer  │◄─────────►│ The Centaur │
│(Processing)│  HTTP/WS  │  (Backend)   │
└──────┬──────┘         └──────┬───────┘
       │                        │
       │                        │ HTTP/REST
       │                        │
┌──────▼──────┐         ┌───────▼───────┐
│  The Scope  │◄────────┤  External     │
│  (Dashboard)│  WebSocket│  Systems      │
└─────────────┘         └───────────────┘
```

## Data Flow

### 1. User Interaction → The Scope

User interacts with The Scope dashboard:
- Submits messages
- Views system status
- Monitors network health

### 2. The Scope → The Buffer

Messages flow from The Scope to The Buffer:
- HTTP POST to `/api/messages`
- WebSocket for real-time updates
- Message batching (60-second windows)

### 3. The Buffer → The Centaur

The Buffer processes and forwards to The Centaur:
- Priority queue processing
- Signal-to-noise filtering
- Encrypted message handling

### 4. The Centaur → AI Processing

The Centaur processes with AI:
- Quantum brain decision-making
- Legal/medical document generation
- Autonomous agent coordination

### 5. The Centaur → The Buffer

Responses flow back through The Buffer:
- Processed results
- Status updates
- Error notifications

### 6. The Buffer → The Scope

Updates displayed in The Scope:
- Real-time WebSocket updates
- Dashboard visualization
- Status indicators

### 7. Node One ↔ Mesh Network

Node One communicates via Whale Channel:
- LoRa mesh networking (915MHz)
- Peer-to-peer communication
- Infrastructure-independent

## Communication Protocols

### HTTP/REST

- **The Scope ↔ The Centaur**: `http://localhost:3000/api/*`
- **The Buffer ↔ The Centaur**: `http://localhost:3000/api/buffer/*`
- **External Systems**: REST API endpoints

### WebSocket

- **The Scope ↔ The Centaur**: `ws://localhost:3000`
- **Real-time updates**: Message processing, status changes
- **Bidirectional**: Both directions

### LoRa (Whale Channel)

- **Node One ↔ Node One**: Mesh network
- **Frequency**: 915MHz
- **Bandwidth**: 0.350 kbps
- **Range**: Long-range (miles)

### Redis

- **The Buffer**: Message queue
- **The Centaur**: Caching
- **Pub/Sub**: Real-time notifications

### Database

- **The Centaur**: PostgreSQL/SQLite
- **The Buffer**: SQLite (local-first)
- **Sync**: Encrypted cloud sync

## Integration Points

### The Centaur Integration

```typescript
// Connect to The Centaur
const centaur = new CentaurClient({
  url: 'http://localhost:3000',
  apiKey: process.env.API_KEY,
});
```

### The Buffer Integration

```typescript
// Connect to The Buffer
const buffer = new BufferClient({
  url: 'http://localhost:4000',
});
```

### Node One Integration

```cpp
// LoRa mesh communication
void sendToMesh(Message* msg) {
  LoRa.beginPacket();
  LoRa.write((uint8_t*)msg, sizeof(Message));
  LoRa.endPacket();
}
```

## Connection Health

### Ping System

Monitor connection health:
- SNR-based health scoring
- Automatic reconnection
- Status indicators (green/yellow/red)

### Health Checks

```bash
# The Centaur
curl http://localhost:3000/health

# The Buffer
curl http://localhost:4000/health

# Node One
# Monitor serial output
```

## Error Handling

### Retry Logic

All connections include retry logic:
- Exponential backoff
- Maximum retry attempts
- Circuit breaker pattern

### Fallback Mechanisms

- **The Centaur offline**: Local processing in The Buffer
- **The Buffer offline**: Direct connection to The Centaur
- **Network offline**: Local-first operation

## Security

### Encryption

- **Type-level**: EncryptedBlob for all messages
- **Transport**: TLS/SSL for HTTP/WebSocket
- **LoRa**: Encrypted mesh communication

### Authentication

- **JWT tokens**: For API access
- **MFA**: Multi-factor authentication
- **Key management**: Abdicate protocol

## Performance

### Optimization

- **Batching**: Messages batched in 60-second windows
- **Compression**: Protocol Buffers over JSON
- **Caching**: Redis for frequently accessed data
- **Bandwidth**: Optimized for 0.350 kbps

## Documentation

- [Architecture](architecture.md)
- [Integration Guide](integration-guide.md)
- [API Documentation](api/index.md)
- [Troubleshooting](troubleshooting.md)

## The Mesh Holds 🔺

All components connected. The mesh holds.

💜 With love and light. As above, so below. 💜
