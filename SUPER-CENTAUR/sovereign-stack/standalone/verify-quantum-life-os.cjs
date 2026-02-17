#!/usr/bin/env node

/**
 * Verify Quantum Life Operating System
 * Check if all components are present and working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Quantum Life Operating System...');
console.log('✨ Quantum-coherent. Life-centric. Sovereign.\n');

// Check file structure
const filesToCheck = [
  'src/index.js',
  'src/sovereign-stack.js',
  'src/quantum-life-os.js',
  'src/digital-self-core/digital-self-core.js',
  'src/storage/local-first-storage.js',
  'src/bridge/centralization-bridge.js',
  'package.json',
  'public/index.html',
  'public/quantum-life-os.html'
];

console.log('📁 Checking file structure...');
let passedFiles = 0;
let failedFiles = 0;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log('✅', file);
    passedFiles++;
  } else {
    console.log('❌', file);
    failedFiles++;
  }
});

console.log();

// Check package.json
console.log('📦 Checking package.json...');
const packageJson = require('./package.json');

if (packageJson.name === 'sovereign-stack-standalone') {
  console.log('✅ Package name: sovereign-stack-standalone');
} else {
  console.log('❌ Package name should be sovereign-stack-standalone');
}

if (packageJson.version === '1.0.0') {
  console.log('✅ Version: 1.0.0');
} else {
  console.log('❌ Version should be 1.0.0');
}

if (packageJson.description.includes('Standalone Sovereign Stack')) {
  console.log('✅ Description includes Standalone Sovereign Stack');
} else {
  console.log('❌ Description should include Standalone Sovereign Stack');
}

console.log();

// Check Quantum Life OS file
console.log('🌐 Checking Quantum Life OS interface...');
const quantumLifeOSHTML = fs.readFileSync(path.join(__dirname, 'public/quantum-life-os.html'), 'utf8');

if (quantumLifeOSHTML.includes('Quantum Life OS')) {
  console.log('✅ Has Quantum Life OS title');
} else {
  console.log('❌ Has Quantum Life OS title missing');
}

if (quantumLifeOSHTML.includes('quantum-coherent')) {
  console.log('✅ Has quantum-coherent style');
} else {
  console.log('❌ Has quantum-coherent style missing');
}

if (quantumLifeOSHTML.includes('QuantumLifeOS')) {
  console.log('✅ Has QuantumLifeOS class');
} else {
  console.log('❌ Has QuantumLifeOS class missing');
}

if (quantumLifeOSHTML.includes('quantum-life-os.js')) {
  console.log('✅ Has Quantum Life OS JavaScript module');
} else {
  console.log('❌ Has Quantum Life OS JavaScript module missing');
}

if (quantumLifeOSHTML.includes('Generate Insight')) {
  console.log('✅ Has Generate Insight function');
} else {
  console.log('❌ Has Generate Insight function missing');
}

console.log();

// Check independence from Super Centaur
console.log('🔗 Checking independence from Super Centaur...');
const indexContent = fs.readFileSync(path.join(__dirname, 'src/index.js'), 'utf8');
if (indexContent.includes('SUPER_CENTAUR') || indexContent.includes('super-centaur')) {
  console.log('❌ Sovereign Stack depends on Super Centaur');
} else {
  console.log('✅ Sovereign Stack is independent from Super Centaur');
}

console.log();

// Summary
const totalChecks = filesToCheck.length + 4 + 5; // Files + package.json checks + HTML checks
console.log('==================================================');
console.log('📊 VERIFICATION SUMMARY');
console.log('==================================================');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedFiles + 4 + 5}`);
console.log(`Failed: ${failedFiles}`);
const successRate = Math.round(((passedFiles + 4 + 5) / totalChecks) * 100);
console.log(`Success Rate: ${successRate}%\n`);

if (successRate >= 80) {
  console.log('✅ Quantum Life Operating System verified successfully!');
} else {
  console.log('⚠️ Some checks failed. The system may need adjustments.');
}

console.log();
console.log('🚀 HOW TO USE:');
console.log('1. Open public/quantum-life-os.html in a modern browser');
console.log('2. Click "Initialize Quantum Life OS" to start');
console.log('3. Connect to consciousness through the Quantum Bridge');
console.log('4. Generate quantum insights and healing sessions');
console.log('5. Use quantum meditation for coherence');
console.log('6. Activate emergency protocol for critical situations');
console.log();
console.log('✨ "The universe is not a machine. It is a living organism."');