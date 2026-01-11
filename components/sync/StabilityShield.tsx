"use client";

/**
 * Stability Shield Component
 *
 * Visual indicator showing character synchronization status.
 * Displays as a colored shield with tooltip explaining the status.
 *
 * - Green: "Rules Legal" - Fully synchronized
 * - Yellow: "Update Available" - Non-breaking changes or legacy status
 * - Red: "Sync Required" - Breaking changes or invalid state
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 */

import { useState } from "react";
import { useStabilityShield } from "@/lib/rules/sync/hooks";
import { MigrationWizard } from "./MigrationWizard";
import type { ID, SyncStatus, LegalityStatus } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

type ShieldColor = "green" | "yellow" | "red";

interface StabilityShieldProps {
  /** Character ID to check */
  characterId: ID;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show tooltip on hover */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Pre-computed sync status (avoids API call if provided) */
  syncStatus?: SyncStatus;
  /** Pre-computed legality status (avoids API call if provided) */
  legalityStatus?: LegalityStatus;
  /** Whether clicking opens the migration wizard */
  interactive?: boolean;
}

/**
 * Derive shield color from sync/legality status
 */
function deriveShieldStatus(
  syncStatus?: SyncStatus,
  legalityStatus?: LegalityStatus
): { status: ShieldColor; label: string; tooltip: string; actionRequired?: string } {
  // Red states - require action
  if (syncStatus === "invalid" || legalityStatus === "invalid") {
    return {
      status: "red",
      label: "Invalid",
      tooltip: "Character has validation errors",
      actionRequired: "Review and fix issues",
    };
  }

  if (syncStatus === "migrating") {
    return {
      status: "yellow",
      label: "Migrating",
      tooltip: "Migration in progress",
    };
  }

  if (syncStatus === "outdated") {
    return {
      status: "yellow",
      label: "Update Available",
      tooltip: "Ruleset updates are available",
      actionRequired: "Click to review updates",
    };
  }

  if (legalityStatus === "legacy") {
    return {
      status: "yellow",
      label: "Legacy",
      tooltip: "Using older ruleset version",
      actionRequired: "Click to sync with current rules",
    };
  }

  if (legalityStatus === "draft") {
    return {
      status: "yellow",
      label: "Draft",
      tooltip: "Character is still in draft",
    };
  }

  // Green - all good
  return {
    status: "green",
    label: "Rules Legal",
    tooltip: "Fully synchronized with current ruleset",
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StabilityShield({
  characterId,
  size = "md",
  showTooltip = true,
  className = "",
  syncStatus,
  legalityStatus,
  interactive = true,
}: StabilityShieldProps) {
  const [showWizard, setShowWizard] = useState(false);

  // Derive status from props if provided (faster, no API call)
  const hasDerivedStatus = syncStatus !== undefined || legalityStatus !== undefined;
  const derivedStatus = hasDerivedStatus ? deriveShieldStatus(syncStatus, legalityStatus) : null;

  // Only fetch from API if we don't have derived status
  const fetchedShield = useStabilityShield(characterId, hasDerivedStatus);

  const shield = derivedStatus || fetchedShield;
  const isLoading = !derivedStatus && fetchedShield.isLoading;

  // Size classes
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  // Color classes based on status
  const colorClasses = {
    green: "text-green-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
  };

  // Background classes for the shield icon
  const bgClasses = {
    green: "bg-green-500/10",
    yellow: "bg-yellow-500/10",
    red: "bg-red-500/10",
  };

  // Hover classes for interactive shields
  const hoverClasses = {
    green: "hover:bg-green-500/20",
    yellow: "hover:bg-yellow-500/20",
    red: "hover:bg-red-500/20",
  };

  if (isLoading) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} animate-pulse rounded-full bg-gray-200 dark:bg-gray-700`}
        aria-label="Loading status..."
      />
    );
  }

  const hasAction = shield.status !== "green" && interactive;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasAction) {
      setShowWizard(true);
    }
  };

  return (
    <>
      <div className={`relative inline-flex group ${className}`}>
        {/* Shield Icon */}
        <button
          type="button"
          onClick={handleClick}
          disabled={!hasAction}
          className={`
            ${sizeClasses[size]}
            ${colorClasses[shield.status]}
            ${bgClasses[shield.status]}
            ${hasAction ? hoverClasses[shield.status] : ""}
            ${hasAction ? "cursor-pointer" : "cursor-default"}
            rounded-full
            flex items-center justify-center
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${hasAction ? "focus:ring-current" : ""}
          `}
          aria-label={shield.label}
          title={hasAction ? "Click to review" : shield.label}
        >
          <ShieldIcon className="w-3/4 h-3/4" status={shield.status} />
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className={`
              absolute z-50
              left-1/2 -translate-x-1/2
              bottom-full mb-2
              px-3 py-2
              bg-gray-900 dark:bg-gray-100
              text-white dark:text-gray-900
              text-xs font-medium
              rounded-lg shadow-lg
              whitespace-nowrap
              opacity-0 invisible
              group-hover:opacity-100 group-hover:visible
              transition-all duration-200
              pointer-events-none
            `}
          >
            <div className="font-semibold">{shield.label}</div>
            <div className="text-gray-300 dark:text-gray-600">{shield.tooltip}</div>
            {shield.actionRequired && (
              <div className="mt-1 text-yellow-300 dark:text-yellow-600">
                {shield.actionRequired}
              </div>
            )}
            {/* Tooltip arrow */}
            <div
              className={`
                absolute left-1/2 -translate-x-1/2
                top-full
                border-4 border-transparent
                border-t-gray-900 dark:border-t-gray-100
              `}
            />
          </div>
        )}
      </div>

      {/* Migration Wizard Modal */}
      {showWizard && (
        <MigrationWizard characterId={characterId} onClose={() => setShowWizard(false)} />
      )}
    </>
  );
}

// =============================================================================
// SHIELD ICON
// =============================================================================

interface ShieldIconProps {
  className?: string;
  status: ShieldColor;
}

function ShieldIcon({ className = "", status }: ShieldIconProps) {
  // Different icons for different statuses
  const iconContent = {
    green: (
      // Checkmark inside shield
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
    ),
    yellow: (
      // Exclamation mark inside shield
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2" />
        <circle cx="12" cy="15" r="1" fill="currentColor" />
      </>
    ),
    red: (
      // X inside shield
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l4-4m0 4l-4-4" />
    ),
  };

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* Shield outline */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
      {/* Status icon */}
      {iconContent[status]}
    </svg>
  );
}

// =============================================================================
// COMPACT VARIANT
// =============================================================================

interface CompactShieldProps {
  /** Shield status */
  status: ShieldColor;
  /** Label to show */
  label: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Compact shield variant for inline display
 */
export function CompactShield({ status, label, className = "" }: CompactShieldProps) {
  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5
        text-xs font-medium
        rounded-full
        ${colorClasses[status]}
        ${className}
      `}
    >
      <ShieldIcon className="w-3 h-3" status={status} />
      {label}
    </span>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default StabilityShield;
