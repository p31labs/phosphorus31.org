# 🚀 Final Build/Launch Checklist — phosphorus31.org

**Date:** 2026-02-14  
**Status:** Pre-Launch  
**Priority:** 🟡 HIGH — Accelerator application deadline: Feb 27, 2026

---

## 📋 PRE-DEPLOYMENT CHECKS

### Git & Version Control
- [ ] **Review uncommitted changes**
  - [ ] Modified HTML files reviewed (13 pages)
  - [ ] New `donate/` directory reviewed
  - [ ] Documentation files reviewed
- [ ] **Commit all changes**
  ```powershell
  git add .
  git commit -m "feat: final pre-launch updates - all pages enhanced"
  ```
- [ ] **Verify remote repository**
  ```powershell
  git remote -v
  # Should show: https://github.com/p31labs/phosphorus31.org.git
  ```
- [ ] **Push to remote**
  ```powershell
  git push origin main
  ```

### File Verification
- [ ] **Core files present**
  - [x] `index.html` (main landing page)
  - [x] `styles.css` (design system)
  - [x] `main.js` (interactive features)
  - [x] `CNAME` (phosphorus31.org)
  - [x] `robots.txt`
  - [x] `sitemap.xml`
  - [x] `LICENSE` (Apache 2.0)
- [ ] **All subpages present**
  - [x] `/about/`
  - [x] `/docs/`
  - [x] `/roadmap/`
  - [x] `/node-one/`
  - [x] `/wallet/`
  - [x] `/games/`
  - [x] `/education/`
  - [x] `/blog/`
  - [x] `/legal/`
  - [x] `/accessibility/`
  - [x] `/press/`
  - [x] `/manifesto/`
  - [x] `/donate/` (new)
- [ ] **Assets verified**
  - [ ] Favicon files (`/assets/logos/favicon.svg`, `.png`)
  - [ ] Logo files present
  - [ ] No broken image links

### OPSEC & Privacy Check
- [ ] **No personal information exposed**
  - [ ] No full names (only "Will", "Bash", "Willow")
  - [ ] No addresses (state-level only: "Georgia")
  - [ ] No phone numbers
  - [ ] No SSN/EIN (until publicly filed)
  - [ ] No case numbers or docket references
- [ ] **Children's privacy protected**
  - [ ] No birthdates (ages only: 10 and 6)
  - [ ] No school names
  - [ ] No location data
  - [ ] No medical information

### Brand & Content Compliance
- [ ] **Brand voice verified**
  - [ ] Tagline: "The Mesh Holds. 🔺"
  - [ ] Colors: Phosphorus Green (#2ecc71), Calcium Blue (#60a5fa)
  - [ ] Typography: Outfit (display), JetBrains Mono (monospace)
  - [ ] Chemical signature: Ca₁₀(PO₄)₆(OH)₂
- [ ] **Content accuracy**
  - [ ] Mission statement correct
  - [ ] Technology stack accurate
  - [ ] Links to GitHub repos work
  - [ ] Contact email: will@p31ca.org

### Technical Quality
- [ ] **HTML validation**
  - [ ] Semantic HTML5
  - [ ] Proper heading hierarchy (h1 → h2 → h3)
  - [ ] All images have alt text
  - [ ] All links have descriptive text
- [ ] **Accessibility (WCAG 2.1 AA)**
  - [ ] Skip-to-content link present
  - [ ] ARIA labels on interactive elements
  - [ ] Keyboard navigation works
  - [ ] Focus indicators visible
  - [ ] Screen reader compatible
  - [ ] `prefers-reduced-motion` respected
- [ ] **Performance**
  - [ ] Fonts load asynchronously (media="print" onload)
  - [ ] No render-blocking resources
  - [ ] Images optimized (SVG preferred)
  - [ ] CSS minified (if applicable)
  - [ ] JavaScript minified (if applicable)

---

## 🚀 DEPLOYMENT STEPS

### Option 1: Cloudflare Pages (RECOMMENDED)

1. **Navigate to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Go to: **Pages** (left sidebar)

2. **Create/Update Project**
   - If project exists: It will auto-deploy on push
   - If new: **Create a project** → **Connect to Git** → **GitHub**

3. **Repository Configuration**
   - Repository: `p31labs/phosphorus31.org`
   - Branch: `main`
   - Root directory: `/` (or leave default)

4. **Build Settings**
   ```
   Framework preset: None
   Build command: (leave empty)
   Build output directory: / (root)
   Root directory: / (root)
   ```

5. **Deploy**
   - Click: **Save and Deploy**
   - Wait: 1-2 minutes for first build
   - Verify: Build succeeds (green checkmark)

6. **Custom Domain Setup**
   - Go to: **Custom domains** tab
   - Click: **Set up a custom domain**
   - Enter: `phosphorus31.org`
   - Click: **Continue**
   - DNS will auto-configure

7. **SSL Certificate**
   - Go to: **SSL/TLS** → **Overview** (in main Cloudflare dashboard)
   - Mode: **Full (strict)**
   - Wait: < 5 minutes for certificate issuance
   - Verify: Green lock icon appears

8. **Optional: Add www subdomain**
   - In Custom domains: Add `www.phosphorus31.org`
   - Auto-redirects to main domain

### Option 2: GitHub Pages (Alternative)

1. **Repository Setup**
   ```powershell
   cd C:\Users\sandra\Downloads\phenix-navigator-creator67\website
   git remote add origin https://github.com/p31labs/phosphorus31.org.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to: Repository → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/**
   - Save

3. **Configure DNS (Cloudflare)**
   - Add CNAME:
     - Name: `phosphorus31.org`
     - Target: `p31labs.github.io` (or your GitHub Pages URL)
     - Proxy: ✅ (orange cloud)

4. **Enable HTTPS**
   - Cloudflare: SSL/TLS → **Full (strict)**
   - GitHub Pages: Settings → Pages → ✅ **Enforce HTTPS**

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Basic Functionality
- [ ] **Homepage loads**
  - URL: `https://phosphorus31.org`
  - Status: 200 OK
  - Loads in < 1 second
- [ ] **HTTPS working**
  - Green lock icon in browser
  - Certificate valid (not expired)
  - No mixed content warnings
- [ ] **www redirect**
  - `https://www.phosphorus31.org` → redirects to `https://phosphorus31.org`
- [ ] **All subpages accessible**
  - `/about/`
  - `/docs/`
  - `/roadmap/`
  - `/node-one/`
  - `/wallet/`
  - `/games/`
  - `/education/`
  - `/blog/`
  - `/legal/`
  - `/accessibility/`
  - `/press/`
  - `/manifesto/`
  - `/donate/`

### SEO & Metadata
- [ ] **Open Graph tags work**
  - Test: Paste URL in Slack/Twitter/Discord
  - Preview shows: Title, description, image
- [ ] **robots.txt accessible**
  - URL: `https://phosphorus31.org/robots.txt`
  - Status: 200 OK
- [ ] **sitemap.xml accessible**
  - URL: `https://phosphorus31.org/sitemap.xml`
  - Status: 200 OK
  - Valid XML format

### Performance Testing
- [ ] **PageSpeed Insights**
  - URL: https://pagespeed.web.dev/?url=https://phosphorus31.org
  - Performance score: 90+
  - FCP: < 1.5s
  - LCP: < 2.5s
  - TTI: < 3.5s
- [ ] **Mobile responsive**
  - Test on actual device (iPhone/Android)
  - Test at 320px, 768px, 1024px widths
  - No horizontal scrolling
  - Touch targets adequate (44x44px)

### Accessibility Testing
- [ ] **WAVE Accessibility Checker**
  - URL: https://wave.webaim.org/report#/https://phosphorus31.org
  - Errors: 0
  - Contrast: Passes WCAG AA
- [ ] **Keyboard navigation**
  - Tab through all interactive elements
  - Enter/Space activate buttons
  - Skip link works
- [ ] **Screen reader**
  - Test with NVDA/JAWS/VoiceOver
  - All content announced correctly
  - Headings structure logical

### Browser Compatibility
- [ ] **Chrome/Edge** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

### Console & Errors
- [ ] **No JavaScript errors**
  - Open DevTools → Console
  - No red errors
  - Warnings acceptable (non-critical)
- [ ] **No 404 errors**
  - Check Network tab
  - All resources load (200/304)
- [ ] **No CORS errors**
  - All cross-origin requests succeed

---

## 📝 POST-LAUNCH TASKS

### Search Engine Submission
- [ ] **Google Search Console**
  - URL: https://search.google.com/search-console
  - Add property: `https://phosphorus31.org`
  - Verify ownership (DNS or HTML file)
  - Submit sitemap: `https://phosphorus31.org/sitemap.xml`
- [ ] **Bing Webmaster Tools** (optional)
  - URL: https://www.bing.com/webmasters
  - Add site and verify

### Social Media & Sharing
- [ ] **Test social sharing**
  - Paste URL in Slack
  - Paste URL in Twitter/X
  - Paste URL in Discord
  - Verify Open Graph preview shows correctly
- [ ] **Update profiles** (if applicable)
  - GitHub organization: Add website URL
  - Social media bios: Add website URL

### Documentation Updates
- [ ] **Update status files**
  - Mark as deployed in `DEPLOYMENT_STATUS.md`
  - Update `WEBSITE_STATUS.md`
- [ ] **Add to accelerator application**
  - Include URL: `https://phosphorus31.org`
  - Deadline: Feb 27, 2026

### Monitoring Setup (Optional)
- [ ] **Uptime monitoring**
  - Set up: UptimeRobot, Pingdom, or similar
  - Alert on downtime
- [ ] **Analytics** (if desired)
  - Privacy-respecting: Plausible, Fathom, or self-hosted
  - NO Google Analytics (privacy-first principle)

---

## 🆘 TROUBLESHOOTING

### DNS Not Resolving
- **Wait:** 5-30 minutes for propagation
- **Check:** Cloudflare DNS tab for correct records
- **Verify:** Proxy enabled (orange cloud)
- **Test:** `nslookup phosphorus31.org`

### SSL Certificate Pending
- **Wait:** Up to 24 hours (usually < 5 minutes)
- **Check:** SSL/TLS mode is "Full (strict)"
- **Verify:** DNS records correct
- **Test:** `openssl s_client -connect phosphorus31.org:443`

### Build Fails
- **Check:** Build output directory is correct
- **Verify:** `index.html` is in root or specified directory
- **Review:** Build logs in deployment dashboard
- **Fix:** Adjust build settings or file structure

### 404 Errors
- **Verify:** `index.html` is in build output directory
- **Check:** Routing settings (SPA vs static)
- **Ensure:** No redirect rules conflict
- **Test:** All subpage URLs manually

### Performance Issues
- **Optimize:** Images (compress, convert to WebP)
- **Minify:** CSS and JavaScript
- **Enable:** Cloudflare caching (Auto Minify)
- **Check:** Font loading strategy

---

## 📊 QUICK TEST COMMANDS

```powershell
# Test HTTPS
curl -I https://phosphorus31.org

# Test www redirect
curl -I https://www.phosphorus31.org

# Check SSL certificate
openssl s_client -connect phosphorus31.org:443 -servername phosphorus31.org

# Test DNS resolution
nslookup phosphorus31.org

# Check robots.txt
curl https://phosphorus31.org/robots.txt

# Check sitemap
curl https://phosphorus31.org/sitemap.xml
```

---

## ✅ FINAL SIGN-OFF

**Pre-Deployment Checklist:**
- [ ] All files committed and pushed
- [ ] OPSEC verified (no personal info)
- [ ] Brand compliance verified
- [ ] Accessibility tested
- [ ] Performance optimized

**Deployment:**
- [ ] Cloudflare Pages configured
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Build successful

**Post-Deployment:**
- [ ] All pages load correctly
- [ ] HTTPS working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SEO files accessible

**Documentation:**
- [ ] Status files updated
- [ ] URL added to accelerator application

---

## 🎯 SUCCESS CRITERIA

✅ **Launch is successful when:**
1. `https://phosphorus31.org` loads in < 1 second
2. All 13+ pages accessible
3. HTTPS certificate valid (green lock)
4. Mobile responsive (no horizontal scroll)
5. Accessibility score: 100 (Lighthouse)
6. Performance score: 90+ (Lighthouse)
7. No OPSEC violations
8. Open Graph preview works
9. Ready for accelerator application submission

---

**Status:** Ready for final deployment  
**Last Updated:** 2026-02-14  
**Next Action:** Commit changes → Push → Deploy via Cloudflare Pages

**The Mesh Holds. 🔺**
