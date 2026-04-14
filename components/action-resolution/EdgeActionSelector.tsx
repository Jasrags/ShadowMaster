"use client";

import React from "react";
import { Button } from "react-aria-components";
import { Zap } from "lucide-react";
import type { EdgeActionType } from "@/lib/types";

interface EdgeActionSelectorProps {
  /** Which Edge actions to show */
  timing: "pre-roll" | "post-roll" | "non-roll";
  /** Currently selected Edge action (for toggle behavior) */
  selectedAction: EdgeActionType | null;
  /** Callback when an action is selected or deselected */
  onSelect: (action: EdgeActionType | null) => void;
  /** Current Edge points available */
  currentEdge: number;
  /** Maximum Edge points */
  maxEdge: number;
  /** Whether buttons should be disabled */
  isDisabled?: boolean;
  /** Whether the roll had a glitch (for Close Call visibility) */
  hasGlitch?: boolean;
  /** Whether Second Chance was already used */
  hasRerolled?: boolean;
  /** Button size variant */
  size?: "sm" | "md";
  /** Edge action IDs disabled by the GM for this campaign */
  disabledActionIds?: ReadonlyArray<EdgeActionType>;
}

interface EdgeButtonConfig {
  action: EdgeActionType;
  label: string;
  description: string;
}

const PRE_ROLL_ACTIONS: EdgeButtonConfig[] = [
  {
    action: "push-the-limit",
    label: "Push the Limit",
    description: "Add Edge to pool, no limit, exploding 6s",
  },
  {
    action: "blitz",
    label: "Blitz",
    description: "Go first in combat (5 initiative dice)",
  },
];

const POST_ROLL_ACTIONS: EdgeButtonConfig[] = [
  {
    action: "second-chance",
    label: "Second Chance",
    description: "Reroll all non-hits",
  },
  {
    action: "close-call",
    label: "Close Call",
    description: "Negate a glitch",
  },
];

const NON_ROLL_ACTIONS: EdgeButtonConfig[] = [
  {
    action: "seize-the-initiative",
    label: "Seize Initiative",
    description: "Go first in the Initiative Pass",
  },
  {
    action: "dead-mans-trigger",
    label: "Dead Man's Trigger",
    description: "Act when incapacitated",
  },
];

export function EdgeActionSelector({
  timing,
  selectedAction,
  onSelect,
  currentEdge,
  maxEdge,
  isDisabled = false,
  hasGlitch = false,
  hasRerolled = false,
  size = "sm",
  disabledActionIds,
}: EdgeActionSelectorProps) {
  const noEdge = currentEdge <= 0;

  let actions: EdgeButtonConfig[];
  switch (timing) {
    case "pre-roll":
      actions = PRE_ROLL_ACTIONS;
      break;
    case "post-roll":
      actions = POST_ROLL_ACTIONS;
      break;
    case "non-roll":
      actions = NON_ROLL_ACTIONS;
      break;
  }

  const isActionDisabled = (action: EdgeActionType): boolean => {
    if (noEdge || isDisabled) return true;
    if (action === "second-chance" && hasRerolled) return true;
    if (action === "close-call" && !hasGlitch) return true;
    return false;
  };

  const isActionVisible = (action: EdgeActionType): boolean => {
    // GM disabled this action for the campaign
    if (disabledActionIds?.includes(action)) return false;
    // Close Call only visible when there's a glitch
    if (action === "close-call" && !hasGlitch) return false;
    return true;
  };

  const handleToggle = (action: EdgeActionType) => {
    if (timing === "non-roll") {
      // Non-roll actions fire immediately, no toggle
      onSelect(action);
    } else {
      // Toggle behavior for pre/post-roll
      onSelect(selectedAction === action ? null : action);
    }
  };

  const sizeClasses = size === "sm" ? "text-xs px-2 py-1.5" : "text-sm px-3 py-2";

  const visibleActions = actions.filter((a) => isActionVisible(a.action));

  if (visibleActions.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-rose-500 dark:text-rose-400" />
        <span className={`text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>
          Edge Actions ({currentEdge}/{maxEdge})
        </span>
      </div>
      <div className={`grid ${visibleActions.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
        {visibleActions.map(({ action, label }) => {
          const disabled = isActionDisabled(action);
          const selected = selectedAction === action;

          return (
            <Button
              key={action}
              onPress={() => handleToggle(action)}
              isDisabled={disabled}
              className={`
                flex items-center justify-center gap-1
                ${sizeClasses} rounded
                ${
                  selected
                    ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30"
                    : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Zap className="w-3 h-3" />
              {label}
            </Button>
          );
        })}
      </div>
      {selectedAction && timing !== "non-roll" && (
        <p className={`mt-2 text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {actions.find((a) => a.action === selectedAction)?.description}
        </p>
      )}
    </div>
  );
}
