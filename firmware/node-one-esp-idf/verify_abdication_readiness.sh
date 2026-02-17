#!/bin/bash

# ============================================================================
# ABDICATION READINESS VERIFICATION
# G.O.D. Protocol Compliance Check
# ============================================================================

set -e

echo "🔍 VERIFYING ABDICATION READINESS..."
echo "   Target: 9:00 AM Abdication"
echo ""

ERRORS=0
WARNINGS=0

# ============================================================================
# 1. CHECK FOR BACKDOORS
# ============================================================================

echo "1️⃣  Checking for admin backdoors..."

# Check for common backdoor patterns
if grep -r "super.*admin\|admin.*recovery\|backdoor\|bypass.*auth" components/ --include="*.c" --include="*.cpp" --include="*.h" 2>/dev/null | grep -v "//.*no.*backdoor" | grep -v "//.*abdication"; then
    echo "   ❌ POTENTIAL BACKDOOR DETECTED"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ No backdoors detected"
fi

# Check for hardcoded credentials
if grep -r "password.*=.*[\"'].*[\"']\|secret.*=.*[\"'].*[\"']\|key.*=.*[\"'].*[\"']" components/ --include="*.c" --include="*.cpp" --include="*.h" 2>/dev/null | grep -v "//.*example\|//.*TODO"; then
    echo "   ⚠️  POTENTIAL HARDCODED CREDENTIALS"
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ No hardcoded credentials detected"
fi

# ============================================================================
# 2. VERIFY LORA RADIO COMPONENT
# ============================================================================

echo ""
echo "2️⃣  Verifying LoRa Radio Component..."

LORA_FILE="components/lora_radio/lora_radio.cpp"
if [ -f "$LORA_FILE" ]; then
    # Check for admin functions
    if grep -q "admin\|recovery\|backdoor\|bypass" "$LORA_FILE" -i; then
        echo "   ⚠️  Potential admin functions in LoRa driver"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "   ✅ LoRa driver clean (no admin functions)"
    fi
    
    # Verify initialization required
    if grep -q "initialized.*==.*false\|!initialized" "$LORA_FILE"; then
        echo "   ✅ Proper initialization checks in place"
    else
        echo "   ⚠️  Missing initialization checks"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ⚠️  LoRa component not found"
    WARNINGS=$((WARNINGS + 1))
fi

# ============================================================================
# 3. VERIFY COMPONENT STRUCTURE
# ============================================================================

echo ""
echo "3️⃣  Verifying component structure..."

REQUIRED_COMPONENTS=("lora_radio" "shield_server")
for component in "${REQUIRED_COMPONENTS[@]}"; do
    if [ -d "components/$component" ]; then
        echo "   ✅ $component component exists"
        
        # Check for CMakeLists.txt
        if [ -f "components/$component/CMakeLists.txt" ]; then
            echo "      ✅ CMakeLists.txt present"
        else
            echo "      ⚠️  Missing CMakeLists.txt"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo "   ⚠️  $component component missing"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# ============================================================================
# 4. VERIFY ABDICATION SCRIPT
# ============================================================================

echo ""
echo "4️⃣  Verifying abdication script..."

if [ -f "../abdicate.sh" ]; then
    echo "   ✅ abdicate.sh found"
    
    # Check for key destruction
    if grep -q "shred\|destroy\|delete.*key" ../abdicate.sh; then
        echo "      ✅ Key destruction protocol present"
    else
        echo "      ⚠️  Key destruction not found"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check for access revocation
    if grep -q "NOLOGIN\|revoke\|ALTER ROLE" ../abdicate.sh; then
        echo "      ✅ Access revocation present"
    else
        echo "      ⚠️  Access revocation not found"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ❌ abdicate.sh not found"
    ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# 5. SUMMARY
# ============================================================================

echo ""
echo "==================================================="
echo "📊 VERIFICATION SUMMARY"
echo "==================================================="
echo "   Errors:   $ERRORS"
echo "   Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ SYSTEM READY FOR ABDICATION"
    echo "   All checks passed. Safe to proceed at 9:00 AM."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  SYSTEM READY WITH WARNINGS"
    echo "   Review warnings above before abdication."
    exit 0
else
    echo "❌ SYSTEM NOT READY"
    echo "   Fix errors above before abdication."
    exit 1
fi
