# The Buffer

Communication processing layer that buffers messages between internal thought and external signal.

## Overview

The Buffer is the software layer that processes communication between internal cognitive states and external signals. It provides neurodivergent-first message processing with batching, filtering, and prioritization.

## Features

- Message batching (60-second windows)
- Priority queuing
- Signal-to-noise filtering
- Neurodivergent-first processing
- Encrypted message handling
- Local-first storage

## Architecture

The Buffer sits between:
- **Internal**: Cognitive states, thoughts, messages
- **External**: Network signals, API calls, user interfaces

## Components

- **CatchersMitt**: 60-second message batching
- **Priority Queue**: Message prioritization
- **Signal Filter**: SNR-based filtering
- **Encryption Layer**: Type-level encryption

## Setup

See [cognitive-shield/setup.md](../cognitive-shield/setup.md) for setup instructions.

### Prerequisites

- Node.js 18+
- Redis (for message queue)
- SQLite (for local storage)

### Configuration

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

## API

The Buffer provides APIs for:
- Message submission
- Batch retrieval
- Priority management
- Signal filtering

## Documentation

- [Setup Guide](../cognitive-shield/setup.md)
- [The Centaur](centaur.md) - Backend integration
- [Ping](ping.md) - Object permanence system
