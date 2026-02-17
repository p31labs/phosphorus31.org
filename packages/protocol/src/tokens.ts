/**
 * P31 Design Tokens — single source of truth for all visual constants.
 * Use @p31/protocol tokens in every frontend. No hardcoded hex, fonts, or shadows.
 * @see QA-01 Design Token Audit
 */

export const colors = {
  void: '#050510',
  surface1: '#0A0A1F',
  surface2: '#12122E',
  surface3: '#1A1A3E',
  green: '#00FF88',
  cyan: '#00D4FF',
  magenta: '#FF00CC',
  violet: '#7A27FF',
  amber: '#FFB800',
  textPrimary: '#E0E0EE',
  textSecondary: '#7878AA',
  textTertiary: '#4A4A7A',
  // Print-safe
  greenPrint: '#00994D',
  cyanPrint: '#0088AA',
  magentaPrint: '#CC0099',
  violetPrint: '#5518AA',
  amberPrint: '#CC9300',
} as const;

export const productColors = {
  shelter: colors.green,
  scope: colors.cyan,
  nodeOne: colors.magenta,
  centaur: colors.violet,
  sprout: colors.amber,
  protocol: colors.textPrimary,
} as const;

export const fonts = {
  display: "'Oxanium', sans-serif",
  data: "'Space Mono', monospace",
  system:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

export const typeScale = {
  hero: {
    size: 'clamp(32px, 6vw, 64px)',
    weight: 200,
    font: fonts.display,
    ls: '0.05em',
  },
  h1: {
    size: 'clamp(24px, 4vw, 40px)',
    weight: 300,
    font: fonts.display,
    ls: '0.03em',
  },
  h2: { size: '22px', weight: 400, font: fonts.display },
  body: { size: '14px', weight: 300, font: fonts.display, lh: '1.75' },
  label: {
    size: '10px',
    weight: 400,
    font: fonts.data,
    ls: '3px',
    transform: 'uppercase',
  },
  data: { size: '13px', weight: 400, font: fonts.data, ls: '1px' },
  caption: { size: '9px', weight: 400, font: fonts.data, ls: '2px' },
} as const;

/** Glow helpers: pass hex and optional intensity (default 1). */
export const glow = {
  text: (hex: string, intensity = 1) =>
    `0 0 ${8 * intensity}px ${hex}66, 0 0 ${20 * intensity}px ${hex}33`,
  box: (hex: string, intensity = 1) =>
    `0 0 ${8 * intensity}px ${hex}4D, 0 0 ${20 * intensity}px ${hex}26, 0 0 ${40 * intensity}px ${hex}0D`,
  svg: {
    innerOpacity: 0.12,
    outerOpacity: 0.04,
    innerScale: 3,
    outerScale: 6,
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  xxl: '60px',
} as const;

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  pill: '9999px',
} as const;

export const transitions = {
  fast: '120ms ease',
  normal: '200ms ease',
  slow: '400ms ease',
  glow: '300ms ease-in-out',
} as const;
