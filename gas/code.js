/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║   SIMPLEX v7.0 — THE MOLECULE                                               ║
 * ║   Single Fold. Four Vertices. Minimum Stable System.                        ║
 * ║   SYSTEM DESIGNATION: P31-LABS-001                                          ║
 * ║   LEGAL ENTITY: P31 Labs, Inc. (Georgia 501(c)(3) Nonprofit Corp)           ║
 * ╠═══════════════════════════════════════════════════════════════════════════════╣
 * ║   Simplex Kernel + P31 Clarity + Vertex One + Corporate Governance          ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  OPERATOR: "Will",
  TITLE: "Incorporator & CEO",
  SYSTEM_ID: "P31-LABS-INC-001",
  CODENAME: "GEODESIC_OPERATOR",
  VERSION: "7.0.0",
  ROOT_NAME: "P31_OPERATIONS_ROOT",

  // NEW TARGET: MATA Application & Initial Board Ratification
  TARGET_DATE: new Date("2026-02-27T17:00:00-05:00"),
  ABDICATION_DATE: new Date("2026-02-27T17:00:00-05:00"), // alias for backward compat

  // SECURITY
  SECURITY: {
    DEVICE_SECRET: "CHANGE_THIS_TO_YOUR_ESP32_KEY",
    SAFE_MODE_TRIGGER: 2
  },

  // AI NEXUS
  AI_NEXUS: {
    PROJECT_ID: "p31-labs-vertex-001",
    LOCATION: "us-central1",
    MODEL_ID: "gemini-2.0-flash"
  },

  // MEDICAL — Medication Definitions
  MEDICATIONS: [
    { name: "Calcitriol", intervalHours: 12, critical: true, consequence: "Hypocalcemia → Tetany → Cardiac Arrest" },
    { name: "EffexorXR", intervalHours: 24, critical: true, consequence: "SNRI Discontinuation Syndrome" },
    { name: "Vyvanse", intervalHours: 24, critical: true, consequence: "ADHD Executive Function Collapse" },
    { name: "Calcium/Magnesium", intervalHours: 12, critical: true, consequence: "Bone density loss, tetany risk" }
  ],

  // BIOLOGICAL SUBSTRATE — Spoon Economy & Medical Physics
  BIO_PHYSICS: {
    MAX_SPOONS: 12,
    CALCIUM_ABSORPTION_WINDOW: 4  // Hours between Calcium and Vyvanse
  },
  DAILY_SPOONS: 12,
  SPOON_COSTS: {
    "WAKE_UP": 1, "MASKING": 3, "DEEP_WORK": 2, "MEDITATION": -1,
    "COOKING": 1, "EXERCISE": 1.5, "EMAIL": 2, "PHONE_CALL": 3,
    "SOCIAL_MEDIA": 3, "LITIGATION": 5, "CREATIVE_FLOW": 0.5,
    "MELTDOWN": 12, "BOARD_MEETING": 4
  },

  // P31 Clarity — Communication Buffer
  HOSTILE_SENDERS: [
    "jenn@mcghanlaw.com",
    "c.e.francis11@gmail.com",
    "opposing_counsel_firm.com"
  ],

  // L.O.V.E. ECONOMY
  MINING: {
    BASE_RATE: 10,
    GREEN_MULTIPLIER: 2.5,
    YELLOW_MULTIPLIER: 1.0,
    RED_MULTIPLIER: 0.5
  },

  // GAMIFICATION
  XP_PER_TASK: 100,
  XP_PER_LEVEL: 2000,

  // NOTIFICATION
  get NOTIFICATION_EMAIL() {
    try { return Session.getActiveUser().getEmail(); } catch(e) { return "will@p31.email"; }
  },

  // THE CONSTANT
  PHI: 1/3
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURE — FOLDER TOPOLOGY (UPDATED FOR 501c3 COMPLIANCE)
// ═══════════════════════════════════════════════════════════════════════════════

const ARCHITECTURE = {
  "ZONE_ALPHA_BACKBONE": {
    description: "🔷 IMMUTABLE TRUTH — The Archive.",
    children: [
      "00_MASTER_MANIFEST", "01_DOCTRINE_AND_SOPs", "02_ASSET_LIBRARY",
      "03_VERTEX_ONE_TDP", "04_ABDICATE_SOURCE", "05_THEORETICAL_FRAMEWORKS",
      "06_MEDICAL_BIOLOGICAL_TDP", "07_FAMILY_ONBOARDING", "08_VERSION_CONTROL",
      "09_CORPORATE_RECORDS"  // Articles, Bylaws, EIN, Resolutions
    ]
  },
  "ZONE_BETA_CONTROL_CENTER": {
    description: "🔴 LIVE OPERATIONS — Operations Hub.",
    children: [
      "10_ACTIVE_CAMPAIGNS", "11_LEGAL_WAR_ROOM", "12_FINANCIAL_TELEMETRY",
      "13_HIRING_PIPELINE", "14_COMMUNICATIONS_ARCHIVE", "15_METABOLIC_MONITORING",
      "16_TOMOGRAPH_INTERCEPTS", "17_BOARD_ROOM"  // Meeting Minutes, Agendas
    ]
  },
  "ZONE_GAMMA_FABRICATION": {
    description: "🟣 CREATIVE SANDBOX — The Workshop.",
    children: [
      "20_DEV_WORKSHOP", "21_APPRENTICE_TESTS", "22_USER_WORKSPACES",
      "23_COLD_STORAGE_ARCHIVE", "24_AI_COLLABORATION", "25_KIDS_COMMAND_CENTER"
    ]
  }
};

// Sheet tab definitions
const SHEET_TABS = {
  telemetry:    { name: "Telemetry_Logs",  headers: ["TIMESTAMP","TYPE","ACTION","CONTEXT","VOLTAGE","STATUS"] },
  spoonBank:    { name: "Spoon_Bank",      headers: ["DATE","START_SPOONS","SPENT","REMAINING","RISK_%","ACTIVITY"] },
  loveLedger:   { name: "LOVE_Ledger",     headers: ["DATE","MINER_ID","ACTION","DURATION","YIELD","PROOF_HASH"] },
  medLog:       { name: "Medication_Log",   headers: ["TIMESTAMP","MEDICATION","DOSE","NEXT_DUE","STATUS"] },
  tomographLog: { name: "Tomograph_Log",   headers: ["TIMESTAMP","SENDER","SUBJECT","VOLTAGE","ACTION","HASH"] },
  corporateLog: { name: "Corporate_Log",   headers: ["TIMESTAMP","DOCUMENT","FILING_STATUS","NEXT_ACTION","HASH"] }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RETRY WRAPPER — DEFEATS GOOGLE'S INTERMITTENT 500s
// ═══════════════════════════════════════════════════════════════════════════════

function withRetry(fn, label, maxAttempts) {
  maxAttempts = maxAttempts || 3;
  var lastError = null;
  for (var attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
      console.warn("⚠ " + label + " attempt " + attempt + "/" + maxAttempts + " failed: " + e.message);
      if (attempt < maxAttempts) Utilities.sleep(Math.pow(2, attempt) * 1000);
    }
  }
  throw new Error(label + " failed after " + maxAttempts + " attempts: " + lastError.message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT — PERSISTENT MEMORY
// ═══════════════════════════════════════════════════════════════════════════════

function getSystemState() {
  var props = PropertiesService.getScriptProperties();
  var stateJson = props.getProperty('SYSTEM_STATE');

  if (stateJson) {
    try {
      var state = JSON.parse(stateJson);
      if (!state.lastMedLog) state.lastMedLog = {};
      if (!state.activeCampaigns) state.activeCampaigns = {};
      if (typeof state.miningYieldTotal !== 'number') state.miningYieldTotal = 0;
      return state;
    } catch(e) { /* corrupt state — reinitialize */ }
  }

  var initialState = {
    xp: 0, level: 1, tasksCompleted: 0,
    lastMedCheck: null, lastEmailScan: null,
    lastMedLog: {},
    activeCampaigns: {},
    hostileEmailsBlocked: 0, documentsProcessed: 0,
    miningYieldTotal: 0,
    systemBootTime: new Date().toISOString(),
    spoons: CONFIG.DAILY_SPOONS, spoonState: "GREEN",
    alerts: [], missionLog: []
  };

  saveSystemState(initialState);
  return initialState;
}

function saveSystemState(state) {
  PropertiesService.getScriptProperties().setProperty('SYSTEM_STATE', JSON.stringify(state));
}

function awardXP(amount, reason) {
  var state = getSystemState();
  state.xp += amount;
  state.tasksCompleted++;

  var newLevel = Math.floor(state.xp / CONFIG.XP_PER_LEVEL) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    logMission("🎉 LEVEL UP! Now Level " + state.level);
  }

  logMission("+" + amount + " XP: " + reason);
  saveSystemState(state);
  return state;
}

function logMission(message) {
  var state = getSystemState();
  state.missionLog.push({ timestamp: new Date().toISOString(), message: message });
  if (state.missionLog.length > 100) state.missionLog = state.missionLog.slice(-100);
  saveSystemState(state);
  console.log("[MISSION] " + message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUNTDOWN ENGINE — P31 LABS LAUNCH
// ═══════════════════════════════════════════════════════════════════════════════

function getCountdown() {
  var now = new Date();
  var diff = CONFIG.TARGET_DATE - now;

  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, total_ms: 0, status: "PAST_DUE" };

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
    total_ms: diff,
    status: diff < 604800000 ? "CRITICAL" : "NOMINAL"
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPLOY ARCHITECTURE — PHASED WITH RETRY
// ═══════════════════════════════════════════════════════════════════════════════

function getOrCreate(parent, name) {
  return withRetry(function() {
    var folders = parent.getFoldersByName(name);
    if (folders.hasNext()) return folders.next();
    Utilities.sleep(200);
    return parent.createFolder(name);
  }, "Folder: " + name);
}

function deployArchitecture() {
  console.log("🔷 Deploying P31 LABS Architecture...");

  let root;
  let totalFolders = 0;
  const props = PropertiesService.getScriptProperties();
  const manualId = props.getProperty('ROOT_FOLDER_ID');

  if (manualId) {
    try { root = DriveApp.getFolderById(manualId); console.log(" ✓ Found Linked Root."); }
    catch (e) { console.warn(" ⚠ Manual ID invalid. Searching..."); }
  }

  if (!root) {
    const roots = DriveApp.getFoldersByName(CONFIG.ROOT_NAME);
    if (roots.hasNext()) {
      root = roots.next();
      console.log(" ✓ Found existing Root.");
    } else {
      try {
        root = DriveApp.createFolder(CONFIG.ROOT_NAME);
        console.log(" ✓ Created Root.");
      } catch (e) {
        throw new Error("❌ DRIVE ERROR: Run 'manualOverrideRoot' with a folder ID.");
      }
    }
  }

  props.setProperty('ROOT_FOLDER_ID', root.getId());

  for (const [zoneName, zoneConfig] of Object.entries(ARCHITECTURE)) {
    try {
      const existing = root.getFoldersByName(zoneName);
      let zone;
      if (existing.hasNext()) {
        zone = existing.next();
      } else {
        zone = root.createFolder(zoneName);
        console.log("   + Created Zone: " + zoneName);
        totalFolders++;
        Utilities.sleep(1500);
      }
      if (zoneConfig.children) {
        for (const childName of zoneConfig.children) {
          const existingChild = zone.getFoldersByName(childName);
          if (!existingChild.hasNext()) {
            zone.createFolder(childName);
            console.log("     - " + childName);
            totalFolders++;
            Utilities.sleep(800);
          }
        }
      }
    } catch (e) {
      console.warn("⚠ Skipped Zone " + zoneName + ": " + e.message);
    }
  }

  console.log("✓ ARCHITECTURE DEPLOYED. (" + totalFolders + " new folders)");
  return root;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPLOY SPREADSHEET
// ═══════════════════════════════════════════════════════════════════════════════

function getMasterSheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('MASTER_SHEET_ID');

  if (sheetId) {
    try { return SpreadsheetApp.openById(sheetId); }
    catch (e) { console.warn("Sheet lost, recreating..."); }
  }

  var ss = withRetry(function() {
    return SpreadsheetApp.create("P31_LABS_TELEMETRY_V7");
  }, "Create spreadsheet");

  props.setProperty('MASTER_SHEET_ID', ss.getId());
  return ss;
}

function deploySpreadsheet() {
  var ss = getMasterSheet();
  var tabKeys = Object.keys(SHEET_TABS);

  for (var i = 0; i < tabKeys.length; i++) {
    var tabDef = SHEET_TABS[tabKeys[i]];
    withRetry(function() {
      var sheet = ss.getSheetByName(tabDef.name);
      if (!sheet) sheet = ss.insertSheet(tabDef.name);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(tabDef.headers);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, tabDef.headers.length)
          .setBackground('#1a2d47').setFontColor('#c9a227').setFontWeight('bold');
      }
    }, "Tab: " + tabDef.name);
    console.log("  ✓ " + tabDef.name);
    Utilities.sleep(200);
  }

  try {
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1) ss.deleteSheet(defaultSheet);
  } catch (e) { /* ignore */ }

  var spoonSheet = ss.getSheetByName(SHEET_TABS.spoonBank.name);
  if (spoonSheet.getLastRow() <= 1) {
    spoonSheet.appendRow([new Date(), CONFIG.DAILY_SPOONS, 0, CONFIG.DAILY_SPOONS, "0%", "SYSTEM_INIT"]);
  }

  return ss;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TELEMETRY LOGGER — UNIVERSAL EVENT SINK
// ═══════════════════════════════════════════════════════════════════════════════

function logTelemetry(type, action, context, voltage) {
  try {
    var ss = getMasterSheet();
    var sheet = ss.getSheetByName(SHEET_TABS.telemetry.name);
    if (!sheet) return;
    sheet.appendRow([new Date(), type, action, String(context).substring(0, 500), voltage || "NEUTRAL", "LOGGED"]);
  } catch (e) {
    console.error("Telemetry write failed: " + e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIMPLEX PROTOCOL — MASTER IGNITION
// ═══════════════════════════════════════════════════════════════════════════════

function simplexProtocol() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║   SIMPLEX PROTOCOL v7.0 — P31 LABS, INC.                    ║");
  console.log("║   Single Fold. Four Vertices. The Mesh Holds.               ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");

  var startTime = new Date();
  var results = { folders: false, sheets: false, triggers: false, state: false };

  console.log("\n🔷 PHASE 1: Deploying Folder Architecture (501c3 Structure)...");
  try { deployArchitecture(); results.folders = true; console.log("✓ PHASE 1 COMPLETE"); }
  catch (e) { console.error("✗ PHASE 1 FAILED: " + e.message); }

  Utilities.sleep(2000);

  console.log("\n📊 PHASE 2: Deploying Spreadsheet...");
  try { var ss = deploySpreadsheet(); results.sheets = true; console.log("✓ PHASE 2 COMPLETE — " + ss.getUrl()); }
  catch (e) { console.error("✗ PHASE 2 FAILED: " + e.message); }

  Utilities.sleep(1000);

  console.log("\n🧠 PHASE 3: Initializing System State...");
  try { var state = getSystemState(); results.state = true; console.log("✓ PHASE 3 COMPLETE — Level " + state.level); }
  catch (e) { console.error("✗ PHASE 3 FAILED: " + e.message); }

  console.log("\n⏰ PHASE 4: Installing Triggers...");
  try { installTriggers(); results.triggers = true; console.log("✓ PHASE 4 COMPLETE"); }
  catch (e) { console.error("✗ PHASE 4 FAILED: " + e.message); }

  var elapsed = ((new Date() - startTime) / 1000).toFixed(2);
  var allGreen = results.folders && results.sheets && results.triggers && results.state;

  console.log("\n║ SIMPLEX " + (allGreen ? "COMPLETE ✓" : "PARTIAL ⚠") + " — " + elapsed + "s");
  if (allGreen) awardXP(500, "SIMPLEX PROTOCOL v7 COMPLETE");
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGERS
// ═══════════════════════════════════════════════════════════════════════════════

function installTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyHeartbeat').timeBased().everyDays(1).atHour(6).create();
  ScriptApp.newTrigger('tomographScan').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('checkMedications').timeBased().everyHours(6).create();
  ScriptApp.newTrigger('runMiningCycle').timeBased().everyHours(1).create();
  console.log("✓ 4 triggers installed");
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY HEARTBEAT
// ═══════════════════════════════════════════════════════════════════════════════

function dailyHeartbeat() {
  console.log("💓 DAILY HEARTBEAT");
  refillSpoons();
  checkMedications();
  tomographScan();
  var countdown = getCountdown();
  console.log("⏱ " + countdown.days + "d " + countdown.hours + "h to Launch");
  var state = getSystemState();
  sendDailyBriefing(countdown, state);
  logTelemetry("HEARTBEAT", "DAILY", "Complete", "GREEN");
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM TELEMETRY — PUBLIC API (called by dashboard)
// ═══════════════════════════════════════════════════════════════════════════════

function getSystemTelemetry() {
  var state = getSystemState();
  var countdown = getCountdown();
  return {
    operator: CONFIG.OPERATOR,
    title: CONFIG.TITLE,
    systemId: CONFIG.SYSTEM_ID,
    version: CONFIG.VERSION,
    countdown: countdown,
    state: state,
    spoons: state.spoons,
    level: state.level,
    xp: state.xp,
    medications: CONFIG.MEDICATIONS,
    phi: CONFIG.PHI,
    timestamp: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function sendNotification(subject, body) {
  try {
    var email = CONFIG.NOTIFICATION_EMAIL;
    if (email) MailApp.sendEmail({ to: email, subject: "[SIMPLEX] " + subject, htmlBody: body });
  } catch (e) { console.warn("Notification failed: " + e.message); }
}

/** Fallback MD5 hash — Security.gs overrides with SHA-256 at runtime */
function generateHash(input) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  return raw.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

function manualOverrideRoot() {
  const manualId = "REPLACE_WITH_ACTUAL_ID";
  const folder = withRetry(function() { return DriveApp.getFolderById(manualId); }, "Get Root");
  PropertiesService.getScriptProperties().setProperty('ROOT_FOLDER_ID', manualId);
  console.log("✓ Root Linked: " + folder.getName() + " → Run deployArchitecture() next.");
}
