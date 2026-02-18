/**
 * @fileoverview Love Economy Engine - Core financialization of care
 * @author GENESIS_GATE Team
 * @version 1.0.0
 */

/**
 * Love Economy Configuration
 */
const LOVE_ECONOMY_CONFIG = {
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
  
  // Cryptographic
  HASH_ALGORITHM: "SHA_256"
};

/**
 * Record an activity and calculate Love Points
 * @param {string} activityType - The type of activity
 * @param {Object} metadata - Additional metadata
 * @return {Object} - Result of the recording
 */
function recordActivity(activityType, metadata = {}) {
  const activity = LOVE_ECONOMY_CONFIG.ACTIVITIES[activityType];
  if (!activity) {
    Logger.error(`Unknown activity type: ${activityType}`);
    return { success: false, error: "Unknown activity type" };
  }
  
  const state = getSystemState();
  const timestamp = new Date().toISOString();
  const nodeId = "W.JOHNSON-001";
  
  // Determine system state (Green = Coherent, Red = Entropic)
  const systemState = determineSystemState();
  const multiplier = systemState === "GREEN" ? 
    LOVE_ECONOMY_CONFIG.COHERENCE_MULTIPLIER : 
    LOVE_ECONOMY_CONFIG.SLASHING_PENALTY;
  
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
  const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, recordString)
    .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  record.hash = hash;
  
  // Write to ledger
  writeToLedger(record);
  
  // Update XP in system state
  awardXP(yieldLP, `${activity.description} (${systemState})`);
  
  // Log the mining event
  logMission(`💜 MINED ${yieldLP} LP: ${activity.description} [${systemState}]`);
  
  Logger.log(`✓ Recorded activity: ${activityType} = ${yieldLP} LP (${systemState} state)`);
  
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
 * @return {string} - System state
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
    const recentBlocks = state.hostileEmailsBlocked;
    if (recentBlocks > 5) return "RED";
  }
  
  // Default to GREEN (coherent)
  return "GREEN";
}

/**
 * Write a record to the L.O.V.E. Ledger spreadsheet
 * @param {Object} record - The record to write
 */
function writeToLedger(record) {
  try {
    const ss = getLedgerSpreadsheet();
    let ledger = ss.getSheetByName("LP_LEDGER");
    
    // Create ledger sheet if it doesn't exist
    if (!ledger) {
      ledger = ss.insertSheet("LP_LEDGER");
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
    Logger.error(`Failed to write to ledger: ${e.message}`);
  }
}

/**
 * Get the ledger spreadsheet
 * @return {GoogleAppsScript.Spreadsheet.Spreadsheet} - The ledger spreadsheet
 */
function getLedgerSpreadsheet() {
  const root = DriveApp.getFoldersByName("PHENIX_NAVIGATOR_ROOT").next();
  const beta = getOrCreateFolder(root, "ZONE_BETA_CONTROL_CENTER");
  const files = beta.getFilesByName("MISSION_CONTROL_DASHBOARD");
  
  if (!files.hasNext()) {
    throw new Error("Mission Control Dashboard not found");
  }
  
  return SpreadsheetApp.openById(files.next().getId());
}

/**
 * Get system state from PropertiesService
 * @return {Object} - System state
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
 * Save system state
 * @param {Object} state - The state to save
 */
function saveSystemState(state) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('SYSTEM_STATE', JSON.stringify(state));
}

/**
 * Award XP and check for level up
 * @param {number} amount - Amount of XP to award
 * @param {string} reason - Reason for awarding XP
 * @return {Object} - Updated state
 */
function awardXP(amount, reason) {
  const state = getSystemState();
  state.xp += amount;
  state.tasksCompleted++;
  
  // Level up check
  const newLevel = Math.floor(state.xp / 2000) + 1;
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
 * @param {string} message - The message to log
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
  Logger.log(`[MISSION LOG] ${message}`);
}

/**
 * Get medication status
 * @return {Object} - Medication status
 */
function getMedicationStatus() {
  const props = PropertiesService.getScriptProperties();
  const savedState = props.getProperty('MEDICATION_STATE');
  
  if (savedState) {
    return JSON.parse(savedState);
  }
  
  return {
    medications: [],
    lowestSupply: 0,
    criticalCount: 0,
    emergencyResources: []
  };
}

/**
 * Get or create a folder by name within a parent
 * @param {GoogleAppsScript.Drive.Folder} parent - The parent folder
 * @param {string} name - The name of the folder to get or create
 * @return {GoogleAppsScript.Drive.Folder} - The folder
 */
function getOrCreateFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

/**
 * Export functions for external access
 */
global.recordActivity = recordActivity;
global.determineSystemState = determineSystemState;
global.getSystemState = getSystemState;
global.saveSystemState = saveSystemState;
global.awardXP = awardXP;
global.logMission = logMission;
global.getMedicationStatus = getMedicationStatus;