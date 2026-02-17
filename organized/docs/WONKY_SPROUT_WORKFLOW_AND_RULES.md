# 🌱 WONKY SPROUT ECOSYSTEM - RULES & WORKFLOW DOCUMENTATION

## For Loading into LLMs (Claude, GPT-4, etc.)

---

# SECTION 1: PROJECT OVERVIEW

## 1.1 What is Wonky Sprout?

**Wonky Sprout** is a neurodiversity-first family care ecosystem built on the **L.O.V.E. Economy** protocol:

- **L**ocalized care networks
- **O**utcome-agnostic value measurement  
- **V**erifiable presence proofs
- **E**nergy-aware resource allocation

### Core Philosophy
> "Every contribution matters. Care is currency. Energy is finite."

### Target Users
- Neurodivergent individuals (autism, ADHD, etc.)
- Caregivers and family members
- Children requiring sensory-safe environments
- Anyone managing chronic energy limitations

---

## 1.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHENIX NAVIGATOR DEVICE                      │
│   ESP32-S3 + Touch LCD + LED Strip + Haptic Motor              │
│   ↕ BLE/Serial via phenix-bridge.js                            │
├─────────────────────────────────────────────────────────────────┤
│                    WEARABLE LAYER                               │
│   Amazfit Balance ←→ gadgetbridge.js ←→ Helios Ring            │
│   biometric-stream.js: HR, HRV, IBI, SpO2, Stress              │
├─────────────────────────────────────────────────────────────────┤
│                    L.O.V.E. ENGINE                              │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│   │ Spoons   │ │ PoC      │ │ Entropy  │ │ ZK       │         │
│   │ Manager  │ │ Engine   │ │ Shield   │ │ Privacy  │         │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘         │
│        └──────┬─────┴──────┬─────┴─────────────┘               │
│               ↓            ↓                                    │
│   ┌──────────────────────────────────────────────────┐         │
│   │            index.js (Orchestrator)               │         │
│   └──────────────────────────────────────────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│                    SUPPORT MODULES                              │
│   calendar.js | family-quest.js | sensory-toolkit.js           │
│   universal-translator.js | IoT Manager + Providers            │
└─────────────────────────────────────────────────────────────────┘
```

---

# SECTION 2: CORE CONCEPTS

## 2.1 Spoon Theory Implementation

**Spoon Theory** quantifies energy as a finite daily resource.

### Key Formulas
```
Daily Spoons = BaseSpoons × BiometricModifier × EnvironmentModifier

BiometricModifier = {
  HRV > 50ms: 1.0 (healthy)
  HRV 30-50ms: 0.85 (stressed)
  HRV < 30ms: 0.7 (exhausted)
}

ActivityCost = BaseCost × DifficultyModifier × TimeOfDayModifier
```

### Transaction Types
- `SPEND` - Activity costs
- `RESTORE` - Rest, sensory breaks
- `TRANSFER` - Family pool borrowing
- `EMERGENCY_RESERVE` - Auto-reserved 2 spoons

---

## 2.2 Proof of Care (PoC)

**PoC** replaces Proof of Work/Stake with presence-verified caregiving.

### The PoC Formula
```
CareScore = (T_prox × w1) + (Q_res × w2) + (E_child × w3)

Where:
  T_prox  = Proximity duration (RSSI-based BLE measurement)
  Q_res   = Physiological resonance (HRV coherence correlation)
  E_child = Child's entropy shield status (did they feel safe?)

Weights: w1=0.4, w2=0.35, w3=0.25
```

### Token Mechanics
- **Minting**: `$CARE` tokens minted on session completion
- **Slashing**: Tokens slashed for abandonment/harm
- **Sanctuary Fund**: 10% of all tokens go to family emergency fund

---

## 2.3 Entropy Shield

Protects children from toxic content while maintaining transparency.

### Entropy Detection
```javascript
calculateAudioEntropy(frequencies) {
  // High entropy = chaotic/aggressive audio
  // Low entropy = calm/predictable audio
  return shannonEntropy(frequencies);
}
```

### Inverse Transparency
- Child sees: "🛡️ Message blocked by your shield"
- Child can request review with parent
- Original message stored encrypted for audit

---

## 2.4 Zero-Knowledge Privacy

GDPR-compliant privacy using cryptographic proofs.

### Supported Proofs
- **Pedersen Commitments**: Hide values while proving properties
- **Range Proofs**: Prove value in range without revealing value
- **ZK-FFT**: Prove spectral analysis without raw biometric data

### Data Rights
- Personal Data Store (PDS) per user
- Crypto-shredding: Delete encryption keys = delete data
- Export in standard JSON format

---

# SECTION 3: MODULE SPECIFICATIONS

## 3.1 File Structure Standard

Every module MUST follow this structure:

```javascript
/**
 * MODULE_NAME - Brief Description
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱[EMOJI]
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const MODULE_CONFIG = {
  // ALL configurable values go here
  // Use SCREAMING_SNAKE_CASE for constants
  // Group related settings in nested objects
};

// ============================================================================
// HELPER CLASSES (if needed)
// ============================================================================

class HelperClass {
  // Supporting classes
}

// ============================================================================
// MAIN CLASS
// ============================================================================

class MainModule extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...MODULE_CONFIG, ...config };
    // Initialize state
  }
  
  // Public methods
  async publicMethod() {}
  
  // Private methods (prefix with _)
  _privateHelper() {}
  
  // Always include getStats()
  getStats() {
    return { /* module statistics */ };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  MODULE_CONFIG,
  MainModule,
  // Export helper classes if needed externally
};
```

---

## 3.2 Event Patterns

All modules MUST emit events for cross-module communication:

```javascript
// Naming: lowercase with underscores
this.emit('spoon_spent', { userId, amount, reason, remaining });
this.emit('alert_triggered', { type, severity, message });
this.emit('device_connected', { deviceId, type, capabilities });

// Listening pattern
otherModule.on('event_name', (data) => this.handleEvent(data));
```

### Standard Events
| Event | Payload | Description |
|-------|---------|-------------|
| `spoon_change` | `{userId, delta, balance}` | Spoon level changed |
| `alert` | `{type, severity, message}` | System alert |
| `biometric_update` | `{metric, value, timestamp}` | New biometric data |
| `shield_activated` | `{childId, reason}` | Entropy shield triggered |
| `poc_session_complete` | `{sessionId, score, tokens}` | Care session ended |

---

## 3.3 Integration Requirements

### Spoons Integration
Every module that costs energy must:
```javascript
// Check before action
const canProceed = await this.spoonsManager.canSpend(userId, cost);
if (!canProceed) {
  return { error: 'Insufficient spoons' };
}

// Spend after action
await this.spoonsManager.spend(userId, cost, 'activity_name');
```

### Biometric Integration
Modules using biometrics must:
```javascript
// Subscribe to biometric events
this.biometricStream.on('data', (data) => {
  if (data.type === 'heart_rate') {
    this.handleHeartRate(data.value);
  }
});

// Handle disconnection gracefully
this.biometricStream.on('disconnected', () => {
  this.useFallbackMode();
});
```

---

# SECTION 4: CODING STANDARDS

## 4.1 JavaScript Standards

### Required
- ES6+ syntax (arrow functions, destructuring, template literals)
- `async/await` for all asynchronous code
- `EventEmitter` for inter-module communication
- JSDoc comments for public methods

### Forbidden
- `var` (use `const` or `let`)
- Callbacks without Promise wrapper
- Global variables
- `eval()` or dynamic code execution

### Naming Conventions
```javascript
// Classes: PascalCase
class SpoonManager {}

// Functions/methods: camelCase
function calculateCost() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_DAILY_SPOONS = 20;

// Private: prefix with underscore
_internalHelper() {}

// Events: lowercase_with_underscores
this.emit('spoon_spent', data);
```

---

## 4.2 Error Handling

```javascript
// Always return objects with error/success
async doAction() {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error('[ModuleName] Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Emit errors for logging
this.emit('error', { module: 'ModuleName', error: error.message });
```

---

## 4.3 Configuration Management

```javascript
// Default config in module
const MODULE_CONFIG = {
  SETTING_A: 'default',
  SETTING_B: 100
};

// Constructor merges user config
constructor(config = {}) {
  this.config = { ...MODULE_CONFIG, ...config };
}

// Access via this.config
someMethod() {
  const value = this.config.SETTING_A;
}
```

---

# SECTION 5: DEVICE SPECIFICATIONS

## 5.1 Supported Wearables

### Amazfit Balance
- **Connection**: Gadgetbridge → BLE
- **Metrics**: HR, HRV, SpO2, Stress, Steps, Sleep, PAI
- **Update Rate**: 1s for HR, 30s for HRV

### Helios Ring
- **Connection**: Direct BLE or companion app
- **Metrics**: HR, HRV, IBI, SpO2, Skin Temp, Readiness
- **Advantage**: High-precision IBI for Q_res calculation

## 5.2 Phenix Navigator (ESP32-S3)

### Hardware
- **MCU**: ESP32-S3-WROOM-1
- **Display**: 3.5" Touch LCD (320x480)
- **LED**: WS2812B strip (8-16 LEDs)
- **Haptic**: Vibration motor
- **Connectivity**: BLE, WiFi

### Communication Protocol
```javascript
// Message format
{
  t: 0x01,        // Command type
  p: { ... },     // Payload
  ts: 1706838000, // Timestamp
  id: 'abc123'    // Message ID
}

// Binary encoding: [length:2][checksum:2][json:n]
// All multi-byte values are LITTLE-ENDIAN (LSB first)
// Length: uint16_t - total packet size including header
// Checksum: CRC-16/CCITT of JSON payload
// JSON: UTF-8 encoded, no null terminator

// Example packet (hex): 0F 00 A3 B2 7B 22 74 22 3A 31 7D
//                       └──┘ └──┘ └─────────────────────┘
//                       len  crc  {"t":1}
```

---

# SECTION 6: WORKFLOW RULES

## 6.1 Development Workflow

1. **Read** existing module to understand current state
2. **Plan** upgrade with feature list
3. **Write** comprehensive implementation (~600-700 lines)
4. **Test** with `npm test` if available
5. **Document** with JSDoc comments

## 6.2 Module Upgrade Checklist

- [ ] Header matches v4.0.0 format
- [ ] CONFIG object comprehensive
- [ ] EventEmitter pattern used
- [ ] Spoons integration present
- [ ] Error handling complete
- [ ] getStats() method included
- [ ] Exports properly structured
- [ ] ~600-700 lines achieved

## 6.3 Integration Testing

After upgrading each module:
```javascript
// Verify exports
const { CONFIG, MainClass } = require('./module');
const instance = new MainClass();

// Verify events
instance.on('some_event', console.log);

// Verify stats
console.log(instance.getStats());
```

## 6.4 Error Recovery Strategies

### BLE Disconnection Handling
All modules must handle BLE disconnection gracefully:

```javascript
// PoC Sessions - Auto-pause with reconnect window
handleBLEDisconnection(sessionId) {
  this.sessions.get(sessionId).status = 'paused';
  this.reconnectTimeout = setTimeout(() => {
    if (this.sessions.get(sessionId).status === 'paused') {
      this.emit('session_timeout', { sessionId, reason: 'ble_disconnect' });
      this.finalizeSession(sessionId, { partial: true });
    }
  }, 30000); // 30 second reconnect window
}

// Biometric Stream - Fall back to last-known-good
handleBiometricDisconnect() {
  this.useFallbackMode = true;
  this.emit('biometric_fallback', { 
    lastKnownHR: this.lastValidHR,
    lastKnownHRV: this.lastValidHRV,
    timestamp: Date.now()
  });
}

// Phenix Bridge - Queue commands for retry
handlePhenixDisconnect() {
  this.commandQueue.pause();
  this.reconnectAttempts = 0;
  this.scheduleReconnect();
}
```

### Recovery Timeouts
| Component | Timeout | Action on Timeout |
|-----------|---------|-------------------|
| PoC Session | 30s | Finalize with partial score |
| Biometric Stream | 60s | Use baseline values |
| Phenix Bridge | 15s | Retry up to 3 times |
| Wearable Sync | 120s | Queue data for batch sync |

### Graceful Degradation
```javascript
// Priority order for degradation
const DEGRADATION_PRIORITY = [
  'led_animations',      // First to disable
  'haptic_feedback',     // Second
  'real_time_sync',      // Third
  'detailed_logging',    // Fourth
  'core_functionality'   // Never disable
];
```

---

# SECTION 7: GLOSSARY

| Term | Definition |
|------|------------|
| **Spoon** | Unit of energy capacity |
| **PoC** | Proof of Care consensus |
| **T_prox** | Temporal proximity (duration together) |
| **Q_res** | Physiological resonance (HRV sync) |
| **Entropy Shield** | Content protection for children |
| **Shield Mode** | Low-spoon protection state |
| **Care Token** | $CARE cryptocurrency |
| **Coherence** | Heart rhythm regularity (~0.1Hz) |
| **IBI** | Inter-Beat Interval (ms between heartbeats) |
| **GenSync** | Generational Synchronization mesh |
| **PDS** | Personal Data Store |

---

# SECTION 8: QUICK REFERENCE

## 8.1 Common Patterns

```javascript
// Spoon check pattern
if (user.currentSpoons < requiredCost) {
  return { error: 'Insufficient spoons', required: requiredCost };
}

// Event emission pattern
this.emit('event_name', {
  timestamp: Date.now(),
  userId: user.id,
  data: relevantData
});

// Config merge pattern
this.config = { ...DEFAULT_CONFIG, ...userConfig };

// Async method pattern
async someMethod(params) {
  try {
    const result = await this._doWork(params);
    this.emit('success', result);
    return { success: true, data: result };
  } catch (error) {
    this.emit('error', { method: 'someMethod', error: error.message });
    return { success: false, error: error.message };
  }
}
```

## 8.2 Color Codes (Spoon States)

| Spoon Level | Color | RGB | Hex |
|-------------|-------|-----|-----|
| Full (>60%) | Green | [0, 255, 100] | #00FF64 |
| Medium (35-60%) | Yellow | [255, 200, 0] | #FFC800 |
| Low (15-35%) | Orange | [255, 100, 0] | #FF6400 |
| Critical (<15%) | Red | [255, 0, 0] | #FF0000 |

## 8.3 Alert Severities

| Severity | Color | Haptic | Sound |
|----------|-------|--------|-------|
| info | Blue | Tap | Chime |
| success | Green | Double-tap | Ding |
| warning | Orange | Long | Alert |
| error | Red | Triple | Alarm |
| critical | Red pulse | Emergency | Siren |

---

**END OF DOCUMENTATION**

*Last Updated: 2026-02-02*
*Version: 4.0.0 - WONKY QUANTUM REFACTOR*
*WONKY SPROUT FOR DA KIDS! 🌱💚*