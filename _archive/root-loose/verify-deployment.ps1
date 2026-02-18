# P31 Labs — Website Deployment Verification Script
# Agent 4: Post-Deployment Verification
# Usage: .\verify-deployment.ps1

Write-Host "🔺 P31 Labs — Deployment Verification" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$domain = "phosphorus31.org"
$baseUrl = "https://$domain"
$wwwUrl = "https://www.$domain"

# Test counter
$testsPassed = 0
$testsFailed = 0
$testsTotal = 0

function Test-Url {
    param(
        [string]$Url,
        [string]$Description
    )
    
    $testsTotal++
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        $statusDescription = $response.StatusDescription
        
        if ($statusCode -eq 200) {
            Write-Host "  ✅ PASS: HTTP $statusCode $statusDescription" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host "  ⚠️  WARNING: HTTP $statusCode $statusDescription" -ForegroundColor Yellow
            $script:testsPassed++
            return $true
        }
    } catch {
        Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
    Write-Host ""
}

function Test-Https {
    param([string]$Url)
    
    $testsTotal++
    Write-Host "Testing: HTTPS/SSL" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.BaseResponse.ResponseUri.Scheme -eq "https") {
            Write-Host "  ✅ PASS: HTTPS enabled" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host "  ❌ FAIL: Not using HTTPS" -ForegroundColor Red
            $script:testsFailed++
            return $false
        }
    } catch {
        Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
    Write-Host ""
}

function Test-SEOFile {
    param(
        [string]$Url,
        [string]$FileName
    )
    
    $testsTotal++
    Write-Host "Testing: $FileName" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ PASS: $FileName accessible" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host "  ❌ FAIL: HTTP $($response.StatusCode)" -ForegroundColor Red
            $script:testsFailed++
            return $false
        }
    } catch {
        Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
    Write-Host ""
}

# Header
Write-Host "Testing deployment for: $domain" -ForegroundColor Cyan
Write-Host ""

# Test 1: Main domain HTTPS
Test-Https -Url $baseUrl

# Test 2: Main domain loads
Test-Url -Url $baseUrl -Description "Main domain (phosphorus31.org)"

# Test 3: www subdomain
Test-Url -Url $wwwUrl -Description "www subdomain (www.phosphorus31.org)"

# Test 4: robots.txt
Test-SEOFile -Url "$baseUrl/robots.txt" -FileName "robots.txt"

# Test 5: sitemap.xml
Test-SEOFile -Url "$baseUrl/sitemap.xml" -FileName "sitemap.xml"

# Test 6: Page load time
$testsTotal++
Write-Host "Testing: Page load time" -ForegroundColor Yellow
Write-Host "  URL: $baseUrl" -ForegroundColor Gray
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    $stopwatch.Stop()
    $loadTime = $stopwatch.ElapsedMilliseconds
    
    if ($loadTime -lt 1000) {
        Write-Host "  ✅ PASS: Loaded in $loadTime ms (< 1 second)" -ForegroundColor Green
        $testsPassed++
    } elseif ($loadTime -lt 3000) {
        Write-Host "  ⚠️  WARNING: Loaded in $loadTime ms (1-3 seconds)" -ForegroundColor Yellow
        $testsPassed++
    } else {
        Write-Host "  ❌ FAIL: Loaded in $loadTime ms (> 3 seconds)" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}
Write-Host ""

# Summary
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tests passed: $testsPassed / $testsTotal" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Yellow" })
Write-Host "Tests failed: $testsFailed / $testsTotal" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✅ ALL TESTS PASSED" -ForegroundColor Green
    Write-Host "Website is live and ready!" -ForegroundColor Green
} else {
    Write-Host "⚠️  SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "Review failures above and check:" -ForegroundColor Yellow
    Write-Host "  • DNS propagation (wait 5-30 minutes)" -ForegroundColor Gray
    Write-Host "  • SSL certificate (wait up to 24 hours, usually < 5 min)" -ForegroundColor Gray
    Write-Host "  • Cloudflare Pages deployment status" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test in browser: $baseUrl" -ForegroundColor White
Write-Host "  2. Test mobile responsiveness" -ForegroundColor White
Write-Host "  3. Test Open Graph: https://www.opengraph.xyz/url/$baseUrl" -ForegroundColor White
Write-Host "  4. Test performance: https://pagespeed.web.dev/?url=$baseUrl" -ForegroundColor White
Write-Host ""
Write-Host "The Mesh Holds. 🔺" -ForegroundColor Green
Write-Host ""
