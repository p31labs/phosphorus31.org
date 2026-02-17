/**
 * P31 Language Executor
 * Executes P31 language AST in the game environment
 * 
 * "Oh the places we will go"
 * With love and light. As above, so below. 💜
 */

import { P31ASTNode, P31ParseResult } from './P31LanguageParser';

export interface P31ExecutionContext {
  variables: Map<string, any>;
  functions: Map<string, P31ASTNode>;
  gameEngine: any;
  familyCoOp: any;
  familyCoding: any;
  cosmic: any;
}

export interface P31ExecutionResult {
  value: any;
  error?: string;
  sideEffects: string[];
}

export class P31LanguageExecutor {
  private context: P31ExecutionContext;
  private sideEffects: string[] = [];

  constructor(familyCoOp: any, familyCoding: any, gameEngine?: any, cosmic?: any) {
    this.context = {
      variables: new Map(),
      functions: new Map(),
      gameEngine,
      familyCoOp,
      familyCoding,
      cosmic
    };

    this.initializeBuiltins();
    console.log('🔺 P31 Language Executor initialized');
  }

  /**
   * Initialize built-in functions and variables
   */
  private initializeBuiltins(): void {
    // Built-in variables
    this.context.variables.set('mesh', { holds: true });
    this.context.variables.set('love', '💜');
    this.context.variables.set('light', '✨');
    this.context.variables.set('tetrahedron', { vertices: 4, edges: 6, faces: 4 });

    // Built-in functions will be added as needed
  }

  /**
   * Execute parsed P31 code
   */
  public execute(parseResult: P31ParseResult): P31ExecutionResult {
    this.sideEffects = [];

    if (parseResult.errors.length > 0) {
      return {
        value: null,
        error: parseResult.errors.join('\n'),
        sideEffects: []
      };
    }

    try {
      const value = this.executeNode(parseResult.ast);
      return {
        value,
        sideEffects: this.sideEffects
      };
    } catch (error: any) {
      return {
        value: null,
        error: error.message || 'Execution error',
        sideEffects: this.sideEffects
      };
    }
  }

  /**
   * Execute AST node
   */
  private executeNode(node: P31ASTNode): any {
    switch (node.type) {
      case 'program':
        return this.executeProgram(node);
      case 'statement':
        return this.executeStatement(node);
      case 'expression':
        return this.executeExpression(node);
      case 'block':
        return this.executeBlock(node);
      case 'function':
        return this.executeFunctionDeclaration(node);
      case 'variable':
        return this.executeVariableDeclaration(node);
      case 'call':
        return this.executeCall(node);
      case 'build':
        return this.executeBuild(node);
      case 'print':
        return this.executePrint(node);
      case 'quantum':
        return this.executeQuantum(node);
      case 'tetrahedron':
        return this.executeTetrahedron(node);
      case 'cosmic':
        return this.executeCosmic(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * Execute program
   */
  private executeProgram(node: P31ASTNode): any {
    let result: any = null;
    if (node.children) {
      for (const child of node.children) {
        result = this.executeNode(child);
      }
    }
    return result;
  }

  /**
   * Execute statement
   */
  private executeStatement(node: P31ASTNode): any {
    switch (node.value) {
      case 'if':
        return this.executeIf(node);
      case 'for':
        return this.executeFor(node);
      case 'while':
        return this.executeWhile(node);
      case 'return':
        return this.executeReturn(node);
      default:
        throw new Error(`Unknown statement: ${node.value}`);
    }
  }

  /**
   * Execute if statement
   */
  private executeIf(node: P31ASTNode): any {
    const condition = this.executeNode(node.params?.condition);
    if (condition) {
      return this.executeNode(node.children?.[0]);
    } else if (node.children?.[1]) {
      return this.executeNode(node.children[1]);
    }
    return null;
  }

  /**
   * Execute for loop
   */
  private executeFor(node: P31ASTNode): any {
    this.executeNode(node.params?.init);
    let result: any = null;
    while (this.executeNode(node.params?.condition)) {
      result = this.executeNode(node.children?.[0]);
      this.executeNode(node.params?.increment);
    }
    return result;
  }

  /**
   * Execute while loop
   */
  private executeWhile(node: P31ASTNode): any {
    let result: any = null;
    while (this.executeNode(node.params?.condition)) {
      result = this.executeNode(node.children?.[0]);
    }
    return result;
  }

  /**
   * Execute return statement
   */
  private executeReturn(node: P31ASTNode): any {
    return this.executeNode(node.children?.[0]);
  }

  /**
   * Execute block
   */
  private executeBlock(node: P31ASTNode): any {
    let result: any = null;
    if (node.children) {
      for (const child of node.children) {
        result = this.executeNode(child);
      }
    }
    return result;
  }

  /**
   * Execute function declaration
   */
  private executeFunctionDeclaration(node: P31ASTNode): any {
    this.context.functions.set(node.value as string, node);
    return null;
  }

  /**
   * Execute variable declaration
   */
  private executeVariableDeclaration(node: P31ASTNode): any {
    const name = node.value as string;
    const value = this.executeNode(node.children?.[0]);
    this.context.variables.set(name, value);
    return value;
  }

  /**
   * Execute expression
   */
  private executeExpression(node: P31ASTNode): any {
    if (node.value !== undefined && node.children === undefined) {
      // Literal value
      return node.value;
    }

    if (typeof node.value === 'string' && node.children) {
      // Operator or identifier
      const op = node.value;

      // Binary operators
      if (node.children.length === 2) {
        const left = this.executeNode(node.children[0]);
        const right = this.executeNode(node.children[1]);

        switch (op) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '==': return left === right;
          case '!=': return left !== right;
          case '<': return left < right;
          case '>': return left > right;
          case '<=': return left <= right;
          case '>=': return left >= right;
          case '&&': return left && right;
          case '||': return left || right;
          case '=': 
            if (node.children[0].type === 'expression' && typeof node.children[0].value === 'string') {
              this.context.variables.set(node.children[0].value, right);
            }
            return right;
        }
      }

      // Unary operators
      if (node.children.length === 1) {
        const operand = this.executeNode(node.children[0]);
        switch (op) {
          case '!': return !operand;
          case '-': return -operand;
        }
      }

      // Identifier lookup
      if (this.context.variables.has(op)) {
        return this.context.variables.get(op);
      }

      // Function call
      if (this.context.functions.has(op)) {
        return this.executeCall(node);
      }
    }

    return null;
  }

  /**
   * Execute function call
   */
  private executeCall(node: P31ASTNode): any {
    if (node.value === 'call' && node.children) {
      const callee = this.executeNode(node.children[0]);
      const args = node.children.slice(1).map(arg => this.executeNode(arg));

      // Built-in functions
      if (typeof callee === 'string') {
        return this.executeBuiltinFunction(callee, args);
      }

      // User-defined function
      const funcNode = this.context.functions.get(callee);
      if (funcNode) {
        // Create new scope
        const oldVars = new Map(this.context.variables);
        const params = funcNode.params?.parameters || [];
        params.forEach((param: string, i: number) => {
          this.context.variables.set(param, args[i]);
        });

        const result = this.executeNode(funcNode);

        // Restore scope
        this.context.variables = oldVars;
        return result;
      }
    }

    // Property access
    if (node.value === '.' && node.children) {
      const object = this.executeNode(node.children[0]);
      const property = node.children[1]?.value;
      return object?.[property];
    }

    return null;
  }

  /**
   * Execute built-in function
   */
  private executeBuiltinFunction(name: string, args: any[]): any {
    switch (name) {
      case 'mesh':
        return this.context.variables.get('mesh');
      case 'holds':
        this.sideEffects.push('The Mesh Holds. 🔺');
        return true;
      case 'love':
        this.sideEffects.push('💜 With love and light. As above, so below. 💜');
        return '💜';
      case 'light':
        return '✨';
      case 'tetrahedron':
        return { vertices: 4, edges: 6, faces: 4 };
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }

  /**
   * Execute build statement
   */
  private executeBuild(node: P31ASTNode): any {
    const structure = this.executeNode(node.children?.[0]);
    
    if (this.context.gameEngine) {
      // Build structure in game engine
      this.sideEffects.push(`Building structure: ${JSON.stringify(structure)}`);
      // Integrate with game engine's build mode
      return { built: true, structure };
    }
    
    return { built: false, structure };
  }

  /**
   * Execute print statement
   */
  private executePrint(node: P31ASTNode): any {
    const target = this.executeNode(node.children?.[0]);
    
    if (this.context.gameEngine) {
      const printer = this.context.gameEngine.getPrinterIntegration();
      if (printer) {
        this.sideEffects.push(`Printing: ${JSON.stringify(target)}`);
        // Integrate with printer
        return { printing: true, target };
      }
    }
    
    return { printing: false, target };
  }

  /**
   * Execute quantum statement
   */
  private executeQuantum(node: P31ASTNode): any {
    const coherence = this.executeNode(node.children?.[0]);
    this.sideEffects.push(`Quantum coherence: ${coherence}`);
    return { quantum: true, coherence };
  }

  /**
   * Execute tetrahedron statement
   */
  private executeTetrahedron(node: P31ASTNode): any {
    const tetrahedron = {
      vertices: node.params?.vertices || 4,
      edges: 6,
      faces: 4
    };
    this.sideEffects.push(`Tetrahedron created: ${JSON.stringify(tetrahedron)}`);
    return tetrahedron;
  }

  /**
   * Execute cosmic statement
   */
  private executeCosmic(node: P31ASTNode): any {
    const timing = this.executeNode(node.children?.[0]);
    
    if (this.context.cosmic) {
      const cosmicTiming = this.context.cosmic.getCosmicTiming(timing);
      this.sideEffects.push(`Cosmic timing: ${cosmicTiming.message}`);
      return cosmicTiming;
    }
    
    return { cosmic: true, timing };
  }

  /**
   * Get execution context
   */
  public getContext(): P31ExecutionContext {
    return this.context;
  }

  /**
   * Set game engine
   */
  public setGameEngine(gameEngine: any): void {
    this.context.gameEngine = gameEngine;
  }

  /**
   * Set cosmic manager
   */
  public setCosmic(cosmic: any): void {
    this.context.cosmic = cosmic;
  }

  /**
   * Clear context
   */
  public clearContext(): void {
    this.context.variables.clear();
    this.context.functions.clear();
    this.initializeBuiltins();
  }
}
