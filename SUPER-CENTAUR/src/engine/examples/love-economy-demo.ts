/**
 * L.O.V.E. Economy Demo
 * Practical example showing how to use the L.O.V.E. economy
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { GameEngine } from '../core/GameEngine';

/**
 * Demo: Complete L.O.V.E. economy workflow
 */
export async function loveEconomyDemo() {
  console.log('💜 L.O.V.E. Economy Demo Starting...\n');

  // Initialize game engine
  const gameEngine = new GameEngine();
  await gameEngine.init();

  const walletIntegration = gameEngine.getWalletIntegration();
  const vestingManager = gameEngine.getVestingManager();
  const proofOfCare = gameEngine.getProofOfCareManager();

  // ============================================
  // 1. CHECK FOUNDING NODES STATUS
  // ============================================
  console.log('📊 Founding Nodes Status:');
  console.log('─'.repeat(50));

  const nodeOneStatus = vestingManager.getVestingStatus('node_one');
  const nodeTwoStatus = vestingManager.getVestingStatus('node_two');

  if (nodeOneStatus) {
    console.log(`\nnode one (Bash):`);
    console.log(`  Age: ${nodeOneStatus.age}`);
    console.log(`  Phase: ${nodeOneStatus.phase}`);
    console.log(`  Can Earn: ${nodeOneStatus.canEarn}`);
    console.log(`  Can Spend: ${nodeOneStatus.canSpend}`);
    console.log(`  Requires Guardian Approval: ${nodeOneStatus.requiresGuardianApproval}`);
    console.log(`  Voting Power: ${nodeOneStatus.votingPower}%`);
  }

  if (nodeTwoStatus) {
    console.log(`\nnode two (Willow):`);
    console.log(`  Age: ${nodeTwoStatus.age}`);
    console.log(`  Phase: ${nodeTwoStatus.phase}`);
    console.log(`  Can Earn: ${nodeTwoStatus.canEarn}`);
    console.log(`  Can Spend: ${nodeTwoStatus.canSpend}`);
    console.log(`  Requires Guardian Approval: ${nodeTwoStatus.requiresGuardianApproval}`);
    console.log(`  Voting Power: ${nodeTwoStatus.votingPower}%`);
  }

  // ============================================
  // 2. REWARD LOVE FOR GAME ACTIONS
  // ============================================
  console.log('\n\n🎮 Game Actions & LOVE Rewards:');
  console.log('─'.repeat(50));

  // Simulate player progress (normally comes from game state)
  // For demo, we'll use a mock member ID
  const demoMemberId = 'demo_member_001';

  // Create wallet for demo member
  const store = (await import('../../database/store')).DataStore.getInstance();
  store.insert('wallets', {
    id: `wallet_${demoMemberId}`,
    memberId: demoMemberId,
    memberName: 'Demo Member',
    role: 'Player',
    balance: 0,
    currency: 'LOVE',
  });

  // Register demo member with vesting manager
  vestingManager.registerMember({
    memberId: demoMemberId,
    memberName: 'Demo Member',
    birthdate: new Date('2010-01-01'), // Age 16 (Apprenticeship phase)
  });

  // Reward for placing blocks
  console.log('\n1. Placing 5 blocks...');
  for (let i = 0; i < 5; i++) {
    walletIntegration.rewardLove(demoMemberId, 1.0, `Placed block ${i + 1}`, 'build');
  }

  // Reward for creating artifact
  console.log('2. Creating artifact...');
  walletIntegration.rewardLove(demoMemberId, 10.0, 'Created 3D printed model', 'achievement');

  // Reward for milestone
  console.log('3. Reaching milestone...');
  walletIntegration.rewardLove(demoMemberId, 25.0, 'Completed Master Builder challenge', 'achievement');

  // Record PING
  console.log('4. Recording PING...');
  gameEngine.recordPing('target_member');

  // ============================================
  // 3. CHECK POOL BALANCES
  // ============================================
  console.log('\n\n💰 Pool Balances:');
  console.log('─'.repeat(50));

  const pools = walletIntegration.getPools(demoMemberId);
  const sovereigntyPool = walletIntegration.getSovereigntyPool(demoMemberId);
  const performancePool = walletIntegration.getPerformancePool(demoMemberId);
  const totalBalance = walletIntegration.getBalance(demoMemberId);

  console.log(`\nTotal Balance: ${totalBalance.toFixed(2)} LOVE`);
  console.log(`Sovereignty Pool: ${sovereigntyPool.toFixed(2)} LOVE (${((sovereigntyPool / totalBalance) * 100).toFixed(1)}%)`);
  console.log(`Performance Pool: ${performancePool.toFixed(2)} LOVE (${((performancePool / totalBalance) * 100).toFixed(1)}%)`);

  // ============================================
  // 4. RECORD CARE INTERACTIONS
  // ============================================
  console.log('\n\n💚 Proof of Care:');
  console.log('─'.repeat(50));

  // Record care interactions
  console.log('\nRecording care interactions...');

  // Interaction 1: Recent, high quality
  const interaction1 = gameEngine.recordCareInteraction({
    memberId: demoMemberId,
    interactionTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    hrvSync: 0.9,
    interactionDuration: 45,
    engagementDepth: 0.95,
    tasksVerified: 2,
  });
  console.log(`  Interaction 1: T_prox=${interaction1.timeProximity.toFixed(2)}, Q_res=${interaction1.qualityResonance.toFixed(2)}, Tasks=${interaction1.tasksVerified}`);

  // Interaction 2: Older, moderate quality
  const interaction2 = gameEngine.recordCareInteraction({
    memberId: demoMemberId,
    interactionTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    hrvSync: 0.6,
    interactionDuration: 20,
    engagementDepth: 0.7,
    tasksVerified: 1,
  });
  console.log(`  Interaction 2: T_prox=${interaction2.timeProximity.toFixed(2)}, Q_res=${interaction2.qualityResonance.toFixed(2)}, Tasks=${interaction2.tasksVerified}`);

  // Get care score
  const careScore = proofOfCare.getCareScore(demoMemberId);
  console.log(`\nCare Score: ${careScore.totalScore.toFixed(2)}`);
  console.log(`  Interaction Scores: ${careScore.interactionScores.map(s => s.toFixed(2)).join(', ')}`);
  console.log(`  Tasks Score: ${careScore.tasksScore}`);

  // ============================================
  // 5. CHECK VESTING PERMISSIONS
  // ============================================
  console.log('\n\n🔒 Access Control:');
  console.log('─'.repeat(50));

  const status = vestingManager.getVestingStatus(demoMemberId);
  if (status) {
    console.log(`\nMember: ${demoMemberId}`);
    console.log(`  Phase: ${status.phase}`);
    console.log(`  Age: ${status.age}`);
    console.log(`\nPermissions:`);
    console.log(`  Can Earn: ${status.canEarn}`);
    console.log(`  Can Spend: ${status.canSpend} ${status.requiresGuardianApproval ? '(with guardian approval)' : ''}`);
    console.log(`  Can Transfer: ${status.canTransfer}`);
    console.log(`  Can Deploy Contracts: ${status.canDeployContracts}`);
    console.log(`  Can Create Challenges: ${status.canCreateChallenges}`);
    console.log(`  Voting Power: ${status.votingPower}%`);
  }

  // ============================================
  // 6. TETRAHEDRON BOND
  // ============================================
  console.log('\n\n🔺 Tetrahedron Bond:');
  console.log('─'.repeat(50));

  const bondMembers = ['node_one', 'node_two', demoMemberId, 'parent_member'];
  const bondStrength = proofOfCare.getBondStrength(bondMembers);
  const hasDecayed = proofOfCare.hasBondDecayed(bondMembers);

  console.log(`\nBond Members: ${bondMembers.join(', ')}`);
  console.log(`Bond Strength: ${(bondStrength * 100).toFixed(1)}%`);
  console.log(`Has Decayed: ${hasDecayed ? 'Yes (no interaction for 30+ days)' : 'No'}`);

  if (bondStrength > 0.5 && !hasDecayed) {
    console.log('✅ Strong bond! Rewarding TETRAHEDRON_BOND...');
    walletIntegration.rewardLove(demoMemberId, 15.0, 'Formed tetrahedron bond', 'bonus');
  }

  // ============================================
  // 7. FINAL BALANCES
  // ============================================
  console.log('\n\n📊 Final Balances:');
  console.log('─'.repeat(50));

  const finalPools = walletIntegration.getPools(demoMemberId);
  const finalTotal = walletIntegration.getBalance(demoMemberId);

  console.log(`\nTotal LOVE Earned: ${finalTotal.toFixed(2)}`);
  console.log(`Sovereignty Pool: ${finalPools.sovereigntyPool.toFixed(2)} LOVE`);
  console.log(`Performance Pool: ${finalPools.performancePool.toFixed(2)} LOVE`);
  console.log(`\n💜 The mesh holds. 💜\n`);

  return {
    memberId: demoMemberId,
    totalBalance: finalTotal,
    pools: finalPools,
    careScore: careScore.totalScore,
    vestingStatus: status,
    bondStrength,
  };
}

/**
 * Run the demo
 */
if (require.main === module) {
  loveEconomyDemo()
    .then((result) => {
      console.log('\n✅ Demo completed successfully!');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error('❌ Demo failed:', error);
      process.exit(1);
    });
}
