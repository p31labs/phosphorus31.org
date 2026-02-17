/**
 * Test script for Digital Self Core integration
 */

import { digitalSelfCoreManager } from './dist/src/sovereignty/DigitalSelfCoreWrapper.js';

async function testIntegration() {
  console.log('🧪 Testing Digital Self Core Integration');
  console.log('========================================');
  
  try {
    // Test 1: Health Check
    console.log('\n1. Health Check:');
    const health = await digitalSelfCoreManager.healthCheck();
    console.log(`   Healthy: ${health.healthy}`);
    console.log(`   Message: ${health.message}`);
    console.log('   Components:', health.components);
    
    // Test 2: Component Status
    console.log('\n2. Component Status:');
    const componentStatus = await digitalSelfCoreManager.getComponentStatus();
    console.log(`   Floating Neutral Detector: ${componentStatus.floatingNeutralDetector.passed ? '✅' : '❌'}`);
    console.log(`   Metabolic Baseline: ${componentStatus.metabolicBaseline.passed ? '✅' : '❌'}`);
    console.log(`   Cognitive Load Assessor: ${componentStatus.cognitiveLoadAssessor.passed ? '✅' : '❌'}`);
    console.log(`   Intent Declaration: ${componentStatus.intentDeclaration.passed ? '✅' : '❌'}`);
    
    // Test 3: Grounding Phase Execution
    console.log('\n3. Grounding Phase Execution:');
    const groundingResult = await digitalSelfCoreManager.executeGroundingPhase();
    console.log(`   Status: ${groundingResult.status}`);
    console.log(`   Message: ${groundingResult.message}`);
    console.log(`   Progress: ${groundingResult.state.progress}%`);
    
    // Test 4: Sovereign Operator Status
    console.log('\n4. Sovereign Operator Status:');
    const operatorStatus = await digitalSelfCoreManager.getSovereignOperatorStatus();
    console.log(`   Grounded: ${operatorStatus.grounded ? '✅' : '❌'}`);
    console.log(`   Metabolic Stability: ${operatorStatus.metabolicStability}`);
    console.log(`   Cognitive Load: ${operatorStatus.cognitiveLoad}`);
    console.log(`   Intent Clarity: ${operatorStatus.intentClarity}`);
    console.log(`   Floating Neutral Detected: ${operatorStatus.floatingNeutralDetected ? '❌' : '✅'}`);
    
    // Test 5: Sovereignty Issues
    console.log('\n5. Sovereignty Issues:');
    const issues = await digitalSelfCoreManager.getSovereigntyIssues();
    if (issues.issues.length > 0) {
      console.log('   Issues:', issues.issues);
      console.log('   Recommendations:', issues.recommendations);
    } else {
      console.log('   ✅ No sovereignty issues detected');
    }
    
    console.log('\n========================================');
    console.log('🧪 Digital Self Core Integration Test Complete');
    console.log('   Status:', groundingResult.status === 'GROUNDING_COMPLETE' ? '✅ INTEGRATION SUCCESSFUL' : '⚠️ INTEGRATION NEEDS ATTENTION');
    
  } catch (error) {
    console.error('\n❌ Integration Test Failed:', error);
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testIntegration();
}

export { testIntegration };
