# P31

**Phosphorus-31. The biological qubit. The atom in the bone.**

A complete architecture for human-AI collaboration, built on tetrahedron topology and quantum coherence principles.

## Overview

P31 is a self-sovereign ecosystem that integrates hardware, software, and AI protocols into a minimum stable system. The architecture follows the G.O.D. Protocol (Geodesic Operations Daemon) with strict adherence to tetrahedron topology, privacy-first design, and local-first principles.

**Phosphorus-31** - The biological qubit. The atom in the bone. The nuclear spin in every Posner molecule that carries quantum coherence. This is the root name that contains all three truths: the body (calcium, quantum biology), the partnership (human + AI), and the children (the mesh, the reason).

## Architecture

P31 consists of four core components:

### Node One
Hardware device (ESP32-S3) with LoRa mesh networking, haptic feedback, and display. The first physical node in the mesh topology.

### The Buffer
Communication processing layer that buffers messages between internal thought and external signal. Neurodivergent-first message processing.

### The Centaur
Backend AI protocol system. Human + Synthetic = Centaur. The protocol, not a vendor. Cloud when connected, local when sovereign, hybrid when in between.

### The Scope
Dashboard and visualization layer. Shows network health, signal strength, and system status.

## Additional Components

- **Ping** - Object permanence automation and heartbeat monitoring
- **Attractor** - Calibration system for harmonic resonance
- **Whale Channel** - LoRa 915MHz mesh network
- **The Thick Click** - Haptic feedback system
- **Abdicate** - Governance protocol with key destruction

## Quick Start

See [docs/setup.md](docs/setup.md) for complete installation instructions.

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Docker** (optional, for backend services)
- **ESP-IDF** v5.0+ (optional, for Node One firmware)

### Basic Setup

```bash
# Clone and navigate
cd phenix-navigator-creator67

# Install root dependencies
npm install

# Start The Centaur (backend)
cd SUPER-CENTAUR
npm install
cp .env.example .env  # Configure environment
npm run db:init        # Initialize database
npm run dev

# Start The Scope (frontend) - in new terminal
cd ../ui
npm install
npm run dev

# Start The Buffer (communication processing) - in new terminal
cd ../cognitive-shield
npm install
cp .env.example .env  # Configure environment
npm run dev
```

See [docs/setup.md](docs/setup.md) for detailed setup instructions for each component.

## Documentation

### Getting Started
- [Documentation Index](docs/index.md) - Complete documentation map
- [Setup Guide](docs/setup.md) - Installation and configuration
- [Quick Reference](docs/quick-reference.md) - Common commands
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

### Technical Documentation
- [Architecture](docs/architecture.md) - System architecture details
- [Development Guide](docs/development.md) - Development workflow
- [Naming Reference](docs/naming.md) - P31 naming conventions
- [Environment Variables](config/env-reference.md) - Configuration reference

## Component Documentation

- [Node One](docs/node-one.md) - Hardware documentation
- [The Buffer](docs/buffer.md) - Communication processing
- [The Centaur](docs/centaur.md) - Backend AI protocol
- [The Scope](docs/scope.md) - Dashboard and UI
- [Ping](docs/ping.md) - Object permanence system
- [Attractor](docs/attractor.md) - Calibration system
- [Whale Channel](docs/whale-channel.md) - LoRa mesh network
- [The Thick Click](docs/thick-click.md) - Haptic system
- [Abdicate](docs/abdicate.md) - Governance protocol

## Philosophy

P31 is built on tetrahedron topology - four vertices, six edges, four faces. The minimum stable system. Every component follows:

1. **Geometric Imperative** - Strict tetrahedron topology
2. **Privacy Axiom** - Type-level encryption, zero-knowledge proofs
3. **Doing More With Less** - Optimized for low bandwidth (0.350 kbps)
4. **Abdication Principle** - No backdoors, code for departure
5. **Synergetics** - Geometric navigation, haptic-first, universal accessibility

## Project Structure

```
phenix-navigator-creator67/          # Root (P31 ecosystem)
├── firmware/                         # Node One (ESP32-S3 hardware)
├── SUPER-CENTAUR/                    # The Centaur (backend AI protocol)
├── ui/                               # The Scope (dashboard/visualization)
├── cognitive-shield/                 # The Buffer (communication processing)
├── donation-wallet/                  # Donation wallet system
├── docs/                             # Complete documentation
├── config/                           # Configuration templates
└── scripts/                          # Utility scripts
```

## Related Projects

- [Sovereign Life OS](../sovereign-life-os) - Self-hosted services stack (72 services)
- [Donation Wallet](../phenix-donation-wallet-v2) - ERC-5564 stealth addresses
- [Lasater OS](../lasater-os_1) - React/Vite operational command center

## License

See individual component licenses.

## References

- [P31 Naming Architecture](P31_naming_architecture.md)
- [G.O.D. Protocol Constitution](docs/god-protocol.md)
- [Tetrahedron Protocol](https://zenodo.org) - Prior art documentation

---

**The Mesh Holds.** 🔺
