#!/bin/bash
# P31 Labs — Post-build verification
# Run after: cd ui && npm run build
set -e

echo "═══════════════════════════════════════"
echo "P31 Build Verification"
echo "═══════════════════════════════════════"

DIST="ui/dist"
FAIL=0

check() {
  if eval "$1"; then
    echo "  ✓ $2"
  else
    echo "  ✗ $2"
    FAIL=1
  fi
}

echo ""
echo "Core files:"
check "[ -f $DIST/index.html ]" "index.html exists"
check "[ -f $DIST/CNAME ]" "CNAME exists"
check "grep -q 'p31ca.org' $DIST/CNAME" "CNAME says p31ca.org"

echo ""
echo "Greenhouse apps:"
check "[ -f $DIST/apps/apps.json ]" "apps.json exists"
check "[ -f $DIST/apps/content-forge.html ]" "content-forge.html exists"
check "[ -f $DIST/apps/entangled-buffer.html ]" "entangled-buffer.html exists"
check "[ -f $DIST/apps/spoon-counter.html ]" "spoon-counter.html exists"

APP_COUNT=$(find $DIST/apps/ -name "*.html" 2>/dev/null | wc -l)
echo ""
echo "  Greenhouse apps found: $APP_COUNT"

echo ""
echo "Assets:"
check "[ -d $DIST/assets ]" "assets/ directory exists"
JS_COUNT=$(find $DIST/assets/ -name "*.js" 2>/dev/null | wc -l)
CSS_COUNT=$(find $DIST/assets/ -name "*.css" 2>/dev/null | wc -l)
echo "  JS bundles: $JS_COUNT"
echo "  CSS bundles: $CSS_COUNT"

echo ""
echo "MATA check:"
MATA_COUNT=$(grep -rl "MATA" $DIST/ 2>/dev/null | wc -l)
check "[ $MATA_COUNT -eq 0 ]" "Zero MATA references"

echo ""
DIST_SIZE=$(du -sh $DIST/ | cut -f1)
echo "Total dist size: $DIST_SIZE"

echo ""
echo "═══════════════════════════════════════"
if [ $FAIL -eq 0 ]; then
  echo "ALL CHECKS PASSED ✓"
  exit 0
else
  echo "SOME CHECKS FAILED ✗"
  exit 1
fi
