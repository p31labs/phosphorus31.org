# 🌱 WONKY SPROUT L.O.V.E. ECONOMY - CONTINUATION PROMPT

## FOR NEW CHAT WINDOW

Copy and paste this into a new chat:

---

## CONTEXT: WONKY QUANTUM REFACTOR - L.O.V.E. Economy v4.0.0

You are continuing the comprehensive upgrade of the **Wonky Sprout L.O.V.E. Economy** system in the Cognitive Shield project.

### PROJECT LOCATION
- **Workspace**: `c:\MASTER_PROJECT\67`
- **Target Directory**: `sovereign-agent-core/src/protocols/love-economy/`
- **Git Remote**: `https://github.com/trimtab-signal/cognitive-shield.git`

### ⚠️ PRE-WORK VERIFICATION (ALWAYS DO THIS FIRST)
Before starting ANY work, verify the workspace state:

```bash
cd c:\MASTER_PROJECT\67
git status
git log --oneline -3
wc -l sovereign-agent-core/src/protocols/love-economy/*.js
```

This confirms:
1. You're on the correct branch
2. No uncommitted changes that could be lost
3. Actual line counts of existing modules

### ✅ ALREADY UPGRADED (DO NOT TOUCH)
These modules have `L.O.V.E. Economy v4.0.0` header and ~600-700 lines:

| Module | Status | Lines | Key Features |
|--------|--------|-------|--------------|
| `index.js` | ✅ | ~700 | Full orchestration, event bus |
| `proof-of-care.js` | ✅ | ~650 | T_prox, Q_res, token minting, slashing |
| `entropy-shield.js` | ✅ | ~500 | Audio entropy, toxicity detection |
| `zk-privacy.js` | ✅ | ~700 | Pedersen commitments, range proofs |
| `gadgetbridge.js` | ✅ | ~700 | Amazfit Balance + Helios Ring |
| `spoons.js` | ✅ | ~700 | Transactions, forecasting, family pool |
| `biometric-stream.js` | ✅ | ~700 | HRV calculator, coherence tracking |
| `phenix-bridge.js` | ✅ | ~700 | ESP32 LED/Haptic/Display |
| `calendar.js` | ✅ | ~600 | Spoon forecasting, care sessions |
| `family-quest.js` | ✅ | ~700 | XP/Quests/Achievements |

### 📋 MODULES TO UPGRADE (YOUR TASK)

**VERIFIED STATUS (as of 2026-02-02):**

| Module | Current State | Action Needed |
|--------|---------------|---------------|
| `sensory-toolkit.js` | ~600 lines, NO v4.0.0 header | Add header + CONFIG export |
| `universal-translator.js` | Unknown | Verify then upgrade |
| `iot/manager.js` | ~100 lines, basic | Full rewrite to ~600 lines |
| `iot/hue.js` | Unknown | Verify then upgrade |
| `iot/govee.js` | Unknown | Verify then upgrade |
| `iot/homeassistant.js` | Unknown | Verify then upgrade |
| `iot/smartthings.js` | Unknown | Verify then upgrade |
| `iot/ifttt.js` | Unknown | Verify then upgrade |

**Priority Order:**
1. **`sensory-toolkit.js`** - Add v4.0.0 header, CONFIG export, getStats() method
2. **`universal-translator.js`** - GenSync mesh, communication modes
3. **`iot/manager.js`** - Full rewrite with unified device orchestration
4. **`iot/hue.js`** - Philips Hue v2 API
5. **`iot/govee.js`** - Govee LAN + Cloud API
6. **`iot/homeassistant.js`** - Home Assistant REST API
7. **`iot/smartthings.js`** - SmartThings Cloud API
8. **`iot/ifttt.js`** - IFTTT webhooks

### 🎯 UPGRADE PATTERN (FOLLOW THIS)

Each module should:
1. Have `L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR` header
2. Include `WONKY SPROUT FOR DA KIDS! 🌱` tagline
3. Use ~600-700 lines of comprehensive implementation
4. Include `EventEmitter` for event-driven architecture
5. Export a `CONFIG` object and main classes
6. Integrate with Spoons, PoC, and Entropy Shield

### STANDARD FILE STRUCTURE
```javascript
/**
 * MODULE_NAME - Description
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const MODULE_CONFIG = {
  // Comprehensive config object
};

// ============================================================================
// MAIN CLASS
// ============================================================================

class MainClass extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...MODULE_CONFIG, ...config };
    // Implementation
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  MODULE_CONFIG,
  MainClass
};
```

### SPECIFIC MODULE REQUIREMENTS

#### sensory-toolkit.js
- Sensory profiles (visual, audio, tactile, vestibular, proprioceptive)
- Stim presets (calming, alerting, organizing)
- Intensity scales (1-10 with descriptions)
- Spoon cost per sensory activity
- IoT scene triggers

#### universal-translator.js
- GenSync mesh protocol
- Communication modes (visual, verbal, minimal, AAC)
- Emotion translation
- Spoon-aware message simplification
- Family sync

#### iot/manager.js
- Unified device registry
- Scene management
- Spoon-triggered automations
- Shield mode scenes
- Device health monitoring

#### iot/hue.js, govee.js, etc.
- Full API implementation
- Scene presets for cognitive states
- Spoon level color mapping
- Alert patterns
- Calming routines

### COMMAND
**Start with `sensory-toolkit.js`** - Create the full ~600 line implementation following the pattern above.

---

### 🔍 MODULE STATUS VERIFICATION

Before upgrading any module, verify its current state:

```bash
# Check if file exists and get line count
wc -l sovereign-agent-core/src/protocols/love-economy/sensory-toolkit.js

# Check for v4.0.0 header (should return match if upgraded)
head -10 sovereign-agent-core/src/protocols/love-economy/sensory-toolkit.js | grep -i "v4.0.0"

# Quick validation of exports
node -e "const m = require('./sovereign-agent-core/src/protocols/love-economy/sensory-toolkit.js'); console.log(Object.keys(m));"
```

**If module already shows v4.0.0 and ~600+ lines, SKIP IT and move to the next.**

### 🚨 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| `wc` not found (Windows) | Use PowerShell: `(Get-Content file.js).Count` |
| Module import fails | Check for syntax errors with `node --check file.js` |
| Git conflicts | Run `git stash` before starting, `git stash pop` after |
| Wrong workspace | Verify with `pwd` or `cd` - must be in `c:\MASTER_PROJECT\67` |

### 📝 PROGRESS TRACKING

After completing each module, update this checklist:

```markdown
## Session Progress
- [ ] sensory-toolkit.js (~600 lines)
- [ ] universal-translator.js (~600 lines)
- [ ] iot/manager.js (~600 lines)
- [ ] iot/hue.js (~500 lines)
- [ ] iot/govee.js (~500 lines)
- [ ] iot/homeassistant.js (~500 lines)
- [ ] iot/smartthings.js (~500 lines)
- [ ] iot/ifttt.js (~400 lines)
```

---

## END OF CONTINUATION PROMPT
