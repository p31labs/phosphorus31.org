/**
 * Runs every morning at 6:00 AM ET.
 * Creates the daily operations log entry, checks systems, sends morning brief.
 */
function dailyOps() {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'America/New_York', 'yyyy-MM-dd');
  const dayName = Utilities.formatDate(today, 'America/New_York', 'EEEE');

  const report = {
    date: dateStr,
    day: dayName,
    systems: checkAllSystems_(),
    tasks: getDailyTasks_(today),
    accommodationCount: getAccommodationCount_(dateStr),
  };

  logToOpsSheet_(report);
  sendMorningBrief_(report);
  createDailyAccommodationDoc_(dateStr);
}

/**
 * Check all P31 systems and return status object.
 */
function checkAllSystems_() {
  const status = {};

  try {
    const res = UrlFetchApp.fetch(CONFIG.WEBSITE_URL, { muteHttpExceptions: true });
    status.website = { up: res.getResponseCode() === 200, code: res.getResponseCode() };
  } catch (e) {
    status.website = { up: false, error: e.message };
  }

  try {
    const res = UrlFetchApp.fetch(CONFIG.SHELTER_HEALTH, { muteHttpExceptions: true });
    if (res.getResponseCode() === 200) {
      const data = JSON.parse(res.getContentText());
      status.shelter = { up: true, uptime: data.uptime, connections: data.websocket };
    } else {
      status.shelter = { up: false, code: res.getResponseCode() };
    }
  } catch (e) {
    status.shelter = { up: false, error: e.message };
  }

  try {
    const res = UrlFetchApp.fetch('https://doi.org/' + CONFIG.ZENODO_DOI, {
      muteHttpExceptions: true,
      followRedirects: false,
    });
    status.zenodo = { up: res.getResponseCode() === 302 || res.getResponseCode() === 200 };
  } catch (e) {
    status.zenodo = { up: false, error: e.message };
  }

  return status;
}

/**
 * Get tasks for today based on calendar and known schedule.
 */
function getDailyTasks_(date) {
  const tasks = [];
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  if (dayOfWeek === 1) tasks.push('Review weekly accommodation log');
  if (dayOfWeek === 3) tasks.push('Run database backup');
  if (dayOfMonth === 1) tasks.push('Export monthly accommodation summary');

  try {
    const events = CalendarApp.getDefaultCalendar().getEventsForDay(date);
    events.forEach(function (e) {
      tasks.push(e.getTitle());
    });
  } catch (e) {}

  return tasks;
}
