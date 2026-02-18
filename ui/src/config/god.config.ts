// God Configuration - Core system parameters
// This file contains the fundamental configuration for The Buffer (P31 communication processing system)

export interface MetabolismConfig {
  maxSpoons: number;
  spoonRecoveryRate: number;
  stressThreshold: number;
  recoveryThreshold: number;
}

export interface HeartbeatConfig {
  thresholds: {
    green: number;
    yellow: number;
    orange: number;
    red: number;
  };
  maxHeartbeat: number;
  minHeartbeat: number;
  lockoutThreshold?: number;
  colors?: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
  };
}

export type HeartbeatStatus = 'green' | 'yellow' | 'orange' | 'red';

export interface VoltageConfig {
  low: {
    threshold: number;
    color: string;
  };
  medium: {
    threshold: number;
    color: string;
  };
  high: {
    threshold: number;
    color: string;
  };
}

export interface ThemeConfig {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  border: {
    default: string;
    hover?: string;
    accent?: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  gradient: {
    shield: string;
  };
}

export interface TypographyConfig {
  fontFamily: {
    body: string;
    display: string;
  };
}

export type HumanOSType = 'navigator' | 'buffer' | 'scope' | 'centaur' | 'node-one';

export interface HumanOSProfile {
  name: string;
  coreImperative: string;
  color: string;
  icon?: string;
}

export interface HumanOSConfig {
  type: HumanOSType;
  version: string;
}

export const HumanOSProfiles: Record<HumanOSType, HumanOSProfile> = {
  navigator: {
    name: 'Navigator',
    coreImperative: 'Guide and direct',
    color: '#2ecc71',
    icon: '🧭',
  },
  buffer: {
    name: 'Buffer',
    coreImperative: 'Protect and filter',
    color: '#60a5fa',
    icon: '🛡️',
  },
  scope: {
    name: 'Scope',
    coreImperative: 'Observe and analyze',
    color: '#f39c12',
    icon: '🔭',
  },
  centaur: {
    name: 'Centaur',
    coreImperative: 'Integrate and synthesize',
    color: '#e67e22',
    icon: '🐎',
  },
  'node-one': {
    name: 'Node One',
    coreImperative: 'Connect and communicate',
    color: '#9b59b6',
    icon: '🔗',
  },
};

export interface OllamaConfig {
  endpoint: string;
  model: string;
  timeout?: number;
}

export interface PromptsConfig {
  system: string;
  user: string;
  sanitizeResponse?: string;
}

export interface HeartbeatStatusConfig {
  color: string;
  label: string;
  description?: string;
  meaning?: string;
  icon?: string;
}

export interface CheckInInterval {
  id: string;
  label: string;
  minutes: number;
  ms?: number; // Milliseconds equivalent
}

export const MetabolismConfig: MetabolismConfig = {
  maxSpoons: 12,
  spoonRecoveryRate: 0.1,
  stressThreshold: 8,
  recoveryThreshold: 4,
};

export const HeartbeatConfig: HeartbeatConfig = {
  thresholds: {
    green: 70,
    yellow: 50,
    orange: 40,
    red: 30,
  },
  maxHeartbeat: 100,
  minHeartbeat: 0,
  lockoutThreshold: 20,
  colors: {
    green: '#2ecc71',
    yellow: '#f39c12',
    orange: '#e67e22',
    red: '#e74c3c',
  },
};

export const VoltageConfig: VoltageConfig = {
  low: {
    threshold: 3,
    color: '#2ecc71',
  },
  medium: {
    threshold: 6,
    color: '#f39c12',
  },
  high: {
    threshold: 8,
    color: '#e74c3c',
  },
};

export const ThemeConfig: ThemeConfig = {
  bg: {
    primary: '#050510',
    secondary: '#0a0a15',
    tertiary: '#0f0f1a',
    accent: '#1a1a2e',
  },
  border: {
    default: '#2ecc7140',
    hover: '#2ecc7180',
    accent: '#2ecc71',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
    muted: '#707070',
    accent: '#2ecc71',
  },
  gradient: {
    shield: 'linear-gradient(135deg, #2ecc71 0%, #60a5fa 100%)',
  },
};

export const TypographyConfig: TypographyConfig = {
  fontFamily: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

export const HumanOSConfig: HumanOSConfig = {
  type: 'navigator',
  version: '1.0.0',
};

export const OllamaConfig: OllamaConfig = {
  endpoint: 'http://localhost:11434',
  model: 'llama2',
  timeout: 30000,
};

export const PromptsConfig: PromptsConfig = {
  system: 'You are a helpful assistant.',
  user: 'User prompt',
  sanitizeResponse: 'Sanitize this message for {humanOS}: {draft}',
};

const heartbeatStatuses: Record<HeartbeatStatus, HeartbeatStatusConfig> = {
  green: {
    color: '#2ecc71',
    label: 'Green',
    description: 'All systems operational',
    meaning: 'Fully operational',
    icon: '🟢',
  },
  yellow: {
    color: '#f39c12',
    label: 'Yellow',
    description: 'Moderate stress',
    meaning: 'Caution advised',
    icon: '🟡',
  },
  orange: {
    color: '#e67e22',
    label: 'Orange',
    description: 'High stress',
    meaning: 'High alert',
    icon: '🟠',
  },
  red: {
    color: '#e74c3c',
    label: 'Red',
    description: 'Critical stress',
    meaning: 'Critical state',
    icon: '🔴',
  },
};

const checkInIntervals: CheckInInterval[] = [
  { id: '15min', label: '15 minutes', minutes: 15, ms: 15 * 60 * 1000 },
  { id: '30min', label: '30 minutes', minutes: 30, ms: 30 * 60 * 1000 },
  { id: '1hour', label: '1 hour', minutes: 60, ms: 60 * 60 * 1000 },
  { id: '2hour', label: '2 hours', minutes: 120, ms: 120 * 60 * 1000 },
  { id: '4hour', label: '4 hours', minutes: 240, ms: 240 * 60 * 1000 },
];

export const GodConfig = {
  Metabolism: MetabolismConfig,
  Heartbeat: HeartbeatConfig,
  heartbeat: {
    statuses: heartbeatStatuses,
    checkInIntervals: checkInIntervals,
  },
  voltage: VoltageConfig,
  theme: ThemeConfig,
  typography: TypographyConfig,
  humanOS: HumanOSProfiles,
  prompts: PromptsConfig,
  ollama: OllamaConfig,
  emotionalValence: {
    calm: {
      color: '#60a5fa',
      label: 'Calm',
    },
    safe: {
      color: '#2ecc71',
      label: 'Safe',
    },
    grounded: {
      color: '#9b59b6',
      label: 'Grounded',
    },
    positive: ['safe', 'calm', 'grounded', 'present', 'connected'],
    negative: ['unsafe', 'anxious', 'disconnected', 'overwhelmed', 'triggered'],
    neutral: ['neutral', 'uncertain', 'processing'],
  },
  spoons: {
    max: 12,
    thresholds: {
      healthy: 8,
      caution: 5,
      critical: 3,
    },
  },
  youAreSafe: {
    nodes: {
      body: {
        label: 'Body',
        color: '#2ecc71',
        name: 'Body Awareness',
        validation: 'Feel your body. Notice sensations without judgment.',
        physics: 'Your body exists in space. It has weight, temperature, boundaries.',
        somatic: 'Scan from head to toe. Notice what you feel.',
        icon: '🫀',
      },
      breath: {
        label: 'Breath',
        color: '#60a5fa',
        name: 'Breath Anchor',
        validation: 'Your breath is always with you. It anchors you to now.',
        physics: 'Air moves in and out. Your diaphragm expands and contracts.',
        somatic: 'Feel the air enter and leave. Notice the rhythm.',
        icon: '💨',
      },
      environment: {
        label: 'Environment',
        color: '#f39c12',
        name: 'Safe Space',
        validation: 'You are here. This space is real. You can observe it.',
        physics: 'Objects have position, texture, temperature. Space has boundaries.',
        somatic: 'Notice what you see, hear, feel. Name 5 things you can sense.',
        icon: '🌍',
      },
      time: {
        label: 'Time',
        color: '#9b59b6',
        name: 'Present Moment',
        validation: 'Right now is real. Past and future are thoughts.',
        physics: 'Time flows forward. This moment is the only one that exists.',
        somatic: 'Feel the present. Notice that thoughts about past/future are just thoughts.',
        icon: '⏰',
      },
    },
    breathingExercises: {
      box: {
        name: 'Box Breathing',
        pattern: [4, 4, 4, 4],
        description: 'Inhale 4, hold 4, exhale 4, hold 4. Repeat.',
      },
      triangle: {
        name: 'Triangle Breathing',
        pattern: [4, 4, 4],
        description: 'Inhale 4, hold 4, exhale 4. Repeat.',
      },
      square: {
        name: 'Square Breathing',
        pattern: [4, 4, 4, 4],
        description: 'Inhale 4, hold 4, exhale 4, hold 4. Repeat.',
      },
      '4-7-8': {
        name: '4-7-8 Breathing',
        pattern: [4, 7, 8],
        description: 'Inhale 4, hold 7, exhale 8. Repeat.',
      },
    },
    coreReassurance: {
      safety: 'You are safe. You are here. You are now.',
      body: 'Your body is your own. Your mind is your own.',
      mesh: 'The mesh holds. You are held.',
      breathe: 'Breathe. Ground. Return.',
    },
    affirmations: [
      'You are safe. You are here. You are now.',
      'Your body is your own. Your mind is your own.',
      'The mesh holds. You are held.',
      'Breathe. Ground. Return.',
    ],
    grounding: {
      techniques: ['breathing', 'somatic', 'visual', 'tactile'],
      duration: 300, // seconds
    },
  },
};

export default GodConfig;
