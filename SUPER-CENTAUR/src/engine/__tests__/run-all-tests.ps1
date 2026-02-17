# Run All Tests Script (PowerShell)
# Runs all tests with coverage and generates report

Write-Host "🧪 Running all game engine tests..." -ForegroundColor Cyan
Write-Host ""

# Run tests with coverage
npm test -- --coverage --verbose

Write-Host ""
Write-Host "✅ All tests complete!" -ForegroundColor Green
Write-Host "📊 Coverage report generated in coverage/" -ForegroundColor Yellow
