/**
 * P31 Language Interpreter
 * Execute P31 language code
 * 
 * "The syntax of sovereignty. The grammar of love."
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { P31AST, P31System } from './P31LanguageParser';

export interface P31Runtime {
  vertices: Map<string, any>;
  components: Map<string, any>;
  protocols: Map<string, any>;
  constraints: Map<string, any>;
  messages: any[];
  operations: Map<string, Function>;
}

export class P31LanguageInterpreter {
  private runtime: P31Runtime;

  constructor() {
    this.runtime = {
      vertices: new Map(),
      components: new Map(),
      protocols: new Map(),
      constraints: new Map(),
      messages: [],
      operations: new Map()
    };
  }

  /**
   * Execute P31 AST
   */
  public execute(ast: P31AST[]): P31Runtime {
    for (const node of ast) {
      this.executeNode(node);
    }

    return this.runtime;
  }

  /**
   * Execute AST node
   */
  private executeNode(node: P31AST): void {
    switch (node.type) {
      case 'system':
        this.executeSystem(node);
        break;
      case 'vertex':
        this.executeVertex(node);
        break;
      case 'component':
        this.executeComponent(node);
        break;
      case 'message':
        this.executeMessage(node);
        break;
      case 'operation':
        this.executeOperation(node);
        break;
      case 'protocol':
        this.executeProtocol(node);
        break;
      case 'constraint':
        this.executeConstraint(node);
        break;
    }
  }

  /**
   * Execute system declaration
   */
  private executeSystem(node: P31AST): void {
    // Validate system
    const topology = node.properties.topology;
    if (topology !== 'tetrahedron') {
      throw new Error('P31 systems must use tetrahedron topology');
    }

    console.log(`🔺 P31 System: ${node.name}`);
    console.log(`   Topology: ${topology}`);
  }

  /**
   * Execute vertex declaration
   */
  private executeVertex(node: P31AST): void {
    const role = node.properties.role;
    const capabilities = node.properties.capabilities || [];
    const connections = node.properties.connections || [];

    this.runtime.vertices.set(node.name, {
      role,
      capabilities,
      connections,
      ...node.properties
    });

    console.log(`🔺 Vertex: ${node.name} (${role})`);
  }

  /**
   * Execute component declaration
   */
  private executeComponent(node: P31AST): void {
    const type = node.properties.type;
    const location = node.properties.location;
    const encryption = node.properties.encryption;

    this.runtime.components.set(node.name, {
      type,
      location,
      encryption,
      ...node.properties
    });

    console.log(`🔺 Component: ${node.name} (${type})`);
  }

  /**
   * Execute message declaration
   */
  private executeMessage(node: P31AST): void {
    const message = {
      name: node.name,
      from: node.properties.from,
      to: node.properties.to,
      payload: node.properties.payload,
      protocol: node.properties.protocol,
      priority: node.properties.priority || 'normal',
      ...node.properties
    };

    this.runtime.messages.push(message);
    console.log(`📨 Message: ${node.name} (${node.properties.from} → ${node.properties.to})`);
  }

  /**
   * Execute operation declaration
   */
  private executeOperation(node: P31AST): void {
    const operation = {
      name: node.name,
      type: node.properties.type,
      requires: node.properties.requires || [],
      vertex: node.properties.vertex,
      timeout: node.properties.timeout || 0,
      ...node.properties
    };

    // Create operation function
    this.runtime.operations.set(node.name, (params: any) => {
      console.log(`⚡ Operation: ${node.name}`);
      return operation;
    });

    console.log(`⚡ Operation: ${node.name} (${node.properties.type})`);
  }

  /**
   * Execute protocol declaration
   */
  private executeProtocol(node: P31AST): void {
    const protocol = {
      name: node.name,
      type: node.properties.type,
      ...node.properties
    };

    this.runtime.protocols.set(node.name, protocol);
    console.log(`📡 Protocol: ${node.name} (${node.properties.type})`);
  }

  /**
   * Execute constraint declaration
   */
  private executeConstraint(node: P31AST): void {
    const constraint = {
      name: node.name,
      type: node.properties.type,
      value: node.properties.value,
      violation: node.properties.violation || 'error',
      ...node.properties
    };

    this.runtime.constraints.set(node.name, constraint);
    
    // Validate constraint
    this.validateConstraint(constraint);

    console.log(`🔒 Constraint: ${node.name} (${node.properties.type})`);
  }

  /**
   * Validate constraint
   */
  private validateConstraint(constraint: any): void {
    switch (constraint.type) {
      case 'vertex_count':
        const vertexCount = this.runtime.vertices.size;
        if (constraint.value === 'exactly(4)' && vertexCount !== 4) {
          if (constraint.violation === 'error') {
            throw new Error(`Constraint violation: ${constraint.name} - Expected exactly 4 vertices, got ${vertexCount}`);
          }
        }
        break;

      case 'encryption':
        if (constraint.value === 'always') {
          // Check all components have encryption
          for (const [name, component] of this.runtime.components) {
            if (component.encryption !== 'required') {
              if (constraint.violation === 'error') {
                throw new Error(`Constraint violation: ${constraint.name} - Component ${name} missing encryption`);
              }
            }
          }
        }
        break;
    }
  }

  /**
   * Get runtime state
   */
  public getRuntime(): P31Runtime {
    return this.runtime;
  }

  /**
   * Execute operation by name
   */
  public executeOperationByName(name: string, params?: any): any {
    const operation = this.runtime.operations.get(name);
    if (!operation) {
      throw new Error(`Operation ${name} not found`);
    }
    return operation(params);
  }

  /**
   * Send message
   */
  public sendMessage(messageName: string, params?: any): void {
    const message = this.runtime.messages.find(m => m.name === messageName);
    if (!message) {
      throw new Error(`Message ${messageName} not found`);
    }

    console.log(`📨 Sending: ${messageName} via ${message.protocol}`);
    // In production, actually send via protocol
  }
}
