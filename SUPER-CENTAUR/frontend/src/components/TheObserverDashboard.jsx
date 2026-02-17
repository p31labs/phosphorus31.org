import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import StatusBadge from './ui/StatusBadge';
import ProgressBar from './ui/ProgressBar';

/** Isolated clock so only this re-renders each second */
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time.toLocaleString()}</span>;
};

const TheObserverDashboard = () => {
  const [systemStatus, setSystemStatus] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const [healthRes, monRes] = await Promise.all([
        api.get('/health'),
        api.get('/api/system/monitoring'),
      ]);

      const systems = healthRes.data.systems || {};
      const services = monRes.data.services || {};

      // Build status map from health + monitoring
      const statusMap = {};
      for (const [key, val] of Object.entries(systems)) {
        const svcHealth = services[key];
        const isActive = val === 'active';
        statusMap[key] = {
          status: isActive ? 'active' : 'pending',
          progress: isActive ? 100 : 0,
          latency: svcHealth?.latency || null,
        };
      }

      setSystemStatus(statusMap);

      const total = Object.keys(statusMap).length || 1;
      const active = Object.values(statusMap).filter((s) => s.status === 'active').length;
      setOverallProgress(Math.round((active / total) * 100));
    } catch {
      // Toast auto-fires
    }
  };

  const activeCount = Object.values(systemStatus).filter((s) => s.status === 'active').length;
  const totalCount = Object.keys(systemStatus).length;
  const formatName = (key) => key.replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="terminal-container p-5 min-h-[70vh] flex flex-col">
      <div className="terminal-scanlines" aria-hidden="true" />

      <div className="relative z-[2] w-full max-w-3xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="text-center" role="banner">
          <h1 className="text-xl font-bold tracking-wider" style={{ color: '#00ff00' }}>
            THE OBSERVER
          </h1>
          <p className="text-sm opacity-70">Quantum Brain Terminal</p>
        </header>

        {/* Overall Status */}
        <section
          className="border border-current p-4 rounded-lg"
          style={{ borderColor: '#00ff00', backgroundColor: 'rgba(0,255,0,0.05)' }}
          aria-label="System overview"
        >
          <ProgressBar value={overallProgress} label="System Status" />
          <p className="text-xs mt-2 opacity-70">
            Services: {activeCount}/{totalCount} ACTIVE
          </p>
        </section>

        {/* System Grid */}
        <section aria-label="Individual system statuses">
          <h2 className="text-sm font-bold mb-3 opacity-80">SUBSYSTEM STATUS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(systemStatus).map(([key, data]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(0,255,0,0.05)', border: '1px solid rgba(0,255,0,0.2)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{formatName(key)}</p>
                  <ProgressBar value={data.progress} className="mt-1" />
                </div>
                <div className="ml-3 shrink-0 flex items-center gap-2">
                  {data.latency != null && (
                    <span className="text-xs opacity-50">{data.latency}ms</span>
                  )}
                  <StatusBadge status={data.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GO/NO-GO */}
        <section
          className="text-center p-4 rounded-lg border-2"
          style={{
            borderColor: overallProgress >= 70 ? '#00ff00' : '#ff6600',
            backgroundColor: overallProgress >= 70 ? 'rgba(0,255,0,0.1)' : 'rgba(255,102,0,0.1)',
          }}
          role="status"
          aria-label={`Go No-Go status: ${overallProgress >= 70 ? 'GO' : 'NO-GO'}`}
        >
          <p className="text-lg font-bold">
            GO/NO-GO: {overallProgress >= 70 ? 'GO' : 'NO-GO'}
          </p>
          <p className="text-xs opacity-50 mt-1">
            Last Update: <LiveClock />
          </p>
        </section>

        <footer className="text-center text-xs opacity-40 mt-2">
          With love and light - As above, so below | SUPER CENTAUR
        </footer>
      </div>
    </div>
  );
};

export default TheObserverDashboard;
