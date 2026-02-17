/**
 * P31 Language Bridge
 * Synergizes System Definition Language and Runtime Execution Language
 * 
 * "Synergize x infinity"
 * The bridge that connects architecture to execution.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { P31LanguageParser as SystemParser, P31AST as SystemAST, P31System } from './P31LanguageParser';
import { P31LanguageInterpreter as SystemInterpreter, P31Runtime } from './P31LanguageInterpreter';
import { P31LanguageParser as RuntimeParser, P31ASTNode as RuntimeAST } from '../engine/language/P31LanguageParser';
import { P31LanguageExecutor, P31ExecutionContext } from '../engine/language/P31LanguageExecutor';

export interface SynergizedP31Context {
  system: {
    parser: SystemParser;
    interpreter: SystemInterpreter;
    runtime: P31Runtime | null;
    ast: SystemAST[] | null;
  };
  execution: {
    parser: RuntimeParser;
    executor: P31LanguageExecutor;
    context: P31ExecutionContext;
    ast: RuntimeAST | null;
  };
  bridge: {
    systemToRuntime: (systemAST: SystemAST[]) => RuntimeAST | null;
    runtimeToSystem: (runtimeAST: RuntimeAST) => SystemAST[] | null;
    validate: () => boolean;
    execute: (code: string, mode: 'system' | 'runtime' | 'auto') => Promise<any>;
  };
}

/**
 * P31 Language Bridge
 * Connects system definitions to runtime execution
 */
export class P31LanguageBridge {
  private systemParser: SystemParser;
  private systemInterpreter: SystemInterpreter;
  private runtimeParser: RuntimeParser;
  private runtimeExecutor: P31LanguageExecutor;
  private systemRuntime: P31Runtime | null = null;
  private systemAST: SystemAST[] | null = null;

  constructor(runtimeExecutor?: P31LanguageExecutor) {
    this.systemParser = new SystemParser();
    this.systemInterpreter = new SystemInterpreter();
    this.runtimeParser = new RuntimeParser();
    this.runtimeExecutor = runtimeExecutor || new P31LanguageExecutor();
  }

  /**
   * Get synergized context
   */
  public getContext(): SynergizedP31Context {
    return {
      system: {
        parser: this.systemParser,
        interpreter: this.systemInterpreter,
        runtime: this.systemRuntime,
        ast: this.systemAST
      },
      execution: {
        parser: this.runtimeParser,
        executor: this.runtimeExecutor,
        context: (this.runtimeExecutor as any).context as P31ExecutionContext,
        ast: null
      },
      bridge: {
        systemToRuntime: (ast) => this.systemToRuntime(ast),
        runtimeToSystem: (ast) => this.runtimeToSystem(ast),
        validate: () => this.validate(),
        execute: (code, mode) => this.execute(code, mode)
      }
    };
  }

  /**
   * Load system definition
   */
  public loadSystem(source: string): P31System {
    this.systemAST = this.systemParser.parse(source);
    this.systemRuntime = this.systemInterpreter.execute(this.systemAST);
    return this.systemParser.validateSystem(this.systemAST)!;
  }

  /**
   * Execute runtime code with system context
   */
  public async executeRuntime(code: string): Promise<any> {
    const parseResult = this.runtimeParser.parse(code);
    if (parseResult.errors.length > 0) {
      throw new Error(`Parse errors: ${parseResult.errors.join(', ')}`);
    }

    // Inject system context into execution
    if (this.systemRuntime) {
      this.injectSystemContext(this.systemRuntime);
    }

    return await this.runtimeExecutor.execute(parseResult.ast);
  }

  /**
   * Execute code in auto mode (detects system vs runtime)
   */
  public async execute(code: string, mode: 'system' | 'runtime' | 'auto' = 'auto'): Promise<any> {
    if (mode === 'auto') {
      // Detect mode by looking for keywords
      if (code.includes('system ') || code.includes('component ') || code.includes('protocol ')) {
        mode = 'system';
      } else {
        mode = 'runtime';
      }
    }

    if (mode === 'system') {
      return this.loadSystem(code);
    } else {
      return await this.executeRuntime(code);
    }
  }

  /**
   * Convert system AST to runtime AST
   */
  private systemToRuntime(systemAST: SystemAST[]): RuntimeAST | null {
    // Find system definition
    const systemNode = systemAST.find(node => node.type === 'system');
    if (!systemNode) return null;

    // Convert to runtime program
    const runtimeAST: RuntimeAST = {
      type: 'program',
      children: []
    };

    // Convert vertices to runtime variables
    const vertices = systemAST.filter(node => node.type === 'vertex');
    for (const vertex of vertices) {
      runtimeAST.children!.push({
        type: 'variable',
        value: vertex.name,
        params: {
          value: {
            type: 'tetrahedron',
            value: vertex.properties
          }
        }
      });
    }

    // Convert components to runtime structures
    const components = systemAST.filter(node => node.type === 'component');
    for (const component of components) {
      runtimeAST.children!.push({
        type: 'build',
        value: component.name,
        params: component.properties
      });
    }

    return runtimeAST;
  }

  /**
   * Convert runtime AST to system AST
   */
  private runtimeToSystem(runtimeAST: RuntimeAST): SystemAST[] | null {
    const systemAST: SystemAST[] = [];

    // Extract tetrahedron structures
    if (runtimeAST.type === 'program' && runtimeAST.children) {
      for (const child of runtimeAST.children) {
        if (child.type === 'tetrahedron') {
          systemAST.push({
            type: 'vertex',
            name: `vertex_${systemAST.length + 1}`,
            properties: child.params || {}
          });
        }
      }
    }

    // Create system definition
    if (systemAST.length > 0) {
      systemAST.unshift({
        type: 'system',
        name: 'p31',
        properties: {
          topology: 'tetrahedron',
          vertices: systemAST.filter(n => n.type === 'vertex').map(n => n.name)
        }
      });
    }

    return systemAST.length > 0 ? systemAST : null;
  }

  /**
   * Inject system context into runtime execution
   */
  private injectSystemContext(systemRuntime: P31Runtime): void {
    const context = (this.runtimeExecutor as any).context as P31ExecutionContext;

    // Inject vertices as variables
    for (const [name, vertex] of systemRuntime.vertices) {
      context.variables.set(name, vertex);
    }

    // Inject components as variables (P31ExecutionContext uses variables, not structures)
    for (const [name, component] of systemRuntime.components) {
      context.variables.set(name, component);
    }

    // Inject protocols as functions
    for (const [name, protocol] of systemRuntime.protocols) {
      context.functions.set(name, {
        type: 'function',
        value: name,
        params: protocol
      } as RuntimeAST);
    }
  }

  /**
   * Validate system and runtime compatibility
   */
  private validate(): boolean {
    if (!this.systemRuntime) return false;

    // Validate tetrahedron constraint
    const vertexCount = this.systemRuntime.vertices.size;
    if (vertexCount !== 4) {
      console.warn(`Tetrahedron constraint: Expected 4 vertices, got ${vertexCount}`);
      return false;
    }

    // Validate encryption
    for (const [name, component] of this.systemRuntime.components) {
      if (component.encryption !== 'required') {
        console.warn(`Component ${name} missing required encryption`);
        return false;
      }
    }

    return true;
  }

  /**
   * Execute with full synergy
   * Loads system, validates, then executes runtime code
   */
  public async synergize(systemCode: string, runtimeCode: string): Promise<any> {
    // Load system
    const system = this.loadSystem(systemCode);
    
    // Validate
    if (!this.validate()) {
      throw new Error('System validation failed');
    }

    // Execute runtime with system context
    return await this.executeRuntime(runtimeCode);
  }

  /**
   * Get system runtime for inspection
   */
  public getSystemRuntime(): P31Runtime | null {
    return this.systemRuntime;
  }

  /**
   * Get execution context for inspection
   */
  public getExecutionContext(): P31ExecutionContext {
    return (this.runtimeExecutor as any).context as P31ExecutionContext;
  }
}
