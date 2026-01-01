"use client";

/**
 * WirelessIndicator - Per-item wireless toggle with status display
 *
 * Displays:
 * - Wireless enabled/disabled state
 * - Active bonus display on hover/focus
 * - Device condition indicator (bricked/destroyed)
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { useState, useCallback } from "react";
import { Wifi, WifiOff, AlertCircle, Zap } from "lucide-react";
import type { WirelessEffect } from "@/lib/types/wireless-effects";
import type { DeviceCondition } from "@/lib/types/gear-state";

// =============================================================================
// TYPES
// =============================================================================

interface WirelessIndicatorProps {
  /** Whether wireless is enabled for this item */
  enabled: boolean;
  /** Whether the global wireless is enabled */
  globalEnabled?: boolean;
  /** Device condition (optional, for Matrix devices) */
  condition?: DeviceCondition;
  /** Wireless effects provided by this item when enabled */
  effects?: WirelessEffect[];
  /** Human-readable wireless bonus description */
  bonusDescription?: string;
  /** Callback when toggle is clicked */
  onToggle?: (enabled: boolean) => void;
  /** Whether toggling is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show just the icon (no toggle switch) */
  iconOnly?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatEffect(effect: WirelessEffect): string {
  const modifier = effect.modifier > 0 ? `+${effect.modifier}` : `${effect.modifier}`;

  switch (effect.type) {
    case "attribute":
      return `${effect.attribute?.toUpperCase()} ${modifier}`;
    case "initiative":
      return `Initiative ${modifier}`;
    case "initiative_dice":
      return `${modifier}D6 Initiative`;
    case "attack_pool":
      return `Attack ${modifier}`;
    case "defense_pool":
      return `Defense ${modifier}`;
    case "damage_resist":
      return `Damage Resist ${modifier}`;
    case "armor":
      return `Armor ${modifier}`;
    case "limit":
      return `${effect.limit} Limit ${modifier}`;
    case "recoil":
      return `Recoil Comp ${modifier}`;
    case "skill":
      return `${effect.skill} ${modifier}`;
    case "special":
      return effect.description || "Special";
    default:
      return `${effect.type} ${modifier}`;
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WirelessIndicator({
  enabled,
  globalEnabled = true,
  condition,
  effects,
  bonusDescription,
  onToggle,
  disabled = false,
  size = "md",
  iconOnly = false,
}: WirelessIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Effective state (considers global toggle and device condition)
  const isEffectivelyEnabled = enabled && globalEnabled && condition !== "bricked" && condition !== "destroyed";
  const isDeviceBroken = condition === "bricked" || condition === "destroyed";

  const handleToggle = useCallback(() => {
    if (disabled || isDeviceBroken) return;
    onToggle?.(!enabled);
  }, [disabled, isDeviceBroken, enabled, onToggle]);

  // Size classes
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const toggleSizes = {
    sm: "w-6 h-3",
    md: "w-8 h-4",
    lg: "w-10 h-5",
  };

  const dotSizes = {
    sm: "w-2 h-2 translate-x-2.5",
    md: "w-3 h-3 translate-x-4",
    lg: "w-4 h-4 translate-x-5",
  };

  // Icon color based on state
  const getIconColor = () => {
    if (isDeviceBroken) return "text-red-500";
    if (!globalEnabled) return "text-muted-foreground";
    if (isEffectivelyEnabled) return "text-cyan-400";
    return "text-muted-foreground";
  };

  // Render icon based on state
  const renderIcon = () => {
    if (condition === "destroyed") {
      return <AlertCircle className={`${iconSizes[size]} text-red-500`} />;
    }
    if (condition === "bricked") {
      return <AlertCircle className={`${iconSizes[size]} text-orange-500`} />;
    }
    if (isEffectivelyEnabled) {
      return <Wifi className={`${iconSizes[size]} ${getIconColor()}`} />;
    }
    return <WifiOff className={`${iconSizes[size]} ${getIconColor()}`} />;
  };

  // Has bonuses to show
  const hasBonuses = (effects && effects.length > 0) || bonusDescription;

  if (iconOnly) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={handleToggle}
          disabled={disabled || isDeviceBroken}
          className={`p-1 rounded transition-colors ${
            disabled || isDeviceBroken
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-muted"
          }`}
          title={
            isDeviceBroken
              ? `Device ${condition}`
              : isEffectivelyEnabled
              ? "Wireless enabled"
              : "Wireless disabled"
          }
        >
          {renderIcon()}
        </button>

        {/* Tooltip */}
        {showTooltip && hasBonuses && isEffectivelyEnabled && (
          <div className="absolute z-50 left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 rounded-lg bg-popover border border-cyan-500/30 shadow-lg">
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium mb-1">
              <Zap className="w-3 h-3" />
              Wireless Bonus
            </div>
            {effects && effects.length > 0 ? (
              <div className="space-y-0.5">
                {effects.map((effect, i) => (
                  <div key={i} className="text-xs text-foreground">
                    {formatEffect(effect)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{bonusDescription}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {renderIcon()}

      {/* Toggle switch */}
      {onToggle && (
        <button
          onClick={handleToggle}
          disabled={disabled || isDeviceBroken || !globalEnabled}
          className={`relative rounded-full transition-colors ${toggleSizes[size]} ${
            disabled || isDeviceBroken || !globalEnabled
              ? "bg-muted cursor-not-allowed"
              : isEffectivelyEnabled
              ? "bg-cyan-500"
              : "bg-muted hover:bg-muted/80"
          }`}
          title={
            !globalEnabled
              ? "Global wireless disabled"
              : isDeviceBroken
              ? `Device ${condition}`
              : isEffectivelyEnabled
              ? "Click to disable wireless"
              : "Click to enable wireless"
          }
        >
          <span
            className={`absolute top-0.5 left-0.5 rounded-full bg-white transition-transform ${
              dotSizes[size].split(" ").slice(0, 2).join(" ")
            } ${isEffectivelyEnabled ? dotSizes[size].split(" ")[2] : "translate-x-0"}`}
          />
        </button>
      )}

      {/* Status text */}
      {size !== "sm" && (
        <span className={`text-xs ${getIconColor()}`}>
          {isDeviceBroken
            ? condition === "destroyed"
              ? "Destroyed"
              : "Bricked"
            : !globalEnabled
            ? "Disabled"
            : isEffectivelyEnabled
            ? "Enabled"
            : "Off"}
        </span>
      )}

      {/* Bonus tooltip */}
      {showTooltip && hasBonuses && isEffectivelyEnabled && (
        <div className="absolute z-50 left-0 top-full mt-1 w-48 p-2 rounded-lg bg-popover border border-cyan-500/30 shadow-lg">
          <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium mb-1">
            <Zap className="w-3 h-3" />
            Active Bonus
          </div>
          {effects && effects.length > 0 ? (
            <div className="space-y-0.5">
              {effects.map((effect, i) => (
                <div key={i} className="text-xs text-foreground">
                  {formatEffect(effect)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{bonusDescription}</p>
          )}
        </div>
      )}
    </div>
  );
}
