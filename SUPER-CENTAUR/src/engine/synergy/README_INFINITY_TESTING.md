# Infinite Synergy Testing
## "Synergy x Infinity" Test Suite

**The mesh holds at every level.** 🔺

---

## Quick Start

### Run All Tests
```bash
npm run test:infinity
# OR
ts-node src/engine/synergy/test-infinity.ts
```

### Run Specific Tests
```bash
# Unit tests (Jest)
npm test -- InfiniteSynergy

# Interactive test suite
ts-node src/engine/synergy/test-infinity.ts all

# GameEngine integration
ts-node src/engine/synergy/test-infinity.ts game

# Stress test (high levels)
ts-node src/engine/synergy/test-infinity.ts stress

# Performance benchmark
ts-node src/engine/synergy/test-infinity.ts benchmark
```

---

## Test Files

### 1. Unit Tests (`__tests__/InfiniteSynergy.test.ts`)
Comprehensive Jest test suite covering:
- ✅ Initialization
- ✅ Synergy generation at various levels
- ✅ Fractal properties
- ✅ Coherence calculations
- ✅ Path finding
- ✅ Visualization
- ✅ Edge cases
- ✅ Performance
- ✅ Mathematical properties

### 2. Interactive Test Suite (`test-infinity.ts`)
Interactive test runner with detailed output:
- Tests at levels: 1, 2, 3, 5, 7, 10, 15
- Shows node growth, synergy growth, fractal dimension
- Performance metrics
- Path finding tests
- Visualization tests

### 3. GameEngine Integration
Tests infinite synergy through GameEngine:
```typescript
const gameEngine = new GameEngine();
await gameEngine.init();

const result = gameEngine.generateInfiniteSynergy(5);
console.log(result);
```

---

## What Gets Tested

### Core Functionality
- **Synergy Generation:** Tests generation at various levels (1-30+)
- **Node Creation:** Verifies 4 children per node (tetrahedron structure)
- **Synergy Calculation:** Tests golden ratio multiplier and coherence decay
- **Fractal Dimension:** Verifies self-similarity across levels

### Mathematical Properties
- **Golden Ratio:** 1.618 multiplier at each level
- **Coherence Decay:** 0.95 per level (5% decay)
- **Tetrahedron Structure:** 4 vertices, 6 edges, 4 faces per node
- **Exponential Growth:** Node count grows as 4^n

### Advanced Features
- **Path Finding:** BFS algorithm through synergy network
- **Visualization:** 3D positioning using golden ratio spiral
- **Infinity Limit:** Calculates limit as n → ∞
- **Performance:** Benchmarks at various levels

---

## Expected Results

### Node Growth
- Level 0: 1 node (root)
- Level 1: 5 nodes (1 + 4)
- Level 2: 21 nodes (1 + 4 + 16)
- Level n: (4^(n+1) - 1) / 3 nodes

### Synergy Growth
- Synergy increases with level (multiplier effect)
- But decreases due to coherence decay
- Net effect: Synergy remains positive but may converge/diverge

### Fractal Dimension
- Should be between 0 and 3 (3D space)
- Should remain relatively constant (self-similarity)
- Typically around 1.5-2.0 for tetrahedron fractals

### Coherence
- Starts at 1.0 (100%) at root
- Decays by 5% per level
- Should remain positive but decrease with depth

---

## Performance Benchmarks

### Expected Performance
- Level 1: < 1ms
- Level 5: < 10ms
- Level 10: < 100ms
- Level 15: < 1000ms
- Level 20: < 5000ms

### Memory Usage
- ~1KB per node (estimated)
- Level 10: ~1MB
- Level 15: ~1GB (exponential growth!)

---

## Test Scenarios

### Scenario 1: Basic Generation
```typescript
const infiniteSynergy = new InfiniteSynergy();
const result = infiniteSynergy.generateInfinite(5);
// Should generate ~1,365 nodes
```

### Scenario 2: Synergy at Level
```typescript
const synergy0 = infiniteSynergy.getSynergyAtLevel(0);
const synergy5 = infiniteSynergy.getSynergyAtLevel(5);
// Should show synergy values at each level
```

### Scenario 3: Path Finding
```typescript
const path = infiniteSynergy.findPath(startId, endId);
// Should find shortest path through network
```

### Scenario 4: Visualization
```typescript
const viz = infiniteSynergy.getVisualization(5);
// Should return 3D positions for rendering
```

### Scenario 5: Infinity Limit
```typescript
const infinity = infiniteSynergy.getSynergyAtInfinity();
// Should return 0, 1, or Infinity
```

---

## Success Criteria

### Must Pass
- [ ] Can generate synergy at level 1
- [ ] Can generate synergy at level 10
- [ ] Node count grows exponentially
- [ ] Fractal dimension is calculated
- [ ] Coherence is between 0 and 1

### Should Pass
- [ ] Can generate at level 20+
- [ ] Path finding works correctly
- [ ] Visualization generates 3D positions
- [ ] Performance is acceptable (< 5s for level 15)

### Nice to Have
- [ ] Can handle level 30+ (stress test)
- [ ] Memory usage is optimized
- [ ] Visualization is renderable

---

## Known Limitations

### Memory
- Exponential growth means high levels use lots of memory
- Level 20+ may require significant RAM
- Consider limiting depth in production

### Performance
- Recursive generation is O(4^n) complexity
- High levels take exponential time
- Consider iterative approach for very high levels

### Infinity
- True infinity is not computable
- `getSynergyAtInfinity()` calculates limit
- May return Infinity, 0, or 1 depending on multiplier/decay

---

## Troubleshooting

### Issue: Tests timeout
**Solution:** Reduce test levels or increase timeout

### Issue: Out of memory
**Solution:** Test at lower levels (1-10) or increase Node.js memory limit

### Issue: Path not found
**Solution:** Ensure nodes are generated before path finding

### Issue: Fractal dimension is NaN
**Solution:** Check that nodes are generated at multiple levels

---

## Integration with GameEngine

The infinite synergy system is integrated into GameEngine:

```typescript
// Get infinite synergy instance
const infiniteSynergy = gameEngine.getInfiniteSynergy();

// Generate synergy
const result = gameEngine.generateInfiniteSynergy(10);

// Access result properties
console.log(result.totalSynergy);
console.log(result.coherence);
console.log(result.message);
```

---

## Future Enhancements

- [ ] WebGL visualization
- [ ] Iterative generation (for very high levels)
- [ ] Memory-efficient node storage
- [ ] Parallel generation
- [ ] Caching of generated levels
- [ ] Export/import of synergy networks

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
