/**
 * Node.js script to convert SVG files to PNG
 * Requires: npm install sharp
 * Usage: node generate-pngs-node.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp module not found.');
  console.error('Please install it with: npm install sharp');
  process.exit(1);
}

const logosDir = __dirname;
const svgFiles = [
  'element-badge-dark.svg',
  'pfp-dark.svg',
  'minimal-mark.svg',
  'dual-mark.svg',
  'wordmark-dark.svg',
  'pfp-light.svg',
  'favicon.svg',
  'banner.svg'
];

// Dimensions for each logo (width, height)
const dimensions = {
  'element-badge-dark.svg': [200, 240],
  'pfp-dark.svg': [220, 220],
  'minimal-mark.svg': [160, 160],
  'dual-mark.svg': [300, 160],
  'wordmark-dark.svg': [340, 60],
  'pfp-light.svg': [220, 220],
  'favicon.svg': [64, 64],
  'banner.svg': [800, 200]
};

async function convertSvgToPng(svgFile) {
  const svgPath = path.join(logosDir, svgFile);
  const pngFile = svgFile.replace('.svg', '.png');
  const pngPath = path.join(logosDir, pngFile);
  const [width, height] = dimensions[svgFile] || [200, 200];

  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    await sharp(svgBuffer, { density: 300 })
      .resize(width, height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(pngPath);

    console.log(`✓ Created ${pngFile} (${width}×${height})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to convert ${svgFile}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Converting SVG files to PNG...\n');

  let successCount = 0;
  for (const svgFile of svgFiles) {
    const success = await convertSvgToPng(svgFile);
    if (success) successCount++;
  }

  console.log(`\n✓ Completed: ${successCount}/${svgFiles.length} files converted`);
  
  if (successCount === svgFiles.length) {
    console.log('\nAll PNG files created successfully!');
    console.log('You can now run create-zip.ps1 to update the ZIP archive.');
  }
}

main().catch(console.error);
