#!/bin/bash
# Quick verification script for integration test setup
# Checks that all required files and dependencies are in place

set -e

echo "🔺 P31 Labs — Integration Setup Verification"
echo "============================================"
echo ""

ERRORS=0

# Check for required files
echo "📁 Checking required files..."

FILES=(
  "docs/INTEGRATION_MAP.md"
  "docs/INTEGRATION.md"
  "docker-compose.integration.yml"
  "scripts/integration-test.sh"
  "scripts/integration-test.ps1"
  "ui/src/__tests__/integration/scope-centaur.test.ts"
  "ui/src/__tests__/integration/scope-buffer.test.ts"
  "ui/src/__tests__/integration/scope-node-one.test.ts"
  "ui/src/__tests__/integration/node-one-mock-server.ts"
  "ui/src/__tests__/integration/end-to-end.test.ts"
  "cognitive-shield/src/__tests__/integration/buffer-centaur.test.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MISSING)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "📦 Checking package.json scripts..."

if grep -q "test:integration" ui/package.json; then
  echo "  ✅ test:integration script found in ui/package.json"
else
  echo "  ❌ test:integration script missing in ui/package.json"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🐳 Checking Docker setup..."

if command -v docker &> /dev/null; then
  echo "  ✅ Docker is installed"
  if docker info > /dev/null 2>&1; then
    echo "  ✅ Docker is running"
  else
    echo "  ⚠️  Docker is installed but not running"
  fi
else
  echo "  ⚠️  Docker is not installed (optional for local testing)"
fi

if command -v docker-compose &> /dev/null; then
  echo "  ✅ docker-compose is installed"
else
  echo "  ⚠️  docker-compose is not installed (optional for local testing)"
fi

echo ""
echo "📚 Checking documentation..."

if [ -f "docs/INTEGRATION_MAP.md" ]; then
  MAP_LINES=$(wc -l < docs/INTEGRATION_MAP.md)
  if [ "$MAP_LINES" -gt 100 ]; then
    echo "  ✅ INTEGRATION_MAP.md is comprehensive ($MAP_LINES lines)"
  else
    echo "  ⚠️  INTEGRATION_MAP.md seems incomplete ($MAP_LINES lines)"
  fi
fi

if [ -f "docs/INTEGRATION.md" ]; then
  INTEGRATION_LINES=$(wc -l < docs/INTEGRATION.md)
  if [ "$INTEGRATION_LINES" -gt 200 ]; then
    echo "  ✅ INTEGRATION.md is comprehensive ($INTEGRATION_LINES lines)"
  else
    echo "  ⚠️  INTEGRATION.md seems incomplete ($INTEGRATION_LINES lines)"
  fi
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ All checks passed! Integration setup is complete."
  echo ""
  echo "Next steps:"
  echo "  1. Install dependencies: cd ui && npm install"
  echo "  2. Run integration tests: ./scripts/integration-test.sh"
  echo "  3. Or run tests manually: cd ui && npm run test:integration"
  exit 0
else
  echo "❌ Found $ERRORS error(s). Please fix before running tests."
  exit 1
fi
