/**
 * P31 Language Parser
 * Domain-specific language for P31 ecosystem
 * 
 * "The syntax of sovereignty. The grammar of love."
 * 
 * 💜 With love and light. As above, so below. 💜
 */

export interface P31AST {
  type: 'system' | 'vertex' | 'component' | 'message' | 'operation' | 'protocol' | 'constraint';
  name: string;
  properties: Record<string, any>;
  children?: P31AST[];
}

export interface P31System {
  topology: 'tetrahedron';
  vertices: string[];
  components: string[];
  protocols: string[];
  constraints: string[];
}

export class P31LanguageParser {
  private tokens: string[] = [];
  private current: number = 0;

  /**
   * Parse P31 language source code
   */
  public parse(source: string): P31AST[] {
    // Tokenize
    this.tokens = this.tokenize(source);
    this.current = 0;

    // Parse
    const ast: P31AST[] = [];
    while (!this.isAtEnd()) {
      ast.push(this.parseStatement());
    }

    return ast;
  }

  /**
   * Tokenize source code
   */
  private tokenize(source: string): string[] {
    // Simple tokenization (in production, use proper lexer)
    return source
      .split(/\s+|([{}[\]():,;=])/g)
      .filter(token => token && token.trim())
      .map(token => token.trim());
  }

  /**
   * Check if at end of tokens
   */
  private isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  /**
   * Get current token
   */
  private peek(): string {
    if (this.isAtEnd()) return '';
    return this.tokens[this.current];
  }

  /**
   * Advance and return previous token
   */
  private advance(): string {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  /**
   * Check if current token matches
   */
  private match(...types: string[]): boolean {
    if (this.isAtEnd()) return false;
    return types.includes(this.peek());
  }

  /**
   * Parse statement
   */
  private parseStatement(): P31AST {
    const keyword = this.advance();

    switch (keyword) {
      case 'system':
        return this.parseSystem();
      case 'vertex':
        return this.parseVertex();
      case 'component':
        return this.parseComponent();
      case 'message':
        return this.parseMessage();
      case 'operation':
        return this.parseOperation();
      case 'protocol':
        return this.parseProtocol();
      case 'constraint':
        return this.parseConstraint();
      default:
        throw new Error(`Unexpected token: ${keyword}`);
    }
  }

  /**
   * Parse system declaration
   */
  private parseSystem(): P31AST {
    this.consume('{');
    const name = this.advance();
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'system', name, properties };
  }

  /**
   * Parse vertex declaration
   */
  private parseVertex(): P31AST {
    const name = this.advance();
    this.consume('{');
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'vertex', name, properties };
  }

  /**
   * Parse component declaration
   */
  private parseComponent(): P31AST {
    const name = this.advance();
    this.consume('{');
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'component', name, properties };
  }

  /**
   * Parse message declaration
   */
  private parseMessage(): P31AST {
    const name = this.advance();
    this.consume('{');
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'message', name, properties };
  }

  /**
   * Parse operation declaration
   */
  private parseOperation(): P31AST {
    const name = this.advance();
    this.consume('{');
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'operation', name, properties };
  }

  /**
   * Parse protocol declaration
   */
  private parseProtocol(): P31AST {
    const name = this.advance();
    this.consume('{');
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'protocol', name, properties };
  }

  /**
   * Parse constraint declaration
   */
  private parseConstraint(): P31AST {
    const name = this.advance();
    this.consume('{');
    const properties: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      properties[key] = value;
    }

    this.consume('}');
    return { type: 'constraint', name, properties };
  }

  /**
   * Parse value (string, number, array, object)
   */
  private parseValue(): any {
    if (this.match('[')) {
      return this.parseArray();
    }
    if (this.match('{')) {
      return this.parseObject();
    }
    const token = this.advance();
    
    // Try to parse as number
    const num = Number(token);
    if (!isNaN(num)) return num;
    
    // Return as string
    return token;
  }

  /**
   * Parse array
   */
  private parseArray(): any[] {
    this.consume('[');
    const array: any[] = [];

    while (!this.match(']')) {
      array.push(this.parseValue());
      if (this.match(',')) this.advance();
    }

    this.consume(']');
    return array;
  }

  /**
   * Parse object
   */
  private parseObject(): Record<string, any> {
    this.consume('{');
    const obj: Record<string, any> = {};

    while (!this.match('}')) {
      const key = this.advance();
      this.consume(':');
      const value = this.parseValue();
      obj[key] = value;
      if (this.match(',')) this.advance();
    }

    this.consume('}');
    return obj;
  }

  /**
   * Consume expected token
   */
  private consume(expected: string): void {
    if (this.peek() === expected) {
      this.advance();
      return;
    }
    throw new Error(`Expected ${expected}, got ${this.peek()}`);
  }

  /**
   * Validate P31 system
   */
  public validateSystem(ast: P31AST[]): P31System | null {
    const systemNode = ast.find(node => node.type === 'system');
    if (!systemNode) return null;

    const vertices = ast
      .filter(node => node.type === 'vertex')
      .map(node => node.name);

    const components = ast
      .filter(node => node.type === 'component')
      .map(node => node.name);

    const protocols = ast
      .filter(node => node.type === 'protocol')
      .map(node => node.name);

    const constraints = ast
      .filter(node => node.type === 'constraint')
      .map(node => node.name);

    // Validate tetrahedron constraint
    if (vertices.length !== 4) {
      throw new Error('Tetrahedron must have exactly 4 vertices');
    }

    return {
      topology: 'tetrahedron',
      vertices,
      components,
      protocols,
      constraints
    };
  }
}
