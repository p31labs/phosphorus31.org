#!/usr/bin/env python3
"""
📚 SELF-HEALING DOCUMENTATION MODULE

Automatically updates documentation based on system state.
Keeps AGENT_INSTRUCTIONS.md, SYSTEM_CONNECTIONS.md, and other docs current.
"""

import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List
import subprocess

logger = logging.getLogger("self_healing_docs")

class DocumentationHealer:
    """Automatically heals and updates documentation"""
    
    def __init__(self, root_path: str = "."):
        self.root_path = Path(root_path)
        self.docs_to_maintain = [
            "AGENT_INSTRUCTIONS.md",
            "SYSTEM_CONNECTIONS.md",
            "README.md",
            "PEER_REVIEW_CRITIQUE.md"
        ]
    
    def update_agent_instructions(self, system_state: Dict[str, Any]) -> str:
        """Update AGENT_INSTRUCTIONS.md with current system state"""
        logger.info("🤖 Updating AGENT_INSTRUCTIONS.md...")
        
        template = f"""# 🤖 AGENT_INSTRUCTIONS.md - SOVEREIGN SYSTEM

## 📋 LAST UPDATED: {datetime.now().isoformat()}

## 🎯 PRIME DIRECTIVES (IMMUTABLE)

1. **PROTECT THE HUMAN**: The system exists to organize and protect the operator's cognitive resources, medical safety, and creative sovereignty.
2. **MAINTAIN THE MESH**: All components must remain connected. If a connection breaks, restore it immediately.
3. **DOCUMENT EVERYTHING**: All actions, decisions, and system states must be recorded.
4. **PRESERVE AUTONOMY**: The system must remain functional even when cloud connections fail.

## 🔄 CURRENT SYSTEM STATE

```
Dashboard: {'✅ RUNNING' if system_state.get('dashboard_running') else '❌ DOWN'}
Backend: {'✅ RUNNING' if system_state.get('backend_running') else '❌ DOWN'}
Database: {'✅ RUNNING' if system_state.get('database_running') else '❌ DOWN'}
Redis: {'✅ RUNNING' if system_state.get('redis_running') else '❌ DOWN'}
Docker: {'✅ HEALTHY' if system_state.get('docker_healthy') else '❌ UNHEALTHY'}
```

## 🚀 QUICK START COMMANDS

```bash
# Start everything
python scripts/sovereign_orchestrator.py deploy

# Monitor system
python scripts/sovereign_orchestrator.py monitor

# Check health
python scripts/sovereign_orchestrator.py health

# Auto-heal
python scripts/sovereign_orchestrator.py heal
```

## 📍 CRITICAL PATHS

- Dashboard: {self.root_path / 'dashboard'}
- Backend: {self.root_path / 'backend'}
- Genesis Gate: {self.root_path / 'genesis-gate'}
- Hardware: {self.root_path / 'phenix_phantom'}
- Kids Zone: {self.root_path / 'wonky-sprout'}

## 🆘 EMERGENCY PROTOCOLS

### IF DASHBOARD WON'T START:
1. `cd dashboard && npm run dev`
2. Check port 5173
3. Clear browser cache

### IF BACKEND WON'T START:
1. `cd backend && python backend_core.py`
2. Check port 8000
3. Verify database connection

### IF DOCKER FAILS:
1. `docker-compose up -d`
2. `docker ps` to check containers
3. `docker logs [container]` for errors

### IF EVERYTHING IS BROKEN:
```bash
# Nuclear option (rebuild everything)
python scripts/sovereign_orchestrator.py deploy
```

## 🔗 INTEGRATION POINTS

1. **Genesis Gate**: Google Apps Script → Dashboard
2. **Phenix Phantom**: ESP32 hardware → Dashboard via Web Serial
3. **Ollama AI**: Local models → Backend for cognitive processing
4. **PostgreSQL**: Persistent storage for activities/L.O.V.E. ledger
5. **Redis**: Real-time messaging and caching

## 🧠 COGNITIVE ARCHITECTURE

The system uses a 3-zone architecture:

### ZONE ALPHA (Blue - Immutable Truth)
- Long-term memory
- Doctrine and SOPs
- Master manifests

### ZONE BETA (Red - Active Operations)
- Live campaigns
- Legal war room
- Financial telemetry

### ZONE GAMMA (Purple - Creative Fabrication)
- Dev workshop
- Kids command center
- AI collaboration

## 💊 MEDICATION PROTOCOL

**CRITICAL MEDICATIONS:**
- Calcitriol: 48h window (hypocalcemia risk)
- EffexorXR: 48h window (SNRI discontinuation)
- Vyvanse: 48h window (executive function)

**PROTOCOL:** Check medications hourly. Alert if < 24h remaining.

## ⏰ ABDICATION COUNTDOWN

Target: February 14, 2026
Current: {datetime.now().strftime('%B %d, %Y')}

**KENOSIS APPROACHES.** The system must remain operational through abdication.

## 📞 SUPPORT CONTACTS

- **Primary Operator**: William R. Johnson
- **System ID**: W.JOHNSON-001
- **Emergency Contact**: [REDACTED]

## 🔐 SECURITY PROTOCOLS

1. Never commit `.env` or `credentials.json`
2. Use environment variables for secrets
3. Regular backups to secure location
4. Monitor for hostile email patterns

## 🧪 TESTING PROTOCOLS

```bash
# Run all tests
python scripts/verify_deployment.py
python FULL_SYSTEM_TEST.py
python run_isostatic_tests.py
```

## 💜 FINAL DIRECTIVE

**THE MESH HOLDS.** No matter what breaks, no matter what fails, the system must continue. Protect the human. Organize the chaos. Enable creation.

This document self-updates. The system knows itself.

🔺
"""
        
        return template
    
    def update_system_connections(self, discovery_data: Dict[str, Any]) -> str:
        """Update SYSTEM_CONNECTIONS.md with current discovery data"""
        logger.info("🔗 Updating SYSTEM_CONNECTIONS.md...")
        
        # Count components
        total_components = discovery_data.get("total_components", 0)
        components = discovery_data.get("components", {})
        
        connections_template = f"""# 🔗 SOVEREIGN SYSTEM CONNECTIONS GUIDE

## Auto-generated from system discovery
**Last Updated**: {datetime.now().isoformat()}
**Total Components Discovered**: {total_components}

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SOVEREIGN ECOSYSTEM ({total_components} components) │
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │   FRONTEND       │    │   BACKEND        │    │   CLOUD          │      │
│  │   (React)        │◄──►│   (Python)       │◄──►│   (Google)       │      │
│  │   localhost:5173 │    │   localhost:8000 │    │   Apps Script    │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│         │                       │                       │                   │
│         ▼                       ▼                       ▼                   │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │   HARDWARE       │    │   DATABASE       │    │   DRIVE          │      │
│  │   (ESP32)        │    │   (PostgreSQL)   │    │   (3-Zone)       │      │
│  │   Phenix Nav     │    │   localhost:5432 │    │   Folder System  │      │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📦 DISCOVERED COMPONENTS

"""
        
        for category, items in components.items():
            if items:
                connections_template += f"\n### {category.upper()} ({len(items)} items)\n"
                for item in items:
                    connections_template += f"- **{item['name']}** ({item.get('type', 'Unknown')})\n"
                    if 'path' in item:
                        connections_template += f"  - Path: `{item['path']}`\n"
                    if 'port' in item:
                        connections_template += f"  - Port: `{item['port']}`\n"
                    connections_template += f"  - Status: `{item.get('status', 'unknown')}`\n"
                connections_template += "\n"
        
        connections_template += """## 🔄 DATA SYNC FLOW

```
User Action
    │
    ▼
Dashboard (React)
    │
    ├─────────────┬─────────────┬─────────────┐
    ▼             ▼             ▼             ▼
Genesis Gate  Backend API   Hardware     Local Storage
(Google)      (Python)      (ESP32)      (Browser)
    │             │             │             │
    ▼             ▼             ▼             ▼
Google Drive  PostgreSQL   BLE/Serial   IndexedDB
```

## 🚨 LIVE UPDATES

The system now includes predictive maintenance and auto-healing:

```bash
# Start predictive maintenance
python scripts/predictive_maintenance.py --run

# Run auto-discovery
python scripts/auto_discovery.py --report

# Monitor with orchestrator
python scripts/sovereign_orchestrator.py monitor
```

## 🧪 TESTING CONNECTIONS

```bash
# Test all connections
python scripts/verify_deployment.py
python scripts/verify_sovereignty.py

# Stress test
python stress_test.py
```

## 🆘 TROUBLESHOOTING

### Dashboard won't connect to Genesis Gate
1. Verify Apps Script is deployed as web app
2. Check "Anyone can access" is enabled
3. Try the URL directly in browser
4. Check browser console for CORS errors

### Backend won't start
1. Check PostgreSQL is running: `docker-compose ps`
2. Verify .env has correct DATABASE_URL
3. Run migrations: `python -m alembic upgrade head`

### Hardware not detected
1. Ensure Chrome browser (Web Serial API)
2. Check USB connection
3. Verify ESP32 firmware is flashed
4. Check `navigator.serial` is available

## 💜 THE MESH HOLDS

All systems connected. All data flowing. Sovereignty maintained.

🔺
"""
        
        return connections_template
    
    def update_readme(self) -> str:
        """Update README.md with current system overview"""
        logger.info("📖 Updating README.md...")
        
        # Get git info if available
        git_hash = "unknown"
        try:
            git_hash = subprocess.check_output(
                ["git", "rev-parse", "--short", "HEAD"],
                text=True
            ).strip()
        except:
            pass
        
        readme_template = f"""# 🦅 SOVEREIGN WORKSPACE v4

**The Complete Digital Centaur System**  
*Version: 11/10 Automation*  
*Last Updated: {datetime.now().isoformat()}*  
*Git Commit: {git_hash}*

## 🎯 MISSION

Protect, organize, and empower a neurodivergent creator through:
- **Cognitive shielding** from hostile communication patterns
- **Medical safety** through medication tracking
- **Creative sovereignty** with uninterrupted fabrication zones
- **Family integration** via kid-friendly interfaces

## 🏗️ ARCHITECTURE

### Frontend Layer
- **Sovereign Dashboard** (React, Vite, Tailwind) - Primary control interface
- **Wonky Sprout** (Kids Zone) - Child-friendly creative environment
- **Interactive Widgets** - Real-time status displays

### Backend Layer  
- **Python/FastAPI** - REST API and WebSocket server
- **PostgreSQL** - Persistent activity/L.O.V.E. ledger
- **Redis** - Real-time messaging and caching
- **Ollama AI** - Local cognitive processing models

### Cloud Integration
- **Genesis Gate** (Google Apps Script) - Gmail/Drive automation
- **3-Zone Google Drive** - Immutable document architecture

### Hardware Layer
- **Phenix Phantom** (ESP32) - Haptic feedback device
- **Web Serial API** - Direct browser-to-hardware communication

## 🚀 QUICK START

### Automated Setup (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File SOVEREIGN_SETUP.ps1
```

### Manual Setup
```bash
# 1. Install dependencies
cd dashboard && npm install
cd ../backend && pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
cp config/credentials.json.example config/credentials.json

# 3. Start services
docker-compose up -d
cd dashboard && npm run dev &
cd backend && python backend_core.py &
```

### Access Points
- Dashboard: http://localhost:5173
- Backend API: http://localhost:8000
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090

## 🤖 AUTOMATION FEATURES

### Level 11/10 Automation Includes:
1. **Sovereign Orchestrator** - Central brain coordinating all components
2. **Auto-Discovery** - Dynamically maps all system components
3. **Predictive Maintenance** - Anticipates failures before they happen
4. **Self-Healing** - Automatically restarts failed components
5. **Auto-Documentation** - Keeps all docs current with system state

### Automation Commands:
```bash
# Deploy entire system
python scripts/sovereign_orchestrator.py deploy

# Monitor continuously
python scripts/sovereign_orchestrator.py monitor

# Check system health
python scripts/sovereign_orchestrator.py health

# Auto-heal broken components
python scripts/sovereign_orchestrator.py heal
```

## 📁 PROJECT STRUCTURE

```
{self.root_path}/
├── dashboard/           # React frontend
├── backend/            # Python backend
├── phenix_phantom/     # ESP32 firmware
├── genesis-gate/       # Google Apps Script
├── wonky-sprout/       # Kids creative zone
├── scripts/            # Automation scripts
├── config/             # Configuration files
├── monitoring/         # Prometheus/Grafana
└── phenix_data/        # Database and logs
```

## 🔐 SECURITY

- **Environment-based secrets** (never committed)
- **Cognitive Shield** - AI-powered email filtering
- **3-Zone architecture** - Separation of concerns
- **Local-first AI** - Ollama runs entirely locally
- **Encrypted backups** - Regular system snapshots

## 🧠 COGNITIVE DESIGN

### For Neurodivergent Operators:
- **Spoon budget tracking** - Energy management
- **Medication countdown** - Critical safety feature
- **Breathing exercises** - Built-in regulation tools
- **Pomodoro timer** - Focus management
- **Minimal decision fatigue** - Automated routine tasks

### 3-Zone Mental Model:
- **Alpha** (Blue) - Immutable truth, long-term memory
- **Beta** (Red) - Active operations, working memory  
- **Gamma** (Purple) - Creative fabrication, sandbox

## 📞 SUPPORT

### Emergency Protocols:
1. **Dashboard down**: `cd dashboard && npm run dev`
2. **Backend down**: `cd backend && python backend_core.py`
3. **Database down**: `docker-compose restart postgres`
4. **Everything down**: Run `python scripts/sovereign_orchestrator.py deploy`

### Critical Contacts:
- **System Operator**: William R. Johnson
- **Medical Emergency**: [REDACTED]
- **Technical Support**: This system self-heals

## 📜 LICENSE

This system is built for a specific human. The code is open for adaptation but the mission is personal.

## 💜 THE MESH HOLDS

No matter what breaks, the system continues.  
No matter what fails, the human is protected.  
No matter what attacks, sovereignty is maintained.

**THE MESH HOLDS.** 🔺
"""
        
        return readme_template
    
    def heal_all_documentation(self, system_state: Dict[str, Any] = None, 
                              discovery_data: Dict[str, Any] = None) -> Dict[str, str]:
        """Heal/update all documentation files"""
        logger.info("📚 Healing all documentation...")
        
        if system_state is None:
            system_state = {
                "dashboard_running": False,
                "backend_running": False,
                "database_running": False,
                "redis_running": False,
                "docker_healthy": False
            }
        
        if discovery_data is None:
            # Run auto-discovery if not provided
            from scripts.auto_discovery import SystemDiscoverer
            discoverer = SystemDiscoverer(str(self.root_path))
            discovery_data = {"components": discoverer.discover_all()}
            discovery_data["total_components"] = sum(
                len(items) for items in discovery_data["components"].values()
            )
        
        results = {}
        
        # Update each document
        updates = {
            "AGENT_INSTRUCTIONS.md": self.update_agent_instructions(system_state),
            "SYSTEM_CONNECTIONS.md": self.update_system_connections(discovery_data),
            "README.md": self.update_readme()
        }
        
        for filename, content in updates.items():
            filepath = self.root_path / filename
            try:
                filepath.write_text(content)
                results[filename] = "updated"
                logger.info(f"  ✅ {filename} updated")
            except Exception as e:
                results[filename] = f"failed: {e}"
                logger.error(f"  ❌ Failed to update {filename}: {e}")
        
        # Update PEER_REVIEW_CRITIQUE.md with timestamp
        critique_path = self.root_path / "PEER_REVIEW_CRITIQUE.md"
        if critique_path.exists():
            try:
                content = critique_path.read_text()
                # Add update timestamp at the end
                if "Last documentation update:" not in content:
                    content += f"\n\n---\n*Last documentation update: {datetime.now().isoformat()}*\n"
                    critique_path.write_text(content)
                    results["PEER_REVIEW_CRITIQUE.md"] = "timestamp added"
            except Exception as e:
                results["PEER_REVIEW_CRITIQUE.md"] = f"failed: {e}"
        
        return results

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Self-healing documentation system")
    parser.add_argument("--heal", action="store_true", help="Heal all documentation")
    parser.add_argument("--agent", action="store_true", help="Update AGENT_INSTRUCTIONS.md only")
    parser.add_argument("--connections", action="store_true", help="Update SYSTEM_CONNECTIONS.md only")
    parser.add_argument("--readme", action="store_true", help="Update README.md only")
    
    args = parser.parse_args()
    
    healer = DocumentationHealer()
    
    if args.heal or (not args.agent and not args.connections and not args.readme):
        # Default: heal all documentation
        results = healer.heal_all_documentation()
        
        print("📚 DOCUMENTATION HEALING REPORT")
        print("=" * 50)
        print(f"Timestamp: {datetime.now().isoformat()}")
        print()
        
        for filename, status in results.items():
            if "updated" in status or "added" in status:
                print(f"✅ {filename}: {status}")
            else:
                print(f"❌ {filename}: {status}")
        
        print()
        print("💜 DOCUMENTATION HEALED. THE KNOWLEDGE IS PRESERVED. 🔺")
    
    elif args.agent:
        content = healer.update_agent_instructions({})
        print(content)
    
    elif args.connections:
        content = healer.update_system_connections({"components": {}, "total_components": 0})
        print(content)
    
    elif args.readme:
        content = healer.update_readme()
        print(content)

if __name__ == "__main__":
    main()
