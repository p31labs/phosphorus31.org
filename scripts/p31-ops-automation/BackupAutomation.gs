/**
 * Weekly backup: export accommodation log CSV from Shelter and save to Drive.
 * Run every Wednesday 3 AM ET.
 */
function weeklyBackup() {
  var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');

  try {
    var csvUrl = CONFIG.SHELTER_HEALTH.replace('/health', '/accommodation-log/export?format=csv');
    var res = UrlFetchApp.fetch(csvUrl, { muteHttpExceptions: true });

    if (res.getResponseCode() === 200) {
      var csvBlob = res.getBlob().setName('p31-accommodation-backup-' + dateStr + '.csv');

      var backupFolder;
      if (CONFIG.BACKUP_FOLDER_ID) {
        backupFolder = DriveApp.getFolderById(CONFIG.BACKUP_FOLDER_ID);
      } else {
        var folders = DriveApp.getFoldersByName('P31 Backups');
        backupFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder('P31 Backups');
      }

      backupFolder.createFile(csvBlob);
      logEvent_('BACKUP', 'Weekly backup saved: ' + csvBlob.getName());

      var files = backupFolder.getFilesByType('text/csv');
      var allFiles = [];
      while (files.hasNext()) allFiles.push(files.next());
      allFiles.sort(function (a, b) {
        return b.getDateCreated() - a.getDateCreated();
      });
      allFiles.slice(12).forEach(function (f) {
        f.setTrashed(true);
      });
    }
  } catch (e) {
    logEvent_('ERROR', 'Backup failed: ' + e.message);
    MailApp.sendEmail({
      to: CONFIG.ALERT_EMAIL,
      subject: 'P31 Weekly Backup Failed',
      body: 'Backup failed at ' + new Date().toISOString() + '\nError: ' + e.message,
    });
  }
}
