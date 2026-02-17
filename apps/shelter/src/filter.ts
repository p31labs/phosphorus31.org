/**
 * Message Filter - Neurodivergent-first message processing
 * Filters and processes messages based on voltage, priority, and context
 */

import { QueuedMessage } from './queue.js';
// Logger reserved for future use
// import { Logger } from './utils/logger';

export interface FilterResult {
  shouldProcess: boolean;
  priority: QueuedMessage['priority'];
  reason: string;
  metadata: Record<string, any>;
}

export class MessageFilter {
  // Logger reserved for future use
  // private logger: Logger;

  constructor() {
    // this.logger = new Logger('MessageFilter');
  }

  /**
   * Filter message based on content, context, and neurodivergent considerations
   */
  filter(message: QueuedMessage): FilterResult {
    const content = message.message.toLowerCase();
    const metadata = message.metadata || {};

    // Check for urgent keywords (LAUNCH-01: crisis-tier)
    const urgentKeywords = ['emergency', 'urgent', 'help', 'danger', 'critical', 'attorney', 'lawyer', 'court', 'deadline'];
    const hasUrgentKeyword = urgentKeywords.some(keyword => content.includes(keyword));

    // Check for high voltage indicators
    const highVoltageKeywords = ['overwhelmed', 'shutdown', 'meltdown', 'overstimulated', 'always', 'never', 'ignore'];
    const hasHighVoltage = highVoltageKeywords.some(keyword => content.includes(keyword));

    // All-caps ratio (e.g. "I NEED the documents NOW") — high voltage
    const capsRatio = (content.match(/[A-Z]/g)?.length ?? 0) / Math.max(content.length, 1);
    const excessiveCaps = capsRatio > 0.3;

    // Check for safe/low voltage indicators
    const safeKeywords = ['ok', 'fine', 'good', 'stable', 'calm'];
    const hasSafeKeyword = safeKeywords.some(keyword => content.includes(keyword));

    // Determine priority
    let priority: QueuedMessage['priority'] = message.priority;
    let reason = 'Normal processing';

    if (hasUrgentKeyword && (hasHighVoltage || excessiveCaps)) {
      priority = 'urgent';
      reason = 'Crisis-tier: urgent + high voltage or caps';
    } else if (hasUrgentKeyword || hasHighVoltage || excessiveCaps) {
      priority = priority === 'low' ? 'normal' : (priority === 'normal' ? 'high' : 'urgent');
      reason = hasUrgentKeyword ? 'Urgent keyword' : hasHighVoltage ? 'High voltage keyword' : 'Excessive caps';
    } else if (hasSafeKeyword && priority === 'normal') {
      priority = 'low';
      reason = 'Safe keyword detected';
    }

    // Check message length (very long messages might need batching)
    const needsBatching = message.message.length > 1000;
    if (needsBatching) {
      metadata.needsBatching = true;
      metadata.originalLength = message.message.length;
    }

    // Check for repetitive patterns (might indicate overwhelm)
    const repetitivePattern = this.detectRepetition(message.message);
    if (repetitivePattern) {
      metadata.repetitive = true;
      if (priority === 'normal') {
        priority = 'high';
        reason = 'Repetitive pattern detected - possible overwhelm';
      }
    }

    // Always process, but with adjusted priority
    return {
      shouldProcess: true,
      priority,
      reason,
      metadata: {
        ...metadata,
        filteredAt: new Date().toISOString(),
        originalPriority: message.priority,
      },
    };
  }

  /**
   * Detect repetitive patterns in message (sign of overwhelm)
   */
  private detectRepetition(message: string): boolean {
    const words = message.toLowerCase().split(/\s+/);
    if (words.length < 5) return false;

    // Check for repeated words
    const wordCounts = new Map<string, number>();
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }

    // If any word appears more than 30% of the time, it's repetitive
    const threshold = words.length * 0.3;
    for (const count of wordCounts.values()) {
      if (count > threshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Process message batch - group similar messages, detect patterns
   */
  processBatch(messages: QueuedMessage[]): QueuedMessage[] {
    // Group by priority
    const grouped = new Map<QueuedMessage['priority'], QueuedMessage[]>();
    
    for (const message of messages) {
      const filtered = this.filter(message);
      const priority = filtered.priority;
      
      if (!grouped.has(priority)) {
        grouped.set(priority, []);
      }
      
      // Update message with filter results
      const processed: QueuedMessage = {
        ...message,
        priority,
        metadata: {
          ...message.metadata,
          ...filtered.metadata,
        },
      };
      
      grouped.get(priority)!.push(processed);
    }

    // Flatten back to array, ordered by priority
    const result: QueuedMessage[] = [];
    const priorityOrder: QueuedMessage['priority'][] = ['urgent', 'high', 'normal', 'low'];
    
    for (const priority of priorityOrder) {
      const group = grouped.get(priority);
      if (group) {
        result.push(...group);
      }
    }

    return result;
  }
}
