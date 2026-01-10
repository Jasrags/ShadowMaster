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
import type { CreationState, Campaign } from "@/lib/types";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Clock,
  Save,
} from "lucide-react";

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
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
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
  if (budget.remaining === 0 && budget.total > 0) return "bg-emerald-500";
  return "bg-blue-500";
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

  // Extract conversion/overflow values from creation state for contextual notes
  const karmaSpentGear = (creationState.budgets?.["karma-spent-gear"] as number) || 0;
  const karmaSpentContacts = (creationState.budgets?.["karma-spent-contacts"] as number) || 0;

  const budgetList = useMemo(
    () =>
      Object.entries(budgets)
        // Hide budgets with 0 total that aren't relevant for this character
        .filter(([id, budget]) => {
          // Always hide special-attribute-points and skill-group-points if total is 0
          if (id === "special-attribute-points" && budget.total === 0) return false;
          if (id === "skill-group-points" && budget.total === 0) return false;
          return true;
        })
        .map(([id, budget]) => ({
          id,
          ...budget,
        })),
    [budgets]
  );

  // Generate contextual notes for each budget
  const getNote = (budgetId: string): { text: string; style: "info" | "warning" | "error" } | null => {
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
          return { text: `${karmaSpentGear} converted to ${(karmaSpentGear * 2000).toLocaleString()}¥`, style: "info" };
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
            text: `+${karmaSpentContacts} from general karma`,
            style: "info",
          };
        }
        return null;

      default:
        return null;
    }
  };

  const formatValue = (value: number, format?: string) => {
    if (format === "currency") {
      return `${value.toLocaleString()}¥`;
    }
    return value.toString();
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
          Budget Summary
        </h3>
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
            const percentSpent = budget.total > 0
              ? Math.min(100, Math.max(0, (budget.spent / budget.total) * 100))
              : 0;
            const note = getNote(budget.id);
            const hasOverflow = budget.spent > budget.total;

            return (
              <div key={budget.id}>
                {/* Label and values: "X spent • Y left" */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {budget.label}
                  </span>
                  <span className={`font-mono font-medium ${textColor}`}>
                    {formatValue(budget.spent, budget.displayFormat)} spent
                    <span className="font-sans text-zinc-400"> • </span>
                    {formatValue(Math.max(0, budget.remaining), budget.displayFormat)} left
                    {hasOverflow && (
                      <span className="text-red-500">
                        {" "}(+{formatValue(budget.spent - budget.total, budget.displayFormat)})
                      </span>
                    )}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
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
                        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
                      }}
                    />
                  )}
                </div>

                {/* Contextual note */}
                {note && (
                  <div className={`mt-0.5 text-xs ${
                    note.style === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : note.style === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`}>
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
}: {
  onFinalize: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
}) {
  const { canFinalize, isValid, errors } = useCreationBudgets();

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
        Finalize Character
      </h3>

      {/* Save status */}
      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        {isSaving ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </>
        ) : lastSaved ? (
          <>
            <Save className="h-3 w-3" />
            Saved {lastSaved.toLocaleTimeString()}
          </>
        ) : (
          <>
            <Clock className="h-3 w-3" />
            Not yet saved
          </>
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
  campaignId: _campaignId, // Used in Phase 5+
  campaign: _campaign, // Used in Phase 5+
}: SheetCreationLayoutProps) {
  // Determine what sections are available based on selections
  const magicPath = creationState.selections["magical-path"] as string | undefined;
  const isMagical = ["magician", "mystic-adept", "aspected-mage"].includes(magicPath || "");
  const isAdept = ["adept", "mystic-adept"].includes(magicPath || "");
  const isTechnomancer = magicPath === "technomancer";

  return (
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

        {/* Budget Summary */}
        <BudgetSummaryCard creationState={creationState} />

        {/* Derived Stats - Phase 6 */}
        <DerivedStatsCard state={creationState} updateState={updateState} />

        {/* Finalize */}
        <ValidationSummary
          onFinalize={onFinalize}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      </div>

      {/* Column 2: Stats */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Attributes & Powers
        </h2>

        {/* Attributes - Phase 2 */}
        <AttributesCard state={creationState} updateState={updateState} />

        {/* Skills - Phase 2 */}
        <SkillsCard state={creationState} updateState={updateState} />

        {/* Qualities - Phase 2 */}
        <QualitiesCard state={creationState} updateState={updateState} />

        {/* Spells - Phase 3 (conditional) */}
        {isMagical && (
          <SpellsCard state={creationState} updateState={updateState} />
        )}

        {/* Adept Powers - Phase 3 (conditional) */}
        {isAdept && (
          <AdeptPowersCard state={creationState} updateState={updateState} />
        )}

        {/* Foci - Phase 3 (conditional) */}
        {isMagical && (
          <FociCard state={creationState} updateState={updateState} />
        )}

        {/* Complex Forms - Phase 3 (conditional) */}
        {isTechnomancer && (
          <ComplexFormsCard state={creationState} updateState={updateState} />
        )}
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

        {/* Augmentations - Phase 4 */}
        <AugmentationsCard state={creationState} updateState={updateState} />

        {/* Vehicles & Drones - Phase 4 */}
        <VehiclesCard state={creationState} updateState={updateState} />

        {/* Identities - Phase 5 */}
        <IdentitiesCard state={creationState} updateState={updateState} />
      </div>
    </div>
  );
}
