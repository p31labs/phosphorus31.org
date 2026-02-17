/**
 * The Oracle — AI-powered coherence prediction panel
 * Shows global coherence, per-structure risk, and personalized messages.
 * Lives in the World Builder; can receive onBuildComplete when the local structure is compiled.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useCoherenceStore } from '../../stores/coherence.store';
import { predictCoherenceDrop, loadOracleModel, createMockOracle } from '../../services/oracle';
import { Brain, AlertTriangle, Star } from 'lucide-react';
import phrasesData from '../../data/oracle-phrases.json';

type OraclePhrases = {
  greetings: string[];
  highCoherence: string[];
  lowCoherence: string[];
  danger: string[];
  calm: string[];
  instability: string[];
  warm: string[];
  masterwork: string[];
  wobbly: string[];
};

const phrases = phrasesData as OraclePhrases;

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)] ?? arr[0] ?? '';
}

function fillName(text: string, name: string): string {
  return text.replace(/\$name/g, name);
}

export interface OracleStructure {
  id: string;
  vertices: number[];
  edges: number[];
  stability?: number;
  stabilityHistory?: number[];
  fractalDimension?: number;
  recentActions?: number;
}

interface OraclePanelProps {
  structures: OracleStructure[];
  /** Public display name (codename); never use real name in UI. */
  playerCodename: string;
  onPredictionsUpdate?: (riskMap: Map<string, number>) => void;
  /** When the local structure is compiled, pass its stability so The Oracle can give immediate feedback. */
  lastBuildStability?: number | null;
}

export const OraclePanel: React.FC<OraclePanelProps> = ({
  structures,
  playerCodename,
  onPredictionsUpdate,
  lastBuildStability,
}) => {
  const [predictions, setPredictions] = useState<Map<string, number>>(new Map());
  const [_overallRisk, setOverallRisk] = useState(0);
  const [message, setMessage] = useState('');
  const globalCoherence = useCoherenceStore((s) => s.globalCoherence);
  const prevStabilityRef = React.useRef<number | null>(null);

  const setMessageFromCategory = useCallback(
    (category: keyof OraclePhrases) => {
      const arr = phrases[category];
      if (Array.isArray(arr) && arr.length > 0) {
        setMessage(fillName(pick(arr), playerCodename));
      }
    },
    [playerCodename]
  );

  // Load model on mount; fallback to mock if production model missing
  useEffect(() => {
    loadOracleModel().catch(() => {
      createMockOracle();
    });
  }, []);

  // Update predictions every 5 seconds and notify parent
  useEffect(() => {
    if (structures.length === 0) return;

    const runPredictions = () => {
      const newPredictions = new Map<string, number>();
      let totalRisk = 0;

      structures.forEach((s) => {
        const stabilityHistory = s.stabilityHistory ?? (s.stability != null ? [s.stability] : [0.5]);
        const risk = predictCoherenceDrop(
          s.vertices,
          s.edges,
          stabilityHistory,
          s.fractalDimension ?? 1.0,
          s.recentActions ?? 0
        );
        newPredictions.set(s.id, risk);
        totalRisk += risk;
      });

      const avgRisk = totalRisk / structures.length;
      setPredictions(newPredictions);
      setOverallRisk(avgRisk);
      onPredictionsUpdate?.(newPredictions);

      if (avgRisk > 0.7) {
        setMessageFromCategory('danger');
      } else if (avgRisk < 0.3) {
        setMessageFromCategory('calm');
      } else {
        const atRisk = Array.from(newPredictions.entries()).filter(([, r]) => r > 0.8);
        if (atRisk.length > 0) {
          setMessageFromCategory('instability');
        } else {
          setMessageFromCategory('warm');
        }
      }
    };

    runPredictions();
    const interval = setInterval(runPredictions, 5000);
    return () => clearInterval(interval);
  }, [structures, onPredictionsUpdate, setMessageFromCategory]);

  // When parent reports a new build stability (e.g. after compile), show immediate feedback
  useEffect(() => {
    if (lastBuildStability == null) return;
    if (prevStabilityRef.current === lastBuildStability) return;
    prevStabilityRef.current = lastBuildStability;
    if (lastBuildStability > 0.9) {
      setMessageFromCategory('masterwork');
    } else if (lastBuildStability < 0.4) {
      setMessageFromCategory('wobbly');
    }
  }, [lastBuildStability, setMessageFromCategory]);

  const predictionEntries = Array.from(predictions.entries());

  return (
    <div
      className="absolute top-4 right-4 bg-black/70 p-4 rounded-lg border border-purple-500 max-w-sm z-10"
      role="complementary"
      aria-label="The Oracle — coherence predictions"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="text-purple-400" size={24} aria-hidden />
        <h3 className="text-lg font-semibold text-purple-300">The Oracle</h3>
        <div className="flex-1 text-right text-xs text-gray-400">v2.0</div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Global Coherence</span>
          <span className="font-mono">{(globalCoherence * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded">
          <div
            className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded transition-all duration-300"
            style={{ width: `${globalCoherence * 100}%` }}
          />
        </div>
      </div>

      {message && (
        <div className="bg-purple-900/30 p-3 rounded border border-purple-500/50 mb-3 italic text-sm">
          &ldquo;{message}&rdquo;
        </div>
      )}

      <div className="text-xs text-gray-400 max-h-40 overflow-auto">
        {predictionEntries.map(([id, risk]) => (
          <div
            key={id}
            className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0"
          >
            <span className="truncate w-24">{id.slice(0, 8)}…</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-700 rounded">
                <div
                  className={`h-full rounded ${risk > 0.7 ? 'bg-red-400' : risk > 0.4 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${risk * 100}%` }}
                />
              </div>
              {risk > 0.7 && <AlertTriangle size={12} className="text-red-400 shrink-0" aria-hidden />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-500 flex justify-between items-center">
        <span>Predictions update every 5s</span>
        <Star size={12} className="text-yellow-400 shrink-0" aria-hidden />
      </div>
    </div>
  );
};

export default OraclePanel;
