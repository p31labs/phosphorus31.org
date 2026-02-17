/**
 * Three.js / React Three Fiber Mocks
 * For testing components that use 3D rendering
 * 
 * jsdom doesn't support WebGL, so we need to mock Three.js components
 */

import { vi } from 'vitest';

// Mock @react-three/fiber
export const mockCanvas = ({ children: _children }: { children: any }) => {
  // Return a simple div element for testing
  const div = document.createElement('div');
  div.setAttribute('data-testid', 'r3f-canvas');
  return div;
};

export const mockUseFrame = vi.fn();
export const mockUseThree = vi.fn(() => ({
  gl: {
    domElement: document.createElement('canvas'),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
  },
  scene: {
    add: vi.fn(),
    remove: vi.fn(),
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    lookAt: vi.fn(),
  },
  raycaster: {
    setFromCamera: vi.fn(),
    intersectObjects: vi.fn(() => []),
  },
  size: { width: 800, height: 600 },
  viewport: { width: 800, height: 600 },
  mouse: { x: 0, y: 0 },
}));

// Mock @react-three/drei
export const mockHtml = ({ children: _children }: { children: any }) => {
  const div = document.createElement('div');
  div.setAttribute('data-testid', 'r3f-html');
  return div;
};

export const mockText = vi.fn(() => null);
export const mockOrbitControls = vi.fn(() => null);
export const mockPerspectiveCamera = vi.fn(() => null);
export const mockAmbientLight = vi.fn(() => null);
export const mockDirectionalLight = vi.fn(() => null);
export const mockPointLight = vi.fn(() => null);

// Mock three.js core
export const mockVector3 = vi.fn((x = 0, y = 0, z = 0) => ({
  x,
  y,
  z,
  set: vi.fn(),
  add: vi.fn(),
  sub: vi.fn(),
  multiply: vi.fn(),
  length: vi.fn(() => 1),
  normalize: vi.fn(),
}));

export const mockEuler = vi.fn((x = 0, y = 0, z = 0) => ({
  x,
  y,
  z,
  set: vi.fn(),
}));

export const mockColor = vi.fn((_color?: string | number) => ({
  r: 1,
  g: 1,
  b: 1,
  set: vi.fn(),
  getHex: vi.fn(() => 0xffffff),
}));

// Setup mocks
vi.mock('@react-three/fiber', () => ({
  Canvas: mockCanvas,
  useFrame: mockUseFrame,
  useThree: mockUseThree,
  extend: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Html: mockHtml,
  Text: mockText,
  OrbitControls: mockOrbitControls,
  PerspectiveCamera: mockPerspectiveCamera,
  AmbientLight: mockAmbientLight,
  DirectionalLight: mockDirectionalLight,
  PointLight: mockPointLight,
  useGLTF: vi.fn(() => ({ scene: {} })),
  useTexture: vi.fn(() => ({})),
  useProgress: vi.fn(() => ({
    active: false,
    progress: 100,
    item: '',
    loaded: 1,
    total: 1,
  })),
}));

vi.mock('three', () => ({
  Vector3: mockVector3,
  Euler: mockEuler,
  Color: mockColor,
  Scene: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
    children: [],
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { x: 0, y: 0, z: 5 },
    lookAt: vi.fn(),
    updateProjectionMatrix: vi.fn(),
  })),
  WebGLRenderer: vi.fn(() => ({
    domElement: document.createElement('canvas'),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  })),
  Mesh: vi.fn(() => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    geometry: {},
    material: {},
  })),
  BoxGeometry: vi.fn(() => ({})),
  SphereGeometry: vi.fn(() => ({})),
  MeshStandardMaterial: vi.fn(() => ({
    color: { r: 1, g: 1, b: 1 },
    emissive: { r: 0, g: 0, b: 0 },
  })),
  MeshBasicMaterial: vi.fn(() => ({
    color: { r: 1, g: 1, b: 1 },
  })),
  AmbientLight: vi.fn(() => ({})),
  DirectionalLight: vi.fn(() => ({})),
  PointLight: vi.fn(() => ({})),
  Clock: vi.fn(() => ({
    getElapsedTime: vi.fn(() => 0),
    getDelta: vi.fn(() => 0.016),
  })),
  Raycaster: vi.fn(() => ({
    setFromCamera: vi.fn(),
    intersectObjects: vi.fn(() => []),
  })),
  Group: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
    children: [],
  })),
}));
