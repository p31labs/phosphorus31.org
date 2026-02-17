/**
 * Cloud Sync Manager
 * Handles cloud synchronization for save/load
 */

import { Structure, PlayerProgress } from '../types/game';

export interface CloudSyncConfig {
  enabled: boolean;
  endpoint: string;
  apiKey?: string;
  autoSync: boolean;
  syncInterval: number; // milliseconds
}

export interface SyncStatus {
  lastSync: number | null;
  pendingChanges: number;
  isSyncing: boolean;
  error: string | null;
}

export class CloudSyncManager {
  private config: CloudSyncConfig;
  private syncStatus: SyncStatus;
  private pendingStructures: Map<string, Structure> = new Map();
  private pendingProgress: PlayerProgress | null = null;
  private syncIntervalId: NodeJS.Timeout | null = null;

  constructor(config?: Partial<CloudSyncConfig>) {
    this.config = {
      enabled: config?.enabled ?? false,
      endpoint: config?.endpoint ?? 'https://api.p31.ecosystem/sync',
      apiKey: config?.apiKey,
      autoSync: config?.autoSync ?? true,
      syncInterval: config?.syncInterval ?? 30000 // 30 seconds
    };

    this.syncStatus = {
      lastSync: null,
      pendingChanges: 0,
      isSyncing: false,
      error: null
    };
  }

  /**
   * Initialize cloud sync
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('☁️ Cloud sync disabled');
      return;
    }

    console.log('☁️ Cloud Sync Manager initialized');

    // Start auto-sync if enabled
    if (this.config.autoSync) {
      this.startAutoSync();
    }

    // Try to sync immediately
    await this.sync();
  }

  /**
   * Start automatic syncing
   */
  private startAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }

    this.syncIntervalId = setInterval(() => {
      if (!this.syncStatus.isSyncing) {
        this.sync().catch(err => {
          console.error('☁️ Auto-sync error:', err);
        });
      }
    }, this.config.syncInterval);
  }

  /**
   * Stop automatic syncing
   */
  public stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  /**
   * Sync structures and progress to cloud
   */
  public async sync(): Promise<void> {
    if (!this.config.enabled || this.syncStatus.isSyncing) {
      return;
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.error = null;

    try {
      // Sync structures
      const structurePromises = Array.from(this.pendingStructures.values()).map(
        structure => this.syncStructure(structure)
      );
      await Promise.all(structurePromises);

      // Sync progress
      if (this.pendingProgress) {
        await this.syncProgress(this.pendingProgress);
      }

      this.syncStatus.lastSync = Date.now();
      this.syncStatus.pendingChanges = 0;
      this.pendingStructures.clear();
      this.pendingProgress = null;

      console.log('☁️ Cloud sync completed');
    } catch (error) {
      this.syncStatus.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('☁️ Cloud sync error:', error);
      throw error;
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  /**
   * Sync a structure to cloud
   */
  public async syncStructure(structure: Structure): Promise<void> {
    const response = await fetch(`${this.config.endpoint}/structures/${structure.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify(structure)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync structure: ${response.statusText}`);
    }
  }

  /**
   * Sync player progress to cloud
   */
  private async syncProgress(progress: PlayerProgress): Promise<void> {
    const response = await fetch(`${this.config.endpoint}/progress/${progress.familyMemberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify(progress)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync progress: ${response.statusText}`);
    }
  }

  /**
   * Queue structure for sync
   */
  public queueStructure(structure: Structure): void {
    if (!this.config.enabled) return;

    this.pendingStructures.set(structure.id, structure);
    this.syncStatus.pendingChanges = this.pendingStructures.size + (this.pendingProgress ? 1 : 0);

    // Auto-sync if enabled and not already syncing
    if (this.config.autoSync && !this.syncStatus.isSyncing) {
      this.sync().catch(err => {
        console.error('☁️ Auto-sync error:', err);
      });
    }
  }

  /**
   * Queue progress for sync
   */
  public queueProgress(progress: PlayerProgress): void {
    if (!this.config.enabled) return;

    this.pendingProgress = progress;
    this.syncStatus.pendingChanges = this.pendingStructures.size + 1;

    // Auto-sync if enabled and not already syncing
    if (this.config.autoSync && !this.syncStatus.isSyncing) {
      this.sync().catch(err => {
        console.error('☁️ Auto-sync error:', err);
      });
    }
  }

  /**
   * Load structure from cloud
   */
  public async loadStructure(structureId: string): Promise<Structure | null> {
    if (!this.config.enabled) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.endpoint}/structures/${structureId}`, {
        headers: {
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to load structure: ${response.statusText}`);
      }

      const structure = await response.json() as Structure;
      return structure;
    } catch (error) {
      console.error('☁️ Failed to load structure from cloud:', error);
      return null;
    }
  }

  /**
   * Load progress from cloud
   */
  public async loadProgress(familyMemberId: string): Promise<PlayerProgress | null> {
    if (!this.config.enabled) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.endpoint}/progress/${familyMemberId}`, {
        headers: {
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to load progress: ${response.statusText}`);
      }

      const progress = await response.json() as PlayerProgress;
      return progress;
    } catch (error) {
      console.error('☁️ Failed to load progress from cloud:', error);
      return null;
    }
  }

  /**
   * Get sync status
   */
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Enable/disable cloud sync
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (enabled) {
      this.startAutoSync();
    } else {
      this.stopAutoSync();
    }
  }

  /**
   * Update config
   */
  public updateConfig(config: Partial<CloudSyncConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.config.autoSync) {
      this.startAutoSync();
    } else {
      this.stopAutoSync();
    }
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.stopAutoSync();
    this.pendingStructures.clear();
    this.pendingProgress = null;
  }
}
