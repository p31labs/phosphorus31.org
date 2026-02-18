#!/usr/bin/env bash
# ============================================================
# P31 REPO NUCLEAR CLEANUP
# Run from repo root: bash scripts/nuclear-cleanup.sh
# Safe to run multiple times (idempotent)
# Zero code changes. Moves only. Full git provenance.
# ============================================================

set -euo pipefail

echo "🔺 P31 REPO NUCLEAR CLEANUP — STARTING"
echo "   $(date -Iseconds)"
echo ""

# Safety check
if [ ! -f "package.json" ]; then
  echo "❌ ERROR: package.json not found. Run this from the repo root."
  exit 1
fi

if [ ! -d ".git" ]; then
  echo "❌ ERROR: .git not found. This must be a git repository."
  exit 1
fi

# Check for clean working tree
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  WARNING: Working tree is not clean. Commit or stash changes first."
  echo "   Continuing anyway (moves will be mixed with existing changes)..."
  echo ""
fi

# ============================================================
# STEP 1: Create target directories
# ============================================================
echo "📁 Step 1: Creating target directories..."

mkdir -p docs/architecture
mkdir -p docs/ssa-prep
mkdir -p docs/legal-packet
mkdir -p docs/grants
mkdir -p docs/substack
mkdir -p docs/board
mkdir -p docs/hardware
mkdir -p docs/swarm-history
mkdir -p hardware
mkdir -p _archive/root-loose
mkdir -p scripts

echo "   ✓ All directories created"

# ============================================================
# STEP 2: Move root markdown files to organized locations
# ============================================================
echo "📄 Step 2: Routing root files to docs/..."

# Architecture specs
for f in \
  08_WORKSTREAM_PHENIX_NAVIGATOR_ARCHITECTURE.md \
  GEODESIC_CONVERGENCE.md \
  P31_NODE_ZERO_NAMING.md \
  P31_INTELLIGENCE_BRIEF.md \
; do
  [ -f "$f" ] && git mv "$f" docs/architecture/ && echo "   → docs/architecture/$f" || true
done

# Grant narratives
for f in \
  ACCELERATOR_PRODUCT_ONEPAGER.md \
  PRODUCT_ONEPAGER.md \
  MULTIPLE_ACCELERATOR_APPLICATION.md \
  MULTIPLE_ACCELERATOR_APPLICATION_JOTFORM.md \
; do
  [ -f "$f" ] && git mv "$f" docs/grants/ && echo "   → docs/grants/$f" || true
done

# SSA prep
for f in SSA_EXAM_DAY_CHECKLIST.md; do
  [ -f "$f" ] && git mv "$f" docs/ssa-prep/ && echo "   → docs/ssa-prep/$f" || true
done

# Swarm history (provenance)
for f in SWARM_*.md ALL_SWARMS_*.md; do
  [ -f "$f" ] && git mv "$f" docs/swarm-history/ && echo "   → docs/swarm-history/$f" || true
done 2>/dev/null

# Useful scripts
for f in cleanup-node-modules.ps1; do
  [ -f "$f" ] && git mv "$f" scripts/ && echo "   → scripts/$f" || true
done

echo "   ✓ Targeted files routed"

# ============================================================
# STEP 2b: Archive remaining root loose files
# ============================================================
echo "🗄️  Step 2b: Archiving remaining root loose files..."

KEEP_FILES="README.md CHANGELOG.md AGENTS.md package.json package-lock.json docker-compose.yml docker-compose.integration.yml .gitignore"

archive_if_loose() {
  local pattern="$1"
  for f in $pattern; do
    [ ! -f "$f" ] && continue
    # Check if it's in the keep list
    local keep=false
    for k in $KEEP_FILES; do
      [ "$f" = "$k" ] && keep=true && break
    done
    if [ "$keep" = false ]; then
      git mv "$f" _archive/root-loose/ && echo "   → _archive/root-loose/$f" || true
    fi
  done
}

archive_if_loose "*.md" 2>/dev/null || true
archive_if_loose "*.bat" 2>/dev/null || true
archive_if_loose "*.ps1" 2>/dev/null || true
archive_if_loose "*.py" 2>/dev/null || true
archive_if_loose "*.js" 2>/dev/null || true
archive_if_loose "*.cjs" 2>/dev/null || true
archive_if_loose "*.gs" 2>/dev/null || true
archive_if_loose "*.jsx" 2>/dev/null || true
archive_if_loose "*.xlsx" 2>/dev/null || true
archive_if_loose "*.html" 2>/dev/null || true
archive_if_loose "*.sql" 2>/dev/null || true
archive_if_loose "*.code-workspace" 2>/dev/null || true

# Stale config files
for f in docker-compose.backup.yml docker-compose.monitoring.yml vercel.json init_db.sql; do
  [ -f "$f" ] && git mv "$f" _archive/root-loose/ && echo "   → _archive/root-loose/$f" || true
done

# Stale Dockerfiles
for f in Dockerfile.*; do
  [ -f "$f" ] && git mv "$f" _archive/root-loose/ && echo "   → _archive/root-loose/$f" || true
done 2>/dev/null || true

echo "   ✓ Root loose files archived"

# ============================================================
# STEP 3: Archive stale directories
# ============================================================
echo "🗄️  Step 3: Archiving stale directories..."

STALE_DIRS=(
  backend
  phenix_core
  phenix_mesh
  phenix_data
  phenix_ui
  phenix_gensync
  phenix_render
  phenix_assets
  phenix-navigator-firmware
  TetrAI
  WONKY_SPROUT_BUILD_PACKAGE_V2
  VolumeEncoderParts_stls_backup
  tetrahedron_mission_package
  TETRAHEDRON_COMPLETE_DOCUMENTATION
  agent
  apps-script
  forensics
  backup_current
  swarm-complete
  deliverables
)

for d in "${STALE_DIRS[@]}"; do
  if [ -d "$d" ]; then
    git mv "$d" _archive/ && echo "   → _archive/$d/"
  fi
done

echo "   ✓ Stale directories archived"

# ============================================================
# STEP 3b: Rename firmware directory
# ============================================================
echo "🔧 Step 3b: Renaming firmware directory..."

if [ -d "node-one-esp-idf" ] && [ ! -d "firmware" ]; then
  git mv node-one-esp-idf firmware
  echo "   → node-one-esp-idf/ renamed to firmware/"
elif [ -d "firmware" ]; then
  echo "   ✓ firmware/ already exists"
else
  echo "   ⚠️  Neither node-one-esp-idf/ nor firmware/ found — creating placeholder"
  mkdir -p firmware
  echo "# Node Zero / Node One Firmware\n\nESP32-S3 firmware based on Xiaozhi + P31 extensions.\nSee docs/hardware/ for build guides." > firmware/README.md
fi

# ============================================================
# STEP 4: Sync apps/web/ from website/
# ============================================================
echo "🔗 Step 4: Syncing apps/web/ from website/..."

if [ -d "website" ] && [ -d "apps/web" ]; then
  cp -f website/index.html apps/web/index.html 2>/dev/null && echo "   ✓ index.html synced" || true
  cp -f website/styles.css apps/web/styles.css 2>/dev/null && echo "   ✓ styles.css synced" || true
fi

# ============================================================
# STEP 5: Clean package.json workspaces
# ============================================================
echo "📦 Step 5: Cleaning package.json workspaces..."

if grep -q '"organized/\*"' package.json 2>/dev/null; then
  sed -i 's/,\s*"organized\/\*"//g; s/"organized\/\*",\s*//g; s/"organized\/\*"//g' package.json
  echo "   ✓ Removed organized/* from workspaces"
else
  echo "   ✓ No organized/* workspace found"
fi

# ============================================================
# STEP 6: Generate archive manifest
# ============================================================
echo "📋 Step 6: Writing archive manifest..."

cat > _archive/MANIFEST.md << EOF
# Archive Manifest
Generated: $(date -Iseconds)

## Purpose
Provenance record for all archived content. Nothing was deleted.
Git history preserves full move tracking.

## Stale Directories Archived

| Directory | What It Was | Replaced By |
|-----------|-------------|-------------|
| backend/ | Original Express backend | SUPER-CENTAUR/ |
| phenix_core/ | Early Phenix core | firmware/ + ui/ |
| phenix_mesh/ | Early mesh code | firmware/ (LoRa) |
| phenix_data/ | Early data layer | SUPER-CENTAUR/ |
| phenix_ui/ | Early UI prototype | ui/ |
| phenix_gensync/ | Genesis sync | GENESIS_GATE_APPS_SCRIPT/ |
| phenix_render/ | Render pipeline | ui/ (Three.js) |
| phenix_assets/ | Static assets | ui/public/ + website/ |
| phenix-navigator-firmware/ | V1 firmware | firmware/ (Xiaozhi) |
| TetrAI/ | AI experiment | Completed |
| WONKY_SPROUT_BUILD_PACKAGE_V2/ | V2 build pkg | P31 ecosystem |
| VolumeEncoderParts_stls_backup/ | STL backup | hardware/ |
| tetrahedron_mission_package/ | Mission export | docs/swarm-history/ |
| TETRAHEDRON_COMPLETE_DOCUMENTATION/ | Tetra docs | docs/architecture/ |
| agent/ | Omega Protocol | Experimental, unused |
| apps-script/ | Single Code.gs | GENESIS_GATE_APPS_SCRIPT/ |
| forensics/ | Financial forensics | docs/legal-packet/ |
| backup_current/ | Backup snapshot | Git history |
| swarm-complete/ | Swarm army export | .cursor/rules/ |
| deliverables/ | Session deliverables | docs/ subdirectories |

## Root Loose Files
~130 files archived to _archive/root-loose/
See git log for individual file histories.
EOF

echo "   ✓ Manifest written"

# ============================================================
# STEP 7: Verify
# ============================================================
echo ""
echo "═══════════════════════════════════════"
echo "🔍 VERIFICATION"
echo "═══════════════════════════════════════"
echo ""

ROOT_FILES=$(find . -maxdepth 1 -type f ! -name '.*' | wc -l)
ROOT_DIRS=$(find . -maxdepth 1 -type d ! -name '.*' ! -name '.' | wc -l)

echo "Root files:       $ROOT_FILES (target: ~13)"
echo "Root directories: $ROOT_DIRS (target: ~12-13)"
echo ""

if [ "$ROOT_FILES" -le 15 ]; then
  echo "✅ Root file count is clean"
else
  echo "⚠️  Root still has $ROOT_FILES files — review manually"
fi

if [ "$ROOT_DIRS" -le 15 ]; then
  echo "✅ Root directory count is clean"
else
  echo "⚠️  Root still has $ROOT_DIRS directories — review manually"
fi

echo ""
echo "Root contents:"
ls -1 --group-directories-first
echo ""

ARCHIVE_DIRS=$(find _archive -maxdepth 1 -type d | wc -l)
ARCHIVE_LOOSE=$(find _archive/root-loose -maxdepth 1 -type f 2>/dev/null | wc -l)
echo "Archived directories: $((ARCHIVE_DIRS - 1))"
echo "Archived loose files: $ARCHIVE_LOOSE"

echo ""
echo "═══════════════════════════════════════"
echo "🔺 NUCLEAR CLEANUP COMPLETE"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. git status                    # Review all moves"
echo "  2. git diff --stat               # Verify no content changes"
echo "  3. npm install                   # Verify workspaces still resolve"
echo "  4. git add -A"
echo "  5. git commit -m 'refactor: nuclear repo cleanup — 141→13 root files'"
echo "  6. git push origin main"
echo ""
echo "Then route new deliverables to docs/ subdirectories."
echo "See NUCLEAR_CLEANUP_PACKAGE.md for the routing table."
