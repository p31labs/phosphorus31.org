/**
 * Message Flow Display
 * Shows messages flowing through The Buffer → The Centaur → Response
 */

import React, { useEffect, useState } from 'react';
import { bufferService } from '../../services/buffer.service';
import { centaurService } from '../../services/centaur.service';

interface Message {
  id: string;
  content: string;
  source: string;
  priority: string;
  status: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const MessageFlowDisplay: React.FC = () => {
  const [bufferMessages, setBufferMessages] = useState<Message[]>([]);
  const [centaurMessages, setCentaurMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Get messages from The Buffer
        const bufferResponse = await bufferService.getMessages({ limit: 10 });
        setBufferMessages(bufferResponse.messages || []);

        // Get messages from The Centaur
        const centaurMsgs = await centaurService.getMessages(10);
        setCentaurMessages(centaurMsgs);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="message-flow-loading">Loading message flow...</div>;
  }

  return (
    <div className="message-flow-display">
      <div className="flow-header">
        <h3>Message Flow</h3>
        <div className="flow-stats">
          <span>Buffer: {bufferMessages.length}</span>
          <span>Centaur: {centaurMessages.length}</span>
        </div>
      </div>

      <div className="flow-diagram">
        <div className="flow-stage">
          <div className="stage-header">The Buffer</div>
          <div className="messages-list">
            {bufferMessages.slice(0, 5).map((msg) => (
              <div key={msg.id} className={`message-item status-${msg.status}`}>
                <div className="message-content">{msg.content.substring(0, 50)}...</div>
                <div className="message-meta">
                  {msg.priority} • {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {bufferMessages.length === 0 && (
              <div className="empty-state">No messages in buffer</div>
            )}
          </div>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-stage">
          <div className="stage-header">The Centaur</div>
          <div className="messages-list">
            {centaurMessages.slice(0, 5).map((msg, idx) => (
              <div key={msg.id || idx} className="message-item">
                <div className="message-content">
                  {msg.content?.substring(0, 50) || 'Message'}...
                </div>
                <div className="message-meta">
                  {msg.source || 'unknown'} •{' '}
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {centaurMessages.length === 0 && (
              <div className="empty-state">No messages in centaur</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .message-flow-display {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .flow-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .flow-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .flow-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .flow-diagram {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .flow-stage {
          flex: 1;
        }

        .stage-header {
          font-weight: 600;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .message-item {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border-left: 3px solid rgba(255, 255, 255, 0.3);
        }

        .message-item.status-completed {
          border-left-color: #10b981;
        }

        .message-item.status-processing {
          border-left-color: #f59e0b;
        }

        .message-item.status-failed {
          border-left-color: #ef4444;
        }

        .message-content {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .message-meta {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .flow-arrow {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 1.5rem;
        }

        .empty-state {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.875rem;
        }

        .message-flow-loading {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};
