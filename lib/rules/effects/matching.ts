/**
 * Trigger, target, and condition matching for the unified effect system.
 *
 * Pure functions that determine whether an effect applies to a given
 * action and environment context. Operates on unified effect types
 * from @/lib/types/effects (not the old quality effect types).
 *
 * @see Issue #108
 */

import type {
  Effect,
  EffectTrigger,
  EffectTarget,
  EffectCondition,
  EffectActionContext,
  EffectResolutionContext,
  CharacterStateFlags,
} from "@/lib/types/effects";

/**
 * Derive the set of active triggers implied by an action context.
 */
function getImpliedTriggers(action: EffectActionContext): Set<EffectTrigger> {
  const triggers = new Set<EffectTrigger>(["always" as EffectTrigger]);

  switch (action.type) {
    case "skill-test":
      triggers.add("skill-test");
      if (action.perceptionType === "audio") triggers.add("perception-audio");
      if (action.perceptionType === "visual") triggers.add("perception-visual");
      if (action.specificAction) {
        // Social-specific actions imply social-test
        if (["negotiate", "intimidate", "con"].includes(action.specificAction)) {
          triggers.add("social-test");
        }
        // Matrix-specific actions imply matrix-action
        if (["hack-on-the-fly", "brute-force", "data-spike"].includes(action.specificAction)) {
          triggers.add("matrix-action");
        }
      }
      break;

    case "attack":
      triggers.add("combat-action");
      if (action.attackType === "ranged") triggers.add("ranged-attack");
      if (action.attackType === "melee") triggers.add("melee-attack");
      break;

    case "defense":
      triggers.add("combat-action");
      triggers.add("defense-test");
      if (action.specificAction === "full-auto") triggers.add("full-defense");
      break;

    case "resistance":
      triggers.add("resistance-test");
      triggers.add("damage-resistance");
      break;

    case "initiative":
      // Only "always" applies beyond the base
      break;
  }

  return triggers;
}

/**
 * Derive state-dependent triggers from character state flags.
 */
function getStateDerivedTriggers(state?: CharacterStateFlags): Set<EffectTrigger> {
  const triggers = new Set<EffectTrigger>();
  if (state?.withdrawalActive) triggers.add("withdrawal");
  if (state?.exposureActive) triggers.add("on-exposure");
  if (state?.firstMeeting) triggers.add("first-meeting");
  return triggers;
}

/**
 * Check if any of the effect's triggers match the resolution context.
 * Returns true if ANY trigger in the array is in the implied trigger set
 * (from action context) or the state-derived trigger set (from character state).
 */
export function matchesTrigger(
  triggers: EffectTrigger[],
  actionOrContext: EffectActionContext | EffectResolutionContext
): boolean {
  // Support both old (action-only) and new (full context) signatures
  const action = "action" in actionOrContext ? actionOrContext.action : actionOrContext;
  const characterState =
    "characterState" in actionOrContext ? actionOrContext.characterState : undefined;

  const implied = getImpliedTriggers(action);
  const stateTriggers = getStateDerivedTriggers(characterState);

  return triggers.some((t) => implied.has(t) || stateTriggers.has(t));
}

/**
 * Check if an effect's target constraints are satisfied by the action context.
 * An empty/unspecified target matches all actions (broad effect).
 */
export function matchesTarget(target: EffectTarget, action: EffectActionContext): boolean {
  // Skill match
  if (target.skill && action.skill && target.skill !== action.skill) {
    return false;
  }

  // Attribute match
  if (target.attribute && action.attribute && target.attribute !== action.attribute) {
    return false;
  }

  // Perception type match
  if (
    target.perceptionType &&
    action.perceptionType &&
    target.perceptionType !== action.perceptionType
  ) {
    return false;
  }

  // Specific action match
  if (
    target.specificAction &&
    action.specificAction &&
    target.specificAction !== action.specificAction
  ) {
    return false;
  }

  // Skill category match
  if (
    target.skillCategory &&
    action.skillCategory &&
    target.skillCategory !== action.skillCategory
  ) {
    return false;
  }

  return true;
}

/**
 * Check if an effect's conditions are met by the environment context.
 * Returns true if no condition is set, or if all condition constraints are satisfied.
 * Skips characterState, requiresEquipment, and customCondition (future work).
 */
export function matchesCondition(
  condition: EffectCondition | undefined,
  context: EffectResolutionContext
): boolean {
  if (!condition) return true;

  const env = context.environment;

  // Lighting condition
  if (condition.lightingCondition) {
    if (!env?.lighting || env.lighting !== condition.lightingCondition) {
      return false;
    }
  }

  // Noise condition
  if (condition.noiseCondition) {
    if (!env?.noise || env.noise !== condition.noiseCondition) {
      return false;
    }
  }

  // Environment array check (if condition specifies environments, at least one must match)
  if (condition.environment && condition.environment.length > 0) {
    if (!env?.terrain && !env?.weather) {
      return false;
    }
    const envValues = [env?.terrain, env?.weather].filter(Boolean) as string[];
    const hasMatch = condition.environment.some((e) => envValues.includes(e));
    if (!hasMatch) return false;
  }

  return true;
}

/**
 * Combined check: does this effect apply to the given resolution context?
 * Checks trigger matching, target matching, and condition matching.
 */
export function effectApplies(effect: Effect, context: EffectResolutionContext): boolean {
  if (!matchesTrigger(effect.triggers, context)) return false;
  if (!matchesTarget(effect.target, context.action)) return false;
  if (!matchesCondition(effect.condition, context)) return false;
  return true;
}
