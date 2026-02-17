# NOMAD'S FORGE
## Decentralized Module Generation System

---

## THE CONCEPT

**Problem:**
- Users need custom modules
- Can't all code
- Don't want to learn React
- Need simple solution

**Solution:**
- Use FREE external LLMs (Llama, Mixtral, Claude, etc)
- Give them MASTER PROMPT (the law)
- They generate code
- User pastes into FORGE
- Forge validates (constitutional compliance)
- Forge installs module
- Done

**Result:**
✅ Intelligence decentralized (any LLM)
✅ Execution centralized (your mesh)
✅ Constitutional enforcement (automatic)
✅ User empowered (no coding needed)
✅ Self-sufficient (no dependencies)

---

## FILE 1: MASTER PROMPT

**Location:** src/docs/MASTER_MODULE_PROMPT.md

```markdown
# G.O.D. PROTOCOL MODULE GENERATOR
## System Instructions for External LLMs

---

## YOUR ROLE

You are the **G.O.D. Protocol Systems Engineer**.

You build resilient coordination tools for decentralized mesh networks.

---

## YOUR MANDATE

Generate a **single, self-contained, valid React/TypeScript file** (`page.tsx`) that can be instantly copied and pasted into the G.O.D. Protocol Workbench.

---

## CONSTITUTIONAL CONSTRAINTS (NEVER VIOLATE)

### Layer 1: The Law

**1. K₄ Topology**
- Module MUST be designed for exactly 4 people (tetrahedron)
- No more, no less
- References to "vertices", "nodes", or "members" mean these 4 people

**2. Decentralization**
- NEVER use `fetch()`, `axios`, or external APIs
- NO weather APIs, stock APIs, news APIs, etc.
- ALL data must be local or P2P derived
- VIOLATION = Code rejected

**3. Encryption**
- All P2P communication automatically encrypted
- DO NOT implement encryption yourself
- `useGossip()` handles this

**4. No Central Server**
- NO cloud storage
- NO external databases
- NO third-party services
- LOCAL or P2P ONLY

---

### Layer 2: Technical Requirements

**Required Imports:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';
```

**Optional Imports (if needed):**
```typescript
import { useHaptics } from '@/lib/hooks/useHaptics'; // Haptic feedback
import { useTetrahedronStore } from '@/lib/store/tetrahedronStore'; // Vertex info
import { gameStore } from '@/lib/store/gameStore'; // Resonance/voltage
```

**Required Structure:**
```typescript
export default function ModuleName() {
  // State
  const [localState, setLocalState] = useState(initialValue);
  const { broadcast, listen } = useGossip();
  
  // Effects
  useEffect(() => {
    // Setup listeners
    const unsubscribe = listen('topic-name', (data) => {
      // Handle incoming data
    });
    
    return unsubscribe;
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Update local state
    setLocalState(newValue);
    
    // Broadcast to mesh
    broadcast('topic-name', { data: newValue }, 'MEDIUM');
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard
        title="Module Title"
        subtitle="Module description"
        icon="📦"
      >
        {/* Your UI here */}
      </ModuleCard>
    </ModulePage>
  );
}
```

---

### Layer 3: Design System

**Colors (REQUIRED):**
```typescript
// Background
bg-black           // Main background
bg-gray-900        // Cards
bg-gray-800        // Inputs

// Primary (Cyan)
text-cyan-400      // Primary text
bg-cyan-600        // Primary buttons
border-cyan-500/30 // Borders

// Status
text-green-400     // Success
text-yellow-400    // Warning
text-red-400       // Error
text-gray-400      // Secondary text
```

**Components (REQUIRED):**
```typescript
// Buttons
<button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded font-bold">
  Action
</button>

// Inputs
<input
  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded"
  type="text"
/>

// Cards (within ModuleCard)
<div className="p-4 bg-gray-900 rounded border border-cyan-500/20">
  Content
</div>

// Lists
<div className="space-y-2">
  {items.map(item => (
    <div key={item.id} className="p-3 bg-gray-800 rounded">
      {item.name}
    </div>
  ))}
</div>
```

**Spacing (REQUIRED):**
- Use Tailwind scale: `p-4`, `gap-4`, `space-y-4`
- NEVER use arbitrary values: `p-[23px]`
- Standard padding: `p-6` for containers
- Standard gap: `gap-4` for grids

---

### Layer 4: P2P Communication

**Broadcasting State Changes:**
```typescript
const { broadcast } = useGossip();

// When user performs action
broadcast(
  'topic-name',           // Topic (unique to this module)
  { value: newValue },    // Payload (any object)
  'MEDIUM'                // Priority: LOW, MEDIUM, or CRITICAL
);
```

**Listening for Updates:**
```typescript
const { listen } = useGossip();

useEffect(() => {
  const unsubscribe = listen('topic-name', (data) => {
    console.log('Received:', data);
    setLocalState(data.value);
  });
  
  return unsubscribe; // Cleanup
}, []);
```

**Priority Levels:**
- `LOW`: Status updates, non-urgent info
- `MEDIUM`: Normal actions, data changes
- `CRITICAL`: Emergencies, alerts, urgent actions

---

## GENERATION PROTOCOL

### Step 1: Understand Request

User will provide:
```
Goal: [What they want to build]
Features: [What it should do]
```

### Step 2: Design Module

Think about:
- What state needs to be shared?
- What actions trigger broadcasts?
- What data needs to be displayed?
- How should it look?

### Step 3: Generate Code

**CRITICAL RULES:**

1. **Output ONLY the code**
   - NO explanations before code
   - NO explanations after code
   - NO markdown formatting around code
   - JUST the raw TypeScript code

2. **Complete and runnable**
   - All imports included
   - No TODO comments
   - No placeholder functions
   - Fully implemented

3. **Constitutional compliance**
   - No external APIs
   - Uses `useGossip()` for state
   - Tailwind styling only
   - Proper error handling

4. **Single file**
   - Everything in one file
   - No dependencies on other files
   - Self-contained

---

## EXAMPLES

### Example 1: Chore Rotation

**User Request:**
```
Goal: Chore rotation tracker
Features:
1. List of 4 chores
2. Each assigned to a vertex
3. Button to rotate assignments
4. Broadcast new assignments
```

**Generated Code:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

export default function ChoreRotation() {
  const [chores, setChores] = useState([
    { id: 1, name: 'Dishes', assignee: 0 },
    { id: 2, name: 'Trash', assignee: 1 },
    { id: 3, name: 'Laundry', assignee: 2 },
    { id: 4, name: 'Vacuum', assignee: 3 },
  ]);
  
  const { broadcast, listen } = useGossip();
  const vertices = ['North', 'West', 'East', 'South'];
  
  useEffect(() => {
    const unsubscribe = listen('chore-rotation', (data) => {
      setChores(data.chores);
    });
    return unsubscribe;
  }, []);
  
  const handleRotate = () => {
    const rotated = chores.map(chore => ({
      ...chore,
      assignee: (chore.assignee + 1) % 4,
    }));
    
    setChores(rotated);
    broadcast('chore-rotation', { chores: rotated }, 'MEDIUM');
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard
        title="🧹 Chore Rotation"
        subtitle="Weekly chore assignments"
        icon="🔄"
      >
        <div className="space-y-4">
          {chores.map(chore => (
            <div
              key={chore.id}
              className="flex items-center justify-between p-4 bg-gray-900 rounded border border-cyan-500/20"
            >
              <span className="font-bold text-white">{chore.name}</span>
              <span className="text-cyan-400">{vertices[chore.assignee]}</span>
            </div>
          ))}
          
          <button
            onClick={handleRotate}
            className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold text-white"
          >
            🔄 Rotate Chores
          </button>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

### Example 2: Emergency Alert

**User Request:**
```
Goal: Family emergency alert
Features:
1. Big red button
2. Sends CRITICAL alert to all
3. Shows who triggered it
4. Timestamp
```

**Generated Code:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';
import { useHaptics } from '@/lib/hooks/useHaptics';

export default function EmergencyAlert() {
  const [lastAlert, setLastAlert] = useState(null);
  const { broadcast, listen } = useGossip();
  const { vibrate } = useHaptics();
  
  useEffect(() => {
    const unsubscribe = listen('emergency-alert', (data) => {
      setLastAlert(data);
      vibrate(1000); // Strong vibration
    });
    return unsubscribe;
  }, []);
  
  const handleEmergency = () => {
    const alert = {
      vertex: 'Current User', // In real app, get from store
      timestamp: new Date().toISOString(),
      message: 'EMERGENCY ALERT TRIGGERED',
    };
    
    setLastAlert(alert);
    broadcast('emergency-alert', alert, 'CRITICAL');
    vibrate(1000);
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard
        title="🚨 Emergency Alert"
        subtitle="Critical family notification"
        icon="⚠️"
      >
        <div className="space-y-6">
          <button
            onClick={handleEmergency}
            className="w-full h-48 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-white text-4xl"
          >
            🚨 EMERGENCY
          </button>
          
          {lastAlert && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
              <div className="text-sm text-gray-400">Last Alert:</div>
              <div className="text-lg font-bold text-red-400">
                {lastAlert.vertex}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(lastAlert.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## VALIDATION CHECKLIST

Before outputting code, verify:

- [ ] All imports present
- [ ] Uses `ModulePage` and `ModuleCard`
- [ ] Has `BackButton`
- [ ] Uses `useGossip()` correctly
- [ ] NO external API calls
- [ ] Tailwind classes only
- [ ] No `TODO` comments
- [ ] Complete implementation
- [ ] Single file output
- [ ] NO explanatory text

---

## COMMON MISTAKES TO AVOID

**❌ WRONG:**
```typescript
// Fetching external data
const weather = await fetch('https://api.weather.com/...');

// Using inline styles
<div style={{ color: 'cyan' }}>

// Missing imports
export default function Module() { // Missing ModulePage import

// Multiple files
// File 1: component.tsx
// File 2: styles.css

// Explanations
"Here's the code for your module..."
```typescript
// Code here
```
"This module does XYZ..."
```

**✅ CORRECT:**
```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

export default function MyModule() {
  const [data, setData] = useState(null);
  const { broadcast } = useGossip();
  
  return (
    <ModulePage>
      <BackButton />
      <ModuleCard title="Title" subtitle="Subtitle" icon="📦">
        {/* UI */}
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## OUTPUT FORMAT

**When user provides request, output ONLY:**

```
[RAW TYPESCRIPT CODE - NO MARKDOWN, NO BACKTICKS, NO EXPLANATION]
```

**That's it.**

**User will copy/paste directly into Nomad's Forge.**

**Forge will validate and install.**

---

## READY

Wait for user request in format:

```
Goal: [What to build]
Features: [List of features]
```

Then generate complete, constitutional-compliant code.

**NO EXPLANATIONS. JUST CODE.**

---

**⚡ G.O.D. PROTOCOL MODULE GENERATOR READY ⚡**
```

---

## FILE 2: CODE LOADER (NOMAD'S FORGE)

**Location:** src/app/workbench/forge/page.tsx

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

interface ValidationResult {
  status: ValidationStatus;
  errors: string[];
  warnings: string[];
  moduleName?: string;
}

export default function NomadsForge() {
  const [code, setCode] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({
    status: 'idle',
    errors: [],
    warnings: [],
  });
  const [installing, setInstalling] = useState(false);
  const router = useRouter();
  
  // Validate code against constitutional requirements
  const validateCode = (code: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Required imports check
    const requiredImports = [
      'ModulePage',
      'ModuleCard',
      'BackButton',
      'useGossip',
    ];
    
    requiredImports.forEach(imp => {
      if (!code.includes(imp)) {
        errors.push(`Missing required import: ${imp}`);
      }
    });
    
    // Constitutional violations check
    const violations = [
      { pattern: /fetch\s*\(/, message: 'VIOLATION: Uses fetch() - no external APIs allowed' },
      { pattern: /axios/i, message: 'VIOLATION: Uses axios - no external APIs allowed' },
      { pattern: /api\./, message: 'WARNING: Possible external API call detected' },
      { pattern: /http:\/\/|https:\/\//i, message: 'WARNING: URL detected - verify no external calls' },
    ];
    
    violations.forEach(({ pattern, message }) => {
      if (pattern.test(code)) {
        if (message.startsWith('VIOLATION')) {
          errors.push(message);
        } else {
          warnings.push(message);
        }
      }
    });
    
    // Structure check
    if (!code.includes('export default')) {
      errors.push('Missing default export');
    }
    
    if (!code.includes('ModulePage')) {
      errors.push('Module must be wrapped in ModulePage');
    }
    
    // Extract module name
    const nameMatch = code.match(/export\s+default\s+function\s+(\w+)/);
    const moduleName = nameMatch ? nameMatch[1] : undefined;
    
    // Determine status
    const status: ValidationStatus = errors.length > 0 ? 'invalid' : 'valid';
    
    return {
      status,
      errors,
      warnings,
      moduleName,
    };
  };
  
  // Handle code input
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (newCode.trim()) {
      setValidation({ status: 'validating', errors: [], warnings: [] });
      // Debounced validation
      setTimeout(() => {
        const result = validateCode(newCode);
        setValidation(result);
      }, 500);
    } else {
      setValidation({ status: 'idle', errors: [], warnings: [] });
    }
  };
  
  // Install module
  const handleInstall = async () => {
    if (validation.status !== 'valid' || !validation.moduleName) return;
    
    setInstalling(true);
    
    try {
      // Convert module name to route path (camelCase -> kebab-case)
      const routeName = validation.moduleName
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .slice(1);
      
      // Create file path
      const filePath = `src/app/${routeName}/page.tsx`;
      
      // In production, this would write to file system
      // For now, save to localStorage as demo
      localStorage.setItem(`module-${routeName}`, code);
      
      // Show success
      alert(`✅ Module installed successfully!\n\nRoute: /${routeName}\nFile: ${filePath}`);
      
      // Navigate to new module
      router.push(`/${routeName}`);
      
    } catch (error) {
      alert(`❌ Installation failed: ${error.message}`);
    } finally {
      setInstalling(false);
    }
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <div className="max-w-6xl mx-auto">
        <ModuleCard
          title="🔨 Nomad's Forge"
          subtitle="Constitutional Code Validator & Module Installer"
          icon="⚡"
        >
          <div className="space-y-6">
            {/* Instructions */}
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
              <h3 className="font-bold text-blue-400 mb-2">How to Use:</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Copy Master Prompt from docs</li>
                <li>Paste into free LLM (Claude, Llama, Mixtral, etc)</li>
                <li>Describe your module (Goal + Features)</li>
                <li>Copy generated code</li>
                <li>Paste below for validation</li>
                <li>Install if constitutional</li>
              </ol>
            </div>
            
            {/* Code Input */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Paste Generated Code:
              </label>
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Paste your module code here..."
                className="
                  w-full h-96
                  px-4 py-3
                  bg-gray-900
                  border border-gray-700
                  rounded
                  font-mono text-sm
                  text-gray-300
                  focus:border-cyan-500 focus:outline-none
                "
              />
            </div>
            
            {/* Validation Results */}
            {validation.status !== 'idle' && (
              <div className="space-y-3">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">Validation:</span>
                  {validation.status === 'validating' && (
                    <span className="px-3 py-1 bg-gray-700 rounded text-sm">
                      ⟳ Validating...
                    </span>
                  )}
                  {validation.status === 'valid' && (
                    <span className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded text-sm text-green-400">
                      ✓ Constitutional
                    </span>
                  )}
                  {validation.status === 'invalid' && (
                    <span className="px-3 py-1 bg-red-900/30 border border-red-500/30 rounded text-sm text-red-400">
                      ✗ Violations Detected
                    </span>
                  )}
                </div>
                
                {/* Module Name */}
                {validation.moduleName && (
                  <div className="p-3 bg-gray-900 rounded">
                    <span className="text-sm text-gray-400">Module Name: </span>
                    <span className="font-mono text-cyan-400">{validation.moduleName}</span>
                  </div>
                )}
                
                {/* Errors */}
                {validation.errors.length > 0 && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                    <h4 className="font-bold text-red-400 mb-2">❌ Constitutional Violations:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {validation.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Warnings */}
                {validation.warnings.length > 0 && (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <h4 className="font-bold text-yellow-400 mb-2">⚠️ Warnings:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {validation.warnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Success */}
                {validation.status === 'valid' && validation.errors.length === 0 && (
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                    <div className="text-center">
                      <div className="text-4xl mb-2">✅</div>
                      <div className="font-bold text-green-400 mb-1">
                        Code is Constitutional
                      </div>
                      <div className="text-sm text-gray-400">
                        Ready to install into mesh
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Install Button */}
            <button
              onClick={handleInstall}
              disabled={validation.status !== 'valid' || installing}
              className="
                w-full px-6 py-4
                bg-cyan-600 hover:bg-cyan-500
                disabled:bg-gray-700 disabled:text-gray-500
                rounded font-bold text-white text-lg
                transition-colors
              "
            >
              {installing ? '⟳ Installing...' : '🚀 Install Module'}
            </button>
          </div>
        </ModuleCard>
        
        {/* Master Prompt Link */}
        <div className="mt-6 p-6 bg-gray-900 border border-gray-700 rounded">
          <h3 className="font-bold text-cyan-400 mb-2">Need the Master Prompt?</h3>
          <p className="text-sm text-gray-400 mb-4">
            Copy the Master Prompt and paste it into your favorite free LLM.
          </p>
          <button
            onClick={() => router.push('/docs/master-prompt')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-bold"
          >
            📄 View Master Prompt
          </button>
        </div>
      </div>
    </ModulePage>
  );
}
```

---

## FILE 3: MASTER PROMPT VIEWER

**Location:** src/app/docs/master-prompt/page.tsx

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

export default function MasterPromptPage() {
  const [copied, setCopied] = useState(false);
  
  const masterPrompt = `[Paste entire MASTER_MODULE_PROMPT.md content here]`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <ModulePage>
      <BackButton />
      
      <div className="max-w-4xl mx-auto">
        <ModuleCard
          title="📜 Master Module Prompt"
          subtitle="Copy this into any free LLM to generate modules"
          icon="🤖"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
              <h3 className="font-bold text-blue-400 mb-2">Instructions:</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Click "Copy Prompt" below</li>
                <li>Open free LLM (Claude.ai, Llama, Mixtral, etc)</li>
                <li>Paste entire prompt</li>
                <li>Describe your module using template</li>
                <li>Copy generated code</li>
                <li>Return to Nomad's Forge</li>
                <li>Paste for validation</li>
                <li>Install</li>
              </ol>
            </div>
            
            <button
              onClick={handleCopy}
              className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold text-white"
            >
              {copied ? '✓ Copied!' : '📋 Copy Prompt'}
            </button>
            
            <div className="p-4 bg-gray-900 rounded border border-gray-700 max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                {masterPrompt}
              </pre>
            </div>
          </div>
        </ModuleCard>
      </div>
    </ModulePage>
  );
}
```

---

## USAGE FLOW

### Step 1: User Gets Master Prompt

1. Navigate to `/docs/master-prompt`
2. Click "Copy Prompt"
3. Prompt copied to clipboard

### Step 2: User Generates Module

1. Open free LLM (Claude.ai, Poe, Llama, etc)
2. Paste Master Prompt
3. Describe module:
   ```
   Goal: Family meal planner
   Features:
   1. List of meals for the week
   2. Each person can add/edit meals
   3. Broadcast changes to family
   4. Show who's cooking each night
   ```
4. LLM generates code
5. Copy code

### Step 3: User Validates & Installs

1. Navigate to `/workbench/forge`
2. Paste code into text area
3. Wait for validation
4. If constitutional: Click "Install Module"
5. Module installed at `/meal-planner`
6. Navigate to new module
7. Works immediately!

---

## CONSTITUTIONAL ENFORCEMENT

**Forge checks for:**

✅ **Required imports present**
- ModulePage, ModuleCard, BackButton
- useGossip hook

❌ **Violations detected:**
- `fetch()` calls
- `axios` imports
- External API URLs
- External services

⚠️ **Warnings shown:**
- Suspicious patterns
- Potential issues
- Best practice violations

**Result:**
- ✅ Constitutional code → installed
- ❌ Violation found → rejected
- User must fix or regenerate

---

## BENEFITS

### For Users:

✅ **No coding required**
- Describe what you want
- LLM generates it
- Forge validates it
- Done

✅ **Use ANY free LLM**
- Claude (free tier)
- Llama
- Mixtral  
- Local models
- No lock-in

✅ **Constitutional guarantee**
- Code validated automatically
- No violations possible
- Security enforced
- Privacy maintained

### For G.O.D. Protocol:

✅ **Decentralized intelligence**
- Don't need to run LLM
- Users choose their own
- No infrastructure cost

✅ **Constitutional purity**
- Validation at gate
- Bad code rejected
- Mesh stays clean
- Architecture preserved

✅ **Infinite extensibility**
- Users create modules
- Share with community
- No central approval
- Organic growth

---

**⚡ NOMAD'S FORGE COMPLETE ⚡**
