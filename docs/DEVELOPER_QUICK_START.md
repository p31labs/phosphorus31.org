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
# 1. Install all workspace dependencies
pnpm install

# 2. Start the Buffer Server (hardware message queue) — port 4000
cd apps/buffer-server && pnpm start
# Verify: curl http://localhost:4000/health

# 3. Start P31 Tandem (backend + Shelter API) — port 3001 — new terminal
cd SUPER-CENTAUR && pnpm dev
# Verify: curl http://localhost:3001/health
# Verify: curl http://localhost:3001/api/shelter/brain

# 4. Start P31 Spectrum (frontend) — port 5173 — new terminal
cd ui && pnpm dev
# Open: http://localhost:5173
```

**That's it!** You now have the full stack running: Buffer Server (4000) -> Centaur (3001) -> Scope (5173).

---

## Component Quick Reference

| Component | Folder | Port | Purpose |
|-----------|--------|------|---------|
| **Buffer Server** | `apps/buffer-server/` | 4000 | Hardware message queue (ESP32/LoRa bridge) |
| **P31 Tandem** | `SUPER-CENTAUR/` | 3001 | Backend AI protocol + Shelter API |
| **P31 Spectrum** | `ui/` | 5173 | Dashboard/UI (React/Vite) |
| **P31 Buffer PWA** | `apps/shelter/` | 5174 | Communication processing UI (React/Vite) |
| **Node One (P31 NodeZero)** | `firmware/` | N/A | Hardware (ESP32-S3). See [Firmware synthesis](FIRMWARE_XIAOZHI_SYNTHESIS.md) for Xiaozhi × P31 build order. |

---

## Common Commands

```bash
# Install all workspace dependencies
pnpm install

# Start specific components
pnpm dev:centaur     # Centaur on 3001
pnpm dev:scope       # Scope on 5173
pnpm dev:shelter     # Shelter PWA on 5174

# Buffer Server (not in turbo — start directly)
cd apps/buffer-server && pnpm start   # port 4000

# Build everything
pnpm build

# Run tests
pnpm test

# Typecheck and lint
pnpm typecheck
pnpm lint

# Pre-flight and launch checks
pnpm preflight
pnpm launch:check
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
├── SUPER-CENTAUR/          # P31 Tandem (backend + Shelter API on 3001)
├── ui/                      # P31 Spectrum (frontend on 5173)
├── apps/shelter/            # P31 Buffer PWA (communication UI on 5174)
├── apps/buffer-server/      # Buffer Server (hardware queue on 4000)
├── packages/game-engine/    # L.O.V.E. gamification library
├── packages/game-integration/ # ShelterBridge + genesis + metabolism
├── firmware/                # P31 NodeZero (ESP32-S3 hardware)
├── docs/                    # Documentation
└── scripts/                 # preflight, launch-check, verify-assets
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
- **P31 NodeZero** = Hardware device (was "Phenix Navigator")
- **P31 Buffer** = Communication processing (was "Cognitive Shield")
- **P31 Tandem** = Backend AI protocol
- **P31 Spectrum** = Dashboard/UI
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
lsof -ti:3000 | xargs kill  # P31 Tandem
lsof -ti:5173 | xargs kill  # P31 Spectrum
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

**P31 Buffer not connecting?**
- Verify Redis is running (optional - fallback mode works without it)
- Check `REDIS_URL` in `.env` (default: `redis://localhost:6379`)
- P31 Buffer works in fallback mode without Redis

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