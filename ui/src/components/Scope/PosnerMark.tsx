/**
 * P31 Scope — Small Posner molecule mark for empty states.
 * 40px, 40% opacity. SVG so no Three.js.
 */

const SIZE = 40;
const OPACITY = 0.4;

/** Minimal Posner-inspired mark: 4 nodes (tetrahedron footprint). */
export function PosnerMark({ className }: { className?: string }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Tetrahedron base triangle */}
      <circle cx="12" cy="6" r="2.5" fill="#2ecc71" opacity={OPACITY} />
      <circle cx="6" cy="18" r="2.5" fill="#60a5fa" opacity={OPACITY} />
      <circle cx="18" cy="18" r="2.5" fill="#2ecc71" opacity={OPACITY} />
      {/* Top vertex (P) */}
      <circle cx="12" cy="12" r="2" fill="#2ecc71" opacity={OPACITY} />
      {/* Light bonds */}
      <line x1="12" y1="6" x2="12" y2="12" stroke="#4A4A7A" strokeWidth="0.8" opacity={OPACITY} />
      <line x1="6" y1="18" x2="12" y2="12" stroke="#4A4A7A" strokeWidth="0.8" opacity={OPACITY} />
      <line x1="18" y1="18" x2="12" y2="12" stroke="#4A4A7A" strokeWidth="0.8" opacity={OPACITY} />
    </svg>
  );
}
