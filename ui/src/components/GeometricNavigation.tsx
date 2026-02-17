/**
 * AI-GUIDED GEOMETRIC NAVIGATION - Intelligent Tetrahedron-Based Spatial Interface
 * GOD Protocol UI/UX: Geometric Navigation, No Lists, Spatial Interfaces, AI Guidance
 *
 * Intelligent navigation that guides users through Cognitive Shield's capabilities
 * Uses user state, behavior patterns, and AI assistance for optimal experience
 * No assumptions - explains everything and provides contextual guidance
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Shield,
  Brain,
  Zap,
  Box,
  Heart,
  Radio,
  Code2,
  Target,
  Activity,
  Wind,
  Music,
  Calculator,
  Book,
  HelpCircle,
  Star,
  Info,
  Sparkles,
  LifeBuoy,
  Rocket,
  ChevronUp,
  ChevronDown,
  X,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Cpu,
} from 'lucide-react';
import GOD_CONFIG from '@/god.config';
import { triggerHapticPulse } from '@/lib/haptic-feedback';
import { useShieldStore } from '@/stores/shield.store';
import { useHeartbeatStore } from '@/stores/heartbeat.store';

// AI-Guided tetrahedron vertices with intelligent recommendations and educational content
const TETRAHEDRON_VERTICES = [
  {
    id: 'core',
    name: 'CORE',
    description: 'Your Shield & Message Processing',
    longDescription:
      'Real-time cognitive protection, message analysis, and voltage regulation. This is where Cognitive Shield actively protects your communication.',
    icon: Shield,
    color: GOD_CONFIG.theme.text.accent,
    shadowColor: `${GOD_CONFIG.theme.text.accent}40`,
    position: [0, 120, 0],
    tabs: ['shield', 'compose', 'heartbeat', 'tetrahedron'],
    accessibilityLabel: 'Core protection systems',
    aiGuidance: {
      beginner:
        "Start here! This is Cognitive Shield's main protection system. It analyzes messages for emotional intensity and helps you respond safely.",
      intermediate:
        'Your core defense system. Check here for message processing status and real-time protection metrics.',
      expert:
        'Advanced shield operations. Monitor voltage levels, processing queues, and system health.',
    },
    priority: 'high',
    recommendedFor: ['new_users', 'high_voltage_situations', 'communication_help'],
  },
  {
    id: 'mind',
    name: 'MIND',
    description: 'AI Intelligence & Creation Tools',
    longDescription:
      'PHENIX AI companion, module development, mathematical analysis, and creative problem-solving tools.',
    icon: Brain,
    color: '#8b5cf6',
    shadowColor: '#8b5cf640',
    position: [-85, -40, 50],
    tabs: ['phenix', 'module-maker', 'module-manager', 'nerd-lab', 'math'],
    accessibilityLabel: 'AI and creative intelligence systems',
    aiGuidance: {
      beginner:
        'Meet PHENIX! Your AI companion that understands emotional complexity. Perfect for getting AI assistance without the typical chatbot experience.',
      intermediate:
        'Access PHENIX for nuanced conversations, create custom tools, and explore mathematical modeling of relationships.',
      expert:
        'Advanced AI operations: custom module development, mathematical relationship modeling, and AI-assisted problem solving.',
    },
    priority: 'high',
    recommendedFor: ['ai_assistance', 'problem_solving', 'learning'],
  },
  {
    id: 'body',
    name: 'BODY',
    description: 'Somatic & Sensory Regulation',
    longDescription:
      'Physical regulation tools, breathing exercises, sensory processing aids, and nervous system support.',
    icon: Heart,
    color: '#22c55e',
    shadowColor: '#22c55e40',
    position: [85, -40, 50],
    tabs: ['somatic', 'breath', 'sonic', 'frequencies'],
    accessibilityLabel: 'Physical and sensory regulation systems',
    aiGuidance: {
      beginner:
        'Essential for emotional regulation! Use breathing exercises, sensory tools, and nervous system support when feeling overwhelmed.',
      intermediate:
        'Advanced somatic regulation: biofeedback, frequency therapy, and personalized sensory integration protocols.',
      expert:
        'Precision nervous system regulation: custom frequency protocols, advanced biofeedback, and physiological optimization.',
    },
    priority: 'medium',
    recommendedFor: ['emotional_regulation', 'sensory_processing', 'stress_management'],
  },
  {
    id: 'spirit',
    name: 'SPIRIT',
    description: 'Growth & Human Connection',
    longDescription:
      'Personal development, relationship tools, spiritual exploration, and human connection support.',
    icon: Sparkles,
    color: '#f59e0b',
    shadowColor: '#f59e0b40',
    position: [0, -40, -85],
    tabs: ['love-letter', 'grimoire', 'coherence-quest', 'story', 'features'],
    accessibilityLabel: 'Personal growth and connection systems',
    aiGuidance: {
      beginner:
        'Explore personal growth and relationships with AI guidance. Perfect for understanding complex human dynamics.',
      intermediate:
        'Deep relationship analysis, personal narrative development, and AI-assisted emotional intelligence.',
      expert:
        'Advanced human dynamics: relationship mathematics, narrative coherence analysis, and interpersonal intelligence modeling.',
    },
    priority: 'low',
    recommendedFor: ['personal_growth', 'relationships', 'self_reflection'],
  },
];

// Enhanced secondary navigation with better organization
const SECONDARY_NAVIGATION = [
  {
    category: 'Tools',
    items: [
      { id: 'phenix-navigator', label: 'Phenix Navigator', icon: Zap, emoji: '🔺' },
      { id: 'repository', label: 'Module Repository', icon: Code2, emoji: '📦' },
      { id: 'library', label: 'Cognitive Library', icon: Book, emoji: '📚' },
      { id: 'nerd-lab', label: 'Nerd Lab', icon: Calculator, emoji: '🔬' },
    ],
  },
  {
    category: 'Support',
    items: [
      { id: 'onboarding', label: 'Onboarding', icon: Rocket, emoji: '🎭' },
      { id: 'survival', label: 'Survival Guide', icon: LifeBuoy, emoji: '🆘' },
      { id: 'safe', label: 'Safe Space', icon: Heart, emoji: '❤️' },
      { id: 'faq', label: 'FAQ', icon: HelpCircle, emoji: '❓' },
    ],
  },
  {
    category: 'System',
    items: [
      { id: 'first-light', label: 'First Light', icon: Target, emoji: '✅' },
      { id: 'maintenance', label: 'Maintenance', icon: Activity, emoji: '🔧' },
      { id: 'calibration', label: 'Calibration', icon: Target, emoji: '🎯' },
      { id: 'about', label: 'About', icon: Info, emoji: 'ℹ️' },
    ],
  },
];

type Tab =
  | 'phenix-navigator'
  | 'repository'
  | 'library'
  | 'onboarding'
  | 'shield'
  | 'compose'
  | 'safe'
  | 'heartbeat'
  | 'tetrahedron'
  | 'first-light'
  | 'maintenance'
  | 'kenosis'
  | 'forensic'
  | 'pre-launch'
  | 'broadcast'
  | 'calibration'
  | 'abdication'
  | 'module-maker'
  | 'module-manager'
  | 'my-modules'
  | 'somatic'
  | 'breath'
  | 'sonic'
  | 'frequencies'
  | 'nerd-lab'
  | 'math'
  | 'story'
  | 'faq'
  | 'features'
  | 'love-letter'
  | 'manifesto'
  | 'grimoire'
  | 'stars'
  | 'frequencies'
  | 'survival'
  | 'phenix'
  | 'coherence-quest'
  | 'about';

interface UserState {
  isNewUser: boolean;
  spoons: number;
  hasUnprocessedMessages: boolean;
  voltageLevel: number;
  recentActivity: string[];
  preferredVertex: string | null;
}

interface GeometricNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  className?: string;
  isHighContrast?: boolean;
  reducedMotion?: boolean;
  userState?: UserState;
}

export default function GeometricNavigation({
  activeTab,
  onTabChange,
  className = '',
  isHighContrast = false,
  reducedMotion = false,
  userState,
}: GeometricNavigationProps) {
  const [expandedVertex, setExpandedVertex] = useState<string | null>(null);
  const [showSecondary, setShowSecondary] = useState(false);
  const [hoveredVertex, setHoveredVertex] = useState<string | null>(null);
  const [focusedVertex, setFocusedVertex] = useState<string | null>(null);
  const [showGuidance, setShowGuidance] = useState(true);
  const [guidanceStep, setGuidanceStep] = useState(0);
  const tetrahedronRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Get real-time user state from stores
  const { operator } = useHeartbeatStore();
  const { processedPayload, voltage, buffer } = useShieldStore();

  const currentUserState: UserState = useMemo(
    () => ({
      isNewUser:
        !processedPayload && operator.lastCheckIn.getTime() > Date.now() - 24 * 60 * 60 * 1000, // New if no processed messages and recent check-in
      spoons: operator.spoons,
      hasUnprocessedMessages: buffer.length > 0,
      voltageLevel: voltage,
      recentActivity: [], // Could track this
      preferredVertex: null, // Could learn from usage patterns
    }),
    [operator, processedPayload, voltage, buffer]
  );

  // AI-powered recommendations based on user state
  const aiRecommendations = useMemo(() => {
    const recommendations: string[] = [];
    const state = currentUserState;

    if (state.isNewUser) {
      recommendations.push(
        'Welcome! Start with CORE to understand your cognitive protection, then explore PHENIX for AI assistance.'
      );
    }

    if (state.hasUnprocessedMessages) {
      recommendations.push(
        'You have unprocessed messages in your buffer. Check CORE for safe message handling.'
      );
    }

    if (state.spoons < 40) {
      recommendations.push(
        'Your energy levels are low. Consider BODY tools for somatic regulation and recovery.'
      );
    }

    if (state.voltageLevel > 7) {
      recommendations.push(
        'High emotional voltage detected. Use CORE shield tools for safe communication.'
      );
    }

    if (state.spoons > 80 && !state.hasUnprocessedMessages) {
      recommendations.push(
        'Great energy levels! Consider MIND tools for creative exploration or personal growth.'
      );
    }

    return recommendations;
  }, [currentUserState]);

  // Smart defaults based on user state with AI guidance
  const smartDefaultVertex = useMemo(() => {
    const state = currentUserState;

    // New users always start with core for safety introduction
    if (state.isNewUser) return 'core';

    // High priority situations
    if (state.hasUnprocessedMessages) return 'core';
    if (state.voltageLevel > 7) return 'core';
    if (state.spoons < 40) return 'body';

    // Good energy = exploration opportunities
    if (state.spoons > 80) return 'mind';

    // Default safe choice
    return 'core';
  }, [currentUserState]);

  // AI-guided onboarding for new users
  const shouldShowOnboarding = currentUserState.isNewUser && activeTab === 'shield';
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (shouldShowOnboarding && onboardingStep < 3) {
      const timer = setTimeout(() => {
        setOnboardingStep((prev) => prev + 1);
      }, 3000); // 3 seconds per step
      return () => clearTimeout(timer);
    }
  }, [shouldShowOnboarding, onboardingStep]);

  // Find which vertex contains the active tab
  const getActiveVertex = useCallback(() => {
    for (const vertex of TETRAHEDRON_VERTICES) {
      if (vertex.tabs.includes(activeTab)) {
        return vertex.id;
      }
    }
    return smartDefaultVertex;
  }, [activeTab, smartDefaultVertex]);

  const activeVertex = getActiveVertex();

  // AI-guided vertex recommendations
  const getVertexRecommendation = useCallback(
    (vertexId: string) => {
      const vertex = TETRAHEDRON_VERTICES.find((v) => v.id === vertexId);
      if (!vertex) return null;

      const state = currentUserState;
      let userLevel: 'beginner' | 'intermediate' | 'expert' = 'beginner';

      if (state.isNewUser) {
        userLevel = 'beginner';
      } else if (processedPayload) {
        userLevel = 'intermediate';
      } else {
        userLevel = 'expert';
      }

      return vertex.aiGuidance[userLevel];
    },
    [currentUserState, processedPayload]
  );

  // Enhanced haptic feedback with different intensities
  const handleVertexInteraction = useCallback(
    (vertexId: string, action: 'hover' | 'focus' | 'click') => {
      const intensities = {
        hover: 'light' as const,
        focus: 'light' as const,
        click: 'medium' as const,
      };
      triggerHapticPulse(intensities[action]);
    },
    []
  );

  // Handle vertex click with enhanced feedback
  const handleVertexClick = useCallback(
    (vertexId: string) => {
      handleVertexInteraction(vertexId, 'click');

      if (expandedVertex === vertexId) {
        setExpandedVertex(null);
      } else {
        setExpandedVertex(vertexId);
        const vertex = TETRAHEDRON_VERTICES.find((v) => v.id === vertexId);
        if (vertex && vertex.tabs.length > 0) {
          // Add slight delay for better UX
          setTimeout(() => onTabChange(vertex.tabs[0] as Tab), 150);
        }
      }
    },
    [expandedVertex, handleVertexInteraction, onTabChange]
  );

  const handleTabClick = useCallback(
    (tab: Tab) => {
      triggerHapticPulse('light');
      onTabChange(tab);
      // Keep vertex expanded for better navigation flow
      // setExpandedVertex(null);
    },
    [onTabChange]
  );

  const handleSecondaryToggle = useCallback(() => {
    triggerHapticPulse('medium');
    setShowSecondary(!showSecondary);
  }, [showSecondary]);

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, vertexId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleVertexClick(vertexId);
      } else if (event.key === 'Escape') {
        setExpandedVertex(null);
        setFocusedVertex(null);
      }
    },
    [handleVertexClick]
  );

  // Smooth animations using requestAnimationFrame
  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      // Add subtle floating animation to vertices
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <nav
      className={`geometric-navigation ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: showSecondary ? '500px' : '280px',
        transition: reducedMotion ? 'none' : 'min-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '20px',
        borderRadius: '16px',
        background: `linear-gradient(135deg, ${GOD_CONFIG.theme.bg.secondary} 0%, ${GOD_CONFIG.theme.bg.primary} 100%)`,
        border: `1px solid ${GOD_CONFIG.theme.border.default}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
      role="navigation"
      aria-label="AI-Guided Cognitive Shield Navigation"
    >
      {/* AI Guidance Header */}
      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: GOD_CONFIG.theme.bg.primary,
          borderRadius: '12px',
          border: `1px solid ${GOD_CONFIG.theme.border.default}`,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} color={GOD_CONFIG.theme.text.accent} />
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: GOD_CONFIG.theme.text.primary,
                fontFamily: GOD_CONFIG.typography.fontFamily.display,
              }}
            >
              AI Navigation Guide
            </h3>
          </div>
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            style={{
              background: 'none',
              border: 'none',
              color: GOD_CONFIG.theme.text.muted,
              cursor: 'pointer',
              padding: '4px',
            }}
            aria-label={showGuidance ? 'Hide guidance' : 'Show guidance'}
          >
            {showGuidance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showGuidance && (
          <>
            {/* Current Status Indicators */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  backgroundColor: currentUserState.isNewUser ? '#fef3c7' : '#f0fdf4',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: currentUserState.isNewUser ? '#92400e' : '#166534',
                }}
              >
                <User size={12} />
                {currentUserState.isNewUser ? 'New User' : 'Returning User'}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  backgroundColor:
                    currentUserState.spoons < 40
                      ? '#fef2f2'
                      : currentUserState.spoons > 80
                        ? '#f0fdf4'
                        : '#fef3c7',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color:
                    currentUserState.spoons < 40
                      ? '#dc2626'
                      : currentUserState.spoons > 80
                        ? '#166534'
                        : '#92400e',
                }}
              >
                <Activity size={12} />
                {currentUserState.spoons} spoons
              </div>

              {currentUserState.hasUnprocessedMessages && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#92400e',
                  }}
                >
                  <MessageCircle size={12} />
                  Messages waiting
                </div>
              )}

              {currentUserState.voltageLevel > 7 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#dc2626',
                  }}
                >
                  <AlertCircle size={12} />
                  High voltage
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: `${GOD_CONFIG.theme.text.accent}10`,
                  borderRadius: '8px',
                  border: `1px solid ${GOD_CONFIG.theme.text.accent}30`,
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: GOD_CONFIG.theme.text.accent,
                  }}
                >
                  <TrendingUp size={16} />
                  AI Recommendations
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '13px',
                    color: GOD_CONFIG.theme.text.secondary,
                    lineHeight: 1.4,
                  }}
                >
                  {aiRecommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Current Guidance */}
            {getVertexRecommendation(activeVertex) && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: GOD_CONFIG.theme.text.primary,
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <CheckCircle
                    size={16}
                    color={GOD_CONFIG.theme.text.accent}
                    style={{ marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <strong>Current Focus:</strong> {getVertexRecommendation(activeVertex)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Tetrahedron Container with 3D Perspective */}
      <div
        ref={tetrahedronRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
        aria-label="Tetrahedral navigation system"
      >
        {/* Tetrahedron Edges (visual connections) */}
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
          viewBox="0 0 300 200"
        >
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GOD_CONFIG.theme.border.default} stopOpacity="0.2" />
              <stop offset="50%" stopColor={GOD_CONFIG.theme.border.default} stopOpacity="0.6" />
              <stop offset="100%" stopColor={GOD_CONFIG.theme.border.default} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Tetrahedron edges connecting vertices */}
          <line x1="150" y1="30" x2="75" y2="120" stroke="url(#edgeGradient)" strokeWidth="1" />
          <line x1="150" y1="30" x2="225" y2="120" stroke="url(#edgeGradient)" strokeWidth="1" />
          <line x1="150" y1="30" x2="150" y2="160" stroke="url(#edgeGradient)" strokeWidth="1" />
          <line x1="75" y2="120" x2="225" y2="120" stroke="url(#edgeGradient)" strokeWidth="1" />
          <line x1="75" y2="120" x2="150" y2="160" stroke="url(#edgeGradient)" strokeWidth="1" />
          <line x1="225" y2="120" x2="150" y2="160" stroke="url(#edgeGradient)" strokeWidth="1" />
        </svg>

        {/* Tetrahedron Vertices */}
        {TETRAHEDRON_VERTICES.map((vertex) => {
          const Icon = vertex.icon;
          const isActive = activeVertex === vertex.id;
          const isExpanded = expandedVertex === vertex.id;
          const isHovered = hoveredVertex === vertex.id;
          const isFocused = focusedVertex === vertex.id;

          return (
            <div
              key={vertex.id}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(${vertex.position[0]}px, ${vertex.position[1]}px)`,
                transition: reducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: isExpanded ? 50 : isActive ? 30 : 10,
              }}
            >
              {/* Vertex Button with AI Guidance */}
              <button
                onClick={() => handleVertexClick(vertex.id)}
                onMouseEnter={() => {
                  setHoveredVertex(vertex.id);
                  handleVertexInteraction(vertex.id, 'hover');
                }}
                onMouseLeave={() => setHoveredVertex(null)}
                onFocus={() => {
                  setFocusedVertex(vertex.id);
                  handleVertexInteraction(vertex.id, 'focus');
                }}
                onBlur={() => setFocusedVertex(null)}
                onKeyDown={(e) => handleKeyDown(e, vertex.id)}
                style={{
                  width: isExpanded ? '88px' : isActive ? '72px' : isHovered ? '64px' : '56px',
                  height: isExpanded ? '88px' : isActive ? '72px' : isHovered ? '64px' : '56px',
                  borderRadius: '50%',
                  border: `3px solid ${isActive ? vertex.color : isHovered ? vertex.color : GOD_CONFIG.theme.border.default}`,
                  background: isActive
                    ? `radial-gradient(circle, ${vertex.color}30 0%, ${vertex.color}10 70%, transparent 100%)`
                    : isHovered
                      ? `${vertex.color}15`
                      : GOD_CONFIG.theme.bg.primary,
                  color: isActive ? vertex.color : GOD_CONFIG.theme.text.primary,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: reducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive
                    ? `0 0 40px ${vertex.shadowColor}, 0 8px 24px rgba(0,0,0,0.15)`
                    : isHovered
                      ? `0 4px 16px ${vertex.shadowColor}, 0 4px 12px rgba(0,0,0,0.1)`
                      : '0 2px 8px rgba(0,0,0,0.08)',
                  transform: isExpanded
                    ? 'scale(1.2) translateZ(20px)'
                    : isActive
                      ? 'scale(1.1) translateZ(10px)'
                      : isHovered
                        ? 'scale(1.05) translateZ(5px)'
                        : 'scale(1) translateZ(0px)',
                  outline: isFocused ? `2px solid ${vertex.color}` : 'none',
                  outlineOffset: '2px',
                  position: 'relative',
                }}
                aria-label={`${vertex.name}: ${vertex.description}. ${getVertexRecommendation(vertex.id) || ''}. ${isExpanded ? 'Expanded' : 'Collapsed'}. ${isActive ? 'Currently active' : ''}`}
                aria-expanded={isExpanded}
                aria-controls={`vertex-${vertex.id}-menu`}
              >
                {/* AI Recommendation Indicator */}
                {vertex.recommendedFor.some(
                  (reason) =>
                    (reason === 'new_users' && currentUserState.isNewUser) ||
                    (reason === 'high_voltage_situations' && currentUserState.voltageLevel > 7) ||
                    (reason === 'communication_help' && currentUserState.hasUnprocessedMessages) ||
                    (reason === 'emotional_regulation' && currentUserState.spoons < 40) ||
                    (reason === 'ai_assistance' && currentUserState.spoons > 60)
                ) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: vertex.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#fff',
                      border: `2px solid ${GOD_CONFIG.theme.bg.primary}`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    ✨
                  </div>
                )}
                <Icon
                  size={isExpanded ? 28 : isActive ? 24 : isHovered ? 22 : 20}
                  style={{
                    transition: reducedMotion ? 'none' : 'all 0.3s ease',
                    filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                  }}
                />
                <span
                  style={{
                    fontSize: isExpanded ? '11px' : '9px',
                    fontWeight: 700,
                    fontFamily: GOD_CONFIG.typography.fontFamily.display,
                    marginTop: '4px',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                  }}
                >
                  {vertex.name}
                </span>

                {/* Activity indicator */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: vertex.color,
                      border: `2px solid ${GOD_CONFIG.theme.bg.primary}`,
                      animation: reducedMotion ? 'none' : 'pulse 2s infinite',
                    }}
                    aria-label="Active vertex indicator"
                  />
                )}
              </button>

              {/* AI-Guided Expanded Menu */}
              {isExpanded && (
                <div
                  id={`vertex-${vertex.id}-menu`}
                  role="dialog"
                  aria-label={`${vertex.name} - ${vertex.description}`}
                  aria-describedby={`vertex-${vertex.id}-description`}
                  style={{
                    position: 'absolute',
                    top: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: GOD_CONFIG.theme.bg.primary,
                    border: `2px solid ${vertex.color}`,
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: `0 12px 48px ${vertex.shadowColor}, 0 8px 24px rgba(0,0,0,0.15)`,
                    zIndex: 100,
                    minWidth: '280px',
                    maxWidth: '320px',
                    backdropFilter: 'blur(12px)',
                    animation: reducedMotion ? 'none' : 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Menu Header with AI Guidance */}
                  <div
                    style={{
                      marginBottom: '16px',
                      paddingBottom: '12px',
                      borderBottom: `1px solid ${GOD_CONFIG.theme.border.default}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <vertex.icon size={20} color={vertex.color} />
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 700,
                          color: vertex.color,
                          fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        }}
                      >
                        {vertex.name}
                      </h3>
                      {vertex.priority === 'high' && (
                        <span
                          style={{
                            padding: '2px 6px',
                            backgroundColor: vertex.color,
                            color: '#fff',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          Priority
                        </span>
                      )}
                    </div>

                    <p
                      id={`vertex-${vertex.id}-description`}
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        color: GOD_CONFIG.theme.text.secondary,
                        lineHeight: 1.4,
                      }}
                    >
                      {vertex.description}
                    </p>

                    {/* AI Guidance for this vertex */}
                    {getVertexRecommendation(vertex.id) && (
                      <div
                        style={{
                          padding: '10px',
                          backgroundColor: `${vertex.color}10`,
                          borderRadius: '8px',
                          border: `1px solid ${vertex.color}20`,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px',
                            fontSize: '12px',
                            color: GOD_CONFIG.theme.text.primary,
                            lineHeight: 1.4,
                          }}
                        >
                          <Cpu
                            size={14}
                            color={vertex.color}
                            style={{ marginTop: '1px', flexShrink: 0 }}
                          />
                          <div>
                            <strong style={{ color: vertex.color }}>AI Guidance:</strong>{' '}
                            {getVertexRecommendation(vertex.id)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Tab Options with Descriptions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {vertex.tabs.map((tab) => {
                      const isTabActive = activeTab === tab;
                      const tabName = tab
                        .replace('-', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                      // Add helpful descriptions for each tab
                      const tabDescriptions: Record<string, string> = {
                        shield: 'Main protection interface - analyze and respond to messages',
                        compose: 'AI-assisted response composer with emotional intelligence',
                        heartbeat: 'Monitor your energy levels and system status',
                        tetrahedron: '3D visualization of your cognitive network',
                        phenix: 'AI companion for complex conversations',
                        'module-maker': 'Create custom tools and extensions',
                        'module-manager': 'Install and manage your tools',
                        'nerd-lab': 'Advanced analytics and research tools',
                        math: 'Mathematical modeling of relationships',
                        somatic: 'Physical regulation and sensory tools',
                        breath: 'Guided breathing exercises',
                        sonic: 'Audio therapy and frequency tools',
                        frequencies: 'Biofeedback and resonance tools',
                        'love-letter': 'Relationship communication tools',
                        grimoire: 'Personal growth and reflection tools',
                        'coherence-quest': 'Guided personal development journeys',
                      };

                      return (
                        <button
                          key={tab}
                          onClick={() => handleTabClick(tab as Tab)}
                          role="menuitem"
                          title={tabDescriptions[tab] || tabName}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isTabActive ? `${vertex.color}20` : 'transparent',
                            border: `1px solid ${isTabActive ? vertex.color : 'transparent'}`,
                            borderRadius: '10px',
                            color: isTabActive ? vertex.color : GOD_CONFIG.theme.text.primary,
                            fontSize: '13px',
                            fontWeight: isTabActive ? 600 : 500,
                            fontFamily: GOD_CONFIG.typography.fontFamily.display,
                            cursor: 'pointer',
                            transition: reducedMotion ? 'none' : 'all 0.2s ease',
                            textAlign: 'left',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${vertex.color}10`;
                            e.currentTarget.style.transform = 'translateX(2px) translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 4px 12px ${vertex.shadowColor}`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isTabActive
                              ? `${vertex.color}20`
                              : 'transparent';
                            e.currentTarget.style.transform = 'translateX(0) translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>{tabName}</div>
                            {tabDescriptions[tab] && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: GOD_CONFIG.theme.text.secondary,
                                  lineHeight: 1.3,
                                  opacity: 0.8,
                                }}
                              >
                                {tabDescriptions[tab]}
                              </div>
                            )}
                          </div>
                          {isTabActive && (
                            <div
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: vertex.color,
                                flexShrink: 0,
                                marginTop: '2px',
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setExpandedVertex(null)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: `${vertex.color}20`,
                      color: vertex.color,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                    }}
                    aria-label="Close menu"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${vertex.color}30`;
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${vertex.color}20`;
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enhanced Secondary Navigation */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <button
          onClick={handleSecondaryToggle}
          style={{
            padding: '10px 20px',
            backgroundColor: showSecondary
              ? GOD_CONFIG.theme.text.accent
              : GOD_CONFIG.theme.bg.primary,
            border: `2px solid ${showSecondary ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
            borderRadius: '25px',
            color: showSecondary ? '#fff' : GOD_CONFIG.theme.text.primary,
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: GOD_CONFIG.typography.fontFamily.display,
            cursor: 'pointer',
            transition: reducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: showSecondary
              ? `0 4px 16px ${GOD_CONFIG.theme.text.accent}40`
              : '0 2px 8px rgba(0,0,0,0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
          aria-expanded={showSecondary}
          aria-controls="secondary-navigation"
        >
          {showSecondary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showSecondary ? 'COLLAPSE' : 'EXPAND'} NAVIGATION
        </button>
      </div>

      {/* Enhanced Secondary Navigation Grid */}
      {showSecondary && (
        <div
          id="secondary-navigation"
          role="region"
          aria-label="Extended navigation options"
          style={{
            marginTop: '20px',
            padding: '24px',
            backgroundColor: GOD_CONFIG.theme.bg.primary,
            borderRadius: '16px',
            border: `1px solid ${GOD_CONFIG.theme.border.default}`,
            animation: reducedMotion ? 'none' : 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {SECONDARY_NAVIGATION.map((category) => (
            <div key={category.category} style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: GOD_CONFIG.theme.text.primary,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {category.category}
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '8px',
                }}
              >
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id as Tab)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        backgroundColor: isActive
                          ? `${GOD_CONFIG.theme.text.accent}15`
                          : GOD_CONFIG.theme.bg.secondary,
                        border: `1px solid ${isActive ? GOD_CONFIG.theme.text.accent : GOD_CONFIG.theme.border.default}`,
                        borderRadius: '12px',
                        color: isActive
                          ? GOD_CONFIG.theme.text.accent
                          : GOD_CONFIG.theme.text.primary,
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        fontFamily: GOD_CONFIG.typography.fontFamily.display,
                        cursor: 'pointer',
                        transition: reducedMotion
                          ? 'none'
                          : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'left',
                        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = `${GOD_CONFIG.theme.text.accent}08`;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = GOD_CONFIG.theme.bg.secondary;
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI-Guided Onboarding Overlay for New Users */}
      {shouldShowOnboarding && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.5s ease',
          }}
          role="dialog"
          aria-label="Welcome to Cognitive Shield"
        >
          <div
            style={{
              backgroundColor: GOD_CONFIG.theme.bg.primary,
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: `2px solid ${GOD_CONFIG.theme.text.accent}`,
              position: 'relative',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Shield
                size={48}
                color={GOD_CONFIG.theme.text.accent}
                style={{ marginBottom: '16px' }}
              />
              <h2
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: GOD_CONFIG.theme.text.primary,
                  fontFamily: GOD_CONFIG.typography.fontFamily.display,
                }}
              >
                Welcome to Cognitive Shield
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '16px',
                  color: GOD_CONFIG.theme.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                Your AI-powered guide to safer, smarter communication
              </p>
            </div>

            {/* Onboarding Steps */}
            <div style={{ marginBottom: '24px' }}>
              {onboardingStep === 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: `${GOD_CONFIG.theme.text.accent}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Shield size={40} color={GOD_CONFIG.theme.text.accent} />
                  </div>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '18px',
                      color: GOD_CONFIG.theme.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    Step 1: Your Shield is Active
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: GOD_CONFIG.theme.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    Cognitive Shield analyzes messages for emotional intensity and helps you respond
                    with clarity and care. Think of it as your communication bodyguard.
                  </p>
                </div>
              )}

              {onboardingStep === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#8b5cf620',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Brain size={40} color="#8b5cf6" />
                  </div>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '18px',
                      color: GOD_CONFIG.theme.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    Step 2: Meet PHENIX
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: GOD_CONFIG.theme.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    PHENIX is your AI companion who understands emotional complexity. Unlike typical
                    chatbots, PHENIX helps you navigate difficult conversations with empathy and
                    intelligence.
                  </p>
                </div>
              )}

              {onboardingStep === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Heart size={24} color="#22c55e" />
                    </div>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#f59e0b20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={24} color="#f59e0b" />
                    </div>
                  </div>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '18px',
                      color: GOD_CONFIG.theme.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    Step 3: Explore Your Powers
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: GOD_CONFIG.theme.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    Use BODY tools for emotional regulation and sensory support. Discover SPIRIT
                    tools for personal growth. Each section adapts to your current state and needs.
                  </p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '24px',
              }}
            >
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor:
                      step <= onboardingStep
                        ? GOD_CONFIG.theme.text.accent
                        : GOD_CONFIG.theme.border.default,
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setExpandedVertex(null)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: GOD_CONFIG.theme.bg.secondary,
                  border: `1px solid ${GOD_CONFIG.theme.border.default}`,
                  borderRadius: '10px',
                  color: GOD_CONFIG.theme.text.secondary,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Skip Tour
              </button>
              <button
                onClick={() => {
                  setExpandedVertex(null);
                  setOnboardingStep(0);
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: GOD_CONFIG.theme.text.accent,
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {onboardingStep < 2 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .geometric-navigation {
            padding: 16px !important;
            min-height: ${showSecondary ? '350px' : '160px'} !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .geometric-navigation * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
