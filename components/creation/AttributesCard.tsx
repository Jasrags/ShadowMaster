"use client";

/**
 * AttributesCard
 *
 * Compact card for attribute allocation in sheet-driven creation.
 * Combines core attributes and special attributes in one card.
 *
 * Features:
 * - Inline attribute rows with tooltip descriptions
 * - Side-by-side Physical/Mental columns
 * - Integrated Special Attributes (Edge, Magic, Resonance)
 * - Dual budget progress bars
 * - Metatype min/max enforcement with MAX badge
 */

import { useMemo, useCallback } from "react";
import { useMetatypes, usePriorityTable, useMagicPaths } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Tooltip } from "@/components/ui";
import { Lock, Minus, Plus, Info, Star, Sparkles, Cpu } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const PHYSICAL_ATTRIBUTES = [
  {
    id: "body",
    name: "Body",
    abbr: "BOD",
    description: "Physical health and resistance to damage",
  },
  {
    id: "agility",
    name: "Agility",
    abbr: "AGI",
    description: "Coordination and fine motor skills",
  },
  { id: "reaction", name: "Reaction", abbr: "REA", description: "Response time and reflexes" },
  { id: "strength", name: "Strength", abbr: "STR", description: "Raw physical power" },
] as const;

const MENTAL_ATTRIBUTES = [
  {
    id: "willpower",
    name: "Willpower",
    abbr: "WIL",
    description: "Mental fortitude and resistance to magic",
  },
  {
    id: "logic",
    name: "Logic",
    abbr: "LOG",
    description: "Problem solving and analytical thinking",
  },
  {
    id: "intuition",
    name: "Intuition",
    abbr: "INT",
    description: "Gut feelings and situational awareness",
  },
  {
    id: "charisma",
    name: "Charisma",
    abbr: "CHA",
    description: "Social influence and personal magnetism",
  },
] as const;

const SPECIAL_ATTR_CONFIG = {
  edge: {
    name: "Edge",
    abbr: "EDG",
    description: "Luck and fate manipulation",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/50",
    textColor: "text-amber-700 dark:text-amber-300",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
  },
  magic: {
    name: "Magic",
    abbr: "MAG",
    description: "Magical power and spellcasting ability",
    icon: Sparkles,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
    textColor: "text-purple-700 dark:text-purple-300",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
  },
  resonance: {
    name: "Resonance",
    abbr: "RES",
    description: "Connection to the Matrix",
    icon: Cpu,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/50",
    textColor: "text-cyan-700 dark:text-cyan-300",
    buttonColor: "bg-cyan-500 hover:bg-cyan-600",
  },
} as const;

const KARMA_PER_ATTRIBUTE_POINT = 5;

// =============================================================================
// TYPES
// =============================================================================

type CoreAttributeId =
  | (typeof PHYSICAL_ATTRIBUTES)[number]["id"]
  | (typeof MENTAL_ATTRIBUTES)[number]["id"];

type SpecialAttributeId = "edge" | "magic" | "resonance";

interface AttributeLimits {
  min: number;
  max: number;
}

interface AttributesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// INLINE ATTRIBUTE ROW
// =============================================================================

function InlineAttributeRow({
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
  icon,
  iconColor,
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
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}) {
  const isAtMax = value >= max;
  const Icon = icon;

  return (
    <div className="flex items-center justify-between py-1.5">
      {/* Name with tooltip */}
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
        <Tooltip content={`${name} (${abbr}): ${description}`}>
          <button
            type="button"
            aria-label={`Info about ${name}`}
            className="rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <Info
              className="h-3 w-3 cursor-help text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      </div>

      {/* Range + Controls */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {min}-{max}
        </span>

        <div
          className="flex items-center gap-1"
          role="group"
          aria-label={`${name} controls`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              if (canDecrease) onDecrease();
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              if (canIncrease) onIncrease();
            }
          }}
        >
          <button
            onClick={onDecrease}
            disabled={!canDecrease}
            aria-label={`Decrease ${name}`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
              canDecrease
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-3 w-3" aria-hidden="true" />
          </button>

          <div
            className="flex h-7 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </div>

          <button
            onClick={onIncrease}
            disabled={!canIncrease}
            aria-label={`Increase ${name}`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
              canIncrease
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>

        {isAtMax && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            MAX
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// SPECIAL ATTRIBUTE ROW
// =============================================================================

function SpecialAttributeRow({
  attrId,
  value,
  min,
  max,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
}: {
  attrId: SpecialAttributeId;
  value: number;
  min: number;
  max: number;
  canIncrease: boolean;
  canDecrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const config = SPECIAL_ATTR_CONFIG[attrId];
  const Icon = config.icon;
  const isAtMax = value >= max;

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{config.name}</span>
        <Tooltip content={`${config.name} (${config.abbr}): ${config.description}`}>
          <button
            type="button"
            aria-label={`Info about ${config.name}`}
            className="rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <Info
              className="h-3 w-3 cursor-help text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {min}-{max}
        </span>

        <div
          className="flex items-center gap-1"
          role="group"
          aria-label={`${config.name} controls`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              if (canDecrease) onDecrease();
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              if (canIncrease) onIncrease();
            }
          }}
        >
          <button
            onClick={onDecrease}
            disabled={!canDecrease}
            aria-label={`Decrease ${config.name}`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
              canDecrease
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-3 w-3" aria-hidden="true" />
          </button>

          <div
            className={`flex h-7 w-8 items-center justify-center rounded text-sm font-bold ${config.bgColor} ${config.textColor}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </div>

          <button
            onClick={onIncrease}
            disabled={!canIncrease}
            aria-label={`Increase ${config.name}`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
              canIncrease
                ? `${config.buttonColor} text-white`
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>

        {isAtMax && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            MAX
          </span>
        )}
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
  const magicPaths = useMagicPaths();
  const { getBudget } = useCreationBudgets();

  const attributeBudget = getBudget("attribute-points");
  const specialAttrBudget = getBudget("special-attribute-points");

  const selectedMetatype = state.selections.metatype as string;
  const selectedMagicPath = state.selections["magical-path"] as string | undefined;
  const attributePriority = state.priorities?.attributes;
  const magicPriority = state.priorities?.magic;
  const metatypePriority = state.priorities?.metatype;

  const attributePoints = attributeBudget?.total || 0;
  const specialAttributePoints = specialAttrBudget?.total || 0;

  // Get metatype data
  const metatypeData = useMemo(
    () => metatypes.find((m) => m.id === selectedMetatype),
    [metatypes, selectedMetatype]
  );

  // Get magic path info
  const magicPathInfo = useMemo(() => {
    if (!selectedMagicPath || selectedMagicPath === "mundane") return null;
    return magicPaths.find((p) => p.id === selectedMagicPath);
  }, [magicPaths, selectedMagicPath]);

  // Get magic option details from priority table
  const magicOptionDetails = useMemo(() => {
    if (!magicPriority || !selectedMagicPath || selectedMagicPath === "mundane") {
      return null;
    }
    if (!priorityTable?.table[magicPriority]) return null;

    const magicData = priorityTable.table[magicPriority].magic as {
      options: Array<{
        path: string;
        magicRating?: number;
        resonanceRating?: number;
      }>;
    };

    return magicData?.options?.find((o) => o.path === selectedMagicPath) || null;
  }, [priorityTable, magicPriority, selectedMagicPath]);

  // Get current attribute values from state
  const attributes = useMemo(
    () => (state.selections.attributes || {}) as Record<string, number>,
    [state.selections.attributes]
  );

  const specialAttributes = useMemo(
    () => (state.selections.specialAttributes || {}) as Record<string, number>,
    [state.selections.specialAttributes]
  );

  // Determine which special attributes are available
  const availableSpecialAttributes = useMemo(() => {
    const attrs: SpecialAttributeId[] = ["edge"];

    if (magicPathInfo) {
      if (magicPathInfo.hasResonance) {
        attrs.push("resonance");
      } else if (magicPathInfo.hasMagic) {
        attrs.push("magic");
      }
    }

    return attrs;
  }, [magicPathInfo]);

  // Get attribute limits from metatype
  const getAttributeLimits = useCallback(
    (attrId: CoreAttributeId): AttributeLimits => {
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

  // Get special attribute limits
  const getSpecialAttributeLimits = useCallback(
    (attrId: SpecialAttributeId) => {
      if (attrId === "edge") {
        const edgeData = metatypeData?.attributes?.edge;
        if (edgeData && "min" in edgeData && "max" in edgeData) {
          return { min: edgeData.min, max: edgeData.max, baseValue: edgeData.min };
        }
        return { min: 1, max: 6, baseValue: 1 };
      }

      if (attrId === "magic" && magicOptionDetails?.magicRating) {
        return { min: 0, max: 6, baseValue: magicOptionDetails.magicRating };
      }

      if (attrId === "resonance" && magicOptionDetails?.resonanceRating) {
        return { min: 0, max: 6, baseValue: magicOptionDetails.resonanceRating };
      }

      return { min: 0, max: 6, baseValue: 0 };
    },
    [metatypeData, magicOptionDetails]
  );

  // Get current value for a core attribute
  const getAttributeValue = useCallback(
    (attrId: CoreAttributeId): number => {
      if (attributes[attrId] !== undefined) {
        return attributes[attrId];
      }
      return getAttributeLimits(attrId).min;
    },
    [attributes, getAttributeLimits]
  );

  // Get allocated points for special attribute
  const getSpecialAllocatedPoints = useCallback(
    (attrId: SpecialAttributeId): number => specialAttributes[attrId] || 0,
    [specialAttributes]
  );

  // Get display value for special attribute
  const getSpecialDisplayValue = useCallback(
    (attrId: SpecialAttributeId): number => {
      const limits = getSpecialAttributeLimits(attrId);
      const allocated = getSpecialAllocatedPoints(attrId);
      return limits.baseValue + allocated;
    },
    [getSpecialAttributeLimits, getSpecialAllocatedPoints]
  );

  // Calculate core attribute points spent
  const corePointsSpent = useMemo(() => {
    let spent = 0;
    [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES].forEach((attr) => {
      const value = getAttributeValue(attr.id);
      const limits = getAttributeLimits(attr.id);
      spent += value - limits.min;
    });
    return spent;
  }, [getAttributeValue, getAttributeLimits]);

  // Calculate special attribute points spent
  const specialPointsSpent = useMemo(
    () =>
      availableSpecialAttributes.reduce(
        (sum, attrId) => sum + getSpecialAllocatedPoints(attrId),
        0
      ),
    [availableSpecialAttributes, getSpecialAllocatedPoints]
  );

  const corePointsRemaining = attributePoints - corePointsSpent;
  const specialPointsRemaining = specialAttributePoints - specialPointsSpent;
  const isCoreOverBudget = corePointsRemaining < 0;
  const karmaRequired = isCoreOverBudget
    ? Math.abs(corePointsRemaining) * KARMA_PER_ATTRIBUTE_POINT
    : 0;

  // Handle core attribute change
  // Phase 4.2: Store coreAttributePointsSpent in selections (not budgets)
  // The CreationBudgetContext derives attribute-points from selections.coreAttributePointsSpent
  const handleCoreAttributeChange = useCallback(
    (attrId: CoreAttributeId, delta: number) => {
      const limits = getAttributeLimits(attrId);
      const currentValue = getAttributeValue(attrId);
      const newValue = currentValue + delta;

      if (newValue < limits.min || newValue > limits.max) return;

      const newAttributes = { ...attributes, [attrId]: newValue };

      // Calculate new spent points
      let newSpent = 0;
      [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES].forEach((attr) => {
        const val = attr.id === attrId ? newValue : getAttributeValue(attr.id);
        const lim = getAttributeLimits(attr.id);
        newSpent += val - lim.min;
      });

      // Store both attribute values and spent points in selections
      // Context derives budget from coreAttributePointsSpent
      updateState({
        selections: {
          ...state.selections,
          attributes: newAttributes,
          coreAttributePointsSpent: newSpent,
        },
      });
    },
    [attributes, getAttributeValue, getAttributeLimits, state.selections, updateState]
  );

  // Handle special attribute change
  // Phase 4.2: Only update selections, not budgets
  // The CreationBudgetContext derives special-attribute-points from selections.specialAttributes
  const handleSpecialAttributeChange = useCallback(
    (attrId: SpecialAttributeId, delta: number) => {
      const currentAllocated = getSpecialAllocatedPoints(attrId);
      const newAllocated = currentAllocated + delta;

      if (newAllocated < 0) return;
      if (delta > 0 && specialPointsRemaining <= 0) return;

      const limits = getSpecialAttributeLimits(attrId);
      const maxAllocatable = limits.max - limits.baseValue;

      if (newAllocated > maxAllocatable) return;

      const newSpecialAttributes = { ...specialAttributes, [attrId]: newAllocated };

      // Only update selections - context derives spent from specialAttributes values
      updateState({
        selections: { ...state.selections, specialAttributes: newSpecialAttributes },
      });
    },
    [
      getSpecialAllocatedPoints,
      getSpecialAttributeLimits,
      specialPointsRemaining,
      specialAttributes,
      state.selections,
      updateState,
    ]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (!attributePriority) return "pending";
    if (!selectedMetatype) return "pending";
    if (isCoreOverBudget) return "warning";

    const coreComplete = corePointsRemaining === 0;
    const specialComplete = specialAttributePoints === 0 || specialPointsRemaining === 0;

    if (coreComplete && specialComplete) return "valid";
    if (corePointsSpent > 0 || specialPointsSpent > 0) return "warning";
    return "pending";
  }, [
    attributePriority,
    selectedMetatype,
    isCoreOverBudget,
    corePointsRemaining,
    specialAttributePoints,
    specialPointsRemaining,
    corePointsSpent,
    specialPointsSpent,
  ]);

  // Get priority source descriptions
  const attributePrioritySource = useMemo(() => {
    if (!attributePriority) return "";
    return `Priority ${attributePriority}`;
  }, [attributePriority]);

  const specialPrioritySource = useMemo(() => {
    if (!metatypePriority) return "";
    return "Metatype";
  }, [metatypePriority]);

  // Render core attribute row
  const renderCoreAttribute = (attr: {
    id: CoreAttributeId;
    name: string;
    abbr: string;
    description: string;
  }) => {
    const limits = getAttributeLimits(attr.id);
    const value = getAttributeValue(attr.id);
    const canIncrease = value < limits.max;
    const canDecrease = value > limits.min;

    return (
      <InlineAttributeRow
        key={attr.id}
        name={attr.name}
        abbr={attr.abbr}
        description={attr.description}
        value={value}
        min={limits.min}
        max={limits.max}
        canIncrease={canIncrease}
        canDecrease={canDecrease}
        onIncrease={() => handleCoreAttributeChange(attr.id, 1)}
        onDecrease={() => handleCoreAttributeChange(attr.id, -1)}
      />
    );
  };

  // If no priority selected, show locked state
  if (!attributePriority) {
    return (
      <CreationCard title="Attributes" description="Awaiting priority" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set priorities to unlock attributes
          </p>
        </div>
      </CreationCard>
    );
  }

  // If no metatype selected, show notice
  if (!selectedMetatype) {
    return (
      <CreationCard title="Attributes" description="Awaiting metatype" status="pending">
        <div className="space-y-3">
          <BudgetIndicator
            label="Attribute Points"
            spent={0}
            total={attributePoints}
            tooltip={attributePrioritySource}
            compact
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
    <CreationCard title="Attributes" status={validationStatus}>
      <div className="space-y-4">
        {/* Core Attribute Budget */}
        <BudgetIndicator
          label="Attribute Points"
          spent={corePointsSpent}
          total={attributePoints}
          tooltip={attributePrioritySource}
          karmaRequired={isCoreOverBudget ? karmaRequired : undefined}
          compact
        />

        {/* Physical Attributes */}
        <div>
          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Physical
          </h4>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
            {PHYSICAL_ATTRIBUTES.map(renderCoreAttribute)}
          </div>
        </div>

        {/* Mental Attributes */}
        <div>
          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Mental
          </h4>
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
            {MENTAL_ATTRIBUTES.map(renderCoreAttribute)}
          </div>
        </div>

        {/* Special Attributes Section */}
        {(specialAttributePoints > 0 || availableSpecialAttributes.length > 0) && (
          <>
            {/* Special Attribute Budget */}
            {specialAttributePoints > 0 && (
              <BudgetIndicator
                label="Special Attr Points"
                spent={specialPointsSpent}
                total={specialAttributePoints}
                tooltip={specialPrioritySource}
                compact
              />
            )}

            {/* Special Attributes */}
            <div>
              <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Special
              </h4>
              <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
                {availableSpecialAttributes.map((attrId) => {
                  const limits = getSpecialAttributeLimits(attrId);
                  const displayValue = getSpecialDisplayValue(attrId);
                  const allocated = getSpecialAllocatedPoints(attrId);

                  const canIncrease = displayValue < limits.max && specialPointsRemaining > 0;
                  const canDecrease = allocated > 0;

                  return (
                    <SpecialAttributeRow
                      key={attrId}
                      attrId={attrId}
                      value={displayValue}
                      min={limits.baseValue}
                      max={limits.max}
                      canIncrease={canIncrease}
                      canDecrease={canDecrease}
                      onIncrease={() => handleSpecialAttributeChange(attrId, 1)}
                      onDecrease={() => handleSpecialAttributeChange(attrId, -1)}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Summary footer */}
        {metatypeData && (
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {metatypeData.name} • Priority {attributePriority} Attributes ({attributePoints})
            {magicPathInfo && magicPriority && ` • Priority ${magicPriority} ${magicPathInfo.name}`}
          </div>
        )}
      </div>
    </CreationCard>
  );
}
