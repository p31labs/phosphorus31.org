# P31 Labs — Deployment Checklist

Run before every public push. Print this. Tape it next to your monitor.

## Pre-Deploy

- [ ] `pnpm install` — clean install, no lockfile drift
- [ ] `pnpm build` — all 14 packages build (CENTAUR errors are expected, non-blocking)
- [ ] `cd ui && pnpm test` — 187/188 passing (1 known string assertion)
- [ ] No secrets in staged files (`git diff --cached | grep -i "secret\|password\|token"`)

## Deploy

- [ ] `npx wrangler pages deploy ui/dist --project-name p31-spectrum` — p31ca.org
- [ ] `npx wrangler pages deploy ui/dist --project-name p31-mesh` — p31-mesh.pages.dev
- [ ] Check deploy URLs in wrangler output

## Post-Deploy

- [ ] `./scripts/verify-mesh.sh` — 28/28 passing, 0 failures
- [ ] Visit p31ca.org — fleet status shows green dots
- [ ] Visit p31-mesh.pages.dev — PWA loads, chat works
- [ ] Visit phosphorus31.org — institutional site loads
- [ ] Visit bonding.p31ca.org — BONDING game loads

## Commit

- [ ] `git add -A`
- [ ] `git commit --no-verify -m "deploy: <what changed>"` (bypass hooks if ESLint v9 migration pending)
- [ ] `git push`

## Post-Commit

- [ ] Update Ko-fi if significant changes
- [ ] Update phosphorus31.org if stats changed
- [ ] Screenshot fleet status for records

## Emergency Rollback

```bash
# List recent deploys
npx wrangler pages deployment list --project-name p31-spectrum

# Roll back to previous deploy
npx wrangler pages deployment rollback --project-name p31-spectrum
```

## Worker Deploys (separate from Pages)

Workers are deployed individually via their own directories. Each has a `deploy.sh` or uses `npx wrangler deploy` directly. See `docs/TELEMETRY_AND_DEPLOYMENT.md` for the deploy order.

---

*If verify-mesh.sh passes, ship it.*