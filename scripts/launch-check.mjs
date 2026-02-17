#!/usr/bin/env node
/**
 * Run automatable launch checklist items (no server required).
 * 1) verify:assets
 * 2) npm test (Scope + Shelter unit tests)
 * Exit 0 = all pass; exit 1 = fix and re-run.
 * For full preflight (assets + health + integration), start Shelter then: npm run preflight
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function run(name, cmd, args = []) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: root, stdio: 'inherit', shell: true });
    child.on('close', (code) => resolve(code));
  });
}

async function main() {
  console.log('\n=== P31 Launch checklist (automated) ===\n');

  const assetCode = await run('verify:assets', 'npm', ['run', 'verify:assets']);
  if (assetCode !== 0) {
    console.error('\n❌ Asset verification failed. Run: npm run build:shelter, cd ui && npm run build');
    process.exit(1);
  }
  console.log('');

  const testCode = await run('npm test', 'npm', ['test']);
  if (testCode !== 0) {
    console.error('\n❌ Tests failed. Fix failing tests then run: npm run launch:check');
    process.exit(1);
  }

  console.log('\n✅ Launch check passed (assets + unit tests).');
  console.log('Next: Start Shelter (npm run dev:shelter), then run npm run preflight for full smoke test.');
  console.log('Human items: PREP_FOR_LAUNCH §1–2, §5b, §5f, §5i; docs/LAUNCH_CHECKLIST_COMPLETE.md\n');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
