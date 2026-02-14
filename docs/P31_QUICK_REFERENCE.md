# P31 Quick Reference Card
## Everything You Need in One Place

---

## Component Names

| Old Name | P31 Name | Type |
|----------|----------|------|
| Phenix Navigator | **Node One** | Hardware |
| Cognitive Shield | **The Buffer** | Software |
| SUPER-CENTAUR | **The Centaur** | Backend |
| Dashboard | **The Scope** | UI |
| Heartbeat Protocol | **Ping** | Automation |
| Mark 1 Attractor | **Attractor** | Calibration |
| SIMPLEX | **The Fold** | Philosophy |

**Preserved Names:** The Thick Click, Whale Channel, Abdicate

---

## Component Ports

| Component | Port | URL |
|-----------|------|-----|
| The Centaur | 3000 | http://localhost:3000 |
| The Scope | 5173 | http://localhost:5173 |
| The Buffer | 3001 | http://localhost:3001 |

---

## Quick Commands

```bash
# Install all
npm run install:all

# Start all components
npm run dev:all

# Start individual
npm run dev:centaur
npm run dev:scope
npm run dev:buffer

# Build
npm run build

# Test
npm run test
```

---

## GOD_CONFIG Values

```typescript
// Metabolism (The Buffer)
maxSpoons: 12
spoonRecoveryRate: 0.1
stressThreshold: 8
recoveryThreshold: 4

// Heartbeat (Ping)
green: 70
yellow: 50
red: 30
```

---

## File Locations

```
phenix-navigator-creator67/
├── SUPER-CENTAUR/     # The Centaur
├── ui/                 # The Scope
├── cognitive-shield/  # The Buffer
├── firmware/          # Node One
├── docs/              # Documentation
└── config/            # Configuration
```

---

## Data Flow

```
Node One → The Buffer → The Centaur → The Scope
```

---

## Key Concepts

- **Tetrahedron Topology**: 4 vertices, 6 edges, 4 faces
- **The +**: Interface (Node One, The Buffer, The Thick Click)
- **Whale Channel**: LoRa 915MHz mesh
- **0.350 kbps**: Target bandwidth (Whale Song)
- **Local-First**: SQLite/PGLite for local state

---

## Documentation Links

- [System Overview](SYSTEM_OVERVIEW.md)
- [Developer Quick Start](DEVELOPER_QUICK_START.md)
- [Ecosystem Integration](ecosystem-integration.md)
- [GOD_CONFIG](god-config.md)
- [API Docs](api/index.md)

---

**The Mesh Holds.** 🔺
