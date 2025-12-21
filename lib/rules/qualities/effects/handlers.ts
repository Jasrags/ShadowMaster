/**
 * Effect type handlers
 *
 * Handlers for specific effect types that perform type-specific resolution logic.
 * Each handler knows how to process its effect type and return appropriate values.
 */

import type { QualityEffect, EffectType } from "@/lib/types";
import type { ResolvedEffect } from "@/lib/types/gameplay";

/**
 * Handler function for a specific effect type
 */
export type EffectHandler = (
  effect: QualityEffect,
  resolvedEffect: ResolvedEffect
) => number | string | Record<string, unknown>;

/**
 * Handler registry for effect types
 */
const effectHandlers: Partial<Record<EffectType, EffectHandler>> = {};

/**
 * Register an effect handler for a specific type
 */
export function registerEffectHandler(
  type: EffectType,
  handler: EffectHandler
): void {
  effectHandlers[type] = handler;
}

/**
 * Get handler for an effect type
 */
export function getEffectHandler(type: EffectType): EffectHandler | undefined {
  return effectHandlers[type];
}

/**
 * Process an effect using its type-specific handler
 *
 * @param resolvedEffect - Resolved effect to process
 * @returns Processed value (number, string, or object)
 */
export function processEffect(resolvedEffect: ResolvedEffect): number | string | Record<string, unknown> {
  const handler = getEffectHandler(resolvedEffect.effect.type);

  if (handler) {
    return handler(resolvedEffect.effect, resolvedEffect);
  }

  // Default: return resolved numeric value
  return resolvedEffect.value;
}

// =============================================================================
// DEFAULT HANDLERS
// =============================================================================

/**
 * Default handler for dice-pool-modifier
 * Returns the modifier value directly
 */
registerEffectHandler("dice-pool-modifier", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for limit-modifier
 * Returns the modifier value directly
 */
registerEffectHandler("limit-modifier", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for threshold-modifier
 * Returns the modifier value directly
 */
registerEffectHandler("threshold-modifier", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for wound-modifier
 * Returns modifier data as object for wound calculation system
 */
registerEffectHandler("wound-modifier", (effect, resolvedEffect) => {
  const target = resolvedEffect.target;
  const value = resolvedEffect.value;

  // Handle different wound modifier types
  if (target.stat === "wound-boxes-ignored") {
    return {
      type: "boxes-ignored",
      value: value,
    };
  }

  if (target.stat === "wound-penalty-interval") {
    return {
      type: "penalty-interval",
      value: value,
    };
  }

  // Default: return value
  return value;
});

/**
 * Default handler for attribute-modifier
 * Returns the modifier value directly
 */
registerEffectHandler("attribute-modifier", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for attribute-maximum
 * Returns the maximum modifier value
 */
registerEffectHandler("attribute-maximum", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for resistance-modifier
 * Returns the modifier value directly
 */
registerEffectHandler("resistance-modifier", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for initiative-modifier
 * Returns modifier data as object
 */
registerEffectHandler("initiative-modifier", (effect, resolvedEffect) => {
  const target = resolvedEffect.target;
  const value = resolvedEffect.value;

  if (target.stat === "initiative") {
    return {
      type: "initiative-dice",
      value: value,
    };
  }

  return value;
});

/**
 * Default handler for healing-modifier
 * Returns the modifier value directly
 */
registerEffectHandler("healing-modifier", (effect, resolvedEffect) => {
  return resolvedEffect.value;
});

/**
 * Default handler for karma-cost-modifier
 * Returns multiplier data
 */
registerEffectHandler("karma-cost-modifier", (effect, resolvedEffect) => {
  const target = resolvedEffect.target;
  const value = resolvedEffect.value;

  // Value might be a multiplier (e.g., 2 for "2×")
  return {
    multiplier: typeof value === "number" ? value : 2,
    target: target.testCategory || target.skill || target.skillGroup,
  };
});

/**
 * Default handler for nuyen-cost-modifier
 * Returns modifier data
 */
registerEffectHandler("nuyen-cost-modifier", (effect, resolvedEffect) => {
  const target = resolvedEffect.target;
  const value = resolvedEffect.value;

  return {
    modifier: value,
    target: target.stat || "lifestyle",
  };
});

/**
 * Default handler for time-modifier
 * Returns multiplier data
 */
registerEffectHandler("time-modifier", (effect, resolvedEffect) => {
  const value = resolvedEffect.value;

  // Value might be a fraction (e.g., 0.5 for "½ time")
  return {
    multiplier: typeof value === "number" ? value : 0.5,
  };
});

/**
 * Default handler for signature-modifier
 * Returns modifier data
 */
registerEffectHandler("signature-modifier", (effect, resolvedEffect) => {
  const value = resolvedEffect.value;

  return {
    durationModifier: value,
  };
});

/**
 * Default handler for glitch-modifier
 * Returns modifier data
 */
registerEffectHandler("glitch-modifier", (effect, resolvedEffect) => {
  const value = resolvedEffect.value;

  return {
    thresholdModifier: value,
  };
});

/**
 * Default handler for special effects
 * Returns the effect as-is for custom handling
 */
registerEffectHandler("special", (effect, resolvedEffect) => {
  return {
    type: "special",
    effectId: effect.id,
    value: resolvedEffect.value,
    target: resolvedEffect.target,
    description: effect.description,
  };
});

