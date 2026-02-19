/**
 * Buffer Dashboard - Main interface for P31 Buffer
 * Shows queue status, ping visualization, and message submission
 */

import React, { useEffect, useState } from 'react';
import { BufferStatus } from './BufferStatus';
import { PingVisualization } from './PingVisualization';
import { MessageHistory } from './MessageHistory';
import { BufferStats } from './BufferStats';
import { MeshVisualization } from './MeshVisualization';
import { AlertsPanel } from './AlertsPanel';
import { bufferService, QueueStatus } from '../../services/buffer.service';
import { useBufferWebSocket } from '../../hooks/useBufferWebSocket';
import { useSproutHelpStore } from '../../stores/sproutHelp.store';
import { P31_STATUS } from '../../config/p31-icons';

export const BufferDashboard: React.FC = () => {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);

  const sproutHelpRequested = useSproutHelpStore((s) => s.requested);
  const sproutHelpDraft = useSproutHelpStore((s) => s.draftPrompt);
  const clearSproutHelp = useSproutHelpStore((s) => s.clearHelp);

  const useDraftForHelp = () => {
    setMessage(sproutHelpDraft);
    clearSproutHelp();
  };

  // WebSocket for real-time updates
  const { isConnected: wsConnected, lastMessage } = useBufferWebSocket();

  useEffect(() => {
    // Refresh queue status when WebSocket receives batch_processed message
    if (lastMessage?.type === 'batch_processed') {
      updateStatus();
    }
  }, [lastMessage]);

  useEffect(() => {
    const updateStatus = async () => {
      const status = await bufferService.getQueueStatus();
      setQueueStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const result = await bufferService.submitMessage({
        message: message.trim(),
        priority,
        metadata: {
          source: 'scope',
          timestamp: new Date().toISOString(),
        },
      });

      setLastSubmitted(result.messageId);
      setMessage('');
      setTimeout(() => setLastSubmitted(null), 3000);
    } catch (error) {
      console.error('Failed to submit message:', error);
      alert('Failed to submit message to Buffer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="buffer-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>P31 Buffer</h1>
          <p className="subtitle">Communication Processing Layer - P31</p>
        </div>
        <div className="connection-status">
          <div className={`status-dot ${wsConnected ? 'connected' : 'disconnected'}`} />
          <span>{wsConnected ? 'Live' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Status Panel */}
        <div className="dashboard-panel">
          <h2>Status</h2>
          <BufferStatus />
        </div>

        {/* Ping Visualization */}
        <div className="dashboard-panel">
          <h2>Ping - Object Permanence</h2>
          <PingVisualization />
        </div>

        {/* Mesh Network */}
        <div className="dashboard-panel">
          <h2>Mesh Network</h2>
          <MeshVisualization />
        </div>

        {/* Queue Info */}
        {queueStatus && (
          <div className="dashboard-panel">
            <h2>Queue Information</h2>
            <div className="queue-stats">
              <div className="stat">
                <span className="stat-label">Queue Length</span>
                <span className="stat-value">{queueStatus.queueLength}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{queueStatus.pending}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Processing</span>
                <span className="stat-value">{queueStatus.processing}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Connected</span>
                <span
                  className={`stat-value ${queueStatus.connected ? 'connected' : 'disconnected'}`}
                >
                  {queueStatus.connected ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="dashboard-panel">
          <h2>Message Statistics</h2>
          <BufferStats />
        </div>

        {/* Alerts */}
        <div className="dashboard-panel">
          <h2>Monitoring Alerts</h2>
          <AlertsPanel />
        </div>

        {/* Message History */}
        <div className="dashboard-panel full-width">
          <h2>Message History</h2>
          <MessageHistory />
        </div>

        {/* Message Submission */}
        <div className="dashboard-panel">
          <h2>Submit Message</h2>
          {sproutHelpRequested && (
            <div
              className="sprout-help-banner"
              role="alert"
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(46, 204, 113, 0.1)',
                border: '1px solid rgba(46, 204, 113, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#2ecc71', fontWeight: 600 }}>
                Someone needs help.
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={useDraftForHelp}
                  className="p31-btn p31-btn-primary sprout-help-draft-btn"
                  aria-label="Draft message for me"
                >
                  Draft message for me
                </button>
                <button
                  type="button"
                  onClick={clearSproutHelp}
                  className="p31-btn p31-btn-secondary sprout-help-dismiss-btn"
                  aria-label="Dismiss, I'll handle it"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="message-form">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to buffer..."
              rows={4}
              className="p31-textarea message-input"
              disabled={submitting}
              aria-label="Message to buffer"
            />

            <div className="form-controls">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="p31-select priority-select"
                disabled={submitting}
                aria-label="Message priority level"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>

              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="p31-btn p31-btn-primary submit-button"
              >
                {submitting ? 'Submitting...' : 'Submit to Buffer'}
              </button>
            </div>

            {lastSubmitted && (
              <div className="success-message" style={{ color: P31_STATUS.checkColor }}>{P31_STATUS.check} Message submitted: {lastSubmitted}</div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        .buffer-dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: buffer-status-pulse 2s ease-in-out infinite;
        }

        .status-dot.connected {
          background: #4ade80;
        }

        .status-dot.disconnected {
          background: #ef4444;
          animation: none;
        }

        @keyframes buffer-status-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (prefers-reduced-motion: reduce) {
          .status-dot {
            animation: none;
          }
        }

        .subtitle {
          color: #999;
          font-size: 0.875rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .dashboard-panel.full-width {
          grid-column: 1 / -1;
        }

        .dashboard-panel {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .dashboard-panel h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .queue-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #999;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .stat-value.connected {
          color: #4ade80;
        }

        .stat-value.disconnected {
          color: #ef4444;
        }

        .message-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-input.p31-textarea {
          width: 100%;
          min-height: 80px;
          padding: 8px 12px;
          background: #0A0A1F;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          color: #E0E0EE;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          resize: vertical;
        }

        .message-input.p31-textarea::placeholder {
          color: #4A4A7A;
          font-style: italic;
        }

        .message-input.p31-textarea:focus {
          outline: none;
          border-color: #00FF88;
          box-shadow: 0 0 0 1px #00FF88, 0 0 12px rgba(0, 255, 136, 0.25);
        }

        .form-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .priority-select.p31-select {
          min-width: 140px;
          padding: 8px 32px 8px 12px;
          background: #0A0A1F;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          color: #E0E0EE;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
        }

        .priority-select.p31-select:focus {
          outline: none;
          border-color: #00FF88;
          box-shadow: 0 0 0 1px #00FF88, 0 0 12px rgba(0, 255, 136, 0.25);
        }

        .submit-button.p31-btn {
          min-height: 36px;
          min-width: 80px;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: transparent;
          color: #00FF88;
          border: 1px solid #00FF88;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.15);
        }

        .submit-button.p31-btn:hover:not(:disabled) {
          background: rgba(0, 255, 136, 0.1);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.3), 0 0 24px rgba(0, 255, 136, 0.15);
        }

        .submit-button.p31-btn:active:not(:disabled) {
          background: rgba(0, 255, 136, 0.2);
          transform: scale(0.98);
        }

        .submit-button.p31-btn:focus {
          outline: none;
        }

        .submit-button.p31-btn:focus-visible {
          box-shadow: 0 0 0 1px #00FF88, 0 0 12px rgba(0, 255, 136, 0.25);
        }

        .submit-button.p31-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .success-message {
          padding: 0.75rem;
          background: rgba(74, 222, 128, 0.2);
          border: 1px solid #4ade80;
          border-radius: 4px;
          color: #4ade80;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};
