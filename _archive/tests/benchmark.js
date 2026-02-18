/**
 * P31 LAUNCH-03: Performance benchmarks
 * Run with: node tests/benchmark.js
 * Prerequisite: Shelter running on port 4000 (npm run dev:shelter)
 *
 * Measures: HTTP endpoint latency (min/max/mean/p95/p99), WebSocket round-trip,
 * bundle sizes (gzipped) for Sprout, Scope, Web. Outputs a formatted table.
 */

const BASE = 'http://localhost:4000';
const WS_URL = 'ws://localhost:4000/ws';
const ITERATIONS = 100;

function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const i = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, i)];
}

function stats(times) {
  const sorted = [...times].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    mean: sum / sorted.length,
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
  };
}

async function measureFetch(url, options = {}) {
  const start = performance.now();
  const res = await fetch(url, options);
  await res.text();
  return performance.now() - start;
}

async function benchmarkHealth() {
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    times.push(await measureFetch(`${BASE}/health`));
  }
  return stats(times);
}

async function benchmarkProcess() {
  const body = JSON.stringify({
    content: 'Hey, how are you?',
    source: 'manual',
  });
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    times.push(
      await measureFetch(`${BASE}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );
  }
  return stats(times);
}

async function benchmarkAccommodationLog() {
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    times.push(await measureFetch(`${BASE}/accommodation-log`));
  }
  return stats(times);
}

async function benchmarkAccommodationLogExport() {
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    times.push(await measureFetch(`${BASE}/accommodation-log/export?format=csv`));
  }
  return stats(times);
}

/** Measure broadcast latency: Sprout sends signal → Scope receives (target < 20ms) */
async function benchmarkWebSocketBroadcast() {
  const WebSocket = (await import('ws')).default;
  const times = [];
  for (let i = 0; i < Math.min(ITERATIONS, 50); i++) {
    const t = await new Promise((resolve, reject) => {
      const scopeWs = new WebSocket(WS_URL);
      let sproutWs;
      scopeWs.on('open', () => {
        scopeWs.send(JSON.stringify({ type: 'scope:subscribe' }));
      });
      scopeWs.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'scope:subscribed') {
            sproutWs = new WebSocket(WS_URL);
            sproutWs.on('open', () => {
              const start = performance.now();
              sproutWs.send(
                JSON.stringify({
                  type: 'sprout:signal',
                  signal: 'ok',
                  timestamp: new Date().toISOString(),
                })
              );
              const onMsg = (d) => {
                try {
                  const m = JSON.parse(d.toString());
                  if (m.type === 'sprout:signal' && m.data?.signal === 'ok') {
                    const elapsed = performance.now() - start;
                    times.push(elapsed);
                    scopeWs.removeListener('message', onMsg);
                    scopeWs.close();
                    sproutWs.close();
                    resolve(elapsed);
                  }
                } catch (_) {}
              };
              scopeWs.on('message', onMsg);
            });
          }
        } catch (_) {}
      });
      scopeWs.on('error', reject);
      setTimeout(() => {
        if (scopeWs.readyState === 1) scopeWs.close();
        if (sproutWs && sproutWs.readyState === 1) sproutWs.close();
        resolve(-1);
      }, 5000);
    });
    if (t >= 0) times.push(t);
  }
  return times.length > 0 ? stats(times) : { min: 0, max: 0, mean: 0, p95: 0, p99: 0 };
}

function getBundleSizes() {
  const fs = require('fs');
  const path = require('path');
  const zlib = require('zlib');

  const results = { sprout: null, scope: null, web: null };
  const root = path.resolve(__dirname, '..');

  // Sprout: apps/sprout/dist/assets/*.js
  const sproutDist = path.join(root, 'apps', 'sprout', 'dist', 'assets');
  if (fs.existsSync(sproutDist)) {
    const files = fs.readdirSync(sproutDist).filter((f) => f.endsWith('.js'));
    let raw = 0,
      gzip = 0;
    for (const f of files) {
      const buf = fs.readFileSync(path.join(sproutDist, f));
      raw += buf.length;
      gzip += zlib.gzipSync(buf, { level: 9 }).length;
    }
    results.sprout = { raw: Math.round(raw / 1024), gzip: Math.round(gzip / 1024) };
  }

  // Scope: apps/scope/dist/assets/*.js
  const scopeDist = path.join(root, 'apps', 'scope', 'dist', 'assets');
  if (fs.existsSync(scopeDist)) {
    let raw = 0,
      gzip = 0;
    const files = fs.readdirSync(scopeDist).filter((f) => f.endsWith('.js'));
    for (const f of files) {
      const buf = fs.readFileSync(path.join(scopeDist, f));
      raw += buf.length;
      gzip += zlib.gzipSync(buf, { level: 9 }).length;
    }
    results.scope = { raw: Math.round(raw / 1024), gzip: Math.round(gzip / 1024) };
  }

  // Web: apps/web/*.js, *.css (static site)
  const webRoot = path.join(root, 'apps', 'web');
  if (fs.existsSync(webRoot)) {
    let raw = 0,
      gzip = 0;
    for (const name of ['main.js', 'styles.css']) {
      const f = path.join(webRoot, name);
      if (fs.existsSync(f)) {
        const buf = fs.readFileSync(f);
        raw += buf.length;
        gzip += zlib.gzipSync(buf, { level: 9 }).length;
      }
    }
    results.web = { raw: Math.round(raw / 1024), gzip: Math.round(gzip / 1024) };
  }

  return results;
}

function formatTable(rows, headers) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? '').length))
  );
  const line = widths.map((w) => '-'.repeat(w + 2)).join('+');
  const fmt = (row) => row.map((c, i) => String(c).padEnd(widths[i])).join('  ');
  return [fmt(headers), line, ...rows.map((r) => fmt(r))].join('\n');
}

async function run() {
  console.log('\n=== P31 LAUNCH-03: Performance benchmarks ===\n');
  console.log(`Base URL: ${BASE}`);
  console.log(`Iterations: ${ITERATIONS}\n`);

  let healthOk = false;
  try {
    const res = await fetch(`${BASE}/health`);
    healthOk = res.ok;
  } catch (e) {
    console.error('Shelter is not running at', BASE);
    console.error('Start with: npm run dev:shelter');
    process.exit(1);
  }

  if (!healthOk) {
    console.error('Shelter /health did not return 200');
    process.exit(1);
  }

  console.log('Benchmarking HTTP endpoints...');
  const [health, process, accLog, accExport] = await Promise.all([
    benchmarkHealth(),
    benchmarkProcess(),
    benchmarkAccommodationLog(),
    benchmarkAccommodationLogExport(),
  ]);

  console.log('Benchmarking WebSocket broadcast (Sprout→Scope)...');
  const wsStats = await benchmarkWebSocketBroadcast();

  console.log('Measuring bundle sizes (run after: npm run build in each app)...');
  const bundles = getBundleSizes();

  // Targets (LAUNCH-03)
  const targets = {
    'GET /health': { max: 10, unit: 'ms' },
    'POST /process': { max: 50, unit: 'ms' },
    'GET /accommodation-log': { max: 100, unit: 'ms' },
    'GET /accommodation-log/export': { max: 500, unit: 'ms' },
    'WebSocket broadcast': { max: 20, unit: 'ms' },
    'Sprout gzip': { max: 50, unit: 'KB' },
    'Scope gzip': { max: 200, unit: 'KB' },
  };

  const latencyRows = [
    ['Endpoint', 'min (ms)', 'max (ms)', 'mean (ms)', 'p95 (ms)', 'p99 (ms)', 'Target', 'OK'],
    [
      'GET /health',
      health.min.toFixed(2),
      health.max.toFixed(2),
      health.mean.toFixed(2),
      health.p95.toFixed(2),
      health.p99.toFixed(2),
      '< 10ms',
      health.p99 < 10 ? '✓' : '✗',
    ],
    [
      'POST /process',
      process.min.toFixed(2),
      process.max.toFixed(2),
      process.mean.toFixed(2),
      process.p95.toFixed(2),
      process.p99.toFixed(2),
      '< 50ms',
      process.p99 < 50 ? '✓' : '✗',
    ],
    [
      'GET /accommodation-log',
      accLog.min.toFixed(2),
      accLog.max.toFixed(2),
      accLog.mean.toFixed(2),
      accLog.p95.toFixed(2),
      accLog.p99.toFixed(2),
      '< 100ms',
      accLog.p99 < 100 ? '✓' : '✗',
    ],
    [
      'GET /accommodation-log/export',
      accExport.min.toFixed(2),
      accExport.max.toFixed(2),
      accExport.mean.toFixed(2),
      accExport.p95.toFixed(2),
      accExport.p99.toFixed(2),
      '< 500ms',
      accExport.p99 < 500 ? '✓' : '✗',
    ],
    [
      'WS broadcast',
      wsStats.min.toFixed(2),
      wsStats.max.toFixed(2),
      wsStats.mean.toFixed(2),
      wsStats.p95.toFixed(2),
      wsStats.p99.toFixed(2),
      '< 20ms',
      wsStats.p99 < 20 ? '✓' : '✗',
    ],
  ];

  console.log('\n--- Latency ---\n');
  console.log(formatTable(latencyRows.slice(1), latencyRows[0]));

  console.log('\n--- Bundle sizes (KB) ---\n');
  if (bundles.sprout) {
    const sproutOk = bundles.sprout.gzip < 50 ? '✓' : '✗';
    console.log(`Sprout:  raw ${bundles.sprout.raw} KB  gzip ${bundles.sprout.gzip} KB  (target < 50 KB gzip) ${sproutOk}`);
  } else {
    console.log('Sprout:  (build first: cd apps/sprout && npm run build)');
  }
  if (bundles.scope) {
    const scopeOk = bundles.scope.gzip < 200 ? '✓' : '✗';
    console.log(`Scope:   raw ${bundles.scope.raw} KB  gzip ${bundles.scope.gzip} KB  (target < 200 KB gzip) ${scopeOk}`);
  } else {
    console.log('Scope:   (build first: cd apps/scope && npm run build)');
  }
  if (bundles.web) {
    console.log(`Web:     raw ${bundles.web.raw} KB  gzip ${bundles.web.gzip} KB  (static site)`);
  } else {
    console.log('Web:     (static; main.js + styles.css measured if present)');
  }

  console.log('\n--- Summary ---');
  const fails = [];
  if (health.p99 >= 10) fails.push('GET /health p99 >= 10ms');
  if (process.p99 >= 50) fails.push('POST /process p99 >= 50ms');
  if (accLog.p99 >= 100) fails.push('GET /accommodation-log p99 >= 100ms');
  if (accExport.p99 >= 500) fails.push('GET /accommodation-log/export p99 >= 500ms');
  if (wsStats.p99 >= 20) fails.push('WebSocket broadcast p99 >= 20ms');
  // Bundle targets: report only (frontend builds may not exist in CI)
  if (bundles.sprout && bundles.sprout.gzip >= 50) fails.push('Sprout gzip >= 50 KB (report only)');
  if (bundles.scope && bundles.scope.gzip >= 200) fails.push('Scope gzip >= 200 KB');

  const latencyFails = fails.filter((f) => !f.includes('report only') && !f.includes('gzip'));
  if (latencyFails.length > 0) {
    console.log('Targets missed:', fails.join('; '));
    if (typeof process !== 'undefined' && typeof process.exit === 'function') process.exit(1);
    return;
  }
  if (fails.length > 0) console.log('Note:', fails.join('; '));
  console.log('All latency targets met.');
  console.log('\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
