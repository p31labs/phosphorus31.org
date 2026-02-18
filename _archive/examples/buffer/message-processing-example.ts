/**
 * The Buffer Message Processing Example
 * 
 * Complete example of message processing with The Buffer.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { BufferClient } from '@p31/buffer';

const buffer = new BufferClient({
  url: process.env.BUFFER_URL || 'http://localhost:4000',
});

// Example: Submit message
async function submitMessage(message: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') {
  const result = await buffer.submitMessage({
    message,
    priority,
    metadata: {
      source: 'example-app',
      timestamp: new Date().toISOString(),
    },
  });
  
  return result;
}

// Example: Batch messages
async function batchMessages(messages: string[]) {
  const results = await Promise.all(
    messages.map(msg => buffer.submitMessage({
      message: msg,
      priority: 'normal',
    }))
  );
  
  return results;
}

// Example: Get message status
async function getMessageStatus(messageId: string) {
  const status = await buffer.getMessageStatus(messageId);
  return status;
}

// Example: Monitor queue
async function monitorQueue() {
  const status = await buffer.getQueueStatus();
  console.log('Queue length:', status.queueLength);
  console.log('Processing:', status.processing);
  return status;
}

// Example: Complete workflow
async function messageWorkflow() {
  // 1. Submit message
  const result = await submitMessage('Hello from P31', 'normal');
  
  // 2. Wait for processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. Check status
  const status = await getMessageStatus(result.messageId);
  
  // 4. Monitor queue
  const queueStatus = await monitorQueue();
  
  return { result, status, queueStatus };
}

export { submitMessage, batchMessages, getMessageStatus, monitorQueue, messageWorkflow };
