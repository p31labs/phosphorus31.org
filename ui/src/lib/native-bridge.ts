/**
 * Native Bridge (Stub)
 * TODO: Implement native bridge functionality for platform integration
 */

export interface NativeBridge {
  platform: string;
  version: string;
}

export const nativeBridge: NativeBridge = {
  platform: 'web',
  version: '1.0.0',
};

export function getPlatformInfo(): NativeBridge {
  return nativeBridge;
}

export function isNative(): boolean {
  return false;
}

export function getPlatform(): string {
  return 'web';
}
