// Design System - Core design tokens for Genesis Gate
export const COLORS = {
  // Primary palette
  PRIMARY: '#FF6B9D',
  SECONDARY: '#C084FC',
  ACCENT: '#60A5FA',

  // Status colors
  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  ERROR: '#F87171',
  INFO: '#38BDF8',

  // Neutral colors
  BACKGROUND: '#0a0a0f',
  SURFACE: '#18181b',
  SURFACE_LIGHT: '#27272a',
  TEXT: '#ffffff',
  TEXT_MUTED: '#71717a',
  BORDER: '#3f3f46',

  // Game-specific colors
  BUBBLE_COLORS: ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171'],
  TILE_COLORS: ['#FF6B9D', '#60A5FA', '#34D399', '#FBBF24'],
};

export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  XXL: '3rem',
};

export const FONTS = {
  MONO: "'JetBrains Mono', 'Fira Code', monospace",
  SANS: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const FONT_SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  MD: '1rem',
  LG: '1.125rem',
  XL: '1.25rem',
  XXL: '1.5rem',
  XXXL: '2rem',
};

export const GRID_GAP = '1rem';
export const CARD_PADDING = '1.5rem';
export const SECTION_GAP = '2rem';

export default { COLORS, SPACING, FONTS, FONT_SIZES, GRID_GAP, CARD_PADDING, SECTION_GAP };
