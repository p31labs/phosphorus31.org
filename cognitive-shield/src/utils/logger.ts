/**
 * Simple logger for The Buffer
 */

export class Logger {
  constructor(private context: string) {}

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const context = `[${this.context}]`;
    const levelStr = `[${level}]`;
    return `${timestamp} ${context} ${levelStr} ${message}`;
  }

  info(message: string, ...args: unknown[]): void {
    console.log(this.formatMessage('INFO', message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('WARN', message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('ERROR', message), ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
}
