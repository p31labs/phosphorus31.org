/**
 * useBufferHeartbeat Hook
 * Automatically sends heartbeat to The Buffer for object permanence
 */

import { useEffect, useRef } from 'react';
import { bufferService } from '../services/buffer.service';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

export const useBufferHeartbeat = (nodeId: string = 'scope', signalStrength: number = 100) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Send initial heartbeat
    bufferService.sendHeartbeat(nodeId, signalStrength);

    // Set up interval
    intervalRef.current = setInterval(() => {
      bufferService.sendHeartbeat(nodeId, signalStrength);
    }, HEARTBEAT_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nodeId, signalStrength]);
};
