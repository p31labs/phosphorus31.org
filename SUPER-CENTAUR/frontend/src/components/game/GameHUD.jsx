import React from 'react';

const tierColors = { seedling: '#8BC34A', sprout: '#4CAF50', sapling: '#2E7D32', oak: '#1B5E20', sequoia: '#004D40' };

const GameHUD = ({ progress, gameState }) => {
  const { vertices, edges, maxwellRatio, isRigid, stabilityScore, primitives } = gameState;
  const tier = progress?.tier || 'seedling';

  return (
    <div className="absolute top-4 left-4 space-y-2">
      {/* Tier Badge */}
      <div className="flex items-center space-x-2 bg-card/90 backdrop-blur-lg rounded-lg border border-border px-3 py-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tierColors[tier] }} />
        <span className="text-xs font-semibold text-main capitalize">{tier}</span>
      </div>

      {/* Stats */}
      <div className="bg-card/90 backdrop-blur-lg rounded-lg border border-border px-3 py-2 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">LOVE Earned</span>
          <span className="font-bold text-pink-400">{progress?.totalLoveEarned || 0}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Streak</span>
          <span className="font-bold text-amber-400">{progress?.buildStreak || 0}d</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Challenges</span>
          <span className="font-bold text-green-400">{progress?.completedChallenges?.length || 0}</span>
        </div>
      </div>

      {/* Structure Info */}
      <div className="bg-card/90 backdrop-blur-lg rounded-lg border border-border px-3 py-2 space-y-1">
        <p className="text-xs font-semibold text-muted">Structure</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Pieces</span>
          <span className="font-bold text-main">{primitives.length}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">V / E</span>
          <span className="font-bold text-main">{vertices} / {edges}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Maxwell</span>
          <span className={`font-bold ${isRigid ? 'text-green-400' : 'text-amber-400'}`}>{maxwellRatio.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Stability</span>
          <span className={`font-bold ${stabilityScore >= 70 ? 'text-green-400' : stabilityScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{stabilityScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
