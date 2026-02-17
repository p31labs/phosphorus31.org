# Vibe Coding & 3D Printing

**Vibe coding inside the game environment with internal slicing and push straight to printer**

## Overview

The P31 ecosystem includes a complete maker workflow:
1. **Vibe Coding** - Code inside the game environment with live execution
2. **3D Slicing** - Slice 3D models for 3D printing
3. **Printer Integration** - Push sliced models directly to printer

## Vibe Coding 💻

### Features

- **In-Game Coding** - Write and execute code within the game environment
- **Multiple Languages** - JavaScript, TypeScript, Python, GLSL, HLSL
- **Live Preview** - See results in real-time
- **Code Projects** - Organize code into projects
- **Execution History** - Track code executions
- **Game Engine Access** - Access game engine APIs from code

### Usage

```typescript
const engine = new GameEngine();
await engine.init();

const vibeCoding = engine.getVibeCoding();

// Create new project
const project = vibeCoding.createProject('My Script', 'javascript');

// Update code
vibeCoding.updateProject(project.id, `
  function createStructure() {
    const game = engine.getGameEngine();
    game.createNewStructure('Vibe Built');
    console.log('💜 Structure created with vibe coding!');
  }
  createStructure();
`);

// Execute code
const execution = await vibeCoding.executeCode(project.id);
console.log('Result:', execution.result);
```

### Supported Languages

- **JavaScript/TypeScript** - Full game engine access
- **Python** - (Coming soon via Pyodide)
- **GLSL** - Shader programming
- **HLSL** - DirectX shader programming

### Code Templates

Each language has a default template to get started:

```javascript
// JavaScript template
function vibe() {
  console.log('💜 Vibe coding with love and light');
  return 'The Mesh Holds';
}
```

## 3D Slicing 🔪

### Features

- **Model Slicing** - Slice 3D geometries into printable layers
- **Configurable Settings** - Layer height, infill, support, etc.
- **Multiple Infill Patterns** - Grid, honeycomb, lines, triangles
- **Support Generation** - Automatic support structure generation
- **G-code Export** - Export to standard G-code format
- **Time & Material Estimates** - Calculate print time and material usage

### Usage

```typescript
const engine = new GameEngine();
await engine.init();

const slicing = engine.getSlicingEngine();

// Get current structure geometry
const structure = engine.getCurrentStructure();
const geometry = structure.getGeometry(); // THREE.BufferGeometry

// Slice with custom settings
const sliced = await slicing.sliceModel(geometry, {
  layerHeight: 0.2,
  infillDensity: 0.2,
  infillPattern: 'honeycomb',
  supportEnabled: true,
  printSpeed: 50,
  temperature: 210
});

console.log(`Sliced: ${sliced.layers.length} layers`);
console.log(`Estimated time: ${sliced.estimatedTime.toFixed(1)} minutes`);
console.log(`Estimated material: ${sliced.estimatedMaterial.toFixed(1)}g`);

// Export to G-code
const gcode = slicing.exportToGCode(sliced);
```

### Slice Configuration

```typescript
{
  layerHeight: 0.2,        // mm
  infillDensity: 0.2,       // 0-1
  infillPattern: 'grid',    // 'grid' | 'honeycomb' | 'lines' | 'triangles'
  supportEnabled: false,
  supportAngle: 45,         // degrees
  supportDensity: 0.15,     // 0-1
  perimeterCount: 2,
  topLayers: 4,
  bottomLayers: 4,
  printSpeed: 50,           // mm/s
  travelSpeed: 150,         // mm/s
  temperature: 210,          // Celsius
  bedTemperature: 60        // Celsius
}
```

## Printer Integration 🖨️

### Features

- **Multiple Printer Types** - USB, Network, OctoPrint, Klipper, Marlin
- **Auto-Discovery** - Scan for available printers
- **Direct Printing** - Push G-code directly to printer
- **Job Management** - Queue and monitor print jobs
- **Progress Tracking** - Real-time print progress
- **Web Serial API** - Browser-based USB printer support

### Usage

```typescript
const engine = new GameEngine();
await engine.init();

const printer = engine.getPrinterIntegration();

// Scan for printers
const printers = await printer.scanPrinters();
console.log(`Found ${printers.length} printers`);

// Connect to printer
await printer.connect(printers[0].id);

// Slice model
const slicing = engine.getSlicingEngine();
const sliced = await slicing.sliceModel(geometry);
const gcode = slicing.exportToGCode(sliced);

// Print directly
const job = await printer.printGCode(gcode);
console.log(`Print job started: ${job.id}`);

// Monitor progress
const interval = setInterval(() => {
  const updatedJob = printer.getPrintJobs().find(j => j.id === job.id);
  if (updatedJob) {
    console.log(`Progress: ${(updatedJob.progress * 100).toFixed(1)}%`);
    if (updatedJob.status === 'completed') {
      clearInterval(interval);
      console.log('Print completed!');
    }
  }
}, 1000);
```

### Printer Types

- **USB** - Direct USB connection via Web Serial API
- **Network** - Network-connected printers
- **OctoPrint** - OctoPrint server integration
- **Klipper** - Klipper firmware support
- **Marlin** - Marlin firmware support

### Print Job Status

- `queued` - Job is queued
- `printing` - Currently printing
- `completed` - Print completed successfully
- `failed` - Print failed
- `cancelled` - Print was cancelled

## Complete Workflow

### 1. Code in Game

```typescript
// Create structure via code
const project = vibeCoding.createProject('Auto Builder', 'javascript');
vibeCoding.updateProject(project.id, `
  const game = engine.getGameEngine();
  for (let i = 0; i < 10; i++) {
    game.placePiece('tetrahedron', [i * 2, 0, 0]);
  }
`);
await vibeCoding.executeCode(project.id);
```

### 2. Slice Model

```typescript
const structure = engine.getCurrentStructure();
const geometry = structure.getGeometry();
const sliced = await slicing.sliceModel(geometry, {
  layerHeight: 0.15,
  infillDensity: 0.3
});
```

### 3. Print Directly

```typescript
const gcode = slicing.exportToGCode(sliced);
await printer.connect('printer_1');
await printer.printGCode(gcode);
```

## Integration with Tools for Life

All features are accessible via Tools for Life:

- **Vibe Coding** - `tools:maker:vibeCoding` event
- **3D Slicing** - `tools:maker:3dSlicing` event
- **Printer Integration** - `tools:maker:printerIntegration` event

## Events

```typescript
// Vibe coding events
window.addEventListener('vibecoding:codeUpdated', (e) => {
  // Code was updated, update preview
});

window.addEventListener('vibecoding:executed', (e) => {
  // Code execution completed
  console.log('Execution:', e.detail);
});

window.addEventListener('vibecoding:console', (e) => {
  // Console output from code
  console.log('Console:', e.detail.type, e.detail.args);
});
```

## Files Created

- `SUPER-CENTAUR/src/engine/maker/VibeCodingManager.ts`
- `SUPER-CENTAUR/src/engine/maker/SlicingEngine.ts`
- `SUPER-CENTAUR/src/engine/maker/PrinterIntegration.ts`
- `docs/vibe-coding-and-printing.md`

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

**Ready to build together. 💜**
