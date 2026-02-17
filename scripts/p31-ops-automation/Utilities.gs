/**
 * Log an event to the Ops Log spreadsheet.
 */
function logEvent_(type, message) {
  try {
    if (!CONFIG.OPS_LOG_ID) {
      console.log('[' + type + '] ' + message);
      return;
    }
    var sheet = SpreadsheetApp.openById(CONFIG.OPS_LOG_ID).getActiveSheet();
    sheet.appendRow([new Date().toISOString(), type, message]);
  } catch (e) {
    console.error('Failed to log: ' + e.message);
  }
}

/**
 * Send the morning briefing email.
 */
function sendMorningBrief_(report) {
  var systemLines = Object.keys(report.systems).map(function (name) {
    var s = report.systems[name];
    return (s.up ? 'OK ' : 'DOWN ') + name;
  }).join('\n');

  var taskLines = report.tasks.length > 0 ? report.tasks.join('\n') : '(no scheduled tasks)';

  MailApp.sendEmail({
    to: CONFIG.ALERT_EMAIL,
    subject: 'P31 Morning Brief — ' + report.day + ' ' + report.date,
    body:
      'P31 LABS — DAILY OPERATIONS BRIEF\n' +
      '═══════════════════════════════════\n\n' +
      'SYSTEMS:\n' + systemLines + '\n\n' +
      'TASKS:\n' + taskLines + '\n\n' +
      'ACCOMMODATION EVENTS (yesterday): ' + report.accommodationCount + '\n\n' +
      '───────────────────────────────────\n' +
      'phosphorus31.org | p31.io\n' +
      '"It\'s okay to be a little wonky."\n',
  });
}

/**
 * Get accommodation count for a given date from the tracker.
 */
function getAccommodationCount_(dateStr) {
  try {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yStr = Utilities.formatDate(yesterday, 'America/New_York', 'yyyy-MM-dd');

    if (!CONFIG.ACCOMMODATION_TRACKER_ID) return 'N/A';

    var sheet = SpreadsheetApp.openById(CONFIG.ACCOMMODATION_TRACKER_ID).getActiveSheet();
    var data = sheet.getDataRange().getValues();
    return data.filter(function (row) {
      return row[0] && row[0].toString().indexOf(yStr) === 0;
    }).length;
  } catch (e) {
    return 'Error';
  }
}

/**
 * Log to the ops sheet.
 */
function logToOpsSheet_(report) {
  var sysStr = Object.keys(report.systems).map(function (k) {
    var v = report.systems[k];
    return k + ':' + (v.up ? 'UP' : 'DOWN');
  }).join(', ');
  logEvent_('DAILY', 'Systems: ' + sysStr + ' | Tasks: ' + report.tasks.length + ' | Accommodation events: ' + report.accommodationCount);
}
