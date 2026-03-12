/**
 * Life Modules Grant Resolver
 *
 * Pure function that resolves life module selections into accumulated grants.
 * Takes module selections + catalog in, returns merged grants out.
 *
 * Rules (Run Faster pp. 65-68):
 * - Grants are additive across all selected modules
 * - Active skill cap: 7 (ranks above are lost)
 * - Knowledge skill cap: 9 (ranks above are lost)
 * - Age = sum of yearsAdded from all modules
 * - Sub-module grants are used when a sub-module is selected
 */

import type {
  LifeModule,
  LifeModulesCatalog,
  LifeModuleSelection,
  LifeModuleQualityGrant,
  LifeModuleContactGrant,
  LifeModulePhase,
} from "@/lib/types/life-modules";
import {
  LIFE_MODULES_MAX_ACTIVE_SKILL,
  LIFE_MODULES_MAX_KNOWLEDGE_SKILL,
} from "@/lib/types/life-modules";

// =============================================================================
// OUTPUT TYPE
// =============================================================================

/**
 * Accumulated grants from all selected life modules.
 * Consumed by CreationBudgetContext and creation cards.
 */
export interface ResolvedLifeModuleGrants {
  /** Additive attribute modifiers (e.g., { body: 2, logic: 1 }) */
  readonly attributeModifiers: Readonly<Record<string, number>>;

  /** Active skill ranks, capped at LIFE_MODULES_MAX_ACTIVE_SKILL (7) */
  readonly activeSkills: Readonly<Record<string, number>>;

  /** Skill group ranks */
  readonly skillGroups: Readonly<Record<string, number>>;

  /** Knowledge skill ranks, capped at LIFE_MODULES_MAX_KNOWLEDGE_SKILL (9) */
  readonly knowledgeSkills: Readonly<Record<string, number>>;

  /** Language ranks */
  readonly languages: Readonly<Record<string, number>>;

  /** All quality grants accumulated across modules */
  readonly qualities: readonly LifeModuleQualityGrant[];

  /** All contact grants accumulated across modules */
  readonly contacts: readonly LifeModuleContactGrant[];

  /** Calculated age from sum of yearsAdded */
  readonly calculatedAge: number;

  /** Total nuyen bonus from modules */
  readonly nuyenBonus: number;
}

// =============================================================================
// EMPTY GRANTS CONSTANT
// =============================================================================

export const EMPTY_GRANTS: ResolvedLifeModuleGrants = {
  attributeModifiers: {},
  activeSkills: {},
  skillGroups: {},
  knowledgeSkills: {},
  languages: {},
  qualities: [],
  contacts: [],
  calculatedAge: 0,
  nuyenBonus: 0,
};

// =============================================================================
// CATALOG LOOKUP
// =============================================================================

const PHASE_KEYS: readonly LifeModulePhase[] = [
  "nationality",
  "formative",
  "teen",
  "education",
  "career",
  "tour",
];

/**
 * Look up a module by ID in the catalog, optionally resolving to a sub-module.
 * Returns the effective module (sub-module if selected, parent otherwise).
 */
export function lookupModule(
  moduleId: string,
  subModuleId: string | undefined,
  catalog: LifeModulesCatalog
): LifeModule | undefined {
  for (const phase of PHASE_KEYS) {
    const modules = catalog[phase];
    if (!modules) continue;

    for (const mod of modules) {
      if (mod.id === moduleId) {
        if (subModuleId && mod.subModules) {
          const sub = mod.subModules.find((s) => s.id === subModuleId);
          return sub ?? mod;
        }
        return mod;
      }
    }
  }
  return undefined;
}

// =============================================================================
// GRANT MERGING
// =============================================================================

/**
 * Additively merge a record of string→number values.
 */
function mergeNumericRecord(
  base: Readonly<Record<string, number>>,
  additions: Readonly<Record<string, number>> | undefined
): Record<string, number> {
  if (!additions) return { ...base };

  const result = { ...base };
  for (const [key, value] of Object.entries(additions)) {
    result[key] = (result[key] ?? 0) + value;
  }
  return result;
}

/**
 * Cap all values in a record to a maximum.
 */
function capValues(record: Readonly<Record<string, number>>, max: number): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = Math.min(value, max);
  }
  return result;
}

/**
 * Merge grants from a single module into the accumulated result.
 */
function mergeModuleGrants(
  accumulated: ResolvedLifeModuleGrants,
  module: LifeModule
): ResolvedLifeModuleGrants {
  return {
    attributeModifiers: mergeNumericRecord(
      accumulated.attributeModifiers,
      module.attributeModifiers
    ),
    activeSkills: mergeNumericRecord(accumulated.activeSkills, module.activeSkills),
    skillGroups: mergeNumericRecord(accumulated.skillGroups, module.skillGroups),
    knowledgeSkills: mergeNumericRecord(accumulated.knowledgeSkills, module.knowledgeSkills),
    languages: mergeNumericRecord(accumulated.languages, module.languages),
    qualities: [...accumulated.qualities, ...(module.qualities ?? [])],
    contacts: [...accumulated.contacts, ...(module.contacts ?? [])],
    calculatedAge: accumulated.calculatedAge + (module.yearsAdded ?? 0),
    nuyenBonus: accumulated.nuyenBonus + (module.nuyenBonus ?? 0),
  };
}

// =============================================================================
// MAIN RESOLVER
// =============================================================================

/**
 * Resolve all life module selections into accumulated grants.
 *
 * Pure function — no side effects, no mutations.
 * Skill caps are applied after all modules are accumulated.
 *
 * @param selections - Array of selected life modules from creation state
 * @param catalog - The life modules catalog from the ruleset
 * @returns Accumulated grants with skill caps applied
 */
export function resolveLifeModuleGrants(
  selections: readonly LifeModuleSelection[],
  catalog: LifeModulesCatalog
): ResolvedLifeModuleGrants {
  if (!selections || selections.length === 0) {
    return EMPTY_GRANTS;
  }

  // Accumulate grants from all modules
  let accumulated = EMPTY_GRANTS;

  for (const selection of selections) {
    const module = lookupModule(selection.moduleId, selection.subModuleId, catalog);
    if (!module) continue;

    accumulated = mergeModuleGrants(accumulated, module);
  }

  // Apply skill caps (Run Faster p. 67)
  return {
    ...accumulated,
    activeSkills: capValues(accumulated.activeSkills, LIFE_MODULES_MAX_ACTIVE_SKILL),
    knowledgeSkills: capValues(accumulated.knowledgeSkills, LIFE_MODULES_MAX_KNOWLEDGE_SKILL),
  };
}
