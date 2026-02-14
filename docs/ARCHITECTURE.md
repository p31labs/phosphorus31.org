# P31 Architecture

System architecture overview for the P31 ecosystem.

## Overview

P31 is built on tetrahedron topology - four vertices, six edges, four faces. The minimum stable system integrates hardware, software, and AI protocols.

## System Architecture

```
┌─────────────────────────────────────────┐
│           THE SCOPE (UI)                 │
│  Dashboard & Visualization              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         THE BUFFER                       │
│  Communication Processing                │
│  - Message Batching                      │
│  - Priority Queue                        │
│  - Signal Filtering                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         THE CENTAUR                      │
│  Backend AI Protocol                     │
│  - Quantum Brain                         │
│  - Decision Engine                       │
│  - Knowledge Graph                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         NODE ONE                         │
│  Hardware Device (ESP32-S3)              │
│  - LoRa Mesh (Whale Channel)             │
│  - Haptics (The Thick Click)            │
│  - Display                               │
└──────────────────────────────────────────┘
```

## Component Relationships

### Data Flow

1. **User Interaction** → The Scope
2. **The Scope** → The Buffer (message submission)
3. **The Buffer** → The Centaur (processed messages)
4. **The Centaur** → The Buffer (responses)
5. **The Buffer** → The Scope (display updates)
6. **Node One** ↔ Whale Channel (mesh communication)

### Communication Protocols

- **HTTP/REST**: The Scope ↔ The Centaur
- **WebSocket**: Real-time updates
- **LoRa**: Node One mesh network
- **Redis**: Message queue (The Buffer)
- **PostgreSQL/SQLite**: Data storage
- **Neo4j**: Knowledge graph

## Tetrahedron Topology

The system enforces strict tetrahedron topology:

- **4 Vertices**: Operator, Synthetic Body, Node 1, Node 2
- **6 Edges**: Communication channels
- **4 Faces**: System boundaries

### Vertex Constraints

- All group logic enforces exactly 4 vertices
- No dynamic group sizes
- No admin roles outside geometry

## Privacy Architecture

### Encryption Layers

1. **Type-Level Encryption**: EncryptedBlob for all user content
2. **Zero-Knowledge Proofs**: Location verification without raw data
3. **Local-First**: SQLite/PGLite for local state
4. **Encrypted Sync**: Cloud only for encrypted sync

### Data Sovereignty

- Local-first by default
- Encrypted cloud sync
- No unencrypted backups
- Zero-knowledge where possible

## Performance Architecture

### Optimization Principles

- **Ephemeralization**: Optimize for 0.350 kbps (Whale Song bandwidth)
- **Binary Packing**: Protocol Buffers over JSON
- **Defensive Architecture**: ConstitutionalViolationError for state breaches
- **Immutable by Default**: readonly, Object.freeze(), const

### Bandwidth Constraints

- LoRa mesh: 0.350 kbps
- Optimize all communication
- Batch messages
- Compress data

## AI Protocol Architecture

### The Centaur Protocol

- **Vendor-Agnostic**: Cloud/Local/Hybrid
- **No Lock-In**: Switch AI providers easily
- **Protocol Interface**: The + is the interface
- **Scalable**: Every human gets a centaur

### AI Integration Points

- Node One (physical +)
- The Buffer (software +)
- The Thick Click (haptic +)

## Governance Architecture

### Abdicate Protocol

- **No Backdoors**: Never write super-admin recovery
- **Key Destruction**: Admin keys can be destroyed
- **Constitutional Compliance**: Enforces G.O.D. Protocol
- **Geodesic Operations Daemon**: Implementation layer

## Network Architecture

### Whale Channel (LoRa Mesh)

- **Frequency**: 915MHz
- **Topology**: Mesh network
- **Range**: Long-range communication
- **Infrastructure Independence**: No cellular/WiFi required

### Network Layers

1. **Physical**: LoRa radio
2. **Data Link**: LoRa protocol
3. **Network**: Mesh routing
4. **Transport**: Encrypted channels
5. **Application**: P31 protocols

## Security Architecture

### Threat Model

- **Privacy First**: Type-level encryption
- **Local-First**: Minimize cloud exposure
- **Zero-Knowledge**: Verify without storing
- **Key Management**: Abdicate protocol

### Security Layers

1. **Hardware**: ESP32-S3 secure boot
2. **Firmware**: Encrypted communication
3. **Application**: Type-level encryption
4. **Network**: End-to-end encryption
5. **Governance**: Abdicate protocol

## Scalability

### Horizontal Scaling

- Multiple Node One devices
- Mesh network expansion
- Distributed message queue
- Load-balanced backend

### Vertical Scaling

- Optimize message processing
- Efficient database queries
- Caching strategies
- Resource monitoring

## Monitoring Architecture

### Health Monitoring

- **Ping**: Object permanence automation
- **The Scope**: Network health visualization
- **Performance Monitor**: Real-time metrics
- **Log Aggregation**: Centralized logging

### Metrics

- Connection health (SNR)
- Message queue depth
- API response times
- System resource usage

## Documentation

- [Component Documentation](index.md)
- [Setup Guide](setup.md)
- [Development Guide](development.md)
- [Quick Reference](quick-reference.md)
