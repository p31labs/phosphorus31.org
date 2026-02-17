// Mock GOD_CONFIG for testing
export const mockGOD_CONFIG = {
  voltage: {
    low: { threshold: 0.3, color: '#10b981' },
    medium: { threshold: 0.6, color: '#f59e0b' },
    high: { threshold: 0.9, color: '#ef4444' },
  },
  theme: {
    bg: {
      primary: '#0a0a0b',
      secondary: '#1f2937',
      tertiary: '#374151',
      accent: '#4b5563',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
      muted: '#9ca3af',
      accent: '#3b82f6',
    },
    border: {
      default: '#374151',
      hover: '#4b5563',
    },
    gradient: {
      shield: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    },
  },
  spoons: {
    max: 12,
    thresholds: {
      healthy: 8,
      caution: 4,
      critical: 2,
    },
  },
  heartbeat: {
    statuses: {
      green: { label: 'Green', icon: '🟢', color: '#10b981', meaning: 'All systems operational' },
      yellow: { label: 'Yellow', icon: '🟡', color: '#f59e0b', meaning: 'Moderate stress' },
      orange: { label: 'Orange', icon: '🟠', color: '#f97316', meaning: 'High stress' },
      red: { label: 'Red', icon: '🔴', color: '#ef4444', meaning: 'Critical stress' },
    },
    checkInIntervals: [
      { id: '15m', label: '15 minutes', ms: 900000 },
      { id: '30m', label: '30 minutes', ms: 1800000 },
      { id: '1h', label: '1 hour', ms: 3600000 },
    ],
  },
  youAreSafe: {
    nodes: {
      panic: {
        name: 'Panic',
        icon: '😰',
        color: '#ef4444',
        validation: 'Your body is trying to protect you.',
        physics: 'The amygdala has activated fight-or-flight.',
        somatic: 'Breathe. You are safe. The threat is not immediate.',
      },
      overwhelm: {
        name: 'Overwhelm',
        icon: '🌊',
        color: '#f59e0b',
        validation: 'You are experiencing sensory overload.',
        physics: 'The nervous system is saturated with input.',
        somatic: 'Reduce input. Close your eyes. One thing at a time.',
      },
      shutdown: {
        name: 'Shutdown',
        icon: '🔋',
        color: '#6b7280',
        validation: 'Your system is conserving energy.',
        physics: 'The parasympathetic nervous system is dominant.',
        somatic: 'Rest is not failure. You are recharging.',
      },
      dissociation: {
        name: 'Dissociation',
        icon: '🌫️',
        color: '#8b5cf6',
        validation: 'Your mind is protecting you from overwhelm.',
        physics: 'The prefrontal cortex has reduced connectivity.',
        somatic: 'Ground yourself. Name 5 things you see. You are here.',
      },
    },
    breathingExercises: {
      calm: {
        name: '4-4-8 Calm',
        description: 'Inhale for 4, hold for 4, exhale for 8',
        pattern: [4, 4, 8, 4],
      },
    },
    coreReassurance: {
      one: 'You are safe. This feeling will pass.',
      two: 'Your body is doing its job. You are not broken.',
      three: 'Rest is mandatory maintenance, not failure.',
    },
  },
  emotionalValence: {
    calm: { color: '#10b981' },
  },
};
