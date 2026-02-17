# Voltage Assessment Algorithm: A Weighted Pattern Detection System for Communication Triage in Assistive Technology

**Authors:** P31 Labs  
**License:** Apache 2.0  
**Publication Date:** 2026-02-14  
**DOI:** [To be assigned by Zenodo]  
**Version:** 1.0.0

---

## Abstract

We present a voltage assessment algorithm for automated triage of incoming communications in assistive technology systems. The algorithm detects six manipulation patterns (URGENCY, COERCION, SHAME, FALSE_AUTHORITY, THREATS, EMOTIONAL_LEVER) using weighted scoring to compute a voltage metric from 0-10. Messages scoring ≥6 are automatically held for review, with ≥8 triggering critical alerts. The system generates accommodation logs for disability evidence and ADA compliance. We provide complete pattern detection rules, weighted scoring formulas, state machine specifications, and reference implementation. This work establishes prior art for automated communication filtering systems that protect neurodivergent individuals from manipulative messaging patterns while maintaining audit trails for legal and medical documentation.

**Keywords:** Communication triage, pattern detection, assistive technology, manipulation detection, accommodation logging, voltage assessment, neurodivergent support, automated filtering

---

## 1. Problem Statement

### 1.1 The Communication Overload Challenge

Neurodivergent individuals, particularly those with AuDHD (Autism + ADHD), face significant challenges processing incoming communications:

1. **Executive Function Overload:** Difficulty prioritizing and filtering messages leads to cognitive overwhelm
2. **Manipulation Vulnerability:** Difficulty recognizing coercive language patterns in real-time
3. **Emotional Regulation:** High-stress messages trigger dysregulation, reducing capacity for decision-making
4. **Accommodation Documentation:** Need for verifiable evidence of communication barriers for SSA disability claims and ADA accommodation requests
5. **Spoon Economy Integration:** Communication processing consumes cognitive resources ("spoons") that must be conserved

### 1.2 Design Requirements

A voltage assessment algorithm must:

- **Detect Manipulation Patterns:** Identify common coercive communication tactics
- **Quantify Stress Level:** Provide numeric voltage score (0-10) for triage decisions
- **Preserve Evidence:** Generate accommodation logs for legal/medical documentation
- **Respect Autonomy:** Hold messages for review, not auto-delete (user maintains control)
- **Context Awareness:** Integrate with spoon economy to adjust thresholds based on capacity
- **Privacy Preserving:** Process locally without cloud dependency

---

## 2. Technical Specification

### 2.1 Voltage Scale

The algorithm outputs a voltage score from 0-10:

| Voltage | Color | Action | Description |
|---------|-------|--------|-------------|
| 0-3 | GREEN | PASS | Low stress, immediate delivery |
| 4-5 | YELLOW | ADVISORY | Moderate stress, flag for review |
| 6-7 | ORANGE | HOLD | High stress, hold for review |
| 8-9 | RED | CRITICAL HOLD | Very high stress, immediate alert |
| 10 | BLACK | AUTO-ARCHIVE | Maximum stress, archive without delivery |

### 2.2 Detection Patterns

Six manipulation patterns are detected, each with a weight:

| Pattern | Weight | Description | Example Triggers |
|---------|--------|-------------|------------------|
| **URGENCY** | 1.5 | Artificial time pressure | "ASAP", "immediately", "right now", "deadline today" |
| **COERCION** | 2.0 | Forced compliance language | "You must", "You have to", "Required", "Mandatory" |
| **SHAME** | 2.0 | Character attacks | "You always", "You never", "You're being", "Selfish" |
| **FALSE_AUTHORITY** | 1.8 | Unverified power claims | "The court says", "Your lawyer said", "I have the right" |
| **THREATS** | 2.5 | Implied/explicit consequences | "Or else", "If you don't", "Consequences", "You'll regret" |
| **EMOTIONAL_LEVER** | 1.5 | Guilt/fear manipulation | "Think of the children", "You're hurting", "After all I've done" |

### 2.3 Pattern Detection Rules

#### 2.3.1 URGENCY Pattern

**Regex Patterns:**
```regex
\b(ASAP|asap|immediately|right now|urgent|emergency|deadline|today|within.*hour|by.*end.*day)\b
```

**Context Analysis:**
- Check for time pressure without legitimate deadline
- Compare stated urgency to message content (false urgency detection)
- Weight increases if combined with other patterns

**Scoring:**
```
urgency_score = (pattern_matches / message_length) × weight × context_multiplier
```

Where `context_multiplier` = 1.0 (normal) to 1.5 (combined with other patterns)

#### 2.3.2 COERCION Pattern

**Regex Patterns:**
```regex
\b(you must|you have to|you need to|required|mandatory|obligated|forced|compelled|no choice)\b
```

**Context Analysis:**
- Detect imperative mood without legitimate authority
- Check for absence of alternatives or negotiation
- Higher weight if sender lacks verified authority

**Scoring:**
```
coercion_score = (pattern_matches / message_length) × weight × authority_multiplier
```

Where `authority_multiplier` = 1.0 (legitimate authority) to 2.0 (no authority)

#### 2.3.3 SHAME Pattern

**Regex Patterns:**
```regex
\b(you always|you never|you're being|selfish|irresponsible|uncaring|thoughtless|disappointing|let down)\b
```

**Context Analysis:**
- Character attacks vs. behavior feedback
- Generalizations ("always", "never") increase weight
- Personal attacks vs. constructive criticism

**Scoring:**
```
shame_score = (pattern_matches / message_length) × weight × generalization_multiplier
```

Where `generalization_multiplier` = 1.0 (specific) to 1.5 (generalized)

#### 2.3.4 FALSE_AUTHORITY Pattern

**Regex Patterns:**
```regex
\b(the court|the judge|your lawyer|the law says|I have the right|authorized|permission|allowed)\b
```

**Context Analysis:**
- Verify claims against known authority sources
- Check for misrepresentation of legal/authority status
- Cross-reference with verified authority database

**Scoring:**
```
false_authority_score = (pattern_matches / message_length) × weight × verification_multiplier
```

Where `verification_multiplier` = 0.0 (verified) to 2.0 (unverified claim)

#### 2.3.5 THREATS Pattern

**Regex Patterns:**
```regex
\b(or else|if you don't|consequences|you'll regret|you'll be sorry|pay for this|suffer|punish|retaliate)\b
```

**Context Analysis:**
- Explicit vs. implied threats
- Consequences vs. threats (legitimate consequences are acceptable)
- Severity assessment

**Scoring:**
```
threats_score = (pattern_matches / message_length) × weight × severity_multiplier
```

Where `severity_multiplier` = 1.0 (mild) to 2.0 (severe)

#### 2.3.6 EMOTIONAL_LEVER Pattern

**Regex Patterns:**
```regex
\b(think of.*children|after all I've|you're hurting|disappointed|let down|betrayed|abandoned|alone)\b
```

**Context Analysis:**
- Guilt induction vs. legitimate emotional expression
- Emotional manipulation vs. healthy communication
- Frequency of emotional appeals

**Scoring:**
```
emotional_lever_score = (pattern_matches / message_length) × weight × frequency_multiplier
```

Where `frequency_multiplier` = 1.0 (single instance) to 1.5 (repeated)

### 2.4 Voltage Calculation

**Base Formula:**
```
voltage = min(10, Σ(pattern_scores))
```

**Spoon Economy Adjustment:**
When spoon level ≤ 2 (Safe Mode), voltage threshold for HOLD decreases:

```
adjusted_threshold = base_threshold - (2 - spoons) × 0.5
```

Example: If base threshold is 6 and spoons = 1, adjusted threshold = 6 - (2-1) × 0.5 = 5.5

**Sender History Adjustment:**
If sender has history of high-voltage messages, apply multiplier:

```
voltage = voltage × (1 + sender_history_multiplier)
```

Where `sender_history_multiplier` = 0.0 (no history) to 0.3 (frequent high-voltage)

### 2.5 State Machine

**States:**
- **PASSED:** Voltage 0-3, delivered immediately
- **HELD:** Voltage 4-10, held for review
- **RELEASED:** User reviewed and released from hold
- **ARCHIVED:** User archived or auto-archived (voltage 10)

**Transitions:**
```
INCOMING → [voltage < 4] → PASSED
INCOMING → [voltage ≥ 4] → HELD
HELD → [user review] → RELEASED
HELD → [user archive] → ARCHIVED
HELD → [voltage = 10] → ARCHIVED (auto)
RELEASED → [delivered] → PASSED
```

### 2.6 Accommodation Logging

Every HELD message generates an accommodation log entry:

```json
{
  "timestamp": "2026-02-14T10:30:00Z",
  "message_id": "msg_abc123",
  "sender": "sender@example.com",
  "voltage_score": 7.5,
  "patterns_detected": ["COERCION", "THREATS", "URGENCY"],
  "spoon_level": 3,
  "accommodation_type": "COMMUNICATION_FILTER",
  "action_taken": "HELD",
  "user_action": "RELEASED",
  "review_timestamp": "2026-02-14T11:00:00Z"
}
```

**Privacy Considerations:**
- Message content not stored in log (only metadata)
- Sender identity hashed for privacy
- Logs encrypted at rest
- Export format for SSA/legal evidence

---

## 3. Reference Implementation

### 3.1 Pseudocode

```python
class VoltageAssessment:
    def __init__(self):
        self.patterns = {
            'URGENCY': {
                'weight': 1.5,
                'regex': r'\b(ASAP|asap|immediately|right now|urgent|emergency|deadline|today)\b',
                'context_multiplier': 1.0
            },
            'COERCION': {
                'weight': 2.0,
                'regex': r'\b(you must|you have to|required|mandatory|obligated)\b',
                'authority_multiplier': 1.0
            },
            'SHAME': {
                'weight': 2.0,
                'regex': r'\b(you always|you never|selfish|irresponsible|uncaring)\b',
                'generalization_multiplier': 1.0
            },
            'FALSE_AUTHORITY': {
                'weight': 1.8,
                'regex': r'\b(the court|the judge|your lawyer|I have the right)\b',
                'verification_multiplier': 1.0
            },
            'THREATS': {
                'weight': 2.5,
                'regex': r'\b(or else|if you don\'t|consequences|you\'ll regret)\b',
                'severity_multiplier': 1.0
            },
            'EMOTIONAL_LEVER': {
                'weight': 1.5,
                'regex': r'\b(think of.*children|after all I\'ve|you\'re hurting)\b',
                'frequency_multiplier': 1.0
            }
        }
        
    def assess_voltage(self, message_text, sender, spoon_level=10):
        """Compute voltage score for message"""
        message_length = len(message_text.split())
        pattern_scores = {}
        detected_patterns = []
        
        # Detect each pattern
        for pattern_name, pattern_config in self.patterns.items():
            matches = re.findall(pattern_config['regex'], message_text, re.IGNORECASE)
            if matches:
                match_count = len(matches)
                base_score = (match_count / message_length) * pattern_config['weight']
                
                # Apply context multipliers
                context_score = self._apply_context_multipliers(
                    pattern_name, base_score, message_text, sender
                )
                
                pattern_scores[pattern_name] = context_score
                detected_patterns.append(pattern_name)
        
        # Sum all pattern scores
        voltage = min(10.0, sum(pattern_scores.values()))
        
        # Apply spoon economy adjustment
        if spoon_level <= 2:
            voltage = voltage * (1 + (2 - spoon_level) * 0.1)
            voltage = min(10.0, voltage)
        
        # Apply sender history
        sender_multiplier = self._get_sender_history_multiplier(sender)
        voltage = voltage * (1 + sender_multiplier)
        voltage = min(10.0, voltage)
        
        return {
            'voltage': voltage,
            'patterns_detected': detected_patterns,
            'pattern_scores': pattern_scores,
            'action': self._determine_action(voltage, spoon_level)
        }
    
    def _determine_action(self, voltage, spoon_level):
        """Determine action based on voltage and spoon level"""
        # Adjust threshold for low spoons
        hold_threshold = 6.0
        if spoon_level <= 2:
            hold_threshold = 6.0 - (2 - spoon_level) * 0.5
        
        if voltage < 4:
            return 'PASS'
        elif voltage < hold_threshold:
            return 'ADVISORY'
        elif voltage < 8:
            return 'HOLD'
        elif voltage < 10:
            return 'CRITICAL_HOLD'
        else:
            return 'AUTO_ARCHIVE'
    
    def create_accommodation_log(self, message_id, sender, assessment, spoon_level):
        """Generate accommodation log entry"""
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'message_id': message_id,
            'sender_hash': hashlib.sha256(sender.encode()).hexdigest()[:16],
            'voltage_score': assessment['voltage'],
            'patterns_detected': assessment['patterns_detected'],
            'spoon_level': spoon_level,
            'accommodation_type': 'COMMUNICATION_FILTER',
            'action_taken': assessment['action']
        }
```

### 3.2 Integration Points

**Email Integration:**
- IMAP/SMTP filter hooks
- Pre-delivery processing
- Header injection for voltage metadata

**SMS Integration:**
- Twilio webhook processing
- Pre-delivery filtering
- Notification system integration

**Slack/Teams Integration:**
- Webhook processing
- Message filtering before display
- Channel-level voltage thresholds

---

## 4. Security and Privacy

### 4.1 Privacy Preservation

- **Local Processing:** All analysis performed on-device or local server
- **No Cloud Dependency:** No message content sent to external services
- **Hashed Identities:** Sender identities hashed in logs
- **Encrypted Storage:** Accommodation logs encrypted at rest
- **User Control:** User can review, release, or archive any message

### 4.2 False Positive Mitigation

- **Whitelist:** Trusted senders bypass voltage assessment
- **User Override:** User can release any held message
- **Learning:** User feedback adjusts pattern weights over time
- **Context Awareness:** Legitimate urgency (medical, safety) detected separately

---

## 5. Prior Art Survey

### 5.1 Related Work

**Spam Detection:**
- Bayesian filtering (SpamAssassin)
- Machine learning spam filters
- **Distinction:** Focus on manipulation patterns, not spam

**Sentiment Analysis:**
- Natural language processing for emotion detection
- **Distinction:** Focus on coercive patterns, not general sentiment

**Content Filtering:**
- Parental controls, workplace filters
- **Distinction:** User-controlled, accommodation-focused, evidence-generating

**Abuse Detection:**
- Social media harassment detection
- **Distinction:** Assistive technology focus, offline-first, accommodation logging

### 5.2 Novel Contributions

1. **Weighted Pattern Detection:** Six specific manipulation patterns with calibrated weights
2. **Spoon Economy Integration:** Dynamic thresholds based on cognitive capacity
3. **Accommodation Logging:** Automated evidence generation for disability claims
4. **Offline-First Design:** No cloud dependency, local processing
5. **State Machine Architecture:** Clear triage workflow with user control

---

## 6. Applications

### 6.1 Primary Use Case: The Buffer

The voltage assessment algorithm is the core of "The Buffer" communication triage system in the P31 ecosystem, protecting users from manipulative messaging while preserving evidence for accommodation requests.

### 6.2 Secondary Applications

- **SSA Disability Evidence:** Accommodation logs demonstrate communication barriers
- **ADA Accommodation Requests:** Quantified evidence of need for communication filtering
- **Legal Documentation:** Evidence of coercive communication patterns
- **Therapeutic Support:** Data for therapy sessions on communication boundaries

---

## 7. Implementation Status

**Current Status:** Production system in use (Google Apps Script, 1,888 lines).

**Components:**
- ✅ Pattern detection rules (this document)
- ✅ Voltage calculation algorithm
- ✅ State machine implementation
- ✅ Accommodation logging
- 🚧 Machine learning enhancement (planned)
- ⏳ Multi-language support (planned)

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

1. Spoon Theory. "The Spoon Theory" by Christine Miserandino. https://butyoudontlooksick.com/
2. ADA. "Americans with Disabilities Act." https://www.ada.gov/
3. SSA. "Social Security Disability Benefits." https://www.ssa.gov/disability/
4. Natural Language Processing. "Pattern Detection in Text." Various NLP libraries and frameworks.

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-02-14  
**Status:** Ready for Zenodo Submission
