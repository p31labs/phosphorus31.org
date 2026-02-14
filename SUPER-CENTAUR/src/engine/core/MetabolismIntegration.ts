/**
 * Metabolism Integration for Game Engine
 * Integrates with The Buffer's metabolism system (spoon theory)
 */

export interface MetabolismState {
  currentSpoons: number;
  maxSpoons: number;
  spoonRecoveryRate: number;
  stressThreshold: number;
  recoveryThreshold: number;
}

export class MetabolismIntegration {
  private metabolismState: MetabolismState;
  private gameActivityCost: number = 0.1; // Spoons per minute of gameplay
  private gameRewardRate: number = 0.05; // Spoons recovered per successful action
  
  constructor(initialState?: MetabolismState) {
    this.metabolismState = initialState || {
      currentSpoons: 12,
      maxSpoons: 12,
      spoonRecoveryRate: 0.1,
      stressThreshold: 8,
      recoveryThreshold: 4
    };
  }

  /**
   * Update metabolism state from The Buffer
   */
  public updateState(state: MetabolismState): void {
    this.metabolismState = state;
  }

  /**
   * Get current metabolism state
   */
  public getState(): MetabolismState {
    return { ...this.metabolismState };
  }

  /**
   * Check if player has enough energy to play
   */
  public canPlay(): boolean {
    return this.metabolismState.currentSpoons >= this.gameActivityCost;
  }

  /**
   * Consume spoons for game activity
   */
  public consumeSpoons(duration: number): boolean {
    const cost = this.gameActivityCost * (duration / 60); // Cost per minute
    
    if (this.metabolismState.currentSpoons >= cost) {
      this.metabolismState.currentSpoons -= cost;
      return true;
    }
    
    return false;
  }

  /**
   * Reward spoons for successful game actions
   */
  public rewardSpoons(action: 'build' | 'challenge' | 'creative'): void {
    let reward = 0;
    
    switch (action) {
      case 'build':
        reward = this.gameRewardRate * 2; // Building is rewarding
        break;
      case 'challenge':
        reward = this.gameRewardRate * 3; // Challenges are more rewarding
        break;
      case 'creative':
        reward = this.gameRewardRate * 1.5; // Creative play is moderately rewarding
        break;
    }
    
    this.metabolismState.currentSpoons = Math.min(
      this.metabolismState.currentSpoons + reward,
      this.metabolismState.maxSpoons
    );
  }

  /**
   * Get energy level for UI display
   */
  public getEnergyLevel(): 'high' | 'medium' | 'low' | 'critical' {
    const ratio = this.metabolismState.currentSpoons / this.metabolismState.maxSpoons;
    
    if (ratio >= 0.7) return 'high';
    if (ratio >= 0.4) return 'medium';
    if (ratio >= 0.2) return 'low';
    return 'critical';
  }

  /**
   * Check if player is stressed
   */
  public isStressed(): boolean {
    return this.metabolismState.currentSpoons <= this.metabolismState.stressThreshold;
  }

  /**
   * Check if player is in recovery mode
   */
  public isRecovering(): boolean {
    return this.metabolismState.currentSpoons <= this.metabolismState.recoveryThreshold;
  }

  /**
   * Get recommended game activity based on energy
   */
  public getRecommendedActivity(): 'low' | 'medium' | 'high' {
    const energy = this.getEnergyLevel();
    
    switch (energy) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
      case 'critical':
        return 'low';
    }
  }
}
