# phosphorus31.org — Support Section + JSON-LD Donation Patch

## 1. Add "Support" to nav

FIND (in website/index.html):
```html
    <a href="#contact">Contact</a>
```

REPLACE WITH:
```html
    <a href="#contact">Contact</a>
    <a href="#support">Support</a>
```

---

## 2. Add Support section (between Contact and Footer)

FIND:
```html
  <!-- ═══════════════════ FOOTER ═══════════════════ -->
  <footer>
```

INSERT BEFORE:
```html
  <!-- ═══════════════════ SUPPORT ═══════════════════ -->
  <section id="support">
    <div class="section-label">Support</div>
    <h2>Fund open-source assistive technology.</h2>
    <p>
      P31 Labs is building cognitive prosthetics that should exist for every neurodivergent person.
      All donations are tax-deductible and processed through our fiscal sponsor.
      Every dollar funds development, hardware prototyping, and keeping the work open source.
    </p>
    <p>
      You can also support this work by subscribing to The Geodesic Self on Substack,
      where we publish weekly dispatches from the build — the science, the engineering, 
      and the personal reality of building assistive technology while navigating the systems
      it's designed to help you survive.
    </p>
    <div class="cta-group">
      <a href="[HCB_DONATE_URL]" target="_blank" rel="noopener" class="cta cta-primary">
        Donate →
      </a>
      <a href="https://thegeodesicself.substack.com" target="_blank" rel="noopener" class="cta cta-secondary">
        Subscribe (Free)
      </a>
    </div>
  </section>

```

---

## 3. Add JSON-LD DonateAction

FIND (in the JSON-LD script block):
```json
  "knowsAbout": ["assistive technology", "neurodivergence", "ADHD", "autism", "quantum biology", "embedded systems"]
```

REPLACE WITH:
```json
  "knowsAbout": ["assistive technology", "neurodivergence", "ADHD", "autism", "quantum biology", "embedded systems"],
  "potentialAction": {
    "@type": "DonateAction",
    "target": "[HCB_DONATE_URL]",
    "name": "Donate to P31 Labs",
    "description": "Support open-source assistive technology for neurodivergent individuals"
  }
```

---

## 4. Placeholder Note

All instances of `[HCB_DONATE_URL]` need to be replaced with the actual HCB donation page URL once available. Use find-and-replace across:
- website/index.html (2 instances: Support section + JSON-LD)
- docs/substack/cross-link-footer.md (1 instance)
- docs/github-profile-README.md (1 instance)

Total: 4 replacements when the URL is known.
