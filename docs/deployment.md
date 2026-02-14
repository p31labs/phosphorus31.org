# P31 Deployment Guide

Complete guide for deploying the P31 ecosystem to production.

## Overview

P31 can be deployed in multiple configurations:
- **Local Development** - All components on localhost
- **Self-Hosted** - Deploy to your own infrastructure
- **Hybrid** - Mix of local and cloud services
- **Sovereign** - Fully local, no cloud dependencies

## Prerequisites

### Required
- Node.js 18.0.0+
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL or SQLite (for The Centaur)
- Redis (for The Buffer message queue)

### Optional
- Neo4j (for knowledge graph)
- Nginx (for reverse proxy)
- SSL certificates (for HTTPS)

## Deployment Configurations

### Local Development

```bash
# Setup
npm run setup

# Start all services
npm run dev:all
```

### Production Build

```bash
# Build all components
npm run build

# Or use the build script
./scripts/build.sh
```

Build outputs:
- The Centaur: `SUPER-CENTAUR/dist/`
- The Scope: `ui/dist/`
- The Buffer: `cognitive-shield/dist/`

## Docker Deployment

### Docker Compose

P31 includes Docker Compose configuration for easy deployment:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

#### The Centaur

```dockerfile
# Dockerfile.bridge
FROM node:18-alpine
WORKDIR /app
COPY SUPER-CENTAUR/package*.json ./
RUN npm install
COPY SUPER-CENTAUR/ .
RUN npm run build
CMD ["npm", "start"]
```

#### The Scope

```dockerfile
# Dockerfile.dashboard
FROM node:18-alpine AS builder
WORKDIR /app
COPY ui/package*.json ./
RUN npm install
COPY ui/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

#### The Buffer

```dockerfile
# Dockerfile.shield
FROM node:18-alpine
WORKDIR /app
COPY cognitive-shield/package*.json ./
RUN npm install
COPY cognitive-shield/ .
RUN npm run build
CMD ["npm", "start"]
```

## Environment Configuration

### Production Environment Variables

See [Environment Variables Reference](../config/env-reference.md) for complete list.

#### The Centaur

```bash
DATABASE_URL=postgresql://user:pass@db:5432/centaur
REDIS_URL=redis://redis:6379
NEO4J_URL=bolt://neo4j:7687
NODE_ENV=production
PORT=3000
```

#### The Buffer

```bash
REDIS_URL=redis://redis:6379
DATABASE_URL=sqlite:./buffer.db
BUFFER_WINDOW_MS=60000
NODE_ENV=production
PORT=4000
```

## Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name p31.example.com;

    # The Scope (frontend)
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # The Centaur API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # The Buffer API
    location /buffer {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d p31.example.com
```

### Self-Signed Certificate (Development)

```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout key.pem -out cert.pem -days 365
```

## Database Setup

### PostgreSQL

```bash
# Create database
createdb centaur

# Run migrations
cd SUPER-CENTAUR
npm run db:migrate

# Seed data (optional)
npm run db:seed
```

### SQLite

SQLite databases are created automatically on first run.

## Monitoring

### Health Checks

```bash
# The Centaur
curl http://localhost:3000/health

# The Buffer
curl http://localhost:4000/health
```

### Logging

Logs are stored in:
- The Centaur: `SUPER-CENTAUR/logs/`
- The Buffer: Console output
- Docker: `docker-compose logs`

## Backup

### Database Backup

```bash
# PostgreSQL
pg_dump centaur > backup.sql

# SQLite
cp buffer.db backup.db
```

### Configuration Backup

```bash
# Backup environment files
tar -czf config-backup.tar.gz .env* config/
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **SSL/TLS**: Always use HTTPS in production
3. **Authentication**: Enable MFA for all users
4. **Rate Limiting**: Configure appropriate limits
5. **Firewall**: Restrict access to necessary ports only
6. **Updates**: Keep dependencies updated

## Scaling

### Horizontal Scaling

- **The Centaur**: Use load balancer with multiple instances
- **The Buffer**: Use Redis cluster for message queue
- **Database**: Use read replicas for PostgreSQL

### Vertical Scaling

- Increase Node.js memory limits
- Optimize database queries
- Use caching strategies

## Troubleshooting

### Service Won't Start

1. Check environment variables
2. Verify database connection
3. Check port availability
4. Review logs for errors

### Performance Issues

1. Check database query performance
2. Verify Redis caching
3. Monitor memory usage
4. Profile with performance tools

## Documentation

- [Setup Guide](setup.md)
- [Development Guide](development.md)
- [Architecture](architecture.md)
- [Troubleshooting](troubleshooting.md)

## The Mesh Holds 🔺

Deploy with confidence. The architecture is designed for resilience and sovereignty.
