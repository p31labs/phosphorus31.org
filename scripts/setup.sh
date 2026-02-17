#!/bin/bash
# P31 Setup Script
# Complete setup for P31 development environment

set -e

echo "🔺 P31 Setup"
echo "Phosphorus-31. The biological qubit. The atom in the bone."
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install The Centaur dependencies
echo "🦄 Installing The Centaur dependencies..."
cd SUPER-CENTAUR
npm install
cd ..

# Install The Scope dependencies
echo "📡 Installing The Scope dependencies..."
cd ui
npm install
cd ..

# Install The Buffer dependencies
echo "🛡️ Installing The Buffer dependencies..."
cd cognitive-shield
npm install
cd ..

echo ""
echo "✅ P31 Setup Complete"
echo ""
echo "Next steps:"
echo "  1. Configure environment variables (see config/env-reference.md)"
echo "  2. Run 'npm run dev' to start development servers"
echo "  3. See docs/setup.md for detailed setup instructions"
echo ""
