# The Scope Setup Guide

Complete setup guide for The Scope dashboard and visualization layer.

## Prerequisites

- Node.js 18.0.0+
- npm or yarn

## Installation

```bash
cd ui
npm install
```

## Configuration

### Environment Variables (Optional)

Create `.env` file if needed:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Running

### Development Mode

```bash
npm run dev
```

The Scope will start at `http://localhost:5173` (or next available port).

### Production Build

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
ui/
├── src/
│   ├── components/     # React components
│   ├── stores/         # State management (Zustand)
│   ├── services/       # API services
│   ├── config/         # Configuration (god.config.ts)
│   ├── routes/         # Routing
│   └── main.tsx        # Entry point
├── dist/               # Build output
└── package.json
```

## Key Features

- **Hot Module Replacement** - Instant updates during development
- **TypeScript** - Full type safety
- **3D Graphics** - Three.js integration
- **Performance Monitoring** - Real-time metrics

## Integration

The Scope connects to:
- **The Centaur**: Backend API (default: http://localhost:3000)
- **WebSocket**: Real-time updates
- **The Buffer**: Message queue visualization

## Troubleshooting

### Port Already in Use

Vite will automatically use the next available port, or specify:

```bash
npm run dev -- --port 5174
```

### API Connection Issues

- Verify The Centaur is running
- Check VITE_API_URL in .env
- Check browser console for errors

## Next Steps

- [The Scope Documentation](../docs/scope.md)
- [Development Guide](../docs/development.md)
- [Component Library](../docs/components/)
