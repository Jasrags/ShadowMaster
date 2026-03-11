"use client";

/**
 * PointBuyBudgetCard
 *
 * Displays the 800 Karma budget breakdown for Point Buy character creation.
 * Shows spending by category with a running total and remaining budget.
 * Replaces PrioritySelectionCard in the Foundation column for Point Buy.
 */

import { useMemo } from "react";
import { Coins } from "lucide-react";
import { CreationCard, BudgetIndicator } from "./shared";
import type { CreationState } from "@/lib/types";
import {
  POINT_BUY_KARMA_BUDGET,
  POINT_BUY_MAX_GEAR_KARMA,
  POINT_BUY_METATYPE_COSTS,
  POINT_BUY_MAGIC_QUALITY_COSTS,
} from "@/lib/rules/point-buy-validation";

interface PointBuyBudgetCardProps {
  state: CreationState;
}

interface BudgetLineItem {
  readonly label: string;
  readonly amount: number;
  readonly sublabel?: string;
}

/**
 * Calculate Point Buy karma spending from creation state selections and budgets.
 */
function calculateKarmaBreakdown(state: CreationState): readonly BudgetLineItem[] {
  const items: BudgetLineItem[] = [];
  const selections = state.selections || {};
  const budgets = state.budgets || {};

  // Metatype cost
  const metatypeId = selections.metatype as string | undefined;
  if (metatypeId) {
    const cost = POINT_BUY_METATYPE_COSTS[metatypeId] ?? 0;
    items.push({
      label: "Metatype",
      amount: cost,
      sublabel: `${metatypeId.charAt(0).toUpperCase()}${metatypeId.slice(1)}`,
    });
  }

  // Magic/Resonance quality
  const magicalPath = selections["magical-path"] as string | undefined;
  if (magicalPath) {
    const cost = POINT_BUY_MAGIC_QUALITY_COSTS[magicalPath] ?? 0;
    if (cost > 0) {
      items.push({
        label: "Magic/Resonance",
        amount: cost,
        sublabel: formatMagicPath(magicalPath),
      });
    }
  }

  // Attribute karma (from budget tracking)
  const attrKarma = budgets["point-buy-attributes"] || budgets["karma-spent-attributes"] || 0;
  if (attrKarma > 0) {
    items.push({ label: "Attributes", amount: attrKarma });
  }

  // Skill karma
  const skillKarma = budgets["point-buy-skills"] || budgets["karma-spent-skills"] || 0;
  if (skillKarma > 0) {
    items.push({ label: "Skills", amount: skillKarma });
  }

  // Positive qualities (cost karma)
  const posQualityKarma = budgets["positive-quality-karma-spent"] || 0;
  if (posQualityKarma > 0) {
    items.push({ label: "Positive Qualities", amount: posQualityKarma });
  }

  // Negative qualities (refund karma — shown as negative)
  const negQualityKarma = budgets["negative-quality-karma-gained"] || 0;
  if (negQualityKarma > 0) {
    items.push({ label: "Negative Qualities", amount: -negQualityKarma });
  }

  // Contacts
  const contactKarma = budgets["point-buy-contacts"] || budgets["karma-spent-contacts"] || 0;
  if (contactKarma > 0) {
    items.push({ label: "Contacts", amount: contactKarma });
  }

  // Gear (karma-to-nuyen conversion)
  const gearKarma = budgets["point-buy-gear"] || budgets["karma-spent-gear"] || 0;
  if (gearKarma > 0) {
    items.push({
      label: "Gear",
      amount: gearKarma,
      sublabel: `${(gearKarma * 2000).toLocaleString()}¥`,
    });
  }

  // Spells
  const spellKarma = budgets["point-buy-spells"] || budgets["karma-spent-spells"] || 0;
  if (spellKarma > 0) {
    items.push({ label: "Spells", amount: spellKarma });
  }

  // Power Points (Mystic Adept)
  const ppKarma = budgets["point-buy-power-points"] || budgets["karma-spent-power-points"] || 0;
  if (ppKarma > 0) {
    items.push({ label: "Power Points", amount: ppKarma });
  }

  return items;
}

function formatMagicPath(path: string): string {
  const names: Record<string, string> = {
    adept: "Adept",
    "aspected-magician": "Aspected Magician",
    "aspected-mage": "Aspected Magician",
    magician: "Magician",
    "mystic-adept": "Mystic Adept",
    technomancer: "Technomancer",
  };
  return names[path] ?? path;
}

export function PointBuyBudgetCard({ state }: PointBuyBudgetCardProps) {
  const breakdown = useMemo(() => calculateKarmaBreakdown(state), [state]);

  const totalSpent = useMemo(
    () => breakdown.reduce((sum, item) => sum + item.amount, 0),
    [breakdown]
  );

  const remaining = POINT_BUY_KARMA_BUDGET - totalSpent;
  const gearKarma = state.budgets?.["point-buy-gear"] || state.budgets?.["karma-spent-gear"] || 0;

  const validationStatus = useMemo(() => {
    if (totalSpent > POINT_BUY_KARMA_BUDGET) return "error" as const;
    if (gearKarma > POINT_BUY_MAX_GEAR_KARMA) return "error" as const;
    if (totalSpent === 0) return "pending" as const;
    if (remaining === 0) return "valid" as const;
    return "warning" as const;
  }, [totalSpent, gearKarma, remaining]);

  return (
    <CreationCard
      id="point-buy-budget"
      title="Karma Budget"
      description="800 Karma — purchase everything with advancement costs"
      status={validationStatus}
      headerAction={
        <div className="flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5 text-amber-500" />
          <span
            className={`text-xs font-mono font-bold ${
              remaining < 0
                ? "text-red-600 dark:text-red-400"
                : remaining === 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-700 dark:text-zinc-300"
            }`}
          >
            {remaining} remaining
          </span>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Main budget indicator */}
        <BudgetIndicator
          label="Total Karma"
          spent={Math.max(0, totalSpent)}
          total={POINT_BUY_KARMA_BUDGET}
          showProgressBar
          tooltip="Point Buy: 800 Karma to build your character from scratch"
        />

        {/* Gear sub-budget */}
        {gearKarma > 0 && (
          <BudgetIndicator
            label="Gear Karma"
            spent={gearKarma}
            total={POINT_BUY_MAX_GEAR_KARMA}
            mode="compact"
            tooltip="Max 200 Karma on gear (1 Karma = 2,000¥)"
          />
        )}

        {/* Breakdown */}
        {breakdown.length > 0 ? (
          <div className="space-y-1 border-t border-zinc-100 pt-2 dark:border-zinc-800">
            <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Spending Breakdown
            </h4>
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.label}</span>
                  {item.sublabel && (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      ({item.sublabel})
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-mono font-medium ${
                    item.amount < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {item.amount < 0 ? "+" : ""}
                  {Math.abs(item.amount)}
                </span>
              </div>
            ))}

            {/* Total line */}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-1.5 dark:border-zinc-700">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Total</span>
              <span
                className={`text-xs font-mono font-bold ${
                  totalSpent > POINT_BUY_KARMA_BUDGET
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {totalSpent} / {POINT_BUY_KARMA_BUDGET}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Select a metatype and start allocating karma to see your spending breakdown.
          </p>
        )}

        {/* Warnings */}
        {remaining < 0 && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Over budget by {Math.abs(remaining)} Karma. Remove or reduce allocations.
          </div>
        )}
        {gearKarma > POINT_BUY_MAX_GEAR_KARMA && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Gear karma cap exceeded ({gearKarma}/{POINT_BUY_MAX_GEAR_KARMA}).
          </div>
        )}
        {remaining > 0 && totalSpent > 0 && (
          <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            {remaining} Karma remaining. Leftover Karma cannot be carried over.
          </div>
        )}
      </div>
    </CreationCard>
  );
}
