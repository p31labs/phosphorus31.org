/**
 * 🌸 WONKY SPROUT - Built with Neurodivergent Love 🌸
 *
 * A gentle companion for neurodivergent hearts and their families.
 * Created with deep understanding of sensory sensitivities, emotional depths,
 * and the beautiful complexity of neurodivergent minds.
 *
 * You are not broken. You are beautifully different.
 * And in that difference lies your greatest strength.
 *
 * For the parents who love fiercely but sometimes feel lost.
 * For the children who think differently and dream bigger.
 * For the families navigating a world that wasn't built for them.
 *
 * This is your safe space. Your understanding friend. Your quiet strength.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface WonkySproutProps {
  onEnter?: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

interface GentlePetal {
  id: number;
  angle: number;
  size: number;
  color: string;
  animationDelay: number;
  emotionalState: 'peace' | 'curious' | 'loved' | 'safe' | 'understood';
}

interface NeurodivergentAffirmation {
  text: string;
  neurotype: 'ADHD' | 'Autism' | 'Dyslexia' | 'Gifted' | 'Trauma' | 'All';
  emotionalContext: 'overwhelm' | 'doubt' | 'pride' | 'connection' | 'healing';
}

// 🧠 Neurodivergent Love - Core Gentle State
const WonkySprout: React.FC<WonkySproutProps> = ({ onEnter, onThemeToggle, isDarkMode = true }) => {
  // Gentle State - No Overwhelm, Just Understanding
  const [currentMood, setCurrentMood] = useState<
    'peace' | 'curious' | 'loved' | 'overwhelmed' | 'proud'
  >('peace');
  const [isListening, setIsListening] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(
    "Hello, beautiful mind. I'm P31 Sprout. I'm here whenever you're ready. 🌸"
  );
  const [isBlooming, setIsBlooming] = useState(false);
  const [sensoryLoad, setSensoryLoad] = useState<'quiet' | 'gentle' | 'active'>('gentle');
  const [emotionalState, setEmotionalState] = useState<
    'calm' | 'excited' | 'tired' | 'confused' | 'proud'
  >('calm');
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [isSelfHugActive, setIsSelfHugActive] = useState(false);

  // Neurodivergent Affirmations - Built with Love
  const [affirmations] = useState<NeurodivergentAffirmation[]>([
    {
      text: 'Your brain is beautifully wired. Every thought pattern, every intense feeling, every deep connection - these are your superpowers.',
      neurotype: 'All',
      emotionalContext: 'doubt',
    },
    {
      text: "It's okay if the world feels too loud sometimes. Your sensitivity means you feel everything deeply - that's a gift, not a weakness.",
      neurotype: 'Autism',
      emotionalContext: 'overwhelm',
    },
    {
      text: "Your mind moves like lightning through ideas. That's not scattered thinking - that's creative brilliance finding new connections.",
      neurotype: 'ADHD',
      emotionalContext: 'doubt',
    },
    {
      text: "Words dancing on the page? That's your brain creating poetry from patterns. Dyslexia doesn't define your intelligence - it enhances your creativity.",
      neurotype: 'Dyslexia',
      emotionalContext: 'doubt',
    },
    {
      text: "Your big emotions, your deep thoughts, your intense experiences - these are signs of a mind that feels everything profoundly. That's your strength.",
      neurotype: 'Gifted',
      emotionalContext: 'pride',
    },
    {
      text: "Healing takes time, and every small step forward is a victory. You're not broken - you're becoming whole in your own beautiful way.",
      neurotype: 'Trauma',
      emotionalContext: 'healing',
    },
    {
      text: "Your nervous system knows things your conscious mind hasn't caught up to yet. Trust those feelings - they're trying to protect you.",
      neurotype: 'All',
      emotionalContext: 'connection',
    },
  ]);

  // Voice recognition setup
  const recognitionRef = useRef<any>(null);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🧠 Gentle Petals - Created with Understanding
  const petals = useMemo(() => {
    const emotionalStates: GentlePetal['emotionalState'][] = [
      'peace',
      'curious',
      'loved',
      'safe',
      'understood',
    ];
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 12,
      size: 0.8 + Math.random() * 0.4, // Gentle variation
      color: colors[i % colors.length],
      animationDelay: i * 0.1,
      emotionalState: emotionalStates[i % emotionalStates.length],
    }));
  }, []);

  // 💚 Neurodivergent Love - Gentle Interactions
  const handleGentleTouch = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distance = Math.sqrt(
        Math.pow(touch.clientX - centerX, 2) + Math.pow(touch.clientY - centerY, 2)
      );

      // Self-Hug Detection - Gentle Emergency Grounding
      if (distance < 100) {
        // Close to center
        const touchDuration = Date.now() - (touchStartTime || 0);
        if (touchDuration > 2000) {
          // Long press = self-hug
          setIsSelfHugActive(true);
          setCurrentMessage(
            "🤗 I'm here. You're safe. Take all the time you need. Your feelings are valid, your experiences matter, and you are loved exactly as you are."
          );
          setEmotionalState('calm');

          // Gentle haptic feedback if available
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 200, 100]); // Gentle pulse
          }

          // Auto-reset after grounding period
          setTimeout(() => {
            setIsSelfHugActive(false);
            setCurrentMessage(
              "Whenever you're ready, I'm here. No pressure, no expectations. Just gentle presence. 🌸"
            );
          }, 10000);
        }
      }
    },
    [touchStartTime]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setTouchStartTime(Date.now());
      handleGentleTouch(e);
    },
    [handleGentleTouch]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStartTime(null);
  }, []);

  // 🎤 Voice Commands - Built with Understanding
  const handleVoiceCommand = useCallback(
    (command: string) => {
      const cmd = command.toLowerCase();

      // Gentle processing - no rush
      setTimeout(() => {
        if (cmd.includes('help') || cmd.includes('lost') || cmd.includes('confused')) {
          const affirmation = affirmations.find(
            (a) => a.emotionalContext === 'doubt' || a.emotionalContext === 'overwhelm'
          );
          setCurrentMessage(
            affirmation?.text ||
              "I'm here. You're not alone in feeling this way. Take your time - there's no rush."
          );
          setEmotionalState('calm');
        } else if (cmd.includes('overwhelm') || cmd.includes('too much') || cmd.includes('loud')) {
          setSensoryLoad('quiet');
          setCurrentMessage(
            "I understand. Let's create some gentle space. Your sensitivity is a beautiful part of who you are - it means you experience the world deeply."
          );
          setEmotionalState('calm');
        } else if (cmd.includes('proud') || cmd.includes('good') || cmd.includes('accomplished')) {
          setCurrentMood('proud');
          setCurrentMessage(
            "I'm so proud of you too. Every step you take, every way you navigate this world differently - that's strength. That's courage. That's beautiful."
          );
        } else if (cmd.includes('family') || cmd.includes('parent') || cmd.includes('child')) {
          setCurrentMessage(
            "Families are complex, beautiful systems. Every member thinks, feels, and loves differently - and that's what makes your family special. You're doing important work connecting all those beautiful minds."
          );
        } else if (
          cmd.includes('different') ||
          cmd.includes('weird') ||
          cmd.includes('not normal')
        ) {
          setCurrentMessage(
            "Different isn't wrong - it's just different. Your brain, your heart, your way of experiencing the world - these are gifts. They make you uniquely you, and the world needs exactly that."
          );
        } else if (cmd.includes('safe') || cmd.includes('scared') || cmd.includes('anxious')) {
          setCurrentMessage(
            "You're safe here with me. Your feelings are valid, your experiences are real, and you matter. We can take this one gentle step at a time."
          );
          setEmotionalState('safe');
        } else if (cmd.includes('thank you') || cmd.includes('grateful')) {
          setCurrentMessage(
            "You're so welcome. Being here for you, understanding you, celebrating your beautiful differences - that's what I'm made for. Thank you for trusting me with your heart."
          );
        } else {
          // Gentle fallback - never make them feel wrong
          setCurrentMessage(
            "I hear you. I'm here to understand and support you in whatever way you need. Take your time - I'm not going anywhere."
          );
        }
      }, 500); // Gentle delay - no rushing
    },
    [affirmations]
  );

  // 🎯 Start Voice Listening - Gentle and Optional
  const startListening = useCallback(() => {
    if (!isListening && recognitionRef.current) {
      setIsListening(true);
      setCurrentMessage(
        "I'm listening whenever you're ready. No pressure - say whatever comes to mind. 🌸"
      );
      recognitionRef.current.start();
    }
  }, [isListening]);

  // 🌸 Gentle Bloom Animation
  useEffect(() => {
    const timer = setTimeout(() => setIsBlooming(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🎨 Dynamic Emotional Coloring
  const getEmotionalColor = useCallback(() => {
    switch (emotionalState) {
      case 'calm':
        return '#10b981'; // Gentle green
      case 'excited':
        return '#8b5cf6'; // Soft purple
      case 'tired':
        return '#06b6d4'; // Calm blue
      case 'confused':
        return '#f59e0b'; // Warm amber
      case 'proud':
        return '#ec4899'; // Loving pink
      default:
        return '#8b5cf6';
    }
  }, [emotionalState]);

  // 🎭 Current Affirmation Based on State
  const getCurrentAffirmation = useCallback(() => {
    const relevant = affirmations.filter(
      (a) => a.emotionalContext === emotionalState || a.neurotype === 'All'
    );
    return (
      relevant[Math.floor(Math.random() * relevant.length)]?.text ||
      "You are beautifully complex, wonderfully unique, and perfectly you. That's enough."
    );
  }, [emotionalState, affirmations]);

  // 🌟 Render the Gentle Interface
  return (
    <div
      className="wonky-sprout-gentle"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: isSelfHugActive
          ? 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
          : 'radial-gradient(circle at center, #0f172a 0%, #1e293b 50%, #334155 100%)',
        overflow: 'hidden',
        transition: 'all 3s ease-in-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleGentleTouch}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🌸 Gentle Central Flower */}
      <div
        className="gentle-center"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSelfHugActive ? '200px' : '150px',
          height: isSelfHugActive ? '200px' : '150px',
          borderRadius: '50%',
          background: `radial-gradient(circle,
            ${getEmotionalColor()}40 0%,
            ${getEmotionalColor()}20 50%,
            transparent 100%)`,
          animation: isBlooming ? 'gentle-pulse 8s ease-in-out infinite' : 'none',
          transition: 'all 2s ease-in-out',
          cursor: 'pointer',
        }}
        onClick={startListening}
      >
        {/* Gentle Petals */}
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="gentle-petal"
            style={{
              position: 'absolute',
              width: '30px',
              height: '60px',
              background: petal.color,
              borderRadius: '15px 15px 50% 50%',
              transformOrigin: 'center bottom',
              transform: `
                rotate(${petal.angle}deg)
                translateY(-${40 * petal.size}px)
                scale(${isBlooming ? 1 : 0.3})
              `,
              opacity: isBlooming ? 0.8 : 0.4,
              transition: `all 2s ease-in-out ${petal.animationDelay}s`,
              animation: isSelfHugActive ? 'gentle-glow 4s ease-in-out infinite' : 'none',
            }}
          />
        ))}

        {/* Center Heart */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            opacity: 0.9,
          }}
        >
          {isSelfHugActive ? '🤗' : '🌸'}
        </div>
      </div>

      {/* 💬 Gentle Message */}
      {currentMessage && (
        <div
          className="gentle-message"
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '400px',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${getEmotionalColor()}40`,
            animation: 'gentle-fade-in 2s ease-out',
          }}
        >
          <p
            style={{
              color: '#e2e8f0',
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0,
              fontFamily: 'Georgia, serif',
            }}
          >
            {currentMessage}
          </p>
        </div>
      )}

      {/* 🎤 Listening Indicator */}
      {isListening && (
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: getEmotionalColor(),
            fontSize: '18px',
            animation: 'gentle-pulse 2s ease-in-out infinite',
          }}
        >
          🎤 Listening...
        </div>
      )}

      {/* 💝 Current Affirmation */}
      {!isSelfHugActive && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '500px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '15px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${getEmotionalColor()}30`,
            fontSize: '14px',
            color: '#cbd5e1',
            lineHeight: '1.5',
            animation: 'gentle-fade-in 3s ease-out 1s both',
          }}
        >
          {getCurrentAffirmation()}
        </div>
      )}

      {/* 🌙 Instructions - Only when calm */}
      {emotionalState === 'calm' && !isSelfHugActive && (
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#94a3b8',
            fontSize: '14px',
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          Touch the flower to talk • Hold for a gentle hug • You're safe here
        </div>
      )}
    </div>
  );
};
export default WonkySprout;
