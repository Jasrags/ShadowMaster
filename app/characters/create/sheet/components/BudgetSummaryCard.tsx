"use client";

import { useMemo } from "react";
import { useCreationBudgets } from "@/lib/contexts";
import type { CreationState, SelectedQuality } from "@/lib/types";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { InfoTooltip } from "@/components/ui";
import { useQualities, useSkills, useGameplayLevelModifiers } from "@/lib/rules/RulesetContext";

// =============================================================================
// BUDGET COLOR HELPERS
// =============================================================================

/**
 * Determines the status and color for a budget bar.
 */
function getBudgetBarColor(budget: { spent: number; total: number; remaining: number }): string {
  if (budget.remaining < 0) return "bg-red-500";
  return "bg-emerald-500";
}

function getBudgetTextColor(budget: { spent: number; total: number; remaining: number }): string {
  if (budget.remaining < 0) return "text-red-600 dark:text-red-400";
  if (budget.remaining === 0 && budget.total > 0) return "text-emerald-600 dark:text-emerald-400";
  return "text-zinc-900 dark:text-zinc-100";
}

// =============================================================================
// TYPES
// =============================================================================

interface KarmaBreakdownItem {
  name: string;
  amount: number; // negative = cost, positive = gain
}

interface KarmaBreakdownCategory {
  label: string;
  total: number;
  items?: KarmaBreakdownItem[];
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate contextual notes for a budget line (e.g. karma-to-nuyen conversion info).
 */
function getNote(
  budgetId: string,
  karmaSpentGear: number,
  karmaSpentContacts: number
): { text: string; style: "info" | "warning" | "error" } | null {
  switch (budgetId) {
    case "karma":
      if (karmaSpentGear > 0 && karmaSpentContacts > 0) {
        return {
          text: `${karmaSpentGear} for nuyen, ${karmaSpentContacts} for contacts`,
          style: "info",
        };
      }
      if (karmaSpentGear > 0) {
        return {
          text: `${karmaSpentGear} converted to ${(karmaSpentGear * 2000).toLocaleString()}¥`,
          style: "info",
        };
      }
      if (karmaSpentContacts > 0) {
        return { text: `${karmaSpentContacts} for extra contacts`, style: "info" };
      }
      return null;

    case "nuyen":
      if (karmaSpentGear > 0) {
        return {
          text: `+${(karmaSpentGear * 2000).toLocaleString()}¥ from karma`,
          style: "info",
        };
      }
      return null;

    case "contact-points":
      if (karmaSpentContacts > 0) {
        return {
          text: `+${karmaSpentContacts} via karma`,
          style: "info",
        };
      }
      return null;

    default:
      return null;
  }
}

// =============================================================================
// BUDGET SUMMARY CARD
// =============================================================================

interface BudgetSummaryCardProps {
  creationState: CreationState;
}

export function BudgetSummaryCard({ creationState }: BudgetSummaryCardProps) {
  const { budgets, isValid, errors, warnings } = useCreationBudgets();
  const { positive: positiveQualityCatalog, negative: negativeQualityCatalog } = useQualities();
  const { activeSkills } = useSkills();
  const gameplayModifiers = useGameplayLevelModifiers(creationState.gameplayLevel);

  // Build lookup maps for quality and skill names
  const positiveQualityMap = useMemo(
    () => new Map(positiveQualityCatalog.map((q) => [q.id, q.name])),
    [positiveQualityCatalog]
  );
  const negativeQualityMap = useMemo(
    () => new Map(negativeQualityCatalog.map((q) => [q.id, q.name])),
    [negativeQualityCatalog]
  );
  const skillNameMap = useMemo(
    () => new Map(activeSkills.map((s) => [s.id, s.name])),
    [activeSkills]
  );

  // Extract conversion/overflow values from creation state for contextual notes
  const karmaSpentGear = (creationState.budgets?.["karma-spent-gear"] as number) || 0;

  // Derive contact karma from selections to avoid stale closure bugs
  const selections = creationState.selections || {};
  const contactsForKarma = (selections.contacts || []) as Array<{
    connection: number;
    loyalty: number;
  }>;
  const attributesForKarma = selections.attributes as Record<string, number> | undefined;
  const charismaForKarma = attributesForKarma?.charisma || 1;
  const contactMultiplier = gameplayModifiers.contactMultiplier;
  const freeContactKarma = charismaForKarma * contactMultiplier;
  const totalContactCost = contactsForKarma.reduce((sum, c) => sum + c.connection + c.loyalty, 0);
  const karmaSpentContacts = Math.max(0, totalContactCost - freeContactKarma);

  // Build karma breakdown for tooltip
  const karmaBreakdown = useMemo(() => {
    const categories: KarmaBreakdownCategory[] = [];
    const selections = creationState.selections || {};

    // Positive Qualities (cost karma)
    const positiveQualities = (selections.positiveQualities || []) as (string | SelectedQuality)[];
    if (positiveQualities.length > 0) {
      const items: KarmaBreakdownItem[] = [];
      let total = 0;
      for (const q of positiveQualities) {
        const id = typeof q === "string" ? q : q.id;
        const karma = typeof q === "object" && q.karma ? q.karma : 0;
        const name = positiveQualityMap.get(id) || id;
        if (karma > 0) {
          items.push({ name, amount: -karma });
          total += karma;
        }
      }
      if (total > 0) {
        categories.push({ label: "Positive Qualities", total: -total, items });
      }
    }

    // Negative Qualities (gain karma)
    const negativeQualities = (selections.negativeQualities || []) as (string | SelectedQuality)[];
    if (negativeQualities.length > 0) {
      const items: KarmaBreakdownItem[] = [];
      let total = 0;
      for (const q of negativeQualities) {
        const id = typeof q === "string" ? q : q.id;
        const karma = typeof q === "object" && q.karma ? q.karma : 0;
        const name = negativeQualityMap.get(id) || id;
        if (karma > 0) {
          items.push({ name, amount: karma });
          total += karma;
        }
      }
      if (total > 0) {
        categories.push({ label: "Negative Qualities", total, items });
      }
    }

    // Skills (from skillKarmaSpent)
    const skillKarmaSpent = selections.skillKarmaSpent as
      | {
          skillRaises?: Record<string, number>;
          skillRatingPoints?: number;
          specializations?: number;
        }
      | undefined;
    if (skillKarmaSpent) {
      const items: KarmaBreakdownItem[] = [];
      let total = 0;

      // Individual skill raises
      if (skillKarmaSpent.skillRaises) {
        for (const [skillId, karma] of Object.entries(skillKarmaSpent.skillRaises)) {
          if (karma > 0) {
            const name = skillNameMap.get(skillId) || skillId;
            items.push({ name, amount: -karma });
            total += karma;
          }
        }
      }

      // Specializations
      if (skillKarmaSpent.specializations && skillKarmaSpent.specializations > 0) {
        items.push({ name: "Specializations", amount: -skillKarmaSpent.specializations });
        total += skillKarmaSpent.specializations;
      }

      if (total > 0) {
        categories.push({ label: "Skills", total: -total, items });
      }
    }

    // Nuyen Conversion
    if (karmaSpentGear > 0) {
      categories.push({ label: "Nuyen Conversion", total: -karmaSpentGear });
    }

    // Extra Contacts
    if (karmaSpentContacts > 0) {
      categories.push({ label: "Extra Contacts", total: -karmaSpentContacts });
    }

    // Spells (karma-spent-spells)
    const karmaSpentSpells = (creationState.budgets?.["karma-spent-spells"] as number) || 0;
    if (karmaSpentSpells > 0) {
      categories.push({ label: "Extra Spells", total: -karmaSpentSpells });
    }

    // Adept Powers (karma-spent-power-points)
    const karmaSpentPowerPoints =
      (creationState.budgets?.["karma-spent-power-points"] as number) || 0;
    if (karmaSpentPowerPoints > 0) {
      categories.push({ label: "Extra Power Points", total: -karmaSpentPowerPoints });
    }

    // Attributes (karma-spent-attributes)
    const karmaSpentAttributes = (creationState.budgets?.["karma-spent-attributes"] as number) || 0;
    if (karmaSpentAttributes > 0) {
      categories.push({ label: "Attribute Raises", total: -karmaSpentAttributes });
    }

    return categories;
  }, [
    creationState.selections,
    creationState.budgets,
    positiveQualityMap,
    negativeQualityMap,
    skillNameMap,
    karmaSpentGear,
    karmaSpentContacts,
  ]);

  // Calculate starting karma (default 25 for SR5 priority)
  const startingKarma = budgets.karma?.total || 25;
  const remainingKarma = budgets.karma?.remaining ?? startingKarma;
  const hasKarmaBreakdown = karmaBreakdown.length > 0;

  // Karma breakdown tooltip content
  const karmaTooltipContent = useMemo(() => {
    if (!hasKarmaBreakdown) return null;

    return (
      <div className="w-52 text-left">
        <div className="mb-2 font-medium">Karma Breakdown</div>
        <div className="mb-2 border-t border-zinc-700" />

        <div className="flex justify-between">
          <span>Starting:</span>
          <span>{startingKarma}</span>
        </div>

        {karmaBreakdown.map((category) => (
          <div key={category.label} className="mt-2">
            <div className="flex justify-between font-medium">
              <span>{category.label}:</span>
              <span className={category.total > 0 ? "text-emerald-400" : ""}>
                {category.total > 0 ? "+" : ""}
                {category.total}
              </span>
            </div>
            {category.items?.map((item) => (
              <div key={item.name} className="flex justify-between pl-2 text-zinc-400">
                <span className="truncate pr-2">{item.name}</span>
                <span className={item.amount > 0 ? "text-emerald-400" : ""}>
                  {item.amount > 0 ? "+" : ""}
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        ))}

        <div className="mt-2 border-t border-zinc-700 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Remaining:</span>
            <span className={remainingKarma < 0 ? "text-red-400" : ""}>{remainingKarma}</span>
          </div>
        </div>
      </div>
    );
  }, [hasKarmaBreakdown, startingKarma, karmaBreakdown, remainingKarma]);

  const budgetList = useMemo(
    () =>
      Object.entries(budgets)
        // Hide budgets with 0 total that aren't relevant for this character
        .filter(([id, budget]) => {
          // Always hide special-attribute-points and skill-group-points if total is 0
          if (id === "special-attribute-points" && budget.total === 0) return false;
          if (id === "skill-group-points" && budget.total === 0) return false;
          // Hide power-points and spell-slots for non-magical characters
          if (id === "power-points" && budget.total === 0) return false;
          if (id === "spell-slots" && budget.total === 0) return false;
          return true;
        })
        .map(([id, budget]) => ({
          id,
          ...budget,
        })),
    [budgets]
  );

  const formatValue = (value: number, format?: string, budgetId?: string) => {
    if (format === "currency") {
      return `${value.toLocaleString()}¥`;
    }
    // Display power points with decimal (PP can be fractional: 0.25, 0.5, etc.)
    if (budgetId === "power-points" || format === "decimal") {
      return value % 1 === 0 ? `${value}.0 PP` : `${value.toFixed(2)} PP`;
    }
    return value.toString();
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Budget Summary</h3>
        {isValid ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Valid
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.length} error{errors.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {budgetList.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set priorities to see available budgets
          </p>
        ) : (
          budgetList.map((budget) => {
            const barColor = getBudgetBarColor(budget);
            const textColor = getBudgetTextColor(budget);
            const percentSpent =
              budget.total > 0
                ? Math.min(100, Math.max(0, (budget.spent / budget.total) * 100))
                : 0;
            const note = getNote(budget.id, karmaSpentGear, karmaSpentContacts);
            const hasOverflow = budget.spent > budget.total;
            const isKarma = budget.id === "karma";
            const showKarmaTooltip = isKarma && hasKarmaBreakdown && karmaTooltipContent;

            return (
              <div key={budget.id}>
                {/* Label and values: "X spent • Y left" */}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                    <span>{budget.label}</span>
                    {showKarmaTooltip && (
                      <InfoTooltip
                        content={karmaTooltipContent}
                        label="Karma breakdown"
                        placement="bottom"
                      />
                    )}
                  </span>
                  <span className={`font-mono font-medium ${textColor}`}>
                    {formatValue(budget.spent, budget.displayFormat, budget.id)} spent
                    <span className="font-sans text-zinc-400"> • </span>
                    {formatValue(
                      Math.max(0, budget.remaining),
                      budget.displayFormat,
                      budget.id
                    )}{" "}
                    left
                    {hasOverflow && (
                      <span className="text-red-500">
                        {" "}
                        (+
                        {formatValue(budget.spent - budget.total, budget.displayFormat, budget.id)})
                      </span>
                    )}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full transition-all ${barColor}`}
                    style={{ width: `${percentSpent}%` }}
                  />
                  {/* Overflow indicator */}
                  {hasOverflow && (
                    <div
                      className="absolute right-0 top-0 h-full bg-red-500"
                      style={{
                        width: `${Math.min(30, ((budget.spent - budget.total) / budget.total) * 100)}%`,
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
                      }}
                    />
                  )}
                </div>

                {/* Contextual note */}
                {note && (
                  <div
                    className={`mt-0.5 text-xs ${
                      note.style === "warning"
                        ? "text-amber-600 dark:text-amber-400"
                        : note.style === "error"
                          ? "text-red-600 dark:text-red-400"
                          : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {note.text}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mt-4 rounded-md bg-amber-50 p-3 dark:bg-amber-950/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
            <div className="text-xs text-amber-800 dark:text-amber-200">
              {warnings.map((w) => (
                <p key={w.message}>{w.message}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-950/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
            <div className="text-xs text-red-800 dark:text-red-200">
              {errors.map((e) => (
                <p key={e.message}>{e.message}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
