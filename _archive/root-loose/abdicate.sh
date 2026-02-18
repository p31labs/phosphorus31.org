#!/bin/bash

# --- THE GENESIS GATE: ABDICATION PROTOCOL ---
# Target Date: February 14, 2026
# Function: Severs the link between Creator and Citadel.

set -e

echo "🕊️  INITIATING GENESIS GATE PROTOCOL..."
echo "    System Status: TRANSITIONING TO HEADLESS MODE"

# 1. Forensic Snapshot
echo "📸 Creating final authenticated state snapshot..."
docker exec phenix_love_ledger pg_dump -U $DB_USER love_ledger > ./backups/final_sovereign_state.sql

# 2. Revoke Admin Access
echo "🔐 Revoking Administrative Credentials..."
# This command modifies the PG role to remove LOGIN permissions for the human admin
docker exec phenix_love_ledger psql -U $DB_USER -d love_ledger -c "ALTER ROLE $DB_USER NOLOGIN;"

# 3. Key Destruction (The "Digital Death")
echo "🧪 Shredding Master Encryption Keys..."
if [ -f ./secrets/master_key.bin ]; then
    # Use 7 passes of random data to ensure no forensic recovery is possible
    shred -n 7 -z -u ./secrets/master_key.bin
    echo "   - Master Key: DESTROYED"
fi

# 4. Burn the Bridge
echo "🔥 Sealing the .env manifest..."
shred -n 3 -z -u .env.prod
echo "   - Environment Secrets: DESTROYED"

# 5. Headless Activation
echo "🤖 Restarting Cortex in Autonomous Mode..."
docker-compose restart cortex_api worker

echo "==================================================="
echo "✅ ABDICATION COMPLETE."
echo "   The Phenix Citadel is now Headless."
echo "   Actual Authority has been transferred to the Math."
echo "==================================================="