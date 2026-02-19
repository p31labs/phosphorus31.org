/**
 * Network Manager
 * Handles multiplayer, real-time collaboration, and cloud sync
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { Logger } from '../../utils/logger';
import { Structure } from '../types/game';

export interface NetworkPeer {
  id: string;
  name: string;
  isConnected: boolean;
  lastSeen: number;
  position?: { x: number; y: number; z: number };
  currentAction?: string;
}

export interface NetworkMessage {
  type: 'structure_update' | 'peer_join' | 'peer_leave' | 'chat' | 'collaboration';
  from: string;
  timestamp: number;
  data: any;
}

export class NetworkManager {
  private logger: Logger;
  private peers: Map<string, NetworkPeer> = new Map();
  private isConnected: boolean = false;
  private roomId: string | null = null;
  private localPeerId: string;
  private messageHandlers: Map<string, ((message: NetworkMessage) => void)[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    this.logger = new Logger('NetworkManager');
    this.localPeerId = this.generatePeerId();
  }

  /**
   * Initialize network connection
   */
  public async init(serverUrl?: string): Promise<void> {
    try {
      // In a real implementation, this would connect to WebSocket server
      // For now, we'll simulate local network
      this.isConnected = true;
      this.logger.info('Network Manager initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Network Manager:', error);
      throw error;
    }
  }

  /**
   * Join a collaboration room
   */
  public async joinRoom(roomId: string, peerName: string): Promise<void> {
    this.roomId = roomId;
    
    // Broadcast join message
    this.broadcastMessage({
      type: 'peer_join',
      from: this.localPeerId,
      timestamp: Date.now(),
      data: { name: peerName, roomId },
    });

    // Add self to peers
    this.peers.set(this.localPeerId, {
      id: this.localPeerId,
      name: peerName,
      isConnected: true,
      lastSeen: Date.now(),
    });

    this.logger.info(`Joined room: ${roomId}`);
  }

  /**
   * Leave current room
   */
  public leaveRoom(): void {
    if (this.roomId) {
      this.broadcastMessage({
        type: 'peer_leave',
        from: this.localPeerId,
        timestamp: Date.now(),
        data: { roomId: this.roomId },
      });
    }

    this.roomId = null;
    this.peers.clear();
    this.logger.info('Left room');
  }

  /**
   * Broadcast structure update to peers
   */
  public broadcastStructureUpdate(structure: Structure): void {
    this.broadcastMessage({
      type: 'structure_update',
      from: this.localPeerId,
      timestamp: Date.now(),
      data: { structure },
    });
  }

  /**
   * Send chat message
   */
  public sendChat(message: string): void {
    this.broadcastMessage({
      type: 'chat',
      from: this.localPeerId,
      timestamp: Date.now(),
      data: { message },
    });
  }

  /**
   * Broadcast collaboration action
   */
  public broadcastCollaboration(action: string, data: any): void {
    this.broadcastMessage({
      type: 'collaboration',
      from: this.localPeerId,
      timestamp: Date.now(),
      data: { action, ...data },
    });
  }

  /**
   * Register message handler
   */
  public onMessage(type: string, handler: (message: NetworkMessage) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  /**
   * Remove message handler
   */
  public offMessage(type: string, handler: (message: NetworkMessage) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Get connected peers
   */
  public getPeers(): NetworkPeer[] {
    return Array.from(this.peers.values());
  }

  /**
   * Check if connected
   */
  public isNetworkConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current room ID
   */
  public getRoomId(): string | null {
    return this.roomId;
  }

  /**
   * Get local peer ID
   */
  public getLocalPeerId(): string {
    return this.localPeerId;
  }

  /**
   * Broadcast message to all peers
   */
  private broadcastMessage(message: NetworkMessage): void {
    if (!this.isConnected) return;

    // In real implementation, this would send via WebSocket
    // For now, we'll simulate by calling handlers directly
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          this.logger.error('Error in message handler:', error);
        }
      });
    }
  }

  /**
   * Handle incoming message (called by network layer)
   */
  public handleIncomingMessage(message: NetworkMessage): void {
    // Update peer last seen
    if (message.from !== this.localPeerId) {
      const peer = this.peers.get(message.from);
      if (peer) {
        peer.lastSeen = Date.now();
      }
    }

    // Call handlers
    this.broadcastMessage(message);
  }

  /**
   * Update peer position
   */
  public updatePeerPosition(position: { x: number; y: number; z: number }): void {
    const peer = this.peers.get(this.localPeerId);
    if (peer) {
      peer.position = position;
      peer.lastSeen = Date.now();
    }
  }

  /**
   * Update peer action
   */
  public updatePeerAction(action: string): void {
    const peer = this.peers.get(this.localPeerId);
    if (peer) {
      peer.currentAction = action;
      peer.lastSeen = Date.now();
    }
  }

  /**
   * Cleanup disconnected peers
   */
  public cleanupDisconnectedPeers(timeout: number = 30000): void {
    const now = Date.now();
    for (const [id, peer] of this.peers.entries()) {
      if (id !== this.localPeerId && now - peer.lastSeen > timeout) {
        this.peers.delete(id);
        this.logger.info(`Removed disconnected peer: ${id}`);
      }
    }
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.leaveRoom();
    this.messageHandlers.clear();
    this.peers.clear();
    this.isConnected = false;
    this.logger.info('Network Manager disposed');
  }

  /**
   * Generate unique peer ID
   */
  private generatePeerId(): string {
    return 'peer_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }
}
