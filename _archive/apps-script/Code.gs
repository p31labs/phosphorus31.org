// apps-script/Code.gs
// SIMPLEX v6 - P31 Event Receiver
// FDA Classification: 21 CFR §890.3710 - Powered Communication System

/**
 * Handle POST requests from Buffer, Scope, and Node One
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const event = data.event;
    const payload = data.payload || {};
    const target = data.target || 'unknown';

    Logger.log('Received event: ' + event + ' from ' + target);

    switch (event) {
      case 'voltage_high':
        logVoltageSpike(payload);
        sendCaregiverNotification(payload);
        break;
      case 'spoon_checkin':
        logSpoonCheckin(payload);
        break;
      case 'accommodation_logged':
        logAccommodation(payload);
        break;
      case 'message_triaged':
        logMessageTriage(payload);
        break;
      case 'haptic_triggered':
        logHapticEvent(payload);
        break;
      case 'lora_message':
        logLoRaMesh(payload);
        break;
      default:
        Logger.log('Unknown event: ' + event);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function logVoltageSpike(payload) {
  const sheet = getOrCreateSheet('Biometrics');
  if (!sheet) return;
  sheet.appendRow([
    new Date(payload.timestamp || Date.now()),
    payload.value,
    payload.source || '',
    payload.context || '',
  ]);
}

function logSpoonCheckin(payload) {
  const sheet = getOrCreateSheet('Energy');
  if (!sheet) return;
  const activities = Array.isArray(payload.activities) ? payload.activities.join(', ') : '';
  sheet.appendRow([
    new Date(payload.timestamp || Date.now()),
    payload.level,
    activities,
  ]);
}

function logAccommodation(payload) {
  const sheet = getOrCreateSheet('Accommodations');
  if (!sheet) return;
  sheet.appendRow([
    new Date(payload.timestamp || Date.now()),
    payload.pattern || '',
    payload.effectiveness || '',
  ]);
}

function logMessageTriage(payload) {
  const sheet = getOrCreateSheet('Messages');
  if (!sheet) return;
  sheet.appendRow([
    new Date(payload.timestamp || Date.now()),
    payload.subject || '',
    payload.priority || '',
    payload.action || '',
  ]);
}

function logHapticEvent(payload) {
  const sheet = getOrCreateSheet('Haptics');
  if (!sheet) return;
  sheet.appendRow([
    new Date(payload.timestamp || Date.now()),
    payload.pattern || '',
    payload.trigger || '',
    payload.effectiveness || '',
  ]);
}

function logLoRaMesh(payload) {
  const sheet = getOrCreateSheet('LoRa_Mesh');
  if (!sheet) return;
  sheet.appendRow([
    new Date(payload.timestamp || Date.now()),
    payload.from || '',
    payload.to || '',
    payload.message || '',
    payload.rssi || '',
  ]);
}

function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function sendCaregiverNotification(payload) {
  // TODO: Implement email/SMS to designated caregiver
  // For MATA demo, this can be a stub
  Logger.log('Would notify caregiver: Voltage ' + (payload.value || 0) + '/10');
}
