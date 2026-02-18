/**
 * Enhanced Logger Utility
 * 
 * Provides structured logging with multiple output formats, levels, and destinations.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  module?: string;
  metadata?: any;
  error?: Error;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'text' | 'simple';
  output: 'console' | 'file' | 'both';
  file?: {
    path: string;
    maxSize: string;
    maxFiles: number;
    rotation: 'daily' | 'size' | 'none';
  };
  colors: boolean;
  timestamp: boolean;
  includeMetadata: boolean;
}

export class Logger {
  private config: LoggerConfig;
  private module: string;
  private logFile?: fs.WriteStream;
  private logBuffer: string[] = [];
  private bufferMaxSize = 1000;

  constructor(module: string, config?: Partial<LoggerConfig>) {
    this.module = module;
    this.config = this.mergeConfig(config || {});
    this.setupFileLogging();
  }

  /**
   * Set logger configuration
   */
  public setConfig(config: Partial<LoggerConfig>): void {
    this.config = this.mergeConfig(config);
    this.setupFileLogging();
  }

  /**
   * Log debug message
   */
  public debug(message: string, metadata?: any): void {
    this.log('debug', message, metadata);
  }

  /**
   * Log info message
   */
  public info(message: string, metadata?: any): void {
    this.log('info', message, metadata);
  }

  /**
   * Log warning message
   */
  public warn(message: string, metadata?: any): void {
    this.log('warn', message, metadata);
  }

  /**
   * Log error message
   */
  public error(message: string, error?: Error, metadata?: any): void {
    this.log('error', message, metadata, error);
  }

  /**
   * Log fatal error message
   */
  public fatal(message: string, error?: Error, metadata?: any): void {
    this.log('fatal', message, metadata, error);
  }

  /**
   * Create child logger with additional context
   */
  public child(childModule: string): Logger {
    const childConfig = { ...this.config };
    return new Logger(`${this.module}:${childModule}`, childConfig);
  }

  /**
   * Log method with all parameters
   */
  private log(level: LogLevel, message: string, metadata?: any, error?: Error): void {
    // Check if level should be logged
    if (this.getLevelPriority(level) < this.getLevelPriority(this.config.level)) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      module: this.module,
      metadata,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as any : undefined
    };

    // Format and output log
    const formattedLog = this.formatLog(logEntry);
    
    if (this.config.output === 'console' || this.config.output === 'both') {
      this.outputToConsole(formattedLog, level);
    }

    if (this.config.output === 'file' || this.config.output === 'both') {
      this.outputToFile(formattedLog);
    }
  }

  /**
   * Format log entry
   */
  private formatLog(entry: LogEntry): string {
    switch (this.config.format) {
      case 'json':
        return JSON.stringify(entry);
      case 'text':
        return this.formatTextLog(entry);
      case 'simple':
        return this.formatSimpleLog(entry);
      default:
        return this.formatTextLog(entry);
    }
  }

  /**
   * Format text log
   */
  private formatTextLog(entry: LogEntry): string {
    let log = '';
    
    if (this.config.timestamp) {
      log += `[${entry.timestamp}] `;
    }

    log += `[${entry.level.toUpperCase()}] `;
    
    if (entry.module) {
      log += `[${entry.module}] `;
    }

    log += entry.message;

    if (this.config.includeMetadata && entry.metadata) {
      log += ` | ${JSON.stringify(entry.metadata)}`;
    }

    if (entry.error) {
      log += ` | ERROR: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack) {
        log += `\n${entry.error.stack}`;
      }
    }

    return log;
  }

  /**
   * Format simple log
   */
  private formatSimpleLog(entry: LogEntry): string {
    let log = `${entry.level}: ${entry.message}`;
    
    if (entry.module) {
      log = `[${entry.module}] ${log}`;
    }

    if (entry.error) {
      log += ` - ${entry.error.name}: ${entry.error.message}`;
    }

    return log;
  }

  /**
   * Output to console
   */
  private outputToConsole(log: string, level: LogLevel): void {
    const color = this.getColor(level);
    const output = this.config.colors ? `${color}${log}\x1b[0m` : log;

    switch (level) {
      case 'error':
      case 'fatal':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  /**
   * Output to file
   */
  private outputToFile(log: string): void {
    if (!this.logFile) {
      this.logBuffer.push(log);
      if (this.logBuffer.length >= this.bufferMaxSize) {
        this.flushBuffer();
      }
      return;
    }

    this.logFile.write(log + '\n');
  }

  /**
   * Flush log buffer to file
   */
  private flushBuffer(): void {
    if (this.logFile && this.logBuffer.length > 0) {
      for (const log of this.logBuffer) {
        this.logFile.write(log + '\n');
      }
      this.logBuffer = [];
    }
  }

  /**
   * Setup file logging
   */
  private async setupFileLogging(): Promise<void> {
    if (this.config.output !== 'file' && this.config.output !== 'both') {
      return;
    }

    if (!this.config.file) {
      return;
    }

    try {
      await fs.ensureDir(path.dirname(this.config.file.path));
      
      // Check if file rotation is needed
      await this.checkFileRotation();
      
      this.logFile = fs.createWriteStream(this.config.file.path, { flags: 'a' });
      
      // Flush any buffered logs
      this.flushBuffer();
      
    } catch (error) {
      console.error('Failed to setup file logging:', error);
    }
  }

  /**
   * Check if file rotation is needed
   */
  private async checkFileRotation(): Promise<void> {
    if (!this.config.file || this.config.file.rotation === 'none') {
      return;
    }

    const logPath = this.config.file.path;
    
    if (!(await fs.pathExists(logPath))) {
      return;
    }

    const stats = await fs.stat(logPath);
    
    switch (this.config.file.rotation) {
      case 'size':
        if (stats.size > this.parseSize(this.config.file.maxSize)) {
          await this.rotateLogFile();
        }
        break;
      case 'daily':
        const fileDate = new Date(stats.mtime);
        const today = new Date();
        if (fileDate.toDateString() !== today.toDateString()) {
          await this.rotateLogFile();
        }
        break;
    }
  }

  /**
   * Rotate log file
   */
  private async rotateLogFile(): Promise<void> {
    if (!this.config.file) return;

    const logPath = this.config.file.path;
    const backupPath = `${logPath}.${Date.now()}`;
    
    try {
      // Close current file
      if (this.logFile) {
        this.logFile.end();
        this.logFile = null;
      }

      // Rename current file
      await fs.rename(logPath, backupPath);

      // Clean up old files
      await this.cleanupOldFiles();

    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  /**
   * Cleanup old log files
   */
  private async cleanupOldFiles(): Promise<void> {
    if (!this.config.file) return;

    const logDir = path.dirname(this.config.file.path);
    const logPrefix = path.basename(this.config.file.path);
    
    try {
      const files = await fs.readdir(logDir);
      const backupFiles = files
        .filter(file => file.startsWith(logPrefix + '.'))
        .sort()
        .reverse();

      // Remove old files beyond maxFiles limit
      for (let i = this.config.file.maxFiles; i < backupFiles.length; i++) {
        await fs.unlink(path.join(logDir, backupFiles[i]));
      }

    } catch (error) {
      console.error('Failed to cleanup old log files:', error);
    }
  }

  /**
   * Parse size string to bytes
   */
  private parseSize(sizeStr: string): number {
    const units = { B: 1, KB: 1024, MB: 1024**2, GB: 1024**3 };
    const match = sizeStr.match(/^(\d+)(B|KB|MB|GB)$/i);
    
    if (!match) {
      throw new Error(`Invalid size format: ${sizeStr}`);
    }

    return parseInt(match[1]) * units[match[2].toUpperCase() as keyof typeof units];
  }

  /**
   * Get color for log level
   */
  private getColor(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return '\x1b[36m'; // Cyan
      case 'info':
        return '\x1b[32m'; // Green
      case 'warn':
        return '\x1b[33m'; // Yellow
      case 'error':
        return '\x1b[31m'; // Red
      case 'fatal':
        return '\x1b[35m'; // Magenta
      default:
        return '\x1b[0m';
    }
  }

  /**
   * Get priority number for log level
   */
  private getLevelPriority(level: LogLevel): number {
    const priorities = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      fatal: 4
    };
    return priorities[level];
  }

  /**
   * Merge configuration with defaults
   */
  private mergeConfig(config: Partial<LoggerConfig>): LoggerConfig {
    return {
      level: config.level || 'info',
      format: config.format || 'text',
      output: config.output || 'console',
      colors: config.colors !== undefined ? config.colors : true,
      timestamp: config.timestamp !== undefined ? config.timestamp : true,
      includeMetadata: config.includeMetadata !== undefined ? config.includeMetadata : true,
      file: config.file || {
        path: path.join(os.homedir(), '.swarm', 'logs', 'swarm.log'),
        maxSize: '100MB',
        maxFiles: 10,
        rotation: 'daily'
      },
      ...config
    };
  }

  /**
   * Close logger and cleanup resources
   */
  public close(): void {
    if (this.logFile) {
      this.flushBuffer();
      this.logFile.end();
      this.logFile = null;
    }
  }
}

// Global logger instance
export const globalLogger = new Logger('Global');

// Export convenience functions
export const debug = (message: string, metadata?: any) => globalLogger.debug(message, metadata);
export const info = (message: string, metadata?: any) => globalLogger.info(message, metadata);
export const warn = (message: string, metadata?: any) => globalLogger.warn(message, metadata);
export const error = (message: string, error?: Error, metadata?: any) => globalLogger.error(message, error, metadata);
export const fatal = (message: string, error?: Error, metadata?: any) => globalLogger.fatal(message, error, metadata);