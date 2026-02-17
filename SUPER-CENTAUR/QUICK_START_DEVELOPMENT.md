# Constructor's Challenge - Quick Start Development Guide

## 🚀 Immediate Development Tasks

### **1. Install Physics Dependencies (5 minutes)**

```bash
# In project root
npm install @dimforge/rapier3d

# In frontend directory
cd frontend
npm install @dimforge/rapier3d
```

### **2. Replace PhysicsWorld Placeholder (15 minutes)**

**File**: `src/engine/physics/PhysicsWorld.ts`

**Replace the entire file with**:
```typescript
import * as RAPIER from '@dimforge/rapier3d';
import { GeometricPrimitive } from '../types/game';

export class PhysicsWorld {
  private world: RAPIER.World;
  private rigidBodies: Map<string, RAPIER.RigidBody> = new Map();
  private colliders: Map<string, RAPIER.Collider> = new Map();

  public async init(): Promise<void> {
    await RAPIER.init();
    
    // Create physics world with gravity
    this.world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0));
    
    // Create ground plane
    const groundCollider = RAPIER.ColliderDesc.cuboid(100, 0.1, 100);
    this.world.createCollider(groundCollider, RAPIER.Vector3.ZERO);
    
    console.log('✅ Rapier3D physics world initialized');
  }

  public update(deltaTime: number): void {
    this.world.step();
  }

  public addPrimitive(primitive: GeometricPrimitive): void {
    // Create dynamic rigid body
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(primitive.position.x, primitive.position.y, primitive.position.z);
    
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);
    
    // Create appropriate collider based on primitive type
    let colliderDesc;
    const scale = primitive.scale;
    
    switch (primitive.type) {
      case 'tetrahedron':
        colliderDesc = this.createTetrahedronCollider(scale);
        break;
      case 'octahedron':
        colliderDesc = this.createOctahedronCollider(scale);
        break;
      case 'icosahedron':
        colliderDesc = this.createIcosahedronCollider(scale);
        break;
      case 'strut':
        colliderDesc = RAPIER.ColliderDesc.cylinder(scale * 0.5, scale * 0.1);
        break;
      case 'hub':
        colliderDesc = RAPIER.ColliderDesc.ball(scale * 0.2);
        break;
      default:
        colliderDesc = RAPIER.ColliderDesc.cuboid(scale, scale, scale);
    }
    
    const collider = this.world.createCollider(colliderDesc, rigidBody);
    
    // Store references
    this.rigidBodies.set(primitive.id, rigidBody);
    this.colliders.set(primitive.id, collider);
    
    console.log(`🏗️ Physics: Added ${primitive.type} to physics world`);
  }

  public removePrimitive(primitiveId: string): void {
    const rigidBody = this.rigidBodies.get(primitiveId);
    const collider = this.colliders.get(primitiveId);
    
    if (rigidBody) {
      this.world.removeRigidBody(rigidBody);
      this.rigidBodies.delete(primitiveId);
    }
    
    if (collider) {
      this.world.removeCollider(collider, true);
      this.colliders.delete(primitiveId);
    }
    
    console.log(`🗑️ Physics: Removed primitive ${primitiveId} from physics world`);
  }

  public applyTestForces(structure: any): void {
    // Apply test forces to check stability
    this.rigidBodies.forEach((rigidBody, id) => {
      // Apply small random forces to test stability
      const force = new RAPIER.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      rigidBody.applyForce(force, true);
    });
  }

  public getStructureStability(structure: any): number {
    let stableCount = 0;
    let totalCount = 0;
    
    this.rigidBodies.forEach((rigidBody) => {
      totalCount++;
      const velocity = rigidBody.linvel();
      const angularVelocity = rigidBody.angvel();
      
      // Check if object is stable (low velocity)
      const isStable = velocity.length() < 0.1 && angularVelocity.length() < 0.1;
      if (isStable) stableCount++;
    });
    
    return totalCount > 0 ? stableCount / totalCount : 1.0;
  }

  public dispose(): void {
    this.rigidBodies.clear();
    this.colliders.clear();
    console.log('🧹 PhysicsWorld disposed');
  }

  // Helper methods for creating complex colliders
  private createTetrahedronCollider(scale: number): RAPIER.ColliderDesc {
    const vertices = [
      new RAPIER.Vector3(-scale, 0, -scale),
      new RAPIER.Vector3(scale, 0, -scale),
      new RAPIER.Vector3(0, scale * 1.414, 0),
      new RAPIER.Vector3(0, 0, scale)
    ];
    return RAPIER.ColliderDesc.trimesh(vertices, [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2]);
  }

  private createOctahedronCollider(scale: number): RAPIER.ColliderDesc {
    // Simplified as sphere for now
    return RAPIER.ColliderDesc.ball(scale * 0.7);
  }

  private createIcosahedronCollider(scale: number): RAPIER.ColliderDesc {
    // Simplified as sphere for now
    return RAPIER.ColliderDesc.ball(scale * 0.8);
  }
}
```

### **3. Create Toaster Component (10 minutes)**

**File**: `src/frontend/components/ui/Toaster.tsx`

```typescript
import React, { useState, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToasterProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ 
  toast, 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300); // Wait for animation
    }, toast.duration || 3000);
    
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getToastStyles = () => {
    const base = "bg-white bg-opacity-95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 transition-all duration-300 transform";
    const visible = isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
    
    const typeStyles = {
      success: "border-green-200 text-green-800",
      error: "border-red-200 text-red-800",
      warning: "border-yellow-200 text-yellow-800",
      info: "border-blue-200 text-blue-800"
    };
    
    return `${base} ${visible} ${typeStyles[toast.type]}`;
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="font-medium">{toast.message}</span>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};
```

### **4. Update GamePage to Use Toaster (5 minutes)**

**File**: `src/frontend/pages/GamePage.jsx`

**Add to imports**:
```javascript
import { Toaster } from './components/ui/Toaster';
```

**Add toast state**:
```javascript
const [toasts, setToasts] = useState([]);

const addToast = (type, message, duration = 3000) => {
  const id = Date.now().toString();
  setToasts(prev => [...prev, { id, type, message, duration }]);
};

const dismissToast = (id) => {
  setToasts(prev => prev.filter(t => t.id !== id));
};
```

**Update callbacks in useEffect**:
```javascript
// In the GameEngine initialization useEffect
const engine = new GameEngine();
engine.onPiecePlaced = (piece) => {
  addToast('success', `Placed ${piece.type} piece!`);
};
engine.onPieceRemoved = (piece) => {
  addToast('info', `Removed ${piece.type} piece`);
};
engine.onStructureInvalid = () => {
  addToast('error', 'Structure is unstable!', 5000);
};
```

**Add Toaster to render**:
```jsx
<Toaster toasts={toasts} onDismiss={dismissToast} />
```

### **5. Test the Game (5 minutes)**

```bash
# Run the launch script
.\LAUNCH_GAME.bat

# Or manually:
cd frontend
npm run dev
```

**Expected Results**:
- ✅ Game loads without errors
- ✅ 3D scene renders with build plate and grid
- ✅ Keyboard controls work (1-5, W/M/C/Q, +/-, G, V, T)
- ✅ Mouse controls work (left click to place, right click to select)
- ✅ Toast notifications appear for game events
- ✅ Physics simulation runs (objects should fall and collide)

## 🎯 Next Development Steps

### **Week 1: Core Polish**
1. **Physics Integration** (Priority 1) - ✅ Started
2. **UI Polish** (Priority 2) - ✅ Started  
3. **Bug Fixes** - Address any runtime errors

### **Week 2: Backend Integration**
1. **Authentication** - Connect with existing auth system
2. **Progress Saving** - Local storage implementation
3. **Settings** - Graphics and control preferences

### **Week 3: Advanced Features**
1. **Multiplayer** - Real-time collaboration
2. **Procedural Challenges** - AI-generated tasks
3. **Advanced Graphics** - PBR materials, particles

## 🐛 Common Issues & Solutions

### **Physics Not Working**
```bash
# Check if Rapier3D is installed
npm list @dimforge/rapier3d

# Check browser console for errors
# Look for "Rapier3D initialized successfully"
```

### **Toaster Not Appearing**
```javascript
// Check if toasts state is being updated
console.log('Toasts:', toasts);

// Check if Toaster component is rendered
// Should see <div className="fixed top-4 right-4..."> in DOM
```

### **Game Not Loading**
```javascript
// Check browser console for errors
// Common issues:
// - Missing dependencies (run npm install)
// - TypeScript errors (check terminal)
// - CORS issues (check vite.config.js)
```

## 📊 Development Metrics

### **Performance Targets**
- **FPS**: 60+ with 50+ objects
- **Memory**: <150MB usage
- **Load Time**: <3 seconds
- **Bundle Size**: <4MB gzipped

### **Code Quality**
- **TypeScript**: 100% coverage
- **ESLint**: No errors
- **Tests**: Unit tests for critical components
- **Documentation**: JSDoc for public APIs

## 🚀 Deployment Ready

Once physics and UI are complete:
1. **Build for production**: `npm run build`
2. **Test locally**: `npm run preview`
3. **Deploy**: Use Vercel, Netlify, or similar

**Production Checklist**:
- [ ] All TypeScript errors resolved
- [ ] Performance targets met
- [ ] Mobile responsiveness tested
- [ ] Accessibility features implemented
- [ ] Error handling complete
- [ ] Documentation updated

---

**Development Status**: 🟡 IN PROGRESS
**Next Steps**: Complete physics integration and UI polish
**Estimated Time**: 2-3 hours for core features
**Ready for Testing**: After physics integration