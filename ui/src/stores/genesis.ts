import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// GENESIS GATE UNIFIED STATE
// Simplified state management for the platform
// ─────────────────────────────────────────────────────────────────────────────

interface GenesisState {
  // Core L.O.V.E. Economy state
  spoons: number;
  careSessions: Array<{
    id: string;
    startTime: number;
    endTime?: number;
    type: string;
    spoonsEarned: number;
  }>;

  // Hardware/Biometric state
  biometrics: {
    heartRate?: number;
    hrv?: number;
    temperature?: number;
    stress?: number;
    lastUpdate: number;
  };
  phenixConnected: boolean;
  phenixDeviceId?: string;

  // Mesh/P2P state
  meshPeers: Array<{
    id: string;
    capabilities: string[];
    lastSeen: number;
  }>;
  isOnline: boolean;

  // World/3D state
  worldPosition: [number, number, number];
  avatarState: {
    position: [number, number, number];
    rotation: [number, number, number];
    animation: string;
  };

  // Cortex/User Content state
  activeModules: Array<{
    id: string;
    type: string;
    permissions: string[];
    lastExecuted?: number;
  }>;
  webcontainerReady: boolean;

  // Agent/AI state
  agentResponses: Array<{
    id: string;
    timestamp: number;
    response: string;
    context: any;
  }>;
  knowledgeGraph: {
    entities: number;
    relations: number;
    lastUpdated: number;
  };

  // Game state
  activeGame?: {
    id: string;
    type: string;
    startTime: number;
    score: number;
  };
  gameHistory: Array<{
    id: string;
    type: string;
    score: number;
    spoonsEarned: number;
    completedAt: number;
  }>;

  // UI state
  theme: 'light' | 'dark' | 'neurodivergent';
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: number;
  }>;

  // Actions
  updateSpoons: (spoons: number, reason: string) => void;
  updateBiometrics: (data: Partial<GenesisState['biometrics']>) => void;
  setPhenixConnection: (connected: boolean, deviceId?: string) => void;
  addMeshPeer: (peer: GenesisState['meshPeers'][0]) => void;
  removeMeshPeer: (peerId: string) => void;
  updateWorldPosition: (position: [number, number, number]) => void;
  addModule: (module: GenesisState['activeModules'][0]) => void;
  addAgentResponse: (response: GenesisState['agentResponses'][0]) => void;
  startGame: (game: NonNullable<GenesisState['activeGame']>) => void;
  completeGame: (score: number, spoonsEarned: number) => void;
  addNotification: (
    notification: Omit<GenesisState['notifications'][0], 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  setTheme: (theme: GenesisState['theme']) => void;
}

export const useGenesisStore = create<GenesisState>((set, get) => ({
  // Initial state
  spoons: 10,
  careSessions: [],
  biometrics: { lastUpdate: Date.now() },
  phenixConnected: false,
  meshPeers: [],
  isOnline: navigator.onLine,
  worldPosition: [0, 0, 0],
  avatarState: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    animation: 'idle',
  },
  activeModules: [],
  webcontainerReady: false,
  agentResponses: [],
  knowledgeGraph: { entities: 0, relations: 0, lastUpdated: Date.now() },
  gameHistory: [],
  theme: 'neurodivergent',
  notifications: [],

  // Actions
  updateSpoons: (spoons: number, _reason: string) => {
    set({ spoons });
  },

  updateBiometrics: (data) => {
    const biometrics = { ...get().biometrics, ...data, lastUpdate: Date.now() };
    set({ biometrics });
  },

  setPhenixConnection: (connected: boolean, deviceId?: string) => {
    set({ phenixConnected: connected, phenixDeviceId: deviceId });
  },

  addMeshPeer: (peer) => {
    set((state) => ({ meshPeers: [...state.meshPeers, peer] }));
  },

  removeMeshPeer: (peerId: string) => {
    set((state) => ({
      meshPeers: state.meshPeers.filter((p) => p.id !== peerId),
    }));
  },

  updateWorldPosition: (position) => {
    set({ worldPosition: position });
  },

  addModule: (module) => {
    set((state) => ({ activeModules: [...state.activeModules, module] }));
  },

  addAgentResponse: (response) => {
    set((state) => ({ agentResponses: [...state.agentResponses, response] }));
  },

  startGame: (game) => {
    set({ activeGame: game });
  },

  completeGame: (score: number, spoonsEarned: number) => {
    const game = get().activeGame;
    if (game) {
      const completedGame = {
        id: game.id,
        type: game.type,
        score,
        spoonsEarned,
        completedAt: Date.now(),
      };
      set((state) => ({
        activeGame: undefined,
        gameHistory: [...state.gameHistory, completedGame],
        spoons: state.spoons + spoonsEarned,
      }));
    }
  },

  addNotification: (notification) => {
    const id = `notif_${Date.now()}_${Math.random()}`;
    const fullNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
    };
    set((state) => ({
      notifications: [...state.notifications, fullNotification],
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  setTheme: (theme) => {
    set({ theme });
  },
}));
