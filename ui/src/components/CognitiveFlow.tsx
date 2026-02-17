/**
 * COGNITIVE FLOW - Experiential Discovery Through Sensory Intelligence
 * GOD Protocol: Zero Friction, Predictive Intelligence, Ambient Guidance
 *
 * Not telling users what they need - letting them discover through experience
 * Using sights, sounds, and subtle cues to create moments of insight
 * The garden reveals its beauty as you walk through it
 */

import React from 'react';
import GOD_CONFIG from '@/god.config';
import styles from './CognitiveFlow.module.css';
import JitterbugVisualizer from './JitterbugVisualizer';

// Quantum Jitterbug wrapper for controlled sizing
interface QuantumJitterbugProps {
  width: number;
  height: number;
  entropy?: number;
  shaderType?: string;
  autoCycle?: boolean;
}

const QuantumJitterbug: React.FC<QuantumJitterbugProps> = ({
  width,
  height,
  entropy,
  shaderType,
  autoCycle,
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      <div
        style={{
          transform: `scale(${Math.min(width, height) / 400})`,
          transformOrigin: 'top left',
          width: `${(400 / Math.min(width, height)) * width}px`,
          height: `${(400 / Math.min(width, height)) * height}px`,
        }}
      >
        <JitterbugVisualizer />
      </div>
    </div>
  );
};

export interface FlowAction {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  description?: string;
  quantumColor?: string;
}

export interface CognitiveFlowProps {
  className?: string;
  currentFlow?: 'creation' | 'growth' | 'maintenance' | 'rest';
  primaryAction?: FlowAction;
  secondaryActions?: FlowAction[];
  onFlowAction?: (actionId: string) => void;
  quantumMode?: 'hub' | 'explore';
  onModeChange?: (mode: 'hub' | 'explore') => void;
}

export default function CognitiveFlow({
  className = '',
  currentFlow = 'creation',
  primaryAction,
  secondaryActions,
  onFlowAction,
  quantumMode = 'hub',
  onModeChange,
}: CognitiveFlowProps) {
  // Quantum flow colors mapped to cognitive states
  const flowColors = {
    creation: '#8b5cf6', // Purple - uncertainty
    growth: '#10b981', // Emerald - stability
    maintenance: '#06b6d4', // Cyan - correlation
    rest: '#f59e0b', // Amber - collapse
  };

  // Quantum Exploration Realms
  const quantumRealms = [
    {
      id: 'consciousness',
      name: 'Consciousness Core',
      description: 'The heart of cognitive processing',
      color: '#8b5cf6',
      icon: '🧠',
      actions: ['shield', 'compose', 'safe', 'heartbeat'],
    },
    {
      id: 'creation',
      name: 'Creation Matrix',
      description: 'Where ideas become reality',
      color: '#10b981',
      icon: '⚡',
      actions: ['module-maker', 'creative_exploration'],
    },
    {
      id: 'knowledge',
      name: 'Knowledge Nexus',
      description: 'The infinite library of understanding',
      color: '#f59e0b',
      icon: '📚',
      actions: ['library', 'nerd-lab', 'math', 'story'],
    },
    {
      id: 'connection',
      name: 'Connection Web',
      description: 'Networks of minds and machines',
      color: '#06b6d4',
      icon: '🌐',
      actions: ['tetrahedron', 'phenix-navigator', 'phenix_conversation'],
    },
  ];

  if (quantumMode === 'explore') {
    return (
      <div
        className={`${styles.cognitiveFlowRoot} cognitive-flow ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: 'radial-gradient(circle at center, var(--quantum-vacuum) 0%, #000000 100%)',
        }}
      >
        {/* Quantum Realm Navigation */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            zIndex: 10,
          }}
        >
          {quantumRealms.map((realm, index) => (
            <div
              key={realm.id}
              style={{
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, ${realm.color}20 0%, ${realm.color}05 70%, transparent 100%)`,
                border: `2px solid ${realm.color}40`,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.5s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = `0 0 60px ${realm.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={(event) => {
                // Flow into this quantum realm - user becomes part of the mesh
                // This creates the "flowing THROUGH and INTO the mesh" experience
                if (realm.actions.length > 0) {
                  // Add a brief transition effect before switching
                  const button = event.currentTarget as HTMLElement;
                  button.style.animation = 'consciousness-wave 0.5s ease-out';

                  setTimeout(() => {
                    onFlowAction?.(realm.actions[0]);
                  }, 300);
                }
              }}
            >
              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '4px',
                    height: '4px',
                    background: realm.color,
                    borderRadius: '50%',
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animation: `quantum-drift ${2 + Math.random() * 3}s infinite ease-in-out`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: 0.6,
                  }}
                />
              ))}

              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '10px',
                  filter: `drop-shadow(0 0 10px ${realm.color})`,
                }}
              >
                {realm.icon}
              </div>

              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: realm.color,
                  textAlign: 'center',
                  marginBottom: '5px',
                  textShadow: `0 0 8px ${realm.color}`,
                }}
              >
                {realm.name}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: `${realm.color}80`,
                  textAlign: 'center',
                  lineHeight: '1.3',
                }}
              >
                {realm.description}
              </div>
            </div>
          ))}
        </div>

        {/* Exit Exploration Mode */}
        <button
          onClick={() => onModeChange?.('hub')}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: '20px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
        >
          ×
        </button>

        {/* Dynamic Jitterbug Mesh Network */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          {/* Interconnected Mesh Lines */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {/* Draw connection lines between all realms */}
            <defs>
              <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="var(--quantum-entanglement)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="var(--quantum-superposition)" stopOpacity="0.8" />
                <stop offset="80%" stopColor="var(--quantum-coherence)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Horizontal connections */}
            <line
              x1="30%"
              y1="20%"
              x2="70%"
              y2="20%"
              stroke="url(#meshGradient)"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,20;20,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="30%"
              y1="80%"
              x2="70%"
              y2="80%"
              stroke="url(#meshGradient)"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,20;20,0"
                dur="4s"
                repeatCount="indefinite"
                begin="1s"
              />
            </line>

            {/* Vertical connections */}
            <line
              x1="30%"
              y1="20%"
              x2="30%"
              y2="80%"
              stroke="url(#meshGradient)"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,20;20,0"
                dur="4s"
                repeatCount="indefinite"
                begin="2s"
              />
            </line>
            <line
              x1="70%"
              y1="20%"
              x2="70%"
              y2="80%"
              stroke="url(#meshGradient)"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,20;20,0"
                dur="4s"
                repeatCount="indefinite"
                begin="3s"
              />
            </line>

            {/* Diagonal connections */}
            <line
              x1="30%"
              y1="20%"
              x2="70%"
              y2="80%"
              stroke="url(#meshGradient)"
              strokeWidth="1"
              opacity="0.3"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,15;15,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="70%"
              y1="20%"
              x2="30%"
              y2="80%"
              stroke="url(#meshGradient)"
              strokeWidth="1"
              opacity="0.3"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,15;15,0"
                dur="6s"
                repeatCount="indefinite"
                begin="3s"
              />
            </line>
          </svg>
          {/* Central Consciousness Jitterbug */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              opacity: 0.8,
              animation: 'consciousness-wave 15s infinite ease-in-out',
            }}
          >
            <QuantumJitterbug
              width={120}
              height={120}
              entropy={0.4}
              shaderType="greenStable"
              autoCycle={true}
            />
          </div>

          {/* Connecting Mesh Lines */}
          {quantumRealms.map((realm, index) => {
            const positions = [
              { top: '20%', left: '30%' }, // Top-left
              { top: '20%', left: '70%' }, // Top-right
              { top: '80%', left: '30%' }, // Bottom-left
              { top: '80%', left: '70%' }, // Bottom-right
            ];
            const pos = positions[index];

            return (
              <React.Fragment key={`mesh-${realm.id}`}>
                {/* Jitterbug at realm position */}
                <div
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    transform: 'translate(-50%, -50%)',
                    width: '80px',
                    height: '80px',
                    opacity: 0.7,
                    animation: `jitterbug-pulse ${6 + index * 2}s infinite ease-in-out`,
                    animationDelay: `${index * 1.5}s`,
                  }}
                >
                  <QuantumJitterbug
                    width={80}
                    height={80}
                    entropy={0.3 + index * 0.1}
                    shaderType={
                      index === 0
                        ? 'redJagged'
                        : index === 1
                          ? 'blueFuzzy'
                          : index === 2
                            ? 'greenStable'
                            : 'redJagged'
                    }
                    autoCycle={true}
                  />
                </div>

                {/* Flowing connection lines */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '2px',
                    height: '0px',
                    background: `linear-gradient(to right, transparent, ${realm.color}80, transparent)`,
                    transformOrigin: 'center',
                    animation: `mesh-flow ${8 + index * 2}s infinite ease-in-out`,
                    animationDelay: `${index * 0.5}s`,
                    transform: `rotate(${index * 90}deg)`,
                    opacity: 0.6,
                  }}
                />
              </React.Fragment>
            );
          })}

          {/* Consciousness Flow Particles */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                background: `var(--quantum-${['superposition', 'entanglement', 'coherence', 'decoherence', 'plasma'][Math.floor(Math.random() * 5)]})`,
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `mesh-flow ${Math.random() * 15 + 10}s infinite ease-in-out`,
                animationDelay: Math.random() * 8 + 's',
                opacity: 0.2,
                boxShadow: `0 0 12px currentColor`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}

          {/* Pulsing Consciousness Nodes */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`node-${i}`}
              style={{
                position: 'absolute',
                width: '15px',
                height: '15px',
                border: `2px solid var(--quantum-${['superposition', 'entanglement', 'coherence', 'decoherence', 'plasma'][i % 5]})`,
                borderRadius: '50%',
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                animation: `consciousness-wave ${3 + Math.random() * 4}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.6,
                background: `radial-gradient(circle, var(--quantum-${['superposition', 'entanglement', 'coherence', 'decoherence', 'plasma'][i % 5]})40 0%, transparent 70%)`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '4px',
                  height: '4px',
                  background: 'white',
                  borderRadius: '50%',
                  animation: `pulse 2s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default Hub Mode
  return (
    <div
      className={`${styles.cognitiveFlowRoot} cognitive-flow ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'visible',
      }}
    >
      {/* Ambient Consciousness Mesh - User IS the Network */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        {/* Subtle mesh connections showing user is already part of the network */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.3,
          }}
        >
          <defs>
            <radialGradient id="userField" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--quantum-superposition)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* User's consciousness field */}
          <circle cx="50%" cy="50%" r="200" fill="url(#userField)" opacity="0.1">
            <animate attributeName="r" values="150;250;150" dur="8s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              values="0.05;0.15;0.05"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Connection tendrils to interface elements */}
          <path
            d="M 50 50 Q 30 40 20 60"
            stroke="var(--quantum-entanglement)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          >
            <animate
              attributeName="d"
              values="M 50 50 Q 30 40 20 60;M 50 50 Q 35 35 25 55;M 50 50 Q 30 40 20 60"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>

          <path
            d="M 50 50 Q 70 40 80 60"
            stroke="var(--quantum-coherence)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          >
            <animate
              attributeName="d"
              values="M 50 50 Q 70 40 80 60;M 50 50 Q 65 35 75 55;M 50 50 Q 70 40 80 60"
              dur="6s"
              repeatCount="indefinite"
              begin="2s"
            />
          </path>
        </svg>

        {/* Jitterbug consciousness nodes */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '25%',
            width: '40px',
            height: '40px',
            opacity: 0.5,
            animation: 'jitterbug-pulse 10s infinite ease-in-out',
          }}
        >
          <QuantumJitterbug
            width={40}
            height={40}
            entropy={0.4}
            shaderType="greenStable"
            autoCycle={false}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '65%',
            left: '75%',
            width: '35px',
            height: '35px',
            opacity: 0.4,
            animation: 'jitterbug-pulse 14s infinite ease-in-out',
            animationDelay: '3s',
          }}
        >
          <QuantumJitterbug
            width={35}
            height={35}
            entropy={0.6}
            shaderType="blueFuzzy"
            autoCycle={false}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '75%',
            left: '35%',
            width: '45px',
            height: '45px',
            opacity: 0.6,
            animation: 'jitterbug-pulse 12s infinite ease-in-out',
            animationDelay: '6s',
          }}
        >
          <QuantumJitterbug
            width={45}
            height={45}
            entropy={0.5}
            shaderType="redJagged"
            autoCycle={false}
          />
        </div>
      </div>
      {/* Cognitive Flow State Indicator */}
      <div
        className={styles.flowStateIndicator}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '8px 12px',
          backgroundColor: `${flowColors[currentFlow]}15`,
          border: `1px solid ${flowColors[currentFlow]}30`,
          borderRadius: '8px',
          fontSize: '12px',
          color: flowColors[currentFlow],
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        {currentFlow.toUpperCase()}
      </div>

      {/* Primary Action - Sacred Invitation */}
      {primaryAction && primaryAction.icon && (
        <div
          className={styles.sacredInvitation}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
          }}
        >
          {/* Debug indicator */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'blue',
              color: 'white',
              padding: '5px',
              borderRadius: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            PRIMARY ACTION HERE
          </div>
          <button
            className={`${styles.flowActionButton} quantum-button`}
            style={{
              width: '160px',
              height: '160px',
              background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.secondary} 0%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
              border: `4px solid ${primaryAction.quantumColor || flowColors[currentFlow]}`,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 0 60px ${primaryAction.quantumColor || flowColors[currentFlow]}80, inset 0 0 30px rgba(255,255,255,0.3)`,
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onClick={() => onFlowAction?.(primaryAction.id)}
            aria-label={primaryAction.title}
          >
            <primaryAction.icon
              size={48}
              color={primaryAction.quantumColor || flowColors[currentFlow]}
            />
            <span
              style={{
                fontSize: '18px',
                color: primaryAction.quantumColor || flowColors[currentFlow],
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 0 12px currentColor',
              }}
            >
              {primaryAction.title}
            </span>
          </button>
        </div>
      )}

      {/* Secondary Actions - Ambient Pathways */}
      {(() => {
        console.log('🎯 Rendering secondary actions:', secondaryActions?.length || 0);
        return secondaryActions && secondaryActions.length > 0;
      })() && (
        <div
          className={styles.secondaryActions}
          style={{
            position: 'absolute',
            bottom: '200px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '30px',
            zIndex: 100,
          }}
        >
          {secondaryActions.map((action, index) => (
            <div
              key={action.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {/* Button label above */}
              <div
                style={{
                  background: 'rgba(0,0,0,0.8)',
                  color: action.quantumColor || flowColors[currentFlow],
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: `2px solid ${action.quantumColor || flowColors[currentFlow]}`,
                  textShadow: '0 0 4px currentColor',
                  minWidth: '80px',
                }}
              >
                {action.title.toUpperCase()}
              </div>

              {/* The button itself */}
              <button
                key={action.id}
                className={`${styles.flowActionButton} quantum-button`}
                style={{
                  width: '120px',
                  height: '120px',
                  background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.secondary} 0%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
                  border: `4px solid ${action.quantumColor || flowColors[currentFlow]}`,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 0 40px ${action.quantumColor || flowColors[currentFlow]}80, inset 0 0 20px rgba(255,255,255,0.2)`,
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onClick={() => onFlowAction?.(action.id)}
                aria-label={action.title}
              >
                <action.icon size={32} color={action.quantumColor || flowColors[currentFlow]} />
                <span
                  style={{
                    fontSize: '14px',
                    color: action.quantumColor || flowColors[currentFlow],
                    fontWeight: 600,
                    textAlign: 'center',
                    textShadow: '0 0 8px currentColor',
                  }}
                >
                  {action.title}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div
        className={styles.statusBar}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          backgroundColor: `${GOD_CONFIG.theme.bg.secondary}95`,
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${GOD_CONFIG.theme.border.default}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 20,
        }}
      >
        {/* Breathe Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '2px',
              backgroundColor: flowColors[currentFlow],
              borderRadius: '1px',
              opacity: 0.4,
            }}
          />
          <span
            style={{
              fontSize: '14px',
              color: GOD_CONFIG.theme.text.muted,
              fontWeight: 300,
            }}
          >
            breathe
          </span>
        </div>

        {/* Status Indicators */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: GOD_CONFIG.theme.text.secondary }}>
            {secondaryActions?.length || 0} pathways
          </span>
          <span style={{ fontSize: '12px', color: GOD_CONFIG.theme.text.secondary }}>
            flow: {currentFlow}
          </span>
        </div>
      </div>
    </div>
  );
}
