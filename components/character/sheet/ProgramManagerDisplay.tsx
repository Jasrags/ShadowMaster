"use client";

import { useState, useMemo, useCallback } from "react";
import type { Character } from "@/lib/types";
import type { CharacterProgram } from "@/lib/types/programs";
import type { ProgramCatalogItemData } from "@/lib/rules/loader-types";
import { DisplayCard } from "./DisplayCard";
import { Braces, ChevronDown, ChevronRight } from "lucide-react";
import {
  getProgramSlotLimit,
  getLoadedPrograms,
  getUnloadedPrograms,
} from "@/lib/rules/matrix/program-validator";
import { usePrograms } from "@/lib/rules/RulesetContext";

interface ProgramManagerDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

const CATEGORY_STYLES: Record<string, { label: string; style: string }> = {
  common: {
    label: "Common",
    style:
      "bg-zinc-100 text-zinc-600 border-zinc-300/40 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  },
  hacking: {
    label: "Hacking",
    style:
      "bg-amber-100 text-amber-700 border-amber-300/40 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20",
  },
  agent: {
    label: "Agent",
    style:
      "bg-violet-100 text-violet-700 border-violet-300/40 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/20",
  },
};

/** Calculate the slot cost for a program (agents use rating, others use 1) */
function getSlotCost(program: CharacterProgram): number {
  return program.category === "agent" ? (program.rating ?? 1) : 1;
}

function ProgramRow({
  program,
  isLoaded,
  editable,
  slotsRemaining,
  effects,
  onToggle,
}: {
  program: CharacterProgram;
  isLoaded: boolean;
  editable?: boolean;
  slotsRemaining: number;
  effects?: string;
  onToggle: (programId: string, load: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const catStyle = CATEGORY_STYLES[program.category] ?? CATEGORY_STYLES.common;
  const slotCost = getSlotCost(program);
  const canLoad = slotsRemaining >= slotCost;

  return (
    <div className="[&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      <div
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-zinc-400" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />
        )}
        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {program.name}
        </span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${catStyle.style}`}
        >
          {catStyle.label}
        </span>
        {program.rating && (
          <span className="rounded border border-indigo-500/20 bg-indigo-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
            R{program.rating}
          </span>
        )}
        <div className="flex-1" />
        {editable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(program.catalogId, !isLoaded);
            }}
            disabled={!isLoaded && !canLoad}
            className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
              isLoaded
                ? "border border-red-300/40 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                : canLoad
                  ? "border border-emerald-300/40 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                  : "border border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            {isLoaded ? "Unload" : "Load"}
          </button>
        )}
      </div>
      {expanded && (
        <div className="ml-5 space-y-1 border-l-2 border-zinc-200 px-3 pb-2 dark:border-zinc-700">
          {program.notes && (
            <p className="text-xs italic text-zinc-500 dark:text-zinc-400">{program.notes}</p>
          )}
          {effects && <p className="text-xs text-emerald-600 dark:text-emerald-400">{effects}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              Avail:{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {program.availability}
              </span>
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              Cost:{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {program.cost.toLocaleString()}¥
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProgramManagerDisplay({
  character,
  onCharacterUpdate,
  editable,
}: ProgramManagerDisplayProps) {
  const slotsMax = useMemo(() => getProgramSlotLimit(character), [character]);
  const loadedProgramIds = useMemo(() => new Set(getLoadedPrograms(character)), [character]);
  const unloadedPrograms = useMemo(() => getUnloadedPrograms(character), [character]);

  const allPrograms = character.programs ?? [];
  const loadedPrograms = allPrograms.filter((p) => loadedProgramIds.has(p.catalogId));

  // Calculate effective slots used (agents consume slots = rating)
  const slotsUsed = useMemo(() => {
    let total = 0;
    for (const program of loadedPrograms) {
      total += getSlotCost(program);
    }
    return total;
  }, [loadedPrograms]);

  const slotsRemaining = slotsMax - slotsUsed;

  // Build catalog lookup for effects display
  const programCatalog = usePrograms();
  const catalogMap = useMemo(() => {
    const map = new Map<string, ProgramCatalogItemData>();
    for (const p of programCatalog) {
      map.set(p.id, p);
    }
    return map;
  }, [programCatalog]);

  // Slot warning color styles
  const slotStyle = useMemo(() => {
    if (slotsUsed > slotsMax) {
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    }
    if (slotsRemaining <= 1 && slotsMax > 0) {
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
    }
    return "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50";
  }, [slotsUsed, slotsMax, slotsRemaining]);

  const [showAvailable, setShowAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleProgram = useCallback(
    async (programId: string, load: boolean) => {
      if (!onCharacterUpdate) return;

      try {
        const body = load ? { loadPrograms: [programId] } : { unloadPrograms: [programId] };

        const res = await fetch(`/api/characters/${character.id}/matrix`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to update program");
          return;
        }

        setError(null);

        // Optimistic update: modify the deck's loadedPrograms
        const updatedDecks = (character.cyberdecks ?? []).map((deck) => {
          if (
            deck.id === character.activeMatrixDeviceId ||
            deck.catalogId === character.activeMatrixDeviceId
          ) {
            const currentLoaded = deck.loadedPrograms ?? [];
            const newLoaded = load
              ? [...currentLoaded, programId]
              : currentLoaded.filter((id) => id !== programId);
            return { ...deck, loadedPrograms: newLoaded };
          }
          return deck;
        });

        onCharacterUpdate({ ...character, cyberdecks: updatedDecks });
      } catch {
        setError("Network error — please try again");
      }
    },
    [character, onCharacterUpdate]
  );

  if (allPrograms.length === 0) return null;

  return (
    <DisplayCard
      id="sheet-programs"
      title="Programs"
      icon={<Braces className="h-4 w-4 text-emerald-400" />}
      headerAction={
        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${slotStyle}`}>
          {slotsUsed}/{slotsMax} loaded
        </span>
      }
      collapsible
    >
      <div className="space-y-3">
        {/* Error feedback */}
        {error && <p className="text-xs text-red-500 dark:text-red-400 px-3 py-1">{error}</p>}

        {/* Loaded Programs */}
        {loadedPrograms.length > 0 && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Loaded
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {loadedPrograms.map((program) => (
                <ProgramRow
                  key={program.catalogId}
                  program={program}
                  isLoaded
                  editable={editable}
                  slotsRemaining={slotsRemaining}
                  effects={catalogMap.get(program.catalogId)?.effects}
                  onToggle={handleToggleProgram}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Programs (collapsed by default) */}
        {unloadedPrograms.length > 0 && (
          <div>
            <button
              onClick={() => setShowAvailable(!showAvailable)}
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              {showAvailable ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Available ({unloadedPrograms.length})
            </button>
            {showAvailable && (
              <div className="mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {unloadedPrograms.map((program) => (
                  <ProgramRow
                    key={program.catalogId}
                    program={program}
                    isLoaded={false}
                    editable={editable}
                    slotsRemaining={slotsRemaining}
                    effects={catalogMap.get(program.catalogId)?.effects}
                    onToggle={handleToggleProgram}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
