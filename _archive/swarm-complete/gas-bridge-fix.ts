// ═══════════════════════════════════════════════════════════════
// GAS BRIDGE URL FIX — Replace lines 70-72 in ui/src/lib/gas-bridge.ts
// ═══════════════════════════════════════════════════════════════
//
// PROBLEM: gas-bridge.ts reads VITE_SHELTER_URL for the Google Apps Script URL.
//          But VITE_SHELTER_URL is the Shelter/Buffer backend. These are different services.
//
// FIX: Read from localStorage first (ConnectionsView stores the URL there),
//      then fall back to a dedicated VITE_GAS_URL env var.
//
// FIND THIS (approximately lines 70-72):
//
//   const GAS_URL = import.meta.env.VITE_SHELTER_URL || '';
//
// REPLACE WITH:

const GAS_URL = (() => {
  // 1. Check localStorage (ConnectionsView saves the URL here)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('p31:gas-url');
    if (stored) return stored;
  }
  // 2. Fall back to dedicated env var
  if (typeof import.meta !== 'undefined') {
    return (import.meta as any).env?.VITE_GAS_URL ?? '';
  }
  // 3. No URL available
  return '';
})();

// ═══════════════════════════════════════════════════════════════
// ALSO ADD TO .env.example:
//
//   # Google Apps Script web app URL (GENESIS_GATE deployment URL)
//   # Get this from: GAS Editor → Deploy → Web App → Copy URL
//   VITE_GAS_URL=
//
// ═══════════════════════════════════════════════════════════════
