/**
 * Willow's World
 * A magical, age-appropriate space for Willow (age 6)
 * Born 8/8/2019 - The second child, the second reason, Node two
 */

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Html } from '@react-three/drei';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { SimpleButton } from '../Accessibility/SimpleButton';
import { WillowsWorldWelcome } from './WillowsWorldWelcome';
import * as THREE from 'three';

// Magical floating particles
const FloatingParticle: React.FC<{ position: [number, number, number]; color: string }> = ({
  position,
  color,
}) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

// Rainbow bridge
const RainbowBridge: React.FC = () => {
  const points = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const x = (t - 0.5) * 10;
    const y = Math.sin(t * Math.PI) * 2;
    const z = 0;
    points.push(new THREE.Vector3(x, y, z));
  }

  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

  return (
    <group>
      {points.map((point, i) => {
        const colorIndex = Math.floor((i / points.length) * colors.length);
        return (
          <mesh key={i} position={[point.x, point.y, point.z]}>
            <boxGeometry args={[0.5, 0.2, 0.2]} />
            <meshStandardMaterial
              color={colors[colorIndex]}
              emissive={colors[colorIndex]}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Friendly creatures
const FriendlyCreature: React.FC<{
  position: [number, number, number];
  color: string;
  name: string;
}> = ({ position, color, name }) => {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 0.8, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.8, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

const WillowsWorld3D: React.FC = () => {
  const { animationReduced } = useAccessibilityStore();

  return (
    <Canvas camera={{ position: [0, 5, 15], fov: 60 }} shadows dpr={animationReduced ? 1 : [1, 2]}>
      <color attach="background" args={['#1a0033']} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#FF69B4" />
      <pointLight position={[10, 5, -10]} intensity={0.5} color="#87CEEB" />

      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
        autoRotate={!animationReduced}
        autoRotateSpeed={0.3}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2d1b4e" />
      </mesh>

      {/* Rainbow Bridge */}
      <RainbowBridge />

      {/* Friendly Creatures */}
      <FriendlyCreature position={[-5, 0, -3]} color="#FF69B4" name="Pinkie" />
      <FriendlyCreature position={[5, 0, -3]} color="#87CEEB" name="Bluey" />
      <FriendlyCreature position={[0, 0, 5]} color="#98FB98" name="Greenie" />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 8;
        const height = Math.sin(i) * 3;
        return (
          <FloatingParticle
            key={i}
            position={[Math.cos(angle) * radius, height + 2, Math.sin(angle) * radius]}
            color={['#FF69B4', '#87CEEB', '#98FB98', '#FFD700', '#FF6347'][i % 5]}
          />
        );
      })}

      {/* Welcome Text */}
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={1}
        height={0.2}
        position={[0, 8, 0]}
      >
        Willow's World
        <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={0.5} />
      </Text3D>
    </Canvas>
  );
};

export const WillowsWorld: React.FC = () => {
  const { fontSize, simplifiedUI } = useAccessibilityStore();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);

  const activities = [
    { id: 'colors', name: '🌈 Colors', emoji: '🌈' },
    { id: 'music', name: '🎵 Music', emoji: '🎵' },
    { id: 'draw', name: '🎨 Draw', emoji: '🎨' },
    { id: 'molecules', name: '🧬 Molecules', emoji: '🧬' },
    { id: 'stars', name: '⭐ Stars', emoji: '⭐' },
  ];

  const story = `Once upon a time, in a magical world made of light and love, there was a special place called Willow's World. 

In this world, everything was connected - like a beautiful web of friendship. The colors danced together, the stars sang songs, and the molecules (tiny building blocks) made everything work.

Willow, who was born on a special day (8/8/2019), was the keeper of this world. She could talk to the molecules, paint with the stars, and make music with the colors.

Every day, new adventures happened. Sometimes the molecules would form beautiful shapes called Posner molecules - they looked like tiny crystals that glowed with quantum light.

The best part? Everything in Willow's World worked together, just like a family. The Buffer helped messages travel, The Centaur helped with thinking, and The Scope showed everything in beautiful 3D.

And Willow knew: The Mesh Holds. Everything is connected. With love and light. 💜`;

  if (showWelcome) {
    return <WillowsWorldWelcome onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className="willows-world">
      {/* Header */}
      <div className="world-header">
        <h1 className="world-title" style={{ fontSize: fontSize === 'xlarge' ? '3rem' : '2.5rem' }}>
          🌟 Willow's World 🌟
        </h1>
        <p className="world-subtitle">A magical place for exploring, creating, and learning</p>
        <button
          onClick={() => setShowWelcome(true)}
          className="back-button"
          style={{ fontSize: fontSize === 'xlarge' ? '1.25rem' : '1rem' }}
        >
          ← Back to Welcome
        </button>
      </div>

      {/* Main Content */}
      <div className="world-content">
        {/* 3D Scene */}
        <div className="world-canvas">
          <WillowsWorld3D />
        </div>

        {/* Activity Panel */}
        <div className="activity-panel">
          <h2 className="panel-title">Activities</h2>
          <div className="activity-grid">
            {activities.map((activity) => (
              <SimpleButton
                key={activity.id}
                label={`${activity.emoji} ${activity.name}`}
                onClick={() => setCurrentActivity(activity.id)}
                variant="primary"
                size="large"
                style={{ fontSize: fontSize === 'xlarge' ? '1.5rem' : '1.25rem' }}
              />
            ))}
          </div>

          {/* Story Button */}
          <div className="story-section">
            <SimpleButton
              label={showStory ? '📖 Hide Story' : '📖 Read Story'}
              onClick={() => setShowStory(!showStory)}
              variant="secondary"
              size="medium"
            />
            {showStory && (
              <div className="story-content">
                <p>{story}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Content */}
      {currentActivity && (
        <div className="activity-overlay">
          <button
            onClick={() => setCurrentActivity(null)}
            className="close-button"
            style={{ fontSize: fontSize === 'xlarge' ? '2rem' : '1.5rem' }}
          >
            ✕
          </button>
          <div className="activity-content">
            {currentActivity === 'colors' && (
              <div className="colors-activity">
                <h2>🌈 Color Magic</h2>
                <p>Click the colors to make them dance!</p>
                <div className="color-grid">
                  {['#FF69B4', '#87CEEB', '#98FB98', '#FFD700', '#FF6347', '#9370DB'].map(
                    (color) => (
                      <div
                        key={color}
                        className="color-box"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          // Play sound
                          if (typeof Audio !== 'undefined') {
                            const audio = new Audio(
                              'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC'
                            );
                            audio.play().catch(() => {});
                          }
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            )}
            {currentActivity === 'music' && (
              <div className="music-activity">
                <h2>🎵 Music Maker</h2>
                <p>Press the buttons to make music!</p>
                <div className="music-keys">
                  {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => (
                    <button
                      key={note}
                      className="music-key"
                      onClick={() => {
                        // Simple tone generation
                        const audioContext = new (
                          window.AudioContext || (window as any).webkitAudioContext
                        )();
                        const oscillator = audioContext.createOscillator();
                        const frequencies = {
                          C: 261.63,
                          D: 293.66,
                          E: 329.63,
                          F: 349.23,
                          G: 392.0,
                          A: 440.0,
                          B: 493.88,
                        };
                        oscillator.frequency.value = frequencies[note as keyof typeof frequencies];
                        oscillator.type = 'sine';
                        oscillator.connect(audioContext.destination);
                        oscillator.start();
                        oscillator.stop(audioContext.currentTime + 0.3);
                      }}
                      style={{ fontSize: fontSize === 'xlarge' ? '2rem' : '1.5rem' }}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentActivity === 'draw' && (
              <div className="draw-activity">
                <h2>🎨 Drawing Board</h2>
                <p>Draw something beautiful!</p>
                <canvas
                  id="drawing-canvas"
                  width={800}
                  height={600}
                  style={{
                    border: '3px solid #FF69B4',
                    borderRadius: '12px',
                    cursor: 'crosshair',
                    backgroundColor: '#ffffff',
                  }}
                  onMouseDown={(e) => {
                    const canvas = e.currentTarget;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.strokeStyle = '#FF69B4';
                      ctx.lineWidth = 5;
                      ctx.beginPath();
                      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                      canvas.onmousemove = (moveEvent) => {
                        ctx.lineTo(moveEvent.offsetX, moveEvent.offsetY);
                        ctx.stroke();
                      };
                      canvas.onmouseup = () => {
                        canvas.onmousemove = null;
                        canvas.onmouseup = null;
                      };
                    }
                  }}
                />
                <SimpleButton
                  label="🔄 Clear"
                  onClick={() => {
                    const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                    }
                  }}
                  variant="secondary"
                  size="medium"
                />
              </div>
            )}
            {currentActivity === 'molecules' && (
              <div className="molecules-activity">
                <h2>🧬 Molecule Explorer</h2>
                <p>Explore the magical Posner molecules!</p>
                <div className="molecule-info">
                  <p>Molecules are like tiny building blocks that make up everything around us!</p>
                  <p>
                    The special P31 molecules (Phosphorus-31) are like tiny crystals that glow with
                    quantum light.
                  </p>
                  <p>
                    They're found in bones and help carry information, just like a magical
                    messenger!
                  </p>
                </div>
                <SimpleButton
                  label="🧬 Open Molecule Builder"
                  onClick={() => {
                    // This would open the molecule builder
                    window.location.hash = '#molecule-builder';
                  }}
                  variant="primary"
                  size="large"
                />
              </div>
            )}
            {currentActivity === 'stars' && (
              <div className="stars-activity">
                <h2>⭐ Star Stories</h2>
                <p>Every star has a story to tell!</p>
                <div className="star-stories">
                  <div className="star-story">
                    <div className="star">⭐</div>
                    <p>
                      The stars in the sky are like friends, always there to light up the night.
                    </p>
                  </div>
                  <div className="star-story">
                    <div className="star">✨</div>
                    <p>When molecules connect, they make patterns like constellations!</p>
                  </div>
                  <div className="star-story">
                    <div className="star">🌟</div>
                    <p>Willow's World is connected to all the stars through the mesh.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .willows-world {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #1a0033 0%, #4a0080 50%, #1a0033 100%);
          color: white;
          overflow: hidden;
        }

        .world-header {
          padding: 2rem;
          text-align: center;
          background: linear-gradient(180deg, rgba(255, 105, 180, 0.2) 0%, transparent 100%);
          border-bottom: 2px solid rgba(255, 105, 180, 0.5);
        }

        .world-title {
          margin: 0;
          background: linear-gradient(135deg, #FF69B4 0%, #87CEEB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          text-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
        }

        .world-subtitle {
          margin-top: 0.5rem;
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        .back-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 105, 180, 0.2);
          border: 2px solid rgba(255, 105, 180, 0.5);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .back-button:hover {
          background: rgba(255, 105, 180, 0.4);
          transform: translateY(-2px);
        }

        .world-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          flex: 1;
          overflow: hidden;
        }

        .world-canvas {
          position: relative;
          background: radial-gradient(circle at center, #2d1b4e 0%, #1a0033 100%);
        }

        .activity-panel {
          background: rgba(0, 0, 0, 0.6);
          border-left: 2px solid rgba(255, 105, 180, 0.5);
          padding: 1.5rem;
          overflow-y: auto;
          backdrop-filter: blur(20px);
        }

        .panel-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #FF69B4;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .story-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .story-content {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(255, 105, 180, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 105, 180, 0.3);
          line-height: 1.8;
          font-size: 1.125rem;
        }

        .activity-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .close-button {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(255, 105, 180, 0.2);
          border: 2px solid #FF69B4;
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s;
        }

        .close-button:hover {
          background: rgba(255, 105, 180, 0.4);
          transform: scale(1.1);
        }

        .activity-content {
          max-width: 900px;
          width: 100%;
          text-align: center;
        }

        .activity-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #FF69B4;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }

        .color-box {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s;
          border: 3px solid white;
        }

        .color-box:hover {
          transform: scale(1.1);
        }

        .music-keys {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin: 2rem 0;
        }

        .music-key {
          padding: 2rem 1.5rem;
          background: linear-gradient(135deg, #FF69B4 0%, #87CEEB 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
        }

        .music-key:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
        }

        .molecule-info {
          text-align: left;
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(255, 105, 180, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(255, 105, 180, 0.3);
        }

        .molecule-info p {
          margin-bottom: 1rem;
          font-size: 1.125rem;
          line-height: 1.6;
        }

        .star-stories {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .star-story {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 105, 180, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(255, 105, 180, 0.3);
          text-align: left;
        }

        .star {
          font-size: 3rem;
        }

        .star-story p {
          font-size: 1.125rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .world-content {
            grid-template-columns: 1fr;
          }

          .activity-panel {
            border-left: none;
            border-top: 2px solid rgba(255, 105, 180, 0.5);
            max-height: 40vh;
          }
        }
      `}</style>
    </div>
  );
};
