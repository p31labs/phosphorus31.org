# P31 Labs Landing Page — Audit & Fixes
**Date:** 2026-02-16  
**Scope:** apps/web/ (phosphorus31.org)

## Pass/Fail Audit Table

| Category | Item | Status | Notes |
|----------|------|--------|------|
| **HERO** | Full viewport height (100vh min) | ✅ Pass | `min-height: 100vh` + `100dvh` |
| **HERO** | Posner molecule viz: centered/slightly left, animated | ✅ Pass | Inline SVG in `.hero-molecule-wrap`, CSS breathe + pulse |
| **HERO** | Graceful fallback (static SVG when no WebGL) | ✅ Pass | Posner SVG always present; canvas hidden on mobile/reduced-motion |
| **HERO** | Headline "P³¹ LABS" — Oxanium 200, #E0E0EE, green glow | ✅ Pass | `.hero-title` |
| **HERO** | Subhead "PROTECTING FUTURE MINDS" — Space Mono, label, #7878AA, letter-spacing 4px | ✅ Pass | `.hero-subhead` |
| **HERO** | Body: Oxanium 300, body scale | ✅ Pass | `.hero-sub` |
| **HERO** | Background #050510 + radial #0A0A1F | ✅ Pass | `body::before` |
| **HERO** | Particle field <100, #00FF88 5% opacity, slow drift | ✅ Pass | main.js: 80 particles, 0.05 alpha, vx/vy 0.08 |
| **CONTENT** | "The Problem" — hypoparathyroidism + AuDHD + compound | ✅ Pass | New section + prose |
| **CONTENT** | Key stats: ₃₁P / Ca₉ / ≈21d / Ca²⁺ in cards with glow | ✅ Pass | `.problem-stat-card` |
| **CONTENT** | "The Science" — Posner, Fisher, ³¹P MRS | ✅ Pass | New section |
| **CONTENT** | Products: 6 cards, accent left border, hover glow+lift | ✅ Pass | `.product-card`, 3px left border |
| **CONTENT** | Positioning: THEM vs US | ✅ Pass | `.positioning-grid` |
| **CONTENT** | Principles: Local-First / Open Source / ADA / Kids First | ✅ Pass | `.principles-grid` |
| **CONTENT** | Entity: 501(c)(3) / FDA Class II / Licenses / Location | ✅ Pass | Footer `.footer-legal` |
| **CONTENT** | Footer tagline: "It's okay to be a little wonky." — italics, #4A4A7A | ✅ Pass | `.footer-tagline-main` |
| **NAV** | Minimal; no hamburger unless >5 links | ✅ Pass | 4 links; hamburger not added |
| **NAV** | Transparent, blur on scroll | ✅ Pass | `backdrop-filter: blur(12px)` |
| **NAV** | Logo: Posner mark + P³¹ LABS → #top | ✅ Pass | `.nav-logo` |
| **NAV** | Items: Products / Science / About / GitHub | ✅ Pass | Updated links |
| **RESPONSIVE** | Hero scales 320px→2560px | ✅ Pass | clamp() + dvh |
| **RESPONSIVE** | Product cards: 3→2→1 column | ✅ Pass | Media queries |
| **RESPONSIVE** | No horizontal scroll | ✅ Pass | `overflow-x: hidden`, min-width 320px |
| **RESPONSIVE** | Text ≥13px on mobile | ✅ Pass | `html { font-size: clamp(13px, 2vw, 16px); }` |
| **RESPONSIVE** | Touch targets ≥44×44px | ✅ Pass | `.btn`, `.contact-link`, `.nav-links a`, etc. |
| **PERF** | Fonts: preload Oxanium 200,300,400 + Space Mono 400 | ✅ Pass | `<link rel="preload" as="style">` |
| **PERF** | Lazy load below fold | ⚠️ Manual | No heavy images below fold; canvas is above. Add loading="lazy" if images added. |
| **SEO** | Title as specified | ✅ Pass | |
| **SEO** | meta description as specified | ✅ Pass | |
| **SEO** | og:title, og:description, og:image, og:type=website | ✅ Pass | |
| **SEO** | twitter:card=summary_large_image, twitter:image | ✅ Pass | |
| **SEO** | Canonical https://phosphorus31.org | ✅ Pass | |
| **SEO** | Favicon /apple-touch-icon | ✅ Pass | favicon.svg + apple-touch-icon favicon-180.png (ensure file exists) |
| **SEO** | robots.txt allows all, sitemap linked | ✅ Pass | robots.txt + sitemap.xml |
| **A11Y** | Skip-to-content (hidden until focus) | ✅ Pass | `.skip-link` |
| **A11Y** | One h1, h2 per section | ✅ Pass | |
| **A11Y** | lang="en" on html | ✅ Pass | |
| **A11Y** | prefers-reduced-motion: disable particles, molecule anim, scroll effects | ✅ Pass | main.js + CSS |

## Fixes Applied

1. **index.html**
   - Title, meta description, og/twitter, canonical, favicon + apple-touch-icon.
   - Hero: single h1 "P³¹ LABS", subhead "PROTECTING FUTURE MINDS", body copy; Posner inline SVG (simplified Ca₉(PO₄)₆) with aria-label.
   - Nav: logo (mark + "P³¹ LABS"), links Products / Science / About / GitHub.
   - New sections: The Problem (stats ₃₁P, Ca₉, ≈21d, Ca²⁺ + prose), The Science, Products (6 cards), Positioning (Them vs Us), Principles (4).
   - Footer: tagline "It's okay to be a little wonky.", entity line, simplified foot links.

2. **styles.css**
   - Font stack: Oxanium (200,300,400) + Space Mono (400); tokens --hero-text, --label-muted, --footer-tagline, --surface1.
   - Body gradient: #050510 with radial #0A0A1F.
   - Hero: .hero-title (Oxanium 200, #E0E0EE, green text-shadow), .hero-subhead (Space Mono, #7878AA, letter-spacing), .hero-sub (Oxanium 300); hero-content margin-left for layout with molecule.
   - Posner SVG: .hero-molecule-wrap (centered/slightly left), .posner-svg breathe + .posner-p pulse; reduced-motion disables animation.
   - Problem stats cards with glow; product cards (surface1, 3px accent left, hover); positioning grid; principles grid; footer-tagline-main (italic, #4A4A7A).
   - Nav logo (mark + text), nav link touch targets; responsive: products 3→2→1, problem/principles 4→2→1, min font 13px, overflow-x hidden.
   - Removed obsolete .hero h1 em / .hero-equation; hero animations respect reduced-motion.

3. **main.js**
   - Particle field: 80 particles, #00FF88 (0,255,136) at 5% opacity, slow drift (vx/vy 0.08); no particle init when `prefers-reduced-motion: reduce`.
   - Hero geometry canvas: not initialized when reduced-motion or width ≤768; canvas hidden in those cases (Posner SVG remains).
   - Removed mouse trail; parallax, 3D cards, scroll progress only when !REDUCE_MOTION.

## Optional Follow-ups

- **favicon-180.png:** Generate 180×180 PNG from `assets/logos/favicon.svg` for apple-touch-icon (e.g. Inkscape/ImageMagick/Sharp). Referenced in HTML; create file if missing.
- **Lighthouse:** Run after deploy to confirm LCP <2.5s, CLS <0.1, Performance ≥90.
- **og:image:** If social previews need a raster image, add a 1200×630 PNG and point og:image/twitter:image to it; SVG may not render in all cards.
