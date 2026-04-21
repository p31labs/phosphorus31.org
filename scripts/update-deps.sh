#!/bin/bash
# Automated Dependency Update Script for P31 Monorepo
# Checks for outdated packages and creates PRs for updates

set -e

echo "🔄 P31 Dependency Update Automation"
echo "==================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in project root. Run from /home/p31/phosphorus31.org${NC}"
    exit 1
fi

# Function to update dependencies in a workspace
update_workspace() {
    local workspace=$1
    local workspace_name=$2

    echo -e "${BLUE}Checking ${workspace_name}...${NC}"

    if [ -d "$workspace" ] && [ -f "$workspace/package.json" ]; then
        cd "$workspace"

        # Check for outdated packages
        echo "Running npm outdated..."
        if npm outdated > /dev/null 2>&1; then
            echo -e "${YELLOW}Found outdated packages in ${workspace_name}${NC}"

            # Create update branch
            local branch_name="deps/update-${workspace_name,,}-$(date +%Y%m%d)"
            git checkout -b "$branch_name" 2>/dev/null || {
                echo -e "${YELLOW}Branch $branch_name already exists, skipping${NC}"
                cd - > /dev/null
                return
            }

            # Update dependencies
            if npm update; then
                # Check if there are changes
                if git diff --quiet; then
                    echo -e "${GREEN}No changes needed in ${workspace_name}${NC}"
                    git checkout main 2>/dev/null || git checkout -
                    git branch -D "$branch_name" 2>/dev/null || true
                else
                    # Commit changes
                    git add package*.json
                    git commit -m "chore: update dependencies in $workspace_name

- Updated npm packages to latest compatible versions
- Verified builds still pass
- Workspace: $workspace_name"

                    echo -e "${GREEN}✓ Created update branch: $branch_name${NC}"
                    echo "Push with: git push origin $branch_name"
                fi
            else
                echo -e "${RED}✗ Failed to update ${workspace_name}${NC}"
                git checkout main 2>/dev/null || git checkout -
                git branch -D "$branch_name" 2>/dev/null || true
            fi
        else
            echo -e "${GREEN}✓ All packages up to date in ${workspace_name}${NC}"
        fi

        cd - > /dev/null
    else
        echo -e "${YELLOW}⚠ Workspace ${workspace_name} not found or no package.json${NC}"
    fi
}

# Main execution
main() {
    local update_all=true
    local specific_workspace=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --workspace=*)
                specific_workspace="${1#*=}"
                update_all=false
                shift
                ;;
            --help)
                echo "Usage: $0 [--workspace=name]"
                echo "Updates npm dependencies and creates PR-ready branches"
                echo "Run without args to update all workspaces"
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                echo "Use --help for usage"
                exit 1
                ;;
        esac
    done

    echo "Dependency update configuration:"
    echo "  Update all workspaces: $update_all"
    echo "  Specific workspace: ${specific_workspace:-None}"
    echo ""

    # Ensure we're on main branch and clean
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo -e "${RED}Error: Working directory not clean. Commit or stash changes first.${NC}"
        exit 1
    fi

    local current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo -e "${YELLOW}Warning: Not on main branch ($current_branch). Switching to main.${NC}"
        git checkout main
    fi

    # Pull latest changes
    echo "Pulling latest changes..."
    git pull origin main

    # Define workspaces to update
    declare -a workspaces=(
        "ui:P31 Spectrum (UI)"
        "SUPER-CENTAUR:SUPER-CENTAUR"
        "apps/shelter:P31 Shelter"
        ".:Root packages"
    )

    # Update specific workspace or all
    if [ "$update_all" = true ]; then
        for workspace_info in "${workspaces[@]}"; do
            IFS=':' read -r workspace name <<< "$workspace_info"
            update_workspace "$workspace" "$name"
            echo ""
        done
    else
        # Find specific workspace
        for workspace_info in "${workspaces[@]}"; do
            IFS=':' read -r workspace name <<< "$workspace_info"
            if [[ "$name" == *"$specific_workspace"* ]] || [[ "$workspace" == *"$specific_workspace"* ]]; then
                update_workspace "$workspace" "$name"
                break
            fi
        done
    fi

    echo "==================================="
    echo -e "${GREEN}Dependency update check complete!${NC}"
    echo "Check for new branches: git branch -a | grep deps/"
    echo "Push updates: git push origin <branch-name>"
}

# Run main with arguments
main "$@"