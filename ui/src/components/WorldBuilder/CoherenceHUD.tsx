/**
 * CoherenceHUD — Player and global coherence display for World Builder
 */

import React from 'react';
import { useCoherenceStore } from '../../stores/coherence.store';
import { Heart } from 'lucide-react';

export const CoherenceHUD: React.FC = () => {
  const playerCoherence = useCoherenceStore((s) => s.playerCoherence);
  const globalCoherence = useCoherenceStore((s) => s.globalCoherence);

  return (
    <div
      className="absolute bottom-4 left-4 flex gap-4 bg-black/60 p-3 rounded-lg border border-green-500/30"
      style={{ borderColor: 'rgba(46, 204, 113, 0.3)' }}
      role="status"
      aria-label="Player and global coherence"
    >
      <div className="flex items-center gap-2">
        <Heart className="text-red-400" size={20} aria-hidden />
        <div>
          <div className="text-xs text-gray-400">Player Coherence</div>
          <div className="w-32 h-2 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-red-400 rounded transition-all duration-300"
              style={{ width: `${playerCoherence * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
          aria-hidden
        />
        <div>
          <div className="text-xs text-gray-400">Global Coherence</div>
          <div className="text-sm font-bold text-cyan-400">
            {(globalCoherence * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoherenceHUD;
