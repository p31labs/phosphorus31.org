/**
 * Message Queue Component
 * Shows messages in the queue with their status
 */

import React, { useEffect, useState } from 'react';
import { bufferService } from '../../services/buffer.service';

interface Message {
  id: string;
  message: string;
  priority: string;
  status: string;
  timestamp: string;
}

export const MessageQueue: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      // In a real implementation, this would fetch from an API endpoint
      // For now, we'll show queue status
      setLoading(false);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="message-queue loading">Loading messages...</div>;
  }

  return (
    <div className="message-queue">
      <h3>Message Queue</h3>
      {messages.length === 0 ? (
        <div className="empty-queue">
          <p>No messages in queue</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-item priority-${msg.priority}`}>
              <div className="message-header">
                <span className="message-id">{msg.id}</span>
                <span className={`priority-badge priority-${msg.priority}`}>{msg.priority}</span>
              </div>
              <div className="message-content">{msg.message}</div>
              <div className="message-footer">
                <span className="message-status">{msg.status}</span>
                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
