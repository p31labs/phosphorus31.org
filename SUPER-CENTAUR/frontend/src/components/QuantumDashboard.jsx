import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Card } from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import StatusBadge from './ui/StatusBadge';

const QuantumDashboard = () => {
  const [metrics, setMetrics] = useState({
    consciousness: 0,
    financialHealth: 0,
    legalStatus: 0,
    medicalStatus: 0,
    blockchainHealth: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [consciousnessRes, monitoringRes, walletRes] = await Promise.all([
        api.get('/api/consciousness/status'),
        api.get('/api/system/monitoring'),
        api.get('/api/wallet/balance'),
      ]);

      const c = consciousnessRes.data.metrics || {};
      const health = monitoringRes.data;
      const totalServices = Object.keys(health.services || {}).length || 1;
      const healthyServices = Object.values(health.services || {}).filter((s) => s.status === 'healthy').length;

      setMetrics({
        consciousness: Math.round((c.coherence + c.focus + c.creativity + c.awareness + c.balance) / 5) || 0,
        financialHealth: Math.min(100, Math.round((walletRes.data.balance / 150) )),
        legalStatus: healthyServices > 0 ? 90 : 50,
        medicalStatus: healthyServices > 0 ? 85 : 50,
        blockchainHealth: Math.round((healthyServices / totalServices) * 100),
      });

      // Build activity from alerts
      const alerts = health.alerts || [];
      setRecentActivity(
        alerts.slice(0, 4).map((a, i) => ({
          id: a.id || i,
          title: a.message,
          time: new Date(a.timestamp).toLocaleTimeString(),
          type: a.source === 'legal' ? 'legal' : a.source === 'medical' ? 'medical' : a.source === 'blockchain' ? 'blockchain' : 'finance',
        }))
      );
    } catch {
      // Toast auto-fires
    }
  };

  const getHealthStatus = (value) => {
    if (value >= 80) return 'active';
    if (value >= 60) return 'warning';
    return 'critical';
  };

  const metricItems = [
    { key: 'consciousness', label: 'Consciousness', value: metrics.consciousness, icon: '🧠' },
    { key: 'financial', label: 'Financial', value: metrics.financialHealth, icon: '$' },
    { key: 'legal', label: 'Legal', value: metrics.legalStatus, icon: '⚖️' },
    { key: 'medical', label: 'Medical', value: metrics.medicalStatus, icon: '🛡️' },
    { key: 'blockchain', label: 'Blockchain', value: metrics.blockchainHealth, icon: '📊' },
  ];

  const quickActions = [
    { path: '/legal', label: 'Legal AI', icon: '⚖️', desc: 'Nuclear Legal Analysis' },
    { path: '/love-economy', label: 'L.O.V.E.', icon: '❤️', desc: 'Financial Sovereignty' },
    { path: '/medical', label: 'Medical Hub', icon: '🛡️', desc: 'Health Documentation' },
    { path: '/blockchain', label: 'Blockchain', icon: '$', desc: 'Autonomous Agents' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Quantum Brain Dashboard</h1>
        <p className="text-muted mt-1">System Overview & Performance Metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricItems.map((m) => (
          <Card key={m.key} className="group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-white text-lg">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-main text-sm">{m.label}</h3>
                  <StatusBadge status={getHealthStatus(m.value)} />
                </div>
              </div>
              <div className="text-xl font-bold text-main">{m.value}%</div>
            </div>
            <ProgressBar value={m.value} />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Card className="group hover:scale-105 transition-all duration-300 h-full flex items-center space-x-4 cursor-pointer">
              <div className="w-14 h-14 bg-linear-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform text-white text-2xl shrink-0">
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold text-main">{action.label}</h3>
                <p className="text-sm text-muted">{action.desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'legal' ? 'bg-primary' :
                  activity.type === 'finance' ? 'bg-accent' :
                  activity.type === 'medical' ? 'bg-success' : 'bg-warning'
                }`} aria-hidden="true" />
                <div>
                  <p className="text-main font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted">{activity.time}</p>
                </div>
              </div>
              <StatusBadge status="active" label="Done" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuantumDashboard;
