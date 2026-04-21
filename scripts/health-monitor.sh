#!/bin/bash
# Advanced Health Monitoring System for P31 Infrastructure
# Continuous monitoring with alerts, metrics, and reporting

set -e

# Configuration
MONITOR_INTERVAL=300  # 5 minutes
ALERT_EMAIL="alerts@p31labs.dev"
LOG_FILE="/var/log/p31-monitor.log"
METRICS_FILE="/tmp/p31-metrics.json"

# Colors and formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

# Service definitions
declare -A SERVICES=(
    ["p31-agent-hub"]="https://p31-agent-hub.trimtab-signal.workers.dev/health"
    ["k4-cage"]="https://k4-cage.trimtab-signal.workers.dev/health"
    ["k4-personal"]="https://k4-personal.trimtab-signal.workers.dev/health"
    ["k4-hubs"]="https://k4-hubs.trimtab-signal.workers.dev/health"
    ["p31-bouncer"]="https://p31-bouncer.trimtab-signal.workers.dev/health"
    ["reflective-chamber"]="https://reflective-chamber.trimtab-signal.workers.dev/synthesize"
)

# Initialize metrics
init_metrics() {
    cat > "$METRICS_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "services": {},
  "system": {
    "cpu": 0,
    "memory": 0,
    "disk": 0
  },
  "alerts": []
}
EOF
}

# Log function
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    echo "[$timestamp] [$level] $message"
}

# Alert function
alert() {
    local severity="$1"
    local service="$2"
    local message="$3"

    log "ALERT" "$severity: $service - $message"

    # Add to metrics
    jq --arg severity "$severity" --arg service "$service" --arg message "$message" --arg time "$(date -Iseconds)" \
       '.alerts += [{"severity": $severity, "service": $service, "message": $message, "timestamp": $time}]' \
       "$METRICS_FILE" > "${METRICS_FILE}.tmp" && mv "${METRICS_FILE}.tmp" "$METRICS_FILE"

    # Console alert
    case "$severity" in
        "CRITICAL")
            echo -e "${RED}${BOLD}🚨 CRITICAL ALERT: $service - $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}${BOLD}⚠️  WARNING: $service - $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}${BOLD}ℹ️  INFO: $service - $message${NC}"
            ;;
    esac

    # Email alert (if configured)
    if command -v mail &> /dev/null && [ -n "$ALERT_EMAIL" ]; then
        echo "P31 Monitor Alert - $severity

Service: $service
Message: $message
Time: $(date)

Check logs at $LOG_FILE
Metrics at $METRICS_FILE" | mail -s "P31 Monitor: $severity Alert" "$ALERT_EMAIL"
    fi
}

# Check service health
check_service() {
    local service="$1"
    local url="$2"
    local timeout=10

    local start_time=$(date +%s%3N)
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null || echo "000")
    local end_time=$(date +%s%3N)
    local response_time=$((end_time - start_time))

    local status="unknown"
    local healthy=false

    if [ "$response_code" = "200" ]; then
        status="healthy"
        healthy=true
    elif [ "$response_code" = "000" ]; then
        status="unreachable"
    else
        status="error_$response_code"
    fi

    # Update metrics
    jq --arg service "$service" --arg status "$status" --arg response_time "$response_time" --arg healthy "$healthy" \
       '.services[$service] = {"status": $status, "response_time": $response_time, "healthy": $healthy, "last_check": now | strftime("%Y-%m-%dT%H:%M:%SZ")}' \
       "$METRICS_FILE" > "${METRICS_FILE}.tmp" && mv "${METRICS_FILE}.tmp" "$METRICS_FILE"

    echo "$service:$status:$response_time:$healthy"
}

# Check system resources
check_system() {
    # CPU usage (simplified)
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

    # Memory usage
    local mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')

    # Disk usage
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

    # Update metrics
    jq --arg cpu "$cpu_usage" --arg mem "$mem_usage" --arg disk "$disk_usage" \
       '.system = {"cpu": ($cpu | tonumber), "memory": ($mem | tonumber), "disk": ($disk | tonumber)}' \
       "$METRICS_FILE" > "${METRICS_FILE}.tmp" && mv "${METRICS_FILE}.tmp" "$METRICS_FILE"

    echo "system:cpu=$cpu_usage%:mem=$mem_usage%:disk=$disk_usage%"
}

# Generate health report
generate_report() {
    echo -e "${BOLD}🏥 P31 Health Monitoring Report${NC}"
    echo "Generated: $(date)"
    echo "========================================"

    # Services status
    echo -e "\n${BOLD}Services:${NC}"
    local healthy_count=0
    local total_count=0

    for service in "${!SERVICES[@]}"; do
        ((total_count++))
        local status=$(jq -r ".services.\"$service\".status" "$METRICS_FILE" 2>/dev/null || echo "unknown")
        local response_time=$(jq -r ".services.\"$service\".response_time" "$METRICS_FILE" 2>/dev/null || echo "0")
        local healthy=$(jq -r ".services.\"$service\".healthy" "$METRICS_FILE" 2>/dev/null || echo "false")

        if [ "$healthy" = "true" ]; then
            ((healthy_count++))
            echo -e "  ${GREEN}✓${NC} $service: $status (${response_time}ms)"
        else
            echo -e "  ${RED}✗${NC} $service: $status (${response_time}ms)"
        fi
    done

    # System status
    echo -e "\n${BOLD}System Resources:${NC}"
    local cpu=$(jq -r ".system.cpu" "$METRICS_FILE" 2>/dev/null || echo "0")
    local mem=$(jq -r ".system.memory" "$METRICS_FILE" 2>/dev/null || echo "0")
    local disk=$(jq -r ".system.disk" "$METRICS_FILE" 2>/dev/null || echo "0")

    echo -e "  CPU: ${cpu}%"
    echo -e "  Memory: ${mem}%"
    echo -e "  Disk: ${disk}%"

    # Alerts summary
    local alert_count=$(jq '.alerts | length' "$METRICS_FILE" 2>/dev/null || echo "0")
    echo -e "\n${BOLD}Active Alerts:${NC} $alert_count"

    # Overall status
    echo -e "\n${BOLD}Overall Status:${NC}"
    if [ $healthy_count -eq $total_count ]; then
        echo -e "  ${GREEN}✓ All systems operational${NC}"
    elif [ $healthy_count -gt 0 ]; then
        echo -e "  ${YELLOW}⚠ Partial system degradation${NC}"
    else
        echo -e "  ${RED}🚨 Critical system failure${NC}"
    fi

    echo "========================================"
}

# Main monitoring loop
main() {
    local continuous=false
    local report_only=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --continuous)
                continuous=true
                shift
                ;;
            --report)
                report_only=true
                shift
                ;;
            --help)
                echo "Usage: $0 [--continuous] [--report]"
                echo ""
                echo "Options:"
                echo "  --continuous  Run continuous monitoring"
                echo "  --report      Generate report only"
                echo ""
                echo "Without options: Run single health check"
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                exit 1
                ;;
        esac
    done

    # Initialize
    init_metrics
    log "INFO" "Health monitoring started"

    if [ "$report_only" = true ]; then
        # Run checks once
        check_system > /dev/null
        for service in "${!SERVICES[@]}"; do
            check_service "$service" "${SERVICES[$service]}" > /dev/null
        done
        generate_report
        exit 0
    fi

    if [ "$continuous" = true ]; then
        echo -e "${BLUE}Starting continuous monitoring (interval: ${MONITOR_INTERVAL}s)...${NC}"
        echo "Press Ctrl+C to stop"

        while true; do
            echo "$(date '+%Y-%m-%d %H:%M:%S') - Running health checks..."

            # Check system
            local sys_info=$(check_system)
            log "INFO" "System check: $sys_info"

            # Check services
            local failed_services=()
            for service in "${!SERVICES[@]}"; do
                local result=$(check_service "$service" "${SERVICES[$service]}")
                IFS=':' read -r svc status response_time healthy <<< "$result"

                if [ "$healthy" != "true" ]; then
                    failed_services+=("$svc")
                    alert "WARNING" "$svc" "Service unhealthy (status: $status)"
                fi
            done

            # Check for critical failures
            if [ ${#failed_services[@]} -gt 2 ]; then
                alert "CRITICAL" "Multiple Services" "Over 50% of services failing: ${failed_services[*]}"
            fi

            # Generate periodic report
            if [ $(( $(date +%s) % 3600 )) -eq 0 ]; then  # Hourly report
                generate_report
            fi

            sleep "$MONITOR_INTERVAL"
        done
    else
        # Single check
        echo "Running single health check..."
        check_system

        local all_healthy=true
        for service in "${!SERVICES[@]}"; do
            local result=$(check_service "$service" "${SERVICES[$service]}")
            IFS=':' read -r svc status response_time healthy <<< "$result"

            if [ "$healthy" != "true" ]; then
                alert "WARNING" "$svc" "Service unhealthy (status: $status)"
                all_healthy=false
            fi
        done

        generate_report

        if [ "$all_healthy" = true ]; then
            log "INFO" "All systems healthy"
            exit 0
        else
            log "WARNING" "Some systems unhealthy"
            exit 1
        fi
    fi
}

# Handle interrupts gracefully
trap 'log "INFO" "Monitoring stopped by user"; exit 0' INT TERM

# Run main
main "$@"