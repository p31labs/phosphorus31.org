# P31 Molecule Builder

**Interactive 3D molecule builder with quantum coherence visualization**

## Overview

The P31 Molecule Builder is an interactive 3D tool for visualizing and building molecules, with special focus on **Posner molecules** (Ca9(PO4)6) containing **Phosphorus-31** - the biological qubit.

## Features

### Core Features
- **3D Visualization** - Interactive Three.js rendering
- **Posner Molecule Generation** - Automatic generation of Ca9(PO4)6 structures
- **Quantum Coherence Visualization** - See P31 quantum states
- **Atom Selection** - Click atoms to view details
- **Bond Visualization** - See chemical bonds between atoms
- **Accessibility Support** - Respects reduced motion and font size preferences

### Quantum Features
- **P31 Highlighting** - Phosphorus-31 atoms pulse with quantum coherence
- **Coherence Rings** - Visual rings show quantum coherence levels
- **Entanglement Visualization** - See entangled atom pairs
- **Phase Visualization** - Quantum phase angles

## Usage

### Opening the Builder

1. Click **"🧬 Molecule"** button in The Scope
2. The molecule builder opens in full-screen mode
3. A default Posner molecule is automatically generated

### Controls

- **Orbit Controls** - Click and drag to rotate
- **Zoom** - Scroll to zoom in/out
- **Pan** - Right-click and drag (or middle mouse)
- **Atom Selection** - Click any atom to see details
- **Toggle Quantum** - Checkbox to show/hide quantum properties
- **Toggle Labels** - Checkbox to show/hide element labels

### Creating Molecules

- **New Posner Molecule** - Click "🧬 New Posner Molecule" to generate a fresh structure
- **Atom Details** - Click any atom to see:
  - Element symbol
  - Charge
  - Quantum coherence (for P31)
  - Nuclear spin (for P31)

## Posner Molecules

**Ca9(PO4)6** - The structure that carries quantum coherence in bone.

### Structure
- **9 Calcium atoms** - Arranged in icosahedral geometry
- **6 Phosphate groups** - Each PO4 contains:
  - 1 Phosphorus atom (P31 - the biological qubit)
  - 4 Oxygen atoms
- **Icosahedral geometry** - 12 vertices, 30 edges, 20 faces

### Quantum Properties
- **P31 Nuclear Spin** - 1/2 (the qubit)
- **Coherence Lifetime** - ~100 seconds in bone
- **Entanglement** - Can entangle with other Posner molecules
- **Phase** - Quantum phase angle for superposition

## Technical Details

### Components

- **MoleculeBuilder** - Main component
- **Atom3D** - Individual atom rendering
- **Bond3D** - Chemical bond rendering
- **useMoleculeBuilder** - State management hook

### Data Structures

```typescript
interface PosnerMolecule {
  id: string;
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  quantumState: {
    coherence: number;
    entanglement: string[];
    phase: number;
    lifetime: number;
  };
}
```

### Element Properties

- **P31** - Orange-red, radius 1.0, quantum properties
- **Ca** - Green, radius 1.0
- **O** - Red, radius 0.6
- **P** - Orange, radius 1.0

## Accessibility

The molecule builder respects accessibility settings:
- **Reduced Motion** - Slower animations, less pulsing
- **Font Size** - Controls scale with text size
- **High Contrast** - Enhanced visibility
- **Keyboard Navigation** - Full keyboard support

## Future Enhancements

- [ ] Custom molecule building (add/remove atoms)
- [ ] Bond editing
- [ ] Save/load molecules
- [ ] Quantum simulation
- [ ] Entanglement visualization
- [ ] Coherence decay animation
- [ ] Export to file formats
- [ ] VR/AR support

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
