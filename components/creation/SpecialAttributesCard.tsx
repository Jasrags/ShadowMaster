"use client";

/**
 * SpecialAttributesCard
 *
 * Compact card for special attribute allocation in sheet-driven creation.
 * Handles Edge, Magic, and Resonance.
 *
 * Features:
 * - Edge for all characters
 * - Magic for magical characters
 * - Resonance for technomancers
 * - Points from metatype priority
 */

import { useMemo, useCallback } from "react";
import { useMetatypes, usePriorityTable, useMagicPaths } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Star, Sparkles, Cpu, Minus, Plus } from "lucide-react";

interface SpecialAttributesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

type SpecialAttributeId = "edge" | "magic" | "resonance";

const SPECIAL_ATTR_CONFIG = {
  edge: {
    name: "Edge",
    abbr: "EDG",
    description: "Luck and fate manipulation",
    icon: Star,
    colors: {
      bg: "bg-amber-100 dark:bg-amber-900/50",
      text: "text-amber-700 dark:text-amber-300",
      icon: "text-amber-500",
      button: "bg-amber-500 hover:bg-amber-600",
    },
  },
  magic: {
    name: "Magic",
    abbr: "MAG",
    description: "Magical power",
    icon: Sparkles,
    colors: {
      bg: "bg-purple-100 dark:bg-purple-900/50",
      text: "text-purple-700 dark:text-purple-300",
      icon: "text-purple-500",
      button: "bg-purple-500 hover:bg-purple-600",
    },
  },
  resonance: {
    name: "Resonance",
    abbr: "RES",
    description: "Matrix connection",
    icon: Cpu,
    colors: {
      bg: "bg-cyan-100 dark:bg-cyan-900/50",
      text: "text-cyan-700 dark:text-cyan-300",
      icon: "text-cyan-500",
      button: "bg-cyan-500 hover:bg-cyan-600",
    },
  },
} as const;

export function SpecialAttributesCard({ state, updateState }: SpecialAttributesCardProps) {
  const metatypes = useMetatypes();
  const priorityTable = usePriorityTable();
  const magicPaths = useMagicPaths();
  const { getBudget } = useCreationBudgets();
  const specialAttrBudget = getBudget("special-attribute-points");

  const selectedMetatype = state.selections.metatype as string;
  const selectedMagicPath = state.selections["magical-path"] as string | undefined;
  const magicPriority = state.priorities?.magic;
  const metatypePriority = state.priorities?.metatype;

  const specialAttributePoints = specialAttrBudget?.total || 0;

  // Get metatype data for edge limits
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

  // Determine which special attributes are available
  const availableAttributes = useMemo(() => {
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

  // Get limits for each special attribute
  const getAttributeLimits = useCallback(
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

  // Get current special attribute values from state
  const specialAttributes = useMemo(
    () => (state.selections.specialAttributes || {}) as Record<string, number>,
    [state.selections.specialAttributes]
  );

  // Get allocated points for an attribute
  const getAllocatedPoints = useCallback(
    (attrId: SpecialAttributeId): number => specialAttributes[attrId] || 0,
    [specialAttributes]
  );

  // Get display value (base + allocated)
  const getDisplayValue = useCallback(
    (attrId: SpecialAttributeId): number => {
      const limits = getAttributeLimits(attrId);
      const allocated = getAllocatedPoints(attrId);
      return limits.baseValue + allocated;
    },
    [getAttributeLimits, getAllocatedPoints]
  );

  // Calculate total points spent
  const pointsSpent = useMemo(
    () => availableAttributes.reduce((sum, attrId) => sum + getAllocatedPoints(attrId), 0),
    [availableAttributes, getAllocatedPoints]
  );

  const pointsRemaining = specialAttributePoints - pointsSpent;

  // Handle attribute change
  const handleAttributeChange = useCallback(
    (attrId: SpecialAttributeId, delta: number) => {
      const currentAllocated = getAllocatedPoints(attrId);
      const newAllocated = currentAllocated + delta;

      if (newAllocated < 0) return;
      if (delta > 0 && pointsRemaining <= 0) return;

      const limits = getAttributeLimits(attrId);
      const maxAllocatable = limits.max - limits.baseValue;

      if (newAllocated > maxAllocatable) return;

      const newSpecialAttributes = {
        ...specialAttributes,
        [attrId]: newAllocated,
      };

      const newSpent = availableAttributes.reduce((sum, id) => {
        return sum + (id === attrId ? newAllocated : getAllocatedPoints(id));
      }, 0);

      updateState({
        selections: {
          ...state.selections,
          specialAttributes: newSpecialAttributes,
        },
        budgets: {
          ...state.budgets,
          "special-attribute-points-spent": newSpent,
        },
      });
    },
    [
      getAllocatedPoints,
      getAttributeLimits,
      pointsRemaining,
      specialAttributes,
      availableAttributes,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (!selectedMetatype || !metatypePriority) return "pending";
    if (pointsRemaining === 0 && pointsSpent > 0) return "valid";
    if (pointsSpent > 0) return "warning";
    if (specialAttributePoints === 0) return "valid"; // No points to spend
    return "pending";
  }, [selectedMetatype, metatypePriority, pointsRemaining, pointsSpent, specialAttributePoints]);

  // Check prerequisites
  if (!selectedMetatype || !metatypePriority) {
    return (
      <CreationCard
        title="Special Attributes"
        description="Allocate Edge, Magic, or Resonance"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select metatype first
          </p>
        </div>
      </CreationCard>
    );
  }

  // No points to allocate
  if (specialAttributePoints === 0) {
    return (
      <CreationCard
        title="Special Attributes"
        description="No points to allocate"
        status="valid"
      >
        <div className="space-y-2">
          {availableAttributes.map((attrId) => {
            const config = SPECIAL_ATTR_CONFIG[attrId];
            const Icon = config.icon;
            const displayValue = getDisplayValue(attrId);

            return (
              <div
                key={attrId}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.colors.icon}`} />
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">
                    {config.name}
                  </span>
                </div>
                <span className={`text-lg font-bold ${config.colors.text}`}>
                  {displayValue}
                </span>
              </div>
            );
          })}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Your metatype priority doesn't provide special attribute points.
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Special Attributes"
      description={`${pointsRemaining} / ${specialAttributePoints} points remaining`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicator */}
        <BudgetIndicator
          label="Special Attr Points"
          remaining={pointsRemaining}
          total={specialAttributePoints}
          compact
        />

        {/* Attribute rows */}
        <div className="space-y-2">
          {availableAttributes.map((attrId) => {
            const config = SPECIAL_ATTR_CONFIG[attrId];
            const Icon = config.icon;
            const limits = getAttributeLimits(attrId);
            const displayValue = getDisplayValue(attrId);
            const allocated = getAllocatedPoints(attrId);

            const canIncrease = displayValue < limits.max && pointsRemaining > 0;
            const canDecrease = allocated > 0;

            return (
              <div
                key={attrId}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.colors.bg}`}>
                    <Icon className={`h-4 w-4 ${config.colors.icon}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {config.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {limits.baseValue}–{limits.max}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAttributeChange(attrId, -1)}
                    disabled={!canDecrease}
                    className={`flex h-6 w-6 items-center justify-center rounded text-xs transition-colors ${
                      canDecrease
                        ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div
                    className={`flex h-8 w-10 items-center justify-center rounded-lg text-lg font-bold ${config.colors.bg} ${config.colors.text}`}
                  >
                    {displayValue}
                  </div>
                  <button
                    onClick={() => handleAttributeChange(attrId, 1)}
                    disabled={!canIncrease}
                    className={`flex h-6 w-6 items-center justify-center rounded text-xs transition-colors ${
                      canIncrease
                        ? `${config.colors.button} text-white`
                        : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {pointsSpent > 0 && (
          <div className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {availableAttributes.map((attrId) => {
                const config = SPECIAL_ATTR_CONFIG[attrId];
                const displayValue = getDisplayValue(attrId);
                const allocated = getAllocatedPoints(attrId);
                if (allocated === 0) return null;
                return (
                  <span key={attrId} className="text-zinc-600 dark:text-zinc-400">
                    {config.abbr}: <strong className={config.colors.text}>{displayValue}</strong>
                    <span className="text-zinc-400"> (+{allocated})</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
