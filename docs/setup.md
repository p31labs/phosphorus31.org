# P31 Setup Guide

Complete installation and configuration guide for the P31 ecosystem.

## Prerequisites

### Required
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Optional (for full stack)
- **Docker** and **Docker Compose** (for backend services)
- **ESP-IDF** v5.0+ (for Node One firmware)
- **PostgreSQL** or **SQLite** (for The Centaur)
- **Redis** (for The Buffer message queue)
- **Neo4j** (for The Centaur knowledge graph)

## Installation Sequence

### 1. Clone Repository

```bash
git clone <repository-url>
cd phenix-navigator-creator67
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. The Centaur (Backend)

```bash
cd SUPER-CENTAUR
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:init

# Start development server
npm run dev
```

See [SUPER-CENTAUR/setup.md](../SUPER-CENTAUR/setup.md) for detailed setup.

### 4. The Scope (Frontend)

```bash
cd ui
npm install

# Start development server
npm run dev
```

The Scope will be available at `http://localhost:5173`

See [ui/setup.md](../ui/setup.md) for detailed setup.

### 5. The Buffer (Communication Processing)

```bash
cd cognitive-shield
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Start service
npm run dev
```

See [cognitive-shield/setup.md](../cognitive-shield/setup.md) for detailed setup.

### 6. Node One (Hardware - Optional)

```bash
cd firmware

# Install ESP-IDF (if not already installed)
# See: https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/get-started/

# Build firmware
idf.py build

# Flash to device
idf.py flash

# Monitor output
idf.py monitor
```

See [firmware/setup.md](../firmware/setup.md) for detailed setup.

### 7. Sovereign Life OS (Optional)

See [sovereign-life-os documentation](sovereign-life-os.md) for self-hosted services setup.

## Environment Configuration

### The Centaur Environment Variables

```bash
# .env file in SUPER-CENTAUR/
DATABASE_URL=postgresql://user:pass@localhost:5432/centaur
REDIS_URL=redis://localhost:6379
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
OPENAI_API_KEY=your-key-here
PORT=3000
```

### The Buffer Environment Variables

```bash
# .env file in cognitive-shield/
REDIS_URL=redis://localhost:6379
DATABASE_URL=sqlite:./buffer.db
BUFFER_WINDOW_MS=60000
```

## Verification Steps

### 1. Verify The Centaur

```bash
cd SUPER-CENTAUR
npm run test
curl http://localhost:3000/health
```

### 2. Verify The Scope

Open `http://localhost:5173` in browser. You should see The Scope dashboard.

### 3. Verify The Buffer

```bash
cd cognitive-shield
npm run test
```

### 4. Verify Node One (if hardware available)

Check serial monitor output for:
- Boot messages
- Network connection
- Whale Channel initialization

## Common Issues

See [troubleshooting.md](troubleshooting.md) for common setup issues and solutions.

## Next Steps

- [Development Guide](development.md) - Start developing
- [Architecture](architecture.md) - Understand the system
- [Quick Reference](quick-reference.md) - Common commands

## Component-Specific Setup

- [The Centaur Setup](../SUPER-CENTAUR/setup.md)
- [The Scope Setup](../ui/setup.md)
- [The Buffer Setup](../cognitive-shield/setup.md)
- [Node One Setup](../firmware/setup.md)
