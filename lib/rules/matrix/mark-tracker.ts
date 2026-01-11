/**
 * Matrix Mark Tracker
 *
 * Manages matrix marks (authorization levels) for personas.
 * In SR5, marks represent authorization on a target:
 * - 1 mark = User access
 * - 2 marks = Security access
 * - 3 marks = Admin access (maximum)
 *
 * Marks are ephemeral and reset when the decker jacks out or
 * the target reboots.
 */

import type { ID, ISODateString } from "@/lib/types";
import type {
  MatrixMark,
  MatrixState,
  MarkTargetType,
  MatrixValidationError,
} from "@/lib/types/matrix";
import { MAX_MARKS } from "@/lib/types/matrix";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of placing a mark
 */
export interface MarkPlacementResult {
  /** Whether the mark was successfully placed */
  success: boolean;
  /** The mark that was placed/updated */
  mark: MatrixMark | null;
  /** Errors preventing placement */
  errors: MatrixValidationError[];
  /** New total mark count on this target */
  newMarkCount: number;
}

/**
 * Result of removing marks
 */
export interface MarkRemovalResult {
  /** Whether any marks were removed */
  success: boolean;
  /** Number of marks removed */
  marksRemoved: number;
  /** Remaining mark count on target */
  remainingMarks: number;
}

/**
 * Options for placing marks
 */
export interface PlaceMarkOptions {
  /** Optional expiration time */
  expiresAt?: ISODateString;
  /** Whether to silently cap at MAX_MARKS instead of erroring */
  silentCap?: boolean;
}

// =============================================================================
// MARK ID GENERATION
// =============================================================================

/**
 * Generate a unique mark ID
 */
function generateMarkId(): string {
  return `mark-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// =============================================================================
// MARK QUERIES
// =============================================================================

/**
 * Find a mark on a specific target
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @returns The mark if found, null otherwise
 */
export function findMark(matrixState: MatrixState, targetId: string): MatrixMark | null {
  return matrixState.marksHeld.find((m) => m.targetId === targetId) ?? null;
}

/**
 * Get the number of marks on a target
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @returns Number of marks (0-3)
 */
export function getMarksOnTarget(matrixState: MatrixState, targetId: string): number {
  const mark = findMark(matrixState, targetId);
  return mark?.markCount ?? 0;
}

/**
 * Check if sufficient marks exist for an action
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @param requiredMarks - Marks needed
 * @returns True if enough marks exist
 */
export function hasRequiredMarks(
  matrixState: MatrixState,
  targetId: string,
  requiredMarks: number
): boolean {
  if (requiredMarks <= 0) return true;
  return getMarksOnTarget(matrixState, targetId) >= requiredMarks;
}

/**
 * Get all marks held by the persona
 *
 * @param matrixState - Current matrix state
 * @returns Array of all marks
 */
export function getAllMarks(matrixState: MatrixState): MatrixMark[] {
  return [...matrixState.marksHeld];
}

/**
 * Get marks by target type
 *
 * @param matrixState - Current matrix state
 * @param targetType - Type of target to filter by
 * @returns Marks on targets of that type
 */
export function getMarksByType(matrixState: MatrixState, targetType: MarkTargetType): MatrixMark[] {
  return matrixState.marksHeld.filter((m) => m.targetType === targetType);
}

/**
 * Count total marks held
 *
 * @param matrixState - Current matrix state
 * @returns Total number of mark instances
 */
export function countTotalMarks(matrixState: MatrixState): number {
  return matrixState.marksHeld.reduce((sum, m) => sum + m.markCount, 0);
}

// =============================================================================
// MARK PLACEMENT
// =============================================================================

/**
 * Place a mark on a target
 *
 * If the persona already has marks on this target, this increments
 * the mark count (up to MAX_MARKS).
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @param targetType - Type of target
 * @param targetName - Display name of target
 * @param options - Placement options
 * @returns Updated matrix state and placement result
 */
export function placeMark(
  matrixState: MatrixState,
  targetId: string,
  targetType: MarkTargetType,
  targetName: string,
  options: PlaceMarkOptions = {}
): { state: MatrixState; result: MarkPlacementResult } {
  const errors: MatrixValidationError[] = [];

  // Check if we already have a mark on this target
  const existingMark = findMark(matrixState, targetId);

  if (existingMark) {
    // Check if at max
    if (existingMark.markCount >= MAX_MARKS) {
      if (options.silentCap) {
        return {
          state: matrixState,
          result: {
            success: true,
            mark: existingMark,
            errors: [],
            newMarkCount: MAX_MARKS,
          },
        };
      }

      errors.push({
        code: "MAX_MARKS_REACHED",
        message: `Already have maximum marks (${MAX_MARKS}) on ${targetName}.`,
      });

      return {
        state: matrixState,
        result: {
          success: false,
          mark: existingMark,
          errors,
          newMarkCount: existingMark.markCount,
        },
      };
    }

    // Increment existing mark
    const updatedMark: MatrixMark = {
      ...existingMark,
      markCount: existingMark.markCount + 1,
    };

    const updatedMarks = matrixState.marksHeld.map((m) =>
      m.id === existingMark.id ? updatedMark : m
    );

    return {
      state: {
        ...matrixState,
        marksHeld: updatedMarks,
      },
      result: {
        success: true,
        mark: updatedMark,
        errors: [],
        newMarkCount: updatedMark.markCount,
      },
    };
  }

  // Create new mark
  const newMark: MatrixMark = {
    id: generateMarkId(),
    targetId,
    targetType,
    targetName,
    markCount: 1,
    placedAt: new Date().toISOString() as ISODateString,
    expiresAt: options.expiresAt,
  };

  return {
    state: {
      ...matrixState,
      marksHeld: [...matrixState.marksHeld, newMark],
    },
    result: {
      success: true,
      mark: newMark,
      errors: [],
      newMarkCount: 1,
    },
  };
}

/**
 * Place multiple marks at once (e.g., from Brute Force success)
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @param targetType - Type of target
 * @param targetName - Display name of target
 * @param markCount - Number of marks to place
 * @param options - Placement options
 * @returns Updated matrix state and placement result
 */
export function placeMarks(
  matrixState: MatrixState,
  targetId: string,
  targetType: MarkTargetType,
  targetName: string,
  markCount: number,
  options: PlaceMarkOptions = {}
): { state: MatrixState; result: MarkPlacementResult } {
  let currentState = matrixState;
  let lastResult: MarkPlacementResult = {
    success: false,
    mark: null,
    errors: [],
    newMarkCount: 0,
  };

  // Place marks one at a time (respects MAX_MARKS)
  for (let i = 0; i < markCount; i++) {
    const { state, result } = placeMark(currentState, targetId, targetType, targetName, {
      ...options,
      silentCap: true,
    });
    currentState = state;
    lastResult = result;

    // Stop if we hit the cap
    if (lastResult.newMarkCount >= MAX_MARKS) {
      break;
    }
  }

  return { state: currentState, result: lastResult };
}

// =============================================================================
// MARK REMOVAL
// =============================================================================

/**
 * Remove marks from a target
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @param count - Number of marks to remove (undefined = all)
 * @returns Updated matrix state and removal result
 */
export function removeMarks(
  matrixState: MatrixState,
  targetId: string,
  count?: number
): { state: MatrixState; result: MarkRemovalResult } {
  const existingMark = findMark(matrixState, targetId);

  if (!existingMark) {
    return {
      state: matrixState,
      result: {
        success: false,
        marksRemoved: 0,
        remainingMarks: 0,
      },
    };
  }

  // Remove all marks
  if (count === undefined || count >= existingMark.markCount) {
    const updatedMarks = matrixState.marksHeld.filter((m) => m.id !== existingMark.id);

    return {
      state: {
        ...matrixState,
        marksHeld: updatedMarks,
      },
      result: {
        success: true,
        marksRemoved: existingMark.markCount,
        remainingMarks: 0,
      },
    };
  }

  // Remove specific count
  const updatedMark: MatrixMark = {
    ...existingMark,
    markCount: existingMark.markCount - count,
  };

  const updatedMarks = matrixState.marksHeld.map((m) =>
    m.id === existingMark.id ? updatedMark : m
  );

  return {
    state: {
      ...matrixState,
      marksHeld: updatedMarks,
    },
    result: {
      success: true,
      marksRemoved: count,
      remainingMarks: updatedMark.markCount,
    },
  };
}

/**
 * Remove all marks from the persona
 *
 * Used when jacking out or being dumped.
 *
 * @param matrixState - Current matrix state
 * @returns Updated matrix state with no marks
 */
export function clearAllMarks(matrixState: MatrixState): MatrixState {
  return {
    ...matrixState,
    marksHeld: [],
    marksReceived: [],
  };
}

/**
 * Remove expired marks
 *
 * @param matrixState - Current matrix state
 * @param currentTime - Current time for comparison
 * @returns Updated matrix state without expired marks
 */
export function removeExpiredMarks(
  matrixState: MatrixState,
  currentTime: Date = new Date()
): MatrixState {
  const currentTimeStr = currentTime.toISOString();

  const validMarks = matrixState.marksHeld.filter((mark) => {
    if (!mark.expiresAt) return true;
    return mark.expiresAt > currentTimeStr;
  });

  return {
    ...matrixState,
    marksHeld: validMarks,
  };
}

// =============================================================================
// MARKS RECEIVED (from other entities)
// =============================================================================

/**
 * Record a mark placed on this persona by another entity
 *
 * @param matrixState - Current matrix state
 * @param mark - The mark being placed on us
 * @returns Updated matrix state
 */
export function receiveMarkOnSelf(matrixState: MatrixState, mark: MatrixMark): MatrixState {
  // Check if we already have a mark from this entity
  const existingIndex = matrixState.marksReceived.findIndex((m) => m.targetId === mark.targetId);

  if (existingIndex >= 0) {
    // Update existing mark
    const updated = [...matrixState.marksReceived];
    updated[existingIndex] = {
      ...updated[existingIndex],
      markCount: Math.min(updated[existingIndex].markCount + mark.markCount, MAX_MARKS),
    };

    return {
      ...matrixState,
      marksReceived: updated,
    };
  }

  // Add new mark
  return {
    ...matrixState,
    marksReceived: [...matrixState.marksReceived, mark],
  };
}

/**
 * Remove marks placed on this persona
 *
 * @param matrixState - Current matrix state
 * @param markerId - ID of the entity whose marks to remove
 * @returns Updated matrix state
 */
export function removeReceivedMarks(matrixState: MatrixState, markerId: string): MatrixState {
  return {
    ...matrixState,
    marksReceived: matrixState.marksReceived.filter((m) => m.targetId !== markerId),
  };
}

/**
 * Get total marks received on this persona
 *
 * @param matrixState - Current matrix state
 * @returns Total marks others have on us
 */
export function getTotalMarksReceived(matrixState: MatrixState): number {
  return matrixState.marksReceived.reduce((sum, m) => sum + m.markCount, 0);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get authorization level name from mark count
 *
 * @param markCount - Number of marks
 * @returns Human-readable authorization level
 */
export function getAuthorizationLevel(markCount: number): string {
  switch (markCount) {
    case 0:
      return "Outsider";
    case 1:
      return "User";
    case 2:
      return "Security";
    case 3:
      return "Admin";
    default:
      return markCount > 3 ? "Admin" : "Outsider";
  }
}

/**
 * Format marks for display
 *
 * @param matrixState - Current matrix state
 * @returns Array of formatted mark strings
 */
export function formatMarksForDisplay(matrixState: MatrixState): string[] {
  return matrixState.marksHeld.map((mark) => {
    const level = getAuthorizationLevel(mark.markCount);
    return `${mark.targetName}: ${mark.markCount} mark(s) [${level}]`;
  });
}

/**
 * Calculate marks needed for an authorization level
 *
 * @param currentMarks - Current marks on target
 * @param targetLevel - Desired authorization level
 * @returns Number of additional marks needed
 */
export function marksNeededForLevel(
  currentMarks: number,
  targetLevel: "user" | "security" | "admin"
): number {
  const levelRequired = {
    user: 1,
    security: 2,
    admin: 3,
  };

  const needed = levelRequired[targetLevel];
  return Math.max(0, needed - currentMarks);
}

/**
 * Check if persona can perform an action requiring specific marks
 *
 * @param matrixState - Current matrix state
 * @param targetId - Target of the action
 * @param requiredMarks - Marks required
 * @returns Object with canPerform flag and helpful message
 */
export function checkActionMarks(
  matrixState: MatrixState,
  targetId: string,
  requiredMarks: number
): { canPerform: boolean; currentMarks: number; message: string } {
  const current = getMarksOnTarget(matrixState, targetId);
  const canPerform = current >= requiredMarks;

  if (canPerform) {
    return {
      canPerform: true,
      currentMarks: current,
      message: `Sufficient marks: ${current}/${requiredMarks}`,
    };
  }

  const needed = requiredMarks - current;
  return {
    canPerform: false,
    currentMarks: current,
    message: `Need ${needed} more mark(s). Current: ${current}/${requiredMarks}`,
  };
}
