/**
 * Challenges — Genesis + Seed challenges by tier. Completed / locked / available.
 */

import React from 'react';
import { GENESIS_CHALLENGE, SEED_CHALLENGES } from '@p31/game-integration';
import { getClient } from '../lib/game-client';

const BRAND = {
  green: '#00FF88',
  amber: '#FFB800',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const TIER_ORDER = ['seedling', 'sprout', 'sapling', 'oak', 'sequoia'] as const;

export function ChallengesView(): React.ReactElement {
  const client = getClient();
  const completed = new Set(client?.player.completedChallenges ?? ['genesis_resonance']);
  const allChallenges = [GENESIS_CHALLENGE, ...SEED_CHALLENGES];
  const byTier = TIER_ORDER.map((tier) => ({
    tier,
    challenges: allChallenges.filter((c) => c.tier === tier),
  })).filter((g) => g.challenges.length > 0);

  const total = allChallenges.length;
  const done = completed.size;
  const loveEarned = client?.player.totalLoveEarned ?? 50;
  const tier = client?.player.tier ?? 'seedling';

  return (
    <div>
      <h1 style={{ fontSize: 14, letterSpacing: 4, color: BRAND.muted, marginBottom: 8 }}>
        CHALLENGES
      </h1>
      <p style={{ fontSize: 12, color: BRAND.dim, marginBottom: 24 }}>
        {done}/{total} challenges · {loveEarned} LOVE earned · Tier: {tier}
      </p>

      {byTier.map(({ tier: t, challenges }) => (
        <div key={t} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 11, letterSpacing: 2, color: BRAND.muted, marginBottom: 12 }}>
            {t.toUpperCase()}
          </h2>
          {challenges.map((c) => {
            const isComplete = completed.has(c.id);
            const prereqsMet = c.prerequisites.every((p) => completed.has(p));
            const locked = !prereqsMet && !isComplete;
            return (
              <div
                key={c.id}
                style={{
                  background: BRAND.surface2,
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                  borderLeft: `4px solid ${isComplete ? BRAND.green : locked ? BRAND.dim : BRAND.amber}`,
                  opacity: locked ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isComplete && <span style={{ color: BRAND.green }}>✓</span>}
                  {locked && <span style={{ color: BRAND.dim }}>🔒</span>}
                  <span style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 16 }}>{c.title}</span>
                  {isComplete && <span style={{ fontSize: 10, color: BRAND.green }}>COMPLETE</span>}
                  {locked && (
                    <span style={{ fontSize: 10, color: BRAND.dim }}>
                      REQUIRES: {c.prerequisites[0]}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: BRAND.text, marginTop: 8 }}>{c.description}</p>
                <p style={{ fontSize: 11, fontStyle: 'italic', color: BRAND.dim, marginTop: 8 }}>
                  {c.fullerPrinciple}
                </p>
                <p style={{ fontSize: 11, color: BRAND.muted, marginTop: 4 }}>{c.realWorldExample}</p>
                <p style={{ fontSize: 10, color: BRAND.amber, marginTop: 8 }}>
                  {c.rewardLove} LOVE {c.rewardBadge ? `· ${c.rewardBadge}` : ''}
                </p>
                {!isComplete && !locked && (
                  <button
                    type="button"
                    style={{
                      marginTop: 12,
                      padding: '8px 16px',
                      background: BRAND.amber,
                      color: BRAND.void,
                      border: 'none',
                      borderRadius: 8,
                      fontFamily: 'Oxanium, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    START
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
