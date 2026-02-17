# P31 Language

**"Oh the places we will go"**

Domain-specific language for the P31 ecosystem. With love and light. As above, so below. 💜

## Overview

P31 Language is a custom programming language designed specifically for the P31 ecosystem. It integrates with tetrahedron topology, quantum coherence, cosmic timing, building, and printing.

## Features

### Core Syntax

- **Variables** - `let` and `const` declarations
- **Functions** - User-defined functions
- **Control Flow** - `if/else`, `for`, `while`
- **Expressions** - Arithmetic, logical, comparison operators
- **Built-ins** - P31-specific functions and objects

### P31-Specific Keywords

- `build` - Build structures in the game
- `print` - Print to 3D printer
- `quantum` - Quantum coherence operations
- `tetrahedron` - Create tetrahedron structures
- `cosmic` - Cosmic timing operations
- `mesh` - The Mesh Holds

## Syntax Examples

### Variables

```p31
let tetra = tetrahedron {};
const love = "💜";
let coherence = 0.95;
```

### Functions

```p31
function createStructure() {
  let structure = tetrahedron {};
  build structure;
  return structure;
}
```

### Control Flow

```p31
// If statement
if (cosmic.timing("build").favorable) {
  build tetra;
} else {
  quantum coherence(0.5);
}

// For loop
for (let i = 0; i < 4; i = i + 1) {
  build tetrahedron {};
}

// While loop
while (coherence > 0.5) {
  quantum coherence(coherence - 0.1);
}
```

### Building

```p31
// Create and build tetrahedron
let tetra = tetrahedron {
  vertex: 4
};
build tetra;
```

### Printing

```p31
// Print structure
let structure = tetrahedron {};
build structure;
print structure;
```

### Quantum Operations

```p31
// Set quantum coherence
quantum coherence(0.95);

// Check coherence
if (quantum.coherence > 0.9) {
  build tetra;
}
```

### Cosmic Timing

```p31
// Check cosmic timing
let timing = cosmic timing("build");
if (timing.favorable) {
  build tetra;
}
```

### The Mesh Holds

```p31
// The Mesh Holds
mesh.holds();
```

## Built-in Objects

### `mesh`

```p31
mesh.holds(); // Returns true, side effect: "The Mesh Holds. 🔺"
```

### `tetrahedron`

```p31
tetrahedron.vertices; // 4
tetrahedron.edges;   // 6
tetrahedron.faces;   // 4
```

### `love` and `light`

```p31
love;  // "💜"
light; // "✨"
```

## Integration

P31 Language integrates with:

- **Game Engine** - Build structures, access game state
- **Family Coding** - Collaborative coding sessions
- **Cosmic Timing** - Astrological timing for actions
- **Quantum Coherence** - Quantum operations
- **3D Printing** - Direct printer integration
- **Vibe Coding** - In-game coding environment

## Usage

### In Game Engine

```typescript
const engine = new GameEngine();
await engine.init();

// Execute P31 code
const result = engine.executeP31Code(`
  let tetra = tetrahedron {};
  build tetra;
  print tetra;
`);

console.log(result.value);
console.log(result.sideEffects);
```

### In UI

The P31 Language Editor provides:

- Syntax highlighting (coming soon)
- Code execution
- Output display
- Error handling
- Example code

## Language Grammar

```
program     → statement* EOF
statement   → build | print | quantum | tetrahedron | cosmic
            | variable | function | if | for | while | return
            | expression
expression  → assignment
assignment  → identifier "=" assignment | or
or         → and ( "||" and )*
and        → equality ( "&&" equality )*
equality    → comparison ( ( "==" | "!=" ) comparison )*
comparison  → term ( ( ">" | ">=" | "<" | "<=" ) term )*
term        → factor ( ( "-" | "+" ) factor )*
factor      → unary ( ( "/" | "*" ) unary )*
unary       → ( "!" | "-" ) unary | call
call        → primary ( "(" arguments? ")" | "." identifier )*
primary     → NUMBER | STRING | IDENTIFIER | "(" expression ")"
```

## Examples

### Complete Example

```p31
// P31 Language - "Oh the places we will go"
// With love and light. As above, so below. 💜

// Build a tetrahedron
let tetra = tetrahedron {
  vertex: 4
};

// Check cosmic timing
let timing = cosmic timing("build");

// Build if favorable
if (timing.favorable) {
  build tetra;
  
  // Set quantum coherence
  quantum coherence(0.95);
  
  // The Mesh Holds
  mesh.holds();
  
  // Print it
  print tetra;
}

// Function to create structure
function createStructure() {
  let structure = tetrahedron {};
  build structure;
  return structure;
}

// Loop to build multiple
for (let i = 0; i < 4; i = i + 1) {
  let tetra = tetrahedron {};
  build tetra;
}
```

## Error Handling

P31 Language provides:

- **Parse Errors** - Syntax errors during parsing
- **Execution Errors** - Runtime errors during execution
- **Type Errors** - Type mismatches (coming soon)
- **Scope Errors** - Undefined variables/functions

## Future Features

- Type system
- Modules and imports
- Pattern matching
- Async/await
- Generators
- More built-in functions
- Standard library

## Files Created

- `SUPER-CENTAUR/src/engine/language/P31LanguageParser.ts`
- `SUPER-CENTAUR/src/engine/language/P31LanguageExecutor.ts`
- `SUPER-CENTAUR/src/engine/language/index.ts`
- `ui/src/components/P31Language/P31LanguageEditor.tsx`
- `docs/p31-language.md`

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

**"Oh the places we will go"** 💜
