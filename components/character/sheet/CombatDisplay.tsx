"use client";

import { DisplayCard } from "./DisplayCard";
import { Swords } from "lucide-react";
import { CombatQuickReference } from "@/app/characters/[id]/components/CombatQuickReference";
import type { Character } from "@/lib/types";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";
import type { EffectResolutionContext, EffectResolutionResult } from "@/lib/types/effects";

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
    </DisplayCard>
  );
}
