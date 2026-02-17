/**
 * P31 Language Parser
 * Domain-specific language for the P31 ecosystem
 * 
 * "Oh the places we will go"
 * With love and light. As above, so below. 💜
 */

export interface P31Token {
  type: 'keyword' | 'identifier' | 'number' | 'string' | 'operator' | 'punctuation' | 'comment';
  value: string;
  line: number;
  column: number;
}

export interface P31ASTNode {
  type: 'program' | 'statement' | 'expression' | 'block' | 'function' | 'variable' | 'call' | 'tetrahedron' | 'quantum' | 'cosmic' | 'build' | 'print';
  value?: any;
  children?: P31ASTNode[];
  params?: Record<string, any>;
  line?: number;
  column?: number;
}

export interface P31ParseResult {
  ast: P31ASTNode;
  errors: string[];
  warnings: string[];
}

export class P31LanguageParser {
  private tokens: P31Token[] = [];
  private current: number = 0;
  private keywords: Set<string> = new Set([
    'build', 'print', 'quantum', 'coherence', 'tetrahedron', 'vertex', 'edge', 'face',
    'cosmic', 'timing', 'transition', 'saturn', 'aries', 'mesh', 'holds',
    'let', 'const', 'function', 'if', 'else', 'for', 'while', 'return',
    'family', 'session', 'code', 'slice', 'vibe', 'love', 'light'
  ]);

  constructor() {
    console.log('🔺 P31 Language Parser initialized');
  }

  /**
   * Parse P31 language code
   */
  public parse(code: string): P31ParseResult {
    this.tokens = this.tokenize(code);
    this.current = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const ast = this.parseProgram();
      return { ast, errors, warnings };
    } catch (error: any) {
      errors.push(error.message || 'Parse error');
      return {
        ast: { type: 'program', children: [] },
        errors,
        warnings
      };
    }
  }

  /**
   * Tokenize code into tokens
   */
  private tokenize(code: string): P31Token[] {
    const tokens: P31Token[] = [];
    let line = 1;
    let column = 1;
    let i = 0;

    while (i < code.length) {
      const char = code[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        if (char === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
        i++;
        continue;
      }

      // Comments
      if (char === '/' && code[i + 1] === '/') {
        while (i < code.length && code[i] !== '\n') {
          i++;
        }
        continue;
      }

      // Numbers
      if (/\d/.test(char)) {
        let num = '';
        while (i < code.length && /[\d.]/.test(code[i])) {
          num += code[i];
          i++;
          column++;
        }
        tokens.push({ type: 'number', value: num, line, column: column - num.length });
        continue;
      }

      // Strings
      if (char === '"' || char === "'") {
        const quote = char;
        let str = '';
        i++;
        column++;
        while (i < code.length && code[i] !== quote) {
          if (code[i] === '\\') {
            i++;
            column++;
            if (i < code.length) {
              str += code[i];
              i++;
              column++;
            }
          } else {
            str += code[i];
            i++;
            column++;
          }
        }
        if (i < code.length) {
          i++;
          column++;
        }
        tokens.push({ type: 'string', value: str, line, column: column - str.length - 2 });
        continue;
      }

      // Operators
      const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>='];
      let matched = false;
      for (const op of operators) {
        if (code.substr(i, op.length) === op) {
          tokens.push({ type: 'operator', value: op, line, column });
          i += op.length;
          column += op.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // Punctuation
      if (['(', ')', '{', '}', '[', ']', ',', ';', '.'].includes(char)) {
        tokens.push({ type: 'punctuation', value: char, line, column });
        i++;
        column++;
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        let ident = '';
        while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
          ident += code[i];
          i++;
          column++;
        }
        const type = this.keywords.has(ident) ? 'keyword' : 'identifier';
        tokens.push({ type, value: ident, line, column: column - ident.length });
        continue;
      }

      // Unknown character
      i++;
      column++;
    }

    return tokens;
  }

  /**
   * Parse program
   */
  private parseProgram(): P31ASTNode {
    const statements: P31ASTNode[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.parseStatement());
    }

    return {
      type: 'program',
      children: statements
    };
  }

  /**
   * Parse statement
   */
  private parseStatement(): P31ASTNode {
    if (this.check('build')) {
      return this.parseBuild();
    }
    if (this.check('print')) {
      return this.parsePrint();
    }
    if (this.check('quantum')) {
      return this.parseQuantum();
    }
    if (this.check('tetrahedron')) {
      return this.parseTetrahedron();
    }
    if (this.check('cosmic')) {
      return this.parseCosmic();
    }
    if (this.check('let') || this.check('const')) {
      return this.parseVariable();
    }
    if (this.check('function')) {
      return this.parseFunction();
    }
    if (this.check('if')) {
      return this.parseIf();
    }
    if (this.check('for')) {
      return this.parseFor();
    }
    if (this.check('while')) {
      return this.parseWhile();
    }
    if (this.check('return')) {
      return this.parseReturn();
    }

    // Expression statement
    return this.parseExpression();
  }

  /**
   * Parse build statement
   */
  private parseBuild(): P31ASTNode {
    this.advance(); // consume 'build'
    const structure = this.parseExpression();
    return {
      type: 'build',
      children: [structure],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse print statement
   */
  private parsePrint(): P31ASTNode {
    this.advance(); // consume 'print'
    const target = this.parseExpression();
    return {
      type: 'print',
      children: [target],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse quantum statement
   */
  private parseQuantum(): P31ASTNode {
    this.advance(); // consume 'quantum'
    const coherence = this.parseExpression();
    return {
      type: 'quantum',
      children: [coherence],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse tetrahedron statement
   */
  private parseTetrahedron(): P31ASTNode {
    this.advance(); // consume 'tetrahedron'
    const params: Record<string, any> = {};
    
    if (this.check('vertex')) {
      this.advance();
      params.vertices = this.parseExpression();
    }
    
    return {
      type: 'tetrahedron',
      params,
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse cosmic statement
   */
  private parseCosmic(): P31ASTNode {
    this.advance(); // consume 'cosmic'
    const timing = this.parseExpression();
    return {
      type: 'cosmic',
      children: [timing],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse variable declaration
   */
  private parseVariable(): P31ASTNode {
    const isConst = this.check('const');
    this.advance(); // consume 'let' or 'const'
    
    const name = this.consume('identifier', 'Expected variable name').value;
    this.consume('operator', 'Expected =').value; // consume '='
    const value = this.parseExpression();
    
    return {
      type: 'variable',
      value: name,
      params: { const: isConst },
      children: [value],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse function declaration
   */
  private parseFunction(): P31ASTNode {
    this.advance(); // consume 'function'
    const name = this.consume('identifier', 'Expected function name').value;
    this.consume('punctuation', 'Expected (').value; // consume '('
    
    const params: string[] = [];
    if (!this.check('punctuation', ')')) {
      do {
        params.push(this.consume('identifier', 'Expected parameter name').value);
      } while (this.check('punctuation', ',') && this.advance());
    }
    
    this.consume('punctuation', 'Expected )').value; // consume ')'
    this.consume('punctuation', 'Expected {').value; // consume '{'
    
    const body: P31ASTNode[] = [];
    while (!this.check('punctuation', '}') && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    
    this.consume('punctuation', 'Expected }').value; // consume '}'
    
    return {
      type: 'function',
      value: name,
      params: { parameters: params },
      children: body,
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse if statement
   */
  private parseIf(): P31ASTNode {
    this.advance(); // consume 'if'
    this.consume('punctuation', 'Expected (').value; // consume '('
    const condition = this.parseExpression();
    this.consume('punctuation', 'Expected )').value; // consume ')'
    this.consume('punctuation', 'Expected {').value; // consume '{'
    
    const thenBranch: P31ASTNode[] = [];
    while (!this.check('punctuation', '}') && !this.isAtEnd()) {
      thenBranch.push(this.parseStatement());
    }
    this.consume('punctuation', 'Expected }').value; // consume '}'
    
    let elseBranch: P31ASTNode[] | undefined;
    if (this.check('else')) {
      this.advance(); // consume 'else'
      this.consume('punctuation', 'Expected {').value; // consume '{'
      elseBranch = [];
      while (!this.check('punctuation', '}') && !this.isAtEnd()) {
        elseBranch.push(this.parseStatement());
      }
      this.consume('punctuation', 'Expected }').value; // consume '}'
    }
    
    return {
      type: 'statement',
      value: 'if',
      params: { condition },
      children: [
        { type: 'block', children: thenBranch },
        elseBranch ? { type: 'block', children: elseBranch } : undefined
      ].filter(Boolean) as P31ASTNode[],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse for loop
   */
  private parseFor(): P31ASTNode {
    this.advance(); // consume 'for'
    this.consume('punctuation', 'Expected (').value; // consume '('
    const init = this.parseStatement();
    this.consume('punctuation', 'Expected ;').value; // consume ';'
    const condition = this.parseExpression();
    this.consume('punctuation', 'Expected ;').value; // consume ';'
    const increment = this.parseExpression();
    this.consume('punctuation', 'Expected )').value; // consume ')'
    this.consume('punctuation', 'Expected {').value; // consume '{'
    
    const body: P31ASTNode[] = [];
    while (!this.check('punctuation', '}') && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    this.consume('punctuation', 'Expected }').value; // consume '}'
    
    return {
      type: 'statement',
      value: 'for',
      params: { init, condition, increment },
      children: [{ type: 'block', children: body }],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse while loop
   */
  private parseWhile(): P31ASTNode {
    this.advance(); // consume 'while'
    this.consume('punctuation', 'Expected (').value; // consume '('
    const condition = this.parseExpression();
    this.consume('punctuation', 'Expected )').value; // consume ')'
    this.consume('punctuation', 'Expected {').value; // consume '{'
    
    const body: P31ASTNode[] = [];
    while (!this.check('punctuation', '}') && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    this.consume('punctuation', 'Expected }').value; // consume '}'
    
    return {
      type: 'statement',
      value: 'while',
      params: { condition },
      children: [{ type: 'block', children: body }],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse return statement
   */
  private parseReturn(): P31ASTNode {
    this.advance(); // consume 'return'
    const value = this.parseExpression();
    return {
      type: 'statement',
      value: 'return',
      children: [value],
      line: this.previous()?.line,
      column: this.previous()?.column
    };
  }

  /**
   * Parse expression
   */
  private parseExpression(): P31ASTNode {
    return this.parseAssignment();
  }

  /**
   * Parse assignment
   */
  private parseAssignment(): P31ASTNode {
    let expr = this.parseOr();

    if (this.check('operator', '=')) {
      this.advance();
      const value = this.parseAssignment();
      return {
        type: 'expression',
        value: '=',
        children: [expr, value]
      };
    }

    return expr;
  }

  /**
   * Parse logical OR
   */
  private parseOr(): P31ASTNode {
    let expr = this.parseAnd();

    while (this.check('operator', '||')) {
      this.advance();
      const right = this.parseAnd();
      expr = {
        type: 'expression',
        value: '||',
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse logical AND
   */
  private parseAnd(): P31ASTNode {
    let expr = this.parseEquality();

    while (this.check('operator', '&&')) {
      this.advance();
      const right = this.parseEquality();
      expr = {
        type: 'expression',
        value: '&&',
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse equality
   */
  private parseEquality(): P31ASTNode {
    let expr = this.parseComparison();

    while (this.check('operator', '==') || this.check('operator', '!=')) {
      const op = this.advance().value;
      const right = this.parseComparison();
      expr = {
        type: 'expression',
        value: op,
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse comparison
   */
  private parseComparison(): P31ASTNode {
    let expr = this.parseTerm();

    while (this.check('operator', '<') || this.check('operator', '>') ||
           this.check('operator', '<=') || this.check('operator', '>=')) {
      const op = this.advance().value;
      const right = this.parseTerm();
      expr = {
        type: 'expression',
        value: op,
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse term
   */
  private parseTerm(): P31ASTNode {
    let expr = this.parseFactor();

    while (this.check('operator', '+') || this.check('operator', '-')) {
      const op = this.advance().value;
      const right = this.parseFactor();
      expr = {
        type: 'expression',
        value: op,
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse factor
   */
  private parseFactor(): P31ASTNode {
    let expr = this.parseUnary();

    while (this.check('operator', '*') || this.check('operator', '/')) {
      const op = this.advance().value;
      const right = this.parseUnary();
      expr = {
        type: 'expression',
        value: op,
        children: [expr, right]
      };
    }

    return expr;
  }

  /**
   * Parse unary
   */
  private parseUnary(): P31ASTNode {
    if (this.check('operator', '!') || this.check('operator', '-')) {
      const op = this.advance().value;
      const right = this.parseUnary();
      return {
        type: 'expression',
        value: op,
        children: [right]
      };
    }

    return this.parseCall();
  }

  /**
   * Parse call
   */
  private parseCall(): P31ASTNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.check('punctuation', '(')) {
        expr = this.finishCall(expr);
      } else if (this.check('punctuation', '.')) {
        this.advance(); // consume '.'
        const name = this.consume('identifier', 'Expected property name').value;
        expr = {
          type: 'call',
          value: '.',
          children: [expr, { type: 'expression', value: name }]
        };
      } else {
        break;
      }
    }

    return expr;
  }

  /**
   * Finish function call
   */
  private finishCall(callee: P31ASTNode): P31ASTNode {
    this.advance(); // consume '('
    const args: P31ASTNode[] = [];

    if (!this.check('punctuation', ')')) {
      do {
        args.push(this.parseExpression());
      } while (this.check('punctuation', ',') && this.advance());
    }

    this.consume('punctuation', 'Expected )').value; // consume ')'
    
    return {
      type: 'call',
      value: 'call',
      children: [callee, ...args]
    };
  }

  /**
   * Parse primary
   */
  private parsePrimary(): P31ASTNode {
    if (this.check('number')) {
      return {
        type: 'expression',
        value: parseFloat(this.advance().value),
        line: this.previous()?.line,
        column: this.previous()?.column
      };
    }

    if (this.check('string')) {
      return {
        type: 'expression',
        value: this.advance().value,
        line: this.previous()?.line,
        column: this.previous()?.column
      };
    }

    if (this.check('identifier')) {
      return {
        type: 'expression',
        value: this.advance().value,
        line: this.previous()?.line,
        column: this.previous()?.column
      };
    }

    if (this.check('punctuation', '(')) {
      this.advance(); // consume '('
      const expr = this.parseExpression();
      this.consume('punctuation', 'Expected )').value; // consume ')'
      return expr;
    }

    throw new Error(`Unexpected token: ${this.peek().value}`);
  }

  /**
   * Check if current token matches
   */
  private check(type: string, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (value !== undefined) {
      return token.type === type && token.value === value;
    }
    return token.type === type;
  }

  /**
   * Advance and return previous token
   */
  private advance(): P31Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  /**
   * Check if at end
   */
  private isAtEnd(): boolean {
    return this.peek().type === 'punctuation' && this.peek().value === 'EOF' || this.current >= this.tokens.length;
  }

  /**
   * Peek at current token
   */
  private peek(): P31Token {
    if (this.current >= this.tokens.length) {
      return { type: 'punctuation', value: 'EOF', line: 0, column: 0 };
    }
    return this.tokens[this.current];
  }

  /**
   * Get previous token
   */
  private previous(): P31Token {
    return this.tokens[this.current - 1];
  }

  /**
   * Consume token with expected type
   */
  private consume(type: string, message: string): P31Token {
    if (this.check(type)) {
      return this.advance();
    }
    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
  }
}
