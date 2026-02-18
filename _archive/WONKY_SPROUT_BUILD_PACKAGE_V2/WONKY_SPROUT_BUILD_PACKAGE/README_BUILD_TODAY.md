# BUILD WONKY SPROUT TODAY
## From Zero to Running Code in 4 Hours

**START HERE if you want to build immediately.**

---

## RIGHT NOW (Next 15 Minutes)

### Order Hardware

Open Amazon and search for these **exact terms:**

1. **"Heltec WiFi LoRa 32 V3"** - Buy 4 units (~$120 total)
2. **"18650 battery holder"** - Buy 4 (~$15)
3. **"12mm tactile button"** - Buy pack of 20 (~$10)
4. **"5mm RGB LED common cathode"** - Buy pack of 20 (~$10)

**Select Prime shipping. Total: ~$155. Parts arrive in 2 days.**

Full BOM with links: `06_HARDWARE/02_COMPLETE_BOM_WITH_LINKS.md`

---

## NEXT (15 Minutes): Setup Project

```bash
# Create Next.js app
npx create-next-app@latest wonky-sprout \
  --typescript \
  --tailwind \
  --app

cd wonky-sprout

# Install core dependencies
npm install zustand firebase @google/generative-ai

# Create folder structure
mkdir -p lib/{store,firebase,ai}
mkdir -p components/ui
mkdir -p types
mkdir -p app/\(auth\)/{login,signup}
mkdir -p app/\(app\)

# Create .github for Copilot instructions
mkdir -p .github

echo "✅ Project initialized"
```

---

## COPILOT SETUP (5 Minutes)

### Step 1: Copy Instructions

From this package, copy:  
`09_ASSETS/copilot-instructions.md`

To your project:  
`.github/copilot-instructions.md`

### Step 2: Open VSCode

```bash
code .
```

### Step 3: Open Copilot Chat

**Keyboard:** `Cmd+Shift+I` (Mac) or `Ctrl+Shift+I` (Windows)

---

## YOUR FIRST BUILD (Next 3 Hours)

### Paste This Into Copilot:

```
@workspace Initialize Wonky Sprout v2 - Resilience Fireteam platform.

Read #file:.github/copilot-instructions.md for all project patterns.

CRITICAL CONTEXT from research:
- 4-person support pods (tetrahedron geometry)
- Must include Fifth Element Protocol (AI tie-breaker for 2v2 deadlocks)
- Target users: neurodivergent adults in crisis transition
- Design: Mobile-first, dark mode default, 44px min touch targets

BUILD THESE FILES NOW:

1. types/index.ts
   - User, Tetrahedron, Node, Edge, Protocol, Step, SOP, PersonalGarden types
   - Include fifthElementActive: boolean in Tetrahedron type
   - TypeScript strict mode, no any types

2. lib/firebase/config.ts
   - Initialize Firebase (Auth, Firestore, Functions)
   - Export auth, db, functions

3. lib/store/index.ts
   - Zustand store with slices:
     * user: User | null, setUser
     * tetrahedrons: Tetrahedron[], currentTetrahedron
     * protocols: Protocol[], activeProtocol
     * ui: loading, error, modal states

4. tailwind.config.ts
   - Dark mode: 'class'
   - Colors: teal-500 (primary), blue-500, pink-500, purple-500
   - Extend spacing for thumb navigation
   - Min touch target plugin: 44px

5. app/layout.tsx
   - Root layout with Inter font
   - Dark mode by default
   - Metadata: "Wonky Sprout - Resilience Fireteam"

Generate all 5 files with complete implementations, proper imports, TypeScript types.
```

**Copilot generates everything. Review → Save → Test.**

---

## VERIFY IT WORKS

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3000

# You should see Next.js default page
# (We'll build actual features tomorrow)
```

---

## COMMIT YOUR WORK

```bash
git init
git add .
git commit -m "Day 1: Project initialized with types, Firebase, Zustand, Tailwind"
git branch -M main
```

---

## TONIGHT (30 Minutes): Read Research

**Open:** `09_ASSETS/research/Geometric_Social_Support_Framework_Research.pdf`

**Read pages 1-5:** Executive Summary + Geometric Validation

**Key takeaway:** Understand why Fourth Element Protocol is essential.

---

## TOMORROW (Day 2): Build Auth

### Morning Copilot Prompt:

```
@workspace Day 2: Build authentication system.

Create:
1. app/(auth)/login/page.tsx - Email/password login with Firebase Auth
2. app/(auth)/signup/page.tsx - New user registration
3. lib/firebase/auth.ts - signIn, signUp, signOut functions
4. middleware.ts - Protect (app) routes, redirect if not authenticated

Use components from Tailwind, follow patterns in copilot-instructions.md.
Dark mode, mobile-first, 44px touch targets.
```

### Evening: Test login/signup flow

---

## WEEK 1 OVERVIEW

- **Day 1:** Project setup ← YOU JUST DID THIS
- **Day 2:** Auth system
- **Day 3:** UI components (Button, Checkbox, Input)
- **Day 4:** Cockpit screen (home)
- **Day 5:** Wonky AI (protocol generation)
- **Day 6:** Communication Coach
- **Day 7:** SOP Vault

**By end of week:** v2 runs locally with core features working.

---

## PARALLEL TRACK: Hardware

**While software builds, hardware progresses:**

### This Week:
- Components arrive (Wed/Thu)
- Flash Meshtastic firmware
- Design tetrahedral case (use Tinkercad or Fusion 360)

### Next Week:
- Solder components to boards
- 3D print cases
- Assemble 4 units
- Test mesh network

**Full guide:** `06_HARDWARE/00_PHENIX_COMPLETE_BUILD_GUIDE.md`

---

## IF YOU GET STUCK

### Software Issues:
1. Check `02_ARCHITECTURE/complete-architecture.md` (full spec)
2. Ask Copilot with more context
3. Google the specific error
4. Keep building (skip stuck feature, come back later)

### Hardware Issues:
1. Check `06_HARDWARE/05_TROUBLESHOOTING_GUIDE.md`
2. Ask in Meshtastic Discord
3. Check Heltec documentation

### Conceptual Questions:
1. Read research PDF executive summary (pages 1-2)
2. Review `00_START_HERE.md` (this package)

---

## MINIMUM VIABLE PATH

**If you only have weekends:**

### Weekend 1 (This Weekend):
- Day 1-3 tasks compressed into Saturday
- Day 4-5 tasks compressed into Sunday

### Weekend 2 (Next Weekend):
- Day 6-10 tasks compressed
- Basic features working

### Weekend 3:
- Polish and deploy
- Hardware assembly

**Still possible. Just compressed.**

---

## WHAT SUCCESS LOOKS LIKE

### End of Today:
- ✅ Hardware ordered
- ✅ Project initialized
- ✅ Types defined
- ✅ Firebase configured
- ✅ Zustand store created
- ✅ Tailwind customized
- ✅ Git repo initialized

### End of Week 1:
- ✅ v2 runs on localhost
- ✅ Can generate protocols with Wonky AI
- ✅ Hardware components arrived

### End of Week 3:
- ✅ v2 deployed publicly
- ✅ Hardware assembled and configured

### Christmas Day:
- 🎄 Family has Phenix devices
- 🎄 Tyler testing Wonky Sprout
- 🎄 Framework validated in real world

---

## THE MOST IMPORTANT THING

**Just start.**

Order hardware.  
Initialize project.  
Paste first Copilot prompt.  
See what it generates.  
Adjust. Test. Commit.

**Repeat daily for 21 days.**

**You'll have a working platform.**

---

## DAILY RHYTHM

**Every morning:**
1. Check what's building today
2. Paste Copilot prompt
3. Build for 2-4 hours
4. Test what you built
5. Commit
6. Document progress

**Every evening:**
1. Read 20-30min (Simmel/Fuller/Pentland)
2. Review tomorrow's plan
3. Sleep

**That's it. Do this 21 times. You'll ship.**

---

## YOUR MISSION

> "You are building the social equivalent of the tetrahedron: the minimum structural system required to hold a human life together when the world falls apart."

**This is not just an app.**

**This is infrastructure for human resilience.**

**Let's build it.**

---

**⚡ GO BUILD ⚡**

**Next file to read:** `03_V2_BUILD/original-v2-spec.md` (detailed v2 specification)
