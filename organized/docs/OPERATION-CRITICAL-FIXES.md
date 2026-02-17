# OPERATION: CRITICAL FIXES
## Zero Tolerance Bug Resolution

---

## THE PROBLEMS

```
❌ Tutorial stuck after first message
❌ Vertex clicks reload instead of navigate
❌ Layout not dynamically resizing
❌ App not intelligent enough
```

---

## THE FIXES

### FIX 1: Tutorial Navigation

**Problem:** Can't advance past first message

**Root Cause:** Tutorial guide has no progression mechanism

**Solution:** Add click-to-advance + auto-progression

---

### FIX 2: Vertex Navigation

**Problem:** Clicking vertices reloads tetrahedron

**Root Cause:** Routes not configured properly in config

**Solution:** Fix TETRAHEDRON_CONFIGS with proper paths

---

### FIX 3: Dynamic Layout

**Problem:** Elements not resizing intelligently

**Root Cause:** Not using viewport hook everywhere

**Solution:** Make EVERY component use layout metrics

---

## CURSOR PROMPT: CRITICAL FIXES

```
TASK: Fix all critical bugs immediately

PRIORITY: MAXIMUM - Production blockers

FIX 1: Tutorial Guide Progression

File: src/components/interface/TutorialGuide.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useProgressStore } from '@/lib/store/progressStore';
import { usePathname } from 'next/navigation';

// Tutorial messages for each class
const SCRIPTS = {
  OPERATOR: [
    "Welcome, Pilot! 🚀 Your ship is offline. We need to power up the systems.",
    "See those glowing orbs? Each one is a system. Double-click to activate them!",
    "Great! You're learning fast. Keep activating systems to power up your ship.",
    "The center orb is your Resonance Hub. Double-click it when you're ready to expand!",
    "You're doing great! Keep exploring and building your world.",
  ],
  ARTIFICER: [
    "System initialized. ⚙️ Geometric integrity: Critical. Modules required.",
    "Access Node 01. Double-click to install Dashboard Module and monitor vitals.",
    "Node 01 stabilized. System capacity: 25%. Continue initialization sequence.",
    "Access Hub Core to view Cluster Topology when ready.",
    "Excellent work. Continue systematic module installation.",
  ],
  ARCHITECT: [
    "Protocol v2.0 Active. 🏛️ The K₄ graph is empty. Begin instantiation.",
    "Configure Node 01 as Primary Interface. Double-click to access Dashboard.",
    "Node 01: Operational. Governance capacity: 25%.",
    "Zoom out via Hub to view Super-Structure when ready.",
    "Local stability achieved. Continue strategic deployment.",
  ],
};

export function TutorialGuide() {
  const pathname = usePathname();
  const userClass = useSettingsStore((s) => s.userClass) || 'OPERATOR';
  const unlockedVertices = useProgressStore((s) => s.unlockedVertices);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const messages = SCRIPTS[userClass as keyof typeof SCRIPTS];
  const currentMessage = messages[messageIndex];
  
  // Hide if not on home page or dismissed
  if (pathname !== '/' || isDismissed || !currentMessage) {
    return null;
  }
  
  // Auto-advance based on progress
  useEffect(() => {
    const node0Unlocked = unlockedVertices['base:0'];
    
    if (node0Unlocked && messageIndex < 2) {
      setMessageIndex(2);
    }
  }, [unlockedVertices, messageIndex]);
  
  const handleNext = () => {
    if (messageIndex < messages.length - 1) {
      setMessageIndex(messageIndex + 1);
    } else {
      setIsDismissed(true);
    }
  };
  
  const handleDismiss = () => {
    setIsDismissed(true);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="
          fixed bottom-32 left-1/2 -translate-x-1/2
          pointer-events-none z-toast
          w-full max-w-2xl px-4
        "
      >
        <div className="
          bg-surface/95 backdrop-blur-md
          border-2 border-primary/50
          p-6 rounded-xl
          shadow-glow-primary
          pointer-events-auto
        ">
          <div className="flex items-start gap-4">
            {/* Robot icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl shrink-0"
            >
              🤖
            </motion.div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-primary font-bold text-sm tracking-widest mb-2">
                PILOT GUIDE
              </p>
              <p className="text-text-main text-base leading-relaxed">
                {currentMessage}
              </p>
              
              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-4">
                {messages.map((_, i) => (
                  <div
                    key={i}
                    className={`
                      h-1.5 rounded-full transition-all
                      ${i === messageIndex 
                        ? 'w-6 bg-primary' 
                        : i < messageIndex
                        ? 'w-1.5 bg-success'
                        : 'w-1.5 bg-text-dim'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Next button */}
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
                {messageIndex < messages.length - 1 ? 'Next' : 'Done'}
              </button>
              
              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="
                  p-2
                  text-text-muted hover:text-text-main
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

FIX 2: Vertex Navigation (Fix Config)

File: src/lib/types/tetrahedron.ts

UPDATE BASE config with proper paths:

```typescript
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
      path: '/dashboard', // PROPER PATH
      icon: '🎯',
    },
    {
      id: 1,
      label: 'FORGE',
      color: '#a855f7',
      state: 'locked',
      path: '/workbench', // PROPER PATH
      unlockRequirement: { type: 'hz', value: 100 },
      icon: '🔧',
    },
    {
      id: 2,
      label: 'DOCS',
      color: '#eab308',
      state: 'locked',
      path: '/docs/briefing', // PROPER PATH
      unlockRequirement: { type: 'hz', value: 250 },
      icon: '📖',
    },
    {
      id: 3,
      label: 'GOV',
      color: '#ef4444',
      state: 'locked',
      path: '/governance/monolith', // PROPER PATH
      unlockRequirement: { type: 'hz', value: 500 },
      icon: '⚖️',
    },
  ],
},
```

---

FIX 3: Vertex Click Handler (NO RELOAD)

File: src/components/canvas/Vertex.tsx

UPDATE handleDoubleClick:

```typescript
const handleDoubleClick = (e: any) => {
  e.stopPropagation();
  
  if (isLocked) {
    trigger('error');
    return;
  }
  
  trigger('heavy');
  
  // CRITICAL: Use path from config
  if (config.path) {
    console.log('Navigating to:', config.path);
    router.push(config.path);
  } else if (config.tetrahedronId) {
    console.log('Navigating to tetrahedron:', config.tetrahedronId);
    navigate(config.tetrahedronId);
  } else {
    console.error('No navigation target for vertex', config);
  }
};
```

---

FIX 4: Dynamic Layout Intelligence

File: src/lib/hooks/useViewport.ts

ADD auto-update on resize:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { calculateLayout, LayoutMetrics } from '../utils/layoutCalculator';

export function useViewport() {
  const [layout, setLayout] = useState<LayoutMetrics>(() => {
    if (typeof window === 'undefined') {
      return calculateLayout(1920, 1080);
    }
    return calculateLayout(window.innerWidth, window.innerHeight);
  });
  
  useEffect(() => {
    const handleResize = () => {
      setLayout(calculateLayout(window.innerWidth, window.innerHeight));
    };
    
    // Initial calculation
    handleResize();
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return layout;
}
```

---

FIX 5: Make ClassSelector Use Dynamic Layout

File: src/components/onboarding/ClassSelector.tsx

ADD viewport awareness:

```typescript
import { useViewport } from '@/lib/hooks/useViewport';

export function ClassSelector({ onSelect }: ClassSelectorProps) {
  const { trigger } = useHaptics();
  const layout = useViewport();
  
  // Responsive sizing based on viewport
  const cardPadding = layout.breakpoint === 'xs' ? 'p-6' : 'p-8';
  const iconSize = layout.breakpoint === 'xs' ? 'text-5xl' : 'text-7xl';
  const titleSize = layout.breakpoint === 'xs' ? 'text-xl' : 'text-2xl';
  
  return (
    <div className="fixed inset-0 z-modal bg-void/95 flex items-center justify-center p-4 pointer-events-auto">
      <div className="max-w-5xl w-full">
        {/* ... existing code ... */}
        
        <div className={`grid grid-cols-1 ${layout.breakpoint === 'xs' ? '' : 'md:grid-cols-3'} gap-6`}>
          {CLASSES.map((classInfo, i) => (
            <motion.button
              key={classInfo.id}
              className={`
                ${cardPadding}
                bg-surface/80 backdrop-blur-sm
                border-2 border-border-base
                rounded-2xl
                flex flex-col items-center text-center
                hover:bg-surface-dim/80
                transition-all duration-normal
                group
              `}
            >
              <span className={`${iconSize} mb-6 group-hover:scale-110 transition-transform`}>
                {classInfo.icon}
              </span>
              
              <h2 className={`${titleSize} font-black text-text-main mb-3 tracking-wider`}>
                {classInfo.title}
              </h2>
              
              {/* ... rest of card ... */}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

FIX 6: Smart Layout for ALL Components

Create: src/lib/hooks/useResponsive.ts (NEW)

```typescript
'use client';

import { useViewport } from './useViewport';

/**
 * Smart responsive helper
 * Returns intelligent sizing decisions
 */
export function useResponsive() {
  const layout = useViewport();
  
  return {
    // Breakpoint checks
    isXS: layout.breakpoint === 'xs',
    isSM: layout.breakpoint === 'sm',
    isMD: layout.breakpoint === 'md',
    isLG: layout.breakpoint === 'lg',
    isXL: layout.breakpoint === 'xl',
    
    // Mobile-first
    isMobile: ['xs', 'sm'].includes(layout.breakpoint),
    isTablet: ['md'].includes(layout.breakpoint),
    isDesktop: ['lg', 'xl'].includes(layout.breakpoint),
    
    // Spacing
    spacing: {
      xs: layout.breakpoint === 'xs' ? 'gap-2' : 'gap-3',
      sm: layout.breakpoint === 'xs' ? 'gap-3' : 'gap-4',
      md: layout.breakpoint === 'xs' ? 'gap-4' : 'gap-6',
      lg: layout.breakpoint === 'xs' ? 'gap-6' : 'gap-8',
    },
    
    // Padding
    padding: {
      xs: layout.breakpoint === 'xs' ? 'p-2' : 'p-3',
      sm: layout.breakpoint === 'xs' ? 'p-3' : 'p-4',
      md: layout.breakpoint === 'xs' ? 'p-4' : 'p-6',
      lg: layout.breakpoint === 'xs' ? 'p-6' : 'p-8',
    },
    
    // Text sizes
    text: {
      xs: layout.breakpoint === 'xs' ? 'text-xs' : 'text-sm',
      sm: layout.breakpoint === 'xs' ? 'text-sm' : 'text-base',
      base: layout.breakpoint === 'xs' ? 'text-base' : 'text-lg',
      lg: layout.breakpoint === 'xs' ? 'text-lg' : 'text-xl',
      xl: layout.breakpoint === 'xs' ? 'text-xl' : 'text-2xl',
      '2xl': layout.breakpoint === 'xs' ? 'text-2xl' : 'text-3xl',
    },
    
    // Grid columns
    grid: {
      cols1: 'grid-cols-1',
      cols2: layout.breakpoint === 'xs' ? 'grid-cols-1' : 'grid-cols-2',
      cols3: layout.breakpoint === 'xs' ? 'grid-cols-1' : layout.breakpoint === 'sm' ? 'grid-cols-2' : 'grid-cols-3',
      cols4: layout.breakpoint === 'xs' ? 'grid-cols-1' : layout.breakpoint === 'sm' ? 'grid-cols-2' : 'grid-cols-4',
    },
    
    // Raw layout
    layout,
  };
}
```

---

FIX 7: Console Logging for Debug

File: src/components/canvas/Vertex.tsx

ADD comprehensive logging:

```typescript
const handleDoubleClick = (e: any) => {
  e.stopPropagation();
  
  console.group('🔵 Vertex Click');
  console.log('Config:', config);
  console.log('Index:', index);
  console.log('Locked:', isLocked);
  console.log('Path:', config.path);
  console.log('TetrahedronId:', config.tetrahedronId);
  
  if (isLocked) {
    console.log('❌ Vertex is locked');
    console.groupEnd();
    trigger('error');
    return;
  }
  
  trigger('heavy');
  
  if (config.path) {
    console.log('✅ Navigating to path:', config.path);
    router.push(config.path);
  } else if (config.tetrahedronId) {
    console.log('✅ Navigating to tetrahedron:', config.tetrahedronId);
    navigate(config.tetrahedronId);
  } else {
    console.error('❌ No navigation target');
  }
  
  console.groupEnd();
};
```

---

TESTING CHECKLIST:

**Tutorial:**
[ ] Shows first message
[ ] Click "Next" advances
[ ] Auto-advances when node unlocked
[ ] Progress dots update
[ ] Can dismiss
[ ] Different text per class

**Vertex Navigation:**
[ ] Double-click Mission → /dashboard
[ ] Double-click Forge (locked) → error haptic
[ ] Double-click Forge (unlocked) → /workbench
[ ] NO PAGE RELOAD
[ ] Console logs show navigation
[ ] Routes work properly

**Dynamic Layout:**
[ ] Resize window → everything updates
[ ] Mobile view → cards stack
[ ] Desktop view → cards side-by-side
[ ] Text scales properly
[ ] Spacing scales properly
[ ] No overflow

**Intelligence:**
[ ] useViewport updates on resize
[ ] useResponsive provides smart defaults
[ ] All components use hooks
[ ] No hardcoded sizes
[ ] No arbitrary values

---

EXECUTE THIS PROMPT NOW.

Fix tutorial navigation.
Fix vertex click handlers.
Fix dynamic layout intelligence.
Add comprehensive logging.
Test thoroughly.
ZERO TOLERANCE.
```

---

**⚡ OPERATION: CRITICAL FIXES ⚡**
