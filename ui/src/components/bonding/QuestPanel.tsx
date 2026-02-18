/**
 * QuestPanel — Super Star Quest progress in Bonding game.
 * Shows 4 steps, LOVE rewards, and Print Now when the chain is complete.
 */

import React from 'react';
import {
  isBirthdayQuestActive,
  generateBirthdayQuestChain,
  BIRTHDAY_QUEST_LOVE_REWARDS,
} from '@p31labs/game-engine';
import type { BirthdayQuestProgress } from '../../types/bonding';

const BRAND = {
  green: '#00FF88',
  amber: '#FFB800',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

export interface QuestPanelProps {
  /** Progress for this game (shared between players). */
  progress: BirthdayQuestProgress | undefined;
  /** Whether the full chain is complete (step 4 done). */
  allComplete: boolean;
  /** Callback when user taps Print Now. */
  onPrintNow?: () => void;
  /** Optional: show as memorial (read-only, after MAR10). */
  isMemorial?: boolean;
}

export function QuestPanel({
  progress,
  allComplete,
  onPrintNow,
  isMemorial = false,
}: QuestPanelProps): React.ReactElement | null {
  const active = isBirthdayQuestActive();
  const chain = generateBirthdayQuestChain();
  if (chain.length === 0 && !progress?.completedSteps?.length) return null;

  const completedSet = new Set(progress?.completedSteps ?? []);

  return (
    <div
      style={{
        marginBottom: 24,
        padding: 12,
        background: BRAND.void,
        borderRadius: 8,
        border: `1px solid ${isMemorial ? BRAND.dim : BRAND.amber}`,
      }}
    >
      <h3 style={{ fontSize: 14, color: BRAND.muted, marginBottom: 12 }}>
        {isMemorial ? '🎂 MAR10 Quest (complete)' : '🎂 Birthday Quest'}
      </h3>
      <p style={{ fontSize: 11, color: BRAND.dim, marginBottom: 12 }}>
        {isMemorial
          ? 'This quest has ended. You completed it!'
          : 'Build the Super Star Molecule together. Star Bits = LOVE.'}
      </p>

      {chain.map((quest, i) => {
        const step = i + 1;
        const done = completedSet.has(step);
        const love = BIRTHDAY_QUEST_LOVE_REWARDS[i] ?? 0;
        return (
          <div
            key={quest.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              marginBottom: 10,
              opacity: done ? 0.85 : 1,
            }}
          >
            <span style={{ fontSize: 16 }} aria-hidden>
              {done ? '✅' : '○'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontFamily: 'Oxanium, sans-serif' }}>
                {quest.title}
              </div>
              <div style={{ fontSize: 10, color: BRAND.muted }}>
                {quest.description}
              </div>
              <div style={{ fontSize: 10, color: BRAND.amber, marginTop: 2 }}>
                +{love} Star Bits{done ? ' ✓' : ''}
              </div>
            </div>
          </div>
        );
      })}

      {progress?.loveEarned != null && progress.loveEarned > 0 && (
        <div
          style={{
            marginTop: 12,
            padding: 8,
            background: BRAND.surface2,
            borderRadius: 6,
            fontSize: 12,
            color: BRAND.amber,
          }}
        >
          Total earned: {progress.loveEarned} Star Bits
        </div>
      )}

      {allComplete && (
        <>
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background: BRAND.amber,
              color: BRAND.void,
              borderRadius: 8,
              fontSize: 12,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            🌟 MAR10 Day unlocked!
          </div>
          {onPrintNow && (
            <button
              type="button"
              onClick={onPrintNow}
              style={{
                width: '100%',
                marginTop: 10,
                padding: '12px 16px',
                background: BRAND.green,
                color: BRAND.void,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'Oxanium, sans-serif',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Print Now
            </button>
          )}
        </>
      )}
    </div>
  );
}
