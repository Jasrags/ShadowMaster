"use client";

/**
 * SheetCreationLayout
 *
 * Three-column responsive layout for sheet-driven character creation.
 * Organizes creation components into logical groups:
 *
 * Column 1 (Foundation): Priority, Metatype, Qualities
 * Column 2 (Stats): Attributes, Special Attributes, Magic/Resonance
 * Column 3 (Abilities): Skills, Knowledge, Gear
 *
 * Responsive behavior:
 * - Desktop (>1280px): Three columns
 * - Tablet (768-1280px): Two columns
 * - Mobile (<768px): Single column with collapsible sections
 */

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useCreationBudgets } from "@/lib/contexts";
import type { CreationState, Campaign, SelectedQuality } from "@/lib/types";
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2, Clock, Save } from "lucide-react";
import { InfoTooltip } from "@/components/ui";
import { useQualities, useSkills } from "@/lib/rules/RulesetContext";

// Phase 2, 3, 4, 5 & 6 Components - Static imports for always-visible cards
import {
  PrioritySelectionCard,
  MetatypeCard,
  AttributesCard,
  SkillsCard,
  KnowledgeLanguagesCard,
  QualitiesCard,
  MagicPathCard,
  GearPanel,
  WeaponsPanel,
  ArmorPanel,
  MatrixGearCard,
  AugmentationsCard,
  VehiclesCard,
  ContactsCard,
  IdentitiesCard,
  CharacterInfoCard,
  DerivedStatsCard,
} from "@/components/creation";

// Dynamic imports for conditional cards (code splitting)
import { CardSkeleton } from "@/components/creation/shared";

const SpellsCard = dynamic(
  () => import("@/components/creation/SpellsCard").then((mod) => mod.SpellsCard),
  {
    loading: () => <CardSkeleton title="Spells" rows={4} />,
    ssr: false,
  }
);

const AdeptPowersCard = dynamic(
  () => import("@/components/creation/AdeptPowersCard").then((mod) => mod.AdeptPowersCard),
  {
    loading: () => <CardSkeleton title="Adept Powers" rows={4} />,
    ssr: false,
  }
);

const ComplexFormsCard = dynamic(
  () => import("@/components/creation/ComplexFormsCard").then((mod) => mod.ComplexFormsCard),
  {
    loading: () => <CardSkeleton title="Complex Forms" rows={4} />,
    ssr: false,
  }
);

const FociCard = dynamic(
  () => import("@/components/creation/foci/FociCard").then((mod) => mod.FociCard),
  {
    loading: () => <CardSkeleton title="Foci" rows={4} />,
    ssr: false,
  }
);

// =============================================================================
// TYPES
// =============================================================================

interface SheetCreationLayoutProps {
  creationState: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  onFinalize: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError?: string | null;
  onRetry?: () => void;
  campaignId?: string;
  campaign?: Campaign | null;
}

// =============================================================================
// PLACEHOLDER COMPONENTS
// =============================================================================

/**
 * Temporary placeholder card for sections not yet implemented.
 * Will be replaced with actual creation components in Phase 3-6.
 */
function PlaceholderCard({
  title,
  description,
  status = "pending",
}: {
  title: string;
  description: string;
  status?: "pending" | "partial" | "complete";
}) {
  const statusColors = {
    pending: "border-zinc-200 dark:border-zinc-800",
    partial: "border-amber-300 dark:border-amber-700",
    complete: "border-emerald-300 dark:border-emerald-700",
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-zinc-400" />,
    partial: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    complete: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed ${statusColors[status]} bg-zinc-50 p-4 dark:bg-zinc-900`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
        {statusIcons[status]}
      </div>
    </div>
  );
}

// =============================================================================
// BUDGET SUMMARY CARD
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

interface BudgetSummaryCardProps {
  creationState: CreationState;
}

function BudgetSummaryCard({ creationState }: BudgetSummaryCardProps) {
  const { budgets, isValid, errors, warnings } = useCreationBudgets();
  const { positive: positiveQualityCatalog, negative: negativeQualityCatalog } = useQualities();
  const { activeSkills } = useSkills();

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
  const freeContactKarma = charismaForKarma * 3;
  const totalContactCost = contactsForKarma.reduce((sum, c) => sum + c.connection + c.loyalty, 0);
  const karmaSpentContacts = Math.max(0, totalContactCost - freeContactKarma);

  // Build karma breakdown for tooltip
  interface KarmaBreakdownItem {
    name: string;
    amount: number; // negative = cost, positive = gain
  }
  interface KarmaBreakdownCategory {
    label: string;
    total: number;
    items?: KarmaBreakdownItem[];
  }

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

        {karmaBreakdown.map((category, idx) => (
          <div key={idx} className="mt-2">
            <div className="flex justify-between font-medium">
              <span>{category.label}:</span>
              <span className={category.total > 0 ? "text-emerald-400" : ""}>
                {category.total > 0 ? "+" : ""}
                {category.total}
              </span>
            </div>
            {category.items?.map((item, itemIdx) => (
              <div key={itemIdx} className="flex justify-between pl-2 text-zinc-400">
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

  // Generate contextual notes for each budget
  const getNote = (
    budgetId: string
  ): { text: string; style: "info" | "warning" | "error" } | null => {
    switch (budgetId) {
      case "karma":
        // Show breakdown if karma is being used for gear or contacts
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
        // Show if nuyen was augmented by karma conversion
        if (karmaSpentGear > 0) {
          return {
            text: `+${(karmaSpentGear * 2000).toLocaleString()}¥ from karma`,
            style: "info",
          };
        }
        return null;

      case "contact-points":
        // Show if contacts overflowed to general karma
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
  };

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
            const note = getNote(budget.id);
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
              {warnings.map((w, i) => (
                <p key={i}>{w.message}</p>
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
              {errors.map((e, i) => (
                <p key={i}>{e.message}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// VALIDATION SUMMARY
// =============================================================================

function ValidationSummary({
  onFinalize,
  isSaving,
  lastSaved,
  saveError,
  onRetry,
}: {
  onFinalize: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError?: string | null;
  onRetry?: () => void;
}) {
  const { canFinalize, isValid, errors } = useCreationBudgets();

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Finalize Character</h3>

      {/* Save status */}
      <div className="mt-2 flex items-center gap-2 text-xs">
        {saveError ? (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span>Save failed</span>
            {onRetry && (
              <button onClick={onRetry} className="font-medium underline hover:no-underline">
                Retry
              </button>
            )}
          </div>
        ) : isSaving ? (
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </div>
        ) : lastSaved ? (
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Save className="h-3 w-3" />
            Saved {lastSaved.toLocaleTimeString()}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3 w-3" />
            Not yet saved
          </div>
        )}
      </div>

      {/* Finalize button */}
      <button
        onClick={onFinalize}
        disabled={!canFinalize || isSaving}
        className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          canFinalize && !isSaving
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
        }`}
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        ) : canFinalize ? (
          "Create Character"
        ) : (
          "Complete All Sections"
        )}
      </button>

      {!isValid && errors.length > 0 && (
        <p className="mt-2 text-center text-xs text-red-600 dark:text-red-400">
          Fix {errors.length} error{errors.length !== 1 ? "s" : ""} to continue
        </p>
      )}
    </div>
  );
}

// =============================================================================
// MAIN LAYOUT
// =============================================================================

export function SheetCreationLayout({
  creationState,
  updateState,
  onFinalize,
  isSaving,
  lastSaved,
  saveError,
  onRetry,
  campaignId: _campaignId, // Used in Phase 5+
  campaign: _campaign, // Used in Phase 5+
}: SheetCreationLayoutProps) {
  // Determine what sections are available based on selections
  const magicPath = creationState.selections["magical-path"] as string | undefined;
  const isMagical = ["magician", "mystic-adept", "aspected-mage"].includes(magicPath || "");
  const isAdept = ["adept", "mystic-adept"].includes(magicPath || "");
  const isTechnomancer = magicPath === "technomancer";

  return (
    <div className="space-y-4">
      {/* Save Status Bar */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Character Draft</div>
        <div className="flex items-center gap-2 text-sm">
          {saveError ? (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>Save failed</span>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                >
                  Retry
                </button>
              )}
            </div>
          ) : isSaving ? (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Clock className="h-4 w-4" />
              <span>Not saved yet</span>
            </div>
          )}
        </div>
      </div>

      {/* Three Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Column 1: Foundation */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Foundation
          </h2>

          {/* Character Info - Phase 5 */}
          <CharacterInfoCard state={creationState} updateState={updateState} />

          {/* Priority Selection - Phase 2 */}
          <PrioritySelectionCard state={creationState} updateState={updateState} />

          {/* Metatype Selection - Phase 2 */}
          <MetatypeCard state={creationState} updateState={updateState} />

          {/* Magic Path - Phase 3 */}
          <MagicPathCard state={creationState} updateState={updateState} />

          {/* Derived Stats - Phase 6 */}
          <DerivedStatsCard state={creationState} updateState={updateState} />

          {/* Budget Summary */}
          <BudgetSummaryCard creationState={creationState} />

          {/* Finalize */}
          <ValidationSummary
            onFinalize={onFinalize}
            isSaving={isSaving}
            lastSaved={lastSaved}
            saveError={saveError}
            onRetry={onRetry}
          />
        </div>

        {/* Column 2: Stats */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Attributes & Powers
          </h2>

          {/* Attributes - Phase 2 */}
          <AttributesCard state={creationState} updateState={updateState} />

          {/* Qualities - Phase 2 */}
          <QualitiesCard state={creationState} updateState={updateState} />

          {/* Skills - Phase 2 */}
          <SkillsCard state={creationState} updateState={updateState} />

          {/* Spells - Phase 3 (conditional) */}
          {isMagical && <SpellsCard state={creationState} updateState={updateState} />}

          {/* Adept Powers - Phase 3 (conditional) */}
          {isAdept && <AdeptPowersCard state={creationState} updateState={updateState} />}

          {/* Foci - Phase 3 (conditional) */}
          {isMagical && <FociCard state={creationState} updateState={updateState} />}

          {/* Complex Forms - Phase 3 (conditional) */}
          {isTechnomancer && <ComplexFormsCard state={creationState} updateState={updateState} />}
        </div>

        {/* Column 3: Abilities & Gear */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Skills & Gear
          </h2>

          {/* Knowledge & Languages - Phase 2 */}
          <KnowledgeLanguagesCard state={creationState} updateState={updateState} />

          {/* Contacts - Phase 5 */}
          <ContactsCard state={creationState} updateState={updateState} />

          {/* Gear - Phase 4 */}
          <GearPanel state={creationState} updateState={updateState} />

          {/* Weapons - Phase 4 (New) */}
          <WeaponsPanel state={creationState} updateState={updateState} />

          {/* Armor - Phase 4 (New) */}
          <ArmorPanel state={creationState} updateState={updateState} />

          {/* Matrix Gear - Phase 4 (Commlinks & Cyberdecks) */}
          <MatrixGearCard state={creationState} updateState={updateState} />

          {/* Augmentations - Phase 4 */}
          <AugmentationsCard state={creationState} updateState={updateState} />

          {/* Vehicles & Drones - Phase 4 */}
          <VehiclesCard state={creationState} updateState={updateState} />

          {/* Identities - Phase 5 */}
          <IdentitiesCard state={creationState} updateState={updateState} />
        </div>
      </div>
    </div>
  );
}
