# OPERATION: INVISIBLE HAND
## K₄ Geometry as UI Scaffolding

---

## THE PRINCIPLE

**"Invisible Structure, Visible Function"**

The tetrahedron geometry isn't decoration.

It's the **ARCHITECTURAL SCAFFOLDING** that guides creation.

Users don't see the grid.

But they **FEEL** the structure.

Everything snaps to geometrically pure positions.

Creation becomes **STRUCTURALLY SOUND** by default.

---

## THE CONCEPT

### Traditional UI
```
Random placement
Arbitrary grid (12 columns)
No inherent meaning
Visual chaos
```

### G.O.D. Protocol
```
K₄ geometry projects to 2D
5 sacred positions (4 vertices + core)
Magnetic snapping
Structural purity
Invisible guidance
```

---

## CURSOR PROMPT: INVISIBLE HAND

Copy this EXACT prompt into Cursor:

```
TASK: Implement K₄ geometric snapping for Workbench

REQUIREMENTS:

1. GEOMETRIC CONSTANTS (src/lib/math/constants.ts)

Add these 2D snap points:

```typescript
/**
 * WORKBENCH SNAP POINTS
 * 
 * These are the 2D projections of the K₄ tetrahedron vertices
 * onto the workbench canvas. All widget placement snaps to
 * these geometrically pure positions.
 * 
 * Coordinates are percentages (0-100) of canvas width/height
 */
export const WORKBENCH_SNAP_POINTS = [
  // Vertex 1: Top Apex (North)
  { 
    id: 'V1', 
    x: 50, 
    y: 10, 
    type: 'VERTEX',
    label: 'North',
    description: 'Top apex - leadership, vision, overview'
  },
  
  // Vertex 2: Bottom Left (West)
  { 
    id: 'V2', 
    x: 15, 
    y: 75, 
    type: 'VERTEX',
    label: 'West',
    description: 'Foundation - resources, logistics, support'
  },
  
  // Vertex 3: Bottom Right (East)
  { 
    id: 'V3', 
    x: 85, 
    y: 75, 
    type: 'VERTEX',
    label: 'East',
    description: 'Action - execution, doing, making'
  },
  
  // Vertex 4: Center Base (South)
  { 
    id: 'V4', 
    x: 50, 
    y: 70, 
    type: 'VERTEX',
    label: 'South',
    description: 'Foundation - stability, grounding, connection'
  },
  
  // Resonance Core: True Center
  { 
    id: 'CORE', 
    x: 50, 
    y: 45, 
    type: 'CORE',
    label: 'Core',
    description: 'Center - coordination, integration, synthesis'
  },
] as const;

/**
 * Snap threshold (percentage of canvas width)
 * Widget snaps when within this distance
 */
export const SNAP_THRESHOLD = 8; // 8% of canvas width

/**
 * Get nearest snap point to given coordinates
 */
export function getNearestSnapPoint(
  x: number, 
  y: number, 
  canvasWidth: number, 
  canvasHeight: number
): typeof WORKBENCH_SNAP_POINTS[number] | null {
  const threshold = (canvasWidth * SNAP_THRESHOLD) / 100;
  
  let nearest = null;
  let minDistance = Infinity;
  
  for (const point of WORKBENCH_SNAP_POINTS) {
    const px = (point.x * canvasWidth) / 100;
    const py = (point.y * canvasHeight) / 100;
    
    const distance = Math.sqrt(
      Math.pow(x - px, 2) + Math.pow(y - py, 2)
    );
    
    if (distance < threshold && distance < minDistance) {
      minDistance = distance;
      nearest = point;
    }
  }
  
  return nearest;
}

/**
 * Convert snap point to absolute pixel coordinates
 */
export function snapPointToPixels(
  point: typeof WORKBENCH_SNAP_POINTS[number],
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  return {
    x: (point.x * canvasWidth) / 100,
    y: (point.y * canvasHeight) / 100,
  };
}
```

---

2. WORKBENCH COMPONENT (src/app/workbench/page.tsx)

```typescript
'use client';

import { useState, useRef, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { WidgetPalette } from '@/components/workbench/WidgetPalette';
import { WorkbenchCanvas } from '@/components/workbench/WorkbenchCanvas';
import { SnapPoint } from '@/components/workbench/SnapPoint';
import { PlacedWidget } from '@/components/workbench/PlacedWidget';
import { WORKBENCH_SNAP_POINTS, getNearestSnapPoint, snapPointToPixels } from '@/lib/math/constants';

interface Widget {
  id: string;
  type: string;
  snapPointId: string;
  config: any;
}

export default function WorkbenchPage() {
  const [placedWidgets, setPlacedWidgets] = useState<Widget[]>([]);
  const [activeWidget, setActiveWidget] = useState<any>(null);
  const [nearestSnap, setNearestSnap] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to start drag
      },
    })
  );
  
  // Handle drag start
  const handleDragStart = (event: any) => {
    setActiveWidget(event.active.data.current);
  };
  
  // Handle drag move (for snap preview)
  const handleDragMove = useCallback((event: any) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.delta.x + event.activatorEvent.clientX - rect.left;
    const y = event.delta.y + event.activatorEvent.clientY - rect.top;
    
    const nearest = getNearestSnapPoint(x, y, rect.width, rect.height);
    setNearestSnap(nearest?.id || null);
  }, []);
  
  // Handle drag end (snap to position)
  const handleDragEnd = (event: DragEndEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.delta.x + event.activatorEvent.clientX - rect.left;
    const y = event.delta.y + event.activatorEvent.clientY - rect.top;
    
    const snapPoint = getNearestSnapPoint(x, y, rect.width, rect.height);
    
    if (snapPoint && activeWidget) {
      // Check if snap point is already occupied
      const occupied = placedWidgets.some(w => w.snapPointId === snapPoint.id);
      
      if (!occupied) {
        // Place widget at snap point
        const newWidget: Widget = {
          id: `widget-${Date.now()}`,
          type: activeWidget.type,
          snapPointId: snapPoint.id,
          config: activeWidget.config || {},
        };
        
        setPlacedWidgets(prev => [...prev, newWidget]);
        
        // Play snap sound
        playSnapSound();
      }
    }
    
    setActiveWidget(null);
    setNearestSnap(null);
  };
  
  // Handle widget removal
  const handleRemoveWidget = (widgetId: string) => {
    setPlacedWidgets(prev => prev.filter(w => w.id !== widgetId));
  };
  
  // Play snap feedback sound
  const playSnapSound = () => {
    const audio = new Audio('/sounds/snap.wav');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore if sound fails
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        {/* Left: Widget Palette */}
        <div className="w-80 flex-shrink-0">
          <ModuleCard
            title="Widget Palette"
            subtitle="Drag to Canvas"
            icon="🧱"
          >
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            >
              <WidgetPalette />
              
              {/* Drag overlay */}
              <DragOverlay>
                {activeWidget ? (
                  <div className="
                    px-4 py-2 
                    bg-cyan-600 
                    rounded 
                    shadow-lg
                    opacity-80
                  ">
                    {activeWidget.label}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </ModuleCard>
        </div>
        
        {/* Right: Canvas */}
        <div className="flex-1">
          <ModuleCard
            title="Module Canvas"
            subtitle="K₄ Geometric Workspace"
            icon="📐"
          >
            <WorkbenchCanvas ref={canvasRef}>
              {/* Snap points (visible during drag) */}
              {WORKBENCH_SNAP_POINTS.map(point => (
                <SnapPoint
                  key={point.id}
                  point={point}
                  isNear={nearestSnap === point.id}
                  isOccupied={placedWidgets.some(w => w.snapPointId === point.id)}
                />
              ))}
              
              {/* Placed widgets */}
              {placedWidgets.map(widget => {
                const snapPoint = WORKBENCH_SNAP_POINTS.find(p => p.id === widget.snapPointId);
                if (!snapPoint) return null;
                
                return (
                  <PlacedWidget
                    key={widget.id}
                    widget={widget}
                    snapPoint={snapPoint}
                    onRemove={() => handleRemoveWidget(widget.id)}
                  />
                );
              })}
              
              {/* Empty state */}
              {placedWidgets.length === 0 && !activeWidget && (
                <div className="
                  absolute inset-0
                  flex flex-col items-center justify-center
                  text-gray-600 text-center
                  pointer-events-none
                ">
                  <div className="text-6xl mb-4">🧱</div>
                  <p className="text-lg font-bold mb-2">
                    Drag widgets from the palette
                  </p>
                  <p className="text-sm">
                    They'll snap to geometrically pure positions
                  </p>
                </div>
              )}
            </WorkbenchCanvas>
          </ModuleCard>
        </div>
      </div>
    </ModulePage>
  );
}
```

---

3. SNAP POINT COMPONENT (src/components/workbench/SnapPoint.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { WORKBENCH_SNAP_POINTS, snapPointToPixels } from '@/lib/math/constants';

interface SnapPointProps {
  point: typeof WORKBENCH_SNAP_POINTS[number];
  isNear: boolean;
  isOccupied: boolean;
}

export function SnapPoint({ point, isNear, isOccupied }: SnapPointProps) {
  const [showPulse, setShowPulse] = useState(false);
  
  // Show brief pulse when nearby
  useEffect(() => {
    if (isNear && !isOccupied) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isNear, isOccupied]);
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Base ring (always visible, subtle) */}
      <div className={`
        w-16 h-16
        rounded-full
        border-2
        transition-all duration-200
        ${isOccupied 
          ? 'border-gray-700 bg-gray-800/30' 
          : 'border-cyan-500/20 bg-cyan-500/5'
        }
        ${isNear && !isOccupied 
          ? 'border-cyan-400 bg-cyan-400/20 scale-110' 
          : ''
        }
      `} />
      
      {/* Pulse ring (when nearby) */}
      {showPulse && !isOccupied && (
        <div className="
          absolute inset-0
          rounded-full
          border-2 border-cyan-400
          animate-ping
          opacity-75
        " />
      )}
      
      {/* Magnet icon (when nearby) */}
      {isNear && !isOccupied && (
        <div className="
          absolute inset-0
          flex items-center justify-center
          text-2xl
          animate-bounce
        ">
          🧲
        </div>
      )}
      
      {/* Occupied marker */}
      {isOccupied && (
        <div className="
          absolute inset-0
          flex items-center justify-center
          text-gray-600
        ">
          ✓
        </div>
      )}
      
      {/* Label (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="
          absolute -bottom-6
          left-1/2 -translate-x-1/2
          text-xs text-gray-600
          whitespace-nowrap
        ">
          {point.label}
        </div>
      )}
    </div>
  );
}
```

---

4. WORKBENCH CANVAS (src/components/workbench/WorkbenchCanvas.tsx)

```typescript
'use client';

import { forwardRef, ReactNode } from 'react';

interface WorkbenchCanvasProps {
  children: ReactNode;
}

export const WorkbenchCanvas = forwardRef<HTMLDivElement, WorkbenchCanvasProps>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className="
          relative
          w-full h-[600px]
          bg-black
          border border-cyan-500/20
          rounded-lg
          overflow-hidden
        "
      >
        {/* Background grid (subtle) */}
        <div className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_1px,transparent_1px)]
          bg-[length:40px_40px]
          pointer-events-none
        " />
        
        {/* K₄ geometry watermark (center) */}
        <div className="
          absolute inset-0
          flex items-center justify-center
          opacity-5
          pointer-events-none
        ">
          <svg width="400" height="400" viewBox="0 0 200 200">
            {/* Tetrahedron outline */}
            <line x1="100" y1="20" x2="40" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="20" x2="160" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="20" x2="100" y2="140" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="150" x2="160" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="150" x2="100" y2="140" stroke="currentColor" strokeWidth="1" />
            <line x1="160" y1="150" x2="100" y2="140" stroke="currentColor" strokeWidth="1" />
            
            {/* Vertices */}
            <circle cx="100" cy="20" r="3" fill="currentColor" />
            <circle cx="40" cy="150" r="3" fill="currentColor" />
            <circle cx="160" cy="150" r="3" fill="currentColor" />
            <circle cx="100" cy="140" r="3" fill="currentColor" />
            <circle cx="100" cy="90" r="3" fill="currentColor" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative w-full h-full">
          {children}
        </div>
      </div>
    );
  }
);

WorkbenchCanvas.displayName = 'WorkbenchCanvas';
```

---

5. PLACED WIDGET (src/components/workbench/PlacedWidget.tsx)

```typescript
'use client';

import { WORKBENCH_SNAP_POINTS } from '@/lib/math/constants';

interface PlacedWidgetProps {
  widget: {
    id: string;
    type: string;
    config: any;
  };
  snapPoint: typeof WORKBENCH_SNAP_POINTS[number];
  onRemove: () => void;
}

export function PlacedWidget({ widget, snapPoint, onRemove }: PlacedWidgetProps) {
  return (
    <div
      className="absolute"
      style={{
        left: `${snapPoint.x}%`,
        top: `${snapPoint.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="
        group
        relative
        min-w-[200px]
        p-4
        bg-gray-900/80
        backdrop-blur-sm
        border border-cyan-500/30
        rounded-lg
        shadow-lg
        hover:border-cyan-400
        transition-all duration-200
      ">
        {/* Geometric indicator */}
        <div className="
          absolute -top-2 -right-2
          w-6 h-6
          bg-cyan-600
          rounded-full
          flex items-center justify-center
          text-xs font-bold
          text-white
        ">
          {snapPoint.type === 'CORE' ? '⬡' : '◆'}
        </div>
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="
            absolute -top-2 -left-2
            w-6 h-6
            bg-red-600
            rounded-full
            flex items-center justify-center
            text-white text-sm
            opacity-0 group-hover:opacity-100
            transition-opacity
            hover:bg-red-500
          "
        >
          ×
        </button>
        
        {/* Widget content */}
        <div className="text-center">
          <div className="text-2xl mb-2">
            {getWidgetIcon(widget.type)}
          </div>
          <div className="text-sm font-bold text-cyan-400 mb-1">
            {widget.type}
          </div>
          <div className="text-xs text-gray-500">
            {snapPoint.label}
          </div>
        </div>
        
        {/* Geometric position label */}
        <div className="
          mt-2 pt-2
          border-t border-cyan-500/20
          text-xs text-gray-600
          text-center
        ">
          {snapPoint.description}
        </div>
      </div>
    </div>
  );
}

function getWidgetIcon(type: string): string {
  const icons: Record<string, string> = {
    'toggle': '🔘',
    'slider': '🎚️',
    'button': '🔲',
    'text': '📝',
    'display': '📊',
    'timer': '⏱️',
  };
  return icons[type] || '📦';
}
```

---

6. WIDGET PALETTE (src/components/workbench/WidgetPalette.tsx)

```typescript
'use client';

import { useDraggable } from '@dnd-kit/core';

const WIDGET_TYPES = [
  { type: 'toggle', label: 'Toggle', icon: '🔘', description: 'On/Off switch' },
  { type: 'slider', label: 'Slider', icon: '🎚️', description: 'Number range' },
  { type: 'button', label: 'Button', icon: '🔲', description: 'Trigger action' },
  { type: 'text', label: 'Text Field', icon: '📝', description: 'Input text' },
  { type: 'display', label: 'Display', icon: '📊', description: 'Show value' },
  { type: 'timer', label: 'Timer', icon: '⏱️', description: 'Countdown' },
];

export function WidgetPalette() {
  return (
    <div className="space-y-2">
      {WIDGET_TYPES.map(widget => (
        <DraggableWidget key={widget.type} widget={widget} />
      ))}
    </div>
  );
}

function DraggableWidget({ widget }: { widget: typeof WIDGET_TYPES[number] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: widget.type,
    data: widget,
  });
  
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        p-3
        bg-gray-800
        border border-gray-700
        rounded
        cursor-grab
        active:cursor-grabbing
        hover:border-cyan-500
        hover:bg-gray-700
        transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{widget.icon}</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">
            {widget.label}
          </div>
          <div className="text-xs text-gray-500">
            {widget.description}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

TEST CHECKLIST:

[ ] Workbench page loads
[ ] 5 snap points visible (subtle rings)
[ ] Widget palette on left
[ ] Can drag widget from palette
[ ] Snap points highlight when nearby
[ ] Magnet icon appears when close
[ ] Widget snaps to exact position
[ ] Snap sound plays (optional)
[ ] Cannot place two widgets at same point
[ ] Can remove placed widgets
[ ] Geometric labels visible (dev mode)
[ ] Background shows K₄ watermark
[ ] Everything aligned perfectly

RESULT:
- Invisible geometric structure
- Guides widget placement
- Feels magnetic
- Structurally pure
- Beautiful and functional
- Users feel the architecture
```

---

**⚡ OPERATION: INVISIBLE HAND ⚡**
