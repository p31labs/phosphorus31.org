// ══════════════════════════════════════════════════════════════════════════════
// VPI OVERLAY
// Vacuum Pressure Impregnation phase progress chain.
// Visual progression through VACUUM → FLOOD → PRESSURIZE → CURE.
// ══════════════════════════════════════════════════════════════════════════════

import { useStore } from '../store.js';
import { VPI_PHASES, VPI_PHASE_ORDER, COLORS } from '../constants.js';

/**
 * VPIOverlay - Phase progress indicator
 */
export default function VPIOverlay() {
  const vpiPhase = useStore((s) => s.vpiPhase);
  const blockCount = useStore((s) => s.blocks.size);

  const currentIdx = VPI_PHASE_ORDER.indexOf(vpiPhase);

  return (
    <div style={{
      position: 'absolute',
      bottom: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      zIndex: 5,
      pointerEvents: 'none'
    }}>
      {VPI_PHASE_ORDER.map((phaseName, idx) => {
        const phase = VPI_PHASES[phaseName];
        const isActive = idx === currentIdx;
        const isComplete = idx < currentIdx;
        const isFuture = idx > currentIdx;

        // Calculate progress within current phase
        let progress = 0;
        if (isActive && idx < VPI_PHASE_ORDER.length - 1) {
          const nextPhase = VPI_PHASES[VPI_PHASE_ORDER[idx + 1]];
          const currentThreshold = phase.threshold;
          const nextThreshold = nextPhase.threshold;
          const range = nextThreshold - currentThreshold;
          progress = Math.min(1, Math.max(0, (blockCount - currentThreshold) / range));
        } else if (isComplete || (isActive && idx === VPI_PHASE_ORDER.length - 1)) {
          progress = 1;
        }

        return (
          <div key={phaseName} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Phase Node */}
            <div style={{
              position: 'relative',
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: `2px solid ${isComplete || isActive ? phase.color : COLORS.TEXT_MUTED}`,
              background: isComplete ? phase.color : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              {/* Inner fill for active state */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  inset: 3,
                  borderRadius: '50%',
                  background: `conic-gradient(${phase.color} ${progress * 360}deg, transparent 0deg)`,
                  opacity: 0.5
                }} />
              )}
              
              {/* Phase initial */}
              <span style={{
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                color: isComplete ? '#020617' : (isActive ? phase.color : COLORS.TEXT_MUTED),
                zIndex: 1
              }}>
                {phaseName.charAt(0)}
              </span>

              {/* Active glow */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  border: `1px solid ${phase.color}`,
                  opacity: 0.4,
                  animation: 'vpi-pulse 2s ease-in-out infinite'
                }} />
              )}
            </div>

            {/* Connector Line */}
            {idx < VPI_PHASE_ORDER.length - 1 && (
              <div style={{
                width: 24,
                height: 2,
                background: isComplete 
                  ? `linear-gradient(90deg, ${phase.color}, ${VPI_PHASES[VPI_PHASE_ORDER[idx + 1]].color})`
                  : COLORS.GLASS_BORDER,
                marginLeft: 4,
                marginRight: 4,
                transition: 'all 0.3s ease'
              }} />
            )}
          </div>
        );
      })}

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes vpi-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
