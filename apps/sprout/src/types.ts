/**
 * Sprout signal types. Matches @p31/protocol signal semantics.
 * Sent to Shelter as type "sprout:signal".
 */
export type SproutSignal = 'ok' | 'break' | 'hug' | 'help'

export interface SproutSignalPayload {
  type: 'sprout:signal'
  signal: SproutSignal
  timestamp: string
}
