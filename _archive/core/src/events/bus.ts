import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// GENESIS GATE EVENT BUS
// Unified event system for cross-module communication
// ─────────────────────────────────────────────────────────────────────────────

export const GenesisEventBus = new EventEmitter();

// Standard events for module communication
export const EVENTS = {
  // Core L.O.V.E. Economy events
  SPOON_CHANGE: 'spoon:change',
  CARE_SESSION_START: 'care:session:start',
  CARE_SESSION_END: 'care:session:end',
  PROOF_OF_CARE_MINTED: 'poc:minted',

  // Hardware/Biometric events
  BIOMETRIC_UPDATE: 'biometric:update',
  PHENIX_CONNECTED: 'phenix:connected',
  PHENIX_DISCONNECTED: 'phenix:disconnected',
  GADGETBRIDGE_CONNECTED: 'gadgetbridge:connected',

  // Mesh/P2P events
  MESH_PEER_JOINED: 'mesh:peer:joined',
  MESH_PEER_LEFT: 'mesh:peer:left',
  MESH_MESSAGE_RECEIVED: 'mesh:message:received',
  ZK_PROOF_VERIFIED: 'zk:proof:verified',

  // World/3D events
  WORLD_VOXEL_PLACED: 'world:voxel:placed',
  WORLD_AVATAR_MOVED: 'world:avatar:moved',
  FABRICATOR_STARTED: 'fabricator:started',
  FABRICATOR_COMPLETED: 'fabricator:completed',

  // Cortex/User Content events
  MODULE_CREATED: 'cortex:module:created',
  MODULE_EXECUTED: 'cortex:module:executed',
  WEBCONTAINER_READY: 'webcontainer:ready',

  // Agent/AI events
  AGENT_RESPONSE: 'agent:response',
  KNOWLEDGE_GRAPH_UPDATED: 'knowledge:graph:updated',
  DECISION_MADE: 'decision:made',

  // Game events
  GAME_STARTED: 'game:started',
  GAME_COMPLETED: 'game:completed',
  SPOONS_RESTORED: 'spoons:restored',

  // UI events
  UI_THEME_CHANGED: 'ui:theme:changed',
  UI_NOTIFICATION: 'ui:notification'
} as const;

// Event data types
export interface EventData {
  [EVENTS.SPOON_CHANGE]: { spoons: number; reason: string };
  [EVENTS.BIOMETRIC_UPDATE]: { heartRate?: number; hrv?: number; stress?: number };
  [EVENTS.PHENIX_CONNECTED]: { deviceId: string; capabilities: string[] };
  [EVENTS.MESH_PEER_JOINED]: { peerId: string; capabilities: string[] };
  [EVENTS.WORLD_VOXEL_PLACED]: { position: [number, number, number]; material: string };
  [EVENTS.MODULE_CREATED]: { moduleId: string; type: string; permissions: string[] };
  [EVENTS.AGENT_RESPONSE]: { response: string; context: any };
  [EVENTS.GAME_COMPLETED]: { gameId: string; score: number; spoonsEarned: number };
}

// Helper functions for type-safe event emission
export const emitEvent = <K extends keyof EventData>(
  event: K,
  data: EventData[K]
) => {
  GenesisEventBus.emit(event, data);
};

export const onEvent = <K extends keyof EventData>(
  event: K,
  listener: (data: EventData[K]) => void
) => {
  GenesisEventBus.on(event, listener);
  return () => GenesisEventBus.off(event, listener);
};

export const onceEvent = <K extends keyof EventData>(
  event: K,
  listener: (data: EventData[K]) => void
) => {
  GenesisEventBus.once(event, listener);
};