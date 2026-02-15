# P31 Labs Website — Testing Checklist

## Quick Test Results

Run these tests and check off as you complete them:

### Performance (Lighthouse)
- [ ] Performance score: ___ (target: 90+)
- [ ] First Contentful Paint: ___ (target: < 1.5s)
- [ ] Largest Contentful Paint: ___ (target: < 2.5s)
- [ ] Time to Interactive: ___ (target: < 3.5s)
- [ ] Cumulative Layout Shift: ___ (target: < 0.1)
- [ ] Total Blocking Time: ___ (target: < 200ms)

### SEO
- [ ] SEO score: ___ (target: 100)
- [ ] Structured data valid (JSON-LD)
- [ ] Meta tags present (Open Graph, Twitter)
- [ ] Microdata on products
- [ ] Sitemap accessible
- [ ] Robots.txt present

### Accessibility
- [ ] Accessibility score: ___ (target: 100)
- [ ] Skip link works (Tab key)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA
- [ ] Heading hierarchy correct

### Best Practices
- [ ] HTTPS enabled
- [ ] No console errors
- [ ] No deprecated APIs
- [ ] Proper viewport meta tag
- [ ] Font-display: swap working
- [ ] DNS prefetch/preconnect working

## Browser Tests

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Mobile Tests

- [ ] Responsive at 320px width
- [ ] Responsive at 768px width
- [ ] Responsive at 1024px width
- [ ] Touch targets adequate (44x44px)
- [ ] No horizontal scrolling
- [ ] Theme color shows in mobile browser

## Network Tests

- [ ] Loads on 3G connection
- [ ] Fonts load without blocking
- [ ] DNS prefetch timing correct
- [ ] No render-blocking resources

## Content Verification

- [ ] All brand colors correct
- [ ] All links work
- [ ] Contact info correct
- [ ] No OPSEC violations
- [ ] Brand voice consistent

## Automated Test URLs

1. **PageSpeed Insights:** https://pagespeed.web.dev/?url=https://phosphorus31.org
2. **WAVE:** https://wave.webaim.org/report#/https://phosphorus31.org
3. **Rich Results Test:** https://search.google.com/test/rich-results?url=https://phosphorus31.org
4. **Mobile-Friendly:** https://search.google.com/test/mobile-friendly?url=https://phosphorus31.org
5. **HTML Validator:** https://validator.w3.org/nu/?doc=https://phosphorus31.org

## Console Commands

Run these in browser console to verify optimizations:

```javascript
// Check structured data
JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)

// Check CSS containment
getComputedStyle(document.querySelector('.product-card')).contain
// Should return: "layout style paint"

// Check will-change
getComputedStyle(document.querySelector('.btn')).willChange
// Should return: "transform"

// Check skip link exists
document.querySelector('.skip-link')
// Should return: <a class="skip-link" href="#main-content">

// Check font-display
fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')
  .then(r => r.text())
  .then(t => console.log('Font-display swap:', t.includes('font-display:swap')))
// Should log: Font-display swap: true
```

## Performance Budget

- **HTML:** < 50KB (gzipped)
- **CSS:** < 20KB (gzipped)
- **Fonts:** < 100KB (woff2)
- **Total:** < 200KB (gzipped)
- **Load Time:** < 3s on 3G

## Known Issues

- None currently

## Test Date

- Date: ___________
- Tester: ___________
- Environment: ___________
- Browser: ___________

---

**Status:** Ready for testing  
**Last Updated:** 2026-02-14

*The Mesh Holds. 🔺*
