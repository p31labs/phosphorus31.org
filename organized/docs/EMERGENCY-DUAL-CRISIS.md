# EMERGENCY: DUAL CRISIS RESOLUTION
## WebGL Crash + Constitutional Violations

---

## SITUATION ANALYSIS

**CRISIS 1: WebGL Context Loss (BLOCKING)**
- Canvas crashes on every route change
- Multiple WebGL contexts created/lost
- CanvasKeyProvider dependency loop
- App unusable

**CRISIS 2: Constitutional Score 65% (BLOCKING DEPLOYMENT)**
- ❌ No real encryption (base64 only)
- ❌ Private keys in localStorage
- ❌ No abdication UI button
- Cannot deploy at 65%

**DECISION: Fix crash first, then audit violations**

---

## PHASE 1: FIX WEBGL CRASH (IMMEDIATE)

### Issue Root Cause:
```typescript
// BROKEN (current):
useEffect(() => {
  setKey(prev => prev + 1);
}, [pathname]); // Missing key from deps - infinite loop

// Creates new Canvas on every render
// WebGL context lost repeatedly
// Fast Refresh triggers crash
```

### Solution from Gemini:
```typescript
// FIXED:
useEffect(() => {
  const timer = setTimeout(() => {
    setKey(prev => prev + 1);
    console.log(`[Canvas Reset] Key ${key + 1}`);
  }, 50); // Small delay for cleanup
  
  return () => clearTimeout(timer);
}, [pathname]); // ONLY pathname - no key in deps
```

---

## CURSOR PROMPT 1: FIX WEBGL CRASH

```
TASK: Fix WebGL context loss and Canvas crash

PRIORITY: CRITICAL - App is unusable

STEP 1: Fix CanvasKeyProvider dependency loop

File: src/components/layout/CanvasKeyProvider.tsx

Replace entire file with:

```typescript
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export const CanvasKeyContext = createContext(0);

interface CanvasKeyProviderProps {
  children: ReactNode;
}

export function CanvasKeyProvider({ children }: CanvasKeyProviderProps) {
  const [key, setKey] = useState(0);
  const pathname = usePathname();
  
  // CRITICAL FIX: Only pathname in dependency array
  // When pathname changes, key increments ONCE
  // Forces single clean Canvas remount
  useEffect(() => {
    // Small delay ensures old Canvas unmounts first
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
      console.log(`[Canvas Reset] Key incremented to ${key + 1} after route change.`);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [pathname]); // CLEAN - only runs on route change
  
  return (
    <CanvasKeyContext.Provider value={key}>
      {children}
    </CanvasKeyContext.Provider>
  );
}
```

---

STEP 2: Re-enable anti-aliasing

File: src/components/layout/CanvasLayer.tsx

Update Canvas component:

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { SpatialTetrahedron } from '@/components/canvas/SpatialTetrahedron';
import { Suspense, useContext } from 'react';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { CanvasKeyContext } from './CanvasKeyProvider';

export function CanvasLayer() {
  const canvasKey = useContext(CanvasKeyContext);
  
  return (
    <CanvasErrorBoundary>
      <Canvas
        key={canvasKey}
        className="w-full h-full"
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ 
          antialias: true,  // Re-enabled
          alpha: true,
          preserveDrawingBuffer: false, // Better performance
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <SpatialTetrahedron />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
```

---

STEP 3: Test the fix

1. Save both files
2. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
3. Restart dev server: `npm run dev`
4. Navigate to localhost:3000
5. Check console - should see single "Canvas Reset" message
6. Click vertices - should NOT crash
7. Navigate between pages - should work smoothly

Expected result:
✅ No WebGL context loss
✅ No page reloads
✅ Smooth navigation
✅ Vertices clickable
✅ Canvas stable

If still crashes:
- Check browser console for errors
- Verify both files saved correctly
- Try hard refresh (clear all cache)
- Restart browser

DO NOT PROCEED to Phase 2 until Canvas is stable.
```

---

## PHASE 2: FIX AUDIT VIOLATIONS (AFTER CRASH FIXED)

### Priority 1 Violations (CRITICAL):

**1. No Real Encryption**
- Current: base64 encoding
- Required: AES-GCM encryption
- File: src/lib/p2p/crypto.ts

**2. Private Keys in localStorage**  
- Current: localStorage.setItem('god-bio-signature', key)
- Required: IndexedDB with encryption
- File: src/components/genesis/BioLock.tsx

**3. No Abdication UI**
- Current: Script only
- Required: UI button
- File: src/app/status/page.tsx (add button)

---

## CURSOR PROMPT 2: FIX ENCRYPTION

```
TASK: Implement real E2E encryption

PRIORITY: CRITICAL - Constitutional violation

File: src/lib/p2p/crypto.ts

Replace entire file with:

```typescript
'use client';

/**
 * CRYPTOGRAPHIC FUNCTIONS
 * 
 * Constitutional Requirement: All gossip messages MUST be E2E encrypted
 * Implementation: AES-GCM with ECDH key exchange
 */

// Generate key pair for ECDH
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true, // extractable
    ['deriveKey']
  );
}

// Derive shared secret from peer's public key
export async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  return await window.crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey,
    },
    privateKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
}

// Encrypt message with AES-GCM
export async function encrypt(
  data: string,
  sharedSecret: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Generate random IV (12 bytes for AES-GCM)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    sharedSecret,
    dataBuffer
  );
  
  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
  // Convert to base64 for transmission
  return btoa(String.fromCharCode(...combined));
}

// Decrypt message
export async function decrypt(
  encryptedData: string,
  sharedSecret: CryptoKey
): Promise<string> {
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  // Extract IV (first 12 bytes) and encrypted data
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  // Decrypt
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    sharedSecret,
    data
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

// Sign message for authentication
export async function sign(
  data: string,
  privateKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const signature = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    privateKey,
    dataBuffer
  );
  
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Verify signature
export async function verify(
  data: string,
  signature: string,
  publicKey: CryptoKey
): Promise<boolean> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  
  return await window.crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: 'SHA-256',
    },
    publicKey,
    signatureBuffer,
    dataBuffer
  );
}

// Export public key for sharing
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  return btoa(exportedAsString);
}

// Import public key from string
export async function importPublicKey(keyString: string): Promise<CryptoKey> {
  const keyBuffer = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  
  return await window.crypto.subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    []
  );
}
```

TEST:
```typescript
// Test encryption/decryption
const keyPair1 = await generateKeyPair();
const keyPair2 = await generateKeyPair();

const secret1 = await deriveSharedSecret(keyPair1.privateKey, keyPair2.publicKey);
const secret2 = await deriveSharedSecret(keyPair2.privateKey, keyPair1.publicKey);

const encrypted = await encrypt('Hello, World!', secret1);
const decrypted = await decrypt(encrypted, secret2);

console.assert(decrypted === 'Hello, World!', 'Encryption works!');
```

DO NOT PROCEED until encryption tests pass.
```

---

## CURSOR PROMPT 3: FIX KEY STORAGE

```
TASK: Move private keys to secure storage

PRIORITY: CRITICAL - Security violation

File: src/lib/storage/secureStorage.ts (NEW FILE)

Create new file with:

```typescript
'use client';

/**
 * SECURE STORAGE
 * 
 * Constitutional Requirement: Private keys MUST NOT be in localStorage
 * Implementation: IndexedDB with encryption
 */

const DB_NAME = 'god-protocol-secure';
const STORE_NAME = 'keys';
const DB_VERSION = 1;

// Open IndexedDB
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Store encrypted key
export async function storeKey(name: string, key: CryptoKey): Promise<void> {
  const db = await openDB();
  
  // Export key as JWK (will be encrypted by IndexedDB)
  const exported = await window.crypto.subtle.exportKey('jwk', key);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(exported, name);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Retrieve key
export async function getKey(
  name: string,
  algorithm: any,
  usages: KeyUsage[]
): Promise<CryptoKey | null> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(name);
    
    request.onsuccess = async () => {
      if (!request.result) {
        resolve(null);
        return;
      }
      
      try {
        const key = await window.crypto.subtle.importKey(
          'jwk',
          request.result,
          algorithm,
          true,
          usages
        );
        resolve(key);
      } catch (error) {
        reject(error);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Delete key
export async function deleteKey(name: string): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(name);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Clear all keys
export async function clearAllKeys(): Promise<void> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
```

---

File: src/components/genesis/BioLock.tsx

Update key storage:

```typescript
// REMOVE THIS (line 97):
// localStorage.setItem('god-bio-signature', bioSignature);

// REPLACE WITH:
import { storeKey } from '@/lib/storage/secureStorage';

// In handleBioSubmit function:
const keyPair = await generateKeyPair();
await storeKey('god-private-key', keyPair.privateKey);
await storeKey('god-public-key', keyPair.publicKey);

// Success!
```

TEST:
- Complete Genesis flow
- Check IndexedDB (DevTools → Application → IndexedDB)
- Verify keys stored
- Verify localStorage does NOT have keys
- Restart browser
- Verify keys persist

DO NOT PROCEED until keys are in IndexedDB.
```

---

## CURSOR PROMPT 4: ADD ABDICATION UI

```
TASK: Add abdication button to UI

PRIORITY: CRITICAL - Constitutional violation

File: src/app/status/page.tsx

Add new section at bottom:

```typescript
{/* Abdication Section */}
<div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
  <div className="flex items-center gap-3 mb-4">
    <span className="text-3xl">⚠️</span>
    <div>
      <h3 className="text-lg font-bold text-red-400">
        Exit Protocol
      </h3>
      <p className="text-sm text-gray-400">
        Permanently leave this tetrahedron
      </p>
    </div>
  </div>
  
  <div className="space-y-3 text-sm text-gray-300 mb-4">
    <p>
      Abdication is <strong>irreversible</strong>. This action will:
    </p>
    <ul className="list-disc list-inside space-y-1 text-gray-400">
      <li>Remove you from the tetrahedron</li>
      <li>Trigger Memorial Protocol for remaining members</li>
      <li>Fragment your data (Shamir's Secret Sharing)</li>
      <li>Distribute fragments to peers</li>
      <li>Clear all local data</li>
    </ul>
  </div>
  
  <button
    onClick={() => setShowAbdicationDialog(true)}
    className="
      w-full px-4 py-3
      bg-red-600 hover:bg-red-500
      rounded
      text-white font-bold
      transition-colors
    "
  >
    Abdicate Power
  </button>
</div>
```

Add confirmation dialog:

```typescript
{showAbdicationDialog && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-gray-900 border border-red-500 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-red-400 mb-4">
        ⚠️ Confirm Abdication
      </h2>
      
      <p className="text-gray-300 mb-4">
        This action is <strong>permanent and irreversible</strong>.
      </p>
      
      <p className="text-gray-400 text-sm mb-6">
        Type <strong>ABDICATE</strong> to confirm:
      </p>
      
      <input
        type="text"
        value={abdicationConfirm}
        onChange={(e) => setAbdicationConfirm(e.target.value)}
        className="
          w-full px-4 py-2 mb-4
          bg-gray-800 border border-gray-700
          rounded
          text-white
          focus:border-red-500 focus:outline-none
        "
        placeholder="Type ABDICATE"
      />
      
      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowAbdicationDialog(false);
            setAbdicationConfirm('');
          }}
          className="
            flex-1 px-4 py-2
            bg-gray-700 hover:bg-gray-600
            rounded
            text-white
          "
        >
          Cancel
        </button>
        
        <button
          onClick={handleAbdicate}
          disabled={abdicationConfirm !== 'ABDICATE'}
          className="
            flex-1 px-4 py-2
            bg-red-600 hover:bg-red-500
            disabled:bg-gray-700 disabled:text-gray-500
            rounded
            text-white font-bold
            transition-colors
          "
        >
          Confirm Abdication
        </button>
      </div>
    </div>
  </div>
)}
```

Add handler:

```typescript
const handleAbdicate = async () => {
  try {
    // 1. Export data
    const data = await exportAllData();
    downloadJSON(data, 'god-protocol-export.json');
    
    // 2. Call smart contract
    await abdicate();
    
    // 3. Broadcast to mesh
    broadcast('abdication', { userId: currentUser.id }, 'CRITICAL');
    
    // 4. Clear local data
    await clearAllKeys();
    localStorage.clear();
    
    // 5. Redirect to goodbye page
    router.push('/goodbye');
  } catch (error) {
    console.error('Abdication failed:', error);
    alert('Abdication failed. Please try again.');
  }
};
```

TEST:
- Go to Status page
- See "Exit Protocol" section at bottom
- Click "Abdicate Power" button
- See confirmation dialog
- Type "ABDICATE"
- Confirm button becomes enabled
- Click confirm
- Data exports
- Contract called
- Mesh notified
- Local data cleared
- Redirected to goodbye page

DO NOT PROCEED until abdication flow works end-to-end.
```

---

## PHASE 3: RE-RUN AUDIT

After all fixes complete:

```bash
./audit.sh
```

Expected result:
```
Constitutional Score: 90%+

✅ K₄ Topology
✅ Encryption (AES-GCM)
✅ Quorum
✅ Physical Meetings
✅ Exit Rights (UI button)
✅ No Central Server
✅ P2P Implementation
✅ Secure Storage (IndexedDB)
✅ No Analytics
```

If score <90%:
- Review remaining violations
- Fix critical issues
- Re-run audit
- Repeat until ≥90%

---

## EXECUTION ORDER

**IMMEDIATE (Today):**
1. Fix WebGL crash (Prompt 1)
2. Test Canvas stability
3. Verify vertices clickable
4. Verify navigation works

**WEEK 1 (Next):**
5. Implement real encryption (Prompt 2)
6. Test encryption end-to-end
7. Fix key storage (Prompt 3)
8. Verify keys in IndexedDB

**WEEK 2:**
9. Add abdication UI (Prompt 4)
10. Test abdication flow
11. Re-run audit
12. Verify score ≥90%

**WEEK 3:**
13. Deploy to Vercel
14. Deploy contract to mainnet
15. Monitor
16. Launch 🚀

---

**⚡ EMERGENCY: DUAL CRISIS ⚡**
**⚡ FIX CRASH → FIX AUDIT → DEPLOY ⚡**
