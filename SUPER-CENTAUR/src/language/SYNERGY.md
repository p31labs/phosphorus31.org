# P31 Language Synergy

**"Synergize x infinity"**

The complete integration of System Definition Language and Runtime Execution Language.

💜 With love and light. As above, so below. 💜

## Overview

P31 Language has two complementary implementations:

1. **System Definition Language** (`src/language/`) - Architecture and configuration
2. **Runtime Execution Language** (`src/engine/language/`) - Code execution and interaction

The **P31LanguageBridge** synergizes them into a unified system.

## The Bridge

The bridge connects:

- **System → Runtime**: System definitions become available as runtime variables, structures, and functions
- **Runtime → System**: Runtime code can query and interact with system definitions
- **Validation**: Ensures system constraints (4 vertices, encryption, etc.) are maintained
- **Auto-Detection**: Automatically detects system vs runtime code

## Usage

### Basic Synergy

```typescript
import { P31LanguageBridge } from './language';

const bridge = new P31LanguageBridge();

// Load system definition
const system = bridge.loadSystem(`
  system p31 {
    topology: tetrahedron
    vertices: [operator, synthetic_body, node_one, node_two]
  }
  
  component buffer {
    type: buffer
    location: local
    encryption: required
  }
`);

// Execute runtime code with system context
const result = await bridge.executeRuntime(`
  let tetra = tetrahedron {};
  build tetra;
  print tetra;
`);
```

### Full Synergy

```typescript
// Load system and execute runtime in one call
const result = await bridge.synergize(
  // System definition
  `
    system p31 {
      topology: tetrahedron
      vertices: [operator, synthetic_body, node_one, node_two]
    }
    
    component buffer {
      type: buffer
      location: local
      encryption: required
    }
  `,
  // Runtime code
  `
    // System components are available as structures
    let myBuffer = buffer;
    build myBuffer;
    
    // System vertices are available as variables
    let op = operator;
    let sb = synthetic_body;
    
    // Build tetrahedron with system context
    let tetra = tetrahedron {
      vertex: [op, sb, node_one, node_two]
    };
    build tetra;
    print tetra;
  `
);
```

### Auto-Detection

```typescript
// Bridge auto-detects system vs runtime
const result1 = await bridge.execute(`
  system p31 {
    topology: tetrahedron
  }
`, 'auto'); // Detected as 'system'

const result2 = await bridge.execute(`
  let tetra = tetrahedron {};
  build tetra;
`, 'auto'); // Detected as 'runtime'
```

## System Context Injection

When system definitions are loaded, they become available in runtime execution:

### Vertices as Variables

```p31
// System definition
vertex operator {
  role: operator
  capabilities: [sign, authorize]
}

// Runtime code (vertices available)
let op = operator;
console.log(op.role); // "operator"
console.log(op.capabilities); // ["sign", "authorize"]
```

### Components as Structures

```p31
// System definition
component buffer {
  type: buffer
  location: local
}

// Runtime code (components available)
let myBuffer = buffer;
build myBuffer;
```

### Protocols as Functions

```p31
// System definition
protocol whale_channel {
  type: whale_channel
  frequency: 915_mhz
}

// Runtime code (protocols available)
whale_channel.send("ping");
```

## Validation

The bridge validates system constraints:

- **Tetrahedron Constraint**: Exactly 4 vertices
- **Encryption**: All components must have encryption
- **Topology**: Must use tetrahedron topology

```typescript
const isValid = bridge.getContext().bridge.validate();
if (!isValid) {
  console.error('System validation failed');
}
```

## Game Engine Integration

```typescript
// In GameEngine
const engine = new GameEngine();
await engine.init();

// Execute with full synergy
const result = await engine.executeP31Code(
  // Runtime code
  `
    let tetra = tetrahedron {};
    build tetra;
    print tetra;
  `,
  // Optional: System definition
  `
    system p31 {
      topology: tetrahedron
      vertices: [operator, synthetic_body, node_one, node_two]
    }
  `
);
```

## Context Inspection

```typescript
const bridge = new P31LanguageBridge();

// Get system runtime
const systemRuntime = bridge.getSystemRuntime();
console.log('Vertices:', systemRuntime?.vertices);
console.log('Components:', systemRuntime?.components);

// Get execution context
const execContext = bridge.getExecutionContext();
console.log('Variables:', execContext.variables);
console.log('Structures:', execContext.structures);
```

## The Mesh Holds 🔺

**Synergy x infinity: Architecture and execution unified.**

💜 **With love and light. As above, so below.** 💜
