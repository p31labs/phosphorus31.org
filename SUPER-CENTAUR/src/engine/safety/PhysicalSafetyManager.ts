/**
 * Physical Safety Manager
 * Prevents motion sickness, seizures, and other physical safety issues
 */

export interface PhysicalSafetyConfig {
  enabled: boolean;
  preventMotionSickness: boolean;
  preventSeizures: boolean;
  maxCameraSpeed: number;
  maxRotationSpeed: number;
  flashWarningThreshold: number; // Hz
  contrastWarningThreshold: number; // 0-1
  motionBlurEnabled: boolean;
  fovLimits: {
    min: number;
    max: number;
  };
}

export class PhysicalSafetyManager {
  private config: PhysicalSafetyConfig;
  private flashDetector: FlashDetector;
  private motionTracker: MotionTracker;

  constructor(config?: Partial<PhysicalSafetyConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      preventMotionSickness: config?.preventMotionSickness ?? true,
      preventSeizures: config?.preventSeizures ?? true,
      maxCameraSpeed: config?.maxCameraSpeed ?? 5.0,
      maxRotationSpeed: config?.maxRotationSpeed ?? 2.0,
      flashWarningThreshold: config?.flashWarningThreshold ?? 3.0, // 3 Hz
      contrastWarningThreshold: config?.contrastWarningThreshold ?? 0.8,
      motionBlurEnabled: config?.motionBlurEnabled ?? true,
      fovLimits: config?.fovLimits || { min: 45, max: 90 }
    };

    this.flashDetector = new FlashDetector(this.config.flashWarningThreshold);
    this.motionTracker = new MotionTracker();
  }

  /**
   * Initialize physical safety manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🏥 Physical Safety Manager disabled');
      return;
    }

    console.log('🏥 Physical Safety Manager initialized');
  }

  /**
   * Check camera movement for safety
   */
  public checkCameraMovement(
    velocity: { x: number; y: number; z: number },
    rotationVelocity: { x: number; y: number; z: number }
  ): { safe: boolean; warnings: string[] } {
    if (!this.config.enabled) {
      return { safe: true, warnings: [] };
    }

    const warnings: string[] = [];
    let safe = true;

    // Check linear velocity
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
    if (speed > this.config.maxCameraSpeed) {
      warnings.push(`Camera speed ${speed.toFixed(2)} exceeds maximum ${this.config.maxCameraSpeed}`);
      safe = false;
    }

    // Check rotation velocity
    const rotationSpeed = Math.sqrt(
      rotationVelocity.x ** 2 + rotationVelocity.y ** 2 + rotationVelocity.z ** 2
    );
    if (rotationSpeed > this.config.maxRotationSpeed) {
      warnings.push(`Rotation speed ${rotationSpeed.toFixed(2)} exceeds maximum ${this.config.maxRotationSpeed}`);
      safe = false;
    }

    // Track motion for motion sickness detection
    if (this.config.preventMotionSickness) {
      this.motionTracker.recordMovement(velocity, rotationVelocity);
      
      if (this.motionTracker.detectMotionSickness()) {
        warnings.push('Motion sickness risk detected - reducing movement');
        safe = false;
      }
    }

    return { safe, warnings };
  }

  /**
   * Check visual effects for seizure triggers
   */
  public checkVisualEffects(
    flashRate: number, // Hz
    contrast: number, // 0-1
    colorChanges: number // changes per second
  ): { safe: boolean; warnings: string[] } {
    if (!this.config.enabled || !this.config.preventSeizures) {
      return { safe: true, warnings: [] };
    }

    const warnings: string[] = [];
    let safe = true;

    // Check flash rate
    if (flashRate > this.config.flashWarningThreshold) {
      warnings.push(`Flash rate ${flashRate.toFixed(2)} Hz exceeds safe threshold ${this.config.flashWarningThreshold} Hz`);
      safe = false;
    }

    // Check contrast
    if (contrast > this.config.contrastWarningThreshold) {
      warnings.push(`Contrast ${contrast.toFixed(2)} exceeds safe threshold ${this.config.contrastWarningThreshold}`);
      safe = false;
    }

    // Check rapid color changes
    if (colorChanges > 5) {
      warnings.push(`Rapid color changes detected: ${colorChanges} per second`);
      safe = false;
    }

    // Detect flashing patterns
    if (this.flashDetector.detectFlash(flashRate)) {
      warnings.push('Flashing pattern detected - may trigger seizures');
      safe = false;
    }

    return { safe, warnings };
  }

  /**
   * Limit FOV to safe range
   */
  public limitFOV(fov: number): number {
    return Math.max(this.config.fovLimits.min, Math.min(this.config.fovLimits.max, fov));
  }

  /**
   * Apply motion blur if needed
   */
  public shouldApplyMotionBlur(speed: number): boolean {
    if (!this.config.motionBlurEnabled) return false;
    return speed > this.config.maxCameraSpeed * 0.5;
  }

  /**
   * Get safe camera parameters
   */
  public getSafeCameraParams(currentParams: {
    speed: number;
    rotationSpeed: number;
    fov: number;
  }): {
    speed: number;
    rotationSpeed: number;
    fov: number;
  } {
    return {
      speed: Math.min(currentParams.speed, this.config.maxCameraSpeed),
      rotationSpeed: Math.min(currentParams.rotationSpeed, this.config.maxRotationSpeed),
      fov: this.limitFOV(currentParams.fov)
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<PhysicalSafetyConfig>): void {
    this.config = { ...this.config, ...config };
    this.flashDetector.updateThreshold(this.config.flashWarningThreshold);
  }

  /**
   * Get configuration
   */
  public getConfig(): PhysicalSafetyConfig {
    return { ...this.config };
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.flashDetector.dispose();
    this.motionTracker.dispose();
  }
}

/**
 * Flash Detector
 * Detects potentially seizure-inducing flash patterns
 */
class FlashDetector {
  private threshold: number;
  private flashHistory: number[] = [];
  private maxHistory: number = 10;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  public detectFlash(rate: number): boolean {
    this.flashHistory.push(rate);
    if (this.flashHistory.length > this.maxHistory) {
      this.flashHistory.shift();
    }

    // Check if average flash rate exceeds threshold
    const avgRate = this.flashHistory.reduce((a, b) => a + b, 0) / this.flashHistory.length;
    return avgRate > this.threshold;
  }

  public updateThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  public dispose(): void {
    this.flashHistory = [];
  }
}

/**
 * Motion Tracker
 * Tracks motion patterns to detect motion sickness risk
 */
class MotionTracker {
  private movementHistory: Array<{ velocity: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number } }> = [];
  private maxHistory: number = 60; // 1 second at 60fps

  public recordMovement(
    velocity: { x: number; y: number; z: number },
    rotation: { x: number; y: number; z: number }
  ): void {
    this.movementHistory.push({ velocity, rotation });
    if (this.movementHistory.length > this.maxHistory) {
      this.movementHistory.shift();
    }
  }

  public detectMotionSickness(): boolean {
    if (this.movementHistory.length < 30) return false;

    // Check for rapid, irregular motion
    let rapidChanges = 0;
    for (let i = 1; i < this.movementHistory.length; i++) {
      const prev = this.movementHistory[i - 1];
      const curr = this.movementHistory[i];

      const velocityChange = Math.sqrt(
        (curr.velocity.x - prev.velocity.x) ** 2 +
        (curr.velocity.y - prev.velocity.y) ** 2 +
        (curr.velocity.z - prev.velocity.z) ** 2
      );

      const rotationChange = Math.sqrt(
        (curr.rotation.x - prev.rotation.x) ** 2 +
        (curr.rotation.y - prev.rotation.y) ** 2 +
        (curr.rotation.z - prev.rotation.z) ** 2
      );

      if (velocityChange > 2.0 || rotationChange > 1.0) {
        rapidChanges++;
      }
    }

    // If more than 30% of movements are rapid changes, risk of motion sickness
    return rapidChanges / this.movementHistory.length > 0.3;
  }

  public dispose(): void {
    this.movementHistory = [];
  }
}
