# Integration Test Script (PowerShell)
# Starts all services, runs tests, then tears down

$ErrorActionPreference = "Stop"

Write-Host "🔺 P31 Labs — Integration Testing" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ docker-compose is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Starting integration test environment..." -ForegroundColor Yellow
docker-compose -f docker-compose.integration.yml up -d

Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Wait for services to be ready
Write-Host "🔍 Checking service health..." -ForegroundColor Yellow

# Check Centaur
$centaurHealthy = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ P31 Tandem is healthy" -ForegroundColor Green
            $centaurHealthy = $true
            break
        }
    } catch {
        if ($i -eq 30) {
            Write-Host "❌ P31 Tandem failed to start" -ForegroundColor Red
            docker-compose -f docker-compose.integration.yml logs centaur
            exit 1
        }
        Start-Sleep -Seconds 2
    }
}

# Check Buffer
$bufferHealthy = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ The Buffer is healthy" -ForegroundColor Green
            $bufferHealthy = $true
            break
        }
    } catch {
        if ($i -eq 30) {
            Write-Host "❌ The Buffer failed to start" -ForegroundColor Red
            docker-compose -f docker-compose.integration.yml logs buffer
            exit 1
        }
        Start-Sleep -Seconds 2
    }
}

# Check Scope
$scopeHealthy = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ The Scope is healthy" -ForegroundColor Green
            $scopeHealthy = $true
            break
        }
    } catch {
        if ($i -eq 30) {
            Write-Host "❌ The Scope failed to start" -ForegroundColor Red
            docker-compose -f docker-compose.integration.yml logs scope
            exit 1
        }
        Start-Sleep -Seconds 2
    }
}

# Check Mock Node One
$nodeOneHealthy = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Mock Node One is healthy" -ForegroundColor Green
            $nodeOneHealthy = $true
            break
        }
    } catch {
        if ($i -eq 30) {
            Write-Host "❌ Mock Node One failed to start" -ForegroundColor Red
            docker-compose -f docker-compose.integration.yml logs node-one-mock
            exit 1
        }
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "🚀 All services are healthy. Running integration tests..." -ForegroundColor Green
Write-Host ""

# Run integration tests
Set-Location ui
npm run test:integration

$testExitCode = $LASTEXITCODE

Write-Host ""
if ($testExitCode -eq 0) {
    Write-Host "✅ Integration tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Integration tests failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧹 Tearing down integration test environment..." -ForegroundColor Yellow
Set-Location ..
docker-compose -f docker-compose.integration.yml down

if ($testExitCode -eq 0) {
    Write-Host ""
    Write-Host "🔺 The mesh holds. Integration testing complete." -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "❌ Integration testing failed. Check logs above." -ForegroundColor Red
    exit 1
}
