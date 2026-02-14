# The Centaur - Health & Status API

Health check and system status endpoints for The Centaur.

## GET /health

Get overall system health status.

### Request

```http
GET /health
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "systems": {
    "legalAI": "active",
    "medical": "active",
    "blockchain": "active",
    "agents": "active",
    "chatbot": "active",
    "optimizer": "active",
    "security": "active",
    "backup": "active",
    "monitoring": "active",
    "quantumBrain": "active",
    "googleDrive": "active",
    "auth": "active"
  }
}
```

### Status Values

- `active` - System is running
- `unavailable` - System is not initialized
- `error` - System has errors

## GET /api/health/quantum-brain/status

Get Quantum Brain subsystem health status.

### Request

```http
GET /api/health/quantum-brain/status
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "systems": {
    "decisionEngine": "active",
    "consciousnessMonitor": "active",
    "quantumOptimizer": "active",
    "realTimeOptimizer": "active",
    "universalIntelligence": "active",
    "integration": "active"
  }
}
```

## Usage Example

```bash
# Check overall health
curl http://localhost:3000/health

# Check Quantum Brain status
curl http://localhost:3000/api/health/quantum-brain/status
```

## Integration

These endpoints are used by:
- **The Scope**: Dashboard health monitoring
- **Ping**: Object permanence system
- **Monitoring Systems**: Automated health checks

## Documentation

- [The Centaur](../centaur.md)
- [API Index](index.md)
