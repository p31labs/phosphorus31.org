/**
 * SUPER CENTAUR - Merged Digital Centaur Legal Architect + Sovereign Agent Core
 * 
 * This is the main entry point for the SUPER CENTAUR system, combining:
 * - Legal AI and medical documentation from Digital Centaur
 * - Autonomous agents and blockchain features from Sovereign Agent
 * - Smart chatbot functionality
 * - Unified CLI and frontend interfaces
 */

import 'dotenv/config';
import { SuperCentaurServer } from './core/super-centaur-server';
import { Logger } from './utils/logger';
import { ConfigManager } from './core/config-manager';

const logger = new Logger('SUPER-CENTAUR');

async function main() {
  try {
    logger.info('🦄 Starting SUPER CENTAUR - The Ultimate Legal & Autonomous Agent System');
    logger.info('💜 With love and light - As above, so below');
    
    // Initialize configuration
    const config = await ConfigManager.initialize();
    logger.info(`Configuration loaded from: ${config.configPath}`);
    
    // Start the unified server
    const server = new SuperCentaurServer(config.getConfig());
    await server.start();
    
    logger.info('🚀 SUPER CENTAUR is now running!');
    logger.info('📍 Frontend: http://localhost:3000');
    logger.info('📍 API: http://localhost:3001');
    logger.info('📍 CLI: npm run cli');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('🛑 Received SIGINT, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      logger.info('🛑 Received SIGTERM, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('💥 Failed to start SUPER CENTAUR:', error);
    process.exit(1);
  }
}

// Start the application
main().catch(console.error);

export { SuperCentaurServer } from './core/super-centaur-server';
export { Logger } from './utils/logger';
export { ConfigManager } from './core/config-manager';
export * from './legal';
export * from './medical';
export * from './blockchain';
export * from './cli';