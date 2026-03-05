"use client";

/**
 * useCharacterEffects Hook
 *
 * Gathers all effect sources from a character + ruleset once, then provides
 * a stable `resolve` callback for per-context resolution (per skill, initiative,
 * combat, etc.). Avoids O(items × catalogs) per skill row.
 *
 * @see Issue #113
 */

import { useMemo, useCallback } from "react";
import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types/edition";
import type { EffectResolutionContext, EffectResolutionResult } from "@/lib/types/effects";
import {
  gatherEffectSources,
  resolveFromSources,
  buildCharacterStateFlags,
} from "@/lib/rules/effects";
import type { SourcedEffect } from "@/lib/rules/effects";

export interface UseCharacterEffectsResult {
  /** All gathered effect sources (memoized on character + ruleset) */
  sources: SourcedEffect[];
  /** Resolve effects for a given context using pre-gathered sources */
  resolve: (ctx: EffectResolutionContext) => EffectResolutionResult;
}

export function useCharacterEffects(
  character: Character,
  ruleset: MergedRuleset | null
): UseCharacterEffectsResult {
  const sources = useMemo(() => {
    if (!ruleset) return [];
    return gatherEffectSources(character, ruleset);
  }, [character, ruleset]);

  const characterState = useMemo(() => buildCharacterStateFlags(character), [character]);

  const resolve = useCallback(
    (ctx: EffectResolutionContext): EffectResolutionResult => {
      // Auto-inject character state if not already set by caller
      const ctxWithState = ctx.characterState ? ctx : { ...ctx, characterState };
      return resolveFromSources(sources, ctxWithState);
    },
    [sources, characterState]
  );

  return { sources, resolve };
}
