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
export { resolveEffects, resolveFromSources } from "./resolver";

// Context builder
export { EffectContextBuilder } from "./context";

// Constants
export { UNIFIED_TRIGGERS, UNIFIED_TYPES } from "./constants";

// Creation adapter
export { buildCreationCharacter } from "./creation-adapter";

// Format
export { formatEffectBadge, isUnifiedEffect } from "./format";
export type { EffectBadge } from "./format";
