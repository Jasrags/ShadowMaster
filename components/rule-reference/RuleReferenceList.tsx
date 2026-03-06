"use client";

import { useRef, useCallback } from "react";
import type { RuleReferenceEntry } from "@/lib/types";

interface RuleReferenceListProps {
  entries: RuleReferenceEntry[];
  selectedEntry: RuleReferenceEntry | null;
  onSelect: (entry: RuleReferenceEntry) => void;
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  combat: "bg-red-400",
  magic: "bg-purple-400",
  matrix: "bg-cyan-400",
  rigging: "bg-orange-400",
  social: "bg-pink-400",
  environment: "bg-green-400",
  tests: "bg-blue-400",
  equipment: "bg-amber-400",
};

export function RuleReferenceList({ entries, selectedEntry, onSelect }: RuleReferenceListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!entries.length) return;

      const currentIndex = selectedEntry ? entries.indexOf(selectedEntry) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(currentIndex + 1, entries.length - 1);
        onSelect(entries[next]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(currentIndex - 1, 0);
        onSelect(entries[prev]);
      }
    },
    [entries, selectedEntry, onSelect]
  );

  if (entries.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
        No matching rules found
      </div>
    );
  }

  return (
    <ul
      ref={listRef}
      role="listbox"
      aria-label="Rule reference entries"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="space-y-0.5 outline-none"
    >
      {entries.map((entry) => {
        const isSelected = selectedEntry?.id === entry.id;
        const dotColor = CATEGORY_DOT_COLORS[entry.category] ?? "bg-zinc-400";

        return (
          <li
            key={entry.id}
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(entry)}
            className={`cursor-pointer rounded-lg px-3 py-2 transition-colors ${
              isSelected
                ? "bg-emerald-50 dark:bg-emerald-900/20"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} aria-hidden="true" />
              <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {entry.title}
              </span>
            </div>
            <p className="ml-4 truncate text-xs text-zinc-500 dark:text-zinc-500">
              {entry.summary}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
