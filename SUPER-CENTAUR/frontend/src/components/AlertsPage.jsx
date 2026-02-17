import React, { useState, useEffect } from 'react';
import { BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import StatusBadge from './ui/StatusBadge';

const SEVERITY_MAP = {
  info: { color: 'pending', icon: 'ℹ️' },
  warning: { color: 'warning', icon: '⚠️' },
  error: { color: 'error', icon: '❌' },
  critical: { color: 'error', icon: '🚨' },
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [monitoring, setMonitoring] = useState({
    systemHealth: 'healthy',
    uptime: 0,
    services: {},
    metrics: { requestsPerMinute: 0, errorRate: 0, avgResponseTime: 0, activeUsers: 0 },
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [alertsRes, monRes] = await Promise.all([
        api.get('/api/system/alerts'),
        api.get('/api/system/monitoring'),
      ]);
      setAlerts(alertsRes.data);
      setMonitoring(monRes.data);
    } catch {
      // Toast auto-fires
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      await api.post('/api/system/alerts/acknowledge', { alertId });
      loadData();
    } catch {
      // Toast auto-fires
    }
  };

  const healthColor = {
    healthy: 'active',
    degraded: 'warning',
    critical: 'error',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Alerts & Monitoring</h1>
          <p className="text-muted mt-1">Real-Time System Intelligence</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-warning to-accent rounded-xl flex items-center justify-center">
          <BellAlertIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">System Health</p>
            <span className="text-2xl" aria-hidden="true">💚</span>
          </div>
          <p className="text-2xl font-bold text-main capitalize">{monitoring.systemHealth}</p>
          <StatusBadge status={healthColor[monitoring.systemHealth] || 'pending'} />
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Uptime</p>
            <span className="text-2xl" aria-hidden="true">⏱️</span>
          </div>
          <p className="text-2xl font-bold text-main">{Math.floor(monitoring.uptime / 60)}m</p>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Requests/min</p>
            <span className="text-2xl" aria-hidden="true">📊</span>
          </div>
          <p className="text-2xl font-bold text-main">{monitoring.metrics.requestsPerMinute}</p>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">Active Users</p>
            <span className="text-2xl" aria-hidden="true">👥</span>
          </div>
          <p className="text-2xl font-bold text-main">{monitoring.metrics.activeUsers}</p>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(monitoring.services).map(([name, svc]) => (
            <div key={name} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-main capitalize">{name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted">{svc.latency}ms</span>
                <StatusBadge status={svc.status === 'healthy' ? 'active' : 'error'} label={svc.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alerts List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-main">Recent Alerts</h3>
          <span className="text-sm text-muted">{alerts.length} total</span>
        </div>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon className="w-12 h-12 text-success mb-3" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-main font-medium">All clear</p>
            <p className="text-sm text-muted">No active alerts at this time.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => {
              const meta = SEVERITY_MAP[alert.severity] || SEVERITY_MAP.info;
              return (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-4 bg-surface rounded-lg border border-border ${alert.acknowledged ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl" aria-hidden="true">{meta.icon}</span>
                    <div>
                      <p className="font-medium text-main">{alert.message}</p>
                      <p className="text-xs text-muted">
                        {alert.source} &middot; {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={meta.color} label={alert.severity} />
                    {!alert.acknowledged && (
                      <Button
                        variant="secondary"
                        className="text-xs"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AlertsPage;
