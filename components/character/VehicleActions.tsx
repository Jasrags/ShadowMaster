"use client";

/**
 * VehicleActions - Display available vehicle actions with dice pools
 *
 * Shows action categories, dice pool previews, and control mode bonuses.
 */

import type { VehicleActionType, ControlMode } from "@/lib/types/rigging";

interface VehicleAction {
  id: VehicleActionType;
  name: string;
  category: "movement" | "combat" | "evasion" | "special";
  dicePool: number;
  limit: number;
  limitType: string;
  requiresJumpedIn?: boolean;
}

interface VehicleActionsProps {
  actions: VehicleAction[];
  controlMode: ControlMode;
  controlBonus: number;
  noisePenalty?: number;
  onPerformAction?: (actionId: VehicleActionType) => void;
  className?: string;
}

const ACTION_CATEGORIES = [
  { id: "movement", name: "Movement" },
  { id: "combat", name: "Combat" },
  { id: "evasion", name: "Evasion" },
  { id: "special", name: "Special" },
] as const;

export function VehicleActions({
  actions,
  controlMode,
  controlBonus,
  noisePenalty = 0,
  onPerformAction,
  className = "",
}: VehicleActionsProps) {
  const controlModeLabel = {
    manual: "Manual Control",
    remote: "Remote Control (AR)",
    "jumped-in": "Jumped In (VR)",
  }[controlMode];

  if (actions.length === 0) {
    return (
      <div className={`vehicle-actions vehicle-actions--empty ${className}`}>
        <h3 className="vehicle-actions__title">Vehicle Actions</h3>
        <p className="vehicle-actions__empty">No vehicle selected</p>
      </div>
    );
  }

  return (
    <div className={`vehicle-actions ${className}`}>
      <h3 className="vehicle-actions__title">Vehicle Actions</h3>

      {/* Control Mode Info */}
      <div className="vehicle-actions__mode">
        <span className="vehicle-actions__mode-label">{controlModeLabel}</span>
        {controlBonus > 0 && <span className="vehicle-actions__bonus">+{controlBonus} VCR</span>}
        {noisePenalty > 0 && (
          <span className="vehicle-actions__penalty">-{noisePenalty} Noise</span>
        )}
      </div>

      {/* Actions by Category */}
      {ACTION_CATEGORIES.map((category) => {
        const categoryActions = actions.filter((a) => a.category === category.id);
        if (categoryActions.length === 0) return null;

        return (
          <div key={category.id} className="vehicle-actions__category">
            <h4 className="vehicle-actions__category-title">{category.name}</h4>
            <ul className="vehicle-actions__list">
              {categoryActions.map((action) => (
                <li key={action.id} className="vehicle-actions__item">
                  <div className="vehicle-actions__item-info">
                    <span className="vehicle-actions__item-name">{action.name}</span>
                    {action.requiresJumpedIn && (
                      <span className="vehicle-actions__item-vr">VR Only</span>
                    )}
                  </div>
                  <div className="vehicle-actions__item-pool">
                    <span className="vehicle-actions__dice">{action.dicePool}d6</span>
                    <span className="vehicle-actions__limit">
                      [{action.limit}] {action.limitType}
                    </span>
                  </div>
                  <button
                    className="vehicle-actions__btn"
                    onClick={() => onPerformAction?.(action.id)}
                    disabled={action.requiresJumpedIn && controlMode !== "jumped-in"}
                  >
                    Roll
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
