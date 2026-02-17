/**
 * Sovereignty Module - Binary decision engine and Google Workspace sovereignty integration
 * 
 * Core components for implementing sovereignty validation in SUPER CENTAUR ecosystem.
 * All sovereignty decisions reduce to binary YES/NO checks with clear reasoning.
 */

export { SovereigntyValidator } from './SovereigntyValidator';
export { SovereignGoogleDriveManager } from './SovereignGoogleDriveManager';
export { DigitalSelfCoreManager, digitalSelfCoreManager, type GroundingCheckResult, type GroundingPhaseResult, type SovereignOperatorStatus } from './DigitalSelfCoreWrapper';
export type {
  BinaryDecision,
  DecisionAudit,
  ValidationRequest,
  ValidationResult
} from './SovereigntyValidator';
export type {
  SovereignImportResult,
  SovereigntyStatus
} from './SovereignGoogleDriveManager';
