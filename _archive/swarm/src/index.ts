/**
 * Project Swarm Intelligence
 * 
 * Main entry point for the swarm system.
 */

export { ProjectSwarmIntelligence } from './core/swarm-orchestrator';
export { AgentRegistry } from './core/agent-registry';
export { FileMonitorAgent } from './agents/file-system-monitor';
export { ProjectAnalyzerAgent } from './agents/project-analyzer';
export { ResearchAgent } from './agents/research-agent';
export { UpdateAgent } from './agents/update-agent';
export { RepairAgent } from './agents/repair-agent';
export { OrganizationAgent } from './agents/organization-agent';
export { SwarmCLI } from './utils/swarm-cli';
export { Logger } from './utils/logger';

// Re-export types
export * from './types/agent-types';
export * from './types/file-system-types';
export * from './types/analysis-types';
export * from './config/swarm-config';

// Default export
export { ProjectSwarmIntelligence as default } from './core/swarm-orchestrator';