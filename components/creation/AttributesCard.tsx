"use client";

/**
 * AttributesCard
 *
 * Card for attribute allocation in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - 8 core attributes with +/- controls
 * - Points remaining display with progress bar
 * - Metatype min/max enforcement with MAX badge
 * - Attribute descriptions
 * - Karma conversion warning when over budget
 */

import { useMemo, useCallback } from "react";
import { useMetatypes, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { Lock, Minus, Plus, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

// Physical and mental attributes with descriptions (SR5)
const PHYSICAL_ATTRIBUTES = [
  { id: "body", name: "Body", abbr: "BOD", description: "Physical health and resistance to damage" },
  { id: "agility", name: "Agility", abbr: "AGI", description: "Coordination and fine motor skills" },
  { id: "reaction", name: "Reaction", abbr: "REA", description: "Response time and reflexes" },
  { id: "strength", name: "Strength", abbr: "STR", description: "Raw physical power" },
] as const;

const MENTAL_ATTRIBUTES = [
  { id: "willpower", name: "Willpower", abbr: "WIL", description: "Mental fortitude and resistance to magic" },
  { id: "logic", name: "Logic", abbr: "LOG", description: "Problem solving and analytical thinking" },
  { id: "intuition", name: "Intuition", abbr: "INT", description: "Gut feelings and situational awareness" },
  { id: "charisma", name: "Charisma", abbr: "CHA", description: "Social influence and personal magnetism" },
] as const;

const KARMA_PER_ATTRIBUTE_POINT = 5;

// =============================================================================
// TYPES
// =============================================================================

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

// =============================================================================
// PROGRESS BAR COMPONENT
// =============================================================================

function BudgetProgressBar({
  label,
  description,
  spent,
  total,
  source,
  isOver,
  karmaRequired,
}: {
  label: string;
  description: string;
  spent: number;
  total: number;
  source: string;
  isOver: boolean;
  karmaRequired?: number;
}) {
  const remaining = total - spent;
  const percentage = Math.min(100, (spent / total) * 100);

  return (
    <div className={`rounded-lg border p-3 ${
      isOver
        ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
        : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
    }`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        <div className={`text-lg font-bold ${
          isOver
            ? "text-amber-600 dark:text-amber-400"
            : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {isOver ? remaining : remaining}
        </div>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {source}
        <span className="float-right">
          of {total} remaining
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${
            isOver
              ? "bg-amber-500"
              : remaining === 0
                ? "bg-emerald-500"
                : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Over budget warning */}
      {isOver && karmaRequired && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>
            {Math.abs(remaining)} points over budget → {karmaRequired} karma ({KARMA_PER_ATTRIBUTE_POINT} karma per point)
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ATTRIBUTE ROW COMPONENT
// =============================================================================

function AttributeRow({
  name,
  abbr,
  description,
  value,
  min,
  max,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
}: {
  name: string;
  abbr: string;
  description: string;
  value: number;
  min: number;
  max: number;
  canIncrease: boolean;
  canDecrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const isAtMax = value >= max;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {abbr}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Range {min}–{max}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </div>

      {/* Controls */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={onDecrease}
          disabled={!canDecrease}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            canDecrease
              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
          title={canDecrease ? "Decrease" : `At minimum (${min})`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="flex h-8 w-10 items-center justify-center rounded bg-zinc-100 text-base font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {value}
        </div>

        <button
          onClick={onIncrease}
          disabled={!canIncrease}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            canIncrease
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
          title={canIncrease ? "Increase" : isAtMax ? `At maximum (${max})` : "No points available"}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AttributesCard({ state, updateState }: AttributesCardProps) {
  const metatypes = useMetatypes();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const attributeBudget = getBudget("attribute-points");

  const selectedMetatype = state.selections.metatype as string;
  const attributePriority = state.priorities?.attributes;
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
  const isOverBudget = pointsRemaining < 0;
  const karmaRequired = isOverBudget ? Math.abs(pointsRemaining) * KARMA_PER_ATTRIBUTE_POINT : 0;

  // Handle attribute change
  const handleAttributeChange = useCallback(
    (attrId: AttributeId, delta: number) => {
      const limits = getAttributeLimits(attrId);
      const currentValue = getAttributeValue(attrId);
      const newValue = currentValue + delta;

      // Check bounds
      if (newValue < limits.min || newValue > limits.max) return;

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
      state.selections,
      state.budgets,
      attributePoints,
      updateState,
    ]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (!attributePriority) return "pending";
    if (!selectedMetatype) return "pending";
    if (isOverBudget) return "warning";
    if (pointsRemaining === 0) return "valid";
    if (pointsSpent > 0) return "warning";
    return "pending";
  }, [attributePriority, selectedMetatype, isOverBudget, pointsRemaining, pointsSpent]);

  // Get priority source description
  const prioritySource = useMemo(() => {
    if (!attributePriority || !priorityTable?.table[attributePriority]) {
      return "";
    }
    return `${attributePoints} points from Priority ${attributePriority}`;
  }, [attributePriority, attributePoints, priorityTable]);

  // Render an attribute row
  const renderAttribute = (attr: {
    id: AttributeId;
    name: string;
    abbr: string;
    description: string;
  }) => {
    const limits = getAttributeLimits(attr.id);
    const value = getAttributeValue(attr.id);
    // Allow increase even if over budget (karma conversion) - just check max
    const canIncrease = value < limits.max;
    const canDecrease = value > limits.min;

    return (
      <AttributeRow
        key={attr.id}
        name={attr.name}
        abbr={attr.abbr}
        description={attr.description}
        value={value}
        min={limits.min}
        max={limits.max}
        canIncrease={canIncrease}
        canDecrease={canDecrease}
        onIncrease={() => handleAttributeChange(attr.id, 1)}
        onDecrease={() => handleAttributeChange(attr.id, -1)}
      />
    );
  };

  // If no priority selected, show locked state
  if (!attributePriority) {
    return (
      <CreationCard
        title="Attributes"
        description="Awaiting priority"
        status="pending"
      >
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Attribute Points
              </div>
              <div className="text-lg font-bold text-zinc-400">—</div>
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Distribute points among your physical and mental attributes
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Set attribute priority to unlock
            </div>
            <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Attributes locked until priorities are configured.
          </p>
        </div>
      </CreationCard>
    );
  }

  // If no metatype selected, show notice
  if (!selectedMetatype) {
    return (
      <CreationCard
        title="Attributes"
        description="Awaiting metatype"
        status="pending"
      >
        <div className="space-y-3">
          <BudgetProgressBar
            label="Attribute Points"
            description="Distribute points among your physical and mental attributes"
            spent={0}
            total={attributePoints}
            source={prioritySource}
            isOver={false}
          />

          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <Lock className="h-4 w-4 text-blue-500" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Select a metatype to see adjusted attribute ranges
            </p>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Attributes"
      description={
        pointsRemaining === 0
          ? "All points allocated"
          : isOverBudget
            ? `${Math.abs(pointsRemaining)} points over budget`
            : `${pointsRemaining} of ${attributePoints} points remaining`
      }
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Points budget */}
        <BudgetProgressBar
          label="Attribute Points"
          description="Distribute points among your physical and mental attributes"
          spent={pointsSpent}
          total={attributePoints}
          source={prioritySource}
          isOver={isOverBudget}
          karmaRequired={karmaRequired}
        />

        {/* Physical attributes */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Physical Attributes
          </h4>
          <div className="space-y-2">
            {PHYSICAL_ATTRIBUTES.map(renderAttribute)}
          </div>
        </div>

        {/* Mental attributes */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Mental Attributes
          </h4>
          <div className="space-y-2">
            {MENTAL_ATTRIBUTES.map(renderAttribute)}
          </div>
        </div>
      </div>
    </CreationCard>
  );
}
