#!/usr/bin/env bash
# CWP-30: checklist for unified k4-cage (andromeda) + mesh-bridge (P31 Tandem).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CAGE="${ROOT}/04_SOFTWARE/unified-k4-cage"

echo "═══ CWP-30 deploy checklist ═══"
echo ""
echo "1) D1 schema (remote):"
echo "   cd ${CAGE}"
echo "   npx wrangler d1 execute p31-telemetry --remote --file=schema.sql"
echo ""
echo "2) Fill KV id in ${CAGE}/wrangler.toml (from original k4-cage)."
echo ""
echo "3) Deploy Worker:"
echo "   cd ${CAGE} && npx wrangler secret put ADMIN_TOKEN && npx wrangler deploy"
echo ""
echo "4) P31 monorepo: mesh-bridge is at SUPER-CENTAUR/src/mesh-bridge.ts"
echo "   Production: NODE_ENV=production enables proxy routes."
echo ""
