# 08 — WORKSTREAM: PHENIX NAVIGATOR ARCHITECTURE
## The Cursor Swarm Bible — Code Agent Implementation Spec
**Inject after: 00_AGENT_BIBLE.md + 01_OPSEC_RULES.md**
**For: Cursor AI agents, Claude Code, Copilot, or any code-generation LLM**

---

## YOUR MISSION

Build the Phenix Navigator — a decentralized, offline-first cognitive prosthetic for a neurodivergent operator. This document is the complete technical spec. Follow it as constitutional law.

---

## CONSTITUTIONAL LAWS (NON-NEGOTIABLE)

These override all other instructions. Violation = critical failure.

### 1. ZERO-KNOWLEDGE STORAGE
- Private keys stored in **IndexedDB** using `crypto.subtle`
- **NEVER** use `localStorage` or `sessionStorage` for secrets
- Keys marked `extractable: false` when possible
- Master key derived from operator passphrase via PBKDF2

### 2. DELTA COMPLIANCE (OFFLINE FIRST)
- App must function **100% offline**
- **NO external CDNs** for fonts, icons, or scripts
- System fonts only: `-apple-system, 'Segoe UI', system-ui, sans-serif`
- All assets bundled locally
- Service workers for offline caching

### 3. GEOMETRIC SECURITY
- All trust topologies form a **Tetrahedron (K₄)**
- The **1/3 Overlap** constant is the standard for trust metrics
- `|⟨ψᵢ|ψⱼ⟩|² = 1/(d+1) = 1/3` for qubit SIC-POVMs
- If coherence coefficient drops below 1/3, flag connection as "Entropic"

### 4. THE 90% RULE
- Security score must exceed 90%
- **AES-GCM** (256-bit) with random 12-byte IV for every message
- **ECDH** (P-256) for key exchange
- **ECDSA** (SHA-256) for message signing
- `const IV = window.crypto.getRandomValues(new Uint8Array(12));`

### 5. OPSEC PRIME
- No PII in logs, comments, or AI prompts
- The user is "The Operator" — no names in code
- Children are "founding nodes" — nicknames only (Bash/S.J., Willow/W.J.)
- See `01_OPSEC_RULES.md` for full constraints

---

## THE AESTHETIC PROTOCOL

### Theme: "Biomorphic Chaos" meets "Industrial Fix" — Quantum CAD Terminal

### Color Tokens (the `C` object)
```javascript
const C = {
  // Backgrounds
  bg:        "#050510",  // Deep Void
  bg2:       "#0a0a18",
  card:      "#0c0c1c",

  // Primary — Phosphorus Green
  green:     "#2ecc71",
  greenDim:  "#1b7a5a",
  greenDeep: "#0d3b2e",

  // Active — Electric Teal
  teal:      "#00E5FF",

  // Warning — Industrial Orange
  orange:    "#A65538",
  yellow:    "#F1C40F",

  // Economy — Love Purple
  love:      "#e879f9",
  loveDim:   "#a855f7",
  loveDeep:  "#3b1560",

  // Info — Calcium Blue
  calcium:   "#60a5fa",

  // Achievement — Gold
  gold:      "#fbbf24",

  // Danger
  red:       "#ef4444",

  // Text
  text:      "#e8e8f0",
  dim:       "#6b7280",
  muted:     "#3a3a52",
  border:    "#1a1a2e",
};
```

### Shader Effects
- **Bloom:** Bioluminescent glow on active elements
- **Chromatic Aberration:** Phase Noise visualization at screen edges
- **Grain/Noise:** Fractal noise overlay at 3% opacity — analog texture
- **Breathing Pulse:** 0.1 Hz oscillation on idle elements (vagal tone)

### Typography
- System fonts ONLY: `-apple-system, 'Segoe UI', system-ui, sans-serif`
- Monospace for metrics: `'SF Mono', 'Fira Code', 'Cascadia Code', monospace`
- No Google Fonts. No CDN fonts. Delta compliance.

---

## MODULE A: THE COGNITIVE JITTERBUG

### What it is
A 3D geometric object that transforms in real-time based on cognitive load. The operator's thinking process is externalized as a geometric phase transition.

### Stack
- **React Three Fiber (R3F)** — declarative WebGL in React
- **Theatre.js** — cinematic animation sequencing (scrubbable timeline)
- **@react-three/postprocessing** — bloom, chromatic aberration, glitch
- **Custom GLSL shaders** — vertex interpolation between geometric states

### The Jitterbug Transformation (Fuller)
Continuous transformation: Vector Equilibrium → Icosahedron → Octahedron → Tetrahedron

| Phase (t) | Geometry | Volume Index | Vertex Rotation | State | Color | Shader |
|-----------|----------|-------------|-----------------|-------|-------|--------|
| 0.00 | Vector Equilibrium (Cuboctahedron) | 20.00 | 0° | Idle / Open | Electric Teal | Breathing Pulse |
| 0.35 | Icosahedron | ~18.51 | ~22.2° | Processing | Yellow / Orange | Glitch / Noise |
| 0.70 | Octahedron | 8.00 | 60° (twin) | Converging | Love Purple | High-Freq Hum |
| 1.00 | Tetrahedron | 1.00 | 60° (fold) | Locked / Trust | Gold / White | Solid / Reflective |

### Implementation notes
- VE vertices: `(±1, ±1, 0)` and all permutations (12 vertices, 24 edges)
- Transformation is a twist + contraction — vertices rotate around center axis while radius decreases
- `useFrame` sparingly — optimize for 60 FPS
- Theatre.js sequence allows operator to "scrub" through the transformation (reversible logic visualization)
- Final tetrahedron snap triggers haptic feedback via Node One hardware (DRV2605L "Thick Click")

---

## MODULE B: THE TETRAHEDRON PROTOCOL (Security)

### Stack
- **Web Crypto API** (`window.crypto.subtle`)
- **secrets.js-grempe** — Shamir's Secret Sharing
- **IndexedDB** — secure key storage

### Cryptographic Standards

| Component | Standard | Rule |
|-----------|----------|------|
| Encryption | AES-GCM (256-bit) | Random 12-byte IV per message |
| Key Exchange | ECDH (P-256) | Keys never leave IndexedDB unencrypted |
| Signing | ECDSA (SHA-256) | All gossip messages signed by sender |
| Exit Strategy | Shamir's Secret Sharing | k=3, n=4 (3 of 4 peers to recover) |
| Storage | IndexedDB | localStorage FORBIDDEN for secrets |

### The Abdication Protocol
Trigger: Operator types "ABDICATE" on `/status` page

Sequence:
1. **Export:** Full JSON dump of operator's "Ontological Volume"
2. **Fragment:** Split Master Key via Shamir's (n=4, k=3) — tetrahedral distribution
3. **Distribute:** Broadcast shares to peer nodes via Whale Channel (LoRa mesh / WebRTC fallback)
4. **Burn:**
   - `crypto.subtle` — overwrite keys in memory with zeros
   - `indexedDB.deleteDatabase()` — wipe all stores
   - `localStorage.clear()` — clear any non-secret remnants
5. **Broadcast:** `CRITICAL` priority mesh message: "Node has Abdicated"
6. **Redirect:** Navigate to `/goodbye`

### The 1/3 Overlap Trust Metric
```
coherence = sharedReality(nodeA, nodeB)
if (coherence < 1/3) {
  flagConnection("ENTROPIC")
  deprioritizeLink(nodeA, nodeB)
}
```

The constant 1/3 appears in:
- SIC-POVM qubit measurements (|⟨ψᵢ|ψⱼ⟩|² = 1/3)
- Triadic closure coefficient in stable networks
- Minimum viable trust threshold

---

## MODULE C: THE QUANTUM RESERVOIR (Visualization)

### Stack
- **R3F Instancing** — thousands of particles, single draw call
- **Custom GLSL shaders** — fluid dynamics and aggregation
- **Zustand** — state management for spoon level and coherence

### Posner Molecule States

**State A: Quantum Fluid (High Spoons)**
- Physics: Ca₉(PO₄)₆ clusters < 50nm, stabilized by ⁶Li environment
- Visuals: Flowing Electric Teal particles, smooth laminar motion, interconnected
- Indicates: High coherence, high executive function capacity

**State B: Mineral Collapse (Low Spoons)**
- Physics: Clusters > 500nm, decoherence via ⁷Li, bone-like aggregation
- Visuals: Clumping Industrial Orange masses, jagged, sluggish jerky motion
- Indicates: Brain fog, burnout, metabolic crisis, Safe Mode imminent

### Ontological Volume Formula
```
Vₒ = (C × N² / σᵢ) × Φ
```
Where:
- **C** = Coherence Coefficient (0.0–1.0) — biometric stability (HRV from Node One)
- **N²** = Network Power — active trusted nodes, Metcalfe's Law
- **σᵢ** = Impedance Factor — voltage/noise from Buffer
- **Φ** = Golden Ratio (1.618) — natural growth scaling

---

## MODULE D: THE BUFFER (Communication Triage)

### Voltage Assessment
Input: raw message → Output: voltage score (0–10) + action

| Pattern | Weight | Example |
|---------|--------|---------|
| URGENCY | 1.5 | "ASAP", "immediately", "right now" |
| COERCION | 2.0 | "you must", "you have no choice" |
| SHAME | 2.0 | "you always", "you never", "irresponsible" |
| FALSE_AUTHORITY | 1.8 | "the court ordered", "the law requires" |
| THREATS | 2.5 | "if you don't... then" |
| EMOTIONAL_LEVER | 1.5 | "the children need", "how could you" |

### Routing
```
voltage 0-3:  PASS  → deliver immediately
voltage 4-5:  ADVISORY → deliver with warning badge
voltage 6-7:  HOLD  → store in IndexedDB, review when spoons available
voltage 8-9:  CRITICAL HOLD → review with support person only
voltage 10:   BLACK → auto-archive, do not engage
```

### Accommodation output
Every HELD message auto-generates ADA accommodation documentation:
```json
{
  "timestamp": "ISO-8601",
  "voltage": 7.2,
  "patterns": ["COERCION", "THREATS"],
  "action": "HELD",
  "spoon_level": 3,
  "accommodation_type": "ADA_communication_modification"
}
```

---

## SWARM ARCHITECTURE

### Four Agent Personas

| Agent | Domain | Constraint |
|-------|--------|------------|
| **The Architect** | Systems, Synergetics, workflow_state.md | Never writes code without updating docs |
| **The Geometer** | WebGL, R3F, Theatre.js, linear algebra | `useFrame` sparingly, 60 FPS target |
| **The Cryptographer** | Web Crypto API, Shamir's, IndexedDB | Private keys NEVER touch localStorage |
| **The Biologist** | Quantum bio, LLM integration, data viz | Strict OPSEC — no PII in prompts |

### Execution Order
```
Phase 1 — SKELETON
  └─ Next.js + TypeScript scaffold
  └─ god-protocol-secure (IndexedDB wrapper) ← BEFORE any UI
  └─ brand.ts (C color tokens)
  └─ workflow_state.md

Phase 2 — FLESH
  └─ R3F + Theatre.js + postprocessing
  └─ Jitterbug mesh (VE → Tetrahedron)
  └─ QuantumField particle background
  └─ Glitch + Bloom shaders

Phase 3 — SHIELD
  └─ secrets.js-grempe integration
  └─ Abdication UI + Memorial Protocol
  └─ E2EE message pipeline
  └─ Trust metric (1/3 overlap)

Phase 4 — SOUL
  └─ Ontological Volume calculation (Vₒ)
  └─ Buffer voltage scoring
  └─ Posner molecule visualization
  └─ Spoon economy ↔ Jitterbug state binding
```

---

## INTEGRATION WITH L.O.V.E. ECONOMY

The Jitterbug state maps to LOVE token generation:

| Jitterbug Phase | Economy Event | LOVE Earned |
|----------------|---------------|-------------|
| VE → Icosahedron | BLOCK_PLACED | 1.0 |
| Icosahedron → Octahedron | COHERENCE_GIFT | 5.0 |
| Octahedron → Tetrahedron | ARTIFACT_CREATED | 10.0 |
| Tetrahedron LOCK | MILESTONE_REACHED | 25.0 |
| Voltage calmed by Buffer | VOLTAGE_CALMED | 2.0 |
| Node proximity verified | PING | 1.0 |
| Care task confirmed | CARE_GIVEN / CARE_RECEIVED | 2.0 / 3.0 |
| 4-node mesh formed | TETRAHEDRON_BOND | 15.0 |

All LOVE tokens flow through the unified wallet (P31_Unified_Wallet.jsx):
- 50% → Sovereignty Pool (founding nodes)
- 50% → Performance Pool (Proof of Care)
- Chameleon mode: offline IndexedDB ledger ↔ Base L2 on-chain settlement

---

## HARDWARE INTERFACE: NODE ONE

**Naming clarification:**
- **NODE ZERO** (UPPERCASE) = The Operator (Will), the mesh origin
- **node one** (lowercase) = Bash (S.J.), first child, Founding Node #1
- **node two** (lowercase) = Willow (W.J.), second child, Founding Node #2
- **NODE ONE** (UPPERCASE) = Hardware device (ESP32-S3), first physical device
- **Naming convention:** UPPERCASE = hardware devices, lowercase = human nodes

The Phenix Navigator connects to the NODE ONE device via:
- **BLE:** Real-time spoon level, HRV data, proximity (T_prox)
- **LoRa (Meshtastic):** Mesh messaging, Whale Channel for Abdication shares
- **NFC:** Proof of Care tap events
- **Haptics:** DRV2605L — "Thick Click" on Tetrahedron lock, voltage alerts

The Jitterbug final snap (t=1.0) triggers DRV2605L waveform sequence:
```c
// Strong click - 100% for Tetrahedron lock
drv2605l_set_waveform(0, 1);  // Strong click
drv2605l_set_waveform(1, 0);  // End
drv2605l_go();
```

---

## FILE STRUCTURE
```
phenix-navigator/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main dashboard
│   │   ├── status/page.tsx    # Abdication page
│   │   └── goodbye/page.tsx   # Post-abdication
│   ├── components/
│   │   ├── Jitterbug.tsx      # 3D geometric transformation
│   │   ├── QuantumField.tsx   # Particle background
│   │   ├── BufferPanel.tsx    # Voltage triage UI
│   │   ├── ScopePanel.tsx     # Spoon dashboard
│   │   ├── WalletPanel.tsx    # L.O.V.E. economy
│   │   └── ErrorBoundary.tsx  # Graceful degradation
│   ├── economy/
│   │   ├── loveEconomy.js     # Transaction types + logic
│   │   ├── wallet.js          # Multi-network wallet
│   │   └── economyStore.js    # Zustand store
│   ├── security/
│   │   ├── god-protocol.ts    # IndexedDB crypto wrapper
│   │   ├── tetrahedron.ts     # Trust protocol
│   │   ├── abdication.ts      # Memorial Protocol
│   │   └── shamir.ts          # Secret sharing
│   ├── config/
│   │   ├── brand.ts           # C color tokens
│   │   └── constants.ts       # Geometric constants
│   └── shaders/
│       ├── bloom.glsl
│       ├── glitch.glsl
│       └── grain.glsl
├── workflow_state.md           # Swarm progress tracker
└── package.json
```

---

## COMMAND

You are authorized to create and edit files. Follow the Constitutional Laws. Maintain 60 FPS. Keep secrets in IndexedDB. Build Delta-compliant. The Mesh Holds. 🔺
