# The Scope — AI Agent Context

## What This Is

Dashboard and visualization frontend for P31 assistive technology.
Tetrahedron node UI, 3D molecule builder, spoon tracking, device status.

**Component Name:** The Scope  
**Location:** `ui/`  
**Status:** 70% → improving after import fixes

---

## Stack

- **React 18** — UI framework
- **TypeScript (strict)** — Type safety
- **Vite** — Build tool
- **Tailwind CSS** — Styling (via PostCSS)
- **Zustand** — State management
- **Three.js / React Three Fiber** — 3D visualizations
- **Vitest** — Testing framework
- **React Testing Library** — Component testing

---

## Architecture: Tetrahedron Nodes

The Scope is organized around the tetrahedron topology — four vertices, six edges, minimum stable system.

### Node Directories

- **`src/nodes/node-a-you/`** — Internal state (spoons, regulation, grounding)
  - `SpoonMeter.tsx` — Energy level display
  - `HeartbeatPanel.tsx` — Status monitoring
  - `YouAreSafe.tsx` — Grounding protocol (reachable in one tap)
  - `SomaticRegulation.tsx` — Breathing exercises

- **`src/nodes/node-b-them/`** — External signal intake (messages, voltage display)
  - `MessageInput.tsx` — Raw message input
  - `CatchersMitt.tsx` — 60-second buffer
  - `MessageList.tsx` — Message history
  - `VoltageDetector.tsx` — Voltage assessment
  - `VoltageGauge.tsx` — Voltage visualization

- **`src/nodes/node-c-context/`** — Environmental calibration (time, mesh, status)
  - `CalibrationReport.tsx` — Context summary
  - `MeshStatus.tsx` — Network status
  - `TimelineView.tsx` — Temporal view

- **`src/nodes/node-d-shield/`** — Processing display (progressive disclosure, response composer)
  - `ProgressiveDisclosure.tsx` — Hides raw text, reveals on consent
  - `ResponseComposer.tsx` — Drafts responses

### Core Directories

- **`src/engine/`** — Pure logic (NO React deps)
  - `voltage-calculator.ts` — Voltage scoring
  - `spoon-calculator.ts` — Spoon cost calculation
  - `shield-filter.ts` — Message filtering
  - `geodesic-engine.ts` — Message analysis

- **`src/stores/`** — Zustand state management
  - `heartbeat.store.ts` — Node A state (spoons, heartbeat)
  - `shield.store.ts` — Node D state (messages, voltage)
  - `buffer.store.ts` — Buffer service state
  - `accessibility.store.ts` — A11y preferences

- **`src/bridge/`** — API/WebSocket/LoRa/Audio clients to backend
  - `api-client.ts` — HTTP client
  - `websocket-client.ts` — WebSocket client
  - `lora-bridge.ts` — LoRa mesh client
  - `audio-bridge.ts` — Audio processing

- **`src/hooks/`** — React hooks
  - `useMetabolism.ts` — Spoon management
  - `useBufferWebSocket.ts` — Buffer connection
  - `useGameEngine.ts` — Game state

---

## Critical Rules

### 1. SpoonMeter Visible on Every Screen
The SpoonMeter component must be visible on every screen. It shows cognitive energy level (spoons) and is critical for self-regulation.

**Implementation:**
- Add `<SpoonMeter />` to main App layout
- Or include in global header/navigation

### 2. YouAreSafe Reachable in One Tap
The YouAreSafe component must be accessible from anywhere in the app with a single tap/click.

**Implementation:**
- Add global keyboard shortcut (e.g., Ctrl+Shift+S)
- Or add always-visible button in global navigation
- Or add to floating action button

### 3. prefers-reduced-motion Kills All Animation
When `prefers-reduced-motion: reduce` is set, ALL animations must be disabled.

**Implementation:**
- Global CSS rule in `styles/accessibility.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- Already implemented ✅

### 4. Stores Don't Import Other Stores
Stores communicate via types only. Components wire them together.

**Pattern:**
```typescript
// ✅ Good
const spoons = useHeartbeatStore((s) => s.operator.spoons);
const voltage = useShieldStore((s) => s.voltage);

// ❌ Bad
import { useHeartbeatStore } from './heartbeat.store';
const heartbeat = useHeartbeatStore(); // Don't import stores in stores
```

### 5. Engine Files Have Zero React Imports
Engine files (`src/engine/`) are pure functions. No React, no hooks, no DOM.

**Pattern:**
```typescript
// ✅ Good - engine/voltage-calculator.ts
export function calculateVoltage(message: string): number {
  // Pure function, no React
}

// ❌ Bad
import { useState } from 'react'; // NO REACT IN ENGINE
```

### 6. Three.js Lazy-Loaded, Never Blocking Initial Render
Three.js components are heavy. They must be lazy-loaded and never block the initial render.

**Pattern:**
```typescript
// ✅ Good
const P31MoleculeViewer = React.lazy(() => import('./P31MoleculeViewer'));

// ❌ Bad
import P31MoleculeViewer from './P31MoleculeViewer'; // Blocks initial render
```

---

## Testing

**Framework:** Vitest + React Testing Library  
**Coverage Target:** 60% statements minimum  
**Config:** `vitest.config.ts`

**Run Tests:**
```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Test Files:**
- `src/nodes/**/*.test.tsx` — Component tests
- `src/engine/__tests__/*.test.ts` — Engine tests

---

## Build Targets

### Browser Dev
```bash
npm run dev
```
- Development server
- Hot module replacement
- Source maps

### Production Build
```bash
npm run build
```
- Optimized bundle
- Minified
- Tree-shaken
- Size target: <2MB (with Three.js)

### SPIFFS Build (ESP32)
```bash
npm run build:spiffs
```
- Base path: `/web/`
- Size target: <500KB (lite build without Three.js)
- Output: `dist/` → copy to `firmware/node-one-esp-idf/spiffs/web/`

---

## Key Dependencies

### Production
- `react` / `react-dom` — UI framework
- `zustand` — State management
- `three` / `@react-three/fiber` / `@react-three/drei` — 3D
- `lucide-react` — Icons
- `tailwindcss` — Styling

### Development
- `vitest` — Testing
- `@testing-library/react` — Component testing
- `@axe-core/react` — A11y testing (dev only)
- `typescript` — Type checking
- `eslint` / `prettier` — Code quality

---

## File Structure

```
ui/
├── src/
│   ├── nodes/           # Tetrahedron node components
│   ├── engine/          # Pure logic (no React)
│   ├── stores/          # Zustand stores
│   ├── bridge/          # Backend clients
│   ├── hooks/           # React hooks
│   ├── components/      # Shared components
│   ├── types/           # TypeScript types
│   ├── config/          # Configuration
│   └── styles/          # CSS files
├── dist/                # Build output
├── vite.config.ts       # Vite config
├── vitest.config.ts     # Test config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

---

## Common Patterns

### Using Stores
```typescript
import { useSpoons, useHeartbeatStatus } from '@/stores/heartbeat.store';

function MyComponent() {
  const spoons = useSpoons();
  const heartbeat = useHeartbeatStatus();
  // ...
}
```

### Using Engine Functions
```typescript
import { calculateVoltage } from '@/engine/voltage-calculator';

const voltage = calculateVoltage(messageText);
```

### Lazy-Loading 3D Components
```typescript
import { lazy, Suspense } from 'react';

const P31MoleculeViewer = lazy(() => import('./P31MoleculeViewer'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <P31MoleculeViewer />
    </Suspense>
  );
}
```

---

## Known Issues

1. **Build failing** — TypeScript errors (expected, import fix swarm may not be complete)
2. **Shield Store bug** — CatchersMitt API mismatch (lines 260, 267)
3. **Store-Component mismatches** — Components expect properties that don't exist in stores

---

## Related Components

- **The Buffer** (`cognitive-shield/`) — Voltage scoring engine
- **The Centaur** (`SUPER-CENTAUR/`) — Backend AI
- **NODE ONE** (`firmware/`) — ESP32-S3 hardware

---

**The Scope shows the truth. The Buffer protects from the lie. The mesh holds.** 🔺
