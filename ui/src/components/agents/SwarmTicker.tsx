/**
 * SwarmTicker — calls swarm tick(delta) every frame. Must live inside Canvas.
 */

import { useFrame } from '@react-three/fiber';
import { useSwarmStore } from '../../stores/swarm.store';

export function SwarmTicker(): null {
  useFrame((_, delta) => {
    useSwarmStore.getState().tick(delta);
  });
  return null;
}
