/**
 * Digital Centaur Agent Team - Google Apps Script
 * Persistent state management system
 */

/**
 * State management service for tracking agent state and metrics
 */
var StateManager = (function() {
  'use strict';

  const STATE_KEYS = {
    AGENT_STATUS_PREFIX: 'AGENT_STATUS_',
    LAST_RUN_PREFIX: 'LAST_RUN_',
    FILES_PROCESSED_PREFIX: 'FILES_PROCESSED_',
    ERROR_COUNT_PREFIX: 'ERROR_COUNT_',
    METRICS_PREFIX: 'METRICS_',
    SYSTEM_STATE: 'SYSTEM_STATE',
    AGENT_STATS_PREFIX: 'AGENT_STATS_'
  };

  /**
   * Get agent status
   */
  function getAgentStatus(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.AGENT_STATUS_PREFIX + agentId;
    return scriptProperties.getProperty(key) || 'stopped';
  }

  /**
   * Set agent status
   */
  function setAgentStatus(agentId, status) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.AGENT_STATUS_PREFIX + agentId;
    scriptProperties.setProperty(key, status);
  }

  /**
   * Get last run time for an agent
   */
  function getLastRunTime(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.LAST_RUN_PREFIX + agentId;
    const timestamp = scriptProperties.getProperty(key);
    return timestamp ? new Date(parseInt(timestamp)) : null;
  }

  /**
   * Set last run time for an agent
   */
  function setLastRunTime(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.LAST_RUN_PREFIX + agentId;
    scriptProperties.setProperty(key, Date.now().toString());
  }

  /**
   * Get files processed count for an agent
   */
  function getFilesProcessed(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.FILES_PROCESSED_PREFIX + agentId;
    return parseInt(scriptProperties.getProperty(key) || '0');
  }

  /**
   * Set files processed count for an agent
   */
  function setFilesProcessed(agentId, count) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.FILES_PROCESSED_PREFIX + agentId;
    scriptProperties.setProperty(key, count.toString());
  }

  /**
   * Increment files processed count for an agent
   */
  function incrementFilesProcessed(agentId, increment = 1) {
    const currentCount = getFilesProcessed(agentId);
    const newCount = currentCount + increment;
    setFilesProcessed(agentId, newCount);
    return newCount;
  }

  /**
   * Get error count for an agent
   */
  function getErrorCount(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.ERROR_COUNT_PREFIX + agentId;
    return parseInt(scriptProperties.getProperty(key) || '0');
  }

  /**
   * Set error count for an agent
   */
  function setErrorCount(agentId, count) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.ERROR_COUNT_PREFIX + agentId;
    scriptProperties.setProperty(key, count.toString());
  }

  /**
   * Increment error count for an agent
   */
  function incrementErrorCount(agentId, increment = 1) {
    const currentCount = getErrorCount(agentId);
    const newCount = currentCount + increment;
    setErrorCount(agentId, newCount);
    return newCount;
  }

  /**
   * Get agent metrics
   */
  function getAgentMetrics(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.METRICS_PREFIX + agentId;
    const metricsJson = scriptProperties.getProperty(key);
    
    if (metricsJson) {
      return JSON.parse(metricsJson);
    }
    
    // Return default metrics
    const defaultMetrics = createDefaultMetrics(agentId);
    saveAgentMetrics(agentId, defaultMetrics);
    return defaultMetrics;
  }

  /**
   * Save agent metrics
   */
  function saveAgentMetrics(agentId, metrics) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.METRICS_PREFIX + agentId;
    scriptProperties.setProperty(key, JSON.stringify(metrics));
  }

  /**
   * Update agent metrics
   */
  function updateAgentMetrics(agentId, updates) {
    const currentMetrics = getAgentMetrics(agentId);
    const updatedMetrics = {
      ...currentMetrics,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    saveAgentMetrics(agentId, updatedMetrics);
    return updatedMetrics;
  }

  /**
   * Get system state
   */
  function getSystemState() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const stateJson = scriptProperties.getProperty(STATE_KEYS.SYSTEM_STATE);
    
    if (stateJson) {
      return JSON.parse(stateJson);
    }
    
    // Return default system state
    const defaultState = createDefaultSystemState();
    saveSystemState(defaultState);
    return defaultState;
  }

  /**
   * Save system state
   */
  function saveSystemState(state) {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(STATE_KEYS.SYSTEM_STATE, JSON.stringify(state));
  }

  /**
   * Update system state
   */
  function updateSystemState(updates) {
    const currentState = getSystemState();
    const updatedState = {
      ...currentState,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    saveSystemState(updatedState);
    return updatedState;
  }

  /**
   * Get agent statistics
   */
  function getAgentStatistics(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.AGENT_STATS_PREFIX + agentId;
    const statsJson = scriptProperties.getProperty(key);
    
    if (statsJson) {
      return JSON.parse(statsJson);
    }
    
    // Return default statistics
    const defaultStats = createDefaultStatistics(agentId);
    saveAgentStatistics(agentId, defaultStats);
    return defaultStats;
  }

  /**
   * Save agent statistics
   */
  function saveAgentStatistics(agentId, statistics) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = STATE_KEYS.AGENT_STATS_PREFIX + agentId;
    scriptProperties.setProperty(key, JSON.stringify(statistics));
  }

  /**
   * Update agent statistics
   */
  function updateAgentStatistics(agentId, updates) {
    const currentStats = getAgentStatistics(agentId);
    const updatedStats = {
      ...currentStats,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    saveAgentStatistics(agentId, updatedStats);
    return updatedStats;
  }

  /**
   * Create default metrics
   */
  function createDefaultMetrics(agentId) {
    return {
      agentId: agentId,
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      avgProcessingTime: 0,
      maxProcessingTime: 0,
      minProcessingTime: 0,
      totalFilesProcessed: 0,
      totalErrors: 0,
      successRate: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Create default system state
   */
  function createDefaultSystemState() {
    return {
      systemStatus: 'running',
      lastHeartbeat: new Date().toISOString(),
      totalAgents: 4,
      activeAgents: 0,
      totalFilesProcessed: 0,
      totalErrors: 0,
      systemUptime: 0,
      version: '1.0.0',
      initialized: true
    };
  }

  /**
   * Create default statistics
   */
  function createDefaultStatistics(agentId) {
    return {
      agentId: agentId,
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],
      performanceHistory: [],
      errorHistory: [],
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Record agent run
   */
  function recordAgentRun(agentId, success, duration, filesProcessed, errors) {
    // Update metrics
    const metrics = getAgentMetrics(agentId);
    const newTotalRuns = metrics.totalRuns + 1;
    const newSuccessfulRuns = success ? metrics.successfulRuns + 1 : metrics.successfulRuns;
    const newFailedRuns = success ? metrics.failedRuns : metrics.failedRuns + 1;
    const newTotalFilesProcessed = metrics.totalFilesProcessed + filesProcessed;
    const newTotalErrors = metrics.totalErrors + errors;
    const newSuccessRate = Math.round((newSuccessfulRuns / newTotalRuns) * 100);
    
    // Calculate new average processing time
    const newAvgProcessingTime = Math.round(
      (metrics.avgProcessingTime * metrics.totalRuns + duration) / newTotalRuns
    );
    
    const newMaxProcessingTime = Math.max(metrics.maxProcessingTime, duration);
    const newMinProcessingTime = metrics.minProcessingTime === 0 ? duration : Math.min(metrics.minProcessingTime, duration);
    
    const updatedMetrics = {
      ...metrics,
      totalRuns: newTotalRuns,
      successfulRuns: newSuccessfulRuns,
      failedRuns: newFailedRuns,
      avgProcessingTime: newAvgProcessingTime,
      maxProcessingTime: newMaxProcessingTime,
      minProcessingTime: newMinProcessingTime,
      totalFilesProcessed: newTotalFilesProcessed,
      totalErrors: newTotalErrors,
      successRate: newSuccessRate,
      lastUpdated: new Date().toISOString()
    };
    
    saveAgentMetrics(agentId, updatedMetrics);
    
    // Update statistics
    const stats = getAgentStatistics(agentId);
    const now = new Date();
    const today = now.toDateString();
    
    // Update daily stats
    const dailyStats = stats.dailyStats.find(d => d.date === today);
    if (dailyStats) {
      dailyStats.runs++;
      dailyStats.filesProcessed += filesProcessed;
      dailyStats.errors += errors;
      dailyStats.success += success ? 1 : 0;
    } else {
      stats.dailyStats.push({
        date: today,
        runs: 1,
        filesProcessed: filesProcessed,
        errors: errors,
        success: success ? 1 : 0
      });
    }
    
    // Keep only last 30 days
    if (stats.dailyStats.length > 30) {
      stats.dailyStats = stats.dailyStats.slice(-30);
    }
    
    // Update performance history
    stats.performanceHistory.push({
      timestamp: now.toISOString(),
      duration: duration,
      filesProcessed: filesProcessed,
      success: success
    });
    
    // Keep only last 100 entries
    if (stats.performanceHistory.length > 100) {
      stats.performanceHistory = stats.performanceHistory.slice(-100);
    }
    
    // Update error history if there were errors
    if (errors > 0) {
      stats.errorHistory.push({
        timestamp: now.toISOString(),
        errors: errors,
        duration: duration
      });
      
      // Keep only last 50 error entries
      if (stats.errorHistory.length > 50) {
        stats.errorHistory = stats.errorHistory.slice(-50);
      }
    }
    
    saveAgentStatistics(agentId, stats);
    
    // Update system state
    const systemState = getSystemState();
    const updatedSystemState = {
      ...systemState,
      totalFilesProcessed: systemState.totalFilesProcessed + filesProcessed,
      totalErrors: systemState.totalErrors + errors,
      lastUpdated: new Date().toISOString()
    };
    
    saveSystemState(updatedSystemState);
    
    return {
      metrics: updatedMetrics,
      statistics: stats,
      systemState: updatedSystemState
    };
  }

  /**
   * Reset agent state
   */
  function resetAgentState(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    
    // Delete agent-specific state keys
    const keys = scriptProperties.getKeys();
    keys.forEach(key => {
      if (key.includes(agentId)) {
        scriptProperties.deleteProperty(key);
      }
    });
    
    // Recreate default state
    const defaultMetrics = createDefaultMetrics(agentId);
    saveAgentMetrics(agentId, defaultMetrics);
    
    const defaultStats = createDefaultStatistics(agentId);
    saveAgentStatistics(agentId, defaultStats);
    
    return {
      success: true,
      message: `State reset for agent ${agentId}`
    };
  }

  /**
   * Reset all agent states
   */
  function resetAllAgentStates() {
    const scriptProperties = PropertiesService.getScriptProperties();
    
    // Delete all state keys
    const keys = scriptProperties.getKeys();
    keys.forEach(key => {
      if (key.startsWith('AGENT_') || 
          key.startsWith('LAST_') || 
          key.startsWith('FILES_') || 
          key.startsWith('ERROR_') || 
          key.startsWith('METRICS_') || 
          key.startsWith('AGENT_STATS_')) {
        scriptProperties.deleteProperty(key);
      }
    });
    
    // Reset system state
    const defaultSystemState = createDefaultSystemState();
    saveSystemState(defaultSystemState);
    
    return {
      success: true,
      message: 'All agent states reset'
    };
  }

  /**
   * Get state summary
   */
  function getStateSummary() {
    const systemState = getSystemState();
    const agents = ['ingestion', 'project', 'personal', 'knowledge'];
    
    const agentStates = agents.map(agentId => {
      return {
        agentId: agentId,
        status: getAgentStatus(agentId),
        lastRun: getLastRunTime(agentId),
        filesProcessed: getFilesProcessed(agentId),
        errors: getErrorCount(agentId),
        metrics: getAgentMetrics(agentId)
      };
    });
    
    return {
      systemState: systemState,
      agentStates: agentStates,
      summaryGenerated: new Date().toISOString()
    };
  }

  /**
   * Cleanup old state data
   */
  function cleanupOldStateData(retentionDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    // Cleanup agent statistics
    const agents = ['ingestion', 'project', 'personal', 'knowledge'];
    
    agents.forEach(agentId => {
      const stats = getAgentStatistics(agentId);
      
      // Filter daily stats
      stats.dailyStats = stats.dailyStats.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= cutoffDate;
      });
      
      // Filter performance history
      stats.performanceHistory = stats.performanceHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= cutoffDate;
      });
      
      // Filter error history
      stats.errorHistory = stats.errorHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= cutoffDate;
      });
      
      saveAgentStatistics(agentId, stats);
    });
    
    return {
      success: true,
      message: `Cleaned up state data older than ${retentionDays} days`
    };
  }

  // Public API
  return {
    getAgentStatus: getAgentStatus,
    setAgentStatus: setAgentStatus,
    getLastRunTime: getLastRunTime,
    setLastRunTime: setLastRunTime,
    getFilesProcessed: getFilesProcessed,
    setFilesProcessed: setFilesProcessed,
    incrementFilesProcessed: incrementFilesProcessed,
    getErrorCount: getErrorCount,
    setErrorCount: setErrorCount,
    incrementErrorCount: incrementErrorCount,
    getAgentMetrics: getAgentMetrics,
    saveAgentMetrics: saveAgentMetrics,
    updateAgentMetrics: updateAgentMetrics,
    getSystemState: getSystemState,
    saveSystemState: saveSystemState,
    updateSystemState: updateSystemState,
    getAgentStatistics: getAgentStatistics,
    saveAgentStatistics: saveAgentStatistics,
    updateAgentStatistics: updateAgentStatistics,
    recordAgentRun: recordAgentRun,
    resetAgentState: resetAgentState,
    resetAllAgentStates: resetAllAgentStates,
    getStateSummary: getStateSummary,
    cleanupOldStateData: cleanupOldStateData
  };

})();

/**
 * Web app endpoints for state management
 */

/**
 * Get agent state
 */
function getAgentState(agentId) {
  try {
    return {
      success: true,
      state: {
        status: StateManager.getAgentStatus(agentId),
        lastRun: StateManager.getLastRunTime(agentId),
        filesProcessed: StateManager.getFilesProcessed(agentId),
        errors: StateManager.getErrorCount(agentId),
        metrics: StateManager.getAgentMetrics(agentId),
        statistics: StateManager.getAgentStatistics(agentId)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Set agent status
 */
function setAgentStatus(agentId, status) {
  try {
    StateManager.setAgentStatus(agentId, status);
    
    // Log the status change
    logStateChange(agentId, 'STATUS_CHANGE', { status: status });
    
    return {
      success: true,
      message: `Agent ${agentId} status set to ${status}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Record agent run
 */
function recordAgentRun(agentId, success, duration, filesProcessed, errors) {
  try {
    const result = StateManager.recordAgentRun(agentId, success, duration, filesProcessed, errors);
    
    return {
      success: true,
      result: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Reset agent state
 */
function resetAgentState(agentId) {
  try {
    const result = StateManager.resetAgentState(agentId);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Reset all agent states
 */
function resetAllAgentStates() {
  try {
    const result = StateManager.resetAllAgentStates();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get state summary
 */
function getStateSummary() {
  try {
    const summary = StateManager.getStateSummary();
    return {
      success: true,
      summary: summary
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Cleanup old state data
 */
function cleanupStateData(retentionDays) {
  try {
    const result = StateManager.cleanupOldStateData(retentionDays);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get system health
 */
function getSystemHealth() {
  try {
    const systemState = StateManager.getSystemState();
    const agents = ['ingestion', 'project', 'personal', 'knowledge'];
    
    const agentHealth = agents.map(agentId => {
      const status = StateManager.getAgentStatus(agentId);
      const lastRun = StateManager.getLastRunTime(agentId);
      const metrics = StateManager.getAgentMetrics(agentId);
      
      return {
        agentId: agentId,
        status: status,
        lastRun: lastRun,
        successRate: metrics.successRate,
        healthy: status !== 'error' && metrics.successRate > 80
      };
    });
    
    const overallHealth = agentHealth.every(a => a.healthy) ? 'healthy' : 'degraded';
    
    return {
      success: true,
      health: {
        systemState: systemState,
        agentHealth: agentHealth,
        overallHealth: overallHealth,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Log state change
 */
function logStateChange(agentId, changeType, details) {
  const sheet = getLogSheet();
  sheet.appendRow([
    new Date(),
    agentId,
    'STATE_CHANGE',
    JSON.stringify({
      changeType: changeType,
      details: details
    }),
    true
  ]);
}

/**
 * Get log sheet (from Code.gs)
 */
function getLogSheet() {
  const CONFIG = {
    LOG_SHEET_NAME: 'AgentLogs'
  };
  
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.LOG_SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.LOG_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Agent ID', 'Event Type', 'Details', 'Success']);
  }
  
  return sheet;
}

/**
 * Get spreadsheet (from Code.gs)
 */
function getSpreadsheet() {
  const CONFIG = {
    BASE_FOLDER_NAME: 'GENESIS_GATE_ORGANIZED'
  };
  
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
 * Get or create folder (from Code.gs)
 */
function getOrCreateFolder() {
  const CONFIG = {
    BASE_FOLDER_NAME: 'GENESIS_GATE_ORGANIZED'
  };
  
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