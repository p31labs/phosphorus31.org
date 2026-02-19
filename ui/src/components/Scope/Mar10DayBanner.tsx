/**
 * MAR10 Day 2026 — celebratory banner in P31 Spectrum.
 * Links to the Super Star Quest (Bonding game). Dismissible for the session; reappears until March 11.
 * Respects prefers-reduced-motion (no animation when reduced).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mar10DayBanner.css';

const SESSION_KEY = 'p31:mar10-day-banner-dismissed';
const MAR10_DAY_END = new Date('2026-03-12T00:00:00');

function isWithinMar10Day(): boolean {
  return typeof window !== 'undefined' && new Date() < MAR10_DAY_END;
}

function wasDismissedThisSession(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function Mar10DayBanner(): React.ReactElement | null {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isWithinMar10Day() && !wasDismissedThisSession());
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
      className="mar10-day-banner"
      role="region"
      aria-label="MAR10 Day 2026 celebration"
    >
      <div className="mar10-day-banner__inner">
        <span className="mar10-day-banner__star" aria-hidden>
          ⭐
        </span>
        <span className="mar10-day-banner__text">
          ✨ MAR10 Day 2026 – Build your Super Star Molecule! ✨
        </span>
        <button
          type="button"
          className="mar10-day-banner__cta"
          onClick={handleStartQuest}
        >
          Start Quest
        </button>
      </div>
      <button
        type="button"
        className="mar10-day-banner__close"
        onClick={handleDismiss}
        aria-label="Dismiss MAR10 Day banner"
      >
        ×
      </button>
    </div>
  );
}
