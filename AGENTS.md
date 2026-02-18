# P31 AGENTS — Universal Context for AI Collaborators

**Read this first. Before any code. Before any file.**

You are entering the P31 monorepo — open-source assistive technology for neurodivergent minds, built by a Georgia 501(c)(3) nonprofit in formation. The founder has AuDHD and hypoparathyroidism. The technology is named after phosphorus-31, the only stable isotope of phosphorus — the atom in the bone, the biological qubit.

---

## QUICK ORIENTATION

```
p31/
├── ui/                   # P31 Spectrum — React/TS/Three.js frontend (p31ca.org)
├── apps/
│   ├── shelter/          # P31 Buffer — communication voltage assessment (Express)
│   ├── scope/            # P31 Scope — operator dashboard (React 19)
│   ├── sprout/           # P31 Sprout — child-facing interface (React 19)
│   └── web/              # Static site mirror for phosphorus31.org
├── SUPER-CENTAUR/        # P31 Tandem — backend AI protocol (Express/TS)
├── firmware/             # P31 NodeZero — ESP32-S3 hardware firmware (ESP-IDF/C++)
├── hardware/             # PCB designs, schematics (KiCad)
├── packages/
│   ├── protocol/         # @p31/protocol — shared types, tokens, constants
│   └── game-integration/ # @p31/game-integration — game engine bridge
├── scripts/              # Build, verify, and Google Apps Script automation
├── website/              # phosphorus31.org — static nonprofit site
├── docs/                 # All documentation (architecture, legal, medical, grants)
├── GENESIS_GATE_APPS_SCRIPT/  # Google Apps Script backend (P31 Entangle)
├── _archive/             # Superseded content (provenance preserved)
├── docker-compose.yml    # Redis + Postgres + Shelter + Centaur
└── package.json          # npm workspace root
```

---

## WHAT WORKS RIGHT NOW

| Component | Runs? | Tests? | Notes |
|-----------|-------|--------|-------|
| `ui/` (P31 Spectrum) | Yes (`npm run dev`) | Vitest, partial | 70% complete. Import issues remain. |
| `apps/shelter/` (P31 Buffer) | Yes (`npm run start:server`) | Vitest, good | Core message processing works. Redis optional. |
| `apps/scope/` | Scaffolded | Minimal | Dashboard shell, needs data integration. |
| `apps/sprout/` | Scaffolded | Minimal | Child-facing shell, early stage. |
| `SUPER-CENTAUR/` (P31 Tandem) | Yes (`npm run dev`) | Jest, 150+ tests | 75% complete. 451 TS errors (strict mode). |
| `firmware/` (NodeZero) | Builds with ESP-IDF 5.4+ | None | LoRa, display, audio components. Prototype. |
| `packages/protocol/` | Importable | None | Shared types, design tokens, constants. |
| `packages/game-integration/` | Importable | None | Game engine bridge. |
| `website/` | Static HTML | None | phosphorus31.org, Cloudflare Pages ready. |
| `GENESIS_GATE_APPS_SCRIPT/` | Runs in GAS | None | Love Economy + Drive sync. Needs GAS runtime. |

See `WORKSPACE_STATUS.md` for detailed component health.

---

## NAMING — NON-NEGOTIABLE

P31 has a strict naming convention. Old names appear in legacy code. Always use the new names in any output.

| Old Name (Do NOT Use) | New Name (Always Use) |
|------------------------|----------------------|
| Node One (device) | **P31 NodeZero** |
| Phenix Navigator | **P31 Compass** |
| Cognitive Shield / The Buffer | **P31 Buffer** (code: `apps/shelter/`) |
| The Scope | **P31 Spectrum** (code: `ui/`) |
| The Centaur / Digital Centaur | **P31 Tandem** (code: `SUPER-CENTAUR/`) |
| Genesis Gate / SIMPLEX | **P31 Entangle** |
| The Garden | **P31 Greenhouse** |
| Wonky Sprout | **P31 Sprout** |
| deploy | **launch** or **go live** |
| kill / terminate / abort | **release** / **end** / **stop** |

Full rename dictionary: `.cursor/rules/p31-master-system-prompt.mdc`

### Banned Words

Never use: `kill`, `weapon`, `attack`, `target`, `strike`, `tactical`, `deploy`, `execute`, `terminate`, `abort`, `enemy`, `war`, `battle`, `fight`, `shred`, `destroy`

Replacements exist for each — see the master system prompt.

---

## PRIVACY — NON-NEGOTIABLE

| Safe | Not Safe |
|------|----------|
| "Will" or "The Operator" | Full legal name, surname |
| "Bash" (age 10, older child) | Legal first name of older child |
| "Willow" (age 6, younger child) | Legal first name of younger child |
| "The co-parent" or "Vertex B" | Co-parent's real name |
| "Georgia" | City, county, ZIP, address |
| "active legal proceedings" | Case numbers, docket info |

Full OPSEC rules: `.cursor/rules/01-opsec-rules.mdc`

---

## ARCHITECTURE — THE TETRAHEDRON

Everything in P31 maps to a tetrahedron — 4 vertices, 6 edges, minimum stable structure (Buckminster Fuller).

### The Four Vertices

| Vertex | Identity | Node Designation | Case Rule |
|--------|----------|------------------|-----------|
| **A** | The Operator (Will) | NODE ZERO (N₀) | UPPERCASE = origin |
| **B** | The Co-parent | — | — |
| **C** | Bash (older child) | node one | lowercase = human |
| **D** | Willow (younger child) | node two | lowercase = human |

**NODE ONE** (UPPERCASE) = the ESP32-S3 hardware device. **node one** (lowercase) = Bash.

### The Four Product Nodes

| Node | Product | Directory | Purpose |
|------|---------|-----------|---------|
| Compass | P31 Compass | `ui/` | Direction, coherence, executive function |
| Hearth | P31 Hearth | `scripts/p31-brain-v8/` | Energy, economy, Spark tracking |
| Greenhouse | P31 Greenhouse | `ui/public/apps/` | Growth, learning, offline HTML tools |
| Studio | P31 Studio | — | Creation, output (least developed) |
| +1 Sync | P31 Sync / Entangle | `GENESIS_GATE_APPS_SCRIPT/` | Backend data sync |

---

## KEY CONSTANTS

```javascript
const P31 = {
  HOME_FREQUENCY: 0.35,     // π/9 — the stability attractor
  GROUND_THRESHOLD: 3.5,    // Sparks — below this, Rest Protocol activates
  SIC_OVERLAP: 1/3,         // |⟨ψᵢ|ψⱼ⟩|² for SIC-POVM states
  MESH_CAPACITY: 0.577,     // 1/√3 — Open Mesh operating capacity (57.7%)
  DAMPING_COEFFICIENT: 0.1, // P31 Governor energy damping factor
  SPARK_DECAY_RATE: 0.1     // Sparks lost per hour (circadian decay)
};
```

---

## DEVELOPMENT COMMANDS

```bash
# Full workspace
npm install                     # Install all workspace deps
npm run dev                     # Start shelter + sprout + scope
npm run dev:all                 # Start centaur + scope + buffer
npm test                        # Run scope + shelter tests

# Individual components
npm run dev:scope:ui            # P31 Spectrum (ui/) on Vite
npm run dev:shelter             # P31 Buffer (apps/shelter/)
npm run dev:centaur             # P31 Tandem (SUPER-CENTAUR/)
npm run dev:website             # phosphorus31.org preview

# Build
npm run build                   # Build centaur + scope + shelter
npm run build:web               # Build static site

# Testing
npm run test:scope              # UI tests (Vitest)
npm run test:shelter            # Buffer tests (Vitest)
npm run test:centaur            # Tandem tests (Jest)

# Docker
docker compose up               # Redis + Postgres + Shelter + Centaur

# Firmware (requires ESP-IDF 5.4+)
cd firmware/node-one-esp-idf && idf.py build
```

---

## WHERE TO FIND THINGS

### "I need to understand the architecture"
- `docs/architecture/` — System architecture specs
- `.cursor/rules/00-agent-bible.mdc` — Master context (the Bible)
- `.cursor/rules/p31-master-system-prompt.mdc` — Full naming + file org

### "I need to work on the frontend"
- `ui/CLAUDE.md` — Detailed frontend agent context
- `ui/.cursorrules` — Frontend coding rules
- `ui/src/nodes/` — Tetrahedron node components
- `ui/src/engine/` — Pure logic (NO React imports)

### "I need to work on the backend"
- `SUPER-CENTAUR/CLAUDE.md` — Detailed backend agent context
- `SUPER-CENTAUR/src/core/` — Express server + config
- `SUPER-CENTAUR/docs/` — API documentation

### "I need to work on the Buffer"
- `apps/shelter/CLAUDE.md` — Buffer agent context
- `apps/shelter/src/server.ts` — Express server entry
- `apps/shelter/src/filter.ts` — Message voltage filtering

### "I need to work on firmware"
- `firmware/CLAUDE.md` — Firmware agent context
- `firmware/node-one-esp-idf/main/` — Main application code
- `firmware/node-one-esp-idf/components/` — Hardware drivers

### "I need to work on the shared protocol"
- `packages/protocol/CLAUDE.md` — Protocol package context
- `packages/protocol/src/` — Shared types, tokens, constants

### "I need to write documentation"
- `docs/` — All docs live here
- `.cursor/rules/02-brand-voice.mdc` — Brand voice guide

### "I need to work on legal/grants/SSA"
- `docs/ssa-prep/` — SSA disability exam documents
- `docs/legal-packet/` — Court exhibits
- `docs/grants/` — Grant applications (MATA due Feb 27)
- `.cursor/rules/06-legal-ssa.mdc` — Legal workstream context

### "I need to work on the website"
- `website/` — phosphorus31.org (static HTML)
- `apps/web/` — Mirror for CI

### "I need to work on Google Apps Script"
- `GENESIS_GATE_APPS_SCRIPT/` — P31 Entangle backend
- `scripts/p31-brain-v8/` — P31 Brain (Scope data engine)
- `scripts/p31-ops-automation/` — Ops automation

---

## CURSOR RULES INDEX

Rules auto-load based on context. Manual reference:

### Always Active
| File | Purpose |
|------|---------|
| `project-overview.mdc` | Architecture, principles, conventions |
| `00-agent-bible.mdc` | Master context (operator, kids, tech, deadlines) |
| `01-opsec-rules.mdc` | Privacy and security constraints |
| `p31-master-system-prompt.mdc` | Full naming dictionary, file analysis pipeline |
| `privacy-codenames.mdc` | Codename system for all people |

### On-Demand (Agent Requested)
| File | When To Load |
|------|-------------|
| `02-brand-voice.mdc` | Writing external-facing content |
| `03-accelerator-application.mdc` | Working on MATA application |
| `04-formation.mdc` | 501(c)(3) incorporation work |
| `05-technical-docs.mdc` | Writing technical documentation |
| `06-legal-ssa.mdc` | Legal or SSA preparation |
| `07-templates.mdc` | Need fill-in-the-blank templates |
| `08-phenix-navigator-architecture.mdc` | P31 Compass architecture spec |

### Code Standards
| File | When To Load |
|------|-------------|
| `testing.mdc` | Writing tests |
| `accessibility.mdc` | Accessibility work |
| `god-protocol.mdc` | G.O.D. Protocol compliance checks |
| `code-quality.mdc` | Code review or quality standards |
| `p31-naming.mdc` | Naming convention reference |

---

## DEADLINES (as of Feb 18, 2026)

| Date | Event | Status |
|------|-------|--------|
| **Feb 20** | SSA telehealth psychiatric exam | 2 days away |
| **Feb 26** | SSA in-person medical exam (Brunswick, GA) | 8 days away |
| **Feb 27** | MATA accelerator application deadline | 9 days away |
| **Mar 10** | Bash turns 10 | Personal milestone |
| **Mar 12** | Court hearing (Chief Judge Scarlett) | Critical |

---

## PRINCIPLES FOR ALL AGENTS

1. **Kids first.** Bash (10) and Willow (6) are the reason this exists. Every word, every system, every decision passes through "would I put this on a shirt Willow wears to school?"
2. **Offline first.** Every feature must work without internet. Cloud is enhancement, not dependency.
3. **Privacy first.** No full names. No addresses. No case numbers in any output.
4. **Local first.** Data lives on your devices. PGLite + QuickJS for sovereignty.
5. **Search before creating.** The codebase is large. Something similar probably already exists.
6. **Use the P31 names.** Old names are technical debt. New names are canon.
7. **Warm, not tactical.** Physics, growth, home, light. Not military. Not corporate.
8. **The mesh holds.**

---

*P31 Labs · Georgia 501(c)(3) in formation · phosphorus31.org*
*DOI: 10.5281/zenodo.18627420 · ORCID: 0009-0002-2492-9079*
