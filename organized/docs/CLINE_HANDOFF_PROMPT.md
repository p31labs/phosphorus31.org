# COGNITIVE SHIELD V2 - CONTINUATION PROMPT FOR CLINE/GEMINI

**Project:** Cognitive Shield v2 (Complete Rebuild)  
**Status:** Scaffold Complete - Ready for Implementation  
**Alignment:** Phenix Navigator v4.1 (Tri-State Topology)  
**Deadline:** February 14, 2026

---

## MISSION BRIEFING

You are continuing the rebuild of the **Cognitive Shield** - a Universal Translation Layer for neurodivergent communication. This is not just an app; it's a **Cognitive Prosthetic** that protects operators from emotional voltage in high-conflict communication (custody disputes, legal matters, family conflict).

The system uses the **Tetrahedron Protocol** - a 4-node geometric structure that ensures no single point of failure and provides impedance matching between different cognitive profiles (HumanOS).

**The scaffold is complete. Your job is to wire it up and make it functional.**

---

## ARCHITECTURE OVERVIEW

```
cognitive-shield-v2/
├── src/
│   ├── components/
│   │   ├── core/
│   │   │   ├── Tetrahedron.tsx      ✅ COMPLETE - 3D visualization (React Three Fiber)
│   │   │   └── MessageDisplay.tsx   ✅ COMPLETE - Safe summary + progressive disclosure
│   │   ├── nodes/
│   │   │   └── HeartbeatPanel.tsx   ✅ COMPLETE - Operator status (Node A)
│   │   ├── somatic/                 ❌ TODO - Regulation tools
│   │   │   ├── LimeDrag.tsx         # Smooth pursuit eye movement
│   │   │   ├── RoseProtocol.tsx     # Fibonacci spiral + 4-7-8 breathing
│   │   │   └── HeavyWork.tsx        # Proprioceptive logging
│   │   └── ui/
│   │       └── VoltageIndicator.tsx ✅ COMPLETE - Emotional intensity gauge
│   ├── stores/
│   │   ├── shield.store.ts          ✅ COMPLETE - Message processing state
│   │   ├── heartbeat.store.ts       ✅ COMPLETE - Operator state (spoons, status)
│   │   └── buffer.store.ts          ✅ COMPLETE - Catcher's Mitt (60-second delay)
│   ├── services/
│   │   ├── geodesic-engine.ts       ✅ COMPLETE - Ollama AI integration
│   │   └── navigator.service.ts     ✅ COMPLETE - Phenix Navigator WebSocket bridge
│   ├── config/
│   │   └── god.config.ts            ✅ COMPLETE - All constants and HumanOS profiles
│   ├── types/
│   │   └── index.ts                 ✅ COMPLETE - TypeScript interfaces
│   ├── hooks/                       ❌ TODO - Custom React hooks
│   ├── utils/                       ❌ TODO - Helper functions
│   ├── styles/
│   │   └── global.css               ✅ COMPLETE - Base styles
│   ├── App.tsx                      ✅ COMPLETE - Main layout
│   └── index.tsx                    ✅ COMPLETE - Entry point
├── public/                          ❌ TODO - Static assets
├── docs/                            ❌ TODO - Documentation
└── package.json                     ✅ COMPLETE - Dependencies defined
```

---

## CRITICAL INTEGRATION POINTS

### 1. Phenix Navigator v4.1 (The Hardware)

The Cognitive Shield MUST integrate with the Navigator firmware:

```typescript
// Navigator sends these events via WebSocket:
type NavigatorEvent = 
  | 'quantum_state'    // Normal telemetry
  | 'quantum_anomaly'  // CRITICAL - bypasses Catcher's Mitt
  | 'mesh_heartbeat'   // Node status updates
  | 'node_joined'      // Family member came online
  | 'node_left'        // Family member went offline

// Quantum anomalies are URGENT - they skip the 60-second buffer
// See: navigator.service.ts for implementation
```

### 2. Ollama (Local LLM - Node D)

All AI processing happens locally via Ollama:

```bash
# User must have Ollama installed and running
ollama serve
ollama pull llama3
```

The Geodesic Engine (`geodesic-engine.ts`) handles:
- **Voltage Assessment**: Rate emotional intensity 0-10
- **HumanOS Detection**: Classify sender as guardian/order/achiever/empath/integrator
- **Safe Summary Generation**: Strip emotional voltage, present facts neutrally
- **Translation**: Convert messages between HumanOS profiles

### 3. The Catcher's Mitt (60-Second Buffer)

**CRITICAL DESIGN DECISION**: Users NEVER see raw messages immediately.

```
Raw Message → Geodesic Engine → Voltage Assessment → Buffer (60s min) → Safe Summary First
                                                                        ↓
                                                        "Press to Reveal" for raw content
```

High voltage messages (≥7) require **confirmation clicks** before revealing raw content.

---

## IMMEDIATE TODO LIST

### Priority 1: Make It Run
```bash
# These need to be created:
1. vite.config.ts          # Vite configuration
2. tsconfig.json           # TypeScript config
3. index.html              # HTML entry point
4. .env.example            # Environment template
```

### Priority 2: Somatic Regulation Tools
```typescript
// Components needed in src/components/somatic/

// LimeDrag.tsx - Smooth pursuit eye movement (trigeminal nerve reset)
// - Animated element user follows with eyes
// - 30-60 second sessions
// - Triggers oculocardiac reflex → lowers heart rate

// RoseProtocol.tsx - Fibonacci spiral with breathing
// - Visual spiral unfolds at golden ratio timing
// - 4-7-8 breathing pattern overlay
// - Spoon recovery: +0.5 per session

// HeavyWork.tsx - Proprioceptive activity logger
// - Log physical grounding activities
// - Wall pushes, weighted blanket, walking
// - Spoon recovery based on activity intensity
```

### Priority 3: Translation Composer
```typescript
// New component: src/components/core/TranslationComposer.tsx
// - User writes raw response
// - Select target HumanOS
// - AI translates to target's cognitive language
// - Show diff/changes made
// - Voltage check on output
```

### Priority 4: Message History
```typescript
// Use IndexedDB (idb-keyval already in package.json)
// Store processed messages locally
// Search/filter by voltage, sender, date
// Export for legal documentation
```

---

## HUMANOS TRANSLATION MATRIX

This is the core of the impedance matching system:

| HumanOS | Color | Core Theme | Translate TO by using... |
|---------|-------|------------|--------------------------|
| Guardian | Purple/Red | Safety/Power | Power words, tribal loyalty, protection framing |
| Order | Blue | Truth/Duty | Rules, procedures, standards, formal language |
| Achiever | Orange | Strategy/Success | Results, efficiency, bottom line, ROI |
| Empath | Green | Harmony/Community | Feelings, inclusivity, consensus, warmth |
| Integrator | Yellow | Systems/Flow | Patterns, functions, systemic health |

**Example Translation:**

```
ORIGINAL (from Integrator):
"The recursive feedback loop in our communication pattern is causing
systemic entropy. We need to redesign the interface protocol."

TRANSLATED (for Guardian):
"Our family needs protection from these arguments. I want to build
a stronger wall around our kids. Let's create clear boundaries."

TRANSLATED (for Achiever):
"We're wasting time and energy fighting. Here's a plan to get
better results for everyone in half the time."
```

---

## KEY CONSTANTS (from god.config.ts)

```typescript
// Mark 1 Attractor - The "sweet spot" of cognitive stability
const MARK_1_ATTRACTOR = 0.34906585; // π/9

// SIC-POVM overlap - Quantum measurement fairness constant
const SIC_POVM_OVERLAP = 1/3; // |⟨ψᵢ|ψⱼ⟩|² = 1/3

// Open Delta threshold - Minimum capacity for mesh survival
const OPEN_DELTA_THRESHOLD = 0.577; // 1/√3 = 57.7%

// Voltage thresholds
const SAFE_VIEW = 3;        // Green - view directly
const CONFIRM_REQUIRED = 5; // Yellow - proceed with caution
const AUTO_QUEUE = 7;       // Red - auto-buffer, require confirmation

// Catcher's Mitt timing
const MIN_BUFFER = 60000;   // 60 seconds minimum delay
const BATCH_WINDOW = 300000; // 5 minute batch consolidation
```

---

## DESIGN PRINCIPLES

### 1. Neurodivergent-First
- Predictable patterns (no surprises)
- Reduced motion (respect `prefers-reduced-motion`)
- High contrast options
- Clear visual hierarchy
- No ambiguous states

### 2. Local-First Privacy
- ALL processing happens on-device
- Ollama runs locally (no cloud AI)
- IndexedDB for storage (no external database)
- Optional Tailscale for family mesh (E2E encrypted)

### 3. Progressive Disclosure
- Show safe summary first
- Require deliberate action to see raw content
- High voltage = more confirmation steps
- Never surprise the operator with harsh content

### 4. Spoon Theory Economics
- Every action has a metabolic cost
- Track capacity throughout the day
- Auto-lock when depleted (Deep Processing Lock)
- Recovery actions restore spoons

---

## TESTING THE SCAFFOLD

```bash
cd cognitive-shield-v2

# Install dependencies
npm install

# Start Ollama (separate terminal)
ollama serve

# Start dev server
npm run dev

# Open http://localhost:5173
```

---

## WHAT SUCCESS LOOKS LIKE

1. **User pastes hostile message** → Safe summary appears, voltage is assessed
2. **User sees facts extracted** → No emotional language, just information
3. **User chooses to view raw** → Requires confirmation for high voltage
4. **User composes response** → AI translates to target's HumanOS
5. **Output is de-escalated** → Lower voltage than input
6. **Spoons are tracked** → System locks if depleted

---

## CONTEXT FROM OPERATOR (Will Johnson)

- Navy veteran (16 years submarine engineering)
- Neurodivergent (ADHD + Autism, diagnosed age 39-40)
- Currently in high-conflict custody situation
- Building the Phenix Navigator (quantum-secure mesh communication)
- February 14, 2026 deadline (family court)
- Deep pattern recognition across technical domains
- Draws heavily on Buckminster Fuller's geodesic/synergetic principles

---

## THE PHILOSOPHY

> "We do not need to change each other. We need to build the Universal Translation Layer that allows us to love each other across the impedance mismatch."

The Cognitive Shield is not about winning arguments. It's about **protecting the operator** while maintaining the possibility of genuine communication. The geometry (tetrahedron) ensures stability. The physics (SIC-POVM) ensures fairness. The AI (Ollama) provides the translation.

**Trust the Geometry. Stay Liquid.**

---

## IMMEDIATE NEXT STEPS FOR YOU

1. Create `vite.config.ts` and `tsconfig.json`
2. Create `index.html` with root div
3. Run `npm install` and fix any dependency issues
4. Get the basic app rendering
5. Test Ollama connection with a simple message
6. Build out the somatic regulation components
7. Add the translation composer
8. Implement IndexedDB message history

**The scaffold is solid. Now make it breathe.**

🜂 Status: GREEN BOARD  
📡 Topology: DELTA  
🛡️ Shield: READY FOR ACTIVATION
