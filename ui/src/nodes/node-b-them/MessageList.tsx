/**
 * Message List Component
 * Processed message history display for Node B (Them)
 */

import { useMemo } from 'react';
import { useProcessedMessage } from '../../stores/shield.store';
import { historyService } from '../../services/history.service';
import type { ProcessedMessage } from '../../types/messages';

export function MessageList() {
  const currentMessage = useProcessedMessage();
  const messages: ProcessedMessage[] = useMemo(() => {
    const entries = historyService.getHistoryByType('message');
    const list = entries.map((e) => e.content).filter(Boolean) as ProcessedMessage[];
    return list.length > 0 ? list : currentMessage ? [currentMessage] : [];
  }, [currentMessage?.id]);

  if (messages.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>
        No messages processed yet
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            padding: 16,
            backgroundColor: '#1f2937',
            borderRadius: 8,
            border: `1px solid ${(msg.voltage?.score ?? 0) >= 7 ? '#ef4444' : '#374151'}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{msg.raw?.sender ?? 'Unknown'}</span>
            <span
              style={{
                color: (msg.voltage?.score ?? 0) >= 7 ? '#ef4444' : '#9ca3af',
                fontSize: 11,
              }}
            >
              Voltage: {(msg.voltage?.score ?? 0).toFixed(1)}
            </span>
          </div>

          {msg.safeSummary ? (
            <div style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.6 }}>{msg.safeSummary}</div>
          ) : (
            <div style={{ color: '#9ca3af', fontSize: 12, fontStyle: 'italic' }}>Processing...</div>
          )}

          <div style={{ marginTop: 8, fontSize: 10, color: '#6b7280' }}>
            {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
