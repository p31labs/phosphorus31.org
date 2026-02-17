# Vibe Coding to Print
## Code → Build → Slice → Print Workflow

**"Vibe coding inside the game environment with internal slicing and push straight to printer"**

💜 **With love and light. As above, so below.** 💜

---

## Overview

P31 Game Engine now supports a complete workflow from in-game coding to physical 3D printing:

1. **Vibe Code** — Write code in the game environment (JavaScript, TypeScript, Python, GLSL, HLSL)
2. **Build** — Code generates or modifies structures in real-time
3. **Slice** — Internal slicing engine processes the 3D model
4. **Print** — Push G-code directly to your 3D printer

**All inside the game. No external tools needed.**

---

## Workflow

### 1. Vibe Coding

Write code that generates or modifies structures:

```javascript
// Example: Generate a tetrahedron structure
const structure = {
  id: 'vibe_tetra',
  name: 'Vibe Tetrahedron',
  primitives: [
    {
      id: 'tet_1',
      type: 'tetrahedron',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1.0,
      color: '#FF6B9D',
      material: 'quantum'
    }
  ]
};

// Modify game structure
game.setStructure(structure);
```

### 2. Build in Game

- Code executes in real-time
- Structures appear in the game world
- Physics validation runs automatically
- Maxwell's Rule enforced

### 3. Internal Slicing

The slicing engine processes your structure:

- **Layer generation** — Automatic layer calculation
- **Perimeter generation** — Outer walls
- **Infill generation** — Internal structure (grid, honeycomb, lines, triangles)
- **Support generation** — Automatic support if needed
- **G-code generation** — Ready for printer

### 4. Push to Printer

Direct printer communication:

- **USB printers** — Web Serial API
- **Network printers** — OctoPrint, Klipper, Marlin
- **Automatic connection** — Scan and connect
- **Progress monitoring** — Real-time print status

---

## API Usage

### Complete Workflow: `vibeCodeToPrint()`

```typescript
const result = await gameEngine.vibeCodeToPrint(
  code,                    // Your code
  'javascript',            // Language
  {                        // Optional slice config
    layerHeight: 0.2,
    infillDensity: 0.2,
    supportEnabled: false
  },
  'printer_1'              // Optional printer ID
);

// Returns:
// {
//   projectId: string,
//   structureId: string,
//   slicedModelId: string,
//   printJobId: string,
//   gcode: string
// }
```

### Quick Print: `quickPrint()`

If you've already built a structure:

```typescript
const result = await gameEngine.quickPrint(
  {                        // Optional slice config
    layerHeight: 0.2,
    infillDensity: 0.2
  },
  'printer_1'              // Optional printer ID
);

// Returns:
// {
//   slicedModelId: string,
//   printJobId: string,
//   gcode: string
// }
```

### Individual Steps

You can also use each step independently:

```typescript
// 1. Vibe code
const project = gameEngine.getVibeCodingManager().createProject('My Project', 'javascript');
gameEngine.getVibeCodingManager().updateProject(project.id, code);
const execution = await gameEngine.getVibeCodingManager().executeCode(project.id);

// 2. Get structure
const structure = gameEngine.getCurrentStructure();

// 3. Slice
const slicedModel = await gameEngine.getSlicingEngine().sliceModel(geometry, config);

// 4. Generate G-code
const gcode = gameEngine.getSlicingEngine().exportToGCode(slicedModel);

// 5. Print
const printJob = await gameEngine.getPrinterIntegration().printGCode(gcode, printerId);
```

---

## Slicing Configuration

```typescript
interface SliceConfig {
  layerHeight: number;        // mm (default: 0.2)
  infillDensity: number;       // 0-1 (default: 0.2)
  infillPattern: 'grid' | 'honeycomb' | 'lines' | 'triangles';
  supportEnabled: boolean;    // (default: false)
  supportAngle: number;        // degrees (default: 45)
  supportDensity: number;      // 0-1 (default: 0.15)
  perimeterCount: number;      // (default: 2)
  topLayers: number;           // (default: 4)
  bottomLayers: number;        // (default: 4)
  printSpeed: number;          // mm/s (default: 50)
  travelSpeed: number;         // mm/s (default: 150)
  temperature: number;         // Celsius (default: 210)
  bedTemperature: number;      // Celsius (default: 60)
}
```

---

## Printer Integration

### Supported Printers

- **USB Printers** — Via Web Serial API
- **OctoPrint** — Network printers
- **Klipper** — High-speed printers
- **Marlin** — Standard firmware

### Printer Discovery

```typescript
// Scan for printers
const printers = await gameEngine.getPrinterIntegration().scanPrinters();

// Connect to printer
await gameEngine.getPrinterIntegration().connect('printer_1');

// Get print jobs
const jobs = gameEngine.getPrinterIntegration().getPrintJobs();
```

---

## Code Examples

### Example 1: Simple Tetrahedron

```javascript
// Create a simple tetrahedron structure
const tetra = {
  id: 'print_tetra',
  name: 'Print Tetrahedron',
  primitives: [
    {
      id: 't1',
      type: 'tetrahedron',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 2.0,
      color: '#FF6B9D',
      material: 'quantum'
    }
  ]
};

game.setStructure(tetra);
```

### Example 2: Complex Structure

```javascript
// Build a complex structure with code
const primitives = [];

for (let i = 0; i < 4; i++) {
  const angle = (i / 4) * Math.PI * 2;
  primitives.push({
    id: `tet_${i}`,
    type: 'tetrahedron',
    position: {
      x: Math.cos(angle) * 2,
      y: 0,
      z: Math.sin(angle) * 2
    },
    rotation: { x: 0, y: angle, z: 0 },
    scale: 1.0,
    color: `hsl(${i * 90}, 70%, 60%)`,
    material: 'quantum'
  });
}

const structure = {
  id: 'complex_structure',
  name: 'Complex Structure',
  primitives
};

game.setStructure(structure);
```

### Example 3: Parameterized Design

```javascript
// Function to generate parameterized structures
function generateStructure(params) {
  const { count, radius, scale } = params;
  const primitives = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    primitives.push({
      id: `prim_${i}`,
      type: 'tetrahedron',
      position: {
        x: Math.cos(angle) * radius,
        y: 0,
        z: Math.sin(angle) * radius
      },
      rotation: { x: 0, y: angle, z: 0 },
      scale,
      color: `hsl(${i * 360 / count}, 70%, 60%)`,
      material: 'quantum'
    });
  }
  
  return {
    id: 'param_structure',
    name: 'Parameterized Structure',
    primitives
  };
}

const structure = generateStructure({ count: 6, radius: 3, scale: 1.5 });
game.setStructure(structure);
```

---

## Integration with Game Features

### Physics Validation

Structures are automatically validated:
- **Maxwell's Rule** — E ≥ 3V - 6 for rigidity
- **Stability scoring** — 0-100 based on structure
- **Load capacity** — Estimated max load

### LOVE Economy

Printing can earn LOVE tokens:
- **Design tokens** — For creative structures
- **Print tokens** — For successful prints
- **Quality tokens** — For high stability scores

### Family Co-Op

Build structures together, then print:
- **Collaborative design** — Family builds together
- **Shared prints** — Everyone benefits
- **Family achievements** — Print milestones

---

## Technical Details

### Geometry Export

Structures are exported as Three.js BufferGeometry:
- **Primitive types** — Tetrahedron, Octahedron, Icosahedron, Strut, Hub
- **Position/rotation** — Preserved from game
- **Scale** — Applied correctly
- **Merging** — All primitives merged into single geometry

### Slicing Algorithm

- **Plane intersection** — Triangle mesh slicing
- **Contour extraction** — Perimeter generation
- **Infill patterns** — Grid, honeycomb, lines, triangles
- **Support generation** — Automatic overhang detection

### G-code Generation

Standard G-code format:
- **Temperature control** — M104, M140, M109, M190
- **Movement** — G1, G28
- **Extrusion** — E values calculated
- **Comments** — P31 branding in header

---

## Safety Features

### Print Validation

- **Size checks** — Ensures structure fits printer bed
- **Stability checks** — Warns if structure might fail
- **Material estimates** — Shows material usage before printing

### Error Handling

- **Connection errors** — Automatic retry
- **Slicing errors** — Fallback to simpler settings
- **Print errors** — Job cancellation and recovery

---

## Future Enhancements

- **Live preview** — See sliced layers before printing
- **Multi-material** — Support for dual-extruder printers
- **Color printing** — Map game colors to filament colors
- **Post-processing** — Automatic support removal
- **Print history** — Track all prints
- **Design library** — Save and share designs

---

## Related Documentation

- [Game Engine](game-engine.md) — Complete game engine documentation
- [Vibe Coding Manager](../SUPER-CENTAUR/src/engine/maker/VibeCodingManager.ts) — Code execution system
- [Slicing Engine](../SUPER-CENTAUR/src/engine/maker/SlicingEngine.ts) — 3D model slicing
- [Printer Integration](../SUPER-CENTAUR/src/engine/maker/PrinterIntegration.ts) — Printer communication

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

*Code → Build → Slice → Print. All inside the game. The mesh holds.*
