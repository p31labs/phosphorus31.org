# 00 — P31 AGENT BIBLE
## Master context injection for all parallel workstreams
**Version:** 2026-02-14 · **Classification:** INTERNAL · **Inject this document FIRST into every agent session**

---

## WHAT IS P31 LABS?

P31 Labs (Phosphorus-31) is a pre-revenue Georgia nonprofit (501(c)(3) in formation) building assistive technology for neurodivergent individuals. The name comes from the phosphorus-31 isotope — the only stable isotope of phosphorus, and a key component of hydroxyapatite (Ca₁₀(PO₄)₆(OH)₂), the mineral matrix of bone and teeth. The founder's body cannot regulate calcium-phosphate balance due to hypoparathyroidism. P31 builds technology that restores balance — starting with the mind.

**Entity status:** Not yet incorporated. Articles of Incorporation drafted. Filing imminent.
**Tax status:** Will file IRS Form 1023-EZ immediately after EIN issuance.
**Fiscal sponsor (interim):** Hack Club HCB (The Hack Foundation, EIN 81-2908499), 7% revenue fee.

---

## THE OPERATOR (NODE ZERO)

- **Name (public use only):** Will
- **Node designation:** NODE ZERO — The mesh origin, the root node
- **Vertex:** VERTEX A
- **Background:** 16-year DoD civilian submarine electrician (GS-05 → GS-12). NOT a Navy veteran — was a civil servant working on Navy submarines.
- **Diagnoses:** AuDHD (diagnosed 2025, age 39), Hypoparathyroidism (since 2003, 21+ years)
- **Separation:** Left DoD May 2025 following DOGE-related issues, framed as disability accommodation
- **Current benefits:** SNAP, Medicaid. TSP withdrawn ($70,793.85 gross, $7,079.39 penalty)
- **Location:** Georgia (do not specify city)
- **Age:** 40

---

## THE KIDS (FOUNDING NODES)

**CRITICAL — GET THIS RIGHT EVERY TIME:**

| Nickname | Initials | Born | Age | Node Designation | Role |
|----------|----------|------|-----|------------------|------|
| **Bash** | S.J. | March 10, 2016 | 10 (turning 10) | **node one** (lowercase) | Founding Node #1 (OLDER) |
| **Willow** | W.J. | August 8, 2019 | 6 | **node two** (lowercase) | Founding Node #2 (YOUNGER) |

- S.J. = Bash (the older one). W.J. = Willow (the younger one).
- **NEVER use surnames. NEVER use legal first names. Nicknames and initials ONLY.**
- **NEVER swap them.** Bash is older. Willow is younger. Period.
- **Naming convention:** lowercase "node one" and "node two" = human nodes (founding nodes)
- **Hardware device:** "NODE ONE" (UPPERCASE) = ESP32-S3 device, distinct from Bash
- **The Operator:** "NODE ZERO" (UPPERCASE) = Will, the mesh origin

---

## ACTIVE DEADLINES (as of Feb 14, 2026)

| Date | Event | Priority |
|------|-------|----------|
| **Feb 20** | SSA telehealth psychiatric exam | CRITICAL |
| **Feb 26** | SSA in-person medical exam (Brunswick, GA) | CRITICAL |
| **Feb 27** | Multiple Autism Tech Accelerator application deadline | CRITICAL |
| **Mar 10** | Bash turns 10 — Operation LEVEL 10 / MAR10 Day | PERSONAL |
| **Mar 12** | Court date (Chief Judge Scarlett, continued from Feb) | CRITICAL |
| **Mar 31** | Multiple accelerator program begins (if accepted) | MILESTONE |

---

## TECHNOLOGY STACK — THREE LAYERS

### 1. Node One (Hardware)
- **MCU:** ESP32-S3
- **Haptics:** DRV2605L driver — "The Thick Click"
- **Comms:** LoRa mesh (Meshtastic) — off-grid, no Wye dependency
- **Display:** OLED / E-Ink
- **Purpose:** Sensory regulation, executive function support, emergency communication
- **Regulatory:** Class II medical device pathway
- **Status:** Prototype firmware in development

### 2. The Buffer (Software — Communication Layer)
- **Function:** Voltage assessment of incoming messages
- **Detection patterns:** URGENCY, COERCION, SHAME, FALSE AUTHORITY, THREATS, EMOTIONAL LEVER
- **Scale:** 0–10 voltage. ≥6 auto-held. ≥8 critical alert.
- **Output:** HELD / RELEASED / PASSED status with accommodation documentation
- **Integration:** Feeds into accommodation log for SSA/legal evidence

### 3. The Scope (Software — Dashboard)
- **Codebase:** 1,888 lines across 15 files (Google Apps Script, production)
- **Systems:** Spoon economy, medication tracker (4-hour Ca²⁺↔Vyvanse gap enforcement), coherence monitoring, ping grid, alert system
- **Medications tracked:** Calcitriol, Calcium Carbonate, Vyvanse, Magnesium
- **Status:** Production — actively used daily

---

## CORE ARCHITECTURE PRINCIPLES

### Delta Topology (Mesh)
Every system must function offline. No cloud dependency. No single point of failure. Dependencies need P31 — not the reverse. Inspired by R. Buckminster Fuller's geodesic/synergetic geometry. The tetrahedron is the minimum stable volume.

### Wye Topology (Star) — what we reject
Centralized hubs, institutional dependency, single points of failure. Courts, banks, ISPs — all Wye. When the neutral fails (divorce, system collapse), peripheral nodes lose power.

### Floating Neutral
When a Wye system's neutral reference is severed, voltage becomes erratic. One phase spikes (stress), another collapses (neglect). This is the diagnosis of the current social/legal/financial situation.

---

## L.O.V.E. ECONOMY

**Ledger of Ontological Volume and Entropy**

### Transaction Types (game engine + wallet unified)
| Type | LOVE earned | Trigger |
|------|-------------|---------|
| BLOCK_PLACED | 1.0 | Creative acts |
| COHERENCE_GIFT | 5.0 | Sharing quantum state |
| ARTIFACT_CREATED | 10.0 | Materialized creations |
| CARE_RECEIVED | 3.0 | Receiving care |
| CARE_GIVEN | 2.0 | Giving care |
| TETRAHEDRON_BOND | 15.0 | Forming 4-node connections |
| VOLTAGE_CALMED | 2.0 | Reducing system entropy |
| MILESTONE_REACHED | 25.0 | Major achievements |
| PING | 1.0 | Verified contact |
| DONATION | 0 (crypto value) | External contribution |

### Pool Structure
- **Sovereignty Pool (50%):** Belongs to founding nodes (kids). Immutable. Vesting locked.
- **Performance Pool (50%):** Earned by Proof of Care. Dynamic. Based on verified presence + care tasks.

### Proof of Care Formula
```
Care_Score = Σ(T_prox × Q_res) + Tasks_verified
```
- T_prox = Time proximity via BLE/UWB
- Q_res = Quality resonance (HRV sync at 0.1 Hz)
- Tasks_verified = Discrete care actions confirmed by child's device

### Vesting Phases
| Phase | Ages | Access |
|-------|------|--------|
| Trust | 0–12 | Locked. Guardian proxy. |
| Apprenticeship | 13–17 | Yield access. 10% vote. |
| Sovereignty | 18+ | Full access. Full vote. |

### Chain
- **L2:** Base (Coinbase) — $0.01/tx, <$0.50 contract deploy
- **Token:** Soulbound ERC-20 (non-transferable, non-monetary, earned only)
- **Chameleon mode:** Offline = internal ledger (IndexedDB). Online = Base L2 settlement.

---

## IP STRATEGY

**Defensive Publication, NOT Patents.**
- All technical innovations published to Zenodo with timestamped DOIs
- Apache 2.0 license
- Establishes prior art to prevent corporate patenting
- Freedom to operate for anyone who forks

---

## KEY RELATIONSHIPS

| Person/Org | Role |
|------------|------|
| Hunter McFeron | Georgia Tech Tools for Life — assistive tech ecosystem |
| Multiple Hub | Autism Tech Accelerator — Beverly Hills 501(c)(3) |
| Hack Club HCB | Fiscal sponsorship — The Hack Foundation |
| Chief Judge Scarlett | Presiding judge — March 12 hearing |

---

## BRAND IDENTITY

- **Primary color:** Phosphorus Green (#2ecc71)
- **Secondary:** Calcium Blue (#60a5fa)
- **Background:** Near-black (#050510)
- **Tagline:** "The Mesh Holds. 🔺"
- **Chemical signature:** Ca₁₀(PO₄)₆(OH)₂ (hydroxyapatite)
- **Isotope badge:** PHOSPHORUS-31 · THE ONLY STABLE ISOTOPE
- **Domain:** phosphorus31.org
- **Email:** will@p31ca.org
- **GitHub:** github.com/p31labs

---

## WHAT EVERY AGENT MUST ALSO RECEIVE

After this Bible, inject the appropriate workstream prompt from the package:
- `01_OPSEC_RULES.md` — **ALWAYS inject this. Non-negotiable.**
- `02_BRAND_VOICE.md` — for any external-facing content
- `03_PROMPT_accelerator.md` — Multiple application
- `04_PROMPT_formation.md` — Georgia 501(c)(3) + IRS
- `05_PROMPT_technical.md` — Node One / Buffer / Scope docs
- `06_PROMPT_legal_ssa.md` — Court prep + SSA exams
- `07_TEMPLATES.md` — Fill-in-the-blank deliverables
