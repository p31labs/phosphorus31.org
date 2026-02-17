/**
 * Cosmic Transition Manager
 * Planetary transitions, astrological timing, and cosmic synchronicity
 * 
 * "Saturn into Aries"
 * With love and light. As above, so below. 💜
 */

import * as THREE from 'three';

export interface Planet {
  id: string;
  name: string;
  symbol: string;
  color: string;
  radius: number;
  distance: number; // from center
  speed: number; // orbital speed
  currentSign: ZodiacSign;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  color: string;
  startDate: { month: number; day: number };
  endDate: { month: number; day: number };
}

export interface PlanetaryTransition {
  id: string;
  planetId: string;
  fromSign: ZodiacSign;
  toSign: ZodiacSign;
  startTime: number;
  endTime: number;
  duration: number; // milliseconds
  intensity: number; // 0-1
  description: string;
}

export interface CosmicConfig {
  enabled: boolean;
  showOrbits: boolean;
  showTransitions: boolean;
  realTime: boolean;
  speedMultiplier: number;
  showAspects: boolean;
}

export class CosmicTransitionManager {
  private config: CosmicConfig;
  private planets: Map<string, Planet> = new Map();
  private transitions: Map<string, PlanetaryTransition> = new Map();
  private activeTransitions: PlanetaryTransition[] = [];
  private zodiacSigns: ZodiacSign[] = [];
  private scene: THREE.Scene | null = null;

  constructor(config?: Partial<CosmicConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      showOrbits: config?.showOrbits ?? true,
      showTransitions: config?.showTransitions ?? true,
      realTime: config?.realTime ?? false,
      speedMultiplier: config?.speedMultiplier ?? 1.0,
      showAspects: config?.showAspects ?? true
    };

    this.initializeZodiacSigns();
    this.initializePlanets();
  }

  /**
   * Initialize cosmic transition manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🌌 Cosmic Transition Manager disabled');
      return;
    }

    this.updatePlanetaryPositions();
    console.log('🌌 Cosmic Transition Manager initialized');
    console.log('   Planets:', this.planets.size);
    console.log('   Zodiac Signs:', this.zodiacSigns.length);
  }

  /**
   * Initialize zodiac signs
   */
  private initializeZodiacSigns(): void {
    this.zodiacSigns = [
      { id: 'aries', name: 'Aries', symbol: '♈', element: 'fire', modality: 'cardinal', color: '#FF4444', startDate: { month: 3, day: 21 }, endDate: { month: 4, day: 19 } },
      { id: 'taurus', name: 'Taurus', symbol: '♉', element: 'earth', modality: 'fixed', color: '#44FF44', startDate: { month: 4, day: 20 }, endDate: { month: 5, day: 20 } },
      { id: 'gemini', name: 'Gemini', symbol: '♊', element: 'air', modality: 'mutable', color: '#FFFF44', startDate: { month: 5, day: 21 }, endDate: { month: 6, day: 20 } },
      { id: 'cancer', name: 'Cancer', symbol: '♋', element: 'water', modality: 'cardinal', color: '#4444FF', startDate: { month: 6, day: 21 }, endDate: { month: 7, day: 22 } },
      { id: 'leo', name: 'Leo', symbol: '♌', element: 'fire', modality: 'fixed', color: '#FF8844', startDate: { month: 7, day: 23 }, endDate: { month: 8, day: 22 } },
      { id: 'virgo', name: 'Virgo', symbol: '♍', element: 'earth', modality: 'mutable', color: '#88FF44', startDate: { month: 8, day: 23 }, endDate: { month: 9, day: 22 } },
      { id: 'libra', name: 'Libra', symbol: '♎', element: 'air', modality: 'cardinal', color: '#FF44FF', startDate: { month: 9, day: 23 }, endDate: { month: 10, day: 22 } },
      { id: 'scorpio', name: 'Scorpio', symbol: '♏', element: 'water', modality: 'fixed', color: '#8844FF', startDate: { month: 10, day: 23 }, endDate: { month: 11, day: 21 } },
      { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', element: 'fire', modality: 'mutable', color: '#FF4444', startDate: { month: 11, day: 22 }, endDate: { month: 12, day: 21 } },
      { id: 'capricorn', name: 'Capricorn', symbol: '♑', element: 'earth', modality: 'cardinal', color: '#44FF88', startDate: { month: 12, day: 22 }, endDate: { month: 1, day: 19 } },
      { id: 'aquarius', name: 'Aquarius', symbol: '♒', element: 'air', modality: 'fixed', color: '#44FFFF', startDate: { month: 1, day: 20 }, endDate: { month: 2, day: 18 } },
      { id: 'pisces', name: 'Pisces', symbol: '♓', element: 'water', modality: 'mutable', color: '#8844FF', startDate: { month: 2, day: 19 }, endDate: { month: 3, day: 20 } }
    ];
  }

  /**
   * Initialize planets
   */
  private initializePlanets(): void {
    const now = new Date();
    
    // Saturn
    const saturn: Planet = {
      id: 'saturn',
      name: 'Saturn',
      symbol: '♄',
      color: '#C9B037',
      radius: 0.8,
      distance: 9.5,
      speed: 0.0001, // Slow orbit
      currentSign: this.getCurrentSign('saturn', now),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Mars
    const mars: Planet = {
      id: 'mars',
      name: 'Mars',
      symbol: '♂',
      color: '#FF4444',
      radius: 0.5,
      distance: 1.5,
      speed: 0.001,
      currentSign: this.getCurrentSign('mars', now),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Venus
    const venus: Planet = {
      id: 'venus',
      name: 'Venus',
      symbol: '♀',
      color: '#FFAA44',
      radius: 0.6,
      distance: 0.7,
      speed: 0.0015,
      currentSign: this.getCurrentSign('venus', now),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Mercury
    const mercury: Planet = {
      id: 'mercury',
      name: 'Mercury',
      symbol: '☿',
      color: '#AAAAAA',
      radius: 0.4,
      distance: 0.4,
      speed: 0.004,
      currentSign: this.getCurrentSign('mercury', now),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Jupiter
    const jupiter: Planet = {
      id: 'jupiter',
      name: 'Jupiter',
      symbol: '♃',
      color: '#FF8844',
      radius: 1.2,
      distance: 5.2,
      speed: 0.0002,
      currentSign: this.getCurrentSign('jupiter', now),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    // Sun
    const sun: Planet = {
      id: 'sun',
      name: 'Sun',
      symbol: '☉',
      color: '#FFFF00',
      radius: 1.5,
      distance: 0,
      speed: 0.002,
      currentSign: this.getCurrentSign('sun', now),
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler()
    };

    // Moon
    const moon: Planet = {
      id: 'moon',
      name: 'Moon',
      symbol: '☽',
      color: '#CCCCCC',
      radius: 0.3,
      distance: 0.1,
      speed: 0.01,
      currentSign: this.getCurrentSign('moon', now),
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    this.planets.set('saturn', saturn);
    this.planets.set('mars', mars);
    this.planets.set('venus', venus);
    this.planets.set('mercury', mercury);
    this.planets.set('jupiter', jupiter);
    this.planets.set('sun', sun);
    this.planets.set('moon', moon);
  }

  /**
   * Get current zodiac sign for planet (simplified calculation)
   */
  private getCurrentSign(planetId: string, date: Date): ZodiacSign {
    // Simplified: use sun sign as base, adjust for planet speed
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const sign of this.zodiacSigns) {
      const start = sign.startDate;
      const end = sign.endDate;

      // Handle year wrap (Capricorn, Aquarius, Pisces)
      if (start.month > end.month) {
        if (month === start.month && day >= start.day) return sign;
        if (month === end.month && day <= end.day) return sign;
        if (month > start.month || month < end.month) return sign;
      } else {
        if (month === start.month && day >= start.day) return sign;
        if (month === end.month && day <= end.day) return sign;
        if (month > start.month && month < end.month) return sign;
      }
    }

    return this.zodiacSigns[0]; // Default to Aries
  }

  /**
   * Calculate planetary transition
   */
  public calculateTransition(planetId: string, targetSign: ZodiacSign): PlanetaryTransition | null {
    const planet = this.planets.get(planetId);
    if (!planet) {
      return null;
    }

    const fromSign = planet.currentSign;
    if (fromSign.id === targetSign.id) {
      return null; // Already in target sign
    }

    // Calculate transition time (simplified)
    const now = Date.now();
    const baseDuration = this.getTransitionDuration(planetId, fromSign, targetSign);
    const startTime = now;
    const endTime = now + baseDuration;

    const transition: PlanetaryTransition = {
      id: `transition_${planetId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      planetId,
      fromSign,
      toSign: targetSign,
      startTime,
      endTime,
      duration: baseDuration,
      intensity: this.calculateIntensity(planetId, fromSign, targetSign),
      description: `${planet.name} transitioning from ${fromSign.name} to ${targetSign.name}`
    };

    this.transitions.set(transition.id, transition);
    this.activeTransitions.push(transition);

    // Emit transition event
    window.dispatchEvent(new CustomEvent('cosmic:transitionStarted', {
      detail: transition
    }));

    console.log(`🌌 ${transition.description}`);
    return transition;
  }

  /**
   * Get transition duration (simplified)
   */
  private getTransitionDuration(planetId: string, fromSign: ZodiacSign, toSign: ZodiacSign): number {
    // Base durations (in milliseconds)
    const baseDurations: Record<string, number> = {
      moon: 2.5 * 24 * 60 * 60 * 1000, // ~2.5 days
      mercury: 20 * 24 * 60 * 60 * 1000, // ~20 days
      venus: 30 * 24 * 60 * 60 * 1000, // ~30 days
      sun: 30 * 24 * 60 * 60 * 1000, // ~30 days
      mars: 60 * 24 * 60 * 60 * 1000, // ~60 days
      jupiter: 365 * 24 * 60 * 60 * 1000, // ~1 year
      saturn: 2.5 * 365 * 24 * 60 * 60 * 1000 // ~2.5 years
    };

    const base = baseDurations[planetId] || 30 * 24 * 60 * 60 * 1000;
    
    // Adjust for sign distance (simplified)
    const fromIndex = this.zodiacSigns.findIndex(s => s.id === fromSign.id);
    const toIndex = this.zodiacSigns.findIndex(s => s.id === toSign.id);
    const distance = Math.abs(toIndex - fromIndex);
    const signDistance = Math.min(distance, 12 - distance);

    return base * (signDistance / 12);
  }

  /**
   * Calculate transition intensity
   */
  private calculateIntensity(planetId: string, fromSign: ZodiacSign, toSign: ZodiacSign): number {
    // Intensity based on element compatibility and modality
    let intensity = 0.5; // Base intensity

    // Element compatibility
    if (fromSign.element === toSign.element) {
      intensity += 0.2; // Same element = smoother
    } else if (this.areElementsCompatible(fromSign.element, toSign.element)) {
      intensity += 0.1;
    } else {
      intensity -= 0.1; // Incompatible = more intense
    }

    // Modality compatibility
    if (fromSign.modality === toSign.modality) {
      intensity += 0.1;
    }

    // Planet-specific intensity
    if (planetId === 'saturn') {
      intensity += 0.2; // Saturn transitions are significant
    }

    return Math.max(0, Math.min(1, intensity));
  }

  /**
   * Check element compatibility
   */
  private areElementsCompatible(e1: string, e2: string): boolean {
    const compatible: Record<string, string[]> = {
      fire: ['air'],
      earth: ['water'],
      air: ['fire'],
      water: ['earth']
    };
    return compatible[e1]?.includes(e2) || false;
  }

  /**
   * Update planetary positions
   */
  public updatePlanetaryPositions(deltaTime: number = 0): void {
    const time = this.config.realTime ? Date.now() : Date.now() + (deltaTime * this.config.speedMultiplier);

    this.planets.forEach((planet, planetId) => {
      if (planetId === 'sun') {
        // Sun at center
        planet.position.set(0, 0, 0);
      } else {
        // Orbital position
        const angle = (time * planet.speed) % (Math.PI * 2);
        const x = Math.cos(angle) * planet.distance;
        const z = Math.sin(angle) * planet.distance;
        planet.position.set(x, 0, z);
      }

      // Update rotation
      planet.rotation.y += 0.01;
    });

    // Update active transitions
    this.updateTransitions(time);
  }

  /**
   * Update transitions
   */
  private updateTransitions(currentTime: number): void {
    this.activeTransitions = this.activeTransitions.filter(transition => {
      if (currentTime >= transition.endTime) {
        // Transition complete
        const planet = this.planets.get(transition.planetId);
        if (planet) {
          planet.currentSign = transition.toSign;
        }

        // Emit completion event
        window.dispatchEvent(new CustomEvent('cosmic:transitionCompleted', {
          detail: transition
        }));

        console.log(`🌌 ${transition.description} - Complete`);
        return false; // Remove from active
      }

      // Emit progress event
      const progress = (currentTime - transition.startTime) / transition.duration;
      window.dispatchEvent(new CustomEvent('cosmic:transitionProgress', {
        detail: { ...transition, progress }
      }));

      return true; // Keep active
    });
  }

  /**
   * Get planet
   */
  public getPlanet(planetId: string): Planet | null {
    return this.planets.get(planetId) || null;
  }

  /**
   * Get all planets
   */
  public getPlanets(): Planet[] {
    return Array.from(this.planets.values());
  }

  /**
   * Get zodiac signs
   */
  public getZodiacSigns(): ZodiacSign[] {
    return [...this.zodiacSigns];
  }

  /**
   * Get active transitions
   */
  public getActiveTransitions(): PlanetaryTransition[] {
    return [...this.activeTransitions];
  }

  /**
   * Get transition
   */
  public getTransition(transitionId: string): PlanetaryTransition | null {
    return this.transitions.get(transitionId) || null;
  }

  /**
   * Set scene for 3D visualization
   */
  public setScene(scene: THREE.Scene): void {
    this.scene = scene;
  }

  /**
   * Create 3D visualization
   */
  public createVisualization(): THREE.Group {
    const group = new THREE.Group();

    // Create zodiac ring
    if (this.config.showOrbits) {
      const zodiacRing = this.createZodiacRing();
      group.add(zodiacRing);
    }

    // Create planets
    this.planets.forEach(planet => {
      const planetMesh = this.createPlanetMesh(planet);
      group.add(planetMesh);
    });

    // Create transition lines
    if (this.config.showTransitions) {
      this.activeTransitions.forEach(transition => {
        const line = this.createTransitionLine(transition);
        if (line) group.add(line);
      });
    }

    return group;
  }

  /**
   * Create zodiac ring
   */
  private createZodiacRing(): THREE.Group {
    const ring = new THREE.Group();
    const radius = 12;

    this.zodiacSigns.forEach((sign, index) => {
      const angle = (index / this.zodiacSigns.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Sign marker
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: sign.color });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.set(x, 0, z);
      ring.add(marker);
    });

    return ring;
  }

  /**
   * Create planet mesh
   */
  private createPlanetMesh(planet: Planet): THREE.Group {
    const group = new THREE.Group();

    // Planet sphere
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: planet.color,
      emissive: planet.color,
      emissiveIntensity: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(planet.position);
    group.add(mesh);

    // Orbit line
    if (this.config.showOrbits && planet.distance > 0) {
      const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = -Math.PI / 2;
      group.add(orbit);
    }

    return group;
  }

  /**
   * Create transition line
   */
  private createTransitionLine(transition: PlanetaryTransition): THREE.Line | null {
    const planet = this.planets.get(transition.planetId);
    if (!planet) return null;

    const fromIndex = this.zodiacSigns.findIndex(s => s.id === transition.fromSign.id);
    const toIndex = this.zodiacSigns.findIndex(s => s.id === transition.toSign.id);
    
    const radius = 12;
    const fromAngle = (fromIndex / this.zodiacSigns.length) * Math.PI * 2;
    const toAngle = (toIndex / this.zodiacSigns.length) * Math.PI * 2;

    const fromX = Math.cos(fromAngle) * radius;
    const fromZ = Math.sin(fromAngle) * radius;
    const toX = Math.cos(toAngle) * radius;
    const toZ = Math.sin(toAngle) * radius;

    const points = [
      new THREE.Vector3(fromX, 0, fromZ),
      new THREE.Vector3(toX, 0, toZ)
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: planet.color,
      linewidth: 3,
      transparent: true,
      opacity: transition.intensity
    });

    return new THREE.Line(geometry, material);
  }

  /**
   * Get cosmic timing for action
   */
  public getCosmicTiming(action: string): {
    favorable: boolean;
    intensity: number;
    recommendedSigns: ZodiacSign[];
    message: string;
  } {
    // Simplified cosmic timing calculation
    const saturn = this.planets.get('saturn');
    const mars = this.planets.get('mars');
    const sun = this.planets.get('sun');

    if (!saturn || !mars || !sun) {
      return {
        favorable: true,
        intensity: 0.5,
        recommendedSigns: [],
        message: 'Cosmic timing neutral'
      };
    }

    // Check if Saturn is transitioning into Aries (or other significant transitions)
    const saturnTransition = this.activeTransitions.find(t => 
      t.planetId === 'saturn' && t.toSign.id === 'aries'
    );

    if (saturnTransition) {
      return {
        favorable: true,
        intensity: 1.0,
        recommendedSigns: [this.zodiacSigns.find(s => s.id === 'aries')!],
        message: '🌌 Saturn into Aries - Powerful time for new beginnings and structure building. The Mesh Holds. 💜'
      };
    }

    return {
      favorable: true,
      intensity: 0.7,
      recommendedSigns: [saturn.currentSign, sun.currentSign],
      message: 'Cosmic timing favorable'
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<CosmicConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  public getConfig(): CosmicConfig {
    return { ...this.config };
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.planets.clear();
    this.transitions.clear();
    this.activeTransitions = [];
    this.scene = null;
  }
}
