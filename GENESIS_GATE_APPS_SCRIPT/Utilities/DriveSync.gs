/**
 * @fileoverview Drive Synchronization Utility
 * @author GENESIS_GATE Team
 * @version 1.0.0
 */

/**
 * Drive Sync Configuration
 */
const DRIVE_SYNC_CONFIG = {
  // Local GENESIS_GATE structure
  LOCAL_STRUCTURE: [
    'core', 'mesh', 'world', 'cortex', 'agent', 'bridge', 'ui', 
    'firmware', 'hardware', 'docs'
  ],
  
  // Drive folder structure
  DRIVE_ROOT_NAME: "PHENIX_NAVIGATOR_ROOT",
  DRIVE_ZONES: {
    ALPHA: "ZONE_ALPHA_BACKBONE",
    BETA: "ZONE_BETA_CONTROL_CENTER", 
    GAMMA: "ZONE_GAMMA_FABRICATION"
  },
  
  // Sync settings
  SYNC_INTERVAL_MS: 15 * 60 * 1000, // 15 minutes
  BATCH_SIZE: 50,
  
  // File types to sync
  SYNC_FILE_TYPES: [
    MimeType.GOOGLE_APPS_SCRIPT,
    MimeType.GOOGLE_DOCUMENTS,
    MimeType.GOOGLE_SHEETS,
    MimeType.GOOGLE_SLIDES,
    MimeType.PLAIN_TEXT,
    MimeType.MICROSOFT_WORD,
    MimeType.MICROSOFT_EXCEL,
    MimeType.MICROSOFT_POWERPOINT
  ]
};

/**
 * Initialize Drive synchronization
 */
function initDriveSync() {
  Logger.log("🚀 Initializing Drive Synchronization...");
  
  // Create Drive structure if it doesn't exist
  createDriveStructure();
  
  // Set up sync triggers
  setupSyncTriggers();
  
  Logger.log("✅ Drive Synchronization initialized");
}

/**
 * Create the Drive folder structure to mirror local GENESIS_GATE
 */
function createDriveStructure() {
  const root = getOrCreateFolder(DriveApp.getRootFolder(), DRIVE_SYNC_CONFIG.DRIVE_ROOT_NAME);
  
  // Create zones
  const alpha = getOrCreateFolder(root, DRIVE_SYNC_CONFIG.DRIVE_ZONES.ALPHA);
  const beta = getOrCreateFolder(root, DRIVE_SYNC_CONFIG.DRIVE_ZONES.BETA);
  const gamma = getOrCreateFolder(root, DRIVE_SYNC_CONFIG.DRIVE_ZONES.GAMMA);
  
  // Create module folders in appropriate zones
  // Alpha: Immutable truth/archives
  const alphaModules = ['core', 'docs'];
  alphaModules.forEach(module => getOrCreateFolder(alpha, module));
  
  // Beta: Live operations
  const betaModules = ['mesh', 'agent', 'bridge'];
  betaModules.forEach(module => getOrCreateFolder(beta, module));
  
  // Gamma: Creative sandbox
  const gammaModules = ['world', 'cortex', 'ui', 'firmware', 'hardware'];
  gammaModules.forEach(module => getOrCreateFolder(gamma, module));
  
  Logger.log("📁 Drive structure created");
}

/**
 * Set up automated sync triggers
 */
function setupSyncTriggers() {
  // Clear existing triggers
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'syncLocalToDrive') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger for periodic sync
  ScriptApp.newTrigger('syncLocalToDrive')
    .timeBased()
    .everyMinutes(15)
    .create();
  
  Logger.log("⏰ Sync triggers configured");
}

/**
 * Sync local GENESIS_GATE structure to Google Drive
 */
function syncLocalToDrive() {
  Logger.log("🔄 Starting local to Drive sync...");
  
  const startTime = new Date();
  let filesSynced = 0;
  let errors = 0;
  
  try {
    const root = DriveApp.getFoldersByName(DRIVE_SYNC_CONFIG.DRIVE_ROOT_NAME).next();
    
    // Sync each module
    DRIVE_SYNC_CONFIG.LOCAL_STRUCTURE.forEach(module => {
      try {
        const moduleResult = syncModule(module, root);
        filesSynced += moduleResult.filesSynced;
        errors += moduleResult.errors;
      } catch (e) {
        Logger.error(`Error syncing module ${module}: ${e.message}`);
        errors++;
      }
    });
    
    const duration = (new Date() - startTime) / 1000;
    Logger.log(`✅ Sync completed: ${filesSynced} files, ${errors} errors in ${duration}s`);
    
    // Send summary email if there were errors
    if (errors > 0) {
      sendSyncSummary(filesSynced, errors, duration);
    }
    
  } catch (e) {
    Logger.error(`Sync failed: ${e.message}`);
    sendSyncErrorAlert(e);
  }
}

/**
 * Sync a specific module
 * @param {string} moduleName - Name of the module to sync
 * @param {GoogleAppsScript.Drive.Folder} root - Root Drive folder
 * @return {Object} - Sync results
 */
function syncModule(moduleName, root) {
  let filesSynced = 0;
  let errors = 0;
  
  try {
    // Determine which zone this module belongs to
    const zone = getModuleZone(moduleName);
    const zoneFolder = getOrCreateFolder(root, zone);
    const moduleFolder = getOrCreateFolder(zoneFolder, moduleName);
    
    // Get local files (simulated - in real implementation, this would read from local filesystem)
    const localFiles = getLocalModuleFiles(moduleName);
    
    // Sync each file
    localFiles.forEach(fileData => {
      try {
        syncFile(fileData, moduleFolder);
        filesSynced++;
      } catch (e) {
        Logger.error(`Error syncing file ${fileData.name}: ${e.message}`);
        errors++;
      }
    });
    
  } catch (e) {
    Logger.error(`Error syncing module ${moduleName}: ${e.message}`);
    errors++;
  }
  
  return { filesSynced, errors };
}

/**
 * Determine which zone a module belongs to
 * @param {string} moduleName - Name of the module
 * @return {string} - Zone name
 */
function getModuleZone(moduleName) {
  const alphaModules = ['core', 'docs'];
  const betaModules = ['mesh', 'agent', 'bridge'];
  const gammaModules = ['world', 'cortex', 'ui', 'firmware', 'hardware'];
  
  if (alphaModules.includes(moduleName)) return DRIVE_SYNC_CONFIG.DRIVE_ZONES.ALPHA;
  if (betaModules.includes(moduleName)) return DRIVE_SYNC_CONFIG.DRIVE_ZONES.BETA;
  if (gammaModules.includes(moduleName)) return DRIVE_SYNC_CONFIG.DRIVE_ZONES.GAMMA;
  
  return DRIVE_SYNC_CONFIG.DRIVE_ZONES.GAMMA; // Default to Gamma
}

/**
 * Get local module files (placeholder - would integrate with local file system)
 * @param {string} moduleName - Name of the module
 * @return {Array} - Array of file data
 */
function getLocalModuleFiles(moduleName) {
  // This is a placeholder. In a real implementation, this would:
  // 1. Read from the local GENESIS_GATE directory
  // 2. Use Drive API to upload files
  // 3. Maintain file metadata and versioning
  
  Logger.log(`📁 Getting files for module: ${moduleName}`);
  
  // Return mock file data for now
  return [
    { name: `${moduleName}.ts`, content: `// ${moduleName} module`, type: MimeType.PLAIN_TEXT },
    { name: `README.md`, content: `# ${moduleName} Module`, type: MimeType.PLAIN_TEXT }
  ];
}

/**
 * Sync a single file to Drive
 * @param {Object} fileData - File data object
 * @param {GoogleAppsScript.Drive.Folder} targetFolder - Target folder
 */
function syncFile(fileData, targetFolder) {
  // Check if file already exists
  const existingFiles = targetFolder.getFilesByName(fileData.name);
  
  if (existingFiles.hasNext()) {
    // Update existing file
    const file = existingFiles.next();
    if (fileData.type === MimeType.PLAIN_TEXT) {
      file.setContent(fileData.content);
    }
    Logger.log(`📝 Updated file: ${fileData.name}`);
  } else {
    // Create new file
    let file;
    if (fileData.type === MimeType.PLAIN_TEXT) {
      file = targetFolder.createFile(fileData.name, fileData.content, MimeType.PLAIN_TEXT);
    } else {
      file = targetFolder.createFile(fileData.name, fileData.content);
    }
    Logger.log(`➕ Created file: ${fileData.name}`);
  }
}

/**
 * Send sync summary email
 * @param {number} filesSynced - Number of files synced
 * @param {number} errors - Number of errors
 * @param {number} duration - Duration in seconds
 */
function sendSyncSummary(filesSynced, errors, duration) {
  const email = Session.getActiveUser().getEmail();
  const subject = `GENESIS_GATE Sync Summary - ${new Date().toLocaleString()}`;
  const body = `
GENESIS_GATE Drive Synchronization Summary

Files Synced: ${filesSynced}
Errors: ${errors}
Duration: ${duration.toFixed(2)} seconds
Timestamp: ${new Date().toISOString()}

${errors > 0 ? '⚠️ Some files failed to sync. Check the logs for details.' : '✅ All files synced successfully.'}

---
This is an automated message from GENESIS_GATE Apps Script.
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}

/**
 * Send sync error alert
 * @param {Error} error - The error that occurred
 */
function sendSyncErrorAlert(error) {
  const email = Session.getActiveUser().getEmail();
  const subject = `🚨 GENESIS_GATE Sync Error - ${new Date().toLocaleString()}`;
  const body = `
GENESIS_GATE Drive Synchronization Error

Error: ${error.message}
Stack: ${error.stack}
Timestamp: ${new Date().toISOString()}

Please check the Apps Script logs for more details.

---
This is an automated alert from GENESIS_GATE Apps Script.
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body
  });
}

/**
 * Manual sync trigger function
 */
function manualSync() {
  Logger.log("🔄 Manual sync triggered...");
  syncLocalToDrive();
}

/**
 * Get sync status
 * @return {Object} - Sync status information
 */
function getSyncStatus() {
  const root = DriveApp.getFoldersByName(DRIVE_SYNC_CONFIG.DRIVE_ROOT_NAME);
  const hasRoot = root.hasNext();
  
  const triggers = ScriptApp.getProjectTriggers().filter(t => 
    t.getHandlerFunction() === 'syncLocalToDrive'
  );
  
  return {
    driveStructureExists: hasRoot,
    syncTriggersActive: triggers.length > 0,
    lastSyncTime: getLastSyncTime(),
    nextSyncTime: getNextSyncTime(triggers)
  };
}

/**
 * Get last sync time from properties
 * @return {string} - Last sync timestamp
 */
function getLastSyncTime() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty('LAST_SYNC_TIME') || 'Never';
}

/**
 * Get next sync time
 * @param {Array} triggers - Array of sync triggers
 * @return {string} - Next sync timestamp
 */
function getNextSyncTime(triggers) {
  if (triggers.length === 0) return 'No triggers configured';
  
  // Calculate next trigger time (simplified)
  const nextTime = new Date(Date.now() + DRIVE_SYNC_CONFIG.SYNC_INTERVAL_MS);
  return nextTime.toISOString();
}

/**
 * Clean up old sync triggers
 */
function cleanupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'syncLocalToDrive') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  });
  
  Logger.log(`🧹 Cleaned up ${removed} old sync triggers`);
}

/**
 * Export functions for external access
 */
global.initDriveSync = initDriveSync;
global.syncLocalToDrive = syncLocalToDrive;
global.manualSync = manualSync;
global.getSyncStatus = getSyncStatus;
global.cleanupTriggers = cleanupTriggers;