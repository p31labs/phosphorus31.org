# P31 Labs Technical Architecture
**Version:** 1.0 | **Last Updated:** 2026-02-14 | **License:** Apache 2.0

---

## System Overview

P31 Labs builds a decentralized, offline-first cognitive prosthetic ecosystem using tetrahedron topology (4 vertices, 6 edges, minimum stable system). All systems operate independently and integrate via local-first protocols.

```
┌─────────────────────────────────────────────────────────────────┐
│                    P31 ECOSYSTEM ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   NODE ONE       │◄────────┤  PHENIX NAVIGATOR │
│   (Hardware)     │  SIC-   │  (Protocol)       │
│                  │  POVM   │                   │
│ • ESP32-S3       │  Keys   │ • Quantum Key     │
│ • LoRa SX1262    │         │   Distribution    │
│ • DRV2605L       │         │ • Background-     │
│ • E-Ink Display  │         │   Independent     │
└────────┬─────────┘         └──────────────────┘
         │ LoRa Mesh (Meshtastic)
         │ BLE (Local Pairing)
         │ USB-C (Programming)
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    THE BUFFER (Software)                        │
│  Communication Voltage Assessment Engine                        │
│                                                                  │
│  • Message Analysis: URGENCY, COERCION, SHAME, FALSE_AUTHORITY  │
│  • Voltage Scale: 0-10 (≥6 auto-held, ≥8 critical alert)       │
│  • Pre-composed Response Library (nonverbal episodes)           │
│  • ADA Documentation Generation                                 │
│  • Local-First: All processing on-device, zero cloud            │
│                                                                  │
│  Stack: TypeScript, Node.js, Redis (queue), SQLite (local)      │
└────────────────────────┬───────────────────────────────────────┘
                         │ HTTP/WebSocket
                         │
┌────────────────────────▼───────────────────────────────────────┐
│                    THE SCOPE (Dashboard)                        │
│  Cognitive State Visualization & Management                     │
│                                                                  │
│  • Spoon Economy: Energy tracking with pattern recognition     │
│  • Medication Management: Calcitriol, CaCO₃, Stimulant, Mg     │
│    └─ Interaction Timing: Ca²⁺ ↔ Stimulant (4hr gap enforced)  │
│  • Tetrahedron Visualization: Multi-axis cognitive state        │
│  • Local Storage: IndexedDB, zero telemetry                    │
│                                                                  │
│  Stack: React, TypeScript, Three.js, Vite                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Specifications

### 1. Node One (Hardware)
**Purpose:** Off-grid sensory regulation and emergency communication device

| Component | Specification |
|-----------|---------------|
| **MCU** | ESP32-S3 (dual-core, 240MHz) |
| **Radio** | LoRa SX1262 (915MHz, 0.350 kbps) |
| **Haptics** | DRV2605L LRA driver ("The Thick Click") |
| **Display** | E-Ink (2.9" or 4.2") |
| **Firmware** | ESP-IDF v5.5, C/C++ |
| **Protocols** | Meshtastic (mesh), BLE (pairing), USB-C (programming/charging) |
| **Regulatory** | Class II medical device pathway |

**Key Features:**
- Off-grid LoRa mesh communication (no cellular/WiFi dependency)
- Haptic feedback for sensory regulation
- Low-power operation (weeks on single charge)
- Secure boot and encrypted firmware updates

---

### 2. The Buffer (Software)
**Purpose:** Communication voltage assessment and response automation

**Core Functions:**
- **Voltage Assessment:** Analyzes incoming messages for emotional/coercive content
  - Detection patterns: URGENCY, COERCION, SHAME, FALSE_AUTHORITY, THREATS, EMOTIONAL_LEVER
  - Scale: 0-10 voltage rating
  - Auto-hold threshold: ≥6 voltage
  - Critical alert: ≥8 voltage
- **Response Library:** Pre-composed responses for nonverbal episodes
- **ADA Documentation:** Generates accommodation logs for legal/SSA evidence
- **Local-First:** All processing on-device, no cloud dependency

**Data Flow:**
```
Incoming Message → Voltage Analysis → HELD/RELEASED/PASSED → Response Generation → ADA Log Entry
```

**Stack:** TypeScript, Node.js, Redis (message queue), SQLite (local storage)

---

### 3. The Scope (Dashboard)
**Purpose:** Cognitive state visualization and medication/energy management

**Core Modules:**
- **Spoon Economy:** Energy tracking with pattern recognition and predictive analytics
- **Medication Tracker:**
  - Calcitriol (vitamin D analog)
  - Calcium Carbonate (CaCO₃)
  - Stimulant (Vyvanse)
  - Magnesium
  - **Critical Rule:** Ca²⁺ and Stimulant must be 4 hours apart (interaction prevention)
- **Tetrahedron Visualization:** 3D multi-axis cognitive state representation
- **Coherence Monitoring:** Quantum-informed state tracking
- **Ping Grid:** Network health visualization

**Storage:** IndexedDB (local-first), zero telemetry, no cloud sync

**Stack:** React, TypeScript, Three.js (3D visualization), Vite

---

### 4. Phenix Navigator (Protocol)
**Purpose:** Quantum-informed key distribution and background-independent security

**Core Principles:**
- **SIC-POVM Quantum Keys:** Symmetric Informationally Complete Positive Operator-Valued Measures
  - Coherence coefficient: `|⟨ψᵢ|ψⱼ⟩|² = 1/3` (1/3 overlap constant)
  - Trust threshold: <1/3 = "Entropic" connection
- **Background-Independent:** No synchronized clocks required
- **Defensive Publication:** Filed via Zenodo with timestamped DOIs
- **License:** Apache 2.0 (open source, prior art protection)

**Integration Points:**
- Node One: Hardware key distribution via LoRa mesh
- The Buffer: Software key management for encrypted communication
- The Scope: Visualization of quantum coherence states

---

## Architecture Principles

### Delta Topology (Mesh/Distributed)
- **Rejects Wye Topology:** No centralized hubs, no single points of failure
- **Tetrahedron Structure:** 4 vertices, 6 edges, minimum stable system
- **Offline-First:** Every system functions without internet
- **Mesh Communication:** LoRa network enables off-grid operation

### Local-First Data Sovereignty
- **Data Never Leaves Device:** Unless user explicitly exports
- **Zero Telemetry:** No analytics, no tracking, no cloud dependencies
- **Encrypted Storage:** Type-level encryption (EncryptedBlob) for all user content
- **IndexedDB/SQLite:** Local storage as primary data store

### Accessibility-Native
- **WCAG AA Minimum:** All interfaces meet accessibility standards
- **Sensory-Aware UI:** High-contrast modes, screen-reader support, haptic feedback
- **Neurodivergent-First:** Designed for AuDHD, sensory regulation, executive function support

### Open Source
- **License:** Apache 2.0
- **Repositories:** All code public on GitHub (github.com/p31labs)
- **Defensive Publication:** Technical innovations published to Zenodo

---

## Integration Points

| System A | System B | Protocol | Purpose |
|----------|----------|----------|---------|
| Node One | The Buffer | LoRa Mesh (Meshtastic) | Off-grid message relay |
| Node One | The Buffer | BLE | Local device pairing |
| Node One | The Buffer | USB-C Serial | Firmware updates, debugging |
| The Buffer | The Scope | HTTP/WebSocket | Real-time dashboard updates |
| Phenix Navigator | Node One | SIC-POVM Keys | Quantum key distribution |
| Phenix Navigator | The Buffer | Encrypted Channels | Secure communication |

---

## Data Flow Example: Message Processing

```
1. Incoming Message (Email/SMS/App)
   ↓
2. The Buffer: Voltage Assessment (0-10 scale)
   ↓
3. Decision:
   ├─ Voltage < 6: PASSED → The Scope (display)
   ├─ Voltage 6-7: HELD → Pre-composed response library
   └─ Voltage ≥ 8: CRITICAL ALERT → Node One (haptic + visual)
   ↓
4. ADA Log Entry: Accommodation documentation generated
   ↓
5. The Scope: Update visualization, medication timing check
```

---

## Security Architecture

- **Encryption:** AES-GCM (256-bit) with random 12-byte IV per message
- **Key Exchange:** ECDH (P-256) for secure key distribution
- **Message Signing:** ECDSA (SHA-256) for authentication
- **Key Storage:** IndexedDB with `crypto.subtle`, `extractable: false`
- **Security Score:** Must exceed 90% (The 90% Rule)

---

## Performance Constraints

- **LoRa Bandwidth:** 0.350 kbps (Whale Song channel)
- **Optimization:** Binary packing (Protocol Buffers) over JSON
- **Ephemeralization:** Maximum efficiency, minimum bandwidth
- **Offline Operation:** All systems must function 100% offline

---

## Regulatory Status

- **Node One:** Class II medical device pathway (FDA)
- **501(c)(3):** Georgia nonprofit in formation
- **Defensive Publication:** Zenodo DOIs for prior art protection

---

**The Mesh Holds. 🔺**

*For detailed component documentation, see: [Component Docs](index.md)*
