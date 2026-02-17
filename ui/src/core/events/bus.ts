// Minimal event bus implementation for Genesis Gate
// TODO: Replace with full implementation if needed

export const EVENTS = {
  'genesis:bootstrap:complete': 'genesis:bootstrap:complete',
} as const;

class EventBus {
  private listeners: Map<string, Array<(data?: any) => void>> = new Map();

  emit(event: string, data?: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  on(event: string, handler: (data?: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: (data?: any) => void): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
}

export const GenesisEventBus = new EventBus();
