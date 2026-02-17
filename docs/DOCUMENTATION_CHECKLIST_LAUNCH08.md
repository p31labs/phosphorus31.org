# LAUNCH-08: Documentation completeness

Checklist to confirm documentation is sufficient for launch. All links relative to repo root.

---

## Required for launch

| Doc | Purpose | Location |
|-----|---------|----------|
| README | Repo overview, quick start, structure | `README.md` |
| PREP_FOR_LAUNCH | Pre-flight and launch steps | `PREP_FOR_LAUNCH.md` |
| Deployment | How to run Shelter, Docker, env | `docs/deployment.md` |
| Env reference | All env vars (Shelter, Centaur, Scope) | `config/env-reference.md` |
| Security audit | LAUNCH-02 findings and fixes | `docs/SECURITY_AUDIT_LAUNCH02.md` |
| Performance report | LAUNCH-03 benchmarks and targets | `docs/PERFORMANCE_REPORT_LAUNCH03.md` |
| Go-live verification | LAUNCH-07 post-launch checklist | `docs/GO_LIVE_VERIFICATION_LAUNCH07.md` |
| Monitoring | Health endpoint and what to monitor | `docs/MONITORING_LAUNCH07.md` |
| Release tagging | How to cut a release and tag | `docs/RELEASE_TAGGING.md` |
| Docs index | Map of all docs | `docs/index.md` |

## Component READMEs

| Component | README |
|-----------|--------|
| Shelter (Buffer) | `apps/shelter/README.md` |
| Scope (ui) | `ui/README.md` |
| Sprout | `apps/sprout/README.md` (if present) |
| Website | `apps/web/` (see LAUNCH_NOW.md) |
| Deploy | `deploy/README.md` |

## Optional / as-needed

- Demo run (one-page): `docs/DEMO_RUN.md`
- Accessibility audit (LAUNCH-05): `docs/ACCESSIBILITY_AUDIT_LAUNCH05.md`
- Tests overview: `tests/README.md`
- API reference: `docs/api/index.md`
- Contributing: `CONTRIBUTING.md`

## Verification

- [x] **README** describes structure and how to run dev (e.g. `npm run dev`, Shelter on :4000). *(Check root README.md and component READMEs.)*
- [x] **PREP_FOR_LAUNCH** covers pre-flight, website, Shelter, Scope, NodeZero, LAUNCH gates 01–12, git/release, deploy, monitoring. *(Verified 2026-02-17.)*
- [x] **docs/index.md** includes a **Launch & operations** section linking to all LAUNCH and ops docs. *(Verified 2026-02-17.)*
- [x] **No broken links** in PREP_FOR_LAUNCH or docs/index.md to the required docs above. *(Agent 2026-02-17: all target files exist; docs/index.md Launch section links use correct relative paths. Operator: spot-check in browser before go-live.)*
- [x] **Env reference** includes Shelter (Buffer) and ACCOMMODATION_DB_DIR. *(config/env-reference.md verified 2026-02-17.)*

---

*Part of the P31 launch swarm. The mesh holds. 🔺*
