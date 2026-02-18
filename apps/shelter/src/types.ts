export interface AIRewriteResult {
  neutral_rewrite: string;
  emotional_subtext: string;
  action_items: string[];
  suggested_response: string;
}

export interface QueueItem {
  id: number;
  text: string;
  voltage: number;
  gate: string;
  timestamp: number;
}

export interface SessionRecord {
  id?: number;
  timestamp: number;
  voltage: number;
  gate: string;
  processed: boolean;
}
