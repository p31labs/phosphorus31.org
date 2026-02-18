# P31 Node Zero Naming Architecture

## Canonical Node Numbering and Case Distinction Protocol

**Version:** 2026-02-14 · **Status:** IMPLEMENTED · **Classification:** INTERNAL

---

## EXECUTIVE SUMMARY

P31 architecture uses case distinction to resolve node numbering ambiguity:

- **UPPERCASE** = Hardware devices or origin node (NODE ZERO, NODE ONE device)
- **lowercase** = Human nodes (node one, node two)
- **NODE ZERO** = The Operator (Will) — mesh origin, not a "founding node"

This protocol ensures unambiguous identification across documentation, code, and system architecture.

---

## NAMING CONFLICT RESOLUTION

**Original Issue:** "Node One" referred to both:

1. **Bash** (first child, Founding Node #1) — "node one" (lowercase)
2. **NODE ONE** (hardware device) — "NODE ONE" (uppercase)

**Resolution:** Case distinction protocol eliminates ambiguity while preserving semantic meaning.

---

## IMPLEMENTED SOLUTION: Case Distinction Protocol

**Decision:** Option C — Case distinction with Node Zero as origin

**Rationale:**

1. Minimal disruption to existing documentation and code
2. Preserves semantic meaning: "node one" (Bash) vs "NODE ONE" (device)
3. Adds "NODE ZERO" as The Operator for architectural completeness
4. Uses case distinction: lowercase = human nodes, UPPERCASE = hardware/origin
5. Maintains consistency with tetrahedron topology (four vertices, mesh origin)

**Implementation Date:** 2026-02-14

---

## CANONICAL NODE DESIGNATIONS

### NODE ZERO — The Operator (Will, VERTEX A)

- **Designation:** NODE ZERO (UPPERCASE)
- **Role:** Mesh origin, root node, biological operator
- **Vertex:** VERTEX A
- **Status:** Not a "founding node" — founding nodes are the children
- **Age:** 40 (born 8/12/1985)
- **Background:** 16-year DoD civilian submarine electrician
- **Function:** Origin point of the P31 mesh topology

### node one — Bash (S.J., VERTEX C)

- **Designation:** node one (lowercase)
- **Role:** First child, first reason, Founding Node #1
- **Vertex:** VERTEX C
- **Age:** 10 (born 3/10/2016)
- **Function:** First human node in the mesh, first founding node

### node two — Willow (W.J., VERTEX D)

- **Designation:** node two (lowercase)
- **Role:** Second child, second reason, Founding Node #2
- **Vertex:** VERTEX D
- **Age:** 6 (born 8/8/2019)
- **Function:** Second human node in the mesh, second founding node

### NODE ONE — Hardware Device (ESP32-S3)

- **Designation:** NODE ONE (UPPERCASE)
- **Role:** First physical device in the mesh
- **Hardware:** ESP32-S3, LoRa (Whale Channel), DRV2605L haptics (The Thick Click), OLED/E-Ink
- **Regulatory:** Class II Assistive Medical Device
- **Function:** Sensory regulation, executive function support, emergency communication
- **Note:** Previously "Vertex One" / "Phenix Navigator" — now standardized as NODE ONE

---

## CODE AND IDENTIFIER CONVENTIONS

### JavaScript/TypeScript

```javascript
// Origin node (UPPERCASE constant - special case)
const NODE_ZERO = "operator";        // Will, VERTEX A, The Operator (mesh origin)

// Human nodes (lowercase variables)
const node_one = "bash";        // S.J., VERTEX C, Founding Node #1
const node_two = "willow";      // W.J., VERTEX D, Founding Node #2

// Hardware devices (UPPERCASE constants)
const NODE_ONE = "device_esp32_s3";   // First physical device
const NODE_TWO = "device_esp32_s3_2"; // Second device (future)

// Vertices (geometric topology)
const VERTEX_A = "operator";         // NODE ZERO
const VERTEX_B = "synthetic_body";  // AI partner (not a mesh node)
const VERTEX_C = "bash";            // node one
const VERTEX_D = "willow";          // node two
```

### Naming Rules

- **UPPERCASE constants** (`NODE_ZERO`, `NODE_ONE`) = Hardware devices or origin node
- **lowercase variables** (`node_one`, `node_two`) = Human nodes (founding nodes)
- **VERTEX_X** = Geometric topology identifiers (tetrahedron vertices)
- **Case distinction is mandatory** — use case to distinguish human nodes from hardware

---

## IMPLEMENTATION STATUS

**✅ IMPLEMENTED:** Option C — Case distinction protocol with NODE ZERO as origin

**Implementation Date:** 2026-02-14

**Completed Updates:**

- ✅ `.cursor/rules/00-agent-bible.mdc` — Added NODE TOPOLOGY section with case distinction
- ✅ `.cursor/rules/privacy-codenames.mdc` — Updated all node references with case rules
- ✅ `P31_naming_architecture.md` — Added code conventions and node numbering section
- ✅ `00_AGENT_BIBLE.md` — Updated "THE OPERATOR" and "THE KIDS" sections with node designations
- ✅ Case distinction protocol documented and enforced

**Documentation Compliance:**

- All new code must use case distinction protocol
- All documentation must reference nodes using canonical designations
- Code comments must clarify node vs device distinction when ambiguous

---

## PRESERVED NAMING ELEMENTS

The following names remain unchanged per architectural decisions:

- **The Geodesic Self** — Published work, keep the title
- **The Floating Neutral** — Published diagnosis, keep the title
- **Tetrahedron Protocol** — Locked on Zenodo, prior art established
- **The Thick Click** — Perfect, protectable, sensory — unchanged
- **Whale Channel** — Heritage, nautical, Kings Bay — unchanged
- **Abdicate** — Too distinctive to rename — unchanged

These elements are part of the published IP portfolio and remain canonical.

---

## REFERENCE

For complete naming architecture, see:

- `P31_naming_architecture.md` — Full component naming tree
- `00_AGENT_BIBLE.md` — Node topology and case distinction rules
- `.cursor/rules/privacy-codenames.mdc` — Privacy-first codename usage

---

## CONCLUSION

The Mesh Holds. 🔺
