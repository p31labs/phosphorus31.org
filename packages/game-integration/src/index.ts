/**
 * @p31/game-integration
 * Quantum Hello World → Game Engine. The onboarding IS the game.
 * Conversation = Challenge #0. Covenant = Vesting gate. Molecule = Player. Dome = Structure[0]. Mesh = Colyseus.
 */

export * from './types/molecule';
export type { AccessLevel } from './genesis';
export {
  GENESIS_CHALLENGE,
  SEED_CHALLENGES,
  GENESIS_TRANSACTIONS,
  GENESIS_LOVE_TOTAL,
  GENESIS_SOVEREIGNTY,
  GENESIS_PERFORMANCE,
  ACCESS_PERMISSIONS,
} from './genesis';
export { domeToStructure, moleculeToPlayer, domeToColyseusStructure } from './mappers';
export type { ColyseusStructurePayload } from './mappers';
export { getGameMode } from './metabolism-gating';
export type { GameBehavior } from './metabolism-gating';
export { initGameClient } from './init-game-client';
export { ShelterBridge } from './shelter-bridge';
