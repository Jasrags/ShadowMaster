"use client";

import { useState } from "react";
import { useCreationMethods, useGameplayLevels } from "@/lib/rules/RulesetContext";
import type { GameplayLevel } from "@/lib/types/campaign";
import type { CreationMethod, GameplayLevelModifiers } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Zap,
  Crown,
  Sparkles,
  Calculator,
  Coins,
  Route,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface CreationSetupProps {
  onComplete: (gameplayLevel: GameplayLevel, creationMethodId: string) => void;
  defaultMethodId?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

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

const METHOD_ICONS: Record<string, typeof Sparkles> = {
  priority: Sparkles,
  "sum-to-ten": Calculator,
  "point-buy": Coins,
  "life-modules": Route,
};

const METHOD_COLORS: Record<string, { text: string; bg: string; border: string; ring: string }> = {
  priority: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500/50",
  },
  "sum-to-ten": {
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    ring: "ring-cyan-500/50",
  },
  "point-buy": {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "ring-amber-500/50",
  },
  "life-modules": {
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    ring: "ring-rose-500/50",
  },
};

const DEFAULT_COLORS = {
  text: "text-emerald-600 dark:text-emerald-400",
  bg: "bg-emerald-500/10",
  border: "border-emerald-500/30",
  ring: "ring-emerald-500/50",
};

// =============================================================================
// METHOD SELECTOR STEP
// =============================================================================

function CreationMethodStep({
  methods,
  selectedId,
  onSelect,
  onContinue,
}: {
  methods: CreationMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Choose Creation Method
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Select how you want to build your character. Each method offers a different balance of
          structure and flexibility.
        </p>
      </div>

      <div className={`grid gap-4 ${methods.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {methods.map((method) => {
          const Icon = METHOD_ICONS[method.id] ?? Sparkles;
          const colors = METHOD_COLORS[method.id] ?? DEFAULT_COLORS;
          const isSelected = selectedId === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
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
                  {method.name}
                </h3>
              </div>

              {method.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{method.description}</p>
              )}

              {method.bookId && (
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {method.bookId === "run-faster" ? "Run Faster" : method.bookId}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// GAMEPLAY LEVEL STEP
// =============================================================================

function GameplayLevelStep({
  selectedLevel,
  onSelect,
  onContinue,
  onBack,
}: {
  selectedLevel: GameplayLevel;
  onSelect: (level: GameplayLevel) => void;
  onContinue: () => void;
  onBack?: () => void;
}) {
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
          const isSelected = selectedLevel === levelId;

          return (
            <button
              key={levelId}
              onClick={() => onSelect(levelId)}
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

      <div className="mt-8 flex justify-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

type SetupStep = "method" | "gameplay-level";

export function CreationSetup({ onComplete, defaultMethodId = "priority" }: CreationSetupProps) {
  const methods = useCreationMethods();
  const [step, setStep] = useState<SetupStep>(methods.length > 1 ? "method" : "gameplay-level");
  const [selectedMethod, setSelectedMethod] = useState<string>(defaultMethodId);
  const [selectedLevel, setSelectedLevel] = useState<GameplayLevel>("experienced");

  const hasMultipleMethods = methods.length > 1;

  // Skip method step if only one method available
  if (step === "method" && !hasMultipleMethods) {
    const methodId = methods[0]?.id ?? defaultMethodId;
    return (
      <GameplayLevelStep
        selectedLevel={selectedLevel}
        onSelect={setSelectedLevel}
        onContinue={() => onComplete(selectedLevel, methodId)}
      />
    );
  }

  if (step === "method") {
    return (
      <CreationMethodStep
        methods={methods}
        selectedId={selectedMethod}
        onSelect={setSelectedMethod}
        onContinue={() => setStep("gameplay-level")}
      />
    );
  }

  return (
    <GameplayLevelStep
      selectedLevel={selectedLevel}
      onSelect={setSelectedLevel}
      onContinue={() => onComplete(selectedLevel, selectedMethod)}
      onBack={hasMultipleMethods ? () => setStep("method") : undefined}
    />
  );
}
