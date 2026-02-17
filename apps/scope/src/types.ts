/** Message from Shelter GET /history */
export interface HistoryMessage {
  id: string
  message: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  metadata: Record<string, unknown>
  timestamp: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'released'
  /** Processed summary (default view). Falls back to message if absent. */
  kernel?: string
  /** Raw/original content. Shown behind "Show original" toggle. */
  original?: string
}

export interface HistoryResponse {
  messages: HistoryMessage[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/** Accommodation log entry from Shelter GET /accommodation-log (PII-free; no message content or names) */
export interface AccommodationRecord {
  timestamp: string
  event_type: string
  signal: string
  voltage_before: string
  voltage_after: string
  source: string
  accommodation_type: string
}

/** Sprout signal with optional urgency (from WS) */
export interface SproutSignalPayload {
  signal: string
  timestamp?: string
  urgency?: 'low' | 'medium' | 'high'
}
