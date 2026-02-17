# P31 Labs — Integration Guide
## Complete integration testing and deployment documentation

**Version:** 1.0  
**Last Updated:** 2026-02-14  
**Status:** Integration testing phase

---

## OVERVIEW

This document provides complete instructions for integration testing and deployment of the P31 Labs tetrahedron system: The Scope, The Buffer, The Centaur, and NODE ONE.

---

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         THE SCOPE (UI)                           │
│  React + TypeScript + Vite                                       │
│  Port: 5173 (dev) / 3000 (prod)                                 │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ HTTP + WS           │ HTTP + WS          │ WiFi AP
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  THE CENTAUR    │   │  THE BUFFER     │   │   NODE ONE      │
│  (Backend AI)   │   │  (Voltage)      │   │   (ESP32-S3)    │
│  Port: 3000     │   │  Port: 4000     │   │   Port: 80/8080 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                    │                    │
         │ HTTP                │                    │ LoRa
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  PostgreSQL     │   │  Redis          │   │  Meshtastic     │
│  Port: 5432     │   │  Port: 6379     │   │  Mesh Network   │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## PREREQUISITES

### Required Software
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Required Services (for local development)
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Environment Variables

#### The Centaur
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://centaur:centaur_dev@localhost:5432/centaur
REDIS_URL=redis://localhost:6379
BUFFER_API_URL=http://localhost:4000
```

#### The Buffer
```bash
NODE_ENV=development
PORT=4000
REDIS_URL=redis://localhost:6379
CENTAUR_API_URL=http://localhost:3000
CENTAUR_RETRY_COUNT=3
CENTAUR_RETRY_DELAY=1000
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

#### The Scope
```bash
NODE_ENV=development
VITE_CENTAUR_API_URL=http://localhost:3000
VITE_BUFFER_URL=http://localhost:4000
VITE_BUFFER_WS_URL=ws://localhost:4000
```

---

## LOCAL DEVELOPMENT SETUP

### Option 1: Docker Compose (Recommended for Integration Testing)

```bash
# Start all services
docker-compose -f docker-compose.integration.yml up -d

# Check service health
curl http://localhost:3000/health  # The Centaur
curl http://localhost:4000/health   # The Buffer
curl http://localhost:5173          # The Scope
curl http://localhost:8080/health   # Mock Node One

# View logs
docker-compose -f docker-compose.integration.yml logs -f

# Stop all services
docker-compose -f docker-compose.integration.yml down
```

### Option 2: Manual Startup (For Development)

**Terminal 1: PostgreSQL**
```bash
# If using Docker
docker run -d --name p31-postgres -p 5432:5432 \
  -e POSTGRES_USER=centaur \
  -e POSTGRES_PASSWORD=centaur_dev \
  -e POSTGRES_DB=centaur \
  postgres:15-alpine

# Or use local PostgreSQL
```

**Terminal 2: Redis**
```bash
# If using Docker
docker run -d --name p31-redis -p 6379:6379 redis:7-alpine

# Or use local Redis
```

**Terminal 3: The Centaur**
```bash
cd SUPER-CENTAUR
npm install
npm run dev
```

**Terminal 4: The Buffer**
```bash
cd cognitive-shield
npm install
npm run dev
```

**Terminal 5: The Scope**
```bash
cd ui
npm install
npm run dev
```

**Terminal 6: Mock Node One (Optional)**
```bash
cd ui
npm run test:node-one-mock
```

---

## INTEGRATION TESTING

### Running Integration Tests

**Using the test script:**
```bash
# Linux/Mac
./scripts/integration-test.sh

# Windows (PowerShell)
.\scripts\integration-test.ps1
```

**Manual testing:**
```bash
# Start services
docker-compose -f docker-compose.integration.yml up -d

# Wait for services to be healthy
sleep 10

# Run tests
cd ui
npm run test:integration

# Or run specific test suite
npm run test:integration -- scope-centaur
npm run test:integration -- buffer-centaur
npm run test:integration -- scope-buffer
npm run test:integration -- scope-node-one
npm run test:integration -- end-to-end

# Tear down
cd ..
docker-compose -f docker-compose.integration.yml down
```

### Test Coverage

Integration tests cover:

1. **Scope ↔ Centaur**
   - HTTP endpoints (health, messages, spoons)
   - WebSocket connections (real-time updates)
   - Error handling (offline, slow responses, malformed data)

2. **Buffer ↔ Centaur**
   - Message forwarding pipeline
   - AI translation quality
   - Fallback behavior (Buffer works without Centaur)
   - Retry logic

3. **Scope ↔ Buffer**
   - Message display with voltage badges
   - Real-time updates via WebSocket
   - Accommodation log
   - Progressive disclosure

4. **Scope ↔ Node One**
   - Device status (battery, WiFi, LoRa)
   - Voice interface (audio recording)
   - LoRa mesh communication
   - Offline resilience

5. **End-to-End**
   - Complete message lifecycle
   - Degraded operation modes
   - Error recovery

---

## DEPLOYMENT

### Production Deployment

**Note:** Production deployment instructions will be added after integration testing is complete.

### Health Check Endpoints

| Component | Endpoint | Expected Response |
|-----------|----------|-------------------|
| The Centaur | `GET /health` | `{ status: 'healthy', timestamp: string }` |
| The Buffer | `GET /health` | `{ status: 'healthy', timestamp: string, systems: {...} }` |
| The Scope | `GET /` | HTML page (200 OK) |
| NODE ONE | `GET /api/status` | `{ battery: number, wifi: {...}, lora: {...} }` |

### Monitoring

Each component exposes monitoring endpoints:

- **The Centaur:** `GET /api/system/metrics`
- **The Buffer:** `GET /api/monitoring/metrics`
- **The Scope:** Health checks via service health checks

---

## TROUBLESHOOTING

### Common Issues

**1. Services won't start**
- Check Docker is running: `docker info`
- Check ports are available: `netstat -an | grep :3000`
- Check logs: `docker-compose -f docker-compose.integration.yml logs`

**2. Connection refused errors**
- Verify services are running: `docker-compose -f docker-compose.integration.yml ps`
- Check service health: `curl http://localhost:3000/health`
- Verify environment variables are set correctly

**3. WebSocket connection failures**
- Check CORS settings in Buffer/Centaur
- Verify WebSocket URL is correct
- Check firewall settings

**4. Database connection errors**
- Verify PostgreSQL is running: `docker ps | grep postgres`
- Check DATABASE_URL environment variable
- Verify database exists: `psql -U centaur -d centaur`

**5. Redis connection errors**
- Verify Redis is running: `docker ps | grep redis`
- Check REDIS_URL environment variable
- Test connection: `redis-cli ping`

---

## FALLBACK BEHAVIOR

### System Degradation Matrix

| Scenario | Scope | Buffer | Centaur | NODE ONE | Result |
|----------|-------|--------|---------|----------|--------|
| All up | ✅ | ✅ | ✅ | ✅ | Full functionality |
| Centaur down | ✅ | ✅ | ❌ | ✅ | Buffer works locally, no AI translation |
| Buffer down | ✅ | ❌ | ✅ | ✅ | Scope shows offline, can't process messages |
| NODE ONE down | ✅ | ✅ | ✅ | ❌ | No LoRa, no device status, manual input works |
| Centaur + Buffer down | ✅ | ❌ | ❌ | ✅ | Scope shows offline indicators |
| All down | ✅ | ❌ | ❌ | ❌ | Scope shows all offline, manual input cached locally |

**Key Principle:** The Buffer is the shield. It MUST work independently. Centaur enhances but is not required.

---

## NEXT STEPS

1. ✅ Integration map created
2. ✅ Integration tests written
3. ✅ Mock Node One server created
4. ✅ Docker Compose configuration created
5. ✅ Test scripts created
6. ⏳ Run integration tests
7. ⏳ Fix any issues found
8. ⏳ Add WebSocket tests
9. ⏳ Production deployment guide

---

## REFERENCES

- [Integration Map](./INTEGRATION_MAP.md) - Complete contract documentation
- [Buffer API Docs](../cognitive-shield/README.md) - The Buffer API reference
- [Centaur API Docs](../SUPER-CENTAUR/README.md) - The Centaur API reference
- [Node One Firmware](../firmware/README.md) - NODE ONE hardware documentation

---

**The mesh holds. 🔺**
