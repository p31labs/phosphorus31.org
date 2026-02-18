// ══════════════════════════════════════════════════════════════════════════════
// USE WEB SERIAL HOOK
// Bridge to ESP32-S3 Phenix Navigator hardware via Web Serial API.
// Parses JSON from device: knob → voltage, button → block placement.
// Chrome/Edge only.
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store.js';
import { ESP32_VENDOR_ID, ESP32_PRODUCT_ID, BAUD_RATE } from '../constants.js';

// Module-scope decoder (single instance)
const textDecoder = new TextDecoder();

/**
 * Hook for Web Serial communication with Phenix Navigator hardware
 */
export function useWebSerial() {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);

  // Refs for serial port management
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const cancelledRef = useRef(false);
  const processMessageRef = useRef(null);

  // Store actions
  const setVoltage = useStore((s) => s.setVoltage);
  const addBlock = useStore((s) => s.addBlock);
  const setHwConn = useStore((s) => s.setHardwareConnected);
  const setHwInput = useStore((s) => s.setHardwareInput);

  // Check Web Serial support
  const isSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  // ── Message Handler ────────────────────────────────────────────────────────
  const processMessage = useCallback((msg) => {
    if (msg.type === 'knob') {
      // Map 0-4095 ADC range to 0-100 voltage
      const voltage = Math.round((msg.value / 4095) * 100);
      setVoltage(voltage);
      setHwInput({ type: 'knob', value: voltage });
    } else if (msg.type === 'button' && msg.pressed) {
      // Button press → add block at center (hardware demo)
      addBlock('0,0,0');
      setHwInput({ type: 'button', pressed: true });
    }
  }, [setVoltage, addBlock, setHwInput]);

  // Keep ref in sync
  useEffect(() => {
    processMessageRef.current = processMessage;
  }, [processMessage]);

  // ── Read Loop ──────────────────────────────────────────────────────────────
  const readLoop = useCallback(async (port) => {
    let buffer = '';
    
    try {
      const reader = port.readable.getReader();
      readerRef.current = reader;

      while (!cancelledRef.current) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += textDecoder.decode(value, { stream: true });

        // Process complete JSON lines
        let newlineIdx;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);

          if (line) {
            try {
              const msg = JSON.parse(line);
              if (processMessageRef.current) {
                processMessageRef.current(msg);
              }
            } catch (e) {
              console.error('[WebSerial] JSON parse error:', e);
            }
          }
        }
      }
    } catch (e) {
      if (!cancelledRef.current) {
        console.error('[WebSerial] Read error:', e);
        setError(`Read error: ${e.message}`);
      }
    } finally {
      if (readerRef.current) {
        readerRef.current.releaseLock();
        readerRef.current = null;
      }
    }
  }, []);

  // ── Connect ────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (!isSupported) {
      setError('Web Serial not supported. Use Chrome or Edge.');
      return;
    }

    try {
      // Request port with Espressif vendor filter
      const port = await navigator.serial.requestPort({
        filters: [{ usbVendorId: ESP32_VENDOR_ID, usbProductId: ESP32_PRODUCT_ID }]
      });

      await port.open({ baudRate: BAUD_RATE });

      portRef.current = port;
      cancelledRef.current = false;

      // Get device info
      const info = port.getInfo();
      setDeviceInfo({
        vendorId: info.usbVendorId?.toString(16).padStart(4, '0'),
        productId: info.usbProductId?.toString(16).padStart(4, '0')
      });

      setIsConnected(true);
      setHwConn(true);
      setError(null);

      // Start read loop
      readLoop(port);
    } catch (e) {
      if (e.name === 'NotFoundError') {
        setError('No Phenix Navigator found. Check USB cable.');
      } else if (e.name === 'NotAllowedError') {
        setError('Permission denied. Please allow serial port access.');
      } else {
        setError(`Connection error: ${e.message}`);
      }
    }
  }, [isSupported, readLoop, setHwConn]);

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    cancelledRef.current = true;

    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
      }
    } catch (e) {
      // Ignore cancel errors
    }

    try {
      if (portRef.current) {
        await portRef.current.close();
      }
    } catch (e) {
      // Ignore close errors
    }

    portRef.current = null;
    setIsConnected(false);
    setHwConn(false);
    setDeviceInfo(null);
  }, [setHwConn]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (readerRef.current) {
        readerRef.current.cancel().catch(() => {});
      }
      if (portRef.current) {
        portRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isConnected,
    isSupported,
    error,
    deviceInfo,
    connect,
    disconnect
  };
}
