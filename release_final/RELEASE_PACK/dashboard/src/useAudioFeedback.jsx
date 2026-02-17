import { useRef, useCallback } from 'react';

/**
 * A custom hook for providing audio feedback in the Cognitive Shield dashboard.
 * Plays subtle tones for connection events and batch updates.
 */
export const useAudioFeedback = () => {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = 0.1; // Low volume for subtle feedback
      } catch (error) {
        console.warn('Web Audio API not supported or blocked:', error);
      }
    }
  }, []);

  const playTone = useCallback((frequency, duration = 0.2) => {
    if (!audioContextRef.current) {
      initAudio();
    }
    
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      oscillator.connect(gainNodeRef.current);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Failed to play audio tone:', error);
    }
  }, [initAudio]);

  const playConnectionTone = useCallback(() => {
    playTone(523.25, 0.3); // C5 - connection established
  }, [playTone]);

  const playDisconnectionTone = useCallback(() => {
    playTone(349.23, 0.3); // F4 - connection lost
  }, [playTone]);

  const playUpdateTone = useCallback(() => {
    playTone(659.25, 0.15); // E5 - batch update received
  }, [playTone]);

  const playCoherenceTone = useCallback((coherence) => {
    const frequency = 440 + (coherence * 220); // A4 to A5 based on coherence
    playTone(frequency, 0.25);
  }, [playTone]);

  const playPowerUpTone = useCallback(() => {
    // A classic arcade-style power-up sound
    playTone(660, 0.1);
    setTimeout(() => playTone(880, 0.1), 100); // Two quick, rising tones
  }, [playTone]);

  return {
    playConnectionTone,
    playDisconnectionTone,
    playUpdateTone,
    playCoherenceTone,
    playPowerUpTone,
  };