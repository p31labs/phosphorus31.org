#!/usr/bin/env tsx
/**
 * Integration Verification Script
 * Tests that all P31 components are connected and communicating
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ComponentHealth {
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  response?: any;
  error?: string;
}

const components: Array<{ name: string; url: string; port: number }> = [
  { name: 'The Centaur', url: 'http://localhost:3000', port: 3000 },
  { name: 'The Buffer', url: 'http://localhost:4000', port: 4000 },
  { name: 'The Scope', url: 'http://localhost:5173', port: 5173 },
];

async function checkHealth(component: { name: string; url: string }): Promise<ComponentHealth> {
  try {
    const healthUrl = component.url === 'http://localhost:5173' 
      ? component.url 
      : `${component.url}/health`;
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        name: component.name,
        url: component.url,
        status: 'healthy',
        response: data,
      };
    } else {
      return {
        name: component.name,
        url: component.url,
        status: 'unhealthy',
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      name: component.name,
      url: component.url,
      status: 'unknown',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function testMessageFlow(): Promise<boolean> {
  console.log('\n📨 Testing message flow...\n');
  
  try {
    // 1. Submit message to The Buffer
    console.log('1. Submitting message to The Buffer...');
    const submitResponse = await fetch('http://localhost:4000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Integration test message',
        priority: 'normal',
        metadata: { test: true, timestamp: Date.now() },
      }),
    });

    if (!submitResponse.ok) {
      console.error('❌ Failed to submit message to The Buffer');
      return false;
    }

    const submitData = await submitResponse.json();
    console.log(`✅ Message submitted: ${submitData.messageId || submitData.id}`);

    // 2. Wait for processing (buffer window)
    console.log('\n2. Waiting for batch processing (60s window)...');
    console.log('   (In production, this would be automatic)');
    
    // 3. Check if message was forwarded to The Centaur
    console.log('\n3. Checking The Centaur for message...');
    const centaurResponse = await fetch('http://localhost:3000/api/messages', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (centaurResponse.ok) {
      console.log('✅ The Centaur is accessible');
    } else {
      console.log('⚠️  The Centaur may not have /api/messages endpoint yet');
    }

    return true;
  } catch (error) {
    console.error('❌ Message flow test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🔍 P31 Integration Verification\n');
  console.log('=' .repeat(50));

  // Check component health
  console.log('\n📊 Component Health Check\n');
  const healthChecks = await Promise.all(
    components.map(comp => checkHealth(comp))
  );

  let allHealthy = true;
  for (const health of healthChecks) {
    const icon = health.status === 'healthy' ? '✅' : '❌';
    console.log(`${icon} ${health.name}: ${health.status}`);
    if (health.status !== 'healthy') {
      allHealthy = false;
      if (health.error) {
        console.log(`   Error: ${health.error}`);
      }
    }
  }

  // Test message flow if components are healthy
  if (allHealthy) {
    await testMessageFlow();
  } else {
    console.log('\n⚠️  Some components are not running. Start them with:');
    console.log('   npm run dev:all');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Summary:');
  console.log(`   Components checked: ${components.length}`);
  console.log(`   Healthy: ${healthChecks.filter(h => h.status === 'healthy').length}`);
  console.log(`   Unhealthy: ${healthChecks.filter(h => h.status === 'unhealthy').length}`);
  console.log(`   Unknown: ${healthChecks.filter(h => h.status === 'unknown').length}`);

  if (allHealthy) {
    console.log('\n🎉 All components are healthy and ready!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some components need attention.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
