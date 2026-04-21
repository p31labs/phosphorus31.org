#!/bin/bash
# Automated TODO and Issue Management for P31 Monorepo
# Scans codebase for TODO/FIXME comments and generates reports/issues

set -e

echo "📋 P31 TODO & Issue Management Automation"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
REPO_OWNER="p31labs"
REPO_NAME="andromeda"
OUTPUT_DIR="reports"
ISSUES_FILE="$OUTPUT_DIR/todo-issues-$(date +%Y%m%d).md"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to extract TODO items
extract_todos() {
    local file="$1"
    local relative_path="${file#./}"

    # Extract TODO/FIXME lines
    grep -n -i "todo\|fixme\|xxx" "$file" 2>/dev/null | \
    while IFS=: read -r line_num content; do
        # Clean up content
        content=$(echo "$content" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/\/\//* /' | sed 's/\/\///' | sed 's/\/\*//' | sed 's/\*\///')

        if [[ $content =~ (TODO|FIXME|XXX) ]]; then
            echo "$relative_path|$line_num|$content"
        fi
    done
}

# Function to categorize TODO
categorize_todo() {
    local content="$1"

    if [[ $content =~ (test|spec|vitest|jest) ]]; then
        echo "testing"
    elif [[ $content =~ (lint|eslint|prettier|format) ]]; then
        echo "code-quality"
    elif [[ $content =~ (build|deploy|ci|github) ]]; then
        echo "build-deploy"
    elif [[ $content =~ (doc|readme|comment) ]]; then
        echo "documentation"
    elif [[ $content =~ (security|auth|encrypt) ]]; then
        echo "security"
    elif [[ $content =~ (ui|component|react|state) ]]; then
        echo "frontend"
    elif [[ $content =~ (api|backend|server|worker) ]]; then
        echo "backend"
    elif [[ $content =~ (hardware|firmware|esp32) ]]; then
        echo "hardware"
    elif [[ $content =~ (bug|error|crash|fix) ]]; then
        echo "bug"
    elif [[ $content =~ (feature|enhance|add) ]]; then
        echo "enhancement"
    else
        echo "general"
    fi
}

# Function to estimate priority
estimate_priority() {
    local content="$1"

    if [[ $content =~ (critical|urgent|immediate|fix.*bug) ]]; then
        echo "high"
    elif [[ $content =~ (important|should|need|enhance) ]]; then
        echo "medium"
    else
        echo "low"
    fi
}

# Function to create GitHub issue
create_github_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"

    if [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${YELLOW}⚠️  GitHub token not set, skipping issue creation${NC}"
        return 1
    fi

    local response=$(curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues" \
        -d "{\"title\": \"$title\", \"body\": \"$body\", \"labels\": [$labels]}")

    local issue_url=$(echo "$response" | jq -r '.html_url // empty')

    if [ -n "$issue_url" ] && [ "$issue_url" != "null" ]; then
        echo "$issue_url"
        return 0
    else
        echo -e "${RED}Failed to create issue: $(echo "$response" | jq -r '.message // "Unknown error"')${NC}"
        return 1
    fi
}

# Main execution
main() {
    local create_issues=false
    local dry_run=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --create-issues)
                create_issues=true
                shift
                ;;
            --dry-run)
                dry_run=true
                create_issues=false
                shift
                ;;
            --help)
                echo "Usage: $0 [--create-issues] [--dry-run]"
                echo ""
                echo "Options:"
                echo "  --create-issues  Create GitHub issues for TODO items"
                echo "  --dry-run       Show what would be done without creating issues"
                echo ""
                echo "Scans codebase for TODO/FIXME comments and generates reports."
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                exit 1
                ;;
        esac
    done

    if [ "$create_issues" = true ] && [ -z "$GITHUB_TOKEN" ]; then
        echo -e "${RED}Error: GITHUB_TOKEN environment variable required for --create-issues${NC}"
        exit 1
    fi

    echo "Configuration:"
    echo "  Create GitHub issues: $create_issues"
    echo "  Dry run: $dry_run"
    echo ""

    # Initialize issues file
    cat > "$ISSUES_FILE" << EOF
# P31 TODO & Issue Report
Generated: $(date)

This report contains TODO/FIXME items extracted from the codebase.

## Summary

## Issues

EOF

    local total_todos=0
    declare -A category_count
    declare -A priority_count

    # Scan for TODO items
    echo -e "${BLUE}Scanning codebase for TODO/FIXME comments...${NC}"

    local file_count=0
    # Simple approach: use a for loop over found files
    for file in $(find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.py" -o -name "*.sh" -o -name "*.md" \) \
                  -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" -not -path "./build/*" 2>/dev/null); do
        ((file_count++))

        # Check if file has TODOs
        if grep -q -i "todo\|fixme\|xxx" "$file" 2>/dev/null; then
            # Extract TODO lines
            grep -n -i "todo\|fixme\|xxx" "$file" 2>/dev/null | while IFS=: read -r line_num content; do
                # Clean up content
                content=$(echo "$content" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | sed 's/\/\//* /' | sed 's/\/\///' | sed 's/\/\*//' | sed 's/\*\///')

                ((total_todos++))

                # Get relative path
                relative_path="${file#./}"

                # Categorize
                category=$(categorize_todo "$content")
                priority=$(estimate_priority "$content")

                # Count
                category_count[$category]=$((category_count[$category] + 1))
                priority_count[$priority]=$((priority_count[$priority] + 1))

                # Format for report
                echo "### TODO: $content" >> "$ISSUES_FILE"
                echo "- **File:** \`$relative_path\`" >> "$ISSUES_FILE"
                echo "- **Line:** $line_num" >> "$ISSUES_FILE"
                echo "- **Category:** $category" >> "$ISSUES_FILE"
                echo "- **Priority:** $priority" >> "$ISSUES_FILE"
                echo "" >> "$ISSUES_FILE"

                # Create GitHub issue if requested
                if [ "$create_issues" = true ]; then
                    title="TODO: $content"
                    body="**File:** $relative_path:$line_num

**Content:** $content

**Category:** $category
**Priority:** $priority

*Automatically generated from codebase TODO comment*"

                    labels="\"$category\",\"$priority\",\"todo\""

                    if [ "$dry_run" = false ]; then
                        echo -n "Creating issue: $title ... "
                        issue_url=$(create_github_issue "$title" "$body" "$labels")
                        if [ $? -eq 0 ]; then
                            echo -e "${GREEN}✓ $issue_url${NC}"
                            echo "- **Issue:** $issue_url" >> "$ISSUES_FILE"
                        else
                            echo -e "${RED}✗ Failed${NC}"
                        fi
                    else
                        echo -e "${BLUE}Would create issue: $title${NC}"
                    fi
                fi
            done
        fi
    done

    # Update summary
    sed -i "s/## Summary/## Summary\n\n- Total TODO items: $total_todos/" "$ISSUES_FILE"

    if [ ${#category_count[@]} -gt 0 ]; then
        echo "" >> "$ISSUES_FILE"
        echo "### By Category" >> "$ISSUES_FILE"
        for category in "${!category_count[@]}"; do
            echo "- $category: ${category_count[$category]}" >> "$ISSUES_FILE"
        done
    fi

    if [ ${#priority_count[@]} -gt 0 ]; then
        echo "" >> "$ISSUES_FILE"
        echo "### By Priority" >> "$ISSUES_FILE"
        for priority in "${!priority_count[@]}"; do
            echo "- $priority: ${priority_count[$priority]}" >> "$ISSUES_FILE"
        done
    fi

    # Debug info
    echo "Debug: Scanned $file_count files"

    # Final report
    echo ""
    echo "======================================="
    echo -e "${GREEN}TODO extraction complete!${NC}"
    echo "  Total TODO items found: $total_todos"
    echo "  Report saved to: $ISSUES_FILE"

    if [ "$create_issues" = true ] && [ "$dry_run" = false ]; then
        echo "  GitHub issues created for each TODO"
    elif [ "$create_issues" = true ] && [ "$dry_run" = true ]; then
        echo "  Dry run completed (no issues created)"
    fi

    if [ $total_todos -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}Top categories:${NC}"
        for category in "${!category_count[@]}"; do
            echo "  $category: ${category_count[$category]}"
        done | sort -t: -k2 -nr | head -5
    fi
}

# Run main
main "$@"