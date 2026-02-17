/**
 * Co-op Manager
 * Handles multiplayer/co-op functionality for family collaboration
 */

import { Structure, Challenge, PlayerProgress } from '../types/game';
import { EventEmitter } from 'events';

export interface CoopSession {
  id: string;
  participants: string[]; // familyMemberIds
  currentStructure: Structure | null;
  currentChallenge: Challenge | null;
  startedAt: number;
  lastActivity: number;
}

export interface CoopAction {
  type: 'place' | 'remove' | 'modify' | 'test' | 'validate';
  pieceId?: string;
  structure: Structure;
  timestamp: number;
  actor: string; // familyMemberId
}

export class CoopManager extends EventEmitter {
  private activeSessions: Map<string, CoopSession> = new Map();
  private actionHistory: Map<string, CoopAction[]> = new Map();
  private websocket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    super();
  }

  /**
   * Initialize co-op manager
   */
  public async init(): Promise<void> {
    // Try to connect to WebSocket server for real-time sync
    // For now, use local-only mode
    console.log('👥 Co-op Manager initialized (local mode)');
  }

  /**
   * Create a new co-op session
   */
  public createSession(participants: string[], challenge?: Challenge): CoopSession {
    const sessionId = this.generateSessionId();
    
    const session: CoopSession = {
      id: sessionId,
      participants,
      currentStructure: null,
      currentChallenge: challenge || undefined,
      startedAt: Date.now(),
      lastActivity: Date.now()
    };

    this.activeSessions.set(sessionId, session);
    this.actionHistory.set(sessionId, []);

    this.emit('sessionCreated', session);
    console.log(`👥 Co-op session created: ${sessionId} with ${participants.length} participants`);

    return session;
  }

  /**
   * Join an existing co-op session
   */
  public joinSession(sessionId: string, participantId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      console.warn(`👥 Session not found: ${sessionId}`);
      return false;
    }

    if (session.participants.includes(participantId)) {
      console.log(`👥 Participant already in session: ${participantId}`);
      return true;
    }

    session.participants.push(participantId);
    session.lastActivity = Date.now();

    this.emit('participantJoined', { sessionId, participantId });
    console.log(`👥 Participant joined session: ${participantId}`);

    return true;
  }

  /**
   * Leave a co-op session
   */
  public leaveSession(sessionId: string, participantId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.participants = session.participants.filter(id => id !== participantId);
    session.lastActivity = Date.now();

    this.emit('participantLeft', { sessionId, participantId });

    // Clean up empty sessions
    if (session.participants.length === 0) {
      this.activeSessions.delete(sessionId);
      this.actionHistory.delete(sessionId);
      this.emit('sessionEnded', sessionId);
    }
  }

  /**
   * Update structure in co-op session
   */
  public updateStructure(sessionId: string, structure: Structure, actor: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    if (!session.participants.includes(actor)) {
      console.warn(`👥 Actor not in session: ${actor}`);
      return;
    }

    session.currentStructure = structure;
    session.lastActivity = Date.now();

    // Record action
    const action: CoopAction = {
      type: 'modify',
      structure,
      timestamp: Date.now(),
      actor
    };

    const history = this.actionHistory.get(sessionId) || [];
    history.push(action);
    this.actionHistory.set(sessionId, history);

    // Broadcast to other participants
    this.broadcastAction(sessionId, action);

    this.emit('structureUpdated', { sessionId, structure, actor });
  }

  /**
   * Place piece in co-op session
   */
  public placePiece(sessionId: string, pieceId: string, structure: Structure, actor: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const action: CoopAction = {
      type: 'place',
      pieceId,
      structure,
      timestamp: Date.now(),
      actor
    };

    this.recordAction(sessionId, action);
    this.updateStructure(sessionId, structure, actor);
  }

  /**
   * Remove piece in co-op session
   */
  public removePiece(sessionId: string, pieceId: string, structure: Structure, actor: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const action: CoopAction = {
      type: 'remove',
      pieceId,
      structure,
      timestamp: Date.now(),
      actor
    };

    this.recordAction(sessionId, action);
    this.updateStructure(sessionId, structure, actor);
  }

  /**
   * Record action in history
   */
  private recordAction(sessionId: string, action: CoopAction): void {
    const history = this.actionHistory.get(sessionId) || [];
    history.push(action);
    
    // Keep only last 100 actions
    if (history.length > 100) {
      history.shift();
    }
    
    this.actionHistory.set(sessionId, history);
  }

  /**
   * Broadcast action to other participants
   */
  private broadcastAction(sessionId: string, action: CoopAction): void {
    // In local mode, just emit event
    // In networked mode, would send via WebSocket
    this.emit('action', { sessionId, action });
  }

  /**
   * Get session
   */
  public getSession(sessionId: string): CoopSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Get active sessions for participant
   */
  public getActiveSessionsForParticipant(participantId: string): CoopSession[] {
    const sessions: CoopSession[] = [];
    
    this.activeSessions.forEach((session) => {
      if (session.participants.includes(participantId)) {
        sessions.push(session);
      }
    });

    return sessions;
  }

  /**
   * Get action history for session
   */
  public getActionHistory(sessionId: string): CoopAction[] {
    return this.actionHistory.get(sessionId) || [];
  }

  /**
   * Calculate co-op bonus for challenge completion
   */
  public calculateCoopBonus(sessionId: string, baseReward: number): number {
    const session = this.activeSessions.get(sessionId);
    if (!session) return 0;

    const participantCount = session.participants.length;
    
    // Co-op bonus: 10% per additional participant (max 50%)
    const bonusMultiplier = 1 + (participantCount - 1) * 0.1;
    const maxBonus = 1.5; // 50% max bonus
    
    return Math.min(maxBonus, bonusMultiplier) * baseReward;
  }

  /**
   * Clean up inactive sessions
   */
  public cleanupInactiveSessions(maxInactiveTime: number = 3600000): void {
    const now = Date.now();
    
    this.activeSessions.forEach((session, sessionId) => {
      if (now - session.lastActivity > maxInactiveTime) {
        this.activeSessions.delete(sessionId);
        this.actionHistory.delete(sessionId);
        this.emit('sessionEnded', sessionId);
        console.log(`👥 Cleaned up inactive session: ${sessionId}`);
      }
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'coop_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.activeSessions.clear();
    this.actionHistory.clear();
    this.removeAllListeners();
  }
}
