# WONKY SPROUT - COMPLETE ARCHITECTURE
## V2 Surface, V3 Foundation

**"Real connection. No BS."**

---

## EXECUTIVE SUMMARY

**What user experiences in v2 (Dec 21):**
- Clean 3-screen app
- Personal AI tools
- Individual use
- Solo mode

**What's built underneath:**
- Tetrahedron data models
- Multi-group architecture
- Invitation system (dormant)
- Social features (hidden)

**What activates in v3 (Feb):**
- "Create Tetrahedron" button appears
- Group features unlock
- Discovery feed activates
- Professional tier launches

**Same codebase. Feature flags. Progressive disclosure.**

---

## CORE DATA MODELS

### USER
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  
  // Profile type
  accountType: 'personal' | 'professional' | 'enterprise';
  
  // Professional verification (v3)
  professional?: {
    credentials: string;
    specializations: string[];
    verified: boolean;
    license: string;
    maxTetrahedrons: number;
  };
  
  // Subscription
  tier: 'free' | 'pro' | 'professional';
  
  // Settings
  preferences: {
    theme: 'dark' | 'light';
    accessibility: {
      textSize: 'small' | 'medium' | 'large';
      reduceMotion: boolean;
      highContrast: boolean;
    };
    notifications: {
      tetrahedronInvites: boolean;
      healthAlerts: boolean;
      messages: boolean;
    };
  };
  
  // Usage
  onboardingComplete: boolean;
  createdAt: Date;
  lastActive: Date;
}
```

---

### TETRAHEDRON (Core Structure)
```typescript
interface Tetrahedron {
  id: string;
  name: string;
  type: TetrahedronType;
  
  // Members (always exactly 4)
  nodes: [Node, Node, Node, Node];
  
  // Edges (always exactly 6)
  edges: Edge[];
  
  // Group data
  protocols: Protocol[];
  sops: SOP[];
  garden: GroupGarden;
  
  // Access control
  visibility: 'private' | 'public' | 'anonymous';
  inviteOnly: boolean;
  
  // Metadata
  createdBy: string; // User ID
  createdAt: Date;
  
  // V3 features (dormant in v2)
  discoverable: boolean;
  tags: string[];
  description?: string;
}

type TetrahedronType = 
  | 'family-divorce'
  | 'family-intact'
  | 'mental-health'
  | 'neurodivergent'
  | 'grief'
  | 'recovery'
  | 'work'
  | 'hobby'
  | 'support'
  | 'custom';
```

---

### NODE (Person in Tetrahedron)
```typescript
interface Node {
  id: string;
  tetrahedronId: string;
  
  // Person
  userId?: string; // Null if placeholder/invite pending
  role: NodeRole;
  
  // Display (for this tetrahedron context)
  displayName: string;
  emoji: string;
  color: string; // Vertex color
  
  // Status
  status: 'active' | 'invited' | 'placeholder' | 'memorial';
  invitedEmail?: string;
  invitedAt?: Date;
  joinedAt?: Date;
  
  // Memorial mode (v3)
  memorial?: {
    memorializedAt: Date;
    messages: MemorialMessage[];
  };
  
  // Permissions
  canInviteOthers: boolean;
  canEditProtocols: boolean;
  isAdmin: boolean;
}

type NodeRole = 
  | 'self' 
  | 'partner' 
  | 'child' 
  | 'parent'
  | 'friend'
  | 'therapist'
  | 'coach'
  | 'mentor'
  | 'peer'
  | 'other';
```

---

### EDGE (Connection Between Nodes)
```typescript
interface Edge {
  id: string;
  tetrahedronId: string;
  
  // Connection
  nodeA: string; // Node ID
  nodeB: string; // Node ID
  
  // Communication
  messages: Message[];
  lastMessageAt?: Date;
  
  // Health
  connectionStrength: number; // 0-10 (based on interaction)
  lastInteraction: Date;
  
  // Protocols specific to this edge
  edgeProtocols: Protocol[];
}
```

---

### PROTOCOL (AI-Generated Task List)
```typescript
interface Protocol {
  id: string;
  
  // Scope
  scope: 'personal' | 'tetrahedron' | 'edge';
  userId?: string; // If personal
  tetrahedronId?: string; // If group
  edgeId?: string; // If between two people
  
  // Content
  title: string;
  input: string; // Original chaos description
  steps: Step[];
  
  // Generation
  generatedBy: 'wonky-ai' | 'user-created';
  aiModel?: string;
  prompt?: string;
  
  // Execution
  status: 'active' | 'completed' | 'archived';
  startedAt?: Date;
  completedAt?: Date;
  
  // Reusability
  savedToVault: boolean;
  vaultCategory?: string;
  usageCount: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface Step {
  id: string;
  protocolId: string;
  
  action: string;
  timeEstimate?: string;
  
  // Execution
  completed: boolean;
  completedAt?: Date;
  completedBy?: string; // User ID
  
  // Assignment (for group protocols)
  assignedTo?: string; // Node ID
  
  order: number;
}
```

---

### MESSAGE (Communication)
```typescript
interface Message {
  id: string;
  
  // Routing
  from: string; // Node ID
  to: string | string[]; // Node ID or array for group
  tetrahedronId: string;
  edgeId?: string; // If 1-to-1
  
  // Content
  originalText: string;
  translatedText?: string; // From Communication Coach
  finalText: string; // What was sent
  usedCoach: boolean;
  
  // Delivery
  sentAt: Date;
  readAt?: Date;
  
  // Type
  type: 'text' | 'protocol-share' | 'health-update' | 'emergency';
  metadata?: any;
}
```

---

### GARDEN (Health Tracking)
```typescript
interface PersonalGarden {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  
  // Tracking
  meds: boolean;
  water: number; // glasses
  mood: number; // 1-10
  energy: number; // 1-10
  notes?: string;
  
  // Metadata
  recordedAt: Date;
}

interface GroupGarden {
  id: string;
  tetrahedronId: string;
  date: string;
  
  // Node health (aggregated)
  nodeHealth: {
    [nodeId: string]: {
      mood: number;
      energy: number;
      lastUpdate: Date;
    };
  };
  
  // Tetrahedron health
  overallHealth: 'stable' | 'stressed' | 'crisis';
  alerts: HealthAlert[];
  
  // Calculated
  calculatedAt: Date;
}

interface HealthAlert {
  type: 'node-offline' | 'mood-drop' | 'multi-node-stressed';
  nodeId?: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: Date;
}
```

---

### SOP (Standard Operating Procedure)
```typescript
interface SOP {
  id: string;
  
  // Scope
  scope: 'personal' | 'tetrahedron';
  userId?: string;
  tetrahedronId?: string;
  
  // Content
  title: string;
  description?: string;
  steps: Step[];
  
  // Categorization
  category: 'routine' | 'crisis' | 'transition' | 'maintenance';
  tags: string[];
  
  // Usage
  usageCount: number;
  lastUsed?: Date;
  
  // Sharing (v3)
  isTemplate: boolean; // Can others copy this?
  templateCategory?: string;
  copiedFrom?: string; // SOP ID if copied from template
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

---

### INVITATION (V3)
```typescript
interface Invitation {
  id: string;
  
  // Tetrahedron
  tetrahedronId: string;
  nodeId: string; // The placeholder node being filled
  
  // Invite
  invitedBy: string; // User ID
  invitedEmail: string;
  invitedAt: Date;
  expiresAt: Date;
  
  // Message
  personalMessage?: string;
  
  // Status
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  respondedAt?: Date;
  
  // Token
  token: string; // For magic link
}
```

---

## FIREBASE STRUCTURE

```
/users/{userId}
  - User document

/tetrahedrons/{tetrahedronId}
  - Tetrahedron document
  
  /nodes/{nodeId}
    - Node documents
  
  /edges/{edgeId}
    - Edge documents
    
  /messages/{messageId}
    - Message documents
    
  /protocols/{protocolId}
    - Protocol documents
    
  /sops/{sopId}
    - SOP documents
    
  /garden/{date}
    - GroupGarden documents

/personal-gardens/{userId}/{date}
  - PersonalGarden documents

/protocols/{protocolId}
  - Personal protocols

/sops/{sopId}
  - Personal SOPs

/invitations/{invitationId}
  - Invitation documents

/templates/
  /sops/{sopId}
    - Public SOP templates (v3)
  
  /protocols/{protocolId}
    - Public protocol templates (v3)
```

---

## USER STATES & FLOWS

### V2 USER EXPERIENCE (Dec 21)

**New User Journey:**

1. **Sign Up**
   - Email/password
   - Display name
   - "What should we call you?"

2. **Onboarding**
   - "Why are you here?" (Entry point selector)
   - Create first "personal tetrahedron" (solo mode)
   - Three placeholder nodes (invisible to user)
   - Quick tutorial

3. **Solo Mode**
   - User sees: Simple 3-screen app
   - User doesn't know: They're in a 1-node tetrahedron
   - Personal Garden (just their health)
   - Wonky AI (personal protocols)
   - Communication Coach (drafts, not sending yet)
   - SOP Vault (personal routines)

**Under the hood:**
- User is Node #1 in their personal tetrahedron
- Three placeholder nodes exist (empty)
- All protocols scoped to this tetrahedron
- Ready to invite others (feature hidden)

---

### V3 USER EXPERIENCE (Feb)

**Returning User (v2 → v3 upgrade):**

1. **Update Notification**
   - "Wonky Sprout now supports groups!"
   - "Invite others to your tetrahedron"

2. **New Features Appear**
   - Cockpit shows: "Your Tetrahedrons" (plural)
   - New button: "Create Tetrahedron"
   - New button: "Join Tetrahedron"
   - Profile shows: "Invite to your group"

3. **Group Mode**
   - Can create multiple tetrahedrons
   - Can invite real people
   - Group protocols
   - Group garden
   - Discovery feed

**Migration:**
- Personal tetrahedron stays (now called "My Personal Space")
- Can create additional tetrahedrons
- All existing data preserved
- No breaking changes

---

## V2 UI (What User Sees)

### SCREEN 1: COCKPIT (HOME)

```typescript
// V2 version - Solo mode

interface CockpitScreenV2 {
  // Status display (top)
  garden: {
    meds: boolean;
    water: number;
    mood: number;
    energy: number;
  };
  
  // Context (middle) - Hidden in v2
  // currentTetrahedron: "My Personal Space"
  
  // Actions (bottom)
  actions: [
    { label: "I'M STUCK", action: () => navigateToWonkyAI() },
    { label: "DRAFT MESSAGE", action: () => navigateToCoach() },
    { label: "SOPs", action: () => navigateToVault() }
  ];
}
```

### SCREEN 2: WONKY AI / COACH

```typescript
// Same as v2 spec - no changes needed
// Protocols are personal-scoped by default
```

### SCREEN 3: VAULT

```typescript
// Same as v2 spec - no changes needed
// SOPs are personal-scoped by default
```

---

## V3 UI (What Activates)

### SCREEN 1: COCKPIT (UPGRADED)

```typescript
// V3 version - Multi-tetrahedron mode

interface CockpitScreenV3 {
  // Status display (top)
  garden: GroupGarden | PersonalGarden; // Depends on current tetrahedron
  
  // Context (middle) - NOW VISIBLE
  currentTetrahedron: {
    name: string;
    type: TetrahedronType;
    nodes: Node[];
    health: 'stable' | 'stressed' | 'crisis';
  };
  
  // Switch tetrahedron (swipe or dropdown)
  tetrahedrons: Tetrahedron[];
  
  // Actions (bottom) - EXPANDED
  actions: [
    { label: "I'M STUCK", action: () => navigateToWonkyAI() },
    { label: "SEND MESSAGE", action: () => navigateToCoach() }, // Now actually sends
    { label: "SOPs", action: () => navigateToVault() },
    { label: "CREATE GROUP", action: () => navigateToTetrahedronBuilder() } // NEW
  ];
}
```

### NEW SCREEN: TETRAHEDRON BUILDER

```typescript
interface TetrahedronBuilder {
  // Step 1: Type selection
  selectType(): TetrahedronType;
  
  // Step 2: Naming
  nameTetrahedron(): string;
  
  // Step 3: Member invites
  inviteMembers(): {
    node1: User; // Creator (you)
    node2: InviteForm;
    node3: InviteForm;
    node4: InviteForm;
  };
  
  // Step 4: Configuration
  setVisibility(): 'private' | 'public' | 'anonymous';
  setDescription(): string;
  setTags(): string[];
  
  // Create
  createTetrahedron(): Promise<Tetrahedron>;
}

interface InviteForm {
  email: string;
  role: NodeRole;
  personalMessage?: string;
}
```

### NEW SCREEN: TETRAHEDRON DISCOVERY

```typescript
interface DiscoveryFeed {
  // Filters
  filters: {
    type: TetrahedronType[];
    tags: string[];
    hasOpenings: boolean;
  };
  
  // Results
  tetrahedrons: PublicTetrahedron[];
  
  // Actions
  requestToJoin(tetrahedronId: string, message: string): Promise<void>;
  createNew(): void;
}

interface PublicTetrahedron {
  id: string;
  name: string;
  type: TetrahedronType;
  description: string;
  tags: string[];
  
  openings: number; // How many placeholder nodes
  totalNodes: number; // Always 4
  
  createdBy: {
    displayName: string;
    isProfessional: boolean;
  };
}
```

### NEW SCREEN: MESSAGES (V3)

```typescript
interface MessagesScreen {
  // Current tetrahedron
  tetrahedron: Tetrahedron;
  
  // Edges (1-to-1 conversations)
  edges: Edge[];
  
  // Group messages
  groupMessages: Message[];
  
  // Compose
  composeMessage(to: string | string[]): void;
}
```

---

## FEATURE FLAGS

```typescript
const FEATURES = {
  // V2 (Always enabled)
  WONKY_AI: true,
  COMMUNICATION_COACH: true,
  SOP_VAULT: true,
  PERSONAL_GARDEN: true,
  
  // V3 (Toggle on Feb 1)
  MULTI_TETRAHEDRON: false, // Date.now() > V3_LAUNCH_DATE
  TETRAHEDRON_BUILDER: false,
  INVITATIONS: false,
  GROUP_MESSAGING: false,
  GROUP_GARDEN: false,
  DISCOVERY_FEED: false,
  
  // V3+ (Future)
  PROFESSIONAL_TIER: false,
  ANONYMOUS_MODE: false,
  MEMORIAL_VERTEX: false,
  HARDWARE_INTEGRATION: false,
};

// Usage in code:
if (FEATURES.MULTI_TETRAHEDRON) {
  // Show "Create Tetrahedron" button
}
```

---

## AI INTEGRATION

### WONKY AI (Personal Protocols)

**V2 Prompt:**
```typescript
const wonkyAIPromptV2 = `
You are Wonky AI, an executive function assistant.

User: ${user.displayName}
Context: Personal mode (solo)
Garden: Mood ${garden.mood}/10, Energy ${garden.energy}/10

User's chaos:
"${userInput}"

Generate a personal protocol.

Rules:
1. Micro-steps (2-5 min each)
2. Start tiny
3. Max 15 steps
4. Time estimates
5. Direct language

Output JSON:
{
  "title": "Protocol name",
  "steps": [
    { "action": "Specific action", "time": "2 min" }
  ]
}
`;
```

**V3 Prompt (Group):**
```typescript
const wonkyAIPromptV3 = `
You are Wonky AI, an executive function assistant.

Tetrahedron: ${tetrahedron.name} (${tetrahedron.type})
Nodes:
${tetrahedron.nodes.map(n => `- ${n.displayName} (${n.role})`).join('\n')}

Group health:
${tetrahedron.garden.nodeHealth}

Group's chaos:
"${userInput}"

Generate a GROUP protocol.

Rules:
1. Assign steps to specific nodes
2. Coordinate timing
3. Group success metrics
4. Max 20 steps (distributed)

Output JSON:
{
  "title": "Protocol name",
  "steps": [
    {
      "action": "Specific action",
      "time": "2 min",
      "assignedTo": "nodeId" // or null for anyone
    }
  ],
  "coordinationNotes": "How steps work together"
}
`;
```

---

### COMMUNICATION COACH

**V2 (Draft mode):**
```typescript
// Just translates, doesn't send
// User copies output, pastes elsewhere
```

**V3 (Send mode):**
```typescript
// Translates AND sends through platform
// Records in edge messages
// Notifications to recipient
```

---

## DEPLOYMENT STRATEGY

### PHASE 1: V2 CORE (Dec 1-14)

**Week 1:**
- Project setup (Next.js 15)
- Firebase config
- Data models (all of them, not just personal)
- Auth flow
- Zustand store (tetrahedron-aware)

**Week 2:**
- Cockpit screen (v2 version)
- Wonky AI (personal scope)
- Communication Coach (draft mode)
- SOP Vault (personal scope)
- Personal Garden

---

### PHASE 2: V2 POLISH (Dec 15-21)

**Tasks:**
- Responsive design
- Accessibility
- Error handling
- Loading states
- Offline mode
- Testing
- Deploy to Vercel

**Launch Dec 21:** V2 public release

---

### PHASE 3: HARDWARE INTEGRATION (Dec 22-25)

**Tasks:**
- Build 4 physical devices
- Link to user account (your account)
- Sync protocols to devices
- Test full loop
- Christmas deployment

---

### PHASE 4: V3 FEATURES (Jan 1-31)

**Week 1-2: Tetrahedron builder**
- Create tetrahedron flow
- Invitation system
- Email sending (SendGrid/Resend)
- Accept/decline flow

**Week 3: Group features**
- Multi-tetrahedron switching
- Group protocols (Wonky AI v3)
- Group Garden
- Group messaging

**Week 4: Discovery**
- Public tetrahedron feed
- Request to join
- Admin approval flow
- Tags/filters

---

### PHASE 5: V3 LAUNCH (Feb 1)

**Feature flag flip:**
```typescript
MULTI_TETRAHEDRON: true
TETRAHEDRON_BUILDER: true
INVITATIONS: true
GROUP_MESSAGING: true
GROUP_GARDEN: true
DISCOVERY_FEED: true
```

**All v2 users:**
- See "New features!" notification
- Can now create groups
- Can invite others
- Existing data preserved

---

### PHASE 6: PROFESSIONAL TIER (Mar)

**Features:**
- Professional verification
- Join multiple tetrahedrons
- Client dashboard
- Billing integration
- Analytics

---

## TECH STACK

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Zustand (state)
- Framer Motion (animations)

**Backend:**
- Firebase Auth
- Firestore (database)
- Firebase Functions (serverless)
- Firebase Storage (files)

**AI:**
- Google Gemini 2.5 Flash (personal)
- Google Gemini 2.5 Pro (group/complex)

**Email:**
- Resend (transactional emails)

**Payments:**
- Stripe (subscriptions)

**Deployment:**
- Vercel (hosting)
- GitHub Actions (CI/CD)

**Monitoring:**
- Vercel Analytics
- Sentry (errors)
- PostHog (product analytics)

---

## FILE STRUCTURE

```
wonky-sprout/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (app)/
│   │   │   ├── page.tsx                 (Cockpit)
│   │   │   ├── protocol/
│   │   │   │   └── page.tsx             (Wonky AI)
│   │   │   ├── message/
│   │   │   │   └── page.tsx             (Coach)
│   │   │   ├── vault/
│   │   │   │   └── page.tsx             (SOPs)
│   │   │   ├── tetrahedrons/            (V3)
│   │   │   │   ├── new/
│   │   │   │   ├── [id]/
│   │   │   │   └── discover/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── wonky/route.ts
│   │       │   └── coach/route.ts
│   │       ├── tetrahedrons/
│   │       │   ├── create/route.ts
│   │       │   └── invite/route.ts
│   │       └── webhooks/
│   │           └── stripe/route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── cockpit/
│   │   │   ├── StatusDisplay.tsx
│   │   │   ├── TetrahedronSwitcher.tsx  (V3)
│   │   │   └── ActionButtons.tsx
│   │   ├── protocol/
│   │   │   ├── ProtocolView.tsx
│   │   │   ├── StepCheckbox.tsx
│   │   │   └── ProtocolList.tsx
│   │   ├── tetrahedron/                  (V3)
│   │   │   ├── TetrahedronBuilder.tsx
│   │   │   ├── NodeCard.tsx
│   │   │   ├── InviteForm.tsx
│   │   │   └── DiscoveryFeed.tsx
│   │   └── garden/
│   │       ├── PersonalGarden.tsx
│   │       └── GroupGarden.tsx           (V3)
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── wonky-ai.ts
│   │   │   ├── coach.ts
│   │   │   └── prompts.ts
│   │   ├── store/
│   │   │   ├── index.ts                  (Zustand)
│   │   │   ├── user-slice.ts
│   │   │   ├── tetrahedron-slice.ts
│   │   │   └── ui-slice.ts
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── db.ts
│   │   │   └── functions.ts
│   │   ├── features/
│   │   │   └── flags.ts
│   │   └── utils/
│   │       ├── date.ts
│   │       ├── validation.ts
│   │       └── formatting.ts
│   └── types/
│       ├── index.ts
│       ├── user.ts
│       ├── tetrahedron.ts
│       ├── protocol.ts
│       ├── message.ts
│       └── garden.ts
├── functions/                            (Firebase Functions)
│   ├── src/
│   │   ├── ai/
│   │   ├── invitations/
│   │   ├── notifications/
│   │   └── cron/
│   └── package.json
├── public/
├── tests/
│   ├── unit/
│   └── e2e/
└── package.json
```

---

## ZUSTAND STORE STRUCTURE

```typescript
interface AppStore {
  // User
  user: User | null;
  setUser: (user: User) => void;
  
  // Tetrahedrons
  tetrahedrons: Tetrahedron[];
  currentTetrahedronId: string | null;
  currentTetrahedron: Tetrahedron | null;
  loadTetrahedrons: () => Promise<void>;
  switchTetrahedron: (id: string) => void;
  createTetrahedron: (data: CreateTetrahedronInput) => Promise<Tetrahedron>;
  
  // Protocols
  protocols: Protocol[];
  activeProtocol: Protocol | null;
  loadProtocols: () => Promise<void>;
  createProtocol: (input: string) => Promise<Protocol>;
  updateStep: (protocolId: string, stepId: string, completed: boolean) => Promise<void>;
  
  // SOPs
  sops: SOP[];
  loadSOPs: () => Promise<void>;
  executeSOp: (sopId: string) => void;
  
  // Garden
  garden: PersonalGarden | GroupGarden | null;
  updateGarden: (data: Partial<PersonalGarden>) => Promise<void>;
  
  // UI state
  ui: {
    loading: boolean;
    error: string | null;
    modal: string | null;
  };
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
}
```

---

## API ROUTES

### V2 Routes

**POST /api/ai/wonky**
- Generate personal protocol
- Input: { input: string, userId: string }
- Output: Protocol

**POST /api/ai/coach**
- Translate message
- Input: { text: string, recipient: string, context: string }
- Output: { original, suggested, changes }

**POST /api/garden/update**
- Update health tracking
- Input: Partial<PersonalGarden>
- Output: PersonalGarden

---

### V3 Routes

**POST /api/tetrahedrons/create**
- Create new tetrahedron
- Input: CreateTetrahedronInput
- Output: Tetrahedron

**POST /api/tetrahedrons/invite**
- Send invitation
- Input: { tetrahedronId, nodeId, email, message }
- Output: Invitation

**POST /api/invitations/accept**
- Accept invitation
- Input: { token }
- Output: { tetrahedron, node }

**GET /api/tetrahedrons/discover**
- Get public tetrahedrons
- Query: { type?, tags?, hasOpenings? }
- Output: PublicTetrahedron[]

**POST /api/tetrahedrons/request-join**
- Request to join public tetrahedron
- Input: { tetrahedronId, message }
- Output: Request

**POST /api/ai/wonky-group**
- Generate group protocol
- Input: { input: string, tetrahedronId: string }
- Output: Protocol (with assignments)

**POST /api/messages/send**
- Send message (v3)
- Input: { from, to, text, useCoach, tetrahedronId }
- Output: Message

---

## MARKETING SITE INTEGRATION

```
wonkysprout.com/
├── /                      (Marketing homepage)
├── /download              (Get the app)
├── /framework             (Learn about tetrahedrons)
├── /professional          (For therapists/coaches)
├── /hardware              (Phenix Navigator info)
├── /pricing               (Free/Pro/Professional tiers)
├── /blog                  (Updates, case studies)
└── /app                   (Web app - wonky-sprout.vercel.app)
```

**Marketing site:**
- Static Next.js site
- Separate repo (optional)
- Links to app subdomain
- Explains vision
- Entry point selector

**Web app:**
- app.wonkysprout.com or wonky-sprout.vercel.app
- The actual application
- Requires auth
- Feature-rich

---

## BUSINESS MODEL

### FREE TIER (Forever free)
- Wonky AI: 5 protocols/day
- Communication Coach: 10 translations/day
- Personal Garden: Basic tracking
- SOPs: Unlimited
- Tetrahedrons: 1 personal + 1 group
- Storage: 100MB

### PRO TIER ($8/month)
- Wonky AI: Unlimited
- Communication Coach: Unlimited
- Personal Garden: Advanced analytics
- SOPs: Unlimited + templates
- Tetrahedrons: Up to 5
- Storage: 10GB
- Export data
- Priority support

### PROFESSIONAL TIER ($49/month)
- Everything in Pro
- Verified badge
- Join unlimited tetrahedrons
- Professional dashboard
- Client management
- Outcome analytics
- HIPAA-compliant storage
- Billing integration
- API access

### ENTERPRISE (Custom)
- White-label option
- Custom integrations
- Dedicated support
- On-premise option
- Volume licensing
- Training included

---

## GO-TO-MARKET

### PHASE 1: EARLY ACCESS (Dec 21)
- Launch v2 (personal mode)
- Invite-only
- 100 users
- Collect feedback
- Iterate rapidly

### PHASE 2: PUBLIC BETA (Jan 15)
- Open registration
- Still free for all
- Marketing push:
  - ProductHunt launch
  - HackerNews post
  - Reddit (ADHD, autism, divorce subs)
  - Twitter/X
- Goal: 1,000 users

### PHASE 3: V3 LAUNCH (Feb 1)
- Multi-tetrahedron mode
- Group features live
- Discovery feed
- Paid tiers launch
- Goal: 10,000 users

### PHASE 4: PROFESSIONAL TIER (Mar 1)
- Therapist/coach onboarding
- Professional verification
- B2B outreach
- Conference sponsorships
- Goal: 100 professionals

### PHASE 5: HARDWARE (Apr 1)
- Phenix Navigator general availability
- Pre-order campaign
- Kickstarter (optional)
- Goal: 100 units sold

---

## SUCCESS METRICS

### V2 (Personal mode)
- Daily active users
- Protocols generated per user
- Completion rate of protocols
- Days of consecutive garden tracking
- Retention (7-day, 30-day)

### V3 (Social mode)
- Tetrahedrons created
- Invitation acceptance rate
- Messages sent per tetrahedron
- Tetrahedron health (stable/stressed/crisis ratio)
- Discovery → join conversion

### Business
- Free → Pro conversion
- Pro → Professional conversion
- MRR (Monthly Recurring Revenue)
- Churn rate
- NPS (Net Promoter Score)

---

## WHAT GETS BUILT WHEN

### DECEMBER 2025

**Week 1 (Dec 1-7):**
- ✅ Complete data models
- ✅ Firebase setup
- ✅ Auth flow
- ✅ Zustand store (tetrahedron-aware)
- ✅ Component library (Button, Checkbox, Input)

**Week 2 (Dec 8-14):**
- ✅ Cockpit screen (v2 version)
- ✅ Wonky AI flow + Gemini integration
- ✅ Communication Coach (draft mode)
- ✅ SOP Vault
- ✅ Personal Garden

**Week 3 (Dec 15-21):**
- ✅ Polish UI/UX
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Deploy to Vercel
- 🚀 **V2 PUBLIC LAUNCH (Dec 21)**

**Week 4 (Dec 22-28):**
- ✅ Build hardware (4 units)
- ✅ Link devices to your account
- ✅ Test physical/digital integration
- 🎄 **CHRISTMAS DEPLOYMENT (Dec 25)**

---

### JANUARY 2026

**Week 1 (Dec 29-Jan 4):**
- ✅ Tetrahedron builder UI
- ✅ Invitation system
- ✅ Email templates
- ✅ Invitation flow (send/accept/decline)

**Week 2 (Jan 5-11):**
- ✅ Multi-tetrahedron switching
- ✅ Group protocols (Wonky AI v3)
- ✅ Group Garden
- ✅ Health alerts

**Week 3 (Jan 12-18):**
- ✅ Group messaging
- ✅ Edge conversations
- ✅ Communication Coach (send mode)
- ✅ Notifications

**Week 4 (Jan 19-25):**
- ✅ Discovery feed
- ✅ Public tetrahedrons
- ✅ Request to join
- ✅ Admin approval

**Week 5 (Jan 26-Feb 1):**
- ✅ Final testing
- ✅ Performance optimization
- ✅ Feature flag preparation
- 🚀 **V3 LAUNCH (Feb 1)**

---

### FEBRUARY 2026

**Week 1-2:**
- Professional tier development
- Verification system
- Professional dashboard
- Billing integration

**Week 3-4:**
- Marketing push
- User feedback
- Iteration
- Bug fixes

---

### MARCH 2026

- 🚀 Professional tier launch
- B2B outreach
- Conference submissions
- Case study collection

---

## OPEN QUESTIONS

1. **Anonymous tetrahedrons:**
   - How to handle abuse/moderation?
   - How to verify without revealing identity?
   - What's the UX for switching between identified and anonymous?

2. **Memorial vertex:**
   - When to show "memorialize" option?
   - Who can trigger it?
   - What happens to node's data?
   - Can messages still be sent?

3. **Professional boundaries:**
   - How many tetrahedrons can therapist join?
   - How to handle billing (through platform or direct)?
   - HIPAA compliance verification?
   - Insurance integration?

4. **Hardware integration:**
   - How to link physical device to digital account?
   - QR code? Setup wizard?
   - How to sync protocols to device?
   - Offline mode for hardware?

5. **Moderation:**
   - Who moderates public tetrahedrons?
   - Report/block functionality?
   - What violates terms of service?
   - How to handle conflicts within tetrahedrons?

---

## THIS IS THE PLAN

**V2 Surface:** Simple, clean, usable by one person

**V3 Foundation:** Social mesh, ready to activate

**Timeline:** 3 months to full vision

**Philosophy:** Real connection, no BS, geometric truth

---

**Build order:**
1. Personal tools (Dec)
2. Hardware integration (Dec)
3. Social features (Jan)
4. Professional tier (Feb-Mar)
5. Scale (Mar+)

---

**Every feature serves the mission:**

**"Structure engineered for chaos."**

**Different tetrahedron groups.**

**Same app.**

**Different entry points.**

**Same conclusion:**

**Everyone gets the support structure they need.**

---

**Ready to build?**
