/**
 * Connection System Test Suite
 * Tests the magnetic snapping and connection functionality
 */

import { getConnectionPoints, findClosestConnectionPoint, calculateSnapPosition, canConnect } from './ConnectionSystem';

// Test data for different primitive types
const testPieces = {
  tetrahedron: {
    id: 'test_tetra',
    type: 'tetrahedron',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    connectedTo: []
  },
  octahedron: {
    id: 'test_octa',
    type: 'octahedron',
    position: { x: 2, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    connectedTo: []
  },
  strut: {
    id: 'test_strut',
    type: 'strut',
    position: { x: 1, y: 1, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    connectedTo: []
  }
};

/**
 * Test connection point generation
 */
export function testConnectionPoints() {
  console.log('Testing connection point generation...');
  
  const tetraPoints = getConnectionPoints('tetrahedron', 1);
  console.log(`Tetrahedron: ${tetraPoints.length} connection points`);
  
  const octaPoints = getConnectionPoints('octahedron', 1);
  console.log(`Octahedron: ${octaPoints.length} connection points`);
  
  const strutPoints = getConnectionPoints('strut', 1);
  console.log(`Strut: ${strutPoints.length} connection points`);
  
  const hubPoints = getConnectionPoints('hub', 1);
  console.log(`Hub: ${hubPoints.length} connection points`);
  
  return {
    tetraPoints,
    octaPoints,
    strutPoints,
    hubPoints
  };
}

/**
 * Test connection finding between two pieces
 */
export function testConnectionFinding() {
  console.log('Testing connection finding...');
  
  const connection = findClosestConnectionPoint(testPieces.tetrahedron, testPieces.octahedron, 3.0);
  
  if (connection) {
    console.log('Found connection:', {
      distance: connection.distance.toFixed(3),
      sourceType: connection.sourcePoint.type,
      targetType: connection.targetPoint.type
    });
  } else {
    console.log('No connection found');
  }
  
  return connection;
}

/**
 * Test snap position calculation
 */
export function testSnapPosition() {
  console.log('Testing snap position calculation...');
  
  const connection = findClosestConnectionPoint(testPieces.tetrahedron, testPieces.octahedron, 3.0);
  
  if (connection) {
    const snapPos = calculateSnapPosition(testPieces.tetrahedron, testPieces.octahedron, connection);
    
    if (snapPos) {
      console.log('Snap position:', {
        x: snapPos.x.toFixed(3),
        y: snapPos.y.toFixed(3),
        z: snapPos.z.toFixed(3)
      });
    } else {
      console.log('Could not calculate snap position');
    }
  }
}

/**
 * Test connection compatibility
 */
export function testCompatibility() {
  console.log('Testing connection compatibility...');
  
  const tests = [
    ['tetrahedron', 'octahedron'],
    ['strut', 'tetrahedron'],
    ['hub', 'icosahedron'],
    ['strut', 'strut'],
    ['tetrahedron', 'tetrahedron']
  ];
  
  tests.forEach(([type1, type2]) => {
    const canConnectResult = canConnect(type1, type2);
    console.log(`${type1} + ${type2}: ${canConnectResult ? 'CAN' : 'CANNOT'} connect`);
  });
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('=== Connection System Test Suite ===\n');
  
  testConnectionPoints();
  console.log();
  
  testConnectionFinding();
  console.log();
  
  testSnapPosition();
  console.log();
  
  testCompatibility();
  console.log();
  
  console.log('=== Test Suite Complete ===');
}

// Auto-run tests when module is imported (for development)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => runAllTests(), 100);
}