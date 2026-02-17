# Digital Centaur Agent Team - Google Apps Script Integration

This directory contains the complete Google Apps Script implementation for integrating the Digital Centaur Agent Team with Google Drive and Google Workspace. This provides a cloud-based interface for managing and monitoring your intelligent file organization system.

## 🚀 Overview

The Google Apps Script integration provides:

- **Web App Interface**: User-friendly dashboard for agent management
- **Google Drive Integration**: Seamless file synchronization and organization
- **Email Notifications**: Automated alerts and reports
- **Cloud Storage**: Persistent configuration and state management
- **Real-time Monitoring**: Live status updates and performance metrics

## 📁 Project Structure

```
google-apps-script/
├── appsscript.json              # Apps Script manifest
├── Code.gs                      # Main application logic
├── Dashboard.gs                 # Web app dashboard
├── AgentManager.gs              # Agent lifecycle management
├── DriveIntegration.gs          # Google Drive operations
├── NotificationManager.gs       # Email and notification system
├── ConfigManager.gs             # Configuration management
├── StateManager.gs              # Persistent state storage
├── SecurityManager.gs           # Security and permissions
├── Utilities.gs                 # Helper functions
├── templates/                   # HTML templates
│   ├── dashboard.html           # Main dashboard UI
│   ├── agent-config.html        # Agent configuration interface
│   ├── monitoring.html          # Real-time monitoring
│   └── reports.html             # Reports and analytics
└── README.md                    # This file
```

## 🎯 Features

### Web App Dashboard
- **Agent Status**: Real-time status of all agents
- **Configuration Management**: Easy configuration of agent settings
- **Monitoring**: Live performance metrics and logs
- **Reports**: Detailed analysis and statistics

### Google Drive Integration
- **Automatic Sync**: Sync local files to Google Drive
- **Organization**: Intelligent file organization in Drive
- **Backup**: Automatic backup of important files
- **Sharing**: Controlled file sharing and permissions

### Notification System
- **Email Alerts**: Notifications for important events
- **Status Reports**: Regular system health reports
- **Error Notifications**: Immediate alerts for issues
- **Customizable**: Configurable notification preferences

### Security & Privacy
- **OAuth2 Authentication**: Secure Google account integration
- **Permission Control**: Granular access control
- **Data Encryption**: Secure storage of sensitive information
- **Audit Logging**: Complete audit trail of all operations

## 🛠️ Installation & Setup

### Prerequisites
1. Google account with Google Drive access
2. Google Apps Script access (available with any Google account)
3. Basic understanding of Google Workspace

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Delete the default `Code.gs` file

### Step 2: Upload Files

Upload all the `.gs` files from this directory to your Apps Script project:

1. **appsscript.json** - Project manifest and permissions
2. **Code.gs** - Main application entry point
3. **Dashboard.gs** - Web app dashboard logic
4. **AgentManager.gs** - Agent management system
5. **DriveIntegration.gs** - Google Drive operations
6. **NotificationManager.gs** - Notification system
7. **ConfigManager.gs** - Configuration management
8. **StateManager.gs** - State persistence
9. **SecurityManager.gs** - Security controls
10. **Utilities.gs** - Helper functions

### Step 3: Create HTML Templates

Create the following HTML files in your Apps Script project:

1. **dashboard.html** - Main dashboard interface
2. **agent-config.html** - Agent configuration UI
3. **monitoring.html** - Real-time monitoring
4. **reports.html** - Reports and analytics

### Step 4: Configure Permissions

The appsscript.json file defines the required permissions. When you first run the script, Google will prompt you to authorize these permissions:

- Google Drive access
- Gmail access (for notifications)
- Properties service (for configuration storage)
- Script execution

### Step 5: Deploy as Web App

1. In Apps Script, click "Deploy" → "New deployment"
2. Select "Web app" as the deployment type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone" (or restrict as needed)
5. Click "Deploy"

### Step 6: Configure Local Agent Integration

Update your local agent configuration to connect with the Google Apps Script:

```json
{
  "google_apps_script": {
    "enabled": true,
    "web_app_url": "YOUR_WEB_APP_URL",
    "api_key": "YOUR_API_KEY_IF_NEEDED"
  }
}
```

## 🔧 Configuration

### Agent Configuration

Each agent can be configured through the web dashboard or by updating the configuration files:

```json
{
  "name": "Ingestion Agent",
  "target_directory": "/Downloads",
  "enabled": true,
  "scan_interval": 3600,
  "drive_sync": {
    "enabled": true,
    "target_folder": "Organized/Downloads",
    "sync_mode": "mirror"
  },
  "notifications": {
    "enabled": true,
    "email": "user@example.com",
    "frequency": "daily"
  }
}
```

### Google Drive Organization

The system automatically organizes files in Google Drive using this structure:

```
GENESIS_GATE_ORGANIZED/
├── Downloads/           # Ingestion Agent files
├── Projects/           # Project Agent files
├── Personal/           # Personal Agent files
├── Knowledge/          # Knowledge Agent files
└── Archives/           # Archived files
```

### Notification Settings

Configure notification preferences:

```json
{
  "notifications": {
    "email_enabled": true,
    "email_address": "user@example.com",
    "daily_reports": true,
    "error_alerts": true,
    "performance_metrics": false,
    "file_changes": true
  }
}
```

## 📊 Monitoring & Analytics

### Real-time Dashboard

The web dashboard provides:

- **Agent Status**: Live status of all agents
- **Performance Metrics**: Processing times, success rates
- **File Statistics**: File counts, sizes, types
- **Error Logs**: Detailed error information

### Reports

Generate comprehensive reports:

- **Daily Activity**: Summary of daily operations
- **Performance Analysis**: Agent performance over time
- **Storage Usage**: Google Drive storage statistics
- **Security Audit**: Security-related events and changes

### Alerts & Notifications

Set up custom alerts:

- **Threshold Alerts**: Notifications when thresholds are exceeded
- **Scheduled Reports**: Regular email reports
- **Error Notifications**: Immediate alerts for critical errors
- **Status Updates**: Periodic system status updates

## 🔒 Security Features

### Authentication & Authorization

- **OAuth2 Integration**: Secure Google account authentication
- **Scope Limitation**: Minimal required permissions
- **Token Management**: Secure token storage and refresh

### Data Protection

- **Encryption**: Sensitive data encryption
- **Access Control**: Granular permission management
- **Audit Logging**: Complete operation audit trail

### Privacy Controls

- **Data Minimization**: Only necessary data is stored
- **User Control**: Users control their data and settings
- **Compliance**: Adheres to Google Workspace security standards

## 🚨 Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure all required permissions are granted
2. **Quota Limits**: Monitor Google API quota usage
3. **Network Issues**: Check internet connectivity for sync operations
4. **Configuration Errors**: Validate JSON configuration files

### Debug Mode

Enable debug mode for detailed logging:

```json
{
  "debug": {
    "enabled": true,
    "log_level": "verbose",
    "email_logs": true
  }
}
```

### Support

For issues and support:

1. Check the error logs in the dashboard
2. Review Google Cloud Platform quotas
3. Verify Google Drive permissions
4. Test with minimal configuration

## 📈 Performance Optimization

### Google Drive Optimization

- **Batch Operations**: Minimize API calls with batching
- **Caching**: Cache frequently accessed data
- **Compression**: Compress large files before upload

### Agent Performance

- **Parallel Processing**: Run agents concurrently when possible
- **Resource Management**: Monitor and manage system resources
- **Scheduling**: Optimize agent execution schedules

### Monitoring Performance

- **Metrics Collection**: Track key performance indicators
- **Alert Thresholds**: Set up performance alerts
- **Regular Reviews**: Periodic performance analysis

## 🔮 Future Enhancements

Planned features for future versions:

- **Machine Learning Integration**: Enhanced categorization using ML
- **Advanced Analytics**: Deeper insights and predictions
- **Mobile App**: Native mobile interface
- **Integration APIs**: RESTful APIs for external integration
- **Advanced Security**: Enhanced security features and compliance

## 📄 License

This project is part of the GENESIS_GATE ecosystem and follows its licensing terms.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request

## 📞 Support

For support and questions:

1. Check the documentation
2. Review the troubleshooting section
3. Check Google Apps Script community forums
4. Contact the development team

---

**Built with ❤️ as part of the Digital Centaur vision**