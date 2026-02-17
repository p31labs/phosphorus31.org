/**
 * God Configuration - Re-export from config directory
 * This file re-exports the canonical god.config from src/config/
 * to maintain backward compatibility with imports from '@/god.config'
 */

export * from './config/god.config';
export { default } from './config/god.config';
