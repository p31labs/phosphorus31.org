import React, { useState, useEffect } from 'react';
import { CpuChipIcon, ChartBarIcon, EyeIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import StatusBadge from './ui/StatusBadge';
import ProgressBar from './ui/ProgressBar';

const ConsciousnessMonitor = () => {
  const [metrics, setMetrics] = useState({
    coherence: 75,
    focus: 82,
    creativity: 68,
    awareness: 79,
    balance: 85,
  });
  const [trends, setTrends] = useState([]);
  const [activeOptimizations, setActiveOptimizations] = useState([
    { id: 1, name: 'Quantum Coherence', status: 'active', level: 85 },
    { id: 2, name: 'Neural Synchronization', status: 'active', level: 78 },
    { id: 3, name: 'Cognitive Enhancement', status: 'paused', level: 65 },
    { id: 4, name: 'Emotional Regulation', status: 'active', level: 92 },
  ]);

  useEffect(() => {
    loadConsciousnessData();
    const interval = setInterval(loadConsciousnessData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadConsciousnessData = async () => {
    try {
      const response = await api.get('/api/consciousness/status');
      if (response.data.metrics) setMetrics(response.data.metrics);
      if (response.data.trends) setTrends(response.data.trends);
    } catch {
      // Toast auto-fires via API interceptor (silent on polling)
    }
  };

  const optimizeConsciousness = async (optimizationId) => {
    try {
      await api.post(`/api/consciousness/optimize/${optimizationId}`);
      loadConsciousnessData();
      toast.success('Optimization triggered');
    } catch {
      // Toast auto-fires
    }
  };

  const getHealthStatus = (value) => {
    if (value >= 80) return 'active';
    if (value >= 60) return 'warning';
    return 'critical';
  };

  const METRIC_ICONS = {
    coherence: '🔮',
    focus: '🎯',
    creativity: '✨',
    awareness: '👁️',
    balance: '⚖️',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Consciousness Monitor</h1>
          <p className="text-muted mt-1">Quantum Coherence & Cognitive Optimization</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
          <CpuChipIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <Card key={key} className="group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl" aria-hidden="true">{METRIC_ICONS[key] || '🧠'}</span>
                <div>
                  <h3 className="font-semibold text-main text-sm capitalize">{key}</h3>
                  <StatusBadge status={getHealthStatus(value)} />
                </div>
              </div>
              <div className="text-xl font-bold text-main">{value}%</div>
            </div>
            <ProgressBar value={value} label={`${key} level`} />
          </Card>
        ))}
      </div>

      {/* Trends Analysis */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Consciousness Trends</h3>
        {trends.length === 0 ? (
          <p className="text-sm text-muted">Collecting trend data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <span aria-hidden="true">{trend.direction === 'up' ? '📈' : '📉'}</span>
                  <div>
                    <h4 className="font-medium text-main">{trend.metric}</h4>
                    <p className="text-sm text-muted">{trend.description}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${trend.direction === 'up' ? 'text-success' : 'text-error'}`}>
                  {trend.change}%
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Active Optimizations */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Active Optimizations</h3>
        <div className="space-y-4">
          {activeOptimizations.map((optimization) => (
            <div key={optimization.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-4">
                <span className="text-2xl" aria-hidden="true">🧠</span>
                <div>
                  <h4 className="font-medium text-main">{optimization.name}</h4>
                  <p className="text-sm text-muted">Optimization Level</p>
                </div>
                <StatusBadge status={optimization.status} />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32">
                  <ProgressBar value={optimization.level} label={`${optimization.name} level`} />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-main">{optimization.level}%</div>
                  <Button
                    variant="secondary"
                    onClick={() => optimizeConsciousness(optimization.id)}
                    className="text-sm mt-1"
                  >
                    Optimize
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Consciousness Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-main mb-4">Quantum Coherence</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted">Current State</span>
              <span className="font-bold text-accent">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Entanglement Level</span>
              <span className="font-bold text-primary">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Decoherence Risk</span>
              <StatusBadge status="active" label="Low" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-main mb-4">Cognitive Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted">Processing Speed</span>
              <span className="font-bold text-accent">Enhanced</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Memory Access</span>
              <span className="font-bold text-success">Optimized</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Decision Quality</span>
              <StatusBadge status="healthy" label="Superior" />
            </div>
          </div>
        </Card>
      </div>

      {/* Optimization Controls */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Optimization Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex items-center justify-center space-x-3">
            <ChartBarIcon className="w-5 h-5" aria-hidden="true" />
            <span>Deep Optimization</span>
          </Button>
          <Button variant="secondary" className="flex items-center justify-center space-x-3">
            <span aria-hidden="true">📈</span>
            <span>Boost Coherence</span>
          </Button>
          <Button variant="accent" className="flex items-center justify-center space-x-3">
            <EyeIcon className="w-5 h-5" aria-hidden="true" />
            <span>Monitor State</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConsciousnessMonitor;
