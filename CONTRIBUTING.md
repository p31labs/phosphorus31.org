# Contributing to P31 Labs

P31 Labs builds open-source assistive technology for neurodivergent families. Contributions are welcome.

## Quick Start

```bash
git clone https://github.com/p31labs/p31.git
cd p31
pnpm install
pnpm dev
```

Node 20+ required. pnpm is the package manager.

## Architecture

The system is organized as a monorepo with 18 packages built by Turborepo. The core product is a K₄ mesh — four interconnected product vertices (BONDING, Buffer/Mesh, Node Zero, Spaceship Earth) sharing a unified telemetry pipeline and per-user state.

The Cloudflare Workers are deployed separately from the monorepo. Each worker lives in its own directory under `04_SOFTWARE/` in the andromeda branch, or is deployed directly via `wrangler deploy`.

## What Needs Help

**Immediate (April–May 2026):**
- Fix SUPER-CENTAUR TypeScript errors (38 errors in 7 files — mostly missing method stubs and type mismatches)
- Add X-Frame-Options and Strict-Transport-Security headers to Cloudflare Pages config
- WebSocket integration tests (need `websockets` Python library or a JS-based test)
- Energy endpoint debugging in k4-personal (returning error 1101 on some calls)

**Medium-term:**
- Spaceship Earth dashboard (Three.js geodesic dome rendering Q-Factor)
- Node Zero firmware (ESP-IDF 5.5.3, LVGL 8.4, SX1262 LoRa driver)
- BONDING integration with Spaceship Earth (LOVE tokens as telemetry events)
- Offline PWA service worker improvements
- Accessibility audit (axe-core automated scanning exists but coverage is incomplete)

**Always welcome:**
- Bug reports with reproduction steps
- Documentation improvements
- Translations (the children's interface should support Spanish)
- Test coverage improvements (target: 60% across all packages)

## Code Quality

Pre-commit hooks run ESLint and Prettier via lint-staged. TypeScript strict mode is enforced in the UI package. Tests run with Vitest.

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Test UI
cd ui && pnpm test

# Verify live mesh
./scripts/verify-mesh.sh
```

## Branching

- `main` — stable, deployed
- `docs/paper-iii-cwp-014` — active development branch with latest CWP work
- Feature branches: `feat/description`, `fix/description`

## Communication

- Email: will@p31ca.org
- Issues: GitHub Issues on this repo
- The founder is AuDHD. Direct communication is preferred. No corporate pleasantries needed.

## Code of Conduct

Be kind. This project exists because a parent needed tools that didn't exist for his neurodivergent family. Contributions that center the needs of neurodivergent users are especially valued.

## License

See individual package licenses. The intent is open source — if a license is missing or unclear, ask.