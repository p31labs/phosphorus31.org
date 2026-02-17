import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { DataStore } from '../database/store';
import { Logger } from '../utils/logger';
import MFAManager from './mfa-manager';

export class AuthManager {
  private logger: Logger;
  private store: DataStore;
  private secret: string;

  constructor() {
    this.logger = new Logger('AuthManager');
    this.store = DataStore.getInstance();
    
    // CRITICAL: Require JWT secret from environment
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required for security');
    }
    this.secret = process.env.JWT_SECRET;
    
    // DO NOT seed default admin user - force secure setup
    this.logger.info('AuthManager initialized with secure configuration');
  }

  /**
   * CRITICAL: Removed default admin user seeding for security
   * Admin users must be created through secure setup process
   */
  private async seedAdmin() {
    // DO NOT seed default admin user - this is a security vulnerability
    this.logger.warn('Default admin user seeding disabled for security. Use secure setup process.');
  }

  public async login(username: string, password: string): Promise<{ token: string, user: any } | null> {
    const users = this.store.list('users', { username });
    if (users.length === 0) return null;

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) return null;

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      this.secret,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      return null;
    }
  }

  public async register(username: string, password: string, role: string = 'user'): Promise<any> {
    const existing = this.store.list('users', { username });
    if (existing.length > 0) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.store.insert('users', {
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Enhanced login with MFA support
   */
  public async loginWithMFA(username: string, password: string): Promise<{ 
    success: boolean, 
    requiresMFA?: boolean, 
    mfaToken?: string, 
    token?: string,
    user?: any, 
    error?: string 
  }> {
    const users = this.store.list('users', { username });
    if (users.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check if user has MFA enabled
    const mfaManager = new MFAManager();
    const hasMFA = mfaManager.hasMFADevice(user.id);

    if (hasMFA) {
      // Generate temporary token for MFA challenge
      const mfaToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role, mfaRequired: true },
        this.secret,
        { expiresIn: '10m' } // Short expiry for MFA challenge
      );

      return {
        success: false,
        requiresMFA: true,
        mfaToken,
        user: { id: user.id, username: user.username, role: user.role }
      };
    }

    // No MFA required, proceed with normal login
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      this.secret,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword, token };
  }

  /**
   * Complete MFA authentication
   */
  public async completeMFA(mfaToken: string, mfaCode: string): Promise<{ 
    success: boolean, 
    token?: string, 
    user?: any, 
    error?: string 
  }> {
    try {
      // Verify the MFA challenge token
      const payload = jwt.verify(mfaToken, this.secret) as any;
      
      if (!payload.mfaRequired) {
        return { success: false, error: 'Invalid MFA challenge' };
      }

      // Verify MFA code
      const mfaManager = new MFAManager();
      const mfaVerified = await mfaManager.verifyMFAToken(payload.id, mfaCode);

      if (!mfaVerified) {
        return { success: false, error: 'Invalid MFA code' };
      }

      // Generate final authentication token
      const token = jwt.sign(
        { id: payload.id, username: payload.username, role: payload.role },
        this.secret,
        { expiresIn: '24h' }
      );

      // Get user details
      const users = this.store.list('users', { id: payload.id });
      const user = users[0];
      const { password: _, ...userWithoutPassword } = user;

      return { success: true, token, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: 'MFA authentication failed' };
    }
  }

  /**
   * Setup MFA for a user
   */
  public async setupMFA(userId: string): Promise<{ secret: string, qrCodeUrl: string, backupCodes: string[] }> {
    const mfaManager = new MFAManager();
    return mfaManager.generateMFASecret(userId);
  }

  /**
   * Enable MFA for a user
   */
  public async enableMFA(userId: string, mfaToken: string): Promise<boolean> {
    const mfaManager = new MFAManager();
    return mfaManager.verifyMFADevice(userId, mfaToken);
  }

  /**
   * Disable MFA for a user
   */
  public async disableMFA(userId: string): Promise<void> {
    const mfaManager = new MFAManager();
    mfaManager.disableMFA(userId);
  }

  /**
   * Get MFA status for a user
   */
  public getMFAStatus(userId: string): any {
    const mfaManager = new MFAManager();
    return mfaManager.getMFAStatus(userId);
  }
}
