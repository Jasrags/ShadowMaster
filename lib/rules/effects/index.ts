/**
 * Unified Effect Resolver
 *
 * Cross-source effect resolution engine that computes applicable effects
 * for a character in a given action and environment context.
 *
 * @see Issue #108
 */

// Matching
export { matchesTrigger, matchesTarget, matchesCondition, effectApplies } from "./matching";

// Stacking
export { STACKING_RULES, getStackingRule, applyStackingRules } from "./stacking";

// Gathering
export { gatherEffectSources } from "./gathering";
export type { SourcedEffect } from "./gathering";

// Resolver (main pipeline)
export { resolveEffects } from "./resolver";
