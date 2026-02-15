# PowerShell script to create all SVG logo files

$logosDir = "C:\Users\sandra\Downloads\phenix-navigator-creator67\website\assets\logos"

# 1. element-badge-dark.svg
@"
<svg width="200" height="240" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow1"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
  </defs>
  <rect x="10" y="10" width="180" height="220" rx="4" fill="rgba(10,10,15,0.95)" stroke="#4fffaa" stroke-width="1.5" opacity="0.9"/>
  <rect x="10" y="10" width="180" height="220" rx="4" fill="none" stroke="#4fffaa" stroke-width="0.5" opacity="0.15"/>
  <text x="30" y="48" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="400" fill="#4fffaa" opacity="0.7">15</text>
  <text x="100" y="148" font-family="'Instrument Serif', serif" font-size="110" font-weight="400" fill="#4fffaa" text-anchor="middle" filter="url(#glow1)">P</text>
  <text x="100" y="185" font-family="'Sora', sans-serif" font-size="13" font-weight="200" fill="#e8e8ed" text-anchor="middle" letter-spacing="3">PHOSPHORUS</text>
  <text x="100" y="215" font-family="'JetBrains Mono', monospace" font-size="11" fill="#4fffaa" text-anchor="middle" opacity="0.4">30.97376</text>
</svg>
"@ | Out-File -FilePath "$logosDir\element-badge-dark.svg" -Encoding utf8

# 2. pfp-dark.svg
@"
<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#0f1a14"/><stop offset="100%" stop-color="#0a0a0f"/></radialGradient>
    <filter id="glow2"><feGaussianBlur stdDeviation="4" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    <clipPath id="circClip"><circle cx="110" cy="110" r="105"/></clipPath>
  </defs>
  <circle cx="110" cy="110" r="105" fill="url(#bgGrad)" stroke="#4fffaa" stroke-width="1"/>
  <g clip-path="url(#circClip)">
    <ellipse cx="110" cy="110" rx="70" ry="70" fill="none" stroke="#4fffaa" stroke-width="0.4" opacity="0.12"/>
    <ellipse cx="110" cy="110" rx="95" ry="95" fill="none" stroke="#4fffaa" stroke-width="0.3" opacity="0.08" stroke-dasharray="3,6"/>
    <text x="68" y="62" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="400" fill="#4fffaa" opacity="0.5">15</text>
    <text x="110" y="130" font-family="'Instrument Serif', serif" font-size="88" font-weight="400" fill="#4fffaa" text-anchor="middle" filter="url(#glow2)">P</text>
    <text x="148" y="140" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="300" fill="#4fffaa" opacity="0.6">31</text>
    <text x="110" y="170" font-family="'Sora', sans-serif" font-size="10" font-weight="300" fill="#e8e8ed" text-anchor="middle" letter-spacing="5" opacity="0.5">LABS</text>
    <circle cx="41" cy="75" r="2.5" fill="#00d4ff" opacity="0.7"/>
    <circle cx="179" cy="145" r="2" fill="#00d4ff" opacity="0.5"/>
    <circle cx="110" cy="17" r="2" fill="#00d4ff" opacity="0.6"/>
  </g>
</svg>
"@ | Out-File -FilePath "$logosDir\pfp-dark.svg" -Encoding utf8

# 3. minimal-mark.svg
@"
<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="glow3"><feGaussianBlur stdDeviation="2.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter></defs>
  <rect width="160" height="160" rx="20" fill="#0a0a0f"/>
  <rect x="0.5" y="0.5" width="159" height="159" rx="20" fill="none" stroke="#4fffaa" stroke-width="0.8" opacity="0.2"/>
  <text x="60" y="108" font-family="'Instrument Serif', serif" font-size="80" font-weight="400" fill="#4fffaa" text-anchor="middle" filter="url(#glow3)">P</text>
  <text x="110" y="115" font-family="'JetBrains Mono', monospace" font-size="30" font-weight="300" fill="#4fffaa" opacity="0.7">31</text>
  <circle cx="80" cy="30" r="3" fill="#4fffaa" opacity="0.3"/>
  <circle cx="80" cy="30" r="6" fill="none" stroke="#4fffaa" stroke-width="0.5" opacity="0.1"/>
</svg>
"@ | Out-File -FilePath "$logosDir\minimal-mark.svg" -Encoding utf8

# 4. dual-mark.svg
@"
<svg width="300" height="160" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow4g"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
    <filter id="glow4a"><feGaussianBlur stdDeviation="2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
  </defs>
  <rect x="10" y="10" width="130" height="140" rx="3" fill="rgba(10,10,15,0.9)" stroke="#4fffaa" stroke-width="1" opacity="0.8"/>
  <text x="25" y="38" font-family="'JetBrains Mono', monospace" font-size="11" fill="#4fffaa" opacity="0.5">15</text>
  <text x="75" y="100" font-family="'Instrument Serif', serif" font-size="72" fill="#4fffaa" text-anchor="middle" filter="url(#glow4g)">P</text>
  <text x="75" y="135" font-family="'JetBrains Mono', monospace" font-size="9" fill="#4fffaa" text-anchor="middle" opacity="0.35">30.974</text>
  <line x1="145" y1="80" x2="155" y2="80" stroke="#4fffaa" stroke-width="0.5" opacity="0.3"/>
  <line x1="145" y1="75" x2="155" y2="75" stroke="#ff9f43" stroke-width="0.5" opacity="0.3"/>
  <rect x="160" y="10" width="130" height="140" rx="3" fill="rgba(10,10,15,0.9)" stroke="#ff9f43" stroke-width="1" opacity="0.8"/>
  <text x="175" y="38" font-family="'JetBrains Mono', monospace" font-size="11" fill="#ff9f43" opacity="0.5">20</text>
  <text x="225" y="100" font-family="'Instrument Serif', serif" font-size="72" fill="#ff9f43" text-anchor="middle" filter="url(#glow4a)">Ca</text>
  <text x="225" y="135" font-family="'JetBrains Mono', monospace" font-size="9" fill="#ff9f43" text-anchor="middle" opacity="0.35">40.078</text>
</svg>
"@ | Out-File -FilePath "$logosDir\dual-mark.svg" -Encoding utf8

# 5. wordmark-dark.svg
@"
<svg width="340" height="60" viewBox="0 0 340 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="4" width="52" height="52" rx="3" fill="none" stroke="#4fffaa" stroke-width="1" opacity="0.6"/>
  <text x="8" y="18" font-family="'JetBrains Mono', monospace" font-size="7" fill="#4fffaa" opacity="0.5">15</text>
  <text x="26" y="42" font-family="'Instrument Serif', serif" font-size="32" fill="#4fffaa" text-anchor="middle">P</text>
  <text x="26" y="53" font-family="'JetBrains Mono', monospace" font-size="5" fill="#4fffaa" text-anchor="middle" opacity="0.3">31</text>
  <text x="68" y="30" font-family="'Sora', sans-serif" font-size="22" font-weight="300" fill="#e8e8ed" letter-spacing="1">P31</text>
  <text x="122" y="30" font-family="'Sora', sans-serif" font-size="22" font-weight="200" fill="#e8e8ed" letter-spacing="1" opacity="0.6">Labs</text>
  <text x="68" y="48" font-family="'JetBrains Mono', monospace" font-size="7" fill="#4fffaa" letter-spacing="2.5" opacity="0.4">ASSISTIVE TECHNOLOGY</text>
</svg>
"@ | Out-File -FilePath "$logosDir\wordmark-dark.svg" -Encoding utf8

# 6. pfp-light.svg
@"
<svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGradL" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f0f5f2"/><stop offset="100%" stop-color="#e8ebe9"/></radialGradient>
    <clipPath id="circClipL"><circle cx="110" cy="110" r="105"/></clipPath>
  </defs>
  <circle cx="110" cy="110" r="105" fill="url(#bgGradL)" stroke="#0a3d24" stroke-width="1.5"/>
  <g clip-path="url(#circClipL)">
    <ellipse cx="110" cy="110" rx="70" ry="70" fill="none" stroke="#0a3d24" stroke-width="0.5" opacity="0.08"/>
    <ellipse cx="110" cy="110" rx="95" ry="95" fill="none" stroke="#0a3d24" stroke-width="0.3" opacity="0.06" stroke-dasharray="3,6"/>
    <text x="68" y="62" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="400" fill="#0a3d24" opacity="0.35">15</text>
    <text x="110" y="130" font-family="'Instrument Serif', serif" font-size="88" font-weight="400" fill="#0a3d24" text-anchor="middle">P</text>
    <text x="148" y="140" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="300" fill="#0a3d24" opacity="0.45">31</text>
    <text x="110" y="170" font-family="'Sora', sans-serif" font-size="10" font-weight="300" fill="#0a3d24" text-anchor="middle" letter-spacing="5" opacity="0.35">LABS</text>
    <circle cx="41" cy="75" r="2.5" fill="#0077aa" opacity="0.4"/>
    <circle cx="179" cy="145" r="2" fill="#0077aa" opacity="0.3"/>
    <circle cx="110" cy="17" r="2" fill="#0077aa" opacity="0.35"/>
  </g>
</svg>
"@ | Out-File -FilePath "$logosDir\pfp-light.svg" -Encoding utf8

# 7. favicon.svg
@"
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" fill="#0a0a0f"/>
  <text x="24" y="46" font-family="'Instrument Serif', serif" font-size="38" fill="#4fffaa" text-anchor="middle">P</text>
  <text x="48" y="50" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="300" fill="#4fffaa" opacity="0.65">31</text>
</svg>
"@ | Out-File -FilePath "$logosDir\favicon.svg" -Encoding utf8

# 8. banner.svg
@"
<svg width="800" height="200" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0a0a0f"/><stop offset="50%" stop-color="#0d1510"/><stop offset="100%" stop-color="#0a0a0f"/></linearGradient>
    <filter id="glowB"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
  </defs>
  <rect width="800" height="200" fill="url(#bannerGrad)"/>
  <line x1="0" y1="100" x2="800" y2="100" stroke="#4fffaa" stroke-width="0.2" opacity="0.06"/>
  <line x1="400" y1="0" x2="400" y2="200" stroke="#4fffaa" stroke-width="0.2" opacity="0.06"/>
  <circle cx="120" cy="45" r="1" fill="#4fffaa" opacity="0.15"/>
  <circle cx="680" cy="160" r="1.5" fill="#4fffaa" opacity="0.1"/>
  <circle cx="350" cy="30" r="0.8" fill="#00d4ff" opacity="0.12"/>
  <circle cx="550" cy="170" r="1" fill="#00d4ff" opacity="0.08"/>
  <circle cx="90" cy="150" r="0.6" fill="#ff9f43" opacity="0.1"/>
  <circle cx="720" cy="50" r="0.8" fill="#ff9f43" opacity="0.08"/>
  <line x1="120" y1="45" x2="350" y2="30" stroke="#4fffaa" stroke-width="0.3" opacity="0.04"/>
  <line x1="550" y1="170" x2="680" y2="160" stroke="#00d4ff" stroke-width="0.3" opacity="0.04"/>
  <rect x="240" y="35" width="68" height="82" rx="3" fill="none" stroke="#4fffaa" stroke-width="0.8" opacity="0.5"/>
  <text x="250" y="52" font-family="'JetBrains Mono', monospace" font-size="9" fill="#4fffaa" opacity="0.4">15</text>
  <text x="274" y="92" font-family="'Instrument Serif', serif" font-size="55" fill="#4fffaa" text-anchor="middle" filter="url(#glowB)">P</text>
  <text x="274" y="112" font-family="'JetBrains Mono', monospace" font-size="7" fill="#4fffaa" text-anchor="middle" opacity="0.3">30.974</text>
  <text x="330" y="73" font-family="'Sora', sans-serif" font-size="32" font-weight="300" fill="#e8e8ed" letter-spacing="1">P31 Labs</text>
  <text x="330" y="100" font-family="'Sora', sans-serif" font-size="14" font-weight="200" fill="#9ca3af" letter-spacing="0.5">Assistive technology for neurodivergent minds</text>
  <line x1="330" y1="118" x2="600" y2="118" stroke="#4fffaa" stroke-width="0.3" opacity="0.1"/>
  <text x="330" y="140" font-family="'JetBrains Mono', monospace" font-size="8" fill="#4fffaa" letter-spacing="3" opacity="0.35">HARDWARE · SOFTWARE · PROTOCOL</text>
  <rect x="330" y="155" width="30" height="3" rx="1.5" fill="#4fffaa" opacity="0.12"/>
  <rect x="365" y="155" width="30" height="3" rx="1.5" fill="#ff9f43" opacity="0.08"/>
  <rect x="400" y="155" width="30" height="3" rx="1.5" fill="#00d4ff" opacity="0.06"/>
</svg>
"@ | Out-File -FilePath "$logosDir\banner.svg" -Encoding utf8

Write-Host "All SVG logo files created successfully!"
