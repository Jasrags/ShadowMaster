/**
 * Drift Analyzer
 *
 * Analyzes character drift from ruleset changes. Compares a character's
 * locked ruleset snapshot against the current ruleset to detect changes
 * that may affect the character's legality or mechanics.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-004 (Hybrid Snapshot Model)
 */

import { v4 as uuidv4 } from "uuid";
import type {
  Character,
  MergedRuleset,
  DriftReport,
  DriftChange,
  DriftChangeType,
  DriftSeverity,
  AffectedItem,
  RuleModuleType,
  MetatypeSnapshot,
  SkillDefinitionSnapshot,
  QualityDefinitionSnapshot,
  RulesetVersionRef,
  MigrationRecommendation,
  MigrationStrategy,
} from "@/lib/types";
import { getRulesetSnapshot, getCurrentSnapshot } from "@/lib/storage/ruleset-snapshots";
import type { SnapshotCache } from "@/lib/storage/snapshot-cache";

// =============================================================================
// MAIN DRIFT ANALYSIS
// =============================================================================

/**
 * Main drift analysis entry point
 *
 * Analyzes a character to detect drift between its locked ruleset
 * and the current ruleset version.
 *
 * @param character - The character to analyze
 * @param cache - Optional request-scoped cache to avoid redundant disk reads
 * @returns A drift report detailing all changes
 */
export async function analyzeCharacterDrift(
  character: Character,
  cache?: SnapshotCache
): Promise<DriftReport> {
  const changes: DriftChange[] = [];

  // Use cache methods if available, otherwise fall back to direct functions
  const getCurrentSnapshotFn = cache
    ? (code: string) => cache.getCurrentSnapshot(code as Parameters<typeof getCurrentSnapshot>[0])
    : getCurrentSnapshot;
  const getRulesetSnapshotFn = cache
    ? (id: string) => cache.getRulesetSnapshot(id)
    : getRulesetSnapshot;

  // OPTIMIZATION: Get current version ref first (just metadata, not full snapshot)
  // This allows early exit before loading any large snapshot files
  const currentVersionRef = await getCurrentSnapshotFn(character.editionCode);
  if (!currentVersionRef) {
    // No snapshots exist yet for this edition - return empty report
    // This is expected for characters created before the snapshot system
    return createEmptyDriftReportNoBaseline(character);
  }

  // EARLY EXIT: If character is already on the current snapshot, no drift possible
  if (character.rulesetSnapshotId === currentVersionRef.snapshotId) {
    return createEmptyDriftReport(character, currentVersionRef);
  }

  // Only load full snapshots if we need to compare them
  const characterSnapshot = await getRulesetSnapshotFn(character.rulesetSnapshotId);
  if (!characterSnapshot) {
    // Character's snapshot doesn't exist - return empty report
    // This is expected for characters created before the snapshot system
    return createEmptyDriftReportNoBaseline(character);
  }

  const currentRuleset = await getRulesetSnapshotFn(currentVersionRef.snapshotId);
  if (!currentRuleset) {
    throw new Error(`Current ruleset snapshot not found: ${currentVersionRef.snapshotId}`);
  }

  // Analyze drift in each module if character has a mechanical snapshot
  if (character.mechanicalSnapshot) {
    // Metatype drift
    const metatypeDrift = analyzeMetatypeDrift(
      character.mechanicalSnapshot.metatype,
      currentRuleset
    );
    changes.push(...metatypeDrift);

    // Skill drift
    const skillDrift = analyzeSkillDrift(
      character.skills,
      character.mechanicalSnapshot.skillDefinitions,
      currentRuleset
    );
    changes.push(...skillDrift);

    // Quality drift - extract quality IDs
    const allQualities = [
      ...(character.positiveQualities || []),
      ...(character.negativeQualities || []),
    ].map((q) => ({ id: q.qualityId, name: q.qualityId }));

    const qualityDrift = analyzeQualityDrift(
      allQualities,
      character.mechanicalSnapshot.qualityDefinitions,
      currentRuleset
    );
    changes.push(...qualityDrift);
  }

  // Also compare the raw rulesets for module-level changes
  const moduleChanges = compareRulesetModules(characterSnapshot, currentRuleset);
  changes.push(...moduleChanges);

  // Deduplicate changes by ID
  const uniqueChanges = deduplicateChanges(changes);

  // Classify overall severity
  const overallSeverity = classifyDriftSeverity(uniqueChanges);

  // Generate recommendations
  const recommendations = generateMigrationRecommendations(uniqueChanges);

  // Get version refs
  const characterVersionRef = character.rulesetVersion || {
    editionCode: character.editionCode,
    editionVersion: "1.0.0",
    bookVersions: {},
    snapshotId: character.rulesetSnapshotId,
    createdAt: character.createdAt,
  };

  return {
    id: uuidv4(),
    characterId: character.id,
    generatedAt: new Date().toISOString(),
    currentVersion: characterVersionRef,
    targetVersion: currentVersionRef,
    overallSeverity,
    changes: uniqueChanges,
    recommendations,
  };
}

// =============================================================================
// MODULE-SPECIFIC DRIFT ANALYZERS
// =============================================================================

/**
 * Analyze metatype drift
 *
 * Checks if the character's metatype has changed in the current ruleset.
 */
export function analyzeMetatypeDrift(
  characterSnapshot: MetatypeSnapshot,
  currentRuleset: MergedRuleset
): DriftChange[] {
  const changes: DriftChange[] = [];
  const metatypes = currentRuleset.modules.metatypes;

  if (!metatypes || !characterSnapshot) {
    return changes;
  }

  // Find the current metatype definition
  const currentMetatype = Object.values(metatypes).find(
    (m: unknown) => (m as { id: string }).id === characterSnapshot.id
  ) as
    | {
        id: string;
        attributeModifiers?: Record<string, number>;
        specialAbilities?: string[];
        racialQualities?: string[];
      }
    | undefined;

  if (!currentMetatype) {
    // Metatype was removed!
    changes.push(
      createDriftChange({
        module: "metatypes",
        changeType: "removed",
        severity: "breaking",
        itemId: characterSnapshot.id,
        itemType: "metatypes",
        previousValue: characterSnapshot,
        currentValue: null,
        description: `Metatype '${characterSnapshot.id}' has been removed from the ruleset`,
      })
    );
    return changes;
  }

  // Check attribute modifiers
  if (characterSnapshot.attributeModifiers && currentMetatype.attributeModifiers) {
    const modifierChanges = compareRecords(
      characterSnapshot.attributeModifiers,
      currentMetatype.attributeModifiers
    );

    for (const [attr, { previous, current }] of Object.entries(modifierChanges)) {
      if (previous !== undefined && current !== undefined) {
        const isDecrease = current < previous;
        changes.push(
          createDriftChange({
            module: "metatypes",
            changeType: "modified",
            severity: isDecrease ? "breaking" : "non-breaking",
            itemId: characterSnapshot.id,
            itemType: "metatypes",
            previousValue: { [attr]: previous },
            currentValue: { [attr]: current },
            description: `Metatype attribute modifier for ${attr} ${isDecrease ? "decreased" : "increased"} from ${previous} to ${current}`,
          })
        );
      }
    }
  }

  // Check special abilities
  if (characterSnapshot.specialAbilities && currentMetatype.specialAbilities) {
    const removedAbilities = characterSnapshot.specialAbilities.filter(
      (a) => !currentMetatype.specialAbilities?.includes(a)
    );
    const addedAbilities = currentMetatype.specialAbilities.filter(
      (a) => !characterSnapshot.specialAbilities?.includes(a)
    );

    for (const ability of removedAbilities) {
      changes.push(
        createDriftChange({
          module: "metatypes",
          changeType: "removed",
          severity: "breaking",
          itemId: characterSnapshot.id,
          itemType: "metatypes",
          previousValue: ability,
          currentValue: null,
          description: `Special ability '${ability}' removed from metatype`,
        })
      );
    }

    for (const ability of addedAbilities) {
      changes.push(
        createDriftChange({
          module: "metatypes",
          changeType: "added",
          severity: "non-breaking",
          itemId: characterSnapshot.id,
          itemType: "metatypes",
          previousValue: null,
          currentValue: ability,
          description: `New special ability '${ability}' added to metatype`,
        })
      );
    }
  }

  return changes;
}

/**
 * Analyze skill drift
 *
 * Checks if the character's skills have changed in the current ruleset.
 */
export function analyzeSkillDrift(
  characterSkills: Record<string, number>,
  characterSnapshot: SkillDefinitionSnapshot | undefined,
  currentRuleset: MergedRuleset
): DriftChange[] {
  const changes: DriftChange[] = [];
  const currentSkills = currentRuleset.modules.skills;

  if (!currentSkills || !characterSnapshot) {
    return changes;
  }

  // Check each skill the character has
  for (const [skillId, rating] of Object.entries(characterSkills)) {
    if (rating <= 0) continue;

    const snapshotSkill = characterSnapshot.skills?.[skillId];
    const currentSkill = (currentSkills as Record<string, unknown>)[skillId] as
      | {
          id: string;
          name: string;
          attribute?: string;
          group?: string;
          maxRating?: number;
        }
      | undefined;

    if (!currentSkill && snapshotSkill) {
      // Skill was removed
      changes.push(
        createDriftChange({
          module: "skills",
          changeType: "removed",
          severity: "breaking",
          itemId: skillId,
          itemType: "skills",
          previousValue: snapshotSkill,
          currentValue: null,
          description: `Skill '${snapshotSkill.name || skillId}' has been removed from the ruleset`,
        })
      );
      continue;
    }

    if (currentSkill && snapshotSkill) {
      // Check for modifications
      if (currentSkill.attribute !== snapshotSkill.attribute) {
        changes.push(
          createDriftChange({
            module: "skills",
            changeType: "modified",
            severity: "breaking",
            itemId: skillId,
            itemType: "skills",
            previousValue: { attribute: snapshotSkill.attribute },
            currentValue: { attribute: currentSkill.attribute },
            description: `Skill '${skillId}' linked attribute changed from ${snapshotSkill.attribute} to ${currentSkill.attribute}`,
          })
        );
      }

      if (currentSkill.group !== snapshotSkill.group) {
        changes.push(
          createDriftChange({
            module: "skills",
            changeType: "modified",
            severity: "non-breaking",
            itemId: skillId,
            itemType: "skills",
            previousValue: { group: snapshotSkill.group },
            currentValue: { group: currentSkill.group },
            description: `Skill '${skillId}' group changed from ${snapshotSkill.group} to ${currentSkill.group}`,
          })
        );
      }

      // Check max rating
      const prevMax = snapshotSkill.maxRating;
      const currMax = currentSkill.maxRating;
      if (prevMax !== undefined && currMax !== undefined && prevMax !== currMax) {
        const isDecrease = currMax < prevMax;
        // Breaking if rating exceeds new max
        const isBreakingForCharacter = isDecrease && rating > currMax;
        changes.push(
          createDriftChange({
            module: "skills",
            changeType: "modified",
            severity: isBreakingForCharacter ? "breaking" : "non-breaking",
            itemId: skillId,
            itemType: "skills",
            previousValue: { maxRating: prevMax },
            currentValue: { maxRating: currMax },
            description: `Skill '${skillId}' max rating ${isDecrease ? "decreased" : "increased"} from ${prevMax} to ${currMax}`,
          })
        );
      }
    }
  }

  return changes;
}

/**
 * Analyze quality drift
 *
 * Checks if the character's qualities have changed in the current ruleset.
 */
export function analyzeQualityDrift(
  characterQualities: Array<{ id: string; name?: string }>,
  characterSnapshot: QualityDefinitionSnapshot | undefined,
  currentRuleset: MergedRuleset
): DriftChange[] {
  const changes: DriftChange[] = [];
  const currentQualities = currentRuleset.modules.qualities;

  if (!currentQualities || !characterSnapshot) {
    return changes;
  }

  // Check each quality the character has
  for (const quality of characterQualities) {
    const qualityId = quality.id;
    const snapshotQuality = characterSnapshot.qualities?.[qualityId];
    const currentQuality = (currentQualities as Record<string, unknown>)[qualityId] as
      | {
          id: string;
          name: string;
          karmaCost?: number;
          effects?: unknown;
        }
      | undefined;

    if (!currentQuality && snapshotQuality) {
      // Quality was removed
      changes.push(
        createDriftChange({
          module: "qualities",
          changeType: "removed",
          severity: "breaking",
          itemId: qualityId,
          itemType: "qualities",
          previousValue: snapshotQuality,
          currentValue: null,
          description: `Quality '${snapshotQuality.name || qualityId}' has been removed from the ruleset`,
        })
      );
      continue;
    }

    if (currentQuality && snapshotQuality) {
      // Check for karma cost changes
      if (currentQuality.karmaCost !== snapshotQuality.karmaCost) {
        changes.push(
          createDriftChange({
            module: "qualities",
            changeType: "modified",
            severity: "non-breaking", // Cost changes don't affect existing characters
            itemId: qualityId,
            itemType: "qualities",
            previousValue: { karmaCost: snapshotQuality.karmaCost },
            currentValue: { karmaCost: currentQuality.karmaCost },
            description: `Quality '${qualityId}' karma cost changed from ${snapshotQuality.karmaCost} to ${currentQuality.karmaCost}`,
          })
        );
      }

      // Check for effect changes (deep comparison)
      if (!deepEqual(currentQuality.effects, snapshotQuality.effects)) {
        changes.push(
          createDriftChange({
            module: "qualities",
            changeType: "modified",
            severity: "breaking",
            itemId: qualityId,
            itemType: "qualities",
            previousValue: { effects: snapshotQuality.effects },
            currentValue: { effects: currentQuality.effects },
            description: `Quality '${qualityId}' effects have been modified`,
          })
        );
      }
    }
  }

  return changes;
}

// =============================================================================
// SEVERITY CLASSIFICATION
// =============================================================================

/**
 * Classify the overall drift severity from a list of changes
 */
export function classifyDriftSeverity(changes: DriftChange[]): DriftSeverity {
  if (changes.length === 0) {
    return "none";
  }

  const hasBreaking = changes.some((c) => c.severity === "breaking");
  return hasBreaking ? "breaking" : "non-breaking";
}

/**
 * Determine if a change type is auto-resolvable
 */
export function isAutoResolvable(change: DriftChange): boolean {
  // Non-breaking changes are typically auto-resolvable
  if (change.severity === "non-breaking") {
    return true;
  }

  // Additions are always auto-resolvable (no action needed)
  if (change.changeType === "added") {
    return true;
  }

  // Favorable mechanical increases are auto-resolvable
  if (change.changeType === "modified") {
    // Check if this is a favorable change
    // (e.g., increased values, new abilities, etc.)
    // For now, treat all modified breaking changes as not auto-resolvable
    return false;
  }

  // Removals, renames, restructures require user intervention
  return false;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Compare two ruleset modules for changes
 */
function compareRulesetModules(
  baseRuleset: MergedRuleset,
  targetRuleset: MergedRuleset
): DriftChange[] {
  const changes: DriftChange[] = [];
  const moduleTypes = new Set([
    ...Object.keys(baseRuleset.modules),
    ...Object.keys(targetRuleset.modules),
  ]) as Set<RuleModuleType>;

  for (const moduleType of moduleTypes) {
    const baseModule = baseRuleset.modules[moduleType] || {};
    const targetModule = targetRuleset.modules[moduleType] || {};

    const baseKeys = Object.keys(baseModule);
    const targetKeys = Object.keys(targetModule);

    // Check for removed items
    for (const key of baseKeys) {
      if (!targetKeys.includes(key)) {
        changes.push(
          createDriftChange({
            module: moduleType,
            changeType: "removed",
            severity: "breaking",
            itemId: key,
            itemType: moduleType,
            previousValue: (baseModule as Record<string, unknown>)[key],
            currentValue: null,
            description: `${moduleType} item '${key}' has been removed`,
          })
        );
      }
    }

    // Check for added items
    for (const key of targetKeys) {
      if (!baseKeys.includes(key)) {
        changes.push(
          createDriftChange({
            module: moduleType,
            changeType: "added",
            severity: "non-breaking",
            itemId: key,
            itemType: moduleType,
            previousValue: null,
            currentValue: (targetModule as Record<string, unknown>)[key],
            description: `New ${moduleType} item '${key}' has been added`,
          })
        );
      }
    }
  }

  return changes;
}

/**
 * Compare two records and return the differences
 */
function compareRecords<T>(
  base: Record<string, T>,
  target: Record<string, T>
): Record<string, { previous?: T; current?: T }> {
  const diff: Record<string, { previous?: T; current?: T }> = {};
  const allKeys = new Set([...Object.keys(base), ...Object.keys(target)]);

  for (const key of allKeys) {
    if (base[key] !== target[key]) {
      diff[key] = { previous: base[key], current: target[key] };
    }
  }

  return diff;
}

interface DriftChangeOptions {
  module: RuleModuleType;
  changeType: DriftChangeType;
  severity: DriftSeverity;
  itemId: string;
  itemType: RuleModuleType;
  previousValue: unknown;
  currentValue: unknown;
  description: string;
}

/**
 * Create a drift change entry
 */
function createDriftChange(options: DriftChangeOptions): DriftChange {
  const affectedItems: AffectedItem[] = [
    {
      itemId: options.itemId,
      itemType: options.itemType,
      previousValue: options.previousValue,
      currentValue: options.currentValue,
    },
  ];

  return {
    id: uuidv4(),
    module: options.module,
    changeType: options.changeType,
    severity: options.severity,
    affectedItems,
    description: options.description,
  };
}

/**
 * Create an empty drift report (no changes detected)
 */
function createEmptyDriftReport(
  character: Character,
  currentVersionRef: RulesetVersionRef
): DriftReport {
  const characterVersionRef = character.rulesetVersion || {
    editionCode: character.editionCode,
    editionVersion: "1.0.0",
    bookVersions: {},
    snapshotId: character.rulesetSnapshotId,
    createdAt: character.createdAt,
  };

  return {
    id: uuidv4(),
    characterId: character.id,
    generatedAt: new Date().toISOString(),
    currentVersion: characterVersionRef,
    targetVersion: currentVersionRef,
    overallSeverity: "none",
    changes: [],
    recommendations: [],
  };
}

/**
 * Create an empty drift report when no baseline snapshot exists
 *
 * Used for characters created before the snapshot system was implemented,
 * or when no snapshots have been captured for an edition yet.
 */
function createEmptyDriftReportNoBaseline(character: Character): DriftReport {
  const characterVersionRef = character.rulesetVersion || {
    editionCode: character.editionCode,
    editionVersion: "1.0.0",
    bookVersions: {},
    snapshotId: character.rulesetSnapshotId,
    createdAt: character.createdAt,
  };

  return {
    id: uuidv4(),
    characterId: character.id,
    generatedAt: new Date().toISOString(),
    currentVersion: characterVersionRef,
    targetVersion: characterVersionRef, // Same as current since no baseline exists
    overallSeverity: "none",
    changes: [],
    recommendations: [],
  };
}

/**
 * Remove duplicate changes based on ID
 */
function deduplicateChanges(changes: DriftChange[]): DriftChange[] {
  const seen = new Set<string>();
  return changes.filter((change) => {
    // Create a unique key based on module, type, and item
    const key = `${change.module}-${change.changeType}-${change.affectedItems[0]?.itemId}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Generate migration recommendations from changes
 */
function generateMigrationRecommendations(changes: DriftChange[]): MigrationRecommendation[] {
  return changes.map((change) => {
    const strategy = determineStrategy(change);
    const autoApplicable = isAutoResolvable(change);
    const requiresUserChoice = !autoApplicable;

    return {
      changeId: change.id,
      strategy,
      description: generateRecommendationDescription(change, strategy),
      autoApplicable,
      requiresUserChoice,
    };
  });
}

/**
 * Determine the migration strategy for a change
 */
function determineStrategy(change: DriftChange): MigrationStrategy {
  switch (change.changeType) {
    case "added":
      return "auto-update";

    case "removed":
      return "manual-select";

    case "renamed":
      return "manual-select";

    case "modified":
      return change.severity === "breaking" ? "manual-select" : "auto-update";

    case "deprecated":
      return "auto-update";

    case "restructured":
      return "manual-select";

    default:
      return "auto-update";
  }
}

/**
 * Generate description for a migration recommendation
 */
function generateRecommendationDescription(
  change: DriftChange,
  strategy: MigrationStrategy
): string {
  switch (strategy) {
    case "auto-update":
      return `This change can be applied automatically: ${change.description}`;
    case "manual-select":
      return `User action required: ${change.description}`;
    case "archive":
      return `This item will be moved to legacy storage: ${change.description}`;
    case "remove":
      return `This item will be removed: ${change.description}`;
    default:
      return change.description;
  }
}

/**
 * Deep equality check for objects
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!deepEqual(aObj[key], bObj[key])) return false;
    }
    return true;
  }

  return false;
}
