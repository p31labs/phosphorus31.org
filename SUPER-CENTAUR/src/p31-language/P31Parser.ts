/**
 * P31 Language Parser
 * Parses P31 DSL into Abstract Syntax Tree
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface TetrahedronNode extends ASTNode {
  type: 'Tetrahedron';
  id: string;
  vertices: VertexNode[];
  edges: EdgeNode[];
}

export interface VertexNode extends ASTNode {
  type: 'Vertex';
  id: string;
  label: string;
}

export interface EdgeNode extends ASTNode {
  type: 'Edge';
  id: string;
  from: string;
  to: string;
}

export interface FunctionNode extends ASTNode {
  type: 'Function';
  name: string;
  parameters: ParameterNode[];
  returnType?: string;
  body: ASTNode[];
}

export interface ParameterNode extends ASTNode {
  type: 'Parameter';
  name: string;
  typeAnnotation: string;
}

export class P31Parser {
  private logger: Logger;
  private tokens: string[] = [];
  private current: number = 0;

  constructor() {
    this.logger = new Logger('P31Parser');
  }

  /**
   * Parse P31 source code into AST
   */
  public parse(source: string): ASTNode[] {
    this.tokens = this.tokenize(source);
    this.current = 0;
    
    const statements: ASTNode[] = [];
    
    while (!this.isAtEnd()) {
      statements.push(this.parseStatement());
    }
    
    return statements;
  }

  /**
   * Tokenize source code
   */
  private tokenize(source: string): string[] {
    // Simple tokenizer - in production, use a proper lexer
    const tokens: string[] = [];
    const regex = /(\s+|[{}();,=:\[\]]|[a-zA-Z_][a-zA-Z0-9_]*|"[^"]*"|\d+\.?\d*)/g;
    let match;
    
    while ((match = regex.exec(source)) !== null) {
      const token = match[0].trim();
      if (token) {
        tokens.push(token);
      }
    }
    
    return tokens;
  }

  /**
   * Parse a statement
   */
  private parseStatement(): ASTNode {
    if (this.match('tetrahedron')) {
      return this.parseTetrahedron();
    }
    if (this.match('function')) {
      return this.parseFunction();
    }
    if (this.match('let')) {
      return this.parseDeclaration();
    }
    if (this.match('buffer', 'centaur', 'scope', 'node_one')) {
      return this.parseComponent();
    }
    
    return this.parseExpression();
  }

  /**
   * Parse tetrahedron definition
   */
  private parseTetrahedron(): TetrahedronNode {
    const id = this.consume('IDENTIFIER', 'Expected tetrahedron identifier');
    this.consume('{', 'Expected { after tetrahedron name');
    
    const vertices: VertexNode[] = [];
    const edges: EdgeNode[] = [];
    
    while (!this.check('}') && !this.isAtEnd()) {
      if (this.match('vertex')) {
        vertices.push(this.parseVertex());
      } else if (this.match('edge')) {
        edges.push(this.parseEdge());
      } else {
        this.advance();
      }
    }
    
    this.consume('}', 'Expected } after tetrahedron body');
    
    return {
      type: 'Tetrahedron',
      id,
      vertices,
      edges,
    };
  }

  /**
   * Parse vertex definition
   */
  private parseVertex(): VertexNode {
    const id = this.consume('IDENTIFIER', 'Expected vertex identifier');
    this.consume(':', 'Expected : after vertex identifier');
    const label = this.parseString();
    this.consume(';', 'Expected ; after vertex label');
    
    return {
      type: 'Vertex',
      id,
      label,
    };
  }

  /**
   * Parse edge definition
   */
  private parseEdge(): EdgeNode {
    const id = this.consume('IDENTIFIER', 'Expected edge identifier');
    this.consume(':', 'Expected : after edge identifier');
    this.consume('connect', 'Expected connect()');
    this.consume('(', 'Expected ( after connect');
    const from = this.consume('IDENTIFIER', 'Expected from vertex');
    this.consume(',', 'Expected , between vertices');
    const to = this.consume('IDENTIFIER', 'Expected to vertex');
    this.consume(')', 'Expected ) after vertices');
    this.consume(';', 'Expected ; after edge definition');
    
    return {
      type: 'Edge',
      id,
      from,
      to,
    };
  }

  /**
   * Parse function definition
   */
  private parseFunction(): FunctionNode {
    const name = this.consume('IDENTIFIER', 'Expected function name');
    this.consume('(', 'Expected ( after function name');
    
    const parameters: ParameterNode[] = [];
    if (!this.check(')')) {
      do {
        const paramName = this.consume('IDENTIFIER', 'Expected parameter name');
        this.consume(':', 'Expected : after parameter name');
        const paramType = this.consume('IDENTIFIER', 'Expected parameter type');
        parameters.push({
          type: 'Parameter',
          name: paramName,
          typeAnnotation: paramType,
        });
      } while (this.match(','));
    }
    
    this.consume(')', 'Expected ) after parameters');
    
    let returnType: string | undefined;
    if (this.match(':')) {
      returnType = this.consume('IDENTIFIER', 'Expected return type');
    }
    
    this.consume('{', 'Expected { after function signature');
    
    const body: ASTNode[] = [];
    while (!this.check('}') && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    
    this.consume('}', 'Expected } after function body');
    
    return {
      type: 'Function',
      name,
      parameters,
      returnType,
      body,
    };
  }

  /**
   * Parse declaration
   */
  private parseDeclaration(): ASTNode {
    const name = this.consume('IDENTIFIER', 'Expected variable name');
    this.consume(':', 'Expected : after variable name');
    const type = this.consume('IDENTIFIER', 'Expected type');
    this.consume('=', 'Expected = after type');
    const value = this.parseExpression();
    this.consume(';', 'Expected ; after declaration');
    
    return {
      type: 'Declaration',
      name,
      typeAnnotation: type,
      value,
    };
  }

  /**
   * Parse component definition
   */
  private parseComponent(): ASTNode {
    const componentType = this.previous();
    const id = this.consume('IDENTIFIER', 'Expected component identifier');
    this.consume('{', 'Expected { after component name');
    
    const properties: Record<string, ASTNode> = {};
    
    while (!this.check('}') && !this.isAtEnd()) {
      const key = this.consume('IDENTIFIER', 'Expected property name');
      this.consume(':', 'Expected : after property name');
      const value = this.parseExpression();
      this.consume(';', 'Expected ; after property');
      properties[key] = value;
    }
    
    this.consume('}', 'Expected } after component body');
    
    return {
      type: 'Component',
      componentType,
      id,
      properties,
    };
  }

  /**
   * Parse expression
   */
  private parseExpression(): ASTNode {
    // Simplified expression parser
    if (this.match('IDENTIFIER')) {
      const name = this.previous();
      if (this.match('(')) {
        return this.parseFunctionCall(name);
      }
      return { type: 'Identifier', name };
    }
    
    if (this.check('STRING')) {
      return { type: 'String', value: this.parseString() };
    }
    
    if (this.check('NUMBER')) {
      return { type: 'Number', value: parseFloat(this.advance()) };
    }
    
    return { type: 'Unknown' };
  }

  /**
   * Parse function call
   */
  private parseFunctionCall(name: string): ASTNode {
    const args: ASTNode[] = [];
    
    if (!this.check(')')) {
      do {
        args.push(this.parseExpression());
      } while (this.match(','));
    }
    
    this.consume(')', 'Expected ) after arguments');
    
    return {
      type: 'FunctionCall',
      name,
      arguments: args,
    };
  }

  /**
   * Parse string literal
   */
  private parseString(): string {
    const token = this.advance();
    return token.replace(/^"|"$/g, '');
  }

  /**
   * Helper methods
   */
  private match(...types: string[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: string): boolean {
    if (this.isAtEnd()) return false;
    return this.peek() === type || this.isIdentifier(type) || this.isString(type) || this.isNumber(type);
  }

  private isIdentifier(token: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token);
  }

  private isString(token: string): boolean {
    return token.startsWith('"') && token.endsWith('"');
  }

  private isNumber(token: string): boolean {
    return /^\d+\.?\d*$/.test(token);
  }

  private advance(): string {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private peek(): string {
    if (this.isAtEnd()) return '';
    return this.tokens[this.current];
  }

  private previous(): string {
    return this.tokens[this.current - 1];
  }

  private consume(expected: string, message: string): string {
    if (this.check(expected)) {
      return this.advance();
    }
    throw new Error(message);
  }
}
