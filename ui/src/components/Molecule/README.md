# P31 Molecule Builder Components

**The centerpiece of P31 - The biological qubit visualized**

## Components

### MoleculeBuilderHero
The main hero interface - the centerpiece component.

**Features:**
- Beautiful gradient header with P31 title
- Real-time statistics dashboard
- Large 3D canvas with auto-rotation
- Side control panel
- Atom details panel
- Molecule information display

### Atom3D
Renders individual atoms in 3D space.

**Features:**
- Element-specific colors and sizes
- P31 quantum coherence pulsing
- Coherence rings for quantum visualization
- Quantum glow for P31 atoms
- Click interaction
- Label support

### Bond3D
Renders chemical bonds between atoms.

**Features:**
- Proper rotation alignment
- Bond order visualization (thickness)
- Selection highlighting
- Smooth rendering

### QuantumField
Ambient quantum field visualization.

**Features:**
- Large sphere showing overall coherence
- Gentle rotation animation
- Respects reduced motion

### WelcomeScreen
Optional welcome/landing screen.

**Features:**
- Beautiful introduction
- Feature highlights
- Start button

## Usage

```tsx
import { MoleculeBuilderHero } from './components/Molecule/MoleculeBuilderHero';

// In your app
<MoleculeBuilderHero />
```

## Integration

The Molecule Builder is integrated into The Scope:
- Click "🧬 P31 Molecule Builder" button
- Opens in full-screen hero mode
- Most prominent button in the UI

## Styling

Custom CSS classes:
- `.molecule-builder-centerpiece` - Centerpiece button
- `.quantum-text` - Quantum gradient text
- `.quantum-stat` - Quantum statistics card
- `.glass-panel` - Glass morphism effect

## Accessibility

All components respect:
- Reduced motion preferences
- Font size settings
- High contrast mode
- Screen reader support

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
