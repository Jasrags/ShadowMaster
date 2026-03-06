"use client";

import { useState, useEffect } from "react";
import type { CharacterArchetype, ArchetypeCategory } from "@/lib/types/archetype";
import { Swords, Sparkles, Cpu, MessageCircle, ArrowRight, Wrench, Loader2 } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const CATEGORY_CONFIG: Record<
  ArchetypeCategory,
  { icon: typeof Swords; label: string; color: string; bg: string; border: string }
> = {
  combat: {
    icon: Swords,
    label: "Combat",
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  magic: {
    icon: Sparkles,
    label: "Magic",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  technology: {
    icon: Cpu,
    label: "Technology",
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  social: {
    icon: MessageCircle,
    label: "Social",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
};

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "text-emerald-500 dark:text-emerald-400" },
  intermediate: { label: "Intermediate", color: "text-amber-500 dark:text-amber-400" },
  advanced: { label: "Advanced", color: "text-red-500 dark:text-red-400" },
};

// =============================================================================
// COMPONENT
// =============================================================================

interface ArchetypeSelectorProps {
  editionCode: string;
  onSelect: (archetype: CharacterArchetype) => void;
  onSkip: () => void;
}

export function ArchetypeSelector({ editionCode, onSelect, onSkip }: ArchetypeSelectorProps) {
  const [archetypes, setArchetypes] = useState<CharacterArchetype[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<ArchetypeCategory | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/editions/${editionCode}/archetypes`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setArchetypes(data.archetypes);
          }
        }
      } catch (e) {
        console.error("Failed to load archetypes:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [editionCode]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (archetypes.length === 0) {
    // No archetypes available — skip silently
    onSkip();
    return null;
  }

  const filtered = filterCategory
    ? archetypes.filter((a) => a.category === filterCategory)
    : archetypes;

  const selectedArchetype = archetypes.find((a) => a.id === selected);

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Choose an Archetype</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Start with a pre-built concept or build from scratch. Archetypes pre-fill priorities,
          attributes, and skills — you can customize everything afterward.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setFilterCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filterCategory === null
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          All
        </button>
        {(Object.keys(CATEGORY_CONFIG) as ArchetypeCategory[]).map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Archetype Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((archetype) => {
          const catConfig = CATEGORY_CONFIG[archetype.category];
          const diffConfig = DIFFICULTY_LABELS[archetype.difficulty];
          const Icon = catConfig.icon;
          const isSelected = selected === archetype.id;

          return (
            <button
              key={archetype.id}
              onClick={() => setSelected(isSelected ? null : archetype.id)}
              className={`relative flex flex-col rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? `${catConfig.border} ${catConfig.bg} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900 ${catConfig.border.replace("border-", "ring-")}`
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              {/* Header */}
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${catConfig.bg}`}
                >
                  <Icon className={`h-4 w-4 ${catConfig.color}`} />
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-sm font-semibold ${isSelected ? catConfig.color : "text-zinc-900 dark:text-zinc-100"}`}
                  >
                    {archetype.name}
                  </h3>
                </div>
              </div>

              {/* Badges */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${catConfig.bg} ${catConfig.color}`}
                >
                  {catConfig.label}
                </span>
                <span
                  className={`rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium dark:bg-zinc-800 ${diffConfig?.color ?? ""}`}
                >
                  {diffConfig?.label ?? archetype.difficulty}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {archetype.suggestedMetatype}
                </span>
              </div>

              {/* Description */}
              <p className="mb-4 line-clamp-3 text-xs text-zinc-500 dark:text-zinc-400">
                {archetype.description}
              </p>

              {/* Key Attributes */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1">
                  {archetype.keyAttributes.map((attr) => (
                    <span
                      key={attr}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {attr.slice(0, 3).toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => {
            if (selectedArchetype) onSelect(selectedArchetype);
          }}
          disabled={!selectedArchetype}
          className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            selectedArchetype
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          Use Archetype
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onSkip}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Wrench className="h-4 w-4" />
          Custom Build
        </button>
      </div>
    </div>
  );
}
