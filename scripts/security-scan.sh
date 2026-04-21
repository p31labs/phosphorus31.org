#!/bin/bash
# Comprehensive Security Scanner for P31 Monorepo
# Vulnerability scanning, PII detection, compliance checks

set -e

echo "🔒 P31 Security Scanner"
echo "======================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# Configuration
SECURITY_LOG="/tmp/p31-security-scan.log"
VULN_THRESHOLD="moderate"
MAX_PII_FILES=10

# Initialize log
echo "Security Scan Started: $(date)" > "$SECURITY_LOG"
echo "=================================" >> "$SECURITY_LOG"

# Function to log results
log_result() {
    local check="$1"
    local status="$2"
    local details="$3"

    echo "$check|$status|$details" >> "$SECURITY_LOG"

    case "$status" in
        "PASS")
            echo -e "  ${GREEN}✓${NC} $check"
            ;;
        "FAIL")
            echo -e "  ${RED}✗${NC} $check"
            echo -e "    ${RED}$details${NC}"
            ;;
        "WARN")
            echo -e "  ${YELLOW}⚠${NC} $check"
            echo -e "    ${YELLOW}$details${NC}"
            ;;
        "INFO")
            echo -e "  ${BLUE}ℹ${NC} $check"
            ;;
    esac
}

# 1. Dependency Vulnerability Scan
scan_dependencies() {
    echo -e "\n${BOLD}🔍 Dependency Vulnerability Scan${NC}"

    local workspaces=("ui" "SUPER-CENTAUR" "apps/shelter" ".")
    local total_vulns=0

    for workspace in "${workspaces[@]}"; do
        if [ -d "$workspace" ] && [ -f "$workspace/package.json" ]; then
            cd "$workspace"

            if command -v npm &> /dev/null; then
                echo "Scanning $workspace..."

                # Run npm audit
                if npm audit --audit-level="$VULN_THRESHOLD" > /tmp/audit.txt 2>&1; then
                    vuln_count=$(grep -c "vulnerability found" /tmp/audit.txt || echo "0")
                    if [ "$vuln_count" -gt 0 ]; then
                        log_result "$workspace dependencies" "FAIL" "$vuln_count vulnerabilities found"
                        ((total_vulns += vuln_count))
                    else
                        log_result "$workspace dependencies" "PASS" "No vulnerabilities found"
                    fi
                else
                    log_result "$workspace audit" "WARN" "npm audit failed to run"
                fi
            fi

            cd - > /dev/null
        fi
    done

    if [ $total_vulns -gt 0 ]; then
        log_result "Overall dependencies" "FAIL" "$total_vulns total vulnerabilities across workspaces"
    else
        log_result "Overall dependencies" "PASS" "All workspaces clean"
    fi
}

# 2. Secrets and Credentials Detection
scan_secrets() {
    echo -e "\n${BOLD}🔐 Secrets and Credentials Scan${NC}"

    local secret_patterns=(
        "password\s*=\s*['\"][^'\"]*['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]*['\"]"
        "secret\s*=\s*['\"][^'\"]*['\"]"
        "token\s*=\s*['\"][^'\"]*['\"]"
        "private[_-]?key"
        "\b[A-Za-z0-9+/]{40,}\b"  # Base64-like strings (potential tokens)
    )

    local secret_files=0

    while IFS= read -r -d '' file; do
        local has_secrets=false
        local file_secrets=""

        for pattern in "${secret_patterns[@]}"; do
            if grep -n "$pattern" "$file" > /dev/null 2>&1; then
                has_secrets=true
                file_secrets="$file_secrets$(grep -n "$pattern" "$file" | head -3 | sed 's/^/    /')\n"
            fi
        done

        if [ "$has_secrets" = true ]; then
            ((secret_files++))
            log_result "Secrets in $file" "FAIL" "Potential secrets found"
            echo -e "$file_secrets" | head -10

            if [ $secret_files -ge $MAX_PII_FILES ]; then
                log_result "Secrets scan" "WARN" "Too many files with potential secrets, stopped at $MAX_PII_FILES"
                break
            fi
        fi
    done < <(find . -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.env*" -o -name "*.config.*" \
             -not -path "./node_modules/*" -not -path "./.git/*" -print0 2>/dev/null)

    if [ $secret_files -eq 0 ]; then
        log_result "Secrets scan" "PASS" "No hardcoded secrets detected"
    fi
}

# 3. PII Detection
scan_pii() {
    echo -e "\n${BOLD}👤 PII Detection Scan${NC}"

    local pii_patterns=(
        "\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b"  # SSN
        "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"  # Email
        "\b\d{3}-\d{3}-\d{4}\b"  # Phone
        "\b\d{5}(-\d{4})?\b"  # ZIP
    )

    local pii_files=0

    while IFS= read -r -d '' file; do
        local has_pii=false
        local file_pii=""

        for pattern in "${pii_patterns[@]}"; do
            if grep -n "$pattern" "$file" > /dev/null 2>&1; then
                has_pii=true
                file_pii="$file_pii$(grep -n "$pattern" "$file" | head -3 | sed 's/^/    /')\n"
            fi
        done

        if [ "$has_pii" = true ]; then
            ((pii_files++))
            log_result "PII in $file" "FAIL" "Potential PII data found"
            echo -e "$file_pii" | head -10

            if [ $pii_files -ge $MAX_PII_FILES ]; then
                log_result "PII scan" "WARN" "Too many files with potential PII, stopped at $MAX_PII_FILES"
                break
            fi
        fi
    done < <(find . -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.txt" -o -name "*.md" \
             -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./CHANGELOG*" -print0 2>/dev/null)

    if [ $pii_files -eq 0 ]; then
        log_result "PII scan" "PASS" "No PII detected in code/files"
    fi
}

# 4. File Permissions Check
check_permissions() {
    echo -e "\n${BOLD}🔑 File Permissions Check${NC}"

    local bad_perms=0

    while IFS= read -r file; do
        local perms=$(stat -c "%a" "$file" 2>/dev/null || echo "000")
        local owner_readable=$((perms / 100 % 10 >= 4 ? 1 : 0))
        local group_readable=$((perms / 10 % 10 >= 4 ? 1 : 0))
        local other_readable=$((perms % 10 >= 4 ? 1 : 0))

        # Flag files readable by group or others
        if [ $group_readable -eq 1 ] || [ $other_readable -eq 1 ]; then
            ((bad_perms++))
            log_result "Permissions on $file" "WARN" "Readable by group/others (perms: $perms)"
        fi
    done < <(find . -name "*.key" -o -name "*.pem" -o -name "*secret*" -o -name "*.env*" \
             -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null)

    if [ $bad_perms -eq 0 ]; then
        log_result "File permissions" "PASS" "No overly permissive secret files"
    fi
}

# 5. Security Headers Check (for deployed services)
check_security_headers() {
    echo -e "\n${BOLD}🛡️ Security Headers Check${NC}"

    local services=(
        "https://p31-mesh.pages.dev:P31 Mesh (Frontend)"
        "https://p31-agent-hub.trimtab-signal.workers.dev:P31 Agent Hub"
        "https://k4-cage.trimtab-signal.workers.dev:K4 Cage"
    )

    for service_info in "${services[@]}"; do
        IFS=':' read -r url name <<< "$service_info"

        if curl -s -I "$url" > /tmp/headers.txt 2>/dev/null; then
            local has_csp=$(grep -i "content-security-policy" /tmp/headers.txt || echo "")
            local has_hsts=$(grep -i "strict-transport-security" /tmp/headers.txt || echo "")
            local has_xfo=$(grep -i "x-frame-options" /tmp/headers.txt || echo "")

            if [ -n "$has_csp" ] && [ -n "$has_hsts" ] && [ -n "$has_xfo" ]; then
                log_result "$name security headers" "PASS" "CSP, HSTS, XFO present"
            else
                local missing=""
                [ -z "$has_csp" ] && missing="$missing CSP"
                [ -z "$has_hsts" ] && missing="$missing HSTS"
                [ -z "$has_xfo" ] && missing="$missing XFO"
                log_result "$name security headers" "WARN" "Missing: $missing"
            fi
        else
            log_result "$name headers check" "INFO" "Service unreachable"
        fi
    done
}

# 6. SSL/TLS Certificate Check
check_ssl() {
    echo -e "\n${BOLD}🔐 SSL/TLS Certificate Check${NC}"

    local domains=(
        "p31-mesh.pages.dev:P31 Mesh"
        "trimtab-signal.workers.dev:P31 Services"
    )

    for domain_info in "${domains[@]}"; do
        IFS=':' read -r domain name <<< "$domain_info"

        if command -v openssl &> /dev/null; then
            if echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
                local expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
                local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || echo "0")
                local now_epoch=$(date +%s)
                local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))

                if [ $days_left -gt 30 ]; then
                    log_result "$name SSL cert" "PASS" "Expires in $days_left days"
                elif [ $days_left -gt 7 ]; then
                    log_result "$name SSL cert" "WARN" "Expires in $days_left days"
                else
                    log_result "$name SSL cert" "FAIL" "Expires in $days_left days"
                fi
            else
                log_result "$name SSL cert" "FAIL" "No valid certificate"
            fi
        else
            log_result "$name SSL cert" "INFO" "openssl not available"
        fi
    done
}

# 7. Generate Security Report
generate_report() {
    echo -e "\n${BOLD}📋 Security Scan Summary${NC}"
    echo "=========================="

    local total_checks=$(grep -c "|" "$SECURITY_LOG")
    local passed=$(grep -c "|PASS|" "$SECURITY_LOG")
    local failed=$(grep -c "|FAIL|" "$SECURITY_LOG")
    local warned=$(grep -c "|WARN|" "$SECURITY_LOG")

    echo "Total checks: $total_checks"
    echo -e "Passed: ${GREEN}$passed${NC}"
    echo -e "Failed: ${RED}$failed${NC}"
    echo -e "Warnings: ${YELLOW}$warned${NC}"

    if [ $failed -gt 0 ]; then
        echo -e "\n${RED}${BOLD}❌ Critical Issues Found${NC}"
        grep "|FAIL|" "$SECURITY_LOG" | cut -d'|' -f1,3 | sed 's/|/: /'
    fi

    if [ $warned -gt 0 ]; then
        echo -e "\n${YELLOW}${BOLD}⚠️ Warnings${NC}"
        grep "|WARN|" "$SECURITY_LOG" | cut -d'|' -f1,3 | sed 's/|/: /'
    fi

    echo -e "\n${BLUE}Detailed log: $SECURITY_LOG${NC}"

    # Overall assessment
    if [ $failed -eq 0 ] && [ $warned -le 2 ]; then
        echo -e "\n${GREEN}${BOLD}✓ Security posture is good${NC}"
    elif [ $failed -eq 0 ]; then
        echo -e "\n${YELLOW}${BOLD}⚠️ Security posture needs attention${NC}"
    else
        echo -e "\n${RED}${BOLD}❌ Security issues require immediate action${NC}"
    fi
}

# Main execution
main() {
    local quick=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --quick)
                quick=true
                shift
                ;;
            --help)
                echo "Usage: $0 [--quick]"
                echo ""
                echo "Options:"
                echo "  --quick    Run only critical checks (deps, secrets, PII)"
                echo ""
                echo "Full scan includes: dependencies, secrets, PII, permissions, headers, SSL"
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                exit 1
                ;;
        esac
    done

    echo "Security scan configuration:"
    echo "  Quick mode: $quick"
    echo ""

    # Run all checks
    scan_dependencies
    scan_secrets
    scan_pii

    if [ "$quick" = false ]; then
        check_permissions
        check_security_headers
        check_ssl
    fi

    generate_report

    echo ""
    echo -e "${BLUE}Security scan complete. Review $SECURITY_LOG for details.${NC}"
}

# Run main
main "$@"