"use client";

/**
 * LifeModulesCard
 *
 * Main card for Life Modules character creation. Displays selected modules
 * as an ordered timeline by phase and provides a modal for adding new modules.
 * Replaces PrioritySelectionCard for the life-modules creation method.
 */

import { useMemo, useCallback, useState } from "react";
import { Plus, Route, Trash2, ArrowRightLeft } from "lucide-react";
import { CreationCard } from "../shared";
import { useLifeModules, useQualities } from "@/lib/rules/RulesetContext";
import { PHASE_ORDER, PHASE_INFO } from "./constants";
import { LifeModulesModal } from "./LifeModulesModal";
import { QualityReplacementModal } from "./QualityReplacementModal";
import { NegativeQualityBuyOffSection } from "./NegativeQualityBuyOffSection";
import type { LifeModulesCardProps, PhaseModules } from "./types";
import type { LifeModuleSelection, LifeModulesCatalog, QualityReplacement } from "@/lib/types";
import { LIFE_MODULES_KARMA_BUDGET } from "@/lib/types";
import {
  detectDuplicateQualities,
  lookupModule,
  resolveLifeModuleGrants,
  type DuplicateQualityInfo,
} from "@/lib/rules/life-modules";
import { getEffectiveNegativeQualityKarma } from "@/lib/rules/life-modules/buy-off";

/**
 * Build phase-organized module map from catalog data
 */
function buildPhaseModules(catalog: LifeModulesCatalog | null): PhaseModules {
  if (!catalog) {
    return {
      nationality: [],
      formative: [],
      teen: [],
      education: [],
      career: [],
      tour: [],
    };
  }
  return {
    nationality: catalog.nationality,
    formative: catalog.formative,
    teen: catalog.teen,
    education: catalog.education,
    career: catalog.career,
    tour: catalog.tour,
  };
}

/**
 * Find a module's display name from the catalog
 */
function findModuleName(
  catalog: LifeModulesCatalog | null,
  selection: LifeModuleSelection
): string {
  if (!catalog) return selection.moduleId;

  const phaseModules = catalog[selection.phase] || [];
  for (const mod of phaseModules) {
    if (mod.id === selection.moduleId) {
      if (selection.subModuleId && mod.subModules) {
        const sub = mod.subModules.find((s) => s.id === selection.subModuleId);
        return sub ? `${mod.name} — ${sub.name}` : mod.name;
      }
      return mod.name;
    }
  }
  return selection.moduleId;
}

export function LifeModulesCard({ state, updateState }: LifeModulesCardProps) {
  const catalog = useLifeModules();
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Duplicate quality replacement state
  const [pendingSelection, setPendingSelection] = useState<LifeModuleSelection | null>(null);
  const [pendingDuplicates, setPendingDuplicates] = useState<readonly DuplicateQualityInfo[]>([]);
  const [pendingReplacements, setPendingReplacements] = useState<QualityReplacement[]>([]);
  const [currentDuplicateIndex, setCurrentDuplicateIndex] = useState(0);

  const existingSelections: readonly LifeModuleSelection[] = useMemo(
    () => state.selections.lifeModules || [],
    [state.selections.lifeModules]
  );

  const phaseModules = useMemo(() => buildPhaseModules(catalog), [catalog]);

  const totalModuleKarma = useMemo(
    () => existingSelections.reduce((sum, s) => sum + s.karmaCost, 0),
    [existingSelections]
  );

  // Calculate character age from modules
  const calculatedAge = useMemo(() => {
    if (!catalog || existingSelections.length === 0) return null;

    let age = 0;
    for (const selection of existingSelections) {
      const phaseList = catalog[selection.phase] || [];
      for (const mod of phaseList) {
        if (mod.id === selection.moduleId) {
          if (selection.subModuleId && mod.subModules) {
            const sub = mod.subModules.find((s) => s.id === selection.subModuleId);
            age += sub?.yearsAdded ?? mod.yearsAdded ?? 0;
          } else {
            age += mod.yearsAdded ?? 0;
          }
          break;
        }
      }
    }
    return age > 0 ? age : null;
  }, [catalog, existingSelections]);

  // All quality IDs already accumulated from existing selections
  const accumulatedQualityIds = useMemo(() => {
    if (!catalog) return [];
    const ids: string[] = [];
    for (const sel of existingSelections) {
      const mod = lookupModule(sel.moduleId, sel.subModuleId, catalog);
      if (mod?.qualities) {
        for (const q of mod.qualities) {
          // If this quality was replaced, use the replacement ID
          const replacement = sel.qualityReplacements?.find((r) => r.originalQualityId === q.id);
          ids.push(replacement ? replacement.replacementQualityId : q.id);
        }
      }
    }
    return ids;
  }, [catalog, existingSelections]);

  // Resolve all grants to get quality list for buy-off section
  const resolvedGrants = useMemo(() => {
    if (!catalog || existingSelections.length === 0) return null;
    return resolveLifeModuleGrants(existingSelections, catalog);
  }, [catalog, existingSelections]);

  const boughtOffIds: readonly string[] = useMemo(
    () => state.selections.boughtOffQualityIds ?? [],
    [state.selections.boughtOffQualityIds]
  );

  const handleBuyOffChange = useCallback(
    (updatedIds: readonly string[]) => {
      // Calculate the karma cost of bought-off qualities
      const negQualityCatalog = negativeQualities;
      const breakdown = getEffectiveNegativeQualityKarma(
        resolvedGrants?.qualities ?? [],
        updatedIds,
        negQualityCatalog
      );

      updateState({
        selections: {
          ...state.selections,
          boughtOffQualityIds: updatedIds,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-quality-buyoff": breakdown.boughtOffKarma,
          "negative-quality-karma-gained": breakdown.effectiveNegativeKarma,
        },
      });
    },
    [resolvedGrants, negativeQualities, state.selections, state.budgets, updateState]
  );

  // Finalize adding a module (with any replacements already resolved)
  const finalizeAddModule = useCallback(
    (selection: LifeModuleSelection, replacements: readonly QualityReplacement[]) => {
      const finalSelection: LifeModuleSelection =
        replacements.length > 0 ? { ...selection, qualityReplacements: replacements } : selection;

      const updatedModules = [...existingSelections, finalSelection];
      updateState({
        selections: {
          ...state.selections,
          lifeModules: updatedModules,
        },
      });
    },
    [existingSelections, state.selections, updateState]
  );

  const handleAddModule = useCallback(
    (selection: LifeModuleSelection) => {
      if (!catalog) {
        finalizeAddModule(selection, []);
        return;
      }

      // Look up the module to get its quality grants
      const mod = lookupModule(selection.moduleId, selection.subModuleId, catalog);
      const moduleQualities = mod?.qualities ?? [];

      if (moduleQualities.length === 0) {
        finalizeAddModule(selection, []);
        return;
      }

      // Build accumulated qualities from all prior selections
      const accumulatedQualities = existingSelections.flatMap((sel) => {
        const m = lookupModule(sel.moduleId, sel.subModuleId, catalog);
        return m?.qualities ?? [];
      });

      const duplicates = detectDuplicateQualities(accumulatedQualities, moduleQualities);

      if (duplicates.length === 0) {
        finalizeAddModule(selection, []);
        return;
      }

      // Start the sequential replacement flow
      setPendingSelection(selection);
      setPendingDuplicates(duplicates);
      setPendingReplacements([]);
      setCurrentDuplicateIndex(0);
    },
    [catalog, existingSelections, finalizeAddModule]
  );

  // Handle a replacement choice for the current duplicate
  const handleReplacementSelect = useCallback(
    (replacementQualityId: string) => {
      if (!pendingSelection || pendingDuplicates.length === 0) return;

      const currentDup = pendingDuplicates[currentDuplicateIndex];
      const newReplacements = [
        ...pendingReplacements,
        { originalQualityId: currentDup.qualityId, replacementQualityId },
      ];

      const nextIndex = currentDuplicateIndex + 1;
      if (nextIndex < pendingDuplicates.length) {
        // More duplicates to resolve
        setPendingReplacements(newReplacements);
        setCurrentDuplicateIndex(nextIndex);
      } else {
        // All duplicates resolved — finalize
        finalizeAddModule(pendingSelection, newReplacements);
        setPendingSelection(null);
        setPendingDuplicates([]);
        setPendingReplacements([]);
        setCurrentDuplicateIndex(0);
      }
    },
    [
      pendingSelection,
      pendingDuplicates,
      currentDuplicateIndex,
      pendingReplacements,
      finalizeAddModule,
    ]
  );

  const handleReplacementCancel = useCallback(() => {
    // Cancel the entire module addition
    setPendingSelection(null);
    setPendingDuplicates([]);
    setPendingReplacements([]);
    setCurrentDuplicateIndex(0);
  }, []);

  const handleRemoveModule = useCallback(
    (index: number) => {
      const updatedModules = existingSelections.filter((_, i) => i !== index);

      // Recalculate which bought-off IDs are still valid after module removal
      const remainingQualityIds = new Set<string>();
      if (catalog) {
        for (const sel of updatedModules) {
          const mod = lookupModule(sel.moduleId, sel.subModuleId, catalog);
          if (mod?.qualities) {
            for (const q of mod.qualities) {
              if (q.type === "negative") remainingQualityIds.add(q.id);
            }
          }
        }
      }
      const updatedBuyOffs = boughtOffIds.filter((id) => remainingQualityIds.has(id));

      updateState({
        selections: {
          ...state.selections,
          lifeModules: updatedModules,
          boughtOffQualityIds: updatedBuyOffs.length > 0 ? updatedBuyOffs : undefined,
        },
      });
    },
    [existingSelections, state.selections, updateState, catalog, boughtOffIds]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (existingSelections.length === 0) return "pending" as const;
    if (totalModuleKarma > LIFE_MODULES_KARMA_BUDGET) return "error" as const;
    // Check required phases
    const hasNationality = existingSelections.some((s) => s.phase === "nationality");
    const hasFormative = existingSelections.some((s) => s.phase === "formative");
    const hasTeen = existingSelections.some((s) => s.phase === "teen");
    if (!hasNationality || !hasFormative || !hasTeen) return "warning" as const;
    return "valid" as const;
  }, [existingSelections, totalModuleKarma]);

  // Group selections by phase for display
  const selectionsByPhase = useMemo(() => {
    const grouped: Record<string, { selection: LifeModuleSelection; index: number }[]> = {};
    for (const phase of PHASE_ORDER) {
      grouped[phase] = [];
    }
    existingSelections.forEach((s, i) => {
      if (grouped[s.phase]) {
        grouped[s.phase].push({ selection: s, index: i });
      }
    });
    return grouped;
  }, [existingSelections]);

  return (
    <>
      <CreationCard
        id="life-modules-selection"
        title="Life Path Modules"
        description="Select modules for each phase of your character's life"
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        }
      >
        <div className="space-y-2">
          {existingSelections.length === 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No modules selected. Add modules to build your character&apos;s life path.
              </p>
              {/* Phase checklist */}
              <div className="space-y-1">
                {PHASE_ORDER.map((phase) => {
                  const info = PHASE_INFO[phase];
                  return (
                    <div
                      key={phase}
                      className="flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <span>
                        {info.label}
                        {info.required ? "" : " (optional)"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Timeline display */}
              {PHASE_ORDER.map((phase) => {
                const items = selectionsByPhase[phase] || [];
                if (items.length === 0) return null;

                const info = PHASE_INFO[phase];

                return (
                  <div key={phase}>
                    <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {info.label}
                    </h4>
                    {items.map(({ selection, index }) => (
                      <div key={index}>
                        <div className="flex items-center justify-between rounded px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <div className="flex items-center gap-2 min-w-0">
                            <Route className="h-3 w-3 flex-shrink-0 text-rose-500" />
                            <span className="truncate text-xs text-zinc-700 dark:text-zinc-300">
                              {findModuleName(catalog, selection)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] font-mono text-zinc-400">
                              {selection.karmaCost}K
                            </span>
                            <button
                              onClick={() => handleRemoveModule(index)}
                              className="rounded p-0.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                              title="Remove module"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        {/* Show quality replacements if any */}
                        {selection.qualityReplacements &&
                          selection.qualityReplacements.length > 0 && (
                            <div className="ml-7 space-y-0.5 pb-1">
                              {selection.qualityReplacements.map((r) => (
                                <div
                                  key={r.originalQualityId}
                                  className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400"
                                >
                                  <ArrowRightLeft className="h-2.5 w-2.5" />
                                  <span>
                                    {r.originalQualityId} → {r.replacementQualityId}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Summary */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <span>
                    {existingSelections.length} module
                    {existingSelections.length !== 1 ? "s" : ""}
                  </span>
                  {calculatedAge && <span>· Age {calculatedAge}</span>}
                </div>
                <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                  {totalModuleKarma} Karma
                </span>
              </div>

              {/* Negative quality buy-off section */}
              {resolvedGrants && resolvedGrants.qualities.length > 0 && (
                <NegativeQualityBuyOffSection
                  grantedQualities={resolvedGrants.qualities}
                  boughtOffIds={boughtOffIds}
                  qualityCatalog={negativeQualities}
                  onBuyOffChange={handleBuyOffChange}
                />
              )}

              {/* Missing required phases warning */}
              {validationStatus === "warning" && (
                <div className="rounded-md bg-amber-50 px-2 py-1.5 text-[10px] text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  Required phases:{" "}
                  {!existingSelections.some((s) => s.phase === "nationality") && "Nationality "}
                  {!existingSelections.some((s) => s.phase === "formative") && "Formative Years "}
                  {!existingSelections.some((s) => s.phase === "teen") && "Teen Years "}
                </div>
              )}
            </>
          )}
        </div>
      </CreationCard>

      <LifeModulesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(selection) => {
          handleAddModule(selection);
          setIsModalOpen(false);
        }}
        modules={phaseModules}
        existingSelections={existingSelections}
      />

      {/* Quality replacement modal — shown when a module grants a duplicate quality */}
      {pendingDuplicates.length > 0 && currentDuplicateIndex < pendingDuplicates.length && (
        <QualityReplacementModal
          isOpen={true}
          onClose={handleReplacementCancel}
          onSelect={handleReplacementSelect}
          duplicateQualityId={pendingDuplicates[currentDuplicateIndex].qualityId}
          duplicateQualityType={pendingDuplicates[currentDuplicateIndex].type}
          availableQualities={[...positiveQualities, ...negativeQualities]}
          alreadySelectedIds={accumulatedQualityIds}
        />
      )}
    </>
  );
}
