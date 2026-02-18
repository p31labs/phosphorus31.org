/**
 * @fileoverview GENESIS_GATE Apps Script Main Entry Point
 * @author GENESIS_GATE Team
 * @version 1.0.0
 */

/**
 * Web App doGet handler
 * Serves the main GENESIS_GATE interface
 * @param {Object} e - Event object
 * @return {GoogleAppsScript.HTML.HtmlOutput} - HTML output
 */
function doGet(e) {
  // Initialize if first run
  if (!PropertiesService.getScriptProperties().getProperty('INITIALIZED')) {
    initGenesisGate();
  }
  
  // Serve the main interface
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('GENESIS_GATE - Mission Control')
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
 * Initialize GENESIS_GATE system
 */
function initGenesisGate() {
  Logger.log("🚀 Initializing GENESIS_GATE system...");
  
  // Initialize Drive sync
  initDriveSync();
  
  // Initialize system state
  const initialState = {
    initialized: true,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
  
  PropertiesService.getScriptProperties().setProperty('INITIALIZED', JSON.stringify(initialState));
  
  Logger.log("✅ GENESIS_GATE system initialized");
}

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
      version: '1.0.0',
      initialized: true,
      timestamp: new Date().toISOString()
    },
    state: state,
    sync: syncStatus,
    drive: {
      rootExists: DriveApp.getFoldersByName("PHENIX_NAVIGATOR_ROOT").hasNext()
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
 * Test function for debugging
 */
function testGenesisGate() {
  Logger.log("🧪 Testing GENESIS_GATE system...");
  
  try {
    // Test Drive sync
    initDriveSync();
    
    // Test Love Economy
    const testResult = global.recordActivity("SPOON_RECOVERY", { test: true });
    Logger.log(`Test result: ${JSON.stringify(testResult)}`);
    
    // Test system status
    const status = getSystemStatus();
    Logger.log(`System status: ${JSON.stringify(status)}`);
    
    Logger.log("✅ All tests passed");
    return { success: true, message: 'All tests passed' };
    
  } catch (e) {
    Logger.error(`Test failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Cleanup function for maintenance
 */
function cleanupGenesisGate() {
  Logger.log("🧹 Cleaning up GENESIS_GATE system...");
  
  try {
    // Clean up old triggers
    global.cleanupTriggers();
    
    // Clean up old properties (keep last 30 days)
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

/**
 * Export functions for external access
 */
global.doGet = doGet;
global.doPost = doPost;
global.initGenesisGate = initGenesisGate;
global.getSystemStatus = getSystemStatus;
global.recordActivity = recordActivity;
global.syncDrive = syncDrive;
global.getSyncStatus = getSyncStatus;
global.testGenesisGate = testGenesisGate;
global.cleanupGenesisGate = cleanupGenesisGate;