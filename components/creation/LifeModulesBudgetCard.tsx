"use client";

/**
 * LifeModulesBudgetCard
 *
 * Displays the 750 Karma budget breakdown for Life Modules character creation.
 * Shows spending by category with a running total and remaining budget.
 * Replaces PrioritySelectionCard in the Foundation column for Life Modules.
 */

import { useMemo } from "react";
import { Route } from "lucide-react";
import { CreationCard, BudgetIndicator } from "./shared";
import type { CreationState } from "@/lib/types";
import {
  LIFE_MODULES_KARMA_BUDGET,
  LIFE_MODULES_MAX_GEAR_KARMA,
  LIFE_MODULES_MAX_NEGATIVE_QUALITIES,
  LIFE_MODULES_NUYEN_PER_KARMA,
} from "@/lib/types";
import {
  POINT_BUY_METATYPE_COSTS,
  POINT_BUY_MAGIC_QUALITY_COSTS,
} from "@/lib/rules/point-buy-validation";

interface LifeModulesBudgetCardProps {
  readonly state: CreationState;
}

interface BudgetLineItem {
  readonly label: string;
  readonly amount: number;
  readonly sublabel?: string;
}

/**
 * Calculate Life Modules karma spending from creation state selections and budgets.
 */
function calculateKarmaBreakdown(state: CreationState): readonly BudgetLineItem[] {
  const items: BudgetLineItem[] = [];
  const selections = state.selections || {};
  const budgets = state.budgets || {};

  // Metatype karma cost
  const metatypeId = selections.metatype as string | undefined;
  const metatypeKarma = metatypeId ? (POINT_BUY_METATYPE_COSTS[metatypeId] ?? 0) : 0;
  if (metatypeKarma > 0) {
    items.push({ label: "Metatype", amount: metatypeKarma });
  }

  // Magic/Resonance path karma cost
  const magicPath = selections["magical-path"] as string | undefined;
  const magicKarma =
    magicPath && magicPath !== "mundane" ? (POINT_BUY_MAGIC_QUALITY_COSTS[magicPath] ?? 0) : 0;
  if (magicKarma > 0) {
    items.push({ label: "Magic/Resonance", amount: magicKarma });
  }

  // Karma spent on life module selections
  const lifeModules = selections.lifeModules;
  if (lifeModules && lifeModules.length > 0) {
    const moduleKarma = lifeModules.reduce((sum, mod) => sum + mod.karmaCost, 0);
    items.push({
      label: "Life Modules",
      amount: moduleKarma,
      sublabel: `${lifeModules.length} module${lifeModules.length !== 1 ? "s" : ""}`,
    });
  }

  // Attribute karma
  const attrKarma = budgets["karma-spent-attributes"] || 0;
  if (attrKarma > 0) {
    items.push({ label: "Attributes", amount: attrKarma });
  }

  // Skill karma
  const skillKarma = budgets["karma-spent-skills"] || 0;
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

  // Bought-off negative qualities (costs karma to remove — Run Faster p.67)
  const buyOffKarma = budgets["karma-spent-quality-buyoff"] || 0;
  if (buyOffKarma > 0) {
    items.push({ label: "Bought Off Qualities", amount: buyOffKarma });
  }

  // Contacts
  const contactKarma = budgets["karma-spent-contacts"] || 0;
  if (contactKarma > 0) {
    items.push({ label: "Contacts", amount: contactKarma });
  }

  // Gear (karma-to-nuyen conversion)
  const gearKarma = budgets["karma-spent-gear"] || 0;
  if (gearKarma > 0) {
    items.push({
      label: "Gear",
      amount: gearKarma,
      sublabel: `${(gearKarma * LIFE_MODULES_NUYEN_PER_KARMA).toLocaleString()}¥`,
    });
  }

  // Spells
  const spellKarma = budgets["karma-spent-spells"] || 0;
  if (spellKarma > 0) {
    items.push({ label: "Spells", amount: spellKarma });
  }

  // Power Points (Mystic Adept)
  const ppKarma = budgets["karma-spent-power-points"] || 0;
  if (ppKarma > 0) {
    items.push({ label: "Power Points", amount: ppKarma });
  }

  return items;
}

export function LifeModulesBudgetCard({ state }: LifeModulesBudgetCardProps) {
  const breakdown = useMemo(() => calculateKarmaBreakdown(state), [state]);

  const totalSpent = useMemo(
    () => breakdown.reduce((sum, item) => sum + item.amount, 0),
    [breakdown]
  );

  const remaining = LIFE_MODULES_KARMA_BUDGET - totalSpent;
  const gearKarma = state.budgets?.["karma-spent-gear"] || 0;
  const negQualityKarmaRaw = state.budgets?.["negative-quality-karma-gained"] || 0;
  const buyOffKarma = state.budgets?.["karma-spent-quality-buyoff"] || 0;
  // Enforce 25 Karma max AFTER buy-offs are applied (Run Faster p.67)
  const negQualityKarma = negQualityKarmaRaw - buyOffKarma;

  const validationStatus = useMemo(() => {
    if (totalSpent > LIFE_MODULES_KARMA_BUDGET) return "error" as const;
    if (gearKarma > LIFE_MODULES_MAX_GEAR_KARMA) return "error" as const;
    if (negQualityKarma > LIFE_MODULES_MAX_NEGATIVE_QUALITIES) return "error" as const;
    if (totalSpent === 0) return "pending" as const;
    if (remaining === 0) return "valid" as const;
    return "warning" as const;
  }, [totalSpent, gearKarma, negQualityKarma, remaining, buyOffKarma]);

  return (
    <CreationCard
      id="life-modules-budget"
      title="Karma Budget"
      description="750 Karma — build your character through life path modules"
      status={validationStatus}
      headerAction={
        <div className="flex items-center gap-1.5">
          <Route className="h-3.5 w-3.5 text-rose-500" />
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
          total={LIFE_MODULES_KARMA_BUDGET}
          showProgressBar
          tooltip="Life Modules: 750 Karma to build your character through life path choices"
        />

        {/* Gear sub-budget */}
        {gearKarma > 0 && (
          <BudgetIndicator
            label="Gear Karma"
            spent={gearKarma}
            total={LIFE_MODULES_MAX_GEAR_KARMA}
            mode="compact"
            tooltip={`Max ${LIFE_MODULES_MAX_GEAR_KARMA} Karma on gear (1 Karma = ${LIFE_MODULES_NUYEN_PER_KARMA.toLocaleString()}¥)`}
          />
        )}

        {/* Negative quality sub-budget */}
        {negQualityKarma > 0 && (
          <BudgetIndicator
            label="Negative Qualities"
            spent={negQualityKarma}
            total={LIFE_MODULES_MAX_NEGATIVE_QUALITIES}
            mode="compact"
            tooltip={`Max ${LIFE_MODULES_MAX_NEGATIVE_QUALITIES} Karma of negative qualities after all modules`}
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
                  totalSpent > LIFE_MODULES_KARMA_BUDGET
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {totalSpent} / {LIFE_MODULES_KARMA_BUDGET}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Select life modules to see your karma spending breakdown.
          </p>
        )}

        {/* Warnings */}
        {remaining < 0 && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Over budget by {Math.abs(remaining)} Karma. Remove or reduce allocations.
          </div>
        )}
        {gearKarma > LIFE_MODULES_MAX_GEAR_KARMA && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Gear karma cap exceeded ({gearKarma}/{LIFE_MODULES_MAX_GEAR_KARMA}).
          </div>
        )}
        {negQualityKarma > LIFE_MODULES_MAX_NEGATIVE_QUALITIES && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Negative quality karma exceeded ({negQualityKarma}/{LIFE_MODULES_MAX_NEGATIVE_QUALITIES}
            ).
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
