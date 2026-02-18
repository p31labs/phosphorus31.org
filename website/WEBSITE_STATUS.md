# phosphorus31.org — Deployment Status

**Date:** 2026-02-14  
**Status:** ⚠️ NOT DEPLOYED  
**Domain:** Active in Cloudflare (verified)  
**Priority:** 🟡 HIGH — Required for Accelerator Application (Feb 27)

---

## Current Status

- ✅ **Landing page built:** `website/index.html` (complete, brand-aligned)
- ✅ **SEO files:** `robots.txt`, `sitemap.xml` (complete)
- ✅ **Domain active:** `phosphorus31.org` in Cloudflare dashboard
- ❌ **Site live:** NO — DNS not resolving to hosting
- ❌ **HTTPS:** NO — No SSL certificate active

---

## Deployment Options

### Option A: Cloudflare Pages (RECOMMENDED — Fastest)

**Why:** Domain is already in Cloudflare. Free, fast CDN, automatic SSL.

**Steps:**
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Connect GitHub repository: `trimtab-signal/phenix-navigator-creator67` (or create new repo)
4. Configure build:
   - **Framework preset:** None (static)
   - **Build command:** (leave empty)
   - **Build output directory:** `website`
   - **Root directory:** `/` (or `/website` if deploying from subdirectory)
5. Add custom domain:
   - **Domain:** `phosphorus31.org`
   - **Subdomain:** `www` (optional, will redirect)
6. Deploy
7. SSL will auto-provision (usually < 5 minutes)

**Estimated time:** 10-15 minutes

---

### Option B: GitHub Pages (Alternative)

**Steps:**
1. Create new repository: `trimtab-signal/phosphorus31.org` (or use existing)
2. Copy `website/` contents to repo root
3. Enable GitHub Pages:
   - Settings → Pages
   - Source: `main` branch, `/` root
4. Add `CNAME` file containing: `phosphorus31.org`
5. Configure DNS in Cloudflare:
   - **CNAME:** `phosphorus31.org` → `trimtab-signal.github.io`
   - **CNAME:** `www` → `trimtab-signal.github.io`
6. Enable "Always Use HTTPS" in Cloudflare
7. Wait for DNS propagation (5-30 minutes)

**Estimated time:** 20-30 minutes

---

### Option C: Vercel (If Cloudflare Pages fails)

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `website/` directory
3. Run: `vercel --prod`
4. Follow prompts to connect domain
5. Update Cloudflare DNS:
   - **CNAME:** `phosphorus31.org` → `cname.vercel-dns.com`
   - **CNAME:** `www` → `cname.vercel-dns.com`

**Estimated time:** 15-20 minutes

---

## DNS Configuration (Cloudflare)

Once hosting is configured, ensure these DNS records:

```
Type    Name              Content                    Proxy
CNAME   www               [hosting-provider-url]     ✅ Proxied
A       @                 [hosting-ip-if-needed]     ✅ Proxied (or DNS only)
```

**SSL/TLS Settings:**
- Mode: **Full (strict)**
- Always Use HTTPS: **ON**
- Minimum TLS Version: **1.2**

---

## Verification Checklist

After deployment, verify:

- [ ] `https://phosphorus31.org` loads (not just HTTP)
- [ ] `https://www.phosphorus31.org` redirects to main domain
- [ ] Page loads in < 1 second
- [ ] Mobile responsive (test on phone)
- [ ] SSL certificate valid (green lock icon)
- [ ] Open Graph tags work (test by pasting URL in Slack/Twitter)
- [ ] `robots.txt` accessible: `https://phosphorus31.org/robots.txt`
- [ ] `sitemap.xml` accessible: `https://phosphorus31.org/sitemap.xml`

---

## Content Verification

- [ ] Brand colors correct (Phosphorus Green #2ecc71, Calcium Blue #60a5fa)
- [ ] Tagline present: "The Mesh Holds. 🔺"
- [ ] All three products listed (The Buffer, Node One, The Scope)
- [ ] Contact email: `will@p31ca.org`
- [ ] GitHub link: `github.com/p31labs`
- [ ] No personal information exposed (OPSEC check)
- [ ] Footer: "Apache 2.0 Licensed"

---

## Next Steps

1. **Deploy via Cloudflare Pages** (recommended)
2. **Verify HTTPS works**
3. **Test mobile responsiveness**
4. **Submit to Google Search Console** (manual step)
5. **Add to accelerator application** (deadline: Feb 27)

---

## Notes

- Domain is already active in Cloudflare (verified via dashboard screenshot)
- Landing page is complete and ready
- No build step required (static HTML)
- All SEO files present

**The Mesh Holds. 🔺**
