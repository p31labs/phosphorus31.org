/**
 * @p31/protocol — L.O.V.E. economy (Ledger of Ontological Volume and Entropy).
 * Transaction types and minimal message shape. Full engine in Phase 3.
 */

export const LOVE_TRANSACTION_TYPES = [
  'BLOCK_PLACED',
  'COHERENCE_GIFT',
  'ARTIFACT_CREATED',
  'CARE_RECEIVED',
  'CARE_GIVEN',
  'TETRAHEDRON_BOND',
  'VOLTAGE_CALMED',
  'MILESTONE_REACHED',
  'PING',
  'DONATION',
] as const;

export type LoveTransactionType = (typeof LOVE_TRANSACTION_TYPES)[number];

export interface LoveTransaction {
  type: LoveTransactionType;
  amount: number;
  from?: string;
  to?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
