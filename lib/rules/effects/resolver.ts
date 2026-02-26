/**
 * Effect resolver — main pipeline orchestrator.
 *
 * Resolves all applicable effects for a character in a given action/environment
 * context. Gathers sources, filters by applicability, resolves values
 * (including per-rating and wireless variants), then applies stacking rules.
 *
 * @see Issue #108
 */

import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types/edition";
import type {
  Effect,
  EffectSource,
  EffectResolutionContext,
  EffectResolutionResult,
  UnifiedResolvedEffect,
} from "@/lib/types/effects";
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
  } else {
    // Per-rating scaling
    resolvedValue = effect.value.perRating * (source.rating ?? 1);
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

    if (override.bonusValue !== undefined) {
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
  // 1. Gather all effect sources
  const allSources = gatherEffectSources(character, ruleset);

  // 2. Filter to applicable effects
  const applicable = allSources.filter((s) => effectApplies(s.effect, context));

  // 3. Resolve values
  const resolved: UnifiedResolvedEffect[] = applicable.map(resolveEffect);

  // 4. Apply stacking rules
  return applyStackingRules(resolved);
}
