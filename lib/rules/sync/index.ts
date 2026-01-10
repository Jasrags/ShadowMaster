/**
 * System Synchronization Module
 *
 * This module provides the complete synchronization infrastructure for
 * managing character-ruleset version alignment. It includes drift detection,
 * legality validation, migration planning, and audit trails.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-004 (Hybrid Snapshot Model)
 */

// Drift Analysis
export {
  analyzeCharacterDrift,
  analyzeMetatypeDrift,
  analyzeSkillDrift,
  analyzeQualityDrift,
  classifyDriftSeverity,
  isAutoResolvable,
} from "./drift-analyzer";

// Legality Validation
export {
  validateRulesLegality,
  canParticipateInEncounter,
  getLegalityShield,
  getQuickSyncStatus,
  getQuickLegalityStatus,
} from "./legality-validator";
export type {
  LegalityValidationResult,
  LegalityViolation,
  ViolationType,
  EncounterEligibility,
} from "./legality-validator";

// Migration Engine
export {
  generateMigrationPlan,
  validateMigrationPlan,
  executeMigration,
  createMigrationAuditEntry,
  hasPendingMigration,
  getPendingDecisionCount,
  getPendingSteps,
  updatePlanWithSelection,
  createRemovalOptions,
} from "./migration-engine";
export type { ValidationResult, UserSelection } from "./migration-engine";

// Sync Audit Trail
export {
  createSyncAuditEntry,
  recordDriftDetection,
  recordMigrationStart,
  recordMigrationComplete,
  recordMigrationRollback,
  recordLegalityChange,
  recordManualResync,
  getSyncAuditSummary,
  getRecentSyncEvents,
  formatSyncEvent,
} from "./sync-audit";
export type { CreateAuditEntryOptions, AuditQueryOptions, SyncAuditSummary } from "./sync-audit";

// React Hooks (client-side only)
// Note: These are re-exported from a separate hooks file
// to maintain server/client separation
