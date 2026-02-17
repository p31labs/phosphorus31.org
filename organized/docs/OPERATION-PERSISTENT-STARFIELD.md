# OPERATION: PERSISTENT STARFIELD
## Always in Space - Transparent UI - Proper Routing

---

## THE FIXES

### Fix 1: Persistent Starfield
**Problem:** Starfield only in canvas, disappears on pages
**Solution:** Make starfield ALWAYS visible, independent of page

### Fix 2: Transparent Onboarding
**Problem:** Cards too opaque, can't see space
**Solution:** Make cards nearly transparent (10-20% opacity)

### Fix 3: Post-Onboarding Route
**Problem:** Goes to dashboard after onboarding
**Solution:** Load into BASE tetrahedron (empty, unlocked Mission only)

---

## CURSOR PROMPT: FIX ALL THREE

```
TASK: Fix starfield, transparency, and routing

PRIORITY: CRITICAL - User experience issues

STEP 1: Make starfield persistent (always visible)

File: src/components/canvas/Starfield.tsx

Create dedicated starfield component:

```typescript
'use client';

import { useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function Starfield() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate star positions
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount * 3; i += 3) {
    // Spherical distribution
    const radius = 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}
```

---

STEP 2: Add starfield to CanvasLayer

File: src/components/layout/CanvasLayer.tsx

UPDATE to include starfield:

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { DynamicTetrahedron } from '@/components/canvas/DynamicTetrahedron';
import { SceneController } from '@/components/canvas/SceneController';
import { Starfield } from '@/components/canvas/Starfield';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { TETRAHEDRON_CONFIGS } from '@/lib/types/tetrahedron';
import { Suspense, useContext } from 'react';
import { CanvasKeyContext } from './CanvasKeyProvider';

export function CanvasLayer() {
  const canvasKey = useContext(CanvasKeyContext);
  const currentTetrahedronId = useNavigationStore((s) => s.currentTetrahedronId);
  
  const config = TETRAHEDRON_CONFIGS[currentTetrahedronId?.toUpperCase()] 
    || TETRAHEDRON_CONFIGS.BASE;
  
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
        
        {/* PERSISTENT STARFIELD - Always visible */}
        <Suspense fallback={null}>
          <Starfield />
        </Suspense>
        
        {/* Dynamic tetrahedron */}
        <Suspense fallback={null}>
          <DynamicTetrahedron config={config} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
```

---

STEP 3: Make onboarding cards transparent

File: src/app/onboarding/identity/page.tsx

UPDATE card styling:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';

const COLORS = [
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#a855f7' },
];

export default function IdentityPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  
  const handleContinue = () => {
    // Save to localStorage for now
    localStorage.setItem('god-user-name', name);
    localStorage.setItem('god-user-color', selectedColor);
    
    // Go to next onboarding step
    router.push('/onboarding/network');
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
      <div className="w-full max-w-2xl pointer-events-auto">
        {/* TRANSPARENT CARD */}
        <div className="
          p-8
          bg-black/10
          backdrop-blur-md
          border border-cyan-500/30
          rounded-2xl
        ">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">👤</div>
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 mb-1">
                WHO
              </h1>
              <p className="text-gray-400">
                Create your identity
              </p>
            </div>
          </div>
          
          {/* Name Input */}
          <div className="mb-8">
            <label className="block text-cyan-400 font-bold mb-3">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="
                w-full px-6 py-4
                bg-black/30
                border border-gray-700
                rounded-lg
                text-white text-lg
                placeholder-gray-600
                focus:border-cyan-500
                focus:outline-none
                transition-colors
              "
            />
          </div>
          
          {/* Color Selection */}
          <div className="mb-8">
            <label className="block text-cyan-400 font-bold mb-3">
              Vertex Color
            </label>
            <div className="flex gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`
                    w-20 h-20 rounded-full
                    transition-all duration-200
                    ${selectedColor === color.value 
                      ? 'ring-4 ring-white scale-110' 
                      : 'ring-2 ring-gray-700 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="
              w-full px-6 py-4
              bg-cyan-600/80 hover:bg-cyan-500
              disabled:bg-gray-700 disabled:text-gray-500
              rounded-lg
              text-white text-lg font-bold
              transition-all
            "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

STEP 4: Create remaining onboarding pages with transparency

File: src/app/onboarding/network/page.tsx (NEW)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NetworkPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'join' | 'solo'>('solo');
  const [code, setCode] = useState('');
  
  const handleContinue = () => {
    localStorage.setItem('god-network-mode', mode);
    if (mode === 'join') {
      localStorage.setItem('god-network-code', code);
    }
    router.push('/onboarding/tutorial');
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
      <div className="w-full max-w-2xl pointer-events-auto">
        <div className="
          p-8
          bg-black/10
          backdrop-blur-md
          border border-purple-500/30
          rounded-2xl
        ">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">🔗</div>
            <div>
              <h1 className="text-3xl font-bold text-purple-400 mb-1">
                LINK
              </h1>
              <p className="text-gray-400">
                Connect to your tetrahedron
              </p>
            </div>
          </div>
          
          {/* Mode Selection */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => setMode('solo')}
              className={`
                w-full p-6 rounded-lg
                border-2 transition-all
                ${mode === 'solo' 
                  ? 'border-purple-500 bg-purple-500/20' 
                  : 'border-gray-700 bg-black/20 hover:border-purple-500/50'
                }
              `}
            >
              <div className="text-2xl mb-2">🧑</div>
              <div className="font-bold text-white text-lg mb-1">
                Solo Mode
              </div>
              <div className="text-sm text-gray-400">
                Start alone, invite others later
              </div>
            </button>
            
            <button
              onClick={() => setMode('join')}
              className={`
                w-full p-6 rounded-lg
                border-2 transition-all
                ${mode === 'join' 
                  ? 'border-purple-500 bg-purple-500/20' 
                  : 'border-gray-700 bg-black/20 hover:border-purple-500/50'
                }
              `}
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="font-bold text-white text-lg mb-1">
                Join Existing
              </div>
              <div className="text-sm text-gray-400">
                Enter invite code to join
              </div>
            </button>
          </div>
          
          {/* Code Input (if joining) */}
          {mode === 'join' && (
            <div className="mb-8">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter invite code"
                className="
                  w-full px-6 py-4
                  bg-black/30
                  border border-gray-700
                  rounded-lg
                  text-white text-lg text-center
                  placeholder-gray-600
                  focus:border-purple-500
                  focus:outline-none
                  transition-colors
                  font-mono
                "
              />
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={mode === 'join' && !code.trim()}
            className="
              w-full px-6 py-4
              bg-purple-600/80 hover:bg-purple-500
              disabled:bg-gray-700 disabled:text-gray-500
              rounded-lg
              text-white text-lg font-bold
              transition-all
            "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

STEP 5: Tutorial page

File: src/app/onboarding/tutorial/page.tsx (NEW)

```typescript
'use client';

import { useRouter } from 'next/navigation';

export default function TutorialPage() {
  const router = useRouter();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
      <div className="w-full max-w-2xl pointer-events-auto">
        <div className="
          p-8
          bg-black/10
          backdrop-blur-md
          border border-yellow-500/30
          rounded-2xl
        ">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">📚</div>
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-1">
                LEARN
              </h1>
              <p className="text-gray-400">
                How the system works
              </p>
            </div>
          </div>
          
          <div className="space-y-6 mb-8">
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">🔺</div>
              <div className="font-bold text-white mb-1">
                The Tetrahedron
              </div>
              <div className="text-sm text-gray-400">
                Every room is a tetrahedron with 4 vertices. Each vertex is a destination.
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">👆</div>
              <div className="font-bold text-white mb-1">
                Navigation
              </div>
              <div className="text-sm text-gray-400">
                Click any vertex to navigate. The camera will fly you there.
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-white mb-1">
                Resonance (Hz)
              </div>
              <div className="text-sm text-gray-400">
                Complete missions to earn Hz. Use Hz to unlock new vertices.
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-bold text-white mb-1">
                Progressive Unlock
              </div>
              <div className="text-sm text-gray-400">
                Start with Mission Control unlocked. Earn Hz to unlock the rest.
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/onboarding/launch')}
            className="
              w-full px-6 py-4
              bg-yellow-600/80 hover:bg-yellow-500
              rounded-lg
              text-white text-lg font-bold
              transition-all
            "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

STEP 6: Launch page (final onboarding step)

File: src/app/onboarding/launch/page.tsx (NEW)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { useNavigationStore } from '@/lib/store/navigationStore';

export default function LaunchPage() {
  const router = useRouter();
  const completeOnboarding = useProgressStore((s) => s.completeOnboarding);
  const navigate = useNavigationStore((s) => s.navigate);
  
  const handleLaunch = () => {
    // Mark onboarding complete
    completeOnboarding();
    
    // Navigate to BASE tetrahedron
    navigate('base');
    
    // Route to home (which will show BASE tetrahedron)
    router.push('/');
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
      <div className="w-full max-w-2xl pointer-events-auto">
        <div className="
          p-8
          bg-black/10
          backdrop-blur-md
          border border-green-500/30
          rounded-2xl
          text-center
        ">
          <div className="text-6xl mb-6">🚀</div>
          
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Ready to Launch
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">
            You're about to enter your base tetrahedron.
            <br />
            Mission Control is unlocked. The rest awaits.
          </p>
          
          <div className="mb-8 p-6 bg-black/20 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-500 mb-2">
              You'll start with
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-4">
              100 Hz
            </div>
            <div className="text-xs text-gray-600">
              Complete missions to earn more and unlock vertices
            </div>
          </div>
          
          <button
            onClick={handleLaunch}
            className="
              w-full px-8 py-6
              bg-green-600/80 hover:bg-green-500
              rounded-lg
              text-white text-xl font-bold
              transition-all
              transform hover:scale-105
            "
          >
            Enter Your World
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

STEP 7: Update home page to check onboarding status

File: src/app/page.tsx

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { useViewport } from '@/lib/hooks/useViewport';

export default function HomePage() {
  const router = useRouter();
  const layout = useViewport();
  const hasCompleted = useProgressStore((s) => s.hasCompletedOnboarding);
  const navigate = useNavigationStore((s) => s.navigate);
  const currentTetrahedronId = useNavigationStore((s) => s.currentTetrahedronId);
  
  useEffect(() => {
    if (!hasCompleted) {
      // Not completed onboarding - go to onboarding
      navigate('onboarding');
      router.push('/onboarding/welcome');
    } else {
      // Completed onboarding - ensure we're on BASE tetrahedron
      if (currentTetrahedronId !== 'base') {
        navigate('base');
      }
    }
  }, [hasCompleted]);
  
  // Don't show hint if in onboarding
  if (!hasCompleted) return null;
  
  return (
    <div className="fixed inset-0 flex items-end justify-center pb-12 pointer-events-none">
      <div className="text-center space-y-2">
        <p className={`tracking-[0.3em] uppercase font-bold text-cyan-400/60 ${layout.breakpoint === 'xs' ? 'text-xs' : 'text-sm'}`}>
          Click vertices to navigate
        </p>
        {layout.breakpoint !== 'xs' && (
          <p className="text-xs text-gray-600">
            Complete missions to unlock more
          </p>
        )}
      </div>
    </div>
  );
}
```

---

STEP 8: Create welcome page

File: src/app/onboarding/welcome/page.tsx (NEW)

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
    // Set to onboarding tetrahedron
    navigate('onboarding');
    
    // If already completed, skip to base
    if (hasCompleted) {
      navigate('base');
      router.push('/');
    }
  }, [hasCompleted]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
      <div className="text-center space-y-6 max-w-2xl pointer-events-auto">
        <div className="text-6xl mb-4">⚡</div>
        
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">
          Welcome to G.O.D.
        </h1>
        
        <p className="text-gray-400 text-xl mb-8">
          Geometric Operations Daemon
        </p>
        
        <div className="
          p-6
          bg-black/10
          backdrop-blur-md
          border border-cyan-500/20
          rounded-xl
        ">
          <p className="text-gray-300 mb-4">
            Click any vertex on the tetrahedron to begin
          </p>
          <p className="text-sm text-gray-500">
            Navigate through setup to enter your world
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

TESTING CHECKLIST:

**Starfield:**
[ ] Visible on home page
[ ] Visible on onboarding pages
[ ] Visible on dashboard
[ ] Visible on all pages
[ ] Never disappears
[ ] Always in background

**Transparency:**
[ ] Onboarding cards very transparent (10-20% bg)
[ ] Can see stars through cards
[ ] Text still readable
[ ] Backdrop blur working
[ ] Beautiful depth

**Routing:**
[ ] New user → /onboarding/welcome
[ ] Click WHO vertex → /onboarding/identity
[ ] Click LINK vertex → /onboarding/network
[ ] Click LEARN vertex → /onboarding/tutorial
[ ] Click GO vertex → /onboarding/launch
[ ] After launch → / (HOME with BASE tetrahedron)
[ ] BASE shows Mission Control unlocked
[ ] Other vertices locked
[ ] Returning user → / (skips onboarding)

**Onboarding Flow:**
[ ] Welcome → explains vertices
[ ] Identity → name + color
[ ] Network → solo/join
[ ] Tutorial → how it works
[ ] Launch → ready confirmation
[ ] After launch → BASE tetrahedron visible

---

EXECUTE THIS PROMPT NOW.

Make starfield persistent.
Make onboarding transparent.
Route to BASE after onboarding.
Visual perfection in space.
```

---

**⚡ OPERATION: PERSISTENT STARFIELD ⚡**
