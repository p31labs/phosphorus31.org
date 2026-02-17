#!/bin/bash
# Run All Tests Script
# Runs all tests with coverage and generates report

echo "🧪 Running all game engine tests..."
echo ""

# Run tests with coverage
npm test -- --coverage --verbose

echo ""
echo "✅ All tests complete!"
echo "📊 Coverage report generated in coverage/"
