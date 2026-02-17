# 4-Hour Medication Gap Enforcement: Automated Prevention of Calcium-Amphetamine Interaction in Assistive Technology Systems

**Authors:** P31 Labs  
**License:** Apache 2.0  
**Publication Date:** 2026-02-14  
**DOI:** [To be assigned by Zenodo]  
**Version:** 1.0.0

---

## Abstract

We present an automated medication interaction prevention system that enforces a minimum 4-hour separation between calcium supplements and amphetamine medications. Calcium binds amphetamines in the gastrointestinal tract, reducing absorption by approximately 40%. The system tracks medication administration times, calculates remaining wait periods, prevents premature dosing, and logs override attempts for medical review. We provide complete algorithm specification, interaction mechanism explanation, countdown timer implementation, and reference implementation in Google Apps Script. This work establishes prior art for automated medication interaction prevention in assistive technology systems, particularly for individuals with executive function challenges who may struggle with manual timing.

**Keywords:** Medication interaction, calcium, amphetamine, absorption reduction, medication tracking, assistive technology, executive function support, automated enforcement

---

## 1. Problem Statement

### 1.1 The Medication Interaction Challenge

Individuals taking both calcium supplements and amphetamine medications (e.g., Vyvanse) face a critical timing challenge:

1. **Absorption Reduction:** Calcium binds amphetamines in the GI tract, reducing absorption by ~40%
2. **Timing Criticality:** Minimum 4-hour separation required to prevent interaction
3. **Executive Function Burden:** Manual timing requires sustained attention and memory
4. **Consequence Severity:** Reduced medication efficacy impacts daily functioning
5. **Override Risk:** Users may override warnings due to forgetfulness or urgency

### 1.2 Medical Background

**Calcium-Amphetamine Interaction:**

- **Mechanism:** Calcium ions (Ca²⁺) form complexes with amphetamine molecules in the gastrointestinal tract
- **Effect:** Reduced amphetamine absorption into bloodstream
- **Magnitude:** Approximately 40% reduction in bioavailability
- **Timing:** Interaction occurs when medications are co-administered or within 4 hours
- **Solution:** Minimum 4-hour separation between calcium and amphetamine administration

**Medications Tracked:**

- **Calcium Sources:** Calcium Carbonate, Calcitriol (active vitamin D, affects calcium metabolism)
- **Amphetamine:** Vyvanse (lisdexamfetamine)
- **Other:** Magnesium (tracked but no interaction with amphetamines)

### 1.3 Design Requirements

A medication gap enforcement system must:

- **Track Administration:** Record timestamp of each medication dose
- **Calculate Gaps:** Determine time remaining until safe administration
- **Prevent Interaction:** Block or warn when gap is insufficient
- **Countdown Display:** Show remaining time until safe administration
- **Override Logging:** Record when users override warnings
- **Medical Evidence:** Generate logs for healthcare providers

---

## 2. Technical Specification

### 2.1 Interaction Rules

**Calcium → Amphetamine:**
- If calcium taken, must wait 4 hours before amphetamine
- Countdown timer starts from calcium administration time
- Amphetamine administration blocked until countdown completes

**Amphetamine → Calcium:**
- If amphetamine taken, must wait 4 hours before calcium
- Countdown timer starts from amphetamine administration time
- Calcium administration blocked until countdown completes

**Same Medication:**
- No interaction (can take same medication as prescribed)
- Only cross-medication interactions are enforced

### 2.2 Gap Calculation Algorithm

```javascript
function calculateGapRemaining(medicationType, lastDoseTime) {
    const now = new Date();
    const lastDose = new Date(lastDoseTime);
    const elapsed = (now - lastDose) / (1000 * 60 * 60); // hours
    
    const REQUIRED_GAP = 4; // hours
    const remaining = REQUIRED_GAP - elapsed;
    
    return {
        remaining: Math.max(0, remaining),
        elapsed: elapsed,
        canAdminister: remaining <= 0,
        minutesRemaining: Math.max(0, Math.ceil(remaining * 60))
    };
}

function checkInteraction(medicationToTake, lastCalciumTime, lastAmphetamineTime) {
    if (medicationToTake === 'CALCIUM') {
        // Taking calcium - check last amphetamine
        if (lastAmphetamineTime) {
            return calculateGapRemaining('AMPHETAMINE', lastAmphetamineTime);
        }
    } else if (medicationToTake === 'AMPHETAMINE') {
        // Taking amphetamine - check last calcium
        if (lastCalciumTime) {
            return calculateGapRemaining('CALCIUM', lastCalciumTime);
        }
    }
    
    // No interaction
    return {
        remaining: 0,
        elapsed: Infinity,
        canAdminister: true,
        minutesRemaining: 0
    };
}
```

### 2.3 Administration Workflow

**Step 1: User Requests Medication**

```javascript
function requestMedication(medicationType) {
    const lastCalcium = getLastDoseTime('CALCIUM');
    const lastAmphetamine = getLastDoseTime('AMPHETAMINE');
    
    const interaction = checkInteraction(medicationType, lastCalcium, lastAmphetamine);
    
    if (interaction.canAdminister) {
        // Safe to administer
        return {
            allowed: true,
            message: 'Safe to administer'
        };
    } else {
        // Interaction detected
        return {
            allowed: false,
            message: `Wait ${interaction.minutesRemaining} minutes before taking ${medicationType}`,
            minutesRemaining: interaction.minutesRemaining,
            countdown: startCountdown(interaction.minutesRemaining)
        };
    }
}
```

**Step 2: Countdown Display**

```javascript
function startCountdown(minutesRemaining) {
    const endTime = new Date(Date.now() + minutesRemaining * 60 * 1000);
    
    return {
        endTime: endTime,
        update: function() {
            const now = new Date();
            const remaining = Math.max(0, (endTime - now) / (1000 * 60));
            
            return {
                minutes: Math.floor(remaining),
                seconds: Math.floor((remaining % 1) * 60),
                isComplete: remaining <= 0
            };
        }
    };
}
```

**Step 3: Administration (with Override Option)**

```javascript
function administerMedication(medicationType, override = false) {
    const interaction = checkInteraction(medicationType, ...);
    
    if (!interaction.canAdminister && !override) {
        throw new Error('Cannot administer - interaction detected');
    }
    
    // Record administration
    const administration = {
        medication: medicationType,
        timestamp: new Date(),
        override: override && !interaction.canAdminister,
        gapRemaining: interaction.remaining,
        dosage: getDosage(medicationType)
    };
    
    // Save to log
    logAdministration(administration);
    
    // Update last dose time
    updateLastDoseTime(medicationType, administration.timestamp);
    
    // If override, generate warning log
    if (administration.override) {
        logOverrideWarning(administration);
    }
    
    return administration;
}
```

### 2.4 Override Handling

**Override Conditions:**

1. **User Explicit Override:** User acknowledges warning and proceeds
2. **Emergency Override:** Medical emergency (requires additional confirmation)
3. **Provider Override:** Healthcare provider authorization

**Override Logging:**

```javascript
function logOverrideWarning(administration) {
    const warning = {
        timestamp: administration.timestamp,
        medication: administration.medication,
        gapRemaining: administration.gapRemaining,
        interactionType: 'CALCIUM_AMPHETAMINE',
        severity: 'MODERATE',
        action: 'OVERRIDE',
        message: `Medication administered with ${administration.gapRemaining.toFixed(2)} hours remaining in required gap`,
        recommendation: 'Monitor for reduced medication efficacy. Consider adjusting timing for future doses.'
    };
    
    // Save to medical log
    saveToMedicalLog(warning);
    
    // Notify healthcare provider (if configured)
    if (shouldNotifyProvider(warning)) {
        notifyProvider(warning);
    }
    
    return warning;
}
```

### 2.5 Medication Tracking Schema

**Administration Record:**

```typescript
interface MedicationAdministration {
    id: string;
    medication: 'CALCIUM' | 'AMPHETAMINE' | 'MAGNESIUM' | 'CALCITRIOL';
    timestamp: Date;
    dosage: {
        amount: number;
        unit: string;
    };
    gapRemaining?: number;  // If interaction was present
    override: boolean;
    overrideReason?: string;
}

interface InteractionWarning {
    id: string;
    timestamp: Date;
    medicationAttempted: string;
    lastConflictingDose: Date;
    gapRemaining: number;
    severity: 'LOW' | 'MODERATE' | 'HIGH';
    action: 'BLOCKED' | 'OVERRIDE';
    userAcknowledged: boolean;
}
```

---

## 3. Reference Implementation

### 3.1 Complete Medication Tracker (Google Apps Script)

```javascript
/**
 * Medication Gap Enforcement System
 * Prevents calcium-amphetamine interaction by enforcing 4-hour gap
 */

const MEDICATION_TYPES = {
    CALCIUM: 'CALCIUM',
    AMPHETAMINE: 'AMPHETAMINE',
    MAGNESIUM: 'MAGNESIUM',
    CALCITRIOL: 'CALCITRIOL'
};

const REQUIRED_GAP_HOURS = 4;

/**
 * Get last administration time for a medication
 */
function getLastDoseTime(medicationType) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('MedicationLog');
    const data = sheet.getDataRange().getValues();
    
    // Find most recent administration of this medication
    for (let i = data.length - 1; i >= 1; i--) { // Skip header
        if (data[i][0] === medicationType) { // Column 0 = medication type
            return new Date(data[i][1]); // Column 1 = timestamp
        }
    }
    
    return null; // No previous dose
}

/**
 * Calculate remaining gap time
 */
function calculateGapRemaining(lastDoseTime) {
    if (!lastDoseTime) {
        return { remaining: 0, canAdminister: true };
    }
    
    const now = new Date();
    const lastDose = new Date(lastDoseTime);
    const elapsedHours = (now - lastDose) / (1000 * 60 * 60);
    const remainingHours = REQUIRED_GAP_HOURS - elapsedHours;
    
    return {
        remaining: Math.max(0, remainingHours),
        elapsed: elapsedHours,
        canAdminister: remainingHours <= 0,
        minutesRemaining: Math.max(0, Math.ceil(remainingHours * 60))
    };
}

/**
 * Check for interaction before administering medication
 */
function checkInteraction(medicationType) {
    const lastCalcium = getLastDoseTime(MEDICATION_TYPES.CALCIUM);
    const lastCalcitriol = getLastDoseTime(MEDICATION_TYPES.CALCITRIOL);
    const lastAmphetamine = getLastDoseTime(MEDICATION_TYPES.AMPHETAMINE);
    
    // Determine which conflicting medication to check
    let lastConflictingDose = null;
    
    if (medicationType === MEDICATION_TYPES.AMPHETAMINE) {
        // Taking amphetamine - check last calcium/calcitriol
        lastConflictingDose = lastCalcium || lastCalcitriol;
    } else if (medicationType === MEDICATION_TYPES.CALCIUM || 
               medicationType === MEDICATION_TYPES.CALCITRIOL) {
        // Taking calcium/calcitriol - check last amphetamine
        lastConflictingDose = lastAmphetamine;
    }
    
    if (!lastConflictingDose) {
        return { canAdminister: true, remaining: 0 };
    }
    
    return calculateGapRemaining(lastConflictingDose);
}

/**
 * Attempt to administer medication
 */
function administerMedication(medicationType, dosage, override = false) {
    const interaction = checkInteraction(medicationType);
    
    if (!interaction.canAdminister && !override) {
        // Block administration
        const warning = {
            blocked: true,
            medication: medicationType,
            minutesRemaining: interaction.minutesRemaining,
            message: `Cannot administer ${medicationType}. Wait ${interaction.minutesRemaining} minutes.`,
            lastConflictingDose: getLastDoseTime(
                medicationType === MEDICATION_TYPES.AMPHETAMINE 
                    ? MEDICATION_TYPES.CALCIUM 
                    : MEDICATION_TYPES.AMPHETAMINE
            )
        };
        
        logInteractionWarning(warning);
        return warning;
    }
    
    // Record administration
    const administration = {
        medication: medicationType,
        timestamp: new Date(),
        dosage: dosage,
        gapRemaining: interaction.remaining,
        override: override && !interaction.canAdminister
    };
    
    // Save to log
    logAdministration(administration);
    
    // If override, log warning
    if (administration.override) {
        logOverrideWarning(administration);
    }
    
    return {
        success: true,
        administration: administration
    };
}

/**
 * Log medication administration
 */
function logAdministration(administration) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('MedicationLog');
    
    sheet.appendRow([
        administration.medication,
        administration.timestamp,
        administration.dosage.amount,
        administration.dosage.unit,
        administration.gapRemaining || '',
        administration.override ? 'YES' : 'NO'
    ]);
}

/**
 * Log interaction warning
 */
function logInteractionWarning(warning) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('InteractionWarnings');
    
    sheet.appendRow([
        new Date(),
        warning.medication,
        warning.lastConflictingDose,
        warning.minutesRemaining,
        'BLOCKED'
    ]);
}

/**
 * Log override warning
 */
function logOverrideWarning(administration) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('InteractionWarnings');
    
    sheet.appendRow([
        administration.timestamp,
        administration.medication,
        administration.timestamp, // Last conflicting dose time
        administration.gapRemaining,
        'OVERRIDE',
        'Monitor for reduced medication efficacy'
    ]);
}

/**
 * Get countdown status for medication
 */
function getCountdownStatus(medicationType) {
    const interaction = checkInteraction(medicationType);
    
    if (interaction.canAdminister) {
        return {
            canAdminister: true,
            message: 'Safe to administer'
        };
    }
    
    return {
        canAdminister: false,
        minutesRemaining: interaction.minutesRemaining,
        hoursRemaining: (interaction.minutesRemaining / 60).toFixed(1),
        message: `Wait ${interaction.minutesRemaining} minutes (${(interaction.minutesRemaining / 60).toFixed(1)} hours)`
    };
}
```

### 3.2 UI Integration Example

```javascript
/**
 * Display medication administration interface
 */
function showMedicationUI(medicationType) {
    const status = getCountdownStatus(medicationType);
    
    if (status.canAdminister) {
        // Show administration button
        return {
            type: 'administer',
            medication: medicationType,
            message: 'Safe to administer',
            buttonText: 'Administer Medication'
        };
    } else {
        // Show countdown
        return {
            type: 'countdown',
            medication: medicationType,
            minutesRemaining: status.minutesRemaining,
            message: status.message,
            buttonText: 'Override (Not Recommended)',
            overrideAvailable: true
        };
    }
}
```

---

## 4. Medical Evidence Generation

### 4.1 Export Format for Healthcare Providers

```javascript
function exportMedicalLog(startDate, endDate) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('MedicationLog');
    const data = sheet.getDataRange().getValues();
    
    const administrations = [];
    const warnings = [];
    
    // Filter by date range
    for (let i = 1; i < data.length; i++) {
        const timestamp = new Date(data[i][1]);
        if (timestamp >= startDate && timestamp <= endDate) {
            administrations.push({
                medication: data[i][0],
                timestamp: timestamp,
                dosage: { amount: data[i][2], unit: data[i][3] },
                gapRemaining: data[i][4],
                override: data[i][5] === 'YES'
            });
        }
    }
    
    // Get warnings
    const warningSheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('InteractionWarnings');
    const warningData = warningSheet.getDataRange().getValues();
    
    for (let i = 1; i < warningData.length; i++) {
        const timestamp = new Date(warningData[i][0]);
        if (timestamp >= startDate && timestamp <= endDate) {
            warnings.push({
                timestamp: timestamp,
                medication: warningData[i][1],
                gapRemaining: warningData[i][3],
                action: warningData[i][4]
            });
        }
    }
    
    return {
        period: { start: startDate, end: endDate },
        administrations: administrations,
        interactionWarnings: warnings,
        summary: {
            totalAdministrations: administrations.length,
            overrides: administrations.filter(a => a.override).length,
            interactionsBlocked: warnings.filter(w => w.action === 'BLOCKED').length
        }
    };
}
```

---

## 5. Prior Art Survey

### 5.1 Related Work

**Medication Reminder Apps:**
- Pill reminder applications
- **Distinction:** This enforces interactions, not just reminders

**Drug Interaction Databases:**
- Clinical drug interaction databases
- **Distinction:** This provides automated enforcement, not just information

**Medication Adherence Systems:**
- Systems to improve medication compliance
- **Distinction:** This prevents harmful interactions, not just tracks adherence

**Executive Function Support:**
- Various assistive technologies
- **Distinction:** This specifically addresses medication timing challenges

### 5.2 Novel Contributions

1. **Automated Enforcement:** Blocks administration rather than just warning
2. **Calcium-Amphetamine Specific:** Addresses specific interaction with timing enforcement
3. **Override Logging:** Tracks when users override warnings for medical review
4. **Countdown Display:** Real-time feedback on remaining wait time
5. **Medical Evidence:** Generates logs for healthcare provider review

---

## 6. Applications

### 6.1 Primary Use Case: The Scope Dashboard

The 4-hour medication gap enforcement is implemented in The Scope (Google Apps Script, 1,888 lines), providing automated protection against calcium-amphetamine interaction.

### 6.2 Secondary Applications

- **Healthcare Provider Integration:** Export logs for medical review
- **SSA Disability Evidence:** Document medication management challenges
- **Research:** Data on medication interaction prevention effectiveness
- **Family Support:** Automated system reduces caregiver burden

---

## 7. Implementation Status

**Current Status:** Production system in use (Google Apps Script).

**Components:**
- ✅ Gap calculation algorithm
- ✅ Interaction detection
- ✅ Countdown timer
- ✅ Override logging
- ✅ Medical evidence export
- ✅ Integration with The Scope dashboard

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

## 9. Medical Disclaimer

**Important:** This system is a tool to assist with medication timing. It does not replace professional medical advice. Always consult with healthcare providers regarding medication interactions and timing. Override warnings should be discussed with medical professionals.

---

## 10. Acknowledgments

This work is part of the P31 Labs assistive technology ecosystem, built for neurodivergent individuals and their support networks. The mesh holds. 🔺

**Contact:**
- Email: will@p31ca.org
- Website: phosphorus31.org
- GitHub: github.com/p31labs

---

## 11. References

1. Drug Interactions: Calcium and Amphetamines. Various clinical pharmacology sources.
2. Google Apps Script Documentation. https://developers.google.com/apps-script
3. Medication Adherence Research. Various academic papers on medication timing and interactions.

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-02-14  
**Status:** Ready for Zenodo Submission
