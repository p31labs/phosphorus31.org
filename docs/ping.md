# Ping

Object permanence automation and heartbeat monitoring.

## Overview

Ping provides object permanence automation - "still here" signals that maintain connection awareness. It uses SNR-based connection health monitoring and automatic heartbeat generation.

## Features

- Object permanence automation
- SNR-based connection health
- Automatic heartbeat generation
- Connection status monitoring
- Threshold-based alerts

## Architecture

Ping monitors:
- **Connection Health**: Signal-to-noise ratio
- **Heartbeat Status**: Regular ping signals
- **Threshold Levels**: Green/Yellow/Red states

## Configuration

Ping uses heartbeat thresholds from `god.config.ts`:

```typescript
Heartbeat: {
  thresholds: {
    green: 70,   // Good connection
    yellow: 50,  // Degraded connection
    red: 30      // Poor connection
  },
  maxHeartbeat: 100,
  minHeartbeat: 0
}
```

## Integration

Ping integrates with:
- **The Buffer**: Message processing
- **The Scope**: Status visualization
- **Node One**: Hardware heartbeat
- **The Centaur**: Backend monitoring

## Usage

Ping operates automatically in the background. Status is visible in:
- The Scope dashboard
- Network health visualization
- Connection status indicators

## Documentation

- [The Buffer](buffer.md) - Message processing
- [The Scope](scope.md) - Status visualization
- [Node One](node-one.md) - Hardware integration
