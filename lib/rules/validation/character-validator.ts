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

import type { Character, CharacterDraft, AdeptPower, FocusItem } from "@/lib/types/character";
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
import type { LanguageSkill, KnowledgeSkill, CharacterSpell } from "@/lib/types/character";
import type {
  ComplexFormData,
  SkillGroupData,
  SpellsCatalogData,
  AdeptPowerCatalogItem,
  FocusCatalogItemData,
} from "../loader-types";
import {
  canDesignateForFreeSkill,
  getFreeSkillAllocationStatus,
  type FreeSkillConfig,
} from "../skills/free-skills";
import { getMaxConnection, getMaxLoyalty, calculateContactPoints } from "../contacts";
import { getQualityId } from "@/lib/types/creation-selections";

// =============================================================================
// CORE VALIDATORS
// =============================================================================

// Reverse of MAGICAL_PATH_SELECTION_MAP: character field → priority table path
const CHARACTER_TO_PRIORITY_PATH: Record<string, string> = {
  "full-mage": "magician",
};

const PRIORITY_CATEGORIES = ["metatype", "attributes", "magic", "skills", "resources"] as const;
const VALID_LEVELS = ["A", "B", "C", "D", "E"] as const;

/**
 * Validate priority assignment consistency.
 * Ensures unique A-E levels, metatype validity for chosen priority,
 * and magic path validity for chosen priority.
 */
const priorityConsistencyValidator: ValidatorDefinition = {
  id: "priority-consistency",
  name: "Priority Consistency",
  description:
    "Validates priority assignments are complete, unique, and consistent with selections",
  modes: ["creation", "finalization"],
  priority: 0,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, creationState, ruleset, mode } = context;

    // Only applies to priority-based creation methods
    if (!creationState?.priorities) {
      return issues;
    }

    const priorities = creationState.priorities;

    // --- Check 1: Completeness & Uniqueness ---

    const assignedCategories = Object.keys(priorities);
    const missingCategories = PRIORITY_CATEGORIES.filter((c) => !assignedCategories.includes(c));

    if (missingCategories.length > 0) {
      issues.push({
        code: "PRIORITY_INCOMPLETE",
        message: `Priority assignments incomplete — missing: ${missingCategories.join(", ")}`,
        field: "priorities",
        severity: mode === "finalization" ? "error" : "warning",
      });
    }

    // Validate each assigned level is A-E
    for (const [category, level] of Object.entries(priorities)) {
      if (!(VALID_LEVELS as readonly string[]).includes(level)) {
        issues.push({
          code: "PRIORITY_INVALID_LEVEL",
          message: `Priority "${category}" has invalid level "${level}" — must be A through E`,
          field: `priorities.${category}`,
          severity: "error",
        });
      }
    }

    // Check for duplicate levels
    const levelCounts: Record<string, string[]> = {};
    for (const [category, level] of Object.entries(priorities)) {
      if (!levelCounts[level]) levelCounts[level] = [];
      levelCounts[level].push(category);
    }

    let hasDuplicates = false;
    for (const [level, categories] of Object.entries(levelCounts)) {
      if (categories.length > 1) {
        hasDuplicates = true;
        issues.push({
          code: "PRIORITY_DUPLICATE_LEVEL",
          message: `Priority level ${level} is assigned to multiple categories: ${categories.join(", ")}`,
          field: "priorities",
          severity: "error",
        });
      }
    }

    // Short-circuit: metatype/magic checks are meaningless with duplicates
    if (hasDuplicates) {
      return issues;
    }

    // Load priority table from ruleset
    const prioritiesModule = getModule<{
      table: Record<
        string,
        {
          metatype: { available: string[] };
          magic: { options: Array<{ path: string }> };
        }
      >;
    }>(ruleset, "priorities");

    if (!prioritiesModule?.table) {
      return issues;
    }

    const table = prioritiesModule.table;

    // --- Check 2: Metatype validity ---

    const metatypeLevel = priorities.metatype;
    if (metatypeLevel && character.metatype && table[metatypeLevel]) {
      const availableMetatypes = table[metatypeLevel].metatype.available;
      if (!availableMetatypes.includes(character.metatype)) {
        issues.push({
          code: "PRIORITY_METATYPE_INVALID",
          message: `Metatype "${character.metatype}" is not available at priority ${metatypeLevel} — available: ${availableMetatypes.join(", ")}`,
          field: "metatype",
          severity: "error",
        });
      }
    }

    // --- Check 3: Magic path validity ---

    const magicLevel = priorities.magic;
    if (magicLevel && table[magicLevel]) {
      // Resolve magic path from character or creation selections
      const rawMagicalPath =
        character.magicalPath && character.magicalPath !== "mundane"
          ? character.magicalPath
          : (creationState?.selections?.["magical-path"] as string | undefined);

      if (rawMagicalPath && rawMagicalPath !== "mundane") {
        // Map character field values back to priority table values (e.g. "full-mage" → "magician")
        const priorityPath = CHARACTER_TO_PRIORITY_PATH[rawMagicalPath] ?? rawMagicalPath;
        const availablePaths = table[magicLevel].magic.options.map((o) => o.path);

        if (!availablePaths.includes(priorityPath)) {
          issues.push({
            code: "PRIORITY_MAGIC_PATH_INVALID",
            message: `Magic path "${rawMagicalPath}" is not available at priority ${magicLevel} — available: ${availablePaths.join(", ") || "none"}`,
            field: "magicalPath",
            severity: "error",
          });
        }
      } else {
        // Mundane with non-E magic priority is a waste
        const magicOptions = table[magicLevel].magic.options;
        if (magicOptions.length > 0) {
          issues.push({
            code: "PRIORITY_MAGIC_WASTED",
            message: `Mundane character has magic priority ${magicLevel} — magic options are available but unused`,
            field: "magicalPath",
            severity: "warning",
          });
        }
      }
    }

    return issues;
  },
};

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

    // Validate fake SIN ratings and license constraints
    if (character.identities) {
      character.identities.forEach((identity, i) => {
        const sin = identity.sin;
        if (sin?.type === "fake") {
          const sinRating = sin.rating;
          if (sinRating < 1 || sinRating > 6) {
            issues.push({
              code: "SIN_RATING_OUT_OF_RANGE",
              message: `Fake SIN rating must be between 1 and 6 (got ${sinRating})`,
              field: `identities[${i}].sin.rating`,
              severity: "error",
              suggestion: "Set the fake SIN rating to a value between 1 and 6",
            });
          }

          if (identity.licenses) {
            identity.licenses.forEach((license, j) => {
              if (license.rating !== undefined && license.rating > sinRating) {
                issues.push({
                  code: "LICENSE_EXCEEDS_SIN_RATING",
                  message: `License rating (${license.rating}) cannot exceed SIN rating (${sinRating})`,
                  field: `identities[${i}].licenses[${j}].rating`,
                  severity: "error",
                  suggestion: "Reduce the license rating to match or be below the SIN rating",
                });
              }
            });
          }
        }
      });
    }

    return issues;
  },
};

// Skills that mystic adepts cannot learn (SR5 Core p.69)
const MYSTIC_ADEPT_RESTRICTED_SKILLS = ["counterspelling"];

// Magical paths that support mentor spirits
const MENTOR_SPIRIT_PATHS = ["full-mage", "adept", "mystic-adept", "aspected-mage"];

// Magical paths that require a tradition selection
const TRADITION_REQUIRED_PATHS = ["full-mage", "mystic-adept", "aspected-mage"];

// Map creation selection values to character field values
const MAGICAL_PATH_SELECTION_MAP: Record<string, string> = {
  magician: "full-mage",
};

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
    const { character, mode, creationState } = context;

    // Resolve magical path — character field uses "full-mage", selections use "magician"
    const rawMagicalPath =
      character.magicalPath && character.magicalPath !== "mundane"
        ? character.magicalPath
        : (creationState?.selections?.["magical-path"] as string | undefined);

    // Normalize: map selection values (e.g. "magician") to character values (e.g. "full-mage")
    const normalizedPath = rawMagicalPath
      ? (MAGICAL_PATH_SELECTION_MAP[rawMagicalPath] ?? rawMagicalPath)
      : undefined;

    // Resolve tradition from character or creationState
    const tradition =
      character.tradition || (creationState?.selections?.["tradition"] as string | undefined);

    // --- Mentor spirit validation (applies even to mundane/technomancer) ---

    if (character.mentorSpirit) {
      if (!normalizedPath || normalizedPath === "mundane") {
        issues.push({
          code: "MENTOR_SPIRIT_INVALID_PATH",
          message: "Mundane characters cannot have a mentor spirit",
          field: "mentorSpirit",
          severity: "error",
          suggestion: "Remove the mentor spirit or select a magical path",
        });
      } else if (normalizedPath === "technomancer") {
        issues.push({
          code: "MENTOR_SPIRIT_TECHNOMANCER",
          message:
            "Technomancers use paragons, not mentor spirits. Paragon support is not yet implemented.",
          field: "mentorSpirit",
          severity: "error",
          suggestion: "Remove the mentor spirit from this technomancer",
        });
      } else if (!MENTOR_SPIRIT_PATHS.includes(normalizedPath)) {
        issues.push({
          code: "MENTOR_SPIRIT_INVALID_PATH",
          message: `Magical path "${normalizedPath}" does not support mentor spirits`,
          field: "mentorSpirit",
          severity: "error",
        });
      }
    }

    // --- Initiation / metamagics at creation validation ---

    if (
      normalizedPath &&
      normalizedPath !== "mundane" &&
      (mode === "creation" || mode === "finalization")
    ) {
      if (character.initiateGrade !== undefined && character.initiateGrade > 0) {
        issues.push({
          code: "INITIATION_AT_CREATION",
          message: "Initiation grade must be 0 at character creation",
          field: "initiateGrade",
          severity: "error",
          suggestion: "Initiation is available through advancement after character creation",
        });
      }

      if (character.metamagics && character.metamagics.length > 0) {
        issues.push({
          code: "METAMAGICS_AT_CREATION",
          message: "Metamagics cannot be selected at character creation",
          field: "metamagics",
          severity: "error",
          suggestion: "Metamagics are unlocked through initiation during advancement",
        });
      }
    }

    // --- Remaining magic checks only apply to magical characters ---

    if (!normalizedPath || normalizedPath === "mundane") {
      return issues;
    }

    // Mentor spirit info-level warning for valid paths without one selected
    if (
      MENTOR_SPIRIT_PATHS.includes(normalizedPath) &&
      !character.mentorSpirit &&
      mode === "finalization"
    ) {
      issues.push({
        code: "NO_MENTOR_SPIRIT",
        message: "No mentor spirit selected (optional but recommended)",
        field: "mentorSpirit",
        severity: "info",
      });
    }

    // Tradition required for full mage, mystic adept, aspected mage
    if (TRADITION_REQUIRED_PATHS.includes(normalizedPath) && !tradition) {
      issues.push({
        code: "MISSING_TRADITION",
        message: "Magical character must have a tradition selected",
        field: "tradition",
        severity: mode === "finalization" ? "error" : "warning",
        suggestion: "Select a magical tradition (e.g., Hermetic, Shaman)",
      });
    }

    // Mystic adepts cannot have Counterspelling skill (SR5 Core p.69)
    if (normalizedPath === "mystic-adept" && character.skills) {
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
      (normalizedPath === "adept" || normalizedPath === "mystic-adept") &&
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
      (normalizedPath === "full-mage" || normalizedPath === "mystic-adept") &&
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
      normalizedPath === "technomancer" &&
      (!character.complexForms || character.complexForms.length === 0)
    ) {
      issues.push({
        code: "NO_COMPLEX_FORMS",
        message: "Technomancer has no complex forms selected",
        field: "complexForms",
        severity: mode === "finalization" ? "error" : "warning",
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
 * Validate free skill designations from creation state
 */
const freeSkillValidator: ValidatorDefinition = {
  id: "free-skills",
  name: "Free Skill Allocation",
  description: "Validates free skill designations match allowed categories and slot counts",
  modes: ["creation", "finalization"],
  priority: 6,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, creationState, ruleset, mode } = context;

    // Only relevant if we have creation state with free skill data
    if (!creationState?.selections) {
      return issues;
    }

    const designations = creationState.selections.freeSkillDesignations;
    if (!designations) {
      return issues;
    }

    // Build skill categories from ruleset (if available)
    const skillCategories: Record<string, string | undefined> = {};
    const skillsModule = ruleset.modules?.skills as
      | { skills?: Array<{ id: string; category?: string }> }
      | undefined;
    if (skillsModule?.skills) {
      for (const skill of skillsModule.skills) {
        skillCategories[skill.id] = skill.category;
      }
    }

    // Get free skill configs from the magic priority selection
    // These come from the priority table via the creation method
    const freeSkillConfigs: FreeSkillConfig[] = [];

    // Extract from creationState selections if available
    // The free skill configs are determined by the magic priority and path
    // We reconstruct them from the designations to validate
    const magicalPath = character.magicalPath;

    // Build expected config based on magical path and designations
    if (magicalPath === "full-mage" || magicalPath === "mystic-adept") {
      // Magicians get magical free skills
      if (designations.magical) {
        freeSkillConfigs.push({
          type: "magical",
          rating: 5, // Default; actual rating comes from priority table
          count: designations.magical.length, // Validate based on actual designations
        });
      }
    } else if (magicalPath === "technomancer") {
      // Technomancers get resonance free skills
      if (designations.resonance) {
        freeSkillConfigs.push({
          type: "resonance",
          rating: 5,
          count: designations.resonance.length,
        });
      }
    } else if (magicalPath === "adept") {
      // Adepts get active free skills
      if (designations.active) {
        freeSkillConfigs.push({
          type: "active",
          rating: 4,
          count: designations.active.length,
        });
      }
    }

    // Validate designated skills match allowed categories
    if (designations.magical && designations.magical.length > 0) {
      if (
        !magicalPath ||
        (magicalPath !== "full-mage" &&
          magicalPath !== "mystic-adept" &&
          magicalPath !== "aspected-mage")
      ) {
        issues.push({
          code: "FREE_SKILL_WRONG_CATEGORY",
          message:
            "Magical free skills are only available for magicians, mystic adepts, and aspected mages",
          field: "freeSkillDesignations.magical",
          severity: "error",
        });
      } else {
        // Validate each designated skill is actually a magical skill
        for (const skillId of designations.magical) {
          const result = canDesignateForFreeSkill(
            skillId,
            skillCategories[skillId],
            "magical",
            designations.magical.filter((id) => id !== skillId),
            designations.magical.length
          );
          if (!result.canDesignate && result.reason === `Skill must be magical type`) {
            issues.push({
              code: "FREE_SKILL_WRONG_CATEGORY",
              message: `Skill "${skillId}" is not a magical skill and cannot receive free magical allocation`,
              field: `freeSkillDesignations.magical`,
              severity: "error",
            });
          }
        }
      }
    }

    if (designations.resonance && designations.resonance.length > 0) {
      if (magicalPath !== "technomancer") {
        issues.push({
          code: "FREE_SKILL_WRONG_CATEGORY",
          message: "Resonance free skills are only available for technomancers",
          field: "freeSkillDesignations.resonance",
          severity: "error",
        });
      } else {
        for (const skillId of designations.resonance) {
          const result = canDesignateForFreeSkill(
            skillId,
            skillCategories[skillId],
            "resonance",
            designations.resonance.filter((id) => id !== skillId),
            designations.resonance.length
          );
          if (!result.canDesignate && result.reason === `Skill must be resonance type`) {
            issues.push({
              code: "FREE_SKILL_WRONG_CATEGORY",
              message: `Skill "${skillId}" is not a resonance skill and cannot receive free resonance allocation`,
              field: `freeSkillDesignations.resonance`,
              severity: "error",
            });
          }
        }
      }
    }

    // Check for unused free skill slots at finalization (warning only)
    if (mode === "finalization" && freeSkillConfigs.length > 0) {
      const skills = (character.skills as Record<string, number>) ?? {};
      const statuses = getFreeSkillAllocationStatus(skills, freeSkillConfigs, designations);

      for (const status of statuses) {
        if (status.remainingSlots > 0) {
          issues.push({
            code: "FREE_SKILL_SLOTS_UNUSED",
            message: `${status.remainingSlots} free ${status.type} skill slot(s) unused`,
            field: "freeSkillDesignations",
            severity: "warning",
            suggestion: `Designate ${status.type} skills to use your free skill allocation`,
          });
        }
      }
    }

    return issues;
  },
};

/**
 * Validate contact ratings against edition limits
 */
const contactValidator: ValidatorDefinition = {
  id: "contacts",
  name: "Contacts",
  description: "Validates contact ratings against edition limits",
  modes: ["creation", "finalization"],
  priority: 7,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character } = context;

    if (!character.contacts || character.contacts.length === 0) {
      return issues;
    }

    const editionCode = character.editionCode ?? "sr5";
    const maxConnection = getMaxConnection(editionCode);
    const maxLoyalty = getMaxLoyalty(editionCode);

    for (const contact of character.contacts) {
      if (contact.connection > maxConnection) {
        issues.push({
          code: "CONTACT_CONNECTION_EXCEEDED",
          message: `Contact "${contact.name}" has connection ${contact.connection}, which exceeds the maximum of ${maxConnection} for ${editionCode}`,
          field: "contacts",
          severity: "error",
        });
      }

      if (contact.loyalty > maxLoyalty) {
        issues.push({
          code: "CONTACT_LOYALTY_EXCEEDED",
          message: `Contact "${contact.name}" has loyalty ${contact.loyalty}, which exceeds the maximum of ${maxLoyalty} for ${editionCode}`,
          field: "contacts",
          severity: "error",
        });
      }
    }

    // Warn if total contact points exceed charisma-based budget
    if (character.attributes) {
      const charisma = character.attributes["cha"] ?? character.attributes["charisma"] ?? 0;
      if (charisma > 0) {
        const contactBudget = charisma * 3; // SR5: CHA × 3 free contact points
        const totalPoints = character.contacts.reduce(
          (sum, c) => sum + calculateContactPoints(c),
          0
        );
        if (totalPoints > contactBudget) {
          issues.push({
            code: "CONTACT_POINTS_EXCEEDED",
            message: `Total contact points (${totalPoints}) exceed budget of ${contactBudget} (Charisma ${charisma} × 3)`,
            field: "contacts",
            severity: "warning",
            suggestion: "Reduce contact ratings or remove contacts to stay within budget",
          });
        }
      }
    }

    return issues;
  },
};

/**
 * Validate knowledge skills and language selections
 *
 * SR5 Rules:
 * - Characters must have at least one native language at finalization
 * - The Bilingual quality grants exactly 2 native languages; without it, max 1
 * - Non-native language ratings must be 1-6
 * - Knowledge skill ratings must be 1-6
 * - Knowledge skill points budget: (INT + LOG) × 2
 */
const knowledgeLanguageValidator: ValidatorDefinition = {
  id: "knowledge-languages",
  name: "Knowledge & Languages",
  description: "Validates knowledge skills and language selections",
  modes: ["creation", "finalization"],
  priority: 8,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, creationState, mode } = context;

    // Only validate when creation state is available (during creation flow)
    if (!creationState?.selections) {
      return issues;
    }

    const languages: LanguageSkill[] =
      (creationState.selections.languages as LanguageSkill[] | undefined) ?? [];
    const knowledgeSkills: KnowledgeSkill[] =
      (creationState.selections.knowledgeSkills as KnowledgeSkill[] | undefined) ?? [];

    // Determine if character has the bilingual quality
    const positiveQualities =
      (creationState.selections.positiveQualities as Array<string | { id: string }> | undefined) ??
      [];
    const hasBilingual = positiveQualities.some((q) => getQualityId(q) === "bilingual");

    // Count native languages
    const nativeLanguages = languages.filter((lang) => lang.isNative);
    const nativeCount = nativeLanguages.length;
    const maxNative = hasBilingual ? 2 : 1;

    // 1. Native language required (finalization only)
    if (mode === "finalization" && nativeCount === 0 && languages.length > 0) {
      issues.push({
        code: "MISSING_NATIVE_LANGUAGE",
        message: "Character must have at least one native language selected",
        field: "languages",
        severity: "error",
        suggestion: "Mark one of your languages as native",
      });
    }

    // Also flag at finalization if no languages at all
    if (mode === "finalization" && languages.length === 0) {
      issues.push({
        code: "MISSING_NATIVE_LANGUAGE",
        message: "Character must have at least one native language selected",
        field: "languages",
        severity: "error",
        suggestion: "Add a native language in the Knowledge & Languages step",
      });
    }

    // 2. Bilingual quality consistency
    if (hasBilingual && nativeCount < 2 && nativeCount > 0) {
      issues.push({
        code: "BILINGUAL_REQUIRES_TWO_NATIVE",
        message: `Bilingual quality requires 2 native languages, but only ${nativeCount} selected`,
        field: "languages",
        severity: "warning",
        suggestion: "Select a second native language to match the Bilingual quality",
      });
    }

    if (nativeCount > maxNative) {
      issues.push({
        code: "TOO_MANY_NATIVE_LANGUAGES",
        message: `Too many native languages (${nativeCount}): maximum is ${maxNative}${hasBilingual ? " with Bilingual quality" : ""}`,
        field: "languages",
        severity: "error",
        suggestion: hasBilingual
          ? "Remove native designation from extra languages"
          : "Take the Bilingual quality to have 2 native languages, or remove extra native designations",
      });
    }

    // 3. Language rating limits (non-native)
    for (const lang of languages) {
      if (!lang.isNative && (lang.rating < 1 || lang.rating > 6)) {
        issues.push({
          code: "LANGUAGE_RATING_OUT_OF_RANGE",
          message: `Language "${lang.name}" has rating ${lang.rating}, must be 1-6`,
          field: "languages",
          severity: "error",
        });
      }
    }

    // 4. Knowledge skill rating limits
    for (const skill of knowledgeSkills) {
      if (skill.rating < 1 || skill.rating > 6) {
        issues.push({
          code: "KNOWLEDGE_SKILL_RATING_OUT_OF_RANGE",
          message: `Knowledge skill "${skill.name}" has rating ${skill.rating}, must be 1-6`,
          field: "knowledgeSkills",
          severity: "error",
        });
      }
    }

    // 5. Knowledge points overspent (creation mode only)
    if (mode === "creation" || mode === "finalization") {
      const attributes = character.attributes ?? {};
      const int = attributes["int"] ?? attributes["intuition"] ?? 0;
      const log = attributes["log"] ?? attributes["logic"] ?? 0;
      const knowledgePointsBudget = (int + log) * 2;

      if (knowledgePointsBudget > 0) {
        // Calculate total knowledge points spent
        // Languages: non-native language ratings + specialization costs (not native which are free)
        const languagePointsSpent = languages
          .filter((lang) => !lang.isNative)
          .reduce((sum, lang) => sum + lang.rating, 0);

        // Knowledge skills: sum of ratings
        const knowledgePointsSpent = knowledgeSkills.reduce((sum, skill) => sum + skill.rating, 0);

        const totalSpent = languagePointsSpent + knowledgePointsSpent;

        if (totalSpent > knowledgePointsBudget) {
          issues.push({
            code: "KNOWLEDGE_POINTS_OVERSPENT",
            message: `Knowledge points overspent: ${totalSpent} used of ${knowledgePointsBudget} available ((INT ${int} + LOG ${log}) × 2)`,
            field: "knowledgeSkills",
            severity: "error",
            suggestion: "Reduce knowledge skill or language ratings to stay within budget",
          });
        }
      }
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
// SPELL VALIDATOR
// =============================================================================

/** Extract spell ID from mixed string | CharacterSpell format */
function extractSpellId(entry: string | CharacterSpell): string {
  return typeof entry === "string" ? entry : entry.catalogId;
}

/** Magical paths that can cast spells */
const SPELL_CASTING_PATHS = ["full-mage", "aspected-mage", "mystic-adept"];

/** Magical paths that can have adept powers */
const ADEPT_POWER_PATHS = ["adept", "mystic-adept"];

/**
 * Validate spell allocation for spellcasters
 */
const spellValidator: ValidatorDefinition = {
  id: "spells",
  name: "Spells",
  description: "Validates spell allocation for spellcasters",
  modes: ["creation", "finalization"],
  priority: 6,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, ruleset, creationState } = context;

    // Resolve magical path (same pattern as magicValidator)
    const rawMagicalPath =
      character.magicalPath && character.magicalPath !== "mundane"
        ? character.magicalPath
        : (creationState?.selections?.["magical-path"] as string | undefined);
    const normalizedPath = rawMagicalPath
      ? (MAGICAL_PATH_SELECTION_MAP[rawMagicalPath] ?? rawMagicalPath)
      : undefined;

    // Only applies to spellcasting paths
    if (!normalizedPath || !SPELL_CASTING_PATHS.includes(normalizedPath)) {
      return issues;
    }

    // Aspected mage restriction — only sorcery aspect can cast spells
    if (normalizedPath === "aspected-mage") {
      const skillGroups = creationState?.selections?.skillGroups;
      if (skillGroups) {
        const groupKeys = Object.keys(skillGroups);
        const hasSorcery = groupKeys.includes("sorcery");
        const hasConjuring = groupKeys.includes("conjuring");
        const hasEnchanting = groupKeys.includes("enchanting");

        if ((hasConjuring || hasEnchanting) && !hasSorcery) {
          issues.push({
            code: "SPELL_ASPECT_RESTRICTED",
            message: `Aspected ${hasConjuring ? "conjurer" : "enchanter"} cannot select spells — only sorcery-aspected mages can cast spells`,
            field: "spells",
            severity: "error",
          });
          return issues;
        }
      }
      // No magical group selected yet — skip aspect check (allow incomplete state)
    }

    const spellEntries = character.spells || [];
    if (spellEntries.length === 0) {
      return issues; // NO_SPELLS is already handled by magicValidator
    }

    const spellIds = spellEntries.map(extractSpellId);

    // Spell limit check from priority table
    if (creationState?.priorities?.magic) {
      const magicLevel = creationState.priorities.magic;
      const prioritiesModule = getModule<{
        table: Record<
          string,
          {
            magic: {
              options: Array<{ path: string; spells?: number }>;
            };
          }
        >;
      }>(ruleset, "priorities");

      if (prioritiesModule?.table) {
        const levelData = prioritiesModule.table[magicLevel];
        if (levelData?.magic?.options) {
          // Map character path to priority table path
          const priorityPath = CHARACTER_TO_PRIORITY_PATH[normalizedPath] ?? normalizedPath;
          const matchingOption = levelData.magic.options.find((o) => o.path === priorityPath);
          if (matchingOption?.spells !== undefined && spellIds.length > matchingOption.spells) {
            issues.push({
              code: "SPELL_LIMIT_EXCEEDED",
              message: `Cannot select more than ${matchingOption.spells} spells (selected: ${spellIds.length})`,
              field: "spells",
              severity: "error",
            });
          }
        }
      }
    }

    // Get spells catalog from merged ruleset
    const magicModule = getModule<{ spells?: SpellsCatalogData }>(ruleset, "magic");
    const spellsCatalog = magicModule?.spells;

    // Flatten all spell categories into a single lookup set
    const catalogSpellIds = new Set<string>();
    if (spellsCatalog) {
      for (const category of Object.values(spellsCatalog)) {
        if (Array.isArray(category)) {
          for (const spell of category) {
            catalogSpellIds.add(spell.id);
          }
        }
      }
    }

    const invalidSpells: string[] = [];
    const duplicateSpells: string[] = [];
    const seenSpells = new Set<string>();

    for (const spellId of spellIds) {
      if (seenSpells.has(spellId)) {
        duplicateSpells.push(spellId);
      } else {
        seenSpells.add(spellId);
      }

      if (catalogSpellIds.size > 0 && !catalogSpellIds.has(spellId)) {
        invalidSpells.push(spellId);
      }
    }

    if (invalidSpells.length > 0) {
      issues.push({
        code: "SPELL_NOT_FOUND",
        message: `Spells not found in ruleset: ${invalidSpells.join(", ")}`,
        field: "spells",
        severity: "error",
      });
    }

    if (duplicateSpells.length > 0) {
      issues.push({
        code: "SPELL_DUPLICATE",
        message: `Duplicate spells selected: ${duplicateSpells.join(", ")}`,
        field: "spells",
        severity: "error",
      });
    }

    return issues;
  },
};

// =============================================================================
// ADEPT POWER VALIDATOR
// =============================================================================

/** Calculate the expected PP cost from the catalog power definition */
function calculateExpectedPowerPointCost(
  power: AdeptPower,
  catalogPower: AdeptPowerCatalogItem
): number | undefined {
  if (catalogPower.hasRating && power.rating !== undefined && catalogPower.ratings) {
    const ratingEntry = catalogPower.ratings[power.rating];
    return ratingEntry?.powerPointCost;
  }
  return catalogPower.powerPointCost;
}

/** Build a composite key for duplicate detection: catalogId|specification */
function buildAdeptPowerDuplicateKey(power: AdeptPower): string {
  return `${power.catalogId}|${power.specification ?? ""}`;
}

/**
 * Validate adept power allocation for adepts and mystic adepts
 */
const adeptPowerValidator: ValidatorDefinition = {
  id: "adept-powers",
  name: "Adept Powers",
  description: "Validates adept power allocation for adepts and mystic adepts",
  modes: ["creation", "finalization"],
  priority: 6,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, ruleset, creationState } = context;

    // Resolve magical path (same pattern as spellValidator)
    const rawMagicalPath =
      character.magicalPath && character.magicalPath !== "mundane"
        ? character.magicalPath
        : (creationState?.selections?.["magical-path"] as string | undefined);
    const normalizedPath = rawMagicalPath
      ? (MAGICAL_PATH_SELECTION_MAP[rawMagicalPath] ?? rawMagicalPath)
      : undefined;

    // Only applies to adept power paths
    if (!normalizedPath || !ADEPT_POWER_PATHS.includes(normalizedPath)) {
      return issues;
    }

    const powers = character.adeptPowers || [];
    if (powers.length === 0) {
      return issues; // NO_ADEPT_POWERS is already handled by magicValidator
    }

    // Get adept powers catalog from merged ruleset
    const adeptModule = getModule<{ powers: AdeptPowerCatalogItem[] }>(ruleset, "adeptPowers");
    const powersCatalog = adeptModule?.powers || [];
    const catalogMap = new Map(powersCatalog.map((p) => [p.id, p]));

    // Calculate PP budget
    let ppBudget = 0;
    if (normalizedPath === "adept") {
      ppBudget = character.specialAttributes?.magic ?? 0;
    } else if (normalizedPath === "mystic-adept") {
      const allocatedPP =
        (creationState?.selections?.["power-points-allocation"] as number | undefined) ?? 0;
      const karmaSpentOnPP =
        (creationState?.budgets?.["karma-spent-power-points"] as number | undefined) ?? 0;
      ppBudget = allocatedPP + Math.floor(karmaSpentOnPP / 5);
    }

    // Check: zero budget but powers selected
    if (ppBudget === 0) {
      issues.push({
        code: "ADEPT_POWER_NO_BUDGET",
        message: `Adept has powers selected but 0 power points available`,
        field: "adeptPowers",
        severity: normalizedPath === "mystic-adept" ? "warning" : "error",
      });
    }

    const seenKeys = new Set<string>();
    let totalCost = 0;

    for (const power of powers) {
      const catalogPower = catalogMap.get(power.catalogId);

      // Check: catalog existence
      if (!catalogPower) {
        issues.push({
          code: "ADEPT_POWER_NOT_FOUND",
          message: `Adept power "${power.catalogId}" not found in ruleset`,
          field: "adeptPowers",
          severity: "error",
        });
        continue;
      }

      // Check: duplicates (same catalogId + specification)
      const dupeKey = buildAdeptPowerDuplicateKey(power);
      if (seenKeys.has(dupeKey)) {
        issues.push({
          code: "ADEPT_POWER_DUPLICATE",
          message: `Duplicate adept power: ${power.catalogId}${power.specification ? ` (${power.specification})` : ""}`,
          field: "adeptPowers",
          severity: "error",
        });
      } else {
        seenKeys.add(dupeKey);
      }

      // Check: rating required for rated powers
      if (catalogPower.hasRating) {
        if (power.rating === undefined || power.rating === null) {
          issues.push({
            code: "ADEPT_POWER_RATING_REQUIRED",
            message: `Adept power "${power.catalogId}" requires a rating`,
            field: "adeptPowers",
            severity: "error",
          });
        } else {
          const minRating = catalogPower.minRating ?? 1;
          const maxRating = catalogPower.maxRating ?? 6;
          if (power.rating < minRating || power.rating > maxRating) {
            issues.push({
              code: "ADEPT_POWER_RATING_OUT_OF_RANGE",
              message: `Adept power "${power.catalogId}" rating ${power.rating} is outside valid range ${minRating}-${maxRating}`,
              field: "adeptPowers",
              severity: "error",
            });
          }
        }
      }

      // Check: specification required
      if (
        (catalogPower.requiresSkill ||
          catalogPower.requiresAttribute ||
          catalogPower.requiresLimit) &&
        !power.specification
      ) {
        issues.push({
          code: "ADEPT_POWER_REQUIRES_SPECIFICATION",
          message: `Adept power "${power.catalogId}" requires a specification (skill, attribute, or limit)`,
          field: "adeptPowers",
          severity: "error",
        });
      }

      // Check: cost correctness
      const expectedCost = calculateExpectedPowerPointCost(power, catalogPower);
      if (expectedCost !== undefined && Math.abs(power.powerPointCost - expectedCost) > 0.001) {
        issues.push({
          code: "ADEPT_POWER_COST_MISMATCH",
          message: `Adept power "${power.catalogId}" cost ${power.powerPointCost} does not match expected ${expectedCost}`,
          field: "adeptPowers",
          severity: "error",
        });
      }

      totalCost += power.powerPointCost;
    }

    // Check: total PP cost exceeds budget
    if (ppBudget > 0 && totalCost - ppBudget > 0.001) {
      issues.push({
        code: "ADEPT_POWER_PP_EXCEEDED",
        message: `Total power point cost (${totalCost}) exceeds available budget (${ppBudget})`,
        field: "adeptPowers",
        severity: "error",
      });
    }

    return issues;
  },
};

// =============================================================================
// FOCI VALIDATOR
// =============================================================================

/** Magical paths that can bond foci */
const FOCI_PATHS = ["full-mage", "aspected-mage", "mystic-adept", "adept"];

/** Magical paths that can bond qi foci (adept powers only) */
const QI_FOCUS_PATHS = ["adept", "mystic-adept"];

/**
 * Validate foci bonding karma for magical characters
 */
const fociValidator: ValidatorDefinition = {
  id: "foci",
  name: "Foci",
  description: "Validates foci bonding karma calculations and path restrictions",
  modes: ["creation", "finalization"],
  priority: 6,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const { character, ruleset, creationState, mode } = context;

    // Resolve magical path (same pattern as adeptPowerValidator)
    const rawMagicalPath =
      character.magicalPath && character.magicalPath !== "mundane"
        ? character.magicalPath
        : (creationState?.selections?.["magical-path"] as string | undefined);
    const normalizedPath = rawMagicalPath
      ? (MAGICAL_PATH_SELECTION_MAP[rawMagicalPath] ?? rawMagicalPath)
      : undefined;

    // Only applies to magical paths that can bond foci
    if (!normalizedPath || !FOCI_PATHS.includes(normalizedPath)) {
      return issues;
    }

    // Get foci from character or creation selections
    const foci: FocusItem[] =
      character.foci || (creationState?.selections?.foci as FocusItem[] | undefined) || [];

    if (foci.length === 0) {
      return issues;
    }

    // Get foci catalog from merged ruleset
    const fociModule = getModule<{ foci: FocusCatalogItemData[] }>(ruleset, "foci");
    const fociCatalog = fociModule?.foci || [];
    const catalogMap = new Map(fociCatalog.map((f) => [f.id, f]));

    let totalBondedKarma = 0;

    for (const focus of foci) {
      const catalogFocus = catalogMap.get(focus.catalogId);

      // Check: catalog existence
      if (!catalogFocus) {
        issues.push({
          code: "FOCUS_NOT_FOUND",
          message: `Focus "${focus.catalogId}" not found in ruleset`,
          field: "foci",
          severity: "error",
        });
        continue;
      }

      // Check: force range (1-6 for starting characters)
      if (focus.force < 1 || focus.force > 6) {
        issues.push({
          code: "FOCUS_FORCE_OUT_OF_RANGE",
          message: `Focus "${focus.catalogId}" has force ${focus.force}, must be 1-6`,
          field: "foci",
          severity: "error",
        });
      }

      // Check: bonding karma formula (karmaToBond = force × bondingKarmaMultiplier)
      const expectedKarma = focus.force * catalogFocus.bondingKarmaMultiplier;
      if (focus.karmaToBond !== expectedKarma) {
        issues.push({
          code: "FOCUS_KARMA_MISMATCH",
          message: `Focus "${focus.catalogId}" bonding karma ${focus.karmaToBond} does not match expected ${expectedKarma} (force ${focus.force} × multiplier ${catalogFocus.bondingKarmaMultiplier})`,
          field: "foci",
          severity: "error",
        });
      }

      // Check: qi focus path restriction (only adepts and mystic adepts)
      if (catalogFocus.type === "qi" && !QI_FOCUS_PATHS.includes(normalizedPath)) {
        issues.push({
          code: "FOCUS_QI_NOT_ADEPT",
          message: `Qi focus "${focus.catalogId}" can only be used by adepts and mystic adepts`,
          field: "foci",
          severity: "error",
        });
      }

      if (focus.bonded) {
        totalBondedKarma += focus.karmaToBond;
      }
    }

    // Check: budget integrity — budgets["karma-spent-foci"] should match sum of bonded karmaToBond
    const budgetKarma = (creationState?.budgets?.["karma-spent-foci"] as number | undefined) ?? 0;
    if (budgetKarma !== totalBondedKarma) {
      issues.push({
        code: "FOCUS_KARMA_BUDGET_MISMATCH",
        message: `Foci karma budget (${budgetKarma}) does not match sum of bonded foci karma (${totalBondedKarma})`,
        field: "foci",
        severity: "warning",
      });
    }

    // Check: all foci unbonded at finalization (info level)
    if (mode === "finalization") {
      const anyBonded = foci.some((f) => f.bonded);
      if (!anyBonded) {
        issues.push({
          code: "FOCUS_NONE_BONDED",
          message:
            "All foci are unbonded — bonding costs karma but provides no benefit until bonded",
          field: "foci",
          severity: "info",
        });
      }
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
  priorityConsistencyValidator,
  basicInfoValidator,
  attributeValidator,
  identityValidator,
  magicValidator,
  qualityValidator,
  complexFormValidator,
  spellValidator,
  adeptPowerValidator,
  fociValidator,
  skillGroupConstraintValidator,
  freeSkillValidator,
  contactValidator,
  contactBudgetValidator,
  knowledgeBudgetValidator,
  knowledgeLanguageValidator,
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
