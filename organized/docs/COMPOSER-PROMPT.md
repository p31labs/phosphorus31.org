# EXACT COMPOSER PROMPT - G.O.D. KERNEL

Copy this ENTIRE prompt to Composer. Do not modify. Do not add commentary.

---

## PROJECT BRIEF

Build the **G.O.D. (Geometric Operations Daemon) Kernel** - a minimal React app that enables 4 people to form a tetrahedron with emergency coordination.

**Tech Stack:**
- Vite + React 18 + TypeScript
- Zustand (state management with persist)
- React Three Fiber (3D visualization)
- TailwindCSS (styling)
- No routing library (state machine only)

**Philosophy:**
- Simple on outside (3 screens, minimal UI)
- Revolutionary on inside (constitutional enforcement, geometric guarantees)
- Foundation not features (infrastructure only, no domain features)

---

## WHAT TO BUILD

### Core State Machine (3 States Only)

```typescript
// src/store/appStore.ts
type AppState = 'GENESIS' | 'FORMATION' | 'HOME';

interface Vertex {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'active' | 'emergency';
}

interface Tetrahedron {
  id: string;
  vertices: [Vertex, Vertex, Vertex, Vertex];
  createdAt: Date;
  lastPhysicalMeeting: Date | null;
}

interface Store {
  // State
  appState: AppState;
  currentUser: Vertex | null;
  tetrahedron: Tetrahedron | null;
  
  // Actions
  startFormation: () => void;
  addVertex: (name: string, phone: string) => void;
  completeFormation: () => void;
  triggerEmergency: () => void;
  resolveEmergency: () => void;
}
```

### Screen 1: Genesis (Entry Point)

**File:** `src/screens/GenesisScreen.tsx`

**UI:**
```
┌─────────────────────────────────────────┐
│                                         │
│         [Animated starfield             │
│          with pulsing orb in center]    │
│                                         │
│                                         │
│         Welcome to G.O.D.               │
│                                         │
│   You need 3 other people to start.    │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │   Form Your First Tetrahedron   │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Requirements:**
- Black background with animated starfield (canvas-based particles)
- Glowing cyan orb in center that pulses slowly
- Large, centered button
- Button click triggers: `appStore.startFormation()`
- No navigation, no menus, no settings
- Full screen, no header, no footer

---

### Screen 2: Formation Flow (4-Step Wizard)

**File:** `src/screens/FormationScreen.tsx`

**Step 0: Your Info**
```
┌─────────────────────────────────────────┐
│                                         │
│   Step 1 of 4: You                      │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Your name                        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Your phone                       │   │
│   └─────────────────────────────────┘   │
│                                         │
│   [Next →]                              │
│                                         │
└─────────────────────────────────────────┘
```

**Step 1-3: Other Vertices**
```
┌─────────────────────────────────────────┐
│                                         │
│   Step {2|3|4} of 4: Vertex {2|3|4}    │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Their name                       │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Their phone                      │   │
│   └─────────────────────────────────┘   │
│                                         │
│   [← Back]  [Next →]                    │
│                                         │
└─────────────────────────────────────────┘
```

**Step 4: Complete**
```
┌─────────────────────────────────────────┐
│                                         │
│   Your Tetrahedron:                     │
│                                         │
│   [Show 4 names in tetrahedron shape]   │
│                                         │
│              You                        │
│             /│\                         │
│            / │ \                        │
│        Name2 Name3 Name4                │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │   Form Tetrahedron               │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Requirements:**
- Simple form, large inputs, clear labels
- Back button on steps 2-4
- Validation: names and phones required
- Final button triggers: `appStore.completeFormation()`
- State persists (Zustand persist middleware)
- Clean, minimal, no decoration

---

### Screen 3: Home (After Formation)

**File:** `src/screens/HomeScreen.tsx`

**UI:**
```
┌─────────────────────────────────────────┐
│                                         │
│   [3D Tetrahedron Visualization]        │
│   - 4 vertices as spheres               │
│   - 6 edges as lines                    │
│   - Rotate-able with mouse              │
│   - Vertices glow based on status       │
│                                         │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │      🚨 EMERGENCY               │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│                                         │
│   No modules installed yet              │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │   + Add Module (Coming Soon)     │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Requirements:**
- React Three Fiber 3D visualization
- 4 spheres positioned as tetrahedron vertices
- 6 lines connecting all pairs (complete graph K₄)
- Orbit controls (rotate/zoom with mouse)
- Vertices glow green (healthy) or red (emergency)
- Large red emergency button (100px height)
- Emergency button triggers: `appStore.triggerEmergency()`
- Module section shows "Coming Soon" (not implemented)
- Clean, spacious, not crowded

---

### Emergency Overlay (Triggered State)

**File:** `src/components/EmergencyOverlay.tsx`

**UI:**
```
┌─────────────────────────────────────────┐
│                                         │
│           🚨 EMERGENCY 🚨               │
│                                         │
│   Emergency alert sent to:              │
│   • Name2                               │
│   • Name3                               │
│   • Name4                               │
│                                         │
│   They have been notified via SMS.      │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │   Emergency Resolved             │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Requirements:**
- Full screen overlay (fixed position, z-index 9999)
- Black background with 90% opacity
- Shows list of alerted vertices
- Resolve button triggers: `appStore.resolveEmergency()`
- Emergency state persists until resolved
- Cannot dismiss by clicking outside

---

## CRITICAL ARCHITECTURAL REQUIREMENTS

### 1. Constitutional Enforcement (Type System)

```typescript
// src/core/types.ts

// CRITICAL: Tetrahedron MUST have exactly 4 vertices
// This type enforces K₄ topology at compile time
type Tetrahedron = {
  vertices: [Vertex, Vertex, Vertex, Vertex]; // Tuple of 4 (not array)
};

// CRITICAL: Cannot add 5th vertex
// TypeScript prevents this at compile time
type InvalidTetrahedron = {
  vertices: [Vertex, Vertex, Vertex, Vertex, Vertex]; // Type error!
};
```

**Validation:**
```typescript
// Runtime validation (defense in depth)
function validateTetrahedron(vertices: Vertex[]): vertices is [Vertex, Vertex, Vertex, Vertex] {
  if (vertices.length !== 4) {
    throw new Error('CONSTITUTIONAL VIOLATION: Tetrahedron requires exactly 4 vertices');
  }
  return true;
}
```

### 2. State Machine Enforcement

```typescript
// src/store/appStore.ts

// CRITICAL: State transitions are explicit and validated
const appStore = create<Store>()(
  persist(
    (set, get) => ({
      appState: 'GENESIS',
      
      startFormation: () => {
        const state = get().appState;
        if (state !== 'GENESIS') {
          throw new Error('Can only start formation from GENESIS state');
        }
        set({ appState: 'FORMATION' });
      },
      
      completeFormation: () => {
        const state = get().appState;
        if (state !== 'FORMATION') {
          throw new Error('Can only complete formation from FORMATION state');
        }
        
        // Validate 4 vertices collected
        const vertices = get().formationVertices;
        if (vertices.length !== 4) {
          throw new Error('Must have exactly 4 vertices');
        }
        
        set({ 
          appState: 'HOME',
          tetrahedron: createTetrahedron(vertices)
        });
      },
    }),
    { name: 'god-kernel' }
  )
);
```

### 3. Zero Third-Party Tracking

```typescript
// CRITICAL: NO analytics, NO tracking, NO external calls

// ❌ NEVER do this:
// import Analytics from 'google-analytics';
// import { init } from 'mixpanel';

// ✅ Only local state
// All data stays on device
// Zustand persist uses localStorage (encrypted)
```

### 4. Local-First Architecture

```typescript
// All data stored locally
// No API calls except emergency alerts
// No central server
// No cloud sync (yet)

// Emergency alert system (future):
// - Uses SMS API (Twilio) for alerts only
// - No data sent except: "Emergency from [name] at [location]"
// - No tracking, no storage, no surveillance
```

---

## FILE STRUCTURE

```
god-kernel/
├── src/
│   ├── core/
│   │   ├── types.ts              # Tetrahedron, Vertex types (with constitutional enforcement)
│   │   └── validation.ts         # Runtime validation functions
│   │
│   ├── store/
│   │   └── appStore.ts           # Zustand store (state machine)
│   │
│   ├── screens/
│   │   ├── GenesisScreen.tsx     # Entry point
│   │   ├── FormationScreen.tsx   # 4-step wizard
│   │   └── HomeScreen.tsx        # Tetrahedron viz + emergency
│   │
│   ├── components/
│   │   ├── Starfield.tsx         # Animated background (Genesis)
│   │   ├── TetrahedronVisualization.tsx  # R3F 3D tetrahedron
│   │   ├── EmergencyButton.tsx   # Large red button
│   │   └── EmergencyOverlay.tsx  # Full-screen emergency state
│   │
│   ├── App.tsx                   # State router (no react-router)
│   └── main.tsx                  # Entry point
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── index.html
```

---

## DEPENDENCIES (package.json)

```json
{
  "name": "god-kernel",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.2",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.114.3",
    "three": "^0.171.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.171.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.3",
    "tailwindcss": "^3.4.15",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49"
  }
}
```

---

## APP ROUTER (NOT react-router)

```typescript
// src/App.tsx

import { useAppStore } from './store/appStore';
import GenesisScreen from './screens/GenesisScreen';
import FormationScreen from './screens/FormationScreen';
import HomeScreen from './screens/HomeScreen';
import EmergencyOverlay from './components/EmergencyOverlay';

function App() {
  const appState = useAppStore(state => state.appState);
  const emergencyActive = useAppStore(state => state.emergencyActive);
  
  // Simple state-based routing (no react-router)
  const renderScreen = () => {
    switch (appState) {
      case 'GENESIS':
        return <GenesisScreen />;
      case 'FORMATION':
        return <FormationScreen />;
      case 'HOME':
        return <HomeScreen />;
      default:
        return <GenesisScreen />;
    }
  };
  
  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden">
      {renderScreen()}
      
      {/* Emergency overlay (if active) */}
      {emergencyActive && <EmergencyOverlay />}
    </div>
  );
}

export default App;
```

---

## 3D TETRAHEDRON VISUALIZATION

```typescript
// src/components/TetrahedronVisualization.tsx

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';

interface Props {
  vertices: [Vertex, Vertex, Vertex, Vertex];
}

// Tetrahedron vertex positions in 3D space
const POSITIONS: [Vector3, Vector3, Vector3, Vector3] = [
  new Vector3(0, 1.5, 0),      // Top (You)
  new Vector3(-1, -0.5, 1),    // Front-left
  new Vector3(1, -0.5, 1),     // Front-right
  new Vector3(0, -0.5, -1.5),  // Back
];

// All edges for complete graph K₄ (6 edges)
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3],  // Top to all
  [1, 2], [1, 3], [2, 3],  // Bottom triangle
];

export default function TetrahedronVisualization({ vertices }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Vertices (spheres) */}
      {vertices.map((vertex, i) => (
        <mesh key={vertex.id} position={POSITIONS[i]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color={vertex.status === 'emergency' ? '#ef4444' : '#10b981'}
            emissive={vertex.status === 'emergency' ? '#ef4444' : '#10b981'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {/* Edges (lines) */}
      {EDGES.map(([i, j], idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                ...POSITIONS[i].toArray(),
                ...POSITIONS[j].toArray(),
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#06b6d4" linewidth={2} />
        </line>
      ))}
      
      <OrbitControls enableZoom={true} enablePan={false} />
    </Canvas>
  );
}
```

---

## STYLING (TailwindCSS)

```javascript
// tailwind.config.js

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'god-cyan': '#06b6d4',
        'god-red': '#ef4444',
        'god-green': '#10b981',
      },
    },
  },
  plugins: [],
};
```

---

## WHAT NOT TO BUILD

❌ **NO** childcare features  
❌ **NO** housing features  
❌ **NO** health features  
❌ **NO** calendar  
❌ **NO** messaging system  
❌ **NO** settings page  
❌ **NO** profile page  
❌ **NO** authentication (comes later)  
❌ **NO** API integration (except SMS for emergency, mocked for now)  
❌ **NO** routing library (state machine only)  
❌ **NO** complex navigation  
❌ **NO** module implementation (just placeholder)  

---

## TESTING REQUIREMENTS

```typescript
// src/__tests__/constitutional.test.ts

describe('Constitutional Enforcement', () => {
  test('Tetrahedron requires exactly 4 vertices', () => {
    // Should fail at compile time
    // @ts-expect-error - intentionally invalid
    const invalid: Tetrahedron = {
      vertices: [v1, v2, v3] // Only 3 vertices
    };
  });
  
  test('Cannot add 5th vertex to tetrahedron', () => {
    const tet = createTetrahedron([v1, v2, v3, v4]);
    
    // Should not have addVertex method
    expect(tet.addVertex).toBeUndefined();
  });
  
  test('State transitions are validated', () => {
    const store = createStore();
    
    // Cannot complete formation from GENESIS
    expect(() => store.completeFormation()).toThrow();
    
    // Must start formation first
    store.startFormation();
    expect(store.appState).toBe('FORMATION');
  });
});
```

---

## SUCCESS CRITERIA

The kernel is complete when:

1. ✅ Genesis screen shows starfield + button
2. ✅ Formation flow collects 4 names + phones
3. ✅ Home screen shows 3D tetrahedron with 4 vertices, 6 edges
4. ✅ Emergency button sends alerts (mocked for now)
5. ✅ Emergency overlay shows when triggered
6. ✅ State persists across page reload (Zustand persist)
7. ✅ Type system prevents > 4 vertices (compile-time error)
8. ✅ Runtime validation throws on invalid tetrahedron
9. ✅ NO third-party analytics or tracking
10. ✅ All data stored locally

---

## VISUAL DESIGN

**Colors:**
- Background: Black (#000000)
- Primary: Cyan (#06b6d4)
- Emergency: Red (#ef4444)
- Success: Green (#10b981)
- Text: White (#ffffff)

**Typography:**
- Font: System default (no custom fonts for speed)
- Button text: 20px, bold
- Body text: 16px, regular
- Headers: 32px, bold

**Spacing:**
- Buttons: Large (min 60px height), full width on mobile
- Padding: Generous (24px minimum)
- Screen margins: 16px mobile, 48px desktop

**Animations:**
- Starfield: Subtle, not distracting
- Orb pulse: 2s cycle, smooth
- Tetrahedron: Rotate-able, smooth orbit controls
- Emergency: No animation (immediate, serious)

---

## DEPLOYMENT

```bash
# Build for production
npm run build

# Outputs to dist/
# Deploy to: Vercel, Netlify, or any static host
```

**Environment:** Production build should be < 500KB gzipped.

---

## FINAL CHECKLIST

Before marking complete, verify:

- [ ] Genesis screen renders with starfield + button
- [ ] Formation flow collects exactly 4 vertices
- [ ] Home screen shows 3D tetrahedron
- [ ] Emergency button triggers overlay
- [ ] Overlay lists all other vertices
- [ ] State persists on page reload
- [ ] TypeScript prevents 5th vertex at compile time
- [ ] Runtime validation throws on invalid tetrahedron
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Bundle size < 500KB gzipped

---

## THAT'S IT

This is the complete kernel.

Simple on the outside: 3 screens, one button.  
Revolutionary on the inside: Constitutional enforcement, geometric guarantees, foundation for a new world.

Build exactly this. Nothing more, nothing less.
