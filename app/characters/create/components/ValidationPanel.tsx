"use client";

import type { CreationState } from "@/lib/types";

interface ValidationPanelProps {
  state: CreationState;
  budgetValues: Record<string, number>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("$", "¥");
}

export function ValidationPanel({ state, budgetValues }: ValidationPanelProps) {
  // Calculate spent values from state budgets
  const attrSpent = (state.budgets["attribute-points-spent"] as number) || 0;
  const skillSpent = (state.budgets["skill-points-spent"] as number) || 0;
  const skillGroupSpent = (state.budgets["skill-group-points-spent"] as number) || 0;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
  const nuyenSpent = (state.budgets["nuyen-spent"] as number) || 0;

  const budgetItems = [
    {
      id: "attribute-points",
      label: "Attribute Points",
      value: budgetValues["attribute-points"] || 0,
      spent: attrSpent,
      format: "number",
    },
    {
      id: "special-attribute-points",
      label: "Special Attr Points",
      value: budgetValues["special-attribute-points"] || 0,
      spent: 0,
      format: "number",
    },
    {
      id: "skill-points",
      label: "Skill Points",
      value: budgetValues["skill-points"] || 0,
      spent: skillSpent,
      format: "number",
    },
    {
      id: "skill-group-points",
      label: "Skill Group Points",
      value: budgetValues["skill-group-points"] || 0,
      spent: skillGroupSpent,
      format: "number",
    },
    {
      id: "karma",
      label: "Karma",
      value: (budgetValues["karma"] || 25) + karmaGainedNegative,
      spent: karmaSpentPositive,
      format: "number",
    },
    {
      id: "nuyen",
      label: "Nuyen",
      value: budgetValues["nuyen"] || 0,
      spent: nuyenSpent,
      format: "currency",
    },
  ];

  const hasErrors = state.errors.length > 0;
  const hasWarnings = state.warnings.length > 0;

  return (
    <div className="w-72 flex-shrink-0 border-l border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Resources Section */}
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Resources
        </h3>
        <div className="mt-3 space-y-3">
          {budgetItems.map((item) => {
            const remaining = item.value - item.spent;
            const isOverspent = remaining < 0;

            return (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.label}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isOverspent
                      ? "text-red-600 dark:text-red-400"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {item.format === "currency"
                    ? formatCurrency(remaining)
                    : remaining}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selections Summary */}
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Selections
        </h3>
        <div className="mt-3 space-y-2">
          {state.selections.metatype ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Metatype</span>
              <span className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
                {state.selections.metatype as string}
              </span>
            </div>
          ) : (
            <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
              No selections yet
            </p>
          )}
          {typeof state.selections["magical-path"] === "string" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Magic</span>
              <span className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-100">
                {state.selections["magical-path"].replace("-", " ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Priorities */}
      {Object.keys(state.priorities || {}).length > 0 && (
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Priorities
          </h3>
          <div className="mt-3 space-y-2">
            {Object.entries(state.priorities || {}).map(([category, level]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
                  {category}
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {String(level)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {(hasErrors || hasWarnings) && (
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Validation
          </h3>
          <div className="mt-3 space-y-2">
            {state.errors.map((error, index) => (
              <div
                key={`error-${index}`}
                className="flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-950"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs text-red-700 dark:text-red-300">
                  {error.message}
                </span>
              </div>
            ))}
            {state.warnings.map((warning, index) => (
              <div
                key={`warning-${index}`}
                className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-950"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0 text-amber-500"
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
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  {warning.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No issues indicator */}
      {!hasErrors && !hasWarnings && Object.keys(state.priorities || {}).length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              All validations passing
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

