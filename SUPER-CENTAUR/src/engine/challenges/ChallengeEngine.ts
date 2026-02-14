/**
 * Challenge Engine - Load challenges, track current, check completion
 */

import { Challenge, Structure, ChallengeResult } from '../types/game';
import { StructureValidator } from '../building/StructureValidator';

export class ChallengeEngine {
  private challenges: Challenge[] = [];
  private currentChallenge: Challenge | null = null;
  private validator: StructureValidator;

  constructor() {
    this.validator = new StructureValidator();
  }

  loadChallenges(challenges: Challenge[]): void {
    this.challenges = challenges;
  }

  getCurrentChallenge(): Challenge | null {
    return this.currentChallenge;
  }

  setCurrentChallenge(challengeId: string): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (challenge) {
      this.currentChallenge = challenge;
      return true;
    }
    return false;
  }

  getChallenges(): Challenge[] {
    return [...this.challenges];
  }

  completeChallenge(structure: Structure): ChallengeResult {
    if (!this.currentChallenge) {
      return { success: false, completedObjectives: [], rewardLove: 0, structureRating: 0, feedback: ['No active challenge'] };
    }

    const validation = this.validator.validate(structure);
    const completedObjectives: string[] = [];
    const feedback: string[] = [];

    for (const obj of this.currentChallenge.objectives) {
      let met = false;
      switch (obj.type) {
        case 'build':
          met = structure.primitives.length >= obj.target;
          break;
        case 'stability':
          met = validation.stabilityScore >= obj.target;
          break;
        case 'efficiency':
          met = validation.maxwellRatio >= obj.target;
          break;
        default:
          met = true;
      }
      if (met) {
        completedObjectives.push(obj.description);
      } else {
        feedback.push(`Not met: ${obj.description}`);
      }
    }

    const success = completedObjectives.length === this.currentChallenge.objectives.length;
    const structureRating = validation.stabilityScore;

    if (success) {
      feedback.push('Challenge complete! ' + this.currentChallenge.fullerPrinciple);
      feedback.push('Real world: ' + this.currentChallenge.realWorldExample);
    }

    return {
      success,
      completedObjectives,
      rewardLove: success ? this.currentChallenge.rewardLove : 0,
      rewardBadge: success ? this.currentChallenge.rewardBadge : undefined,
      structureRating,
      feedback,
    };
  }

  update(deltaTime: number): void {
    // Time-limited challenges would tick down here
  }

  dispose(): void {
    this.challenges = [];
    this.currentChallenge = null;
  }
}

export default ChallengeEngine;
