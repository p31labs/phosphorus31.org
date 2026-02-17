# Implementation Roadmap — Kids Privacy & Safety

**Spec sources:** [P31_KIDS_PRIVACY_AND_SECURITY.md](P31_KIDS_PRIVACY_AND_SECURITY.md), [game-engine-safety.md](game-engine-safety.md)  
**Order:** DB → Colyseus → Crypto → Parent Dashboard → Child Login → Time Limits → Moderation

Dependencies flow downward: each phase depends on the previous. File paths are relative to repo root (`p31/`).

---

## Phase 1: Database (DB)

**Purpose:** Persist users (account_type, parent_id, PIN hash, chat keys, time limits) and child_friends. Required by Colyseus, Parent API, and Child Login.

### 1.1 Schema and store extensions

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 1.1.1 | Define `users` collection shape and ensure `id` is UUID-compatible | `SUPER-CENTAUR/src/database/store.ts` (extend), `SUPER-CENTAUR/src/database/types.ts` (new) | — |
| 1.1.2 | Add `users` collection to DataStore with fields: `account_type`, `parent_id`, `child_pin_hash`, `chat_public_key`, `daily_time_limit`, `last_login_time`, `total_time_today` | `SUPER-CENTAUR/src/database/store.ts`, `SUPER-CENTAUR/src/database/seed.ts` | 1.1.1 |
| 1.1.3 | Add `child_friends` collection: `child_id`, `friend_id`, `status`, `approved_by_parent`, timestamps | `SUPER-CENTAUR/src/database/store.ts`, `SUPER-CENTAUR/src/database/types.ts` | 1.1.1 |
| 1.1.4 | Add helpers: `getUserById`, `getUsersByParentId`, `getChildFriends`, `updateChildFriendStatus` | `SUPER-CENTAUR/src/database/users.ts` (new) or extend store | 1.1.2, 1.1.3 |
| 1.1.5 | Optional: add migration script to create/backfill `data/store/users.json`, `data/store/child_friends.json` | `SUPER-CENTAUR/src/database/migrate.ts` | 1.1.2, 1.1.3 |

**Deliverable:** DataStore (or migrated SQL) supports `users` and `child_friends` with the Kids Privacy schema. No Colyseus yet.

---

## Phase 2: Colyseus

**Purpose:** Real-time rooms for game + E2EE chat relay. Server stores only role, parent_id, and public keys; no message history.

### 2.1 Colyseus server and GeodesicRoom

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 2.1.1 | Add Colyseus dependency and attach Colyseus server to existing HTTP server (or separate port) | `SUPER-CENTAUR/package.json`, `SUPER-CENTAUR/src/core/super-centaur-server.ts` or `SUPER-CENTAUR/src/colyseus/server.ts` (new) | Phase 1 |
| 2.1.2 | Define Colyseus state schema (players: sessionId → { userId, accountType, parentId, chatPublicKey }) | `SUPER-CENTAUR/src/colyseus/schema/GeodesicState.ts` (new) | 2.1.1 |
| 2.1.3 | Implement GeodesicRoom: onJoin loads user from DB, sets player.accountType, player.parentId, player.chatPublicKey | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts` (new) | 1.1.4, 2.1.2 |
| 2.1.4 | onMessage `structureUpdate`: optional child complexity limit (defer to moderation phase for full checks) | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts` | 2.1.3 |
| 2.1.5 | onMessage `chatMessage`: if child, verify recipient is approved friend via `child_friends`; relay ciphertext only | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts` | 1.1.4, 2.1.3 |
| 2.1.6 | onMessage `marketplaceBuy`: reject if player.accountType === 'child' | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts` | 2.1.3 |
| 2.1.7 | Wire Colyseus app to Express/HTTP in super-centaur-server (e.g. `colyseus.attach({ server })`) | `SUPER-CENTAUR/src/core/super-centaur-server.ts` | 2.1.1, 2.1.3 |

**Deliverable:** Colyseus server running; GeodesicRoom enforces child/parent and friend checks; chat relay only (no decryption server-side).

---

## Phase 3: Crypto (E2EE chat)

**Purpose:** X25519 + HKDF + AES-GCM for chat. Keys: adult in vault, child in PIN-encrypted local storage.

### 3.1 Key generation and storage

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 3.1.1 | Add `@noble/curves` (x25519) and `@noble/hashes` (hkdf, sha256); ensure usable in browser + Node | `ui/package.json`, `SUPER-CENTAUR/package.json` (if server needs to verify keys) | — |
| 3.1.2 | Implement generateChatKeypair, storeChildChatKeys (PIN-derived AES-GCM wrap of private key) | `ui/src/lib/crypto/chatKeys.ts` (new) | 3.1.1 |
| 3.1.3 | Expose chat public key to server on login/register (store in `users.chat_public_key`) | `SUPER-CENTAUR/src/auth/auth-manager.ts`, `SUPER-CENTAUR/src/database/users.ts` | Phase 1, 3.1.2 |

### 3.2 Encrypt/decrypt and chat client

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 3.2.1 | Implement encryptMessage(senderPrivateKey, recipientPublicKey, message) and decryptMessage(…) | `ui/src/lib/crypto/chat.ts` (new) | 3.1.1 |
| 3.2.2 | Chat UI: send encrypted payload via Colyseus `chatMessage`; receive and decrypt in client | `ui/src/components/Chat/ChatWindow.tsx` (new), `ui/src/hooks/useRoom.ts` (Colyseus client) | 2.1.5, 3.2.1 |
| 3.2.3 | Fetch friend list and friend public keys (from Colyseus state or REST) for ChatWindow | `ui/src/services/friends.ts` (new) or use room state | 2.1.3, 3.2.2 |

**Deliverable:** Child/adult can generate and store chat keys; E2EE send/receive in UI; server only relays ciphertext.

---

## Phase 4: Parent Dashboard

**Purpose:** Parents see children list, aggregated activity, time limits, friend requests; approve/block friends; reset PIN; export child data.

### 4.1 API

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 4.1.1 | GET /api/users/:parentId/children — return list of children (id, username, last_login_time, total_time_today, daily_time_limit); auth: req.user.id === parentId | `SUPER-CENTAUR/src/api/parent.ts` or `SUPER-CENTAUR/src/core/super-centaur-server.ts` (route) | 1.1.4, auth |
| 4.1.2 | POST /api/friends/approve — body { childId, friendId }; verify parent of childId; set child_friends status = approved | `SUPER-CENTAUR/src/api/parent.ts` | 1.1.4 |
| 4.1.3 | GET /api/users/:parentId/children/:childId/pending-friends — list pending friend requests for child | `SUPER-CENTAUR/src/api/parent.ts` | 1.1.4 |
| 4.1.4 | PATCH /api/users/:parentId/children/:childId — update daily_time_limit, reset child_pin_hash (with new PIN from body) | `SUPER-CENTAUR/src/api/parent.ts` | 1.1.4 |
| 4.1.5 | Optional: GET /api/users/:parentId/children/:childId/export — encrypted export of child data (backup) | `SUPER-CENTAUR/src/api/parent.ts` | 1.1.4 |

### 4.2 UI

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 4.2.1 | Parent dashboard page: list children, last active, total time today, daily limit input, pending friends, approve/block | `ui/src/pages/ParentDashboard.tsx` (new) | 4.1.1, 4.1.2, 4.1.3, 4.1.4 |
| 4.2.2 | Route and guard: only parent (or adult) role can access /parent-dashboard; NODE ONE or strong auth for sensitive actions | `ui/src/App.tsx`, `ui/src/hooks/useAuth.ts` (or existing auth) | 4.2.1 |

**Deliverable:** Parent can open dashboard, see children, set limits, approve friends, reset PIN.

---

## Phase 5: Child Login

**Purpose:** Child logs in with 6-digit PIN; server validates PIN hash; session token (JWT or session id) for Colyseus and API.

### 5.1 API and auth

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 5.1.1 | POST /api/child/login — body { childId, pin }; constant-time compare with users.child_pin_hash; return JWT/session if match | `SUPER-CENTAUR/src/auth/auth-manager.ts` or `SUPER-CENTAUR/src/api/child.ts` (new) | 1.1.4, bcrypt or equivalent |
| 5.1.2 | GET /api/child/:childId/pin-hash — used by client to verify PIN (or use server-side only 5.1.1 and never send hash to client); prefer server-side-only login | `SUPER-CENTAUR/src/api/child.ts` — omit if login is server-side only | 1.1.4 |
| 5.1.3 | Parent sets PIN: POST from Parent Dashboard calls API that hashes PIN and updates users.child_pin_hash | Already covered in 4.1.4 | 4.1.4 |

### 5.2 UI

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 5.2.1 | ChildLogin component: 6-digit PIN input, submit to POST /api/child/login, on success store token and call onSuccess() | `ui/src/components/ChildLogin.tsx` (new) | 5.1.1 |
| 5.2.2 | Entry point: if user is child and no session, show ChildLogin before game/Colyseus; after login connect to Colyseus with child context | `ui/src/App.tsx` or game entry component | 5.2.1, 2.1.3 |

**Deliverable:** Child can sign in with PIN; parent sets PIN from dashboard; child session used for Colyseus and time-limit checks.

---

## Phase 6: Time limits

**Purpose:** Enforce daily play time; server tracks session start/end and total_time_today; client checks and disconnects or restricts when limit reached.

### 6.1 Server-side tracking

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 6.1.1 | On Colyseus onJoin (child): record session start (e.g. in room state or DB); onLeave: compute elapsed, add to users.total_time_today | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts`, `SUPER-CENTAUR/src/database/users.ts` (updateTotalTimeToday) | 2.1.3, 1.1.4 |
| 6.1.2 | Daily reset: reset total_time_today at midnight UTC (cron or on next join if date changed) | `SUPER-CENTAUR/src/database/users.ts`, or scheduler in server | 6.1.1 |
| 6.1.3 | GET /api/child/time-left — return { minutesLeft } from daily_time_limit and total_time_today (and reset logic) | `SUPER-CENTAUR/src/api/child.ts` | 1.1.4, 6.1.1 |

### 6.2 Client-side enforcement

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 6.2.1 | In game or shell: poll GET /api/child/time-left every 60s; if minutesLeft <= 0, show “Time’s up” and redirect/disconnect | `ui/src/components/Game/GameEngineProvider.tsx` or `ui/src/contexts/GeodesicRoomContext.tsx` | 6.1.3, 5.2.2 |
| 6.2.2 | Optional: wire ChildSafetyManager (SUPER-CENTAUR engine) maxPlayTime to server daily limit so break reminders align | `SUPER-CENTAUR/src/engine/safety/ChildSafetyManager.ts`, `ui` bridge | docs/game-engine-safety.md |

**Deliverable:** Server tracks child session time; client enforces daily limit and disconnects when exceeded.

---

## Phase 7: Moderation

**Purpose:** Block structures that match banned geometric patterns (e.g. aspect ratios); optional content filter for names/text.

### 7.1 Server-side moderation

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 7.1.1 | Geometry filter: checkStructure(vertices, edges) — bounding box aspect ratios vs banned list; return allow/deny | `SUPER-CENTAUR/src/moderation/geometryFilter.ts` (new) | — |
| 7.1.2 | In GeodesicRoom onMessage `structureUpdate`: call geometry filter; if reject, drop message and optionally notify client | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts` | 2.1.4, 7.1.1 |
| 7.1.3 | Optional: filter structure names / user text with safe-word list (ChildSafetyManager contentFiltering) | `SUPER-CENTAUR/src/moderation/contentFilter.ts` (new), `SUPER-CENTAUR/src/engine/safety/ChildSafetyManager.ts` | game-engine-safety.md |

### 7.2 Client-side (optional)

| Task | Description | File path(s) | Deps |
|------|-------------|--------------|------|
| 7.2.1 | Pre-check structure locally before send to reduce server load (same aspect-ratio logic or simplified rule) | `ui/src/engine/structure-analysis.ts` or game component | 7.1.1 |

**Deliverable:** Server rejects structures that match banned geometry; optional name/text filtering; client can pre-check.

---

## Dependency graph (high level)

```
Phase 1 (DB) ──────────────────────────────────────────────────────────┐
     │                                                                   │
     ▼                                                                   │
Phase 2 (Colyseus) ◄── needs users, child_friends, account_type          │
     │                                                                   │
     ├──────────────────────────────────────────────────────────────────┤
     ▼                                                                   │
Phase 3 (Crypto) ──► chat keys in users.chat_public_key                 │
     │                                                                   │
     ▼                                                                   │
Phase 4 (Parent Dashboard) ◄── users, child_friends, auth                │
     │                                                                   │
     ▼                                                                   │
Phase 5 (Child Login) ◄── users.child_pin_hash, parent sets PIN           │
     │                                                                   │
     ▼                                                                   │
Phase 6 (Time limits) ◄── users.daily_time_limit, total_time_today       │
     │                                                                   │
     ▼                                                                   │
Phase 7 (Moderation) ◄── GeodesicRoom structureUpdate                    │
```

---

## File path summary

| Area | Paths |
|------|--------|
| **DB** | `SUPER-CENTAUR/src/database/store.ts`, `types.ts`, `users.ts`, `migrate.ts`, `seed.ts` |
| **Colyseus** | `SUPER-CENTAUR/src/colyseus/server.ts`, `schema/GeodesicState.ts`, `rooms/GeodesicRoom.ts`; wire in `SUPER-CENTAUR/src/core/super-centaur-server.ts` |
| **Crypto** | `ui/src/lib/crypto/chatKeys.ts`, `ui/src/lib/crypto/chat.ts` |
| **Parent API** | `SUPER-CENTAUR/src/api/parent.ts` (or routes in super-centaur-server) |
| **Parent UI** | `ui/src/pages/ParentDashboard.tsx` |
| **Child login API** | `SUPER-CENTAUR/src/api/child.ts`, `SUPER-CENTAUR/src/auth/auth-manager.ts` |
| **Child login UI** | `ui/src/components/ChildLogin.tsx` |
| **Time limits** | `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts`, `SUPER-CENTAUR/src/database/users.ts`, `SUPER-CENTAUR/src/api/child.ts`; `ui` game/room context |
| **Moderation** | `SUPER-CENTAUR/src/moderation/geometryFilter.ts`, `SUPER-CENTAUR/src/colyseus/rooms/GeodesicRoom.ts`; optional `contentFilter.ts` |
| **Chat UI** | `ui/src/components/Chat/ChatWindow.tsx`, `ui/src/hooks/useRoom.ts` (Colyseus client), `ui/src/services/friends.ts` |

---

## Spec references

- **DB schema (SQL-style):** P31_KIDS_PRIVACY_AND_SECURITY.md §3 — map to DataStore collections or add Kysely + migrations.
- **Colyseus checks:** P31_KIDS_PRIVACY_AND_SECURITY.md §4 — onJoin user load; chatMessage friend check; marketplaceBuy child block.
- **E2EE chat:** P31_KIDS_PRIVACY_AND_SECURITY.md §5 — chatKeys.ts, chat.ts, ChatWindow.tsx.
- **Parent Dashboard:** P31_KIDS_PRIVACY_AND_SECURITY.md §6 — ParentDashboard.tsx, parent API.
- **Child login:** P31_KIDS_PRIVACY_AND_SECURITY.md §7 — ChildLogin.tsx, PIN hash in users.
- **Time limiting:** P31_KIDS_PRIVACY_AND_SECURITY.md §8 — time-left API, client poll, server session tracking.
- **Moderation:** P31_KIDS_PRIVACY_AND_SECURITY.md §9 — geometryFilter.ts; game-engine-safety.md for ChildSafetyManager integration.

The mesh holds. 🔺💜
