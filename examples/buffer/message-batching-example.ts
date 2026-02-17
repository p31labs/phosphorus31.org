/**
 * The Buffer Message Batching Example
 * 
 * Demonstrates efficient message batching with The Buffer.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { BufferClient } from '@p31/buffer';

const buffer = new BufferClient({
  url: process.env.BUFFER_URL || 'http://localhost:4000',
});

/**
 * Example: Efficient message batching
 * 
 * The Buffer automatically batches messages within a 60-second window.
 * This example shows how to leverage batching for optimal performance.
 */
class MessageBatcher {
  private buffer: BufferClient;
  private pendingMessages: Array<{ message: string; priority: string }> = [];

  constructor(buffer: BufferClient) {
    this.buffer = buffer;
  }

  /**
   * Add message to batch
   */
  async addMessage(message: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') {
    this.pendingMessages.push({ message, priority });
    
    // If batch is full, submit immediately
    if (this.pendingMessages.length >= 100) {
      return await this.flush();
    }
    
    // Otherwise, wait for automatic batching
    return { batched: true, count: this.pendingMessages.length };
  }

  /**
   * Flush pending messages
   */
  async flush() {
    if (this.pendingMessages.length === 0) {
      return { success: true, count: 0 };
    }

    const results = await Promise.all(
      this.pendingMessages.map(msg =>
        this.buffer.submitMessage({
          message: msg.message,
          priority: msg.priority as any,
        })
      )
    );

    const count = this.pendingMessages.length;
    this.pendingMessages = [];

    return { success: true, count, results };
  }
}

// Example usage
async function batchExample() {
  const batcher = new MessageBatcher(buffer);

  // Add multiple messages
  for (let i = 0; i < 50; i++) {
    await batcher.addMessage(`Message ${i}`, 'normal');
  }

  // Flush when ready
  const result = await batcher.flush();
  console.log(`Batched ${result.count} messages`);
}

export { MessageBatcher, batchExample };
