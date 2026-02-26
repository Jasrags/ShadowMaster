/**
 * Duration Helpers
 *
 * Converts duration presets into ISO expiration timestamps.
 *
 * @see Issue #114
 */

import type { DurationPreset } from "./templates";

// =============================================================================
// DURATION → SECONDS MAPPING
// =============================================================================

const DURATION_SECONDS: Record<string, number | undefined> = {
  "combat-turn": 12,
  minute: 60,
  hour: 3600,
  scene: undefined, // Manual removal
  permanent: undefined, // Never expires
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Compute an ISO expiration timestamp for a duration preset.
 * Returns undefined for "scene" and "permanent" (manual removal only).
 */
export function computeExpiresAt(duration: DurationPreset): string | undefined {
  const seconds = DURATION_SECONDS[duration];
  if (seconds === undefined) return undefined;

  return new Date(Date.now() + seconds * 1000).toISOString();
}
