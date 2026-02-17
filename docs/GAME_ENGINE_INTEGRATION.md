# P31 Game Engine Integration

**Quantum Hello World is the genesis function.** There is no separate onboarding and game — the onboarding IS the game.

## Mapping (Hello World → Engine)

| Hello World phase   | Game engine subsystem     | Data created              |
|---------------------|---------------------------|---------------------------|
| Converse (AI)       | ChallengeEngine #0        | coherence, 25 LOVE       |
| Covenant (5 values) | VestingManager values-gate | covenant signature       |
| Forming (crypto)    | WalletIntegration genesis | ECDSA keypair, 50 LOVE    |
| Born (name dome)    | SaveManager Structure[0]  | dome = first tetrahedron  |
| Mesh                | Colyseus GameState        | Player in multiplayer     |
| Returning           | SaveManager               | PlayerProgress restored   |

## Implementation

- **Package:** `@p31/game-integration` (`packages/game-integration`)
  - Types: `P31Molecule`, `GameClient`, `MetabolismState`, etc.
  - Genesis + 7 seed challenges (Genesis Resonance → Geodesic Dome)
  - Mappers: `domeToStructure`, `moleculeToPlayer`, `domeToColyseusStructure`
  - Metabolism gating: `getGameMode(metabolism)` → rest mode when RED
  - `initGameClient(molecule)`, `ShelterBridge` for API

- **Shelter (apps/shelter):**
  - `GameStore` — SQLite tables: molecules, love_transactions, player_progress, structures, brain_state
  - Routes: `POST /api/game/molecule/register`, `GET /api/game/brain/state`, `POST /api/game/sync`, `GET /api/game/mesh/directory`, `GET /api/game/wallet/:fp/balance`

## Phases

1. **Ship now:** Hello-world-as-genesis, Shelter routes, seed challenges loaded.
2. **Build mode (2 weeks):** Three.js /dome, BuildMode, StructureValidator, metabolism gating.
3. **Multiplayer (month 2):** Colyseus dome visits, TETRAHEDRON_BOND, co-op challenges.
4. **Sovereignty (month 3+):** VestingManager age-gate, Proof of Care, Node One bridge.

See `packages/game-integration/README.md` and the full integration spec (e.g. `P31_GAME_ENGINE_INTEGRATION.md` at repo root or in planning) for data models, L.O.V.E. genesis transactions, and navigation architecture.

🔺 The mesh holds.
