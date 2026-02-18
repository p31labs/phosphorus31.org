/**
 * Validation Schema Example
 * Use with validateRequest middleware
 */

import { z } from 'zod';

// Example: Create item schema
export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['type1', 'type2', 'type3']),
  metadata: z.record(z.any()).optional()
});

// Example: Update item schema
export const updateItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  type: z.enum(['type1', 'type2', 'type3']).optional(),
  metadata: z.record(z.any()).optional()
});

// Example: Query parameters schema
export const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  filter: z.string().optional()
});
