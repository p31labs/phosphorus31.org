/**
 * Switch Control Highlight
 * Visual highlight for switch control scanning
 */

import React, { useEffect, useState } from 'react';

interface SwitchControlHighlightProps {
  itemId: string | null;
}

export const SwitchControlHighlight: React.FC<SwitchControlHighlightProps> = ({ itemId }) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!itemId) {
      setPosition(null);
      return;
    }

    const element = document.getElementById(itemId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [itemId]);

  if (!position || !itemId) return null;

  return (
    <div
      className="switch-control-highlight"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        border: '4px solid #FF69B4',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: 10000,
        boxShadow: '0 0 20px rgba(255, 105, 180, 0.8)',
        animation: 'pulse 1s ease-in-out infinite',
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};
