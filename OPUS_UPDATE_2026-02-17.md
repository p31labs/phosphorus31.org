# P31 Status Update for Opus

**Date:** 2026-02-17  
**Purpose:** Handoff/context for Claude Opus — current state after clean-build pass, launch doc addition, and production-ready UI. Use for drafting, review, or research processing.

---

## 1. Where the main production code lives

| Path (in p31 repo) | Component | Role |
|--------------------|-----------|------|
| **`ui/`** | P31 Spectrum (Scope) | React/Vite frontend: Quantum Hello World (/), Posner molecule nav, /mesh, /scope, /fold, /wallet, /challenges, /sprout, /identity, /connections, /bonding, /apps, /molecule, /studio. **Primary deployable app** for phosphorus31.org. Dev: `cd ui && npm run dev` → :5173. Build: `npm run build` → `ui/dist/`. |
| **`apps/shelter/`** | P31 Shelter | Express + SQLite: molecule registration, brain state, L.O.V.E., Sprout signals, WebSocket. Port 4000. Build: `npm run build && npm start` in apps/shelter. |
| **`packages/game-integration/`** | Game client | Genesis, metabolism, wallet, mesh directory; consumed by ui via `file:../packages/game-integration`. |
| **`packages/protocol/`** | Shared protocol | `@p31/protocol`: shared types. |
| **`firmware/node-one-esp-idf/`** | NODE ONE (NodeZero) | ESP32-S3 firmware. Flash via ESP-IDF; SPIFFS can serve ui build with `VITE_BASE_PATH=/web/`. |

**Note:** The Buffer/backend is **apps/shelter** only. The old **cognitive-shield** folder was removed from the repo. All buffer scripts point to **apps/shelter**. The **canonical web app** is **ui/** — build output `ui/dist/`, deploy to Cloudflare Pages (build command: `cd ui && npm install && npm run build`, output directory: `ui/dist`).

---

## 2. What’s done (recent — 2026-02-17)

### Latest (clean-build session)
- **Vite base path:** Default `base` is `/` so the built site works at domain root (Cloudflare Pages, local preview). For ESP32 SPIFFS: `VITE_BASE_PATH=/web/ npm run build`.
- **LAUNCH.md (repo root):** Single reference for run (`cd ui && npm run dev`), build (`cd ui && npm run build`), preview (`cd ui && npm run preview`), deploy to Cloudflare Pages (steps + env), verification checklist (all routes), and optional Shelter backend.
- **main.tsx:** Bootstrap log text updated from "Genesis Gate" to "P31" (naming alignment).
- **README.md:** Full-build line clarified; note added for SPIFFS base path (`VITE_BASE_PATH=/web/`).
- **Build status:** `cd ui && npm run build` exits 0. No dead-code removal; current tree builds. Chunk warnings (size, circular vendor) are non-blocking.

### Earlier (2026-02-17 baseline)
- **Game engine L.O.V.E. wiring (SUPER-CENTAUR):** Full L.O.V.E. API in GameEngine; **docs/GAME_ENGINE_OPUS_BRIEF.md** §14 Hook #1 done.
- **Phase A/B:** SpoonMeter, CalibrationReport, CatchersMitt, MessageList, MeshStatus; shield store deepProcessingQueue, getBatchTimeRemaining, processBatchNow, useBatchTimeRemaining, useProcessBatchNow.
- **Root/docs:** cognitive-shield → apps/shelter everywhere; PREP_FOR_LAUNCH, LAUNCH_CHECKLIST_COMPLETE, DOCUMENTATION_CHECKLIST_LAUNCH08, EXECUTION_PLAN_AGENT, TODO_AUDIT.

---

## 3. What’s blocked or in progress

- **Shelter full-stack:** Pre-existing TS errors in some UI/stores; use backend-only build for deploy. Run: `npm run build && npm start` in `apps/shelter`.
- **NODE ONE clean build:** ESP-IDF 5.5; audio_engine and mcp23017_driver still to fix per 2026-02-16 update.
- **Phase C (stub modules):** Per docs/TODO_AUDIT — stress-test, native-bridge, module-registry, navigator.service, etc.; either implement or remove.
- **RP31 prompts (Downloads):** Friction Log, Exhibit A, Safe Harbor, Inverse Dashboard, Overload Guard, BONDING, ANCESTOR, ENTANGLED — specified in RP31_PROSTHETIC, RP31_FINAL_LAST_MILE, 00_MASTER_EXECUTION_GUIDE; not yet applied. Repo is clean and build-ready for those layers.

---

## 4. Launch checklist (high level)

- **Web app (phosphorus31.org):** Build from **ui/**: `cd ui && npm run build` → `ui/dist/`. Deploy to Cloudflare Pages: build command `cd ui && npm install && npm run build`, output `ui/dist`. See **LAUNCH.md** (repo root).
- **Shelter:** `apps/shelter` → `npm run build && npm start` → :4000. Set `VITE_SHELTER_URL` in ui/.env.local when running locally.
- **Verify:** Run through LAUNCH.md verification checklist (/, /mesh, /scope, /fold, /wallet, /challenges, /sprout, /identity, /connections, /bonding, /apps).
- **Full checklist:** **PREP_FOR_LAUNCH.md**. Sign-off: **docs/LAUNCH_CHECKLIST_COMPLETE.md**.

---

## 5. Principles (for any drafting or review)

- **Kids first.** No scary words; no kid names in UI; no logging of kid data without consent. NODE ONE = device; node one = Bash (human).
- **P31 naming:** P31 Compass, P31 Shelter, P31 Sprout, P31 NodeZero. No legacy product names in new code.
- **Banned words:** no deploy → launch; no kill/lockdown/tactical; use shelter/field/protect.
- **OPSEC:** No full names, addresses, case numbers, or kid data in public-facing content. Codename usage per `.cursor/rules/privacy-codenames.mdc` and `01_OPSEC_RULES.md`.
- **prefers-reduced-motion:** Must be respected.

---

## 6. Key references for Opus

- **LAUNCH.md** — Run, build, preview, Cloudflare Pages deploy, verification checklist, optional Shelter. Primary one-page launch reference.
- **README.md** — Quick start, env, structure, build/SPIFFS note.
- **PREP_FOR_LAUNCH.md** — Full launch checklist (printable); steps 1–6; re-run verify:assets + npm test before go-live.
- **docs/LAUNCH_CHECKLIST_COMPLETE.md** — Phase A/B/C human sign-off.
- **docs/GAME_ENGINE_OPUS_BRIEF.md** — Game engine + Scope engine; §14 enhancement hooks (L.O.V.E. Hook #1 done), §15 key file paths.
- **docs/QUANTUM_GEODESIC_PLATFORM_STATUS.md** — Implementation status (geodesic, Colyseus, WorldBuilder, Shelter §18).
- **config/env-reference.md** — Wiring Shelter ↔ Scope ↔ Sprout.
- **BUILD_NEXT.md** — Living next steps.
- **00_AGENT_BIBLE.md** / **.cursor/rules/** — Identity, deadlines, OPSEC, naming.

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

**Summary for Opus:** Production web app is **ui/** — build passes, base path `/` for web (SPIFFS: `VITE_BASE_PATH=/web/`). **LAUNCH.md** at repo root is the single reference for run, build, preview, Cloudflare Pages deploy, and route verification. Phase A/B complete; game engine L.O.V.E. Hook #1 done. RP31 prosthetic/entangled layers (Friction Log, Exhibit A, Safe Harbor, Inverse, Overload, BONDING, etc.) are specified in prompts but not yet applied; repo is clean and ready for those enhancements. Use this update for context before drafting, review, or research.

*The mesh holds. 🔺*
