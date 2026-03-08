/**
 * Combat Module
 *
 * Exports combat session management and related utilities.
 */

export {
  CombatSessionProvider,
  useCombatSession,
  useActionEconomy,
  useCanPerformAction,
  useCurrentTurnParticipant,
  type CombatSessionState,
  type CombatSessionActions,
  type CombatSessionContextValue,
} from "./CombatSessionContext";

export {
  useCombatReadiness,
  type ReadinessChangeCheck,
  type CombatReadinessHook,
} from "./useCombatReadiness";
