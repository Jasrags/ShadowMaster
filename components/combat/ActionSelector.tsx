"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "react-aria-components";
import {
  Swords,
  Wand2,
  Wifi,
  MessageSquare,
  Wrench,
  Zap,
  Clock,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Target,
  Search,
  X,
} from "lucide-react";
import type { ActionDefinition, ActionAllocation } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface ActionWithStatus extends ActionDefinition {
  canPerform: boolean;
  blockers: string[];
}

interface ActionSelectorProps {
  /** Available actions the character can perform */
  availableActions: ActionWithStatus[];
  /** Unavailable actions (shown grayed out) */
  unavailableActions?: ActionWithStatus[];
  /** Current action economy state */
  actionsRemaining: ActionAllocation;
  /** Callback when an action is selected */
  onSelectAction: (action: ActionDefinition) => void;
  /** Currently selected action ID */
  selectedActionId?: string;
  /** Whether selection is disabled (e.g., during roll) */
  isDisabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show unavailable actions */
  showUnavailable?: boolean;
  /** Default category filter */
  defaultCategory?: string;
}

type ActionCategory = "combat" | "magic" | "matrix" | "social" | "general" | "all";

// =============================================================================
// CATEGORY HELPERS
// =============================================================================

const categoryConfig: Record<
  ActionCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  all: { label: "All", icon: null, color: "text-zinc-400" },
  combat: { label: "Combat", icon: <Swords className="w-4 h-4" />, color: "text-rose-400" },
  magic: { label: "Magic", icon: <Wand2 className="w-4 h-4" />, color: "text-violet-400" },
  matrix: { label: "Matrix", icon: <Wifi className="w-4 h-4" />, color: "text-cyan-400" },
  social: { label: "Social", icon: <MessageSquare className="w-4 h-4" />, color: "text-amber-400" },
  general: { label: "General", icon: <Wrench className="w-4 h-4" />, color: "text-zinc-400" },
};

const actionTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  free: { label: "Free", color: "text-zinc-400", bgColor: "bg-zinc-700" },
  simple: { label: "Simple", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  complex: { label: "Complex", color: "text-violet-400", bgColor: "bg-violet-500/20" },
  interrupt: { label: "Interrupt", color: "text-amber-400", bgColor: "bg-amber-500/20" },
};

// =============================================================================
// ACTION CARD
// =============================================================================

interface ActionCardProps {
  action: ActionWithStatus;
  isSelected: boolean;
  onSelect: () => void;
  isDisabled: boolean;
  size: "sm" | "md" | "lg";
  expanded: boolean;
  onToggleExpand: () => void;
}

function ActionCard({
  action,
  isSelected,
  onSelect,
  isDisabled,
  size,
  expanded,
  onToggleExpand,
}: ActionCardProps) {
  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-2", icon: "w-3 h-3" },
    md: { text: "text-sm", padding: "p-3", icon: "w-4 h-4" },
    lg: { text: "text-base", padding: "p-4", icon: "w-5 h-5" },
  };

  const s = sizeClasses[size];
  const actionType = action.cost?.actionType || action.type;
  const typeConfig = actionTypeConfig[actionType] || actionTypeConfig.simple;
  const category = (action.domain || "general") as ActionCategory;
  const catConfig = categoryConfig[category] || categoryConfig.general;

  const canSelect = action.canPerform && !isDisabled;

  return (
    <div
      className={`
        rounded-lg border transition-all duration-200
        ${
          !action.canPerform
            ? "border-zinc-800 bg-zinc-900/30 opacity-60"
            : isSelected
              ? "border-violet-500 bg-violet-500/10"
              : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
        }
      `}
    >
      {/* Main row */}
      <div className={`flex items-center gap-2 ${s.padding}`}>
        {/* Expand/collapse button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="flex-shrink-0 p-1 rounded hover:bg-zinc-700/50 text-zinc-500"
        >
          {expanded ? (
            <ChevronDown className={s.icon} />
          ) : (
            <ChevronRight className={s.icon} />
          )}
        </button>

        {/* Category icon */}
        <div className={`flex-shrink-0 ${catConfig.color}`}>{catConfig.icon}</div>

        {/* Action info */}
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${action.canPerform ? "text-zinc-200" : "text-zinc-500"} ${s.text}`}>
            {action.name}
          </div>
          {action.subcategory && (
            <div className={`text-zinc-500 ${size === "lg" ? "text-sm" : "text-xs"}`}>
              {action.subcategory}
            </div>
          )}
        </div>

        {/* Action type badge */}
        <div
          className={`
            flex-shrink-0 px-2 py-0.5 rounded ${s.text}
            ${typeConfig.bgColor} ${typeConfig.color}
          `}
        >
          {typeConfig.label}
        </div>

        {/* Select button */}
        <Button
          onPress={onSelect}
          isDisabled={!canSelect}
          className={`
            flex-shrink-0 px-3 py-1.5 rounded-lg ${s.text}
            ${
              canSelect
                ? isSelected
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }
            transition-colors
          `}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={`border-t border-zinc-700/50 ${s.padding} space-y-2`}>
          {/* Description */}
          {action.description && (
            <p className={`text-zinc-400 ${s.text}`}>{action.description}</p>
          )}

          {/* Blockers */}
          {!action.canPerform && action.blockers.length > 0 && (
            <div className="flex items-start gap-2 p-2 rounded bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className={`text-rose-400 ${s.text}`}>
                {action.blockers.map((blocker, i) => (
                  <div key={i}>{blocker}</div>
                ))}
              </div>
            </div>
          )}

          {/* Roll config preview */}
          {action.rollConfig && (
            <div className="flex items-center gap-2 text-zinc-500">
              <Target className="w-4 h-4" />
              <span className={s.text}>
                {action.rollConfig.attribute} + {action.rollConfig.skill || "Skill"}
                {action.rollConfig.threshold && ` vs ${action.rollConfig.threshold}`}
              </span>
            </div>
          )}

          {/* Cost details */}
          {action.cost?.resourceCosts && action.cost.resourceCosts.length > 0 && (
            <div className="flex items-center gap-2 text-zinc-500">
              <Zap className="w-4 h-4" />
              <span className={s.text}>
                {action.cost.resourceCosts.map((rc) => rc.description || `${rc.amount} ${rc.type}`).join(", ")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ACTION SELECTOR
// =============================================================================

export function ActionSelector({
  availableActions,
  unavailableActions = [],
  actionsRemaining,
  onSelectAction,
  selectedActionId,
  isDisabled = false,
  size = "md",
  showUnavailable = true,
  defaultCategory = "all",
}: ActionSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState<ActionCategory>(defaultCategory as ActionCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-2" },
    md: { text: "text-sm", padding: "p-3" },
    lg: { text: "text-base", padding: "p-4" },
  };

  const s = sizeClasses[size];

  // Combine and filter actions
  const allActions = useMemo(() => {
    return [...availableActions, ...(showUnavailable ? unavailableActions : [])];
  }, [availableActions, unavailableActions, showUnavailable]);

  const filteredActions = useMemo(() => {
    return allActions.filter((action) => {
      // Category filter
      if (categoryFilter !== "all") {
        const actionCategory = action.domain || "general";
        if (actionCategory !== categoryFilter) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = action.name.toLowerCase().includes(query);
        const matchesDesc = action.description?.toLowerCase().includes(query);
        const matchesSub = action.subcategory?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSub) return false;
      }

      return true;
    });
  }, [allActions, categoryFilter, searchQuery]);

  // Group by action type
  const groupedActions = useMemo(() => {
    const groups: Record<string, ActionWithStatus[]> = {
      free: [],
      simple: [],
      complex: [],
      interrupt: [],
    };

    filteredActions.forEach((action) => {
      const type = action.cost?.actionType || action.type;
      if (groups[type]) {
        groups[type].push(action);
      } else {
        groups.simple.push(action);
      }
    });

    return groups;
  }, [filteredActions]);

  const toggleExpand = useCallback((actionId: string) => {
    setExpandedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  }, []);

  return (
    <div className={`rounded-lg border border-zinc-700 bg-zinc-900/50 ${s.padding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-rose-400" />
          <span className={`font-medium text-zinc-200 ${s.text}`}>Select Action</span>
        </div>

        {/* Action economy summary */}
        <div className="flex items-center gap-2 text-zinc-400">
          <span className={s.text}>
            {actionsRemaining.simple}S / {actionsRemaining.complex}C
            {actionsRemaining.interrupt && " / Int"}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search actions..."
          className={`
            w-full pl-9 pr-8 py-2 rounded-lg
            bg-zinc-800 border border-zinc-700
            text-zinc-300 placeholder-zinc-500
            focus:outline-none focus:border-violet-500
            ${s.text}
          `}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(categoryConfig) as ActionCategory[]).map((cat) => {
          const config = categoryConfig[cat];
          const isActive = categoryFilter === cat;

          return (
            <Button
              key={cat}
              onPress={() => setCategoryFilter(cat)}
              className={`
                flex items-center gap-1.5 px-2 py-1 rounded-lg ${s.text}
                ${
                  isActive
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                }
                transition-colors
              `}
            >
              {config.icon}
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* Action list */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActions.length === 0 ? (
          <div className={`text-center text-zinc-500 py-4 ${s.text}`}>
            No matching actions
          </div>
        ) : (
          Object.entries(groupedActions).map(([type, actions]) => {
            if (actions.length === 0) return null;

            const typeConfig = actionTypeConfig[type];

            return (
              <div key={type}>
                <div className={`flex items-center gap-2 mb-2 ${typeConfig.color}`}>
                  <Clock className="w-4 h-4" />
                  <span className={`font-medium ${s.text}`}>
                    {typeConfig.label} Actions ({actions.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {actions.map((action) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      isSelected={action.id === selectedActionId}
                      onSelect={() => onSelectAction(action)}
                      isDisabled={isDisabled}
                      size={size}
                      expanded={expandedActions.has(action.id)}
                      onToggleExpand={() => toggleExpand(action.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
