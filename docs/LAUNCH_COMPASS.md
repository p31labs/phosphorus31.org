# Launch P31 Compass to phosphorus31.org

This doc is the procedure to put the P31 Compass (breathing Vector Equilibrium → tap → tetrahedron) live at **https://phosphorus31.org**.

---

## 1. Build locally

From the repo root:

```bash
pnpm --filter @p31labs/navigator build
```

Output: `apps/navigator/dist/` (index.html + hashed JS/CSS assets).  
If the build fails in a sandbox/CI environment (e.g. Windows `spawn EPERM` with esbuild), run the same command on your own machine.

Optional — preview before launch:

```bash
cd apps/navigator && pnpm run preview
```

---

## 2. Launch to Cloudflare Pages

Choose one of the two methods below.

### Option A — Git-connected project (recommended)

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the P31 repo. Set **Root directory** to `apps/navigator` (or leave root and set build output as below).
3. **Build settings:**
   - **Framework preset:** Vite  
   - **Build command:** `pnpm install && pnpm run build` (or `npm run build` if only navigator deps are needed)  
   - **Build output directory:** `dist`
4. If the repo root is used instead of `apps/navigator`, set **Root directory** to `apps/navigator` so the build runs from that folder.
5. **Environment variables (optional):** None required; P31 Compass is static.
6. Save and launch. Subsequent pushes to the connected branch will trigger new builds.

### Option B — Direct upload of `dist/`

1. Build locally (step 1). Ensure `apps/navigator/dist/` contains `index.html` and the asset folders.
2. In Cloudflare Dashboard → **Workers & Pages** → your **phosphorus31.org** project (or create a new Pages project).
3. Go to **Deployments** → **Create deployment** → **Upload assets**.
4. Upload the **contents** of `apps/navigator/dist/` (drag the folder or select all files inside `dist/`). Do not upload the `dist` folder itself as a single file.
5. Launch. Cloudflare will serve the uploaded files at the project URL.

### Option C — Wrangler CLI

If you use Wrangler and already have a Pages project for phosphorus31.org:

```bash
cd apps/navigator
pnpm run build
npx wrangler pages deploy dist --project-name=<your-pages-project-name>
```

Replace `<your-pages-project-name>` with the Cloudflare Pages project name (e.g. `phosphorus31-org`).

---

## 3. Custom domain and DNS

- In the Pages project: **Custom domains** → Add **phosphorus31.org** (and optionally **www.phosphorus31.org**).
- At your DNS provider: CNAME **phosphorus31.org** to the target shown in the dashboard (e.g. `phosphorus31-org.pages.dev`). Cloudflare will provision HTTPS.

---

## 4. Post-launch checks

- [ ] **https://phosphorus31.org** loads the P31 Compass (breathing VE, then tap to transition to tetrahedron).
- [ ] **P31 Buffer vertex** (one of the four) navigates to **https://p31ca.org**.
- [ ] Other vertices open the info panel or intended links.
- [ ] No console errors; works on a quick mobile check.
- [ ] Optional: open P31 Buffer in another tab; P31 Compass reads `p31:spoons` from the bus (same origin only if both are on same domain; otherwise localStorage is per-origin).

---

## Notes

- P31 Compass is static only; no backend. Works offline after first load.
- **p31ca.org** continues to serve the P31 Buffer PWA (separate Pages project or path rules). Both can read the same localStorage bus keys when served from the same origin.
- If the previous phosphorus31.org site was static (`website/` or `apps/web`), archive it at **phosphorus31.org/legacy** only if you add path-based routing or a second project; otherwise the new launch replaces the root.
