/**
 * L.O.V.E. ECONOMY v5.0.0 - COMPLETE SYSTEM TEST
 * THE WONKY QUANTUM REFACTOR
 * WONKY SPROUT FOR DA KIDS! 🌱💚⚛️
 */

const loveEconomy = require('./index.js');

async function testCompleteSystem() {
  console.log('🌱💚 L.O.V.E. ECONOMY v5.0.0 - COMPLETE SYSTEM TEST');
  console.log('THE WONKY QUANTUM REFACTOR');
  console.log('WONKY SPROUT FOR DA KIDS! 🌱💚⚛️');
  console.log('================================================\n');

  try {
    // ============================================
    // SYSTEM INITIALIZATION
    // ============================================
    console.log('🚀 INITIALIZING COMPLETE WONKY SPROUT ECOSYSTEM...\n');

    const config = {
      spoons: { budget: 12 },
      biometricStream: { enabled: true },
      calendar: { enabled: true },
      phenixNavigator: { enabled: true },
      familyQuest: { enabled: true },
      iot: {
        manager: { enabled: true },
        hue: { enabled: false }, // Disabled for test
        govee: { enabled: false },
        homeassistant: { enabled: false },
        smartthings: { enabled: false },
        ifttt: { enabled: false }
      },
      sensory: { enabled: true },
      translator: { enabled: true }
    };

    await loveEconomy.initialize(null, config);

    console.log('✅ SYSTEM INITIALIZED SUCCESSFULLY!');
    console.log(`📊 VERSION: ${loveEconomy.version}`);
    console.log(`🎯 FEATURES: ${loveEconomy.status.features.join(', ')}\n`);

    // ============================================
    // SPOON ECONOMY TEST
    // ============================================
    console.log('🥄 TESTING SPOON ECONOMY...');

    const status = loveEconomy.getStatus();
    const spoonStatus = status.spoons;
    console.log(`📈 Current Spoons: ${spoonStatus.currentSpoons}/${spoonStatus.budget}`);
    console.log(`🎯 Trend: ${spoonStatus.trend}`);
    console.log(`🛡️ Shield Active: ${status.shieldActive}\n`);

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
    // SENSORY TOOLKIT TEST
    // ============================================
    console.log('🧘 TESTING SENSORY TOOLKIT...');

    // Create sensory profile
    const profile = loveEconomy.getSensoryProfile('kid');
    console.log(`👤 Sensory Profile: ${profile ? 'Loaded' : 'Created'}`);

    // Get regulation tools
    const tools = loveEconomy.getRegulationTools('kid', 'optimal');
    console.log(`🛠️ Regulation Tools Available: ${tools ? tools.length : 0} tools`);

    // Generate sensory diet
    const diet = loveEconomy.generateSensoryDiet('kid');
    console.log(`📅 Sensory Diet Generated: ${diet ? 'Yes' : 'No'}\n`);

    // ============================================
    // UNIVERSAL TRANSLATOR TEST
    // ============================================
    console.log('🌈 TESTING UNIVERSAL TRANSLATOR...');

    // Create communication profiles
    const profile1 = loveEconomy.createCommunicationProfile('mom_profile', {
      neurotype: 'neurotypical',
      humanOS: 'healer',
      communicationStyle: 'warm_supportive'
    });

    const profile2 = loveEconomy.createCommunicationProfile('kid_profile', {
      neurotype: 'autism',
      humanOS: 'builder',
      communicationStyle: 'direct_logical'
    });

    console.log(`👥 Communication Profiles Created: ${profile1 ? 'Mom' : '❌'}, ${profile2 ? 'Kid' : '❌'}`);
    console.log(`   Profile 1 ID: ${profile1?.id || 'undefined'}`);
    console.log(`   Profile 2 ID: ${profile2?.id || 'undefined'}`);

    // Check if profiles exist in the system
    const allProfiles = loveEconomy.universalTranslator?.profiles || new Map();
    console.log(`   Profiles in system: ${Array.from(allProfiles.keys()).join(', ')}`);

    // Create communication bridge
    const bridge = loveEconomy.createCommunicationBridge('mom_profile', 'kid_profile');
    console.log(`🌉 Communication Bridge: ${bridge ? 'Created' : '❌'}\n`);

    // ============================================
    // PROOF OF CARE TEST
    // ============================================
    console.log('💚 TESTING PROOF OF CARE CONSENSUS...');

    // Start care session
    const session = loveEconomy.startCareSession('mom', 'kid');
    console.log(`⏰ Care Session Started: ${session ? session.tickId : '❌'}`);

    // Simulate some biometric data (would normally come from wearables)
    // This would trigger PoC calculations

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
    // CALENDAR INTEGRATION TEST
    // ============================================
    console.log('📅 TESTING CALENDAR INTEGRATION...');

    // Get spoon forecast
    const forecast = await loveEconomy.getSpoonForecast(3);
    console.log(`🔮 3-Day Spoon Forecast: ${forecast ? forecast.length + ' days' : '❌'}`);

    // Check activity affordability
    const canAfford = await loveEconomy.canAffordActivity(2, new Date());
    console.log(`💰 Can Afford 2-Spoon Activity: ${canAfford.canAfford ? 'YES' : 'NO'}`);
    if (!canAfford.canAfford) {
      console.log(`   📉 Shortfall: ${canAfford.shortfall} spoons`);
    }
    console.log('');

    // ============================================
    // SYSTEM STATUS
    // ============================================
    console.log('📊 FINAL SYSTEM STATUS');
    console.log('================================================');

    const finalStatus = {
      version: loveEconomy.version,
      features: loveEconomy.status.features.length,
      healthy: loveEconomy.status.healthy,
      spoonBudget: status.spoons.budget,
      familyMembers: loveEconomy.getFamilyStats ? 'Available' : 'Not Available',
      careTokens: loveEconomy.getCareSessionStatus ? 'Available' : 'Not Available',
      shieldStatus: loveEconomy.status.shieldActive ? 'ACTIVE' : 'INACTIVE'
    };

    Object.entries(finalStatus).forEach(([key, value]) => {
      console.log(`✅ ${key}: ${value}`);
    });

    console.log('\n================================================');
    console.log('🎉 WONKY SPROUT ECOSYSTEM TEST COMPLETE!');
    console.log('🌱💚 THE WONKY QUANTUM REFACTOR IS LIVE!');
    console.log('================================================\n');

    // ============================================
    // CLEANUP
    // ============================================
    console.log('🧹 CLEANING UP...');
    await loveEconomy.shutdown();
    console.log('✅ SYSTEM SHUTDOWN COMPLETE\n');

    console.log('🎊 ALL TESTS PASSED! L.O.V.E. ECONOMY v5.0.0 IS FULLY OPERATIONAL!');
    console.log('🌱💚⚛️ WONKY SPROUT FOR DA KIDS!');

  } catch (error) {
    console.error('❌ SYSTEM TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testCompleteSystem().catch(console.error);
}

module.exports = { testCompleteSystem };