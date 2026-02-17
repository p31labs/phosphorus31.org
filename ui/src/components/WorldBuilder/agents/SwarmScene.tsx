/**
 * SwarmScene — R3F group that renders all agents and runs tick in useFrame
 * Must be mounted inside Canvas. Subscribes to swarm store for agents list.
 */

import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useSwarmStore } from '../../../stores/swarm.store';
import { AgentVisual } from './AgentVisual';

export const SwarmScene: React.FC = () => {
  const agents = useSwarmStore((s) => Array.from(s.agents.values()));
  const tick = useSwarmStore((s) => s.tick);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    tick(safeDelta);
  });

  return (
    <>
      {agents.map((agent) => (
        <AgentVisual key={agent.id} agent={agent} />
      ))}
    </>
  );
};
