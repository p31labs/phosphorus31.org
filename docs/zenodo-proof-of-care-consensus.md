# Proof of Care Consensus: A Cryptographic Protocol for Verifiable Care Metrics in Assistive Technology Systems

**Authors:** P31 Labs  
**License:** Apache 2.0  
**Publication Date:** 2026-02-14  
**DOI:** [To be assigned by Zenodo]  
**Version:** 1.0.0

---

## Abstract

We present a cryptographic consensus protocol for quantifying and verifying care interactions in assistive technology systems. The Proof of Care consensus mechanism combines proximity sensing (T_prox), physiological resonance measurement (Q_res), and task verification (Tasks_verified) to generate a tamper-resistant care score. This protocol enables trustless verification of care activities without requiring centralized authority or surveillance infrastructure. The system is designed for offline-first operation, supporting mesh network topologies where traditional cloud-based verification is unavailable. We provide a complete technical specification, reference implementation, and security analysis. This work establishes prior art for care verification systems in assistive technology applications, particularly for neurodivergent individuals and their support networks.

**Keywords:** Proof of Care, consensus protocol, assistive technology, proximity sensing, heart rate variability, mesh networks, cryptographic verification, offline-first systems

---

## 1. Problem Statement

### 1.1 The Care Verification Challenge

Traditional care verification systems rely on centralized logging, manual documentation, or surveillance infrastructure. These approaches present several critical limitations:

1. **Single Point of Failure:** Centralized systems create dependency on cloud infrastructure, violating offline-first principles required for resilient assistive technology.

2. **Privacy Violations:** Continuous surveillance of care interactions violates privacy principles and creates power imbalances in care relationships.

3. **Verification Gaps:** Manual documentation is subject to human error, bias, and gaming. Automated systems often lack cryptographic guarantees of authenticity.

4. **Network Dependency:** Cloud-based verification fails in offline scenarios, mesh networks, or during infrastructure outages—precisely when assistive technology is most needed.

5. **Trust Requirements:** Existing systems require trust in third-party verifiers, creating potential for manipulation or exclusion.

### 1.2 Design Requirements

A Proof of Care consensus protocol must satisfy:

- **Cryptographic Verification:** Care interactions must be verifiable without trusted third parties
- **Offline Operation:** System must function in mesh networks without internet connectivity
- **Privacy Preservation:** Minimize data collection while maintaining verification capability
- **Tamper Resistance:** Prevent gaming or manipulation of care scores
- **Low Bandwidth:** Operate efficiently on constrained networks (e.g., LoRa at 0.350 kbps)
- **Sensor Fusion:** Combine multiple independent signals to reduce false positives

---

## 2. Technical Specification

### 2.1 Core Formula

The Proof of Care consensus score is computed as:

```
Care_Score = Σ(T_prox × Q_res) + Tasks_verified
```

Where:
- **T_prox** = Time-weighted proximity score (0.0 to 1.0)
- **Q_res** = Quality resonance score (0.0 to 1.0)
- **Tasks_verified** = Discrete verified care actions (non-negative integer)

### 2.2 Component Definitions

#### 2.2.1 Time Proximity (T_prox)

**Definition:** Normalized measure of physical proximity between care provider and recipient over time.

**Measurement Method:**
- Primary: Bluetooth Low Energy (BLE) Received Signal Strength Indicator (RSSI)
- Secondary: Ultra-Wideband (UWB) time-of-flight (ToF) when available
- Fallback: Manual proximity confirmation via NFC tap

**Calculation:**
```
T_prox(t) = normalize(RSSI_to_distance(RSSI_avg(t_window)))
```

Where:
- `t_window` = Time window for averaging (default: 5 minutes)
- `RSSI_avg` = Average RSSI over time window
- `normalize()` = Maps distance to [0.0, 1.0] using sigmoid function

**Sigmoid Normalization:**
```
normalize(distance) = 1 / (1 + exp((distance - threshold) / scale))
```

Parameters:
- `threshold` = 2.0 meters (proximity threshold)
- `scale` = 0.5 meters (smoothing factor)

**Time Weighting:**
Recent proximity events are weighted more heavily using exponential decay:

```
T_prox_weighted = Σ(T_prox(t_i) × exp(-λ × (t_now - t_i)))
```

Where:
- `λ` = Decay constant (default: 0.001 per second)
- `t_i` = Timestamp of measurement i
- `t_now` = Current timestamp

**Output Range:** [0.0, 1.0] where 1.0 indicates continuous close proximity.

#### 2.2.2 Quality Resonance (Q_res)

**Definition:** Measure of physiological synchronization between care provider and recipient, indicating quality of interaction beyond mere presence.

**Measurement Method:**
- Primary: Heart Rate Variability (HRV) coherence at 0.1 Hz (10-second cycle)
- Sensor: Photoplethysmography (PPG) or electrocardiography (ECG)
- Analysis: Cross-correlation of HRV signals in the 0.08-0.12 Hz band

**Calculation:**
```
Q_res = coherence(HRV_provider, HRV_recipient, frequency: 0.1 Hz)
```

**Coherence Algorithm:**
1. Extract HRV time series from both devices (minimum 60 seconds of data)
2. Apply bandpass filter: 0.08-0.12 Hz (10-second cycle band)
3. Compute cross-spectral density
4. Calculate coherence magnitude:

```
coherence = |S_xy(f)|² / (S_xx(f) × S_yy(f))
```

Where:
- `S_xy(f)` = Cross-spectral density at frequency f
- `S_xx(f)` = Power spectral density of provider HRV
- `S_yy(f)` = Power spectral density of recipient HRV

**Thresholds:**
- `Q_res < 0.3`: Low coherence (noise or independent rhythms)
- `0.3 ≤ Q_res < 0.6`: Moderate coherence (possible interaction)
- `Q_res ≥ 0.6`: High coherence (strong physiological resonance)

**Privacy Considerations:**
- Raw HRV data is never transmitted
- Only coherence scores (single float) are shared
- Local computation on each device before transmission

**Output Range:** [0.0, 1.0] where 1.0 indicates perfect physiological synchronization.

#### 2.2.3 Tasks Verified (Tasks_verified)

**Definition:** Count of discrete care actions explicitly confirmed by the recipient's device.

**Verification Method:**
- Recipient device generates cryptographic challenge
- Provider device signs challenge with private key
- Recipient device verifies signature and confirms task completion

**Task Types:**
- Medication administration (NFC tap + timestamp)
- Meal preparation (manual confirmation via UI)
- Activity engagement (sensor-triggered confirmation)
- Emotional support (manual confirmation via UI)
- Safety check (proximity + time-based confirmation)

**Cryptographic Protocol:**
```
1. Recipient generates: challenge = hash(task_id || timestamp || nonce)
2. Recipient sends challenge to provider
3. Provider signs: signature = sign(challenge, provider_private_key)
4. Provider sends: (task_id, timestamp, signature) to recipient
5. Recipient verifies: verify(signature, challenge, provider_public_key)
6. If valid: Tasks_verified += 1
```

**Prevention of Gaming:**
- Each task_id can only be verified once per time window
- Timestamps must be within acceptable range (e.g., ±5 minutes)
- Nonces prevent replay attacks
- Signature verification prevents spoofing

**Output:** Non-negative integer representing cumulative verified tasks.

### 2.3 Score Aggregation

#### 2.3.1 Time Window Integration

The care score is computed over a configurable time window (default: 24 hours):

```
Care_Score = Σ(T_prox(t_i) × Q_res(t_i)) + Tasks_verified
```

Where the summation occurs over all time intervals `t_i` in the window.

#### 2.3.2 Normalization

For display and comparison purposes, the raw score can be normalized:

```
Care_Score_normalized = Care_Score / Care_Score_max
```

Where `Care_Score_max` is the theoretical maximum for the time window:
```
Care_Score_max = (window_duration / measurement_interval) × 1.0 × 1.0 + max_tasks
```

### 2.4 Consensus Mechanism

#### 2.4.1 Multi-Device Verification

When multiple devices observe the same care interaction:

1. Each device computes independent Care_Score
2. Devices exchange scores via mesh network
3. Consensus score = median of all reported scores
4. Outliers (>2 standard deviations) are excluded

**Rationale:** Median is robust to single-device failures or manipulation attempts.

#### 2.4.2 Cryptographic Commitments

To prevent retroactive manipulation:

1. Each device commits to Care_Score using hash commitment:
   ```
   commitment = hash(Care_Score || timestamp || device_id || nonce)
   ```
2. Commitments are broadcast to mesh network
3. After time window closes, devices reveal Care_Score
4. Other devices verify: `hash(Care_Score || timestamp || device_id || nonce) == commitment`

**Security Property:** Once committed, scores cannot be changed without detection.

### 2.5 Network Protocol

#### 2.5.1 Message Format

All Proof of Care messages use Protocol Buffers for efficient serialization:

```protobuf
message CareScore {
  required bytes device_id = 1;
  required uint64 timestamp = 2;
  required float t_prox = 3;
  required float q_res = 4;
  required uint32 tasks_verified = 5;
  required bytes commitment = 6;
  optional bytes signature = 7;
}

message CareConsensus {
  required uint64 window_start = 1;
  required uint64 window_end = 2;
  repeated CareScore scores = 3;
  required float consensus_score = 4;
}
```

#### 2.5.2 Transmission

- **Primary:** LoRa mesh network (915 MHz ISM band, Meshtastic protocol)
- **Secondary:** BLE mesh when LoRa unavailable
- **Fallback:** USB serial bridge

**Bandwidth Optimization:**
- Messages compressed using zlib
- Delta encoding for time series (send only changes)
- Aggregation: Send one message per time window, not per measurement

---

## 3. Reference Implementation

### 3.1 Pseudocode

```python
class ProofOfCare:
    def __init__(self, device_id, private_key, public_key):
        self.device_id = device_id
        self.private_key = private_key
        self.public_key = public_key
        self.tasks_verified = 0
        self.proximity_history = []
        self.hrv_history = []
        
    def measure_proximity(self, rssi, timestamp):
        """Measure T_prox from BLE RSSI"""
        distance = rssi_to_distance(rssi)
        t_prox = sigmoid_normalize(distance, threshold=2.0, scale=0.5)
        
        # Apply time weighting
        weighted = self._apply_time_weighting(t_prox, timestamp)
        self.proximity_history.append((weighted, timestamp))
        return weighted
    
    def measure_resonance(self, hrv_provider, hrv_recipient, duration=60):
        """Measure Q_res from HRV coherence"""
        if len(hrv_provider) < duration or len(hrv_recipient) < duration:
            return 0.0
        
        # Bandpass filter: 0.08-0.12 Hz
        provider_filtered = bandpass_filter(hrv_provider, 0.08, 0.12)
        recipient_filtered = bandpass_filter(hrv_recipient, 0.08, 0.12)
        
        # Compute coherence at 0.1 Hz
        coherence = compute_coherence(provider_filtered, recipient_filtered, 0.1)
        self.hrv_history.append((coherence, timestamp))
        return coherence
    
    def verify_task(self, task_id, challenge, recipient_public_key):
        """Verify a discrete care task"""
        # Verify signature
        if not verify_signature(challenge, self.signature, recipient_public_key):
            return False
        
        # Check for replay
        if task_id in self.verified_tasks:
            return False
        
        # Verify timestamp freshness
        if abs(timestamp - current_time()) > 300:  # 5 minutes
            return False
        
        self.tasks_verified += 1
        self.verified_tasks.add(task_id)
        return True
    
    def compute_care_score(self, window_start, window_end):
        """Compute Care_Score over time window"""
        # Filter measurements within window
        proximity_window = [
            (t_prox, t) for t_prox, t in self.proximity_history
            if window_start <= t <= window_end
        ]
        resonance_window = [
            (q_res, t) for q_res, t in self.hrv_history
            if window_start <= t <= window_end
        ]
        
        # Align time series (nearest neighbor interpolation)
        aligned = align_time_series(proximity_window, resonance_window)
        
        # Compute product sum
        product_sum = sum(t_prox * q_res for t_prox, q_res in aligned)
        
        # Add verified tasks
        care_score = product_sum + self.tasks_verified
        
        return care_score
    
    def create_commitment(self, care_score, timestamp):
        """Create cryptographic commitment to score"""
        nonce = generate_nonce()
        commitment = hash(care_score || timestamp || self.device_id || nonce)
        return commitment, nonce
    
    def reach_consensus(self, peer_scores):
        """Reach consensus with peer devices"""
        all_scores = [self.care_score] + peer_scores
        
        # Remove outliers (>2 standard deviations)
        mean = statistics.mean(all_scores)
        std = statistics.stdev(all_scores)
        filtered = [
            s for s in all_scores
            if abs(s - mean) <= 2 * std
        ]
        
        # Median is consensus
        consensus = statistics.median(filtered)
        return consensus
```

### 3.2 Hardware Requirements

**Minimum Specifications:**
- Microcontroller: ESP32-S3 (dual-core, BLE 5.0, Wi-Fi)
- BLE: RSSI measurement capability
- Optional: PPG sensor for HRV (e.g., MAX30102)
- Optional: UWB transceiver (e.g., DW1000) for precise ranging
- NFC: For task verification taps (e.g., PN532)
- LoRa: For mesh communication (e.g., SX1276)

**Power Budget:**
- BLE scanning: ~10 mA
- HRV measurement: ~5 mA (when active)
- LoRa transmission: ~120 mA (during TX)
- Deep sleep: <100 µA

**Estimated Battery Life:**
- Active monitoring: 8-12 hours (500 mAh battery)
- Periodic measurement (1/min): 3-5 days
- Deep sleep with wake-on-proximity: 2-4 weeks

### 3.3 Software Architecture

**Component Structure:**
```
proof-of-care/
├── core/
│   ├── proximity.py      # T_prox measurement
│   ├── resonance.py      # Q_res computation
│   ├── tasks.py          # Task verification
│   └── consensus.py      # Consensus mechanism
├── crypto/
│   ├── signatures.py     # ECDSA signing
│   ├── commitments.py    # Hash commitments
│   └── keys.py           # Key management
├── network/
│   ├── lora.py           # LoRa mesh transport
│   ├── ble.py            # BLE mesh transport
│   └── serial.py         # USB serial bridge
└── storage/
    ├── sqlite.py         # Local state (sqlite-wasm)
    └── indexeddb.py       # Browser storage (IndexedDB)
```

**State Machine:**
```
IDLE → MEASURING_PROXIMITY → MEASURING_RESONANCE → 
COMPUTING_SCORE → COMMITTING → CONSENSUS → STORED
```

---

## 4. Security Analysis

### 4.1 Threat Model

**Adversarial Capabilities:**
- Passive observer (eavesdropping on network)
- Active attacker (can inject/modify messages)
- Compromised device (one device in mesh is malicious)
- Sybil attack (multiple fake devices)

**Security Goals:**
1. **Authenticity:** Care scores cannot be forged
2. **Integrity:** Scores cannot be modified after commitment
3. **Privacy:** Raw sensor data not exposed
4. **Availability:** System functions even with some compromised devices

### 4.2 Security Properties

#### 4.2.1 Cryptographic Signatures

**Property:** Task verification requires possession of private key.

**Attack:** Attacker attempts to verify tasks without authorization.

**Defense:** ECDSA signatures prevent task spoofing. Recipient device verifies signature using provider's public key.

**Limitation:** If private key is compromised, attacker can verify tasks. Mitigation: Key rotation, hardware security modules.

#### 4.2.2 Hash Commitments

**Property:** Once committed, scores cannot be changed without detection.

**Attack:** Attacker attempts to retroactively modify care score.

**Defense:** Hash commitments bind scores to timestamps. Reveal phase allows verification.

**Limitation:** If hash function is broken, commitments can be forged. Mitigation: Use SHA-256 or stronger.

#### 4.2.3 Consensus Median

**Property:** Consensus score is robust to single-device manipulation.

**Attack:** One compromised device reports false score.

**Defense:** Median aggregation ignores outliers. Requires >50% honest devices.

**Limitation:** If >50% devices compromised, consensus can be manipulated. Mitigation: Device attestation, reputation systems.

#### 4.2.4 Privacy Preservation

**Property:** Raw sensor data never leaves device.

**Attack:** Attacker attempts to infer sensitive information from network traffic.

**Defense:** Only aggregated scores (floats) and commitments (hashes) are transmitted. No raw HRV or proximity data.

**Limitation:** Score patterns may leak information over time. Mitigation: Differential privacy, score quantization.

### 4.3 Attack Vectors

**Identified Threats:**
1. **RSSI Spoofing:** Attacker broadcasts strong BLE signal to fake proximity
   - **Mitigation:** UWB ToF provides distance verification, multi-signal fusion
   
2. **HRV Replay:** Attacker replays recorded HRV data
   - **Mitigation:** Timestamp validation, nonce-based challenges
   
3. **Task Replay:** Attacker reuses old task verification
   - **Mitigation:** One-time task IDs, timestamp freshness checks
   
4. **Consensus Manipulation:** Attacker controls multiple devices
   - **Mitigation:** Device attestation, physical presence requirements

---

## 5. Prior Art Survey

### 5.1 Related Work

**Proximity-Based Verification:**
- **NFC-based systems:** Contactless payment, access control
- **BLE beacon systems:** Indoor positioning, asset tracking
- **UWB ranging:** Apple AirTag, precise distance measurement

**Physiological Synchronization:**
- **HRV coherence research:** HeartMath Institute, biofeedback applications
- **Interpersonal synchronization:** Research on physiological coupling in social interactions
- **Wearable HRV monitoring:** Garmin, Whoop, Oura Ring

**Consensus Protocols:**
- **Blockchain consensus:** Proof of Work, Proof of Stake
- **Byzantine Fault Tolerance:** PBFT, Raft
- **Mesh network consensus:** IOTA Tangle, Hashgraph

**Assistive Technology:**
- **Care tracking systems:** Manual logging apps, caregiver platforms
- **Activity recognition:** Sensor fusion for activity detection
- **Offline-first systems:** CouchDB, PouchDB, local-first principles

### 5.2 Novel Contributions

This work combines:
1. **Multi-modal sensor fusion** (proximity + HRV + task verification) for care verification
2. **Offline-first consensus** without blockchain or cloud dependency
3. **Privacy-preserving aggregation** (only scores, not raw data)
4. **Mesh network operation** for resilient assistive technology
5. **Cryptographic commitments** for tamper-resistant scoring

**Distinction from Prior Art:**
- Unlike blockchain systems, operates without internet connectivity
- Unlike manual logging, provides cryptographic verification
- Unlike surveillance systems, preserves privacy through aggregation
- Unlike single-sensor systems, uses multi-modal fusion for robustness

---

## 6. Applications

### 6.1 Primary Use Case: L.O.V.E. Economy

The Proof of Care consensus is integrated into the L.O.V.E. (Ledger of Ontological Volume and Entropy) token economy:

- **Performance Pool (50%):** LOVE tokens allocated based on Proof of Care scores
- **Vesting:** Care scores determine token vesting rates for care providers
- **Governance:** High care scores grant voting rights in tetrahedron governance

### 6.2 Secondary Applications

- **SSA Disability Evidence:** Documented care accommodations for disability claims
- **ADA Accommodation Requests:** Quantified evidence of care needs
- **Family Court Documentation:** Verifiable care logs for custody proceedings
- **Research:** Anonymous aggregated care pattern analysis

---

## 7. Implementation Status

**Current Status:** Reference implementation in development.

**Components:**
- ✅ Core algorithm specification (this document)
- ✅ Pseudocode reference implementation
- 🚧 ESP32-S3 firmware (in progress)
- 🚧 Mesh network integration (in progress)
- ⏳ HRV sensor integration (planned)
- ⏳ UWB ranging (planned)

**Testing:**
- Unit tests for core algorithms
- Simulation of mesh network consensus
- Security analysis (this document)

---

## 8. License and Distribution

**License:** Apache 2.0

```
Copyright 2026 P31 Labs

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

**Distribution:**
- This document: Zenodo DOI (to be assigned)
- Reference implementation: GitHub (github.com/p31labs)
- Updates: Versioned releases on Zenodo

---

## 9. Acknowledgments

This work is part of the P31 Labs assistive technology ecosystem, built for neurodivergent individuals and their support networks. The mesh holds. 🔺

**Contact:**
- Email: will@p31ca.org
- Website: phosphorus31.org
- GitHub: github.com/p31labs

---

## 10. References

1. HeartMath Institute. "Heart Rate Variability Coherence." https://www.heartmath.org/
2. Meshtastic Protocol. "Long Range Mesh Networking." https://meshtastic.org/
3. Protocol Buffers. "Language Guide." https://protobuf.dev/
4. ESP-IDF. "ESP32-S3 Technical Reference Manual." https://www.espressif.com/
5. Bluetooth SIG. "Bluetooth Core Specification v5.0." https://www.bluetooth.com/
6. IEEE 802.15.4. "Ultra-Wideband Physical Layer." IEEE Standard 802.15.4z-2020.

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-02-14  
**Status:** Ready for Zenodo Submission
