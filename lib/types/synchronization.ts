/**
 * Synchronization types
 *
 * Types for the System Synchronization capability that ensures
 * character data integrity relative to its authoritative ruleset source.
 * Implements drift detection, legality validation, and migration workflows.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-004 (Hybrid Snapshot Model)
 */

import type { ID, ISODateString } from "./core";
import type { EditionCode, RuleModuleType } from "./edition";

// =============================================================================
// CORE SYNCHRONIZATION TYPES
// =============================================================================

/**
 * Data layer classification for ruleset data
 * - live: Always uses current ruleset values (flavor text, descriptions)
 * - snapshot: Captured at character creation, protected from changes
 * - delta: Character-specific overrides that persist across syncs
 */
export type DataLayerType = "live" | "snapshot" | "delta";

/**
 * Severity of detected drift between character and ruleset
 * - none: Character fully synchronized with ruleset
 * - non-breaking: Additive or flavor-only changes, safe to auto-apply
 * - breaking: Mechanical changes requiring user intervention
 */
export type DriftSeverity = "none" | "non-breaking" | "breaking";

/**
 * Current synchronization status of a character
 * - synchronized: Character matches current ruleset version
 * - outdated: Non-breaking changes available for sync
 * - invalid: Breaking changes require reconciliation before gameplay
 * - migrating: Active migration in progress (transient state)
 */
export type SyncStatus = "synchronized" | "outdated" | "invalid" | "migrating";

/**
 * Rules compliance status for gameplay eligibility
 * - rules-legal: Fully compliant with locked ruleset version
 * - draft: Editable but not gameplay-ready (user override)
 * - invalid: Requires reconciliation before gameplay
 * - legacy: Locked to obsolete ruleset version (no migration path)
 */
export type LegalityStatus = "rules-legal" | "draft" | "invalid" | "legacy";

// =============================================================================
// VERSION TRACKING
// =============================================================================

/**
 * Complete version reference for a ruleset configuration
 * Captures the exact state of all rule sources at a point in time
 */
export interface RulesetVersionRef {
  /** Edition code (e.g., "sr5") */
  editionCode: EditionCode;
  /** Edition version string (semver format) */
  editionVersion: string;
  /** Map of book IDs to their version strings */
  bookVersions: Record<ID, string>;
  /** Unique identifier for the ruleset snapshot */
  snapshotId: ID;
  /** When this version reference was created */
  createdAt: ISODateString;
}

// =============================================================================
// DRIFT DETECTION
// =============================================================================

/**
 * Complete drift analysis report for a character
 * Generated when checking character against current ruleset
 */
export interface DriftReport {
  /** Unique report identifier */
  id: ID;
  /** Character this report applies to */
  characterId: ID;
  /** When the report was generated */
  generatedAt: ISODateString;
  /** Character's current ruleset version */
  currentVersion: RulesetVersionRef;
  /** Target ruleset version being compared against */
  targetVersion: RulesetVersionRef;
  /** Overall severity (highest among all changes) */
  overallSeverity: DriftSeverity;
  /** Individual detected changes */
  changes: DriftChange[];
  /** Recommended migration actions */
  recommendations: MigrationRecommendation[];
}

/**
 * A single detected change between ruleset versions
 */
export interface DriftChange {
  /** Unique change identifier */
  id: ID;
  /** Which rule module is affected */
  module: RuleModuleType;
  /** Type of change detected */
  changeType: DriftChangeType;
  /** Severity classification */
  severity: DriftSeverity;
  /** Items affected by this change */
  affectedItems: AffectedItem[];
  /** Human-readable description of the change */
  description: string;
}

/**
 * Classification of ruleset changes
 * - added: New items available (non-breaking)
 * - removed: Items no longer exist (breaking)
 * - renamed: Identifier changed (breaking)
 * - modified: Mechanical values changed (severity varies)
 * - restructured: Schema/structure changed (breaking)
 * - deprecated: Still works but will be removed (warning)
 */
export type DriftChangeType =
  | "added"
  | "removed"
  | "renamed"
  | "modified"
  | "restructured"
  | "deprecated";

/**
 * An item affected by a ruleset change
 */
export interface AffectedItem {
  /** Item identifier */
  itemId: ID;
  /** Item type (e.g., "skill", "quality", "metatype") */
  itemType: string;
  /** Value in character's snapshot (undefined if new) */
  previousValue?: unknown;
  /** Value in current ruleset (undefined if removed) */
  currentValue?: unknown;
  /** How this item is used on the character */
  characterUsage?: CharacterUsageContext[];
}

/**
 * Context of how an affected item is used on a character
 */
export interface CharacterUsageContext {
  /** Character field using this item (e.g., "positiveQualities", "skills") */
  field: string;
  /** JSON path to affected data within the field */
  path: string;
  /** Current value in the character data */
  currentValue: unknown;
}

// =============================================================================
// MIGRATION SYSTEM
// =============================================================================

/**
 * Recommended action for handling a drift change
 */
export interface MigrationRecommendation {
  /** Reference to the change this recommendation addresses */
  changeId: ID;
  /** Recommended strategy */
  strategy: MigrationStrategy;
  /** Human-readable description of the recommendation */
  description: string;
  /** Whether this can be applied automatically */
  autoApplicable: boolean;
  /** Whether user must select from options */
  requiresUserChoice: boolean;
  /** Available options if user choice required */
  options?: MigrationOption[];
}

/**
 * Strategy for handling a drift change
 * - auto-update: Safe to apply automatically
 * - manual-select: User must choose replacement
 * - archive: Move to legacy storage, preserve for reference
 * - remove: Remove from character (with karma refund if applicable)
 */
export type MigrationStrategy = "auto-update" | "manual-select" | "archive" | "remove";

/**
 * A selectable option for manual migration decisions
 */
export interface MigrationOption {
  /** Option identifier */
  id: ID;
  /** Display label */
  label: string;
  /** Detailed description of this option */
  description: string;
  /** Target item ID if replacing with another item */
  targetItemId?: ID;
  /** Karma adjustment if this option is selected */
  karmaDelta?: number;
}

/**
 * Complete migration plan ready for execution
 */
export interface MigrationPlan {
  /** Plan identifier */
  id: ID;
  /** Character being migrated */
  characterId: ID;
  /** Starting ruleset version */
  sourceVersion: RulesetVersionRef;
  /** Target ruleset version */
  targetVersion: RulesetVersionRef;
  /** Ordered steps to execute */
  steps: MigrationStep[];
  /** Whether all required choices have been made */
  isComplete: boolean;
  /** Net karma change from this migration */
  estimatedKarmaDelta: number;
}

/**
 * A single step in a migration plan
 */
export interface MigrationStep {
  /** Reference to the change being addressed */
  changeId: ID;
  /** Action to take */
  action: MigrationAction;
  /** Value before migration */
  before: unknown;
  /** Value after migration */
  after: unknown;
}

/**
 * Specific action types for migration steps
 */
export type MigrationAction =
  | "update" // Update to new value
  | "replace" // Replace with different item
  | "remove" // Remove from character
  | "archive" // Move to legacy storage
  | "adjust-karma"; // Apply karma adjustment

/**
 * Result of executing a migration
 */
export interface MigrationResult {
  /** Whether migration completed successfully */
  success: boolean;
  /** Updated character if successful */
  character?: unknown; // Character type imported separately to avoid circular deps
  /** Error message if failed */
  error?: string;
  /** Steps that were applied */
  appliedSteps: MigrationStep[];
  /** Whether rollback is available */
  rollbackAvailable: boolean;
}

/**
 * Migration that has been applied to a character
 * Stored for audit and potential rollback
 */
export interface AppliedMigration {
  /** Migration plan that was executed */
  plan: MigrationPlan;
  /** When migration was applied */
  appliedAt: ISODateString;
  /** User who initiated the migration */
  appliedBy: ID;
  /** Backup of character state before migration */
  previousState: unknown;
  /** Whether rollback is still available */
  canRollback: boolean;
}

// =============================================================================
// MECHANICAL SNAPSHOT (Character Data Layer)
// =============================================================================

/**
 * Snapshot of mechanical rule values for a character
 * Captured at creation and preserved until explicit sync
 */
export interface MechanicalSnapshot {
  /** When this snapshot was captured */
  capturedAt: ISODateString;
  /** Ruleset version this snapshot is based on */
  rulesetVersion: RulesetVersionRef;

  /** Snapshotted metatype mechanical values */
  metatype: MetatypeSnapshot;
  /** Snapshotted attribute definitions */
  attributeDefinitions: AttributeDefinitionSnapshot;
  /** Snapshotted skill definitions */
  skillDefinitions: SkillDefinitionSnapshot;
  /** Snapshotted quality definitions */
  qualityDefinitions: QualityDefinitionSnapshot;
  /** Additional module snapshots can be added as needed */
  additionalModules?: Record<RuleModuleType, unknown>;
}

/**
 * Snapshot of a character's metatype mechanical values
 */
export interface MetatypeSnapshot {
  /** Metatype identifier */
  id: ID;
  /** Attribute modifiers from metatype */
  attributeModifiers: Record<string, number>;
  /** Special abilities granted by metatype */
  specialAbilities: string[];
  /** Racial qualities from metatype */
  racialQualities: string[];
}

/**
 * Snapshot of attribute definitions relevant to character
 */
export interface AttributeDefinitionSnapshot {
  /** Map of attribute code to definition snapshot */
  attributes: Record<string, AttributeSnapshot>;
}

/**
 * Snapshot of a single attribute definition
 */
export interface AttributeSnapshot {
  /** Attribute code (e.g., "bod", "agi") */
  code: string;
  /** Display name */
  name: string;
  /** Base minimum value */
  min: number;
  /** Base maximum value (before metatype modifiers) */
  max: number;
  /** Karma cost multiplier for advancement */
  karmaCostMultiplier: number;
}

/**
 * Snapshot of skill definitions relevant to character
 */
export interface SkillDefinitionSnapshot {
  /** Map of skill ID to definition snapshot */
  skills: Record<ID, SkillSnapshot>;
}

/**
 * Snapshot of a single skill definition
 */
export interface SkillSnapshot {
  /** Skill identifier */
  id: ID;
  /** Display name */
  name: string;
  /** Associated attribute code */
  attribute: string;
  /** Skill group if any */
  group?: string;
  /** Whether skill can be defaulted */
  canDefault: boolean;
  /** Karma cost multiplier for advancement */
  karmaCostMultiplier: number;
  /** Maximum skill rating allowed */
  maxRating?: number;
}

/**
 * Snapshot of quality definitions relevant to character
 */
export interface QualityDefinitionSnapshot {
  /** Map of quality ID to definition snapshot */
  qualities: Record<ID, QualitySnapshot>;
}

/**
 * Snapshot of a single quality definition
 */
export interface QualitySnapshot {
  /** Quality identifier */
  id: ID;
  /** Display name */
  name: string;
  /** Whether positive or negative */
  type: "positive" | "negative";
  /** Karma cost */
  karmaCost: number;
  /** Mechanical effects summary */
  effects: string[];
}

// =============================================================================
// DELTA OVERRIDES (Character-Specific Data Layer)
// =============================================================================

/**
 * Character-specific data that persists across synchronizations
 * This data is never affected by ruleset changes
 */
export interface DeltaOverrides {
  /** Custom notes for items (keyed by item ID) */
  customNotes: Record<string, string>;
  /** Temporary modifiers applied to character */
  temporaryModifiers: TemporaryModifier[];
  /** Generic character-specific data storage */
  characterSpecificData: Record<string, unknown>;
}

/**
 * A temporary modifier applied to a character
 */
export interface TemporaryModifier {
  /** Modifier identifier */
  id: ID;
  /** What the modifier affects */
  target: string;
  /** Modifier value */
  value: number;
  /** When modifier expires (undefined = permanent until removed) */
  expiresAt?: ISODateString;
  /** Source/reason for the modifier */
  source: string;
  /** Additional notes */
  notes?: string;
}

// =============================================================================
// SYNC AUDIT TRAIL
// =============================================================================

/**
 * Audit entry for synchronization events
 */
export interface SyncAuditEntry {
  /** Entry identifier */
  id: ID;
  /** When the event occurred */
  timestamp: ISODateString;
  /** Type of sync event */
  eventType: SyncEventType;
  /** Ruleset version before the event */
  sourceVersion: RulesetVersionRef;
  /** Ruleset version after the event (if changed) */
  targetVersion?: RulesetVersionRef;
  /** Changes that were applied */
  changes: AppliedChange[];
  /** Who/what initiated the event */
  actor: SyncAuditActor;
}

/**
 * Types of synchronization events
 */
export type SyncEventType =
  | "drift_detected" // Drift was detected during check
  | "migration_started" // Migration plan execution began
  | "migration_completed" // Migration completed successfully
  | "migration_rolled_back" // Migration was rolled back
  | "legality_changed" // Legality status changed
  | "manual_resync"; // User triggered manual resync

/**
 * A change that was applied during sync
 */
export interface AppliedChange {
  /** Type of change */
  type: DriftChangeType;
  /** Module affected */
  module: RuleModuleType;
  /** Item that changed */
  itemId: ID;
  /** Previous value */
  before: unknown;
  /** New value */
  after: unknown;
}

/**
 * Actor who initiated a sync event
 */
export interface SyncAuditActor {
  /** Actor type */
  type: "user" | "system" | "gm";
  /** User ID if applicable */
  userId?: ID;
  /** Description of the actor */
  description: string;
}

// =============================================================================
// UI/UX TYPES
// =============================================================================

/**
 * Stability shield status for UI display
 * Provides quick visual indication of sync status
 */
export interface StabilityShield {
  /** Shield color status */
  status: "green" | "yellow" | "red";
  /** Short label for the status */
  label: string;
  /** Detailed tooltip text */
  tooltip: string;
  /** Action required, if any */
  actionRequired?: string;
}

/**
 * Result of legality validation
 */
export interface LegalityValidationResult {
  /** Whether character is rules-legal */
  isLegal: boolean;
  /** Current legality status */
  status: LegalityStatus;
  /** Validation issues found */
  issues: LegalityIssue[];
  /** Warnings that don't affect legality */
  warnings: string[];
}

/**
 * An issue affecting character legality
 */
export interface LegalityIssue {
  /** Issue severity */
  severity: "error" | "warning";
  /** Which module has the issue */
  module: RuleModuleType;
  /** Description of the issue */
  description: string;
  /** How to resolve the issue */
  resolution?: string;
}

/**
 * Eligibility for participating in encounters
 */
export interface EncounterEligibility {
  /** Whether character can participate */
  canParticipate: boolean;
  /** Reason if ineligible */
  reason?: string;
  /** Override option if available */
  canOverride: boolean;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Result of validating a migration plan
 */
export interface MigrationValidationResult {
  /** Whether the plan is valid */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}
