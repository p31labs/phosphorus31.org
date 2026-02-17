# P31 Language

**The language of the mesh. The syntax of sovereignty. The grammar of love encoded architecturally.**

## Overview

P31 Language is a domain-specific language (DSL) for describing and operating the P31 ecosystem. It provides a natural, expressive syntax for P31 concepts, operations, and relationships.

## Philosophy

- **Tetrahedron Topology** — Four vertices, six edges, minimum stable system
- **Privacy-First** — Local-first, type-level encryption, zero-knowledge
- **Sovereignty** — Self-hosted, no vendor lock-in, you control the keys

## Quick Start

### Parse P31 Code

```typescript
import { P31LanguageParser } from './language/P31LanguageParser';

const parser = new P31LanguageParser();
const ast = parser.parse(p31SourceCode);
const system = parser.validateSystem(ast);
```

### Execute P31 Code

```typescript
import { P31LanguageInterpreter } from './language/P31LanguageInterpreter';

const interpreter = new P31LanguageInterpreter();
const runtime = interpreter.execute(ast);

// Execute operations
interpreter.executeOperationByName('sign_transaction', { tx: transaction });

// Send messages
interpreter.sendMessage('ping');
```

## Syntax

See `docs/p31-language.md` for complete syntax specification.

## Examples

See `examples/p31-system.p31` for a complete P31 system declaration.

## Integration

### With Game Engine

```typescript
// In game engine
const parser = new P31LanguageParser();
const interpreter = new P31LanguageInterpreter();

// Load P31 system definition
const p31Code = await loadP31File('system.p31');
const ast = parser.parse(p31Code);
const runtime = interpreter.execute(ast);
```

### With Vibe Coding

```p31
// Vibe coding in P31 Language
vibe_code {
  language: javascript
  environment: game_engine
  execute {
    geometry = THREE.BoxGeometry(10, 10, 10)
    return { geometry: geometry }
  }
}
```

## The Mesh Holds 🔺

**P31 Language: The syntax of sovereignty. The grammar of love. The structure of stability.**

💜 **With love and light. As above, so below.** 💜
