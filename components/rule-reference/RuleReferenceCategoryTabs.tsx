"use client";

import type { RuleReferenceCategory } from "@/lib/types";

interface RuleReferenceCategoryTabsProps {
  categories: RuleReferenceCategory[];
  selected: RuleReferenceCategory | null;
  onSelect: (category: RuleReferenceCategory | null) => void;
}

const CATEGORY_LABELS: Record<RuleReferenceCategory, string> = {
  combat: "Combat",
  magic: "Magic",
  matrix: "Matrix",
  rigging: "Rigging",
  social: "Social",
  environment: "Environment",
  tests: "Tests",
  equipment: "Equipment",
};

export function RuleReferenceCategoryTabs({
  categories,
  selected,
  onSelect,
}: RuleReferenceCategoryTabsProps) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Filter by category"
    >
      <button
        role="tab"
        aria-selected={selected === null}
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          selected === null
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={selected === cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            selected === cat
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
