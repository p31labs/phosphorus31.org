# Game Engine Documentation

**3D Building Game Engine for P31**

## Overview

The Game Engine is a Three.js-based 3D building game that teaches geometric principles through hands-on construction. Players build structures using geometric primitives (tetrahedra, octahedra, icosahedra) and test them with physics simulation.

## Architecture

### Core Systems

- **GameEngine** - Main game loop and state management
- **SceneManager** - Three.js scene management
- **PhysicsWorld** - Physics simulation (rigid body dynamics)
- **BuildMode** - Building interface and piece placement
- **ChallengeEngine** - Challenge system and progression
- **AudioManager** - Sound effects and ambient audio
- **SaveManager** - Save/load structures and progress
- **InputManager** - Keyboard and mouse input

### Game Loop

```typescript
1. Input processing
2. Physics update (deltaTime)
3. Scene update (animations, etc.)
4. Build mode update
5. Challenge engine update
6. Render
7. Repeat
```

## Features

### Building System

- **Geometric Primitives**: Tetrahedra, Octahedra, Icosahedra, Struts, Hubs
- **Snap System**: Automatic connection point snapping
- **Grid System**: Optional grid for alignment
- **Undo/Redo**: Full undo/redo support
- **Material System**: Wood, Metal, Crystal, Quantum materials

### Physics System

- **Rigid Body Dynamics**: Full physics simulation
- **Structure Testing**: Apply forces to test stability
- **Stability Calculation**: Real-time stability scoring
- **Deformation Detection**: Visual feedback for stress

### Challenge System

- **Tiered Challenges**: Seedling → Sprout → Sapling → Oak → Sequoia
- **Objectives**: Build, stability, efficiency, creative, co-op
- **LOVE Rewards**: Earn LOVE tokens for completion
- **Badges**: Unlock badges for achievements
- **Co-op Mode**: Family collaboration challenges

### Validation System

- **Maxwell's Rule**: E ≥ 3V - 6 for rigidity
- **Stability Score**: 0-100 stability rating
- **Load Capacity**: Maximum load before failure
- **Real-time Feedback**: Visual validation indicators

## Integration with The Scope

### React Three Fiber Integration

```tsx
import { GameEngine3D } from './components/Game/GameEngine3D';
import { GameControls } from './components/Game/GameControls';

<Canvas>
  <GameEngine3D />
  {/* Other 3D components */}
</Canvas>

<GameControls />
```

### Hooks

```typescript
import { useGameEngine } from './hooks/useGameEngine';

const {
  engine,
  isInitialized,
  isRunning,
  gameState,
  start,
  stop,
  pause,
  resume,
  createNewStructure,
  testStructure,
  completeChallenge,
} = useGameEngine();
```

## Keyboard Shortcuts

- **Escape** - Toggle pause
- **Z** - Undo
- **Y** - Redo
- **G** - Toggle grid
- **V** - Toggle snap
- **T** - Test structure

## Performance

### Optimization Strategies

1. **LOD System** - Level of detail for distant objects
2. **Frustum Culling** - Only render visible objects
3. **Instancing** - Batch render identical pieces
4. **Physics Optimization** - Adaptive timestep, sleeping bodies
5. **Reduced Motion** - Respects accessibility preferences

### Performance Monitoring

The `PerformanceMonitor` component shows:
- FPS (frames per second)
- Memory usage
- Render calls
- Triangle count

## Accessibility

The game engine respects accessibility settings:

- **Reduced Motion** - Slower animations, less physics updates
- **High Contrast** - Enhanced visual feedback
- **Large Text** - UI scales with font size
- **Audio Feedback** - Sound cues for actions

## Materials

### Wood
- Density: 500 kg/m³
- Friction: 0.6
- Strength: 50
- Color: Brown (#8B4513)

### Metal
- Density: 7800 kg/m³
- Friction: 0.4
- Strength: 200
- Color: Silver (#C0C0C0)

### Crystal
- Density: 2650 kg/m³
- Friction: 0.3
- Strength: 100
- Color: Cyan (#00FFFF)

### Quantum
- Density: 1000 kg/m³
- Friction: 0.1
- Strength: 150
- Color: Magenta (#FF00FF)

## Challenges

Challenges are tiered by age/difficulty:

- **Seedling** (4-6 years) - Simple structures
- **Sprout** (6-8 years) - Basic stability
- **Sapling** (8-10 years) - Intermediate builds
- **Oak** (10-13 years) - Advanced structures
- **Sequoia** (13+) - Expert level

## Save System

Structures and progress are saved to:
- **LocalStorage** - Browser storage
- **IndexedDB** - For larger structures
- **Cloud Sync** - Optional cloud backup

## API Reference

### GameEngine

```typescript
class GameEngine {
  init(): Promise<void>
  start(): void
  stop(): void
  pause(): void
  resume(): void
  createNewStructure(name: string): void
  testStructure(): void
  completeChallenge(): void
  loadStructure(structureId: string): Promise<void>
  getGameState(): GameState
  dispose(): void
}
```

### GameState

```typescript
interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  currentStructure: Structure | null;
  playerProgress: PlayerProgress | null;
  currentChallenge: Challenge | null;
  buildMode: BuildState;
}
```

## Examples

### Basic Usage

```typescript
const engine = new GameEngine();
await engine.init();
engine.start();

// Create a new structure
engine.createNewStructure('My First Build');

// Test the structure
engine.testStructure();

// Complete challenge
engine.completeChallenge();
```

### React Integration

```tsx
function GameView() {
  const { engine, start, createNewStructure } = useGameEngine();

  return (
    <>
      <Canvas>
        <GameEngine3D />
      </Canvas>
      <GameControls />
    </>
  );
}
```

## Troubleshooting

### Engine Not Initializing

- Check browser console for errors
- Verify Three.js is loaded
- Check WebGL support

### Performance Issues

- Enable performance mode
- Reduce render distance
- Lower shadow quality
- Disable unnecessary features

### Physics Not Working

- Check PhysicsWorld initialization
- Verify rigid bodies are created
- Check timestep settings

## Future Enhancements

- [ ] Multiplayer support
- [ ] VR/AR mode
- [ ] More geometric primitives
- [ ] Advanced materials
- [ ] Structure sharing
- [ ] Leaderboards
- [ ] Custom challenges

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
