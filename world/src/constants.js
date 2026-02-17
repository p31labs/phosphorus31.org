// VoxelWorld Constants
export const MAX_INSTANCES = 10000;
export const BLOCK_SIZE = 1;

export const COLORS = {
  CYAN: 0x00ffff,
  NEON_CYAN: 0x00ffaa,
  MAGENTA: 0xff00ff,
  GOLD: 0xffd700,
  WHITE: 0xffffff,
};

export const FABRICATION_DEFAULTS = {
  layerHeight: 0.2,
  infillDensity: 20,
  printSpeed: 60,
  wallThickness: 1.2,
  supportEnabled: true,
  bedTemp: 60,
  nozzleTemp: 200,
};

// Quantum coherence simulation constants (Fisher-Escolà engine)
export const QUANTUM = {
  NUM_POSNER_MOLECULES: 8,
  BASE_T2: 10.0,           // Base decoherence time in seconds
  MIN_COHERENCE: 0.01,     // Minimum coherence threshold
  RECOHERENCE_BOOST: 0.15, // Coherence boost on user action
  VOLTAGE_DECOHERENCE: 0.02, // Voltage-driven decoherence factor
};

export default {
  MAX_INSTANCES,
  BLOCK_SIZE,
  COLORS,
  FABRICATION_DEFAULTS,
  QUANTUM,
};
