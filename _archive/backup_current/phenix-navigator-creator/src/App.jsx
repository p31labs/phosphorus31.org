// ══════════════════════════════════════════════════════════════════════════════
// APP — ROOT COMPONENT
// Wraps TrimtabProvider, manages milestone speech, fabrication callback.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';
import { TrimtabProvider, useTrimtabContext } from './TrimtabContext.jsx';
import { useQuantumState } from './hooks/useQuantumState.js';
import { Fabricator, downloadGcode } from './fabricator.js';
import { useStore } from './store.js';
import { MILESTONE_SPEECH, SORTED_MILESTONES, TRIMTAB_QUOTES } from './constants.js';
import CreationPipeline from './components/CreationPipeline.jsx';

// ── Provider Shell ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <TrimtabProvider>
      <AppInner />
    </TrimtabProvider>
  );
}

// ── Consumer: Application Logic ──────────────────────────────────────────────
function AppInner() {
  const { speak } = useTrimtabContext();
  
  // Activate coherence simulation (writes to store, not here)
  useQuantumState();

  // Subscribe to block count only (prevents re-render on quantum ticks)
  const blockCount = useStore((s) => s.blocks.size);
  const setFabrication = useStore((s) => s.setFabrication);

  // Refs
  const bootedRef = useRef(false);
  const lastMilestoneRef = useRef(0);
  const fabricatorRef = useRef(null);

  // ── Boot Greeting ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    // Delay greeting to allow audio context activation
    const timer = setTimeout(() => {
      const quote = TRIMTAB_QUOTES[Math.floor(Math.random() * TRIMTAB_QUOTES.length)];
      speak("Phenix Navigator Creator online. " + quote, 'HIGH');
    }, 1500);

    return () => clearTimeout(timer);
  }, [speak]);

  // ── Milestone Speech ───────────────────────────────────────────────────────
  useEffect(() => {
    // Find the highest milestone we've crossed
    let milestone = 0;
    for (const m of SORTED_MILESTONES) {
      if (blockCount >= m) {
        milestone = m;
      } else {
        break;
      }
    }

    // Speak if we crossed a new milestone
    if (milestone > lastMilestoneRef.current && MILESTONE_SPEECH[milestone]) {
      speak(MILESTONE_SPEECH[milestone], 'NORMAL');
      lastMilestoneRef.current = milestone;
    }
  }, [blockCount, speak]);

  // ── Initialize Fabricator ──────────────────────────────────────────────────
  useEffect(() => {
    fabricatorRef.current = new Fabricator((update) => {
      setFabrication(update);
    });

    return () => {
      if (fabricatorRef.current) {
        fabricatorRef.current.abort();
      }
    };
  }, [setFabrication]);

  // ── Export Handler ─────────────────────────────────────────────────────────
  const handleExport = useCallback(async (scene) => {
    if (!fabricatorRef.current || !scene) {
      console.error('[App] No fabricator or scene');
      return;
    }

    try {
      speak("Accessing Foundry. Processing geometry.", 'HIGH');
      const gcode = await fabricatorRef.current.materialize(scene);
      downloadGcode(gcode);
      speak("Fabrication file generated. You have altered the physical universe.", 'HIGH');
    } catch (e) {
      if (e.message === 'AbortError') {
        speak("Fabrication aborted.", 'NORMAL');
        return;
      }
      console.error('[App] Fabrication error:', e);
      speak("Error in foundry. Check reactor containment.", 'HIGH');
    }
  }, [speak]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#020617',
      overflow: 'hidden'
    }}>
      <CreationPipeline onExport={handleExport} />
    </div>
  );
}
