/**
 * Runs every 15 minutes.
 * Lightweight health check — alerts only on failure (rate-limited to 1/hour).
 */
function healthPulse() {
  const systems = checkAllSystems_();
  const failures = [];

  if (!systems.website || !systems.website.up) failures.push('Website DOWN');
  if (!systems.shelter || !systems.shelter.up) failures.push('Shelter API DOWN');

  if (failures.length > 0) {
    const cache = CacheService.getScriptCache();
    const lastAlert = cache.get('lastHealthAlert');
    const now = new Date().getTime();

    if (!lastAlert || now - parseInt(lastAlert, 10) > 3600000) {
      MailApp.sendEmail({
        to: CONFIG.ALERT_EMAIL,
        subject: 'P31 SYSTEM ALERT: ' + failures.join(', '),
        body:
          'P31 Health Check Failed\n\n' +
          'Time: ' + new Date().toISOString() + '\n' +
          'Failures: ' + failures.join(', ') + '\n\n' +
          'Details:\n' + JSON.stringify(systems, null, 2) + '\n\n' +
          'Check: https://shelter.p31.io/health\n' +
          'Website: https://phosphorus31.org',
      });
      cache.put('lastHealthAlert', now.toString(), 3600);
      logEvent_('ALERT', 'Health check failed: ' + failures.join(', '));
    }
  }
}
