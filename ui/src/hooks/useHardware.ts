/**
 * useHardware — WebUSB connection to P31 Node One (ESP32-S3)
 *
 * Provides ground reference for the Floating Neutral indicator.
 * When connected, the hardware root of trust is available (DRV2605L haptics, SE050, etc.).
 */

import { useState, useCallback, useEffect } from 'react';

/** ESP32-S3 / Node One USB identifiers (Espressif VID; PID TBD for P31 device) */
const NODE_ONE_FILTER = { vendorId: 0x303a }; // Espressif; add productId when P31 device is fixed

export interface UseHardwareResult {
  /** Whether a compatible device is connected and opened */
  connected: boolean;
  /** WebUSB is not available (e.g. insecure context or no support) */
  unsupported: boolean;
  /** User denied or device disconnected */
  error: string | null;
  /** Request device picker (user must choose device). Only works in response to user gesture. */
  requestConnection: () => Promise<void>;
  /** Disconnect and close the device */
  disconnect: () => Promise<void>;
}

export function useHardware(): UseHardwareResult {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  const usb = typeof navigator !== 'undefined' ? navigator.usb : undefined;

  useEffect(() => {
    if (!usb) {
      setUnsupported(true);
      return;
    }
    usb.getDevices().then((devices: USBDevice[]) => {
      const opened = devices.some((d) => d.opened);
      setConnected(devices.length > 0 && opened);
    });
    const onConnect = (e: USBConnectionEvent) => {
      if (e.device.opened) setConnected(true);
      setError(null);
    };
    const onDisconnect = (e: USBConnectionEvent) => {
      if (e.device.opened === false) setConnected(false);
    };
    usb.addEventListener('connect', onConnect);
    usb.addEventListener('disconnect', onDisconnect);
    return () => {
      usb.removeEventListener('connect', onConnect);
      usb.removeEventListener('disconnect', onDisconnect);
    };
  }, [usb]);

  const requestConnection = useCallback(async () => {
    if (!usb) {
      setError('WebUSB not available');
      return;
    }
    setError(null);
    try {
      const device = await usb.requestDevice({ filters: [NODE_ONE_FILTER] });
      await device.open();
      if (device.configuration == null) await device.selectConfiguration(1);
      setConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('No device selected') || msg.includes('canceled')) {
        setError(null);
      } else {
        setError(msg);
      }
      setConnected(false);
    }
  }, [usb]);

  const disconnect = useCallback(async () => {
    if (!usb) return;
    try {
      const devices = await usb.getDevices();
      for (const d of devices) {
        if (d.opened) await d.close();
      }
      setConnected(false);
      setError(null);
    } catch (_) {
      setConnected(false);
    }
  }, [usb]);

  return {
    connected,
    unsupported: !!unsupported,
    error,
    requestConnection,
    disconnect,
  };
}
