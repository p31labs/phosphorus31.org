# P31 Quick Reference

Common commands and shortcuts for the P31 ecosystem.

## Development Commands

### The Centaur (Backend)

```bash
cd SUPER-CENTAUR

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:init          # Initialize database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data

# Services
npm run start:quantum    # Quantum brain
npm run start:legal      # Legal services
npm run start:medical   # Medical services
npm run start:all       # All services

# Testing
npm test                 # Run tests
npm run lint             # Lint code
```

### The Scope (Frontend)

```bash
cd ui

# Development
npm run dev              # Start dev server (port 5173)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests
npm run lint             # Lint code
```

### The Buffer

```bash
cd cognitive-shield

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run tests
```

### Node One (Hardware)

```bash
cd firmware

# Build and flash
idf.py build             # Build firmware
idf.py flash             # Flash to device
idf.py monitor           # Monitor serial output

# Configuration
idf.py menuconfig        # Configure build options
idf.py clean             # Clean build
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

## Git Commands

```bash
# Status
git status

# Commit
git add .
git commit -m "message"

# Push
git push origin branch-name

# Pull
git pull origin branch-name
```

## Health Checks

```bash
# The Centaur
curl http://localhost:3000/health

# The Buffer
curl http://localhost:4000/health

# Redis
redis-cli ping

# Database (PostgreSQL)
psql -U user -d centaur -c "SELECT 1"
```

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| The Centaur | 3000 | http://localhost:3000 |
| The Scope | 5173 | http://localhost:5173 |
| The Buffer | 4000 | http://localhost:4000 |
| Redis | 6379 | redis://localhost:6379 |
| PostgreSQL | 5432 | postgresql://localhost:5432 |
| Neo4j | 7687 | bolt://localhost:7687 |

## Environment Variables

### The Centaur

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEO4J_URL=bolt://...
OPENAI_API_KEY=...
PORT=3000
```

### The Buffer

```bash
REDIS_URL=redis://...
DATABASE_URL=sqlite:./buffer.db
BUFFER_WINDOW_MS=60000
```

## Common Tasks

### Start Full Stack

```bash
# Terminal 1
cd SUPER-CENTAUR && npm run dev

# Terminal 2
cd ui && npm run dev

# Terminal 3
cd cognitive-shield && npm run dev
```

### Run All Tests

```bash
npm run test --workspaces
```

### Clean Build

```bash
# The Centaur
cd SUPER-CENTAUR && rm -rf dist node_modules && npm install

# The Scope
cd ui && rm -rf dist node_modules && npm install
```

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Clear Cache

```bash
# npm
npm cache clean --force

# Redis
redis-cli FLUSHALL
```

## Documentation

- [Setup Guide](setup.md)
- [Development Guide](development.md)
- [Architecture](architecture.md)
- [Troubleshooting](troubleshooting.md)
