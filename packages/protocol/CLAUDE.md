# @p31/protocol — AI Agent Context

**Shared types, tokens, and constants for the P31 ecosystem.**

---

## Quick Reference

- **Location:** `packages/protocol/`
- **Package:** `@p31/protocol` (npm workspace)
- **Stack:** TypeScript (types only, no runtime deps)
- **Status:** Phase 1 — types and constants. No runtime logic yet.
- **Version:** 0.1.0
- **License:** Apache-2.0

---

## What This Is

The single source of truth for types, design tokens, and constants shared across all P31 applications. Any value that appears in more than one component belongs here.

Currently exports:
- **Design tokens** — Colors, fonts, spacing, radii, transitions, glow effects
- **Motion system** — Durations, easings, reduced-motion awareness
- **P31 constants** — HOME_FREQUENCY, GROUND_THRESHOLD, SIC_OVERLAP, etc.
- **Voltage types** — Tier definitions, thresholds, scoring functions
- **Pattern definitions** — Noise detection patterns and weights
- **Triage types** — Status codes, hold reasons, triage decisions
- **Message types** — PatternMatch, VoltageResult, Message, ProcessedMessage
- **WebSocket signals** — Event types, frame structure, typed payloads
- **Mesh types** — Node IDs, vertex IDs, vertex roles
- **L.O.V.E. types** — Transaction types, transaction records
- **Metabolism types** — Brain state shapes, metabolism colors

---

## Module Map

| File | Exports | Used By |
|------|---------|---------|
| `tokens.ts` | `colors`, `productColors`, `fonts`, `typeScale`, `glow`, `spacing`, `radii`, `transitions` | ui/, apps/scope/, apps/sprout/ |
| `tokens.css` | CSS custom properties matching tokens.ts | Any HTML consumer |
| `p31-forms.css` | Form styling tokens | HTML apps |
| `motion.ts` | `motion`, `transition`, `MotionDuration`, `MotionEasing` | ui/ (animation system) |
| `constants.ts` | `P31`, `VOLTAGE_THRESHOLDS`, `VOLTAGE_TIER_MAX` | All components |
| `voltage.ts` | `VoltageTier`, `ThreatLevel`, `voltageTier()`, `threatLevelFromScore()` | apps/shelter/, ui/ |
| `patterns.ts` | `THREAT_PATTERNS`, `PATTERN_WEIGHTS`, `ThreatPattern` | apps/shelter/ (filter) |
| `triage.ts` | `TRIAGE_STATUSES`, `HOLD_REASONS`, `TriageStatus`, `HoldReason`, `TriageDecision` | apps/shelter/ |
| `messages.ts` | `PatternMatch`, `VoltageResult`, `Message`, `ProcessedMessage` | apps/shelter/, ui/ |
| `signals.ts` | `WS_EVENT_TYPES`, `WsEventType`, `WsFrame`, signal data types | apps/shelter/, ui/, apps/sprout/ |
| `mesh.ts` | `NODE_IDS`, `VERTEX_IDS`, `VERTEX_ROLES`, `NodeId`, `VertexId` | All components |
| `love.ts` | `LOVE_TRANSACTION_TYPES`, `LoveTransactionType`, `LoveTransaction` | apps/shelter/, SUPER-CENTAUR/ |
| `metabolism.ts` | `MetabolismColor`, `BrainStateShape` | apps/shelter/, ui/ |
| `index.ts` | Re-exports everything above | Import point |

---

## Usage

```typescript
import { P31, VOLTAGE_THRESHOLDS, colors, motion } from '@p31/protocol';

if (score >= VOLTAGE_THRESHOLDS.HOLD_MIN) {
  // Auto-hold message
}

const bgColor = colors.background;
const fadeIn = motion.duration.normal;
```

---

## Key Constants

```typescript
const P31 = {
  HOME_FREQUENCY: 0.35,      // π/9
  GROUND_THRESHOLD: 3.5,     // Sparks
  SIC_OVERLAP: 1/3,          // SIC-POVM
  MESH_CAPACITY: 0.577,      // 1/√3
  DAMPING_COEFFICIENT: 0.1,  // Governor
  SPARK_DECAY_RATE: 0.1,     // Sparks/hour
};

const VOLTAGE_THRESHOLDS = {
  CAUTION_MAX: 4,   // Below: pass (green)
  HOLD_MIN: 6,      // At or above: auto-hold (orange)
  CRITICAL_MIN: 8,  // At or above: critical alert (red)
  MAX: 10,          // Absolute maximum
};
```

---

## Adding New Types

1. Create a new `.ts` file in `src/` (e.g., `src/sparks.ts`)
2. Define and export your types/constants
3. Re-export from `src/index.ts`
4. All consumers get the new exports via `@p31/protocol`

No build step required — the package points directly at TypeScript source.

---

## Phase Roadmap

| Phase | What | Status |
|-------|------|--------|
| **Phase 1** | Types and constants only | Current |
| **Phase 2** | Pure utility functions (voltage calc, triage logic) | Planned |
| **Phase 3** | Full engine extraction from ui/ and shelter/ | Future |

The goal is to gradually extract shared logic from `ui/src/engine/` and `apps/shelter/src/` into this package so voltage scoring, triage, and metabolism calculations have a single implementation.

---

## No Dependencies

This package has zero runtime dependencies. It exports TypeScript source directly. Consumers must have TypeScript in their build chain.

---

**The protocol is the shared language. The mesh holds.**
