# PNG Generation Instructions

PNG versions of the SVG logos need to be generated. Here are several methods:

## Method 1: Inkscape (Recommended)
1. Install Inkscape from https://inkscape.org/release/
2. Run this command for each SVG:
   inkscape --export-type=png --export-filename=output.png input.svg

## Method 2: ImageMagick
1. Install ImageMagick from https://imagemagick.org/script/download.php
2. Run: magick input.svg output.png

## Method 3: Online Converter
1. Visit https://cloudconvert.com/svg-to-png
2. Upload each SVG file
3. Download the PNG version
4. Save with the same name but .png extension

## Method 4: Node.js with sharp
1. Install Node.js from https://nodejs.org/
2. Run: npm install -g sharp-cli
3. Run: sharp -i input.svg -o output.png

## Required PNG Files
- element-badge-dark.png (200Ã—240)
- pfp-dark.png (220Ã—220)
- minimal-mark.png (160Ã—160)
- dual-mark.png (300Ã—160)
- wordmark-dark.png (340Ã—60)
- pfp-light.png (220Ã—220)
- favicon.png (64Ã—64)
- banner.png (800Ã—200)
