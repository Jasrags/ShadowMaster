"use client";

/**
 * useCreationEffects Hook
 *
 * Bridges the unified effects system into character creation by converting
 * CreationSelections into a pseudo-Character, gathering effect sources,
 * and pre-resolving passive ("always") effects for DerivedStatsCard.
 *
 * @see Issue #448
 */

import { useMemo, useCallback } from "react";
import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types/edition";
import type { EffectResolutionContext, EffectResolutionResult } from "@/lib/types/effects";
import type { CreationSelections } from "@/lib/types/creation-selections";
import {
  gatherEffectSources,
  resolveFromSources,
  buildCreationCharacter,
  EffectContextBuilder,
} from "@/lib/rules/effects";
import type { SourcedEffect } from "@/lib/rules/effects";

export interface UseCreationEffectsResult {
  /** All gathered effect sources (memoized on selections + ruleset) */
  sources: SourcedEffect[];
  /** Resolve effects for a given context using pre-gathered sources */
  resolve: (ctx: EffectResolutionContext) => EffectResolutionResult;
  /** Pre-resolved passive effects (all "always"-trigger effects for initiative context) */
  passiveEffects: EffectResolutionResult | null;
}

/**
 * Empty result for when no effects are available.
 */
const EMPTY_RESULT: EffectResolutionResult = {
  dicePoolModifiers: [],
  limitModifiers: [],
  thresholdModifiers: [],
  accuracyModifiers: [],
  initiativeModifiers: [],
  totalDicePoolModifier: 0,
  totalLimitModifier: 0,
  totalThresholdModifier: 0,
  totalAccuracyModifier: 0,
  totalInitiativeModifier: 0,
  excludedByStacking: [],
};

export function useCreationEffects(
  selections: CreationSelections,
  ruleset: MergedRuleset | null
): UseCreationEffectsResult {
  // Build pseudo-character from selections
  const pseudoCharacter = useMemo(() => buildCreationCharacter(selections), [selections]);

  // Gather all effect sources
  const sources = useMemo(() => {
    if (!ruleset) return [];
    return gatherEffectSources(pseudoCharacter as Character, ruleset);
  }, [pseudoCharacter, ruleset]);

  // Pre-resolve passive effects using initiative context
  // (captures "always"-trigger effects which are the main ones visible during creation)
  const passiveEffects = useMemo(() => {
    if (sources.length === 0) return null;
    return resolveFromSources(sources, EffectContextBuilder.forInitiative().build());
  }, [sources]);

  // Resolve callback for per-context queries
  const resolve = useCallback(
    (ctx: EffectResolutionContext): EffectResolutionResult => {
      if (sources.length === 0) return EMPTY_RESULT;
      return resolveFromSources(sources, ctx);
    },
    [sources]
  );

  return { sources, resolve, passiveEffects };
}
