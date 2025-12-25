/**
 * Character rules module
 *
 * Exports character lifecycle and state management functionality.
 */

export {
  // Types
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type TransitionValidator,
  type StateTransition,
  type TransitionResult,
  type TransitionContext,
  // Constants
  VALID_TRANSITIONS,
  // Validation
  validateCharacterComplete,
  findTransition,
  isValidTransition,
  canActorPerformTransition,
  // Transition execution
  canTransition,
  executeTransition,
  // Audit helpers
  createAuditEntry,
  appendAuditEntry,
  // Role helpers
  determineActorRole,
} from "./state-machine";
