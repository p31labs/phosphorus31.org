# WEBSITE LAUNCH PROMPT — phosphorus31.org
**Quick Start Guide**  
**With love and light; as above, so below** 💜

---

## 🎯 MISSION

Launch `phosphorus31.org` to production using Cloudflare Pages.  
**Deadline:** Feb 27 (for Accelerator application)  
**Estimated Time:** 30-60 minutes

---

## ✅ PREREQUISITES CHECKLIST

Before starting, verify:
- [ ] Cloudflare account with `phosphorus31.org` domain active
- [ ] GitHub account (username: `trimtab-signal`)
- [ ] Website files ready in `website/` directory
- [ ] All files OPSEC-clean (no personal info)

---

## 🚀 LAUNCH STEPS

### Step 1: Create GitHub Repository (5 min)

1. **Go to:** https://github.com/new
2. **Repository name:** `phosphorus31.org`
3. **Owner:** `trimtab-signal`
4. **Description:** "P31 Labs landing page"
5. **Visibility:** Public
6. **DO NOT check any boxes** (no README, .gitignore, license)
7. **Click:** "Create repository"

---

### Step 2: Push Code to GitHub (5 min)

```powershell
# Navigate to website directory
cd C:\Users\sandra\Downloads\phenix-navigator-creator67\website

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: P31 Labs landing page"

# Add GitHub remote
git branch -M main
git remote add origin https://github.com/trimtab-signal/phosphorus31.org.git

# Push to GitHub
git push -u origin main
```

**Verify:** Visit https://github.com/trimtab-signal/phosphorus31.org — files should be visible

---

### Step 3: Launch to Cloudflare Pages (15 min)

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Click **"Pages"** in left sidebar

2. **Create New Project**
   - Click **"Create a project"**
   - Click **"Connect to Git"**
   - Select **GitHub**
   - **Authorize Cloudflare** (if first time)
   - Select repository: `trimtab-signal/phosphorus31.org`
   - Click **"Begin setup"**

3. **Configure Build Settings**
   ```
   Framework preset: None
   Build command: (leave EMPTY)
   Build output directory: /
   Root directory: /
   ```
   - Click **"Save and Deploy"**

4. **Wait for Build** (30-60 seconds)
   - Status will show "Success" when done
   - Note preview URL: `https://phosphorus31-org-[hash].pages.dev`

---

### Step 4: Add Custom Domain (5 min)

1. **In Project Dashboard:**
   - Click **"Custom domains"** tab
   - Click **"Set up a custom domain"**
   - Enter: `phosphorus31.org`
   - Click **"Continue"**

2. **Verify DNS** (automatic)
   - Cloudflare auto-adds CNAME record
   - Go to **DNS** tab → Verify record exists:
     ```
     Type: CNAME
     Name: phosphorus31.org
     Target: [project].pages.dev
     Proxy: ✅ Proxied (orange cloud)
     ```

---

### Step 5: Configure SSL (2 min)

1. **Go to SSL/TLS Settings**
   - Main dashboard → **SSL/TLS** → **Overview**
   - Set mode: **"Full (strict)"**

2. **Enable Always Use HTTPS**
   - **SSL/TLS** → **Edge Certificates**
   - Toggle **"Always Use HTTPS"** → ON

3. **Wait for SSL Certificate** (5-30 minutes)
   - Status will show "Active" when ready

---

### Step 6: Verify Launch (5 min)

**Test URLs:**
- Preview: `https://phosphorus31-org-[hash].pages.dev`
- Production: `https://phosphorus31.org` (after SSL active)

**Checklist:**
- [ ] Preview URL loads correctly
- [ ] Production URL loads (may take 5-30 min for DNS/SSL)
- [ ] HTTPS works (green lock icon)
- [ ] Page renders correctly
- [ ] Mobile responsive (test on phone or dev tools)
- [ ] No console errors (F12 → Console)

---

## 🧪 QUICK VERIFICATION COMMANDS

```powershell
# Test HTTPS (after SSL active)
curl -I https://phosphorus31.org

# Test SEO files
curl https://phosphorus31.org/robots.txt
curl https://phosphorus31.org/sitemap.xml

# Expected: HTTP/2 200 (not 404)
```

---

## 🚨 TROUBLESHOOTING

### DNS Not Resolving
- **Wait 5-30 minutes** for propagation
- Check DNS tab: Verify CNAME record exists
- Ensure proxy enabled (orange cloud)

### SSL Certificate Pending
- **Wait up to 24 hours** (usually < 5 minutes)
- Verify SSL/TLS mode is "Full (strict)"
- Check DNS records are correct

### Build Fails
- Verify `index.html` is in root directory
- Ensure build command is empty
- Check build output directory is `/`

### 404 Errors
- Verify `index.html` is in build output directory
- Check Cloudflare Pages routing settings

---

## ✅ SUCCESS CRITERIA

**Website is live when:**
- ✅ URL: https://phosphorus31.org loads
- ✅ HTTPS works (green lock)
- ✅ Mobile responsive
- ✅ Performance: < 1 second load time
- ✅ SEO files accessible (robots.txt, sitemap.xml)
- ✅ No console errors

---

## 📋 POST-LAUNCH TASKS

1. **Google Search Console**
   - Add property: `https://phosphorus31.org`
   - Submit sitemap: `https://phosphorus31.org/sitemap.xml`

2. **Update Accelerator Application**
   - Add website URL: `https://phosphorus31.org`
   - Verify link works

3. **Monitor**
   - Cloudflare Analytics (in Pages dashboard)
   - Check uptime

---

## 🔗 QUICK REFERENCE

**Cloudflare Dashboard:**
- Pages: https://dash.cloudflare.com/?to=/:account/pages
- DNS: https://dash.cloudflare.com/?to=/:account/dns
- SSL/TLS: https://dash.cloudflare.com/?to=/:account/ssl-tls

**GitHub Repository:**
- URL: https://github.com/trimtab-signal/phosphorus31.org

**Production URL:**
- https://phosphorus31.org

---

## 💡 PRO TIPS

1. **Use dedicated repo** (cleaner than subdirectory)
2. **Wait for SSL** before testing production URL
3. **Test preview URL first** to verify site works
4. **Check mobile** using browser dev tools (F12 → Toggle device)
5. **Monitor build logs** if the launch fails

---

**The Scope shows the truth. The Buffer protects from the lie. The mesh holds.** 🔺

**Ready to launch? Start with Step 1!** 🚀

---

**Generated:** 2026-02-14  
**Classification:** INTERNAL  
**OPSEC:** Clean
