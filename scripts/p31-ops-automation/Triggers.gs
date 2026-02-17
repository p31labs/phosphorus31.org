/**
 * Run ONCE to set up all time-based triggers.
 * In Apps Script: Run → setupAllTriggers (authorize when prompted).
 */
function setupAllTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('dailyOps')
    .timeBased()
    .atHour(6)
    .everyDays(1)
    .inTimezone('America/New_York')
    .create();

  ScriptApp.newTrigger('healthPulse')
    .timeBased()
    .everyMinutes(15)
    .create();

  ScriptApp.newTrigger('weeklyBackup')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(3)
    .inTimezone('America/New_York')
    .create();

  ScriptApp.newTrigger('syncAccommodationFromShelter')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(23)
    .inTimezone('America/New_York')
    .create();

  console.log('All triggers configured.');
  ScriptApp.getProjectTriggers().forEach(function (t) {
    console.log('  ' + t.getHandlerFunction() + ' → ' + t.getTriggerSource());
  });
}

function testHealthPulse() {
  healthPulse();
}
function testDailyOps() {
  dailyOps();
}
function testBackup() {
  weeklyBackup();
}
function testSync() {
  syncAccommodationFromShelter();
}
