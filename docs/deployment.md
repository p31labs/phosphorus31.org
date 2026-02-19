# P31 Launch Guide

Complete guide for launching the P31 ecosystem to production.

## Overview

P31 can be launched in multiple configurations:
- **Local Development** - All components on localhost
- **Self-Hosted** - Launch to your own infrastructure
- **Hybrid** - Mix of local and cloud services
- **Sovereign** - Fully local, no cloud dependencies

## Prerequisites

### Required
- Node.js 18.0.0+
- Docker and Docker Compose (for containerized hosting)
- PostgreSQL or SQLite (for P31 Tandem)
- Redis (for P31 Buffer message queue)

### Optional
- Neo4j (for knowledge graph)
- Nginx (for reverse proxy)
- SSL certificates (for HTTPS)

## Launch Configurations

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
- P31 Tandem: `SUPER-CENTAUR/dist/`
- P31 Spectrum: `ui/dist/`
- P31 Buffer (P31 Shelter): `apps/shelter/dist/`

## Docker Launch (LAUNCH-06)

### Shelter + Redis (Buffer backend)

From repo root:

```bash
docker compose -f deploy/docker-compose.yml up -d
```

- **Shelter API:** http://localhost:4000 (health: `/health`)
- **Redis:** localhost:6379 (for message queue)
- **Data:** Persisted in Docker volume `shelter-data` (accommodation log DB and backups)

To build the Shelter image only: `docker compose -f deploy/docker-compose.yml build shelter`

### Full stack (legacy)

P31 also has Docker Compose for full-stack; use the compose file that matches your setup.

### Individual Services

#### P31 Tandem

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

#### P31 Spectrum

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

#### P31 Buffer (P31 Shelter)

See **`apps/shelter/Dockerfile`**. Build from `apps/shelter`:

```bash
cd apps/shelter && docker build -t p31-shelter .
docker run -p 4000:4000 -e REDIS_URL=redis://host.docker.internal:6379 p31-shelter
```

## Environment Configuration

### Production Environment Variables

See [Environment Variables Reference](../config/env-reference.md) for complete list.

#### P31 Tandem

```bash
DATABASE_URL=postgresql://user:pass@db:5432/centaur
REDIS_URL=redis://redis:6379
NEO4J_URL=bolt://neo4j:7687
NODE_ENV=production
PORT=3000
```

#### P31 Buffer

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

    # P31 Spectrum (frontend)
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # P31 Tandem API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # P31 Buffer API
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
# P31 Tandem
curl http://localhost:3000/health

# P31 Buffer
curl http://localhost:4000/health
```

### Logging

Logs are stored in:
- P31 Tandem: `SUPER-CENTAUR/logs/`
- P31 Buffer: Console output
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

- **P31 Tandem**: Use load balancer with multiple instances
- **P31 Buffer**: Use Redis cluster for message queue
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

## Cloudflare Pages (phosphorus31.org)

The public site is launched to **Cloudflare Pages**. Each push to `main` (after CI) runs the P31 Launch workflow and launches `apps/web` to the project **phosphorus31-org**.

- **Dashboard:** [Cloudflare Pages → phosphorus31 → Domains](https://dash.cloudflare.com/ee05f70c889cb6f876b9925257e3a2fa/pages/view/phosphorus31/domains)
- **Required secret:** `CLOUDFLARE_API_TOKEN` (Create API Token → Edit Cloudflare Workers → Account → Cloudflare Pages Edit)
- **Account ID:** `ee05f70c889cb6f876b9925257e3a2fa`

## Automated Git and Cloud Share

P31 uses GitHub Actions for automated build and optional sync to cloud storage (Google Drive, OneDrive, Dropbox, S3, etc.) on every push to `main` or when run manually.

### What runs automatically

| Trigger | Workflow | Result |
|--------|----------|--------|
| Push to `main` | P31 CI | Lint, typecheck, build, test, security checks |
| Push to `main` | P31 Launch | CI gate → website to Cloudflare Pages; Shelter placeholder |
| Push to `main` or Run workflow | P31 Cloud Share | Build → optional rclone sync to your cloud remote |

### Enabling cloud-share sync

1. **Create an rclone config** locally (one-time):
   ```bash
   rclone config
   ```
   Add a remote (e.g. `p31`) for your provider (Google Drive, OneDrive, Dropbox, etc.). See [rclone docs](https://rclone.org/docs/).

2. **Encode and add secret** in GitHub (Settings → Secrets and variables → Actions):
   - `RCLONE_CONFIG`: base64-encoded contents of `~/.config/rclone/rclone.conf`  
     ```bash
     # Linux
     cat ~/.config/rclone/rclone.conf | base64 -w0
     # macOS
     base64 -i ~/.config/rclone/rclone.conf | tr -d '\n'
     ```
     Paste the output as the secret value. (Use a remote that has no sensitive paths, or a dedicated service account.)

3. **Optional variables** (Settings → Secrets and variables → Actions → Variables):
   - `RCLONE_REMOTE`: remote name in your config (default: `p31`)
   - `RCLONE_REMOTE_PATH`: folder path on the remote (default: `P31/builds`)

4. **What gets synced**: Build outputs for Scope (ui), Shelter, and website, plus `docs/` and `README.md`. Each run updates:
   - `{remote}:{path}/{sha}` — versioned by commit
   - `{remote}:{path}/latest` — overwritten each run

If `RCLONE_CONFIG` is not set, the cloud-share job skips without failing.

### Release automation (tags)

- Pushing a version tag (e.g. `v1.0.0`) runs **P31 Release**: creates a GitHub Release and can trigger Zenodo archive when Zenodo is connected to the repo.

## Documentation

- [Setup Guide](setup.md)
- [Development Guide](development.md)
- [Architecture](architecture.md)
- [Troubleshooting](troubleshooting.md)

## The Mesh Holds 🔺

Launch with confidence. The architecture is designed for resilience and sovereignty.
