# Size Budget for ESP32 SPIFFS Deployment

## Overview
This document defines size budgets for the production build targeting ESP32 SPIFFS filesystem deployment.

## Total Budget
- **Total Budget:** 500KB (uncompressed)
- **Gzipped Target:** ~150KB
- **SPIFFS Partition:** ~12.9MB (plenty of headroom, but targeting minimal footprint)

## Component Budgets

### JavaScript
- **Budget:** 300KB (uncompressed)
- **Target:** <200KB with code splitting
- **Strategy:**
  - Code splitting by vendor (react, three, zustand)
  - Lazy loading for non-critical routes/panels
  - Tree-shaking unused dependencies
  - Aggressive minification with terser

### CSS
- **Budget:** 50KB (uncompressed)
- **Target:** <30KB with Tailwind purging
- **Strategy:**
  - Aggressive Tailwind purge configuration
  - Remove unused CSS
  - Minify CSS output

### HTML
- **Budget:** 10KB
- **Target:** <5KB
- **Strategy:**
  - Minimal HTML structure
  - Inline critical CSS if needed

### Assets (SVG, images, fonts)
- **Budget:** 140KB
- **Target:** <100KB
- **Strategy:**
  - Convert PNGs to inline SVG where possible
  - Remove custom fonts (use system font stack)
  - Optimize SVG files
  - Inline small assets (<4KB)

## Build Optimizations Applied

1. **Terser Minification**
   - Drop all console.* statements
   - Multiple compression passes
   - Aggressive dead code elimination

2. **Code Splitting**
   - React vendor chunk
   - Three.js vendor chunk
   - Zustand chunk
   - Application code chunks

3. **Asset Optimization**
   - Inline assets <4KB
   - CSS minification enabled
   - Compressed size reporting

4. **Base Path**
   - Configured for `/web/` base path (SPIFFS serving)

## Monitoring

Run size analysis:
```bash
npm run size
```

Check individual file sizes:
```bash
# Windows PowerShell
Get-ChildItem -Path dist -Recurse -File | Sort-Object Length -Descending | Select-Object Name, @{Name='Size(KB)';Expression={[math]::Round($_.Length/1KB,2)}}
```

## SPIFFS Deployment

After build, copy to SPIFFS directory:
```bash
# Manual copy (Windows)
xcopy /E /I dist\* ..\firmware\node-one-esp-idf\spiffs\web\
```

Verify total size:
```bash
# PowerShell
Get-ChildItem -Path ..\firmware\node-one-esp-idf\spiffs\web -Recurse -File | Measure-Object -Property Length -Sum
```

## Notes

- If bundle exceeds 500KB, consider:
  - Replacing React with Preact (~35KB savings)
  - Further code splitting
  - Removing non-essential dependencies
  - Lazy loading more components
- Monitor bundle size on each build
- Keep this budget updated as the application grows
