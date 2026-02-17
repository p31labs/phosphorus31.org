#!/usr/bin/env node
/**
 * LAUNCH-10: Asset verification — check that key build outputs exist.
 * Run from repo root: node scripts/verify-assets.mjs
 * Exit 0 = all required present; exit 1 = missing.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const required = [
  { path: path.join(root, 'apps', 'shelter', 'dist', 'index.js'), name: 'Shelter (apps/shelter/dist/index.js)' },
  { path: path.join(root, 'ui', 'dist', 'index.html'), name: 'Scope (ui/dist/index.html)' },
  { path: path.join(root, 'apps', 'web', 'index.html'), name: 'Website (apps/web/index.html)' },
];

const optional = [
  { path: path.join(root, 'apps', 'sprout', 'dist'), name: 'Sprout (apps/sprout/dist)' },
];

let failed = 0;
for (const { path: p, name } of required) {
  if (fs.existsSync(p)) {
    console.log('OK', name);
  } else {
    console.error('MISSING', name);
    failed++;
  }
}
for (const { path: p, name } of optional) {
  if (fs.existsSync(p)) {
    console.log('OK (optional)', name);
  } else {
    console.log('— (optional)', name, '(skip if not building Sprout)');
  }
}

if (failed > 0) {
  console.error('\nRun builds first, e.g.: cd apps/shelter && npm run build; cd ui && npm run build');
  process.exit(1);
}
console.log('\nAsset verification passed.');
process.exit(0);
