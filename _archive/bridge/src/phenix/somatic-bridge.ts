/**
 * OMEGA PROTOCOL - MODULE D: SOMATIC BRIDGE (HAPTIC ONTOLOGY)
 * ============================================================
 * Tactile language that bypasses visual cortex
 * 
 * Implements:
 * - Haptic phoneme library with ADSR envelopes
 * - Semantic encoding (mesh health, threat level, emotional valence)
 * - Subconscious training loop
 * - AHAP/HJIF compatible pattern format
 * 
 * "The skin is a high-bandwidth data channel" - ~10-20 bits/sec
 */

import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// HAPTIC PRIMITIVE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ADSREnvelope {
  attack: number;    // Time to reach peak (ms)
  decay: number;     // Time to reach sustain level (ms)
  sustain: number;   // Sustain level (0-1)
  release: number;   // Time to reach zero (ms)
}

export interface HapticWaveform {
  type: 'sine' | 'square' | 'triangle' | 'noise' | 'pulse';
  frequency: number;          // Hz (typically 50-300 for haptics)
  amplitude: number;          // 0-1
  duration: number;           // ms
  envelope?: ADSREnvelope;
}

export interface TextureParameters {
  grain: number;       // 0-1 (smooth to rough)
  friction: number;    // 0-1 (slippery to sticky)
  viscosity: number;   // 0-1 (thin to thick)
}

export interface HapticPhoneme {
  id: string;
  name: string;
  description: string;
  waveforms: HapticWaveform[];
  texture?: TextureParameters;
  semantic: SemanticCategory;
  intensity: number;   // 0-1
}

export type SemanticCategory = 
  | 'status'        // System status (health, connection)
  | 'alert'         // Warnings and threats
  | 'emotion'       // Emotional valence
  | 'navigation'    // Directional guidance
  | 'confirmation'  // Acknowledgment
  | 'custom';       // User-defined

export interface HapticPattern {
  id: string;
  name: string;
  description: string;
  phonemes: HapticPhonemeInstance[];
  totalDuration: number;
  semantic: SemanticCategory;
  metadata?: Record<string, unknown>;
}

export interface HapticPhonemeInstance {
  phonemeId: string;
  startTime: number;   // ms from pattern start
  intensity?: number;  // Override default intensity
}

// AHAP-compatible format (Apple Haptic Audio Pattern)
export interface AHAPPattern {
  Version: number;
  Metadata?: {
    Project: string;
    Created: string;
  };
  Pattern: AHAPEvent[];
}

export interface AHAPEvent {
  Event: {
    Time: number;
    EventType: 'HapticTransient' | 'HapticContinuous' | 'AudioCustom';
    EventParameters?: {
      HapticIntensity?: number;
      HapticSharpness?: number;
      AttackTime?: number;
      DecayTime?: number;
      ReleaseTime?: number;
      Sustained?: boolean;
    };
    EventDuration?: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HAPTIC PHONEME LIBRARY
// ─────────────────────────────────────────────────────────────────────────────

export class HapticPhonemeLibrary {
  private phonemes: Map<string, HapticPhoneme> = new Map();
  private patterns: Map<string, HapticPattern> = new Map();

  constructor() {
    this.initializeDefaultPhonemes();
    this.initializeDefaultPatterns();
  }

  private initializeDefaultPhonemes(): void {
    // Status phonemes
    this.addPhoneme({
      id: 'heartbeat-strong',
      name: 'Strong Heartbeat',
      description: 'Regular, strong pulse indicating healthy connection',
      waveforms: [
        { type: 'pulse', frequency: 1.2, amplitude: 1.0, duration: 100, 
          envelope: { attack: 10, decay: 30, sustain: 0.3, release: 60 } },
        { type: 'pulse', frequency: 1.2, amplitude: 0.6, duration: 80,
          envelope: { attack: 10, decay: 20, sustain: 0.2, release: 50 } }
      ],
      semantic: 'status',
      intensity: 0.8
    });

    this.addPhoneme({
      id: 'heartbeat-weak',
      name: 'Weak Heartbeat',
      description: 'Irregular, weak pulse indicating degraded connection',
      waveforms: [
        { type: 'pulse', frequency: 0.8, amplitude: 0.4, duration: 60,
          envelope: { attack: 20, decay: 20, sustain: 0.1, release: 20 } }
      ],
      semantic: 'status',
      intensity: 0.3
    });

    // Alert phonemes
    this.addPhoneme({
      id: 'bristle',
      name: 'Bristling Alert',
      description: 'High-frequency stochastic pulses simulating goosebumps',
      waveforms: [
        { type: 'noise', frequency: 200, amplitude: 0.7, duration: 50 },
        { type: 'noise', frequency: 180, amplitude: 0.5, duration: 30 },
        { type: 'noise', frequency: 220, amplitude: 0.8, duration: 40 }
      ],
      texture: { grain: 0.9, friction: 0.7, viscosity: 0.2 },
      semantic: 'alert',
      intensity: 0.9
    });

    this.addPhoneme({
      id: 'warning-pulse',
      name: 'Warning Pulse',
      description: 'Rhythmic attention-grabbing pulse',
      waveforms: [
        { type: 'square', frequency: 150, amplitude: 0.8, duration: 100 },
        { type: 'square', frequency: 150, amplitude: 0.8, duration: 100 }
      ],
      semantic: 'alert',
      intensity: 0.8
    });

    // Emotion phonemes
    this.addPhoneme({
      id: 'warm-swell',
      name: 'Warm Swell',
      description: 'Low-frequency expanding sensation for positive valence',
      waveforms: [
        { type: 'sine', frequency: 80, amplitude: 0.6, duration: 500,
          envelope: { attack: 200, decay: 100, sustain: 0.8, release: 200 } }
      ],
      texture: { grain: 0.1, friction: 0.3, viscosity: 0.6 },
      semantic: 'emotion',
      intensity: 0.6
    });

    this.addPhoneme({
      id: 'cool-retreat',
      name: 'Cool Retreat',
      description: 'Contracting sensation for negative valence',
      waveforms: [
        { type: 'sine', frequency: 120, amplitude: 0.5, duration: 300,
          envelope: { attack: 50, decay: 150, sustain: 0.2, release: 100 } }
      ],
      texture: { grain: 0.3, friction: 0.2, viscosity: 0.1 },
      semantic: 'emotion',
      intensity: 0.5
    });

    // Navigation phonemes
    this.addPhoneme({
      id: 'direction-left',
      name: 'Direction Left',
      description: 'Asymmetric pulse indicating left',
      waveforms: [
        { type: 'triangle', frequency: 100, amplitude: 0.8, duration: 150 },
        { type: 'triangle', frequency: 100, amplitude: 0.4, duration: 100 }
      ],
      semantic: 'navigation',
      intensity: 0.7
    });

    this.addPhoneme({
      id: 'direction-right',
      name: 'Direction Right',
      description: 'Asymmetric pulse indicating right',
      waveforms: [
        { type: 'triangle', frequency: 100, amplitude: 0.4, duration: 100 },
        { type: 'triangle', frequency: 100, amplitude: 0.8, duration: 150 }
      ],
      semantic: 'navigation',
      intensity: 0.7
    });

    // Confirmation phonemes
    this.addPhoneme({
      id: 'confirm-success',
      name: 'Success Confirmation',
      description: 'Rising tone indicating successful action',
      waveforms: [
        { type: 'sine', frequency: 150, amplitude: 0.6, duration: 80 },
        { type: 'sine', frequency: 200, amplitude: 0.8, duration: 120 }
      ],
      semantic: 'confirmation',
      intensity: 0.7
    });

    this.addPhoneme({
      id: 'confirm-error',
      name: 'Error Confirmation',
      description: 'Falling buzz indicating failed action',
      waveforms: [
        { type: 'square', frequency: 200, amplitude: 0.8, duration: 100 },
        { type: 'square', frequency: 120, amplitude: 0.6, duration: 150 }
      ],
      semantic: 'confirmation',
      intensity: 0.8
    });
  }

  private initializeDefaultPatterns(): void {
    // Mesh Health Pattern
    this.addPattern({
      id: 'mesh-health-good',
      name: 'Mesh Health Good',
      description: 'Strong, regular heartbeat indicating healthy mesh connection',
      phonemes: [
        { phonemeId: 'heartbeat-strong', startTime: 0 },
        { phonemeId: 'heartbeat-strong', startTime: 800 },
        { phonemeId: 'heartbeat-strong', startTime: 1600 }
      ],
      totalDuration: 2400,
      semantic: 'status'
    });

    this.addPattern({
      id: 'mesh-health-degraded',
      name: 'Mesh Health Degraded',
      description: 'Weak, irregular heartbeat indicating packet loss',
      phonemes: [
        { phonemeId: 'heartbeat-weak', startTime: 0 },
        { phonemeId: 'heartbeat-weak', startTime: 1000 }
      ],
      totalDuration: 1500,
      semantic: 'status'
    });

    // Threat Level Pattern
    this.addPattern({
      id: 'threat-detected',
      name: 'Threat Detected',
      description: 'Bristling sensation indicating potential threat',
      phonemes: [
        { phonemeId: 'bristle', startTime: 0 },
        { phonemeId: 'bristle', startTime: 100 },
        { phonemeId: 'bristle', startTime: 200 }
      ],
      totalDuration: 400,
      semantic: 'alert'
    });

    // Incoming Care Pattern
    this.addPattern({
      id: 'love-received',
      name: 'L.O.V.E. Token Received',
      description: 'Warm swelling sensation indicating care/value received',
      phonemes: [
        { phonemeId: 'warm-swell', startTime: 0 },
        { phonemeId: 'confirm-success', startTime: 600 }
      ],
      totalDuration: 900,
      semantic: 'emotion'
    });
  }

  addPhoneme(phoneme: HapticPhoneme): void {
    this.phonemes.set(phoneme.id, phoneme);
  }

  addPattern(pattern: HapticPattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  getPhoneme(id: string): HapticPhoneme | undefined {
    return this.phonemes.get(id);
  }

  getPattern(id: string): HapticPattern | undefined {
    return this.patterns.get(id);
  }

  getAllPhonemes(): HapticPhoneme[] {
    return Array.from(this.phonemes.values());
  }

  getAllPatterns(): HapticPattern[] {
    return Array.from(this.patterns.values());
  }

  getPhonemesByCategory(category: SemanticCategory): HapticPhoneme[] {
    return Array.from(this.phonemes.values()).filter(p => p.semantic === category);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HAPTIC ENGINE (Pattern Execution)
// ─────────────────────────────────────────────────────────────────────────────

export interface HapticActuatorConfig {
  type: 'LRA' | 'ERM' | 'piezo';
  maxFrequency: number;
  minFrequency: number;
  responseTime: number;   // ms
}

export class HapticEngine extends EventEmitter {
  private library: HapticPhonemeLibrary;
  private actuatorConfig: HapticActuatorConfig;
  private isPlaying: boolean = false;
  private currentPattern: HapticPattern | null = null;
  private playbackTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config?: Partial<HapticActuatorConfig>) {
    super();
    this.library = new HapticPhonemeLibrary();
    this.actuatorConfig = {
      type: 'LRA',
      maxFrequency: 300,
      minFrequency: 50,
      responseTime: 5,
      ...config
    };
  }

  /**
   * Play a pattern by ID
   */
  async playPattern(patternId: string, intensityMultiplier: number = 1.0): Promise<void> {
    const pattern = this.library.getPattern(patternId);
    if (!pattern) throw new Error(`Pattern not found: ${patternId}`);

    await this.executePattern(pattern, intensityMultiplier);
  }

  /**
   * Play a single phoneme
   */
  async playPhoneme(phonemeId: string, intensityMultiplier: number = 1.0): Promise<void> {
    const phoneme = this.library.getPhoneme(phonemeId);
    if (!phoneme) throw new Error(`Phoneme not found: ${phonemeId}`);

    await this.executePhoneme(phoneme, intensityMultiplier);
  }

  /**
   * Execute a full pattern
   */
  private async executePattern(pattern: HapticPattern, intensityMultiplier: number): Promise<void> {
    if (this.isPlaying) {
      this.stop();
    }

    this.isPlaying = true;
    this.currentPattern = pattern;
    this.emit('pattern:start', pattern.id);

    // Schedule each phoneme
    for (const instance of pattern.phonemes) {
      const phoneme = this.library.getPhoneme(instance.phonemeId);
      if (!phoneme) continue;

      const intensity = (instance.intensity ?? phoneme.intensity) * intensityMultiplier;

      // Schedule phoneme execution
      setTimeout(() => {
        if (this.isPlaying) {
          this.executePhoneme(phoneme, intensity);
        }
      }, instance.startTime);
    }

    // Schedule pattern end
    this.playbackTimer = setTimeout(() => {
      this.isPlaying = false;
      this.currentPattern = null;
      this.emit('pattern:end', pattern.id);
    }, pattern.totalDuration);
  }

  /**
   * Execute a single phoneme
   */
  private async executePhoneme(phoneme: HapticPhoneme, intensityMultiplier: number): Promise<void> {
    this.emit('phoneme:start', phoneme.id);

    for (const waveform of phoneme.waveforms) {
      await this.renderWaveform(waveform, intensityMultiplier * phoneme.intensity);
    }

    this.emit('phoneme:end', phoneme.id);
  }

  /**
   * Render a waveform to actuator commands
   * In production: send to DRV2605L driver via ESP32
   */
  private async renderWaveform(waveform: HapticWaveform, intensity: number): Promise<void> {
    // Clamp frequency to actuator range
    const frequency = Math.max(
      this.actuatorConfig.minFrequency,
      Math.min(this.actuatorConfig.maxFrequency, waveform.frequency)
    );

    const amplitude = waveform.amplitude * intensity;

    // Generate actuator command
    const command: ActuatorCommand = {
      type: waveform.type,
      frequency,
      amplitude,
      duration: waveform.duration,
      envelope: waveform.envelope
    };

    this.emit('actuator:command', command);

    // Simulate waveform duration
    await new Promise(r => setTimeout(r, waveform.duration));
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
    this.isPlaying = false;
    this.currentPattern = null;
    this.emit('playback:stopped');
  }

  /**
   * Convert pattern to AHAP format (for iOS export)
   */
  toAHAP(pattern: HapticPattern): AHAPPattern {
    const events: AHAPEvent[] = [];

    for (const instance of pattern.phonemes) {
      const phoneme = this.library.getPhoneme(instance.phonemeId);
      if (!phoneme) continue;

      let timeOffset = instance.startTime / 1000; // Convert to seconds

      for (const waveform of phoneme.waveforms) {
        const intensity = (instance.intensity ?? phoneme.intensity) * waveform.amplitude;
        const sharpness = waveform.type === 'noise' || waveform.type === 'square' ? 0.8 : 0.3;

        events.push({
          Event: {
            Time: timeOffset,
            EventType: waveform.duration < 100 ? 'HapticTransient' : 'HapticContinuous',
            EventParameters: {
              HapticIntensity: intensity,
              HapticSharpness: sharpness,
              ...(waveform.envelope && {
                AttackTime: waveform.envelope.attack / 1000,
                DecayTime: waveform.envelope.decay / 1000,
                ReleaseTime: waveform.envelope.release / 1000,
                Sustained: waveform.envelope.sustain > 0.5
              })
            },
            EventDuration: waveform.duration / 1000
          }
        });

        timeOffset += waveform.duration / 1000;
      }
    }

    return {
      Version: 1.0,
      Metadata: {
        Project: 'PhenixNavigator',
        Created: new Date().toISOString()
      },
      Pattern: events
    };
  }

  /**
   * Convert pattern to DRV2605L register sequence
   * For direct hardware control on ESP32
   */
  toDRV2605Sequence(pattern: HapticPattern): DRV2605Sequence {
    const sequence: DRV2605Register[] = [];

    for (const instance of pattern.phonemes) {
      const phoneme = this.library.getPhoneme(instance.phonemeId);
      if (!phoneme) continue;

      for (const waveform of phoneme.waveforms) {
        // Map waveform to DRV2605 effect
        const effect = this.mapToDRV2605Effect(waveform, phoneme.intensity * (instance.intensity || 1));
        
        sequence.push({
          delay: instance.startTime,
          effect: effect,
          duration: waveform.duration
        });
      }
    }

    return { registers: sequence };
  }

  private mapToDRV2605Effect(waveform: HapticWaveform, intensity: number): number {
    // DRV2605L effect library mapping (simplified)
    // 1-16: Strong click to soft bump
    // 17-32: Strong buzz to soft buzz
    // 47-56: Transition ramp patterns
    // etc.

    if (waveform.type === 'pulse') {
      // Click effects
      return intensity > 0.7 ? 1 : intensity > 0.4 ? 4 : 7;
    } else if (waveform.type === 'square' || waveform.type === 'noise') {
      // Buzz effects
      return intensity > 0.7 ? 17 : intensity > 0.4 ? 20 : 23;
    } else {
      // Smooth/transition effects
      return 47 + Math.floor((1 - intensity) * 9);
    }
  }

  getLibrary(): HapticPhonemeLibrary {
    return this.library;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

interface ActuatorCommand {
  type: string;
  frequency: number;
  amplitude: number;
  duration: number;
  envelope?: ADSREnvelope;
}

interface DRV2605Register {
  delay: number;
  effect: number;
  duration: number;
}

interface DRV2605Sequence {
  registers: DRV2605Register[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HAPTIC TRAINING SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export interface TrainingSession {
  id: string;
  startTime: number;
  patterns: string[];
  correctGuesses: number;
  totalGuesses: number;
  accuracy: number;
}

export class HapticTrainingSystem extends EventEmitter {
  private engine: HapticEngine;
  private sessions: TrainingSession[] = [];
  private currentSession: TrainingSession | null = null;
  private masteredPatterns: Set<string> = new Set();

  constructor(engine: HapticEngine) {
    super();
    this.engine = engine;
  }

  /**
   * Start a new training session
   */
  startSession(patternIds?: string[]): TrainingSession {
    const patterns = patternIds || this.engine.getLibrary().getAllPatterns().map(p => p.id);
    
    const session: TrainingSession = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      patterns,
      correctGuesses: 0,
      totalGuesses: 0,
      accuracy: 0
    };

    this.currentSession = session;
    this.emit('session:start', session);
    return session;
  }

  /**
   * Present a pattern for identification
   */
  async presentChallenge(): Promise<string> {
    if (!this.currentSession) throw new Error('No active session');

    // Select random pattern (weighted toward non-mastered)
    const nonMastered = this.currentSession.patterns.filter(
      p => !this.masteredPatterns.has(p)
    );
    const pool = nonMastered.length > 0 ? nonMastered : this.currentSession.patterns;
    const patternId = pool[Math.floor(Math.random() * pool.length)];

    await this.engine.playPattern(patternId);
    this.emit('challenge:presented', patternId);

    return patternId;
  }

  /**
   * Submit a guess for the current challenge
   */
  submitGuess(patternId: string, correctPatternId: string): boolean {
    if (!this.currentSession) throw new Error('No active session');

    const isCorrect = patternId === correctPatternId;
    
    this.currentSession.totalGuesses++;
    if (isCorrect) {
      this.currentSession.correctGuesses++;
    }
    this.currentSession.accuracy = 
      this.currentSession.correctGuesses / this.currentSession.totalGuesses;

    // Track mastery (5 correct in a row)
    if (isCorrect) {
      this.trackMastery(correctPatternId);
    }

    this.emit('guess:submitted', { patternId, correctPatternId, isCorrect });
    return isCorrect;
  }

  private trackMastery(patternId: string): void {
    // Simplified mastery tracking
    // In production: track consecutive correct guesses per pattern
    if (this.currentSession && this.currentSession.accuracy > 0.9) {
      this.masteredPatterns.add(patternId);
      this.emit('pattern:mastered', patternId);
    }
  }

  /**
   * End current session
   */
  endSession(): TrainingSession | null {
    if (!this.currentSession) return null;

    const session = this.currentSession;
    this.sessions.push(session);
    this.currentSession = null;

    this.emit('session:end', session);
    return session;
  }

  /**
   * Get mastery level (0-1) for all patterns
   */
  getMasteryLevel(): number {
    const totalPatterns = this.engine.getLibrary().getAllPatterns().length;
    return this.masteredPatterns.size / totalPatterns;
  }

  getSessionHistory(): TrainingSession[] {
    return [...this.sessions];
  }

  getMasteredPatterns(): string[] {
    return Array.from(this.masteredPatterns);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOMATIC BRIDGE (Main Interface)
// ─────────────────────────────────────────────────────────────────────────────

export class SomaticBridge extends EventEmitter {
  private engine: HapticEngine;
  private training: HapticTrainingSystem;
  private semanticMappings: Map<string, string> = new Map();

  constructor() {
    super();
    this.engine = new HapticEngine();
    this.training = new HapticTrainingSystem(this.engine);
    this.initializeSemanticMappings();
  }

  private initializeSemanticMappings(): void {
    // Map semantic concepts to patterns
    this.semanticMappings.set('mesh:healthy', 'mesh-health-good');
    this.semanticMappings.set('mesh:degraded', 'mesh-health-degraded');
    this.semanticMappings.set('threat:detected', 'threat-detected');
    this.semanticMappings.set('love:received', 'love-received');
  }

  /**
   * Play semantic feedback
   */
  async signal(semantic: string, intensity: number = 1.0): Promise<void> {
    const patternId = this.semanticMappings.get(semantic);
    if (patternId) {
      await this.engine.playPattern(patternId, intensity);
    } else {
      console.warn(`[SomaticBridge] No mapping for semantic: ${semantic}`);
    }
  }

  /**
   * Communicate mesh health via haptics
   */
  async signalMeshHealth(healthLevel: number): void {
    if (healthLevel > 0.7) {
      await this.signal('mesh:healthy', healthLevel);
    } else {
      await this.signal('mesh:degraded', 1 - healthLevel);
    }
  }

  /**
   * Communicate threat detection
   */
  async signalThreat(severity: number): Promise<void> {
    await this.signal('threat:detected', severity);
  }

  /**
   * Communicate L.O.V.E. token receipt
   */
  async signalCareReceived(amount: number): Promise<void> {
    const intensity = Math.min(1, amount / 100);
    await this.signal('love:received', intensity);
  }

  /**
   * Start haptic training mode
   */
  startTraining(): TrainingSession {
    return this.training.startSession();
  }

  /**
   * Export patterns for hardware (ESP32 + DRV2605L)
   */
  exportForESP32(): Record<string, DRV2605Sequence> {
    const exports: Record<string, DRV2605Sequence> = {};
    
    for (const pattern of this.engine.getLibrary().getAllPatterns()) {
      exports[pattern.id] = this.engine.toDRV2605Sequence(pattern);
    }

    return exports;
  }

  /**
   * Export patterns for iOS (AHAP format)
   */
  exportForIOS(): Record<string, AHAPPattern> {
    const exports: Record<string, AHAPPattern> = {};
    
    for (const pattern of this.engine.getLibrary().getAllPatterns()) {
      exports[pattern.id] = this.engine.toAHAP(pattern);
    }

    return exports;
  }

  getEngine(): HapticEngine {
    return this.engine;
  }

  getTraining(): HapticTrainingSystem {
    return this.training;
  }
}

export default SomaticBridge;
