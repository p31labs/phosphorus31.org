# QUICK DEPLOY — One-Page Guide

## 🚀 6 Steps to Deploy phosphorus31.org

### 1. Create GitHub Repo (5 min)
- Go to: https://github.com/new
- Name: `phosphorus31.org`
- Owner: `trimtab-signal`
- Public, no README
- Create

### 2. Push Code (5 min)
```powershell
cd C:\Users\sandra\Downloads\p31\apps\web
# If using a dedicated site repo, copy contents there first, then:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/trimtab-signal/phosphorus31.org.git
git push -u origin main
```
Or push from p31 monorepo and point Cloudflare at apps/web.

### 3. Cloudflare Pages (15 min)
- Go to: https://dash.cloudflare.com → Pages
- Create project → Connect Git → GitHub
- Select: `trimtab-signal/phosphorus31.org` or **p31labs/p31**
- Build settings:
  - Framework: None
  - Build command: (empty)
  - **Root directory: apps/web** (if using p31 repo)
  - Output directory: `/`
- Save and Deploy

### 4. Add Domain (5 min)
- Custom domains → Set up custom domain
- Enter: `phosphorus31.org`
- Continue (DNS auto-configured)

### 5. SSL (2 min)
- SSL/TLS → Overview → Full (strict)
- Edge Certificates → Always Use HTTPS → ON
- Wait 5-30 min for certificate

### 6. Verify (5 min)
- Test: https://phosphorus31.org
- Check: HTTPS works, page loads, mobile responsive

**Done!** ✅

**Full details:** See `LAUNCH_NOW.md` and repo root `PREP_FOR_LAUNCH.md`

---

**The mesh holds.** 🔺
