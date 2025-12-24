/**
 * Optional Rules System
 *
 * Provides governance for optional rules that can be activated or
 * deactivated at the campaign level by the GM.
 *
 * Satisfies Ruleset Integrity Capability:
 * - "The system MUST support 'optional rules' defined within bundles
 *    that can be activated or deactivated by a campaign authority."
 *
 * @see docs/capabilities/ruleset.integrity.md
 * @see docs/decisions/003-ruleset.rule-merging-strategies.md
 */

import type { ID, RuleModuleType } from "../types";
import type { LoadedRuleset } from "./loader-types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * An optional rule that can be toggled on/off at campaign level.
 */
export interface OptionalRule {
  /** Unique identifier for this optional rule */
  id: string;

  /** Display name */
  name: string;

  /** Description of what this rule changes */
  description: string;

  /** The source book that defines this rule */
  sourceBookId: ID;

  /** Whether this rule is enabled by default when the book is active */
  defaultEnabled: boolean;

  /** Which ruleset modules this rule affects */
  affectedModules: RuleModuleType[];

  /** Tags for categorization (e.g., "combat", "magic", "matrix") */
  tags?: string[];
}

/**
 * Campaign-level configuration for optional rules.
 * GM-controlled; players cannot override.
 */
export interface OptionalRulesState {
  /** IDs of rules explicitly enabled (overrides defaultEnabled: false) */
  enabledRuleIds: string[];

  /** IDs of rules explicitly disabled (overrides defaultEnabled: true) */
  disabledRuleIds: string[];
}

/**
 * Result of extracting optional rules from a ruleset.
 */
export interface OptionalRulesExtraction {
  /** All optional rules found in the loaded books */
  allRules: OptionalRule[];

  /** Rules that are active given the current state */
  activeRules: OptionalRule[];

  /** Rules that are inactive given the current state */
  inactiveRules: OptionalRule[];
}

/**
 * Structure for optional rules module payload in book data.
 * This may be defined in a book's payload.modules under a custom key.
 */
interface OptionalRulesPayload {
  rules?: Array<Partial<OptionalRule>>;
}

// =============================================================================
// EXTRACTION
// =============================================================================

/**
 * Extract all optional rules from a loaded ruleset.
 *
 * Scans each book's payload for optional rules data.
 * Note: Optional rules are typically stored in a book's custom metadata
 * or in a dedicated "optionalRules" payload structure.
 *
 * @param ruleset - The loaded ruleset containing book payloads
 * @returns Array of all optional rules found
 */
export function extractOptionalRules(ruleset: LoadedRuleset): OptionalRule[] {
  const rules: OptionalRule[] = [];

  for (const book of ruleset.books) {
    // Access the modules object - check for a custom optionalRules key
    // Since optionalRules isn't a standard RuleModuleType, we check the raw payload
    const modulesPayload = book.payload.modules as Record<string, { payload?: unknown } | undefined>;
    
    // Try to find optional rules in a custom module or in the book's metadata
    const optionalRulesEntry = modulesPayload["optionalRules"] as { payload?: OptionalRulesPayload } | undefined;
    
    if (optionalRulesEntry?.payload?.rules && Array.isArray(optionalRulesEntry.payload.rules)) {
      const bookRules = optionalRulesEntry.payload.rules
        .filter((r): r is OptionalRule =>
          typeof r.id === "string" &&
          typeof r.name === "string" &&
          typeof r.description === "string"
        )
        .map((r) => ({
          ...r,
          sourceBookId: book.id,
          defaultEnabled: r.defaultEnabled ?? true,
          affectedModules: r.affectedModules ?? [],
        }));

      rules.push(...bookRules);
    }
  }

  return rules;
}

// =============================================================================
// RESOLUTION
// =============================================================================

/**
 * Determine which optional rules are active given the campaign's configuration.
 *
 * Resolution logic:
 * 1. Start with each rule's defaultEnabled value
 * 2. If rule ID is in enabledRuleIds, it's active
 * 3. If rule ID is in disabledRuleIds, it's inactive
 * 4. disabledRuleIds takes precedence over enabledRuleIds if both contain the same ID
 *
 * @param allRules - All optional rules extracted from the ruleset
 * @param state - Campaign-level optional rules configuration
 * @returns Extraction result with active and inactive rules
 */
export function resolveOptionalRules(
  allRules: OptionalRule[],
  state: OptionalRulesState | undefined
): OptionalRulesExtraction {
  if (!state) {
    // No campaign configuration - use defaults
    const activeRules = allRules.filter((r) => r.defaultEnabled);
    const inactiveRules = allRules.filter((r) => !r.defaultEnabled);
    return { allRules, activeRules, inactiveRules };
  }

  const { enabledRuleIds, disabledRuleIds } = state;
  const activeRules: OptionalRule[] = [];
  const inactiveRules: OptionalRule[] = [];

  for (const rule of allRules) {
    // Disabled takes precedence
    if (disabledRuleIds.includes(rule.id)) {
      inactiveRules.push(rule);
    } else if (enabledRuleIds.includes(rule.id)) {
      activeRules.push(rule);
    } else if (rule.defaultEnabled) {
      activeRules.push(rule);
    } else {
      inactiveRules.push(rule);
    }
  }

  return { allRules, activeRules, inactiveRules };
}

/**
 * Get active optional rules from a loaded ruleset and campaign state.
 *
 * Convenience function combining extraction and resolution.
 *
 * @param ruleset - The loaded ruleset
 * @param campaignOptionalState - Campaign's optional rules configuration
 * @returns Array of currently active optional rules
 */
export function getActiveOptionalRules(
  ruleset: LoadedRuleset,
  campaignOptionalState: OptionalRulesState | undefined
): OptionalRule[] {
  const allRules = extractOptionalRules(ruleset);
  const { activeRules } = resolveOptionalRules(allRules, campaignOptionalState);
  return activeRules;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Check if a specific optional rule is active.
 *
 * @param ruleId - The ID of the optional rule to check
 * @param allRules - All optional rules from the ruleset
 * @param state - Campaign's optional rules configuration
 * @returns true if the rule is active, false otherwise
 */
export function isOptionalRuleActive(
  ruleId: string,
  allRules: OptionalRule[],
  state: OptionalRulesState | undefined
): boolean {
  const { activeRules } = resolveOptionalRules(allRules, state);
  return activeRules.some((r) => r.id === ruleId);
}

/**
 * Validate that content requiring a specific optional rule is accessible.
 *
 * @param requiredRuleId - The optional rule ID that must be active
 * @param allRules - All optional rules from the ruleset
 * @param state - Campaign's optional rules configuration
 * @returns Error message if rule is inactive, null if accessible
 */
export function validateOptionalRuleAccess(
  requiredRuleId: string,
  allRules: OptionalRule[],
  state: OptionalRulesState | undefined
): string | null {
  const rule = allRules.find((r) => r.id === requiredRuleId);

  if (!rule) {
    return `Optional rule '${requiredRuleId}' not found in ruleset`;
  }

  if (!isOptionalRuleActive(requiredRuleId, allRules, state)) {
    return `Optional rule '${rule.name}' is disabled in this campaign`;
  }

  return null;
}

// =============================================================================
// DEFAULTS
// =============================================================================

/**
 * Create an empty optional rules state.
 */
export function createEmptyOptionalRulesState(): OptionalRulesState {
  return {
    enabledRuleIds: [],
    disabledRuleIds: [],
  };
}

/**
 * Create an optional rules state with all defaults.
 *
 * @param allRules - All optional rules to base defaults on
 * @returns State that matches the default enabled state of all rules
 */
export function createDefaultOptionalRulesState(
  // Parameter kept for API consistency - allows future enhancement
  // to pre-populate state based on rule defaults
  allRules: OptionalRule[]
): OptionalRulesState {
  // Empty state means "use defaults" - no explicit overrides needed
  // The allRules parameter is available for future customization
  void allRules;
  return createEmptyOptionalRulesState();
}

// =============================================================================
// MUTATION HELPERS
// =============================================================================

/**
 * Enable an optional rule in the state.
 *
 * @param state - Current state
 * @param ruleId - ID of rule to enable
 * @returns New state with rule enabled
 */
export function enableOptionalRule(
  state: OptionalRulesState,
  ruleId: string
): OptionalRulesState {
  return {
    enabledRuleIds: state.enabledRuleIds.includes(ruleId)
      ? state.enabledRuleIds
      : [...state.enabledRuleIds, ruleId],
    disabledRuleIds: state.disabledRuleIds.filter((id) => id !== ruleId),
  };
}

/**
 * Disable an optional rule in the state.
 *
 * @param state - Current state
 * @param ruleId - ID of rule to disable
 * @returns New state with rule disabled
 */
export function disableOptionalRule(
  state: OptionalRulesState,
  ruleId: string
): OptionalRulesState {
  return {
    enabledRuleIds: state.enabledRuleIds.filter((id) => id !== ruleId),
    disabledRuleIds: state.disabledRuleIds.includes(ruleId)
      ? state.disabledRuleIds
      : [...state.disabledRuleIds, ruleId],
  };
}

/**
 * Reset an optional rule to its default state.
 *
 * @param state - Current state
 * @param ruleId - ID of rule to reset
 * @returns New state with rule reset to default
 */
export function resetOptionalRule(
  state: OptionalRulesState,
  ruleId: string
): OptionalRulesState {
  return {
    enabledRuleIds: state.enabledRuleIds.filter((id) => id !== ruleId),
    disabledRuleIds: state.disabledRuleIds.filter((id) => id !== ruleId),
  };
}
