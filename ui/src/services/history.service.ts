// History Service
// Simple history management for the UI

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: 'message' | 'analysis' | 'system';
  content: any;
  metadata?: Record<string, any>;
}

export class HistoryService {
  private history: HistoryEntry[] = [];
  private maxSize: number = 1000;

  constructor(maxSize?: number) {
    if (maxSize) {
      this.maxSize = maxSize;
    }
  }

  addEntry(type: HistoryEntry['type'], content: any, metadata?: Record<string, any>): void {
    const entry: HistoryEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      content,
      metadata,
    };

    this.history.push(entry);

    // Keep only the last maxSize entries
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(-this.maxSize);
    }
  }

  getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  getHistoryByType(type: HistoryEntry['type']): HistoryEntry[] {
    return this.history.filter((entry) => entry.type === type);
  }

  clearHistory(): void {
    this.history = [];
  }

  exportHistory(): string {
    return JSON.stringify(this.history, null, 2);
  }

  importHistory(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        this.history = parsed;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }

  /**
   * Get messages with optional filter (for MessageHistory component)
   */
  getMessages(filter?: { searchText?: string; type?: HistoryEntry['type'] }): HistoryEntry[] {
    let filtered = this.history;

    if (filter?.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      filtered = filtered.filter((entry) =>
        JSON.stringify(entry.content).toLowerCase().includes(searchLower)
      );
    }

    if (filter?.type) {
      filtered = filtered.filter((entry) => entry.type === filter.type);
    }

    return filtered;
  }
}

// Export filter type for components
export interface HistoryFilter {
  searchText?: string;
  type?: HistoryEntry['type'];
}

// Create a singleton instance
export const historyService = new HistoryService();
export default historyService;
