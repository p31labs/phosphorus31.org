/**
 * Main Dashboard - P31 Spectrum
 * Complete P31 system overview
 */

import React from 'react';
import { SystemHealthDashboard } from '../components/SystemHealth/SystemHealthDashboard';
import { MessageFlowDisplay } from '../components/MessageFlow/MessageFlowDisplay';
import { BufferDashboard } from '../components/Buffer/BufferDashboard';
import { TelemetryDashboard } from '../components/Scope/TelemetryDashboard';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>P31 - P31 Spectrum</h1>
        <p className="subtitle">Phosphorus-31. The biological qubit. The atom in the bone.</p>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <SystemHealthDashboard />
        </section>

        <section className="dashboard-section">
          <h2>Message Flow</h2>
          <MessageFlowDisplay />
        </section>

        <section className="dashboard-section">
          <h2>P31 Buffer</h2>
          <BufferDashboard />
        </section>

        <section className="dashboard-section">
          <h2>Telemetry (Scope)</h2>
          <TelemetryDashboard />
        </section>
      </div>

      <style>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 2rem;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-header h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          margin: 0;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-section {
          margin-bottom: 3rem;
        }

        .dashboard-section h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
