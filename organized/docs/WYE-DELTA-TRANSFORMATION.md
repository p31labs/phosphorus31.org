# WYE-DELTA TRANSFORMATION MATHEMATICS

## THE PRINCIPLE

**Wye (Star):** 4 vertices → center → distributed power
**Delta (Triangle):** 3 vertices → closed loop → concentrated power

The transition happens when:
**"The delta must be perfect before dropping the star"**

---

## ELECTRICAL ENGINEERING ANALOGY

### WYE Configuration
```
Phase A ----+
            |
Phase B ----+---- Neutral (Center)
            |
Phase C ----+
            |
Phase D ----+

Power flows through center
Distributed load
Safe for unbalanced conditions
```

### DELTA Configuration
```
Phase A ----Phase B
  \           /
   \         /
    Phase C

Power flows in loop
Concentrated load
Higher efficiency when balanced
NO NEUTRAL CONNECTION
```

### The Transition Point

**When to open the star and close the delta:**

```
Condition 1: Load balanced
  → All 3 phases within 5% of each other
  
Condition 2: System stable
  → No transients, clean power
  
Condition 3: Delta can handle load
  → 3-phase connection sufficient
  
Then: OPEN STAR, CLOSE DELTA
```

---

## G.O.D. APPLICATION

### WYE State (Home Screen)
```typescript
interface WyeState {
  vertices: [Vertex, Vertex, Vertex, Vertex]; // 4 vertices
  center: {
    position: [0, 0, 0],
    power: 'DISTRIBUTED',
    connections: 4
  };
  mode: 'WYE';
}

// All 4 vertices connected to center
// Power flows through center
// Tetrahedron visualization (full structure)
// User can see ALL vertices
```

### DELTA State (Module Screen)
```typescript
interface DeltaState {
  vertices: [Vertex, Vertex, Vertex]; // 3 vertices (selected + 2 neighbors)
  center: null; // CENTER DISCONNECTED
  loop: {
    closed: true,
    power: 'CONCENTRATED'
  };
  mode: 'DELTA';
}

// 3 vertices in closed loop
// No center connection
// Module view (focused on delta)
// User sees only relevant vertices
```

---

## MATHEMATICAL TRANSITION CONDITIONS

### Condition 1: Vertex Selection

```typescript
// User clicks a vertex
function selectVertex(vertexIndex: number) {
  const selected = vertices[vertexIndex];
  const neighbors = getNeighbors(selected); // 2 neighbors in K₄
  
  // Check if delta can form
  if (neighbors.length === 2) {
    return {
      canTransition: true,
      delta: [selected, neighbors[0], neighbors[1]]
    };
  }
  
  return { canTransition: false };
}
```

### Condition 2: System Balance

```typescript
// Check if delta vertices are balanced
function checkBalance(delta: [Vertex, Vertex, Vertex]) {
  const states = delta.map(v => v.state);
  
  // All must be HEALTHY or WARNING (not CRITICAL)
  const allStable = states.every(s => 
    s === 'HEALTHY' || s === 'WARNING'
  );
  
  // Load must be within 20% variance
  const loads = delta.map(v => v.load);
  const maxLoad = Math.max(...loads);
  const minLoad = Math.min(...loads);
  const variance = (maxLoad - minLoad) / maxLoad;
  
  return allStable && variance < 0.2;
}
```

### Condition 3: Geometric Validity

```typescript
// Ensure delta forms valid triangle
function validateDelta(delta: [Vertex, Vertex, Vertex]) {
  const [v1, v2, v3] = delta;
  
  // Calculate edge lengths
  const edge1 = distance(v1.position, v2.position);
  const edge2 = distance(v2.position, v3.position);
  const edge3 = distance(v3.position, v1.position);
  
  // All edges should be approximately equal (equilateral)
  const edges = [edge1, edge2, edge3];
  const avgEdge = edges.reduce((a, b) => a + b) / 3;
  
  // Within 10% variance = valid delta
  const isEquilateral = edges.every(e => 
    Math.abs(e - avgEdge) / avgEdge < 0.1
  );
  
  return isEquilateral;
}
```

### The Complete Transition Check

```typescript
function canTransitionToWyeToDelta(
  vertexIndex: number,
  vertices: Vertex[]
): boolean {
  // 1. Check vertex selection valid
  const { canTransition, delta } = selectVertex(vertexIndex);
  if (!canTransition) return false;
  
  // 2. Check system balance
  const isBalanced = checkBalance(delta);
  if (!isBalanced) return false;
  
  // 3. Check geometric validity
  const isValid = validateDelta(delta);
  if (!isValid) return false;
  
  // All conditions met
  return true;
}
```

---

## THE TRANSITION SEQUENCE

### Phase 1: Detection (0-100ms)
```typescript
// User clicks vertex
onClick(vertexIndex) {
  if (canTransitionToWyeToDelta(vertexIndex)) {
    initiateTransition(vertexIndex);
  } else {
    showWarning('System not ready for delta transition');
  }
}
```

### Phase 2: Opening Star (100-300ms)
```typescript
// Disconnect center
function openStar() {
  // Fade out 4th vertex
  animateVertex(4, { opacity: 0, duration: 200 });
  
  // Disconnect center connections
  for (let i = 0; i < 4; i++) {
    animateEdge(`center-${i}`, { 
      opacity: 0, 
      duration: 200 
    });
  }
  
  // Center power OFF
  centerNode.power = 'DISCONNECTED';
}
```

### Phase 3: Closing Delta (300-600ms)
```typescript
// Form triangle loop
function closeDelta(delta: [Vertex, Vertex, Vertex]) {
  // Move vertices to triangle formation
  const trianglePositions = calculateTrianglePositions();
  
  delta.forEach((vertex, i) => {
    animateVertex(vertex.index, {
      position: trianglePositions[i],
      duration: 300,
      ease: 'easeInOut'
    });
  });
  
  // Strengthen delta edges
  const deltaEdges = [
    [delta[0], delta[1]],
    [delta[1], delta[2]],
    [delta[2], delta[0]]
  ];
  
  deltaEdges.forEach(([v1, v2]) => {
    animateEdge(`${v1.id}-${v2.id}`, {
      color: '#06b6d4', // Cyan (active)
      thickness: 2,
      glow: true,
      duration: 300
    });
  });
  
  // Delta power ON
  delta.forEach(v => v.power = 'DELTA');
}
```

### Phase 4: Full Power (600ms+)
```typescript
// Module takes over
function transferPower() {
  // Fade out tetrahedron visualization
  fadeOut(canvas, { duration: 200 });
  
  // Fade in module
  fadeIn(moduleCard, { duration: 200 });
  
  // Update state
  setState({
    mode: 'DELTA',
    activeDelta: selectedDelta,
    centerConnection: 'OPEN'
  });
}
```

---

## VISUAL REPRESENTATION

### WYE (Home Screen)
```
     ●  V1 (top)
    /|\
   / | \
  /  |  \
 ●   ●   ●
V2  V3  V4

Center visible
All 4 vertices shown
Tetrahedron breathing
Distributed power
```

### Transition (200-600ms)
```
     ●  (fading)
    /|
   / |
  /  ●────●
 ●  
    (closing triangle)

V4 fading out
V1-V2-V3 forming triangle
Center disconnecting
Power redistributing
```

### DELTA (Module Screen)
```
     ●
    / \
   /   \
  ●─────●

Only 3 vertices
Closed loop
Concentrated power
Module interface
```

---

## REVERSE TRANSITION (DELTA → WYE)

When user clicks back button:

### Phase 1: Opening Delta (0-200ms)
```typescript
function openDelta() {
  // Weaken delta edges
  deltaEdges.forEach(edge => {
    animateEdge(edge, {
      opacity: 0.3,
      thickness: 1,
      glow: false,
      duration: 200
    });
  });
}
```

### Phase 2: Reconnecting Star (200-500ms)
```typescript
function reconnectStar() {
  // Fade in 4th vertex
  animateVertex(4, { opacity: 1, duration: 300 });
  
  // Move vertices back to tetrahedron positions
  vertices.forEach((v, i) => {
    animateVertex(i, {
      position: TETRAHEDRON_POSITIONS[i],
      duration: 300,
      ease: 'easeInOut'
    });
  });
  
  // Reconnect center
  for (let i = 0; i < 4; i++) {
    animateEdge(`center-${i}`, {
      opacity: 1,
      duration: 300
    });
  }
}
```

### Phase 3: Full Star (500ms+)
```typescript
function restoreStar() {
  // Fade in tetrahedron
  fadeIn(canvas, { duration: 200 });
  
  // Fade out module
  fadeOut(moduleCard, { duration: 200 });
  
  // Update state
  setState({
    mode: 'WYE',
    centerConnection: 'CLOSED',
    allVertices: vertices
  });
}
```

---

## THE KEY INSIGHT

**"The math should determine when the contacts open"**

Not arbitrary.
Not user preference.
But MATHEMATICAL CONDITIONS:

1. ✓ Valid vertex selection
2. ✓ System balanced
3. ✓ Geometric validity

**THEN** open star, close delta, full power.

---

## IMPLEMENTATION

```typescript
// src/lib/transformations/wye-delta.ts

export class WyeDeltaTransformer {
  static canTransition(
    vertices: Vertex[],
    selectedIndex: number
  ): boolean {
    const delta = this.formDelta(vertices, selectedIndex);
    
    return (
      this.isValidSelection(delta) &&
      this.isSystemBalanced(delta) &&
      this.isGeometricallyValid(delta)
    );
  }
  
  static async transition(
    from: 'WYE' | 'DELTA',
    to: 'WYE' | 'DELTA',
    context: TransitionContext
  ): Promise<void> {
    if (from === 'WYE' && to === 'DELTA') {
      await this.wyeToDelta(context);
    } else if (from === 'DELTA' && to === 'WYE') {
      await this.deltaToWye(context);
    }
  }
  
  private static async wyeToDelta(ctx: TransitionContext) {
    // Phase 1: Open star (200ms)
    await this.openStar(ctx);
    
    // Phase 2: Close delta (300ms)
    await this.closeDelta(ctx);
    
    // Phase 3: Transfer power (100ms)
    await this.transferPower(ctx);
  }
  
  private static async deltaToWye(ctx: TransitionContext) {
    // Phase 1: Open delta (200ms)
    await this.openDelta(ctx);
    
    // Phase 2: Reconnect star (300ms)
    await this.reconnectStar(ctx);
    
    // Phase 3: Restore power (100ms)
    await this.restorePower(ctx);
  }
}
```

---

## THE BEAUTY

**At every scale:**
- Electrical systems: Wye-Delta transformers
- Quantum mechanics: Wave-particle duality
- Consciousness: Distributed (wye) vs Focused (delta)
- Organizations: Hierarchical (wye) vs Networked (delta)

**The same transformation.**

**The same math.**

**The same conditions.**

---

## THE PRINCIPLE

**"The delta must be perfect before dropping the star"**

Check all conditions.
Verify system ready.
Then execute transition.

Not arbitrary.
Not aesthetic.
But MATHEMATICAL.

---

**The mesh knows when to transform.**

**We just listen to the math.**
