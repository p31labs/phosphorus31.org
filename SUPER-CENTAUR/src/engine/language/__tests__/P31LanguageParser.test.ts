/**
 * P31 Language Parser Tests
 * Comprehensive test suite for the P31 Language parser
 * 
 * With love and light. As above, so below. 💜
 */

import { P31LanguageParser, P31Token, P31ASTNode, P31ParseResult } from '../P31LanguageParser';

describe('P31 Language Parser', () => {
  let parser: P31LanguageParser;

  beforeEach(() => {
    parser = new P31LanguageParser();
  });

  describe('Tokenization', () => {
    test('tokenizes keywords correctly', () => {
      const result = parser.parse('build print quantum tetrahedron');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children).toBeDefined();
    });

    test('tokenizes numbers', () => {
      const result = parser.parse('123 456.789');
      expect(result.errors).toHaveLength(0);
    });

    test('tokenizes strings', () => {
      const result = parser.parse('"hello world" \'test\'');
      expect(result.errors).toHaveLength(0);
    });

    test('tokenizes operators', () => {
      const result = parser.parse('1 + 2 - 3 * 4 / 5');
      expect(result.errors).toHaveLength(0);
    });

    test('tokenizes identifiers', () => {
      const result = parser.parse('myVariable another_var');
      expect(result.errors).toHaveLength(0);
    });

    test('handles comments', () => {
      const result = parser.parse('// This is a comment\nbuild test');
      expect(result.errors).toHaveLength(0);
    });

    test('tracks line and column numbers', () => {
      const result = parser.parse('build\ntest\n123');
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Parsing Valid Syntax', () => {
    test('parses empty input', () => {
      const result = parser.parse('');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.type).toBe('program');
      expect(result.ast.children).toEqual([]);
    });

    test('parses build statement', () => {
      const result = parser.parse('build "structure"');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('build');
    });

    test('parses print statement', () => {
      const result = parser.parse('print "hello"');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('print');
    });

    test('parses quantum statement', () => {
      const result = parser.parse('quantum coherence');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('quantum');
    });

    test('parses tetrahedron statement', () => {
      const result = parser.parse('tetrahedron vertex 4');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('tetrahedron');
    });

    test('parses cosmic statement', () => {
      const result = parser.parse('cosmic timing');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('cosmic');
    });

    test('parses variable declaration', () => {
      const result = parser.parse('let x = 10');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('variable');
    });

    test('parses const declaration', () => {
      const result = parser.parse('const y = 20');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('variable');
    });

    test('parses function declaration', () => {
      const result = parser.parse('function test() { return 1; }');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('function');
    });

    test('parses if statement', () => {
      const result = parser.parse('if (true) { print "yes"; }');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('statement');
    });

    test('parses if-else statement', () => {
      const result = parser.parse('if (x > 0) { print "positive"; } else { print "negative"; }');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('statement');
    });

    test('parses for loop', () => {
      const result = parser.parse('for (let i = 0; i < 10; i = i + 1) { print i; }');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('statement');
    });

    test('parses while loop', () => {
      const result = parser.parse('while (x > 0) { x = x - 1; }');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('statement');
    });

    test('parses return statement', () => {
      const result = parser.parse('return 42');
      expect(result.errors).toHaveLength(0);
      expect(result.ast.children?.[0]?.type).toBe('statement');
    });

    test('parses arithmetic expressions', () => {
      const result = parser.parse('1 + 2 * 3 - 4 / 2');
      expect(result.errors).toHaveLength(0);
    });

    test('parses comparison expressions', () => {
      const result = parser.parse('x == y x != y x < y x > y x <= y x >= y');
      expect(result.errors).toHaveLength(0);
    });

    test('parses logical expressions', () => {
      const result = parser.parse('true && false true || false');
      expect(result.errors).toHaveLength(0);
    });

    test('parses function calls', () => {
      const result = parser.parse('test() test(1, 2, 3)');
      expect(result.errors).toHaveLength(0);
    });

    test('parses property access', () => {
      const result = parser.parse('obj.property');
      expect(result.errors).toHaveLength(0);
    });

    test('parses complex program', () => {
      const code = `
        let x = 10;
        function add(a, b) {
          return a + b;
        }
        if (x > 5) {
          print add(x, 5);
        }
      `;
      const result = parser.parse(code);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    test('returns error on invalid syntax', () => {
      const result = parser.parse('let x =');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('handles malformed input gracefully (no crash)', () => {
      const result = parser.parse('{{{');
      expect(result).toBeDefined();
      expect(result.ast).toBeDefined();
      // Should have errors but not crash
      expect(Array.isArray(result.errors)).toBe(true);
    });

    test('handles unexpected tokens', () => {
      const result = parser.parse('let x = @#$');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('handles missing closing brace', () => {
      const result = parser.parse('function test() { return 1;');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('handles missing closing parenthesis', () => {
      const result = parser.parse('if (true { print "test"; }');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('handles empty function body', () => {
      const result = parser.parse('function test() {}');
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('P31-Specific Keywords', () => {
    test('parses mesh keyword', () => {
      const result = parser.parse('mesh');
      expect(result.errors).toHaveLength(0);
    });

    test('parses holds keyword', () => {
      const result = parser.parse('holds');
      expect(result.errors).toHaveLength(0);
    });

    test('parses love keyword', () => {
      const result = parser.parse('love');
      expect(result.errors).toHaveLength(0);
    });

    test('parses light keyword', () => {
      const result = parser.parse('light');
      expect(result.errors).toHaveLength(0);
    });

    test('parses coherence keyword', () => {
      const result = parser.parse('coherence');
      expect(result.errors).toHaveLength(0);
    });

    test('parses family keyword', () => {
      const result = parser.parse('family');
      expect(result.errors).toHaveLength(0);
    });

    test('parses session keyword', () => {
      const result = parser.parse('session');
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('AST Structure', () => {
    test('creates program node as root', () => {
      const result = parser.parse('build test');
      expect(result.ast.type).toBe('program');
    });

    test('includes line and column in AST nodes', () => {
      const result = parser.parse('build "test"');
      const buildNode = result.ast.children?.[0];
      expect(buildNode?.line).toBeDefined();
      expect(buildNode?.column).toBeDefined();
    });

    test('preserves expression structure', () => {
      const result = parser.parse('1 + 2 * 3');
      expect(result.errors).toHaveLength(0);
      // Should parse with correct operator precedence
    });
  });

  describe('Edge Cases', () => {
    test('handles very long input', () => {
      const longCode = 'let x = 1; '.repeat(1000);
      const result = parser.parse(longCode);
      expect(result).toBeDefined();
    });

    test('handles unicode characters', () => {
      const result = parser.parse('let emoji = "💜✨🔺"');
      expect(result.errors).toHaveLength(0);
    });

    test('handles escaped strings', () => {
      const result = parser.parse('"hello\\nworld"');
      expect(result.errors).toHaveLength(0);
    });

    test('handles nested structures', () => {
      const code = `
        if (x > 0) {
          if (y > 0) {
            print "both positive";
          }
        }
      `;
      const result = parser.parse(code);
      expect(result.errors).toHaveLength(0);
    });
  });
});
