# 🚀 Deploy phosphorus31.org — Quick Guide

**Status:** All changes committed locally ✅  
**Next Step:** Deploy to Cloudflare Pages

---

## Option 1: Cloudflare Pages (Recommended)

### Step 1: Create/Update GitHub Repository

If the repository doesn't exist or you need to create a new one:

```bash
# Option A: Create new dedicated repo for website
cd C:\Users\sandra\Downloads\phenix-navigator-creator67\website
git init
git add .
git commit -m "Initial commit: P31 Labs website - visually mesmerizing juggernaut"
# Then create repo on GitHub and push:
# git remote add origin https://github.com/YOUR_USERNAME/phosphorus31.org.git
# git push -u origin main
```

**OR** if you want to use the existing repo structure:

```bash
cd C:\Users\sandra\Downloads\phenix-navigator-creator67
# Fix remote URL if needed:
git remote set-url origin https://github.com/YOUR_USERNAME/phenix-navigator-creator67.git
git push origin main
```

### Step 2: Deploy via Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Navigate to: **Pages** (left sidebar)

2. **Create New Project**
   - Click: **"Create a project"**
   - Click: **"Connect to Git"**
   - Select: **GitHub**
   - Authorize Cloudflare (if first time)

3. **Select Repository**
   - Choose: `p31labs/phenix-navigator-creator67` (or your repo)
   - Click: **"Begin setup"**

4. **Configure Build Settings**
   ```
   Project name: phosphorus31-org (or your choice)
   Production branch: main
   Framework preset: None
   Build command: (leave empty)
   Build output directory: /website
   Root directory: / (leave as root)
   ```

5. **Environment Variables**
   - None needed for static site
   - Click: **"Save and Deploy"**

6. **Add Custom Domain**
   - After first deployment completes:
   - Go to: **Custom domains** tab
   - Click: **"Set up a custom domain"**
   - Enter: `phosphorus31.org`
   - Click: **"Continue"**
   - Cloudflare will auto-configure DNS

7. **SSL Certificate**
   - Go to: **SSL/TLS** → **Overview**
   - Mode: **Full (strict)**
   - Certificate auto-provisions (usually < 5 minutes)

---

## Option 2: Manual Upload to Cloudflare Pages

If you prefer not to use Git:

1. **Go to Cloudflare Pages**
   - https://dash.cloudflare.com → Pages

2. **Create Project**
   - Click: **"Create a project"**
   - Select: **"Upload assets"**

3. **Upload Website Folder**
   - Zip the `website/` directory
   - Upload the zip file
   - Extract and deploy

4. **Add Custom Domain**
   - Same as Option 1, Step 6

---

## Option 3: Vercel (Alternative)

1. **Go to Vercel**
   - https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click: **"Add New"** → **"Project"**
   - Import: `p31labs/phenix-navigator-creator67`

3. **Configure**
   ```
   Root Directory: website
   Framework Preset: Other
   Build Command: (leave empty)
   Output Directory: . (current directory)
   ```

4. **Add Domain**
   - Go to: **Settings** → **Domains**
   - Add: `phosphorus31.org`
   - Configure DNS in Cloudflare

---

## Post-Deployment Verification

After deployment, verify:

- [ ] https://phosphorus31.org loads
- [ ] HTTPS certificate valid (green lock)
- [ ] All pages accessible (/, /about, /docs, etc.)
- [ ] Mobile responsive
- [ ] Animations work smoothly
- [ ] Page loads in < 1 second
- [ ] Open Graph tags work (test in Slack/Twitter)
- [ ] robots.txt: https://phosphorus31.org/robots.txt
- [ ] sitemap.xml: https://phosphorus31.org/sitemap.xml

---

## Quick Test Commands

```bash
# Test HTTPS
curl -I https://phosphorus31.org

# Test www redirect
curl -I https://www.phosphorus31.org

# Check SSL
openssl s_client -connect phosphorus31.org:443 -servername phosphorus31.org
```

---

## Troubleshooting

### Repository Not Found
- Check GitHub repository exists
- Verify you have push access
- Update remote URL: `git remote set-url origin https://github.com/USERNAME/REPO.git`

### Build Fails
- Ensure `index.html` is in `/website` directory
- Check build output directory is set to `/website`
- Review build logs in Cloudflare Pages dashboard

### DNS Not Resolving
- Wait 5-30 minutes for propagation
- Check Cloudflare DNS tab for correct records
- Ensure proxy is enabled (orange cloud)

### SSL Certificate Pending
- Wait up to 24 hours (usually < 5 minutes)
- Check SSL/TLS mode is "Full (strict)"
- Verify DNS records are correct

---

## Current Status

✅ **All changes committed locally**  
✅ **Website enhanced with mesmerizing visuals**  
⏳ **Ready for deployment**  

**Next:** Push to GitHub and deploy via Cloudflare Pages

---

**The Mesh Holds. 🔺**
