/**
 * Message History Component
 * Shows recent messages from The Buffer
 */

import React, { useEffect, useState } from 'react';
import { bufferService } from '../../services/buffer.service';

interface Message {
  id: string;
  message: string;
  priority: string;
  status: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const MessageHistory: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadMessages = async (offset: number = 0) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${bufferService['baseUrl']}/api/messages?limit=20&offset=${offset}`
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setTotal(data.total || 0);
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => loadMessages(), 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && messages.length === 0) {
    return <div className="message-history loading">Loading message history...</div>;
  }

  return (
    <div className="message-history">
      <div className="history-header">
        <h3>Message History</h3>
        <span className="message-count">{total} total</span>
      </div>

      {messages.length === 0 ? (
        <div className="empty-history">
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-item priority-${msg.priority} status-${msg.status}`}
            >
              <div className="message-header">
                <span className="message-id">{msg.id.substring(0, 8)}...</span>
                <span className={`priority-badge priority-${msg.priority}`}>{msg.priority}</span>
                <span className={`status-badge status-${msg.status}`}>{msg.status}</span>
              </div>
              <div className="message-content">{msg.message}</div>
              <div className="message-footer">
                <span className="message-time">{new Date(msg.timestamp).toLocaleString()}</span>
                {msg.metadata?.filterReason && (
                  <span className="filter-reason">{msg.metadata.filterReason}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button onClick={() => loadMessages(messages.length)} className="load-more">
          Load More
        </button>
      )}

      <style>{`
        .message-history {
          padding: 1rem;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .message-count {
          font-size: 0.875rem;
          color: #999;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .message-item {
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid;
          border-radius: 4px;
        }

        .message-item.priority-urgent {
          border-left-color: #ef4444;
        }

        .message-item.priority-high {
          border-left-color: #f59e0b;
        }

        .message-item.priority-normal {
          border-left-color: #3b82f6;
        }

        .message-item.priority-low {
          border-left-color: #6b7280;
        }

        .message-header {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .message-id {
          font-size: 0.75rem;
          color: #999;
          font-family: monospace;
        }

        .priority-badge, .status-badge {
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .priority-badge.priority-urgent {
          background: #ef4444;
          color: #fff;
        }

        .priority-badge.priority-high {
          background: #f59e0b;
          color: #000;
        }

        .priority-badge.priority-normal {
          background: #3b82f6;
          color: #fff;
        }

        .priority-badge.priority-low {
          background: #6b7280;
          color: #fff;
        }

        .status-badge {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .message-content {
          margin-bottom: 0.5rem;
          word-wrap: break-word;
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #999;
        }

        .filter-reason {
          font-style: italic;
        }

        .load-more {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid #6366f1;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
        }

        .load-more:hover {
          background: rgba(99, 102, 241, 0.3);
        }

        .empty-history {
          padding: 2rem;
          text-align: center;
          color: #999;
        }
      `}</style>
    </div>
  );
};
