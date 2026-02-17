/**
 * Enhanced Configuration Manager for SUPER CENTAUR
 * Combines configuration systems from both Digital Centaur and Sovereign Agent
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';

export interface SuperCentaurConfig {
  // Server Configuration
  server: {
    port: number;
    host: string;
    cors: {
      origin: string | string[];
      credentials: boolean;
    };
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };

  // Database Configuration
  database: {
    type: 'sqlite' | 'postgres';
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database: string;
    ssl?: boolean;
    vectorStore?: boolean;
  };

  // AI Configuration
  ai: {
    provider: 'openai' | 'local';
    apiKey?: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };

  // Blockchain Configuration
  blockchain: {
    provider: string;
    network: 'mainnet' | 'testnet' | 'local';
    contracts: {
      legalFramework: string;
      identity: string;
      governance: string;
    };
    wallet: {
      privateKey?: string;
      mnemonic?: string;
    };
  };

  // Legal Configuration
  legal: {
    jurisdiction: string;
    courtSystem: string;
    documentTemplates: string[];
    emergencyProtocols: boolean;
  };

  // Medical Configuration
  medical: {
    enableDocumentation: boolean;
    conditions: string[];
    expertWitness: boolean;
    compliance: {
      HIPAA: boolean;
      GDPR: boolean;
    };
  };

  // Security Configuration
  security: {
    encryption: {
      algorithm: string;
      keySize: number;
    };
    authentication: {
      jwtSecret: string;
      expiresIn: string;
    };
    audit: {
      enabled: boolean;
      retentionDays: number;
    };
  };

  // Frontend Configuration
  frontend: {
    port: number;
    buildDir: string;
    publicDir: string;
  };

  // CLI Configuration
  cli: {
    theme: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
    };
    spinner: string;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: SuperCentaurConfig;
  private logger: Logger;
  public configPath: string;

  private constructor() {
    this.logger = new Logger('ConfigManager');
    this.configPath = this.getConfigPath();
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public static async initialize(): Promise<ConfigManager> {
    const instance = ConfigManager.getInstance();
    await instance.initializeConfig();
    return instance;
  }

  private getConfigPath(): string {
    const envPath = process.env.CONFIG_PATH;
    if (envPath) {
      return path.resolve(envPath);
    }
    
    const configPaths = [
      path.join(process.cwd(), 'config', 'config.json'),
      path.join(process.cwd(), 'config.json'),
      path.join(process.env.HOME || process.env.USERPROFILE || '', '.super-centaur', 'config.json')
    ];

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }

    return configPaths[0]; // Default path
  }

  private loadConfig(): SuperCentaurConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        const loadedConfig = JSON.parse(configData);
        this.logger.info(`Configuration loaded from: ${this.configPath}`);
        return this.mergeWithDefaults(loadedConfig);
      } else {
        this.logger.warn(`Configuration file not found at: ${this.configPath}`);
        return this.getDefaultConfig();
      }
    } catch (error) {
      this.logger.error('Failed to load configuration:', error);
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): SuperCentaurConfig {
    return {
      server: {
        port: 3001,
        host: 'localhost',
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:5173'],
          credentials: true
        },
        rateLimit: {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100 // limit each IP to 100 requests per windowMs
        }
      },
      database: {
        type: 'sqlite',
        database: 'super-centaur.db',
        vectorStore: true
      },
      ai: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4000
      },
      blockchain: {
        provider: 'http://localhost:8545',
        network: 'local',
        contracts: {
          legalFramework: '',
          identity: '',
          governance: ''
        },
        wallet: {}
      },
      legal: {
        jurisdiction: 'US',
        courtSystem: 'federal',
        documentTemplates: ['emergency-motion', 'legal-response', 'compliance-check'],
        emergencyProtocols: true
      },
      medical: {
        enableDocumentation: true,
        conditions: ['hypoparathyroidism', 'intellectual-gaps', 'generational-trauma'],
        expertWitness: true,
        compliance: {
          HIPAA: true,
          GDPR: true
        }
      },
      security: {
        encryption: {
          algorithm: 'aes-256-gcm',
          keySize: 256
        },
        authentication: {
          jwtSecret: process.env.JWT_SECRET || (() => {
            throw new Error('JWT_SECRET environment variable is required for security');
          })(),
          expiresIn: '24h'
        },
        audit: {
          enabled: true,
          retentionDays: 365
        }
      },
      frontend: {
        port: 3000,
        buildDir: 'dist',
        publicDir: 'public'
      },
      cli: {
        theme: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        spinner: 'dots'
      }
    };
  }

  private mergeWithDefaults(loadedConfig: any): SuperCentaurConfig {
    const defaultConfig = this.getDefaultConfig();
    
    // Deep merge configuration
    const mergedConfig = this.deepMerge(defaultConfig, loadedConfig);
    
    // Validate configuration
    this.validateConfig(mergedConfig);
    
    return mergedConfig;
  }

  private deepMerge(target: any, source: any): any {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  private validateConfig(config: SuperCentaurConfig): void {
    // Validate required fields
    if (!config.server.port || config.server.port < 1000) {
      throw new Error('Invalid server port configuration');
    }

    if (!config.database.type) {
      throw new Error('Database type is required');
    }

    if (!config.ai.provider) {
      throw new Error('AI provider is required');
    }

    this.logger.info('Configuration validation passed');
  }

  public async initializeConfig(): Promise<void> {
    // Ensure config directory exists
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Create default config if it doesn't exist
    if (!fs.existsSync(this.configPath)) {
      await this.saveConfig(this.config);
      this.logger.info(`Default configuration created at: ${this.configPath}`);
    }
  }

  public getConfig(): SuperCentaurConfig {
    return this.config;
  }

  public updateConfig(updates: Partial<SuperCentaurConfig>): void {
    this.config = this.mergeWithDefaults({ ...this.config, ...updates });
    this.saveConfig(this.config);
    this.logger.info('Configuration updated');
  }

  public async saveConfig(config?: SuperCentaurConfig): Promise<void> {
    const configToSave = config || this.config;
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(configToSave, null, 2));
      this.logger.info(`Configuration saved to: ${this.configPath}`);
    } catch (error) {
      this.logger.error('Failed to save configuration:', error);
      throw error;
    }
  }

  public get<T>(path: string): T | undefined {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, this.config as any);
  }

  public set<T>(path: string, value: T): void {
    const keys = path.split('.');
    let current = this.config as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    this.saveConfig();
  }
}