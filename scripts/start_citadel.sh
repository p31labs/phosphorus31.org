#!/bin/bash
set -e

# PHENIX CITADEL - MASTER LAUNCH SEQUENCE
# Phase 5: Production Deployment

echo "🦅 Phenix Citadel: Initializing Launch Sequence..."

# 1. Environment Check
if [ ! -f .env ]; then
    echo "❌ Error: .env file missing. Please configure from .env.example."
    exit 1
fi

source .env

echo "   > Environment: $PHENIX_MODE"
if [ "$CRYSTAL_BYPASS" == "TRUE" ]; then
    echo "   > Hardware: BBO Crystal Bypass ACTIVE (Software Entropy Only)"
fi

# 2. Structure Verification
REQUIRED_DIRS=("data/postgres" "data/redis" "data/prometheus" "data/grafana" "logs" "signals")

echo "   > Verifying directory structure..."
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "     + Created $dir"
    fi
done

# 3. Permissions Lockdown
echo "   > Securing volumes..."
chmod 700 data/postgres
chmod 700 signals
chmod 644 monitoring/prometheus_config.yml 2>/dev/null || true

# 4. Network Initialization
echo "   > Establishing Zero-Trust Network..."
docker network inspect phenix-net >/dev/null 2>&1 || \
    docker network create --driver bridge --subnet 172.20.0.0/16 phenix-net

# 5. Container Orchestration
echo "   > Igniting Containers..."
docker compose up -d --build --remove-orphans

# 6. Wait for Health
echo "   > Waiting for system stabilization (15s)..."
sleep 15

# 7. Final Status
ACTIVE_CONTAINERS=$(docker ps --format '{{.Names}}' | grep phenix | wc -l)
echo "---------------------------------------------------"
echo "✅ LAUNCH COMPLETE"
echo "   > Active Nodes: $ACTIVE_CONTAINERS"
echo "   > Gateway:      https://localhost"
echo "   > Monitoring:   https://localhost:3000"
echo "---------------------------------------------------"
echo "🦅 THE CITADEL IS AWAKE."