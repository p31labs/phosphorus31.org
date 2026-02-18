# Keep building — P31 next steps

**Updated:** 2026-02-17 · Living list for the next session.

---

## Plan your work. Work your plan.

**Principle:** Decide the next 3–5 actions in order; do one; update the list; repeat.

**Done this cycle (2026-02-17):**
- Launch prep: root `npm test`, live `npm run test:integration`, `npm run preflight` pass; docs and gates aligned. See `PREP_FOR_LAUNCH.md` § Launch prep status.

**Next (in order):**
1. **Website** — Verify phosphorus31.org or run local check (`apps/web`: `npx serve . -l 8000`). See `PREP_FOR_LAUNCH.md` §2.
2. **NODE ONE flash** — If hardware ready: `firmware/node-one-esp-idf/FLASH_PREP.md` → ESP-IDF 5.5 PowerShell → `.\flash_now.ps1`.
3. **NODE ONE build fixes** — If building firmware: audio_engine (I2S 5.5 API), mcp23017_driver (i2c_port_t / MCP23X17_REG_*). See BUILD_NEXT § Next.
4. **MATA application** — Submit by Feb 27; pre-application email and draft in repo. See `EXECUTION_PLAN_CURRENT.md` if deadline-focused.
5. **Board + formation** — When board is ready: Articles, GA eCorp, EIN. See `EXECUTION_PLAN_CURRENT.md` §8.

**Work the plan:** Each session, pick the next unchecked item above (or from PREP_FOR_LAUNCH gates), complete it, then tick or update this list.

---

## Done recently

- **Phase 2 (Molecular Layer):** Zustand stores (navigation, copilot, sensory), OctahedralNav, ScopeDashboard shell, FractalZUI, GlowBadge, PulseIndicator, SpectrumBar, FIDTransition. See `ui/PHASE2_SCOPE_README.md`.
- **P31_DEMO_FIXED.jsx (unified platform):** P31 Sprout for the family — feelings (“I’m okay”, “I need a break”, “I need a hug”, “I need help”), Today’s wins (addable), “I need a break” → quiet mode (spoons → 3). Footer: “For families · Kids first.”
- **prefers-reduced-motion** respected in unified demo CSS and in Scope components.
- **Unified demo ↔ Scope (2026-02-16):** Toolbar **“🔺 Full Scope”** in `ui` opens ScopeDashboard; **“✕ Back to Scope”** returns. See `ui/README_SCOPE_AND_DEMO.md`.
- **FractalZUI in the wild:** Neural Core view in ScopeDashboard uses FractalZUI with seed data.
- **Shelter backend build:** `npm run build` passes (backend-only `tsconfig.build.json`). Buffer: `npm start` on port 4000.
- **Docs:** `p31-core/memory/progress.md`, `ui/README_SCOPE_AND_DEMO.md`.
- **Hardware on board (2026-02-16):** WebSocket mesh adapter in Scope — set `VITE_MESH_WS_URL` (e.g. `ws://localhost:4000`) when Buffer or bridge is running; Sprout signals go over WS. Buffer server handles `sprout_signal` and broadcasts to all WS clients.
- **Scope dashboard polish (2026-02-16):** Tasks, Health, and Projects views have real content; Home quick actions navigate to Communication (Tasks), Archives (Health), Project A (Projects). P31 Stack cards in Projects.
- **Prep for flash (2026-02-16):** `firmware/node-one-esp-idf/FLASH_PREP.md` — one-page checklist; paths in FLASH_READINESS, FLASH_FROM_IDF_DIR, QUICK_START_BUILD fixed to p31 repo. Use `.\flash_now.ps1` from that dir after sourcing ESP-IDF.

---

## Launch prep

- **Single checklist:** `PREP_FOR_LAUNCH.md` (repo root) — website (apps/web), P31 Shelter (port 4000), optional Scope (ui), verification. **Status:** Tests and preflight pass; see PREP_FOR_LAUNCH § Launch prep status.

## Next (pick up here)

- **To flash NODE ONE:** Follow `firmware/node-one-esp-idf/FLASH_PREP.md`. **ESP-IDF is on the Desktop** — use **"ESP-IDF 5.5 PowerShell"** shortcut, then `cd` to `firmware/node-one-esp-idf` and run `.\flash_now.ps1` (or `.\flash_now.ps1 -BuildOnly -NoMonitor` for build only). One-liner after Desktop shortcut: `. C:\Espressif\Initialize-Idf.ps1 -IdfId esp-idf-29323a3f5a0574597d6dbaa0af20c775; cd c:\Users\sandra\Downloads\p31\firmware\node-one-esp-idf; .\flash_now.ps1 -NoMonitor`.
- **NODE ONE build (2026-02-16):** Fixed for ESP-IDF 5.5: pin_map/pin_config (main PRIV_REQUIRES), shield_server WebSocket (fd not handle, filepath truncation), esp_http_server_ws.h → esp_http_server.h, ble_test disabled (NimBLE API), mesh_protocol esp_timer include, main format %08lX. **Still to fix for clean build:** audio_engine (i2s_std_slot_config_t.msb_right, i2s_channel_wait_done for 5.5 I2S API), mcp23017_driver (mcp23x17_init_desc i2c_port_t vs bus handle, MCP23X17_REG_* / mcp23x17_read_reg). See `firmware/node-one-esp-idf/` build log.
- **Next session:** When NODE ONE firmware or real Whale Channel transport exists, replace the simulator with a real client via `setMeshAdapter(realClient)` in app bootstrap. Simulator is wired for dev/demos.
- **Integration doc (2026-02-16):** `ui/docs/MESH_ADAPTER_INTEGRATION.md` — MeshAdapter contract, `p31:mesh:signal` event, where to call `setMeshAdapter`, and checklist for real NODE ONE client.
- **Env (2026-02-16):** `ui/.env.example` documents `VITE_BUFFER_URL` for P31 Shelter; `README_SCOPE_AND_DEMO.md` tells operators how to point Scope at the Buffer.

### 1. Buffer ↔ Sprout — done 2026-02-16

- **Implemented:** `ui/src/stores/sproutHelp.store.ts`, `ui/src/components/Sprout/P31SproutPanel.tsx`, BufferDashboard + SimpleBuffer "Someone needs help" banner with one-tap **Send calm message** / **Draft message for me** and **Dismiss**. Toolbar: 🌱 P31 Sprout.

- When a kid taps “I need help” in Sprout, optionally surface a **low-voltage** prompt in The Buffer (e.g. “Draft a calm message to ask for help”) so parent/operator can send a pre-drafted message.
- No kid data in the Buffer; only “someone needs help” + optional one-tap “draft message for me.”

### 2. Shelter (P31 Shelter / cognitive-shield) — backend done

- Backend lives in **cognitive-shield** repo. Backend build passes (`npm run build` with `tsconfig.build.json`); single launch path for Buffer on port 4000 (`npm start`). Use backend-only build for deploy; see `ui/README_SCOPE_AND_DEMO.md` for run instructions.

### 3. Node One / NodeZero — hardware on board (2026-02-16)
- **Firmware optimization (2026-02-16):** NodeZero ESP-IDF optimizations in `firmware/node-one-esp-idf/`: stored audio capped (MAX_STORED_AUDIO_SAMPLES 8192), heap guard before audio store (MIN_FREE_HEAP_FOR_AUDIO 32KB), message-queue leak fix on “queue full”, splash 500ms, energy-recovery fix, mesh duplicate-table lazy cleanup, optional task WDT feed. See `firmware/node-one-esp-idf/NODEZERO_OPTIMIZATION.md`.

- **WebSocket adapter (2026-02-16):** When Buffer or mesh bridge is running, set `VITE_MESH_WS_URL` (e.g. `ws://localhost:4000`). Scope uses `createNodeOneWebSocketAdapter(wsUrl)` at bootstrap; Sprout signals go over WS. Buffer server handles `sprout_signal` and broadcasts to all WS clients. See `ui/.env.example` and `ui/docs/MESH_ADAPTER_INTEGRATION.md`.
- **Mesh adapter (2026-02-16):** `ui/src/services/meshAdapter.ts` — `emitSproutSignal('break' | 'help')`. Sprout calls it when "I need a break" / "I need help" / quiet are tapped.
- **Whale Channel simulator (2026-02-16):** In dev, `createWhaleChannelSimulatorAdapter()` is wired in `main.tsx`. Signals are logged and dispatched as `p31:mesh:signal` (detail: `{ signal, timestamp }`) for mesh log UI. Production keeps no-op until real client is set via `setMeshAdapter(realClient)`.
- **MATA cockpit mesh log (2026-02-16):** MATADemoCockpit subscribes to `p31:mesh:signal`. When Sprout emits "break" or "help", a live line appears in the mesh log (e.g. "Sprout → SPROUT: I need a break"). Static demo logs follow. Cap 20 live entries.
- Real client: when NODE ONE firmware or Whale Channel transport is ready, implement `MeshAdapter` and call `setMeshAdapter(realClient)` at bootstrap. Same contract: `emitSproutSignal('break' | 'help')`, no identity, no kid data. See `ui/docs/MESH_ADAPTER_INTEGRATION.md`.
- Firmware or simulator (legacy note): “I need a break” / “I need help” from Sprout could later be sent over the mesh (Whale Channel) so the device is the source of the signal.
- Keep naming aligned: **NODE ONE** = hardware device, **node one** = human (Bash).

### 4. Docs and memory bank

- Done: `p31-core/memory/progress.md` and `ui/README_SCOPE_AND_DEMO.md` (how to run unified demo + Scope in one day).

### 5. Scope dashboard polish (Tasks / Health / Projects) — done 2026-02-16

- **Tasks view:** Real content — Buffer triage (voltage 0–10), today’s list placeholder, accommodation log blurb. Flow: Capture → Triage → Pass/Hold/Critical → Accommodation log.
- **Health view:** Energy (Sparks, ground threshold 3.5), medication (Calcitriol, Calcium, Vyvanse, Magnesium, 4h gap), Rest Protocol callout. No kid data.
- **Projects view:** P31 Stack cards — P31 Compass, P31 Hearth, P31 Greenhouse, P31 Studio, P31 Sync — with roles from the Codex.
- **Home quick actions:** Tasks → Communication, Health → Archives, Projects → Project A (navigate to correct section).

### 6. Scope ↔ Buffer live data — done 2026-02-16

- **buffer.service.ts:** Added `processMessage(text)`, `getHistory(params)`, `getAccommodationLog()` for P31 Shelter backend (POST /process, GET /history, GET /accommodation-log).
- **useScopeBufferData hook:** Fetches health, today's message history, and accommodation-log status; exposes `connected`, `messages`, `accommodationLogAvailable`, `refetch`.
- **ScopeDashboard Tasks:** Shows Buffer connected/not connected, today's triaged messages (voltage + Pass/Held), accommodation log blurb (or "Coming soon" when backend returns 501).
- **ScopeDashboard Health:** Shows "Buffer live · N triaged today" when Buffer is connected.

---

## Principles (don’t forget)

- **Kids first.** No scary words; no kid names in UI; no logging of kid data without consent.
- **P31 naming:** P31 Compass, P31 Buffer, P31 Shelter, P31 Sprout, P31 NodeZero, etc. No legacy names in new code.
- **Banned words:** no deploy → launch; no kill/lockdown/tactical; use shelter/field/protect, not defense/attack.
- **prefers-reduced-motion** must disable or drastically reduce animation everywhere.

---

*The mesh holds. Keep building. 🔺*
