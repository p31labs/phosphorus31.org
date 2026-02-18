// MASTER AUDIT - Cross-platform Node.js version
// Comprehensive codebase analysis

const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

let violations = 0;
let warnings = 0;

console.log(`${colors.cyan}🔍 G.O.D. MASTER AUDIT${colors.reset}`);
console.log('=====================\n');

// ============================================
// UTILITY FUNCTIONS
// ============================================

function findFiles(dir, pattern, exclude = []) {
  const results = [];
  
  if (!fs.existsSync(dir)) return results;
  
  function scan(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      
      for (const file of files) {
        const fullPath = path.join(currentDir, file);
        
        // Skip excluded paths
        if (exclude.some(ex => fullPath.includes(ex))) continue;
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scan(fullPath);
          } else if (pattern.test(file)) {
            results.push(fullPath);
          }
        } catch (err) {
          // Skip files we can't read
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  scan(dir);
  return results;
}

function checkFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch {
    return null;
  }
}

// ============================================
// 1. PAGE COMPONENT STRUCTURE
// ============================================

console.log(`${colors.cyan}1. PAGE COMPONENTS${colors.reset}`);
console.log('   Checking all page.tsx files...');

const pageFiles = findFiles(
  'src/app',
  /page\.tsx$/,
  ['node_modules', '.next']
);

const specialPages = ['_not-found', 'layout.tsx', 'not-found'];

let pageViolations = 0;

if (pageFiles.length === 0) {
  console.log(`   ${colors.yellow}⚠️  No page files found${colors.reset}`);
  warnings++;
} else {
  console.log(`   Found ${pageFiles.length} page files`);
  
  for (const file of pageFiles) {
    // Skip special pages
    if (specialPages.some(sp => file.includes(sp))) continue;
    
    const content = checkFile(file);
    if (!content) continue;
    
    const relativePath = path.relative(process.cwd(), file);
    
    // Check for ModulePage
    if (!content.includes('ModulePage')) {
      console.log(`   ${colors.red}❌ ${relativePath} - Missing ModulePage${colors.reset}`);
      violations++;
      pageViolations++;
    }
    
    // Check for ModuleCard
    if (!content.includes('ModuleCard')) {
      console.log(`   ${colors.red}❌ ${relativePath} - Missing ModuleCard${colors.reset}`);
      violations++;
      pageViolations++;
    }
    
    // Check for custom positioning
    if (content.match(/\b(absolute|fixed)\b/) && !content.includes('// ')) {
      console.log(`   ${colors.yellow}⚠️  ${relativePath} - Uses absolute/fixed positioning${colors.reset}`);
      warnings++;
    }
    
    // Check for full-screen divs
    if (content.match(/w-full.*h-full|h-full.*w-full/)) {
      console.log(`   ${colors.yellow}⚠️  ${relativePath} - Full-screen div detected${colors.reset}`);
      warnings++;
    }
  }
  
  if (pageViolations === 0) {
    console.log(`   ${colors.green}✓ All pages use foundation${colors.reset}`);
  }
}

console.log('');

// ============================================
// 2. CORE COMPONENTS EXIST
// ============================================

console.log(`${colors.cyan}2. CORE COMPONENTS${colors.reset}`);
console.log('   Checking foundation components...');

const coreComponents = [
  'src/components/core/ModulePage.tsx',
  'src/components/core/ModuleCard.tsx',
  'src/components/core/Form.tsx',
];

for (const component of coreComponents) {
  if (fs.existsSync(component)) {
    console.log(`   ${colors.green}✓ ${component}${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ ${component} - NOT FOUND${colors.reset}`);
    violations++;
  }
}

console.log('');

// ============================================
// 3. LAYOUT STRUCTURE
// ============================================

console.log(`${colors.cyan}3. ROOT LAYOUT${colors.reset}`);
console.log('   Checking layout structure...');

const layoutPath = 'src/app/layout.tsx';
if (fs.existsSync(layoutPath)) {
  const layout = checkFile(layoutPath);
  
  if (layout.includes('fixed')) {
    console.log(`   ${colors.green}✓ Canvas layer uses fixed positioning${colors.reset}`);
  } else {
    console.log(`   ${colors.yellow}⚠️  Canvas layer may not be fixed${colors.reset}`);
    warnings++;
  }
  
  if (layout.match(/z-0|z-10/)) {
    console.log(`   ${colors.green}✓ Z-index layering present${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ Missing z-index layering${colors.reset}`);
    violations++;
  }
} else {
  console.log(`   ${colors.red}❌ layout.tsx not found${colors.reset}`);
  violations++;
}

console.log('');

// ============================================
// 4. MATHEMATICAL CONSTANTS
// ============================================

console.log(`${colors.cyan}4. SYNERGETIC CONSTANTS${colors.reset}`);
console.log('   Checking for mathematical foundation...');

const constantsPaths = [
  'src/lib/math/constants.ts',
  'src/lib/constants.ts',
];

let constantsFound = false;

for (const constantsPath of constantsPaths) {
  if (fs.existsSync(constantsPath)) {
    constantsFound = true;
    const constants = checkFile(constantsPath);
    
    if (constants.includes('EDGE_LENGTH')) {
      console.log(`   ${colors.green}✓ EDGE_LENGTH defined${colors.reset}`);
    } else {
      console.log(`   ${colors.red}❌ EDGE_LENGTH not found${colors.reset}`);
      violations++;
    }
    
    if (constants.includes('TETRAHEDRON_RADIUS')) {
      console.log(`   ${colors.green}✓ TETRAHEDRON_RADIUS defined${colors.reset}`);
    } else {
      console.log(`   ${colors.red}❌ TETRAHEDRON_RADIUS not found${colors.reset}`);
      violations++;
    }
    break;
  }
}

if (!constantsFound) {
  console.log(`   ${colors.red}❌ Mathematical constants not found${colors.reset}`);
  violations++;
}

console.log('');

// ============================================
// 5. CAMERA RIG
// ============================================

console.log(`${colors.cyan}5. CAMERA RIG${colors.reset}`);
console.log('   Checking camera implementation...');

const cameraFiles = findFiles('src', /CameraRig\.tsx$/);

if (cameraFiles.length === 0) {
  console.log(`   ${colors.red}❌ CameraRig.tsx not found${colors.reset}`);
  violations++;
} else {
  const camera = checkFile(cameraFiles[0]);
  
  if (camera.match(/zoomDistance.*-\d/)) {
    console.log(`   ${colors.green}✓ Camera multiplier inverted${colors.reset}`);
  } else {
    console.log(`   ${colors.yellow}⚠️  Camera multiplier may not be inverted${colors.reset}`);
    warnings++;
  }
  
  if (camera.includes('useFrame')) {
    console.log(`   ${colors.green}✓ Jitterbug Dolly implemented${colors.reset}`);
  } else {
    console.log(`   ${colors.yellow}⚠️  Jitterbug Dolly may be missing${colors.reset}`);
    warnings++;
  }
  
  if (camera.includes('isUserInteracting')) {
    console.log(`   ${colors.green}✓ User interaction detection${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ Missing interaction detection${colors.reset}`);
    violations++;
  }
}

console.log('');

// ============================================
// 6. TETRAHEDRON VISUALIZATION
// ============================================

console.log(`${colors.cyan}6. TETRAHEDRON VISUALIZATION${colors.reset}`);
console.log('   Checking 3D implementation...');

const tetraFiles = findFiles('src', /Tetrahedron.*\.tsx$/);

if (tetraFiles.length === 0) {
  console.log(`   ${colors.red}❌ No tetrahedron component found${colors.reset}`);
  violations++;
} else {
  console.log(`   ${colors.green}✓ Found tetrahedron component(s)${colors.reset}`);
  
  for (const file of tetraFiles) {
    const content = checkFile(file);
    if (content.match(/vertices.*4|4.*vertices/)) {
      console.log(`   ${colors.green}✓ K₄ topology enforced${colors.reset}`);
      break;
    }
  }
}

console.log('');

// ============================================
// 7. GOVERNANCE SYSTEM
// ============================================

console.log(`${colors.cyan}7. GOVERNANCE${colors.reset}`);
console.log('   Checking governance implementation...');

const govFiles = findFiles('src', /governanceStore\.ts$/);

if (govFiles.length === 0) {
  console.log(`   ${colors.red}❌ Governance store not found${colors.reset}`);
  violations++;
} else {
  const govStore = checkFile(govFiles[0]);
  
  console.log(`   ${colors.green}✓ Governance store exists${colors.reset}`);
  
  if (govStore.includes('Decision')) {
    console.log(`   ${colors.green}✓ Decision type defined${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ Decision type missing${colors.reset}`);
    violations++;
  }
  
  if (govStore.includes('fifthElement')) {
    console.log(`   ${colors.green}✓ Fifth Element protocol${colors.reset}`);
  } else {
    console.log(`   ${colors.yellow}⚠️  Fifth Element may be missing${colors.reset}`);
    warnings++;
  }
}

console.log('');

// ============================================
// 8. SCRIPTS & TOOLING
// ============================================

console.log(`${colors.cyan}8. DEVELOPMENT TOOLS${colors.reset}`);
console.log('   Checking scripts...');

const scripts = [
  'scripts/check-architecture.cjs',
  'scripts/create-page.cjs',
];

for (const script of scripts) {
  if (fs.existsSync(script)) {
    console.log(`   ${colors.green}✓ ${script}${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ ${script} - NOT FOUND${colors.reset}`);
    violations++;
  }
}

// Check package.json
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  
  if (pkg.scripts && pkg.scripts['check:arch']) {
    console.log(`   ${colors.green}✓ check:arch script configured${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ check:arch script missing${colors.reset}`);
    violations++;
  }
  
  if (pkg.scripts && pkg.scripts['create-page']) {
    console.log(`   ${colors.green}✓ create-page script configured${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ create-page script missing${colors.reset}`);
    violations++;
  }
}

console.log('');

// ============================================
// 9. DOCUMENTATION
// ============================================

console.log(`${colors.cyan}9. DOCUMENTATION${colors.reset}`);
console.log('   Checking docs...');

const docs = ['ARCHITECTURE.md', 'README.md'];

for (const doc of docs) {
  if (fs.existsSync(doc)) {
    console.log(`   ${colors.green}✓ ${doc}${colors.reset}`);
  } else {
    console.log(`   ${colors.yellow}⚠️  ${doc} - NOT FOUND${colors.reset}`);
    warnings++;
  }
}

console.log('');

// ============================================
// SUMMARY
// ============================================

console.log('======================================');
console.log(`${colors.cyan}AUDIT SUMMARY${colors.reset}`);
console.log('======================================\n');

if (violations === 0 && warnings === 0) {
  console.log(`${colors.green}✅ PERFECT - No violations or warnings${colors.reset}\n`);
  console.log('The codebase is architecturally sound.');
  console.log('The mesh speaks. The code listens.\n');
  process.exit(0);
} else if (violations === 0) {
  console.log(`${colors.green}✓ No critical violations${colors.reset}`);
  console.log(`${colors.yellow}⚠️  ${warnings} warning(s)${colors.reset}\n`);
  console.log('The foundation is solid.');
  console.log('Warnings are suggestions for improvement.\n');
  process.exit(0);
} else {
  console.log(`${colors.red}❌ ${violations} critical violation(s)${colors.reset}`);
  console.log(`${colors.yellow}⚠️  ${warnings} warning(s)${colors.reset}\n`);
  console.log('CRITICAL: Foundation violations must be fixed.\n');
  console.log('Run: npm run check:arch');
  console.log('     for detailed page analysis\n');
  process.exit(1);
}
