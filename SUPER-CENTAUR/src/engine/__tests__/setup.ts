/**
 * Test Setup
 * Global test configuration and mocks
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock window.AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
  createGain: jest.fn(),
  createOscillator: jest.fn(),
  destination: {},
  close: jest.fn(),
})) as any;

(global as any).webkitAudioContext = global.AudioContext;

// Mock performance.now
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
} as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
}) as any;

global.cancelAnimationFrame = jest.fn();

// @dimforge/rapier3d is mocked via moduleNameMapper in jest.config.js

// Mock fetch for network tests
global.fetch = jest.fn() as jest.Mock;

// Increase timeout for async tests
jest.setTimeout(10000);
