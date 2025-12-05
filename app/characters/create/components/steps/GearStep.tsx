"use client";

import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function GearStep({ state, updateState, budgetValues }: StepProps) {
  const nuyen = budgetValues["nuyen"] || 0;

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Purchase weapons, armor, gear, and lifestyle with your ¥{formatCurrency(nuyen)} starting resources.
        Maximum availability is 12 at character creation.
      </p>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Step Not Yet Implemented
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              The gear purchasing interface is coming soon. For now, you can proceed to see the wizard flow.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder UI */}
      <div className="rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-zinc-500 dark:text-zinc-400">
          Gear catalog and shopping cart will appear here
        </p>
      </div>
    </div>
  );
}

