"use client";

import type { Character } from "@/lib/types";
import { Link } from "react-aria-components";
import { StabilityShield } from "@/components/sync";

interface CharacterInfoDisplayProps {
  character: Character;
}

export function CharacterInfoDisplay({ character }: CharacterInfoDisplayProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              {character.name}
            </h1>
            <StabilityShield
              characterId={character.id}
              size="md"
              showTooltip
              syncStatus={character.syncStatus}
              legalityStatus={character.legalityStatus}
            />
            <span
              className={`px-2 py-0.5 text-xs font-mono uppercase tracking-wider rounded border ${
                character.status === "active"
                  ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : "text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              {character.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-mono text-zinc-500 dark:text-zinc-400">
            <span>{character.metatype}</span>
            <span>•</span>
            <span className="capitalize">
              {(character.magicalPath || "mundane").replace("-", " ")}
            </span>
            {character.editionCode && (
              <>
                <span>•</span>
                <span>{character.editionCode}</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <Link
            href={`/characters/${character.id}/advancement`}
            className="p-3 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col items-center min-w-[80px] cursor-pointer hover:border-emerald-500/50 transition-colors group"
          >
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Karma
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {character.karmaCurrent}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              of {character.karmaTotal} earned
            </span>
          </Link>
          <div className="p-3 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Nuyen
            </span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              ¥{character.nuyen.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Essence
            </span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {character.specialAttributes?.essence?.toFixed(2) || "6.00"}
            </span>
          </div>
          <div className="p-3 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Edge
            </span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {character.specialAttributes?.edge}/{character.specialAttributes?.edge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
