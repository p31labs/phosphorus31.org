# The Centaur Setup Guide

Complete setup guide for The Centaur backend system.

## Prerequisites

- Node.js 18.0.0+
- PostgreSQL or SQLite
- Redis (for caching)
- Neo4j (for knowledge graph, optional)

## Installation

```bash
cd SUPER-CENTAUR
npm install
```

## Configuration

### 1. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/centaur
# Or for SQLite:
# DATABASE_URL=sqlite:./centaur.db

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j (optional)
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password

# API Keys
OPENAI_API_KEY=your-openai-key
# Add other AI provider keys as needed

# Server
PORT=3000
NODE_ENV=development
```

### 2. Database Setup

Initialize the database:

```bash
npm run db:init
npm run db:migrate
npm run db:seed  # Optional: seed with sample data
```

## Running

### Development Mode

```bash
npm run dev
```

This starts the development server with hot reload.

### Production Mode

```bash
npm run build
npm start
```

### Individual Services

You can run individual services:

```bash
npm run start:main        # Main server
npm run start:quantum     # Quantum brain
npm run start:legal        # Legal services
npm run start:medical     # Medical services
npm run start:blockchain   # Blockchain services
npm run start:family       # Family support
npm run start:all         # All services
```

## Verification

### Health Check

```bash
curl http://localhost:3000/health
```

### API Test

```bash
curl http://localhost:3000/api/v1/status
```

## Docker Setup (Alternative)

```bash
cd deployment/docker
docker-compose up -d
```

## Troubleshooting

### Database Connection Issues

- Verify database is running
- Check DATABASE_URL in .env
- Ensure database user has proper permissions

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL in .env

### Port Already in Use

Change PORT in .env or stop the process using the port.

## Next Steps

- [The Centaur Documentation](../docs/centaur.md)
- [Development Guide](../docs/development.md)
- [API Documentation](../docs/api/)
