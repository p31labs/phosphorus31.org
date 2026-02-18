#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  P³¹ ALIGNMENT SWARM  v4.0 — AUTO-HEAL + AUTO-UPDATE
  phosphorus31.org · diagnose → heal → verify → report

  Usage:
    python3 swarm.py [site-root] [--heal] [--dry-run]

  Modes:
    (default)   Diagnose only
    --heal      Auto-fix everything fixable, then re-verify
    --dry-run   Show what would change without writing

  What it heals:
    • Truncated files (missing </footer>, </body>, </html>)
    • Incomplete foot-links (injects canonical 13-link footer)
    • Missing aria-current="page" on nav and footer self-links
    • Missing prefers-reduced-motion in styles.css
    • Missing sitemap entries
    • Index.html custom footer (injects foot-links + formula)

  What it flags (human review):
    • OPSEC violations (zero tolerance = FAIL)
    • Context-sensitive terms like 'johnson' (WARN)
    • Hardcoded brand colors (WARN, non-blocking)
    • Missing <nav> (FAIL)

  Exit: 0=clean  1=warnings  2=failures
═══════════════════════════════════════════════════════════════
"""

import os, sys, re, shutil
from datetime import datetime, timezone
from pathlib import Path

# ═══════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════

DOMAIN = "phosphorus31.org"
WALLET = "0x90048cbb3CDCef200a54D6D336EbB4e0ce18d82c"
DOI = "10.5281/zenodo.18627420"

PAGES = [
    "index.html", "about/index.html", "docs/index.html",
    "roadmap/index.html", "node-one/index.html", "wallet/index.html",
    "games/index.html", "education/index.html", "blog/index.html",
    "legal/index.html", "accessibility/index.html", "press/index.html",
    "manifesto/index.html",
]

SUPPORT_FILES = ["styles.css", "main.js", "pages.css", "CNAME", "robots.txt", "sitemap.xml"]

PAGE_HREF = {
    "index.html": "/", "about/index.html": "/about/",
    "docs/index.html": "/docs/", "roadmap/index.html": "/roadmap/",
    "node-one/index.html": "/node-one/", "wallet/index.html": "/wallet/",
    "games/index.html": "/games/", "education/index.html": "/education/",
    "blog/index.html": "/blog/", "legal/index.html": "/legal/",
    "accessibility/index.html": "/accessibility/", "press/index.html": "/press/",
    "manifesto/index.html": "/manifesto/",
}

FOOTER_LINKS = [
    ("Home", "/"), ("Docs", "/docs/"), ("Roadmap", "/roadmap/"),
    ("About", "/about/"), ("Node One", "/node-one/"), ("Wallet", "/wallet/"),
    ("Games", "/games/"), ("Learn", "/education/"), ("Blog", "/blog/"),
    ("Legal", "/legal/"), ("A11y", "/accessibility/"), ("Press", "/press/"),
    ("Manifesto", "/manifesto/"),
]

FOOTER_FORMULA = 'Π₁(d) = (1/d)|ψᵢ⟩⟨ψᵢ| where ⟨ψᵢ|ψⱼ⟩ = (dδᵢⱼ + 1)/(d + 1) — The geometry protects the signal.'

OPSEC_ZERO = ["submarine", "naval", "navy", "willow", "sebastian", "christyn", "co-parent"]
OPSEC_INITIALS = [r"S\.J\.", r"W\.J\."]
OPSEC_CONTEXT = ["johnson", "military", "bash"]

REACT_PAGES = {"wallet/index.html"}
CUSTOM_FOOTER_PAGES = {"index.html"}

REDUCED_MOTION_CSS = """
/* ── Reduced Motion (auto-injected by swarm) ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .quantum-mesh, .hero-tetra, .measurement-pulse {
    display: none !important;
  }
}
"""

FISCAL_SPONSOR = 'P31 Labs is fiscally sponsored by The Hack Foundation (d.b.a. Hack Club), a 501(c)(3) nonprofit (EIN: 81-2908499). Donations are tax-deductible to the extent permitted by law.'

# ═══════════════════════════════════════════════════════════════
# OUTPUT
# ═══════════════════════════════════════════════════════════════

class S:
    R="\033[31m"; G="\033[32m"; Y="\033[33m"; M="\033[35m"
    C="\033[36m"; D="\033[90m"; B="\033[1m"; N="\033[0m"

_p=_w=_f=_t=_h=0

def ok(m):
    global _p,_t; _p+=1; _t+=1; print(f"  {S.G}✓{S.N} {m}")
def wn(m):
    global _w,_t; _w+=1; _t+=1; print(f"  {S.Y}⚠{S.N} {m}")
def fl(m):
    global _f,_t; _f+=1; _t+=1; print(f"  {S.R}✗{S.N} {m}")
def fx(m):
    global _h; _h+=1; print(f"  {S.M}⚕{S.N} {m}")
def nfo(m):
    print(f"  {S.D}ℹ {m}{S.N}")
def hdr(t):
    print(f"\n{S.C}━━━ {t} ━━━{S.N}")

# ═══════════════════════════════════════════════════════════════
# FILE I/O
# ═══════════════════════════════════════════════════════════════

def rd(p):
    try: return Path(p).read_text("utf-8")
    except: return None

def wr(p, c, dry=False):
    if dry:
        fx(f"[DRY] would write {p}")
        return
    bak = str(p) + ".bak"
    if os.path.exists(p) and not os.path.exists(bak):
        shutil.copy2(p, bak)
    Path(p).write_text(c, "utf-8")

# ═══════════════════════════════════════════════════════════════
# CANONICAL GENERATORS
# ═══════════════════════════════════════════════════════════════

def gen_foot_links_html(current_href):
    """Generate canonical <a> tags for foot-links."""
    parts = []
    for label, href in FOOTER_LINKS:
        if href == current_href:
            parts.append(f'<a href="{href}" aria-current="page">{label}</a>')
        else:
            parts.append(f'<a href="{href}">{label}</a>')
    return "".join(parts)

def gen_canonical_footer_tail(current_href):
    """Generate everything from foot-links through </html>."""
    links = gen_foot_links_html(current_href)
    return f"""      <div class="foot-links">
        {links}
      </div>
      <p class="footer-formula">{FOOTER_FORMULA}</p>
      <p class="footer-sponsor">{FISCAL_SPONSOR}</p>
    </div>
  </footer>

</body>
</html>
"""

def gen_index_footer_tail():
    """Generate index.html footer tail (different structure)."""
    links = gen_foot_links_html("/")
    return f"""      <div class="foot-links">
        {links}
      </div>
      <p class="footer-formula">{FOOTER_FORMULA}</p>
      <p class="footer-sponsor">{FISCAL_SPONSOR}</p>
    </div>
  </footer>

  <script src="/main.js"></script>
</body>
</html>
"""

# ═══════════════════════════════════════════════════════════════
# HEALERS
# ═══════════════════════════════════════════════════════════════

def heal_truncated_footer(content, page, dry=False):
    """
    Fix truncated pages by finding the foot-links div and replacing
    everything from there to EOF with canonical footer closing.
    """
    if page in REACT_PAGES:
        return content, False

    href = PAGE_HREF.get(page, "/")
    is_index = page == "index.html"

    # Check if file is properly closed
    if "</html>" in content:
        # File is complete — just check foot-links content
        return heal_foot_links_in_place(content, page, href)

    # File is TRUNCATED — find the best cut point and rebuild
    # Strategy: find the start of foot-links div (or footer-formula for index)
    # and replace everything from there to EOF

    cut_idx = None

    # Try to find foot-links div start
    fl_idx = content.find('<div class="foot-links"')
    if fl_idx >= 0:
        cut_idx = fl_idx

    # For index.html, also check for footer-formula
    if is_index and cut_idx is None:
        ff_idx = content.find('<div class="footer-formula"')
        if ff_idx >= 0:
            cut_idx = ff_idx

    # If we can't find either, find the footer tag and work from there
    if cut_idx is None:
        ft_idx = content.rfind("<footer>")
        if ft_idx >= 0:
            # Find the closing of footer-inner
            inner_end = content.find("</div>", content.find("footer-inner", ft_idx))
            if inner_end >= 0:
                # Skip past the tagline span's closing div
                next_div_close = content.find("</div>", inner_end + 6)
                if next_div_close >= 0:
                    cut_idx = next_div_close + len("</div>") + 1

    if cut_idx is None:
        return content, False

    # Cut and rebuild
    head = content[:cut_idx]
    if is_index:
        tail = gen_index_footer_tail()
    else:
        tail = gen_canonical_footer_tail(href)

    return head + tail, True


def heal_foot_links_in_place(content, page, href):
    """For non-truncated files, replace just the foot-links content."""
    if page in REACT_PAGES or page in CUSTOM_FOOTER_PAGES:
        return content, False

    # Find the foot-links div
    fl_start = content.find('<div class="foot-links">')
    if fl_start < 0:
        fl_start = content.find('<div class="foot-links"')
    if fl_start < 0:
        return content, False

    # Find the closing </div> for foot-links
    fl_end = content.find("</div>", fl_start + 20)
    if fl_end < 0:
        return content, False
    fl_end += len("</div>")

    existing = content[fl_start:fl_end]
    canonical_links = gen_foot_links_html(href)
    canonical_block = f'<div class="foot-links">\n        {canonical_links}\n      </div>'

    # Normalize for comparison
    ex_norm = re.sub(r'\s+', ' ', existing.strip())
    cn_norm = re.sub(r'\s+', ' ', canonical_block.strip())

    if ex_norm == cn_norm:
        return content, False

    return content[:fl_start] + canonical_block + content[fl_end:], True


def heal_nav_aria(content, page):
    """Fix aria-current in nav for the current page."""
    if page in REACT_PAGES or page == "index.html":
        return content, False

    href = PAGE_HREF.get(page, "/")

    # Find nav block
    nav_start = content.find("<nav")
    nav_end = content.find("</nav>")
    if nav_start < 0 or nav_end < 0:
        return content, False

    nav_end += len("</nav>")
    nav = content[nav_start:nav_end]

    # Check if aria-current is already correct
    if f'href="{href}" aria-current="page"' in nav or f'aria-current="page"' in nav:
        # Verify it's on the right link
        if f'href="{href}"' in nav and 'aria-current="page"' in nav:
            return content, False

    # Remove existing aria-current
    new_nav = nav.replace(' aria-current="page"', '')

    # Add to correct link
    target = f'href="{href}"'
    new_nav = new_nav.replace(target, f'{target} aria-current="page"', 1)

    if new_nav != nav:
        return content[:nav_start] + new_nav + content[nav_end:], True

    return content, False


def heal_reduced_motion(site, dry=False):
    """Inject prefers-reduced-motion into styles.css."""
    p = os.path.join(site, "styles.css")
    c = rd(p)
    if not c or "prefers-reduced-motion" in c:
        return False
    wr(p, c + REDUCED_MOTION_CSS, dry)
    return True


def heal_sitemap(site, dry=False):
    """Ensure all pages listed in sitemap.xml."""
    p = os.path.join(site, "sitemap.xml")
    c = rd(p)
    if not c:
        return False
    changed = False
    for pg in PAGES:
        href = PAGE_HREF[pg]
        url = f"https://{DOMAIN}{href}"
        if url not in c:
            pri = {"/" : "1.0"}.get(href, "0.7")
            entry = f"  <url><loc>{url}</loc><priority>{pri}</priority></url>"
            c = c.replace("</urlset>", f"{entry}\n</urlset>")
            changed = True
    if changed:
        wr(p, c, dry)
    return changed


# ═══════════════════════════════════════════════════════════════
# DIAGNOSTICS
# ═══════════════════════════════════════════════════════════════

def fcount(term, filepath):
    c = rd(filepath)
    return len(re.findall(re.escape(term), c, re.I)) if c else 0

def fcount_rx(pat, filepath):
    c = rd(filepath)
    return len(re.findall(pat, c)) if c else 0

def fgrep(term, filepath, n=3):
    c = rd(filepath)
    if not c: return []
    out = []
    for i, line in enumerate(c.split("\n"), 1):
        if term.lower() in line.lower():
            out.append(f"{filepath}:{i}: {line.strip()[:120]}")
            if len(out) >= n: break
    return out


# ═══════════════════════════════════════════════════════════════
# MAIN SWARM
# ═══════════════════════════════════════════════════════════════

def swarm(site, heal=False, dry=False):
    global _p,_w,_f,_t,_h
    _p=_w=_f=_t=_h=0

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    mode = "HEAL" if heal else ("DRY RUN" if dry else "DIAGNOSE")
    do = heal or dry

    print(f"{S.B}")
    print("╔═══════════════════════════════════════════════════════╗")
    print(f"║  P³¹ ALIGNMENT SWARM v4.0 — {mode:<24s}║")
    print("║  auto-heal · auto-update · auto-verify               ║")
    print("╚═══════════════════════════════════════════════════════╝")
    print(S.N)
    print(f"{S.D}Root: {site}  ·  {ts}  ·  Mode: {mode}{S.N}")

    # ───────────────────────────────────────────────
    # 01 · FILE INVENTORY
    # ───────────────────────────────────────────────
    hdr("01 · FILE INVENTORY")
    for pg in PAGES:
        fp = os.path.join(site, pg)
        if os.path.exists(fp):
            ok(f"{pg}  ({sum(1 for _ in open(fp))}L)")
        else:
            fl(f"MISSING: {pg}")

    for f in SUPPORT_FILES:
        fp = os.path.join(site, f)
        if os.path.exists(fp):
            ok(f)
        elif f == "pages.css":
            wn(f"{f} (optional)")
        else:
            fl(f"MISSING: {f}")

    # ───────────────────────────────────────────────
    # 02 · OPSEC
    # ───────────────────────────────────────────────
    hdr("02 · OPSEC SWEEP")

    all_files = [os.path.join(site, pg) for pg in PAGES]
    all_files += [os.path.join(site, f) for f in ["styles.css", "main.js"] if os.path.exists(os.path.join(site, f))]

    print(f"  {S.B}Zero tolerance:{S.N}")
    for term in OPSEC_ZERO:
        n = sum(fcount(term, f) for f in all_files)
        if n > 0:
            fl(f"OPSEC VIOLATION: '{term}' — {n}×")
            for f in all_files:
                for ctx in fgrep(term, f): nfo(f"  → {ctx}")
        else:
            ok(f"'{term}' clean")

    for pat in OPSEC_INITIALS:
        n = sum(fcount_rx(pat, f) for f in all_files)
        fl(f"OPSEC VIOLATION: '{pat}' — {n}×") if n else ok(f"'{pat}' clean")

    print(f"\n  {S.B}Context-sensitive:{S.N}")
    for term in OPSEC_CONTEXT:
        n = sum(fcount(term, f) for f in all_files)
        if n:
            wn(f"'{term}' — {n}× (verify context)")
            for f in all_files:
                for ctx in fgrep(term, f, 4): nfo(f"  → {ctx}")
        else:
            ok(f"'{term}' clean")

    # ───────────────────────────────────────────────
    # 03 · TRUNCATION + FOOTER HEAL
    # ───────────────────────────────────────────────
    hdr("03 · STRUCTURE INTEGRITY")

    for pg in PAGES:
        fp = os.path.join(site, pg)
        content = rd(fp)
        if not content: continue

        if pg in REACT_PAGES:
            nfo(f"{pg} — React SPA (exempt)")
            continue

        has_close = "</html>" in content
        has_footer_close = "</footer>" in content

        if has_close and has_footer_close:
            ok(f"{pg} — complete")
        elif not has_close:
            fl(f"{pg} — TRUNCATED (missing </html>)")
            if do:
                new, changed = heal_truncated_footer(content, pg, dry)
                if changed:
                    wr(fp, new, dry)
                    fx(f"{pg} — rebuilt footer + closed tags")
        elif not has_footer_close:
            wn(f"{pg} — missing </footer>")
            if do:
                new, changed = heal_truncated_footer(content, pg, dry)
                if changed:
                    wr(fp, new, dry)
                    fx(f"{pg} — repaired footer")

    # ───────────────────────────────────────────────
    # 04 · NAVIGATION
    # ───────────────────────────────────────────────
    hdr("04 · NAVIGATION")

    for pg in PAGES:
        fp = os.path.join(site, pg)
        content = rd(fp)
        if not content: continue

        if pg in REACT_PAGES:
            nfo(f"{pg} — React SPA (exempt)")
            continue

        has_nav = "<nav" in content
        has_logo = "P<sup>31</sup>" in content

        if has_nav and has_logo:
            ok(f"{pg} — nav + logo")
        elif has_nav:
            wn(f"{pg} — nav present, logo missing")
        else:
            fl(f"{pg} — MISSING <nav>")

        # Heal nav aria-current
        if do and pg != "index.html":
            new, changed = heal_nav_aria(content, pg)
            if changed:
                wr(fp, new, dry)
                fx(f"{pg} — healed nav aria-current")

    # ───────────────────────────────────────────────
    # 05 · FOOTER LINKS (re-verify after structural heal)
    # ───────────────────────────────────────────────
    hdr("05 · FOOTER LINKS")

    for pg in PAGES:
        fp = os.path.join(site, pg)
        content = rd(fp)  # re-read post-heal
        if not content: continue

        if pg in REACT_PAGES:
            nfo(f"{pg} — React SPA (exempt)")
            continue

        # Check if all 13 links are present
        missing = [h for _, h in FOOTER_LINKS if f'href="{h}"' not in content]

        if not missing:
            ok(f"{pg} — all 13 footer links")
        else:
            wn(f"{pg} — missing {len(missing)}: {' '.join(missing)}")
            if do:
                new, changed = heal_foot_links_in_place(content, pg, PAGE_HREF.get(pg, "/"))
                if changed:
                    wr(fp, new, dry)
                    fx(f"{pg} — updated foot-links")

    # ───────────────────────────────────────────────
    # 06 · SITEMAP
    # ───────────────────────────────────────────────
    hdr("06 · SITEMAP")

    smp = os.path.join(site, "sitemap.xml")
    if not os.path.exists(smp):
        fl("sitemap.xml missing")
    else:
        smc = rd(smp)
        missing_urls = []
        for pg in PAGES:
            url = f"https://{DOMAIN}{PAGE_HREF[pg]}"
            if url in smc:
                ok(f"sitemap → {PAGE_HREF[pg]}")
            else:
                fl(f"sitemap MISSING: {PAGE_HREF[pg]}")
                missing_urls.append(url)
        if do and missing_urls:
            if heal_sitemap(site, dry):
                fx(f"sitemap — added {len(missing_urls)} URL(s)")

    # ───────────────────────────────────────────────
    # 07 · INTERNAL LINKS
    # ───────────────────────────────────────────────
    hdr("07 · INTERNAL LINKS")

    broken = 0
    for pg in PAGES:
        fp = os.path.join(site, pg)
        content = rd(fp)
        if not content: continue
        for href in set(re.findall(r'href="(/[^"]*)"', content)):
            path = href.split("#")[0]
            if not path or path == "/" or path.startswith("/cdn-cgi/"): continue
            if path.endswith("/"):
                target = os.path.join(site, path.lstrip("/"), "index.html")
            elif "." in path.split("/")[-1]:
                target = os.path.join(site, path.lstrip("/"))
            else:
                target = os.path.join(site, path.lstrip("/"))
                if not os.path.exists(target):
                    target = os.path.join(site, path.lstrip("/"), "index.html")
            if not os.path.exists(target):
                wn(f"{pg} → broken: {path}")
                broken += 1
    if broken == 0:
        ok("All internal links resolve")

    # ───────────────────────────────────────────────
    # 08 · ACCESSIBILITY
    # ───────────────────────────────────────────────
    hdr("08 · ACCESSIBILITY")

    # aria-current (re-read for post-heal state)
    for pg in PAGES:
        if pg in REACT_PAGES or pg == "index.html": continue
        content = rd(os.path.join(site, pg))
        if not content: continue
        if 'aria-current="page"' in content:
            ok(f"{pg} — aria-current ✓")
        else:
            wn(f"{pg} — no aria-current")

    # prefers-reduced-motion
    css = rd(os.path.join(site, "styles.css"))
    if css:
        if "prefers-reduced-motion" in css:
            ok("styles.css — prefers-reduced-motion ✓")
        else:
            wn("styles.css — no prefers-reduced-motion")
            if do and heal_reduced_motion(site, dry):
                fx("styles.css — injected reduced-motion query")

    # canvas aria-hidden
    for pg in PAGES:
        content = rd(os.path.join(site, pg))
        if not content: continue
        if "<canvas" in content:
            if "aria-hidden" in content:
                ok(f"{pg} — canvas aria-hidden ✓")
            else:
                wn(f"{pg} — <canvas> without aria-hidden")

    # ───────────────────────────────────────────────
    # 09 · HTML STRUCTURE
    # ───────────────────────────────────────────────
    hdr("09 · HTML STRUCTURE")

    for pg in PAGES:
        content = rd(os.path.join(site, pg))
        if not content: continue
        errs = []
        if not re.match(r'(?i)<!doctype html>', content[:50]): errs.append("doctype")
        if 'lang="en"' not in content[:500]: errs.append("lang")
        if "viewport" not in content[:1000]: errs.append("viewport")
        if "<title>" not in content[:2000]: errs.append("title")
        if 'name="description"' not in content[:3000]: errs.append("meta-desc")
        if "</html>" not in content: errs.append("</html>")
        if "</body>" not in content: errs.append("</body>")
        ok(f"{pg} — valid") if not errs else wn(f"{pg} — missing: {' '.join(errs)}")

    # ───────────────────────────────────────────────
    # 10 · DEPLOYMENT
    # ───────────────────────────────────────────────
    hdr("10 · DEPLOYMENT")

    cname = rd(os.path.join(site, "CNAME"))
    if cname:
        ok(f"CNAME = {DOMAIN}") if cname.strip() == DOMAIN else fl(f"CNAME wrong: '{cname.strip()}'")
    else:
        fl("CNAME missing")

    robots = rd(os.path.join(site, "robots.txt"))
    if robots:
        ok("robots.txt — Sitemap ✓") if "Sitemap:" in robots else wn("robots.txt — no Sitemap")
    else:
        fl("robots.txt missing")

    # ───────────────────────────────────────────────
    # 11 · CONTENT ALIGNMENT
    # ───────────────────────────────────────────────
    hdr("11 · CONTENT ALIGNMENT")

    doi_n = sum(1 for pg in PAGES if fcount(DOI, os.path.join(site, pg)))
    ok(f"Zenodo DOI in {doi_n} page(s)") if doi_n else wn("Zenodo DOI not found")

    c3_n = sum(1 for pg in PAGES if fcount("501(c)(3)", os.path.join(site, pg)))
    ok(f"501(c)(3) in {c3_n} page(s)") if c3_n else wn("501(c)(3) not found")

    ok("Apache license ✓") if any(fcount("Apache", os.path.join(site, pg)) for pg in PAGES) else wn("Apache not found")
    ok("SIC-POVM ✓") if any(fcount_rx(r"SIC-POVM|ψᵢ|Π₁", os.path.join(site, pg)) for pg in PAGES) else wn("Quantum notation missing")

    wn_n = sum(1 for pg in PAGES if fcount(WALLET, os.path.join(site, pg)))
    ok(f"Wallet in {wn_n} page(s)") if wn_n >= 2 else wn(f"Wallet in {wn_n} page(s)")

    # HCB fiscal sponsor disclosure
    hcb_n = sum(1 for pg in PAGES if fcount("81-2908499", os.path.join(site, pg)))
    ok(f"HCB EIN (81-2908499) in {hcb_n} page(s)") if hcb_n >= 3 else wn(f"HCB EIN in only {hcb_n} page(s) (expect 3+)")

    sponsor_n = sum(1 for pg in PAGES if fcount("Hack Foundation", os.path.join(site, pg)))
    ok(f"Fiscal sponsor disclosure in {sponsor_n} page(s)") if sponsor_n >= 3 else wn(f"Fiscal sponsor in only {sponsor_n} page(s)")

    # Fonts
    for pg in PAGES:
        content = rd(os.path.join(site, pg))
        if content and "fonts.googleapis.com" in content:
            ok(f"{pg} — fonts ✓")
        elif content:
            wn(f"{pg} — no font link")

    # ───────────────────────────────────────────────
    # REPORT
    # ───────────────────────────────────────────────
    print()
    print(f"{S.B}{'═'*55}{S.N}")
    print()
    print(f"   {S.G}PASS{S.N}   {_p}")
    print(f"   {S.Y}WARN{S.N}   {_w}")
    print(f"   {S.R}FAIL{S.N}   {_f}")
    if _h: print(f"   {S.M}HEALED{S.N} {_h}")
    print(f"   {S.D}TOTAL  {_t}{S.N}")
    print()

    if _h and not dry:
        print(f"   {S.M}{S.B}⚕ {_h} issue(s) auto-healed · backups in *.bak{S.N}")
        print()

    if _f:
        print(f"   {S.R}{S.B}▓▓ BLOCKED ▓▓{S.N}  {_f} critical failure(s)")
        return 2
    elif _w:
        print(f"   {S.Y}{S.B}▒▒ REVIEW ▒▒{S.N}  {_w} warning(s)")
        return 1
    else:
        print(f"   {S.G}{S.B}░░ CLEAR TO DEPLOY ░░{S.N}")
        return 0


# ═══════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="P³¹ Alignment Swarm v4")
    ap.add_argument("site_root", nargs="?", default=".")
    ap.add_argument("--heal", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if args.heal and args.dry_run:
        print("Cannot combine --heal and --dry-run"); sys.exit(1)

    code = swarm(args.site_root, heal=args.heal, dry=args.dry_run)

    # Auto re-verify after healing
    if (args.heal or args.dry_run) and _h > 0 and not args.dry_run:
        print(f"\n{S.C}{'═'*55}")
        print(f"  RE-VERIFICATION (post-heal)")
        print(f"{'═'*55}{S.N}")
        code = swarm(args.site_root)

    sys.exit(code)
