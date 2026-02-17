/**
 * P31 Labs — Complete Visual Identity Asset Generator
 * Run from repo root: node scripts/generate-brand-assets.cjs
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(process.cwd(), 'brand');
function mk(dir) { try { fs.mkdirSync(path.join(ROOT, dir), { recursive: true }); } catch (e) { if (e.code !== 'EEXIST') throw e; } }
function write(file, content) { fs.writeFileSync(path.join(ROOT, file), content, 'utf8'); }

function posnerGroup(opts = {}) {
  const { ca = '#00FF88', p: pColor = '#00D4FF', violet = '#7A27FF', scale = 1 } = opts;
  const s = (n) => (n * scale).toFixed(2);
  return `
  <path d="M 20 20 L 20 -20 L -20 -20 L -20 20 Z" stroke="${ca}" stroke-width="${s(0.99)}" opacity="0.25" fill="none"/>
  <path d="M 28 28 L 28 -28 L -28 -28 L -28 28 Z" stroke="${ca}" stroke-width="${s(1.32)}" opacity="0.55" fill="none"/>
  <path d="M 28 28 L 20 20 M 28 -28 L 20 -20 M -28 -28 L -20 -20 M -28 28 L -20 20" stroke="${ca}" stroke-width="${s(0.77)}" opacity="0.2" fill="none"/>
  <path d="M 0 -38 L 38 0 L 0 38 L -38 0 Z" stroke="${pColor}" stroke-width="${s(0.88)}" opacity="0.4" fill="none"/>
  <path d="M 12 12 L -12 -12" stroke="${pColor}" stroke-width="${s(0.88)}" opacity="0.25" fill="none"/>
  <path d="M 28 28 L 38 0 M 28 28 L 0 38 M 28 -28 L 38 0 M 28 -28 L 0 -38 M -28 -28 L -38 0 M -28 -28 L 0 -38 M -28 28 L -38 0 M -28 28 L 0 38" stroke="${violet}" stroke-width="${s(0.44)}" opacity="0.15" fill="none"/>
  <circle cx="20" cy="20" r="${s(2.42)}" fill="${ca}" opacity="0.5"/>
  <circle cx="20" cy="-20" r="${s(2.42)}" fill="${ca}" opacity="0.5"/>
  <circle cx="-20" cy="-20" r="${s(2.42)}" fill="${ca}" opacity="0.5"/>
  <circle cx="-20" cy="20" r="${s(2.42)}" fill="${ca}" opacity="0.5"/>
  <circle cx="28" cy="28" r="${s(3.3)}" fill="${ca}" opacity="0.9"/>
  <circle cx="28" cy="-28" r="${s(3.3)}" fill="${ca}" opacity="0.9"/>
  <circle cx="-28" cy="-28" r="${s(3.3)}" fill="${ca}" opacity="0.9"/>
  <circle cx="-28" cy="28" r="${s(3.3)}" fill="${ca}" opacity="0.9"/>
  <circle cx="0" cy="0" r="${s(9.9)}" fill="${ca}" opacity="0.1"/>
  <circle cx="0" cy="0" r="${s(3.85)}" fill="${ca}" opacity="1"/>
  <circle cx="0" cy="-38" r="${s(3.85)}" fill="${pColor}" opacity="0.85"/>
  <circle cx="38" cy="0" r="${s(3.85)}" fill="${pColor}" opacity="0.85"/>
  <circle cx="0" cy="38" r="${s(3.85)}" fill="${pColor}" opacity="0.85"/>
  <circle cx="-38" cy="0" r="${s(3.85)}" fill="${pColor}" opacity="0.85"/>
  <circle cx="12" cy="12" r="${s(2.75)}" fill="${pColor}" opacity="0.45"/>
  <circle cx="-12" cy="-12" r="${s(2.75)}" fill="${pColor}" opacity="0.45"/>`;
}

function gaussian(x, c, s, h) { return h * Math.exp(-0.5 * Math.pow((x - c) / s, 2)); }
function mrsPath(w, h, base = 0.92) {
  const peaks = [{ x: 0.10, h: 0.30, s: 0.04 }, { x: 0.25, h: 0.45, s: 0.04 }, { x: 0.50, h: 1.00, s: 0.02 }, { x: 0.65, h: 0.50, s: 0.04 }, { x: 0.78, h: 0.45, s: 0.04 }, { x: 0.90, h: 0.35, s: 0.04 }];
  const pts = []; for (let i = 0; i <= 120; i++) { const x = i / 120; let y = 0; peaks.forEach(({ x: cx, h, s }) => { y += gaussian(x, cx, s, h); }); pts.push((x * w).toFixed(1) + ',' + ((1 - y * 0.85) * h * base).toFixed(1)); }
  return 'M ' + pts[0] + ' L ' + pts.slice(1).join(' L ') + ' L ' + w + ',' + (h * base).toFixed(1) + ' Z';
}

function createLogos() {
  const mol = (t, o) => '<g transform="' + t + '">' + posnerGroup(o) + '</g>';
  write('logos/p31-logo-dark.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 140" width="960" height="280">\n  <defs><style>@import url(\'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;600&amp;family=Space+Mono:wght@400&amp;display=swap\');</style></defs>\n  <rect width="480" height="140" fill="#050510"/>\n  ' + mol('translate(70, 62) scale(1.1)', {}) + '\n  <text x="140" y="72" font-family="Oxanium,sans-serif" font-weight="600" font-size="48" fill="#E0E0EE">P</text>\n  <text x="178" y="50" font-family="\'Space Mono\',monospace" font-size="20" fill="#00FF88">31</text>\n  <text x="208" y="72" font-family="Oxanium,sans-serif" font-weight="300" font-size="48" fill="#E0E0EE" letter-spacing="6">LABS</text>\n  <text x="140" y="92" font-family="\'Space Mono\',monospace" font-size="9.5" fill="#7878AA" letter-spacing="4.5">PROTECTING FUTURE MINDS</text>\n  <text x="140" y="110" font-family="\'Space Mono\',monospace" font-size="7.5" fill="#4A4A7A" letter-spacing="2.5">OPEN-SOURCE ASSISTIVE TECHNOLOGY</text>\n</svg>');
  write('logos/p31-logo-light.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 140" width="960" height="280">\n  <defs><style>@import url(\'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;600&amp;family=Space+Mono:wght@400&amp;display=swap\');</style></defs>\n  <rect width="480" height="140" fill="#FAFAFA"/>\n  ' + mol('translate(70, 62) scale(1.1)', { ca: '#00994D', pColor: '#0088AA', violet: '#5518AA' }) + '\n  <text x="140" y="72" font-family="Oxanium,sans-serif" font-weight="600" font-size="48" fill="#1A1A2E">P</text>\n  <text x="178" y="50" font-family="\'Space Mono\',monospace" font-size="20" fill="#00994D">31</text>\n  <text x="208" y="72" font-family="Oxanium,sans-serif" font-weight="300" font-size="48" fill="#1A1A2E" letter-spacing="6">LABS</text>\n  <text x="140" y="92" font-family="\'Space Mono\',monospace" font-size="9.5" fill="#7878AA" letter-spacing="4.5">PROTECTING FUTURE MINDS</text>\n  <text x="140" y="110" font-family="\'Space Mono\',monospace" font-size="7.5" fill="#4A4A7A" letter-spacing="2.5">OPEN-SOURCE ASSISTIVE TECHNOLOGY</text>\n</svg>');
  write('logos/p31-logo-mono-white.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 140" width="960" height="280">\n  <defs><style>@import url(\'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;600&amp;family=Space+Mono:wght@400&amp;display=swap\');</style></defs>\n  <g transform="translate(70, 62) scale(1.1)">\n  <path d="M 20 20 L 20 -20 L -20 -20 L -20 20 Z" stroke="#FFFFFF" stroke-width="0.99" opacity="0.25" fill="none"/>\n  <path d="M 28 28 L 28 -28 L -28 -28 L -28 28 Z" stroke="#FFFFFF" stroke-width="1.32" opacity="0.55" fill="none"/>\n  <path d="M 28 28 L 20 20 M 28 -28 L 20 -20 M -28 -28 L -20 -20 M -28 28 L -20 20" stroke="#FFFFFF" stroke-width="0.77" opacity="0.2" fill="none"/>\n  <path d="M 0 -38 L 38 0 L 0 38 L -38 0 Z" stroke="#FFFFFF" stroke-width="0.88" opacity="0.4" fill="none"/>\n  <path d="M 12 12 L -12 -12" stroke="#FFFFFF" stroke-width="0.88" opacity="0.25" fill="none"/>\n  <path d="M 28 28 L 38 0 M 28 28 L 0 38 M 28 -28 L 38 0 M 28 -28 L 0 -38 M -28 -28 L -38 0 M -28 -28 L 0 -38 M -28 28 L -38 0 M -28 28 L 0 38" stroke="#FFFFFF" stroke-width="0.44" opacity="0.15" fill="none"/>\n  <circle cx="20" cy="20" r="2.42" fill="#FFFFFF" opacity="0.5"/><circle cx="20" cy="-20" r="2.42" fill="#FFFFFF" opacity="0.5"/><circle cx="-20" cy="-20" r="2.42" fill="#FFFFFF" opacity="0.5"/><circle cx="-20" cy="20" r="2.42" fill="#FFFFFF" opacity="0.5"/>\n  <circle cx="28" cy="28" r="3.3" fill="#FFFFFF" opacity="0.9"/><circle cx="28" cy="-28" r="3.3" fill="#FFFFFF" opacity="0.9"/><circle cx="-28" cy="-28" r="3.3" fill="#FFFFFF" opacity="0.9"/><circle cx="-28" cy="28" r="3.3" fill="#FFFFFF" opacity="0.9"/>\n  <circle cx="0" cy="0" r="9.9" fill="#FFFFFF" opacity="0.1"/><circle cx="0" cy="0" r="3.85" fill="#FFFFFF" opacity="1"/>\n  <circle cx="0" cy="-38" r="3.85" fill="#FFFFFF" opacity="0.85"/><circle cx="38" cy="0" r="3.85" fill="#FFFFFF" opacity="0.85"/><circle cx="0" cy="38" r="3.85" fill="#FFFFFF" opacity="0.85"/><circle cx="-38" cy="0" r="3.85" fill="#FFFFFF" opacity="0.85"/>\n  <circle cx="12" cy="12" r="2.75" fill="#FFFFFF" opacity="0.45"/><circle cx="-12" cy="-12" r="2.75" fill="#FFFFFF" opacity="0.45"/>\n  </g>\n  <text x="140" y="72" font-family="Oxanium,sans-serif" font-weight="600" font-size="48" fill="#FFFFFF">P</text>\n  <text x="178" y="50" font-family="\'Space Mono\',monospace" font-size="20" fill="#FFFFFF" opacity="0.9">31</text>\n  <text x="208" y="72" font-family="Oxanium,sans-serif" font-weight="300" font-size="48" fill="#FFFFFF" letter-spacing="6">LABS</text>\n  <text x="140" y="92" font-family="\'Space Mono\',monospace" font-size="9.5" fill="#FFFFFF" opacity="0.7" letter-spacing="4.5">PROTECTING FUTURE MINDS</text>\n  <text x="140" y="110" font-family="\'Space Mono\',monospace" font-size="7.5" fill="#FFFFFF" opacity="0.5" letter-spacing="2.5">OPEN-SOURCE ASSISTIVE TECHNOLOGY</text>\n</svg>');
  const scale = (512 * 0.85) / 96;
  write('logos/p31-icon-square.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">\n  <rect width="512" height="512" rx="8" ry="8" fill="#050510"/>\n  <g transform="translate(256, 256) scale(' + scale + ')">' + posnerGroup({ scale: 1 }) + '</g>\n</svg>');
}

function createBanners() {
  const mol = (x, y, s) => '<g transform="translate(' + x + ', ' + y + ') scale(' + s + ')">' + posnerGroup({}) + '</g>';
  write('banners/p31-twitter-1500x500.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 500" width="1500" height="500">\n  <rect width="1500" height="500" fill="#050510"/>\n  ' + mol(350, 230, 2.8) + '\n  <text x="580" y="220" font-family="Oxanium,sans-serif" font-weight="600" font-size="56" fill="#E0E0EE">P</text>\n  <text x="632" y="192" font-family="\'Space Mono\',monospace" font-size="24" fill="#00FF88">31</text>\n  <text x="668" y="220" font-family="Oxanium,sans-serif" font-weight="300" font-size="56" fill="#E0E0EE" letter-spacing="6">LABS</text>\n  <text x="580" y="258" font-family="\'Space Mono\',monospace" font-size="11" fill="#7878AA" letter-spacing="4.5">PROTECTING FUTURE MINDS</text>\n  <circle cx="580" cy="300" r="6" fill="#00FF88"/><circle cx="610" cy="300" r="6" fill="#00D4FF"/><circle cx="640" cy="300" r="6" fill="#FF00CC"/><circle cx="670" cy="300" r="6" fill="#7A27FF"/><circle cx="700" cy="300" r="6" fill="#FFB800"/>\n  <path d="' + mrsPath(1500, 60, 0.9) + '" fill="rgba(0,255,136,0.08)" stroke="#00FF88" stroke-width="1.5" stroke-opacity="0.4" transform="translate(0, 440)"/>\n  <text x="1250" y="30" font-family="\'Space Mono\',monospace" font-size="8" fill="#4A4A7A">Ca₉(PO₄)₆ · PHOSPHORUS-31 · SPIN ½</text>\n  <text x="1350" y="485" font-family="\'Space Mono\',monospace" font-size="10" fill="#7878AA">p31.io</text>\n</svg>');
  write('banners/p31-linkedin-1584x396.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1584 396" width="1584" height="396">\n  <rect width="1584" height="396" fill="#050510"/>\n  ' + mol(180, 190, 2.5) + '\n  <text x="380" y="175" font-family="Oxanium,sans-serif" font-weight="600" font-size="48" fill="#E0E0EE">P</text>\n  <text x="428" y="152" font-family="\'Space Mono\',monospace" font-size="20" fill="#00FF88">31</text>\n  <text x="458" y="175" font-family="Oxanium,sans-serif" font-weight="300" font-size="48" fill="#E0E0EE" letter-spacing="6">LABS</text>\n  <text x="380" y="208" font-family="\'Space Mono\',monospace" font-size="9.5" fill="#7878AA" letter-spacing="4.5">PROTECTING FUTURE MINDS</text>\n  <line x1="380" y1="230" x2="800" y2="230" stroke="#00FF88" stroke-width="1" opacity="0.3"/>\n  <text x="380" y="255" font-family="\'Space Mono\',monospace" font-size="8" fill="#7878AA">Open-source assistive technology for neurodivergent individuals · Georgia 501(c)(3) · CERN-OHL-S-2.0 · MIT License</text>\n  <path d="' + mrsPath(1584, 50, 0.9) + '" fill="rgba(0,255,136,0.08)" stroke="#00FF88" stroke-width="1.5" stroke-opacity="0.4" transform="translate(0, 346)"/>\n  <text x="1280" y="385" font-family="\'Space Mono\',monospace" font-size="9" fill="#7878AA">phosphorus31.org</text>\n</svg>');
  write('banners/p31-github-1280x640.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">\n  <rect width="1280" height="640" fill="#050510"/>\n  <g transform="translate(640, 240) scale(3.5)">' + posnerGroup({}) + '</g>\n  <text x="640" y="420" text-anchor="middle" font-family="Oxanium,sans-serif" font-weight="600" font-size="52" fill="#E0E0EE">P</text>\n  <text x="692" y="392" text-anchor="middle" font-family="\'Space Mono\',monospace" font-size="22" fill="#00FF88">31</text>\n  <text x="722" y="420" text-anchor="middle" font-family="Oxanium,sans-serif" font-weight="300" font-size="52" fill="#E0E0EE" letter-spacing="6">LABS</text>\n  <text x="640" y="458" text-anchor="middle" font-family="\'Space Mono\',monospace" font-size="10" fill="#7878AA" letter-spacing="4.5">PROTECTING FUTURE MINDS</text>\n  <text x="640" y="488" text-anchor="middle" font-family="\'Space Mono\',monospace" font-size="8" fill="#4A4A7A">Open-source assistive technology · Georgia 501(c)(3)</text>\n  <path d="' + mrsPath(1280, 55, 0.9) + '" fill="rgba(0,255,136,0.08)" stroke="#00FF88" stroke-width="1.5" stroke-opacity="0.4" transform="translate(0, 585)"/>\n</svg>');
}

function createFavicon() {
  write('favicon/favicon.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n  <rect width="32" height="32" rx="4" fill="#050510"/>\n  <path d="M 8 8 L 8 24 L 24 24 L 24 8 Z" stroke="#00FF88" stroke-width="1" opacity="0.6" fill="none"/>\n  <path d="M 16 4 L 28 16 L 16 28 L 4 16 Z" stroke="#00D4FF" stroke-width="0.8" opacity="0.5" fill="none"/>\n  <circle cx="16" cy="16" r="2.5" fill="#00FF88"/>\n</svg>');
}

function createWatermarks() {
  const simpleMol = '<path d="M 20 20 L 20 -20 L -20 -20 L -20 20 Z" stroke="currentColor" stroke-width="0.8" opacity="0.4" fill="none"/><path d="M 28 28 L 28 -28 L -28 -28 L -28 28 Z" stroke="currentColor" stroke-width="1" opacity="0.5" fill="none"/><path d="M 0 -38 L 38 0 L 0 38 L -38 0 Z" stroke="currentColor" stroke-width="0.7" opacity="0.35" fill="none"/><circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.5"/>';
  write('watermarks/p31-watermark.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">\n  <g transform="translate(200, 160) scale(3)" fill="none" stroke="#000000" opacity="0.06">' + simpleMol + '</g>\n  <text x="200" y="280" text-anchor="middle" font-family="\'Space Mono\',sans-serif" font-size="18" fill="#000000" opacity="0.06">P31 LABS</text>\n</svg>');
  write('watermarks/p31-watermark-diagonal.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">\n  <g transform="translate(200, 200) rotate(-30) scale(2.5)" fill="none" stroke="#00FF88" opacity="0.04">' + simpleMol + '</g>\n  <text x="200" y="200" text-anchor="middle" font-family="\'Space Mono\',sans-serif" font-size="14" fill="#00FF88" opacity="0.04" transform="rotate(-30 200 200)">P31 LABS · CONFIDENTIAL</text>\n</svg>');
}

function createEmailSignature() {
  write('signatures/p31-email-signature.html', '<!DOCTYPE html>\n<html><head><meta charset="UTF-8"/><title>P31 Labs Email Signature</title></head><body>\n<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif;">\n<tr>\n<td style="padding-right: 12px; vertical-align: top;">\n  <div style="width: 56px; height: 56px; border-radius: 8px; background: #050510;">\n    <svg width="56" height="56" viewBox="0 0 56 56"><rect width="56" height="56" rx="8" fill="#050510"/><path d="M 14 14 L 14 42 L 42 42 L 42 14 Z" stroke="#00994D" stroke-width="1.2" opacity="0.6" fill="none"/><path d="M 28 10 L 46 28 L 28 46 L 10 28 Z" stroke="#0088AA" stroke-width="1" opacity="0.5" fill="none"/><circle cx="28" cy="28" r="4" fill="#00994D"/></svg>\n  </div>\n</td>\n<td>\n  <div style="font-weight: bold; font-size: 15px; color: #1a1a2e;">Will</div>\n  <div style="font-size: 12px; color: #666688;">Founder &amp; CEO</div>\n  <div style="font-size: 12px; color: #333355;">P&sup3;&sup1; LABS | 501(c)(3) Nonprofit</div>\n  <div style="margin-top: 6px;"><a href="https://phosphorus31.org" style="color: #00994D;">phosphorus31.org</a> | <a href="https://p31.io" style="color: #00994D;">p31.io</a></div>\n  <div style="font-family: \'Courier New\', monospace; font-size: 10px; color: #AAAACC; letter-spacing: 1px;">OPEN-SOURCE ASSISTIVE TECHNOLOGY</div>\n</td>\n</tr>\n</table>\n<p style="font-style: italic; font-size: 11px; color: #888;">It\'s okay to be a little wonky.</p>\n</body></html>');
}

function createGuidelines() {
  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>P31 Labs — Brand Guidelines</title>
<link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@200;300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
:root { --void: #050510; --s1: #0A0A1F; --green: #00FF88; --cyan: #00D4FF; --magenta: #FF00CC; --violet: #7A27FF; --amber: #FFB800; --text: #E0E0EE; --text2: #7878AA; --text3: #4A4A7A; }
* { box-sizing: border-box; }
body { margin: 0; padding: 2rem; background: var(--void); color: var(--text); font-family: 'Oxanium', sans-serif; font-weight: 300; font-size: 14px; line-height: 1.75; }
h1 { font-family: 'Space Mono', monospace; font-size: clamp(24px, 4vw, 40px); color: var(--green); }
.section { margin-bottom: 3rem; }
.section-title { font-family: 'Space Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 5px; color: var(--green); border-bottom: 1px solid rgba(0,255,136,0.15); padding-bottom: 0.5rem; margin-bottom: 1rem; }
.swatch { width: 80px; height: 48px; border-radius: 8px; margin: 4px; }
.swatch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }
code, pre { background: var(--s1); font-family: 'Space Mono', monospace; font-size: 12px; color: var(--cyan); padding: 0.25rem 0.5rem; border-radius: 4px; }
pre { padding: 1rem; overflow-x: auto; }
.do { border-left: 4px solid var(--green); padding-left: 1rem; }
.dont { border-left: 4px solid var(--magenta); padding-left: 1rem; }
.banned { text-decoration: line-through; color: var(--magenta); }
.replacement { color: var(--green); }
footer { margin-top: 4rem; font-style: italic; opacity: 0.8; }
</style>
</head><body>
<h1>P31 LABS — BRAND GUIDELINES</h1>
<p>Visual identity system for P31 Labs. Phosphorus-31. The biological qubit.</p>
<div class="section"><div class="section-title">1. Identity</div><p><strong>Name:</strong> P31 Labs (P³¹ LABS). <strong>Tagline:</strong> PROTECTING FUTURE MINDS. <strong>Mission:</strong> Open-source assistive technology for neurodivergent individuals. Georgia 501(c)(3) nonprofit.</p></div>
<div class="section"><div class="section-title">2. Logo System</div><p>Posner molecule mark (Ca₉(PO₄)₆) + wordmark. Variants: Primary Dark, Primary Light (print), Monochrome White. Clear space: 0.5× molecule height. Min size: 120px wide.</p><div class="do">Do: Use on #050510 or #FAFAFA. Preserve aspect ratio.</div><div class="dont">Don't: Stretch, change colors, use below minimum size.</div></div>
<div class="section"><div class="section-title">3. Color System</div><div class="swatch-grid"><div><div class="swatch" style="background:#050510;"></div>Void #050510</div><div><div class="swatch" style="background:#00FF88;"></div>Phosphor Green</div><div><div class="swatch" style="background:#00D4FF;"></div>Quantum Cyan</div><div><div class="swatch" style="background:#FF00CC;"></div>Neural Magenta</div><div><div class="swatch" style="background:#7A27FF;"></div>Quantum Violet</div><div><div class="swatch" style="background:#FFB800;"></div>Warm Amber</div><div><div class="swatch" style="background:#E0E0EE;"></div>Primary Text</div></div><p><strong>Print-safe:</strong> Green #00994D, Cyan #0088AA, Magenta #CC0099, Violet #5518AA, Amber #CC9300.</p></div>
<div class="section"><div class="section-title">4. Typography</div><p><strong>Display:</strong> Oxanium 200–600. <strong>Data/Labels:</strong> Space Mono, letter-spacing ≥1px.</p></div>
<div class="section"><div class="section-title">5. Product Identity</div><p>Shelter ◇ #00FF88 · Scope ◎ #00D4FF · Node One ⬡ #FF00CC · Centaur ◈ #7A27FF · Sprout ❋ #FFB800</p></div>
<div class="section"><div class="section-title">6. Glow System</div><pre>text-shadow: 0 0 8px rgba(0,255,136,0.4), 0 0 20px rgba(0,255,136,0.2);\nbox-shadow: 0 0 8px rgba(0,255,136,0.3), 0 0 20px rgba(0,255,136,0.15);</pre></div>
<div class="section"><div class="section-title">7. Voice &amp; Tone</div><p>Warm, precise, luminous. Kids-first. No military or weapon language.</p></div>
<div class="section"><div class="section-title">8. Banned → Replacement</div><p><span class="banned">deploy</span> → <span class="replacement">launch</span> · <span class="banned">kill</span> → <span class="replacement">stop</span> · <span class="banned">defense</span> → <span class="replacement">shelter</span> · <span class="banned">Cognitive Shield</span> → <span class="replacement">Shelter</span> · <span class="banned">Phenix Navigator</span> → <span class="replacement">P31 Compass / Node One</span></p></div>
<div class="section"><div class="section-title">9. Signature Motifs</div><p>³¹P MRS spectrum: Gaussian peaks PME, Pi, PCr (dominant), γ/α/β-ATP. Posner geometry: Ca cube + P octahedron + entanglement. Isomorphic from molecule to UI.</p></div>
<div class="section"><div class="section-title">10. Asset Inventory</div><pre>logos/ p31-logo-dark.svg, p31-logo-light.svg, p31-logo-mono-white.svg, p31-icon-square.svg\nbanners/ p31-twitter-1500x500.svg, p31-linkedin-1584x396.svg, p31-github-1280x640.svg\nfavicon/ favicon.svg\nwatermarks/ p31-watermark.svg, p31-watermark-diagonal.svg\nsignatures/ p31-email-signature.html\nguidelines/ p31-brand-guidelines.html</pre></div>
<footer>It's okay to be a little wonky. — P31 Labs</footer>
</body></html>`;
  write('guidelines/p31-brand-guidelines.html', html);
}

function createCore() {
  write('core/posner-molecule.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="-48 -48 96 96" fill="none">' + posnerGroup({}) + '\n</svg>');
  write('core/mrs-spectrum.svg', '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80">\n  <defs><linearGradient id="spec-fill" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#00FF88" stop-opacity="0"/><stop offset="1" stop-color="#00FF88" stop-opacity="0.08"/></linearGradient></defs>\n  <path d="' + mrsPath(400, 80) + '" fill="url(#spec-fill)" stroke="#00FF88" stroke-width="1.5" stroke-opacity="0.4"/>\n</svg>');
}

['logos', 'banners', 'favicon', 'watermarks', 'signatures', 'guidelines', 'core'].forEach(mk);
createLogos();
createBanners();
createFavicon();
createWatermarks();
createEmailSignature();
createGuidelines();
createCore();
console.log('P31 brand assets written to ' + ROOT);
