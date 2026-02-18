# WONKY SPROUT V2 - COMPLETE REBUILD SPEC
## "If the UI doesn't work, the system doesn't work"

**Built from first principles. Zero Frankenstein.**

---

## CORE PHILOSOPHY

**V1 Problem:** UI/UX so bad you can't use your own app

**V2 Solution:** UI/UX so simple a dysregulated ADHD brain can use it

---

### DESIGN PRINCIPLES

**1. ONE THING PER SCREEN**
- No cognitive overload
- No "where do I click?"
- Obvious single action

**2. ZERO DECORATION**
- No animations unless functional
- No colors unless meaningful
- No text unless necessary

**3. THUMB-FIRST**
- Everything reachable with one thumb
- Bottom 2/3 of screen only
- Top 1/3 = passive info display

**4. LOAD-BEARING SIMPLICITY**
- Every element serves function
- Remove = system breaks
- Keep = system works

**5. DYSREGULATION-PROOF**
- Works when you're at your worst
- No memory required
- No decisions required
- Just tap and go

---

## INFORMATION ARCHITECTURE

### APP STRUCTURE (3 SCREENS TOTAL)

```
WONKY SPROUT V2

Screen 1: THE COCKPIT (Home)
Screen 2: THE PROTOCOL (Wonky AI result)
Screen 3: THE VAULT (SOPs)

That's it.
```

---

## SCREEN 1: THE COCKPIT

### LAYOUT (Bottom to Top)

```
┌─────────────────────────────┐
│                             │  ← Top 1/3: Status Display
│    [SPROUT HEALTH]          │     (Passive, glanceable)
│    Meds: ✓  Water: ✓       │
│    Mood: 6/10  Energy: 4/10 │
│                             │
├─────────────────────────────┤
│                             │  ← Middle 1/3: Profile
│    CURRENT MODE:            │
│    [MARGIE] 🧠              │     (Tap to switch)
│                             │
├─────────────────────────────┤
│                             │  ← Bottom 1/3: Actions
│  ┌───────────────────────┐ │     (Big, thumb-reachable)
│  │                       │ │
│  │  I'M STUCK            │ │     (Wonky AI)
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  SEND MESSAGE         │ │     (Communication Coach)
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  SOPs                 │ │     (Vault)
│  │                       │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

### BEHAVIOR

**Top section (Status):**
- Shows sprout health (simplified)
- Tap to update (modal with +/- buttons)
- Color codes: Green (good), Yellow (warning), Red (crisis)

**Middle section (Profile):**
- Shows current context
- Tap to see list:
  - Margie (Self) 🧠
  - William (Partner) 💙
  - Willow (Child) 🌸
  - Sebastian (Child) ⚡
- Swipe left/right to switch

**Bottom section (Actions):**
- Three buttons, that's it
- Large (80px tall minimum)
- High contrast
- Clear labels

---

## SCREEN 2A: I'M STUCK (WONKY AI)

### FLOW

**Step 1: Input**

```
┌─────────────────────────────┐
│                             │
│  What's the chaos?          │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │ [Text input]          │ │  ← Simple text area
│  │                       │ │     No formatting
│  │                       │ │     Just type
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  GENERATE PROTOCOL    │ │  ← Big button
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  [Cancel]                   │  ← Small, bottom left
└─────────────────────────────┘
```

**Step 2: Loading**

```
┌─────────────────────────────┐
│                             │
│                             │
│      Analyzing...           │
│                             │
│      ████████░░░░  60%      │  ← Progress bar
│                             │
│  (Building your protocol)   │
│                             │
│                             │
└─────────────────────────────┘
```

**Step 3: Protocol**

```
┌─────────────────────────────┐
│  PROTOCOL: LAUNDRY          │  ← Title (auto-generated)
│                             │
│  ☐ Gather dirty clothes     │
│  ☐ Sort into 2 piles        │  ← Checkboxes
│  ☐ Start first load         │     Big, tappable
│  ☐ Set timer for 30min      │     Auto-advance
│  ☐ Move to dryer            │
│  ☐ Start second load        │
│                             │
│  [6 steps remaining]        │  ← Progress indicator
│                             │
│  ┌───────────────────────┐ │
│  │  SAVE TO VAULT        │ │  ← Save for reuse
│  └───────────────────────┘ │
│                             │
│  [Done] [Start Over]        │
└─────────────────────────────┘
```

### KEY FEATURES

**Checkboxes:**
- Large (48px minimum)
- Haptic feedback on tap
- Strikethrough when complete
- Auto-scroll to next unchecked

**Protocol storage:**
- Auto-saves to history
- Can name and save to Vault
- Reusable for recurring tasks

---

## SCREEN 2B: SEND MESSAGE (COMMUNICATION COACH)

### FLOW

**Step 1: Who?**

```
┌─────────────────────────────┐
│                             │
│  Send message to:           │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  WILLIAM (Partner)    │ │  ← Large buttons
│  │                       │ │     Based on profiles
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  CHRISTYN (Co-parent) │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
│  [Cancel]                   │
└─────────────────────────────┘
```

**Step 2: Draft**

```
┌─────────────────────────────┐
│  TO: CHRISTYN               │
│                             │
│  Write your message:        │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │ [Text input]          │ │  ← Raw, direct
│  │                       │ │     Say what you mean
│  │ "Bash needs picked    │ │
│  │  up at 3. Don't be    │ │
│  │  late like last time."│ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  TRANSLATE            │ │  ← Coach it
│  └───────────────────────┘ │
│                             │
│  [Cancel]                   │
└─────────────────────────────┘
```

**Step 3: Translation**

```
┌─────────────────────────────┐
│  COMMUNICATION COACH        │
│                             │
│  Your message:              │
│  "Bash needs picked up at 3.│
│   Don't be late like last   │
│   time."                    │
│                             │
│  Suggested:                 │
│  "I have Bash scheduled for │
│   pickup at 3pm today. Can  │
│   you confirm you're        │
│   available? I can send a   │
│   reminder at 2:30 if that  │
│   helps."                   │
│                             │
│  ┌───────────────────────┐ │
│  │  USE SUGGESTED        │ │  ← One tap
│  └───────────────────────┘ │
│                             │
│  [Edit] [Use Original]      │
└─────────────────────────────┘
```

**Step 4: Send**

```
┌─────────────────────────────┐
│                             │
│         ✓ SENT              │
│                             │
│  Message sent to Christyn   │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  DONE                 │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
└─────────────────────────────┘
```

---

## SCREEN 3: THE VAULT (SOPs)

### LAYOUT

```
┌─────────────────────────────┐
│  SOP VAULT                  │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  Morning Routine      │ │  ← Saved protocols
│  │  12 steps             │ │     Tap to execute
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  Bedtime Routine      │ │
│  │  8 steps              │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  System Reset         │ │
│  │  (Meltdown Protocol)  │ │
│  │  6 steps              │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  Laundry              │ │
│  │  10 steps             │ │
│  └───────────────────────┘ │
│                             │
│  [+ New SOP]                │
└─────────────────────────────┘
```

### EXECUTING AN SOP

**Tap any SOP → Same protocol view as Wonky AI:**

```
┌─────────────────────────────┐
│  MORNING ROUTINE            │
│                             │
│  ✓ Take meds                │  ← Completed
│  ✓ Drink water              │
│  ☐ Brush teeth              │  ← Current step
│  ☐ Get dressed              │     (highlighted)
│  ☐ Make coffee              │
│  ☐ Check calendar           │
│  ...                        │
│                             │
│  [3/12 complete]            │
│                             │
│  [Pause] [Reset]            │
└─────────────────────────────┘
```

---

## PROFILE SWITCHING (Overlay)

**Tap "MARGIE" in Cockpit:**

```
┌─────────────────────────────┐
│  SWITCH CONTEXT             │
│                             │
│  ┌───────────────────────┐ │
│  │  ● MARGIE (Self) 🧠   │ │  ← Current
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  ○ WILLIAM (Partner)  │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  ○ WILLOW (Child)     │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │  ○ SEBASTIAN (Child)  │ │
│  └───────────────────────┘ │
│                             │
│  [Cancel]                   │
└─────────────────────────────┘
```

**What changes per profile:**
- SOPs available (kid routines vs adult routines)
- Communication contacts (who to message from this context)
- Garden tracking (kid's meds/water vs yours)

---

## SETTINGS (Minimal)

**Access:** Three-dot menu, top right of Cockpit

**Only critical settings:**

```
┌─────────────────────────────┐
│  SETTINGS                   │
│                             │
│  Account                    │
│  ├─ Sign Out                │
│  └─ Delete Account          │
│                             │
│  Accessibility              │
│  ├─ Text Size: [M]          │
│  └─ Reduce Motion: [OFF]    │
│                             │
│  Data                       │
│  ├─ Export All              │
│  └─ Clear History           │
│                             │
│  About                      │
│  └─ Version 2.0.0           │
│                             │
└─────────────────────────────┘
```

**That's it. No complex preferences. No overwhelming options.**

---

## TECHNICAL ARCHITECTURE

### STACK

**Framework:** Next.js 15 (App Router)
- Server components where possible
- Client components only for interactivity
- Progressive enhancement

**Styling:** Tailwind CSS 4
- Custom design tokens
- Dark mode by default (easier on eyes)
- High contrast mode option

**State:** Zustand (not Context)
- Simple, performant
- Persist to localStorage
- No Redux complexity

**Database:** Firebase Firestore
- User auth (email/password only)
- Protocol history
- SOP storage
- Sync across devices

**AI:** Google Gemini 2.5 Flash
- Wonky AI prompts
- Communication Coach prompts
- Structured JSON output
- Fallback to cached responses if API fails

**Deployment:** Vercel
- Automatic deployments from main
- Preview deployments for PRs
- Edge functions for AI

---

## COMPONENT ARCHITECTURE

### DIRECTORY STRUCTURE

```
wonky-sprout-v2/
├── src/
│   ├── app/
│   │   ├── page.tsx           (Cockpit)
│   │   ├── protocol/
│   │   │   └── page.tsx       (Wonky AI / Comms Coach)
│   │   ├── vault/
│   │   │   └── page.tsx       (SOPs)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx     (One button component)
│   │   │   ├── Checkbox.tsx   (One checkbox component)
│   │   │   └── Input.tsx      (One input component)
│   │   ├── Cockpit.tsx
│   │   ├── ProtocolView.tsx
│   │   ├── VaultList.tsx
│   │   └── ProfileSwitcher.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── wonky-ai.ts    (Gemini prompts)
│   │   │   └── coach.ts       (Translation prompts)
│   │   ├── store/
│   │   │   └── index.ts       (Zustand store)
│   │   └── firebase/
│   │       ├── auth.ts
│   │       └── db.ts
│   └── types/
│       └── index.ts
└── package.json
```

---

## UI COMPONENT SPECIFICATIONS

### BUTTON

```typescript
// One button. Different sizes. That's it.

<Button 
  size="large"      // 80px tall, full width
  variant="primary" // High contrast, action color
  onClick={handleClick}
>
  GENERATE PROTOCOL
</Button>

<Button 
  size="small"      // 44px tall, inline
  variant="ghost"   // Low contrast, secondary
  onClick={handleCancel}
>
  Cancel
</Button>
```

**Variants:**
- Primary: Action color (teal), high contrast
- Secondary: Gray, medium contrast
- Ghost: Transparent, low contrast
- Danger: Red, for destructive actions

**Sizes:**
- Large: 80px tall, full width, bottom of screen
- Medium: 60px tall, full width
- Small: 44px tall, inline

**States:**
- Default
- Hover (subtle scale)
- Active (haptic feedback)
- Disabled (50% opacity)
- Loading (spinner replaces text)

---

### CHECKBOX

```typescript
// Big, tappable, obvious

<Checkbox
  checked={step.completed}
  onChange={handleCheck}
  label="Take meds"
  size="large"  // 48px touch target
/>
```

**Features:**
- Large touch target (48px minimum)
- Haptic feedback on check
- Strikethrough label when checked
- Auto-scroll to next unchecked
- Keyboard accessible (space to toggle)

---

### INPUT

```typescript
// Simple text input. No fancy stuff.

<Input
  placeholder="What's the chaos?"
  value={input}
  onChange={setInput}
  multiline={true}
  rows={6}
/>
```

**Features:**
- Auto-focus when screen loads
- Auto-resize for multiline
- Clear button (X) when has content
- Character count if near limit
- No spell check (annoying for ADHD)

---

## COLOR SYSTEM

### PALETTE (Dark Mode Default)

**Background:**
- Surface: `#0a0a0a` (near black)
- Card: `#1a1a1a` (slightly lighter)
- Border: `#2a2a2a` (subtle separation)

**Text:**
- Primary: `#ffffff` (white)
- Secondary: `#a0a0a0` (gray)
- Disabled: `#505050` (dark gray)

**Actions:**
- Primary: `#14b8a6` (teal) - Wonky/chaos color
- Secondary: `#3b82f6` (blue) - Sprout/structure color
- Success: `#10b981` (green)
- Danger: `#ef4444` (red)
- Warning: `#f59e0b` (amber)

**Profile Colors:**
- Margie: `#14b8a6` (teal - self)
- William: `#3b82f6` (blue - partner)
- Willow: `#ec4899` (pink - child 1)
- Sebastian: `#8b5cf6` (purple - child 2)

### LIGHT MODE

**Only if user explicitly enables.**

**Background:**
- Surface: `#ffffff`
- Card: `#f5f5f5`
- Border: `#e5e5e5`

**Text:**
- Primary: `#0a0a0a`
- Secondary: `#505050`
- Disabled: `#a0a0a0`

**Actions:** Same colors, adjusted contrast

---

## AI INTEGRATION

### WONKY AI PROMPTS

```typescript
const wonkyAIPrompt = `
You are Wonky AI, an executive function assistant for 
neurodivergent minds.

User context:
- Name: ${profile.name}
- Current state: ${garden.mood}/10 mood, ${garden.energy}/10 energy
- Meds taken: ${garden.meds ? 'Yes' : 'No'}

User's chaos:
"${userInput}"

Generate a step-by-step protocol to address this.

Rules:
1. Break into micro-steps (2-5 minutes each)
2. Start with the tiniest possible action
3. No motivation required - just clear steps
4. Maximum 15 steps (more = overwhelming)
5. Use simple, direct language
6. Include time estimates

Output as JSON:
{
  "title": "Brief protocol name",
  "steps": [
    { "action": "Specific action", "time": "2 min" },
    ...
  ]
}
`;
```

### COMMUNICATION COACH PROMPTS

```typescript
const coachPrompt = `
You are a Communication Coach for neurodivergent adults 
in co-parenting situations.

User's message (direct, unfiltered):
"${userDraft}"

Context:
- Sending to: ${recipient}
- Relationship: ${relationship} (e.g., "co-parent, divorced")
- Current tone: ${analyzeTone(userDraft)}

Translate this to:
1. Use "I" statements
2. Collaborative framing
3. Remove blame/accusation
4. Keep factual content
5. Suggest solutions
6. Professional but warm

Output as JSON:
{
  "original": "${userDraft}",
  "suggested": "Collaborative version here",
  "changes": ["What you changed", "Why it matters"],
  "tone": "collaborative" | "neutral" | "warm"
}
`;
```

---

## DATA MODELS

### USER

```typescript
interface User {
  id: string;
  email: string;
  profiles: Profile[];
  currentProfile: string; // Profile ID
  createdAt: Date;
}
```

### PROFILE

```typescript
interface Profile {
  id: string;
  name: string;
  type: 'self' | 'partner' | 'child';
  emoji: string;
  color: string;
  sops: string[]; // SOP IDs available to this profile
  contacts: Contact[]; // Who can be messaged from this context
}
```

### PROTOCOL

```typescript
interface Protocol {
  id: string;
  title: string;
  steps: Step[];
  createdAt: Date;
  savedToVault: boolean;
  profileId: string; // Which profile created it
}

interface Step {
  id: string;
  action: string;
  time?: string;
  completed: boolean;
  completedAt?: Date;
}
```

### SOP

```typescript
interface SOP {
  id: string;
  title: string;
  steps: Step[];
  profileId: string;
  usageCount: number;
  lastUsed: Date;
}
```

### GARDEN (Health Tracking)

```typescript
interface Garden {
  date: string; // YYYY-MM-DD
  profileId: string;
  meds: boolean;
  water: number; // glasses
  mood: number; // 1-10
  energy: number; // 1-10
  notes?: string;
}
```

---

## ONBOARDING (FIRST RUN)

### FLOW

**Screen 1:**
```
┌─────────────────────────────┐
│                             │
│   🌱                        │
│                             │
│   WONKY SPROUT              │
│                             │
│   Structure for chaos.      │
│   Engineering for minds.    │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │
│  │  GET STARTED          │ │
│  │                       │ │
│  └───────────────────────┘ │
│                             │
└─────────────────────────────┘
```

**Screen 2:**
```
┌─────────────────────────────┐
│  What should we call you?   │
│                             │
│  ┌───────────────────────┐ │
│  │ [Name input]          │ │
│  └───────────────────────┘ │
│                             │
│  (This creates your first   │
│   profile. You can add      │
│   others later.)            │
│                             │
│  ┌───────────────────────┐ │
│  │  CONTINUE             │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Screen 3:**
```
┌─────────────────────────────┐
│  Quick tour:                │
│                             │
│  • Tap "I'M STUCK" when     │
│    overwhelmed              │
│                             │
│  • Tap "SEND MESSAGE" for   │
│    co-parent communication  │
│                             │
│  • Tap "SOPs" for saved     │
│    routines                 │
│                             │
│  That's it. Simple.         │
│                             │
│  ┌───────────────────────┐ │
│  │  START USING          │ │
│  └───────────────────────┘ │
│                             │
│  [Skip tour]                │
└─────────────────────────────┘
```

**Then: Cockpit**

---

## BUILD TIMELINE (14 DAYS)

### WEEK 1: FOUNDATION

**Day 1-2: Project Setup**
```bash
npx create-next-app@latest wonky-sprout-v2
npm install zustand firebase @google/generative-ai
```

**Files to create:**
- Basic app shell
- Tailwind config with design tokens
- Firebase config
- Zustand store skeleton

**Copilot prompt:**
"Create Next.js 15 project with Tailwind, Zustand, and Firebase. 
Dark mode default. Mobile-first. One-thumb navigation."

---

**Day 3: Component Library**

**Files to create:**
- Button component (all variants)
- Checkbox component
- Input component
- Basic layout

**Copilot prompt:**
"Create Button component with variants: primary, secondary, ghost, danger.
Sizes: large (80px), medium (60px), small (44px). 
Dark mode. High contrast. Haptic feedback. Tailwind CSS."

---

**Day 4: Authentication**

**Files to create:**
- Sign in page
- Sign up page
- Firebase auth integration
- Protected route wrapper

**Copilot prompt:**
"Create Firebase authentication with email/password.
Simple sign-in form. No social auth. Mobile-first.
Persist session. Protected routes."

---

### WEEK 2: CORE FEATURES

**Day 5: Cockpit (Home)**

**Files to create:**
- Cockpit page component
- Profile switcher
- Garden status display
- Action buttons

**Copilot prompt:**
"Create Cockpit component: Status display top third (passive).
Profile switcher middle. Three action buttons bottom (thumb reach).
Zustand for state. Mobile-first layout."

---

**Day 6: Wonky AI**

**Files to create:**
- Protocol input page
- Gemini AI integration
- Protocol view component
- Save to vault function

**Copilot prompt:**
"Create Wonky AI flow: Text input → Gemini API → 
Protocol with checkboxes. Auto-scroll to current step.
Haptic feedback. Save to Firestore."

---

**Day 7: Communication Coach**

**Files to create:**
- Message compose page
- Recipient selector
- Translation flow
- Send confirmation

**Copilot prompt:**
"Create Communication Coach: Select recipient → Draft message →
Translate via Gemini → Show comparison → Send.
Co-parent context. Collaborative tone."

---

**Day 8: SOP Vault**

**Files to create:**
- Vault list page
- SOP execution view
- Add/edit SOP
- Sync to Firebase

**Copilot prompt:**
"Create SOP Vault: List of saved protocols. 
Tap to execute. Same checkbox view as Wonky AI.
CRUD operations. Firestore sync."

---

**Day 9: Profile System**

**Files to create:**
- Profile creation
- Profile switching
- Per-profile SOPs
- Per-profile contacts

**Copilot prompt:**
"Create profile system: Multiple contexts (self, partner, kids).
Switch changes available SOPs and contacts. 
Zustand + Firestore."

---

**Day 10: Garden (Health)**

**Files to create:**
- Health tracking modal
- Daily check-in
- Visual indicators
- History view

**Copilot prompt:**
"Create Garden health tracking: Meds, water, mood (1-10), 
energy (1-10). Simple +/- buttons. Visual sprout indicator.
Firestore daily records."

---

### WEEK 3: POLISH

**Day 11: Accessibility**

**Tasks:**
- Keyboard navigation
- Screen reader labels
- High contrast mode
- Text size adjustment

---

**Day 12: Error Handling**

**Tasks:**
- Offline mode
- API failure fallbacks
- Form validation
- Loading states

---

**Day 13: Testing**

**Tasks:**
- Unit tests (critical paths)
- Manual testing on phone
- Fix bugs
- Performance optimization

---

**Day 14: Deploy**

**Tasks:**
- Vercel deployment
- Environment variables
- Domain setup (optional)
- Production smoke test

---

## SUCCESS CRITERIA

**V2 is ready when:**

✅ You can use it when dysregulated (ultimate test)

✅ All actions require ≤ 2 taps

✅ Zero unnecessary text/UI elements

✅ Works perfectly on phone (one thumb)

✅ Loads in < 2 seconds

✅ Works offline (basic features)

✅ Gemini AI responses in < 5 seconds

✅ No bugs in critical paths

✅ You actually want to use it daily

---

## WHAT'S DIFFERENT FROM V1

**V1:**
- Complex UI (couldn't use when dysregulated)
- Too many features (cognitive overload)
- Unclear navigation (where do I click?)
- Decoration > function (animations, colors)
- Desktop-first (didn't work on phone)

**V2:**
- Brutally simple (3 screens total)
- Core features only (AI, Coach, SOPs)
- Obvious navigation (big buttons, bottom)
- Function > decoration (every element serves purpose)
- Thumb-first (built for phone)

---

## DEPLOYMENT

### HOSTING

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**URL:** wonky-sprout-v2.vercel.app

---

### ENVIRONMENT VARIABLES

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
GOOGLE_GENERATIVE_AI_API_KEY=
```

---

## POST-LAUNCH (V2.1+)

**Features to add AFTER v2 ships:**

- Family module (Phenix configurator integration)
- Voice input (for protocols)
- Widget (home screen quick actions)
- Apple Watch companion
- Medication reminders
- Calendar integration
- Export/backup

**But NOT until v2 is solid and daily-driver stable.**

---

## FINAL NOTE

**This is built from what I know about:**
- Your philosophy (engineering > motivation)
- Your needs (ADHD/Autism OS)
- Your pain point (UI/UX unusable)
- Your context (divorce, co-parenting, kids)

**It's designed to work when you're at your worst.**

**Because that's when you need it most.**

**If it doesn't work dysregulated, it doesn't work.**

---

**Ready to build?**

**Or did I miss the mark on what v2 needs to be?**
