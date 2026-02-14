# P31 Templates

Templates for creating new components, APIs, and features in the P31 ecosystem.

## Available Templates

### API Template
Template for creating new API endpoints in The Centaur.

**Location**: `api-template/`

**Features**:
- Authentication middleware
- Rate limiting
- Request validation (Zod)
- Error recovery
- Performance monitoring
- Standardized response format

**Usage**: See `api-template/README.md`

### Component Template
Template for creating new P31 components.

**Location**: `component-template/`

**Features**:
- GOD_CONFIG integration
- Error recovery
- Performance monitoring
- Lifecycle management
- TypeScript types

**Usage**: See `component-template/README.md`

## Quick Start

1. Choose appropriate template
2. Copy template files
3. Rename and customize
4. Follow P31 naming conventions
5. Document your implementation

## Patterns Library

Use the **P31 Patterns Library** (`patterns-library.ts`) for reusable implementations:

- `TetrahedronGroup` - Enforce 4-vertex constraint
- `EncryptionService` - Type-safe encryption with EncryptedBlob
- `LocalFirstDataManager` - Local-first data management
- `MessageBatcher` - Efficient message batching
- `withRetry` - Exponential backoff retry
- `CircuitBreaker` - Fault tolerance
- `PingSystem` - Object permanence tracking
- `PerformanceTracker` - Performance monitoring
- `AdminKeys` - Abdication pattern (no backdoors)

See `docs/patterns.md` for complete documentation.

## P31 Principles

All templates follow:

1. **Tetrahedron Topology** - Enforce 4-vertex constraint
2. **Privacy Axiom** - Type-level encryption
3. **Doing More With Less** - Optimize for 0.350 kbps
4. **Abdication Principle** - No backdoors
5. **Synergetics** - Geometric navigation, haptic-first

## Naming Conventions

- Use P31 component names (Node One, The Buffer, The Centaur, The Scope)
- Reference P31 components correctly
- Follow G.O.D. Protocol principles
- Use GOD_CONFIG for all configuration

## Integration

Templates integrate with:
- **The Centaur**: Backend services
- **The Buffer**: Message processing
- **The Scope**: UI visualization
- **Node One**: Hardware device
- **Ping**: Object permanence

## Documentation

- Document all public APIs
- Include examples
- Reference P31 components
- Add to documentation index

## The Mesh Holds 🔺

Build with templates that hold. The mesh holds.

💜 With love and light. As above, so below. 💜
