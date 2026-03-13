"use client";

/**
 * ShapeshifterMetahumanFormSelector
 *
 * Radio-button card selector for choosing a shapeshifter's metahuman form.
 * Displays the 5 metahuman form options (Human, Dwarf, Elf, Ork, Troll)
 * with their associated karma costs.
 */

import { METAHUMAN_FORM_OPTIONS, METAHUMAN_FORM_KARMA_COSTS } from "@/lib/rules/shapeshifter";

export interface ShapeshifterMetahumanFormSelectorProps {
  readonly selectedForm: string | undefined;
  readonly onSelectForm: (form: string) => void;
}

export function ShapeshifterMetahumanFormSelector({
  selectedForm,
  onSelectForm,
}: ShapeshifterMetahumanFormSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
        Metahuman Form (required)
      </div>
      <div className="grid grid-cols-5 gap-2">
        {METAHUMAN_FORM_OPTIONS.map((option) => {
          const isSelected = selectedForm === option.id;
          const karmaCost = METAHUMAN_FORM_KARMA_COSTS[option.id] ?? 0;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectForm(option.id)}
              data-testid={`metahuman-form-${option.id}`}
              className={`flex flex-col items-center rounded-lg border-2 px-2 py-2.5 text-center transition-all ${
                isSelected
                  ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
              }`}
            >
              <div
                className={`text-sm font-semibold ${
                  isSelected
                    ? "text-amber-900 dark:text-amber-100"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {option.name}
              </div>
              <div
                className={`mt-0.5 font-mono text-xs ${
                  karmaCost > 0
                    ? isSelected
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-500 dark:text-zinc-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {karmaCost > 0 ? `${karmaCost} Karma` : "Free"}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Your shapeshifter assumes this metahuman form when shifting. The karma cost is in addition
        to the species cost.
      </p>
    </div>
  );
}
