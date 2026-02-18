# @p31labs/game-engine — Enhancement Roadmap

Optional features and improvements, prioritised by product needs. The core package is **complete for its stated purpose**.

---

## 1. Achievement progress tracking

- **Current:** Achievements are boolean (earned or not).
- **Idea:** Add `progress` (e.g. current/target) and store per-achievement progress in `PlayerState` so the UI can show “45/100 messages scored”.
- **When:** When you want visible progress bars to increase motivation.

---

## 2. Quest variety and chaining

- **Current:** One-off daily/weekly “do X action Y times” quests.
- **Ideas:** Chain quests (e.g. complete 3 dailies in a row for a bonus), multi-stage quests, optional/hidden quests, repeatable “endless” quests that reset daily.
- **When:** When you need more engagement loops.

---

## 3. L.O.V.E. spending

- **Current:** L.O.V.E. is mined only; no spend path.
- **Idea:** Add `spend(state, amount, reason)` (and optionally transaction log) for future cosmetics, unlocks, or streak protection.
- **When:** Before introducing any spend mechanic (even if only “donate to P31”).

---

## 4. Streak freezes / protection

- **Current:** Streaks reset after a missed day.
- **Idea:** “Freeze” or “saver” (e.g. via item or L.O.V.E.) to forgive one miss. P31-friendly names: “Pause Token”, “Rest Charge”.
- **When:** When you want to reduce frustration from a single missed day.

---

## 5. Player inventory

- **Current:** `PlayerState.inventory: string[]` exists but no helpers.
- **Idea:** `addItem`, `removeItem`, `useItem`; define item types (consumables, cosmetics) and how they interact with streaks/XP.
- **When:** When you introduce earnable/spendable items (e.g. streak freezes, XP boosts).

---

## 6. More granular XP events

- **Current:** `XPAction` + optional `voltage` already support message scoring nuance.
- **Idea:** Only add separate action types per voltage band if analytics/product explicitly need them.
- **When:** If analytics or tuning requires it.

---

## 7. Leaderboards

- **Current:** No social/competitive layer.
- **Idea:** Export a stable “player summary” (XP, level, achievements, key stats) for a separate leaderboard service.
- **When:** If you add friends or rankings.

---

## 8. Calendar / limited-time events

- **Current:** Quests are deterministic per day/week.
- **Idea:** Inject special quests/achievements or modifiers (e.g. “Double L.O.V.E. weekend”, holiday achievements) outside the normal pool.
- **When:** When you run campaigns or seasonal content.

---

## 9. Event log / history

- **Current:** No built-in history of XP, L.O.V.E., or quest completions.
- **Idea:** Optional “last N actions” log for transparency and debugging; consumers persist if needed.
- **When:** When users or support need to see how rewards were earned.

---

## 10. ESP32 / BLE serialisation

- **Current:** README mentions eventual ESP32 (BLE struct).
- **Idea:** Ensure core state shapes are serialisation-friendly; add `toJSON()` / `fromJSON()` or a small binary schema (e.g. flat struct) when you start on firmware.
- **When:** When implementing the BLE/ESP32 client.

---

## 11. Test edge cases

- **Ideas:** Leap year and `toUTCDateString`; very large XP (e.g. near 2^53); malformed date strings (throw vs safe fallback).
- **When:** Before release or when you hit odd dates/values in production.

---

## 12. Documentation of assumptions

- **Idea:** In README or Conventions: “All timestamps UTC (ISO 8601); package does not perform timezone conversion beyond `toUTCDateString`.”
- **When:** Soon; prevents misuse.

---

## 13. i18n readiness

- **Current:** User-facing strings (achievement names, quest titles) are hardcoded English.
- **Idea:** Use string keys (e.g. `achievement.first_score.nameKey`) and keep copy in an i18n layer so the engine stays language-agnostic.
- **When:** When you add a second locale.

---

## 14. Performance

- **Current:** Small surface; performance is fine.
- **Idea:** If you ever have very large achievement/quest sets, consider maps (e.g. `achievementsById`) for lookups.
- **When:** Only if profiling shows a need.

---

## 15. P31 language and tone

- **Guideline:** New features (items, events, copy) should keep P31 tone: gentle, non-violent, kids-first. Prefer “Pause Token”, “Rest Charge”, “Calm” over “Shield”, “Kill”, “Attack”.
- **When:** Always; apply in design and naming for every new feature.

---

*Last updated: 2026-02-18. Align with product roadmap and P31 Codex.*
