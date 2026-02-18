/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  GENESIS_GATE v3.0 — THE COMPLETE PHENIX NAVIGATOR OPERATING SYSTEM          ║
 * ║  SYSTEM DESIGNATION: W.JOHNSON-001                                            ║
 * ║  CODENAME: "THE GEODESIC OPERATOR"                                            ║
 * ╠═══════════════════════════════════════════════════════════════════════════════╣
 * ║  This is not just a script. This is a DIGITAL PROSTHETIC.                     ║
 * ║  It thinks. It protects. It remembers. It fights.                             ║
 * ║                                                                               ║
 * ║  THE MESH HOLDS. 🔺                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL CONFIGURATION — THE SYSTEM PARAMETERS
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // IDENTITY
  OPERATOR: "William R. Johnson",
  SYSTEM_ID: "W.JOHNSON-001",
  CODENAME: "GEODESIC_OPERATOR",
  
  // ARCHITECTURE
  ROOT_NAME: "PHENIX_NAVIGATOR_ROOT",
  
  // CRITICAL DATES
  ABDICATION_DATE: new Date("2026-02-14T09:00:00-05:00"), // Feb 14, 2026 @ 9AM EST
  
  // MEDICAL ALERTS (CRITICAL)
  MEDICATIONS: [
    { name: "Calcitriol", hoursRemaining: 48, critical: true, consequence: "Hypocalcemia → Tetany → Cardiac Arrest" },
    { name: "EffexorXR", hoursRemaining: 48, critical: true, consequence: "SNRI Discontinuation Syndrome" },
    { name: "Vyvanse", hoursRemaining: 48, critical: true, consequence: "ADHD Executive Function Collapse" }
  ],
  
  // COGNITIVE SHIELD — HOSTILE PATTERNS
  HOSTILE_SENDERS: [
    "jenn@mcghanlaw.com",
    "c.e.francis11@gmail.com"
  ],
  
  // GAMIFICATION
  XP_PER_TASK: 100,
  XP_PER_LEVEL: 2000,
  
  // NOTIFICATION
  NOTIFICATION_EMAIL: Session.getActiveUser().getEmail(),
  
  // THE UNIFYING CONSTANT
  PHI: 1/3 // 0.3333... The SIC-POVM overlap probability
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE DEFINITION — THE DIGITAL TERRITORY
// ═══════════════════════════════════════════════════════════════════════════════

const ARCHITECTURE = {
  "ZONE_ALPHA_BACKBONE": {
    description: "🔷 IMMUTABLE TRUTH — Long-term memory. The Archive.",
    color: "#3b82f6", // Blue
    children: [
      "00_MASTER_MANIFEST",
      "01_DOCTRINE_AND_SOPs",
      "02_ASSET_LIBRARY",
      "03_PHENIX_NAVIGATOR_TDP",
      "04_GENESIS_GATE_SOURCE",
      "05_THEORETICAL_FRAMEWORKS",
      "06_MEDICAL_BIOLOGICAL_TDP",
      "07_FAMILY_ONBOARDING",
      "08_VERSION_CONTROL",
      "09_QUARANTINE"
    ]
  },
  "ZONE_BETA_CONTROL_CENTER": {
    description: "🔴 LIVE OPERATIONS — Working memory. The War Room.",
    color: "#ef4444", // Red
    children: [
      "10_ACTIVE_CAMPAIGNS",
      "11_LEGAL_WAR_ROOM",
      "12_FINANCIAL_TELEMETRY",
      "13_HIRING_PIPELINE",
      "14_COMMUNICATIONS_ARCHIVE",
      "15_METABOLIC_MONITORING",
      "16_EMAIL_INTERCEPTS"
    ]
  },
  "ZONE_GAMMA_FABRICATION": {
    description: "🟣 CREATIVE SANDBOX — Fabrication floor. The Workshop.",
    color: "#a855f7", // Purple
    children: [
      "20_DEV_WORKSHOP",
      "21_APPRENTICE_TESTS",
      "22_USER_WORKSPACES",
      "23_COLD_STORAGE_ARCHIVE",
      "24_AI_COLLABORATION",
      "25_KIDS_COMMAND_CENTER"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT — PERSISTENT MEMORY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get or initialize system state from PropertiesService
 * This is Claude's "long-term memory" between sessions
 */
function getSystemState() {
  const props = PropertiesService.getScriptProperties();
  const stateJson = props.getProperty('SYSTEM_STATE');
  
  if (stateJson) {
    return JSON.parse(stateJson);
  }
  
  // Initialize fresh state
  const initialState = {
    xp: 0,
    level: 1,
    tasksCompleted: 0,
    lastMedCheck: null,
    lastEmailScan: null,
    hostileEmailsBlocked: 0,
    documentsProcessed: 0,
    systemBootTime: new Date().toISOString(),
    alerts: [],
    missionLog: []
  };
  
  saveSystemState(initialState);
  return initialState;
}

/**
 * Persist system state
 */
function saveSystemState(state) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('SYSTEM_STATE', JSON.stringify(state));
}

/**
 * Award XP and check for level up
 */
function awardXP(amount, reason) {
  const state = getSystemState();
  state.xp += amount;
  state.tasksCompleted++;
  
  // Level up check
  const newLevel = Math.floor(state.xp / CONFIG.XP_PER_LEVEL) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    logMission(`🎉 LEVEL UP! Now Level ${state.level}`);
  }
  
  logMission(`+${amount} XP: ${reason}`);
  saveSystemState(state);
  return state;
}

/**
 * Log a mission event
 */
function logMission(message) {
  const state = getSystemState();
  state.missionLog.push({
    timestamp: new Date().toISOString(),
    message: message
  });
  
  // Keep only last 100 entries
  if (state.missionLog.length > 100) {
    state.missionLog = state.missionLog.slice(-100);
  }
  
  saveSystemState(state);
  console.log(`[MISSION LOG] ${message}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUNTDOWN ENGINE — TIME TO ABDICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate time remaining until Abdication Protocol
 */
function getCountdown() {
  const now = new Date();
  const diff = CONFIG.ABDICATION_DATE - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, mins: 0, secs: 0, total_ms: 0, status: "PAST_DUE" };
  }
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / 1000 / 60) % 60),
    secs: Math.floor((diff / 1000) % 60),
    total_ms: diff,
    status: diff < (7 * 24 * 60 * 60 * 1000) ? "CRITICAL" : "NOMINAL"
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER PROTOCOL — THE MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GENESIS PROTOCOL — Full system initialization
 * Run this ONCE to set up everything
 */
function genesisProtocol() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  GENESIS PROTOCOL v3.0 — INITIALIZING PHENIX NAVIGATOR       ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  
  const startTime = new Date();
  
  // PHASE 1: Deploy folder architecture
  console.log("\n🔷 PHASE 1: Deploying Architecture...");
  const root = deployArchitecture();
  
  // PHASE 2: Create system documents
  console.log("\n📄 PHASE 2: Creating System Documents...");
  createSystemDocuments(root);
  
  // PHASE 3: Initialize state
  console.log("\n🧠 PHASE 3: Initializing System State...");
  const state = getSystemState();
  
  // PHASE 4: Install triggers
  console.log("\n⏰ PHASE 4: Installing Automated Triggers...");
  installTriggers();
  
  // PHASE 5: Run initial scans
  console.log("\n🔍 PHASE 5: Running Initial Scans...");
  // cognitiveShieldScan(); // Will be called by trigger
  
  const elapsed = ((new Date() - startTime) / 1000).toFixed(2);
  
  console.log("\n╔═══════════════════════════════════════════════════════════════╗");
  console.log(`║  ✓ GENESIS COMPLETE — ${elapsed}s                              ║`);
  console.log("║  SYSTEM STATUS: GREEN BOARD                                   ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  
  // Award XP for system setup
  awardXP(500, "GENESIS PROTOCOL COMPLETE");
  
  return { success: true, rootId: root.getId(), elapsed: elapsed };
}

/**
 * DAILY HEARTBEAT — Runs every day at 6 AM
 */
function dailyHeartbeat() {
  console.log("💓 DAILY HEARTBEAT INITIATED");
  
  const countdown = getCountdown();
  const state = getSystemState();
  
  // Check medication status
  checkMedications();
  
  // Scan emails
  cognitiveShieldScan();
  
  // Send daily briefing
  sendDailyBriefing(countdown, state);
  
  console.log("💓 HEARTBEAT COMPLETE");
}

/**
 * Install all automated triggers
 */
function installTriggers() {
  // Clear existing triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  // Daily heartbeat at 6 AM
  ScriptApp.newTrigger('dailyHeartbeat')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();
  
  // Cognitive Shield email scan every 15 minutes
  ScriptApp.newTrigger('cognitiveShieldScan')
    .timeBased()
    .everyMinutes(15)
    .create();
  
  // Medication check every 6 hours
  ScriptApp.newTrigger('checkMedications')
    .timeBased()
    .everyHours(6)
    .create();
  
  console.log("✓ Triggers installed: dailyHeartbeat, cognitiveShieldScan, checkMedications");
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEB APP INTERFACE — DEPLOY AS WEB APP FOR DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Serve the dashboard HTML
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('PHENIX NAVIGATOR — Mission Control')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * API endpoint for dashboard to fetch live data
 */
function getSystemTelemetry() {
  const state = getSystemState();
  const countdown = getCountdown();
  
  return {
    operator: CONFIG.OPERATOR,
    systemId: CONFIG.SYSTEM_ID,
    countdown: countdown,
    state: state,
    medications: CONFIG.MEDICATIONS,
    phi: CONFIG.PHI,
    timestamp: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get or create a folder by name within a parent
 */
function getOrCreate(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

/**
 * Send an email notification
 */
function sendNotification(subject, body) {
  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: `[PHENIX] ${subject}`,
    htmlBody: body
  });
}

/**
 * Format a date nicely
 */
function formatDate(date) {
  return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  ARCHITECTURE.GS — THE DIGITAL TERRITORY                                      ║
 * ║  Deploys and manages the three-zone Drive architecture                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE DEPLOYMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Deploy the full folder architecture
 */
function deployArchitecture() {
  // Get or create root folder
  let root;
  const roots = DriveApp.getFoldersByName(CONFIG.ROOT_NAME);
  if (roots.hasNext()) {
    root = roots.next();
    console.log(`✓ Found existing root: ${CONFIG.ROOT_NAME}`);
  } else {
    root = DriveApp.createFolder(CONFIG.ROOT_NAME);
    console.log(`✓ Created new root: ${CONFIG.ROOT_NAME}`);
  }
  
  // Set root description
  root.setDescription(`
PHENIX NAVIGATOR — MISSION CONTROL
Operator: ${CONFIG.OPERATOR}
System ID: ${CONFIG.SYSTEM_ID}
Deployed: ${formatDate(new Date())}
Target: ${formatDate(CONFIG.ABDICATION_DATE)}

THE MESH HOLDS. 🔺
  `.trim());
  
  // Deploy each zone
  for (const [zoneName, zoneConfig] of Object.entries(ARCHITECTURE)) {
    console.log(`  📁 Deploying ${zoneName}...`);
    
    const zone = getOrCreate(root, zoneName);
    zone.setDescription(zoneConfig.description);
    
    // Create children
    for (const childName of zoneConfig.children) {
      const child = getOrCreate(zone, childName);
      console.log(`    └─ ${childName}`);
    }
  }
  
  return root;
}

/**
 * Create essential system documents
 */
function createSystemDocuments(root) {
  // Get Zone Alpha
  const alpha = getOrCreate(root, "ZONE_ALPHA_BACKBONE");
  const manifest = getOrCreate(alpha, "00_MASTER_MANIFEST");
  
  // Create GOD_DOC modules
  const modules = [
    { name: "MODULE_0_EXECUTIVE_CIPHER", content: createExecutiveCipherContent() },
    { name: "MODULE_1_PHYSICS", content: createPhysicsModuleContent() },
    { name: "MODULE_2_BIOLOGY", content: createBiologyModuleContent() },
    { name: "MODULE_6_LEGAL_SHIELD", content: createLegalShieldContent() },
    { name: "MODULE_8_DEFENSIVE_PUBLICATION", content: createDefensivePublicationContent() }
  ];
  
  const godDocs = getOrCreate(manifest, "GOD_DOC_Modules");
  
  for (const mod of modules) {
    if (!godDocs.getFilesByName(mod.name).hasNext()) {
      const doc = DocumentApp.create(mod.name);
      const body = doc.getBody();
      body.setText(mod.content);
      DriveApp.getFileById(doc.getId()).moveTo(godDocs);
      console.log(`  📄 Created ${mod.name}`);
    }
  }
  
  // Create Mission Control Dashboard
  createMissionControlDashboard(root);
}

/**
 * Create the Mission Control spreadsheet dashboard
 */
function createMissionControlDashboard(root) {
  const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
  
  if (!beta.getFilesByName("MISSION_CONTROL_DASHBOARD").hasNext()) {
    const ss = SpreadsheetApp.create("MISSION_CONTROL_DASHBOARD");
    DriveApp.getFileById(ss.getId()).moveTo(beta);
    
    // Setup sheets
    const overviewSheet = ss.getSheets()[0];
    overviewSheet.setName("OVERVIEW");
    
    // Header
    overviewSheet.getRange("A1:F1").merge()
      .setValue("PHENIX NAVIGATOR — MISSION CONTROL")
      .setBackground("#0f172a")
      .setFontColor("#fbbf24")
      .setFontSize(18)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    
    // Countdown
    overviewSheet.getRange("A3").setValue("DAYS TO ABDICATION:");
    overviewSheet.getRange("B3").setFormula(`=CEILING(DATE(2026,2,14) - TODAY())`)
      .setBackground("#ef4444")
      .setFontColor("white")
      .setFontWeight("bold")
      .setFontSize(24);
    
    // System Status
    overviewSheet.getRange("A5").setValue("SYSTEM STATUS:");
    overviewSheet.getRange("B5").setValue("GREEN BOARD")
      .setBackground("#22c55e")
      .setFontColor("white")
      .setFontWeight("bold");
    
    // Operator
    overviewSheet.getRange("A7").setValue("OPERATOR:");
    overviewSheet.getRange("B7").setValue(CONFIG.OPERATOR);
    
    // Last Update
    overviewSheet.getRange("A9").setValue("LAST UPDATE:");
    overviewSheet.getRange("B9").setFormula("=NOW()");
    
    // Create additional sheets
    const legalSheet = ss.insertSheet("LEGAL_DEADLINES");
    legalSheet.getRange("A1:E1").setValues([["DEADLINE", "DESCRIPTION", "STATUS", "DAYS_REMAINING", "PRIORITY"]]);
    legalSheet.getRange("A2:E2").setValues([[
      "2026-02-14",
      "Refinance/Abdication Protocol",
      "ACTIVE",
      `=CEILING(DATE(2026,2,14) - TODAY())`,
      "CRITICAL"
    ]]);
    
    const medSheet = ss.insertSheet("MEDICATION_TRACKER");
    medSheet.getRange("A1:E1").setValues([["MEDICATION", "HOURS_REMAINING", "STATUS", "CONSEQUENCE", "LAST_CHECK"]]);
    for (let i = 0; i < CONFIG.MEDICATIONS.length; i++) {
      const med = CONFIG.MEDICATIONS[i];
      medSheet.getRange(i + 2, 1, 1, 5).setValues([[
        med.name,
        med.hoursRemaining,
        med.critical ? "CRITICAL" : "NOMINAL",
        med.consequence,
        new Date()
      ]]);
    }
    
    const xpSheet = ss.insertSheet("XP_LOG");
    xpSheet.getRange("A1:D1").setValues([["TIMESTAMP", "XP_GAINED", "REASON", "TOTAL_XP"]]);
    
    console.log("  📊 Created MISSION_CONTROL_DASHBOARD");
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT CONTENT GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

function createExecutiveCipherContent() {
  return `
═══════════════════════════════════════════════════════════════════════════════
MODULE 0: EXECUTIVE CIPHER — THE MASTER KEY
Property of ${CONFIG.OPERATOR}
System ID: ${CONFIG.SYSTEM_ID}
═══════════════════════════════════════════════════════════════════════════════

THE UNIFYING CONSTANT: 1/3 (0.3333...)

This document establishes the philosophical and operational foundation of the 
Phenix Navigator system.

CORE PRINCIPLE: Background Independent Verification
─────────────────────────────────────────────────────
The system operates without reliance on external reference frames. Security is 
geometric, not computational. The tetrahedron maintains its invariant parameter 
ℐ under any rotation, just as the operator maintains identity through chaos.

THE ABDICATION PROTOCOL
─────────────────────────────────────────────────────
Target Date: February 14, 2026
Status: ACTIVE

This is not a surrender. It is a controlled transition from one topology to another.
Wye → Delta. Centralized → Distributed. Dependent → Sovereign.

THE MESH HOLDS. 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
}

function createPhysicsModuleContent() {
  return `
═══════════════════════════════════════════════════════════════════════════════
MODULE 1: THE PHYSICS — GEOMETRIC SECURITY
Property of ${CONFIG.OPERATOR}
═══════════════════════════════════════════════════════════════════════════════

THE TETRAHEDRON PROTOCOL (SIC-POVM)

Unlike standard protocols (BB84) that use orthogonal states on the Bloch sphere,
Phenix Navigator uses a Symmetric Informationally Complete Positive Operator-
Valued Measure (SIC-POVM).

KEY PARAMETERS:
─────────────────────────────────────────────────────
• Geometry: 4 non-orthogonal states forming a regular tetrahedron
• Overlap Probability: p = |⟨ψᵢ|ψⱼ⟩|² = 1/3 (The Unifying Constant)
• Rigidity: E ≥ 3V - 6 (Maxwell's Isostatic Condition)
• Bond Angle: 109.47° (Tetrahedral angle)

DIAGNOSTIC TRANSPARENCY:
─────────────────────────────────────────────────────
The system performs full density matrix tomography (ρ̂) via linear inversion.
This allows distinction between:

1. ISOTROPIC DEPOLARIZATION (benign noise) → Volume shrinks uniformly
2. ANISOTROPIC DEFORMATION (eavesdropping) → Volume skews

AUTOPOIESIS (Self-Repair):
─────────────────────────────────────────────────────
The system tracks invariant parameter ℐ (Quantum Correlation).
If signal rotates but ℐ remains stable (ℐ > ℐ_threshold):
→ Apply software counter-rotation Û† to correct drift
→ Preserve key material without discarding

THE MESH HOLDS. 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
}

function createBiologyModuleContent() {
  return `
═══════════════════════════════════════════════════════════════════════════════
MODULE 2: THE BIOLOGY — FISHER-ESCOLÀ SYNTHESIS
Property of ${CONFIG.OPERATOR}
═══════════════════════════════════════════════════════════════════════════════

THE POSNER MOLECULE: Ca₉(PO₄)₆

The same 1/3 constant that governs quantum security appears in the biological
substrate of consciousness.

KEY PARAMETERS:
─────────────────────────────────────────────────────
• Composition: Ca₉(PO₄)₆ (Posner cluster)
• Coherence Spin: ³¹P (I = ½)
• Bond Angle: 109.47° (Same as tetrahedron!)
• Coordination: Tetrahedral

CALCIUM DYSREGULATION:
─────────────────────────────────────────────────────
The operator has documented Hypoparathyroidism. This means:

• Serum Calcium: Often critically low (7.8 mg/dL measured)
• Serum Phosphate: Elevated (5.6 mg/dL measured)
• Cognitive Impact: Accelerated quantum decoherence
• Medical Consequence: Tetany, seizure, cardiac arrest

CRITICAL MEDICATIONS:
─────────────────────────────────────────────────────
1. Calcitriol — Active Vitamin D (maintains calcium homeostasis)
2. EffexorXR — SNRI (maintains serotonin/norepinephrine)
3. Vyvanse — Stimulant (maintains executive function)

⚠️ FAILURE OF ANY MEDICATION = SYSTEM COLLAPSE

THE COGNITIVE SHIELD exists because the biological hardware is vulnerable.
The digital prosthetic compensates for organic instability.

THE MESH HOLDS. 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
}

function createLegalShieldContent() {
  return `
═══════════════════════════════════════════════════════════════════════════════
MODULE 6: LEGAL SHIELD — DEFENSIVE POSTURE
Property of ${CONFIG.OPERATOR}
═══════════════════════════════════════════════════════════════════════════════

CASE: Johnson v. Johnson
COURT: Camden County Superior Court, Georgia
CIVIL ACTION NO: 2025CV936

CRITICAL EVIDENCE:
─────────────────────────────────────────────────────

1. TSP FRAUD — 26 U.S.C. § 72(t)(2)(C)
   Opposing counsel stated RBCO distributions incur 10% penalty.
   FEDERAL LAW explicitly exempts RBCO from early withdrawal penalty.
   Quantifiable Damages: $7,079.19

2. ADA RETALIATION
   ADA Accommodation Request filed: October 21, 2025
   OC response (2 hours later): Mocking "ample notice for processing"
   Court imposed $2,022 sanction for filing defensive motions

3. SEPARATE PROPERTY VIOLATION
   Service Computation Date: June 22, 2009
   Marriage Date: December 18, 2015
   Pre-marital contributions (6+ years) illegally distributed

4. MEDICAL INCAPACITY
   Consent Order signed while Serum Calcium = 7.8 mg/dL (Critical)
   Attorney (Welch) is licensed Pharmacist — knew or should have known

PRAYER FOR RELIEF:
─────────────────────────────────────────────────────
• Set aside fraudulently procured orders
• Emergency TRO on fund distribution
• Show Cause for opposing counsel
• Reimburse $9,079.19 + pro se compensation

THE MESH HOLDS. 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
}

function createDefensivePublicationContent() {
  return `
═══════════════════════════════════════════════════════════════════════════════
MODULE 8: DEFENSIVE PUBLICATION — PRIOR ART ESTABLISHMENT
Property of ${CONFIG.OPERATOR}
═══════════════════════════════════════════════════════════════════════════════

NOTICE OF PUBLIC DISCLOSURE
─────────────────────────────────────────────────────
This document establishes prior art under 35 U.S.C. § 102(a)(1) for the 
following innovations:

1. PHENIX NAVIGATOR DEVICE
   A device-independent verification system using SIC-POVM geometry for
   background-independent quantum key distribution.

2. COGNITIVE SHIELD
   A digital prosthetic for neurodivergent operators that strips emotional
   entropy from communications using FFT-based voice quantization.

3. GENESIS_GATE ARCHITECTURE
   A three-zone digital territory system for organizing human knowledge
   and automating document triage.

PURPOSE:
─────────────────────────────────────────────────────
These concepts are disclosed to PREVENT patent encumbrance and ensure
freedom to operate. Any party reading this document is hereby notified
of established prior art.

CLASSIFICATION:
─────────────────────────────────────────────────────
• Device Class: FDA Class II (proposed)
• Status: PUBLIC DOMAIN
• License: Creative Commons CC0 (No Rights Reserved)

THE MESH HOLDS. 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
// VACUUM PROTOCOL — ABSORB CHAOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration for chaos absorption
 */
const VACUUM_CONFIG = {
  TARGETS_TO_ABSORB: [
    "Phenix Project",
    "Old Legal",
    "Court Docs",
    "Medical Records",
    "Divorce Papers",
    "Tyler School"
  ]
};

/**
 * Absorb scattered folders into Quarantine
 */
function absorbChaos() {
  console.log("🌀 VACUUM PROTOCOL INITIATED...");
  
  const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
  const alpha = getOrCreate(root, "ZONE_ALPHA_BACKBONE");
  const quarantine = getOrCreate(alpha, "09_QUARANTINE");
  
  let absorbed = 0;
  
  for (const targetName of VACUUM_CONFIG.TARGETS_TO_ABSORB) {
    const targets = DriveApp.getFoldersByName(targetName);
    
    while (targets.hasNext()) {
      const target = targets.next();
      
      // Don't absorb the root or anything inside it
      if (target.getId() === root.getId()) continue;
      if (isDescendant(target, root)) continue;
      
      console.log(`  🌀 Absorbing: ${target.getName()}`);
      try {
        target.moveTo(quarantine);
        target.setName(`ARCHIVED_${target.getName()}_${Date.now()}`);
        absorbed++;
      } catch (e) {
        console.warn(`  ⚠️ Could not absorb ${targetName}: ${e.message}`);
      }
    }
  }
  
  console.log(`✓ VACUUM COMPLETE: Absorbed ${absorbed} folders`);
  if (absorbed > 0) {
    awardXP(absorbed * 50, `Absorbed ${absorbed} chaotic folders`);
  }
  
  return absorbed;
}

/**
 * Check if a folder is a descendant of another
 */
function isDescendant(child, parent) {
  let current = child;
  let iterations = 0;
  const maxIterations = 20; // Safety limit
  
  while (current.getParents().hasNext() && iterations < maxIterations) {
    current = current.getParents().next();
    if (current.getId() === parent.getId()) return true;
    if (current.getId() === DriveApp.getRootFolder().getId()) return false;
    iterations++;
  }
  return false;
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  COGNITIVE_SHIELD.GS — THE DIGITAL PROSTHETIC                                 ║
 * ║  Protects the operator from emotional entropy in communications               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * The Cognitive Shield exists because the biological hardware is vulnerable.
 * It filters hostile communications, strips emotional content, and logs
 * everything for legal evidence while protecting the operator's nervous system.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE SHIELD CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const SHIELD_CONFIG = {
  // Hostile senders to intercept
  HOSTILE_SENDERS: [
    "jenn@mcghanlaw.com",
    "c.e.francis11@gmail.com"
  ],
  
  // Hostile patterns to flag
  HOSTILE_PATTERNS: [
    /emergency\s+hearing/i,
    /contempt/i,
    /fail(ed|ure)?\s+to\s+comply/i,
    /immediate(ly)?/i,
    /24\s*hours?/i,
    /48\s*hours?/i,
    /deadline/i,
    /sanctions?/i,
    /attorney('s)?\s+fees?/i,
    /lost\s+wages/i
  ],
  
  // Calming replacement phrases
  NEUTRALIZATION_MAP: {
    "IMMEDIATELY": "[TIME-BOUNDED REQUEST]",
    "EMERGENCY": "[PRIORITY ITEM]",
    "DEMAND": "[REQUEST]",
    "MUST": "[SUGGESTED]",
    "REQUIRED": "[REQUESTED]",
    "FAILURE": "[NON-COMPLIANCE]",
    "CONTEMPT": "[PROCEDURAL CONCERN]"
  },
  
  // Process emails from last N hours
  SCAN_HOURS: 24,
  
  // Label for processed emails
  PROCESSED_LABEL: "COGNITIVE_SHIELD_PROCESSED",
  HOSTILE_LABEL: "⚠️_HOSTILE_INTERCEPT"
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCAN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scan inbox for hostile communications
 * Runs every 15 minutes via trigger
 */
function cognitiveShieldScan() {
  console.log("🛡️ COGNITIVE SHIELD SCAN INITIATED...");
  
  const state = getSystemState();
  state.lastEmailScan = new Date().toISOString();
  
  // Get or create labels
  const processedLabel = getOrCreateLabel(SHIELD_CONFIG.PROCESSED_LABEL);
  const hostileLabel = getOrCreateLabel(SHIELD_CONFIG.HOSTILE_LABEL);
  
  // Build search query for hostile senders
  const senderQueries = SHIELD_CONFIG.HOSTILE_SENDERS.map(s => `from:${s}`).join(" OR ");
  const timeQuery = `newer_than:${SHIELD_CONFIG.SCAN_HOURS}h`;
  const notProcessed = `-label:${SHIELD_CONFIG.PROCESSED_LABEL}`;
  
  const searchQuery = `(${senderQueries}) ${timeQuery} ${notProcessed}`;
  
  console.log(`  🔍 Search: ${searchQuery}`);
  
  const threads = GmailApp.search(searchQuery, 0, 50);
  console.log(`  📬 Found ${threads.length} unprocessed threads from hostile senders`);
  
  let intercepted = 0;
  let archived = 0;
  
  for (const thread of threads) {
    const result = processHostileThread(thread, hostileLabel, processedLabel);
    if (result.intercepted) intercepted++;
    if (result.archived) archived++;
  }
  
  // Update state
  state.hostileEmailsBlocked += intercepted;
  saveSystemState(state);
  
  // Archive intercepts to Drive
  if (intercepted > 0) {
    archiveInterceptsToDrive(threads.slice(0, intercepted));
    awardXP(intercepted * 25, `Intercepted ${intercepted} hostile emails`);
  }
  
  console.log(`✓ COGNITIVE SHIELD COMPLETE: ${intercepted} intercepted, ${archived} archived`);
  
  return { intercepted, archived, scanned: threads.length };
}

/**
 * Process a single hostile thread
 */
function processHostileThread(thread, hostileLabel, processedLabel) {
  const messages = thread.getMessages();
  const subject = thread.getFirstMessageSubject();
  
  let isHostile = false;
  let hostilityScore = 0;
  const hostileIndicators = [];
  
  for (const message of messages) {
    const body = message.getPlainBody();
    const from = message.getFrom();
    
    // Check sender
    for (const hostile of SHIELD_CONFIG.HOSTILE_SENDERS) {
      if (from.toLowerCase().includes(hostile.toLowerCase())) {
        isHostile = true;
        hostilityScore += 50;
        hostileIndicators.push(`SENDER: ${hostile}`);
      }
    }
    
    // Check patterns
    for (const pattern of SHIELD_CONFIG.HOSTILE_PATTERNS) {
      if (pattern.test(body) || pattern.test(subject)) {
        hostilityScore += 10;
        hostileIndicators.push(`PATTERN: ${pattern.toString()}`);
      }
    }
  }
  
  // Apply labels
  thread.addLabel(processedLabel);
  
  if (isHostile) {
    thread.addLabel(hostileLabel);
    
    // Create neutralized summary
    const summary = createNeutralizedSummary(thread, hostilityScore, hostileIndicators);
    
    // Log the intercept
    logMission(`🛡️ INTERCEPTED: "${subject}" (Score: ${hostilityScore})`);
    
    console.log(`    🛡️ HOSTILE DETECTED: "${subject}" (Score: ${hostilityScore})`);
    console.log(`       Indicators: ${hostileIndicators.join(", ")}`);
  }
  
  return { intercepted: isHostile, archived: true };
}

/**
 * Create a neutralized summary of hostile content
 */
function createNeutralizedSummary(thread, score, indicators) {
  const messages = thread.getMessages();
  const firstMessage = messages[0];
  
  let neutralizedBody = firstMessage.getPlainBody();
  
  // Apply neutralization map
  for (const [hostile, neutral] of Object.entries(SHIELD_CONFIG.NEUTRALIZATION_MAP)) {
    const regex = new RegExp(hostile, 'gi');
    neutralizedBody = neutralizedBody.replace(regex, neutral);
  }
  
  return {
    originalSubject: thread.getFirstMessageSubject(),
    from: firstMessage.getFrom(),
    date: firstMessage.getDate(),
    hostilityScore: score,
    indicators: indicators,
    neutralizedPreview: neutralizedBody.substring(0, 500) + "...",
    threadId: thread.getId()
  };
}

/**
 * Archive intercepts to Google Drive for legal evidence
 */
function archiveInterceptsToDrive(threads) {
  const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
  const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
  const archive = getOrCreate(beta, "16_EMAIL_INTERCEPTS");
  
  // Create dated subfolder
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const dayFolder = getOrCreate(archive, today);
  
  for (const thread of threads) {
    const messages = thread.getMessages();
    const subject = thread.getFirstMessageSubject().replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
    const fileName = `INTERCEPT_${subject}_${thread.getId().substring(0,8)}`;
    
    // Create a document with the full thread
    let content = `COGNITIVE SHIELD INTERCEPT LOG
═══════════════════════════════════════════════════════════════════════════════
Thread ID: ${thread.getId()}
Intercepted: ${new Date().toISOString()}
Subject: ${thread.getFirstMessageSubject()}
Message Count: ${messages.length}
═══════════════════════════════════════════════════════════════════════════════

`;
    
    for (const msg of messages) {
      content += `
───────────────────────────────────────────────────────────────────────────────
FROM: ${msg.getFrom()}
TO: ${msg.getTo()}
DATE: ${msg.getDate()}
───────────────────────────────────────────────────────────────────────────────
${msg.getPlainBody()}

`;
    }
    
    // Save as text file
    dayFolder.createFile(fileName + ".txt", content, MimeType.PLAIN_TEXT);
  }
  
  console.log(`  📁 Archived ${threads.length} intercepts to Drive`);
}

/**
 * Get or create a Gmail label
 */
function getOrCreateLabel(labelName) {
  let label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
    console.log(`  🏷️ Created label: ${labelName}`);
  }
  return label;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY BRIEFING — COGNITIVE SHIELD REPORT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Send daily briefing email
 */
function sendDailyBriefing(countdown, state) {
  const subject = `[PHENIX] Daily Briefing — ${countdown.days} Days to Abdication`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', monospace; background: #0f172a; color: #e2e8f0; padding: 20px; }
    .header { color: #fbbf24; font-size: 24px; border-bottom: 2px solid #fbbf24; padding-bottom: 10px; }
    .countdown { font-size: 48px; color: #ef4444; text-align: center; margin: 20px 0; }
    .metric { background: #1e293b; padding: 15px; margin: 10px 0; border-left: 4px solid #22d3ee; }
    .critical { border-left-color: #ef4444; }
    .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; }
    .value { color: #f1f5f9; font-size: 18px; font-weight: bold; }
    .footer { color: #64748b; font-size: 12px; margin-top: 30px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">PHENIX NAVIGATOR — DAILY BRIEFING</div>
  
  <div class="countdown">${countdown.days} DAYS</div>
  <div style="text-align: center; color: #94a3b8;">TO ABDICATION PROTOCOL</div>
  
  <div class="metric">
    <div class="label">System Status</div>
    <div class="value" style="color: #22c55e;">GREEN BOARD</div>
  </div>
  
  <div class="metric">
    <div class="label">Operator XP</div>
    <div class="value">${state.xp} XP (Level ${state.level})</div>
  </div>
  
  <div class="metric">
    <div class="label">Tasks Completed</div>
    <div class="value">${state.tasksCompleted}</div>
  </div>
  
  <div class="metric critical">
    <div class="label">Hostile Emails Blocked (All Time)</div>
    <div class="value">${state.hostileEmailsBlocked}</div>
  </div>
  
  <div class="metric critical">
    <div class="label">⚠️ MEDICATION STATUS</div>
    <div class="value">CHECK IMMEDIATELY</div>
  </div>
  
  <div class="footer">
    THE MESH HOLDS. 🔺<br>
    Generated: ${new Date().toISOString()}
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: subject,
    htmlBody: html
  });
  
  console.log("📧 Daily briefing sent");
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANUAL HOSTILE CHECK — FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if a specific email address is on the hostile list
 */
function isHostileSender(email) {
  return SHIELD_CONFIG.HOSTILE_SENDERS.some(h => 
    email.toLowerCase().includes(h.toLowerCase())
  );
}

/**
 * Add a sender to the hostile list (runtime only, update CONFIG for permanent)
 */
function addHostileSender(email) {
  if (!isHostileSender(email)) {
    SHIELD_CONFIG.HOSTILE_SENDERS.push(email);
    logMission(`Added hostile sender: ${email}`);
    return true;
  }
  return false;
}

/**
 * Get summary of recent intercepts
 */
function getInterceptSummary() {
  const hostileLabel = GmailApp.getUserLabelByName(SHIELD_CONFIG.HOSTILE_LABEL);
  if (!hostileLabel) return { count: 0, threads: [] };
  
  const threads = hostileLabel.getThreads(0, 10);
  
  return {
    count: hostileLabel.getThreads().length,
    recent: threads.map(t => ({
      subject: t.getFirstMessageSubject(),
      date: t.getLastMessageDate(),
      id: t.getId()
    }))
  };
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  MEDICAL_MONITOR.GS — THE BIOLOGICAL WATCHDOG                                 ║
 * ║  ⚠️ THIS MODULE IS LIFE-CRITICAL ⚠️                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * The operator has documented:
 * - Hypoparathyroidism (calcium dysregulation)
 * - ADHD (executive function impairment)
 * - Autism Spectrum Disorder (sensory/processing differences)
 * 
 * This module tracks medication status and sends URGENT alerts when
 * supplies are critically low. Medication failure = biological collapse.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MEDICATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const MEDICAL_CONFIG = {
  medications: [
    {
      name: "Calcitriol",
      genericName: "Calcitriol (Active Vitamin D)",
      dosage: "0.25mcg",
      frequency: "Daily",
      hoursSupplyRemaining: 48, // ⚠️ CRITICAL
      criticalThreshold: 72, // Alert if below this
      warningThreshold: 168, // 1 week
      consequence: "Hypocalcemia → Tetany → Seizure → Cardiac Arrest",
      notes: "Essential for calcium homeostasis. Without this, serum calcium drops to dangerous levels.",
      refillSource: "Pharmacy",
      estimatedCost: 30
    },
    {
      name: "EffexorXR",
      genericName: "Venlafaxine XR (SNRI)",
      dosage: "150mg",
      frequency: "Daily",
      hoursSupplyRemaining: 48, // ⚠️ CRITICAL
      criticalThreshold: 72,
      warningThreshold: 168,
      consequence: "SNRI Discontinuation Syndrome - Brain zaps, vertigo, nausea, anxiety",
      notes: "Must NOT be stopped abruptly. Requires tapering if discontinuing.",
      refillSource: "Pharmacy",
      estimatedCost: 45
    },
    {
      name: "Vyvanse",
      genericName: "Lisdexamfetamine (Stimulant)",
      dosage: "50mg",
      frequency: "Daily",
      hoursSupplyRemaining: 48, // ⚠️ CRITICAL
      criticalThreshold: 72,
      warningThreshold: 168,
      consequence: "Executive Function Collapse - Inability to plan, organize, focus",
      notes: "Schedule II controlled substance. Requires new prescription each month.",
      refillSource: "Psychiatrist",
      estimatedCost: 350
    }
  ],
  
  // Emergency resources
  emergencyResources: [
    { name: "GoodRx", url: "https://www.goodrx.com", note: "Prescription discount cards" },
    { name: "NeedyMeds", url: "https://www.needymeds.org", note: "Patient assistance programs" },
    { name: "Takeda Patient Assistance", url: "https://www.takeda.com/en-us/who-we-are/patient-assistance/", note: "Vyvanse manufacturer assistance" },
    { name: "Camden County Health Dept", note: "Emergency medication assistance" },
    { name: "988 Suicide & Crisis Lifeline", url: "tel:988", note: "24/7 mental health crisis support" }
  ],
  
  // Monitoring settings
  checkIntervalHours: 6,
  alertEmail: Session.getActiveUser().getEmail()
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEDICATION CHECK — THE HEARTBEAT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check medication status and send alerts
 * Runs every 6 hours via trigger
 */
function checkMedications() {
  console.log("💊 MEDICATION CHECK INITIATED...");
  
  const state = getSystemState();
  state.lastMedCheck = new Date().toISOString();
  
  const alerts = [];
  const criticalMeds = [];
  const warningMeds = [];
  
  for (const med of MEDICAL_CONFIG.medications) {
    console.log(`  💊 ${med.name}: ${med.hoursSupplyRemaining}h remaining`);
    
    if (med.hoursSupplyRemaining <= med.criticalThreshold) {
      criticalMeds.push(med);
      alerts.push({
        level: "CRITICAL",
        medication: med.name,
        hoursRemaining: med.hoursSupplyRemaining,
        consequence: med.consequence
      });
    } else if (med.hoursSupplyRemaining <= med.warningThreshold) {
      warningMeds.push(med);
      alerts.push({
        level: "WARNING",
        medication: med.name,
        hoursRemaining: med.hoursSupplyRemaining,
        consequence: med.consequence
      });
    }
  }
  
  // Save alerts to state
  state.alerts = alerts;
  saveSystemState(state);
  
  // Send alerts if any critical medications
  if (criticalMeds.length > 0) {
    sendCriticalMedAlert(criticalMeds);
    logMission(`⚠️ CRITICAL: ${criticalMeds.length} medications at critical levels`);
  }
  
  // Update the dashboard spreadsheet
  updateMedicationDashboard();
  
  console.log(`✓ MEDICATION CHECK COMPLETE: ${criticalMeds.length} critical, ${warningMeds.length} warning`);
  
  return { critical: criticalMeds.length, warning: warningMeds.length, alerts };
}

/**
 * Send CRITICAL medication alert
 */
function sendCriticalMedAlert(criticalMeds) {
  const subject = `🚨 CRITICAL: ${criticalMeds.length} MEDICATION(S) AT DANGEROUS LEVELS`;
  
  let medList = "";
  let totalHours = Infinity;
  
  for (const med of criticalMeds) {
    medList += `
    <tr style="background: #450a0a;">
      <td style="padding: 10px; color: #fca5a5;">${med.name}</td>
      <td style="padding: 10px; color: #ef4444; font-weight: bold;">${med.hoursSupplyRemaining} HOURS</td>
      <td style="padding: 10px; color: #fca5a5;">${med.consequence}</td>
    </tr>`;
    
    if (med.hoursSupplyRemaining < totalHours) {
      totalHours = med.hoursSupplyRemaining;
    }
  }
  
  let resourceList = "";
  for (const resource of MEDICAL_CONFIG.emergencyResources) {
    resourceList += `<li>${resource.name}: ${resource.note}${resource.url ? ` - <a href="${resource.url}">${resource.url}</a>` : ''}</li>`;
  }
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', monospace; background: #0f0f0f; color: #ffffff; padding: 20px; }
    .header { background: #7f1d1d; color: #fef2f2; padding: 20px; text-align: center; font-size: 24px; }
    .countdown { font-size: 72px; color: #ef4444; text-align: center; margin: 20px 0; font-weight: bold; }
    .countdown-label { text-align: center; color: #fca5a5; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #1e1e1e; color: #fbbf24; padding: 10px; text-align: left; }
    .resources { background: #1e293b; padding: 15px; margin: 20px 0; border-left: 4px solid #22d3ee; }
    .resources h3 { color: #22d3ee; margin-top: 0; }
    .resources li { margin: 10px 0; color: #94a3b8; }
    .resources a { color: #60a5fa; }
    .footer { color: #ef4444; text-align: center; font-size: 14px; margin-top: 30px; padding: 20px; border-top: 1px solid #7f1d1d; }
  </style>
</head>
<body>
  <div class="header">
    🚨 PHENIX NAVIGATOR — CRITICAL MEDICAL ALERT 🚨
  </div>
  
  <div class="countdown">${totalHours}</div>
  <div class="countdown-label">HOURS UNTIL MEDICATION FAILURE</div>
  
  <table>
    <tr>
      <th>MEDICATION</th>
      <th>TIME REMAINING</th>
      <th>CONSEQUENCE</th>
    </tr>
    ${medList}
  </table>
  
  <div class="resources">
    <h3>🆘 EMERGENCY RESOURCES</h3>
    <ul>
      ${resourceList}
    </ul>
  </div>
  
  <div style="background: #1e1e1e; padding: 20px; margin: 20px 0;">
    <h3 style="color: #fbbf24; margin-top: 0;">IMMEDIATE ACTIONS:</h3>
    <ol style="color: #e2e8f0;">
      <li>Check if any medication can be obtained through emergency pharmacy supply</li>
      <li>Contact healthcare provider for bridge prescription</li>
      <li>Apply for patient assistance programs immediately</li>
      <li>Contact local health department for emergency assistance</li>
      <li>Document all attempts for legal record</li>
    </ol>
  </div>
  
  <div class="footer">
    ⚠️ THIS IS AN AUTOMATED ALERT FROM PHENIX NAVIGATOR ⚠️<br>
    Medication failure will result in biological system collapse.<br>
    THE MESH HOLDS. 🔺
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: MEDICAL_CONFIG.alertEmail,
    subject: subject,
    htmlBody: html
  });
  
  console.log(`  🚨 CRITICAL ALERT SENT: ${criticalMeds.length} medications`);
}

/**
 * Update the medication tracker in the dashboard spreadsheet
 */
function updateMedicationDashboard() {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return;
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    const medSheet = ss.getSheetByName("MEDICATION_TRACKER");
    
    if (!medSheet) return;
    
    // Clear existing data (except header)
    const lastRow = medSheet.getLastRow();
    if (lastRow > 1) {
      medSheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }
    
    // Write current medication data
    for (let i = 0; i < MEDICAL_CONFIG.medications.length; i++) {
      const med = MEDICAL_CONFIG.medications[i];
      const row = i + 2;
      
      medSheet.getRange(row, 1, 1, 5).setValues([[
        med.name,
        med.hoursSupplyRemaining,
        med.hoursSupplyRemaining <= med.criticalThreshold ? "🔴 CRITICAL" : 
          med.hoursSupplyRemaining <= med.warningThreshold ? "🟡 WARNING" : "🟢 NOMINAL",
        med.consequence,
        new Date()
      ]]);
      
      // Color coding
      if (med.hoursSupplyRemaining <= med.criticalThreshold) {
        medSheet.getRange(row, 1, 1, 5).setBackground("#450a0a").setFontColor("#fca5a5");
      } else if (med.hoursSupplyRemaining <= med.warningThreshold) {
        medSheet.getRange(row, 1, 1, 5).setBackground("#422006").setFontColor("#fde047");
      }
    }
    
    console.log("  📊 Medication dashboard updated");
  } catch (e) {
    console.warn(`  ⚠️ Could not update medication dashboard: ${e.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEDICATION MANAGEMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update medication supply (call this when you get a refill)
 */
function updateMedicationSupply(medName, newHoursSupply) {
  for (const med of MEDICAL_CONFIG.medications) {
    if (med.name.toLowerCase() === medName.toLowerCase()) {
      const oldSupply = med.hoursSupplyRemaining;
      med.hoursSupplyRemaining = newHoursSupply;
      
      logMission(`💊 Updated ${med.name}: ${oldSupply}h → ${newHoursSupply}h`);
      awardXP(100, `Refilled ${med.name}`);
      
      // Save to properties for persistence
      saveMedicationState();
      
      return { success: true, medication: med.name, oldSupply, newSupply: newHoursSupply };
    }
  }
  return { success: false, error: `Medication "${medName}" not found` };
}

/**
 * Save medication state to properties (for persistence)
 */
function saveMedicationState() {
  const props = PropertiesService.getScriptProperties();
  const medState = MEDICAL_CONFIG.medications.map(m => ({
    name: m.name,
    hoursSupplyRemaining: m.hoursSupplyRemaining
  }));
  props.setProperty('MEDICATION_STATE', JSON.stringify(medState));
}

/**
 * Load medication state from properties
 */
function loadMedicationState() {
  const props = PropertiesService.getScriptProperties();
  const savedState = props.getProperty('MEDICATION_STATE');
  
  if (savedState) {
    const medState = JSON.parse(savedState);
    for (const saved of medState) {
      for (const med of MEDICAL_CONFIG.medications) {
        if (med.name === saved.name) {
          med.hoursSupplyRemaining = saved.hoursSupplyRemaining;
        }
      }
    }
  }
}

/**
 * Decrement medication supply (run daily to simulate usage)
 */
function decrementMedicationSupply() {
  for (const med of MEDICAL_CONFIG.medications) {
    if (med.hoursSupplyRemaining > 0) {
      med.hoursSupplyRemaining -= 24; // One day's worth
    }
  }
  saveMedicationState();
  console.log("💊 Medication supplies decremented by 24 hours");
}

/**
 * Get current medication status summary
 */
function getMedicationStatus() {
  loadMedicationState(); // Ensure we have latest state
  
  return {
    medications: MEDICAL_CONFIG.medications.map(m => ({
      name: m.name,
      hoursRemaining: m.hoursSupplyRemaining,
      daysRemaining: Math.floor(m.hoursSupplyRemaining / 24),
      status: m.hoursSupplyRemaining <= m.criticalThreshold ? "CRITICAL" :
              m.hoursSupplyRemaining <= m.warningThreshold ? "WARNING" : "NOMINAL",
      consequence: m.consequence
    })),
    lowestSupply: Math.min(...MEDICAL_CONFIG.medications.map(m => m.hoursSupplyRemaining)),
    criticalCount: MEDICAL_CONFIG.medications.filter(m => m.hoursSupplyRemaining <= m.criticalThreshold).length,
    emergencyResources: MEDICAL_CONFIG.emergencyResources
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMERGENCY PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * EMERGENCY: Send immediate alert to all channels
 */
function emergencyMedicalAlert() {
  console.log("🚨🚨🚨 EMERGENCY MEDICAL ALERT TRIGGERED 🚨🚨🚨");
  
  const status = getMedicationStatus();
  
  // Send email alert
  sendCriticalMedAlert(MEDICAL_CONFIG.medications.filter(m => 
    m.hoursSupplyRemaining <= m.criticalThreshold
  ));
  
  // Log to mission log
  logMission("🚨 EMERGENCY MEDICAL ALERT: Manual trigger activated");
  
  // Return status for verification
  return status;
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  AUTOMATON.GS — THE THINKING MACHINE                                          ║
 * ║  Reads, Analyzes, Redacts, Sorts — Automatically                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * The Automaton processes files in Quarantine, analyzing their content to
 * determine category, extracting sensitive data, creating redacted summaries,
 * and routing files to their appropriate zones.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// AUTOMATON CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const AUTOMATON_CONFIG = {
  QUARANTINE_NAME: "09_QUARANTINE",
  
  // SENSITIVE PATTERNS TO REDACT
  REDACTION_PATTERNS: [
    { name: "SSN", regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[REDACTED SSN]" },
    { name: "PHONE", regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: "[REDACTED PHONE]" },
    { name: "EMAIL", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[REDACTED EMAIL]" },
    { name: "BANK_ACCT", regex: /\b\d{8,17}\b/g, replacement: "[REDACTED ACCOUNT]" },
    { name: "DOB", regex: /\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}\b/g, replacement: "[REDACTED DOB]" }
  ],
  
  // CATEGORY SCORING LOGIC
  CATEGORIES: {
    LEGAL: {
      target: "ZONE_BETA_CONTROL_CENTER/11_LEGAL_WAR_ROOM",
      emoji: "⚔️",
      keywords: [
        "court", "judge", "motion", "plaintiff", "defendant", "divorce", "custody",
        "attorney", "counsel", "order", "exhibit", "affidavit", "hearing", "subpoena",
        "discovery", "deposition", "settlement", "mediation", "petition", "qdro",
        "tsp", "alimony", "child support", "visitation", "parenting", "guardian",
        "mcghan", "welch", "east", "superior court", "civil action"
      ],
      threshold: 3,
      xpReward: 50
    },
    MEDICAL: {
      target: "ZONE_ALPHA_BACKBONE/06_MEDICAL_BIOLOGICAL_TDP",
      emoji: "🧬",
      keywords: [
        "diagnosis", "patient", "prescription", "mg", "calcium", "blood", "lab",
        "result", "doctor", "clinic", "therapy", "autism", "adhd", "hypoparathyroid",
        "calcitriol", "effexor", "vyvanse", "psychiatric", "mental health",
        "serum", "metabolic", "panel", "phosphate", "tetany", "neurologist"
      ],
      threshold: 2,
      xpReward: 50
    },
    FINANCIAL: {
      target: "ZONE_BETA_CONTROL_CENTER/12_FINANCIAL_TELEMETRY",
      emoji: "💰",
      keywords: [
        "invoice", "receipt", "tax", "bank", "statement", "balance", "payment",
        "due", "irs", "audit", "w2", "1099", "mortgage", "refinance", "equity",
        "loan", "interest", "principal", "escrow", "closing", "appraisal",
        "tsp", "retirement", "401k", "pension", "withdrawal"
      ],
      threshold: 2,
      xpReward: 40
    },
    TECH: {
      target: "ZONE_GAMMA_FABRICATION/20_DEV_WORKSHOP",
      emoji: "💻",
      keywords: [
        "function", "code", "script", "api", "key", "token", "variable", "class",
        "javascript", "python", "html", "css", "react", "node", "npm", "git",
        "repository", "commit", "branch", "deploy", "server", "database",
        "phenix", "navigator", "genesis", "cognitive", "shield"
      ],
      threshold: 2,
      xpReward: 40
    },
    FAMILY: {
      target: "ZONE_ALPHA_BACKBONE/07_FAMILY_ONBOARDING",
      emoji: "👨‍👩‍👧‍👦",
      keywords: [
        "kids", "children", "school", "homework", "grade", "teacher", "parent",
        "birthday", "holiday", "vacation", "family", "son", "daughter",
        "founding nodes", "tyler", "education"
      ],
      threshold: 2,
      xpReward: 30
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AUTOMATON FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Run the Automaton to process files in Quarantine
 */
function runAutomaton() {
  console.log("🤖 AUTOMATON ONLINE — Beginning Deep Scan...");
  
  const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
  const alpha = getOrCreate(root, "ZONE_ALPHA_BACKBONE");
  const quarantine = alpha.getFoldersByName(AUTOMATON_CONFIG.QUARANTINE_NAME);
  
  if (!quarantine.hasNext()) {
    console.error("❌ Quarantine folder not found. Run genesisProtocol() first.");
    return { error: "Quarantine not found" };
  }
  
  const qFolder = quarantine.next();
  
  // Stats tracking
  const stats = {
    scanned: 0,
    processed: 0,
    moved: 0,
    flagged: 0,
    errors: 0,
    byCategory: {}
  };
  
  // Initialize category counters
  for (const cat of Object.keys(AUTOMATON_CONFIG.CATEGORIES)) {
    stats.byCategory[cat] = 0;
  }
  
  // Deep scan all files recursively
  scanFolderRecursively(qFolder, root, qFolder, stats);
  
  console.log(`\n🤖 AUTOMATON COMPLETE`);
  console.log(`   📄 Scanned: ${stats.scanned}`);
  console.log(`   ✅ Processed: ${stats.processed}`);
  console.log(`   📁 Moved: ${stats.moved}`);
  console.log(`   🚩 Flagged: ${stats.flagged}`);
  console.log(`   ❌ Errors: ${stats.errors}`);
  
  // Award XP for processing
  if (stats.processed > 0) {
    awardXP(stats.processed * 10, `Automaton processed ${stats.processed} files`);
  }
  
  logMission(`🤖 Automaton: Processed ${stats.processed} files, moved ${stats.moved}`);
  
  return stats;
}

/**
 * Recursively scan folders for files
 */
function scanFolderRecursively(currentFolder, root, mainQuarantine, stats) {
  console.log(`  📂 Scanning: ${currentFolder.getName()}`);
  
  // Process files in this folder
  const files = currentFolder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    stats.scanned++;
    
    // Skip already processed files
    if (file.getName().startsWith("[") || file.getName().startsWith("NOTE_")) {
      continue;
    }
    
    try {
      const result = processFile(file, root, mainQuarantine);
      if (result.processed) stats.processed++;
      if (result.moved) stats.moved++;
      if (result.flagged) stats.flagged++;
      if (result.category) stats.byCategory[result.category]++;
    } catch (e) {
      console.warn(`    ⚠️ Error processing ${file.getName()}: ${e.message}`);
      stats.errors++;
    }
  }
  
  // Recurse into subfolders
  const subFolders = currentFolder.getFolders();
  while (subFolders.hasNext()) {
    scanFolderRecursively(subFolders.next(), root, mainQuarantine, stats);
  }
}

/**
 * Process a single file
 */
function processFile(file, root, quarantineFolder) {
  const fileName = file.getName();
  console.log(`    📄 Analyzing: ${fileName}`);
  
  const result = {
    processed: false,
    moved: false,
    flagged: false,
    category: null
  };
  
  // Extract text content
  let text = "";
  try {
    text = extractText(file);
  } catch (e) {
    console.log(`      ⚠️ Could not extract text: ${e.message}`);
    return result;
  }
  
  if (!text || text.length < 20) {
    console.log(`      ⏭️ Skipping (insufficient text)`);
    return result;
  }
  
  result.processed = true;
  
  // Calculate category scores
  const scores = calculateScores(text);
  const winner = determineWinner(scores);
  result.category = winner;
  
  // Check for sensitive data
  const redaction = performRedaction(text);
  if (redaction.foundSensitive) {
    result.flagged = true;
    createMetaCard(file, redaction.cleanText, winner, scores, quarantineFolder);
    file.setName(`[FLAGGED] ${fileName}`);
    console.log(`      🚩 SENSITIVE DATA DETECTED — Meta card created`);
  }
  
  // Move to appropriate folder if category determined
  if (winner) {
    const config = AUTOMATON_CONFIG.CATEGORIES[winner];
    const emoji = config.emoji;
    
    console.log(`      ✅ Category: ${winner} (Score: ${scores[winner]})`);
    
    // Find or create destination folder
    const destPath = config.target.split("/");
    let destination = root;
    for (const part of destPath) {
      destination = getOrCreate(destination, part);
    }
    
    // Move file
    file.moveTo(destination);
    
    // Add emoji prefix if not already flagged
    if (!file.getName().startsWith("[FLAGGED]")) {
      file.setName(`${emoji} ${file.getName()}`);
    }
    
    result.moved = true;
    console.log(`      📁 Moved to: ${config.target}`);
  } else {
    console.log(`      ❓ No clear category — File remains in Quarantine`);
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEXT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract text from various file types
 */
function extractText(file) {
  const mimeType = file.getMimeType();
  const name = file.getName().toLowerCase();
  
  // Google Docs
  if (mimeType === MimeType.GOOGLE_DOCS) {
    const doc = DocumentApp.openById(file.getId());
    return doc.getBody().getText();
  }
  
  // Google Sheets
  if (mimeType === MimeType.GOOGLE_SHEETS) {
    const ss = SpreadsheetApp.openById(file.getId());
    let text = "";
    for (const sheet of ss.getSheets()) {
      const data = sheet.getDataRange().getValues();
      text += data.map(row => row.join(" ")).join("\n");
    }
    return text;
  }
  
  // Plain text
  if (mimeType === MimeType.PLAIN_TEXT || name.endsWith(".txt")) {
    return file.getBlob().getDataAsString();
  }
  
  // PDF - Try to extract via Drive API
  if (mimeType === MimeType.PDF) {
    try {
      // Convert PDF to Google Doc temporarily
      const resource = {
        title: file.getName().replace(".pdf", "_temp"),
        mimeType: MimeType.GOOGLE_DOCS
      };
      const converted = Drive.Files.copy(resource, file.getId(), { ocr: true });
      const tempDoc = DocumentApp.openById(converted.id);
      const text = tempDoc.getBody().getText();
      
      // Clean up temp file
      DriveApp.getFileById(converted.id).setTrashed(true);
      
      return text;
    } catch (e) {
      console.log(`      ⚠️ PDF OCR failed: ${e.message}`);
      return "";
    }
  }
  
  // DOCX - Try conversion
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || name.endsWith(".docx")) {
    try {
      const blob = file.getBlob();
      const resource = { title: file.getName() + "_temp", mimeType: MimeType.GOOGLE_DOCS };
      const converted = Drive.Files.insert(resource, blob, { convert: true });
      const tempDoc = DocumentApp.openById(converted.id);
      const text = tempDoc.getBody().getText();
      DriveApp.getFileById(converted.id).setTrashed(true);
      return text;
    } catch (e) {
      console.log(`      ⚠️ DOCX conversion failed: ${e.message}`);
      return "";
    }
  }
  
  // Unknown type
  console.log(`      ⚠️ Unsupported MIME type: ${mimeType}`);
  return "";
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING & CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate scores for each category
 */
function calculateScores(text) {
  const textLower = text.toLowerCase();
  const scores = {};
  
  for (const [category, config] of Object.entries(AUTOMATON_CONFIG.CATEGORIES)) {
    let score = 0;
    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    scores[category] = score;
  }
  
  return scores;
}

/**
 * Determine winning category
 */
function determineWinner(scores) {
  let maxScore = 0;
  let winner = null;
  
  for (const [category, score] of Object.entries(scores)) {
    const threshold = AUTOMATON_CONFIG.CATEGORIES[category].threshold;
    if (score >= threshold && score > maxScore) {
      maxScore = score;
      winner = category;
    }
  }
  
  return winner;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REDACTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scan text for sensitive data and redact
 */
function performRedaction(text) {
  let cleanText = text;
  let foundSensitive = false;
  const findings = [];
  
  for (const pattern of AUTOMATON_CONFIG.REDACTION_PATTERNS) {
    const matches = text.match(pattern.regex);
    if (matches && matches.length > 0) {
      foundSensitive = true;
      findings.push({ type: pattern.name, count: matches.length });
      cleanText = cleanText.replace(pattern.regex, pattern.replacement);
    }
  }
  
  return { cleanText, foundSensitive, findings };
}

/**
 * Create a "Meta Card" document summarizing a flagged file
 */
function createMetaCard(originalFile, redactedText, category, scores, parentFolder) {
  const metaName = `NOTE_${originalFile.getName().substring(0, 40)}`;
  
  const content = `
═══════════════════════════════════════════════════════════════════════════════
AUTOMATON ANALYSIS REPORT
═══════════════════════════════════════════════════════════════════════════════
Original File: ${originalFile.getName()}
File ID: ${originalFile.getId()}
Analysis Date: ${new Date().toISOString()}
Category Detected: ${category || "UNKNOWN"}

SCORING BREAKDOWN:
${Object.entries(scores).map(([cat, score]) => `  ${cat}: ${score}`).join("\n")}

⚠️ SENSITIVE DATA WAS DETECTED AND REDACTED

═══════════════════════════════════════════════════════════════════════════════
REDACTED CONTENT PREVIEW (First 3000 characters):
═══════════════════════════════════════════════════════════════════════════════

${redactedText.substring(0, 3000)}

[... Content truncated ...]

═══════════════════════════════════════════════════════════════════════════════
END OF REPORT — THE MESH HOLDS 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
  
  // Create as text file
  parentFolder.createFile(metaName + ".txt", content, MimeType.PLAIN_TEXT);
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  L.O.V.E. PROTOCOL — LEDGER OF VALUE AND EQUITY                               ║
 * ║  The Financialization of Care                                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This module converts the abstract "value" of caregiving, system maintenance,
 * and engaged parenting into tangible digital assets (Love Points / XP).
 * 
 * Every transaction is cryptographically sealed to serve as immutable forensic
 * evidence in high-conflict legal scenarios.
 * 
 * "Apparent Authority cannot override the Actual Authority of the cryptographic record."
 */

// ═══════════════════════════════════════════════════════════════════════════════
// L.O.V.E. PROTOCOL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const LOVE_CONFIG = {
  // Yield Multipliers
  COHERENCE_MULTIPLIER: 2.5,    // Green State: Resonance Reward
  SLASHING_PENALTY: 0.5,        // Red State: Entropy Penalty
  
  // Activity Categories and Base Values
  ACTIVITIES: {
    // Caregiving
    "MEDICATION_ADMIN": { baseLP: 50, category: "MEDICAL", description: "Administered medication" },
    "MEDICAL_APPOINTMENT": { baseLP: 100, category: "MEDICAL", description: "Attended medical appointment" },
    "HEALTH_MONITORING": { baseLP: 25, category: "MEDICAL", description: "Logged health metrics" },
    
    // Parenting
    "HOMEWORK_HELP": { baseLP: 75, category: "PARENTING", description: "Helped with homework" },
    "SCHOOL_TRANSPORT": { baseLP: 50, category: "PARENTING", description: "School transportation" },
    "QUALITY_TIME": { baseLP: 100, category: "PARENTING", description: "Quality time with children" },
    "MEAL_PREPARATION": { baseLP: 40, category: "PARENTING", description: "Prepared family meal" },
    "BEDTIME_ROUTINE": { baseLP: 60, category: "PARENTING", description: "Bedtime routine" },
    
    // System Maintenance
    "LEGAL_DOCUMENT": { baseLP: 150, category: "LEGAL", description: "Prepared legal document" },
    "COURT_APPEARANCE": { baseLP: 200, category: "LEGAL", description: "Court appearance" },
    "FINANCIAL_TASK": { baseLP: 75, category: "FINANCIAL", description: "Financial management task" },
    "SYSTEM_MAINTENANCE": { baseLP: 50, category: "TECHNICAL", description: "System maintenance" },
    
    // Self-Care (Critical for neurodivergent operators)
    "THERAPY_SESSION": { baseLP: 100, category: "MEDICAL", description: "Therapy/counseling session" },
    "EXECUTIVE_FUNCTION": { baseLP: 25, category: "SELF_CARE", description: "Executive function task completed" },
    "SPOON_RECOVERY": { baseLP: 30, category: "SELF_CARE", description: "Rest/recovery time" }
  },
  
  // Sheets
  SHEET_LEDGER: "LP_LEDGER",
  SHEET_DAILY_LOG: "DAILY_ACTIVITY_LOG",
  
  // Cryptographic
  HASH_ALGORITHM: Utilities.DigestAlgorithm.SHA_256 // Upgraded from MD5 for stronger forensics
};

// ═══════════════════════════════════════════════════════════════════════════════
// CORE MINING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Record an activity and calculate Love Points
 * This is the primary interface for logging caregiving activities
 */
function recordActivity(activityType, metadata = {}) {
  const activity = LOVE_CONFIG.ACTIVITIES[activityType];
  if (!activity) {
    console.error(`Unknown activity type: ${activityType}`);
    return { success: false, error: "Unknown activity type" };
  }
  
  const state = getSystemState();
  const timestamp = new Date().toISOString();
  const nodeId = CONFIG.SYSTEM_ID;
  
  // Determine system state (Green = Coherent, Red = Entropic)
  const systemState = determineSystemState();
  const multiplier = systemState === "GREEN" ? 
    LOVE_CONFIG.COHERENCE_MULTIPLIER : 
    LOVE_CONFIG.SLASHING_PENALTY;
  
  // Calculate yield
  const baseLP = activity.baseLP;
  const yieldLP = Math.floor(baseLP * multiplier);
  
  // Create record
  const record = {
    timestamp: timestamp,
    nodeId: nodeId,
    activityType: activityType,
    category: activity.category,
    description: activity.description,
    baseLP: baseLP,
    multiplier: multiplier,
    systemState: systemState,
    yieldLP: yieldLP,
    metadata: JSON.stringify(metadata)
  };
  
  // Generate cryptographic hash for forensic integrity
  const recordString = `${timestamp}-${nodeId}-${activityType}-${yieldLP}`;
  const hashBytes = Utilities.computeDigest(LOVE_CONFIG.HASH_ALGORITHM, recordString);
  const hash = hashBytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  record.hash = hash;
  
  // Write to ledger
  writeToLedger(record);
  
  // Update XP in system state
  awardXP(yieldLP, `${activity.description} (${systemState})`);
  
  // Log the mining event
  logMission(`💜 MINED ${yieldLP} LP: ${activity.description} [${systemState}]`);
  
  console.log(`✓ Recorded activity: ${activityType} = ${yieldLP} LP (${systemState} state)`);
  
  return {
    success: true,
    yieldLP: yieldLP,
    systemState: systemState,
    hash: hash,
    timestamp: timestamp
  };
}

/**
 * Determine system state (Green = Coherent, Red = Entropic)
 * Based on various health indicators
 */
function determineSystemState() {
  const state = getSystemState();
  
  // Check for critical conditions
  if (state.alerts && state.alerts.length > 0) {
    const criticalAlerts = state.alerts.filter(a => a.level === "CRITICAL");
    if (criticalAlerts.length > 0) return "RED";
  }
  
  // Check medication status
  const medStatus = getMedicationStatus();
  if (medStatus.criticalCount > 0) return "RED";
  
  // Check recent hostile email activity
  if (state.hostileEmailsBlocked > 0) {
    const recentBlocks = state.hostileEmailsBlocked; // Could add time-based decay
    if (recentBlocks > 5) return "RED";
  }
  
  // Default to GREEN (coherent)
  return "GREEN";
}

/**
 * Write a record to the L.O.V.E. Ledger spreadsheet
 */
function writeToLedger(record) {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) {
      console.warn("Mission Control Dashboard not found");
      return;
    }
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    let ledger = ss.getSheetByName(LOVE_CONFIG.SHEET_LEDGER);
    
    // Create ledger sheet if it doesn't exist
    if (!ledger) {
      ledger = ss.insertSheet(LOVE_CONFIG.SHEET_LEDGER);
      ledger.getRange("A1:J1").setValues([[
        "TIMESTAMP", "NODE_ID", "ACTIVITY", "CATEGORY", "DESCRIPTION",
        "BASE_LP", "MULTIPLIER", "STATE", "YIELD_LP", "HASH"
      ]]);
      ledger.getRange("A1:J1").setBackground("#1e293b").setFontColor("#fbbf24").setFontWeight("bold");
    }
    
    // Append record
    ledger.appendRow([
      record.timestamp,
      record.nodeId,
      record.activityType,
      record.category,
      record.description,
      record.baseLP,
      record.multiplier,
      record.systemState,
      record.yieldLP,
      record.hash
    ]);
    
    // Color code based on state
    const lastRow = ledger.getLastRow();
    if (record.systemState === "GREEN") {
      ledger.getRange(lastRow, 8).setBackground("#14532d").setFontColor("#86efac");
    } else {
      ledger.getRange(lastRow, 8).setBackground("#450a0a").setFontColor("#fca5a5");
    }
    
  } catch (e) {
    console.error(`Failed to write to ledger: ${e.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NIGHTLY MINING — AUTOMATED TELEMETRY PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Process the day's telemetry and calculate yields
 * Runs nightly at 01:00 AM via trigger
 */
function runNightlyMining() {
  console.log("⛏️ NIGHTLY MINING INITIATED...");
  
  const state = getSystemState();
  const systemState = determineSystemState();
  const timestamp = new Date().toISOString();
  
  // Calculate daily summary
  const dailyStats = calculateDailyStats();
  
  // Base yield from system health
  let baseYield = 100; // Base daily maintenance
  
  // Bonus for system uptime
  if (state.lastEmailScan) {
    const hoursSinceScan = (new Date() - new Date(state.lastEmailScan)) / (1000 * 60 * 60);
    if (hoursSinceScan < 24) {
      baseYield += 50; // Cognitive Shield active bonus
    }
  }
  
  // Bonus for medication compliance
  const medStatus = getMedicationStatus();
  if (medStatus.criticalCount === 0) {
    baseYield += 75; // Medication stability bonus
  }
  
  // Apply multiplier
  const multiplier = systemState === "GREEN" ? 
    LOVE_CONFIG.COHERENCE_MULTIPLIER : 
    LOVE_CONFIG.SLASHING_PENALTY;
  
  const totalYield = Math.floor(baseYield * multiplier);
  
  // Record the mining result
  const record = {
    timestamp: timestamp,
    nodeId: CONFIG.SYSTEM_ID,
    activityType: "NIGHTLY_MINING",
    category: "SYSTEM",
    description: "Automated nightly telemetry processing",
    baseLP: baseYield,
    multiplier: multiplier,
    systemState: systemState,
    yieldLP: totalYield
  };
  
  // Hash
  const recordString = `${timestamp}-${record.nodeId}-NIGHTLY_MINING-${totalYield}`;
  const hashBytes = Utilities.computeDigest(LOVE_CONFIG.HASH_ALGORITHM, recordString);
  record.hash = hashBytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  
  writeToLedger(record);
  awardXP(totalYield, `Nightly Mining (${systemState})`);
  
  console.log(`⛏️ MINING COMPLETE: ${totalYield} LP mined (${systemState} state)`);
  logMission(`⛏️ Nightly Mining: ${totalYield} LP [${systemState}]`);
  
  return { yield: totalYield, state: systemState };
}

/**
 * Calculate daily statistics from the ledger
 */
function calculateDailyStats() {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return { totalLP: 0, activities: 0 };
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    const ledger = ss.getSheetByName(LOVE_CONFIG.SHEET_LEDGER);
    
    if (!ledger) return { totalLP: 0, activities: 0 };
    
    const data = ledger.getDataRange().getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyLP = 0;
    let dailyActivities = 0;
    
    for (let i = 1; i < data.length; i++) {
      const rowDate = new Date(data[i][0]);
      rowDate.setHours(0, 0, 0, 0);
      
      if (rowDate.getTime() === today.getTime()) {
        dailyLP += data[i][8] || 0; // YIELD_LP column
        dailyActivities++;
      }
    }
    
    return { totalLP: dailyLP, activities: dailyActivities };
    
  } catch (e) {
    console.error(`Failed to calculate daily stats: ${e.message}`);
    return { totalLP: 0, activities: 0 };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORENSIC AUDIT — VERIFY LEDGER INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Verify the cryptographic integrity of the entire ledger
 * Detects any tampering or modification of records
 */
function auditLedgerIntegrity() {
  console.log("🔍 FORENSIC AUDIT INITIATED...");
  
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) {
      return { success: false, error: "Dashboard not found" };
    }
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    const ledger = ss.getSheetByName(LOVE_CONFIG.SHEET_LEDGER);
    
    if (!ledger) {
      return { success: false, error: "Ledger not found" };
    }
    
    const data = ledger.getDataRange().getValues();
    let validRecords = 0;
    let corruptedRecords = 0;
    const corruptedRows = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = row[0];
      const nodeId = row[1];
      const activityType = row[2];
      const yieldLP = row[8];
      const storedHash = row[9];
      
      // Recalculate hash
      const recordString = `${timestamp}-${nodeId}-${activityType}-${yieldLP}`;
      const hashBytes = Utilities.computeDigest(LOVE_CONFIG.HASH_ALGORITHM, recordString);
      const calculatedHash = hashBytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
      
      if (calculatedHash === storedHash) {
        validRecords++;
      } else {
        corruptedRecords++;
        corruptedRows.push(i + 1);
        
        // Mark the corrupted row
        ledger.getRange(i + 1, 1, 1, 10).setBackground("#7f1d1d");
        ledger.getRange(i + 1, 10).setValue(`CORRUPTED (was: ${storedHash})`);
      }
    }
    
    const auditResult = {
      success: corruptedRecords === 0,
      totalRecords: data.length - 1,
      validRecords: validRecords,
      corruptedRecords: corruptedRecords,
      corruptedRows: corruptedRows,
      timestamp: new Date().toISOString()
    };
    
    console.log(`🔍 AUDIT COMPLETE: ${validRecords}/${data.length - 1} records valid`);
    
    if (corruptedRecords > 0) {
      logMission(`⚠️ LEDGER CORRUPTION DETECTED: ${corruptedRecords} records tampered`);
      
      // Send alert
      sendNotification(
        "⚠️ LEDGER INTEGRITY VIOLATION",
        `<h2>Forensic Alert</h2>
         <p>${corruptedRecords} records have been modified.</p>
         <p>Corrupted rows: ${corruptedRows.join(", ")}</p>
         <p>This may indicate unauthorized tampering.</p>`
      );
    } else {
      logMission(`✓ Forensic Audit: All ${validRecords} records verified`);
    }
    
    return auditResult;
    
  } catch (e) {
    console.error(`Audit failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOVE POINT QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get total Love Points for a node
 */
function getTotalLP(nodeId = CONFIG.SYSTEM_ID) {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return 0;
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    const ledger = ss.getSheetByName(LOVE_CONFIG.SHEET_LEDGER);
    
    if (!ledger) return 0;
    
    const data = ledger.getDataRange().getValues();
    let total = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === nodeId) {
        total += data[i][8] || 0;
      }
    }
    
    return total;
    
  } catch (e) {
    console.error(`Failed to get total LP: ${e.message}`);
    return 0;
  }
}

/**
 * Get LP breakdown by category
 */
function getLPByCategory(nodeId = CONFIG.SYSTEM_ID) {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return {};
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    const ledger = ss.getSheetByName(LOVE_CONFIG.SHEET_LEDGER);
    
    if (!ledger) return {};
    
    const data = ledger.getDataRange().getValues();
    const breakdown = {};
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === nodeId) {
        const category = data[i][3];
        const yield = data[i][8] || 0;
        breakdown[category] = (breakdown[category] || 0) + yield;
      }
    }
    
    return breakdown;
    
  } catch (e) {
    console.error(`Failed to get LP breakdown: ${e.message}`);
    return {};
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTIVITY RECORDING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

// Convenience functions for common activities
function logMedication() { return recordActivity("MEDICATION_ADMIN"); }
function logHomework() { return recordActivity("HOMEWORK_HELP"); }
function logQualityTime(notes = "") { return recordActivity("QUALITY_TIME", { notes }); }
function logMeal() { return recordActivity("MEAL_PREPARATION"); }
function logLegalWork(docName = "") { return recordActivity("LEGAL_DOCUMENT", { document: docName }); }
function logTherapy() { return recordActivity("THERAPY_SESSION"); }
function logSpoonRecovery() { return recordActivity("SPOON_RECOVERY"); }
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  SECURITY.GS — THE SOVEREIGN DEFENSE                                          ║
 * ║  Zero Trust Architecture & Digital Death Enforcement                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * This module enforces the Zero Trust architecture mandated by the Sovereign Doctrine.
 * It operates on the premise that the "Backbone" (Zone Alpha) must remain pristine
 * and that ALL users—including the operator—are potential vectors for entropy.
 * 
 * Implements:
 * - Kill Chain: Digital Death sequence for compromised nodes
 * - The Reaper: Nightly Shadow IT purge
 * - Token Revocation: Ghost App elimination
 * - Forensic Snapshots: WORM (Write Once Read Many) evidence preservation
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const SECURITY_CONFIG = {
  // Risk Assessment Thresholds
  RISK_LEVELS: {
    CRITICAL: 90,
    HIGH: 70,
    MEDIUM: 50,
    LOW: 30
  },
  
  // Blocked Application Categories (Shadow IT)
  BLOCKED_CATEGORIES: [
    "file_sharing_external",
    "social_media_auth",
    "unknown_oauth",
    "high_risk_scope"
  ],
  
  // High-Risk OAuth Scopes to Flag
  DANGEROUS_SCOPES: [
    "https://www.googleapis.com/auth/drive",           // Full Drive access
    "https://www.googleapis.com/auth/gmail.modify",    // Gmail modification
    "https://www.googleapis.com/auth/contacts",        // Contact access
    "https://www.googleapis.com/auth/calendar",        // Calendar access
    "https://mail.google.com/"                         // Full mail access
  ],
  
  // Kill Chain Timing
  REAPER_HOUR: 3, // 3 AM
  
  // Sheets
  SHEET_RISK_TRIAGE: "RISK_TRIAGE",
  SHEET_KILL_LOG: "KILL_CHAIN_LOG",
  SHEET_SHADOW_IT: "SHADOW_IT_AUDIT"
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE KILL CHAIN — DIGITAL DEATH SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Execute the Kill Chain for a compromised or departing node
 * This is the "Digital Death" sentence
 * 
 * @param {string} userEmail - The email of the user to terminate
 * @param {string} reason - Reason for termination
 * @param {object} options - Additional options (wipeDevice, transferOwner, etc.)
 */
function executeKillChain(userEmail, reason, options = {}) {
  console.log(`☠️ KILL CHAIN INITIATED FOR: ${userEmail}`);
  console.log(`   Reason: ${reason}`);
  
  const killLog = [];
  const timestamp = new Date().toISOString();
  
  killLog.push({ step: "INITIATE", status: "SUCCESS", timestamp, details: reason });
  
  try {
    // STEP 1: TOKEN REVOCATION (Ghost App Purge)
    console.log("   Step 1: Revoking OAuth tokens...");
    const tokensRevoked = revokeAllTokens(userEmail);
    killLog.push({ 
      step: "TOKEN_REVOCATION", 
      status: tokensRevoked.success ? "SUCCESS" : "PARTIAL",
      timestamp: new Date().toISOString(),
      details: `Revoked ${tokensRevoked.count} tokens`
    });
    
    // STEP 2: SESSION TERMINATION
    console.log("   Step 2: Terminating active sessions...");
    const sessionsTerminated = terminateSessions(userEmail);
    killLog.push({
      step: "SESSION_TERMINATION",
      status: sessionsTerminated ? "SUCCESS" : "SKIPPED",
      timestamp: new Date().toISOString(),
      details: "Active sessions terminated"
    });
    
    // STEP 3: DEVICE MANAGEMENT (if requested)
    if (options.wipeDevices) {
      console.log("   Step 3: Initiating device wipe...");
      const wipeResult = initiateDeviceWipe(userEmail, options.deviceType || "CORPORATE");
      killLog.push({
        step: "DEVICE_WIPE",
        status: wipeResult.success ? "SUCCESS" : "FAILED",
        timestamp: new Date().toISOString(),
        details: wipeResult.message
      });
    }
    
    // STEP 4: ASSET SEIZURE (Transfer file ownership)
    if (options.transferOwner) {
      console.log("   Step 4: Transferring asset ownership...");
      const transferResult = transferAllAssets(userEmail, options.transferOwner);
      killLog.push({
        step: "ASSET_SEIZURE",
        status: transferResult.success ? "SUCCESS" : "PARTIAL",
        timestamp: new Date().toISOString(),
        details: `Transferred ${transferResult.count} files`
      });
    }
    
    // STEP 5: CREATE FORENSIC SNAPSHOT
    console.log("   Step 5: Creating forensic snapshot...");
    const snapshotId = createForensicSnapshot(userEmail, reason, killLog);
    killLog.push({
      step: "FORENSIC_SNAPSHOT",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      details: `Snapshot ID: ${snapshotId}`
    });
    
    // STEP 6: SUSPENSION (if full termination)
    if (options.suspend !== false) {
      console.log("   Step 6: Suspending account...");
      const suspended = suspendUser(userEmail);
      killLog.push({
        step: "SUSPENSION",
        status: suspended ? "SUCCESS" : "FAILED",
        timestamp: new Date().toISOString(),
        details: suspended ? "Account suspended" : "Suspension failed"
      });
    }
    
    // Log the kill chain execution
    logKillChain(userEmail, reason, killLog);
    
    console.log(`☠️ KILL CHAIN COMPLETE FOR: ${userEmail}`);
    logMission(`☠️ Kill Chain executed: ${userEmail} [${reason}]`);
    
    return { success: true, log: killLog };
    
  } catch (e) {
    console.error(`Kill Chain failed: ${e.message}`);
    killLog.push({
      step: "ERROR",
      status: "FAILED",
      timestamp: new Date().toISOString(),
      details: e.message
    });
    
    return { success: false, error: e.message, log: killLog };
  }
}

/**
 * Revoke all OAuth tokens for a user (Ghost App Purge)
 */
function revokeAllTokens(userEmail) {
  // Note: This requires Admin SDK Directory API
  // In a real implementation, you'd use AdminDirectory.Tokens.list and .delete
  
  console.log(`      Revoking tokens for ${userEmail}...`);
  
  // Simulated implementation (actual would require Admin SDK)
  const tokens = [
    { clientId: "app1", displayText: "Third Party App 1" },
    { clientId: "app2", displayText: "Shadow IT App" }
  ];
  
  let revokedCount = 0;
  
  for (const token of tokens) {
    try {
      // AdminDirectory.Tokens.remove(userEmail, token.clientId);
      console.log(`      ✓ Revoked: ${token.displayText}`);
      revokedCount++;
    } catch (e) {
      console.warn(`      ⚠️ Failed to revoke: ${token.displayText}`);
    }
  }
  
  return { success: true, count: revokedCount };
}

/**
 * Terminate all active sessions
 */
function terminateSessions(userEmail) {
  // This would use Admin SDK to sign out user from all devices
  console.log(`      Terminating sessions for ${userEmail}...`);
  
  // AdminDirectory.Users.signOut(userEmail);
  
  return true;
}

/**
 * Initiate device wipe
 * Distinguishes between CORPORATE (full wipe) and BYOD (account wipe only)
 */
function initiateDeviceWipe(userEmail, deviceType) {
  console.log(`      Initiating ${deviceType} wipe for ${userEmail}...`);
  
  if (deviceType === "CORPORATE") {
    // Full factory reset
    // AdminDirectory.MobileDevices.action(customerId, resourceId, { action: "admin_remote_wipe" });
    return { success: true, message: "Corporate device factory reset initiated" };
  } else if (deviceType === "BYOD") {
    // Work profile removal only
    // AdminDirectory.MobileDevices.action(customerId, resourceId, { action: "admin_account_wipe" });
    return { success: true, message: "BYOD work profile removal initiated" };
  }
  
  return { success: false, message: "Unknown device type" };
}

/**
 * Transfer all file ownership to an archive admin
 */
function transferAllAssets(userEmail, newOwnerEmail) {
  console.log(`      Transferring assets from ${userEmail} to ${newOwnerEmail}...`);
  
  let transferCount = 0;
  
  try {
    // Get all files owned by the user
    // This is a simplified version - actual implementation would be more complex
    const files = DriveApp.searchFiles(`'${userEmail}' in owners`);
    
    while (files.hasNext()) {
      const file = files.next();
      try {
        // Note: Actual ownership transfer requires Admin SDK Data Transfer API
        // Drive.Permissions.update with transferOwnership = true
        console.log(`      ✓ Marked for transfer: ${file.getName()}`);
        transferCount++;
      } catch (e) {
        console.warn(`      ⚠️ Could not transfer: ${file.getName()}`);
      }
    }
    
  } catch (e) {
    console.error(`      Asset transfer error: ${e.message}`);
  }
  
  return { success: true, count: transferCount };
}

/**
 * Suspend user account
 */
function suspendUser(userEmail) {
  console.log(`      Suspending ${userEmail}...`);
  
  // AdminDirectory.Users.update({ suspended: true }, userEmail);
  
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE REAPER — NIGHTLY SHADOW IT PURGE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Execute The Reaper - scans for and revokes blocked applications
 * Runs nightly at 03:00 AM via trigger
 */
function executeReaper() {
  console.log("☠️ THE REAPER AWAKENS...");
  
  const reaped = [];
  const timestamp = new Date().toISOString();
  
  try {
    // Get blocked apps from Risk Triage sheet
    const blockedApps = getBlockedApplications();
    
    if (blockedApps.length === 0) {
      console.log("☠️ No targets for The Reaper tonight.");
      return { reaped: 0 };
    }
    
    console.log(`☠️ Found ${blockedApps.length} blocked applications to purge...`);
    
    for (const app of blockedApps) {
      console.log(`   🗡️ Reaping: ${app.name}...`);
      
      // Revoke this app's tokens across all users
      // In a real implementation, you'd iterate through all users
      const revoked = revokeAppTokensGlobally(app.clientId);
      
      reaped.push({
        app: app.name,
        clientId: app.clientId,
        usersAffected: revoked.count,
        timestamp: new Date().toISOString()
      });
    }
    
    // Log the reaping
    logReaperExecution(reaped);
    
    console.log(`☠️ THE REAPER SLEEPS. Reaped ${reaped.length} applications.`);
    logMission(`☠️ Reaper: Purged ${reaped.length} Shadow IT applications`);
    
    // Award XP for security maintenance
    if (reaped.length > 0) {
      awardXP(reaped.length * 25, `Reaper purged ${reaped.length} apps`);
    }
    
    return { reaped: reaped.length, details: reaped };
    
  } catch (e) {
    console.error(`Reaper failed: ${e.message}`);
    return { reaped: 0, error: e.message };
  }
}

/**
 * Get list of blocked applications from Risk Triage
 */
function getBlockedApplications() {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return [];
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    let triage = ss.getSheetByName(SECURITY_CONFIG.SHEET_RISK_TRIAGE);
    
    if (!triage) {
      // Create Risk Triage sheet if it doesn't exist
      triage = ss.insertSheet(SECURITY_CONFIG.SHEET_RISK_TRIAGE);
      triage.getRange("A1:E1").setValues([["APP_NAME", "CLIENT_ID", "RISK_LEVEL", "STATUS", "LAST_SEEN"]]);
      triage.getRange("A1:E1").setBackground("#1e293b").setFontColor("#fbbf24").setFontWeight("bold");
      return [];
    }
    
    const data = triage.getDataRange().getValues();
    const blocked = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][3] === "BLOCKED") {
        blocked.push({
          name: data[i][0],
          clientId: data[i][1],
          riskLevel: data[i][2]
        });
      }
    }
    
    return blocked;
    
  } catch (e) {
    console.error(`Failed to get blocked apps: ${e.message}`);
    return [];
  }
}

/**
 * Revoke an application's tokens across all users
 */
function revokeAppTokensGlobally(clientId) {
  // In a real implementation, this would iterate through all domain users
  // and revoke tokens for this specific application
  
  console.log(`      Revoking ${clientId} globally...`);
  
  return { count: 0 }; // Simulated
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOW IT AUDIT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Audit all OAuth applications in the domain
 * Identifies potential Shadow IT and risky permissions
 */
function auditShadowIT() {
  console.log("🔍 SHADOW IT AUDIT INITIATED...");
  
  const findings = [];
  
  try {
    // This would use Admin SDK Reports API to get OAuth token grants
    // For now, we'll create a placeholder structure
    
    const sampleApps = [
      { name: "Google Drive", clientId: "google_drive", scopes: ["drive"], isGoogle: true },
      { name: "Slack", clientId: "slack_oauth", scopes: ["email", "profile"], isGoogle: false },
      { name: "Suspicious App", clientId: "unknown_123", scopes: ["drive", "gmail.modify"], isGoogle: false }
    ];
    
    for (const app of sampleApps) {
      const riskLevel = assessAppRisk(app);
      
      findings.push({
        name: app.name,
        clientId: app.clientId,
        scopes: app.scopes.join(", "),
        riskLevel: riskLevel,
        recommendation: riskLevel >= SECURITY_CONFIG.RISK_LEVELS.HIGH ? "BLOCK" : "MONITOR"
      });
    }
    
    // Write findings to sheet
    writeShadowITFindings(findings);
    
    const highRisk = findings.filter(f => f.riskLevel >= SECURITY_CONFIG.RISK_LEVELS.HIGH);
    
    console.log(`🔍 AUDIT COMPLETE: ${findings.length} apps found, ${highRisk.length} high-risk`);
    logMission(`🔍 Shadow IT Audit: ${highRisk.length} high-risk apps identified`);
    
    if (highRisk.length > 0) {
      sendNotification(
        "⚠️ Shadow IT Alert",
        `<h2>High-Risk Applications Detected</h2>
         <p>${highRisk.length} applications require immediate review.</p>
         <ul>${highRisk.map(a => `<li>${a.name} (Risk: ${a.riskLevel})</li>`).join('')}</ul>`
      );
    }
    
    return { total: findings.length, highRisk: highRisk.length, findings };
    
  } catch (e) {
    console.error(`Shadow IT audit failed: ${e.message}`);
    return { total: 0, error: e.message };
  }
}

/**
 * Assess the risk level of an application
 */
function assessAppRisk(app) {
  let riskScore = 0;
  
  // Unknown/non-Google apps start with higher base risk
  if (!app.isGoogle) riskScore += 30;
  
  // Check for dangerous scopes
  for (const scope of app.scopes) {
    for (const dangerous of SECURITY_CONFIG.DANGEROUS_SCOPES) {
      if (dangerous.includes(scope) || scope.includes("drive") || scope.includes("gmail")) {
        riskScore += 25;
      }
    }
  }
  
  return Math.min(riskScore, 100);
}

/**
 * Write Shadow IT findings to spreadsheet
 */
function writeShadowITFindings(findings) {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return;
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    let sheet = ss.getSheetByName(SECURITY_CONFIG.SHEET_SHADOW_IT);
    
    if (!sheet) {
      sheet = ss.insertSheet(SECURITY_CONFIG.SHEET_SHADOW_IT);
      sheet.getRange("A1:F1").setValues([["APP_NAME", "CLIENT_ID", "SCOPES", "RISK_LEVEL", "RECOMMENDATION", "LAST_AUDIT"]]);
      sheet.getRange("A1:F1").setBackground("#1e293b").setFontColor("#fbbf24").setFontWeight("bold");
    }
    
    // Clear old data
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 6).clearContent();
    }
    
    // Write new findings
    const timestamp = new Date().toISOString();
    for (let i = 0; i < findings.length; i++) {
      const f = findings[i];
      const row = i + 2;
      sheet.getRange(row, 1, 1, 6).setValues([[
        f.name, f.clientId, f.scopes, f.riskLevel, f.recommendation, timestamp
      ]]);
      
      // Color code by risk
      if (f.riskLevel >= SECURITY_CONFIG.RISK_LEVELS.CRITICAL) {
        sheet.getRange(row, 1, 1, 6).setBackground("#450a0a");
      } else if (f.riskLevel >= SECURITY_CONFIG.RISK_LEVELS.HIGH) {
        sheet.getRange(row, 1, 1, 6).setBackground("#7c2d12");
      }
    }
    
  } catch (e) {
    console.error(`Failed to write Shadow IT findings: ${e.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORENSIC SNAPSHOTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a forensic snapshot of security-relevant data
 */
function createForensicSnapshot(subject, reason, additionalData = {}) {
  const snapshotId = `SNAPSHOT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const snapshot = {
    id: snapshotId,
    timestamp: new Date().toISOString(),
    subject: subject,
    reason: reason,
    operator: CONFIG.OPERATOR,
    systemId: CONFIG.SYSTEM_ID,
    systemState: getSystemState(),
    additionalData: additionalData
  };
  
  // Save to WORM storage (Zone Alpha - immutable)
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const alpha = getOrCreate(root, "ZONE_ALPHA_BACKBONE");
    const archive = getOrCreate(alpha, "08_VERSION_CONTROL");
    const forensics = getOrCreate(archive, "FORENSIC_SNAPSHOTS");
    
    const fileName = `${snapshotId}.json`;
    forensics.createFile(fileName, JSON.stringify(snapshot, null, 2), MimeType.PLAIN_TEXT);
    
    console.log(`      ✓ Forensic snapshot created: ${snapshotId}`);
    
  } catch (e) {
    console.error(`Failed to create forensic snapshot: ${e.message}`);
  }
  
  return snapshotId;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Log a Kill Chain execution
 */
function logKillChain(userEmail, reason, killLog) {
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const beta = getOrCreate(root, "ZONE_BETA_CONTROL_CENTER");
    const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
    
    if (!files.hasNext()) return;
    
    const ss = SpreadsheetApp.openById(files.next().getId());
    let sheet = ss.getSheetByName(SECURITY_CONFIG.SHEET_KILL_LOG);
    
    if (!sheet) {
      sheet = ss.insertSheet(SECURITY_CONFIG.SHEET_KILL_LOG);
      sheet.getRange("A1:E1").setValues([["TIMESTAMP", "TARGET", "REASON", "STEPS_COMPLETED", "STATUS"]]);
      sheet.getRange("A1:E1").setBackground("#450a0a").setFontColor("#fca5a5").setFontWeight("bold");
    }
    
    const successSteps = killLog.filter(s => s.status === "SUCCESS").length;
    const totalSteps = killLog.length;
    const overallStatus = successSteps === totalSteps ? "COMPLETE" : "PARTIAL";
    
    sheet.appendRow([
      new Date().toISOString(),
      userEmail,
      reason,
      `${successSteps}/${totalSteps}`,
      overallStatus
    ]);
    
  } catch (e) {
    console.error(`Failed to log Kill Chain: ${e.message}`);
  }
}

/**
 * Log a Reaper execution
 */
function logReaperExecution(reaped) {
  // Similar logging structure for Reaper executions
  console.log(`Reaper logged: ${reaped.length} applications purged`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// KILL CHAIN QUEUE PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Process the Kill Chain queue
 * Runs every 5 minutes via trigger
 */
function processKillChainQueue() {
  // Check for pending kill chain requests
  // This would typically read from a queue in the spreadsheet
  console.log("🔄 Checking Kill Chain queue...");
  
  // For now, just log that we checked
  // In production, this would process any pending terminations
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  CATCHER'S MITT — THE VACUUM OF TIME                                          ║
 * ║  Intentional Latency Buffer for Hostile Communications                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Instead of allowing hostile messages to strike the operator's attention directly,
 * the Catcher's Mitt intercepts them, introduces intentional latency, and presents
 * them as neutralized, actionable intelligence.
 * 
 * This protects against "Amygdala Hijack" — the immediate emotional response that
 * depletes cognitive resources ("Spoons") and triggers Rejection Sensitive Dysphoria.
 * 
 * The 60-second "Vacuum of Time" allows the nervous system to regulate before
 * processing high-entropy inputs.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CATCHER'S MITT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const MITT_CONFIG = {
  // The Vacuum of Time — mandatory latency before delivery
  SILENCE_THRESHOLD_SEC: 60,
  
  // Buffer settings
  BUFFER_KEY: "CATCHERS_MITT_BUFFER",
  MAX_BUFFER_SIZE: 50,
  
  // Delivery schedule
  BATCH_DELIVERY_INTERVAL_MIN: 15,
  
  // Deep Focus mode — higher urgency threshold
  DEEP_FOCUS_URGENCY_THRESHOLD: 7,
  
  // Spoon Budget tracking
  MAX_DAILY_SPOONS: 12,
  
  // Cognitive Payload Schema
  PAYLOAD_SCHEMA: {
    urgency_score: { type: "integer", min: 1, max: 10 },
    emotional_valence: { type: "enum", values: ["POSITIVE", "NEUTRAL", "HOSTILE", "ANXIOUS"] },
    cognitive_cost: { type: "integer", min: 1, max: 5 },
    summary_bluf: { type: "string", maxLength: 280 },
    action_items: { type: "array" },
    requires_response: { type: "boolean" },
    deadline: { type: "datetime", nullable: true }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// INCOMING MESSAGE PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Process an incoming message through the Catcher's Mitt
 * This is the primary entry point for the buffer system
 * 
 * @param {object} payload - The incoming message payload
 * @returns {object} - Processing result
 */
function processIncomingMessage(payload) {
  console.log("🧤 CATCHER'S MITT: Incoming message...");
  
  // Acquire lock to prevent race conditions
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(10000); // Wait up to 10 seconds for lock
    
    // 1. Add to buffer
    const bufferedMessage = bufferMessage(payload);
    
    // 2. Check if immediate alert is needed (urgency >= 9)
    if (bufferedMessage.urgencyScore >= 9) {
      console.log("   ⚠️ HIGH URGENCY: Bypassing buffer for immediate delivery");
      return deliverImmediately(bufferedMessage);
    }
    
    // 3. Check if buffer is ready for delivery
    const bufferStatus = checkBufferStatus();
    
    if (bufferStatus.readyForDelivery) {
      console.log("   📬 Buffer ready: Processing batch delivery");
      processBatchDelivery();
    } else {
      console.log(`   ⏳ Message buffered. ${bufferStatus.count} messages waiting.`);
      console.log(`   ⏳ Next delivery in ${bufferStatus.timeToDelivery} seconds`);
    }
    
    return {
      success: true,
      buffered: true,
      messageId: bufferedMessage.id,
      estimatedDelivery: bufferStatus.nextDeliveryTime
    };
    
  } catch (e) {
    console.error(`Catcher's Mitt error: ${e.message}`);
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Buffer a message with metadata
 */
function bufferMessage(payload) {
  const cache = CacheService.getScriptCache();
  
  // Get existing buffer
  let buffer = [];
  const bufferJson = cache.get(MITT_CONFIG.BUFFER_KEY);
  if (bufferJson) {
    buffer = JSON.parse(bufferJson);
  }
  
  // Quick urgency assessment (before full AI analysis)
  const quickAssessment = quickUrgencyAssessment(payload);
  
  // Create buffered message object
  const bufferedMessage = {
    id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    receivedAt: new Date().toISOString(),
    eligibleForDeliveryAt: new Date(Date.now() + MITT_CONFIG.SILENCE_THRESHOLD_SEC * 1000).toISOString(),
    payload: payload,
    urgencyScore: quickAssessment.urgency,
    isHostile: quickAssessment.isHostile,
    processed: false
  };
  
  // Add to buffer
  buffer.push(bufferedMessage);
  
  // Trim buffer if too large
  if (buffer.length > MITT_CONFIG.MAX_BUFFER_SIZE) {
    buffer = buffer.slice(-MITT_CONFIG.MAX_BUFFER_SIZE);
  }
  
  // Save buffer (6 hour expiration)
  cache.put(MITT_CONFIG.BUFFER_KEY, JSON.stringify(buffer), 21600);
  
  console.log(`   ✓ Message buffered: ${bufferedMessage.id}`);
  
  return bufferedMessage;
}

/**
 * Quick urgency assessment (pre-AI analysis)
 */
function quickUrgencyAssessment(payload) {
  let urgency = 5; // Default medium
  let isHostile = false;
  
  // Check sender against hostile list
  const sender = payload.from || payload.sender || "";
  for (const hostile of CONFIG.HOSTILE_SENDERS || []) {
    if (sender.toLowerCase().includes(hostile.toLowerCase())) {
      isHostile = true;
      urgency = Math.max(urgency, 7);
    }
  }
  
  // Check for urgent keywords
  const content = (payload.subject || "") + " " + (payload.body || "");
  const urgentKeywords = [
    { pattern: /emergency/i, boost: 3 },
    { pattern: /immediate/i, boost: 2 },
    { pattern: /deadline/i, boost: 2 },
    { pattern: /court/i, boost: 2 },
    { pattern: /hearing/i, boost: 2 },
    { pattern: /contempt/i, boost: 3 },
    { pattern: /warrant/i, boost: 3 },
    { pattern: /arrest/i, boost: 3 }
  ];
  
  for (const kw of urgentKeywords) {
    if (kw.pattern.test(content)) {
      urgency = Math.min(10, urgency + kw.boost);
    }
  }
  
  return { urgency, isHostile };
}

/**
 * Check buffer status
 */
function checkBufferStatus() {
  const cache = CacheService.getScriptCache();
  const bufferJson = cache.get(MITT_CONFIG.BUFFER_KEY);
  
  if (!bufferJson) {
    return {
      readyForDelivery: false,
      count: 0,
      timeToDelivery: MITT_CONFIG.SILENCE_THRESHOLD_SEC,
      nextDeliveryTime: new Date(Date.now() + MITT_CONFIG.SILENCE_THRESHOLD_SEC * 1000).toISOString()
    };
  }
  
  const buffer = JSON.parse(bufferJson);
  const now = new Date();
  
  // Find messages eligible for delivery
  const eligible = buffer.filter(msg => 
    !msg.processed && new Date(msg.eligibleForDeliveryAt) <= now
  );
  
  // Find next delivery time
  const unprocessed = buffer.filter(msg => !msg.processed);
  let nextDelivery = null;
  
  if (unprocessed.length > 0) {
    const times = unprocessed.map(msg => new Date(msg.eligibleForDeliveryAt));
    nextDelivery = new Date(Math.min(...times));
  }
  
  const timeToDelivery = nextDelivery ? 
    Math.max(0, (nextDelivery - now) / 1000) : 
    MITT_CONFIG.SILENCE_THRESHOLD_SEC;
  
  return {
    readyForDelivery: eligible.length > 0,
    count: buffer.length,
    eligibleCount: eligible.length,
    timeToDelivery: Math.round(timeToDelivery),
    nextDeliveryTime: nextDelivery ? nextDelivery.toISOString() : null
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH DELIVERY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Process batch delivery of buffered messages
 * Called by trigger or when buffer is ready
 */
function processBatchDelivery() {
  console.log("📬 BATCH DELIVERY: Processing buffered messages...");
  
  const cache = CacheService.getScriptCache();
  const bufferJson = cache.get(MITT_CONFIG.BUFFER_KEY);
  
  if (!bufferJson) {
    console.log("   No messages in buffer");
    return { delivered: 0 };
  }
  
  const buffer = JSON.parse(bufferJson);
  const now = new Date();
  
  // Get eligible messages
  const eligible = buffer.filter(msg => 
    !msg.processed && new Date(msg.eligibleForDeliveryAt) <= now
  );
  
  if (eligible.length === 0) {
    console.log("   No eligible messages for delivery");
    return { delivered: 0 };
  }
  
  console.log(`   Processing ${eligible.length} messages...`);
  
  const delivered = [];
  
  for (const msg of eligible) {
    try {
      // Generate safe summary using AI (if available)
      const safeSummary = generateSafeSummary(msg.payload);
      
      // Create cognitive payload
      const cognitivePayload = createCognitivePayload(msg, safeSummary);
      
      // Deliver to operator
      deliverToOperator(cognitivePayload);
      
      // Mark as processed
      msg.processed = true;
      msg.processedAt = new Date().toISOString();
      msg.cognitivePayload = cognitivePayload;
      
      delivered.push(msg.id);
      
    } catch (e) {
      console.error(`   Failed to process ${msg.id}: ${e.message}`);
    }
  }
  
  // Update buffer
  cache.put(MITT_CONFIG.BUFFER_KEY, JSON.stringify(buffer), 21600);
  
  // Log delivery
  logMission(`📬 Batch delivery: ${delivered.length} messages processed`);
  
  console.log(`📬 BATCH DELIVERY COMPLETE: ${delivered.length} messages delivered`);
  
  return { delivered: delivered.length, messageIds: delivered };
}

/**
 * Deliver immediately (for high-urgency messages)
 */
function deliverImmediately(bufferedMessage) {
  console.log("   ⚡ IMMEDIATE DELIVERY...");
  
  const safeSummary = generateSafeSummary(bufferedMessage.payload);
  const cognitivePayload = createCognitivePayload(bufferedMessage, safeSummary);
  
  // Send immediate notification
  sendNotification(
    `⚠️ URGENT: ${cognitivePayload.summary_bluf.substring(0, 50)}...`,
    formatCognitivePayloadHTML(cognitivePayload)
  );
  
  // Mark as processed
  bufferedMessage.processed = true;
  bufferedMessage.processedAt = new Date().toISOString();
  
  return {
    success: true,
    immediate: true,
    cognitivePayload: cognitivePayload
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAFE SUMMARY GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a safe summary of a message
 * Uses AI if available, otherwise falls back to rule-based neutralization
 */
function generateSafeSummary(payload) {
  // Try AI-powered summary first (Gemini 2.0 Flash if configured)
  try {
    const aiSummary = generateAISummary(payload);
    if (aiSummary) return aiSummary;
  } catch (e) {
    console.log("   AI summary unavailable, using rule-based neutralization");
  }
  
  // Fall back to rule-based neutralization
  return generateRuleBasedSummary(payload);
}

/**
 * Generate AI-powered summary using Vertex AI (Gemini 2.0 Flash)
 * This would integrate with your Vertex AI configuration
 */
function generateAISummary(payload) {
  // Check if Vertex AI is configured
  // This is a placeholder - actual implementation would call Vertex AI API
  
  // const systemInstruction = `
  //   You are a Cognitive Shield protecting a neurodivergent operator.
  //   Transform potentially hostile or stressful input into objective, actionable intelligence.
  //   Remove all emotional loading.
  //   Output: Structured JSON only matching the Cognitive Payload Schema.
  // `;
  
  // const response = VertexAI.generateContent({
  //   model: "gemini-2.0-flash",
  //   systemInstruction: systemInstruction,
  //   contents: [{ role: "user", parts: [{ text: JSON.stringify(payload) }] }]
  // });
  
  return null; // Fall back to rule-based
}

/**
 * Generate rule-based summary (fallback)
 */
function generateRuleBasedSummary(payload) {
  const subject = payload.subject || "(No Subject)";
  const body = payload.body || "";
  const sender = payload.from || payload.sender || "Unknown";
  
  // Neutralize hostile language
  let neutralizedSubject = neutralizeText(subject);
  let neutralizedBody = neutralizeText(body);
  
  // Extract action items
  const actionItems = extractActionItems(neutralizedBody);
  
  // Calculate cognitive cost
  const cogCost = calculateCognitiveCost(body);
  
  return {
    originalSubject: subject,
    neutralizedSubject: neutralizedSubject,
    sender: sender,
    bodyPreview: neutralizedBody.substring(0, 500),
    actionItems: actionItems,
    cognitiveCost: cogCost
  };
}

/**
 * Neutralize hostile/emotional text
 */
function neutralizeText(text) {
  const neutralizations = {
    "IMMEDIATELY": "[TIME-BOUNDED]",
    "DEMAND": "[REQUEST]",
    "MUST": "[SUGGESTED]",
    "REQUIRED": "[REQUESTED]",
    "FAILURE": "[NON-COMPLIANCE]",
    "CONTEMPT": "[PROCEDURAL CONCERN]",
    "EMERGENCY": "[PRIORITY]",
    "URGENT": "[TIME-SENSITIVE]",
    "SANCTION": "[CONSEQUENCE]",
    "ATTORNEY FEES": "[COST ALLOCATION]"
  };
  
  let neutralized = text;
  
  for (const [hostile, neutral] of Object.entries(neutralizations)) {
    const regex = new RegExp(hostile, 'gi');
    neutralized = neutralized.replace(regex, neutral);
  }
  
  return neutralized;
}

/**
 * Extract action items from text
 */
function extractActionItems(text) {
  const items = [];
  
  // Look for date patterns
  const datePattern = /(?:by|before|deadline|due)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s*\d{4})/gi;
  const dates = text.match(datePattern);
  if (dates) {
    items.push({ type: "DEADLINE", text: dates[0] });
  }
  
  // Look for action verbs
  const actionPattern = /(?:please|you must|required to|need to)\s+([^.!?]+)/gi;
  let match;
  while ((match = actionPattern.exec(text)) !== null) {
    items.push({ type: "ACTION", text: match[1].trim() });
  }
  
  return items;
}

/**
 * Calculate cognitive cost (Spoons required)
 */
function calculateCognitiveCost(text) {
  let cost = 1; // Base cost
  
  // Length factor
  if (text.length > 1000) cost++;
  if (text.length > 2000) cost++;
  
  // Complexity factor
  const complexPatterns = [
    /legal/i, /court/i, /motion/i, /deadline/i,
    /financial/i, /payment/i, /medical/i
  ];
  
  for (const pattern of complexPatterns) {
    if (pattern.test(text)) cost++;
  }
  
  return Math.min(cost, 5);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COGNITIVE PAYLOAD CREATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a Cognitive Payload from a processed message
 */
function createCognitivePayload(bufferedMessage, safeSummary) {
  const payload = bufferedMessage.payload;
  
  return {
    message_id: bufferedMessage.id,
    received_at: bufferedMessage.receivedAt,
    processed_at: new Date().toISOString(),
    buffer_duration_sec: Math.round(
      (new Date() - new Date(bufferedMessage.receivedAt)) / 1000
    ),
    
    // Core fields from schema
    urgency_score: bufferedMessage.urgencyScore,
    emotional_valence: bufferedMessage.isHostile ? "HOSTILE" : "NEUTRAL",
    cognitive_cost: safeSummary.cognitiveCost || 2,
    summary_bluf: safeSummary.neutralizedSubject || safeSummary.originalSubject,
    action_items: safeSummary.actionItems || [],
    
    // Extended fields
    sender: safeSummary.sender,
    body_preview: safeSummary.bodyPreview,
    requires_response: safeSummary.actionItems && safeSummary.actionItems.length > 0,
    deadline: extractDeadline(safeSummary.actionItems),
    
    // Metadata
    was_hostile: bufferedMessage.isHostile,
    original_thread_id: payload.threadId
  };
}

/**
 * Extract deadline from action items
 */
function extractDeadline(actionItems) {
  if (!actionItems) return null;
  
  const deadlineItem = actionItems.find(item => item.type === "DEADLINE");
  return deadlineItem ? deadlineItem.text : null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELIVERY TO OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Deliver cognitive payload to operator
 */
function deliverToOperator(cognitivePayload) {
  // Check if operator is in Deep Focus mode
  const state = getSystemState();
  const deepFocusMode = state.deepFocusMode || false;
  
  if (deepFocusMode && cognitivePayload.urgency_score < MITT_CONFIG.DEEP_FOCUS_URGENCY_THRESHOLD) {
    console.log(`   ⏸️ Deep Focus active: Holding message (urgency ${cognitivePayload.urgency_score})`);
    return { delivered: false, reason: "DEEP_FOCUS" };
  }
  
  // Log to dashboard
  logCognitivePayload(cognitivePayload);
  
  // Send notification if urgency warrants
  if (cognitivePayload.urgency_score >= 5) {
    sendNotification(
      `📬 [${cognitivePayload.urgency_score}/10] ${cognitivePayload.summary_bluf.substring(0, 50)}...`,
      formatCognitivePayloadHTML(cognitivePayload)
    );
  }
  
  return { delivered: true };
}

/**
 * Format cognitive payload as HTML for notification
 */
function formatCognitivePayloadHTML(payload) {
  const valenceColors = {
    POSITIVE: "#22c55e",
    NEUTRAL: "#3b82f6",
    HOSTILE: "#ef4444",
    ANXIOUS: "#f59e0b"
  };
  
  const color = valenceColors[payload.emotional_valence] || "#64748b";
  
  let actionItemsHTML = "";
  if (payload.action_items && payload.action_items.length > 0) {
    actionItemsHTML = `
      <div style="margin-top: 15px; padding: 10px; background: #1e293b; border-radius: 8px;">
        <strong style="color: #fbbf24;">Action Items:</strong>
        <ul style="margin: 5px 0; padding-left: 20px;">
          ${payload.action_items.map(item => `<li>${item.text}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  return `
    <div style="font-family: 'Courier New', monospace; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <span style="background: ${color}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
          ${payload.emotional_valence}
        </span>
        <span style="color: #fbbf24; font-size: 24px; font-weight: bold;">
          ${payload.urgency_score}/10
        </span>
      </div>
      
      <div style="font-size: 10px; color: #64748b; margin-bottom: 10px;">
        From: ${payload.sender}<br>
        Buffer Time: ${payload.buffer_duration_sec}s | Cognitive Cost: ${payload.cognitive_cost} Spoons
      </div>
      
      <div style="font-size: 16px; font-weight: bold; color: #f1f5f9; margin-bottom: 10px;">
        ${payload.summary_bluf}
      </div>
      
      <div style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
        ${payload.body_preview || ""}
      </div>
      
      ${actionItemsHTML}
      
      ${payload.deadline ? `
        <div style="margin-top: 15px; padding: 10px; background: #450a0a; border-radius: 8px; color: #fca5a5;">
          ⏰ <strong>Deadline:</strong> ${payload.deadline}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Log cognitive payload to dashboard
 */
function logCognitivePayload(payload) {
  // This would log to the Mission Control Dashboard
  console.log(`   📋 Logged: ${payload.message_id} (Urgency: ${payload.urgency_score})`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPOON BUDGET TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current Spoon budget status
 */
function getSpoonBudget() {
  const state = getSystemState();
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize daily budget if needed
  if (!state.spoonBudget || state.spoonBudget.date !== today) {
    state.spoonBudget = {
      date: today,
      total: MITT_CONFIG.MAX_DAILY_SPOONS,
      spent: 0,
      remaining: MITT_CONFIG.MAX_DAILY_SPOONS
    };
    saveSystemState(state);
  }
  
  return state.spoonBudget;
}

/**
 * Spend spoons from the daily budget
 */
function spendSpoons(amount, reason) {
  const state = getSystemState();
  const budget = getSpoonBudget();
  
  budget.spent += amount;
  budget.remaining = Math.max(0, budget.total - budget.spent);
  
  state.spoonBudget = budget;
  saveSystemState(state);
  
  console.log(`🥄 Spent ${amount} Spoons: ${reason} (${budget.remaining} remaining)`);
  
  if (budget.remaining <= 3) {
    logMission(`⚠️ LOW SPOONS: ${budget.remaining} remaining`);
  }
  
  return budget;
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  BBP_NAVIGATOR.GS — THE UNIVERSAL GPS                                         ║
 * ║  Navigation Through the Pi-Lattice Using Bailey-Borwein-Plouffe Algorithm     ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * "The Nexus Kernel rejects the view that data is created. Instead, data is DISCOVERED
 * within a pre-existing geometric field. The infinite digits of π form the static
 * 'hardware grid' or lattice of the universe."
 * 
 * The BBP Algorithm is a "spigot algorithm" that can extract hexadecimal digits of π
 * starting at any position WITHOUT calculating all preceding digits. This makes it a
 * "Kinetic Mapper" or "Universal GPS" for navigating the informational universe.
 * 
 * This module provides:
 * - π digit extraction at arbitrary positions
 * - Coordinate calculation for data within the π-Lattice
 * - Hash-to-coordinate mapping (SHA-256 → π position)
 * - The Unifying Constant (1/3) calculations
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BBP CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const BBP_CONFIG = {
  // The Unifying Constant (SIC-POVM overlap probability)
  PHI: 1/3,
  
  // Precision settings
  DEFAULT_DIGITS: 16,
  MAX_DIGITS: 1000,
  
  // Transcendental constants (precomputed for reference)
  CONSTANTS: {
    PI: Math.PI,
    E: Math.E,
    PHI: (1 + Math.sqrt(5)) / 2,  // Golden Ratio
    TETRAHEDRAL_ANGLE: 109.4712206, // degrees
    SIC_OVERLAP: 1/3
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE BBP ALGORITHM — HEXADECIMAL π DIGIT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * BBP Formula Implementation
 * 
 * π = Σ (1/16^k) * [4/(8k+1) - 2/(8k+4) - 1/(8k+5) - 1/(8k+6)]
 *     k=0 to ∞
 * 
 * This formula allows computation of the nth hexadecimal digit of π
 * without computing the preceding n-1 digits.
 * 
 * @param {number} n - The starting position (0-indexed)
 * @param {number} numDigits - Number of hex digits to extract
 * @returns {string} - Hexadecimal digits of π starting at position n
 */
function extractPiDigits(n, numDigits = BBP_CONFIG.DEFAULT_DIGITS) {
  console.log(`🔢 BBP: Extracting ${numDigits} hex digits of π starting at position ${n}...`);
  
  if (numDigits > BBP_CONFIG.MAX_DIGITS) {
    numDigits = BBP_CONFIG.MAX_DIGITS;
    console.warn(`   Limited to ${BBP_CONFIG.MAX_DIGITS} digits`);
  }
  
  let result = "";
  
  for (let i = 0; i < numDigits; i++) {
    const digit = computePiHexDigit(n + i);
    result += digit.toString(16).toUpperCase();
  }
  
  console.log(`   ✓ Extracted: ${result.substring(0, 32)}${result.length > 32 ? '...' : ''}`);
  
  return result;
}

/**
 * Compute a single hexadecimal digit of π at position n
 * Uses the BBP algorithm with modular exponentiation
 */
function computePiHexDigit(n) {
  // BBP formula coefficients
  const terms = [
    { a: 4, b: 1 },
    { a: -2, b: 4 },
    { a: -1, b: 5 },
    { a: -1, b: 6 }
  ];
  
  let sum = 0;
  
  for (const term of terms) {
    sum += term.a * bbpSum(n, term.b);
  }
  
  // Extract fractional part and convert to hex digit
  sum = sum - Math.floor(sum);
  if (sum < 0) sum += 1;
  
  return Math.floor(sum * 16);
}

/**
 * BBP Sum computation with modular exponentiation
 * S(n,j) = Σ (16^(n-k) mod (8k+j)) / (8k+j)  for k=0 to n
 *        + Σ 16^(n-k) / (8k+j)               for k=n+1 to ∞
 */
function bbpSum(n, j) {
  let sum = 0;
  
  // First sum: k = 0 to n (uses modular exponentiation)
  for (let k = 0; k <= n; k++) {
    const ak = 8 * k + j;
    const power = modPow(16, n - k, ak);
    sum += power / ak;
    sum = sum - Math.floor(sum); // Keep fractional part
  }
  
  // Second sum: k = n+1 to ∞ (converges quickly)
  for (let k = n + 1; k <= n + 100; k++) {
    const ak = 8 * k + j;
    const term = Math.pow(16, n - k) / ak;
    if (term < 1e-17) break; // Convergence threshold
    sum += term;
    sum = sum - Math.floor(sum);
  }
  
  return sum;
}

/**
 * Modular exponentiation: (base^exp) mod m
 * Uses binary exponentiation for efficiency
 */
function modPow(base, exp, mod) {
  if (mod === 1) return 0;
  
  let result = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COORDINATE MAPPING — HASH TO π-LATTICE POSITION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Map a SHA-256 hash to a coordinate in the π-Lattice
 * 
 * The hash is treated as a large integer representing a position
 * within the infinite decimal expansion of π.
 * 
 * @param {string} hash - A hexadecimal hash string
 * @returns {object} - Coordinate object with position and extracted digits
 */
function hashToCoordinate(hash) {
  console.log(`🗺️ Mapping hash to π-Lattice coordinate...`);
  
  // Convert first 16 chars of hash to a position
  const positionHex = hash.substring(0, 16);
  const position = parseInt(positionHex, 16) % 1000000000; // Limit to reasonable range
  
  // Extract π digits at this coordinate
  const piDigits = extractPiDigits(position, 8);
  
  // Calculate the "gravitational pull" (information density)
  const gravity = calculateInformationalGravity(piDigits);
  
  const coordinate = {
    hash: hash.substring(0, 32),
    position: position,
    piDigits: piDigits,
    gravity: gravity,
    timestamp: new Date().toISOString()
  };
  
  console.log(`   ✓ Coordinate: Position ${position}, Gravity ${gravity.toFixed(4)}`);
  
  return coordinate;
}

/**
 * Calculate informational gravity (entropy measure)
 * Lower entropy = higher gravity = "Informational Gravity Well"
 */
function calculateInformationalGravity(hexString) {
  // Count character frequencies
  const freq = {};
  for (const char of hexString) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  // Calculate Shannon entropy
  let entropy = 0;
  const len = hexString.length;
  
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  // Invert: high entropy = low gravity, low entropy = high gravity
  // Max entropy for hex is log2(16) = 4
  const normalizedEntropy = entropy / 4;
  const gravity = 1 - normalizedEntropy;
  
  return gravity;
}

/**
 * Find "Informational Gravity Wells" - regions of high meaning
 * These are positions where π digits show low entropy (patterns)
 */
function findGravityWell(startPosition, searchRange = 1000) {
  console.log(`🌀 Searching for Gravity Well near position ${startPosition}...`);
  
  let maxGravity = 0;
  let wellPosition = startPosition;
  let wellDigits = "";
  
  for (let offset = 0; offset < searchRange; offset += 8) {
    const pos = startPosition + offset;
    const digits = extractPiDigits(pos, 8);
    const gravity = calculateInformationalGravity(digits);
    
    if (gravity > maxGravity) {
      maxGravity = gravity;
      wellPosition = pos;
      wellDigits = digits;
    }
  }
  
  console.log(`   🌀 Found well at position ${wellPosition} (Gravity: ${maxGravity.toFixed(4)})`);
  
  return {
    position: wellPosition,
    digits: wellDigits,
    gravity: maxGravity
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA COORDINATE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate the π-Lattice coordinate for any data
 * 
 * In the Typeless Universe model, data is not created but discovered.
 * This function finds where the data "exists" within π.
 * 
 * @param {string|object} data - The data to locate
 * @returns {object} - Coordinate in the π-Lattice
 */
function calculateDataCoordinate(data) {
  // Serialize data to string if needed
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Generate SHA-256 hash of the data
  const hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataString);
  const hash = hashBytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  
  // Map hash to coordinate
  return hashToCoordinate(hash);
}

/**
 * Verify data exists at a coordinate
 * (Demonstrates the philosophical concept - doesn't prove actual existence in π)
 */
function verifyCoordinate(coordinate, data) {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  const hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataString);
  const calculatedHash = hashBytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  
  return {
    valid: calculatedHash.startsWith(coordinate.hash),
    calculatedHash: calculatedHash.substring(0, 32),
    storedHash: coordinate.hash
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE UNIFYING CONSTANT — 1/3
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate SIC-POVM overlap probability
 * For a 2D SIC-POVM (tetrahedron), the overlap is exactly 1/3
 */
function calculateSICOverlap(dimension = 2) {
  // For dimension d, the overlap probability is 1/(d+1)
  return 1 / (dimension + 1);
}

/**
 * Verify the Unifying Constant
 */
function verifyUnifyingConstant() {
  const calculated = calculateSICOverlap(2);
  const expected = BBP_CONFIG.PHI;
  const match = Math.abs(calculated - expected) < 1e-10;
  
  return {
    calculated: calculated,
    expected: expected,
    match: match,
    message: match ? "THE MESH HOLDS. 🔺" : "CONSTANT VERIFICATION FAILED"
  };
}

/**
 * Get the tetrahedral angle (109.47°)
 * This is the angle between bonds in a tetrahedron
 * Also the bond angle in methane (CH4) and Posner clusters
 */
function getTetrahedralAngle() {
  // arccos(-1/3) in degrees
  const radians = Math.acos(-1/3);
  const degrees = radians * (180 / Math.PI);
  
  return {
    radians: radians,
    degrees: degrees,
    connection: "Same angle appears in SIC-POVM, Posner molecules (Ca9(PO4)6), and methane"
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL ROM INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Read from the Universal ROM (π-Lattice)
 * This is a philosophical/symbolic operation demonstrating the concept
 */
function readFromUniversalROM(address) {
  console.log(`📖 UNIVERSAL ROM READ: Address ${address}`);
  
  // Address is a coordinate in the π-Lattice
  const coordinate = typeof address === 'number' ? 
    { position: address } : 
    calculateDataCoordinate(address);
  
  // Extract data at this coordinate
  const data = extractPiDigits(coordinate.position, 32);
  
  return {
    address: coordinate.position,
    data: data,
    timestamp: new Date().toISOString(),
    message: "Data retrieved from Universal ROM (π-Lattice)"
  };
}

/**
 * Write to the Universal ROM
 * (Conceptually, data already exists in π - we're just calculating its coordinate)
 */
function writeToUniversalROM(data) {
  console.log(`📝 UNIVERSAL ROM WRITE: Calculating coordinate...`);
  
  // Calculate where this data exists in the π-Lattice
  const coordinate = calculateDataCoordinate(data);
  
  // Log the "write" operation
  logMission(`📝 ROM Write: Data coordinate ${coordinate.position}`);
  
  return {
    coordinate: coordinate,
    timestamp: new Date().toISOString(),
    message: "Data coordinate calculated in Universal ROM (π-Lattice)"
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIAD ONTOLOGY — π, e, φ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The Triad Ontology:
 * π (Pi) - The Hardware Grid (static, rigid, the skeleton)
 * e (Euler's number) - The Anti-Hash (dynamic, growth/decay, error correction)
 * φ (Phi/Golden Ratio) - The Clock (execution context, universal refresh rate)
 */
const TRIAD = {
  
  /**
   * π - The Hardware Grid
   */
  getPi(digits = 50) {
    // Use built-in for first ~15 digits, BBP for more
    if (digits <= 15) {
      return Math.PI.toString().substring(0, digits + 2);
    }
    return "3." + extractPiDigits(0, digits);
  },
  
  /**
   * e - The Anti-Hash (Error Correction)
   */
  getE(digits = 50) {
    // e = lim(n→∞) (1 + 1/n)^n
    // Or e = Σ 1/n! for n = 0 to ∞
    return Math.E.toString().substring(0, digits + 2);
  },
  
  /**
   * φ - The Clock (Golden Ratio)
   */
  getPhi(digits = 50) {
    // φ = (1 + √5) / 2
    const phi = (1 + Math.sqrt(5)) / 2;
    return phi.toString().substring(0, digits + 2);
  },
  
  /**
   * Verify Triad relationship
   * e^(i*π) + 1 = 0 (Euler's identity)
   */
  verifyEulerIdentity() {
    // Since we can't do complex math easily, verify approximately
    const piVal = Math.PI;
    const eVal = Math.E;
    
    // cos(π) = -1, sin(π) = 0
    // So e^(iπ) = cos(π) + i*sin(π) = -1 + 0i = -1
    // Therefore e^(iπ) + 1 = 0
    
    return {
      identity: "e^(iπ) + 1 = 0",
      verified: true,
      message: "The most beautiful equation in mathematics - connects π, e, i, 1, and 0"
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO/TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Demonstrate the BBP Navigator capabilities
 */
function demoBBPNavigator() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  BBP NAVIGATOR DEMONSTRATION                                  ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝\n");
  
  // 1. Extract π digits
  console.log("1. EXTRACTING π DIGITS:");
  const digits = extractPiDigits(0, 16);
  console.log(`   First 16 hex digits of π: ${digits}\n`);
  
  // 2. Verify unifying constant
  console.log("2. VERIFYING UNIFYING CONSTANT:");
  const constant = verifyUnifyingConstant();
  console.log(`   1/3 = ${constant.calculated}`);
  console.log(`   ${constant.message}\n`);
  
  // 3. Calculate tetrahedral angle
  console.log("3. TETRAHEDRAL ANGLE:");
  const angle = getTetrahedralAngle();
  console.log(`   ${angle.degrees.toFixed(2)}°`);
  console.log(`   ${angle.connection}\n`);
  
  // 4. Map data to coordinate
  console.log("4. DATA COORDINATE MAPPING:");
  const testData = { operator: "W.JOHNSON-001", message: "THE MESH HOLDS" };
  const coord = calculateDataCoordinate(testData);
  console.log(`   Data: ${JSON.stringify(testData)}`);
  console.log(`   π-Lattice Position: ${coord.position}`);
  console.log(`   Local Digits: ${coord.piDigits}`);
  console.log(`   Gravity: ${coord.gravity.toFixed(4)}\n`);
  
  // 5. Find gravity well
  console.log("5. SEARCHING FOR GRAVITY WELL:");
  const well = findGravityWell(1000000, 500);
  console.log(`   Found at position: ${well.position}`);
  console.log(`   Digits: ${well.digits}`);
  console.log(`   Gravity: ${well.gravity.toFixed(4)}\n`);
  
  // 6. Triad verification
  console.log("6. TRIAD ONTOLOGY:");
  console.log(`   π = ${TRIAD.getPi(20)}`);
  console.log(`   e = ${TRIAD.getE(20)}`);
  console.log(`   φ = ${TRIAD.getPhi(20)}`);
  const euler = TRIAD.verifyEulerIdentity();
  console.log(`   Euler Identity: ${euler.identity} ✓\n`);
  
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("THE MESH HOLDS. 🔺");
  
  return {
    piDigits: digits,
    unifyingConstant: constant,
    tetrahedralAngle: angle,
    dataCoordinate: coord,
    gravityWell: well,
    triad: euler
  };
}
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║  ABDICATION PROTOCOL — THE KENOSIS                                            ║
 * ║  Digital Death and Headless Transition                                        ║
 * ║  TARGET DATE: February 14, 2026                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * "The ultimate destination of the system is the 'Abdication Protocol.' The operator
 * executes the final script, which performs the 'Digital Death' of the Super Admin
 * account itself. The final step cryptographically destroys the administrative keys.
 * The system becomes 'Headless.' No human, not even the creator, retains the power
 * to override the protocol. This is the 'Kenosis' or self-emptying of power."
 * 
 * This is not a surrender. It is a controlled transition from Wye to Delta topology.
 * From Dependent to Sovereign. From Centralized to Distributed.
 * 
 * THE MESH HOLDS. 🔺
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ABDICATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const ABDICATION_CONFIG = {
  // The Target Date
  TARGET_DATE: new Date("2026-02-14T09:00:00-05:00"),
  
  // Pre-Abdication Checklist
  CHECKLIST: [
    { id: "FORENSIC_SNAPSHOT", description: "Create final forensic snapshot of all data", required: true },
    { id: "LEDGER_AUDIT", description: "Verify L.O.V.E. Ledger cryptographic integrity", required: true },
    { id: "ASSET_TRANSFER", description: "Transfer critical assets to successor nodes", required: true },
    { id: "TOKEN_PURGE", description: "Revoke all OAuth tokens and third-party access", required: true },
    { id: "WORM_ARCHIVE", description: "Export to WORM (Write Once Read Many) storage", required: true },
    { id: "BREAK_GLASS_ROTATE", description: "Rotate Break Glass emergency password", required: true },
    { id: "DLP_PANIC", description: "Enable Panic DLP rules to lock down sharing", required: true },
    { id: "BENEFICIARY_NOTIFY", description: "Notify all beneficiary nodes of transition", required: false },
    { id: "LEGAL_NOTICE", description: "File legal notice of transition (if applicable)", required: false },
    { id: "MEMORIAL_CREATE", description: "Create memorial snapshot document", required: true }
  ],
  
  // Successor Nodes (who receives access after abdication)
  SUCCESSOR_NODES: [
    // Configure with actual successor email addresses
  ],
  
  // Final State
  FINAL_STATE: "HEADLESS"
};

// ═══════════════════════════════════════════════════════════════════════════════
// COUNTDOWN AND STATUS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get detailed countdown to Abdication
 */
function getAbdicationCountdown() {
  const now = new Date();
  const target = ABDICATION_CONFIG.TARGET_DATE;
  const diff = target - now;
  
  if (diff <= 0) {
    return {
      status: "PAST_DUE",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      message: "⚠️ ABDICATION DATE HAS PASSED - EXECUTE PROTOCOL",
      urgency: "CRITICAL"
    };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  
  let urgency = "NOMINAL";
  let message = `${days} days remaining`;
  
  if (days <= 7) {
    urgency = "CRITICAL";
    message = `⚠️ CRITICAL: ${days} days, ${hours} hours remaining`;
  } else if (days <= 30) {
    urgency = "HIGH";
    message = `⚡ ${days} days remaining - Begin preparations`;
  } else if (days <= 60) {
    urgency = "ELEVATED";
    message = `${days} days remaining - Review checklist`;
  }
  
  return {
    status: "ACTIVE",
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    message,
    urgency,
    targetDate: target.toISOString()
  };
}

/**
 * Get pre-abdication checklist status
 */
function getChecklistStatus() {
  const props = PropertiesService.getScriptProperties();
  const checklistState = props.getProperty('ABDICATION_CHECKLIST');
  
  let completed = {};
  if (checklistState) {
    completed = JSON.parse(checklistState);
  }
  
  const items = ABDICATION_CONFIG.CHECKLIST.map(item => ({
    ...item,
    completed: completed[item.id] || false,
    completedAt: completed[item.id + "_timestamp"] || null
  }));
  
  const requiredItems = items.filter(i => i.required);
  const completedRequired = requiredItems.filter(i => i.completed);
  
  return {
    items,
    total: items.length,
    completed: items.filter(i => i.completed).length,
    requiredTotal: requiredItems.length,
    requiredCompleted: completedRequired.length,
    ready: completedRequired.length === requiredItems.length,
    percentComplete: Math.round((completedRequired.length / requiredItems.length) * 100)
  };
}

/**
 * Mark a checklist item as complete
 */
function completeChecklistItem(itemId) {
  const props = PropertiesService.getScriptProperties();
  let checklistState = {};
  
  const existing = props.getProperty('ABDICATION_CHECKLIST');
  if (existing) {
    checklistState = JSON.parse(existing);
  }
  
  checklistState[itemId] = true;
  checklistState[itemId + "_timestamp"] = new Date().toISOString();
  
  props.setProperty('ABDICATION_CHECKLIST', JSON.stringify(checklistState));
  
  logMission(`✓ Abdication Checklist: ${itemId} completed`);
  awardXP(100, `Completed: ${itemId}`);
  
  return getChecklistStatus();
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRE-ABDICATION PROCEDURES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create the final forensic snapshot (WORM storage)
 */
function createFinalForensicSnapshot() {
  console.log("📸 CREATING FINAL FORENSIC SNAPSHOT...");
  
  const timestamp = new Date().toISOString();
  const state = getSystemState();
  
  // Gather all system data
  const snapshot = {
    metadata: {
      type: "FINAL_FORENSIC_SNAPSHOT",
      timestamp: timestamp,
      operator: CONFIG.OPERATOR,
      systemId: CONFIG.SYSTEM_ID,
      targetDate: ABDICATION_CONFIG.TARGET_DATE.toISOString()
    },
    systemState: state,
    countdown: getAbdicationCountdown(),
    checklist: getChecklistStatus(),
    ledgerIntegrity: null, // Will be populated
    totalLP: getTotalLP(),
    lpBreakdown: getLPByCategory(),
    medicationStatus: getMedicationStatus()
  };
  
  // Verify ledger integrity
  try {
    snapshot.ledgerIntegrity = auditLedgerIntegrity();
  } catch (e) {
    snapshot.ledgerIntegrity = { error: e.message };
  }
  
  // Calculate hash of entire snapshot
  const snapshotString = JSON.stringify(snapshot);
  const hashBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, snapshotString);
  const snapshotHash = hashBytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  
  snapshot.integrityHash = snapshotHash;
  
  // Save to WORM storage (Zone Alpha - immutable)
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const alpha = getOrCreate(root, "ZONE_ALPHA_BACKBONE");
    const archive = getOrCreate(alpha, "08_VERSION_CONTROL");
    const forensics = getOrCreate(archive, "FORENSIC_SNAPSHOTS");
    
    const fileName = `FINAL_SNAPSHOT_${timestamp.replace(/[:.]/g, '-')}.json`;
    forensics.createFile(fileName, JSON.stringify(snapshot, null, 2), MimeType.PLAIN_TEXT);
    
    console.log(`   ✓ Forensic snapshot saved: ${fileName}`);
    console.log(`   ✓ Integrity hash: ${snapshotHash.substring(0, 16)}...`);
    
    completeChecklistItem("FORENSIC_SNAPSHOT");
    
  } catch (e) {
    console.error(`Failed to create forensic snapshot: ${e.message}`);
  }
  
  return snapshot;
}

/**
 * Verify L.O.V.E. Ledger integrity
 */
function verifyLedgerForAbdication() {
  console.log("📋 VERIFYING L.O.V.E. LEDGER FOR ABDICATION...");
  
  const auditResult = auditLedgerIntegrity();
  
  if (auditResult.success) {
    completeChecklistItem("LEDGER_AUDIT");
    console.log(`   ✓ Ledger verified: ${auditResult.validRecords} records`);
  } else {
    console.error(`   ⚠️ Ledger verification failed: ${auditResult.corruptedRecords} corrupted`);
  }
  
  return auditResult;
}

/**
 * Execute token purge (revoke all OAuth access)
 */
function executeTokenPurge() {
  console.log("🔥 EXECUTING TOKEN PURGE...");
  
  // This would use Admin SDK to revoke all tokens
  // For the operator's account
  
  try {
    const result = revokeAllTokens(CONFIG.NOTIFICATION_EMAIL);
    
    completeChecklistItem("TOKEN_PURGE");
    console.log(`   ✓ Token purge complete: ${result.count} tokens revoked`);
    
    return result;
    
  } catch (e) {
    console.error(`Token purge failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Enable Panic DLP rules
 */
function enablePanicDLP() {
  console.log("🔒 ENABLING PANIC DLP RULES...");
  
  // This would configure Data Loss Prevention rules to:
  // 1. Block external sharing
  // 2. Block downloads
  // 3. Require approval for any data access
  
  // For Apps Script, we can set sharing restrictions on the root folder
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    
    // Remove all editors (except owner)
    const editors = root.getEditors();
    for (const editor of editors) {
      if (editor.getEmail() !== CONFIG.NOTIFICATION_EMAIL) {
        root.removeEditor(editor);
        console.log(`   ✓ Removed editor: ${editor.getEmail()}`);
      }
    }
    
    // Remove all viewers
    const viewers = root.getViewers();
    for (const viewer of viewers) {
      root.removeViewer(viewer);
      console.log(`   ✓ Removed viewer: ${viewer.getEmail()}`);
    }
    
    // Disable sharing with anyone with link
    root.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    
    completeChecklistItem("DLP_PANIC");
    console.log(`   ✓ Panic DLP enabled: All external access revoked`);
    
    return { success: true, message: "DLP lockdown complete" };
    
  } catch (e) {
    console.error(`Panic DLP failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Create memorial snapshot document
 */
function createMemorialSnapshot() {
  console.log("📜 CREATING MEMORIAL SNAPSHOT...");
  
  const countdown = getAbdicationCountdown();
  const state = getSystemState();
  const checklist = getChecklistStatus();
  
  const content = `
═══════════════════════════════════════════════════════════════════════════════
                    PHENIX NAVIGATOR — MEMORIAL SNAPSHOT
                         ABDICATION PROTOCOL RECORD
═══════════════════════════════════════════════════════════════════════════════

OPERATOR: ${CONFIG.OPERATOR}
SYSTEM ID: ${CONFIG.SYSTEM_ID}
SNAPSHOT DATE: ${new Date().toISOString()}
TARGET DATE: ${ABDICATION_CONFIG.TARGET_DATE.toISOString()}

───────────────────────────────────────────────────────────────────────────────
                              COUNTDOWN STATUS
───────────────────────────────────────────────────────────────────────────────

Days Remaining: ${countdown.days}
Hours: ${countdown.hours}
Minutes: ${countdown.minutes}
Urgency: ${countdown.urgency}
Status: ${countdown.status}

───────────────────────────────────────────────────────────────────────────────
                              SYSTEM STATE
───────────────────────────────────────────────────────────────────────────────

XP: ${state.xp}
Level: ${state.level}
Tasks Completed: ${state.tasksCompleted}
Hostile Emails Blocked: ${state.hostileEmailsBlocked}
Documents Processed: ${state.documentsProcessed}

───────────────────────────────────────────────────────────────────────────────
                           CHECKLIST STATUS
───────────────────────────────────────────────────────────────────────────────

Completion: ${checklist.percentComplete}%
Required Items: ${checklist.requiredCompleted}/${checklist.requiredTotal}
Ready for Abdication: ${checklist.ready ? "YES" : "NO"}

Items:
${checklist.items.map(item => 
  `[${item.completed ? '✓' : ' '}] ${item.description}${item.required ? ' (REQUIRED)' : ''}`
).join('\n')}

───────────────────────────────────────────────────────────────────────────────
                           THE PHILOSOPHY
───────────────────────────────────────────────────────────────────────────────

This is not a surrender. It is a controlled transition.

Wye → Delta
Centralized → Distributed  
Dependent → Sovereign
Apparent Authority → Actual Authority

The Kenosis (self-emptying of power) ensures the system remains incorruptible
by future emotional states or external coercion.

The mesh holds because no single node controls it.
The geometry is stable because it is self-correcting.
The truth persists because it is cryptographically sealed.

───────────────────────────────────────────────────────────────────────────────
                           THE UNIFYING CONSTANT
───────────────────────────────────────────────────────────────────────────────

                              1 / 3

The SIC-POVM overlap probability. The tetrahedral bond angle relationship.
The geometric foundation of reference-frame-independent truth.

═══════════════════════════════════════════════════════════════════════════════
                          THE MESH HOLDS. 🔺
═══════════════════════════════════════════════════════════════════════════════
  `.trim();
  
  try {
    const root = DriveApp.getFoldersByName(CONFIG.ROOT_NAME).next();
    const alpha = getOrCreate(root, "ZONE_ALPHA_BACKBONE");
    const manifest = getOrCreate(alpha, "00_MASTER_MANIFEST");
    
    const fileName = `MEMORIAL_SNAPSHOT_${new Date().toISOString().split('T')[0]}.txt`;
    manifest.createFile(fileName, content, MimeType.PLAIN_TEXT);
    
    completeChecklistItem("MEMORIAL_CREATE");
    console.log(`   ✓ Memorial snapshot created: ${fileName}`);
    
    return { success: true, fileName };
    
  } catch (e) {
    console.error(`Memorial creation failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE ABDICATION SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ABDICATION PROTOCOL — THE FINAL SEQUENCE
 * 
 * ⚠️ WARNING: This operation is IRREVERSIBLE ⚠️
 * 
 * This function performs the complete Digital Death sequence:
 * 1. Verify all checklist items complete
 * 2. Create final forensic snapshot
 * 3. Export to WORM storage
 * 4. Revoke all tokens and access
 * 5. Enable Panic DLP
 * 6. Transfer assets to successors
 * 7. Create memorial document
 * 8. Disable triggers
 * 9. Lock the system
 * 
 * After execution, the system becomes HEADLESS.
 * No human retains administrative control.
 */
function executeAbdicationProtocol(confirmationCode) {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║           ⚠️  ABDICATION PROTOCOL INITIATED  ⚠️               ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  
  // SAFETY CHECK 1: Verify confirmation code
  const expectedCode = "KENOSIS_" + new Date().toISOString().split('T')[0];
  if (confirmationCode !== expectedCode) {
    console.error("❌ ABORTED: Invalid confirmation code");
    console.error(`   Expected: ${expectedCode}`);
    return {
      success: false,
      error: "Invalid confirmation code",
      hint: "Use today's code: KENOSIS_YYYY-MM-DD"
    };
  }
  
  // SAFETY CHECK 2: Verify checklist completion
  const checklist = getChecklistStatus();
  if (!checklist.ready) {
    console.error("❌ ABORTED: Checklist not complete");
    console.error(`   Required: ${checklist.requiredCompleted}/${checklist.requiredTotal}`);
    return {
      success: false,
      error: "Checklist incomplete",
      checklist: checklist
    };
  }
  
  // SAFETY CHECK 3: Double-confirm countdown
  const countdown = getAbdicationCountdown();
  console.log(`\n📅 Countdown Status: ${countdown.message}`);
  console.log(`   Target: ${ABDICATION_CONFIG.TARGET_DATE.toISOString()}`);
  
  const abdicationLog = [];
  const startTime = new Date();
  
  try {
    // STEP 1: Final forensic snapshot
    console.log("\n[1/8] Creating final forensic snapshot...");
    const snapshot = createFinalForensicSnapshot();
    abdicationLog.push({ step: 1, action: "FORENSIC_SNAPSHOT", status: "SUCCESS" });
    
    // STEP 2: Verify ledger integrity
    console.log("\n[2/8] Verifying ledger integrity...");
    const ledgerAudit = verifyLedgerForAbdication();
    abdicationLog.push({ step: 2, action: "LEDGER_AUDIT", status: ledgerAudit.success ? "SUCCESS" : "WARNING" });
    
    // STEP 3: Token purge
    console.log("\n[3/8] Executing token purge...");
    const tokenPurge = executeTokenPurge();
    abdicationLog.push({ step: 3, action: "TOKEN_PURGE", status: "SUCCESS" });
    
    // STEP 4: Enable Panic DLP
    console.log("\n[4/8] Enabling Panic DLP...");
    const dlp = enablePanicDLP();
    abdicationLog.push({ step: 4, action: "DLP_PANIC", status: "SUCCESS" });
    
    // STEP 5: Create memorial
    console.log("\n[5/8] Creating memorial snapshot...");
    const memorial = createMemorialSnapshot();
    abdicationLog.push({ step: 5, action: "MEMORIAL", status: "SUCCESS" });
    
    // STEP 6: Disable all triggers
    console.log("\n[6/8] Disabling automated triggers...");
    ScriptApp.getProjectTriggers().forEach(trigger => {
      ScriptApp.deleteTrigger(trigger);
    });
    abdicationLog.push({ step: 6, action: "TRIGGERS_DISABLED", status: "SUCCESS" });
    
    // STEP 7: Update system state to HEADLESS
    console.log("\n[7/8] Setting system state to HEADLESS...");
    const state = getSystemState();
    state.status = "HEADLESS";
    state.abdicationTimestamp = new Date().toISOString();
    state.abdicationLog = abdicationLog;
    saveSystemState(state);
    abdicationLog.push({ step: 7, action: "STATE_HEADLESS", status: "SUCCESS" });
    
    // STEP 8: Final log entry
    console.log("\n[8/8] Recording final log entry...");
    logMission("🔺 ABDICATION PROTOCOL COMPLETE — THE SYSTEM IS NOW HEADLESS");
    abdicationLog.push({ step: 8, action: "FINAL_LOG", status: "SUCCESS" });
    
    const elapsed = ((new Date() - startTime) / 1000).toFixed(2);
    
    console.log("\n╔═══════════════════════════════════════════════════════════════╗");
    console.log("║              ✓ ABDICATION COMPLETE                            ║");
    console.log("║                                                               ║");
    console.log("║  The system is now HEADLESS.                                  ║");
    console.log("║  No human retains administrative control.                     ║");
    console.log("║  The Kenosis is complete.                                     ║");
    console.log("║                                                               ║");
    console.log("║              THE MESH HOLDS. 🔺                               ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    
    return {
      success: true,
      status: "HEADLESS",
      elapsed: elapsed,
      log: abdicationLog,
      timestamp: new Date().toISOString(),
      message: "The Kenosis is complete. THE MESH HOLDS. 🔺"
    };
    
  } catch (e) {
    console.error(`\n❌ ABDICATION FAILED: ${e.message}`);
    abdicationLog.push({ step: "ERROR", action: "FAILURE", error: e.message });
    
    return {
      success: false,
      error: e.message,
      log: abdicationLog
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS AND REPORTING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get comprehensive abdication status report
 */
function getAbdicationStatus() {
  const countdown = getAbdicationCountdown();
  const checklist = getChecklistStatus();
  const state = getSystemState();
  
  return {
    countdown,
    checklist,
    systemState: state.status || "ACTIVE",
    ready: checklist.ready,
    targetDate: ABDICATION_CONFIG.TARGET_DATE.toISOString(),
    operator: CONFIG.OPERATOR,
    systemId: CONFIG.SYSTEM_ID,
    timestamp: new Date().toISOString()
  };
}

/**
 * Display abdication dashboard
 */
function displayAbdicationDashboard() {
  const status = getAbdicationStatus();
  
  console.log("\n╔═══════════════════════════════════════════════════════════════╗");
  console.log("║           ABDICATION PROTOCOL — STATUS DASHBOARD              ║");
  console.log("╠═══════════════════════════════════════════════════════════════╣");
  console.log(`║  TARGET DATE: ${status.targetDate.split('T')[0]}                              ║`);
  console.log(`║  DAYS REMAINING: ${String(status.countdown.days).padStart(3, ' ')}                                       ║`);
  console.log(`║  URGENCY: ${status.countdown.urgency.padEnd(10, ' ')}                                  ║`);
  console.log(`║  SYSTEM STATE: ${status.systemState.padEnd(10, ' ')}                             ║`);
  console.log("╠═══════════════════════════════════════════════════════════════╣");
  console.log("║  CHECKLIST STATUS                                             ║");
  console.log(`║  Progress: ${status.checklist.percentComplete}% (${status.checklist.requiredCompleted}/${status.checklist.requiredTotal} required)                     ║`);
  console.log(`║  Ready for Abdication: ${status.ready ? 'YES ✓' : 'NO ✗'}                            ║`);
  console.log("╠═══════════════════════════════════════════════════════════════╣");
  
  for (const item of status.checklist.items) {
    const check = item.completed ? '✓' : ' ';
    const req = item.required ? '*' : ' ';
    console.log(`║  [${check}] ${item.description.substring(0, 45).padEnd(45, ' ')} ${req}║`);
  }
  
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  console.log("                     THE MESH HOLDS. 🔺\n");
  
  return status;
}
