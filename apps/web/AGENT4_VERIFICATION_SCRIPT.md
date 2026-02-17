# AGENT 4: POST-DEPLOYMENT VERIFICATION
**Run this after Cloudflare Pages deployment is complete**

---

## 🧪 VERIFICATION CHECKLIST

### 1. HTTPS Verification

```powershell
# Test main domain
curl -I https://phosphorus31.org

# Expected: HTTP/2 200
# If 404 or error, wait longer for DNS/SSL propagation
```

**Check:**
- [ ] Returns HTTP/2 200 (not 404, not 301 to HTTP)
- [ ] SSL certificate valid (green lock in browser)
- [ ] No mixed content warnings

---

### 2. www Redirect

```powershell
# Test www subdomain
curl -I https://www.phosphorus31.org
```

**Check:**
- [ ] Redirects to `https://phosphorus31.org` (301 or 302)
- [ ] Or serves same content

---

### 3. Page Load Test

**Browser checks:**
1. Open: https://phosphorus31.org
2. Open DevTools (F12) → Console tab

**Check:**
- [ ] Page loads in < 1 second
- [ ] No console errors
- [ ] All images load
- [ ] All links work
- [ ] Brand colors correct (Phosphorus Green #2ecc71, Calcium Blue #60a5fa)

---

### 4. Mobile Responsive

**Test:**
1. Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
2. Test different screen sizes (iPhone, iPad, Desktop)

**Check:**
- [ ] Layout adapts correctly
- [ ] Text readable
- [ ] Buttons/links tappable
- [ ] No horizontal scrolling

---

### 5. SEO Files

```powershell
# Test robots.txt
curl https://phosphorus31.org/robots.txt

# Test sitemap.xml
curl https://phosphorus31.org/sitemap.xml
```

**Check:**
- [ ] `robots.txt` accessible and correct
- [ ] `sitemap.xml` accessible and valid XML
- [ ] Both return 200 status

---

### 6. Open Graph Test

**Option A: Social Media Preview**
- Paste URL in Slack/Discord/Twitter
- Verify preview shows correctly (title, description, image)

**Option B: Online Tool**
- Visit: https://www.opengraph.xyz/url/https://phosphorus31.org
- Verify all Open Graph tags are present

**Check:**
- [ ] Title: "P31 Labs — Phosphorus-31 | Assistive Technology Built on Fullerian Synergetics"
- [ ] Description present
- [ ] Image (if og-image.png exists)

---

### 7. Performance Check

**Visit:** https://pagespeed.web.dev/?url=https://phosphorus31.org

**Check:**
- [ ] Mobile score: > 90
- [ ] Desktop score: > 90
- [ ] Load time: < 1 second
- [ ] No critical issues

---

### 8. OPSEC Final Check

**Verify:**
- [ ] No personal information exposed
- [ ] Contact email: `will@p31ca.org` ✅
- [ ] No addresses (only "Georgia" state-level)
- [ ] No children's names
- [ ] No surnames

---

### 9. Content Verification

**Check:**
- [ ] Tagline present: "The Mesh Holds. 🔺"
- [ ] All three products listed (The Buffer, Node One, The Scope)
- [ ] Footer: "Apache 2.0 Licensed"
- [ ] GitHub link: `github.com/p31labs`
- [ ] Contact email: `will@p31ca.org`

---

## 📊 VERIFICATION REPORT TEMPLATE

After running all checks, create: `AGENT4_VERIFICATION_COMPLETE.md`

```markdown
# AGENT 4: POST-DEPLOYMENT VERIFICATION — COMPLETE
**Date:** [DATE]
**Status:** ✅ LIVE or ⚠️ ISSUES

## Results

### HTTPS Verification
- [ ] Status: HTTP/2 200
- [ ] SSL: Valid
- [ ] Mixed content: None

### www Redirect
- [ ] Status: [301/302 or 200]

### Page Load
- [ ] Load time: [X] seconds
- [ ] Console errors: [None/X errors]
- [ ] Images: All load

### Mobile Responsive
- [ ] iPhone: ✅
- [ ] iPad: ✅
- [ ] Desktop: ✅

### SEO Files
- [ ] robots.txt: ✅ Accessible
- [ ] sitemap.xml: ✅ Accessible

### Open Graph
- [ ] Preview: ✅ Works
- [ ] Title: ✅ Correct
- [ ] Description: ✅ Present

### Performance
- [ ] Mobile score: [X]/100
- [ ] Desktop score: [X]/100
- [ ] Load time: [X] seconds

### OPSEC
- [ ] Status: ✅ CLEAN

### Content
- [ ] All elements: ✅ Present

## Final Status
✅ LIVE — Ready for accelerator application
```

---

## 🚨 TROUBLESHOOTING

### DNS Not Resolving
- Wait 5-30 minutes for propagation
- Check Cloudflare DNS tab
- Ensure proxy is enabled (orange cloud)

### SSL Certificate Pending
- Wait up to 24 hours (usually < 5 minutes)
- Check SSL/TLS mode is "Full (strict)"
- Verify DNS records are correct

### 404 Errors
- Verify `index.html` is in build output directory
- Check Cloudflare Pages routing settings

### Performance Issues
- Check image sizes
- Verify CSS/JS minification
- Review Cloudflare Pages build logs

---

**The Mesh Holds. Ready to verify.** 🔺
