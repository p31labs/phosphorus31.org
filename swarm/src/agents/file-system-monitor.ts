/**
 * File System Monitor Agent
 * 
 * Continuously monitors the project directory for changes, new files, and potential issues.
 * Provides real-time file system intelligence to the swarm.
 */

import { EventEmitter } from 'events';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { Logger } from '../utils/logger';
import { SwarmConfig } from '../config/swarm-config';
import { AgentTask, AgentStatus } from '../types/agent-types';
import { FileChange, FileSystemEvent } from '../types/file-system-types';

export class FileSystemMonitor extends EventEmitter {
  private config: SwarmConfig;
  private logger: Logger;
  private projectPath: string;
  private watcher: chokidar.FSWatcher | null = null;
  private isRunning: boolean = false;
  private status: AgentStatus;
  private fileCache: Map<string, fs.Stats> = new Map();
  private changeHistory: FileChange[] = [];
  private ignorePatterns: string[] = [];

  constructor(config: SwarmConfig, logger: Logger, projectPath: string) {
    super();
    this.config = config;
    this.logger = logger;
    this.projectPath = projectPath;
    this.status = {
      name: 'file-system-monitor',
      status: 'initialized',
      lastUpdate: new Date().toISOString(),
      performance: { cpu: 0, memory: 0, uptime: 0 },
      metrics: { filesMonitored: 0, changesDetected: 0, errors: 0 }
    };
  }

  /**
   * Initialize the file system monitor
   */
  public async initialize(): Promise<void> {
    this.logger.info('📁 Initializing File System Monitor...');
    
    try {
      // Load ignore patterns
      await this.loadIgnorePatterns();
      
      // Build initial file cache
      await this.buildFileCache();
      
      this.status.status = 'ready';
      this.status.lastUpdate = new Date().toISOString();
      
      this.logger.success('✅ File System Monitor initialized');
      
    } catch (error) {
      this.logger.error('❌ Failed to initialize File System Monitor:', error);
      this.status.status = 'error';
      throw error;
    }
  }

  /**
   * Start monitoring the file system
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('File System Monitor is already running');
      return;
    }

    this.isRunning = true;
    this.status.status = 'running';
    this.status.lastUpdate = new Date().toISOString();

    this.logger.info('👀 Starting File System Monitor...');

    try {
      // Set up chokidar watcher
      this.watcher = chokidar.watch(this.projectPath, {
        ignored: this.ignorePatterns,
        persistent: true,
        ignoreInitial: true,
        followSymlinks: false,
        depth: this.config.get('monitoring.depth', 10),
        interval: this.config.get('monitoring.interval', 100),
        binaryInterval: this.config.get('monitoring.binaryInterval', 300)
      });

      // Set up event handlers
      this.setupEventHandlers();

      this.logger.success('✅ File System Monitor started');
      
    } catch (error) {
      this.logger.error('❌ Failed to start File System Monitor:', error);
      this.status.status = 'error';
      throw error;
    }
  }

  /**
   * Stop monitoring
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('File System Monitor is not running');
      return;
    }

    this.isRunning = false;
    this.status.status = 'stopped';
    this.status.lastUpdate = new Date().toISOString();

    this.logger.info('🛑 Stopping File System Monitor...');

    try {
      if (this.watcher) {
        await this.watcher.close();
        this.watcher = null;
      }
      
      this.logger.success('✅ File System Monitor stopped');
      
    } catch (error) {
      this.logger.error('❌ Failed to stop File System Monitor:', error);
      throw error;
    }
  }

  /**
   * Emergency stop
   */
  public async emergencyStop(): Promise<void> {
    this.isRunning = false;
    this.status.status = 'emergency-stopped';
    
    if (this.watcher) {
      try {
        await this.watcher.close();
      } catch (error) {
        this.logger.error('Error during emergency stop:', error);
      }
    }
  }

  /**
   * Execute a specific monitoring task
   */
  public async execute(task?: AgentTask): Promise<any> {
    this.logger.info('🎯 Executing File System Monitor task...');

    try {
      switch (task?.type) {
        case 'scan':
          return await this.scanFileSystem();
        case 'analyze-changes':
          return await this.analyzeChanges();
        case 'validate-integrity':
          return await this.validateFileIntegrity();
        default:
          return await this.scanFileSystem();
      }
    } catch (error) {
      this.logger.error('❌ File System Monitor execution failed:', error);
      this.status.metrics.errors++;
      throw error;
    }
  }

  /**
   * Schedule a monitoring task
   */
  public async scheduleTask(task: AgentTask): Promise<void> {
    this.logger.info(`📅 Scheduling task: ${task.type}`);
    
    // Execute task based on type
    await this.execute(task);
  }

  /**
   * Get current status
   */
  public getStatus(): AgentStatus {
    return { ...this.status };
  }

  /**
   * Get change history
   */
  public getChangeHistory(): FileChange[] {
    return [...this.changeHistory];
  }

  /**
   * Get file cache
   */
  public getFileCache(): Map<string, fs.Stats> {
    return new Map(this.fileCache);
  }

  /**
   * Set up event handlers for file system events
   */
  private setupEventHandlers(): void {
    if (!this.watcher) return;

    this.watcher
      .on('add', (filePath) => this.handleFileAdd(filePath))
      .on('change', (filePath) => this.handleFileChange(filePath))
      .on('unlink', (filePath) => this.handleFileDelete(filePath))
      .on('addDir', (dirPath) => this.handleDirAdd(dirPath))
      .on('unlinkDir', (dirPath) => this.handleDirDelete(dirPath))
      .on('error', (error) => this.handleWatcherError(error))
      .on('ready', () => this.handleWatcherReady());
  }

  /**
   * Handle file addition
   */
  private async handleFileAdd(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      this.fileCache.set(filePath, stats);

      const change: FileChange = {
        type: 'add',
        filePath,
        timestamp: new Date().toISOString(),
        size: stats.size,
        extension: path.extname(filePath),
        isBinary: this.isBinaryFile(filePath)
      };

      this.changeHistory.push(change);
      this.status.metrics.filesMonitored++;
      this.status.metrics.changesDetected++;

      this.emit('file-change', change);
      this.emit('status-update', this.getStatus());

      this.logger.info(`📄 New file detected: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Error handling file add for ${filePath}:`, error);
      this.status.metrics.errors++;
    }
  }

  /**
   * Handle file change
   */
  private async handleFileChange(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      const previousStats = this.fileCache.get(filePath);

      this.fileCache.set(filePath, stats);

      const change: FileChange = {
        type: 'modify',
        filePath,
        timestamp: new Date().toISOString(),
        size: stats.size,
        extension: path.extname(filePath),
        isBinary: this.isBinaryFile(filePath),
        previousSize: previousStats?.size
      };

      this.changeHistory.push(change);
      this.status.metrics.changesDetected++;

      this.emit('file-change', change);
      this.emit('status-update', this.getStatus());

      this.logger.info(`📝 File modified: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Error handling file change for ${filePath}:`, error);
      this.status.metrics.errors++;
    }
  }

  /**
   * Handle file deletion
   */
  private handleFileDelete(filePath: string): void {
    this.fileCache.delete(filePath);

    const change: FileChange = {
      type: 'delete',
      filePath,
      timestamp: new Date().toISOString()
    };

    this.changeHistory.push(change);
    this.status.metrics.changesDetected++;

    this.emit('file-change', change);
    this.emit('status-update', this.getStatus());

    this.logger.info(`🗑️  File deleted: ${filePath}`);
  }

  /**
   * Handle directory addition
   */
  private handleDirAdd(dirPath: string): void {
    const change: FileChange = {
      type: 'addDir',
      filePath: dirPath,
      timestamp: new Date().toISOString()
    };

    this.changeHistory.push(change);
    this.status.metrics.changesDetected++;

    this.emit('file-change', change);
    this.emit('status-update', this.getStatus());

    this.logger.info(`📁 Directory added: ${dirPath}`);
  }

  /**
   * Handle directory deletion
   */
  private handleDirDelete(dirPath: string): void {
    const change: FileChange = {
      type: 'deleteDir',
      filePath: dirPath,
      timestamp: new Date().toISOString()
    };

    this.changeHistory.push(change);
    this.status.metrics.changesDetected++;

    this.emit('file-change', change);
    this.emit('status-update', this.getStatus());

    this.logger.info(`📁 Directory deleted: ${dirPath}`);
  }

  /**
   * Handle watcher errors
   */
  private handleWatcherError(error: Error): void {
    this.logger.error('Watcher error:', error);
    this.status.metrics.errors++;
    this.emit('error', error);
  }

  /**
   * Handle watcher ready event
   */
  private handleWatcherReady(): void {
    this.logger.info('File System Monitor ready and watching...');
    this.status.status = 'running';
    this.emit('status-update', this.getStatus());
  }

  /**
   * Build initial file cache
   */
  private async buildFileCache(): Promise<void> {
    this.logger.info('🏗️  Building initial file cache...');

    try {
      const files = await this.scanDirectory(this.projectPath);
      
      for (const filePath of files) {
        try {
          const stats = await fs.stat(filePath);
          this.fileCache.set(filePath, stats);
        } catch (error) {
          this.logger.warn(`Could not stat file ${filePath}:`, error);
        }
      }

      this.status.metrics.filesMonitored = this.fileCache.size;
      this.logger.success(`✅ File cache built with ${this.fileCache.size} files`);
      
    } catch (error) {
      this.logger.error('❌ Failed to build file cache:', error);
      throw error;
    }
  }

  /**
   * Scan directory recursively
   */
  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.relative(this.projectPath, fullPath);
        
        // Skip ignored patterns
        if (this.shouldIgnore(relativePath)) {
          continue;
        }

        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      this.logger.warn(`Error scanning directory ${dirPath}:`, error);
    }

    return files;
  }

  /**
   * Load ignore patterns from configuration
   */
  private async loadIgnorePatterns(): Promise<void> {
    const ignorePatterns = this.config.get('monitoring.ignorePatterns', [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
      '**/*.log',
      '**/*.tmp',
      '**/.DS_Store',
      '**/Thumbs.db'
    ]);

    this.ignorePatterns = ignorePatterns;
  }

  /**
   * Check if file should be ignored
   */
  private shouldIgnore(filePath: string): boolean {
    return this.ignorePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(filePath);
    });
  }

  /**
   * Check if file is binary
   */
  private isBinaryFile(filePath: string): boolean {
    const binaryExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.svg',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.zip', '.tar', '.gz', '.7z', '.rar', '.exe', '.dll', '.so'
    ];
    
    return binaryExtensions.includes(path.extname(filePath).toLowerCase());
  }

  /**
   * Scan file system for current state
   */
  public async scanFileSystem(): Promise<FileSystemEvent> {
    this.logger.info('🔍 Scanning file system...');

    const startTime = Date.now();
    const files = await this.scanDirectory(this.projectPath);
    const scanTime = Date.now() - startTime;

    const event: FileSystemEvent = {
      type: 'scan',
      timestamp: new Date().toISOString(),
      filesScanned: files.length,
      scanTime,
      directories: files.filter(f => f.includes(path.sep)).length,
      files: files.length
    };

    this.emit('scan-complete', event);
    return event;
  }

  /**
   * Analyze recent changes
   */
  public async analyzeChanges(): Promise<any> {
    const recentChanges = this.changeHistory.slice(-100); // Last 100 changes
    
    const analysis = {
      totalChanges: recentChanges.length,
      changeTypes: this.groupChangesByType(recentChanges),
      fileTypes: this.groupChangesByFileType(recentChanges),
      timeRange: {
        first: recentChanges[0]?.timestamp,
        last: recentChanges[recentChanges.length - 1]?.timestamp
      }
    };

    this.emit('analysis-complete', analysis);
    return analysis;
  }

  /**
   * Validate file integrity
   */
  public async validateFileIntegrity(): Promise<any> {
    this.logger.info('🔒 Validating file integrity...');

    const issues: string[] = [];
    
    for (const [filePath, stats] of this.fileCache) {
      try {
        const currentStats = await fs.stat(filePath);
        
        if (stats.mtime.getTime() !== currentStats.mtime.getTime()) {
          issues.push(`Modified outside monitor: ${filePath}`);
        }
      } catch (error) {
        issues.push(`File access error: ${filePath}`);
      }
    }

    const result = {
      totalFiles: this.fileCache.size,
      integrityIssues: issues.length,
      issues
    };

    if (issues.length > 0) {
      this.logger.warn(`Found ${issues.length} integrity issues`);
    } else {
      this.logger.info('✅ File integrity validation passed');
    }

    this.emit('integrity-check-complete', result);
    return result;
  }

  /**
   * Group changes by type
   */
  private groupChangesByType(changes: FileChange[]): Record<string, number> {
    const groups: Record<string, number> = {};
    
    for (const change of changes) {
      groups[change.type] = (groups[change.type] || 0) + 1;
    }
    
    return groups;
  }

  /**
   * Group changes by file type
   */
  private groupChangesByFileType(changes: FileChange[]): Record<string, number> {
    const groups: Record<string, number> = {};
    
    for (const change of changes) {
      if (change.extension) {
        groups[change.extension] = (groups[change.extension] || 0) + 1;
      }
    }
    
    return groups;
  }
}