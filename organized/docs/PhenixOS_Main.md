/*
 * PHENIX OS - CORE STATE MACHINE
 * ARCHITECTURE: WYE-DELTA CONTROL LOOP
 * AUTHOR: W. JOHNSON / TRF
 * OBJECTIVE: Manage emotional load impedance and maintain mesh integrity.
 */

#include <Arduino.h>
#include "config_phenix_navigator.h"

// --- CONTROL VARIABLES (The State) ---

// 1. Structural Load (0-100%) - The "Amperage"
// We use float for internal calculation to allow for smoothing (PID)
float currentLoad = 0.0;
float targetLoad = 0.0;
const float SMOOTHING_FACTOR = 0.1; // Filters out "noise" or panic spikes

// 2. Integrity State (Boolean) - The "Insulation"
// OPEN (True) = Available for connection
// LOCKED (False) = High Impedance / Unavailable
bool integrityState = true; 

// 3. Ground Check (Timestamp) - The "Neutral"
unsigned long lastGroundPing = 0;

// --- STATE DEFINITIONS ---
enum SystemState {
    STATE_WYE_IDLE,      // Normal Operation (Green Board)
    STATE_TRANSITION,    // Open Transition (High Load / Adjusting)
    STATE_DELTA_RUN,     // High Load / Mesh Supported
    STATE_CRITICAL_TRIP  // Overload (Red Board)
};

SystemState currentState = STATE_WYE_IDLE;

// --- HARDWARE INTERRUPT HANDLERS ---

// Debounce logic for mechanical switches to prevent "contact bounce"
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

void IRAM_ATTR handleRockerUp() {
    if ((millis() - lastDebounceTime) > debounceDelay) {
        targetLoad = constrain(targetLoad + 5.0, 0, 100); // Coarse adjustment
        lastDebounceTime = millis();
    }
}

void IRAM_ATTR handleRockerDown() {
    if ((millis() - lastDebounceTime) > debounceDelay) {
        targetLoad = constrain(targetLoad - 5.0, 0, 100);
        lastDebounceTime = millis();
    }
}

void IRAM_ATTR handleEncoder() {
    // Encoder logic here for fine adjustment (+/- 1.0)
    // Updates targetLoad
}

// --- CORE LOGIC: THE HYSTERESIS LOOP ---

void updateLoadPhysics() {
    // This implements the "Dampening" effect.
    // We don't jump instantly to the new load; we ramp to it.
    // This prevents "Arc Flash" (emotional snapping) from sudden input changes.
    
    if (abs(currentLoad - targetLoad) > 0.1) {
        currentLoad += (targetLoad - currentLoad) * SMOOTHING_FACTOR;
    } else {
        currentLoad = targetLoad;
    }
    
    // Determine State based on Load Thresholds
    if (currentLoad >= 90.0) {
        currentState = STATE_CRITICAL_TRIP;
    } else if (currentLoad >= 70.0) {
        currentState = STATE_DELTA_RUN; // Requires mesh support
    } else if (abs(currentLoad - targetLoad) > 10.0) {
        currentState = STATE_TRANSITION; // Actively changing state
    } else {
        currentState = STATE_WYE_IDLE;
    }
}

// --- OUTPUT HANDLERS (VISUAL FEEDBACK) ---

void updateLEDs() {
    // WS2812B Logic
    // Maps State to Color (The "Green Board" Concept)
    
    switch (currentState) {
        case STATE_WYE_IDLE:
            // Slow, Breathing Green/Blue (Nominal)
            setLedStripColor(0, 255, 100, BREATHING_EFFECT); 
            break;
            
        case STATE_TRANSITION:
            // Solid Amber (Caution - Configuration Change)
            setLedStripColor(255, 165, 0, SOLID_EFFECT);
            break;
            
        case STATE_DELTA_RUN:
            // Slow Pulse Orange (High Torque Mode)
            setLedStripColor(255, 100, 0, PULSE_EFFECT);
            break;
            
        case STATE_CRITICAL_TRIP:
            // Fast Strobe Red (Arc Flash Warning)
            // This alerts the entire mesh
            setLedStripColor(255, 0, 0, STROBE_EFFECT);
            break;
    }
}

// --- MESH NETWORKING (LORA) ---

void broadcastTelemetry() {
    // Packs the state into a compact byte packet for LoRa transmission
    // Packet Structure: [DeviceID, LoadVal, IntegrityBit, StateCode]
    
    uint8_t packet[4];
    packet[0] = DEVICE_ID;
    packet[1] = (uint8_t)currentLoad;
    packet[2] = (uint8_t)integrityState;
    packet[3] = (uint8_t)currentState;
    
    radio.transmit(packet, 4);
}

// --- MAIN LOOP ---

void setup() {
    initHardware(); // Initialize GPIOs from config.h
    initRadio();
    initScreen();
    
    // "Green Board" on startup
    targetLoad = 0;
    currentLoad = 0;
}

void loop() {
    // 1. Read Inputs (Polling switches, updating Encoder)
    readMechanicalSwitches(); 
    
    // 2. Physics Engine (Apply Hysteresis/Smoothing)
    updateLoadPhysics();
    
    // 3. Update Visuals (Screen & LED Strip)
    updateScreenUI(currentLoad, integrityState);
    updateLEDs();
    
    // 4. Mesh Comms (Heartbeat)
    // Broadcast state every 10 seconds OR immediately on Critical State
    static unsigned long lastTx = 0;
    if (currentState == STATE_CRITICAL_TRIP || (millis() - lastTx > 10000)) {
        broadcastTelemetry();
        lastTx = millis();
    }
}