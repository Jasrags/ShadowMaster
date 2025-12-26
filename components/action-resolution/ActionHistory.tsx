"use client";

import React, { useState, useMemo } from "react";
import { Button } from "react-aria-components";
import {
  History,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  XCircle,
  Target,
  RefreshCw,
  Filter,
  Calendar,
} from "lucide-react";
import type { ActionResult } from "@/lib/types";

interface ActionHistoryProps {
  /** List of action results to display */
  actions: ActionResult[];
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Whether there are more actions to load */
  hasMore?: boolean;
  /** Callback to load more actions */
  onLoadMore?: () => void;
  /** Callback when an action is selected for reroll */
  onReroll?: (action: ActionResult) => void;
  /** Whether to show the reroll button */
  showReroll?: boolean;
  /** Maximum number of actions to show before collapsing */
  maxVisible?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Filter by action type */
  filterType?: string;
  /** Callback when filter changes */
  onFilterChange?: (filter: string | undefined) => void;
}

interface ActionEntryProps {
  action: ActionResult;
  onReroll?: (action: ActionResult) => void;
  showReroll?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  size: "sm" | "md" | "lg";
}

function DiceDisplay({
  dice,
  size,
}: {
  dice: ActionResult["dice"];
  size: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-5 h-5 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-7 h-7 text-base",
  };

  return (
    <div className="flex flex-wrap gap-1">
      {dice.map((die, index) => (
        <div
          key={index}
          className={`
            ${sizeClasses[size]} rounded flex items-center justify-center font-mono font-bold
            ${
              die.isHit
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : die.value === 1
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }
            ${die.isExploded ? "ring-1 ring-amber-400" : ""}
            ${die.wasRerolled ? "opacity-50 line-through" : ""}
          `}
          title={
            die.isExploded
              ? "Exploded (6 from Push the Limit)"
              : die.wasRerolled
                ? "Rerolled"
                : undefined
          }
        >
          {die.value}
        </div>
      ))}
    </div>
  );
}

function ActionEntry({
  action,
  onReroll,
  showReroll,
  isExpanded,
  onToggle,
  size,
}: ActionEntryProps) {
  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-2" },
    md: { text: "text-sm", padding: "p-3" },
    lg: { text: "text-base", padding: "p-4" },
  };

  const s = sizeClasses[size];

  const formattedTime = useMemo(() => {
    const date = new Date(action.timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [action.timestamp]);

  const formattedDate = useMemo(() => {
    const date = new Date(action.timestamp);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }, [action.timestamp]);

  const canReroll =
    showReroll &&
    onReroll &&
    action.rerollCount === 0 &&
    !action.isCriticalGlitch;

  const hasGlitch = action.isGlitch || action.isCriticalGlitch;

  return (
    <div
      className={`
        rounded-lg border transition-colors
        ${
          action.isCriticalGlitch
            ? "border-rose-500/50 bg-rose-950/30"
            : action.isGlitch
              ? "border-amber-500/50 bg-amber-950/30"
              : "border-zinc-700 bg-zinc-900/50"
        }
      `}
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className={`
          w-full ${s.padding} flex items-center justify-between
          hover:bg-zinc-800/50 transition-colors rounded-lg
        `}
      >
        <div className="flex items-center gap-3">
          {/* Result indicator */}
          <div
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg
              ${
                action.isCriticalGlitch
                  ? "bg-rose-500/20 text-rose-400"
                  : action.isGlitch
                    ? "bg-amber-500/20 text-amber-400"
                    : action.hits > 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-800 text-zinc-400"
              }
            `}
          >
            {action.hits}
          </div>

          {/* Action info */}
          <div className="text-left">
            <div className={`font-medium text-zinc-200 ${s.text}`}>
              {action.context?.actionType || "Action"}{" "}
              {action.context?.skillUsed && (
                <span className="text-zinc-500">
                  ({action.context.skillUsed})
                </span>
              )}
            </div>
            <div className={`text-zinc-500 ${s.text}`}>
              {action.pool.totalDice}d6
              {action.pool.limit && ` (limit ${action.pool.limit})`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status badges */}
          <div className="flex items-center gap-2">
            {action.edgeAction && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs">
                <Zap className="w-3 h-3" />
                {action.edgeAction.replace("_", " ")}
              </span>
            )}
            {action.rerollCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs">
                <RefreshCw className="w-3 h-3" />
                Rerolled
              </span>
            )}
            {hasGlitch && (
              <span
                className={`
                  flex items-center gap-1 px-2 py-0.5 rounded text-xs
                  ${
                    action.isCriticalGlitch
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-amber-500/20 text-amber-400"
                  }
                `}
              >
                {action.isCriticalGlitch ? (
                  <XCircle className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {action.isCriticalGlitch ? "Critical!" : "Glitch"}
              </span>
            )}
          </div>

          {/* Timestamp */}
          <div className={`text-zinc-500 ${s.text} flex items-center gap-1`}>
            <Calendar className="w-3 h-3" />
            {formattedDate} {formattedTime}
          </div>

          {/* Expand toggle */}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className={`${s.padding} pt-0 border-t border-zinc-800`}>
          {/* Dice display */}
          <div className="mb-3">
            <div className={`text-zinc-500 ${s.text} mb-2`}>Dice Rolled</div>
            <DiceDisplay dice={action.dice} size={size} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="bg-zinc-800/50 rounded p-2">
              <div className={`text-zinc-500 ${s.text}`}>Hits</div>
              <div className="font-mono font-bold text-emerald-400">
                {action.hits}
                {action.rawHits !== action.hits && (
                  <span className="text-zinc-500 text-sm">
                    ({action.rawHits})
                  </span>
                )}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded p-2">
              <div className={`text-zinc-500 ${s.text}`}>Ones</div>
              <div className="font-mono font-bold text-rose-400">
                {action.ones}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded p-2">
              <div className={`text-zinc-500 ${s.text}`}>Pool</div>
              <div className="font-mono font-bold text-zinc-300">
                {action.pool.basePool}
              </div>
            </div>
            <div className="bg-zinc-800/50 rounded p-2">
              <div className={`text-zinc-500 ${s.text}`}>Edge Spent</div>
              <div className="font-mono font-bold text-rose-400">
                {action.edgeSpent}
              </div>
            </div>
          </div>

          {/* Pool breakdown */}
          {action.pool.modifiers.length > 0 && (
            <div className="mb-3">
              <div className={`text-zinc-500 ${s.text} mb-2`}>
                Pool Breakdown
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span>Base Pool</span>
                  <span className="font-mono">{action.pool.basePool}</span>
                </div>
                {action.pool.modifiers.map((mod, index) => (
                  <div
                    key={index}
                    className={`flex justify-between ${mod.value >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    <span>{mod.description}</span>
                    <span className="font-mono">
                      {mod.value >= 0 ? "+" : ""}
                      {mod.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-zinc-200 font-medium border-t border-zinc-700 pt-1">
                  <span>Total</span>
                  <span className="font-mono">{action.pool.totalDice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Context info */}
          {action.context && (
            <div className="mb-3">
              <div className={`text-zinc-500 ${s.text} mb-2`}>Context</div>
              <div className="space-y-1 text-zinc-400">
                {action.context.targetName && (
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3" />
                    Target: {action.context.targetName}
                  </div>
                )}
                {action.context.description && (
                  <div>{action.context.description}</div>
                )}
              </div>
            </div>
          )}

          {/* Reroll button */}
          {canReroll && (
            <Button
              onPress={() => onReroll(action)}
              className={`
                w-full flex items-center justify-center gap-2
                px-3 py-2 rounded
                bg-rose-500/20 text-rose-400 border border-rose-500/30
                hover:bg-rose-500/30
                transition-colors ${s.text}
              `}
            >
              <Zap className="w-4 h-4" />
              Use Second Chance (1 Edge)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ActionHistory({
  actions,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onReroll,
  showReroll = false,
  maxVisible = 10,
  size = "md",
  filterType,
  onFilterChange,
}: ActionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-2" },
    md: { text: "text-sm", padding: "p-3" },
    lg: { text: "text-base", padding: "p-4" },
  };

  const s = sizeClasses[size];

  // Get unique action types for filtering
  const actionTypes = useMemo(() => {
    const types = new Set<string>();
    actions.forEach((action) => {
      if (action.context?.actionType) {
        types.add(action.context.actionType);
      }
    });
    return Array.from(types).sort();
  }, [actions]);

  // Filter and limit visible actions
  const visibleActions = useMemo(() => {
    let filtered = actions;
    if (filterType) {
      filtered = actions.filter(
        (a) => a.context?.actionType === filterType
      );
    }
    if (!showAll && filtered.length > maxVisible) {
      return filtered.slice(0, maxVisible);
    }
    return filtered;
  }, [actions, filterType, showAll, maxVisible]);

  const hiddenCount = useMemo(() => {
    let filtered = actions;
    if (filterType) {
      filtered = actions.filter(
        (a) => a.context?.actionType === filterType
      );
    }
    return Math.max(0, filtered.length - maxVisible);
  }, [actions, filterType, maxVisible]);

  if (actions.length === 0 && !isLoading) {
    return (
      <div
        className={`
          rounded-lg border border-zinc-700 bg-zinc-900/50
          ${s.padding} text-center
        `}
      >
        <History className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <p className={`text-zinc-500 ${s.text}`}>No action history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-zinc-400" />
          <span className={`font-medium text-zinc-300 ${s.text}`}>
            Action History
          </span>
          <span className="text-zinc-500">({actions.length})</span>
        </div>

        {actionTypes.length > 1 && onFilterChange && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={filterType || ""}
              onChange={(e) =>
                onFilterChange(e.target.value || undefined)
              }
              className={`
                bg-zinc-800 border border-zinc-700 rounded px-2 py-1
                text-zinc-300 ${s.text}
                focus:outline-none focus:border-zinc-600
              `}
            >
              <option value="">All Types</option>
              {actionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action list */}
      <div className="space-y-2">
        {visibleActions.map((action) => (
          <ActionEntry
            key={action.id}
            action={action}
            onReroll={onReroll}
            showReroll={showReroll}
            isExpanded={expandedId === action.id}
            onToggle={() =>
              setExpandedId(expandedId === action.id ? null : action.id)
            }
            size={size}
          />
        ))}
      </div>

      {/* Show more button */}
      {!showAll && hiddenCount > 0 && (
        <Button
          onPress={() => setShowAll(true)}
          className={`
            w-full flex items-center justify-center gap-2
            px-3 py-2 rounded
            bg-zinc-800 text-zinc-400 border border-zinc-700
            hover:bg-zinc-700 hover:text-zinc-300
            transition-colors ${s.text}
          `}
        >
          <ChevronDown className="w-4 h-4" />
          Show {hiddenCount} more
        </Button>
      )}

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <Button
          onPress={onLoadMore}
          isDisabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2
            px-3 py-2 rounded
            bg-zinc-800 text-zinc-400 border border-zinc-700
            hover:bg-zinc-700 hover:text-zinc-300
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors ${s.text}
          `}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <History className="w-4 h-4" />
              Load older actions
            </>
          )}
        </Button>
      )}
    </div>
  );
}
