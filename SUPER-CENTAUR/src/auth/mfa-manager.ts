import * as crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { DataStore } from '../database/store';
import { Logger } from '../utils/logger';

export interface MFADevice {
  id: string;
  userId: string;
  secret: string;
  backupCodes: string[];
  enabled: boolean;
  lastUsed: Date | null;
  createdAt: Date;
  attempts: number;
  lockedUntil: Date | null;
}

export interface MFAChallenge {
  id: string;
  userId: string;
  deviceId: string;
  challengeToken: string;
  expiresAt: Date;
  used: boolean;
}

export class MFAManager {
  private logger: Logger;
  private store: DataStore;
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly CHALLENGE_EXPIRY = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.logger = new Logger('MFAManager');
    this.store = DataStore.getInstance();
  }

  /**
   * Generate MFA secret for a user
   */
  public generateMFASecret(userId: string): { secret: string, qrCodeUrl: string, backupCodes: string[] } {
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `SUPER CENTAUR (${userId})`,
        issuer: 'SUPER CENTAUR',
        length: 32
      });

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Store device
      const device: MFADevice = {
        id: crypto.randomUUID(),
        userId,
        secret: secret.base32!,
        backupCodes,
        enabled: false, // Not enabled until verified
        lastUsed: null,
        createdAt: new Date(),
        attempts: 0,
        lockedUntil: null
      };

      this.store.insert('mfa_devices', device);

      this.logger.info(`MFA secret generated for user ${userId}`);
      
      return {
        secret: secret.base32!,
        qrCodeUrl: secret.otpauth_url!,
        backupCodes
      };
    } catch (error) {
      this.logger.error('Failed to generate MFA secret:', error);
      throw new Error('Failed to generate MFA setup');
    }
  }

  /**
   * Verify MFA setup and enable device
   */
  public async verifyMFADevice(userId: string, token: string): Promise<boolean> {
    try {
      const device = this.getDeviceByUserId(userId);
      if (!device) {
        throw new Error('No MFA device found for user');
      }

      if (device.enabled) {
        throw new Error('MFA device already enabled');
      }

      const verified = speakeasy.totp.verify({
        secret: device.secret,
        encoding: 'base32',
        token,
        window: 2 // Allow 2 time steps tolerance
      });

      if (verified) {
        // Enable the device
        this.store.update('mfa_devices', device.id, {
          enabled: true,
          lastUsed: new Date()
        });

        this.logger.info(`MFA device enabled for user ${userId}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('MFA verification failed:', error);
      throw error;
    }
  }

  /**
   * Verify MFA token for authentication
   */
  public async verifyMFAToken(userId: string, token: string): Promise<boolean> {
    try {
      const device = this.getDeviceByUserId(userId);
      if (!device) {
        throw new Error('No MFA device found for user');
      }

      if (!device.enabled) {
        throw new Error('MFA device not enabled');
      }

      // Check if device is locked
      if (device.lockedUntil && device.lockedUntil > new Date()) {
        throw new Error('MFA device is locked due to too many failed attempts');
      }

      // Try TOTP verification
      const totpVerified = speakeasy.totp.verify({
        secret: device.secret,
        encoding: 'base32',
        token,
        window: 2
      });

      if (totpVerified) {
        // Reset attempts on successful verification
        this.store.update('mfa_devices', device.id, {
          attempts: 0,
          lockedUntil: null,
          lastUsed: new Date()
        });

        this.logger.info(`MFA token verified for user ${userId}`);
        return true;
      }

      // Try backup code verification
      const backupCodeVerified = device.backupCodes.some((code, index) => {
        if (code === token.toLowerCase()) {
          // Remove used backup code
          device.backupCodes.splice(index, 1);
          this.store.update('mfa_devices', device.id, {
            backupCodes: device.backupCodes,
            lastUsed: new Date()
          });
          return true;
        }
        return false;
      });

      if (backupCodeVerified) {
        this.logger.info(`MFA backup code verified for user ${userId}`);
        return true;
      }

      // Increment failed attempts
      const newAttempts = device.attempts + 1;
      let updateData: any = { attempts: newAttempts };

      if (newAttempts >= this.MAX_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
        this.logger.warn(`MFA device locked for user ${userId} due to too many failed attempts`);
      }

      this.store.update('mfa_devices', device.id, updateData);
      
      return false;
    } catch (error) {
      this.logger.error('MFA token verification failed:', error);
      throw error;
    }
  }

  /**
   * Generate new backup codes
   */
  public generateNewBackupCodes(userId: string): string[] {
    try {
      const device = this.getDeviceByUserId(userId);
      if (!device) {
        throw new Error('No MFA device found for user');
      }

      const newBackupCodes = this.generateBackupCodes();
      
      this.store.update('mfa_devices', device.id, {
        backupCodes: newBackupCodes
      });

      this.logger.info(`New backup codes generated for user ${userId}`);
      return newBackupCodes;
    } catch (error) {
      this.logger.error('Failed to generate backup codes:', error);
      throw error;
    }
  }

  /**
   * Disable MFA for a user
   */
  public disableMFA(userId: string): void {
    try {
      const device = this.getDeviceByUserId(userId);
      if (device) {
        this.store.update('mfa_devices', device.id, {
          enabled: false,
          backupCodes: []
        });

        this.logger.info(`MFA disabled for user ${userId}`);
      }
    } catch (error) {
      this.logger.error('Failed to disable MFA:', error);
      throw error;
    }
  }

  /**
   * Check if user has MFA enabled
   */
  public hasMFADevice(userId: string): boolean {
    const device = this.getDeviceByUserId(userId);
    return device ? device.enabled : false;
  }

  /**
   * Get MFA device status
   */
  public getMFAStatus(userId: string): any {
    const device = this.getDeviceByUserId(userId);
    if (!device) {
      return { enabled: false, hasDevice: false };
    }

    return {
      enabled: device.enabled,
      hasDevice: true,
      lastUsed: device.lastUsed,
      backupCodesRemaining: device.backupCodes.length,
      locked: device.lockedUntil && device.lockedUntil > new Date()
    };
  }

  /**
   * Generate QR code for MFA setup
   */
  public async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      this.logger.error('Failed to generate QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Get device by user ID
   */
  private getDeviceByUserId(userId: string): MFADevice | null {
    const devices = this.store.list('mfa_devices', { userId });
    if (devices.length === 0) return null;
    
    const device = devices[0];
    return {
      id: device.id,
      userId: device.userId,
      secret: device.secret,
      backupCodes: device.backupCodes,
      enabled: device.enabled,
      lastUsed: device.lastUsed ? new Date(device.lastUsed) : null,
      createdAt: new Date(device.createdAt),
      attempts: device.attempts || 0,
      lockedUntil: device.lockedUntil ? new Date(device.lockedUntil) : null
    };
  }

  /**
   * Generate secure backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-character alphanumeric codes
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Clean up expired challenges
   */
  public cleanupExpiredChallenges(): void {
    try {
      const challenges = this.store.list('mfa_challenges');
      const now = new Date();
      
      challenges.forEach(challenge => {
        if (challenge.expiresAt < now) {
          this.store.delete('mfa_challenges', challenge.id);
        }
      });
    } catch (error) {
      this.logger.error('Failed to cleanup expired challenges:', error);
    }
  }
}

export default MFAManager;