# PHENIX SYSTEM - PHASE 2 INFRASTRUCTURE

## 🦅 Digital Centaur: Production-Grade Deployment

This repository contains the complete Phase 2 implementation of the Phenix System, transforming it from a prototype to a production-ready platform with hardened infrastructure.

## 🏗️ Architecture Overview

### Core Services
- **Redis** - High-speed message broker for sub-millisecond Pub/Sub
- **PostgreSQL** - Persistent storage for metrics, logs, and portfolio data
- **Bridge** - Data ingestion from Signal/Telegram
- **Shield** - Cognitive filtering with Rust-based toxin detection
- **Engine** - Tetrahedron rebalancing logic
- **Dashboard** - Streamlit-based monitoring interface

### Infrastructure Services
- **ELK Stack** - Elasticsearch, Kibana, and Filebeat for log aggregation
- **Prometheus/Grafana** - Metrics monitoring and visualization
- **Backup System** - Automated database and configuration backups

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development)

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database password
echo "DB_PASSWORD=your_secure_password" >> .env
```

### 2. Deploy System
```bash
# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

### 3. Access Services
- **Dashboard**: http://localhost:8501
- **Grafana**: http://localhost:3000 (admin/admin)
- **Kibana**: http://localhost:5601
- **Prometheus**: http://localhost:9090

## 📁 Project Structure

```
phenix_system/
├── docker-compose.yml              # Core services
├── docker-compose.monitoring.yml   # ELK + Prometheus/Grafana
├── docker-compose.backup.yml       # Backup services
├── deploy.sh                       # Deployment script
├── phenix_data/                    # Persistent data volumes
│   ├── db/                         # PostgreSQL data
│   ├── init/                       # Database schema
│   ├── elasticsearch/              # ES data
│   ├── prometheus/                 # Prometheus data
│   └── grafana/                    # Grafana data
├── dashboard/                      # Streamlit application
│   ├── app.py                      # Dashboard code
│   └── requirements.txt            # Dependencies
├── backups/                        # Automated backups
├── logs/                           # Application logs
├── config/                         # Configuration files
└── src/                            # Rust source code
```

## 🔧 Service Configuration

### Core Services
Each service has its own Dockerfile and configuration:

- **Bridge** (`Dockerfile.bridge`) - Ingests data from Signal/Telegram
- **Shield** (`Dockerfile.shield`) - Filters content using Rust library
- **Engine** (`Dockerfile.engine`) - Executes rebalancing logic
- **Dashboard** (`Dockerfile.dashboard`) - Streamlit web interface

### Database Schema
The PostgreSQL database includes four core tables:

1. **system_metrics** - Cognitive integrity scores over time
2. **toxin_logs** - Immune system audit trail
3. **portfolio_snapshots** - Tetrahedron geometry tracking
4. **trade_history** - Execution order history

## 📊 Monitoring & Observability

### Dashboard Features
- Real-time cognitive integrity metrics
- Tetrahedron stance visualization (radar chart)
- Integrity trend analysis
- Toxin interception audit logs

### Monitoring Stack
- **Elasticsearch** - Log storage and indexing
- **Kibana** - Log visualization and search
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization and alerting

### Backup Strategy
- **Database**: Hourly automated backups
- **Logs**: Daily compression and rotation
- **Configuration**: Bi-daily configuration snapshots

## 🛡️ Security Considerations

### Network Isolation
- All services run on private `centaur_net` network
- External access only through designated ports
- Database not exposed to external networks

### Data Protection
- Database credentials stored in environment variables
- Backup encryption recommended for production
- Log rotation prevents disk space issues

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check if database is running
   docker-compose ps | grep phenix_db
   
   # Check database logs
   docker-compose logs phenix_db
   ```

2. **Redis Connection Issues**
   ```bash
   # Test Redis connection
   docker exec -it phenix_redis redis-cli ping
   ```

3. **Dashboard Not Loading**
   ```bash
   # Check dashboard logs
   docker-compose logs phenix_hud
   
   # Verify database connection
   docker-compose exec phenix_hud python -c "import psycopg2; print('DB OK')"
   ```

### Log Locations
- **Application logs**: `./logs/`
- **Docker logs**: `docker-compose logs [service]`
- **System metrics**: Grafana/Prometheus
- **Error logs**: Kibana/Elasticsearch

## 🚀 Production Deployment

### Environment Variables
```bash
# Required
DB_PASSWORD=your_secure_password

# Optional
REDIS_HOST=phenix_redis
DB_HOST=phenix_db
EXECUTION_MODE=LOG_ONLY  # Change to LIVE_RPC for production
```

### Scaling Considerations
- Redis can be scaled horizontally with clustering
- PostgreSQL supports read replicas for high availability
- Dashboard can be load-balanced behind nginx
- Monitoring stack supports distributed deployment

## 📈 Performance Tuning

### Database Optimization
- Indexes on timestamp columns for dashboard queries
- Connection pooling for high-throughput scenarios
- Regular vacuum operations for table maintenance

### Redis Optimization
- Memory allocation based on message volume
- Persistence configuration for durability
- Cluster setup for high availability

## 🔄 Development Workflow

### Local Development
1. Modify source code
2. Rebuild specific service: `docker-compose build [service]`
3. Restart service: `docker-compose restart [service]`
4. Monitor changes in dashboard

### Testing
- Unit tests for Rust components
- Integration tests for Python services
- End-to-end tests for complete workflow

## 📞 Support

For issues, questions, or contributions:

1. Check the troubleshooting section
2. Review service logs
3. Create an issue with detailed error information
4. Include system specifications and reproduction steps

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🦅 PHENIX SYSTEM - SOVEREIGN INTELLIGENCE PLATFORM**