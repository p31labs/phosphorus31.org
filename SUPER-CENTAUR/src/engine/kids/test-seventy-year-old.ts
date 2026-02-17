/**
 * Quick Test Script for 70-Year-Old User Testing
 * 
 * Run this to set up a test session optimized for a 70-year-old senior user
 * 
 * Usage:
 *   import { setupSeventyYearOldTest } from './test-seventy-year-old';
 *   const testSession = await setupSeventyYearOldTest();
 */

import { GameEngine } from '../core/GameEngine';
import { SeniorMode, SeniorProfile } from '../accessibility/SeniorMode';

export interface SeventyYearOldTestSession {
  gameEngine: GameEngine;
  profile: SeniorProfile;
  accessibility: any;
  seniorMode: SeniorMode;
  settings: any;
}

/**
 * Set up a complete test session for a 70-year-old
 */
export async function setupSeventyYearOldTest(): Promise<SeventyYearOldTestSession> {
  console.log('👴 Setting up 70-year-old test session...');
  
  const gameEngine = new GameEngine();
  
  // Initialize with accessibility
  await gameEngine.init();
  console.log('✅ Game engine initialized');
  
  // Start with age 70 (triggers senior mode)
  await gameEngine.start(70);
  console.log('✅ Game started with age 70');
  
  // Get senior mode from game engine
  const seniorMode = gameEngine.getSeniorMode();
  
  // Verify age qualifies for senior mode
  const isSenior = seniorMode.isSeniorAge(70);
  console.assert(isSenior, 'Age 70 should qualify for senior mode');
  console.log(`✅ Senior age check: ${isSenior ? 'PASS' : 'FAIL'}`);
  
  // Create senior profile
  const profile = seniorMode.createSeniorProfile(
    'TestSenior',  // Display name only (privacy-first)
    70,            // Age
    ['communication', 'medication', 'safety'] // Priorities
  );
  
  console.log(`✅ Profile created: ${profile.displayName} (${profile.tier} tier)`);
  console.assert(
    profile.tier === 'senior',
    `Expected senior tier for age 70, got ${profile.tier}`
  );
  
  // Configure accessibility for 70-year-old
  const accessibility = gameEngine.getEnhancedAccessibility();
  const recommendedSettings = seniorMode.getRecommendedSettings(70);
  
  accessibility.updateSettings({
    fontSize: 'xxlarge',        // 24px minimum for seniors
    contrast: 'high',            // Maximum contrast
    simplifiedUI: true,          // Simplified interface
    animationReduced: true,      // Reduced motion for comfort
    motionSensitivity: 'high',   // Minimize motion
    audioFeedback: true,         // Sound confirmation
    hapticFeedback: true,        // Vibration confirmation
    voiceCommands: true,         // Voice input
    screenReader: true,          // Full screen reader support
  });
  console.log('✅ Accessibility configured for 70-year-old');
  
  // Verify settings
  const settings = accessibility.getSettings();
  console.log(`✅ Current settings:`);
  console.log(`   - Font Size: ${settings.fontSize}`);
  console.log(`   - Contrast: ${settings.contrast}`);
  console.log(`   - Simplified UI: ${settings.simplifiedUI}`);
  console.log(`   - Reduced Motion: ${settings.animationReduced}`);
  console.log(`   - Voice Commands: ${settings.voiceCommands}`);
  console.log(`   - Screen Reader: ${settings.screenReader}`);
  console.log(`   - Audio Feedback: ${settings.audioFeedback}`);
  console.log(`   - Haptic Feedback: ${settings.hapticFeedback}`);
  
  // Verify critical settings for seniors
  console.assert(
    settings.fontSize === 'xxlarge',
    `Font size should be xxlarge for 70-year-old, got ${settings.fontSize}`
  );
  console.assert(
    settings.contrast === 'high',
    `Contrast should be high for 70-year-old, got ${settings.contrast}`
  );
  console.assert(
    settings.simplifiedUI === true,
    `Simplified UI should be enabled for 70-year-old`
  );
  console.assert(
    settings.voiceCommands === true,
    `Voice commands should be enabled for 70-year-old`
  );
  
  console.log('\n🎮 Test session ready!');
  console.log('📋 Next steps:');
  console.log('   1. Test initial setup and onboarding');
  console.log('   2. Test basic navigation');
  console.log('   3. Test communication features');
  console.log('   4. Test medication tracking');
  console.log('   5. Test safety and emergency features');
  console.log('   6. Test accessibility customization');
  console.log('   7. Observe ease of use and confidence level');
  
  return {
    gameEngine,
    profile,
    accessibility,
    seniorMode,
    settings
  };
}

/**
 * Run a quick validation test
 */
export async function validateSeventyYearOldSetup(): Promise<{
  passed: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const session = await setupSeventyYearOldTest();
    
    // Validate tier assignment
    if (session.profile.tier !== 'senior') {
      errors.push(`Invalid tier for age 70: ${session.profile.tier} (expected senior)`);
    }
    
    // Validate age qualifies
    if (!session.seniorMode.isSeniorAge(70)) {
      errors.push('Age 70 should qualify for senior mode');
    }
    
    // Validate accessibility settings
    const a11ySettings = session.accessibility.getSettings();
    
    if (a11ySettings.fontSize !== 'xxlarge') {
      errors.push(`Font size should be xxlarge for 70-year-old, got ${a11ySettings.fontSize}`);
    }
    
    if (a11ySettings.contrast !== 'high') {
      errors.push(`Contrast should be high for 70-year-old, got ${a11ySettings.contrast}`);
    }
    
    if (!a11ySettings.simplifiedUI) {
      errors.push('Simplified UI should be enabled for 70-year-old');
    }
    
    if (!a11ySettings.voiceCommands) {
      errors.push('Voice commands should be enabled for 70-year-old');
    }
    
    if (!a11ySettings.screenReader) {
      warnings.push('Screen reader should be enabled for 70-year-old');
    }
    
    if (!a11ySettings.audioFeedback) {
      warnings.push('Audio feedback should be enabled for 70-year-old');
    }
    
    if (!a11ySettings.hapticFeedback) {
      warnings.push('Haptic feedback should be enabled for 70-year-old');
    }
    
    if (!a11ySettings.animationReduced) {
      warnings.push('Reduced motion should be enabled for 70-year-old');
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
  setupSeventyYearOldTest()
    .then(() => {
      console.log('\n✅ Test setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test setup failed:', error);
      process.exit(1);
    });
}
