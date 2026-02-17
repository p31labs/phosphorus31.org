/**
 * Real-Time Collaboration System
 * Enables family members to see each other's actions in real-time
 * 
 * "Four vertices. Six edges. Four faces. The minimum stable system."
 */

export interface CollaborationEvent {
  id: string;
  type: 'piece_placed' | 'piece_moved' | 'piece_removed' | 'connection_made' | 'test_started' | 'chat_message';
  playerId: string;
  timestamp: number;
  data: any;
}

export interface PlayerAction {
  playerId: string;
  action: string;
  pieceId?: string;
  position?: [number, number, number];
  timestamp: number;
}

export interface CollaborationState {
  activePlayers: Set<string>;
  recentActions: PlayerAction[];
  structureVersion: number;
  lastSync: number;
  conflicts: CollaborationConflict[];
}

export interface CollaborationConflict {
  id: string;
  type: 'position' | 'connection' | 'removal';
  player1Id: string;
  player2Id: string;
  pieceId: string;
  resolution: 'merge' | 'priority' | 'undo';
  resolved: boolean;
}

export class RealTimeCollaboration {
  private events: CollaborationEvent[] = [];
  private state: CollaborationState;
  private eventListeners: Map<string, ((event: CollaborationEvent) => void)[]> = new Map();
  private actionHistory: PlayerAction[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.state = {
      activePlayers: new Set(),
      recentActions: [],
      structureVersion: 0,
      lastSync: Date.now(),
      conflicts: [],
    };
  }

  /**
   * Initialize collaboration system
   */
  init(): void {
    // Start event processing loop
    this.startEventLoop();
    console.log('🔄 Real-Time Collaboration initialized');
  }

  /**
   * Register a player as active
   */
  registerPlayer(playerId: string): void {
    this.state.activePlayers.add(playerId);
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: 'chat_message',
      playerId: 'system',
      timestamp: Date.now(),
      data: { message: `Player ${playerId} joined` },
    });
  }

  /**
   * Unregister a player
   */
  unregisterPlayer(playerId: string): void {
    this.state.activePlayers.delete(playerId);
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: 'chat_message',
      playerId: 'system',
      timestamp: Date.now(),
      data: { message: `Player ${playerId} left` },
    });
  }

  /**
   * Record a piece placement action
   */
  recordPiecePlacement(playerId: string, piece: any): void {
    const action: PlayerAction = {
      playerId,
      action: 'place',
      pieceId: piece.id,
      position: piece.position,
      timestamp: Date.now(),
    };

    this.addAction(action);

    const event: CollaborationEvent = {
      id: crypto.randomUUID(),
      type: 'piece_placed',
      playerId,
      timestamp: Date.now(),
      data: { piece },
    };

    this.addEvent(event);
    this.broadcastEvent(event);
  }

  /**
   * Record a piece movement
   */
  recordPieceMovement(playerId: string, pieceId: string, newPosition: [number, number, number]): void {
    const action: PlayerAction = {
      playerId,
      action: 'move',
      pieceId,
      position: newPosition,
      timestamp: Date.now(),
    };

    this.addAction(action);

    const event: CollaborationEvent = {
      id: crypto.randomUUID(),
      type: 'piece_moved',
      playerId,
      timestamp: Date.now(),
      data: { pieceId, newPosition },
    };

    this.addEvent(event);
    this.broadcastEvent(event);
  }

  /**
   * Record a connection made
   */
  recordConnection(playerId: string, piece1Id: string, piece2Id: string): void {
    const event: CollaborationEvent = {
      id: crypto.randomUUID(),
      type: 'connection_made',
      playerId,
      timestamp: Date.now(),
      data: { piece1Id, piece2Id },
    };

    this.addEvent(event);
    this.broadcastEvent(event);
    this.state.structureVersion++;
  }

  /**
   * Detect and resolve conflicts
   */
  detectConflict(action: PlayerAction): CollaborationConflict | null {
    // Check if another player is modifying the same piece
    const conflictingAction = this.actionHistory.find(a => 
      a.pieceId === action.pieceId &&
      a.playerId !== action.playerId &&
      Math.abs(a.timestamp - action.timestamp) < 1000 // Within 1 second
    );

    if (conflictingAction) {
      const conflict: CollaborationConflict = {
        id: crypto.randomUUID(),
        type: 'position',
        player1Id: conflictingAction.playerId,
        player2Id: action.playerId,
        pieceId: action.pieceId!,
        resolution: 'merge', // Default: try to merge
        resolved: false,
      };

      this.state.conflicts.push(conflict);
      return conflict;
    }

    return null;
  }

  /**
   * Resolve a conflict
   */
  resolveConflict(conflictId: string, resolution: 'merge' | 'priority' | 'undo'): void {
    const conflict = this.state.conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    conflict.resolution = resolution;
    conflict.resolved = true;

    // Apply resolution logic
    if (resolution === 'undo') {
      // Undo the second action
      this.undoAction(conflict.player2Id);
    } else if (resolution === 'priority') {
      // Keep the first action, undo the second
      this.undoAction(conflict.player2Id);
    } else if (resolution === 'merge') {
      // Try to merge both actions (complex logic)
      this.mergeActions(conflict);
    }

    // Remove resolved conflict
    this.state.conflicts = this.state.conflicts.filter(c => c.id !== conflictId);
  }

  /**
   * Get recent actions for a player
   */
  getRecentActions(playerId?: string, limit: number = 10): PlayerAction[] {
    const actions = playerId
      ? this.actionHistory.filter(a => a.playerId === playerId)
      : this.actionHistory;

    return actions.slice(-limit);
  }

  /**
   * Get collaboration state
   */
  getCollaborationState(): CollaborationState {
    return {
      ...this.state,
      activePlayers: new Set(this.state.activePlayers),
      recentActions: [...this.state.recentActions],
      conflicts: [...this.state.conflicts],
    };
  }

  /**
   * Subscribe to events
   */
  subscribe(eventType: string, callback: (event: CollaborationEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Get active players
   */
  getActivePlayers(): string[] {
    return Array.from(this.state.activePlayers);
  }

  /**
   * Check if player is active
   */
  isPlayerActive(playerId: string): boolean {
    return this.state.activePlayers.has(playerId);
  }

  // Private methods

  private addEvent(event: CollaborationEvent): void {
    this.events.push(event);
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  private addAction(action: PlayerAction): void {
    this.actionHistory.push(action);
    this.state.recentActions.push(action);

    // Keep only recent actions
    if (this.actionHistory.length > this.maxHistorySize) {
      this.actionHistory = this.actionHistory.slice(-this.maxHistorySize);
    }

    // Keep only last 20 in recent actions
    if (this.state.recentActions.length > 20) {
      this.state.recentActions = this.state.recentActions.slice(-20);
    }

    // Update last sync
    this.state.lastSync = Date.now();
  }

  private broadcastEvent(event: CollaborationEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('[RealTimeCollaboration] Error in event listener:', error);
        }
      });
    }

    // Also broadcast to 'all' listeners
    const allListeners = this.eventListeners.get('all');
    if (allListeners) {
      allListeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('[RealTimeCollaboration] Error in event listener:', error);
        }
      });
    }
  }

  private startEventLoop(): void {
    // Process events every 100ms
    setInterval(() => {
      this.processEvents();
    }, 100);
  }

  private processEvents(): void {
    // Process pending events
    // In a real implementation, this would sync with other players
    // For now, it's local-only
  }

  private undoAction(playerId: string): void {
    // Find and undo the last action by this player
    const lastAction = this.actionHistory
      .slice()
      .reverse()
      .find(a => a.playerId === playerId);

    if (lastAction) {
      // Emit undo event
      const event: CollaborationEvent = {
        id: crypto.randomUUID(),
        type: 'piece_removed',
        playerId: 'system',
        timestamp: Date.now(),
        data: { pieceId: lastAction.pieceId, reason: 'conflict_resolution' },
      };

      this.broadcastEvent(event);
    }
  }

  private mergeActions(conflict: CollaborationConflict): void {
    // Complex merge logic
    // For now, just keep the first action
    this.undoAction(conflict.player2Id);
  }
}
