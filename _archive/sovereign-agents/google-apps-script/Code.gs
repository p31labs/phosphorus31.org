/**
 * Digital Centaur Agent Team - Google Apps Script
 * Main application entry point and API handlers
 */

// Global configuration
const CONFIG = {
  APP_NAME: 'Digital Centaur Agent Team',
  VERSION: '1.0.0',
  BASE_FOLDER_NAME: 'GENESIS_GATE_ORGANIZED',
  CONFIG_SHEET_NAME: 'AgentConfig',
  LOG_SHEET_NAME: 'AgentLogs',
  METRICS_SHEET_NAME: 'AgentMetrics'
};

/**
 * Entry point for the web app
 */
function doGet(e) {
  return showDashboard();
}

/**
 * Show the main dashboard
 */
function showDashboard() {
  const template = HtmlService.createTemplateFromFile('dashboard');
  template.config = getGlobalConfig();
  template.agents = getAgentStatus();
  return template.evaluate()
    .setTitle('Digital Centaur Agent Team')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * API endpoint for agent status
 */
function getAgentStatus() {
  try {
    const agents = [
      {
        id: 'ingestion',
        name: 'Ingestion Agent (Gatekeeper)',
        status: 'active',
        target: 'Downloads',
        lastRun: getLastRunTime('ingestion'),
        filesProcessed: getFilesProcessed('ingestion'),
        errors: getErrorCount('ingestion'),
        enabled: true
      },
      {
        id: 'project',
        name: 'Project Agent (Archivist)',
        status: 'active',
        target: 'Projects',
        lastRun: getLastRunTime('project'),
        filesProcessed: getFilesProcessed('project'),
        errors: getErrorCount('project'),
        enabled: true
      },
      {
        id: 'personal',
        name: 'Personal Agent (Guardian)',
        status: 'active',
        target: 'Personal',
        lastRun: getLastRunTime('personal'),
        filesProcessed: getFilesProcessed('personal'),
        errors: getErrorCount('personal'),
        enabled: true
      },
      {
        id: 'knowledge',
        name: 'Knowledge Agent (Weaver)',
        status: 'active',
        target: 'Knowledge',
        lastRun: getLastRunTime('knowledge'),
        filesProcessed: getFilesProcessed('knowledge'),
        errors: getErrorCount('knowledge'),
        enabled: true
      }
    ];
    
    return agents;
  } catch (error) {
    Logger.log('Error getting agent status: ' + error);
    return [];
  }
}

/**
 * API endpoint for agent configuration
 */
function getAgentConfig(agentId) {
  try {
    const config = getGlobalConfig();
    return config.agents[agentId] || getDefaultAgentConfig(agentId);
  } catch (error) {
    Logger.log('Error getting agent config: ' + error);
    return getDefaultAgentConfig(agentId);
  }
}

/**
 * Update agent configuration
 */
function updateAgentConfig(agentId, config) {
  try {
    const globalConfig = getGlobalConfig();
    globalConfig.agents[agentId] = config;
    saveGlobalConfig(globalConfig);
    
    // Log the configuration change
    logEvent('CONFIG_UPDATE', {
      agentId: agentId,
      config: JSON.stringify(config)
    });
    
    return { success: true, message: 'Configuration updated successfully' };
  } catch (error) {
    Logger.log('Error updating agent config: ' + error);
    return { success: false, message: 'Failed to update configuration' };
  }
}

/**
 * Start an agent
 */
function startAgent(agentId) {
  try {
    const agent = getAgentById(agentId);
    if (!agent) {
      return { success: false, message: 'Agent not found' };
    }
    
    // Set agent as running
    setAgentStatus(agentId, 'running');
    
    // Execute the agent (this would call your local agent)
    const result = executeAgent(agentId);
    
    // Update status
    setAgentStatus(agentId, result.success ? 'completed' : 'error');
    
    // Log the execution
    logEvent('AGENT_EXECUTION', {
      agentId: agentId,
      success: result.success,
      filesProcessed: result.filesProcessed,
      duration: result.duration
    });
    
    return result;
  } catch (error) {
    Logger.log('Error starting agent: ' + error);
    setAgentStatus(agentId, 'error');
    return { success: false, message: 'Failed to start agent' };
  }
}

/**
 * Stop an agent
 */
function stopAgent(agentId) {
  try {
    setAgentStatus(agentId, 'stopped');
    
    // Log the stop event
    logEvent('AGENT_STOP', {
      agentId: agentId
    });
    
    return { success: true, message: 'Agent stopped successfully' };
  } catch (error) {
    Logger.log('Error stopping agent: ' + error);
    return { success: false, message: 'Failed to stop agent' };
  }
}

/**
 * Get agent logs
 */
function getAgentLogs(agentId, limit = 100) {
  try {
    const sheet = getLogSheet();
    const data = sheet.getDataRange().getValues();
    
    // Filter logs for the specific agent
    const agentLogs = data.filter(row => row[1] === agentId)
      .slice(-limit)
      .reverse();
    
    return agentLogs.map(row => ({
      timestamp: row[0],
      agentId: row[1],
      eventType: row[2],
      details: row[3],
      success: row[4]
    }));
  } catch (error) {
    Logger.log('Error getting agent logs: ' + error);
    return [];
  }
}

/**
 * Get performance metrics
 */
function getPerformanceMetrics(agentId) {
  try {
    const sheet = getMetricsSheet();
    const data = sheet.getDataRange().getValues();
    
    // Filter metrics for the specific agent
    const agentMetrics = data.filter(row => row[1] === agentId);
    
    // Calculate summary statistics
    const totalRuns = agentMetrics.length;
    const successfulRuns = agentMetrics.filter(row => row[4] === true).length;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;
    
    // Calculate average processing time
    const avgProcessingTime = agentMetrics.reduce((sum, row) => sum + (row[5] || 0), 0) / totalRuns;
    
    return {
      agentId: agentId,
      totalRuns: totalRuns,
      successfulRuns: successfulRuns,
      successRate: Math.round(successRate * 100) / 100,
      avgProcessingTime: Math.round(avgProcessingTime),
      lastRun: agentMetrics.length > 0 ? agentMetrics[agentMetrics.length - 1][0] : null
    };
  } catch (error) {
    Logger.log('Error getting performance metrics: ' + error);
    return null;
  }
}

/**
 * Execute a local agent via webhook or API
 */
function executeAgent(agentId) {
  try {
    const agent = getAgentById(agentId);
    const startTime = new Date();
    
    // This would typically call your local agent via HTTP
    // For now, we'll simulate the execution
    const result = simulateAgentExecution(agentId);
    
    const duration = new Date() - startTime;
    
    return {
      success: result.success,
      filesProcessed: result.filesProcessed,
      duration: duration,
      message: result.message
    };
  } catch (error) {
    Logger.log('Error executing agent: ' + error);
    return {
      success: false,
      filesProcessed: 0,
      duration: 0,
      message: 'Execution failed'
    };
  }
}

/**
 * Simulate agent execution (for demonstration)
 */
function simulateAgentExecution(agentId) {
  // Simulate different processing times and results based on agent type
  const agentTypes = {
    'ingestion': { baseTime: 2000, successRate: 0.95, fileRange: [10, 50] },
    'project': { baseTime: 5000, successRate: 0.98, fileRange: [5, 20] },
    'personal': { baseTime: 3000, successRate: 0.99, fileRange: [1, 10] },
    'knowledge': { baseTime: 8000, successRate: 0.90, fileRange: [20, 100] }
  };
  
  const config = agentTypes[agentId] || agentTypes.ingestion;
  
  // Simulate processing time
  const processingTime = config.baseTime + Math.random() * 3000;
  Utilities.sleep(processingTime);
  
  // Simulate success/failure
  const success = Math.random() < config.successRate;
  
  // Simulate files processed
  const filesProcessed = Math.floor(Math.random() * (config.fileRange[1] - config.fileRange[0] + 1)) + config.fileRange[0];
  
  return {
    success: success,
    filesProcessed: success ? filesProcessed : 0,
    message: success ? `Processed ${filesProcessed} files successfully` : 'Agent execution failed'
  };
}

/**
 * Get global configuration from Properties Service
 */
function getGlobalConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const configJson = scriptProperties.getProperty('GLOBAL_CONFIG');
  
  if (configJson) {
    return JSON.parse(configJson);
  }
  
  // Return default configuration
  const defaultConfig = {
    agents: {
      ingestion: getDefaultAgentConfig('ingestion'),
      project: getDefaultAgentConfig('project'),
      personal: getDefaultAgentConfig('personal'),
      knowledge: getDefaultAgentConfig('knowledge')
    },
    notifications: {
      enabled: true,
      email: Session.getActiveUser().getEmail(),
      dailyReports: true,
      errorAlerts: true
    },
    drive: {
      baseFolder: CONFIG.BASE_FOLDER_NAME,
      syncMode: 'mirror',
      compressionEnabled: true
    }
  };
  
  saveGlobalConfig(defaultConfig);
  return defaultConfig;
}

/**
 * Save global configuration
 */
function saveGlobalConfig(config) {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('GLOBAL_CONFIG', JSON.stringify(config));
}

/**
 * Get default agent configuration
 */
function getDefaultAgentConfig(agentId) {
  const baseConfig = {
    enabled: true,
    scanInterval: 3600, // 1 hour
    targetDirectory: '',
    driveSync: {
      enabled: true,
      targetFolder: agentId,
      syncMode: 'mirror'
    },
    notifications: {
      enabled: true,
      email: Session.getActiveUser().getEmail(),
      frequency: 'daily'
    },
    scrubbing: {
      enabled: true,
      mode: 'mask',
      customPatterns: {}
    },
    organization: {
      enabled: true,
      namingTemplate: '{date}_{category}_{keywords}{ext}',
      categoryPaths: {}
    }
  };
  
  switch (agentId) {
    case 'ingestion':
      return {
        ...baseConfig,
        targetDirectory: 'Downloads',
        scanInterval: 1800, // 30 minutes
        driveSync: { ...baseConfig.driveSync, targetFolder: 'Downloads' }
      };
    case 'project':
      return {
        ...baseConfig,
        targetDirectory: 'Projects',
        scanInterval: 7200, // 2 hours
        driveSync: { ...baseConfig.driveSync, targetFolder: 'Projects' }
      };
    case 'personal':
      return {
        ...baseConfig,
        targetDirectory: 'Personal',
        scanInterval: 14400, // 4 hours
        driveSync: { ...baseConfig.driveSync, targetFolder: 'Personal' },
        scrubbing: { ...baseConfig.scrubbing, mode: 'remove' }
      };
    case 'knowledge':
      return {
        ...baseConfig,
        targetDirectory: 'Knowledge',
        scanInterval: 3600, // 1 hour
        driveSync: { ...baseConfig.driveSync, targetFolder: 'Knowledge' },
        organization: { ...baseConfig.organization, enabled: false }
      };
    default:
      return baseConfig;
  }
}

/**
 * Get agent by ID
 */
function getAgentById(agentId) {
  const agents = getAgentStatus();
  return agents.find(agent => agent.id === agentId);
}

/**
 * Set agent status
 */
function setAgentStatus(agentId, status) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `AGENT_STATUS_${agentId}`;
  scriptProperties.setProperty(key, status);
}

/**
 * Get agent status
 */
function getAgentStatusById(agentId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `AGENT_STATUS_${agentId}`;
  return scriptProperties.getProperty(key) || 'stopped';
}

/**
 * Get last run time for an agent
 */
function getLastRunTime(agentId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `LAST_RUN_${agentId}`;
  const timestamp = scriptProperties.getProperty(key);
  return timestamp ? new Date(parseInt(timestamp)) : null;
}

/**
 * Set last run time for an agent
 */
function setLastRunTime(agentId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `LAST_RUN_${agentId}`;
  scriptProperties.setProperty(key, Date.now().toString());
}

/**
 * Get files processed count for an agent
 */
function getFilesProcessed(agentId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `FILES_PROCESSED_${agentId}`;
  return parseInt(scriptProperties.getProperty(key) || '0');
}

/**
 * Set files processed count for an agent
 */
function setFilesProcessed(agentId, count) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `FILES_PROCESSED_${agentId}`;
  scriptProperties.setProperty(key, count.toString());
}

/**
 * Get error count for an agent
 */
function getErrorCount(agentId) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `ERROR_COUNT_${agentId}`;
  return parseInt(scriptProperties.getProperty(key) || '0');
}

/**
 * Set error count for an agent
 */
function setErrorCount(agentId, count) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const key = `ERROR_COUNT_${agentId}`;
  scriptProperties.setProperty(key, count.toString());
}

/**
 * Log an event to the logs sheet
 */
function logEvent(eventType, details) {
  try {
    const sheet = getLogSheet();
    const timestamp = new Date();
    const userEmail = Session.getActiveUser().getEmail();
    
    sheet.appendRow([
      timestamp,
      'webapp', // agentId
      eventType,
      JSON.stringify(details),
      true // success
    ]);
  } catch (error) {
    Logger.log('Error logging event: ' + error);
  }
}

/**
 * Get the logs sheet
 */
function getLogSheet() {
  return getSheet(CONFIG.LOG_SHEET_NAME);
}

/**
 * Get the metrics sheet
 */
function getMetricsSheet() {
  return getSheet(CONFIG.METRICS_SHEET_NAME);
}

/**
 * Get a sheet by name, creating it if necessary
 */
function getSheet(sheetName) {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    
    // Add headers based on sheet type
    if (sheetName === CONFIG.LOG_SHEET_NAME) {
      sheet.appendRow(['Timestamp', 'Agent ID', 'Event Type', 'Details', 'Success']);
    } else if (sheetName === CONFIG.METRICS_SHEET_NAME) {
      sheet.appendRow(['Timestamp', 'Agent ID', 'Files Processed', 'Duration (ms)', 'Success', 'Avg Processing Time']);
    } else if (sheetName === CONFIG.CONFIG_SHEET_NAME) {
      sheet.appendRow(['Agent ID', 'Configuration', 'Last Updated']);
    }
  }
  
  return sheet;
}

/**
 * Get the main spreadsheet
 */
function getSpreadsheet() {
  const folder = getOrCreateFolder();
  const files = folder.getFilesByName('Digital Centaur Agent Team Logs');
  
  let spreadsheet;
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    const file = folder.createFile('Digital Centaur Agent Team Logs', '', MimeType.GOOGLE_SHEETS);
    spreadsheet = SpreadsheetApp.open(file);
  }
  
  return spreadsheet;
}

/**
 * Get or create the base folder in Google Drive
 */
function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.BASE_FOLDER_NAME);
  let folder;
  
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(CONFIG.BASE_FOLDER_NAME);
    folder.setDescription('Base folder for Digital Centaur Agent Team');
  }
  
  return folder;
}

/**
 * Send notification email
 */
function sendNotification(subject, body, recipient) {
  try {
    GmailApp.sendEmail(recipient || Session.getActiveUser().getEmail(), subject, body, {
      htmlBody: body
    });
  } catch (error) {
    Logger.log('Error sending notification: ' + error);
  }
}

/**
 * Generate daily report
 */
function generateDailyReport() {
  const agents = getAgentStatus();
  const metrics = agents.map(agent => getPerformanceMetrics(agent.id));
  
  const htmlBody = HtmlService.createTemplateFromFile('reports')
    .evaluate()
    .getContent();
  
  sendNotification(
    'Daily Agent Report',
    htmlBody,
    Session.getActiveUser().getEmail()
  );
}

/**
 * Installable trigger for daily reports
 */
function setupDailyReport() {
  // Remove existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'generateDailyReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new daily trigger
  ScriptApp.newTrigger('generateDailyReport')
    .timeBased()
    .atHour(9) // 9 AM
    .everyDays(1)
    .create();
}

/**
 * Cleanup old logs (keep last 30 days)
 */
function cleanupOldLogs() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  
  const sheet = getLogSheet();
  const data = sheet.getDataRange().getValues();
  
  // Find rows older than cutoff date
  const rowsToDelete = [];
  for (let i = data.length - 1; i >= 1; i--) { // Skip header row
    const timestamp = new Date(data[i][0]);
    if (timestamp < cutoffDate) {
      rowsToDelete.push(i + 1); // +1 for 1-based indexing
    }
  }
  
  // Delete rows (from bottom to top to avoid index shifting)
  rowsToDelete.reverse().forEach(row => {
    sheet.deleteRow(row);
  });
}

/**
 * Reset all agent statistics
 */
function resetAgentStats() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const keys = scriptProperties.getKeys();
  
  keys.forEach(key => {
    if (key.includes('FILES_PROCESSED_') || 
        key.includes('ERROR_COUNT_') || 
        key.includes('LAST_RUN_') ||
        key.includes('AGENT_STATUS_')) {
      scriptProperties.deleteProperty(key);
    }
  });
  
  // Clear sheets
  const logSheet = getLogSheet();
  const metricsSheet = getMetricsSheet();
  
  logSheet.clearContents();
  metricsSheet.clearContents();
  
  // Re-add headers
  logSheet.appendRow(['Timestamp', 'Agent ID', 'Event Type', 'Details', 'Success']);
  metricsSheet.appendRow(['Timestamp', 'Agent ID', 'Files Processed', 'Duration (ms)', 'Success', 'Avg Processing Time']);
}

/**
 * Web app endpoint for external API calls
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    switch (action) {
      case 'get_status':
        return ContentService.createTextOutput(JSON.stringify(getAgentStatus()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'start_agent':
        return ContentService.createTextOutput(JSON.stringify(startAgent(params.agentId)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'stop_agent':
        return ContentService.createTextOutput(JSON.stringify(stopAgent(params.agentId)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'get_logs':
        return ContentService.createTextOutput(JSON.stringify(getAgentLogs(params.agentId, params.limit)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'get_metrics':
        return ContentService.createTextOutput(JSON.stringify(getPerformanceMetrics(params.agentId)))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Initialize the application
 */
function initializeApp() {
  // Create necessary folders and sheets
  getOrCreateFolder();
  getLogSheet();
  getMetricsSheet();
  
  // Setup daily report trigger
  setupDailyReport();
  
  // Log initialization
  logEvent('APP_INITIALIZED', {
    version: CONFIG.VERSION,
    timestamp: new Date().toISOString()
  });
}

/**
 * Reset the application to initial state
 */
function resetApp() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteAllProperties();
  
  const folder = getOrCreateFolder();
  const files = folder.getFiles();
  
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName() !== CONFIG.BASE_FOLDER_NAME) {
      file.setTrashed(true);
    }
  }
  
  resetAgentStats();
  initializeApp();
}