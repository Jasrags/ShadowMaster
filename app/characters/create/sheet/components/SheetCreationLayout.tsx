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
  BookOpen,
} from "lucide-react";
import { useCreationMethod } from "@/lib/rules/RulesetContext";
import { BudgetSummaryCard } from "./BudgetSummaryCard";

// Phase 2, 3, 4, 5 & 6 Components - Static imports for always-visible cards
import {
  PrioritySelectionCard,
  PointBuyBudgetCard,
  LifeModulesBudgetCard,
  LifeModulesCard,
  MetatypeCard,
  AttributesCard,
  SkillsCard,
  KnowledgeLanguagesCard,
  QualitiesCard,
  MagicPathCard,
  GearPanel,
  WeaponsPanel,
  ArmorPanel,
  DrugsPanel,
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

interface ServerValidationResult {
  errors: Array<{
    code: string;
    message: string;
    field?: string;
    severity: string;
    suggestion?: string;
  }>;
  warnings: Array<{
    code: string;
    message: string;
    field?: string;
    severity: string;
    suggestion?: string;
  }>;
}

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
  serverValidation?: ServerValidationResult | null;
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
  serverValidation,
  creationState,
}: {
  onFinalize: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  saveError?: string | null;
  onRetry?: () => void;
  serverValidation?: ServerValidationResult | null;
  creationState: CreationState;
}) {
  const { canFinalize, isValid, errors } = useCreationBudgets();

  const hasServerErrors = serverValidation && serverValidation.errors.length > 0;
  const hasServerWarnings = serverValidation && serverValidation.warnings.length > 0;

  // Compute incomplete requirements matching server-side finalization validators
  const currentCreationMethod = useCreationMethod();
  const methodType = currentCreationMethod?.type;

  const incompleteItems = useMemo(() => {
    const items: string[] = [];
    const priorities = creationState.priorities || {};
    const selections = creationState.selections || {};

    // Priority requirements depend on creation method type
    const usesPriorities = methodType === "priority" || methodType === "sum-to-ten";
    const isPointBuy = methodType === "point-buy";
    const isLifeModules = methodType === "life-modules";
    const isSumToTen = methodType === "sum-to-ten";

    if (usesPriorities) {
      if (Object.keys(priorities).length < 5) {
        if (isSumToTen) {
          items.push("Set all 5 priorities (sum to 10)");
        } else {
          items.push("Set all 5 priorities");
        }
      }
    }

    if (!selections.metatype) items.push("Select a metatype");

    // Magic path check: priority/sum-to-ten checks priority level, others always show
    if (!selections["magical-path"]) {
      if (usesPriorities) {
        if (priorities?.magic !== "E") {
          items.push("Select a magic/resonance path");
        }
      } else if (isLifeModules) {
        // Life Modules: magic path selection is optional (mundane is valid)
        // but show reminder if they haven't chosen
        items.push("Select a magic/resonance path");
      }
      // Point Buy: magic path is optional (mundane is valid default)
    }

    // Life Modules: require at least one module
    if (isLifeModules) {
      const lifeModules = selections.lifeModules;
      if (!Array.isArray(lifeModules) || lifeModules.length === 0) {
        items.push("Add at least one life module");
      }
    }

    // Tradition required for magician, mystic-adept, aspected-mage
    const TRADITION_PATHS = ["magician", "mystic-adept", "aspected-mage"];
    const magicPathSel = selections["magical-path"] as string | undefined;
    if (magicPathSel && TRADITION_PATHS.includes(magicPathSel) && !selections["tradition"])
      items.push("Select a tradition");

    if (!selections.identities || selections.identities.length === 0)
      items.push("Add at least one identity (SIN)");
    if (!selections.lifestyles || selections.lifestyles.length === 0)
      items.push("Add at least one lifestyle");

    return items;
  }, [creationState.priorities, creationState.selections, methodType]);

  return (
    <div>
      {/* Completion checklist */}
      {incompleteItems.length > 0 && (
        <div className="border-b border-blue-200 bg-blue-50 px-4 py-2.5 dark:border-blue-900/50 dark:bg-blue-950/30 sm:px-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-xs text-blue-800 dark:text-blue-200">
              {incompleteItems.map((item) => (
                <span key={item} className="flex items-center gap-1">
                  <span className="text-blue-400 dark:text-blue-500">&bull;</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Server validation errors panel */}
      {hasServerErrors && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30 sm:px-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Cannot finalize character
              </p>
              <ul className="mt-1 space-y-1">
                {serverValidation.errors.map((err, i) => (
                  <li key={i} className="text-xs text-red-700 dark:text-red-300">
                    {err.message}
                    {err.suggestion && (
                      <span className="ml-1 text-red-600 dark:text-red-400">
                        — {err.suggestion}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Server validation warnings panel */}
      {hasServerWarnings && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30 sm:px-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="min-w-0">
              <ul className="space-y-1">
                {serverValidation.warnings.map((warn, i) => (
                  <li key={i} className="text-xs text-amber-700 dark:text-amber-300">
                    {warn.message}
                    {warn.suggestion && (
                      <span className="ml-1 text-amber-600 dark:text-amber-400">
                        — {warn.suggestion}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Existing status bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: status info */}
        <div className="flex items-center gap-4 text-xs">
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

          {!isValid && errors.length > 0 && (
            <span className="text-red-600 dark:text-red-400">
              Fix {errors.length} error{errors.length !== 1 ? "s" : ""} to continue
            </span>
          )}
        </div>

        {/* Right: finalize button */}
        <button
          onClick={onFinalize}
          disabled={!canFinalize || isSaving}
          className={`shrink-0 rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
            canFinalize && !isSaving
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : canFinalize ? (
            "Create Character"
          ) : (
            "Complete All Sections"
          )}
        </button>
      </div>
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
  campaignId: _campaignId,
  campaign,
  serverValidation,
}: SheetCreationLayoutProps) {
  const currentCreationMethod = useCreationMethod();

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

      {/* Active Campaign Banner */}
      {campaign && (
        <div className="rounded-md bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">{campaign.title}</span>
            <span className="text-blue-600 dark:text-blue-400">
              — {campaign.enabledBookIds.length} book
              {campaign.enabledBookIds.length !== 1 ? "s" : ""} active
              {currentCreationMethod && <> · {currentCreationMethod.name}</>}
            </span>
          </div>
        </div>
      )}

      {/* Three Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Column 1: Foundation */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Foundation
          </h2>

          {/* Character Info - Phase 5 */}
          <CharacterInfoCard state={creationState} updateState={updateState} />

          {/* Priority Selection / Point Buy Budget / Life Modules Budget */}
          {currentCreationMethod?.type === "point-buy" ? (
            <PointBuyBudgetCard state={creationState} />
          ) : currentCreationMethod?.type === "life-modules" ? (
            <LifeModulesBudgetCard state={creationState} />
          ) : (
            <PrioritySelectionCard state={creationState} updateState={updateState} />
          )}

          {/* Life Modules Selection (life-modules only) */}
          {currentCreationMethod?.type === "life-modules" && (
            <LifeModulesCard state={creationState} updateState={updateState} />
          )}

          {/* Metatype Selection - Phase 2 */}
          <MetatypeCard state={creationState} updateState={updateState} />

          {/* Magic Path - Phase 3 */}
          <MagicPathCard state={creationState} updateState={updateState} />

          {/* Derived Stats - Phase 6 */}
          <DerivedStatsCard state={creationState} updateState={updateState} />

          {/* Budget Summary */}
          <BudgetSummaryCard creationState={creationState} />
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

          {/* Drugs & Toxins - Phase 4 */}
          <DrugsPanel state={creationState} updateState={updateState} />

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

      {/* Sticky Finalize Footer */}
      <div className="sticky bottom-0 z-10 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
        <ValidationSummary
          onFinalize={onFinalize}
          isSaving={isSaving}
          lastSaved={lastSaved}
          saveError={saveError}
          onRetry={onRetry}
          serverValidation={serverValidation}
          creationState={creationState}
        />
      </div>
    </div>
  );
}
