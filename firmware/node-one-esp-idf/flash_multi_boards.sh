#!/bin/bash
# ============================================================
# 🔺 P31 NODE ONE - MULTI-BOARD FLASH UTILITY
#    Flash multiple Node One boards on different serial ports
#    G.O.D. Protocol Compliant - No Backdoors
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Defaults
PORTS=()
PARALLEL=false
BUILD=false
MONITOR=false
FIRMWARE_DIR="."

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--ports)
            IFS=',' read -ra PORTS <<< "$2"
            shift 2
            ;;
        --parallel)
            PARALLEL=true
            shift
            ;;
        --build)
            BUILD=true
            shift
            ;;
        --monitor)
            MONITOR=true
            shift
            ;;
        -d|--dir)
            FIRMWARE_DIR="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -p, --ports PORTS     Comma-separated list of ports (e.g., /dev/ttyUSB0,/dev/ttyUSB1)"
            echo "  --parallel           Flash boards in parallel (requires GNU parallel)"
            echo "  --build              Build firmware before flashing"
            echo "  --monitor            Start serial monitor after flashing"
            echo "  -d, --dir DIR        Firmware directory (default: current)"
            echo "  -h, --help           Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Counters
SUCCESS_COUNT=0
FAIL_COUNT=0
RESULTS=()

function print_header() {
    echo ""
    echo "=========================================="
    echo "  $1"
    echo "=========================================="
}

function get_available_ports() {
    echo -e "${YELLOW}[SCAN] Detecting available serial ports...${NC}"
    
    local ports=()
    
    # Linux: /dev/ttyUSB*, /dev/ttyACM*
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        while IFS= read -r port; do
            if [[ -c "$port" ]]; then
                ports+=("$port")
            fi
        done < <(find /dev -name "ttyUSB*" -o -name "ttyACM*" 2>/dev/null | sort)
    # macOS: /dev/tty.usbserial*, /dev/tty.usbmodem*
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        while IFS= read -r port; do
            if [[ -c "$port" ]]; then
                ports+=("$port")
            fi
        done < <(find /dev -name "tty.usbserial*" -o -name "tty.usbmodem*" 2>/dev/null | sort)
    fi
    
    echo "${ports[@]}"
}

function test_esp_device() {
    local port=$1
    
    if command -v esptool.py &> /dev/null; then
        if esptool.py --port "$port" chip_id &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

function flash_board() {
    local port=$1
    local firmware_dir=$2
    
    echo -e "${YELLOW}[FLASH] Starting flash to $port...${NC}"
    
    # Check if device is accessible
    if ! test_esp_device "$port"; then
        echo -e "${YELLOW}  ⚠ ESP32 not detected on $port${NC}"
        echo -e "${GRAY}     Entering boot mode...${NC}"
        echo -e "${GRAY}     1. Hold BOOT button${NC}"
        echo -e "${GRAY}     2. Press RST while holding BOOT${NC}"
        echo -e "${GRAY}     3. Release RST, then release BOOT${NC}"
        echo -e "${GRAY}     Waiting 3 seconds...${NC}"
        sleep 3
    fi
    
    # Change to firmware directory
    pushd "$firmware_dir" > /dev/null
    
    # Flash using idf.py
    echo -e "${GRAY}  → Flashing firmware...${NC}"
    if idf.py -p "$port" flash; then
        echo -e "${GREEN}  ✓ Flash complete on $port${NC}"
        ((SUCCESS_COUNT++))
        popd > /dev/null
        return 0
    else
        echo -e "${RED}  ✗ Flash failed on $port${NC}"
        ((FAIL_COUNT++))
        popd > /dev/null
        return 1
    fi
}

function monitor_board() {
    local port=$1
    local firmware_dir=$2
    
    pushd "$firmware_dir" > /dev/null
    echo -e "${YELLOW}[MONITOR] Starting monitor on $port...${NC}"
    echo -e "${GRAY}  Press Ctrl+] to exit monitor${NC}"
    idf.py -p "$port" monitor
    popd > /dev/null
}

# ============================================================
# MAIN EXECUTION
# ============================================================

print_header "P31 NODE ONE - MULTI-BOARD FLASH"

# Check ESP-IDF
echo -e "${YELLOW}[CHECK] Verifying ESP-IDF...${NC}"
if ! command -v idf.py &> /dev/null; then
    echo -e "${RED}  ✗ ESP-IDF not found in PATH!${NC}"
    echo -e "${YELLOW}     Please run: . \$IDF_PATH/export.sh${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ ESP-IDF detected${NC}"

# Get firmware directory (absolute path)
FIRMWARE_DIR=$(cd "$FIRMWARE_DIR" && pwd)
echo -e "${GREEN}  ✓ Firmware directory: $FIRMWARE_DIR${NC}"

# Build if requested
if [[ "$BUILD" == true ]]; then
    print_header "BUILDING FIRMWARE"
    pushd "$FIRMWARE_DIR" > /dev/null
    echo -e "${YELLOW}[BUILD] Building firmware...${NC}"
    if idf.py build; then
        echo -e "${GREEN}  ✓ Build complete${NC}"
    else
        echo -e "${RED}  ✗ Build failed!${NC}"
        popd > /dev/null
        exit 1
    fi
    popd > /dev/null
fi

# Detect available ports
print_header "PORT DETECTION"
AVAILABLE_PORTS=($(get_available_ports))

if [[ ${#AVAILABLE_PORTS[@]} -eq 0 ]]; then
    echo -e "${RED}  ✗ No serial ports detected!${NC}"
    exit 1
fi

echo -e "${NC}Available serial ports:${NC}"
for i in "${!AVAILABLE_PORTS[@]}"; do
    echo -e "${GRAY}  [$i] ${AVAILABLE_PORTS[$i]}${NC}"
done

# Select ports
if [[ ${#PORTS[@]} -eq 0 ]]; then
    echo -e "${YELLOW}[SELECT] Enter port numbers to flash (comma-separated, e.g., 0,1,2):${NC}"
    echo -e "${GRAY}         Or enter port paths directly (e.g., /dev/ttyUSB0,/dev/ttyUSB1):${NC}"
    read -r input
    
    if [[ "$input" =~ ^[0-9,]+$ ]]; then
        # Numbers provided
        IFS=',' read -ra indices <<< "$input"
        for idx in "${indices[@]}"; do
            idx=$(echo "$idx" | tr -d ' ')
            if [[ "$idx" -ge 0 && "$idx" -lt ${#AVAILABLE_PORTS[@]} ]]; then
                PORTS+=("${AVAILABLE_PORTS[$idx]}")
            fi
        done
    else
        # Port paths provided
        IFS=',' read -ra PORTS <<< "$input"
        for i in "${!PORTS[@]}"; do
            PORTS[$i]=$(echo "${PORTS[$i]}" | tr -d ' ')
        done
    fi
fi

if [[ ${#PORTS[@]} -eq 0 ]]; then
    echo -e "${RED}  ✗ No ports selected!${NC}"
    exit 1
fi

echo -e "${CYAN}[CONFIG] Selected ports: ${PORTS[*]}${NC}"

# Confirm
echo -e "${YELLOW}Ready to flash ${#PORTS[@]} board(s)?${NC}"
read -r -p "Continue? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${YELLOW}Flash cancelled.${NC}"
    exit 0
fi

# Flash boards
print_header "FLASHING BOARDS"

if [[ "$PARALLEL" == true && ${#PORTS[@]} -gt 1 ]]; then
    echo -e "${YELLOW}[FLASH] Flashing in parallel mode...${NC}"
    
    if ! command -v parallel &> /dev/null; then
        echo -e "${RED}  ✗ GNU parallel not installed!${NC}"
        echo -e "${YELLOW}     Install with: sudo apt-get install parallel${NC}"
        echo -e "${YELLOW}     Falling back to sequential mode...${NC}"
        PARALLEL=false
    fi
fi

if [[ "$PARALLEL" == true ]]; then
    # Parallel flashing using GNU parallel
    export -f flash_board test_esp_device
    export SUCCESS_COUNT FAIL_COUNT
    printf '%s\n' "${PORTS[@]}" | parallel -j ${#PORTS[@]} flash_board {} "$FIRMWARE_DIR"
else
    # Sequential flashing
    echo -e "${YELLOW}[FLASH] Flashing in sequential mode...${NC}"
    for port in "${PORTS[@]}"; do
        if flash_board "$port" "$FIRMWARE_DIR"; then
            RESULTS+=("$port:Success")
        else
            RESULTS+=("$port:Failed")
        fi
    done
fi

# Summary
print_header "FLASH SUMMARY"
echo -e "${NC}Results:${NC}"
for result in "${RESULTS[@]}"; do
    port=$(echo "$result" | cut -d: -f1)
    status=$(echo "$result" | cut -d: -f2)
    if [[ "$status" == "Success" ]]; then
        echo -e "${GREEN}  $port: $status${NC}"
    else
        echo -e "${RED}  $port: $status${NC}"
    fi
done

echo -e "${NC}Total: $SUCCESS_COUNT success, $FAIL_COUNT failed${NC}"

# Monitor if requested
if [[ "$MONITOR" == true && $SUCCESS_COUNT -gt 0 ]]; then
    echo -e "${YELLOW}[MONITOR] Starting serial monitor...${NC}"
    if [[ ${#PORTS[@]} -eq 1 ]]; then
        monitor_board "${PORTS[0]}" "$FIRMWARE_DIR"
    else
        echo -e "${YELLOW}  Multiple boards flashed. Select port to monitor:${NC}"
        for i in "${!PORTS[@]}"; do
            echo -e "${GRAY}    [$i] ${PORTS[$i]}${NC}"
        done
        read -r -p "Port index: " monitor_index
        if [[ "$monitor_index" =~ ^[0-9]+$ && "$monitor_index" -lt ${#PORTS[@]} ]]; then
            monitor_board "${PORTS[$monitor_index]}" "$FIRMWARE_DIR"
        fi
    fi
fi

echo -e "${CYAN}🔺 The Mesh Holds.${NC}"
