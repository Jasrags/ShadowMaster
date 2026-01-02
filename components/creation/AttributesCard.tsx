"use client";

/**
 * AttributesCard
 *
 * Compact card for attribute allocation in sheet-driven creation.
 * Shows 8 core attributes with +/- controls and metatype limits.
 *
 * Features:
 * - 8-attribute grid with +/- controls
 * - Points remaining display
 * - Metatype min/max enforcement
 * - Derived stats preview
 */

import { useMemo, useCallback } from "react";
import { useMetatypes } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Minus, Plus } from "lucide-react";

// Physical and mental attributes in SR5
const PHYSICAL_ATTRIBUTES = [
  { id: "body", name: "Body", abbr: "BOD" },
  { id: "agility", name: "Agility", abbr: "AGI" },
  { id: "reaction", name: "Reaction", abbr: "REA" },
  { id: "strength", name: "Strength", abbr: "STR" },
] as const;

const MENTAL_ATTRIBUTES = [
  { id: "willpower", name: "Willpower", abbr: "WIL" },
  { id: "logic", name: "Logic", abbr: "LOG" },
  { id: "intuition", name: "Intuition", abbr: "INT" },
  { id: "charisma", name: "Charisma", abbr: "CHA" },
] as const;

type AttributeId =
  | (typeof PHYSICAL_ATTRIBUTES)[number]["id"]
  | (typeof MENTAL_ATTRIBUTES)[number]["id"];

interface AttributeLimits {
  min: number;
  max: number;
}

interface AttributesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function AttributesCard({ state, updateState }: AttributesCardProps) {
  const metatypes = useMetatypes();
  const { getBudget } = useCreationBudgets();
  const attributeBudget = getBudget("attribute-points");

  const selectedMetatype = state.selections.metatype as string;
  const attributePoints = attributeBudget?.total || 0;

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

  // Get current value for an attribute (defaults to minimum)
  const getAttributeValue = useCallback(
    (attrId: AttributeId): number => {
      if (attributes[attrId] !== undefined) {
        return attributes[attrId];
      }
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
      spent += value - limits.min;
    });
    return spent;
  }, [getAttributeValue, getAttributeLimits]);

  const pointsRemaining = attributePoints - pointsSpent;

  // Handle attribute change
  const handleAttributeChange = useCallback(
    (attrId: AttributeId, delta: number) => {
      const limits = getAttributeLimits(attrId);
      const currentValue = getAttributeValue(attrId);
      const newValue = currentValue + delta;

      // Check bounds
      if (newValue < limits.min || newValue > limits.max) return;

      // Check if we have enough points for increase
      if (delta > 0 && pointsRemaining < delta) return;

      const newAttributes = {
        ...attributes,
        [attrId]: newValue,
      };

      // Calculate new spent
      let newSpent = 0;
      [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES].forEach((attr) => {
        const val = attr.id === attrId ? newValue : getAttributeValue(attr.id);
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
    [
      attributes,
      getAttributeValue,
      getAttributeLimits,
      pointsRemaining,
      state.selections,
      state.budgets,
      attributePoints,
      updateState,
    ]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (!selectedMetatype) return "pending";
    if (pointsRemaining === 0) return "valid";
    if (pointsSpent > 0) return "warning";
    return "pending";
  }, [selectedMetatype, pointsRemaining, pointsSpent]);

  // Render attribute row
  const renderAttribute = (attr: { id: AttributeId; name: string; abbr: string }) => {
    const limits = getAttributeLimits(attr.id);
    const value = getAttributeValue(attr.id);
    const canIncrease = value < limits.max && pointsRemaining > 0;
    const canDecrease = value > limits.min;

    return (
      <div
        key={attr.id}
        className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50"
      >
        <div className="flex items-center gap-2">
          <span className="w-8 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {attr.abbr}
          </span>
          <span className="text-xs text-zinc-400">
            ({limits.min}-{limits.max})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAttributeChange(attr.id, -1)}
            disabled={!canDecrease}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              canDecrease
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-3 w-3" />
          </button>

          <div className="flex h-7 w-8 items-center justify-center rounded bg-white text-sm font-bold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
            {value}
          </div>

          <button
            onClick={() => handleAttributeChange(attr.id, 1)}
            disabled={!canIncrease}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              canIncrease
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  };

  // If no metatype selected, show message
  if (!selectedMetatype) {
    return (
      <CreationCard
        title="Attributes"
        description="Allocate your attribute points"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a metatype first to see attribute limits
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Attributes"
      description={metatypeData?.name ? `${metatypeData.name} limits` : "Allocate points"}
      status={validationStatus}
      warningCount={pointsRemaining > 0 ? 1 : 0}
    >
      <div className="space-y-4">
        {/* Points budget */}
        <BudgetIndicator
          label="Attribute Points"
          remaining={pointsRemaining}
          total={attributePoints}
        />

        {/* Physical attributes */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Physical
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {PHYSICAL_ATTRIBUTES.map(renderAttribute)}
          </div>
        </div>

        {/* Mental attributes */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Mental
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {MENTAL_ATTRIBUTES.map(renderAttribute)}
          </div>
        </div>

        {/* Quick stats preview */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Quick Preview
          </h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-zinc-500">Physical Limit:</span>
              <span className="ml-1 font-medium text-zinc-900 dark:text-zinc-100">
                {Math.ceil(
                  (getAttributeValue("strength") * 2 +
                    getAttributeValue("body") +
                    getAttributeValue("reaction")) /
                    3
                )}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Mental Limit:</span>
              <span className="ml-1 font-medium text-zinc-900 dark:text-zinc-100">
                {Math.ceil(
                  (getAttributeValue("logic") * 2 +
                    getAttributeValue("intuition") +
                    getAttributeValue("willpower")) /
                    3
                )}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Social Limit:</span>
              <span className="ml-1 font-medium text-zinc-900 dark:text-zinc-100">
                {Math.ceil(
                  (getAttributeValue("charisma") * 2 +
                    getAttributeValue("willpower") +
                    1) / // Assuming essence is 6, essence/2 rounded up = 3
                    3
                )}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Initiative:</span>
              <span className="ml-1 font-medium text-zinc-900 dark:text-zinc-100">
                {getAttributeValue("reaction") + getAttributeValue("intuition")} + 1d6
              </span>
            </div>
          </div>
        </div>
      </div>
    </CreationCard>
  );
}
