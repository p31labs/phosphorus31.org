/**
 * Infinite Synergy Validation Script
 * Validates the Infinite Synergy system and test suite
 * 
 * Usage:
 *   ts-node src/engine/synergy/validate-infinity.ts
 */

import { InfiniteSynergy, SynergyResult } from './InfiniteSynergy';

interface ValidationResult {
  test: string;
  passed: boolean;
  error?: string;
  details?: any;
}

/**
 * Validate Infinite Synergy system
 */
export async function validateInfinity(): Promise<{
  passed: boolean;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}> {
  console.log('🔍 Validating Infinite Synergy System...\n');
  
  const results: ValidationResult[] = [];
  const infiniteSynergy = new InfiniteSynergy();

  // Test 1: Initialization
  try {
    const result = infiniteSynergy.generateInfinite(1);
    if (result.nodes > 0 && result.levels === 1) {
      results.push({ test: 'Initialization', passed: true, details: result });
    } else {
      results.push({ test: 'Initialization', passed: false, error: 'Invalid initialization' });
    }
  } catch (error: any) {
    results.push({ test: 'Initialization', passed: false, error: error.message });
  }

  // Test 2: Synergy Generation
  try {
    const result = infiniteSynergy.generateInfinite(3);
    if (result.nodes >= 5 && result.totalSynergy > 0) {
      results.push({ test: 'Synergy Generation', passed: true, details: { nodes: result.nodes, synergy: result.totalSynergy } });
    } else {
      results.push({ test: 'Synergy Generation', passed: false, error: 'Invalid synergy generation' });
    }
  } catch (error: any) {
    results.push({ test: 'Synergy Generation', passed: false, error: error.message });
  }

  // Test 3: Fractal Dimension
  try {
    const result = infiniteSynergy.generateInfinite(5);
    if (result.fractalDimension > 0 && result.fractalDimension <= 3) {
      results.push({ test: 'Fractal Dimension', passed: true, details: { dimension: result.fractalDimension } });
    } else {
      results.push({ test: 'Fractal Dimension', passed: false, error: `Invalid fractal dimension: ${result.fractalDimension}` });
    }
  } catch (error: any) {
    results.push({ test: 'Fractal Dimension', passed: false, error: error.message });
  }

  // Test 4: Coherence
  try {
    const result = infiniteSynergy.generateInfinite(5);
    if (result.coherence >= 0 && result.coherence <= 1) {
      results.push({ test: 'Coherence', passed: true, details: { coherence: result.coherence } });
    } else {
      results.push({ test: 'Coherence', passed: false, error: `Invalid coherence: ${result.coherence}` });
    }
  } catch (error: any) {
    results.push({ test: 'Coherence', passed: false, error: error.message });
  }

  // Test 5: Synergy at Level
  try {
    const synergy0 = infiniteSynergy.getSynergyAtLevel(0);
    const synergy5 = infiniteSynergy.getSynergyAtLevel(5);
    if (typeof synergy0 === 'number' && typeof synergy5 === 'number' && synergy0 > 0 && synergy5 > 0) {
      results.push({ test: 'Synergy at Level', passed: true, details: { level0: synergy0, level5: synergy5 } });
    } else {
      results.push({ test: 'Synergy at Level', passed: false, error: 'Invalid synergy values' });
    }
  } catch (error: any) {
    results.push({ test: 'Synergy at Level', passed: false, error: error.message });
  }

  // Test 6: Total Synergy Up to Level
  try {
    const total0 = infiniteSynergy.getTotalSynergyUpToLevel(0);
    const total5 = infiniteSynergy.getTotalSynergyUpToLevel(5);
    if (total0 > 0 && total5 > total0) {
      results.push({ test: 'Total Synergy Up to Level', passed: true, details: { total0, total5 } });
    } else {
      results.push({ test: 'Total Synergy Up to Level', passed: false, error: 'Invalid total synergy' });
    }
  } catch (error: any) {
    results.push({ test: 'Total Synergy Up to Level', passed: false, error: error.message });
  }

  // Test 7: Path Finding
  try {
    const result = infiniteSynergy.generateInfinite(3);
    const visualization = infiniteSynergy.getVisualization(3);
    if (visualization && visualization.children && visualization.children.length > 0) {
      const startId = visualization.id;
      const endId = visualization.children[0].id;
      const path = infiniteSynergy.findPath(startId, endId);
      if (path && path.length > 0) {
        results.push({ test: 'Path Finding', passed: true, details: { pathLength: path.length } });
      } else {
        results.push({ test: 'Path Finding', passed: false, error: 'Path not found' });
      }
    } else {
      results.push({ test: 'Path Finding', passed: false, error: 'No visualization data' });
    }
  } catch (error: any) {
    results.push({ test: 'Path Finding', passed: false, error: error.message });
  }

  // Test 8: Visualization
  try {
    const visualization = infiniteSynergy.getVisualization(3);
    if (visualization && visualization.id && visualization.position && Array.isArray(visualization.position)) {
      results.push({ test: 'Visualization', passed: true, details: { hasPosition: true, hasChildren: !!visualization.children } });
    } else {
      results.push({ test: 'Visualization', passed: false, error: 'Invalid visualization data' });
    }
  } catch (error: any) {
    results.push({ test: 'Visualization', passed: false, error: error.message });
  }

  // Test 9: Synergy at Infinity
  try {
    const infinityValue = infiniteSynergy.getSynergyAtInfinity();
    if ([0, 1, Infinity].includes(infinityValue)) {
      results.push({ test: 'Synergy at Infinity', passed: true, details: { value: infinityValue } });
    } else {
      results.push({ test: 'Synergy at Infinity', passed: false, error: `Invalid infinity value: ${infinityValue}` });
    }
  } catch (error: any) {
    results.push({ test: 'Synergy at Infinity', passed: false, error: error.message });
  }

  // Test 10: Reset
  try {
    infiniteSynergy.generateInfinite(5);
    infiniteSynergy.reset();
    const result = infiniteSynergy.generateInfinite(1);
    if (result.nodes > 0) {
      results.push({ test: 'Reset', passed: true, details: { nodes: result.nodes } });
    } else {
      results.push({ test: 'Reset', passed: false, error: 'Reset failed' });
    }
  } catch (error: any) {
    results.push({ test: 'Reset', passed: false, error: error.message });
  }

  // Test 11: Message Generation
  try {
    const message = infiniteSynergy.getMessage();
    if (typeof message === 'string' && message.length > 0) {
      results.push({ test: 'Message Generation', passed: true, details: { messageLength: message.length } });
    } else {
      results.push({ test: 'Message Generation', passed: false, error: 'Invalid message' });
    }
  } catch (error: any) {
    results.push({ test: 'Message Generation', passed: false, error: error.message });
  }

  // Test 12: Node Growth
  try {
    const level1 = infiniteSynergy.generateInfinite(1);
    infiniteSynergy.reset();
    const level2 = infiniteSynergy.generateInfinite(2);
    if (level2.nodes > level1.nodes) {
      results.push({ test: 'Node Growth', passed: true, details: { level1: level1.nodes, level2: level2.nodes } });
    } else {
      results.push({ test: 'Node Growth', passed: false, error: 'Nodes did not grow' });
    }
  } catch (error: any) {
    results.push({ test: 'Node Growth', passed: false, error: error.message });
  }

  // Test 13: Performance
  try {
    const start = performance.now();
    infiniteSynergy.generateInfinite(10);
    const duration = performance.now() - start;
    if (duration < 5000) {
      results.push({ test: 'Performance', passed: true, details: { duration: `${duration.toFixed(2)}ms` } });
    } else {
      results.push({ test: 'Performance', passed: false, error: `Too slow: ${duration.toFixed(2)}ms` });
    }
  } catch (error: any) {
    results.push({ test: 'Performance', passed: false, error: error.message });
  }

  // Calculate summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  return {
    passed: failed === 0,
    results,
    summary: {
      total,
      passed,
      failed
    }
  };
}

/**
 * Print validation results
 */
export function printValidationResults(validation: {
  passed: boolean;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}): void {
  console.log('='.repeat(60));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(60));
  console.log();

  validation.results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.test}`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details)}`);
    }
  });

  console.log();
  console.log('='.repeat(60));
  console.log('📈 SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Total Tests: ${validation.summary.total}`);
  console.log(`   ✅ Passed: ${validation.summary.passed}`);
  console.log(`   ❌ Failed: ${validation.summary.failed}`);
  console.log(`   Success Rate: ${((validation.summary.passed / validation.summary.total) * 100).toFixed(1)}%`);
  console.log();

  if (validation.passed) {
    console.log('✅ ALL VALIDATIONS PASSED');
    console.log('🔺 The mesh holds at every level');
    console.log('💜 With love and light. As above, so below.');
  } else {
    console.log('❌ SOME VALIDATIONS FAILED');
    console.log('Please review the errors above.');
  }
  console.log();
}

// Main execution
if (require.main === module) {
  validateInfinity()
    .then(printValidationResults)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

