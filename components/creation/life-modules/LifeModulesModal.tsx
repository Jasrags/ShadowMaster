"use client";

/**
 * LifeModulesModal
 *
 * Modal for browsing and selecting life modules during character creation.
 * Two-panel layout: left panel has phase tabs and module list,
 * right panel shows detail for the highlighted module.
 */

import { useState, useMemo, useCallback } from "react";
import { Search, X, ChevronRight, Check } from "lucide-react";
import type { LifeModule, LifeModulePhase, LifeModuleSelection } from "@/lib/types";
import { PHASE_ORDER, PHASE_INFO } from "./constants";
import { LifeModuleDetailPanel } from "./LifeModuleDetailPanel";
import type { PhaseModules } from "./types";

interface LifeModulesModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSelect: (selection: LifeModuleSelection) => void;
  readonly modules: PhaseModules;
  readonly existingSelections: readonly LifeModuleSelection[];
}

export function LifeModulesModal({
  isOpen,
  onClose,
  onSelect,
  modules,
  existingSelections,
}: LifeModulesModalProps) {
  const [activePhase, setActivePhase] = useState<LifeModulePhase>("nationality");
  const [highlightedModule, setHighlightedModule] = useState<LifeModule | null>(null);
  const [selectedSubModule, setSelectedSubModule] = useState<LifeModule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get modules for active phase, filtered by search
  const filteredModules = useMemo(() => {
    const phaseModules = modules[activePhase] || [];
    if (!searchQuery.trim()) return phaseModules;

    const query = searchQuery.toLowerCase();
    return phaseModules.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query) ||
        m.subModules?.some((sub) => sub.name.toLowerCase().includes(query))
    );
  }, [modules, activePhase, searchQuery]);

  // Check if a module is already selected in a phase
  const isModuleSelected = useCallback(
    (moduleId: string): boolean => {
      return existingSelections.some((s) => s.moduleId === moduleId);
    },
    [existingSelections]
  );

  // Check if a phase already has a selection (for single-select phases)
  const phaseHasSelection = useCallback(
    (phase: LifeModulePhase): boolean => {
      return existingSelections.some((s) => s.phase === phase);
    },
    [existingSelections]
  );

  // Get selection count per phase
  const phaseSelectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const phase of PHASE_ORDER) {
      counts[phase] = existingSelections.filter((s) => s.phase === phase).length;
    }
    return counts;
  }, [existingSelections]);

  const handleConfirm = useCallback(() => {
    if (!highlightedModule) return;

    const requiresSub =
      highlightedModule.requiresSubModuleSelection && highlightedModule.subModules?.length;
    if (requiresSub && !selectedSubModule) return;

    const selection: LifeModuleSelection = {
      moduleId: highlightedModule.id,
      subModuleId: selectedSubModule?.id,
      phase: highlightedModule.phase,
      karmaCost: selectedSubModule?.karmaCost ?? highlightedModule.karmaCost,
    };

    onSelect(selection);
    setHighlightedModule(null);
    setSelectedSubModule(null);
  }, [highlightedModule, selectedSubModule, onSelect]);

  const handlePhaseChange = useCallback((phase: LifeModulePhase) => {
    setActivePhase(phase);
    setHighlightedModule(null);
    setSelectedSubModule(null);
    setSearchQuery("");
  }, []);

  if (!isOpen) return null;

  const canConfirm =
    highlightedModule &&
    !isModuleSelected(highlightedModule.id) &&
    (!highlightedModule.requiresSubModuleSelection ||
      !highlightedModule.subModules?.length ||
      selectedSubModule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Select Life Module
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body: two-panel layout */}
        <div className="flex min-h-0 flex-1">
          {/* Left panel: phase tabs + module list */}
          <div className="flex w-1/2 flex-col border-r border-zinc-200 dark:border-zinc-700">
            {/* Phase tabs */}
            <div className="flex gap-0.5 overflow-x-auto border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-700">
              {PHASE_ORDER.map((phase) => {
                const info = PHASE_INFO[phase];
                const count = phaseSelectionCounts[phase] || 0;
                const isActive = activePhase === phase;

                return (
                  <button
                    key={phase}
                    onClick={() => handlePhaseChange(phase)}
                    className={`flex-shrink-0 rounded px-2 py-1 text-[10px] font-medium transition-colors ${
                      isActive
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {info.label}
                    {count > 0 && (
                      <span className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded bg-zinc-100 py-1 pl-7 pr-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Module list */}
            <div className="flex-1 overflow-y-auto">
              {filteredModules.length === 0 ? (
                <p className="p-4 text-center text-xs text-zinc-400">
                  {searchQuery ? "No modules match your search." : "No modules available."}
                </p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredModules.map((module) => {
                    const isSelected = isModuleSelected(module.id);
                    const isHighlighted = highlightedModule?.id === module.id;

                    return (
                      <button
                        key={module.id}
                        onClick={() => {
                          setHighlightedModule(module);
                          setSelectedSubModule(null);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors ${
                          isHighlighted
                            ? "bg-rose-50 dark:bg-rose-900/20"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        } ${isSelected ? "opacity-50" : ""}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <Check className="h-3 w-3 flex-shrink-0 text-emerald-500" />
                            )}
                            <span className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                              {module.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            {module.karmaCost} Karma
                            {module.yearsAdded ? ` · +${module.yearsAdded}yr` : ""}
                            {module.subModules?.length
                              ? ` · ${module.subModules.length} specializations`
                              : ""}
                          </span>
                        </div>
                        <ChevronRight className="h-3 w-3 flex-shrink-0 text-zinc-400" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: detail + sub-modules */}
          <div className="flex w-1/2 flex-col">
            {highlightedModule ? (
              <div className="flex-1 overflow-y-auto p-4">
                <LifeModuleDetailPanel
                  module={highlightedModule}
                  subModule={selectedSubModule ?? undefined}
                />

                {/* Sub-module selection */}
                {highlightedModule.subModules && highlightedModule.subModules.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {highlightedModule.requiresSubModuleSelection
                        ? "Choose Specialization (required)"
                        : "Specializations"}
                    </h4>
                    <div className="space-y-1">
                      {highlightedModule.subModules.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() =>
                            setSelectedSubModule(selectedSubModule?.id === sub.id ? null : sub)
                          }
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors ${
                            selectedSubModule?.id === sub.id
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className="text-[10px] text-zinc-400">
                            {sub.karmaCost !== highlightedModule.karmaCost
                              ? `${sub.karmaCost}K`
                              : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-xs text-zinc-400">
                  Select a module to see its details and grants.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <p className="text-[10px] text-zinc-400">
            {PHASE_INFO[activePhase].description}
            {!PHASE_INFO[activePhase].required && " (optional)"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
