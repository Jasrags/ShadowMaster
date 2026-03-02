/**
 * Magic Constants
 *
 * Centralized definitions for magic-related constants used across
 * spell and adept power components.
 */

import type { SpellCategory } from "@/lib/types";

// =============================================================================
// ACTIVATION TYPES (Adept Powers)
// =============================================================================

/** Display order for activation types */
export const ACTIVATION_ORDER = ["free", "simple", "complex", "interrupt", "other"] as const;

/** Activation type union derived from ACTIVATION_ORDER */
export type ActivationType = (typeof ACTIVATION_ORDER)[number];

/** Human-readable activation type labels */
export const ACTIVATION_LABELS: Record<ActivationType, string> = {
  free: "Free Action",
  simple: "Simple Action",
  complex: "Complex Action",
  interrupt: "Interrupt Action",
  other: "Passive / Other",
};

// =============================================================================
// SPELLS
// =============================================================================

/** Karma cost to learn one spell beyond free allocation */
export const SPELL_KARMA_COST = 5;

/** Base spell categories (without "all" filter option) */
export const SPELL_CATEGORIES: readonly { id: SpellCategory; name: string }[] = [
  { id: "combat", name: "Combat" },
  { id: "detection", name: "Detection" },
  { id: "health", name: "Health" },
  { id: "illusion", name: "Illusion" },
  { id: "manipulation", name: "Manipulation" },
];
