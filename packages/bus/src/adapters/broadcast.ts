/**
 * BroadcastChannel adapter for @p31labs/bus
 *
 * Provides instant cross-tab message passing. Faster than storage
 * events for high-frequency state updates (spoon changes, voltage).
 */

export class BroadcastAdapter {
  private channel: BroadcastChannel | null = null;
  private onMessageCallback?: (key: string, value: unknown) => void;

  constructor(channelName: string) {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(channelName);
      this.channel.onmessage = (event: MessageEvent) => {
        const { key, value } = event.data;
        if (typeof key === 'string') {
          this.onMessageCallback?.(key, value);
        }
      };
    }
  }

  send(key: string, value: unknown): void {
    this.channel?.postMessage({ key, value });
  }

  onMessage(callback: (key: string, value: unknown) => void): void {
    this.onMessageCallback = callback;
  }

  destroy(): void {
    this.channel?.close();
    this.channel = null;
  }
}
