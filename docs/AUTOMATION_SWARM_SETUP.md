# P31 Automation Swarm — Setup Guide

This doc ties the **Nervous System** (AUTO-01 through AUTO-07) to what’s in the repo and what you do by hand.

## What’s in the repo (done)

| Item | Location |
|------|----------|
| **CI** (lint, typecheck, build, test, security) | `.github/workflows/ci.yml` |
| **Launch** (CI gate + Cloudflare Pages deploy) | `.github/workflows/launch.yml` |
| **Release** (tag → GitHub Release) | `.github/workflows/release.yml` |
| **Health** (cron + manual) | `.github/workflows/health.yml` |
| **Website redirects** (/github, /donate, /zenodo) | `apps/web/_redirects` |
| **Cloudflare Worker** (health monitor) | `workers/health-monitor/` |
| **Google Apps Script** (daily ops, health, backup, accommodation) | `scripts/p31-ops-automation/` |
| **P31 Brain v8** (Scope dashboard, Shelter bridge, GAS command center) | `scripts/p31-brain-v8/` — see README there for copy-into-GAS and Script Properties |

## Manual steps (you do these)

### AUTO-01: Repo migration to p31labs

1. Create repo **github.com/p31labs/p31** (description, topics, MIT, public, init with README).
2. Add remote and push:  
   `git remote add p31 git@github.com:p31labs/p31.git`  
   `git push p31 main`
3. Archive **trimtab-signal/cognitive-shield** (if still active): Settings → Archive, add description:  
   `Archived. Development moved to github.com/p31labs/p31`
4. Zenodo: edit related works → set repository URL to **p31labs/p31**.
5. Org/repo settings: org profile (logo, bio, URL, location), repo social preview, branch rules, Discussions, Pages OFF.

### AUTO-03: Cloudflare Pages

1. Dashboard → Workers and Pages → Create → Pages → **Connect to Git**.
2. Connect **p31labs/p31**.
3. Build: **Build command** `cd apps/web && npm run build` (or leave empty if static), **Build output** `apps/web`, **Root** `/`, env `NODE_VERSION=20`.
4. Add custom domains: **phosphorus31.org**, **www.phosphorus31.org** → **phosphorus31-org.pages.dev**.

### AUTO-05: Google Drive

Create folder tree and Sheets as in **scripts/p31-ops-automation/README.md**. Copy folder/Sheet IDs into `CONFIG` in **Main.gs** in Apps Script.

### AUTO-04: Apps Script

1. Open the project in script.google.com.
2. Create scripts **Main**, **DailyOps**, **HealthPulse**, **AccommodationTracker**, **BackupAutomation**, **Utilities**, **Triggers** and paste from `scripts/p31-ops-automation/*.gs`.
3. Fill **CONFIG** in Main.gs (Drive IDs, Ops Log ID, Accommodation Tracker ID, ALERT_EMAIL).
4. Run **setupAllTriggers** once.

### AUTO-06: Cloudflare Worker

1. Create KV namespace **P31_KV**.
2. Create Worker **p31-health-monitor**, paste `workers/health-monitor/index.js`.
3. Bind **P31_KV**, set env: **SHELTER_URL**, **WEBSITE_URL**, optional **ALERT_WEBHOOK**.
4. Add cron trigger: `*/5 * * * *`.
5. Optional: custom domain **health.p31.io**.

### Secrets (GitHub)

- **CLOUDFLARE_API_TOKEN** — for launch.yml (Pages deploy). Create at Cloudflare → My Profile → API Tokens → Create Token (Edit Cloudflare Workers template or custom with Account/Workers Scripts Edit, Account/Workers KV Storage Edit, Account/Cloudflare Pages Edit).

## After setup

- **Push to main** → CI runs → Launch runs → website deploys to Cloudflare Pages.
- **Tag `v*`** → Release workflow creates GitHub Release; Zenodo archives if connected.
- **Every 15 min** → GitHub health workflow + Apps Script healthPulse (email on failure).
- **Every 5 min** → Cloudflare Worker pings Shelter + website (optional alert webhook).
- **6 AM ET** → Apps Script dailyOps (briefing email, daily accommodation doc).
- **Wed 3 AM ET** → Apps Script weeklyBackup (accommodation CSV to Drive).
- **Sun 11 PM ET** → Apps Script syncAccommodationFromShelter → Sheet.

The mesh breathes on its own; you push and tend the human touchpoints.
