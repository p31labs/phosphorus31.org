# Sovereign Life OS

Self-hosted services stack - 72 open-source tools replacing $4,000-7,000+/yr in SaaS subscriptions.

## Overview

Sovereign Life OS is a comprehensive self-hosted services stack running on hardware you own. It provides alternatives to commercial SaaS services with full data sovereignty.

## Architecture

Sovereign Life OS includes 72 services across categories:
- Health & Medical Tracking
- Finance & Budgeting
- Legal & Documents
- Education & Knowledge
- Tasks & Projects
- Communication
- Food & Home
- Mental Health
- Smart Home
- Data Sovereignty
- Family Coordination
- Assistive Technology
- Creative & Media
- Emergency Preparedness
- Infrastructure

## Setup

See [sovereign-life-os](../sovereign-life-os) for complete setup instructions.

### Quick Start

```bash
cd sovereign-life-os/sovereign-life-os
# Deploy core services
cd 10-data/vaultwarden && docker compose up -d
cd 10-data/pihole && docker compose up -d
cd 10-data/nextcloud && docker compose up -d
```

## Integration

Sovereign Life OS integrates with:
- **The Centaur**: Backend services
- **The Scope**: Dashboard integration
- **The Buffer**: Message processing
- **Node One**: Hardware device

## Documentation

- [Sovereign Life OS Repository](../sovereign-life-os/sovereign-life-os/README.md)
- [Setup Guide](../sovereign-life-os/sovereign-life-os/README.md#deployment-roadmap)
