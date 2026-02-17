/**
 * P31 Language Parser and Interpreter
 * Domain-Specific Language for the P31 Ecosystem
 * 
 * "The biological qubit. The atom in the bone."
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import * as THREE from 'three';

// ============================================================================
// Types
// ============================================================================

export type P31Value = 
  | number 
  | string 
  | boolean 
  | THREE.Vector3 
  | THREE.Euler 
  | GeometricPrimitive 
  | Structure 
  | Family 
  | QuantumState 
  | Color 
  | Vertex 
  | P31Value[];

export interface GeometricPrimitive {
  id: string;
  type: 'tetrahedron' | 'octahedron' | 'icosahedron' | 'strut' | 'hub';
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: string;
  material: 'wood' | 'metal' | 'crystal' | 'quantum';
  quantum?: QuantumState;
}

export interface Structure {
  id: string;
  name: string;
  primitives: GeometricPrimitive[];
  vertices?: number;
  edges?: number;
  isRigid?: boolean;
  quantum?: QuantumState;
}

export interface Family {
  vertex_a: Vertex;
  vertex_b: Vertex;
  vertex_c: Vertex;
  vertex_d: Vertex;
}

export interface QuantumState {
  coherence: number;
  entanglement: string[];
  phase: number;
}

export type Color = string; // Hex color or named color
export type Vertex = 'VERTEX_A' | 'VERTEX_B' | 'VERTEX_C' | 'VERTEX_D';

export interface P31Context {
  variables: Map<string, P31Value>;
  structures: Map<string, Structure>;
  families: Map<string, Family>;
  functions: Map<string, P31Function>;
}

export type P31Function = (args: P31Value[], context: P31Context) => P31Value;

// ============================================================================
// Tokenizer
// ============================================================================

export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  COLOR = 'COLOR',
  VERTEX = 'VERTEX',
  
  // Keywords
  MODULE = 'MODULE',
  STRUCTURE = 'STRUCTURE',
  FAMILY = 'FAMILY',
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  CONST = 'CONST',
  IF = 'IF',
  ELSE = 'ELSE',
  FOR = 'FOR',
  WHILE = 'WHILE',
  RETURN = 'RETURN',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  
  // Types
  TETRAHEDRON = 'TETRAHEDRON',
  OCTAHEDRON = 'OCTAHEDRON',
  ICOSAHEDRON = 'ICOSAHEDRON',
  STRUT = 'STRUT',
  HUB = 'HUB',
  VEC3 = 'VEC3',
  EULER = 'EULER',
  QUANTUM = 'QUANTUM',
  
  // Materials
  WOOD = 'WOOD',
  METAL = 'METAL',
  CRYSTAL = 'CRYSTAL',
  QUANTUM_MAT = 'QUANTUM_MAT',
  
  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS = 'LESS',
  GREATER = 'GREATER',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER_EQUAL = 'GREATER_EQUAL',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  ASSIGN = 'ASSIGN',
  
  // Delimiters
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  COMMA = 'COMMA',
  SEMICOLON = 'SEMICOLON',
  COLON = 'COLON',
  DOT = 'DOT',
  
  // Identifiers
  IDENTIFIER = 'IDENTIFIER',
  
  // End of file
  EOF = 'EOF'
}

export interface Token {
  type: TokenType;
  value: string | number | boolean;
  line: number;
  column: number;
}

export class P31Tokenizer {
  private source: string;
  private current: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  private keywords: Map<string, TokenType> = new Map([
    ['module', TokenType.MODULE],
    ['structure', TokenType.STRUCTURE],
    ['family', TokenType.FAMILY],
    ['function', TokenType.FUNCTION],
    ['let', TokenType.LET],
    ['const', TokenType.CONST],
    ['if', TokenType.IF],
    ['else', TokenType.ELSE],
    ['for', TokenType.FOR],
    ['while', TokenType.WHILE],
    ['return', TokenType.RETURN],
    ['true', TokenType.TRUE],
    ['false', TokenType.FALSE],
    ['tetrahedron', TokenType.TETRAHEDRON],
    ['octahedron', TokenType.OCTAHEDRON],
    ['icosahedron', TokenType.ICOSAHEDRON],
    ['strut', TokenType.STRUT],
    ['hub', TokenType.HUB],
    ['vec3', TokenType.VEC3],
    ['euler', TokenType.EULER],
    ['quantum', TokenType.QUANTUM],
    ['wood', TokenType.WOOD],
    ['metal', TokenType.METAL],
    ['crystal', TokenType.CRYSTAL],
    ['VERTEX_A', TokenType.VERTEX],
    ['VERTEX_B', TokenType.VERTEX],
    ['VERTEX_C', TokenType.VERTEX],
    ['VERTEX_D', TokenType.VERTEX]
  ]);

  constructor(source: string) {
    this.source = source;
  }

  public tokenize(): Token[] {
    while (!this.isAtEnd()) {
      this.skipWhitespace();
      if (this.isAtEnd()) break;
      this.scanToken();
    }

    this.tokens.push(this.createToken(TokenType.EOF, ''));
    return this.tokens;
  }

  private scanToken(): void {
    const char = this.advance();

    switch (char) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case ':': this.addToken(TokenType.COLON); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '*': this.addToken(TokenType.MULTIPLY); break;
      case '/': 
        if (this.match('/')) {
          // Single-line comment
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else if (this.match('*')) {
          // Multi-line comment
          while (!this.isAtEnd()) {
            if (this.peek() === '*' && this.peekNext() === '/') {
              this.advance(); // consume *
              this.advance(); // consume /
              break;
            }
            this.advance();
          }
        } else {
          this.addToken(TokenType.DIVIDE);
        }
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUALS : TokenType.ASSIGN);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.NOT_EQUALS : TokenType.NOT);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AND);
        }
        break;
      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.OR);
        }
        break;
      case '"':
        this.string();
        break;
      case '#':
        this.color();
        break;
      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        }
        break;
    }
  }

  private string(): void {
    let value = '';
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      value += this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error('Unterminated string');
    }

    this.advance(); // consume closing "
    this.addToken(TokenType.STRING, value);
  }

  private number(): void {
    let value = '';
    while (this.isDigit(this.peek())) {
      value += this.advance();
    }

    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += this.advance(); // consume .
      while (this.isDigit(this.peek())) {
        value += this.advance();
      }
    }

    this.addToken(TokenType.NUMBER, parseFloat(value));
  }

  private color(): void {
    let value = '#';
    while (this.isHexDigit(this.peek())) {
      value += this.advance();
    }
    this.addToken(TokenType.COLOR, value);
  }

  private identifier(): void {
    let value = '';
    while (this.isAlphaNumeric(this.peek())) {
      value += this.advance();
    }

    const keyword = this.keywords.get(value);
    if (keyword) {
      this.addToken(keyword, value);
    } else {
      this.addToken(TokenType.IDENTIFIER, value);
    }
  }

  private advance(): string {
    this.column++;
    return this.source[this.current++];
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source[this.current + 1];
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;
    this.current++;
    this.column++;
    return true;
  }

  private skipWhitespace(): void {
    while (true) {
      const char = this.peek();
      switch (char) {
        case ' ':
        case '\r':
        case '\t':
          this.advance();
          break;
        case '\n':
          this.line++;
          this.column = 1;
          this.advance();
          break;
        default:
          return;
      }
    }
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private isHexDigit(char: string): boolean {
    return this.isDigit(char) || (char >= 'a' && char <= 'f') || (char >= 'A' && char <= 'F');
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private addToken(type: TokenType, value: any = null): void {
    this.tokens.push(this.createToken(type, value));
  }

  private createToken(type: TokenType, value: any): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column
    };
  }
}

// ============================================================================
// AST Nodes
// ============================================================================

export interface ASTNode {
  type: string;
  line?: number;
  column?: number;
}

export interface ProgramNode extends ASTNode {
  type: 'Program';
  modules: ModuleNode[];
}

export interface ModuleNode extends ASTNode {
  type: 'Module';
  name: string;
  statements: StatementNode[];
}

export type StatementNode = 
  | VariableDeclarationNode
  | ConstantDeclarationNode
  | FunctionDeclarationNode
  | StructureDeclarationNode
  | FamilyDeclarationNode
  | ExpressionStatementNode
  | IfStatementNode
  | ForStatementNode
  | WhileStatementNode
  | ReturnStatementNode;

export interface VariableDeclarationNode extends ASTNode {
  type: 'VariableDeclaration';
  name: string;
  value: ExpressionNode;
}

export interface ConstantDeclarationNode extends ASTNode {
  type: 'ConstantDeclaration';
  name: string;
  value: ExpressionNode;
}

export interface FunctionDeclarationNode extends ASTNode {
  type: 'FunctionDeclaration';
  name: string;
  parameters: string[];
  returnType?: string;
  body: StatementNode[];
}

export interface StructureDeclarationNode extends ASTNode {
  type: 'StructureDeclaration';
  name: string;
  properties: PropertyNode[];
}

export interface FamilyDeclarationNode extends ASTNode {
  type: 'FamilyDeclaration';
  name: string;
  vertices: { vertex_a: ExpressionNode; vertex_b: ExpressionNode; vertex_c: ExpressionNode; vertex_d: ExpressionNode };
}

export interface ExpressionStatementNode extends ASTNode {
  type: 'ExpressionStatement';
  expression: ExpressionNode;
}

export interface IfStatementNode extends ASTNode {
  type: 'IfStatement';
  condition: ExpressionNode;
  thenBranch: StatementNode[];
  elseBranch?: StatementNode[];
}

export interface ForStatementNode extends ASTNode {
  type: 'ForStatement';
  variable?: string;
  initializer?: ExpressionNode;
  condition?: ExpressionNode;
  increment?: ExpressionNode;
  body: StatementNode[];
}

export interface WhileStatementNode extends ASTNode {
  type: 'WhileStatement';
  condition: ExpressionNode;
  body: StatementNode[];
}

export interface ReturnStatementNode extends ASTNode {
  type: 'ReturnStatement';
  value?: ExpressionNode;
}

export type ExpressionNode =
  | LiteralNode
  | IdentifierNode
  | BinaryExpressionNode
  | UnaryExpressionNode
  | FunctionCallNode
  | StructureLiteralNode
  | PropertyAccessNode
  | ArrayLiteralNode
  | ArrayAccessNode;

export interface LiteralNode extends ASTNode {
  type: 'Literal';
  value: P31Value;
}

export interface IdentifierNode extends ASTNode {
  type: 'Identifier';
  name: string;
}

export interface BinaryExpressionNode extends ASTNode {
  type: 'BinaryExpression';
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}

export interface UnaryExpressionNode extends ASTNode {
  type: 'UnaryExpression';
  operator: string;
  operand: ExpressionNode;
}

export interface FunctionCallNode extends ASTNode {
  type: 'FunctionCall';
  name: string;
  arguments: ExpressionNode[];
}

export interface StructureLiteralNode extends ASTNode {
  type: 'StructureLiteral';
  typeName: string;
  properties: PropertyNode[];
}

export interface PropertyNode extends ASTNode {
  type: 'Property';
  name: string;
  value: ExpressionNode;
}

export interface PropertyAccessNode extends ASTNode {
  type: 'PropertyAccess';
  object: ExpressionNode;
  property: string;
}

export interface ArrayLiteralNode extends ASTNode {
  type: 'ArrayLiteral';
  elements: ExpressionNode[];
}

export interface ArrayAccessNode extends ASTNode {
  type: 'ArrayAccess';
  array: ExpressionNode;
  index: ExpressionNode;
}

// ============================================================================
// Parser
// ============================================================================

export class P31Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ProgramNode {
    const modules: ModuleNode[] = [];
    
    while (!this.isAtEnd()) {
      if (this.match(TokenType.MODULE)) {
        modules.push(this.module());
      } else {
        throw this.error(this.peek(), 'Expected module declaration');
      }
    }

    return {
      type: 'Program',
      modules
    };
  }

  private module(): ModuleNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected module name').value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected { after module name');
    
    const statements: StatementNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.statement());
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after module body');
    
    return {
      type: 'Module',
      name,
      statements,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private statement(): StatementNode {
    if (this.match(TokenType.LET)) return this.variableDeclaration();
    if (this.match(TokenType.CONST)) return this.constantDeclaration();
    if (this.match(TokenType.FUNCTION)) return this.functionDeclaration();
    if (this.match(TokenType.STRUCTURE)) return this.structureDeclaration();
    if (this.match(TokenType.FAMILY)) return this.familyDeclaration();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    
    return this.expressionStatement();
  }

  private variableDeclaration(): VariableDeclarationNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected variable name').value as string;
    this.consume(TokenType.ASSIGN, 'Expected = after variable name');
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expected ; after variable declaration');
    
    return {
      type: 'VariableDeclaration',
      name,
      value,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private constantDeclaration(): ConstantDeclarationNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected constant name').value as string;
    this.consume(TokenType.ASSIGN, 'Expected = after constant name');
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expected ; after constant declaration');
    
    return {
      type: 'ConstantDeclaration',
      name,
      value,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private functionDeclaration(): FunctionDeclarationNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected function name').value as string;
    this.consume(TokenType.LEFT_PAREN, 'Expected ( after function name');
    
    const parameters: string[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        parameters.push(this.consume(TokenType.IDENTIFIER, 'Expected parameter name').value as string);
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, 'Expected ) after parameters');
    
    let returnType: string | undefined;
    if (this.match(TokenType.COLON)) {
      returnType = this.consume(TokenType.IDENTIFIER, 'Expected return type').value as string;
    }
    
    this.consume(TokenType.LEFT_BRACE, 'Expected { before function body');
    
    const body: StatementNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      body.push(this.statement());
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after function body');
    
    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      returnType,
      body,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private structureDeclaration(): StructureDeclarationNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected structure name').value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected { after structure name');
    
    const properties: PropertyNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property());
      if (!this.check(TokenType.RIGHT_BRACE)) {
        this.consume(TokenType.COMMA, 'Expected , after property');
      }
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after structure body');
    
    return {
      type: 'StructureDeclaration',
      name,
      properties,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private familyDeclaration(): FamilyDeclarationNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected family name').value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected { after family name');
    
    const vertex_a = this.consumeProperty('vertex_a');
    this.consume(TokenType.COMMA, 'Expected , after vertex_a');
    const vertex_b = this.consumeProperty('vertex_b');
    this.consume(TokenType.COMMA, 'Expected , after vertex_b');
    const vertex_c = this.consumeProperty('vertex_c');
    this.consume(TokenType.COMMA, 'Expected , after vertex_c');
    const vertex_d = this.consumeProperty('vertex_d');
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after family body');
    
    return {
      type: 'FamilyDeclaration',
      name,
      vertices: { vertex_a, vertex_b, vertex_c, vertex_d },
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private consumeProperty(name: string): ExpressionNode {
    this.consume(TokenType.IDENTIFIER, `Expected ${name}`).value as string;
    this.consume(TokenType.COLON, `Expected : after ${name}`);
    return this.expression();
  }

  private ifStatement(): IfStatementNode {
    this.consume(TokenType.LEFT_PAREN, 'Expected ( after if');
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ) after condition');
    
    this.consume(TokenType.LEFT_BRACE, 'Expected { before then branch');
    const thenBranch: StatementNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      thenBranch.push(this.statement());
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after then branch');
    
    let elseBranch: StatementNode[] | undefined;
    if (this.match(TokenType.ELSE)) {
      this.consume(TokenType.LEFT_BRACE, 'Expected { before else branch');
      elseBranch = [];
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        elseBranch.push(this.statement());
      }
      this.consume(TokenType.RIGHT_BRACE, 'Expected } after else branch');
    }
    
    return {
      type: 'IfStatement',
      condition,
      thenBranch,
      elseBranch,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private forStatement(): ForStatementNode {
    this.consume(TokenType.LEFT_PAREN, 'Expected ( after for');
    
    let variable: string | undefined;
    let initializer: ExpressionNode | undefined;
    let condition: ExpressionNode | undefined;
    let increment: ExpressionNode | undefined;
    
    if (!this.check(TokenType.SEMICOLON)) {
      if (this.match(TokenType.LET)) {
        variable = this.consume(TokenType.IDENTIFIER, 'Expected variable name').value as string;
        this.consume(TokenType.ASSIGN, 'Expected = after variable name');
        initializer = this.expression();
      } else {
        initializer = this.expression();
      }
    }
    
    this.consume(TokenType.SEMICOLON, 'Expected ; after for initializer');
    
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    
    this.consume(TokenType.SEMICOLON, 'Expected ; after for condition');
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    
    this.consume(TokenType.RIGHT_PAREN, 'Expected ) after for clause');
    
    this.consume(TokenType.LEFT_BRACE, 'Expected { before for body');
    const body: StatementNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      body.push(this.statement());
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after for body');
    
    return {
      type: 'ForStatement',
      variable,
      initializer,
      condition,
      increment,
      body,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private whileStatement(): WhileStatementNode {
    this.consume(TokenType.LEFT_PAREN, 'Expected ( after while');
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ) after condition');
    
    this.consume(TokenType.LEFT_BRACE, 'Expected { before while body');
    const body: StatementNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      body.push(this.statement());
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after while body');
    
    return {
      type: 'WhileStatement',
      condition,
      body,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private returnStatement(): ReturnStatementNode {
    let value: ExpressionNode | undefined;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }
    this.consume(TokenType.SEMICOLON, 'Expected ; after return');
    
    return {
      type: 'ReturnStatement',
      value,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private expressionStatement(): ExpressionStatementNode {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, 'Expected ; after expression');
    
    return {
      type: 'ExpressionStatement',
      expression: expr,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private expression(): ExpressionNode {
    return this.assignment();
  }

  private assignment(): ExpressionNode {
    const expr = this.logicalOr();
    
    if (this.match(TokenType.ASSIGN)) {
      const value = this.assignment();
      if (expr.type === 'Identifier') {
        return {
          type: 'BinaryExpression',
          operator: '=',
          left: expr,
          right: value,
          line: this.previous().line,
          column: this.previous().column
        };
      }
      throw this.error(this.previous(), 'Invalid assignment target');
    }
    
    return expr;
  }

  private logicalOr(): ExpressionNode {
    let expr = this.logicalAnd();
    
    while (this.match(TokenType.OR)) {
      const operator = this.previous().value as string;
      const right = this.logicalAnd();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return expr;
  }

  private logicalAnd(): ExpressionNode {
    let expr = this.equality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.previous().value as string;
      const right = this.equality();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return expr;
  }

  private equality(): ExpressionNode {
    let expr = this.comparison();
    
    while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS)) {
      const operator = this.previous().value as string;
      const right = this.comparison();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return expr;
  }

  private comparison(): ExpressionNode {
    let expr = this.term();
    
    while (this.match(TokenType.LESS, TokenType.LESS_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL)) {
      const operator = this.previous().value as string;
      const right = this.term();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return expr;
  }

  private term(): ExpressionNode {
    let expr = this.factor();
    
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value as string;
      const right = this.factor();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return expr;
  }

  private factor(): ExpressionNode {
    let expr = this.unary();
    
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous().value as string;
      const right = this.unary();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return expr;
  }

  private unary(): ExpressionNode {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous().value as string;
      const right = this.unary();
      return {
        type: 'UnaryExpression',
        operator,
        operand: right,
        line: this.previous().line,
        column: this.previous().column
      };
    }
    
    return this.primary();
  }

  private primary(): ExpressionNode {
    if (this.match(TokenType.TRUE)) {
      return { type: 'Literal', value: true, line: this.previous().line, column: this.previous().column };
    }
    if (this.match(TokenType.FALSE)) {
      return { type: 'Literal', value: false, line: this.previous().line, column: this.previous().column };
    }
    if (this.match(TokenType.NUMBER, TokenType.STRING, TokenType.COLOR, TokenType.VERTEX)) {
      return { type: 'Literal', value: this.previous().value, line: this.previous().line, column: this.previous().column };
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return { type: 'Identifier', name: this.previous().value as string, line: this.previous().line, column: this.previous().column };
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, 'Expected ) after expression');
      return expr;
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      return this.arrayLiteral();
    }
    if (this.match(TokenType.TETRAHEDRON, TokenType.OCTAHEDRON, TokenType.ICOSAHEDRON, TokenType.STRUT, TokenType.HUB)) {
      return this.structureLiteral();
    }
    if (this.match(TokenType.VEC3, TokenType.EULER)) {
      return this.vectorLiteral();
    }
    
    throw this.error(this.peek(), 'Expected expression');
  }

  private arrayLiteral(): ArrayLiteralNode {
    const elements: ExpressionNode[] = [];
    
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        elements.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_BRACKET, 'Expected ] after array elements');
    
    return {
      type: 'ArrayLiteral',
      elements,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private structureLiteral(): StructureLiteralNode {
    const typeName = this.previous().value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected { after primitive type');
    
    const properties: PropertyNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property());
      if (!this.check(TokenType.RIGHT_BRACE)) {
        this.consume(TokenType.COMMA, 'Expected , after property');
      }
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected } after structure properties');
    
    return {
      type: 'StructureLiteral',
      typeName,
      properties,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private vectorLiteral(): ExpressionNode {
    const typeName = this.previous().value as string;
    this.consume(TokenType.LEFT_PAREN, `Expected ( after ${typeName}`);
    
    const args: ExpressionNode[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, `Expected ) after ${typeName} arguments`);
    
    return {
      type: 'FunctionCall',
      name: typeName,
      arguments: args,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private property(): PropertyNode {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected property name').value as string;
    this.consume(TokenType.COLON, 'Expected : after property name');
    const value = this.expression();
    
    return {
      type: 'Property',
      name,
      value,
      line: this.previous().line,
      column: this.previous().column
    };
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string): Error {
    return new Error(`[Line ${token.line}, Column ${token.column}] ${message}`);
  }
}

// ============================================================================
// Interpreter
// ============================================================================

export class P31Interpreter {
  private context: P31Context;
  private returnValue: P31Value | null = null;
  private lastStructure: Structure | null = null;

  constructor() {
    this.context = {
      variables: new Map(),
      structures: new Map(),
      families: new Map(),
      functions: new Map()
    };

    this.setupStandardLibrary();
  }

  public async execute(source: string): Promise<P31Value> {
    try {
      const tokenizer = new P31Tokenizer(source);
      const tokens = tokenizer.tokenize();
      const parser = new P31Parser(tokens);
      const ast = parser.parse();

      return this.evaluateProgram(ast);
    } catch (error: any) {
      throw new Error(`P31 execution error: ${error.message}`);
    }
  }

  private evaluateProgram(node: ProgramNode): P31Value {
    let result: P31Value = null;
    
    for (const module of node.modules) {
      result = this.evaluateModule(module);
    }
    
    return result || this.lastStructure || null;
  }

  private evaluateModule(node: ModuleNode): P31Value {
    for (const statement of node.statements) {
      this.evaluateStatement(statement);
    }
    
    return this.lastStructure || null;
  }

  private evaluateStatement(node: StatementNode): P31Value {
    switch (node.type) {
      case 'VariableDeclaration':
        return this.evaluateVariableDeclaration(node);
      case 'ConstantDeclaration':
        return this.evaluateConstantDeclaration(node);
      case 'FunctionDeclaration':
        return this.evaluateFunctionDeclaration(node);
      case 'StructureDeclaration':
        return this.evaluateStructureDeclaration(node);
      case 'FamilyDeclaration':
        return this.evaluateFamilyDeclaration(node);
      case 'ExpressionStatement':
        return this.evaluateExpression(node.expression);
      case 'IfStatement':
        return this.evaluateIfStatement(node);
      case 'ForStatement':
        return this.evaluateForStatement(node);
      case 'WhileStatement':
        return this.evaluateWhileStatement(node);
      case 'ReturnStatement':
        return this.evaluateReturnStatement(node);
      default:
        throw new Error(`Unknown statement type: ${(node as any).type}`);
    }
  }

  private evaluateVariableDeclaration(node: VariableDeclarationNode): P31Value {
    const value = this.evaluateExpression(node.value);
    this.context.variables.set(node.name, value);
    return value;
  }

  private evaluateConstantDeclaration(node: ConstantDeclarationNode): P31Value {
    const value = this.evaluateExpression(node.value);
    this.context.variables.set(node.name, value);
    return value;
  }

  private evaluateFunctionDeclaration(node: FunctionDeclarationNode): P31Value {
    const func: P31Function = (args: P31Value[]) => {
      const oldVars = new Map(this.context.variables);
      
      // Set parameters
      for (let i = 0; i < node.parameters.length; i++) {
        this.context.variables.set(node.parameters[i], args[i] || null);
      }
      
      // Execute body
      this.returnValue = null;
      for (const stmt of node.body) {
        this.evaluateStatement(stmt);
        if (this.returnValue !== null) break;
      }
      
      const result = this.returnValue;
      this.returnValue = null;
      
      // Restore variables
      this.context.variables = oldVars;
      
      return result;
    };
    
    this.context.functions.set(node.name, func);
    return func;
  }

  private evaluateStructureDeclaration(node: StructureDeclarationNode): P31Value {
    const primitives: GeometricPrimitive[] = [];
    const properties: Record<string, P31Value> = {};
    
    for (const prop of node.properties) {
      properties[prop.name] = this.evaluateExpression(prop.value);
    }
    
    if (properties.primitives && Array.isArray(properties.primitives)) {
      primitives.push(...(properties.primitives as GeometricPrimitive[]));
    }
    
    const structure: Structure = {
      id: `struct_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: node.name,
      primitives,
      vertices: properties.vertices as number,
      edges: properties.edges as number,
      isRigid: properties.isRigid as boolean,
      quantum: properties.quantum as QuantumState
    };
    
    this.context.structures.set(node.name, structure);
    this.lastStructure = structure;
    
    return structure;
  }

  private evaluateFamilyDeclaration(node: FamilyDeclarationNode): P31Value {
    const family: Family = {
      vertex_a: this.evaluateExpression(node.vertices.vertex_a) as Vertex,
      vertex_b: this.evaluateExpression(node.vertices.vertex_b) as Vertex,
      vertex_c: this.evaluateExpression(node.vertices.vertex_c) as Vertex,
      vertex_d: this.evaluateExpression(node.vertices.vertex_d) as Vertex
    };
    
    this.context.families.set(node.name, family);
    return family;
  }

  private evaluateIfStatement(node: IfStatementNode): P31Value {
    const condition = this.evaluateExpression(node.condition);
    
    if (this.isTruthy(condition)) {
      for (const stmt of node.thenBranch) {
        this.evaluateStatement(stmt);
      }
    } else if (node.elseBranch) {
      for (const stmt of node.elseBranch) {
        this.evaluateStatement(stmt);
      }
    }
    
    return null;
  }

  private evaluateForStatement(node: ForStatementNode): P31Value {
    if (node.initializer) {
      this.evaluateExpression(node.initializer);
    }
    
    while (true) {
      if (node.condition) {
        const condition = this.evaluateExpression(node.condition);
        if (!this.isTruthy(condition)) break;
      }
      
      for (const stmt of node.body) {
        this.evaluateStatement(stmt);
      }
      
      if (node.increment) {
        this.evaluateExpression(node.increment);
      }
    }
    
    return null;
  }

  private evaluateWhileStatement(node: WhileStatementNode): P31Value {
    while (this.isTruthy(this.evaluateExpression(node.condition))) {
      for (const stmt of node.body) {
        this.evaluateStatement(stmt);
      }
    }
    
    return null;
  }

  private evaluateReturnStatement(node: ReturnStatementNode): P31Value {
    const value = node.value ? this.evaluateExpression(node.value) : null;
    this.returnValue = value;
    return value;
  }

  private evaluateExpression(node: ExpressionNode): P31Value {
    switch (node.type) {
      case 'Literal':
        return node.value;
      case 'Identifier':
        return this.evaluateIdentifier(node);
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(node);
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(node);
      case 'FunctionCall':
        return this.evaluateFunctionCall(node);
      case 'StructureLiteral':
        return this.evaluateStructureLiteral(node);
      case 'PropertyAccess':
        return this.evaluatePropertyAccess(node);
      case 'ArrayLiteral':
        return this.evaluateArrayLiteral(node);
      case 'ArrayAccess':
        return this.evaluateArrayAccess(node);
      default:
        throw new Error(`Unknown expression type: ${(node as any).type}`);
    }
  }

  private evaluateIdentifier(node: IdentifierNode): P31Value {
    if (this.context.variables.has(node.name)) {
      return this.context.variables.get(node.name)!;
    }
    if (this.context.structures.has(node.name)) {
      return this.context.structures.get(node.name)!;
    }
    if (this.context.families.has(node.name)) {
      return this.context.families.get(node.name)!;
    }
    throw new Error(`Undefined identifier: ${node.name}`);
  }

  private evaluateBinaryExpression(node: BinaryExpressionNode): P31Value {
    const left = this.evaluateExpression(node.left);
    const right = this.evaluateExpression(node.right);
    
    switch (node.operator) {
      case '=':
        if (node.left.type === 'Identifier') {
          this.context.variables.set((node.left as IdentifierNode).name, right);
          return right;
        }
        throw new Error('Invalid assignment target');
      case '+':
        if (typeof left === 'number' && typeof right === 'number') return left + right;
        if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
        throw new Error('Invalid operands for +');
      case '-':
        return (left as number) - (right as number);
      case '*':
        return (left as number) * (right as number);
      case '/':
        return (left as number) / (right as number);
      case '==':
        return this.isEqual(left, right);
      case '!=':
        return !this.isEqual(left, right);
      case '<':
        return (left as number) < (right as number);
      case '>':
        return (left as number) > (right as number);
      case '<=':
        return (left as number) <= (right as number);
      case '>=':
        return (left as number) >= (right as number);
      case '&&':
        return this.isTruthy(left) && this.isTruthy(right);
      case '||':
        return this.isTruthy(left) || this.isTruthy(right);
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
  }

  private evaluateUnaryExpression(node: UnaryExpressionNode): P31Value {
    const right = this.evaluateExpression(node.operand);
    
    switch (node.operator) {
      case '-':
        return -(right as number);
      case '!':
        return !this.isTruthy(right);
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  private evaluateFunctionCall(node: FunctionCallNode): P31Value {
    const args = node.arguments.map(arg => this.evaluateExpression(arg));
    
    if (this.context.functions.has(node.name)) {
      const func = this.context.functions.get(node.name)!;
      return func(args, this.context);
    }
    
    // Built-in functions
    switch (node.name) {
      case 'vec3':
        if (args.length === 3) {
          return new THREE.Vector3(args[0] as number, args[1] as number, args[2] as number);
        }
        throw new Error('vec3 requires 3 arguments');
      case 'euler':
        if (args.length === 3) {
          return new THREE.Euler(args[0] as number, args[1] as number, args[2] as number);
        }
        throw new Error('euler requires 3 arguments');
      default:
        throw new Error(`Unknown function: ${node.name}`);
    }
  }

  private evaluateStructureLiteral(node: StructureLiteralNode): P31Value {
    const properties: Record<string, P31Value> = {};
    
    for (const prop of node.properties) {
      properties[prop.name] = this.evaluateExpression(prop.value);
    }
    
    const id = `prim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const position = properties.position as THREE.Vector3 || new THREE.Vector3(0, 0, 0);
    const rotation = properties.rotation as THREE.Euler || new THREE.Euler(0, 0, 0);
    const scale = (properties.scale as number) || 1.0;
    const color = (properties.color as string) || '#FF6B9D';
    const material = (properties.material as string) || 'quantum' as any;
    const quantum = properties.quantum as QuantumState;
    
    const primitive: GeometricPrimitive = {
      id,
      type: node.typeName as any,
      position,
      rotation,
      scale,
      color,
      material,
      quantum
    };
    
    return primitive;
  }

  private evaluatePropertyAccess(node: PropertyAccessNode): P31Value {
    const object = this.evaluateExpression(node.object);
    
    if (typeof object === 'object' && object !== null) {
      if (node.property in object) {
        return (object as any)[node.property];
      }
    }
    
    throw new Error(`Property ${node.property} not found`);
  }

  private evaluateArrayLiteral(node: ArrayLiteralNode): P31Value {
    return node.elements.map(elem => this.evaluateExpression(elem));
  }

  private evaluateArrayAccess(node: ArrayAccessNode): P31Value {
    const array = this.evaluateExpression(node.array);
    const index = this.evaluateExpression(node.index);
    
    if (Array.isArray(array) && typeof index === 'number') {
      return array[index];
    }
    
    throw new Error('Invalid array access');
  }

  private isTruthy(value: P31Value): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    return true;
  }

  private isEqual(left: P31Value, right: P31Value): boolean {
    if (left === right) return true;
    if (typeof left === 'number' && typeof right === 'number') return left === right;
    if (typeof left === 'string' && typeof right === 'string') return left === right;
    if (typeof left === 'boolean' && typeof right === 'boolean') return left === right;
    return false;
  }

  private setupStandardLibrary(): void {
    // Math functions
    this.context.functions.set('sin', (args) => Math.sin(args[0] as number));
    this.context.functions.set('cos', (args) => Math.cos(args[0] as number));
    this.context.functions.set('tan', (args) => Math.tan(args[0] as number));
    this.context.functions.set('sqrt', (args) => Math.sqrt(args[0] as number));
    this.context.functions.set('pow', (args) => Math.pow(args[0] as number, args[1] as number));
    this.context.functions.set('abs', (args) => Math.abs(args[0] as number));
    this.context.functions.set('min', (args) => Math.min(args[0] as number, args[1] as number));
    this.context.functions.set('max', (args) => Math.max(args[0] as number, args[1] as number));
    this.context.functions.set('floor', (args) => Math.floor(args[0] as number));
    this.context.functions.set('ceil', (args) => Math.ceil(args[0] as number));
    this.context.functions.set('round', (args) => Math.round(args[0] as number));
    this.context.functions.set('PI', () => Math.PI);
    this.context.functions.set('E', () => Math.E);

    // Vector functions
    this.context.functions.set('vec3Add', (args) => {
      const v1 = args[0] as THREE.Vector3;
      const v2 = args[1] as THREE.Vector3;
      return v1.clone().add(v2);
    });
    this.context.functions.set('vec3Subtract', (args) => {
      const v1 = args[0] as THREE.Vector3;
      const v2 = args[1] as THREE.Vector3;
      return v1.clone().sub(v2);
    });
    this.context.functions.set('vec3Length', (args) => {
      return (args[0] as THREE.Vector3).length();
    });
    this.context.functions.set('vec3Normalize', (args) => {
      return (args[0] as THREE.Vector3).clone().normalize();
    });
    this.context.functions.set('vec3Dot', (args) => {
      return (args[0] as THREE.Vector3).dot(args[1] as THREE.Vector3);
    });
    this.context.functions.set('vec3Cross', (args) => {
      const v1 = args[0] as THREE.Vector3;
      const v2 = args[1] as THREE.Vector3;
      return v1.clone().cross(v2);
    });

    // Structure functions
    this.context.functions.set('validate', (args) => {
      const structure = args[0] as Structure;
      const vertices = structure.primitives.length * 4; // Simplified
      const edges = structure.primitives.length * 6; // Simplified
      const isRigid = edges >= (3 * vertices - 6); // Maxwell's Rule
      return { isValid: true, isRigid, vertices, edges };
    });

    this.context.functions.set('place', (args) => {
      const primitive = args[0] as GeometricPrimitive;
      // Emit event for game engine
      window.dispatchEvent(new CustomEvent('p31:primitivePlaced', {
        detail: { primitive }
      }));
      return primitive;
    });

    this.context.functions.set('connect', (args) => {
      const prim1 = args[0] as GeometricPrimitive;
      const prim2 = args[1] as GeometricPrimitive;
      window.dispatchEvent(new CustomEvent('p31:primitivesConnected', {
        detail: { prim1, prim2 }
      }));
      return true;
    });

    // Print function
    this.context.functions.set('print', (args) => {
      const message = args.map(arg => String(arg)).join(' ');
      console.log(`[P31] ${message}`);
      window.dispatchEvent(new CustomEvent('p31:print', {
        detail: { message }
      }));
      return null;
    });

    // Quantum functions
    this.context.functions.set('quantum', (args) => {
      return {
        coherence: args[0] as number || 0.95,
        entanglement: (args[1] as string[]) || [],
        phase: args[2] as number || 0
      } as QuantumState;
    });

    this.context.functions.set('measure', (args) => {
      const state = args[0] as QuantumState;
      // Measurement collapses state (Cuckoo Clock)
      return { ...state, coherence: Math.random() * 0.5 };
    });

    this.context.functions.set('persists', (args) => {
      const state = args[0] as QuantumState;
      const duration = args[1] as number;
      // Check if coherence persists (Grandfather Clock)
      return state.coherence > 0.9 && duration >= 100;
    });
  }

  public getContext(): P31Context {
    return this.context;
  }

  public getLastStructure(): Structure | null {
    return this.lastStructure;
  }
}
