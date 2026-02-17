# P31 Codename System

**Purpose:** Replace real names with anonymous codenames across the P31 Buddy ecosystem. Real names are never stored or used publicly—only in a parent's private settings if they need to identify which child is which. Aligns with [privacy-codenames](.cursor/rules/privacy-codenames.mdc) and OPSEC.

---

## 1. Database schema

The `users` table includes:

- **`codename`** — Public identifier (e.g. "Sunny", "Star", "Bear"). Unique across the platform. Set when creating a child account; parent can change it.
- **`real_name`** — Optional, for parent reference only. Never exposed to other users, sync, or chat.

```sql
-- Already applied via migration add_user_codename_real_name
ALTER TABLE users ADD COLUMN codename TEXT;
ALTER TABLE users ADD COLUMN real_name TEXT;
CREATE UNIQUE INDEX idx_users_codename ON users(codename) WHERE codename IS NOT NULL;
```

New installs get these columns from `SUPER-CENTAUR/src/database/init.ts`. Run `npm run db:migrate` in SUPER-CENTAUR to apply on existing DBs.

---

## 2. Buddy memory and profile

- **BuddyMemory** uses `codename`, not `name`. Types live in `SUPER-CENTAUR/src/types/buddy.ts`.
- All Buddy greetings and messages use the codename:  
  `Hello, ${memory.codename}! I'm Buddy. …`
- When creating a child account, the parent sets a codename; the system ensures uniqueness (or suggests appending a number).

---

## 3. Parent dashboard

- Each child is listed by **codename**.
- Optional **real name** is shown only to the parent (e.g. "Real name: [private]").
- Parent can change codename at any time; unique constraint is enforced.
- Friend requests, approval flow, and daily limits use codenames only.

---

## 4. Buddy sync between family members

Sync payloads use codenames only, e.g.:

```json
{
  "type": "achievement",
  "codename": "Sunny",
  "description": "built a depth‑4 Sierpinski tetrahedron",
  "timestamp": 1234567890
}
```

Type: `BuddySyncAchievement` in `SUPER-CENTAUR/src/types/buddy.ts`.

---

## 5. Voice and multi-user

- Each Buddy instance responds to its owner; no need to use codename in-session.
- If multiple children share a room, Buddy can say: "I think Sunny is talking to their Buddy, not me."
- Wake word / address can optionally use codename (e.g. "Buddy, help Sunny with this structure").

---

## 6. Chat (end‑to‑end encrypted)

- Messages show the sender’s **codename**, not real name.
- Friend list and parent approval UI use codenames only.

---

## 7. Child login and session

- After PIN (or auth), load profile and set **codename** in session (e.g. `sessionStorage.setItem('codename', codename)`).
- Buddy greeting: `Welcome back, ${codename}! Ready to build something amazing?`
- API: `GET /api/child/:childId/profile` returns `{ codename, ... }` (no real name).

---

## 8. Scope (UI) integration

- **World Builder** and **Oracle Panel** use the player’s **codename** for all in-app messages (e.g. "The mesh is calm, [codename]. Your creations are coherent.").
- Codename is read from `localStorage` key `p31_codename`, with fallback to legacy `p31_userName`, default `"Builder"`.
- Set codename via settings or child profile so it flows into World Builder and Oracle.

---

## 9. Summary of code touchpoints

| Area              | Use codename for                    |
|-------------------|-------------------------------------|
| Database          | `users.codename`, `users.real_name` |
| BuddyMemory       | `memory.codename`                   |
| Parent dashboard  | List/edit by codename; real_name private |
| Sync              | `BuddySyncAchievement.codename`     |
| Chat              | Sender display, friend list         |
| Voice             | Optional wake/address               |
| Child login       | Session + profile API              |
| World Builder     | `playerCodename` (Oracle, localStorage) |

---

## 10. Next steps (when building Buddy UI)

1. **Registration / child account:** Collect codename; validate uniqueness; optionally allow parent to set real_name (private).
2. **Parent dashboard:** Implement child list with codename + optional real_name (parent-only), codename edit, daily limits, friend approvals.
3. **Buddy character:** Load `BuddyMemory` by `userId`; use `memory.codename` in all greetings and prompts.
4. **Chat:** Ensure message bubbles and friend list show only codenames.
5. **Sync:** Emit and consume `BuddySyncAchievement` (and similar) with `codename` only.

The mesh holds. Codenames protect. 💜
