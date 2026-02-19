# P31 Naming Audit

This document maps old component names to P31 names and identifies where references need updating.

## Component Name Mapping

| Old Name | P31 Name | Status | Notes |
|----------|----------|--------|-------|
| Phenix Navigator | **Node One** | ✅ Complete | Hardware device (ESP32-S3) - All docs updated |
| Cognitive Shield | **The Buffer** | ✅ Complete | Communication processing software - All docs updated |
| Tomograph | **The Buffer** | ✅ Complete | Alternative name for Cognitive Shield - Deprecated |
| SUPER-CENTAUR | **The Centaur** | ✅ Complete | Backend AI protocol system - Docs use "The Centaur", folder kept for compatibility |
| Dashboard | **The Scope** | ✅ Complete | UI visualization layer - All docs updated |
| Heartbeat Protocol | **Ping** | ✅ Complete | Object permanence automation - All docs updated |
| Mark 1 Attractor | **Home Frequency** | ✅ Complete | Calibration system - All docs updated |
| SIMPLEX | **The Fold** | ✅ Complete | Philosophy layer - Referenced in naming doc |
| Vertex One | **Node One** | ✅ Complete | Hardware device (deprecated name) - All docs updated |
| Wonky Sprout | **DEAD** | ✅ Complete | No longer used - Removed from all documentation |

## Preserved Names (Do Not Change)

- **The Thick Click** - Haptic system (heritage name)
- **Whale Channel** - LoRa mesh network (heritage name)
- **Abdicate** - Governance protocol (heritage name)
- **The Geodesic Self** - Published work (keep title)
- **The Floating Neutral** - Published diagnosis (keep title)
- **Tetrahedron Protocol** - Zenodo prior art (locked)

## Current Status (February 2026)

### Documentation Files ✅
- All README files use P31 names
- All component documentation uses P31 names
- Setup guides reference P31 components
- API documentation uses P31 names

### Code References
- Package.json files may contain old names (acceptable for compatibility)
- Config files reference P31 names in documentation
- Code comments may reference old names (acceptable for historical context)

### Folder Names
- `SUPER-CENTAUR/` - Kept for compatibility, README uses "The Centaur"
- `cognitive-shield/` - Kept for compatibility, README uses "The Buffer"
- `ui/` - Kept for compatibility, README uses "The Scope"
- `firmware/` - Kept for compatibility, README uses "Node One"

## Update Strategy

1. **User-facing documentation**: Use P31 names (Node One, The Buffer, The Centaur, etc.)
2. **Internal code/folders**: May keep technical names for compatibility (SUPER-CENTAUR folder stays, but README references The Centaur)
3. **Package names**: Update to P31 where appropriate
4. **Config files**: Update `god.config.ts` and other configs to reference P31 names in comments/docs

## Implementation Priority

1. Master README and documentation index
2. Component-specific README files
3. Setup guides
4. Code comments and package.json descriptions
5. Config file documentation
