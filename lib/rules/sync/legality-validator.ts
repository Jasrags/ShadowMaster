/**
 * Legality Validator
 *
 * Validates a character's legality against its locked ruleset version.
 * Determines if a character can participate in gameplay and provides
 * stability shield status for the UI.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-004 (Hybrid Snapshot Model)
 */

import type {
  ID,
  Character,
  LegalityStatus,
  StabilityShield,
  DriftReport,
  SyncStatus,
} from "@/lib/types";
import { analyzeCharacterDrift, classifyDriftSeverity } from "./drift-analyzer";
import { getRulesetSnapshot } from "@/lib/storage/ruleset-snapshots";
import type { SnapshotCache } from "@/lib/storage/snapshot-cache";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of validating a character's rules legality
 */
export interface LegalityValidationResult {
  /** Is the character valid according to its rules */
  isLegal: boolean;
  /** Overall legality status */
  status: LegalityStatus;
  /** List of specific violations found */
  violations: LegalityViolation[];
  /** Drift report if applicable */
  driftReport?: DriftReport;
  /** Recommendations for resolving issues */
  recommendations: string[];
}

/**
 * A specific rules legality violation
 */
export interface LegalityViolation {
  /** Violation identifier */
  id: ID;
  /** Type of violation */
  type: ViolationType;
  /** Severity level */
  severity: "error" | "warning" | "info";
  /** Human-readable description */
  description: string;
  /** What item is affected */
  affectedField?: string;
  /** How to fix it */
  suggestion?: string;
}

/**
 * Types of legality violations
 */
export type ViolationType =
  | "missing_snapshot" // No ruleset snapshot found
  | "invalid_metatype" // Metatype not in ruleset
  | "invalid_skill" // Skill not in ruleset
  | "invalid_quality" // Quality not in ruleset
  | "invalid_gear" // Gear not in ruleset
  | "attribute_out_of_range" // Attribute exceeds limits
  | "skill_out_of_range" // Skill exceeds limits
  | "essence_violation" // Essence below minimum
  | "karma_imbalance" // Karma spent exceeds earned
  | "budget_exceeded" // Creation budget exceeded
  | "ruleset_drift" // Character diverged from current rules
  | "pending_migration" // Has unapplied migration
  | "custom_violation"; // Custom validation failure

/**
 * Encounter eligibility result
 */
export interface EncounterEligibility {
  /** Can participate in encounters */
  canParticipate: boolean;
  /** Reason if cannot participate */
  reason?: string;
  /** What needs to be resolved */
  blockers: string[];
  /** Warnings that don't block participation */
  warnings: string[];
}

// =============================================================================
// MAIN VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate character against its locked ruleset version
 *
 * Checks if the character follows all rules defined in its
 * locked ruleset snapshot.
 *
 * @param character - The character to validate
 * @returns Validation result with violations
 */
export async function validateRulesLegality(
  character: Character,
  cache?: SnapshotCache
): Promise<LegalityValidationResult> {
  const violations: LegalityViolation[] = [];
  const recommendations: string[] = [];

  // Check if snapshot exists (use cache if available)
  const snapshot = cache
    ? await cache.getRulesetSnapshot(character.rulesetSnapshotId)
    : await getRulesetSnapshot(character.rulesetSnapshotId);
  if (!snapshot) {
    violations.push({
      id: "missing-snapshot",
      type: "missing_snapshot",
      severity: "error",
      description: `Ruleset snapshot not found: ${character.rulesetSnapshotId}`,
      suggestion: "Character needs to be re-snapshotted to a valid ruleset",
    });
    return {
      isLegal: false,
      status: "invalid",
      violations,
      recommendations: ["Re-snapshot character to current ruleset"],
    };
  }

  // Validate metatype
  const metatypeViolations = validateMetatype(character, snapshot);
  violations.push(...metatypeViolations);

  // Validate skills
  const skillViolations = validateSkills(character, snapshot);
  violations.push(...skillViolations);

  // Validate qualities
  const qualityViolations = validateQualities(character, snapshot);
  violations.push(...qualityViolations);

  // Validate attributes
  const attributeViolations = validateAttributes(character, snapshot);
  violations.push(...attributeViolations);

  // Validate essence
  const essenceViolations = validateEssence(character);
  violations.push(...essenceViolations);

  // Check for pending migration
  if (character.pendingMigration) {
    violations.push({
      id: "pending-migration",
      type: "pending_migration",
      severity: "warning",
      description: "Character has a pending migration that needs to be applied",
      suggestion: "Review and apply the pending migration",
    });
    recommendations.push("Review and apply pending migration");
  }

  // Check for drift
  let driftReport: DriftReport | undefined;
  try {
    driftReport = await analyzeCharacterDrift(character, cache);
    if (driftReport.changes.length > 0) {
      violations.push({
        id: "drift-detected",
        type: "ruleset_drift",
        severity: driftReport.overallSeverity === "breaking" ? "warning" : "info",
        description: `${driftReport.changes.length} change(s) detected since character creation`,
        suggestion: "Review changes in Sync Lab and migrate if needed",
      });

      if (driftReport.overallSeverity === "breaking") {
        recommendations.push("Review breaking changes in Sync Lab");
      }
    }
  } catch {
    // Drift analysis may fail if no current snapshot exists - that's okay
  }

  // Determine overall status
  const hasErrors = violations.some((v) => v.severity === "error");
  const hasWarnings = violations.some((v) => v.severity === "warning");

  let status: LegalityStatus;
  if (hasErrors) {
    status = "invalid";
  } else if (hasWarnings || character.pendingMigration) {
    status = "legacy";
  } else if (character.status === "draft") {
    status = "draft";
  } else {
    status = "rules-legal";
  }

  return {
    isLegal: !hasErrors,
    status,
    violations,
    driftReport,
    recommendations,
  };
}

/**
 * Check if character can participate in encounters
 *
 * Determines if the character is in a state that allows
 * them to participate in gameplay.
 *
 * @param character - The character to check
 * @returns Eligibility result
 */
export async function canParticipateInEncounter(
  character: Character,
  cache?: SnapshotCache
): Promise<EncounterEligibility> {
  const blockers: string[] = [];
  const warnings: string[] = [];

  // Retired characters cannot participate
  if (character.status === "retired") {
    blockers.push("Character is retired");
    return {
      canParticipate: false,
      reason: "Character is retired",
      blockers,
      warnings,
    };
  }

  // Draft characters need to be finalized
  if (character.status === "draft") {
    blockers.push("Character creation is not complete");
    return {
      canParticipate: false,
      reason: "Character is still a draft",
      blockers,
      warnings,
    };
  }

  // Validate rules legality
  const validation = await validateRulesLegality(character, cache);

  // Errors block participation
  for (const violation of validation.violations) {
    if (violation.severity === "error") {
      blockers.push(violation.description);
    } else if (violation.severity === "warning") {
      warnings.push(violation.description);
    }
  }

  // Migrating characters may have restricted participation
  if (character.syncStatus === "migrating") {
    warnings.push("Character is currently migrating to a new ruleset version");
  }

  return {
    canParticipate: blockers.length === 0,
    reason: blockers.length > 0 ? blockers[0] : undefined,
    blockers,
    warnings,
  };
}

/**
 * Get legality shield status for UI display
 *
 * Provides a simple status indicator for character sheets
 * and lists.
 *
 * @param character - The character to check
 * @returns Shield status for UI
 */
export async function getLegalityShield(
  character: Character,
  cache?: SnapshotCache
): Promise<StabilityShield> {
  // Quick checks for obvious states
  if (character.status === "draft") {
    return {
      status: "yellow",
      label: "Draft",
      tooltip: "Character creation is in progress",
      actionRequired: "Complete character creation",
    };
  }

  if (character.status === "retired") {
    return {
      status: "yellow",
      label: "Retired",
      tooltip: "Character has been retired from active play",
    };
  }

  // Check for pending migration
  if (character.pendingMigration) {
    return {
      status: "yellow",
      label: "Migration Pending",
      tooltip: "Character has a pending ruleset migration",
      actionRequired: "Review and apply migration",
    };
  }

  // Check sync status
  if (character.syncStatus === "invalid") {
    return {
      status: "red",
      label: "Invalid",
      tooltip: "Character state is invalid and cannot participate in encounters",
      actionRequired: "Resolve character validation errors",
    };
  }

  if (character.syncStatus === "migrating") {
    return {
      status: "yellow",
      label: "Migrating",
      tooltip: "Character is currently being migrated to a new ruleset version",
    };
  }

  // Validate legality
  try {
    const validation = await validateRulesLegality(character, cache);

    if (!validation.isLegal) {
      return {
        status: "red",
        label: "Invalid",
        tooltip: `${validation.violations.filter((v) => v.severity === "error").length} validation error(s)`,
        actionRequired: validation.recommendations[0],
      };
    }

    if (validation.status === "legacy") {
      return {
        status: "yellow",
        label: "Legacy",
        tooltip: "Character was created under an older ruleset version",
        actionRequired: validation.recommendations[0],
      };
    }

    // Check for drift
    if (validation.driftReport && validation.driftReport.changes.length > 0) {
      const severity = classifyDriftSeverity(validation.driftReport.changes);
      if (severity === "breaking") {
        return {
          status: "yellow",
          label: "Updates Available",
          tooltip: `${validation.driftReport.changes.length} ruleset change(s) may affect this character`,
          actionRequired: "Review changes in Sync Lab",
        };
      }
    }

    // All good!
    return {
      status: "green",
      label: "Valid",
      tooltip: "Character is rules-legal and ready for play",
    };
  } catch {
    // If validation fails, assume caution
    return {
      status: "yellow",
      label: "Unknown",
      tooltip: "Unable to validate character status",
      actionRequired: "Check character configuration",
    };
  }
}

// =============================================================================
// INDIVIDUAL VALIDATORS
// =============================================================================

/**
 * Validate character's metatype against snapshot
 */
function validateMetatype(
  character: Character,
  snapshot: { modules: Record<string, unknown> }
): LegalityViolation[] {
  const violations: LegalityViolation[] = [];
  const metatypes = snapshot.modules.metatypes as Record<string, unknown> | undefined;

  if (!metatypes) {
    return violations; // No metatypes in snapshot, skip validation
  }

  // Check if character's metatype exists in snapshot
  const characterMetatype = Object.values(metatypes).find(
    (m: unknown) => (m as { id: string }).id === character.metatype
  );

  if (!characterMetatype) {
    violations.push({
      id: `invalid-metatype-${character.metatype}`,
      type: "invalid_metatype",
      severity: "error",
      description: `Metatype '${character.metatype}' is not valid in the current ruleset`,
      affectedField: "metatype",
      suggestion: "Select a valid metatype or migrate to an updated ruleset",
    });
  }

  return violations;
}

/**
 * Validate character's skills against snapshot
 */
function validateSkills(
  character: Character,
  snapshot: { modules: Record<string, unknown> }
): LegalityViolation[] {
  const violations: LegalityViolation[] = [];
  const skills = snapshot.modules.skills as Record<string, unknown> | undefined;

  if (!skills || !character.skills) {
    return violations;
  }

  for (const [skillId, rating] of Object.entries(character.skills)) {
    if (rating <= 0) continue;

    const skillDef = skills[skillId] as { maxRating?: number } | undefined;

    if (!skillDef) {
      violations.push({
        id: `invalid-skill-${skillId}`,
        type: "invalid_skill",
        severity: "error",
        description: `Skill '${skillId}' is not valid in the current ruleset`,
        affectedField: `skills.${skillId}`,
        suggestion: "Remove or replace this skill",
      });
      continue;
    }

    // Check max rating
    const maxRating = skillDef.maxRating || 6;
    if (rating > maxRating) {
      violations.push({
        id: `skill-rating-${skillId}`,
        type: "skill_out_of_range",
        severity: "error",
        description: `Skill '${skillId}' rating ${rating} exceeds maximum of ${maxRating}`,
        affectedField: `skills.${skillId}`,
        suggestion: `Reduce skill rating to ${maxRating} or lower`,
      });
    }
  }

  return violations;
}

/**
 * Validate character's qualities against snapshot
 */
function validateQualities(
  character: Character,
  snapshot: { modules: Record<string, unknown> }
): LegalityViolation[] {
  const violations: LegalityViolation[] = [];
  const qualities = snapshot.modules.qualities as Record<string, unknown> | undefined;

  if (!qualities) {
    return violations;
  }

  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  for (const quality of allQualities) {
    const qualityId = quality.qualityId;
    const qualityDef = qualities[qualityId];

    if (!qualityDef) {
      violations.push({
        id: `invalid-quality-${qualityId}`,
        type: "invalid_quality",
        severity: "error",
        description: `Quality '${qualityId}' is not valid in the current ruleset`,
        affectedField: `qualities.${qualityId}`,
        suggestion: "Remove or replace this quality",
      });
    }
  }

  return violations;
}

/**
 * Validate character's attributes against snapshot
 */
function validateAttributes(
  character: Character,
  snapshot: { modules: Record<string, unknown> }
): LegalityViolation[] {
  const violations: LegalityViolation[] = [];
  const metatypes = snapshot.modules.metatypes as Record<string, unknown> | undefined;

  if (!metatypes || !character.attributes) {
    return violations;
  }

  // Find character's metatype for attribute limits
  const metatypeDef = Object.values(metatypes).find(
    (m: unknown) => (m as { id: string }).id === character.metatype
  ) as { attributeLimits?: Record<string, { min: number; max: number }> } | undefined;

  if (!metatypeDef?.attributeLimits) {
    return violations; // No limits defined
  }

  for (const [attr, value] of Object.entries(character.attributes)) {
    const limits = metatypeDef.attributeLimits[attr];
    if (!limits) continue;

    if (value < limits.min) {
      violations.push({
        id: `attribute-min-${attr}`,
        type: "attribute_out_of_range",
        severity: "error",
        description: `Attribute '${attr}' value ${value} is below minimum ${limits.min}`,
        affectedField: `attributes.${attr}`,
        suggestion: `Increase ${attr} to at least ${limits.min}`,
      });
    }

    if (value > limits.max) {
      violations.push({
        id: `attribute-max-${attr}`,
        type: "attribute_out_of_range",
        severity: "error",
        description: `Attribute '${attr}' value ${value} exceeds maximum ${limits.max}`,
        affectedField: `attributes.${attr}`,
        suggestion: `Reduce ${attr} to at most ${limits.max}`,
      });
    }
  }

  return violations;
}

/**
 * Validate character's essence
 */
function validateEssence(character: Character): LegalityViolation[] {
  const violations: LegalityViolation[] = [];

  const essence = character.specialAttributes?.essence;
  if (essence !== undefined && essence < 0) {
    violations.push({
      id: "essence-negative",
      type: "essence_violation",
      severity: "error",
      description: `Essence (${essence}) cannot be negative`,
      affectedField: "specialAttributes.essence",
      suggestion: "Remove cyberware or bioware to restore essence",
    });
  }

  return violations;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a quick sync status check without full validation
 */
export function getQuickSyncStatus(character: Character): SyncStatus {
  // Check if explicitly set
  if (character.syncStatus) {
    return character.syncStatus;
  }

  // Check for pending migration
  if (character.pendingMigration) {
    return "outdated";
  }

  // Default to synchronized if no issues detected
  return "synchronized";
}

/**
 * Get a quick legality status check without full validation
 */
export function getQuickLegalityStatus(character: Character): LegalityStatus {
  // Check if explicitly set
  if (character.legalityStatus) {
    return character.legalityStatus;
  }

  // Check draft status
  if (character.status === "draft") {
    return "draft";
  }

  // Default to rules-legal if no issues detected
  return "rules-legal";
}
