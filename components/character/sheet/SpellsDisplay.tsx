"use client";

import { useState, useMemo } from "react";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { useSpells, type SpellData, type SpellsCatalogData } from "@/lib/rules";

// ---------------------------------------------------------------------------
// Section configuration
// ---------------------------------------------------------------------------

const SPELL_SECTIONS = [
  { key: "combat" as const, label: "Combat" },
  { key: "detection" as const, label: "Detection" },
  { key: "health" as const, label: "Health" },
  { key: "illusion" as const, label: "Illusion" },
  { key: "manipulation" as const, label: "Manipulation" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toTitleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function findSpellInCatalog(
  catalog: SpellsCatalogData | null,
  spellId: string
): SpellData | undefined {
  if (!catalog) return undefined;
  for (const cat of Object.keys(catalog)) {
    const spells = catalog[cat as keyof SpellsCatalogData];
    const found = spells.find((s) => s.id === spellId);
    if (found) return found;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// SpellRow
// ---------------------------------------------------------------------------

function SpellRow({ spell }: { spell: SpellData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-testid="spell-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name ... Drain pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span
          title={spell.name}
          className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200"
        >
          {spell.name}
        </span>
        <span
          data-testid="drain-pill"
          className="ml-auto shrink-0 rounded border border-violet-500/20 bg-violet-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-violet-600 dark:text-violet-300"
        >
          {spell.drain}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div
            data-testid="stats-row"
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            <span data-testid="stat-type">
              Type{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {toTitleCase(spell.type)}
              </span>
            </span>
            <span data-testid="stat-range">
              Range{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {toTitleCase(spell.range)}
              </span>
            </span>
            <span data-testid="stat-duration">
              Duration{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {toTitleCase(spell.duration)}
              </span>
            </span>
          </div>

          {/* Damage (combat spells only) */}
          {spell.damage && (
            <div data-testid="stat-damage" className="text-xs text-zinc-500 dark:text-zinc-400">
              Damage{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {toTitleCase(spell.damage)}
              </span>
            </div>
          )}

          {/* Description */}
          {spell.description && (
            <p
              data-testid="spell-description"
              className="text-xs italic text-zinc-500 dark:text-zinc-400"
            >
              {spell.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpellsDisplay
// ---------------------------------------------------------------------------

interface SpellsDisplayProps {
  spells: Array<string | { id: string }>;
  onSelect?: (pool: number, label: string) => void;
}

export function SpellsDisplay({ spells }: SpellsDisplayProps) {
  const spellsCatalog = useSpells();

  // Resolve spell IDs to catalog data and group by category
  const grouped = useMemo(() => {
    if (!spells || spells.length === 0) return null;

    const groups: Record<string, SpellData[]> = {};
    for (const entry of spells) {
      const id = typeof entry === "string" ? entry : entry.id;
      const spell = findSpellInCatalog(spellsCatalog, id);
      if (!spell) continue;
      const cat = spell.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(spell);
    }

    // Return null if nothing resolved
    if (Object.keys(groups).length === 0) return null;
    return groups;
  }, [spells, spellsCatalog]);

  if (!grouped) return null;

  return (
    <DisplayCard title="Spells" icon={<Sparkles className="h-4 w-4 text-violet-400" />}>
      <div className="space-y-3">
        {SPELL_SECTIONS.map(({ key, label }) => {
          const sectionSpells = grouped[key];
          if (!sectionSpells || sectionSpells.length === 0) return null;
          return (
            <div key={key}>
              <div
                data-testid={`section-label-${key}`}
                className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
              >
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {sectionSpells.map((spell) => (
                  <SpellRow key={spell.id} spell={spell} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
