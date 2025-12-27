/**
 * Combat UI Components
 *
 * A collection of React components for running Shadowrun combat encounters.
 * These components work together with the action resolution system and
 * combat session API to provide a complete combat management interface.
 *
 * Components:
 * - CombatTracker: Initiative order display and turn management
 * - ActionSelector: Categorized action selection with eligibility
 * - OpposedTestResolver: Dice rolling for opposed tests
 * - ConditionMonitor: Health/damage tracking for characters
 */

export { CombatTracker } from "./CombatTracker";
export { ActionSelector } from "./ActionSelector";
export { OpposedTestResolver } from "./OpposedTestResolver";
export { ConditionMonitor, CompactConditionMonitor } from "./ConditionMonitor";
