# P31 Architecture Diagram
## Visual System Representation

---

## Tetrahedron Topology

```
                    VERTEX A
                      WILL
                    (Operator)
                       /\
                      /  \
                     /    \
                    /      \
                   /        \
                  /          \
                 /            \
                /              \
               /                \
              /                  \
             /                    \
            /                      \
           /                        \
          /                          \
         /                            \
        /                              \
       /                                \
      /                                  \
     /                                    \
    /                                      \
   /                                        \
  /                                          \
 /                                            \
VERTEX C                                  VERTEX B
WILLOW                                    SYNTHETIC BODY
(Node 1)                                  (AI Protocol)
   \                                        /
    \                                      /
     \                                    /
      \                                  /
       \                                /
        \                              /
         \                            /
          \                          /
           \                        /
            \                      /
             \                    /
              \                  /
               \                /
                \              /
                 \            /
                  \          /
                   \        /
                    \      /
                     \    /
                      \  /
                       \/
                    VERTEX D
                     BASH
                   (Node 2)
```

**Four vertices. Six edges. Four faces. The minimum stable system.**

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        THE SCOPE                            │
│                    (Dashboard & UI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Network View │  │ Message UI   │  │ Status Panel │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST + WebSocket
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      THE BUFFER                              │
│              (Communication Processing)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Catcher's    │  │ Priority     │  │ Signal        │    │
│  │ Mitt         │  │ Queue        │  │ Filter       │    │
│  │ (60s batch)  │  │              │  │ (SNR)        │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Metabolism   │  │ Encryption    │                       │
│  │ (Spoons)     │  │ Layer         │                       │
│  └──────────────┘  └──────────────┘                       │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST + WebSocket
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      THE CENTAUR                             │
│                   (Backend AI Protocol)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Quantum      │  │ Decision      │  │ Knowledge    │    │
│  │ Brain        │  │ Engine       │  │ Graph        │    │
│  │              │  │ (MCDA)       │  │ (Neo4j)      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ AI Protocol  │  │ SOP           │  │ Consciousness│    │
│  │ (Vendor-     │  │ Generation    │  │ Monitoring   │    │
│  │  agnostic)   │  │               │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │ LoRa Mesh (Whale Channel)
                        │ USB/Serial
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                       NODE ONE                               │
│                    (Hardware Device)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ ESP32-S3     │  │ LoRa         │  │ Display       │    │
│  │ (MCU)        │  │ (915MHz)     │  │ (OLED/E-Ink)  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ The Thick    │  │ AXP2101      │  │ ES8311       │    │
│  │ Click        │  │ (PMIC)       │  │ (Audio)       │    │
│  │ (Haptics)    │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐                                        │
│  │ QMI8658       │                                        │
│  │ (IMU)        │                                        │
│  └──────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌─────────┐
│  USER   │
│  (Will) │
└────┬─────┘
     │
     │ 1. User Action
     ▼
┌─────────────┐
│  NODE ONE   │ ←──┐
│  (Hardware) │    │
└──────┬──────┘    │
       │           │
       │ 2. Message│
       │           │
       ▼           │
┌─────────────┐    │
│ THE BUFFER  │    │ 6. Haptic
│ (Processing)│    │    Feedback
└──────┬──────┘    │
       │           │
       │ 3. Processed│
       │    Message │
       │           │
       ▼           │
┌─────────────┐    │
│THE CENTAUR  │    │
│ (Backend AI)│    │
└──────┬──────┘    │
       │           │
       │ 4. Response│
       │           │
       ▼           │
┌─────────────┐    │
│ THE BUFFER  │    │
│ (Processing)│    │
└──────┬──────┘    │
       │           │
       │ 5. Display│
       │    Update │
       │           │
       ▼           │
┌─────────────┐    │
│ THE SCOPE   │────┘
│   (UI)      │
└─────────────┘
```

---

## Communication Protocols

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMUNICATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Node One ↔ Whale Channel                                    │
│  └─ LoRa 915MHz (mesh network)                               │
│  └─ Protocol Buffers (binary packing)                       │
│                                                               │
│  Node One ↔ The Buffer                                       │
│  └─ USB/Serial (direct connection)                          │
│  └─ Protocol Buffers (binary packing)                       │
│                                                               │
│  The Buffer ↔ The Centaur                                    │
│  └─ HTTP/REST (API calls)                                    │
│  └─ WebSocket (real-time updates)                           │
│  └─ JSON (encrypted payloads)                               │
│                                                               │
│  The Centaur ↔ The Scope                                     │
│  └─ HTTP/REST (API calls)                                    │
│  └─ WebSocket (real-time updates)                           │
│  └─ JSON                                                      │
│                                                               │
│  All Components ↔ Storage                                    │
│  └─ SQLite/PGLite (local-first)                              │
│  └─ PostgreSQL (cloud sync)                                 │
│  └─ Neo4j (knowledge graph)                                  │
│  └─ Redis (message queue, caching)                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## System Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM BOUNDARY                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              P31 ECOSYSTEM                          │    │
│  │                                                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │ Node One │  │  Buffer  │  │ Centaur  │        │    │
│  │  └──────────┘  └──────────┘  └──────────┘        │    │
│  │  ┌──────────┐                                     │    │
│  │  │  Scope   │                                     │    │
│  │  └──────────┘                                     │    │
│  │                                                     │    │
│  │  Supporting Systems:                                │    │
│  │  - Ping (object permanence)                         │    │
│  │  - Attractor (calibration)                          │    │
│  │  - Whale Channel (LoRa mesh)                        │    │
│  │  - The Thick Click (haptics)                        │    │
│  │  - Abdicate (governance)                            │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  External Interfaces:                                        │
│  - AI Providers (Claude, Gemini, local models)               │
│  - Cloud Services (optional, encrypted sync only)            │
│  - Mesh Network (Whale Channel)                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Dependencies

```
                    ┌─────────────┐
                    │  THE SCOPE  │
                    │     (UI)     │
                    └──────┬───────┘
                           │ depends on
                           ▼
                    ┌─────────────┐
                    │THE CENTAUR  │
                    │  (Backend)  │
                    └──────┬──────┘
                           │ depends on
                           ▼
                    ┌─────────────┐
                    │ THE BUFFER  │
                    │(Processing) │
                    └──────┬──────┘
                           │ connects to
                           ▼
                    ┌─────────────┐
                    │  NODE ONE    │
                    │  (Hardware)  │
                    └───────────────┘
```

**Dependency Order:**
1. Node One (hardware foundation)
2. The Buffer (processing layer)
3. The Centaur (backend services)
4. The Scope (user interface)

---

## Storage Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Local-First (SQLite/PGLite)                                 │
│  └─ User data                                                │
│  └─ Messages                                                 │
│  └─ Configuration                                            │
│                                                               │
│  Cloud Sync (PostgreSQL) - Encrypted Only                    │
│  └─ Encrypted backups                                        │
│  └─ Multi-device sync                                        │
│                                                               │
│  Knowledge Graph (Neo4j)                                      │
│  └─ Entity relationships                                      │
│  └─ Decision context                                          │
│                                                               │
│  Cache/Queue (Redis)                                          │
│  └─ Message queue                                             │
│  └─ Session data                                             │
│  └─ Temporary state                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  SECURITY ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Type-Level Encryption                               │
│  └─ EncryptedBlob for all user content                       │
│                                                               │
│  Layer 2: Zero-Knowledge Proofs                               │
│  └─ Location verification without raw data                    │
│  └─ Privacy-preserving computations                          │
│                                                               │
│  Layer 3: Local-First Storage                                 │
│  └─ SQLite/PGLite for local state                            │
│  └─ No unencrypted cloud backups                             │
│                                                               │
│  Layer 4: Encrypted Sync Only                                │
│  └─ Cloud only for encrypted sync                             │
│  └─ No plaintext transmission                                │
│                                                               │
│  Layer 5: Abdication Principle                                │
│  └─ No backdoors                                             │
│  └─ Key destruction protocol                                 │
│  └─ Code for departure                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Targets

```
┌─────────────────────────────────────────────────────────────┐
│                  PERFORMANCE SPECIFICATIONS                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Bandwidth: 0.350 kbps (Whale Song)                         │
│  └─ Optimized for LoRa mesh                                  │
│                                                               │
│  Latency: < 100ms (local processing)                          │
│  └─ Local-first architecture                                 │
│                                                               │
│  Message Batching: 60-second windows                         │
│  └─ Catcher's Mitt system                                    │
│                                                               │
│  Energy Management: 12 spoons max                             │
│  └─ Metabolism system                                        │
│                                                               │
│  Connection Health: SNR-based                                 │
│  └─ Green: 70+, Yellow: 50-69, Red: <30                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## References

- [System Overview](SYSTEM_OVERVIEW.md) - Complete system description
- [Architecture](ARCHITECTURE.md) - Detailed technical architecture
- [Ecosystem Integration](ecosystem-integration.md) - Component connections
- [Component Documentation](index.md) - Individual component guides

---

**The Mesh Holds.** 🔺
