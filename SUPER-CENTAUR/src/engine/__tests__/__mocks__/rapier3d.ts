/**
 * Mock for @dimforge/rapier3d
 * Used in tests to avoid requiring the actual physics library
 */

export const World = jest.fn().mockImplementation(() => ({
  createRigidBody: jest.fn(),
  createCollider: jest.fn(),
  step: jest.fn(),
  removeRigidBody: jest.fn(),
}));

export const RigidBodyDesc = jest.fn();
export const ColliderDesc = jest.fn();
