/**
 * P31 LABS — OPERATIONS AUTOMATION
 * Google Apps Script Command Center
 *
 * Copy this folder's .gs files into your Apps Script project:
 * https://script.google.com → Your project (1TrYuIoHpE2gofb_khQ8MhP0LR6Ba714tU6fvfa_kABpPyyR4EDXCa1Zi)
 *
 * Triggers:
 *   - Daily 6:00 AM ET: dailyOps()
 *   - Every 15 min: healthPulse()
 *   - Weekly Wed 3 AM: weeklyBackup()
 *   - Weekly Sun 11 PM: syncAccommodationFromShelter()
 */

// ═══ CONFIGURATION — Fill IDs after creating Drive folders and Sheets ═══
const CONFIG = {
  DRIVE_ROOT_ID: '',
  BACKUP_FOLDER_ID: '',
  LEGAL_FOLDER_ID: '',
  SHELTER_HEALTH: 'https://shelter.p31.io/health',
  WEBSITE_URL: 'https://phosphorus31.org',
  OPS_LOG_ID: '',
  ACCOMMODATION_TRACKER_ID: '',
  ALERT_EMAIL: 'willyj1587@gmail.com',
  ZENODO_DOI: '10.5281/zenodo.18627420',
};
