import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rewrite map: old pattern → new pattern
const rewrites = [
  // Fix store/ → stores/ (singular to plural)
  {
    pattern: /from\s+['"]\.\.\/store\//g,
    replacement: "from '../stores/",
    description: "Fix store/ → stores/ (relative parent)"
  },
  {
    pattern: /from\s+['"]\.\/store\//g,
    replacement: "from './stores/",
    description: "Fix store/ → stores/ (relative current)"
  },
  {
    pattern: /from\s+['"]\.\.\/\.\.\/store\//g,
    replacement: "from '../../stores/",
    description: "Fix store/ → stores/ (relative grandparent)"
  },
  {
    pattern: /from\s+['"]\.\.\/\.\.\/\.\.\/store\//g,
    replacement: "from '../../../stores/",
    description: "Fix store/ → stores/ (relative great-grandparent)"
  },
  // Fix services/geodesic-engine → engine/geodesic-engine
  {
    pattern: /from\s+['"]\.\.\/services\/geodesic-engine['"]/g,
    replacement: "from '../engine/geodesic-engine'",
    description: "Fix services/geodesic-engine → engine/geodesic-engine (relative parent)"
  },
  {
    pattern: /from\s+['"]\.\/services\/geodesic-engine['"]/g,
    replacement: "from './engine/geodesic-engine'",
    description: "Fix services/geodesic-engine → engine/geodesic-engine (relative current)"
  },
  {
    pattern: /from\s+['"]\.\.\/\.\.\/services\/geodesic-engine['"]/g,
    replacement: "from '../../engine/geodesic-engine'",
    description: "Fix services/geodesic-engine → engine/geodesic-engine (relative grandparent)"
  },
];

// Recursively find all TypeScript/TSX files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, coverage, etc.
      if (!['node_modules', 'dist', 'coverage', '.git', '.vscode'].includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Apply rewrites to a file
function rewriteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const changes = [];
  
  for (const rewrite of rewrites) {
    const matches = content.match(rewrite.pattern);
    if (matches) {
      content = content.replace(rewrite.pattern, rewrite.replacement);
      modified = true;
      changes.push(`${rewrite.description}: ${matches.length} matches`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return changes;
  }
  
  return null;
}

// Main execution
console.log('🔧 Starting import path rewrites...\n');

const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir);

console.log(`📁 Found ${files.length} files to check\n`);

let totalRewrites = 0;
const modifiedFiles = [];

for (const file of files) {
  const changes = rewriteFile(file);
  if (changes) {
    const relativePath = path.relative(__dirname, file);
    modifiedFiles.push({ file: relativePath, changes });
    totalRewrites += changes.length;
    console.log(`✅ ${relativePath}`);
    changes.forEach(change => console.log(`   ${change}`));
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files modified: ${modifiedFiles.length}`);
console.log(`   Total rewrites: ${totalRewrites}`);

if (modifiedFiles.length > 0) {
  console.log(`\n✅ Import path rewrites complete!`);
} else {
  console.log(`\n✨ No rewrites needed - all paths are correct.`);
}
