/**
 * P31 Language Interpreter
 * Executes P31 AST in the game environment
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';
import { ASTNode, TetrahedronNode, FunctionNode } from './P31Parser';

export class P31Interpreter {
  private logger: Logger;
  private environment: Map<string, any> = new Map();
  private tetrahedra: Map<string, any> = new Map();
  private functions: Map<string, FunctionNode> = new Map();

  constructor() {
    this.logger = new Logger('P31Interpreter');
    this.initializeBuiltins();
  }

  /**
   * Initialize built-in functions and types
   */
  private initializeBuiltins(): void {
    // Built-in functions
    this.functions.set('connect', {
      type: 'Function',
      name: 'connect',
      parameters: [],
      body: [],
    } as FunctionNode);

    this.functions.set('measure_coherence', {
      type: 'Function',
      name: 'measure_coherence',
      parameters: [],
      body: [],
    } as FunctionNode);

    this.functions.set('consume_spoons', {
      type: 'Function',
      name: 'consume_spoons',
      parameters: [],
      body: [],
    } as FunctionNode);
  }

  /**
   * Execute P31 AST
   */
  public execute(ast: ASTNode[]): any {
    for (const node of ast) {
      this.executeNode(node);
    }
    return this.environment;
  }

  /**
   * Execute a single AST node
   */
  private executeNode(node: ASTNode): any {
    switch (node.type) {
      case 'Tetrahedron':
        return this.executeTetrahedron(node as TetrahedronNode);
      case 'Function':
        return this.executeFunction(node as FunctionNode);
      case 'Declaration':
        return this.executeDeclaration(node);
      case 'Component':
        return this.executeComponent(node);
      case 'FunctionCall':
        return this.executeFunctionCall(node);
      default:
        this.logger.warn(`Unknown node type: ${node.type}`);
        return null;
    }
  }

  /**
   * Execute tetrahedron definition
   */
  private executeTetrahedron(node: TetrahedronNode): any {
    const tetra = {
      id: node.id,
      vertices: node.vertices.map(v => ({
        id: v.id,
        label: v.label,
      })),
      edges: node.edges.map(e => ({
        id: e.id,
        from: e.from,
        to: e.to,
      })),
    };

    // Validate tetrahedron topology
    if (tetra.vertices.length !== 4) {
      throw new Error(`Tetrahedron must have exactly 4 vertices, got ${tetra.vertices.length}`);
    }

    if (tetra.edges.length !== 6) {
      throw new Error(`Tetrahedron must have exactly 6 edges, got ${tetra.edges.length}`);
    }

    this.tetrahedra.set(node.id, tetra);
    this.environment.set(node.id, tetra);

    this.logger.info(`Tetrahedron ${node.id} created with ${tetra.vertices.length} vertices and ${tetra.edges.length} edges`);

    return tetra;
  }

  /**
   * Execute function definition
   */
  private executeFunction(node: FunctionNode): void {
    this.functions.set(node.name, node);
    this.logger.info(`Function ${node.name} defined`);
  }

  /**
   * Execute declaration
   */
  private executeDeclaration(node: any): void {
    const value = this.evaluate(node.value);
    this.environment.set(node.name, value);
    this.logger.debug(`Variable ${node.name} = ${value}`);
  }

  /**
   * Execute component definition
   */
  private executeComponent(node: any): any {
    const component = {
      type: node.componentType,
      id: node.id,
      properties: {},
    };

    for (const [key, valueNode] of Object.entries(node.properties)) {
      component.properties[key] = this.evaluate(valueNode as ASTNode);
    }

    this.environment.set(node.id, component);
    this.logger.info(`Component ${node.componentType} ${node.id} created`);

    return component;
  }

  /**
   * Execute function call
   */
  private executeFunctionCall(node: any): any {
    const name = node.name;
    const args = node.arguments.map((arg: ASTNode) => this.evaluate(arg));

    // Built-in functions
    switch (name) {
      case 'connect':
        return this.builtinConnect(args[0], args[1]);
      case 'measure_coherence':
        return this.builtinMeasureCoherence(args[0]);
      case 'consume_spoons':
        return this.builtinConsumeSpoons(args[0]);
      case 'log':
        return this.builtinLog(args);
      default:
        // User-defined function
        const func = this.functions.get(name);
        if (func) {
          return this.executeUserFunction(func, args);
        }
        throw new Error(`Unknown function: ${name}`);
    }
  }

  /**
   * Evaluate expression
   */
  private evaluate(node: ASTNode): any {
    switch (node.type) {
      case 'Number':
        return (node as any).value;
      case 'String':
        return (node as any).value;
      case 'Identifier':
        return this.environment.get((node as any).name);
      case 'FunctionCall':
        return this.executeFunctionCall(node);
      default:
        return node;
    }
  }

  /**
   * Built-in: connect
   */
  private builtinConnect(from: any, to: any): any {
    return {
      type: 'Edge',
      from,
      to,
    };
  }

  /**
   * Built-in: measure_coherence
   */
  private builtinMeasureCoherence(tetra: any): number {
    // Simplified coherence calculation
    if (!tetra || !tetra.edges) {
      return 0.0;
    }
    // Coherence based on edge stability
    const edgeCount = tetra.edges.length;
    return edgeCount === 6 ? 1.0 : edgeCount / 6.0;
  }

  /**
   * Built-in: consume_spoons
   */
  private builtinConsumeSpoons(amount: number): void {
    const current = this.environment.get('spoons') || 0;
    const newValue = Math.max(0, current - amount);
    this.environment.set('spoons', newValue);
    this.logger.info(`Consumed ${amount} spoons, remaining: ${newValue}`);
  }

  /**
   * Built-in: log
   */
  private builtinLog(args: any[]): void {
    const message = args.map(arg => String(arg)).join(' ');
    this.logger.info(`[P31] ${message}`);
  }

  /**
   * Execute user-defined function
   */
  private executeUserFunction(func: FunctionNode, args: any[]): any {
    // Create new scope
    const oldEnv = new Map(this.environment);

    // Bind parameters
    for (let i = 0; i < func.parameters.length; i++) {
      const param = func.parameters[i];
      this.environment.set(param.name, args[i] || null);
    }

    // Execute body
    let result: any = null;
    for (const statement of func.body) {
      result = this.executeNode(statement);
    }

    // Restore scope
    this.environment = oldEnv;

    return result;
  }

  /**
   * Get tetrahedron by ID
   */
  public getTetrahedron(id: string): any {
    return this.tetrahedra.get(id);
  }

  /**
   * Get all tetrahedra
   */
  public getAllTetrahedra(): any[] {
    return Array.from(this.tetrahedra.values());
  }

  /**
   * Get environment
   */
  public getEnvironment(): Map<string, any> {
    return this.environment;
  }
}
