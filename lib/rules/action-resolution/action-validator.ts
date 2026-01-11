/**
 * Action Validator for Action Resolution
 *
 * Validates action eligibility based on character state, action economy,
 * prerequisites, and combat session context. Ensures all actions are
 * compliant with ruleset constraints before execution.
 */

import type {
  Character,
  ActionPool,
  PoolModifier,
  ActionDefinition,
  ActionPrerequisite,
  CombatSession,
  CombatParticipant,
  ActionAllocation,
  ActionType,
} from "@/lib/types";
import {
  buildActionPool,
  calculateLimit,
  getAttributeValue,
  getSkillRating,
  createWoundModifier,
} from "./pool-builder";
import { DEFAULT_DICE_RULES } from "./dice-engine";

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

/**
 * Severity level of a validation issue
 */
export type ValidationSeverity = "error" | "warning" | "info";

/**
 * A validation error that prevents action execution
 */
export interface ValidationError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Field/area this error relates to */
  field?: string;
  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * A validation warning that allows execution but flags an issue
 */
export interface ValidationWarning {
  /** Warning code */
  code: string;
  /** Human-readable warning message */
  message: string;
  /** What caused this warning */
  reason?: string;
}

/**
 * Complete result of action validation
 */
export interface ValidationResult {
  /** Whether the action can be executed */
  valid: boolean;
  /** Errors that prevent execution */
  errors: ValidationError[];
  /** Warnings that don't prevent execution */
  warnings: ValidationWarning[];
  /** Modified pool after applying all state modifiers */
  modifiedPool?: ActionPool;
  /** Modifiers that were automatically applied */
  appliedModifiers?: PoolModifier[];
  /** Estimated success probability */
  successProbability?: number;
}

// =============================================================================
// ERROR CODES
// =============================================================================

export const ValidationErrorCodes = {
  // Action economy errors
  INSUFFICIENT_ACTIONS: "INSUFFICIENT_ACTIONS",
  WRONG_ACTION_TYPE: "WRONG_ACTION_TYPE",
  INTERRUPT_UNAVAILABLE: "INTERRUPT_UNAVAILABLE",
  NOT_YOUR_TURN: "NOT_YOUR_TURN",

  // Prerequisite errors
  MISSING_SKILL: "MISSING_SKILL",
  INSUFFICIENT_SKILL_RATING: "INSUFFICIENT_SKILL_RATING",
  MISSING_ATTRIBUTE: "MISSING_ATTRIBUTE",
  INSUFFICIENT_ATTRIBUTE_RATING: "INSUFFICIENT_ATTRIBUTE_RATING",
  MISSING_EQUIPMENT: "MISSING_EQUIPMENT",
  EQUIPMENT_NOT_READY: "EQUIPMENT_NOT_READY",
  INVALID_STATE: "INVALID_STATE",
  CONDITION_BLOCKS: "CONDITION_BLOCKS",
  INSUFFICIENT_RESOURCE: "INSUFFICIENT_RESOURCE",
  NO_VALID_TARGET: "NO_VALID_TARGET",
  NOT_AWAKENED: "NOT_AWAKENED",
  NOT_TECHNOMANCER: "NOT_TECHNOMANCER",
  NOT_IN_VEHICLE: "NOT_IN_VEHICLE",

  // Character state errors
  INCAPACITATED: "INCAPACITATED",
  UNCONSCIOUS: "UNCONSCIOUS",
  DEAD: "DEAD",

  // Combat context errors
  NO_COMBAT_SESSION: "NO_COMBAT_SESSION",
  NOT_IN_COMBAT: "NOT_IN_COMBAT",
  COMBAT_PAUSED: "COMBAT_PAUSED",

  // General errors
  ACTION_NOT_FOUND: "ACTION_NOT_FOUND",
  INVALID_ACTION: "INVALID_ACTION",
} as const;

// =============================================================================
// WARNING CODES
// =============================================================================

export const ValidationWarningCodes = {
  LOW_POOL: "LOW_POOL",
  HIGH_GLITCH_CHANCE: "HIGH_GLITCH_CHANCE",
  AT_LIMIT: "AT_LIMIT",
  WOUNDED: "WOUNDED",
  LOW_EDGE: "LOW_EDGE",
  CONDITION_PENALTY: "CONDITION_PENALTY",
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a validation error
 */
function createError(
  code: string,
  message: string,
  field?: string,
  context?: Record<string, unknown>
): ValidationError {
  return { code, message, field, context };
}

/**
 * Create a validation warning
 */
function createWarning(code: string, message: string, reason?: string): ValidationWarning {
  return { code, message, reason };
}

/**
 * Create a failed validation result
 */
function failValidation(errors: ValidationError[]): ValidationResult {
  return {
    valid: false,
    errors,
    warnings: [],
  };
}

/**
 * Create a successful validation result
 */
function passValidation(
  warnings: ValidationWarning[] = [],
  modifiedPool?: ActionPool,
  appliedModifiers?: PoolModifier[]
): ValidationResult {
  return {
    valid: true,
    errors: [],
    warnings,
    modifiedPool,
    appliedModifiers,
  };
}

// =============================================================================
// CHARACTER STATE VALIDATION
// =============================================================================

/**
 * Check if character is in a valid state to act
 */
export function validateCharacterState(character: Character): ValidationResult {
  const errors: ValidationError[] = [];

  // Check character status
  if (character.status === "deceased") {
    errors.push(createError(ValidationErrorCodes.DEAD, "Character is deceased and cannot act"));
    return failValidation(errors);
  }

  // Check condition monitor (simplified - would need actual overflow check)
  const physicalDamage = character.condition?.physicalDamage ?? 0;
  const stunDamage = character.condition?.stunDamage ?? 0;
  const physicalMax = character.derivedStats?.physicalConditionMonitor ?? 10;
  const stunMax = character.derivedStats?.stunConditionMonitor ?? 10;

  // Check for overflow (unconscious/dead)
  if (physicalDamage >= physicalMax) {
    // Check for overflow beyond physical track
    const overflow = physicalDamage - physicalMax;
    const overflowMax = (character.attributes?.body ?? 3) + 1;

    if (overflow >= overflowMax) {
      errors.push(
        createError(ValidationErrorCodes.DEAD, "Character has exceeded overflow and is dead")
      );
      return failValidation(errors);
    }

    errors.push(
      createError(
        ValidationErrorCodes.INCAPACITATED,
        "Character is incapacitated from physical damage overflow",
        "condition.physicalDamage"
      )
    );
    return failValidation(errors);
  }

  if (stunDamage >= stunMax) {
    errors.push(
      createError(
        ValidationErrorCodes.UNCONSCIOUS,
        "Character is unconscious from stun damage",
        "condition.stunDamage"
      )
    );
    return failValidation(errors);
  }

  // Collect warnings about wounds
  const warnings: ValidationWarning[] = [];
  const woundModifier = createWoundModifier(character);
  if (woundModifier && woundModifier.value < 0) {
    warnings.push(
      createWarning(
        ValidationWarningCodes.WOUNDED,
        `Character has ${Math.abs(woundModifier.value)} wound penalty`,
        `${physicalDamage} physical + ${stunDamage} stun damage`
      )
    );
  }

  return passValidation(warnings);
}

// =============================================================================
// ACTION ECONOMY VALIDATION
// =============================================================================

/**
 * Check if participant has sufficient actions for the action type
 */
export function validateActionEconomy(
  actionsRemaining: ActionAllocation,
  actionType: ActionType
): ValidationResult {
  const errors: ValidationError[] = [];

  switch (actionType) {
    case "free":
      // Free actions are effectively unlimited
      if (actionsRemaining.free <= 0) {
        errors.push(
          createError(
            ValidationErrorCodes.INSUFFICIENT_ACTIONS,
            "No free actions remaining (unusual - check for restrictions)"
          )
        );
      }
      break;

    case "simple":
      if (actionsRemaining.simple <= 0) {
        errors.push(
          createError(
            ValidationErrorCodes.INSUFFICIENT_ACTIONS,
            "No simple actions remaining this turn",
            "actionsRemaining.simple",
            { remaining: actionsRemaining.simple }
          )
        );
      }
      break;

    case "complex":
      // Complex actions require either 1 complex OR 2 simple actions
      if (actionsRemaining.complex <= 0 && actionsRemaining.simple < 2) {
        errors.push(
          createError(
            ValidationErrorCodes.INSUFFICIENT_ACTIONS,
            "No complex actions remaining (requires 1 complex or 2 simple actions)",
            "actionsRemaining.complex",
            {
              complexRemaining: actionsRemaining.complex,
              simpleRemaining: actionsRemaining.simple,
            }
          )
        );
      }
      break;

    case "interrupt":
      if (!actionsRemaining.interrupt) {
        errors.push(
          createError(
            ValidationErrorCodes.INTERRUPT_UNAVAILABLE,
            "Interrupt action already used this initiative pass"
          )
        );
      }
      break;
  }

  if (errors.length > 0) {
    return failValidation(errors);
  }

  return passValidation();
}

// =============================================================================
// PREREQUISITE VALIDATION
// =============================================================================

/**
 * Validate a single prerequisite
 */
function validateSinglePrerequisite(
  character: Character,
  prereq: ActionPrerequisite
): ValidationError | null {
  const { type, requirement, minimumValue, negated } = prereq;
  let hasMet = false;

  switch (type) {
    case "skill":
      hasMet = getSkillRating(character, requirement) > 0;
      break;

    case "skill_rating":
      hasMet = getSkillRating(character, requirement) >= (minimumValue ?? 1);
      break;

    case "attribute":
      hasMet = getAttributeValue(character, requirement) > 0;
      break;

    case "attribute_rating":
      hasMet = getAttributeValue(character, requirement) >= (minimumValue ?? 1);
      break;

    case "quality":
      // Check if character has the quality (in either positive or negative qualities)
      hasMet =
        (character.positiveQualities?.some((q) => q.qualityId === requirement) ?? false) ||
        (character.negativeQualities?.some((q) => q.qualityId === requirement) ?? false);
      break;

    case "equipment":
      // Check if character has the required equipment type
      // Ranged weapon subcategories from catalog
      const rangedSubcategories = [
        "light-pistol",
        "heavy-pistol",
        "hold-out",
        "machine-pistol",
        "smg",
        "assault-rifle",
        "rifle",
        "sniper-rifle",
        "shotgun",
        "machine-gun",
        "cannon",
        "launcher",
      ];
      switch (requirement) {
        case "ranged_weapon":
          // Check for firearms or ranged weapons by subcategory
          hasMet =
            character.weapons?.some((w) => {
              const subcat = (w.subcategory || "").toLowerCase();
              return rangedSubcategories.includes(subcat);
            }) ?? false;
          break;
        case "melee_weapon":
          // Check for melee weapons by subcategory
          hasMet =
            character.weapons?.some((w) => {
              const subcat = (w.subcategory || "").toLowerCase();
              return subcat === "melee";
            }) ?? false;
          break;
        case "throwing_weapon":
          // Check for throwing weapons by subcategory
          hasMet =
            character.weapons?.some((w) => {
              const subcat = (w.subcategory || "").toLowerCase();
              return (
                subcat === "throwingweapons" ||
                subcat === "throwing-weapons" ||
                subcat === "grenades"
              );
            }) ?? false;
          break;
        case "weapon":
          // Check for any weapon
          hasMet = (character.weapons?.length ?? 0) > 0;
          break;
        case "matrix_device":
          // Check for cyberdeck, commlink, or technomancer
          hasMet =
            (character.gear?.some((g) => {
              const cat = (g.category || "").toLowerCase();
              return cat === "cyberdeck" || cat === "commlink" || cat === "deck";
            }) ??
              false) ||
            character.magicalPath === "technomancer";
          break;
        case "firing_mode_sa":
        case "firing_mode_bf":
        case "firing_mode_fa":
          // Check if any weapon supports the firing mode
          const mode = requirement.replace("firing_mode_", "").toUpperCase();
          hasMet =
            character.weapons?.some((w) => {
              const modes = w.mode || [];
              return Array.isArray(modes) ? modes.includes(mode) : false;
            }) ?? false;
          break;
        case "ammunition_clip":
        case "holstered_weapon":
          // These require more detailed state tracking
          hasMet = (character.weapons?.length ?? 0) > 0;
          break;
        default:
          // Fallback: check gear by name or category
          hasMet =
            (character.gear?.some((g) => g.name === requirement || g.category === requirement) ??
              false) ||
            (character.weapons?.some((w) => w.name === requirement || w.category === requirement) ??
              false);
      }
      break;

    case "equipment_ready":
      // Check if equipment is ready/drawn
      // For now, assume equipment is ready if character has it
      // Ranged weapon subcategories from catalog
      const readyRangedSubcategories = [
        "light-pistol",
        "heavy-pistol",
        "hold-out",
        "machine-pistol",
        "smg",
        "assault-rifle",
        "rifle",
        "sniper-rifle",
        "shotgun",
        "machine-gun",
        "cannon",
        "launcher",
      ];
      switch (requirement) {
        case "ranged_weapon":
          hasMet =
            character.weapons?.some((w) => {
              const subcat = (w.subcategory || "").toLowerCase();
              return readyRangedSubcategories.includes(subcat);
            }) ?? false;
          break;
        case "melee_weapon":
          hasMet =
            character.weapons?.some((w) => {
              const subcat = (w.subcategory || "").toLowerCase();
              return subcat === "melee";
            }) ?? false;
          break;
        case "throwing_weapon":
          hasMet =
            character.weapons?.some((w) => {
              const subcat = (w.subcategory || "").toLowerCase();
              return (
                subcat === "throwingweapons" ||
                subcat === "throwing-weapons" ||
                subcat === "grenades"
              );
            }) ?? false;
          break;
        default:
          hasMet =
            (character.weapons?.length ?? 0) > 0 ||
            (character.gear?.some((g) => g.name === requirement || g.category === requirement) ??
              false);
      }
      break;

    case "state":
      // Check character state (would need more detailed state tracking)
      hasMet = true; // Simplified for now
      break;

    case "condition":
      // Check if character has/doesn't have a condition
      // Would need condition tracking system
      hasMet = true; // Simplified for now
      break;

    case "resource":
      // Check resource availability
      if (requirement === "edge") {
        hasMet = (character.attributes?.edge ?? 0) >= (minimumValue ?? 1);
      } else if (requirement === "ammunition") {
        // Would need ammo tracking
        hasMet = true;
      }
      break;

    case "target":
      // Target validation is done separately
      hasMet = true;
      break;

    case "magic":
      // Check if character is awakened (has magic attribute)
      // For 'awakened' requirement, just check magic > 0
      // For specific traditions, check magicalPath
      const magicAttr = character.attributes?.magic ?? 0;
      const magicalPath = character.magicalPath || "";
      if (requirement === "awakened") {
        hasMet = magicAttr > 0;
      } else if (requirement === "spellcaster") {
        hasMet =
          magicAttr > 0 && ["full-mage", "aspected-mage", "mystic-adept"].includes(magicalPath);
      } else {
        // Default: check magic > 0 and valid magical path
        hasMet =
          magicAttr > 0 &&
          ["full-mage", "aspected-mage", "mystic-adept", "adept"].includes(magicalPath);
      }
      break;

    case "technomancer":
      // Check if character is a technomancer
      hasMet =
        (character.attributes?.resonance ?? 0) > 0 && character.magicalPath === "technomancer";
      break;

    case "vehicle":
      // Would need vehicle/rigger state tracking
      hasMet = true; // Simplified for now
      break;

    default:
      hasMet = true;
  }

  // Handle negation
  if (negated) {
    hasMet = !hasMet;
  }

  if (!hasMet) {
    return createError(
      getPrerequisiteErrorCode(type),
      prereq.description ?? `Prerequisite not met: ${type} - ${requirement}`,
      type,
      { requirement, minimumValue }
    );
  }

  return null;
}

/**
 * Get the appropriate error code for a prerequisite type
 */
function getPrerequisiteErrorCode(type: string): string {
  switch (type) {
    case "skill":
    case "skill_rating":
      return ValidationErrorCodes.MISSING_SKILL;
    case "attribute":
    case "attribute_rating":
      return ValidationErrorCodes.MISSING_ATTRIBUTE;
    case "equipment":
      return ValidationErrorCodes.MISSING_EQUIPMENT;
    case "equipment_ready":
      return ValidationErrorCodes.EQUIPMENT_NOT_READY;
    case "state":
      return ValidationErrorCodes.INVALID_STATE;
    case "condition":
      return ValidationErrorCodes.CONDITION_BLOCKS;
    case "resource":
      return ValidationErrorCodes.INSUFFICIENT_RESOURCE;
    case "target":
      return ValidationErrorCodes.NO_VALID_TARGET;
    case "magic":
      return ValidationErrorCodes.NOT_AWAKENED;
    case "technomancer":
      return ValidationErrorCodes.NOT_TECHNOMANCER;
    case "vehicle":
      return ValidationErrorCodes.NOT_IN_VEHICLE;
    default:
      return "PREREQUISITE_NOT_MET";
  }
}

/**
 * Validate all prerequisites for an action
 */
export function validatePrerequisites(
  character: Character,
  prerequisites: ActionPrerequisite[]
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const prereq of prerequisites) {
    const error = validateSinglePrerequisite(character, prereq);
    if (error) {
      errors.push(error);
    }
  }

  if (errors.length > 0) {
    return failValidation(errors);
  }

  return passValidation();
}

// =============================================================================
// COMBAT SESSION VALIDATION
// =============================================================================

/**
 * Validate combat session context
 */
export function validateCombatContext(
  session: CombatSession,
  participantId: string
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check session status
  if (session.status === "completed" || session.status === "abandoned") {
    errors.push(createError(ValidationErrorCodes.NO_COMBAT_SESSION, "Combat session has ended"));
    return failValidation(errors);
  }

  if (session.status === "paused") {
    errors.push(createError(ValidationErrorCodes.COMBAT_PAUSED, "Combat is currently paused"));
    return failValidation(errors);
  }

  // Find participant
  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) {
    errors.push(
      createError(
        ValidationErrorCodes.NOT_IN_COMBAT,
        "Character is not a participant in this combat"
      )
    );
    return failValidation(errors);
  }

  // Check participant status
  if (participant.status === "out") {
    errors.push(createError(ValidationErrorCodes.INCAPACITATED, "Participant is out of combat"));
    return failValidation(errors);
  }

  return passValidation();
}

// =============================================================================
// STATE MODIFIER CALCULATION
// =============================================================================

/**
 * Calculate all modifiers that should apply based on character state
 */
export function calculateStateModifiers(
  character: Character,
  action: ActionDefinition,
  session?: CombatSession,
  participantId?: string
): PoolModifier[] {
  const modifiers: PoolModifier[] = [];

  // Wound modifiers
  const woundMod = createWoundModifier(character);
  if (woundMod) {
    modifiers.push(woundMod);
  }

  // Participant conditions (from combat session)
  if (session && participantId) {
    const participant = session.participants.find((p) => p.id === participantId);
    if (participant) {
      for (const condition of participant.conditions) {
        if (condition.poolModifier) {
          modifiers.push({
            source: "situational",
            value: condition.poolModifier,
            description: condition.name,
          });
        }
      }
    }

    // Environment modifiers
    if (session.environment.customModifiers) {
      for (const envMod of session.environment.customModifiers) {
        // Check if this modifier affects the action
        if (!envMod.affectsActions || envMod.affectsActions.includes(action.id)) {
          modifiers.push({
            source: "environmental",
            value: envMod.poolModifier,
            description: envMod.name,
          });
        }
      }
    }

    // Visibility modifiers
    if (session.environment.visibility) {
      const visibilityMod = getVisibilityModifier(session.environment.visibility);
      if (visibilityMod !== 0) {
        modifiers.push({
          source: "environmental",
          value: visibilityMod,
          description: `Visibility: ${session.environment.visibility}`,
        });
      }
    }
  }

  // Action-specific modifiers from the action definition
  for (const actionMod of action.modifiers) {
    // Would need to evaluate condition here
    if (!actionMod.condition) {
      modifiers.push({
        source: "situational",
        value: actionMod.value,
        description: actionMod.description,
      });
    }
  }

  return modifiers;
}

/**
 * Get pool modifier for visibility conditions
 */
function getVisibilityModifier(visibility: string): number {
  switch (visibility) {
    case "dim":
      return -1;
    case "dark":
      return -3;
    case "pitch-black":
      return -6;
    default:
      return 0;
  }
}

// =============================================================================
// MAIN VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate whether a character can perform an action
 */
export function validateActionEligibility(
  character: Character,
  action: ActionDefinition,
  combatSession?: CombatSession,
  participantId?: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // 1. Validate character state
  const stateResult = validateCharacterState(character);
  if (!stateResult.valid) {
    return stateResult;
  }
  warnings.push(...stateResult.warnings);

  // 2. Validate prerequisites
  const prereqResult = validatePrerequisites(character, action.prerequisites);
  if (!prereqResult.valid) {
    return prereqResult;
  }

  // 3. Validate combat context if in combat
  if (combatSession && participantId) {
    const combatResult = validateCombatContext(combatSession, participantId);
    if (!combatResult.valid) {
      return combatResult;
    }

    // 4. Validate action economy
    const participant = combatSession.participants.find((p) => p.id === participantId);
    if (participant) {
      const economyResult = validateActionEconomy(participant.actionsRemaining, action.type);
      if (!economyResult.valid) {
        return economyResult;
      }

      // Check if it's the participant's turn (for non-interrupt actions)
      if (action.type !== "interrupt" && action.type !== "free") {
        const currentTurnId = combatSession.initiativeOrder[combatSession.currentTurn];
        if (currentTurnId !== participantId) {
          errors.push(
            createError(ValidationErrorCodes.NOT_YOUR_TURN, "It is not your turn to act")
          );
          return failValidation(errors);
        }
      }
    }
  }

  // 5. Calculate state modifiers and build pool
  const stateModifiers = calculateStateModifiers(character, action, combatSession, participantId);

  // Build the action pool
  let modifiedPool: ActionPool | undefined;
  if (action.rollConfig) {
    // Determine limit
    let limit: number | undefined;
    let limitSource: string | undefined;
    if (action.rollConfig.limitType) {
      const limitType = action.rollConfig.limitType.toLowerCase();
      if (limitType === "physical" || limitType === "mental" || limitType === "social") {
        limit = calculateLimit(character, limitType);
        limitSource = `${action.rollConfig.limitType} Limit`;
      }
    }

    const poolOptions: import("@/lib/types").PoolBuildOptions = {
      attribute: action.rollConfig.attribute,
      skill: action.rollConfig.skill,
      situationalModifiers: stateModifiers,
      limit,
      limitSource,
    };

    modifiedPool = buildActionPool(character, poolOptions);

    // Add warnings about pool
    if (modifiedPool.totalDice <= 2) {
      warnings.push(
        createWarning(
          ValidationWarningCodes.LOW_POOL,
          `Very low dice pool (${modifiedPool.totalDice} dice)`,
          "Consider Edge or situational bonuses"
        )
      );
    }

    // Calculate glitch probability warning
    if (modifiedPool.totalDice > 0) {
      const glitchChance = calculateGlitchProbability(modifiedPool.totalDice);
      if (glitchChance > 0.15) {
        warnings.push(
          createWarning(
            ValidationWarningCodes.HIGH_GLITCH_CHANCE,
            `${Math.round(glitchChance * 100)}% chance of glitch`,
            `Rolling ${modifiedPool.totalDice} dice`
          )
        );
      }
    }
  }

  return {
    valid: true,
    errors: [],
    warnings,
    modifiedPool,
    appliedModifiers: stateModifiers,
  };
}

/**
 * Validate action cost (can character afford the resources)
 */
export function validateActionCost(
  character: Character,
  action: ActionDefinition
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!action.cost.resourceCosts) {
    return passValidation();
  }

  for (const resourceCost of action.cost.resourceCosts) {
    if (resourceCost.optional) continue;

    switch (resourceCost.type) {
      case "edge":
        const edgeCurrent = character.attributes?.edge ?? 0;
        const edgeCost = typeof resourceCost.amount === "number" ? resourceCost.amount : 1;
        if (edgeCurrent < edgeCost) {
          errors.push(
            createError(
              ValidationErrorCodes.INSUFFICIENT_RESOURCE,
              `Insufficient Edge (need ${edgeCost}, have ${edgeCurrent})`,
              "edge"
            )
          );
        }
        break;

      case "ammunition":
        // Would need to check weapon ammo
        break;

      // Add other resource types as needed
    }
  }

  if (errors.length > 0) {
    return failValidation(errors);
  }

  return passValidation();
}

/**
 * Full validation of an action including all checks
 */
export function validateAction(
  character: Character,
  action: ActionDefinition,
  combatSession?: CombatSession,
  participantId?: string
): ValidationResult {
  // Validate eligibility
  const eligibilityResult = validateActionEligibility(
    character,
    action,
    combatSession,
    participantId
  );
  if (!eligibilityResult.valid) {
    return eligibilityResult;
  }

  // Validate cost
  const costResult = validateActionCost(character, action);
  if (!costResult.valid) {
    return {
      valid: false,
      errors: costResult.errors,
      warnings: [...eligibilityResult.warnings, ...costResult.warnings],
      modifiedPool: eligibilityResult.modifiedPool,
      appliedModifiers: eligibilityResult.appliedModifiers,
    };
  }

  return {
    valid: true,
    errors: [],
    warnings: [...eligibilityResult.warnings, ...costResult.warnings],
    modifiedPool: eligibilityResult.modifiedPool,
    appliedModifiers: eligibilityResult.appliedModifiers,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate probability of glitch (more than half 1s)
 */
function calculateGlitchProbability(diceCount: number): number {
  // Simplified calculation - for exact, would need binomial distribution
  // P(glitch) = P(more than half are 1s) where P(1) = 1/6
  if (diceCount <= 0) return 0;
  if (diceCount === 1) return 1 / 6; // 1 is more than half of 1

  // Approximate using normal distribution for larger pools
  const p = 1 / 6;
  const mean = diceCount * p;
  const threshold = diceCount / 2;

  // For small pools, just estimate
  if (diceCount <= 4) {
    return 0.05; // Rough estimate
  }

  // For larger pools, glitch probability decreases
  return Math.max(0.01, 0.15 - (diceCount - 4) * 0.02);
}

/**
 * Get list of blockers preventing an action
 */
export function getActionBlockers(
  character: Character,
  action: ActionDefinition,
  combatSession?: CombatSession,
  participantId?: string
): string[] {
  const result = validateAction(character, action, combatSession, participantId);
  return result.errors.map((e) => e.message);
}

/**
 * Check if action can be performed (simple boolean)
 */
export function canPerformAction(
  character: Character,
  action: ActionDefinition,
  combatSession?: CombatSession,
  participantId?: string
): boolean {
  const result = validateAction(character, action, combatSession, participantId);
  return result.valid;
}
