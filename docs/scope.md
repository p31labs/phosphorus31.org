# The Scope

Dashboard and visualization layer. Shows network health, signal strength, and system status.

## Overview

The Scope is the oscilloscope of the P31 system - it shows you the signal. It provides network health visualization, system monitoring, and interactive debugging tools.

## Features

- Network health visualization
- Signal strength monitoring
- Real-time performance metrics
- 3D scene visualization
- Interactive debugging
- Toast notifications

## Architecture

The Scope is built with:
- **React** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics
- **React Three Fiber** - React bindings for Three.js
- **Vite** - Build system

## Setup

See [ui/setup.md](../ui/setup.md) for setup instructions.

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

```bash
cd ui
npm install
npm run dev
```

The Scope will start at `http://localhost:5173`

## Components

### Visualization
- Network topology view
- Signal strength graphs
- Performance metrics
- 3D scene inspector

### Monitoring
- System health dashboard
- Connection status
- Message queue status
- Ping status

### Debugging
- Scene inspector
- Performance monitor
- Network analyzer
- Log viewer

## Integration

The Scope integrates with:
- **The Centaur**: Backend API
- **The Buffer**: Message queue visualization
- **Ping**: Object permanence status
- **Node One**: Hardware status

## Development

### Project Structure

```
ui/
├── src/
│   ├── components/     # React components
│   ├── stores/         # State management
│   ├── services/       # API services
│   └── config/         # Configuration
├── dist/               # Build output
└── package.json
```

### Key Components

- **Quantum Canvas**: 3D visualization
- **Performance Monitor**: Real-time metrics
- **Scene Inspector**: 3D debugging
- **Toast System**: User feedback

## Documentation

- [Setup Guide](../ui/setup.md)
- [The Centaur](centaur.md) - Backend API
- [The Buffer](buffer.md) - Message processing
- [Development Guide](development.md)
