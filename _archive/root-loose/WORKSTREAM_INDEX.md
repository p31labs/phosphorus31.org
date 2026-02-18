# P31 LABS — WORKSTREAM INDEX
## Master reference for all agent prompts and workstreams
**Last Updated:** 2026-02-14

---

## DOCUMENT HIERARCHY

### CORE DOCUMENTS (Always Inject)
These must be loaded into every agent session:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **00_AGENT_BIBLE.md** | Master context — operator, kids, tech stack, deadlines | **ALWAYS inject first** |
| **01_OPSEC_RULES.md** | Privacy/security constraints — non-negotiable | **ALWAYS inject** (violation = discard) |
| **02_BRAND_VOICE.md** | Style guide, terminology, design tokens | For external-facing content only |

### WORKSTREAM PROMPTS (Inject as Needed)
These are task-specific implementation guides:

| Document | Workstream | Inject With | Purpose |
|----------|------------|-------------|---------|
| **03_PROMPT_accelerator.md** | Multiple Autism Tech Accelerator Application | 00 + 01 + 02 | Draft application for Cohort 4 (due Feb 27) |
| **04_PROMPT_formation.md** | Georgia 501(c)(3) Formation | 00 + 01 | Articles of Incorporation, IRS Form 1023-EZ |
| **05_PROMPT_technical.md** | Technical Documentation | 00 + 01 | Node One / Buffer / Scope specs + Zenodo publications |
| **06_PROMPT_legal_ssa.md** | Legal & SSA Preparation | 00 + 01 | Court prep (Mar 12) + SSA exams (Feb 20, 26) |
| **07_TEMPLATES.md** | Fill-in-the-blank Deliverables | Use with any workstream | Pitches, emails, logs, publication headers |
| **08_WORKSTREAM_PHENIX_NAVIGATOR_ARCHITECTURE.md** | Phenix Navigator Build | 00 + 01 | Complete technical spec for the Navigator UI |

---

## INJECTION PROTOCOL

### Standard Injection Sequence
```
1. 00_AGENT_BIBLE.md          ← Master context
2. 01_OPSEC_RULES.md          ← Privacy rules (non-negotiable)
3. [Workstream Prompt]        ← Task-specific guide
4. 02_BRAND_VOICE.md          ← Only if creating external content
5. 07_TEMPLATES.md            ← If using templates
```

### Example: Building Phenix Navigator
```
Inject:
- 00_AGENT_BIBLE.md
- 01_OPSEC_RULES.md
- 08_WORKSTREAM_PHENIX_NAVIGATOR_ARCHITECTURE.md

Do NOT inject:
- 02_BRAND_VOICE.md (internal technical spec, not marketing)
- 03-07 (different workstreams)
```

### Example: Multiple Accelerator Application
```
Inject:
- 00_AGENT_BIBLE.md
- 01_OPSEC_RULES.md
- 02_BRAND_VOICE.md (external-facing application)
- 03_PROMPT_accelerator.md
- 07_TEMPLATES.md (for pitch templates)
```

---

## CROSS-WORKSTREAM DEPENDENCIES

### Phenix Navigator (08) ↔ Technical Docs (05)
- **08** defines the UI architecture (Jitterbug, Quantum Reservoir, Buffer Panel)
- **05** documents the underlying systems (Node One firmware, Buffer algorithm, Scope architecture)
- **Integration point:** Both reference the same three-layer stack (Hardware/Software/Dashboard)

### Accelerator Application (03) ↔ Formation (04)
- **03** requires entity status (nonprofit in formation)
- **04** produces the entity (Articles, 501(c)(3) determination)
- **Timeline:** Formation must complete before accelerator program begins (Mar 31)

### Legal/SSA (06) ↔ Technical Docs (05)
- **06** needs accommodation evidence (Buffer logs, Scope exports)
- **05** produces the technical specs that generate that evidence
- **Integration:** Buffer voltage assessment → ADA accommodation documentation

### All Workstreams ↔ Templates (07)
- **07** provides fill-in-the-blank versions of deliverables
- Use templates when creating outputs for any workstream

---

## CRITICAL DEADLINES (from 00_AGENT_BIBLE.md)

| Date | Event | Workstream | Status |
|------|-------|------------|--------|
| **Feb 20** | SSA telehealth psychiatric exam | 06 | ⚠️ CRITICAL |
| **Feb 26** | SSA in-person medical exam | 06 | ⚠️ CRITICAL |
| **Feb 27** | Multiple accelerator application | 03 | ⚠️ CRITICAL |
| **Mar 10** | Bash turns 10 — MAR10 Day | Personal | 🎉 |
| **Mar 12** | Court date (Chief Judge Scarlett) | 06 | ⚠️ CRITICAL |
| **Mar 31** | Multiple accelerator begins (if accepted) | 03 | 📅 MILESTONE |

---

## FILE LOCATIONS

### In Workspace
- `08_WORKSTREAM_PHENIX_NAVIGATOR_ARCHITECTURE.md` ← **Created in workspace root**

### In Downloads (Reference Only)
- `00_AGENT_BIBLE.md`
- `01_OPSEC_RULES.md`
- `02_BRAND_VOICE.md`
- `03_PROMPT_accelerator.md`
- `04_PROMPT_formation.md`
- `05_PROMPT_technical.md`
- `06_PROMPT_legal_ssa.md`
- `07_TEMPLATES.md`

**Note:** Consider moving all workstream prompts into workspace for version control.

---

## QUICK REFERENCE: WHAT TO INJECT WHEN

| Task | Inject These |
|------|--------------|
| **Build Phenix Navigator UI** | 00 + 01 + 08 |
| **Write accelerator application** | 00 + 01 + 02 + 03 + 07 |
| **File Articles of Incorporation** | 00 + 01 + 04 + 07 |
| **Write technical documentation** | 00 + 01 + 05 |
| **Prepare for SSA exam** | 00 + 01 + 06 |
| **Prepare for court** | 00 + 01 + 06 |
| **Create pitch deck** | 00 + 01 + 02 + 07 |

---

## CONSTITUTIONAL LAWS (from 08)

When building Phenix Navigator, these override all other instructions:

1. **ZERO-KNOWLEDGE STORAGE** — IndexedDB only, never localStorage
2. **DELTA COMPLIANCE** — 100% offline, no CDNs
3. **GEOMETRIC SECURITY** — Tetrahedron (K₄) topology, 1/3 overlap constant
4. **THE 90% RULE** — AES-GCM, ECDH, ECDSA, security score ≥90%
5. **OPSEC PRIME** — No PII, codenames only (see 01)

---

## THE MESH HOLDS. 🔺
