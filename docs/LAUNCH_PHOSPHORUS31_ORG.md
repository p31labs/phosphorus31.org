# Get phosphorus31.org Live (Fix 404)

**Status:** Site is **live** (Feb 2026). phosphorus31-org.pages.dev + custom domain phosphorus31.org. Grant-ready.

If you see 404 again: DNS is in Cloudflare; the issue is either no deployment or the CNAME pointing at the wrong Pages project.

---

## Quick fix (about 2 minutes)

### 1. Deploy the site to Cloudflare Pages (once)

From the repo root (same place you ran `wrangler deploy` for the buffer-api):

```powershell
cd c:\Users\sandra\Downloads\p31
pnpm exec wrangler pages deploy website/ --project-name=phosphorus31-org
```

If it asks "Create project phosphorus31-org?" say **yes**.  
You’re already logged in to Cloudflare, so this should upload the contents of `website/` (including `index.html`) to a Pages project named **phosphorus31-org**.

### 2. Point your domain at that project

- In Cloudflare: **Workers & Pages** → **Pages** → open **phosphorus31-org**.
- Go to **Custom domains**.
- Add:
  - `phosphorus31.org` (root)
  - `www.phosphorus31.org` (www)

Cloudflare will show the CNAME target (it should be **phosphorus31-org.pages.dev**).

### 3. Check DNS

- Go to **Domains** → **phosphorus31.org** → **DNS** → **Records**.
- You should have:
  - **Type:** CNAME  
    **Name:** `@` (or `phosphorus31.org`)  
    **Target:** `phosphorus31-org.pages.dev`  
    **Proxy:** Proxied (orange cloud) is fine.
  - **Type:** CNAME  
    **Name:** `www`  
    **Target:** `phosphorus31-org.pages.dev`  
    **Proxy:** Proxied.

If the target is something like `phosphorus31.pages.dev` (without `-org`), that’s a different project — **edit the record** and set the target to **phosphorus31-org.pages.dev**. Save.

### 4. Test

Open https://phosphorus31.org/ and https://www.phosphorus31.org/.  
After a deploy and correct DNS, both should show the P31 Labs landing page instead of 404.

---

## Why this works

- The repo has a real site in **website/** (e.g. `website/index.html`).
- The launch workflow is set to deploy that folder as **phosphorus31-org** on push to `main`, but that only runs if CI passes and GitHub has `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set.
- Deploying once with `wrangler pages deploy` creates/updates the **phosphorus31-org** project and puts the current `website/` content live. After that, the domain just needs to point at **phosphorus31-org.pages.dev**.

---

## Later: automate via GitHub

To have every push to `main` update the site:

1. In Cloudflare: **My Profile** → **API Tokens** → Create token with **Account** → **Cloudflare Pages Edit**.
2. In GitHub: repo **Settings** → **Secrets and variables** → **Actions** → New repository secrets:
   - `CLOUDFLARE_API_TOKEN` = that token
   - `CLOUDFLARE_ACCOUNT_ID` = your Cloudflare Account ID (in the right-hand sidebar of the dashboard).
3. Push to `main` or run the **P31 Launch** workflow manually. The **Launch phosphorus31.org** job will run `pages deploy website/ --project-name=phosphorus31-org`.

Until then, re-run the `pnpm exec wrangler pages deploy website/ --project-name=phosphorus31-org` command whenever you want to update the live site.
