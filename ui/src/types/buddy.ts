/**
 * P31 Buddy — types for codename-first, privacy-safe companion
 * All display names in the system use codename; real names stay in parent-only settings.
 */

export type BuddyAgeGroup = 'child' | 'teen' | 'adult';

export type BuddyMood = 'happy' | 'curious' | 'calm' | 'celebrating' | 'focused' | 'neutral';

export interface FavoriteStructure {
  id: string;
  name: string;
  type: string;
}

export interface RecentAchievement {
  timestamp: number;
  description: string;
}

export interface BuddyLearningStyle {
  prefersGuidance: boolean;
  likesChallenges: boolean;
  needsVisualCues: boolean;
}

export interface BuddyAccessibility {
  switchControl: boolean;
  voiceSpeed: number;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface BuddyMemory {
  userId: string;
  codename: string;
  ageGroup: BuddyAgeGroup;
  favoriteStructures: FavoriteStructure[];
  recentAchievements: RecentAchievement[];
  learningStyle: BuddyLearningStyle;
  accessibility: BuddyAccessibility;
  lastSeen: number;
}

export const DEFAULT_LEARNING_STYLE: BuddyLearningStyle = {
  prefersGuidance: true,
  likesChallenges: true,
  needsVisualCues: true,
};

export const DEFAULT_BUDDY_ACCESSIBILITY: BuddyAccessibility = {
  switchControl: false,
  voiceSpeed: 1,
  reducedMotion: false,
  highContrast: false,
};

export function createDefaultMemory(userId: string, codename: string, ageGroup: BuddyAgeGroup = 'child'): BuddyMemory {
  return {
    userId,
    codename,
    ageGroup,
    favoriteStructures: [],
    recentAchievements: [],
    learningStyle: DEFAULT_LEARNING_STYLE,
    accessibility: DEFAULT_BUDDY_ACCESSIBILITY,
    lastSeen: Date.now(),
  };
}

/** Mood → display color for Buddy 3D character (P31 Phosphorus Green base) */
export const BUDDY_MOOD_COLORS: Record<BuddyMood, string> = {
  happy: '#2ecc71',
  curious: '#60a5fa',
  calm: '#34d399',
  celebrating: '#fbbf24',
  focused: '#a78bfa',
  neutral: '#6ee7b7',
};
