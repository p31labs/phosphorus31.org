/**
 * Valentine's Day Vibe Templates
 * Special coding templates for Valentine's Day season
 * 
 * 💜 With love and light. As above, so below. 💜
 */

export interface ValentinesTemplate {
  name: string;
  description: string;
  code: string;
  language: 'javascript' | 'typescript' | 'python' | 'glsl' | 'hlsl';
  preview?: string;
}

export const VALENTINES_TEMPLATES: ValentinesTemplate[] = [
  {
    name: '💜 Valentine Heart',
    description: 'Create a heart shape with tetrahedrons',
    language: 'javascript',
    code: `// 💜 Valentine's Day Heart 💜
// With love and light. As above, so below.

function createValentineHeart() {
  const primitives = [];
  const colors = ['#FF6B9D', '#FFB3D9', '#FF69B4', '#FF1493', '#FFC0CB', '#FFB6C1'];
  
  // Top of heart (two curves)
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI;
    const radius = 2.5;
    
    // Left curve
    primitives.push({
      id: \`heart_left_\${i}\`,
      type: 'tetrahedron',
      position: {
        x: Math.cos(angle) * radius - 2,
        y: Math.sin(angle) * radius + 2.5,
        z: 0
      },
      rotation: { x: 0, y: angle, z: 0 },
      scale: 0.5,
      color: colors[i % colors.length],
      material: 'quantum'
    });
    
    // Right curve
    primitives.push({
      id: \`heart_right_\${i}\`,
      type: 'tetrahedron',
      position: {
        x: Math.cos(angle) * radius + 2,
        y: Math.sin(angle) * radius + 2.5,
        z: 0
      },
      rotation: { x: 0, y: -angle, z: 0 },
      scale: 0.5,
      color: colors[(i + 3) % colors.length],
      material: 'quantum'
    });
  }
  
  // Bottom point of heart
  for (let i = 0; i < 5; i++) {
    primitives.push({
      id: \`heart_bottom_\${i}\`,
      type: 'tetrahedron',
      position: {
        x: (i - 2) * 0.8,
        y: -1 - (i * 0.3),
        z: 0
      },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 0.6,
      color: colors[i % colors.length],
      material: 'quantum'
    });
  }
  
  return {
    id: 'valentine_heart',
    name: '💜 Valentine Heart',
    primitives
  };
}

const heart = createValentineHeart();
game.setStructure(heart);
console.log('💜 Valentine heart created with love and light!');`
  },
  {
    name: '💕 Love Tetrahedron',
    description: 'A tetrahedron of love - four vertices, six edges, infinite love',
    language: 'javascript',
    code: `// 💕 Love Tetrahedron 💕
// Four vertices. Six edges. Infinite love.

function createLoveTetrahedron() {
  const primitives = [];
  const colors = ['#FF6B9D', '#FFB3D9', '#FF69B4', '#FF1493'];
  
  // Four vertices of a tetrahedron
  const vertices = [
    { x: 0, y: 2, z: 0 },           // Top
    { x: -1.5, y: -1, z: -1 },      // Bottom left back
    { x: 1.5, y: -1, z: -1 },       // Bottom right back
    { x: 0, y: -1, z: 1.5 }         // Bottom front
  ];
  
  // Create tetrahedron at each vertex
  vertices.forEach((vertex, i) => {
    primitives.push({
      id: \`love_vertex_\${i}\`,
      type: 'tetrahedron',
      position: vertex,
      rotation: { x: 0, y: (i / 4) * Math.PI * 2, z: 0 },
      scale: 1.0,
      color: colors[i],
      material: 'quantum'
    });
  });
  
  // Connect vertices with struts (edges)
  const edges = [
    [0, 1], [0, 2], [0, 3],  // Top to bottom
    [1, 2], [1, 3], [2, 3]   // Bottom connections
  ];
  
  edges.forEach(([from, to], i) => {
    const fromV = vertices[from];
    const toV = vertices[to];
    const mid = {
      x: (fromV.x + toV.x) / 2,
      y: (fromV.y + toV.y) / 2,
      z: (fromV.z + toV.z) / 2
    };
    const length = Math.sqrt(
      Math.pow(toV.x - fromV.x, 2) +
      Math.pow(toV.y - fromV.y, 2) +
      Math.pow(toV.z - fromV.z, 2)
    );
    
    primitives.push({
      id: \`love_edge_\${i}\`,
      type: 'strut',
      position: mid,
      rotation: {
        x: Math.atan2(toV.y - fromV.y, Math.sqrt(Math.pow(toV.x - fromV.x, 2) + Math.pow(toV.z - fromV.z, 2))),
        y: Math.atan2(toV.x - fromV.x, toV.z - fromV.z),
        z: 0
      },
      scale: length,
      color: '#FFB3D9',
      material: 'quantum'
    });
  });
  
  return {
    id: 'love_tetrahedron',
    name: '💕 Love Tetrahedron',
    primitives
  };
}

const love = createLoveTetrahedron();
game.setStructure(love);
console.log('💕 Love tetrahedron created! Four vertices. Six edges. Infinite love.');`
  },
  {
    name: '🌹 Rose Structure',
    description: 'A geometric rose made of tetrahedrons',
    language: 'javascript',
    code: `// 🌹 Rose Structure 🌹
// Geometric beauty, built with love

function createRose() {
  const primitives = [];
  const petalColors = ['#FF1493', '#FF69B4', '#FF6B9D', '#FFB3D9', '#FFC0CB'];
  
  // Rose petals (layers)
  for (let layer = 0; layer < 5; layer++) {
    const petalCount = 6 + layer * 2;
    const radius = 1 + layer * 0.8;
    const height = layer * 0.5;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      primitives.push({
        id: \`rose_petal_\${layer}_\${i}\`,
        type: 'tetrahedron',
        position: {
          x: Math.cos(angle) * radius,
          y: height,
          z: Math.sin(angle) * radius
        },
        rotation: {
          x: Math.PI / 6,
          y: angle,
          z: 0
        },
        scale: 0.4 + layer * 0.1,
        color: petalColors[layer % petalColors.length],
        material: 'quantum'
      });
    }
  }
  
  // Center (stamen)
  primitives.push({
    id: 'rose_center',
    type: 'tetrahedron',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.8,
    color: '#FFD700',
    material: 'quantum'
  });
  
  return {
    id: 'rose_structure',
    name: '🌹 Rose Structure',
    primitives
  };
}

const rose = createRose();
game.setStructure(rose);
console.log('🌹 Rose structure created with love!');`
  },
  {
    name: '💖 Love Mesh',
    description: 'A mesh of connected hearts',
    language: 'javascript',
    code: `// 💖 Love Mesh 💖
// Connected hearts, infinite connections

function createLoveMesh() {
  const primitives = [];
  const colors = ['#FF6B9D', '#FFB3D9', '#FF69B4'];
  
  // Create a grid of small hearts
  for (let x = -3; x <= 3; x += 2) {
    for (let z = -3; z <= 3; z += 2) {
      // Simple heart shape (two tetrahedrons)
      primitives.push({
        id: \`heart_\${x}_\${z}_1\`,
        type: 'tetrahedron',
        position: { x: x - 0.5, y: 0, z: z },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        scale: 0.6,
        color: colors[Math.abs(x + z) % colors.length],
        material: 'quantum'
      });
      
      primitives.push({
        id: \`heart_\${x}_\${z}_2\`,
        type: 'tetrahedron',
        position: { x: x + 0.5, y: 0, z: z },
        rotation: { x: 0, y: -Math.PI / 4, z: 0 },
        scale: 0.6,
        color: colors[Math.abs(x + z) % colors.length],
        material: 'quantum'
      });
      
      // Connect hearts with struts
      if (x < 3) {
        primitives.push({
          id: \`connector_x_\${x}_\${z}\`,
          type: 'strut',
          position: { x: x + 1, y: 0, z: z },
          rotation: { x: 0, y: Math.PI / 2, z: 0 },
          scale: 1.0,
          color: '#FFB3D9',
          material: 'quantum'
        });
      }
      
      if (z < 3) {
        primitives.push({
          id: \`connector_z_\${x}_\${z}\`,
          type: 'strut',
          position: { x: x, y: 0, z: z + 1 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 1.0,
          color: '#FFB3D9',
          material: 'quantum'
        });
      }
    }
  }
  
  return {
    id: 'love_mesh',
    name: '💖 Love Mesh',
    primitives
  };
}

const mesh = createLoveMesh();
game.setStructure(mesh);
console.log('💖 Love mesh created! The mesh holds with love.');`
  },
  {
    name: '💝 Gift Box',
    description: 'A gift box structure with a bow',
    language: 'javascript',
    code: `// 💝 Gift Box 💝
// A gift wrapped with love

function createGiftBox() {
  const primitives = [];
  
  // Box (cube made of tetrahedrons)
  const boxSize = 2;
  const positions = [
    { x: -boxSize, y: -boxSize, z: -boxSize },
    { x: boxSize, y: -boxSize, z: -boxSize },
    { x: -boxSize, y: boxSize, z: -boxSize },
    { x: boxSize, y: boxSize, z: -boxSize },
    { x: -boxSize, y: -boxSize, z: boxSize },
    { x: boxSize, y: -boxSize, z: boxSize },
    { x: -boxSize, y: boxSize, z: boxSize },
    { x: boxSize, y: boxSize, z: boxSize }
  ];
  
  positions.forEach((pos, i) => {
    primitives.push({
      id: \`box_corner_\${i}\`,
      type: 'tetrahedron',
      position: pos,
      rotation: { x: 0, y: 0, z: 0 },
      scale: 0.5,
      color: i % 2 === 0 ? '#FF6B9D' : '#FFB3D9',
      material: 'quantum'
    });
  });
  
  // Bow on top
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    primitives.push({
      id: \`bow_\${i}\`,
      type: 'tetrahedron',
      position: {
        x: Math.cos(angle) * 1.5,
        y: boxSize + 1,
        z: Math.sin(angle) * 1.5
      },
      rotation: { x: 0, y: angle, z: 0 },
      scale: 0.4,
      color: '#FF1493',
      material: 'quantum'
    });
  }
  
  return {
    id: 'gift_box',
    name: '💝 Gift Box',
    primitives
  };
}

const gift = createGiftBox();
game.setStructure(gift);
console.log('💝 Gift box created! A gift wrapped with love.');`
  }
];

/**
 * Get Valentine's Day templates
 */
export function getValentinesTemplates(): ValentinesTemplate[] {
  // Check if it's Valentine's Day season (Feb 1-28)
  const month = new Date().getMonth() + 1; // 1-12
  if (month === 2) { // February
    return VALENTINES_TEMPLATES;
  }
  return [];
}

/**
 * Check if it's Valentine's Day season
 */
export function isValentinesSeason(): boolean {
  const month = new Date().getMonth() + 1; // 1-12
  return month === 2; // February
}
