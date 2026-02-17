/**
 * Quick Test Script for 5-Year-Old User Testing
 * 
 * Run this to set up a test session optimized for a 5-year-old child
 * 
 * Usage:
 *   import { setupFiveYearOldTest } from './test-five-year-old';
 *   const testSession = await setupFiveYearOldTest();
 */

import { GameEngine } from '../core/GameEngine';

export interface FiveYearOldTestSession {
  gameEngine: GameEngine;
  profile: any;
  challenges: any[];
  accessibility: any;
  safety: any;
}

/**
 * Set up a complete test session for a 5-year-old
 */
export async function setupFiveYearOldTest(): Promise<FiveYearOldTestSession> {
  console.log('👶 Setting up 5-year-old test session...');
  
  const gameEngine = new GameEngine();
  
  // Initialize with safety
  await gameEngine.init();
  console.log('✅ Game engine initialized');
  
  // Start with age 5 (triggers seedling tier)
  await gameEngine.start(5);
  console.log('✅ Game started with age 5');
  
  // Create kid profile
  const kidsMode = gameEngine.getKidsMode();
  const profile = kidsMode.createKidProfile(
    'TestKid',  // Display name only (privacy-first)
    5,          // Age
    ['building', 'colors', 'shapes'] // Interests
  );
  
  console.log(`✅ Profile created: ${profile.displayName} (${profile.tier} tier)`);
  console.assert(
    profile.tier === 'seedling' || profile.tier === 'sprout',
    `Expected seedling or sprout tier for age 5, got ${profile.tier}`
  );
  
  // Configure accessibility for 5-year-old
  const accessibility = gameEngine.getEnhancedAccessibility();
  accessibility.updateSettings({
    fontSize: 'xlarge',        // Large text for young readers
    contrast: 'high',         // High contrast for visibility
    simplifiedUI: true,       // Simplified interface
    animationReduced: true,    // Reduced motion for sensory regulation
    motionSensitivity: 'high', // High sensitivity setting
    audioFeedback: true,      // Audio feedback for actions
    screenReader: false,       // Not needed for 5-year-old
    voiceCommands: false      // Not needed for 5-year-old
  });
  console.log('✅ Accessibility configured for 5-year-old');
  
  // Get challenges for this age
  const challenges = kidsMode.getChallengesForKid(profile.id);
  console.log(`✅ Available challenges: ${challenges.length}`);
  challenges.forEach((challenge, i) => {
    console.log(`   ${i + 1}. ${challenge.name} (${challenge.tier} tier, ${challenge.difficulty})`);
  });
  
  // Verify safety settings
  const safety = gameEngine.getSafetyManager();
  const isSafe = safety.isContentSafe('test content');
  console.log(`✅ Safety check: ${isSafe ? 'PASS' : 'FAIL'}`);
  
  // Check time limits
  const timeCheck = kidsMode.checkTimeLimit(profile.id);
  console.log(`✅ Time limit check: ${timeCheck.canPlay ? 'Can play' : 'Time limit reached'} (${timeCheck.timeRemaining} minutes remaining)`);
  
  // Verify safe settings
  const safeSettings = kidsMode.getSafeSettings(profile.id);
  console.log(`✅ Safe settings:`);
  console.log(`   - Content filter: ${safeSettings?.contentFilter}`);
  console.log(`   - Time limit: ${safeSettings?.timeLimit} minutes`);
  console.log(`   - Break reminders: ${safeSettings?.breakReminders ? 'ON' : 'OFF'}`);
  console.log(`   - Parent approval: ${safeSettings?.parentApproval ? 'REQUIRED' : 'NOT REQUIRED'}`);
  
  console.log('\n🎮 Test session ready!');
  console.log('📋 Next steps:');
  console.log('   1. Let child explore the interface');
  console.log('   2. Try placing pieces');
  console.log('   3. Attempt a challenge');
  console.log('   4. Observe engagement and ease of use');
  console.log('   5. Check for any frustration points');
  
  return {
    gameEngine,
    profile,
    challenges,
    accessibility,
    safety
  };
}

/**
 * Run a quick validation test
 */
export async function validateFiveYearOldSetup(): Promise<{
  passed: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const session = await setupFiveYearOldTest();
    
    // Validate tier assignment
    if (session.profile.tier !== 'seedling' && session.profile.tier !== 'sprout') {
      errors.push(`Invalid tier for age 5: ${session.profile.tier} (expected seedling or sprout)`);
    }
    
    // Validate challenges exist
    if (session.challenges.length === 0) {
      errors.push('No challenges available for 5-year-old');
    }
    
    // Validate safety
    const safeSettings = session.gameEngine.getKidsMode().getSafeSettings(session.profile.id);
    if (safeSettings?.contentFilter !== 'strict') {
      errors.push('Content filter should be "strict" for 5-year-old');
    }
    
    if (!safeSettings?.breakReminders) {
      warnings.push('Break reminders should be enabled for 5-year-old');
    }
    
    if (!safeSettings?.parentApproval) {
      warnings.push('Parent approval should be required for 5-year-old');
    }
    
    // Validate accessibility
    const a11ySettings = session.accessibility.getSettings();
    if (a11ySettings.fontSize !== 'xlarge') {
      warnings.push('Font size should be xlarge for 5-year-old');
    }
    
    if (a11ySettings.contrast !== 'high') {
      warnings.push('Contrast should be high for 5-year-old');
    }
    
    return {
      passed: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    return {
      passed: false,
      errors: [`Setup failed: ${error}`],
      warnings: []
    };
  }
}

// Export test runner
if (require.main === module) {
  setupFiveYearOldTest()
    .then(() => {
      console.log('\n✅ Test setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test setup failed:', error);
      process.exit(1);
    });
}
