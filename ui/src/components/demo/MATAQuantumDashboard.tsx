/**
 * MATA Quantum Dashboard — State Engine UI
 *
 * Wires QuantumProvider, useQuantumCoherence, QuantumCanvas, QuantumCoherenceIndicator,
 * and QuantumAwareButton to DEMO_TIMELINE. Syncs demo voltage → coherence for the green-mist.
 * Scrubbing the timeline drives voltage; coherence drops at high voltage; INITIATE GROUNDING appears at >7V.
 */

import React, { useState, useEffect } from 'react';
import { P31 } from '@p31/config';
import { QuantumProvider } from '../quantum/QuantumProvider';
import { QuantumCoherenceIndicator } from '../quantum/QuantumCoherenceIndicator';
import { QuantumAwareButton } from '../quantum/QuantumAwareButton';
import { QuantumCanvas } from '../ui/QuantumCanvas';
import { useQuantumCoherence } from '../../hooks/useQuantumCoherence';
import { useQuantumStore } from '../../stores/quantum.store';
import { DEMO_TIMELINE, MESH_LOGS } from '../../demo-data';

const demoVoltageData = DEMO_TIMELINE;
const demoLoRaMessages = MESH_LOGS;

interface MATAQuantumDashboardProps {
  onClose?: () => void;
}

function DashboardContent({ onClose }: { onClose?: () => void }) {
  const { coherence } = useQuantumCoherence();
  const updateCoherence = useQuantumStore((s) => s.updateCoherence);
  const setDemoMode = useQuantumStore((s) => s.setDemoMode);
  const [timelineIndex, setTimelineIndex] = useState(0);

  const currentDemoState = demoVoltageData[timelineIndex] ?? demoVoltageData[0];

  // Demo mode: timeline drives coherence; hook skips spoons sync
  useEffect(() => {
    setDemoMode(true);
    return () => setDemoMode(false);
  }, [setDemoMode]);

  // Sync demo state to quantum store: high voltage → low coherence
  useEffect(() => {
    const targetCoherence = Math.max(0.2, 1 - currentDemoState.voltage / 10);
    updateCoherence(targetCoherence, 'mata-demo');
  }, [currentDemoState.voltage, updateCoherence]);

  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="min-h-screen text-slate-300 font-mono relative overflow-hidden"
      style={{ background: P31.tokens.void }}
    >
      {/* 1. BACKGROUND: QUANTUM CANVAS (The "Green Mist") */}
      <div className="absolute inset-0 z-0 opacity-60">
        <QuantumCanvas
          width={window.innerWidth}
          height={window.innerHeight}
          showMath={false}
          voltage={currentDemoState.voltage}
          coherence={coherence}
        />
      </div>

      {/* 2. TOP BAR: STATUS & COHERENCE */}
      <div
        className="relative z-10 flex justify-between items-center p-4 border-b border-white/10 bg-black/40 backdrop-blur-md"
        style={{ borderColor: `${P31.tokens.phosphorus}40` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="text-sm font-bold tracking-widest"
            style={{ color: P31.tokens.phosphorus }}
          >
            P31 NODE ZERO
          </div>
          <div className="text-xs px-2 py-1 rounded bg-white/5 text-white/50">
            MESH: ONLINE
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-white/40">
            Coherence
          </span>
          <QuantumCoherenceIndicator size={40} showLabel />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded border border-white/20 hover:bg-white/10 transition-colors"
              style={{ color: P31.tokens.phosphorus }}
              aria-label="Exit MATA Demo"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN COCKPIT UI */}
      <div className="relative z-10 container mx-auto p-6 grid grid-cols-12 gap-6 h-[80vh]">
        {/* LEFT: SPOON GAUGE */}
        <div
          className="col-span-3 flex flex-col gap-4 p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-sm"
          style={{ borderColor: `${P31.tokens.slate}40` }}
        >
          <h3 className="text-xs uppercase tracking-widest text-white/60">
            Energy Topology
          </h3>
          <div className="flex-1 flex items-end justify-center py-8">
            <div className="w-16 h-full bg-white/5 rounded-full relative overflow-hidden">
              <div
                className="absolute bottom-0 w-full transition-all duration-1000 ease-out"
                style={{
                  height: `${currentDemoState.voltage < 5 ? 80 : 30}%`,
                  background:
                    coherence > 0.6 ? P31.tokens.phosphorus : P31.tokens.crimson,
                  boxShadow: `0 0 ${coherence * 30}px ${coherence > 0.6 ? P31.tokens.phosphorus : P31.tokens.crimson}`,
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(coherence * 100)}%</div>
            <div className="text-xs text-white/40">SPOON AVAILABILITY</div>
          </div>
        </div>

        {/* CENTER: QUANTUM VIEWPORT */}
        <div className="col-span-6 flex items-center justify-center relative">
          <div className="text-center space-y-4">
            <div
              className="text-6xl font-black transition-colors duration-500"
              style={{
                color:
                  coherence > 0.5 ? P31.tokens.phosphorus : P31.tokens.crimson,
                textShadow: `0 0 ${coherence * 50}px currentColor`,
              }}
            >
              {currentDemoState.voltage.toFixed(1)}V
            </div>
            <div className="text-sm tracking-[0.3em] uppercase">
              {currentDemoState.label}
            </div>
            {currentDemoState.voltage > 7 && (
              <QuantumAwareButton
                variant="primary"
                quantumGlow
                onClick={() => {
                  window.alert('HAPTIC FIRED — Grounding initiated.');
                }}
                className="mt-8"
              >
                INITIATE GROUNDING
              </QuantumAwareButton>
            )}
          </div>
        </div>

        {/* RIGHT: LOGS */}
        <div
          className="col-span-3 p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-sm flex flex-col"
          style={{ borderColor: `${P31.tokens.slate}40` }}
        >
          <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4">
            Mesh Telemetry
          </h3>
          <div className="flex-1 font-mono text-xs space-y-2 opacity-80">
            {demoLoRaMessages.map((log) => (
              <div
                key={log.id}
                className="border-l-2 pl-2 border-white/20"
                style={{ borderLeftColor: `${P31.tokens.phosphorus}40` }}
              >
                <span className="text-white/40">[{log.rssi}dBm]</span> {log.msg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM: TIMELINE SCRUBBER */}
      <div
        className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20"
        style={{ background: `linear-gradient(to top, ${P31.tokens.void}, ${P31.tokens.void}cc, transparent)` }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-xs font-bold"
            style={{ color: P31.tokens.phosphorus }}
          >
            DEMO REPLAY
          </span>
          <input
            type="range"
            min={0}
            max={demoVoltageData.length - 1}
            value={timelineIndex}
            onChange={(e) => setTimelineIndex(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: P31.tokens.phosphorus }}
            aria-label="Scrub through demo day timeline"
          />
          <span className="font-mono text-xs">{currentDemoState.time}</span>
        </div>
      </div>
    </div>
  );
}

export function MATAQuantumDashboard({ onClose }: MATAQuantumDashboardProps = {}) {
  return (
    <QuantumProvider>
      <DashboardContent onClose={onClose} />
    </QuantumProvider>
  );
}

export default MATAQuantumDashboard;
