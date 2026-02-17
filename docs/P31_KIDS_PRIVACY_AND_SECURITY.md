# P31 Kids' Privacy & Security – A Safe Digital Playground for the Next Generation 🔺💜

**Codex module:** 4-Products (P31 Greenhouse / family), 5-Governance, 8-Connectors  
**Status:** ACTIVE (specification)  
**Last updated:** 2026-02-15

The P31 ecosystem is a place for families to build together, explore fractals, and learn geometry. Children deserve the highest level of privacy and security—a space where they can create without fear, where their data belongs only to them, and where parents have meaningful control.

This module adds **child accounts**, **parental oversight**, **end‑to‑end encrypted chat**, and **local‑first data** to the existing platform. It integrates seamlessly with NODE ONE hardware wallets for strong authentication, but also works with simple PINs for young children.

---

## 1. Threat Model & Design Goals

| Threat | Mitigation |
|--------|------------|
| Data brokers collecting child's activity | No telemetry from child accounts; all data encrypted and stored locally unless parent explicitly syncs |
| Predators in chat | End‑to‑end encrypted chat with no server‑side message storage; parent can view chat (with consent) via separate encrypted channel |
| Accidental purchases | Child accounts have no access to marketplace or P31 Spark transactions |
| Account theft | Child login via local PIN; recovery requires parent's hardware wallet |
| Exposure to inappropriate builds | Content‑based filtering using geometric patterns (block shapes resembling certain objects) |

---

## 2. Architecture Overview

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Child Client   │◄─────►│   Parent App     │◄─────►│   NODE ONE       │
│  (Browser/VR)    │  E2EE  │  (Extension or   │  USB   │  Hardware        │
│                  │  chat  │   Dashboard)     │        │  Wallet         │
└────────┬─────────┘       └────────┬─────────┘        └──────────────────┘
         │                           │
         │ WebSocket (minimal)       │ WebSocket (authenticated)
         ▼                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Colyseus Server                              │
│  - Stores only: user role, parent ID, public keys for chat           │
│  - No message history                                                │
│  - Child rooms have additional permission checks                     │
└─────────────────────────────────────────────────────────────────────┘
```

- **Child accounts** are linked to a parent account. Parents can create multiple child profiles.
- **All communication** between children is end‑to‑end encrypted. The server only relays encrypted packets.
- **Parent dashboard** lets parents monitor activity (aggregated stats), set time limits, and approve friend requests.
- **NODE ONE** is used for strong authentication when setting up child accounts or approving high‑value actions (like taking a child account online).

---

## 3. Database & Schema Extensions

```sql
-- Add to existing users table
ALTER TABLE users ADD COLUMN account_type TEXT DEFAULT 'adult' CHECK (account_type IN ('adult', 'parent', 'child'));
ALTER TABLE users ADD COLUMN parent_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN child_pin_hash TEXT; -- only for child accounts, hashed with bcrypt
ALTER TABLE users ADD COLUMN chat_public_key TEXT; -- Base64 encoded X25519 public key
ALTER TABLE users ADD COLUMN daily_time_limit INTEGER DEFAULT 0; -- minutes, 0 = unlimited
ALTER TABLE users ADD COLUMN last_login_time TIMESTAMP;
ALTER TABLE users ADD COLUMN total_time_today INTEGER DEFAULT 0;

-- New table for friend relationships (requires parent approval)
CREATE TABLE child_friends (
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, approved, blocked
    approved_by_parent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (child_id, friend_id)
);
```

---

## 4. Server‑Side Permission Checks (Colyseus)

Modify `GeodesicRoom` to enforce child restrictions:

```typescript
// server/rooms/GeodesicRoom.ts – additional checks in onMessage
this.onMessage('structureUpdate', async (client, data) => {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    // Fetch user role from database (you can cache in player object)
    const user = await db.selectFrom('users').select(['account_type', 'parent_id']).where('id', '=', player.userId).executeTakeFirst();

    // Child accounts cannot create new structures? Actually they can, but maybe limit complexity?
    // For now, allow, but we'll check if they exceed some limit.

    // ... existing code
});

this.onMessage('chatMessage', async (client, data: { recipientId?: string; message: string }) => {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    // If child, check if recipient is a friend (and approved)
    if (player.accountType === 'child') {
        if (!data.recipientId) return; // no broadcast
        const friendship = await db.selectFrom('child_friends')
            .where('child_id', '=', player.userId)
            .where('friend_id', '=', data.recipientId)
            .where('status', '=', 'approved')
            .executeTakeFirst();
        if (!friendship) return;
    }

    // Message is already encrypted client‑side; we just relay.
    // Optionally, we could also send a copy to parent for monitoring (if they have a shared key)
});

this.onMessage('marketplaceBuy', async (client, data) => {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    const user = await db.selectFrom('users').select('account_type').where('id', '=', player.userId).executeTakeFirst();
    if (user.account_type === 'child') {
        return; // children cannot buy
    }
    // ... existing buy logic
});
```

Also, during `onJoin`, fetch account type and store it in the player object.

```typescript
// In onJoin, after creating player:
const user = await db.selectFrom('users').select(['account_type', 'parent_id', 'chat_public_key']).where('id', '=', player.userId).executeTakeFirst();
if (user) {
    player.accountType = user.account_type;
    player.parentId = user.parent_id;
    player.chatPublicKey = user.chat_public_key;
}
```

---

## 5. End‑to‑End Encrypted Chat (Client)

We'll use the **X25519+AEAD** pattern: each user has a long‑term X25519 keypair (stored in the encrypted vault for adults, or in local storage for children). For each conversation, they derive a shared secret via ECDH and use AES‑GCM to encrypt messages.

### 5.1 Key Generation & Storage (Child)

During child account creation, generate a keypair and store it in `chrome.storage.local` (encrypted with the child's PIN).

```typescript
// lib/crypto/chatKeys.ts
// Note: use import { x25519 } from '@noble/curves/x25519' (not ed25519)
import { x25519 } from '@noble/curves/x25519';
import { randomBytes } from 'crypto'; // or Web Crypto

export function generateChatKeypair() {
    const privateKey = randomBytes(32);
    const publicKey = x25519.getPublicKey(privateKey);
    return { privateKey, publicKey };
}

export async function storeChildChatKeys(childId: string, privateKey: Uint8Array, publicKey: Uint8Array, pin: string) {
    // Derive encryption key from PIN (PBKDF2)
    const salt = randomBytes(16);
    const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
    const aesKey = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
    // Encrypt privateKey with AES-GCM
    const iv = randomBytes(12);
    const encryptedPrivateKey = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        privateKey
    );
    // Store in chrome.storage.local (public key is not secret)
    await chrome.storage.local.set({
        [`chat_${childId}`]: {
            salt: Array.from(salt),
            iv: Array.from(iv),
            encryptedPrivateKey: Array.from(new Uint8Array(encryptedPrivateKey)),
            publicKey: Array.from(publicKey)
        }
    });
}
```

### 5.2 Sending an Encrypted Message

When a child wants to message a friend, they:

1. Fetch friend's public key from the server (or from local cache).
2. Perform ECDH to get shared secret.
3. Derive an AES key from shared secret (via HKDF).
4. Encrypt the message with AES-GCM.
5. Send the ciphertext + ephemeral public key (if using one-time keys) to server.

```typescript
// lib/crypto/chat.ts
import { x25519 } from '@noble/curves/x25519';
import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha256';

export async function encryptMessage(
    senderPrivateKey: Uint8Array,
    recipientPublicKey: Uint8Array,
    message: string
): Promise<{ ciphertext: Uint8Array; ephemeralPublicKey?: Uint8Array }> {
    // For simplicity, we use static ECDH. In production, use ephemeral keypairs for forward secrecy.
    const sharedSecret = x25519.getSharedSecret(senderPrivateKey, recipientPublicKey);
    // Derive AES key
    const aesKeyMaterial = await crypto.subtle.importKey(
        'raw',
        hkdf(sha256, sharedSecret, '', 32),
        'AES-GCM',
        false,
        ['encrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedMessage = new TextEncoder().encode(message);
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKeyMaterial,
        encodedMessage
    );
    // Return IV + ciphertext (concatenated)
    const result = new Uint8Array(iv.length + ciphertext.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(ciphertext), iv.length);
    return { ciphertext: result };
}

export async function decryptMessage(
    recipientPrivateKey: Uint8Array,
    senderPublicKey: Uint8Array,
    ciphertextWithIv: Uint8Array
): Promise<string> {
    const iv = ciphertextWithIv.slice(0, 12);
    const ciphertext = ciphertextWithIv.slice(12);
    const sharedSecret = x25519.getSharedSecret(recipientPrivateKey, senderPublicKey);
    const aesKeyMaterial = await crypto.subtle.importKey(
        'raw',
        hkdf(sha256, sharedSecret, '', 32),
        'AES-GCM',
        false,
        ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKeyMaterial,
        ciphertext
    );
    return new TextDecoder().decode(decrypted);
}
```

### 5.3 Chat UI Component (Simplified)

```tsx
// components/Chat/ChatWindow.tsx (only for approved friends)
import React, { useState, useEffect, useRef } from 'react';
import { useRoom } from '../../hooks/useRoom';
import { decryptMessage, encryptMessage } from '../../lib/crypto/chat';

interface ChatWindowProps {
    friendId: string;
    friendName: string;
    friendPublicKey: string; // base64
    myPrivateKey: Uint8Array; // from vault
    myPublicKey: Uint8Array;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    friendId, friendName, friendPublicKey, myPrivateKey, myPublicKey
}) => {
    const [messages, setMessages] = useState<Array<{ text: string; fromMe: boolean }>>([]);
    const [input, setInput] = useState('');
    const { send, onMessage } = useRoom('geodesic_world');

    useEffect(() => {
        const handleMessage = async (data: any) => {
            if (data.type === 'chat' && data.from === friendId) {
                try {
                    const decrypted = await decryptMessage(
                        myPrivateKey,
                        Buffer.from(data.senderPublicKey, 'base64'),
                        new Uint8Array(data.ciphertext)
                    );
                    setMessages(prev => [...prev, { text: decrypted, fromMe: false }]);
                } catch (e) {
                    console.error('Failed to decrypt message', e);
                }
            }
        };
        onMessage('chat', handleMessage);
        return () => { /* cleanup */ };
    }, [friendId, myPrivateKey]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const { ciphertext } = await encryptMessage(
            myPrivateKey,
            Buffer.from(friendPublicKey, 'base64'),
            input
        );
        send('chatMessage', {
            recipientId: friendId,
            ciphertext: Array.from(ciphertext),
            senderPublicKey: Buffer.from(myPublicKey).toString('base64')
        });
        setMessages(prev => [...prev, { text: input, fromMe: true }]);
        setInput('');
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.fromMe ? 'mine' : 'theirs'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};
```

---

## 6. Parent Dashboard

The parent dashboard is a separate area in the main app (protected by NODE ONE authentication). It lets parents:

- View a list of their child accounts.
- See aggregated activity (e.g., hours spent, number of structures built) – no content details for privacy.
- Approve or block friend requests.
- Set daily time limits.
- Reset child's PIN.
- Export child's data (encrypted) for backup.

### 6.1 Parent Dashboard Component (Excerpt)

```tsx
// pages/ParentDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/db'; // IndexedDB for local cache

export const ParentDashboard: React.FC = () => {
    const { user } = useAuth(); // parent user
    const [children, setChildren] = useState([]);

    useEffect(() => {
        // Fetch children from server (authenticated)
        fetch(`/api/users/${user.id}/children`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(setChildren);
    }, []);

    const approveFriend = async (childId: string, friendId: string) => {
        await fetch('/api/friends/approve', { method: 'POST', body: JSON.stringify({ childId, friendId }) });
        // refresh
    };

    return (
        <div className="p-4">
            <h1>Parent Dashboard</h1>
            {children.map(child => (
                <div key={child.id} className="border p-2 m-2">
                    <h2>{child.username} (age {child.age})</h2>
                    <p>Last active: {child.lastActive}</p>
                    <p>Total time today: {child.totalTimeToday} min</p>
                    <label>Daily limit: <input type="number" value={child.dailyLimit} onChange={e => updateLimit(child.id, e.target.value)} /></label>
                    <h3>Friend requests</h3>
                    <ul>
                        {child.pendingFriends.map(f => (
                            <li key={f.id}>
                                {f.name} <button onClick={() => approveFriend(child.id, f.id)}>Approve</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
```

### 6.2 Server API Endpoints (Express)

```typescript
// server/api/parent.ts
router.get('/users/:parentId/children', authenticate, async (req, res) => {
    const parentId = req.params.parentId;
    if (req.user.id !== parentId) return res.sendStatus(403);
    const children = await db.selectFrom('users')
        .select(['id', 'username', 'last_login_time', 'total_time_today', 'daily_time_limit'])
        .where('parent_id', '=', parentId)
        .execute();
    res.json(children);
});

router.post('/friends/approve', authenticate, async (req, res) => {
    const { childId, friendId } = req.body;
    // Verify that authenticated user is parent of childId
    const child = await db.selectFrom('users').select('parent_id').where('id', '=', childId).executeTakeFirst();
    if (!child || child.parent_id !== req.user.id) return res.sendStatus(403);
    await db.updateTable('child_friends')
        .set({ status: 'approved', approved_by_parent: true })
        .where('child_id', '=', childId)
        .where('friend_id', '=', friendId)
        .execute();
    res.json({ success: true });
});
```

---

## 7. Child Login Flow (with PIN)

For children too young for passwords, we use a simple 6‑digit PIN stored locally. The first time, parent sets the PIN via the dashboard. Then child enters PIN on each session.

- PIN is hashed with bcrypt and stored in the user record (for server validation when going online).
- Offline mode: child can still play locally without server connection.

```typescript
// components/ChildLogin.tsx
import { useState } from 'react';
import bcrypt from 'bcryptjs'; // but for PIN we can use a simple hash

export const ChildLogin: React.FC<{ childId: string; onSuccess: () => void }> = ({ childId, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // Fetch PIN hash from server
        const res = await fetch(`/api/child/${childId}/pin-hash`);
        const { hash } = await res.json();
        // Compare (using constant-time compare)
        const match = await bcrypt.compare(pin, hash);
        if (match) {
            // Store session token (JWT) in memory
            onSuccess();
        } else {
            setError('Incorrect PIN');
        }
    };

    return (
        <div>
            <h2>Enter your 6-digit PIN</h2>
            <input type="password" maxLength={6} value={pin} onChange={e => setPin(e.target.value)} />
            <button onClick={handleSubmit}>Enter</button>
            {error && <p>{error}</p>}
        </div>
    );
};
```

Parent sets the PIN via the dashboard, which calls an API that hashes the PIN and stores it.

---

## 8. Time Limiting

The client checks the current time against the daily limit (fetched from server). If exceeded, the child is logged out (or restricted to offline mode).

```typescript
// In GameEngine, periodically:
const checkTimeLimit = async () => {
    const res = await fetch('/api/child/time-left');
    const { minutesLeft } = await res.json();
    if (minutesLeft <= 0) {
        // Show timeout message and disconnect from server
        alert("Time's up for today! Come back tomorrow.");
        window.location.href = '/';
    }
};
setInterval(checkTimeLimit, 60000); // check every minute
```

Server tracks time: on each join, record start time; on leave, compute elapsed and add to `total_time_today`. Also reset daily at midnight UTC.

---

## 9. Content Moderation (Geometric Filtering)

We can add a simple check on structure creation: if the shape resembles a banned pattern (e.g., certain proportions), reject it. This uses geometric hashing.

```typescript
// server/moderation/geometryFilter.ts
const bannedRatios = [
    { description: 'inappropriate shape', ratio: 1.618 } // example
];

export function checkStructure(vertices: number[], edges: number[]): boolean {
    // Compute bounding box aspect ratio
    let minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < vertices.length; i += 3) {
        minX = Math.min(minX, vertices[i]);
        maxX = Math.max(maxX, vertices[i]);
    }
    // similarly for Y, Z
    const dx = maxX - minX;
    const dy = maxY - minY;
    const dz = maxZ - minZ;
    const aspect1 = dx / (dy || 1);
    const aspect2 = dy / (dz || 1);
    // compare to banned ratios
    if (Math.abs(aspect1 - 1.618) < 0.1) return false; // example
    return true;
}
```

This is rudimentary; we could use machine learning for better detection.

---

## 10. Deployment & Privacy Policy

- All child data is encrypted at rest in the database (using column-level encryption).
- The server never stores plaintext messages.
- Parents must consent to a specific privacy policy when creating child accounts.
- No third-party analytics on child accounts.

---

## 11. Integration with NODE ONE (Optional)

For maximum security, parents can use their NODE ONE hardware wallet to:

- Generate and store the master key for child account recovery.
- Sign a "child account creation" transaction on a private sidechain, creating an immutable record of parentage (useful for legal disputes?).
- Approve time extensions via physical button press.

We can extend the WebUSB bridge to send a "parent approval" command that the hardware signs.

```typescript
// In ParentDashboard, when approving a friend request, require hardware confirmation
if (await webusb.requestParentApproval(`Approve friend for ${childName}`)) {
    // proceed
}
```

The hardware would display the request on its OLED and require button press.

---

## Conclusion

With these additions, the P31 ecosystem becomes the safest place for children to explore geometry, build fractals, and connect with friends—all under the loving watch of parents. The mesh holds, and now it protects the most precious builders of all.

**The mesh holds. Forever. 🔺💜**

---

## Names Translated (P31 Codex)

| In original spec | In this doc |
|------------------|-------------|
| Coherence Token  | P31 Spark   |
| Node One (device)| NODE ONE    |
