// ui/src/App.tsx
import React, { useState, useEffect } from 'react';
import { useGenesisStore } from './stores/genesis';

export const App = () => {
  const {
    spoons,
    biometrics,
    worldPosition,
    avatarState,
    meshPeers,
    notifications,
    addNotification,
  } = useGenesisStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <h2>Genesis Dashboard</h2>
            <div className="dashboard-grid">
              <div className="metric-card">
                <h3>Spoons</h3>
                <div className="metric-value">
                  {spoons?.current || 0}/{spoons?.max || 10}
                </div>
                <div className="metric-label">Energy Available</div>
              </div>
              <div className="metric-card">
                <h3>Biometrics</h3>
                <div className="metric-value">{biometrics?.hrv || 'N/A'}</div>
                <div className="metric-label">HRV</div>
              </div>
              <div className="metric-card">
                <h3>Network</h3>
                <div className="metric-value">{peers?.length || 0}</div>
                <div className="metric-label">Connected Peers</div>
              </div>
              <div className="metric-card">
                <h3>World</h3>
                <div className="metric-value">{world?.active ? 'Active' : 'Loading'}</div>
                <div className="metric-label">3D Environment</div>
              </div>
            </div>
          </div>
        );
      case 'world':
        return (
          <div className="world-viewer">
            <h2>3D World Viewer</h2>
            <div className="world-placeholder">
              <p>3D Voxel World Rendering</p>
              <p>Connect Phenix Navigator to interact with the world</p>
            </div>
          </div>
        );
      case 'modules':
        return (
          <div className="module-maker">
            <h2>Module Maker</h2>
            <div className="module-placeholder">
              <p>Content Creation Studio</p>
              <p>Create custom modules and experiences</p>
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="games-hub">
            <h2>Games Hub</h2>
            <div className="games-grid">
              <div className="game-card">
                <h3>Bubble Pop</h3>
                <p>Regulation Game</p>
                <span className="spoon-reward">+2 Spoons</span>
              </div>
              <div className="game-card">
                <h3>Breathing Orb</h3>
                <p>Calming Exercise</p>
                <span className="spoon-reward">+3 Spoons</span>
              </div>
              <div className="game-card">
                <h3>Pattern Tap</h3>
                <p>Cognitive Training</p>
                <span className="spoon-reward">+1 Spoons</span>
              </div>
            </div>
          </div>
        );
      case 'hardware':
        return (
          <div className="hardware-panel">
            <h2>Hardware Panel</h2>
            <div className="hardware-status">
              <div className="device-card">
                <h3>Phenix Navigator</h3>
                <div className="status-indicator">Disconnected</div>
                <button className="connect-btn">Connect Device</button>
              </div>
              <div className="device-card">
                <h3>Biometric Sensors</h3>
                <div className="status-indicator">Not Detected</div>
              </div>
              <div className="device-card">
                <h3>IoT Devices</h3>
                <div className="status-indicator">None Connected</div>
              </div>
            </div>
          </div>
        );
      case 'agent':
        return (
          <div className="agent-interface">
            <h2>AI Agent Interface</h2>
            <div className="agent-chat">
              <div className="chat-messages">
                <div className="message bot">
                  <strong>Genesis AI:</strong> Welcome to the Genesis Gate platform. How can I
                  assist you today?
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="dashboard">
            <h2>Genesis Dashboard</h2>
            <div className="dashboard-grid">
              <div className="metric-card">
                <h3>Spoons</h3>
                <div className="metric-value">
                  {spoons?.current || 0}/{spoons?.max || 10}
                </div>
                <div className="metric-label">Energy Available</div>
              </div>
              <div className="metric-card">
                <h3>Biometrics</h3>
                <div className="metric-value">{biometrics?.hrv || 'N/A'}</div>
                <div className="metric-label">HRV</div>
              </div>
              <div className="metric-card">
                <h3>Network</h3>
                <div className="metric-value">{peers?.length || 0}</div>
                <div className="metric-label">Connected Peers</div>
              </div>
              <div className="metric-card">
                <h3>World</h3>
                <div className="metric-value">{world?.active ? 'Active' : 'Loading'}</div>
                <div className="metric-label">3D Environment</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="genesis-gate-app">
      <header className="app-header">
        <div className="header-content">
          <h1>Genesis Gate Platform</h1>
          <p>Unified neurodiversity-first metaverse</p>
          <div className="status-indicators">
            <span className="spoon-count">
              SPOONS: {spoons?.current || 0}/{spoons?.max || 10}
            </span>
            <span className="biometric-status">HRV: {biometrics?.hrv || 'N/A'}</span>
            <span className="network-status">Peers: {peers?.length || 0}</span>
          </div>
        </div>
      </header>

      <nav className="app-navigation">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'world' ? 'active' : ''}`}
          onClick={() => setActiveTab('world')}
        >
          3D World
        </button>
        <button
          className={`nav-tab ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          Module Maker
        </button>
        <button
          className={`nav-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Games
        </button>
        <button
          className={`nav-tab ${activeTab === 'hardware' ? 'active' : ''}`}
          onClick={() => setActiveTab('hardware')}
        >
          Hardware
        </button>
        <button
          className={`nav-tab ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          AI Agent
        </button>
      </nav>

      <main className="app-main">{renderActiveTab()}</main>

      <footer className="app-footer">
        <div className="footer-content">
          <span>Genesis Gate v1.0.0</span>
          <span>Neurodiversity-First Metaverse Platform</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
};
