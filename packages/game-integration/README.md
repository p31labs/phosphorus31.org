# @p31/game-integration

**Quantum Hello World → Game Engine.** The onboarding IS the game. Conversation = Challenge #0. Covenant = Vesting gate. Molecule = Player. Dome = Structure[0]. Mesh = Colyseus.

## Contents

- **Types:** `P31Molecule`, `GameClient`, `MetabolismState`, `WalletState`, `ChallengeDef`, `StructureMesh`, `MeshPlayer`
- **Genesis:** `GENESIS_CHALLENGE`, `SEED_CHALLENGES` (7: Genesis Resonance → Geodesic Dome), `GENESIS_TRANSACTIONS`, `AccessLevel`, `ACCESS_PERMISSIONS`
- **Mappers:** `domeToStructure(molecule)`, `moleculeToPlayer(mol)`, `domeToColyseusStructure(mol)`
- **Metabolism gating:** `getGameMode(metabolism)` → `GameBehavior` (GREEN/YELLOW/RED → canBuild, uiMode, message)
- **Init:** `initGameClient(molecule, meshPlayers?)` → full `GameClient` after formation
- **Shelter bridge:** `ShelterBridge` — `registerMolecule`, `getBrainState`, `syncGameState`, `getMeshDirectory`, `getWalletBalance`, `connectRealtime`

## Shelter API (apps/shelter)

- `POST /api/game/molecule/register` — register molecule, write genesis LOVE (50)
- `GET /api/game/brain/state` — spoons (game/Scope pulls for `getGameMode`)
- `POST /api/game/brain/state` — **GAS Brain pushes** spoons (`{ spoons, maxSpoons, color }`); one `UrlFetchApp.fetch` and the game breathes with the body
- `POST /api/game/sync` — push player progress
- `GET /api/game/mesh/directory` — all molecules (domes)
- `GET /api/game/wallet/:fingerprint/balance` — LOVE balance

Optional auth: set `P31_API_KEY`; clients send `X-P31-Key`.

## Usage

```ts
import {
  initGameClient,
  ShelterBridge,
  getGameMode,
  GENESIS_CHALLENGE,
  SEED_CHALLENGES,
  domeToStructure,
  moleculeToPlayer,
} from '@p31/game-integration';

const molecule = /* from Quantum Hello World */;
const client = initGameClient(molecule, meshPlayers);
const behavior = getGameMode(client.metabolism);
if (behavior.uiMode === 'rest') {
  // "The phosphorus is resting. You can look at the mesh, but building waits."
}
```

## Links

- **Integration spec:** `docs/P31_GAME_ENGINE_INTEGRATION.md` (or repo root)
- **Game engine brief:** `docs/GAME_ENGINE_OPUS_BRIEF.md`

🔺 The mesh holds.
