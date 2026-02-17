# Progress — P31 Core

**Last updated:** 2026-02-16

## Recent

- **Phase 2 (Molecular Layer):** Done. Zustand stores (navigation, copilot, sensory), OctahedralNav, ScopeDashboard shell, FractalZUI, GlowBadge, PulseIndicator, SpectrumBar, FIDTransition. See `ui/PHASE2_SCOPE_README.md`.
- **P31 Sprout (unified demo):** Family-facing feelings (“I’m okay”, “I need a break”, “I need help”, etc.), Today’s wins, “I need a break” → quiet mode (spoons → 3). Footer: “For families · Kids first.”
- **prefers-reduced-motion** respected in unified demo CSS and Scope components.
- **Unified demo ↔ Scope:** One entry point. In `ui` app: toolbar “🔺 Full Scope” opens Scope dashboard (Phase 2 shell); “✕ Back to Scope” returns to main view. FractalZUI used in Scope “Neural Core” view with seed data.
- **BUILD_NEXT.md** in use as living next-steps list.
- **Mesh adapter (Sprout → Whale Channel):** `ui/src/services/meshAdapter.ts` — Sprout emits `break` / `help` on tap. Whale Channel simulator wired in dev: signals logged and dispatched as `p31:mesh:signal`; real client swap-ready via `setMeshAdapter(realClient)`.
- **MATA cockpit live mesh log:** MATADemoCockpit listens for `p31:mesh:signal`; Sprout "I need a break" / "I need help" show as live lines in the mesh log (Sprout → SPROUT: …). Cap 20 live entries.
- **Shelter (cognitive-shield):** Backend-only build passes (`npm run build` uses `tsconfig.build.json`). UI/stores remain out of scope for backend build; single launch path for Buffer on port 4000.
- **Mesh adapter integration doc (2026-02-16):** `ui/docs/MESH_ADAPTER_INTEGRATION.md` — contract, event, bootstrap swap point, and checklist for real NODE ONE client when firmware/transport is ready.
- **NodeZero firmware optimization (2026-02-16):** `firmware/node-one-esp-idf/` — RAM cap (stored audio 8192 samples), heap guard (32KB min), message-queue leak fix, splash 500ms, energy-recovery fix, mesh lazy duplicate cleanup, optional WDT feed. See `firmware/node-one-esp-idf/NODEZERO_OPTIMIZATION.md`.
- **Buffer env (2026-02-16):** `ui/.env.example` includes `VITE_BUFFER_URL`; `README_SCOPE_AND_DEMO.md` documents how to point Scope at P31 Shelter. Default remains `http://localhost:4000`.

## Next (from BUILD_NEXT.md)

- Buffer ↔ Sprout: **Done.** “I need help” → low-voltage draft in Buffer (no kid data).
- Node One / NodeZero (mesh adapter): **Simulator wired.** In dev, Whale Channel simulator logs and emits `p31:mesh:signal`. Real NODE ONE client: implement `MeshAdapter`, call `setMeshAdapter(realClient)` at bootstrap.
- Docs: one-pager for “run unified demo + Scope in one day” (see `ui/README_SCOPE_AND_DEMO.md`).
- Scope ↔ Buffer live data: **Done (2026-02-16).** Tasks and Health views in ScopeDashboard now fetch from P31 Shelter backend when available: today’s triaged messages, connection status, accommodation log blurb. See `ui/src/hooks/useScopeBufferData.ts`, `ui/src/services/buffer.service.ts` (processMessage, getHistory, getAccommodationLog).

---

*The mesh holds. 🔺*
