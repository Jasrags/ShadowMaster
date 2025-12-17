
"use client";

import type { EditionCode } from "@/lib/types";

interface EditionSelectorProps {
  onSelect: (editionCode: EditionCode) => void;
}

// For MVP, we only support SR5
const AVAILABLE_EDITIONS: Array<{
  code: EditionCode;
  name: string;
  year: number;
  description: string;
  available: boolean;
}> = [
    {
      code: "sr5",
      name: "Shadowrun 5th Edition",
      year: 2013,
      description: "Priority-based character creation with Limits system. The most popular edition.",
      available: true,
    },
    {
      code: "sr6",
      name: "Shadowrun 6th Edition",
      year: 2019,
      description: "Streamlined rules with Edge economy. (Coming Soon)",
      available: false,
    },
    {
      code: "sr4a",
      name: "Shadowrun 4th Edition (20A)",
      year: 2009,
      description: "Build Point system with wireless Matrix. (Coming Soon)",
      available: false,
    },
    {
      code: "anarchy",
      name: "Shadowrun: Anarchy",
      year: 2016,
      description: "Narrative rules-light system with Cues. (Coming Soon)",
      available: false,
    },
  ];

export function EditionSelector({ onSelect }: EditionSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Select Edition
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Choose which Shadowrun edition to use for character creation
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {AVAILABLE_EDITIONS.map((edition) => (
          <button
            key={edition.code}
            type="button"
            onClick={() => onSelect(edition.code)}
            className={`relative rounded-xl border-2 p-4 text-left transition-all outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-black ${edition.available
              ? "border-zinc-200 bg-white hover:border-emerald-500 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500"
              : "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-60 dark:border-zinc-800 dark:bg-zinc-950"
              } `}
          >
            {/* Edition badge */}
            <div className="flex items-start justify-between">
              <div
                className={`inline - flex items - center rounded - full px - 2.5 py - 0.5 text - xs font - medium ${edition.available
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  } `}
              >
                {edition.year}
              </div>
              {!edition.available && (
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                  Coming Soon
                </span>
              )}
            </div>

            {/* Edition name */}
            <h3
              className={`mt - 4 text - lg font - semibold ${edition.available
                ? "text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400"
                : "text-zinc-500 dark:text-zinc-500"
                } `}
            >
              {edition.name}
            </h3>

            {/* Description */}
            <p
              className={`mt - 2 text - sm ${edition.available
                ? "text-zinc-600 dark:text-zinc-400"
                : "text-zinc-400 dark:text-zinc-600"
                } `}
            >
              {edition.description}
            </p>

            {/* Arrow indicator for available editions */}
            {edition.available && (
              <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400">
                <span>Start creating</span>
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Info box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Each edition has different rules, skills, and character creation methods.
              Characters created in one edition cannot be used in campaigns running a different edition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

