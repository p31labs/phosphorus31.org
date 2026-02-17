/**
 * Sovereign Stack Standalone
 * Simple, Powerful, Local-First Digital Sovereignty
 * 
 * "Structure determines performance. Grounding determines connection."
 * 
 * 💜 With neurodivergent love and style.
 */

import { SovereignStack } from './sovereign-stack.js';
import { QuantumLifeOS } from './quantum-life-os.js';
import { LocalFirstStorage } from './storage/local-first-storage.js';

// Export public API
export { SovereignStack, QuantumLifeOS, LocalFirstStorage };

// Default export for convenience
export default {
  SovereignStack,
  QuantumLifeOS,
  LocalFirstStorage,
  
  // Quick start helper for Sovereign Stack
  async init() {
    console.log('💜 Sovereign Stack Standalone Initializing...');
    console.log('💜 Simple. Powerful. Local.');
    console.log('💜 Connect to centralization when needed - a bridge.');
    
    const stack = new SovereignStack();
    await stack.initialize();
    
    return stack;
  },
  
  // Quick start helper for Quantum Life OS
  async initQuantum() {
    console.log('✨ Quantum Life Operating System Initializing...');
    console.log('✨ Quantum-coherent. Life-centric. Sovereign.');
    console.log('✨ The universe is not a machine. It is a living organism.');
    
    const quantumOS = new QuantumLifeOS();
    await quantumOS.initialize();
    
    return quantumOS;
  }
};
