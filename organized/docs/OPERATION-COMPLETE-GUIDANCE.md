# OPERATION: COMPLETE GUIDANCE
## Full Tutorial Journey + Navigation Fix

---

## THE PROBLEMS

```
❌ Tutorial too short (only 5 messages)
❌ Doesn't explain basics
❌ Doesn't show modules
❌ Doesn't explain constitution
❌ Doesn't explain mesh/friends
❌ Vertex clicks RELOAD instead of NAVIGATE
```

---

## THE SOLUTION

### Part 1: COMPREHENSIVE TUTORIAL

**Complete journey covering:**
1. Welcome + Ship overview
2. Vertex basics (what they are)
3. Mission Control module
4. The Constitution (what governs)
5. Building modules (Workbench)
6. Connecting to mesh (Friends)
7. Advanced features
8. Next steps

**Per class adaptation:**
- OPERATOR: Simple, gamified language
- ARTIFICER: Technical, systems language
- ARCHITECT: Strategic, governance language

---

### Part 2: FIX VERTEX NAVIGATION

**Root cause:** Vertex.tsx doesn't have proper router

**Fix:** Ensure router.push actually navigates

---

## CURSOR PROMPT: COMPLETE GUIDANCE

```
TASK: Complete tutorial + fix navigation

PRIORITY: CRITICAL - ONE SHOT

PART 1: Complete Tutorial System

File: src/components/interface/TutorialGuide.tsx

REPLACE ENTIRE FILE WITH COMPREHENSIVE TUTORIAL:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useProgressStore } from '@/lib/store/progressStore';
import { usePathname } from 'next/navigation';

// COMPREHENSIVE tutorial messages for each class
const SCRIPTS = {
  OPERATOR: [
    // 1. Welcome
    "Welcome, Pilot! 🚀 You've just boarded your personal ship. Right now, everything is offline. We need to power up your systems to get operational.",
    
    // 2. What are vertices
    "See those glowing orbs? Each one is a VERTEX - a system module. The 4 vertices form a TETRAHEDRON - the strongest geometric shape. This is your command structure.",
    
    // 3. Mission Control
    "The top vertex (cyan) is MISSION CONTROL 🎯. This is your dashboard - where you track daily missions, earn Hz (energy), and monitor system health. Double-click it to activate!",
    
    // 4. The Constitution
    "Your ship runs on the G.O.D. Protocol - a digital constitution that ensures privacy, security, and no central authority. Everything you do is governed by geometric laws, not human admins.",
    
    // 5. Other modules
    "The other vertices are LOCKED 🔒. Each requires Hz to unlock: FORGE (100 Hz) for building tools, DOCS (250 Hz) for learning, GOV (500 Hz) for governance. Earn Hz by completing missions!",
    
    // 6. Building
    "Once you unlock FORGE 🔧, you can build your own modules using AI. No coding needed - just describe what you want and the system generates it. This is how you customize your world.",
    
    // 7. The Mesh
    "The center orb is your RESONANCE HUB ⚡. When you're ready, double-click it to zoom out. You'll see you're not alone - you're one vertex in a LARGER tetrahedron with 3 other people.",
    
    // 8. Connecting
    "To connect with friends, you'll form a TETRAHEDRON (4 people). This is your trust unit - your crew. Together you share missions, resources, and support. The mesh is made of these tetrahedrons.",
    
    // 9. Advanced
    "As you grow, you can unlock more vertices, create custom modules, and even build entire WORLDS inside vertices (fractal depth). The system scales infinitely.",
    
    // 10. Next steps
    "Ready to start? Double-click MISSION CONTROL (top cyan vertex) to begin. Complete missions to earn Hz. Unlock vertices. Build your world. Welcome to the mesh, Pilot! 🚀",
  ],
  
  ARTIFICER: [
    // 1. System init
    "System initialized. ⚙️ You are now interfaced with a K₄ complete graph - 4 vertices, 6 edges. This geometric configuration provides maximum redundancy and zero single points of failure.",
    
    // 2. Vertex architecture
    "Each VERTEX represents a functional module. The tetrahedron topology ensures that if any 1 node fails, the remaining 3 maintain structural integrity (graceful degradation).",
    
    // 3. Mission Control technical
    "Vertex 0 (MISSION CONTROL) 🎯 is your primary interface. It monitors system vitals, tracks operational metrics, and serves as the coordination hub. Double-click to access.",
    
    // 4. Constitutional layer
    "The G.O.D. Protocol is a 3-layer system: (1) Smart contract (immutable law), (2) TypeScript types (enforcement), (3) Abdication ceremony (no admin). Zero trust architecture.",
    
    // 5. Unlock mechanics
    "Vertices 1-3 require Hz (Hertz/Resonance). FORGE: 100 Hz (module fabrication), DOCS: 250 Hz (technical documentation), GOV: 500 Hz (governance protocols). Hz earned via mission completion.",
    
    // 6. Module generation
    "FORGE 🔧 enables LLM-assisted module generation. Input: natural language specification. Output: constitutional-compliant React/TypeScript module. Validation via type-level legislation.",
    
    // 7. Mesh topology
    "The RESONANCE HUB ⚡ (center) triggers fractal zoom. Your tetrahedron is one vertex in a super-graph. 4 tetrahedrons (16 people) form a cluster. Sierpinski scaling to depth ∞.",
    
    // 8. P2P networking
    "Mesh networking via LoRa (sub-GHz, 30km range) + WebRTC (local). No central servers. End-to-end encryption. Proof-of-Presence via cryptographic handshake. Zero surveillance.",
    
    // 9. Advanced systems
    "Advanced capabilities: Custom tetrahedron configurations, recursive world building, MCP server integration, AI-powered workflows. System extensibility via constitutional compliance.",
    
    // 10. Initialization complete
    "System initialization complete. Execute primary directive: Access Vertex 0 (MISSION CONTROL). Begin operational sequence. Monitor Hz accumulation. Unlock subsequent vertices.",
  ],
  
  ARCHITECT: [
    // 1. Protocol active
    "Protocol v2.0 Active. 🏛️ You are now administering a K₄ governance unit. This configuration represents the minimum viable trust structure - 4 nodes, complete connectivity.",
    
    // 2. Structural analysis
    "The tetrahedron is not decorative - it is FOUNDATIONAL. Each vertex is a pillar. Each edge is a trust channel. The structure is self-balancing and resistant to capture.",
    
    // 3. Node 0 governance
    "Node 0 (MISSION CONTROL) 🎯 serves as the coordination interface. It aggregates mission states, tracks collective Hz, and monitors system governance health. Access to initialize.",
    
    // 4. Constitutional framework
    "The G.O.D. Protocol enforces the constitution through code. Smart contracts (Ethereum), type-level constraints (TypeScript), and abdication ceremony (permanent decentralization).",
    
    // 5. Progressive access
    "Nodes 1-3 unlock progressively: FORGE (100 Hz) for infrastructure building, DOCS (250 Hz) for institutional knowledge, GOV (500 Hz) for meta-governance. Hz reflects collective contribution.",
    
    // 6. Infrastructure development
    "FORGE 🔧 allows infrastructure development without centralized gatekeepers. Modules are generated via AI, validated via constitution, and deployed instantly. True bottom-up construction.",
    
    // 7. Network topology
    "The RESONANCE HUB ⚡ reveals the super-structure. Your tetrahedron is a vertex in a cluster of 4 tetrahedrons. Clusters form regions. Regions form zones. Governance scales fractally.",
    
    // 8. Mesh coordination
    "Mesh formation: 4 individuals → 1 tetrahedron (trust unit). 4 tetrahedrons → 1 cluster (16 people). 4 clusters → 1 region (64 people). The network is a mesh of meshes.",
    
    // 9. Strategic deployment
    "Strategic capabilities: Custom governance structures, policy modules, conflict resolution protocols, resource allocation systems. The architecture enables infinite organizational forms.",
    
    // 10. Commence operation
    "Constitutional mandate: Initialize Node 0. Establish operational baseline. Accumulate Hz. Progressively unlock infrastructure. Deploy governance frameworks. The mesh awaits your architecture.",
  ],
};

export function TutorialGuide() {
  const pathname = usePathname();
  const userClass = useSettingsStore((s) => s.userClass) || 'OPERATOR';
  const unlockedVertices = useProgressStore((s) => s.unlockedVertices);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  
  const messages = SCRIPTS[userClass as keyof typeof SCRIPTS];
  const currentMessage = messages[messageIndex];
  
  // Load tutorial state
  useEffect(() => {
    const seen = localStorage.getItem('god-tutorial-seen');
    if (seen) {
      setHasSeenTutorial(true);
      setIsDismissed(true);
    }
  }, []);
  
  // Hide if not on home page or dismissed
  if (pathname !== '/' || isDismissed || !currentMessage || hasSeenTutorial) {
    return null;
  }
  
  // Auto-advance based on progress (optional)
  useEffect(() => {
    const node0Unlocked = unlockedVertices['base:0'];
    
    // Skip ahead if they've already unlocked mission
    if (node0Unlocked && messageIndex < 3) {
      setMessageIndex(3);
    }
  }, [unlockedVertices, messageIndex]);
  
  const handleNext = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(messageIndex + 1);
    } else {
      // Tutorial complete
      localStorage.setItem('god-tutorial-seen', 'true');
      setHasSeenTutorial(true);
      setIsDismissed(true);
    }
  };
  
  const handlePrev = () => {
    if (messageIndex > 0) {
      setMessageIndex(messageIndex - 1);
    }
  };
  
  const handleDismiss = () => {
    if (confirm('Are you sure? You can restart the tutorial from the dev menu later.')) {
      localStorage.setItem('god-tutorial-seen', 'true');
      setHasSeenTutorial(true);
      setIsDismissed(true);
    }
  };
  
  const handleRestart = () => {
    setMessageIndex(0);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="
          fixed bottom-24 left-1/2 -translate-x-1/2
          pointer-events-none z-toast
          w-full max-w-3xl px-4
        "
      >
        <div className="
          bg-surface/98 backdrop-blur-md
          border-2 border-primary/50
          p-6 rounded-xl
          shadow-glow-primary
          pointer-events-auto
        ">
          <div className="flex items-start gap-4">
            {/* Robot icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
              className="text-5xl shrink-0"
            >
              🤖
            </motion.div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-primary font-bold text-sm tracking-widest">
                  PILOT GUIDE • STEP {messageIndex + 1}/{messages.length}
                </p>
                <button
                  onClick={handleRestart}
                  className="text-xs text-text-muted hover:text-primary transition-colors"
                  title="Restart tutorial"
                >
                  ↻ Restart
                </button>
              </div>
              
              {/* Message */}
              <p className="text-text-main text-base leading-relaxed mb-4">
                {currentMessage}
              </p>
              
              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-4">
                {messages.map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-1 flex-1 rounded-full transition-all duration-300
                      ${i === messageIndex 
                        ? 'bg-primary' 
                        : i < messageIndex
                        ? 'bg-success'
                        : 'bg-border-base'
                      }
                    `}
                  />
                ))}
              </div>
              
              {/* Key concepts (if applicable) */}
              {messageIndex === 2 && (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg mb-4">
                  <p className="text-xs text-primary font-bold mb-1">💡 KEY CONCEPT</p>
                  <p className="text-xs text-text-muted">
                    Mission Control is your first module. Complete daily missions to earn Hz (energy).
                  </p>
                </div>
              )}
              
              {messageIndex === 3 && (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg mb-4">
                  <p className="text-xs text-primary font-bold mb-1">⚖️ CONSTITUTIONAL PRINCIPLE</p>
                  <p className="text-xs text-text-muted">
                    No central authority. No admin access. Governed by code and geometry.
                  </p>
                </div>
              )}
              
              {messageIndex === 5 && (
                <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg mb-4">
                  <p className="text-xs text-secondary font-bold mb-1">🔧 BUILDING</p>
                  <p className="text-xs text-text-muted">
                    Forge lets you create modules with AI. Just describe what you want.
                  </p>
                </div>
              )}
              
              {messageIndex === 7 && (
                <div className="p-3 bg-success/10 border border-success/30 rounded-lg mb-4">
                  <p className="text-xs text-success font-bold mb-1">🌐 THE MESH</p>
                  <p className="text-xs text-text-muted">
                    Form a tetrahedron with 3 friends. Your trust unit. Your crew.
                  </p>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <div className="flex flex-col gap-2 shrink-0">
              {/* Prev button */}
              <button
                onClick={handlePrev}
                disabled={messageIndex === 0}
                className="
                  p-2 rounded
                  text-text-muted hover:text-text-main
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors
                "
                title="Previous"
              >
                ↑
              </button>
              
              {/* Next/Done button */}
              <button
                onClick={handleNext}
                className="
                  px-4 py-2
                  bg-primary hover:bg-primary/80
                  text-void font-bold text-sm
                  rounded-lg
                  transition-colors
                "
              >
                {messageIndex < messages.length - 1 ? '→' : '✓'}
              </button>
              
              {/* Down button */}
              <button
                onClick={handleNext}
                disabled={messageIndex === messages.length - 1}
                className="
                  p-2 rounded
                  text-text-muted hover:text-text-main
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors
                "
                title="Next"
              >
                ↓
              </button>
              
              {/* Dismiss */}
              <button
                onClick={handleDismiss}
                className="
                  p-2 rounded mt-2
                  text-text-dim hover:text-alert
                  transition-colors
                "
                title="Dismiss tutorial"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

PART 2: Fix Vertex Navigation (NO RELOAD)

File: src/components/canvas/Vertex.tsx

CRITICAL FIX - Update handleDoubleClick:

```typescript
const handleDoubleClick = (e: any) => {
  e.stopPropagation();
  
  console.group('🎯 Vertex Double-Click');
  console.log('Config:', config);
  console.log('Locked:', isLocked);
  console.log('Path:', config.path);
  
  if (isLocked) {
    console.warn('❌ Vertex is locked');
    console.groupEnd();
    trigger('error');
    return;
  }
  
  trigger('heavy');
  
  // CRITICAL: Use router.push with the path
  if (config.path) {
    console.log('✅ Navigating to:', config.path);
    console.groupEnd();
    
    // IMPORTANT: Use router.push, NOT window.location
    router.push(config.path);
  } else if (config.tetrahedronId) {
    console.log('✅ Navigating to tetrahedron:', config.tetrahedronId);
    console.groupEnd();
    navigate(config.tetrahedronId);
  } else {
    console.error('❌ No navigation target configured');
    console.groupEnd();
  }
};
```

---

PART 3: Ensure Router is Imported

File: src/components/canvas/Vertex.tsx

VERIFY imports at top:

```typescript
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // CRITICAL
import { useFrame } from '@react-three/fiber';
import { Html, MeshDistortMaterial } from '@react-three/drei';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { useProgressStore } from '@/lib/store/progressStore';
import { VertexConfig } from '@/lib/types/tetrahedron';
import * as THREE from 'three';
```

AND initialize router:

```typescript
export function Vertex({ position, index, config, tetrahedronId }: VertexProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const router = useRouter(); // CRITICAL
  const { trigger } = useHaptics();
  const navigate = useNavigationStore((s) => s.navigate);
  // ... rest
}
```

---

PART 4: Add Tutorial Reset to DevMenu

File: src/components/dev/DevMenu.tsx

ADD reset tutorial action:

```typescript
{/* Tutorial controls */}
<div className="space-y-2">
  <p className="text-xs text-text-dim uppercase tracking-wider">Tutorial</p>
  
  <button
    onClick={() => {
      localStorage.removeItem('god-tutorial-seen');
      window.location.reload();
    }}
    className="
      w-full px-4 py-2 rounded
      bg-warning/20 hover:bg-warning/30
      border border-warning/30
      text-warning text-sm text-left
      transition-colors
    "
  >
    ↻ Reset Tutorial
  </button>
</div>
```

---

TESTING CHECKLIST:

**Tutorial System:**
[ ] Shows comprehensive 10-step tutorial
[ ] Different language per class
[ ] Step counter shows (1/10, 2/10, etc)
[ ] Progress bar fills as you advance
[ ] Can go next/prev with arrow buttons
[ ] Can restart from beginning
[ ] Key concept boxes show on relevant steps
[ ] Can dismiss (with confirmation)
[ ] Saves state (doesn't reshow after dismiss)
[ ] Can reset from dev menu

**Navigation:**
[ ] Double-click Mission vertex
[ ] Routes to /dashboard
[ ] Page changes WITHOUT reload
[ ] Console shows "Navigating to: /dashboard"
[ ] NO white flash
[ ] NO full page refresh
[ ] Canvas stays rendered
[ ] Smooth transition

**Comprehensive Content:**
[ ] Step 1: Welcome + overview
[ ] Step 2: What are vertices
[ ] Step 3: Mission Control explained
[ ] Step 4: Constitution explained
[ ] Step 5: Other modules + unlock costs
[ ] Step 6: Building with Forge
[ ] Step 7: Resonance Hub + mesh
[ ] Step 8: Connecting with friends
[ ] Step 9: Advanced features
[ ] Step 10: Next steps + call to action

---

CRITICAL VERIFICATION:

After implementing:

1. Open app → Class selector appears
2. Select OPERATOR → Tutorial starts
3. Read step 1 → Click next
4. Progress through all 10 steps
5. Click Mission vertex
6. VERIFY: Routes to /dashboard WITHOUT reload
7. Check console: Should say "Navigating to: /dashboard"
8. Check network tab: Should NOT see full document reload

IF STILL RELOADING:
- Check router import
- Check router initialization
- Check config.path is set correctly
- Check Next.js version (should be 14+)

---

EXECUTE THIS PROMPT NOW.

Implement comprehensive tutorial (10 steps).
Fix vertex navigation (router.push).
Add tutorial reset to dev menu.
Test thoroughly.
ONE SHOT. GET IT RIGHT.
```

---

**⚡ OPERATION: COMPLETE GUIDANCE ⚡**
