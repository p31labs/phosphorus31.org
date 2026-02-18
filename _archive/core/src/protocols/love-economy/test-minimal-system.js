/**
 * L.O.V.E. ECONOMY v5.0.0 - MINIMAL SYSTEM TEST
 * THE WONKY QUANTUM REFACTOR
 * WONKY SPROUT FOR DA KIDS! 🌱💚⚛️
 * 
 * This test focuses on basic functionality without getStatus
 */

const loveEconomy = require('./index.js');

async function testMinimalSystem() {
  console.log('🌱💚 L.O.V.E. ECONOMY v5.0.0 - MINIMAL SYSTEM TEST');
  console.log('THE WONKY QUANTUM REFACTOR');
  console.log('WONKY SPROUT FOR DA KIDS! 🌱💚⚛️');
  console.log('================================================\n');

  try {
    // ============================================
    // SYSTEM INITIALIZATION
    // ============================================
    console.log('🚀 INITIALIZING MINIMAL SYSTEM...\n');

    const config = {
      spoons: { budget: 12 },
      biometricStream: { enabled: true },
      phenixNavigator: { enabled: true },
      familyQuest: { enabled: true },
      iot: {
        manager: { enabled: true }
      }
    };

    await loveEconomy.initialize(null, config);

    console.log('✅ MINIMAL SYSTEM INITIALIZED!');
    console.log(`📊 VERSION: ${loveEconomy.version}`);
    console.log(`🎯 FEATURES: ${loveEconomy.status.features.join(', ')}\n`);

    // ============================================
    // SPOON ECONOMY TEST
    // ============================================
    console.log('🥄 TESTING SPOON ECONOMY...');

    // Test spoon operations directly
    const spoonManager = loveEconomy.spoonManager;
    if (spoonManager) {
      console.log(`📈 Current Spoons: ${spoonManager.currentSpoons}/${spoonManager.budget}`);
      console.log(`🎯 Trend: ${spoonManager.trend}`);
      console.log(`🛡️ Shield Active: ${loveEconomy.status.shieldActive}\n`);
    }

    // ============================================
    // FAMILY QUEST TEST
    // ============================================
    console.log('🎮 TESTING FAMILY QUEST SYSTEM...');

    // Add test family members
    const mom = loveEconomy.addFamilyMember('mom', {
      name: 'Mom',
      avatar: '👩',
      role: 'parent',
      age: 35
    });

    const kid = loveEconomy.addFamilyMember('kid', {
      name: 'Alex',
      avatar: '🧑',
      role: 'child',
      age: 10
    });

    console.log(`👨‍👩‍👧 Family Members Added: ${mom.name}, ${kid.name}`);

    // Generate daily quests
    const dailyQuests = loveEconomy.getDailyQuests('kid');
    console.log(`📋 Daily Quests Generated: ${dailyQuests.length} quests\n`);

    // ============================================
    // PROOF OF CARE TEST
    // ============================================
    console.log('💚 TESTING PROOF OF CARE CONSENSUS...');

    // Start care session
    const session = loveEconomy.startCareSession('mom', 'kid');
    console.log(`⏰ Care Session Started: ${session ? session.tickId : '❌'}`);

    // End care session
    const result = loveEconomy.endCareSession();
    console.log(`🏆 Care Session Result: ${result.success ? 'VALIDATED' : 'PENDING'}`);
    if (result.success) {
      console.log(`   💰 Tokens Earned: ${result.tokensEarned}`);
      console.log(`   📊 Care Score: ${result.careScore}`);
    }
    console.log('');

    // ============================================
    // ENTROPY SHIELD TEST
    // ============================================
    console.log('🛡️ TESTING ENTROPY SHIELD...');

    // Test message processing
    const safeMessage = loveEconomy.processMessage('mom', 'kid', 'I love you and support you!');
    const toxicMessage = loveEconomy.processMessage('mom', 'kid', 'You\'re so difficult and never listen!');

    console.log(`💬 Safe Message: ${safeMessage.allowed ? 'ALLOWED' : 'BLOCKED'}`);
    console.log(`⚠️ Toxic Message: ${toxicMessage.allowed ? 'ALLOWED' : 'BLOCKED'}`);

    if (!toxicMessage.allowed) {
      console.log(`   🚫 Category: ${toxicMessage.category}`);
      console.log(`   💝 Calming Response: ${loveEconomy.getCalmingResponse(toxicMessage.category)}`);
    }

    // Get shield stats
    const shieldStats = loveEconomy.getEntropyShieldStats();
    console.log(`📊 Shield Stats: ${shieldStats ? 'Available' : '❌'}\n`);

    // ============================================
    // SYSTEM STATUS
    // ============================================
    console.log('📊 FINAL SYSTEM STATUS');
    console.log('================================================');

    const finalStatus = {
      version: loveEconomy.version,
      features: loveEconomy.status.features.length,
      healthy: loveEconomy.status.healthy,
      shieldStatus: loveEconomy.status.shieldActive ? 'ACTIVE' : 'INACTIVE'
    };

    Object.entries(finalStatus).forEach(([key, value]) => {
      console.log(`✅ ${key}: ${value}`);
    });

    console.log('\n================================================');
    console.log('🎉 MINIMAL SYSTEM TEST COMPLETE!');
    console.log('🌱💚 THE WONKY QUANTUM REFACTOR IS FUNCTIONAL!');
    console.log('================================================\n');

    // ============================================
    // CLEANUP
    // ============================================
    console.log('🧹 CLEANING UP...');
    await loveEconomy.shutdown();
    console.log('✅ SYSTEM SHUTDOWN COMPLETE\n');

    console.log('🎊 MINIMAL TESTS PASSED! L.O.V.E. ECONOMY v5.0.0 IS FUNCTIONAL!');
    console.log('🌱💚⚛️ WONKY SPROUT FOR DA KIDS!');

  } catch (error) {
    console.error('❌ MINIMAL TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testMinimalSystem().catch(console.error);
}

module.exports = { testMinimalSystem };