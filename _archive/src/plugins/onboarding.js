// src/plugins/onboarding.js

/**
 * Adaptive Onboarding Plugin (MVP)
 * - Self-paced, context-aware onboarding
 * - Neurodiversity-first: multiple learning modes, plain language, visual aids
 * - Modular: can be extended with new modules and flows
 */

class Onboarding {
  constructor() {
    this.steps = [
      'Welcome to your Sovereign Agent! Let’s get you set up.',
      'Set your preferences: language, accessibility, privacy.',
      'Learn about your wallet and economy features.',
      'Explore documentation and community resources.',
      'You’re ready! The mesh holds.'
    ];
    this.currentStep = 0;
  }

  getCurrentStep() {
    return this.steps[this.currentStep];
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
    return this.getCurrentStep();
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
    return this.getCurrentStep();
  }

  reset() {
    this.currentStep = 0;
    return this.getCurrentStep();
  }
}

module.exports = { Onboarding };