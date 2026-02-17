/**
 * Changelog modal — What's New in DevTools 145.
 * Lists new features: swarm goals, dashboard, L.O.V.E. wallet, mode switcher.
 */

import React from 'react';

interface ChangelogModalProps {
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-title"
    >
      <div
        className="bg-gray-900 p-6 rounded-lg border border-green-500 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="changelog-title" className="text-2xl font-bold text-green-400 mb-4">
          What&apos;s New in DevTools 145
        </h2>
        <ul className="space-y-3 text-gray-300">
          <li>
            ✨ <span className="text-green-400">Swarm Goals:</span> Agents now follow voice
            commands (repair, Sierpinski).
          </li>
          <li>
            📊 <span className="text-green-400">Enhanced Dashboard:</span> Weak points, fractal
            dimension, and wallet view.
          </li>
          <li>
            🔗 <span className="text-green-400">L.O.V.E. Economy:</span> Integrated donation
            wallet – earn and spend Coherence Tokens.
          </li>
          <li>
            🔺 <span className="text-green-400">Sierpinski Scaling:</span> Build recursive
            tetrahedrons with the swarm.
          </li>
          <li>
            🎮 <span className="text-green-400">Mode Switcher:</span> Choose between Slice,
            Build, Repair, and Sierpinski modes.
          </li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
};
