/**
 * Accessibility Utilities
 * Helper functions for accessibility features
 */

/**
 * Announce message to screen reader
 */
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if ((window as any).accessibilityAnnounce) {
    (window as any).accessibilityAnnounce(message, priority);
  }
};

/**
 * Get accessible color contrast
 */
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

/**
 * Convert hex to RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if high contrast is preferred
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Get accessible focus styles
 */
export const getFocusStyles = () => ({
  outline: '3px solid #6366f1',
  outlineOffset: '2px',
  borderRadius: '4px',
});
