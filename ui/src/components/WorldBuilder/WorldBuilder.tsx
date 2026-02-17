/**
 * WorldBuilder — Quantum Geodesic Platform world creation
 * IVM lattice, structure visualization, geodesic analysis, code/visual modes.
 * Syncs to Colyseus when available; shows other players' structures.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { IVMLattice } from '../3d/IVMLattice';
import { QuantumClock } from '../3d/QuantumClock';
import { StructureVisualization } from './StructureVisualization';
import { GeodesicHeatmap } from './GeodesicHeatmap';
import { CoherenceHUD } from './CoherenceHUD';
import { FloatingNeutralIndicator } from './FloatingNeutralIndicator';
import { OraclePanel, type OracleStructure } from '../Oracle/OraclePanel';
import { useGeodesicAnalysis } from '../../hooks/useGeodesicAnalysis';
import { useVoiceBuilder } from '../../hooks/useVoiceBuilder';
import { useCoherenceStore } from '../../stores/coherence.store';
import { useStructureStore } from '../../stores/structure.store';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { useGeodesicRoom } from '../../contexts/GeodesicRoomContext';
import { useBuddyUser } from '../../contexts/BuddyUserContext';
import {
  BuddyCharacter,
  BuddySpeech,
  CodenamePicker,
  SensorySettingsPanel,
  ParentDashboard,
  SwitchControlManager,
} from '../Buddy';
import { FamilyCodingView } from '../Game/FamilyCodingView';
import { P31LanguageEditor } from '../P31Language/P31LanguageEditor';
import { SwarmScene, SwarmControl } from './agents';
import { SwarmVoiceListener } from './SwarmVoiceListener';
import { initSwarmOrchestrator } from '../../services/SwarmOrchestrator';
import { P31Dashboard } from '../P31Dashboard';

interface WorldBuilderProps {
  worldId: string;
  onClose: () => void;
}

const STABILITY_HISTORY_LEN = 10;

export const WorldBuilder: React.FC<WorldBuilderProps> = ({ worldId, onClose }) => {
  const [mode, setMode] = useState<'code' | 'visual'>('code');
  const vertices = useStructureStore((s) => s.vertices);
  const edges = useStructureStore((s) => s.edges);
  const setStructure = useStructureStore((s) => s.setStructure);
  const [lastMeasurementAt, setLastMeasurementAt] = useState(0);
  const [riskMap, setRiskMap] = useState<Map<string, number>>(new Map());
  const stabilityHistoryRef = useRef<number[]>([]);
  const recentActionsRef = useRef(0);

  const analysis = useGeodesicAnalysis(vertices, edges);
  const nudgeCoherence = useCoherenceStore((s) => s.nudgeCoherence);
  const { players, structures, send } = useGeodesicRoom();
  const { codename, memory, setCodename, loading, refreshMemory } = useBuddyUser();
  const [editingCodename, setEditingCodename] = useState(false);
  const [codenameInput, setCodenameInput] = useState('');
  const [showBuddyGreeting, setShowBuddyGreeting] = useState(true);
  const [showSensory, setShowSensory] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [orchestratorBuddyMessage, setOrchestratorBuddyMessage] = useState<string | null>(null);
  const voiceCommandsEnabled = useAccessibilityStore((s) => s.voiceCommands);

  // Swarm orchestrator: coherence → goals, voice-command → goals, buddy-say → speech
  useEffect(() => {
    const teardown = initSwarmOrchestrator();
    return teardown;
  }, []);

  // Expose swarm + coherence stores on window for Goal-Directed Swarm test plan (console debugging)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as Window & { useSwarmStore?: typeof import('../../stores/swarm.store').useSwarmStore; useCoherenceStore?: typeof import('../../stores/coherence.store').useCoherenceStore };
    import('../../stores/swarm.store').then((m) => { w.useSwarmStore = m.useSwarmStore; });
    import('../../stores/coherence.store').then((m) => { w.useCoherenceStore = m.useCoherenceStore; });
    return () => { delete w.useSwarmStore; delete w.useCoherenceStore; };
  }, []);

  const buddySayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ message: string }>;
      const msg = ev.detail?.message;
      if (msg) {
        if (buddySayTimeoutRef.current) clearTimeout(buddySayTimeoutRef.current);
        setOrchestratorBuddyMessage(msg);
        buddySayTimeoutRef.current = setTimeout(() => {
          setOrchestratorBuddyMessage(null);
          buddySayTimeoutRef.current = null;
        }, 5000);
      }
    };
    window.addEventListener('buddy-say', handler);
    return () => {
      window.removeEventListener('buddy-say', handler);
      if (buddySayTimeoutRef.current) clearTimeout(buddySayTimeoutRef.current);
    };
  }, []);

  const handleCompile = useCallback(
    (v: number[], e: number[]) => {
      setStructure(v, e);
      setLastMeasurementAt(Date.now());
      recentActionsRef.current += 1;
    },
    [setStructure]
  );

  const { handleVoiceInput } = useVoiceBuilder(vertices, edges, handleCompile, {
    onCommand: () => {},
    enabled: true,
  });

  // Keep a short stability history for The Oracle
  useEffect(() => {
    if (analysis?.stability == null) return;
    const prev = stabilityHistoryRef.current;
    if (prev.length >= STABILITY_HISTORY_LEN) prev.shift();
    prev.push(analysis.stability);
    stabilityHistoryRef.current = prev;
  }, [analysis?.stability]);

  // Sync structure to server when room is available
  useEffect(() => {
    if ((vertices.length > 0 || edges.length > 0) && send) {
      send('structureUpdate', { id: worldId, vertices, edges });
    }
  }, [vertices, edges, send, worldId]);

  // Nudge coherence when stability is high
  useEffect(() => {
    if (analysis && analysis.stability > 0.8) {
      nudgeCoherence(0.02);
    }
  }, [analysis, nudgeCoherence]);

  // Structures list for The Oracle (local + remote)
  const oracleStructures: OracleStructure[] = [
    {
      id: worldId,
      vertices,
      edges,
      stability: analysis?.stability,
      stabilityHistory: [...stabilityHistoryRef.current],
      fractalDimension: 1.0,
      recentActions: recentActionsRef.current,
    },
    ...Array.from(structures.entries())
      .filter(([id]) => id !== worldId)
      .map(([id, s]) => ({
        id,
        vertices: s.vertices ?? [],
        edges: s.edges ?? [],
        stability: 0.5,
        stabilityHistory: [] as number[],
        fractalDimension: 1.0,
        recentActions: 0,
      })),
  ];

  const switchControlEnabled = memory?.accessibility?.switchControl ?? false;
  const needsCodenamePick = !loading && (memory === null || codename === 'Builder');

  return (
    <div
      className="absolute inset-0 bg-black text-white z-30"
      role="application"
      aria-label="World Builder"
    >
      {needsCodenamePick && (
        <CodenamePicker modal onComplete={refreshMemory} />
      )}
      <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Grid infiniteGrid fadeDistance={30} cellSize={1} sectionSize={5} />
        <IVMLattice radius={20} spacing={1.5} />
        <StructureVisualization
          vertices={vertices}
          edges={edges}
          riskLevel={riskMap.get(worldId)}
        />
        <GeodesicHeatmap
          vertices={vertices}
          edges={edges}
          analysis={analysis}
          opacity={0.85}
        />
        <QuantumClock position={[0, 5, 0]} lastMeasurementAt={lastMeasurementAt} scale={1.2} />
        <SwarmScene />
        <BuddyCharacter playerCodename={codename} mood="happy" position={[0, 3, 8]} scale={1.2} />
        {Array.from(structures.entries()).map(
          ([id, struct]) =>
            id !== worldId && (
              <StructureVisualization
                key={id}
                vertices={struct.vertices ?? []}
                edges={struct.edges ?? []}
                color="#888"
                riskLevel={riskMap.get(id)}
              />
            )
        )}
        <OrbitControls />
      </Canvas>

      {/* Overlay UI */}
      <SwitchControlManager enabled={switchControlEnabled}>
        <div
          className="absolute top-4 left-4 bg-black/80 p-4 rounded-lg border w-96 max-h-[90vh] overflow-y-auto"
          style={{ borderColor: 'rgba(46, 204, 113, 0.5)' }}
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-400">World Builder</h2>
            <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Close World Builder"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-3 py-1 rounded ${mode === 'code' ? 'bg-green-600' : 'bg-gray-700'}`}
            onClick={() => setMode('code')}
          >
            Code
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${mode === 'visual' ? 'bg-green-600' : 'bg-gray-700'}`}
            onClick={() => setMode('visual')}
          >
            Visual
          </button>
        </div>

        {mode === 'code' ? (
          <P31LanguageEditor onCompile={handleCompile} />
        ) : (
          <FamilyCodingView onUpdate={handleCompile} />
        )}

        {analysis && (
          <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex justify-between text-sm">
              <span>Stability:</span>
              <span
                className={
                  analysis.stability > 0.7 ? 'text-green-400' : 'text-yellow-400'
                }
              >
                {(analysis.stability * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Maxwell&apos;s Rule:</span>
              <span
                className={
                  analysis.maxwellValid ? 'text-green-400' : 'text-red-400'
                }
              >
                {analysis.maxwellValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            {analysis.weakPoints.length > 0 && (
              <div className="text-red-400 text-sm mt-2">
                ⚠ Weak points: {analysis.weakPoints.length}
              </div>
            )}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-400">World ID: {worldId}</div>

        {/* Codename — privacy-safe display name; edit anytime */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <span className="text-xs text-gray-400">Your codename: </span>
          {editingCodename ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={codenameInput}
                onChange={(e) => setCodenameInput(e.target.value)}
                placeholder={codename}
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                aria-label="Edit codename"
              />
              <button
                type="button"
                className="px-2 py-1 rounded bg-green-600 text-white text-sm"
                onClick={async () => {
                  if (codenameInput.trim()) await setCodename(codenameInput.trim());
                  setEditingCodename(false);
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded bg-gray-600 text-sm"
                onClick={() => { setEditingCodename(false); setCodenameInput(''); }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <strong className="text-cyan-300">{loading ? '…' : codename}</strong>
              <button
                type="button"
                className="ml-2 text-xs text-gray-500 hover:text-cyan-400"
                onClick={() => { setCodenameInput(codename); setEditingCodename(true); }}
              >
                Edit
              </button>
            </>
          )}

          {/* Buddy / Sensory / Parent shortcuts */}
          <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-cyan-400"
              onClick={() => setShowBuddyGreeting((s) => !s)}
            >
              {showBuddyGreeting ? 'Hide greeting' : 'Buddy says hi'}
            </button>
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-cyan-400"
              onClick={() => { setShowSensory(true); setShowParentDashboard(false); }}
            >
              Sensory
            </button>
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-cyan-400"
              onClick={() => { setShowParentDashboard(true); setShowSensory(false); }}
            >
              Parent
            </button>
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-cyan-400"
              onClick={() => setShowDashboard((s) => !s)}
            >
              {showDashboard ? 'Hide' : '📊'} Dashboard
            </button>
          </div>

          {/* Voice: text input + continuous mic → voice-command (swarm goals) */}
          {voiceCommandsEnabled && (
            <>
              <SwarmVoiceListener enabled={voiceCommandsEnabled} />
              <div className="mt-3 pt-3 border-t border-gray-700">
              <label htmlFor="voice-builder-input" className="text-xs text-gray-400 block mb-1">
                Voice command
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const raw = voiceInput.trim();
                  if (raw) {
                    handleVoiceInput(raw);
                    window.dispatchEvent(new CustomEvent('voice-command', { detail: raw }));
                    setVoiceInput('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  id="voice-builder-input"
                  type="text"
                  value={voiceInput}
                  onChange={(e) => setVoiceInput(e.target.value)}
                  placeholder="e.g. add tetrahedron, build sierpinski depth 4, repair, stop"
                  className="flex-1 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white placeholder-gray-500"
                />
                <button type="submit" className="rounded bg-green-600 px-2 py-1 text-sm text-white">
                  Run
                </button>
              </form>
            </div>
            </>
          )}
        </div>
        </div>
      </SwitchControlManager>

      {showBuddyGreeting && (
        <div className="absolute bottom-4 left-4 z-10">
          <BuddySpeech
            message="Hello, $name! Ready to build something amazing?"
            speak
            autoHideMs={0}
            onDismiss={() => setShowBuddyGreeting(false)}
          />
        </div>
      )}
      {orchestratorBuddyMessage && (
        <div className="absolute bottom-4 left-4 z-10">
          <BuddySpeech
            message={orchestratorBuddyMessage}
            speak
            autoHideMs={5000}
            onDismiss={() => setOrchestratorBuddyMessage(null)}
          />
        </div>
      )}

      {showSensory && (
        <div className="absolute top-4 right-4 z-20 max-w-sm">
          <SensorySettingsPanel onClose={() => setShowSensory(false)} />
        </div>
      )}
      {showParentDashboard && (
        <div className="absolute top-4 right-4 z-20 max-w-sm">
          <ParentDashboard onClose={() => setShowParentDashboard(false)} />
        </div>
      )}

      {showDashboard && (
        <P31Dashboard onClose={() => setShowDashboard(false)} />
      )}

      <CoherenceHUD />
      <FloatingNeutralIndicator />
      <SwarmControl />

      {/* The Oracle — coherence forecast and personalized suggestions */}
      <OraclePanel
        structures={oracleStructures}
        playerCodename={codename}
        onPredictionsUpdate={setRiskMap}
        lastBuildStability={vertices.length > 0 && analysis ? analysis.stability : null}
      />
    </div>
  );
};

export default WorldBuilder;
