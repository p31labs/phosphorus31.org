/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Buffer Store (Catcher's Mitt)
 * Message buffering to prevent amygdala hijack
 *
 * The 60-second delay prevents the "Machine Gun Effect" of rapid-fire messages
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BufferState, BufferActions, StoreBufferedMessage, ProcessedMessage } from '../types';
import { VoltageConfig } from '../config/god.config';

interface BufferStore extends BufferState, BufferActions {}

export const useBufferStore = create<BufferStore>()(
  devtools(
    (set, get) => ({
      buffer: [],
      isBatching: false,

      /**
       * Add message to buffer with appropriate release time
       */
      addToBuffer: (message: ProcessedMessage) => {
        const now = new Date();
        const { voltage } = message;

        // Determine priority and release time based on voltage
        // Default: 60 second buffer (catcher's mitt delay)
        const minBufferMs = 60000;
        let priority: StoreBufferedMessage['priority'] = 'medium';
        let delayMs: number = minBufferMs;

        if (voltage.score >= VoltageConfig.high.threshold) {
          priority = 'high';
          delayMs = minBufferMs * 2; // Double delay for high voltage
        } else if (voltage.score <= VoltageConfig.low.threshold) {
          priority = 'low';
          delayMs = minBufferMs / 2; // Half delay for safe messages
        }

        // Check if this is a bypass event (e.g., quantum anomaly)
        if (message.raw.source === 'mesh' && message.raw.metadata?.bypass) {
          priority = 'bypass';
          delayMs = 0;
        }

        const releaseAt = new Date(now.getTime() + delayMs);

        const bufferedMessage: StoreBufferedMessage = {
          message,
          bufferedAt: now,
          releaseAt,
          priority,
        };

        set((state) => ({
          buffer: [...state.buffer, bufferedMessage],
          isBatching: true,
        }));

        // Schedule release check
        setTimeout(() => {
          const { buffer } = get();
          const readyCount = buffer.filter((b) => new Date() >= b.releaseAt).length;

          if (readyCount > 0) {
            // Could emit an event here for UI notification
            console.log(`[Catcher's Mitt] ${readyCount} message(s) ready for review`);
          }
        }, delayMs);
      },

      /**
       * Release a specific message from buffer
       */
      releaseMessage: (id: string) => {
        set((state) => ({
          buffer: state.buffer.filter((b) => b.message.id !== id),
          isBatching: state.buffer.length > 1,
        }));
      },

      /**
       * Get all messages that are ready (past their release time)
       */
      getReadyMessages: (): StoreBufferedMessage[] => {
        const now = new Date();
        return get().buffer.filter((b) => now >= b.releaseAt);
      },

      /**
       * Clear all buffered messages
       */
      clearBuffer: () => {
        set({ buffer: [], isBatching: false });
      },
    }),
    { name: 'BufferStore' }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTOR HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get count of buffered messages */
export const useBufferCount = () => useBufferStore((state) => state.buffer.length);

/** Get count of ready messages */
export const useReadyCount = () =>
  useBufferStore((state) => {
    const now = new Date();
    return state.buffer.filter((b: StoreBufferedMessage) => now >= b.releaseAt).length;
  });

/** Check if any high-priority messages are buffered */
export const useHasHighPriority = () =>
  useBufferStore((state) => state.buffer.some((b) => b.priority === 'high'));

/** Get bypass messages (immediate attention required) */
export const useBypassMessages = () =>
  useBufferStore((state) => state.buffer.filter((b) => b.priority === 'bypass'));

/** Get time until next message is ready */
export const useNextReleaseTime = () =>
  useBufferStore((state) => {
    const now = new Date();
    const pending = state.buffer
      .filter((b: StoreBufferedMessage) => b.releaseAt > now)
      .sort(
        (a: StoreBufferedMessage, b: StoreBufferedMessage) =>
          a.releaseAt.getTime() - b.releaseAt.getTime()
      );

    if (pending.length === 0) return null;
    return pending[0].releaseAt;
  });

/** Get buffer grouped by priority */
export const useBufferByPriority = () =>
  useBufferStore((state) => ({
    bypass: state.buffer.filter((b: StoreBufferedMessage) => b.priority === 'bypass'),
    high: state.buffer.filter((b: StoreBufferedMessage) => b.priority === 'high'),
    medium: state.buffer.filter((b: StoreBufferedMessage) => b.priority === 'medium'),
    low: state.buffer.filter((b: StoreBufferedMessage) => b.priority === 'low'),
  }));

/**
 * Submit message to P31 Buffer backend
 */
export const useSubmitToBuffer = () => {
  return async (message: string, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal') => {
    try {
      const { bufferService } = await import('../services/buffer.service');
      const result = await bufferService.submitMessage({ message, priority });
      return result;
    } catch (error) {
      console.error('Failed to submit to Buffer:', error);
      throw error;
    }
  };
};
