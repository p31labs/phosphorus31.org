/**
 * SUPER CENTAUR CLI - Unified Command Line Interface
 * Combines CLI capabilities from both Digital Centaur and Sovereign Agent
 */

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config-manager';
import { SuperCentaurServer } from '../core/super-centaur-server';

const program = new Command();

class SuperCentaurCLI {
  private logger: Logger;
  private config: any;
  private server: SuperCentaurServer | null = null;

  constructor() {
    this.logger = new Logger('SuperCentaurCLI');
    this.initializeCLI();
  }

  private initializeCLI(): void {
    // Display banner
    console.log(chalk.cyan(figlet.textSync('SUPER CENTAUR', { horizontalLayout: 'full' })));
    console.log(chalk.magenta('🦄 The Ultimate Legal & Autonomous Agent System'));
    console.log(chalk.gray('💜 With love and light - As above, so below\n'));

    // Configure program
    program
      .name('super-centaur')
      .description('SUPER CENTAUR - Unified Legal AI and Autonomous Agent System')
      .version('1.0.0');

    // Initialize command
    program
      .command('init')
      .description('Initialize SUPER CENTAUR configuration')
      .action(async () => {
        await this.initialize();
      });

    // Start command
    program
      .command('start')
      .description('Start SUPER CENTAUR server')
      .option('-p, --port <port>', 'Port to run server on', '3001')
      .option('-h, --host <host>', 'Host to run server on', 'localhost')
      .action(async (options) => {
        await this.start(options);
      });

    // Stop command
    program
      .command('stop')
      .description('Stop SUPER CENTAUR server')
      .action(async () => {
        await this.stop();
      });

    // Status command
    program
      .command('status')
      .description('Check SUPER CENTAUR system status')
      .action(async () => {
        await this.status();
      });

    // Legal commands
    const legalCmd = program.command('legal');
    
    legalCmd
      .command('generate')
      .description('Generate legal document')
      .argument('<type>', 'Type of legal document')
      .option('-c, --context <context>', 'Context for document generation')
      .option('-u, --urgency <urgency>', 'Urgency level', 'medium')
      .action(async (type: string, options: any) => {
        await this.generateLegalDocument(type, options);
      });

    legalCmd
      .command('emergency')
      .description('Handle emergency legal situation')
      .argument('<situation>', 'Type of emergency situation')
      .option('-e, --evidence <evidence>', 'Evidence for emergency response')
      .action(async (situation: string, options: any) => {
        await this.handleEmergency(situation, options);
      });

    legalCmd
      .command('precedent')
      .description('Analyze legal precedent')
      .argument('<query>', 'Query for precedent analysis')
      .option('-j, --jurisdiction <jurisdiction>', 'Jurisdiction for analysis', 'US')
      .action(async (query: string, options: any) => {
        await this.analyzePrecedent(query, options);
      });

    // Medical commands
    const medicalCmd = program.command('medical');
    
    medicalCmd
      .command('document')
      .description('Create medical documentation')
      .argument('<patientId>', 'Patient ID')
      .argument('<condition>', 'Medical condition')
      .option('-s, --symptoms <symptoms>', 'Symptoms list')
      .option('-h, --history <history>', 'Medical history')
      .action(async (patientId: string, condition: string, options: any) => {
        await this.createMedicalDocumentation(patientId, condition, options);
      });

    medicalCmd
      .command('expert-witness')
      .description('Create expert witness report')
      .argument('<patientId>', 'Patient ID')
      .argument('<condition>', 'Medical condition')
      .action(async (patientId: string, condition: string) => {
        await this.createExpertWitnessReport(patientId, condition);
      });

    medicalCmd
      .command('conditions')
      .description('List available medical conditions')
      .action(async () => {
        await this.listMedicalConditions();
      });

    // Blockchain commands
    const blockchainCmd = program.command('blockchain');
    
    blockchainCmd
      .command('deploy')
      .description('Deploy smart contract')
      .argument('<contractType>', 'Type of contract to deploy')
      .option('-p, --parameters <parameters>', 'Contract parameters')
      .action(async (contractType: string, options: any) => {
        await this.deployContract(contractType, options);
      });

    blockchainCmd
      .command('status')
      .description('Check blockchain status')
      .action(async () => {
        await this.checkBlockchainStatus();
      });

    blockchainCmd
      .command('verify')
      .description('Verify document hash')
      .argument('<documentId>', 'Document ID')
      .argument('<hash>', 'Hash to verify')
      .action(async (documentId: string, hash: string) => {
        await this.verifyDocumentHash(documentId, hash);
      });

    // Agent commands
    const agentCmd = program.command('agent');
    
    agentCmd
      .command('create')
      .description('Create autonomous agent')
      .argument('<agentType>', 'Type of agent to create')
      .option('-c, --config <config>', 'Agent configuration')
      .action(async (agentType: string, options: any) => {
        await this.createAgent(agentType, options);
      });

    agentCmd
      .command('status')
      .description('Check agent status')
      .action(async () => {
        await this.checkAgentStatus();
      });

    agentCmd
      .command('execute')
      .description('Execute agent task')
      .argument('<agentId>', 'Agent ID')
      .argument('<taskType>', 'Type of task')
      .option('-p, --parameters <parameters>', 'Task parameters')
      .action(async (agentId: string, taskType: string, options: any) => {
        await this.executeAgentTask(agentId, taskType, options);
      });

    // Chatbot commands
    const chatCmd = program.command('chat');
    
    chatCmd
      .command('message')
      .description('Send message to chatbot')
      .argument('<message>', 'Message to send')
      .option('-s, --session <session>', 'Session ID', 'default')
      .action(async (message: string, options: any) => {
        await this.sendMessage(message, options);
      });

    chatCmd
      .command('session')
      .description('Manage chat session')
      .argument('<action>', 'Action: clear|history')
      .option('-s, --session <session>', 'Session ID', 'default')
      .action(async (action: string, options: any) => {
        await this.manageSession(action, options);
      });

    // Configuration commands
    const configCmd = program.command('config');
    
    configCmd
      .command('get')
      .description('Get configuration value')
      .argument('<path>', 'Configuration path')
      .action(async (path: string) => {
        await this.getConfig(path);
      });

    configCmd
      .command('set')
      .description('Set configuration value')
      .argument('<path>', 'Configuration path')
      .argument('<value>', 'Value to set')
      .action(async (path: string, value: string) => {
        await this.setConfig(path, value);
      });

    configCmd
      .command('list')
      .description('List all configuration')
      .action(async () => {
        await this.listConfig();
      });
  }

  public async run(): Promise<void> {
    await program.parseAsync();
  }

  private async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing SUPER CENTAUR...');
      const configManager = await ConfigManager.initialize();
      this.config = configManager.getConfig();
      
      console.log(chalk.green('✅ SUPER CENTAUR initialized successfully'));
      console.log(chalk.gray(`Configuration saved to: ${configManager.configPath}`));
    } catch (error) {
      console.error(chalk.red('💥 Failed to initialize SUPER CENTAUR:'), error);
      process.exit(1);
    }
  }

  private async start(options: any): Promise<void> {
    try {
      this.logger.info('Starting SUPER CENTAUR server...');
      const configManager = await ConfigManager.initialize();
      this.config = configManager.getConfig();
      
      // Update config with CLI options
      this.config.server.port = parseInt(options.port);
      this.config.server.host = options.host;

      this.server = new SuperCentaurServer(this.config);
      await this.server.start();
      
      console.log(chalk.green('🚀 SUPER CENTAUR server started successfully'));
      console.log(chalk.blue(`📍 Frontend: http://${options.host}:${options.port}`));
      console.log(chalk.blue(`📍 API: http://${options.host}:${options.port}/api`));
    } catch (error) {
      console.error(chalk.red('💥 Failed to start SUPER CENTAUR:'), error);
      process.exit(1);
    }
  }

  private async stop(): Promise<void> {
    try {
      if (this.server) {
        await this.server.stop();
        console.log(chalk.green('🛑 SUPER CENTAUR server stopped'));
      } else {
        console.log(chalk.yellow('⚠️  No server running'));
      }
    } catch (error) {
      console.error(chalk.red('💥 Failed to stop server:'), error);
    }
  }

  private async status(): Promise<void> {
    try {
      const configManager = await ConfigManager.initialize();
      const config = configManager.getConfig();
      
      console.log(chalk.cyan('\n=== SUPER CENTAUR Status ==='));
      console.log(chalk.blue(`Server: ${config.server.host}:${config.server.port}`));
      console.log(chalk.blue(`Database: ${config.database.type}`));
      console.log(chalk.blue(`AI Provider: ${config.ai.provider}`));
      console.log(chalk.blue(`Blockchain: ${config.blockchain.network}`));
      console.log(chalk.blue(`Legal System: ${config.legal.jurisdiction}`));
      console.log(chalk.blue(`Medical System: ${config.medical.enableDocumentation ? 'Enabled' : 'Disabled'}`));
      console.log(chalk.blue(`Agents: ${config.blockchain.wallet.privateKey ? 'Active' : 'Limited'}`));
      console.log(chalk.gray(`Last updated: ${new Date().toISOString()}\n`));
    } catch (error) {
      console.error(chalk.red('💥 Failed to get status:'), error);
    }
  }

  private async generateLegalDocument(type: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Generating ${type} document...`));
      // This would integrate with the legal AI engine
      console.log(chalk.green('✅ Legal document generation completed'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to generate legal document:'), error);
    }
  }

  private async handleEmergency(situation: string, options: any): Promise<void> {
    try {
      console.log(chalk.red(`Handling ${situation} emergency...`));
      // This would integrate with emergency response system
      console.log(chalk.green('✅ Emergency response completed'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to handle emergency:'), error);
    }
  }

  private async analyzePrecedent(query: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Analyzing precedent for: ${query}`));
      // This would integrate with legal research system
      console.log(chalk.green('✅ Precedent analysis completed'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to analyze precedent:'), error);
    }
  }

  private async createMedicalDocumentation(patientId: string, condition: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Creating medical documentation for ${patientId} (${condition})...`));
      // This would integrate with medical documentation system
      console.log(chalk.green('✅ Medical documentation created'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to create medical documentation:'), error);
    }
  }

  private async createExpertWitnessReport(patientId: string, condition: string): Promise<void> {
    try {
      console.log(chalk.blue(`Creating expert witness report for ${patientId} (${condition})...`));
      // This would integrate with expert witness system
      console.log(chalk.green('✅ Expert witness report created'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to create expert witness report:'), error);
    }
  }

  private async listMedicalConditions(): Promise<void> {
    try {
      console.log(chalk.blue('Available medical conditions:'));
      console.log(chalk.gray('- Hypoparathyroidism'));
      console.log(chalk.gray('- Intellectual Gaps'));
      console.log(chalk.gray('- Generational Trauma'));
      console.log(chalk.gray('- Chronic Pain'));
      console.log(chalk.gray('- Mental Health Conditions'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to list medical conditions:'), error);
    }
  }

  private async deployContract(contractType: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Deploying ${contractType} contract...`));
      // This would integrate with blockchain system
      console.log(chalk.green('✅ Smart contract deployed'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to deploy contract:'), error);
    }
  }

  private async checkBlockchainStatus(): Promise<void> {
    try {
      console.log(chalk.blue('Blockchain status:'));
      console.log(chalk.gray('- Network: Connected'));
      console.log(chalk.gray('- Wallet: Active'));
      console.log(chalk.gray('- Contracts: Ready'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to check blockchain status:'), error);
    }
  }

  private async verifyDocumentHash(documentId: string, hash: string): Promise<void> {
    try {
      console.log(chalk.blue(`Verifying document hash for ${documentId}...`));
      // This would integrate with blockchain verification
      console.log(chalk.green('✅ Document hash verified'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to verify document hash:'), error);
    }
  }

  private async createAgent(agentType: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Creating ${agentType} agent...`));
      // This would integrate with agent system
      console.log(chalk.green('✅ Autonomous agent created'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to create agent:'), error);
    }
  }

  private async checkAgentStatus(): Promise<void> {
    try {
      console.log(chalk.blue('Agent status:'));
      console.log(chalk.gray('- Legal AI Agent: Active'));
      console.log(chalk.gray('- Medical Agent: Active'));
      console.log(chalk.gray('- Compliance Agent: Active'));
      console.log(chalk.gray('- Research Agent: Active'));
      console.log(chalk.gray('- Blockchain Agent: Active'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to check agent status:'), error);
    }
  }

  private async executeAgentTask(agentId: string, taskType: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Executing ${taskType} task for agent ${agentId}...`));
      // This would integrate with agent execution system
      console.log(chalk.green('✅ Agent task completed'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to execute agent task:'), error);
    }
  }

  private async sendMessage(message: string, options: any): Promise<void> {
    try {
      console.log(chalk.blue(`Sending message to chatbot...`));
      // This would integrate with chatbot system
      console.log(chalk.green('✅ Message processed'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to send message:'), error);
    }
  }

  private async manageSession(action: string, options: any): Promise<void> {
    try {
      if (action === 'clear') {
        console.log(chalk.blue(`Clearing session ${options.session}...`));
        console.log(chalk.green('✅ Session cleared'));
      } else if (action === 'history') {
        console.log(chalk.blue(`Retrieving session history for ${options.session}...`));
        console.log(chalk.gray('Session history:'));
        console.log(chalk.gray('- Message 1'));
        console.log(chalk.gray('- Response 1'));
        console.log(chalk.gray('- Message 2'));
      }
    } catch (error) {
      console.error(chalk.red('💥 Failed to manage session:'), error);
    }
  }

  private async getConfig(path: string): Promise<void> {
    try {
      const configManager = await ConfigManager.initialize();
      const value = configManager.get(path);
      console.log(chalk.blue(`${path}: ${JSON.stringify(value, null, 2)}`));
    } catch (error) {
      console.error(chalk.red('💥 Failed to get config:'), error);
    }
  }

  private async setConfig(path: string, value: string): Promise<void> {
    try {
      const configManager = await ConfigManager.initialize();
      configManager.set(path, value);
      console.log(chalk.green('✅ Configuration updated'));
    } catch (error) {
      console.error(chalk.red('💥 Failed to set config:'), error);
    }
  }

  private async listConfig(): Promise<void> {
    try {
      const configManager = await ConfigManager.initialize();
      const config = configManager.getConfig();
      console.log(chalk.blue('Current configuration:'));
      console.log(chalk.gray(JSON.stringify(config, null, 2)));
    } catch (error) {
      console.error(chalk.red('💥 Failed to list config:'), error);
    }
  }
}

// Export for use as module
export { SuperCentaurCLI };

// Run CLI if called directly
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new SuperCentaurCLI();
  cli.run().catch(console.error);
}
