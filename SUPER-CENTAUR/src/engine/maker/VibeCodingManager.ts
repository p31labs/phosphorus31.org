/**
 * Vibe Coding Manager
 * In-game coding environment with live editing and execution
 * 
 * "Vibe coding inside the game environment"
 */

export interface CodeProject {
  id: string;
  name: string;
  language: 'javascript' | 'typescript' | 'python' | 'glsl' | 'hlsl' | 'p31';
  code: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

export interface CodeExecution {
  id: string;
  projectId: string;
  result: any;
  error?: string;
  timestamp: number;
  executionTime: number;
}

export interface VibeCodingConfig {
  enabled: boolean;
  autoSave: boolean;
  livePreview: boolean;
  syntaxHighlighting: boolean;
  codeCompletion: boolean;
  maxProjects: number;
  defaultLanguage: 'javascript' | 'typescript' | 'python' | 'glsl' | 'hlsl' | 'p31';
}

export class VibeCodingManager {
  private config: VibeCodingConfig;
  private projects: Map<string, CodeProject> = new Map();
  private executions: Map<string, CodeExecution> = new Map();
  private activeProjectId: string | null = null;
  private codeEditor: any = null; // Will be set by UI
  private slicingEngine: any = null; // Will be injected
  private printerIntegration: any = null; // Will be injected
  private gameEngine: any = null; // Will be injected for game environment access

  constructor(config?: Partial<VibeCodingConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      autoSave: config?.autoSave ?? true,
      livePreview: config?.livePreview ?? true,
      syntaxHighlighting: config?.syntaxHighlighting ?? true,
      codeCompletion: config?.codeCompletion ?? true,
      maxProjects: config?.maxProjects ?? 100,
      defaultLanguage: config?.defaultLanguage ?? 'javascript'
    };
  }

  /**
   * Initialize vibe coding manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('💻 Vibe Coding Manager disabled');
      return;
    }

    this.loadProjects();
    console.log('💻 Vibe Coding Manager initialized');
  }

  /**
   * Inject dependencies (slicing engine, printer, game engine)
   */
  public injectDependencies(slicingEngine: any, printerIntegration: any, gameEngine: any): void {
    this.slicingEngine = slicingEngine;
    this.printerIntegration = printerIntegration;
    this.gameEngine = gameEngine;
    console.log('💻 Dependencies injected: slicing, printer, game engine');
  }

  /**
   * Execute code and optionally slice/print 3D output
   */
  public async executeAndPrint(projectId: string, options?: {
    slice?: boolean;
    print?: boolean;
    printerId?: string;
  }): Promise<CodeExecution & { slicedModel?: any; printJob?: any }> {
    const execution = await this.executeCode(projectId);
    
    // If code returns a 3D geometry, slice and print it
    if (execution.result && execution.result.geometry && options?.slice) {
      const geometry = execution.result.geometry;
      const slicedModel = await this.slicingEngine.sliceModel(geometry);
      
      if (options?.print && this.printerIntegration) {
        const gcode = this.slicingEngine.exportToGCode(slicedModel);
        const printJob = await this.printerIntegration.printGCode(gcode, options.printerId);
        
        return { ...execution, slicedModel, printJob };
      }
      
      return { ...execution, slicedModel };
    }
    
    return execution;
  }

  /**
   * Get Valentine's Day templates
   */
  public getValentinesTemplates(): any[] {
    try {
      const { getValentinesTemplates } = require('./ValentinesTemplates');
      return getValentinesTemplates();
    } catch {
      return [];
    }
  }

  /**
   * Check if it's Valentine's Day season
   */
  public isValentinesSeason(): boolean {
    const month = new Date().getMonth() + 1; // 1-12
    return month === 2; // February
  }

  /**
   * Create project from Valentine's template
   */
  public createValentinesProject(templateName: string): CodeProject {
    try {
      const { VALENTINES_TEMPLATES } = require('./ValentinesTemplates');
      const template = VALENTINES_TEMPLATES.find((t: any) => t.name === templateName);
      if (!template) {
        throw new Error(`Valentine's template "${templateName}" not found`);
      }

      const project: CodeProject = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: template.name,
        language: template.language,
        code: template.code,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        metadata: {
          isValentines: true,
          template: templateName
        }
      };

      this.projects.set(project.id, project);
      this.activeProjectId = project.id;
      this.saveProjects();

      console.log(`💜 Created Valentine's project: ${project.name} (${project.id})`);
      return project;
    } catch (error) {
      throw new Error(`Failed to create Valentine's project: ${error}`);
    }
  }

  /**
   * Create new code project
   */
  public createProject(name: string, language?: string): CodeProject {
    if (this.projects.size >= this.config.maxProjects) {
      throw new Error(`Maximum projects limit (${this.config.maxProjects}) reached`);
    }

    const project: CodeProject = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      language: (language as any) || this.config.defaultLanguage,
      code: this.getDefaultCode((language as any) || this.config.defaultLanguage),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.projects.set(project.id, project);
    this.activeProjectId = project.id;
    this.saveProjects();

    console.log(`💻 Created project: ${project.name} (${project.id})`);
    return project;
  }

  /**
   * Get default code template
   */
  private getDefaultCode(language: string): string {
    // Check if it's Valentine's Day season (Feb 1-28)
    const isValentinesSeason = () => {
      const month = new Date().getMonth() + 1; // 1-12
      return month === 2; // February
    };

    const valentinesTemplate = isValentinesSeason() ? `
// 💜 Valentine's Day Vibe 💜
// With love and light. As above, so below.

function createValentineHeart() {
  const primitives = [];
  const colors = ['#FF6B9D', '#FFB3D9', '#FF69B4', '#FF1493', '#FFC0CB'];
  
  // Create heart shape with tetrahedrons
  // Top of heart (two curves)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI;
    const radius = 2;
    primitives.push({
      id: \`heart_top_\${i}\`,
      type: 'tetrahedron',
      position: {
        x: Math.cos(angle) * radius - 1.5,
        y: Math.sin(angle) * radius + 2,
        z: 0
      },
      rotation: { x: 0, y: angle, z: 0 },
      scale: 0.6,
      color: colors[i % colors.length],
      material: 'quantum'
    });
    
    primitives.push({
      id: \`heart_top_r_\${i}\`,
      type: 'tetrahedron',
      position: {
        x: Math.cos(angle) * radius + 1.5,
        y: Math.sin(angle) * radius + 2,
        z: 0
      },
      rotation: { x: 0, y: -angle, z: 0 },
      scale: 0.6,
      color: colors[i % colors.length],
      material: 'quantum'
    });
  }
  
  // Bottom point of heart
  primitives.push({
    id: 'heart_bottom',
    type: 'tetrahedron',
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1.2,
    color: '#FF6B9D',
    material: 'quantum'
  });
  
  return {
    id: 'valentine_heart',
    name: '💜 Valentine Heart',
    primitives
  };
}

const heart = createValentineHeart();
game.setStructure(heart);
console.log('💜 Valentine heart created with love and light!');` : '';

    const templates: Record<string, string> = {
      javascript: valentinesTemplate || `// Vibe Coding - JavaScript
// Write your code here and see it run in real-time

function vibe() {
  console.log('💜 Vibe coding with love and light');
  return 'The Mesh Holds';
}

vibe();`,
      typescript: valentinesTemplate || `// Vibe Coding - TypeScript
// Type-safe coding in the game environment

function vibe(): string {
  console.log('💜 Vibe coding with love and light');
  return 'The Mesh Holds';
}

vibe();`,
      python: `# Vibe Coding - Python
# Python scripting in the game environment

def vibe():
    print('💜 Vibe coding with love and light')
    return 'The Mesh Holds'

vibe()`,
      glsl: `// Vibe Coding - GLSL Shader
// Write shaders that run in the game

void main() {
  gl_FragColor = vec4(1.0, 0.5, 0.8, 1.0); // Pink vibe
}`,
      hlsl: `// Vibe Coding - HLSL Shader
// DirectX shader programming

float4 main() : SV_Target {
  return float4(1.0, 0.5, 0.8, 1.0); // Pink vibe
}`,
      p31: `// P31 Language - Domain-Specific Language for P31
// The biological qubit. The atom in the bone.
// 💜 With love and light. As above, so below. 💜

module MyStructure {
  structure LoveTetra {
    primitives: [
      tetrahedron {
        position: vec3(0, 0, 0),
        scale: 1.0,
        color: #FF6B9D,
        material: quantum
      }
    ]
  }
  
  validate(LoveTetra);
  print("Tetrahedron created!");
}`
    };

    return templates[language] || templates.javascript;
  }

  /**
   * Update project code
   */
  public updateProject(projectId: string, code: string): void {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    project.code = code;
    project.updatedAt = Date.now();

    if (this.config.autoSave) {
      this.saveProjects();
    }

    // Emit update event for live preview
    if (this.config.livePreview) {
      window.dispatchEvent(new CustomEvent('vibecoding:codeUpdated', {
        detail: { projectId, code }
      }));
    }
  }

  /**
   * Execute code
   */
  public async executeCode(projectId: string): Promise<CodeExecution> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const startTime = performance.now();
    let result: any = null;
    let error: string | undefined = undefined;

    try {
      // Execute based on language
      switch (project.language) {
        case 'javascript':
        case 'typescript':
          result = await this.executeJavaScript(project.code);
          break;
        case 'python':
          result = await this.executePython(project.code);
          break;
        case 'glsl':
        case 'hlsl':
          result = await this.executeShader(project.code, project.language);
          break;
        default:
          throw new Error(`Unsupported language: ${project.language}`);
      }
    } catch (e: any) {
      error = e.message || 'Execution error';
      console.error('💻 Code execution error:', e);
    }

    const executionTime = performance.now() - startTime;

    const execution: CodeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      projectId,
      result,
      error,
      timestamp: Date.now(),
      executionTime
    };

    this.executions.set(execution.id, execution);
    this.saveExecutions();

    // Emit execution event
    window.dispatchEvent(new CustomEvent('vibecoding:executed', {
      detail: execution
    }));

    return execution;
  }

  /**
   * Execute JavaScript/TypeScript
   */
  private async executeJavaScript(code: string): Promise<any> {
    // Create isolated execution context
    const context = {
      console: {
        log: (...args: any[]) => {
          window.dispatchEvent(new CustomEvent('vibecoding:console', {
            detail: { type: 'log', args }
          }));
        },
        error: (...args: any[]) => {
          window.dispatchEvent(new CustomEvent('vibecoding:console', {
            detail: { type: 'error', args }
          }));
        }
      },
      // Game engine access
      game: null, // Will be injected
      // Three.js access
      THREE: null, // Will be injected
      // Math utilities
      Math: Math
    };

    // Wrap code in async function
    const wrappedCode = `
      (async () => {
        ${code}
      })()
    `;

    // Execute in isolated context
    const func = new Function(...Object.keys(context), wrappedCode);
    return await func(...Object.values(context));
  }

  /**
   * Execute Python (via WebAssembly or transpilation)
   */
  private async executePython(code: string): Promise<any> {
    // Placeholder for Python execution
    // In production, use Pyodide or similar
    throw new Error('Python execution not yet implemented. Use JavaScript/TypeScript for now.');
  }

  /**
   * Execute shader
   */
  private async executeShader(code: string, language: 'glsl' | 'hlsl'): Promise<any> {
    // Return shader code for compilation
    return {
      code,
      language,
      compiled: false // Will be compiled by Three.js or WebGPU
    };
  }

  /**
   * Get project
   */
  public getProject(projectId: string): CodeProject | null {
    return this.projects.get(projectId) || null;
  }

  /**
   * Get all projects
   */
  public getProjects(): CodeProject[] {
    return Array.from(this.projects.values());
  }

  /**
   * Delete project
   */
  public deleteProject(projectId: string): void {
    this.projects.delete(projectId);
    if (this.activeProjectId === projectId) {
      this.activeProjectId = null;
    }
    this.saveProjects();
  }

  /**
   * Set active project
   */
  public setActiveProject(projectId: string): void {
    if (!this.projects.has(projectId)) {
      throw new Error(`Project ${projectId} not found`);
    }
    this.activeProjectId = projectId;
  }

  /**
   * Get active project
   */
  public getActiveProject(): CodeProject | null {
    return this.activeProjectId ? this.projects.get(this.activeProjectId) || null : null;
  }

  /**
   * Get execution history
   */
  public getExecutionHistory(projectId?: string, limit?: number): CodeExecution[] {
    let executions = Array.from(this.executions.values());

    if (projectId) {
      executions = executions.filter(e => e.projectId === projectId);
    }

    executions.sort((a, b) => b.timestamp - a.timestamp);

    return limit ? executions.slice(0, limit) : executions;
  }

  /**
   * Save projects
   */
  private saveProjects(): void {
    try {
      const projectsArray = Array.from(this.projects.values());
      localStorage.setItem('vibecoding_projects', JSON.stringify(projectsArray));
    } catch (error) {
      console.warn('Failed to save projects:', error);
    }
  }

  /**
   * Load projects
   */
  private loadProjects(): void {
    try {
      const saved = localStorage.getItem('vibecoding_projects');
      if (saved) {
        const projectsArray = JSON.parse(saved);
        projectsArray.forEach((project: CodeProject) => {
          this.projects.set(project.id, project);
        });
      }
    } catch (error) {
      console.warn('Failed to load projects:', error);
    }
  }

  /**
   * Save executions
   */
  private saveExecutions(): void {
    try {
      const executionsArray = Array.from(this.executions.values()).slice(-100); // Keep last 100
      localStorage.setItem('vibecoding_executions', JSON.stringify(executionsArray));
    } catch (error) {
      console.warn('Failed to save executions:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<VibeCodingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  public getConfig(): VibeCodingConfig {
    return { ...this.config };
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.saveProjects();
    this.saveExecutions();
    this.projects.clear();
    this.executions.clear();
  }
}
