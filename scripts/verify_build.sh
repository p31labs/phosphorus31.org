#!/usr/bin/env bash
# P31 Labs — pre-deploy build verification
# Run from repo root before pushing to Cloudflare Pages.
# Usage: bash scripts/verify_build.sh

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓${NC}  $1"; }
fail() { echo -e "${RED}✗${NC}  $1"; FAILED=1; }
info() { echo -e "${YELLOW}→${NC}  $1"; }

FAILED=0

echo ""
echo "P31 Labs — Cloudflare Pages pre-deploy check"
echo "============================================="
echo ""

info "Checking Node.js version..."
NODE_VER=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -ge 20 ]; then
  pass "Node.js $(node --version)"
else
  fail "Node.js 20+ required. Found: $(node --version)"
fi

info "Installing dependencies in ui/..."
cd ui
npm install --silent
pass "npm install complete"

info "TypeScript check..."
if npx tsc --noEmit 2>/dev/null; then
  pass "TypeScript: no errors"
else
  echo -e "${YELLOW}⚠${NC}   TypeScript errors (build may still succeed)"
fi

info "Running Vite build..."
npm run build
if [ -d "dist" ]; then
  pass "Build succeeded → dist/"
else
  fail "Build produced no dist/"
fi

info "Checking _redirects and _headers in dist/..."
if [ -f "dist/_redirects" ]; then
  pass "_redirects in dist/"
else
  fail "_redirects missing in dist/ — ensure ui/public/_redirects exists and rebuild"
fi
if [ -f "dist/_headers" ]; then
  pass "_headers in dist/"
else
  fail "_headers missing in dist/ — ensure ui/public/_headers exists and rebuild"
fi

if [ -f "dist/index.html" ]; then
  pass "dist/index.html present"
else
  fail "dist/index.html missing"
fi

info "Checking Greenhouse apps..."
APP_COUNT=$(ls dist/apps/*.html 2>/dev/null | wc -l)
if [ "$APP_COUNT" -gt 0 ]; then
  pass "$APP_COUNT Greenhouse app(s) in dist/apps/"
else
  fail "No HTML apps in dist/apps/ — check ui/public/apps/ and publicDir"
fi

CRITICAL_APPS=(breathing-pacer sensory-check spoon-counter entangled-buffer)
for app in "${CRITICAL_APPS[@]}"; do
  if [ -f "dist/apps/${app}.html" ]; then
    pass "  ${app}.html"
  else
    fail "  ${app}.html MISSING"
  fi
done

info "Asset size..."
TOTAL=$(du -sh dist/ | cut -f1)
pass "Total dist: $TOTAL"

echo ""
if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}All checks passed. Safe to push to Cloudflare Pages.${NC}"
  echo "  Build command: cd ui && npm install && npm run build"
  echo "  Output dir:    ui/dist"
else
  echo -e "${RED}$FAILED check(s) failed. Fix before pushing.${NC}"
  exit 1
fi
cd ..
