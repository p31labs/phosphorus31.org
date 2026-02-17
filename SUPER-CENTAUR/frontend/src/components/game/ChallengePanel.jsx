import React from 'react';

const ChallengePanel = ({ challenges, currentChallenge, onSelect }) => {
  // Robust data validation
  const validChallenges = Array.isArray(challenges) ? challenges : [];
  if (!validChallenges || validChallenges.length === 0) return null;

  const active = currentChallenge || validChallenges[0];

  return (
    <div className="absolute top-4 right-4 w-64 space-y-2">
      {/* Current Challenge */}
      <div className="bg-card/90 backdrop-blur-lg rounded-lg border border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary uppercase">{active.tier}</span>
          <span className="text-xs text-pink-400 font-bold">+{active.rewardLove} LOVE</span>
        </div>
        <h4 className="text-sm font-semibold text-main">{active.title}</h4>
        <p className="text-xs text-muted mt-1">{active.description}</p>

        {active && active.objectives && Array.isArray(active.objectives) && active.objectives.length > 0 && (
          <div className="mt-2 space-y-1">
            {active.objectives.map((obj, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs">
                <span className="text-muted">○</span>
                <span className="text-muted">{obj?.description || obj?.title || 'Objective'}</span>
              </div>
            ))}
          </div>
        )}

        {active.fullerPrinciple && (
          <p className="text-xs text-primary/70 mt-2 italic">&ldquo;{active.fullerPrinciple}&rdquo;</p>
        )}
      </div>

      {/* Challenge List */}
      {validChallenges.length > 1 && (
        <div className="bg-card/90 backdrop-blur-lg rounded-lg border border-border p-2">
          <p className="text-xs font-semibold text-muted mb-1 px-1">All Challenges</p>
          {validChallenges.map((ch) => (
            <button
              key={ch?.id || Math.random()}
              onClick={() => onSelect(ch)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${ch?.id === active?.id ? 'bg-primary/20 text-primary' : 'text-muted hover:text-main hover:bg-surface'}`}
            >
              {ch?.title || 'Challenge'} <span className="opacity-50">({ch?.tier || 'unknown'})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengePanel;
