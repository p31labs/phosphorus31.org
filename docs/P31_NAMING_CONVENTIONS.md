# P31 Labs Naming Conventions
## Branding-aligned naming system for all components, files, and identifiers

**Version:** 2026-02-14 · **Status:** ACTIVE · **Classification:** INTERNAL

---

## EXECUTIVE SUMMARY

P31 Labs naming conventions align with the branding system to ensure consistency across:
- **Visual Identity:** Periodic table metaphor (Phosphorus-31, Calcium)
- **Technical Architecture:** Tetrahedron topology, node numbering, case distinction
- **Brand Voice:** Direct, technical, accessible language
- **Code & Files:** Consistent identifiers, file naming, component structure

**Core Principle:** Every name should trace back to the periodic table metaphor, tetrahedron topology, or the calcium-phosphate balance if you pull the thread.

---

## BRANDING ALIGNMENT

### Periodic Table Metaphor

**Primary Brand Elements:**
- **P31** — Phosphorus-31 (the only stable isotope)
- **P** — Element symbol (periodic table card)
- **15** — Atomic number
- **30.97376** — Atomic mass
- **Ca** — Calcium (balancing element)
- **20** — Calcium atomic number
- **40.078** — Calcium atomic mass

**Naming Implications:**
- Use "P31" as root identifier (not "P31Labs", "P31_Labs", or "phosphorus31")
- Chemical notation: P³¹, Ca²⁺, Ca₁₀(PO₄)₆(OH)₂ (proper superscripts/subscripts)
- Element references: Use full names in documentation, symbols in code

### Color-Coded Categories

**Navigation Structure:**
- **HARDWARE** — Dark green accent (`#1b7a5a`)
- **SOFTWARE** — Dark orange accent (`#FF6B35` or `#8B4513`)
- **PROTOCOL** — Dark blue accent (`#4A90E2`)

**Naming Implications:**
- Hardware components: Use "NODE ONE", "NODE TWO" (UPPERCASE)
- Software components: Use "THE BUFFER", "THE SCOPE" (article + UPPERCASE)
- Protocol components: Use "WHALE CHANNEL", "PING", "ABDICATE" (UPPERCASE)

---

## NODE NUMBERING & CASE DISTINCTION

### Canonical Node Designations

**UPPERCASE = Hardware Devices or Origin Node:**
- **NODE ZERO** — The Operator (Will, VERTEX A, mesh origin)
- **NODE ONE** — ESP32-S3 hardware device
- **NODE TWO** — Future hardware device

**lowercase = Human Nodes (Founding Nodes):**
- **node one** — Bash (S.J., VERTEX C, Founding Node #1)
- **node two** — Willow (W.J., VERTEX D, Founding Node #2)

**Case Distinction Rules:**
- Use case to distinguish human nodes from hardware devices
- UPPERCASE constants (`NODE_ZERO`, `NODE_ONE`) = hardware/origin
- lowercase variables (`node_one`, `node_two`) = human nodes
- **Mandatory:** Case distinction must be enforced in all code and documentation

### Code Identifiers

```javascript
// Human nodes (lowercase variables)
const node_zero = "operator";  // Will, VERTEX A, NODE ZERO
const node_one = "bash";        // S.J., VERTEX C, Founding Node #1
const node_two = "willow";      // W.J., VERTEX D, Founding Node #2

// Hardware devices (UPPERCASE constants)
const NODE_ZERO = "operator";        // The Operator (special case: origin)
const NODE_ONE = "device_esp32_s3";   // First physical device
const NODE_TWO = "device_esp32_s3_2"; // Second device (future)

// Vertices (geometric topology)
const VERTEX_A = "operator";         // NODE ZERO
const VERTEX_B = "synthetic_body";   // AI partner (not a mesh node)
const VERTEX_C = "bash";             // node one
const VERTEX_D = "willow";           // node two
```

---

## COMPONENT NAMING ARCHITECTURE

### Hardware Components

| Component | Naming Convention | Example |
|-----------|------------------|---------|
| **Device** | `NODE_ONE`, `NODE_TWO` | UPPERCASE, underscore-separated |
| **Haptic System** | `THE_THICK_CLICK` | Article + UPPERCASE, underscore |
| **Mesh Layer** | `WHALE_CHANNEL` | UPPERCASE, underscore |
| **Display** | `OLED`, `E_INK` | Acronym or UPPERCASE |

**File Naming:**
- `node_one/` — Hardware device directory
- `node_one_firmware/` — Firmware directory
- `whale_channel/` — Mesh communication layer
- `thick_click/` — Haptic system

### Software Components

| Component | Naming Convention | Example |
|-----------|------------------|---------|
| **Communication Buffer** | `THE_BUFFER` | Article + UPPERCASE |
| **Dashboard** | `THE_SCOPE` | Article + UPPERCASE |
| **Heartbeat** | `PING` | UPPERCASE, single word |
| **Calibration** | `ATTRACTOR` | UPPERCASE, single word |

**File Naming:**
- `the_buffer/` — Communication processing
- `the_scope/` — Dashboard/visualization
- `ping/` — Heartbeat system
- `attractor/` — Calibration system

### Protocol Components

| Component | Naming Convention | Example |
|-----------|------------------|---------|
| **Governance** | `ABDICATE` | UPPERCASE, single word |
| **Mesh Protocol** | `WHALE_CHANNEL` | UPPERCASE, underscore |
| **AI Protocol** | `THE_CENTAUR` | Article + UPPERCASE |
| **Philosophy** | `THE_FOLD` | Article + UPPERCASE |

**File Naming:**
- `abdicate/` — Governance system
- `whale_channel/` — Mesh protocol
- `the_centaur/` — AI partnership protocol
- `the_fold/` — Philosophy layer

---

## FILE NAMING CONVENTIONS

### Directory Structure

```
p31-labs/
├── node_one/              # Hardware device (UPPERCASE concept, lowercase dir)
├── the_buffer/            # Software component (article + lowercase)
├── the_scope/             # Dashboard (article + lowercase)
├── whale_channel/         # Protocol (lowercase, underscore)
├── abdicate/              # Governance (lowercase, single word)
└── docs/                  # Documentation
    ├── P31_BRANDING_SYSTEM.md
    ├── P31_NAMING_CONVENTIONS.md
    └── P31_NODE_ZERO_NAMING.md
```

### File Naming Rules

1. **Documentation Files:**
   - Format: `P31_COMPONENT_NAME.md` (UPPERCASE prefix, UPPERCASE component)
   - Examples: `P31_BRANDING_SYSTEM.md`, `P31_NAMING_CONVENTIONS.md`

2. **Code Files:**
   - Format: `component_name.ts` (lowercase, underscore-separated)
   - Examples: `node_one.ts`, `the_buffer.ts`, `whale_channel.ts`

3. **Configuration Files:**
   - Format: `p31.config.ts` or `component.config.ts` (lowercase)
   - Examples: `p31.config.ts`, `node_one.config.ts`

4. **Test Files:**
   - Format: `component_name.test.ts` (lowercase, `.test` suffix)
   - Examples: `node_one.test.ts`, `the_buffer.test.ts`

---

## CODE NAMING CONVENTIONS

### TypeScript/JavaScript

**Constants (UPPERCASE):**
```typescript
const NODE_ZERO = "operator";
const NODE_ONE = "device_esp32_s3";
const THE_BUFFER = "communication_buffer";
const WHALE_CHANNEL = "lora_mesh_915mhz";
```

**Variables (camelCase):**
```typescript
const nodeOne = "bash";
const nodeTwo = "willow";
const theBuffer = new Buffer();
const whaleChannel = new MeshChannel();
```

**Classes (PascalCase):**
```typescript
class NodeOne extends HardwareDevice {}
class TheBuffer extends CommunicationProcessor {}
class WhaleChannel extends MeshProtocol {}
```

**Interfaces/Types (PascalCase):**
```typescript
interface NodeOneConfig {}
interface BufferMessage {}
type WhaleChannelFrequency = 915;
```

### Python

**Constants (UPPERCASE):**
```python
NODE_ZERO = "operator"
NODE_ONE = "device_esp32_s3"
THE_BUFFER = "communication_buffer"
```

**Variables/Functions (snake_case):**
```python
node_one = "bash"
node_two = "willow"
def process_buffer_message():
    pass
```

**Classes (PascalCase):**
```python
class NodeOne(HardwareDevice):
    pass

class TheBuffer(CommunicationProcessor):
    pass
```

### C/C++ (Firmware)

**Constants (UPPERCASE):**
```c
#define NODE_ZERO "operator"
#define NODE_ONE "device_esp32_s3"
#define WHALE_CHANNEL_FREQ 915000000
```

**Functions (snake_case):**
```c
void node_one_init(void);
void whale_channel_send(uint8_t* data, size_t len);
void thick_click_trigger(uint8_t pattern);
```

**Structs/Types (snake_case with _t suffix):**
```c
typedef struct {
    uint8_t node_id;
    uint32_t frequency;
} whale_channel_config_t;
```

---

## DATABASE NAMING CONVENTIONS

### Tables (snake_case, plural)

```sql
CREATE TABLE nodes (
    id INTEGER PRIMARY KEY,
    node_type TEXT NOT NULL,  -- 'NODE_ZERO', 'node_one', 'NODE_ONE', etc.
    vertex TEXT NOT NULL       -- 'VERTEX_A', 'VERTEX_C', etc.
);

CREATE TABLE buffer_messages (
    id INTEGER PRIMARY KEY,
    voltage REAL NOT NULL,     -- 0-10 scale
    status TEXT NOT NULL       -- 'HELD', 'RELEASED', 'PASSED'
);

CREATE TABLE ping_logs (
    id INTEGER PRIMARY KEY,
    from_node TEXT NOT NULL,
    to_node TEXT NOT NULL,
    timestamp INTEGER NOT NULL
);
```

### Columns (snake_case)

- Use descriptive names: `node_type`, `voltage_level`, `ping_timestamp`
- Avoid abbreviations unless standard: `id`, `uuid`, `url`
- Boolean columns: `is_active`, `has_connection`, `can_send`

---

## API NAMING CONVENTIONS

### REST Endpoints (lowercase, hyphen-separated)

```
GET    /api/v1/nodes
GET    /api/v1/nodes/node-one
POST   /api/v1/buffer/messages
GET    /api/v1/buffer/messages/:id
POST   /api/v1/ping
GET    /api/v1/whale-channel/status
```

### GraphQL (camelCase)

```graphql
type Query {
  nodeOne: Node
  theBuffer: Buffer
  whaleChannel: MeshChannel
}

type Node {
  nodeType: String!
  vertex: String!
  status: NodeStatus!
}
```

---

## ENVIRONMENT VARIABLES

**Format:** `P31_COMPONENT_SETTING` (UPPERCASE, underscore-separated)

```bash
P31_NODE_ZERO_ID=operator
P31_NODE_ONE_FREQ=915000000
P31_WHALE_CHANNEL_ENABLED=true
P31_BUFFER_VOLTAGE_THRESHOLD=6.0
P31_SCOPE_REFRESH_RATE=1000
```

---

## CHEMICAL NOTATION IN CODE

### Proper Unicode Characters

```typescript
// Isotopes
const PHOSPHORUS_31 = "P³¹";  // or "³¹P"
const CALCIUM_40 = "Ca⁴⁰";

// Ions
const CALCIUM_ION = "Ca²⁺";
const PHOSPHATE_ION = "PO₄³⁻";

// Formulas
const HYDROXYAPATITE = "Ca₁₀(PO₄)₆(OH)₂";
```

### ASCII Fallbacks (for code identifiers)

```typescript
// Use ASCII in identifiers, Unicode in display
const P31 = "phosphorus_31";
const CA2_PLUS = "calcium_ion";
const HYDROXYAPATITE_FORMULA = "Ca10_PO4_6_OH_2";
```

---

## BRAND VOICE ALIGNMENT

### Terminology Mapping

| Concept | P31 Term | Code Identifier | Brand Color |
|---------|----------|-----------------|-------------|
| Centralized system | Wye topology | `wye_topology` | (avoid - rejected pattern) |
| Decentralized system | Delta topology | `delta_topology` | Phosphorus Teal |
| System collapse | Lost Ground | `floating_neutral` | Alert Red |
| System stability | Green Board | `green_board` | Phosphorus Teal |
| Children | Founding Nodes | `founding_nodes` | Love Purple |
| Energy/capacity | Spoons | `spoons` | Gold |
| Internal currency | LOVE tokens | `love_tokens` | Love Purple |
| Message screening | Voltage assessment | `voltage_assessment` | Warning Orange |
| Dangerous message | High voltage | `high_voltage` | Alert Red |
| Safety mode | Safe Mode | `safe_mode` | Alert Red |
| Bond formation | Tetrahedron bond | `tetrahedron_bond` | Gold |
| IP strategy | Defensive publication | `defensive_publication` | Protocol Blue |

---

## NAMING PRINCIPLES

1. **Periodic Table First:** Every name should trace back to P31, Calcium, or chemical balance
2. **Case Distinction:** UPPERCASE = hardware/origin, lowercase = human nodes
3. **Plain Language:** The Buffer, not Tomograph. The Scope, not Dashboard.
4. **Verbs and Nouns:** Ping, Fold, Click, Chirp (action-oriented)
5. **Heritage Names:** Whale Channel, The Thick Click (preserve meaningful names)
6. **No Wye Language:** Avoid "hub," "center," "master," "admin" (rejected patterns)
7. **Accessibility:** Names must be screen-reader friendly, pronounceable
8. **Chemical Accuracy:** Use proper notation (P³¹, Ca²⁺) in documentation, ASCII in code

---

## BRANDING COMPLIANCE CHECKLIST

### For Developers
- [ ] Use `P31` as root identifier (not variations)
- [ ] Enforce case distinction (UPPERCASE = hardware, lowercase = human)
- [ ] Use proper chemical notation in documentation
- [ ] Follow file naming conventions (`P31_COMPONENT.md`, `component_name.ts`)
- [ ] Use brand terminology (Delta topology, not "mesh network")

### For Designers
- [ ] Use Phosphorus Teal (`#50E3C2`) as primary brand color
- [ ] Reference periodic table element cards in designs
- [ ] Use proper chemical notation (P³¹, Ca²⁺, subscripts/superscripts)
- [ ] Follow navigation structure (HARDWARE, SOFTWARE, PROTOCOL)

### For Content Creators
- [ ] Use P31 terminology (Founding Nodes, not "children")
- [ ] Include isotope badge when appropriate
- [ ] Use tagline "The Mesh Holds. 🔺" consistently
- [ ] Follow brand voice (engineer who cares, not corporate)

---

## EXAMPLES

### ✅ Correct Naming

```typescript
// Component names
import { NodeOne } from './node_one';
import { TheBuffer } from './the_buffer';
import { WhaleChannel } from './whale_channel';

// Constants
const NODE_ZERO = "operator";
const NODE_ONE = "device_esp32_s3";
const PHOSPHORUS_31 = "P³¹";

// Variables
const nodeOne = "bash";
const nodeTwo = "willow";
const theBuffer = new TheBuffer();
```

### ❌ Incorrect Naming

```typescript
// Wrong: Mixed case, no distinction
const NodeOne = "bash";  // Should be: nodeOne (human) or NODE_ONE (hardware)

// Wrong: Brand variation
const P31Labs = "brand";  // Should be: P31

// Wrong: Wye language
const hub = "central";  // Should be: delta_topology or mesh_node

// Wrong: Chemical notation in code
const P31 = "P³¹";  // Should use ASCII in code: "phosphorus_31" or "P31"
```

---

## REFERENCE

**Related Documents:**
- `P31_BRANDING_SYSTEM.md` — Complete visual identity guidelines
- `P31_NODE_ZERO_NAMING.md` — Node numbering and case distinction
- `P31_naming_architecture.md` — Full component naming tree
- `02_BRAND_VOICE.md` — Voice and terminology guide
- `00_AGENT_BIBLE.md` — Core mission and identity

---

## CONCLUSION

The Mesh Holds. 🔺

**Phosphorus-31. The only stable isotope. The atom in the bone.**

Every name should reflect the periodic table metaphor, tetrahedron topology, and the calcium-phosphate balance that defines P31 Labs.