#!/bin/bash
# P31 Build Script
# Builds all P31 components for production

set -e

echo "🔺 Building P31 for Production"
echo "Phosphorus-31. The biological qubit. The atom in the bone."
echo ""

# Build The Centaur
echo "🦄 Building The Centaur..."
cd SUPER-CENTAUR
npm run build
cd ..

# Build The Scope
echo "📡 Building The Scope..."
cd ui
npm run build
cd ..

# Build The Buffer
echo "🛡️ Building The Buffer..."
cd cognitive-shield
npm run build
cd ..

echo ""
echo "✅ P31 Build Complete"
echo ""
echo "Build outputs:"
echo "  - The Centaur: SUPER-CENTAUR/dist/"
echo "  - The Scope: ui/dist/"
echo "  - The Buffer: cognitive-shield/dist/"
