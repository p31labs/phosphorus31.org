/**
 * The Buffer - P31 Communication Processing Layer
 * 
 * Buffers messages between internal thought and external signal.
 * Neurodivergent-first message processing with batching and priority queues.
 */

import 'dotenv/config';
import { BufferServer } from './server';
import { Logger } from './utils/logger';

const logger = new Logger('The Buffer');

async function main() {
  try {
    logger.info('🛡️ Starting The Buffer - P31 Communication Processing');
    logger.info('💜 Neurodivergent-first message buffering');
    logger.info('🔺 The Mesh Holds');
    
    const server = new BufferServer();
    await server.start();
    
    logger.info('🚀 The Buffer is now running!');
    logger.info('📍 API: http://localhost:4000');
    logger.info('📍 Health: http://localhost:4000/health');
    
    // Graceful shutdown
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
    logger.error('💥 Failed to start The Buffer:', error);
    process.exit(1);
  }
}

main().catch(console.error);
