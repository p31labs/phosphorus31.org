// Game State Management - The Sovereign Stack
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Game State Interface
export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    // Core Game State
    isInitialized: false,
    gameState: 'MENU', // MENU, BUILDING, DEFENDING, CONNECTING
    playerPosition: [0, 0, 0],
    
    // Building System
    blocks: new Map(), // Map<"x,y,z", {type, color, voltage}>
    selectedBlockType: 'standard',
    blockTypes: {
      standard: { name: 'Standard Block', color: '#10b981', voltage: 0.1 },
      shield: { name: 'Shield Block', color: '#3b82f6', voltage: 0.05 },
      posner: { name: 'Posner Cluster', color: '#eab308', voltage: 0.01 },
      anchor: { name: 'Anchor Block', color: '#ef4444', voltage: 0.0 }
    },
    
    // Cognitive Shield System
    shield: {
      integrity: 100,
      voltage: 25, // Current stress level
      entropy: 0.3, // Chaos level
      coherence: 0.7, // Stability
      posnerClusters: 0,
      lastUpdate: Date.now()
    },
    
    // Mesh Network
    network: {
      connectedPlayers: [],
      signalStrength: 0,
      meshDensity: 0,
      isMeshActive: false
    },
    
    // Swarm Integration
    swarm: {
      density: 24.2,
      phase: 'CHAOS', // CHAOS, TRANSITION, ORDER
      targetDensity: 57.7,
      active: false
    },
    
    // UI State
    ui: {
      showTutorial: true,
      showStats: true,
      showNetwork: false,
      showInventory: false
    },
    
    // Actions
    initializeGame: () => {
      set(state => ({
        isInitialized: true,
        gameState: 'BUILDING'
      }));
    },
    
    // Building Actions
    addBlock: (position, type = 'standard') => {
      const key = position.join(',');
      const blockData = {
        type,
        color: get().blockTypes[type].color,
        voltage: get().blockTypes[type].voltage,
        position
      };
      
      set(state => {
        const newBlocks = new Map(state.blocks);
        newBlocks.set(key, blockData);
        return { blocks: newBlocks };
      });
      
      // Update shield when building
      get().updateShieldFromBuilding(type);
    },
    
    removeBlock: (position) => {
      const key = position.join(',');
      set(state => {
        const newBlocks = new Map(state.blocks);
        newBlocks.delete(key);
        return { blocks: newBlocks };
      });
    },
    
    setSelectedBlockType: (type) => {
      set({ selectedBlockType: type });
    },
    
    // Cognitive Shield Actions
    updateShieldFromBuilding: (blockType) => {
      const blockVoltage = get().blockTypes[blockType].voltage;
      set(state => {
        const newShield = { ...state.shield };
        newShield.voltage = Math.max(0, newShield.voltage - blockVoltage * 10);
        newShield.coherence = Math.min(1, newShield.coherence + 0.05);
        newShield.integrity = Math.min(100, newShield.integrity + 2);
        
        if (blockType === 'posner') {
          newShield.posnerClusters += 1;
        }
        
        return { shield: newShield };
      });
    },
    
    updateShieldFromEntropy: (entropyAmount) => {
      set(state => {
        const newShield = { ...state.shield };
        newShield.entropy = Math.min(1, newShield.entropy + entropyAmount);
        newShield.voltage = Math.min(100, newShield.voltage + entropyAmount * 20);
        newShield.coherence = Math.max(0, newShield.coherence - entropyAmount * 0.2);
        newShield.integrity = Math.max(0, newShield.integrity - entropyAmount * 10);
        
        return { shield: newShield };
      });
    },
    
    // Network Actions
    connectToPlayer: (playerId) => {
      set(state => {
        const newNetwork = { ...state.network };
        if (!newNetwork.connectedPlayers.includes(playerId)) {
          newNetwork.connectedPlayers.push(playerId);
          newNetwork.signalStrength = Math.min(100, newNetwork.signalStrength + 20);
          newNetwork.meshDensity = Math.min(100, newNetwork.meshDensity + 10);
        }
        return { network: newNetwork };
      });
    },
    
    disconnectPlayer: (playerId) => {
      set(state => {
        const newNetwork = { ...state.network };
        newNetwork.connectedPlayers = newNetwork.connectedPlayers.filter(id => id !== playerId);
        newNetwork.signalStrength = Math.max(0, newNetwork.signalStrength - 10);
        newNetwork.meshDensity = Math.max(0, newNetwork.meshDensity - 5);
        return { network: newNetwork };
      });
    },
    
    // Swarm Actions
    activateSwarm: () => {
      set(state => ({
        swarm: {
          ...state.swarm,
          active: true,
          phase: 'TRANSITION'
        }
      }));
    },
    
    updateSwarm: () => {
      set(state => {
        const newSwarm = { ...state.swarm };
        if (newSwarm.active && newSwarm.density < newSwarm.targetDensity) {
          newSwarm.density += Math.random() * 0.5;
          if (newSwarm.density >= newSwarm.targetDensity) {
            newSwarm.phase = 'ORDER';
          }
        }
        return { swarm: newSwarm };
      });
    },
    
    // UI Actions
    toggleTutorial: () => {
      set(state => ({ ui: { ...state.ui, showTutorial: !state.ui.showTutorial } }));
    },
    
    toggleStats: () => {
      set(state => ({ ui: { ...state.ui, showStats: !state.ui.showStats } }));
    },
    
    // Game Loop Update
    updateGame: () => {
      const state = get();
      
      // Update swarm density
      state.updateSwarm();
      
      // Entropy increases over time (stress accumulation)
      if (state.gameState === 'BUILDING') {
        state.updateShieldFromEntropy(0.001);
      }
      
      // Network effects on shield
      if (state.network.meshDensity > 50) {
        set(state => ({
          shield: {
            ...state.shield,
            coherence: Math.min(1, state.shield.coherence + 0.01),
            voltage: Math.max(0, state.shield.voltage - 0.5)
          }
        }));
      }
    }
  })
);

// Auto-update loop
setInterval(() => {
  useGameStore.getState().updateGame();
}, 100);