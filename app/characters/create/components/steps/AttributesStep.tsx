"use client";

import { useMemo, useCallback } from "react";
import { useMetatypes } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

// Physical and mental attributes in SR5
const PHYSICAL_ATTRIBUTES = [
  { id: "body", name: "Body", abbr: "BOD", description: "Physical health and resistance to damage" },
  { id: "agility", name: "Agility", abbr: "AGI", description: "Coordination and fine motor skills" },
  { id: "reaction", name: "Reaction", abbr: "REA", description: "Response time and reflexes" },
  { id: "strength", name: "Strength", abbr: "STR", description: "Raw physical power" },
] as const;

const MENTAL_ATTRIBUTES = [
  { id: "willpower", name: "Willpower", abbr: "WIL", description: "Mental fortitude and resistance" },
  { id: "logic", name: "Logic", abbr: "LOG", description: "Reasoning and analytical ability" },
  { id: "intuition", name: "Intuition", abbr: "INT", description: "Gut instincts and awareness" },
  { id: "charisma", name: "Charisma", abbr: "CHA", description: "Force of personality" },
] as const;

type AttributeId = typeof PHYSICAL_ATTRIBUTES[number]["id"] | typeof MENTAL_ATTRIBUTES[number]["id"];

interface AttributeLimits {
  min: number;
  max: number;
}

export function AttributesStep({ state, updateState, budgetValues }: StepProps) {
  const metatypes = useMetatypes();
  const attributePoints = budgetValues["attribute-points"] || 0;
  const selectedMetatype = state.selections.metatype as string;

  // Get metatype data for attribute limits
  const metatypeData = useMemo(() => {
    return metatypes.find((m) => m.id === selectedMetatype);
  }, [metatypes, selectedMetatype]);

  // Get current attribute values from state
  const attributes = useMemo(() => {
    return (state.selections.attributes || {}) as Record<string, number>;
  }, [state.selections.attributes]);

  // Get attribute limits from metatype
  const getAttributeLimits = useCallback(
    (attrId: AttributeId): AttributeLimits => {
      if (!metatypeData?.attributes) {
        return { min: 1, max: 6 };
      }
      const attrData = metatypeData.attributes[attrId];
      if (attrData && "min" in attrData && "max" in attrData) {
        return { min: attrData.min, max: attrData.max };
      }
      return { min: 1, max: 6 };
    },
    [metatypeData]
  );

  // Get current value for an attribute
  const getAttributeValue = useCallback(
    (attrId: AttributeId): number => {
      if (attributes[attrId] !== undefined) {
        return attributes[attrId];
      }
      // Default to minimum
      return getAttributeLimits(attrId).min;
    },
    [attributes, getAttributeLimits]
  );

  // Calculate points spent
  const pointsSpent = useMemo(() => {
    let spent = 0;
    [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES].forEach((attr) => {
      const value = getAttributeValue(attr.id);
      const limits = getAttributeLimits(attr.id);
      // Points spent = value - minimum
      spent += value - limits.min;
    });
    return spent;
  }, [getAttributeValue, getAttributeLimits]);

  const pointsRemaining = attributePoints - pointsSpent;

  // Handle attribute change
  const handleAttributeChange = useCallback(
    (attrId: AttributeId, newValue: number) => {
      const limits = getAttributeLimits(attrId);
      const currentValue = getAttributeValue(attrId);
      const valueDiff = newValue - currentValue;

      // Check if we have enough points for increase
      if (valueDiff > 0 && valueDiff > pointsRemaining) {
        return; // Not enough points
      }

      // Clamp to limits
      const clampedValue = Math.max(limits.min, Math.min(limits.max, newValue));

      const newAttributes = {
        ...attributes,
        [attrId]: clampedValue,
      };

      // Calculate new spent
      let newSpent = 0;
      [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES].forEach((attr) => {
        const val = attr.id === attrId ? clampedValue : getAttributeValue(attr.id);
        const lim = getAttributeLimits(attr.id);
        newSpent += val - lim.min;
      });

      updateState({
        selections: {
          ...state.selections,
          attributes: newAttributes,
        },
        budgets: {
          ...state.budgets,
          "attribute-points-spent": newSpent,
          "attribute-points-total": attributePoints,
        },
      });
    },
    [attributes, getAttributeValue, getAttributeLimits, pointsRemaining, state.selections, state.budgets, updateState, attributePoints]
  );

  // Render attribute row
  const renderAttribute = (attr: { id: AttributeId; name: string; abbr: string; description: string }) => {
    const limits = getAttributeLimits(attr.id);
    const value = getAttributeValue(attr.id);
    const canIncrease = value < limits.max && pointsRemaining > 0;
    const canDecrease = value > limits.min;

    return (
      <div
        key={attr.id}
        className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
      >
        {/* Attribute info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{attr.name}</span>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              {attr.abbr}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{attr.description}</p>
        </div>

        {/* Min/Max limits */}
        <div className="text-center">
          <div className="text-xs text-zinc-400 dark:text-zinc-500">Range</div>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {limits.min}–{limits.max}
          </div>
        </div>

        {/* Value controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAttributeChange(attr.id, value - 1)}
            disabled={!canDecrease}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              canDecrease
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            {value}
          </div>

          <button
            onClick={() => handleAttributeChange(attr.id, value + 1)}
            disabled={!canIncrease}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              canIncrease
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  if (!selectedMetatype) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Please select a metatype first to see attribute limits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points remaining indicator */}
      <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
        <div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Attribute Points</span>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Distribute points among your physical and mental attributes
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${pointsRemaining > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`}>
            {pointsRemaining}
          </div>
          <div className="text-xs text-zinc-500">of {attributePoints} remaining</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${(pointsSpent / attributePoints) * 100}%` }}
        />
      </div>

      {/* Physical Attributes */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Physical Attributes
        </h3>
        <div className="space-y-2">
          {PHYSICAL_ATTRIBUTES.map(renderAttribute)}
        </div>
      </div>

      {/* Mental Attributes */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Mental Attributes
        </h3>
        <div className="space-y-2">
          {MENTAL_ATTRIBUTES.map(renderAttribute)}
        </div>
      </div>

      {/* Metatype info */}
      {metatypeData && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">{metatypeData.name}</span> attribute ranges reflect your metatype&apos;s
            natural abilities. Attributes start at their minimum and can be raised up to the maximum shown.
          </p>
        </div>
      )}
    </div>
  );
}
