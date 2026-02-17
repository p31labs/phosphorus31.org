#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  P³¹ ALIGNMENT SWARM  v2.0
#  phosphorus31.org post-update validator
#
#  Usage:  bash swarm.sh [path-to-site-root]
#  Default: current directory
#
#  Exit codes:
#    0 = all clear
#    1 = warnings (review before deploy)
#    2 = critical failures (do NOT deploy)
# ═══════════════════════════════════════════════════════════════

SITE="${1:-.}"

# ── EXPECTED PAGES ──
PAGES=(
  index.html
  about/index.html
  docs/index.html
  roadmap/index.html
  node-one/index.html
  wallet/index.html
  games/index.html
  education/index.html
  blog/index.html
  legal/index.html
  accessibility/index.html
  press/index.html
)

# ── COUNTERS ──
P=0; W=0; F=0; T=0

# ── FORMATTING ──
R='\033[0;31m'; G='\033[0;32m'; Y='\033[1;33m'
C='\033[0;36m'; D='\033[0;90m'; B='\033[1m'; N='\033[0m'

ok()   { P=$((P+1)); T=$((T+1)); echo -e "  ${G}✓${N} $1"; }
wn()   { W=$((W+1)); T=$((T+1)); echo -e "  ${Y}⚠${N} $1"; }
fl()   { F=$((F+1)); T=$((T+1)); echo -e "  ${R}✗${N} $1"; }
nfo()  { echo -e "  ${D}ℹ $1${N}"; }
hdr()  { echo -e "\n${C}━━━ $1 ━━━${N}"; }

# helper: count grep hits across all site files
ghits() {
  local term="$1" n=0 c
  while IFS=: read -r _ c; do
    n=$((n + c))
  done < <(grep -rci "$term" "$SITE" --include="*.html" --include="*.js" --include="*.css" 2>/dev/null)
  echo "$n"
}

# helper: count grep hits in one file
fhits() {
  local c
  c=$(grep -ci "$1" "$2" 2>/dev/null) || c=0
  echo "$c"
}

echo -e "${B}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║   P³¹ ALIGNMENT SWARM  v2.0                      ║"
echo "║   phosphorus31.org · post-update validator        ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${N}"
echo -e "${D}Root: ${SITE}${N}"
echo -e "${D}Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')${N}"


# ═══════════════════════════════════════════════════
# 01 · FILE INVENTORY
# ═══════════════════════════════════════════════════
hdr "01 · FILE INVENTORY"

for pg in "${PAGES[@]}"; do
  if [ -f "${SITE}/${pg}" ]; then
    ok "${pg}  ($(wc -l < "${SITE}/${pg}") lines)"
  else
    fl "MISSING: ${pg}"
  fi
done

for f in styles.css main.js pages.css CNAME robots.txt sitemap.xml; do
  if [ -f "${SITE}/${f}" ]; then
    ok "${f}"
  else
    [ "$f" = "pages.css" ] && wn "${f} not found (optional)" || fl "MISSING: ${f}"
  fi
done


# ═══════════════════════════════════════════════════
# 02 · OPSEC SWEEP
# ═══════════════════════════════════════════════════
hdr "02 · OPSEC SWEEP"

echo -e "  ${B}Zero-tolerance terms:${N}"
for term in submarine naval navy willow sebastian christyn co-parent; do
  n=$(ghits "$term")
  if [ "$n" -gt 0 ]; then
    fl "OPSEC VIOLATION: '${term}' — ${n} hit(s)"
    grep -rni "$term" "$SITE" --include="*.html" --include="*.js" --include="*.css" 2>/dev/null \
      | head -3 | while IFS= read -r line; do nfo "  → ${line}"; done
  else
    ok "'${term}' clean"
  fi
done

# Initials via perl-regex
for pat in 'S\.J\.' 'W\.J\.'; do
  n=0
  while IFS=: read -r _ c; do
    n=$((n + c))
  done < <(grep -rPc "$pat" "$SITE" --include="*.html" --include="*.js" --include="*.css" 2>/dev/null)
  if [ "$n" -gt 0 ]; then
    fl "OPSEC VIOLATION: '${pat}' — ${n} hit(s)"
  else
    ok "'${pat}' clean"
  fi
done

echo ""
echo -e "  ${B}Context-sensitive (review if flagged):${N}"
for term in johnson military bash; do
  n=$(ghits "$term")
  if [ "$n" -gt 0 ]; then
    wn "'${term}' — ${n} hit(s), verify context:"
    grep -rni "$term" "$SITE" --include="*.html" --include="*.js" --include="*.css" 2>/dev/null \
      | head -4 | while IFS= read -r line; do nfo "  → ${line}"; done
  else
    ok "'${term}' clean"
  fi
done


# ═══════════════════════════════════════════════════
# 03 · NAVIGATION
# ═══════════════════════════════════════════════════
hdr "03 · NAVIGATION"

for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  # wallet is React SPA — nav rendered at runtime
  if [ "$pg" = "wallet/index.html" ]; then
    nfo "${pg} — React SPA (nav rendered at runtime)"
    continue
  fi

  if grep -q '<nav' "$f" 2>/dev/null; then
    if grep -q 'P<sup>31</sup>' "$f" 2>/dev/null; then
      ok "${pg} — nav + logo"
    else
      wn "${pg} — <nav> present, P<sup>31</sup> logo missing"
    fi
  else
    fl "${pg} — MISSING <nav>"
  fi
done


# ═══════════════════════════════════════════════════
# 04 · FOOTER LINKS
# ═══════════════════════════════════════════════════
hdr "04 · FOOTER LINKS"

FOOT_HREFS=(
  '/' '/docs/' '/roadmap/' '/about/' '/node-one/' '/wallet/'
  '/games/' '/education/' '/blog/' '/legal/' '/accessibility/' '/press/'
)

for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  # React SPA exempt
  if [ "$pg" = "wallet/index.html" ]; then
    nfo "${pg} — React SPA (exempt)"
    continue
  fi

  foot=$(sed -n '/<footer/,/<\/footer>/p' "$f" 2>/dev/null)
  if [ -z "$foot" ]; then
    wn "${pg} — no <footer> found"
    continue
  fi

  miss=0
  miss_list=""
  for href in "${FOOT_HREFS[@]}"; do
    if ! echo "$foot" | grep -q "href=\"${href}\"" 2>/dev/null; then
      miss=$((miss+1))
      miss_list="${miss_list} ${href}"
    fi
  done

  if [ "$miss" -eq 0 ]; then
    ok "${pg} — all 12 footer links"
  else
    wn "${pg} — missing ${miss}:${miss_list}"
  fi
done


# ═══════════════════════════════════════════════════
# 05 · SITEMAP
# ═══════════════════════════════════════════════════
hdr "05 · SITEMAP"

if [ ! -f "${SITE}/sitemap.xml" ]; then
  fl "sitemap.xml not found"
else
  DOMAIN="phosphorus31.org"
  for path in / /about/ /docs/ /roadmap/ /node-one/ /wallet/ /games/ /education/ /blog/ /legal/ /accessibility/ /press/; do
    if grep -q "https://${DOMAIN}${path}" "${SITE}/sitemap.xml" 2>/dev/null; then
      ok "sitemap → ${path}"
    else
      fl "sitemap MISSING: ${path}"
    fi
  done

  orphans=0
  while IFS= read -r url; do
    path="${url#https://${DOMAIN}}"
    [ "$path" = "/" ] && target="index.html" || target="${path}index.html"
    if [ ! -f "${SITE}/${target}" ]; then
      wn "Orphan: ${url}"
      orphans=$((orphans+1))
    fi
  done < <(grep -oP 'https://[^<]+' "${SITE}/sitemap.xml" 2>/dev/null)
  [ "$orphans" -eq 0 ] && ok "No orphan sitemap entries"
fi


# ═══════════════════════════════════════════════════
# 06 · INTERNAL LINKS
# ═══════════════════════════════════════════════════
hdr "06 · INTERNAL LINKS"

broken=0
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  while IFS= read -r href; do
    path=$(echo "$href" | sed 's/href="//;s/"//' | sed 's/#.*//')
    [ -z "$path" ] && continue
    [ "$path" = "/" ] && continue
    # Whitelist: Cloudflare email obfuscation (injected at deploy)
    [[ "$path" == /cdn-cgi/* ]] && continue

    if [[ "$path" == */ ]]; then
      target="${SITE}${path}index.html"
    elif [[ "$path" == *.css ]] || [[ "$path" == *.js ]] || [[ "$path" == *.xml ]] || [[ "$path" == *.txt ]]; then
      target="${SITE}${path}"
    else
      [ -f "${SITE}${path}" ] && target="${SITE}${path}" || target="${SITE}${path}/index.html"
    fi

    if [ ! -f "$target" ]; then
      wn "${pg} → broken: ${path}"
      broken=$((broken+1))
    fi
  done < <(grep -oP 'href="/[^"]*"' "$f" 2>/dev/null | sort -u)
done

[ "$broken" -eq 0 ] && ok "All internal links resolve"


# ═══════════════════════════════════════════════════
# 07 · ARIA & ACCESSIBILITY
# ═══════════════════════════════════════════════════
hdr "07 · ARIA & ACCESSIBILITY"

declare -A SELF_LINKS=(
  [about/index.html]='/about/'
  [docs/index.html]='/docs/'
  [roadmap/index.html]='/roadmap/'
  [node-one/index.html]='/node-one/'
  [games/index.html]='/games/'
  [education/index.html]='/education/'
  [blog/index.html]='/blog/'
  [legal/index.html]='/legal/'
  [accessibility/index.html]='/accessibility/'
  [press/index.html]='/press/'
)

for pg in "${!SELF_LINKS[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  if grep -q 'aria-current="page"' "$f" 2>/dev/null; then
    ok "${pg} — aria-current ✓"
  else
    wn "${pg} — no aria-current=\"page\""
  fi
done

# Check prefers-reduced-motion
if [ -f "${SITE}/styles.css" ]; then
  if grep -q 'prefers-reduced-motion' "${SITE}/styles.css" 2>/dev/null; then
    ok "styles.css — prefers-reduced-motion ✓"
  else
    wn "styles.css — no prefers-reduced-motion media query"
  fi
fi

# Canvas aria-hidden
canvas_pages=0
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue
  if grep -q '<canvas' "$f" 2>/dev/null; then
    if grep -q 'aria-hidden' "$f" 2>/dev/null; then
      ok "${pg} — canvas aria-hidden ✓"
    else
      wn "${pg} — <canvas> without aria-hidden"
    fi
    canvas_pages=$((canvas_pages+1))
  fi
done


# ═══════════════════════════════════════════════════
# 08 · DESIGN TOKENS
# ═══════════════════════════════════════════════════
hdr "08 · DESIGN TOKENS"

nfo "Hardcoded brand colors in HTML (styles.css defines them — exempt):"

declare -A TOKEN_MAP=(
  ["#050510"]="--void"
  ["#0a0a1a"]="--void-up"
  ["#2ecc71"]="--phosphorus"
  ["#60a5fa"]="--calcium"
  ["#e8e8f0"]="--white"
  ["#9898b0"]="--white-dim"
  ["#585870"]="--white-muted"
)

hc_total=0
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  pg_hits=0
  pg_details=""
  for color in "${!TOKEN_MAP[@]}"; do
    n=$(fhits "$color" "$f")
    if [ "$n" -gt 0 ]; then
      pg_hits=$((pg_hits + n))
      pg_details="${pg_details} ${color}→${TOKEN_MAP[$color]}(${n})"
    fi
  done

  if [ "$pg_hits" -gt 0 ]; then
    wn "${pg} — ${pg_hits} hardcoded:${pg_details}"
    hc_total=$((hc_total + pg_hits))
  fi
done

[ "$hc_total" -eq 0 ] && ok "No hardcoded brand colors" \
  || nfo "Total: ${hc_total} (non-blocking — inline styles may be intentional)"


# ═══════════════════════════════════════════════════
# 09 · FONT LOADING
# ═══════════════════════════════════════════════════
hdr "09 · FONT LOADING"

for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  if grep -q 'fonts.googleapis.com' "$f" 2>/dev/null; then
    ok "${pg} — Google Fonts ✓"
  else
    wn "${pg} — no direct font link"
  fi
done


# ═══════════════════════════════════════════════════
# 10 · WALLET ADDRESS
# ═══════════════════════════════════════════════════
hdr "10 · WALLET ADDRESS"

WALLET="0x90048cbb3CDCef200a54D6D336EbB4e0ce18d82c"
wallet_pages=0

for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue
  n=$(fhits "$WALLET" "$f")
  if [ "$n" -gt 0 ]; then
    ok "${pg} — wallet (${n}×)"
    wallet_pages=$((wallet_pages + 1))
  fi
done

[ "$wallet_pages" -ge 2 ] && ok "Wallet in ${wallet_pages} pages" \
  || wn "Wallet in only ${wallet_pages} page(s)"

# Stale addresses
others=$(grep -rohP '0x[0-9a-fA-F]{40}' "$SITE" --include="*.html" --include="*.js" 2>/dev/null \
  | grep -v "$WALLET" | sort -u)
[ -z "$others" ] && ok "No stale wallet addresses" \
  || { wn "Other addresses found:"; echo "$others" | while IFS= read -r a; do nfo "  → ${a}"; done; }


# ═══════════════════════════════════════════════════
# 11 · GITHUB LINKS
# ═══════════════════════════════════════════════════
hdr "11 · GITHUB LINKS"

EXPECTED_GH="github.com/p31labs"

for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  while IFS= read -r link; do
    [ "$link" = "$EXPECTED_GH" ] && ok "${pg} → ${link}" \
      || wn "${pg} → unexpected: ${link}"
  done < <(grep -oP 'github\.com/[a-zA-Z0-9_-]+' "$f" 2>/dev/null | sort -u)
done


# ═══════════════════════════════════════════════════
# 12 · HTML STRUCTURE
# ═══════════════════════════════════════════════════
hdr "12 · HTML STRUCTURE"

for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"
  [ ! -f "$f" ] && continue

  errs=""
  head -1 "$f" | grep -qi '<!doctype html>' || errs="${errs} doctype"
  grep -q 'lang="en"' "$f" 2>/dev/null || errs="${errs} lang"
  grep -q 'viewport' "$f" 2>/dev/null || errs="${errs} viewport"
  grep -q '<title>' "$f" 2>/dev/null || errs="${errs} title"
  grep -q 'meta name="description"' "$f" 2>/dev/null || errs="${errs} meta-desc"

  [ -z "$errs" ] && ok "${pg} — valid" || wn "${pg} — missing:${errs}"
done


# ═══════════════════════════════════════════════════
# 13 · DEPLOYMENT FILES
# ═══════════════════════════════════════════════════
hdr "13 · DEPLOYMENT FILES"

if [ -f "${SITE}/CNAME" ]; then
  cname=$(tr -d '[:space:]' < "${SITE}/CNAME")
  [ "$cname" = "phosphorus31.org" ] && ok "CNAME = phosphorus31.org" \
    || fl "CNAME = '${cname}' (expected phosphorus31.org)"
else
  fl "CNAME missing"
fi

if [ -f "${SITE}/robots.txt" ]; then
  grep -q 'Sitemap:' "${SITE}/robots.txt" 2>/dev/null \
    && ok "robots.txt — Sitemap ✓" || wn "robots.txt — no Sitemap directive"
else
  fl "robots.txt missing"
fi


# ═══════════════════════════════════════════════════
# 14 · CONTENT ALIGNMENT
# ═══════════════════════════════════════════════════
hdr "14 · CONTENT ALIGNMENT"

# Zenodo DOI
DOI="10.5281/zenodo.18627420"
doi_n=0
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"; [ ! -f "$f" ] && continue
  grep -q "$DOI" "$f" 2>/dev/null && doi_n=$((doi_n+1))
done
[ "$doi_n" -ge 1 ] && ok "Zenodo DOI in ${doi_n} page(s)" || wn "Zenodo DOI not found"

# 501(c)(3)
c3_n=0
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"; [ ! -f "$f" ] && continue
  grep -qi '501(c)(3)' "$f" 2>/dev/null && c3_n=$((c3_n+1))
done
[ "$c3_n" -ge 1 ] && ok "501(c)(3) in ${c3_n} page(s)" || wn "501(c)(3) not found"

# Apache license
apache=false
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"; [ ! -f "$f" ] && continue
  grep -qi 'Apache' "$f" 2>/dev/null && { apache=true; break; }
done
$apache && ok "Apache license referenced" || wn "Apache license not found"

# Quantum notation (brand signature)
povm=false
for pg in "${PAGES[@]}"; do
  f="${SITE}/${pg}"; [ ! -f "$f" ] && continue
  # Check for ASCII patterns first (works in all grep implementations)
  if grep -qi 'SIC-POVM\|sic-povm' "$f" 2>/dev/null; then
    povm=true
    break
  fi
  # Try Unicode patterns with -P if available, otherwise skip (content verified manually)
  if grep -qP 'ψᵢ|Π₁' "$f" 2>/dev/null 2>&1; then
    povm=true
    break
  fi
done
$povm && ok "SIC-POVM / quantum notation present" || wn "No quantum notation found"

# William usage context
william_n=$(ghits "William")
[ "$william_n" -gt 0 ] && nfo "'William' in ${william_n} location(s) — verify only in Zenodo author context"


# ═══════════════════════════════════════════════════
#  REPORT
# ═══════════════════════════════════════════════════
echo ""
echo -e "${B}═══════════════════════════════════════════════════${N}"
echo ""
echo -e "   ${G}PASS${N}  ${P}"
echo -e "   ${Y}WARN${N}  ${W}"
echo -e "   ${R}FAIL${N}  ${F}"
echo -e "   ${D}TOTAL ${T}${N}"
echo ""

if [ "$F" -gt 0 ]; then
  echo -e "   ${R}${B}▓▓ BLOCKED ▓▓${N}  ${F} critical failure(s) — do NOT deploy"
  echo ""
  exit 2
elif [ "$W" -gt 0 ]; then
  echo -e "   ${Y}${B}▒▒ REVIEW ▒▒${N}  ${W} warning(s) — review before pushing"
  echo ""
  exit 1
else
  echo -e "   ${G}${B}░░ CLEAR TO DEPLOY ░░${N}"
  echo ""
  exit 0
fi
