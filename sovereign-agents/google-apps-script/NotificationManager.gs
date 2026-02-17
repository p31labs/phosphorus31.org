/**
 * Digital Centaur Agent Team - Google Apps Script
 * Email notification and alert system
 */

/**
 * Notification management service
 */
var NotificationManager = (function() {
  'use strict';

  const CONFIG = {
    APP_NAME: 'Digital Centaur Agent Team',
    DEFAULT_EMAIL: Session.getActiveUser().getEmail(),
    NOTIFICATION_TYPES: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info'
    },
    TEMPLATE_PATHS: {
      dailyReport: 'templates/reports.html',
      agentAlert: 'templates/agent-alert.html',
      systemAlert: 'templates/system-alert.html'
    }
  };

  /**
   * Send notification email
   */
  function sendNotification(recipient, subject, body, options) {
    try {
      const emailOptions = {
        htmlBody: body,
        name: CONFIG.APP_NAME
      };
      
      if (options && options.priority) {
        emailOptions.priority = options.priority;
      }
      
      GmailApp.sendEmail(recipient || CONFIG.DEFAULT_EMAIL, subject, '', emailOptions);
      
      // Log the notification
      logNotification(recipient, subject, 'SENT');
      
      return {
        success: true,
        message: 'Notification sent successfully'
      };
    } catch (error) {
      Logger.log('Error sending notification: ' + error);
      logNotification(recipient, subject, 'FAILED', error.toString());
      return {
        success: false,
        error: error.toString()
      };
    }
  }

  /**
   * Send agent status notification
   */
  function sendAgentNotification(agentId, agentName, status, details) {
    const subject = `[${CONFIG.APP_NAME}] Agent ${agentName} Status Update`;
    const body = createAgentAlertTemplate(agentId, agentName, status, details);
    
    return sendNotification(null, subject, body, {
      priority: status === 'error' ? GmailApp.Priority.HIGH : GmailApp.Priority.NORMAL
    });
  }

  /**
   * Send system alert notification
   */
  function sendSystemAlert(alertType, message, details) {
    const subject = `[${CONFIG.APP_NAME}] System Alert: ${alertType}`;
    const body = createSystemAlertTemplate(alertType, message, details);
    
    return sendNotification(null, subject, body, {
      priority: GmailApp.Priority.HIGH
    });
  }

  /**
   * Send daily report
   */
  function sendDailyReport() {
    const subject = `[${CONFIG.APP_NAME}] Daily Agent Report - ${new Date().toLocaleDateString()}`;
    const body = createDailyReportTemplate();
    
    return sendNotification(null, subject, body);
  }

  /**
   * Send error notification
   */
  function sendErrorNotification(errorDetails) {
    const subject = `[${CONFIG.APP_NAME}] Error Alert`;
    const body = createErrorTemplate(errorDetails);
    
    return sendNotification(null, subject, body, {
      priority: GmailApp.Priority.HIGH
    });
  }

  /**
   * Send performance alert
   */
  function sendPerformanceAlert(agentId, metric, threshold, currentValue) {
    const subject = `[${CONFIG.APP_NAME}] Performance Alert: ${agentId}`;
    const body = createPerformanceAlertTemplate(agentId, metric, threshold, currentValue);
    
    return sendNotification(null, subject, body, {
      priority: GmailApp.Priority.NORMAL
    });
  }

  /**
   * Create agent alert email template
   */
  function createAgentAlertTemplate(agentId, agentName, status, details) {
    const statusColor = getStatusColor(status);
    const statusIcon = getStatusIcon(status);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid ${statusColor}; padding-bottom: 20px; margin-bottom: 30px; }
          .status-badge { display: inline-block; background-color: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
          .agent-info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .details { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
          .icon { font-size: 24px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2><span class="icon">${statusIcon}</span> Agent Status Update</h2>
            <div class="status-badge">${status.toUpperCase()}</div>
          </div>
          
          <div class="agent-info">
            <h3>Agent Information</h3>
            <p><strong>Agent ID:</strong> ${agentId}</p>
            <p><strong>Agent Name:</strong> ${agentName}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="details">
            <h3>Details</h3>
            <p>${details || 'No additional details provided.'}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from ${CONFIG.APP_NAME}.</p>
            <p>To manage your notification preferences, visit the dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Create system alert email template
   */
  function createSystemAlertTemplate(alertType, message, details) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #dc3545; padding-bottom: 20px; margin-bottom: 30px; }
          .alert-badge { display: inline-block; background-color: #dc3545; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
          .alert-info { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .details { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚨 System Alert</h2>
            <div class="alert-badge">${alertType.toUpperCase()}</div>
          </div>
          
          <div class="alert-info">
            <h3>Alert Message</h3>
            <p>${message}</p>
          </div>
          
          ${details ? `
            <div class="details">
              <h3>Additional Details</h3>
              <p>${details}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>This is an automated alert from ${CONFIG.APP_NAME}.</p>
            <p>Please check the dashboard for more information.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Create daily report email template
   */
  function createDailyReportTemplate() {
    const agents = getAgentStatus();
    const stats = calculateDailyStats();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #2196f3; padding-bottom: 20px; margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
          .stat-card { background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #2196f3; }
          .stat-label { color: #6c757d; margin-top: 5px; }
          .agent-list { margin: 30px 0; }
          .agent-item { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2196f3; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📊 Daily Agent Report</h2>
            <p>Report generated on ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.totalAgents}</div>
              <div class="stat-label">Total Agents</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.activeAgents}</div>
              <div class="stat-label">Active Agents</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalFilesProcessed}</div>
              <div class="stat-label">Files Processed</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.successRate}%</div>
              <div class="stat-label">Success Rate</div>
            </div>
          </div>
          
          <div class="agent-list">
            <h3>Agent Status</h3>
            ${agents.map(agent => `
              <div class="agent-item">
                <h4>${agent.name}</h4>
                <p><strong>Status:</strong> ${agent.status}</p>
                <p><strong>Files Processed:</strong> ${agent.filesProcessed}</p>
                <p><strong>Errors:</strong> ${agent.errors}</p>
                <p><strong>Last Run:</strong> ${agent.lastRun ? new Date(agent.lastRun).toLocaleString() : 'Never'}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>This is an automated report from ${CONFIG.APP_NAME}.</p>
            <p>For detailed analytics, visit the dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Create error notification template
   */
  function createErrorTemplate(errorDetails) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #dc3545; padding-bottom: 20px; margin-bottom: 30px; }
          .error-badge { display: inline-block; background-color: #dc3545; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
          .error-details { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>❌ Error Alert</h2>
            <div class="error-badge">CRITICAL ERROR</div>
          </div>
          
          <div class="error-details">
            <h3>Error Details</h3>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Error:</strong> ${errorDetails.error || 'Unknown error'}</p>
            <p><strong>Location:</strong> ${errorDetails.location || 'Not specified'}</p>
            <p><strong>Details:</strong> ${errorDetails.details || 'No additional details'}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated error notification from ${CONFIG.APP_NAME}.</p>
            <p>Please check the dashboard for more information and logs.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Create performance alert template
   */
  function createPerformanceAlertTemplate(agentId, metric, threshold, currentValue) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #ffc107; padding-bottom: 20px; margin-bottom: 30px; }
          .warning-badge { display: inline-block; background-color: #ffc107; color: #212529; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
          .metric-info { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⚠️ Performance Alert</h2>
            <div class="warning-badge">PERFORMANCE WARNING</div>
          </div>
          
          <div class="metric-info">
            <h3>Metric Alert</h3>
            <p><strong>Agent:</strong> ${agentId}</p>
            <p><strong>Metric:</strong> ${metric}</p>
            <p><strong>Threshold:</strong> ${threshold}</p>
            <p><strong>Current Value:</strong> ${currentValue}</p>
            <p><strong>Status:</strong> Metric exceeds threshold</p>
          </div>
          
          <div class="footer">
            <p>This is an automated performance alert from ${CONFIG.APP_NAME}.</p>
            <p>Please check the dashboard for detailed performance metrics.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get status color for styling
   */
  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'running':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  }

  /**
   * Get status icon for styling
   */
  function getStatusIcon(status) {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'running':
        return '🔄';
      default:
        return 'ℹ️';
    }
  }

  /**
   * Log notification for tracking
   */
  function logNotification(recipient, subject, status, error) {
    const sheet = getLogSheet();
    sheet.appendRow([
      new Date(),
      'notification',
      'NOTIFICATION',
      JSON.stringify({
        recipient: recipient,
        subject: subject,
        status: status,
        error: error
      }),
      status === 'SENT'
    ]);
  }

  /**
   * Get agent status (from Code.gs)
   */
  function getAgentStatus() {
    // This would call the getAgentStatus function from Code.gs
    // For now, return mock data
    return [
      {
        id: 'ingestion',
        name: 'Ingestion Agent (Gatekeeper)',
        status: 'active',
        filesProcessed: 150,
        errors: 2,
        lastRun: new Date(Date.now() - 3600000)
      },
      {
        id: 'project',
        name: 'Project Agent (Archivist)',
        status: 'running',
        filesProcessed: 75,
        errors: 0,
        lastRun: new Date(Date.now() - 1800000)
      },
      {
        id: 'personal',
        name: 'Personal Agent (Guardian)',
        status: 'completed',
        filesProcessed: 25,
        errors: 1,
        lastRun: new Date(Date.now() - 7200000)
      },
      {
        id: 'knowledge',
        name: 'Knowledge Agent (Weaver)',
        status: 'active',
        filesProcessed: 200,
        errors: 0,
        lastRun: new Date(Date.now() - 900000)
      }
    ];
  }

  /**
   * Calculate daily statistics
   */
  function calculateDailyStats() {
    const agents = getAgentStatus();
    
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active' || a.status === 'running').length,
      totalFilesProcessed: agents.reduce((sum, a) => sum + a.filesProcessed, 0),
      totalErrors: agents.reduce((sum, a) => sum + a.errors, 0),
      successRate: 95 // Mock success rate
    };
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

  // Public API
  return {
    sendNotification: sendNotification,
    sendAgentNotification: sendAgentNotification,
    sendSystemAlert: sendSystemAlert,
    sendDailyReport: sendDailyReport,
    sendErrorNotification: sendErrorNotification,
    sendPerformanceAlert: sendPerformanceAlert
  };

})();

/**
 * Web app endpoints for notifications
 */

/**
 * Send test notification
 */
function sendTestNotification() {
  try {
    const result = NotificationManager.sendNotification(
      null,
      'Test Notification',
      '<h2>Test Message</h2><p>This is a test notification from the Digital Centaur Agent Team.</p>'
    );
    
    return {
      success: result.success,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Send agent status notification
 */
function sendAgentStatusNotification(agentId, status, details) {
  try {
    const agentName = getAgentName(agentId);
    const result = NotificationManager.sendAgentNotification(agentId, agentName, status, details);
    
    return {
      success: result.success,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Send system alert
 */
function sendSystemAlert(alertType, message, details) {
  try {
    const result = NotificationManager.sendSystemAlert(alertType, message, details);
    
    return {
      success: result.success,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get notification settings
 */
function getNotificationSettings() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const settingsJson = scriptProperties.getProperty('NOTIFICATION_SETTINGS');
  
  if (settingsJson) {
    return JSON.parse(settingsJson);
  }
  
  // Return default settings
  const defaultSettings = {
    enabled: true,
    email: Session.getActiveUser().getEmail(),
    dailyReports: true,
    errorAlerts: true,
    performanceAlerts: true,
    agentStatus: true
  };
  
  saveNotificationSettings(defaultSettings);
  return defaultSettings;
}

/**
 * Save notification settings
 */
function saveNotificationSettings(settings) {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('NOTIFICATION_SETTINGS', JSON.stringify(settings));
}

/**
 * Get agent name by ID
 */
function getAgentName(agentId) {
  const agentNames = {
    'ingestion': 'Ingestion Agent (Gatekeeper)',
    'project': 'Project Agent (Archivist)',
    'personal': 'Personal Agent (Guardian)',
    'knowledge': 'Knowledge Agent (Weaver)'
  };
  
  return agentNames[agentId] || agentId;
}