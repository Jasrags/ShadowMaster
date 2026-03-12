/**
 * Life Modules Prerequisite Checking
 *
 * Per Run Faster pp. 79-84, some career and tour modules require
 * the character to have completed specific prior modules. Prerequisites
 * use OR logic: at least one prerequisite must be satisfied.
 *
 * Pure functions — no side effects, no mutations.
 */

import type {
  LifeModule,
  LifeModulesCatalog,
  LifeModuleSelection,
  LifeModulePhase,
} from "@/lib/types/life-modules";

// =============================================================================
// PHASE ALIASES
// =============================================================================

/**
 * Phase alias IDs that match any module in a given phase.
 * For example, "tour-of-duty" in a prerequisite list means "any tour module."
 */
const PHASE_ALIASES: Readonly<Record<string, LifeModulePhase>> = {
  "tour-of-duty": "tour",
};

// =============================================================================
// RESULT TYPE
// =============================================================================

/**
 * Result of checking a module's prerequisites against existing selections.
 */
export interface PrerequisiteResult {
  /** Whether all prerequisites are satisfied (OR logic: at least one must match) */
  readonly met: boolean;

  /** Prerequisite IDs that were not matched (empty when met=true) */
  readonly missingPrerequisiteIds: readonly string[];
}

// =============================================================================
// PREREQUISITE CHECKING
// =============================================================================

/**
 * Collect all module and sub-module IDs from existing selections.
 */
function collectSelectedIds(selections: readonly LifeModuleSelection[]): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const selection of selections) {
    ids.add(selection.moduleId);
    if (selection.subModuleId) {
      ids.add(selection.subModuleId);
    }
  }
  return ids;
}

/**
 * Check whether a phase alias prerequisite is satisfied by any selection in that phase.
 */
function isPhaseAliasMet(
  aliasPhase: LifeModulePhase,
  selections: readonly LifeModuleSelection[]
): boolean {
  return selections.some((s) => s.phase === aliasPhase);
}

/**
 * Check whether a module's prerequisites are met by existing selections.
 *
 * Prerequisites use OR logic: the module is available if ANY ONE of its
 * prerequisite IDs matches a selected module ID, sub-module ID, or phase alias.
 *
 * @param module - The module (or sub-module) to check
 * @param existingSelections - Already-selected modules from creation state
 * @param _catalog - The life modules catalog (reserved for future use)
 * @returns Whether prerequisites are met and which are missing
 */
export function checkPrerequisites(
  module: LifeModule,
  existingSelections: readonly LifeModuleSelection[],
  _catalog: LifeModulesCatalog
): PrerequisiteResult {
  const prerequisites = module.prerequisites;

  // No prerequisites → always met
  if (!prerequisites || prerequisites.length === 0) {
    return { met: true, missingPrerequisiteIds: [] };
  }

  const selectedIds = collectSelectedIds(existingSelections);

  // Check each prerequisite: if ANY is satisfied, the module is available
  for (const prereqId of prerequisites) {
    // Check direct ID match (module or sub-module)
    if (selectedIds.has(prereqId)) {
      return { met: true, missingPrerequisiteIds: [] };
    }

    // Check phase alias (e.g., "tour-of-duty" matches any tour)
    const aliasPhase = PHASE_ALIASES[prereqId];
    if (aliasPhase && isPhaseAliasMet(aliasPhase, existingSelections)) {
      return { met: true, missingPrerequisiteIds: [] };
    }
  }

  // None matched → return all as missing
  return {
    met: false,
    missingPrerequisiteIds: prerequisites,
  };
}

// =============================================================================
// DISPLAY HELPERS
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
 * Look up a module's display name by ID in the catalog.
 * Searches both top-level modules and sub-modules.
 */
function findModuleName(moduleId: string, catalog: LifeModulesCatalog): string | undefined {
  for (const phase of PHASE_KEYS) {
    const modules = catalog[phase];
    if (!modules) continue;

    for (const mod of modules) {
      if (mod.id === moduleId) return mod.name;
      if (mod.subModules) {
        for (const sub of mod.subModules) {
          if (sub.id === moduleId) return sub.name;
        }
      }
    }
  }
  return undefined;
}

/** Human-readable labels for phase aliases */
const PHASE_ALIAS_LABELS: Readonly<Record<string, string>> = {
  "tour-of-duty": "Any Tour of Duty",
};

/**
 * Convert unmet prerequisite IDs to human-readable names for display.
 *
 * @param result - The prerequisite check result
 * @param catalog - The life modules catalog for name lookups
 * @returns Array of human-readable prerequisite names
 */
export function getUnmetPrerequisiteNames(
  result: PrerequisiteResult,
  catalog: LifeModulesCatalog
): readonly string[] {
  if (result.met) return [];

  return result.missingPrerequisiteIds.map((id) => {
    // Check phase alias label first
    const aliasLabel = PHASE_ALIAS_LABELS[id];
    if (aliasLabel) return aliasLabel;

    // Look up in catalog
    const name = findModuleName(id, catalog);
    return name ?? id;
  });
}
