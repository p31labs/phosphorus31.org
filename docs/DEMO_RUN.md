# P31 Demo Run — One-Page Guide

**Purpose:** Run a full demo of Scope + Shelter (and optionally Sprout) in one session.  
**Updated:** 2026-02-17

---

## Fast path (Scope only, no backend)

1. **From repo root**
   ```bash
   cd ui
   npm install
   npm run dev
   ```
2. **Open** the URL shown (e.g. `http://localhost:5173`).
3. **In the app:** Toolbar → **🔺 Full Scope** (dashboard) or **📊 Demo** / **🎬 MATA Demo** (demo views).

No Shelter required; Tasks/Health will show placeholder or offline state.

---

## Full stack (Scope + Shelter + Sprout)

1. **From repo root**
   ```bash
   npm run dev
   ```
   Starts Shelter (Buffer API), Sprout, and Scope together. Ports:
   - **Shelter:** 4000 (or 4001–4010 if 4000 is in use — check log)
   - **Sprout:** Vite default (e.g. 5174)
   - **Scope:** Vite default (e.g. 5173)

2. **Open Scope:** `http://localhost:5173` (or the port in the Scope log).

3. **If Shelter used a fallback port** (e.g. 4001), set in `ui/.env` (or `apps/scope/.env`):
   ```env
   VITE_SHELTER_URL=http://localhost:4001
   VITE_BUFFER_URL=http://localhost:4001
   ```
   Restart Scope after changing env.

4. **Verify live wiring (optional):** In another terminal, from repo root:
   ```bash
   npm run verify
   ```
   Checks health on Centaur :3000, Buffer :4000, Scope :5173 and runs a test message through the Buffer.

---

## What to show in the demo

| View | How to open | What it shows |
|------|-------------|----------------|
| **Full Scope** | Toolbar → 🔺 Full Scope | Octahedral nav, Neural Core (FractalZUI), spectrum bar, Tasks / Health / Projects |
| **Demo** | Toolbar → 📊 Demo | MATA Demo Dashboard (voltage, spoons, LoRa, haptics) |
| **MATA Demo** | Toolbar → 🎬 MATA Demo | MATA cockpit (timeline, Buffer icosahedron, mesh log) |

Use **✕ Back to Scope** (top-left in Full Scope) to return to the main 3D/toolbar view.

---

## Preflight before a “launch-day” demo

From repo root, with **Shelter already running** in another terminal:

```bash
npm run preflight
```

Runs asset verification → Shelter health → integration tests. Exit 0 = good to go.

To build everything first:

```bash
cd apps/shelter && npm run build
cd ../../ui && npm run build
cd ..
npm run dev:shelter
# In second terminal:
npm run preflight
```

---

## Related

- [PREP_FOR_LAUNCH](../PREP_FOR_LAUNCH.md) — Full launch checklist
- [LAUNCH_SEQUENCE_LAUNCH12](LAUNCH_SEQUENCE_LAUNCH12.md) — Launch day order of operations
- [ui/README_SCOPE_AND_DEMO.md](../ui/README_SCOPE_AND_DEMO.md) — Scope vs demo vs MATA cockpit
- [QUANTUM_GEODESIC_PLATFORM_STATUS](QUANTUM_GEODESIC_PLATFORM_STATUS.md) — §18 “How to run”, ports, env

**The mesh holds. 🔺**
