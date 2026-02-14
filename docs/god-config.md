# GOD_CONFIG Reference

Complete reference for `god.config.ts` configuration parameters used in P31 components.

## Overview

GOD_CONFIG (Geodesic Operations Daemon Configuration) provides core system parameters for P31 components. All configuration values should be defined in `god.config.ts` files, never hardcoded.

## Configuration Structure

```typescript
export const GodConfig = {
  Metabolism: MetabolismConfig,
  Heartbeat: HeartbeatConfig
};
```

## Metabolism Configuration

Controls energy/spoon management for The Buffer.

```typescript
export interface MetabolismConfig {
  maxSpoons: number;           // Maximum energy units (default: 12)
  spoonRecoveryRate: number;   // Recovery rate per interval (default: 0.1)
  stressThreshold: number;      // Stress warning threshold (default: 8)
  recoveryThreshold: number;    // Recovery threshold (default: 4)
}
```

### Default Values

- `maxSpoons`: 12
- `spoonRecoveryRate`: 0.1
- `stressThreshold`: 8
- `recoveryThreshold`: 4

### Usage

The Metabolism configuration is used by The Buffer to:
- Track energy levels
- Manage message processing load
- Trigger stress warnings
- Control recovery periods

## Heartbeat Configuration

Controls connection health monitoring (Ping system).

```typescript
export interface HeartbeatConfig {
  thresholds: {
    green: number;    // Good connection threshold (default: 70)
    yellow: number;   // Degraded connection threshold (default: 50)
    red: number;      // Poor connection threshold (default: 30)
  };
  maxHeartbeat: number;  // Maximum heartbeat value (default: 100)
  minHeartbeat: number;  // Minimum heartbeat value (default: 0)
}
```

### Default Values

- `thresholds.green`: 70
- `thresholds.yellow`: 50
- `thresholds.red`: 30
- `maxHeartbeat`: 100
- `minHeartbeat`: 0

### Usage

The Heartbeat configuration is used by Ping to:
- Monitor connection health
- Display status indicators
- Trigger alerts
- Manage object permanence

## File Locations

GOD_CONFIG files are located in:

- `ui/src/config/god.config.ts` - The Scope configuration
- `cognitive-shield/src/config/god.config.ts` - The Buffer configuration
- Other components as needed

## Import Pattern

Always import from the config file:

```typescript
import GodConfig from '@/config/god.config';

// Use configuration
const maxSpoons = GodConfig.Metabolism.maxSpoons;
const greenThreshold = GodConfig.Heartbeat.thresholds.green;
```

## Configuration Principles

1. **Single Source of Truth**: All values in `god.config.ts`
2. **Never Hardcode**: Always use GOD_CONFIG
3. **Type Safety**: Use TypeScript interfaces
4. **Documentation**: Document all parameters
5. **Validation**: Validate on startup

## Customization

To customize configuration:

1. Edit `god.config.ts` in the component
2. Update default values
3. Ensure values don't break constitutional requirements
4. Test configuration changes
5. Document any changes

## Constitutional Compliance

Configuration changes must maintain:
- Tetrahedron topology constraints
- Privacy requirements
- Performance targets (0.350 kbps)
- Abdication principles

## Documentation

- [The Buffer](buffer.md) - Uses Metabolism config
- [Ping](ping.md) - Uses Heartbeat config
- [Setup Guide](setup.md) - Configuration setup
- [Development Guide](development.md) - Development workflow
