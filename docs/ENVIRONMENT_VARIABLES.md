# P31 Environment Variables Reference
## Complete Configuration Guide

All P31 components use environment variables for configuration. This document provides a complete reference.

---

## The Centaur (SUPER-CENTAUR)

### Required Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/centaur
# OR for SQLite:
DATABASE_URL=file:./data/centaur.db

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j (Knowledge Graph - Optional)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# AI Provider Keys (at least one required)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

### Optional Variables

```bash
# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Feature Flags
ENABLE_KNOWLEDGE_GRAPH=true
ENABLE_BLOCKCHAIN=false
ENABLE_CONSCIOUSNESS_MONITORING=true
```

---

## The Scope (ui)

### Required Variables

```bash
# API Configuration
VITE_CENTAUR_API_URL=http://localhost:3000
VITE_BUFFER_API_URL=http://localhost:3001

# Environment
VITE_NODE_ENV=development
```

### Optional Variables

```bash
# WebSocket
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_3D=true
VITE_ENABLE_PERFORMANCE_MONITOR=true
VITE_ENABLE_SCENE_INSPECTOR=false

# Analytics (if needed)
VITE_ANALYTICS_ID=
```

---

## The Buffer (cognitive-shield)

### Required Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# The Centaur API
CENTAUR_API_URL=http://localhost:3000
CENTAUR_API_KEY=your-api-key

# Redis (Message Queue)
REDIS_URL=redis://localhost:6379

# Local Storage
STORAGE_PATH=./data/buffer
STORAGE_TYPE=sqlite
```

### Optional Variables

```bash
# Message Processing
BATCH_WINDOW_MS=60000
MAX_BATCH_SIZE=50
PRIORITY_QUEUE_ENABLED=true

# Signal Filtering
SNR_THRESHOLD=0.5
FILTER_ENABLED=true

# Encryption
ENCRYPTION_KEY=your-encryption-key
ENCRYPTION_ALGORITHM=aes-256-gcm

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/buffer.log
```

---

## Node One (firmware)

### Build Configuration

Node One uses ESP-IDF build system. Configuration is in `sdkconfig`:

```bash
# LoRa Configuration
CONFIG_LORA_FREQUENCY=915000000
CONFIG_LORA_SPREADING_FACTOR=7
CONFIG_LORA_BANDWIDTH=125000
CONFIG_LORA_CODING_RATE=5

# Network Configuration
CONFIG_MESH_NODE_ID=1
CONFIG_MESH_CHANNEL=0

# Display Configuration
CONFIG_DISPLAY_TYPE=OLED
CONFIG_DISPLAY_WIDTH=320
CONFIG_DISPLAY_HEIGHT=480

# Haptic Configuration
CONFIG_HAPTIC_ENABLED=true
CONFIG_HAPTIC_INTENSITY=50
```

### Runtime Configuration (via API)

Node One configuration can be updated via The Centaur API:

```json
{
  "nodeId": 1,
  "config": {
    "lora": {
      "frequency": 915000000,
      "spreadingFactor": 7
    },
    "haptic": {
      "enabled": true,
      "intensity": 50
    }
  }
}
```

---

## Environment File Templates

### .env.example for The Centaur

```bash
# Copy this to .env and fill in your values
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/centaur
REDIS_URL=redis://localhost:6379

NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=7d

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=

CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

### .env.example for The Scope

```bash
# Copy this to .env and fill in your values
VITE_CENTAUR_API_URL=http://localhost:3000
VITE_BUFFER_API_URL=http://localhost:3001
VITE_NODE_ENV=development
VITE_WS_URL=ws://localhost:3000
```

### .env.example for The Buffer

```bash
# Copy this to .env and fill in your values
PORT=3001
NODE_ENV=development

CENTAUR_API_URL=http://localhost:3000
CENTAUR_API_KEY=

REDIS_URL=redis://localhost:6379

STORAGE_PATH=./data/buffer
STORAGE_TYPE=sqlite

BATCH_WINDOW_MS=60000
MAX_BATCH_SIZE=50

LOG_LEVEL=info
```

---

## Environment-Specific Configurations

### Development

```bash
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=file:./data/dev.db
```

### Production

```bash
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://p31.io
DATABASE_URL=postgresql://user:password@db.example.com:5432/centaur
JWT_SECRET=<strong-random-secret>
```

### Testing

```bash
NODE_ENV=test
LOG_LEVEL=error
DATABASE_URL=file:./data/test.db
REDIS_URL=redis://localhost:6379/1
```

---

## Security Best Practices

### Secrets Management

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong secrets** - Generate with `openssl rand -hex 32`
3. **Rotate regularly** - Especially JWT_SECRET and encryption keys
4. **Use environment-specific files** - `.env.development`, `.env.production`
5. **Consider secret managers** - For production (AWS Secrets Manager, etc.)

### Example Secret Generation

```bash
# Generate JWT secret
openssl rand -hex 32

# Generate encryption key
openssl rand -base64 32
```

---

## Validation

### The Centaur

The Centaur validates required environment variables on startup:

```typescript
// Required variables
const required = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET'
];

// Validate
required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

### The Buffer

The Buffer validates:

```typescript
const required = [
  'CENTAUR_API_URL',
  'REDIS_URL'
];
```

---

## Docker Environment Variables

For Docker deployments, use `docker-compose.yml`:

```yaml
services:
  centaur:
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/centaur
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env
```

---

## Troubleshooting

### Variable Not Loading

1. Check file name: `.env` (not `.env.txt`)
2. Check location: Same directory as `package.json`
3. Restart server after changes
4. Check for typos in variable names

### Type Errors

- Use `VITE_` prefix for Vite variables (The Scope)
- Use `process.env` for Node.js variables (The Centaur, The Buffer)
- Check variable types (strings, numbers, booleans)

### Missing Variables

- Check component logs for validation errors
- Verify `.env` file exists and is readable
- Check for required variables in component README

---

## References

- [Setup Guide](setup.md) - Complete setup instructions
- [Component Documentation](index.md) - Individual component guides
- [Troubleshooting](troubleshooting.md) - Common issues

---

**The Mesh Holds.** 🔺
