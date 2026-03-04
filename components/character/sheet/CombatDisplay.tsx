"use client";

import { useMemo } from "react";
import { DisplayCard } from "./DisplayCard";
import { AlertTriangle, Swords } from "lucide-react";
import { CombatQuickReference } from "@/app/characters/[id]/components/CombatQuickReference";
import type { Character } from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";
import type { EffectResolutionContext, EffectResolutionResult } from "@/lib/types/effects";
import { calculateEncumbrance } from "@/lib/rules/encumbrance/calculator";

interface CombatDisplayProps {
  character: Character;
  woundModifier: number;
  physicalLimit: number;
  theme?: Theme;
  onPoolSelect: (pool: number, context: string) => void;
  resolveEffects?: (ctx: EffectResolutionContext) => EffectResolutionResult;
}

export function CombatDisplay({
  character,
  woundModifier,
  physicalLimit,
  theme,
  onPoolSelect,
  resolveEffects,
}: CombatDisplayProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const encumbrance = useMemo(() => calculateEncumbrance(character), [character]);

  return (
    <DisplayCard
      id="sheet-combat"
      title="Combat"
      icon={<Swords className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <CombatQuickReference
        character={character}
        woundModifier={woundModifier}
        physicalLimit={physicalLimit}
        theme={t}
        onPoolSelect={onPoolSelect}
        resolveEffects={resolveEffects}
      />
      {encumbrance.isEncumbered && (
        <div
          data-testid="encumbrance-warning"
          className="mt-3 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-xs text-red-600 dark:text-red-400">
            Encumbered: physical pools suffer {encumbrance.overweightPenalty} penalty
          </p>
        </div>
      )}
    </DisplayCard>
  );
}
