# SWARM 02: WEBSITE DEPLOY — phosphorus31.org
## 4 Agents · Phase 0 Critical · Deadline: Feb 27
**Generated:** 2026-02-14 · **Classification:** INTERNAL · **OPSEC:** Clean

> **PURPOSE:** Deploy phosphorus31.org landing page to production. Required for Multiple Autism Tech Accelerator application (Feb 27 deadline). Domain is active in Cloudflare. Files are ready. Deploy via Cloudflare Pages (recommended) or alternative.

---

## CONTEXT INJECTION

### §00 — P31 AGENT BIBLE (Embedded)
- **Entity:** P31 Labs (Phosphorus-31), Georgia 501(c)(3) in formation
- **Mission:** Assistive technology for neurodivergent individuals
- **Domain:** phosphorus31.org (active in Cloudflare)
- **Contact:** will@p31ca.org
- **GitHub:** github.com/p31labs
- **Brand:** Phosphorus Green (#2ecc71), Calcium Blue (#60a5fa), Near-black (#050510)
- **Tagline:** "The Mesh Holds. 🔺"

### §01 — OPSEC RULES (Embedded)
- ✅ No surnames, no children's legal names, no addresses
- ✅ Contact: will@p31ca.org (safe)
- ✅ Domain: phosphorus31.org (safe)
- ✅ All website content verified OPSEC-clean

### §02 — BRAND VOICE (Embedded)
- Tone: Technical, accessible, Fullerian
- Style: Clear, direct, no marketing fluff
- Colors: Phosphorus Green, Calcium Blue, Near-black

---

## SWARM STRUCTURE

| Agent | Task | Est. Time | Dependencies |
|-------|------|-----------|--------------|
| **Agent 1** | Pre-flight verification | 15 min | None |
| **Agent 2** | Repository setup | 10 min | Agent 1 |
| **Agent 3 | Cloudflare Pages deploy | 20 min | Agent 2 |
| **Agent 4** | Post-deploy verification | 15 min | Agent 3 |

**Total: ~60 minutes**

---

## AGENT 1: PRE-FLIGHT VERIFICATION

### Mission
Verify all website files are ready, OPSEC-compliant, and deployment-ready.

### Tasks
1. **File Structure Check**
   ```bash
   cd website/
   ls -la
   ```
   - [ ] `index.html` exists and is complete
   - [ ] `styles.css` exists
   - [ ] `main.js` exists (if used)
   - [ ] `robots.txt` exists
   - [ ] `sitemap.xml` exists
   - [ ] `CNAME` file exists (contains: `phosphorus31.org`)

2. **OPSEC Audit**
   - [ ] No surnames in HTML
   - [ ] No children's names
   - [ ] No addresses (state-level only: "Georgia")
   - [ ] Contact email: `will@p31ca.org` ✅
   - [ ] GitHub: `github.com/p31labs` ✅
   - [ ] Domain: `phosphorus31.org` ✅

3. **Content Verification**
   - [ ] Brand colors correct (Phosphorus Green #2ecc71, Calcium Blue #60a5fa)
   - [ ] Tagline present: "The Mesh Holds. 🔺"
   - [ ] All three products listed (The Buffer, Node One, The Scope)
   - [ ] Footer: "Apache 2.0 Licensed"
   - [ ] Mobile responsive (viewport meta tag present)

4. **SEO Files**
   - [ ] `robots.txt` allows all crawlers, points to sitemap
   - [ ] `sitemap.xml` has correct domain (`https://phosphorus31.org`)
   - [ ] Open Graph tags in `<head>`
   - [ ] Twitter Card tags present
   - [ ] Structured data (JSON-LD) present

5. **Local Test**
   ```bash
   # Open in browser
   start index.html
   # Or
   python -m http.server 8000
   # Visit: http://localhost:8000
   ```
   - [ ] Page renders correctly
   - [ ] No console errors
   - [ ] All links work
   - [ ] Images load

### Validation Gate
**PASS if:** All files present, OPSEC-clean, renders locally without errors.

**FAIL if:** Missing files, OPSEC violations, rendering errors.

### Output
Create: `website/AGENT1_VERIFICATION_COMPLETE.md`
- List all verified files
- OPSEC status: ✅ CLEAN
- Any warnings or notes

---

## AGENT 2: REPOSITORY SETUP

### Mission
Ensure website files are in a Git repository, ready for Cloudflare Pages deployment.

### Tasks
1. **Check Git Status**
   ```bash
   cd website/
   git status
   ```

2. **Option A: Use Existing Repo (phenix-navigator-creator67)**
   ```bash
   cd C:\Users\sandra\Downloads\phenix-navigator-creator67
   git status
   git add website/
   git commit -m "deploy: phosphorus31.org landing page ready for Cloudflare Pages"
   git push origin main
   ```
   - Note: Cloudflare Pages will need build output directory: `/website`

3. **Option B: Create Dedicated Repo (Cleaner)**
   ```bash
   # Create new repo on GitHub: trimtab-signal/phosphorus31.org
   cd C:\Users\sandra\Downloads\phenix-navigator-creator67\website
   git init
   git add .
   git commit -m "Initial commit: P31 Labs landing page"
   git branch -M main
   git remote add origin https://github.com/trimtab-signal/phosphorus31.org.git
   git push -u origin main
   ```
   - Note: If repo doesn't exist, create it on GitHub first

4. **Verify Push**
   ```bash
   git log --oneline -1
   git remote -v
   ```

### Validation Gate
**PASS if:** Files are committed and pushed to GitHub, accessible via web.

**FAIL if:** Git errors, files not pushed, repo not accessible.

### Output
Create: `website/AGENT2_REPO_READY.md`
- Repository URL
- Commit hash
- Build output directory path (for Cloudflare Pages)

---

## AGENT 3: CLOUDFLARE PAGES DEPLOYMENT

### Mission
Deploy website to Cloudflare Pages and configure custom domain.

### Manual Steps (Cloudflare Dashboard)
1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Navigate to: **Pages** (left sidebar)

2. **Create New Project**
   - Click: **"Create a project"**
   - Click: **"Connect to Git"**
   - Select: **GitHub**
   - Authorize Cloudflare (if first time)
   - Select repository:
     - **Option A:** `trimtab-signal/phenix-navigator-creator67` (if using existing repo)
     - **Option B:** `trimtab-signal/phosphorus31.org` (if using dedicated repo)

3. **Configure Build Settings**
   ```
   Framework preset: None (or "Static")
   Build command: (leave empty)
   Build output directory: /website (if using existing repo) OR / (if dedicated repo)
   Root directory: / (or /website if subdirectory)
   ```

4. **Deploy**
   - Click: **"Save and Deploy"**
   - Wait 1-2 minutes for first build
   - Note the project URL: `https://[project-name].pages.dev`

5. **Add Custom Domain**
   - In project: Go to **Custom domains** tab
   - Click: **"Set up a custom domain"**
   - Enter: `phosphorus31.org`
   - Click: **"Continue"**
   - Cloudflare will auto-add DNS records

6. **Verify DNS**
   - Go to: **DNS** tab (main Cloudflare dashboard)
   - Verify record exists:
     - `phosphorus31.org` → CNAME → `[project].pages.dev`
     - Proxy status: ✅ Proxied (orange cloud)

7. **SSL Configuration**
   - Go to: **SSL/TLS** → **Overview**
   - Mode: **Full (strict)**
   - Certificate will auto-provision (usually < 5 minutes)

8. **Optional: Add www Subdomain**
   - In Custom domains: Click **"Add a custom domain"**
   - Enter: `www.phosphorus31.org`
   - Cloudflare will auto-configure redirect

### Automated Verification
```bash
# Test HTTPS (wait 5-10 minutes after deployment)
curl -I https://phosphorus31.org

# Expected: HTTP/2 200
# If 404 or error, wait longer for DNS/SSL propagation
```

### Validation Gate
**PASS if:** 
- Project deployed successfully
- Custom domain added
- DNS records correct
- SSL certificate provisioning (may take 5-30 minutes)

**FAIL if:**
- Build errors
- DNS not resolving
- SSL certificate errors

### Output
Create: `website/AGENT3_DEPLOYMENT_COMPLETE.md`
- Cloudflare Pages project URL
- Custom domain status
- DNS record details
- SSL certificate status
- Any warnings or issues

---

## AGENT 4: POST-DEPLOYMENT VERIFICATION

### Mission
Verify website is live, accessible, and meets all requirements.

### Tasks
1. **HTTPS Verification**
   ```bash
   curl -I https://phosphorus31.org
   ```
   - [ ] Returns HTTP/2 200 (not 404, not 301 to HTTP)
   - [ ] SSL certificate valid (green lock in browser)
   - [ ] No mixed content warnings

2. **www Redirect**
   ```bash
   curl -I https://www.phosphorus31.org
   ```
   - [ ] Redirects to `https://phosphorus31.org` (301 or 302)
   - [ ] Or serves same content

3. **Page Load Test**
   - [ ] Open: https://phosphorus31.org
   - [ ] Page loads in < 1 second
   - [ ] No console errors (F12 → Console)
   - [ ] All images load
   - [ ] All links work

4. **Mobile Responsive**
   - [ ] Test on phone or browser dev tools (F12 → Toggle device toolbar)
   - [ ] Layout adapts correctly
   - [ ] Text readable
   - [ ] Buttons/links tappable

5. **SEO Files**
   ```bash
   curl https://phosphorus31.org/robots.txt
   curl https://phosphorus31.org/sitemap.xml
   ```
   - [ ] `robots.txt` accessible
   - [ ] `sitemap.xml` accessible
   - [ ] Content correct

6. **Open Graph Test**
   - [ ] Paste URL in Slack/Discord/Twitter
   - [ ] Preview shows correctly (title, description, image)
   - [ ] Or use: https://www.opengraph.xyz/url/https://phosphorus31.org

7. **Performance Check**
   - [ ] Test: https://pagespeed.web.dev/?url=https://phosphorus31.org
   - [ ] Mobile score: > 90
   - [ ] Desktop score: > 90
   - [ ] Load time: < 1 second

8. **OPSEC Final Check**
   - [ ] No personal information exposed
   - [ ] Contact email: `will@p31ca.org` ✅
   - [ ] No addresses
   - [ ] No children's names

### Validation Gate
**PASS if:**
- HTTPS works
- Page loads correctly
- Mobile responsive
- SEO files accessible
- Open Graph works
- Performance acceptable
- OPSEC clean

**FAIL if:**
- Any critical issues (404, SSL errors, broken layout)

### Output
Create: `website/AGENT4_VERIFICATION_COMPLETE.md`
- All test results
- Performance scores
- Open Graph preview URL
- Final status: ✅ LIVE or ⚠️ ISSUES

---

## ALTERNATIVE DEPLOYMENT OPTIONS

### Option B: GitHub Pages
If Cloudflare Pages fails:

1. Create repo: `trimtab-signal/phosphorus31.org`
2. Copy `website/` contents to repo root
3. Enable Pages: Settings → Pages → main branch, `/` root
4. Add `CNAME` file: `phosphorus31.org`
5. Configure Cloudflare DNS:
   - CNAME: `phosphorus31.org` → `trimtab-signal.github.io`
   - CNAME: `www` → `trimtab-signal.github.io`
6. Enable "Always Use HTTPS" in Cloudflare

### Option C: Vercel
If both fail:

1. Install: `npm i -g vercel`
2. Navigate: `cd website/`
3. Deploy: `vercel --prod`
4. Add domain: `phosphorus31.org`
5. Update Cloudflare DNS: CNAME → Vercel provided URL

---

## POST-DEPLOYMENT TASKS

1. **Google Search Console**
   - URL: https://search.google.com/search-console
   - Add property: `https://phosphorus31.org`
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: `https://phosphorus31.org/sitemap.xml`

2. **Update Accelerator Application**
   - Add website URL: `https://phosphorus31.org`
   - Verify link works in application

3. **Monitor**
   - Cloudflare Analytics (in Pages dashboard)
   - Uptime monitoring (optional)

---

## TROUBLESHOOTING

### DNS Not Resolving
- Wait 5-30 minutes for propagation
- Check Cloudflare DNS tab for correct records
- Ensure proxy is enabled (orange cloud)

### SSL Certificate Pending
- Wait up to 24 hours (usually < 5 minutes)
- Check SSL/TLS mode is "Full (strict)"
- Verify DNS records are correct

### Build Fails
- Check build output directory is correct
- Ensure `index.html` is in root or specified directory
- Review build logs in Cloudflare Pages dashboard

### 404 Errors
- Verify `index.html` is in build output directory
- Check Cloudflare Pages routing settings
- Ensure no `.htaccess` or redirect rules conflict

---

## SUCCESS CRITERIA

✅ **Website is live at:** https://phosphorus31.org  
✅ **HTTPS works:** Green lock icon  
✅ **Mobile responsive:** Layout adapts correctly  
✅ **Performance:** < 1 second load time  
✅ **SEO files:** robots.txt, sitemap.xml accessible  
✅ **Open Graph:** Preview works in social media  
✅ **OPSEC:** No personal information exposed  

---

## DEADLINE TRACKER

| Date | Event | Status |
|------|-------|--------|
| **Feb 27** | Accelerator application | ⚠️ Requires live website |

---

## QUICK START

**Right now:**
1. Run Agent 1: Pre-flight verification
2. Run Agent 2: Repository setup
3. Run Agent 3: Cloudflare Pages deployment (manual steps)
4. Run Agent 4: Post-deployment verification

**Estimated time:** 60 minutes (mostly waiting for DNS/SSL)

---

*The Mesh Holds. Ready to deploy. 🔺*
