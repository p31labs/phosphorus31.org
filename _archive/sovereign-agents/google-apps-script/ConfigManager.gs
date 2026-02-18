/**
 * Digital Centaur Agent Team - Google Apps Script
 * Configuration management system
 */

/**
 * Configuration management service
 */
var ConfigManager = (function() {
  'use strict';

  const CONFIG_KEYS = {
    GLOBAL_CONFIG: 'GLOBAL_CONFIG',
    NOTIFICATION_SETTINGS: 'NOTIFICATION_SETTINGS',
    DRIVE_SETTINGS: 'DRIVE_SETTINGS',
    AGENT_CONFIG_PREFIX: 'AGENT_CONFIG_',
    USER_PREFERENCES: 'USER_PREFERENCES'
  };

  /**
   * Get global configuration
   */
  function getGlobalConfig() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const configJson = scriptProperties.getProperty(CONFIG_KEYS.GLOBAL_CONFIG);
    
    if (configJson) {
      return JSON.parse(configJson);
    }
    
    // Return default configuration
    const defaultConfig = createDefaultGlobalConfig();
    saveGlobalConfig(defaultConfig);
    return defaultConfig;
  }

  /**
   * Save global configuration
   */
  function saveGlobalConfig(config) {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(CONFIG_KEYS.GLOBAL_CONFIG, JSON.stringify(config));
  }

  /**
   * Get agent configuration
   */
  function getAgentConfig(agentId) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = CONFIG_KEYS.AGENT_CONFIG_PREFIX + agentId;
    const configJson = scriptProperties.getProperty(key);
    
    if (configJson) {
      return JSON.parse(configJson);
    }
    
    // Return default agent configuration
    const defaultConfig = createDefaultAgentConfig(agentId);
    saveAgentConfig(agentId, defaultConfig);
    return defaultConfig;
  }

  /**
   * Save agent configuration
   */
  function saveAgentConfig(agentId, config) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const key = CONFIG_KEYS.AGENT_CONFIG_PREFIX + agentId;
    scriptProperties.setProperty(key, JSON.stringify(config));
  }

  /**
   * Get notification settings
   */
  function getNotificationSettings() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const settingsJson = scriptProperties.getProperty(CONFIG_KEYS.NOTIFICATION_SETTINGS);
    
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    
    // Return default notification settings
    const defaultSettings = createDefaultNotificationSettings();
    saveNotificationSettings(defaultSettings);
    return defaultSettings;
  }

  /**
   * Save notification settings
   */
  function saveNotificationSettings(settings) {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(CONFIG_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  }

  /**
   * Get drive settings
   */
  function getDriveSettings() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const settingsJson = scriptProperties.getProperty(CONFIG_KEYS.DRIVE_SETTINGS);
    
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    
    // Return default drive settings
    const defaultSettings = createDefaultDriveSettings();
    saveDriveSettings(defaultSettings);
    return defaultSettings;
  }

  /**
   * Save drive settings
   */
  function saveDriveSettings(settings) {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty(CONFIG_KEYS.DRIVE_SETTINGS, JSON.stringify(settings));
  }

  /**
   * Get user preferences
   */
  function getUserPreferences() {
    const userProperties = PropertiesService.getUserProperties();
    const prefsJson = userProperties.getProperty(CONFIG_KEYS.USER_PREFERENCES);
    
    if (prefsJson) {
      return JSON.parse(prefsJson);
    }
    
    // Return default user preferences
    const defaultPrefs = createDefaultUserPreferences();
    saveUserPreferences(defaultPrefs);
    return defaultPrefs;
  }

  /**
   * Save user preferences
   */
  function saveUserPreferences(preferences) {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(CONFIG_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  }

  /**
   * Create default global configuration
   */
  function createDefaultGlobalConfig() {
    return {
      version: '1.0.0',
      appName: 'Digital Centaur Agent Team',
      baseFolderName: 'GENESIS_GATE_ORGANIZED',
      agents: {
        ingestion: createDefaultAgentConfig('ingestion'),
        project: createDefaultAgentConfig('project'),
        personal: createDefaultAgentConfig('personal'),
        knowledge: createDefaultAgentConfig('knowledge')
      },
      notifications: createDefaultNotificationSettings(),
      drive: createDefaultDriveSettings(),
      security: {
        encryptionEnabled: true,
        auditLogging: true,
        maxRetries: 3,
        timeout: 300000 // 5 minutes
      },
      performance: {
        batchSize: 100,
        maxConcurrentAgents: 4,
        cacheTimeout: 3600000 // 1 hour
      }
    };
  }

  /**
   * Create default agent configuration
   */
  function createDefaultAgentConfig(agentId) {
    const baseConfig = {
      enabled: true,
      scanInterval: 3600, // 1 hour in seconds
      targetDirectory: '',
      driveSync: {
        enabled: true,
        targetFolder: agentId,
        syncMode: 'mirror',
        compressionEnabled: true,
        batchSize: 50
      },
      notifications: {
        enabled: true,
        email: Session.getActiveUser().getEmail(),
        frequency: 'daily',
        alertOnErrors: true,
        alertOnSuccess: false
      },
      scrubbing: {
        enabled: true,
        mode: 'mask', // 'mask', 'remove', 'encrypt'
        customPatterns: {},
        preserveMetadata: true
      },
      organization: {
        enabled: true,
        namingTemplate: '{date}_{category}_{keywords}{ext}',
        categoryPaths: {},
        autoCreateFolders: true
      },
      security: {
        encryptSensitive: true,
        auditLogging: true,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedFileTypes: ['*']
      }
    };

    switch (agentId) {
      case 'ingestion':
        return {
          ...baseConfig,
          targetDirectory: 'Downloads',
          scanInterval: 1800, // 30 minutes
          driveSync: { ...baseConfig.driveSync, targetFolder: 'Downloads' },
          scrubbing: { ...baseConfig.scrubbing, mode: 'mask' },
          organization: { ...baseConfig.organization, enabled: true }
        };
      
      case 'project':
        return {
          ...baseConfig,
          targetDirectory: 'Projects',
          scanInterval: 7200, // 2 hours
          driveSync: { ...baseConfig.driveSync, targetFolder: 'Projects' },
          scrubbing: { ...baseConfig.scrubbing, mode: 'mask' },
          organization: { ...baseConfig.organization, enabled: true }
        };
      
      case 'personal':
        return {
          ...baseConfig,
          targetDirectory: 'Personal',
          scanInterval: 14400, // 4 hours
          driveSync: { ...baseConfig.driveSync, targetFolder: 'Personal' },
          scrubbing: { ...baseConfig.scrubbing, mode: 'remove' },
          organization: { ...baseConfig.organization, enabled: true }
        };
      
      case 'knowledge':
        return {
          ...baseConfig,
          targetDirectory: 'Knowledge',
          scanInterval: 3600, // 1 hour
          driveSync: { ...baseConfig.driveSync, targetFolder: 'Knowledge' },
          scrubbing: { ...baseConfig.scrubbing, mode: 'mask' },
          organization: { ...baseConfig.organization, enabled: false }
        };
      
      default:
        return baseConfig;
    }
  }

  /**
   * Create default notification settings
   */
  function createDefaultNotificationSettings() {
    return {
      enabled: true,
      email: Session.getActiveUser().getEmail(),
      dailyReports: true,
      errorAlerts: true,
      performanceAlerts: true,
      agentStatus: true,
      systemAlerts: true,
      notificationFrequency: 'immediate',
      maxNotificationsPerDay: 50
    };
  }

  /**
   * Create default drive settings
   */
  function createDefaultDriveSettings() {
    return {
      baseFolder: 'GENESIS_GATE_ORGANIZED',
      syncMode: 'mirror',
      compressionEnabled: true,
      batchUploadSize: 100,
      maxRetries: 3,
      chunkSize: 10 * 1024 * 1024, // 10MB chunks
      preserveTimestamps: true,
      skipDuplicates: true,
      archiveOldFiles: true,
      archiveRetentionDays: 90
    };
  }

  /**
   * Create default user preferences
   */
  function createDefaultUserPreferences() {
    return {
      theme: 'light',
      language: 'en',
      dashboardRefreshInterval: 30000, // 30 seconds
      showAdvancedOptions: false,
      enableTooltips: true,
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'HH:mm:ss',
      timezone: Session.getScriptTimeZone()
    };
  }

  /**
   * Validate configuration
   */
  function validateConfig(config, configType) {
    const errors = [];
    
    switch (configType) {
      case 'global':
        if (!config.appName) errors.push('App name is required');
        if (!config.version) errors.push('Version is required');
        if (!config.agents) errors.push('Agents configuration is required');
        break;
      
      case 'agent':
        if (!config.targetDirectory) errors.push('Target directory is required');
        if (!config.scanInterval || config.scanInterval < 60) errors.push('Scan interval must be at least 60 seconds');
        if (!config.notifications.email) errors.push('Notification email is required');
        break;
      
      case 'notifications':
        if (!config.email) errors.push('Email address is required');
        if (!config.notificationFrequency) errors.push('Notification frequency is required');
        break;
      
      case 'drive':
        if (!config.baseFolder) errors.push('Base folder name is required');
        if (!config.syncMode) errors.push('Sync mode is required');
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Reset all configurations to defaults
   */
  function resetAllConfigurations() {
    const scriptProperties = PropertiesService.getScriptProperties();
    const userProperties = PropertiesService.getUserProperties();
    
    // Delete all configuration keys
    const keys = scriptProperties.getKeys();
    keys.forEach(key => {
      if (key.startsWith('GLOBAL_') || 
          key.startsWith('AGENT_') || 
          key.startsWith('NOTIFICATION_') || 
          key.startsWith('DRIVE_')) {
        scriptProperties.deleteProperty(key);
      }
    });
    
    // Delete user preferences
    userProperties.deleteProperty(CONFIG_KEYS.USER_PREFERENCES);
    
    // Recreate default configurations
    const defaultConfig = createDefaultGlobalConfig();
    saveGlobalConfig(defaultConfig);
    
    return {
      success: true,
      message: 'All configurations reset to defaults'
    };
  }

  /**
   * Export configuration to JSON
   */
  function exportConfiguration() {
    const config = {
      global: getGlobalConfig(),
      agents: {
        ingestion: getAgentConfig('ingestion'),
        project: getAgentConfig('project'),
        personal: getAgentConfig('personal'),
        knowledge: getAgentConfig('knowledge')
      },
      notifications: getNotificationSettings(),
      drive: getDriveSettings(),
      userPreferences: getUserPreferences(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  function importConfiguration(configJson) {
    try {
      const config = JSON.parse(configJson);
      
      // Validate and save global config
      if (config.global) {
        const validation = validateConfig(config.global, 'global');
        if (!validation.isValid) {
          return {
            success: false,
            errors: validation.errors
          };
        }
        saveGlobalConfig(config.global);
      }
      
      // Save agent configs
      if (config.agents) {
        Object.keys(config.agents).forEach(agentId => {
          const validation = validateConfig(config.agents[agentId], 'agent');
          if (validation.isValid) {
            saveAgentConfig(agentId, config.agents[agentId]);
          }
        });
      }
      
      // Save other configs
      if (config.notifications) saveNotificationSettings(config.notifications);
      if (config.drive) saveDriveSettings(config.drive);
      if (config.userPreferences) saveUserPreferences(config.userPreferences);
      
      return {
        success: true,
        message: 'Configuration imported successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid JSON format: ' + error.toString()
      };
    }
  }

  /**
   * Get configuration summary
   */
  function getConfigSummary() {
    const globalConfig = getGlobalConfig();
    const agents = Object.keys(globalConfig.agents);
    
    return {
      version: globalConfig.version,
      appName: globalConfig.appName,
      totalAgents: agents.length,
      enabledAgents: agents.filter(id => globalConfig.agents[id].enabled).length,
      notificationsEnabled: globalConfig.notifications.enabled,
      driveSyncEnabled: globalConfig.agents[agents[0]].driveSync.enabled,
      lastModified: new Date().toISOString()
    };
  }

  // Public API
  return {
    getGlobalConfig: getGlobalConfig,
    saveGlobalConfig: saveGlobalConfig,
    getAgentConfig: getAgentConfig,
    saveAgentConfig: saveAgentConfig,
    getNotificationSettings: getNotificationSettings,
    saveNotificationSettings: saveNotificationSettings,
    getDriveSettings: getDriveSettings,
    saveDriveSettings: saveDriveSettings,
    getUserPreferences: getUserPreferences,
    saveUserPreferences: saveUserPreferences,
    validateConfig: validateConfig,
    resetAllConfigurations: resetAllConfigurations,
    exportConfiguration: exportConfiguration,
    importConfiguration: importConfiguration,
    getConfigSummary: getConfigSummary
  };

})();

/**
 * Web app endpoints for configuration management
 */

/**
 * Get all configurations
 */
function getAllConfigurations() {
  try {
    return {
      success: true,
      configurations: {
        global: ConfigManager.getGlobalConfig(),
        agents: {
          ingestion: ConfigManager.getAgentConfig('ingestion'),
          project: ConfigManager.getAgentConfig('project'),
          personal: ConfigManager.getAgentConfig('personal'),
          knowledge: ConfigManager.getAgentConfig('knowledge')
        },
        notifications: ConfigManager.getNotificationSettings(),
        drive: ConfigManager.getDriveSettings(),
        userPreferences: ConfigManager.getUserPreferences()
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
 * Update agent configuration
 */
function updateAgentConfiguration(agentId, config) {
  try {
    const validation = ConfigManager.validateConfig(config, 'agent');
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    ConfigManager.saveAgentConfig(agentId, config);
    
    // Log the configuration change
    logConfigChange(agentId, 'AGENT_CONFIG_UPDATE', config);
    
    return {
      success: true,
      message: 'Agent configuration updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Update notification settings
 */
function updateNotificationSettings(settings) {
  try {
    const validation = ConfigManager.validateConfig(settings, 'notifications');
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    ConfigManager.saveNotificationSettings(settings);
    
    // Log the configuration change
    logConfigChange('notifications', 'NOTIFICATION_SETTINGS_UPDATE', settings);
    
    return {
      success: true,
      message: 'Notification settings updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Update drive settings
 */
function updateDriveSettings(settings) {
  try {
    const validation = ConfigManager.validateConfig(settings, 'drive');
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    ConfigManager.saveDriveSettings(settings);
    
    // Log the configuration change
    logConfigChange('drive', 'DRIVE_SETTINGS_UPDATE', settings);
    
    return {
      success: true,
      message: 'Drive settings updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Reset configuration to defaults
 */
function resetConfiguration(configType) {
  try {
    let result;
    
    switch (configType) {
      case 'all':
        result = ConfigManager.resetAllConfigurations();
        break;
      case 'agent':
        // Reset specific agent config
        const defaultAgentConfig = ConfigManager.createDefaultAgentConfig('ingestion'); // Example
        ConfigManager.saveAgentConfig('ingestion', defaultAgentConfig);
        result = { success: true, message: 'Agent configuration reset to defaults' };
        break;
      case 'notifications':
        const defaultNotificationSettings = ConfigManager.createDefaultNotificationSettings();
        ConfigManager.saveNotificationSettings(defaultNotificationSettings);
        result = { success: true, message: 'Notification settings reset to defaults' };
        break;
      case 'drive':
        const defaultDriveSettings = ConfigManager.createDefaultDriveSettings();
        ConfigManager.saveDriveSettings(defaultDriveSettings);
        result = { success: true, message: 'Drive settings reset to defaults' };
        break;
      default:
        return {
          success: false,
          error: 'Invalid configuration type'
        };
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Export configuration
 */
function exportConfiguration() {
  try {
    const configJson = ConfigManager.exportConfiguration();
    return {
      success: true,
      configJson: configJson
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Import configuration
 */
function importConfiguration(configJson) {
  try {
    const result = ConfigManager.importConfiguration(configJson);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get configuration summary
 */
function getConfigurationSummary() {
  try {
    const summary = ConfigManager.getConfigSummary();
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
 * Log configuration change
 */
function logConfigChange(configType, changeType, details) {
  const sheet = getLogSheet();
  sheet.appendRow([
    new Date(),
    configType,
    changeType,
    JSON.stringify(details),
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