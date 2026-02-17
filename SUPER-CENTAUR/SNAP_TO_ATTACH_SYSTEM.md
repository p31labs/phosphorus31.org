# Snap-to-Attach System Implementation

## Overview

The Snap-to-Attach system implements magnetic snapping for the 3D building game, allowing pieces to automatically connect at vertices and edges following Fuller's tensegrity principles. This system replaces the previous simple grid snapping with intelligent connection-based placement.

## Architecture

### Core Components

1. **ConnectionSystem.js** - Core connection logic and geometry calculations
2. **useGameState.js** - Updated state management with magnetic snapping
3. **BuildToolbar.jsx** - UI controls for snapping modes
4. **GeoPrimitive.jsx** - Visual connection indicators
5. **StructureValidator.ts** - Updated validation using actual connections

### Key Features

- **Vertex-to-Vertex Connection**: Pieces snap at their geometric vertices
- **Edge-to-Edge Connection**: Future support for edge connections
- **Magnetic Snapping**: Automatic attraction to nearest valid connection point
- **Connection Visualization**: Visual lines showing connections between pieces
- **Compatibility Rules**: Smart connection rules based on piece types

## Implementation Details

### Connection Point Calculation

Each primitive type has predefined connection points:

- **Tetrahedron**: 4 vertices at calculated positions
- **Octahedron**: 6 vertices at axis-aligned positions  
- **Icosahedron**: 12 vertices using golden ratio geometry
- **Strut**: 2 end vertices + center point
- **Hub**: Single center connection point

### Snapping Algorithm

1. **Detection**: When placing a piece, find all nearby pieces
2. **Compatibility Check**: Verify pieces can connect based on type rules
3. **Connection Finding**: Calculate closest connection points between pieces
4. **Position Calculation**: Determine optimal placement position
5. **Connection Creation**: Update both pieces' connectedTo arrays

### Connection Rules

- **Struts** can connect to any piece type
- **Hubs** can connect to any piece type
- **Polyhedra** (tetrahedron, octahedron, icosahedron) can connect to each other
- **Distance Threshold**: Maximum 2.0 units for connection detection

## Usage

### Enabling Magnetic Snapping

```javascript
// In BuildToolbar
<button onClick={() => setMagneticSnapEnabled(!magneticSnapEnabled)}>
  Magnetic Snap
</button>
```

### Connection State

Each piece now includes a `connectedTo` array:

```javascript
const piece = {
  id: 'p_1234_abcd',
  type: 'tetrahedron',
  position: { x: 1, y: 0.5, z: 2 },
  connectedTo: ['p_5678_efgh', 'p_9012_ijkl'] // Connected pieces
}
```

### Visual Feedback

- **Connection Lines**: Cyan lines visualize connections between pieces
- **Pulsing Effect**: Connected pieces have a subtle pulsing animation
- **Hover Effects**: Enhanced hover feedback for connected pieces

## Integration with Existing Systems

### Maxwell Validation

The StructureValidator now counts actual connections instead of geometric edges:

```typescript
// Before: Count geometric edges
const edges = primitives.reduce((sum, p) => sum + (GEOMETRY_EDGES[p.type] || 0), 0);

// After: Count actual connections
let total = 0;
for (const p of structure.primitives) {
  for (const connectedId of p.connectedTo) {
    // Count unique connections
  }
}
```

### Undo/Redo System

The connection system integrates seamlessly with the existing undo/redo functionality:

- Connections are preserved when undoing/redoing operations
- Connection state is part of the primitive data structure
- No additional undo/redo logic required

## Performance Considerations

### Caching

- Connection points are cached per type and scale
- Geometry calculations are memoized to prevent recalculation
- Connection detection uses spatial optimization

### Optimization

- Connection finding limited to 2.0 unit radius
- Early exit for incompatible piece types
- Efficient matrix transformations for world space calculations

## Future Enhancements

### Planned Features

1. **Edge Connections**: Support for edge-to-edge connections
2. **Connection Strength**: Different connection types with varying strength
3. **Connection Limits**: Maximum connections per piece type
4. **Connection Angles**: Angle-based connection validation
5. **Connection Audio**: Sound effects for successful connections

### Technical Improvements

1. **Spatial Indexing**: Use spatial data structures for large structures
2. **Connection Validation**: Real-time validation during placement
3. **Connection History**: Track connection creation/destruction
4. **Connection Debugging**: Visual debugging tools for connection issues

## Testing

### Test Suite

The `ConnectionTest.js` file provides comprehensive testing:

```javascript
import { runAllTests } from './ConnectionTest';
runAllTests(); // Runs all connection system tests
```

### Test Coverage

- Connection point generation for all primitive types
- Connection finding between different piece combinations
- Snap position calculation accuracy
- Connection compatibility rules
- Edge cases and error conditions

## Troubleshooting

### Common Issues

1. **No Connections Found**: Check distance threshold and piece compatibility
2. **Incorrect Snap Position**: Verify connection point calculations
3. **Performance Issues**: Monitor connection detection radius
4. **Visual Glitches**: Check connection line geometry calculations

### Debug Tools

- Console logging in ConnectionTest.js
- Visual connection indicators in GeoPrimitive
- Connection point visualization (future enhancement)

## API Reference

### ConnectionSystem Functions

```typescript
// Get connection points for a primitive type
getConnectionPoints(type: string, scale: number): ConnectionPoint[]

// Find closest connection between two pieces
findClosestConnectionPoint(source: Piece, target: Piece, maxDistance: number): Connection | null

// Calculate optimal placement position
calculateSnapPosition(source: Piece, target: Piece, connection: Connection): Vector3 | null

// Check if two piece types can connect
canConnect(sourceType: string, targetType: string): boolean

// Find all valid connection targets
findConnectionTargets(source: Piece, allPieces: Piece[], maxDistance: number): Target[]
```

### State Management

```typescript
// useGameState additions
const {
  magneticSnapEnabled,
  setMagneticSnapEnabled
} = gameState;
```

## Conclusion

The Snap-to-Attach system successfully implements Fuller's tensegrity principles for the 3D building game. It provides intuitive magnetic snapping while maintaining the structural integrity validation through Maxwell's criteria. The system is extensible and ready for future enhancements like edge connections and connection strength variations.