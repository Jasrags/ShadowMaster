"use client";

import type { HouseRules } from "@/lib/types/house-rules";
import type { ToggleMeta } from "@/lib/types/house-rules";
import {
  TOGGLE_REGISTRY,
  getToggleValue,
  getToggleCategories,
  getTogglesByCategory,
  CATEGORY_LABELS,
} from "@/lib/rules/house-rules-registry";
import { RotateCcw } from "lucide-react";

interface HouseRulesFormProps {
  houseRules: HouseRules;
  onChange: (houseRules: HouseRules) => void;
}

const inputClassName =
  "block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white";

const selectClassName =
  "block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-black dark:text-white";

export default function HouseRulesForm({ houseRules, onChange }: HouseRulesFormProps) {
  const categories = getToggleCategories();

  const handleChange = (key: keyof HouseRules, value: unknown) => {
    onChange({
      ...houseRules,
      [key]: value,
    });
  };

  const handleReset = (key: keyof HouseRules) => {
    const next = { ...houseRules };
    delete next[key];
    onChange(next);
  };

  const isModified = (key: keyof HouseRules): boolean => {
    return houseRules[key] !== undefined;
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const toggles = getTogglesByCategory(category);
        // Filter out freeformNotes — rendered separately
        const fieldToggles = toggles.filter((t) => t.id !== "freeformNotes");
        if (fieldToggles.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {fieldToggles.map((meta) => (
                <ToggleField
                  key={meta.id}
                  meta={meta}
                  value={getToggleValue(houseRules, meta.id)}
                  modified={isModified(meta.id)}
                  onChange={(value) => handleChange(meta.id, value)}
                  onReset={() => handleReset(meta.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Freeform Notes */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Additional House Rules
        </h3>
        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
          Freeform notes for house rules not covered by the toggles above.
        </p>
        <textarea
          value={houseRules.freeformNotes ?? ""}
          onChange={(e) => handleChange("freeformNotes", e.target.value || undefined)}
          rows={4}
          className={inputClassName}
          placeholder="e.g., No edge rerolls, Threshold 5 for called shots..."
        />
      </div>
    </div>
  );
}

// =============================================================================
// TOGGLE FIELD RENDERER
// =============================================================================

interface ToggleFieldProps {
  meta: ToggleMeta;
  value: unknown;
  modified: boolean;
  onChange: (value: unknown) => void;
  onReset: () => void;
}

function ToggleField({ meta, value, modified, onChange, onReset }: ToggleFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {meta.label}
        </label>
        {modified && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            title="Reset to default"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">{meta.description}</p>
      {renderControl(meta, value, onChange)}
    </div>
  );
}

function renderControl(meta: ToggleMeta, value: unknown, onChange: (value: unknown) => void) {
  switch (meta.valueType) {
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {(value as boolean) ? "Enabled" : "Disabled"}
          </span>
        </div>
      );

    case "enum":
      return (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={selectClassName}
        >
          {meta.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "number":
      return (
        <input
          type="number"
          min={meta.min}
          max={meta.max}
          step={meta.id === "glitchThreshold" ? 0.1 : 1}
          value={value as number}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (Number.isFinite(parsed)) {
              onChange(parsed);
            }
          }}
          className={inputClassName}
        />
      );

    case "string":
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={inputClassName}
        />
      );

    case "string-array":
      return (
        <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
          Configured per-item (not yet editable here)
        </p>
      );

    default:
      return null;
  }
}
