# PHENIX FRAMEWORK WEBSITE - BUILD GUIDE
## Complete Implementation Roadmap for VSCode + Copilot

**Timeline:** 16 days (Dec 1-16, 2025)
**Goal:** Live configurator + documentation site
**Deployment:** Vercel (free tier, production-ready)

---

## QUICK START (DO THIS FIRST)

### Terminal Commands (Run Now):

```bash
# Create Next.js app
npx create-next-app@latest phenix-framework

# When prompted, select:
# ✅ TypeScript? Yes
# ✅ ESLint? Yes  
# ✅ Tailwind CSS? Yes
# ✅ `src/` directory? Yes
# ✅ App Router? Yes
# ❌ Turbopack? No (not stable yet)
# ✅ Customize import alias? No

# Navigate into project
cd phenix-framework

# Install additional dependencies
npm install @headlessui/react framer-motion react-hook-form zod

# Open in VSCode
code .

# Start dev server
npm run dev
```

**Open browser:** http://localhost:3000

**You should see:** Next.js welcome page

**First dopamine hit:** ✓ Environment working

---

## PROJECT STRUCTURE

```
phenix-framework/
├── src/
│   ├── app/
│   │   ├── page.tsx                 (Homepage)
│   │   ├── layout.tsx               (Root layout)
│   │   ├── configurator/
│   │   │   └── page.tsx             (Main configurator)
│   │   ├── docs/
│   │   │   ├── technical/
│   │   │   ├── emotional/
│   │   │   ├── practical/
│   │   │   └── philosophical/
│   │   └── api/
│   │       └── generate-protocol/
│   │           └── route.ts
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── TetrahedronViz.tsx
│   │   └── configurator/
│   ├── lib/
│   │   ├── templates/
│   │   └── generators/
│   └── types/
│       └── index.ts
├── public/
│   └── (static assets)
└── package.json
```

---

## BUILD PHASES (16 DAYS)

### PHASE 1: FOUNDATION (Days 1-2)

**Day 1 - Basic Setup**

**File:** `src/app/page.tsx`

**Copilot Prompt:**
```
Create a hero section for the Phenix Framework homepage.

Requirements:
- Headline: "Stability Through Geometry"
- Subheading: "Transform your system from dependent to resilient"
- Two CTAs: "Configure Your Deployment" and "Learn the Framework"
- Clean, minimal design with Tailwind CSS
- Responsive mobile layout
- Dark background with subtle gradient

Style inspiration: Apple product pages - clean, confident, minimal
```

**Expected output:** Landing page with hero section

**Dopamine hit:** ✓ Site has visual identity

---

**Day 1 - Navigation**

**File:** `src/components/Navigation.tsx`

**Copilot Prompt:**
```
Create a navigation component with four vertex indicators.

Requirements:
- Four nav items: Technical, Emotional, Practical, Philosophical
- Each has a color: Blue, Purple, Green, Amber
- Current page highlighted
- Mobile hamburger menu
- Sticky on scroll
- Smooth transitions

Use Tailwind CSS and Headless UI for accessibility
```

**Expected output:** Working navigation component

**Dopamine hit:** ✓ Site navigation works

---

### PHASE 2: CONFIGURATOR (Days 3-6)

**Day 3 - Form Scaffold**

**File:** `src/app/configurator/page.tsx`

**Copilot Prompt:**
```
Create a multi-step form wizard for family system configuration.

7 steps total:
1. Structure type (family-divorce, family-intact, team, etc.)
2. Node count and details
3. Current state (wye/delta/transition/short-circuit)
4. Operating systems per node (technical/emotional/practical/philosophical)
5. Stakeholder identification
6. Timeline and constraints
7. Protocol generation

Requirements:
- Progress indicator showing current step
- Next/Back buttons
- Form validation (use react-hook-form + zod)
- Save to localStorage on each step
- Mobile responsive
- Smooth transitions between steps

Use Tailwind for styling
```

**Expected output:** Working multi-step form

**Dopamine hit:** ✓ User can navigate configurator steps

---

**Day 4 - Question Logic**

**File:** `src/lib/configurator/questions.ts`

**Copilot Prompt:**
```
Create branching question logic for configurator.

If user selects "family-divorce":
  Ask about custody status
  Ask about co-parent relationship
  Ask about kids' ages
  Ask about legal involvement

If user selects "family-intact":
  Ask about stress points
  Ask about communication patterns
  Ask about recent changes

If user selects "work-team":
  Ask about team size
  Ask about reporting structure
  Ask about current dysfunction

Create TypeScript interfaces for all question types.
Export conditional logic functions.
```

**Expected output:** Question branching system

**Dopamine hit:** ✓ Configurator adapts to user answers

---

**Day 5 - Data Collection**

**File:** `src/types/index.ts`

**Copilot Prompt:**
```
Create TypeScript types for configurator data.

Types needed:
- StructureType ('family-divorce' | 'family-intact' | 'team' | etc.)
- Node (name, age, role, operatingSystem)
- CurrentState ('wye' | 'delta' | 'transition' | 'short-circuit')
- OperatingSystem ('technical' | 'emotional' | 'practical' | 'philosophical')
- Stakeholder (type, relationship, importance)
- Timeline (days, targetDate, milestones)
- ConfiguratorInput (complete user submission)
- Protocol (generated output)

Use Zod for runtime validation.
Export schemas and types.
```

**Expected output:** Type-safe data structures

**Dopamine hit:** ✓ Configurator is type-safe

---

**Day 6 - Form Validation**

**File:** `src/app/configurator/page.tsx` (update)

**Copilot Prompt:**
```
Add validation to configurator form using react-hook-form and zod.

Validation rules:
- Structure type: required
- At least 2 nodes (minimum for any structure)
- At most 8 nodes (complexity limit)
- Node names: required, 2-50 characters
- Node ages: 0-120
- Timeline: minimum 7 days
- All required fields marked with asterisk
- Error messages shown inline
- Can't proceed to next step if validation fails

Show helpful error messages, not generic ones.
```

**Expected output:** Validated form with error handling

**Dopamine hit:** ✓ Form prevents invalid inputs

---

### PHASE 3: PROTOCOL GENERATION (Days 7-9)

**Day 7 - Template Engine**

**File:** `src/lib/templates/family-divorce.ts`

**Copilot Prompt:**
```
Create a protocol template generator for family-divorce structure.

Input: ConfiguratorInput
Output: Markdown document with:

1. MASTER_PROTOCOL.md section:
   - Structure overview
   - Node analysis
   - Current state assessment
   - 4-phase deployment sequence
   - Daily timeline

2. DELIVERY_PROTOCOL_[NODE].md sections (one per person):
   - Pre-delivery prep
   - Delivery script (word-for-word)
   - Post-delivery follow-up
   - Success metrics
   - Troubleshooting

3. STAKEHOLDER_PROTOCOL sections
4. SUCCESS_METRICS_DASHBOARD

Use template strings with ${variable} interpolation.
Make it personal - use actual names, not placeholders.

Example node from Johnson Family:
{
  name: "Will",
  age: 40,
  role: "parent",
  os: "technical"
}

Should generate delivery protocol that speaks to him technically.
```

**Expected output:** Template generator function

**Dopamine hit:** ✓ System generates custom protocols

---

**Day 8 - API Route**

**File:** `src/app/api/generate-protocol/route.ts`

**Copilot Prompt:**
```
Create API route for protocol generation.

POST /api/generate-protocol
Body: ConfiguratorInput (validated)

Response: {
  protocol: string (markdown),
  success: boolean,
  timestamp: string
}

Process:
1. Receive and validate input
2. Select appropriate template (family-divorce, team, etc.)
3. Generate protocol using template
4. Return markdown document

Handle errors gracefully.
Add rate limiting (max 10 requests per IP per hour).
Log requests for analytics.
```

**Expected output:** Working API endpoint

**Dopamine hit:** ✓ Backend generates protocols

---

**Day 9 - PDF Export**

**File:** `src/lib/pdf-generator.ts`

**Copilot Prompt:**
```
Add PDF generation for protocols.

Options:
1. Client-side: Use jsPDF or html2pdf
2. Server-side: Use Puppeteer (heavier)

Recommendation: Start with client-side for simplicity.

Create function that:
- Takes markdown protocol
- Converts to formatted HTML
- Generates PDF with proper formatting
- Includes table of contents
- Page numbers
- Professional styling

Trigger: "Download PDF" button on protocol preview page
```

**Expected output:** PDF download functionality

**Dopamine hit:** ✓ Users get downloadable protocols

---

### PHASE 4: DOCUMENTATION (Days 10-12)

**Day 10 - Vertex Pages**

**File:** `src/app/docs/technical/page.tsx`

**Copilot Prompt:**
```
Create landing page for Technical vertex.

Layout:
- Hero: "Technical Vertex - How It Works"
- Description: "Enter here if you want to understand the math,
  the circuits, the engineering principles."
- Document list:
  - Electrical Theory (Wye-Delta)
  - Hardware Specifications
  - Firmware Architecture
- Connected Edges section:
  - Link to Build Guide (→ Practical)
  - Link to Math of Stability (→ Philosophical)
  - Link to Hardware as Healing (→ Emotional)
- Jump to Vertex shortcuts (other 3 vertices)

Color scheme: Blue (#3B82F6)
Repeat for: Emotional (Purple), Practical (Green), Philosophical (Amber)
```

**Expected output:** Four vertex landing pages

**Dopamine hit:** ✓ Documentation structure exists

---

**Day 11 - MDX Setup**

**File:** `src/app/docs/technical/electrical-theory/page.mdx`

**Copilot Prompt:**
```
Set up MDX for documentation pages.

Install: npm install @next/mdx @mdx-js/loader @mdx-js/react

Configure next.config.mjs to handle .mdx files.

Create custom MDX components:
- <Callout type="warning|info|success" />
- <VertexLink to="/docs/emotional" />
- <CodeBlock language="python" />

Convert existing documentation:
- Electrical Theory (from Opus transcript)
- Kids Manual (from existing files)
- Build Guide (from technical docs)

Add syntax highlighting for code blocks.
```

**Expected output:** MDX documentation system

**Dopamine hit:** ✓ Docs are live and readable

---

**Day 12 - Search**

**File:** `src/components/Search.tsx`

**Copilot Prompt:**
```
Add search functionality to documentation.

Use Algolia DocSearch (free for open source) or
Build simple client-side search with Fuse.js

Features:
- Keyboard shortcut (Cmd+K or Ctrl+K)
- Search all documentation
- Show vertex in results
- Navigate with arrow keys
- Mobile responsive

Display: Modal overlay with search input and results
```

**Expected output:** Working search

**Dopamine hit:** ✓ Users can find information

---

### PHASE 5: POLISH (Days 13-14)

**Day 13 - 3D Tetrahedron**

**File:** `src/components/TetrahedronViz.tsx`

**Copilot Prompt:**
```
Create interactive 3D tetrahedron using React-Three-Fiber.

Install: npm install three @react-three/fiber @react-three/drei

Features:
- 4 vertices (labeled: Technical, Emotional, Practical, Philosophical)
- 6 edges connecting vertices
- Slow rotation when idle
- Click and drag to rotate
- Click vertex to navigate to that page
- Current vertex glows/highlighted
- Vertex colors: Blue, Purple, Green, Amber
- Wireframe aesthetic

Fallback for devices without WebGL: Static SVG diagram

Size: Responsive (large on desktop, small on mobile)
```

**Expected output:** Interactive 3D visualization

**Dopamine hit:** ✓ Site looks impressive

---

**Day 14 - Mobile Optimization**

**Copilot Prompt:**
```
Optimize entire site for mobile.

Test on:
- iPhone SE (small screen)
- iPad (tablet)
- Desktop

Fix:
- Navigation hamburger menu on mobile
- Configurator form on small screens
- Documentation reading experience
- Touch targets (min 44px)
- Font sizes (readable without zoom)

Add viewport meta tag.
Test with Chrome DevTools device simulator.
```

**Expected output:** Mobile-friendly site

**Dopamine hit:** ✓ Works on all devices

---

### PHASE 6: DEPLOY (Days 15-16)

**Day 15 - Vercel Setup**

**Terminal Commands:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel (creates account if needed)
vercel login

# Deploy (first time - follow prompts)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: phenix-framework
# - Directory: ./
# - Override settings? No

# Production deploy
vercel --prod
```

**Expected output:** Live URL (e.g., phenix-framework.vercel.app)

**Dopamine hit:** ✓ SITE IS LIVE

---

**Day 16 - Domain + Analytics**

**Optional: Custom Domain**

```bash
# If you buy phenixframework.com:
vercel domains add phenixframework.com

# Follow DNS setup instructions
# (Add A record and CNAME in domain registrar)
```

**Analytics Setup:**

**File:** `src/app/layout.tsx`

**Copilot Prompt:**
```
Add privacy-focused analytics using Vercel Analytics.

Install: npm install @vercel/analytics

Add to root layout:
import { Analytics } from '@vercel/analytics/react'

Track:
- Page views
- Configurator completions
- Protocol downloads
- Vertex entry points

No cookies, no tracking, privacy-respecting.
```

**Expected output:** Analytics dashboard

**Dopamine hit:** ✓ Can see usage metrics

---

## DAILY WORKFLOW

### Morning (30-60 min):

```bash
# Pull latest code (if using git)
git pull

# Start dev server
npm run dev

# Open browser to localhost:3000
# Pick one copilot prompt from today's phase
# Paste into copilot
# Review generated code
# Test in browser
# Commit if working
```

### Evening (30-60 min):

```bash
# Pick another prompt
# Repeat process
# Commit working code
# Push to git (optional but recommended)

git add .
git commit -m "Day X: [feature completed]"
git push
```

---

## COPILOT TIPS

### How to Get Best Results:

**1. Be Specific:**
```
❌ "Create a form"
✅ "Create a multi-step form with 7 steps, progress indicator,
   validation, and localStorage persistence"
```

**2. Provide Context:**
```
❌ "Add styling"
✅ "Add Tailwind CSS styling with blue theme (#3B82F6),
   rounded corners, shadow on hover, mobile responsive"
```

**3. Reference Existing Code:**
```
❌ "Make it work with the other thing"
✅ "Import the ConfiguratorInput type from src/types/index.ts
   and use it to validate this form"
```

**4. Ask for Explanations:**
```
"Generate this code and explain what each part does"
```

**5. Iterate:**
```
First: "Create basic version"
Then: "Add error handling"
Then: "Make it mobile responsive"
Then: "Add animations"
```

---

## TROUBLESHOOTING

### Common Issues:

**TypeScript errors:**
```bash
# Restart TypeScript server in VSCode
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Module not found:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## TESTING CHECKLIST

Before deploying, test:

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Configurator form validation
- [ ] Protocol generation
- [ ] PDF download
- [ ] All 4 vertex pages load
- [ ] Documentation is readable
- [ ] Search works
- [ ] Mobile responsive
- [ ] Works in Safari, Chrome, Firefox
- [ ] No console errors
- [ ] Fast page loads (< 2 seconds)

---

## EMERGENCY SIMPLIFICATION

**If running out of time, CUT these features:**

❌ 3D tetrahedron (use static SVG)
❌ Search (users can browse)
❌ PDF export (copy markdown to clipboard instead)
❌ Multiple protocol templates (just do family-divorce)
❌ Analytics (add later)

**KEEP these essential features:**

✅ Homepage
✅ Configurator (even if basic)
✅ Protocol generation
✅ Documentation (at least Technical + Practical vertices)
✅ Mobile responsive

**Minimum Viable Product:**
- User can configure family structure
- System generates custom protocol
- User can download/copy protocol
- Documentation explains framework

**Ship that first. Iterate later.**

---

## GIT WORKFLOW (RECOMMENDED)

```bash
# Initialize repo (first time)
git init
git add .
git commit -m "Initial commit"

# Daily commits
git add .
git commit -m "Day X: [what you built]"

# Push to GitHub (backup + portfolio)
# Create repo at github.com
git remote add origin https://github.com/yourusername/phenix-framework.git
git push -u origin main

# Vercel auto-deploys from GitHub (set this up in Vercel dashboard)
```

---

## SUCCESS METRICS

**By Dec 16, you should have:**

✅ Live website at phenix-framework.vercel.app
✅ Working configurator
✅ Protocol generation for family-divorce structure
✅ 4 vertex documentation pages
✅ Mobile responsive design
✅ No critical bugs
✅ Under 3 second page load
✅ Your own Johnson Family protocol generated and downloaded

**Bonus achievements:**
- Custom domain
- All protocol templates (not just family-divorce)
- Search functionality
- 3D tetrahedron
- 100% Lighthouse score

---

## FINAL DEPLOYMENT CHECKLIST

```bash
# Build production version locally (test first)
npm run build

# If build succeeds, deploy
vercel --prod

# Test production URL
# Share with one friend for feedback
# Fix any critical issues
# Deploy again if needed

# When satisfied:
# Share URL in custody documents
# Share with Tyler
# Share on social media (optional)
```

---

## RESOURCES

**Next.js Docs:** https://nextjs.org/docs
**Tailwind CSS:** https://tailwindcss.com/docs
**React Hook Form:** https://react-hook-form.com
**Vercel Deployment:** https://vercel.com/docs
**TypeScript:** https://www.typescriptlang.org/docs

---

## DAILY DOPAMINE CHECKLIST

Create file: `build-log.md` to track wins

```markdown
# Phenix Framework Build Log

## Day 1 - Dec 1
- ✅ Created Next.js app
- ✅ Homepage hero section
- ✅ Navigation component
- 🎯 Tomorrow: Start configurator

## Day 2 - Dec 2
- ✅ Configurator scaffold
- ✅ Progress indicator
- ✅ First step working
- 🎯 Tomorrow: Add more steps
```

**Each checkbox = dopamine hit = wye start 🎯**

---

## YOU'VE GOT THIS

**16 days.**

**Small wins daily.**

**Parallel paths with Claude on docs.**

**Copilot does the typing.**

**You do the architecture.**

---

**By Dec 16:**
**Live configurator that generates protocols.**

**By Dec 25:**
**Your kids get devices built from the framework the site teaches.**

---

**That's the mission.**

**Green board.**

**Let's build.**

---

**Start with:**
```bash
npx create-next-app@latest phenix-framework
```

**Then paste first Copilot prompt.**

**Report back with first win.**

**I'll be building docs in parallel.**

**Go.**
