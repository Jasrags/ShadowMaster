"use client";

/**
 * useAugmentedAttributes Hook
 *
 * Extracts augmented attribute computation from DerivedStatsCard into a shared
 * hook. Returns all attribute values with cyberware/bioware bonuses and unified
 * effect bonuses applied. Used by both DerivedStatsCard and SkillsCard to show
 * dice pools during character creation.
 *
 * @see Issue #444
 */

import { useMemo } from "react";
import { useMetatypes, useRuleset, usePriorityTable } from "@/lib/rules";
import type { CreationState, CyberwareItem, BiowareItem } from "@/lib/types";
import type { CreationSelections } from "@/lib/types/creation-selections";
import type { SourcedEffect } from "@/lib/rules/effects";
import type { EffectResolutionResult } from "@/lib/types/effects";
import { useCreationEffects } from "./useCreationEffects";

// =============================================================================
// TYPES
// =============================================================================

export interface AugmentationEffects {
  essenceLoss: number;
  remainingEssence: number;
  initiativeDiceBonus: number;
  attributeBonuses: Record<string, number>;
}

export interface AugmentedAttributeResult {
  /** All attribute values with augmentation bonuses applied (core + special) */
  attributes: Record<string, number>;
  /** Raw augmentation effects (essence, initiative dice, attribute bonuses) */
  augmentationEffects: AugmentationEffects;
  /** Unified effect attribute bonuses (for display) */
  unifiedAttributeBonuses: Record<string, number>;
  /** Effect sources for Active Effects display */
  effectSources: SourcedEffect[];
  /** Passive effects result */
  passiveEffects: EffectResolutionResult | null;
  /** Unified initiative bonus */
  unifiedInitiativeBonus: number;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAugmentedAttributes(state: CreationState): AugmentedAttributeResult {
  const metatypes = useMetatypes();
  const { ruleset } = useRuleset();
  const priorityTable = usePriorityTable();
  const selectedMetatype = state.selections.metatype as string;

  // Unified effects from creation selections
  const { passiveEffects, sources } = useCreationEffects(
    state.selections as CreationSelections,
    ruleset
  );

  // Get metatype data for attribute minimums
  const metatypeData = useMemo(() => {
    return metatypes.find((m) => m.id === selectedMetatype);
  }, [metatypes, selectedMetatype]);

  // Get current core attributes from state
  const coreAttributes = useMemo(() => {
    return (state.selections.attributes || {}) as Record<string, number>;
  }, [state.selections.attributes]);

  // Get special attribute allocated points
  const specialAttributes = useMemo(() => {
    return (state.selections.specialAttributes || {}) as Record<string, number>;
  }, [state.selections.specialAttributes]);

  // Compute special attribute base values from priority table
  const specialAttributeBases = useMemo(() => {
    const bases: Record<string, number> = {};

    // Edge base from metatype
    const edgeData = metatypeData?.attributes?.edge;
    if (edgeData && typeof edgeData === "object" && "min" in edgeData) {
      bases.edge = edgeData.min;
    } else {
      bases.edge = 1;
    }

    // Magic/Resonance base from magic priority
    const magicPriority = state.priorities?.magic;
    const selectedMagicPath = state.selections["magical-path"] as string | undefined;

    if (magicPriority && selectedMagicPath && selectedMagicPath !== "mundane") {
      const magicData = priorityTable?.table[magicPriority]?.magic as
        | {
            options: Array<{
              path: string;
              magicRating?: number;
              resonanceRating?: number;
            }>;
          }
        | undefined;

      const option = magicData?.options?.find((o) => o.path === selectedMagicPath);
      if (option?.magicRating) {
        bases.magic = option.magicRating;
      }
      if (option?.resonanceRating) {
        bases.resonance = option.resonanceRating;
      }
    }

    return bases;
  }, [metatypeData, priorityTable, state.priorities?.magic, state.selections]);

  // Calculate augmentation effects (essence loss, attribute bonuses, initiative dice)
  const augmentationEffects = useMemo((): AugmentationEffects => {
    const cyberware = (state.selections.cyberware || []) as CyberwareItem[];
    const bioware = (state.selections.bioware || []) as BiowareItem[];

    let essenceLoss = 0;
    let initiativeDiceBonus = 0;
    const attributeBonuses: Record<string, number> = {};

    // Process cyberware
    cyberware.forEach((item) => {
      essenceLoss += item.essenceCost || 0;

      if (item.initiativeDiceBonus) {
        initiativeDiceBonus += item.initiativeDiceBonus;
      }

      if (item.attributeBonuses) {
        Object.entries(item.attributeBonuses).forEach(([attr, value]) => {
          attributeBonuses[attr] = (attributeBonuses[attr] || 0) + value;
        });
      }
    });

    // Process bioware
    bioware.forEach((item) => {
      essenceLoss += item.essenceCost || 0;

      if (item.attributeBonuses) {
        Object.entries(item.attributeBonuses).forEach(([attr, value]) => {
          attributeBonuses[attr] = (attributeBonuses[attr] || 0) + value;
        });
      }
    });

    return {
      essenceLoss,
      remainingEssence: Math.max(0, 6 - essenceLoss),
      initiativeDiceBonus,
      attributeBonuses,
    };
  }, [state.selections.cyberware, state.selections.bioware]);

  // Extract per-attribute modifiers from unified effects
  const unifiedAttributeBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {};
    if (!passiveEffects) return bonuses;

    for (const resolved of [
      ...passiveEffects.dicePoolModifiers,
      ...passiveEffects.limitModifiers,
      ...passiveEffects.initiativeModifiers,
    ]) {
      if (resolved.effect.type === "attribute-modifier" && resolved.effect.target?.attribute) {
        const attr = resolved.effect.target.attribute;
        bonuses[attr] = (bonuses[attr] || 0) + resolved.resolvedValue;
      }
    }

    return bonuses;
  }, [passiveEffects]);

  // Unified initiative modifier from effects system
  const unifiedInitiativeBonus = passiveEffects?.totalInitiativeModifier ?? 0;

  // Build final augmented attribute map (core + special, with all bonuses)
  const attributes = useMemo(() => {
    const getAttr = (attrId: string): number => {
      if (coreAttributes[attrId] !== undefined) {
        return coreAttributes[attrId];
      }
      // Fall back to metatype minimum
      if (metatypeData?.attributes?.[attrId]) {
        const attrData = metatypeData.attributes[attrId];
        if (typeof attrData === "object" && "min" in attrData) {
          return attrData.min;
        }
      }
      return 1; // Default minimum
    };

    // Merge manual augmentation bonuses with unified effect attribute bonuses
    const augBonuses = augmentationEffects.attributeBonuses;
    const mergedBonuses: Record<string, number> = { ...augBonuses };
    for (const [attr, val] of Object.entries(unifiedAttributeBonuses)) {
      mergedBonuses[attr] = (mergedBonuses[attr] || 0) + val;
    }

    const result: Record<string, number> = {};

    // Core attributes with bonuses
    const coreAttrIds = [
      "body",
      "agility",
      "reaction",
      "strength",
      "willpower",
      "logic",
      "intuition",
      "charisma",
    ];
    for (const attr of coreAttrIds) {
      result[attr] = getAttr(attr) + (mergedBonuses[attr] || 0);
    }

    // Special attributes: base + allocated + bonuses
    for (const attr of ["edge", "magic", "resonance"]) {
      const base = specialAttributeBases[attr] || 0;
      const allocated = specialAttributes[attr] || 0;
      const bonus = mergedBonuses[attr] || 0;
      const total = base + allocated + bonus;
      // Only include if there's a non-zero value (character has this attribute)
      if (total > 0) {
        result[attr] = total;
      }
    }

    return result;
  }, [
    coreAttributes,
    metatypeData,
    augmentationEffects,
    unifiedAttributeBonuses,
    specialAttributeBases,
    specialAttributes,
  ]);

  return {
    attributes,
    augmentationEffects,
    unifiedAttributeBonuses,
    effectSources: sources,
    passiveEffects,
    unifiedInitiativeBonus,
  };
}
