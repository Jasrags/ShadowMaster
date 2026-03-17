/**
 * Effect resolver — main pipeline orchestrator.
 *
 * Resolves all applicable effects for a character in a given action/environment
 * context. Gathers sources, filters by applicability, resolves values
 * (including per-rating and wireless variants), then applies stacking rules.
 *
 * @see Issue #108
 */

import type {
  Character,
  MergedRuleset,
  EffectResolutionContext,
  EffectResolutionResult,
  UnifiedResolvedEffect,
} from "@/lib/types";
import { effectApplies } from "./matching";
import { applyStackingRules } from "./stacking";
import { gatherEffectSources } from "./gathering";
import type { SourcedEffect } from "./gathering";

/**
 * Resolve a single effect's value, handling per-rating scaling and wireless overrides.
 */
function resolveEffect(sourced: SourcedEffect): UnifiedResolvedEffect {
  const { effect, source } = sourced;

  // Resolve base value
  let resolvedValue: number;
  if (typeof effect.value === "number") {
    resolvedValue = effect.value;
  } else if (
    typeof effect.value === "object" &&
    effect.value !== null &&
    typeof effect.value.perRating === "number"
  ) {
    // Per-rating scaling
    resolvedValue = effect.value.perRating * (source.rating ?? 1);
  } else {
    // Unrecognized value format — treat as zero to prevent NaN propagation
    resolvedValue = 0;
  }

  let appliedVariant: "standard" | "wireless" = "standard";
  let resolvedEffect = effect;

  // Wireless variant handling
  if (source.wirelessEnabled && effect.wirelessOverride) {
    const override = effect.wirelessOverride;

    if (override.type) {
      // Replace effect type — create shallow copy with new type
      resolvedEffect = { ...effect, type: override.type };
    }

    if (typeof override.bonusValue === "number") {
      resolvedValue += override.bonusValue;
    }

    appliedVariant = "wireless";
  }

  // If effect requires wireless but source isn't wireless-enabled, zero out
  if (effect.requiresWireless && !source.wirelessEnabled) {
    resolvedValue = 0;
  }

  return {
    effect: resolvedEffect,
    source,
    resolvedValue,
    appliedVariant,
  };
}

/**
 * Resolve effects from pre-gathered sources for a given context.
 *
 * Use this when gathering once at a top level and resolving per-context
 * (e.g., per-skill, for initiative, for combat) to avoid O(items × catalogs)
 * per invocation.
 *
 * Pipeline:
 * 1. Filter pre-gathered sources to applicable effects
 * 2. Resolve values (per-rating, wireless variants)
 * 3. Apply stacking rules
 */
export function resolveFromSources(
  sources: SourcedEffect[],
  context: EffectResolutionContext
): EffectResolutionResult {
  // 1. Filter to applicable effects
  const applicable = sources.filter((s) => effectApplies(s.effect, context));

  // 2. Resolve values
  const resolved: UnifiedResolvedEffect[] = applicable.map(resolveEffect);

  // 3. Apply stacking rules
  return applyStackingRules(resolved);
}

/**
 * Resolve all applicable effects for a character in a given context.
 *
 * Pipeline:
 * 1. Gather all effect sources from character + ruleset catalog
 * 2. Filter to effects that apply to the given context
 * 3. Resolve values (per-rating, wireless variants)
 * 4. Apply stacking rules
 */
export function resolveEffects(
  character: Character,
  context: EffectResolutionContext,
  ruleset: MergedRuleset
): EffectResolutionResult {
  const allSources = gatherEffectSources(character, ruleset);
  return resolveFromSources(allSources, context);
}
