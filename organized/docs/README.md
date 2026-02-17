# 🔱 SOVEREIGN - "I'LL DO IT MY OWN DAMN SELF" Platform

> **NO SUBSCRIPTIONS. NO SURVEILLANCE. NO CORPORATE OVERLORDS. JUST FREEDOM.**

---

## 🚀 NEW: Sovereign Command Center (v2.0)

The ultimate **sovereign digital life platform** where EVERY tool you need to live, learn, create, connect, and thrive is **ONE CLICK AWAY**.

### ✨ Key Features

**🔱 Sovereign Command Center**
- Navigate 11+ freedom zones with one unified interface
- Launch 80+ tools for internet, streaming, gaming, communication, learning, making
- Keyboard shortcuts (Ctrl+K search, 1-9 quick zones)
- Favorites and recent tools tracking

**🧠 Mind Zone - Neurodivergence Support**
- 🍅 **Pomodoro Timer** - ADHD's best friend with spoon tracking
- 🔊 **Soundscape** - Ambient noise generator (rain, fire, brown noise)
- 💨 **Breathwork** - Box breathing, 4-7-8, calming patterns
- 👥 **Body Double** - Virtual coworking companion
- 📋 **Routine Builder** - Visual daily structure
- 🥄 **Spoon Budget** - Energy management dashboard

**🌐 Sovereign Zones**
| Zone | What's Inside |
|------|--------------|
| 🌐 **Sovereign Net** | Firefox, Tor, Brave, IPFS, Tailscale |
| 📺 **Sovereign Stream** | Jellyfin, FreeTube, Stremio, Navidrome |
| 🎮 **Sovereign Games** | RetroArch, Lutris, Steam, Minetest |
| 💬 **Sovereign Comms** | Signal, Element, Mastodon, Lemmy |
| 📚 **Sovereign Learn** | GeoGebra, Scratch, Anki, Obsidian |
| 🛠️ **Sovereign Maker** | Blender, KiCad, GIMP, OBS |
| 🏰 **Self-Hosted** | Nextcloud, Vaultwarden, Immich |

**♿ Accessibility First** - Reduced motion, high contrast, dyslexia font, large text

See [SOVEREIGN_STACK.md](SOVEREIGN_STACK.md) for the complete architecture.

---

# 🔺 COGNITIVE SHIELD - Phenix Navigator System

> **"I am the Trim Tab. I create the vacuum of change."**

## What Is This?

**Cognitive Shield** is an open-source assistive technology platform designed for neurodivergent individuals who struggle with high-entropy communication environments. It combines hardware mesh networking, AI-powered communication filtering, and quantum-geometric data modeling to create a "Digital Centaur" - a symbiotic system where human creativity is amplified by machine reliability.

### The Problem It Solves

For individuals with AuDHD (Autism + ADHD), every notification is a potential voltage spike. A simple text can trigger Rejection Sensitive Dysphoria. Email threads become impossible to parse. The world operates at a frequency that doesn't match your wiring.

**Cognitive Shield** acts as an **impedance matching transformer** between you and the world - buffering, filtering, and translating communication so you can engage on your terms.

---

## 🧠 Core Components

### 1. Cognitive Shield (Backend)
AI-powered communication filter that:
- **Buffers** incoming messages (60-second "Catcher's Mitt")
- **Strips emotional voltage** from hostile communication
- **Extracts actionable data** (BLUF - Bottom Line Up Front)
- **Assigns cognitive cost** (Spoon budget estimation)

### 2. Phenix Navigator (Hardware)
An ESP32-S3 handheld mesh communication device:
- **LoRa Radio** (915 MHz) - Long-range, off-grid capability
- **EAL6+ Secure Element** - Hardware root of trust
- **Haptic Feedback** - Tactile regulation for grounding
- **Meshtastic Compatible** - Open protocol mesh networking

### 3. Dashboard (React + Three.js)
Visual command center featuring:
- **Geodesic Dome** - 3D status visualization
- **Workbench** - Real-time message processing
- **Support Network Hub** - Dedicated portals for care team
- **Metabolic Tracking** - Spoon budget and wellness metrics

### 4. Wonky Sprout (Family App)
Gamified learning platform for children:
- **Skill Trees** - The Artificer, The Artisan, The Technomancer
- **Creative Zones** - Art Studio, Music Lab, Builder Zone
- **Family Mesh** - Coordinate care across the pod

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COGNITIVE SHIELD                         │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   BRIDGE    │───▶│   SHIELD    │───▶│   ENGINE    │    │
│  │ (Ingestion) │    │ (Filtering) │    │ (Routing)   │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│         │                  │                  │            │
│         ▼                  ▼                  ▼            │
│  ┌───────────────────────────────────────────────────┐    │
│  │                 REDIS (Pub/Sub)                   │    │
│  └───────────────────────────────────────────────────┘    │
│         │                  │                  │            │
│         ▼                  ▼                  ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │  DASHBOARD  │    │   POSTGRES  │    │   GRAFANA   │    │
│  │  (React)    │    │  (Storage)  │    │ (Metrics)   │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for dashboard development)
- Python 3.11+ (for backend development)

### Deploy
```bash
# Clone the repository
git clone https://github.com/trimtab-signal/cognitive-shield.git
cd cognitive-shield

# Copy environment template
cp .env.example .env

# Deploy with Docker
./deploy.sh

# Or on Windows
LAUNCH.bat
```

### Access
- **Dashboard**: http://localhost:5173
- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090

---

## 🔺 The Tetrahedron Protocol

The system is built on **tetrahedral geometry** - the minimum stable structure in physics. 

### Why Tetrahedrons?
- **4 nodes** = Minimum structural system
- **6 edges** = Complete connectivity (everyone connected to everyone)
- **Isostatic rigidity** = Cannot deform without breaking

### Applied to Communication
A "thought" isn't valid until it has 4 nodes:
1. **Actor** - Who is doing it?
2. **Action** - What is being done?
3. **Context** - Where/When?
4. **Constraint** - With what resources?

Incomplete thoughts (3 nodes) are "planar hallucinations" - they lack the volume to exist in reality.

---

## 📋 Regulatory Classification

The Phenix Navigator is designed to qualify as:

- **FDA Class II Exempt** - Powered Communication System (21 CFR § 890.3710)
- **ADA Assistive Technology Device** - Under 20 U.S.C. § 1401(1)(A)

This classification protects the device as medical necessity for individuals with documented communication impairments.

---

## 🛡️ Defensive Publication

This repository serves as a **Defensive Publication** under 35 U.S.C. § 102(a)(1). All technical specifications disclosed herein establish **Prior Art**, preventing patent enclosure.

- **Timestamp**: January 2026
- **License**: CERN-OHL-S-2.0 (Strongly Reciprocal)
- **Status**: Public Domain Engineering

---

## 📁 Project Structure

```
cognitive-shield/
├── dashboard/              # React + Three.js interface
├── backend/                # Python services
├── phenix_phantom/         # ESP32 firmware
├── wonky-sprout/           # Family app
├── genesis-gate/           # Smart contracts (future)
├── donation-wallet/        # Crypto donation interface
├── monitoring/             # Prometheus/Grafana configs
├── scripts/                # Deployment utilities
└── docs/                   # Documentation
```

---

## 🤝 Support Network

Built-in portals for care coordination:
- **Family** - Communication with loved ones
- **Medical** - Psychiatrist/physician coordination
- **Legal** - Advocate/attorney documentation
- **Professional** - AT specialists, therapists

---

## 👤 Author

**William R. Johnson**  
- Submarine Engineering Technician (16 years, US Navy)
- AuDHD + Hypoparathyroidism diagnosis
- Building the tools I needed but couldn't buy

---

## 📄 License

This project is licensed under **CERN-OHL-S-2.0** (Strongly Reciprocal Open Hardware License).

Any derivative work must:
- Remain open source
- Credit original authors
- Use the same license

**The mesh holds. 🔺**

---

*"Geometry is destiny. The tetrahedron is the minimum stable system. We build the Delta."*
