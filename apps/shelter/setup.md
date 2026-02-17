# The Buffer Setup Guide

Complete setup guide for The Buffer communication processing layer.

## Prerequisites

- Node.js 18.0.0+
- Redis (for message queue)
- SQLite (for local storage, included)

## Installation

```bash
cd cognitive-shield
npm install
```

## Configuration

### Environment Variables

Create `.env` file:

```bash
# Redis for message queue
REDIS_URL=redis://localhost:6379

# Database (SQLite by default)
DATABASE_URL=sqlite:./buffer.db

# Buffer configuration
BUFFER_WINDOW_MS=60000  # 60-second batching window
MAX_BATCH_SIZE=100
PRIORITY_QUEUE_ENABLED=true
```

### God Config

Edit `src/config/god.config.ts` for metabolism and heartbeat settings:

```typescript
export const MetabolismConfig = {
  maxSpoons: 12,
  spoonRecoveryRate: 0.1,
  stressThreshold: 8,
  recoveryThreshold: 4
};

export const HeartbeatConfig = {
  thresholds: {
    green: 70,
    yellow: 50,
    red: 30
  }
};
```

## Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Verification

### Health Check

```bash
curl http://localhost:4000/health
```

### Message Submission Test

```bash
curl -X POST http://localhost:4000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "priority": "normal"}'
```

## Integration

The Buffer integrates with:
- **The Centaur**: Backend API
- **The Scope**: Dashboard visualization
- **Ping**: Object permanence system
- **Node One**: Hardware device

## Troubleshooting

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL in .env

### Database Issues

- SQLite database is created automatically
- Check file permissions if errors occur

## Next Steps

- [The Buffer Documentation](../docs/buffer.md)
- [Development Guide](../docs/development.md)
