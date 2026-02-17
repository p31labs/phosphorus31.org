/**
 * P31 Labs design tokens.
 * Colors as const object and as CSS custom property strings for use in JS and CSS.
 */

export const colors = {
  void: '#050510',
  surface1: '#0A0A1F',
  surface2: '#12122E',
  surface3: '#1A1A3E',
  text: '#E0E0EE',
  textDim: '#8888AA',
  phosphor: '#00FF88',
  cyan: '#00D4FF',
  magenta: '#FF00CC',
  violet: '#7A27FF',
  amber: '#FFB000',
} as const;

export type P31ColorKey = keyof typeof colors;

/** CSS custom property strings for use in style tags or inline styles */
export const cssVars = {
  '--p31-void': colors.void,
  '--p31-surface-1': colors.surface1,
  '--p31-surface-2': colors.surface2,
  '--p31-surface-3': colors.surface3,
  '--p31-text': colors.text,
  '--p31-text-dim': colors.textDim,
  '--p31-phosphor': colors.phosphor,
  '--p31-cyan': colors.cyan,
  '--p31-magenta': colors.magenta,
  '--p31-violet': colors.violet,
  '--p31-amber': colors.amber,
} as const;

/** Single string of all CSS custom properties for injecting into :root */
export const cssVarsString = Object.entries(cssVars)
  .map(([key, value]) => `${key}: ${value};`)
  .join(' ');
