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
import { getModule } from "../merge";
import { getGroupRating, isGroupBroken } from "../skills/group-utils";
import type { CreationSelections } from "@/lib/types/creation-selections";
import type { LanguageSkill } from "@/lib/types/character";
import type { ComplexFormData, SkillGroupData } from "../loader-types";

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
        severity: context.mode === "finalization" ? "error" : "warning",
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
// COMPLEX FORM VALIDATOR
// =============================================================================

/**
 * Validate complex form allocation for technomancers
 */
const complexFormValidator: ValidatorDefinition = {
  id: "complex-forms",
  name: "Complex Forms",
  description: "Validates complex form allocation for technomancers",
  modes: ["creation", "finalization"],
  priority: 6,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, ruleset } = context;

    // Only applies to technomancers
    if (character.magicalPath !== "technomancer") {
      return issues;
    }

    const formIds = character.complexForms || [];
    if (formIds.length === 0) {
      return issues; // NO_COMPLEX_FORMS is already handled by magicValidator
    }

    // Get form limit from resonance rating (SR5: Resonance × 2)
    const resonance = character.specialAttributes?.resonance ?? 0;
    const formLimit = resonance * 2;

    // Check form limit
    if (formIds.length > formLimit) {
      issues.push({
        code: "CF_LIMIT_EXCEEDED",
        message: `Cannot select more than ${formLimit} complex forms (selected: ${formIds.length})`,
        field: "complexForms",
        severity: "error",
      });
    }

    // Get complex forms catalog from merged ruleset
    const magicModule = getModule<{ complexForms?: ComplexFormData[] }>(ruleset, "magic");
    const formsCatalog = magicModule?.complexForms || [];

    const invalidForms: string[] = [];
    const duplicateForms: string[] = [];
    const seenForms = new Set<string>();

    for (const formId of formIds) {
      if (seenForms.has(formId)) {
        duplicateForms.push(formId);
      } else {
        seenForms.add(formId);
      }

      if (!formsCatalog.find((f) => f.id === formId)) {
        invalidForms.push(formId);
      }
    }

    if (invalidForms.length > 0) {
      issues.push({
        code: "CF_NOT_FOUND",
        message: `Complex forms not found in ruleset: ${invalidForms.join(", ")}`,
        field: "complexForms",
        severity: "error",
      });
    }

    if (duplicateForms.length > 0) {
      issues.push({
        code: "CF_DUPLICATE",
        message: `Duplicate complex forms selected: ${duplicateForms.join(", ")}`,
        field: "complexForms",
        severity: "error",
      });
    }

    return issues;
  },
};

// =============================================================================
// SKILL GROUP CONSTRAINT VALIDATOR
// =============================================================================

/**
 * Validate skill group constraints - individual skill points cannot be
 * allocated to skills in an active (non-broken) group during creation.
 * Only karma can be used to raise skills within an active group.
 */
const skillGroupConstraintValidator: ValidatorDefinition = {
  id: "skill-group-constraints",
  name: "Skill Group Constraints",
  description: "Validates that individual skill points are not used in active skill groups",
  modes: ["creation", "finalization"],
  priority: 7,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { creationState, ruleset } = context;

    if (!creationState) return issues;

    const selections = creationState.selections as CreationSelections;
    const skillGroups = selections.skillGroups || {};
    const skills = (selections.skills || {}) as Record<string, number>;
    const skillKarmaSpent = selections.skillKarmaSpent;

    // Get skill group definitions from merged ruleset to map group -> member skills
    const skillsModule = getModule<{ skillGroups?: SkillGroupData[] }>(ruleset, "skills");
    const skillGroupDefs = skillsModule?.skillGroups || [];

    for (const [groupId, groupValue] of Object.entries(skillGroups)) {
      // Broken groups are exempt - individual allocation is allowed
      if (isGroupBroken(groupValue)) continue;

      const rating = getGroupRating(groupValue);
      if (rating === 0) continue;

      // Find the group definition
      const groupDef = skillGroupDefs.find((def) => def.id === groupId);
      if (!groupDef) continue;

      // Check if any member skill has individual skill points allocated
      for (const memberSkillId of groupDef.skills) {
        const memberRating = skills[memberSkillId];
        if (memberRating === undefined || memberRating === 0) continue;

        // Check if this raise was done via karma (which is allowed)
        const hasKarmaRaise =
          skillKarmaSpent?.skillRaises?.[memberSkillId] !== undefined &&
          skillKarmaSpent.skillRaises[memberSkillId] > 0;

        if (!hasKarmaRaise) {
          issues.push({
            code: "SG_INDIVIDUAL_SKILL_IN_GROUP",
            message: `Skill "${memberSkillId}" cannot use skill points while in active group "${groupId}" (use karma instead)`,
            field: `skills.${memberSkillId}`,
            severity: "error",
            suggestion: "Break the skill group first, or use karma to raise individual skills",
          });
        }
      }
    }

    return issues;
  },
};

// =============================================================================
// CONTACT BUDGET VALIDATOR
// =============================================================================

/**
 * Validate contact point budget during character creation.
 * Free pool = Charisma × 3. Overflow costs karma.
 */
const contactBudgetValidator: ValidatorDefinition = {
  id: "contact-budget",
  name: "Contact Budget",
  description: "Validates contact point allocation against charisma-based budget",
  modes: ["creation", "finalization"],
  priority: 8,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, creationState } = context;

    if (!creationState) return issues;

    const selections = creationState.selections as CreationSelections;
    const contacts = selections.contacts || [];

    // Validate individual contact ratings
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (contact.connection < 1) {
        issues.push({
          code: "CONTACT_INVALID_CONNECTION",
          message: `Contact "${contact.name || `#${i + 1}`}" has invalid connection rating (${contact.connection}), minimum is 1`,
          field: `contacts[${i}].connection`,
          severity: "error",
        });
      }
      if (contact.loyalty < 1) {
        issues.push({
          code: "CONTACT_INVALID_LOYALTY",
          message: `Contact "${contact.name || `#${i + 1}`}" has invalid loyalty rating (${contact.loyalty}), minimum is 1`,
          field: `contacts[${i}].loyalty`,
          severity: "error",
        });
      }
    }

    // Calculate free pool and total cost
    const charisma = character.attributes?.charisma ?? 0;
    const freePool = charisma * 3;
    const totalCost = contacts.reduce((sum, c) => sum + (c.connection || 0) + (c.loyalty || 0), 0);
    const overflow = totalCost - freePool;

    if (overflow > 0) {
      issues.push({
        code: "CONTACT_KARMA_OVERFLOW",
        message: `Contact points exceed free pool by ${overflow} (${totalCost} spent, ${freePool} free from CHA × 3). Overflow costs karma.`,
        field: "contacts",
        severity: "info",
      });
    }

    // At finalization, warn if no contacts selected
    if (context.mode === "finalization" && contacts.length === 0) {
      issues.push({
        code: "CONTACT_NONE_SELECTED",
        message: "No contacts selected — consider adding contacts for your character",
        field: "contacts",
        severity: "warning",
      });
    }

    return issues;
  },
};

// =============================================================================
// KNOWLEDGE POINT BUDGET VALIDATOR
// =============================================================================

/**
 * Validate knowledge point budget during character creation.
 * Budget = (Intuition + Logic) × 2.
 */
const knowledgeBudgetValidator: ValidatorDefinition = {
  id: "knowledge-budget",
  name: "Knowledge Budget",
  description: "Validates knowledge and language point allocation",
  modes: ["creation", "finalization"],
  priority: 9,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, creationState } = context;

    if (!creationState) return issues;

    const selections = creationState.selections as CreationSelections;
    const languages = (selections.languages || []) as LanguageSkill[];
    const knowledgeSkills = (selections.knowledgeSkills || []) as Array<{ rating: number }>;

    // Calculate budget: (Intuition + Logic) × 2
    const intuition = character.attributes?.intuition ?? 0;
    const logic = character.attributes?.logic ?? 0;
    const budget = (intuition + logic) * 2;

    // Calculate spent: sum of ratings excluding native languages
    const languagePointsSpent = languages
      .filter((lang) => !lang.isNative)
      .reduce((sum, lang) => sum + (lang.rating || 0), 0);
    const knowledgePointsSpent = knowledgeSkills.reduce(
      (sum, skill) => sum + (skill.rating || 0),
      0
    );
    const totalSpent = languagePointsSpent + knowledgePointsSpent;

    // Over budget → error
    if (totalSpent > budget) {
      issues.push({
        code: "KNOWLEDGE_BUDGET_EXCEEDED",
        message: `Knowledge points exceed budget: ${totalSpent} spent, ${budget} available ((INT ${intuition} + LOG ${logic}) × 2)`,
        field: "knowledgeSkills",
        severity: "error",
      });
    }

    if (context.mode === "finalization") {
      // No native language at finalization → warning
      const hasNative = languages.some((lang) => lang.isNative);
      if (!hasNative) {
        issues.push({
          code: "KNOWLEDGE_NO_NATIVE_LANGUAGE",
          message: "No native language selected",
          field: "languages",
          severity: "warning",
          suggestion: "Select a native language for your character",
        });
      }

      // Unspent points at finalization → warning
      const remaining = budget - totalSpent;
      if (remaining > 0) {
        issues.push({
          code: "KNOWLEDGE_POINTS_REMAINING",
          message: `${remaining} knowledge points remaining — consider adding more knowledge skills or languages`,
          field: "knowledgeSkills",
          severity: "warning",
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
  complexFormValidator,
  skillGroupConstraintValidator,
  contactBudgetValidator,
  knowledgeBudgetValidator,
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
