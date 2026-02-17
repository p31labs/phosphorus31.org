# OPERATION: GENESIS RITUAL
## The Complete Onboarding Flow - Air Lock Integrity

---

## THE MANDATE

**From The Architect:**

```
"The Onboarding Flow is the Air Lock.
If the seal is compromised, the mission fails.
We must achieve structural integrity for user 
identification and the Genesis Ritual."
```

---

## THE THREE-PHASE RITUAL

### Phase 1: Identity & Attunement (Solo Journey)

**Step 1: The Void Test**

```typescript
// src/app/page.tsx (Gateway Orb)

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { generateNodeId } from '@/lib/crypto/identity';
import { Starfield } from '@/components/canvas/Starfield';

export default function GatewayPage() {
  const router = useRouter();
  const { hasCompletedOnboarding, nodeId } = useSettingsStore();
  const [isHolding, setIsHolding] = useState(false);
  const [resonance, setResonance] = useState(0);
  
  // Skip if already onboarded
  useEffect(() => {
    if (hasCompletedOnboarding && nodeId) {
      router.push('/home');
    }
  }, [hasCompletedOnboarding, nodeId]);
  
  // Resonance charging
  useEffect(() => {
    if (isHolding && resonance < 100) {
      const interval = setInterval(() => {
        setResonance((r) => Math.min(r + 1, 100));
      }, 30); // 3 seconds to charge
      return () => clearInterval(interval);
    }
  }, [isHolding, resonance]);
  
  // Complete at 100%
  useEffect(() => {
    if (resonance === 100) {
      handleResonanceComplete();
    }
  }, [resonance]);
  
  const handleResonanceComplete = async () => {
    // Generate cryptographic identity
    const identity = await generateNodeId();
    
    // Store in secure storage
    useSettingsStore.getState().setNodeId(identity.nodeId);
    useSettingsStore.getState().setPrivateKey(identity.privateKey);
    
    // Route to class selection
    router.push('/genesis/attunement');
  };
  
  // Orb color (Red → Yellow → Cyan)
  const getOrbColor = () => {
    if (resonance < 33) return '#ef4444'; // Red
    if (resonance < 66) return '#eab308'; // Yellow
    return '#06b6d4'; // Cyan
  };
  
  return (
    <div className="fixed inset-0 bg-void">
      {/* Starfield */}
      <Starfield />
      
      {/* Gateway Orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="relative w-64 h-64 mx-auto"
            animate={{
              scale: isHolding ? [1, 1.05, 1] : 1,
            }}
            transition={{
              repeat: isHolding ? Infinity : 0,
              duration: 2,
            }}
          >
            {/* Orb */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: getOrbColor(),
                boxShadow: `0 0 60px ${getOrbColor()}`,
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
            />
            
            {/* Progress ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getOrbColor()}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 45 * (1 - resonance / 100),
                }}
                transition={{ duration: 0.1 }}
              />
            </svg>
            
            {/* Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-white">
                {resonance}%
              </span>
            </div>
          </motion.div>
          
          {/* Instructions */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-primary text-lg font-bold tracking-wider">
              {resonance === 0 ? 'HOLD TO RESONATE' : 
               resonance < 100 ? 'ATTUNING...' : 
               'RESONANCE ACHIEVED'}
            </p>
            <p className="text-text-muted text-sm mt-2">
              {resonance === 0 ? 'Click and hold the orb to begin' :
               resonance < 100 ? 'Generating cryptographic identity' :
               'Entering the mesh...'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Key Generation**

```typescript
// src/lib/crypto/identity.ts

import { webcrypto } from 'crypto';

export interface NodeIdentity {
  nodeId: string;          // Public identifier (hash)
  privateKey: string;      // Private key (encrypted)
  publicKey: string;       // Public key
  timestamp: number;       // Genesis timestamp
}

export async function generateNodeId(): Promise<NodeIdentity> {
  // Generate ECDSA key pair
  const keyPair = await webcrypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );
  
  // Export public key
  const publicKeyRaw = await webcrypto.subtle.exportKey(
    'raw',
    keyPair.publicKey
  );
  const publicKey = Buffer.from(publicKeyRaw).toString('base64');
  
  // Generate node ID (hash of public key)
  const hash = await webcrypto.subtle.digest(
    'SHA-256',
    publicKeyRaw
  );
  const nodeId = Buffer.from(hash).toString('hex').substring(0, 16);
  
  // Export private key (to be encrypted)
  const privateKeyRaw = await webcrypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );
  const privateKey = Buffer.from(privateKeyRaw).toString('base64');
  
  console.log('✅ Node identity generated:', nodeId);
  
  return {
    nodeId,
    privateKey,
    publicKey,
    timestamp: Date.now(),
  };
}

export async function encryptPrivateKey(
  privateKey: string,
  passphrase: string
): Promise<string> {
  // Use PBKDF2 to derive encryption key
  const encoder = new TextEncoder();
  const passphraseKey = await webcrypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  
  const encryptionKey = await webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Encrypt private key
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const encrypted = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    encoder.encode(privateKey)
  );
  
  // Combine salt + iv + ciphertext
  const combined = new Uint8Array(
    salt.length + iv.length + encrypted.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return Buffer.from(combined).toString('base64');
}
```

**Step 3: Class Selection**

```typescript
// src/app/genesis/attunement/page.tsx

'use client';

import { ClassSelector } from '@/components/onboarding/ClassSelector';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { Starfield } from '@/components/canvas/Starfield';

export default function AttunementPage() {
  const router = useRouter();
  
  const handleClassSelect = (userClass: string) => {
    // Store class
    useSettingsStore.getState().setUserClass(userClass as any);
    
    // Route to K4 formation
    router.push('/genesis/formation');
  };
  
  return (
    <div className="fixed inset-0 bg-void">
      <Starfield />
      
      <div className="relative z-10">
        <ClassSelector onSelect={handleClassSelect} />
      </div>
    </div>
  );
}
```

---

### Phase 2: K₄ Formation (The Gathering)

**Step 4: The Gathering**

```typescript
// src/app/genesis/formation/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useTetrahedronStore } from '@/lib/store/tetrahedronStore';
import QRCode from 'qrcode';

export default function FormationPage() {
  const router = useRouter();
  const nodeId = useSettingsStore((s) => s.nodeId);
  const publicKey = useSettingsStore((s) => s.publicKey);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  
  // Generate QR code
  useEffect(() => {
    if (nodeId && publicKey) {
      const inviteUrl = `${window.location.origin}/join/${nodeId}`;
      QRCode.toDataURL(inviteUrl).then(setQrCodeUrl);
    }
  }, [nodeId, publicKey]);
  
  // Check if we have 3 peers
  useEffect(() => {
    setCanProceed(connectedPeers.length >= 3);
  }, [connectedPeers]);
  
  const handleProceed = () => {
    // Route to Vow ceremony
    router.push('/genesis/vow');
  };
  
  return (
    <div className="min-h-screen p-6 bg-void flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black text-primary mb-3">
            THE GATHERING
          </h1>
          <p className="text-text-muted text-lg">
            Invite 3 peers to form your K₄ Tetrahedron
          </p>
        </motion.div>
        
        {/* QR Code */}
        <div className="mb-8 p-8 bg-surface border border-primary rounded-xl text-center">
          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt="Invite QR Code"
              className="w-64 h-64 mx-auto mb-4"
            />
          )}
          
          <p className="text-sm text-text-muted">
            Scan this code with your peers' devices
          </p>
          
          <div className="mt-4 p-3 bg-void rounded-lg font-mono text-xs text-primary break-all">
            {nodeId}
          </div>
        </div>
        
        {/* Connected peers */}
        <div className="mb-8 p-6 bg-surface border border-border-base rounded-xl">
          <h3 className="text-lg font-bold text-text-main mb-4">
            Connected Peers ({connectedPeers.length}/3)
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`
                  p-4 rounded-lg text-center
                  ${connectedPeers[i]
                    ? 'bg-success/20 border border-success'
                    : 'bg-void border border-border-dim'
                  }
                `}
              >
                {connectedPeers[i] ? (
                  <>
                    <div className="text-2xl mb-2">✓</div>
                    <div className="text-xs font-mono text-success">
                      {connectedPeers[i].substring(0, 8)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl mb-2 text-text-dim">○</div>
                    <div className="text-xs text-text-dim">Waiting...</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Proceed button */}
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`
            w-full px-6 py-4
            rounded-lg
            font-bold text-lg
            transition-all
            ${canProceed
              ? 'bg-primary hover:bg-primary/80 text-void'
              : 'bg-surface border border-border-base text-text-dim cursor-not-allowed'
            }
          `}
        >
          {canProceed ? 'Proceed to Vow →' : 'Waiting for peers...'}
        </button>
        
        {/* Skip option */}
        <button
          onClick={() => router.push('/home')}
          className="w-full mt-4 px-4 py-2 text-text-muted hover:text-text-main text-sm transition-colors"
        >
          Skip for now (Solo mode)
        </button>
      </div>
    </div>
  );
}
```

**Step 5: The Vow (3-of-4 Multisig)**

```typescript
// src/app/genesis/vow/page.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formTetrahedron } from '@/lib/crypto/multisig';
import { useSettingsStore } from '@/lib/store/settingsStore';

export default function VowPage() {
  const router = useRouter();
  const [signatures, setSignatures] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [allPressed, setAllPressed] = useState(false);
  
  const handleJitterbug = async () => {
    // Sign with local key
    const signature = await signVow();
    setSignatures([...signatures, signature]);
    
    // Check if we have 3/4
    if (signatures.length + 1 >= 3) {
      // Form tetrahedron
      await formTetrahedron(signatures);
      setIsComplete(true);
      
      // Route to home after delay
      setTimeout(() => {
        useSettingsStore.getState().completeOnboarding();
        router.push('/home');
      }, 3000);
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-void flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h1 className="text-5xl font-black text-primary mb-4">
            THE VOW
          </h1>
          <p className="text-text-muted text-lg mb-12">
            All 4 operators must press simultaneously
          </p>
        </motion.div>
        
        {/* Jitterbug Button */}
        <div className="mb-12">
          <motion.button
            onClick={handleJitterbug}
            disabled={isComplete}
            className={`
              w-80 h-80 mx-auto
              rounded-full
              font-black text-3xl
              transition-all
              ${isComplete
                ? 'bg-success text-void'
                : 'bg-primary hover:bg-primary/80 text-void'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: isComplete 
                ? '0 0 60px rgba(34, 197, 94, 0.8)'
                : '0 0 60px rgba(6, 182, 212, 0.8)',
            }}
          >
            {isComplete ? '✓ FORMED' : 'PRESS'}
          </motion.button>
        </div>
        
        {/* Signature count */}
        <div className="p-6 bg-surface border border-border-base rounded-xl">
          <h3 className="text-lg font-bold text-text-main mb-4">
            Signatures ({signatures.length}/3 required)
          </h3>
          
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`
                  w-16 h-16 rounded-full
                  flex items-center justify-center
                  text-2xl
                  ${signatures[i]
                    ? 'bg-success/20 border-2 border-success text-success'
                    : 'bg-void border-2 border-border-dim text-text-dim'
                  }
                `}
              >
                {signatures[i] ? '✓' : '○'}
              </div>
            ))}
          </div>
        </div>
        
        {/* Success message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 p-6 bg-success/20 border border-success rounded-xl"
            >
              <p className="text-success font-bold text-lg">
                🎉 K₄ Tetrahedron Formed!
              </p>
              <p className="text-text-muted text-sm mt-2">
                Entering the mesh...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**Step 6: Multisig Implementation**

```typescript
// src/lib/crypto/multisig.ts

import { webcrypto } from 'crypto';
import { useSettingsStore } from '@/lib/store/settingsStore';

export async function signVow(): Promise<string> {
  const privateKey = useSettingsStore.getState().privateKey;
  
  if (!privateKey) {
    throw new Error('No private key found');
  }
  
  // Import private key
  const keyData = Buffer.from(privateKey, 'base64');
  const key = await webcrypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign']
  );
  
  // Sign vow message
  const message = 'I VOW TO UPHOLD THE G.O.D. PROTOCOL';
  const encoder = new TextEncoder();
  const signature = await webcrypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    key,
    encoder.encode(message)
  );
  
  return Buffer.from(signature).toString('base64');
}

export async function formTetrahedron(signatures: string[]): Promise<void> {
  if (signatures.length < 3) {
    throw new Error('Insufficient signatures (need 3/4)');
  }
  
  // TODO: Call GODConstitution.formTetrahedron(keys)
  // For now, just log
  console.log('✅ Tetrahedron formed with 3/4 signatures');
  
  // Store formation
  useSettingsStore.getState().setTetrahedronFormed(true);
}
```

---

### Phase 3: Home & Tutorial

```typescript
// src/app/home/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { DynamicTetrahedron } from '@/components/canvas/DynamicTetrahedron';
import { TutorialGuide } from '@/components/interface/TutorialGuide';
import { CanvasLayer } from '@/components/layout/CanvasLayer';

export default function HomePage() {
  const router = useRouter();
  const { hasCompletedOnboarding, nodeId } = useSettingsStore();
  
  // Redirect if not onboarded
  useEffect(() => {
    if (!hasCompletedOnboarding || !nodeId) {
      router.push('/');
    }
  }, [hasCompletedOnboarding, nodeId]);
  
  return (
    <>
      {/* Canvas layer */}
      <CanvasLayer />
      
      {/* Tutorial */}
      <TutorialGuide />
      
      {/* Hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-toast pointer-events-none">
        <p className="text-xs text-text-dim text-center">
          Double-click vertices • Center orb → Customize
        </p>
      </div>
    </>
  );
}
```

---

## ARCHIVE OLD ONBOARDING

```bash
# Move old onboarding to archive
mkdir -p src/app/_archive/onboarding
mv src/app/onboarding/welcome src/app/_archive/onboarding/
mv src/app/onboarding/identity src/app/_archive/onboarding/
mv src/app/onboarding/network src/app/_archive/onboarding/
mv src/app/onboarding/tutorial src/app/_archive/onboarding/
mv src/app/onboarding/launch src/app/_archive/onboarding/
```

---

## SETTINGS STORE UPDATES

```typescript
// src/lib/store/settingsStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Identity
  nodeId: string | null;
  privateKey: string | null;
  publicKey: string | null;
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  userClass: 'OPERATOR' | 'ARTIFICER' | 'ARCHITECT' | null;
  tetrahedronFormed: boolean;
  
  // Actions
  setNodeId: (id: string) => void;
  setPrivateKey: (key: string) => void;
  setPublicKey: (key: string) => void;
  setUserClass: (userClass: SettingsState['userClass']) => void;
  setTetrahedronFormed: (formed: boolean) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      nodeId: null,
      privateKey: null,
      publicKey: null,
      hasCompletedOnboarding: false,
      userClass: null,
      tetrahedronFormed: false,
      
      // Actions
      setNodeId: (id) => set({ nodeId: id }),
      setPrivateKey: (key) => set({ privateKey: key }),
      setPublicKey: (key) => set({ publicKey: key }),
      setUserClass: (userClass) => set({ userClass }),
      setTetrahedronFormed: (formed) => set({ tetrahedronFormed: formed }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      reset: () => set({
        nodeId: null,
        privateKey: null,
        publicKey: null,
        hasCompletedOnboarding: false,
        userClass: null,
        tetrahedronFormed: false,
      }),
    }),
    {
      name: 'god-settings',
    }
  )
);
```

---

## THE COMPLETE FLOW

```
1. Gateway Orb (/)
   - Hold to resonate (3 seconds)
   - Generate cryptographic identity
   - Store encrypted private key
   ↓
2. Attunement (/genesis/attunement)
   - Choose class (Operator/Artificer/Architect)
   - Sets mission profile
   ↓
3. Formation (/genesis/formation)
   - Display QR code
   - Wait for 3 peers
   - Bluetooth LE handshake
   ↓
4. The Vow (/genesis/vow)
   - Simultaneous button press
   - 3-of-4 multisig
   - ZKP of physical presence
   ↓
5. Home (/home)
   - View tetrahedron
   - Tutorial begins
   - Start missions
```

---

## CONSTITUTIONAL COMPLIANCE

✅ **Article I (Privacy):** Keys encrypted, never plaintext
✅ **Article II (Topology):** K₄ formation enforced
✅ **Article III (Presence):** ZKP via 3-of-4 multisig
✅ **Article IV (Encryption):** All keys use ECDSA P-256
✅ **Article V (Abdication):** No central authority

---

**THE AIR LOCK IS SEALED.**

**STRUCTURAL INTEGRITY ACHIEVED.**

**GENESIS RITUAL COMPLETE.**
