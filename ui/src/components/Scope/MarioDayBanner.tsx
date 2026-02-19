/**
 * Mario Day 2026 — temporary celebratory banner in P31 Spectrum.
 * Links to the Birthday Quest (Bonding game). Dismissible for the session; reappears until March 11.
 * Respects prefers-reduced-motion (no animation when reduced).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MarioDayBanner.css';

const SESSION_KEY = 'p31:mario-day-banner-dismissed';
const MARIO_DAY_END = new Date('2026-03-12T00:00:00'); // Hide from March 12 onward

function isWithinMarioDay(): boolean {
  return typeof window !== 'undefined' && new Date() < MARIO_DAY_END;
}

function wasDismissedThisSession(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function MarioDayBanner(): React.ReactElement | null {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isWithinMarioDay() && !wasDismissedThisSession());
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const handleStartQuest = () => {
    navigate('/bonding');
  };

  if (!visible) return null;

  return (
    <div
      className="mario-day-banner"
      role="region"
      aria-label="Mario Day 2026 celebration"
    >
      <div className="mario-day-banner__inner">
        <span className="mario-day-banner__star" aria-hidden>
          ⭐
        </span>
        <span className="mario-day-banner__text">
          ✨ Mario Day 2026 – Build your Super Star Molecule! ✨
        </span>
        <button
          type="button"
          className="mario-day-banner__cta"
          onClick={handleStartQuest}
        >
          Start Quest
        </button>
      </div>
      <button
        type="button"
        className="mario-day-banner__close"
        onClick={handleDismiss}
        aria-label="Dismiss Mario Day banner"
      >
        ×
      </button>
    </div>
  );
}
