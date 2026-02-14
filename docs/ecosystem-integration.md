# P31 Ecosystem Integration Guide
## Connecting Node One, The Buffer, The Centaur, and The Scope

Complete guide to integrating all P31 components into a unified system.

---

## Overview

P31 is a tetrahedron topology system with four core components that work together:

```
        Node One (Hardware)
              /\
             /  \
            /    \
           /      \
    The Buffer    The Centaur
    (Processing)  (Backend AI)
           \      /
            \    /
             \  /
              \/
         The Scope (UI)
```

**Four vertices. Six edges. Four faces. The minimum stable system.**

---

## Component Roles

### Node One
- **Role:** Physical hardware interface
- **Function:** ESP32-S3 device with LoRa mesh, haptics, display
- **Connection:** Communicates via Whale Channel (LoRa) and USB/serial

### The Buffer
- **Role:** Communication processing layer
- **Function:** Buffers messages, manages energy/spoons, processes signals
- **Connection:** Receives from Node One, processes, sends to The Centaur

### The Centaur
- **Role:** Backend AI protocol system
- **Function:** Human + Synthetic = Centaur. AI processing, knowledge graph, storage
- **Connection:** Receives from The Buffer, provides API to The Scope

### The Scope
- **Role:** Dashboard and visualization
- **Function:** Shows network health, system status, message interface
- **Connection:** Connects to The Centaur API, displays data from all components

---

## Integration Architecture

### Data Flow

```
Node One (LoRa/USB)
    ↓
The Buffer (Processing)
    ↓
The Centaur (Backend)
    ↓
The Scope (UI)
```

### Communication Protocols

1. **Node One → The Buffer**
   - LoRa mesh (Whale Channel) for wireless
   - USB/serial for direct connection
   - Protocol: Binary-packed messages (Protocol Buffers)

2. **The Buffer → The Centaur**
   - HTTP/REST API
   - WebSocket for real-time updates
   - Protocol: JSON (encrypted payloads)

3. **The Centaur → The Scope**
   - REST API
   - WebSocket for live updates
   - Protocol: JSON

4. **The Scope → User**
   - Visual interface
   - Haptic feedback (via Node One)
   - Audio alerts (optional)

---

## Setup Sequence

### 1. Start The Centaur (Backend)

The Centaur must be running first as it provides the API for other components.

```bash
cd SUPER-CENTAUR
npm install
cp .env.example .env
# Configure .env with database, API keys, etc.
npm run db:init
npm run dev
```

**Verify:** Check `http://localhost:3000/health` (or configured port)

### 2. Start The Buffer (Processing)

The Buffer connects to The Centaur and processes messages.

```bash
cd cognitive-shield
npm install
cp .env.example .env
# Configure .env with Centaur API URL, Redis, etc.
npm run dev
```

**Verify:** Check Buffer logs for successful Centaur connection

### 3. Start The Scope (UI)

The Scope provides the user interface.

```bash
cd ui
npm install
cp .env.example .env
# Configure .env with Centaur API URL
npm run dev
```

**Verify:** Open `http://localhost:5173` (or configured port)

### 4. Connect Node One (Hardware)

Flash firmware and connect device.

```bash
cd firmware
# Build and flash (see node-one.md for details)
idf.py build
idf.py flash
idf.py monitor
```

**Verify:** Node One appears in The Scope's device list

---

## Configuration

### Environment Variables

Each component requires configuration. See component-specific setup guides:

- [The Centaur Setup](../SUPER-CENTAUR/setup.md)
- [The Buffer Setup](../cognitive-shield/setup.md)
- [The Scope Setup](../ui/setup.md)
- [Node One Setup](node-one.md)

### GOD_CONFIG

All components use `god.config.ts` for core parameters:

- **Metabolism:** Energy/spoon management (The Buffer)
- **Heartbeat:** Connection health (Ping system)

See [GOD_CONFIG Reference](god-config.md) for complete details.

---

## Integration Testing

### Test Sequence

1. **Centaur Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Buffer Connection**
   - Check Buffer logs for Centaur connection
   - Send test message through Buffer

3. **Scope Connection**
   - Open The Scope in browser
   - Verify Centaur API connection
   - Check for device list

4. **Node One Connection**
   - Flash firmware
   - Verify device appears in The Scope
   - Send test message from Node One

### End-to-End Test

1. Send message from Node One
2. Verify message appears in The Buffer logs
3. Verify message processed by The Centaur
4. Verify message appears in The Scope UI
5. Verify response flows back through system

---

## Troubleshooting

### Component Not Connecting

**The Buffer can't connect to The Centaur:**
- Verify Centaur is running
- Check Centaur API URL in Buffer `.env`
- Check Centaur CORS settings
- Verify network connectivity

**The Scope can't connect to The Centaur:**
- Verify Centaur is running
- Check Centaur API URL in Scope `.env`
- Check browser console for errors
- Verify API authentication

**Node One not appearing in The Scope:**
- Verify Node One firmware is flashed
- Check serial/USB connection
- Verify LoRa mesh configuration
- Check Whale Channel frequency settings

### Message Flow Issues

**Messages not flowing through system:**
- Check each component's logs
- Verify component order (Centaur → Buffer → Scope → Node One)
- Check network connectivity
- Verify message format/protocol

**Messages lost or delayed:**
- Check Buffer processing queue
- Verify Centaur database connection
- Check Redis connection (if used)
- Monitor system resources

---

## Advanced Integration

### Custom Components

To add custom components:

1. Follow P31 naming conventions
2. Use GOD_CONFIG for configuration
3. Implement tetrahedron topology constraints
4. Connect via standard protocols
5. Document integration points

### Multi-Node Setup

For multiple Node One devices:

1. Configure unique node IDs
2. Set up Whale Channel mesh
3. Configure routing in The Centaur
4. Display all nodes in The Scope

### Cloud/Local/Hybrid

The Centaur supports multiple deployment modes:

- **Cloud:** Full cloud deployment
- **Local:** Self-hosted, sovereign
- **Hybrid:** Cloud when connected, local when offline

Configure in The Centaur `.env` file.

---

## Performance Optimization

### Bandwidth Optimization

P31 is optimized for low bandwidth (0.350 kbps):

- Use Protocol Buffers for binary packing
- Minimize JSON payloads
- Compress messages when possible
- Cache frequently accessed data

### Resource Management

- Monitor Buffer spoon/energy levels
- Optimize Centaur database queries
- Use Redis for caching
- Implement message queuing

---

## Security

### Encryption

- All messages encrypted (EncryptedBlob type)
- Zero-knowledge proofs where possible
- Local-first storage
- Encrypted sync only

### Authentication

- API keys for component communication
- User authentication via The Centaur
- Device authentication for Node One

---

## Monitoring

### Health Checks

- Centaur: `/health` endpoint
- Buffer: Check logs for processing status
- Scope: UI shows connection status
- Node One: Heartbeat via Ping system

### Metrics

- Message throughput
- Processing latency
- Connection health (Ping)
- Energy levels (Metabolism)

---

## References

- [Architecture Overview](architecture.md)
- [Component Documentation](index.md)
- [GOD_CONFIG Reference](god-config.md)
- [Setup Guide](setup.md)
- [Troubleshooting](troubleshooting.md)

---

**The Mesh Holds.** 🔺
