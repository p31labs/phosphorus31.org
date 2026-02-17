# Phase A OPSEC scan (2026-02-17)

One-pass scan of public-facing and docs code per 01_OPSEC_RULES.md. **No full names, addresses, case numbers, or kid PII in public output.**

---

## Fixes applied (agent)

| Location | Issue | Fix |
|----------|--------|-----|
| `docs/THE_DELTA_PROTOCOL.md` | Full name "Will Johnson" (4 occurrences) | Replaced with "Will" / "the operator" per OPSEC. |
| `docs/GAME_ENGINE_OPUS_BRIEF.md` | Example code used real birthdate `2016-03-10` | Replaced with placeholder `2010-01-01` and comment "example only — no real birthdates in docs". |

---

## Verified OK

- **apps/web, website:** No full names; only "Georgia", "Southeast Georgia", Hack Club EIN (81-2908499, public). Footer and copy OPSEC-safe.
- **docs (general):** GO_LIVE_VERIFICATION_LAUNCH07 references "no addresses/case numbers" as checklist text. Articles of Incorporation use placeholders `[OPERATOR: City]`, `[ZIP Code]` (internal/formation).
- **Secrets:** `.env` not tracked; SECURITY_AUDIT_LAUNCH02 confirms no API keys/tokens/passwords in Shelter source. Operator should confirm no real keys in any tracked file.

---

## Operator review recommended

- **Brunswick, GA:** Appears in internal docs only (SSA_PREPARATION, P31_ACTIVATION_CHECKLIST, P31_SOPS_INDEX, P31_Labs_Formation_Checklist) as SSA exam location. OPSEC allows state-level (Georgia) for public content. If any of these are ever published, redact to "Georgia" or "Southeast Georgia."
- **SUPER-CENTAUR / _archive engine docs:** INTEGRATION_GUIDE and README contain "Born March 10, 2016" and "August 8, 2019" in example/spec context. Prefer ages-only in any public-facing version (e.g. "Age 10" / "Age 6" without dates).
- **Final pass:** Run a quick search for your surname and kids’ legal first names in repo before go-live; confirm no case numbers or docket refs in client code or public docs.

---

*Part of Phase A sign-off. The mesh holds. 🔺*
