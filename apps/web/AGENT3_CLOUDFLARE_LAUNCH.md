# AGENT 3: CLOUDFLARE PAGES DEPLOYMENT — STEP-BY-STEP GUIDE
**Date:** 2026-02-14  
**Status:** Ready to Deploy  
**With love and light; as above, so below** 💜

---

## 🎯 MISSION

Deploy `phosphorus31.org` to Cloudflare Pages and configure custom domain with SSL.

**Prerequisites:**
- ✅ GitHub repository created: `trimtab-signal/phosphorus31.org`
- ✅ Code pushed to GitHub
- ✅ Cloudflare account with `phosphorus31.org` domain active

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Access Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Log in with your Cloudflare account

2. **Navigate to Pages**
   - Click **"Pages"** in the left sidebar
   - Or go directly: https://dash.cloudflare.com/?to=/:account/pages

---

### Step 2: Create New Project

1. **Click "Create a project"**
   - Large blue button on the Pages dashboard

2. **Select "Connect to Git"**
   - Choose GitHub (or GitLab if using that)

3. **Authorize Cloudflare** (if first time)
   - Click "Authorize Cloudflare" or "Install Cloudflare Pages"
   - Select repositories: Choose "Only select repositories"
   - Select: `trimtab-signal/phosphorus31.org`
   - Click "Install" or "Authorize"

---

### Step 3: Select Repository

1. **Repository selection**
   - You should see: `trimtab-signal/phosphorus31.org`
   - Click on it to select

2. **Click "Begin setup"**

---

### Step 4: Configure Build Settings

**Critical settings:**

```
Project name: phosphorus31-org
  (or leave default)

Framework preset: None
  (or "Static" if available)

Build command: (leave EMPTY)
  No build step needed for static site

Build output directory: /
  (root directory - all files are in root)

Root directory: /
  (root - we're using dedicated repo)
```

**Why root?**
- We're using a dedicated repository
- All website files are in the root directory
- No subdirectory structure

**Click "Save and Deploy"**

---

### Step 5: Wait for Initial Deploy

1. **Build will start automatically**
   - You'll see build logs
   - Should complete in 30-60 seconds
   - Status will show "Success" when done

2. **Note the preview URL**
   - Format: `https://phosphorus31-org-[hash].pages.dev`
   - Test this URL to verify site works

---

### Step 6: Add Custom Domain

1. **In your project dashboard:**
   - Click **"Custom domains"** tab
   - Click **"Set up a custom domain"**

2. **Enter domain:**
   - Type: `phosphorus31.org`
   - Click **"Continue"**

3. **DNS Configuration (automatic)**
   - Cloudflare will automatically:
     - Add CNAME record: `phosphorus31.org` → `[project].pages.dev`
     - Enable proxy (orange cloud)
   - You'll see: "DNS record added successfully"

4. **Verify DNS**
   - Go to: **DNS** tab (main Cloudflare dashboard)
   - Verify record exists:
     ```
     Type: CNAME
     Name: phosphorus31.org
     Target: [project-name].pages.dev
     Proxy: ✅ Proxied (orange cloud)
     TTL: Auto
     ```

---

### Step 7: Configure SSL/TLS

1. **Go to SSL/TLS settings**
   - Main Cloudflare dashboard → **SSL/TLS** → **Overview**

2. **Set encryption mode:**
   - Select: **"Full (strict)"**
   - This ensures end-to-end encryption

3. **Enable "Always Use HTTPS"**
   - Go to: **SSL/TLS** → **Edge Certificates**
   - Toggle: **"Always Use HTTPS"** → ON

4. **Wait for SSL certificate**
   - Cloudflare will auto-provision SSL certificate
   - Usually takes < 5 minutes
   - Status will show "Active" when ready

---

### Step 8: Optional — Add www Subdomain

1. **In Custom domains tab:**
   - Click **"Add a custom domain"**
   - Enter: `www.phosphorus31.org`
   - Click **"Continue"**

2. **Cloudflare will:**
   - Add CNAME record for www
   - Configure redirect to main domain (or serve same content)

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify:

- [ ] **Project deployed:** Status shows "Success"
- [ ] **Preview URL works:** `https://phosphorus31-org-[hash].pages.dev` loads
- [ ] **Custom domain added:** `phosphorus31.org` appears in Custom domains
- [ ] **DNS record created:** CNAME in DNS tab
- [ ] **SSL certificate:** Status shows "Active" (may take 5-30 minutes)
- [ ] **HTTPS works:** `https://phosphorus31.org` loads (test after SSL active)

---

## 🚨 TROUBLESHOOTING

### Build Fails

**Issue:** Build shows errors or fails

**Solutions:**
- Check build logs for specific errors
- Verify `index.html` is in root directory
- Ensure no build command is set (should be empty)
- Check that build output directory is `/` (root)

### DNS Not Resolving

**Issue:** Domain doesn't load after deployment

**Solutions:**
- Wait 5-30 minutes for DNS propagation
- Check DNS tab: Verify CNAME record exists
- Ensure proxy is enabled (orange cloud)
- Try: `nslookup phosphorus31.org` to check DNS

### SSL Certificate Pending

**Issue:** SSL certificate shows "Pending" or "Processing"

**Solutions:**
- Wait up to 24 hours (usually < 5 minutes)
- Verify SSL/TLS mode is "Full (strict)"
- Check DNS records are correct
- Ensure domain is proxied (orange cloud)

### 404 Errors

**Issue:** Site loads but shows 404

**Solutions:**
- Verify `index.html` is in build output directory (`/`)
- Check Cloudflare Pages routing settings
- Ensure no `.htaccess` or redirect rules conflict
- Review build logs for file structure

### Mixed Content Warnings

**Issue:** Browser shows "Mixed content" warnings

**Solutions:**
- Ensure all resources use HTTPS (not HTTP)
- Check `index.html` for HTTP links
- Verify images/CSS/JS load over HTTPS

---

## 📊 DEPLOYMENT STATUS TRACKER

After completing steps, update this:

```markdown
## Deployment Status

- [ ] Step 1: Cloudflare Pages accessed
- [ ] Step 2: Project created
- [ ] Step 3: Repository connected
- [ ] Step 4: Build settings configured
- [ ] Step 5: Initial deploy successful
- [ ] Step 6: Custom domain added
- [ ] Step 7: SSL/TLS configured
- [ ] Step 8: www subdomain added (optional)

**Deployment URL:** https://phosphorus31-org-[hash].pages.dev
**Custom Domain:** https://phosphorus31.org
**SSL Status:** [Active/Pending]
**Deployment Time:** [DATE/TIME]
```

---

## 🔗 QUICK REFERENCE

### Cloudflare Dashboard Links
- **Pages:** https://dash.cloudflare.com/?to=/:account/pages
- **DNS:** https://dash.cloudflare.com/?to=/:account/dns
- **SSL/TLS:** https://dash.cloudflare.com/?to=/:account/ssl-tls

### Project URLs
- **Preview:** `https://phosphorus31-org-[hash].pages.dev`
- **Production:** `https://phosphorus31.org`
- **www:** `https://www.phosphorus31.org`

### GitHub Repository
- **URL:** https://github.com/trimtab-signal/phosphorus31.org
- **Clone:** `git clone https://github.com/trimtab-signal/phosphorus31.org.git`

---

## 📝 POST-DEPLOYMENT

After successful deployment:

1. **Test the site:**
   - Visit: https://phosphorus31.org
   - Verify page loads correctly
   - Check mobile responsiveness

2. **Run Agent 4 verification:**
   - Use: `AGENT4_VERIFICATION_SCRIPT.md`
   - Test HTTPS, SEO files, Open Graph, performance

3. **Update accelerator application:**
   - Add website URL: `https://phosphorus31.org`
   - Verify link works in application

---

**The Scope shows the truth. The Buffer protects from the lie. The mesh holds.** 🔺

**With love and light; as above, so below.** 💜
