// AUTO-FIXER FOR NON-COMPLIANT PAGES
// Converts custom layouts to foundation structure

const fs = require('fs');
const path = require('path');

console.log('🔧 G.O.D. AUTO-FIXER');
console.log('===================\n');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// ============================================
// FIND NON-COMPLIANT PAGES
// ============================================

function findPages(dir, exclude = []) {
  const results = [];
  
  if (!fs.existsSync(dir)) return results;
  
  function scan(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      
      for (const file of files) {
        const fullPath = path.join(currentDir, file);
        
        if (exclude.some(ex => fullPath.includes(ex))) continue;
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scan(fullPath);
          } else if (file === 'page.tsx') {
            results.push(fullPath);
          }
        } catch (err) {}
      }
    } catch (err) {}
  }
  
  scan(dir);
  return results;
}

// ============================================
// CHECK IF PAGE IS COMPLIANT
// ============================================

function isCompliant(content) {
  return content.includes('ModulePage') && content.includes('ModuleCard');
}

// ============================================
// EXTRACT PAGE INFO
// ============================================

function extractPageInfo(filepath, content) {
  // Get page name from path
  const parts = filepath.split(path.sep);
  const pageDir = parts[parts.length - 2];
  const pageName = pageDir
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  
  // Try to extract existing title
  let title = pageName;
  const titleMatch = content.match(/<h[12][^>]*>([^<]+)<\/h[12]>/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  // Try to extract existing content
  let mainContent = '<p className="text-gray-300">Content migrated from previous layout.</p>';
  
  // Look for main content div
  const contentMatch = content.match(/<div[^>]*className="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (contentMatch) {
    mainContent = contentMatch[1].trim();
  }
  
  return { title, mainContent };
}

// ============================================
// GENERATE COMPLIANT PAGE
// ============================================

function generateCompliantPage(title, content) {
  return `import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';

export default function Page() {
  return (
    <ModulePage>
      <ModuleCard 
        title="${title}"
        subtitle="Updated to foundation structure"
      >
        <div className="space-y-4">
          ${content}
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
`;
}

// ============================================
// FIX PAGE
// ============================================

function fixPage(filepath, dryRun = false) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    
    // Skip if already compliant
    if (isCompliant(content)) {
      return { status: 'skip', reason: 'Already compliant' };
    }
    
    // Skip special pages
    const specialPages = ['_not-found', 'layout.tsx', 'not-found', 'error'];
    if (specialPages.some(sp => filepath.includes(sp))) {
      return { status: 'skip', reason: 'Special page' };
    }
    
    // Extract info
    const { title, mainContent } = extractPageInfo(filepath, content);
    
    // Generate new content
    const newContent = generateCompliantPage(title, mainContent);
    
    if (!dryRun) {
      // Backup original
      const backupPath = filepath + '.backup';
      fs.writeFileSync(backupPath, content);
      
      // Write new content
      fs.writeFileSync(filepath, newContent);
      
      return { status: 'fixed', title, backup: backupPath };
    } else {
      return { status: 'would-fix', title };
    }
  } catch (err) {
    return { status: 'error', error: err.message };
  }
}

// ============================================
// MAIN
// ============================================

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const autoConfirm = args.includes('--yes') || args.includes('-y');

if (dryRun) {
  console.log(`${colors.yellow}DRY RUN MODE - No files will be modified${colors.reset}\n`);
}

// Find all pages
const pages = findPages('src/app', ['node_modules', '.next']);

console.log(`Found ${pages.length} page files\n`);

// Check each page
const nonCompliant = [];

for (const page of pages) {
  const content = fs.readFileSync(page, 'utf-8');
  if (!isCompliant(content)) {
    const specialPages = ['_not-found', 'layout.tsx', 'not-found', 'error'];
    if (!specialPages.some(sp => page.includes(sp))) {
      nonCompliant.push(page);
    }
  }
}

console.log(`${colors.red}${nonCompliant.length} non-compliant pages found${colors.reset}\n`);

if (nonCompliant.length === 0) {
  console.log(`${colors.green}✅ All pages are compliant!${colors.reset}\n`);
  process.exit(0);
}

// Show pages to fix
console.log('Pages to fix:');
nonCompliant.slice(0, 10).forEach(p => {
  console.log(`  - ${path.relative(process.cwd(), p)}`);
});

if (nonCompliant.length > 10) {
  console.log(`  ... and ${nonCompliant.length - 10} more\n`);
} else {
  console.log('');
}

// Confirm
if (!autoConfirm && !dryRun) {
  console.log(`${colors.yellow}WARNING: This will modify ${nonCompliant.length} files${colors.reset}`);
  console.log('Original files will be backed up with .backup extension\n');
  console.log('Options:');
  console.log('  --dry-run    Show what would be fixed without modifying files');
  console.log('  --yes, -y    Skip confirmation\n');
  console.log('Press Ctrl+C to cancel, or run with --dry-run first\n');
  
  // In Node.js script, we can't easily prompt for input
  // So require explicit --yes flag for safety
  console.log(`${colors.red}ERROR: Please run with --yes flag to confirm${colors.reset}`);
  process.exit(1);
}

// Fix pages
console.log('Processing pages...\n');

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const page of nonCompliant) {
  const relativePath = path.relative(process.cwd(), page);
  const result = fixPage(page, dryRun);
  
  switch (result.status) {
    case 'fixed':
      console.log(`${colors.green}✓${colors.reset} Fixed: ${relativePath}`);
      console.log(`  Title: "${result.title}"`);
      console.log(`  Backup: ${result.backup}\n`);
      fixed++;
      break;
      
    case 'would-fix':
      console.log(`${colors.cyan}→${colors.reset} Would fix: ${relativePath}`);
      console.log(`  Title: "${result.title}"\n`);
      fixed++;
      break;
      
    case 'skip':
      console.log(`${colors.yellow}⊘${colors.reset} Skipped: ${relativePath} (${result.reason})\n`);
      skipped++;
      break;
      
    case 'error':
      console.log(`${colors.red}✗${colors.reset} Error: ${relativePath}`);
      console.log(`  ${result.error}\n`);
      errors++;
      break;
  }
}

// Summary
console.log('======================================');
console.log(`${colors.cyan}SUMMARY${colors.reset}`);
console.log('======================================\n');

if (dryRun) {
  console.log(`Would fix: ${fixed} pages`);
  console.log(`Would skip: ${skipped} pages`);
  console.log(`Errors: ${errors} pages\n`);
  console.log('Run without --dry-run to apply changes\n');
} else {
  console.log(`Fixed: ${fixed} pages`);
  console.log(`Skipped: ${skipped} pages`);
  console.log(`Errors: ${errors} pages\n`);
  
  if (fixed > 0) {
    console.log(`${colors.green}✅ Pages converted to foundation structure${colors.reset}\n`);
    console.log('Next steps:');
    console.log('1. Review the changes');
    console.log('2. Run: npm run audit');
    console.log('3. Test the pages');
    console.log('4. Delete .backup files if satisfied\n');
    console.log('To restore backups:');
    console.log('  find src/app -name "*.backup" -exec bash -c \'mv "$0" "${0%.backup}"\' {} \\;\n');
  }
  
  if (errors > 0) {
    console.log(`${colors.yellow}⚠️  Some pages had errors and were not fixed${colors.reset}`);
    console.log('Review the errors above and fix manually\n');
  }
}

process.exit(errors > 0 ? 1 : 0);
