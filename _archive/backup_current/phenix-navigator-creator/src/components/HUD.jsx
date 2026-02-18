// ══════════════════════════════════════════════════════════════════════════════
// HUD — HEADS-UP DISPLAY
// Voltage indicator, coherence meter, hardware status, block count.
// Glassmorphism panels with voltage-driven visual effects.
// ══════════════════════════════════════════════════════════════════════════════

import { useStore } from '../store.js';
import { useWebSerial } from '../hooks/useWebSerial.js';
import { COLORS, VPI_PHASES } from '../constants.js';
import { Zap, Activity, Cpu, Box, Link2, Unlink } from 'lucide-react';

/**
 * HUD - Heads-up display overlay
 */
export default function HUD() {
  const voltage = useStore((s) => s.voltage);
  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);
  const vpiPhase = useStore((s) => s.vpiPhase);
  const blockCount = useStore((s) => s.blocks.size);

  const { isConnected, isSupported, connect, disconnect, error } = useWebSerial();

  // ── Derive States ──────────────────────────────────────────────────────────
  const isHighVoltage = voltage > 80;
  const isQuantumRegime = qStatistic > 1;
  const phaseData = VPI_PHASES[vpiPhase] || VPI_PHASES.VACUUM;

  return (
    <>
      {/* ── Top Left Panel: System Status ───────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Voltage */}
        <div style={{
          ...panelStyle,
          borderColor: isHighVoltage ? COLORS.ALERT_RED : COLORS.GLASS_BORDER_CYAN
        }}>
          <div style={labelStyle}>
            <Zap size={12} color={isHighVoltage ? COLORS.ALERT_RED : COLORS.AMBER} />
            <span>VOLTAGE</span>
          </div>
          <div style={{
            ...valueStyle,
            color: isHighVoltage ? COLORS.ALERT_RED : COLORS.AMBER,
            animation: isHighVoltage ? 'phenix-pulse-voltage 0.5s ease-in-out infinite' : 'none'
          }}>
            {Math.round(voltage)}
          </div>
          <div style={barContainerStyle}>
            <div style={{
              ...barFillStyle,
              width: `${voltage}%`,
              background: isHighVoltage 
                ? `linear-gradient(90deg, ${COLORS.AMBER}, ${COLORS.ALERT_RED})`
                : `linear-gradient(90deg, ${COLORS.NEON_CYAN}, ${COLORS.AMBER})`
            }} />
          </div>
        </div>

        {/* Coherence */}
        <div style={{
          ...panelStyle,
          borderColor: isQuantumRegime ? COLORS.COHERENT_GREEN : COLORS.GLASS_BORDER_CYAN
        }}>
          <div style={labelStyle}>
            <Activity size={12} color={isQuantumRegime ? COLORS.COHERENT_GREEN : COLORS.CYAN} />
            <span>COHERENCE</span>
          </div>
          <div style={{
            ...valueStyle,
            color: isQuantumRegime ? COLORS.COHERENT_GREEN : COLORS.CYAN
          }}>
            {(coherence * 100).toFixed(1)}%
          </div>
          <div style={barContainerStyle}>
            <div style={{
              ...barFillStyle,
              width: `${coherence * 100}%`,
              background: isQuantumRegime
                ? `linear-gradient(90deg, ${COLORS.CYAN}, ${COLORS.COHERENT_GREEN})`
                : `linear-gradient(90deg, ${COLORS.DECOHERENT_RED}, ${COLORS.CYAN})`
            }} />
          </div>
          <div style={{ 
            fontSize: 9, 
            color: COLORS.TEXT_MUTED,
            marginTop: 4,
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            Q = {qStatistic.toFixed(2)} {isQuantumRegime && '⟨QUANTUM⟩'}
          </div>
        </div>

        {/* Block Count */}
        <div style={panelStyle}>
          <div style={labelStyle}>
            <Box size={12} color={COLORS.PURPLE} />
            <span>BLOCKS</span>
          </div>
          <div style={{ ...valueStyle, color: COLORS.PURPLE }}>
            {blockCount}
          </div>
        </div>
      </div>

      {/* ── Top Right Panel: Hardware Status ────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 10
      }}>
        {/* VPI Phase */}
        <div style={{
          ...panelStyle,
          borderColor: phaseData.color
        }}>
          <div style={labelStyle}>
            <Cpu size={12} color={phaseData.color} />
            <span>VPI PHASE</span>
          </div>
          <div style={{ ...valueStyle, color: phaseData.color, fontSize: 14 }}>
            {vpiPhase}
          </div>
          <div style={{ 
            fontSize: 9, 
            color: COLORS.TEXT_MUTED,
            marginTop: 2,
            fontFamily: 'JetBrains Mono, monospace',
            maxWidth: 140
          }}>
            {phaseData.description}
          </div>
        </div>

        {/* Hardware Link */}
        {isSupported && (
          <button
            onClick={isConnected ? disconnect : connect}
            style={{
              ...panelStyle,
              cursor: 'pointer',
              pointerEvents: 'auto',
              borderColor: isConnected ? COLORS.COHERENT_GREEN : COLORS.TEXT_MUTED,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={labelStyle}>
              {isConnected ? (
                <Link2 size={12} color={COLORS.COHERENT_GREEN} />
              ) : (
                <Unlink size={12} color={COLORS.TEXT_MUTED} />
              )}
              <span>{isConnected ? 'LINKED' : 'LINK HARDWARE'}</span>
            </div>
            {error && (
              <div style={{ 
                fontSize: 9, 
                color: COLORS.ALERT_RED,
                marginTop: 4,
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {error}
              </div>
            )}
          </button>
        )}
      </div>

      {/* ── Keyframes ───────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes phenix-pulse-voltage {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </>
  );
}

// ── Shared Styles ────────────────────────────────────────────────────────────
const panelStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: `1px solid ${COLORS.GLASS_BORDER_CYAN}`,
  background: COLORS.GLASS_BG,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  minWidth: 120
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 9,
  fontFamily: 'JetBrains Mono, monospace',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: COLORS.TEXT_SECONDARY,
  marginBottom: 4
};

const valueStyle = {
  fontSize: 22,
  fontFamily: 'Space Grotesk, sans-serif',
  fontWeight: 600,
  letterSpacing: '-0.02em'
};

const barContainerStyle = {
  width: '100%',
  height: 4,
  borderRadius: 2,
  background: 'rgba(255, 255, 255, 0.05)',
  marginTop: 6,
  overflow: 'hidden'
};

const barFillStyle = {
  height: '100%',
  borderRadius: 2,
  transition: 'width 0.15s ease-out'
};
