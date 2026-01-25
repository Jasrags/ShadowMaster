"use client";

import type { EditionCode } from "@/lib/types";
import { ArrowRight, Info } from "lucide-react";

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

// Get neon card class based on edition code
function getEditionCardClass(editionCode: EditionCode, available: boolean): string {
  if (!available) return "";
  switch (editionCode) {
    case "sr5":
      return "neon-card-sam"; // Green - the "classic" modern edition
    case "sr6":
      return "neon-card-decker"; // Cyan - newest, most "tech forward"
    case "sr4a":
      return "neon-card-mage"; // Purple - the "wireless matrix" era
    case "anarchy":
      return "neon-card-face"; // Amber - narrative/different
    default:
      return "neon-card-sam";
  }
}

// Get accent colors for edition
function getEditionAccent(editionCode: EditionCode): { text: string; bg: string; border: string } {
  switch (editionCode) {
    case "sr5":
      return {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
    case "sr6":
      return {
        text: "text-cyan-600 dark:text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
      };
    case "sr4a":
      return {
        text: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
      };
    case "anarchy":
      return {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
    default:
      return {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
  }
}

export function EditionSelector({ onSelect }: EditionSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Select Edition</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Choose which Shadowrun edition to use for character creation
        </p>
        <div className="neon-divider mt-4 mx-auto max-w-xs" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {AVAILABLE_EDITIONS.map((edition) => {
          const cardClass = getEditionCardClass(edition.code, edition.available);
          const accent = getEditionAccent(edition.code);

          return (
            <button
              key={edition.code}
              type="button"
              onClick={() => edition.available && onSelect(edition.code)}
              disabled={!edition.available}
              className={`group relative rounded-xl border bg-card p-5 text-left transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 ${
                edition.available
                  ? `neon-card ${cardClass} cursor-pointer`
                  : "cursor-not-allowed border-zinc-200 dark:border-zinc-800 opacity-60"
              }`}
            >
              {/* Edition badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium border ${
                    edition.available
                      ? `${accent.bg} ${accent.text} ${accent.border}`
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700"
                  }`}
                >
                  {edition.year}
                </div>
                {!edition.available && (
                  <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Edition name */}
              <h3
                className={`mt-4 text-lg font-semibold transition-colors ${
                  edition.available
                    ? `text-zinc-900 dark:text-zinc-50 group-hover:${accent.text.split(" ")[0].replace("text-", "text-")}`
                    : "text-zinc-500 dark:text-zinc-500"
                }`}
              >
                {edition.name}
              </h3>

              {/* Description */}
              <p
                className={`mt-2 text-sm ${
                  edition.available
                    ? "text-zinc-600 dark:text-zinc-400"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {edition.description}
              </p>

              {/* Arrow indicator for available editions */}
              {edition.available && (
                <div
                  className={`mt-4 flex items-center text-sm font-medium ${accent.text} opacity-0 transition-opacity group-hover:opacity-100`}
                >
                  <span>Start creating</span>
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info box with neon styling */}
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              Each edition has different rules, skills, and character creation methods. Characters
              created in one edition cannot be used in campaigns running a different edition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
