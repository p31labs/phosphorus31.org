#!/bin/bash

################################################################################
# G.O.D. / WONKY SPROUT - COMPREHENSIVE AUDIT SCRIPT
################################################################################
#
# PURPOSE: Verify mesh is ready to hold people when hub fails
# PRINCIPLE: "The delta must be perfect before I can drop out the star connection"
#
# This script audits:
# 1. SECURITY (encryption, authentication, vulnerability scanning)
# 2. PRIVACY (data leakage, tracking, surveillance vectors)
# 3. RESILIENCE (single points of failure, redundancy, recovery)
# 4. UX/ACCESSIBILITY (can people actually use it in crisis?)
# 5. PERFORMANCE (fast enough for emergency response?)
# 6. LEGAL COMPLIANCE (HIPAA, COPPA, privacy laws)
# 7. ETHICAL SAFEGUARDS (abuse detection, cult prevention, exit pathways)
#
# USAGE: ./audit-god-complete.sh [project-directory]
#
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CRITICAL=0
HIGH=0
MEDIUM=0
LOW=0
PASSED=0

PROJECT_DIR="${1:-.}"
REPORT_FILE="god-audit-report-$(date +%Y%m%d-%H%M%S).md"

################################################################################
# UTILITY FUNCTIONS
################################################################################

log_section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "## $1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_critical() {
    ((CRITICAL++))
    echo -e "${RED}✗ CRITICAL: $1${NC}"
    echo "**🔴 CRITICAL:** $1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_high() {
    ((HIGH++))
    echo -e "${RED}⚠ HIGH: $1${NC}"
    echo "**🟠 HIGH:** $1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_medium() {
    ((MEDIUM++))
    echo -e "${YELLOW}⚠ MEDIUM: $1${NC}"
    echo "**🟡 MEDIUM:** $1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_low() {
    ((LOW++))
    echo -e "${YELLOW}ℹ LOW: $1${NC}"
    echo "**🟢 LOW:** $1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_pass() {
    ((PASSED++))
    echo -e "${GREEN}✓ PASS: $1${NC}"
    echo "✅ **PASS:** $1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
    echo "$1" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

################################################################################
# INITIALIZE REPORT
################################################################################

cat > "$REPORT_FILE" << 'EOF'
# G.O.D. / WONKY SPROUT - COMPREHENSIVE AUDIT REPORT

**Generated:** $(date)
**Principle:** "The delta must be perfect before I can drop out the star connection"

---

## Executive Summary

This audit verifies that the mesh infrastructure is ready to hold people when centralized systems fail. People's lives depend on this working correctly.

---

EOF

################################################################################
# 1. SECURITY AUDIT
################################################################################

log_section "1. SECURITY AUDIT - Encryption, Authentication, Vulnerabilities"

# 1.1 Check for hardcoded secrets
log_info "1.1 Scanning for hardcoded secrets and credentials..."
if command -v gitleaks &> /dev/null; then
    if gitleaks detect --source="$PROJECT_DIR" --no-git 2>&1 | grep -q "leaks found"; then
        log_critical "Hardcoded secrets found in codebase. Run 'gitleaks detect' for details."
    else
        log_pass "No hardcoded secrets detected"
    fi
else
    log_medium "gitleaks not installed. Install with: brew install gitleaks"
fi

# 1.2 Check for .env files in git
log_info "1.2 Checking for .env files in version control..."
if [ -f "$PROJECT_DIR/.gitignore" ]; then
    if grep -q "^\.env$" "$PROJECT_DIR/.gitignore"; then
        log_pass ".env files properly excluded from git"
    else
        log_high ".env not in .gitignore - secrets could be committed"
    fi
else
    log_high "No .gitignore file found"
fi

# 1.3 Check for HTTPS enforcement
log_info "1.3 Checking for HTTPS enforcement..."
if grep -r "http://" "$PROJECT_DIR/src" "$PROJECT_DIR/app" 2>/dev/null | grep -v "localhost" | grep -q "http://"; then
    log_high "Found HTTP URLs in code (should use HTTPS)"
else
    log_pass "No insecure HTTP URLs found (excluding localhost)"
fi

# 1.4 Check for SQL injection vulnerabilities
log_info "1.4 Scanning for SQL injection vulnerabilities..."
if grep -r "query.*\+.*req\." "$PROJECT_DIR/src" "$PROJECT_DIR/app" 2>/dev/null | grep -q "."; then
    log_critical "Potential SQL injection: string concatenation in SQL queries detected"
else
    log_pass "No obvious SQL injection patterns detected"
fi

# 1.5 Check for XSS vulnerabilities
log_info "1.5 Checking for XSS vulnerabilities..."
if grep -r "dangerouslySetInnerHTML" "$PROJECT_DIR/src" "$PROJECT_DIR/app" 2>/dev/null | grep -q "."; then
    log_high "Found dangerouslySetInnerHTML usage - verify all inputs are sanitized"
else
    log_pass "No dangerouslySetInnerHTML usage found"
fi

# 1.6 Check for authentication implementation
log_info "1.6 Verifying authentication implementation..."
if grep -r "bcrypt\|argon2\|scrypt" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Secure password hashing library detected"
else
    log_critical "No secure password hashing library found (bcrypt/argon2/scrypt)"
fi

# 1.7 Check for JWT security
log_info "1.7 Checking JWT implementation..."
if grep -r "jwt" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    if grep -r "RS256\|ES256" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
        log_pass "JWT using asymmetric algorithms (RS256/ES256)"
    else
        log_medium "JWT found but algorithm unclear - verify using RS256/ES256, not HS256"
    fi
fi

# 1.8 Check dependencies for known vulnerabilities
log_info "1.8 Scanning dependencies for known vulnerabilities..."
if [ -f "$PROJECT_DIR/package.json" ]; then
    cd "$PROJECT_DIR"
    if npm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
        log_pass "No high/critical vulnerabilities in npm dependencies"
    else
        log_critical "Vulnerabilities found in npm dependencies. Run 'npm audit' to review."
    fi
fi

# 1.9 Check for rate limiting
log_info "1.9 Checking for rate limiting on API endpoints..."
if grep -r "rate-limit\|rateLimit\|express-rate-limit" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Rate limiting implementation found"
else
    log_high "No rate limiting detected - APIs vulnerable to brute force"
fi

# 1.10 Check for CORS configuration
log_info "1.10 Checking CORS configuration..."
if grep -r "cors" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    if grep -r 'origin.*"\*"' "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
        log_high "CORS configured with wildcard (*) - overly permissive"
    else
        log_pass "CORS configuration found and appears restricted"
    fi
else
    log_medium "No CORS configuration found - verify if needed"
fi

################################################################################
# 2. PRIVACY AUDIT
################################################################################

log_section "2. PRIVACY AUDIT - Data Leakage, Tracking, Surveillance"

# 2.1 Check for analytics/tracking scripts
log_info "2.1 Scanning for third-party analytics and tracking..."
if grep -r "google-analytics\|gtag\|facebook.*pixel\|mixpanel\|segment" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_critical "Third-party analytics/tracking found - violates privacy-first principle"
else
    log_pass "No third-party analytics detected"
fi

# 2.2 Check for data sent to external services
log_info "2.2 Checking for data transmission to external services..."
if grep -r "fetch.*http\|axios.*http\|\.post.*http\|\.get.*http" "$PROJECT_DIR/src" 2>/dev/null | grep -v "localhost\|127.0.0.1" | grep -q "."; then
    log_medium "External API calls detected - verify all are necessary and privacy-preserving"
else
    log_pass "No external API calls detected"
fi

# 2.3 Check for localStorage/sessionStorage usage
log_info "2.3 Checking for browser storage usage..."
if grep -r "localStorage\|sessionStorage" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_medium "Browser storage usage detected - verify no sensitive data stored unencrypted"
else
    log_pass "No browser storage usage found"
fi

# 2.4 Check for encryption implementation
log_info "2.4 Verifying end-to-end encryption implementation..."
if grep -r "crypto\|encrypt\|CryptoJS\|sodium\|nacl" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Encryption library detected in codebase"
else
    log_critical "No encryption library found - data not encrypted at rest/in transit"
fi

# 2.5 Check for PII logging
log_info "2.5 Checking for PII in logs..."
if grep -r 'console\.log.*email\|console\.log.*ssn\|console\.log.*password' "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_high "Potential PII in console.log statements"
else
    log_pass "No obvious PII in log statements"
fi

# 2.6 Check for privacy policy
log_info "2.6 Verifying privacy policy exists..."
if [ -f "$PROJECT_DIR/PRIVACY.md" ] || [ -f "$PROJECT_DIR/docs/privacy.md" ]; then
    log_pass "Privacy policy document found"
else
    log_high "No privacy policy document found (required for GDPR/CCPA)"
fi

# 2.7 Check for data deletion capability
log_info "2.7 Checking for data deletion (right to be forgotten)..."
if grep -r "deleteUser\|removeData\|purgeAccount" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Data deletion functionality appears to exist"
else
    log_high "No data deletion functionality found (required for GDPR)"
fi

# 2.8 Check for consent management
log_info "2.8 Checking for consent management..."
if grep -r "consent\|optIn\|cookies.*accept" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Consent management implementation found"
else
    log_medium "No consent management found - verify if required"
fi

################################################################################
# 3. RESILIENCE AUDIT
################################################################################

log_section "3. RESILIENCE AUDIT - Single Points of Failure, Redundancy"

# 3.1 Check for single database dependency
log_info "3.1 Checking database architecture..."
if grep -r "mongodb\|mongoose\|postgres\|mysql" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_medium "Central database detected - consider local-first architecture"
else
    log_pass "No central database dependency detected"
fi

# 3.2 Check for peer-to-peer capabilities
log_info "3.2 Checking for peer-to-peer networking..."
if grep -r "webrtc\|peer\|p2p\|ipfs\|libp2p" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Peer-to-peer capabilities detected"
else
    log_high "No P2P implementation - system relies on central server"
fi

# 3.3 Check for offline capability
log_info "3.3 Checking for offline-first architecture..."
if grep -r "serviceWorker\|workbox\|offline\|cache.*api" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Offline capability detected (service worker/caching)"
else
    log_critical "No offline capability - system fails without internet"
fi

# 3.4 Check for error handling
log_info "3.4 Checking error handling implementation..."
if grep -r "try.*catch\|\.catch\(" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Error handling patterns detected"
else
    log_high "Insufficient error handling - system may crash on errors"
fi

# 3.5 Check for health checks
log_info "3.5 Checking for health check endpoints..."
if grep -r "/health\|/status\|/ping" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Health check endpoint found"
else
    log_medium "No health check endpoint - monitoring will be difficult"
fi

# 3.6 Check for backup/export functionality
log_info "3.6 Checking for data backup/export..."
if grep -r "export\|backup\|download.*data" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Data export functionality detected"
else
    log_critical "No data export - users can't take their data if leaving"
fi

# 3.7 Check for Missing Node Protocol
log_info "3.7 Verifying Missing Node Protocol implementation..."
if grep -r "MissingNode\|MemorialVertex\|K4.*K3" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Missing Node Protocol implementation detected"
else
    log_critical "Missing Node Protocol not found - no handling for vertex loss"
fi

# 3.8 Check for Fifth Element Protocol
log_info "3.8 Verifying Fifth Element (deadlock resolution)..."
if grep -r "FifthElement\|deadlock.*resolution\|2v2.*tie" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Fifth Element Protocol detected"
else
    log_high "Fifth Element Protocol not found - deadlocks unhandled"
fi

################################################################################
# 4. UX/ACCESSIBILITY AUDIT
################################################################################

log_section "4. UX/ACCESSIBILITY AUDIT - Can People Use This in Crisis?"

# 4.1 Check for accessibility attributes
log_info "4.1 Checking for ARIA attributes and semantic HTML..."
if grep -r "aria-label\|aria-describedby\|role=" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "ARIA attributes found - accessibility considered"
else
    log_high "No ARIA attributes - inaccessible to screen readers"
fi

# 4.2 Check for keyboard navigation
log_info "4.2 Checking for keyboard navigation support..."
if grep -r "onKeyDown\|onKeyPress\|tabIndex" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Keyboard event handlers found"
else
    log_medium "Limited keyboard navigation - may not be keyboard-accessible"
fi

# 4.3 Check for loading states
log_info "4.3 Checking for loading states..."
if grep -r "loading\|spinner\|skeleton" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Loading state indicators found"
else
    log_medium "No loading states - users won't know if system is working"
fi

# 4.4 Check for error messages
log_info "4.4 Checking for user-friendly error messages..."
if grep -r "error.*message\|toast\|alert\|notification" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Error messaging system detected"
else
    log_high "No error messaging - users won't know what went wrong"
fi

# 4.5 Check for mobile responsiveness
log_info "4.5 Checking for mobile responsiveness..."
if grep -r "@media\|responsive\|mobile-first" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Responsive design patterns detected"
else
    log_high "No responsive design - unusable on mobile devices"
fi

# 4.6 Check for emergency UI
log_info "4.6 Checking for emergency/crisis UI..."
if grep -r "emergency\|crisis\|panic.*button\|sos" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Emergency UI components found"
else
    log_critical "No emergency UI - people can't call for help in crisis"
fi

# 4.7 Check for high contrast mode
log_info "4.7 Checking for high contrast/dark mode..."
if grep -r "dark.*mode\|theme\|high.*contrast" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Theme switching capability detected"
else
    log_low "No dark mode - may strain eyes during extended use"
fi

################################################################################
# 5. PERFORMANCE AUDIT
################################################################################

log_section "5. PERFORMANCE AUDIT - Fast Enough for Emergency Response?"

# 5.1 Check for code splitting
log_info "5.1 Checking for code splitting..."
if grep -r "lazy\|Suspense\|dynamic.*import" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Code splitting detected (lazy loading)"
else
    log_medium "No code splitting - bundle may be too large"
fi

# 5.2 Check for image optimization
log_info "5.2 Checking for image optimization..."
if grep -r "next/image\|img.*loading.*lazy\|picture\|srcset" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Image optimization patterns found"
else
    log_low "No image optimization - may affect load times"
fi

# 5.3 Check for caching strategies
log_info "5.3 Checking for caching implementation..."
if grep -r "cache-control\|max-age\|etag\|Cache\(" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Caching strategies detected"
else
    log_medium "No caching detected - performance may be poor"
fi

# 5.4 Check for database query optimization
log_info "5.4 Checking for database query patterns..."
if grep -r "N\+1\|\.include\|\.populate\|\.join" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Query optimization patterns detected"
else
    log_medium "Verify queries are optimized (no N+1 problems)"
fi

# 5.5 Check bundle size
log_info "5.5 Analyzing bundle size..."
if [ -d "$PROJECT_DIR/.next" ] || [ -d "$PROJECT_DIR/dist" ] || [ -d "$PROJECT_DIR/build" ]; then
    BUNDLE_SIZE=$(du -sh "$PROJECT_DIR/.next" "$PROJECT_DIR/dist" "$PROJECT_DIR/build" 2>/dev/null | awk '{print $1}' | head -1)
    log_info "Bundle size: $BUNDLE_SIZE"
    # This is informational - manual review needed
else
    log_info "No build directory found - run production build to check size"
fi

################################################################################
# 6. LEGAL COMPLIANCE AUDIT
################################################################################

log_section "6. LEGAL COMPLIANCE AUDIT - HIPAA, COPPA, GDPR, etc."

# 6.1 Check for HIPAA compliance (if health data)
log_info "6.1 Checking HIPAA compliance indicators..."
if grep -r "health\|medical\|vitals\|medication" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_info "Health data detected - HIPAA compliance required"
    if grep -r "hipaa\|encryption.*phi\|audit.*log" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
        log_pass "HIPAA-related implementations found"
    else
        log_critical "Health data present but no HIPAA compliance measures detected"
    fi
fi

# 6.2 Check for COPPA compliance (if children's data)
log_info "6.2 Checking COPPA compliance for children's data..."
if grep -r "child\|kid\|minor\|age.*13" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_info "Children's data detected - COPPA compliance required"
    if grep -r "parental.*consent\|coppa" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
        log_pass "COPPA-related implementations found"
    else
        log_critical "Children's data present but no COPPA compliance measures"
    fi
fi

# 6.3 Check for GDPR compliance
log_info "6.3 Checking GDPR compliance indicators..."
if grep -r "gdpr\|right.*forgotten\|data.*portability" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "GDPR compliance features detected"
else
    log_high "No GDPR compliance features - required for EU users"
fi

# 6.4 Check for Terms of Service
log_info "6.4 Checking for Terms of Service..."
if [ -f "$PROJECT_DIR/TERMS.md" ] || [ -f "$PROJECT_DIR/docs/terms.md" ]; then
    log_pass "Terms of Service document found"
else
    log_high "No Terms of Service - legally required"
fi

# 6.5 Check for age verification
log_info "6.5 Checking for age verification..."
if grep -r "age.*verification\|birthdate\|date.*of.*birth" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Age verification detected"
else
    log_medium "No age verification - may be required depending on jurisdiction"
fi

################################################################################
# 7. ETHICAL SAFEGUARDS AUDIT
################################################################################

log_section "7. ETHICAL SAFEGUARDS AUDIT - Abuse Prevention, Exit Pathways"

# 7.1 Check for abuse reporting
log_info "7.1 Checking for abuse reporting mechanisms..."
if grep -r "report.*abuse\|flag.*content\|moderation" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Abuse reporting system detected"
else
    log_critical "No abuse reporting - users can't report harmful behavior"
fi

# 7.2 Check for exit pathways
log_info "7.2 Checking for easy exit mechanisms..."
if grep -r "leave.*tetrahedron\|exit\|delete.*account\|close.*account" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Exit pathways detected"
else
    log_critical "No exit mechanism - users may be trapped"
fi

# 7.3 Check for coercion detection
log_info "7.3 Checking for coercion/control detection..."
if grep -r "guardian.*node\|abuse.*detection\|isolation.*pattern" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Guardian Node or abuse detection found"
else
    log_high "No coercion detection - abusive dynamics may go unnoticed"
fi

# 7.4 Check for external contact requirements
log_info "7.4 Checking for external contact requirements..."
if grep -r "external.*contact\|outside.*tetrahedron\|diversity.*check" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "External contact requirements detected"
else
    log_medium "No external contact requirements - groups may become insular"
fi

# 7.5 Check for financial transparency
log_info "7.5 Checking for financial transparency..."
if grep -r "financial.*transparency\|transaction.*log\|blockchain\|audit.*trail" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Financial transparency measures found"
else
    log_high "No financial transparency - exploitation risk"
fi

# 7.6 Check for child protection measures
log_info "7.6 Checking for child protection..."
if grep -r "child.*protection\|mandatory.*reporter\|safeguarding" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Child protection measures detected"
else
    log_critical "No child protection measures - children at risk"
fi

# 7.7 Check for diversity requirements
log_info "7.7 Checking for diversity/anti-echo-chamber measures..."
if grep -r "diversity\|diverse.*matching\|different.*views" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Diversity measures detected"
else
    log_medium "No diversity requirements - echo chambers may form"
fi

################################################################################
# 8. DEPLOYMENT & INFRASTRUCTURE AUDIT
################################################################################

log_section "8. DEPLOYMENT & INFRASTRUCTURE AUDIT"

# 8.1 Check for environment variables
log_info "8.1 Checking environment variable usage..."
if grep -r "process\.env\|import\.meta\.env" "$PROJECT_DIR/src" 2>/dev/null | grep -q "."; then
    log_pass "Environment variables used for configuration"
else
    log_medium "No environment variables - configuration may be hardcoded"
fi

# 8.2 Check for Docker configuration
log_info "8.2 Checking for containerization..."
if [ -f "$PROJECT_DIR/Dockerfile" ]; then
    log_pass "Dockerfile found - containerization implemented"
else
    log_low "No Dockerfile - consider containerization for consistency"
fi

# 8.3 Check for CI/CD
log_info "8.3 Checking for CI/CD configuration..."
if [ -f "$PROJECT_DIR/.github/workflows"/*.yml ] 2>/dev/null || [ -f "$PROJECT_DIR/.gitlab-ci.yml" ]; then
    log_pass "CI/CD configuration detected"
else
    log_low "No CI/CD - manual deployment increases error risk"
fi

# 8.4 Check for monitoring/logging
log_info "8.4 Checking for monitoring setup..."
if grep -r "sentry\|logging\|winston\|pino\|monitoring" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "Logging/monitoring infrastructure detected"
else
    log_medium "No monitoring - won't know when things break"
fi

# 8.5 Check for database migrations
log_info "8.5 Checking for database migration system..."
if [ -d "$PROJECT_DIR/migrations" ] || [ -d "$PROJECT_DIR/prisma/migrations" ]; then
    log_pass "Database migration system found"
else
    log_medium "No migration system - database changes may be error-prone"
fi

################################################################################
# 9. DOCUMENTATION AUDIT
################################################################################

log_section "9. DOCUMENTATION AUDIT"

# 9.1 Check for README
log_info "9.1 Checking for README..."
if [ -f "$PROJECT_DIR/README.md" ]; then
    log_pass "README.md found"
else
    log_high "No README - users won't know how to set up or use"
fi

# 9.2 Check for API documentation
log_info "9.2 Checking for API documentation..."
if [ -f "$PROJECT_DIR/API.md" ] || grep -r "swagger\|openapi" "$PROJECT_DIR" 2>/dev/null | grep -q "."; then
    log_pass "API documentation detected"
else
    log_medium "No API documentation - integration will be difficult"
fi

# 9.3 Check for security documentation
log_info "9.3 Checking for security documentation..."
if [ -f "$PROJECT_DIR/SECURITY.md" ]; then
    log_pass "SECURITY.md found"
else
    log_medium "No security documentation - users don't know how to report issues"
fi

# 9.4 Check for contributing guidelines
log_info "9.4 Checking for contribution guidelines..."
if [ -f "$PROJECT_DIR/CONTRIBUTING.md" ]; then
    log_pass "CONTRIBUTING.md found"
else
    log_low "No contributing guidelines - community contributions may be inconsistent"
fi

# 9.5 Check for code comments
log_info "9.5 Checking code comment density..."
TOTAL_LINES=$(find "$PROJECT_DIR/src" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
COMMENT_LINES=$(find "$PROJECT_DIR/src" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -h "^\s*\/\/" 2>/dev/null | wc -l)
if [ "$TOTAL_LINES" -gt 0 ]; then
    COMMENT_RATIO=$((COMMENT_LINES * 100 / TOTAL_LINES))
    if [ "$COMMENT_RATIO" -gt 10 ]; then
        log_pass "Code comment ratio: ${COMMENT_RATIO}% (good)"
    else
        log_medium "Code comment ratio: ${COMMENT_RATIO}% (consider adding more)"
    fi
else
    log_info "No source files found to analyze"
fi

################################################################################
# GENERATE SUMMARY
################################################################################

log_section "AUDIT SUMMARY"

TOTAL_ISSUES=$((CRITICAL + HIGH + MEDIUM + LOW))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FINAL RESULTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${RED}🔴 CRITICAL issues: $CRITICAL${NC}"
echo -e "${RED}🟠 HIGH issues:     $HIGH${NC}"
echo -e "${YELLOW}🟡 MEDIUM issues:   $MEDIUM${NC}"
echo -e "${YELLOW}🟢 LOW issues:      $LOW${NC}"
echo -e "${GREEN}✅ PASSED checks:   $PASSED${NC}"
echo ""
echo "Total issues found: $TOTAL_ISSUES"
echo "Total checks passed: $PASSED"
echo ""

cat >> "$REPORT_FILE" << EOF

---

## Summary

- 🔴 **CRITICAL issues:** $CRITICAL
- 🟠 **HIGH issues:** $HIGH
- 🟡 **MEDIUM issues:** $MEDIUM
- 🟢 **LOW issues:** $LOW
- ✅ **PASSED checks:** $PASSED

**Total issues:** $TOTAL_ISSUES  
**Total passed:** $PASSED

---

## Go/No-Go Decision

EOF

# Determine if system is ready
if [ "$CRITICAL" -eq 0 ] && [ "$HIGH" -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ GO: The delta is ready. Star connection can be dropped.${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "**✅ GO:** The delta is ready. Star connection can be dropped." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "The mesh infrastructure has passed critical checks and is ready to hold people when centralized systems fail." >> "$REPORT_FILE"
elif [ "$CRITICAL" -eq 0 ] && [ "$HIGH" -le 3 ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠ CONDITIONAL GO: Address HIGH issues before full release${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "**⚠️ CONDITIONAL GO:** Address HIGH issues before full public release." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "No critical issues, but $HIGH high-priority issues should be addressed." >> "$REPORT_FILE"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}✗ NO-GO: Critical issues must be fixed before release${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "**🛑 NO-GO:** Critical issues must be fixed before release." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "The mesh is not ready. Found $CRITICAL critical and $HIGH high-priority issues that must be addressed." >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**DO NOT release to production. People's safety depends on this working correctly.**" >> "$REPORT_FILE"
fi

echo ""
echo "Full report saved to: $REPORT_FILE"
echo ""

# Set exit code based on critical issues
if [ "$CRITICAL" -gt 0 ]; then
    exit 1
else
    exit 0
fi
