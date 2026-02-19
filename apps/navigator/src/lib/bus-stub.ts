/**
 * Read p31:* keys from localStorage (same keys Shelter writes via @p31labs/bus).
 * Use this when bus is not yet wired or for minimal deps in navigator.
 */
const SPOONS_KEY = "p31:spoons";

export function getSpoons(): number {
  try {
    const raw = localStorage.getItem(SPOONS_KEY);
    if (raw == null) return 8;
    const n = Number(JSON.parse(raw));
    return Number.isFinite(n) ? Math.max(0, Math.min(12, n)) : 8;
  } catch {
    return 8;
  }
}
