/**
 * Cosmic Visualization
 * 3D visualization of planetary transitions and zodiac signs
 */

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import * as THREE from 'three';

export const CosmicVisualization: React.FC = () => {
  const { gameEngine } = useGameEngineContext();
  const groupRef = useRef<THREE.Group>(null);
  const [planets, setPlanets] = React.useState<any[]>([]);
  const [transitions, setTransitions] = React.useState<any[]>([]);

  useEffect(() => {
    if (!gameEngine) return;

    const cosmic = gameEngine.getCosmicTransition();
    setPlanets(cosmic.getPlanets());
    setTransitions(cosmic.getActiveTransitions());

    // Listen for transition events
    const handleTransitionStarted = (e: CustomEvent) => {
      setTransitions(cosmic.getActiveTransitions());
    };

    const handleTransitionProgress = (e: CustomEvent) => {
      setTransitions(cosmic.getActiveTransitions());
    };

    window.addEventListener('cosmic:transitionStarted', handleTransitionStarted as EventListener);
    window.addEventListener('cosmic:transitionProgress', handleTransitionProgress as EventListener);

    return () => {
      window.removeEventListener(
        'cosmic:transitionStarted',
        handleTransitionStarted as EventListener
      );
      window.removeEventListener(
        'cosmic:transitionProgress',
        handleTransitionProgress as EventListener
      );
    };
  }, [gameEngine]);

  useFrame((state, delta) => {
    if (groupRef.current && gameEngine) {
      // Update planetary positions
      const cosmic = gameEngine.getCosmicTransition();
      cosmic.updatePlanetaryPositions(delta * 1000);

      // Update visualization
      groupRef.current.children.forEach((child, index) => {
        if (index < planets.length) {
          const planet = planets[index];
          child.position.copy(planet.position);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Zodiac Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[11.5, 12.5, 64]} />
        <meshBasicMaterial color="#FF69B4" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Planets */}
      {planets.map((planet) => (
        <group key={planet.id} position={planet.position}>
          <mesh>
            <sphereGeometry args={[planet.radius, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.color}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Orbit line */}
          {planet.distance > 0 && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.distance - 0.1, planet.distance + 0.1, 64]} />
              <meshBasicMaterial
                color={planet.color}
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Current sign indicator */}
          <mesh position={[0, planet.radius + 0.5, 0]}>
            <textGeometry
              args={[planet.currentSign.symbol, { font: 'Arial', size: 0.5, height: 0.1 }]}
            />
            <meshBasicMaterial color={planet.currentSign.color} />
          </mesh>
        </group>
      ))}

      {/* Transition lines */}
      {transitions.map((transition) => {
        const planet = planets.find((p) => p.id === transition.planetId);
        if (!planet) return null;

        const fromIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].findIndex(
          (i) =>
            [
              'aries',
              'taurus',
              'gemini',
              'cancer',
              'leo',
              'virgo',
              'libra',
              'scorpio',
              'sagittarius',
              'capricorn',
              'aquarius',
              'pisces',
            ][i] === transition.fromSign.id
        );
        const toIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].findIndex(
          (i) =>
            [
              'aries',
              'taurus',
              'gemini',
              'cancer',
              'leo',
              'virgo',
              'libra',
              'scorpio',
              'sagittarius',
              'capricorn',
              'aquarius',
              'pisces',
            ][i] === transition.toSign.id
        );

        const radius = 12;
        const fromAngle = (fromIndex / 12) * Math.PI * 2;
        const toAngle = (toIndex / 12) * Math.PI * 2;

        const fromX = Math.cos(fromAngle) * radius;
        const fromZ = Math.sin(fromAngle) * radius;
        const toX = Math.cos(toAngle) * radius;
        const toZ = Math.sin(toAngle) * radius;

        const points = [new THREE.Vector3(fromX, 0, fromZ), new THREE.Vector3(toX, 0, toZ)];

        return (
          <line key={transition.id}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={planet.color}
              linewidth={3}
              transparent
              opacity={transition.intensity}
            />
          </line>
        );
      })}
    </group>
  );
};
