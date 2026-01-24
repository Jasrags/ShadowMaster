"use client";

/**
 * Environment Badge Component
 *
 * Displays current environment, version, git SHA, and build date.
 * Styled differently per environment, hidden in production.
 */

import { getBuildInfo, getEnvironmentDisplay, formatRelativeTime } from "@/lib/env";

/**
 * Environment badge shown under the app title
 *
 * Displays: env • version • sha • time
 * Example: local • v0.1.0 • abc123 • 2h ago
 */
export function EnvironmentBadge() {
  const buildInfo = getBuildInfo();
  const display = getEnvironmentDisplay(buildInfo.env);

  // Don't render anything in production
  if (!display.showIndicator) {
    return null;
  }

  const shortSha = buildInfo.gitSha.slice(0, 7);
  const relativeTime = formatRelativeTime(buildInfo.buildDate);

  return (
    <div className={`flex items-center gap-1.5 text-xs ${display.textColor}`}>
      {/* Environment label */}
      <span className="font-medium">{display.label}</span>

      <Separator />

      {/* Version */}
      <span>v{buildInfo.version}</span>

      {display.showDetails && (
        <>
          <Separator />

          {/* Git SHA */}
          <span className="font-mono opacity-75">{shortSha}</span>

          <Separator />

          {/* Build time */}
          <span className="opacity-75">{relativeTime}</span>
        </>
      )}
    </div>
  );
}

/**
 * Compact version for smaller spaces
 */
export function EnvironmentBadgeCompact() {
  const buildInfo = getBuildInfo();
  const display = getEnvironmentDisplay(buildInfo.env);

  if (!display.showIndicator) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${display.bgColor} ${display.textColor}`}
    >
      {display.label}
    </span>
  );
}

/**
 * Separator dot
 */
function Separator() {
  return <span className="opacity-50">•</span>;
}
