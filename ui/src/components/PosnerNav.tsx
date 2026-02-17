/**
 * PosnerNav — SVG interactive Posner molecule (Ca₉(PO₄)₆). The atoms ARE the navigation.
 * 9 calcium atoms = 9 routes. 6 phosphorus atoms = decoration (pulsing signal).
 * Rotates in 3D projected to 2D. 35-second revolution. 60fps. No WebGL.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  magenta: '#FF00CC',
  violet: '#7A27FF',
  void: '#050510',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

interface CaAtom {
  id: number;
  route: string;
  label: string;
  color: string;
  baseRadius: number;
  x3d: number;
  y3d: number;
  z3d: number;
}

interface PAtom {
  id: number;
  x3d: number;
  y3d: number;
  z3d: number;
}

const R = 160;

// Outer ring: 6 Ca at 60-degree intervals
const outerCa: CaAtom[] = [
  { id: 0, route: '/scope', label: 'SCOPE', color: BRAND.cyan, baseRadius: 28, x3d: R * Math.cos(0), y3d: R * Math.sin(0), z3d: 0.3 },
  { id: 1, route: '/fold', label: 'FOLD', color: BRAND.amber, baseRadius: 28, x3d: R * Math.cos(Math.PI / 3), y3d: R * Math.sin(Math.PI / 3), z3d: -0.3 },
  { id: 2, route: '/wallet', label: 'WALLET', color: BRAND.magenta, baseRadius: 28, x3d: R * Math.cos((2 * Math.PI) / 3), y3d: R * Math.sin((2 * Math.PI) / 3), z3d: 0.3 },
  { id: 3, route: '/challenges', label: 'CHALLENGES', color: BRAND.violet, baseRadius: 28, x3d: R * Math.cos(Math.PI), y3d: R * Math.sin(Math.PI), z3d: -0.3 },
  { id: 4, route: '/sprout', label: 'SPROUT', color: BRAND.magenta, baseRadius: 28, x3d: R * Math.cos((4 * Math.PI) / 3), y3d: R * Math.sin((4 * Math.PI) / 3), z3d: 0.3 },
  { id: 5, route: '/identity', label: 'IDENTITY', color: BRAND.cyan, baseRadius: 28, x3d: R * Math.cos((5 * Math.PI) / 3), y3d: R * Math.sin((5 * Math.PI) / 3), z3d: -0.3 },
];

// Axial: top, center, bottom — the spine
const axialCa: CaAtom[] = [
  { id: 6, route: '/mesh', label: 'MESH', color: BRAND.green, baseRadius: 30, x3d: 0, y3d: -R * 0.8, z3d: 0 },
  { id: 7, route: '/', label: 'RESONANCE', color: BRAND.green, baseRadius: 40, x3d: 0, y3d: 0, z3d: 0 },
  { id: 8, route: '/dome', label: 'DOME', color: BRAND.green, baseRadius: 30, x3d: 0, y3d: R * 0.8, z3d: 0 },
];

// Satellite atoms — the organism is growing
const satelliteCa: CaAtom[] = [
  { id: 9, route: '/studio', label: 'STUDIO', color: BRAND.violet, baseRadius: 24, x3d: R * 1.15, y3d: -R * 0.3, z3d: 0.4 },
  { id: 10, route: '/apps', label: 'GREENHOUSE', color: BRAND.green, baseRadius: 24, x3d: -R * 1.15, y3d: -R * 0.3, z3d: -0.4 },
  { id: 11, route: '/bonding', label: 'BONDING', color: BRAND.amber, baseRadius: 24, x3d: 0, y3d: R * 1.15, z3d: 0.3 },
  { id: 12, route: '/molecule', label: 'PLAY', color: BRAND.cyan, baseRadius: 24, x3d: -R * 0.6, y3d: R * 0.9, z3d: -0.3 },
];

const ALL_CA = [...outerCa, ...axialCa, ...satelliteCa];

// Inner ring: 6 P atoms, offset 30 degrees, at half radius
const phosphorus: PAtom[] = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x3d: R * 0.5 * Math.cos(Math.PI / 6 + (i * Math.PI) / 3),
  y3d: R * 0.5 * Math.sin(Math.PI / 6 + (i * Math.PI) / 3),
  z3d: i % 2 === 0 ? 0.2 : -0.2,
}));

function project(x: number, y: number, z: number, angle: number) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const rx = x * cosA - z * 100 * sinA;
  const depth = x * sinA + z * 100 * cosA;
  const scale = 1 / (1 + depth * 0.003);
  return { sx: rx * scale, sy: y * scale, depth, scale };
}

interface PosnerNavProps {
  onNavigate: (route: string) => void;
  onHoverRoute?: (route: string | null) => void;
  moleculeHash?: string;
  domeFingerprint?: string;
}

export function PosnerNav({ onNavigate, onHoverRoute, moleculeHash, domeFingerprint }: PosnerNavProps) {
  const angleRef = useRef(0);
  const [angle, setAngle] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [pulseTick, setPulseTick] = useState(0);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reducedMotion) return;
    let raf: number;
    const tick = () => {
      angleRef.current += 0.003;
      setAngle(angleRef.current);
      setPulseTick((t) => t + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const handleClick = useCallback((route: string) => {
    if (route === '/dome' && domeFingerprint) {
      onNavigate(`/dome/${domeFingerprint}`);
    } else {
      onNavigate(route);
    }
  }, [onNavigate, domeFingerprint]);

  // Project all atoms
  const projectedCa = ALL_CA.map((a) => {
    const p = project(a.x3d, a.y3d, a.z3d, angle);
    const depthOpacity = 0.6 + p.scale * 0.4;
    return { ...a, ...p, depthOpacity };
  }).sort((a, b) => a.depth - b.depth); // Depth sort: far atoms behind

  const projectedP = phosphorus.map((a) => {
    const p = project(a.x3d, a.y3d, a.z3d, angle);
    const pulsePhase = Math.sin((pulseTick * 0.02) + a.id * 1.05);
    const pulseOpacity = 0.2 + (pulsePhase + 1) * 0.15;
    return { ...a, ...p, pulseOpacity };
  });

  // Center of SVG
  const cx = 300;
  const cy = 300;
  const viewSize = 600;

  // Molecule hash ring
  const hashDots = moleculeHash ? moleculeHash.split('').map((c, i) => {
    const hashAngle = (i / moleculeHash.length) * Math.PI * 2;
    const hr = R * 1.4;
    return {
      x: cx + hr * Math.cos(hashAngle + angle * 0.5),
      y: cy + hr * Math.sin(hashAngle + angle * 0.5),
      color: parseInt(c, 16) < 8 ? BRAND.green : BRAND.cyan,
    };
  }) : [];

  return (
    <svg
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      style={{ width: '100%', maxWidth: 600, height: 'auto' }}
      role="navigation"
      aria-label="Posner molecule navigation"
    >
      {/* Hash orbit */}
      {hashDots.map((d, i) => (
        <circle key={`h${i}`} cx={d.x} cy={d.y} r={2} fill={d.color} opacity={0.3} />
      ))}

      {/* Bonds */}
      {/* Outer ring connections */}
      {outerCa.map((a, i) => {
        const next = outerCa[(i + 1) % outerCa.length]!;
        const pa = project(a.x3d, a.y3d, a.z3d, angle);
        const pb = project(next.x3d, next.y3d, next.z3d, angle);
        return (
          <line
            key={`bond-ring-${i}`}
            x1={cx + pa.sx} y1={cy + pa.sy}
            x2={cx + pb.sx} y2={cy + pb.sy}
            stroke={BRAND.violet}
            strokeWidth={0.5}
            opacity={0.06 + Math.min(pa.depth, pb.depth) * 0.001}
          />
        );
      })}

      {/* Center to all P atoms */}
      {projectedP.map((p) => (
        <line
          key={`bond-center-p${p.id}`}
          x1={cx} y1={cy}
          x2={cx + p.sx} y2={cy + p.sy}
          stroke={BRAND.green}
          strokeWidth={0.5}
          opacity={0.06}
        />
      ))}

      {/* Phosphorus atoms (behind calcium) */}
      {projectedP.map((p) => (
        <circle
          key={`p${p.id}`}
          cx={cx + p.sx}
          cy={cy + p.sy}
          r={10 * p.scale}
          fill={BRAND.green}
          opacity={p.pulseOpacity}
        />
      ))}

      {/* Calcium atoms (navigation) */}
      {projectedCa.map((a) => {
        const isHovered = hoveredId === a.id;
        const r = a.baseRadius * a.scale;
        const fillOpacity = isHovered ? 0.4 : 0.15;
        const glowSize = isHovered ? 20 : 12;
        const labelOpacity = isHovered ? 1.0 : 0.7;
        const isCenter = a.id === 7;

        return (
          <g
            key={`ca${a.id}`}
            style={{ cursor: 'pointer' }}
            onClick={() => handleClick(a.route)}
            onMouseEnter={() => {
              setHoveredId(a.id);
              onHoverRoute?.(a.route.replace('/', '') || 'resonance');
            }}
            onMouseLeave={() => {
              setHoveredId(null);
              onHoverRoute?.(null);
            }}
            role="link"
            tabIndex={0}
            aria-label={`Navigate to ${a.label}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(a.route); } }}
          >
            {/* Glow */}
            <circle
              cx={cx + a.sx} cy={cy + a.sy} r={r + 4}
              fill="none"
              stroke={a.color}
              strokeWidth={0}
              filter={`drop-shadow(0 0 ${glowSize}px ${a.color}${isHovered ? '99' : '4d'})`}
            />
            {/* Atom circle */}
            <circle
              cx={cx + a.sx} cy={cy + a.sy} r={r}
              fill={`${a.color}${Math.round(fillOpacity * 255).toString(16).padStart(2, '0')}`}
              stroke={a.color}
              strokeWidth={1.5}
              opacity={a.depthOpacity}
            />
            {/* Center atom: double ring */}
            {isCenter && (
              <circle
                cx={cx + a.sx} cy={cy + a.sy} r={r + 8}
                fill="none"
                stroke={a.color}
                strokeWidth={0.5}
                opacity={0.3}
              />
            )}
            {/* Label */}
            <text
              x={cx + a.sx}
              y={cy + a.sy + r + 14}
              textAnchor="middle"
              fill={a.color}
              opacity={labelOpacity * a.depthOpacity}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 8,
                letterSpacing: 3,
                pointerEvents: 'none',
              }}
            >
              {a.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
