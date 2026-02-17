/**
 * Swarm CLI Utility
 * 
 * Provides command-line interface for interacting with the swarm system.
 */

import * as minimist from 'minimist';
import * as chalk from 'chalk';
import * as ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface CLIOptions {
  command: string;
  mode?: string;
  agent?: string;
  factor?: number;
  config?: string;
  verbose?: boolean;
  help?: boolean;
  version?: boolean;
  daemon?: boolean;
  dryRun?: boolean;
}

export class SwarmCLI {
  private commands: Map<string, (options: CLIOptions) => Promise<void>> = new Map();

  constructor() {
    this.setupCommands();
  }

  /**
   * Parse command line arguments
   */
  public parseArgs(args: string[]): CLIOptions {
    const parsed = minimist(args, {
      alias: {
        h: 'help',
        v: 'version',
        c: 'config',
        a: 'agent',
        f: 'factor',
        d: 'daemon',
        n: 'dry-run',
        V: 'verbose'
      },
      boolean: ['help', 'version', 'daemon', 'dry-run', 'verbose'],
      string: ['config', 'agent'],
      number: ['factor']
    });

    return {
      command: parsed._[0] || 'help',
      mode: parsed.mode || parsed._[1],
      agent: parsed.agent,
      factor: parsed.factor,
      config: parsed.config,
      verbose: parsed.verbose,
      help: parsed.help,
      version: parsed.version,
      daemon: parsed.daemon,
      dryRun: parsed['dry-run']
    };
  }

  /**
   * Execute CLI command
   */
  public async execute(options: CLIOptions): Promise<void> {
    if (options.help) {
      this.showHelp();
      return;
    }

    if (options.version) {
      this.showVersion();
      return;
    }

    const command = this.commands.get(options.command);
    if (!command) {
      console.error(chalk.red(`Unknown command: ${options.command}`));
      this.showHelp();
      process.exit(1);
    }

    try {
      await command(options);
    } catch (error) {
      console.error(chalk.red('Error executing command:'), error);
      process.exit(1);
    }
  }

  /**
   * Show help information
   */
  public showHelp(): void {
    console.log(chalk.cyan.bold('Project Swarm Intelligence CLI'));
    console.log('');
    console.log(chalk.yellow('Usage:'));
    console.log('  swarm <command> [options]');
    console.log('');
    console.log(chalk.yellow('Commands:'));
    console.log('  start [mode]     Start the swarm in specified mode');
    console.log('  stop             Stop the swarm');
    console.log('  status           Show swarm status');
    console.log('  execute <agent>  Execute a specific agent');
    console.log('  scale <factor>   Scale the swarm by factor');
    console.log('  emergency        Emergency shutdown');
    console.log('');
    console.log(chalk.yellow('Modes:'));
    console.log('  swarm            Full swarm mode (default)');
    console.log('  daemon           Background daemon mode');
    console.log('  scan             Scan-only mode');
    console.log('  analyze          Analysis-only mode');
    console.log('  organize         Organization-only mode');
    console.log('  update           Update-only mode');
    console.log('  repair           Repair-only mode');
    console.log('');
    console.log(chalk.yellow('Options:'));
    console.log('  -h, --help       Show help information');
    console.log('  -v, --version    Show version information');
    console.log('  -c, --config     Specify config file path');
    console.log('  -a, --agent      Specify agent name');
    console.log('  -f, --factor     Specify scale factor');
    console.log('  -d, --daemon     Run in daemon mode');
    console.log('  -n, --dry-run    Dry run mode');
    console.log('  -V, --verbose    Verbose output');
    console.log('');
    console.log(chalk.yellow('Examples:'));
    console.log('  swarm start swarm');
    console.log('  swarm start daemon');
    console.log('  swarm execute file-system-monitor');
    console.log('  swarm scale 2.0');
    console.log('  swarm status');
  }

  /**
   * Show version information
   */
  public showVersion(): void {
    const packageJson = require('../../package.json');
    console.log(chalk.cyan.bold(`Swarm CLI v${packageJson.version}`));
    console.log(chalk.gray('Project Swarm Intelligence'));
  }

  /**
   * Setup command handlers
   */
  private setupCommands(): void {
    this.commands.set('start', this.handleStart.bind(this));
    this.commands.set('stop', this.handleStop.bind(this));
    this.commands.set('status', this.handleStatus.bind(this));
    this.commands.set('execute', this.handleExecute.bind(this));
    this.commands.set('scale', this.handleScale.bind(this));
    this.commands.set('emergency', this.handleEmergency.bind(this));
  }

  /**
   * Handle start command
   */
  private async handleStart(options: CLIOptions): Promise<void> {
    const mode = options.mode || 'swarm';
    const spinner = ora(`Starting swarm in ${mode} mode...`).start();

    try {
      // Import and start swarm
      const { ProjectSwarmIntelligence } = await import('../index');
      const swarm = new ProjectSwarmIntelligence();
      
      await swarm.initialize();
      await swarm.start(mode as any);
      
      spinner.succeed(`Swarm started in ${mode} mode`);
      
      // Keep process alive
      process.on('SIGINT', async () => {
        spinner.info('Shutting down swarm...');
        await swarm.stop();
        process.exit(0);
      });

    } catch (error) {
      spinner.fail('Failed to start swarm');
      throw error;
    }
  }

  /**
   * Handle stop command
   */
  private async handleStop(options: CLIOptions): Promise<void> {
    const spinner = ora('Stopping swarm...').start();

    try {
      const { ProjectSwarmIntelligence } = await import('../index');
      const swarm = new ProjectSwarmIntelligence();
      
      await swarm.initialize();
      await swarm.stop();
      
      spinner.succeed('Swarm stopped');
      
    } catch (error) {
      spinner.fail('Failed to stop swarm');
      throw error;
    }
  }

  /**
   * Handle status command
   */
  private async handleStatus(options: CLIOptions): Promise<void> {
    const spinner = ora('Getting swarm status...').start();

    try {
      const { ProjectSwarmIntelligence } = await import('../index');
      const swarm = new ProjectSwarmIntelligence();
      
      await swarm.initialize();
      const status = swarm.getSwarmStatus();
      
      spinner.stop();
      this.displayStatus(status);
      
    } catch (error) {
      spinner.fail('Failed to get swarm status');
      throw error;
    }
  }

  /**
   * Handle execute command
   */
  private async handleExecute(options: CLIOptions): Promise<void> {
    if (!options.agent) {
      console.error(chalk.red('Agent name required'));
      this.showHelp();
      return;
    }

    const spinner = ora(`Executing agent: ${options.agent}`).start();

    try {
      const { ProjectSwarmIntelligence } = await import('../index');
      const swarm = new ProjectSwarmIntelligence();
      
      await swarm.initialize();
      const result = await swarm.executeAgent(options.agent, options);
      
      spinner.succeed(`Agent ${options.agent} completed`);
      console.log(chalk.cyan('Result:'), JSON.stringify(result, null, 2));
      
    } catch (error) {
      spinner.fail(`Failed to execute agent ${options.agent}`);
      throw error;
    }
  }

  /**
   * Handle scale command
   */
  private async handleScale(options: CLIOptions): Promise<void> {
    if (!options.factor) {
      console.error(chalk.red('Scale factor required'));
      this.showHelp();
      return;
    }

    const spinner = ora(`Scaling swarm by factor: ${options.factor}`).start();

    try {
      const { ProjectSwarmIntelligence } = await import('../index');
      const swarm = new ProjectSwarmIntelligence();
      
      await swarm.initialize();
      await swarm.scaleSwarm(options.factor);
      
      spinner.succeed(`Swarm scaled by factor: ${options.factor}`);
      
    } catch (error) {
      spinner.fail('Failed to scale swarm');
      throw error;
    }
  }

  /**
   * Handle emergency command
   */
  private async handleEmergency(options: CLIOptions): Promise<void> {
    const spinner = ora('Initiating emergency shutdown...').start();

    try {
      const { ProjectSwarmIntelligence } = await import('../index');
      const swarm = new ProjectSwarmIntelligence();
      
      await swarm.initialize();
      await swarm.emergencyShutdown();
      
      spinner.succeed('Emergency shutdown completed');
      
    } catch (error) {
      spinner.fail('Emergency shutdown failed');
      throw error;
    }
  }

  /**
   * Display swarm status
   */
  private displayStatus(status: any): void {
    console.log(chalk.cyan.bold('Swarm Status'));
    console.log('');

    console.log(chalk.yellow('General:'));
    console.log(`  Running: ${status.running ? chalk.green('Yes') : chalk.red('No')}`);
    console.log(`  Timestamp: ${status.timestamp}`);
    console.log('');

    console.log(chalk.yellow('Agents:'));
    Object.entries(status.agents).forEach(([name, agentStatus]: [string, any]) => {
      const statusColor = agentStatus.status === 'running' ? chalk.green : chalk.yellow;
      console.log(`  ${name}: ${statusColor(agentStatus.status)}`);
      console.log(`    Last Update: ${agentStatus.lastUpdate}`);
      console.log(`    Metrics: ${JSON.stringify(agentStatus.metrics)}`);
    });
    console.log('');

    console.log(chalk.yellow('Metrics:'));
    console.log(`  CPU: ${status.metrics?.cpu || 'N/A'}%`);
    console.log(`  Memory: ${status.metrics?.memory || 'N/A'}%`);
    console.log(`  Disk: ${status.metrics?.disk || 'N/A'}%`);
    console.log('');

    console.log(chalk.yellow('Health:'));
    console.log(`  Healthy Agents: ${status.health?.healthyAgents || 'N/A'}`);
    console.log(`  Total Agents: ${status.health?.totalAgents || 'N/A'}`);
    console.log(`  Active Tasks: ${status.health?.activeTasks || 'N/A'}`);
  }

  /**
   * Validate options
   */
  private validateOptions(options: CLIOptions): void {
    if (options.config && !fs.existsSync(options.config)) {
      throw new Error(`Config file not found: ${options.config}`);
    }

    if (options.factor && (options.factor <= 0 || options.factor > 10)) {
      throw new Error('Scale factor must be between 0 and 10');
    }
  }
}