# Cloudflare Pages Deployment Guide

**Quick deployment for phosphorus31.org**

---

## Prerequisites

- Cloudflare account (already have — domain is active)
- GitHub account
- Repository access (or create new repo)

---

## Step-by-Step Deployment

### 1. Prepare Repository

**Option A: Use existing repo**
```bash
cd C:\Users\sandra\Downloads\phenix-navigator-creator67
git add website/
git commit -m "deploy: phosphorus31.org landing page"
git push origin main
```

**Option B: Create dedicated repo (cleaner)**
```bash
# Create new repo on GitHub: trimtab-signal/phosphorus31.org
cd C:\Users\sandra\Downloads\phenix-navigator-creator67\website
git init
git add .
git commit -m "Initial commit: P31 Labs landing page"
git remote add origin https://github.com/trimtab-signal/phosphorus31.org.git
git push -u origin main
```

---

### 2. Deploy via Cloudflare Dashboard

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Navigate to: **Pages** (left sidebar)

2. **Create New Project**
   - Click: **"Create a project"**
   - Click: **"Connect to Git"**

3. **Connect GitHub**
   - Select: **GitHub**
   - Authorize Cloudflare (if first time)
   - Select repository: `trimtab-signal/phosphorus31.org` (or your repo)

4. **Configure Build Settings**
   ```
   Framework preset: None (or "Static")
   Build command: (leave empty)
   Build output directory: / (if repo root) OR website (if subdirectory)
   Root directory: / (or /website)
   ```

5. **Deploy**
   - Click: **"Save and Deploy"**
   - Wait 1-2 minutes for first build

---

### 3. Add Custom Domain

1. **In Cloudflare Pages project:**
   - Go to: **Custom domains** tab
   - Click: **"Set up a custom domain"**
   - Enter: `phosphorus31.org`
   - Click: **"Continue"**

2. **DNS Configuration (automatic)**
   - Cloudflare will auto-add DNS records
   - Verify in **DNS** tab:
     - `phosphorus31.org` → CNAME → `[project].pages.dev`
     - Proxy status: ✅ Proxied (orange cloud)

3. **SSL Certificate**
   - Go to: **SSL/TLS** → **Overview**
   - Mode: **Full (strict)**
   - Certificate will auto-provision (usually < 5 minutes)

---

### 4. Optional: Add www Subdomain

1. **In Custom domains:**
   - Click: **"Add a custom domain"**
   - Enter: `www.phosphorus31.org`
   - Cloudflare will auto-configure redirect to main domain

---

### 5. Verify Deployment

**Test URLs:**
```bash
# Main domain
curl -I https://phosphorus31.org

# www redirect
curl -I https://www.phosphorus31.org

# Check SSL
openssl s_client -connect phosphorus31.org:443 -servername phosphorus31.org
```

**Browser checks:**
- [ ] HTTPS loads (green lock)
- [ ] Page renders correctly
- [ ] Mobile responsive
- [ ] All links work
- [ ] Open Graph tags work (test in Slack/Twitter)

---

## Troubleshooting

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

## Post-Deployment

1. **Update sitemap.xml** (if needed)
   - Change `<lastmod>` to current date

2. **Submit to Google Search Console**
   - URL: https://search.google.com/search-console
   - Add property: `https://phosphorus31.org`
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: `https://phosphorus31.org/sitemap.xml`

3. **Test Social Sharing**
   - Paste URL in Slack/Discord/Twitter
   - Verify Open Graph preview shows correctly

4. **Performance Check**
   - Test: https://pagespeed.web.dev/
   - Target: < 1 second load time
   - Mobile score: > 90

---

## Maintenance

**Update content:**
1. Edit `index.html` locally
2. Commit and push to GitHub
3. Cloudflare Pages auto-deploys (usually < 2 minutes)

**Monitor:**
- Cloudflare Analytics (in Pages dashboard)
- Uptime monitoring (optional)
- Error logs (if issues arise)

---

## Quick Reference

**Cloudflare Pages Dashboard:**
- URL: https://dash.cloudflare.com → Pages

**Project URL (before custom domain):**
- `https://[project-name].pages.dev`

**Custom Domain:**
- `https://phosphorus31.org`

**GitHub Repo (if created):**
- `https://github.com/trimtab-signal/phosphorus31.org`

---

**Status:** Ready to deploy  
**Estimated time:** 10-15 minutes  
**The Mesh Holds. 🔺**
