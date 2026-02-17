/**
 * Security Manager - Threat detection, persistent audit logging
 */

import { Logger } from '../utils/logger';
import { DataStore } from '../database/store';

interface SecurityStatus {
  overallLevel: 'fortress' | 'high' | 'medium' | 'low';
  firewallActive: boolean;
  encryptionEnabled: boolean;
  lastScan: string;
  threatCount: number;
  auditLogEntries: number;
  activeSessions: number;
  blockedIPs: string[];
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  ip: string;
  result: 'success' | 'failure' | 'blocked';
  details?: string;
}

interface ScanResult {
  clean: boolean;
  threats: number;
  scannedAt: string;
  findings: string[];
  duration: number;
}

export class SecurityManager {
  private logger: Logger;
  private store: DataStore;
  private status: SecurityStatus;
  private interval: NodeJS.Timeout | null = null;
  private activeSessionCount = 0;

  constructor() {
    this.logger = new Logger('SecurityManager');
    this.store = DataStore.getInstance();
    this.status = {
      overallLevel: 'fortress',
      firewallActive: true,
      encryptionEnabled: true,
      lastScan: new Date().toISOString(),
      threatCount: 0,
      auditLogEntries: 0,
      activeSessions: 0,
      blockedIPs: [],
    };
    this.logger.info('Security Manager initialized');
  }

  async start(): Promise<void> {
    this.logger.info('Security Manager started');
    this.interval = setInterval(() => this.scan(), 60000);
    await this.scan();
    this.logAudit('system_start', 'system', '127.0.0.1', 'success', 'Security Manager started');
  }

  async stop(): Promise<void> {
    if (this.interval) clearInterval(this.interval);
    this.store.flush();
    this.logger.info('Security Manager stopped');
  }

  async getStatus(): Promise<SecurityStatus> {
    const auditCount = this.store.count('audit_log');
    return {
      ...this.status,
      auditLogEntries: auditCount,
      activeSessions: this.activeSessionCount,
    };
  }

  async scan(): Promise<ScanResult> {
    const startTime = Date.now();
    const findings: string[] = [];
    let threats = 0;

    // Real check: memory anomalies
    const mem = process.memoryUsage();
    if (mem.heapUsed > 500 * 1024 * 1024) {
      findings.push('High memory usage detected — potential memory leak');
      threats++;
    }

    // Real check: uptime
    if (process.uptime() < 5) {
      findings.push('System recently restarted — monitoring for stability');
    }

    // Real check: security config
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'super-centaur-secret-key') {
      findings.push('Default JWT secret detected — update for production');
    }

    if (!process.env.OPENAI_API_KEY) {
      findings.push('OpenAI API key not configured — AI features limited');
    }

    const duration = Date.now() - startTime;
    this.status.lastScan = new Date().toISOString();
    this.status.threatCount = threats;

    if (threats > 3) this.status.overallLevel = 'low';
    else if (threats > 1) this.status.overallLevel = 'medium';
    else if (threats > 0) this.status.overallLevel = 'high';
    else this.status.overallLevel = 'fortress';

    const result: ScanResult = {
      clean: threats === 0,
      threats,
      scannedAt: this.status.lastScan,
      findings,
      duration,
    };

    this.logAudit('security_scan', 'system', '127.0.0.1', 'success',
      `Scan complete: ${findings.length} findings, ${threats} threats`);

    this.logger.info(`Security scan completed — ${threats} threat(s), ${findings.length} finding(s)`);
    return result;
  }

  async testConnection(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  setActiveSessionCount(count: number): void {
    this.activeSessionCount = count;
  }

  logAudit(action: string, userId: string, ip: string, result: 'success' | 'failure' | 'blocked', details?: string): void {
    this.store.insert('audit_log', {
      timestamp: new Date().toISOString(),
      action,
      userId,
      ip,
      result,
      details: details || '',
    });
  }

  getAuditLog(limit = 50): AuditEntry[] {
    return this.store.recent<any>('audit_log', limit);
  }
}

export default SecurityManager;
