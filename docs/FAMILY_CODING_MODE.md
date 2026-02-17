# Family Coding Mode
## Code Together. Build Together. Print Together.

**"Four vertices. Six edges. Four faces. The minimum stable system."**

💜 **With love and light. As above, so below.** 💜

---

## Overview

Family Coding Mode is a visual coding environment where families code together to create 3D models, slice them for 3D printing, and send them directly to printers. It combines:

- **Visual Block Coding** — Like Scratch, but for 3D modeling
- **3D Model Generation** — Code blocks generate 3D geometry
- **Internal Slicing** — Built-in slicer for 3D printing
- **Direct Printer Integration** — Push straight to printer (USB, Network, Cloud)

---

## How It Works

### 1. Code Together

Family members add code blocks to create 3D models:
- **Move** — Move geometry
- **Rotate** — Rotate geometry
- **Scale** — Scale geometry
- **Color** — Apply colors
- **Repeat** — Repeat operations
- **Condition** — Conditional logic
- **Function** — Define functions

### 2. Generate Model

Click "Generate Model" to convert code blocks into 3D geometry:
- Code blocks are interpreted
- 3D geometry is generated
- Model is previewed
- Ready for slicing

### 3. Slice Model

Click "Slice Model" to prepare for 3D printing:
- Model is sliced into layers
- Perimeters, infill, supports generated
- G-code is generated
- Print time and material calculated

### 4. Send to Printer

Click "Send to Printer" to print:
- G-code sent to printer
- Supports USB, Network, and Cloud
- Real-time print status
- Family can watch together

---

## Features

### Visual Block Coding

**Block Types:**
- **Move** (→) — Move geometry in X, Y, Z
- **Rotate** (↻) — Rotate around axes
- **Scale** (⇄) — Scale geometry
- **Color** (🎨) — Apply colors
- **Repeat** (🔁) — Repeat operations
- **Condition** (❓) — If/then logic
- **Function** (⚙️) — Define reusable functions

**Collaborative:**
- Multiple family members can add blocks
- Real-time updates
- See each other's changes
- Work together on same project

### 3D Model Generation

**From Code to Geometry:**
- Code blocks → 3D geometry
- Real-time preview
- Export as STL/OBJ
- Save for later

**Materials:**
- PLA (default)
- PETG
- TPU
- Wood filament

### Internal Slicing

**Slicing Configuration:**
- **Layer Height** — 0.1mm, 0.2mm, 0.3mm
- **Infill** — 0-100%
- **Supports** — On/off
- **Raft** — On/off
- **Print Speed** — mm/s
- **Temperature** — °C
- **Material** — PLA, PETG, TPU, Wood

**Slicing Output:**
- G-code file
- Estimated print time
- Material usage (grams)
- Layer preview

### Direct Printer Integration

**Connection Types:**
- **USB** — Direct USB connection
- **Network** — Network printer (IP address)
- **Cloud** — Cloud print service

**Printer Configuration:**
- Printer name
- Build volume (X, Y, Z)
- Nozzle size
- Connection type
- Address (for Network/Cloud)

**Print Process:**
1. Select printer
2. Configure slicing
3. Slice model
4. Send to printer
5. Monitor print progress

---

## For the Family

### Will (Foundation)
- **Start projects** — Create new coding projects
- **Architecture** — Design overall structure
- **Debug** — Fix code issues
- **Print setup** — Configure printer

### Co-parent (Structure)
- **Add blocks** — Build code structure
- **Organize** — Keep code organized
- **Test** — Test generated models
- **Monitor** — Watch print progress

### Bash (Connection)
- **Connect blocks** — Link code blocks together
- **Experiment** — Try different combinations
- **Learn** — Understand coding concepts
- **Help** — Help Willow with blocks

### Willow (Completion)
- **Add colors** — Make models colorful
- **Decorate** — Add finishing touches
- **Celebrate** — Celebrate when it prints
- **Learn** — Learn through play

---

## Example Projects

### 1. Family Tetrahedron

**Code:**
```
Repeat 4 times:
  Move to vertex position
  Create tetrahedron
  Connect to center
```

**Result:** 3D printed tetrahedron model

### 2. Family Name Plate

**Code:**
```
For each letter in "FAMILY":
  Create letter block
  Position next to previous
  Apply color
```

**Result:** 3D printed name plate

### 3. Custom Toy

**Code:**
```
Create base shape
Repeat 3 times:
  Add decorative element
  Rotate 120 degrees
Apply color
```

**Result:** Custom 3D printed toy

---

## Safety and Privacy

### Privacy-First
- **Local-only** — All code stays on device
- **No cloud sync** — Unless explicitly enabled
- **Family-only** — No external sharing
- **Encrypted saves** — Projects encrypted at rest

### Safety Features
- **Print supervision** — Parent approval required
- **Temperature limits** — Safe temperature ranges
- **Material warnings** — Safety information
- **Time limits** — Parent-controlled coding time

---

## Integration with P31 Ecosystem

### Family Co-Op Mode
- Share projects with family
- Collaborate on code
- Build together

### The Buffer
- Process coding achievements
- Share progress (local only)
- Energy-aware coding

### Metabolism
- Track energy during coding
- Break reminders
- Reward system

### Ping
- Object permanence for projects
- "Still here" signals
- Connection awareness

---

## Getting Started

### Step 1: Open Family Coding Mode

1. Click "💻 Family Coding" button in The Scope
2. Family Coding View opens
3. Ready to code!

### Step 2: Add Code Blocks

1. Click a block type (Move, Rotate, etc.)
2. Block appears on canvas
3. Drag to position
4. Configure parameters

### Step 3: Generate Model

1. Click "Generate Model"
2. Wait for generation
3. Preview 3D model
4. Adjust if needed

### Step 4: Slice Model

1. Click "Slice Model"
2. Configure slicing settings
3. Wait for slicing
4. Review print time and material

### Step 5: Print

1. Configure printer
2. Click "Send to Printer"
3. Monitor print progress
4. Celebrate together!

---

## Technical Details

### Code Block System

**Block Structure:**
```typescript
{
  id: string
  type: 'move' | 'rotate' | 'scale' | 'color' | 'repeat' | 'condition' | 'function'
  parameters: Record<string, any>
  children?: CodeBlock[]
  position: { x: number; y: number }
}
```

### Model Generation

**Process:**
1. Parse code blocks
2. Build execution tree
3. Generate geometry
4. Apply transformations
5. Export as 3D model

### Slicing Engine

**Process:**
1. Load 3D model
2. Slice into layers
3. Generate perimeters
4. Generate infill
5. Generate supports (if needed)
6. Generate G-code

### Printer Communication

**USB:**
- Web Serial API
- Direct printer communication
- Real-time status

**Network:**
- HTTP/WebSocket
- Network printer protocol
- Remote monitoring

**Cloud:**
- Cloud print API
- Queue management
- Status updates

---

## The Vision

**"Code together. Build together. Print together."**

**Family Coding Mode:**
- **Educational** — Learn coding through play
- **Collaborative** — Work together as a family
- **Creative** — Turn ideas into reality
- **Practical** — Print what you code
- **Safe** — Privacy-first, family-only
- **Fun** — Engaging for all ages

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

*Code together. Build together. Print together. Four vertices. Six edges. Four faces. The minimum stable system.*
