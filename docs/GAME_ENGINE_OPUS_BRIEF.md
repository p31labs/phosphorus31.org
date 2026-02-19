# P31 Game Engine — Complete Description & Code Brief for Opus

**Purpose:** Share with Opus for improvements and enhancements.  
**Date:** 2026-02-16  
**Ecosystem:** P31 Labs — assistive tech, tetrahedron topology, L.O.V.E. economy, neurodivergent-first.

---

## 1. Overview

The P31 game engine is **two related systems**:

1. **Centaur Game Engine** (`SUPER-CENTAUR/src/engine/`) — Full 3D building game with physics, L.O.V.E. economy, challenges, P31 Language, and metabolism (spoon) integration. Runs in browser or Node; backend (Centaur) exposes game APIs.
2. **Scope Engine** (`ui/src/engine/`) — Pure logic for the dashboard (P31 Spectrum): voltage scoring, spoon calculation, message filtering, geodesic analysis. No React, no 3D; used by the React UI.

Both follow **tetrahedron topology**, **offline-first**, and **kids-first** design. The document below focuses on the **Centaur game engine** (the “game” in the usual sense), with a short section on the Scope engine.

---

## 2. Architecture Summary

```
SUPER-CENTAUR/src/engine/
├── core/
│   ├── GameEngine.ts          # Main orchestrator
│   ├── SceneManager.ts        # Three.js scene
│   ├── InputManager.ts        # Keyboard/mouse
│   ├── AudioManager.ts        # SFX + ambient
│   ├── SaveManager.ts         # Persist structures + progress
│   ├── PerformanceMonitor.ts  # FPS, frame time
│   ├── ErrorRecovery.ts       # Init/game-loop recovery
│   ├── MetabolismIntegration.ts  # Spoons from P31 Buffer
│   ├── WalletIntegration.ts   # L.O.V.E. 50/50 pools
│   ├── VestingManager.ts      # Age-based access (Trust/Apprenticeship/Sovereignty)
│   ├── ProofOfCareManager.ts  # Care score formula
│   └── AccessibilityManager.ts
├── building/
│   ├── BuildMode.ts           # Place/remove pieces, ghost, undo/redo
│   ├── StructureValidator.ts # Maxwell E ≥ 3V−6
│   ├── SnapSystem.ts          # Magnetic snap + alignment
│   └── ConnectionManager.ts   # Connection points
├── physics/
│   ├── PhysicsWorld.ts       # Rapier3D rigid bodies
│   └── EnhancedPhysicsWorld.ts
├── challenges/
│   ├── ChallengeEngine.ts    # Load/complete challenges
│   └── DynamicChallengeEngine.ts
├── types/
│   └── game.ts               # Structure, Challenge, PlayerProgress, etc.
├── language/
│   ├── P31LanguageParser.ts   # DSL lexer/parser
│   └── P31LanguageExecutor.ts # Execute P31 scripts
├── kids/
│   └── KidsMode.ts           # Age-appropriate UX
├── accessibility/
│   ├── AccessibilityManager.ts
│   ├── SeniorMode.ts
│   └── EnhancedAccessibilityManager.ts
└── examples/
    └── love-economy-demo.ts   # Full L.O.V.E. workflow
```

**Server (Colyseus) game state** lives in `server/schema/GameState.ts` (multiplayer sync). **Centaur REST** game routes: `GET/POST /api/game/structures`, `GET/PUT /api/game/progress/:memberId`, `GET /api/game/challenges`, `POST /api/game/validate`.

---

## 3. Core Game Engine (Orchestrator)

**File:** `SUPER-CENTAUR/src/engine/core/GameEngine.ts`

The main class owns scene, physics, input, audio, save, build mode, structure validation, challenge engine, performance monitor, metabolism, error recovery, and accessibility. It does **not** currently expose `rewardLoveForAction`, `getWalletIntegration`, `getVestingManager`, `getProofOfCareManager`, `recordPing`, or `recordCareInteraction` in code; those are **documented/spec API** (see L.O.V.E. section below). Implemented behavior:

- **Init:** SceneManager, PhysicsWorld, AudioManager, InputManager, SaveManager; load or create `PlayerProgress`; set build-mode callbacks.
- **Loop:** Input → Physics → Scene → BuildMode → ChallengeEngine → render; auto-save; performance checks; optional quality downgrade if FPS &lt; 30.
- **Build integration:** On piece placed/removed/structure changed: play sound, validate structure, save, and (on place) reward spoons via MetabolismIntegration.
- **Challenges:** `completeChallenge()` uses ChallengeEngine, updates `totalLoveEarned` and tier (seedling → sequoia), saves progress, rewards spoons.
- **Metabolism:** `updateMetabolismState()` from The Buffer; `canContinuePlaying()`, `getRecommendedActivity()`, `getMetabolismState()`.

```typescript
// SUPER-CENTAUR/src/engine/core/GameEngine.ts (excerpts)

export class GameEngine {
  private sceneManager: SceneManager;
  private physicsWorld: PhysicsWorld;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private saveManager: SaveManager;
  private buildMode: BuildMode;
  private structureValidator: StructureValidator;
  private challengeEngine: ChallengeEngine;
  private performanceMonitor: PerformanceMonitor;
  private metabolismIntegration: MetabolismIntegration;
  private errorRecovery: ErrorRecovery;
  private accessibilityManager: AccessibilityManager;

  private isRunning = false;
  private isPaused = false;
  private currentStructure: any = null;
  private playerProgress: PlayerProgress | null = null;

  constructor() {
    this.sceneManager = new SceneManager();
    this.physicsWorld = new PhysicsWorld();
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.saveManager = new SaveManager();
    this.buildMode = new BuildMode(this.sceneManager, this.physicsWorld);
    this.structureValidator = new StructureValidator();
    this.challengeEngine = new ChallengeEngine();
    this.performanceMonitor = new PerformanceMonitor();
    this.metabolismIntegration = new MetabolismIntegration();
    this.errorRecovery = new ErrorRecovery();
    this.accessibilityManager = new AccessibilityManager();
    this.accessibilityManager.applySettings();
    this.setupEventListeners();
  }

  public async init(): Promise<void> {
    await this.initWithRecovery('SceneManager', () => this.sceneManager.init());
    await this.initWithRecovery('PhysicsWorld', () => this.physicsWorld.init());
    await this.initWithRecovery('AudioManager', () => this.audioManager.init());
    await this.initWithRecovery('InputManager', () => this.inputManager.init());
    await this.initWithRecovery('SaveManager', () => this.saveManager.init());
    this.playerProgress = await this.saveManager.loadPlayerProgress()
      ?? this.createDefaultPlayerProgress();
    this.setupBuildModeCallbacks();
  }

  private loop(): void {
    if (!this.isRunning || this.isPaused) {
      this.animationFrameId = requestAnimationFrame(() => this.loop());
      return;
    }
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.inputManager.update();
    this.physicsWorld.update(deltaTime);
    this.sceneManager.update(deltaTime);
    this.buildMode.update(deltaTime);
    this.challengeEngine.update(deltaTime);
    this.sceneManager.render();

    this.performanceMonitor.update(deltaTime, { physicsTime, renderTime, updateTime });
    if (currentTime - this.lastAutoSave >= this.autoSaveInterval) {
      this.saveCurrentStructure();
      this.lastAutoSave = currentTime;
    }
    if (!this.performanceMonitor.isHealthy()) this.handlePerformanceDegradation();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  private setupBuildModeCallbacks(): void {
    this.buildMode.onPiecePlaced = (piece) => {
      this.audioManager.playSound('place_piece');
      this.validateStructure();
      this.saveCurrentStructure();
      this.metabolismIntegration.rewardSpoons('build');
    };
    this.buildMode.onPieceRemoved = (piece) => {
      this.audioManager.playSound('remove_piece');
      this.validateStructure();
      this.saveCurrentStructure();
    };
    this.buildMode.onStructureChanged = () => {
      this.validateStructure();
      this.saveCurrentStructure();
    };
  }

  public completeChallenge(): void {
    if (!this.currentStructure) return;
    const challenge = this.challengeEngine.getCurrentChallenge();
    if (!challenge) return;
    const result = this.challengeEngine.completeChallenge(this.currentStructure);
    if (result.success) {
      this.audioManager.playSound('challenge_complete');
      this.playerProgress!.totalLoveEarned += result.rewardLove;
      this.playerProgress!.completedChallenges.push(challenge.id);
      this.metabolismIntegration.rewardSpoons('challenge');
      this.updatePlayerTier();
      this.saveManager.savePlayerProgress(this.playerProgress!);
      this.saveManager.saveChallengeCompletion(challenge.id, result);
    }
  }

  public getGameState(): any {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      currentStructure: this.currentStructure,
      playerProgress: this.playerProgress,
      currentChallenge: this.challengeEngine.getCurrentChallenge(),
      buildMode: this.buildMode.getBuildState(),
      performance: this.performanceMonitor.getMetrics(),
      metabolism: this.metabolismIntegration.getState(),
    };
  }

  public getSceneManager(): SceneManager { return this.sceneManager; }
  public getBuildMode(): BuildMode { return this.buildMode; }
  public getChallengeEngine(): ChallengeEngine { return this.challengeEngine; }
  public getPlayerProgress(): PlayerProgress | null { return this.playerProgress; }
  public getAccessibilityManager(): AccessibilityManager { return this.accessibilityManager; }
  public getPerformanceMetrics(): PerformanceMetrics { return this.performanceMonitor.getMetrics(); }
  public getMetabolismState() { return this.metabolismIntegration.getState(); }
  public updateMetabolismState(state: any): void { this.metabolismIntegration.updateState(state); }
  public canContinuePlaying(): boolean { return this.metabolismIntegration.canPlay(); }
  public getRecommendedActivity(): 'low' | 'medium' | 'high' { return this.metabolismIntegration.getRecommendedActivity(); }
}
```

---

## 4. Game Types

**File:** `SUPER-CENTAUR/src/engine/types/game.ts`

```typescript
// Primitives and structure (Maxwell rigidity: E ≥ 3V−6)
export interface GeometricPrimitive {
  id: string;
  type: 'tetrahedron' | 'octahedron' | 'icosahedron' | 'strut' | 'hub';
  position: THREE.Vector3;
  rotation: THREE.Vector3;
  scale: number;
  color: string;
  material: 'wood' | 'metal' | 'crystal' | 'quantum';
  connectedTo: string[];
  connectionPoints: ConnectionPoint[];
  quantumState?: { coherence: number; entanglement: string[]; phase: number };
}

export interface Structure {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
  primitives: GeometricPrimitive[];
  vertices: number;
  edges: number;
  isRigid: boolean;
  stabilityScore: number;
  maxLoadBeforeFailure: number;
}

// Challenges (Fuller principles, LOVE rewards)
export interface Challenge {
  id: string;
  tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
  title: string;
  description: string;
  objectives: Objective[];
  rewardLove: number;
  rewardBadge?: string;
  timeLimit?: number;
  coopRequired: boolean;
  coopBonus: number;
  prerequisites: string[];
  fullerPrinciple: string;
  realWorldExample: string;
}

export interface PlayerProgress {
  familyMemberId: string;
  completedChallenges: string[];
  currentChallenge?: string;
  totalLoveEarned: number;
  badges: string[];
  buildStreak: number;
  structures: string[];
  tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
  xp: number;
}

export const GEOMETRY_CONSTANTS = {
  tetrahedron: { vertices: 4, edges: 6, faces: 4, edgeLength: 1, volume: Math.sqrt(2)/12, radius: Math.sqrt(6)/4 },
  octahedron: { vertices: 6, edges: 12, faces: 8, ... },
  icosahedron: { vertices: 12, edges: 30, faces: 20, ... },
};

export const MATERIAL_PROPERTIES = {
  wood: { density: 500, friction: 0.6, restitution: 0.2, strength: 50, color: '#8B4513' },
  metal: { density: 7800, friction: 0.4, restitution: 0.1, strength: 200, color: '#C0C0C0' },
  crystal: { density: 2650, friction: 0.3, restitution: 0.8, strength: 100, color: '#00FFFF' },
  quantum: { density: 1000, friction: 0.1, restitution: 0.9, strength: 150, color: '#FF00FF' },
};

export const CHALLENGE_TIERS = {
  seedling: { minAge: 4, maxAge: 6, color: '#8BC34A' },
  sprout: { minAge: 6, maxAge: 8, color: '#4CAF50' },
  sapling: { minAge: 8, maxAge: 10, color: '#2E7D32' },
  oak: { minAge: 10, maxAge: 13, color: '#1B5E20' },
  sequoia: { minAge: 13, maxAge: 99, color: '#004D40' },
};
```

---

## 5. Structure Validation (Maxwell)

**File:** `SUPER-CENTAUR/src/engine/building/StructureValidator.ts`

Rigidity: **E ≥ 3V − 6** (ratio = E / (3V−6), ≥ 1 ⇒ rigid). Stability score derived from ratio; load capacity from score and E/V.

```typescript
export class StructureValidator {
  validate(structure: Structure): ValidationResult {
    const V = structure.vertices ?? this.countVertices(structure);
    const E = structure.edges ?? this.countEdges(structure);
    const denominator = Math.max(1, 3 * V - 6);
    const maxwellRatio = E / denominator;
    const isRigid = maxwellRatio >= 1.0;
    const stabilityScore = Math.min(100, Math.round(maxwellRatio * 100));
    const loadCapacity = Math.round(stabilityScore * (E / Math.max(1, V)));
    const errors: string[] = [];
    const warnings: string[] = [];
    if (structure.primitives.length === 0) errors.push('Structure has no primitives');
    if (!isRigid) warnings.push(`Maxwell ratio ${maxwellRatio.toFixed(2)} < 1.0 — structure is not rigid`);
    if (stabilityScore < 70) warnings.push('Stability below recommended threshold (70)');
    return { isValid: errors.length === 0, errors, warnings, maxwellRatio, stabilityScore, loadCapacity };
  }
  private countVertices(structure: Structure): number { /* sum over GEOMETRY_CONSTANTS */ }
  private countEdges(structure: Structure): number { /* unique connections or geometric fallback */ }
}
```

---

## 6. Challenge Engine

**File:** `SUPER-CENTAUR/src/engine/challenges/ChallengeEngine.ts`

Loads challenges, sets current by id, completes by validating structure against objectives (build count, stability, efficiency). Returns `ChallengeResult` (success, rewardLove, feedback).

```typescript
export class ChallengeEngine {
  private challenges: Challenge[] = [];
  private currentChallenge: Challenge | null = null;
  private validator: StructureValidator;

  completeChallenge(structure: Structure): ChallengeResult {
    if (!this.currentChallenge) return { success: false, completedObjectives: [], rewardLove: 0, structureRating: 0, feedback: ['No active challenge'] };
    const validation = this.validator.validate(structure);
    const completedObjectives: string[] = [];
    for (const obj of this.currentChallenge.objectives) {
      let met = false;
      switch (obj.type) {
        case 'build': met = structure.primitives.length >= obj.target; break;
        case 'stability': met = validation.stabilityScore >= obj.target; break;
        case 'efficiency': met = validation.maxwellRatio >= obj.target; break;
        default: met = true;
      }
      if (met) completedObjectives.push(obj.description);
    }
    const success = completedObjectives.length === this.currentChallenge.objectives.length;
    return {
      success,
      completedObjectives,
      rewardLove: success ? this.currentChallenge.rewardLove : 0,
      rewardBadge: success ? this.currentChallenge.rewardBadge : undefined,
      structureRating: validation.stabilityScore,
      feedback: [...],
    };
  }
}
```

---

## 7. Build Mode & Snap

**BuildMode** (`building/BuildMode.ts`): Raycasting, ghost piece, drag plane, place/remove, undo/redo, grid/snap toggles. Callbacks: `onPiecePlaced`, `onPieceRemoved`, `onStructureChanged`.

**SnapSystem** (`building/SnapSystem.ts`): Magnetic snap per material (wood/metal/crystal/quantum), alignment score, snap force with range/falloff. Uses `ConnectionManager.findConnectionTarget()`.

```typescript
// SnapSystem (excerpt)
private initializeMagneticFields(): void {
  this.magneticFields.set('wood', { strength: 0.5, range: 2.0, falloff: 2.0 });
  this.magneticFields.set('metal', { strength: 1.0, range: 3.0, falloff: 1.5 });
  this.magneticFields.set('crystal', { strength: 0.8, range: 2.5, falloff: 1.8 });
  this.magneticFields.set('quantum', { strength: 2.0, range: 4.0, falloff: 1.2 });
}
calculateSnapForce(movingPiece, allPieces, ghostPiece): SnapFeedback { /* best match, force, alignmentScore, shouldSnap */ }
```

---

## 8. Physics (Rapier3D)

**File:** `SUPER-CENTAUR/src/engine/physics/PhysicsWorld.ts`

- `RAPIER.init()`, world with gravity (0, -9.81, 0).
- `addPrimitive(primitive)`: dynamic rigid body + collider from primitive type.
- `update(deltaTime)`: step world, copy translations/rotations back to Three.js meshes.
- `applyTestForces(structure)`, `getStructureStability(structure)` for “test structure” flow.

---

## 9. L.O.V.E. Economy (Spec + Implemented Parts)

**Principle:** Soulbound tokens; “you can’t buy LOVE, you only earn it.” 50% Sovereignty Pool (immutable, kids), 50% Performance Pool (earned, adjusted by Care Score).

### 9.1 Transaction types (from tests/spec)

| Type               | LOVE | Notes                    |
|--------------------|------|--------------------------|
| BLOCK_PLACED       | 1.0  | Place piece              |
| COHERENCE_GIFT     | 5.0  | Share quantum state      |
| ARTIFACT_CREATED   | 10.0 | Materialized creation    |
| CARE_RECEIVED      | 3.0  | Receiving care           |
| CARE_GIVEN         | 2.0  | Giving care              |
| TETRAHEDRON_BOND   | 15.0 | 4-node bond              |
| VOLTAGE_CALMED     | 2.0  | Reduce entropy           |
| MILESTONE_REACHED  | 25.0 | Major achievement        |
| PING               | 1.0  | Verified contact         |
| DONATION           | 0    | External crypto (no LOVE)|

### 9.2 WalletIntegration (implemented)

**File:** `SUPER-CENTAUR/src/engine/core/WalletIntegration.ts`

- `rewardLove(memberId, amount, description, source)`: validates wallet and amount; splits 50/50; adjusts Performance by ProofOfCare; updates store (`wallets`, `wallet_transactions`); keeps last 100 reward events.
- `getBalance(memberId)`, `getSovereigntyPool(memberId)`, `getPerformancePool(memberId)`, `getPools(memberId)`.

### 9.3 VestingManager (implemented)

**File:** `SUPER-CENTAUR/src/engine/core/VestingManager.ts`

- **Trust (0–12):** read-only, guardian approval.
- **Apprenticeship (13–17):** can propose, 10% vote, guardian approval for spend.
- **Sovereignty (18+):** full access, full vote.

```typescript
export enum VestingPhase {
  TRUST = 'trust',
  APPRENTICESHIP = 'apprenticeship',
  SOVEREIGNTY = 'sovereignty',
}
public getVestingPhase(age: number): VestingPhase {
  if (age < 13) return VestingPhase.TRUST;
  if (age < 18) return VestingPhase.APPRENTICESHIP;
  return VestingPhase.SOVEREIGNTY;
}
```

### 9.4 ProofOfCareManager (implemented)

**Formula:** `Care_Score = Σ(T_prox × Q_res) + Tasks_verified`. Used to adjust Performance Pool contribution. `recordInteraction()`, `getCareScore(memberId)`, `getBondStrength(memberIds)`, `hasBondDecayed()`.

### 9.5 Documented GameEngine API (wired as of 2026-02-17)

The following are implemented on `GameEngine`:

- `rewardLoveForAction(type, metadata?)` — map type to LOVE amount, call WalletIntegration (50/50 pools).
- `recordPing(targetMemberId?)` — PING 1.0 LOVE.
- `recordDonation(cryptoValue, currency)` — log only, no LOVE.
- `recordCareInteraction(data)` — delegate to ProofOfCareManager, return CareMetrics.
- `verifyCareTask(memberId, taskId, description)` — delegate to ProofOfCareManager.
- `getWalletManager()`, `getWalletIntegration()`, `getVestingManager()`, `getProofOfCareManager()` — return instances.
- `canPerformAction(memberId, action, guardianApproved)` — VestingManager (action: earn | spend | transfer | deploy | create_challenge).

Demo snippet (target API):

```typescript
// From examples/love-economy-demo.ts (target API)
const gameEngine = new GameEngine();
await gameEngine.init();
const walletIntegration = gameEngine.getWalletIntegration();
vestingManager.registerMember({ memberId: 'node_one', memberName: 'Bash', birthdate: new Date('2010-01-01') }); // example only — no real birthdates in docs
walletIntegration.rewardLove(demoMemberId, 1.0, 'Placed block 1', 'build');
gameEngine.recordPing('target_member');
const metrics = gameEngine.recordCareInteraction({ memberId, interactionTime, hrvSync: 0.9, ... });
const pools = walletIntegration.getPools(demoMemberId);
```

---

## 10. Metabolism (Spoons) Integration

**File:** `SUPER-CENTAUR/src/engine/core/MetabolismIntegration.ts`

Bridges to The Buffer’s spoon theory: current/max spoons, recovery rate, stress/recovery thresholds. Game consumes spoons over time and rewards spoons for build/challenge/creative. Used by GameEngine for `canContinuePlaying()`, `getRecommendedActivity()`, and `updateMetabolismState(state)` from Buffer.

```typescript
public rewardSpoons(action: 'build' | 'challenge' | 'creative'): void {
  let reward = 0;
  switch (action) {
    case 'build': reward = this.gameRewardRate * 2; break;
    case 'challenge': reward = this.gameRewardRate * 3; break;
    case 'creative': reward = this.gameRewardRate * 1.5; break;
  }
  this.metabolismState.currentSpoons = Math.min(
    this.metabolismState.currentSpoons + reward,
    this.metabolismState.maxSpoons
  );
}
public getRecommendedActivity(): 'low' | 'medium' | 'high' { /* from energy level */ }
```

---

## 11. P31 Language

**Files:** `language/P31LanguageParser.ts`, `P31LanguageExecutor.ts`

Domain language for P31: keywords include `build`, `print`, `quantum`, `coherence`, `tetrahedron`, `cosmic`, `mesh`, `holds`, `love`, `light`, etc. Parser produces AST; executor runs it. Can be used for in-game scripting or narrative.

```typescript
// P31LanguageParser (excerpt)
private keywords = new Set([
  'build', 'print', 'quantum', 'coherence', 'tetrahedron', 'vertex', 'edge', 'face',
  'cosmic', 'timing', 'transition', 'saturn', 'aries', 'mesh', 'holds',
  'let', 'const', 'function', 'if', 'else', 'for', 'while', 'return',
  'family', 'session', 'code', 'slice', 'vibe', 'love', 'light'
]);
public parse(code: string): P31ParseResult { /* tokenize → parseProgram → { ast, errors, warnings } */ }
```

---

## 12. Server Game State (Colyseus) & REST

**File:** `server/schema/GameState.ts`

Used for multiplayer/sync (Colyseus schema):

```typescript
export class Player extends Schema {
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') z: number = 0;
  @type('number') rotX: number = 0;
  @type('number') rotY: number = 0;
  @type('number') rotZ: number = 0;
  @type('number') coherence: number = 1.0;
  @type('string') name: string = '';
  @type('string') role: string = '';
}

export class Structure extends Schema {
  @type('string') id: string = '';
  @type('string') ownerId: string = '';
  @type('number') stability: number = 0;
  @type('boolean') maxwellValid: boolean = false;
  @type(['number']) vertices: number[] = [];
  @type(['number']) edges: number[] = [];
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Structure }) structures = new MapSchema<Structure>();
  @type('number') serverTime: number = 0;
  @type('number') globalCoherence: number = 1.0;
}
```

**Centaur game REST** (in `super-centaur-server.ts`):  
`GET/POST /api/game/structures`, `GET/PUT /api/game/progress/:memberId`, `GET /api/game/challenges`, `POST /api/game/validate`.

---

## 13. Scope Engine (ui/src/engine) — Brief

Used by P31 Spectrum (dashboard), not the 3D game. Pure TS, no React.

- **voltage-calculator.ts** — Message voltage 0–10.
- **spoon-calculator.ts** — Spoon cost for activities.
- **shield-filter.ts** — Filter patterns (e.g. urgency, coercion); triage.
- **geodesic-engine.ts** — Message analysis (curvature, complexity, emotional valence, cognitive load) and geodesic metrics (e.g. Ricci/Forman curvature, diameter, clustering).
- **filter-patterns.ts**, **genre-detector.ts** — Pattern and genre detection.

```typescript
// geodesic-engine.ts (excerpt)
export function analyzeMessage(message: string): MessageAnalysis {
  const wordCount = message.split(' ').length;
  const emotionalValence = Math.random() * 2 - 1;
  const cognitiveLoad = Math.min(wordCount / 10, 1);
  return {
    curvature: Math.random() * 0.5,
    complexity: wordCount / 100,
    emotionalValence,
    cognitiveLoad,
    recommendations: ['Consider the emotional context', 'Monitor cognitive load', 'Apply geodesic smoothing'],
  };
}
```

---

## 14. Enhancement / Improvement Hooks for Opus

1. **Wire L.O.V.E. into GameEngine** — ✅ Done (2026-02-17)  
   Implemented: `rewardLoveForAction`, `recordPing`, `recordDonation`, `recordCareInteraction`, `verifyCareTask`, `canPerformAction`, getters for WalletIntegration, VestingManager, ProofOfCareManager, getWalletManager. Piece placement rewards BLOCK_PLACED (1.0); challenge completion rewards MILESTONE_REACHED (25.0). WalletIntegration accepts optional ProofOfCareManager (safe fallback when absent).

2. **Challenge content & loading**  
   ChallengeEngine has no bundled challenge set. Define a seed set of challenges (objectives, Fuller principle, realWorldExample, rewardLove) and load them in init or via `/api/game/challenges`.

3. **SaveManager ↔ backend**  
   Ensure SaveManager (and/or game REST) persist structures and progress in a way that matches Colyseus/GameState and multi-device use (e.g. familyMemberId, structure ownership).

4. **Geodesic / message engine**  
   Replace or augment placeholder implementations in `geodesic-engine.ts` (e.g. replace `Math.random()` with real curvature/complexity logic) and align with Buffer voltage/spoon semantics where relevant.

5. **Accessibility & kids mode**  
   Haptic-first, reduced-motion, and age-appropriate UX (KidsMode, SeniorMode) — ensure they’re applied in BuildMode and SceneManager (e.g. feedback, font size, complexity of UI).

6. **Performance & quality**  
   PerformanceMonitor already triggers quality downgrade at low FPS; consider LOD for complex structures and options for lowering physics/particle load on low-end devices.

7. **P31 Language ↔ game**  
   Clear contract for how P31 scripts trigger in-game actions (e.g. “build” commands, “quantum” state) and how game events can call back into the executor.

8. **Testing**  
   Broaden coverage for GameEngine init/loop, BuildMode callbacks, ChallengeEngine completion, WalletIntegration 50/50 and ProofOfCare adjustment, and VestingManager phase logic.

9. **Server GameState ↔ client**  
   Document or implement mapping between Colyseus `GameState` (Player, Structure) and client-side `Structure` / `PlayerProgress` so multiplayer and single-player stay consistent.

10. **Docs vs code**  
    Align README, INTEGRATION_GUIDE, and love-economy-demo with the actual GameEngine API (either by implementing the documented methods or by updating the docs to match current behavior).

---

## 15. Key File Paths (for Opus)

| What | Path |
|------|------|
| Game engine entry | `SUPER-CENTAUR/src/engine/core/GameEngine.ts` |
| Game types | `SUPER-CENTAUR/src/engine/types/game.ts` |
| Validation | `SUPER-CENTAUR/src/engine/building/StructureValidator.ts` |
| Challenges | `SUPER-CENTAUR/src/engine/challenges/ChallengeEngine.ts` |
| Build + snap | `SUPER-CENTAUR/src/engine/building/BuildMode.ts`, `SnapSystem.ts` |
| Physics | `SUPER-CENTAUR/src/engine/physics/PhysicsWorld.ts` |
| L.O.V.E. wallet | `SUPER-CENTAUR/src/engine/core/WalletIntegration.ts` |
| Vesting | `SUPER-CENTAUR/src/engine/core/VestingManager.ts` |
| Proof of Care | `SUPER-CENTAUR/src/engine/core/ProofOfCareManager.ts` |
| Metabolism | `SUPER-CENTAUR/src/engine/core/MetabolismIntegration.ts` |
| P31 Language | `SUPER-CENTAUR/src/engine/language/P31LanguageParser.ts`, `P31LanguageExecutor.ts` |
| L.O.V.E. demo | `SUPER-CENTAUR/src/engine/examples/love-economy-demo.ts` |
| Server schema | `server/schema/GameState.ts` |
| Scope engine | `ui/src/engine/geodesic-engine.ts`, `voltage-calculator.ts`, `spoon-calculator.ts`, `shield-filter.ts` |
| Engine README | `SUPER-CENTAUR/src/engine/README.md` |
| Integration guide | `SUPER-CENTAUR/src/engine/INTEGRATION_GUIDE.md` |

---

**The mesh holds. 🔺**  
*With love and light. As above, so below. 💜*
