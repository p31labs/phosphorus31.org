# SOVEREIGN WORKSPACE SETUP
# Run: powershell -ExecutionPolicy Bypass -File SOVEREIGN_SETUP.ps1

Write-Host "SOVEREIGN WORKSPACE SETUP" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

$startTime = Get-Date

# PHASE 1: CHECK PREREQUISITES
Write-Host "`nPHASE 1: Checking Prerequisites..." -ForegroundColor Cyan

$nodeVersion = node --version 2>$null
if ($nodeVersion) { Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green }
else { Write-Host "  Node.js NOT FOUND" -ForegroundColor Red }

$npmVersion = npm --version 2>$null
if ($npmVersion) { Write-Host "  npm: $npmVersion" -ForegroundColor Green }
else { Write-Host "  npm NOT FOUND" -ForegroundColor Red }

$pythonVersion = python --version 2>$null
if ($pythonVersion) { Write-Host "  Python: $pythonVersion" -ForegroundColor Green }
else { Write-Host "  Python NOT FOUND" -ForegroundColor Red }

$gitVersion = git --version 2>$null
if ($gitVersion) { Write-Host "  Git: $gitVersion" -ForegroundColor Green }
else { Write-Host "  Git NOT FOUND" -ForegroundColor Red }

# PHASE 2: SETUP DASHBOARD
Write-Host "`nPHASE 2: Setting up Dashboard..." -ForegroundColor Cyan
if (Test-Path "dashboard/package.json") {
    Push-Location dashboard
    Write-Host "  Installing npm dependencies..."
    npm install 2>$null
    Write-Host "  Dashboard dependencies installed" -ForegroundColor Green
    Pop-Location
}

# PHASE 3: SETUP BACKEND
Write-Host "`nPHASE 3: Setting up Backend..." -ForegroundColor Cyan
if (Test-Path "backend/requirements.txt") {
    Write-Host "  Installing pip dependencies..."
    pip install -r backend/requirements.txt -q 2>$null
    Write-Host "  Backend dependencies installed" -ForegroundColor Green
}

# PHASE 4: SETUP WONKY SPROUT
Write-Host "`nPHASE 4: Setting up Wonky Sprout..." -ForegroundColor Cyan
if (Test-Path "wonky-sprout/package.json") {
    Push-Location wonky-sprout
    npm install 2>$null
    Write-Host "  Wonky Sprout dependencies installed" -ForegroundColor Green
    Pop-Location
}

# PHASE 5: CREATE ENV FILE
Write-Host "`nPHASE 5: Environment Configuration..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "  Created .env from template" -ForegroundColor Green
        Write-Host "  REMINDER: Update .env with your credentials!" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  .env already exists" -ForegroundColor Green
}

# PHASE 6: CREATE LOCAL CONFIG
Write-Host "`nPHASE 6: Local Configuration..." -ForegroundColor Cyan
if (-not (Test-Path "config/credentials.json")) {
    if (Test-Path "config/credentials.json.example") {
        Copy-Item "config/credentials.json.example" "config/credentials.json"
        Write-Host "  Created credentials.json from template" -ForegroundColor Green
    }
}
else {
    Write-Host "  credentials.json already exists" -ForegroundColor Green
}

# PHASE 7: VERIFY SYSTEM
Write-Host "`nPHASE 7: Verifying System Integrity..." -ForegroundColor Cyan

$criticalFiles = @(
    "dashboard/package.json",
    "backend/backend_core.py",
    "genesis-gate/GENESIS_GATE_v3.gs",
    "AGENT_INSTRUCTIONS.md",
    "MANIFESTO.md"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    }
    else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
    }
}

# COMPLETION
$elapsed = ((Get-Date) - $startTime).TotalSeconds

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "SOVEREIGN WORKSPACE SETUP COMPLETE" -ForegroundColor Green
Write-Host "Elapsed: $([math]::Round($elapsed, 2))s" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nNEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Update .env with your API keys"
Write-Host "  2. Deploy genesis-gate/GENESIS_GATE_v3.gs to Google Apps Script"
Write-Host "  3. Run: cd dashboard; npm run dev"
Write-Host "  4. Open: http://localhost:5173"
Write-Host "`nTHE MESH HOLDS." -ForegroundColor Magenta

# OPTIONAL: START DASHBOARD
$response = Read-Host "`nStart the dashboard now? (y/n)"
if ($response -eq 'y') {
    Write-Host "Starting Dashboard..." -ForegroundColor Cyan
    Push-Location dashboard
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Pop-Location
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
}

Write-Host "`nGodspeed, Operator." -ForegroundColor Magenta
