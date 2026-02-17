/**
 * Enhanced Logger for SUPER CENTAUR
 * Combines logging capabilities from both Digital Centaur and Sovereign Agent
 */

import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  module: string;
  message: string;
  data?: any;
}

export class Logger {
  private module: string;
  private logFile: string;
  private logDir: string;
  private logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' = 'INFO';

  constructor(module: string) {
    this.module = module;
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, `${module.toLowerCase()}.log`);
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string, data?: any): { consoleMessage: string; fileMessage: string } {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level: level as any,
      module: this.module,
      message,
      data
    };

    // Console output with colors
    const color = this.getColor(level);
    const serialized = data instanceof Error
      ? `${data.message}\n${data.stack || ''}`
      : data ? JSON.stringify(data, null, 2) : '';
    const consoleMessage = `${color}[${timestamp}] [${level}] [${this.module}] ${message}${serialized ? `\n${serialized}` : ''}\x1b[0m`;
    
    // File output
    const fileMessage = JSON.stringify(logEntry);

    return { consoleMessage, fileMessage };
  }

  private getColor(level: string): string {
    switch (level) {
      case 'DEBUG': return '\x1b[36m'; // Cyan
      case 'INFO': return '\x1b[32m';  // Green
      case 'WARN': return '\x1b[33m';  // Yellow
      case 'ERROR': return '\x1b[31m'; // Red
      default: return '\x1b[0m';
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private writeToFile(message: string) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('DEBUG')) {
      const { consoleMessage, fileMessage } = this.formatMessage('DEBUG', message, data);
      console.log(consoleMessage);
      this.writeToFile(fileMessage);
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('INFO')) {
      const { consoleMessage, fileMessage } = this.formatMessage('INFO', message, data);
      console.log(consoleMessage);
      this.writeToFile(fileMessage);
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('WARN')) {
      const { consoleMessage, fileMessage } = this.formatMessage('WARN', message, data);
      console.warn(consoleMessage);
      this.writeToFile(fileMessage);
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog('ERROR')) {
      const { consoleMessage, fileMessage } = this.formatMessage('ERROR', message, data);
      console.error(consoleMessage);
      this.writeToFile(fileMessage);
    }
  }

  setLogLevel(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR') {
    this.logLevel = level;
  }

  getLogFile(): string {
    return this.logFile;
  }
}