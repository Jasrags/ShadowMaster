"use client";

import { useMemo, useState, useCallback } from "react";
import { useComplexForms, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { ComplexFormData } from "@/lib/rules";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

const SPELL_KARMA_COST = 5;
const COMPLEX_FORM_KARMA_COST = 4;
const MAX_KARMA_CARRYOVER = 7;



export function KarmaStep({ state, updateState, budgetValues }: StepProps) {
  const complexFormsCatalog = useComplexForms();
  const priorityTable = usePriorityTable();

  const [complexFormSearch, setComplexFormSearch] = useState("");

  // Get selected magical path
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const isMagician = magicalPath === "magician" || magicalPath === "mystic-adept" || magicalPath === "aspected-mage";
  const isTechnomancer = magicalPath === "technomancer";

  // Get magic/resonance priority and free spell/complex form count from priority table
  const { freeSpells, freeComplexForms, magicRating, resonanceRating } = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return { freeSpells: 0, freeComplexForms: 0, magicRating: 0, resonanceRating: 0 };
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        spells?: number;
        complexForms?: number;
        magicRating?: number;
        resonanceRating?: number;
      }>;
    };

    const option = magicData?.options?.find((o) => o.path === magicalPath);
    return {
      freeSpells: option?.spells || 0,
      freeComplexForms: option?.complexForms || 0,
      magicRating: option?.magicRating || 0,
      resonanceRating: option?.resonanceRating || 0,
    };
  }, [state.priorities?.magic, priorityTable, magicalPath]);

  // Get Logic attribute for max complex forms calculation
  const logic = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    return (attrs.logic || 0) + 1; // +1 for metatype minimum
  }, [state.selections.attributes]);

  // Max spells = Magic × 2, max complex forms = Resonance (or Logic as fallback)
  const maxTotalSpells = magicRating * 2;
  const maxTotalComplexForms = resonanceRating > 0 ? resonanceRating : logic;

  // Get current selections
  const selectedSpells = (state.selections.spells || []) as string[];
  const selectedComplexForms = useMemo(() => (state.selections.complexForms || []) as string[], [state.selections.complexForms]);

  // Calculate Karma values
  const karmaBase = budgetValues["karma"] || 25;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaSpentGear = (state.budgets["karma-spent-gear"] as number) || 0;
  const karmaSpentContacts = (state.budgets["karma-spent-contacts"] as number) || 0;

  // Calculate spells/complex forms purchased with Karma (beyond free ones)
  const spellsBeyondFree = Math.max(0, selectedSpells.length - freeSpells);
  const complexFormsBeyondFree = Math.max(0, selectedComplexForms.length - freeComplexForms);
  const karmaSpentOnSpells = spellsBeyondFree * SPELL_KARMA_COST;
  const karmaSpentOnComplexForms = complexFormsBeyondFree * COMPLEX_FORM_KARMA_COST;

  const karmaTotal = karmaBase + karmaGainedNegative;
  const karmaSpent = karmaSpentPositive + karmaSpentGear + karmaSpentOnSpells + karmaSpentOnComplexForms + karmaSpentContacts;
  const karmaRemaining = karmaTotal - karmaSpent;





  // Filter complex forms
  const filteredComplexForms = useMemo(() => {
    if (!complexFormsCatalog) return [];

    if (!complexFormSearch.trim()) return complexFormsCatalog;

    const search = complexFormSearch.toLowerCase();
    return complexFormsCatalog.filter(
      (cf) =>
        cf.name.toLowerCase().includes(search) ||
        cf.description?.toLowerCase().includes(search)
    );
  }, [complexFormsCatalog, complexFormSearch]);



  // Handle complex form selection
  const toggleComplexForm = useCallback(
    (formId: string) => {
      const isSelected = selectedComplexForms.includes(formId);
      let newForms: string[];

      if (isSelected) {
        newForms = selectedComplexForms.filter((id) => id !== formId);
      } else {
        // Check if can add more complex forms
        if (selectedComplexForms.length >= maxTotalComplexForms) return;
        // Check if have Karma for it (if beyond free forms)
        if (selectedComplexForms.length >= freeComplexForms && karmaRemaining < COMPLEX_FORM_KARMA_COST) return;
        newForms = [...selectedComplexForms, formId];
      }

      const newFormsBeyondFree = Math.max(0, newForms.length - freeComplexForms);
      const newKarmaSpentOnForms = newFormsBeyondFree * COMPLEX_FORM_KARMA_COST;

      updateState({
        selections: {
          ...state.selections,
          complexForms: newForms,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-complex-forms": newKarmaSpentOnForms,
        },
      });
    },
    [selectedComplexForms, maxTotalComplexForms, freeComplexForms, karmaRemaining, state.selections, state.budgets, updateState]
  );



  // Get complex form data by ID
  const getComplexFormById = (id: string): ComplexFormData | undefined => {
    return complexFormsCatalog?.find((cf) => cf.id === id);
  };

  return (
    <div className="space-y-6">
      {/* Karma Budget Display */}
      <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Remaining Karma</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Base 25 + {karmaGainedNegative} (negative qualities) - {karmaSpent} spent
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${karmaRemaining > MAX_KARMA_CARRYOVER
              ? "text-amber-600 dark:text-amber-400"
              : "text-purple-700 dark:text-purple-300"
              }`}>
              {karmaRemaining}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">remaining</div>
          </div>
        </div>
        {karmaRemaining > MAX_KARMA_CARRYOVER && (
          <div className="mt-2 rounded bg-amber-100 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            Max {MAX_KARMA_CARRYOVER} Karma carryover allowed. Spend {karmaRemaining - MAX_KARMA_CARRYOVER} more Karma.
          </div>
        )}
      </div>

      {/* Karma Breakdown */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Karma Breakdown</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Starting Karma</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{karmaBase}</span>
          </div>
          {karmaGainedNegative > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>+ Negative Qualities</span>
              <span>+{karmaGainedNegative}</span>
            </div>
          )}
          {karmaSpentPositive > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>- Positive Qualities</span>
              <span>-{karmaSpentPositive}</span>
            </div>
          )}
          {karmaSpentGear > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>- Gear (Nuyen conversion)</span>
              <span>-{karmaSpentGear}</span>
            </div>
          )}
          {karmaSpentOnSpells > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>- Spells ({spellsBeyondFree} × {SPELL_KARMA_COST})</span>
              <span>-{karmaSpentOnSpells}</span>
            </div>
          )}
          {karmaSpentOnComplexForms > 0 && (
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>- Complex Forms ({complexFormsBeyondFree} × {COMPLEX_FORM_KARMA_COST})</span>
              <span>-{karmaSpentOnComplexForms}</span>
            </div>
          )}
          <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
            <div className="flex justify-between font-medium">
              <span className="text-zinc-900 dark:text-zinc-100">Total Remaining</span>
              <span className={karmaRemaining > MAX_KARMA_CARRYOVER ? "text-amber-600 dark:text-amber-400" : "text-purple-600 dark:text-purple-400"}>
                {karmaRemaining}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mundane Character Message */}
      {!isMagician && !isTechnomancer && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
          <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">No Spells or Complex Forms</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            As a mundane character, you don&apos;t have access to spells or complex forms.
            Your remaining Karma will carry over to gameplay (max {MAX_KARMA_CARRYOVER}).
          </p>
        </div>
      )}

      {/* Spell Selection for Magical Characters */}


      {/* Complex Form Selection for Technomancers */}
      {isTechnomancer && complexFormsCatalog && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Complex Forms
            </h3>
            <div className="text-sm">
              <span className={selectedComplexForms.length > freeComplexForms ? "text-amber-600 dark:text-amber-400" : "text-cyan-600 dark:text-cyan-400"}>
                {selectedComplexForms.length}
              </span>
              <span className="text-zinc-400"> / {freeComplexForms} free</span>
              {selectedComplexForms.length > freeComplexForms && (
                <span className="text-zinc-400"> ({complexFormsBeyondFree} × {COMPLEX_FORM_KARMA_COST} Karma)</span>
              )}
              <span className="text-zinc-400"> (max {maxTotalComplexForms})</span>
            </div>
          </div>

          {/* Selected Complex Forms */}
          {selectedComplexForms.length > 0 && (
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-900/20">
              <div className="mb-2 text-xs font-medium text-cyan-700 dark:text-cyan-300">Selected Complex Forms</div>
              <div className="flex flex-wrap gap-2">
                {selectedComplexForms.map((formId, index) => {
                  const form = getComplexFormById(formId);
                  const isFree = index < freeComplexForms;
                  return (
                    <button
                      key={formId}
                      onClick={() => toggleComplexForm(formId)}
                      className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-3 py-1 text-sm transition-colors hover:bg-cyan-200 dark:bg-cyan-800 dark:hover:bg-cyan-700"
                    >
                      <span className="font-medium text-cyan-800 dark:text-cyan-200">
                        {form?.name || formId}
                      </span>
                      {!isFree && (
                        <span className="text-xs text-amber-600 dark:text-amber-400">({COMPLEX_FORM_KARMA_COST}K)</span>
                      )}
                      <svg className="h-3 w-3 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search complex forms..."
              value={complexFormSearch}
              onChange={(e) => setComplexFormSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          {/* Complex Form List */}
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {filteredComplexForms.map((form) => {
              const isSelected = selectedComplexForms.includes(form.id);
              const canSelect = isSelected || (
                selectedComplexForms.length < maxTotalComplexForms &&
                (selectedComplexForms.length < freeComplexForms || karmaRemaining >= COMPLEX_FORM_KARMA_COST)
              );

              return (
                <button
                  key={form.id}
                  onClick={() => canSelect && toggleComplexForm(form.id)}
                  disabled={!canSelect}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${isSelected
                    ? "border-cyan-300 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-900/30"
                    : canSelect
                      ? "border-zinc-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-cyan-800"
                      : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/30"
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{form.name}</span>
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                          {form.target}
                        </span>
                      </div>
                      {form.description && (
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                          {form.description}
                        </p>
                      )}
                      <div className="mt-1 flex gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Duration: {form.duration}</span>
                        <span>Fading: {form.fading}</span>
                      </div>
                    </div>
                    <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${isSelected
                      ? "border-cyan-500 bg-cyan-500 text-white"
                      : "border-zinc-300 dark:border-zinc-600"
                      }`}>
                      {isSelected && (
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            <p className="font-medium">Karma Rules</p>
            <ul className="mt-1 list-inside list-disc text-zinc-600 dark:text-zinc-400 space-y-1">
              <li>Maximum {MAX_KARMA_CARRYOVER} Karma can be carried into gameplay</li>
              {isMagician && (
                <>
                  <li>You have {freeSpells} free spells from your Magic priority</li>
                  <li>Additional spells cost {SPELL_KARMA_COST} Karma each</li>
                  <li>Maximum total spells = Magic Rating × 2 = {maxTotalSpells}</li>
                </>
              )}
              {isTechnomancer && (
                <>
                  <li>You have {freeComplexForms} free complex forms from your Resonance priority</li>
                  <li>Additional complex forms cost {COMPLEX_FORM_KARMA_COST} Karma each</li>
                  <li>Maximum total complex forms = {maxTotalComplexForms}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
