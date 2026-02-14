# P31 Naming Reference

Complete reference for P31 component names and naming principles.

## Component Names

| Component | P31 Name | Folder/Code Name | Notes |
|-----------|----------|------------------|-------|
| Hardware Device | **Node One** | `firmware/` | ESP32-S3 device |
| Communication Processing | **The Buffer** | `cognitive-shield/` | Message buffering |
| Backend System | **The Centaur** | `SUPER-CENTAUR/` | AI protocol |
| Dashboard | **The Scope** | `ui/` | Visualization |
| Heartbeat | **Ping** | Various | Object permanence |
| Calibration | **Attractor** | Various | Resonance training |
| Mesh Network | **Whale Channel** | Various | LoRa 915MHz |
| Haptics | **The Thick Click** | Various | Haptic feedback |
| Governance | **Abdicate** | Various | Key destruction |

## Naming Principles

1. **Plain language over jargon** — The Buffer, not Tomograph. The Scope, not Dashboard.
2. **Verbs and nouns over adjectives** — Ping, Fold, Click, Chirp
3. **Nodes are in the architecture** — Node One as first node in the mesh topology
4. **The AI has a seat, not a name** — The Centaur is a protocol, not a vendor. The + changes.
5. **Heritage names for hardware** — Whale Channel, The Thick Click
6. **Action names for governance** — Abdicate, Destroy, Shred
7. **Never import Wye-topology language** — no "hub," "center," "master," "admin"
8. **The body is the proof** — every name should trace back to /calcium/ if you pull the thread

## Deprecated Names

These names should not be used in new documentation:

- Phenix Navigator → **Node One**
- Cognitive Shield → **The Buffer**
- Tomograph → **The Buffer**
- SIMPLEX → **The Fold**
- Vertex One → **Node One**
- Wonky Sprout → **DEAD** (do not use)

## Preserved Names

These names are preserved and should not be changed:

- **The Thick Click** - Haptic system
- **Whale Channel** - LoRa mesh
- **Abdicate** - Governance
- **The Geodesic Self** - Published work
- **The Floating Neutral** - Published diagnosis
- **Tetrahedron Protocol** - Zenodo prior art

## File Naming Conventions

- Documentation files: lowercase with hyphens (`node-one.md`, `the-buffer.md`)
- Code folders: may keep technical names for compatibility
- User-facing references: always use P31 names

## Reference

See [P31 Naming Architecture](../P31_naming_architecture.md) for complete naming rationale.
