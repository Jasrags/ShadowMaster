/**
 * Quality effects resolution system
 *
 * Core functions for resolving and applying quality effects during gameplay.
 * Handles template variable substitution, trigger matching, and condition checking.
 */

import type {
  Quality,
  QualityEffect,
  QualitySelection,
  EffectTrigger,
  EffectTarget,
  EffectCondition,
} from "@/lib/types";
import type { Character } from "@/lib/types";
import type {
  GameplayContext,
  TestContext,
  CombatContext,
  MagicContext,
  MatrixContext,
  HealingContext,
  DamageContext,
  CostContext,
  ResolvedEffect,
} from "@/lib/types/gameplay";

/**
 * Resolve template variables in effect values and targets
 *
 * Template variables:
 * - `{{rating}}` - Quality rating
 * - `{{specification}}` - Quality specification
 * - `{{specificationId}}` - Quality specification ID
 *
 * @param template - String with template variables
 * @param quality - Quality definition
 * @param selection - Quality selection on character
 * @returns Resolved value (number if numeric, string otherwise)
 */
export function resolveTemplateVariable(
  template: string | number,
  quality: Quality,
  selection: QualitySelection
): number | string {
  if (typeof template === "number") {
    return template;
  }

  if (typeof template !== "string") {
    return 0;
  }

  let resolved = template;

  // Replace {{rating}}
  const rating = selection.rating ?? 1;
  resolved = resolved.replace(/\{\{rating\}\}/g, String(rating));

  // Replace {{specification}}
  if (selection.specification) {
    resolved = resolved.replace(/\{\{specification\}\}/g, selection.specification);
  }

  // Replace {{specificationId}}
  if (selection.specificationId) {
    resolved = resolved.replace(/\{\{specificationId\}\}/g, selection.specificationId);
  }

  // Try to parse as number if it's numeric
  const numericValue = Number(resolved);
  if (!isNaN(numericValue) && resolved.trim() === String(numericValue)) {
    return numericValue;
  }

  return resolved;
}

/**
 * Resolve effect value (handles template variables and formulas)
 *
 * @param effect - Quality effect
 * @param quality - Quality definition
 * @param selection - Quality selection on character
 * @returns Resolved numeric value
 */
export function resolveEffectValue(
  effect: QualityEffect,
  quality: Quality,
  selection: QualitySelection
): number {
  const resolved = resolveTemplateVariable(effect.value, quality, selection);

  if (typeof resolved === "number") {
    return resolved;
  }

  // Handle string formulas (e.g., "-{{rating}}")
  if (typeof resolved === "string") {
    // Try to evaluate simple arithmetic expressions
    // For now, just try to parse as number
    const numericValue = Number(resolved);
    if (!isNaN(numericValue)) {
      return numericValue;
    }

    // If it starts with "-", try to parse the rest
    if (resolved.startsWith("-")) {
      const rest = resolved.slice(1).trim();
      const restValue = Number(rest);
      if (!isNaN(restValue)) {
        return -restValue;
      }
    }
  }

  // Default to 0 if we can't resolve
  return 0;
}

/**
 * Resolve effect target (handles template variables)
 *
 * @param target - Effect target
 * @param quality - Quality definition
 * @param selection - Quality selection on character
 * @returns Resolved target
 */
export function resolveEffectTarget(
  target: EffectTarget,
  quality: Quality,
  selection: QualitySelection
): EffectTarget {
  const resolved: EffectTarget = { ...target };

  // Resolve template variables in target fields
  if (typeof resolved.limit === "string") {
    const limitResolved = resolveTemplateVariable(resolved.limit, quality, selection);
    if (typeof limitResolved === "string") {
      resolved.limit = limitResolved as "physical" | "mental" | "social" | "astral";
    }
  }

  if (typeof resolved.skill === "string") {
    const skillResolved = resolveTemplateVariable(resolved.skill, quality, selection);
    if (typeof skillResolved === "string") {
      resolved.skill = skillResolved;
    }
  }

  if (typeof resolved.attribute === "string") {
    const attributeResolved = resolveTemplateVariable(resolved.attribute, quality, selection);
    if (typeof attributeResolved === "string") {
      resolved.attribute = attributeResolved;
    }
  }

  return resolved;
}

/**
 * Check if effect condition matches context
 *
 * @param condition - Effect condition
 * @param context - Gameplay context
 * @returns Whether condition matches
 */
export function matchesCondition(
  condition: EffectCondition | undefined,
  context: GameplayContext
): boolean {
  if (!condition) {
    return true; // No condition means always applies
  }

  // Check environment
  if (condition.environment && condition.environment.length > 0) {
    const contextEnv = context.environment || [];
    const hasMatchingEnv = condition.environment.some((env) => contextEnv.includes(env));
    if (!hasMatchingEnv) {
      return false;
    }
  }

  // Check target type
  if (condition.targetType && condition.targetType.length > 0) {
    const contextTarget = context.targetType || [];
    const hasMatchingTarget = condition.targetType.some((target) =>
      contextTarget.includes(target)
    );
    if (!hasMatchingTarget) {
      return false;
    }
  }

  // Check character state
  if (condition.characterState && condition.characterState.length > 0) {
    const contextState = context.characterState || [];
    const hasMatchingState = condition.characterState.some((state) =>
      contextState.includes(state)
    );
    if (!hasMatchingState) {
      return false;
    }
  }

  // Check opposed by
  if (condition.opposedBy) {
    if (context.opposedBy !== condition.opposedBy) {
      return false;
    }
  }

  // Custom condition (would need custom handler)
  if (condition.customCondition) {
    // For now, skip custom conditions - would need registry of custom validators
    // This is a placeholder for future extension
  }

  return true;
}

/**
 * Check if effect trigger matches context
 *
 * @param trigger - Effect trigger
 * @param context - Gameplay context
 * @returns Whether trigger matches
 */
export function matchesTrigger(
  trigger: EffectTrigger,
  context: GameplayContext | TestContext | CombatContext | MagicContext | MatrixContext | HealingContext | DamageContext | CostContext
): boolean {
  switch (trigger) {
    case "always":
      return true;

    case "skill-test":
      return "skill" in context || "skillGroup" in context || "testCategory" in context;

    case "attribute-test":
      return "attribute" in context;

    case "combat-action":
      return "actionType" in context || "isAttacking" in context || "isDefending" in context;

    case "defense-test":
      return "isDefenseTest" in context && context.isDefenseTest === true;

    case "resistance-test":
      return "isResistanceTest" in context && context.isResistanceTest === true;

    case "social-test":
      return "testCategory" in context && context.testCategory === "social";

    case "first-meeting":
      // Would need additional context flag
      return false; // Placeholder

    case "magic-use":
      return "actionType" in context && ["casting", "summoning", "ritual", "enchanting"].includes((context as MagicContext).actionType || "");

    case "matrix-action":
      return "matrixAction" in context || "matrixMode" in context;

    case "healing":
      return "healingType" in context;

    case "damage-taken":
      return "damageType" in context || "calculatingWoundModifier" in context;

    case "fear-intimidation":
      // Would need additional context flag
      return false; // Placeholder

    case "withdrawal":
      // Would need additional context flag
      return false; // Placeholder

    case "on-exposure":
      // Would need additional context flag
      return false; // Placeholder

    default:
      return false;
  }
}

/**
 * Check if effect should apply based on trigger and conditions
 *
 * @param effect - Quality effect
 * @param context - Gameplay context
 * @returns Whether effect should apply
 */
export function shouldApplyEffect(
  effect: QualityEffect,
  context: GameplayContext | TestContext | CombatContext | MagicContext | MatrixContext | HealingContext | DamageContext | CostContext
): boolean {
  // Check trigger
  if (!matchesTrigger(effect.trigger, context)) {
    return false;
  }

  // Check conditions
  if (!matchesCondition(effect.condition, context)) {
    return false;
  }

  return true;
}

/**
 * Get all active effects for a character
 *
 * @param character - Character
 * @param quality - Quality definition
 * @param selection - Quality selection
 * @param context - Gameplay context
 * @returns Array of resolved effects that should apply
 */
export function getActiveEffects(
  character: Character,
  quality: Quality,
  selection: QualitySelection,
  context: GameplayContext | TestContext | CombatContext | MagicContext | MatrixContext | HealingContext | DamageContext | CostContext
): ResolvedEffect[] {
  // Only process if quality is active
  if (selection.active === false) {
    return [];
  }

  const activeEffects: ResolvedEffect[] = [];

  // Get effects from quality or level-specific effects
  let effects: QualityEffect[] = quality.effects || [];

  // If quality has levels and selection has rating, check for level-specific effects
  if (quality.levels && selection.rating) {
    const level = quality.levels.find((l) => l.level === selection.rating);
    if (level?.effects) {
      effects = level.effects;
    }
  }

  // Process each effect
  for (const effect of effects) {
    if (shouldApplyEffect(effect, context)) {
      const resolvedValue = resolveEffectValue(effect, quality, selection);
      const resolvedTarget = resolveEffectTarget(effect.target, quality, selection);

      activeEffects.push({
        effect,
        value: resolvedValue,
        target: resolvedTarget,
        quality,
        selection,
      });
    }
  }

  return activeEffects;
}

/**
 * Filter effects by trigger type
 *
 * @param effects - Array of resolved effects
 * @param trigger - Trigger to filter by
 * @returns Filtered effects
 */
export function filterEffectsByTrigger(
  effects: ResolvedEffect[],
  trigger: EffectTrigger
): ResolvedEffect[] {
  return effects.filter((resolved) => resolved.effect.trigger === trigger);
}

/**
 * Filter effects by target
 *
 * @param effects - Array of resolved effects
 * @param targetMatcher - Function to match targets
 * @returns Filtered effects
 */
export function filterEffectsByTarget(
  effects: ResolvedEffect[],
  targetMatcher: (target: EffectTarget) => boolean
): ResolvedEffect[] {
  return effects.filter((resolved) => targetMatcher(resolved.target));
}

