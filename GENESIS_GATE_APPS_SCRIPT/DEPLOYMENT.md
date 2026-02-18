# GENESIS_GATE Apps Script Deployment Guide

## Overview

This Apps Script provides a web-based interface for the GENESIS_GATE system, enabling cross-medium synchronization between local files and Google Drive. The system includes:

- **Love Economy Engine**: Financialization of care activities
- **Drive Synchronization**: Automated file sync between local and Drive
- **Web Interface**: Mission Control dashboard for system management

## Prerequisites

- Google Workspace account with Apps Script access
- Access to Google Drive
- Basic understanding of Google Apps Script

## Deployment Steps

### 1. Create New Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Rename the project to "GENESIS_GATE"

### 2. Upload Files

Upload the following files to your Apps Script project:

#### Core Files
- `Code.gs` - Main entry point and API handlers
- `Core/LoveEconomy.gs` - Love Economy engine
- `Utilities/DriveSync.gs` - Drive synchronization utilities
- `Index.html` - Web interface

#### Optional Files
- `README.md` - Project documentation

### 3. Configure Project Settings

1. **Set Project Version**:
   - File → Manage Versions
   - Save a new version with description "Initial deployment"

2. **Set Execution API**:
   - Publish → Deploy as web app
   - Project version: New
   - Execute the app as: Me
   - Who has access: Anyone

3. **Set Triggers**:
   - Triggers → Add Trigger
   - Function: `initGenesisGate`
   - Event source: Time-driven
   - Type: Hour timer
   - Every: 1 hour

### 4. Initial Setup

1. **Run Initial Setup**:
   - In the Apps Script editor, run `initGenesisGate()`
   - This creates the Drive folder structure and initializes the system

2. **Test the System**:
   - Run `testGenesisGate()` to verify all components work
   - Check the execution log for any errors

### 5. Deploy Web App

1. **Deploy as Web App**:
   - Publish → Deploy as web app
   - Select "New" for project version
   - Execute as: Me
   - Access: Anyone
   - Click "Deploy"

2. **Copy Web App URL**:
   - Note the provided URL
   - This is your Mission Control interface

## Usage

### Web Interface

Access the web interface at your deployed URL to:

- View system status and statistics
- Record care activities
- Monitor Drive synchronization
- View mission logs
- Run system tests

### API Endpoints

The system provides REST-like endpoints via `doPost()`:

- `getSystemStatus` - Get current system status
- `recordActivity` - Record a care activity
- `syncDrive` - Trigger Drive synchronization
- `getSyncStatus` - Get synchronization status

### Manual Operations

#### Record Activity
```javascript
// Via web interface or API
recordActivity("SPOON_RECOVERY", { duration: 30, notes: "Rest session" });
```

#### Sync Drive
```javascript
// Via web interface or API
syncDrive();
```

#### System Maintenance
```javascript
// Cleanup old triggers and logs
cleanupGenesisGate();
```

## File Structure

```
PHENIX_NAVIGATOR_ROOT/
├── ZONE_ALPHA_BACKBONE/
│   ├── core/           # Immutable truth/archives
│   └── docs/           # Documentation
├── ZONE_BETA_CONTROL_CENTER/
│   ├── mesh/           # Live operations
│   ├── agent/          # Live operations
│   └── bridge/         # Live operations
└── ZONE_GAMMA_FABRICATION/
    ├── world/          # Creative sandbox
    ├── cortex/         # Creative sandbox
    ├── ui/             # Creative sandbox
    ├── firmware/       # Creative sandbox
    └── hardware/       # Creative sandbox
```

## Security Considerations

- Apps Script runs with your Google account permissions
- All Drive operations use your account credentials
- Web app access can be restricted to specific users
- Consider enabling 2FA for your Google account

## Troubleshooting

### Common Issues

1. **Drive Structure Not Created**:
   - Run `initGenesisGate()` manually
   - Check Apps Script execution logs

2. **Sync Not Working**:
   - Verify Drive folder permissions
   - Check trigger configuration
   - Review execution logs for errors

3. **Web Interface Not Loading**:
   - Ensure web app is deployed
   - Check browser console for JavaScript errors
   - Verify network connectivity

### Debugging

1. **View Execution Logs**:
   - Apps Script → View → Logs
   - Check for error messages

2. **Test Individual Functions**:
   - Run functions directly in Apps Script editor
   - Use `Logger.log()` for debugging output

3. **Check Drive Structure**:
   - Manually verify folder creation in Google Drive
   - Ensure proper permissions

## Maintenance

### Regular Tasks

1. **Monitor Logs**: Check execution logs weekly
2. **Review Sync Status**: Verify Drive synchronization is working
3. **Update Version**: Deploy new versions as needed
4. **Clean Up**: Run `cleanupGenesisGate()` monthly

### Updates

When updating the system:

1. Make changes to local files
2. Upload updated files to Apps Script
3. Save new project version
4. Redeploy web app if needed

## Integration with Local System

The Apps Script integrates with your local GENESIS_GATE structure by:

1. **Mirroring Structure**: Creates equivalent Drive folder structure
2. **Syncing Files**: Periodically syncs files between local and Drive
3. **Maintaining Metadata**: Preserves file relationships and metadata
4. **Providing Interface**: Web-based access to system functions

## Support

For issues or questions:

1. Check this documentation
2. Review Apps Script execution logs
3. Test individual components
4. Verify Google Drive permissions

## Version History

- **v1.0.0**: Initial release with Love Economy and Drive sync