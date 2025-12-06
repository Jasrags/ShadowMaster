"use client";

import { useMemo, useCallback } from "react";
import { useMetatypes, usePriorityTable, useMagicPaths } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface SpecialAttributeAllocatorProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

// Special attributes configuration
const SPECIAL_ATTRIBUTES = {
  edge: {
    id: "edge",
    name: "Edge",
    abbr: "EDG",
    description: "Luck, karma, and the ability to push fate in your favor",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  magic: {
    id: "magic",
    name: "Magic",
    abbr: "MAG",
    description: "Your connection to the astral plane and magical power",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  resonance: {
    id: "resonance",
    name: "Resonance",
    abbr: "RES",
    description: "Your innate connection to the digital Matrix",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
} as const;

type SpecialAttributeId = keyof typeof SPECIAL_ATTRIBUTES;

interface AttributeLimits {
  min: number;
  max: number;
  baseValue?: number; // Starting value (from magic priority for MAG/RES)
}

export function SpecialAttributeAllocator({
  state,
  updateState,
  budgetValues,
}: SpecialAttributeAllocatorProps) {
  const metatypes = useMetatypes();
  const priorityTable = usePriorityTable();
  const magicPaths = useMagicPaths();

  const selectedMetatype = state.selections.metatype as string;
  const selectedMagicPath = state.selections["magical-path"] as string | undefined;
  const magicPriority = state.priorities?.magic;
  const specialAttributePoints = budgetValues["special-attribute-points"] || 0;

  // Get metatype data for edge limits
  const metatypeData = useMemo(() => {
    return metatypes.find((m) => m.id === selectedMetatype);
  }, [metatypes, selectedMetatype]);

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
    (attrId: SpecialAttributeId): AttributeLimits => {
      if (attrId === "edge") {
        // Edge limits come from metatype
        const edgeData = metatypeData?.attributes?.edge;
        if (edgeData && "min" in edgeData && "max" in edgeData) {
          return { min: edgeData.min, max: edgeData.max };
        }
        // Default edge limits
        return { min: 1, max: 6 };
      }

      if (attrId === "magic" && magicOptionDetails?.magicRating) {
        // Magic starts at the value from magic priority
        return {
          min: 0,
          max: 6,
          baseValue: magicOptionDetails.magicRating,
        };
      }

      if (attrId === "resonance" && magicOptionDetails?.resonanceRating) {
        // Resonance starts at the value from magic priority
        return {
          min: 0,
          max: 6,
          baseValue: magicOptionDetails.resonanceRating,
        };
      }

      return { min: 0, max: 6 };
    },
    [metatypeData, magicOptionDetails]
  );

  // Get current special attribute values from state
  const specialAttributes = useMemo(() => {
    return (state.selections.specialAttributes || {}) as Record<string, number>;
  }, [state.selections.specialAttributes]);

  // Get current value for a special attribute (points allocated above base)
  const getAllocatedPoints = useCallback(
    (attrId: SpecialAttributeId): number => {
      return specialAttributes[attrId] || 0;
    },
    [specialAttributes]
  );

  // Get the actual displayed value (base + allocated)
  const getDisplayValue = useCallback(
    (attrId: SpecialAttributeId): number => {
      const limits = getAttributeLimits(attrId);
      const allocated = getAllocatedPoints(attrId);

      if (attrId === "edge") {
        // Edge: starts at minimum, allocated points add to it
        return limits.min + allocated;
      }

      // Magic/Resonance: starts at base value from priority, allocated points add to it
      return (limits.baseValue || 0) + allocated;
    },
    [getAttributeLimits, getAllocatedPoints]
  );

  // Calculate total points spent
  const pointsSpent = useMemo(() => {
    return availableAttributes.reduce((sum, attrId) => {
      return sum + getAllocatedPoints(attrId);
    }, 0);
  }, [availableAttributes, getAllocatedPoints]);

  const pointsRemaining = specialAttributePoints - pointsSpent;

  // Handle attribute change
  const handleAttributeChange = useCallback(
    (attrId: SpecialAttributeId, delta: number) => {
      const currentAllocated = getAllocatedPoints(attrId);
      const newAllocated = currentAllocated + delta;

      // Validate the change
      if (newAllocated < 0) return; // Can't go below 0 allocated
      if (delta > 0 && pointsRemaining <= 0) return; // No points to spend

      // Check max limits
      const limits = getAttributeLimits(attrId);
      let maxAllocatable: number;

      if (attrId === "edge") {
        // Edge: can allocate up to (max - min) points
        maxAllocatable = limits.max - limits.min;
      } else {
        // Magic/Resonance: can allocate up to (max - baseValue) points
        maxAllocatable = limits.max - (limits.baseValue || 0);
      }

      if (newAllocated > maxAllocatable) return;

      const newSpecialAttributes = {
        ...specialAttributes,
        [attrId]: newAllocated,
      };

      // Calculate new spent
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
          "special-attribute-points-total": specialAttributePoints,
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
      specialAttributePoints,
      updateState,
    ]
  );

  // Render attribute row
  const renderAttribute = (attrId: SpecialAttributeId) => {
    const config = SPECIAL_ATTRIBUTES[attrId];
    const limits = getAttributeLimits(attrId);
    const displayValue = getDisplayValue(attrId);
    const allocated = getAllocatedPoints(attrId);

    let maxValue: number;
    let minDisplayValue: number;

    if (attrId === "edge") {
      maxValue = limits.max;
      minDisplayValue = limits.min;
    } else {
      maxValue = limits.max;
      minDisplayValue = limits.baseValue || 0;
    }

    const canIncrease = displayValue < maxValue && pointsRemaining > 0;
    const canDecrease = allocated > 0;

    // Color coding based on attribute type
    const colorClasses = {
      edge: {
        bg: "bg-amber-100 dark:bg-amber-900/50",
        text: "text-amber-700 dark:text-amber-300",
        icon: "text-amber-500",
        button: "bg-amber-500 hover:bg-amber-600",
      },
      magic: {
        bg: "bg-purple-100 dark:bg-purple-900/50",
        text: "text-purple-700 dark:text-purple-300",
        icon: "text-purple-500",
        button: "bg-purple-500 hover:bg-purple-600",
      },
      resonance: {
        bg: "bg-cyan-100 dark:bg-cyan-900/50",
        text: "text-cyan-700 dark:text-cyan-300",
        icon: "text-cyan-500",
        button: "bg-cyan-500 hover:bg-cyan-600",
      },
    };

    const colors = colorClasses[attrId];

    return (
      <div
        key={attrId}
        className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
      >
        {/* Icon */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
          <span className={colors.icon}>{config.icon}</span>
        </div>

        {/* Attribute info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{config.name}</span>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              {config.abbr}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{config.description}</p>
        </div>

        {/* Min/Max limits */}
        <div className="text-center">
          <div className="text-xs text-zinc-400 dark:text-zinc-500">Range</div>
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {minDisplayValue}–{maxValue}
          </div>
        </div>

        {/* Value controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAttributeChange(attrId, -1)}
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

          <div
            className={`flex h-10 w-12 items-center justify-center rounded-lg text-lg font-bold ${colors.bg} ${colors.text}`}
          >
            {displayValue}
          </div>

          <button
            onClick={() => handleAttributeChange(attrId, 1)}
            disabled={!canIncrease}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              canIncrease
                ? `${colors.button} text-white`
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
    return null;
  }

  // Don't show if no special attribute points available
  if (specialAttributePoints === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Your metatype and priority combination doesn&apos;t provide special attribute points.
          Edge and other special attributes will start at their minimum values.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Points remaining indicator */}
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50 to-purple-50 p-4 dark:from-amber-900/20 dark:to-purple-900/20">
        <div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Special Attribute Points
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Distribute points among Edge{magicPathInfo?.hasMagic ? ", Magic" : ""}{magicPathInfo?.hasResonance ? ", Resonance" : ""}
          </p>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              pointsRemaining > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-zinc-500"
            }`}
          >
            {pointsRemaining}
          </div>
          <div className="text-xs text-zinc-500">of {specialAttributePoints} remaining</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-300"
          style={{ width: `${(pointsSpent / specialAttributePoints) * 100}%` }}
        />
      </div>

      {/* Special Attributes */}
      <div className="space-y-2">
        {availableAttributes.map(renderAttribute)}
      </div>

      {/* Info about special attributes */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
        <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">About Special Attributes</h4>
        <ul className="mt-2 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-500">•</span>
            <span><strong>Edge</strong> is your luck and ability to push outcomes. All characters have Edge.</span>
          </li>
          {magicPathInfo?.hasMagic && (
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-purple-500">•</span>
              <span><strong>Magic</strong> determines your magical power and maximum Force for spells/spirits.</span>
            </li>
          )}
          {magicPathInfo?.hasResonance && (
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-cyan-500">•</span>
              <span><strong>Resonance</strong> is your connection to the Matrix and determines complex form power.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

