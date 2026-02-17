// ══════════════════════════════════════════════════════════════════════════════
// ACTION DECK
// Bottom control bar: mode toggles, voice command mic, clear, materialize CTA.
// Glassmorphism dock with voltage-responsive styling.
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useStore } from '../../store.js';
import { useTrimtabContext } from '../../useTrimtabContext';
import { COLORS, MODES } from '../../constants.js';
import { Mic, MicOff, Trash2, Layers } from 'lucide-react';

/**
 * ActionDeck - Bottom control panel
 * @param {function} onExport - Callback when MATERIALIZE is triggered
 */
export default function ActionDeck({ onExport }) {
  const [showSettings, setShowSettings] = useState(false);

  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const clearBlocks = useStore((s) => s.clearBlocks);
  const blockCount = useStore((s) => s.blocks.size);
  const fabrication = useStore((s) => s.fabrication);

  const { listen, stopListening, isListening, speak } = useTrimtabContext();

  // ── Derive States ──────────────────────────────────────────────────────────
  const isProcessing = ['slicing', 'preparing', 'exporting'].includes(fabrication.status);
  const hasBlocks = blockCount > 0;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      listen();
    }
  };

  const handleClear = () => {
    clearBlocks();
    speak("World cleared. The void awaits.", 'NORMAL');
  };

  const handleMaterialize = () => {
    if (!hasBlocks) {
      speak("No blocks to materialize. Build something first.", 'HIGH');
      return;
    }
    if (isProcessing) return;
    
    setMode('SLICE');
    onExport();
  };

  return (
    <div
      className="action-deck"
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 22px',
        borderRadius: 14,
        border: `1px solid ${COLORS.GLASS_BORDER_CYAN}`,
        background: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        zIndex: 10
      }}
    >
      {/* ── Mode Buttons ──────────────────────────────────────────────────── */}
      {MODES.slice(0, 3).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{
            padding: '5px 13px',
            fontSize: 9,
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            border: `1px solid ${mode === m ? COLORS.CYAN : COLORS.GLASS_BORDER}`,
            borderRadius: 6,
            background: mode === m ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
            color: mode === m ? COLORS.CYAN : COLORS.TEXT_MUTED,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {m}
        </button>
      ))}

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{
        width: 1,
        height: 24,
        background: COLORS.GLASS_BORDER,
        margin: '0 4px'
      }} />

      {/* ── Voice Mic Button ──────────────────────────────────────────────── */}
      <button
        onClick={handleMicClick}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: `1px solid ${isListening ? COLORS.ALERT_RED : COLORS.GLASS_BORDER_CYAN}`,
          background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          animation: isListening ? 'phenix-pulse-mic 1s ease-in-out infinite' : 'none'
        }}
        title={isListening ? 'Stop listening' : 'Voice command'}
      >
        {isListening ? (
          <MicOff size={16} color={COLORS.ALERT_RED} />
        ) : (
          <Mic size={16} color={COLORS.CYAN} />
        )}
      </button>

      {/* ── Clear Button ──────────────────────────────────────────────────── */}
      <button
        onClick={handleClear}
        disabled={!hasBlocks}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: `1px solid ${COLORS.GLASS_BORDER}`,
          background: 'transparent',
          cursor: hasBlocks ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hasBlocks ? 1 : 0.4,
          transition: 'all 0.2s ease'
        }}
        title="Clear all blocks"
      >
        <Trash2 size={16} color={COLORS.TEXT_MUTED} />
      </button>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{
        width: 1,
        height: 24,
        background: COLORS.GLASS_BORDER,
        margin: '0 4px'
      }} />

      {/* ── Materialize CTA ───────────────────────────────────────────────── */}
      <button
        onClick={handleMaterialize}
        disabled={isProcessing || !hasBlocks}
        style={{
          padding: '8px 20px',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          border: `1px solid ${COLORS.CYAN}`,
          borderRadius: 8,
          background: isProcessing ? 'rgba(6, 182, 212, 0.04)' : 'rgba(6, 182, 212, 0.07)',
          color: COLORS.CYAN,
          cursor: (isProcessing || !hasBlocks) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          textShadow: `0 0 8px ${COLORS.CYAN}55`,
          boxShadow: isProcessing ? 'none' : `0 0 14px ${COLORS.CYAN}25, inset 0 0 14px ${COLORS.CYAN}08`,
          opacity: (isProcessing || !hasBlocks) ? 0.5 : 1
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={14} />
          {isProcessing ? 'PROCESSING...' : 'MATERIALIZE'}
        </span>
      </button>

      {/* ── Progress Indicator ────────────────────────────────────────────── */}
      {isProcessing && (
        <div style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 8,
          fontFamily: 'JetBrains Mono, monospace',
          color: COLORS.CYAN,
          letterSpacing: '0.1em'
        }}>
          {fabrication.status.toUpperCase()} {fabrication.progress}%
        </div>
      )}

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes phenix-pulse-mic {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
