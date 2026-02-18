# Archive Manifest

**Generated:** 2026-02-17
**Cleanup:** Nuclear repo reorganization — 262 items → 19 root items (12 dirs + 7 files)

## Purpose

Provenance record for all archived content. **Nothing was deleted.**
Git history preserves full move tracking. `_archive/` is git-tracked intentionally.

**DO NOT add `_archive/` to `.gitignore`.** Provenance preservation requires tracking.

---

## Summary

| Category | Count |
|----------|-------|
| Archived directories | 109 |
| Archived root loose files | 153 |
| Deliverables routed to docs/ | 8 |
| Files routed to docs/grants/ | 19 |
| Files routed to docs/ssa-prep/ | 4 |
| Files routed to docs/swarm-history/ | 17 |

---

## Stale Directories (Key)

| Directory | What It Was | Why Archived | Replaced By |
|-----------|-------------|-------------|-------------|
| backend/ | Original Express backend | Superseded | SUPER-CENTAUR/ |
| phenix_core/ | Early Phenix Navigator core | Superseded | firmware/ + ui/ |
| phenix_mesh/ | Early mesh networking code | Superseded | firmware/ (LoRa mesh) |
| phenix_data/ | Early data layer | Superseded | SUPER-CENTAUR/ |
| phenix_ui/ | Early UI prototype | Superseded | ui/ (P31 Spectrum) |
| phenix_gensync/ | Genesis sync experiment | Superseded | GENESIS_GATE_APPS_SCRIPT/ |
| phenix_render/ | Render pipeline experiment | Superseded | ui/ (Three.js) |
| phenix_assets/ | Static assets | Merged | ui/public/ + website/ |
| phenix-navigator/ | V1 navigator app | Superseded | ui/ |
| phenix-navigator-firmware/ | V1 firmware | Superseded | firmware/ (Xiaozhi-based) |
| TetrAI/ | Tetrahedron AI experiment | Completed | docs/architecture/ |
| WONKY_SPROUT_BUILD_PACKAGE_V2/ | V2 build package | Superseded | P31 ecosystem |
| VolumeEncoderParts_stls/ | 3D print STL files | Superseded | hardware/ |
| VolumeEncoderParts_stls_backup/ | STL backup | Superseded | hardware/ |
| tetrahedron_mission_package/ | Mission package export | Completed | docs/swarm-history/ |
| TETRAHEDRON_COMPLETE_DOCUMENTATION/ | Tetrahedron docs | Completed | docs/architecture/ |
| agent/ | Omega Protocol agent | Not referenced | N/A (experimental) |
| apps-script/ | Single Code.gs | Superseded | GENESIS_GATE_APPS_SCRIPT/ |
| forensics/ | Financial forensics scripts | Completed | docs/legal-packet/ |
| backup_current/ | Backup snapshot | Stale | Git history |
| swarm-complete/ | Swarm army export | Integrated | .cursor/rules/ |
| deliverables/ | Session deliverables | Routed | docs/ssa-prep/, docs/grants/, etc. |
| src/ | Old app source | Superseded | ui/src/ |
| src-tauri/ | Tauri desktop wrapper | Unused | N/A |
| cognitive-shield/ | Buffer UI prototype | Superseded | apps/shelter/ |
| geodesic-engine/ | Early engine | Superseded | ui/ game engine |
| geodesic-platform/ | Early platform | Superseded | ui/ + SUPER-CENTAUR/ |
| node-one/ | Old firmware dir | Superseded | firmware/ |
| digital-centaur-package/ | Export package | Superseded | SUPER-CENTAUR/ |
| ESP32-S3-Touch-LCD-3.5-*/ | Waveshare examples | Reference only | firmware/ |
| xiaozhi-esp32-2.0.5/ | Xiaozhi source | Integrated | firmware/ |

---

## Root Loose Files (153 items)

Categories of archived root files:
- **Markdown docs** (~90): Old drafts, status reports, session summaries, checklists
- **Python scripts** (~13): One-off utilities (check_ideology.py, stress_test.py, etc.)
- **PowerShell scripts** (~8): Windows build helpers, launchers
- **Batch files** (~7): Windows launchers (START.bat, STOP.bat, LAUNCH.bat, etc.)
- **Shell scripts** (~5): Linux utilities (deploy.sh, abdicate.sh, etc.)
- **JavaScript/GS** (~6): Loose scripts (seal.js, CognitiveHub.gs, etc.)
- **Config files** (~5): Stale docker-compose variants, Dockerfiles, vercel.json
- **Binary/archives** (~5): .tar.gz, .zip, .step, .jpeg, .xlsx
- **Misc** (~10): .rtf, .code-workspace, .css, .html, .xml, .cpp

---

## What Was NOT Archived

These remain active and untouched at root:

| Item | Purpose |
|------|---------|
| .cursor/rules/ | Agent rules (swarm army + development rules) |
| .github/workflows/ | CI/CD pipelines |
| apps/ | Backend services (shelter, sprout, scope, web) |
| docs/ | All organized documentation |
| firmware/ | ESP32-S3 Node Zero firmware |
| GENESIS_GATE_APPS_SCRIPT/ | Google Apps Script backend |
| hardware/ | PCB designs placeholder |
| packages/ | Shared npm packages |
| scripts/ | Build, verify, launch scripts |
| SUPER-CENTAUR/ | TypeScript backend engine |
| ui/ | P31 Spectrum frontend |
| website/ | phosphorus31.org static site |
| _archive/ | This archive (provenance preserved) |
| package.json | npm workspace config |
| docker-compose.yml | Service orchestration |
| docker-compose.integration.yml | Integration testing |
| README.md | Repository overview |
| CHANGELOG.md | Version history |
| LICENSE | MIT license |
