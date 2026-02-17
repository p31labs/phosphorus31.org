#!/usr/bin/env node
/**
 * LAUNCH-11: Pre-flight smoke test.
 * 1) Verify assets (required build outputs)
 * 2) Check Shelter /health
 * 3) Run integration test (LAUNCH-01)
 * Run from repo root: npm run preflight
 * Prerequisite: Build Shelter (and optionally Scope, Web). Start Shelter before running (or script will tell you).
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function runVerifyAssets() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, 'scripts', 'verify-assets.mjs')], {
      cwd: root,
      stdio: 'inherit',
    });
    child.on('close', (code) => resolve(code));
  });
}

async function checkHealth() {
  const BASE = 'http://localhost:4000';
  try {
    const res = await fetch(`${BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function runIntegrationTest() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, 'tests', 'integration.test.js')], {
      cwd: root,
      stdio: 'inherit',
    });
    child.on('close', (code) => resolve(code ?? 0));
  });
}

async function main() {
  console.log('\n=== P31 LAUNCH-11: Pre-flight smoke test ===\n');

  const assetCode = await runVerifyAssets();
  if (assetCode !== 0) {
    console.error('\nPreflight failed: asset verification failed. Run builds first (e.g. cd apps/shelter && npm run build).');
    process.exit(1);
  }

  const healthy = await checkHealth();
  if (!healthy) {
    console.error('\nPreflight failed: Shelter is not running at http://localhost:4000.');
    console.error('Start Shelter: npm run dev:shelter  (in another terminal)');
    console.error('Then run: npm run preflight');
    process.exit(1);
  }

  console.log('Shelter health OK. Running integration tests...\n');
  const testCode = await runIntegrationTest();
  if (testCode !== 0) {
    process.exit(testCode);
  }

  console.log('\n🔺 Pre-flight smoke test passed.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
