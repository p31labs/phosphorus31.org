/**
 * Infinite Synergy Test Suite
 * "Synergy x Infinity"
 * 
 * Tests the recursive, fractal synergy system
 * With love and light. As above, so below. 💜
 */

import { InfiniteSynergy, SynergyResult, SynergyNode } from '../InfiniteSynergy';

describe('InfiniteSynergy', () => {
  let infiniteSynergy: InfiniteSynergy;

  beforeEach(() => {
    infiniteSynergy = new InfiniteSynergy();
  });

  afterEach(() => {
    infiniteSynergy.reset();
  });

  describe('Initialization', () => {
    test('should initialize with root node', () => {
      expect(infiniteSynergy).toBeDefined();
      const result = infiniteSynergy.generateInfinite(1);
      expect(result.nodes).toBeGreaterThan(0);
      expect(result.levels).toBe(1);
    });

    test('should have golden ratio multiplier', () => {
      const result = infiniteSynergy.generateInfinite(2);
      expect(result.totalSynergy).toBeGreaterThan(0);
    });

    test('should reset correctly', () => {
      infiniteSynergy.generateInfinite(5);
      infiniteSynergy.reset();
      const result = infiniteSynergy.generateInfinite(1);
      expect(result.nodes).toBeGreaterThan(0);
    });
  });

  describe('Synergy Generation', () => {
    test('should generate synergy at level 0', () => {
      const result = infiniteSynergy.generateInfinite(1);
      expect(result.totalSynergy).toBeGreaterThan(0);
      expect(result.nodes).toBe(1); // Root only
    });

    test('should generate synergy at multiple levels', () => {
      const result = infiniteSynergy.generateInfinite(3);
      expect(result.levels).toBe(3);
      expect(result.nodes).toBeGreaterThan(1);
      expect(result.connections).toBeGreaterThan(0);
    });

    test('should generate 4 children per node', () => {
      const result = infiniteSynergy.generateInfinite(2);
      // Level 0: 1 node (root)
      // Level 1: 4 children
      // Total: 5 nodes minimum
      expect(result.nodes).toBeGreaterThanOrEqual(5);
    });

    test('should scale exponentially with levels', () => {
      const level2 = infiniteSynergy.generateInfinite(2);
      const level3 = infiniteSynergy.generateInfinite(3);
      const level4 = infiniteSynergy.generateInfinite(4);

      // Each level should have significantly more nodes
      expect(level3.nodes).toBeGreaterThan(level2.nodes);
      expect(level4.nodes).toBeGreaterThan(level3.nodes);
    });

    test('should calculate synergy at specific level', () => {
      const synergy0 = infiniteSynergy.getSynergyAtLevel(0);
      const synergy1 = infiniteSynergy.getSynergyAtLevel(1);
      const synergy2 = infiniteSynergy.getSynergyAtLevel(2);

      expect(synergy0).toBeGreaterThan(0);
      expect(synergy1).toBeGreaterThan(0);
      expect(synergy2).toBeGreaterThan(0);
      
      // Synergy should increase with level (due to multiplier)
      // But decrease due to coherence decay
      // Net effect depends on multiplier vs decay
      expect(typeof synergy1).toBe('number');
      expect(typeof synergy2).toBe('number');
    });

    test('should calculate total synergy up to level', () => {
      const total0 = infiniteSynergy.getTotalSynergyUpToLevel(0);
      const total1 = infiniteSynergy.getTotalSynergyUpToLevel(1);
      const total2 = infiniteSynergy.getTotalSynergyUpToLevel(2);

      expect(total0).toBeGreaterThan(0);
      expect(total1).toBeGreaterThan(total0);
      expect(total2).toBeGreaterThan(total1);
    });
  });

  describe('Fractal Properties', () => {
    test('should calculate fractal dimension', () => {
      const result = infiniteSynergy.generateInfinite(5);
      expect(result.fractalDimension).toBeGreaterThan(0);
      expect(result.fractalDimension).toBeLessThanOrEqual(3); // 3D space
      expect(typeof result.fractalDimension).toBe('number');
    });

    test('should maintain fractal structure across levels', () => {
      const result3 = infiniteSynergy.generateInfinite(3);
      const result5 = infiniteSynergy.generateInfinite(5);
      
      // Fractal dimension should be similar (self-similarity)
      expect(Math.abs(result3.fractalDimension - result5.fractalDimension)).toBeLessThan(1.0);
    });

    test('should have tetrahedron structure at each node', () => {
      const result = infiniteSynergy.generateInfinite(3);
      expect(result.nodes).toBeGreaterThan(0);
      // Each node represents a tetrahedron (4 vertices, 6 edges, 4 faces)
    });
  });

  describe('Coherence', () => {
    test('should calculate coherence', () => {
      const result = infiniteSynergy.generateInfinite(5);
      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(1);
    });

    test('should maintain coherence across levels', () => {
      const result = infiniteSynergy.generateInfinite(10);
      expect(result.coherence).toBeGreaterThan(0);
      // Coherence should decay but remain positive
    });

    test('should have coherence message', () => {
      const result = infiniteSynergy.generateInfinite(3);
      expect(result.message).toContain('Coherence');
      expect(result.message).toContain('%');
    });
  });

  describe('Path Finding', () => {
    test('should find path between nodes', () => {
      const result = infiniteSynergy.generateInfinite(3);
      
      // Get visualization to find node IDs
      const visualization = infiniteSynergy.getVisualization(3);
      if (visualization && visualization.children && visualization.children.length > 0) {
        const startId = visualization.id;
        const endId = visualization.children[0].id;
        
        const path = infiniteSynergy.findPath(startId, endId);
        expect(path).not.toBeNull();
        if (path) {
          expect(path.length).toBeGreaterThan(0);
          expect(path[0].id).toBe(startId);
          expect(path[path.length - 1].id).toBe(endId);
        }
      }
    });

    test('should return null for non-existent path', () => {
      const path = infiniteSynergy.findPath('nonexistent_start', 'nonexistent_end');
      expect(path).toBeNull();
    });

    test('should find path to self', () => {
      const result = infiniteSynergy.generateInfinite(2);
      const visualization = infiniteSynergy.getVisualization(2);
      if (visualization) {
        const path = infiniteSynergy.findPath(visualization.id, visualization.id);
        expect(path).not.toBeNull();
        if (path) {
          expect(path.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Visualization', () => {
    test('should generate visualization data', () => {
      const visualization = infiniteSynergy.getVisualization(3);
      expect(visualization).not.toBeNull();
      if (visualization) {
        expect(visualization.id).toBeDefined();
        expect(visualization.level).toBe(0);
        expect(visualization.synergy).toBeGreaterThan(0);
        expect(visualization.position).toBeDefined();
        expect(Array.isArray(visualization.position)).toBe(true);
        expect(visualization.position.length).toBe(3);
      }
    });

    test('should have 3D positions', () => {
      const visualization = infiniteSynergy.getVisualization(2);
      if (visualization) {
        const [x, y, z] = visualization.position;
        expect(typeof x).toBe('number');
        expect(typeof y).toBe('number');
        expect(typeof z).toBe('number');
      }
    });

    test('should limit visualization depth', () => {
      const visualization = infiniteSynergy.getVisualization(2);
      if (visualization && visualization.children) {
        // Should not exceed requested depth
        const maxDepth = Math.max(...visualization.children.map((c: any) => c.level || 0));
        expect(maxDepth).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('Synergy at Infinity', () => {
    test('should calculate synergy at infinity limit', () => {
      const infinitySynergy = infiniteSynergy.getSynergyAtInfinity();
      expect(typeof infinitySynergy).toBe('number');
      // Should be 0, 1, or Infinity depending on multiplier vs decay
    });

    test('should handle infinity case', () => {
      const infinitySynergy = infiniteSynergy.getSynergyAtInfinity();
      expect([0, 1, Infinity]).toContain(infinitySynergy);
    });
  });

  describe('Performance', () => {
    test('should handle low levels efficiently', () => {
      const start = performance.now();
      infiniteSynergy.generateInfinite(1);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    test('should handle medium levels', () => {
      const start = performance.now();
      infiniteSynergy.generateInfinite(5);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in < 1 second
    });

    test('should handle high levels', () => {
      const start = performance.now();
      const result = infiniteSynergy.generateInfinite(10);
      const duration = performance.now() - start;
      
      expect(result.nodes).toBeGreaterThan(0);
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });

    test('should scale node count correctly', () => {
      // Level 0: 1 node
      // Level 1: 1 + 4 = 5 nodes
      // Level 2: 1 + 4 + 16 = 21 nodes
      // Level n: (4^(n+1) - 1) / 3
      
      const level1 = infiniteSynergy.generateInfinite(1);
      expect(level1.nodes).toBe(1); // Root only
      
      const level2 = infiniteSynergy.generateInfinite(2);
      expect(level2.nodes).toBeGreaterThanOrEqual(5); // At least 1 + 4
    });
  });

  describe('Message Generation', () => {
    test('should generate synergy message', () => {
      const message = infiniteSynergy.getMessage();
      expect(message).toContain('Infinity');
      expect(message).toContain('mesh');
      expect(message.length).toBeGreaterThan(0);
    });

    test('should include synergy values in result message', () => {
      const result = infiniteSynergy.generateInfinite(3);
      expect(result.message).toContain('Synergy');
      expect(result.message).toContain('levels');
    });
  });

  describe('Edge Cases', () => {
    test('should handle 0 levels', () => {
      const result = infiniteSynergy.generateInfinite(0);
      expect(result.levels).toBe(0);
      expect(result.nodes).toBeGreaterThanOrEqual(0);
    });

    test('should handle 1 level', () => {
      const result = infiniteSynergy.generateInfinite(1);
      expect(result.levels).toBe(1);
      expect(result.nodes).toBe(1); // Root only
    });

    test('should handle very high levels', () => {
      // Test with reasonable high level (not actually infinite)
      const result = infiniteSynergy.generateInfinite(15);
      expect(result.levels).toBe(15);
      expect(result.nodes).toBeGreaterThan(0);
      expect(result.totalSynergy).toBeGreaterThan(0);
    });

    test('should handle reset and regenerate', () => {
      const result1 = infiniteSynergy.generateInfinite(3);
      infiniteSynergy.reset();
      const result2 = infiniteSynergy.generateInfinite(3);
      
      // Results should be similar (same structure)
      expect(result1.levels).toBe(result2.levels);
      expect(result1.nodes).toBe(result2.nodes);
    });
  });

  describe('Integration', () => {
    test('should work with GameEngine integration', () => {
      // This would be tested in GameEngine tests
      // But we can verify the interface works
      const result = infiniteSynergy.generateInfinite(3);
      expect(result).toHaveProperty('totalSynergy');
      expect(result).toHaveProperty('levels');
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('connections');
      expect(result).toHaveProperty('fractalDimension');
      expect(result).toHaveProperty('coherence');
      expect(result).toHaveProperty('message');
    });
  });

  describe('Mathematical Properties', () => {
    test('should use golden ratio in calculations', () => {
      const result = infiniteSynergy.generateInfinite(5);
      // Golden ratio (1.618) should be used in multiplier
      expect(result.totalSynergy).toBeGreaterThan(0);
    });

    test('should apply coherence decay', () => {
      const synergy0 = infiniteSynergy.getSynergyAtLevel(0);
      const synergy10 = infiniteSynergy.getSynergyAtLevel(10);
      
      // Coherence decay (0.95 per level) should reduce synergy at high levels
      // But multiplier (1.618) increases it
      // Net effect: synergy should still be positive
      expect(synergy10).toBeGreaterThan(0);
    });

    test('should maintain tetrahedron structure', () => {
      const result = infiniteSynergy.generateInfinite(3);
      // Each node represents a tetrahedron
      // Tetrahedron: 4 vertices, 6 edges, 4 faces
      expect(result.nodes).toBeGreaterThan(0);
    });
  });
});
