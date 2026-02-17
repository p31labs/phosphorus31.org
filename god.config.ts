// god.config.ts
// P31: THE SOVEREIGN STACK CONFIGURATION
// "Structure determines performance."
// FDA Classification: 21 CFR §890.3710 - Powered Communication System (Product Code ILQ)

export const P31 = {
  identity: {
    name: "P31 Labs",
    legalName: "Phosphorus-31 Labs Inc.",
    ein: "PENDING", // Georgia 501(c)(3)
    mission: "Assistive Technology for Neurodivergent Sovereignty",
    operator: "n0", // Node Zero (Will)
    foundedBy: "Autistic submarine electrician (16 years DoD civilian service)",
    fdaClassification: "21 CFR §890.3710 - Powered Communication System",
    productCode: "ILQ",
    deviceClass: "Class II (510(k) Exempt)",
  },

  // THE 4+1 ARCHITECTURE (The Naming Standard)
  nodes: {
    n0: "Operator (User)",
    b: "Buffer (Cognitive Shield - Voltage Scanner + Pattern Recognition)",
    c: "Centaur (Backend Brain - FastAPI + Redis + WebSocket)",
    s: "Scope (Frontend UI - React Dashboard + GAS Production Interface)",
    sync: "Sync (Google Apps Script Mesh - SIMPLEX v6)",
    N1: "Node One (Hardware Device - ESP32-S3 + DRV2605L Haptics + LoRa)",
  },

  // PORTS & WIRING (Hardcoded for stability)
  ports: {
    s: 3000, // React UI (Scope)
    c: 4000, // Centaur Backend
    b: 5000, // Buffer Cognitive Shield
    redis: 6379, // The Nervous System
  },

  // THE NEURAL LINK (Apps Script - SIMPLEX v6)
  // Update this URL after 'clasp push'
  syncUrl:
    (typeof process !== "undefined" && process.env?.VITE_GAS_DEPLOYMENT_URL) ||
    "https://script.google.com/macros/s/[INSERT_DEPLOYMENT_ID]/exec",

  // DEVICE SPECS (Node One - ESP32-S3)
  // ESP32-S3 DevKitC-1: I2C typically SDA=GPIO8, SCL=GPIO9 or GPIO21/22 depending on variant
  device: {
    board: "ESP32-S3-DevKitC-1",
    hapticDriver: "DRV2605L (I2C 0x5A)",
    hapticI2C: { sda: 8, scl: 9 }, // Standard DevKitC-1 I2C for DRV2605L
    loraModule: "RFM95W 915MHz",
    display: "SSD1306 OLED 128x64",
    battery: "3.7V LiPo (2000mAh target)",
  },

  // COLOR TOKENS (Phosphorus-31 Branding)
  tokens: {
    phosphorus: "#2ecc71", // Signal / Good / Life
    void: "#050510", // Background / Deep Space
    amber: "#f59e0b", // Alert / Attention / Warning
    calcium: "#60a5fa", // Structure / Bone / Stability
    crimson: "#dc2626", // Critical / Danger
    slate: "#64748b", // Neutral / Interface
  },

  // CLAIMS LANGUAGE (Legal Compliance)
  approvedClaims: [
    "Powered communication system for individuals with physical impairment",
    "Cognitive prosthetic device under ADA protections",
    "Executive function support tool (non-therapeutic)",
    "Sensory regulation device (wellness, not medical treatment)",
  ],
  prohibitedClaims: ["Treats ADHD", "Cures Autism", "Therapy", "Diagnoses"],
} as const;

export type NodeId = keyof typeof P31.nodes;
export type ColorToken = keyof typeof P31.tokens;
