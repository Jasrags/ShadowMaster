/**
 * Effect source gathering for the unified effect system.
 *
 * Collects SourcedEffect[] from all character sources (qualities, gear,
 * cyberware, bioware, adept powers, active modifiers) by looking up
 * catalog items in the merged ruleset.
 *
 * @see Issue #108
 */

import type {
  Character,
  MergedRuleset,
  Quality,
  Effect,
  EffectSource,
  EffectSourceType,
  EquipmentReadiness,
} from "@/lib/types";
import { normalizeReadiness } from "@/lib/types/gear-state";
import { resolveRatingBasedValue } from "./format";

/**
 * Which readiness states allow effects to be gathered per equipment category.
 * Items not in an active readiness state are skipped during effect gathering.
 */
const EFFECT_ACTIVE_READINESS: Record<string, EquipmentReadiness[]> = {
  weapon: ["readied", "holstered"],
  armor: ["worn"],
  clothing: ["worn"],
  gear: ["worn", "holstered", "pocketed", "carried"],
  electronics: ["worn", "holstered", "pocketed", "carried"],
};

/**
 * Check if an item's readiness state allows its effects to be gathered.
 * Items with no state (legacy data) are treated as active for backward compatibility.
 */
function isReadinessActive(category: string, readiness: EquipmentReadiness | undefined): boolean {
  if (!readiness) return true;
  const normalized = normalizeReadiness(readiness);
  const validStates = EFFECT_ACTIVE_READINESS[category] ?? EFFECT_ACTIVE_READINESS.gear;
  return validStates.includes(normalized);
}

/**
 * An effect paired with its source metadata for resolution.
 */
export interface SourcedEffect {
  effect: Effect;
  source: EffectSource;
}

/**
 * Type guard: checks if an effect object has the unified effect shape (has `triggers` array).
 * Since #653, QualityEffect also uses `triggers` array, so all current effect types pass this guard.
 */
function isUnifiedEffect(effect: unknown): effect is Effect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "triggers" in effect &&
    Array.isArray((effect as Record<string, unknown>).triggers)
  );
}

/**
 * Generic catalog item lookup within a ruleset module.
 * Searches for an item by ID within all arrays/objects in the module payload.
 */
function findCatalogItem(
  moduleName: string,
  catalogId: string,
  ruleset: MergedRuleset
): Record<string, unknown> | null {
  const moduleData = ruleset.modules[moduleName as keyof typeof ruleset.modules] as
    | Record<string, unknown>
    | undefined;

  if (!moduleData) return null;

  // Search all values in the module for arrays that may contain catalog items
  for (const value of Object.values(moduleData)) {
    if (Array.isArray(value)) {
      const found = value.find(
        (item: unknown) =>
          typeof item === "object" &&
          item !== null &&
          (item as Record<string, unknown>).id === catalogId
      );
      if (found) return found as Record<string, unknown>;
    }
  }

  return null;
}

/**
 * Extract unified effects from a catalog item.
 * Filters to effects with valid unified shape (triggers array, type, target).
 */
function extractEffects(catalogItem: Record<string, unknown>): Effect[] {
  const effects = catalogItem.effects;
  if (!Array.isArray(effects)) return [];
  return effects.filter(isUnifiedEffect);
}

/**
 * Gather quality effects from a character's quality selections.
 */
function gatherQualityEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];
  const qualitiesModule = ruleset.modules.qualities as
    | { positive: Quality[]; negative: Quality[] }
    | undefined;

  if (!qualitiesModule) return results;

  const allQualities = [...(qualitiesModule.positive || []), ...(qualitiesModule.negative || [])];
  const allSelections = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  for (const selection of allSelections) {
    const qualityId = selection.qualityId || selection.id || "";
    const definition = allQualities.find((q) => q.id === qualityId);
    if (!definition) continue;

    // Check for level-specific effects first
    const rating = selection.rating ?? 1;
    let effects: unknown[] = [];

    if (definition.levels && selection.rating) {
      const level = definition.levels.find((l) => l.level === selection.rating);
      if (level?.effects) {
        effects = level.effects;
      }
    } else if (definition.effects) {
      effects = definition.effects;
    }

    const source: EffectSource = {
      type: "quality",
      id: qualityId,
      name: definition.name,
      rating,
    };

    // Look up rating table entry for resolving "rating-based" values
    const ratingsTable = (definition as unknown as Record<string, unknown>).ratings as
      | Record<string, Record<string, unknown>>
      | undefined;
    const ratingEntry = ratingsTable?.[String(rating)];

    for (const rawEffect of effects) {
      if (isUnifiedEffect(rawEffect)) {
        // Resolve "rating-based" string values to numbers during gathering
        if (typeof (rawEffect as unknown as Record<string, unknown>).value === "string") {
          const resolved = resolveRatingBasedValue(rawEffect, ratingEntry);
          if (resolved !== null) {
            results.push({ effect: { ...rawEffect, value: resolved }, source });
            continue;
          }
        }
        results.push({ effect: rawEffect, source });
      }
    }
  }

  return results;
}

/**
 * Gather effects from gear items.
 */
function gatherGearEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];

  for (const item of character.gear || []) {
    if (!isReadinessActive(item.category, item.state?.readiness)) continue;

    const itemId = item.id;
    if (!itemId) continue;

    const catalogItem = findCatalogItem("gear", itemId, ruleset);
    if (!catalogItem) continue;

    const effects = extractEffects(catalogItem);
    const source: EffectSource = {
      type: "gear",
      id: itemId,
      name: item.name,
      rating: item.rating,
    };

    for (const effect of effects) {
      results.push({ effect, source });
    }
  }

  return results;
}

/**
 * Gather effects from weapons.
 */
function gatherWeaponEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];

  for (const weapon of character.weapons || []) {
    if (!isReadinessActive("weapon", weapon.state?.readiness)) continue;

    const catalogId = weapon.catalogId;
    if (!catalogId) continue;

    const catalogItem = findCatalogItem("gear", catalogId, ruleset);
    if (!catalogItem) continue;

    const effects = extractEffects(catalogItem);
    const source: EffectSource = {
      type: "gear",
      id: catalogId,
      name: weapon.name,
    };

    for (const effect of effects) {
      results.push({ effect, source });
    }
  }

  return results;
}

/**
 * Gather effects from armor.
 */
function gatherArmorEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];

  for (const armor of character.armor || []) {
    if (!isReadinessActive("armor", armor.state?.readiness)) continue;

    const catalogId = armor.catalogId;
    if (!catalogId) continue;

    const catalogItem = findCatalogItem("gear", catalogId, ruleset);
    if (!catalogItem) continue;

    const effects = extractEffects(catalogItem);
    const source: EffectSource = {
      type: "gear",
      id: catalogId,
      name: armor.name,
    };

    for (const effect of effects) {
      results.push({ effect, source });
    }
  }

  return results;
}

/**
 * Build source with wireless status for augmentation items.
 */
function buildAugmentSource(
  type: EffectSourceType,
  id: string,
  name: string,
  rating: number | undefined,
  itemWirelessEnabled: boolean | undefined,
  globalWirelessEnabled: boolean
): EffectSource {
  return {
    type,
    id,
    name,
    rating,
    wirelessEnabled: (itemWirelessEnabled ?? true) && globalWirelessEnabled,
  };
}

/**
 * Gather effects from cyberware.
 */
function gatherCyberwareEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];
  const globalWireless = character.wirelessBonusesEnabled ?? true;

  for (const item of character.cyberware || []) {
    const catalogItem = findCatalogItem("cyberware", item.catalogId, ruleset);
    if (!catalogItem) continue;

    const effects = extractEffects(catalogItem);
    const source = buildAugmentSource(
      "cyberware",
      item.catalogId,
      item.name,
      item.rating,
      item.wirelessEnabled,
      globalWireless
    );

    for (const effect of effects) {
      results.push({ effect, source });
    }
  }

  return results;
}

/**
 * Gather effects from bioware.
 */
function gatherBiowareEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];
  const globalWireless = character.wirelessBonusesEnabled ?? true;

  for (const item of character.bioware || []) {
    const catalogItem = findCatalogItem("bioware", item.catalogId, ruleset);
    if (!catalogItem) continue;

    const effects = extractEffects(catalogItem);
    const source = buildAugmentSource(
      "bioware",
      item.catalogId,
      item.name,
      item.rating,
      item.wirelessEnabled,
      globalWireless
    );

    for (const effect of effects) {
      results.push({ effect, source });
    }
  }

  return results;
}

/**
 * Gather effects from adept powers.
 */
function gatherAdeptPowerEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];

  for (const power of character.adeptPowers || []) {
    const catalogItem = findCatalogItem("adeptPowers", power.catalogId, ruleset);
    if (!catalogItem) continue;

    const effects = extractEffects(catalogItem);
    const source: EffectSource = {
      type: "adept-power",
      id: power.catalogId,
      name: power.name,
      rating: power.rating,
    };

    for (const effect of effects) {
      results.push({ effect, source });
    }
  }

  return results;
}

/**
 * Gather effects from modifications installed on gear items.
 * Handles vision/audio enhancements installed on glasses, goggles, etc.
 */
function gatherGearModEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];

  for (const item of character.gear || []) {
    if (!isReadinessActive(item.category, item.state?.readiness)) continue;

    for (const mod of item.modifications || []) {
      const catalogItem = findCatalogItem("gear", mod.catalogId, ruleset);
      if (!catalogItem) continue;

      const effects = extractEffects(catalogItem);
      const source: EffectSource = {
        type: "gear",
        id: mod.catalogId,
        name: mod.name,
        rating: mod.rating,
        parentName: item.name,
        parentId: item.id,
      };

      for (const effect of effects) {
        results.push({ effect, source });
      }
    }
  }

  return results;
}

/**
 * Gather effects from modifications installed on weapons.
 * Handles weapon accessories like smartgun systems, laser sights, stocks, etc.
 */
function gatherWeaponModEffects(character: Character, ruleset: MergedRuleset): SourcedEffect[] {
  const results: SourcedEffect[] = [];

  for (const weapon of character.weapons || []) {
    if (!isReadinessActive("weapon", weapon.state?.readiness)) continue;

    for (const mod of weapon.modifications || []) {
      const catalogItem = findCatalogItem("modifications", mod.catalogId, ruleset);
      if (!catalogItem) continue;

      const effects = extractEffects(catalogItem);
      const source: EffectSource = {
        type: "gear",
        id: mod.catalogId,
        name: mod.name,
        rating: mod.rating,
        parentName: weapon.name,
        parentId: weapon.id,
      };

      for (const effect of effects) {
        results.push({ effect, source });
      }
    }
  }

  return results;
}

/**
 * Gather effects from active modifiers on the character.
 * Filters out expired modifiers (by timestamp or remaining uses).
 */
function gatherActiveModifierEffects(
  character: Character,
  now: Date = new Date()
): SourcedEffect[] {
  const results: SourcedEffect[] = [];
  const nowISO = now.toISOString();

  for (const modifier of character.activeModifiers || []) {
    // Filter expired by timestamp
    if (modifier.expiresAt && modifier.expiresAt < nowISO) continue;

    // Filter expired by remaining uses
    if (modifier.remainingUses !== undefined && modifier.remainingUses <= 0) continue;

    const source: EffectSource = {
      type: "active-modifier",
      id: modifier.id,
      name: modifier.name,
    };

    results.push({ effect: modifier.effect, source });
  }

  return results;
}

/**
 * Gather all effect sources from a character and ruleset.
 * Collects effects from qualities, gear, weapons, armor, cyberware,
 * bioware, adept powers, and active modifiers.
 */
export interface GatherEffectOptions {
  /** Override the current time for deterministic expiry checks. Defaults to `new Date()`. */
  now?: Date;
}

export function gatherEffectSources(
  character: Character,
  ruleset: MergedRuleset,
  options: GatherEffectOptions = {}
): SourcedEffect[] {
  return [
    ...gatherQualityEffects(character, ruleset),
    ...gatherGearEffects(character, ruleset),
    ...gatherGearModEffects(character, ruleset),
    ...gatherWeaponEffects(character, ruleset),
    ...gatherWeaponModEffects(character, ruleset),
    ...gatherArmorEffects(character, ruleset),
    ...gatherCyberwareEffects(character, ruleset),
    ...gatherBiowareEffects(character, ruleset),
    ...gatherAdeptPowerEffects(character, ruleset),
    ...gatherActiveModifierEffects(character, options.now),
  ];
}
