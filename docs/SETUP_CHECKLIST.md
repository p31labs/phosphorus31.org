# P31 Labs Organization Setup Checklist

**Status:** In Progress  
**Last Updated:** 2026-02-12

This document tracks the setup and configuration status of the P31 Labs organization, repositories, and nonprofit filing.

---

## ✅ Completed

### Organization & Legal
- [x] Nonprofit organization information documented (`docs/nonprofit-organization-info.md`)
- [x] Bylaws prepared with all IRS-required clauses (`docs/nonprofit-bylaws-final.md`)
- [x] Conflict of Interest Policy prepared (`docs/nonprofit-conflict-of-interest-policy-final.md`)
- [x] Articles of Incorporation guide prepared (`docs/articles-of-incorporation-irs-clauses.md`)
- [x] GitHub organization created: https://github.com/p31labs
- [x] Organization website: https://phosphorus31.org/
- [x] Organization email: will@p31ca.org

### Documentation
- [x] Main README.md with complete project overview
- [x] Cognitive Shield README.md with full feature documentation
- [x] Sovereign Life OS README.md with deployment guide
- [x] LICENSE files present in main repositories

### Repository Structure
- [x] Main monorepo: `phenix-navigator-creator67`
- [x] Cognitive Shield: `cognitive-shield`
- [x] Sovereign Life OS: `sovereign-life-os`

---

## 🔄 In Progress

### Git Configuration
- [ ] Set up git remote for `phenix-navigator-creator67` → `git@github.com:p31labs/phenix-navigator-creator67.git`
- [ ] Initialize git repository for `cognitive-shield` (if not already)
- [ ] Initialize git repository for `sovereign-life-os` (if not already)
- [ ] Set up git remotes for all repositories
- [ ] Verify all repositories can push to GitHub org

### License & Copyright
- [ ] Update main LICENSE to reference "P31 Labs, Inc." instead of just "P31"
- [ ] Verify cognitive-shield LICENSE (Apache 2.0) has correct copyright holder
- [ ] Add LICENSE to sovereign-life-os if missing
- [ ] Ensure all package.json files reference P31 Labs, Inc.

### Package Configuration
- [ ] Update root `package.json` with organization info
- [ ] Update component `package.json` files (SUPER-CENTAUR, ui, cognitive-shield)
- [ ] Add repository URLs to package.json files
- [ ] Add organization homepage and contact info

---

## 📋 Pending

### Nonprofit Filing
- [ ] Fill in placeholder dates in bylaws
- [ ] Fill in placeholder names (President, Secretary)
- [ ] Fill in placeholder values (term lengths, meeting notice periods)
- [ ] Complete Articles of Incorporation with IRS clauses
- [ ] Have attorney review documents (recommended)
- [ ] Schedule initial Board meeting
- [ ] Adopt bylaws and conflict of interest policy
- [ ] Sign and date all documents
- [ ] File Articles of Incorporation with Georgia Secretary of State ($100)
- [ ] Arrange newspaper publication (~$40)
- [ ] File initial annual registration ($50)
- [ ] Obtain EIN from IRS (free)
- [ ] Complete Form 1023-EZ ($275) or Form 1023 ($600)
- [ ] Submit 501(c)(3) application to IRS

### Repository Setup
- [ ] Create `.github` folder with issue templates
- [ ] Create `.github` folder with pull request templates
- [ ] Set up GitHub Actions workflows (if needed)
- [ ] Configure repository topics/tags on GitHub
- [ ] Add repository descriptions on GitHub
- [ ] Set up branch protection rules (if needed)
- [ ] Configure repository settings (visibility, features)

### Documentation
- [ ] Add CONTRIBUTING.md to all repositories
- [ ] Add SECURITY.md to all repositories (main repo has it)
- [ ] Add CODE_OF_CONDUCT.md (optional but recommended)
- [ ] Update README.md files with GitHub org links
- [ ] Add badges to README files (build status, license, etc.)

### Code Quality
- [ ] Ensure all repositories have `.gitignore` files
- [ ] Ensure all repositories have `.editorconfig` (if using)
- [ ] Ensure all repositories have linting configuration
- [ ] Ensure all repositories have testing setup
- [ ] Verify all dependencies are up to date

---

## 🔍 Verification Steps

### Git Remote Verification
```bash
# Check main repo
cd phenix-navigator-creator67
git remote -v
# Should show: origin  git@github.com:p31labs/phenix-navigator-creator67.git

# Check cognitive-shield
cd ../cognitive-shield
git remote -v
# Should show: origin  git@github.com:p31labs/cognitive-shield.git

# Check sovereign-life-os
cd ../sovereign-life-os
git remote -v
# Should show: origin  git@github.com:p31labs/sovereign-life-os.git
```

### License Verification
```bash
# Check LICENSE files exist and have correct copyright
grep -r "P31 Labs" LICENSE
grep -r "Copyright" LICENSE
```

### Package.json Verification
```bash
# Check organization info in package.json files
grep -r "\"author\"" package.json
grep -r "\"repository\"" package.json
grep -r "\"homepage\"" package.json
```

---

## 📝 Notes

### Repository Mapping
- **phenix-navigator-creator67** → Main monorepo (may need to create new repo or map to existing)
- **cognitive-shield** → https://github.com/p31labs/cognitive-shield
- **sovereign-life-os** → https://github.com/p31labs/sovereign-life-os
- **phenix-os-quantum** → Separate repository (HTML)
- **neuromaker-os** → Separate repository
- **family-link-os** → Separate repository

### Important Reminders
1. All three IRS clauses must be in both Articles of Incorporation AND Bylaws
2. Documents must be signed and dated before filing
3. Keep signed copies in corporate records
4. Use codenames in all public-facing documentation (per privacy rules)
5. Never use full legal names in code or documentation

---

## 🚀 Quick Setup Commands

### Set Up Git Remotes
```bash
# Main repo
cd phenix-navigator-creator67
git remote set-url origin git@github.com:p31labs/[REPO_NAME].git

# Cognitive Shield
cd ../cognitive-shield
git init  # if not already a git repo
git remote add origin git@github.com:p31labs/cognitive-shield.git

# Sovereign Life OS
cd ../sovereign-life-os
git init  # if not already a git repo
git remote add origin git@github.com:p31labs/sovereign-life-os.git
```

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
