# P31 CODEBASE AUDIT — FOR CURSOR
## "Wipe the canvas. Retain the knowledge."

**Date:** 2026-02-16  
**Directive:** Inventory only. No fixes, no renames, no builds.  
**Identity guards:** Operator = Will. Children = Bash (S.J., older), Willow (W.J., younger). No full names, case numbers, or opposing party in output.

---

# DELIVERABLE 1 — THE INVENTORY

Repo/folder classification. Last-modified dates are inferred from context (git status, docs); exact timestamps not re-crawled this run.

---

## Workspace roots (what you have access to)

| REPO/FOLDER | LAST MODIFIED | STATUS | LANGUAGE | WHAT IT DOES | WHAT WORKS | WHAT'S BROKEN | NAMING ERA | VERDICT |
|-------------|---------------|--------|----------|--------------|------------|---------------|------------|---------|
| **p31** (root) | — | 🟢 ACTIVE | JS/TS, MD, C/C++, HTML | Monorepo root: workspaces SUPER-CENTAUR, ui, cognitive-shield, website, organized/*. P31 identity, docs, firmware, donation-wallet, sovereign-agent-core, many legacy folders. | Root `npm run dev` scripts; install:all, build, test; docs/setup; INVENTORY_AND_DEPS.md. | Clone path in README still "phenix-navigator-creator67"; many duplicate/legacy folders; no single p31-core folder found (P31 Core may live in memory-bank/codex or as today's doc). | Mixed (P31 + Phenix + legacy) | KEEP — consolidate into clean monorepo |
| **p31/SUPER-CENTAUR** | — | 🟢 ACTIVE | TypeScript, Node, Express | P31 Tandem backend: 80+ routes, Buffer client, DataStore, engine (P31 Language, L.O.V.E., game), legal/medical/blockchain/security/monitoring/quantum-brain/family. | `npm run dev`, build (tsc \|\| exit 0), tests (engine, legal, medical, security, monitoring, cognitive-prosthetics). CLAUDE.md: 75% complete. | 451 TS errors (noUncheckedIndexedAccess); Centaur BufferClient API ≠ Buffer server API; 29 unused deps noted. | P31 (name), some "deploy" in code | MERGE → apps/ or backend/ in clean arch |
| **p31/ui** | — | 🟢 ACTIVE | React 18, TypeScript, Vite, Tailwind, Three/R3F, Zustand | The Scope: dashboard, tetrahedron nodes, engine (voltage, spoon, shield), bridge to Buffer + Centaur + Node One. | `npm run dev`, build (with type warnings), tests; centaur.service (3000), buffer.service (4000), useGameEngine. | ~400+ type errors (GOD_CONFIG, stores, HeartbeatPanel, etc.); cross-repo requires to SUPER-CENTAUR (useGameEngine, ToolsForLifeProvider, IMPORT_REWRITE_MAP.json). | P31 | MERGE → apps/scope/ |
| **p31/cognitive-shield** | — | 🟢 ACTIVE | TypeScript, Express, better-sqlite3, ioredis, ws | P31 Shelter: voltage/pattern/triage engine, POST /process, /history, /accommodation-log, /health; CentaurClient forwards to Centaur. | Builds (tsc), vitest; engine well-tested; false-positive rules. | Port inconsistency (3000 in startServer vs 4000 in docs/tests); API shape ≠ Centaur BufferClient. | Mixed (repo name "cognitive-shield", docs reference P31 Shelter) | MERGE → apps/shelter/ |
| **p31/website** | — | 🟢 ACTIVE | Static HTML/CSS/JS | phosphorus31.org: landing, stack, docs, roadmap, about, donate, blog, games, education, legal, node-one, wallet. | index.html, styles, CNAME, _redirects, vercel.json, sitemap; `npx serve . -l 8000`. | DEPLOY_NOW.md says "deploy" (naming); repo path in docs "phenix-navigator-creator67"; not confirmed live at phosphorus31.org. | P31 (content); deploy in filenames | MERGE → apps/web/ |
| **p31/node-zero** | — | 🟡 STALE | Next.js, React, Three, Zustand | "P31 Node Zero - The Operator's Base System" — Next app. | package.json present. | Relationship to ui/ and firmware unclear; may duplicate Scope. | P31 | MERGE or ARCHIVE after clarity |
| **p31/bridge** | — | 🟠 HISTORICAL | TS (stub) | Bridge package; no dev server. | Script only. | Minimal; role in current stack unclear. | — | ARCHIVE or DELETE |
| **p31/firmware/node-one-esp-idf** | — | 🟢 ACTIVE | C/C++, ESP-IDF v5.x | ESP32-S3 (Touch-LCD-3.5B): BSP, LoRa (E22), MCP23017, LVGL, WiFi AP + HTTP + WebSocket. | SWARM 08 complete; BUILD_AND_TEST.ps1, QUICK_START_BUILD.md. | Hardware-dependent; multiple board variants in tree (3.5B canonical). | P31 naming audit docs present | MERGE → firmware/node-zero/ |
| **p31/donation-wallet** (inside p31) | — | 🟡 STALE | — | Docs + possibly legacy wallet code inside p31. | docs/donation-wallet.md; IMPLEMENTATION_GUIDE, README (19 Phenix/Genesis refs). | Separate from phenix-donation-wallet-v2; duplication. | Phenix, Genesis Gate | MERGE docs; ARCHIVE or DELETE duplicate code |
| **p31/sovereign-agent-core** | — | 🟡 STALE | Mixed | Packages: genesis-gate, phenix-navigator, cognitive-shield; firmware phenix-phantom (ESP-IDF). | genesis-gate package.json (0.1.0); phenix-navigator, cognitive-shield subpackages. | Old naming; likely superseded by root ui + cognitive-shield + firmware/node-one-esp-idf. | Phenix, Genesis | ARCHIVE after migration |
| **p31/genesis-gate** (GENESIS_GATE_APPS_SCRIPT) | — | 🟡 STALE | Google Apps Script (.gs) | Mirror of GENESIS_GATE for cloud: LoveEconomy, SpoonsManager, Mesh, World, Cortex, Agent, Bridge (PhenixBridge.gs), UI. | README describes structure; .gs files in repo. | Naming (Genesis Gate → P31 Entangle); PhenixBridge.gs. | SIMPLEX/Phenix/Genesis | ARCHIVE or rename to p31-entangle-apps-script |
| **p31/wonky-sprout** | — | 🟠 HISTORICAL | — | Legacy. | — | Wonky Sprout → P31 Sprout per naming. | Wonky Sprout | ARCHIVE |
| **p31/phenix-navigator-creator** | — | 🟠 HISTORICAL | — | Legacy creator app. | ECONOMY_IMPLEMENTATION.md. | Phenix naming. | Phenix | ARCHIVE |
| **p31/dashboard** | — | 🟡 STALE | — | Dashboard package in root. | package.json. | Overlap with ui (Scope). | — | MERGE into ui or ARCHIVE |
| **p31/backend** | — | 🔴 ORPHAN | — | Not found at root (README references; actual backend is SUPER-CENTAUR). | — | — | — | N/A (use SUPER-CENTAUR) |
| **cognitive-shield** (standalone repo) | — | 🟢 ACTIVE | Same as p31/cognitive-shield | Same product: P31 Shelter / Buffer. | Builds, tests. | If same code as p31/cognitive-shield, duplicate workspace. | Mixed | KEEP one; merge into p31 or treat as canonical copy |
| **phenix-donation-wallet-v2** | — | 🟢 ACTIVE | JS (Chrome MV3), HTML, C++ (firmware .ino) | Donation wallet: ERC-5564 stealth, WebUSB/ESP32-S3 signing, memo-to-file, vault (AES-GCM). | donation-wallet-v2: README, lib (stealth, vault, webusb, memo, rpc), pages (donate-portal, settings, memo-log), firmware. | README "Initialize Genesis Gate" (naming); repo/folder name "phenix-". | Phenix, Genesis Gate | MERGE → apps/ or standalone; rename to P31 Entangle/donation |
| **sovereign-life-os** | — | 🟢 ACTIVE | YAML, shell, MD | 72 self-hosted tools (Docker): health, finance, legal, education, tasks, comms, food, mental-health, smart-home, data, family, assistive, creative, emergency, infrastructure. | README, docker-compose per service, scripts (start, stop, status), docs (BACKUP, SECURITY, MONITORING). | README: "Phenix Navigator ecosystem"; "Phenix Navigator · The Geodesic Operator". | Phenix | KEEP; rename refs to P31 Compass / P31 |
| **human_os** | — | 🟡 STALE | Same as sovereign-life-os | Appears to contain sovereign-life-os (nested). | Same file list pattern. | Possible duplicate or symlink of sovereign-life-os. | — | DEDUPE with sovereign-life-os |
| **lasater-os_1** | — | — | — | Not fully enumerated (timeout). | — | — | — | INVENTORY when accessible |

---

## Not in local workspace (acknowledged)

- **SIMPLEX_v6_Master_Source** — Google Apps Script. Not in repo; lives in Google Drive. Cannot audit contents. **I don't know** if it's running or what it does; Oracle report referenced "P31 Entangle v6 is LIVE" and daily briefing emails.
- **phosphorus31.org** — Domain. Website files are in `p31/website/`. Whether the domain is pointed at a live deployment is **unknown** (no access to DNS/Cloudflare).
- **abdicate.sh** — Referenced in Oracle report and P31 Bible as key-release mechanism. **Not found** in p31 tree (grep timed out; previous audit: "physical file unlocated"). Phantom reference.
- **P31 Core (today's build)** — Referenced in your directive as "clean-slate living architecture" and "four AI shards aggregated into The Scope v1.0". No folder named `p31-core` found. Interpreted as the kernel (identity, memory, mission, protocol) — may live in `memory-bank/`, `codex/`, or root README + AGENTS.md. Not duplicated here.

---

# DELIVERABLE 2 — THE MAP

## Dependency graph (what talks to what)

```
GAS Scope (external)
  └── no in-repo dependency

Buffer (cognitive-shield)
  ├── Optional: SQLite (dbPath), Redis
  └── CentaurClient → POST to CENTAUR_API_URL /api/messages (default localhost:3000)

Centaur (SUPER-CENTAUR)
  ├── BufferClient → BUFFER_URL (default 4000) — expects /api/messages, /api/queue/status, /api/ping/status
  ├── Buffer server actually exposes: /process, /history, /health, /accommodation-log
  ├── API shape mismatch: Centaur cannot use BufferClient against current Buffer without adapter
  ├── DataStore (in-memory, SQLite), optional PostgreSQL, Redis, OpenAI, Neo4j, Google
  └── Receives: Buffer → Centaur (POST /api/messages) works

Scope (ui/)
  ├── Buffer: VITE_BUFFER_URL (default 4000), VITE_BUFFER_WS_URL (ws)
  ├── Centaur: VITE_CENTAUR_API_URL (default 3000) — health, messages, spoons
  ├── Node One: ApiClient baseUrl (e.g. 8080)
  └── Phantom/cross-workspace: require('../../../SUPER-CENTAUR/src/engine/core/GameEngine'), ToolsForLifeManager, AssistiveTechnologyManager (invalid cross-repo imports; must refactor)

Node One (firmware)
  ├── WiFi AP + HTTP server; optional SPIFFS (Scope build:spiffs)
  └── LoRa mesh independent

Donation wallet (phenix-donation-wallet-v2)
  └── No dependency on Buffer/Centaur/Scope in repo
```

## Single points of failure

- **Centaur** — If it goes down, Scope (React) has no health/messages/spoons; Buffer can still process but forwarding to Centaur fails.
- **Buffer** — If it goes down, Scope cannot get voltage/process; Centaur does not get message stream from Buffer.
- **Port alignment** — Buffer code 3000 vs docs 4000; Centaur and Scope expect Buffer at 4000. Misconfiguration breaks integration.

## Circular dependencies

- **ui → SUPER-CENTAUR** (source): `useGameEngine.ts` requires GameEngine from SUPER-CENTAUR; `ToolsForLifeProvider.tsx` imports ToolsForLifeManager from SUPER-CENTAUR. This is a **monorepo-internal** dependency but implemented as relative path into sibling package; should be workspace package or shared package, not relative path.

## Dead / phantom references

- **abdicate.sh** — Referenced in docs; file not located in tree.
- **release.sh** — P31 naming replacement for abdicate.sh; not confirmed present.
- **Centaur BufferClient** — Expects routes Buffer does not expose; effectively dead unless Buffer adds compatibility or adapter exists.

---

# DELIVERABLE 3 — THE PLAN

## Proposed clean architecture (rebuild, don’t stack)

```
p31/
├── README.md                    ← Root kernel (from P31 Core / current README + AGENTS.md)
├── p31-core/                    ← Identity, Memory, Mission, Protocol (today's build — migrate from memory-bank/codex if exists)
├── apps/
│   ├── entangle/                ← Genesis Gate / GAS mirror → P31 Entangle (quantum viz, sync); GENESIS_GATE_APPS_SCRIPT + sovereign-agent-core/packages/genesis-gate
│   ├── shelter/                 ← cognitive-shield → P31 Shelter (communication buffer)
│   ├── scope/                   ← ui → The Scope (cognitive dashboard)
│   └── web/                     ← website → phosphorus31.org (static)
├── firmware/
│   └── node-zero/               ← node-one-esp-idf + ESP32-S3 variants; phenix_wallet_webusb.ino for donation wallet hardware
├── packages/
│   ├── store/                   ← Shared Zustand state (extract from ui/ or SUPER-CENTAUR where shared)
│   ├── ui/                      ← Shared UI components (if any cross-app)
│   └── protocol/                ← Tetrahedron Protocol, P31 Language, L.O.V.E. (extract from SUPER-CENTAUR engine)
├── scripts/
│   ├── health-check.sh          ← System health diagnostic (Buffer, Centaur, Scope ports)
│   └── apps-script/             ← SIMPLEX v6 → P31 Nexus (exported .gs if/when available; no Google access)
├── publications/                ← Defensive publications (markdown)
├── docs/                        ← Architecture, swarm directives, setup
└── _archive/                    ← Everything that is MERGE then delete, or ARCHIVE
    ├── phenix-navigator-creator/
    ├── wonky-sprout/
    ├── sovereign-agent-core/     (after migrating genesis-gate, phenix-navigator, cognitive-shield)
    ├── donation-wallet/          (inside p31; keep phenix-donation-wallet-v2 as source for apps/donation or standalone)
    ├── bridge/
    ├── dashboard/                (if merged into scope)
    └── node-zero/               (if merged into scope or deprecated)
```

## Migration table

| Directory | Existing code migrates in | Rewrite from clean | Archive (_archive/) | Delete |
|-----------|---------------------------|--------------------|---------------------|--------|
| **p31-core** | memory-bank/, codex/, root README, AGENTS.md | If none: create from P31 Core doc | — | — |
| **apps/entangle** | GENESIS_GATE_APPS_SCRIPT (.gs), sovereign-agent-core/packages/genesis-gate | — | After copy | — |
| **apps/shelter** | cognitive-shield (full tree) | — | — | — |
| **apps/scope** | ui (full tree) | Fix cross-repo imports (GameEngine, ToolsForLife, AssistiveTech as package or in protocol/) | — | — |
| **apps/web** | website (full tree) | — | — | — |
| **firmware/node-zero** | firmware/node-one-esp-idf; donation wallet .ino from phenix-donation-wallet-v2/firmware | — | Other ESP variants if redundant | — |
| **packages/store** | Extract from ui + Centaur where shared | — | — | — |
| **packages/protocol** | SUPER-CENTAUR engine (P31 Language, L.O.V.E., tetrahedron), types | — | — | — |
| **scripts** | — | health-check.sh (ports 3000, 4000, 5173) | — | — |
| **Donation wallet** | phenix-donation-wallet-v2/donation-wallet-v2 → apps/donation or keep standalone repo | Rename "Genesis Gate" → "P31 Entangle" in UI/copy | — | — |

## What gets archived (moved to _archive/)

- phenix-navigator-creator, wonky-sprout, bridge (stub), dashboard (if merged into scope), duplicate donation-wallet inside p31, sovereign-agent-core after extracting genesis-gate/phenix-navigator/cognitive-shield into apps.

## What gets deleted

- Nothing in this phase (audit only). Deletion only after you confirm post-migration.

---

# PHASE 5 — HEALTH CHECK ANSWERS

1. **Can the website (phosphorus31.org) be deployed RIGHT NOW? What's blocking it?**  
   **Yes, in principle.** The `website/` folder is static (HTML/CSS/JS), has CNAME, _redirects, vercel.json, and DEPLOY_NOW.md (Cloudflare Pages steps). **Blocking:** (a) Repo must be connected to Cloudflare Pages (or Vercel) and build set to "no build" / output = root; (b) Domain phosphorus31.org must point at that deployment; (c) Docs still reference "phenix-navigator-creator67" and "deploy" — naming only, not technical blockers.

2. **Can P31 Entangle (Genesis Gate) run RIGHT NOW? What's the minimal viable demo?**  
   **Local/exported:** GENESIS_GATE_APPS_SCRIPT has .gs structure and README; if .gs files are in repo, a minimal demo is "run in Apps Script editor" (no local run). sovereign-agent-core/packages/genesis-gate has only package.json (0.1.0) — no runnable app. **Minimal viable demo:** Either (1) GAS project deployed and shared (link + instructions), or (2) a minimal local HTML/JS page that implements one Entangle concept (e.g. quantum viz or sync) using existing engine code from SUPER-CENTAUR. I don't have access to SIMPLEX v6 in Google to say if *that* runs.

3. **Is the Google Apps Script (SIMPLEX v6) actually doing anything useful? Or is it legacy machinery running on empty?**  
   **I don't know.** It is not in the repos I can see. The Oracle report said "P31 Entangle v6 is LIVE" and "daily briefing emails" — so something in Google is running. To know if it's useful vs legacy: you’d need to confirm (1) which triggers run (time-driven, manual), (2) what data they read (Sheets, Drive, Gmail), (3) what they write (briefing email, logs). That’s in Google; I can’t inspect it.

4. **What's the single most valuable piece of code in the entire codebase?**  
   **The Buffer engine (cognitive-shield): voltage + pattern + triage + accommodation log.** It’s the only component that directly encodes the assistive mission (message voltage, hold/release, ADA evidence), is well-tested, and has clear boundaries. Second: **SUPER-CENTAUR engine** (P31 Language, L.O.V.E. economy, tetrahedron/game logic) — valuable but tangled with 451 TS errors and large surface area; the **game engine + P31 Language** subset is the next-most valuable.

5. **What's the single biggest mess?**  
   **The Scope (ui/) cross-workspace imports and type debt.** ui/ requires SUPER-CENTAUR source via relative paths (GameEngine, ToolsForLifeManager, AssistiveTechnologyManager); BUILD uses `|| exit 0` and ~400 type errors; GOD_CONFIG/store mismatches. That makes the "dashboard" brittle and blocks clean package boundaries. **Nuke from orbit** = extract shared engine/protocol into `packages/protocol`, refactor ui to consume it as a package, fix types (or isolate with strict boundaries), then delete the relative-path imports into SUPER-CENTAUR.

---

# NAMING AUDIT (COUNTS — NOT FIXED)

- **Total .md files with naming violations (SIMPLEX | Wonky Sprout | Phenix Navigator | Genesis Gate | Cognitive Shield | Phenix):** ~55+ unique files in p31 (grep returned file list, not full count).
- **By era (approximate):** SIMPLEX: low (few explicit "SIMPLEX" in .md); Wonky Sprout: 1+ (wonky-sprout folder, LEGACY_NAMING_ARCHIVE); Phenix: 30+; Genesis Gate: 10+; Cognitive Shield: 10+ (file names and docs).
- **phenix-donation-wallet-v2:** README "Initialize Genesis Gate"; HOUSEKEEPING_LOG "Phenix".
- **sovereign-life-os:** README "Phenix Navigator ecosystem", "Phenix Navigator · The Geodesic Operator".
- **deploy (as verb):** website has DEPLOY_NOW.md, DEPLOY_*.md, DEPLOY_*.ps1 — **flag for rename to LAUNCH_***.
- **SUPER-CENTAUR .ts:** deploy/kill/terminate — 9 files (blockchain, cli, engine, core server, etc.); **flag for review** (deploy→launch, kill/terminate→release/end).
- **Files requiring rename:** Dozens (folder names phenix-navigator-creator, wonky-sprout, GENESIS_GATE_APPS_SCRIPT; filenames DEPLOY_*, etc.).
- **Variables/functions requiring rename:** Not fully enumerated (audit only). At least: any "deploy", "kill", "terminate" in SUPER-CENTAUR and ui.

---

# TETRAHEDRON TEST (FLAGS ONLY)

- **Technical:** Buffer and engine work; Centaur runs with TS errors; Scope runs with cross-repo imports and type errors; API mismatch Centaur ↔ Buffer. **Legal:** SUBMISSION_PACKAGE and court-related paths exist under SUPER-CENTAUR — ensure no case numbers/PII in committed files (not verified in this audit). **Medical:** Buffer and engine serve assistive mission; medication/spoon tracking in GAS Scope (external). **OPSEC:** No keys/secrets in files read; .env.example only. Recommend: scan for secrets before any public push.

---

*Audit complete. Don't build. Don't fix. Don't rename. Regroup with Claude and Gemini; triangulate; then build from clean.*

🔺
