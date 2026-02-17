# Run unified demo + Scope in one day

**One entry point:** The Scope (P31 UI) app. From here you can open the **full Scope dashboard** or use the **Demo** and other views.

## Quick start

1. **From repo root**
   ```bash
   cd ui
   npm install
   npm run dev
   ```
2. **Open** the URL shown (e.g. `http://localhost:5173`).

## Switching between “demo” and “full Scope”

- **Toolbar → “🔺 Full Scope”**  
  Opens the Phase 2 Scope dashboard: octahedral nav, Neural Core (FractalZUI), spectrum bar, Tasks/Health/Projects placeholders. Use **“✕ Back to Scope”** (top-left) to return to the main 3D/toolbar view.

- **Toolbar → “📊 Demo”**  
  Opens the MATA Demo Dashboard (voltage, spoons, LoRa, haptics).

- **Toolbar → “🎬 MATA Demo”**  
  Opens the MATA cockpit (timeline, Buffer icosahedron, mesh log).

So: one app, one day — demo and full Scope are both reachable from the same session.

## What’s in the Scope dashboard

- **Top bar:** P31 logo, section name, PulseIndicator.
- **Left (desktop):** OctahedralNav (or 2D list in quiet mode / mobile).
- **Center:** Home, Neural Core (FractalZUI), Tasks, Health, Projects, Settings (sensory toggles).
- **Bottom:** SpectrumBar (³¹P spectrum as nav).

## Optional: Buffer backend (P31 Shelter)

In the **p31 monorepo**, the Buffer backend is **P31 Shelter** at `apps/shelter/`. To run message processing on port 4000:

```bash
# From repo root
cd apps/shelter
npm install
npm run build
npm run start:server
```

Or from repo root: **`npm run dev:shelter`** (Shelter only), or **`npm run dev`** (Shelter + Sprout + Scope together).

To point the Scope at the Buffer, set **`VITE_SHELTER_URL`** or **`VITE_BUFFER_URL`** in `ui/.env` (default: `http://localhost:4000`). If Shelter binds to a fallback port (4001–4010), set that URL and restart Scope. See `ui/.env.example` and `docs/DEMO_RUN.md`.

**NODE ONE / Whale Channel:** In dev, Sprout signals use a simulator; mesh log shows them in the MATA cockpit. When real hardware or transport is ready, see `docs/MESH_ADAPTER_INTEGRATION.md` for swapping in a real mesh adapter.

---

*The mesh holds. 🔺*
