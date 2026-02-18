# GitHub Repository Setup — Quick Guide

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. **Repository name:** `phosphorus31.org`
3. **Owner:** `trimtab-signal` (or your GitHub username)
4. **Description:** "P31 Labs landing page — Assistive technology for neurodivergent minds"
5. **Visibility:** Public (recommended)
6. **DO NOT check any boxes** (no README, .gitignore, or license)
7. Click: **"Create repository"**

## Step 2: Push Local Repository

After creating the repository, run these commands:

```powershell
# Navigate to website directory
cd C:\Users\sandra\Downloads\phenix-navigator-creator67\website

# Add GitHub remote (replace YOUR_USERNAME if different)
git remote add origin https://github.com/trimtab-signal/phosphorus31.org.git

# Ensure we're on main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify

1. Visit: https://github.com/trimtab-signal/phosphorus31.org
2. Verify all files are present
3. Check that `index.html` is in the root

## Step 4: Proceed to Cloudflare Pages

Once the repository is on GitHub, proceed to Agent 3 (Cloudflare Pages deployment).

---

**The Mesh Holds. 🔺**
