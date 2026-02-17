/**
 * Simple Test Runner for Grounding Phase
 * 
 * Purpose: Execute the Grounding Phase test suite
 * Method: Direct execution without module detection issues
 * Style: Clear, methodical, neurodivergent-friendly
 */

// Import the test suite
import { GroundingPhaseTestSuite } from './test-grounding-phase.js';

async function runTest() {
  console.log('🧪 Starting Grounding Phase Test Execution');
  
  try {
    const testSuite = new GroundingPhaseTestSuite();
    const result = await testSuite.runCompleteTest();
    
    console.log('\n🧪 === FINAL TEST RESULTS ===');
    console.log(`Status: ${result.status}`);
    console.log(`Tests Completed: ${result.results.length}`);
    console.log(`Overall Status: ${result.summary.overallStatus}`);
    
    return result;
  } catch (error) {
    console.error('💥 Test Execution Error:', error);
    throw error;
  }
}

// Execute the test
runTest().catch(console.error);

console.log('🧪 Test Runner Initialized');