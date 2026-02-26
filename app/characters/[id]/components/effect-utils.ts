/**
 * Effect-to-pool modifier mapping utilities.
 *
 * Converts UnifiedResolvedEffect[] into PoolModifier[] for use with
 * DicePoolDisplay. Maps source types to PoolModifier type categories.
 *
 * @see Issue #113
 */

import type { UnifiedResolvedEffect } from "@/lib/types/effects";
import type { PoolModifier } from "./DicePoolDisplay";

/**
 * Map an effect source type to a PoolModifier type for display coloring.
 */
function mapSourceType(
  sourceType: string,
  appliedVariant: "standard" | "wireless"
): PoolModifier["type"] {
  if (appliedVariant === "wireless") return "wireless";

  switch (sourceType) {
    case "quality":
      return "quality";
    case "gear":
    case "cyberware":
    case "bioware":
      return "gear";
    case "active-modifier":
      return "situational";
    default:
      return "other";
  }
}

/**
 * Convert resolved effects into PoolModifier[] for DicePoolDisplay.
 */
export function effectsToPoolModifiers(effects: UnifiedResolvedEffect[]): PoolModifier[] {
  return effects
    .filter((e) => e.resolvedValue !== 0)
    .map((e) => ({
      label: e.source.name,
      value: e.resolvedValue,
      type: mapSourceType(e.source.type, e.appliedVariant),
    }));
}
