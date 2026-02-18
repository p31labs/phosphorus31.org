# P31 Health Monitor (Cloudflare Worker)

Edge health checks for phosphorus31.org and Shelter API. Runs on a schedule and exposes a JSON dashboard.

## Setup

1. **Create KV namespace**  
   Dashboard → Workers & Pages → KV → Create namespace → name `P31_KV`. Note the ID.

2. **Create Worker**  
   Dashboard → Workers & Pages → Create application → Worker. Name: `p31-health-monitor`.

3. **Paste code** from `index.js` into the worker editor.

4. **Settings → Variables**
   - `SHELTER_URL` = `https://shelter.p31.io`
   - `WEBSITE_URL` = `https://phosphorus31.org`
   - `ALERT_WEBHOOK` = (optional) Slack or email webhook URL

5. **Settings → KV namespace bindings**  
   Variable name: `P31_KV`, KV namespace: `P31_KV` (the one you created).

6. **Triggers → Cron**  
   Add: `*/5 * * * *` (every 5 minutes).

7. **Deploy.**

## Dashboard

`GET https://p31-health-monitor.<your-subdomain>.workers.dev` returns:

- `lastCheck`, `lastResults`, `checksLast24h`, `uptimePercent`

Optional: add custom domain `health.p31.io` in Workers → Routes.
