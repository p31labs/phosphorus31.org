/**
 * Alien Easter Eggs — The UI breathes.
 *
 * Three subtle effects that make the interface feel alive:
 *
 * 1. Circadian Gradient — Background tint shifts with time of day.
 *    Dawn is warm amber, midday is clear, dusk is golden, night is deep void.
 *
 * 2. Digital Patina — The UI ages gracefully with use.
 *    First session is pristine. After weeks, borders soften, colors warm.
 *    Like a well-worn journal.
 *
 * 3. Heisenberg Buttons — Observation changes the state.
 *    Some button labels subtly shift on hover. The act of looking changes
 *    what you see. Playful, not disorienting.
 */

import { useEffect, useRef } from 'react';

// Circadian color palette — warm at edges of day, cool at center
const CIRCADIAN_PALETTE = [
  // hour: [hue-shift, saturation-boost, warmth]
  { h: 0, s: 0, w: 0.02 },   // 00:00 — deep night
  { h: 0, s: 0, w: 0.01 },   // 01:00
  { h: 0, s: 0, w: 0.01 },   // 02:00
  { h: 0, s: 0, w: 0.01 },   // 03:00
  { h: 5, s: 0, w: 0.02 },   // 04:00 — pre-dawn stir
  { h: 15, s: 5, w: 0.06 },  // 05:00 — first light
  { h: 25, s: 10, w: 0.10 }, // 06:00 — dawn
  { h: 20, s: 8, w: 0.08 },  // 07:00 — morning
  { h: 10, s: 4, w: 0.04 },  // 08:00
  { h: 5, s: 2, w: 0.02 },   // 09:00
  { h: 0, s: 0, w: 0 },      // 10:00 — clear
  { h: 0, s: 0, w: 0 },      // 11:00
  { h: 0, s: 0, w: 0 },      // 12:00 — noon
  { h: 0, s: 0, w: 0 },      // 13:00
  { h: 0, s: 0, w: 0 },      // 14:00
  { h: 2, s: 1, w: 0.01 },   // 15:00
  { h: 8, s: 4, w: 0.03 },   // 16:00 — afternoon
  { h: 18, s: 8, w: 0.07 },  // 17:00 — golden hour
  { h: 25, s: 12, w: 0.12 }, // 18:00 — sunset
  { h: 20, s: 10, w: 0.10 }, // 19:00 — dusk
  { h: 12, s: 5, w: 0.06 },  // 20:00 — twilight
  { h: 5, s: 2, w: 0.03 },   // 21:00 — evening
  { h: 2, s: 1, w: 0.02 },   // 22:00
  { h: 0, s: 0, w: 0.02 },   // 23:00 — night
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getCircadianValues(): { hue: number; sat: number; warmth: number } {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const t = minute / 60;

  const current = CIRCADIAN_PALETTE[hour];
  const next = CIRCADIAN_PALETTE[(hour + 1) % 24];

  return {
    hue: lerp(current.h, next.h, t),
    sat: lerp(current.s, next.s, t),
    warmth: lerp(current.w, next.w, t),
  };
}

// Digital Patina — age the interface
const PATINA_KEY = 'p31_patina';

interface PatinaData {
  firstSeen: string;
  sessionCount: number;
  totalMinutes: number;
}

function getPatina(): PatinaData {
  try {
    const raw = localStorage.getItem(PATINA_KEY);
    if (raw) return JSON.parse(raw) as PatinaData;
  } catch {
    // Fresh start
  }
  return {
    firstSeen: new Date().toISOString(),
    sessionCount: 0,
    totalMinutes: 0,
  };
}

function savePatina(data: PatinaData): void {
  try {
    localStorage.setItem(PATINA_KEY, JSON.stringify(data));
  } catch {
    // Storage full — graceful degradation
  }
}

function getPatinaLevel(data: PatinaData): number {
  // 0 = brand new, 1 = well-worn (after ~30 days of regular use)
  const daysSinceFirst = Math.max(0, (Date.now() - new Date(data.firstSeen).getTime()) / (1000 * 60 * 60 * 24));
  const sessionFactor = Math.min(1, data.sessionCount / 60);
  const timeFactor = Math.min(1, data.totalMinutes / 2000);
  const dayFactor = Math.min(1, daysSinceFirst / 30);
  return Math.min(1, (sessionFactor + timeFactor + dayFactor) / 3);
}

// Heisenberg effect — labels that shift on observation
const HEISENBERG_LABELS: ReadonlyArray<readonly [string, string]> = [
  ['Start', 'Begin'],
  ['Begin', 'Start'],
  ['Close', 'Done'],
  ['Done', 'Complete'],
  ['Save', 'Keep'],
  ['Settings', 'Preferences'],
  ['Back', 'Return'],
  ['Next', 'Continue'],
  ['Help', 'Guide'],
  ['Show', 'Reveal'],
  ['Hide', 'Tuck'],
  ['Open', 'Unfold'],
];

function applyHeisenbergEffect(): void {
  // Only runs ~10% of the time to keep it rare and delightful
  if (Math.random() > 0.10) return;

  const buttons = document.querySelectorAll<HTMLButtonElement>(
    'button:not([data-heisenberg-immune])'
  );

  buttons.forEach((btn) => {
    const text = btn.textContent?.trim() || '';
    for (const [from, to] of HEISENBERG_LABELS) {
      if (text === from && !btn.dataset.heisenbergOriginal) {
        btn.dataset.heisenbergOriginal = text;
        btn.textContent = to;

        // Restore on mouse leave
        const restore = () => {
          if (btn.dataset.heisenbergOriginal) {
            btn.textContent = btn.dataset.heisenbergOriginal;
            delete btn.dataset.heisenbergOriginal;
          }
          btn.removeEventListener('mouseleave', restore);
        };
        btn.addEventListener('mouseleave', restore);
        break;
      }
    }
  });
}

/**
 * Hook that activates all three alien easter eggs.
 * Respects prefers-reduced-motion — circadian gradient only (no animations).
 */
export function useAlienEasterEggs(): void {
  const patinaRef = useRef<PatinaData>(getPatina());
  const minuteTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Circadian Gradient ---
    function updateCircadian(): void {
      const { hue, sat, warmth } = getCircadianValues();
      root.style.setProperty('--circadian-hue', `${hue}deg`);
      root.style.setProperty('--circadian-sat', `${sat}%`);
      root.style.setProperty('--circadian-warmth', `${warmth}`);

      // Compute a subtle overlay color
      const r = Math.round(warmth * 255);
      const g = Math.round(warmth * 180);
      const b = Math.round(warmth * 80);
      root.style.setProperty(
        '--circadian-tint',
        `rgba(${r}, ${g}, ${b}, ${warmth * 0.15})`
      );
    }

    updateCircadian();
    const circadianInterval = setInterval(updateCircadian, 60000); // Every minute

    // --- Digital Patina ---
    const patina = patinaRef.current;
    patina.sessionCount++;
    savePatina(patina);

    const level = getPatinaLevel(patina);
    root.dataset.patinaLevel = String(Math.floor(level * 10)); // 0-10

    // Track usage time
    minuteTimerRef.current = setInterval(() => {
      patina.totalMinutes++;
      savePatina(patina);
      const newLevel = getPatinaLevel(patina);
      root.dataset.patinaLevel = String(Math.floor(newLevel * 10));
    }, 60000);

    // --- Heisenberg Buttons ---
    let heisenbergInterval: ReturnType<typeof setInterval> | null = null;
    if (!prefersReduced) {
      // Apply very occasionally — every 30 seconds, with 10% chance
      heisenbergInterval = setInterval(applyHeisenbergEffect, 30000);
    }

    return () => {
      clearInterval(circadianInterval);
      if (minuteTimerRef.current) clearInterval(minuteTimerRef.current);
      if (heisenbergInterval) clearInterval(heisenbergInterval);
      root.style.removeProperty('--circadian-hue');
      root.style.removeProperty('--circadian-sat');
      root.style.removeProperty('--circadian-warmth');
      root.style.removeProperty('--circadian-tint');
      delete root.dataset.patinaLevel;
    };
  }, []);
}
