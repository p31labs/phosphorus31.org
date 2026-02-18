# P31 Developer Onboarding Guide

Complete guide for new developers joining the P31 ecosystem.

## Welcome to P31

**Phosphorus-31. The biological qubit. The atom in the bone.**

P31 is a self-sovereign ecosystem built on tetrahedron topology and quantum coherence principles. This guide will help you get started as a developer.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Docker** (for local services)
- **ESP-IDF** (if working on Node One hardware)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd p31
```

### 2. Open Workspace

```bash
code P31.code-workspace
```

### 3. Install Dependencies

```bash
# Root dependencies
npm install

# The Centaur (backend)
cd SUPER-CENTAUR
npm install

# The Scope (frontend)
cd ../ui
npm install

# The Buffer (P31 Shelter)
cd ../apps/shelter
npm install
```

### 4. Configure Environment

See [Environment Variables Reference](../config/env-reference.md) for all required variables.

```bash
# The Centaur
cd SUPER-CENTAUR
cp .env.example .env
# Edit .env with your configuration

# The Buffer (P31 Shelter)
cd ../apps/shelter
cp .env.example .env
# Edit .env with your configuration
```

### 5. Start Development Servers

```bash
# Terminal 1 - The Centaur
cd SUPER-CENTAUR
npm run dev

# Terminal 2 - The Scope
cd ui
npm run dev

# Terminal 3 - The Buffer (if needed)
cd apps/shelter
npm run start:server
```

## Understanding P31 Architecture

### Core Components

1. **Node One** - Hardware device (ESP32-S3)
2. **The Buffer** - Communication processing
3. **The Centaur** - Backend AI protocol
4. **The Scope** - Dashboard/visualization

### Naming Conventions

P31 uses specific naming conventions. See [P31 Naming Architecture](../P31_naming_architecture.md) for details.

**Key Names:**
- Node One (hardware)
- The Buffer (communication)
- The Centaur (backend)
- The Scope (UI)
- Ping (object permanence)
- Attractor (calibration)
- Whale Channel (LoRa mesh)
- The Thick Click (haptics)
- Abdicate (governance)

**Deprecated Names (Do Not Use):**
- Phenix Navigator → Node One
- Cognitive Shield → The Buffer
- Vertex One → Node One
- Wonky Sprout → DEAD

## Development Workflow

### 1. Code Style

- **TypeScript** for all new code
- **ESLint** and **Prettier** for formatting
- Follow existing patterns
- Use P31 component names in documentation

### 2. Configuration

- Always use `GOD_CONFIG` from `god.config.ts`
- Never hardcode values
- Document all configuration changes

### 3. Testing

```bash
# Run tests
npm test

# Run tests for specific component
cd SUPER-CENTAUR && npm test
```

### 4. Documentation

- Update documentation when adding features
- Use P31 component names
- Follow existing documentation structure
- Add examples and usage patterns

## Project Structure

```
p31/
├── SUPER-CENTAUR/      # The Centaur (backend)
├── ui/                  # The Scope (frontend)
├── apps/shelter/        # The Buffer (P31 Shelter)
├── firmware/            # Node One
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── config/              # Configuration
```

## Key Concepts

### Tetrahedron Topology

P31 enforces strict tetrahedron topology:
- **4 Vertices**: Operator, Synthetic Body, Node 1, Node 2
- **6 Edges**: Communication channels
- **4 Faces**: System boundaries

### Privacy First

- Type-level encryption (EncryptedBlob)
- Zero-knowledge proofs where possible
- Local-first by default
- Encrypted cloud sync

### Performance

- Optimize for 0.350 kbps (Whale Song bandwidth)
- Use Protocol Buffers over JSON
- Batch messages
- Defensive architecture

### Abdication Principle

- No backdoors
- Code for departure
- Admin keys can be destroyed
- Constitutional compliance

## Common Tasks

### Adding a New Feature

1. Create feature branch
2. Implement feature following P31 principles
3. Add tests
4. Update documentation
5. Submit pull request

### Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check logs
tail -f SUPER-CENTAUR/logs/*.log
```

### Building

```bash
# The Centaur
cd SUPER-CENTAUR
npm run build

# The Scope
cd ui
npm run build
```

## Resources

### Documentation

- [Setup Guide](setup.md)
- [Architecture](architecture.md)
- [Development Guide](development.md)
- [API Documentation](api/index.md)
- [Quick Reference](quick-reference.md)

### Component Docs

- [Node One](node-one.md)
- [The Buffer](buffer.md)
- [The Centaur](centaur.md)
- [The Scope](scope.md)

### Configuration

- [Environment Variables](../config/env-reference.md)
- [GOD_CONFIG](god-config.md)
- [Naming Reference](naming.md)

## Getting Help

### Documentation

Check the documentation first:
- [Documentation Index](index.md)
- [Troubleshooting](troubleshooting.md)

### Code Review

- Follow existing patterns
- Use P31 naming conventions
- Maintain constitutional compliance
- Test thoroughly

## Next Steps

1. Read [Architecture](architecture.md) to understand the system
2. Review [Development Guide](development.md) for workflow
3. Explore component documentation
4. Check [Quick Reference](quick-reference.md) for common commands
5. Start with small contributions

## Welcome!

You're now ready to contribute to P31. Remember:

- **The Mesh Holds** 🔺
- Use P31 names consistently
- Follow the G.O.D. Protocol
- Code for departure
- Privacy first

Happy coding!
