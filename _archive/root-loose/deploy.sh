#!/bin/bash

# PHENIX SYSTEM DEPLOYMENT SCRIPT
# Phase 2 Infrastructure Upgrade - Production Ready

echo "🦅 PHENIX SYSTEM DEPLOYMENT - PHASE 2"
echo "====================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env file not found. Please create .env with DB_PASSWORD variable."
    exit 1
fi

# Load environment variables
source .env

echo "🔧 Environment loaded:"
echo "   DB_PASSWORD: ${DB_PASSWORD}"
echo ""

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p phenix_data/{db,init,elasticsearch,prometheus,grafana}
mkdir -p backups
mkdir -p logs/{trades,toxins}
mkdir -p dashboard

echo "✅ Directories created"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down -v 2>/dev/null || true

# Build and start core services
echo "🏗️ Building and starting core services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 30

# Start monitoring services
echo "📊 Starting monitoring services..."
docker-compose -f docker-compose.monitoring.yml up -d

# Start backup services
echo "💾 Starting backup services..."
docker-compose -f docker-compose.backup.yml up -d

# Check service status
echo ""
echo "🔍 Service Status Check:"
echo "========================"

services=("phenix_redis" "phenix_db" "phenix_bridge" "phenix_shield" "phenix_engine" "phenix_hud")
for service in "${services[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "$service"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
    fi
done

echo ""
echo "🌐 Access Points:"
echo "=================="
echo "   Dashboard: http://localhost:8501"
echo "   Kibana: http://localhost:5601"
echo "   Grafana: http://localhost:3000 (admin/admin)"
echo "   Prometheus: http://localhost:9090"
echo "   Elasticsearch: http://localhost:9200"
echo ""

echo "🎉 PHENIX SYSTEM DEPLOYMENT COMPLETE!"
echo "   Your Digital Centaur is now operational with:"
echo "   • Redis Pub/Sub messaging"
echo "   • PostgreSQL persistent storage"
echo "   • Streamlit dashboard"
echo "   • ELK monitoring stack"
echo "   • Automated backup system"
echo ""
echo "   Next steps:"
echo "   1. Access the dashboard at http://localhost:8501"
echo "   2. Configure Grafana dashboards"
echo "   3. Set up alerting rules in Prometheus"
echo "   4. Monitor logs in Kibana"