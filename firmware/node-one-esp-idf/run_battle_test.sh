#!/bin/bash

# ============================================================================
# BATTLE TEST RUNNER
# Execute comprehensive test suite for pre-abdication verification
# ============================================================================

set -e

echo "🧪 LORA RADIO BATTLE TEST SUITE"
echo "   Pre-Abdication Verification"
echo ""

# Check if we're in the right directory
if [ ! -f "CMakeLists.txt" ]; then
    echo "❌ Error: Must run from firmware/node-one-esp-idf directory"
    exit 1
fi

# Check if test file exists
if [ ! -f "test/lora_radio_test.c" ]; then
    echo "⚠️  Warning: test/lora_radio_test.c not found"
    echo "   Creating test file..."
    # Test file should be created separately
fi

echo "📋 Pre-Test Checklist:"
echo "   [ ] Hardware connected (E22-900M30S module)"
echo "   [ ] Power supply adequate (5V for full power)"
echo "   [ ] Serial monitor ready"
echo "   [ ] Test environment prepared"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "🔨 Building test firmware..."
idf.py build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📤 Flashing firmware..."
idf.py flash

if [ $? -ne 0 ]; then
    echo "❌ Flash failed!"
    exit 1
fi

echo ""
echo "📊 Starting test monitor..."
echo "   Tests will run automatically"
echo "   Monitor output for test results"
echo "   Press Ctrl+] to exit monitor"
echo ""

idf.py monitor

echo ""
echo "✅ Battle test complete!"
echo "   Review test results above"
echo "   Check BATTLE_TEST_RESULTS.md for summary"
