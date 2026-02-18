# @p31labs/game-engine

Pure TypeScript gamification layer for The Buffer: XP, achievements, streaks, L.O.V.E. economy, and quests.

- **Zero React.** Shared library for PWA, Chrome extension, GENESIS_GATE, and eventually ESP32 (BLE struct).
- **Single dependency:** `@p31labs/buffer-core` (workspace).

## API

- **XP:** `calculateXP`, `awardXP`, `getTitle`, `xpToNextLevel`, `levelProgress`, `prestige`
- **Achievements:** `ACHIEVEMENTS`, `checkAchievements`
- **Streaks:** `incrementStreak`, `isStreakAlive`, `createStreakState`, `toUTCDateString`
- **L.O.V.E.:** `mine`, `applyMining`, `createLOVEState`
- **Quests:** `generateDailyQuests`, `generateWeeklyQuests`, `updateQuestProgress`

## Conventions

- **Timestamps:** All timestamps should be UTC in ISO 8601 form. This package does **not** perform timezone conversion beyond `toUTCDateString`; callers are responsible for passing UTC.
- **Streak dates:** Pass UTC calendar date as `YYYY-MM-DD` (or full ISO); `toUTCDateString` normalizes. Stored `lastDate` is always `YYYY-MM-DD` for consistent behaviour across midnight.
- **L.O.V.E. proof:** The `proof` field is for local deduplication only; it is not cryptographically secure and must not be used for server-side verification.

## Build & test

```bash
pnpm --filter @p31labs/game-engine build
pnpm --filter @p31labs/game-engine test
```

Optional enhancements (achievement progress, quest chaining, L.O.V.E. spending, inventory, etc.) are listed in [docs/ROADMAP.md](docs/ROADMAP.md).

L.O.V.E. is mined, not bought.
