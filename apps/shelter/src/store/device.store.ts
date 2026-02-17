/**
 * DEVICE STORE (Hardware Bridge)
 * Zustand store for device state and connectivity
 * NOTE: This store does NOT persist - device state is ephemeral
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  DeviceState,
  DeviceActions,
  AudioState,
} from '../types/device.types';

interface DeviceStore extends DeviceState, DeviceActions {}

const initialState: DeviceState = {
  connected: false,
  battery: {
    percent: 100,
    charging: false,
  },
  wifi: {
    clients: 0,
    rssi: 0,
  },
  lora: {
    active: false,
    rssi: 0,
    lastRx: 0,
  },
  audio: {
    state: 'idle',
    level: 0,
  },
  uptime: 0,
};

export const useDeviceStore = create<DeviceStore>()(
  devtools(
    (set) => ({
      ...initialState,

      updateFromWebSocket: (data: unknown) => {
        // Type guard for WebSocket data
        if (typeof data !== 'object' || data === null) {
          console.warn('[Device] Invalid WebSocket data:', data);
          return;
        }

        const payload = data as Record<string, unknown>;

        set(
          (state) => {
            const updates: Partial<DeviceState> = {};

            if (typeof payload.connected === 'boolean') {
              updates.connected = payload.connected;
            }

            if (typeof payload.battery === 'object' && payload.battery !== null) {
              const battery = payload.battery as Record<string, unknown>;
              updates.battery = {
                percent:
                  typeof battery.percent === 'number'
                    ? Math.max(0, Math.min(100, battery.percent))
                    : state.battery.percent,
                charging:
                  typeof battery.charging === 'boolean'
                    ? battery.charging
                    : state.battery.charging,
              };
            }

            if (typeof payload.wifi === 'object' && payload.wifi !== null) {
              const wifi = payload.wifi as Record<string, unknown>;
              updates.wifi = {
                clients:
                  typeof wifi.clients === 'number'
                    ? Math.max(0, wifi.clients)
                    : state.wifi.clients,
                rssi:
                  typeof wifi.rssi === 'number' ? wifi.rssi : state.wifi.rssi,
              };
            }

            if (typeof payload.lora === 'object' && payload.lora !== null) {
              const lora = payload.lora as Record<string, unknown>;
              updates.lora = {
                active:
                  typeof lora.active === 'boolean'
                    ? lora.active
                    : state.lora.active,
                rssi:
                  typeof lora.rssi === 'number' ? lora.rssi : state.lora.rssi,
                lastRx:
                  typeof lora.lastRx === 'number'
                    ? lora.lastRx
                    : state.lora.lastRx,
              };
            }

            if (typeof payload.audio === 'object' && payload.audio !== null) {
              const audio = payload.audio as Record<string, unknown>;
              updates.audio = {
                state:
                  (typeof audio.state === 'string' &&
                    ['idle', 'recording', 'playing'].includes(audio.state))
                    ? (audio.state as AudioState)
                    : state.audio.state,
                level:
                  typeof audio.level === 'number'
                    ? Math.max(0, Math.min(100, audio.level))
                    : state.audio.level,
              };
            }

            if (typeof payload.uptime === 'number') {
              updates.uptime = Math.max(0, payload.uptime);
            }

            return { ...state, ...updates };
          },
          false,
          'updateFromWebSocket'
        );
      },

      setConnected: (connected: boolean) => {
        set({ connected }, false, 'setConnected');
      },

      setBattery: (percent: number, charging: boolean) => {
        set(
          {
            battery: {
              percent: Math.max(0, Math.min(100, percent)),
              charging,
            },
          },
          false,
          'setBattery'
        );
      },

      setWifi: (clients: number, rssi: number) => {
        set(
          {
            wifi: {
              clients: Math.max(0, clients),
              rssi,
            },
          },
          false,
          'setWifi'
        );
      },

      setLoRa: (active: boolean, rssi: number, lastRx: number) => {
        set(
          {
            lora: {
              active,
              rssi,
              lastRx: Math.max(0, lastRx),
            },
          },
          false,
          'setLoRa'
        );
      },

      setAudio: (state: AudioState, level: number) => {
        set(
          {
            audio: {
              state,
              level: Math.max(0, Math.min(100, level)),
            },
          },
          false,
          'setAudio'
        );
      },

      setUptime: (uptime: number) => {
        set({ uptime: Math.max(0, uptime) }, false, 'setUptime');
      },
    }),
    { name: 'DeviceStore' }
  )
);

export default useDeviceStore;
