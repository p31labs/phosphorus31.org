/**
 * P31 glow utilities — box-shadow and text-shadow strings per accent color.
 * Intensities: low (subtle), medium (default), high (hover/active).
 */

import type { P31ColorKey } from './tokens';
import { colors } from './tokens';

export type GlowIntensity = 'low' | 'medium' | 'high';

const intensityMap: Record<GlowIntensity, { spread: number; blur: number; opacity: string }> = {
  low: { spread: 0, blur: 8, opacity: '30' },
  medium: { spread: 0, blur: 16, opacity: '50' },
  high: { spread: 2, blur: 24, opacity: '70' },
};

const glowColors: Record<P31ColorKey, string> = {
  void: colors.void,
  surface1: colors.surface1,
  surface2: colors.surface2,
  surface3: colors.surface3,
  text: colors.text,
  textDim: colors.textDim,
  phosphor: colors.phosphor,
  cyan: colors.cyan,
  magenta: colors.magenta,
  violet: colors.violet,
  amber: colors.amber,
};

/** Accent keys that are used for glow effects (excludes neutrals) */
export const glowAccentKeys: P31ColorKey[] = ['phosphor', 'cyan', 'magenta', 'violet', 'amber'];

/**
 * Returns a CSS box-shadow string for a glow in the given color and intensity.
 */
export function boxShadowGlow(
  colorKey: P31ColorKey,
  intensity: GlowIntensity = 'medium'
): string {
  const hex = glowColors[colorKey];
  const { blur, spread, opacity } = intensityMap[intensity];
  const colorWithAlpha = hex + opacity;
  return `0 0 ${blur}px ${spread}px ${colorWithAlpha}`;
}

/**
 * Returns a CSS text-shadow string for a glow in the given color and intensity.
 */
export function textShadowGlow(
  colorKey: P31ColorKey,
  intensity: GlowIntensity = 'medium'
): string {
  const hex = glowColors[colorKey];
  const { blur, opacity } = intensityMap[intensity];
  const colorWithAlpha = hex + opacity;
  return `0 0 ${blur}px ${colorWithAlpha}`;
}

/**
 * Layered glow (multiple shadows) for a stronger effect.
 */
export function boxShadowGlowLayered(
  colorKey: P31ColorKey,
  intensity: GlowIntensity = 'medium'
): string {
  const low = boxShadowGlow(colorKey, 'low');
  const mid = boxShadowGlow(colorKey, intensity);
  return `${low}, ${mid}`;
}
