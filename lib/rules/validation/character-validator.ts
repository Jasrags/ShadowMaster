/**
 * Character Validation Engine
 *
 * Provides comprehensive character validation for creation finalization.
 * Builds on the existing constraint-based validation system.
 *
 * Satisfies:
 * - Guarantee: "Character data MUST remain consistent with the selected game edition"
 * - Requirement: "Real-time validation MUST be enforced throughout the creation process"
 * - Constraint: "Validation failures MUST prevent character finalization"
 */

import type { Character, CharacterDraft } from "@/lib/types/character";
import type { MergedRuleset, Campaign, CreationMethod } from "@/lib/types";
import type { CreationState } from "@/lib/types/creation";
import {
  type CharacterValidationContext,
  type CharacterValidationResult,
  type ValidationIssue,
  type StepCompleteness,
  type BudgetCompleteness,
  type ValidationMode,
  type ValidatorDefinition,
} from "./types";
import {
  validateAllConstraints,
  validateStep,
  validateBudgetsComplete,
  getMetatypeAttributeLimits,
  type ValidationContext,
} from "../constraint-validation";
import { validateAllQualities, validateKarmaLimits } from "../qualities";

// =============================================================================
// CORE VALIDATORS
// =============================================================================

/**
 * Validate basic character info is complete
 */
const basicInfoValidator: ValidatorDefinition = {
  id: "basic-info",
  name: "Basic Information",
  description: "Validates name, metatype, and essential character info",
  modes: ["finalization"],
  priority: 1,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character } = context;

    if (!character.name || character.name.trim() === "") {
      issues.push({
        code: "MISSING_NAME",
        message: "Character must have a name",
        field: "name",
        severity: "error",
      });
    }

    if (!character.metatype || character.metatype.trim() === "") {
      issues.push({
        code: "MISSING_METATYPE",
        message: "Character must have a metatype selected",
        field: "metatype",
        severity: "error",
      });
    }

    if (!character.magicalPath) {
      issues.push({
        code: "MISSING_MAGICAL_PATH",
        message: "Character must have a magical path selected (including mundane)",
        field: "magicalPath",
        severity: "error",
      });
    }

    return issues;
  },
};

/**
 * Validate attributes are within metatype limits
 */
const attributeValidator: ValidatorDefinition = {
  id: "attributes",
  name: "Attributes",
  description: "Validates attributes are within metatype limits",
  modes: ["creation", "finalization"],
  priority: 2,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, ruleset } = context;

    if (!character.attributes || Object.keys(character.attributes).length === 0) {
      issues.push({
        code: "MISSING_ATTRIBUTES",
        message: "Character must have attributes allocated",
        field: "attributes",
        severity: "error",
      });
      return issues;
    }

    // Get metatype limits
    if (character.metatype) {
      const limits = getMetatypeAttributeLimits(character.metatype, ruleset);
      if (limits) {
        for (const [attrId, value] of Object.entries(character.attributes)) {
          const limit = limits[attrId];
          if (limit) {
            if (value < limit.min) {
              issues.push({
                code: "ATTRIBUTE_BELOW_MIN",
                message: `${attrId.toUpperCase()} (${value}) is below minimum (${limit.min}) for ${character.metatype}`,
                field: `attributes.${attrId}`,
                severity: "error",
              });
            }
            if (value > limit.max) {
              issues.push({
                code: "ATTRIBUTE_ABOVE_MAX",
                message: `${attrId.toUpperCase()} (${value}) exceeds maximum (${limit.max}) for ${character.metatype}`,
                field: `attributes.${attrId}`,
                severity: "error",
              });
            }
          }
        }
      }
    }

    return issues;
  },
};

/**
 * Validate identities and lifestyles
 */
const identityValidator: ValidatorDefinition = {
  id: "identities",
  name: "Identities & Lifestyles",
  description: "Validates SINs and lifestyle requirements",
  modes: ["finalization"],
  priority: 3,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character } = context;

    if (!character.identities || character.identities.length === 0) {
      issues.push({
        code: "MISSING_IDENTITY",
        message: "Character must have at least one identity (SIN)",
        field: "identities",
        severity: "error",
        suggestion: "Add a fake or real SIN in the Identities step",
      });
    }

    if (!character.lifestyles || character.lifestyles.length === 0) {
      issues.push({
        code: "MISSING_LIFESTYLE",
        message: "Character must have at least one lifestyle",
        field: "lifestyles",
        severity: "error",
        suggestion: "Select a lifestyle in the Identities & Lifestyles step",
      });
    }

    return issues;
  },
};

// Skills that mystic adepts cannot learn (SR5 Core p.69)
const MYSTIC_ADEPT_RESTRICTED_SKILLS = ["counterspelling"];

/**
 * Validate magic-specific requirements
 */
const magicValidator: ValidatorDefinition = {
  id: "magic",
  name: "Magic & Resonance",
  description: "Validates magical path requirements",
  modes: ["creation", "finalization"],
  priority: 4,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character } = context;

    if (!character.magicalPath || character.magicalPath === "mundane") {
      return issues;
    }

    // Full mage or mystic adept should have tradition
    if (
      (character.magicalPath === "full-mage" || character.magicalPath === "mystic-adept") &&
      !character.tradition
    ) {
      issues.push({
        code: "MISSING_TRADITION",
        message: "Magical character should have a tradition selected",
        field: "tradition",
        severity: "warning",
        suggestion: "Select a magical tradition (e.g., Hermetic, Shaman)",
      });
    }

    // Mystic adepts cannot have Counterspelling skill (SR5 Core p.69)
    if (character.magicalPath === "mystic-adept" && character.skills) {
      const skillsObj = character.skills as Record<string, number>;
      for (const restrictedSkill of MYSTIC_ADEPT_RESTRICTED_SKILLS) {
        if (skillsObj[restrictedSkill] && skillsObj[restrictedSkill] > 0) {
          issues.push({
            code: "MYSTIC_ADEPT_RESTRICTED_SKILL",
            message: `Mystic adepts cannot learn the Counterspelling skill (SR5 Core p.69)`,
            field: `skills.${restrictedSkill}`,
            severity: "error",
            suggestion: "Remove Counterspelling from your skills",
          });
        }
      }
    }

    // Adepts and mystic adepts should have adept powers
    if (
      (character.magicalPath === "adept" || character.magicalPath === "mystic-adept") &&
      (!character.adeptPowers || character.adeptPowers.length === 0)
    ) {
      issues.push({
        code: "NO_ADEPT_POWERS",
        message: "Adept has no powers selected",
        field: "adeptPowers",
        severity: "warning",
        suggestion: "Select adept powers in the Adept Powers step",
      });
    }

    // Full mages and mystic adepts should have spells
    if (
      (character.magicalPath === "full-mage" || character.magicalPath === "mystic-adept") &&
      (!character.spells || character.spells.length === 0)
    ) {
      issues.push({
        code: "NO_SPELLS",
        message: "Mage has no spells selected",
        field: "spells",
        severity: "warning",
        suggestion: "Select spells in the Spells step",
      });
    }

    // Technomancers should have complex forms
    if (
      character.magicalPath === "technomancer" &&
      (!character.complexForms || character.complexForms.length === 0)
    ) {
      issues.push({
        code: "NO_COMPLEX_FORMS",
        message: "Technomancer has no complex forms selected",
        field: "complexForms",
        severity: "warning",
      });
    }

    return issues;
  },
};

/**
 * Validate quality karma limits
 */
const qualityValidator: ValidatorDefinition = {
  id: "qualities",
  name: "Qualities",
  description: "Validates quality selections and karma limits",
  modes: ["creation", "finalization"],
  priority: 5,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, ruleset } = context;

    // Cast to Character for validation functions that require it
    // (they check the fields they need, which exist on drafts too)
    const charForValidation = character as Character;

    // Validate karma limits (25 positive, 25 negative by default)
    const karmaResult = validateKarmaLimits(charForValidation, ruleset);
    for (const error of karmaResult.errors) {
      issues.push({
        code: "QUALITY_KARMA_ERROR",
        message: error.message,
        field: error.field || "qualities",
        severity: "error",
      });
    }

    // Add warnings if limits are exceeded
    if (karmaResult.positiveExceeded) {
      issues.push({
        code: "POSITIVE_KARMA_EXCEEDED",
        message: `Positive quality karma (${karmaResult.positiveTotal}) exceeds limit`,
        field: "positiveQualities",
        severity: "error",
      });
    }
    if (karmaResult.negativeExceeded) {
      issues.push({
        code: "NEGATIVE_KARMA_EXCEEDED",
        message: `Negative quality karma (${karmaResult.negativeTotal}) exceeds limit`,
        field: "negativeQualities",
        severity: "error",
      });
    }

    // Validate quality prerequisites and incompatibilities
    const qualityResult = validateAllQualities(charForValidation, ruleset);
    for (const error of qualityResult.errors) {
      issues.push({
        code: error.qualityId || "QUALITY_ERROR",
        message: error.message,
        field: error.field || "qualities",
        severity: "error",
      });
    }

    return issues;
  },
};

/**
 * Validate campaign-specific rules
 */
const campaignValidator: ValidatorDefinition = {
  id: "campaign",
  name: "Campaign Rules",
  description: "Validates character against campaign restrictions",
  modes: ["finalization"],
  priority: 10,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, campaign } = context;

    if (!campaign || !character.campaignId) {
      return issues;
    }

    // Check if character uses only enabled books
    if (campaign.enabledBookIds && character.attachedBookIds) {
      const disabledBooks = character.attachedBookIds.filter(
        (bookId) => !campaign.enabledBookIds!.includes(bookId)
      );

      if (disabledBooks.length > 0) {
        issues.push({
          code: "DISABLED_BOOKS_USED",
          message: `Character uses content from disabled books: ${disabledBooks.join(", ")}`,
          field: "attachedBookIds",
          severity: "error",
          suggestion: "Remove content from disabled sourcebooks or ask GM to enable them",
        });
      }
    }

    return issues;
  },
};

// =============================================================================
// VALIDATOR REGISTRY
// =============================================================================

const validators: ValidatorDefinition[] = [
  basicInfoValidator,
  attributeValidator,
  identityValidator,
  magicValidator,
  qualityValidator,
  campaignValidator,
];

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

/**
 * Validate a character comprehensively
 *
 * This is the main entry point for character validation.
 */
export async function validateCharacter(
  context: CharacterValidationContext
): Promise<CharacterValidationResult> {
  const allErrors: ValidationIssue[] = [];
  const allWarnings: ValidationIssue[] = [];

  // Run all validators applicable to this mode
  const applicableValidators = validators
    .filter((v) => v.modes.includes(context.mode))
    .sort((a, b) => a.priority - b.priority);

  for (const validator of applicableValidators) {
    const issues = await validator.validate(context);
    for (const issue of issues) {
      if (issue.severity === "error") {
        allErrors.push(issue);
      } else {
        allWarnings.push(issue);
      }
    }
  }

  // Run existing constraint validators if we have a creation method
  if (context.creationMethod) {
    const legacyContext: ValidationContext = {
      character: context.character,
      ruleset: context.ruleset,
      creationMethod: context.creationMethod,
      creationState: context.creationState,
      campaign: context.campaign,
    };

    const constraintResult = validateAllConstraints(
      context.creationMethod.constraints,
      legacyContext
    );

    for (const error of constraintResult.errors) {
      allErrors.push({
        code: error.constraintId || "CONSTRAINT_ERROR",
        message: error.message,
        field: error.field,
        severity: "error",
      });
    }

    for (const warning of constraintResult.warnings) {
      allWarnings.push({
        code: warning.constraintId || "CONSTRAINT_WARNING",
        message: warning.message,
        field: warning.field,
        severity: "warning",
      });
    }
  }

  // Calculate completeness
  const completeness = calculateCompleteness(context);

  // Campaign-specific validation
  const campaignInfo = context.campaign
    ? {
        inCampaign: true,
        requiresApproval: true, // As per user decision
        booksValid: !allErrors.some((e) => e.code === "DISABLED_BOOKS_USED"),
        violations: allErrors.filter(
          (e) => e.code === "DISABLED_BOOKS_USED" || e.code.startsWith("CAMPAIGN_")
        ),
      }
    : undefined;

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    completeness,
    campaign: campaignInfo,
  };
}

/**
 * Calculate character completeness metrics
 */
function calculateCompleteness(
  context: CharacterValidationContext
): CharacterValidationResult["completeness"] {
  const steps: StepCompleteness[] = [];
  const budgets: BudgetCompleteness[] = [];

  const { creationMethod, creationState, character, ruleset, campaign } = context;

  // Calculate step completeness
  if (creationMethod && creationState) {
    const legacyContext: ValidationContext = {
      character,
      ruleset,
      creationMethod,
      creationState,
      campaign,
    };

    for (const step of creationMethod.steps) {
      const stepResult = validateStep(step.id, legacyContext);
      steps.push({
        stepId: step.id,
        stepTitle: step.title,
        complete: stepResult.valid,
        errors: stepResult.errors.map((e) => ({
          code: e.constraintId || "STEP_ERROR",
          message: e.message,
          field: e.field,
          severity: "error" as const,
        })),
        warnings: stepResult.warnings.map((w) => ({
          code: w.constraintId || "STEP_WARNING",
          message: w.message,
          field: w.field,
          severity: "warning" as const,
        })),
      });
    }

    // Calculate budget completeness
    for (const budget of creationMethod.budgets) {
      const remaining = creationState.budgets[budget.id] ?? budget.initialValue ?? 0;
      const total = budget.initialValue ?? 0;
      const spent = total - remaining;

      budgets.push({
        budgetId: budget.id,
        budgetLabel: budget.label,
        total,
        spent,
        remaining,
        complete: remaining >= 0, // Budget is complete if not overspent
        overspent: remaining < 0,
      });
    }
  }

  // Calculate overall percentage
  const completedSteps = steps.filter((s) => s.complete).length;
  const totalSteps = steps.length || 1;
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  // Ready for finalization if all steps complete and no budgets overspent
  const readyForFinalization =
    steps.every((s) => s.complete) &&
    budgets.every((b) => !b.overspent) &&
    character.name !== undefined &&
    character.name.trim() !== "";

  return {
    steps,
    budgets,
    percentage,
    readyForFinalization,
  };
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Validate character for finalization (strictest mode)
 */
export async function validateForFinalization(
  character: Character | CharacterDraft,
  ruleset: MergedRuleset,
  creationMethod?: CreationMethod,
  creationState?: CreationState,
  campaign?: Campaign
): Promise<CharacterValidationResult> {
  return validateCharacter({
    character,
    ruleset,
    creationMethod,
    creationState,
    campaign,
    mode: "finalization",
  });
}

/**
 * Quick validation check - returns true if character is valid
 */
export async function isCharacterValid(
  character: Character | CharacterDraft,
  ruleset: MergedRuleset,
  mode: ValidationMode = "finalization"
): Promise<boolean> {
  const result = await validateCharacter({
    character,
    ruleset,
    mode,
  });
  return result.valid;
}
