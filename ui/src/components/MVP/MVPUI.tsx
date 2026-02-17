/**
 * Quantum MVP HUD — stability, coherence, Maxwell, Add/Clear, optional Sierpiński rule.
 */

import React from 'react';
import { useStructureStore } from '../../stores/structure.store';
import { useCoherenceStore } from '../../stores/coherence.store';
import { analyzeStructure } from '../../engine/structure-analysis';

export const MVPUI: React.FC = () => {
  const {
    vertices,
    edges,
    addTetrahedron,
    clear,
    sierpinskiRuleEnabled,
    setSierpinskiRuleEnabled,
    applySierpinskiRule,
  } = useStructureStore();
  const globalCoherence = useCoherenceStore((s) => s.globalCoherence);
  const analysis = analyzeStructure(vertices, edges);
  const tetraCount = vertices.length / 12; // 4 vertices × 3 coords per tetra

  return (
    <div
      className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg text-white border border-[#2ecc71]/30"
      role="region"
      aria-label="Quantum MVP controls and status"
    >
      <h2 className="text-xl font-bold mb-2 text-[#2ecc71]">Quantum MVP</h2>
      <div className="mb-3 space-y-1 text-sm">
        <div>Tetrahedra: {tetraCount}</div>
        <div>Stability: {(analysis.stability * 100).toFixed(1)}%</div>
        <div>
          Maxwell&apos;s Rule: {analysis.maxwellValid ? '✅' : '❌'}
        </div>
        <div>Global Coherence: {(globalCoherence * 100).toFixed(1)}%</div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={addTetrahedron}
          className="bg-[#2ecc71] text-black px-3 py-1.5 rounded font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Add tetrahedron"
        >
          Add Tetra
        </button>
        <button
          type="button"
          onClick={clear}
          className="bg-red-600 text-white px-3 py-1.5 rounded font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Clear structure"
        >
          Clear
        </button>
      </div>
      <div className="border-t border-[#2ecc71]/20 pt-2 mt-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={sierpinskiRuleEnabled}
            onChange={(e) => setSierpinskiRuleEnabled(e.target.checked)}
            className="rounded border-[#2ecc71]/50 text-[#2ecc71] focus:ring-[#2ecc71]"
            aria-label="Sierpiński rule: add scaled tetrahedron when ≥3 neighbors at a cell"
          />
          <span>Sierpiński rule (≥3 → center tetra)</span>
        </label>
        <button
          type="button"
          onClick={applySierpinskiRule}
          className="mt-1.5 text-xs bg-white/10 text-white px-2 py-1 rounded hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-[#2ecc71]"
          aria-label="Apply Sierpiński rule once"
        >
          Apply once
        </button>
      </div>
    </div>
  );
};

export default MVPUI;
