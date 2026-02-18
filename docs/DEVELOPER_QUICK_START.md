# P31 Developer Quick Start
## Get Building in 5 Minutes

---

## Prerequisites Check

```bash
node --version  # Need 18.0.0+
npm --version   # Need 9.0.0+
docker --version # Optional, for full stack
```

---

## Fast Setup

```bash
# 1. Install root dependencies
npm install

# 2. Start The Centaur (backend)
cd SUPER-CENTAUR && npm install && npm run dev

# 3. Start The Scope (frontend) - new terminal
cd ui && npm install && npm run dev

# 4. Start The Buffer (P31 Shelter) - new terminal
cd apps/shelter && npm install && npm run start:server

# 5. Open browser
# http://localhost:5173
# Click "Show Buffer" to see The Buffer dashboard
```

**That's it!** You now have The Centaur, The Scope, and The Buffer running.

---

## Component Quick Reference

| Component | Folder | Port | Purpose |
|-----------|--------|------|---------|
| **The Centaur** | `SUPER-CENTAUR/` | 3000 | Backend AI protocol |
| **The Scope** | `ui/` | 5173 | Dashboard/UI |
| **The Buffer (P31 Shelter)** | `apps/shelter/` | 4000 | Communication processing |
| **Node One (P31 NodeZero)** | `firmware/` | N/A | Hardware (ESP32-S3). See [Firmware synthesis](FIRMWARE_XIAOZHI_SYNTHESIS.md) for Xiaozhi × P31 build order. |

---

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Start all components
npm run dev:all

# Start specific component
npm run dev:centaur
npm run dev:scope
npm run dev:buffer

# Build everything
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

---

## Configuration

All components use `god.config.ts` for core settings:

```typescript
import GodConfig from '@/config/god.config';

// Metabolism (energy/spoons)
const maxSpoons = GodConfig.Metabolism.maxSpoons; // 12

// Heartbeat (connection health)
const greenThreshold = GodConfig.Heartbeat.thresholds.green; // 70
```

See [GOD_CONFIG Reference](god-config.md) for details.

---

## File Structure

```
p31/
├── SUPER-CENTAUR/     # The Centaur (backend)
├── ui/                 # The Scope (frontend)
├── apps/shelter/      # The Buffer (P31 Shelter)
├── firmware/          # Node One (hardware)
├── docs/              # Documentation
└── config/            # Configuration templates
```

---

## Development Workflow

1. **Make changes** to component code
2. **Hot reload** automatically updates (Vite/React)
3. **Check logs** in terminal
4. **Test** in browser/device
5. **Commit** with clear messages

---

## Key Concepts

### P31 Naming
- **Node One** = Hardware device (was "Phenix Navigator")
- **The Buffer** = Communication processing (was "Cognitive Shield")
- **The Centaur** = Backend AI protocol
- **The Scope** = Dashboard/UI
- **Ping** = Object permanence/heartbeat
- **Whale Channel** = LoRa mesh network
- **The Thick Click** = Haptic feedback

### Tetrahedron Topology
- Four vertices (minimum stable system)
- Six edges (connections)
- Four faces (components)
- No central hub (delta topology)

### G.O.D. Protocol
- Geometric Imperative (tetrahedron)
- Privacy Axiom (encryption, ZK proofs)
- Doing More With Less (0.350 kbps)
- Abdication Principle (no backdoors)

---

## Troubleshooting

**Port already in use?**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill  # The Centaur
lsof -ti:5173 | xargs kill  # The Scope
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Component not connecting?**
- Check component is running
- Verify API URL in `.env`
- Check CORS settings
- Review component logs

**The Buffer not connecting?**
- Verify Redis is running (optional - fallback mode works without it)
- Check `REDIS_URL` in `.env` (default: `redis://localhost:6379`)
- The Buffer works in fallback mode without Redis

---

## Next Steps

- [Full Setup Guide](setup.md) - Complete installation
- [Ecosystem Integration](ecosystem-integration.md) - Connect all components
- [Development Guide](development.md) - Detailed workflow
- [Architecture](architecture.md) - System design
- [Component Docs](index.md) - Individual component guides
- [Firmware: Xiaozhi × P31 synthesis](FIRMWARE_XIAOZHI_SYNTHESIS.md) - P31 NodeZero (ESP32-S3) architecture, pin map, 6-phase build order
- [P31 NodeZero board checklist (Phase 1a)](FIRMWARE_P31_NODEZERO_BOARD_CHECKLIST.md) - Clone Xiaozhi v2, create `boards/p31-node-zero/`

---

## Quick Links

- [P31 Naming Architecture](../P31_naming_architecture.md)
- [GOD_CONFIG Reference](god-config.md)
- [API Documentation](api/index.md)
- [Troubleshooting](troubleshooting.md)
- [Firmware synthesis (NodeZero)](FIRMWARE_XIAOZHI_SYNTHESIS.md)

---

**The Mesh Holds.** 🔺

*Happy building!*

---

💜 **With love and light. As above, so below.** 💜