// src/agent.js

const { Wallet } = require('./plugins/wallet');
const { Onboarding } = require('./plugins/onboarding');
const { Knowledge } = require('./plugins/knowledge');
const { Community } = require('./plugins/community');
const { Voice } = require('./plugins/voice');

class SovereignAgent {
  constructor() {
    this.wallet = new Wallet();
    this.onboarding = new Onboarding();
    this.knowledge = new Knowledge();
    this.community = new Community();
    this.voice = new Voice();
  }

  // Example: greet user
  greet() {
    const message = 'Welcome to your Sovereign Agent. The mesh holds.';
    this.voice.speak(message);
    return message;
  }
}

module.exports = { SovereignAgent };