"use client";

import { useMemo } from "react";
import { DisplayCard } from "./DisplayCard";
import { Sparkles } from "lucide-react";
import { useSpells, type SpellData, type SpellsCatalogData } from "@/lib/rules";

interface SpellsDisplayProps {
  spells: Array<string | { id: string }>;
  onSelect?: (pool: number, label: string) => void;
}

function SpellItem({
  spellId,
  spellsCatalog,
  onSelect,
}: {
  spellId: string;
  spellsCatalog: SpellsCatalogData | null;
  onSelect?: (pool: number, label: string) => void;
}) {
  const spell = useMemo(() => {
    if (!spellsCatalog) return null;
    for (const cat in spellsCatalog) {
      const categorySpells = spellsCatalog[cat as keyof typeof spellsCatalog] as SpellData[];
      const found = categorySpells.find((s) => s.id === spellId);
      if (found) return found;
    }
    return null;
  }, [spellId, spellsCatalog]);

  if (!spell) return null;

  return (
    <div
      onClick={() => onSelect?.(6, spell.name)}
      className="p-3 rounded transition-all cursor-pointer group bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-violet-500/30"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200 transition-colors group-hover:text-violet-500 dark:group-hover:text-violet-400">
              {spell.name}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter px-1.5 py-0.5 border border-zinc-300 dark:border-zinc-600 rounded">
              {spell.category}
            </span>
          </div>
          {spell.description && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {spell.description}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono mt-1">
            <div className="flex gap-1.5">
              <span className="text-zinc-400 dark:text-zinc-500">TYPE</span>
              <span className="text-blue-500 dark:text-blue-400 uppercase">{spell.type}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-zinc-400 dark:text-zinc-500">RANGE</span>
              <span className="text-emerald-500 dark:text-emerald-400 uppercase">
                {spell.range}
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-zinc-400 dark:text-zinc-500">DUR</span>
              <span className="text-amber-500 dark:text-amber-400 uppercase">{spell.duration}</span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono leading-none mb-1">
            Drain
          </div>
          <div className="text-sm font-mono text-violet-500 dark:text-violet-400 font-bold leading-none">
            {spell.drain}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpellsDisplay({ spells, onSelect }: SpellsDisplayProps) {
  const spellsCatalog = useSpells();

  if (!spells || spells.length === 0) return null;

  return (
    <DisplayCard title="Spells" icon={<Sparkles className="h-4 w-4 text-violet-400" />}>
      <div className="space-y-3">
        {spells.map((spellEntry, idx) => {
          const spellId =
            typeof spellEntry === "string" ? spellEntry : (spellEntry as { id: string }).id;
          return (
            <SpellItem
              key={spellId || idx}
              spellId={spellId}
              spellsCatalog={spellsCatalog}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </DisplayCard>
  );
}
