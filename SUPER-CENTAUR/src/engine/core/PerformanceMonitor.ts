/**
 * Performance Monitor for Game Engine
 * Tracks FPS, frame times, memory usage, and system health
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFrameTime: number;
  minFrameTime: number;
  maxFrameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  physicsTime: number;
  renderTime: number;
  updateTime: number;
}

export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private fpsUpdateInterval: number = 1000; // Update FPS every second
  
  private frameTimes: number[] = [];
  private maxFrameTimeHistory: number = 60; // Keep last 60 frames
  
  private currentFps: number = 60;
  private currentFrameTime: number = 0;
  private averageFrameTime: number = 0;
  private minFrameTime: number = Infinity;
  private maxFrameTime: number = 0;
  
  private memoryUsage: number = 0;
  private drawCalls: number = 0;
  private triangles: number = 0;
  
  private physicsTime: number = 0;
  private renderTime: number = 0;
  private updateTime: number = 0;
  
  private performanceThresholds = {
    lowFps: 30,
    targetFps: 60,
    maxFrameTime: 16.67, // 60fps = 16.67ms per frame
    maxMemoryMB: 500
  };

  /**
   * Update performance metrics
   */
  public update(frameTime: number, metrics?: {
    drawCalls?: number;
    triangles?: number;
    physicsTime?: number;
    renderTime?: number;
    updateTime?: number;
  }): void {
    const currentTime = performance.now();
    
    // Update frame time
    this.currentFrameTime = frameTime;
    this.frameTimes.push(frameTime);
    
    if (this.frameTimes.length > this.maxFrameTimeHistory) {
      this.frameTimes.shift();
    }
    
    // Calculate average frame time
    this.averageFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    
    // Update min/max
    this.minFrameTime = Math.min(this.minFrameTime, frameTime);
    this.maxFrameTime = Math.max(this.maxFrameTime, frameTime);
    
    // Update FPS
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.currentFps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
      
      // Reset min/max periodically
      this.minFrameTime = Infinity;
      this.maxFrameTime = 0;
    }
    
    // Update memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    
    // Update optional metrics
    if (metrics) {
      if (metrics.drawCalls !== undefined) this.drawCalls = metrics.drawCalls;
      if (metrics.triangles !== undefined) this.triangles = metrics.triangles;
      if (metrics.physicsTime !== undefined) this.physicsTime = metrics.physicsTime;
      if (metrics.renderTime !== undefined) this.renderTime = metrics.renderTime;
      if (metrics.updateTime !== undefined) this.updateTime = metrics.updateTime;
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return {
      fps: this.currentFps,
      frameTime: this.currentFrameTime,
      averageFrameTime: this.averageFrameTime,
      minFrameTime: this.minFrameTime,
      maxFrameTime: this.maxFrameTime,
      memoryUsage: this.memoryUsage,
      drawCalls: this.drawCalls,
      triangles: this.triangles,
      physicsTime: this.physicsTime,
      renderTime: this.renderTime,
      updateTime: this.updateTime
    };
  }

  /**
   * Check if performance is healthy
   */
  public isHealthy(): boolean {
    return (
      this.currentFps >= this.performanceThresholds.lowFps &&
      this.averageFrameTime <= this.performanceThresholds.maxFrameTime &&
      this.memoryUsage <= this.performanceThresholds.maxMemoryMB
    );
  }

  /**
   * Get performance warnings
   */
  public getWarnings(): string[] {
    const warnings: string[] = [];
    
    if (this.currentFps < this.performanceThresholds.lowFps) {
      warnings.push(`Low FPS: ${this.currentFps} (target: ${this.performanceThresholds.targetFps})`);
    }
    
    if (this.averageFrameTime > this.performanceThresholds.maxFrameTime) {
      warnings.push(`High frame time: ${this.averageFrameTime.toFixed(2)}ms`);
    }
    
    if (this.memoryUsage > this.performanceThresholds.maxMemoryMB) {
      warnings.push(`High memory usage: ${this.memoryUsage.toFixed(2)}MB`);
    }
    
    return warnings;
  }

  /**
   * Reset metrics
   */
  public reset(): void {
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.frameTimes = [];
    this.minFrameTime = Infinity;
    this.maxFrameTime = 0;
  }
}
