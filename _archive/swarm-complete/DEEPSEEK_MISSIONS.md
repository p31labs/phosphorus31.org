# P31 DEEPSEEK RESEARCH MISSIONS
## Paste-Ready Prompts for DeepSeek (R1 / V3 / Coder)

DeepSeek's edge: deep code reasoning, mathematical proof-level analysis, systems architecture, and cost-efficiency. These missions exploit what DeepSeek does better than anyone else — thinking through complex technical problems step by step.

---

## MISSION 1: Vite Build Triage
**Priority:** 🔴 Supports Swarm Delta
**Best model:** DeepSeek Coder / V3
**Paste this:**

```
I have a Vite + React + TypeScript monorepo that needs to build cleanly. The app is in ui/ within a larger monorepo.

Known context:
- tsconfig.build.json excludes StudioView.tsx, StudioCanvas.tsx, App.tsx from typecheck
- Vite uses esbuild for transpilation (not tsc), so most TS errors don't block builds
- The app uses Three.js, GSAP, Tone.js, React Router, Tailwind
- There are 100+ React components, 24 frontend libraries in ui/src/lib/
- Some imports may reference archived files that were moved to _archive/

When I run `cd ui && npm install && npm run build`, what are the most common failure modes for a project this size and how do I fix each one?

Specifically analyze:
1. Import resolution failures — how to find and fix broken imports pointing to moved/deleted files
2. TypeScript strict mode conflicts with esbuild's looser transpilation
3. Three.js + Vite compatibility issues (especially with workers, GLSL shaders, draco loader)
4. Tone.js AudioContext initialization in build vs. dev mode
5. Environment variable handling (import.meta.env.VITE_*) — what breaks if .env is missing?
6. Public directory static assets (ui/public/apps/ has 21 HTML files + apps.json) — does Vite copy these correctly?
7. CNAME file in public/ — does it survive the build?

For each failure mode, give me:
- The exact error message I'd see
- The one-line fix
- Whether it blocks the build or is just a warning

I need this build to succeed. I don't need it to be pretty. What's the minimum-fix path?
```

---

## MISSION 2: GAS Bridge Architecture Review
**Priority:** 🟡 Supports Swarm Delta
**Best model:** DeepSeek Coder
**Paste this:**

```
Review this Google Apps Script web app architecture and identify the failure modes:

The system:
1. GENESIS_GATE_APPS_SCRIPT — a Google Apps Script deployed as a web app
   - POST handler receives events from a React frontend
   - Processes L.O.V.E. economy events (activity logging, XP, LP mining)
   - Uses SHA-256 hashing for event integrity
   - Stores data in Google Sheets (the "database")
   - Returns JSON responses

2. gas-bridge.ts — a TypeScript module in a Vite/React frontend
   - Currently reads VITE_SHELTER_URL (wrong env var — should be VITE_GAS_URL)
   - Makes fetch() calls to the GAS web app URL
   - Handles CORS (GAS web apps have specific CORS behavior)

3. ConnectionsView — a React component that lets users configure the GAS URL
   - Stores the URL in localStorage at key 'p31:gas-url'

Questions:
1. GAS web apps have a specific CORS model — what are the exact headers GAS returns? Can a Vite dev server (localhost:5173) call a GAS web app directly, or do I need a proxy?

2. GAS web apps have two deployment modes: "Execute as me" vs "Execute as user accessing the web app." Which is correct for a public-facing frontend that doesn't require Google login?

3. When GAS returns a response, it wraps it in specific ways. What's the exact response format and how should gas-bridge.ts parse it?

4. Rate limiting: GAS web apps have quotas. What are the current limits for:
   - Requests per day
   - Requests per minute
   - Payload size
   - Script execution time

5. The localStorage → env var fallback pattern:
```typescript
const GAS_URL = (() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('p31:gas-url');
    if (stored) return stored;
  }
  return import.meta.env?.VITE_GAS_URL ?? '';
})();
```
Is this the right pattern? What are the security implications of storing a GAS URL in localStorage?

6. For the SHA-256 hashing in GAS — is Utilities.computeDigest() the right approach, and does it produce output compatible with Web Crypto API's SubtleCrypto.digest() on the frontend?

Provide a corrected gas-bridge.ts implementation that handles all of these edge cases.
```

---

## MISSION 3: SIC-POVM Fixed-Point Math Verification
**Priority:** 🟢 Supports firmware / prior art
**Best model:** DeepSeek R1 (reasoning mode)
**Paste this:**

```
I have an implementation of SIC-POVM (Symmetric Informationally Complete Positive Operator-Valued Measure) quantum state tomography running in fixed-point arithmetic on an ESP32-S3 microcontroller.

The key mathematical claim: SIC-POVM in dimension d=2 (single qubit) uses 4 measurement operators derived from vertices of a regular tetrahedron inscribed in the Bloch sphere.

The 4 SIC-POVM elements for a qubit are:
Π_i = (1/2)(I + r_i · σ)

where r_i are the 4 vertices of the tetrahedron:
r_1 = (0, 0, 1)
r_2 = (2√2/3, 0, -1/3)
r_3 = (-√2/3, √6/3, -1/3)
r_4 = (-√2/3, -√6/3, -1/3)

And σ = (σ_x, σ_y, σ_z) are the Pauli matrices.

Verify:
1. Do these 4 vectors form a valid SIC-POVM? (Check: Σ Π_i = I, each Π_i is positive semidefinite, Tr(Π_i Π_j) = (1/3) for i ≠ j in d=2)

2. In fixed-point Q15 arithmetic (signed 16-bit, 15 fractional bits), what's the maximum accumulated error after computing all 4 measurement probabilities for an arbitrary input state?

3. The tomographic reconstruction formula: ρ = Σ (3p_i - 1/2) Π_i where p_i are measured probabilities. In fixed-point Q15, what precision can we achieve for the reconstructed density matrix elements?

4. Is this implementation novel? Search for prior art: has anyone published SIC-POVM tomography implemented in fixed-point arithmetic on a microcontroller? I believe this is genuinely new.

5. For a defensive publication: what are the key mathematical claims I should document to establish prior art for "SIC-POVM quantum state tomography implemented in fixed-point arithmetic on resource-constrained embedded systems"?

Show all math step by step. I need this to be rigorous enough for a Zenodo publication.
```

---

## MISSION 4: Maxwell's Rule & Geodesic Rigidity
**Priority:** 🟢 Supports framework validation
**Best model:** DeepSeek R1 (reasoning mode)
**Paste this:**

```
My software implements Buckminster Fuller's geodesic framework with Maxwell's Rule validation.

Maxwell's Rule: For a 3D truss to be statically determinate (exactly rigid), the relationship E ≥ 3V - 6 must hold, where E = number of edges (bars) and V = number of vertices (joints).

My implementation (GeodesicFramework.ts) includes:
1. Tetrahedron: V=4, E=6. Check: 6 ≥ 3(4)-6 = 6. Exactly rigid. ✓
2. Octahedron: V=6, E=12. Check: 12 ≥ 3(6)-6 = 12. Exactly rigid. ✓
3. Icosahedron: V=12, E=30. Check: 30 ≥ 3(12)-6 = 30. Exactly rigid. ✓

Questions:
1. Is Maxwell's Rule sufficient for rigidity, or only necessary? (I know there are counterexamples — the "double banana" — but are regular polyhedra always safe?)

2. For geodesic dome generation from a frequency-n subdivision of an icosahedron:
   - At frequency n=2: V=42, E=120, F=80. Does Maxwell's Rule hold?
   - At frequency n=3: V=?, E=?, F=?. Calculate and verify.
   - General formula for frequency-n geodesic dome: V(n), E(n), F(n)?

3. My "coherence metric" is defined as: coherence = E / (3V - 6). A value of 1.0 = exactly rigid. >1.0 = over-constrained (redundant). <1.0 = under-constrained (mechanism). Is this a valid metric? Does it appear in structural engineering literature under another name?

4. I use this framework as a metaphor for organizational/information architecture: "Every P31 Labs decision is anchored to 4 points (Technical Feasibility, Legal Compliance, Medical Necessity, Operational Security) forming a tetrahedron." Is the mathematical analogy sound? Can you formalize what "rigidity" means when the vertices represent decision domains rather than physical points?

5. For a Zenodo publication: what mathematical claims can I make about the relationship between geodesic rigidity and information architecture? Is there prior art on applying Maxwell's Rule to non-physical systems?
```

---

## MISSION 5: Proof of Care Formula Analysis
**Priority:** 🟡 Supports L.O.V.E. economy
**Best model:** DeepSeek R1
**Paste this:**

```
Analyze this formula for a "Proof of Care" system — a care-economy metric that quantifies parental engagement:

Care_Score = Σ(T_prox × Q_res) + Tasks_verified

Where:
- T_prox = Time proximity with 24-hour half-life decay: T_prox(t) = 2^(-t/24) where t = hours since last interaction
- Q_res = Quality resonance (0 to 1), derived from HRV (heart rate variability) synchronization between parent and child
- Tasks_verified = count of independently verified care tasks (medication given, homework helped, meals prepared, etc.)
- The sum runs over all interaction events in a scoring period

Additional rules from the implementation (ProofOfCareManager.ts):
- Duration factor: interactions under 5 minutes are weighted 0.5x
- Engagement depth: passive presence (same room) = 0.3, active engagement = 0.7, focused interaction = 1.0
- Bond strength: running average of last 30 Care_Scores, normalized to 0-100

Questions:
1. Is the 24-hour half-life mathematically sound? What happens to the score if a parent has one 8-hour visit per week vs. daily 1-hour visits? Calculate both scenarios over 30 days. Which pattern scores higher and is that the RIGHT outcome?

2. The HRV synchronization (Q_res) — is there actual research supporting that parent-child HRV sync correlates with care quality? Find relevant papers.

3. Is this formula gameable? How would a bad-faith actor maximize their Care_Score while minimizing actual care? Identify the exploits.

4. Propose improvements to make the formula more robust:
   - Should there be a minimum interaction threshold per period?
   - Should consecutive days count more than sporadic visits (streak bonus)?
   - How to handle the "quality vs. quantity" tradeoff mathematically?

5. For a family court context: if this data were presented as evidence of parental engagement, what would a judge need to understand about how the score is calculated? Write a 3-paragraph plain-English explanation suitable for a legal brief.

Show all calculations step by step.
```

---

## MISSION 6: Posner Molecule — Literature Synthesis
**Priority:** 🟢 Supports naming thesis / Substack
**Best model:** DeepSeek R1
**Paste this:**

```
Synthesize the current state of research on Posner molecules (Ca₉(PO₄)₆) and quantum cognition.

Start with Matthew Fisher's 2015 paper "Quantum Cognition: The possibility of processing with nuclear spins in the brain" (Annals of Physics, 362, 593-602).

Then trace the research forward:
1. What experimental evidence has emerged since 2015 supporting or refuting Fisher's hypothesis?
2. Have Posner molecules been synthesized and studied in laboratory conditions?
3. What is the current estimated decoherence time for nuclear spins in Posner molecules at biological temperatures?
4. What role does Phosphorus-31 (spin-1/2) specifically play vs. other nuclei?
5. What is the relationship between Posner molecules and pyrophosphatase enzymes?
6. Has anyone proposed engineering applications based on Posner molecule quantum properties?

Also research the Escolà-Gil connection:
- Escolà-Gil et al. published on phospholipid metabolism and calcium signaling
- Is there published work connecting Escolà-Gil's lipid research to Fisher's quantum cognition hypothesis?
- The "Fisher-Escolà synthesis" — has anyone formally proposed this bridge?

For P31 Labs context: we named our nonprofit after Phosphorus-31 because it's the NMR-active nucleus in Posner molecules. Our domain p31ca.org literally encodes Ca₉(PO₄)₆ (P31 + Ca). We build assistive technology for neurodivergent brains. The thesis is that understanding cognition at the quantum level informs how we design cognitive prosthetics.

Provide:
1. A bibliography of the 10 most important papers in this space (2015-2026)
2. Current consensus: is quantum cognition via Posner molecules plausible, fringe, or debunked?
3. What would I need to cite in a Zenodo publication to make the P31 Labs naming thesis scientifically defensible?
```

---

## MISSION 7: ESP32-S3 Secure Boot + SE050 Integration
**Priority:** 🟢 Supports firmware
**Best model:** DeepSeek Coder
**Paste this:**

```
I'm building an assistive wearable on ESP32-S3 with NXP SE050 secure element integration.

Current firmware stack:
- ESP-IDF (or Arduino framework)
- SIC_POVM_Tomography_FixedPoint.cpp — quantum state tomography
- SE050 secure element for key storage
- Secure boot provisioning via Python script
- LoRa (Meshtastic) for mesh communication
- DRV2605L haptic motor driver
- OLED display

Questions:
1. SE050 + ESP32-S3 integration:
   - What's the communication interface? (I2C? SPI?)
   - What ESP-IDF component or Arduino library do I use?
   - How do I store Ed25519 keys on the SE050?
   - Can the SE050 perform Ed25519 signing directly, or do I extract the key and sign on the ESP32?

2. Secure boot chain for ESP32-S3:
   - What are the exact steps to enable secure boot v2?
   - How do I sign firmware images?
   - Can I use the SE050 as the root of trust for secure boot, or does ESP32 have its own eFuse-based boot key?
   - What happens if secure boot fails? Is the device bricked?

3. LoRa + Meshtastic + secure element:
   - Meshtastic has its own encryption. Can I layer SE050-backed encryption on top?
   - What's the message overhead of adding a Ed25519 signature to each Meshtastic packet?
   - At 0.350 kbps (LoRa), how much does signature overhead impact throughput?

4. Power budget:
   - ESP32-S3 + SE050 + DRV2605L + OLED + LoRa
   - What's the estimated power consumption in each mode (active, deep sleep, haptic firing)?
   - With a 1000mAh LiPo, what's realistic battery life?

5. For CE/FCC compliance (referenced in existing compliance docs):
   - What are the main regulatory hurdles for a LoRa device with a secure element?
   - Does the SE050 have any export control implications (BIS classification)?

Provide code snippets for the SE050 initialization and key storage on ESP32-S3.
```

---

## HOW TO USE

1. Open chat.deepseek.com or use the API
2. Copy one mission prompt
3. Paste and run (DeepSeek R1 for math/reasoning, V3/Coder for code)
4. Save output
5. Feed findings back into the appropriate swarm

**Mission → Swarm mapping:**
| Mission | Feeds Into | Why DeepSeek |
|---------|------------|-------------|
| 1 (Vite Triage) | Delta | Code reasoning, failure mode analysis |
| 2 (GAS Bridge) | Delta | API architecture, CORS edge cases |
| 3 (SIC-POVM Math) | Prior art / firmware | Mathematical proof verification |
| 4 (Maxwell's Rule) | Framework / Zenodo | Structural math, formalization |
| 5 (Proof of Care) | L.O.V.E. / Gamma | Formula analysis, game theory |
| 6 (Posner Molecule) | Beta / naming thesis | Literature synthesis, citation |
| 7 (ESP32 + SE050) | Firmware | Embedded systems, security |
