"use client";

import { DisplayCard } from "./DisplayCard";
import { Swords } from "lucide-react";
import { CombatQuickReference } from "@/app/characters/[id]/components/CombatQuickReference";
import type { Character } from "@/lib/types";
import type { Theme } from "@/lib/themes";

interface CombatDisplayProps {
  character: Character;
  woundModifier: number;
  physicalLimit: number;
  theme: Theme;
  onPoolSelect: (pool: number, context: string) => void;
}

export function CombatDisplay({
  character,
  woundModifier,
  physicalLimit,
  theme,
  onPoolSelect,
}: CombatDisplayProps) {
  return (
    <DisplayCard title="Combat" icon={<Swords className="h-4 w-4 text-zinc-400" />}>
      <CombatQuickReference
        character={character}
        woundModifier={woundModifier}
        physicalLimit={physicalLimit}
        theme={theme}
        onPoolSelect={onPoolSelect}
      />
    </DisplayCard>
  );
}
