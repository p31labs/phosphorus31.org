# Phase 2 — Molecular Layer (Dashboard & Navigation)

**Checkpoint 2** deliverables for the P31 Spectrum dashboard and fractal ZUI.

## What was added

### 2.1 — Zustand stores (`src/store/`)

- **useNavigationStore.ts** — `activeNode`, `zoomLevel`, `breadcrumbs`; actions: `navigateTo`, `zoomIn`, `zoomOut`, `resetView`
- **useCopilotStore.ts** — `coherenceLevel`, `copilotMode`, `pendingNotifications`, `speaking`; actions: `setCoherence`, `queueNotification`, `dismissNotification`, `speak`
- **useSensoryStore.ts** — `mode` (`full` | `calm` | `quiet`), `hapticEnabled`; actions: `setMode`, `toggleHaptic`. Helpers: `useAnimationEnabled()`, `useGlowIntensity()` (respects `prefers-reduced-motion`)

### 2.2 — OctahedralNav (`src/organisms/OctahedralNav.tsx`)

- 3D orbital nav: six nodes at Posner P-atom positions in a dedicated R3F Canvas
- Each node is a **GlowBadge** (icon + label); active node scales up and glows more
- **Quiet mode** or **force2D**: static 2D list (accessibility)
- Connects to `useNavigationStore` and `useSensoryStore`

### 2.3 — Spectrum dashboard (`src/organisms/ScopeDashboard.tsx`)

- Full viewport shell: top bar (P31 logo, section name, **PulseIndicator**), left **OctahedralNav**, center content, bottom **SpectrumBar** (³¹P spectrum as nav)
- **FIDTransition** on view changes; **PosnerBackground** when `activeNode === null` (home)
- Placeholder views: Home, Tasks, Health, Projects, Settings (sensory toggles)

### 2.4 — Fractal ZUI (`src/quantum/FractalZUI.tsx`)

- Three zoom levels: **Constellation** (multiple molecules) → **Workspace** (single Posner, 6 nodes + center) → **Data** (selected node expands to inner molecule)
- Camera dolly with spring easing; click node to zoom in, click background to zoom out
- Breadcrumb trail (top-left); data: `{ id, label, type, children? }[]`

### Supporting UI (`src/components/scope/`)

- **GlowBadge** — phosphor glow button with optional icon
- **PulseIndicator** — copilot status (coherence + mode)
- **SpectrumBar** — bottom nav where each peak maps to a section
- **FIDTransition** — smooth view transition (respects reduced motion)
- **PosnerBackground** — low-opacity Posner dots when home

## How to run the Spectrum dashboard

In `App.tsx`, add state and a toggle, then render the dashboard:

```tsx
import { ScopeDashboard } from '@/organisms';

// Inside App:
const [showScope, setShowScope] = useState(false);
// ...
{showScope ? (
  <ScopeDashboard />
) : (
  // existing content
)}
// Add a button or menu item: setShowScope(true)
```

Or render only the Scope as the default view by wrapping your router with `<ScopeDashboard />` for the `/scope` (or `/`) route.

## How to use the Fractal ZUI

```tsx
import { FractalZUI } from '@/quantum/FractalZUI';

const sampleData = [
  { id: '1', label: 'Neural Core', type: 'cluster', children: [
    { id: '1a', label: 'File A', type: 'file' },
    { id: '1b', label: 'File B', type: 'file' },
  ]},
  { id: '2', label: 'Project B', type: 'cluster', children: [] },
];

<FractalZUI data={sampleData} className="h-[400px]" />
```

## Checkpoint 2 verification

- [x] Octahedral nav rotates and navigates between sections
- [x] Spectrum bar at the bottom functions as navigation
- [x] Dashboard shell renders all placeholder views
- [x] ZUI zooms through at least 3 levels with smooth transitions
- [x] Sensory mode toggle works (full → calm → quiet reduces animation/glow)

**Note:** The repo’s full `npm run build` currently fails due to an existing error in `WorldBuilder.tsx` (unclosed JSX). Phase 2 files are self-contained and type-check clean; fix that file to build the whole app.
