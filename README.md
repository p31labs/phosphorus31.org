# P31 Labs Monorepo

**Phosphorus-31. The biological qubit. The atom in the bone.**

Open-source assistive technology for neurodivergent minds.

## Directory Structure

```
p31/
├── .cursor/rules/        # Agent rules (swarm army + development rules)
├── .github/workflows/    # CI/CD pipelines
├── apps/                 # Backend services
│   ├── shelter/          # P31 Buffer (Express + WebSocket)
│   ├── sprout/           # P31 Sprout signals engine
│   ├── scope/            # Scope dashboard API
│   └── web/              # Static site mirror (CI uses website/)
├── docs/                 # All documentation
│   ├── architecture/     # System architecture specs
│   ├── ssa-prep/         # SSA disability exam documents
│   ├── legal-packet/     # Court exhibits and legal docs
│   ├── grants/           # Grant narratives and applications
│   ├── substack/         # Published and draft Substack posts
│   ├── board/            # Board recruitment materials
│   ├── hardware/         # Hardware docs, BOM, assembly guides
│   └── swarm-history/    # Completed swarm operation logs
├── firmware/             # ESP32-S3 Node Zero firmware (ESP-IDF)
├── GENESIS_GATE_APPS_SCRIPT/  # Google Apps Script backend (P31 Entangle)
├── hardware/             # PCB designs, STL files, schematics (KiCad)
├── packages/             # Shared npm packages
│   ├── game-integration/
│   └── protocol/
├── scripts/              # Build, verify, launch scripts
├── SUPER-CENTAUR/        # P31 Tandem backend (TypeScript)
├── ui/                   # P31 Spectrum frontend (p31ca.org)
├── website/              # phosphorus31.org (static HTML)
├── _archive/             # Archived content (provenance preserved, git-tracked)
├── package.json
├── docker-compose.yml
└── README.md
```

## For AI Agents

Start here: **[`AGENTS.md`](AGENTS.md)** — universal context for any AI collaborator.

Then read **[`docs/GOD.md`](docs/GOD.md)** — architecture, dependency direction, constraints, build commands.

Full ecosystem map (all agents, all products): **[`docs/P31_MASTER_SYNTHESIS.md`](docs/P31_MASTER_SYNTHESIS.md)**.

Build health: **[`WORKSPACE_STATUS.md`](WORKSPACE_STATUS.md)** — what works, what's broken, what's next.

Each major component has a `CLAUDE.md` with detailed agent context:
- [`ui/CLAUDE.md`](ui/CLAUDE.md) — P31 Spectrum frontend
- [`SUPER-CENTAUR/CLAUDE.md`](SUPER-CENTAUR/CLAUDE.md) — P31 Tandem backend
- [`apps/shelter/CLAUDE.md`](apps/shelter/CLAUDE.md) — P31 Buffer
- [`firmware/CLAUDE.md`](firmware/CLAUDE.md) — P31 NodeZero firmware
- [`packages/protocol/CLAUDE.md`](packages/protocol/CLAUDE.md) — Shared protocol

## Quick Start

```bash
npm install                    # Install all workspace dependencies
cd ui && npm run dev           # Start P31 Spectrum (p31ca.org)
cd website && npx serve .      # Preview phosphorus31.org locally
cd firmware && idf.py build    # Build Node firmware (requires ESP-IDF 5.4+)
```

## Domains

| Domain | Source | Purpose |
|--------|--------|---------|
| [phosphorus31.org](https://phosphorus31.org) | `website/` | Organization site — corporate nonprofit face |
| [p31ca.org](https://p31ca.org) | `ui/` | P31 Spectrum — the living assistive app suite |

## The Stack

Four products. One mesh. No hierarchy.

| Product | Directory | What It Does |
|---------|-----------|-------------|
| **P31 Compass** | `ui/` | Executive function + navigation |
| **P31 Buffer** | `apps/shelter/` | Communication voltage assessment |
| **P31 Greenhouse** | `ui/public/apps/` | Standalone tools (offline HTML) |
| **P31 Tandem** | `SUPER-CENTAUR/` | Human-AI collaboration backend |

## Documentation

All docs live in `docs/`. Start with `docs/architecture/` for system overview.

## Archive

The `_archive/` directory contains all previously active content that has been superseded or completed. Nothing was deleted — git history preserves full provenance. See `_archive/MANIFEST.md` for the complete inventory.

## License

MIT — see individual components for specific licenses.

---

*P31 Labs, Inc. · Georgia 501(c)(3) in formation*
*DOI: [10.5281/zenodo.18627420](https://doi.org/10.5281/zenodo.18627420) · ORCID: [0009-0002-2492-9079](https://orcid.org/0009-0002-2492-9079)*
