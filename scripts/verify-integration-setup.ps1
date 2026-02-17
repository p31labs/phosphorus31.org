# Quick verification script for integration test setup (PowerShell)
# Checks that all required files and dependencies are in place

$ErrorActionPreference = "Stop"

Write-Host "🔺 P31 Labs — Integration Setup Verification" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

# Check for required files
Write-Host "📁 Checking required files..." -ForegroundColor Yellow

$files = @(
  "docs/INTEGRATION_MAP.md",
  "docs/INTEGRATION.md",
  "docker-compose.integration.yml",
  "scripts/integration-test.sh",
  "scripts/integration-test.ps1",
  "ui/src/__tests__/integration/scope-centaur.test.ts",
  "ui/src/__tests__/integration/scope-buffer.test.ts",
  "ui/src/__tests__/integration/scope-node-one.test.ts",
  "ui/src/__tests__/integration/node-one-mock-server.ts",
  "ui/src/__tests__/integration/end-to-end.test.ts",
  "cognitive-shield/src/__tests__/integration/buffer-centaur.test.ts"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "  ✅ $file" -ForegroundColor Green
  } else {
    Write-Host "  ❌ $file (MISSING)" -ForegroundColor Red
    $errors++
  }
}

Write-Host ""
Write-Host "📦 Checking package.json scripts..." -ForegroundColor Yellow

$packageJson = Get-Content "ui/package.json" -Raw
if ($packageJson -match "test:integration") {
  Write-Host "  ✅ test:integration script found in ui/package.json" -ForegroundColor Green
} else {
  Write-Host "  ❌ test:integration script missing in ui/package.json" -ForegroundColor Red
  $errors++
}

Write-Host ""
Write-Host "🐳 Checking Docker setup..." -ForegroundColor Yellow

if (Get-Command docker -ErrorAction SilentlyContinue) {
  Write-Host "  ✅ Docker is installed" -ForegroundColor Green
  try {
    docker info | Out-Null
    Write-Host "  ✅ Docker is running" -ForegroundColor Green
  } catch {
    Write-Host "  ⚠️  Docker is installed but not running" -ForegroundColor Yellow
  }
} else {
  Write-Host "  ⚠️  Docker is not installed (optional for local testing)" -ForegroundColor Yellow
}

if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
  Write-Host "  ✅ docker-compose is installed" -ForegroundColor Green
} else {
  Write-Host "  ⚠️  docker-compose is not installed (optional for local testing)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Checking documentation..." -ForegroundColor Yellow

if (Test-Path "docs/INTEGRATION_MAP.md") {
  $mapLines = (Get-Content "docs/INTEGRATION_MAP.md").Count
  if ($mapLines -gt 100) {
    Write-Host ("  ✅ INTEGRATION_MAP.md is comprehensive ($mapLines lines)") -ForegroundColor Green
  } else {
    Write-Host ("  ⚠️  INTEGRATION_MAP.md seems incomplete ($mapLines lines)") -ForegroundColor Yellow
  }
}

if (Test-Path "docs/INTEGRATION.md") {
  $integrationLines = (Get-Content "docs/INTEGRATION.md").Count
  if ($integrationLines -gt 200) {
    Write-Host ("  ✅ INTEGRATION.md is comprehensive ($integrationLines lines)") -ForegroundColor Green
  } else {
    Write-Host ("  ⚠️  INTEGRATION.md seems incomplete ($integrationLines lines)") -ForegroundColor Yellow
  }
}

Write-Host ""
if ($errors -eq 0) {
  Write-Host "✅ All checks passed! Integration setup is complete." -ForegroundColor Green
  Write-Host ""
  Write-Host "Next steps:" -ForegroundColor Cyan
  Write-Host "  1. Install dependencies: cd ui && npm install" -ForegroundColor White
  Write-Host "  2. Run integration tests: .\scripts\integration-test.ps1" -ForegroundColor White
  Write-Host "  3. Or run tests manually: cd ui && npm run test:integration" -ForegroundColor White
  exit 0
} else {
  Write-Host "❌ Found $errors error(s). Please fix before running tests." -ForegroundColor Red
  exit 1
}
