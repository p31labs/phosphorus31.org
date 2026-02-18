/**
 * The Scope Dashboard Integration Example
 * 
 * React component example for integrating with The Scope.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import React, { useEffect, useState } from 'react';
import { ScopeClient } from '@p31/scope';

const scope = new ScopeClient({
  url: process.env.SCOPE_URL || 'http://localhost:5173',
});

/**
 * Example: Dashboard component showing P31 system status
 */
export function P31Dashboard() {
  const [health, setHealth] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to The Scope
    scope.connect().then(() => {
      setConnected(true);
      
      // Subscribe to updates
      scope.subscribe('system-health', (data) => {
        setHealth(data);
      });

      scope.subscribe('messages', (data) => {
        setMessages(prev => [...prev, data]);
      });
    });

    return () => {
      scope.disconnect();
    };
  }, []);

  const submitMessage = async (message: string) => {
    await scope.submitMessage({
      message,
      source: 'dashboard',
    });
  };

  return (
    <div className="p31-dashboard">
      <h1>🔺 P31 Dashboard</h1>
      
      <div className="status">
        <div className={`connection ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </div>

      {health && (
        <div className="health">
          <h2>System Health</h2>
          <div className="metrics">
            <div>Centaur: {health.centaur?.status || 'unknown'}</div>
            <div>Buffer: {health.buffer?.status || 'unknown'}</div>
            <div>Scope: {health.scope?.status || 'unknown'}</div>
          </div>
        </div>
      )}

      <div className="messages">
        <h2>Messages</h2>
        <div className="message-list">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => submitMessage('Test message')}>
          Send Test Message
        </button>
      </div>

      <footer>
        💜 With love and light. As above, so below. 💜
        <br />
        The Mesh Holds. 🔺
      </footer>
    </div>
  );
}

export default P31Dashboard;
