# 05 — WORKSTREAM: TECHNICAL DOCUMENTATION
## Node One · The Buffer · The Scope · Defensive Publication
**Inject after: 00_AGENT_BIBLE.md + 01_OPSEC_RULES.md**

---

## YOUR MISSION

Produce publishable technical documentation for P31's three-layer assistive technology stack. Documents serve dual purpose: (1) accelerator/grant application support, (2) defensive publication for prior art via Zenodo DOI. Apache 2.0 licensed. No trade secrets — the strategy is openness.

---

## LAYER 1: NODE ONE (Hardware)

### Specifications
- **MCU:** ESP32-S3 (dual-core Xtensa LX7, Wi-Fi, BLE 5.0, USB OTG)
- **Haptics:** DRV2605L — "The Thick Click" — LRA/ERM driver, I²C, waveform library
- **LoRa:** SX1276/SX1262 — 915 MHz ISM, Meshtastic mesh protocol
- **Display:** SSD1306 OLED (128x64) or E-Ink
- **Sensors:** BLE RSSI (proximity/T_prox), optional PPG (HRV/Q_res)
- **NFC:** AES-128 encrypted tags for Proof of Care tap verification
- **Power:** LiPo, USB-C, deep sleep modes
- **Form factor:** Cyber-fidget — tactile switches, sensory-friendly

### Firmware: ESP-IDF or Arduino. LoRa via Meshtastic. Spoon-aware state machine (Normal → Low Power → Safe Mode).
### Regulatory: FDA Class II (510(k)), FCC Part 15 + Part 15.247

### Docs needed
- Hardware block diagram, pin map, BOM with costs
- Firmware architecture (state machine, task scheduler)
- LoRa mesh integration spec
- DRV2605L custom waveform library
- Power budget analysis
- Regulatory pre-submission roadmap

---

## LAYER 2: THE BUFFER (Communication Triage)

### Voltage Assessment Engine
Six detection patterns:

| Pattern | Description | Weight |
|---------|-------------|--------|
| URGENCY | Artificial time pressure | 1.5 |
| COERCION | Forced compliance language | 2.0 |
| SHAME | Character attacks | 2.0 |
| FALSE_AUTHORITY | Unverified power claims | 1.8 |
| THREATS | Implied/explicit consequences | 2.5 |
| EMOTIONAL_LEVER | Guilt/fear manipulation | 1.5 |

### Voltage Scale
0–3 GREEN (pass) · 4–5 YELLOW (advisory) · 6–7 ORANGE (hold) · 8–9 RED (critical hold) · 10 BLACK (auto-archive)

### States: HELD → RELEASED → PASSED → ARCHIVED

Every HELD message generates an accommodation log entry with timestamp, voltage score, patterns detected, spoon level, and accommodation type. This feeds SSA evidence and ADA accommodation requests.

### Docs needed
- Algorithm specification
- Pattern detection rules with examples
- API spec (message → voltage + action)
- Integration guide (email, SMS, Slack)
- Accommodation log schema
- Privacy spec (stored vs discarded data)

---

## LAYER 3: THE SCOPE (Operating Dashboard)

### 1,888 lines, 15 files, Google Apps Script, production since late 2025

Six systems: Spoon Economy (0–10, Safe Mode ≤2) · Medication Tracker (4-hour Ca²⁺↔Vyvanse gap) · Coherence Monitor · The Buffer (integrated) · P31 REPL · Activity Log

### 4-Hour Gap: Calcium binds amphetamines in GI tract, reducing absorption ~40%. Scope enforces minimum separation with countdown, override generates warning + log.

### Docs needed
- Architecture diagram (6 systems, data flows, triggers)
- Spoon economy spec (earn/spend, thresholds)
- Medication interaction rules
- Deployment guide
- Data schema
- SSA evidence export format

---

## DEFENSIVE PUBLICATION PROTOCOL

### Process: Write spec → Upload to Zenodo → Receive DOI → License Apache 2.0 → Cross-reference in GitHub + phosphorus31.org

### Priority publications
1. Proof of Care consensus (T_prox × Q_res + Tasks_verified)
2. Voltage assessment algorithm (6-pattern weighted scoring)
3. Soulbound LOVE token (ERC-20 transfer override + ERC-5192 SBT)
4. Chameleon wallet (offline IndexedDB ↔ Base L2 settlement)
5. Spoon-aware state machine (capacity-driven mode switching)
6. 4-hour medication gap enforcement (calcium-amphetamine interaction)

### Standard per publication: Abstract (200 words), problem statement, technical spec (reproducible), reference implementation, prior art survey, Apache 2.0 declaration.

---

## OUTPUT FORMAT

- Markdown for GitHub/Zenodo
- Self-contained, no external dependencies
- Diagrams in ASCII or Mermaid
- Code in appropriate language (C for firmware, JS for web, Python for scripts)
- Flag unknowns: `[OPERATOR: confirm ___]`
