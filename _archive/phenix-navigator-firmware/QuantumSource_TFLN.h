/*
 * ══════════════════════════════════════════════════════════════════════════════
 * COGNITIVE SHIELD: PHYSICS LAYER HAL (QuantumSource_TFLN.h)
 * Version: 2.0 (The "No Crystals" Paradigm)
 * Status: APPROVED / PRODUCTION TARGET
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 * Defines the hardware abstraction for the new Integrated Quantum Photonics (IQP)
 * source based on Thin-Film Lithium Niobate (TFLN).
 *
 * CHANGE LOG:
 * - DEPRECATED: Bulk BBO Crystal (Type-I SPDC) - REMOVED per directive.
 * - ADDED: X-cut MgO:TFLN Waveguides (High Brightness).
 * - ADDED: Integrated Electro-Optic Modulators (>10 GHz).
 * - ADDED: SNSPD Detector Interface (Future-proofing).
 *
 * PHYSICS PARAMETERS:
 * - Material: Magnesium-Oxide doped Lithium Niobate (MgO:LiNbO3).
 * - Orientation: X-cut (Z-axis in plane) for stability against photorefraction.
 * - Architecture: Periodically Poled (PPLN) Ridge Waveguides.
 * ══════════════════════════════════════════════════════════════════════════════
 */

#ifndef QUANTUM_SOURCE_TFLN_H
#define QUANTUM_SOURCE_TFLN_H

#include <stdint.h>

// ══════════════════════════════════════════════════════════════════════════════
// 1. SOURCE SPECIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════

// Source Type Identifier
typedef enum {
    SOURCE_TYPE_BBO_BULK_DEPRECATED = 0,
    SOURCE_TYPE_TFLN_WAVEGUIDE = 1,      // Primary Target
    SOURCE_TYPE_ALGAAS_BRW = 2           // Future R&D (Mark II)
} quantum_source_type_t;

// TFLN Configuration
#define TFLN_PUMP_WAVELENGTH_NM    775   // or 405nm depending on design (775->1550 for Telecom)
#define TFLN_SPDC_EFFICIENCY       10000000 // Pairs/s/mW (High Brightness)
#define TFLN_WAVEGUIDE_LOSS_DB_CM  0.1   // Low loss prop
#define TFLN_DAMAGE_THRESHOLD      "High (MgO doped)"

typedef struct {
    quantum_source_type_t type;
    uint16_t pump_power_mw;      // Laser diode power
    uint32_t pair_rate_target;   // Target generation rate
    float    temperature_c;      // TEC setpoint (critical for Phase Matching)
} quantum_source_config_t;

// ══════════════════════════════════════════════════════════════════════════════
// 2. MODULATOR SPECIFICATIONS (Integrated)
// ══════════════════════════════════════════════════════════════════════════════

// The "No Crystals" directive implies moving from discrete Pockels cells
// to integrated waveguide modulators.

#define MODULATOR_V_PI_VOLTS       3.5   // Half-wave voltage (Low Vpi on TFLN)
#define MODULATOR_BANDWIDTH_GHZ    10    // Speed
#define MODULATOR_TYPE             "Mach-Zehnder Interferometer (MZI)"

typedef struct {
    float bias_voltage_dc;       // DC Bias point
    float rf_amplitude_v;        // RF drive amplitude
    uint8_t encoding_basis;      // 0=Z, 1=X, 2=SIC-POVM
} modulator_state_t;

// ══════════════════════════════════════════════════════════════════════════════
// 3. DETECTOR INTERFACE (SNSPD Ready)
// ══════════════════════════════════════════════════════════════════════════════

// Supporting both legacy APDs (Si/InGaAs) and new SNSPDs
typedef enum {
    DETECTOR_SI_APD = 0,
    DETECTOR_INGAAS_APD = 1,
    DETECTOR_SNSPD = 2           // Superconducting Nanowire (Ideal)
} detector_type_t;

typedef struct {
    detector_type_t type;
    uint32_t dark_count_rate_hz;
    uint8_t efficiency_percent;
    uint32_t dead_time_ns;
} detector_config_t;

// ══════════════════════════════════════════════════════════════════════════════
// 4. API DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * @brief Initialize the Quantum Source (TFLN)
 * Configures the pump laser and TEC controller for X-cut PPLN.
 */
void Quantum_Source_Init(quantum_source_config_t *config);

/**
 * @brief Set Modulator State
 * Applies voltage to the integrated electrodes for state preparation.
 */
void Quantum_Modulator_Set(modulator_state_t *state);

/**
 * @brief Calibrate Phase Matching
 * Scans temperature to find the SPDC peak (Quasi-Phase Matching).
 */
void Quantum_Source_Calibrate(void);

#endif // QUANTUM_SOURCE_TFLN_H
