# Vibe Coding - Quick Start Guide

**Code inside the game environment. Slice internally. Push straight to printer.**

## 🚀 Quick Start

### 1. Open Game Environment
- Click "Show Game" button in The Scope
- Game engine initializes

### 2. Open Vibe Coding
- Click "💻 Vibe Coding" button (only visible when game is active)
- VibeCodingPanel opens full-screen

### 3. Create Project
- Click "+ New Project"
- Enter project name
- Start coding!

## 💻 Code Examples

### Create 3D Cube
```javascript
// Create a cube geometry
const geometry = new THREE.BoxGeometry(10, 10, 10);

// Return for slicing
return { geometry: geometry };
```

### Create Custom Shape
```javascript
// Create custom geometry
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(10, 0);
shape.lineTo(10, 10);
shape.lineTo(0, 10);
shape.lineTo(0, 0);

const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 5,
  bevelEnabled: true
});

return { geometry: geometry };
```

### Direct Slice & Print
```javascript
// Create geometry
const geometry = new THREE.BoxGeometry(20, 20, 20);

// Slice it
const sliced = await slice(geometry, {
  layerHeight: 0.2,
  infillDensity: 0.2
});

// Export to G-code
const gcode = slicingEngine.exportToGCode(sliced);

// Print it
const job = await print(gcode);

return { geometry, sliced, job };
```

## 🔪 Internal Slicing

**Automatic:**
- Code returns geometry → Auto-slices
- Shows layer count, time, material
- Ready for printing

**Manual:**
- Click "🔪 Slice & Print" button
- Customize slicing config
- Preview before printing

## 🖨️ Push to Printer

**Workflow:**
1. Code executes → Returns geometry
2. Auto-slices → G-code generated
3. Click "🖨️ Push to Printer"
4. G-code sent → Printer starts

**Printer Setup:**
- Click "🔍 Scan" to find printers
- Connect via USB (Web Serial API)
- Or connect to network printer (OctoPrint/Klipper)

## 🎯 Complete Workflow

```
Code → Execute → Geometry → Slice → G-code → Print
  ↓       ↓         ↓         ↓        ↓        ↓
Editor  Runtime  3D Model  Layers  Commands  Printer
```

## 💜 The Mesh Holds

**Vibe coding. Internal slicing. Direct printer output. All inside the game environment.**

💜 **With love and light. As above, so below.** 💜
