 deep rea **
 * Swarm Configuration System
 * 
 * Manages configuration for the entire swarm system, including agent settings,
 * resource limits, monitoring parameters, and system-wide options.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { Logger } from '../utils/logger';

export interface SwarmConfigOptions {
  projectPath: string;
  configPath?: string;
  defaultConfig?: any;
  environment?: string;
  secretsPath?: string;
}

export class SwarmConfig {
  private options: SwarmConfigOptions;
  private config: any = {};
  private logger: Logger;
  private isLoaded: boolean = false;
  private watchers: Map<string, (config: any) => void> = new Map();

  constructor(options: SwarmConfigOptions) {
    this.options = options;
    this.logger = new Logger('Swarm-Config');
  }

  /**
   * Load configuration from files and environment
   */
  public async load(): Promise<void> {
    if (this.isLoaded) {
      this.logger.warn('Configuration already loaded');
      return;
    }

    this.logger.info('⚙️  Loading swarm configuration...');

    try {
      // Load default configuration
      await this.loadDefaultConfig();
      
      // Load environment-specific configuration
      await this.loadEnvironmentConfig();
      
      // Load user configuration
      await this.loadUserConfig();
      
      // Load secrets
      await this.loadSecrets();
      
      // Validate configuration
      await this.validateConfig();
      
      this.isLoaded = true;
      this.logger.success('✅ Configuration loaded successfully');
      
    } catch (error) {
      this.logger.error('❌ Failed to load configuration:', error);
      throw error;
    }
  }

  /**
   * Get a configuration value
   */
  public get<T = any>(key: string, defaultValue?: T): T {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded');
    }

    const value = this.getNestedValue(this.config, key);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Set a configuration value
   */
  public set(key: string, value: any): void {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded');
    }

    this.setNestedValue(this.config, key, value);
    this.notifyWatchers(key, value);
  }

  /**
   * Merge configuration with new values
   */
  public merge(mergeConfig: any): void {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded');
    }

    this.config = this.deepMerge(this.config, mergeConfig);
    this.notifyWatchers('*', this.config);
  }

  /**
   * Save configuration to file
   */
  public async save(): Promise<void> {
    if (!this.isLoaded) {
      throw new Error('Configuration not loaded');
    }

    const configPath = this.getConfigPath();
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeJson(configPath, this.config, { spaces: 2 });
    
    this.logger.info(`💾 Configuration saved to ${configPath}`);
  }

  /**
   * Watch for configuration changes
   */
  public watch(key: string, callback: (value: any) => void): void {
    this.watchers.set(key, callback);
  }

  /**
   * Get configuration summary
   */
  public getSummary(): any {
    return {
      loaded: this.isLoaded,
      environment: this.options.environment,
      configPath: this.getConfigPath(),
      secretsPath: this.options.secretsPath,
      agentCount: this.get('agents', []).length,
      resourceLimits: this.get('resources', {}),
      monitoringEnabled: this.get('monitoring.enabled', false)
    };
  }

  /**
   * Get all configuration
   */
  public getAll(): any {
    return { ...this.config };
  }

  /**
   * Reset configuration to defaults
   */
  public async reset(): Promise<void> {
    this.config = {};
    await this.loadDefaultConfig();
    this.logger.info('🔄 Configuration reset to defaults');
  }

  /**
   * Validate configuration structure
   */
  private async validateConfig(): Promise<void> {
    const requiredFields = [
      'project.path',
      'agents',
      'resources',
      'monitoring'
    ];

    for (const field of requiredFields) {
      if (this.get(field) === undefined) {
        throw new Error(`Missing required configuration field: ${field}`);
      }
    }

    // Validate agent configurations
    const agents = this.get('agents', []);
    for (const agent of agents) {
      if (!agent.name || !agent.type) {
        throw new Error(`Invalid agent configuration: ${JSON.stringify(agent)}`);
      }
    }

    this.logger.info('✅ Configuration validation passed');
  }

  /**
   * Load default configuration
   */
  private async loadDefaultConfig(): Promise<void> {
    const defaultConfig = this.options.defaultConfig || {
      project: {
        path: this.options.projectPath,
        name: path.basename(this.options.projectPath),
        version: '1.0.0'
      },
      agents: [
        {
          name: 'file-system-monitor',
          type: 'monitoring',
          enabled: true,
          priority: 1,
          maxConcurrentTasks: 1,
          timeout: 300000,
          retryAttempts: 3,
          retryDelay: 5000,
          dependencies: [],
          resourceLimits: {
            cpu: 10,
            memory: 128,
            disk: 100
          }
        },
        {
          name: 'project-analyzer',
          type: 'analysis',
          enabled: true,
          priority: 2,
          maxConcurrentTasks: 1,
          timeout: 600000,
          retryAttempts: 2,
          retryDelay: 10000,
          dependencies: ['file-system-monitor'],
          resourceLimits: {
            cpu: 20,
            memory: 256,
            disk: 200
          }
        },
        {
          name: 'file-organizer',
          type: 'organization',
          enabled: true,
          priority: 3,
          maxConcurrentTasks: 2,
          timeout: 900000,
          retryAttempts: 3,
          retryDelay: 15000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 15,
            memory: 192,
            disk: 500
          }
        },
        {
          name: 'dependency-updater',
          type: 'maintenance',
          enabled: true,
          priority: 4,
          maxConcurrentTasks: 1,
          timeout: 1200000,
          retryAttempts: 2,
          retryDelay: 30000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 25,
            memory: 512,
            disk: 1000
          }
        },
        {
          name: 'code-repairer',
          type: 'repair',
          enabled: true,
          priority: 5,
          maxConcurrentTasks: 1,
          timeout: 600000,
          retryAttempts: 3,
          retryDelay: 20000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 30,
            memory: 1024,
            disk: 2000
          }
        },
        {
          name: 'research-agent',
          type: 'research',
          enabled: true,
          priority: 6,
          maxConcurrentTasks: 1,
          timeout: 1800000,
          retryAttempts: 2,
          retryDelay: 60000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 15,
            memory: 256,
            disk: 500
          }
        },
        {
          name: 'performance-optimizer',
          type: 'optimization',
          enabled: true,
          priority: 7,
          maxConcurrentTasks: 1,
          timeout: 900000,
          retryAttempts: 2,
          retryDelay: 30000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 20,
            memory: 512,
            disk: 1000
          }
        },
        {
          name: 'security-scanner',
          type: 'security',
          enabled: true,
          priority: 8,
          maxConcurrentTasks: 1,
          timeout: 600000,
          retryAttempts: 3,
          retryDelay: 15000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 25,
            memory: 512,
            disk: 1000
          }
        },
        {
          name: 'documentation-generator',
          type: 'documentation',
          enabled: true,
          priority: 9,
          maxConcurrentTasks: 1,
          timeout: 900000,
          retryAttempts: 2,
          retryDelay: 30000,
          dependencies: ['project-analyzer'],
          resourceLimits: {
            cpu: 15,
            memory: 256,
            disk: 500
          }
        }
      ],
      resources: {
        cpu: {
          limit: 100,
          warningThreshold: 80,
          criticalThreshold: 95
        },
        memory: {
          limit: 8192,
          warningThreshold: 80,
          criticalThreshold: 95
        },
        disk: {
          limit: 100000,
          warningThreshold: 80,
          criticalThreshold: 95
        },
        network: {
          limit: 1000,
          warningThreshold: 80,
          criticalThreshold: 95
        }
      },
      monitoring: {
        enabled: true,
        interval: 60000,
        alertThresholds: {
          cpu: 80,
          memory: 80,
          disk: 80,
          errors: 10
        },
        retention: {
          metrics: 86400000, // 24 hours
          logs: 604800000,   // 7 days
          events: 2592000000 // 30 days
        }
      },
      scaling: {
        enabled: true,
        strategy: 'load-based',
        minAgents: 3,
        maxAgents: 10,
        scaleUpThreshold: 70,
        scaleDownThreshold: 30,
        cooldownPeriod: 300000
      },
      security: {
        enabled: true,
        encryption: {
          algorithm: 'aes-256-gcm',
          keyLength: 32
        },
        accessControl: {
          enabled: true,
          roles: ['admin', 'user', 'readonly'],
          permissions: ['read', 'write', 'execute', 'admin']
        }
      },
      logging: {
        level: 'info',
        format: 'json',
        output: 'console',
        file: {
          enabled: true,
          path: './logs',
          maxSize: '100MB',
          maxFiles: 10
        }
      },
      notifications: {
        enabled: true,
        channels: ['console', 'file'],
        events: ['agent-status', 'resource-alert', 'error', 'completion']
      }
    };

    this.config = this.deepMerge(this.config, defaultConfig);
  }

  /**
   * Load environment-specific configuration
   */
  private async loadEnvironmentConfig(): Promise<void> {
    if (!this.options.environment) {
      return;
    }

    const envConfigPath = path.join(this.options.projectPath, `.swarm/config.${this.options.environment}.json`);
    
    if (await fs.pathExists(envConfigPath)) {
      const envConfig = await fs.readJson(envConfigPath);
      this.config = this.deepMerge(this.config, envConfig);
      this.logger.info(`🌍 Loaded environment configuration: ${this.options.environment}`);
    }
  }

  /**
   * Load user configuration
   */
  private async loadUserConfig(): Promise<void> {
    const configPath = this.getConfigPath();
    
    if (await fs.pathExists(configPath)) {
      const userConfig = await fs.readJson(configPath);
      this.config = this.deepMerge(this.config, userConfig);
      this.logger.info(`👤 Loaded user configuration from ${configPath}`);
    }
  }

  /**
   * Load secrets configuration
   */
  private async loadSecrets(): Promise<void> {
    if (!this.options.secretsPath) {
      return;
    }

    if (await fs.pathExists(this.options.secretsPath)) {
      const secrets = await fs.readJson(this.options.secretsPath);
      this.config = this.deepMerge(this.config, { secrets });
      this.logger.info(`🔒 Loaded secrets from ${this.options.secretsPath}`);
    }
  }

  /**
   * Get configuration file path
   */
  private getConfigPath(): string {
    return this.options.configPath || path.join(this.options.projectPath, '.swarm', 'config.json');
  }

  /**
   * Get nested configuration value
   */
  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((current, prop) => current && current[prop], obj);
  }

  /**
   * Set nested configuration value
   */
  private setNestedValue(obj: any, key: string, value: any): void {
    const keys = key.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Notify watchers of configuration changes
   */
  private notifyWatchers(key: string, value: any): void {
    this.watchers.forEach((callback, watchKey) => {
      if (watchKey === '*' || watchKey === key) {
        try {
          callback(value);
        } catch (error) {
          this.logger.error(`Error in config watcher for ${watchKey}:`, error);
        }
      }
    });
  }
}