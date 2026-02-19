/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * QUANTUM ENTANGLEMENT BRIDGE - UI VERSION
 * Real-time quantum state synchronization for UI components
 *
 * Simplified version for UI that uses BroadcastChannel and localStorage
 * for same-origin tab synchronization (no WebRTC needed for UI-only)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SICPOVMState {
  theta: number;
  phi: number;
  purity: number;
  measurement?: number;
  timestamp?: number;
  phase?: number;
  coherence?: number;
}

export interface EntanglementSession {
  sessionId: string;
  particleIds: string[];
  entangledStates: Map<string, SICPOVMState>;
  correlationMatrix: Map<string, Map<string, number>>;
  isActive: boolean;
  createdAt: number;
}

export interface SignalingMessage {
  type: 'session-created' | 'measurement-event' | 'entanglement-sync' | 'state-update';
  sessionId: string;
  particleId?: string;
  payload: any;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM ENTANGLEMENT BRIDGE
// ═══════════════════════════════════════════════════════════════════════════════

class QuantumEntanglementBridge {
  private sessions: Map<string, EntanglementSession> = new Map();
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private storageListener: ((e: StorageEvent) => void) | null = null;

  // Quantum parameters
  private readonly ENTANGLEMENT_STRENGTH = 0.95;
  private readonly CORRELATION_DECAY = 0.999;

  constructor() {
    this.initializeBroadcast();
  }

  /**
   * Initialize BroadcastChannel for same-origin communication
   */
  private initializeBroadcast(): void {
    if ('BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('quantum-entanglement-ui');
      this.broadcastChannel.onmessage = (event) => {
        this.handleMessage(event.data);
      };
    }

    // Fallback: localStorage listener
    this.storageListener = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('quantum_entanglement_')) {
        try {
          const message = JSON.parse(e.newValue || '{}');
          this.handleMessage(message);
        } catch (error) {
          // Ignore invalid messages
        }
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: SignalingMessage): void {
    switch (message.type) {
      case 'session-created':
        this.handleSessionCreated(message);
        break;
      case 'measurement-event':
        this.handleMeasurementEvent(message);
        break;
      case 'entanglement-sync':
        this.handleEntanglementSync(message);
        break;
      case 'state-update':
        this.handleStateUpdate(message);
        break;
    }
  }

  /**
   * Broadcast message to other tabs
   */
  private broadcast(message: SignalingMessage): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(message);
    }

    // Fallback: localStorage
    const key = `quantum_entanglement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, JSON.stringify(message));
    setTimeout(() => localStorage.removeItem(key), 1000);
  }

  /**
   * Create entanglement session
   */
  async createEntanglementSession(particleIds: string[]): Promise<string> {
    const sessionId = `entanglement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session: EntanglementSession = {
      sessionId,
      particleIds,
      entangledStates: new Map(),
      correlationMatrix: new Map(),
      isActive: true,
      createdAt: Date.now(),
    };

    // Initialize entangled states
    particleIds.forEach((particleId) => {
      const state: SICPOVMState = {
        theta: Math.random() * Math.PI,
        phi: Math.random() * 2 * Math.PI,
        purity: 0.9 + Math.random() * 0.1,
        phase: Math.random() * 2 * Math.PI,
        coherence: 0.85 + Math.random() * 0.15,
        timestamp: Date.now(),
      };
      session.entangledStates.set(particleId, state);

      // Initialize correlation matrix
      session.correlationMatrix.set(particleId, new Map());
      particleIds.forEach((otherId) => {
        const correlation =
          particleId === otherId
            ? 1.0
            : this.ENTANGLEMENT_STRENGTH *
              (1 - Math.abs(particleIds.indexOf(particleId) - particleIds.indexOf(otherId)) / particleIds.length);
        session.correlationMatrix.get(particleId)!.set(otherId, correlation);
      });
    });

    this.sessions.set(sessionId, session);

    // Broadcast session creation
    this.broadcast({
      type: 'session-created',
      sessionId,
      payload: {
        particleIds,
        initialStates: Object.fromEntries(session.entangledStates),
      },
      timestamp: Date.now(),
    });

    this.emitEvent('sessionCreated', { sessionId, particleIds });
    return sessionId;
  }

  /**
   * Measure entangled particle
   */
  async measureEntangledParticle(sessionId: string, particleId: string): Promise<SICPOVMState> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Invalid or inactive session');
    }

    const currentState = session.entangledStates.get(particleId);
    if (!currentState) {
      throw new Error('Particle not found in session');
    }

    // Perform SIC-POVM measurement
    const measurement = Math.floor(Math.random() * 4);
    const probability = currentState.purity * 0.25 + (1 - currentState.purity) * (1 / 4);

    const newState: SICPOVMState = {
      ...currentState,
      measurement,
      timestamp: Date.now(),
      purity: Math.max(0.5, currentState.purity - 0.1), // Measurement reduces purity
    };

    session.entangledStates.set(particleId, newState);

    // Propagate entanglement
    await this.propagateEntanglement(sessionId, particleId, newState);

    // Broadcast measurement
    this.broadcast({
      type: 'measurement-event',
      sessionId,
      particleId,
      payload: {
        particleId,
        measurement: newState,
      },
      timestamp: Date.now(),
    });

    this.emitEvent('measurementPerformed', { sessionId, particleId, measurement: newState });
    return newState;
  }

  /**
   * Propagate entanglement correlations
   */
  private async propagateEntanglement(
    sessionId: string,
    sourceParticleId: string,
    sourceState: SICPOVMState
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const correlatedUpdates: string[] = [];

    session.correlationMatrix.forEach((correlationMap, particleId) => {
      if (particleId === sourceParticleId) return;

      const correlation = correlationMap.get(sourceParticleId) || 0;
      if (correlation < 0.1) return;

      const currentState = session.entangledStates.get(particleId);
      if (currentState) {
        // Apply anti-correlation (like spin entanglement)
        const correlatedState: SICPOVMState = {
          ...currentState,
          phase: ((sourceState.phase || 0) + Math.PI) % (2 * Math.PI),
          coherence: Math.max(0.7, (currentState.coherence || 0.9) * 0.98),
          timestamp: Date.now(),
        };

        session.entangledStates.set(particleId, correlatedState);
        correlatedUpdates.push(particleId);

        this.emitEvent('entanglementPropagated', {
          sessionId,
          sourceParticle: sourceParticleId,
          targetParticle: particleId,
          correlation,
          updatedState: correlatedState,
        });
      }
    });
  }

  /**
   * Get entangled state
   */
  getEntangledState(sessionId: string, particleId: string): SICPOVMState | null {
    const session = this.sessions.get(sessionId);
    return session?.entangledStates.get(particleId) || null;
  }

  /**
   * End session
   */
  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.delete(sessionId);
      this.emitEvent('sessionEnded', { sessionId });
    }
  }

  /**
   * Handle session created message
   */
  private handleSessionCreated(message: SignalingMessage): void {
    const { particleIds, initialStates } = message.payload;
    const session: EntanglementSession = {
      sessionId: message.sessionId,
      particleIds,
      entangledStates: new Map(Object.entries(initialStates)),
      correlationMatrix: new Map(),
      isActive: true,
      createdAt: message.timestamp,
    };

    // Initialize correlation matrix
    particleIds.forEach((particleId) => {
      session.correlationMatrix.set(particleId, new Map());
      particleIds.forEach((otherId) => {
        const correlation = particleId === otherId ? 1.0 : this.ENTANGLEMENT_STRENGTH;
        session.correlationMatrix.get(particleId)!.set(otherId, correlation);
      });
    });

    this.sessions.set(message.sessionId, session);
    this.emitEvent('sessionJoined', { sessionId: message.sessionId, particleIds });
  }

  /**
   * Handle measurement event
   */
  private handleMeasurementEvent(message: SignalingMessage): void {
    const { particleId, measurement } = message.payload;
    const session = this.sessions.get(message.sessionId);

    if (session) {
      session.entangledStates.set(particleId, measurement);
      this.propagateEntanglement(message.sessionId, particleId, measurement);
      this.emitEvent('remoteMeasurement', {
        sessionId: message.sessionId,
        particleId,
        measurement,
      });
    }
  }

  /**
   * Handle entanglement sync
   */
  private handleEntanglementSync(message: SignalingMessage): void {
    // Handle sync updates
    this.emitEvent('entanglementSync', message.payload);
  }

  /**
   * Handle state update
   */
  private handleStateUpdate(message: SignalingMessage): void {
    this.emitEvent('stateUpdate', message.payload);
  }

  /**
   * Event system
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in quantum event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
    this.sessions.clear();
    this.eventListeners.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

export const quantumEntanglementBridge = new QuantumEntanglementBridge();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    quantumEntanglementBridge.cleanup();
  });
}
