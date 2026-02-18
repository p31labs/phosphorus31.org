# phosphorus31.org — Quick Deployment Checklist
**Agent 2: Deploy** | **Deadline: Feb 27** | **Est. Time: 10-15 min**

---

## ✅ Pre-Deployment (Already Done)

- [x] Landing page built (`index.html`)
- [x] CNAME file created (`phosphorus31.org`)
- [x] SEO files ready (`robots.txt`, `sitemap.xml`)
- [x] Brand compliance verified
- [x] OPSEC check passed

---

## 🚀 Deployment Steps (Choose One)

### Option A: Cloudflare Pages ⭐ RECOMMENDED

**Time:** 10-15 minutes | **Cost:** Free

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Navigate: **Pages** (left sidebar)

2. **Create Project**
   - Click: **"Create a project"**
   - Click: **"Connect to Git"**
   - Select: **GitHub**
   - Authorize (if first time)

3. **Select Repository**
   - Repository: `p31labs/phenix-navigator-creator67`
   - Branch: `main`

4. **Configure Build Settings**
   ```
   Framework preset: None
   Build command: (leave empty)
   Build output directory: /website
   Root directory: / (or leave default)
   ```

5. **Deploy**
   - Click: **"Save and Deploy"**
   - Wait: 1-2 minutes for first build

6. **Add Custom Domain**
   - Go to: **Custom domains** tab
   - Click: **"Set up a custom domain"**
   - Enter: `phosphorus31.org`
   - Click: **"Continue"**
   - DNS will auto-configure

7. **Verify SSL**
   - Go to: **SSL/TLS** → **Overview**
   - Mode: **Full (strict)**
   - Wait: < 5 minutes for certificate

8. **Optional: Add www**
   - In Custom domains: Add `www.phosphorus31.org`
   - Auto-redirects to main domain

---

### Option B: GitHub Pages

**Time:** 20-30 minutes | **Cost:** Free

1. **Create Repository** (if needed)
   - GitHub: Create `p31labs/phosphorus31.org` (or use existing repo)
   - Or use existing repo

2. **Copy Files**
   ```bash
   cd website/
   git init
   git add .
   git commit -m "Initial commit: P31 Labs landing page"
   git remote add origin https://github.com/p31labs/phosphorus31.org.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: **main** / **/**
   - Save

4. **Configure DNS (Cloudflare)**
   - Go to Cloudflare DNS
   - Add CNAME:
     - Name: `phosphorus31.org`
     - Target: `trimtab-signal.github.io`
     - Proxy: ✅ (orange cloud)
   - Add CNAME:
     - Name: `www`
     - Target: `trimtab-signal.github.io`
     - Proxy: ✅

5. **Enable HTTPS**
   - Cloudflare: SSL/TLS → Overview
   - Mode: **Full (strict)**
   - GitHub Pages: Settings → Pages → ✅ Enforce HTTPS

---

### Option C: Vercel

**Time:** 15-20 minutes | **Cost:** Free

1. **Go to Vercel**
   - URL: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click: **"Add New"** → **"Project"**
   - Import: `p31labs/phenix-navigator-creator67`

3. **Configure**
   - Root Directory: `/website`
   - Framework Preset: **Other**
   - Build Command: (leave empty)
   - Output Directory: `/`

4. **Deploy**
   - Click: **"Deploy"**
   - Wait: 1-2 minutes

5. **Add Domain**
   - Settings → Domains
   - Add: `phosphorus31.org`
   - Follow DNS instructions

---

## ✅ Post-Deployment Verification

**Test URLs:**
- [ ] `https://phosphorus31.org` loads (HTTPS, not HTTP)
- [ ] `https://www.phosphorus31.org` redirects to main domain
- [ ] Page loads in < 1 second
- [ ] Mobile responsive (test on phone)
- [ ] SSL certificate valid (green lock icon)
- [ ] Open Graph tags work (paste URL in Slack/Twitter)
- [ ] `robots.txt` accessible: `https://phosphorus31.org/robots.txt`
- [ ] `sitemap.xml` accessible: `https://phosphorus31.org/sitemap.xml`

**Quick Test Commands:**
```bash
# Test HTTPS
curl -I https://phosphorus31.org

# Test www redirect
curl -I https://www.phosphorus31.org

# Check SSL
openssl s_client -connect phosphorus31.org:443 -servername phosphorus31.org
```

---

## 📋 Post-Deployment Tasks

1. **Submit to Google Search Console**
   - URL: https://search.google.com/search-console
   - Add property: `https://phosphorus31.org`
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: `https://phosphorus31.org/sitemap.xml`

2. **Add to Accelerator Application**
   - Include URL in application form
   - Deadline: Feb 27

3. **Update Status**
   - Mark as deployed in `WEBSITE_STATUS.md`

4. **Test Social Sharing**
   - Paste URL in Slack/Discord/Twitter
   - Verify Open Graph preview shows correctly

---

## 🆘 Troubleshooting

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
- Review build logs in deployment dashboard

### 404 Errors
- Verify `index.html` is in build output directory
- Check routing settings
- Ensure no redirect rules conflict

---

## 📝 Notes

- **Landing page is complete** — no changes needed
- **Domain is active** — just needs hosting connection
- **All SEO files present** — ready to go
- **OPSEC verified** — no personal info exposed
- **Brand voice correct** — matches P31 guidelines

---

**Status:** Ready to deploy  
**Priority:** 🟡 HIGH — Accelerator application deadline: Feb 27, 2026

**The Mesh Holds. 🔺**
