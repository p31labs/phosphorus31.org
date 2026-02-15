# P31 Labs Website — Master Build Prompt

## Context & Architecture

You are building pages for the P31 Labs website (phosphorus31.org). The homepage (`index.html`) is complete and polished. You must build out the remaining pages with full features, maintaining consistency with the existing design system.

### Design System Reference
- **CSS File**: `styles.css` — Contains all design tokens, components, and responsive breakpoints
- **JavaScript**: `main.js` — Contains geometry engines, animations, and interactive features
- **Homepage**: `index.html` — Reference implementation for structure, accessibility, and patterns

### Core Principles (NON-NEGOTIABLE)

1. **Delta Compliance (Offline-First)**
   - NO external CDNs for fonts, icons, or scripts (except Google Fonts which are async-loaded)
   - System fonts as fallback: `-apple-system, 'Segoe UI', system-ui, sans-serif`
   - All assets must be local or data URIs
   - Service worker ready (future implementation)

2. **Accessibility (WCAG 2.1 AA)**
   - Skip-to-content link on every page
   - Proper heading hierarchy (h1 → h2 → h3)
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Focus indicators on all interactive elements
   - Screen reader friendly (sr-only class for hidden labels)
   - Reduced motion support (prefers-reduced-motion media query)

3. **Code Quality**
   - Semantic HTML5
   - No inline styles (use CSS classes)
   - No inline scripts (use main.js or page-specific JS files)
   - Proper error handling
   - Graceful degradation

4. **Brand Consistency**
   - Use CSS variables from `:root` in styles.css
   - Phosphorus Green (#2ecc71) for primary actions
   - Calcium Blue (#60a5fa) for secondary/info
   - Void background (#050510)
   - JetBrains Mono for monospace, Outfit for display
   - Same navigation structure on all pages

---

## Page Build Requirements

### Standard Page Structure

Every page must include:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title · P31 Labs</title>
  <meta name="description" content="Page description">
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Page description">
  <meta name="theme-color" content="#050510">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔺</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@200;300;400;600;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@200;300;400;600;800&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="../styles.css"> <!-- Adjust path as needed -->
</head>
<body>
  <!-- SKIP TO CONTENT -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- NAV (same on all pages) -->
  <nav aria-label="Main navigation">
    <div class="nav-inner">
      <a href="/" class="nav-logo">P<sup>31</sup></a>
      <div class="nav-links">
        <a href="/#stack">Stack</a>
        <a href="/docs/">Docs</a>
        <a href="/roadmap/">Roadmap</a>
        <a href="/about/">About</a>
        <a href="/#donate">Donate</a>
      </div>
    </div>
  </nav>

  <!-- MAIN CONTENT -->
  <main id="main-content">
    <!-- Page-specific content here -->
  </main>

  <!-- FOOTER (same on all pages) -->
  <footer>
    <div class="container">
      <div class="footer-inner">
        <div>
          <span class="footer-logo">P<sup>31</sup> Labs</span>
          <span class="footer-legal">Georgia 501(c)(3) · Forming</span>
        </div>
        <span class="footer-tagline">The only stable isotope.</span>
      </div>
      <div class="foot-links">
        <a href="/">Home</a>
        <a href="/docs/">Docs</a>
        <a href="/roadmap/">Roadmap</a>
        <a href="/about/">About</a>
        <a href="/node-one/">Node One</a>
        <a href="/wallet/">Wallet</a>
        <a href="/games/">Games</a>
        <a href="/education/">Learn</a>
        <a href="/blog/">Blog</a>
        <a href="/legal/">Legal</a>
        <a href="/accessibility/">A11y</a>
        <a href="/press/">Press</a>
      </div>
      <p class="footer-formula">
        Π₁(d) = (1/d)|ψᵢ⟩⟨ψᵢ| where ⟨ψᵢ|ψⱼ⟩ = (dδᵢⱼ + 1)/(d + 1)
        — The geometry protects the signal.
      </p>
      <p class="footer-sponsor">
        P31 Labs is fiscally sponsored by The Hack Foundation (d.b.a. Hack Club), a 501(c)(3) nonprofit (EIN: 81-2908499). Donations are tax-deductible to the extent permitted by law.
      </p>
    </div>
  </footer>

  <script src="../main.js"></script> <!-- Adjust path as needed -->
</body>
</html>
```

---

## Page-Specific Requirements

### 1. `/docs/` — Documentation Hub

**Purpose**: Central documentation index and navigation

**Features**:
- Table of contents with sections:
  - Node One (Hardware)
  - The Buffer (Software)
  - The Scope (Interface)
  - Phenix Navigator (Architecture)
  - L.O.V.E. Economy
  - API Reference
  - Development Guides
- Search functionality (client-side, IndexedDB for offline)
- Quick links to GitHub repos
- Version indicators
- Last updated timestamps
- Code examples with syntax highlighting (use `<pre><code>` with monospace font)
- Expandable sections for long docs

**Components to Use**:
- `.section` and `.section-header` for page structure
- `.stack-card` style for doc cards
- `.math-block` style for code examples
- Custom `.doc-nav` for sidebar navigation (if needed)

---

### 2. `/roadmap/` — Development Roadmap

**Purpose**: Show current status, upcoming milestones, and long-term vision

**Features**:
- Timeline visualization (vertical or horizontal)
- Status indicators: ✅ Complete, 🚧 In Progress, 📋 Planned, 🔮 Future
- Milestone cards with:
  - Date/quarter
  - Status
  - Description
  - Dependencies
  - Links to related docs/PRs
- Filter by component (Node One, Buffer, Scope, etc.)
- Progress bars for major initiatives
- "Last Updated" timestamp

**Components to Use**:
- `.section` for timeline sections
- `.stack-card` style for milestone cards
- Custom timeline CSS (add to styles.css)
- Status badges (extend `.card-tag` styles)

---

### 3. `/about/` — About P31 Labs

**Purpose**: Mission, team, history, and values

**Features**:
- Mission statement (hero section)
- Founder story (expand on homepage version)
- Core values/principles:
  - Delta Topology (Mesh)
  - Privacy-First
  - Universal Accessibility
  - G.O.D. Protocol
  - The Mesh Holds
- Team section (if applicable)
- History/timeline
- Press mentions/links
- Contact information

**Components to Use**:
- `.hero` style for mission statement
- `.founder-content` style for team
- `.why-content` style for values
- `.math-grid` style for principles

---

### 4. `/node-one/` — Node One Hardware

**Purpose**: Detailed hardware documentation and specs

**Features**:
- Hero section with 3D model visualization (if available) or technical diagram
- Specifications table:
  - MCU: ESP32-S3
  - Haptics: DRV2605L
  - Display: OLED/E-Ink
  - Connectivity: LoRa 915MHz, BLE, NFC
  - Power: Battery specs
  - Dimensions
- Regulatory information (21 CFR § 890.3710)
- Use cases and examples
- Development status
- Purchase/build information
- Firmware documentation links
- GitHub repository link

**Components to Use**:
- `.section-header` for major sections
- `.stack-card` style for spec cards
- `.math-block` style for technical details
- Custom `.spec-table` for specifications

---

### 5. `/wallet/` — L.O.V.E. Economy Wallet

**Purpose**: Interactive wallet interface and economy documentation

**Features**:
- Wallet connection interface (Web3 integration ready)
- Balance display (LOVE tokens)
- Transaction history
- Pool breakdown (Sovereignty 50% / Performance 50%)
- Proof of Care metrics
- Vesting schedule visualization
- Transaction types explanation
- Chameleon mode indicator (offline/online)
- Base L2 network status

**Components to Use**:
- `.donate-wallet` style for wallet display
- `.economy-card` style for pool information
- Custom `.wallet-interface` for interactive elements
- `.math-block` style for economy formulas

**JavaScript Requirements**:
- Wallet connection handlers
- Balance fetching (when online)
- Transaction list rendering
- Offline mode detection

---

### 6. `/games/` — Universal ROM Games

**Purpose**: Showcase accessible games and creative tools

**Features**:
- Game gallery with cards
- Each game card shows:
  - Title
  - Description
  - Accessibility features
  - Play button/link
  - Screenshots/demos
- Filter by:
  - Accessibility features
  - Age range
  - Game type
- "Play Now" functionality (embedded or links)
- Educational resources
- Community contributions section

**Components to Use**:
- `.stack-grid` for game cards
- `.stack-card` style for individual games
- Custom `.game-preview` for embedded demos
- `.contact-grid` style for community links

---

### 7. `/education/` — Learning Resources

**Purpose**: Educational content about P31, assistive tech, and related topics

**Features**:
- Course/tutorial listings
- Video embeds (with transcripts)
- Interactive tutorials
- Downloadable resources
- Learning paths:
  - For developers
  - For users
  - For educators
  - For researchers
- Glossary of terms
- FAQ section

**Components to Use**:
- `.section` for course sections
- `.stack-card` style for course cards
- `.math-block` style for code examples
- Custom `.tutorial-nav` for navigation

---

### 8. `/blog/` — Blog/News

**Purpose**: Updates, announcements, and technical deep-dives

**Features**:
- Blog post listing (chronological)
- Post cards with:
  - Title
  - Excerpt
  - Author
  - Date
  - Tags/categories
  - Read time estimate
- Individual post pages (if needed)
- RSS feed link
- Category/tag filtering
- Search functionality
- Pagination

**Components to Use**:
- `.stack-grid` for post listings
- `.stack-card` style for post cards
- `.section-header` for post titles
- `.why-text` style for post content

---

### 9. `/legal/` — Legal & Compliance

**Purpose**: Legal documents, privacy policy, terms, compliance info

**Features**:
- Privacy Policy
- Terms of Service
- License information (Apache 2.0)
- Regulatory compliance (FDA, medical device)
- Fiscal sponsorship disclosure
- Data handling practices
- Cookie policy (if applicable)
- Contact for legal inquiries

**Components to Use**:
- `.section` for each document
- `.section-header` for document titles
- `.why-text` style for legal text
- `.math-block` style for code/license blocks

---

### 10. `/accessibility/` — Accessibility Statement

**Purpose**: Detailed accessibility information and commitment

**Features**:
- WCAG 2.1 AA compliance statement
- Accessibility features list
- Known issues and roadmap
- How to report accessibility issues
- Keyboard shortcuts
- Screen reader compatibility
- High contrast mode
- Reduced motion support
- Contact for accessibility concerns

**Components to Use**:
- `.section-header` for major sections
- `.stack-card` style for feature cards
- `.why-text` style for detailed descriptions
- Custom `.a11y-checklist` for compliance items

---

### 11. `/press/` — Press Kit

**Purpose**: Media resources and press information

**Features**:
- Press releases
- Media kit downloads:
  - Logo files (SVG, PNG)
  - Brand guidelines
  - High-res images
  - Fact sheet
- Press contact information
- Media mentions
- Speaking engagements
- Awards/recognition

**Components to Use**:
- `.section` for press releases
- `.contact-link` style for press contacts
- `.stack-card` style for media kit items
- Custom `.download-button` for files

---

## Implementation Checklist

For each page you build:

- [ ] Use standard page structure (head, nav, main, footer)
- [ ] Include skip-to-content link
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] All interactive elements have ARIA labels
- [ ] Focus states on all clickable elements
- [ ] Responsive design (test at 768px and 480px breakpoints)
- [ ] Use CSS variables from styles.css (no hardcoded colors)
- [ ] No inline styles or scripts
- [ ] Semantic HTML5 elements
- [ ] Proper meta tags (title, description, OG tags)
- [ ] Test with keyboard navigation
- [ ] Test with screen reader (or at least verify ARIA)
- [ ] Reduced motion support
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Performance: Lazy load images, optimize assets
- [ ] Accessibility: WCAG 2.1 AA compliance

---

## CSS Extensions

When adding new components, extend `styles.css` with:

1. **Component-specific classes** (e.g., `.doc-nav`, `.timeline-item`)
2. **Utility classes** if needed (e.g., `.text-center`, `.mb-2`)
3. **Responsive breakpoints** using existing media queries
4. **Animation keyframes** if adding new animations
5. **Dark mode support** (already using CSS variables, so automatic)

**Naming Convention**:
- Use kebab-case for class names
- Prefix page-specific classes with page name (e.g., `.wallet-balance`, `.blog-post-card`)
- Reuse existing component classes when possible

---

## JavaScript Extensions

When adding interactive features:

1. **Add to main.js** if it's a shared feature
2. **Create page-specific JS file** (e.g., `wallet.js`) if it's page-only
3. **Use event delegation** for dynamic content
4. **Error handling** for all async operations
5. **Offline detection** and graceful degradation
6. **Accessibility**: Ensure keyboard navigation works

**Pattern**:
```javascript
// In main.js or page-specific file
(function() {
  'use strict';
  
  function initPageFeature() {
    const element = document.querySelector('.feature-element');
    if (!element) return;
    
    // Feature implementation
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    initPageFeature();
  });
})();
```

---

## Content Guidelines

### Tone & Voice
- Technical but accessible
- Clear and direct
- No marketing fluff
- Focus on what it does, not what it "could" do
- Use "we" for P31 Labs, "you" for users

### Terminology
- Use established P31 terminology (Node One, The Buffer, The Scope)
- Define technical terms on first use
- Link to glossary or docs for complex concepts
- Use code formatting for technical terms: `` `ESP32-S3` ``

### Links
- Internal links: Relative paths (`/docs/`, `../index.html`)
- External links: Full URLs with `target="_blank" rel="noopener"`
- GitHub links: Use `https://github.com/p31labs/[repo]`

---

## Testing Requirements

Before considering a page complete:

1. **Visual Testing**
   - Desktop (1920px, 1440px, 1280px)
   - Tablet (768px)
   - Mobile (480px, 375px)
   - High contrast mode
   - Reduced motion mode

2. **Functional Testing**
   - All links work
   - All buttons/forms function
   - JavaScript features work
   - Offline mode (if applicable)
   - Error states handled

3. **Accessibility Testing**
   - Keyboard navigation (Tab, Enter, Space, Arrow keys)
   - Screen reader (NVDA, JAWS, or VoiceOver)
   - Color contrast (WCAG AA minimum)
   - Focus indicators visible
   - Skip links work

4. **Performance Testing**
   - Page load time < 3 seconds
   - No layout shift (CLS)
   - Images optimized
   - JavaScript minified (for production)

---

## Quick Reference: Existing Components

### Layout
- `.container` — Max-width wrapper with padding
- `.section` — Section spacing
- `.section-dark` — Dark background section
- `.section-header` — Section title/description

### Cards
- `.stack-card` — Main card component
- `.economy-card` — Economy/pool cards
- `.math-block` — Technical/math content blocks

### Buttons
- `.btn` — Base button
- `.btn-primary` — Primary action (phosphorus green)
- `.btn-ghost` — Secondary action (outlined)

### Typography
- `.hero` — Hero section
- `.hero-sub` — Hero subtitle
- `.why-text` — Body text style
- `.founder-title` — Small label text

### Interactive
- `.contact-link` — Link cards
- `.nav-links` — Navigation links
- `.foot-links` — Footer links

### Utilities
- `.sr-only` — Screen reader only text
- `.skip-link` — Skip to content link
- `.reveal` — Scroll reveal animation

---

## Example: Building `/docs/` Page

```html
<main id="main-content">
  <section class="section">
    <div class="container">
      <div class="section-header">
        <span class="section-label">Documentation</span>
        <h1>P31 Labs Documentation</h1>
        <p>Complete technical documentation for Node One, The Buffer, The Scope, and the Phenix Navigator architecture.</p>
      </div>

      <div class="stack-grid">
        <article class="stack-card">
          <div class="card-header">
            <span class="card-tag">HARDWARE</span>
          </div>
          <h3>Node One</h3>
          <p>ESP32-S3 firmware, LoRa mesh networking, haptic feedback, and hardware specifications.</p>
          <a href="/docs/node-one/" class="btn btn-ghost">View Docs →</a>
        </article>

        <!-- More doc cards... -->
      </div>
    </div>
  </section>
</main>
```

---

## Final Notes

- **Consistency is key**: Reuse existing components and patterns
- **Accessibility first**: Build with screen readers and keyboard users in mind
- **Progressive enhancement**: Core functionality works without JavaScript
- **Performance matters**: Optimize images, lazy load content, minimize JS
- **The Mesh Holds**: Every page should reflect P31's core principles

**When in doubt, reference the homepage (`index.html`) for patterns and structure.**

---

**Ready to build? Start with one page, follow this prompt, and iterate. The geometry protects the signal. 🔺**
