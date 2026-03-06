"use client";

import type { RuleReferenceEntry } from "@/lib/types";
import { RuleReferenceTable } from "./RuleReferenceTable";

interface RuleReferenceCardProps {
  entry: RuleReferenceEntry;
}

const CATEGORY_COLORS: Record<string, string> = {
  combat: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  magic: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  matrix: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  rigging: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  social: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  environment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  tests: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  equipment: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function RuleReferenceCard({ entry }: RuleReferenceCardProps) {
  const colorClass =
    CATEGORY_COLORS[entry.category] ??
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {entry.category}
          </span>
          {entry.subcategory && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500">{entry.subcategory}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{entry.title}</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{entry.summary}</p>
      </div>

      {/* Tables */}
      {entry.tables.map((table, i) => (
        <RuleReferenceTable key={i} table={table} />
      ))}

      {/* Notes */}
      {entry.notes && entry.notes.length > 0 && (
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-500">Notes</p>
          <ul className="space-y-1">
            {entry.notes.map((note, i) => (
              <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source */}
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        {entry.source.book}, p. {entry.source.page}
      </p>
    </div>
  );
}
