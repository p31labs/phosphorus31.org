/**
 * FAMILY QUEST ENGINE - Gamification System
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🎮
 * 
 * Features:
 * - Quest templates and custom quests
 * - XP system with level curves
 * - Achievement/badge system
 * - Family leaderboards (cooperative, not competitive)
 * - Skill trees for life skills
 * - Daily/Weekly challenges
 * - PoC integration for care rewards
 * - Spoon-aware difficulty scaling
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const QUEST_CONFIG = {
  // XP Level curve: XP needed = BASE * (MULTIPLIER ^ level)
  XP: {
    BASE_XP: 100,
    MULTIPLIER: 1.5,
    MAX_LEVEL: 50,
    BONUS_MULTIPLIER: 1.25  // For completing with support
  },
  
  // Quest categories
  CATEGORIES: {
    SELF_CARE: { icon: '🧘', color: '#4CAF50', xpMultiplier: 1.0 },
    CHORES: { icon: '🧹', color: '#FF9800', xpMultiplier: 0.8 },
    LEARNING: { icon: '📚', color: '#2196F3', xpMultiplier: 1.2 },
    SOCIAL: { icon: '👥', color: '#E91E63', xpMultiplier: 1.1 },
    PHYSICAL: { icon: '💪', color: '#F44336', xpMultiplier: 1.0 },
    CREATIVE: { icon: '🎨', color: '#9C27B0', xpMultiplier: 1.1 },
    CARE: { icon: '💚', color: '#00BCD4', xpMultiplier: 1.5 },  // PoC activities
    SPECIAL: { icon: '⭐', color: '#FFC107', xpMultiplier: 2.0 }
  },
  
  // Difficulty levels
  DIFFICULTY: {
    EASY: { spoonCost: 0.5, xpMultiplier: 0.5, name: 'Easy' },
    NORMAL: { spoonCost: 1.0, xpMultiplier: 1.0, name: 'Normal' },
    HARD: { spoonCost: 2.0, xpMultiplier: 1.5, name: 'Hard' },
    EPIC: { spoonCost: 3.0, xpMultiplier: 2.0, name: 'Epic' },
    LEGENDARY: { spoonCost: 5.0, xpMultiplier: 3.0, name: 'Legendary' }
  },
  
  // Skill trees
  SKILL_TREES: {
    SELF_REGULATION: {
      name: 'Self Regulation',
      icon: '🧠',
      skills: ['breathing', 'grounding', 'identifying_emotions', 'self_advocacy']
    },
    DAILY_LIVING: {
      name: 'Daily Living',
      icon: '🏠',
      skills: ['hygiene', 'nutrition', 'organization', 'time_management']
    },
    SOCIAL_SKILLS: {
      name: 'Social Skills',
      icon: '🤝',
      skills: ['listening', 'expressing', 'boundaries', 'conflict_resolution']
    },
    CARE_GIVING: {
      name: 'Care Giving',
      icon: '💝',
      skills: ['empathy', 'patience', 'presence', 'support']
    }
  },
  
  // Achievement types
  ACHIEVEMENT_TYPES: {
    MILESTONE: 'milestone',      // Reach X of something
    STREAK: 'streak',           // Do something X days in a row
    COLLECTION: 'collection',   // Collect X different things
    CHALLENGE: 'challenge',     // Complete specific challenge
    CARE: 'care',              // PoC related
    SECRET: 'secret'           // Hidden achievements
  }
};

// ============================================================================
// QUEST
// ============================================================================

/**
 * Quest definition
 */
class Quest {
  constructor(data = {}) {
    this.id = data.id || `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.title = data.title || 'Untitled Quest';
    this.description = data.description || '';
    this.category = data.category || 'SELF_CARE';
    this.difficulty = data.difficulty || 'NORMAL';
    
    // Rewards
    this.baseXP = data.baseXP || 50;
    this.careTokens = data.careTokens || 0;  // $CARE tokens for PoC
    this.spoonReward = data.spoonReward || 0;  // Can restore spoons
    this.skillXP = data.skillXP || {};  // { skill: xp }
    
    // Requirements
    this.spoonCost = data.spoonCost || QUEST_CONFIG.DIFFICULTY[this.difficulty].spoonCost;
    this.prerequisites = data.prerequisites || [];  // Quest IDs that must be completed
    this.requiredLevel = data.requiredLevel || 1;
    this.requiredSkills = data.requiredSkills || {};  // { skill: minLevel }
    
    // Time
    this.estimatedMinutes = data.estimatedMinutes || 30;
    this.deadline = data.deadline || null;
    this.recurring = data.recurring || null;  // 'daily', 'weekly', null
    
    // State
    this.status = data.status || 'available';  // available, active, completed, failed
    this.progress = data.progress || 0;
    this.maxProgress = data.maxProgress || 1;
    this.startedAt = data.startedAt || null;
    this.completedAt = data.completedAt || null;
    
    // Collaboration
    this.isCoOp = data.isCoOp || false;
    this.participants = data.participants || [];
    this.carePartnerId = data.carePartnerId || null;
    
    // Metadata
    this.created = data.created || Date.now();
    this.template = data.template || null;
  }
  
  /**
   * Calculate final XP reward with multipliers
   */
  calculateXP() {
    const categoryMult = QUEST_CONFIG.CATEGORIES[this.category]?.xpMultiplier || 1;
    const difficultyMult = QUEST_CONFIG.DIFFICULTY[this.difficulty]?.xpMultiplier || 1;
    let xp = this.baseXP * categoryMult * difficultyMult;
    
    // Bonus for co-op
    if (this.isCoOp && this.participants.length > 1) {
      xp *= QUEST_CONFIG.XP.BONUS_MULTIPLIER;
    }
    
    return Math.round(xp);
  }
  
  /**
   * Start quest
   */
  start(userId) {
    if (this.status !== 'available') return false;
    
    this.status = 'active';
    this.startedAt = Date.now();
    if (!this.participants.includes(userId)) {
      this.participants.push(userId);
    }
    
    return true;
  }
  
  /**
   * Update progress
   */
  updateProgress(amount = 1) {
    this.progress = Math.min(this.maxProgress, this.progress + amount);
    
    if (this.progress >= this.maxProgress) {
      return this.complete();
    }
    
    return { completed: false, progress: this.progress, max: this.maxProgress };
  }
  
  /**
   * Complete quest
   */
  complete() {
    this.status = 'completed';
    this.completedAt = Date.now();
    this.progress = this.maxProgress;
    
    return {
      completed: true,
      xp: this.calculateXP(),
      careTokens: this.careTokens,
      spoonReward: this.spoonReward,
      skillXP: this.skillXP,
      duration: this.completedAt - this.startedAt
    };
  }
  
  /**
   * Fail quest
   */
  fail() {
    this.status = 'failed';
    return { failed: true, reason: 'Quest failed' };
  }
  
  /**
   * Check if user meets requirements
   */
  canStart(user) {
    // Level check
    if (user.level < this.requiredLevel) {
      return { canStart: false, reason: `Requires level ${this.requiredLevel}` };
    }
    
    // Spoon check
    if (user.currentSpoons < this.spoonCost) {
      return { canStart: false, reason: 'Not enough spoons' };
    }
    
    // Skill checks
    for (const [skill, level] of Object.entries(this.requiredSkills)) {
      if ((user.skills?.[skill] || 0) < level) {
        return { canStart: false, reason: `Requires ${skill} level ${level}` };
      }
    }
    
    return { canStart: true };
  }
  
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      difficulty: this.difficulty,
      xp: this.calculateXP(),
      careTokens: this.careTokens,
      spoonCost: this.spoonCost,
      estimatedMinutes: this.estimatedMinutes,
      status: this.status,
      progress: this.progress,
      maxProgress: this.maxProgress,
      isCoOp: this.isCoOp,
      participants: this.participants
    };
  }
}

// ============================================================================
// ACHIEVEMENT
// ============================================================================

/**
 * Achievement definition
 */
class Achievement {
  constructor(data = {}) {
    this.id = data.id || `ach_${Date.now()}`;
    this.name = data.name || 'Achievement';
    this.description = data.description || '';
    this.icon = data.icon || '🏆';
    this.type = data.type || 'milestone';
    this.category = data.category || 'general';
    this.secret = data.secret || false;
    
    // Requirements
    this.target = data.target || 1;
    this.metric = data.metric || 'count';  // What to track
    
    // Rewards
    this.xpReward = data.xpReward || 100;
    this.careTokenReward = data.careTokenReward || 0;
    this.unlocks = data.unlocks || [];  // Quest IDs, badge IDs, etc.
    
    // State
    this.progress = data.progress || 0;
    this.unlocked = data.unlocked || false;
    this.unlockedAt = data.unlockedAt || null;
  }
  
  /**
   * Update progress
   */
  updateProgress(amount = 1) {
    if (this.unlocked) return { changed: false };
    
    this.progress = Math.min(this.target, this.progress + amount);
    
    if (this.progress >= this.target) {
      return this.unlock();
    }
    
    return { changed: true, progress: this.progress, target: this.target };
  }
  
  /**
   * Unlock achievement
   */
  unlock() {
    this.unlocked = true;
    this.unlockedAt = Date.now();
    
    return {
      unlocked: true,
      achievement: this.toJSON(),
      xpReward: this.xpReward,
      careTokenReward: this.careTokenReward,
      unlocks: this.unlocks
    };
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.secret && !this.unlocked ? '???' : this.description,
      icon: this.icon,
      type: this.type,
      progress: this.progress,
      target: this.target,
      unlocked: this.unlocked,
      xpReward: this.xpReward
    };
  }
}

// ============================================================================
// FAMILY MEMBER PROFILE
// ============================================================================

/**
 * Family member game profile
 */
class FamilyMemberProfile {
  constructor(data = {}) {
    this.id = data.id || `member_${Date.now()}`;
    this.name = data.name || 'Family Member';
    this.avatar = data.avatar || '👤';
    this.role = data.role || 'member';  // parent, child, caregiver
    
    // XP & Level
    this.xp = data.xp || 0;
    this.level = data.level || 1;
    
    // Skills
    this.skills = data.skills || {};  // { skillId: level }
    this.skillXP = data.skillXP || {};  // { skillId: currentXP }
    
    // Stats
    this.questsCompleted = data.questsCompleted || 0;
    this.currentStreak = data.currentStreak || 0;
    this.longestStreak = data.longestStreak || 0;
    this.careTokensEarned = data.careTokensEarned || 0;
    this.totalXP = data.totalXP || 0;
    
    // Current state
    this.currentSpoons = data.currentSpoons || 12;
    this.maxSpoons = data.maxSpoons || 12;
    
    // Active quests
    this.activeQuests = data.activeQuests || [];
    this.completedQuestIds = new Set(data.completedQuestIds || []);
    
    // Achievements
    this.achievements = new Map();
    (data.achievements || []).forEach(a => {
      this.achievements.set(a.id, new Achievement(a));
    });
    
    // Timestamps
    this.lastActive = data.lastActive || Date.now();
    this.created = data.created || Date.now();
  }
  
  /**
   * Add XP and check for level up
   */
  addXP(amount) {
    this.xp += amount;
    this.totalXP += amount;
    
    const levelUps = [];
    while (this.xp >= this.xpForNextLevel() && this.level < QUEST_CONFIG.XP.MAX_LEVEL) {
      this.xp -= this.xpForNextLevel();
      this.level++;
      levelUps.push(this.level);
    }
    
    return { newXP: this.xp, level: this.level, levelUps };
  }
  
  /**
   * XP needed for next level
   */
  xpForNextLevel() {
    return Math.floor(QUEST_CONFIG.XP.BASE_XP * Math.pow(QUEST_CONFIG.XP.MULTIPLIER, this.level - 1));
  }
  
  /**
   * XP progress to next level
   */
  getLevelProgress() {
    const needed = this.xpForNextLevel();
    return { current: this.xp, needed, percent: (this.xp / needed) * 100 };
  }
  
  /**
   * Add skill XP
   */
  addSkillXP(skillId, amount) {
    if (!this.skillXP[skillId]) this.skillXP[skillId] = 0;
    if (!this.skills[skillId]) this.skills[skillId] = 1;
    
    this.skillXP[skillId] += amount;
    
    // Check for skill level up (every 100 XP)
    const levelUps = [];
    while (this.skillXP[skillId] >= 100) {
      this.skillXP[skillId] -= 100;
      this.skills[skillId]++;
      levelUps.push(this.skills[skillId]);
    }
    
    return { skill: skillId, level: this.skills[skillId], levelUps };
  }
  
  /**
   * Update streak
   */
  updateStreak(completed) {
    if (completed) {
      this.currentStreak++;
      this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    } else {
      this.currentStreak = 0;
    }
    return this.currentStreak;
  }
  
  getStats() {
    return {
      level: this.level,
      xp: this.xp,
      xpToNext: this.xpForNextLevel(),
      totalXP: this.totalXP,
      questsCompleted: this.questsCompleted,
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      careTokensEarned: this.careTokensEarned,
      skills: this.skills,
      achievementsUnlocked: Array.from(this.achievements.values()).filter(a => a.unlocked).length
    };
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      level: this.level,
      xp: this.xp,
      xpToNext: this.xpForNextLevel(),
      stats: this.getStats()
    };
  }
}

// ============================================================================
// FAMILY QUEST ENGINE
// ============================================================================

/**
 * Main quest engine
 */
class FamilyQuestEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...QUEST_CONFIG, ...config };
    
    // Members
    this.members = new Map();
    
    // Quests
    this.questTemplates = new Map();
    this.activeQuests = new Map();
    this.dailyChallenges = [];
    this.weeklyChallenges = [];
    
    // Global achievements
    this.globalAchievements = new Map();
    
    // Family stats
    this.familyStats = {
      totalQuestsCompleted: 0,
      totalXPEarned: 0,
      totalCareTokens: 0,
      familyLevel: 1
    };
    
    // Load default templates
    this._loadDefaultTemplates();
    this._loadDefaultAchievements();
  }
  
  /**
   * Add family member
   */
  addMember(data) {
    const member = new FamilyMemberProfile(data);
    this.members.set(member.id, member);
    
    // Grant default achievements to track
    for (const [id, ach] of this.globalAchievements) {
      member.achievements.set(id, new Achievement(ach));
    }
    
    this.emit('memberAdded', member.toJSON());
    return member;
  }
  
  /**
   * Create quest from template
   */
  createQuest(templateId, overrides = {}) {
    const template = this.questTemplates.get(templateId);
    if (!template) return null;
    
    const quest = new Quest({ ...template, ...overrides, template: templateId });
    this.activeQuests.set(quest.id, quest);
    
    this.emit('questCreated', quest.toJSON());
    return quest;
  }
  
  /**
   * Create custom quest
   */
  createCustomQuest(data) {
    const quest = new Quest(data);
    this.activeQuests.set(quest.id, quest);
    
    this.emit('questCreated', quest.toJSON());
    return quest;
  }
  
  /**
   * Start quest for member
   */
  startQuest(questId, memberId) {
    const quest = this.activeQuests.get(questId);
    const member = this.members.get(memberId);
    
    if (!quest || !member) {
      return { error: 'Quest or member not found' };
    }
    
    const canStart = quest.canStart(member);
    if (!canStart.canStart) {
      return { error: canStart.reason };
    }
    
    // Deduct spoons
    member.currentSpoons -= quest.spoonCost;
    
    // Start quest
    quest.start(memberId);
    member.activeQuests.push(questId);
    
    this.emit('questStarted', { quest: quest.toJSON(), member: member.toJSON() });
    return { success: true, quest: quest.toJSON() };
  }
  
  /**
   * Complete quest
   */
  completeQuest(questId, memberId) {
    const quest = this.activeQuests.get(questId);
    const member = this.members.get(memberId);
    
    if (!quest || !member) {
      return { error: 'Quest or member not found' };
    }
    
    const result = quest.complete();
    
    // Award XP
    const xpResult = member.addXP(result.xp);
    
    // Award skill XP
    for (const [skill, xp] of Object.entries(result.skillXP)) {
      member.addSkillXP(skill, xp);
    }
    
    // Award care tokens
    member.careTokensEarned += result.careTokens;
    
    // Restore spoons if applicable
    member.currentSpoons = Math.min(member.maxSpoons, member.currentSpoons + result.spoonReward);
    
    // Update stats
    member.questsCompleted++;
    member.updateStreak(true);
    member.lastActive = Date.now();
    
    // Remove from active
    member.activeQuests = member.activeQuests.filter(q => q !== questId);
    member.completedQuestIds.add(questId);
    
    // Update family stats
    this.familyStats.totalQuestsCompleted++;
    this.familyStats.totalXPEarned += result.xp;
    this.familyStats.totalCareTokens += result.careTokens;
    
    // Check achievements
    const unlockedAchievements = this._checkAchievements(member);
    
    this.emit('questCompleted', {
      quest: quest.toJSON(),
      member: member.toJSON(),
      rewards: result,
      levelUps: xpResult.levelUps,
      achievements: unlockedAchievements
    });
    
    return {
      success: true,
      rewards: result,
      levelUps: xpResult.levelUps,
      achievements: unlockedAchievements
    };
  }
  
  /**
   * Generate daily challenges
   */
  generateDailyChallenges() {
    const challenges = [];
    
    // Self-care challenge
    challenges.push(this.createCustomQuest({
      title: '🌅 Morning Routine',
      description: 'Complete your morning self-care routine',
      category: 'SELF_CARE',
      difficulty: 'EASY',
      baseXP: 30,
      recurring: 'daily',
      deadline: this._endOfDay()
    }));
    
    // Care challenge
    challenges.push(this.createCustomQuest({
      title: '💚 Daily Check-In',
      description: 'Have a meaningful check-in with a family member',
      category: 'CARE',
      difficulty: 'NORMAL',
      baseXP: 50,
      careTokens: 5,
      isCoOp: true,
      recurring: 'daily',
      deadline: this._endOfDay()
    }));
    
    // Random category challenge
    const categories = Object.keys(QUEST_CONFIG.CATEGORIES);
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    challenges.push(this.createCustomQuest({
      title: `${QUEST_CONFIG.CATEGORIES[randomCat].icon} Daily ${randomCat.toLowerCase()} Quest`,
      description: `Complete any ${randomCat.toLowerCase()} activity`,
      category: randomCat,
      difficulty: 'NORMAL',
      baseXP: 40,
      recurring: 'daily',
      deadline: this._endOfDay()
    }));
    
    this.dailyChallenges = challenges;
    this.emit('dailyChallengesGenerated', challenges.map(q => q.toJSON()));
    
    return challenges;
  }
  
  /**
   * Get leaderboard (cooperative style - celebrates everyone)
   */
  getLeaderboard() {
    const members = Array.from(this.members.values())
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((m, i) => ({
        rank: i + 1,
        ...m.toJSON(),
        recentActivity: m.lastActive
      }));
    
    // Add encouraging messages
    members.forEach(m => {
      if (m.currentStreak >= 7) {
        m.badge = '🔥 On Fire!';
      } else if (m.questsCompleted >= 10) {
        m.badge = '⭐ Quest Master';
      }
    });
    
    return {
      members,
      familyStats: this.familyStats,
      message: 'Every contribution matters! 💚'
    };
  }
  
  /**
   * Get available quests for member
   */
  getAvailableQuests(memberId) {
    const member = this.members.get(memberId);
    if (!member) return [];
    
    return Array.from(this.activeQuests.values())
      .filter(q => q.status === 'available')
      .filter(q => q.canStart(member).canStart)
      .filter(q => !member.completedQuestIds.has(q.id))
      .map(q => q.toJSON());
  }
  
  /**
   * Check achievements for member
   */
  _checkAchievements(member) {
    const unlocked = [];
    
    for (const [id, ach] of member.achievements) {
      if (ach.unlocked) continue;
      
      let progress = 0;
      switch (ach.metric) {
        case 'quests_completed':
          progress = member.questsCompleted;
          break;
        case 'total_xp':
          progress = member.totalXP;
          break;
        case 'streak':
          progress = member.currentStreak;
          break;
        case 'care_tokens':
          progress = member.careTokensEarned;
          break;
        case 'level':
          progress = member.level;
          break;
      }
      
      if (progress > ach.progress) {
        const result = ach.updateProgress(progress - ach.progress);
        if (result.unlocked) {
          unlocked.push(result);
          member.addXP(result.xpReward);
        }
      }
    }
    
    return unlocked;
  }
  
  _endOfDay() {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  }
  
  _loadDefaultTemplates() {
    const templates = [
      { id: 'morning_routine', title: '🌅 Morning Routine', category: 'SELF_CARE', baseXP: 30, difficulty: 'EASY', description: 'Complete morning hygiene and breakfast' },
      { id: 'brush_teeth', title: '🦷 Brush Teeth', category: 'SELF_CARE', baseXP: 10, difficulty: 'EASY', description: 'Brush teeth for 2 minutes' },
      { id: 'take_meds', title: '💊 Take Medication', category: 'SELF_CARE', baseXP: 15, difficulty: 'EASY', description: 'Take daily medication on time' },
      { id: 'clean_room', title: '🛏️ Clean Room', category: 'CHORES', baseXP: 40, difficulty: 'NORMAL', description: 'Make bed and tidy room' },
      { id: 'homework', title: '📝 Complete Homework', category: 'LEARNING', baseXP: 50, difficulty: 'NORMAL', description: 'Finish assigned homework' },
      { id: 'care_checkin', title: '💚 Care Check-In', category: 'CARE', baseXP: 40, careTokens: 10, isCoOp: true, difficulty: 'NORMAL', description: 'Have a caring conversation' },
      { id: 'family_activity', title: '👨‍👩‍👧 Family Activity', category: 'CARE', baseXP: 75, careTokens: 20, isCoOp: true, difficulty: 'NORMAL', description: 'Do an activity together as a family' },
      { id: 'sensory_break', title: '🧘 Sensory Break', category: 'SELF_CARE', baseXP: 20, spoonReward: 0.5, difficulty: 'EASY', description: 'Take a calming sensory break' }
    ];
    
    templates.forEach(t => this.questTemplates.set(t.id, t));
  }
  
  _loadDefaultAchievements() {
    const achievements = [
      { id: 'first_quest', name: '🎯 First Quest', description: 'Complete your first quest', metric: 'quests_completed', target: 1, xpReward: 50 },
      { id: 'quest_10', name: '⭐ Quest Explorer', description: 'Complete 10 quests', metric: 'quests_completed', target: 10, xpReward: 100 },
      { id: 'quest_50', name: '🏆 Quest Master', description: 'Complete 50 quests', metric: 'quests_completed', target: 50, xpReward: 500 },
      { id: 'streak_3', name: '🔥 On a Roll', description: 'Maintain a 3-day streak', metric: 'streak', target: 3, xpReward: 75 },
      { id: 'streak_7', name: '🔥 Week Warrior', description: 'Maintain a 7-day streak', metric: 'streak', target: 7, xpReward: 200 },
      { id: 'care_first', name: '💚 First Care Token', description: 'Earn your first $CARE token', metric: 'care_tokens', target: 1, xpReward: 50 },
      { id: 'care_100', name: '💖 Care Champion', description: 'Earn 100 $CARE tokens', metric: 'care_tokens', target: 100, xpReward: 300 },
      { id: 'level_5', name: '📈 Level 5', description: 'Reach level 5', metric: 'level', target: 5, xpReward: 100 },
      { id: 'level_10', name: '📈 Level 10', description: 'Reach level 10', metric: 'level', target: 10, xpReward: 250 }
    ];
    
    achievements.forEach(a => this.globalAchievements.set(a.id, a));
  }
  
  getStats() {
    return {
      members: this.members.size,
      activeQuests: this.activeQuests.size,
      familyStats: this.familyStats,
      dailyChallenges: this.dailyChallenges.length,
      templates: this.questTemplates.size
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  QUEST_CONFIG,
  Quest,
  Achievement,
  FamilyMemberProfile,
  FamilyQuestEngine
};