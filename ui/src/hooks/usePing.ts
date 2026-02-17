/**
 * usePing Hook
 * React hook for accessing Ping/heartbeat status from The Buffer
 */

import { useState, useEffect } from 'react';

export interface PingStatus {
  active: boolean;
  lastHeartbeat: string | null;
  nodes: Record<
    string,
    {
      nodeId: string;
      timestamp: string;
      signalStrength: number;
    }
  >;
  health: 'green' | 'yellow' | 'red';
}

export function usePing(updateInterval: number = 2000) {
  const [ping, setPing] = useState<PingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPing = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/ping');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setPing(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPing();
    const interval = setInterval(fetchPing, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const getHealthColor = () => {
    if (!ping) return '#6b7280'; // gray
    switch (ping.health) {
      case 'green':
        return '#10b981';
      case 'yellow':
        return '#f59e0b';
      case 'red':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getHealthLabel = () => {
    if (!ping) return 'Unknown';
    switch (ping.health) {
      case 'green':
        return 'Connected';
      case 'yellow':
        return 'Degraded';
      case 'red':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return {
    ping,
    loading,
    error,
    health: ping?.health || 'red',
    healthColor: getHealthColor(),
    healthLabel: getHealthLabel(),
    isConnected: ping?.health === 'green',
    nodeCount: ping ? Object.keys(ping.nodes).length : 0,
    refetch: fetchPing,
  };
}
