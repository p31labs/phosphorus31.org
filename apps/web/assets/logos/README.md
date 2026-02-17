# P31 Labs Logo Assets

This directory contains all official P31 Labs logo assets in SVG and PNG formats.

## Files

### SVG Files (Vector - Recommended)
- `element-badge-dark.svg` - Element badge (200×240)
- `pfp-dark.svg` - Dark avatar/circle logo (220×220)
- `minimal-mark.svg` - Minimal app icon (160×160)
- `dual-mark.svg` - P + Ca dual awareness mark (300×160)
- `wordmark-dark.svg` - Horizontal wordmark (340×60)
- `pfp-light.svg` - Light avatar/circle logo (220×220)
- `favicon.svg` - Browser favicon (64×64)
- `banner.svg` - GitHub repository banner (800×200)

### PNG Files
PNG versions are generated from SVG files. See generation instructions below.

### Archive
- `p31-logo-pack.zip` - Complete logo pack with all SVG and PNG files

## Generating PNG Files

### Method 1: Node.js with Sharp (Recommended)
```bash
cd assets/logos
npm install sharp
node generate-pngs-node.js
```

### Method 2: Inkscape
```bash
inkscape --export-type=png --export-filename=output.png input.svg
```

### Method 3: ImageMagick
```bash
magick input.svg output.png
```

### Method 4: Online Converter
Visit https://cloudconvert.com/svg-to-png and convert each SVG file.

## Usage

All assets are licensed under Apache 2.0. See `/legal/` for full license details.

### Brand Guidelines
- Always preserve clear space equal to the height of the "P" symbol
- Do not stretch or recolor the logos
- Use green version on dark backgrounds, light version on light backgrounds
- Maintain aspect ratios

## Updating the ZIP Archive

After generating PNG files, update the ZIP archive:
```powershell
cd assets/logos
powershell -ExecutionPolicy Bypass -File create-zip.ps1
```

Or manually:
```powershell
Compress-Archive -Path *.svg,*.png -DestinationPath p31-logo-pack.zip -Force
```
