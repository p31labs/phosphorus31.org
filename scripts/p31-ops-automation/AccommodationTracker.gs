/**
 * Creates a daily Google Doc for accommodation logging.
 * Pre-filled template with date, time slots, and entry fields.
 * Use for ADA reasonable accommodation evidence (fill operator name only in filed documents).
 */
function createDailyAccommodationDoc_(dateStr) {
  var folder;
  try {
    var folders = DriveApp.getFoldersByName('P31 Accommodation Logs');
    folder = folders.hasNext() ? folders.next() : DriveApp.createFolder('P31 Accommodation Logs');
  } catch (e) {
    folder = DriveApp.createFolder('P31 Accommodation Logs');
  }

  var docName = 'Accommodation Log — ' + dateStr;
  var existing = folder.getFilesByName(docName);
  if (existing.hasNext()) return;

  var doc = DocumentApp.create(docName);
  var body = doc.getBody();

  body.appendParagraph('P31 LABS — ACCOMMODATION LOG').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Date: ' + dateStr).setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('ADA Reasonable Accommodation Evidence — [Operator; add legal name only when filing]');
  body.appendHorizontalRule();

  for (var i = 0; i < 6; i++) {
    body.appendParagraph('Entry ' + (i + 1)).setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendTable([
      ['Time', ''],
      ['Trigger', ''],
      ['Tool/Strategy Used', ''],
      ['Outcome', ''],
      ['Voltage Level', 'GREEN / AMBER / RED / BLACK'],
    ]);
    body.appendParagraph('');
  }

  body.appendHorizontalRule();
  body.appendParagraph('DAILY SUMMARY').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendTable([
    ['Overall Energy (1-10)', ''],
    ['Calcium Symptoms', 'Y / N'],
    ['Sleep (hours)', ''],
    ['Medications On Time', 'Y / N'],
    ['Meals', ''],
    ['Sensory Overload Events', ''],
    ['Notes', ''],
  ]);

  var file = DriveApp.getFileById(doc.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  doc.saveAndClose();
  logEvent_('DOC', 'Created accommodation log: ' + docName);
}

/**
 * Pull accommodation data from Shelter API and sync to Sheet. Run weekly or on-demand.
 */
function syncAccommodationFromShelter() {
  try {
    var url = CONFIG.SHELTER_HEALTH.replace('/health', '/accommodation-log?limit=500');
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    if (res.getResponseCode() !== 200) {
      logEvent_('ERROR', 'Failed to fetch accommodation log: ' + res.getResponseCode());
      return;
    }

    var events = JSON.parse(res.getContentText());

    if (!CONFIG.ACCOMMODATION_TRACKER_ID) {
      logEvent_('WARN', 'No accommodation tracker spreadsheet configured');
      return;
    }

    var sheet = SpreadsheetApp.openById(CONFIG.ACCOMMODATION_TRACKER_ID).getActiveSheet();
    var existingData = sheet.getDataRange().getValues();
    var existingTimestamps = {};
    existingData.forEach(function (row) {
      existingTimestamps[row[0]] = true;
    });

    var newEvents = events.filter(function (e) {
      return !existingTimestamps[e.timestamp];
    });

    newEvents.forEach(function (e) {
      sheet.appendRow([
        e.timestamp,
        e.event_type || '',
        e.signal || '',
        e.voltage_before || '',
        e.voltage_after || '',
        e.source || '',
        e.accommodation_type || '',
      ]);
    });

    logEvent_('SYNC', 'Synced ' + newEvents.length + ' new accommodation events');
  } catch (e) {
    logEvent_('ERROR', 'Accommodation sync failed: ' + e.message);
  }
}
