# OPERATION: GUIDANCE PROTOCOL
## Complete Onboarding + Tutorial System

---

## THE ARCHITECT'S VISION

**From the documents:**

```
"The Journey: From Orb → Dive → Class → Build → Expand"
"The Tutorial: Adaptive to user class (Operator/Artificer/Architect)"
"The Navigation: Each vertex can be a WORLD (recursive depth)"
"The Gateway: 57.7% threshold for mesh activation"
```

---

## THE COMPLETE FLOW

### Phase 1: The Arrival (Finding Yourself)

```
STATE: Zero State (Floating Neutral)
VISUAL: Black void + Starfield + Gray Orb (locked)
ACTION: "Hold to Resonate"
MECHANIC: Click and hold orb
FEEDBACK: 
  - Color shift: Gray → Red → Yellow → Cyan
  - Haptic intensity increases
  - Sound rises
  - Progress bar fills
UNLOCK: At 100%, orb unlocks
PROMPT: "Click to Enter"
METAPHOR: Tuning your frequency to the mesh
```

### Phase 2: The Dive (The Transition)

```
ACTION: Click unlocked orb
VISUAL:
  - Camera accelerates THROUGH orb
  - Stars warp/stretch
  - Tunnel effect
  - Sound doppler shift
ARRIVAL: Inside your Personal Tetrahedron
STATE: Empty (4 gray nodes + center hub)
```

### Phase 3: The Assessment (Class Selection)

```
TRIGGER: First arrival only
OVERLAY: "IDENTITY DETECTED. SELECT OPERATOR CLASS."
CHOICES:
  🎮 OPERATOR (Beginner/Child)
     "I want to play & protect"
     → Simple language, gamified missions
  
  ⚒️ ARTIFICER (Builder/Teen)
     "I want to build & engineer"
     → Technical language, fabrication focus
  
  🏛️ ARCHITECT (Expert/Adult)
     "I want to plan & govern"
     → Strategic language, governance focus

RESULT: Sets global UserClass flag
EFFECT: Changes all tooltips, mission text, tutorial complexity
```

### Phase 4: The Mission (Populating Nodes)

```
STATE: 4 gray nodes (empty)
TUTORIAL: "Your ship is empty. We need systems."
PROMPT: "Click Node 1 to build Navigation"
ACTION: Click Node 1
ZOOM: Camera flies into node
RESULT: Opens Workbench → Select module
INSTALLATION: Module installs to node
RETURN: Zoom out → Node 1 now CYAN and pulsing
COMPLETION: Node populated
```

### Phase 5: The Expansion (World Building)

```
ACTION: Click Center Resonance Hub
ZOOM: Camera zooms WAY BACK (Fractal Level 2)
VISUAL: Your tetrahedron is now one vertex in a LARGER cluster
REVELATION: "You are one of four"
GOAL: "Link with 3 others to activate this Cluster"
MECHANIC: Sierpinski scaling - infinite depth
```

---

## CURSOR PROMPT: GUIDANCE PROTOCOL

```
TASK: Implement complete onboarding and tutorial system

PRIORITY: CRITICAL - This is THE user journey

PART 1: Class Selection Screen

File: src/components/onboarding/ClassSelector.tsx (NEW)

```typescript
'use client';

import { motion } from 'framer-motion';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useSettingsStore } from '@/lib/store/settingsStore';

interface ClassSelectorProps {
  onSelect: (userClass: string) => void;
}

const CLASSES = [
  {
    id: 'OPERATOR',
    title: 'OPERATOR',
    description: 'I want to play & protect.',
    icon: '🎮',
    detail: 'Simple language. Gamified missions. Focus on maintenance and defense.',
    color: 'cyan',
  },
  {
    id: 'ARTIFICER',
    title: 'ARTIFICER',
    description: 'I want to build & engineer.',
    icon: '⚒️',
    detail: 'Technical language. Fabrication focus. Hardware and software development.',
    color: 'purple',
  },
  {
    id: 'ARCHITECT',
    title: 'ARCHITECT',
    description: 'I want to plan & govern.',
    icon: '🏛️',
    detail: 'Strategic language. Governance focus. System design and coordination.',
    color: 'yellow',
  },
];

export function ClassSelector({ onSelect }: ClassSelectorProps) {
  const { trigger } = useHaptics();
  
  const handleSelect = (classId: string) => {
    trigger('success');
    onSelect(classId);
  };
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 pointer-events-auto">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-wider">
            INITIALIZE IDENTITY
          </h1>
          <p className="text-gray-400 text-lg">
            Select your operator class to begin
          </p>
        </motion.div>
        
        {/* Class Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLASSES.map((classInfo, i) => (
            <motion.button
              key={classInfo.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                borderColor: `var(--${classInfo.color})`,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(classInfo.id)}
              className="
                p-8
                bg-gray-900/80 backdrop-blur-sm
                border-2 border-gray-700
                rounded-2xl
                flex flex-col items-center text-center
                hover:bg-gray-800/80
                transition-all duration-300
                group
              "
            >
              {/* Icon */}
              <span className="text-7xl mb-6 group-hover:scale-110 transition-transform">
                {classInfo.icon}
              </span>
              
              {/* Title */}
              <h2 className="text-2xl font-black text-white mb-3 tracking-wider">
                {classInfo.title}
              </h2>
              
              {/* Description */}
              <p className="text-gray-300 mb-4 font-medium">
                {classInfo.description}
              </p>
              
              {/* Detail */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {classInfo.detail}
              </p>
            </motion.button>
          ))}
        </div>
        
        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-600 mt-8"
        >
          Your choice determines tutorial complexity and mission language.
          <br />
          You can change this later in settings.
        </motion.p>
      </div>
    </div>
  );
}
```

---

PART 2: Tutorial Guide System

File: src/components/interface/TutorialGuide.tsx (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useProgressStore } from '@/lib/store/progressStore';
import { usePathname } from 'next/navigation';

// Tutorial scripts for each class
const SCRIPTS = {
  OPERATOR: {
    welcome: "Welcome, Pilot! Your ship is offline. We need to power up.",
    firstNode: "Click that glowing orb! Let's build Mission Control.",
    nodeComplete: "Great job! Node 1 is online.",
    hubPrompt: "Now click the Center Core to see the galaxy map.",
    expansion: "Whoa! You're part of something bigger. This is your cluster.",
  },
  ARTIFICER: {
    welcome: "System initialized. Geometric integrity: Critical. Modules required.",
    firstNode: "Access Node 01. Install Dashboard Module to monitor vitals.",
    nodeComplete: "Node 01 stabilized. System capacity: 25%.",
    hubPrompt: "Access Hub to view Cluster Topology.",
    expansion: "Cluster detected. Your tetrahedron is one vertex in a K₄ super-graph.",
  },
  ARCHITECT: {
    welcome: "Protocol v2.0 Active. K₄ graph empty. Begin instantiation.",
    firstNode: "Configure Node 01 as Primary Interface (Dashboard).",
    nodeComplete: "Node 01: Operational. Governance capacity: 25%.",
    hubPrompt: "Zoom out via Hub to view Super-Structure.",
    expansion: "Local stability achieved. You are one node in the mesh of meshes.",
  },
};

export function TutorialGuide() {
  const pathname = usePathname();
  const userClass = useSettingsStore((s) => s.userClass) || 'OPERATOR';
  const unlockedVertices = useProgressStore((s) => s.unlockedVertices);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [step, setStep] = useState<'welcome' | 'firstNode' | 'nodeComplete' | 'hubPrompt' | 'expansion' | 'done'>('welcome');
  
  const scripts = SCRIPTS[userClass as keyof typeof SCRIPTS];
  
  useEffect(() => {
    // State machine for tutorial progression
    if (pathname !== '/') {
      setCurrentMessage('');
      return;
    }
    
    const node0Unlocked = unlockedVertices['base:0'];
    const node1Unlocked = unlockedVertices['base:1'];
    
    if (!node0Unlocked && step === 'welcome') {
      setCurrentMessage(scripts.welcome);
    } else if (!node0Unlocked && step !== 'welcome') {
      setStep('firstNode');
      setCurrentMessage(scripts.firstNode);
    } else if (node0Unlocked && step === 'firstNode') {
      setStep('nodeComplete');
      setCurrentMessage(scripts.nodeComplete);
      setTimeout(() => {
        setStep('hubPrompt');
        setCurrentMessage(scripts.hubPrompt);
      }, 3000);
    }
    // Add more state transitions as needed
  }, [pathname, unlockedVertices, step]);
  
  if (!currentMessage) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="
          fixed bottom-32 left-1/2 -translate-x-1/2
          pointer-events-none z-50
          w-full max-w-md px-4
        "
      >
        <div className="
          bg-black/90 backdrop-blur-md
          border border-cyan-500/50
          p-4 rounded-xl
          shadow-[0_0_20px_rgba(6,182,212,0.3)]
        ">
          <div className="flex items-start gap-3">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl"
            >
              🤖
            </motion.span>
            <div className="flex-1">
              <p className="text-cyan-400 font-bold text-xs tracking-widest mb-1.5">
                SYSTEM GUIDE
              </p>
              <p className="text-white text-sm leading-relaxed">
                {currentMessage}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

PART 3: Settings Store (track user class)

File: src/lib/store/settingsStore.ts (NEW or UPDATE)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  userClass: 'OPERATOR' | 'ARTIFICER' | 'ARCHITECT' | null;
  hasCompletedClassSelection: boolean;
  
  setUserClass: (userClass: SettingsState['userClass']) => void;
  completeClassSelection: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userClass: null,
      hasCompletedClassSelection: false,
      
      setUserClass: (userClass) => {
        set({ userClass });
      },
      
      completeClassSelection: () => {
        set({ hasCompletedClassSelection: true });
      },
    }),
    {
      name: 'god-settings',
    }
  )
);
```

---

PART 4: Update Vertex for World Navigation

File: src/components/canvas/Vertex.tsx

ADD world navigation logic:

```typescript
// ... existing imports
import { useRouter } from 'next/navigation';

const handleDoubleClick = (e: THREE.Event) => {
  e.stopPropagation();
  
  if (isLocked) {
    trigger('error');
    return;
  }
  
  trigger('heavy');
  
  // NEW LOGIC: Check node type
  if (config.isEmpty) {
    // Empty node → Configure
    router.push(`/workbench/configure/${index}`);
  } else if (config.type === 'WORLD') {
    // Recursive world → Dive deeper
    router.push(`/world/${config.linkedWorldId}`);
  } else if (config.path) {
    // Standard module
    router.push(config.path);
  } else if (config.tetrahedronId) {
    // Sub-tetrahedron
    navigate(config.tetrahedronId);
  }
};
```

---

PART 5: Update TetrahedronConfig types

File: src/lib/types/tetrahedron.ts

ADD new properties:

```typescript
export interface VertexConfig {
  id: number;
  label: string;
  color: string;
  state: VertexState;
  path?: string;
  tetrahedronId?: string;
  unlockRequirement?: {
    type: 'hz' | 'mission' | 'manual';
    value: number | string;
  };
  icon?: string;
  
  // NEW: World navigation
  isEmpty?: boolean;
  type?: 'MODULE' | 'WORLD' | 'TOOL';
  linkedWorldId?: string;
}
```

---

PART 6: Add ClassSelector to layout

File: src/app/layout.tsx

ADD class selector overlay:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { ClassSelector } from '@/components/onboarding/ClassSelector';
import { TutorialGuide } from '@/components/interface/TutorialGuide';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { userClass, hasCompletedClassSelection, setUserClass, completeClassSelection } = useSettingsStore();
  const [showClassSelector, setShowClassSelector] = useState(false);
  
  useEffect(() => {
    // Show class selector if not completed
    if (!hasCompletedClassSelection && !userClass) {
      // Small delay for dramatic effect
      setTimeout(() => setShowClassSelector(true), 2000);
    }
  }, [hasCompletedClassSelection, userClass]);
  
  const handleClassSelect = (selectedClass: string) => {
    setUserClass(selectedClass as any);
    completeClassSelection();
    setShowClassSelector(false);
  };
  
  return (
    <html lang="en">
      <body>
        {/* Canvas layer */}
        <CanvasLayer />
        
        {/* Content */}
        {children}
        
        {/* Tutorial guide */}
        <TutorialGuide />
        
        {/* Class selector (first time only) */}
        {showClassSelector && (
          <ClassSelector onSelect={handleClassSelect} />
        )}
      </body>
    </html>
  );
}
```

---

PART 7: Resonance Hub leads to customization

File: src/components/canvas/ResonanceHub.tsx

UPDATE to navigate to customize OR fractal zoom:

```typescript
const handleDoubleClick = (e: THREE.Event) => {
  e.stopPropagation();
  trigger('heavy');
  
  // Check if user has completed initial setup
  const hasPopulatedNodes = useProgressStore.getState().unlockedVertices['base:0'];
  
  if (!hasPopulatedNodes) {
    // Not ready yet
    trigger('error');
    return;
  }
  
  // Navigate to fractal zoom OR customization
  // For now: customization
  router.push('/customize');
  
  // FUTURE: Trigger fractal zoom out (Sierpinski scaling)
  // This would be a camera animation, not a route change
};
```

---

TESTING CHECKLIST:

**First Visit Flow:**
[ ] Load page → See starfield + orb
[ ] After 2 seconds → Class selector appears
[ ] Select class → Stored in localStorage
[ ] Selector disappears
[ ] Tutorial guide appears (class-specific language)

**Tutorial Progression:**
[ ] Welcome message shows
[ ] Prompts to click node 1
[ ] After node 1 populated → Congratulations
[ ] Prompts to click hub
[ ] Different messages per class:
    [ ] OPERATOR: Simple, gamified
    [ ] ARTIFICER: Technical, systems
    [ ] ARCHITECT: Strategic, governance

**World Navigation:**
[ ] Empty node → /workbench/configure/[index]
[ ] Module node → Module page
[ ] World node → /world/[id] (recursive)
[ ] Hub → /customize (or fractal zoom)

**Returning User:**
[ ] Class already selected → No selector
[ ] Tutorial state preserved
[ ] Picks up where left off

---

ADVANCED FEATURES (Phase 2):

**Fractal Zoom:**
- Hub click triggers camera animation
- Zoom out to Level 2 (Cluster view)
- Your tetrahedron becomes ONE vertex
- See 4 tetrahedrons forming larger K₄
- Infinite recursion possible

**VPI Threshold:**
- Track mesh density
- When 57.7% of nodes populated → "Gateway unlocked"
- Special ceremony/animation
- Enable advanced features

**Skill Trees:**
- Artificer: Hardware missions
- Technomancer: Code missions
- Diplomat: Social missions
- XP system with OQE (Objective Quality Evidence)

**World Builder:**
- Each vertex can become a new world
- User creates custom tetrahedrons
- Assigns modules to vertices
- Shares world configs

---

EXECUTE THIS PROMPT NOW.

Implement complete guidance protocol.
Class selection → Tutorial → World building.
Operator/Artificer/Architect paths.
```

---

**⚡ OPERATION: GUIDANCE PROTOCOL ⚡**
