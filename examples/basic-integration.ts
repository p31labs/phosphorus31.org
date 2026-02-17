/**
 * P31 Basic Integration Example
 * 
 * This example shows how to integrate The Centaur, The Buffer, and The Scope
 * in a basic application flow.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { CentaurClient } from '@p31/centaur';
import { BufferClient } from '@p31/buffer';
import { ScopeClient } from '@p31/scope';

// Initialize clients
const centaur = new CentaurClient({
  url: process.env.CENTAUR_URL || 'http://localhost:3000',
  apiKey: process.env.CENTAUR_API_KEY,
});

const buffer = new BufferClient({
  url: process.env.BUFFER_URL || 'http://localhost:4000',
});

const scope = new ScopeClient({
  url: process.env.SCOPE_URL || 'http://localhost:5173',
});

/**
 * Example: Submit message through The Buffer to The Centaur
 */
async function submitMessage(message: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') {
  try {
    // Submit to The Buffer
    const bufferResult = await buffer.submitMessage({
      message,
      priority,
      metadata: {
        source: 'example-app',
        timestamp: new Date().toISOString(),
      },
    });

    console.log('Message submitted to The Buffer:', bufferResult.messageId);

    // The Buffer processes and forwards to The Centaur
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check message status
    const status = await buffer.getMessageStatus(bufferResult.messageId);
    console.log('Message status:', status);

    return bufferResult;
  } catch (error) {
    console.error('Error submitting message:', error);
    throw error;
  }
}

/**
 * Example: Get AI response from The Centaur
 */
async function getAIResponse(prompt: string) {
  try {
    const response = await centaur.chat({
      message: prompt,
      context: {
        userId: 'user-123',
        sessionId: 'session-456',
      },
    });

    console.log('AI Response:', response.message);
    return response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
}

/**
 * Example: Monitor system health
 */
async function checkSystemHealth() {
  try {
    const [centaurHealth, bufferHealth] = await Promise.all([
      centaur.health(),
      buffer.health(),
    ]);

    console.log('The Centaur health:', centaurHealth.status);
    console.log('The Buffer health:', bufferHealth.status);

    return {
      centaur: centaurHealth,
      buffer: bufferHealth,
      allHealthy: centaurHealth.status === 'healthy' && bufferHealth.status === 'healthy',
    };
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}

/**
 * Example: Complete workflow
 */
async function completeWorkflow() {
  console.log('🔺 Starting P31 workflow...\n');

  // 1. Check system health
  console.log('1. Checking system health...');
  const health = await checkSystemHealth();
  if (!health.allHealthy) {
    throw new Error('System not healthy');
  }
  console.log('✅ System healthy\n');

  // 2. Submit message
  console.log('2. Submitting message...');
  const messageResult = await submitMessage('Hello from P31!', 'normal');
  console.log('✅ Message submitted\n');

  // 3. Get AI response
  console.log('3. Getting AI response...');
  const aiResponse = await getAIResponse('What is P31?');
  console.log('✅ AI response received\n');

  console.log('🎉 Workflow complete!');
  console.log('\n💜 The Mesh Holds. 🔺\n');
}

// Run example
if (require.main === module) {
  completeWorkflow().catch(console.error);
}

export { submitMessage, getAIResponse, checkSystemHealth, completeWorkflow };
