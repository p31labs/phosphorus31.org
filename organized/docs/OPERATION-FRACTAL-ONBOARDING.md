# OPERATION: FRACTAL ONBOARDING
## Recursive Tetrahedron Navigation System

---

## THE VISION

**Every room is a tetrahedron.**

**Every vertex is a portal.**

**Infinite recursive depth.**

**Build your world one vertex at a time.**

---

## THE FLOW

```
ORB (Gateway)
  ↓ (click to enter)
ROOT TETRAHEDRON (Onboarding)
  ├─ Vertex 0: Identity Setup
  ├─ Vertex 1: Network Connect
  ├─ Vertex 2: Mission Tutorial
  └─ Vertex 3: Enter World
       ↓
BASE TETRAHEDRON (Your World - Empty at first)
  ├─ Vertex 0: Mission Control (unlocked)
  ├─ Vertex 1: [LOCKED] (unlock via mission)
  ├─ Vertex 2: [LOCKED] (unlock via mission)
  └─ Vertex 3: [LOCKED] (unlock via mission)
       ↓
       Each unlocked vertex becomes a NEW tetrahedron
       ↓
INFINITE DEPTH
```

---

## THE MECHANICS

### 1. ENTRY: The Orb

**Current state:**
- User sees black void + starfield
- Glowing cyan orb in center
- Text: "Click to enter"

**Action:**
- Click orb → fly into orb
- Route: / → /onboarding/welcome

---

### 2. ONBOARDING TETRAHEDRON (Level 0)

**Structure:**
```
     Vertex 0: WHO
    (Identity)
       /|\
      / | \
     /  |  \
Vertex 1 | Vertex 2
(LINK)  |  (LEARN)
     \  |  /
      \ | /
       \|/
    Vertex 3: GO
     (Enter)
```

**Vertices:**

**Vertex 0 - WHO ARE YOU?**
- Route: /onboarding/identity
- Create BioLock signature
- Choose vertex color
- Set your name/icon
- State: Can skip if returning user

**Vertex 1 - LINK UP**
- Route: /onboarding/network
- Find/create tetrahedron
- Scan QR code / enter invite
- Connect to mesh
- State: Solo mode available

**Vertex 2 - LEARN THE BASICS**
- Route: /onboarding/tutorial
- Interactive tutorial
- "This is a vertex"
- "Click to navigate"
- "Each tetrahedron is a room"
- State: Can skip

**Vertex 3 - ENTER YOUR WORLD**
- Route: /onboarding/launch
- Final confirmation
- "Ready to begin?"
- Click → Enter base tetrahedron
- Route: / (but now initialized)

---

### 3. BASE TETRAHEDRON (Level 1 - Your World)

**Initial state: ONE vertex unlocked**

```
     Vertex 0: ✅
   (Mission Control)
       /|\
      / | \
     /  |  \
    🔒  |  🔒
  Forge | Docs
     \  |  /
      \ | /
       \|/
       🔒
      (Gov)
```

**Progression system:**

**Mission Control (Always unlocked):**
- Complete daily missions
- Earn resonance (Hz)
- Unlock new vertices
- Track system health

**Unlocking vertices:**
```
Vertex 1 (Forge): Unlock at 100 Hz total earned
Vertex 2 (Docs): Unlock at 250 Hz total earned
Vertex 3 (Gov): Unlock at 500 Hz total earned
```

**Each unlocked vertex becomes a NEW tetrahedron:**

---

### 4. SUB-TETRAHEDRONS (Level 2+)

**Example: Click Forge (Vertex 1)**

**Flies into Forge → New tetrahedron appears:**

```
FORGE TETRAHEDRON
     Vertex 0
   (Widget Foundry)
       /|\
      / | \
     /  |  \
Vertex 1 | Vertex 2
(Nomad's  | (Module
 Forge)   |  Library)
     \  |  /
      \ | /
       \|/
    Vertex 3
  (Code Export)
```

**Each sub-vertex is a page/feature:**
- Widget Foundry: Build new modules
- Nomad's Forge: LLM code generator
- Module Library: Browse/install
- Code Export: Download/share

**Can go DEEPER:**

Click "Module Library" (Vertex 2) → New tetrahedron:

```
MODULE LIBRARY TETRAHEDRON
     Vertex 0
    (Browse)
       /|\
      / | \
     /  |  \
Vertex 1 | Vertex 2
(My Mods) | (Community)
     \  |  /
      \ | /
       \|/
    Vertex 3
   (Settings)
```

**INFINITE RECURSION.**

---

## THE MATH (COOL SHIT WITH NUMBERS)

### K₄ Properties for Navigation

**4 vertices per tetrahedron:**
```
Depth 0 (Onboarding): 1 tetrahedron, 4 vertices
Depth 1 (Base): 1 tetrahedron, 4 vertices
Depth 2 (Each vertex): 4 tetrahedrons, 16 vertices total
Depth 3 (Each sub-vertex): 16 tetrahedrons, 64 vertices total
Depth 4: 64 tetrahedrons, 256 vertices
Depth 5: 256 tetrahedrons, 1,024 vertices
```

**Growth formula:**
```
Tetrahedrons at depth n = 4^(n-1)
Total vertices at depth n = 4^n
```

**This means:**
- Depth 6: 4,096 possible destinations
- Depth 7: 16,384 possible destinations
- Depth 8: 65,536 possible destinations

**MASSIVE exploration space.**

---

### Resonance (Hz) Currency

**Uses:**

1. **Unlock vertices** (gates progress)
2. **Activate features** (temporary boosts)
3. **Customize appearance** (vertex colors, effects)
4. **Clone tetrahedrons** (duplicate structures)
5. **Share configurations** (export/import)

**Earning:**
```
Daily check-in: +15 Hz
Complete mission: +25 Hz
Jitterbug meeting: +100 Hz
Create module: +50 Hz
Help teammate: +30 Hz
```

**Spending:**
```
Unlock vertex: 100-500 Hz (one-time)
Vertex skin: 50 Hz (permanent)
Particle effects: 25 Hz (permanent)
Speed boost: 10 Hz/day (temporary)
Dual wielding: 200 Hz (unlock 8 vertices)
```

---

### Vertex States (Visual Indicators)

**State machine for each vertex:**

```
LOCKED 🔒
- Gray sphere
- No label
- Not clickable
- Requires: X Hz or mission completion

UNLOCKED ✅
- Colored sphere
- Has label
- Clickable
- Leads to page/tetrahedron

ACTIVE ⚡
- Glowing intensely
- Pulsing fast
- You are here
- Current location

WARNING ⚠️
- Yellow pulse
- Medium speed
- Attention needed
- Has notification

CRITICAL 🚨
- Red pulse
- Fast speed
- Urgent action
- Alert state

EMPTY ⭕
- Translucent
- Slow pulse
- Available slot
- User can assign
```

---

### Tetrahedron Configurations

**Different tetrahedron "types":**

**1. Navigation Tetrahedron** (standard)
- 4 vertices = 4 destinations
- Each vertex = page or sub-tetrahedron
- Example: Base world

**2. Feature Tetrahedron** (content)
- 4 vertices = 4 features of same system
- Example: Forge tetrahedron

**3. Data Tetrahedron** (visualization)
- 4 vertices = 4 data points
- Edges show relationships
- Example: Team health dashboard

**4. Timeline Tetrahedron** (temporal)
- Vertex 0: Past
- Vertex 1: Present
- Vertex 2: Future
- Vertex 3: Planning
- Example: Mission history

**5. Member Tetrahedron** (social)
- 4 vertices = 4 team members
- Click vertex = view their perspective
- Example: Family dashboard

**6. Modifier Tetrahedron** (meta)
- Vertex 0: Appearance
- Vertex 1: Behavior
- Vertex 2: Permissions
- Vertex 3: Export
- Example: Tetrahedron settings

---

## FILE STRUCTURE

```
New files:
src/lib/types/tetrahedron.ts (tetrahedron definitions)
src/lib/store/navigationStore.ts (navigation history)
src/lib/store/progressStore.ts (unlock state)
src/components/onboarding/* (onboarding flow)
src/app/onboarding/welcome/page.tsx
src/app/onboarding/identity/page.tsx
src/app/onboarding/network/page.tsx
src/app/onboarding/tutorial/page.tsx
src/app/onboarding/launch/page.tsx

Updated files:
src/components/canvas/Vertex.tsx (add lock state)
src/components/canvas/SpatialTetrahedron.tsx (dynamic config)
src/lib/math/constants.ts (add tetrahedron configs)
src/app/page.tsx (route to onboarding or base)
```

---

## IMPLEMENTATION

### Phase 1: Tetrahedron Types

File: src/lib/types/tetrahedron.ts (NEW)

```typescript
export type VertexState = 
  | 'locked' 
  | 'unlocked' 
  | 'active' 
  | 'warning' 
  | 'critical' 
  | 'empty';

export interface VertexConfig {
  id: number;
  label: string;
  color: string;
  state: VertexState;
  path?: string; // Page route
  tetrahedronId?: string; // Sub-tetrahedron ID
  unlockRequirement?: {
    type: 'hz' | 'mission' | 'manual';
    value: number | string;
  };
  icon?: string;
}

export interface TetrahedronConfig {
  id: string;
  name: string;
  type: 'navigation' | 'feature' | 'data' | 'timeline' | 'member' | 'modifier';
  vertices: [VertexConfig, VertexConfig, VertexConfig, VertexConfig];
  parentId?: string; // For navigation history
  parentVertex?: number; // Which vertex led here
}

// Predefined configurations
export const TETRAHEDRON_CONFIGS: Record<string, TetrahedronConfig> = {
  // Onboarding tetrahedron
  ONBOARDING: {
    id: 'onboarding',
    name: 'Welcome',
    type: 'navigation',
    vertices: [
      {
        id: 0,
        label: 'WHO',
        color: '#06b6d4',
        state: 'unlocked',
        path: '/onboarding/identity',
        icon: '👤',
      },
      {
        id: 1,
        label: 'LINK',
        color: '#a855f7',
        state: 'unlocked',
        path: '/onboarding/network',
        icon: '🔗',
      },
      {
        id: 2,
        label: 'LEARN',
        color: '#eab308',
        state: 'unlocked',
        path: '/onboarding/tutorial',
        icon: '📚',
      },
      {
        id: 3,
        label: 'GO',
        color: '#10b981',
        state: 'unlocked',
        path: '/onboarding/launch',
        icon: '🚀',
      },
    ],
  },
  
  // Base world tetrahedron (initial state)
  BASE: {
    id: 'base',
    name: 'Your World',
    type: 'navigation',
    vertices: [
      {
        id: 0,
        label: 'MISSION',
        color: '#06b6d4',
        state: 'unlocked',
        path: '/dashboard',
        icon: '🎯',
      },
      {
        id: 1,
        label: 'FORGE',
        color: '#a855f7',
        state: 'locked',
        tetrahedronId: 'forge',
        unlockRequirement: { type: 'hz', value: 100 },
        icon: '🔧',
      },
      {
        id: 2,
        label: 'DOCS',
        color: '#eab308',
        state: 'locked',
        tetrahedronId: 'docs',
        unlockRequirement: { type: 'hz', value: 250 },
        icon: '📖',
      },
      {
        id: 3,
        label: 'GOV',
        color: '#ef4444',
        state: 'locked',
        tetrahedronId: 'governance',
        unlockRequirement: { type: 'hz', value: 500 },
        icon: '⚖️',
      },
    ],
  },
  
  // Forge sub-tetrahedron
  FORGE: {
    id: 'forge',
    name: 'The Forge',
    type: 'feature',
    parentId: 'base',
    parentVertex: 1,
    vertices: [
      {
        id: 0,
        label: 'WIDGET',
        color: '#a855f7',
        state: 'unlocked',
        path: '/workbench/widget-foundry',
        icon: '⚙️',
      },
      {
        id: 1,
        label: 'NOMAD',
        color: '#8b5cf6',
        state: 'unlocked',
        path: '/workbench/forge',
        icon: '🤖',
      },
      {
        id: 2,
        label: 'LIBRARY',
        color: '#7c3aed',
        state: 'unlocked',
        tetrahedronId: 'library',
        icon: '📦',
      },
      {
        id: 3,
        label: 'EXPORT',
        color: '#6d28d9',
        state: 'unlocked',
        path: '/workbench/export',
        icon: '💾',
      },
    ],
  },
  
  // Docs sub-tetrahedron
  DOCS: {
    id: 'docs',
    name: 'Documentation',
    type: 'feature',
    parentId: 'base',
    parentVertex: 2,
    vertices: [
      {
        id: 0,
        label: 'BRIEFING',
        color: '#eab308',
        state: 'unlocked',
        path: '/docs/briefing',
        icon: '📋',
      },
      {
        id: 1,
        label: 'HANDBOOK',
        color: '#ca8a04',
        state: 'unlocked',
        path: '/docs/handbook',
        icon: '📘',
      },
      {
        id: 2,
        label: 'API',
        color: '#a16207',
        state: 'unlocked',
        path: '/docs/api',
        icon: '⚡',
      },
      {
        id: 3,
        label: 'WIKI',
        color: '#854d0e',
        state: 'unlocked',
        tetrahedronId: 'wiki',
        icon: '🌐',
      },
    ],
  },
  
  // Module library sub-sub-tetrahedron
  LIBRARY: {
    id: 'library',
    name: 'Module Library',
    type: 'data',
    parentId: 'forge',
    parentVertex: 2,
    vertices: [
      {
        id: 0,
        label: 'BROWSE',
        color: '#7c3aed',
        state: 'unlocked',
        path: '/workbench/library/browse',
        icon: '🔍',
      },
      {
        id: 1,
        label: 'MY MODULES',
        color: '#6d28d9',
        state: 'unlocked',
        path: '/workbench/library/mine',
        icon: '💼',
      },
      {
        id: 2,
        label: 'COMMUNITY',
        color: '#5b21b6',
        state: 'unlocked',
        path: '/workbench/library/community',
        icon: '👥',
      },
      {
        id: 3,
        label: 'SETTINGS',
        color: '#4c1d95',
        state: 'unlocked',
        path: '/workbench/library/settings',
        icon: '⚙️',
      },
    ],
  },
};
```

---

### Phase 2: Navigation Store

File: src/lib/store/navigationStore.ts (NEW)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TetrahedronConfig } from '@/lib/types/tetrahedron';

interface NavigationState {
  // Current location
  currentTetrahedronId: string;
  
  // Navigation history (for back button)
  history: Array<{
    tetrahedronId: string;
    timestamp: number;
  }>;
  
  // Actions
  navigate: (tetrahedronId: string) => void;
  back: () => void;
  goHome: () => void;
  getCurrentConfig: () => TetrahedronConfig | undefined;
  canGoBack: () => boolean;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      currentTetrahedronId: 'onboarding',
      history: [],
      
      navigate: (tetrahedronId: string) => {
        const current = get().currentTetrahedronId;
        set((state) => ({
          currentTetrahedronId: tetrahedronId,
          history: [
            ...state.history,
            { tetrahedronId: current, timestamp: Date.now() },
          ],
        }));
      },
      
      back: () => {
        const { history } = get();
        if (history.length === 0) return;
        
        const previous = history[history.length - 1];
        set({
          currentTetrahedronId: previous.tetrahedronId,
          history: history.slice(0, -1),
        });
      },
      
      goHome: () => {
        set({
          currentTetrahedronId: 'base',
          history: [],
        });
      },
      
      getCurrentConfig: () => {
        const { currentTetrahedronId } = get();
        return TETRAHEDRON_CONFIGS[currentTetrahedronId.toUpperCase()];
      },
      
      canGoBack: () => {
        return get().history.length > 0;
      },
    }),
    {
      name: 'god-navigation',
    }
  )
);
```

---

### Phase 3: Progress Store

File: src/lib/store/progressStore.ts (NEW)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  // Onboarding
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  
  // Unlocks
  unlockedVertices: Record<string, boolean>; // 'base:1' = Forge unlocked
  totalHzEarned: number;
  
  // Actions
  completeOnboarding: () => void;
  unlockVertex: (tetrahedronId: string, vertexId: number) => void;
  isVertexUnlocked: (tetrahedronId: string, vertexId: number) => boolean;
  addHz: (amount: number) => void;
  canUnlock: (requirement: { type: string; value: number | string }) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      onboardingStep: 0,
      unlockedVertices: {
        'onboarding:0': true, // All onboarding vertices unlocked
        'onboarding:1': true,
        'onboarding:2': true,
        'onboarding:3': true,
        'base:0': true, // Mission Control always unlocked
      },
      totalHzEarned: 0,
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      unlockVertex: (tetrahedronId: string, vertexId: number) => {
        set((state) => ({
          unlockedVertices: {
            ...state.unlockedVertices,
            [`${tetrahedronId}:${vertexId}`]: true,
          },
        }));
      },
      
      isVertexUnlocked: (tetrahedronId: string, vertexId: number) => {
        const key = `${tetrahedronId}:${vertexId}`;
        return get().unlockedVertices[key] === true;
      },
      
      addHz: (amount: number) => {
        set((state) => ({
          totalHzEarned: state.totalHzEarned + amount,
        }));
      },
      
      canUnlock: (requirement) => {
        if (requirement.type === 'hz') {
          return get().totalHzEarned >= (requirement.value as number);
        }
        // Add other requirement types (missions, etc.)
        return false;
      },
    }),
    {
      name: 'god-progress',
    }
  )
);
```

---

### Phase 4: Dynamic Tetrahedron Component

File: src/components/canvas/DynamicTetrahedron.tsx (NEW)

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { VERTEX_POSITIONS, EDGE_INDICES } from '@/lib/math/constants';
import { useViewport } from '@/lib/hooks/useViewport';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { TetrahedronConfig } from '@/lib/types/tetrahedron';
import * as THREE from 'three';

interface DynamicTetrahedronProps {
  config: TetrahedronConfig;
}

export function DynamicTetrahedron({ config }: DynamicTetrahedronProps) {
  const groupRef = useRef<THREE.Group>(null);
  const layout = useViewport();
  
  const maxScale = 0.8;
  const constrainedScale = Math.min(layout.tetrahedronScale, maxScale);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} scale={constrainedScale}>
      {/* Vertices with config */}
      {config.vertices.map((vertexConfig, i) => (
        <Vertex
          key={i}
          position={VERTEX_POSITIONS[i] as [number, number, number]}
          index={i}
          config={vertexConfig}
          tetrahedronId={config.id}
        />
      ))}
      
      {/* Edges */}
      {EDGE_INDICES.map(([start, end], i) => (
        <Edge
          key={i}
          start={VERTEX_POSITIONS[start] as [number, number, number]}
          end={VERTEX_POSITIONS[end] as [number, number, number]}
        />
      ))}
    </group>
  );
}
```

---

### Phase 5: Updated Vertex (with lock state)

File: src/components/canvas/Vertex.tsx

Add lock state handling:

```typescript
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { useProgressStore } from '@/lib/store/progressStore';
import { VertexConfig } from '@/lib/types/tetrahedron';
import * as THREE from 'three';

interface VertexProps {
  position: [number, number, number];
  index: number;
  config: VertexConfig;
  tetrahedronId: string;
}

export function Vertex({ position, index, config, tetrahedronId }: VertexProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const { trigger } = useHaptics();
  const navigate = useNavigationStore((s) => s.navigate);
  const isUnlocked = useProgressStore((s) => 
    s.isVertexUnlocked(tetrahedronId, index)
  );
  
  const [hovered, setHover] = useState(false);
  
  // Determine state
  const isLocked = config.state === 'locked' && !isUnlocked;
  const isActive = config.state === 'active';
  const isWarning = config.state === 'warning';
  const isCritical = config.state === 'critical';
  
  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      const baseSpeed = isLocked ? 0.1 : 0.3;
      const speed = hovered ? 1.5 : isCritical ? 2.5 : isWarning ? 1.2 : baseSpeed;
      
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 1.5;
      
      const breathSpeed = isCritical ? 10 : isWarning ? 5 : 2;
      const breathAmount = isCritical ? 0.1 : 0.05;
      const breath = 1 + Math.sin(state.clock.elapsedTime * breathSpeed) * breathAmount;
      
      const targetScale = isLocked ? 0.8 : hovered ? 1.3 : 1.0;
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale * breath, 0.1);
      meshRef.current.scale.setScalar(newScale);
    }
    
    if (haloRef.current) {
      haloRef.current.rotation.z -= delta * 0.2;
    }
  });
  
  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    
    if (isLocked) {
      trigger('error');
      return;
    }
    
    trigger('heavy');
    
    // Navigate to page or sub-tetrahedron
    if (config.path) {
      router.push(config.path);
    } else if (config.tetrahedronId) {
      navigate(config.tetrahedronId);
    }
  };
  
  return (
    <group position={new THREE.Vector3(...position)}>
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isLocked) {
            setHover(true);
            trigger('light');
            document.body.style.cursor = 'pointer';
          } else {
            document.body.style.cursor = 'not-allowed';
          }
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={
            isLocked ? '#555555' :
            hovered ? '#ffffff' : 
            config.color
          }
          emissive={isLocked ? '#222222' : config.color}
          emissiveIntensity={
            isLocked ? 0.1 :
            hovered ? 2 : 
            isCritical ? 1.5 : 
            0.5
          }
          roughness={isLocked ? 0.8 : 0.2}
          metalness={isLocked ? 0.3 : 0.8}
          opacity={isLocked ? 0.4 : 1}
          transparent={isLocked}
        />
      </mesh>
      
      {/* Lock icon overlay */}
      {isLocked && (
        <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="text-2xl">🔒</div>
        </Html>
      )}
      
      {/* Orbital halo */}
      <mesh ref={haloRef} scale={[1.3, 1.3, 1.3]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={isLocked ? '#555555' : config.color}
          wireframe
          transparent
          opacity={hovered ? 0.4 : isLocked ? 0.1 : 0.2}
        />
      </mesh>
      
      {/* Label */}
      <Html
        distanceFactor={10}
        position={[0, 0.6, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`
            px-3 py-1 rounded-full
            backdrop-blur-md border
            transition-all duration-300
            whitespace-nowrap
            ${isLocked 
              ? 'bg-gray-900/60 border-gray-700 text-gray-600' :
              hovered 
                ? 'bg-white/90 border-white text-black scale-110' 
                : 'bg-black/60 border-gray-600 text-gray-300'
            }
          `}
        >
          <span className="text-[10px] font-black tracking-widest">
            {config.icon} {config.label}
          </span>
        </div>
      </Html>
      
      {/* Point light */}
      {!isLocked && (
        <pointLight
          distance={5}
          intensity={hovered ? 4 : isCritical ? 2 : 1}
          color={config.color}
        />
      )}
    </group>
  );
}
```

---

### Phase 6: Updated CanvasLayer (dynamic config)

File: src/components/layout/CanvasLayer.tsx

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { DynamicTetrahedron } from '@/components/canvas/DynamicTetrahedron';
import { SceneController } from '@/components/canvas/SceneController';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { TETRAHEDRON_CONFIGS } from '@/lib/types/tetrahedron';
import { Suspense, useContext } from 'react';
import { CanvasKeyContext } from './CanvasKeyProvider';

export function CanvasLayer() {
  const canvasKey = useContext(CanvasKeyContext);
  const currentTetrahedronId = useNavigationStore((s) => s.currentTetrahedronId);
  
  // Get current config
  const config = TETRAHEDRON_CONFIGS[currentTetrahedronId.toUpperCase()];
  
  if (!config) {
    console.error(`No config found for: ${currentTetrahedronId}`);
    return null;
  }
  
  return (
    <CanvasErrorBoundary>
      <Canvas
        key={canvasKey}
        className="w-full h-full"
        camera={{ 
          position: [0, 0, 8],
          fov: 45 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
      >
        <SceneController />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Starfield background */}
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        
        {/* Dynamic tetrahedron based on current navigation */}
        <Suspense fallback={null}>
          <DynamicTetrahedron config={config} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}

// Simple starfield
function Stars() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={new Float32Array(
            Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 50)
          )}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}
```

---

### Phase 7: Onboarding Pages

Example: src/app/onboarding/welcome/page.tsx

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { useNavigationStore } from '@/lib/store/navigationStore';

export default function WelcomePage() {
  const router = useRouter();
  const hasCompleted = useProgressStore((s) => s.hasCompletedOnboarding);
  const navigate = useNavigationStore((s) => s.navigate);
  
  useEffect(() => {
    // If already completed, skip to base
    if (hasCompleted) {
      navigate('base');
      router.push('/');
    } else {
      // Set current tetrahedron to onboarding
      navigate('onboarding');
    }
  }, [hasCompleted]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center space-y-4 max-w-md pointer-events-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6">
          Welcome to G.O.D.
        </h1>
        <p className="text-gray-400 text-lg">
          Click any vertex to begin your journey
        </p>
        <div className="mt-8 p-4 bg-gray-900/50 rounded border border-cyan-500/30">
          <p className="text-sm text-gray-500">
            Navigate through the tetrahedron to complete setup
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## COOL SHIT WITH NUMBERS

### 1. Fibonacci Unlock Sequence
```typescript
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

// Unlock costs follow Fibonacci
Vertex 1: 100 Hz (Fib[6] * 10)
Vertex 2: 210 Hz (Fib[7] * 10)
Vertex 3: 340 Hz (Fib[8] * 10)
Sub-vertex 1: 55 Hz (Fib[10] * 10)
```

### 2. Prime Number Buffs
```typescript
// If total Hz is prime number, apply buff
if (isPrime(totalHz)) {
  rotationSpeed *= 1.5;
  glowIntensity *= 2;
  unlockDiscount = 0.1; // 10% off
}
```

### 3. K₄ Complete Graph Properties
```typescript
// Each tetrahedron has 6 edges
// Use edges for relationships/connections
edges.forEach((edge, i) => {
  if (bothVerticesUnlocked(edge)) {
    // Unlock bonus feature on edge
    unlockEdgeBonus(i);
  }
});
```

### 4. Tetrahedral Number Milestones
```typescript
// Tetrahedral numbers: 1, 4, 10, 20, 35, 56, 84...
const TETRAHEDRAL = n => n * (n + 1) * (n + 2) / 6;

// Achievement at each tetrahedral number
totalHz === TETRAHEDRAL(5) // 56 Hz
  → Unlock "Perfect Structure" achievement
```

### 5. Golden Ratio Scaling
```typescript
const PHI = 1.618033988749;

// Scale based on golden ratio
tetrahedronScale = baseScale * Math.pow(PHI, level / 4);
```

### 6. Depth-Based Color Shift
```typescript
// Colors shift through spectrum as you go deeper
hue = (baseHue + depth * 60) % 360;
// Depth 0: Cyan (180°)
// Depth 1: Purple (240°)
// Depth 2: Red (300°)
// Depth 3: Orange (0°)
```

---

This is just the beginning.

The numbers create the experience.

Every vertex. Every unlock. Every transition.

MATHEMATICAL BEAUTY.

⚡ OPERATION: FRACTAL ONBOARDING ⚡
