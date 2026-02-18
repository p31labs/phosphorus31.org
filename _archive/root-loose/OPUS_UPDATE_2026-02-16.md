# P31 Status Update for Opus

**Date:** 2026-02-16  
**Newer:** See **OPUS_UPDATE_2026-02-17.md** for Cloudflare doc, automated git + cloud-share, Quantum Google Workspace Connector page, and current launch/deployment state.  
**Purpose:** Detailed handoff/context for Claude Opus — current state of the P31 codebase, what shipped, what’s blocked, and what to do next. Use for drafting, review, or research processing.

---

## 1. Where the main production code lives

| Path (in p31 repo) | Component | Role |
|--------------------|-----------|------|
| **`ui/`** | P31 Spectrum (Scope) | React/Vite/Three.js dashboard: Sprout, Tasks, Health, Projects, mesh adapter, unified demo. Dev: `npm run dev` → :5173. |
| **`apps/shelter/`** | P31 Shelter (Buffer) | Message voltage/triage, accommodation log, WebSocket on **port 4000**. Backend-only build passes; full-stack has pre-existing TS debt. |
| **`apps/web/`** | Public site | phosphorus31.org — static site. Launch via Cloudflare Pages. See `LAUNCH_NOW.md` in that folder. |
| **`firmware/node-one-esp-idf/`** | NODE ONE (NodeZero) | ESP32-S3 firmware. Flash via `FLASH_PREP.md` + `flash_now.ps1` from ESP-IDF 5.5 PowerShell. |
| **`packages/protocol/`** | Shared protocol | `@p31/protocol`: L.O.V.E. types, P31 constants, voltage tier. Minimal boundary; full engine migration is Phase 3. |
| **`p31-core/`** | Living architecture | Memory, identity, mission, protocol, shard registry, progress. Canonical context. |

**Note:** The standalone **cognitive-shield** repo (separate workspace) is the older Buffer codebase. Inside p31, the Buffer is **`apps/shelter`** (package `@p31/shelter`). Backend runs there; deploy uses backend-only build.

---

## 2. What’s done (recent)

- **Phase 1 consolidation (2026-02-16):** Monorepo cleanup. Legacy apps moved to `_archive/` (wonky-sprout, phenix-navigator-creator, bridge, dashboard, node-zero Next.js app, sovereign-agent-core, donation-wallet). Copy of super-centaur in `_archive/super-centaur/`; root `SUPER-CENTAUR/` may still exist if move failed (folder in use). cognitive-shield → **apps/shelter**, website → **apps/web**. DEPLOY_* in apps/web renamed to LAUNCH_*. **packages/protocol** and **p31-core/** created.
- **Phase 2 (Molecular Layer):** Zustand stores (navigation, copilot, sensory), OctahedralNav, ScopeDashboard shell, FractalZUI, GlowBadge, PulseIndicator, SpectrumBar, FIDTransition. See `ui/PHASE2_SCOPE_README.md`.
- **Unified demo ↔ Scope:** Single entry point in `ui`. Toolbar “🔺 Full Scope” opens ScopeDashboard; “✕ Back to Scope” returns. P31 Sprout: “I’m okay”, “I need a break”, “I need a hug”, “I need help”, Today’s wins, quiet mode (spoons → 3). Footer: “For families · Kids first.” **prefers-reduced-motion** respected.
- **Buffer ↔ Sprout:** When a kid taps “I need help” in Sprout, Buffer shows “Someone needs help” with one-tap “Send calm message” / “Draft message for me” / “Dismiss”. No kid data in Buffer; only “someone needs help” + optional draft.
- **Scope ↔ Buffer live data:** `buffer.service.ts` and `useScopeBufferData` hook. ScopeDashboard Tasks/Health show Buffer connection, today’s triaged messages, accommodation log blurb (or “Coming soon” if 501).
- **Mesh / Whale Channel:** WebSocket mesh adapter in Scope. With `VITE_MESH_WS_URL` (e.g. `ws://localhost:4000`), Sprout signals go over WS; Buffer handles `sprout_signal` and broadcasts. Dev uses Whale Channel simulator; real client swap via `setMeshAdapter(realClient)`. See `ui/docs/MESH_ADAPTER_INTEGRATION.md`.
- **MATA cockpit:** MATADemoCockpit subscribes to `p31:mesh:signal`; live mesh log shows Sprout “break”/“help” (cap 20 entries).
- **Shelter backend:** Backend-only build passes (`tsconfig.build.json`). `npm start` → port 4000. Single launch path for Buffer; UI/stores have 385+ pre-existing TS errors, not in backend build path.
- **NodeZero firmware:** Optimizations in `firmware/node-one-esp-idf/` (audio cap, heap guard, message-queue leak fix, splash, mesh duplicate cleanup, etc.). Some modules still to fix for clean ESP-IDF 5.5 build: audio_engine (I2S API), mcp23017_driver.
- **Docs:** `p31-core/memory/progress.md`, `ui/README_SCOPE_AND_DEMO.md`, `PREP_FOR_LAUNCH.md`, `BUILD_NEXT.md` (living next-steps). PII/secrets scan clean in apps/, packages/, p31-core/.

---

## 3. What’s blocked or in progress

- **Shelter full-stack:** Many TS errors in components/stores (strict mode, type assertions). Phase 1 fixed `shield.store.ts` devtools syntax. Use backend-only build for deploy; run Shelter with `npm run build && npm start` in `apps/shelter`. Install: `npm install --legacy-peer-deps`. Full test suite not green until TS is resolved or relaxed for UI.
- **NODE ONE clean build:** ESP-IDF 5.5 fixes applied to pin_map, shield_server WebSocket, ble_test disabled, mesh_protocol, main. **Still to fix:** audio_engine (`i2s_std_slot_config_t.msb_right`, `i2s_channel_wait_done`), mcp23017_driver (mcp23x17 init/reg API). See `firmware/node-one-esp-idf/` build log.
- **Root folder cleanup:** If `website/` or `SUPER-CENTAUR/` still exist at repo root (move failed because folder in use), delete when no process has them open. `apps/web` and `_archive/super-centaur` already exist.
- **Naming / banned words:** Legacy refs remain in docs and archive. Use P31 naming (P31 Compass, P31 Buffer, P31 Shelter, P31 Sprout, NodeZero; no deploy → launch, no kill/lockdown/tactical). Run `npm run audit` for scan.

---

## 4. Launch checklist (high level)

- **Website:** `apps/web` → `npx serve . -l 8000` locally; push to GitHub → Cloudflare Pages, custom domain phosphorus31.org. See `apps/web/LAUNCH_NOW.md`.
- **Shelter:** `apps/shelter` → `npm run build && npm start` → :4000. Scope uses `VITE_BUFFER_URL=http://localhost:4000` (see `ui/.env.example`).
- **Scope + demo:** `ui` → `npm run dev` → :5173. Optional: start Shelter and set `VITE_BUFFER_URL` / `VITE_MESH_WS_URL` for live Buffer and mesh.
- **NodeZero flash:** ESP-IDF 5.5 PowerShell → `cd firmware/node-one-esp-idf` → `.\flash_now.ps1`. See `FLASH_PREP.md`.

Single checklist: **`PREP_FOR_LAUNCH.md`** at repo root.

---

## 5. Principles (for any drafting or review)

- **Kids first.** No scary words; no kid names in UI; no logging of kid data without consent. NODE ONE = device; node one = Bash (human).
- **P31 naming:** P31 Compass, P31 Buffer, P31 Shelter, P31 Sprout, P31 NodeZero, etc. No legacy product names in new code.
- **Banned words:** no deploy → launch; no kill/lockdown/tactical; use shelter/field/protect, not defense/attack.
- **OPSEC:** No full names, addresses, case numbers, or kid data in public-facing content. Codename usage per `.cursor/rules/privacy-codenames.mdc` and `01_OPSEC_RULES.md`.
- **prefers-reduced-motion:** Must be respected; disable or drastically reduce animation when set.

---

## 6. Key references for Opus

- **BUILD_NEXT.md** — Living next steps, Buffer↔Sprout, Node One, docs, principles.
- **PHASE1_CONSOLIDATION_REPORT_2026-02-16.md** — What moved, Shelter build status, protocol extraction, follow-ups.
- **PREP_FOR_LAUNCH.md** — One-page launch checklist (website, Shelter, Scope, optional flash).
- **FULL_AUDIT_REPORT.md** — Test matrix, audit script, tetrahedron stability check.
- **p31-core/memory/progress.md** — Recent progress and next items.
- **ui/README_SCOPE_AND_DEMO.md** — How to run unified demo + Scope in one session.
- **ui/docs/MESH_ADAPTER_INTEGRATION.md** — MeshAdapter contract and real NODE ONE client swap.
- **00_AGENT_BIBLE.md** / **.cursor/rules/** — Identity, deadlines, OPSEC, naming, master system prompt.

---

## 7. Active deadlines (from Agent Bible)

| Date | Event |
|------|--------|
| Feb 20, 2026 | SSA telehealth psychiatric exam |
| Feb 26, 2026 | SSA in-person medical exam (Brunswick, GA) |
| Feb 27, 2026 | MATA accelerator application deadline |
| Mar 10, 2026 | Bash turns 10 — Operation LEVEL 10 / MAR10 Day |
| Mar 12, 2026 | Court date (Chief Judge Scarlett) |

---

**Summary for Opus:** Monorepo is consolidated; production apps are **ui**, **apps/shelter**, **apps/web**, and **firmware/node-one-esp-idf**. Scope and Buffer are wired (live data, Sprout help flow, mesh adapter with simulator). Shelter backend builds and runs; full-stack Shelter and NODE ONE firmware still have known TS/firmware items. Launch path is documented in PREP_FOR_LAUNCH.md. Use this update for context on current state before drafting, review, or research processing.

*The mesh holds. 🔺*
