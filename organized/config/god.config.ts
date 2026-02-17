// src/god.config.ts

/**
 * G.O.D. PROTOCOL CONFIGURATION
 * 
 * This file controls all customizable aspects of your node.
 * 
 * FORKING GUIDE:
 * 1. Change values inside quotes to customize your universe
 * 2. Enable/disable modules by changing true/false
 * 3. Keep the structure intact (don't remove fields)
 * 4. Commit changes and redeploy
 * 
 * GOLDEN RULES:
 * - Do NOT change tetrahedron topology (4 vertices, 6 edges)
 * - Do NOT remove exit/abdication mechanisms
 * - Do NOT disable encryption
 * - Share your cool modules back to the community
 */

export const GOD_CONFIG = {
  // ============================================
  // 1. SYSTEM IDENTITY
  // ============================================
  
  /** The name displayed throughout the app */
  systemName: "G.O.D. PROTOCOL",
  
  /** Version number (semantic versioning) */
  systemVersion: "1.0.0",
  
  /** Short description */
  systemDescription: "Infrastructure for Distributed Resilience",
  
  /** Show version in UI? */
  showVersion: true,
  
  // ============================================
  // 2. VISUAL THEME
  // ============================================
  
  colors: {
    /** Primary color (edges, buttons, highlights) */
    primary: "#00FFFF",        // Electric Cyan
    
    /** Background color (keep black for contrast) */
    background: "#000000",
    
    /** Text color */
    text: "#FFFFFF",
    
    /** Secondary text (dimmed) */
    textSecondary: "#9CA3AF",
    
    /** Alert/emergency color */
    alert: "#EF4444",
    
    /** Success color */
    success: "#10B981",
    
    /** Warning color */
    warning: "#F59E0B",
    
    /** Info color */
    info: "#3B82F6",
    
    /** Memorial color (for lost vertices) */
    memorial: "#8B5CF6",
  },
  
  /** Font family (system fonts for performance) */
  fontFamily: {
    sans: "system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, monospace",
  },
  
  // ============================================
  // 3. GOVERNANCE
  // ============================================
  
  governance: {
    /** Type of community */
    communityType: "FAMILY" as const,
    // Options: "FAMILY" | "NEIGHBORHOOD" | "EMERGENCY" | "CUSTOM"
    
    /** What to call the admin/founder */
    adminTitle: "Architect",
    
    /** What to call regular members */
    memberTitle: "Vertex",
    
    /** What to call the group */
    groupName: "Tetrahedron",
    
    /** Require physical meetings? */
    requirePhysicalMeetings: true,
    
    /** Minimum meetings per month */
    minMeetingsPerMonth: 4,
    
    /** Maximum days between meetings before warning */
    maxDaysBetweenMeetings: 7,
    
    /** Enable governance/voting features? */
    enableVoting: true,
    
    /** Quorum threshold (3 of 4) */
    quorumThreshold: 3,
    
    /** Enable Fifth Element (AI mediator)? */
    enableFifthElement: true,
  },
  
  // ============================================
  // 4. GAMIFICATION
  // ============================================
  
  gamification: {
    /** Enable gamification features? */
    enabled: true,
    
    /** What to call the currency */
    currencyName: "Resonance",
    
    /** Currency symbol */
    currencySymbol: "Hz",
    
    /** Starting currency amount */
    startingCurrency: 50,
    
    /** Maximum currency (surplus above this) */
    maxCurrency: 100,
    
    /** Decay rate (Hz lost per 24 hours) */
    decayRate: 10,
    
    /** Enable level-up animations? */
    enableLevelUp: true,
    
    /** Enable sound effects? */
    enableSounds: true,
    
    /** Sound volume (0-1) */
    soundVolume: 0.5,
    
    /** Enable haptic feedback (mobile)? */
    enableHaptics: true,
    
    /** Rank names (4 levels) */
    ranks: {
      level1: "Spark",         // 0 peers (solo vertex)
      level2: "Stabilizer",    // 3 peers (full tetrahedron)
      level3: "Weaver",        // 15 peers (cluster)
      level4: "Architect",     // 50+ peers (zone)
    },
    
    /** Rank thresholds (peer count) */
    rankThresholds: {
      level1: 0,
      level2: 3,
      level3: 15,
      level4: 50,
    },
  },
  
  // ============================================
  // 5. MISSIONS (Activity Rewards)
  // ============================================
  
  missions: {
    /** Morning Pulse (daily check-in) */
    morningPulse: {
      enabled: true,
      reward: 15,              // Hz gained
      timeWindow: [6, 10],     // 6am - 10am
      description: "Daily biometric check-in",
    },
    
    /** Jitterbug (physical meetup) */
    jitterbug: {
      enabled: true,
      reward: 100,             // Hz gained (full charge)
      minMembers: 3,           // Requires 3+ members
      cooldown: 168,           // Hours (1 week)
      description: "Physical meetup with tetrahedron",
    },
    
    /** Streak bonuses */
    streaks: {
      enabled: true,
      bonusPerDay: 5,          // +5 Hz per consecutive day
      maxBonus: 50,            // Max +50 Hz from streaks
    },
  },
  
  // ============================================
  // 6. DEFAULT MODULES (The Loadout)
  // ============================================
  
  modules: {
    /** Core modules (always enabled, cannot disable) */
    core: {
      status: true,            // Vertex information
      governance: true,        // Decision making
      emergency: true,         // Emergency button
      constitution: true,      // View constitution
    },
    
    /** Gamification modules */
    game: {
      missionControl: true,    // Dashboard with missions
      resonanceCore: true,     // Visual feedback system
    },
    
    /** Family modules */
    family: {
      childcare: false,        // Childcare tracker
      foodStatus: false,       // Pantry/food status
      scheduleSync: false,     // Family calendar
      locationShare: false,    // Real-time location (opt-in)
    },
    
    /** Preparedness modules */
    preparedness: {
      supplyLog: false,        // Inventory tracker
      waterStatus: false,      // Water supply monitor
      powerStatus: false,      // Generator/battery status
      commsCheck: false,       // Radio test/check-in
      threatMap: false,        // Threat awareness map
    },
    
    /** Community modules */
    community: {
      skillShare: false,       // Who knows what
      resourcePool: false,     // Shared resources
      mutualAid: false,        // Help requests
      eventCalendar: false,    // Community events
    },
    
    /** Educational modules */
    education: {
      workbench: true,         // Module creation tool
      tutorialMode: true,      // Interactive tutorials
      devConsole: false,       // Developer tools
    },
  },
  
  // ============================================
  // 7. NETWORK SETTINGS
  // ============================================
  
  network: {
    /** Enable P2P mesh networking? */
    enableP2P: true,
    
    /** Heartbeat interval (ms) */
    heartbeatInterval: 5000,
    
    /** Connection timeout (ms) */
    connectionTimeout: 10000,
    
    /** Dead connection threshold (ms) */
    deadThreshold: 15000,
    
    /** Enable network diagnostics? */
    showDiagnostics: false,
    
    /** Enable packet visualization? */
    visualizePackets: true,
  },
  
  // ============================================
  // 8. PRIVACY & SECURITY
  // ============================================
  
  security: {
    /** Require E2E encryption (ALWAYS true) */
    requireEncryption: true,
    
    /** Enable biometric auth (if available)? */
    enableBiometrics: true,
    
    /** Session timeout (minutes of inactivity) */
    sessionTimeout: 60,
    
    /** Enable analytics (NEVER third-party) */
    enableAnalytics: false,
    
    /** Enable error reporting (local only) */
    enableErrorReporting: true,
  },
  
  // ============================================
  // 9. ACCESSIBILITY
  // ============================================
  
  accessibility: {
    /** Enable screen reader support? */
    enableScreenReader: true,
    
    /** Enable high contrast mode? */
    enableHighContrast: false,
    
    /** Enable reduced motion? */
    enableReducedMotion: false,
    
    /** Font size multiplier */
    fontSizeMultiplier: 1.0,
    
    /** Enable keyboard navigation? */
    enableKeyboardNav: true,
  },
  
  // ============================================
  // 10. EXPERIMENTAL FEATURES
  // ============================================
  
  experimental: {
    /** Enable all experimental features? */
    enabled: false,
    
    /** Enable AI-powered features? */
    enableAI: false,
    
    /** Enable hardware integration? */
    enableHardware: false,
    
    /** Enable spatial audio? */
    enableSpatialAudio: false,
    
    /** Enable AR visualization? */
    enableAR: false,
  },
  
  // ============================================
  // 11. DEVELOPER SETTINGS
  // ============================================
  
  developer: {
    /** Enable developer mode? */
    devMode: process.env.NODE_ENV === 'development',
    
    /** Show debug info in UI? */
    showDebugInfo: false,
    
    /** Enable console logging? */
    enableLogging: true,
    
    /** Log level */
    logLevel: 'info' as const, // 'debug' | 'info' | 'warn' | 'error'
    
    /** Enable performance monitoring? */
    enablePerformanceMonitoring: false,
    
    /** Custom module directory */
    customModulesPath: '/custom',
  },
  
  // ============================================
  // 12. CONTACT INFO (Optional)
  // ============================================
  
  contact: {
    /** Admin email (for support) */
    email: "",
    
    /** Community Discord/Slack */
    community: "",
    
    /** Emergency contact */
    emergency: "",
    
    /** Documentation URL */
    docs: "https://docs.god-protocol.org",
    
    /** GitHub repository */
    github: "https://github.com/god-protocol/god-protocol",
  },
  
  // ============================================
  // 13. LEGAL (Required)
  // ============================================
  
  legal: {
    /** Terms of service URL */
    termsUrl: "/legal/terms",
    
    /** Privacy policy URL */
    privacyUrl: "/legal/privacy",
    
    /** License type */
    license: "MIT",
    
    /** Copyright holder */
    copyrightHolder: "G.O.D. Protocol Contributors",
    
    /** Copyright year */
    copyrightYear: 2025,
  },
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type Config = typeof GOD_CONFIG;

export type CommunityType = typeof GOD_CONFIG.governance.communityType;

export type RankLevel = 'level1' | 'level2' | 'level3' | 'level4';

export type LogLevel = typeof GOD_CONFIG.developer.logLevel;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get config value by path
 * Usage: getConfig('gamification.currencyName') → 'Resonance'
 */
export function getConfig(path: string): any {
  const keys = path.split('.');
  let value: any = GOD_CONFIG;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return null;
  }
  
  return value;
}

/**
 * Check if module is enabled
 * Usage: isModuleEnabled('family', 'childcare') → false
 */
export function isModuleEnabled(category: string, module: string): boolean {
  return getConfig(`modules.${category}.${module}`) === true;
}

/**
 * Get currency display
 * Usage: getCurrencyDisplay(75) → '75 Hz'
 */
export function getCurrencyDisplay(amount: number): string {
  const name = GOD_CONFIG.gamification.currencyName;
  const symbol = GOD_CONFIG.gamification.currencySymbol;
  return `${amount} ${symbol}`;
}

/**
 * Get rank by peer count
 * Usage: getRankByPeers(15) → 'Weaver'
 */
export function getRankByPeers(peerCount: number): string {
  const thresholds = GOD_CONFIG.gamification.rankThresholds;
  const ranks = GOD_CONFIG.gamification.ranks;
  
  if (peerCount >= thresholds.level4) return ranks.level4;
  if (peerCount >= thresholds.level3) return ranks.level3;
  if (peerCount >= thresholds.level2) return ranks.level2;
  return ranks.level1;
}

/**
 * Validate config
 * Ensures all required fields are present and valid
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!GOD_CONFIG.systemName) {
    errors.push('systemName is required');
  }
  
  // Check color format
  if (!/^#[0-9A-F]{6}$/i.test(GOD_CONFIG.colors.primary)) {
    errors.push('colors.primary must be a valid hex color');
  }
  
  // Check governance settings
  if (GOD_CONFIG.governance.minMeetingsPerMonth < 1) {
    errors.push('minMeetingsPerMonth must be at least 1');
  }
  
  // Check quorum threshold (must be 3 for K₄)
  if (GOD_CONFIG.governance.quorumThreshold !== 3) {
    errors.push('quorumThreshold must be 3 (constitutional requirement)');
  }
  
  // Check encryption requirement (must be true)
  if (!GOD_CONFIG.security.requireEncryption) {
    errors.push('requireEncryption must be true (constitutional requirement)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Validate on import (development only)
if (process.env.NODE_ENV === 'development') {
  const validation = validateConfig();
  if (!validation.valid) {
    console.error('❌ CONFIG VALIDATION FAILED:');
    validation.errors.forEach(err => console.error(`  - ${err}`));
  } else {
    console.log('✅ Config validated successfully');
  }
}

export default GOD_CONFIG;
