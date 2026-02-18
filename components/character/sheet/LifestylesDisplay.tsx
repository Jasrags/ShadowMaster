"use client";

import { useState } from "react";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Home } from "lucide-react";
import type { Lifestyle, LifestyleModification } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCost(cost: number): string {
  return `¥${cost.toLocaleString()}/mo`;
}

function formatModifier(mod: LifestyleModification): string {
  if (mod.modifierType === "percentage") {
    return `${mod.modifier > 0 ? "+" : ""}${mod.modifier}%`;
  }
  return `${mod.modifier > 0 ? "+" : ""}${mod.modifier.toLocaleString()}¥`;
}

// ---------------------------------------------------------------------------
// LifestyleRow
// ---------------------------------------------------------------------------

function LifestyleRow({ lifestyle }: { lifestyle: Lifestyle }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasStats =
    lifestyle.prepaidMonths != null ||
    lifestyle.customExpenses != null ||
    lifestyle.customIncome != null;
  const hasMods = lifestyle.modifications && lifestyle.modifications.length > 0;
  const hasSubs = lifestyle.subscriptions && lifestyle.subscriptions.length > 0;
  const hasNotes = !!lifestyle.notes;

  return (
    <div
      data-testid="lifestyle-row"
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Collapsed row: Chevron + Type + Location + Primary badge + Cost pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium capitalize text-zinc-800 dark:text-zinc-200">
          {lifestyle.type}
        </span>
        {lifestyle.location && (
          <span className="truncate text-[10px] text-zinc-400 dark:text-zinc-500">
            ({lifestyle.location})
          </span>
        )}
        <span
          data-testid="cost-pill"
          className="ml-auto shrink-0 rounded border border-sky-500/20 bg-sky-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-300"
        >
          {formatCost(lifestyle.monthlyCost)}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stats row */}
          {hasStats && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              {lifestyle.prepaidMonths != null && (
                <span data-testid="stat-prepaid">
                  Prepaid{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    {lifestyle.prepaidMonths} mo
                  </span>
                </span>
              )}
              {lifestyle.customExpenses != null && (
                <span data-testid="stat-expenses">
                  Expenses{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    ¥{lifestyle.customExpenses.toLocaleString()}
                  </span>
                </span>
              )}
              {lifestyle.customIncome != null && (
                <span data-testid="stat-income">
                  Income{" "}
                  <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    ¥{lifestyle.customIncome.toLocaleString()}
                  </span>
                </span>
              )}
            </div>
          )}

          {/* Notes */}
          {hasNotes && (
            <p data-testid="notes" className="text-xs italic text-zinc-500 dark:text-zinc-400">
              {lifestyle.notes}
            </p>
          )}

          {/* Modifications */}
          {hasMods && (
            <div data-testid="modifications-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Modifications
              </div>
              <div className="space-y-0.5">
                {lifestyle.modifications!.map((mod, idx) => (
                  <div
                    key={`${mod.catalogId ?? mod.name}-${idx}`}
                    data-testid="mod-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                    <span
                      data-testid="mod-type"
                      className={`rounded px-1 py-0.5 font-mono text-[10px] ${
                        mod.type === "positive"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {mod.type}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                      {formatModifier(mod)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscriptions */}
          {hasSubs && (
            <div data-testid="subscriptions-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Subscriptions
              </div>
              <div className="space-y-0.5">
                {lifestyle.subscriptions!.map((sub, idx) => (
                  <div
                    key={`${sub.catalogId ?? sub.name}-${idx}`}
                    data-testid="sub-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{sub.name}</span>
                    {sub.category && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        ({sub.category})
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                      ¥{sub.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LifestylesDisplay
// ---------------------------------------------------------------------------

interface LifestylesDisplayProps {
  lifestyles: Lifestyle[];
}

export function LifestylesDisplay({ lifestyles }: LifestylesDisplayProps) {
  if (!lifestyles || lifestyles.length === 0) return null;

  return (
    <DisplayCard title="Lifestyles" icon={<Home className="h-4 w-4 text-zinc-400" />}>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        {lifestyles.map((lifestyle, index) => (
          <LifestyleRow key={lifestyle.id ?? `lifestyle-${index}`} lifestyle={lifestyle} />
        ))}
      </div>
    </DisplayCard>
  );
}
