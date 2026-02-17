#!/bin/bash
# P31 Development Script
# Starts all P31 components in development mode

set -e

echo "🔺 Starting P31 Development Environment"
echo "Phosphorus-31. The biological qubit. The atom in the bone."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Start The Centaur
echo "🦄 Starting The Centaur (backend)..."
cd SUPER-CENTAUR
npm run dev &
CENTAUR_PID=$!
cd ..

# Wait a bit for The Centaur to start
sleep 3

# Start The Scope
echo "📡 Starting The Scope (frontend)..."
cd ui
npm run dev &
SCOPE_PID=$!
cd ..

# Start The Buffer (optional)
if [ "$1" == "--with-buffer" ]; then
    echo "🛡️ Starting The Buffer..."
    cd cognitive-shield
    npm run dev &
    BUFFER_PID=$!
    cd ..
fi

echo ""
echo "✅ P31 Development Environment Started"
echo ""
echo "📍 The Centaur: http://localhost:3000"
echo "📍 The Scope: http://localhost:5173"
if [ "$1" == "--with-buffer" ]; then
    echo "📍 The Buffer: http://localhost:4000"
fi
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping P31 services...'; kill $CENTAUR_PID $SCOPE_PID ${BUFFER_PID:-} 2>/dev/null; exit" INT TERM

wait
