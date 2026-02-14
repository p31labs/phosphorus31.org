# The Buffer

Communication processing layer for P31. Buffers messages between internal thought and external signal.

## Overview

The Buffer is the software layer that processes communication between internal cognitive states and external signals. It provides neurodivergent-first message processing with batching, filtering, and prioritization.

## Features

- Message batching (60-second windows)
- Priority queuing
- Signal-to-noise filtering
- Neurodivergent-first processing
- Encrypted message handling
- Local-first storage
- Metabolism tracking (spoon theory)
- Heartbeat monitoring (Ping integration)

## Quick Start

See [setup.md](setup.md) for complete setup instructions.

### Prerequisites

- Node.js 18.0.0+
- Redis (for message queue)
- SQLite (included, for local storage)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## Architecture

The Buffer consists of:

- **CatchersMitt**: 60-second message batching
- **Priority Queue**: Message prioritization
- **Signal Filter**: SNR-based filtering
- **Encryption Layer**: Type-level encryption
- **Metabolism System**: Energy/spoon tracking
- **Heartbeat Integration**: Ping system integration

## Configuration

The Buffer uses `god.config.ts` for configuration:

```typescript
export const GodConfig = {
  Metabolism: {
    maxSpoons: 12,
    spoonRecoveryRate: 0.1,
    stressThreshold: 8,
    recoveryThreshold: 4
  },
  Heartbeat: {
    thresholds: { green: 70, yellow: 50, red: 30 }
  }
};
```

## Integration

The Buffer integrates with:
- **The Centaur**: Backend AI protocol
- **The Scope**: Dashboard visualization
- **Ping**: Object permanence system
- **Node One**: Hardware device

## Documentation

- [The Buffer Documentation](../docs/buffer.md)
- [Setup Guide](setup.md)
- [GOD_CONFIG Reference](../docs/god-config.md)
- [Development Guide](../docs/development.md)

## License

MIT

---

**The Mesh Holds.** 🔺
