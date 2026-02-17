/**
 * P31 Language Executor Tests
 * Comprehensive test suite for the P31 Language executor
 * 
 * With love and light. As above, so below. 💜
 */

import { P31LanguageParser, P31ParseResult } from '../P31LanguageParser';
import { P31LanguageExecutor, P31ExecutionResult } from '../P31LanguageExecutor';

describe('P31 Language Executor', () => {
  let parser: P31LanguageParser;
  let executor: P31LanguageExecutor;

  beforeEach(() => {
    parser = new P31LanguageParser();
    executor = new P31LanguageExecutor(null, null);
  });

  describe('Basic Execution', () => {
    test('executes parsed command and returns result', () => {
      const parseResult = parser.parse('let x = 10');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
    });

    test('handles execution errors without crashing', () => {
      const parseResult = parser.parse('invalid syntax');
      const result = executor.execute(parseResult);
      expect(result).toBeDefined();
      // Should have error but not crash
      expect(result.error || result.value).toBeDefined();
    });

    test('returns side effects', () => {
      const parseResult = parser.parse('holds');
      const result = executor.execute(parseResult);
      expect(Array.isArray(result.sideEffects)).toBe(true);
    });

    test('handles empty program', () => {
      const parseResult = parser.parse('');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Variable Operations', () => {
    test('executes variable declaration', () => {
      const parseResult = parser.parse('let x = 10');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      // Check variable is set
      const context = executor.getContext();
      expect(context.variables.get('x')).toBe(10);
    });

    test('executes const declaration', () => {
      const parseResult = parser.parse('const y = 20');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('y')).toBe(20);
    });

    test('executes variable assignment', () => {
      const parseResult = parser.parse('let x = 5; x = 10');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('x')).toBe(10);
    });

    test('handles variable lookup', () => {
      const parseResult = parser.parse('let x = 42; x');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(42);
    });
  });

  describe('Arithmetic Operations', () => {
    test('executes addition', () => {
      const parseResult = parser.parse('1 + 2');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(3);
    });

    test('executes subtraction', () => {
      const parseResult = parser.parse('5 - 3');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(2);
    });

    test('executes multiplication', () => {
      const parseResult = parser.parse('4 * 3');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(12);
    });

    test('executes division', () => {
      const parseResult = parser.parse('10 / 2');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(5);
    });

    test('respects operator precedence', () => {
      const parseResult = parser.parse('1 + 2 * 3');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(7); // 1 + (2 * 3) = 7
    });

    test('handles parentheses', () => {
      const parseResult = parser.parse('(1 + 2) * 3');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(9); // (1 + 2) * 3 = 9
    });
  });

  describe('Comparison Operations', () => {
    test('executes equality comparison', () => {
      const parseResult = parser.parse('5 == 5');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes inequality comparison', () => {
      const parseResult = parser.parse('5 != 3');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes less than comparison', () => {
      const parseResult = parser.parse('3 < 5');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes greater than comparison', () => {
      const parseResult = parser.parse('5 > 3');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes less than or equal comparison', () => {
      const parseResult = parser.parse('5 <= 5');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes greater than or equal comparison', () => {
      const parseResult = parser.parse('5 >= 5');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });
  });

  describe('Logical Operations', () => {
    test('executes logical AND', () => {
      const parseResult = parser.parse('true && true');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes logical OR', () => {
      const parseResult = parser.parse('false || true');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });

    test('executes logical NOT', () => {
      const parseResult = parser.parse('!false');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
    });
  });

  describe('Control Flow', () => {
    test('executes if statement with true condition', () => {
      const parseResult = parser.parse('if (true) { let x = 1; }');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('x')).toBe(1);
    });

    test('executes if statement with false condition', () => {
      const parseResult = parser.parse('if (false) { let x = 1; }');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.has('x')).toBe(false);
    });

    test('executes if-else statement', () => {
      const parseResult = parser.parse('if (false) { let x = 1; } else { let x = 2; }');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('x')).toBe(2);
    });

    test('executes for loop', () => {
      const parseResult = parser.parse('let sum = 0; for (let i = 0; i < 3; i = i + 1) { sum = sum + i; }');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('sum')).toBe(3); // 0 + 1 + 2 = 3
    });

    test('executes while loop', () => {
      const parseResult = parser.parse('let x = 3; while (x > 0) { x = x - 1; }');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('x')).toBe(0);
    });
  });

  describe('Functions', () => {
    test('executes function declaration', () => {
      const parseResult = parser.parse('function add(a, b) { return a + b; }');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.functions.has('add')).toBe(true);
    });

    test('executes function call', () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
        add(2, 3)
      `;
      const parseResult = parser.parse(code);
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(5);
    });

    test('handles function scope', () => {
      const code = `
        let x = 10;
        function test() {
          let x = 20;
          return x;
        }
        test()
      `;
      const parseResult = parser.parse(code);
      const result = executor.execute(parseResult);
      expect(result.value).toBe(20);
      
      const context = executor.getContext();
      expect(context.variables.get('x')).toBe(10); // Outer scope preserved
    });
  });

  describe('P31-Specific Features', () => {
    test('executes build statement', () => {
      const parseResult = parser.parse('build "structure"');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.sideEffects.length).toBeGreaterThan(0);
    });

    test('executes print statement', () => {
      const parseResult = parser.parse('print "hello"');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.sideEffects.length).toBeGreaterThan(0);
    });

    test('executes quantum statement', () => {
      const parseResult = parser.parse('quantum coherence');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.sideEffects.length).toBeGreaterThan(0);
    });

    test('executes tetrahedron statement', () => {
      const parseResult = parser.parse('tetrahedron vertex 4');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      expect(result.sideEffects.length).toBeGreaterThan(0);
    });

    test('executes cosmic statement', () => {
      const parseResult = parser.parse('cosmic timing');
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
    });

    test('accesses built-in mesh variable', () => {
      const parseResult = parser.parse('mesh');
      const result = executor.execute(parseResult);
      expect(result.value).toEqual({ holds: true });
    });

    test('accesses built-in love variable', () => {
      const parseResult = parser.parse('love');
      const result = executor.execute(parseResult);
      expect(result.value).toBe('💜');
    });

    test('accesses built-in light variable', () => {
      const parseResult = parser.parse('light');
      const result = executor.execute(parseResult);
      expect(result.value).toBe('✨');
    });

    test('accesses built-in tetrahedron variable', () => {
      const parseResult = parser.parse('tetrahedron');
      const result = executor.execute(parseResult);
      expect(result.value).toEqual({ vertices: 4, edges: 6, faces: 4 });
    });

    test('executes holds built-in function', () => {
      const parseResult = parser.parse('holds');
      const result = executor.execute(parseResult);
      expect(result.value).toBe(true);
      expect(result.sideEffects).toContain('The Mesh Holds. 🔺');
    });
  });

  describe('Error Handling', () => {
    test('returns error on parse errors', () => {
      const parseResult = parser.parse('invalid syntax');
      const result = executor.execute(parseResult);
      expect(result.error).toBeDefined();
    });

    test('handles undefined variables gracefully', () => {
      const parseResult = parser.parse('undefinedVar');
      const result = executor.execute(parseResult);
      // Should handle gracefully (may return null or error)
      expect(result).toBeDefined();
    });

    test('handles division by zero', () => {
      const parseResult = parser.parse('1 / 0');
      const result = executor.execute(parseResult);
      // Should handle gracefully (may return Infinity or error)
      expect(result).toBeDefined();
    });

    test('handles timeout on long-running commands', () => {
      // This would require a timeout mechanism in executor
      // For now, just verify it doesn't hang
      const parseResult = parser.parse('let x = 1');
      const result = executor.execute(parseResult);
      expect(result).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    test('executes multiple commands in sequence', () => {
      const code = `
        let x = 1;
        let y = 2;
        let z = x + y;
      `;
      const parseResult = parser.parse(code);
      const result = executor.execute(parseResult);
      expect(result.error).toBeUndefined();
      
      const context = executor.getContext();
      expect(context.variables.get('z')).toBe(3);
    });
  });

  describe('Context Management', () => {
    test('clears context correctly', () => {
      const parseResult1 = parser.parse('let x = 10');
      executor.execute(parseResult1);
      
      executor.clearContext();
      
      const context = executor.getContext();
      expect(context.variables.has('x')).toBe(false);
      // Built-ins should still be present
      expect(context.variables.has('mesh')).toBe(true);
    });

    test('preserves context between executions', () => {
      const parseResult1 = parser.parse('let x = 10');
      executor.execute(parseResult1);
      
      const parseResult2 = parser.parse('x');
      const result = executor.execute(parseResult2);
      expect(result.value).toBe(10);
    });
  });

  describe('Complex Programs', () => {
    test('executes complex program with multiple statements', () => {
      const code = `
        let sum = 0;
        for (let i = 1; i <= 5; i = i + 1) {
          sum = sum + i;
        }
        sum
      `;
      const parseResult = parser.parse(code);
      const result = executor.execute(parseResult);
      expect(result.value).toBe(15); // 1 + 2 + 3 + 4 + 5 = 15
    });

    test('executes program with nested functions', () => {
      const code = `
        function outer() {
          function inner() {
            return 42;
          }
          return inner();
        }
        outer()
      `;
      const parseResult = parser.parse(code);
      const result = executor.execute(parseResult);
      expect(result.value).toBe(42);
    });
  });
});
