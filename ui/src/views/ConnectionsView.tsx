/**
 * Connections View — The Nervous System
 *
 * Real connect/disconnect for:
 *   - Google (Calendar, Gmail subjects, Tasks) via OAuth PKCE
 *   - Gemini AI (API key)
 *   - GAS Backend (URL-based)
 *   - Shelter Backend (env var)
 *   - Node One (hardware, growing)
 *
 * All connections are OPTIONAL. The organism works alone.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  isGoogleConnected,
  startGoogleAuth,
  handleGoogleCallback,
  disconnectGoogle,
  setGoogleClientId,
  getGoogleClientId,
  isGeminiConfigured,
  setGeminiKey,
  disconnectGemini,
  getGeminiRequestCount,
  getAllServiceStatus,
} from '../lib/bridge';
import { isConfigured as isGASConfigured } from '../lib/gas-bridge';

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

type ServiceId = 'google' | 'gemini' | 'gas' | 'shelter' | 'node-one';

interface ServiceCard {
  id: ServiceId;
  icon: string;
  name: string;
  description: string;
  connected: boolean;
  growing: boolean;
  configurable: boolean;
  detail?: string;
}

export function ConnectionsView(): React.ReactElement {
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [expandedId, setExpandedId] = useState<ServiceId | null>(null);
  const [googleClientId, setGoogleClientIdState] = useState(getGoogleClientId());
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [gasUrlInput, setGasUrlInput] = useState(localStorage.getItem('p31:gas-url') || '');
  const [authProcessing, setAuthProcessing] = useState(false);

  const refreshServices = useCallback(() => {
    const shelterUrl = typeof import.meta !== 'undefined'
      ? (import.meta as Record<string, Record<string, string>>).env?.VITE_SHELTER_URL ?? ''
      : '';

    const cards: ServiceCard[] = [
      {
        id: 'google',
        icon: '🔗',
        name: 'GOOGLE',
        description: 'Calendar events, Gmail subjects (voltage scan), Tasks.',
        connected: isGoogleConnected(),
        growing: false,
        configurable: true,
        detail: isGoogleConnected() ? 'OAuth PKCE · Read-only access' : undefined,
      },
      {
        id: 'gemini',
        icon: '🧠',
        name: 'GEMINI AI',
        description: 'Powers Module Maker, Vibe Coder, and molecule voice.',
        connected: isGeminiConfigured(),
        growing: false,
        configurable: true,
        detail: isGeminiConfigured() ? `${getGeminiRequestCount()} requests made` : undefined,
      },
      {
        id: 'gas',
        icon: '📊',
        name: 'GAS BACKEND',
        description: 'Live spoon data, meds, friction from Google Sheets via Apps Script.',
        connected: isGASConfigured() || !!localStorage.getItem('p31:gas-url'),
        growing: false,
        configurable: true,
        detail: localStorage.getItem('p31:gas-url') ? 'Connected to P31 Entangle' : undefined,
      },
      {
        id: 'shelter',
        icon: '🏠',
        name: 'SHELTER BACKEND',
        description: 'Express server. Molecule, brain, wallet, mesh, sprout.',
        connected: !!shelterUrl,
        growing: false,
        configurable: false,
        detail: shelterUrl ? shelterUrl : 'Set VITE_SHELTER_URL in .env',
      },
      {
        id: 'node-one',
        icon: '📡',
        name: 'NODE ONE',
        description: 'ESP32-S3 haptic device. LoRa mesh. The hardware root of trust.',
        connected: false,
        growing: true,
        configurable: false,
      },
    ];

    setServices(cards);
  }, []);

  // Initialize + handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      setAuthProcessing(true);
      handleGoogleCallback(code).then((success) => {
        setAuthProcessing(false);
        if (success) {
          refreshServices();
        }
      });
    } else {
      refreshServices();
    }
  }, [refreshServices]);

  const handleGoogleConnect = useCallback(async () => {
    if (!googleClientId.trim()) {
      alert('Enter your Google OAuth Client ID first.');
      return;
    }
    setGoogleClientId(googleClientId.trim());
    try {
      await startGoogleAuth();
    } catch (err) {
      alert(String(err));
    }
  }, [googleClientId]);

  const handleGoogleDisconnect = useCallback(() => {
    disconnectGoogle();
    refreshServices();
  }, [refreshServices]);

  const handleGeminiConnect = useCallback(() => {
    if (!geminiKeyInput.trim()) {
      alert('Enter your Gemini API key.');
      return;
    }
    setGeminiKey(geminiKeyInput.trim());
    setGeminiKeyInput('');
    refreshServices();
  }, [geminiKeyInput, refreshServices]);

  const handleGeminiDisconnect = useCallback(() => {
    disconnectGemini();
    refreshServices();
  }, [refreshServices]);

  const handleGASSave = useCallback(() => {
    if (gasUrlInput.trim()) {
      localStorage.setItem('p31:gas-url', gasUrlInput.trim());
    } else {
      localStorage.removeItem('p31:gas-url');
    }
    refreshServices();
  }, [gasUrlInput, refreshServices]);

  const statusColor = (connected: boolean, growing: boolean): string => {
    if (growing) return BRAND.cyan;
    return connected ? BRAND.green : BRAND.dim;
  };

  const statusLabel = (connected: boolean, growing: boolean): string => {
    if (growing) return 'GROWING';
    return connected ? 'CONNECTED' : 'DISCONNECTED';
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: BRAND.void }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 9,
          letterSpacing: 5,
          color: BRAND.muted,
          marginBottom: 8,
        }}>
          THE NERVOUS SYSTEM
        </h1>
        <p style={{ fontSize: 14, color: BRAND.dim, marginBottom: 32 }}>
          All connections are optional. The organism works offline. These amplify it.
        </p>

        {authProcessing && (
          <div style={{
            background: BRAND.surface2,
            padding: 16,
            borderRadius: 8,
            border: `1px solid ${BRAND.amber}`,
            marginBottom: 24,
            textAlign: 'center',
            color: BRAND.amber,
            fontSize: 13,
          }}>
            Processing Google authentication...
          </div>
        )}

        {/* Service summary strip */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {services.map((s) => (
            <div key={s.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: BRAND.surface2,
              borderRadius: 4,
              fontSize: 10,
              fontFamily: 'Space Mono, monospace',
              letterSpacing: 1,
              color: statusColor(s.connected, s.growing),
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: statusColor(s.connected, s.growing),
                display: 'inline-block',
              }} />
              {s.name}
            </div>
          ))}
        </div>

        {/* Service cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {services.map((service) => {
            const isExpanded = expandedId === service.id;
            const color = statusColor(service.connected, service.growing);

            return (
              <div
                key={service.id}
                style={{
                  background: BRAND.surface2,
                  borderRadius: 8,
                  borderLeft: `3px solid ${color}`,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : service.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: BRAND.text,
                    cursor: service.configurable ? 'pointer' : 'default',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{service.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 11,
                      letterSpacing: 2,
                      color: BRAND.text,
                    }}>
                      {service.name}
                    </div>
                    <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 2 }}>
                      {service.description}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: 8,
                      letterSpacing: 1,
                      color,
                    }}>
                      {statusLabel(service.connected, service.growing)}
                    </span>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: color,
                      boxShadow: service.connected ? `0 0 6px ${color}` : 'none',
                      display: 'inline-block',
                    }} />
                  </div>
                </button>

                {/* Detail line */}
                {service.detail && (
                  <div style={{
                    padding: '0 20px 12px 52px',
                    fontSize: 11,
                    color: BRAND.dim,
                    fontFamily: 'Space Mono, monospace',
                  }}>
                    {service.detail}
                  </div>
                )}

                {/* Expanded config panel */}
                {isExpanded && service.configurable && (
                  <div style={{
                    padding: '12px 20px 20px',
                    borderTop: `1px solid ${BRAND.dim}30`,
                  }}>
                    {/* Google config */}
                    {service.id === 'google' && (
                      <div>
                        {!isGoogleConnected() ? (
                          <>
                            <label style={labelStyle}>Google OAuth Client ID</label>
                            <input
                              type="text"
                              value={googleClientId}
                              onChange={(e) => setGoogleClientIdState(e.target.value)}
                              placeholder="123456789.apps.googleusercontent.com"
                              style={inputStyle}
                            />
                            <p style={{ fontSize: 10, color: BRAND.dim, margin: '6px 0 12px' }}>
                              Create at console.cloud.google.com → Credentials → OAuth 2.0. Redirect URI: {window.location.origin}/connections
                            </p>
                            <button
                              type="button"
                              onClick={handleGoogleConnect}
                              style={connectBtnStyle}
                            >
                              Connect Google (OAuth PKCE)
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={handleGoogleDisconnect}
                            style={disconnectBtnStyle}
                          >
                            Disconnect Google
                          </button>
                        )}
                      </div>
                    )}

                    {/* Gemini config */}
                    {service.id === 'gemini' && (
                      <div>
                        {!isGeminiConfigured() ? (
                          <>
                            <label style={labelStyle}>Gemini API Key</label>
                            <input
                              type="password"
                              value={geminiKeyInput}
                              onChange={(e) => setGeminiKeyInput(e.target.value)}
                              placeholder="AIza..."
                              style={inputStyle}
                            />
                            <p style={{ fontSize: 10, color: BRAND.dim, margin: '6px 0 12px' }}>
                              Get at aistudio.google.com → Get API key. Stored locally only.
                            </p>
                            <button
                              type="button"
                              onClick={handleGeminiConnect}
                              style={connectBtnStyle}
                            >
                              Save API Key
                            </button>
                          </>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: BRAND.muted }}>
                              {getGeminiRequestCount()} requests made
                            </span>
                            <button
                              type="button"
                              onClick={handleGeminiDisconnect}
                              style={disconnectBtnStyle}
                            >
                              Remove Key
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* GAS config */}
                    {service.id === 'gas' && (
                      <div>
                        <label style={labelStyle}>Google Apps Script Web App URL</label>
                        <input
                          type="text"
                          value={gasUrlInput}
                          onChange={(e) => setGasUrlInput(e.target.value)}
                          placeholder="https://script.google.com/macros/s/.../exec"
                          style={inputStyle}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button
                            type="button"
                            onClick={handleGASSave}
                            style={connectBtnStyle}
                          >
                            Save URL
                          </button>
                          {localStorage.getItem('p31:gas-url') && (
                            <button
                              type="button"
                              onClick={() => {
                                setGasUrlInput('');
                                localStorage.removeItem('p31:gas-url');
                                refreshServices();
                              }}
                              style={disconnectBtnStyle}
                            >
                              Disconnect
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Data sovereignty notice */}
        <div style={{
          marginTop: 32,
          padding: 16,
          background: BRAND.surface2,
          borderRadius: 8,
          border: `1px solid ${BRAND.dim}30`,
        }}>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 8,
            letterSpacing: 2,
            color: BRAND.dim,
            marginBottom: 8,
          }}>
            DATA SOVEREIGNTY NOTICE
          </p>
          <p style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>
            All tokens and API keys are stored in your browser's localStorage. They never leave your device.
            P31 has no server that receives your credentials. Google OAuth uses PKCE (no client secret).
            You own your data. You own your connections. The mesh holds.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared Styles ── */

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Space Mono, monospace',
  fontSize: 9,
  letterSpacing: 2,
  color: BRAND.muted,
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  background: BRAND.void,
  border: `1px solid ${BRAND.dim}`,
  borderRadius: 4,
  color: BRAND.text,
  fontSize: 12,
  fontFamily: 'Space Mono, monospace',
};

const connectBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: `1px solid ${BRAND.green}`,
  borderRadius: 6,
  color: BRAND.green,
  fontFamily: 'Space Mono, monospace',
  fontSize: 10,
  letterSpacing: 1,
  cursor: 'pointer',
};

const disconnectBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: `1px solid ${BRAND.dim}`,
  borderRadius: 6,
  color: BRAND.muted,
  fontFamily: 'Space Mono, monospace',
  fontSize: 10,
  letterSpacing: 1,
  cursor: 'pointer',
};
