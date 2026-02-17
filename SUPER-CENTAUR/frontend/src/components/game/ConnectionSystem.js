/**
 * Connection System - Magnetic snapping for tensegrity structures
 * Implements Fuller's principles: pieces connect at vertices and edges, not faces
 */

import * as THREE from 'three';

// Connection point types
export const CONNECTION_TYPES = {
  VERTEX: 'vertex',
  EDGE: 'edge',
  CENTER: 'center'
};

// Geometry connection points cache
const CONNECTION_CACHE = new Map();

/**
 * Get connection points for a primitive type
 * Returns array of { type, position, normal }
 */
export function getConnectionPoints(type, scale = 1) {
  const cacheKey = `${type}_${scale}`;
  if (CONNECTION_CACHE.has(cacheKey)) {
    return CONNECTION_CACHE.get(cacheKey);
  }

  const points = [];
  
  switch (type) {
    case 'tetrahedron':
      // 4 vertices
      const r = scale * 0.6;
      const h = Math.sqrt(2/3) * r;
      const a = Math.sqrt(3) * r / 2;
      
      points.push(
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, h, 0), normal: new THREE.Vector3(0, 1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, -h/3, 2*a/3), normal: new THREE.Vector3(0, -1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(-a, -h/3, -a/3), normal: new THREE.Vector3(-1, 0, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(a, -h/3, -a/3), normal: new THREE.Vector3(1, 0, 0) }
      );
      break;

    case 'octahedron':
      // 6 vertices
      const s = scale * 0.5;
      points.push(
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, s, 0), normal: new THREE.Vector3(0, 1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, -s, 0), normal: new THREE.Vector3(0, -1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(s, 0, 0), normal: new THREE.Vector3(1, 0, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(-s, 0, 0), normal: new THREE.Vector3(-1, 0, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, 0, s), normal: new THREE.Vector3(0, 0, 1) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, 0, -s), normal: new THREE.Vector3(0, 0, -1) }
      );
      break;

    case 'icosahedron':
      // 12 vertices using golden ratio
      const phi = (1 + Math.sqrt(5)) / 2;
      const r2 = scale * 0.5;
      const a2 = r2 / Math.sqrt(3);
      const b2 = a2 / phi;
      const c2 = a2 * phi;
      
      points.push(
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, c2, b2), normal: new THREE.Vector3(0, 1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, c2, -b2), normal: new THREE.Vector3(0, 1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, -c2, b2), normal: new THREE.Vector3(0, -1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, -c2, -b2), normal: new THREE.Vector3(0, -1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(b2, 0, c2), normal: new THREE.Vector3(0, 0, 1) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(-b2, 0, c2), normal: new THREE.Vector3(0, 0, 1) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(b2, 0, -c2), normal: new THREE.Vector3(0, 0, -1) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(-b2, 0, -c2), normal: new THREE.Vector3(0, 0, -1) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(c2, b2, 0), normal: new THREE.Vector3(1, 0, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(c2, -b2, 0), normal: new THREE.Vector3(1, 0, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(-c2, b2, 0), normal: new THREE.Vector3(-1, 0, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(-c2, -b2, 0), normal: new THREE.Vector3(-1, 0, 0) }
      );
      break;

    case 'strut':
      // 2 vertices + center
      const length = scale * 1.2;
      points.push(
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, length/2, 0), normal: new THREE.Vector3(0, 1, 0) },
        { type: CONNECTION_TYPES.VERTEX, position: new THREE.Vector3(0, -length/2, 0), normal: new THREE.Vector3(0, -1, 0) },
        { type: CONNECTION_TYPES.CENTER, position: new THREE.Vector3(0, 0, 0), normal: new THREE.Vector3(0, 1, 0) }
      );
      break;

    case 'hub':
      // Center point only
      points.push(
        { type: CONNECTION_TYPES.CENTER, position: new THREE.Vector3(0, 0, 0), normal: new THREE.Vector3(0, 1, 0) }
      );
      break;
  }

  CONNECTION_CACHE.set(cacheKey, points);
  return points;
}

/**
 * Find the closest connection point between two primitives
 */
export function findClosestConnectionPoint(sourcePiece, targetPiece, maxDistance = 1.5) {
  const sourcePoints = getConnectionPoints(sourcePiece.type, sourcePiece.scale);
  const targetPoints = getConnectionPoints(targetPiece.type, targetPiece.scale);
  
  let bestConnection = null;
  let minDistance = Infinity;

  // Transform points to world space
  const sourceMatrix = new THREE.Matrix4();
  sourceMatrix.compose(
    new THREE.Vector3(sourcePiece.position.x, sourcePiece.position.y, sourcePiece.position.z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(sourcePiece.rotation.x, sourcePiece.rotation.y, sourcePiece.rotation.z)),
    new THREE.Vector3(1, 1, 1)
  );

  const targetMatrix = new THREE.Matrix4();
  targetMatrix.compose(
    new THREE.Vector3(targetPiece.position.x, targetPiece.position.y, targetPiece.position.z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(targetPiece.rotation.x, targetPiece.rotation.y, targetPiece.rotation.z)),
    new THREE.Vector3(1, 1, 1)
  );

  for (const sourcePoint of sourcePoints) {
    const sourceWorldPos = sourcePoint.position.clone().applyMatrix4(sourceMatrix);
    
    for (const targetPoint of targetPoints) {
      const targetWorldPos = targetPoint.position.clone().applyMatrix4(targetMatrix);
      const distance = sourceWorldPos.distanceTo(targetWorldPos);
      
      if (distance < minDistance && distance <= maxDistance) {
        minDistance = distance;
        bestConnection = {
          sourcePoint: sourcePoint,
          targetPoint: targetPoint,
          sourceWorldPos: sourceWorldPos,
          targetWorldPos: targetWorldPos,
          distance: distance
        };
      }
    }
  }

  return bestConnection;
}

/**
 * Calculate optimal placement position for snapping
 */
export function calculateSnapPosition(sourcePiece, targetPiece, connectionPoint) {
  if (!connectionPoint) return null;

  const { sourceWorldPos, targetWorldPos } = connectionPoint;
  
  // Calculate the midpoint between connection points
  const snapPosition = new THREE.Vector3().addVectors(sourceWorldPos, targetWorldPos).multiplyScalar(0.5);
  
  // Adjust for source piece's offset from its connection point
  const sourcePoints = getConnectionPoints(sourcePiece.type, sourcePiece.scale);
  const sourceMatrix = new THREE.Matrix4();
  sourceMatrix.compose(
    new THREE.Vector3(sourcePiece.position.x, sourcePiece.position.y, sourcePiece.position.z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(sourcePiece.rotation.x, sourcePiece.rotation.y, sourcePiece.rotation.z)),
    new THREE.Vector3(1, 1, 1)
  );

  // Find the source connection point in local space
  const sourceLocalPoint = sourcePoints.find(p => 
    p.position.distanceTo(connectionPoint.sourcePoint.position) < 0.001
  );

  if (!sourceLocalPoint) return null;

  // Calculate the offset from the piece center to the connection point
  const offset = sourceLocalPoint.position.clone().applyMatrix4(sourceMatrix).sub(new THREE.Vector3(sourcePiece.position.x, sourcePiece.position.y, sourcePiece.position.z));
  
  // Calculate final position
  const finalPosition = snapPosition.sub(offset);
  
  return {
    x: finalPosition.x,
    y: finalPosition.y,
    z: finalPosition.z
  };
}

/**
 * Check if two pieces can connect based on type compatibility
 */
export function canConnect(sourceType, targetType) {
  // Struts can connect to anything
  if (sourceType === 'strut' || targetType === 'strut') return true;
  
  // Hubs can connect to anything
  if (sourceType === 'hub' || targetType === 'hub') return true;
  
  // Polyhedra can connect to each other
  return ['tetrahedron', 'octahedron', 'icosahedron'].includes(sourceType) && 
         ['tetrahedron', 'octahedron', 'icosahedron'].includes(targetType);
}

/**
 * Find all valid connection targets for a piece
 */
export function findConnectionTargets(sourcePiece, allPieces, maxDistance = 2.0) {
  const targets = [];
  
  for (const targetPiece of allPieces) {
    if (targetPiece.id === sourcePiece.id) continue;
    
    if (!canConnect(sourcePiece.type, targetPiece.type)) continue;
    
    const connection = findClosestConnectionPoint(sourcePiece, targetPiece, maxDistance);
    
    if (connection) {
      targets.push({
        piece: targetPiece,
        connection: connection,
        distance: connection.distance
      });
    }
  }
  
  // Sort by distance (closest first)
  targets.sort((a, b) => a.distance - b.distance);
  
  return targets;
}

/**
 * Create connection between two pieces
 */
export function createConnection(sourceId, targetId, connections) {
  const newConnections = { ...connections };
  
  if (!newConnections[sourceId]) {
    newConnections[sourceId] = [];
  }
  
  if (!newConnections[sourceId].includes(targetId)) {
    newConnections[sourceId].push(targetId);
  }
  
  if (!newConnections[targetId]) {
    newConnections[targetId] = [];
  }
  
  if (!newConnections[targetId].includes(sourceId)) {
    newConnections[targetId].push(sourceId);
  }
  
  return newConnections;
}

/**
 * Clear connection cache (useful for debugging)
 */
export function clearConnectionCache() {
  CONNECTION_CACHE.clear();
}