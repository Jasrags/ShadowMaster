/**
 * Character Validation Types
 *
 * Types for comprehensive character validation during creation and finalization.
 */

import type { Character, CharacterDraft } from "@/lib/types/character";
import type { MergedRuleset, CreationMethod, Campaign } from "@/lib/types";
import type { CreationState } from "@/lib/types/creation";

// =============================================================================
// VALIDATION MODES
// =============================================================================

/**
 * Mode of validation determines strictness
 */
export type ValidationMode =
  | "creation" // During creation - allows incomplete state
  | "step" // Validating a specific step
  | "finalization" // Final check before activation - strict
  | "advancement"; // Post-creation advancement

// =============================================================================
// VALIDATION RESULTS
// =============================================================================

/**
 * Severity of a validation issue
 */
export type ValidationSeverity = "error" | "warning" | "info";

/**
 * A single validation issue
 */
export interface ValidationIssue {
  code: string;
  message: string;
  field?: string;
  severity: ValidationSeverity;
  suggestion?: string;
}

/**
 * Step completion status
 */
export interface StepCompleteness {
  stepId: string;
  stepTitle: string;
  complete: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Budget allocation status
 */
export interface BudgetCompleteness {
  budgetId: string;
  budgetLabel: string;
  total: number;
  spent: number;
  remaining: number;
  complete: boolean;
  overspent: boolean;
}

/**
 * Comprehensive validation result
 */
export interface CharacterValidationResult {
  /** Overall validity - true only if no errors */
  valid: boolean;

  /** All errors (blocking issues) */
  errors: ValidationIssue[];

  /** All warnings (non-blocking) */
  warnings: ValidationIssue[];

  /** Completeness metrics */
  completeness: {
    /** Step-by-step completion status */
    steps: StepCompleteness[];

    /** Budget allocation status */
    budgets: BudgetCompleteness[];

    /** Overall completion percentage (0-100) */
    percentage: number;

    /** Is character ready for finalization? */
    readyForFinalization: boolean;
  };

  /** Campaign-specific validation */
  campaign?: {
    /** Character is in a campaign */
    inCampaign: boolean;

    /** Campaign requires approval */
    requiresApproval: boolean;

    /** Using only enabled books */
    booksValid: boolean;

    /** Any campaign rule violations */
    violations: ValidationIssue[];
  };
}

// =============================================================================
// VALIDATION CONTEXT
// =============================================================================

/**
 * Full context needed for character validation
 */
export interface CharacterValidationContext {
  /** Character to validate */
  character: Character | CharacterDraft;

  /** Active ruleset */
  ruleset: MergedRuleset;

  /** Creation method used */
  creationMethod?: CreationMethod;

  /** Current creation state (for draft characters) */
  creationState?: CreationState;

  /** Campaign settings (if character is in a campaign) */
  campaign?: Campaign;

  /** Validation mode */
  mode: ValidationMode;
}

// =============================================================================
// VALIDATOR TYPES
// =============================================================================

/**
 * A validator function that checks a specific aspect of a character
 */
export type CharacterValidator = (
  context: CharacterValidationContext
) => ValidationIssue[] | Promise<ValidationIssue[]>;

/**
 * Named validator with metadata
 */
export interface ValidatorDefinition {
  id: string;
  name: string;
  description?: string;
  /** When to run this validator */
  modes: ValidationMode[];
  /** Priority (lower = runs first) */
  priority: number;
  /** The validator function */
  validate: CharacterValidator;
}
