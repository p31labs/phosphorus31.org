# LAUNCH

## Local Development
cd ui && npm install && npm run dev

## Production Build
cd ui && npm run build
# Output: ui/dist/

## Preview Production Build
cd ui && npm run preview

## Go Live on Cloudflare Pages
1. Dashboard: dash.cloudflare.com -> Pages -> Create project
2. Connect GitHub repository
3. Build settings:
   - Build command: cd ui && npm install && npm run build
   - Build output directory: ui/dist
4. Environment variables (optional):
   - VITE_GEMINI_KEY: Gemini API key (AI features)
   - VITE_SHELTER_URL: Shelter backend URL (sync features)
5. Custom domain: phosphorus31.org
   - Add CNAME record pointing to your-project.pages.dev

## Verify Production
Visit each route:
- / (landing — Quantum Hello World)
- /scope (Scope dashboard — spoons, LOVE, status)
- /wallet (LOVE economy)
- /fold (philosophy, publications)
- /challenges (growth system)
- /sprout (child interface — 4 buttons)
- /identity (molecule fingerprint)
- /mesh (network status)
- /connections (integration status)
- /bonding (molecule builder)
- /studio (creative workspace)
- /molecule (molecule hub)
- /apps/ (marketplace — 10 standalone apps)

## Backend (optional, runs separately)

```bash
cd apps/shelter && npm install && npm run build && npm start
```

Set `VITE_SHELTER_URL=http://localhost:4000` in `ui/.env.local` so the Scope talks to Shelter.

---

The mesh holds.
