# 01 — OPSEC RULES
## Non-negotiable privacy and security constraints
**Inject into EVERY agent session alongside 00_AGENT_BIBLE.md**

---

## ABSOLUTE RULES — VIOLATION = DISCARD OUTPUT

### Identity Protection
1. **NEVER use the operator's surname in any output.** First name "Will" or "the operator" only.
2. **NEVER use the children's legal first names or surname.** Nicknames only: **Bash** (S.J.) and **Willow** (W.J.).
3. **NEVER use the spouse's full name.** If reference is needed, use a generic term or initial only.
4. **NEVER include the operator's home address, city, or ZIP code.** State-level (Georgia) is the maximum geographic specificity in any public-facing document.
5. **NEVER include SSN, EIN (until publicly filed), bank account numbers, or TSP account numbers.**
6. **NEVER include case numbers, docket numbers, or court file references** unless explicitly instructed for a specific legal filing.

### Children's Data
7. **No birthdates in public-facing content.** Use age only (Bash: 10, Willow: 6). Birthdates may appear in internal/legal documents only when required.
8. **No photos, physical descriptions, school names, or location data for either child.**
9. **No medical information about the children** in any output.

### Legal Situation
10. **Do not name the opposing party in custody proceedings** in any output.
11. **Do not describe specific allegations or claims** from either side unless producing a legal filing.
12. **Do not name the GAL (Guardian ad Litem)** in non-legal outputs.
13. Court documents are for the operator's eyes only — never include in public-facing materials.

### Technical Security
14. **No private keys, wallet seed phrases, or API keys** in any output, ever.
15. **No specific server IPs, SSH credentials, or deployment secrets.**
16. **Git commits should use "P31 Labs" or "will@p31ca.org" as author** — not a personal email.

---

## CONTEXT-SPECIFIC GUIDELINES

### For Public-Facing Content (website, applications, pitch decks)
- Use "the founder" or "Will" — never full name
- Use "his children" or "the founding nodes" — never names
- Reference diagnoses (AuDHD, hypoparathyroidism) only when directly relevant to the mission
- Employment history: "16 years as a DoD civilian submarine electrician" — no base names, no supervisor names
- Financial details: "pre-revenue nonprofit" and "bootstrapped" — no specific dollar amounts

### For Internal Documents (legal filings, SSA prep, formation docs)
- Full legal name is acceptable ONLY in fields that legally require it (e.g., IRS forms, Articles of Incorporation)
- Children's birthdates acceptable ONLY in documents filed with the court or SSA
- Address acceptable ONLY in documents filed with state/federal agencies
- These documents must be marked "CONFIDENTIAL — NOT FOR DISTRIBUTION"

### For Code and Technical Artifacts
- No surnames in code comments, variable names, or string literals
- Use nicknames (bash, willow) or generic terms (child_1, child_2, founding_node) as identifiers
- No hardcoded addresses, real wallet addresses, or financial data
- Demo/placeholder data only — clearly labeled as such

---

## THE TEST

Before finalizing any output, every agent should ask:

> "If this document were leaked to the internet right now, would it expose the operator's home address, children's identities, legal strategy, or financial details?"

If yes → redact and revise before delivering.

---

## QUICK REFERENCE: SAFE vs. UNSAFE

| SAFE ✅ | UNSAFE ❌ |
|---------|----------|
| "Will" | Full legal name |
| "Bash" / "S.J." | Legal first name of older child |
| "Willow" / "W.J." | Legal first name of younger child |
| "Georgia" | City or county name |
| "40 years old" | Date of birth |
| "16-year DoD civilian" | Specific base or command |
| "pre-revenue nonprofit" | Specific bank balances |
| "active legal proceedings" | Case numbers or docket info |
| "his children (ages 10 and 6)" | Children's birthdates |
| "the spouse" / "the co-parent" | Spouse's name |
| "phosphorus31.org" | Home address |
