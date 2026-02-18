/**
 * P31 Language Module
 * Domain-specific language for P31 ecosystem
 * 
 * "Synergize x infinity"
 * The complete P31 language system - architecture and execution unified.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

// System Definition Language (Architecture)
export { P31LanguageParser } from './P31LanguageParser';
export type { P31AST, P31System } from './P31LanguageParser';
export { P31LanguageInterpreter } from './P31LanguageInterpreter';
export type { P31Runtime } from './P31LanguageInterpreter';

// Bridge (Synergy)
export { P31LanguageBridge } from './P31LanguageBridge';
export type { SynergizedP31Context } from './P31LanguageBridge';
