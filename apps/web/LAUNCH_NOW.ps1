# P31 Labs — phosphorus31.org Launch Script
# Usage: run from apps/web — .\LAUNCH_NOW.ps1

Write-Host "🔺 P31 Labs — Website Launch" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory (apps/web)
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: index.html not found. Run this script from apps/web." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Landing page found: index.html" -ForegroundColor Green
Write-Host "✅ CNAME file found: CNAME" -ForegroundColor Green
Write-Host "✅ SEO files found: robots.txt, sitemap.xml" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "📦 Git Status Check..." -ForegroundColor Yellow
$gitStatus = git status --porcelain 2>&1
if ($LASTEXITCODE -eq 0) {
    if ($gitStatus) {
        Write-Host "⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
        Write-Host $gitStatus
        Write-Host ""
        Write-Host "💡 Tip: Commit changes before launch:" -ForegroundColor Cyan
        Write-Host "   git add ." -ForegroundColor White
        Write-Host "   git commit -m 'launch: phosphorus31.org landing page'" -ForegroundColor White
        Write-Host "   git push origin main" -ForegroundColor White
    } else {
        Write-Host "✅ All changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Not a git repository (or git not installed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 LAUNCH OPTIONS" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Cloudflare Pages (RECOMMENDED)" -ForegroundColor Green
Write-Host "  • Domain already in Cloudflare" -ForegroundColor Gray
Write-Host "  • Free, automatic SSL, fast CDN" -ForegroundColor Gray
Write-Host "  • Time: 10-15 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "  Steps:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://dash.cloudflare.com → Pages" -ForegroundColor White
Write-Host "  2. Create project → Connect GitHub" -ForegroundColor White
Write-Host "  3. Select repo: p31labs/p31 (or your p31 monorepo)" -ForegroundColor White
Write-Host "  4. Build settings:" -ForegroundColor White
Write-Host "     • Framework: None" -ForegroundColor Gray
Write-Host '     • Build command: leave empty' -ForegroundColor Gray
Write-Host "     • Root directory: apps/web" -ForegroundColor Gray
Write-Host "     • Build output: / (root of apps/web)" -ForegroundColor Gray
Write-Host "  5. Add custom domain: phosphorus31.org" -ForegroundColor White
Write-Host '  6. Wait for SSL - usually less than 5 minutes' -ForegroundColor White
Write-Host ""
Write-Host "Option 2: GitHub Pages" -ForegroundColor Green
Write-Host "  • Simple, free, reliable" -ForegroundColor Gray
Write-Host "  • Time: 20-30 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "  Steps:" -ForegroundColor Yellow
Write-Host "  1. Create repo: trimtab-signal/phosphorus31.org (or use p31 with root apps/web)" -ForegroundColor White
Write-Host "  2. Push apps/web contents or set Pages source to apps/web" -ForegroundColor White
Write-Host "  3. Enable Pages: Settings → Pages → main branch, root as needed" -ForegroundColor White
Write-Host "  4. Configure Cloudflare DNS:" -ForegroundColor White
Write-Host "     • CNAME: phosphorus31.org → [username].github.io" -ForegroundColor Gray
Write-Host "     • CNAME: www → [username].github.io" -ForegroundColor Gray
Write-Host "  5. Enable 'Always Use HTTPS' in Cloudflare" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Vercel (Alternative)" -ForegroundColor Green
Write-Host "  • Fast, good CDN" -ForegroundColor Gray
Write-Host "  • Time: 15-20 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "  Steps:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://vercel.com → New Project" -ForegroundColor White
Write-Host "  2. Import repo: p31labs/p31" -ForegroundColor White
Write-Host "  3. Root directory: apps/web" -ForegroundColor White
Write-Host "  4. Add domain: phosphorus31.org" -ForegroundColor White
Write-Host "  5. Deploy" -ForegroundColor White
Write-Host ""

# Verification checklist
Write-Host "✅ POST-LAUNCH VERIFICATION" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After launch, verify:" -ForegroundColor Yellow
Write-Host "  [ ] https://phosphorus31.org loads" -ForegroundColor White
Write-Host '  [ ] HTTPS certificate valid (green lock icon)' -ForegroundColor White
Write-Host "  [ ] Mobile responsive" -ForegroundColor White
Write-Host "  [ ] Page loads in less than 1 second" -ForegroundColor White
Write-Host '  [ ] Open Graph tags work (test in Slack/Twitter)' -ForegroundColor White
Write-Host "  [ ] robots.txt accessible: https://phosphorus31.org/robots.txt" -ForegroundColor White
Write-Host "  [ ] sitemap.xml accessible: https://phosphorus31.org/sitemap.xml" -ForegroundColor White
Write-Host ""

# Quick test command
Write-Host "🧪 QUICK TEST COMMANDS" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test HTTPS:" -ForegroundColor Yellow
Write-Host "  curl -I https://phosphorus31.org" -ForegroundColor White
Write-Host ""
Write-Host "Test www redirect:" -ForegroundColor Yellow
Write-Host "  curl -I https://www.phosphorus31.org" -ForegroundColor White
Write-Host ""

Write-Host "📋 DETAILED GUIDES" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan
Write-Host "  • Cloudflare: See LAUNCH_CLOUDFLARE.md" -ForegroundColor White
Write-Host "  • Full prep: See repo root PREP_FOR_LAUNCH.md" -ForegroundColor White
Write-Host ""

Write-Host "The Mesh Holds. Ready to launch." -ForegroundColor Green
Write-Host ""
