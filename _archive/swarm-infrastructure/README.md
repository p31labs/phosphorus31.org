# Swarm Intelligence Infrastructure

This directory contains the complete infrastructure setup for deploying the cloud-native Swarm Intelligence platform on Google Cloud Platform (GCP).

## Overview

The infrastructure implements a serverless, scalable architecture that transforms the local Swarm Intelligence system into a production-ready SaaS platform while maintaining the core "Delta" topology principles of sovereignty and resilience.

## Architecture Components

### 1. Docker Containers
- **Swarm Orchestrator**: Main orchestration service that manages agent workflows
- **Cognitive Shield**: Email processing and emotional sanitization service
- **Project Analyzer**: File analysis and project intelligence service

### 2. Terraform Infrastructure
- **Cloud Run**: Serverless container hosting with auto-scaling
- **Cloud SQL**: Managed PostgreSQL with pgvector for semantic search
- **Cloud Storage**: Object storage for file processing and backups
- **Cloud Pub/Sub**: Event-driven messaging for agent coordination
- **Cloud Memorystore**: Redis caching for high-speed state sharing
- **Cloud IAM**: Identity and access management with hardware-backed authentication

### 3. CI/CD Pipeline
- **GitHub Actions**: Automated build, test, and deployment pipeline
- **Docker Registry**: Container image storage and management
- **Infrastructure as Code**: Terraform-based infrastructure deployment

### 4. API Specifications
- **OpenAPI 3.0**: Complete API specification for all services
- **Authentication**: JWT-based authentication with hardware device verification
- **Security**: Bearer token authentication with scoped access

## Quick Start

### Prerequisites
- Google Cloud SDK installed and authenticated
- Terraform installed
- Docker installed
- GitHub repository with secrets configured

### 1. Configure Environment
```bash
# Set your GCP project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Configure Google Cloud
gcloud config set project $PROJECT_ID
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  pubsub.googleapis.com \
  redis.googleapis.com \
  cloudbuild.googleapis.com
```

### 2. Deploy Infrastructure
```bash
cd terraform
terraform init
terraform plan -var="project_id=$PROJECT_ID"
terraform apply -var="project_id=$PROJECT_ID"
```

### 3. Build and Deploy Services
```bash
# Build and push Docker images
docker build -t gcr.io/$PROJECT_ID/swarm-orchestrator:latest -f docker/Dockerfile.swarm-orchestrator .
docker push gcr.io/$PROJECT_ID/swarm-orchestrator:latest

# Deploy to Cloud Run
gcloud run deploy swarm-orchestrator \
  --image gcr.io/$PROJECT_ID/swarm-orchestrator:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated
```

### 4. Configure GitHub Actions
Set up the following secrets in your GitHub repository:
- `GCP_PROJECT`: Your GCP project ID
- `GCP_SA_EMAIL`: Service account email for deployment
- `WORKLOAD_IDENTITY_PROVIDER`: Workload identity provider for authentication

## Security Features

### Hardware-Backed Authentication
- **ATECC608A Integration**: Hardware cryptographic co-processor for secure key storage
- **JWT Authentication**: Hardware-signed JWTs for device authentication
- **Zero-Trust Architecture**: Context-aware access with hardware binding

### Data Sovereignty
- **Local-First Design**: PGLite for local data storage and processing
- **ElectricSQL Sync**: Conflict-free replication with cloud synchronization
- **Encryption**: Customer-managed encryption keys (CMEK) for sensitive data

### Network Security
- **VPC Configuration**: Private networks with controlled access
- **Firewall Rules**: Restrictive firewall policies for service isolation
- **TLS Encryption**: End-to-end encryption for all communications

## Monitoring and Observability

### Logging
- **Structured Logging**: JSON-formatted logs with consistent schema
- **Cloud Logging**: Centralized log aggregation and analysis
- **Error Tracking**: Automatic error detection and alerting

### Metrics
- **Custom Metrics**: Application-specific performance metrics
- **Cloud Monitoring**: Real-time monitoring and alerting
- **Dashboards**: Pre-configured dashboards for key performance indicators

### Tracing
- **Distributed Tracing**: End-to-end request tracing across services
- **Performance Analysis**: Latency and throughput analysis
- **Debugging**: Detailed request flow visualization

## Scaling and Performance

### Auto-Scaling
- **Cloud Run**: Automatic scaling from zero to handle traffic spikes
- **Database Scaling**: Cloud SQL read replicas for high query loads
- **Cache Optimization**: Redis caching for frequently accessed data

### Cost Optimization
- **Scale-to-Zero**: Pay only for actual usage with serverless architecture
- **Resource Limits**: Configurable resource limits to control costs
- **Monitoring**: Cost tracking and optimization recommendations

## Development Workflow

### Local Development
```bash
# Run services locally with Docker Compose
docker-compose up -d

# Test API endpoints
curl http://localhost:8080/health

# Run integration tests
npm run test:integration
```

### Deployment Pipeline
1. **Code Changes**: Push to `main` or `develop` branch
2. **Build**: Automated Docker image building and testing
3. **Deploy**: Infrastructure and service deployment
4. **Verify**: Integration tests and health checks
5. **Monitor**: Continuous monitoring and alerting

## Troubleshooting

### Common Issues
- **Authentication Errors**: Verify JWT tokens and hardware device registration
- **Database Connection**: Check Cloud SQL instance status and connection strings
- **Service Scaling**: Monitor Cloud Run instance counts and resource usage

### Debug Commands
```bash
# Check service status
gcloud run services list

# View logs
gcloud logging read "resource.type=cloud_run_revision"

# Test database connection
gcloud sql connect [INSTANCE_NAME] --user=postgres
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the established patterns
4. Add tests for new functionality
5. Submit a pull request

## License

This infrastructure is part of the Swarm Intelligence project and follows the same licensing terms.

## Support

For support and questions:
- Check the [documentation](../swarm/README.md)
- Review the [architecture documents](../SWARM_INTELLIGENCE_CLOUD_TRANSFORMATION_PLAN.md)
- Submit issues to the project repository

## Next Steps

After deploying the infrastructure:
1. Configure your Phenix Navigator hardware devices
2. Set up user authentication and authorization
3. Configure Google Workspace integrations
4. Monitor system performance and optimize as needed
5. Scale services based on usage patterns