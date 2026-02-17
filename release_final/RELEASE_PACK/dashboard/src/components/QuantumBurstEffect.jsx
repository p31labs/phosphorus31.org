import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const QuantumBurstEffect = ({ position, color = '#FFD580', duration = 0.8 }) => {
  const groupRef = useRef();
  const particles = useRef([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), duration * 1000);
    return () => clearTimeout(timer);
  }, [duration]);

  useFrame(() => {
    if (active && particles.current.length === 0) {
      // Initialize particles if active and not already created
      for (let i = 0; i < 50; i++) {
        particles.current.push({
          velocity: new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          ).normalize().multiplyScalar(Math.random() * 0.5 + 0.1), // Random speed
          position: new THREE.Vector3().copy(position), // Start at mushroom position
          life: Math.random() * duration * 0.5 + duration * 0.2, // Random life span
          maxLife: duration,
          size: Math.random() * 0.1 + 0.05,
          opacity: 1,
        });
      }
    }

    if (active && particles.current.length > 0) {
      particles.current.forEach(p => {
        p.position.add(p.velocity.clone().multiplyScalar(0.01));
        p.velocity.multiplyScalar(0.98); // Decelerate
        p.life -= 0.01; // Decay life
        p.opacity = Math.max(0, p.life / p.maxLife); // Fade out
      });

      // Filter out dead particles (though useEffect will handle overall removal)
      particles.current = particles.current.filter(p => p.life > 0);

      if (groupRef.current) {
        // Update positions of rendered particles
        groupRef.current.children.forEach((mesh, index) => {
          if (particles.current[index]) {
            mesh.position.copy(particles.current[index].position);
            mesh.scale.setScalar(particles.current[index].size * p.opacity); // Scale and fade
            mesh.material.opacity = p.opacity; // Update material opacity
          }
        });
      }
    }
  });

  if (!active && particles.current.length === 0) return null; // Fully remove from scene when inactive and particles are gone

  return (
    <group ref={groupRef}>
      {particles.current.map((p, index) => (
        <mesh key={index} position={p.position} scale={[p.size, p.size, p.size]}>
          <sphereGeometry args={[1, 8, 8]} /> {/* Simple particle shape */}
          <meshBasicMaterial color={color} transparent opacity={p.opacity} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

export default QuantumBurstEffect;
