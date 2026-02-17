# CURSOR PROMPT: BUILD XBOX CLONING MODULE
## Complete Implementation Guide

---

## COPY THIS ENTIRE PROMPT INTO CURSOR

```
TASK: Build Xbox Series S NVME Cloning Module

CONTEXT: Father-son project to fix broken Xbox by cloning NVME from broken console (good key, bad HDMI) to new console (good HDMI, wrong key).

GOAL: Create a web-based module that guides through the cloning process with safety checks, progress tracking, and clear instructions.

---

STEP 1: CREATE MODULE STRUCTURE

Create new route: src/app/xbox-clone/page.tsx

```typescript
'use client';

import { useState } from 'react';
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { useGossip } from '@/lib/hooks/useGossip';

type Step = 'select' | 'validate' | 'ready' | 'cloning' | 'verify' | 'complete' | 'error';
type Status = 'idle' | 'validating' | 'cloning' | 'verifying' | 'complete' | 'error';

export default function XboxClonePage() {
  const [step, setStep] = useState<Step>('select');
  const [status, setStatus] = useState<Status>('idle');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [consoleKey, setConsoleKey] = useState('');
  const { broadcast } = useGossip();

  return (
    <ModulePage>
      <BackButton />
      
      <div className="max-w-4xl mx-auto">
        <ModuleCard
          title="🎮 Xbox NVME Clone Tool"
          subtitle="Fix broken HDMI by cloning console key"
          icon="🔧"
        >
          {/* Progress Steps */}
          <ProgressSteps currentStep={step} />
          
          {/* Main Content */}
          <div className="mt-8">
            {step === 'select' && (
              <SelectFileStep
                onFileSelect={(file) => {
                  setSourceFile(file);
                  setStep('validate');
                  validateFile(file);
                }}
              />
            )}
            
            {step === 'validate' && (
              <ValidateStep
                file={sourceFile}
                status={status}
                consoleKey={consoleKey}
                onContinue={() => setStep('ready')}
                onError={(msg) => {
                  setErrorMessage(msg);
                  setStep('error');
                }}
              />
            )}
            
            {step === 'ready' && (
              <ReadyStep
                consoleKey={consoleKey}
                onStart={() => {
                  setStep('cloning');
                  startClone();
                }}
                onCancel={() => setStep('select')}
              />
            )}
            
            {step === 'cloning' && (
              <CloneStep
                progress={progress}
                status={status}
              />
            )}
            
            {step === 'verify' && (
              <VerifyStep
                onComplete={() => {
                  setStep('complete');
                  broadcast('xbox-clone-success', { timestamp: Date.now() }, 'MEDIUM');
                }}
              />
            )}
            
            {step === 'complete' && (
              <CompleteStep onReset={() => {
                setStep('select');
                setProgress(0);
                setSourceFile(null);
              }} />
            )}
            
            {step === 'error' && (
              <ErrorStep
                message={errorMessage}
                onRetry={() => setStep('select')}
              />
            )}
          </div>
        </ModuleCard>
        
        {/* Safety Warning */}
        <SafetyWarning />
      </div>
    </ModulePage>
  );
}
```

---

STEP 2: CREATE PROGRESS STEPS COMPONENT

File: src/components/xbox/ProgressSteps.tsx

```typescript
'use client';

interface ProgressStepsProps {
  currentStep: string;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { id: 'select', label: '1. Select File', icon: '📁' },
    { id: 'validate', label: '2. Validate', icon: '✓' },
    { id: 'ready', label: '3. Ready', icon: '⚡' },
    { id: 'cloning', label: '4. Clone', icon: '🔄' },
    { id: 'verify', label: '5. Verify', icon: '🔍' },
    { id: 'complete', label: '6. Complete', icon: '🎉' },
  ];
  
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, i) => {
        const isActive = s.id === currentStep;
        const isComplete = steps.findIndex(x => x.id === currentStep) > i;
        
        return (
          <div key={s.id} className="flex items-center">
            <div className={`
              flex flex-col items-center
              ${isActive ? 'text-cyan-400' : isComplete ? 'text-green-400' : 'text-gray-600'}
            `}>
              <div className={`
                w-12 h-12 rounded-full
                flex items-center justify-center
                text-2xl
                ${isActive ? 'bg-cyan-500/20 border-2 border-cyan-400' : ''}
                ${isComplete ? 'bg-green-500/20' : ''}
                ${!isActive && !isComplete ? 'bg-gray-800' : ''}
              `}>
                {isComplete ? '✓' : s.icon}
              </div>
              <div className="mt-2 text-xs font-bold whitespace-nowrap">
                {s.label}
              </div>
            </div>
            
            {i < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-2
                ${isComplete ? 'bg-green-400' : 'bg-gray-700'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

STEP 3: CREATE FILE SELECTION STEP

File: src/components/xbox/SelectFileStep.tsx

```typescript
'use client';

interface SelectFileStepProps {
  onFileSelect: (file: File) => void;
}

export function SelectFileStep({ onFileSelect }: SelectFileStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          Select Source NVME Dump
        </h2>
        <p className="text-gray-400">
          This should be the dump from the broken Xbox (with working console key)
        </p>
      </div>
      
      <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-12">
        <label className="flex flex-col items-center cursor-pointer">
          <div className="text-6xl mb-4">📁</div>
          <div className="text-lg font-bold text-cyan-400 mb-2">
            Choose NVME dump file
          </div>
          <div className="text-sm text-gray-500 mb-4">
            .bin or .img file (4GB)
          </div>
          <input
            type="file"
            accept=".bin,.img"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
            className="hidden"
          />
          <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold">
            Browse Files
          </button>
        </label>
      </div>
      
      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-gray-300">
            <p className="font-bold mb-1">Where to get this file:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Extract NVME from broken Xbox</li>
              <li>Connect to PC with USB adapter</li>
              <li>Use dd command to create dump</li>
              <li>Verify file is exactly 4,294,967,296 bytes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

STEP 4: CREATE VALIDATION STEP

File: src/components/xbox/ValidateStep.tsx

```typescript
'use client';

import { useEffect, useState } from 'react';

interface ValidateStepProps {
  file: File | null;
  status: string;
  consoleKey: string;
  onContinue: () => void;
  onError: (message: string) => void;
}

export function ValidateStep({ file, status, consoleKey, onContinue, onError }: ValidateStepProps) {
  const [checks, setChecks] = useState({
    fileSize: false,
    header: false,
    key: false,
    partitions: false,
  });
  
  useEffect(() => {
    if (file) validateFile(file);
  }, [file]);
  
  const validateFile = async (file: File) => {
    // Check 1: File size
    const validSize = file.size === 4294967296;
    setChecks(prev => ({ ...prev, fileSize: validSize }));
    
    if (!validSize) {
      onError(`Invalid file size: ${file.size} bytes. Should be exactly 4,294,967,296 bytes (4GB)`);
      return;
    }
    
    // Check 2: Xbox header
    const headerBuffer = await file.slice(0, 16).arrayBuffer();
    const header = new Uint8Array(headerBuffer);
    const validHeader = header[0] === 0x58 && header[1] === 0x42 && header[2] === 0x4F && header[3] === 0x58;
    setChecks(prev => ({ ...prev, header: validHeader }));
    
    if (!validHeader) {
      onError('Invalid file format. Not an Xbox NVME dump (missing XBOX header).');
      return;
    }
    
    // Check 3: Console key
    const keyBuffer = await file.slice(0x180, 0x190).arrayBuffer();
    const keyBytes = new Uint8Array(keyBuffer);
    const keyHex = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase();
    const validKey = !keyBytes.every(b => b === 0) && !keyBytes.every(b => b === 0xFF);
    setChecks(prev => ({ ...prev, key: validKey }));
    
    if (!validKey) {
      onError('Invalid console key detected (all zeros or all FFs). Dump may be corrupted.');
      return;
    }
    
    // Check 4: Partition table
    const partBuffer = await file.slice(0x1BE, 0x1FE).arrayBuffer();
    const partBytes = new Uint8Array(partBuffer);
    const validPart = partBytes[0] !== 0;
    setChecks(prev => ({ ...prev, partitions: validPart }));
    
    if (!validPart) {
      onError('Invalid partition table. Dump may be incomplete.');
      return;
    }
    
    // All checks passed!
    setTimeout(() => onContinue(), 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          Validating Dump File
        </h2>
        <p className="text-gray-400">
          Running safety checks...
        </p>
      </div>
      
      <div className="space-y-3">
        <CheckItem
          label="File Size (4GB)"
          status={checks.fileSize ? 'pass' : 'checking'}
        />
        <CheckItem
          label="Xbox Header Magic Bytes"
          status={checks.header ? 'pass' : 'checking'}
        />
        <CheckItem
          label="Console Key Present"
          status={checks.key ? 'pass' : 'checking'}
        />
        <CheckItem
          label="Partition Table Valid"
          status={checks.partitions ? 'pass' : 'checking'}
        />
      </div>
      
      {Object.values(checks).every(Boolean) && (
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded text-center">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-lg font-bold text-green-400">
            All checks passed!
          </div>
          <div className="text-sm text-gray-400">
            Dump file is valid and ready to clone
          </div>
        </div>
      )}
    </div>
  );
}

function CheckItem({ label, status }: { label: string; status: 'checking' | 'pass' | 'fail' }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded">
      <span className="text-sm font-bold">{label}</span>
      {status === 'checking' && (
        <div className="animate-spin text-cyan-400">⟳</div>
      )}
      {status === 'pass' && (
        <span className="text-green-400">✓</span>
      )}
      {status === 'fail' && (
        <span className="text-red-400">✗</span>
      )}
    </div>
  );
}
```

---

STEP 5: CREATE READY STEP

File: src/components/xbox/ReadyStep.tsx

```typescript
'use client';

interface ReadyStepProps {
  consoleKey: string;
  onStart: () => void;
  onCancel: () => void;
}

export function ReadyStep({ consoleKey, onStart, onCancel }: ReadyStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          Ready to Clone
        </h2>
        <p className="text-gray-400">
          All checks passed. Ready to write to target NVME.
        </p>
      </div>
      
      <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30">
        <div className="text-sm text-gray-400 mb-2">Console Key Detected:</div>
        <div className="font-mono text-xs text-cyan-400 break-all">
          {consoleKey || 'Extracting...'}
        </div>
      </div>
      
      <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-2">
              CRITICAL WARNING
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>This will OVERWRITE the target NVME completely.</p>
              <p className="font-bold">Before proceeding:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Verify target NVME is connected</li>
                <li>Create backup if desired (optional)</li>
                <li>Ensure stable power (UPS recommended)</li>
                <li>Do NOT disconnect during write</li>
                <li>Process takes 15-30 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded font-bold"
        >
          Cancel
        </button>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded font-bold text-white"
        >
          Start Clone
        </button>
      </div>
    </div>
  );
}
```

---

STEP 6: CREATE CLONE STEP

File: src/components/xbox/CloneStep.tsx

```typescript
'use client';

interface CloneStepProps {
  progress: number;
  status: string;
}

export function CloneStep({ progress, status }: CloneStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          Cloning in Progress
        </h2>
        <p className="text-gray-400">
          Do not disconnect or close this window
        </p>
      </div>
      
      {/* Large circular progress */}
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(107, 114, 128, 0.3)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgb(6, 182, 212)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.827} 282.7`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-cyan-400">
              {progress}%
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {status}
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Status messages */}
      <div className="p-4 bg-gray-900 rounded border border-cyan-500/20">
        <div className="text-xs font-mono text-gray-400 space-y-1">
          <div>Reading source NVME...</div>
          <div>Writing to target device...</div>
          <div>Verifying write integrity...</div>
          <div className="text-cyan-400">⟳ {status}</div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded text-center">
        <p className="text-sm text-yellow-400 font-bold">
          ⚠️ Do not disconnect power or close window
        </p>
      </div>
    </div>
  );
}
```

---

STEP 7: CREATE COMPLETE STEP

File: src/components/xbox/CompleteStep.tsx

```typescript
'use client';

interface CompleteStepProps {
  onReset: () => void;
}

export function CompleteStep({ onReset }: CompleteStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-8xl mb-4">🎉</div>
      
      <h2 className="text-3xl font-bold text-green-400">
        Clone Complete!
      </h2>
      
      <p className="text-gray-400 max-w-md mx-auto">
        The NVME has been successfully cloned with the console key from your broken Xbox.
      </p>
      
      <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-lg max-w-md mx-auto">
        <h3 className="font-bold text-green-400 mb-3">Next Steps:</h3>
        <ol className="text-sm text-left space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">1.</span>
            <span>Install cloned NVME in new Xbox</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">2.</span>
            <span>Reassemble console carefully</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">3.</span>
            <span>Connect HDMI and power</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">4.</span>
            <span>Power on and test boot</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">5.</span>
            <span>Verify games and Xbox Live work</span>
          </li>
        </ol>
      </div>
      
      <button
        onClick={onReset}
        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold"
      >
        Clone Another
      </button>
    </div>
  );
}
```

---

STEP 8: CREATE SAFETY WARNING COMPONENT

File: src/components/xbox/SafetyWarning.tsx

```typescript
'use client';

export function SafetyWarning() {
  return (
    <div className="mt-6 p-6 bg-gray-900 border border-gray-700 rounded-lg">
      <h3 className="text-lg font-bold text-yellow-400 mb-3">
        ⚠️ Safety & Legal Notice
      </h3>
      <div className="text-sm text-gray-400 space-y-2">
        <p>
          <strong>This tool is for repair purposes only.</strong> Use it to fix your own hardware.
        </p>
        <p>
          <strong>Legal:</strong> Repairing your own console is legal. Cloning someone else's console or using this for piracy is illegal.
        </p>
        <p>
          <strong>Warranty:</strong> Opening your console voids the warranty. Proceed at your own risk.
        </p>
        <p>
          <strong>Support:</strong> For questions, see the full repair guide or ask Dad. 👨‍👦
        </p>
      </div>
    </div>
  );
}
```

---

STEP 9: ADD NAVIGATION LINK

File: src/app/page.tsx

Add button to home page navigation:

```typescript
<Link href="/xbox-clone">
  <button className="px-4 py-2 text-sm font-bold text-cyan-400 hover:bg-cyan-500/10">
    🎮 Xbox Clone
  </button>
</Link>
```

---

STEP 10: TEST CHECKLIST

After implementation, verify:

[ ] Module accessible from home page
[ ] Can select file (drag/drop or browse)
[ ] File validation runs automatically
[ ] Progress steps show current state
[ ] All safety warnings displayed
[ ] Clone button requires confirmation
[ ] Progress tracking works (simulated)
[ ] Success screen shows next steps
[ ] Can reset and start over
[ ] Mesh broadcast on completion
[ ] Mobile responsive
[ ] All text readable

---

EXPECTED RESULT:

✅ Full Xbox cloning module
✅ Step-by-step wizard interface
✅ Safety checks and warnings
✅ Progress tracking
✅ Clear instructions
✅ Professional UI
✅ Father-son collaboration ready

---

This module is a TEMPLATE. The actual hardware interface (Web Serial API or Electron integration) would be added later. For now, this provides the UI/UX framework and learning structure.

EXECUTE THIS PROMPT NOW.
```

---

**⚡ CURSOR PROMPT COMPLETE ⚡**
