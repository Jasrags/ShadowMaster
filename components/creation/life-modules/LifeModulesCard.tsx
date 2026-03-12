"use client";

/**
 * LifeModulesCard
 *
 * Main card for Life Modules character creation. Displays selected modules
 * as an ordered timeline by phase and provides a modal for adding new modules.
 * Replaces PrioritySelectionCard for the life-modules creation method.
 */

import { useMemo, useCallback, useState } from "react";
import { Plus, Route, Trash2 } from "lucide-react";
import { CreationCard } from "../shared";
import { useLifeModules } from "@/lib/rules/RulesetContext";
import { PHASE_ORDER, PHASE_INFO } from "./constants";
import { LifeModulesModal } from "./LifeModulesModal";
import type { LifeModulesCardProps, PhaseModules } from "./types";
import type { LifeModuleSelection, LifeModulesCatalog } from "@/lib/types";
import { LIFE_MODULES_KARMA_BUDGET } from "@/lib/types";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddModule = useCallback(
    (selection: LifeModuleSelection) => {
      const updatedModules = [...existingSelections, selection];

      updateState({
        selections: {
          ...state.selections,
          lifeModules: updatedModules,
        },
      });
    },
    [existingSelections, state.selections, updateState]
  );

  const handleRemoveModule = useCallback(
    (index: number) => {
      const updatedModules = existingSelections.filter((_, i) => i !== index);

      updateState({
        selections: {
          ...state.selections,
          lifeModules: updatedModules,
        },
      });
    },
    [existingSelections, state.selections, updateState]
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
                      <div
                        key={index}
                        className="flex items-center justify-between rounded px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      >
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
    </>
  );
}
