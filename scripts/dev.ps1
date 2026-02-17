# P31 Development Script (PowerShell)
# Starts all P31 components in development mode

Write-Host "🔺 Starting P31 Development Environment" -ForegroundColor Cyan
Write-Host "Phosphorus-31. The biological qubit. The atom in the bone." -ForegroundColor Gray
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Host "❌ Node.js version must be 18 or higher. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node -v) detected" -ForegroundColor Green
Write-Host ""

# Start The Centaur
Write-Host "🦄 Starting The Centaur (backend)..." -ForegroundColor Yellow
$centaurJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location SUPER-CENTAUR
    npm run dev
}

# Wait a bit for The Centaur to start
Start-Sleep -Seconds 3

# Start The Scope
Write-Host "📡 Starting The Scope (frontend)..." -ForegroundColor Yellow
$scopeJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location ui
    npm run dev
}

# Start The Buffer if requested
if ($args[0] -eq "--with-buffer") {
    Write-Host "🛡️ Starting The Buffer..." -ForegroundColor Yellow
    $bufferJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location cognitive-shield
        npm run dev
    }
}

Write-Host ""
Write-Host "✅ P31 Development Environment Started" -ForegroundColor Green
Write-Host ""
Write-Host "📍 The Centaur: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 The Scope: http://localhost:5173" -ForegroundColor Cyan
if ($args[0] -eq "--with-buffer") {
    Write-Host "📍 The Buffer: http://localhost:4000" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Wait for user interrupt
try {
    Wait-Job $centaurJob, $scopeJob, $bufferJob -ErrorAction SilentlyContinue | Out-Null
} catch {
    Write-Host "`n🛑 Stopping P31 services..." -ForegroundColor Yellow
    Stop-Job $centaurJob, $scopeJob, $bufferJob -ErrorAction SilentlyContinue
    Remove-Job $centaurJob, $scopeJob, $bufferJob -ErrorAction SilentlyContinue
}
