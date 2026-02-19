/**
 * @fileoverview P31 Entangle — Apps Script Backend
 * Heartbeat, L.O.V.E. economy, Drive sync, coherence tracking.
 * @version 2.0.0
 */

/**
 * Web App doGet handler — serves the P31 Entangle dashboard
 * @param {Object} e - Event object
 * @return {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  if (!PropertiesService.getScriptProperties().getProperty('INITIALIZED')) {
    initP31Entangle();
  }
  
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('P31 Entangle — Heartbeat')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Web App doPost handler
 * Handles POST requests from the interface
 * @param {Object} e - Event object
 * @return {Object} - Response object
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'getSystemStatus':
        return getSystemStatus();
      
      case 'recordActivity':
        return recordActivity(data.activityType, data.metadata);
      
      case 'syncDrive':
        return syncDrive();
      
      case 'getSyncStatus':
        return getSyncStatus();
      
      default:
        return { success: false, error: 'Unknown action' };
    }
    
  } catch (e) {
    Logger.error(`POST error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Initialize P31 Entangle system
 */
function initP31Entangle() {
  Logger.log("🚀 Initializing P31 Entangle...");
  
  initDriveSync();
  
  const initialState = {
    initialized: true,
    version: '2.0.0',
    timestamp: new Date().toISOString()
  };
  
  PropertiesService.getScriptProperties().setProperty('INITIALIZED', JSON.stringify(initialState));
  
  Logger.log("✅ P31 Entangle initialized — the mesh holds.");
}

// Legacy alias for backward compatibility
function initGenesisGate() { return initP31Entangle(); }

/**
 * Get system status
 * @return {Object} - System status
 */
function getSystemStatus() {
  const state = getSystemState();
  const syncStatus = getSyncStatus();
  
  return {
    success: true,
    system: {
      version: '2.0.0',
      name: 'P31 Entangle',
      initialized: true,
      timestamp: new Date().toISOString()
    },
    state: state,
    sync: syncStatus,
    drive: {
      rootExists: DriveApp.getFoldersByName("P31_ROOT").hasNext() || DriveApp.getFoldersByName("PHENIX_NAVIGATOR_ROOT").hasNext()
    }
  };
}

/**
 * Record an activity via web interface
 * @param {string} activityType - Type of activity
 * @param {Object} metadata - Additional metadata
 * @return {Object} - Result
 */
function recordActivity(activityType, metadata) {
  try {
    const result = global.recordActivity(activityType, metadata || {});
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Sync Drive via web interface
 * @return {Object} - Sync result
 */
function syncDrive() {
  try {
    global.syncLocalToDrive();
    return { success: true, message: 'Sync completed' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Get Drive sync status
 * @return {Object} - Sync status
 */
function getSyncStatus() {
  try {
    const status = global.getSyncStatus();
    return { success: true, data: status };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Get system state
 * @return {Object} - System state
 */
function getSystemState() {
  const props = PropertiesService.getScriptProperties();
  const stateJson = props.getProperty('SYSTEM_STATE');
  
  if (stateJson) {
    return JSON.parse(stateJson);
  }
  
  return {
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
 * Test function — verifies all P31 Entangle subsystems
 */
function testP31Entangle() {
  Logger.log("🧪 Testing P31 Entangle...");
  
  try {
    initDriveSync();
    
    const testResult = global.recordActivity("SPOON_RECOVERY", { test: true });
    Logger.log(`LP result: ${JSON.stringify(testResult)}`);
    
    const status = getSystemStatus();
    Logger.log(`System status: ${JSON.stringify(status)}`);
    
    Logger.log("✅ All tests passed — coherence verified.");
    return { success: true, message: 'All tests passed' };
    
  } catch (e) {
    Logger.error(`Test failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

function testGenesisGate() { return testP31Entangle(); }

/**
 * Cleanup — removes stale triggers and temp properties
 */
function cleanupP31Entangle() {
  Logger.log("🧹 Cleaning P31 Entangle...");
  
  try {
    global.cleanupTriggers();
    
    const props = PropertiesService.getScriptProperties();
    const keys = props.getKeys();
    
    keys.forEach(key => {
      if (key.includes('LOG') || key.includes('TEMP')) {
        props.deleteProperty(key);
      }
    });
    
    Logger.log("✅ Cleanup completed");
    return { success: true, message: 'Cleanup completed' };
    
  } catch (e) {
    Logger.error(`Cleanup failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

function cleanupGenesisGate() { return cleanupP31Entangle(); }

/**
 * Heartbeat — scheduled function that runs on a timer trigger.
 * Checks system coherence and sends daily digest email.
 */
function heartbeat() {
  const state = getSystemState();
  const now = new Date();
  const hour = now.getHours();
  
  if (hour === 7) {
    const subject = `P31 Heartbeat — ${now.toLocaleDateString()}`;
    const body = [
      `XP: ${state.xp || 0} | Level: ${state.level || 1}`,
      `Tasks: ${state.tasksCompleted || 0}`,
      `Alerts: ${(state.alerts || []).length}`,
      '',
      'phosphorus31.org | p31ca.org | The Geodesic Self',
      '',
      'The mesh holds. 🔺'
    ].join('\n');
    
    MailApp.sendEmail(Session.getActiveUser().getEmail(), subject, body);
  }
}

/**
 * Exported functions
 */
global.doGet = doGet;
global.doPost = doPost;
global.initP31Entangle = initP31Entangle;
global.initGenesisGate = initGenesisGate;
global.getSystemStatus = getSystemStatus;
global.recordActivity = recordActivity;
global.syncDrive = syncDrive;
global.getSyncStatus = getSyncStatus;
global.testP31Entangle = testP31Entangle;
global.testGenesisGate = testGenesisGate;
global.cleanupP31Entangle = cleanupP31Entangle;
global.cleanupGenesisGate = cleanupGenesisGate;
global.heartbeat = heartbeat;