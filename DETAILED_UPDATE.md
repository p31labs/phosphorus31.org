# P31 Workspace — Detailed Update

**Date:** Thursday, Feb 19, 2026  
**Branch:** `main`  
**Scope:** Repo state, recent changes, and where things stand.

---

## 1. Git status snapshot

### Modified (M)

- **GENESIS_GATE_APPS_SCRIPT:** `Code.gs`, `Core/LoveEconomy.gs`, `Utilities/DriveSync.gs`, `IMPLEMENTATION_SUMMARY.md`, `Index.html` — P31 Entangle backend (L.O.V.E. economy, Drive sync, heartbeat).
- **SUPER-CENTAUR:** `data/store/alerts.json`, `data/store/audit_log.json` — Tandem runtime data.
- **apps/shelter:** `.env.example`, `index.html`, `package.json`, `App.tsx`, layout (`Header`, `Footer`, `TabBar`), panels (`DeepLock`, `QueuePanel`), phases (`Calibrate`, `Scored`), `index.css`, `main.tsx`, `tailwind.config.ts`, `vite.config.ts` — P31 Buffer PWA and UI.
- **apps/web:** `_headers`, `index.html` — Static site.
- **package.json, pnpm-lock.yaml** — Root workspace.
- **packages/game-engine:** `achievements.ts`, `constants.ts`, `types.ts` — Gamification layer used by Shelter.
- **ui:** `_headers`, `index.html`, `QuantumHelloWorld.tsx`, `SettingsPanel.tsx`, `ai-provider.ts`, `resonance-engine.ts`, `styles.css` — P31 Spectrum.

### New / untracked (??)

- **apps/shelter:** `Modelfile`, `public/_headers`, `public/_redirects`, `public/favicon.svg`, `icon-192.svg`, `icon-512.svg`, `og-image.svg`, `TabBar.tsx`, `components/shared/`, `hooks/useGameAction.ts`, `hooks/useQuantumBrain.ts`, `lib/` (crisis, fawn, oracle, opsec, quantum-brain, voice, etc.), `services/tandem-ai.ts`, `stores/provider-store.ts`, `stores/shelter-store.ts`, `stores/tandem-store.ts`, `views/` (Buffer, Brain, Breathe, Jitterbug, Quests, Settings, Stats, Tandem).
- **apps/web:** `brain/` (new area).
- **ui:** `MarioDayBanner.css`, `MarioDayBanner.tsx`, `voice.ts`.
- **Other:** `git-filter-repo.py` (repo tooling).

---

## 2. Component health (from WORKSPACE_STATUS.md, last updated 2026-02-18)

| Component        | Path                    | Runs | Tests      | Maturity | Notes                          |
|-----------------|-------------------------|------|------------|----------|--------------------------------|
| P31 Spectrum    | `ui/`                   | Yes  | Vitest ~30 | 70%      | Import/Shield Store issues     |
| P31 Buffer      | `apps/shelter/`         | Yes  | Vitest ~20 | 75%      | Core + game engine + 3D views  |
| P31 Tandem      | `SUPER-CENTAUR/`        | Yes  | Jest 150+  | 75%      | 451 TS errors (strict)         |
| P31 Entangle    | `GENESIS_GATE_APPS_SCRIPT/` | Yes (GAS) | None | 40% | L.O.V.E., Drive sync, heartbeat |
| P31 Scope       | `apps/scope/`           | Scaffold | Minimal | 15%  | Needs data integration        |
| P31 Sprout      | `apps/sprout/`          | Scaffold | Minimal | 10%  | Early stage                   |
| P31 NodeZero FW | `firmware/`             | Builds | None       | 30%      | ESP-IDF 5.4+                  |
| @p31/protocol   | `packages/protocol/`    | —    | None       | —        | Types, tokens, constants      |
| @p31/game-engine| `packages/game-engine/` | —    | —          | —        | XP, achievements, quests, L.O.V.E. |
| @p31/game-integration | `packages/game-integration/` | — | None | —   | Game bridge                   |

---

## 3. P31 Buffer (apps/shelter) — current shape

- **Stack:** React 19, Vite 6, Zustand, Dexie, Three.js/R3F, Tailwind. Depends on `@p31labs/buffer-core` and `@p31labs/game-engine`.
- **Features in code:**
  - **BufferView** — Message voltage / queue (core Buffer).
  - **TandemView** — AI collaboration (tandem-ai service, provider/tandem stores).
  - **BrainView** — “Quantum brain” (quantum-brain lib, useQuantumBrain).
  - **QuestsView / StatsView** — Quests and stats driven by game-engine (daily/weekly quests, XP, persistence).
  - **BreatheView** — Breathing/regulation.
  - **JitterbugView / JitterbugScene** — 3D jitterbug (lib: jitterbug-graph.ts).
  - **SettingsView** — Settings.
- **Layout:** `Header`, `Footer`, `TabBar` (tab navigation).
- **Shared:** `ErrorBoundary`, `ToastStack`, `SpoonGauge`; panels: `DeepLock`, `QueuePanel`, `SamsonPanel`; phases: `Calibrate`, `Scored`, `Original`, `Rewritten`, `Input`.
- **Stores:** `shelter-store` (player, quests, tabs, check-in), `buffer-store`, `spoon-store`, `provider-store`, `tandem-store`.
- **Persistence:** `persistence.ts` (Dexie hydrate/subscribe), `storage.ts`; game state in localStorage (`p31_shelter_player`, `p31_shelter_quests`).
- **New libs:** crisis, fawn, opsec, oracle, quantum-brain, voice; tests for crisis, fawn-opsec, oracle.
- **Deploy:** PWA assets in `public/`; `_headers`, `_redirects`, Modelfile present.

---

## 4. Game engine (packages/game-engine)

- **Role:** Pure TS gamification for the Buffer: XP, achievements, streaks, L.O.V.E., quests. No React.
- **Consumers:** `apps/shelter` imports `generateDailyQuests`, `generateWeeklyQuests`, `toUTCDateString` and uses `useGameAction` for game actions.
- **Recent edits:** `achievements.ts`, `constants.ts`, `types.ts` (modified in this session).
- **Docs:** README and ROADMAP in package; API summary in README (XP, achievements, streaks, L.O.V.E., quests).

---

## 5. P31 Entangle (GENESIS_GATE_APPS_SCRIPT)

- **Role:** Google Apps Script backend — L.O.V.E. economy, Drive sync, heartbeat dashboard, daily digest.
- **Layout:** `Code.gs`, `Core/LoveEconomy.gs`, `Utilities/DriveSync.gs`, `Index.html`, README, DEPLOYMENT, IMPLEMENTATION_SUMMARY.
- **IMPLEMENTATION_SUMMARY:** Describes Entangle v2 (P31 naming, heartbeat, dashboard, OPSEC). Drive zones: ZONE_ALPHA (archives), ZONE_BETA (ops), ZONE_GAMMA (fabrication). API: `getSystemStatus`, `recordActivity`, `syncDrive`, `getSyncStatus`.

---

## 6. Docs and product context

- **FAMILY_CODING_MODE.md** — Family visual coding → 3D models → slicing → printer. Block types (Move, Rotate, Scale, Color, Repeat, Condition, Function). Collaborative, print-focused.
- **AGENTS.md** — Orientation, naming (P31 only), deadlines (e.g. Feb 20 SSA psych, Feb 26 SSA medical, Feb 27 MATA, Mar 12 court).
- **WORKSPACE_STATUS.md** — Ports (3000 Buffer, 4000 Tandem, 5173 Spectrum, etc.), Docker layout, test commands, entry points for common tasks.

---

## 7. Known issues (from WORKSPACE_STATUS)

- **Blocking:** SUPER-CENTAUR 451 TS errors; ui/ import/Shield Store mismatches; CI/CD status unclear.
- **Non-blocking:** Scope/Sprout need data; firmware/packages lack tests; GENESIS_GATE_APPS_SCRIPT still has legacy naming (PHENIX_NAVIGATOR, ZONE_*).

---

## 8. Suggested next actions (priority)

1. **Deadline-critical:** MATA (Feb 27), SSA prep (Feb 20, Feb 26), court (Mar 12) — use `06-legal-ssa.mdc` / `03-accelerator-application.mdc` as needed.
2. **Buffer:** Run `npm run test:shelter` (or pnpm equivalent); fix any regressions from recent store/quest changes.
3. **Spectrum:** Resolve ui/ import and Shield Store (CatchersMitt) mismatches so dev/build are clean.
4. **Tandem:** Tackle SUPER-CENTAUR strict-mode TS errors in batches (e.g. `noUncheckedIndexedAccess`).
5. **Entangle:** Optional rename pass (PHENIX_NAVIGATOR → P31, ZONE_* → P31 zone naming) for consistency.
6. **Docs:** Bump WORKSPACE_STATUS.md “Last updated” when you change component health or ports.

---

## 9. One-paragraph summary for sharing

P31 is a monorepo for assistive tech (neurodivergent-first, tetrahedron topology, Georgia 501(c)(3) in formation). The Buffer (`apps/shelter`) is the main PWA: message voltage, AI Tandem, “quantum brain,” quests/stats via `@p31labs/game-engine`, breathing and 3D Jitterbug views, and Dexie/Zustand persistence. P31 Entangle (Apps Script) runs the L.O.V.E. economy and Drive sync. P31 Tandem (SUPER-CENTAUR) runs the backend but has ~451 TypeScript errors under strict mode. Spectrum (ui/) is ~70% with some import issues; Scope and Sprout are scaffolded. Family Coding Mode is documented for 3D block coding and printing. Key upcoming dates: SSA exams (Feb 20, 26), MATA deadline (Feb 27), court (Mar 12).

---

*The mesh holds. 🔺*
