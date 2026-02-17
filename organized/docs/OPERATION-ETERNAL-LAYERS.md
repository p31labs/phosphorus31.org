# OPERATION: ETERNAL LAYERS
## Geometric Z-Index System

---

## THE PROBLEM

**Current state:**
```css
.button { z-index: 999; }
.modal { z-index: 9999; }
.tooltip { z-index: 99999; }
.notification { z-index: 999999; }
```

**Result:**
- Number inflation
- Conflicts inevitable
- No system
- Chaos

---

## THE SOLUTION

**Use K₄ geometry to define ETERNAL layer hierarchy**

```
K₄ has 4 vertices + 1 center = 5 fundamental positions
These map to 5 z-index layers
NEVER conflicts
ALWAYS harmonious
Geometrically pure
```

---

## THE FIVE ETERNAL LAYERS

Based on tetrahedron structure:

```
LAYER 0: FOUNDATION (Canvas/Background)
├─ z-index: 0
├─ Purpose: 3D visualization, backgrounds
├─ Elements: Canvas, tetrahedron, spatial effects
└─ Rule: Never interactive, pure visual

LAYER 1: CONTENT (Main Interface)
├─ z-index: 10
├─ Purpose: Primary UI, modules, cards
├─ Elements: Pages, modules, text, images
└─ Rule: User's main focus

LAYER 2: CONTROLS (Interactive Elements)
├─ z-index: 20
├─ Purpose: Buttons, inputs, navigation
├─ Elements: Buttons, forms, nav bars, links
└─ Rule: Must be clickable, never obscured

LAYER 3: OVERLAYS (Contextual UI)
├─ z-index: 30
├─ Purpose: Dropdowns, tooltips, popovers
├─ Elements: Menus, tooltips, context menus
└─ Rule: Temporary, dismissible

LAYER 4: MODALS (Full Attention)
├─ z-index: 40
├─ Purpose: Dialogs, confirmations, alerts
├─ Elements: Modals, dialogs, full-screen overlays
└─ Rule: Blocks interaction with lower layers

LAYER 5: SYSTEM (Critical Notifications)
├─ z-index: 50
├─ Purpose: System alerts, critical errors
├─ Elements: Emergency alerts, error messages
└─ Rule: ALWAYS visible, highest priority
```

---

## CURSOR PROMPT: IMPLEMENT ETERNAL LAYERS

```
TASK: Implement geometric z-index system

STEP 1: Create layer constants

File: src/lib/constants/layers.ts (NEW FILE)

```typescript
/**
 * ETERNAL LAYERS
 * 
 * Z-index system derived from K₄ tetrahedron geometry
 * 5 fundamental layers that never conflict
 * 
 * Constitutional Principle: "Infinite layers, perfect harmony"
 */

export const LAYERS = {
  // LAYER 0: Foundation (z = 0)
  FOUNDATION: {
    CANVAS: 0,
    BACKGROUND: 1,
    GRID: 2,
  },
  
  // LAYER 1: Content (z = 10)
  CONTENT: {
    BASE: 10,
    TEXT: 11,
    IMAGES: 12,
    CARDS: 13,
  },
  
  // LAYER 2: Controls (z = 20)
  CONTROLS: {
    BASE: 20,
    BUTTONS: 21,
    INPUTS: 22,
    NAVIGATION: 23,
    LINKS: 24,
  },
  
  // LAYER 3: Overlays (z = 30)
  OVERLAYS: {
    BASE: 30,
    DROPDOWN: 31,
    TOOLTIP: 32,
    POPOVER: 33,
    CONTEXT_MENU: 34,
  },
  
  // LAYER 4: Modals (z = 40)
  MODALS: {
    BASE: 40,
    BACKDROP: 41,
    DIALOG: 42,
    CONFIRMATION: 43,
  },
  
  // LAYER 5: System (z = 50)
  SYSTEM: {
    BASE: 50,
    NOTIFICATION: 51,
    ALERT: 52,
    ERROR: 53,
    EMERGENCY: 54,
  },
} as const;

/**
 * Get layer value by name
 * Usage: getLayer('CONTROLS', 'BUTTONS') → 21
 */
export function getLayer(category: keyof typeof LAYERS, item?: string): number {
  const layer = LAYERS[category];
  if (!item) return typeof layer === 'number' ? layer : layer.BASE;
  return layer[item as keyof typeof layer] ?? layer.BASE;
}

/**
 * Validate z-index against layer system
 * Throws error if z-index doesn't match system
 */
export function validateZIndex(zIndex: number): void {
  const validValues = Object.values(LAYERS)
    .flatMap(layer => 
      typeof layer === 'number' ? [layer] : Object.values(layer)
    );
  
  if (!validValues.includes(zIndex)) {
    console.warn(
      `⚠️  Z-index ${zIndex} not in layer system. Use LAYERS constant.`,
      'Valid values:', validValues
    );
  }
}

/**
 * Get CSS class for layer
 * Usage: layerClass('CONTROLS', 'BUTTONS') → 'z-[21]'
 */
export function layerClass(category: keyof typeof LAYERS, item?: string): string {
  const z = getLayer(category, item);
  return `z-[${z}]`;
}
```

---

STEP 2: Update Tailwind config

File: tailwind.config.ts

Add to extend section:

```typescript
extend: {
  zIndex: {
    // Layer 0: Foundation
    'canvas': '0',
    'background': '1',
    'grid': '2',
    
    // Layer 1: Content
    'content': '10',
    'text': '11',
    'images': '12',
    'cards': '13',
    
    // Layer 2: Controls
    'controls': '20',
    'buttons': '21',
    'inputs': '22',
    'navigation': '23',
    'links': '24',
    
    // Layer 3: Overlays
    'overlays': '30',
    'dropdown': '31',
    'tooltip': '32',
    'popover': '33',
    'context-menu': '34',
    
    // Layer 4: Modals
    'modals': '40',
    'backdrop': '41',
    'dialog': '42',
    'confirmation': '43',
    
    // Layer 5: System
    'system': '50',
    'notification': '51',
    'alert': '52',
    'error': '53',
    'emergency': '54',
  }
}
```

---

STEP 3: Update layout files

File: src/components/layout/CanvasLayer.tsx

```typescript
// Add z-index
<div className="fixed inset-0 z-canvas">
  <Canvas
    className="w-full h-full"
    // ... rest of props
  />
</div>
```

---

File: src/app/layout.tsx

Update layout structure:

```typescript
<body className="relative min-h-screen bg-black text-white">
  {/* Layer 0: Canvas (Foundation) */}
  <div className="fixed inset-0 z-canvas">
    <CanvasLayer />
  </div>
  
  {/* Layer 1: Content */}
  <div className="relative z-content">
    {children}
  </div>
  
  {/* Layer 5: System notifications */}
  <div className="fixed top-4 right-4 z-notification">
    <Notifications />
  </div>
</body>
```

---

STEP 4: Update all components

File: src/app/page.tsx (Home page)

```typescript
export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Header - Controls layer */}
      <header className="fixed top-0 left-0 right-0 z-navigation p-6">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-sm font-bold tracking-wider uppercase">
              G.O.D.
            </h1>
            <span className="text-xs text-gray-500 font-mono">
              v1.0.0
            </span>
          </div>
        </div>
      </header>
      
      {/* Navigation Pills - Controls layer */}
      <nav className="fixed top-24 left-1/2 -translate-x-1/2 z-navigation">
        <div className="
          flex items-center gap-4 
          px-6 py-3 
          bg-black/40 backdrop-blur-md 
          border border-cyan-500/20 
          rounded-full
        ">
          <button className="px-4 py-2 text-sm font-bold text-cyan-400">
            🎯 Mission Control
          </button>
          <div className="w-px h-6 bg-cyan-500/20" />
          <button className="px-4 py-2 text-sm font-bold text-cyan-400">
            ⚡ Boot System
          </button>
          <div className="w-px h-6 bg-cyan-500/20" />
          <button className="px-4 py-2 text-sm font-bold text-cyan-400">
            🔧 Workbench
          </button>
        </div>
      </nav>
      
      {/* Footer - Content layer */}
      <footer className="fixed bottom-12 left-1/2 -translate-x-1/2 z-content">
        <div className="text-center">
          <p className="text-sm tracking-[0.3em] uppercase font-bold text-cyan-400 mb-2">
            Click a vertex to explore
          </p>
          <p className="text-xs text-gray-600 max-w-md">
            Each vertex represents a coordination module
          </p>
        </div>
      </footer>
    </div>
  );
}
```

---

STEP 5: Update module components

File: src/components/core/ModulePage.tsx

```typescript
export function ModulePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen z-content">
      <div className="container mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
```

---

File: src/components/core/ModuleCard.tsx

```typescript
export function ModuleCard({ 
  title, 
  subtitle, 
  icon, 
  children,
  actions 
}: ModuleCardProps) {
  return (
    <div className="relative z-cards">
      <div className="
        p-6 
        bg-gray-900/80 
        backdrop-blur-sm 
        border border-cyan-500/20 
        rounded-lg 
        shadow-xl
      ">
        {/* Card content */}
        {children}
        
        {/* Actions - Controls layer */}
        {actions && (
          <div className="relative z-buttons mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

STEP 6: Update interactive components

File: src/components/core/BackButton.tsx

```typescript
export function BackButton() {
  return (
    <button
      onClick={() => router.back()}
      className="
        fixed top-6 left-6 
        z-buttons
        px-4 py-2 
        bg-gray-800 
        hover:bg-gray-700 
        border border-gray-700 
        rounded 
        transition-colors
      "
    >
      ← Back
    </button>
  );
}
```

---

STEP 7: Create modal component

File: src/components/core/Modal.tsx (NEW FILE)

```typescript
'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-modals">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 z-backdrop bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-dialog
        max-w-md w-full
        p-6
        bg-gray-900
        border border-cyan-500/30
        rounded-lg
        shadow-2xl
      ">
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            {title}
          </h2>
        )}
        
        {/* Content */}
        <div className="relative z-content">
          {children}
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            z-buttons
            w-8 h-8
            flex items-center justify-center
            text-gray-400 hover:text-white
            transition-colors
          "
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
}
```

---

STEP 8: Create tooltip component

File: src/components/core/Tooltip.tsx (NEW FILE)

```typescript
'use client';

import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          z-tooltip
          px-3 py-2
          bg-gray-900
          border border-cyan-500/30
          rounded
          text-sm text-gray-300
          whitespace-nowrap
          pointer-events-none
        ">
          {content}
          
          {/* Arrow */}
          <div className="
            absolute top-full left-1/2 -translate-x-1/2
            w-0 h-0
            border-l-4 border-l-transparent
            border-r-4 border-r-transparent
            border-t-4 border-t-gray-900
          " />
        </div>
      )}
    </div>
  );
}
```

---

STEP 9: Create notification system

File: src/components/core/Notification.tsx (NEW FILE)

```typescript
'use client';

import { useEffect, useState } from 'react';

interface NotificationProps {
  type: 'info' | 'success' | 'warning' | 'error' | 'emergency';
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Notification({ 
  type, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Animation duration
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const colors = {
    info: 'border-cyan-500/30 bg-cyan-500/10',
    success: 'border-green-500/30 bg-green-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    emergency: 'border-red-500 bg-red-500/20 animate-pulse',
  };
  
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    emergency: '🚨',
  };
  
  // Determine z-index by type
  const zIndex = type === 'emergency' ? 'z-emergency' : 'z-notification';
  
  return (
    <div className={`
      ${zIndex}
      px-4 py-3
      ${colors[type]}
      border
      rounded-lg
      shadow-lg
      backdrop-blur-sm
      transition-all duration-300
      ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
    `}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[type]}</span>
        <p className="text-sm text-white">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="ml-auto text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
```

---

STEP 10: Create notification manager

File: src/lib/notifications.ts (NEW FILE)

```typescript
'use client';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'emergency';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

class NotificationManager {
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private notifications: Notification[] = [];
  
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
  
  show(type: NotificationType, message: string, duration?: number) {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      duration,
    };
    
    this.notifications.push(notification);
    this.notify();
    
    return notification.id;
  }
  
  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }
  
  clear() {
    this.notifications = [];
    this.notify();
  }
  
  // Convenience methods
  info(message: string, duration?: number) {
    return this.show('info', message, duration);
  }
  
  success(message: string, duration?: number) {
    return this.show('success', message, duration);
  }
  
  warning(message: string, duration?: number) {
    return this.show('warning', message, duration);
  }
  
  error(message: string, duration?: number) {
    return this.show('error', message, duration);
  }
  
  emergency(message: string, duration?: number) {
    return this.show('emergency', message, duration);
  }
}

export const notifications = new NotificationManager();
```

---

STEP 11: Test layer system

Create test page: src/app/test-layers/page.tsx

```typescript
'use client';

import { useState } from 'react';
import { Modal } from '@/components/core/Modal';
import { Tooltip } from '@/components/core/Tooltip';
import { notifications } from '@/lib/notifications';

export default function TestLayersPage() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Layer System Test</h1>
      
      <div className="space-y-4">
        {/* Test buttons */}
        <div className="z-buttons">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-cyan-600 rounded"
          >
            Open Modal (Layer 4)
          </button>
        </div>
        
        <div className="z-buttons">
          <Tooltip content="This is a tooltip">
            <button className="px-4 py-2 bg-gray-700 rounded">
              Hover for Tooltip (Layer 3)
            </button>
          </Tooltip>
        </div>
        
        <div className="z-buttons">
          <button
            onClick={() => notifications.info('Info notification')}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Show Notification (Layer 5)
          </button>
        </div>
        
        <div className="z-buttons">
          <button
            onClick={() => notifications.emergency('Emergency alert!')}
            className="px-4 py-2 bg-red-600 rounded animate-pulse"
          >
            Emergency Alert (Layer 5, highest)
          </button>
        </div>
      </div>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Test Modal"
      >
        <p>This modal is on Layer 4 (z-modals)</p>
        <p>It should be above all content and controls</p>
        
        <div className="mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-cyan-600 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
      
      {/* Layer visualization */}
      <div className="mt-12 p-6 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Layer Hierarchy:</h2>
        <ol className="space-y-2 text-sm">
          <li>Layer 0 (z-0): Canvas/Background</li>
          <li>Layer 1 (z-10): Content</li>
          <li>Layer 2 (z-20): Controls</li>
          <li>Layer 3 (z-30): Overlays</li>
          <li>Layer 4 (z-40): Modals</li>
          <li>Layer 5 (z-50): System Alerts</li>
        </ol>
      </div>
    </div>
  );
}
```

---

TEST CHECKLIST:

[ ] Canvas stays in background (Layer 0)
[ ] Content never obscures controls (Layer 1 < Layer 2)
[ ] Buttons always clickable (Layer 2)
[ ] Tooltips appear over buttons (Layer 3 > Layer 2)
[ ] Modals block everything below (Layer 4)
[ ] Emergency alerts always visible (Layer 5)
[ ] No z-index conflicts
[ ] All layers work together harmoniously

RESULT:
- Geometric layer system
- No arbitrary numbers
- Never conflicts
- Always harmonious
- Constitutional purity
- Infinite layers possible
- Perfect coordination
```

---

**⚡ OPERATION: ETERNAL LAYERS ⚡**
