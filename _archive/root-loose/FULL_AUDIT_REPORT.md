# P31 Full Audit Report

**Purpose:** Single reference for codebase audit results and test coverage.  
**Regenerate live audit:** `node scripts/audit.mjs` (or `npm run audit`).  
**Last consolidated:** 2026-02-16

---

## Summary

| Area | Status | Notes |
|------|--------|--------|
| **Codebase inventory** | ✅ Done | See `P31_CODEBASE_AUDIT_2026-02-16.md` |
| **Phase 1 consolidation** | ✅ Done | See `PHASE1_CONSOLIDATION_REPORT_2026-02-16.md` |
| **Codebase scrub** | ✅ Done | See `CODEBASE_SCRUB_REPORT_2026-02-16.md` |
| **Port alignment** | ✅ | Shelter 4000, Centaur 3000, Scope 5173 |
| **Naming / banned words** | 🟡 Flagged | Run `npm run audit`; many legacy refs in docs/archive |
| **PII / secrets** | ✅ Clean | No committed secrets in apps/, packages/, p31-core/ (Phase 1 scan) |
| **Test suite** | 🟡 Partial | Centaur (Jest), Scope (Vitest), Shelter (Vitest); root `npm test` runs Centaur + Scope |

---

## Test matrix

| Component | Location | Command | Framework | Notes |
|-----------|----------|--------|----------|--------|
| **P31 Tandem (Centaur)** | SUPER-CENTAUR | `cd SUPER-CENTAUR && npm test` | Jest | engine, legal, medical, security, monitoring, cognitive-prosthetics |
| **The Scope** | ui | `cd ui && npm test` | Vitest | `vitest run` |
| **P31 Shelter (Buffer)** | apps/shelter or cognitive-shield | `cd apps/shelter && npm test` or `cd cognitive-shield && npm test` | Vitest | Engine (voltage, pattern, triage) well-tested |
| **Protocol** | packages/protocol | No tests yet | — | Minimal types + constants |
| **Full system (ports + flow)** | repo root | `python FULL_SYSTEM_TEST.py` or `npm run health` | Python / curl | Ports 3000, 4000, 5173; optional message flow |
| **Integration verify** | scripts | `npm run verify` (tsx scripts/verify-integration.ts) | TS + fetch | Buffer/Centaur/Scope health + message flow |

---

## Run audit (live)

From repo root:

```bash
# Ports + banned words + legacy naming + PII scan (stdout)
npm run audit

# Save report to file
npm run audit > audit-report-$(date +%Y-%m-%d).md
```

Windows PowerShell:

```powershell
npm run audit | Out-File -Encoding utf8 "audit-report-$(Get-Date -Format 'yyyy-MM-dd').md"
```

---

## Run full test suite

```bash
# Centaur + Scope (current root default)
npm test

# All component tests (Centaur, Scope, Shelter) — run even if one fails
npm run test:all

# Per-component
npm run test:centaur
npm run test:scope
npm run test:shelter

# Health check (services must be running)
npm run health
```

---

## Tetrahedron test (stability check)

| Vertex | Question | Status |
|--------|----------|--------|
| **Technical** | Can we build and run? | Buffer + engine yes; Centaur/Scope have TS/lint debt |
| **Legal** | Compliant, no PII in repo? | Scanned clean in Phase 1; court/SSA docs not in public tree |
| **Medical** | Serves assistive mission? | Buffer voltage/triage + accommodation log; engine L.O.V.E. |
| **OPSEC** | No keys, no full names? | .env.example only; codenames in use |

---

## References

- **P31_CODEBASE_AUDIT_2026-02-16.md** — Inventory, map, migration plan, health answers
- **PHASE1_CONSOLIDATION_REPORT_2026-02-16.md** — What moved, Shelter build, protocol extraction
- **CODEBASE_SCRUB_REPORT_2026-02-16.md** — Fixes applied, remaining TS/ESLint issues
- **BUILD_NEXT.md** — Next steps and launch prep
- **scripts/audit.mjs** — Script that produces the live audit (ports, banned words, naming, PII)

---

*The mesh holds. 🔺*
