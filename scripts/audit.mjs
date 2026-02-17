#!/usr/bin/env node
/**
 * P31 Full Audit Script
 * Port health, banned-word scan, legacy naming report, PII/secrets scan.
 * Output: markdown to stdout. Run from repo root: node scripts/audit.mjs
 *
 * "The mesh holds." — P31 Labs
 */

import fs from 'fs';
import path from 'path';
import { createConnection } from 'net';

const ROOT = path.resolve(process.cwd());
const AUDIT_DIRS = ['apps', 'ui', 'packages', 'p31-core', 'SUPER-CENTAUR', 'cognitive-shield', 'firmware/node-one-esp-idf', 'website', 'docs'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '_archive', 'build', '.next', 'coverage']);
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.gs', '.html', '.css', '.py', '.sh', '.ps1', '.bat']);

// P31 banned words (use launch/shelter/release/end instead)
const BANNED_WORDS = [
  /\bdeploy\b/gi, /\blockdown\b/gi, /\bkill\b/gi, /\bweapon\b/gi, /\bdefense\b/gi, /\bdefend\b/gi,
  /\battack\b/gi, /\btarget\b/gi, /\bintercept\b/gi, /\bbreach\b/gi, /\bthreat\b/gi, /\bstrike\b/gi,
  /\btactical\b/gi, /\boperative\b/gi, /\bshred\b/gi, /\bdestroy\b/gi, /\benemy\b/gi,
  /\bmission\b/gi, /\bcommand\b/gi, /\bexecute\b/gi, /\bterminate\b/gi, /\babort\b/gi,
  /\bwar\b/gi, /\bbattle\b/gi, /\bfight\b/gi, /\bcombat\b/gi
];

// Legacy naming (report only; do not use in new code)
const LEGACY_NAMING = [
  { pattern: /Phenix Navigator/gi, label: 'Phenix Navigator' },
  { pattern: /Genesis Gate|Genesis Gate/gi, label: 'Genesis Gate' },
  { pattern: /Wonky Sprout|wonky-sprout/gi, label: 'Wonky Sprout' },
  { pattern: /SIMPLEX/gi, label: 'SIMPLEX' },
  { pattern: /Cognitive Shield(?!.*P31)/gi, label: 'Cognitive Shield (prefer P31 Shelter)' },
  { pattern: /Node One(?!.*device|ESP|hardware)/gi, label: 'Node One (ambiguous: use NODE ONE device vs node one human)' },
  { pattern: /phenix-navigator-creator|phenix_phantom/gi, label: 'phenix-* path' },
];

// PII / secrets patterns (flag for review)
const PII_PATTERNS = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, label: 'SSN-like' },
  { pattern: /\b(20\d{2}[CV]\d+|case\s*#?\s*\d+)/gi, label: 'Case number-like' },
  { pattern: /\b(McGhan|Scarlett|GAL\s*[:\s])/gi, label: 'Legal name ref' },
  { pattern: /sk_live_|sk_test_|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}/i, label: 'API key-like' },
  { pattern: /BEGIN\s+(RSA\s+)?PRIVATE\s+KEY/i, label: 'Private key block' },
];

const PORTS = [
  { port: 3000, name: 'Centaur (P31 Tandem)' },
  { port: 4000, name: 'Buffer (P31 Shelter)' },
  { port: 5173, name: 'Scope (Vite dev)' },
];

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: '127.0.0.1' }, () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.setTimeout(1500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function* walkDir(dir, maxDepth = 6, depth = 0) {
  if (depth > maxDepth) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walkDir(full, maxDepth, depth + 1);
    } else if (e.isFile() && SOURCE_EXTS.has(path.extname(e.name))) {
      yield full;
    }
  }
}

function scanFile(filePath, patterns) {
  const rel = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const lines = content.split('\n');
  const hits = [];
  for (const { pattern, label } of patterns) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const m = line.match(pattern);
      if (m) hits.push({ file: rel, line: i + 1, label, match: m[0].slice(0, 40) });
    }
  }
  return hits;
}

async function main() {
  const out = [];
  const now = new Date().toISOString().slice(0, 10);

  out.push('# P31 Full Audit Report');
  out.push(`**Generated:** ${now}`);
  out.push('');
  out.push('---');
  out.push('');

  // 1. Port health
  out.push('## 1. Port health');
  out.push('');
  for (const { port, name } of PORTS) {
    const open = await checkPort(port);
    out.push(`- **${port}** (${name}): ${open ? '✅ Open' : '❌ Not listening'}`);
  }
  out.push('');

  // 2. Banned words (source only)
  out.push('## 2. Banned-word scan (P31 vocabulary)');
  out.push('');
  const bannedHits = [];
  for (const dir of AUDIT_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) continue;
    for (const file of walkDir(abs)) {
      const content = fs.readFileSync(file, 'utf8');
      for (const re of BANNED_WORDS) {
        const m = content.match(re);
        if (m) {
          bannedHits.push({ file: path.relative(ROOT, file), match: m[0] });
          break;
        }
      }
    }
  }
  if (bannedHits.length === 0) {
    out.push('No banned words found in audit directories.');
  } else {
    out.push(`Found **${bannedHits.length}** file(s) with banned terms. Replace with P31 vocabulary (launch, shelter, release, end, etc.).`);
    out.push('');
    const byFile = new Map();
    for (const h of bannedHits) {
      if (!byFile.has(h.file)) byFile.set(h.file, []);
      byFile.get(h.file).push(h.match);
    }
    for (const [file, matches] of byFile) {
      out.push(`- \`${file}\`: ${[...new Set(matches)].join(', ')}`);
    }
  }
  out.push('');

  // 3. Legacy naming (report only)
  out.push('## 3. Legacy naming (report only)');
  out.push('');
  const legacyHits = [];
  for (const dir of AUDIT_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) continue;
    for (const file of walkDir(abs)) {
      for (const { pattern, label } of LEGACY_NAMING) {
        const content = fs.readFileSync(file, 'utf8');
        if (pattern.test(content)) {
          legacyHits.push({ file: path.relative(ROOT, file), label });
          break;
        }
      }
    }
  }
  if (legacyHits.length === 0) {
    out.push('No legacy naming detected in audit directories.');
  } else {
    out.push(`Found **${legacyHits.length}** file(s) with legacy naming. Prefer P31 names (P31 Compass, P31 Entangle, P31 Shelter, etc.).`);
    out.push('');
    const byLabel = new Map();
    for (const h of legacyHits) {
      if (!byLabel.has(h.label)) byLabel.set(h.label, []);
      byLabel.get(h.label).push(h.file);
    }
    for (const [label, files] of byLabel) {
      out.push(`- **${label}**: ${files.slice(0, 5).join(', ')}${files.length > 5 ? ` (+${files.length - 5} more)` : ''}`);
    }
  }
  out.push('');

  // 4. PII / secrets
  out.push('## 4. PII / secrets scan');
  out.push('');
  const piiHits = [];
  for (const dir of AUDIT_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) continue;
    for (const file of walkDir(abs)) {
      const hits = scanFile(file, PII_PATTERNS);
      piiHits.push(...hits);
    }
  }
  if (piiHits.length === 0) {
    out.push('No PII or obvious secrets detected in audit directories.');
  } else {
    out.push(`⚠️ **${piiHits.length}** potential PII/secret hit(s). Review before any public push.`);
    out.push('');
    for (const h of piiHits.slice(0, 15)) {
      out.push(`- \`${h.file}\`:${h.line} — ${h.label}`);
    }
    if (piiHits.length > 15) out.push(`- ... and ${piiHits.length - 15} more`);
  }
  out.push('');
  out.push('---');
  out.push('');
  out.push('*Run tests: `npm test` or `npm run test:all`. See AUDIT_AND_TEST_SUITE.md.*');
  out.push('');
  out.push('🔺 The mesh holds.');

  console.log(out.join('\n'));
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
