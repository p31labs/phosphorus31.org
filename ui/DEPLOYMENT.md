# Compatibility with GitHub Pages & Cloudflare Pages

**Short answer:** Yes, the P31 Scope (React app in `ui/`) works on GitHub Pages and Cloudflare Pages. Wallet integration degrades gracefully when the extension is not installed, so the site remains fully functional.

---

## Why It Works

- **Static assets only** — The app is built with Vite and outputs plain HTML, CSS, and JavaScript. No server-side code is required.
- **Extension APIs are optional** — The wallet bridge checks for `chrome.runtime?.id` before talking to the wallet extension. If the extension isn’t present, it falls back to mock data and disables real wallet actions.
- **No special CORS or headers** — Communication is either local (stores) or to public RPC endpoints. Default RPCs (e.g. LlamaRPC, Ankr) support browser requests.

---

## Adjustments for Production

### 1. Base path (subpath hosting)

If the site is served from a subpath (e.g. `username.github.io/p31` or `your-project.pages.dev/p31`), set the Vite base when building:

```bash
# GitHub Pages project site at username.github.io/p31
VITE_BASE_PATH=/p31/ npm run build
```

If `VITE_BASE_PATH` is not set, the build uses `/web/` (default for ESP32 SPIFFS). For root hosting use:

```bash
VITE_BASE_PATH=/ npm run build
```

### 2. RPC endpoints

Use RPC endpoints that are publicly accessible and support CORS. The defaults in the app already do.

### 3. SPA routing fallback

- **Cloudflare Pages** — A `public/_redirects` file is included so all routes fall back to `index.html` (SPA mode).
- **GitHub Pages** — After building, copy `dist/index.html` to `dist/404.html` so unknown paths serve the app:
  ```bash
  cp dist/index.html dist/404.html
  ```
  Then deploy the contents of `dist/`.

---

## Testing Without the Extension

With the extension absent, the Scope uses mock wallet data:

1. Open the deployed site.
2. Use the wallet connect control — it should simulate a connection and show a fake balance and address.
3. Swarm, building, coherence, and other features work as usual.

---

## Bundle size and performance

The build is already tuned (chunk splitting, minification). The wallet bridge adds little overhead. Three.js and swarm logic are the main cost but run fine in modern browsers.

---

## Deployment steps

1. **Build**
   ```bash
   cd ui
   npm run build
   ```
   For a subpath (e.g. `/p31/`):
   ```bash
   VITE_BASE_PATH=/p31/ npm run build
   ```

2. **GitHub Pages**
   - Upload the contents of `dist/` to your gh-pages branch or use GitHub Actions.
   - Ensure `404.html` is present (copy from `index.html` as above) so client-side routes work.

3. **Cloudflare Pages**
   - Connect the repo or upload `dist/` (the repo’s `public/_redirects` is copied into `dist/` by Vite).
   - SPA fallback is handled by `_redirects`.

---

*The mesh holds — on any static host.* 🔺
