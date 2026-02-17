# PROMPT 9: phosphorus31.org Deployment Check

**Date:** 2026-02-15

---

## Is phosphorus31.org currently live?

**Unknown from repo alone.** Deployment status doc indicates:

- Website source lives in `website/` with full content (index, about, docs, roadmap, donate, node-one, etc.).
- Repo `p31labs/phosphorus31.org` exists; changes were committed locally; next step is push + deploy (e.g. Cloudflare Pages).
- So the site may or may not be live depending on whether that push/deploy was completed.

---

## Launch essentials audit (website/ content)

| Item | Status |
|------|--------|
| Clear value proposition (non-deficit language) | ✅ "Assistive technology for neurodivergent minds", "communication processing, sensory regulation, executive function support" |
| Device description (Node One specs) | ✅ node-one/ and stack section |
| Founder story with lived experience | ✅ about/ and hero copy |
| Contact (will@p31ca.org) | ⚠️ Verify link in footer/contact section |
| FDA classification: 21 CFR §890.3710 | ⚠️ Add to node-one or legal/ if not present |
| Privacy statement | ⚠️ Check legal/ or footer |
| Accessibility statement (WCAG 2.2 AA) | ⚠️ Check accessibility/ and prefers-reduced-motion (animations respect it) |

---

## Accessibility

- `prefers-reduced-motion` respected in main.js/animations (per DEPLOYMENT_STATUS).
- Skip link present (`Skip to main content`).
- Recommend: run Lighthouse and axe in browser after deploy; fix any heading/alt/contrast issues.

---

## If site is NOT deployed

- **Fast path:** Push `website/` to `github.com/p31labs/phosphorus31.org`, connect to Cloudflare Pages (or Vercel/Netlify), set custom domain phosphorus31.org. Estimate: &lt;4 hours for minimal viable go-live.
- **Pre-launch:** Add FDA 890.3710 and contact/legal/accessibility items above where missing.
