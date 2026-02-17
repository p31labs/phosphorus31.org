# P31 Scripts

Utility scripts for the P31 ecosystem.

## Development Scripts

### `dev.sh` / `dev.ps1`
Start all P31 components in development mode.

```bash
# Linux/Mac
./scripts/dev.sh

# With The Buffer
./scripts/dev.sh --with-buffer

# Windows PowerShell
./scripts/dev.ps1
./scripts/dev.ps1 --with-buffer
```

### `setup.sh`
Complete setup for P31 development environment.

```bash
./scripts/setup.sh
```

Installs all dependencies for:
- Root workspace
- The Centaur (SUPER-CENTAUR)
- The Scope (ui)
- The Buffer (cognitive-shield)

### `build.sh`
Build all P31 components for production.

```bash
./scripts/build.sh
```

## System Management Scripts

- `start_citadel.sh` - Start the Citadel system
- `setup_companions.sh` - Setup companion services
- `verify_deployment.sh` - Verify deployment status
- `verify_sovereignty.sh` - Verify sovereignty configuration

## Monitoring & Maintenance

- `auto_discovery.py` - Auto-discovery of system components
- `predictive_maintenance.py` - Predictive maintenance checks
- `self_healing_docs.py` - Self-healing documentation system
- `test_firmware_logs.py` - Test firmware logging

## Orchestration

- `sovereign_orchestrator.py` - Sovereign system orchestration

## Usage

### Start Citadel

```bash
./scripts/start_citadel.sh
```

### Setup Companions

```bash
./scripts/setup_companions.sh
```

### Verify Deployment

```bash
./scripts/verify_deployment.sh
```

### Verify Sovereignty

```bash
./scripts/verify_sovereignty.sh
```

## Python Scripts

Python scripts require Python 3.8+:

```bash
# Auto-discovery
python scripts/auto_discovery.py

# Predictive maintenance
python scripts/predictive_maintenance.py

# Self-healing docs
python scripts/self_healing_docs.py

# Test firmware logs
python scripts/test_firmware_logs.py

# Sovereign orchestrator
python scripts/sovereign_orchestrator.py
```

## Script Organization

Scripts are organized by function:
- **System Management**: Startup, setup, verification
- **Monitoring**: Health checks, maintenance
- **Orchestration**: System coordination

## Adding New Scripts

When adding new scripts:

1. Place in appropriate category directory
2. Add documentation to this README
3. Include usage examples
4. Add error handling
5. Follow P31 naming conventions

## Documentation

- [Development Guide](../docs/development.md)
- [Setup Guide](../docs/setup.md)
- [Quick Reference](../docs/quick-reference.md)
