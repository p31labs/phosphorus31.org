# LAUNCH-09: Legal & regulatory checklist

Pre-launch verification that legal and regulatory bases are covered. **No PII, case numbers, or confidential strategy in this doc.** For operator use only; link to detailed docs.

---

## 1. Entity & tax

| Check | Doc / note | Pass |
|-------|------------|------|
| Entity status documented | Georgia 501(c)(3) in formation; see Agent Bible, nonprofit docs | [ ] |
| Fiscal sponsor (if used) | Hack Club HCB; 7% fee documented | [ ] |
| Form 1023-EZ / EIN | File after incorporation per formation checklist | [ ] |
| Public wording | "Georgia 501(c)(3) in formation" or "pending" — no false claims | [ ] |

**Refs:** `docs/nonprofit-launch-action-plan.md`, `docs/P31_Labs_Formation_Checklist.md`, `docs/articles-of-incorporation-irs-clauses.md`

---

## 2. FDA & device (Node One / P31 NodeZero)

| Check | Doc / note | Pass |
|-------|------------|------|
| Classification noted | Class II 510(k)-exempt pathway: 21 CFR § 890.3710 (Powered Communication System) | [ ] |
| Public wording | Website/footer: "FDA Class II exempt (21 CFR § 890.3710)" where appropriate | [ ] |
| No therapeutic claims | Marketing/docs: assistive tech / communication aid, not medical treatment claims | [ ] |

**Refs:** `docs/research/legal-shield/fda-classification.md`, `docs/P31_FINAL_VISUAL_AUDIT_REPORT.md` (footer copy)

---

## 3. ADA & accommodation evidence

| Check | Doc / note | Pass |
|-------|------------|------|
| Accommodation log | Shelter stores PII-free accommodation events (LAUNCH-04); export for SSA/legal use | [ ] |
| Export available | GET /accommodation-log, /accommodation-log/export (CSV/JSON) | [ ] |
| Immutability | Log entries immutable; no retroactive edits | [ ] |

**Refs:** `apps/shelter/` (accommodation-log-store, routes), `README.md` (ADA protected)

---

## 4. IP & defensive publication

| Check | Doc / note | Pass |
|-------|------------|------|
| Defensive pub strategy | Zenodo DOIs for prior art; Apache 2.0 / open where intended | [ ] |
| No accidental disclosure | No trade secrets or unpatented IP in public repos beyond intended | [ ] |
| Component names | P31 naming (Node One, Buffer, etc.) used consistently in public docs | [ ] |

**Refs:** `docs/legal-operations.md` (IP protection), Zenodo docs in `docs/zenodo-*.md`

---

## 5. OPSEC & public content

| Check | Doc / note | Pass |
|-------|------------|------|
| OPSEC rules followed | No full names, addresses, case numbers, kid PII in public code/docs | [ ] |
| Codename usage | Operator/kids/court referenced per codename rules in public-facing text | [ ] |
| .env / secrets | Never committed; production uses host env only | [ ] |

**Refs:** `01_OPSEC_RULES.md`, `.cursor/rules/privacy-codenames.mdc`

---

## 6. Licenses & footer

| Check | Doc / note | Pass |
|-------|------------|------|
| Software license | Apache 2.0 (or as stated in repo) | [ ] |
| Hardware license | CERN-OHL-S-2.0 where applicable | [ ] |
| Public site footer | Entity + FDA + license + location (e.g. Southeast Georgia) as in audit | [ ] |

**Refs:** `README.md`, `apps/web/`, `docs/P31_FINAL_VISUAL_AUDIT_REPORT.md`

---

## Sign-off

- [ ] Sections 1–6 reviewed; all applicable checks passed or explicitly deferred with note.
- [ ] No confidential legal strategy or PII added to this checklist.

**Related:** [Legal Operations](legal-operations.md), [PREP_FOR_LAUNCH](../PREP_FOR_LAUNCH.md)

🔺 The mesh holds.
