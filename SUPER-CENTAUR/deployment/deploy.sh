#!/bin/bash

# SUPER CENTAUR - Cross-Platform 1-Click Deploy Script
# 🦄 The Ultimate Legal & Autonomous Agent System
# 💜 With love and light - As above, so below

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}🦄 SUPER CENTAUR - Cross-Platform 1-Click Deployment${NC}"
    echo -e "${CYAN}💜 With love and light - As above, so below${NC}"
    echo
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js
install_node() {
    print_status "Installing Node.js..."
    
    if command_exists brew; then
        print_status "Installing via Homebrew..."
        brew install node
    elif command_exists apt-get; then
        print_status "Installing via apt-get..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command_exists yum; then
        print_status "Installing via yum..."
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    elif command_exists apk; then
        print_status "Installing via apk..."
        apk add nodejs npm
    else
        print_error "No package manager found. Please install Node.js manually."
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    cd "$PROJECT_DIR"
    npm install --loglevel=error
    print_success "Dependencies installed successfully"
}

# Function to build project
build_project() {
    print_status "Building project..."
    npm run build
    print_success "Project built successfully"
}

# Function to create systemd service (Linux)
create_systemd_service() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_status "Creating systemd service..."
        
        SERVICE_FILE="/etc/systemd/system/super-centaur.service"
        
        sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=SUPER CENTAUR - The Ultimate Legal & Autonomous Agent System
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$(which npm) run cli -- start --port $PORT
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

        sudo systemctl daemon-reload
        sudo systemctl enable super-centaur
        print_success "Systemd service created and enabled"
    fi
}

# Function to create launchd service (macOS)
create_launchd_service() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Creating launchd service..."
        
        PLIST_FILE="$HOME/Library/LaunchAgents/com.supercentaur.service.plist"
        
        cat > "$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.supercentaur.service</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which npm)</string>
        <string>run</string>
        <string>cli</string>
        <string>--</string>
        <string>start</string>
        <string>--port</string>
        <string>$PORT</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$PROJECT_DIR/logs/super-centaur.log</string>
    <key>StandardErrorPath</key>
    <string>$PROJECT_DIR/logs/super-centaur-error.log</string>
</dict>
</plist>
EOF

        launchctl load "$PLIST_FILE"
        print_success "Launchd service created and loaded"
    fi
}

# Function to create start script
create_start_script() {
    print_status "Creating start script..."
    cat > "$PROJECT_DIR/deployment/start-server.sh" <<EOF
#!/bin/bash
echo "🚀 Starting SUPER CENTAUR..."
cd "$PROJECT_DIR"
npm run cli -- start --port $PORT
EOF
    chmod +x "$PROJECT_DIR/deployment/start-server.sh"
    print_success "Start script created"
}

# Function to create CLI script
create_cli_script() {
    print_status "Creating CLI script..."
    cat > "$PROJECT_DIR/deployment/open-cli.sh" <<EOF
#!/bin/bash
echo "💻 Opening SUPER CENTAUR CLI..."
cd "$PROJECT_DIR"
npm run cli
EOF
    chmod +x "$PROJECT_DIR/deployment/open-cli.sh"
    print_success "CLI script created"
}

# Function to create uninstall script
create_uninstall_script() {
    print_status "Creating uninstall script..."
    cat > "$PROJECT_DIR/deployment/uninstall.sh" <<EOF
#!/bin/bash
echo "🗑️  Uninstalling SUPER CENTAUR..."

if [[ "\$OSTYPE" == "linux-gnu"* ]]; then
    sudo systemctl stop super-centaur 2>/dev/null || true
    sudo systemctl disable super-centaur 2>/dev/null || true
    sudo rm -f /etc/systemd/system/super-centaur.service
    sudo systemctl daemon-reload
elif [[ "\$OSTYPE" == "darwin"* ]]; then
    launchctl unload ~/Library/LaunchAgents/com.supercentaur.service.plist 2>/dev/null || true
    rm -f ~/Library/LaunchAgents/com.supercentaur.service.plist
fi

echo "✅ Service removed"
echo "💜 SUPER CENTAUR has been uninstalled"
EOF
    chmod +x "$PROJECT_DIR/deployment/uninstall.sh"
    print_success "Uninstall script created"
}

# Function to create configuration
create_config() {
    print_status "Creating configuration..."
    mkdir -p "$PROJECT_DIR/config"
    
    if [[ ! -f "$PROJECT_DIR/config/super-centaur.config.json" ]]; then
        cat > "$PROJECT_DIR/config/super-centaur.config.json" <<EOF
{
  "server": {
    "port": $PORT,
    "host": "localhost",
    "cors": {
      "origin": "*",
      "credentials": true
    },
    "rateLimit": {
      "windowMs": 900000,
      "max": 100
    }
  },
  "database": {
    "type": "sqlite",
    "path": "./data/super-centaur.db"
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": ""
  },
  "legal": {
    "jurisdiction": "US",
    "documentTypes": ["contract", "motion", "complaint", "agreement"],
    "emergencyResponse": true
  },
  "medical": {
    "enableDocumentation": true,
    "enableExpertWitness": true,
    "conditions": ["hypoparathyroidism", "intellectual-gaps", "generational-trauma"]
  },
  "blockchain": {
    "provider": "infura",
    "network": "testnet",
    "wallet": {
      "privateKey": "",
      "mnemonic": ""
    },
    "contracts": {
      "legalFramework": "",
      "identity": "",
      "governance": ""
    }
  },
  "frontend": {
    "buildDir": "./dist",
    "port": 3003
  }
}
EOF
        print_success "Configuration created"
    else
        print_warning "Configuration already exists"
    fi
}

# Function to create logs directory
create_logs_dir() {
    mkdir -p "$PROJECT_DIR/logs"
}

# Function to show success message
show_success() {
    echo
    print_success "🎉 SUPER CENTAUR Deployment Complete!"
    echo
    echo -e "${CYAN}📍 Server will be available at: http://localhost:$PORT${NC}"
    echo -e "${CYAN}📍 Frontend will be available at: http://localhost:3003${NC}"
    echo
    echo -e "${YELLOW}💻 Use the following commands to:${NC}"
    echo -e "   • Start server: $PROJECT_DIR/deployment/start-server.sh"
    echo -e "   • Open CLI: $PROJECT_DIR/deployment/open-cli.sh"
    echo
    echo -e "${YELLOW}🗑️  To uninstall, run: $PROJECT_DIR/deployment/uninstall.sh${NC}"
    echo
    echo -e "${PURPLE}💜 With love and light - As above, so below${NC}"
    echo
}

# Main deployment process
main() {
    print_header
    
    # Set variables
    PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
    PORT=3002
    
    print_status "🚀 Starting SUPER CENTAUR deployment..."
    print_status "Project directory: $PROJECT_DIR"
    print_status "Port: $PORT"
    
    # Check if running as root (not recommended)
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root is not recommended. Consider running as a regular user."
    fi
    
    # Check prerequisites
    if ! command_exists node; then
        print_warning "Node.js not found. Installing..."
        install_node
    else
        print_success "Node.js is installed"
    fi
    
    if ! command_exists npm; then
        print_error "npm is required but not found"
        exit 1
    else
        print_success "npm is installed"
    fi
    
    # Create necessary directories
    mkdir -p "$PROJECT_DIR/deployment/icons"
    create_logs_dir
    
    # Create configuration and scripts
    create_config
    create_start_script
    create_cli_script
    create_uninstall_script
    
    # Install and build
    install_dependencies
    build_project
    
    # Setup service based on OS
    create_systemd_service
    create_launchd_service
    
    # Show success message
    show_success
}

# Run main function
main "$@"