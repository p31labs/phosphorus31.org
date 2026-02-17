import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import StatusBadge from './ui/StatusBadge';
import ProgressBar from './ui/ProgressBar';

const SecurityCenter = () => {
  const [securityStatus, setSecurityStatus] = useState({
    overallLevel: 'fortress',
    firewallActive: true,
    encryptionEnabled: true,
    lastScan: null,
    threatCount: 0,
    auditLogEntries: 0,
    activeSessions: 0,
    blockedIPs: [],
  });
  const [metrics, setMetrics] = useState({ cpuUsage: 0, memoryUsage: 0, responseTime: 0 });
  const [backupStatus, setBackupStatus] = useState({ lastBackup: null, totalBackups: 0 });

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      const [secRes, metRes, bkRes] = await Promise.all([
        api.get('/api/system/security'),
        api.get('/api/system/metrics'),
        api.get('/api/system/backup'),
      ]);
      setSecurityStatus(secRes.data);
      setMetrics(metRes.data);
      setBackupStatus(bkRes.data);
    } catch {
      // Toast auto-fires
    }
  };

  const [scanning, setScanning] = useState(false);
  const [auditLog, setAuditLog] = useState(null);

  const runSecurityScan = async () => {
    setScanning(true);
    try {
      const res = await api.post('/api/system/security/scan');
      toast.success(`Scan complete: ${res.data.findings?.length || 0} findings, ${res.data.threats || 0} threats`);
      loadSecurityData();
    } catch {
      // Toast auto-fires
    } finally {
      setScanning(false);
    }
  };

  const viewAuditLog = async () => {
    try {
      const res = await api.get('/api/system/security/audit');
      setAuditLog(res.data);
    } catch {
      // Toast auto-fires
    }
  };

  const createBackup = async () => {
    try {
      await api.post('/api/system/backup/create', { type: 'full' });
      toast.success('Backup created successfully');
      loadSecurityData();
    } catch {
      // Toast auto-fires
    }
  };

  const levelColor = {
    fortress: 'active',
    high: 'active',
    medium: 'warning',
    low: 'error',
    unknown: 'pending',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Security Center</h1>
          <p className="text-muted mt-1">Fortress-Level Protection & Audit</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
          <ShieldCheckIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Security Level</p>
            <span className="text-2xl" aria-hidden="true">🛡️</span>
          </div>
          <p className="text-2xl font-bold text-main capitalize">{securityStatus.overallLevel}</p>
          <StatusBadge status={levelColor[securityStatus.overallLevel] || 'pending'} />
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Threats Detected</p>
            <span className="text-2xl" aria-hidden="true">🔍</span>
          </div>
          <p className="text-2xl font-bold text-main">{securityStatus.threatCount}</p>
          <StatusBadge status={securityStatus.threatCount === 0 ? 'active' : 'error'} label={securityStatus.threatCount === 0 ? 'Clean' : 'Alert'} />
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Active Sessions</p>
            <span className="text-2xl" aria-hidden="true">👤</span>
          </div>
          <p className="text-2xl font-bold text-main">{securityStatus.activeSessions}</p>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Audit Entries</p>
            <span className="text-2xl" aria-hidden="true">📋</span>
          </div>
          <p className="text-2xl font-bold text-main">{securityStatus.auditLogEntries}</p>
        </Card>
      </div>

      {/* System Performance */}
      <Card>
        <h3 className="font-semibold text-main mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">CPU Usage</span>
              <span className="text-main font-medium">{Math.round(metrics.cpuUsage)}%</span>
            </div>
            <ProgressBar value={metrics.cpuUsage} label="CPU usage" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Memory Usage</span>
              <span className="text-main font-medium">{metrics.memoryUsage}%</span>
            </div>
            <ProgressBar value={metrics.memoryUsage} label="Memory usage" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Response Time</span>
              <span className="text-main font-medium">{metrics.responseTime}ms</span>
            </div>
            <ProgressBar value={Math.min(metrics.responseTime, 100)} label="Response time" />
          </div>
        </div>
      </Card>

      {/* Protection Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-main mb-4">Protection Systems</h3>
          <div className="space-y-3">
            {[
              { label: 'Firewall', active: securityStatus.firewallActive, icon: '🔥' },
              { label: 'Encryption', active: securityStatus.encryptionEnabled, icon: '🔐' },
              { label: 'Rate Limiting', active: true, icon: '⚡' },
              { label: 'CORS Protection', active: true, icon: '🌐' },
              { label: 'Helmet Headers', active: true, icon: '⛑️' },
            ].map((system) => (
              <div key={system.label} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <span aria-hidden="true">{system.icon}</span>
                  <span className="font-medium text-main">{system.label}</span>
                </div>
                <StatusBadge status={system.active ? 'active' : 'error'} label={system.active ? 'Enabled' : 'Disabled'} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-main mb-4">Backup Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-medium text-main">Last Backup</p>
                <p className="text-sm text-muted">
                  {backupStatus.lastBackup ? new Date(backupStatus.lastBackup).toLocaleString() : 'No backups yet'}
                </p>
              </div>
              <StatusBadge status={backupStatus.lastBackup ? 'active' : 'warning'} label={backupStatus.lastBackup ? 'Complete' : 'Pending'} />
            </div>
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-medium text-main">Total Backups</p>
                <p className="text-sm text-muted">{backupStatus.totalBackups} snapshots stored</p>
              </div>
              <span className="text-2xl" aria-hidden="true">💾</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-medium text-main">Auto-Backup</p>
                <p className="text-sm text-muted">Every 24 hours</p>
              </div>
              <StatusBadge status="active" label="Enabled" />
            </div>
          </div>
        </Card>
      </div>

      {/* Scan Controls */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Security Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={runSecurityScan} disabled={scanning} className="flex items-center justify-center space-x-3">
            <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
            <span>{scanning ? 'Scanning...' : 'Run Security Scan'}</span>
          </Button>
          <Button variant="secondary" onClick={createBackup} className="flex items-center justify-center space-x-3">
            <LockClosedIcon className="w-5 h-5" aria-hidden="true" />
            <span>Create Backup</span>
          </Button>
          <Button variant="accent" onClick={viewAuditLog} className="flex items-center justify-center space-x-3">
            <EyeIcon className="w-5 h-5" aria-hidden="true" />
            <span>View Audit Log</span>
          </Button>
        </div>
      </Card>

      {/* Audit Log (shown after clicking View Audit Log) */}
      {auditLog && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-main">Audit Log</h3>
            <Button variant="secondary" className="text-xs" onClick={() => setAuditLog(null)}>Close</Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {auditLog.length === 0 ? (
              <p className="text-sm text-muted">No audit entries yet.</p>
            ) : (
              auditLog.map((entry, i) => (
                <div key={entry.id || i} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border text-sm">
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={entry.result === 'success' ? 'active' : entry.result === 'blocked' ? 'error' : 'warning'} label={entry.result} />
                    <span className="text-main font-medium">{entry.action}</span>
                  </div>
                  <span className="text-muted text-xs">{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SecurityCenter;
