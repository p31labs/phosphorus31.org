#!/bin/bash
# Unified Test Runner for P31 Monorepo
# Runs tests across all workspaces with coverage reporting

set -e

echo "🧪 P31 Unified Test Runner"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run tests in a workspace
run_workspace_tests() {
    local workspace=$1
    local test_cmd=$2
    local workspace_name=$3

    echo -e "${BLUE}Testing ${workspace_name}...${NC}"

    if [ -d "$workspace" ]; then
        cd "$workspace"
        if [ -f "package.json" ]; then
            if npm run | grep -q "$test_cmd"; then
                echo "Running: npm run $test_cmd"
                if npm run "$test_cmd"; then
                    echo -e "${GREEN}✓ ${workspace_name} tests passed${NC}"
                else
                    echo -e "${RED}✗ ${workspace_name} tests failed${NC}"
                    return 1
                fi
            else
                echo -e "${YELLOW}⚠ No $test_cmd script in ${workspace_name}${NC}"
            fi
        else
            echo -e "${YELLOW}⚠ No package.json in ${workspace_name}${NC}"
        fi
        cd - > /dev/null
    else
        echo -e "${YELLOW}⚠ Workspace ${workspace_name} not found${NC}"
    fi
}

# Main test execution
main() {
    local run_coverage=false
    local specific_workspace=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --coverage)
                run_coverage=true
                shift
                ;;
            --workspace=*)
                specific_workspace="${1#*=}"
                shift
                ;;
            *)
                echo "Usage: $0 [--coverage] [--workspace=name]"
                exit 1
                ;;
        esac
    done

    echo "Test configuration:"
    echo "  Coverage: $run_coverage"
    echo "  Specific workspace: ${specific_workspace:-All}"
    echo ""

    local total_passed=0
    local total_failed=0

    # Define workspaces to test
    declare -a workspaces=(
        "ui:test:engine:P31 Spectrum (UI)"
        "SUPER-CENTAUR:test:SUPER-CENTAUR"
        "apps/shelter:test:P31 Shelter"
    )

    # If specific workspace requested
    if [ -n "$specific_workspace" ]; then
        case $specific_workspace in
            ui|scope|spectrum)
                workspaces=("ui:test:engine:P31 Spectrum (UI)")
                ;;
            centaur|tandem)
                workspaces=("SUPER-CENTAUR:test:SUPER-CENTAUR")
                ;;
            shelter|buffer)
                workspaces=("apps/shelter:test:P31 Shelter")
                ;;
            *)
                echo -e "${RED}Unknown workspace: $specific_workspace${NC}"
                echo "Available: ui, centaur, shelter"
                exit 1
                ;;
        esac
    fi

    # Run tests for each workspace
    for workspace_info in "${workspaces[@]}"; do
        IFS=':' read -r workspace test_cmd name <<< "$workspace_info"

        if run_workspace_tests "$workspace" "$test_cmd" "$name"; then
            ((total_passed++))
        else
            ((total_failed++))
        fi
        echo ""
    done

    # Generate coverage report if requested
    if [ "$run_coverage" = true ]; then
        echo -e "${BLUE}Generating coverage report...${NC}"

        # Run coverage for UI if available
        if [ -d "ui" ]; then
            cd ui
            if npm run | grep -q "test:coverage"; then
                npm run test:coverage
            fi
            cd - > /dev/null
        fi

        # Run coverage for SUPER-CENTAUR if available
        if [ -d "SUPER-CENTAUR" ]; then
            cd SUPER-CENTAUR
            if npm run | grep -q "test:coverage"; then
                npm run test:coverage
            fi
            cd - > /dev/null
        fi
    fi

    # Summary
    echo "=========================="
    echo -e "${BLUE}Test Summary:${NC}"
    echo "  Passed: $total_passed"
    echo "  Failed: $total_failed"

    if [ $total_failed -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        exit 0
    else
        echo -e "${RED}❌ Some tests failed. Check output above.${NC}"
        exit 1
    fi
}

# Run main function with all arguments
main "$@"