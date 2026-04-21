# Unified k4-cage (CWP-30)

Merged **K₄ topology** (original k4-cage) + **FamilyMeshRoom** WebSockets (CWP) in one Worker.

**Canonical home:** copy this folder into [`p31labs/andromeda`](https://github.com/p31labs/andromeda) at `04_SOFTWARE/k4-cage/` (replace `src/index.js` + `wrangler.toml`, or deploy from here with `wrangler.toml` `name` aligned to your zone).

## Files

| File | Purpose |
|------|--------|
| `src/index.js` | Worker + `K4Topology` + `FamilyMeshRoom` Durable Objects |
| `wrangler.toml` | DO bindings, D1, KV placeholder, optional AI |
| `schema.sql` | D1 `telemetry` table with `hash` / `prev_hash` chain columns |

## Deploy (Andromeda repo)

1. Replace KV `id` in `wrangler.toml` with the namespace ID from the original k4-cage Worker.
2. Confirm `database_id` for `p31-telemetry` matches your account (or create a new D1 and update the id).
3. Apply schema:

```bash
npx wrangler d1 execute p31-telemetry --remote --file=schema.sql
```

4. Set secret: `npx wrangler secret put ADMIN_TOKEN`
5. Deploy from the directory that contains this `wrangler.toml`:

```bash
npx wrangler deploy
```

See `scripts/deploy-cwp30.sh` for a guided checklist.
