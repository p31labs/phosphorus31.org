// src/test-agent.js

const { SovereignAgent } = require('./agent');

// Create an instance of the Sovereign Agent
const agent = new SovereignAgent();

// Test the greet method
console.log('Testing Sovereign Agent:');
const greeting = agent.greet();
console.log(greeting);

// Test wallet functionality
console.log('\nTesting Wallet:');
console.log('Initial balance:', agent.wallet.getBalance());
agent.wallet.add(100, 'Initial deposit');
console.log('After adding 100:', agent.wallet.getBalance());
agent.wallet.spend(25, 'Purchase');
console.log('After spending 25:', agent.wallet.getBalance());
console.log('Transactions:', agent.wallet.getTransactions());

// Test onboarding functionality
console.log('\nTesting Onboarding:');
console.log('Current step:', agent.onboarding.getCurrentStep());
console.log('Next step:', agent.onboarding.nextStep());
console.log('Next step:', agent.onboarding.nextStep());
console.log('Previous step:', agent.onboarding.prevStep());
console.log('Reset:', agent.onboarding.reset());

// Test knowledge functionality
console.log('\nTesting Knowledge:');
console.log('Intro doc:', agent.knowledge.getDoc('intro'));
console.log('Wallet doc:', agent.knowledge.getDoc('wallet'));
console.log('Non-existent doc:', agent.knowledge.getDoc('non-existent'));

// Test community functionality
console.log('\nTesting Community:');
agent.community.submitFeedback('User1', 'Great agent!');
agent.community.submitFeedback('User2', 'Needs improvement');
console.log('Feedback:', agent.community.getFeedback());

// Test voice functionality
console.log('\nTesting Voice:');
agent.voice.speak('Hello, this is a test.');
agent.voice.listen().then(response => console.log(response));