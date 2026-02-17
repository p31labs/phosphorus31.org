/**
 * Privacy Manager
 * Ensures all game data stays local-first, no tracking, no telemetry
 * 
 * "Roblox harvests. P31 protects."
 */

export interface PrivacySettings {
  localOnly: boolean;              // All data stays on device
  cloudSyncEnabled: boolean;       // Opt-in cloud sync (end-to-end encrypted)
  analyticsEnabled: boolean;       // Always false - no analytics
  telemetryEnabled: boolean;       // Always false - no telemetry
  dataRetention: 'forever' | '30days' | '7days' | 'manual'; // How long to keep saves
}

export interface GameData {
  structures: EncryptedStructure[];
  progress: LocalProgress;
  preferences: UserPreferences;
  challenges: ChallengeProgress[];
  timestamp: number;
}

export interface EncryptedStructure {
  id: string;
  name: string;
  encryptedData: string;         // AES-256-GCM encrypted
  iv: string;                      // Initialization vector
  createdAt: number;
  lastModified: number;
}

export interface LocalProgress {
  playerId: string;                // Local UUID, not tied to account
  currentTier: AgeTier;
  completedChallenges: string[];
  loveTokens: number;
  badges: string[];
  playTime: number;                // Minutes played (local only)
  structuresBuilt: number;
}

export interface UserPreferences {
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  gameplay: GameplayPreferences;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  soundVolume: number;
  particleEffects: 'full' | 'reduced' | 'off';
  hapticFeedback: boolean;
  breakReminders: boolean;
  stimFriendly: boolean;
}

export interface GameplayPreferences {
  difficulty: 'easy' | 'normal' | 'hard';
  showTutorials: boolean;
  autoSave: boolean;
  gridEnabled: boolean;
  snapEnabled: boolean;
}

export type AgeTier = 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia' | 'adult' | 'senior';

export class PrivacyManager {
  private static readonly DEFAULT_PRIVACY: PrivacySettings = {
    localOnly: true,
    cloudSyncEnabled: false,
    analyticsEnabled: false,      // Always false
    telemetryEnabled: false,       // Always false
    dataRetention: 'forever',
  };

  private privacySettings: PrivacySettings;
  private encryptionKey: CryptoKey | null = null;

  constructor() {
    this.privacySettings = { ...PrivacyManager.DEFAULT_PRIVACY };
  }

  /**
   * Initialize privacy manager - load settings from local storage
   */
  async init(): Promise<void> {
    const stored = localStorage.getItem('p31_game_privacy_settings');
    if (stored) {
      try {
        this.privacySettings = JSON.parse(stored);
        // Enforce privacy defaults - never allow analytics/telemetry
        this.privacySettings.analyticsEnabled = false;
        this.privacySettings.telemetryEnabled = false;
      } catch (e) {
        console.warn('[PrivacyManager] Failed to load settings, using defaults');
      }
    }

    // Generate encryption key for local data
    await this.generateEncryptionKey();
  }

  /**
   * Generate encryption key for local data encryption
   */
  private async generateEncryptionKey(): Promise<void> {
    // Generate key from user's device fingerprint (local only, never sent)
    const deviceId = await this.getDeviceId();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(deviceId),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    this.encryptionKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('p31-game-engine'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Get device ID (local only, never sent anywhere)
   */
  private async getDeviceId(): Promise<string> {
    // Use localStorage to store a local UUID
    let deviceId = localStorage.getItem('p31_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('p31_device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Encrypt game data before storage
   */
  async encryptGameData(data: GameData): Promise<EncryptedStructure> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const jsonData = JSON.stringify(data);
    const encodedData = new TextEncoder().encode(jsonData);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.encryptionKey,
      encodedData
    );

    return {
      id: crypto.randomUUID(),
      name: data.structures[0]?.name || 'Untitled',
      encryptedData: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv),
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
  }

  /**
   * Decrypt game data from storage
   */
  async decryptGameData(encrypted: EncryptedStructure): Promise<GameData> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const encryptedData = this.base64ToArrayBuffer(encrypted.encryptedData);
    const iv = this.base64ToArrayBuffer(encrypted.iv);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.encryptionKey,
      encryptedData
    );

    const jsonData = new TextDecoder().decode(decrypted);
    return JSON.parse(jsonData);
  }

  /**
   * Save privacy settings (local only)
   */
  savePrivacySettings(settings: Partial<PrivacySettings>): void {
    this.privacySettings = {
      ...this.privacySettings,
      ...settings,
      // Enforce privacy - never allow analytics/telemetry
      analyticsEnabled: false,
      telemetryEnabled: false,
    };
    localStorage.setItem('p31_game_privacy_settings', JSON.stringify(this.privacySettings));
  }

  /**
   * Get privacy settings
   */
  getPrivacySettings(): PrivacySettings {
    return { ...this.privacySettings };
  }

  /**
   * Check if cloud sync is enabled (opt-in only)
   */
  isCloudSyncEnabled(): boolean {
    return this.privacySettings.cloudSyncEnabled;
  }

  /**
   * Enable cloud sync (user must explicitly opt-in)
   */
  enableCloudSync(encryptionKey: string): void {
    this.savePrivacySettings({
      cloudSyncEnabled: true,
      // Store encryption key for cloud sync (user-controlled)
      // This would be used for end-to-end encrypted sync
    });
  }

  /**
   * Disable cloud sync
   */
  disableCloudSync(): void {
    this.savePrivacySettings({
      cloudSyncEnabled: false,
    });
  }

  /**
   * Clean up old data based on retention policy
   */
  async cleanupOldData(): Promise<void> {
    const retention = this.privacySettings.dataRetention;
    if (retention === 'forever' || retention === 'manual') {
      return; // Don't clean up
    }

    const days = retention === '30days' ? 30 : 7;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

    // Clean up old structures from IndexedDB
    // Implementation would depend on storage system
  }

  // Utility functions
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
