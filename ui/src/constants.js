// ══════════════════════════════════════════════════════════════════════════════
// PHENIX NAVIGATOR CREATOR — CONSTANTS
// Sovereign Stack configuration. The numbers that define the universe.
// ══════════════════════════════════════════════════════════════════════════════

// ── Trimtab Quotes (Fuller Persona) ──────────────────────────────────────────
export const TRIMTAB_QUOTES = [
  "Something hit me very hard once, thinking about what one little man could do. Think of the Queen Mary — the whole ship goes by and then comes the rudder. And there's a tiny thing at the edge of the rudder called a trim tab.",
  "It's the little rudder that moves the big rudder that moves the billion-ton ship. I said, call me Trim Tab.",
  "The things to do are: the things that need doing, that you see need to be done, and that no one else seems to see need to be done.",
  "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.",
  "There is nothing in a caterpillar that tells you it's going to be a butterfly.",
  "We are called to be architects of the future, not its victims.",
  "Dare to be naïve.",
  "Integrity is the essence of everything successful."
];

// ── Voice Command Mapping ────────────────────────────────────────────────────
export const VOICE_COMMANDS = {
  STATUS: ['status', 'state', 'coherence', 'how are we', 'report'],
  HELP: ['help', 'guide', 'wisdom', 'trim tab', 'fuller'],
  BUILD: ['build', 'create', 'construct', 'make', 'design'],
  MATERIALIZE: ['materialize', 'fabricate', 'print', 'slice', 'manifest'],
  RESET: ['reset', 'clear', 'start over', 'begin again', 'wipe'],
  VIEW: ['view', 'look', 'observe', 'inspect', 'examine']
};

// ── VPI Phase State Machine ──────────────────────────────────────────────────
// Vacuum Pressure Impregnation: the process that binds fiber to resin
// Also maps to cognitive load management in the Phenix paradigm
export const VPI_PHASES = {
  VACUUM: {
    name: 'VACUUM',
    description: 'Stripping noise. Preparing the void.',
    color: '#64748b',
    particleColor: '#94a3b8',
    threshold: 0
  },
  FLOOD: {
    name: 'FLOOD',
    description: 'Introducing resin into the zone.',
    color: '#22d3ee',
    particleColor: '#67e8f9',
    threshold: 3
  },
  PRESSURIZE: {
    name: 'PRESSURIZE',
    description: 'Forcing structure into the void.',
    color: '#a78bfa',
    particleColor: '#c4b5fd',
    threshold: 10
  },
  CURE: {
    name: 'CURE',
    description: 'Mesh hardening. Coherence achieved.',
    color: '#4ade80',
    particleColor: '#86efac',
    threshold: 25
  }
};

export const VPI_PHASE_ORDER = ['VACUUM', 'FLOOD', 'PRESSURIZE', 'CURE'];

// ── Milestone Speech (block count triggers) ──────────────────────────────────
export const MILESTONE_SPEECH = {
  1: "First block placed. The universe acknowledges your intent.",
  5: "Five blocks. A foundation emerges from nothing.",
  10: "Ten blocks. Structure is becoming visible.",
  25: "Twenty-five blocks. The mesh is curing. Coherence strengthens.",
  50: "Fifty blocks. You are building something real.",
  100: "One hundred blocks. This is no longer an idea. It is a thing."
};

export const SORTED_MILESTONES = Object.keys(MILESTONE_SPEECH)
  .map(Number)
  .sort((a, b) => a - b);

// ── Design System Colors ─────────────────────────────────────────────────────
export const COLORS = {
  // Primary palette
  CYAN: '#22d3ee',
  AMBER: '#fbbf24',
  PURPLE: '#a78bfa',
  
  // Neon variants (emissive)
  NEON_CYAN: '#06b6d4',
  NEON_AMBER: '#f59e0b',
  NEON_PURPLE: '#8b5cf6',
  
  // System states
  ALERT_RED: '#ef4444',
  COHERENT_GREEN: '#4ade80',
  DECOHERENT_RED: '#f87171',
  
  // Glass morphism
  GLASS_BG: 'rgba(2, 6, 23, 0.85)',
  GLASS_BORDER: 'rgba(255, 255, 255, 0.08)',
  GLASS_BORDER_CYAN: 'rgba(34, 211, 238, 0.25)',
  
  // Text
  TEXT_PRIMARY: '#f8fafc',
  TEXT_SECONDARY: '#94a3b8',
  TEXT_MUTED: '#64748b'
};

// ── Quantum Simulation Parameters ────────────────────────────────────────────
export const QUANTUM = {
  NUM_POSNER_MOLECULES: 8,      // Fisher's phosphorus clusters
  BASE_T2: 45,                  // Base decoherence time (seconds)
  MIN_COHERENCE: 0.002,         // Floor before reset
  RECOHERENCE_BOOST: 0.025,     // Boost per block placement
  VOLTAGE_DECOHERENCE: 2.0      // How much voltage accelerates decay
};

// ── Fabrication Defaults (Kiri:Moto FDM) ─────────────────────────────────────
export const FABRICATION_DEFAULTS = {
  sliceShells: 2,
  sliceFillSparse: 0.15,
  sliceHeight: 0.2,
  sliceTopLayers: 3,
  sliceBottomLayers: 3
};

// ── Mode Definitions ─────────────────────────────────────────────────────────
export const MODES = ['BUILD', 'VIEW', 'SLICE', 'PRINT'];

// ── Pre-computed Satellite Positions ─────────────────────────────────────────
// 8 Posner molecules arranged in a ring around the coherence orb
export const SATELLITE_POSITIONS = Array.from(
  { length: QUANTUM.NUM_POSNER_MOLECULES },
  (_, i) => {
    const angle = (i / QUANTUM.NUM_POSNER_MOLECULES) * Math.PI * 2;
    const r = 1.4;
    return [Math.cos(angle) * r, Math.sin(angle) * r, 0];
  }
);

// ── Hardware Constants ───────────────────────────────────────────────────────
export const ESP32_VENDOR_ID = 0x303a;  // Espressif
export const ESP32_PRODUCT_ID = 0x1001; // ESP32-S3
export const BAUD_RATE = 115200;

// ── Voxel Engine ─────────────────────────────────────────────────────────────
export const MAX_INSTANCES = 2000;
export const BLOCK_SIZE = 0.95;  // Slight gap between blocks
