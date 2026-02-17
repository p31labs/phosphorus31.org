/**
 * Spatial Audio Manager
 * 3D positional audio with distance-based attenuation
 * 
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import { Logger } from '../../utils/logger';
import * as THREE from 'three';

export interface AudioSource {
  id: string;
  position: THREE.Vector3;
  sound: HTMLAudioElement | null;
  volume: number;
  maxDistance: number;
  loop: boolean;
  isPlaying: boolean;
}

export class SpatialAudioManager {
  private logger: Logger;
  private audioContext: AudioContext | null = null;
  private listener: THREE.Object3D | null = null;
  private sources: Map<string, AudioSource> = new Map();
  private masterVolume: number = 1.0;
  private isEnabled: boolean = true;

  constructor() {
    this.logger = new Logger('SpatialAudioManager');
  }

  /**
   * Initialize audio context
   */
  public async init(): Promise<void> {
    try {
      // Create audio context (requires user interaction first)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.logger.info('Spatial Audio Manager initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Spatial Audio Manager:', error);
      throw error;
    }
  }

  /**
   * Set audio listener (camera position)
   */
  public setListener(listener: THREE.Object3D): void {
    this.listener = listener;
  }

  /**
   * Create audio source at position
   */
  public createSource(
    id: string,
    position: THREE.Vector3,
    audioUrl: string,
    options: {
      volume?: number;
      maxDistance?: number;
      loop?: boolean;
    } = {}
  ): void {
    if (!this.audioContext) {
      this.logger.warn('Audio context not initialized');
      return;
    }

    const audio = new Audio(audioUrl);
    audio.loop = options.loop || false;
    audio.volume = options.volume || 1.0;

    const source: AudioSource = {
      id,
      position: position.clone(),
      sound: audio,
      volume: options.volume || 1.0,
      maxDistance: options.maxDistance || 50,
      loop: options.loop || false,
      isPlaying: false,
    };

    this.sources.set(id, source);
    this.logger.debug(`Audio source created: ${id}`);
  }

  /**
   * Play audio source
   */
  public playSource(id: string): void {
    const source = this.sources.get(id);
    if (!source || !source.sound) return;

    if (!this.isEnabled) return;

    // Calculate distance-based volume
    if (this.listener) {
      const distance = source.position.distanceTo(this.listener.position);
      const volume = this.calculateVolume(distance, source.maxDistance, source.volume);
      source.sound.volume = volume * this.masterVolume;
    }

    source.sound.play().catch(error => {
      this.logger.error(`Failed to play audio source ${id}:`, error);
    });

    source.isPlaying = true;
  }

  /**
   * Stop audio source
   */
  public stopSource(id: string): void {
    const source = this.sources.get(id);
    if (!source || !source.sound) return;

    source.sound.pause();
    source.sound.currentTime = 0;
    source.isPlaying = false;
  }

  /**
   * Update audio source position
   */
  public updateSourcePosition(id: string, position: THREE.Vector3): void {
    const source = this.sources.get(id);
    if (!source) return;

    source.position.copy(position);

    // Update volume based on new distance
    if (this.listener && source.sound && source.isPlaying) {
      const distance = source.position.distanceTo(this.listener.position);
      const volume = this.calculateVolume(distance, source.maxDistance, source.volume);
      source.sound.volume = volume * this.masterVolume;
    }
  }

  /**
   * Update all audio sources (call in game loop)
   */
  public update(): void {
    if (!this.listener) return;

    for (const [id, source] of this.sources.entries()) {
      if (source.sound && source.isPlaying) {
        const distance = source.position.distanceTo(this.listener.position);
        const volume = this.calculateVolume(distance, source.maxDistance, source.volume);
        source.sound.volume = volume * this.masterVolume;
      }
    }
  }

  /**
   * Calculate volume based on distance
   */
  private calculateVolume(distance: number, maxDistance: number, baseVolume: number): number {
    if (distance >= maxDistance) return 0;
    
    // Inverse square law with smooth falloff
    const normalizedDistance = distance / maxDistance;
    const attenuation = 1 - normalizedDistance;
    return baseVolume * attenuation * attenuation;
  }

  /**
   * Set master volume
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all playing sources
    for (const source of this.sources.values()) {
      if (source.sound && source.isPlaying) {
        const distance = this.listener 
          ? source.position.distanceTo(this.listener.position)
          : 0;
        const calculatedVolume = this.calculateVolume(distance, source.maxDistance, source.volume);
        source.sound.volume = calculatedVolume * this.masterVolume;
      }
    }
  }

  /**
   * Enable/disable audio
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    if (!enabled) {
      // Stop all sources
      for (const source of this.sources.values()) {
        this.stopSource(source.id);
      }
    }
  }

  /**
   * Remove audio source
   */
  public removeSource(id: string): void {
    const source = this.sources.get(id);
    if (source) {
      this.stopSource(id);
      if (source.sound) {
        source.sound = null;
      }
      this.sources.delete(id);
    }
  }

  /**
   * Get audio source
   */
  public getSource(id: string): AudioSource | undefined {
    return this.sources.get(id);
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    // Stop all sources
    for (const source of this.sources.values()) {
      this.stopSource(source.id);
      if (source.sound) {
        source.sound = null;
      }
    }

    this.sources.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.logger.info('Spatial Audio Manager disposed');
  }
}
