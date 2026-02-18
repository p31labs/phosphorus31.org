#!/usr/bin/env bash
# Deploy P31 Geodesic Platform (Colyseus + API + optional WASM)

set -e
echo "🚀 Deploying P31 Quantum Geodesic Platform"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [ -d "geodesic-engine" ]; then
  echo "Building Rust WASM..."
  cd geodesic-engine
  wasm-pack build --target web --out-dir ../ui/src/wasm 2>/dev/null || true
  wasm-pack build --target nodejs --out-dir ../geodesic-platform/server/wasm 2>/dev/null || true
  cd "$ROOT"
fi

echo "Building platform..."
cd geodesic-platform
npm ci
npm run build

echo "Starting with Docker Compose..."
docker compose build
docker compose up -d

echo "Running migrations..."
docker compose exec platform npm run migrate 2>/dev/null || true

echo "✅ Deployment complete."
echo "🌍 API: http://localhost:3001"
echo "🎮 Colyseus: ws://localhost:2567"
echo "🖥️  UI: set VITE_COLYSEUS_URL=ws://localhost:2567 and run from ui/"
