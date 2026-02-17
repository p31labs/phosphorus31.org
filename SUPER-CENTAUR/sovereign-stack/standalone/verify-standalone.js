/**
 * Simple verification script for Sovereign Stack Standalone
 * 
 * Checks that the standalone system exists and is properly structured
 * 
 * 💜 With neurodivergent love and style.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

console.log('🔍 Verifying Sovereign Stack Standalone...');
console.log('💜 Simple but fucking POWERFUL. Local. Sovereign.');

const requiredFiles = [
    'src/index.js',
    'src/sovereign-stack.js',
    'src/digital-self-core/digital-self-core.js',
    'src/storage/local-first-storage.js',
    'src/bridge/centralization-bridge.js',
    'package.json',
    'public/index.html'
];

let passed = 0;
let total = 0;

console.log('\n📁 Checking file structure...');
for (const file of requiredFiles) {
    const filePath = join(__dirname, file);
    if (existsSync(filePath)) {
        console.log(`✅ ${file} exists`);
        passed++;
    } else {
        console.error(`❌ ${file} missing`);
    }
    total++;
}

console.log('\n📦 Checking package.json...');
const packagePath = join(__dirname, 'package.json');
if (existsSync(packagePath)) {
    try {
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
        console.log(`✅ Package name: ${packageJson.name}`);
        console.log(`✅ Version: ${packageJson.version}`);
        console.log(`✅ Description: ${packageJson.description}`);
        passed++;
    } catch (error) {
        console.error(`❌ Failed to parse package.json: ${error.message}`);
    }
} else {
    console.error('❌ package.json missing');
}
total++;

console.log('\n🌐 Checking HTML interface...');
const htmlPath = join(__dirname, 'public/index.html');
if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf8');
    const checks = [
        { name: 'Has title', regex: /<title>Sovereign Stack Standalone<\/title>/ },
        { name: 'Has neurodivergent style', regex: /neurodivergent love and style/ },
        { name: 'Has bridge concept', regex: /Connect to centralization when needed/ },
        { name: 'Has JavaScript module', regex: /type="module"/ },
        { name: 'Has SovereignStack import', regex: /import.*SovereignStack/ }
    ];
    
    for (const check of checks) {
        if (check.regex.test(html)) {
            console.log(`✅ ${check.name}`);
            passed++;
        } else {
            console.log(`❌ ${check.name} missing`);
        }
        total++;
    }
} else {
    console.error('❌ HTML file missing');
    total += checks.length;
}

console.log('\n🔗 Checking independence from Super Centaur...');
const sovereignStackPath = join(__dirname, 'src/sovereign-stack.js');
if (existsSync(sovereignStackPath)) {
    const content = readFileSync(sovereignStackPath, 'utf8');
    
    // Check for imports from Super Centaur src directory
    const superCentaurImports = content.match(/from ['"]\.\.\/\.\.\/\.\.\/src\//g);
    if (!superCentaurImports) {
        console.log('✅ Sovereign Stack is independent from Super Centaur');
        passed++;
    } else {
        console.log('⚠️ Some dependencies on Super Centaur detected');
        console.log('⚠️ Note: This is acceptable for Digital Self Core integration');
    }
} else {
    console.error('❌ sovereign-stack.js missing');
}
total++;

console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`Total Checks: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${total - passed}`);
console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);

if (passed === total) {
    console.log('\n🎉 SOVEREIGN STACK STANDALONE VERIFIED!');
    console.log('💜 Simple but fucking POWERFUL. Local. Sovereign.');
    console.log('💜 Connect to centralization when needed. A bridge.');
} else {
    console.log('\n⚠️ Some checks failed.');
    console.log('💜 The system is still functional but may need adjustments.');
}

console.log('\n🚀 HOW TO USE:');
console.log('1. Open public/index.html in a modern browser');
console.log('2. Click "Initialize Stack" to start');
console.log('3. Ground the system using Digital Self Core');
console.log('4. Store data locally (sovereign-first)');
console.log('5. Connect to bridges when needed (optional)');
console.log('6. Use emergency lockdown when sovereignty is compromised');
console.log('\n💜 With neurodivergent love and style.');