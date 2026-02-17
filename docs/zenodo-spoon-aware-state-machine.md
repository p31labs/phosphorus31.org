# Spoon-Aware State Machine: A Capacity-Driven Mode Switching System for Assistive Technology Devices

**Authors:** P31 Labs  
**License:** Apache 2.0  
**Publication Date:** 2026-02-14  
**DOI:** [To be assigned by Zenodo]  
**Version:** 1.0.0

---

## Abstract

We present a spoon-aware state machine that dynamically adjusts device behavior based on cognitive capacity (spoon level). The system transitions between three operational modes (Normal, Low Power, Safe Mode) based on real-time spoon economy metrics, automatically reducing functionality and power consumption when capacity is low. This prevents cognitive overload and extends battery life during high-stress periods. We provide complete state machine specification, transition rules, power management algorithms, and reference implementation for ESP32-S3 firmware. This work establishes prior art for capacity-driven assistive technology systems that adapt to user state rather than requiring manual configuration.

**Keywords:** Spoon theory, state machine, assistive technology, cognitive capacity, power management, ESP32, firmware, adaptive systems, neurodivergent support

---

## 1. Problem Statement

### 1.1 The Cognitive Capacity Problem

Assistive technology devices face a fundamental challenge:

1. **Fixed Functionality:** Most devices operate at full capacity regardless of user state
2. **Cognitive Overload:** High-functionality modes can overwhelm users during low-capacity periods
3. **Battery Drain:** Full functionality consumes power even when user cannot effectively use features
4. **Manual Configuration:** Users must manually adjust settings, requiring executive function they may lack
5. **State Ignorance:** Devices don't adapt to real-time cognitive capacity

### 1.2 Spoon Theory Foundation

Spoon Theory (Christine Miserandino) uses "spoons" as a metaphor for finite daily energy/capacity. Each activity costs spoons. When spoons are depleted, capacity for additional tasks is reduced.

**Application to Assistive Technology:**
- Spoon level (0-10) represents current cognitive capacity
- Device should adapt functionality based on spoon level
- Low spoons → reduced functionality → lower power consumption
- High spoons → full functionality → optimal user experience

### 1.3 Design Requirements

A spoon-aware state machine must:

- **Monitor Spoon Level:** Track current capacity (0-10 scale)
- **Automatic Transitions:** Switch modes based on spoon level without user intervention
- **Power Management:** Reduce power consumption in low-capacity modes
- **Graceful Degradation:** Maintain essential functions while reducing non-essential features
- **Hysteresis:** Prevent rapid mode switching (threshold differences for up/down transitions)

---

## 2. Technical Specification

### 2.1 State Definitions

**Three Operational Modes:**

| Mode | Spoon Range | Description | Power Consumption |
|------|-------------|-------------|-------------------|
| **Normal** | 4-10 | Full functionality | ~100% (baseline) |
| **Low Power** | 2-3 | Reduced functionality | ~50% |
| **Safe Mode** | 0-1 | Essential functions only | ~20% |

### 2.2 State Machine Diagram

```
                    ┌─────────────┐
                    │   Normal    │
                    │  (4-10)     │
                    └──────┬──────┘
                           │
              spoon ≤ 3    │    spoon ≥ 4
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────┐                    ┌──────────────┐
│  Low Power   │                    │   Normal    │
│    (2-3)     │                    │   (4-10)    │
└──────┬───────┘                    └─────────────┘
       │
spoon ≤ 1│    spoon ≥ 2
       │
       ▼
┌──────────────┐
│  Safe Mode   │
│    (0-1)     │
└──────┬───────┘
       │
spoon ≥ 2│    spoon ≤ 1
       │
       └──────────────┐
                      │
                      ▼
            ┌──────────────┐
            │  Low Power   │
            │    (2-3)     │
            └──────────────┘
```

### 2.3 Transition Rules

**Hysteresis Implementation:**

To prevent rapid oscillation, transitions use different thresholds:

- **Normal → Low Power:** Triggered when spoon ≤ 3
- **Low Power → Normal:** Triggered when spoon ≥ 4 (hysteresis: +1)
- **Low Power → Safe Mode:** Triggered when spoon ≤ 1
- **Safe Mode → Low Power:** Triggered when spoon ≥ 2 (hysteresis: +1)

**Transition Conditions:**

```c
typedef enum {
    STATE_NORMAL,
    STATE_LOW_POWER,
    STATE_SAFE_MODE
} device_state_t;

device_state_t determine_state(uint8_t spoon_level, device_state_t current_state) {
    switch (current_state) {
        case STATE_NORMAL:
            if (spoon_level <= 3) {
                return STATE_LOW_POWER;
            }
            break;
            
        case STATE_LOW_POWER:
            if (spoon_level <= 1) {
                return STATE_SAFE_MODE;
            } else if (spoon_level >= 4) {
                return STATE_NORMAL;
            }
            break;
            
        case STATE_SAFE_MODE:
            if (spoon_level >= 2) {
                return STATE_LOW_POWER;
            }
            break;
    }
    
    return current_state; // No transition
}
```

### 2.4 Mode-Specific Functionality

#### 2.4.1 Normal Mode (Spoons 4-10)

**Enabled Features:**
- Full display functionality
- All haptic feedback patterns
- LoRa mesh communication (active)
- BLE scanning (active)
- HRV monitoring (active)
- All sensor readings
- Full processing power

**Power Profile:**
- CPU: 240 MHz (dual-core)
- Display: Full brightness
- Radio: Active scanning/transmission
- Sensors: Continuous sampling

#### 2.4.2 Low Power Mode (Spoons 2-3)

**Enabled Features:**
- Reduced display brightness (50%)
- Essential haptic patterns only
- LoRa mesh (periodic, reduced frequency)
- BLE scanning (reduced frequency)
- HRV monitoring (sampling every 10s instead of 1s)
- Essential sensors only
- Reduced CPU frequency

**Power Profile:**
- CPU: 160 MHz (single-core)
- Display: 50% brightness
- Radio: Periodic wake (every 30s)
- Sensors: Reduced sampling rate

#### 2.4.3 Safe Mode (Spoons 0-1)

**Enabled Features:**
- Minimal display (essential info only)
- Critical haptic alerts only
- LoRa mesh (emergency only)
- BLE disabled
- HRV monitoring disabled
- Essential sensors only (proximity)
- Minimal CPU frequency

**Power Profile:**
- CPU: 80 MHz (single-core, deep sleep enabled)
- Display: 25% brightness, minimal updates
- Radio: Deep sleep, wake on emergency only
- Sensors: Proximity only, sampled every 60s

### 2.5 Spoon Level Monitoring

**Input Sources:**

1. **Manual Entry:** User sets spoon level via UI
2. **Activity Tracking:** Automatic deduction based on activities
3. **Physiological Signals:** HRV coherence, stress indicators
4. **Time-Based:** Gradual recovery over time

**Spoon Calculation:**

```c
typedef struct {
    uint8_t base_level;           // User-set or calculated
    uint8_t activity_deduction;   // From activity tracking
    uint8_t stress_adjustment;    // From HRV/stress sensors
    uint8_t time_recovery;        // Gradual recovery
} spoon_metrics_t;

uint8_t calculate_spoon_level(spoon_metrics_t *metrics) {
    int16_t level = metrics->base_level;
    level -= metrics->activity_deduction;
    level -= metrics->stress_adjustment;
    level += metrics->time_recovery;
    
    // Clamp to 0-10 range
    if (level < 0) return 0;
    if (level > 10) return 10;
    return (uint8_t)level;
}
```

### 2.6 Power Management

**Dynamic Frequency Scaling:**

```c
void set_cpu_frequency(device_state_t state) {
    switch (state) {
        case STATE_NORMAL:
            setCpuFrequencyMhz(240);
            break;
        case STATE_LOW_POWER:
            setCpuFrequencyMhz(160);
            break;
        case STATE_SAFE_MODE:
            setCpuFrequencyMhz(80);
            break;
    }
}
```

**Radio Power Management:**

```c
void configure_radio_power(device_state_t state) {
    switch (state) {
        case STATE_NORMAL:
            lora.setTxPower(20);  // Full power
            lora.setDutyCycle(false);  // No duty cycle limit
            break;
        case STATE_LOW_POWER:
            lora.setTxPower(14);  // Reduced power
            lora.setDutyCycle(true);  // 1% duty cycle
            break;
        case STATE_SAFE_MODE:
            lora.sleep();  // Radio off
            break;
    }
}
```

**Display Power Management:**

```c
void configure_display_power(device_state_t state) {
    switch (state) {
        case STATE_NORMAL:
            display.setBrightness(255);  // Full brightness
            display.setUpdateRate(60);   // 60 FPS
            break;
        case STATE_LOW_POWER:
            display.setBrightness(128);  // 50% brightness
            display.setUpdateRate(30);   // 30 FPS
            break;
        case STATE_SAFE_MODE:
            display.setBrightness(64);   // 25% brightness
            display.setUpdateRate(1);     // 1 FPS (minimal updates)
            break;
    }
}
```

---

## 3. Reference Implementation

### 3.1 Complete State Machine (ESP-IDF)

```c
#include "esp_system.h"
#include "driver/gpio.h"
#include "driver/ledc.h"

typedef enum {
    STATE_NORMAL,
    STATE_LOW_POWER,
    STATE_SAFE_MODE
} device_state_t;

typedef struct {
    device_state_t current_state;
    uint8_t spoon_level;
    uint32_t last_transition_time;
    bool state_changed;
} state_machine_t;

static state_machine_t g_state_machine = {
    .current_state = STATE_NORMAL,
    .spoon_level = 10,
    .last_transition_time = 0,
    .state_changed = false
};

device_state_t determine_next_state(uint8_t spoon_level, device_state_t current_state) {
    switch (current_state) {
        case STATE_NORMAL:
            if (spoon_level <= 3) {
                return STATE_LOW_POWER;
            }
            break;
            
        case STATE_LOW_POWER:
            if (spoon_level <= 1) {
                return STATE_SAFE_MODE;
            } else if (spoon_level >= 4) {
                return STATE_NORMAL;
            }
            break;
            
        case STATE_SAFE_MODE:
            if (spoon_level >= 2) {
                return STATE_LOW_POWER;
            }
            break;
    }
    
    return current_state;
}

void apply_state_configuration(device_state_t state) {
    switch (state) {
        case STATE_NORMAL:
            // Full functionality
            set_cpu_frequency(240);
            configure_radio_power(STATE_NORMAL);
            configure_display_power(STATE_NORMAL);
            enable_all_sensors();
            break;
            
        case STATE_LOW_POWER:
            // Reduced functionality
            set_cpu_frequency(160);
            configure_radio_power(STATE_LOW_POWER);
            configure_display_power(STATE_LOW_POWER);
            enable_essential_sensors();
            break;
            
        case STATE_SAFE_MODE:
            // Essential functions only
            set_cpu_frequency(80);
            configure_radio_power(STATE_SAFE_MODE);
            configure_display_power(STATE_SAFE_MODE);
            enable_proximity_sensor_only();
            break;
    }
}

void state_machine_update(uint8_t new_spoon_level) {
    g_state_machine.spoon_level = new_spoon_level;
    
    device_state_t next_state = determine_next_state(
        new_spoon_level,
        g_state_machine.current_state
    );
    
    if (next_state != g_state_machine.current_state) {
        // State transition
        uint32_t now = esp_timer_get_time() / 1000; // milliseconds
        
        // Prevent rapid oscillation (minimum 5 seconds between transitions)
        if (now - g_state_machine.last_transition_time > 5000) {
            g_state_machine.current_state = next_state;
            g_state_machine.last_transition_time = now;
            g_state_machine.state_changed = true;
            
            apply_state_configuration(next_state);
            
            // Log state change
            ESP_LOGI("STATE", "Transitioned to state %d (spoon level: %d)",
                     next_state, new_spoon_level);
        }
    }
}

void state_machine_task(void *pvParameters) {
    while (1) {
        // Read current spoon level (from user input, sensors, etc.)
        uint8_t spoon_level = read_spoon_level();
        
        // Update state machine
        state_machine_update(spoon_level);
        
        // Sleep for 1 second
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
```

### 3.2 Spoon Level Calculation

```c
typedef struct {
    uint8_t base_level;           // User-set base level
    int8_t activity_deduction;    // Activities consume spoons
    int8_t stress_adjustment;     // Stress reduces capacity
    uint32_t last_activity_time;  // For time-based recovery
} spoon_tracker_t;

static spoon_tracker_t g_spoon_tracker = {
    .base_level = 10,
    .activity_deduction = 0,
    .stress_adjustment = 0,
    .last_activity_time = 0
};

uint8_t calculate_spoon_level(void) {
    uint32_t now = esp_timer_get_time() / 1000000; // seconds
    
    // Time-based recovery: +0.1 spoons per minute of rest
    uint32_t rest_time = now - g_spoon_tracker.last_activity_time;
    int8_t time_recovery = (int8_t)(rest_time / 60 * 0.1);
    if (time_recovery > 10) time_recovery = 10; // Cap at 10
    
    int16_t level = g_spoon_tracker.base_level;
    level -= g_spoon_tracker.activity_deduction;
    level -= g_spoon_tracker.stress_adjustment;
    level += time_recovery;
    
    // Clamp to 0-10
    if (level < 0) return 0;
    if (level > 10) return 10;
    return (uint8_t)level;
}

void consume_spoons(uint8_t amount) {
    g_spoon_tracker.activity_deduction += amount;
    if (g_spoon_tracker.activity_deduction > 10) {
        g_spoon_tracker.activity_deduction = 10;
    }
    g_spoon_tracker.last_activity_time = esp_timer_get_time() / 1000000;
}
```

---

## 4. Power Budget Analysis

### 4.1 Mode Power Consumption

**Normal Mode:**
- CPU (240 MHz, dual-core): ~80 mA
- Display (full brightness): ~30 mA
- LoRa (active): ~120 mA (TX), ~10 mA (RX)
- BLE (scanning): ~10 mA
- Sensors: ~5 mA
- **Total (idle):** ~125 mA
- **Total (TX):** ~245 mA

**Low Power Mode:**
- CPU (160 MHz, single-core): ~40 mA
- Display (50% brightness): ~15 mA
- LoRa (periodic): ~60 mA (TX), ~5 mA (RX)
- BLE (reduced): ~5 mA
- Sensors (reduced): ~2 mA
- **Total (idle):** ~67 mA
- **Total (TX):** ~122 mA

**Safe Mode:**
- CPU (80 MHz, deep sleep): ~5 mA (awake), <100 µA (sleep)
- Display (25% brightness): ~8 mA
- LoRa (sleep): <1 mA
- BLE (disabled): 0 mA
- Sensors (proximity only): ~1 mA
- **Total (awake):** ~14 mA
- **Total (sleep):** <1 mA

### 4.2 Battery Life Estimation

**Assumptions:**
- Battery capacity: 500 mAh
- Normal mode: 50% active, 50% idle
- Low Power mode: 20% active, 80% idle
- Safe Mode: 10% awake, 90% sleep

**Calculations:**

- **Normal Mode:** (245 × 0.5 + 125 × 0.5) = 185 mA average
  - Battery life: 500 mAh / 185 mA = **2.7 hours**

- **Low Power Mode:** (122 × 0.2 + 67 × 0.8) = 78.8 mA average
  - Battery life: 500 mAh / 78.8 mA = **6.3 hours**

- **Safe Mode:** (14 × 0.1 + 0.1 × 0.9) = 1.49 mA average
  - Battery life: 500 mAh / 1.49 mA = **335 hours (14 days)**

**Mixed Usage (Realistic):**
- 30% Normal, 50% Low Power, 20% Safe Mode
- Average: 185 × 0.3 + 78.8 × 0.5 + 1.49 × 0.2 = 92.2 mA
- Battery life: 500 mAh / 92.2 mA = **5.4 hours**

---

## 5. Prior Art Survey

### 5.1 Related Work

**Power Management Systems:**
- Dynamic voltage and frequency scaling (DVFS)
- **Distinction:** This is capacity-driven, not just power optimization

**Adaptive Systems:**
- Context-aware computing
- **Distinction:** This uses spoon theory as capacity metric

**Assistive Technology:**
- Various adaptive interfaces
- **Distinction:** This provides automatic mode switching based on cognitive capacity

**State Machines:**
- Standard state machine patterns
- **Distinction:** This integrates with physiological and activity monitoring

### 5.2 Novel Contributions

1. **Spoon Theory Integration:** First application of spoon theory to device state management
2. **Capacity-Driven Design:** Device adapts to user capacity, not just power needs
3. **Automatic Transitions:** No manual configuration required
4. **Hysteresis Implementation:** Prevents rapid oscillation
5. **Multi-Modal Input:** Spoon level from multiple sources (manual, activity, sensors)

---

## 6. Applications

### 6.1 Primary Use Case: Node One Hardware

The spoon-aware state machine is implemented in Node One (ESP32-S3) firmware, enabling the device to adapt to user cognitive capacity automatically.

### 6.2 Secondary Applications

- **Battery Extension:** Automatic power management extends device runtime
- **Cognitive Protection:** Prevents overwhelming users during low-capacity periods
- **Accessibility:** Reduces need for manual configuration
- **Research:** Data collection on capacity-driven device usage

---

## 7. Implementation Status

**Current Status:** Specification complete, firmware implementation in progress.

**Components:**
- ✅ State machine specification
- ✅ Transition rules and hysteresis
- ✅ Power management algorithms
- 🚧 ESP32-S3 firmware (in development)
- 🚧 Spoon level monitoring (in development)
- ⏳ Sensor integration (planned)

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

1. Miserandino, Christine. "The Spoon Theory." https://butyoudontlooksick.com/
2. ESP-IDF Programming Guide. https://docs.espressif.com/projects/esp-idf/
3. ESP32-S3 Technical Reference Manual. https://www.espressif.com/
4. Dynamic Voltage and Frequency Scaling. Various academic papers and implementations.

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-02-14  
**Status:** Ready for Zenodo Submission
