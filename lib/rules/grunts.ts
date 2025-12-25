/**
 * Grunt Rules Engine
 *
 * Core game mechanics for grunt/NPC management including:
 * - Condition monitor calculations and damage application
 * - Morale system (checking, breaking, rallying)
 * - Group Edge management
 * - Initiative rolling
 * - Validation (lieutenant stats, team configuration)
 * - Professional Rating modifiers
 * - Simplified combat rules
 *
 * Capability References:
 * - "Casualty calculation MUST be automatic based on damage thresholds"
 * - "The system MUST manage a shared 'Group Edge' pool for grunt teams"
 * - "Morale state MUST be automatically evaluated based on casualty rates"
 * - "Professional Ratings (0-6) MUST govern the default behavior"
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import type {
  GruntTeam,
  GruntStats,
  LieutenantStats,
  GruntSpecialist,
  IndividualGrunt,
  MoraleState,
  ProfessionalRating,
  SimplifiedGruntsRules,
  DamageResult,
  DamageType,
  MoraleTier,
  GruntAttributes,
} from "../types/grunts";
import { DEFAULT_MORALE_TIERS } from "../types/grunts";

// =============================================================================
// CONDITION MONITOR
// =============================================================================

/**
 * Calculate condition monitor size from attributes
 *
 * Formula: 8 + ceil(max(Body, Willpower) / 2)
 *
 * Grunts use a single combined condition monitor (Physical and Stun combined)
 * unlike player characters who have separate tracks.
 *
 * @param body - Body attribute
 * @param willpower - Willpower attribute
 * @returns Condition monitor size (boxes)
 */
export function calculateConditionMonitorSize(
  body: number,
  willpower: number
): number {
  return 8 + Math.ceil(Math.max(body, willpower) / 2);
}

/**
 * Calculate condition monitor size from GruntStats
 */
export function getConditionMonitorSize(stats: GruntStats): number {
  return calculateConditionMonitorSize(
    stats.attributes.body,
    stats.attributes.willpower
  );
}

/**
 * Apply damage to a grunt's condition monitor
 *
 * Grunts use simplified damage tracking:
 * - Single condition monitor for both Physical and Stun
 * - When filled, grunt is incapacitated
 * - Stun damage that overflows converts to Physical
 *
 * @param grunt - Individual grunt to damage
 * @param damage - Amount of damage to apply
 * @param damageType - Type of damage (physical or stun)
 * @param monitorSize - Size of condition monitor
 * @returns Updated damage result
 */
export function applyDamage(
  grunt: IndividualGrunt,
  damage: number,
  damageType: DamageType,
  monitorSize: number
): DamageResult {
  const previousDamage = grunt.currentDamage;
  let newDamage = previousDamage + damage;

  // Cap damage at monitor size
  newDamage = Math.min(newDamage, monitorSize);

  // Update condition monitor visualization
  const conditionMonitor = new Array(monitorSize).fill(false);
  for (let i = 0; i < newDamage; i++) {
    conditionMonitor[i] = true;
  }

  // Determine status
  const isDead = newDamage >= monitorSize;
  const isStunned = damageType === "stun" && newDamage >= monitorSize;

  return {
    gruntId: grunt.id,
    previousDamage,
    newDamage,
    damageApplied: newDamage - previousDamage,
    isStunned,
    isDead,
    conditionMonitor,
  };
}

/**
 * Apply damage using simplified one-hit-kill rules
 *
 * When using "mowing them down" rules, any successful hit
 * immediately incapacitates the grunt.
 *
 * @param grunt - Individual grunt to damage
 * @param monitorSize - Size of condition monitor
 * @returns Updated damage result
 */
export function applySimplifiedDamage(
  grunt: IndividualGrunt,
  monitorSize: number
): DamageResult {
  const previousDamage = grunt.currentDamage;
  const newDamage = monitorSize; // Fill entire monitor

  const conditionMonitor = new Array(monitorSize).fill(true);

  return {
    gruntId: grunt.id,
    previousDamage,
    newDamage,
    damageApplied: newDamage - previousDamage,
    isStunned: false,
    isDead: true,
    conditionMonitor,
  };
}

/**
 * Calculate wound modifier for a grunt based on damage taken
 *
 * Standard: Every 3 boxes of damage = -1 to all dice pools
 *
 * @param damage - Current damage boxes filled
 * @returns Wound modifier (negative number)
 */
export function calculateWoundModifier(damage: number): number {
  return -Math.floor(damage / 3);
}

// =============================================================================
// MORALE SYSTEM
// =============================================================================

/**
 * Get morale tier configuration for a Professional Rating
 *
 * @param professionalRating - Team's Professional Rating (0-6)
 * @returns Morale tier configuration
 */
export function getMoraleTier(professionalRating: ProfessionalRating): MoraleTier {
  return DEFAULT_MORALE_TIERS[professionalRating];
}

/**
 * Calculate the morale break threshold for a team
 *
 * The break threshold is the casualty percentage at which the team's
 * morale breaks and they attempt to flee or surrender.
 *
 * Having a lieutenant increases the threshold by 10%.
 *
 * @param professionalRating - Team's Professional Rating
 * @param hasLieutenant - Whether the team has an active lieutenant
 * @returns Break threshold as percentage (0-100)
 */
export function calculateMoraleThreshold(
  professionalRating: ProfessionalRating,
  hasLieutenant: boolean
): number {
  const baseTier = getMoraleTier(professionalRating);
  const lieutenantBonus = hasLieutenant ? 10 : 0;
  return Math.min(100, baseTier.breakThreshold + lieutenantBonus);
}

/**
 * Calculate current casualty percentage
 *
 * @param casualties - Number of grunts taken out
 * @param initialSize - Initial team size
 * @returns Casualty percentage (0-100)
 */
export function calculateCasualtyPercentage(
  casualties: number,
  initialSize: number
): number {
  if (initialSize === 0) return 0;
  return Math.round((casualties / initialSize) * 100);
}

/**
 * Check current morale state based on casualties
 *
 * Morale States:
 * - steady: Below 50% of break threshold
 * - shaken: Between 50% and 100% of break threshold
 * - broken: At or above break threshold
 * - routed: Broken and failed rally attempt
 *
 * @param team - Grunt team to check
 * @returns Current morale state
 */
export function checkMorale(team: GruntTeam): MoraleState {
  // If already broken/routed, maintain that state
  if (team.state.moraleState === "routed") {
    return "routed";
  }

  const hasLieutenant = team.lieutenant !== undefined;
  const breakThreshold = calculateMoraleThreshold(
    team.professionalRating,
    hasLieutenant
  );

  const casualtyPercent = calculateCasualtyPercentage(
    team.state.casualties,
    team.initialSize
  );

  if (casualtyPercent >= breakThreshold) {
    return team.state.moraleBroken ? "broken" : "broken";
  }

  // Shaken when at 50% or more of break threshold
  const shakenThreshold = breakThreshold * 0.5;
  if (casualtyPercent >= shakenThreshold) {
    return "shaken";
  }

  return "steady";
}

/**
 * Determine if morale check is needed
 *
 * Morale check is triggered when:
 * - Team takes casualties and crosses the break threshold
 * - Lieutenant is killed (immediate check)
 * - Team witnesses ally team break
 *
 * @param team - Grunt team
 * @param previousCasualties - Casualties before this update
 * @returns Whether a morale check should be made
 */
export function shouldCheckMorale(
  team: GruntTeam,
  previousCasualties: number
): boolean {
  if (team.state.moraleBroken) {
    return false; // Already broken
  }

  const hasLieutenant = team.lieutenant !== undefined;
  const breakThreshold = calculateMoraleThreshold(
    team.professionalRating,
    hasLieutenant
  );

  const previousPercent = calculateCasualtyPercentage(
    previousCasualties,
    team.initialSize
  );
  const currentPercent = calculateCasualtyPercentage(
    team.state.casualties,
    team.initialSize
  );

  // Check if we crossed the threshold
  return previousPercent < breakThreshold && currentPercent >= breakThreshold;
}

/**
 * Attempt to rally a broken team
 *
 * Rally requires spending Group Edge and is only possible for
 * teams with Professional Rating 2+.
 *
 * @param team - Grunt team to rally
 * @returns Object with success status and updated Edge
 */
export function attemptRally(team: GruntTeam): {
  success: boolean;
  edgeCost: number;
  canRally: boolean;
} {
  const tier = getMoraleTier(team.professionalRating);

  if (!tier.canRally) {
    return { success: false, edgeCost: 0, canRally: false };
  }

  if (team.groupEdge < tier.rallyCost) {
    return { success: false, edgeCost: tier.rallyCost, canRally: true };
  }

  // Rally succeeds if Edge can be spent
  // Note: Actual Edge deduction should be done by caller
  return { success: true, edgeCost: tier.rallyCost, canRally: true };
}

// =============================================================================
// GROUP EDGE
// =============================================================================

/**
 * Get maximum Group Edge pool for a Professional Rating
 *
 * Group Edge pool equals Professional Rating.
 *
 * @param professionalRating - Team's Professional Rating
 * @returns Maximum Edge pool
 */
export function getGroupEdgeMax(professionalRating: ProfessionalRating): number {
  return professionalRating;
}

/**
 * Check if team can spend Edge
 *
 * @param team - Grunt team
 * @param amount - Amount of Edge to spend
 * @returns Whether Edge can be spent
 */
export function canSpendEdge(team: GruntTeam, amount: number): boolean {
  return team.groupEdge >= amount;
}

/**
 * Calculate remaining Edge after spending
 *
 * @param currentEdge - Current Edge pool
 * @param amount - Amount to spend
 * @returns Remaining Edge (minimum 0)
 */
export function calculateRemainingEdge(
  currentEdge: number,
  amount: number
): number {
  return Math.max(0, currentEdge - amount);
}

// =============================================================================
// INITIATIVE
// =============================================================================

/**
 * Roll group initiative for a grunt team
 *
 * Formula: Reaction + Intuition + 1d6
 *
 * Group initiative is used by all grunts in the team except
 * lieutenants and augmented specialists who roll individually.
 *
 * @param stats - Base grunt stats
 * @param dieRoll - Result of 1d6 roll (1-6)
 * @returns Initiative score
 */
export function rollGroupInitiative(
  stats: GruntStats,
  dieRoll: number
): number {
  const baseInitiative = stats.attributes.reaction + stats.attributes.intuition;
  return baseInitiative + dieRoll;
}

/**
 * Roll individual initiative for a lieutenant
 *
 * Lieutenants roll their own initiative and may have
 * different attributes than base grunts.
 *
 * @param lieutenant - Lieutenant stats
 * @param dieRoll - Result of 1d6 roll (1-6)
 * @returns Initiative score
 */
export function rollLieutenantInitiative(
  lieutenant: LieutenantStats,
  dieRoll: number
): number {
  const baseInitiative =
    lieutenant.attributes.reaction + lieutenant.attributes.intuition;
  return baseInitiative + dieRoll;
}

/**
 * Roll individual initiative for a specialist
 *
 * Specialists with augmentations (wired reflexes, etc.) may
 * roll individual initiative with bonus dice.
 *
 * @param specialist - Specialist definition
 * @param baseStats - Base grunt stats
 * @param dieRolls - Array of die rolls (multiple for augmented)
 * @returns Initiative score
 */
export function rollSpecialistInitiative(
  specialist: GruntSpecialist,
  baseStats: GruntStats,
  dieRolls: number[]
): number {
  // Get effective attributes (base + modifications)
  const reaction =
    specialist.statModifications?.attributes?.reaction ??
    baseStats.attributes.reaction;
  const intuition =
    specialist.statModifications?.attributes?.intuition ??
    baseStats.attributes.intuition;

  const baseInitiative = reaction + intuition;
  const diceTotal = dieRolls.reduce((sum, roll) => sum + roll, 0);

  return baseInitiative + diceTotal;
}

/**
 * Apply wound modifier to initiative
 *
 * Wounded grunts have reduced initiative based on damage taken.
 *
 * @param baseInitiative - Original initiative score
 * @param damage - Current damage
 * @returns Modified initiative
 */
export function applyWoundModifierToInitiative(
  baseInitiative: number,
  damage: number
): number {
  const woundMod = calculateWoundModifier(damage);
  return Math.max(0, baseInitiative + woundMod);
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validation result for grunt team or component
 */
export interface GruntValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate lieutenant stats against base grunts
 *
 * Lieutenant requirements:
 * - Total attributes must be at least 4 higher than base grunts
 * - Total active skills must be at least 4 higher than base grunts
 *
 * @param lieutenant - Lieutenant stats to validate
 * @param baseGrunts - Base grunt stats for comparison
 * @returns Validation result
 */
export function validateLieutenantStats(
  lieutenant: LieutenantStats,
  baseGrunts: GruntStats
): GruntValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Calculate attribute totals
  const baseAttrTotal = sumAttributes(baseGrunts.attributes);
  const ltAttrTotal = sumAttributes(lieutenant.attributes);
  const attrDiff = ltAttrTotal - baseAttrTotal;

  if (attrDiff < 4) {
    errors.push(
      `Lieutenant attributes must be at least 4 higher than base grunts. ` +
        `Current difference: ${attrDiff}`
    );
  }

  // Calculate skill totals
  const baseSkillTotal = sumSkills(baseGrunts.skills);
  const ltSkillTotal = sumSkills(lieutenant.skills);
  const skillDiff = ltSkillTotal - baseSkillTotal;

  if (skillDiff < 4) {
    errors.push(
      `Lieutenant skills must be at least 4 higher than base grunts. ` +
        `Current difference: ${skillDiff}`
    );
  }

  // Warnings for missing leadership
  if (lieutenant.canBoostProfessionalRating && !lieutenant.leadershipSkill) {
    warnings.push(
      "Lieutenant marked as able to boost PR but has no Leadership skill"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sum all attribute values
 */
function sumAttributes(attributes: GruntAttributes): number {
  return (
    attributes.body +
    attributes.agility +
    attributes.reaction +
    attributes.strength +
    attributes.willpower +
    attributes.logic +
    attributes.intuition +
    attributes.charisma
  );
}

/**
 * Sum all skill ratings
 */
function sumSkills(skills: Record<string, number>): number {
  return Object.values(skills).reduce((sum, rating) => sum + rating, 0);
}

/**
 * Validate grunt team configuration
 *
 * Checks:
 * - Name is present and valid length
 * - Professional Rating is 0-6
 * - Initial size is positive
 * - Specialists count is 0-2
 * - Condition monitor size is calculated correctly
 * - Lieutenant passes validation (if present)
 *
 * @param team - Partial grunt team to validate
 * @returns Validation result
 */
export function validateGruntTeam(
  team: Partial<GruntTeam>
): GruntValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Name validation
  if (!team.name || team.name.trim().length === 0) {
    errors.push("Team name is required");
  } else if (team.name.length > 100) {
    errors.push("Team name must be 100 characters or less");
  }

  // Professional Rating validation
  if (team.professionalRating === undefined) {
    errors.push("Professional Rating is required");
  } else if (team.professionalRating < 0 || team.professionalRating > 6) {
    errors.push("Professional Rating must be between 0 and 6");
  }

  // Initial size validation
  if (team.initialSize === undefined) {
    errors.push("Initial team size is required");
  } else if (team.initialSize < 1) {
    errors.push("Initial team size must be at least 1");
  } else if (team.initialSize > 50) {
    warnings.push("Very large team size may impact performance");
  }

  // Specialists validation
  if (team.specialists && team.specialists.length > 2) {
    errors.push("Maximum of 2 specialists per team");
  }

  // Base grunts validation
  if (team.baseGrunts) {
    // Check condition monitor calculation
    const expectedMonitor = calculateConditionMonitorSize(
      team.baseGrunts.attributes.body,
      team.baseGrunts.attributes.willpower
    );
    if (team.baseGrunts.conditionMonitorSize !== expectedMonitor) {
      warnings.push(
        `Condition monitor size (${team.baseGrunts.conditionMonitorSize}) ` +
          `doesn't match calculated value (${expectedMonitor})`
      );
    }

    // Check for minimum attributes
    const attrs = team.baseGrunts.attributes;
    if (
      attrs.body < 1 ||
      attrs.agility < 1 ||
      attrs.reaction < 1 ||
      attrs.strength < 1 ||
      attrs.willpower < 1 ||
      attrs.logic < 1 ||
      attrs.intuition < 1 ||
      attrs.charisma < 1
    ) {
      errors.push("All attributes must be at least 1");
    }
  } else {
    errors.push("Base grunt stats are required");
  }

  // Lieutenant validation
  if (team.lieutenant && team.baseGrunts) {
    const ltValidation = validateLieutenantStats(team.lieutenant, team.baseGrunts);
    errors.push(...ltValidation.errors);
    warnings.push(...ltValidation.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// PROFESSIONAL RATING MODIFIERS
// =============================================================================

/**
 * Professional Rating tier modifiers
 *
 * These define the expected attribute/skill ranges and behaviors
 * for each tier of professionalism.
 */
export interface ProfessionalRatingModifiers {
  /** Expected attribute range (min, max) */
  attributeRange: [number, number];
  /** Expected skill range (min, max) */
  skillRange: [number, number];
  /** Maximum Group Edge pool */
  edgePool: number;
  /** Casualty percentage that triggers morale break */
  moraleBreakThreshold: number;
  /** Description of this tier */
  description: string;
}

/**
 * Get modifiers for a Professional Rating tier
 *
 * @param rating - Professional Rating (0-6)
 * @returns Tier modifiers
 */
export function getProfessionalRatingModifiers(
  rating: ProfessionalRating
): ProfessionalRatingModifiers {
  const tier = getMoraleTier(rating);

  const modifiers: Record<ProfessionalRating, ProfessionalRatingModifiers> = {
    0: {
      attributeRange: [2, 3],
      skillRange: [1, 2],
      edgePool: 0,
      moraleBreakThreshold: tier.breakThreshold,
      description: "Untrained civilians, desperate individuals",
    },
    1: {
      attributeRange: [3, 3],
      skillRange: [2, 3],
      edgePool: 1,
      moraleBreakThreshold: tier.breakThreshold,
      description: "Green recruits, mall security, new gang members",
    },
    2: {
      attributeRange: [3, 4],
      skillRange: [3, 4],
      edgePool: 2,
      moraleBreakThreshold: tier.breakThreshold,
      description: "Regular security, gang veterans, basic military",
    },
    3: {
      attributeRange: [4, 4],
      skillRange: [4, 5],
      edgePool: 3,
      moraleBreakThreshold: tier.breakThreshold,
      description: "Professional security, experienced mercenaries",
    },
    4: {
      attributeRange: [4, 5],
      skillRange: [5, 6],
      edgePool: 4,
      moraleBreakThreshold: tier.breakThreshold,
      description: "HTR teams, special forces, elite security",
    },
    5: {
      attributeRange: [5, 6],
      skillRange: [6, 7],
      edgePool: 5,
      moraleBreakThreshold: tier.breakThreshold,
      description: "Red Samurai, Tir Ghost, prime operatives",
    },
    6: {
      attributeRange: [6, 7],
      skillRange: [7, 8],
      edgePool: 6,
      moraleBreakThreshold: tier.breakThreshold,
      description: "Dragon guard, immortal elf elites, legendary",
    },
  };

  return modifiers[rating];
}

// =============================================================================
// SIMPLIFIED COMBAT RULES
// =============================================================================

/**
 * Default simplified rules configuration (all disabled)
 */
export const DEFAULT_SIMPLIFIED_RULES: SimplifiedGruntsRules = {
  oneHitKill: false,
  unopposedRolls: false,
  noDodge: false,
  autoSurprise: false,
  ambushFails: false,
};

/**
 * "Mowing them down" preset (all simplified rules enabled)
 */
export const MOWING_THEM_DOWN_RULES: SimplifiedGruntsRules = {
  oneHitKill: true,
  unopposedRolls: true,
  noDodge: true,
  autoSurprise: true,
  ambushFails: true,
};

/**
 * Check if a roll should be unopposed under simplified rules
 *
 * @param rules - Active simplified rules
 * @param rollType - Type of roll being made
 * @returns Whether the roll is unopposed
 */
export function isRollUnopposed(
  rules: SimplifiedGruntsRules,
  rollType: "attack" | "perception" | "other"
): boolean {
  if (!rules.unopposedRolls) {
    return false;
  }

  // All rolls are unopposed when using simplified rules
  return true;
}

/**
 * Check if grunts can dodge under simplified rules
 *
 * @param rules - Active simplified rules
 * @returns Whether grunts can dodge
 */
export function canGruntsDodge(rules: SimplifiedGruntsRules): boolean {
  return !rules.noDodge;
}

/**
 * Check if grunt ambush automatically fails under simplified rules
 *
 * @param rules - Active simplified rules
 * @returns Whether ambush fails
 */
export function doesAmbushFail(rules: SimplifiedGruntsRules): boolean {
  return rules.ambushFails;
}

/**
 * Check if sneaking grants automatic surprise under simplified rules
 *
 * @param rules - Active simplified rules
 * @returns Whether any hits on Sneaking = automatic surprise
 */
export function isAutoSurprise(rules: SimplifiedGruntsRules): boolean {
  return rules.autoSurprise;
}

// =============================================================================
// DICE UTILITIES
// =============================================================================

/**
 * Roll a single d6
 *
 * @returns Random number 1-6
 */
export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Roll multiple d6
 *
 * @param count - Number of dice to roll
 * @returns Array of die results
 */
export function rollDice(count: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollD6());
  }
  return results;
}

/**
 * Count hits (5s and 6s) in Shadowrun dice pool
 *
 * @param rolls - Array of die results
 * @returns Number of hits
 */
export function countHits(rolls: number[]): number {
  return rolls.filter((r) => r >= 5).length;
}

/**
 * Check for glitch (more than half 1s)
 *
 * @param rolls - Array of die results
 * @returns Whether it's a glitch
 */
export function isGlitch(rolls: number[]): boolean {
  const ones = rolls.filter((r) => r === 1).length;
  return ones > rolls.length / 2;
}

/**
 * Check for critical glitch (glitch with no hits)
 *
 * @param rolls - Array of die results
 * @returns Whether it's a critical glitch
 */
export function isCriticalGlitch(rolls: number[]): boolean {
  return isGlitch(rolls) && countHits(rolls) === 0;
}
