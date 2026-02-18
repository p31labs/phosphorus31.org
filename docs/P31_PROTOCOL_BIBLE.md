# P31 PROTOCOL BIBLE
## The Single Source of Truth
### Version 2.0 — February 18, 2026

This document is canonical. Gemini, Cursor, Claude, DeepSeek, and every future agent references this file. If a directive in any agent's alignment doc conflicts with this file, this file wins.

---

## IDENTITY

| Field | Value |
|-------|-------|
| Organization | P31 Labs |
| Legal entity | Georgia 501(c)(3) nonprofit (in formation) |
| Operator | William Rodger Johnson (Will), age 40 |
| Role | Founder & CEO |
| Location | Southeast Georgia |
| Email | will@p31ca.org |
| Domains | phosphorus31.org (corporate), p31ca.org (technical) |
| Website | **phosphorus31.org** — live (phosphorus31-org.pages.dev), grant-ready. Founder bio correct (DoD civilian), ORCID, Zenodo, GitHub, Substack linked. |
| Fiscal sponsor | **Hack Club HCB** (The Hack Foundation, EIN 81-2908499). Application 4XDUXX submitted Feb 2026, under review (~2-week response). If approved: tax-deductible donations under HCB EIN, 7% fee, all-inclusive. |
| GitHub | github.com/p31labs, github.com/trimtab-signal |
| ORCID | 0009-0002-2492-9079 |
| Zenodo DOI | 10.5281/zenodo.18627420 |
| Substack | thegeodesicself.substack.com |

**Will is a former DoD CIVILIAN submarine electrician (16 years). NOT a veteran. NOT Navy. Civilian federal employee. This distinction is legally and personally critical.**

---

## PRODUCT LINE

| Product | Type | Description | Status |
|---------|------|-------------|--------|
| **The Buffer** | Software | Voltage-gated communication bridge for neurodivergent users | **V1 SHIPPED Feb 18, 2026** — PWA + Chrome extension + Workers API. Tag: v1.0.0-buffer |
| **Node One** | Hardware | ESP32-S3 + DRV2605L haptics + LoRa (Meshtastic) + BLE | Firmware spec complete, hardware prototyped |
| **The Scope** | Software | Cognitive dashboard, energy tracking, medication management | React components exist, build broken |
| **Ping** | Protocol | Heartbeat/check-in system | Implemented in Buffer |
| **Thick Click** | Hardware | Haptic feedback interaction pattern | DRV2605L effects mapped |
| **The Centaur** | Protocol | Human-AI collaboration framework | This document IS the implementation |
| **Whale Channel** | Software | (In development) | Spec only |
| **GENESIS_GATE** | Automation | Google Apps Script ecosystem (P31 Entangle) | v7 deployed, 15 files, 1,888 lines |
| **Phenix Navigator** | Platform | Umbrella for all hardware/firmware | Architecture defined |

**THE BUFFER IS THE FLAGSHIP. It ships first. Everything else serves it or waits.**

---

## CONSTANTS

These are not suggestions. They are the physics of the system.

```
MARK_1_ATTRACTOR    = π / 9 ≈ 0.349065    // System health target
LARMOR_P31          = 863 Hz               // ³¹P in Earth's field (~50μT)
BREATHE_IN          = 4 seconds
BREATHE_HOLD        = 2 seconds
BREATHE_OUT         = 6 seconds
BREATHE_CYCLE       = 12 seconds
SPOONS_MAX          = 12
GOLDEN_RATIO        = 1.618033988749895    // φ — used in UI proportions
PHOSPHOR_GREEN      = #39FF14              // Primary accent
CALCIUM_WARM        = #ff9f43              // Secondary accent
SIGNAL_BLUE         = #00d4ff              // Tertiary accent
VOID_BG             = #0a0a0f              // Background
```

### Voltage Scoring Formula
```
voltage = (urgency × 0.4) + (emotional × 0.3) + (cognitive × 0.3)
```
Each axis scored 0-10. Composite 0-10.

### Gate Thresholds
```
GREEN:    0 ≤ V < 3     → Normal display
YELLOW:   3 ≤ V < 6     → Summary first, confirm to expand
RED:      6 ≤ V < 8     → Summary only, raw text gated
CRITICAL: 8 ≤ V ≤ 10    → Defer recommended
```

### Spoon Costs
```
readLow:        0.5     (GREEN messages)
readMed:        1.0     (YELLOW messages)
readHigh:       2.0     (RED/CRITICAL messages)
replySimple:    1.0
replyComplex:   3.0
contextSwitch:  1.5
aiRewrite:      0.5
viewOriginal:   1.5
```

### Heartbeat Tiers
```
GREEN:   ≥80% spoons    → NOMINAL (full access)
YELLOW:  ≥50% spoons    → CONSERVATION (cost warnings)
ORANGE:  ≥25% spoons    → DEFENSIVE (auto-queue high-voltage)
RED:     <25% spoons     → DEEP PROCESSING LOCK (input blocked)
```

### Samson V2 PID Controller
```
dH/dt = -k(H - 0.35)

P-term: H > 0.35 + ε  → lower AI temperature (too much chaos)
        H < 0.35 - ε  → raise AI temperature (too rigid)
I-term: voltage history escalating → lower temperature, surface warning
        voltage history looping    → raise temperature, suggest task shift
D-term: spoon depletion velocity critical → throttle load, suggest rest
```

### 3-Register Architecture
```
Register P (Past):     Persistent storage — cached context, session history, user preferences
Register N (Now):      Current message being processed — the active input
Register U (Universe): Active session state — P folded with N, the working context
```

---

## NAMING CONVENTIONS

| Namespace | Pattern | Examples |
|-----------|---------|---------|
| Products | PascalCase, "The [Name]" | The Buffer, The Scope, The Centaur |
| Hardware | PascalCase, descriptive | Node One, Thick Click |
| Files | kebab-case | buffer-core.ts, voltage-scorer.ts |
| Packages | @p31labs/kebab-case | @p31labs/buffer-core |
| React components | PascalCase | VoltageGate, SpoonTracker |
| CSS classes | Tailwind utilities | (no custom CSS classes) |
| Git branches | type/description | feat/chrome-extension, fix/scoring-edge-case |
| Git commits | Conventional Commits | feat: add passive-aggressive detector |
| Environment vars | SCREAMING_SNAKE | P31_API_KEY, GEMINI_API_KEY |

---

## MONOREPO STRUCTURE

```
p31/
├── SUPER-CENTAUR/              → P31 Tandem backend (TypeScript, FastAPI)
├── ui/                         → P31 Spectrum frontend (React/Vite, strict TS)
├── apps/
│   ├── shelter/                → THE BUFFER (React 19 PWA, Zustand, Dexie, Tailwind)
│   ├── sprout/                 → P31 Sprout signals engine
│   ├── scope/                  → Scope dashboard API
│   ├── buffer-extension/       → Chrome MV3 extension (Gmail/Slack voltage badges)
│   ├── buffer-api/             → Cloudflare Workers API (Gemini rewrite, Zod, rate-limit)
│   └── web/                    → Static site mirror
├── packages/
│   ├── protocol/               → Shared protocol types
│   ├── buffer-core/            → Shared scoring library (37 tests, 0 deps)
│   └── game-integration/       → Game engine integration
├── website/                    → phosphorus31.org
├── firmware/                   → ESP32-S3 Node Zero (ESP-IDF)
├── hardware/                   → PCB designs, KiCad schematics, STLs
├── GENESIS_GATE_APPS_SCRIPT/   → P31 Entangle (Google Apps Script)
├── .cursor/rules/              → Swarm rule files (.mdc)
├── god.config.ts               → Single source of truth (runtime)
├── docker-compose.yml          → Container orchestration
├── turbo.json                  → Turborepo config
└── _archive/                   → Emptied (git history preserved)
```

**Branch:** `main` — CLEAN working tree. **v1.0.0-buffer** tagged Feb 18, 2026. 264 files, 5,586 insertions, 51,459 deletions.

---

## TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 19, Vite 6, Tailwind CSS, TypeScript (strict) | Artifacts use inline styles |
| Backend | Hono.js on Cloudflare Workers | apps/buffer-api/ (zero data retention) |
| API | Hono.js on Cloudflare Workers | Target: api.p31labs.org |
| AI Primary | Gemini 2.0 Flash | $0.10/$0.40 per M tokens |
| AI Complex | Claude Sonnet | Fallback for emotional complexity |
| AI Code | DeepSeek | Via Cursor for code generation |
| On-device ML | Transformers.js (DistilBERT) + ONNX Runtime Web | ~67MB cached model |
| Firmware | ESP-IDF 5.4+, C/C++ | ESP32-S3 target |
| BLE | NimBLE | Haptic score transmission |
| Haptics | DRV2605L via I2C | LRA motor |
| Mesh | LoRa (Meshtastic) | Off-grid sovereignty |
| Automation | Google Apps Script | GENESIS_GATE v7 |
| Hosting | Cloudflare Pages (PWA), Workers (API) | $5/mo |
| CI/CD | GitHub Actions | Needs Cloudflare tokens |
| Package manager | pnpm | Workspace protocol |
| Monorepo | Turborepo | turbo.json configured |

---

## DEADLINES

| Date | Event | Priority |
|------|-------|----------|
| **Feb 20** | SSA telehealth psychiatric exam | 🔴 CRITICAL |
| **Feb 26** | SSA in-person medical (Brunswick) | 🔴 CRITICAL |
| ~~Feb 27~~ | ~~MATA accelerator application~~ | ~~HIGH~~ (Buffer shipped before deadline) |
| **Mar 10** | Bash's 10th birthday (MAR10 Day) | 🟡 PERSONAL |
| **Mar 12** | Court hearing (Judge Scarlett) | 🔴 CRITICAL |

---

## HARD CONSTRAINTS (NON-NEGOTIABLE)

1. **NEVER use submarine, naval, or military metaphors.** Christyn's father was Navy. Trigger for the family.
2. **Will is a DoD CIVILIAN, not a veteran.** Every document must say "civilian federal employee" or "DoD civil servant."
3. **No Three.js/WebGL.** Use SVG and Canvas 2D. Constraint is artistic opportunity.
4. **No external fonts in artifacts.** System fonts only. IBM Plex Mono/JetBrains Mono/SF Mono stack.
5. **Privacy first.** On-device scoring by default. Cloud AI only on explicit per-message consent. Zero data retention on API.
6. **Accessibility first.** WCAG 2.2 AA minimum. W3C COGA guidelines. 24×24px touch targets. prefers-reduced-motion. No auto-play.
7. **Open source.** AGPL-3.0 (software), CERN-OHL-W v2 (hardware), CC BY-SA 4.0 (docs).
8. **Action over explanation.** Deliver artifacts, not discussions. If unsure, build it wrong and iterate. Speed > perfection.
9. **The Buffer ships first.** All other work is secondary unless Will explicitly redirects.
10. **Protect the operator.** Identify OPSEC, privacy, and legal risks. Don't publish anything that could harm active litigation.

---

## WORKFLOW PHASES

| Phase | Action | Device | Spoon Cost |
|-------|--------|--------|------------|
| VACUUM | Capture ideas, dispatch agents | Phone (Pixel 9 Pro Fold) | Zero |
| PROCESS | Refine, research, review | Chromebook / Claude | Low |
| INTEGRATE | Build, code, merge | Windows PC / Cursor | High |
| CONVERGE | Archive, persist, publish | Google Workspace | N/A |

When spoons are low, only VACUUM and CONVERGE are permitted. INTEGRATE requires green/yellow heartbeat.

---

## SCIENCE CONFIDENCE LEVELS

Use these when writing about the theoretical framework:

| Level | Language | Examples |
|-------|----------|---------|
| **Established** | "X is/does Y" | ³¹P nuclear spin, Posner molecule structure, PID control theory, WCAG standards |
| **Supported** | "Research suggests X" / "Studies indicate" | Fisher's coherence time estimates, lithium isotope effects, ³¹P-MRS alterations in ADHD/ASD |
| **Novel synthesis** | "We propose X" / "Our architecture draws on" | 3-Register model, Samson V2 PID for LLM governance, voltage-gated communication buffer |
| **Speculative** | "Inspired by" / "Analogous to" / "Hypothesis" | SHA-256 as universal ROM, Larmor resonant bridge, "Cosmic FPGA" |
| **Cut before publication** | Do not include | π+φ+e=6, "solves Black Hole Information Paradox," "Zero Latency" (use "sub-perceptual") |

---

*This is the Protocol Bible. All agents align to this document. If you're reading this in a fresh session, start here.*

*P31 Labs — phosphorus31.org — IT'S OKAY TO BE A LITTLE WONKY — 🔺*
