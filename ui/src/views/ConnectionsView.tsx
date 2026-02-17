/**
 * Connections View — The Nervous System
 * Shows how the organism connects to the world.
 * 
 * Displays status and configuration for all P31 integrations:
 * - Gmail Buffer (Google Apps Script)
 * - Sheets Dashboard
 * - Calendar
 * - Drive Backup
 * - Shelter Backend
 * - Phosphorus Voice (AI providers)
 * - Node One (ESP32-S3 hardware)
 */

import React, { useState, useEffect } from 'react';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  magenta: '#FF00CC',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

type ConnectionStatus = 'connected' | 'partial' | 'disconnected' | 'growing';

interface Connection {
  id: string;
  icon: string;
  name: string;
  description: string;
  status: ConnectionStatus;
  configurable: boolean;
  configKey?: string;
  configLabel?: string;
  configPlaceholder?: string;
  testable?: boolean;
  details?: string[];
  envVar?: string;
  envVars?: string[];
}

export function ConnectionsView(): React.ReactElement {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});

  // Initialize connections
  useEffect(() => {
    const gasUrl = localStorage.getItem('p31:gas-url') || '';
    const sheetId = localStorage.getItem('p31:sheet-id') || '';
    const shelterUrl = import.meta.env.VITE_SHELTER_URL || '';
    const geminiKey = import.meta.env.VITE_GEMINI_KEY || '';
    const openaiKey = import.meta.env.VITE_OPENAI_KEY || '';
    const claudeKey = import.meta.env.VITE_CLAUDE_KEY || '';
    const hasVoiceProvider = !!(geminiKey || openaiKey || claudeKey);

    const initialConnections: Connection[] = [
      {
        id: 'gmail-buffer',
        icon: '📧',
        name: 'GMAIL BUFFER',
        description: 'Filters incoming email by emotional voltage.',
        status: gasUrl ? 'connected' : 'disconnected',
        configurable: true,
        configKey: 'p31:gas-url',
        configLabel: 'Google Apps Script Web App URL',
        configPlaceholder: 'https://script.google.com/macros/s/.../exec',
        testable: true,
      },
      {
        id: 'sheets-dashboard',
        icon: '📊',
        name: 'SHEETS DASHBOARD',
        description: 'Spoon data, medication tracking, accommodation log.',
        status: sheetId ? 'connected' : 'disconnected',
        configurable: true,
        configKey: 'p31:sheet-id',
        configLabel: 'Google Sheet ID',
        configPlaceholder: '1ABC...xyz',
      },
      {
        id: 'calendar',
        icon: '📅',
        name: 'CALENDAR',
        description: 'Sync spoon budget with your calendar.',
        status: 'growing',
        configurable: false,
      },
      {
        id: 'drive-backup',
        icon: '📁',
        name: 'DRIVE BACKUP',
        description: 'Automatic backup of molecule data to Google Drive.',
        status: 'growing',
        configurable: false,
      },
      {
        id: 'shelter-backend',
        icon: '🏠',
        name: 'SHELTER BACKEND',
        description: 'Core backend services for molecule, brain, wallet, mesh, sprout.',
        status: shelterUrl ? 'connected' : 'disconnected',
        configurable: false,
        envVar: 'VITE_SHELTER_URL',
        details: shelterUrl ? ['molecule', 'brain', 'wallet', 'mesh', 'sprout'] : undefined,
      },
      {
        id: 'phosphorus-voice',
        icon: '🧠',
        name: 'PHOSPHORUS VOICE',
        description: 'The AI that speaks during molecule formation.',
        status: hasVoiceProvider ? 'connected' : 'disconnected',
        configurable: false,
        envVars: ['VITE_GEMINI_KEY', 'VITE_OPENAI_KEY', 'VITE_CLAUDE_KEY'],
        details: hasVoiceProvider
          ? [
              geminiKey ? 'Gemini' : '',
              openaiKey ? 'OpenAI' : '',
              claudeKey ? 'Claude' : '',
            ].filter(Boolean)
          : undefined,
      },
      {
        id: 'node-one',
        icon: '📡',
        name: 'NODE ONE',
        description: 'ESP32-S3 haptic device. Connects via Shelter.',
        status: 'growing',
        configurable: false,
      },
    ];

    setConnections(initialConnections);
    
    // Load config values
    const configs: Record<string, string> = {};
    initialConnections.forEach((conn) => {
      if (conn.configKey) {
        configs[conn.id] = localStorage.getItem(conn.configKey) || '';
      }
    });
    setConfigValues(configs);
  }, []);

  const handleConfigChange = (connectionId: string, value: string) => {
    const connection = connections.find((c) => c.id === connectionId);
    if (!connection?.configKey) return;

    setConfigValues((prev) => ({ ...prev, [connectionId]: value }));
    localStorage.setItem(connection.configKey, value);

    // Update connection status
    setConnections((prev) =>
      prev.map((c) =>
        c.id === connectionId
          ? { ...c, status: value ? 'connected' : 'disconnected' }
          : c
      )
    );
  };

  const handleTestConnection = async (connectionId: string) => {
    const connection = connections.find((c) => c.id === connectionId);
    if (!connection?.testable) return;

    setTestResults((prev) => ({ ...prev, [connectionId]: null }));

    try {
      const url = configValues[connectionId];
      if (!url) {
        setTestResults((prev) => ({ ...prev, [connectionId]: false }));
        return;
      }

      // Test GAS URL
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping' }),
        mode: 'no-cors', // GAS Web Apps don't support CORS properly
      });

      // Since we use no-cors, we can't read the response
      // But if it doesn't throw, assume it's reachable
      setTestResults((prev) => ({ ...prev, [connectionId]: true }));
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResults((prev) => ({ ...prev, [connectionId]: false }));
    }
  };

  const getStatusColor = (status: ConnectionStatus): string => {
    switch (status) {
      case 'connected':
        return BRAND.green;
      case 'partial':
        return BRAND.amber;
      case 'disconnected':
        return BRAND.magenta;
      case 'growing':
        return BRAND.cyan;
      default:
        return BRAND.dim;
    }
  };

  const getStatusDot = (status: ConnectionStatus, isConnected: boolean): React.ReactElement => {
    const color = getStatusColor(status);
    const pulseClass = isConnected && status === 'connected' ? 'animate-pulse' : '';

    return (
      <div
        className={`w-3 h-3 rounded-full ${pulseClass}`}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    );
  };

  return (
    <div
      style={{
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: BRAND.void,
        color: BRAND.text,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: BRAND.green,
          }}
        >
          THE NERVOUS SYSTEM
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: BRAND.muted,
            marginBottom: '2rem',
          }}
        >
          How the organism connects to the world.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {connections.map((connection) => {
            const isExpanded = expandedId === connection.id;
            const isConnected = connection.status === 'connected';
            const borderColor = getStatusColor(connection.status);
            const testResult = testResults[connection.id];

            return (
              <div
                key={connection.id}
                style={{
                  backgroundColor: BRAND.surface2,
                  borderRadius: '8px',
                  borderLeft: `4px solid ${borderColor}`,
                  padding: '1.5rem',
                  cursor: connection.configurable ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (connection.configurable) {
                    setExpandedId(isExpanded ? null : connection.id);
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{connection.icon}</span>
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      flex: 1,
                      color: BRAND.text,
                    }}
                  >
                    {connection.name}
                  </h2>
                  {getStatusDot(connection.status, isConnected)}
                  {connection.status === 'growing' && (
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: BRAND.cyan,
                        marginLeft: '0.5rem',
                      }}
                    >
                      ○ GROWING
                    </span>
                  )}
                </div>

                <p
                  style={{
                    color: BRAND.muted,
                    marginBottom: isExpanded ? '1rem' : 0,
                    fontSize: '0.9375rem',
                  }}
                >
                  {connection.description}
                </p>

                {connection.details && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.875rem',
                      color: BRAND.dim,
                    }}
                  >
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>URL:</strong>{' '}
                      {connection.envVar && import.meta.env[connection.envVar]
                        ? import.meta.env[connection.envVar]
                        : 'Not configured'}
                    </div>
                    <div>
                      <strong>Services:</strong> {connection.details.join(', ')}
                    </div>
                  </div>
                )}

                {connection.envVars && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.875rem',
                      color: BRAND.dim,
                    }}
                  >
                    <strong>Providers:</strong>{' '}
                    {connection.details?.join(', ') || 'None configured'}
                  </div>
                )}

                {isExpanded && connection.configurable && (
                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: `1px solid ${BRAND.dim}`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        color: BRAND.text,
                      }}
                    >
                      {connection.configLabel}
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={configValues[connection.id] || ''}
                        onChange={(e) => handleConfigChange(connection.id, e.target.value)}
                        placeholder={connection.configPlaceholder}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          backgroundColor: BRAND.void,
                          border: `1px solid ${BRAND.dim}`,
                          borderRadius: '4px',
                          color: BRAND.text,
                          fontSize: '0.875rem',
                        }}
                      />
                      {connection.testable && (
                        <button
                          onClick={() => handleTestConnection(connection.id)}
                          disabled={testResult === null && !configValues[connection.id]}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: BRAND.green,
                            color: BRAND.void,
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            opacity: testResult === null && !configValues[connection.id] ? 0.5 : 1,
                          }}
                        >
                          {testResult === null
                            ? 'Test Connection'
                            : testResult
                              ? '✓ Connected'
                              : '✗ Failed'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
