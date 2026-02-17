/**
 * Tools for Life Manager
 * Comprehensive tools for makers, life, and change
 * 
 * "Tools for life and makers make change"
 * 
 * Features:
 * - Maker Tools: Building, prototyping, creating
 * - Life Tools: Productivity, organization, wellness
 * - Change Tools: Activism, community, impact tracking
 */

export interface MakerTool {
  id: string;
  name: string;
  description: string;
  category: 'prototype' | 'build' | 'create' | 'design' | 'test';
  icon: string;
  action: () => void | Promise<void>;
  enabled: boolean;
}

export interface LifeTool {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'organization' | 'wellness' | 'learning' | 'connection';
  icon: string;
  action: () => void | Promise<void>;
  enabled: boolean;
}

export interface ChangeTool {
  id: string;
  name: string;
  description: string;
  category: 'activism' | 'community' | 'impact' | 'advocacy' | 'collaboration';
  icon: string;
  action: () => void | Promise<void>;
  enabled: boolean;
  impact?: {
    type: 'local' | 'global' | 'community' | 'personal';
    measurable: boolean;
  };
}

export interface ToolConfig {
  enabled: boolean;
  makerTools: boolean;
  lifeTools: boolean;
  changeTools: boolean;
  autoSave: boolean;
  cloudSync: boolean;
  shareEnabled: boolean;
}

export class ToolsForLifeManager {
  private config: ToolConfig;
  private makerTools: Map<string, MakerTool> = new Map();
  private lifeTools: Map<string, LifeTool> = new Map();
  private changeTools: Map<string, ChangeTool> = new Map();
  private toolHistory: Array<{ toolId: string; timestamp: number; type: 'maker' | 'life' | 'change' }> = [];
  private maxHistory: number = 1000;

  constructor(config?: Partial<ToolConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      makerTools: config?.makerTools ?? true,
      lifeTools: config?.lifeTools ?? true,
      changeTools: config?.changeTools ?? true,
      autoSave: config?.autoSave ?? true,
      cloudSync: config?.cloudSync ?? false,
      shareEnabled: config?.shareEnabled ?? true
    };

    this.initializeDefaultTools();
  }

  /**
   * Initialize tools for life manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🔧 Tools for Life Manager disabled');
      return;
    }

    console.log('🔧 Tools for Life Manager initialized');
    console.log(`   Maker Tools: ${this.makerTools.size}`);
    console.log(`   Life Tools: ${this.lifeTools.size}`);
    console.log(`   Change Tools: ${this.changeTools.size}`);
  }

  /**
   * Initialize default tools
   */
  private initializeDefaultTools(): void {
    // Maker Tools
    this.registerMakerTool({
      id: 'structure-builder',
      name: 'Structure Builder',
      description: 'Build geometric structures with tetrahedron topology',
      category: 'build',
      icon: '🔺',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:structureBuilder'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: 'molecule-builder',
      name: 'Molecule Builder',
      description: 'Create and visualize molecules, especially P31',
      category: 'create',
      icon: '🧬',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:moleculeBuilder'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: 'prototype-lab',
      name: 'Prototype Lab',
      description: 'Rapid prototyping and testing environment',
      category: 'prototype',
      icon: '⚗️',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:prototypeLab'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: 'design-studio',
      name: 'Design Studio',
      description: 'Visual design and creation tools',
      category: 'design',
      icon: '🎨',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:designStudio'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: 'test-bench',
      name: 'Test Bench',
      description: 'Test and validate your creations',
      category: 'test',
      icon: '🧪',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:testBench'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: 'vibe-coding',
      name: 'Vibe Coding',
      description: 'Code inside the game environment with live execution',
      category: 'create',
      icon: '💻',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:vibeCoding'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: '3d-slicing',
      name: '3D Slicing',
      description: 'Slice 3D models for 3D printing',
      category: 'prototype',
      icon: '🔪',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:3dSlicing'));
      },
      enabled: true
    });

    this.registerMakerTool({
      id: 'printer-integration',
      name: 'Printer Integration',
      description: 'Push sliced models straight to printer',
      category: 'prototype',
      icon: '🖨️',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:maker:printerIntegration'));
      },
      enabled: true
    });

    // Life Tools
    this.registerLifeTool({
      id: 'task-manager',
      name: 'Task Manager',
      description: 'Organize and track your tasks',
      category: 'productivity',
      icon: '✅',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:life:taskManager'));
      },
      enabled: true
    });

    this.registerLifeTool({
      id: 'habit-tracker',
      name: 'Habit Tracker',
      description: 'Build and maintain positive habits',
      category: 'wellness',
      icon: '📊',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:life:habitTracker'));
      },
      enabled: true
    });

    this.registerLifeTool({
      id: 'mind-map',
      name: 'Mind Map',
      description: 'Visualize ideas and connections',
      category: 'organization',
      icon: '🗺️',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:life:mindMap'));
      },
      enabled: true
    });

    this.registerLifeTool({
      id: 'learning-path',
      name: 'Learning Path',
      description: 'Track your learning journey',
      category: 'learning',
      icon: '📚',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:life:learningPath'));
      },
      enabled: true
    });

    this.registerLifeTool({
      id: 'connection-hub',
      name: 'Connection Hub',
      description: 'Stay connected with family and community',
      category: 'connection',
      icon: '💜',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:life:connectionHub'));
      },
      enabled: true
    });

    // Change Tools
    this.registerChangeTool({
      id: 'impact-tracker',
      name: 'Impact Tracker',
      description: 'Track your positive impact on the world',
      category: 'impact',
      icon: '🌍',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:change:impactTracker'));
      },
      enabled: true,
      impact: {
        type: 'global',
        measurable: true
      }
    });

    this.registerChangeTool({
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Build and strengthen communities',
      category: 'community',
      icon: '🤝',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:change:communityBuilder'));
      },
      enabled: true,
      impact: {
        type: 'community',
        measurable: true
      }
    });

    this.registerChangeTool({
      id: 'advocacy-platform',
      name: 'Advocacy Platform',
      description: 'Amplify voices and causes',
      category: 'advocacy',
      icon: '📢',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:change:advocacyPlatform'));
      },
      enabled: true,
      impact: {
        type: 'global',
        measurable: true
      }
    });

    this.registerChangeTool({
      id: 'collaboration-space',
      name: 'Collaboration Space',
      description: 'Work together to create change',
      category: 'collaboration',
      icon: '🌟',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:change:collaborationSpace'));
      },
      enabled: true,
      impact: {
        type: 'community',
        measurable: true
      }
    });

    this.registerChangeTool({
      id: 'local-action',
      name: 'Local Action',
      description: 'Take action in your local community',
      category: 'activism',
      icon: '🏘️',
      action: () => {
        window.dispatchEvent(new CustomEvent('tools:change:localAction'));
      },
      enabled: true,
      impact: {
        type: 'local',
        measurable: true
      }
    });
  }

  /**
   * Register maker tool
   */
  public registerMakerTool(tool: MakerTool): void {
    this.makerTools.set(tool.id, tool);
  }

  /**
   * Register life tool
   */
  public registerLifeTool(tool: LifeTool): void {
    this.lifeTools.set(tool.id, tool);
  }

  /**
   * Register change tool
   */
  public registerChangeTool(tool: ChangeTool): void {
    this.changeTools.set(tool.id, tool);
  }

  /**
   * Get maker tools
   */
  public getMakerTools(): MakerTool[] {
    return Array.from(this.makerTools.values()).filter(tool => tool.enabled);
  }

  /**
   * Get life tools
   */
  public getLifeTools(): LifeTool[] {
    return Array.from(this.lifeTools.values()).filter(tool => tool.enabled);
  }

  /**
   * Get change tools
   */
  public getChangeTools(): ChangeTool[] {
    return Array.from(this.changeTools.values()).filter(tool => tool.enabled);
  }

  /**
   * Get tool by ID
   */
  public getTool(id: string): MakerTool | LifeTool | ChangeTool | null {
    return this.makerTools.get(id) || 
           this.lifeTools.get(id) || 
           this.changeTools.get(id) || 
           null;
  }

  /**
   * Execute tool
   */
  public async executeTool(id: string): Promise<void> {
    const tool = this.getTool(id);
    if (!tool || !tool.enabled) {
      throw new Error(`Tool ${id} not found or disabled`);
    }

    // Record usage
    const toolType = this.makerTools.has(id) ? 'maker' : 
                     this.lifeTools.has(id) ? 'life' : 'change';
    this.recordToolUsage(id, toolType);

    // Execute tool
    try {
      await tool.action();
      console.log(`🔧 Executed tool: ${tool.name}`);
    } catch (error) {
      console.error(`❌ Error executing tool ${id}:`, error);
      throw error;
    }
  }

  /**
   * Record tool usage
   */
  private recordToolUsage(toolId: string, type: 'maker' | 'life' | 'change'): void {
    this.toolHistory.push({
      toolId,
      timestamp: Date.now(),
      type
    });

    // Limit history size
    if (this.toolHistory.length > this.maxHistory) {
      this.toolHistory.shift();
    }

    // Auto-save if enabled
    if (this.config.autoSave) {
      this.saveToolHistory();
    }
  }

  /**
   * Get tool usage statistics
   */
  public getToolStats(): {
    totalUsage: number;
    makerUsage: number;
    lifeUsage: number;
    changeUsage: number;
    mostUsed: Array<{ toolId: string; count: number }>;
  } {
    const usageCounts = new Map<string, number>();
    let makerUsage = 0;
    let lifeUsage = 0;
    let changeUsage = 0;

    this.toolHistory.forEach(entry => {
      const count = usageCounts.get(entry.toolId) || 0;
      usageCounts.set(entry.toolId, count + 1);

      if (entry.type === 'maker') makerUsage++;
      if (entry.type === 'life') lifeUsage++;
      if (entry.type === 'change') changeUsage++;
    });

    const mostUsed = Array.from(usageCounts.entries())
      .map(([toolId, count]) => ({ toolId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalUsage: this.toolHistory.length,
      makerUsage,
      lifeUsage,
      changeUsage,
      mostUsed
    };
  }

  /**
   * Get tool history
   */
  public getToolHistory(limit?: number): Array<{ toolId: string; timestamp: number; type: 'maker' | 'life' | 'change' }> {
    const history = [...this.toolHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Save tool history
   */
  private saveToolHistory(): void {
    try {
      localStorage.setItem('tools_for_life_history', JSON.stringify(this.toolHistory));
    } catch (error) {
      console.warn('Failed to save tool history:', error);
    }
  }

  /**
   * Load tool history
   */
  private loadToolHistory(): void {
    try {
      const saved = localStorage.getItem('tools_for_life_history');
      if (saved) {
        this.toolHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load tool history:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<ToolConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get configuration
   */
  public getConfig(): ToolConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable tool
   */
  public setToolEnabled(id: string, enabled: boolean): void {
    const tool = this.getTool(id);
    if (tool) {
      tool.enabled = enabled;
    }
  }

  /**
   * Search tools
   */
  public searchTools(query: string): Array<MakerTool | LifeTool | ChangeTool> {
    const lowerQuery = query.toLowerCase();
    const results: Array<MakerTool | LifeTool | ChangeTool> = [];

    // Search maker tools
    this.makerTools.forEach(tool => {
      if (tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.category.toLowerCase().includes(lowerQuery)) {
        results.push(tool);
      }
    });

    // Search life tools
    this.lifeTools.forEach(tool => {
      if (tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.category.toLowerCase().includes(lowerQuery)) {
        results.push(tool);
      }
    });

    // Search change tools
    this.changeTools.forEach(tool => {
      if (tool.name.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.category.toLowerCase().includes(lowerQuery)) {
        results.push(tool);
      }
    });

    return results;
  }

  /**
   * Get tools by category
   */
  public getToolsByCategory(category: string, type: 'maker' | 'life' | 'change'): Array<MakerTool | LifeTool | ChangeTool> {
    const tools = type === 'maker' ? this.makerTools :
                  type === 'life' ? this.lifeTools :
                  this.changeTools;

    return Array.from(tools.values()).filter(tool => 
      tool.category === category && tool.enabled
    );
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.saveToolHistory();
    this.makerTools.clear();
    this.lifeTools.clear();
    this.changeTools.clear();
    this.toolHistory = [];
  }
}
