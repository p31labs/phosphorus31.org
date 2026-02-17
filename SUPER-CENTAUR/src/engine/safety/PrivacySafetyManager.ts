/**
 * Privacy Safety Manager
 * Protects user data and privacy
 */

export interface PrivacyConfig {
  enabled: boolean;
  encryptLocalData: boolean;
  anonymizeData: boolean;
  requireConsent: boolean;
  dataRetentionDays: number;
  allowDataSharing: boolean;
  allowAnalytics: boolean;
  allowLocationTracking: boolean;
}

export interface PrivacyEvent {
  type: 'data_access' | 'data_export' | 'data_share' | 'consent_given' | 'consent_revoked';
  timestamp: number;
  details: Record<string, any>;
}

export class PrivacySafetyManager {
  private config: PrivacyConfig;
  private consentGiven: boolean = false;
  private privacyEvents: PrivacyEvent[] = [];
  private maxEvents: number = 1000;

  constructor(config?: Partial<PrivacyConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      encryptLocalData: config?.encryptLocalData ?? true,
      anonymizeData: config?.anonymizeData ?? true,
      requireConsent: config?.requireConsent ?? true,
      dataRetentionDays: config?.dataRetentionDays ?? 90,
      allowDataSharing: config?.allowDataSharing ?? false,
      allowAnalytics: config?.allowAnalytics ?? false,
      allowLocationTracking: config?.allowLocationTracking ?? false
    };

    this.loadConsent();
  }

  /**
   * Initialize privacy safety manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🔒 Privacy Safety Manager disabled');
      return;
    }

    console.log('🔒 Privacy Safety Manager initialized');

    // Clean up old data
    this.cleanupOldData();
  }

  /**
   * Request consent
   */
  public requestConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.config.requireConsent) {
        resolve(true);
        return;
      }

      // Emit event for UI to show consent dialog
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('privacy:consentRequested', {
          detail: {
            onAccept: () => {
              this.giveConsent();
              resolve(true);
            },
            onReject: () => {
              this.revokeConsent();
              resolve(false);
            }
          }
        }));
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Give consent
   */
  public giveConsent(): void {
    this.consentGiven = true;
    this.saveConsent();
    this.recordEvent('consent_given', {});
    console.log('🔒 Privacy consent given');
  }

  /**
   * Revoke consent
   */
  public revokeConsent(): void {
    this.consentGiven = false;
    this.saveConsent();
    this.recordEvent('consent_revoked', {});
    this.cleanupUserData();
    console.log('🔒 Privacy consent revoked');
  }

  /**
   * Check if consent is given
   */
  public hasConsent(): boolean {
    return !this.config.requireConsent || this.consentGiven;
  }

  /**
   * Check if data sharing is allowed
   */
  public canShareData(): boolean {
    return this.hasConsent() && this.config.allowDataSharing;
  }

  /**
   * Check if analytics are allowed
   */
  public canCollectAnalytics(): boolean {
    return this.hasConsent() && this.config.allowAnalytics;
  }

  /**
   * Check if location tracking is allowed
   */
  public canTrackLocation(): boolean {
    return this.hasConsent() && this.config.allowLocationTracking;
  }

  /**
   * Anonymize data
   */
  public anonymizeData(data: any): any {
    if (!this.config.anonymizeData) return data;

    const anonymized = { ...data };

    // Remove personally identifiable information
    delete anonymized.name;
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.address;
    delete anonymized.ipAddress;
    delete anonymized.deviceId;

    // Hash user ID if present
    if (anonymized.userId) {
      anonymized.userId = this.hashString(anonymized.userId);
    }

    return anonymized;
  }

  /**
   * Encrypt sensitive data
   */
  public async encryptData(data: string): Promise<string> {
    if (!this.config.encryptLocalData) return data;

    // Simple encryption (in production, use proper encryption)
    try {
      // Use Web Crypto API if available
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        // For now, return base64 encoded (in production, use proper encryption)
        return btoa(data);
      }
    } catch (error) {
      console.warn('Encryption not available:', error);
    }

    return data;
  }

  /**
   * Decrypt data
   */
  public async decryptData(encrypted: string): Promise<string> {
    if (!this.config.encryptLocalData) return encrypted;

    try {
      return atob(encrypted);
    } catch (error) {
      console.warn('Decryption failed:', error);
      return encrypted;
    }
  }

  /**
   * Record privacy event
   */
  private recordEvent(type: PrivacyEvent['type'], details: Record<string, any>): void {
    const event: PrivacyEvent = {
      type,
      timestamp: Date.now(),
      details
    };

    this.privacyEvents.push(event);
    if (this.privacyEvents.length > this.maxEvents) {
      this.privacyEvents.shift();
    }
  }

  /**
   * Get privacy events
   */
  public getPrivacyEvents(): PrivacyEvent[] {
    return [...this.privacyEvents];
  }

  /**
   * Export user data (GDPR compliance)
   */
  public async exportUserData(): Promise<any> {
    if (!this.hasConsent()) {
      throw new Error('Consent required for data export');
    }

    this.recordEvent('data_export', {});

    // Collect all user data
    const userData = {
      structures: this.getStructures(),
      progress: this.getProgress(),
      settings: this.getSettings(),
      events: this.privacyEvents,
      exportedAt: Date.now()
    };

    return userData;
  }

  /**
   * Delete user data (GDPR compliance)
   */
  public async deleteUserData(): Promise<void> {
    this.recordEvent('data_access', { action: 'delete' });
    this.cleanupUserData();
    console.log('🔒 User data deleted');
  }

  /**
   * Cleanup old data
   */
  private cleanupOldData(): void {
    const cutoffDate = Date.now() - (this.config.dataRetentionDays * 24 * 60 * 60 * 1000);

    // Remove old events
    this.privacyEvents = this.privacyEvents.filter(
      event => event.timestamp > cutoffDate
    );

    // Remove old structures (if stored)
    this.cleanupOldStructures(cutoffDate);
  }

  /**
   * Cleanup user data
   */
  private cleanupUserData(): void {
    try {
      // Clear localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('game_') || key.startsWith('structure_') || key.startsWith('progress_')) {
          localStorage.removeItem(key);
        }
      });

      // Clear IndexedDB (if used)
      // Implementation depends on IndexedDB setup
    } catch (error) {
      console.warn('Failed to cleanup user data:', error);
    }
  }

  /**
   * Cleanup old structures
   */
  private cleanupOldStructures(cutoffDate: number): void {
    // Implementation depends on storage system
    // This is a placeholder
  }

  /**
   * Get structures (placeholder)
   */
  private getStructures(): any[] {
    // Implementation depends on storage system
    return [];
  }

  /**
   * Get progress (placeholder)
   */
  private getProgress(): any {
    // Implementation depends on storage system
    return {};
  }

  /**
   * Get settings (placeholder)
   */
  private getSettings(): any {
    // Implementation depends on storage system
    return {};
  }

  /**
   * Hash string (simple hash for anonymization)
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Load consent from storage
   */
  private loadConsent(): void {
    try {
      const saved = localStorage.getItem('privacy_consent');
      if (saved) {
        this.consentGiven = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load consent:', error);
    }
  }

  /**
   * Save consent to storage
   */
  private saveConsent(): void {
    try {
      localStorage.setItem('privacy_consent', JSON.stringify(this.consentGiven));
    } catch (error) {
      console.warn('Failed to save consent:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<PrivacyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  public getConfig(): PrivacyConfig {
    return { ...this.config };
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.privacyEvents = [];
  }
}
