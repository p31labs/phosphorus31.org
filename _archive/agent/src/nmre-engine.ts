/**
 * OMEGA PROTOCOL - MODULE A: NEURO-MIMETIC REALITY ENGINE
 * ========================================================
 * Bio-responsive system that generates reality based on physiological state
 * 
 * Implements "Impedance Matching" - digital interface matches cognitive impedance
 * High entropy user → Low entropy world (Soothe Protocol)
 * Flow state user → Increased challenge (Flow Protocol)
 */

import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// PHYSIOLOGICAL SIGNAL PROCESSOR
// ─────────────────────────────────────────────────────────────────────────────

export interface BiometricReading {
  timestamp: number;
  heartRate: number;           // BPM
  rrIntervals: number[];       // R-R intervals in ms
  gsr: number;                 // Galvanic Skin Response (microsiemens)
  temperature?: number;        // Skin temperature
}

export interface HRVMetrics {
  // Time domain
  sdnn: number;      // Standard deviation of NN intervals
  rmssd: number;     // Root mean square of successive differences
  pnn50: number;     // Percentage of successive RR intervals > 50ms
  
  // Frequency domain (simplified)
  lfPower: number;   // Low frequency power (sympathetic)
  hfPower: number;   // High frequency power (parasympathetic)
  lfHfRatio: number; // Sympathetic/Parasympathetic balance
  
  // Derived
  coherence: number; // 0-1 cardiac coherence score
}

export type CognitiveMode = 
  | 'flow'          // Optimal engagement
  | 'hyper-arousal' // Stress/anxiety
  | 'hypo-arousal'  // Fatigue/depression
  | 'coherence'     // Heart-brain synchronization
  | 'neutral';      // Baseline

export interface NMREState {
  cognitiveMode: CognitiveMode;
  arousalLevel: number;      // 0-1
  valence: number;           // -1 to 1 (negative to positive)
  coherenceScore: number;    // 0-1
  entropyLevel: number;      // 0-1 (chaos in system)
  resonanceScore: number;    // ρ - used for geometry generation
}

export class PhysiologicalProcessor extends EventEmitter {
  private readings: BiometricReading[] = [];
  private state: NMREState;
  private readonly WINDOW_SIZE = 60; // seconds of data
  
  constructor() {
    super();
    this.state = {
      cognitiveMode: 'neutral',
      arousalLevel: 0.5,
      valence: 0,
      coherenceScore: 0.5,
      entropyLevel: 0.5,
      resonanceScore: 0.5
    };
  }

  /**
   * Ingest new biometric reading from Phenix Navigator / wearable
   */
  ingestReading(reading: BiometricReading): void {
    this.readings.push(reading);
    
    // Keep only recent readings
    const cutoff = Date.now() - (this.WINDOW_SIZE * 1000);
    this.readings = this.readings.filter(r => r.timestamp > cutoff);
    
    // Process if we have enough data
    if (this.readings.length >= 10) {
      this.processState();
    }
  }

  /**
   * Calculate HRV metrics from R-R intervals
   */
  private calculateHRV(rrIntervals: number[]): HRVMetrics {
    if (rrIntervals.length < 5) {
      return this.getDefaultHRV();
    }

    // SDNN - Standard deviation of NN intervals
    const mean = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;
    const variance = rrIntervals.reduce((sum, rr) => sum + Math.pow(rr - mean, 2), 0) / rrIntervals.length;
    const sdnn = Math.sqrt(variance);

    // RMSSD - Root mean square of successive differences
    let sumSquaredDiff = 0;
    for (let i = 1; i < rrIntervals.length; i++) {
      const diff = rrIntervals[i] - rrIntervals[i - 1];
      sumSquaredDiff += diff * diff;
    }
    const rmssd = Math.sqrt(sumSquaredDiff / (rrIntervals.length - 1));

    // pNN50 - Percentage of successive RR intervals > 50ms
    let nn50Count = 0;
    for (let i = 1; i < rrIntervals.length; i++) {
      if (Math.abs(rrIntervals[i] - rrIntervals[i - 1]) > 50) {
        nn50Count++;
      }
    }
    const pnn50 = (nn50Count / (rrIntervals.length - 1)) * 100;

    // Simplified frequency domain estimation
    // In production, use FFT via BioSPPy or HeartPy
    const lfPower = sdnn * 0.4;  // Rough approximation
    const hfPower = rmssd * 0.3;
    const lfHfRatio = hfPower > 0 ? lfPower / hfPower : 1;

    // Coherence calculation (simplified)
    // Based on heart rhythm pattern regularity
    const coherence = Math.min(1, rmssd / 100) * (1 - Math.min(1, Math.abs(lfHfRatio - 1) / 3));

    return {
      sdnn,
      rmssd,
      pnn50,
      lfPower,
      hfPower,
      lfHfRatio,
      coherence
    };
  }

  private getDefaultHRV(): HRVMetrics {
    return {
      sdnn: 50,
      rmssd: 40,
      pnn50: 20,
      lfPower: 20,
      hfPower: 20,
      lfHfRatio: 1,
      coherence: 0.5
    };
  }

  /**
   * Process current state from accumulated readings
   */
  private processState(): void {
    // Collect all RR intervals
    const allRR = this.readings.flatMap(r => r.rrIntervals);
    const hrv = this.calculateHRV(allRR);

    // Calculate GSR trend (arousal indicator)
    const gsrValues = this.readings.map(r => r.gsr);
    const avgGsr = gsrValues.reduce((a, b) => a + b, 0) / gsrValues.length;
    const gsrTrend = gsrValues.length > 1 
      ? (gsrValues[gsrValues.length - 1] - gsrValues[0]) / gsrValues[0]
      : 0;

    // Calculate arousal level (0-1)
    // High GSR + Low HRV = High arousal
    const arousalLevel = Math.min(1, Math.max(0,
      (avgGsr / 10) * 0.4 + 
      (1 - hrv.rmssd / 100) * 0.3 +
      (hrv.lfHfRatio / 3) * 0.3
    ));

    // Calculate valence (simplified - would use facial EMG in production)
    // High coherence + moderate arousal = positive
    const valence = (hrv.coherence * 2 - 1) * (1 - Math.abs(arousalLevel - 0.5));

    // Determine cognitive mode
    let cognitiveMode: CognitiveMode;
    if (hrv.coherence > 0.7 && arousalLevel > 0.4 && arousalLevel < 0.7) {
      cognitiveMode = 'flow';
    } else if (hrv.coherence > 0.6) {
      cognitiveMode = 'coherence';
    } else if (arousalLevel > 0.7) {
      cognitiveMode = 'hyper-arousal';
    } else if (arousalLevel < 0.3 && hrv.rmssd < 30) {
      cognitiveMode = 'hypo-arousal';
    } else {
      cognitiveMode = 'neutral';
    }

    // Calculate entropy (chaos in system)
    const entropyLevel = 1 - hrv.coherence * (1 - Math.abs(gsrTrend));

    // Calculate resonance score (ρ) for geometry generation
    // Based on cardiac coherence and HRV
    const resonanceScore = hrv.coherence * (hrv.rmssd / 100);

    const newState: NMREState = {
      cognitiveMode,
      arousalLevel,
      valence,
      coherenceScore: hrv.coherence,
      entropyLevel,
      resonanceScore
    };

    // Only emit if state changed significantly
    if (this.hasSignificantChange(newState)) {
      this.state = newState;
      this.emit('state:change', this.state);
    }
  }

  private hasSignificantChange(newState: NMREState): boolean {
    const threshold = 0.1;
    return (
      Math.abs(newState.arousalLevel - this.state.arousalLevel) > threshold ||
      Math.abs(newState.coherenceScore - this.state.coherenceScore) > threshold ||
      newState.cognitiveMode !== this.state.cognitiveMode
    );
  }

  getState(): NMREState {
    return { ...this.state };
  }

  /**
   * Simulate biometric input for testing
   */
  simulateInput(mode: 'stressed' | 'calm' | 'flow' | 'random'): void {
    const now = Date.now();
    let reading: BiometricReading;

    switch (mode) {
      case 'stressed':
        reading = {
          timestamp: now,
          heartRate: 95 + Math.random() * 15,
          rrIntervals: this.generateRRIntervals(95, 0.3),
          gsr: 8 + Math.random() * 4
        };
        break;
      case 'calm':
        reading = {
          timestamp: now,
          heartRate: 60 + Math.random() * 10,
          rrIntervals: this.generateRRIntervals(60, 0.7),
          gsr: 2 + Math.random() * 2
        };
        break;
      case 'flow':
        reading = {
          timestamp: now,
          heartRate: 70 + Math.random() * 10,
          rrIntervals: this.generateRRIntervals(70, 0.85),
          gsr: 4 + Math.random() * 2
        };
        break;
      default:
        reading = {
          timestamp: now,
          heartRate: 65 + Math.random() * 25,
          rrIntervals: this.generateRRIntervals(75, 0.5),
          gsr: 3 + Math.random() * 5
        };
    }

    this.ingestReading(reading);
  }

  private generateRRIntervals(bpm: number, coherence: number): number[] {
    const baseInterval = 60000 / bpm;
    const intervals: number[] = [];
    const variability = 50 * (1 - coherence); // Lower coherence = more variability
    
    for (let i = 0; i < 10; i++) {
      intervals.push(baseInterval + (Math.random() - 0.5) * variability);
    }
    return intervals;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL VIBE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export interface VibeParameters {
  // Visual
  colorTemperature: number;    // Warm (1) to Cool (0)
  saturation: number;          // 0-1
  contrast: number;            // 0-1
  noiseFrequency: number;      // Texture noise frequency
  fractalSymmetry: number;     // 0-1 (chaotic to symmetric)
  
  // Geometric
  curvature: 'positive' | 'negative' | 'flat';  // Terrain curvature
  complexity: number;          // 0-1 world complexity
  edgeSharpness: number;       // 0-1 (smooth to sharp)
  
  // Audio
  binauralFrequency: number;   // Hz for binaural beats (40Hz gamma, etc.)
  ambientEnergy: number;       // 0-1
  
  // Animation
  motionSpeed: number;         // 0-1
  particleDensity: number;     // 0-1
}

export type Protocol = 'soothe' | 'flow' | 'neutral' | 'alert';

export class ProceduralVibeGenerator extends EventEmitter {
  private currentVibe: VibeParameters;
  private protocol: Protocol = 'neutral';
  private transitionSpeed: number = 0.1; // How fast vibes change

  constructor() {
    super();
    this.currentVibe = this.getDefaultVibe();
  }

  private getDefaultVibe(): VibeParameters {
    return {
      colorTemperature: 0.5,
      saturation: 0.6,
      contrast: 0.5,
      noiseFrequency: 0.5,
      fractalSymmetry: 0.5,
      curvature: 'flat',
      complexity: 0.5,
      edgeSharpness: 0.5,
      binauralFrequency: 10,
      ambientEnergy: 0.5,
      motionSpeed: 0.5,
      particleDensity: 0.5
    };
  }

  /**
   * Update vibe based on NMRE state
   */
  updateFromState(state: NMREState): void {
    let targetVibe: VibeParameters;
    let newProtocol: Protocol;

    if (state.cognitiveMode === 'hyper-arousal' || state.arousalLevel > 0.7) {
      // SOOTHE PROTOCOL
      // "Remove high frequency noise, soften edges, desaturate red hues, increase fractal symmetry"
      newProtocol = 'soothe';
      targetVibe = {
        colorTemperature: 0.3,        // Cool blues
        saturation: 0.3,              // Desaturated
        contrast: 0.3,                // Low contrast
        noiseFrequency: 0.2,          // Low frequency = smooth
        fractalSymmetry: 0.9,         // High symmetry = calming
        curvature: 'positive',        // Valleys, shelters
        complexity: 0.2,              // Simple
        edgeSharpness: 0.1,           // Smooth edges (river stones)
        binauralFrequency: 40,        // 40Hz gamma for neural sync
        ambientEnergy: 0.2,           // Low energy
        motionSpeed: 0.2,             // Slow motion
        particleDensity: 0.3
      };
    } else if (state.cognitiveMode === 'flow' || (state.coherenceScore > 0.7 && state.arousalLevel > 0.4)) {
      // FLOW PROTOCOL
      // Increase complexity to match heightened capacity
      newProtocol = 'flow';
      targetVibe = {
        colorTemperature: 0.6,
        saturation: 0.7,
        contrast: 0.7,
        noiseFrequency: 0.6,
        fractalSymmetry: 0.6,
        curvature: 'flat',
        complexity: 0.7 + state.coherenceScore * 0.3,  // Scales with coherence
        edgeSharpness: 0.6,
        binauralFrequency: 14,        // 14Hz beta for focus
        ambientEnergy: 0.7,
        motionSpeed: 0.6,
        particleDensity: 0.6
      };
    } else if (state.cognitiveMode === 'hypo-arousal') {
      // ALERT PROTOCOL - gentle stimulation
      newProtocol = 'alert';
      targetVibe = {
        colorTemperature: 0.7,        // Warmer
        saturation: 0.6,
        contrast: 0.6,
        noiseFrequency: 0.5,
        fractalSymmetry: 0.4,         // Some asymmetry = interest
        curvature: 'negative',        // Ridges, exposures
        complexity: 0.5,
        edgeSharpness: 0.5,
        binauralFrequency: 18,        // 18Hz beta for alertness
        ambientEnergy: 0.6,
        motionSpeed: 0.5,
        particleDensity: 0.5
      };
    } else {
      // NEUTRAL
      newProtocol = 'neutral';
      targetVibe = this.getDefaultVibe();
    }

    // Smooth transition
    this.transitionTo(targetVibe);
    
    if (newProtocol !== this.protocol) {
      this.protocol = newProtocol;
      this.emit('protocol:change', this.protocol);
    }
  }

  /**
   * Smoothly transition to target vibe
   */
  private transitionTo(target: VibeParameters): void {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    
    this.currentVibe = {
      colorTemperature: lerp(this.currentVibe.colorTemperature, target.colorTemperature, this.transitionSpeed),
      saturation: lerp(this.currentVibe.saturation, target.saturation, this.transitionSpeed),
      contrast: lerp(this.currentVibe.contrast, target.contrast, this.transitionSpeed),
      noiseFrequency: lerp(this.currentVibe.noiseFrequency, target.noiseFrequency, this.transitionSpeed),
      fractalSymmetry: lerp(this.currentVibe.fractalSymmetry, target.fractalSymmetry, this.transitionSpeed),
      curvature: target.curvature,
      complexity: lerp(this.currentVibe.complexity, target.complexity, this.transitionSpeed),
      edgeSharpness: lerp(this.currentVibe.edgeSharpness, target.edgeSharpness, this.transitionSpeed),
      binauralFrequency: target.binauralFrequency,
      ambientEnergy: lerp(this.currentVibe.ambientEnergy, target.ambientEnergy, this.transitionSpeed),
      motionSpeed: lerp(this.currentVibe.motionSpeed, target.motionSpeed, this.transitionSpeed),
      particleDensity: lerp(this.currentVibe.particleDensity, target.particleDensity, this.transitionSpeed)
    };

    this.emit('vibe:change', this.currentVibe);
  }

  getCurrentVibe(): VibeParameters {
    return { ...this.currentVibe };
  }

  getProtocol(): Protocol {
    return this.protocol;
  }

  /**
   * Generate CSS variables for UI rendering
   */
  generateCSSVariables(): Record<string, string> {
    const v = this.currentVibe;
    
    // Convert color temperature to hue shift
    const hueShift = (v.colorTemperature - 0.5) * 60; // -30 to +30 degrees
    
    return {
      '--nmre-hue-shift': `${hueShift}deg`,
      '--nmre-saturation': `${v.saturation * 100}%`,
      '--nmre-contrast': `${0.5 + v.contrast * 0.5}`,
      '--nmre-blur': `${(1 - v.edgeSharpness) * 4}px`,
      '--nmre-noise-scale': `${v.noiseFrequency}`,
      '--nmre-motion-speed': `${v.motionSpeed * 2}s`,
      '--nmre-particle-opacity': `${v.particleDensity}`,
      '--nmre-ambient-brightness': `${0.5 + v.ambientEnergy * 0.5}`
    };
  }

  /**
   * Generate shader uniforms for WebGL rendering
   */
  generateShaderUniforms(): Record<string, number> {
    const v = this.currentVibe;
    return {
      u_colorTemp: v.colorTemperature,
      u_saturation: v.saturation,
      u_contrast: v.contrast,
      u_noiseFreq: v.noiseFrequency,
      u_symmetry: v.fractalSymmetry,
      u_complexity: v.complexity,
      u_edgeSharp: v.edgeSharpness,
      u_time_scale: v.motionSpeed
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NEURO-MIMETIC REALITY ENGINE (Main Class)
// ─────────────────────────────────────────────────────────────────────────────

export interface NMREEvents {
  'state:change': (state: NMREState) => void;
  'protocol:change': (protocol: Protocol) => void;
  'vibe:change': (vibe: VibeParameters) => void;
}

export class NeuroMimeticRealityEngine extends EventEmitter<NMREEvents> {
  private processor: PhysiologicalProcessor;
  private generator: ProceduralVibeGenerator;
  private updateLoop: ReturnType<typeof setInterval> | null = null;
  private isActive: boolean = false;

  constructor() {
    super();
    this.processor = new PhysiologicalProcessor();
    this.generator = new ProceduralVibeGenerator();

    // Wire up internal events
    this.processor.on('state:change', (state: NMREState) => {
      this.generator.updateFromState(state);
      this.emit('state:change', state);
    });

    this.generator.on('protocol:change', (protocol: Protocol) => {
      this.emit('protocol:change', protocol);
    });

    this.generator.on('vibe:change', (vibe: VibeParameters) => {
      this.emit('vibe:change', vibe);
    });
  }

  /**
   * Start the NMRE processing loop
   */
  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('[NMRE] Neuro-Mimetic Reality Engine started');

    // Update loop at 4Hz (250ms) - fast enough for responsiveness, slow enough for efficiency
    this.updateLoop = setInterval(() => {
      // In production, this would receive real biometric data
      // For demo, we simulate
      this.processor.simulateInput('random');
    }, 250);
  }

  /**
   * Stop the engine
   */
  stop(): void {
    if (this.updateLoop) {
      clearInterval(this.updateLoop);
      this.updateLoop = null;
    }
    this.isActive = false;
    console.log('[NMRE] Neuro-Mimetic Reality Engine stopped');
  }

  /**
   * Manually inject biometric reading (from Phenix Navigator)
   */
  ingestBiometrics(reading: BiometricReading): void {
    this.processor.ingestReading(reading);
  }

  /**
   * Get current state
   */
  getState(): NMREState {
    return this.processor.getState();
  }

  /**
   * Get current vibe parameters
   */
  getVibe(): VibeParameters {
    return this.generator.getCurrentVibe();
  }

  /**
   * Get current protocol
   */
  getProtocol(): Protocol {
    return this.generator.getProtocol();
  }

  /**
   * Get CSS variables for UI
   */
  getCSSVariables(): Record<string, string> {
    return this.generator.generateCSSVariables();
  }

  /**
   * Get shader uniforms for WebGL
   */
  getShaderUniforms(): Record<string, number> {
    return this.generator.generateShaderUniforms();
  }

  /**
   * Force a specific protocol (manual override)
   */
  forceProtocol(protocol: Protocol): void {
    const state = this.processor.getState();
    
    switch (protocol) {
      case 'soothe':
        state.cognitiveMode = 'hyper-arousal';
        state.arousalLevel = 0.8;
        break;
      case 'flow':
        state.cognitiveMode = 'flow';
        state.coherenceScore = 0.8;
        state.arousalLevel = 0.5;
        break;
      case 'alert':
        state.cognitiveMode = 'hypo-arousal';
        state.arousalLevel = 0.2;
        break;
      default:
        state.cognitiveMode = 'neutral';
        state.arousalLevel = 0.5;
    }
    
    this.generator.updateFromState(state);
  }
}

export default NeuroMimeticRealityEngine;
