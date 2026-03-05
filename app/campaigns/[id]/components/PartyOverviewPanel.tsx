"use client";

import type { Character } from "@/lib/types";
import { Users, AlertTriangle } from "lucide-react";
import PartyCharacterCard from "./PartyCharacterCard";
import { getCondition } from "./PartyCharacterCard";

interface PartyOverviewPanelProps {
  characters: Character[];
  onCharacterClick: (id: string) => void;
}

export default function PartyOverviewPanel({
  characters,
  onCharacterClick,
}: PartyOverviewPanelProps) {
  const alerts = characters.filter((c) => {
    if (c.status !== "active") return false;
    const cond = getCondition(c);
    return cond.physicalDamage >= cond.physicalMax || cond.stunDamage >= cond.stunMax;
  });

  if (characters.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-black">
        <Users className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          No characters in party
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Characters added to this campaign will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Party summary header */}
      <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {characters.length} character{characters.length !== 1 ? "s" : ""}
        </span>
        {alerts.length > 0 && (
          <span className="flex items-center gap-1 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            {alerts.length} down
          </span>
        )}
      </div>

      {/* Character cards grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {characters.map((character) => (
          <PartyCharacterCard
            key={character.id}
            character={character}
            onClick={() => onCharacterClick(character.id)}
          />
        ))}
      </div>
    </div>
  );
}
