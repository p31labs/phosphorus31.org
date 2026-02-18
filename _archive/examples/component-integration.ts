/**
 * P31 Complete Component Integration Example
 * 
 * Demonstrates how all P31 components work together.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { CentaurClient } from '@p31/centaur';
import { BufferClient } from '@p31/buffer';
import { ScopeClient } from '@p31/scope';
import { QuantumSOPGenerator } from '@p31/centaur/quantum-brain';

/**
 * Complete P31 Integration
 * 
 * Shows the full flow: User → The Scope → The Buffer → The Centaur → AI → Response
 */
class P31Integration {
  private centaur: CentaurClient;
  private buffer: BufferClient;
  private scope: ScopeClient;
  private sopGenerator: QuantumSOPGenerator;

  constructor() {
    this.centaur = new CentaurClient({
      url: process.env.CENTAUR_URL || 'http://localhost:3000',
    });

    this.buffer = new BufferClient({
      url: process.env.BUFFER_URL || 'http://localhost:4000',
    });

    this.scope = new ScopeClient({
      url: process.env.SCOPE_URL || 'http://localhost:5173',
    });
  }

  /**
   * Complete workflow: User message → AI response
   */
  async completeWorkflow(userMessage: string) {
    console.log('🔺 P31 Complete Integration Workflow\n');

    // 1. User submits message through The Scope
    console.log('1️⃣ User submits message through The Scope...');
    const scopeMessage = await this.scope.submitMessage({
      message: userMessage,
      source: 'user',
    });
    console.log('✅ Message submitted to The Scope\n');

    // 2. The Scope forwards to The Buffer
    console.log('2️⃣ The Scope forwards to The Buffer...');
    const bufferResult = await this.buffer.submitMessage({
      message: userMessage,
      priority: 'normal',
      metadata: {
        source: 'scope',
        scopeMessageId: scopeMessage.id,
      },
    });
    console.log(`✅ Message queued in The Buffer: ${bufferResult.messageId}\n`);

    // 3. The Buffer processes and forwards to The Centaur
    console.log('3️⃣ The Buffer processes message...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    const bufferStatus = await this.buffer.getMessageStatus(bufferResult.messageId);
    console.log(`✅ Buffer status: ${bufferStatus.status}\n`);

    // 4. The Centaur processes with AI
    console.log('4️⃣ The Centaur processes with AI...');
    const aiResponse = await this.centaur.chat({
      message: userMessage,
      context: {
        userId: 'user-123',
        sessionId: 'session-456',
      },
    });
    console.log(`✅ AI Response: ${aiResponse.message.substring(0, 100)}...\n`);

    // 5. Response flows back through The Buffer
    console.log('5️⃣ Response flows back through The Buffer...');
    await this.buffer.submitMessage({
      message: aiResponse.message,
      priority: 'normal',
      metadata: {
        source: 'centaur',
        originalMessageId: bufferResult.messageId,
      },
    });
    console.log('✅ Response queued in The Buffer\n');

    // 6. The Scope displays response
    console.log('6️⃣ The Scope displays response...');
    await this.scope.updateDisplay({
      message: aiResponse.message,
      status: 'complete',
    });
    console.log('✅ Response displayed in The Scope\n');

    return {
      userMessage,
      aiResponse: aiResponse.message,
      bufferMessageId: bufferResult.messageId,
    };
  }

  /**
   * Generate SOP and process through system
   */
  async generateAndProcessSOP(context: any) {
    console.log('📋 Generating SOP through P31 system...\n');

    // Generate SOP using Quantum SOP Generator
    const sop = await this.sopGenerator.generateSOP(context);
    console.log(`✅ SOP Generated: ${sop.id}\n`);

    // Submit SOP through The Buffer
    const bufferResult = await this.buffer.submitMessage({
      message: JSON.stringify(sop),
      priority: 'high',
      metadata: {
        type: 'sop',
        sopId: sop.id,
      },
    });

    // Process through The Centaur
    const processed = await this.centaur.processSOP(sop.id);

    return {
      sop,
      processed,
      bufferMessageId: bufferResult.messageId,
    };
  }

  /**
   * Monitor system health across all components
   */
  async monitorSystemHealth() {
    console.log('🏥 Monitoring P31 system health...\n');

    const [centaurHealth, bufferHealth, scopeHealth] = await Promise.all([
      this.centaur.health(),
      this.buffer.health(),
      this.scope.health(),
    ]);

    const allHealthy = 
      centaurHealth.status === 'healthy' &&
      bufferHealth.status === 'healthy' &&
      scopeHealth.status === 'healthy';

    console.log('The Centaur:', centaurHealth.status);
    console.log('The Buffer:', bufferHealth.status);
    console.log('The Scope:', scopeHealth.status);
    console.log(`\n${allHealthy ? '✅' : '⚠️'} System Status: ${allHealthy ? 'All Healthy' : 'Degraded'}\n`);

    return {
      centaur: centaurHealth,
      buffer: bufferHealth,
      scope: scopeHealth,
      allHealthy,
    };
  }
}

// Example usage
async function main() {
  const integration = new P31Integration();

  // Complete workflow
  await integration.completeWorkflow('What is P31?');

  // Monitor health
  await integration.monitorSystemHealth();

  console.log('🎉 P31 Integration Complete!');
  console.log('\n💜 The Mesh Holds. 🔺\n');
  console.log('With love and light. As above, so below. 💜\n');
}

if (require.main === module) {
  main().catch(console.error);
}

export { P31Integration };
