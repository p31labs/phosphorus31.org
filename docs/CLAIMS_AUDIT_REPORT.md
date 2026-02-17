# Claims Language Audit Report

**Date:** 2026-02-15  
**Scope:** README, docs/, website/, ui/src (marketing/copy), package.json descriptions  
**Reference:** god.config.ts `approvedClaims` / `prohibitedClaims` (FDA 21 CFR §890.3710)

---

## Summary

- **Prohibited claims (treats/cures/improves [condition], therapy for condition, diagnoses):** No instances found in public-facing marketing or product copy.
- **Approved language:** Docs and website already use assistive-technology framing (executive function support, sensory regulation, cognitive prosthetic, communication processing). No changes required.

---

## Files Reviewed

- `docs/` — SYSTEM_OVERVIEW, TECHNICAL_ARCHITECTURE, nonprofit-launch-action-plan, donation-wallet, MATA_APPLICATION (template). All use "assistive technology", "support", "cognitive prosthetic", "Class II", "510(k) exempt". No "treats ADHD" or "cures autism".
- `website/index.html` and subpages — Value proposition: "Assistive technology for neurodivergent minds", "communication processing, sensory regulation, executive function support". No therapeutic or diagnostic claims.
- `MATA_APPLICATION.md` — Uses "NOT a medical treatment device", "Assistive technology under ADA protections", and template language that describes lived experience (applicant's own diagnosis) without making device claims.

---

## Out of Scope

- Legal/court filings (e.g. SUPER-CENTAUR submission_package) — not product claims.
- Internal medical/legal context (e.g. "Yorvipath therapy", "diagnosed with ASD") — factual, not device claims.

---

## Recommendation

No file changes required. Continue using only `P31.approvedClaims` language in any new marketing or accelerator materials.
