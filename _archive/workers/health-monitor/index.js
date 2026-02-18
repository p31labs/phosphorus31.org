/**
 * P31 Health Monitor — Edge immune system
 * Runs on schedule (e.g. every 5 min); alerts on failure (rate-limited).
 * Deploy: Cloudflare Dashboard → Workers → Create, or wrangler deploy from this dir.
 *
 * Required: KV namespace P31_KV, env vars SHELTER_URL, WEBSITE_URL, ALERT_WEBHOOK (optional).
 */

function calculateUptime(log) {
  if (!log || log.length === 0) return 100;
  const total = log.length;
  const up = log.filter(
    (e) => e.results?.shelter?.ok && e.results?.website?.ok
  ).length;
  return Math.round((up / total) * 10000) / 100;
}

export default {
  async scheduled(event, env, ctx) {
    const results = {};

    try {
      const res = await fetch(env.SHELTER_URL + "/health", {
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      results.shelter = {
        status: res.status,
        uptime: data.uptime,
        ok: res.ok,
      };
    } catch (e) {
      results.shelter = { ok: false, error: String(e.message) };
    }

    try {
      const res = await fetch(env.WEBSITE_URL, {
        signal: AbortSignal.timeout(10000),
      });
      results.website = { status: res.status, ok: res.status === 200 };
    } catch (e) {
      results.website = { ok: false, error: String(e.message) };
    }

    const failures = Object.entries(results)
      .filter(([, v]) => !v.ok)
      .map(([k]) => k);

    if (failures.length > 0 && env.ALERT_WEBHOOK) {
      const lastAlert = await env.P31_KV.get("lastAlert");
      const now = Date.now();
      if (!lastAlert || now - parseInt(lastAlert, 10) > 3600000) {
        await fetch(env.ALERT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `P31 ALERT: ${failures.join(", ")} DOWN — ${new Date().toISOString()}`,
            results,
          }),
        });
        await env.P31_KV.put("lastAlert", now.toString());
      }
    }

    const log = JSON.parse((await env.P31_KV.get("healthLog")) || "[]");
    log.unshift({ time: new Date().toISOString(), results });
    await env.P31_KV.put("healthLog", JSON.stringify(log.slice(0, 100)));
  },

  async fetch(request, env) {
    const log = JSON.parse((await env.P31_KV.get("healthLog")) || "[]");
    const body = {
      name: "P31 Health Monitor",
      lastCheck: log[0]?.time || "never",
      lastResults: log[0]?.results || {},
      checksLast24h: log.filter(
        (e) => Date.now() - new Date(e.time).getTime() < 86400000
      ).length,
      uptimePercent: calculateUptime(log),
    };
    return new Response(JSON.stringify(body, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
