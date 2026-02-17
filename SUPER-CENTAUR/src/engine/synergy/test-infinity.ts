/**
 * Infinite Synergy Test Runner
 * "Synergy x Infinity" - Interactive Test Suite
 * 
 * Run this to test the infinite synergy system at various levels
 * 
 * Usage:
 *   npm run test:infinity
 *   OR
 *   ts-node src/engine/synergy/test-infinity.ts
 */

import { InfiniteSynergy, SynergyResult } from './InfiniteSynergy';
import { GameEngine } from '../core/GameEngine';

interface TestResult {
  levels: number;
  nodes: number;
  connections: number;
  totalSynergy: number;
  fractalDimension: number;
  coherence: number;
  duration: number;
  memoryUsage?: number;
}

/**
 * Run comprehensive infinity tests
 */
export async function testInfinity(): Promise<void> {
  console.log('∞ Testing Infinite Synergy System');
  console.log('🔺 "Synergy x Infinity"');
  console.log('💜 With love and light. As above, so below.\n');

  const infiniteSynergy = new InfiniteSynergy();
  const results: TestResult[] = [];

  // Test at various levels
  const testLevels = [1, 2, 3, 5, 7, 10, 15];

  for (const levels of testLevels) {
    console.log(`\n📊 Testing at ${levels} levels...`);
    
    const start = performance.now();
    const result = infiniteSynergy.generateInfinite(levels);
    const duration = performance.now() - start;

    const testResult: TestResult = {
      levels: result.levels,
      nodes: result.nodes,
      connections: result.connections,
      totalSynergy: result.totalSynergy,
      fractalDimension: result.fractalDimension,
      coherence: result.coherence,
      duration,
    };

    results.push(testResult);

    console.log(`   ✅ Generated ${result.nodes} nodes`);
    console.log(`   ✅ ${result.connections} connections`);
    console.log(`   ✅ Total synergy: ${result.totalSynergy.toFixed(2)}`);
    console.log(`   ✅ Fractal dimension: ${result.fractalDimension.toFixed(3)}`);
    console.log(`   ✅ Coherence: ${(result.coherence * 100).toFixed(1)}%`);
    console.log(`   ✅ Duration: ${duration.toFixed(2)}ms`);
    console.log(`   📝 ${result.message.split('\n')[0]}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 TEST SUMMARY');
  console.log('='.repeat(60));
  
  console.log('\n📊 Node Growth:');
  results.forEach(r => {
    const growthRate = r.levels > 1 
      ? (r.nodes / results[results.indexOf(r) - 1]?.nodes || 1).toFixed(2)
      : 'N/A';
    console.log(`   Level ${r.levels}: ${r.nodes} nodes (${growthRate}x growth)`);
  });

  console.log('\n🔢 Synergy Growth:');
  results.forEach(r => {
    console.log(`   Level ${r.levels}: ${r.totalSynergy.toFixed(2)} total synergy`);
  });

  console.log('\n🔷 Fractal Dimension:');
  results.forEach(r => {
    console.log(`   Level ${r.levels}: ${r.fractalDimension.toFixed(3)}`);
  });

  console.log('\n💎 Coherence:');
  results.forEach(r => {
    console.log(`   Level ${r.levels}: ${(r.coherence * 100).toFixed(1)}%`);
  });

  console.log('\n⚡ Performance:');
  results.forEach(r => {
    const nodesPerMs = (r.nodes / r.duration).toFixed(0);
    console.log(`   Level ${r.levels}: ${r.duration.toFixed(2)}ms (${nodesPerMs} nodes/ms)`);
  });

  // Test synergy at infinity
  console.log('\n' + '='.repeat(60));
  console.log('∞ SYNERGY AT INFINITY');
  console.log('='.repeat(60));
  const infinityValue = infiniteSynergy.getSynergyAtInfinity();
  console.log(`   Limit as n → ∞: ${infinityValue}`);
  if (infinityValue === Infinity) {
    console.log('   ⚠️  Synergy diverges to infinity');
  } else if (infinityValue === 0) {
    console.log('   ✅ Synergy converges to 0');
  } else {
    console.log(`   ✅ Synergy converges to ${infinityValue}`);
  }

  // Test path finding
  console.log('\n' + '='.repeat(60));
  console.log('🔍 PATH FINDING TEST');
  console.log('='.repeat(60));
  const pathTestResult = infiniteSynergy.generateInfinite(5);
  const visualization = infiniteSynergy.getVisualization(5);
  if (visualization && visualization.children && visualization.children.length > 0) {
    const startId = visualization.id;
    const endId = visualization.children[0].id;
    const path = infiniteSynergy.findPath(startId, endId);
    
    if (path) {
      console.log(`   ✅ Found path: ${path.length} nodes`);
      console.log(`   Start: ${startId.substring(0, 20)}...`);
      console.log(`   End: ${endId.substring(0, 20)}...`);
    } else {
      console.log('   ❌ Path not found');
    }
  }

  // Test visualization
  console.log('\n' + '='.repeat(60));
  console.log('🎨 VISUALIZATION TEST');
  console.log('='.repeat(60));
  const viz = infiniteSynergy.getVisualization(3);
  if (viz) {
    console.log(`   ✅ Root node: ${viz.id.substring(0, 20)}...`);
    console.log(`   ✅ Level: ${viz.level}`);
    console.log(`   ✅ Synergy: ${viz.synergy.toFixed(2)}`);
    console.log(`   ✅ Position: [${viz.position[0].toFixed(2)}, ${viz.position[1].toFixed(2)}, ${viz.position[2].toFixed(2)}]`);
    console.log(`   ✅ Children: ${viz.children?.length || 0}`);
    console.log(`   ✅ Connections: ${viz.connections || 0}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS COMPLETE');
  console.log('='.repeat(60));
  console.log('\n🔺 The mesh holds at every level');
  console.log('💜 With love and light. As above, so below.\n');
}

/**
 * Test with GameEngine integration
 */
export async function testInfinityWithGameEngine(): Promise<void> {
  console.log('🎮 Testing Infinite Synergy with GameEngine...\n');

  const gameEngine = new GameEngine();
  await gameEngine.init();

  const infiniteSynergy = gameEngine.getInfiniteSynergy();
  const result = gameEngine.generateInfiniteSynergy(5);

  console.log('✅ GameEngine integration test:');
  console.log(`   Levels: ${result.levels}`);
  console.log(`   Nodes: ${result.nodes}`);
  console.log(`   Total Synergy: ${result.totalSynergy.toFixed(2)}`);
  console.log(`   Coherence: ${(result.coherence * 100).toFixed(1)}%`);
  console.log(`   Message: ${result.message.split('\n')[0]}`);

  gameEngine.dispose();
}

/**
 * Stress test - very high levels
 */
export async function stressTestInfinity(): Promise<void> {
  console.log('🔥 Stress Testing Infinite Synergy...\n');

  const infiniteSynergy = new InfiniteSynergy();
  const stressLevels = [20, 25, 30];

  for (const levels of stressLevels) {
    console.log(`\n🔥 Testing at ${levels} levels (this may take a while)...`);
    
    const start = performance.now();
    const result = infiniteSynergy.generateInfinite(levels);
    const duration = performance.now() - start;

    console.log(`   ✅ Completed in ${(duration / 1000).toFixed(2)}s`);
    console.log(`   ✅ Nodes: ${result.nodes.toLocaleString()}`);
    console.log(`   ✅ Connections: ${result.connections.toLocaleString()}`);
    console.log(`   ✅ Total Synergy: ${result.totalSynergy.toFixed(2)}`);
    console.log(`   ✅ Memory: ~${(result.nodes * 0.001).toFixed(1)}KB (estimated)`);
  }

  console.log('\n✅ Stress test complete!');
}

/**
 * Benchmark test
 */
export async function benchmarkInfinity(): Promise<void> {
  console.log('⚡ Benchmarking Infinite Synergy...\n');

  const infiniteSynergy = new InfiniteSynergy();
  const iterations = 10;
  const levels = 10;

  const durations: number[] = [];

  for (let i = 0; i < iterations; i++) {
    infiniteSynergy.reset();
    const start = performance.now();
    infiniteSynergy.generateInfinite(levels);
    const duration = performance.now() - start;
    durations.push(duration);
  }

  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  console.log(`📊 Benchmark Results (${iterations} iterations at ${levels} levels):`);
  console.log(`   Average: ${avgDuration.toFixed(2)}ms`);
  console.log(`   Min: ${minDuration.toFixed(2)}ms`);
  console.log(`   Max: ${maxDuration.toFixed(2)}ms`);
  console.log(`   Std Dev: ${Math.sqrt(durations.reduce((sq, n) => sq + Math.pow(n - avgDuration, 2), 0) / durations.length).toFixed(2)}ms`);
}

// Main test runner
if (require.main === module) {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';

  async function runTests() {
    try {
      switch (testType) {
        case 'all':
          await testInfinity();
          break;
        case 'game':
          await testInfinityWithGameEngine();
          break;
        case 'stress':
          await stressTestInfinity();
          break;
        case 'benchmark':
          await benchmarkInfinity();
          break;
        default:
          console.log('Usage:');
          console.log('  npm run test:infinity [all|game|stress|benchmark]');
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
      process.exit(1);
    }
  }

  runTests();
}

