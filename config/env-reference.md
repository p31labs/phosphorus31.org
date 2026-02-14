# Environment Variables Reference

Complete reference for all environment variables used in the P31 ecosystem. All component names use P31 naming conventions (Node One, The Buffer, The Centaur, The Scope).

See [P31 Naming Architecture](../P31_naming_architecture.md) for complete naming reference.

## The Centaur (SUPER-CENTAUR)

### Database

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/centaur
# Or SQLite:
# DATABASE_URL=sqlite:./centaur.db
```

### Redis

```bash
REDIS_URL=redis://localhost:6379
```

### Neo4j (Knowledge Graph)

```bash
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
```

### AI Providers

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

### Server

```bash
PORT=3000
NODE_ENV=development
```

### Security

```bash
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
```

## The Buffer (cognitive-shield)

### Redis

```bash
REDIS_URL=redis://localhost:6379
```

### Database

```bash
DATABASE_URL=sqlite:./buffer.db
# Or PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/buffer
```

### Buffer Configuration

```bash
BUFFER_WINDOW_MS=60000          # 60-second batching window
MAX_BATCH_SIZE=100              # Maximum messages per batch
PRIORITY_QUEUE_ENABLED=true      # Enable priority queue
```

### Server

```bash
PORT=4000
NODE_ENV=development
```

## The Scope (ui)

### API Configuration

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Environment

```bash
NODE_ENV=development
```

## Node One (firmware)

### ESP-IDF Configuration

Configure via `idf.py menuconfig`:

- **Component config** → **ESP32S3-Specific**
- **Component config** → **LoRa** → Frequency (915MHz)
- **Component config** → **Whale Channel** → Mesh settings

### Build Configuration

Set via `idf.py menuconfig` or `sdkconfig`:

```bash
CONFIG_ESP32S3_DEFAULT_CPU_FREQ_240=y
CONFIG_LORA_FREQUENCY_915=y
CONFIG_WHALE_CHANNEL_ENABLED=y
```

## Sovereign Life OS

See [sovereign-life-os documentation](../sovereign-life-os/sovereign-life-os/README.md) for service-specific environment variables.

## Environment File Templates

### .env.example (The Centaur)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/centaur

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# AI Providers
OPENAI_API_KEY=your-key-here

# Server
PORT=3000
NODE_ENV=development
```

### .env.example (The Buffer)

```bash
# Redis
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=sqlite:./buffer.db

# Buffer Configuration
BUFFER_WINDOW_MS=60000
MAX_BATCH_SIZE=100
PRIORITY_QUEUE_ENABLED=true

# Server
PORT=4000
NODE_ENV=development
```

## Security Notes

- Never commit `.env` files to version control
- Use `.env.example` as templates
- Rotate secrets regularly
- Use different secrets for development and production
- Store production secrets securely (e.g., secrets manager)

## Validation

Environment variables are validated on startup. Missing required variables will cause startup failures with clear error messages.

## Documentation

- [Setup Guide](../docs/setup.md)
- [Development Guide](../docs/development.md)
- [Component Documentation](../docs/index.md)
