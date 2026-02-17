/**
 * Shield Types
 * Types for shield/message processing components
 */

import type { ProcessedMessage } from './messages';

/**
 * ProcessedPayload is an alias for ProcessedMessage
 * Used in shield components for processed message data
 */
export type ProcessedPayload = ProcessedMessage;

/**
 * LLM Provider configuration
 */
export type LLMProvider = 'openai' | 'anthropic' | 'local' | 'none';
