/**
 * Monitoring System Tests
 * Tests for system health, service status, and alerting
 */

import { MonitoringSystem } from '../monitoring-system';
import { DataStore } from '../../database/store';

// Mock DataStore
jest.mock('../../database/store');

describe('System Health', () => {
  let monitoringSystem: MonitoringSystem;
  let mockDataStore: jest.Mocked<DataStore>;

  beforeEach(() => {
    mockDataStore = {
      insert: jest.fn(),
      find: jest.fn().mockReturnValue([]),
      flush: jest.fn()
    } as any;

    (DataStore.getInstance as jest.Mock) = jest.fn().mockReturnValue(mockDataStore);

    monitoringSystem = new MonitoringSystem();
  });

  describe('Component Status', () => {
    test('reports component status', async () => {
      const dashboard = await monitoringSystem.getDashboardData();
      
      expect(dashboard).toBeDefined();
      expect(dashboard.systemHealth).toBeDefined();
      expect(['healthy', 'degraded', 'critical']).toContain(dashboard.systemHealth);
      expect(dashboard.services).toBeDefined();
      expect(typeof dashboard.uptime).toBe('number');
    });

    test('detects service degradation', () => {
      monitoringSystem.updateServiceHealth('legal', 'degraded', 500);
      
      // Service should be marked as degraded
      const services = monitoringSystem.getServiceHealth();
      expect(services.get('legal')?.status).toBe('degraded');
    });

    test('alerts on critical failures', async () => {
      // Mark service as down multiple times
      monitoringSystem.updateServiceHealth('medical', 'down', 0);
      monitoringSystem.updateServiceHealth('medical', 'down', 0);
      monitoringSystem.updateServiceHealth('medical', 'down', 0);
      
      const dashboard = await monitoringSystem.getDashboardData();
      const alerts = dashboard.alerts.filter(a => 
        a.severity === 'error' || a.severity === 'critical'
      );
      
      expect(alerts.length).toBeGreaterThan(0);
    });

    test('health endpoint returns structured status', async () => {
      const dashboard = await monitoringSystem.getDashboardData();
      
      expect(dashboard).toHaveProperty('systemHealth');
      expect(dashboard).toHaveProperty('uptime');
      expect(dashboard).toHaveProperty('services');
      expect(dashboard).toHaveProperty('alerts');
      expect(dashboard).toHaveProperty('metrics');
      
      expect(dashboard.metrics).toHaveProperty('requestsPerMinute');
      expect(dashboard.metrics).toHaveProperty('errorRate');
      expect(dashboard.metrics).toHaveProperty('avgResponseTime');
      expect(dashboard.metrics).toHaveProperty('activeUsers');
    });
  });

  describe('Request Tracking', () => {
    test('records request metrics', () => {
      monitoringSystem.recordRequest(100, false);
      monitoringSystem.recordRequest(200, true);
      monitoringSystem.recordRequest(150, false);
      
      const dashboard = monitoringSystem.getDashboardData();
      expect(dashboard).toBeDefined();
    });

    test('calculates error rate', async () => {
      monitoringSystem.recordRequest(100, false);
      monitoringSystem.recordRequest(100, true);
      monitoringSystem.recordRequest(100, true);
      
      const dashboard = await monitoringSystem.getDashboardData();
      expect(dashboard.metrics.errorRate).toBeGreaterThan(0);
    });

    test('calculates average response time', async () => {
      monitoringSystem.recordRequest(100, false);
      monitoringSystem.recordRequest(200, false);
      monitoringSystem.recordRequest(150, false);
      
      const dashboard = await monitoringSystem.getDashboardData();
      expect(dashboard.metrics.avgResponseTime).toBeGreaterThan(0);
    });
  });

  describe('Service Health', () => {
    test('tracks multiple services', () => {
      const services = ['legal', 'medical', 'blockchain'];
      
      services.forEach(service => {
        monitoringSystem.updateServiceHealth(service, 'healthy', 50);
      });
      
      const health = monitoringSystem.getServiceHealth();
      services.forEach(service => {
        expect(health.has(service)).toBe(true);
        expect(health.get(service)?.status).toBe('healthy');
      });
    });

    test('tracks service latency', () => {
      monitoringSystem.updateServiceHealth('legal', 'healthy', 75);
      
      const health = monitoringSystem.getServiceHealth();
      expect(health.get('legal')?.latency).toBe(75);
    });

    test('tracks error count', () => {
      monitoringSystem.updateServiceHealth('medical', 'down', 0);
      monitoringSystem.updateServiceHealth('medical', 'down', 0);
      
      const health = monitoringSystem.getServiceHealth();
      expect(health.get('medical')?.errorCount).toBeGreaterThan(0);
    });
  });

  describe('Alerts', () => {
    test('adds alerts', () => {
      monitoringSystem.addAlert('warning', 'test', 'Test alert message');
      
      const dashboard = monitoringSystem.getDashboardData();
      const alerts = dashboard.alerts.filter(a => a.message === 'Test alert message');
      expect(alerts.length).toBeGreaterThan(0);
    });

    test('categorizes alerts by severity', () => {
      monitoringSystem.addAlert('info', 'test', 'Info alert');
      monitoringSystem.addAlert('warning', 'test', 'Warning alert');
      monitoringSystem.addAlert('error', 'test', 'Error alert');
      monitoringSystem.addAlert('critical', 'test', 'Critical alert');
      
      const dashboard = monitoringSystem.getDashboardData();
      const severities = dashboard.alerts.map(a => a.severity);
      expect(severities).toContain('info');
      expect(severities).toContain('warning');
      expect(severities).toContain('error');
      expect(severities).toContain('critical');
    });
  });

  describe('Lifecycle', () => {
    test('starts and stops correctly', async () => {
      await monitoringSystem.start();
      
      const dashboard = await monitoringSystem.getDashboardData();
      expect(dashboard).toBeDefined();
      
      await monitoringSystem.stop();
      expect(mockDataStore.flush).toHaveBeenCalled();
    });
  });
});
