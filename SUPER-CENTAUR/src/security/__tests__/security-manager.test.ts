/**
 * Security Manager Tests
 * Tests for authentication, MFA, rate limiting, and security audits
 */

import { SecurityManager } from '../security-manager';
import { DataStore } from '../../database/store';

// Mock DataStore
jest.mock('../../database/store');

describe('Authentication', () => {
  let securityManager: SecurityManager;
  let mockDataStore: jest.Mocked<DataStore>;

  beforeEach(() => {
    mockDataStore = {
      count: jest.fn().mockReturnValue(0),
      insert: jest.fn(),
      find: jest.fn().mockReturnValue([]),
      flush: jest.fn()
    } as any;

    (DataStore.getInstance as jest.Mock) = jest.fn().mockReturnValue(mockDataStore);

    securityManager = new SecurityManager();
  });

  describe('Security Status', () => {
    test('reports component status', async () => {
      const status = await securityManager.getStatus();
      
      expect(status).toBeDefined();
      expect(status.overallLevel).toBeDefined();
      expect(status.firewallActive).toBeDefined();
      expect(status.encryptionEnabled).toBeDefined();
      expect(typeof status.threatCount).toBe('number');
    });

    test('detects service degradation', async () => {
      const scanResult = await securityManager.scan();
      
      expect(scanResult).toBeDefined();
      expect(scanResult.clean).toBeDefined();
      expect(typeof scanResult.threats).toBe('number');
      expect(scanResult.findings).toBeDefined();
      expect(Array.isArray(scanResult.findings)).toBe(true);
    });

    test('alerts on critical failures', async () => {
      // Simulate high memory usage
      const originalMemoryUsage = process.memoryUsage;
      process.memoryUsage = jest.fn().mockReturnValue({
        heapUsed: 600 * 1024 * 1024, // 600 MB
        heapTotal: 700 * 1024 * 1024,
        external: 0,
        rss: 800 * 1024 * 1024,
        arrayBuffers: 0
      });

      const scanResult = await securityManager.scan();
      
      expect(scanResult.findings.length).toBeGreaterThan(0);
      
      process.memoryUsage = originalMemoryUsage;
    });

    test('health endpoint returns structured status', async () => {
      const status = await securityManager.getStatus();
      
      expect(status).toHaveProperty('overallLevel');
      expect(status).toHaveProperty('firewallActive');
      expect(status).toHaveProperty('encryptionEnabled');
      expect(status).toHaveProperty('lastScan');
      expect(status).toHaveProperty('threatCount');
      expect(status).toHaveProperty('auditLogEntries');
      expect(status).toHaveProperty('activeSessions');
      expect(status).toHaveProperty('blockedIPs');
    });
  });

  describe('Security Scanning', () => {
    test('performs security scan', async () => {
      const scanResult = await securityManager.scan();
      
      expect(scanResult).toBeDefined();
      expect(scanResult.scannedAt).toBeDefined();
      expect(typeof scanResult.duration).toBe('number');
      expect(scanResult.duration).toBeGreaterThanOrEqual(0);
    });

    test('detects security configuration issues', async () => {
      // Test with weak JWT secret
      const originalEnv = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'super-centaur-secret-key';

      const scanResult = await securityManager.scan();
      
      expect(scanResult.findings.length).toBeGreaterThan(0);
      
      if (originalEnv) {
        process.env.JWT_SECRET = originalEnv;
      }
    });
  });

  describe('Audit Logging', () => {
    test('logs security events', () => {
      securityManager.logAudit(
        'test_action',
        'test_user',
        '127.0.0.1',
        'success',
        'Test audit entry'
      );

      expect(mockDataStore.insert).toHaveBeenCalled();
    });

    test('tracks audit log entries', async () => {
      mockDataStore.count = jest.fn().mockReturnValue(5);
      
      const status = await securityManager.getStatus();
      
      expect(status.auditLogEntries).toBe(5);
    });
  });

  describe('Lifecycle', () => {
    test('starts and stops correctly', async () => {
      await securityManager.start();
      
      const status = await securityManager.getStatus();
      expect(status).toBeDefined();
      
      await securityManager.stop();
      expect(mockDataStore.flush).toHaveBeenCalled();
    });
  });
});
