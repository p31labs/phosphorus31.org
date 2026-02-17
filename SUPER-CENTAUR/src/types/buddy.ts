/**
 * P31 Buddy — codename-based memory and user types
 * Real names are never stored or used publicly; only codenames in greetings, sync, chat.
 * Aligns with .cursor/rules/privacy-codenames.mdc and OPSEC.
 */

export interface BuddyMemory {
  userId: string;
  codename: string;
  ageGroup: 'child' | 'teen' | 'adult';
  favoriteStructures: Array<{ id: string; name: string; type: string }>;
  recentAchievements: Array<{ timestamp: number; description: string }>;
  learningStyle: {
    prefersGuidance: boolean;
    likesChallenges: boolean;
    needsVisualCues: boolean;
  };
  accessibility: {
    switchControl: boolean;
    voiceSpeed: number;
    reducedMotion: boolean;
    highContrast: boolean;
  };
  lastSeen: number;
}

/** User row with codename; real_name is optional and parent-only. */
export interface UserWithCodename {
  id: string;
  username: string;
  email: string;
  codename: string | null;
  real_name: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Sync payload for Buddy achievements — uses codename only. */
export interface BuddySyncAchievement {
  type: 'achievement';
  codename: string;
  description: string;
  timestamp: number;
}
