"use client";

/**
 * ComplexFormsCard
 *
 * Compact card for complex form selection in sheet-driven creation.
 * For technomancers only.
 *
 * Features:
 * - Complex form list with search
 * - Free forms from priority
 * - Karma cost for additional forms
 * - Living Persona summary
 * - Fading value display
 */

import { useMemo, useCallback, useState } from "react";
import { useComplexForms, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Check, Search, X, Cpu } from "lucide-react";

const COMPLEX_FORM_KARMA_COST = 4;

interface ComplexFormsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function ComplexFormsCard({ state, updateState }: ComplexFormsCardProps) {
  const complexFormsCatalog = useComplexForms();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [searchQuery, setSearchQuery] = useState("");

  // Check if technomancer
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const isTechnomancer = magicalPath === "technomancer";

  // Get resonance priority and free forms count
  const { freeForms, resonanceRating } = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return { freeForms: 0, resonanceRating: 0 };
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        complexForms?: number;
        resonanceRating?: number;
      }>;
    };

    const option = magicData?.options?.find((o) => o.path === "technomancer");
    return {
      freeForms: option?.complexForms || 0,
      resonanceRating: option?.resonanceRating || 0,
    };
  }, [state.priorities?.magic, priorityTable]);

  // Get current selections
  const selectedForms = useMemo(
    () => (state.selections.complexForms || []) as string[],
    [state.selections.complexForms]
  );

  // Get karma tracking
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Filter forms
  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) return complexFormsCatalog;
    const search = searchQuery.toLowerCase();
    return complexFormsCatalog.filter(
      (f) =>
        f.name.toLowerCase().includes(search) ||
        f.description?.toLowerCase().includes(search)
    );
  }, [complexFormsCatalog, searchQuery]);

  // Toggle form selection
  const toggleForm = useCallback(
    (formId: string) => {
      const isSelected = selectedForms.includes(formId);
      let newForms: string[];

      if (isSelected) {
        newForms = selectedForms.filter((id) => id !== formId);
      } else {
        // Check cost
        const willBeFree = selectedForms.length < freeForms;
        if (!willBeFree && karmaRemaining < COMPLEX_FORM_KARMA_COST) return;

        newForms = [...selectedForms, formId];
      }

      // Calculate new karma cost
      const formsBeyondFree = Math.max(0, newForms.length - freeForms);
      const newKarmaSpent = formsBeyondFree * COMPLEX_FORM_KARMA_COST;

      updateState({
        selections: {
          ...state.selections,
          complexForms: newForms,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-complex-forms": newKarmaSpent,
        },
      });
    },
    [selectedForms, freeForms, karmaRemaining, state.selections, state.budgets, updateState]
  );

  // Remove form
  const removeForm = useCallback(
    (formId: string) => {
      const newForms = selectedForms.filter((id) => id !== formId);
      const formsBeyondFree = Math.max(0, newForms.length - freeForms);
      const newKarmaSpent = formsBeyondFree * COMPLEX_FORM_KARMA_COST;

      updateState({
        selections: {
          ...state.selections,
          complexForms: newForms,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-complex-forms": newKarmaSpent,
        },
      });
    },
    [selectedForms, freeForms, state.selections, state.budgets, updateState]
  );

  const formsBeyondFree = Math.max(0, selectedForms.length - freeForms);
  const karmaSpentOnForms = formsBeyondFree * COMPLEX_FORM_KARMA_COST;

  // Living Persona (calculated from mental attributes)
  const attributes = useMemo(
    () => (state.selections.attributes || {}) as Record<string, number>,
    [state.selections.attributes]
  );

  const livingPersona = useMemo(() => {
    const charisma = attributes.charisma || 1;
    const intuition = attributes.intuition || 1;
    const logic = attributes.logic || 1;
    const willpower = attributes.willpower || 1;

    return {
      attack: charisma,
      sleaze: intuition,
      dataProcessing: logic,
      firewall: willpower,
      deviceRating: resonanceRating,
    };
  }, [attributes, resonanceRating]);

  // Validation status
  const validationStatus = useMemo(() => {
    if (!isTechnomancer) return "pending";
    if (selectedForms.length > 0) return "valid";
    if (freeForms > 0) return "warning";
    return "pending";
  }, [isTechnomancer, selectedForms.length, freeForms]);

  // Check if technomancer
  if (!isTechnomancer) {
    return (
      <CreationCard title="Complex Forms" description="Technomancer only" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select Technomancer path first
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Complex Forms"
      description={`${selectedForms.length}/${freeForms} free forms${formsBeyondFree > 0 ? ` (+${formsBeyondFree} karma)` : ""}`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicators */}
        <div className="grid gap-2 sm:grid-cols-2">
          <BudgetIndicator
            label="Free Forms"
            spent={Math.min(selectedForms.length, freeForms)}
            total={freeForms}
            compact
          />
          {formsBeyondFree > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-zinc-500">Karma spent:</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {karmaSpentOnForms}
              </span>
            </div>
          )}
        </div>

        {/* Living Persona summary */}
        <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-900/20">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-700 dark:text-cyan-300">
            <Cpu className="h-3 w-3" />
            Living Persona (RES {resonanceRating})
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="font-bold text-cyan-900 dark:text-cyan-100">
                {livingPersona.attack}
              </div>
              <div className="text-cyan-600 dark:text-cyan-400">ATK</div>
            </div>
            <div>
              <div className="font-bold text-cyan-900 dark:text-cyan-100">
                {livingPersona.sleaze}
              </div>
              <div className="text-cyan-600 dark:text-cyan-400">SLZ</div>
            </div>
            <div>
              <div className="font-bold text-cyan-900 dark:text-cyan-100">
                {livingPersona.dataProcessing}
              </div>
              <div className="text-cyan-600 dark:text-cyan-400">DP</div>
            </div>
            <div>
              <div className="font-bold text-cyan-900 dark:text-cyan-100">
                {livingPersona.firewall}
              </div>
              <div className="text-cyan-600 dark:text-cyan-400">FW</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search complex forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Form list */}
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {filteredForms.map((form) => {
            const isSelected = selectedForms.includes(form.id);
            const willBeFree = selectedForms.length < freeForms;
            const canSelect =
              isSelected || willBeFree || karmaRemaining >= COMPLEX_FORM_KARMA_COST;

            return (
              <button
                key={form.id}
                onClick={() => canSelect && toggleForm(form.id)}
                disabled={!canSelect}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                  isSelected
                    ? "bg-cyan-50 ring-1 ring-cyan-300 dark:bg-cyan-900/30 dark:ring-cyan-700"
                    : canSelect
                    ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                    : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">
                      {form.name}
                    </span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>Target: {form.target}</span>
                      <span>•</span>
                      <span>{form.duration}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {form.fading}
                </span>
              </button>
            );
          })}

          {filteredForms.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No complex forms found
            </div>
          )}
        </div>

        {/* Selected forms summary */}
        {selectedForms.length > 0 && (
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Selected Forms ({selectedForms.length})
            </h4>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedForms.map((id) => {
                const form = complexFormsCatalog.find((f) => f.id === id);
                return form ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                  >
                    {form.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeForm(id);
                      }}
                      className="hover:text-cyan-900 dark:hover:text-cyan-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
