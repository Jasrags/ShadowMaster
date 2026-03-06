"use client";

import { useState } from "react";
import { useGameplayLevels } from "@/lib/rules/RulesetContext";
import type { GameplayLevel } from "@/lib/types/campaign";
import type { GameplayLevelModifiers } from "@/lib/types";
import { ArrowRight, Users, Zap, Crown } from "lucide-react";

interface CreationSetupProps {
  onComplete: (gameplayLevel: GameplayLevel) => void;
}

const LEVEL_ORDER: GameplayLevel[] = ["street", "experienced", "prime-runner"];

const LEVEL_ICONS: Record<string, typeof Users> = {
  street: Users,
  experienced: Zap,
  "prime-runner": Crown,
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  street: "Scraping by in the shadows. Limited gear, fewer contacts, less karma to spend.",
  experienced: "The standard runner. Balanced resources for a well-rounded character.",
  "prime-runner":
    "Elite operatives with access to top-tier gear, extensive networks, and extra karma.",
};

const LEVEL_COLORS: Record<string, { text: string; bg: string; border: string; ring: string }> = {
  street: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "ring-amber-500/50",
  },
  experienced: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500/50",
  },
  "prime-runner": {
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    ring: "ring-violet-500/50",
  },
};

export function CreationSetup({ onComplete }: CreationSetupProps) {
  const [selected, setSelected] = useState<GameplayLevel>("experienced");
  const levels = useGameplayLevels();

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Choose Gameplay Level
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          This determines your starting karma, gear availability, and contact budget.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {LEVEL_ORDER.map((levelId) => {
          const modifiers: GameplayLevelModifiers | undefined = levels[levelId];
          if (!modifiers) return null;

          const Icon = LEVEL_ICONS[levelId] ?? Zap;
          const colors = LEVEL_COLORS[levelId] ?? LEVEL_COLORS.experienced;
          const isSelected = selected === levelId;

          return (
            <button
              key={levelId}
              onClick={() => setSelected(levelId)}
              className={`relative flex flex-col rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? `${colors.border} ${colors.bg} ring-2 ${colors.ring}`
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.bg}`}>
                  <Icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <h3
                  className={`text-sm font-semibold ${isSelected ? colors.text : "text-zinc-900 dark:text-zinc-100"}`}
                >
                  {modifiers.label}
                </h3>
              </div>

              <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                {LEVEL_DESCRIPTIONS[levelId]}
              </p>

              <div className="mt-auto space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Karma</span>
                  <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
                    {modifiers.startingKarma}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Max Availability</span>
                  <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
                    {modifiers.maxAvailability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Contacts</span>
                  <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
                    CHA &times; {modifiers.contactMultiplier}
                  </span>
                </div>
                {modifiers.resourcesMultiplier !== 1.0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Resources</span>
                    <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">
                      &times;{modifiers.resourcesMultiplier}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => onComplete(selected)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
