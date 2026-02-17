/**
 * Vesting Manager
 * Manages vesting phases and age-based access control for L.O.V.E. economy
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { Logger } from '../../utils/logger';

export enum VestingPhase {
  TRUST = 'trust',           // Age 0-12
  APPRENTICESHIP = 'apprenticeship', // Age 13-17
  SOVEREIGNTY = 'sovereignty'        // Age 18+
}

export interface VestingConfig {
  birthdate: Date;
  memberId: string;
  memberName: string;
}

export interface VestingStatus {
  phase: VestingPhase;
  age: number;
  canEarn: boolean;
  canSpend: boolean;
  canTransfer: boolean;
  canDeployContracts: boolean;
  canCreateChallenges: boolean;
  requiresGuardianApproval: boolean;
  votingPower: number; // 0-100 (percentage)
}

export class VestingManager {
  private logger: Logger;
  private memberConfigs: Map<string, VestingConfig> = new Map();

  constructor() {
    this.logger = new Logger('VestingManager');
  }

  /**
   * Register a member with their birthdate
   */
  public registerMember(config: VestingConfig): void {
    this.memberConfigs.set(config.memberId, config);
    this.logger.info(`Registered member ${config.memberId} (${config.memberName})`);
  }

  /**
   * Calculate age from birthdate
   */
  public calculateAge(birthdate: Date, currentDate: Date = new Date()): number {
    let age = currentDate.getFullYear() - birthdate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthdate.getDate())) {
      age--;
    }
    
    return Math.max(0, age);
  }

  /**
   * Determine vesting phase from age
   */
  public getVestingPhase(age: number): VestingPhase {
    if (age < 13) {
      return VestingPhase.TRUST;
    } else if (age < 18) {
      return VestingPhase.APPRENTICESHIP;
    } else {
      return VestingPhase.SOVEREIGNTY;
    }
  }

  /**
   * Get vesting status for a member
   */
  public getVestingStatus(memberId: string, currentDate: Date = new Date()): VestingStatus | null {
    const config = this.memberConfigs.get(memberId);
    if (!config) {
      this.logger.warn(`Member ${memberId} not registered`);
      return null;
    }

    const age = this.calculateAge(config.birthdate, currentDate);
    const phase = this.getVestingPhase(age);

    // Determine capabilities based on phase
    let canEarn = true;
    let canSpend = false;
    let canTransfer = false;
    let canDeployContracts = false;
    let canCreateChallenges = false;
    let requiresGuardianApproval = false;
    let votingPower = 0;

    switch (phase) {
      case VestingPhase.TRUST:
        canEarn = true;
        canSpend = false;
        canTransfer = false;
        canDeployContracts = false;
        canCreateChallenges = false;
        requiresGuardianApproval = true;
        votingPower = 0;
        break;

      case VestingPhase.APPRENTICESHIP:
        canEarn = true;
        canSpend = false; // Can propose but needs approval
        canTransfer = false; // Can propose but needs approval
        canDeployContracts = false;
        canCreateChallenges = true; // Can participate
        requiresGuardianApproval = true;
        votingPower = 10; // 10% voting power
        break;

      case VestingPhase.SOVEREIGNTY:
        canEarn = true;
        canSpend = true;
        canTransfer = false; // Still soulbound, but can gift with approval
        canDeployContracts = true;
        canCreateChallenges = true;
        requiresGuardianApproval = false;
        votingPower = 100; // 100% voting power
        break;
    }

    return {
      phase,
      age,
      canEarn,
      canSpend,
      canTransfer,
      canDeployContracts,
      canCreateChallenges,
      requiresGuardianApproval,
      votingPower,
    };
  }

  /**
   * Check if member can perform an action
   */
  public canPerformAction(
    memberId: string,
    action: 'earn' | 'spend' | 'transfer' | 'deploy' | 'create_challenge',
    guardianApproved: boolean = false
  ): boolean {
    const status = this.getVestingStatus(memberId);
    if (!status) return false;

    // If action requires guardian approval, check approval
    if (status.requiresGuardianApproval && !guardianApproved) {
      return false;
    }

    switch (action) {
      case 'earn':
        return status.canEarn;
      case 'spend':
        return status.canSpend;
      case 'transfer':
        return status.canTransfer;
      case 'deploy':
        return status.canDeployContracts;
      case 'create_challenge':
        return status.canCreateChallenges;
      default:
        return false;
    }
  }

  /**
   * Get phase transition date (when member will transition to next phase)
   */
  public getPhaseTransitionDate(memberId: string): Date | null {
    const config = this.memberConfigs.get(memberId);
    if (!config) return null;

    const currentAge = this.calculateAge(config.birthdate);
    const currentPhase = this.getVestingPhase(currentAge);

    if (currentPhase === VestingPhase.SOVEREIGNTY) {
      return null; // Already at highest phase
    }

    // Calculate next birthday that triggers phase transition
    const nextPhaseAge = currentPhase === VestingPhase.TRUST ? 13 : 18;
    const yearsUntilTransition = nextPhaseAge - currentAge;
    
    const transitionDate = new Date(config.birthdate);
    transitionDate.setFullYear(transitionDate.getFullYear() + nextPhaseAge);

    return transitionDate;
  }

  /**
   * Initialize with founding nodes (node one and node two)
   */
  public initializeFoundingNodes(): void {
    // node one (Bash, S.J.) - born March 10, 2016
    this.registerMember({
      memberId: 'node_one',
      memberName: 'Bash',
      birthdate: new Date('2016-03-10'),
    });

    // node two (Willow, W.J.) - born August 8, 2019
    this.registerMember({
      memberId: 'node_two',
      memberName: 'Willow',
      birthdate: new Date('2019-08-08'),
    });

    this.logger.info('Initialized founding nodes (node one and node two)');
  }
}
